// useWorkerMinutesByDate.ts
// Subscribes to a worker's timesheet and returns minutes worked per calendar
// day. Ticks every 60s so a day with an open shift (necessarily today) keeps
// updating live; past days are always closed and so never change between ticks.

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { sumMinutesByDate, timesheetDocId, toTimesheetEntry } from "../../utils/timesheetService";
import type { TimesheetEntry } from "../../utils/types";

export function useWorkerMinutesByDate(firstName: string, lastName: string) {
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!firstName || !lastName) {
      setTimesheetEntries([]);
      return;
    }

    const docRef = doc(db, "timesheets", timesheetDocId(firstName, lastName));
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (!docSnap.exists()) {
        setTimesheetEntries([]);
        return;
      }
      const rawEntries = (docSnap.data().entries ?? []) as any[];
      setTimesheetEntries(rawEntries.map(toTimesheetEntry));
    });

    return () => unsubscribe();
  }, [firstName, lastName]);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  return sumMinutesByDate(timesheetEntries);
}
