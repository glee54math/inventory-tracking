import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { angleClassSq, isValidTriangle, largestAngleDeg, sideClassSq, triangleFromLengths, type AngleType, type Pt, type SideClass } from "./geometry";

// ============================================================================
// Unit 3 (Classifying Triangles) generators, shared by Practice and Test.
// Classification always comes from the STATED side lengths (squared, exact)
// via sideClassSq/angleClassSq — the drawing is to scale, but the labels are
// the information. A right isosceles triangle can't have three whole-number
// sides (its long side is leg × √2), so that one case labels only the two
// equal legs and leaves the long side unlabeled.
// ============================================================================

export interface TriSpec {
  /** Real side lengths, in drawing order: side 0 = AB, side 1 = BC, side 2 = CA. */
  sides: [number, number, number];
  /** Squared side lengths (exact integers) — what classification uses. */
  sq: [number, number, number];
  /** Label text per side, or null for "not labeled". */
  labels: (string | null)[];
  sideClass: SideClass;
  angleClass: AngleType;
  /** Vertex index (0 = A, 1 = B, 2 = C) of the right angle, if any. */
  rightAt: number | null;
  /** Drawing points (grid units, already rotated and fitted). */
  pts: [Pt, Pt, Pt];
  cols: number;
  rows: number;
  /** Near-miss: sides that look (almost) equal but are stated different. */
  nearMiss: boolean;
}

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
];

export interface TriRequest {
  side?: SideClass;
  angle?: AngleType;
  nearMiss?: boolean;
}

/** Visually fair: acute triangles stay clearly acute (largest ≤ 80°) and
 *  obtuse ones clearly obtuse (105°-140°), so the picture never contradicts
 *  the stated numbers' angle class. Right angles are always marked. */
function fair(lens: number[], angle: AngleType): boolean {
  if (angle === "right") return true;
  const big = largestAngleDeg(lens[0], lens[1], lens[2]);
  if (angle === "acute") return big <= 80;
  return big >= 105 && big <= 140;
}

function lengthsFor(req: TriRequest): { lens: number[]; rightIso: boolean } | null {
  if (req.nearMiss) {
    const n = randInt(7, 10);
    const opt = pick([
      [n, n, n + 1],
      [n, n + 1, n + 1],
      [n, n + 1, n + 2],
    ]);
    return { lens: opt, rightIso: false };
  }
  const side = req.side ?? pick(["equilateral", "isosceles", "scalene"] as SideClass[]);
  const angle = req.angle;
  if (side === "equilateral") {
    if (angle && angle !== "acute") return null;
    const s = randInt(3, 10);
    return { lens: [s, s, s], rightIso: false };
  }
  if (angle === "right") {
    if (side === "isosceles") {
      const L = randInt(4, 8);
      return { lens: [L, L, L * Math.SQRT2], rightIso: true };
    }
    return { lens: [...pick(TRIPLES)], rightIso: false };
  }
  if (side === "isosceles") {
    const L = randInt(3, 10);
    const B = randInt(2, 15);
    if (B === L) return null;
    return { lens: [L, L, B], rightIso: false };
  }
  const a = randInt(3, 12);
  const b = randInt(3, 12);
  const c = randInt(3, 13);
  if (a === b || b === c || a === c) return null;
  return { lens: [a, b, c], rightIso: false };
}

export function makeTriangle(req: TriRequest, unit = "cm"): TriSpec {
  for (;;) {
    const got = lengthsFor(req);
    if (!got) continue;
    const { lens, rightIso } = got;
    if (!isValidTriangle(lens[0], lens[1], lens[2])) continue;
    const sqAll = lens.map((l, i) => (rightIso && i === 2 ? 2 * lens[0] * lens[0] : l * l));
    const angle = angleClassSq(sqAll[0], sqAll[1], sqAll[2]);
    const sideC = sideClassSq(sqAll[0], sqAll[1], sqAll[2]);
    if (req.angle && angle !== req.angle) continue;
    if (req.side && !req.nearMiss && sideC !== req.side) continue;
    if (req.nearMiss && angle !== "acute") continue;
    if (!fair(lens, angle)) continue;
    // random assignment of the three lengths to sides AB, BC, CA
    const order = shuffle([0, 1, 2]);
    const sides = order.map((k) => lens[k]) as [number, number, number];
    const sq = order.map((k) => sqAll[k]) as [number, number, number];
    const labels = order.map((k) => (rightIso && k === 2 ? null : `${lens[k]} ${unit}`));
    // triangleFromLengths(a = BC, b = CA, c = AB)
    const raw = triangleFromLengths(sides[1], sides[2], sides[0]);
    // the right angle sits opposite the longest side
    let rightAt: number | null = null;
    if (angle === "right") {
      const longest = sq.indexOf(Math.max(...sq)); // side index
      rightAt = (longest + 2) % 3; // vertex opposite side i (AB->C, BC->A, CA->B)
    }
    // rotate by a random angle, scale to fit ~8 grid units, then fit in the canvas
    const theta = (pick([0, 0, 15, -15, 30, 180, 165, 195]) * Math.PI) / 180;
    const rot = raw.map(([x, y]) => [x * Math.cos(theta) - y * Math.sin(theta), x * Math.sin(theta) + y * Math.cos(theta)] as Pt);
    const w = Math.max(...rot.map((p) => p[0])) - Math.min(...rot.map((p) => p[0]));
    const h = Math.max(...rot.map((p) => p[1])) - Math.min(...rot.map((p) => p[1]));
    const k = 8 / Math.max(w, h * 1.25);
    const minX = Math.min(...rot.map((p) => p[0]));
    const minY = Math.min(...rot.map((p) => p[1]));
    const pts = rot.map(([x, y]) => [(x - minX) * k + 1.6, (y - minY) * k + 1.4] as Pt) as [Pt, Pt, Pt];
    return {
      sides,
      sq,
      labels,
      sideClass: sideC,
      angleClass: angle,
      rightAt,
      pts,
      cols: Math.ceil(w * k + 3.2),
      rows: Math.ceil(h * k + 2.8),
      nearMiss: !!req.nearMiss,
    };
  }
}

export const SIDE_RULE: Record<SideClass, string> = {
  equilateral: "all 3 sides the same length",
  isosceles: "exactly 2 sides the same length",
  scalene: "no sides the same length",
};

export const ANGLE_TRI_NAME: Record<AngleType, string> = { acute: "acute triangle", right: "right triangle", obtuse: "obtuse triangle" };
export const ANGLE_TRI_RULE: Record<AngleType, string> = {
  acute: "all 3 angles acute",
  right: "one right angle",
  obtuse: "one obtuse angle",
};

/** How many sides share their length with another side: 3, 2 or 0. */
export const equalSideCount = (c: SideClass): number => (c === "equilateral" ? 3 : c === "isosceles" ? 2 : 0);

/** "right isosceles" style full name. */
export const fullName = (s: SideClass, a: AngleType): string => `${a} ${s} triangle`;
