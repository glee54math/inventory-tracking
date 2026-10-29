import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PLANNING_CATEGORIES } from "../../utils/types";
import type { PlanningCategory } from "../../utils/types";
import { usePlanningResearch } from "../../hooks/usePlanningResearch";
import PlanningItemRow from "./PlanningItemRow";

export default function PlanningAndResearch() {
  const navigate = useNavigate();
  const { items, addItem, toggleComplete, deleteItem } = usePlanningResearch();
  const [showCompleted, setShowCompleted] = useState<Record<PlanningCategory, boolean>>(
    { "Physical Center": false, "Inventory": false, "Math Website App Development": false, "Math Lab": false }
  );
  const [drafts, setDrafts] = useState<Record<PlanningCategory, { text: string; notes: string }>>(
    {
      "Physical Center": { text: "", notes: "" },
      "Inventory": { text: "", notes: "" },
      "Math Website App Development": { text: "", notes: "" },
      "Math Lab": { text: "", notes: "" },
    }
  );

  const handleAdd = (category: PlanningCategory) => {
    const draft = drafts[category];
    if (!draft.text.trim()) return;
    addItem(category, draft.text.trim(), draft.notes.trim() || undefined);
    setDrafts((prev) => ({ ...prev, [category]: { text: "", notes: "" } }));
  };

  // The category with the most items drives the page's scroll height. The
  // other (shorter) columns are made sticky so they stay in view as you
  // scroll through the longest one, instead of ending early and leaving a
  // blank gap beneath them. The longest column is left in normal flow so
  // scrolling can actually reveal the rest of its content.
  const countsByCategory = Object.fromEntries(
    PLANNING_CATEGORIES.map((category) => [
      category,
      items.filter((item) => item.category === category).length,
    ])
  ) as Record<PlanningCategory, number>;
  const maxCount = Math.max(...Object.values(countsByCategory));

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-3xl font-bold">Planning and Research</h1>
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1.5 text-sm border rounded border-gray-400 text-gray-700 hover:!bg-gray-200"
        >
          ← Back
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {PLANNING_CATEGORIES.map((category) => {
          const categoryItems = items.filter((item) => item.category === category);
          const activeItems = categoryItems.filter((item) => !item.completed);
          const completedItems = categoryItems.filter((item) => item.completed);
          const draft = drafts[category];
          const isLongestColumn = countsByCategory[category] >= maxCount && maxCount > 0;

          return (
            <div
              key={category}
              className={`bg-white p-4 rounded shadow flex flex-col ${isLongestColumn ? "" : "sticky top-0"}`}
            >
              <h2 className="text-lg font-semibold mb-3">{category}</h2>

              {/* Active items */}
              <div>
                {activeItems.length === 0 && (
                  <p className="text-sm text-gray-400 italic mb-2">Nothing on the list yet.</p>
                )}
                {activeItems.map((item) => (
                  <PlanningItemRow key={item.id} item={item} onToggle={toggleComplete} onDelete={deleteItem} />
                ))}
              </div>

              {/* Add item form */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <input
                  type="text"
                  value={draft.text}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, [category]: { ...prev[category], text: e.target.value } }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd(category);
                  }}
                  placeholder="New item..."
                  className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <textarea
                  value={draft.notes}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, [category]: { ...prev[category], notes: e.target.value } }))
                  }
                  placeholder="Notes (optional)..."
                  rows={2}
                  className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => handleAdd(category)}
                  className="w-full py-1.5 text-sm bg-green-100 hover:!bg-green-200 text-green-800 border border-green-300 rounded"
                >
                  Add
                </button>
              </div>

              {/* Completed / archive disclosure */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() =>
                    setShowCompleted((prev) => ({ ...prev, [category]: !prev[category] }))
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showCompleted[category] ? "▾" : "▸"} Completed ({completedItems.length})
                </button>
                {showCompleted[category] && (
                  <div className="mt-2">
                    {completedItems.length === 0 && (
                      <p className="text-sm text-gray-400 italic">Nothing completed yet.</p>
                    )}
                    {completedItems.map((item) => (
                      <PlanningItemRow key={item.id} item={item} onToggle={toggleComplete} onDelete={deleteItem} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
