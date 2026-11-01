// Small pure helpers shared by this lab's diagrams, unit files AND *Test.tsx
// files. A Test file importing from here is fine (it's a third module, not the
// paired unit file), so the circular-import rule in the lab-builder brief
// doesn't apply — this is the same arrangement as MG6 AreaAndPerimeterLab's
// lib/grid.ts.
//
// Every amount in this lab is stored as a whole number of HUNDREDTHS (e.g.
// 3.47 -> 347, 0.5 -> 50) so nothing ever depends on floating-point decimals
// comparing or printing cleanly. Denominators are only ever 10 or 100
// (4.NF.5-7's own restriction).

/** Number of hundredths -> decimal text with exactly `places` digits after
 *  the point. places 1 requires a whole number of tenths (h % 10 === 0). */
export function decimalText(h: number, places: 1 | 2): string {
  const w = Math.floor(h / 100);
  const r = h % 100;
  if (places === 1) return `${w}.${r / 10}`;
  return `${w}.${String(r).padStart(2, "0")}`;
}

/** The shortest decimal text for an amount of hundredths: "0.5" not "0.50",
 *  "0.47", "2" for a whole number. */
export function shortDecimal(h: number): string {
  if (h % 100 === 0) return String(h / 100);
  return h % 10 === 0 ? decimalText(h, 1) : decimalText(h, 2);
}

const randInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Unit 1's (a tenths, b hundredths) pair for a/10 + b/100, by scenario:
 *  - "add":   10a + b stays under one whole (≤ 99), b not a multiple of 10
 *             (so b is genuinely a hundredths amount, not tenths in disguise)
 *  - "small": b is 1-9 — a single-digit hundredths amount, where "add the
 *             tops" (a + b) and the right answer (10a + b) look most alike
 *  - "carry": 10a + b goes PAST one whole (101-189), the improper-looking sum
 * Shared by TenthsToHundredths.tsx AND its Test file (both import this third
 * module, so there's no unit<->test import).
 */
export function tenthsHundredthsPair(kind: "add" | "small" | "carry"): { a: number; b: number } {
  for (;;) {
    const a = randInt(1, 9);
    const b = kind === "small" ? randInt(1, 9) : randInt(11, 99);
    if (kind !== "small" && b % 10 === 0) continue;
    const s = 10 * a + b;
    if (kind === "carry" ? s > 100 : s < 100) return { a, b };
  }
}

/** A hundredths amount 11-99 that needs BOTH digits after the point — never
 *  a multiple of 10 (so "0.47 = 47/100" has exactly one tenths-or-hundredths
 *  fraction form, and a typed "0.4" vs "0.40" question never comes up). */
export function twoDigitHundredths(): number {
  for (;;) {
    const m = randInt(11, 99);
    if (m % 10 !== 0) return m;
  }
}

/** A mixed number w n/d (w 1-5, d 10 or 100) and its decimal, for Unit 2's
 *  mixed-number bucket. Hundredths parts may be 01-09 — the hidden zero
 *  INSIDE a mixed number (3.07), this bucket's hard edge. `h` is the whole
 *  amount in hundredths; `places` is how many digits follow the point. */
export function mixedDecimal(): { w: number; n: number; d: 10 | 100; h: number; places: 1 | 2 } {
  const w = randInt(1, 5);
  if (Math.random() < 0.5) {
    const n = randInt(1, 9);
    return { w, n, d: 10, h: 100 * w + 10 * n, places: 1 };
  }
  for (;;) {
    const n = randInt(1, 99);
    if (n % 10 !== 0) return { w, n, d: 100, h: 100 * w + n, places: 2 };
  }
}

/** Hundredths 1-99 with a nonzero hundredths digit (0.01-0.99, never 0.x0). */
const anyTwoDigit = (): number => {
  for (;;) {
    const m = randInt(1, 99);
    if (m % 10 !== 0) return m;
  }
};

/**
 * Unit 3 bucket "same-digits": two different decimals that BOTH have two
 * digits after the point. Half the time the tenths digit matches, so the
 * hundredths place has to break the tie (the hard edge, e.g. 0.42 vs 0.48).
 */
export function sameDigitsPair(): { a: number; b: number } {
  const sameTenths = Math.random() < 0.5;
  for (;;) {
    const a = anyTwoDigit();
    const b = anyTwoDigit();
    if (a === b) continue;
    if (sameTenths === (Math.floor(a / 10) === Math.floor(b / 10))) return { a, b };
  }
}

/**
 * Unit 3 bucket "fewer-digits-bigger": a one-digit decimal 0.t (stored as
 * `short` = 10t hundredths) and a two-digit decimal `long` that is SMALLER,
 * e.g. 0.5 vs 0.36. Hard edges: long = 10t − 1 (0.5 vs 0.49, the closest
 * case) and long < 10 (0.5 vs 0.07).
 */
export function fewerDigitsPair(): { short: number; long: number } {
  for (;;) {
    const t = randInt(1, 9);
    const long = anyTwoDigit();
    if (long < 10 * t) return { short: 10 * t, long };
  }
}

/**
 * Unit 3 bucket "same-whole-part": two decimals with the same whole-number
 * part (1-9), both two digits after the point. Half the time the tenths
 * match too, so only the hundredths decide (2.45 vs 2.49).
 */
export function sameWholePartPair(): { a: number; b: number; w: number } {
  const w = randInt(1, 9);
  const { a, b } = sameDigitsPair();
  return { a: 100 * w + a, b: 100 * w + b, w };
}

export interface DiffWholeScenario {
  thing: string;
  unit: string;
  smallName: string;
  bigName: string;
  /** tenths of the SHORT (10-unit) whole the small-whole person has */
  smallTenths: number;
  /** tenths of the LONG (100-unit) whole the big-whole person has */
  bigTenths: number;
}

/**
 * Unit 3 bucket "different-wholes": two people each have a decimal part of a
 * DIFFERENT-size whole — a 10-unit one and a 100-unit one. The bigger (or an
 * equal) decimal always goes on the short whole, so the decimals point the
 * wrong way: smallTenths units < 10 × bigTenths units, always. One time in
 * three the two decimals are equal (the plan's 0.5-vs-0.5 ribbon example),
 * the hard edge where "equal decimals = equal amounts" is the trap.
 */
export function diffWholeScenario(): DiffWholeScenario {
  const ctx = [
    { thing: "ribbon", unit: "cm" },
    { thing: "rope", unit: "m" },
    { thing: "string", unit: "cm" },
  ][randInt(0, 2)];
  const names = ["Mia", "Leo", "Ana", "Sam", "Kai", "Rosa"];
  const i = randInt(0, names.length - 1);
  let j = randInt(0, names.length - 1);
  while (j === i) j = randInt(0, names.length - 1);
  const equal = Math.random() < 1 / 3;
  const bigTenths = randInt(1, equal ? 9 : 8);
  const smallTenths = equal ? bigTenths : randInt(bigTenths + 1, 9);
  return { ...ctx, smallName: names[i], bigName: names[j], smallTenths, bigTenths };
}

/** The one comparison function behind every Explore readout and every graded
 *  symbol answer, so the two can never disagree. */
export function compareSymbol(a: number, b: number): "<" | ">" | "=" {
  return a < b ? "<" : a > b ? ">" : "=";
}

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** 0-99 in words ("forty-seven"). */
export function numberWords(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`;
}

/** How a decimal is read aloud, e.g. 47 hundredths of 2 -> "two and
 *  forty-seven hundredths"; 30 at places 1 -> "three tenths". */
export function decimalWords(h: number, places: 1 | 2): string {
  const w = Math.floor(h / 100);
  const r = h % 100;
  const n = places === 1 ? r / 10 : r;
  const unit = places === 1 ? (n === 1 ? "tenth" : "tenths") : n === 1 ? "hundredth" : "hundredths";
  const frac = `${numberWords(n)} ${unit}`;
  return w === 0 ? frac : `${numberWords(w)} and ${frac}`;
}
