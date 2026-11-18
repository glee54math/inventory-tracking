// labOrder.ts
// Lab order for the student portal: which labs a lab "needs" first, which labs a
// student has finished, and Mr. Lee's PIN override. The needs themselves live in
// levelSubsections.ts (LAB_NEEDS).
//
// Rules (user decisions 2026-11-18):
//   - Needs only NUDGE. A student can always open any lab.
//   - A lab is finished when its Module Test is passed (testScore on the "module"
//     key of that lab's moduleProgress doc >= the Module Test's passScore), or when
//     Mr. Lee marks it finished with his PIN.
//
// Student-safe: no planning files or review data are imported here.

import { deleteField, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { LAB_NEEDS, LEVEL_SKILLS, type LevelSkill } from "./levelSubsections";
import { MATH_LEVELS } from "./types";

/**
 * Mr. Lee's PIN. Same PIN, and the same client-side check, as WhatsNextCard:
 * it keeps students from tapping it by accident, but anyone who reads the
 * app's code can find it.
 */
export const TEACHER_PIN = "3188";

/** The key every lab shell records its Module Test under (MODULE_PROGRESS_KEY). */
const MODULE_KEY = "module";

export interface LabInfo {
  /** componentFile, e.g. "MG2_PlaceValueTo120Lab" — also the lab's moduleProgress id. */
  id: string;
  level: string;
  label: string;
  skill: LevelSkill;
  needs: string[];
}

const humanize = (s: string) => s.replace(/([a-z\d])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

const levelIndex = (level: string) => {
  const i = (MATH_LEVELS as readonly string[]).indexOf(level);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

/** Every standalone lab, in order: by level (MATH_LEVELS), then LEVEL_SKILLS order. */
export const LABS: LabInfo[] = Object.entries(LEVEL_SKILLS)
  .sort(([a], [b]) => levelIndex(a) - levelIndex(b))
  .flatMap(([level, skills]) =>
    skills
      .filter((s): s is Extract<LevelSkill, { type: "standalone" }> => s.type === "standalone")
      .map((s) => ({
        id: s.componentFile,
        level,
        label: s.label ?? humanize(s.skillId),
        skill: s,
        needs: LAB_NEEDS[s.componentFile] ?? [],
      }))
  );

export const LAB_BY_ID: Record<string, LabInfo> = Object.fromEntries(LABS.map((l) => [l.id, l]));

/** Every lab this lab needs, directly or through its needs (nearest first). */
export function allNeeds(id: string): string[] {
  const out: string[] = [];
  const queue = [...(LAB_BY_ID[id]?.needs ?? [])];
  while (queue.length) {
    const n = queue.shift()!;
    if (out.includes(n) || n === id) continue;
    out.push(n);
    queue.push(...(LAB_BY_ID[n]?.needs ?? []));
  }
  return out;
}

/** Labs that list this lab in their needs. */
export function neededBy(id: string): string[] {
  return LABS.filter((l) => l.needs.includes(id)).map((l) => l.id);
}

// ---------------------------------------------------------------------------
// Module Test pass scores. Read from each lab's ModuleTest.tsx source text (not
// the module itself, which would pull in the whole lab), and only for the labs
// asked about, so each file is its own tiny chunk.

const moduleTestSources = import.meta.glob("../pages/math-levels/*/*/units/ModuleTest.tsx", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

const moduleTestPath = (lab: LabInfo) =>
  `../pages/math-levels/${lab.level}/${lab.id.slice(lab.level.length + 1)}/units/ModuleTest.tsx`;

/** Does this lab have a Module Test? Labs without one can only be marked finished by Mr. Lee. */
export function hasModuleTest(id: string): boolean {
  const lab = LAB_BY_ID[id];
  return !!lab && moduleTestPath(lab) in moduleTestSources;
}

const passScoreCache = new Map<string, Promise<number | null>>();

export function modulePassScore(id: string): Promise<number | null> {
  const lab = LAB_BY_ID[id];
  const load = lab && moduleTestSources[moduleTestPath(lab)];
  if (!load) return Promise.resolve(null);
  if (!passScoreCache.has(id)) {
    passScoreCache.set(
      id,
      load()
        .then((src) => {
          // The module test object's passScore is the last one in the file.
          const all = [...src.matchAll(/passScore:\s*(\d+)/g)];
          return all.length ? Number(all[all.length - 1][1]) : null;
        })
        .catch(() => null)
    );
  }
  return passScoreCache.get(id)!;
}

// ---------------------------------------------------------------------------
// Finished status

export interface LabStatus {
  finished: boolean;
  /** Why it counts as finished. */
  by?: "test" | "teacher";
  /** Best Module Test score, if any. */
  testScore?: number;
  passScore?: number | null;
  /** Mr. Lee marked it finished. */
  teacherMarked: boolean;
}

export type LabStatusMap = Record<string, LabStatus>;

// Kept in the same moduleProgress collection the labs already write to, under an
// id no lab uses, so the existing database rules cover it.
const overridesRef = (location: string, studentId: string) =>
  doc(db, "students", location, "students", studentId, "moduleProgress", "_labOverrides");

const progressRef = (location: string, studentId: string, labId: string) =>
  doc(db, "students", location, "students", studentId, "moduleProgress", labId);

/** Same key as useModuleProgress's cache: a test just taken may not have reached the database yet. */
function cachedModuleScore(location: string, studentId: string, labId: string): number | undefined {
  try {
    const raw = localStorage.getItem(`module-progress:${location}:${studentId}:${labId}:v1`);
    return raw ? JSON.parse(raw)?.[MODULE_KEY]?.testScore : undefined;
  } catch {
    return undefined;
  }
}

export async function loadLabStatuses(location: string, studentId: string, labIds: string[]): Promise<LabStatusMap> {
  const ids = Array.from(new Set(labIds)).filter((id) => LAB_BY_ID[id]);
  const [overrides, ...rest] = await Promise.all([
    getDoc(overridesRef(location, studentId))
      .then((s) => (s.exists() ? ((s.data().labs ?? {}) as Record<string, { finished?: boolean }>) : {}))
      .catch(() => ({}) as Record<string, { finished?: boolean }>),
    ...ids.map(async (id) => {
      const [snap, passScore] = await Promise.all([
        getDoc(progressRef(location, studentId, id)).catch(() => null),
        modulePassScore(id),
      ]);
      const remote = snap?.exists() ? (snap.data().units?.[MODULE_KEY]?.testScore as number | undefined) : undefined;
      const local = cachedModuleScore(location, studentId, id);
      const best = Math.max(remote ?? -1, local ?? -1);
      return { id, testScore: best >= 0 ? best : undefined, passScore };
    }),
  ]);
  const out: LabStatusMap = {};
  for (const r of rest as { id: string; testScore?: number; passScore: number | null }[]) {
    const passed = r.passScore != null && r.testScore != null && r.testScore >= r.passScore;
    const teacherMarked = !!(overrides as Record<string, { finished?: boolean }>)[r.id]?.finished;
    out[r.id] = {
      finished: passed || teacherMarked,
      by: passed ? "test" : teacherMarked ? "teacher" : undefined,
      testScore: r.testScore,
      passScore: r.passScore,
      teacherMarked,
    };
  }
  return out;
}

/** Mr. Lee's override: mark a lab finished for this student, or take the mark away. */
export async function setTeacherFinished(location: string, studentId: string, labId: string, finished: boolean) {
  await setDoc(
    overridesRef(location, studentId),
    { labs: { [labId]: finished ? { finished: true, at: new Date() } : deleteField() }, lastUpdated: new Date() },
    { merge: true }
  );
}

/** Direct needs of this lab that aren't finished yet. */
export function unmetNeeds(id: string, statuses: LabStatusMap): LabInfo[] {
  return (LAB_BY_ID[id]?.needs ?? []).filter((n) => !statuses[n]?.finished).map((n) => LAB_BY_ID[n]).filter(Boolean);
}

/** The lab to suggest next among these: the first one not finished whose needs are all finished. */
export function nextUp(ids: string[], statuses: LabStatusMap): string | null {
  const open = ids.filter((id) => !statuses[id]?.finished);
  return open.find((id) => unmetNeeds(id, statuses).length === 0) ?? open[0] ?? null;
}
