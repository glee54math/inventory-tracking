import { doc, getDoc, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { MonthlyTimesheetTotal, TimesheetEntry } from "./types";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDateMMDDYY(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

export function formatElapsed(timeEntered: Date, timeExited: Date | null): string {
  if (!timeExited) return "";
  return formatMinutes(elapsedMinutes(timeEntered, timeExited));
}

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function elapsedMinutes(timeEntered: Date, timeExited: Date): number {
  return Math.max(0, Math.round((timeExited.getTime() - timeEntered.getTime()) / 60000));
}

export function sumElapsedMinutes(entries: TimesheetEntry[]): number {
  return entries.reduce((total, entry) => {
    if (!entry.timeExited) return total;
    return total + elapsedMinutes(entry.timeEntered, entry.timeExited);
  }, 0);
}

// Groups entries by calendar year, then month (0-11). Assumes entries are
// already sorted the way callers want them displayed within each group.
export function groupEntriesByYearMonth(entries: TimesheetEntry[]): Map<number, Map<number, TimesheetEntry[]>> {
  const yearMap = new Map<number, Map<number, TimesheetEntry[]>>();
  for (const entry of entries) {
    const year = entry.timeEntered.getFullYear();
    const month = entry.timeEntered.getMonth();
    if (!yearMap.has(year)) yearMap.set(year, new Map());
    const monthMap = yearMap.get(year)!;
    if (!monthMap.has(month)) monthMap.set(month, []);
    monthMap.get(month)!.push(entry);
  }
  return yearMap;
}

// Keyed by first+last name (not initials) since two workers can share the same initials.
export function timesheetDocId(firstName: string, lastName: string): string {
  return `${firstName}_${lastName}`;
}

export function monthlyTotalDocId(firstName: string, lastName: string, year: number, month: number): string {
  return `${timesheetDocId(firstName, lastName)}_${year}-${String(month + 1).padStart(2, "0")}`;
}

export async function loadTimesheetEntries(firstName: string, lastName: string): Promise<TimesheetEntry[]> {
  const docRef = doc(db, "timesheets", timesheetDocId(firstName, lastName));
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return [];
  const rawEntries = (docSnap.data().entries ?? []) as any[];
  return rawEntries.map(toEntry);
}

function toEntry(raw: any): TimesheetEntry {
  return {
    date: raw.date,
    timeEntered: raw.timeEntered.toDate ? raw.timeEntered.toDate() : new Date(raw.timeEntered),
    timeExited: raw.timeExited ? (raw.timeExited.toDate ? raw.timeExited.toDate() : new Date(raw.timeExited)) : null,
    checkSent: raw.checkSent ?? null,
  };
}

export async function clockIn(firstName: string, lastName: string): Promise<void> {
  const docRef = doc(db, "timesheets", timesheetDocId(firstName, lastName));
  const docSnap = await getDoc(docRef);
  const existingEntries = docSnap.exists() ? (docSnap.data().entries ?? []) : [];

  const now = new Date();
  const newEntry: TimesheetEntry = {
    date: formatDateMMDDYY(now),
    timeEntered: now,
    timeExited: null,
    checkSent: null,
  };

  await setDoc(docRef, { firstName, lastName, entries: [...existingEntries, newEntry] });
}

// timeEntered pinpoints which entry to close, since matching on "the open one" alone
// isn't reliable if the entries array ever ends up with more than one open shift.
export async function clockOut(firstName: string, lastName: string, timeEntered: Date): Promise<void> {
  const docRef = doc(db, "timesheets", timesheetDocId(firstName, lastName));
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;

  const rawEntries = (docSnap.data().entries ?? []) as any[];
  const now = new Date();
  const updatedEntries = rawEntries.map((raw) => {
    const entryTimeEntered = raw.timeEntered.toDate ? raw.timeEntered.toDate() : new Date(raw.timeEntered);
    if (entryTimeEntered.getTime() === timeEntered.getTime()) {
      return { ...raw, timeExited: now };
    }
    return raw;
  });

  await updateDoc(docRef, { entries: updatedEntries });
}

// Lets Mr. Lee correct an entry (times, or Check Sent). originalTimeEntered identifies
// which entry to change, since that's the stable key entries are matched on elsewhere.
export async function updateTimesheetEntry(
  firstName: string,
  lastName: string,
  originalTimeEntered: Date,
  updates: Partial<TimesheetEntry>
): Promise<void> {
  const docRef = doc(db, "timesheets", timesheetDocId(firstName, lastName));
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;

  const rawEntries = (docSnap.data().entries ?? []) as any[];
  const updatedEntries = rawEntries.map((raw) => {
    const entryTimeEntered = raw.timeEntered.toDate ? raw.timeEntered.toDate() : new Date(raw.timeEntered);
    if (entryTimeEntered.getTime() !== originalTimeEntered.getTime()) return raw;

    return {
      date: updates.date ?? raw.date,
      timeEntered: updates.timeEntered ?? entryTimeEntered,
      timeExited: updates.timeExited !== undefined ? updates.timeExited : raw.timeExited ?? null,
      checkSent: updates.checkSent !== undefined ? updates.checkSent : raw.checkSent ?? null,
    };
  });

  await updateDoc(docRef, { entries: updatedEntries });
}

// Writes a monthly total exactly once per (worker, month), the first time any client
// notices that month has ended. If a total already exists it's left alone — re-finalizing
// after a manual edit to a past month is a separate concern to handle later.
export async function finalizePastMonths(
  firstName: string,
  lastName: string,
  entries: TimesheetEntry[]
): Promise<void> {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const pastMonthKeys = new Set<string>();
  for (const entry of entries) {
    const year = entry.timeEntered.getFullYear();
    const month = entry.timeEntered.getMonth();
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      pastMonthKeys.add(`${year}-${month}`);
    }
  }

  for (const key of pastMonthKeys) {
    const [yearStr, monthStr] = key.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);

    const monthEntries = entries.filter(
      (entry) => entry.timeEntered.getFullYear() === year && entry.timeEntered.getMonth() === month
    );
    const totalMinutes = sumElapsedMinutes(monthEntries);

    const totalDocRef = doc(db, "timesheet_monthly_totals", monthlyTotalDocId(firstName, lastName, year, month));

    await runTransaction(db, async (transaction) => {
      const existing = await transaction.get(totalDocRef);
      if (existing.exists()) return;

      const total: MonthlyTimesheetTotal = {
        firstName,
        lastName,
        year,
        month,
        totalMinutes,
        finalizedAt: new Date(),
      };
      transaction.set(totalDocRef, total);
    });
  }
}
