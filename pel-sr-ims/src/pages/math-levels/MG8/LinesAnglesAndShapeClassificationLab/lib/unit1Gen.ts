import { pick, randInt } from "../../../shared/lib/math";
import { angleDeg, angleTypeOf, d4, isConvex, polygonAngleDegs, polygonAngleTypes, sub, type AngleType, type Pt } from "./geometry";

// ============================================================================
// Unit 1 (Points, Lines, Rays & Angle Types) generators — used by BOTH the
// unit's Practice file and its Test file, so the two can never drift apart
// (and the Test file never has to import the unit file — see the
// circular-import rule in the lab brief).
// ============================================================================

export type FigureKind = "segment" | "ray" | "line";
export const FIGURE_NAME: Record<FigureKind, string> = { segment: "line segment", ray: "ray", line: "line" };
export const FIGURE_ENDPOINTS: Record<FigureKind, number> = { segment: 2, ray: 1, line: 0 };

export interface FigureSpec {
  kind: FigureKind;
  /** The two labeled points on it (grid units). For a ray, p is the endpoint. */
  p: Pt;
  q: Pt;
  /** Where the arrowhead(s) are drawn — beyond q (and, for a line, beyond p). */
  tipQ: Pt;
  tipP: Pt;
  names: [string, string];
  cols: number;
  rows: number;
}

const DIRS: Pt[] = [
  [5, 0],
  [4, 2],
  [4, -2],
  [3, 3],
  [3, -3],
  [0, 4],
  [2, 4],
  [-2, 4],
];
const NAME_PAIRS: [string, string][] = [
  ["P", "Q"],
  ["A", "B"],
  ["M", "N"],
  ["R", "S"],
  ["X", "Y"],
  ["J", "K"],
];

/** A segment, ray or line through two labeled points, in a random direction.
 *  For a ray, the arrow end is random too (never always "points right"). */
export function makeFigure(kind: FigureKind): FigureSpec {
  let d = pick(DIRS);
  if (Math.random() < 0.5) d = [-d[0], -d[1]];
  // grid: put p so p, q and both arrow tips fit with a margin of 1
  const ext: Pt = [Math.round(d[0] * 0.45), Math.round(d[1] * 0.45)];
  const raw: Pt[] = [
    [-ext[0], -ext[1]],
    [0, 0],
    d,
    [d[0] + ext[0], d[1] + ext[1]],
  ];
  const minX = Math.min(...raw.map((r) => r[0]));
  const minY = Math.min(...raw.map((r) => r[1]));
  const shift = (r: Pt): Pt => [r[0] - minX + 1, r[1] - minY + 1];
  const [tipP, p, q, tipQ] = raw.map(shift);
  const cols = Math.max(...raw.map((r) => r[0])) - minX + 2;
  const rows = Math.max(...raw.map((r) => r[1])) - minY + 2;
  return { kind, p, q, tipP, tipQ, names: pick(NAME_PAIRS), cols, rows };
}

// ---------------------------------------------------------------------------
// Single angles
// ---------------------------------------------------------------------------

export interface AngleSpec {
  v: Pt;
  a: Pt;
  b: Pt;
  type: AngleType;
  deg: number;
  /** Within 12° of a right angle (but not right) — the "check it, don't eyeball it" case. */
  nearRight: boolean;
  cols: number;
  rows: number;
}

/** Arm-direction candidates for the second ray: every integer vector of a
 *  drawable length. */
const ARM2: Pt[] = (() => {
  const out: Pt[] = [];
  for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) {
    const L = Math.hypot(x, y);
    if (L >= 3.5 && L <= 6.5) out.push([x, y]);
  }
  return out;
})();

export type AngleBand = "acute" | "right" | "obtuse" | "nearRight";

/** Side length (grid units) of the paper-corner tester drawn on angles. */
export const TESTER = 3;

/** One angle on the grid. The first arm always runs along a grid line or a
 *  grid diagonal, so the student can check a right angle against the grid
 *  itself. "nearRight" gives an acute or obtuse angle within 5-12° of 90°. */
export function makeAngle(band: AngleBand): AngleSpec {
  const u: Pt = pick([
    [5, 0],
    [4, 4],
  ] as Pt[]);
  const ok = (w: Pt) => {
    const deg = angleDeg(u, w);
    const t = angleTypeOf(u, w);
    if (band === "right") return t === "right";
    if (band === "nearRight") return t !== "right" && Math.abs(deg - 90) >= 5 && Math.abs(deg - 90) <= 12;
    if (band === "acute") return t === "acute" && deg >= 25 && deg <= 70;
    return t === "obtuse" && deg >= 110 && deg <= 160;
  };
  // keep the second arm on the "upper" side (negative y) of the first arm
  const pool = ARM2.filter((w) => ok(w) && w[0] * u[1] - w[1] * u[0] > 0);
  const w = pick(pool);
  const k = randInt(0, 7);
  const uu = d4(u, k);
  const ww = d4(w, k);
  const pts: Pt[] = [[0, 0], uu, ww];
  // the corner tester (a 3-unit paper square along the first arm, on the
  // second arm's side) must fit on the canvas too
  const L = Math.hypot(uu[0], uu[1]);
  const e1: Pt = [(uu[0] / L) * TESTER, (uu[1] / L) * TESTER];
  let e2: Pt = [-e1[1], e1[0]];
  if (e2[0] * ww[0] + e2[1] * ww[1] < 0) e2 = [e1[1], -e1[0]];
  const box: Pt[] = [...pts, e1, e2, [e1[0] + e2[0], e1[1] + e2[1]]];
  const minX = Math.floor(Math.min(...box.map((p) => p[0])));
  const minY = Math.floor(Math.min(...box.map((p) => p[1])));
  const sh = (p: Pt): Pt => [p[0] - minX + 1, p[1] - minY + 1];
  const [v, a, b] = pts.map(sh);
  const deg = angleDeg(uu, ww);
  const type = angleTypeOf(uu, ww);
  return {
    v,
    a,
    b,
    type,
    deg,
    nearRight: type !== "right" && Math.abs(deg - 90) <= 12,
    cols: Math.ceil(Math.max(...box.map((p) => p[0]))) - minX + 2,
    rows: Math.ceil(Math.max(...box.map((p) => p[1]))) - minY + 2,
  };
}

// ---------------------------------------------------------------------------
// Angles inside a shape
// ---------------------------------------------------------------------------

export interface ShapeAngleSpec {
  pts: Pt[];
  letters: string[];
  types: AngleType[];
  degs: number[];
  /** The vertex that is the ONLY one of `target` type. */
  target: AngleType;
  targetIdx: number;
}

/** Every right angle's two sides must run along grid lines (checkable against
 *  the grid); every other angle must be at least 12° away from 90° (so "by
 *  eye, using the grid" is a fair way to sort it). */
function fairAngles(pts: Pt[]): boolean {
  const n = pts.length;
  const types = polygonAngleTypes(pts);
  const degs = polygonAngleDegs(pts);
  for (let i = 0; i < n; i++) {
    if (types[i] === "right") {
      const e1 = sub(pts[(i + n - 1) % n], pts[i]);
      const e2 = sub(pts[(i + 1) % n], pts[i]);
      const axis = (e: Pt) => e[0] === 0 || e[1] === 0;
      if (!axis(e1) || !axis(e2)) return false;
    } else if (Math.abs(degs[i] - 90) < 12) return false;
    if (degs[i] < 25) return false; // no needle-thin corners
  }
  return true;
}

/** A triangle or quadrilateral with EXACTLY one angle of type `target`.
 *  (A triangle always has at least two acute angles, so an "acute" target
 *  always uses a quadrilateral.) */
export function makeShapeWithOne(target: AngleType, sides?: 3 | 4): ShapeAngleSpec {
  const n: 3 | 4 = target === "acute" ? 4 : (sides ?? (Math.random() < 0.5 ? 3 : 4));
  for (;;) {
    const pts: Pt[] = Array.from({ length: n }, () => [randInt(0, 8), randInt(0, 6)] as Pt);
    // put the target-right-angle case in reach: snap one corner to an axis-aligned right angle sometimes
    if (target === "right" && Math.random() < 0.8) {
      const c: Pt = [randInt(0, 3), randInt(3, 6)];
      pts[0] = c;
      pts[1] = [c[0] + randInt(3, 8 - c[0]), c[1]];
      pts[n - 1] = [c[0], c[1] - randInt(2, c[1])];
    }
    if (!isConvex(pts)) continue;
    if (!fairAngles(pts)) continue;
    const types = polygonAngleTypes(pts);
    const idxs = types.map((t, i) => (t === target ? i : -1)).filter((i) => i >= 0);
    if (idxs.length !== 1) continue;
    // each side at least 2 units so the corners don't crowd their letters
    if (pts.some((p, i) => Math.hypot(p[0] - pts[(i + 1) % n][0], p[1] - pts[(i + 1) % n][1]) < 2.5)) continue;
    // random grid orientation + random starting letter (so "A" isn't always
    // the right-angle corner the snap above builds), then a 1-unit margin
    const k = randInt(0, 7);
    const t = pts.map((p) => d4(p, k));
    const minX = Math.min(...t.map((p) => p[0]));
    const minY = Math.min(...t.map((p) => p[1]));
    const shifted = shuffleStart(t.map((p) => [p[0] - minX + 1, p[1] - minY + 1] as Pt));
    const finalTypes = polygonAngleTypes(shifted);
    return {
      pts: shifted,
      letters: ["A", "B", "C", "D"].slice(0, n),
      types: finalTypes,
      degs: polygonAngleDegs(shifted),
      target,
      targetIdx: finalTypes.indexOf(target),
    };
  }
}

/** A quadrilateral with fair angles and exactly `wantRight` right angles
 *  (0, 1 or 2) — for "how many right angles does it have?" counts. The
 *  2-right-angle case is a right trapezoid built directly (random shapes
 *  almost never land on it), drawn in a random one of the 8 grid orientations. */
export function makeQuadWithRights(wantRight: 0 | 1 | 2): ShapeAngleSpec {
  if (wantRight === 2) {
    for (;;) {
      const h = randInt(3, 5);
      const top = randInt(2, 5);
      const bottom = top + pick([2, 3, 4]);
      const base: Pt[] = [
        [0, 0],
        [top, 0],
        [bottom, h],
        [0, h],
      ];
      const k = randInt(0, 7);
      const t = base.map((p) => d4(p, k));
      const minX = Math.min(...t.map((p) => p[0]));
      const minY = Math.min(...t.map((p) => p[1]));
      const pts = shuffleStart(t.map((p) => [p[0] - minX + 1, p[1] - minY + 1] as Pt));
      if (!isConvex(pts) || !fairAngles(pts)) continue;
      const types = polygonAngleTypes(pts);
      return { pts, letters: ["A", "B", "C", "D"], types, degs: polygonAngleDegs(pts), target: "right", targetIdx: types.indexOf("right") };
    }
  }
  for (;;) {
    const s = makeShapeWithOne(wantRight === 1 ? "right" : pick(["obtuse", "acute"] as AngleType[]), 4);
    if (s.types.filter((t) => t === "right").length === wantRight) return s;
  }
}

/** Same polygon, starting from a random vertex (so "A" isn't always the same corner). */
function shuffleStart(pts: Pt[]): Pt[] {
  const s = randInt(0, pts.length - 1);
  return pts.map((_, i) => pts[(i + s) % pts.length]);
}


