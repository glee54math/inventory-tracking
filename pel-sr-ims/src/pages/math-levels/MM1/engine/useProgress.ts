import { useCallback, useEffect, useState } from "react";

export interface UnitProgress {
  solved: number;
  /** Problems solved cleanly (no revealed answers, at most one hint). */
  clean: number;
}

export type ProgressMap = Record<string, UnitProgress>;

export const MASTERY_GOAL = 5;
const KEY = "ratio-lab:progress:v1";

const load = (): ProgressMap => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
};

/**
 * Per-browser progress. In the PEL app this is the piece to swap for a
 * Firestore-backed hook with the same return shape.
 */
export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      /* storage unavailable: progress lasts for this visit only */
    }
  }, [progress]);

  const record = useCallback((unitId: string, clean: boolean) => {
    setProgress((p) => {
      const cur = p[unitId] ?? { solved: 0, clean: 0 };
      return { ...p, [unitId]: { solved: cur.solved + 1, clean: cur.clean + (clean ? 1 : 0) } };
    });
  }, []);

  const reset = useCallback(() => setProgress({}), []);

  return { progress, record, reset };
}
