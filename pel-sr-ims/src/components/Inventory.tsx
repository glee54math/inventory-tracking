import { useActionContext } from "./ActionContext";
import type { Subsection, InventoryData } from "../utils/types";

interface InventoryProps {
  data: InventoryData;
  // location: "Front" | "Back";
  // subject: "Math" | "English";
}

function Inventory({ data }: InventoryProps) {
  // values, entries, keys
  const levels = Object.keys(data);
  const subsections: Subsection[] = Object.values(data)[0];

  const { submittedActions } = useActionContext();
  // [ array of Actions ]
  // { subject, level, selectedSubsections[], movementMap, movementNumOfCopiesMap }

  return (
    <div>
      <table className="p-2">
        <thead>
          <tr>
            <th className="border border-gray-400 px-2 py-1 text-left">
              Level
            </th>
            {subsections.map((section: Subsection) => (
              <th
                key={section.range}
                className="border border-gray-400 px-2 py-1 text-left"
              >
                {section.range}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {levels.sort().map((level: string) => (
            <tr
              key={level}
              className="border border-gray-400 px-2 py-1 text-center"
            >
              <td>{level}</td>
              {data[level].map(({ range, count }: Subsection) => (
                <td
                  key={range}
                  className={
                    count <= 1
                      ? "border border-gray-400 px-2 py-1 text-center bg-red-200"
                      : "border border-gray-400 px-2 py-1 text-center"
                  }
                >
                  {count}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {submittedActions.map((action, index) => (
        <pre key={index}>
          {action.subject}: {action.level}, {action.selectedSubsections}
          {action.movementMap[action.selectedSubsections[0]]}
          {action.movementNumOfCopiesMap[action.selectedSubsections[0]]}
        </pre>
      ))}
      {/* {level}
          {selectedSubsections}
          {movementMap[selectedSubsections[0]]}
          {movementNumOfCopiesMap[selectedSubsections[0]]} */}
    </div>
  );
}

export default Inventory;
