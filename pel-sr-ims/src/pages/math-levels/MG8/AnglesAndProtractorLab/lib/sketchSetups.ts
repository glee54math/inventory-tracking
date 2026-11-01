import { randInt, shuffle } from "../../../shared/lib/math";
import { correctScale, localForReading, norm360, type Scale } from "../diagrams/angleGeometry";

// Sketching scenarios shared by SketchingAngles.tsx (Practice) and
// SketchingAnglesTest.tsx — a third module so neither imports the other.

export type Placement = "right" | "left" | "rotated";

/** A target measure: any whole number 10-170 except 85-95 (where the wrong-scale point would sit almost on top of the right one). */
export const sketchTarget = (): number => {
  for (;;) {
    const t = randInt(10, 170);
    if (Math.abs(t - 90) > 5) return t;
  }
};

/**
 * Where the protractor and base ray sit. "right"/"left" = flat protractor,
 * base ray on the right end (inner scale) or left end (outer scale).
 * "rotated" = the base ray points some other way (multiple of 15°, never flat)
 * and the protractor has been turned to line up with it, either end.
 */
export const sketchPlacement = (p: Placement): { rot: number; baseDir: number; scale: Scale } => {
  if (p === "right") return { rot: 0, baseDir: 0, scale: "inner" };
  if (p === "left") return { rot: 0, baseDir: 180, scale: "outer" };
  let rot = randInt(1, 23) * 15;
  while (rot === 180) rot = randInt(1, 23) * 15;
  const baseDir = Math.random() < 0.5 ? rot : norm360(rot + 180);
  return { rot, baseDir, scale: correctScale(rot, baseDir)! };
};

/**
 * Four lettered points on the protractor edge for "which point do you mark to
 * draw a T° angle?": the right one, the WRONG-SCALE one (the other scale's T,
 * which makes a (180 − T)° angle), and tick-miscounts 10 away. All at least
 * 8° apart so the letters never overlap; lettered A-D left-to-right along the
 * curve so the correct letter moves around.
 */
export const markPoints = (scale: Scale, t: number) => {
  const correct = localForReading(scale, t);
  const wrongScale = 180 - correct;
  const cands = [correct, wrongScale, correct + 10, correct - 10, wrongScale + 10, wrongScale - 10];
  const chosen: number[] = [];
  for (const c of cands) {
    if (chosen.length === 4) break;
    if (c < 3 || c > 177) continue;
    if (chosen.every((x) => Math.abs(x - c) >= 8)) chosen.push(c);
  }
  const ordered = [...chosen].sort((a, b) => b - a); // left end (180) first, so A is leftmost
  const letters = ["A", "B", "C", "D"];
  const marks = ordered.map((local, i) => ({ local, label: letters[i] }));
  const letterOf = (local: number) => marks.find((m) => m.local === local)!.label;
  return { marks, correctLetter: letterOf(correct), wrongScaleLetter: letterOf(wrongScale), letters: letters.slice(0, marks.length) };
};

/** Three distinct angles for "which one is the benchmark?" — shuffled, lettered. */
export const benchmarkLineup = (target: 90 | 180) => {
  const others = target === 90 ? [randInt(12, 15) * 5, randInt(22, 25) * 5] : [randInt(26, 30) * 5, randInt(31, 33) * 5];
  return shuffle([target, ...others]);
};
