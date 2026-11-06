// MonthlyHoursReportModal.tsx
// Mr. Lee's printable report of every worker's total hours for a chosen month.

import { useMemo, useState } from "react";
import { MONTH_NAMES, formatMinutes, sumElapsedMinutes } from "../../utils/timesheetService";
import type { TimesheetEntry } from "../../utils/types";

interface WorkerTimesheetRecord {
  firstName: string;
  lastName: string;
  entries: TimesheetEntry[];
}

interface MonthlyHoursReportModalProps {
  records: WorkerTimesheetRecord[];
  onClose: () => void;
}

export default function MonthlyHoursReportModal({ records, onClose }: MonthlyHoursReportModalProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const rows = useMemo(() => {
    return records
      .map((record) => {
        const monthEntries = record.entries.filter(
          (entry) => entry.timeEntered.getFullYear() === year && entry.timeEntered.getMonth() === month
        );
        return {
          name: `${record.firstName} ${record.lastName}`,
          totalMinutes: sumElapsedMinutes(monthEntries),
          hasEntries: monthEntries.length > 0,
        };
      })
      .filter((row) => row.hasEntries);
  }, [records, year, month]);

  const grandTotalMinutes = rows.reduce((sum, row) => sum + row.totalMinutes, 0);

  const yearOptions = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:static print:bg-white">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto print:shadow-none print:max-h-none print:max-w-none">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <h2 className="text-xl font-bold">Monthly Hours Report</h2>
          <button onClick={onClose} className="px-2 py-1 !bg-gray-200 hover:!bg-gray-300 rounded text-sm">
            Close
          </button>
        </div>

        <div className="flex gap-2 mb-4 print:hidden">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
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
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={() => window.print()}
            className="px-3 py-1 !bg-blue-200 hover:!bg-blue-300 rounded text-sm font-semibold"
          >
            Print
          </button>
        </div>

        <h3 className="font-bold text-center mb-2">
          {MONTH_NAMES[month]} {year}
        </h3>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Worker</th>
              <th className="text-left p-2">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={2} className="p-2 text-center text-gray-500">
                  No entries for this month.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.name} className="border-b">
                <td className="p-2">{row.name}</td>
                <td className="p-2">{formatMinutes(row.totalMinutes)}</td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr className="font-semibold !bg-gray-50">
                <td className="p-2">Total</td>
                <td className="p-2">{formatMinutes(grandTotalMinutes)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
