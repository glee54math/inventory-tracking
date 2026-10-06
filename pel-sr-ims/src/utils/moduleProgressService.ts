// moduleProgressService.ts
// Firestore access for per-unit practice progress on standalone practice modules
// (MM1_RatioLab, MG11_PowersOfTen, ...). See moduleProgressTypes.ts for the shapes
// and useModuleProgress.ts (src/hooks) for the localStorage-cached hook built on
// top of this — components should use that hook rather than calling these
// functions directly.

import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { ModuleAttempt, ProgressMap } from "./moduleProgressTypes";

function summaryRef(location: string, studentId: string, moduleId: string) {
  return doc(db, "students", location, "students", studentId, "moduleProgress", moduleId);
}

function attemptsRef(location: string, studentId: string, moduleId: string) {
  return collection(
    db,
    "students",
    location,
    "students",
    studentId,
    "moduleProgress",
    moduleId,
    "attempts"
  );
}

export async function loadModuleProgress(
  location: string,
  studentId: string,
  moduleId: string
): Promise<ProgressMap> {
  const snap = await getDoc(summaryRef(location, studentId, moduleId));
  if (!snap.exists()) return {};
  const data = snap.data();
  return (data.units ?? {}) as ProgressMap;
}

export async function saveModuleProgress(
  location: string,
  studentId: string,
  moduleId: string,
  units: ProgressMap
): Promise<void> {
  await setDoc(summaryRef(location, studentId, moduleId), {
    units,
    lastUpdated: new Date(),
  });
}

export async function logModuleAttempt(
  location: string,
  studentId: string,
  moduleId: string,
  attempt: Omit<ModuleAttempt, "timestamp">
): Promise<void> {
  await addDoc(attemptsRef(location, studentId, moduleId), {
    ...attempt,
    timestamp: new Date(),
  });
}
