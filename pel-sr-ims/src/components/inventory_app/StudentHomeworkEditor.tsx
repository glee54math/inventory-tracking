// StudentHomeworkEditor.tsx
// Lets staff remove mis-assigned homework from a student's hwkAssigned list.
// Inventory and the log are NOT touched — use this when the copies really left
// the shelf but were recorded against the wrong level/student, so undoing the log
// action (which returns copies to inventory) would be wrong.

import { useMemo, useState } from "react";
import type { Student } from "../../utils/types";
import {
  homeworkEntryKey,
  removeHomeworkEntries,
  type HomeworkEntryKey,
} from "../../utils/inventoryService";

interface StudentHomeworkEditorProps {
  student: Student;
  onChanged: () => void;
}

interface Row extends HomeworkEntryKey {
  id: number; // position in hwkAssigned, unique per row for selection
}

export default function StudentHomeworkEditor({ student, onChanged }: StudentHomeworkEditorProps) {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isRemoving, setIsRemoving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Newest first; legacy (undated) entries last
  const rows: Row[] = useMemo(
    () =>
      (student.hwkAssigned ?? [])
        .map((entry, id) => ({ id, ...homeworkEntryKey(entry) }))
        .sort((a, b) => (b.dateMs ?? -Infinity) - (a.dateMs ?? -Infinity)),
    [student.hwkAssigned]
  );

  const query = filter.trim().toLowerCase();
  const shown = query ? rows.filter((r) => r.assignment.toLowerCase().includes(query)) : rows;
  const selectedRows = rows.filter((r) => selected.has(r.id));

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectAllShown = () =>
    setSelected((prev) => new Set([...prev, ...shown.map((r) => r.id)]));

  const handleRemove = async () => {
    if (selectedRows.length === 0) return;
    const list = selectedRows.map((r) => r.assignment).join(", ");
    const ok = window.confirm(
      `Remove ${selectedRows.length} assignment(s) from ${student.firstName} ${student.lastName}?\n\n${list}\n\n` +
        "Inventory and the log will NOT change. Removed entries are kept in the student's hwkRemoved record."
    );
    if (!ok) return;

    setIsRemoving(true);
    setMessage(null);
    try {
      const count = await removeHomeworkEntries(student, selectedRows);
      setSelected(new Set());
      setMessage(`Removed ${count} assignment(s). Progress was refreshed.`);
      onChanged();
    } catch (err) {
      console.error("Error removing homework:", err);
      setMessage("Something went wrong — nothing was removed. Check the console.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="mt-4 border rounded bg-white p-3">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <h3 className="font-semibold mr-2">Homework ({rows.length})</h3>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter, e.g. MM2"
          className="px-2 py-1 border rounded text-sm w-36"
        />
        <button
          onClick={selectAllShown}
          disabled={shown.length === 0}
          className="px-2 py-1 text-sm rounded !bg-gray-200 hover:!bg-gray-300 disabled:opacity-50"
        >
          Select all shown ({shown.length})
        </button>
        <button
          onClick={() => setSelected(new Set())}
          disabled={selected.size === 0}
          className="px-2 py-1 text-sm rounded !bg-gray-200 hover:!bg-gray-300 disabled:opacity-50"
        >
          Clear
        </button>
        <button
          onClick={handleRemove}
          disabled={selected.size === 0 || isRemoving}
          className="px-2 py-1 text-sm rounded !bg-red-200 hover:!bg-red-300 disabled:opacity-50"
        >
          {isRemoving ? "Removing..." : `Remove selected (${selected.size})`}
        </button>
      </div>

      {message && <p className="text-sm text-gray-700 mb-2">{message}</p>}

      <ul className="max-h-72 overflow-auto divide-y text-sm">
        {shown.map((row) => (
          <li key={row.id}>
            <label className="flex items-center gap-3 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(row.id)}
                onChange={() => toggle(row.id)}
              />
              <span className="font-medium w-28">{row.assignment}</span>
              <span className="text-gray-500">
                {row.dateMs !== null ? new Date(row.dateMs).toLocaleString() : "no date (legacy)"}
              </span>
            </label>
          </li>
        ))}
        {shown.length === 0 && <li className="py-2 text-gray-400 italic">No matching homework.</li>}
      </ul>
    </div>
  );
}
