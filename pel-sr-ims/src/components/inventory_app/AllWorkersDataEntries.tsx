// AllWorkersDataEntries.tsx
// Mr. Lee's view of every worker's daily data-entry counts, with editable entries.

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { toDataEntryRecord, upsertDataEntry } from "../../utils/dataEntryService";
import type { DataEntryRecord } from "../../utils/types";
import DataEntryTable from "./DataEntryTable";

interface WorkerDataEntryRecordSet {
  firstName: string;
  lastName: string;
  entries: DataEntryRecord[];
}

export default function AllWorkersDataEntries() {
  const [records, setRecords] = useState<WorkerDataEntryRecordSet[]>([]);
  const [collapsedWorkers, setCollapsedWorkers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "dataEntries"), (snapshot) => {
      const newRecords: WorkerDataEntryRecordSet[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const rawEntries = (data.entries ?? []) as any[];
        const entries = rawEntries.map(toDataEntryRecord);

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
      <h2 className="font-bold mb-3 text-center w-full">All Workers' Data Entries</h2>

      {records.length === 0 && (
        <p className="text-center text-gray-500 text-sm">No worker data entries yet.</p>
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
                <DataEntryTable
                  entries={record.entries}
                  editable
                  onSaveEdit={(original, updates) =>
                    upsertDataEntry(record.firstName, record.lastName, original.date, updates)
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
