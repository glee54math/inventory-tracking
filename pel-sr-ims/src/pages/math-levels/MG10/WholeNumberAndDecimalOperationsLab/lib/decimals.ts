// ============================================================================
// One decimal model for this lab (5.NBT.3-4), shared by the diagrams, the
// unit files AND the *Test.tsx files (a third module, so there is no
// unit<->Test import).
//
// Every amount is a whole number of THOUSANDTHS (3.042 -> 3042, 0.5 -> 500),
// plus the number of digits written after the point (0.5 and 0.500 are the
// same amount written two ways). Nothing depends on floating-point decimals
// printing or comparing cleanly. MG9 DecimalsLab's lib/decimals.ts stores
// hundredths and names only tenths/hundredths, so it is not reused here.
// ============================================================================

import { pick, randInt, shuffle } from "../../../shared/lib/math";

/** Digits after the point: 0 (a whole number) to 3 (thousandths). */
export type Places = 0 | 1 | 2 | 3;

/** A decimal as written: its amount in thousandths and its digits after the point. */
export interface Dec {
  t: number;
  p: Places;
}

export const PLACE_NAMES = ["ones", "tenths", "hundredths", "thousandths"] as const;
/** "tenth", "hundredth", "thousandth" (index = places). Index 0 is "whole number". */
export const PLACE_SINGULAR = ["whole number", "tenth", "hundredth", "thousandth"] as const;

/** Thousandths in one unit of the place: 1000 for ones, 100 for tenths, 10, 1. */
export const unitOf = (p: Places): number => 10 ** (3 - p);

/** The decimal text with exactly `p` digits after the point ("3.042", "0.50", "7"). */
export function decText(t: number, p: Places): string {
  const w = Math.floor(t / 1000);
  if (p === 0) return String(w);
  const frac = String(t % 1000).padStart(3, "0").slice(0, p);
  return `${w}.${frac}`;
}

export const showDec = (d: Dec): string => decText(d.t, d.p);

/** The fewest digits after the point that still show the amount (0.500 -> 1). */
export function minPlaces(t: number): Places {
  if (t % 1000 === 0) return 0;
  if (t % 100 === 0) return 1;
  if (t % 10 === 0) return 2;
  return 3;
}

/** The amount as a JS number (for NumberStep.answer). Exact to thousandths. */
export const toNum = (t: number): number => Math.round(t) / 1000;

/** The four digits: whole part, tenths, hundredths, thousandths. */
export function digitsOf(t: number): { w: number; d: [number, number, number] } {
  const w = Math.floor(t / 1000);
  const r = t % 1000;
  return { w, d: [Math.floor(r / 100), Math.floor(r / 10) % 10, r % 10] };
}

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** 0-999 in words ("four hundred two", "forty-two"). */
export function numberWords(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) {
    const o = n % 10;
    return o === 0 ? TENS[Math.floor(n / 10)] : `${TENS[Math.floor(n / 10)]}-${ONES[o]}`;
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return rest === 0 ? `${ONES[h]} hundred` : `${ONES[h]} hundred ${numberWords(rest)}`;
}

/** The number after the point read as one number, and its unit: 3.042 -> 42 thousandths. */
export function afterPoint(t: number, p: Places): { n: number; unit: string } {
  const r = t % 1000;
  const n = p === 0 ? 0 : Math.floor(r / unitOf(p));
  const base = p === 0 ? "" : PLACE_SINGULAR[p];
  return { n, unit: n === 1 ? base : `${base}s` };
}

/** How the decimal is read: "three and forty-two thousandths", "five tenths". */
export function decName(t: number, p: Places): string {
  const w = Math.floor(t / 1000);
  const { n, unit } = afterPoint(t, p);
  if (p === 0 || n === 0) return numberWords(w);
  const frac = `${numberWords(n)} ${unit}`;
  return w === 0 ? frac : `${numberWords(w)} and ${frac}`;
}

/** The whole part's digits with their place values, biggest first: 347 -> [[3, 100], [4, 10], [7, 1]]. */
export function wholeDigits(w: number): [number, number][] {
  const s = String(w);
  return s.split("").map((c, i) => [Number(c), 10 ** (s.length - 1 - i)]);
}

/**
 * The whole part's terms of the expanded form. A one-digit whole part stays
 * one term ("3"); a bigger one is written by place, as in 5.NBT.3a's example
 * (347 -> "3 × 100 + 4 × 10 + 7 × 1").
 */
export const wholeTerms = (w: number): string[] => (w < 10 ? [String(w)] : wholeDigits(w).map(([dg, v]) => `${dg} × ${v}`));

/** The expanded form as text the lab's MathText stacks: "3 + 0 × 1/10 + 4 × 1/100 + 2 × 1/1000". */
export function expandedText(t: number, p: Places = 3): string {
  const { w, d } = digitsOf(t);
  const parts = wholeTerms(w);
  for (let i = 0; i < p; i++) parts.push(`${d[i]} × 1/${10 ** (i + 1)}`);
  return parts.join(" + ");
}

/** The short expanded form with zero terms left out: "4 + 7/10 + 5/1000", "300 + 40 + 7 + 3/10 + 2/1000". */
export function shortExpandedText(t: number): string {
  const { w, d } = digitsOf(t);
  const parts = w < 10 ? (w > 0 ? [String(w)] : []) : wholeDigits(w).filter(([dg]) => dg > 0).map(([dg, v]) => String(dg * v));
  d.forEach((x, i) => {
    if (x > 0) parts.push(`${x}/${10 ** (i + 1)}`);
  });
  return parts.join(" + ");
}

/** The one comparison behind every Explore readout and every graded symbol. */
export const compareSymbol = (a: number, b: number): "<" | ">" | "=" => (a < b ? "<" : a > b ? ">" : "=");

// ---------- rounding ----------

export interface Rounding {
  /** The two neighbors at the place (lo <= t < hi), in thousandths. */
  lo: number;
  hi: number;
  /** Exactly halfway between lo and hi. */
  mid: number;
  /** The rounded amount. */
  r: number;
  /** The digit just right of the place (the one that decides). */
  next: number;
}

/** Round t to place p (0 ones, 1 tenths, 2 hundredths). Exactly halfway rounds up. */
export function roundAt(t: number, p: Places): Rounding {
  const u = unitOf(p);
  const lo = Math.floor(t / u) * u;
  const hi = lo + u;
  const mid = lo + u / 2;
  const r = t >= mid ? hi : lo;
  const next = Math.floor((t % u) / (u / 10));
  return { lo, hi, mid, r, next };
}

/** The "bump only that digit" mistake: 2.996 to hundredths written "2.9(10)" read as 2.910. Null if no 9 to bump. */
export function noCarryValue(t: number, p: Places): number | null {
  if (p === 0) return null;
  const { w, d } = digitsOf(t);
  if (d[p - 1] !== 9) return null;
  // The digits up to the place, with "10" written in place of the 9.
  const s = `${w}.${d.slice(0, p - 1).join("")}10`;
  return Number(s);
}

/** The "write 0 but forget to carry" mistake: 2.996 to hundredths written 2.90. Null if no 9. */
export function droppedCarryValue(t: number, p: Places): number | null {
  if (p === 0) return null;
  const { d } = digitsOf(t);
  if (d[p - 1] !== 9) return null;
  const u = unitOf(p);
  return toNum(Math.floor(t / u) * u - 9 * u);
}

// ---------- generators (Unit 1) ----------

/** A whole part: usually 0-9, sometimes 10-99 (number names past ten). */
const wholePart = (): number => (Math.random() < 0.75 ? randInt(0, 9) : randInt(10, 99));

/**
 * A decimal to name: 1-3 digits after the point, the last one never 0.
 * Half the time it has 3 digits with a 0 inside (3.042, 3.007, 3.405), the
 * hard edge where "forty-two thousandths" gets written 3.42.
 */
export function nameDec(): Dec {
  const w = wholePart();
  const roll = Math.random();
  if (roll < 0.5) {
    // 3 digits, a zero inside
    const kind = pick(["tenths0", "both0", "hund0"] as const);
    const d1 = kind === "hund0" ? randInt(1, 9) : 0;
    const d2 = kind === "tenths0" ? randInt(1, 9) : 0;
    return { t: w * 1000 + d1 * 100 + d2 * 10 + randInt(1, 9), p: 3 };
  }
  if (roll < 0.8) return { t: w * 1000 + randInt(1, 9) * 100 + randInt(1, 9) * 10 + randInt(1, 9), p: 3 };
  if (roll < 0.9) return { t: w * 1000 + 10 * nonzeroLast(99), p: 2 };
  return { t: w * 1000 + 100 * randInt(1, 9), p: 1 };
}

/** 1..max with a last digit that isn't 0. */
function nonzeroLast(max: number): number {
  for (;;) {
    const n = randInt(1, max);
    if (n % 10 !== 0) return n;
  }
}

/**
 * A 3-digit decimal for expanded form, last digit not 0. Most have a 0 digit
 * inside. The whole part is usually 1-9; about a third of the time it has 2
 * or 3 digits (347.392, the standard's own example).
 */
export function expandedDec(): number {
  const roll = Math.random();
  const w = roll < 0.67 ? randInt(1, 9) : roll < 0.84 ? randInt(10, 99) : randInt(100, 999);
  const zero = Math.random() < 0.7 ? pick([0, 1]) : -1; // which inside digit is 0
  const d1 = zero === 0 ? 0 : randInt(1, 9);
  const d2 = zero === 1 ? 0 : randInt(1, 9);
  return w * 1000 + d1 * 100 + d2 * 10 + randInt(1, 9);
}

export type CompareBucket = "sameDigits" | "shorterBigger" | "thousandths";
export const COMPARE_BUCKETS: CompareBucket[] = ["sameDigits", "shorterBigger", "thousandths"];

export interface ComparePair {
  a: Dec;
  b: Dec;
  /** Same whole part for both. */
  w: number;
}

const order = (x: Dec, y: Dec, w: number): ComparePair => (Math.random() < 0.5 ? { a: x, b: y, w } : { a: y, b: x, w });

/** The number after the point read as a whole number (0.45 -> 45). The "longer looks bigger" misreading. */
export const digitsAfter = (d: Dec): number => afterPoint(d.t, d.p).n;

/**
 * Two decimals with the same whole part, by bucket:
 *  - sameDigits: both 2 or both 3 digits after the point; the first different
 *    digit is in any place (tenths, hundredths or thousandths).
 *  - shorterBigger: the one with FEWER digits is bigger, though its digits
 *    after the point read as a smaller number (0.5 vs 0.45, 0.7 vs 0.689).
 *  - thousandths: one stops at tenths or hundredths, the other has a nonzero
 *    thousandths digit. 40%: the longer one is smaller (0.5 vs 0.499); 40%:
 *    the longer one is bigger (0.45 vs 0.452); 20%: equal (0.45 vs 0.450).
 *    So "more digits" is right only sometimes.
 */
export function comparePair(bucket: CompareBucket): ComparePair {
  const w = randInt(0, 9);
  const W = w * 1000;
  if (bucket === "sameDigits") {
    const p: Places = Math.random() < 0.35 ? 2 : 3;
    const place = randInt(1, p); // first place that differs
    for (;;) {
      const u = unitOf(p);
      const x = W + nonzeroLast(10 ** p - 1) * u;
      const y = W + nonzeroLast(10 ** p - 1) * u;
      if (x === y) continue;
      const dx = digitsOf(x).d;
      const dy = digitsOf(y).d;
      let first = 0;
      for (let i = 0; i < 3; i++) if (dx[i] !== dy[i]) {
        first = i + 1;
        break;
      }
      if (first !== place) continue;
      return order({ t: x, p }, { t: y, p }, w);
    }
  }
  if (bucket === "shorterBigger") {
    for (;;) {
      const ps: Places = Math.random() < 0.6 ? 1 : 2;
      const pl: Places = ps === 1 ? (Math.random() < 0.5 ? 2 : 3) : 3;
      const s: Dec = { t: W + nonzeroLast(10 ** ps - 1) * unitOf(ps), p: ps };
      const l: Dec = { t: W + nonzeroLast(10 ** pl - 1) * unitOf(pl), p: pl };
      if (l.t >= s.t) continue;
      if (digitsAfter(l) <= digitsAfter(s)) continue; // keep the trap live
      return order(s, l, w);
    }
  }
  const roll = Math.random();
  for (;;) {
    const ps: Places = Math.random() < 0.5 ? 1 : 2;
    const s: Dec = { t: W + nonzeroLast(10 ** ps - 1) * unitOf(ps), p: ps };
    if (roll < 0.2) return order(s, { t: s.t, p: 3 }, w); // equal: 0.45 vs 0.450
    if (roll < 0.6) {
      // longer and smaller, just under: 0.5 vs 0.499 / 0.45 vs 0.449 / a bit further
      const gap = Math.random() < 0.5 ? 1 : randInt(2, 40);
      const lt = s.t - gap;
      if (lt <= W || lt % 10 === 0) continue;
      return order(s, { t: lt, p: 3 }, w);
    }
    // longer and bigger: 0.45 vs 0.452 (only the thousandths differ) or 0.5 vs 0.503
    const lt = s.t + randInt(1, 9);
    if (lt >= W + 1000) continue;
    return order(s, { t: lt, p: 3 }, w);
  }
}

// ---------- generators (Unit 2) ----------

export type RoundBucket = "down" | "up" | "carry" | "exact";
export const ROUND_BUCKETS: RoundBucket[] = ["down", "up", "carry", "exact"];

export interface RoundCase {
  x: Dec;
  /** Place rounded to: 0 whole number, 1 tenth, 2 hundredth. */
  p: Places;
}

/** A random digit string tail: k digits, the last nonzero. */
function tail(k: number): number[] {
  const ds = Array.from({ length: k }, () => randInt(0, 9));
  if (k > 0) ds[k - 1] = randInt(1, 9);
  return ds;
}

const build = (w: number, ds: number[]): Dec => {
  const p = ds.length as Places;
  const padded = [...ds, 0, 0, 0].slice(0, 3);
  return { t: w * 1000 + padded[0] * 100 + padded[1] * 10 + padded[2], p };
};

/**
 * A number to round, by bucket. The place is ones, tenths or hundredths, and
 * the number always has at least one digit past it.
 *  - down:  the next digit is 0-4. Hard edges: next digit 4 followed by 9s
 *           (5.749 to tenths is 5.7, not 5.8) and next digit 0.
 *  - up:    the next digit is 5-9, the place digit isn't 9 (no carry). Hard
 *           edge: exactly 5 with nothing after it (2.45 to tenths).
 *  - carry: the place digit is 9 and the next digit is 5 or more, so the 1
 *           carries left. Hard edge: two 9s in a row (2.996 to hundredths is
 *           3.00; 9.96 to tenths is 10.0).
 *  - exact: every digit past the place is 0 (3.40 to tenths, 5.120 to
 *           hundredths, 7.00 to whole number): nothing changes.
 */
export function roundCase(bucket: RoundBucket): RoundCase {
  for (;;) {
    const p = pick([0, 1, 1, 2, 2] as Places[]);
    const extra = randInt(1, 3 - p); // digits after the place
    const total = p + extra;
    const w = randInt(p === 0 ? 1 : 0, 9);
    if (bucket === "exact") {
      const head = tail(p); // the digits up to the place (last nonzero when p > 0)
      if (p === 0 && w === 0) continue;
      const ds = [...head, ...Array.from({ length: extra }, () => 0)];
      return { x: build(w, ds), p };
    }
    const head = Array.from({ length: p }, () => randInt(0, 9));
    let next: number;
    let rest: number[];
    if (bucket === "down") {
      const edge = Math.random();
      next = edge < 0.25 ? 4 : edge < 0.4 ? 0 : randInt(0, 4);
      rest = edge < 0.25 ? Array.from({ length: extra - 1 }, () => 9) : tail(extra - 1);
      if (next === 0 && rest.length === 0) continue; // would be an exact case
      if (next === 0 && rest[rest.length - 1] === 0) continue;
    } else {
      next = Math.random() < 0.25 ? 5 : randInt(5, 9);
      rest = next === 5 && Math.random() < 0.5 ? [] : tail(extra - 1);
      if (rest.length !== extra - 1) {
        // exactly 5 with nothing after: shorten the number
        const ds = [...head, 5];
        if (bucket === "up" && p > 0 && head[p - 1] === 9) continue;
        if (bucket === "up" && p === 0 && w === 9) continue;
        if (bucket === "carry" && !(p > 0 ? head[p - 1] === 9 : w === 9)) {
          if (p === 0) continue;
          head[p - 1] = 9;
        }
        return { x: build(w, bucket === "carry" ? [...head, 5] : ds), p };
      }
    }
    if (bucket === "up" && (p > 0 ? head[p - 1] === 9 : w === 9)) continue;
    if (bucket === "carry") {
      if (p === 0) {
        // whole-number carry: 9.6 -> 10
        const ds = [next, ...rest];
        return { x: build(9, ds), p };
      }
      head[p - 1] = 9;
      // two 9s in a row about half the time (the double carry)
      if (p === 2 && Math.random() < 0.5) head[0] = 9;
    }
    const ds = [...head, next, ...rest];
    if (ds.length !== total) continue;
    if (ds[ds.length - 1] === 0) continue;
    const x = build(w, ds);
    if (roundAt(x.t, p).r === 0) continue; // "rounds to 0.0" is a confusing case (as in twoPlacesCase)
    return { x, p };
  }
}

/**
 * A 3-digit number rounded to two different places (bucket "twoPlaces"),
 * places in random order, with two different answers (by value) so one
 * answer can't stand in for both.
 */
export function twoPlacesCase(): { t: number; places: [Places, Places] } {
  for (;;) {
    const w = randInt(0, 9);
    const t = w * 1000 + randInt(0, 9) * 100 + randInt(0, 9) * 10 + randInt(1, 9);
    const [a, b] = shuffle(pick<[Places, Places]>([[1, 2], [0, 1], [0, 2]]));
    if (a === 0 && b === 0) continue;
    const ra = roundAt(t, a).r;
    const rb = roundAt(t, b).r;
    if (ra === rb) continue;
    if (Math.min(a, b) === 0 && w === 0 && roundAt(t, 0).r === 0) continue; // "rounds to 0" is a confusing first case
    return { t, places: [a, b] };
  }
}

/** "the nearest tenth", "the nearest whole number". */
export const nearestText = (p: Places): string => `the nearest ${PLACE_SINGULAR[p]}`;
