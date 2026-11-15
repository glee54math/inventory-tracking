// Two number patterns from two rules (5.OA.3). One source for the pattern
// tables, the plotted points and the graded answers. Imported by units AND
// Tests (never a unit <-> Test cycle).

import { pick, randInt } from "../../../shared/lib/math";
import { draw } from "./expr";

export interface Rule {
  start: number;
  add: number;
}

/** The first `count` terms: start, start + add, ... */
export const terms = (r: Rule, count: number): number[] => Array.from({ length: count }, (_, i) => r.start + i * r.add);
/** The nth term (1st term = start). */
export const termAt = (r: Rule, n: number): number => r.start + (n - 1) * r.add;

export type Relation = { kind: "times"; k: number } | { kind: "more"; c: number };

/** How Pattern B's terms relate to Pattern A's, or null when neither "times" nor "more than" fits every term. */
export const relationOf = (a: number[], b: number[]): Relation | null => {
  const c = b[0] - a[0];
  if (c > 0 && a.every((x, i) => b[i] - x === c)) return { kind: "more", c };
  const nz = a.find((x) => x !== 0);
  if (nz !== undefined) {
    const k = b[a.indexOf(nz)] / nz;
    if (Number.isInteger(k) && k > 1 && a.every((x, i) => b[i] === k * x)) return { kind: "times", k };
  }
  return null;
};

export const relationWords = (r: Relation): string => (r.kind === "times" ? `${r.k} times` : `${r.c} more than`);

export interface PatternPair {
  A: Rule;
  B: Rule;
  rel: Relation;
}

/**
 * Two rules whose terms relate by "times" (B starts at k × A's start and adds
 * k × A's add) or by "more than" (same add, B starts c higher). `cap` keeps
 * every one of the first `count` terms at or below it (for the graph).
 * For "more", `trap` makes B's 1st term exactly 2 × A's 1st term, so "times 2"
 * fits the first pair but no other (Unit 5's "inspect every term" trap).
 */
export const patternPair = (kind: "times" | "more", count: number, cap: number, trap = false): PatternPair =>
  draw(
    () => {
      if (kind === "times") {
        const k = pick([2, 3, 4]);
        const A: Rule = { start: pick([0, 0, 1, 2]), add: randInt(1, 6) };
        return { A, B: { start: k * A.start, add: k * A.add }, rel: { kind: "times", k } as Relation };
      }
      const add = randInt(1, 6);
      const start = trap ? randInt(1, 5) : randInt(0, 6);
      const c = trap ? start : randInt(1, 8);
      return { A: { start, add }, B: { start: start + c, add }, rel: { kind: "more", c } as Relation };
    },
    ({ A, B, rel }) => {
      const a = terms(A, count);
      const b = terms(B, count);
      const r = relationOf(a, b);
      return (
        termAt(B, count) <= cap &&
        termAt(A, count) <= cap &&
        r !== null &&
        r.kind === rel.kind &&
        // the rules don't give the relation away by both adding the same in "times" (they can't), and
        // "more" never also reads as "times" (relationOf checks every term)
        A.add !== 0
      );
    }
  );

/** Ordered pairs (A term, B term) for the first `count` terms. */
export const pairsOf = (p: PatternPair, count: number): [number, number][] => {
  const a = terms(p.A, count);
  const b = terms(p.B, count);
  return a.map((x, i) => [x, b[i]]);
};

/** A grid size that fits the points: steps of 1 up to 20, then steps of 2. */
export const gridFor = (pts: [number, number][]) => {
  const xMax = Math.max(4, ...pts.map((p) => p[0]));
  const yMax = Math.max(4, ...pts.map((p) => p[1]));
  return { xMax: xMax + (xMax % 2), yMax: yMax + (yMax % 2) };
};

export const ruleText = (r: Rule): string => `Start at ${r.start}. Add ${r.add} each time.`;

export const ordinal = (n: number): string => {
  const s = n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th";
  return `${n}${s}`;
};
