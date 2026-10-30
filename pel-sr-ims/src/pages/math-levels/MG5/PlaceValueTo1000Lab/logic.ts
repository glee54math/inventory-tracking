// Pure place-value helpers shared across this lab's units AND their
// *Test.tsx files (never shared between a unit file and its own Test file,
// or between two different units' files — this is a standalone sibling
// module, same convention as MG1_AdditionAndSubtractionWithin20Lab/logic.ts).
// Keeping these pure and in one place means a diagram's pictured state and a
// step's graded answer can never disagree.

export interface Digits {
  h: number;
  t: number;
  o: number;
}

/** Splits a 3-digit (or smaller) whole number into its hundreds/tens/ones digits. */
export const digitsOf = (n: number): Digits => ({
  h: Math.floor(n / 100),
  t: Math.floor((n % 100) / 10),
  o: n % 10,
});

export const valueFromDigits = (h: number, t: number, o: number): number => h * 100 + t * 10 + o;

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** Word form for 0-99 only — used as the "rest" (tens+ones) part of a 3-digit
 *  number's word form. Returns "" for 0 (nothing to say — the caller omits it
 *  entirely rather than printing a spurious "...hundred zero"). */
export const twoDigitWords = (n: number): string => {
  if (n === 0) return "";
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones === 0 ? TENS[tens] : `${TENS[tens]}-${ONES[ones]}`;
};

/** Word form for a 3-digit number (100-999), e.g. 342 -> "three hundred
 *  forty-two", 403 -> "four hundred three" (the zero in the tens place is
 *  never spoken as its own word), 500 -> "five hundred". */
export const numberWords = (n: number): string => {
  const { h, t, o } = digitsOf(n);
  const rest = t * 10 + o;
  const base = `${ONES[h]} hundred`;
  return rest > 0 ? `${base} ${twoDigitWords(rest)}` : base;
};

/** Expanded form for a 3-digit number, e.g. 342 -> "300 + 40 + 2", 403 ->
 *  "400 + 3" (no "+ 0" term for the empty tens place), 340 -> "300 + 40",
 *  500 -> "500" (a single term — nothing to add when everything else is 0). */
export const expandedForm = (n: number): string => {
  const { h, t, o } = digitsOf(n);
  const terms: number[] = [];
  if (h > 0) terms.push(h * 100);
  if (t > 0) terms.push(t * 10);
  if (o > 0) terms.push(o);
  return (terms.length ? terms : [0]).join(" + ");
};

/**
 * The exact wrong word-form a student makes when they treat a placeholder
 * zero as its own spoken word ("...hundred zero three" or "...forty zero")
 * instead of an absent place value. Returns null when `n` has no zero in the
 * tens or ones place to trap on (nothing to build a trap from).
 */
export const wordFormZeroTrap = (n: number): string | null => {
  const { h, t, o } = digitsOf(n);
  if (t === 0 && o > 0) return `${ONES[h]} hundred zero ${ONES[o]}`;
  if (o === 0 && t > 0) return `${ONES[h]} hundred ${twoDigitWords(t * 10)} zero`;
  return null;
};

/** The exact wrong expanded-form a student makes when they write a
 *  redundant "+ 0" term for an empty place instead of omitting it. Returns
 *  null when `n` has no zero place to trap on. */
export const expandedFormZeroTrap = (n: number): string | null => {
  const { h, t, o } = digitsOf(n);
  if (t === 0 && o > 0) return `${h * 100} + 0 + ${o}`;
  if (o === 0 && t > 0) return `${h * 100} + ${t * 10} + 0`;
  return null;
};

/** Swaps the tens and ones digits — a wrong-answer builder for "read the
 *  digits in the wrong order" distractors (e.g. 342 -> 324). When t === o
 *  the swap is a no-op (same number); callers that need a GENUINELY
 *  different distractor should pick numbers where this can't happen, same
 *  "draw distinctness from the pre-transform values" rule as everywhere
 *  else in this lab. */
export const swapTensOnes = (n: number): number => {
  const { h, t, o } = digitsOf(n);
  return valueFromDigits(h, o, t);
};

/** Swaps the hundreds and tens digits — a wrong-answer builder for the same
 *  "digits read in the wrong order" mistake, one place up (e.g. 342 -> 432). */
export const swapHundredsTens = (n: number): number => {
  const { h, t, o } = digitsOf(n);
  return valueFromDigits(t, h, o);
};

/** 23 tens -> 2 hundreds, 3 leftover tens, value 230. Shared by the
 *  regroup bucket's diagram (pre-bundle loose tens -> bundled hundreds+tens)
 *  and its step-checking, so the picture and the grading can't drift. */
export const regroupBreakdown = (tensCount: number): { hundreds: number; leftoverTens: number; value: number } => ({
  hundreds: Math.floor(tensCount / 10),
  leftoverTens: tensCount % 10,
  value: tensCount * 10,
});

/** start, start+step, start+2*step, ... (length `count`). Shared by the
 *  counting/skip-counting diagram and its step-checking. */
export const buildSequence = (start: number, step: number, count: number): number[] => Array.from({ length: count }, (_, i) => start + i * step);

export type Place = "hundreds" | "tens" | "ones" | "equal";

/** Compares two numbers the correct left-to-right way (hundreds first, then
 *  tens, then ones) rather than by "which number looks bigger" — also
 *  reports which place actually decided it, for the vocabulary step that
 *  asks the student to name it. */
export const compareNumbers = (a: number, b: number): { symbol: ">" | "<" | "="; decidingPlace: Place } => {
  const da = digitsOf(a);
  const db = digitsOf(b);
  if (da.h !== db.h) return { symbol: da.h > db.h ? ">" : "<", decidingPlace: "hundreds" };
  if (da.t !== db.t) return { symbol: da.t > db.t ? ">" : "<", decidingPlace: "tens" };
  if (da.o !== db.o) return { symbol: da.o > db.o ? ">" : "<", decidingPlace: "ones" };
  return { symbol: "=", decidingPlace: "equal" };
};
