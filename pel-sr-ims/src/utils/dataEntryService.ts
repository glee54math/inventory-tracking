import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { DataEntryCounts, DataEntryRecord } from "./types";

export const EMPTY_DATA_ENTRY_COUNTS: DataEntryCounts = {
  cleanWorksheets: 0,
  correctionWorksheets: 0,
  foldersRecorded: 0,
  foldersPulled: 0,
  foldersRecordedAndPulled: 0,
};

// Keyed by first+last name (not initials) since two workers can share the same initials
// — same convention as timesheetDocId in timesheetService.ts.
export function dataEntryDocId(firstName: string, lastName: string): string {
  return `${firstName}_${lastName}`;
}

export function toDataEntryRecord(raw: any): DataEntryRecord {
  return {
    date: raw.date,
    cleanWorksheets: raw.cleanWorksheets ?? 0,
    correctionWorksheets: raw.correctionWorksheets ?? 0,
    foldersRecorded: raw.foldersRecorded ?? 0,
    foldersPulled: raw.foldersPulled ?? 0,
    foldersRecordedAndPulled: raw.foldersRecordedAndPulled ?? 0,
    updatedAt: raw.updatedAt?.toDate ? raw.updatedAt.toDate() : new Date(raw.updatedAt),
  };
}

export async function loadDataEntries(firstName: string, lastName: string): Promise<DataEntryRecord[]> {
  const docRef = doc(db, "dataEntries", dataEntryDocId(firstName, lastName));
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return [];
  const rawEntries = (docSnap.data().entries ?? []) as any[];
  return rawEntries.map(toDataEntryRecord);
}

// Replaces the record for `date` if one exists, otherwise appends a new one.
// This is how a worker both logs today's counts and corrects a past day.
export async function upsertDataEntry(
  firstName: string,
  lastName: string,
  date: string,
  counts: DataEntryCounts
): Promise<void> {
  const docRef = doc(db, "dataEntries", dataEntryDocId(firstName, lastName));
  const docSnap = await getDoc(docRef);
  const rawEntries = docSnap.exists() ? ((docSnap.data().entries ?? []) as any[]) : [];

  const updatedRecord = { date, ...counts, updatedAt: new Date() };
  const existingIndex = rawEntries.findIndex((e) => e.date === date);
  const updatedEntries =
    existingIndex === -1
      ? [...rawEntries, updatedRecord]
      : rawEntries.map((e, i) => (i === existingIndex ? updatedRecord : e));

  await setDoc(docRef, { firstName, lastName, entries: updatedEntries });
}

function parseMMDDYY(date: string): { year: number; month: number } {
  const [mm, , yy] = date.split("/").map(Number);
  return { year: 2000 + yy, month: mm - 1 };
}

// Groups entries by calendar year, then month (0-11), mirroring groupEntriesByYearMonth
// in timesheetService.ts. Assumes entries are already sorted the way callers want them
// displayed within each group.
export function groupDataEntriesByYearMonth(entries: DataEntryRecord[]): Map<number, Map<number, DataEntryRecord[]>> {
  const yearMap = new Map<number, Map<number, DataEntryRecord[]>>();
  for (const entry of entries) {
    const { year, month } = parseMMDDYY(entry.date);
    if (!yearMap.has(year)) yearMap.set(year, new Map());
    const monthMap = yearMap.get(year)!;
    if (!monthMap.has(month)) monthMap.set(month, []);
    monthMap.get(month)!.push(entry);
  }
  return yearMap;
}

export function sumDataEntryCounts(entries: DataEntryRecord[]): DataEntryCounts {
  return entries.reduce(
    (total, entry) => ({
      cleanWorksheets: total.cleanWorksheets + entry.cleanWorksheets,
      correctionWorksheets: total.correctionWorksheets + entry.correctionWorksheets,
      foldersRecorded: total.foldersRecorded + entry.foldersRecorded,
      foldersPulled: total.foldersPulled + entry.foldersPulled,
      foldersRecordedAndPulled: total.foldersRecordedAndPulled + entry.foldersRecordedAndPulled,
    }),
    { ...EMPTY_DATA_ENTRY_COUNTS }
  );
}
