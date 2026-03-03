import { useState } from "react";
import { loadAllInventoryFlags, toggleInventoryFlag } from "../../utils/inventoryService";
import type { InventoryFlag } from "../../utils/inventoryService";

function FlaggedInventorySummary() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [flags, setFlags] = useState<InventoryFlag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [removingKey, setRemovingKey] = useState<string | null>(null);

  const flagKey = (f: InventoryFlag) =>
    `${f.subject.toLowerCase()}_${f.side.toLowerCase()}_${f.level}_${f.range}`;

  const handleOpen = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setLoading(true);
    setIsOpen(true);
    try {
      const allFlags = await loadAllInventoryFlags();
      // Sort: Subject → Level → Range → Side
      allFlags.sort((a, b) => {
        if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
        if (a.level !== b.level) return a.level.localeCompare(b.level);
        if (a.range !== b.range) return a.range.localeCompare(b.range);
        return a.side.localeCompare(b.side);
      });
      setFlags(allFlags);
    } catch (err) {
      console.error("Failed to load flagged inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnflag = async (flag: InventoryFlag) => {
    const key = flagKey(flag);
    setRemovingKey(key);
    try {
      const subject_location = `${flag.subject.toLowerCase()}_${flag.side.toLowerCase()}`;
      await toggleInventoryFlag(subject_location, flag.level, flag.range);
      setFlags((prev) => prev.filter((f) => flagKey(f) !== key));
    } catch (err) {
      console.error("Failed to remove flag:", err);
    } finally {
      setRemovingKey(null);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 border outline-1 outline-red-400 rounded bg-red-50 px-4 py-2 hover:bg-red-100 transition-colors"
      >
        <span>🚩</span>
        <span className="font-medium text-sm">
          {isOpen ? "Hide Flagged Inventory" : "Show Flagged Inventory"}
        </span>
        {flags.length > 0 && isOpen && (
          <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
            {flags.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-3 border rounded p-3 bg-white shadow-sm">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">
            Flagged Inventory — Needs Adjustment
          </h3>

          {loading ? (
            <p className="text-sm text-gray-400 italic">Loading flags...</p>
          ) : flags.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No inventory items are currently flagged.</p>
          ) : (
            <table className="text-sm w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-300 px-3 py-1.5">Subject</th>
                  <th className="border border-gray-300 px-3 py-1.5">Level</th>
                  <th className="border border-gray-300 px-3 py-1.5">Range</th>
                  <th className="border border-gray-300 px-3 py-1.5">Side</th>
                  <th className="border border-gray-300 px-3 py-1.5 text-center">Unflag</th>
                </tr>
              </thead>
              <tbody>
                {flags.map((flag) => {
                  const key = flagKey(flag);
                  const isRemoving = removingKey === key;
                  return (
                    <tr
                      key={key}
                      className={`transition-opacity ${isRemoving ? "opacity-30" : "hover:bg-red-50"}`}
                    >
                      <td className="border border-gray-200 px-3 py-1.5">{flag.subject}</td>
                      <td className="border border-gray-200 px-3 py-1.5 font-mono">{flag.level}</td>
                      <td className="border border-gray-200 px-3 py-1.5 font-mono">{flag.range}</td>
                      <td className="border border-gray-200 px-3 py-1.5">
                        <span
                          className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                            flag.side === "Back"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {flag.side}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-3 py-1.5 text-center">
                        <button
                          onClick={() => handleUnflag(flag)}
                          disabled={isRemoving}
                          title="Remove this flag"
                          className="text-xs text-gray-500 hover:text-red-600 disabled:cursor-wait transition-colors"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default FlaggedInventorySummary;