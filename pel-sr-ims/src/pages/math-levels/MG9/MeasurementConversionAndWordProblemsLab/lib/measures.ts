// Lab-local data + pure helpers for MG9_MeasurementConversionAndWordProblemsLab.
//
// A leaf module: imports nothing from units/, so BOTH a unit file and its own
// *Test.tsx can import from here without creating the unit <-> Test circular
// import the *Test.tsx convention exists to avoid (same arrangement as
// MG6/AreaAndPerimeterLab/lib/grid.ts, which its units and tests both use).

import { pick, randInt } from "../../../shared/lib/math";

/** The five measurement families named in 4.MD.1. "mass" is metric (kg/g);
 *  "weight" is customary (lb/oz) — kept separate because 16 is the one
 *  irregular, non-power-of-ten factor and gets its own practice bucket. */
export type Family = "length" | "mass" | "capacity" | "weight" | "time";
export const FAMILIES: Family[] = ["length", "mass", "capacity", "weight", "time"];

export interface Conv {
  id: string;
  family: Family;
  big: string;
  bigs: string;
  bigAb: string;
  small: string;
  smalls: string;
  smallAb: string;
  /** How many of the small unit make ONE of the big unit. */
  f: number;
  /** A concrete, picturable comparison for a first-time learner. */
  bigLike: string;
  smallLike: string;
}

export const CONVS: Conv[] = [
  { id: "km-m", family: "length", big: "kilometer", bigs: "kilometers", bigAb: "km", small: "meter", smalls: "meters", smallAb: "m", f: 1000, bigLike: "about how far you can walk in 12 minutes", smallLike: "about one big step" },
  { id: "m-cm", family: "length", big: "meter", bigs: "meters", bigAb: "m", small: "centimeter", smalls: "centimeters", smallAb: "cm", f: 100, bigLike: "about as high as a doorknob", smallLike: "about as wide as your pinky fingernail" },
  { id: "kg-g", family: "mass", big: "kilogram", bigs: "kilograms", bigAb: "kg", small: "gram", smalls: "grams", smallAb: "g", f: 1000, bigLike: "about as heavy as a big 1-liter bottle of water", smallLike: "about as heavy as one paper clip" },
  { id: "l-ml", family: "capacity", big: "liter", bigs: "liters", bigAb: "L", small: "milliliter", smalls: "milliliters", smallAb: "mL", f: 1000, bigLike: "one big bottle of water", smallLike: "about 20 tiny drops from an eyedropper" },
  { id: "lb-oz", family: "weight", big: "pound", bigs: "pounds", bigAb: "lb", small: "ounce", smalls: "ounces", smallAb: "oz", f: 16, bigLike: "about as heavy as a loaf of bread", smallLike: "about as heavy as one slice of bread" },
  { id: "hr-min", family: "time", big: "hour", bigs: "hours", bigAb: "hr", small: "minute", smalls: "minutes", smallAb: "min", f: 60, bigLike: "about as long as a soccer practice", smallLike: "about as long as counting slowly to 60" },
  { id: "min-sec", family: "time", big: "minute", bigs: "minutes", bigAb: "min", small: "second", smalls: "seconds", smallAb: "sec", f: 60, bigLike: "about as long as counting slowly to 60", smallLike: "about as long as saying \"one-Mississippi\"" },
];

export const convById = (id: string): Conv => CONVS.find((c) => c.id === id)!;
export const convsIn = (family: Family): Conv[] => CONVS.filter((c) => c.family === family);
export const pickConv = (family?: Family): Conv => pick(family ? convsIn(family) : CONVS);

/** "1 pound" / "3 pounds" — singular only for exactly 1. */
export const bigWord = (c: Conv, n: number): string => (n === 1 ? c.big : c.bigs);
export const smallWord = (c: Conv, n: number): string => (n === 1 ? c.small : c.smalls);

/** A believable WRONG factor for a pair — the specific mix-up a student makes:
 *  1000 vs 100 swapped between metric pairs, and "time/ounces work in tens
 *  like everything else" (100 for 60, 10 for 16). Never equal to c.f. */
export const wrongFactor = (c: Conv): number => (c.f === 1000 ? 100 : c.f === 100 ? 1000 : c.f === 60 ? 100 : 10);

/** How the 1-big-unit bar is cut into equal labeled pieces for UnitBar:
 *  [number of pieces, small units per piece]. Always pieces × each === f. */
export const barPieces = (f: number): [number, number] => (f === 1000 ? [10, 100] : f === 100 ? [10, 10] : f === 60 ? [12, 5] : [f, 1]);

/** A random "leftover" small amount for a mixed measurement like
 *  "3 km 50 m" — always 1..f-1. For f = 1000 / 100, about a third of draws
 *  are deliberately SHORT (under 100 / under 10) so the hard placeholder-
 *  zero case (3 km 50 m = 3,050 m, not 350 m) is regularly reachable. */
export const leftoverSmall = (f: number): number => {
  if (f === 1000) return Math.random() < 0.35 ? randInt(1, 9) * 10 : randInt(1, 19) * 50;
  if (f === 100) return Math.random() < 0.35 ? randInt(1, 9) : randInt(11, 99);
  if (f === 60) return randInt(1, 11) * 5;
  return randInt(1, 15);
};

// ---------------------------------------------------------------------------
// Fractions / decimals of a big unit (Unit 2's "simple fractions or decimals")
// ---------------------------------------------------------------------------

export interface FracQty {
  whole: number;
  /** Quarters beyond the whole: 1 = 1/4, 2 = 1/2, 3 = 3/4 (never 0). */
  quarters: 1 | 2 | 3;
  /** Write as a decimal ("1.5") instead of a fraction ("1 1/2"). */
  decimal: boolean;
}

export const fracValue = (q: FracQty): number => q.whole + q.quarters / 4;

export const fracQtyText = (q: FracQty): string => {
  if (q.decimal) return String(fracValue(q));
  const part = q.quarters === 2 ? "1/2" : `${q.quarters}/4`;
  return q.whole === 0 ? part : `${q.whole} ${part}`;
};

/** The small-unit size of a fraction-of-a-big-unit amount — always a whole
 *  number, since every factor in this lab (1000, 100, 60, 16) divides by 4. */
export const fracToSmall = (q: FracQty, c: Conv): number => q.whole * c.f + (q.quarters * c.f) / 4;

/** Decimals only for metric pairs (km, kg, L, m) — nobody writes "1.25 hours"
 *  or "0.75 pounds" in a grade-4 story; those stay fractions. */
export const canUseDecimal = (c: Conv): boolean => c.f === 1000 || c.f === 100;

// ---------------------------------------------------------------------------
// Money (Unit 3) — always computed in whole cents, only divided by 100 for display
// ---------------------------------------------------------------------------

/** "$4.50", "$13", "$0.75" — two decimals whenever there are cents. */
export const usd = (cents: number): string => {
  const c = Math.round(cents);
  return c % 100 === 0 ? `$${c / 100}` : `$${Math.floor(c / 100)}.${String(c % 100).padStart(2, "0")}`;
};

/** Always two decimals, even for whole dollars ("$13.00") — receipts. */
export const usd2 = (cents: number): string => {
  const c = Math.round(cents);
  return `$${Math.floor(c / 100)}.${String(c % 100).padStart(2, "0")}`;
};

/** Quarter-dollar (binary-exact) price pool, in cents: $0.75 .. $9.75. Every
 *  "how many can I buy" division then terminates to the cent — never forces a round. */
export const quarterPrice = (minCents = 75, maxCents = 975): number => randInt(minCents / 25, maxCents / 25) * 25;

/** Rectangle helper (Unit 4): area and perimeter never equal, and l ≠ w. */
export const rectOk = (l: number, w: number): boolean => l !== w && l * w !== 2 * (l + w) && l * w !== l + w;

/** Two different rectangles ([l, w], l > w ≥ 2) with the same perimeter but
 *  different areas. Half-perimeter 10-20, so sides reach the teens. */
export const samePerimeterPair = (): [[number, number], [number, number]] => {
  const half = randInt(10, 20);
  const ws: number[] = [];
  for (let w = 2; w < half - w; w++) ws.push(w);
  const i = randInt(0, ws.length - 1);
  let j = randInt(0, ws.length - 2);
  if (j >= i) j++;
  return [
    [half - ws[i], ws[i]],
    [half - ws[j], ws[j]],
  ];
};

/** Two different rectangles with the same area but different perimeters. */
export const sameAreaPair = (): [[number, number], [number, number]] => {
  for (;;) {
    const area = pick([12, 16, 18, 20, 24, 30, 36, 40, 48, 60, 72]);
    const pairs: [number, number][] = [];
    for (let w = 1; w * w < area; w++) if (area % w === 0 && area / w <= 24) pairs.push([area / w, w]);
    if (pairs.length < 2) continue;
    const i = randInt(0, pairs.length - 1);
    let j = randInt(0, pairs.length - 2);
    if (j >= i) j++;
    return [pairs[i], pairs[j]];
  }
};

/** Distinct strings only, in order — for hand-built distractor lists. */
export const uniq = (xs: string[], not: string): string[] => xs.filter((x, i) => x !== not && xs.indexOf(x) === i);
