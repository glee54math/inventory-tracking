import { randInt } from "../../../shared/lib/math";
import { measureOnProtractor, protractorReading } from "../diagrams/angleGeometry";

// Protractor-reading scenarios shared by MeasuringWithAProtractor.tsx (Practice)
// and MeasuringWithAProtractorTest.tsx — a third module so neither imports the other.

export type Side = "right" | "left";

/** The base ray on the right end (inner scale reads 0 there) or the left end (outer scale reads 0 there), on a flat protractor. */
export const setupRead = (side: Side, m: number) => {
  const baseDir = side === "right" ? 0 : 180;
  const rayDir = side === "right" ? m : 180 - m;
  // The graded reading comes from the SAME function the protractor's tick labels use.
  const reading = measureOnProtractor(0, baseDir, rayDir)!;
  const other = side === "right" ? protractorReading(0, rayDir).outer : protractorReading(0, rayDir).inner;
  const scaleName = side === "right" ? "blue inner scale" : "orange outer scale";
  return { side, baseDir, rayDir, reading, other, scaleName };
};

export const randomSide = (): Side => (Math.random() < 0.5 ? "right" : "left");
/** Acute multiples of 5 that fall BETWEEN the labeled tens (15, 25, … 85) — the student has to count ticks. */
export const acuteBetweenTens = () => randInt(1, 8) * 10 + 5;
/** Obtuse multiples of 5 between the labeled tens (95, 105, … 175). */
export const obtuseBetweenTens = () => randInt(9, 17) * 10 + 5;
/** Any labeled ten except 90 (10 … 170). */
export const labeledTen = () => {
  let m = randInt(1, 17) * 10;
  while (m === 90) m = randInt(1, 17) * 10;
  return m;
};

/** Distractors for a protractor reading m: the wrong-scale reading (180 − m) and a tick-miscount by 10. */
export const readDistractors = (m: number): string[] => {
  const wrong = 180 - m; // read the OTHER scale — the #1 protractor mistake
  const miscount = m + 10 !== wrong && m + 10 < 180 ? m + 10 : m - 10; // counted one ten too far / short
  return [`${wrong}°`, `${miscount}°`];
};

/** Two rays, neither on 0: both readings on the same (named) scale, then subtract. */
export const setupUnaligned = () => {
  const a = randInt(2, 14) * 5; // first ray's position, 10..70
  const m = randInt(4, 20) * 5; // 20..100
  const b = Math.min(a + m, 170);
  const scale: "inner" | "outer" = Math.random() < 0.5 ? "inner" : "outer";
  const r1 = protractorReading(0, a);
  const r2 = protractorReading(0, b);
  const read1 = scale === "inner" ? r1.inner : r1.outer;
  const read2 = scale === "inner" ? r2.inner : r2.outer;
  return { dir1: a, dir2: b, read1, read2, measure: Math.abs(read2 - read1), scale, scaleName: scale === "inner" ? "blue inner scale" : "orange outer scale" };
};
