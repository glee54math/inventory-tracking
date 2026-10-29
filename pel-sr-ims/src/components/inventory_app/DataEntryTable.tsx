// DataEntryTable.tsx
// Shared year/month-collapsible table of daily data-entry counts.
// - Personal view: shows a worker's own history.
// - Admin view: pass editable + onSaveEdit, every row gets an "Edit" button that lets
//   Mr. Lee correct a worker's counts for that day.

import { Fragment, useState } from "react";
import { groupDataEntriesByYearMonth, sumDataEntryCounts } from "../../utils/dataEntryService";
import { MONTH_NAMES } from "../../utils/timesheetService";
import type { DataEntryCounts, DataEntryRecord } from "../../utils/types";

interface DataEntryTableProps {
  entries: DataEntryRecord[];
  editable?: boolean;
  onSaveEdit?: (original: DataEntryRecord, updates: DataEntryCounts) => Promise<void> | void;
}

const COLUMNS: { key: keyof DataEntryCounts; label: string }[] = [
  { key: "cleanWorksheets", label: "Clean" },
  { key: "correctionWorksheets", label: "Correction" },
  { key: "foldersRecorded", label: "Folders Recorded" },
  { key: "foldersPulled", label: "Folders Pulled" },
  { key: "foldersRecordedAndPulled", label: "Recorded & Pulled" },
];

export default function DataEntryTable({ entries, editable = false, onSaveEdit }: DataEntryTableProps) {
  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set());
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [draftCounts, setDraftCounts] = useState<DataEntryCounts | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const groupedByYear = groupDataEntriesByYearMonth(entries);
  const columnCount = 1 + COLUMNS.length + (editable ? 1 : 0);

  const toggleCollapsed = (key: string) => {
    setCollapsedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const startEdit = (entry: DataEntryRecord) => {
    setEditingDate(entry.date);
    setDraftCounts({
      cleanWorksheets: entry.cleanWorksheets,
      correctionWorksheets: entry.correctionWorksheets,
      foldersRecorded: entry.foldersRecorded,
      foldersPulled: entry.foldersPulled,
      foldersRecordedAndPulled: entry.foldersRecordedAndPulled,
    });
  };

  const cancelEdit = () => {
    setEditingDate(null);
    setDraftCounts(null);
  };

  const saveEdit = async (entry: DataEntryRecord) => {
    if (!onSaveEdit || !draftCounts) return;
    setIsBusy(true);
    try {
      await onSaveEdit(entry, draftCounts);
      setEditingDate(null);
      setDraftCounts(null);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Date</th>
          {COLUMNS.map((col) => (
            <th key={col.key} className="text-left p-2">
              {col.label}
            </th>
          ))}
          {editable && <th className="text-left p-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {entries.length === 0 && (
          <tr>
            <td colSpan={columnCount} className="p-2 text-center text-gray-500">
              No data entries yet.
            </td>
          </tr>
        )}

        {Array.from(groupedByYear.entries())
          .sort((a, b) => b[0] - a[0])
          .map(([year, monthMap]) => {
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
                  Array.from(monthMap.entries())
                    .sort((a, b) => b[0] - a[0])
                    .map(([month, monthEntries]) => {
                      const monthKey = `m-${year}-${month}`;
                      const monthCollapsed = collapsedKeys.has(monthKey);
                      const monthTotals = sumDataEntryCounts(monthEntries);
                      const sortedMonthEntries = [...monthEntries].sort((a, b) => b.date.localeCompare(a.date));

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
                              {sortedMonthEntries.map((entry) => {
                                const isEditingRow = editable && editingDate === entry.date;

                                return (
                                  <tr key={entry.date} className="border-b">
                                    <td className="p-2 pl-10">{entry.date}</td>

                                    {isEditingRow && draftCounts ? (
                                      <>
                                        {COLUMNS.map((col) => (
                                          <td key={col.key} className="p-2">
                                            <input
                                              type="number"
                                              min={0}
                                              value={draftCounts[col.key]}
                                              onChange={(e) =>
                                                setDraftCounts({
                                                  ...draftCounts,
                                                  [col.key]: Math.max(0, Number(e.target.value) || 0),
                                                })
                                              }
                                              className="border rounded px-1 py-0.5 text-xs w-16"
                                            />
                                          </td>
                                        ))}
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
                                        {COLUMNS.map((col) => (
                                          <td key={col.key} className="p-2">
                                            {entry[col.key]}
                                          </td>
                                        ))}
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
                                <td className="p-2 pl-10">Total for {MONTH_NAMES[month]} {year}</td>
                                {COLUMNS.map((col) => (
                                  <td key={col.key} className="p-2">
                                    {monthTotals[col.key]}
                                  </td>
                                ))}
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
