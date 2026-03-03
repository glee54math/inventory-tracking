import type { MovementType, Student, SubmittedAction } from "../../utils/types";
import dataMath from "../../assets/dataMath.json";
import dataEnglish from "../../assets/data.json";
import { loadInventory, loadStudentsFromDB, loadInventoryFlags, toggleInventoryFlag } from "../../utils/inventoryService";
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

  const subsections = [
    "1-10",
    "11-20",
    "21-30",
    "31-40",
    "41-50",
    "51-60",
    "61-70",
    "71-80",
    "81-90",
    "91-100",
    "101-110",
  ];

  const movements = [
    "BackToFront",
    "BackToStudent",
    "FrontToBack",
    "FrontToStudent",
    "ShipmentToBack",
    "ShipmentToFront",
  ];

  const selectAllSubsections = () => {
    updateField("selectedSubsections", [...subsections]);
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
      toStudent: {} as Student,
    });
  };

  const handleSubjectChange = (newSubject: "Math" | "English" | "") => {
    onChange({
      ...data,
      subject: newSubject === "" ? null : newSubject,
      level: "",
      selectedSubsections: [],
      movementMap: {},
      movementNumOfCopiesMap: {},
      toStudent: {} as Student,
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
      toStudent: {} as Student,
    });
    setBackFlags({});
    setFrontFlags({});
  };

  const handleToStudentChange = (studentName: string) => {
    // need to handle "Add New Student"
    if (studentName === "Add New Student") {
      setNewStudentFormPopUp(true);
    }

    // selectedStudent: ability to assign work to Student.
    const temp = (allStudents.filter((stud) => {
      return (stud.firstName + " " + stud.lastName) === studentName;
    }));
    setSelectedStudent(temp[0]);  // should only have 1, given there isn't two students with the same name.
    onChange({
      ...data,
      toStudent: temp[0]
    })
  }

  // Helper: render a flag button for a given side and range
  const FlagButton = ({ side, range }: { side: "back" | "front"; range: string }) => {
    const isFlagged = side === "back" ? !!backFlags[range] : !!frontFlags[range];
    const isToggling = togglingFlags.has(`${side}-${range}`);

    return (
      <button
        type="button"
        title={isFlagged ? `Unflag ${side} inventory for ${range}` : `Flag ${side} inventory for ${range} as needing adjustment`}
        onClick={() => handleFlagToggle(side, range)}
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
          <div className="flex flex-col item-start gap-1">
            <select
              name="Subject"
              id={`subject-${index}`}
              value={data.subject ?? ""}
              onChange={(e) =>
                handleSubjectChange(e.target.value as "Math" | "English" | "")
              }
              className="border px-1 py-1 rounded field-sizing-content"
            >
              <option value="">Select Subject</option>
              <option value="Math">Math</option>
              <option value="English">English</option>
            </select>
            
            {/* Student to assign to if option selected */}
            {data.selectedSubsections.length != 0 && 
             (Object.values(data.movementMap).includes("BackToStudent") || Object.values(data.movementMap).includes("FrontToStudent")) && 
             (Object.values(data.movementNumOfCopiesMap).some(value => value != 0)) && (
              <select
                name="Student"
                id={`subject-${index}`}
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
          
          {/* Subsections */}
          {data.subject && data.level && (
            <div className="flex flex-col gap-2 border p-2 rounded max-h-90 overflow-y-auto">
              <label key="CheckAll" className="flex gap-2">
                <input
                  type="checkbox"
                  name={`check-all-${index}`}
                  id={`check-all-${index}`}
                  checked={
                    data.selectedSubsections.length === subsections.length
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
                  {movements.map((movement) => (
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
              {subsections.map((range) => (
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
                        {movements.map((movement) => (
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