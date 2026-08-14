// WorkerTimeSheet.tsx
// Lets the logged-in worker clock in / clock out and view their own shift history.
// Mr. Lee additionally sees every worker's timesheet below his own (editable).

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { clockIn, clockOut, finalizePastMonths, timesheetDocId } from "../../utils/timesheetService";
import { loadWorkersFromDB } from "../../utils/inventoryService";
import type { TimesheetEntry } from "../../utils/types";
import { useNameContext } from "./NameContext";
import TimesheetTable from "./TimesheetTable";
import AllWorkersTimesheet from "./AllWorkersTimesheet";

export default function WorkerTimeSheet() {
  const { nameOfWorker } = useNameContext();
  const [workerName, setWorkerName] = useState<{ firstName: string; lastName: string } | null>(null);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showMyTimesheet, setShowMyTimesheet] = useState<boolean>(true);

  // Resolve initials -> first/last name, since timesheets are keyed by full name
  // (two workers can share the same initials).
  useEffect(() => {
    if (!nameOfWorker) return;
    loadWorkersFromDB().then((workers) => {
      const match = workers.find((w) => w.initials === nameOfWorker);
      setWorkerName(match ? { firstName: match.firstName, lastName: match.lastName } : null);
    });
  }, [nameOfWorker]);

  useEffect(() => {
    if (!workerName) return;

    const docRef = doc(db, "timesheets", timesheetDocId(workerName.firstName, workerName.lastName));

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (!docSnap.exists()) {
        setEntries([]);
        return;
      }
      const rawEntries = (docSnap.data().entries ?? []) as any[];
      const newEntries: TimesheetEntry[] = rawEntries.map((raw) => ({
        date: raw.date,
        timeEntered: raw.timeEntered.toDate(),
        timeExited: raw.timeExited ? raw.timeExited.toDate() : null,
        checkSent: raw.checkSent ?? null,
      }));
      newEntries.sort((a, b) => a.timeEntered.getTime() - b.timeEntered.getTime());
      setEntries(newEntries);

      // Opportunistically write a finalized total for any month that's already over.
      // Safe to call every time entries change - finalizePastMonths never overwrites
      // a total that's already been written.
      finalizePastMonths(workerName.firstName, workerName.lastName, newEntries).catch((err) =>
        console.error("Failed to finalize past-month timesheet totals:", err)
      );
    });

    return () => unsubscribe();
  }, [workerName]);

  const openEntry = entries.find((entry) => entry.timeExited === null);

  const handleClockIn = async () => {
    if (!workerName) return;
    setIsSubmitting(true);
    try {
      await clockIn(workerName.firstName, workerName.lastName);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClockOut = async (entry: TimesheetEntry) => {
    if (!workerName) return;
    await clockOut(workerName.firstName, workerName.lastName, entry.timeEntered);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setShowMyTimesheet((prev) => !prev)}
        className="font-bold mb-2 text-center w-full"
      >
        {showMyTimesheet ? "▼" : "▶"} My Time Card
      </button>

      {showMyTimesheet && (
        <>
          <TimesheetTable entries={entries} onClockOut={handleClockOut} />

          <div className="flex justify-center mt-4">
            <button
              onClick={handleClockIn}
              disabled={isSubmitting || !workerName || !!openEntry}
              title={openEntry ? "Clock out of your current shift first" : undefined}
              className="px-6 py-2 !bg-green-300 hover:!bg-green-400 rounded font-semibold disabled:opacity-50"
            >
              Clock In
            </button>
          </div>
        </>
      )}

      {nameOfWorker === "Mr. Lee" && <AllWorkersTimesheet />}
    </div>
  );
}
