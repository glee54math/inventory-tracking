import { gcd, lcm, pick, randInt, shuffle } from "../../../shared/lib/math";
import { formBoxes, isAnswerForm } from "../../../shared/components/answerKinds";

// ============================================================================
// Lab-local fraction math for MG10 AddingAndSubtractingFractionsLab. One
// source of truth for every unit's generators, every *Test.tsx, the diagrams
// that picture an intermediate state (pieces re-cut to the LCD, a borrowed
// whole), and the named-mistake feedback. Unit files AND their *Test.tsx
// files import this; it imports neither (no unit <-> Test cycle).
// ============================================================================

export { gcd, lcm };

export type Op = "add" | "sub";
export const signOf = (op: Op): string => (op === "add" ? "+" : "−");

/** Least common denominator. */
export const lcd = (a: number, b: number): number => lcm(a, b);

// ---------- piece names ("twelfths") ----------

const ONES = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];
const TEENS: Record<number, string> = { 10: "tenth", 11: "eleventh", 12: "twelfth", 13: "thirteenth", 14: "fourteenth", 15: "fifteenth", 16: "sixteenth", 17: "seventeenth", 18: "eighteenth", 19: "nineteenth" };
const TENS_ORD: Record<number, string> = { 2: "twentieth", 3: "thirtieth", 4: "fortieth", 5: "fiftieth", 6: "sixtieth" };
const TENS: Record<number, string> = { 2: "twenty", 3: "thirty", 4: "forty", 5: "fifty", 6: "sixty" };

/** Plural piece name for a denominator: 2 -> "halves", 12 -> "twelfths", 24 -> "twenty-fourths". */
export function pieceWord(d: number): string {
  if (d === 2) return "halves";
  if (d === 4) return "fourths";
  if (d < 10) return `${ONES[d]}s`;
  if (d < 20) return `${TEENS[d]}s`;
  const t = Math.floor(d / 10);
  const o = d % 10;
  if (d < 70 && o === 0) return `${TENS_ORD[t]}s`;
  if (d < 70) return `${TENS[t]}-${ONES[o]}s`;
  return `${d}ths`;
}

/** Singular piece name: 2 -> "half", 4 -> "fourth", 12 -> "twelfth". */
export function pieceOne(d: number): string {
  if (d === 2) return "half";
  const plural = pieceWord(d);
  return plural.endsWith("s") ? plural.slice(0, -1) : plural;
}

/** A piece-size answer choice with its number, so it can be read without decoding the word: "twelfths (12 in 1 whole)". */
export const piecesChoice = (d: number): string => `${pieceWord(d)} (${d} in 1 whole)`;

// ---------- text forms ----------

/** "3/4". */
export const fracStr = (n: number, d: number): string => `${n}/${d}`;

/** Simplest-form text: (17, 12) -> "1 5/12", (8, 12) -> "2/3", (12, 12) -> "1". */
export function simplestText(n: number, d: number): string {
  const g = gcd(n, d);
  const sn = n / g;
  const sd = d / g;
  if (sd === 1) return String(sn);
  if (sn > sd) return `${Math.floor(sn / sd)} ${sn % sd}/${sd}`;
  return `${sn}/${sd}`;
}

/** Mixed-number text WITHOUT reducing: (15, 12) with whole 4 -> "4 15/12". */
export const mixedRaw = (w: number, n: number, d: number): string => (n === 0 ? String(w) : w === 0 ? `${n}/${d}` : `${w} ${n}/${d}`);

/** True when a/b and c/d are the same value. */
export const sameValue = (a: number, b: number, c: number, d: number): boolean => a * d === c * b;

/** A random numerator 1..d-1 in lowest terms with d. */
export function properNum(d: number, min = 1, max = d - 1): number {
  const opts: number[] = [];
  for (let n = min; n <= max; n++) if (gcd(n, d) === 1) opts.push(n);
  return opts.length ? pick(opts) : 1;
}

// ---------- denominator pairs ----------

/** One denominator is a multiple of the other (3 and 6): the LCD is the bigger one. */
export const MULTIPLE_PAIRS: [number, number][] = [
  [2, 4], [2, 6], [2, 8], [3, 6], [3, 9], [4, 8], [4, 12], [5, 10], [6, 12], [3, 12], [2, 10],
];
/** No common factor but 1 (3 and 5): the LCD is the product. */
export const COPRIME_PAIRS: [number, number][] = [
  [2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [5, 6], [3, 8], [2, 7], [3, 7], [4, 7], [2, 9],
];
/** A shared factor, neither a multiple of the other: the LCD is LESS than the product.
 *  The first five are the pairs the approved plan names; they're drawn most often. */
export const NAMED_SHARED_PAIRS: [number, number][] = [
  [4, 6], [6, 9], [8, 12], [10, 15], [12, 16],
];
export const OTHER_SHARED_PAIRS: [number, number][] = [
  [4, 10], [6, 8], [6, 10], [9, 12],
];
export type PairKind = "multiple" | "coprime" | "shared";

/** A denominator pair of the given kind, in random order. */
export function pairOf(kind: PairKind): [number, number] {
  const base = kind === "multiple" ? pick(MULTIPLE_PAIRS) : kind === "coprime" ? pick(COPRIME_PAIRS) : Math.random() < 0.7 ? pick(NAMED_SHARED_PAIRS) : pick(OTHER_SHARED_PAIRS);
  return Math.random() < 0.5 ? [base[0], base[1]] : [base[1], base[0]];
}

/** Any pair, weighted so "multiply the denominators" is often NOT the LCD. */
export function anyPair(): [number, number] {
  const r = Math.random();
  return pairOf(r < 0.4 ? "shared" : r < 0.7 ? "coprime" : "multiple");
}

export const pairKindOf = (a: number, b: number): PairKind => (a % b === 0 || b % a === 0 ? "multiple" : gcd(a, b) === 1 ? "coprime" : "shared");

// ---------- named-mistake feedback ----------

/** Feedback for a wrong LCD (NumberStep.diagnose). */
export function lcdDiagnose(a: number, b: number) {
  const L = lcd(a, b);
  return (v: number): string | null => {
    if (!Number.isInteger(v) || v <= 0) return null;
    if (v % a === 0 && v % b === 0 && v !== L) return `${v} is a common denominator, but not the least. Find the smallest number both ${a} and ${b} go into.`;
    if (v === a + b) return `${a} + ${b} = ${v}. Adding the denominators doesn't make same-size pieces. Find a number both ${a} and ${b} go into.`;
    if (v % a === 0) return `${a} goes into ${v}, but ${b} does not.`;
    if (v % b === 0) return `${b} goes into ${v}, but ${a} does not.`;
    return `Neither ${a} nor ${b} goes into ${v}. List the multiples of ${Math.max(a, b)} and look for one that ${Math.min(a, b)} goes into.`;
  };
}

/** Feedback for a wrong sum/difference of two fractions (FractionStep.diagnose). */
export function resultDiagnose(op: Op, n1: number, d1: number, n2: number, d2: number) {
  const L = lcd(d1, d2);
  const a = (n1 * L) / d1;
  const b = (n2 * L) / d2;
  return (num: number, den: number, typed?: string): string | null => {
    const is = (p: number, q: number) => q > 0 && num * q === p * den;
    // Quote the student's answer as they typed it (2/2, not 1): round 5 review, E5-13.
    const shown = typed || shownText(num, den);
    if (op === "add") {
      // Named with a size check (round 5, U5-02): the add-across answer is less than the bigger fraction.
      if (is(n1 + n2, d1 + d2)) return `${addAcrossMsg({ n1, d1, n2, d2 }, shown)} First make same-size pieces, then add only the tops.`;
      if (is(a + b, 2 * L)) return `You added the denominators too. The pieces stay ${pieceWord(L)}, so keep ${L} on the bottom.`;
      if (is(n1 + n2, L)) return "You added the old tops. Rewrite each fraction with the LCD first, then add the new tops.";
      if (is(Math.abs(a - b), L)) return "That's the difference. This problem asks you to add.";
    } else {
      if (d1 !== d2 && n1 >= n2 && is(n1 - n2, Math.abs(d1 - d2))) {
        // The size check only when it holds: subtracting across often gives MORE than the first fraction (3/4 − 1/2 "=" 2/2).
        const bigger = (n1 - n2) * d1 > n1 * Math.abs(d1 - d2);
        return bigger
          ? `You subtracted across. ${shown} is more than ${n1}/${d1}, but subtracting should make a smaller number. First make same-size pieces.`
          : "You subtracted across. First make same-size pieces, then subtract only the tops.";
      }
      if (is(a + b, L)) return "That's the sum. This problem asks you to subtract.";
      if (is(n1 - n2, L) && n1 > n2) return "You subtracted the old tops. Rewrite each fraction with the LCD first, then subtract the new tops.";
    }
    return null;
  };
}

/** Feedback for a wrong mixed-number subtraction answer. */
export function mixedSubDiagnose(w1: number, n1: number, d1: number, w2: number, n2: number, d2: number) {
  const L = lcd(d1, d2);
  const a = (n1 * L) / d1;
  const b = (n2 * L) / d2;
  return (num: number, den: number): string | null => {
    const is = (wholeL: number) => num * L === wholeL * den;
    if (a < b) {
      // Took the small fraction from the big one ("flipped"), and kept every whole.
      if (is((w1 - w2) * L + (b - a))) return `It looks like you did ${b}/${L} − ${a}/${L}. You can't take ${b}/${L} from ${a}/${L}. Borrow 1 whole first.`;
      // Borrowed into the fraction but never took the 1 away from the whole number.
      if (is((w1 - w2) * L + (a + L - b))) return "You borrowed, but you forgot to take 1 away from the whole number.";
    }
    return null;
  };
}

/** Feedback for a wrong mixed-number sum. */
export function mixedAddDiagnose(w1: number, n1: number, d1: number, w2: number, n2: number, d2: number) {
  const L = lcd(d1, d2);
  const a = (n1 * L) / d1;
  const b = (n2 * L) / d2;
  return (num: number, den: number): string | null => {
    if (a + b >= L && num * L === ((w1 + w2) * L + (a + b - L)) * den) return "The fraction parts make 1 whole or more. You forgot to carry 1 whole to the whole number.";
    if (num * (d1 + d2) === ((w1 + w2) * (d1 + d2) + n1 + n2) * den) {
      // The size check on the fraction parts (round 5, U5-02), unless they are equal (then there's no bigger one).
      if (sameValue(n1, d1, n2, d2)) return "You added across. First make same-size pieces, then add only the tops.";
      const { big } = biggerSmaller({ n1, d1, n2, d2 });
      return `You added the fraction parts across. ${n1 + n2}/${d1 + d2} is less than ${big[0]}/${big[1]}, but adding should make a bigger number. Make same-size pieces first.`;
    }
    return null;
  };
}

// ---------- Unit 1: why you can't add across ----------
// Round 5 redesign (user, 2026-11-08): Unit 1 uses only what students bring
// from grades 3-4 (equivalent fractions, adding like denominators, and 4.NF.5's
// "one denominator fits in the other"). Every problem estimates, judges an
// add-across answer, then finds the real sum: typed when one denominator fits
// in the other, by picking a picture when they share no factor (finding those
// pieces is Unit 2). Sums can pass 1 (U5-04).

export type U1Bucket = "fitsUnder1" | "fitsOneOrMore" | "noShareUnder1" | "noShareOver1";
export const U1_BUCKETS: U1Bucket[] = ["fitsUnder1", "fitsOneOrMore", "noShareUnder1", "noShareOver1"];
export interface TwoFracs {
  n1: number;
  d1: number;
  n2: number;
  d2: number;
}

/** One denominator fits in the other (2 and 6): [smaller, bigger]. Bigger is at most 12, so the cut pieces stay countable. */
export const U1_FITS_PAIRS: [number, number][] = [
  [2, 4], [2, 6], [2, 8], [2, 10], [2, 12], [3, 6], [3, 9], [3, 12], [4, 8], [4, 12], [5, 10], [6, 12],
];
/** No shared factor (2 and 3). The same-size pieces stay 15 or fewer, so they can be counted. */
export const U1_NOSHARE_PAIRS: [number, number][] = [[2, 3], [2, 5], [3, 4], [3, 5], [2, 7]];
/** Disjoint pools for the Unit 1 Test, so two questions never show the same pair. */
export const U1_TEST_POOLS = {
  rename: [[2, 4], [3, 9], [4, 8], [5, 10]] as [number, number][],
  sumPicture: [[2, 6], [3, 6], [4, 12], [2, 10]] as [number, number][],
  sumPlain: [[2, 8], [3, 12], [6, 12], [2, 12]] as [number, number][],
  pickPicture: [[2, 3], [3, 4], [2, 7]] as [number, number][],
  countPicture: [[2, 5], [3, 5]] as [number, number][],
};

/** Where the sum lands: less than 1, exactly 1, or more than 1 (a mixed number). */
export type U1Size = "under" | "whole" | "over";

/** True when one denominator fits in the other (or they are the same). */
export const fitsIn = (a: number, b: number): boolean => a % b === 0 || b % a === 0;

/**
 * Two fractions from a pool of [smaller, bigger] denominator pairs whose sum
 * has the given size. The size is decided FIRST (the caller picks it), then
 * numbers are drawn to fit it. Never two equal fractions (1/2 + 2/4): adding
 * across them gives 3/6, the same as both, so "less than the bigger one"
 * has nothing to compare. An exact 1 with one denominator fitting in the
 * other needs the bigger-denominator fraction NOT in lowest terms (1/3 + 4/6):
 * in lowest terms the two would have the same denominator.
 */
export function u1Draw(pairs: [number, number][], size: U1Size): TwoFracs {
  for (let guard = 0; guard < 4000; guard++) {
    const [d, D] = pick(pairs);
    const n1 = properNum(d);
    const k = D / d;
    const n2 = size === "whole" && Number.isInteger(k) ? (d - n1) * k : properNum(D);
    if (n2 <= 0 || n2 >= D || sameValue(n1, d, n2, D)) continue;
    const L = lcd(d, D);
    const total = (n1 * L) / d + (n2 * L) / D;
    if (size === "under" ? total >= L : size === "whole" ? total !== L : total <= L || total % L === 0) continue;
    // The add-across value must be far enough from both fractions to compare
    // by eye on the bars (user decision 2026-11-09): at least 1/24 of a whole,
    // about 10 px on a 240 px bar.
    const across = (n1 + n2) / (d + D);
    if (Math.min(Math.abs(across - n1 / d), Math.abs(across - n2 / D)) < 1 / 24) continue;
    return Math.random() < 0.5 ? { n1, d1: d, n2, d2: D } : { n1: n2, d1: D, n2: n1, d2: d };
  }
  return size === "under" ? { n1: 1, d1: 2, n2: 1, d2: 4 } : size === "whole" ? { n1: 1, d1: 3, n2: 4, d2: 6 } : { n1: 3, d1: 4, n2: 1, d2: 2 };
}

/** Two fractions for one Unit 1 bucket. "1 or more" is exactly 1 half the time. */
export function u1Params(bucket: U1Bucket): TwoFracs {
  if (bucket === "fitsUnder1") return u1Draw(U1_FITS_PAIRS, "under");
  if (bucket === "fitsOneOrMore") return u1Draw(U1_FITS_PAIRS, Math.random() < 0.5 ? "whole" : "over");
  if (bucket === "noShareUnder1") return u1Draw(U1_NOSHARE_PAIRS, "under");
  return u1Draw(U1_NOSHARE_PAIRS, "over");
}

/** The bigger and smaller of two (unequal) fractions, as [n, d]. */
export function biggerSmaller(p: TwoFracs): { big: [number, number]; small: [number, number]; bigFirst: boolean } {
  const bigFirst = p.n1 * p.d2 > p.n2 * p.d1;
  const one: [number, number] = [p.n1, p.d1];
  const two: [number, number] = [p.n2, p.d2];
  return { big: bigFirst ? one : two, small: bigFirst ? two : one, bigFirst };
}

/** What adding (or subtracting) across gives, as typed: [top, bottom]; null when it can't be done. */
export function acrossOf(op: Op, n1: number, d1: number, n2: number, d2: number): [number, number] | null {
  if (op === "add") return [n1 + n2, d1 + d2];
  return d1 !== d2 && n1 >= n2 ? [n1 - n2, Math.abs(d1 - d2)] : null;
}

/** A typed value as text the way a student writes it: 4/6, 1, 1 1/4 (not reduced). */
export function shownText(num: number, den: number): string {
  if (den === 1) return String(num);
  if (num < den) return `${num}/${den}`;
  return num % den === 0 ? String(num / den) : `${Math.floor(num / den)} ${num % den}/${den}`;
}

/**
 * The named "added across" message with its size check (MG10 round 5,
 * U5-02): the add-across answer is always between the two fractions, so it
 * is less than the bigger one, but a sum must be more than both.
 * `shown` is the student's answer as text.
 */
export function addAcrossMsg(p: TwoFracs, shown: string): string {
  const { big } = biggerSmaller(p);
  return `You added across. ${shown} is less than ${big[0]}/${big[1]}, but adding should make a bigger number.`;
}

/**
 * The typed value [top, bottom] from a fraction answer's inputs ([whole, top,
 * bottom, kind], as VisualHelp.lastTry gives them). Only the boxes the
 * picked kind shows count. Null when it isn't a whole-number answer.
 */
export function typedValue(inputs?: string[]): [number, number] | null {
  if (!inputs) return null;
  const kind = inputs[3];
  const show = isAnswerForm(kind) ? formBoxes(kind) : [true, true, true];
  const raw = [0, 1, 2].map((i) => (show[i] ? (inputs[i] ?? "").trim() : ""));
  if (raw.some((v) => v !== "" && !/^\d+$/.test(v))) return null;
  const w = raw[0] ? Number(raw[0]) : 0;
  if (!raw[1]) return raw[0] ? [w, 1] : null;
  const d = Number(raw[2]);
  if (!d) return null;
  return [w * d + Number(raw[1]), d];
}

/** The last answer's boxes as the student typed them ("2/2", "1 3/5", "4"), for a picture label; null when not a whole-number answer. */
export function typedText(inputs?: string[]): string | null {
  if (!typedValue(inputs) || !inputs) return null;
  const kind = inputs[3];
  const show = isAnswerForm(kind) ? formBoxes(kind) : [true, true, true];
  const [w, n, d] = [0, 1, 2].map((i) => (show[i] ? (inputs[i] ?? "").trim() : ""));
  return [w, n ? `${n}/${d}` : ""].filter(Boolean).join(" ");
}

/** True when the last wrong answer was the add-across (subtract-across) value. */
export function triedAcross(lastTry: string[] | undefined, op: Op, n1: number, d1: number, n2: number, d2: number): boolean {
  const v = typedValue(lastTry);
  const x = acrossOf(op, n1, d1, n2, d2);
  return !!v && !!x && x[1] > 0 && v[0] * x[1] === x[0] * v[1];
}

/** Feedback for a wrong Unit 1 sum (FractionStep.diagnose). No "LCD" yet: Unit 2 teaches it. */
export function u1SumDiagnose(p: TwoFracs) {
  const { n1, d1, n2, d2 } = p;
  const L = lcd(d1, d2);
  const a = (n1 * L) / d1;
  const b = (n2 * L) / d2;
  return (num: number, den: number, typed?: string): string | null => {
    const is = (x: number, y: number) => y > 0 && num * y === x * den;
    if (is(n1 + n2, d1 + d2)) return `${addAcrossMsg(p, typed || shownText(num, den))} Make same-size pieces first.`;
    if (is(a + b, 2 * L)) return `You added the bottoms too. The pieces are still ${pieceWord(L)}, so keep ${L} on the bottom.`;
    if (is(n1 + n2, L) && n1 + n2 !== a + b) return `You added the old tops. First write both fractions in ${pieceWord(L)}.`;
    return null;
  };
}

/**
 * Feedback for a wrong Unit 1 rename (2/5 as tenths), round 5 review C5-05:
 * kept the old top, or wrote just one piece. Nudges, never the answer.
 */
export function u1RenameDiagnose(nS: number, dS: number, L: number) {
  const k = L / dS;
  return (num: number, den: number): string | null => {
    if (den !== L) return null;
    if (num === nS) return `That's the old top. Each ${pieceOne(dS)} is ${k} ${pieceWord(L)}. How many ${pieceWord(L)} are in ${nS} ${nS === 1 ? pieceOne(dS) : pieceWord(dS)}?`;
    if (num === k && nS > 1) return `That's 1 ${pieceOne(dS)}. You have ${nS} ${pieceWord(dS)}.`;
    return null;
  };
}

// ---------- Unit 2: common denominators ----------

export type U2Bucket = "multipleDen" | "coprimeDen" | "sharedFactor" | "mixedNumbers";
export const U2_BUCKETS: U2Bucket[] = ["multipleDen", "coprimeDen", "sharedFactor", "mixedNumbers"];
export interface U2Params extends TwoFracs {
  w1: number;
  w2: number;
}

/** Two fractions in lowest terms (not equal in value) with a denominator pair of the bucket's kind. */
export function u2Params(bucket: U2Bucket): U2Params {
  for (let guard = 0; guard < 500; guard++) {
    const kind: PairKind = bucket === "multipleDen" ? "multiple" : bucket === "coprimeDen" ? "coprime" : bucket === "sharedFactor" ? "shared" : pick(["shared", "shared", "coprime", "multiple"] as PairKind[]);
    const [d1, d2] = pairOf(kind);
    const n1 = properNum(d1);
    const n2 = properNum(d2);
    if (sameValue(n1, d1, n2, d2)) continue;
    const mixed = bucket === "mixedNumbers";
    // Mixed numbers: always the same whole number, so the fraction parts
    // (rewritten with the LCD) decide which number is bigger.
    const w1 = mixed ? randInt(1, 6) : 0;
    return { n1, d1, n2, d2, w1, w2: w1 };
  }
  return { n1: 3, d1: 4, n2: 5, d2: 6, w1: 0, w2: 0 };
}

// ---------- Unit 3: add and subtract ----------

export type U3Bucket = "addPlain" | "addSimplify" | "addMixed" | "subPlain" | "subSimplify" | "subWhole";
export const U3_BUCKETS: U3Bucket[] = ["addPlain", "addSimplify", "addMixed", "subPlain", "subSimplify", "subWhole"];
export interface U3Params extends TwoFracs {
  op: Op;
}

/** Result over the LCD, before simplifying. */
export function combine(op: Op, n1: number, d1: number, n2: number, d2: number) {
  const L = lcd(d1, d2);
  const a = (n1 * L) / d1;
  const b = (n2 * L) / d2;
  return { L, a, b, r: op === "add" ? a + b : a - b };
}

export function u3Bucket(p: U3Params): U3Bucket | null {
  const { L, r } = combine(p.op, p.n1, p.d1, p.n2, p.d2);
  if (r <= 0) return null;
  const reduces = gcd(r, L) !== 1;
  if (p.op === "add") {
    if (r > L && r % L !== 0) return "addMixed";
    if (r < L) return reduces ? "addSimplify" : "addPlain";
    return null;
  }
  if (r % L === 0) return "subWhole";
  if (r < L) return reduces ? "subSimplify" : "subPlain";
  return null;
}

export function u3Params(bucket: U3Bucket): U3Params {
  if (bucket === "subWhole") {
    // An improper first fraction (lowest terms) minus a second fraction that
    // equals its fraction part but is written with a bigger denominator
    // (3/2 − 2/4 = 1): the only way two unlike denominators land on a whole.
    for (let guard = 0; guard < 200; guard++) {
      const d1 = pick([2, 3, 4, 5, 6]);
      const k = pick([2, 3]);
      const W = pick([1, 1, 2]);
      const r1 = properNum(d1);
      const n1 = W * d1 + r1;
      if (gcd(n1, d1) !== 1) continue;
      const d2 = d1 * k;
      if (d2 > 16) continue;
      return { op: "sub", n1, d1, n2: r1 * k, d2 };
    }
    return { op: "sub", n1: 3, d1: 2, n2: 2, d2: 4 };
  }
  const op: Op = bucket.startsWith("add") ? "add" : "sub";
  // About 1 in 4 "sum past 1" problems has one improper addend (5/4 + 2/3),
  // like 5.NF.1's own example 2/3 + 5/4.
  const improper = bucket === "addMixed" && Math.random() < 0.25;
  const improperSide = Math.random() < 0.5 ? 1 : 2;
  for (let guard = 0; guard < 2000; guard++) {
    const [d1, d2] = anyPair();
    const n1 = improper && improperSide === 1 ? properNum(d1, d1 + 1, 2 * d1 - 1) : properNum(d1);
    const n2 = improper && improperSide === 2 ? properNum(d2, d2 + 1, 2 * d2 - 1) : properNum(d2);
    if (sameValue(n1, d1, n2, d2)) continue;
    // Subtract the smaller from the bigger.
    const p: U3Params = op === "sub" && n1 * d2 < n2 * d1 ? { op, n1: n2, d1: d2, n2: n1, d2: d1 } : { op, n1, d1, n2, d2 };
    if (u3Bucket(p) === bucket) return p;
  }
  return op === "add" ? { op, n1: 1, d1: 4, n2: 1, d2: 6 } : { op, n1: 5, d1: 6, n2: 1, d2: 4 };
}

// ---------- Unit 4: mixed numbers ----------

export type U4Bucket = "addNoCarry" | "addCarry" | "subNoBorrow" | "subBorrow" | "subFromWhole";
export const U4_BUCKETS: U4Bucket[] = ["addNoCarry", "addCarry", "subNoBorrow", "subBorrow", "subFromWhole"];
export interface U4Params {
  op: Op;
  w1: number;
  n1: number;
  d1: number;
  w2: number;
  n2: number;
  d2: number;
}

export interface MixedBreakdown {
  L: number;
  /** Fraction parts rewritten over the LCD. */
  a: number;
  b: number;
  /** Subtraction: the first fraction part is smaller, so 1 whole is borrowed. */
  borrow: boolean;
  /** Addition: the fraction parts make 1 or more, so a whole is carried. */
  carry: boolean;
  /** The first number after borrowing (same as the start when no borrow). */
  bw: number;
  ba: number;
  /** Raw result: whole + fraction over L, before carrying/simplifying. */
  rw: number;
  rn: number;
  /** The exact result as an improper fraction over L. */
  total: number;
}

/** One breakdown shared by the pictures and the graded steps. */
export function mixedBreakdown(p: U4Params): MixedBreakdown {
  const L = lcd(p.d1, p.d2);
  const a = (p.n1 * L) / p.d1;
  const b = (p.n2 * L) / p.d2;
  if (p.op === "add") {
    const rn = a + b;
    return { L, a, b, borrow: false, carry: rn >= L, bw: p.w1, ba: a, rw: p.w1 + p.w2, rn, total: (p.w1 + p.w2) * L + rn };
  }
  const borrow = a < b;
  const bw = borrow ? p.w1 - 1 : p.w1;
  const ba = borrow ? a + L : a;
  return { L, a, b, borrow, carry: false, bw, ba, rw: bw - p.w2, rn: ba - b, total: (bw - p.w2) * L + (ba - b) };
}

export function u4Params(bucket: U4Bucket): U4Params {
  for (let guard = 0; guard < 2000; guard++) {
    if (bucket === "subFromWhole") {
      const d2 = pick([2, 3, 4, 5, 6, 8, 10]);
      const w1 = randInt(2, 7);
      return { op: "sub", w1, n1: 0, d1: d2, w2: randInt(1, w1 - 1), n2: properNum(d2), d2 };
    }
    const [d1, d2] = anyPair();
    const n1 = properNum(d1);
    const n2 = properNum(d2);
    if (sameValue(n1, d1, n2, d2)) continue;
    const op: Op = bucket.startsWith("add") ? "add" : "sub";
    // Wholes stay small (sums up to about 10) so the bar picture stays readable.
    const w1 = randInt(op === "add" ? 1 : 2, op === "add" ? 5 : 7);
    const w2 = op === "add" ? randInt(1, 4) : randInt(1, w1 - 1);
    const p: U4Params = { op, w1, n1, d1, w2, n2, d2 };
    const m = mixedBreakdown(p);
    if (bucket === "addNoCarry" && m.carry) continue;
    if (bucket === "addCarry" && !m.carry) continue;
    if (bucket === "subNoBorrow" && m.borrow) continue;
    if (bucket === "subBorrow" && (!m.borrow || m.rw < 0)) continue;
    if (m.total <= 0) continue;
    return p;
  }
  return { op: "sub", w1: 5, n1: 1, d1: 4, w2: 2, n2: 2, d2: 3 };
}

// ---------- Unit 5: benchmarks ----------

/** Benchmark (in HALVES: 0 = 0, 1 = 1/2, 2 = 1) closest to a proper fraction. */
export function benchmarkHalves(n: number, d: number): number {
  const x = n / d;
  return x < 0.25 ? 0 : x < 0.75 ? 1 : 2;
}

/** A fraction close enough to a quarter mark that rounding it to 0, 1/2 or 1 would be a coin toss. */
export const nearTie = (n: number, d: number): boolean => Math.abs(n / d - 0.25) < 0.05 || Math.abs(n / d - 0.75) < 0.05;

/** Halves -> "0", "1/2", "1", "1 1/2", "2"... */
export function halvesText(h: number): string {
  if (h % 2 === 0) return String(h / 2);
  return h === 1 ? "1/2" : `${Math.floor(h / 2)} 1/2`;
}

/** Three adjacent estimate choices (in halves) that include `h`, in number order. */
export function estimateChoices(h: number): string[] {
  // The window stays at 0 or above and in number order, so an estimate of 0
  // can only be the 1st button and 1/2 only the 1st or 2nd. Those estimates
  // are common, so 1/2 leans to the middle and 1 and up lean to the last
  // button. Overall each place is right about 20–45% of the time (MG10
  // review C1-16; checked by brute force over every caller).
  let place: number;
  if (h === 0) place = 0;
  else if (h === 1) place = Math.random() < 0.6 ? 1 : 0;
  else {
    // An estimate of exactly 1 is the most common "last button" chance in
    // one-step stories, so it leans further to the last place.
    const r = Math.random();
    place = h === 2 ? (r < 0.15 ? 0 : r < 0.45 ? 1 : 2) : r < 0.2 ? 0 : r < 0.55 ? 1 : 2;
  }
  const start = h - place;
  return [start, start + 1, start + 2].map(halvesText);
}

export const WORD_DENS = [2, 3, 4, 5, 6, 8, 10, 12];

/** A proper fraction (lowest terms, word-problem denominator) that is not near a quarter mark. */
export function benchFrac(dens = WORD_DENS): [number, number] {
  for (let guard = 0; guard < 200; guard++) {
    const d = pick(dens);
    const n = properNum(d);
    if (!nearTie(n, d)) return [n, d];
  }
  return [1, 3];
}

export interface Person {
  name: string;
  he: string;
  his: string;
}
export const PEOPLE: Person[] = [
  { name: "Ana", he: "she", his: "her" },
  { name: "Ben", he: "he", his: "his" },
  { name: "Mia", he: "she", his: "her" },
  { name: "Leo", he: "he", his: "his" },
  { name: "Zoe", he: "she", his: "her" },
  { name: "Sam", he: "he", his: "his" },
  { name: "Ivy", he: "she", his: "her" },
  { name: "Raj", he: "he", his: "his" },
  { name: "Nora", he: "she", his: "her" },
  { name: "Omar", he: "he", his: "his" },
];
export const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
export function twoPeople(): [Person, Person] {
  const [a, b] = shuffle(PEOPLE);
  return [a, b];
}

export type U5Bucket = "total" | "leftOrMore" | "reasonable" | "mixedStory";
export const U5_BUCKETS: U5Bucket[] = ["total", "leftOrMore", "reasonable", "mixedStory"];

/** Two benchmark-friendly fractions with unlike denominators (any LCD up to 40). */
export function u5Pair(op: Op): TwoFracs {
  for (let guard = 0; guard < 500; guard++) {
    const [n1, d1] = benchFrac();
    const [n2, d2] = benchFrac();
    if (d1 === d2 || lcd(d1, d2) > 40 || sameValue(n1, d1, n2, d2)) continue;
    if (op === "sub" && n1 * d2 <= n2 * d1) continue;
    // The estimate must be useful: not 0 for a sum, and within 1/4 of the exact answer.
    const est = (op === "add" ? benchmarkHalves(n1, d1) + benchmarkHalves(n2, d2) : benchmarkHalves(n1, d1) - benchmarkHalves(n2, d2)) / 2;
    const exact = op === "add" ? n1 / d1 + n2 / d2 : n1 / d1 - n2 / d2;
    if ((op === "add" && est === 0) || Math.abs(exact - est) > 0.25) continue;
    // A difference estimate of 0 ("about 0 cups of milk") is a weak estimate
    // and always the first choice: keep only 1 in 4 of them.
    if (op === "sub" && est === 0 && Math.random() < 0.75) continue;
    return { n1, d1, n2, d2 };
  }
  return op === "add" ? { n1: 1, d1: 8, n2: 1, d2: 3 } : { n1: 5, d1: 6, n2: 1, d2: 3 };
}

/** Kinds of claimed answers in a reasonableness problem. */
export type ClaimKind = "right" | "addAcross" | "keptOneDen";

/** A claimed sum for a + b, and whether it is sensible against the benchmark estimate. */
export function claimFor(p: TwoFracs, kind: ClaimKind): { n: number; d: number; verdict: Verdict } | null {
  const est = (benchmarkHalves(p.n1, p.d1) + benchmarkHalves(p.n2, p.d2)) / 2;
  const exact = p.n1 / p.d1 + p.n2 / p.d2;
  let n: number, d: number;
  if (kind === "right") {
    n = p.n1 * p.d2 + p.n2 * p.d1;
    d = p.d1 * p.d2;
  } else if (kind === "addAcross") {
    n = p.n1 + p.n2;
    d = p.d1 + p.d2;
  } else {
    // Rewrote the tops for the product but kept the first denominator. Only
    // when that denominator is NOT the LCD: otherwise "kept the bottom 12"
    // would name the right bottom (5/12 + 1/2 shown as 22/12).
    if (lcd(p.d1, p.d2) === p.d1) return null;
    n = p.n1 * p.d2 + p.n2 * p.d1;
    d = p.d1;
  }
  // Only the right claim is reduced (it must be in simplest form). A wrong
  // claim is shown exactly as the mistake makes it (2/6, 28/10), so the
  // explanation "added across" / "kept the bottom 10" matches the number on
  // screen (MG10 review C2-22). The verdict is checked on this same value.
  if (kind === "right") {
    const g = gcd(n, d);
    n /= g;
    d /= g;
  }
  const v = n / d;
  if (kind === "right") return Math.abs(v - exact) < 1e-9 ? { n, d, verdict: "ok" } : null;
  // A wrong claim must be clearly off from the estimate (at least 3/4 away),
  // but not absurd (at most 3), so the number line stays readable.
  if (v <= est - 0.75) return { n, d, verdict: "small" };
  if (v >= est + 0.75 && v <= 3) return { n, d, verdict: "big" };
  return null;
}

export type Verdict = "ok" | "small" | "big";

/**
 * A "does it make sense?" claim. The verdict is picked FIRST (1 in 3 each), then
 * pairs are drawn until the claim fits it, so "Yes" can't be guessed. A "too
 * small" claim is always the add-across answer (the main misconception); a
 * "too big" one kept one denominator.
 */
export function claimDraw(): { p: TwoFracs; kind: ClaimKind; claim: { n: number; d: number; verdict: Verdict } } {
  const verdict = pick(["ok", "small", "big"] as Verdict[]);
  const kind: ClaimKind = verdict === "ok" ? "right" : verdict === "small" ? "addAcross" : "keptOneDen";
  for (let guard = 0; guard < 5000; guard++) {
    const p = u5Pair("add");
    const claim = claimFor(p, kind);
    if (claim && claim.verdict === verdict) return { p, kind, claim };
  }
  const p = { n1: 1, d1: 8, n2: 1, d2: 3 };
  return { p, kind: "right", claim: { n: 11, d: 24, verdict: "ok" } };
}

/** Mixed-number word-problem values: wholes 1-6, benchmark-friendly fraction parts. */
export function u5Mixed(op: Op): U4Params {
  for (let guard = 0; guard < 500; guard++) {
    const { n1, d1, n2, d2 } = u5Pair("add");
    const w1 = randInt(op === "sub" ? 3 : 1, 6);
    const w2 = op === "sub" ? randInt(1, w1 - 1) : randInt(1, 5);
    const p: U4Params = { op, w1, n1, d1, w2, n2, d2 };
    if (mixedBreakdown(p).total <= 0) continue;
    return p;
  }
  return { op, w1: 2, n1: 1, d1: 3, w2: 1, n2: 1, d2: 2 };
}

/** Estimate (in halves) of a mixed-number sum or difference, rounding each fraction part to 0, 1/2 or 1. */
export function mixedEstimateHalves(p: U4Params): number {
  const h1 = p.w1 * 2 + benchmarkHalves(p.n1, p.d1);
  const h2 = p.w2 * 2 + benchmarkHalves(p.n2, p.d2);
  return p.op === "add" ? h1 + h2 : h1 - h2;
}
