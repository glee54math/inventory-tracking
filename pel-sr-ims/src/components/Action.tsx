import type { MovementType, SubmittedAction } from "../utils/types";
import dataMath from "../assets/dataMath.json";
import dataEnglish from "../assets/data.json";

interface ActionProps {
  index: number;
  data: SubmittedAction;
  onChange: (updatedAction: SubmittedAction) => void;
}

function Action({ index, data, onChange }: ActionProps) {
  const updateField = (field: keyof SubmittedAction, value: any) => {
    onChange({ ...data, [field]: value });
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
    });
  };

  const handleLevelChange = (newLevel: string) => {
    onChange({
      ...data,
      level: newLevel,
      selectedSubsections: [],
      movementMap: {},
      movementNumOfCopiesMap: {},
    });
  };

  return (
    <div>
      <form name="Action" className="flex items-start gap-1">
        <div className="flex items-start gap-1">
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

          {/* Math Level */}
          {data.subject === "Math" && (
            <select
              name="math-Level"
              id={`math-level-${index}`}
              value={data.level}
              onChange={(e) => handleLevelChange(e.target.value)}
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
              onChange={(e) => handleLevelChange(e.target.value)}
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
