import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { PelEarningRule, PelTransaction, PrizeItem, Student } from "./types";

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // excludes ambiguous 0/O/1/I/L

// Matches the location options already used by WorkerLogin/CardGenerator. Looping
// over these (instead of a Firestore collectionGroup query) avoids needing a
// collection-group index on studentCode — fine at this project's 2-location scale.
const LOCATIONS = ["san-ramon", "dublin"];

export function generateStudentCode(length = 8): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

// Looks a studentCode up across every location's students subcollection, since the
// code (not the Firestore doc id) is what's printed/QR-encoded on the physical card.
export async function findStudentByCode(code: string): Promise<Student | null> {
  for (const location of LOCATIONS) {
    const q = query(collection(db, "students", location, "students"), where("studentCode", "==", code));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { ...docSnap.data(), id: docSnap.id, location } as Student;
    }
  }
  return null;
}

// Generates a fresh studentCode, retrying on the rare collision, and writes it to
// the student's doc. Overwriting an existing code (lost/damaged card reissue) makes
// the old card instantly inert since lookups are exact-match.
export async function assignStudentCode(location: string, studentId: string): Promise<string> {
  let code = generateStudentCode();
  while (await findStudentByCode(code)) {
    code = generateStudentCode();
  }

  const studentRef = doc(db, "students", location, "students", studentId);
  await updateDoc(studentRef, { studentCode: code });
  return code;
}

export async function getBalance(location: string, studentId: string): Promise<number> {
  const studentRef = doc(db, "students", location, "students", studentId);
  const studentSnap = await getDoc(studentRef);
  if (!studentSnap.exists()) return 0;
  return (studentSnap.data().pelBalance as number) ?? 0;
}

// Sorts and (optionally) trims client-side rather than via Firestore orderBy, so
// this doesn't depend on a composite index existing — fine at this project's scale
// (at most a few hundred transactions per student).
function sortByTimeStampDesc(transactions: PelTransaction[]): PelTransaction[] {
  return [...transactions].sort((a, b) => b.timeStamp.getTime() - a.timeStamp.getTime());
}

export async function getTransactionHistory(
  location: string,
  studentId: string,
  max?: number
): Promise<PelTransaction[]> {
  const q = query(
    collection(db, "pelTransactions"),
    where("studentLocation", "==", location),
    where("studentId", "==", studentId)
  );
  const snap = await getDocs(q);
  const transactions = sortByTimeStampDesc(snap.docs.map((d) => toTransaction(d.id, d.data())));
  return max ? transactions.slice(0, max) : transactions;
}

export async function getAllTransactions(filters?: {
  location?: string;
  type?: string;
}): Promise<PelTransaction[]> {
  const clauses = [];
  if (filters?.location) clauses.push(where("studentLocation", "==", filters.location));
  if (filters?.type) clauses.push(where("type", "==", filters.type));

  const q = query(collection(db, "pelTransactions"), ...clauses);
  const snap = await getDocs(q);
  return sortByTimeStampDesc(snap.docs.map((d) => toTransaction(d.id, d.data())));
}

function toTransaction(id: string, raw: any): PelTransaction {
  return {
    ...raw,
    id,
    timeStamp: raw.timeStamp?.toDate ? raw.timeStamp.toDate() : new Date(raw.timeStamp),
    reversedAt: raw.reversedAt?.toDate ? raw.reversedAt.toDate() : raw.reversedAt,
  } as PelTransaction;
}

interface CreditParams {
  student: Student;
  amount: number;
  reasonCode: string;
  reasonLabel: string;
  workerInitials: string;
  note?: string;
}

// Atomically writes a new ledger row and bumps the cached balance on the student
// doc, following the same read-inside-transaction-then-write pattern already used
// by finalizePastMonths in timesheetService.ts.
export async function creditStudent(params: CreditParams): Promise<number> {
  const { student, amount, reasonCode, reasonLabel, workerInitials, note } = params;
  if (amount <= 0) throw new Error("Credit amount must be positive");
  if (!student.id || !student.location) throw new Error("Student is missing id/location");

  const studentRef = doc(db, "students", student.location, "students", student.id);
  const transactionRef = doc(collection(db, "pelTransactions"));

  return await runTransaction(db, async (transaction) => {
    const studentSnap = await transaction.get(studentRef);
    const currentBalance = (studentSnap.data()?.pelBalance as number) ?? 0;
    const newBalance = currentBalance + amount;

    const entry: PelTransaction = {
      studentId: student.id!,
      studentLocation: student.location!,
      studentName: `${student.firstName} ${student.lastName}`,
      type: "Earn",
      amount,
      reasonCode,
      reasonLabel,
      balanceAfter: newBalance,
      workerInitials,
      timeStamp: new Date(),
      ...(note ? { note } : {}),
    };

    transaction.set(transactionRef, entry);
    transaction.update(studentRef, { pelBalance: newBalance, pelBalanceUpdatedAt: new Date() });
    return newBalance;
  });
}

interface DebitParams {
  student: Student;
  amount: number;
  reasonCode: string;
  reasonLabel: string;
  workerInitials: string;
  note?: string;
}

// Same atomic pattern as creditStudent, but refuses outright (no write at all) if
// the debit would take the balance negative — no staff override in v1; the
// intended escape hatch is to creditStudent an adjustment first.
export async function debitStudent(
  params: DebitParams
): Promise<{ ok: boolean; newBalance?: number; error?: "insufficient_balance" }> {
  const { student, amount, reasonCode, reasonLabel, workerInitials, note } = params;
  if (amount <= 0) throw new Error("Debit amount must be positive");
  if (!student.id || !student.location) throw new Error("Student is missing id/location");

  const studentRef = doc(db, "students", student.location, "students", student.id);
  const transactionRef = doc(collection(db, "pelTransactions"));

  return await runTransaction(db, async (transaction) => {
    const studentSnap = await transaction.get(studentRef);
    const currentBalance = (studentSnap.data()?.pelBalance as number) ?? 0;
    const newBalance = currentBalance - amount;

    if (newBalance < 0) {
      return { ok: false, error: "insufficient_balance" as const };
    }

    const entry: PelTransaction = {
      studentId: student.id!,
      studentLocation: student.location!,
      studentName: `${student.firstName} ${student.lastName}`,
      type: "Purchase",
      amount: -amount,
      reasonCode,
      reasonLabel,
      balanceAfter: newBalance,
      workerInitials,
      timeStamp: new Date(),
      ...(note ? { note } : {}),
    };

    transaction.set(transactionRef, entry);
    transaction.update(studentRef, { pelBalance: newBalance, pelBalanceUpdatedAt: new Date() });
    return { ok: true, newBalance };
  });
}

// Same 4-hour editable window already used for inventory log entries (see
// canEditLogEntry in inventoryService.ts). A Reversal is deliberately excluded —
// otherwise undoing an undo chains indefinitely (Reversal of Reversal of...),
// which produced a confusing ledger and a wrong final balance during testing.
export function canReverseTransaction(t: Pick<PelTransaction, "type" | "timeStamp">): boolean {
  if (t.type === "Reversal") return false;
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
  return t.timeStamp >= fourHoursAgo;
}

// Writes a compensating "Reversal" row rather than editing the original — the
// ledger must stay append-only and tamper-evident once real currency is involved.
export async function reverseTransaction(transactionId: string, reversedBy: string): Promise<boolean> {
  const originalRef = doc(db, "pelTransactions", transactionId);

  return await runTransaction(db, async (transaction) => {
    const originalSnap = await transaction.get(originalRef);
    if (!originalSnap.exists()) return false;

    const original = toTransaction(originalSnap.id, originalSnap.data());
    if (original.isReversed) return false;
    if (!canReverseTransaction(original)) return false;

    const studentRef = doc(db, "students", original.studentLocation, "students", original.studentId);
    const studentSnap = await transaction.get(studentRef);
    const currentBalance = (studentSnap.data()?.pelBalance as number) ?? 0;
    const reversalAmount = -original.amount;
    const newBalance = currentBalance + reversalAmount;

    const reversalRef = doc(collection(db, "pelTransactions"));
    const reversalEntry: PelTransaction = {
      studentId: original.studentId,
      studentLocation: original.studentLocation,
      studentName: original.studentName,
      type: "Reversal",
      amount: reversalAmount,
      reasonCode: original.reasonCode,
      reasonLabel: `Reversal of: ${original.reasonLabel}`,
      balanceAfter: newBalance,
      workerInitials: reversedBy,
      timeStamp: new Date(),
    };

    transaction.set(reversalRef, reversalEntry);
    transaction.update(studentRef, { pelBalance: newBalance, pelBalanceUpdatedAt: new Date() });
    transaction.update(originalRef, {
      isReversed: true,
      reversedAt: new Date(),
      reversedBy,
      reversalTransactionId: reversalRef.id,
    });

    return true;
  });
}

// Earning-rule CRUD (admin-configurable incentive presets)

export async function loadEarningRules(activeOnly = false): Promise<PelEarningRule[]> {
  const clauses = activeOnly ? [where("active", "==", true)] : [];
  const q = query(collection(db, "pelEarningRules"), ...clauses);
  const snap = await getDocs(q);
  const rules = snap.docs.map((d) => ({ ...d.data(), id: d.id }) as PelEarningRule);
  return rules.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

// Firestore's addDoc rejects any field whose value is literally `undefined`, so
// optional fields left blank by a caller (e.g. an empty "category" input) are
// stripped here rather than trusting every call site to omit the key itself.
function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

export async function createEarningRule(
  rule: Omit<PelEarningRule, "id" | "createdAt" | "createdBy">,
  createdBy: string
): Promise<string> {
  const ref = await addDoc(collection(db, "pelEarningRules"), {
    ...stripUndefined(rule),
    createdBy,
    createdAt: new Date(),
  });
  return ref.id;
}

export async function updateEarningRule(
  id: string,
  updates: Partial<PelEarningRule>,
  updatedBy: string
): Promise<void> {
  await updateDoc(doc(db, "pelEarningRules", id), { ...updates, updatedBy, updatedAt: new Date() });
}

export async function deactivateEarningRule(id: string, updatedBy: string): Promise<void> {
  await updateEarningRule(id, { active: false }, updatedBy);
}

// Prize/price list CRUD

export async function loadPrizeItems(activeOnly = false): Promise<PrizeItem[]> {
  const clauses = activeOnly ? [where("active", "==", true)] : [];
  const q = query(collection(db, "prizeItems"), ...clauses);
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ ...d.data(), id: d.id }) as PrizeItem);
  return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function createPrizeItem(
  item: Omit<PrizeItem, "id" | "createdAt" | "createdBy">,
  createdBy: string
): Promise<string> {
  const ref = await addDoc(collection(db, "prizeItems"), {
    ...stripUndefined(item),
    createdBy,
    createdAt: new Date(),
  });
  return ref.id;
}

export async function updatePrizeItem(id: string, updates: Partial<PrizeItem>, updatedBy: string): Promise<void> {
  await updateDoc(doc(db, "prizeItems", id), { ...updates, updatedBy, updatedAt: new Date() });
}

export async function deactivatePrizeItem(id: string, updatedBy: string): Promise<void> {
  await updatePrizeItem(id, { active: false }, updatedBy);
}
