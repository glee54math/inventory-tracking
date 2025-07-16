// import { useState } from "react";
// import { useActionContext } from "./ActionContext";
import type { Subsection, InventoryData } from "../utils/types";

interface InventoryProps {
  data: InventoryData;
}

function Inventory({ data }: InventoryProps) {
  // values, entries, keys
  const levels = Object.keys(data);
  const subsections: Subsection[] = Object.values(data)[0];

  return (
    <div>
      <div className="mb-4">
        <table className="p-2">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1 text-left">
                Level
              </th>
              {subsections.map((section: Subsection) => (
                <th
                  key={section.range}
                  className="border border-gray-400 px-2 py-1 text-left relative h-20 w-16"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="transform -rotate-45 whitespace-nowrap text-sm">
                      {section.range}
                    </span>
                  </div>
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
                      count === 0
                        ? "border border-gray-400 px-2 py-1 text-center bg-red-200"
                        : count < 4
                        ? "border border-gray-400 px-2 py-1 text-center bg-yellow-200"
                        : "border border-gray-400 px-2 py-1 text-center bg-green-200"
                    }
                  >
                    {count}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
