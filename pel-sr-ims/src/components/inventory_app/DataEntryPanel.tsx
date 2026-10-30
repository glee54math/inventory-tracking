// DataEntryPanel.tsx
// Lets the logged-in worker log today's clean/correction worksheet counts and
// folder recording/pulling counts, and view/correct their own history below.
// Mr. Lee additionally sees every worker's data entries below his own.

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import {
  EMPTY_DATA_ENTRY_COUNTS,
  dataEntryDocId,
  toDataEntryRecord,
  upsertDataEntry,
} from "../../utils/dataEntryService";
import { formatDateMMDDYY } from "../../utils/timesheetService";
import { loadWorkersFromDB } from "../../utils/inventoryService";
import type { DataEntryCounts, DataEntryRecord } from "../../utils/types";
import { useNameContext } from "./NameContext";
import DataEntryTable from "./DataEntryTable";
import AllWorkersDataEntries from "./AllWorkersDataEntries";

const FIELDS: { key: keyof DataEntryCounts; label: string }[] = [
  { key: "cleanWorksheets", label: "Clean Worksheets Graded" },
  { key: "correctionWorksheets", label: "Correction Worksheets Graded" },
  { key: "foldersRecorded", label: "Folders Recorded" },
  { key: "foldersPulled", label: "Folders Pulled" },
  { key: "foldersRecordedAndPulled", label: "Folders Recorded & Pulled" },
];

export default function DataEntryPanel() {
  const { nameOfWorker } = useNameContext();
  const [workerName, setWorkerName] = useState<{ firstName: string; lastName: string } | null>(null);
  const [entries, setEntries] = useState<DataEntryRecord[]>([]);
  const [todayCounts, setTodayCounts] = useState<DataEntryCounts>(EMPTY_DATA_ENTRY_COUNTS);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showPanel, setShowPanel] = useState<boolean>(true);

  const today = formatDateMMDDYY(new Date());

  // Resolve initials -> first/last name, since entries are keyed by full name
  // (two workers can share the same initials) — same as WorkerTimeSheet.tsx.
  useEffect(() => {
    if (!nameOfWorker) return;
    loadWorkersFromDB().then((workers) => {
      const match = workers.find((w) => w.initials === nameOfWorker);
      setWorkerName(match ? { firstName: match.firstName, lastName: match.lastName } : null);
    });
  }, [nameOfWorker]);

  useEffect(() => {
    if (!workerName) return;

    const docRef = doc(db, "dataEntries", dataEntryDocId(workerName.firstName, workerName.lastName));

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (!docSnap.exists()) {
        setEntries([]);
        return;
      }
      const rawEntries = (docSnap.data().entries ?? []) as any[];
      setEntries(rawEntries.map(toDataEntryRecord));
    });

    return () => unsubscribe();
  }, [workerName]);

  // Pre-fill today's form from the saved record for today, if one exists.
  useEffect(() => {
    const todayRecord = entries.find((entry) => entry.date === today);
    setTodayCounts(todayRecord ?? EMPTY_DATA_ENTRY_COUNTS);
  }, [entries, today]);

  const handleFieldChange = (key: keyof DataEntryCounts, value: string) => {
    setTodayCounts((prev) => ({ ...prev, [key]: Math.max(0, Number(value) || 0) }));
  };

  const handleSaveToday = async () => {
    if (!workerName) return;
    setIsSaving(true);
    try {
      await upsertDataEntry(workerName.firstName, workerName.lastName, today, todayCounts);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <button onClick={() => setShowPanel((prev) => !prev)} className="font-bold mb-2 text-center w-full">
        {showPanel ? "▼" : "▶"} Data Entry
      </button>

      {showPanel && (
        <>
          <div className="border rounded p-3 mb-4 !bg-blue-50">
            <h3 className="font-semibold mb-2 text-center">Today's Entry ({today})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {FIELDS.map((field) => (
                <label key={field.key} className="text-sm">
                  {field.label}
                  <input
                    type="number"
                    min={0}
                    value={todayCounts[field.key]}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1"
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSaveToday}
                disabled={isSaving || !workerName}
                className="px-6 py-2 !bg-green-300 hover:!bg-green-400 rounded font-semibold disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Today's Entry"}
              </button>
            </div>
          </div>

          <DataEntryTable
            entries={entries}
            editable
            onSaveEdit={(original, updates) => {
              if (!workerName) return;
              return upsertDataEntry(workerName.firstName, workerName.lastName, original.date, updates);
            }}
          />
        </>
      )}

      {nameOfWorker === "Mr. Lee" && <AllWorkersDataEntries />}
    </div>
  );
}
