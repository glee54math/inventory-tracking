import { useCallback, useState } from "react";
import type { Problem, ProblemType } from "./types";

// ============================================================================
// "Try one like it" debt that survives leaving the unit.
//
// After a solve that needed help, a lab's UnitView locks Practice until the
// student solves one problem of the SAME kind on their own (owesRetry). That
// flag used to live in UnitView's own state, and UnitView is keyed by unit id,
// so switching to another unit (or Home) and back, or reloading, cleared it:
// a side door around the lock (MG10 review C1-01). The lab component now keeps
// one debt per unit here, mirrored to sessionStorage, and hands it to UnitView,
// which starts in the owed problem kind with the lock on.
//
// Used by every shell with the retry lock: MK1–MK4, MG1, MG10.
// ============================================================================

/** The problem kind a student still owes a clean solve of, in one unit. */
export interface RetryDebt {
  /** Index into unit.problems. */
  type: number;
  /** The bucket that problem was drawn for (null for a type with no buckets). */
  bucket: string | null;
  /** The student was in the all-types mode (vs. one picked type). */
  mix: boolean;
}

/** One slot of a UnitView shuffle bag: the problem maker plus where it came from. */
export interface BagItem {
  type: number;
  bucket: string | null;
  make: () => Problem;
}

/** Every bag slot for a mode: one per bucket (or one per type with no buckets). */
export function bagItems(problems: ProblemType[], typeIdx: number | "mix"): BagItem[] {
  const idxs = typeIdx === "mix" ? problems.map((_, i) => i) : [typeIdx];
  return idxs.flatMap((i): BagItem[] => {
    const pt = problems[i];
    return pt.buckets && pt.buckets.length > 0
      ? pt.buckets.map((b) => ({ type: i, bucket: b, make: () => pt.make(b) }))
      : [{ type: i, bucket: null, make: () => pt.make() }];
  });
}

/** The bag slot for a carried-over debt, or null if the unit no longer has that type. */
export function debtItem(problems: ProblemType[], d: RetryDebt): BagItem | null {
  const pt = problems[d.type];
  if (!pt) return null;
  return { type: d.type, bucket: d.bucket, make: () => pt.make(d.bucket ?? undefined) };
}

type Debts = Record<string, RetryDebt>;

const read = (key: string): Debts => {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Debts) : {};
  } catch {
    return {};
  }
};

const save = (key: string, debts: Debts) => {
  try {
    if (Object.keys(debts).length === 0) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, JSON.stringify(debts));
  } catch {
    // Private mode / storage full: the debt still lives in memory for this visit.
  }
};

/**
 * Per-unit retry debts for one lab and one student, kept in sessionStorage
 * under `retryDebt:{key}` (pass `${MODULE_ID}:${studentId}`), so a reload in
 * the same tab keeps them but a new session starts clean.
 */
export function useRetryDebts(key: string) {
  const storageKey = `retryDebt:${key}`;
  const [state, setState] = useState(() => ({ key: storageKey, debts: read(storageKey) }));
  let current = state;
  if (state.key !== storageKey) {
    // A different student signed in: load their debts.
    current = { key: storageKey, debts: read(storageKey) };
    setState(current);
  }
  const setDebt = useCallback((unitId: string, debt: RetryDebt | null) => {
    setState((s) => {
      const debts = { ...s.debts };
      if (debt) debts[unitId] = debt;
      else delete debts[unitId];
      save(s.key, debts);
      return { ...s, debts };
    });
  }, []);
  const clearDebts = useCallback(() => {
    setState((s) => {
      save(s.key, {});
      return { ...s, debts: {} };
    });
  }, []);
  return { debts: current.debts, setDebt, clearDebts };
}
