// MarkChecksSentModal.tsx
// Mr. Lee's bulk action: after writing checks for a month, marks the last timesheet
// entry of that month as "Check Sent" for every worker who worked that month.
// Workers with no entries that month are left alone.

import { useState } from "react";
import { MONTH_NAMES, markLastEntryCheckSentForMonth } from "../../utils/timesheetService";

interface WorkerRef {
  firstName: string;
  lastName: string;
}

interface MarkChecksSentModalProps {
  workers: WorkerRef[];
  onClose: () => void;
}

export default function MarkChecksSentModal({ workers, onClose }: MarkChecksSentModalProps) {
  // Default to last month — checks are typically written after the month has closed.
  const now = new Date();
  const defaultDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const [year, setYear] = useState(defaultDate.getFullYear());
  const [month, setMonth] = useState(defaultDate.getMonth());
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ marked: string[]; skipped: string[] } | null>(null);

  const yearOptions = [now.getFullYear() - 1, now.getFullYear()];

  const handleConfirm = async () => {
    setIsRunning(true);
    const marked: string[] = [];
    const skipped: string[] = [];

    for (const worker of workers) {
      const name = `${worker.firstName} ${worker.lastName}`;
      const didMark = await markLastEntryCheckSentForMonth(worker.firstName, worker.lastName, year, month);
      if (didMark) marked.push(name);
      else skipped.push(name);
    }

    setResult({ marked, skipped });
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Mark Checks Sent</h2>

        {!result ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              This marks the last time card entry of the selected month as "Check Sent" for every
              worker who has entries that month. Workers with no entries that month are skipped.
            </p>

            <div className="flex gap-2 mb-4">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
                disabled={isRunning}
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
                disabled={isRunning}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                disabled={isRunning}
                className="px-3 py-1.5 !bg-gray-200 hover:!bg-gray-300 rounded text-sm font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isRunning}
                className="px-3 py-1.5 !bg-green-300 hover:!bg-green-400 rounded text-sm font-semibold disabled:opacity-50"
              >
                {isRunning ? "Marking..." : `Mark ${MONTH_NAMES[month]} ${year} Sent`}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold mb-1">
              Marked {result.marked.length} worker{result.marked.length === 1 ? "" : "s"} as sent:
            </p>
            <p className="text-sm text-gray-700 mb-3">
              {result.marked.length > 0 ? result.marked.join(", ") : "None"}
            </p>
            {result.skipped.length > 0 && (
              <>
                <p className="text-sm font-semibold mb-1">Skipped (no entries that month):</p>
                <p className="text-sm text-gray-500 mb-3">{result.skipped.join(", ")}</p>
              </>
            )}
            <div className="flex justify-end">
              <button onClick={onClose} className="px-3 py-1.5 !bg-gray-200 hover:!bg-gray-300 rounded text-sm font-semibold">
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
