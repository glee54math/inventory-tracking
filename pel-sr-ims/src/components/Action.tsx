// import { useState } from "react";
import { useActionContext } from "./ActionContext";
import { updateInventoryFromActions } from "../utils/inventoryService";
import type { MovementType } from "../utils/types";

interface ActionProps {
  index: number;
}

function Action({ index }: ActionProps) {
  //   const [subject, setSubject] = useState<"Math" | "English" | null>(null);
  //   const [level, setLevel] = useState<string>("");
  //   const [selectedSubsections, setSelectedSubsections] = useState<string[]>([]);
  //   const [movementMap, setMovementMap] = useState<Record<string, MovementType>>(
  //     {}
  //   );
  //   const [movementNumOfCopiesMap, setMovementNumOfCopiesMap] = useState<
  //     Record<string, number>
  //   >({});

  const {
    subject,
    level,
    selectedSubsections,
    movementMap,
    movementNumOfCopiesMap,
    formSubmitted,
    submittedActions,
    setSubject,
    setLevel,
    setSelectedSubsections,
    setMovementMap,
    setMovementNumOfCopiesMap,
    setFormSubmitted,
    setSubmittedActions,
  } = useActionContext();

  const toggleSubsection = (range: string) => {
    setSelectedSubsections((prev) => {
      const isSelected = prev.includes(range);
      const updated = isSelected
        ? prev.filter((r) => r !== range)
        : [...prev, range];

      // If deselected, remove from the numOfCopies map
      if (isSelected) {
        setMovementNumOfCopiesMap((prevMap) => {
          const newMap = { ...prevMap };
          delete newMap[range];
          return newMap;
        });
        setMovementMap((prevMap) => {
          const newMap = { ...prevMap };
          delete newMap[range];
          return newMap;
        });
      }

      return updated;
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
    setSelectedSubsections([...subsections]);
  };
  const selectAllMovement = (movement: MovementType) => {
    const newMap: Record<string, MovementType> = {};
    subsections.forEach((range: string) => {
      newMap[range] = movement;
    });
    setMovementMap(newMap);
  };
  const selectAllNumberOfCopies = (numOfCopies: number) => {
    const newMap: Record<string, number> = {};
    subsections.forEach((range: string) => {
      newMap[range] = numOfCopies;
    });
    setMovementNumOfCopiesMap(newMap);
  };
  const deSelectAllSubsections = () => {
    setSelectedSubsections([]);
    setMovementMap({});
    setMovementNumOfCopiesMap({});
  };

  const submitForm = async () => {
    setFormSubmitted(true);
    const tempAction = {
      subject,
      level,
      selectedSubsections,
      movementMap,
      movementNumOfCopiesMap,
    };
    // await updateInventoryFromActions([tempAction]);
    setSubmittedActions((prev) => [...prev, tempAction]);

    // Reset
    setSubject(null);
    setLevel("");
    deSelectAllSubsections();
    // setFormSubmitted(false);
  };

  return (
    <div>
      <form name="Action" className="flex flex-row gap-1">
        <div className="flex flex-row gap-1">
          <select
            name="Subject"
            id="subject"
            value={subject ?? ""}
            onChange={(e) => {
              setSubject(e.target.value as "Math" | "English");
              setLevel("");
              setSelectedSubsections([]);
              setMovementMap({});
              setMovementNumOfCopiesMap({});
            }}
            className="border px-1 py-1 rounded field-sizing-content"
          >
            <option value="">Select Subject</option>
            <option value="Math">Math</option>
            <option value="English">English</option>
          </select>
          {/* if subject is Math */}
          {subject === "Math" && (
            <select
              name="math-Level"
              id="math-level"
              value={level ?? ""}
              onChange={(e) => {
                setLevel(e.target.value);
                setSelectedSubsections([]);
                setMovementMap({});
                setMovementNumOfCopiesMap({});
              }}
              className="border px-1 py-1 rounded field-sizing-content"
            >
              {/* print out Math Level Options, eventually will use map */}
              <option value={""}>Select Level</option>
              <option value={"MG1"}>MG1</option>
              <option value={"MG2"}>MG2</option>
              <option value={"MG3"}>MG3</option>
            </select>
          )}

          {/* if subject is English */}
          {subject === "English" && (
            <select
              name="english-level"
              id="english-level"
              value={level ?? ""}
              onChange={(e) => {
                setLevel(e.target.value);
                setSelectedSubsections([]);
                setMovementMap({});
                setMovementNumOfCopiesMap({});
              }}
              className="border px-1 py-1 rounded field-sizing-content"
            >
              {/* prints out English Level Options, eventually use map */}
              <option value={""}>Select Level</option>
              <option value={"EG1"}>EG1</option>
              <option value={"EG2"}>EG2</option>
              <option value={"EG3"}>EG3</option>
            </select>
          )}
          {/* Once a level is selected */}
          {/* Select All */}
          {subject && level && (
            <div className="flex flex-col gap-2 border p-2 rounded max-h-64 overflow-y-auto">
              <label key="CheckAll" id="checkAll" className="flex gap-2">
                <input
                  type="checkbox"
                  name="check-all"
                  id="check-all"
                  checked={selectedSubsections.length === subsections.length} // a cheap trick
                  onChange={(e) =>
                    e.target.checked
                      ? selectAllSubsections()
                      : deSelectAllSubsections()
                  }
                />
                Select All
                <select
                  name="check-all-movement-type"
                  id="check-all-movement-type"
                  onChange={(e) => {
                    const movement = e.target.value as MovementType;
                    selectAllMovement(movement);
                  }}
                  className="border rounded"
                >
                  <option value="">Select Movement</option>
                  {movements.map((movement: string) => (
                    <option key={movement} value={movement}>
                      {movement}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  id="select-all-number-of-copies"
                  name="select-all-number-of-copies"
                  min="1"
                  placeholder="Number of Copies"
                  onChange={(e) =>
                    selectAllNumberOfCopies(e.target.valueAsNumber)
                  }
                  onWheel={(e) => e.currentTarget.blur()}
                  className="border rounded"
                />
              </label>
              {/* Individual Selection */}
              {subsections.map((range: string) => (
                <label key={range} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`${range}-checkbox`}
                    id={`${range}-checkbox`}
                    value={range}
                    checked={selectedSubsections.includes(range)}
                    onChange={() => toggleSubsection(range)}
                  />
                  {range}
                  {/* Once ranges is selected, movement and # of copies show */}
                  {/* Movement */}
                  {selectedSubsections.includes(range) && (
                    <select
                      name={`${range}-movement`}
                      id={`${range}-movement`}
                      value={movementMap[range] ?? ""}
                      onChange={(e) =>
                        setMovementMap((prev) => ({
                          ...prev,
                          [range]: e.target.value as MovementType,
                        }))
                      }
                      className="border rounded"
                    >
                      <option value="">Select Movement</option>
                      {movements.map((movement: string) => (
                        <option key={movement} value={movement}>
                          {movement}
                        </option>
                      ))}
                    </select>
                  )}
                  {/* numOfCopies input box */}
                  {selectedSubsections.includes(range) && (
                    <input
                      type="number"
                      min="1"
                      id={`${range}-numOfCopies`}
                      name={`${range}-numOfCopies`}
                      value={movementNumOfCopiesMap[range] ?? ""}
                      placeholder="Number of Copies"
                      onChange={(e) =>
                        setMovementNumOfCopiesMap((prev) => ({
                          ...prev,
                          [range]: Number(e.target.value),
                        }))
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                      className="border rounded background"
                    ></input>
                  )}
                </label>
              ))}
            </div>
            // Create Context
            // After selecting M/E, Level,MovemenType, and numOfCopies, resize box
          )}
        </div>
      </form>
      {/* Submit Button */}
      {subject && level && selectedSubsections.length > 0 && (
        <button
          type="submit"
          name="Submit"
          disabled={
            Object.keys(movementMap).length == 0 &&
            Object.keys(movementNumOfCopiesMap).length == 0
          }
          onClick={() => submitForm()}
          className="border outline-1 outline-blue-500 rounded mt-1 bg-blue-200"
        >
          Submit
        </button>
      )}
    </div>
  );
}

export default Action;
