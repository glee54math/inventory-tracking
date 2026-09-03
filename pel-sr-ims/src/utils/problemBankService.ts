// problemBankService.ts
// Firestore access for the cached AI-assisted practice problem bank.
// Collection "problemBank" is written by the offline seed script
// (scripts/generateProblemBank.ts, via firebase-admin) or manually —
// never directly from student-facing UI. This file only reads, plus
// bumps usageCount so overused problems can be identified later.

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { NewProblemDoc, ProblemDoc } from "./problemTypes";

const COLLECTION = "problemBank";

// Eligibility is level-only for now (see levelSubsections.ts) — pass `range` only once
// problems are actually being tagged with a documented "1-10"-style page range.
export async function getProblemsForLevel(
  level: string,
  opts: { range?: string; skillId?: string } = {}
): Promise<ProblemDoc[]> {
  const constraints = [where("level", "==", level)];
  if (opts.range) constraints.push(where("range", "==", opts.range));
  if (opts.skillId) constraints.push(where("skillId", "==", opts.skillId));

  const q = query(collection(db, COLLECTION), ...constraints);
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProblemDoc));
}

// Used by the offline seed script (and manual seeding) to add a problem.
// Never called from the student-facing client.
export async function addProblem(problem: NewProblemDoc): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...problem,
    createdAt: problem.createdAt ?? Date.now(),
    usageCount: problem.usageCount ?? 0,
  });
  return ref.id;
}

export async function incrementUsage(problemId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, problemId), {
    usageCount: increment(1),
  });
}
