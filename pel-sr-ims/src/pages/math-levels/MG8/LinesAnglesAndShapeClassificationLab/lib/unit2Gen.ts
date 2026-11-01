import { pick, randInt } from "../../../shared/lib/math";
import { add, angleDeg, cross, d4, isConvex, lineRelation, mul, parallelPairCount, segmentsTouch, sidesParallelTo, sidesPerpendicularTo, type LineRelation, type Pt } from "./geometry";

// ============================================================================
// Unit 2 (Parallel & Perpendicular Lines) generators, shared by the unit's
// Practice and its Test. Every relationship is decided by lineRelation()
// (exact integer cross/dot products) — never by how the picture looks.
// ============================================================================

export const LINES_COLS = 14;
export const LINES_ROWS = 9;

export type LinesBand = "parallel" | "perpendicular" | "meetLater" | "oblique" | "nearPerp";

export interface TwoLinesSpec {
  band: LinesBand;
  relation: LineRelation;
  /** Drawn ends of each line (arrowheads go here). */
  l1: [Pt, Pt];
  l2: [Pt, Pt];
  d1: Pt;
  d2: Pt;
  /** Where the two lines meet (integer), or null if parallel. */
  meet: Pt | null;
  /** Do the DRAWN pieces cross in the picture? */
  crossInPicture: boolean;
  deg: number;
}

const DIRS: Pt[] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
  [2, 1],
  [1, 2],
  [2, -1],
  [1, -2],
  [3, 1],
  [1, 3],
  [3, -1],
  [1, -3],
];

const inBox = (p: Pt) => p[0] >= 0 && p[0] <= LINES_COLS && p[1] >= 0 && p[1] <= LINES_ROWS;

/** Integer steps s for which P + s·d stays on the canvas: [smin, smax]. */
function span(P: Pt, d: Pt): [number, number] {
  let lo = 0;
  let hi = 0;
  while (inBox(add(P, mul(d, lo - 1)))) lo--;
  while (inBox(add(P, mul(d, hi + 1)))) hi++;
  return [lo, hi];
}

const len = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Smallest integer direction perpendicular to d. */
const perp = (d: Pt): Pt => [-d[1], d[0]];

export function makeTwoLines(band: LinesBand): TwoLinesSpec {
  for (;;) {
    const P: Pt = [randInt(2, LINES_COLS - 2), randInt(2, LINES_ROWS - 2)];
    const d1 = pick(DIRS);
    let d2: Pt;
    if (band === "parallel") d2 = d1;
    else if (band === "perpendicular") d2 = perp(d1);
    else d2 = pick(DIRS);
    const rel = lineRelation(d1, d2);
    const deg = angleDeg(d1, d2);
    const acuteDeg = Math.min(deg, 180 - deg);
    if (band === "oblique" && (rel !== "neither" || acuteDeg < 25 || acuteDeg > 72)) continue;
    if (band === "nearPerp" && (rel !== "neither" || acuteDeg < 70 || acuteDeg > 84)) continue;
    if (band === "meetLater" && (rel !== "neither" || acuteDeg < 12 || acuteDeg > 50)) continue;

    if (band === "parallel") {
      // second line through an offset point, at least 2 grid units away
      const o: Pt = [randInt(-4, 4), randInt(-4, 4)];
      const dist = Math.abs(cross(d1, o)) / Math.hypot(d1[0], d1[1]);
      if (dist < 2 || dist > 5) continue;
      const Q = add(P, o);
      if (!inBox(Q)) continue;
      const [a1, b1] = span(P, d1);
      const [a2, b2] = span(Q, d1);
      const l1: [Pt, Pt] = [add(P, mul(d1, a1)), add(P, mul(d1, b1))];
      const l2: [Pt, Pt] = [add(Q, mul(d1, a2)), add(Q, mul(d1, b2))];
      if (len(...l1) < 6 || len(...l2) < 6) continue;
      return { band, relation: "parallel", l1, l2, d1, d2: d1, meet: null, crossInPicture: false, deg: 0 };
    }

    const [a1, b1] = span(P, d1);
    const [a2, b2] = span(P, d2);
    if (band === "meetLater") {
      // each line drawn only on one side of the meeting point, starting a gap away
      const s1 = Math.random() < 0.5 ? 1 : -1;
      const s2 = Math.random() < 0.5 ? 1 : -1;
      const far1 = s1 > 0 ? b1 : -a1;
      const far2 = s2 > 0 ? b2 : -a2;
      const g1 = Math.ceil(2.5 / Math.hypot(d1[0], d1[1]));
      const g2 = Math.ceil(2.5 / Math.hypot(d2[0], d2[1]));
      if (far1 - g1 < 1 || far2 - g2 < 1) continue;
      const l1: [Pt, Pt] = [add(P, mul(d1, s1 * g1)), add(P, mul(d1, s1 * far1))];
      const l2: [Pt, Pt] = [add(P, mul(d2, s2 * g2)), add(P, mul(d2, s2 * far2))];
      if (len(...l1) < 4 || len(...l2) < 4) continue;
      if (segmentsTouch(l1[0], l1[1], l2[0], l2[1])) continue;
      // the lines should look like they're heading toward each other (not obviously crossing behind)
      return { band, relation: "neither", l1, l2, d1, d2, meet: P, crossInPicture: false, deg };
    }
    // crossing in the picture: both lines span through P
    if (a1 > -1 || b1 < 1 || a2 > -1 || b2 < 1) continue;
    const l1: [Pt, Pt] = [add(P, mul(d1, a1)), add(P, mul(d1, b1))];
    const l2: [Pt, Pt] = [add(P, mul(d2, a2)), add(P, mul(d2, b2))];
    if (len(...l1) < 6 || len(...l2) < 6) continue;
    // keep the crossing away from the very ends so it reads as a real crossing
    if (Math.min(len(P, l1[0]), len(P, l1[1]), len(P, l2[0]), len(P, l2[1])) < 1.9) continue;
    return { band, relation: rel, l1, l2, d1, d2, meet: P, crossInPicture: true, deg };
  }
}

// ---------------------------------------------------------------------------
// Parallel / perpendicular sides inside a labeled quadrilateral
// ---------------------------------------------------------------------------

export type FigKind = "rectangle" | "parallelogram" | "rightTrapezoid" | "trapezoid" | "oneRight";

export interface SideFigure {
  kind: FigKind;
  pts: Pt[];
  letters: string[];
  parallelPairs: number;
}

function base(kind: FigKind): Pt[] | null {
  const h = randInt(3, 5);
  switch (kind) {
    case "rectangle": {
      const w = randInt(3, 7);
      if (w === h) return null;
      return [
        [0, 0],
        [w, 0],
        [w, h],
        [0, h],
      ];
    }
    case "parallelogram": {
      const w = randInt(3, 6);
      const s = pick([-3, -2, -1, 1, 2, 3]);
      return [
        [0, 0],
        [w, 0],
        [w + s, h],
        [s, h],
      ];
    }
    case "rightTrapezoid": {
      const top = randInt(2, 5);
      const bottom = top + randInt(2, 4);
      return [
        [0, 0],
        [top, 0],
        [bottom, h],
        [0, h],
      ];
    }
    case "trapezoid": {
      const top = randInt(2, 4);
      const left = randInt(1, 3);
      const right = randInt(1, 3);
      if (left === right) return null; // not a mirror-image trapezoid; just "a" trapezoid
      return [
        [left, 0],
        [left + top, 0],
        [left + top + right, h],
        [0, h],
      ];
    }
    case "oneRight": {
      // one square corner at the origin, no parallel sides
      const w = randInt(4, 7);
      return [
        [0, 0],
        [w, 0],
        [w - randInt(-2, 1), h + randInt(1, 2)],
        [0, h],
      ];
    }
  }
}

export function makeSideFigure(kind: FigKind): SideFigure {
  for (;;) {
    const b = base(kind);
    if (!b) continue;
    const k = randInt(0, 7);
    const t = b.map((p) => d4(p, k));
    const minX = Math.min(...t.map((p) => p[0]));
    const minY = Math.min(...t.map((p) => p[1]));
    const s = randInt(0, 3);
    const shifted = t.map((p) => [p[0] - minX + 1, p[1] - minY + 1] as Pt);
    const pts = shifted.map((_, i) => shifted[(i + s) % 4]);
    if (!isConvex(pts)) continue;
    const pp = parallelPairCount(pts);
    const want = kind === "rectangle" || kind === "parallelogram" ? 2 : kind === "oneRight" ? 0 : 1;
    if (pp !== want) continue;
    if (kind === "oneRight" && pts.filter((_, i) => sidesPerpendicularTo(pts, i).length > 0).length !== 2) continue;
    return { kind, pts, letters: ["A", "B", "C", "D"], parallelPairs: pp };
  }
}

/** For a side i: the one other side parallel to it, or null (none). */
export const parallelPartner = (f: SideFigure, i: number): number | null => sidesParallelTo(f.pts, i)[0] ?? null;

/** Sides with at most one perpendicular partner (so a single-answer question is fair). */
export const perpAskable = (f: SideFigure): number[] => [0, 1, 2, 3].filter((i) => sidesPerpendicularTo(f.pts, i).length <= 1);

export const perpPartner = (f: SideFigure, i: number): number | null => sidesPerpendicularTo(f.pts, i)[0] ?? null;


