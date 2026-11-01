// ============================================================================
// Exact, integer-grid geometry for every unit in this lab — the ONE place
// that decides "is this angle right/acute/obtuse", "are these sides
// parallel/perpendicular", "which quadrilateral categories does this shape
// belong to", "what kind of triangle is this", and "is this line a line of
// symmetry". Every diagram, every generated Practice/Test answer, and every
// Explore readout calls these same functions, so the picture and the graded
// answer can never disagree (MATH_TSX_STYLE_GUIDE / math-lab-builder rule).
//
// Shapes live on an integer grid on purpose (same reasoning as MG7
// QuadrilateralsAndPartitioningLab's QuadBuilder): perpendicular <=> dot
// product exactly 0, parallel <=> cross product exactly 0, equal sides <=>
// equal squared lengths — all exact integer arithmetic, never a fuzzy float
// tolerance that could misjudge an 88-degree angle as "right".
// ============================================================================

export type Pt = [number, number];

export const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
export const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
export const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];
export const dot = (a: Pt, b: Pt): number => a[0] * b[0] + a[1] * b[1];
export const cross = (a: Pt, b: Pt): number => a[0] * b[1] - a[1] * b[0];
export const sqLen = (v: Pt): number => dot(v, v);
export const samePt = (a: Pt, b: Pt): boolean => a[0] === b[0] && a[1] === b[1];

// ---------------------------------------------------------------------------
// Angles
// ---------------------------------------------------------------------------

export type AngleType = "acute" | "right" | "obtuse";
export const ANGLE_TYPES: AngleType[] = ["acute", "right", "obtuse"];

/** Type of the angle at vertex `v` between rays v->a and v->b (exact). */
export function angleType(v: Pt, a: Pt, b: Pt): AngleType {
  const d = dot(sub(a, v), sub(b, v));
  return d > 0 ? "acute" : d === 0 ? "right" : "obtuse";
}

/** Same, from two direction vectors. */
export function angleTypeOf(u: Pt, w: Pt): AngleType {
  const d = dot(u, w);
  return d > 0 ? "acute" : d === 0 ? "right" : "obtuse";
}

/** Angle size in degrees (float — display/verification only, never grading). */
export function angleDeg(u: Pt, w: Pt): number {
  const c = dot(u, w) / Math.sqrt(sqLen(u) * sqLen(w));
  return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
}

/** Interior angle types of a CONVEX polygon, one per vertex. */
export function polygonAngleTypes(pts: Pt[]): AngleType[] {
  const n = pts.length;
  return pts.map((p, i) => angleType(p, pts[(i + n - 1) % n], pts[(i + 1) % n]));
}

/** Interior angle sizes (float, display/verification only). */
export function polygonAngleDegs(pts: Pt[]): number[] {
  const n = pts.length;
  return pts.map((p, i) => angleDeg(sub(pts[(i + n - 1) % n], p), sub(pts[(i + 1) % n], p)));
}

/** Strictly convex: every turn the same direction, no straight (180°) corners. */
export function isConvex(pts: Pt[]): boolean {
  const n = pts.length;
  let sign = 0;
  for (let i = 0; i < n; i++) {
    const c = cross(sub(pts[(i + 1) % n], pts[i]), sub(pts[(i + 2) % n], pts[(i + 1) % n]));
    if (c === 0) return false;
    const s = Math.sign(c);
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Lines (Unit 2): relationship between two lines given by direction vectors
// ---------------------------------------------------------------------------

export type LineRelation = "parallel" | "perpendicular" | "neither";

export function lineRelation(d1: Pt, d2: Pt): LineRelation {
  if (cross(d1, d2) === 0) return "parallel";
  if (dot(d1, d2) === 0) return "perpendicular";
  return "neither";
}

/** Do closed segments p1p2 and p3p4 share at least one point? (exact, integer) */
export function segmentsTouch(p1: Pt, p2: Pt, p3: Pt, p4: Pt): boolean {
  const o = (a: Pt, b: Pt, c: Pt) => Math.sign(cross(sub(b, a), sub(c, a)));
  const onSeg = (a: Pt, b: Pt, c: Pt) => Math.min(a[0], b[0]) <= c[0] && c[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= c[1] && c[1] <= Math.max(a[1], b[1]);
  const o1 = o(p1, p2, p3);
  const o2 = o(p1, p2, p4);
  const o3 = o(p3, p4, p1);
  const o4 = o(p3, p4, p2);
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSeg(p1, p2, p3)) return true;
  if (o2 === 0 && onSeg(p1, p2, p4)) return true;
  if (o3 === 0 && onSeg(p3, p4, p1)) return true;
  if (o4 === 0 && onSeg(p3, p4, p2)) return true;
  return false;
}

/** Where the infinite lines through (a1,b1) and (a2,b2) meet (float), or null if parallel. */
export function lineIntersection(a1: Pt, b1: Pt, a2: Pt, b2: Pt): Pt | null {
  const d1 = sub(b1, a1);
  const d2 = sub(b2, a2);
  const den = cross(d1, d2);
  if (den === 0) return null;
  const t = cross(sub(a2, a1), d2) / den;
  return [a1[0] + d1[0] * t, a1[1] + d1[1] * t];
}

// ---------------------------------------------------------------------------
// Polygon sides (Units 2 and 4)
// ---------------------------------------------------------------------------

/** Side i runs from pts[i] to pts[i+1]. */
export const sideVec = (pts: Pt[], i: number): Pt => sub(pts[(i + 1) % pts.length], pts[i]);

/** "AB", "BC", ... for side i, given vertex letters. */
export const sideName = (letters: string[], i: number): string => `${letters[i]}${letters[(i + 1) % letters.length]}`;

/** Indexes of the OTHER sides parallel / perpendicular to side i. */
export function sidesParallelTo(pts: Pt[], i: number): number[] {
  return pts.map((_, j) => j).filter((j) => j !== i && cross(sideVec(pts, i), sideVec(pts, j)) === 0);
}
export function sidesPerpendicularTo(pts: Pt[], i: number): number[] {
  return pts.map((_, j) => j).filter((j) => j !== i && dot(sideVec(pts, i), sideVec(pts, j)) === 0);
}

/** Number of pairs of parallel sides. */
export function parallelPairCount(pts: Pt[]): number {
  let n = 0;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (cross(sideVec(pts, i), sideVec(pts, j)) === 0) n++;
  return n;
}

export function rightAngleCount(pts: Pt[]): number {
  return polygonAngleTypes(pts).filter((t) => t === "right").length;
}

// ---------------------------------------------------------------------------
// Quadrilateral categories (Unit 4)
// ---------------------------------------------------------------------------

export type QuadCategory = "parallelogram" | "rectangle" | "rhombus" | "square" | "trapezoid";
export const QUAD_CATEGORIES: QuadCategory[] = ["parallelogram", "rectangle", "rhombus", "square", "trapezoid"];

/** Kid-facing definitions — every unit/test/CFU pulls wording from here so it
 *  never drifts. Trapezoid uses the "EXACTLY one pair" definition (see the
 *  lab's final report: the plan lists a square as rhombus/rectangle/
 *  parallelogram only, never trapezoid, which is the exclusive definition). */
export const QUAD_RULE: Record<QuadCategory, string> = {
  parallelogram: "2 pairs of parallel sides",
  rectangle: "4 right angles",
  rhombus: "4 sides that are all the same length",
  square: "4 right angles AND 4 equal sides",
  trapezoid: "exactly 1 pair of parallel sides",
};

export interface QuadInfo {
  convex: boolean;
  parallelPairs: number;
  rightAngles: number;
  sideSq: number[];
  allSidesEqual: boolean;
  /** How many sides share the most common length (1 = all different). */
  maxEqualSides: number;
}

export function quadInfo(pts: Pt[]): QuadInfo {
  const sideSq = pts.map((_, i) => sqLen(sideVec(pts, i)));
  const counts = sideSq.map((s) => sideSq.filter((t) => t === s).length);
  return {
    convex: isConvex(pts),
    parallelPairs: parallelPairCount(pts),
    rightAngles: rightAngleCount(pts),
    sideSq,
    allSidesEqual: sideSq.every((s) => s === sideSq[0]),
    maxEqualSides: Math.max(...counts),
  };
}

/** Every category this (convex) quadrilateral belongs to, general -> specific. */
export function quadCategories(pts: Pt[]): QuadCategory[] {
  const q = quadInfo(pts);
  if (!q.convex) return [];
  const cats: QuadCategory[] = [];
  if (q.parallelPairs === 2) cats.push("parallelogram");
  if (q.parallelPairs === 1) cats.push("trapezoid");
  if (q.rightAngles === 4) cats.push("rectangle");
  if (q.allSidesEqual) cats.push("rhombus");
  if (q.rightAngles === 4 && q.allSidesEqual) cats.push("square");
  return cats;
}

/** The most specific name, or "quadrilateral" if none of the five fit. */
export function quadBestName(pts: Pt[]): QuadCategory | "quadrilateral" {
  const c = quadCategories(pts);
  if (c.includes("square")) return "square";
  if (c.includes("rectangle")) return "rectangle";
  if (c.includes("rhombus")) return "rhombus";
  if (c.includes("parallelogram")) return "parallelogram";
  if (c.includes("trapezoid")) return "trapezoid";
  return "quadrilateral";
}

// ---------------------------------------------------------------------------
// Triangles (Unit 3) — classified from SQUARED side lengths so a right
// isosceles triangle (legs 5, hypotenuse √50) is still exact.
// ---------------------------------------------------------------------------

export type SideClass = "equilateral" | "isosceles" | "scalene";
export const SIDE_CLASSES: SideClass[] = ["equilateral", "isosceles", "scalene"];

export function sideClassSq(a2: number, b2: number, c2: number): SideClass {
  if (a2 === b2 && b2 === c2) return "equilateral";
  if (a2 === b2 || b2 === c2 || a2 === c2) return "isosceles";
  return "scalene";
}

export function angleClassSq(a2: number, b2: number, c2: number): AngleType {
  const [x, y, z] = [a2, b2, c2].sort((p, q) => p - q);
  return z === x + y ? "right" : z < x + y ? "acute" : "obtuse";
}

/** Largest angle in degrees, from (real) side lengths — verification/display only. */
export function largestAngleDeg(a: number, b: number, c: number): number {
  const [x, y, z] = [a, b, c].sort((p, q) => p - q);
  return (Math.acos((x * x + y * y - z * z) / (2 * x * y)) * 180) / Math.PI;
}

/** Float drawing coordinates for a triangle with side lengths a (BC), b (CA),
 *  c (AB): A=(0,0), B=(c,0), C above. Display only. */
export function triangleFromLengths(a: number, b: number, c: number): [Pt, Pt, Pt] {
  const x = (b * b + c * c - a * a) / (2 * c);
  const y = Math.sqrt(Math.max(0, b * b - x * x));
  return [
    [0, 0],
    [c, 0],
    [x, -y],
  ];
}

export const isValidTriangle = (a: number, b: number, c: number): boolean => a + b > c && a + c > b && b + c > a;

// ---------------------------------------------------------------------------
// Grid transforms — the 8 rotations/reflections of the square (D4) keep every
// integer point integer and every angle/parallel/length fact unchanged, so a
// generator can draw one base shape in 8 orientations for free.
// ---------------------------------------------------------------------------

export function d4(p: Pt, k: number): Pt {
  let [x, y] = p;
  for (let i = 0; i < k % 4; i++) [x, y] = [-y, x];
  if (k >= 4) x = -x;
  return [x, y];
}

/** Apply d4 to every point, then shift so the shape's top-left is at (margin, margin).
 *  Returns the shifted points plus the shape's width and height. */
export function orient(pts: Pt[], k: number, margin = 1): { pts: Pt[]; w: number; h: number } {
  const t = pts.map((p) => d4(p, k));
  const minX = Math.min(...t.map((p) => p[0]));
  const minY = Math.min(...t.map((p) => p[1]));
  const out = t.map((p) => [p[0] - minX + margin, p[1] - minY + margin] as Pt);
  return { pts: out, w: Math.max(...out.map((p) => p[0])) - margin, h: Math.max(...out.map((p) => p[1])) - margin };
}

/** Same polygon traced the other way round (keeps vertex 0 first). */
export const reversePoly = (pts: Pt[]): Pt[] => [pts[0], ...pts.slice(1).reverse()];

// ---------------------------------------------------------------------------
// Symmetry (Unit 5) — exact reflection across a line through two points.
//
// Everything here works in DOUBLED coordinates (each grid point times 2), so
// edge midpoints and the center of a bounding box are still integers. A
// reflection across the line through A with direction d sends P to
//   P' = 2(A + d·((P-A)·d)/(d·d)) − P
// which has denominator D = d·d; comparing D·P' against D·Q keeps every test
// an exact integer comparison.
// ---------------------------------------------------------------------------

export interface FoldLine {
  /** A point on the line, in DOUBLED grid coordinates. */
  a: Pt;
  /** Direction (integer, non-zero). */
  d: Pt;
}

const dbl = (p: Pt): Pt => [p[0] * 2, p[1] * 2];

/** D times the reflection of doubled point P. */
function reflectScaled(P: Pt, line: FoldLine): Pt {
  const D = sqLen(line.d);
  const t = dot(sub(P, line.a), line.d);
  return [2 * (D * line.a[0] + line.d[0] * t) - D * P[0], 2 * (D * line.a[1] + line.d[1] * t) - D * P[1]];
}

/** Does folding along `line` land the polygon exactly on itself? */
export function isSymmetryLine(pts: Pt[], line: FoldLine): boolean {
  const D = sqLen(line.d);
  const P = pts.map(dbl);
  const scaled = P.map((p) => mul(p, D));
  const refl = P.map((p) => reflectScaled(p, line));
  const n = P.length;
  // The reflected polygon traces the original in reverse order, starting
  // from some vertex — try every starting offset in both directions.
  for (let s = 0; s < n; s++) {
    let fwd = true;
    let back = true;
    for (let i = 0; i < n; i++) {
      if (!samePt(refl[i], scaled[(s + i) % n])) fwd = false;
      if (!samePt(refl[i], scaled[(s - i + n * 2) % n])) back = false;
      if (!fwd && !back) break;
    }
    if (fwd || back) return true;
  }
  return false;
}

/** Two fold lines are the same line? */
export function sameLine(l1: FoldLine, l2: FoldLine): boolean {
  return cross(l1.d, l2.d) === 0 && cross(sub(l2.a, l1.a), l1.d) === 0;
}

/** Every line of symmetry of a simple polygon. Complete: a symmetry line must
 *  cross the outline at two points the fold leaves fixed, and the only such
 *  points are vertices and edge midpoints — so it's enough to test every line
 *  through two of those. */
export function symmetryLines(pts: Pt[]): FoldLine[] {
  const n = pts.length;
  const keyPts: Pt[] = [...pts.map(dbl), ...pts.map((p, i) => add(p, pts[(i + 1) % n]))];
  const found: FoldLine[] = [];
  for (let i = 0; i < keyPts.length; i++) {
    for (let j = i + 1; j < keyPts.length; j++) {
      const d = sub(keyPts[j], keyPts[i]);
      if (d[0] === 0 && d[1] === 0) continue;
      const line: FoldLine = { a: keyPts[i], d };
      if (found.some((f) => sameLine(f, line))) continue;
      if (isSymmetryLine(pts, line)) found.push(line);
    }
  }
  return found;
}

/** Center of the bounding box, in doubled coordinates (always an integer point). */
export function bboxCenter2(pts: Pt[]): Pt {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [Math.min(...xs) + Math.max(...xs), Math.min(...ys) + Math.max(...ys)];
}

export type FoldDir = "updown" | "sideways" | "slantUp" | "slantDown";
export const FOLD_DIR_LABEL: Record<FoldDir, string> = {
  updown: "straight up and down",
  sideways: "straight across (side to side)",
  slantUp: "slanted like /",
  slantDown: "slanted like \\",
};

/** Kid-facing direction word for a fold line (screen y points down). */
export function foldDir(line: FoldLine): FoldDir {
  const [dx, dy] = line.d;
  if (dx === 0) return "updown";
  if (dy === 0) return "sideways";
  return dx * dy < 0 ? "slantUp" : "slantDown";
}

/** The "try these" fold lines through the middle of a shape: up-down and
 *  side-to-side midlines, the two corner-to-corner diagonals of its bounding
 *  box, plus every true symmetry line — deduped. The bounding-box diagonals
 *  are the classic near-miss (a non-square rectangle's diagonal LOOKS
 *  central but doesn't fold onto itself). */
export function candidateFolds(pts: Pt[]): FoldLine[] {
  const c = bboxCenter2(pts);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const w = Math.max(...xs) - Math.min(...xs);
  const h = Math.max(...ys) - Math.min(...ys);
  const raw: FoldLine[] = [
    { a: c, d: [0, 1] },
    { a: c, d: [1, 0] },
    { a: c, d: [w, h] },
    { a: c, d: [w, -h] },
    ...symmetryLines(pts),
  ];
  const out: FoldLine[] = [];
  for (const l of raw) if (!out.some((o) => sameLine(o, l))) out.push(l);
  return out;
}

/** Float endpoints of a fold line clipped to a box [x0,x1]×[y0,y1] (grid units). */
export function foldEndpoints(line: FoldLine, x0: number, y0: number, x1: number, y1: number): [Pt, Pt] {
  const a: Pt = [line.a[0] / 2, line.a[1] / 2];
  const len = Math.hypot(line.d[0], line.d[1]);
  const u: Pt = [line.d[0] / len, line.d[1] / len];
  const ts: number[] = [];
  if (u[0] !== 0) ts.push((x0 - a[0]) / u[0], (x1 - a[0]) / u[0]);
  if (u[1] !== 0) ts.push((y0 - a[1]) / u[1], (y1 - a[1]) / u[1]);
  const inside = (t: number) => {
    const x = a[0] + u[0] * t;
    const y = a[1] + u[1] * t;
    return x >= x0 - 1e-9 && x <= x1 + 1e-9 && y >= y0 - 1e-9 && y <= y1 + 1e-9;
  };
  const good = ts.filter(inside).sort((p, q) => p - q);
  const t0 = good[0] ?? -1;
  const t1 = good[good.length - 1] ?? 1;
  return [
    [a[0] + u[0] * t0, a[1] + u[1] * t0],
    [a[0] + u[0] * t1, a[1] + u[1] * t1],
  ];
}

/** Float helpers for the fold ANIMATION only (the yes/no answer always comes
 *  from isSymmetryLine above). */
export function signedSide(p: Pt, line: FoldLine): number {
  const a: Pt = [line.a[0] / 2, line.a[1] / 2];
  return cross(line.d, sub(p, a));
}

/** Sutherland–Hodgman: the part of the polygon on the side where signedSide >= 0 (sign = 1) or <= 0 (sign = -1). */
export function clipToSide(pts: Pt[], line: FoldLine, sign: 1 | -1): Pt[] {
  const out: Pt[] = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % n];
    const sp = signedSide(p, line) * sign;
    const sq = signedSide(q, line) * sign;
    if (sp >= 0) out.push(p);
    if ((sp > 0 && sq < 0) || (sp < 0 && sq > 0)) {
      const t = sp / (sp - sq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
}

/** Partially folded point: s = 1 (unfolded) ... -1 (fully reflected). */
export function foldPoint(p: Pt, line: FoldLine, s: number): Pt {
  const a: Pt = [line.a[0] / 2, line.a[1] / 2];
  const D = sqLen(line.d);
  const t = dot(sub(p, a), line.d) / D;
  const foot: Pt = [a[0] + line.d[0] * t, a[1] + line.d[1] * t];
  return [foot[0] + (p[0] - foot[0]) * s, foot[1] + (p[1] - foot[1]) * s];
}

/** Vertex letters, A B C ... */
export const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M"];
