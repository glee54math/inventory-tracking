import { useCallback, useEffect, useState } from "react";
import {
  loadModuleProgress,
  logModuleAttempt,
  saveModuleProgress,
} from "../utils/moduleProgressService";
import type { ProgressMap, UnitProgress } from "../utils/moduleProgressTypes";

export type { ProgressMap, UnitProgress } from "../utils/moduleProgressTypes";

export const MASTERY_GOAL = 5;

/**
 * An entry (unit, shape, topic — whatever `record()`'s `unitId` names) is
 * mastered once every one of its `requiredBuckets` scenario-classes has at
 * least one clean solve — not a separate `goal`-clean-solves floor on top of
 * that, since covering every bucket already implies at least that many
 * clean solves (each newly-covered bucket costs one, per `record()` above).
 * A single bucket-coverage bar is also simpler for a student to reason about
 * than two overlapping ones. Entries with no bucket list (requiredBuckets
 * undefined or empty — most of the project, today) fall back to the plain
 * "clean solves >= goal" bar, since there's nothing to divide evenly across.
 * Deliberately decoupled from the math-levels `Unit` type (plain
 * `requiredBuckets`/`goal` params instead) so this hook stays generic —
 * callers pass `unit.requiredBuckets`, but a caller with no `Unit` object at
 * all (e.g. a per-shape or per-topic progress entry) can use it too.
 */
export function isMastered(goal: number, requiredBuckets: string[] | undefined, p?: UnitProgress): boolean {
  if (!requiredBuckets || requiredBuckets.length === 0) return (p?.clean ?? 0) >= goal;
  const covered = p?.coveredBuckets ?? [];
  return requiredBuckets.every((b) => covered.includes(b));
}

/**
 * Stars divide up evenly across bucket coverage instead of "goal-1 stars
 * from clean-solve count, then a separate pass/fail cliff for the last
 * star" — ceil() means the very first bucket already lights a star (not
 * "do several problems before anything happens"), and each new bucket can
 * either bump the star count or not depending on where the fraction lands,
 * same as any ceil-based progress bar. The one exception: even though the
 * ceil'd fraction can round all the way up to `goal` before every bucket is
 * covered (e.g. 8 of 9 buckets → ceil(5×8/9) = 5), the last star is
 * reserved for TRUE completion via `isMastered` — otherwise "all stars lit"
 * would overstate what's actually been proven. Entries with no bucket list
 * keep the old plain clean-count bar (nothing to divide evenly across).
 */
export function starCount(goal: number, requiredBuckets: string[] | undefined, p?: UnitProgress): number {
  if (isMastered(goal, requiredBuckets, p)) return goal;
  if (!requiredBuckets || requiredBuckets.length === 0) return Math.min(goal - 1, p?.clean ?? 0);
  const covered = p?.coveredBuckets ?? [];
  const coveredCount = requiredBuckets.filter((b) => covered.includes(b)).length;
  return Math.min(goal - 1, Math.ceil((goal * coveredCount) / requiredBuckets.length));
}

const cacheKey = (studentId: string | null, location: string | null, moduleId: string) =>
  studentId && location
    ? `module-progress:${location}:${studentId}:${moduleId}:v1`
    : `module-progress:guest:${moduleId}:v1`;

function loadCache(key: string): ProgressMap {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function saveCache(key: string, progress: ProgressMap) {
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    /* storage unavailable: progress lasts for this visit only */
  }
}

function mergeProgress(remote: ProgressMap, local: ProgressMap): ProgressMap {
  const merged: ProgressMap = { ...local };
  for (const unitId of Object.keys(remote)) {
    const r = remote[unitId];
    const l = local[unitId];
    merged[unitId] = l
      ? {
          solved: Math.max(r.solved, l.solved),
          clean: Math.max(r.clean, l.clean),
          testScore: Math.max(r.testScore ?? 0, l.testScore ?? 0) || undefined,
          introDone: (r.introDone || l.introDone) || undefined,
          introDoneAtSolved: Math.max(r.introDoneAtSolved ?? 0, l.introDoneAtSolved ?? 0) || undefined,
          coveredBuckets:
            r.coveredBuckets || l.coveredBuckets
              ? Array.from(new Set([...(r.coveredBuckets ?? []), ...(l.coveredBuckets ?? [])]))
              : undefined,
        }
      : r;
  }
  return merged;
}

/**
 * Per-unit practice progress/mastery for a standalone practice module (e.g.
 * MM1_RatioLab's 6 units, or MG11_PowersOfTen's single "main" unit). Same
 * return shape as the original MM1-only, localStorage-only useProgress hook
 * this replaces — Firestore-backed once a student is logged in (studentId/
 * location from useStudentContext), with a localStorage cache so stars render
 * instantly and a save still lands if the connection drops mid-session.
 *
 * studentId/location are null for routes with no logged-in student (the admin
 * preview route, or /student-levels/:levelId) — progress then stays local to
 * this browser only, same as the module behaved before this hook existed.
 *
 * The localStorage cache is keyed per student (not just per module) since
 * students share browsers on classroom computers via a shared login PIN —
 * without that, one student's stars would leak into the next student's view
 * before the Firestore fetch resolves.
 */
export function useModuleProgress(
  studentId: string | null,
  location: string | null,
  moduleId: string
) {
  const key = cacheKey(studentId, location, moduleId);
  const [progress, setProgress] = useState<ProgressMap>(() => loadCache(key));

  useEffect(() => {
    setProgress(loadCache(key));
    if (!studentId || !location) return;
    let cancelled = false;
    loadModuleProgress(location, studentId, moduleId).then((remote) => {
      if (cancelled) return;
      setProgress((local) => mergeProgress(remote, local));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    saveCache(key, progress);
  }, [key, progress]);

  const persist = useCallback(
    (next: ProgressMap) => {
      if (!studentId || !location) return;
      saveModuleProgress(location, studentId, moduleId, next).catch(() => {
        /* best-effort: localStorage cache already has it, Firestore catches up next write */
      });
    },
    [studentId, location, moduleId]
  );

  const record = useCallback(
    (unitId: string, clean: boolean, bucket?: string) => {
      setProgress((p) => {
        const cur = p[unitId] ?? { solved: 0, clean: 0 };
        // Only a CLEAN solve counts as covering a bucket — same bar as the
        // `clean` counter itself, so a star still means "solved it properly,"
        // not just "saw every scenario at some point, however messily."
        const coveredBuckets =
          clean && bucket && !cur.coveredBuckets?.includes(bucket) ? [...(cur.coveredBuckets ?? []), bucket] : cur.coveredBuckets;
        const next = {
          ...p,
          [unitId]: {
            ...cur,
            solved: cur.solved + 1,
            clean: cur.clean + (clean ? 1 : 0),
            ...(coveredBuckets ? { coveredBuckets } : {}),
          },
        };
        persist(next);
        return next;
      });
      if (studentId && location) {
        logModuleAttempt(location, studentId, moduleId, { unitId, mode: "problem", clean, ...(bucket ? { bucket } : {}) }).catch(
          () => {}
        );
      }
    },
    [studentId, location, moduleId, persist]
  );

  const recordTest = useCallback(
    (unitId: string, score: number) => {
      setProgress((p) => {
        const cur = p[unitId] ?? { solved: 0, clean: 0 };
        const next = { ...p, [unitId]: { ...cur, testScore: Math.max(cur.testScore ?? 0, score) } };
        persist(next);
        return next;
      });
      if (studentId && location) {
        logModuleAttempt(location, studentId, moduleId, { unitId, mode: "test", score }).catch(
          () => {}
        );
      }
    },
    [studentId, location, moduleId, persist]
  );

  const recordIntroDone = useCallback(
    (unitId: string) => {
      setProgress((p) => {
        const cur = p[unitId] ?? { solved: 0, clean: 0 };
        // Always re-stamp introDoneAtSolved (not just on first completion) so a
        // unit with reintroEverySolved correctly resets its "since last intro"
        // counter every time the gate is passed, not just the very first time.
        const next = { ...p, [unitId]: { ...cur, introDone: true, introDoneAtSolved: cur.solved } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const reset = useCallback(() => {
    setProgress({});
    persist({});
  }, [persist]);

  return { progress, record, recordTest, recordIntroDone, reset };
}
