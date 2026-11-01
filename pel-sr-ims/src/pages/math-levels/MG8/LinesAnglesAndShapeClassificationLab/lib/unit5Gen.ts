import { pick, randInt } from "../../../shared/lib/math";
import { candidateFolds, isSymmetryLine, orient, symmetryLines, type FoldLine, type Pt } from "./geometry";

// ============================================================================
// Unit 5 (Lines of Symmetry) shape pool + generators, shared by Practice,
// Test and Explore. The number of lines of symmetry is NEVER hand-entered:
// it's always computed by symmetryLines() (exact, doubled-coordinate
// reflection test over every candidate line), and each pool entry's expected
// group is asserted against that count at generation time.
// ============================================================================

export type SymGroup = "one" | "many" | "none";

export interface SymBase {
  name: string;
  group: SymGroup;
  pts: Pt[];
  /** Pool for the near-miss bucket: has at least one central line that ISN'T a symmetry line. */
  nearMissOk: boolean;
}

export const SYM_POOL: SymBase[] = [
  { name: "isosceles triangle", group: "one", nearMissOk: true, pts: [[0, 4], [3, 0], [6, 4]] },
  { name: "kite", group: "one", nearMissOk: true, pts: [[3, 0], [5, 2], [3, 7], [1, 2]] },
  { name: "trapezoid", group: "one", nearMissOk: true, pts: [[2, 0], [5, 0], [7, 4], [0, 4]] },
  { name: "house shape", group: "one", nearMissOk: true, pts: [[0, 3], [3, 0], [6, 3], [6, 7], [0, 7]] },
  { name: "arrow", group: "one", nearMissOk: true, pts: [[0, 2], [4, 2], [4, 0], [7, 3], [4, 6], [4, 4], [0, 4]] },
  { name: "T shape", group: "one", nearMissOk: true, pts: [[0, 0], [6, 0], [6, 2], [4, 2], [4, 6], [2, 6], [2, 2], [0, 2]] },
  { name: "L shape", group: "one", nearMissOk: true, pts: [[0, 0], [2, 0], [2, 4], [6, 4], [6, 6], [0, 6]] },
  { name: "rectangle", group: "many", nearMissOk: true, pts: [[0, 0], [6, 0], [6, 3], [0, 3]] },
  { name: "rectangle", group: "many", nearMissOk: true, pts: [[0, 0], [7, 0], [7, 4], [0, 4]] },
  { name: "rhombus", group: "many", nearMissOk: true, pts: [[3, 0], [5, 4], [3, 8], [1, 4]] },
  { name: "H shape", group: "many", nearMissOk: true, pts: [[0, 0], [2, 0], [2, 2], [4, 2], [4, 0], [6, 0], [6, 6], [4, 6], [4, 4], [2, 4], [2, 6], [0, 6]] },
  { name: "square", group: "many", nearMissOk: false, pts: [[0, 0], [5, 0], [5, 5], [0, 5]] },
  { name: "square", group: "many", nearMissOk: false, pts: [[3, 0], [6, 3], [3, 6], [0, 3]] },
  { name: "plus sign", group: "many", nearMissOk: false, pts: [[2, 0], [4, 0], [4, 2], [6, 2], [6, 4], [4, 4], [4, 6], [2, 6], [2, 4], [0, 4], [0, 2], [2, 2]] },
  { name: "scalene triangle", group: "none", nearMissOk: false, pts: [[0, 0], [6, 0], [1, 4]] },
  { name: "parallelogram", group: "none", nearMissOk: false, pts: [[0, 0], [5, 0], [7, 3], [2, 3]] },
  { name: "trapezoid", group: "none", nearMissOk: false, pts: [[0, 0], [3, 0], [5, 4], [0, 4]] },
  { name: "quadrilateral", group: "none", nearMissOk: false, pts: [[0, 0], [5, 1], [6, 4], [1, 5]] },
  { name: "L shape", group: "none", nearMissOk: false, pts: [[0, 0], [2, 0], [2, 3], [6, 3], [6, 5], [0, 5]] },
];

export interface SymSpec {
  name: string;
  group: SymGroup;
  pts: Pt[];
  lines: FoldLine[];
  cols: number;
  rows: number;
}

/** A pool shape in a random one of the 8 grid orientations (never changes its symmetry count). */
export function makeSymShape(group: SymGroup, opts: { nearMiss?: boolean } = {}): SymSpec {
  // (a shape with NO lines of symmetry: every central line is already a near-miss)
  const pool = SYM_POOL.filter((s) => s.group === group && (!opts.nearMiss || s.nearMissOk || s.group === "none"));
  const b = pick(pool);
  const { pts, w, h } = orient(b.pts, randInt(0, 7), 1);
  const lines = symmetryLines(pts);
  const n = lines.length;
  if ((group === "one" && n !== 1) || (group === "many" && n < 2) || (group === "none" && n !== 0)) {
    throw new Error(`SYM_POOL entry "${b.name}" has ${n} lines, expected group ${group}`);
  }
  return { name: b.name, group, pts, lines, cols: w + 2, rows: h + 2 };
}

/** A line through the middle of the shape that is NOT a line of symmetry
 *  (prefers a corner-to-corner diagonal of the bounding box — the classic
 *  "looks central, doesn't fold" rectangle diagonal). */
export function nearMissLine(s: SymSpec): FoldLine {
  const bad = candidateFolds(s.pts).filter((l) => !isSymmetryLine(s.pts, l));
  if (bad.length === 0) throw new Error(`no near-miss line for ${s.name}`);
  const diag = bad.filter((l) => l.d[0] !== 0 && l.d[1] !== 0);
  return pick(diag.length > 0 && Math.random() < 0.7 ? diag : bad);
}
