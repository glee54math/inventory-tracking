// Lab-local number-theory helpers for FactorsMultiplesAndPatternsLab. Every
// diagram AND every generator/answer check in this lab derives its facts from
// these few functions, so a picture can never disagree with the graded answer.
// Test files may import from here (it's not their paired unit file, so there's
// no unit <-> test import cycle).

/** Every factor pair of n as [small, big], smallest first. Found the
 *  systematic way: try d = 1, 2, 3, ... and stop once d × d > n. */
export const factorPairs = (n: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let d = 1; d * d <= n; d++) if (n % d === 0) out.push([d, n / d]);
  return out;
};

/** All factors of n in increasing order (a square's middle factor listed once). */
export const factorsOf = (n: number): number[] => {
  const small = factorPairs(n).map(([a]) => a);
  const big = factorPairs(n)
    .map(([, b]) => b)
    .filter((b) => !small.includes(b))
    .reverse();
  return [...small, ...big];
};

/** The largest number you ever need to try when checking n systematically. */
export const lastCheck = (n: number): number => Math.floor(Math.sqrt(n));

export const isSquare = (n: number): boolean => Number.isInteger(Math.sqrt(n));

export type PrimeKind = "prime" | "composite" | "neither";

export const primeKind = (n: number): PrimeKind => {
  if (n < 2) return "neither";
  return factorPairs(n).length === 1 ? "prime" : "composite";
};

export const isPrime = (n: number): boolean => primeKind(n) === "prime";

/** The 8 primes from 1 to 20 — the one memorized list in this lab. */
export const PRIMES_TO_20 = [2, 3, 5, 7, 11, 13, 17, 19];

/** Smallest factor bigger than 1 (n itself when n is prime). */
export const smallestFactor = (n: number): number => {
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return d;
  return n;
};

/** Distance from n to the nearest multiple of k (0 when n is a multiple). */
export const distanceToMultiple = (n: number, k: number): number => Math.min(n % k, k - (n % k)) % k;

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------

export interface PatternRule {
  /** First operation. */
  op1: "+" | "-" | "×";
  n1: number;
  /** Optional second operation (two-step rules like "double, then subtract 1"). */
  op2?: "+" | "-";
  n2?: number;
}

export const applyRule = (x: number, r: PatternRule): number => {
  let y = r.op1 === "+" ? x + r.n1 : r.op1 === "-" ? x - r.n1 : x * r.n1;
  if (r.op2) y = r.op2 === "+" ? y + (r.n2 ?? 0) : y - (r.n2 ?? 0);
  return y;
};

/** First `count` terms of a pattern starting at `start`. */
export const patternTerms = (start: number, r: PatternRule, count: number): number[] => {
  const out = [start];
  while (out.length < count) out.push(applyRule(out[out.length - 1], r));
  return out;
};

const opWord = (op: "+" | "-" | "×", n: number): string => {
  if (op === "+") return `add ${n}`;
  if (op === "-") return `subtract ${n}`;
  if (n === 2) return "double it";
  if (n === 3) return "triple it";
  return `multiply by ${n}`;
};

/** Kid-friendly rule text, e.g. "add 4" or "double it, then subtract 1". */
export const ruleText = (r: PatternRule): string => (r.op2 ? `${opWord(r.op1, r.n1)}, then ${opWord(r.op2, r.n2 ?? 0)}` : opWord(r.op1, r.n1));

/** Short arrow label for diagrams, e.g. "+4" or "×2 −1". */
export const ruleShort = (r: PatternRule): string => {
  const sym = (op: string) => (op === "-" ? "−" : op);
  return `${sym(r.op1)}${r.n1}${r.op2 ? ` ${sym(r.op2)}${r.n2}` : ""}`;
};

/** Tiles in stage s (1-based) of a growing shape pattern: start with a, add b each stage. */
export const stageTiles = (a: number, b: number, s: number): number => a + b * (s - 1);
