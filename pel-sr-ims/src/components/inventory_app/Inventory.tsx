import { useState, useEffect } from "react";
import type { Subsection, InventoryData } from "../../utils/types";

export interface CellEdit {
  inventoryName: string; // e.g. "Back Math", "Front English"
  level: string;
  range: string;
  delta: number; // positive = increase, negative = decrease
}

interface InventoryProps {
  data: InventoryData;
  inventoryName?: string;
  onCellEdit?: (edit: CellEdit) => void;
  resetKey?: number;
}

function Inventory({ data, inventoryName, onCellEdit, resetKey }: InventoryProps) {
  const levels = Object.keys(data);
  const subsections: Subsection[] = Object.values(data)[0] ?? [];

  // Track which cell is currently being edited: "level__range"
  const [editingCell, setEditingCell] = useState<string | null>(null);
  // Track the live input value while editing
  const [editValue, setEditValue] = useState<string>("");
  // Accumulated deltas per cell: "level__range" -> cumulative delta from the true original
  const [accumulatedDeltas, setAccumulatedDeltas] = useState<Record<string, number>>({});
  // True original values captured on first click, before any edits: "level__range" -> originalCount
  const [originalValues, setOriginalValues] = useState<Record<string, number>>({});

  // When parent signals a successful submission, clear all local edit state
  // so cells return to their normal color based on the fresh Firestore values.
  useEffect(() => {
    if (resetKey === undefined) return;
    setAccumulatedDeltas({});
    setOriginalValues({});
    setEditingCell(null);
  }, [resetKey]);

  const cellKey = (level: string, range: string) => `${level}__${range}`;

  const handleCellClick = (level: string, range: string, currentCount: number) => {
    if (!inventoryName || !onCellEdit) return;
    const key = cellKey(level, range);

    // On first-ever click, record the true original (Firestore value before any edits this session)
    if (!(key in originalValues)) {
      setOriginalValues((prev) => ({ ...prev, [key]: currentCount }));
    }

    // Open input showing the current "effective" value (Firestore count + accumulated delta)
    const accDelta = accumulatedDeltas[key] ?? 0;
    setEditingCell(key);
    setEditValue(String(currentCount + accDelta));
  };

  const handleBlur = (level: string, range: string, firestoreCount: number) => {
    const key = cellKey(level, range);
    const newValue = parseInt(editValue, 10);
    const trueOriginal = originalValues[key] ?? firestoreCount;
    const currentEffective = firestoreCount + (accumulatedDeltas[key] ?? 0);

    if (!isNaN(newValue) && newValue !== currentEffective) {
      // Delta from the true original (accumulating across multiple edits)
      const newAccumulated = newValue - trueOriginal;

      setAccumulatedDeltas((prev) => ({ ...prev, [key]: newAccumulated }));

      if (onCellEdit && inventoryName) {
        onCellEdit({
          inventoryName,
          level,
          range,
          delta: newAccumulated,
        });
      }
    }

    setEditingCell(null);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    level: string,
    range: string,
    firestoreCount: number
  ) => {
    if (e.key === "Enter") {
      handleBlur(level, range, firestoreCount);
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  const isEditable = !!inventoryName && !!onCellEdit;

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
            {levels.sort().map((level: string) => {
              // Check if any cell in this row has been edited
              const rowIsEdited = data[level].some(({ range }) => {
                const key = cellKey(level, range);
                return (accumulatedDeltas[key] ?? 0) !== 0;
              });

              return (
                <tr
                  key={level}
                  className={`border border-gray-400 px-2 py-1 text-center ${
                    rowIsEdited ? "bg-blue-50" : ""
                  }`}
                >
                  <td>{level}</td>
                  {data[level].map(({ range, count }: Subsection) => {
                    const key = cellKey(level, range);
                    const isEditing = editingCell === key;
                    const accDelta = accumulatedDeltas[key] ?? 0;
                    const cellIsEdited = accDelta !== 0;
                    const trueOriginal = originalValues[key] ?? count;
                    // What we display: Firestore value plus any accumulated delta
                    const displayCount = count + accDelta;

                    const baseCellColor = cellIsEdited
                      ? "bg-blue-200"
                      : count === 0
                      ? "bg-red-200"
                      : count < 4
                      ? "bg-yellow-200"
                      : "bg-green-200";

                    return (
                      <td
                        key={range}
                        className={`border border-gray-400 px-2 py-1 text-center ${baseCellColor} ${
                          isEditable ? "cursor-pointer" : ""
                        }`}
                        onClick={() =>
                          !isEditing && handleCellClick(level, range, count)
                        }
                        title={
                          cellIsEdited
                            ? `Original: ${trueOriginal} | Δ ${accDelta > 0 ? "+" : ""}${accDelta}`
                            : undefined
                        }
                      >
                        {isEditing ? (
                          <input
                            autoFocus
                            type="number"
                            min={0}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleBlur(level, range, count)}
                            onKeyDown={(e) =>
                              handleKeyDown(e, level, range, count)
                            }
                            className="w-12 text-center border border-blue-400 rounded bg-white focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          displayCount
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {isEditable && (
          <p className="text-xs text-gray-400 mt-1 italic">
            Click any cell to edit. Changes will be staged as Actions.
          </p>
        )}
      </div>
    </div>
  );
}

export default Inventory;