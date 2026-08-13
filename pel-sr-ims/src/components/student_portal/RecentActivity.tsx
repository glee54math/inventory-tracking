import type { HomeworkHistoryEntry } from "../../utils/types";
import { toDate } from "../../utils/progressService";

interface RecentActivityProps {
  hwkHistory: HomeworkHistoryEntry[];
}

export default function RecentActivity({ hwkHistory }: RecentActivityProps) {
  const entries = (hwkHistory ?? [])
    .map((h) => ({ ...h, dateAssigned: toDate(h.dateAssigned) }))
    .sort((a, b) => b.dateAssigned.getTime() - a.dateAssigned.getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-base font-bold text-gray-800 mb-4">Recent Activity</h3>

      {entries.length === 0 ? (
        <p className="text-gray-400 text-sm">No recent activity.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    entry.subject === "Math" ? "bg-blue-500" : "bg-green-500"
                  }`}
                />
                <span className="font-semibold text-gray-800">{entry.level}</span>
                <span className="text-gray-500">{entry.range}</span>
              </div>
              <span className="text-gray-400 text-xs">
                {entry.dateAssigned.toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
