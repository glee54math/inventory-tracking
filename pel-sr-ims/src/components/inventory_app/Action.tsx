import type { MovementType, Student, SubmittedAction, Subject } from "../../utils/types";
import { SUBJECTS, MOVEMENTS, SUBSECTIONS } from "../../utils/types";
import dataMath from "../../assets/dataMath.json";
import dataEnglish from "../../assets/data.json";
import { loadInventory, loadStudentsFromDB, loadInventoryFlags, toggleInventoryFlag } from "../../utils/inventoryService";
import { predictForSubject, getActiveSubjects, type PredictionChip, type SubjectPrediction } from "../../utils/homeworkPrediction";
import { useEffect, useState } from "react";
import { NewStudentForm } from "./NewStudent";

interface ActionProps {
  index: number;
  data: SubmittedAction;
  onChange: (updatedAction: SubmittedAction) => void;
}

function Action({ index, data, onChange }: ActionProps) {
  const updateField = (field: keyof SubmittedAction, value: any) => {
    onChange({ ...data, [field]: value });
  };
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student>({} as Student);
  const [newStudentFormPopUp, setNewStudentFormPopUp] = useState<boolean>(false);
  const [subjectPredictions, setSubjectPredictions] = useState<SubjectPrediction[]>([]);
  const [backInventoryValues, setBackInventoryValues] = useState<Record<string, Record<string,number>[]>>({});
  const [frontInventoryValues, setFrontInventoryValues] = useState<Record<string, Record<string,number>[]>>({});

  // Flags: { [range]: boolean } for each side
  const [backFlags, setBackFlags] = useState<Record<string, boolean>>({});
  const [frontFlags, setFrontFlags] = useState<Record<string, boolean>>({});
  // Tracks which flags are currently being saved to Firebase
  const [togglingFlags, setTogglingFlags] = useState<Set<string>>(new Set());

  useEffect(() => {
    const getStudents = async () => {
      setAllStudents(await loadStudentsFromDB("san-ramon"));
    };
    getStudents();
  }, []);

  // Once a student is picked (via either student selector), compute their suggested
  // assignments for BOTH subjects — not just the ones listed in subjects_startDate_Map.
  // That field is enrollment metadata and isn't always kept in sync; hwkAssigned (what
  // predictForSubject actually reads) is the real source of truth, so a student can have
  // genuine Math history worth predicting from even if Math isn't listed there. The map is
  // only used below to decide the auto-select/shortcut-chip behavior, not to gate which
  // subjects get a prediction at all.
  useEffect(() => {
    if (!selectedStudent?.firstName) {
      setSubjectPredictions([]);
      return;
    }

    const activeSubjects = getActiveSubjects(selectedStudent);
    const predictions = SUBJECTS
      .map((subject) => predictForSubject(selectedStudent, subject))
      .filter((p): p is SubjectPrediction => p !== null);
    setSubjectPredictions(predictions);

    if (activeSubjects.length === 1 && !data.subject) {
      const onlySubject = activeSubjects[0];
      const prediction = predictions.find((p) => p.subject === onlySubject);
      onChange({
        ...data,
        toStudent: selectedStudent,
        subject: onlySubject,
        level: prediction?.level ?? data.level,
        selectedSubsections: [],
        movementMap: {},
        movementNumOfCopiesMap: {},
      });
    }
    // Only re-run when the selected student actually changes, not on every data/onChange change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudent?.firstName, selectedStudent?.lastName]);

  // Auto-load inventory values and flags whenever subject + level are both set.
  // This ensures auto-created actions (from cell edits) show B/F values and flags
  // without requiring the user to manually change the level dropdown.
  useEffect(() => {
    if (data.subject && data.level) {
      toggleFrontBackInvValues(data.subject, data.level);
    }
  }, [data.subject, data.level]);

  const toggleFrontBackInvValues = async (subject: string, level: string) => {
    const subjectLower = subject.toLowerCase();
    const [back, front, backFlagData, frontFlagData] = await Promise.all([
      loadInventory(`${subjectLower}_back`),
      loadInventory(`${subjectLower}_front`),
      loadInventoryFlags(`${subjectLower}_back`),
      loadInventoryFlags(`${subjectLower}_front`),
    ]);

    setBackInventoryValues(back);
    setFrontInventoryValues(front);

    // Load flags for the selected level only
    setBackFlags(backFlagData[level] ?? {});
    setFrontFlags(frontFlagData[level] ?? {});

    console.log("Loaded inventory for", subject, level);
  }

  const handleFlagToggle = async (side: "back" | "front", range: string) => {
    if (!data.subject || !data.level) return;

    const flagKey = `${side}-${range}`;
    if (togglingFlags.has(flagKey)) return; // already in progress

    setTogglingFlags((prev) => new Set(prev).add(flagKey));

    try {
      const subject_location = `${data.subject.toLowerCase()}_${side}`;
      const newState = await toggleInventoryFlag(subject_location, data.level, range);

      if (side === "back") {
        setBackFlags((prev) => ({ ...prev, [range]: newState }));
      } else {
        setFrontFlags((prev) => ({ ...prev, [range]: newState }));
      }
    } catch (err) {
      console.error("Failed to toggle flag:", err);
    } finally {
      setTogglingFlags((prev) => {
        const next = new Set(prev);
        next.delete(flagKey);
        return next;
      });
    }
  };

  const toggleSubsection = (range: string) => {
    const isSelected = data.selectedSubsections.includes(range);
    const updated = isSelected
      ? data.selectedSubsections.filter((r) => r !== range)
      : [...data.selectedSubsections, range];

    const newMovementMap = { ...data.movementMap };
    const newMovementNumOfCopiesMap = { ...data.movementNumOfCopiesMap };

    // If deselected, remove from the maps
    if (isSelected) {
      delete newMovementMap[range];
      delete newMovementNumOfCopiesMap[range];
    }

    onChange({
      ...data,
      selectedSubsections: updated,
      movementMap: newMovementMap,
      movementNumOfCopiesMap: newMovementNumOfCopiesMap,
    });
  };

  const selectAllSubsections = () => {
    updateField("selectedSubsections", [...SUBSECTIONS]);
  };

  const selectAllMovement = (movement: MovementType) => {
    const newMap: Record<string, MovementType> = {};
    data.selectedSubsections.forEach((range: string) => {
      newMap[range] = movement;
    });
    updateField("movementMap", { ...data.movementMap, ...newMap });
  };

  const selectAllNumberOfCopies = (numOfCopies: number) => {
    const newMap: Record<string, number> = {};
    data.selectedSubsections.forEach((range: string) => {
      newMap[range] = numOfCopies;
    });
    updateField("movementNumOfCopiesMap", {
      ...data.movementNumOfCopiesMap,
      ...newMap,
    });
  };

  const deSelectAllSubsections = () => {
    onChange({
      ...data,
      selectedSubsections: [],
      movementMap: {},
      movementNumOfCopiesMap: {},
    });
  };

  const handleSubjectChange = (newSubject: Subject | "") => {
    // Prefill the predicted level too (same source as the auto-select-single-subject path
    // and the subject-shortcut chips), so manually picking Subject still surfaces the
    // suggestion chips below instead of leaving Level blank for the worker to guess.
    const prediction =
      newSubject !== "" ? subjectPredictions.find((p) => p.subject === newSubject) : undefined;

    onChange({
      ...data,
      subject: newSubject === "" ? null : newSubject,
      level: prediction?.level ?? "",
      selectedSubsections: [],
      movementMap: {},
      movementNumOfCopiesMap: {},
    });
    setBackFlags({});
    setFrontFlags({});
  };

  const handleLevelChange = (newLevel: string) => {
    onChange({
      ...data,
      level: newLevel,
      selectedSubsections: [],
      movementMap: {},
      movementNumOfCopiesMap: {},
    });
    setBackFlags({});
    setFrontFlags({});
  };

  const handleToStudentChange = (studentName: string) => {
    // "Add New Student" opens the popup — it isn't an actual student to look up, so stop
    // here rather than falling through to a lookup that will never match and would wipe
    // out whatever student was already selected.
    if (studentName === "Add New Student") {
      setNewStudentFormPopUp(true);
      return;
    }

    if (studentName === "") {
      setSelectedStudent({} as Student);
      onChange({ ...data, toStudent: {} as Student });
      return;
    }

    // selectedStudent: ability to assign work to Student.
    const temp = (allStudents.filter((stud) => {
      return (stud.firstName + " " + stud.lastName) === studentName;
    }));
    if (temp.length === 0) return; // no match — leave the current selection untouched

    setSelectedStudent(temp[0]);  // should only have 1, given there isn't two students with the same name.
    onChange({
      ...data,
      toStudent: temp[0]
    })
  }

  // Applies a suggestion chip: fills subject/level/ranges/copies in one click, and defaults
  // movement to FrontToStudent for every range (same as the common manual choice) — still
  // fully editable afterward via the normal per-range movement dropdown below.
  const handleApplyChip = (subject: Subject, chip: PredictionChip) => {
    const movementMap: Record<string, MovementType> = {};
    const movementNumOfCopiesMap: Record<string, number> = {};
    chip.ranges.forEach((range) => {
      movementMap[range] = "FrontToStudent";
      movementNumOfCopiesMap[range] = chip.copiesByRange[range] ?? 1;
    });

    onChange({
      ...data,
      toStudent: selectedStudent,
      subject,
      level: chip.level,
      selectedSubsections: chip.ranges,
      movementMap,
      movementNumOfCopiesMap,
    });
  };

  // Helper: render a flag button for a given side and range
  const FlagButton = ({ side, range }: { side: "back" | "front"; range: string }) => {
    const isFlagged = side === "back" ? !!backFlags[range] : !!frontFlags[range];
    const isToggling = togglingFlags.has(`${side}-${range}`);

    return (
      <button
        type="button"
        title={isFlagged ? `Unflag ${side} inventory for ${range}` : `Flag ${side} inventory for ${range} as needing adjustment`}
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleFlagToggle(side, range); }}
        disabled={isToggling}
        className={`
          text-sm leading-none px-0.5 rounded transition-all
          ${isToggling ? "opacity-40 cursor-wait" : "cursor-pointer hover:scale-110"}
          ${isFlagged ? "" : "grayscale opacity-40 hover:opacity-70"}
        `}
      >
        🚩
      </button>
    );
  };

  return (
    <div>
      <form name="Action" className="flex items-start gap-1">
        <div className="flex items-start gap-1">
          {/* Optional accelerator: pick the student first to get suggested assignments
              below, instead of picking Subject/Level/ranges manually. Purely a shortcut —
              the "Select Student" dropdown further down still works for non-student
              movements (restocks, shipments) that don't need this. */}
          <div className="flex flex-col gap-1 mr-1">
            <select
              name="StudentFirst"
              id={`student-first-${index}`}
              value={
                selectedStudent?.firstName
                  ? selectedStudent.firstName + " " + selectedStudent.lastName
                  : ""
              }
              onChange={(e) => handleToStudentChange(e.target.value)}
              className="border px-1 py-1 rounded field-sizing-content"
              title="Pick a student first to get suggested assignments"
            >
              <option value="">Assign to student…</option>
              {allStudents.map((student: Student) => (
                <option
                  key={student.firstName + " " + student.lastName}
                  value={student.firstName + " " + student.lastName}
                >
                  {student.firstName + " " + student.lastName}
                </option>
              ))}
              <option key="add" value="Add New Student">Add New Student</option>
            </select>

            {/* Subject shortcuts: only needed when the student has 2+ active subjects
                (per subjects_startDate_Map) with history — a single active subject is
                auto-selected instead. Deliberately scoped to active subjects only, unlike
                the full 3-chip row below which works for any subject with real history. */}
            {!data.subject && selectedStudent?.firstName && (() => {
              const activeSubjects = getActiveSubjects(selectedStudent);
              const activePredictions = subjectPredictions.filter((p) =>
                activeSubjects.includes(p.subject)
              );
              if (activePredictions.length <= 1) return null;

              return (
                <div className="flex flex-col gap-1">
                  {activePredictions.map((prediction) => {
                    const chip =
                      prediction.chips.find((c) => c.key === "advance") ?? prediction.chips[0];
                    return (
                      <button
                        key={prediction.subject}
                        type="button"
                        onClick={() => handleApplyChip(prediction.subject, chip)}
                        className="text-xs border rounded-full px-2 py-1 bg-blue-50 hover:bg-blue-100 text-left"
                      >
                        {prediction.subject} — {chip.label}
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          <div className="flex flex-col item-start gap-1">
            <select
              name="Subject"
              id={`subject-${index}`}
              value={data.subject ?? ""}
              onChange={(e) =>
                handleSubjectChange(e.target.value as Subject | "")
              }
              className="border px-1 py-1 rounded field-sizing-content"
            >
              <option value="">Select Subject</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            
            {/* Student to assign to if option selected */}
            {data.selectedSubsections.length != 0 &&
             (Object.values(data.movementMap).includes("BackToStudent") || Object.values(data.movementMap).includes("FrontToStudent") || Object.values(data.movementMap).includes("ShipmentToStudent")) &&
             (Object.values(data.movementNumOfCopiesMap).some(value => value != 0)) && (
              <select
                name="Student"
                id={`subject-${index}`}
                value={
                  data.toStudent?.firstName && data.toStudent?.lastName !== undefined
                    ? data.toStudent.firstName + " " + data.toStudent.lastName
                    : data.toStudent?.firstName
                    ? data.toStudent.firstName
                    : ""
                }
                onChange={(e) =>
                  handleToStudentChange(e.target.value)
                }
                className="border px-1 py-1 rounded field-sizing-content"
              >
                <option key="" value="">Select Student</option>
                {allStudents.map((student: Student) => (
                  <option
                    key={student.firstName + " " + student.lastName} 
                    value={student.firstName + " " + student.lastName}
                  >
                    {student.firstName + " " + student.lastName}
                  </option>
                ))}
                <option key="add" value="Add New Student">Add New Student</option>
              </select>
            )}
          </div>

          {/* PopUp */}
          {newStudentFormPopUp &&
            <div className="fixed inset-0 flex justify-center items-center"> 
              <NewStudentForm onClose={() => setNewStudentFormPopUp(false)} />
            </div>
          }

          {/* Subject Level and Inventory Values  */}
          <div className="flex flex-col item-start gap-1">
            {/* Math Level */}
            {data.subject === "Math" && (
              <select
                name="math-Level"
                id={`math-level-${index}`}
                value={data.level}
                onChange={(e) => {
                  handleLevelChange(e.target.value)
                  toggleFrontBackInvValues("math", e.target.value)
                }}
                className="border px-1 py-1 rounded field-sizing-content"
              >
                <option value="">Select Level</option>
                {Object.keys(dataMath).map((level: string) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            )}

            {/* English Level */}
            {data.subject === "English" && (
              <select
                name="english-level"
                id={`english-level-${index}`}
                value={data.level}
                onChange={(e) => {
                  handleLevelChange(e.target.value)
                  toggleFrontBackInvValues("english", e.target.value)
                }}
                className="border px-1 py-1 rounded field-sizing-content"
              >
                <option value="">Select Level</option>
                {Object.keys(dataEnglish).map((level: string) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Suggested assignment chips, computed from this student's hwkHistory for the
              current subject+level. Purely a prefill — clicking one just checks the
              matching range boxes below and fills movement/copies; nothing here is final
              until the worker submits. */}
          {data.subject && data.level && (() => {
            const prediction = subjectPredictions.find(
              (p) => p.subject === data.subject && p.level === data.level
            );
            if (!prediction) return null;

            return (
              <div className="flex flex-col gap-1 border rounded p-2 bg-gray-50 max-w-48">
                <span className="text-xs text-gray-500">Suggested:</span>
                {prediction.chips.map((chip) => {
                  const isApplied =
                    chip.level === data.level &&
                    chip.ranges.length === data.selectedSubsections.length &&
                    chip.ranges.every((r) => data.selectedSubsections.includes(r));
                  return (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => handleApplyChip(data.subject as Subject, chip)}
                      className={`text-xs border rounded-full px-2 py-1 text-left ${
                        isApplied
                          ? "bg-blue-100 border-blue-400"
                          : "bg-white hover:bg-blue-50"
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {/* Subsections */}
          {data.subject && data.level && (
            <div className="flex flex-col gap-2 border p-2 rounded max-h-90 overflow-y-auto">
              <label key="CheckAll" className="flex gap-2">
                <input
                  type="checkbox"
                  name={`check-all-${index}`}
                  id={`check-all-${index}`}
                  checked={
                    data.selectedSubsections.length === SUBSECTIONS.length
                  }
                  onChange={(e) =>
                    e.target.checked
                      ? selectAllSubsections()
                      : deSelectAllSubsections()
                  }
                />
                Select All
                <select
                  name={`check-all-movement-type-${index}`}
                  id={`check-all-movement-type-${index}`}
                  onChange={(e) => {
                    if (e.target.value) {
                      selectAllMovement(e.target.value as MovementType);
                    }
                  }}
                  className="border rounded"
                  value=""
                >
                  <option value="">Select Movement</option>
                  {MOVEMENTS.map((movement) => (
                    <option key={movement} value={movement}>
                      {movement}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  id={`select-all-number-of-copies-${index}`}
                  name={`select-all-number-of-copies-${index}`}
                  min="1"
                  placeholder="Number of Copies"
                  onChange={(e) => {
                    if (e.target.value) {
                      selectAllNumberOfCopies(parseInt(e.target.value));
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="border rounded"
                />
              </label>

              {/* Individual subsections */}
              {SUBSECTIONS.map((range) => (
                <label key={range} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`${range}-checkbox-${index}`}
                    id={`${range}-checkbox-${index}`}
                    value={range}
                    checked={data.selectedSubsections.includes(range)}
                    onChange={() => toggleSubsection(range)}
                  />
                  {range}

                  {data.selectedSubsections.includes(range) && (
                    <div className="flex flex-row whitespace-nowrap items-center">
                      {backInventoryValues[data.level] && frontInventoryValues[data.level] && (
                        <div className="flex items-center gap-0.5 text-xs m-1">
                          {/* Back flag — left of B value */}
                          <FlagButton side="back" range={range} />
                          <span>
                            {"B: " + (backInventoryValues[data.level][(Number(range.substring(0,range.indexOf("-")))-1)/10]?.count ?? 0)}
                          </span>
                          <span className="mx-1 text-gray-300">|</span>
                          <span>
                            {"F: " + (frontInventoryValues[data.level][(Number(range.substring(0,range.indexOf("-")))-1)/10]?.count ?? 0)}
                          </span>
                          {/* Front flag — right of F value */}
                          <FlagButton side="front" range={range} />
                        </div>
                      )}
                      <select
                        name={`${range}-movement-${index}`}
                        id={`${range}-movement-${index}`}
                        value={data.movementMap[range] ?? ""}
                        onChange={(e) => {
                          updateField("movementMap", {
                            ...data.movementMap,
                            [range]: e.target.value as MovementType,
                          });
                        }}
                        className="border rounded"
                      >
                        <option value="">Select Movement</option>
                        {MOVEMENTS.map((movement) => (
                          <option key={movement} value={movement}>
                            {movement}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {data.selectedSubsections.includes(range) && (
                    <input
                      type="number"
                      min="1"
                      id={`${range}-numOfCopies-${index}`}
                      name={`${range}-numOfCopies-${index}`}
                      value={data.movementNumOfCopiesMap[range] ?? ""}
                      placeholder="Number of Copies"
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        const parsed = parseInt(value, 10);
                        updateField("movementNumOfCopiesMap", {
                          ...data.movementNumOfCopiesMap,
                          [range]: isNaN(parsed) ? 0 : parsed,
                        });
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="border rounded background"
                    />
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default Action;