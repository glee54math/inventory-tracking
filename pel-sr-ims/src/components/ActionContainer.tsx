import { useState } from "react";
import type { Student, SubmittedAction } from "../utils/types";
import Action from "./Action";
import {
  assignHWToStudent,
  updateInventoryFromActions,
  updateLogFromActions,
} from "../utils/inventoryService";
import { NewStudentForm } from "./NewStudent";

interface ActionContainerProps {
  workerName: string;
}

function ActionContainer({workerName}:ActionContainerProps) {
  const [actionList, setActionList] = useState<SubmittedAction[]>([]);
  const [newStudentFormPopUp, setNewStudentFormPopUp]= useState<boolean>(false);

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

  const handleActionChange = (
    index: number,
    updatedAction: SubmittedAction
  ) => {
    setActionList((prev) =>
      prev.map((action, i) => (i === index ? updatedAction : action))
    );
  };

  const removeAction = (index: number) => {
    setActionList((prev) => prev.filter((_, i) => i !== index));
  };

  const submitAllActions = async () => {
    // Filter out incomplete actions
    const completeActions = actionList.filter(
      (action) =>
        action.subject &&
        action.level &&
        action.selectedSubsections.length > 0 &&
        Object.keys(action.movementMap).length > 0 &&
        Object.keys(action.movementNumOfCopiesMap).length > 0
    );

    if (completeActions.length === 0) {
      return;
    }

    try {
      // Submit to database
      await updateInventoryFromActions(completeActions);
      await updateLogFromActions(workerName, completeActions);
      for (const action of completeActions) {
        // need to filter the actions that are back/frontToStudent
        const filteredToStudentHWPackets = action.selectedSubsections.filter((range) => {
          return action.movementMap[range].includes("ToStudent");
        });
        if (filteredToStudentHWPackets.length !== 0) {
          const studentHWPacketsToDatabase = filteredToStudentHWPackets.map((packet) => action.level + " " + packet);
          await assignHWToStudent(action.toStudent, studentHWPacketsToDatabase);
        }
      }

      // Clear the action list after successful submission
      setActionList([]);
    } catch (error) {
      console.error("Error submitting actions:", error);
    }
  };

  return (
    <div className="space-y-4 overflow-auto">
      <div className="mb-4">
        {actionList.length === 0 && (
          <p className="text-gray-500">
            No actions created yet. Click "Create New Action" to start.
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
            onChange={(updatedAction) =>
              handleActionChange(index, updatedAction)
            }
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
            onClick={submitAllActions}
            className="border outline-1 outline-green-500 rounded bg-green-200 px-4 py-2 hover:!bg-green-300"
          >
            Submit All Actions
          </button>
        )}

        {actionList.length > 0 && (
          <button
            onClick={() => setActionList([])}
            className="border outline-1 outline-red-500 rounded bg-red-200 px-4 py-2 hover:!bg-red-300"
          >
            Clear All
          </button>
        )}

        <button
          onClick={() => { setNewStudentFormPopUp(true)}}
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
    </div>
  );
}

export default ActionContainer;
