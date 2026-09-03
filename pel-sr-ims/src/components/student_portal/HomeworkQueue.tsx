import { useState } from "react";
import type { HomeworkAssignment } from "../../utils/types";
import { toDate } from "../../utils/progressService";

interface HomeworkQueueProps {
  hwkAssigned: (string | HomeworkAssignment)[];
}

interface NormalizedAssignment {
  assignment: string;
  dateAssigned: Date | null;
}

function normalize(items: (string | HomeworkAssignment)[]): NormalizedAssignment[] {
  return items
    .map((item) => {
      if (typeof item === "string") {
        return { assignment: item, dateAssigned: null };
      }
      return {
        assignment: item.assignment,
        dateAssigned: toDate(item.dateAssigned),
      };
    })
    // Most recent first; items without a date go to the end
    .sort((a, b) => {
      if (!a.dateAssigned && !b.dateAssigned) return 0;
      if (!a.dateAssigned) return 1;
      if (!b.dateAssigned) return -1;
      return b.dateAssigned.getTime() - a.dateAssigned.getTime();
    });
}

export default function HomeworkQueue({ hwkAssigned }: HomeworkQueueProps) {
  const items = normalize(hwkAssigned ?? []);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="w-full flex items-center justify-between !bg-transparent border-none p-0 cursor-pointer text-left"
      >
        <h3 className="text-base font-bold text-gray-800">
          Homework{" "}
          {items.length > 0 && (
            <span className="text-sm font-normal text-gray-400">
              ({items.length} item{items.length !== 1 ? "s" : ""})
            </span>
          )}
        </h3>
        <span className="text-gray-400 text-sm select-none">
          {collapsed ? "▶" : "▼"}
        </span>
      </button>

      {!collapsed && (
        <div className="mt-4">
          {items.length === 0 ? (
            <p className="text-gray-400 text-sm">No homework assigned.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-800">{item.assignment}</span>
                    {item.dateAssigned && (
                      <span className="ml-2 text-xs text-gray-400">
                        assigned {item.dateAssigned.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
