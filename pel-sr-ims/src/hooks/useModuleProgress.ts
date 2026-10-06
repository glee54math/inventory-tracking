import { useCallback, useEffect, useState } from "react";
import {
  loadModuleProgress,
  logModuleAttempt,
  saveModuleProgress,
} from "../utils/moduleProgressService";
import type { ProgressMap } from "../utils/moduleProgressTypes";

export type { ProgressMap, UnitProgress } from "../utils/moduleProgressTypes";

export const MASTERY_GOAL = 5;

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
    (unitId: string, clean: boolean) => {
      setProgress((p) => {
        const cur = p[unitId] ?? { solved: 0, clean: 0 };
        const next = {
          ...p,
          [unitId]: { ...cur, solved: cur.solved + 1, clean: cur.clean + (clean ? 1 : 0) },
        };
        persist(next);
        return next;
      });
      if (studentId && location) {
        logModuleAttempt(location, studentId, moduleId, { unitId, mode: "problem", clean }).catch(
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

  const reset = useCallback(() => {
    setProgress({});
    persist({});
  }, [persist]);

  return { progress, record, recordTest, reset };
}
