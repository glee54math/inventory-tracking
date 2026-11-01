import { randInt, shuffle } from "../../../shared/lib/math";

// Small number/word facts used by BOTH a unit's Practice file and its Test
// file. Living in a third module keeps the "unit file and its *Test.tsx never
// import each other" rule (circular-import trap) intact while avoiding a
// third copy of these tables.

/** The benchmark turns of Unit 1, anchored to the circle-fraction model. */
export const BENCHMARKS = [
  { deg: 90, frac: "1/4", name: "a quarter turn" },
  { deg: 180, frac: "1/2", name: "a half turn" },
  { deg: 270, frac: "3/4", name: "a three-quarter turn" },
] as const;

/** Which quarter of a full turn an angle falls in: 0 = under 90°, 1 = 90-180, 2 = 180-270, 3 = 270-360. */
export const quarterOf = (m: number): number => Math.floor(m / 90);

export const BETWEEN_LABELS = [
  "more than 0° but less than a quarter turn (90°)",
  "more than a quarter turn (90°) but less than a half turn (180°)",
  "more than a half turn (180°) but less than a three-quarter turn (270°)",
  "more than a three-quarter turn (270°) but less than a full turn (360°)",
] as const;

/** A non-benchmark turn (multiple of 5) at least 15° from every benchmark, so its "between" answer is visible by eye. */
export const randomBetweenTurn = (quarter?: number): number => {
  for (;;) {
    const m = randInt(2, 70) * 5;
    const off = Math.min(...[0, 90, 180, 270, 360].map((b) => Math.abs(m - b)));
    if (off >= 15 && (quarter === undefined || quarterOf(m) === quarter)) return m;
  }
};

/**
 * Estimate choices for a turn of m degrees: the true m, the "measured the
 * outside of the turn" trap (360 - m), and one more value a quarter turn away
 * — every option sits in a DIFFERENT quarter, so a student can pick the
 * right one by benchmark reasoning alone, without a protractor.
 */
export const estimateDistractors = (m: number): string[] => {
  const out: number[] = [];
  const add = (v: number) => {
    if (v > 0 && v < 360 && v !== m && !out.includes(v) && quarterOf(v) !== quarterOf(m) && out.every((o) => quarterOf(o) !== quarterOf(v))) out.push(v);
  };
  add(360 - m); // measured the outside of the turn instead of the inside
  add(m + 90);
  add(m - 90);
  add(m + 180);
  add(m - 180);
  return out.slice(0, 2).map((v) => `${v}°`);
};

export const acuteOrObtuse = (m: number): string => (m < 90 ? "acute" : m === 90 ? "right" : m < 180 ? "obtuse" : "straight");

export type RayLengthKind = "trap" | "same" | "control";
export interface RayLengthPair {
  A: { len: number; m: number };
  B: { len: number; m: number };
  bigger: "A" | "B" | "same";
  /** Which letter has the long rays. */
  longer: "A" | "B";
}

const LONG = 110;
const SHORT = 50;
const tipGap = (len: number, m: number) => 2 * len * Math.sin((m * Math.PI) / 360);

/**
 * Two angles for Unit 1's ray-length bucket. "trap" = the long-ray angle has
 * LESS turn, and its ray tips are also farther apart than the short-ray
 * angle's (so "judge by how far apart the ends look" gives the wrong answer —
 * the documented misconception). "same" = equal turn, different ray lengths.
 * "control" = the long-ray angle really is bigger (so "longer = bigger" can't
 * be learned as a rule from the trap cases alone, either).
 */
export const rayLengthPair = (kind: RayLengthKind): RayLengthPair => {
  const longer: "A" | "B" = Math.random() < 0.5 ? "A" : "B";
  const other = longer === "A" ? "B" : "A";
  let longM: number;
  let shortM: number;
  if (kind === "same") {
    longM = shortM = randInt(6, 26) * 5;
  } else {
    for (;;) {
      const small = randInt(8, 13) * 5;
      const big = small + randInt(5, 9) * 5;
      if (kind === "trap") {
        longM = small;
        shortM = big;
        if (tipGap(LONG, longM) > tipGap(SHORT, shortM) + 4) break;
      } else {
        longM = big;
        shortM = small;
        break;
      }
    }
  }
  const pair = { [longer]: { len: LONG, m: longM }, [other]: { len: SHORT, m: shortM } } as unknown as { A: { len: number; m: number }; B: { len: number; m: number } };
  const bigger = pair.A.m === pair.B.m ? "same" : pair.A.m > pair.B.m ? "A" : "B";
  return { ...pair, bigger, longer };
};

/** Pick `n` distinct values from a list. */
export const pickDistinct = <T,>(arr: readonly T[], n: number): T[] => shuffle(arr).slice(0, n);
