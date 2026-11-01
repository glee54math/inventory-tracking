import { pick, randInt } from "../../../shared/lib/math";

// Angle-addition scenarios shared by AngleAddition.tsx (Practice) and
// AngleAdditionTest.tsx — a third module so neither imports the other.
// Every part is at least 15° so its label fits inside its own wedge.

export const randomBase = () => randInt(0, 4) * 15;

/** Two known parts, find the whole. Whole ≤ 165; ones digits often regroup. */
export const wholeSetup = () => {
  const a = randInt(15, 80);
  const b = randInt(15, Math.min(80, 165 - a));
  return { a, b, whole: a + b };
};

/** Whole and one part known, find the other part. */
export const partSetup = () => {
  const whole = randInt(40, 170);
  const a = randInt(15, whole - 15);
  return { whole, a, b: whole - a };
};

export type ThreeContext = "shown" | "straight";
/**
 * Three parts with ONE unknown. "shown" = the whole is written on the
 * picture (or is itself the unknown, unknownIdx 3). "straight" = the parts
 * fill a straight line, so the whole (180°) is never written — the student
 * must know it.
 */
export const threeSetup = (context: ThreeContext = pick(["shown", "shown", "straight"] as const)) => {
  let parts: number[];
  if (context === "straight") {
    for (;;) {
      const a = randInt(20, 80);
      const b = randInt(20, 80);
      if (180 - a - b >= 20) {
        parts = [a, b, 180 - a - b];
        break;
      }
    }
  } else {
    parts = [randInt(15, 55), randInt(15, 55), randInt(15, 55)];
  }
  const whole = parts.reduce((s, p) => s + p, 0);
  const unknownIdx = context === "straight" ? randInt(0, 2) : randInt(0, 3);
  return { parts, whole, unknownIdx, context };
};

export type EqContext = "shown" | "right" | "straight";
/** One known part + unknown part x, inside a whole that is written ("shown") or only implied (square corner = 90°, straight line = 180°). */
export const equationSetup = (context: EqContext = pick(["shown", "shown", "right", "straight"] as const)) => {
  const whole = context === "right" ? 90 : context === "straight" ? 180 : randInt(50, 170);
  const a = randInt(15, whole - 15);
  const xFirst = Math.random() < 0.5; // which side of the picture the unknown sits on
  return { whole, a, x: whole - a, context, xFirst };
};
