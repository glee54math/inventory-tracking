// AllWorkersTimesheet.tsx
// Mr. Lee's view of every worker's timesheet, with editable entries.

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { updateTimesheetEntry } from "../../utils/timesheetService";
import type { TimesheetEntry } from "../../utils/types";
import TimesheetTable from "./TimesheetTable";

interface WorkerTimesheetRecord {
  firstName: string;
  lastName: string;
  entries: TimesheetEntry[];
}

function toEntry(raw: any): TimesheetEntry {
  return {
    date: raw.date,
    timeEntered: raw.timeEntered.toDate ? raw.timeEntered.toDate() : new Date(raw.timeEntered),
    timeExited: raw.timeExited ? (raw.timeExited.toDate ? raw.timeExited.toDate() : new Date(raw.timeExited)) : null,
    checkSent: raw.checkSent ?? null,
  };
}

export default function AllWorkersTimesheet() {
  const [records, setRecords] = useState<WorkerTimesheetRecord[]>([]);
  const [collapsedWorkers, setCollapsedWorkers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "timesheets"), (snapshot) => {
      const newRecords: WorkerTimesheetRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const rawEntries = (data.entries ?? []) as any[];
        const entries = rawEntries.map(toEntry).sort((a, b) => a.timeEntered.getTime() - b.timeEntered.getTime());

        newRecords.push({
          firstName: data.firstName ?? docSnap.id,
          lastName: data.lastName ?? "",
          entries,
        });
      });
      newRecords.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
      setRecords(newRecords);
    });

    return () => unsubscribe();
  }, []);

  const toggleWorker = (key: string) => {
    setCollapsedWorkers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="w-full mt-6 border-t pt-4">
      <h2 className="font-bold mb-3 text-center w-full">All Workers</h2>

      {records.length === 0 && (
        <p className="text-center text-gray-500 text-sm">No worker timesheets yet.</p>
      )}

      {records.map((record) => {
        const key = `${record.firstName}_${record.lastName}`;
        const collapsed = collapsedWorkers.has(key);

        return (
          <div key={key} className="mb-4 border rounded">
            <button
              onClick={() => toggleWorker(key)}
              className="w-full text-left px-2 py-2 font-semibold !bg-gray-200 hover:!bg-gray-300"
            >
              {collapsed ? "▶" : "▼"} {record.firstName} {record.lastName}
            </button>

            {!collapsed && (
              <div className="p-2">
                <TimesheetTable
                  entries={record.entries}
                  editable
                  onSaveEdit={(original, updates) =>
                    updateTimesheetEntry(record.firstName, record.lastName, original.timeEntered, updates)
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
