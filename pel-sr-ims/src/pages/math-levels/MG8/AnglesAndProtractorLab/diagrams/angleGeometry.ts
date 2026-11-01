import { palette } from "../../../shared/lib/palette";

/**
 * THE angle geometry for this whole lab. Every diagram (AngleFigure,
 * Protractor) positions its rays with these functions, and every graded
 * answer (practice steps, sketch checks, test questions) is computed with the
 * SAME functions — so a drawn ray and the number it is graded against can
 * never disagree (the build brief's "one function for render + grading" rule,
 * same idea as MG3/MG7's clockAngles()).
 *
 * Convention: a direction is in whole degrees, measured counter-clockwise
 * from "pointing right" (math convention). SVG's y-axis points down, so
 * dirPoint() flips the sign of the y component. Every diagram puts the
 * vertex (protractor center) at the SVG origin (0, 0).
 */

export type Tone = "a" | "b" | "c" | "ink";
export type Scale = "inner" | "outer";

export const toneColor = (t: Tone = "ink"): string => (t === "a" ? palette.a : t === "b" ? palette.b : t === "c" ? palette.c : palette.ink);

/** Wrap any degree value into [0, 360). */
export const norm360 = (d: number): number => {
  const r = ((d % 360) + 360) % 360;
  // Snap away floating noise so 359.9999999 doesn't sneak past a whole-degree check.
  const rounded = Math.round(r * 1e6) / 1e6;
  return rounded === 360 ? 0 : rounded + 0;
};

/** Point at distance `len` from the vertex, in direction `dir`. */
export const dirPoint = (dir: number, len: number): { x: number; y: number } => {
  const rad = (dir * Math.PI) / 180;
  return { x: len * Math.cos(rad), y: -len * Math.sin(rad) };
};

/** Direction (0-360) from the vertex toward an SVG point. */
export const pointerDir = (x: number, y: number): number => norm360((Math.atan2(-y, x) * 180) / Math.PI);

/** The measure of the angle between two rays — always the smaller side, 0-180. */
export const angleBetween = (d1: number, d2: number): number => {
  const d = norm360(d2 - d1);
  return d > 180 ? 360 - d : d;
};

/** Counter-clockwise turn from `from` to `to`, 0-359 (used for "amount of turn" arcs, which can pass 180). */
export const turnCCW = (from: number, to: number): number => norm360(to - from);

/**
 * THE protractor function. A protractor at rotation `rot` has its straight
 * edge along `rot` (right end) and `rot + 180` (left end), with its curved
 * half covering directions rot..rot+180. For a ray in direction `dir`:
 *   local  = how far that ray is from the protractor's right end (0-360)
 *   inner  = the inner-scale number it crosses (0 at the RIGHT end)
 *   outer  = the outer-scale number it crosses (0 at the LEFT end) = 180 - inner
 *   onArc  = whether the ray actually passes under the protractor's curved part
 * The Protractor diagram draws its tick labels with this, and every protractor
 * reading in Practice/Test is computed with it.
 */
export const protractorReading = (rot: number, dir: number): { local: number; inner: number; outer: number; onArc: boolean } => {
  const local = norm360(dir - rot);
  const onArc = local <= 180;
  return { local, inner: local, outer: 180 - local, onArc };
};

/** Which scale has its 0 sitting on `baseDir` for a protractor at `rot` — null if the protractor isn't lined up with that ray. */
export const correctScale = (rot: number, baseDir: number): Scale | null => {
  const local = norm360(baseDir - rot);
  if (local === 0) return "inner";
  if (local === 180) return "outer";
  return null;
};

/** The number a student should read for `rayDir`, given the base ray the protractor is lined up on (null if not lined up). */
export const measureOnProtractor = (rot: number, baseDir: number, rayDir: number): number | null => {
  const scale = correctScale(rot, baseDir);
  if (!scale) return null;
  const r = protractorReading(rot, rayDir);
  return scale === "inner" ? r.inner : r.outer;
};

/** Direction of the ray that makes a `measure`-degree angle with `baseDir` on the protractor's side. */
export const rayForMeasure = (rot: number, baseDir: number, measure: number): number => {
  const scale = correctScale(rot, baseDir) ?? "inner";
  return norm360(rot + (scale === "inner" ? measure : 180 - measure));
};

/** Where on the protractor (local 0-180) a given scale reading sits. */
export const localForReading = (scale: Scale, reading: number): number => (scale === "inner" ? reading : 180 - reading);

/**
 * Turn a raw pointer direction into the ray direction a drag should produce:
 * snapped to whole `snap`-degree steps measured FROM the protractor's 0 line
 * (so every reading lands exactly on a tick and grading stays exact), and
 * clamped onto the protractor's curved half so the ray can't wander under the
 * straight edge where there's no scale to read.
 */
export const dragToDir = (rot: number, rawDir: number, snap = 1, clampHalf = true): number => {
  let local = norm360(rawDir - rot);
  if (clampHalf && local > 180) local = local > 270 ? 0 : 180;
  local = Math.round(local / snap) * snap;
  if (clampHalf) local = Math.min(180, Math.max(0, local));
  return norm360(rot + local);
};

/** SVG path for an arc of radius r from `from`, turning counter-clockwise by `sweep` degrees. */
export const arcPath = (from: number, sweep: number, r: number, wedge = false): string => {
  if (sweep >= 359.999) {
    return `M ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0`;
  }
  const p0 = dirPoint(from, r);
  const p1 = dirPoint(from + sweep, r);
  const large = sweep > 180 ? 1 : 0;
  // sweep-flag 0 = counter-clockwise on screen (SVG's y axis points down).
  const arc = `A ${r} ${r} 0 ${large} 0 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  return wedge ? `M 0 0 L ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} ${arc} Z` : `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} ${arc}`;
};
