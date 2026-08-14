// TimesheetTable.tsx
// Shared year/month-collapsible timesheet table.
// - Personal view: pass onClockOut, the open shift's Time Exit cell becomes a "Clock Out" button.
// - Admin view: pass editable + onSaveEdit, every row gets an "Edit" button that lets
//   Mr. Lee correct times / Check Sent for that entry.

import { Fragment, useMemo, useState } from "react";
import {
  MONTH_NAMES,
  formatDateMMDDYY,
  formatElapsed,
  formatMinutes,
  groupEntriesByYearMonth,
  sumElapsedMinutes,
} from "../../utils/timesheetService";
import type { TimesheetEntry } from "../../utils/types";

interface TimesheetTableProps {
  entries: TimesheetEntry[];
  editable?: boolean;
  onClockOut?: (entry: TimesheetEntry) => Promise<void> | void;
  onSaveEdit?: (original: TimesheetEntry, updates: Partial<TimesheetEntry>) => Promise<void> | void;
}

function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const formatTime = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export default function TimesheetTable({ entries, editable = false, onClockOut, onSaveEdit }: TimesheetTableProps) {
  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [draftTimeEntered, setDraftTimeEntered] = useState<string>("");
  const [draftTimeExited, setDraftTimeExited] = useState<string>("");
  const [draftCheckSent, setDraftCheckSent] = useState<string>("");
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const groupedByYear = useMemo(() => groupEntriesByYearMonth(entries), [entries]);
  const columnCount = editable ? 6 : 5;

  const toggleCollapsed = (key: string) => {
    setCollapsedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const startEdit = (entry: TimesheetEntry) => {
    setEditingKey(entry.timeEntered.getTime());
    setDraftTimeEntered(toDatetimeLocalValue(entry.timeEntered));
    setDraftTimeExited(entry.timeExited ? toDatetimeLocalValue(entry.timeExited) : "");
    setDraftCheckSent(entry.checkSent === true ? "Yes" : entry.checkSent === false ? "No" : "");
  };

  const cancelEdit = () => setEditingKey(null);

  const saveEdit = async (entry: TimesheetEntry) => {
    if (!onSaveEdit || !draftTimeEntered) return;
    setIsBusy(true);
    try {
      const newTimeEntered = new Date(draftTimeEntered);
      const newTimeExited = draftTimeExited ? new Date(draftTimeExited) : null;
      await onSaveEdit(entry, {
        timeEntered: newTimeEntered,
        timeExited: newTimeExited,
        checkSent: draftCheckSent === "" ? null : draftCheckSent === "Yes",
        date: formatDateMMDDYY(newTimeEntered),
      });
      setEditingKey(null);
    } finally {
      setIsBusy(false);
    }
  };

  const handleClockOutClick = async (entry: TimesheetEntry) => {
    if (!onClockOut) return;
    setIsBusy(true);
    try {
      await onClockOut(entry);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Date</th>
          <th className="text-left p-2">Time Entered</th>
          <th className="text-left p-2">Time Exit</th>
          <th className="text-left p-2">Time Elapsed</th>
          <th className="text-left p-2">Check Sent?</th>
          {editable && <th className="text-left p-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {entries.length === 0 && (
          <tr>
            <td colSpan={columnCount} className="p-2 text-center text-gray-500">
              No time card entries yet.
            </td>
          </tr>
        )}

        {Array.from(groupedByYear.entries()).map(([year, monthMap]) => {
          const yearKey = `y-${year}`;
          const yearCollapsed = collapsedKeys.has(yearKey);

          return (
            <Fragment key={yearKey}>
              <tr className="border-b !bg-gray-200">
                <td colSpan={columnCount} className="p-2">
                  <button onClick={() => toggleCollapsed(yearKey)} className="font-bold w-full text-left">
                    {yearCollapsed ? "▶" : "▼"} {year}
                  </button>
                </td>
              </tr>

              {!yearCollapsed &&
                Array.from(monthMap.entries()).map(([month, monthEntries]) => {
                  const monthKey = `m-${year}-${month}`;
                  const monthCollapsed = collapsedKeys.has(monthKey);
                  const monthTotalMinutes = sumElapsedMinutes(monthEntries);

                  return (
                    <Fragment key={monthKey}>
                      <tr className="border-b !bg-gray-100">
                        <td colSpan={columnCount} className="p-2 pl-6">
                          <button onClick={() => toggleCollapsed(monthKey)} className="font-semibold w-full text-left">
                            {monthCollapsed ? "▶" : "▼"} {MONTH_NAMES[month]}
                          </button>
                        </td>
                      </tr>

                      {!monthCollapsed && (
                        <>
                          {monthEntries.map((entry) => {
                            const entryKey = entry.timeEntered.getTime();
                            const isEditingRow = editable && editingKey === entryKey;

                            return (
                              <tr key={entryKey} className="border-b">
                                <td className="p-2 pl-10">{entry.date}</td>

                                {isEditingRow ? (
                                  <>
                                    <td className="p-2">
                                      <input
                                        type="datetime-local"
                                        value={draftTimeEntered}
                                        onChange={(e) => setDraftTimeEntered(e.target.value)}
                                        className="border rounded px-1 py-0.5 text-xs w-full"
                                      />
                                    </td>
                                    <td className="p-2">
                                      <input
                                        type="datetime-local"
                                        value={draftTimeExited}
                                        onChange={(e) => setDraftTimeExited(e.target.value)}
                                        className="border rounded px-1 py-0.5 text-xs w-full"
                                      />
                                    </td>
                                    <td className="p-2">
                                      {draftTimeEntered
                                        ? formatElapsed(
                                            new Date(draftTimeEntered),
                                            draftTimeExited ? new Date(draftTimeExited) : null
                                          )
                                        : ""}
                                    </td>
                                    <td className="p-2">
                                      <select
                                        value={draftCheckSent}
                                        onChange={(e) => setDraftCheckSent(e.target.value)}
                                        className="border rounded px-1 py-0.5 text-xs"
                                      >
                                        <option value="">—</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                      </select>
                                    </td>
                                    <td className="p-2">
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => saveEdit(entry)}
                                          disabled={isBusy}
                                          className="px-2 py-1 !bg-green-300 hover:!bg-green-400 rounded text-xs font-semibold disabled:opacity-50"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={cancelEdit}
                                          disabled={isBusy}
                                          className="px-2 py-1 !bg-gray-200 hover:!bg-gray-300 rounded text-xs font-semibold disabled:opacity-50"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="p-2">{formatTime(entry.timeEntered)}</td>
                                    <td className="p-2">
                                      {entry.timeExited ? (
                                        formatTime(entry.timeExited)
                                      ) : onClockOut ? (
                                        <button
                                          onClick={() => handleClockOutClick(entry)}
                                          disabled={isBusy}
                                          className="px-3 py-1 !bg-red-400 hover:!bg-red-500 rounded text-xs font-semibold disabled:opacity-50"
                                        >
                                          Clock Out
                                        </button>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                    <td className="p-2">{formatElapsed(entry.timeEntered, entry.timeExited)}</td>
                                    <td className="p-2">
                                      {entry.checkSent === true ? "Yes" : entry.checkSent === false ? "No" : ""}
                                    </td>
                                    {editable && (
                                      <td className="p-2">
                                        <button
                                          onClick={() => startEdit(entry)}
                                          disabled={isBusy}
                                          className="px-2 py-1 !bg-blue-200 hover:!bg-blue-300 rounded text-xs font-semibold disabled:opacity-50"
                                        >
                                          Edit
                                        </button>
                                      </td>
                                    )}
                                  </>
                                )}
                              </tr>
                            );
                          })}
                          <tr className="border-b font-semibold !bg-gray-50">
                            <td className="p-2 pl-10" colSpan={3}>
                              Total for {MONTH_NAMES[month]} {year}
                            </td>
                            <td className="p-2">{formatMinutes(monthTotalMinutes)}</td>
                            <td className="p-2"></td>
                            {editable && <td className="p-2"></td>}
                          </tr>
                        </>
                      )}
                    </Fragment>
                  );
                })}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
