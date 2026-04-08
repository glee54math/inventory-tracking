import { useState, useEffect } from "react";
import type { Student, SubmittedAction } from "../../utils/types";
import Action from "./Action";
import {
  assignHWToStudent,
  updateInventoryFromActions,
  updateLogFromActions,
} from "../../utils/inventoryService";
import { NewStudentForm } from "./NewStudent";
import SubmissionConfirmModal from "./submissionConfirmModal";
import WorkerSwitchModal from "./WorkerSwitchModal";
import { useNameContext } from "./NameContext";
import type { CellEdit } from "./Inventory";

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Parse an inventory display name like "Back Math" or "Front English" into
 * { subject: "Math" | "English", side: "Back" | "Front" }
 */
function parseInventoryName(
  inventoryName: string
): { subject: "Math" | "English"; side: "Back" | "Front" } | null {
  const lower = inventoryName.toLowerCase();
  const subject = lower.includes("math")
    ? "Math"
    : lower.includes("english")
    ? "English"
    : null;
  const side = lower.includes("back")
    ? "Back"
    : lower.includes("front")
    ? "Front"
    : null;

  if (!subject || !side) return null;
  return { subject: subject as "Math" | "English", side: side as "Back" | "Front" };
}

/**
 * Given a side and direction of change, determine the movement type.
 * delta > 0 → shipment in; delta < 0 → out to dummy student
 */
function movementTypeFromEdit(
  side: "Back" | "Front",
  delta: number
): string {
  if (delta > 0) {
    return side === "Back" ? "ShipmentToBack" : "ShipmentToFront";
  } else {
    return side === "Back" ? "BackToStudent" : "FrontToStudent";
  }
}

const DUMMY_STUDENT: Student = {
  firstName: "ATestStud",
  lastName: "",
} as Student;

// ─── Component ───────────────────────────────────────────────────────────────

interface ActionContainerProps {
  workerName: string;
  pendingCellEdits?: CellEdit[];
  onCellEditsConsumed?: () => void;
  onSubmitSuccess?: () => void;
}

function ActionContainer({
  workerName,
  pendingCellEdits = [],
  onCellEditsConsumed,
  onSubmitSuccess,
}: ActionContainerProps) {
  const [actionList, setActionList] = useState<SubmittedAction[]>([]);
  const [newStudentFormPopUp, setNewStudentFormPopUp] = useState<boolean>(false);
  const [showSubmissionConfirm, setShowSubmissionConfirm] = useState<boolean>(false);
  const [showWorkerSwitch, setShowWorkerSwitch] = useState<boolean>(false);
  const [pendingSubmission, setPendingSubmission] = useState<boolean>(false);

  const { setNameOfWorker } = useNameContext();

  // ── Merge incoming cell edits into the action list ───────────────────────
  useEffect(() => {
    if (!pendingCellEdits || pendingCellEdits.length === 0) return;

    setActionList((prevList) => {
      let updated = [...prevList];

      for (const edit of pendingCellEdits) {
        const parsed = parseInventoryName(edit.inventoryName);
        if (!parsed) continue;

        const { subject, side } = parsed;
        const netDelta = edit.delta;

        if (netDelta === 0) {
          // Net zero — remove this range from any matching action
          updated = updated
            .map((action) => {
              if (action.subject !== subject || action.level !== edit.level)
                return action;
              const newSubsections = action.selectedSubsections.filter(
                (r) => r !== edit.range
              );
              const newMovementMap = { ...action.movementMap };
              const newCopiesMap = { ...action.movementNumOfCopiesMap };
              delete newMovementMap[edit.range];
              delete newCopiesMap[edit.range];
              return {
                ...action,
                selectedSubsections: newSubsections,
                movementMap: newMovementMap,
                movementNumOfCopiesMap: newCopiesMap,
              };
            })
            .filter((a) => a.selectedSubsections.length > 0);
          continue;
        }

        const movement = movementTypeFromEdit(side, netDelta);
        const absDelta = Math.abs(netDelta);

        // Helper: determine which side ("Back" | "Front") an action's movements
        // belong to, based on its existing movement types.
        const actionSide = (action: SubmittedAction): "Back" | "Front" | "mixed" => {
          const movements = Object.values(action.movementMap);
          if (movements.length === 0) return side; // empty action — treat as same side
          const isBack = movements.every(
            (m) => m === "BackToFront" || m === "BackToStudent" || m === "ShipmentToBack"
          );
          const isFront = movements.every(
            (m) => m === "FrontToBack" || m === "FrontToStudent" || m === "ShipmentToFront"
          );
          if (isBack) return "Back";
          if (isFront) return "Front";
          return "mixed";
        };

        // Merge into an existing action only when it shares subject + level AND
        // was created from the same inventory side (Back vs Front). This prevents
        // a Back-inventory edit from overwriting a Front-inventory edit for the
        // same level + range — those must stay as separate actions.
        const existingIndex = updated.findIndex(
          (action) =>
            action.subject === subject &&
            action.level === edit.level &&
            actionSide(action) === side
        );

        if (existingIndex !== -1) {
          const existing = updated[existingIndex];
          const newSubsections = existing.selectedSubsections.includes(edit.range)
            ? existing.selectedSubsections
            : [...existing.selectedSubsections, edit.range];

          // Keep DUMMY_STUDENT if any range (existing or incoming) is ToStudent
          const needsDummy =
            movement.includes("ToStudent") ||
            existing.selectedSubsections.some((r) =>
              existing.movementMap[r]?.includes("ToStudent")
            );

          updated[existingIndex] = {
            ...existing,
            selectedSubsections: newSubsections,
            movementMap: {
              ...existing.movementMap,
              [edit.range]: movement,
            },
            movementNumOfCopiesMap: {
              ...existing.movementNumOfCopiesMap,
              [edit.range]: absDelta,
            },
            toStudent: needsDummy ? DUMMY_STUDENT : existing.toStudent,
          };
        } else {
          // No same-side action yet for this subject + level — create one
          const newAction: SubmittedAction = {
            subject: subject,
            level: edit.level,
            movementMap: { [edit.range]: movement },
            movementNumOfCopiesMap: { [edit.range]: absDelta },
            selectedSubsections: [edit.range],
            toStudent: movement.includes("ToStudent")
              ? DUMMY_STUDENT
              : ({} as Student),
          };
          updated = [...updated, newAction];
        }
      }

      return updated;
    });

    onCellEditsConsumed?.();
  }, [pendingCellEdits]);

  // ─────────────────────────────────────────────────────────────────────────

  const createNewAction = () => {
    const newAction: SubmittedAction = {
      subject: null,
      level: "",
      movementMap: {},
      movementNumOfCopiesMap: {},
      selectedSubsections: [],
      toStudent: {} as Student,
    };
    setActionList((prev) => [...prev, newAction]);
  };

  const handleActionChange = (index: number, updatedAction: SubmittedAction) => {
    setActionList((prev) =>
      prev.map((action, i) => (i === index ? updatedAction : action))
    );
  };

  const removeAction = (index: number) => {
    setActionList((prev) => prev.filter((_, i) => i !== index));
  };

  const checkForCompletedActions = () => {
    const completeActions = actionList.filter(
      (action) =>
        action.subject &&
        action.level &&
        action.selectedSubsections.length > 0 &&
        Object.keys(action.movementMap).length > 0 &&
        Object.values(action.movementMap).every(movement => movement !== "") &&
        Object.keys(action.movementNumOfCopiesMap).length > 0 &&
        Object.values(action.movementNumOfCopiesMap).every(numOfCopies => numOfCopies !== 0) &&
        Object.values(action.movementMap).some(movement => (
          // If assigning to student, it needs a student within the selection box.
          ((movement === "BackToStudent" || movement === "FrontToStudent") && (action.toStudent.firstName)) || 
          ((movement !== "BackToStudent" && movement !== "FrontToStudent"))
        ))
    );
    return completeActions;
  }

  const initiateSubmission = () => {
    const completeActions = checkForCompletedActions();
    if (completeActions.length === 0) return;
    setShowSubmissionConfirm(true);
  };

  const handleConfirmedSubmission = async () => {
    setShowSubmissionConfirm(false);
    setPendingSubmission(true);

    const completeActions = checkForCompletedActions();

    if (completeActions.length === 0) {
      setPendingSubmission(false);
      return;
    }

    try {
      await updateInventoryFromActions(completeActions);
      await updateLogFromActions(workerName, completeActions);

      for (const action of completeActions) {
        const filteredToStudentHWPackets = action.selectedSubsections.filter(
          (range) => action.movementMap[range].includes("ToStudent")
        );
        if (filteredToStudentHWPackets.length !== 0) {
          const studentHWPacketsToDatabase = filteredToStudentHWPackets.map(
            (packet) => (
              {
                assignment: action.level + " " + packet,
                dateAssigned: new Date(),
              }
            )
          );
          await assignHWToStudent(action.toStudent, studentHWPacketsToDatabase);
        }
      }

      setActionList([]);
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Error submitting actions:", error);
    } finally {
      setPendingSubmission(false);
    }
  };

  const handleWorkerSwitch = (newWorkerInitials: string) => {
    setNameOfWorker(newWorkerInitials);
    setShowWorkerSwitch(false);
    setTimeout(() => {
      handleConfirmedSubmission();
    }, 100);
  };

  const handleSwitchWorkerForSubmission = () => {
    setShowSubmissionConfirm(false);
    setShowWorkerSwitch(true);
  };

  const handleCancelSubmission = () => {
    setShowSubmissionConfirm(false);
    setPendingSubmission(false);
  };

  const handleCancelWorkerSwitch = () => {
    setShowWorkerSwitch(false);
    setPendingSubmission(false);
  };

  return (
    <div className="space-y-4 overflow-auto">
      <div className="mb-4">
        {actionList.length === 0 && (
          <p className="text-gray-500">
            No actions created yet. Click "Create New Action" to start, or edit
            a cell in an Inventory table to auto-generate one.
          </p>
        )}
      </div>

      {actionList.map((action, index) => (
        <div key={index} className="flex items-start gap-2">
          <button
            onClick={() => removeAction(index)}
            className="ml-2 mr-1 text-black-500 border outline-1 outline-red-500 rounded hover:!bg-red-100"
          >
            X
          </button>
          <Action
            index={index}
            data={action}
            onChange={(updatedAction) => handleActionChange(index, updatedAction)}
          />
        </div>
      ))}

      <div className="flex gap-4 p-4 border-t">
        <button
          onClick={createNewAction}
          className="border outline-1 outline-blue-500 rounded bg-blue-200 px-4 py-2 hover:!bg-blue-300"
        >
          Create New Action
        </button>

        {actionList.length > 0 && (
          <button
            onClick={initiateSubmission}
            disabled={pendingSubmission || (checkForCompletedActions().length !== actionList.length)}
            className="border outline-1 outline-green-500 rounded bg-green-200 px-4 py-2 hover:!bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pendingSubmission ? "Submitting..." : "Submit All Actions"}
          </button>
        )}

        {actionList.length > 0 && (
          <button
            onClick={() => setActionList([])}
            disabled={pendingSubmission}
            className="border outline-1 outline-red-500 rounded bg-red-200 px-4 py-2 hover:!bg-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
        )}

        <button
          onClick={() => setNewStudentFormPopUp(true)}
          className="border outline-1 outline-purple-500 rounded bg-purple-200 px-4 py-2 hover:!bg-purple-300"
        >
          Add New Student
        </button>

        {newStudentFormPopUp && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <NewStudentForm onClose={() => setNewStudentFormPopUp(false)} />
          </div>
        )}
      </div>

      {showSubmissionConfirm && (
        <SubmissionConfirmModal
          currentWorker={workerName}
          onConfirm={handleConfirmedSubmission}
          onSwitchWorker={handleSwitchWorkerForSubmission}
          onCancel={handleCancelSubmission}
        />
      )}

      {showWorkerSwitch && (
        <WorkerSwitchModal
          currentWorker={workerName}
          onWorkerSwitch={handleWorkerSwitch}
          onCancel={handleCancelWorkerSwitch}
        />
      )}
    </div>
  );
}

export default ActionContainer;