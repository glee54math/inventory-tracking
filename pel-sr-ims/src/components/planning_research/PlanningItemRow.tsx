import { useState } from "react";
import type { PlanningItem } from "../../utils/types";

interface PlanningItemRowProps {
  item: PlanningItem;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function PlanningItemRow({ item, onToggle, onDelete }: PlanningItemRowProps) {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="mb-2 p-2 bg-white border border-gray-200 rounded">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(item.id, !item.completed)}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
        />
        <div className="flex-1">
          <button
            type="button"
            onClick={() => item.notes && setNotesOpen((open) => !open)}
            className={`text-left w-full ${item.completed ? "line-through text-gray-400" : "text-gray-900"}`}
          >
            {item.text}
            {item.notes && (
              <span className="ml-1 text-xs text-blue-500">{notesOpen ? "▾" : "▸"}</span>
            )}
          </button>
          {notesOpen && item.notes && (
            <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{item.notes}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete "${item.text}"? This cannot be undone.`)) {
              onDelete(item.id);
            }
          }}
          title="Delete permanently"
          className="text-gray-400 hover:!text-red-500 text-sm shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
