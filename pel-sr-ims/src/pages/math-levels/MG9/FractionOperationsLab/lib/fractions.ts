import { gcd, pick, randInt } from "../../../shared/lib/math";

// ============================================================================
// Lab-local fraction-operations math. One source of truth for every unit's
// generators, every *Test.tsx, AND every diagram that pictures an
// intermediate state (the unbundled whole in a borrow subtraction, a line
// plot's tick values) — so the picture and the graded answer can never be
// derived two different ways. Importing this from both a unit file and its
// paired *Test.tsx is safe (this file imports neither), unlike a Test file
// importing back from its own unit file (the circular-import trap).
//
// Amounts are carried as integer PIECE counts of 1/d wherever possible
// (e.g. 2 3/8 is 19 pieces of eighths) — exact, no floating point.
// ============================================================================

/** Units 1-4 use the same general small-denominator range as
 *  MG9_IntroToFractionsLab (its helpers draw from 2-10). */
export const DEN_MIN = 2;
export const DEN_MAX = 10;

/** Word-problem denominators: still inside 2-10, but only the ones that show
 *  up in real measurement stories (no sevenths/ninths of a mile). */
export const WORD_DENS = [2, 3, 4, 5, 6, 8, 10] as const;

/** Unit 5 (4.MD.4) ONLY: line-plot data is in halves, fourths and eighths —
 *  the standard's own narrower set, deliberately NOT the 2-10 range above. */
export const PLOT_DENS = [2, 4, 8] as const;
export type PlotDen = (typeof PLOT_DENS)[number];

/** Never-simplified mixed-number text for a count of 1/d pieces:
 *  (19, 8) -> "2 3/8", (3, 8) -> "3/8", (16, 8) -> "2". Like-denominator
 *  work keeps the denominator it started with, so this deliberately does
 *  NOT reduce to lowest terms. */
export function mixedText(pieces: number, d: number): string {
  const w = Math.floor(pieces / d);
  const r = pieces % d;
  if (r === 0) return String(w);
  return w === 0 ? `${r}/${d}` : `${w} ${r}/${d}`;
}

const PIECE_WORDS: Record<number, string> = { 2: "halves", 3: "thirds", 4: "fourths", 5: "fifths", 6: "sixths", 7: "sevenths", 8: "eighths", 9: "ninths", 10: "tenths" };
/** Plural piece name for a denominator: 6 -> "sixths". */
export const pieceWord = (d: number): string => PIECE_WORDS[d] ?? `${d}ths`;

/** Plain "n/d" text (never simplified, never mixed). */
export const fracStr = (n: number, d: number): string => `${n}/${d}`;

/** The first `k` candidates (in priority order — most diagnostic misconception
 *  first) that differ from the correct answer and from each other. Every
 *  candidate passed in must be in the same canonical text form as `correct`
 *  (e.g. all mixedText()), so string-equal means value-equal. */
export function pickDistractors(correct: string, candidates: string[], k = 2): string[] {
  const out: string[] = [];
  for (const c of candidates) {
    if (c !== correct && !out.includes(c)) out.push(c);
    if (out.length === k) break;
  }
  return out;
}

/** Whole-number part and leftover pieces of a piece count. */
export const splitMixed = (pieces: number, d: number): { whole: number; rem: number } => ({ whole: Math.floor(pieces / d), rem: pieces % d });

// ============================================================================
// Mixed-number add/subtract breakdowns — shared by Explore, Practice, Test
// AND the MixedNumberBars diagram's "after unbundling" picture.
// ============================================================================

export interface MixedSubBreakdown {
  /** True when the first fraction part is smaller than the one being taken
   *  away — one whole must be unbundled into d/d first. */
  borrow: boolean;
  /** The first number AFTER regrouping (equal to the original when no borrow). */
  regroupedWhole: number;
  regroupedNum: number;
  resultWhole: number;
  resultNum: number;
}

export function mixedSubtract(w1: number, n1: number, w2: number, n2: number, d: number): MixedSubBreakdown {
  const borrow = n1 < n2;
  const regroupedWhole = borrow ? w1 - 1 : w1;
  const regroupedNum = borrow ? n1 + d : n1;
  return { borrow, regroupedWhole, regroupedNum, resultWhole: regroupedWhole - w2, resultNum: regroupedNum - n2 };
}

export interface MixedAddBreakdown {
  rawWhole: number;
  rawNum: number;
  /** True when the fraction parts add up to d/d or more. */
  carry: boolean;
  resultWhole: number;
  resultNum: number;
}

export function mixedAdd(w1: number, n1: number, w2: number, n2: number, d: number): MixedAddBreakdown {
  const rawWhole = w1 + w2;
  const rawNum = n1 + n2;
  const carry = rawNum >= d;
  return { rawWhole, rawNum, carry, resultWhole: rawWhole + Math.floor(rawNum / d), resultNum: rawNum % d };
}

// ============================================================================
// UNIT 1 — Decomposing Fractions
// ============================================================================

/** Bucket "unit": a proper non-unit fraction a/d (2 <= a <= d-1). */
export function unitDecompParams(): { num: number; den: number } {
  const den = randInt(3, DEN_MAX);
  return { num: randInt(2, den - 1), den };
}

/** How many genuinely different two-part splits a/d has, order ignored
 *  (1+4 and 4+1 are the same split): floor(a/2). */
export const twoPartSplitCount = (a: number): number => Math.floor(a / 2);

/**
 * Bucket "twoWays": a proper a/d with a >= 4 (so it has at least two
 * different two-part splits), one split already shown (`first` + rest) and
 * a SECOND, genuinely different split asked for (`second` is never `first`
 * or `num - first`, so it isn't just the shown split read backwards).
 * Which split is shown is randomized, not always 1 + rest.
 */
export function twoWaysParams(): { num: number; den: number; first: number; second: number } {
  const num = randInt(4, DEN_MAX - 1);
  const den = randInt(num + 1, DEN_MAX);
  const first = randInt(1, num - 1);
  let second = randInt(1, num - 1);
  while (second === first || second === num - first) second = randInt(1, num - 1);
  return { num, den, first, second };
}

/** Bucket "pastOne": an improper a/d = wholes + rem/d, 1-2 wholes, rem never 0. */
export function pastOneParams(): { num: number; den: number; wholes: number; rem: number } {
  const den = randInt(DEN_MIN, DEN_MAX);
  const wholes = randInt(1, 2);
  const rem = randInt(1, den - 1);
  return { num: wholes * den + rem, den, wholes, rem };
}

/** Three-part split p + q + r = a (each >= 1) of a proper a/d. */
export function threePartParams(): { num: number; den: number; p: number; q: number; r: number } {
  const num = randInt(3, DEN_MAX - 1);
  const den = randInt(num + 1, DEN_MAX);
  const p = randInt(1, num - 2);
  const q = randInt(1, num - 1 - p);
  return { num, den, p, q, r: num - p - q };
}

// ============================================================================
// UNIT 2 — Adding and Subtracting (like denominators)
// ============================================================================

/** Bucket "addProper": n1/d + n2/d, sum stays proper (n1 + n2 <= d - 1). */
export function addProperParams(): { n1: number; n2: number; d: number } {
  const d = randInt(3, DEN_MAX);
  const n1 = randInt(1, d - 2);
  const n2 = randInt(1, d - 1 - n1);
  return { n1, n2, d };
}

/** Bucket "addRegroup": both proper, sum is improper AND not a whole
 *  number (d + 1 <= n1 + n2 <= 2d - 2), so it must become a mixed number. */
export function addRegroupParams(): { n1: number; n2: number; d: number } {
  const d = randInt(3, DEN_MAX);
  let n1: number, n2: number;
  do {
    n1 = randInt(2, d - 1);
    n2 = randInt(2, d - 1);
  } while (n1 + n2 <= d);
  return { n1, n2, d };
}

/** Bucket "subProper": n1/d - n2/d, no borrowing, answer never 0. */
export function subProperParams(): { n1: number; n2: number; d: number } {
  const d = randInt(3, DEN_MAX);
  const n1 = randInt(2, d - 1);
  return { n1, n2: randInt(1, n1 - 1), d };
}

export interface MixedPair {
  op: "add" | "sub";
  w1: number;
  n1: number;
  w2: number;
  n2: number;
  d: number;
}

/** Bucket "mixedNoRegroup": mixed ± mixed, no carry and no borrow. */
export function mixedNoRegroupParams(op: "add" | "sub" = pick(["add", "sub"] as const)): MixedPair {
  const d = randInt(3, DEN_MAX);
  if (op === "add") {
    const n1 = randInt(1, d - 2);
    return { op, w1: randInt(1, 5), n1, w2: randInt(1, 4), n2: randInt(1, d - 1 - n1), d };
  }
  const w1 = randInt(2, 6);
  const n1 = randInt(2, d - 1);
  return { op, w1, n1, w2: randInt(1, w1 - 1), n2: randInt(1, n1 - 1), d };
}

/**
 * Bucket "mixedBorrow": w1 n1/d - w2 n2/d with n1 < n2, so one whole must be
 * unbundled into d/d first (e.g. 3 1/4 - 1 3/4). `minResultWhole` = 1
 * guarantees a genuine mixed-number answer (needed wherever the answer is a
 * whole + numerator sentence); 0 also allows a proper-fraction answer like
 * 2 1/4 - 1 3/4 = 2/4, the trickiest-looking edge.
 */
export function mixedBorrowParams(minResultWhole: 0 | 1 = 1): MixedPair {
  const d = randInt(3, DEN_MAX);
  const n1 = randInt(1, d - 2);
  const n2 = randInt(n1 + 1, d - 1);
  const w1 = randInt(2 + minResultWhole, 6);
  const w2 = randInt(1, w1 - 1 - minResultWhole);
  return { op: "sub", w1, n1, w2, n2, d };
}

// ============================================================================
// UNIT 3 — Word problems (amounts as piece counts)
// ============================================================================

/** A random amount of 1/d pieces — proper (< 1) or a mixed number up to 3 wholes. */
export function randomAmount(d: number, allowMixed: boolean): number {
  if (!allowMixed) return randInt(1, d - 1);
  return randInt(1, 3) * d + randInt(1, d - 1);
}

/** Bucket "combine": x + y pieces, sometimes both proper, sometimes mixed. */
export function combineParams(): { d: number; x: number; y: number } {
  const d = pick(WORD_DENS);
  const mixed = d > 2 ? randInt(0, 1) === 1 : true;
  return { d, x: randomAmount(d, mixed), y: randomAmount(d, mixed && randInt(0, 1) === 1) };
}

/** Bucket "compare": x - y pieces, x > y, sometimes forcing a borrow. */
export function compareParams(forceBorrow?: boolean): { d: number; x: number; y: number } {
  const d = pick(WORD_DENS.filter((v) => v >= 3));
  const borrow = forceBorrow ?? randInt(0, 2) === 0;
  if (borrow) {
    // x's fraction part smaller than y's, and x's whole part bigger.
    const xn = randInt(1, d - 2);
    const yn = randInt(xn + 1, d - 1);
    const xw = randInt(2, 4);
    const yw = randInt(0, xw - 1);
    return { d, x: xw * d + xn, y: yw * d + yn };
  }
  const mixed = randInt(0, 1) === 1;
  if (!mixed) {
    const x = randInt(2, d - 1);
    return { d, x, y: randInt(1, x - 1) };
  }
  const xn = randInt(2, d - 1);
  const yn = randInt(1, xn - 1);
  const xw = randInt(1, 4);
  return { d, x: xw * d + xn, y: randInt(0, xw - 1) * d + yn };
}

/** Bucket "multiStep": start x, add y, then take away z (z < x + y). */
export function multiStepParams(): { d: number; x: number; y: number; z: number } {
  const d = pick(WORD_DENS.filter((v) => v >= 3));
  const x = randomAmount(d, randInt(0, 1) === 1);
  const y = randomAmount(d, randInt(0, 1) === 1);
  const z = randInt(1, x + y - 1);
  return { d, x, y, z };
}

// ============================================================================
// UNIT 4 — Multiplying a fraction by a whole number
// ============================================================================

/** Bucket "unitTimes": n × 1/d, product never a whole number. */
export function unitTimesParams(): { n: number; d: number } {
  const d = randInt(DEN_MIN, DEN_MAX);
  let n = randInt(2, 12);
  while (n % d === 0) n = randInt(2, 12);
  return { n, d };
}

/** Bucket "nonUnitTimes": n × a/d (a >= 2), product improper and NOT whole,
 *  so it must be rewritten as a mixed number. */
export function nonUnitTimesParams(): { n: number; a: number; d: number } {
  let n: number, a: number, d: number;
  do {
    d = randInt(3, DEN_MAX);
    a = randInt(2, d - 1);
    n = randInt(2, 6);
  } while (n * a <= d || (n * a) % d === 0);
  return { n, a, d };
}

/** Bucket "wholeProduct": n × a/d where n × a is an exact multiple of d
 *  (e.g. 4 × 3/4 = 3) — n is always a multiple of d / gcd(a, d). */
export function wholeProductParams(): { n: number; a: number; d: number } {
  const d = randInt(DEN_MIN, DEN_MAX);
  const a = randInt(1, d - 1);
  const step = d / gcd(a, d);
  const options: number[] = [];
  for (let n = step; n <= 12; n += step) if (n >= 2) options.push(n);
  return { n: pick(options), a, d };
}

/** Bucket "wordSetup": any n × a/d in a story (product may be proper, mixed or whole). */
export function wordTimesParams(): { n: number; a: number; d: number } {
  const d = pick(WORD_DENS);
  return { n: randInt(2, 8), a: randInt(1, d - 1), d };
}

// ============================================================================
// UNIT 5 — Line plots (values carried in EIGHTHS so 1/2, 1/4, 1/8 are all exact)
// ============================================================================

/** Lowest-terms mixed label for a value in eighths: 3 -> "3/8", 4 -> "1/2",
 *  10 -> "1 1/4", 16 -> "2". The ONE formatter every tick label, prompt and
 *  choice in Unit 5 uses. */
export function eighthsText(e: number): string {
  const w = Math.floor(e / 8);
  const r = e % 8;
  if (r === 0) return String(w);
  const g = gcd(r, 8);
  const frac = `${r / g}/${8 / g}`;
  return w === 0 ? frac : `${w} ${frac}`;
}

/** Lowest-terms numerator/denominator of a value in eighths (non-whole part ignored). */
export function eighthsLowest(e: number): { n: number; d: number } {
  const g = gcd(e, 8);
  return { n: e / g, d: 8 / g };
}

export interface PlotSpec {
  den: PlotDen;
  minWhole: number;
  maxWhole: number;
  /** Every measurement, in eighths. */
  data: number[];
}

/** Whole-unit span the axis covers per denominator — keeps every plot at
 *  roughly 7-9 ticks wide, so labels never crowd. */
export const plotSpan = (den: PlotDen): number => (den === 8 ? 1 : den === 4 ? 2 : 3);

/** Every tick value (in eighths) a plot with this den/range draws. */
export function plotTicks(den: PlotDen, minWhole: number, maxWhole: number): number[] {
  const step = 8 / den;
  const out: number[] = [];
  for (let e = minWhole * 8; e <= maxWhole * 8; e += step) out.push(e);
  return out;
}

export const countAt = (data: number[], e: number): number => data.filter((v) => v === e).length;

/** Random line-plot data: `n` measurements, each on a tick of the plot's
 *  own denominator, never the very first tick (no zero-length leaf). */
export function makePlot(den: PlotDen = pick(PLOT_DENS), n = randInt(8, 12)): PlotSpec {
  const minWhole = randInt(0, 2);
  const maxWhole = minWhole + plotSpan(den);
  const ticks = plotTicks(den, minWhole, maxWhole).slice(1);
  return { den, minWhole, maxWhole, data: Array.from({ length: n }, () => pick(ticks)) };
}

/** The distinct values present in the data, ascending. */
export const plotValues = (data: number[]): number[] => [...new Set(data)].sort((x, y) => x - y);
