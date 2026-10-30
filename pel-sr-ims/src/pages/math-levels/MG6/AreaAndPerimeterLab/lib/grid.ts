// Grid math shared between TilingGrid.tsx's RENDERING and every Unit 1/2/4/5
// generator's GRADING. A shape is always a `CellGrid` (a rows x cols matrix
// of which unit squares are filled in) — area and perimeter are both derived
// from that SAME matrix via countArea/countPerimeter below, so the picture a
// student sees and the number they're graded against can never disagree
// (the exact failure mode MATH_TSX_STYLE_GUIDE.txt warns about for any
// algorithm-intermediate-state diagram).

export type CellGrid = boolean[][]; // CellGrid[row][col]

/** A full rows x cols rectangle, every cell filled. */
export function cellsFromRect(rows: number, cols: number): CellGrid {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => true));
}

/** A rows x cols rectangle with one rectangular notch cut out — the building
 *  block for every L-shape / rectilinear figure in Units 1 and 4. The notch
 *  is given as a half-open cell range [r0,r1) x [c0,c1). */
export function cellsWithNotch(rows: number, cols: number, notch: { r0: number; r1: number; c0: number; c1: number }): CellGrid {
  const cells = cellsFromRect(rows, cols);
  for (let r = notch.r0; r < notch.r1; r++) {
    for (let c = notch.c0; c < notch.c1; c++) {
      if (cells[r]) cells[r][c] = false;
    }
  }
  return cells;
}

/** Union of several rows x cols rectangles (each {r0,c0,w,h}) inside one
 *  overall bounding grid — used for figures made of 3+ joined rectangles
 *  (a "staircase" or "plus" shape) that a single notch can't express. */
export function cellsFromRects(rows: number, cols: number, rects: { r0: number; c0: number; w: number; h: number }[]): CellGrid {
  const cells: CellGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
  for (const { r0, c0, w, h } of rects) {
    for (let r = r0; r < r0 + h; r++) {
      for (let c = c0; c < c0 + w; c++) {
        if (cells[r]) cells[r][c] = true;
      }
    }
  }
  return cells;
}

/** Area = count of filled unit squares. */
export function countArea(cells: CellGrid): number {
  return cells.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
}

/** Perimeter = count of unit-square edges that border "outside" the shape
 *  (either the grid edge or a non-filled neighbor cell) — works for any
 *  rectilinear shape, not just a plain rectangle. */
export function countPerimeter(cells: CellGrid): number {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  let perim = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!cells[r][c]) continue;
      if (r === 0 || !cells[r - 1][c]) perim++;
      if (r === rows - 1 || !cells[r + 1][c]) perim++;
      if (c === 0 || !cells[r][c - 1]) perim++;
      if (c === cols - 1 || !cells[r][c + 1]) perim++;
    }
  }
  return perim;
}

export type EdgeSide = "top" | "bottom" | "left" | "right";
export interface BoundaryEdge {
  r: number;
  c: number;
  side: EdgeSide;
}

/** Every boundary edge of the shape, in cell-local coordinates — TilingGrid's
 *  `showBorderTrace` draws exactly these segments (the same edges
 *  countPerimeter counts), so the drawn trace and the graded perimeter are
 *  always the same set of edges, never independently computed. */
export function boundaryEdges(cells: CellGrid): BoundaryEdge[] {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  const edges: BoundaryEdge[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!cells[r][c]) continue;
      if (r === 0 || !cells[r - 1][c]) edges.push({ r, c, side: "top" });
      if (r === rows - 1 || !cells[r + 1][c]) edges.push({ r, c, side: "bottom" });
      if (c === 0 || !cells[r][c - 1]) edges.push({ r, c, side: "left" });
      if (c === cols - 1 || !cells[r][c + 1]) edges.push({ r, c, side: "right" });
    }
  }
  return edges;
}

/** One rectangular piece used by Unit 3/4's split-rectangle diagrams (area
 *  model for the distributive property and for composite/rectilinear areas).
 *  `x`/`y`/`w`/`h` are in grid-square units (not pixels) so the SAME numbers
 *  drive both the rendered geometry and the area arithmetic. */
export interface AreaPiece {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  tone?: "a" | "b" | "c";
}

export const pieceArea = (p: Pick<AreaPiece, "w" | "h">): number => p.w * p.h;
export const totalArea = (pieces: Pick<AreaPiece, "w" | "h">[]): number => pieces.reduce((sum, p) => sum + pieceArea(p), 0);

export type LEdge = "bottom" | "left" | "topLeft" | "notchDepth" | "notchWidth" | "right";

export interface LShape {
  W: number;
  H: number;
  nw: number;
  nh: number;
  /** Decomposition into two rectangles: a full-height left piece and a
   *  shorter right piece under the notch. */
  pieces: [AreaPiece, AreaPiece];
  /** The cut-out top-right corner, for the subtraction approach. */
  notch: AreaPiece;
  area: number;
  /** Every outer edge's true length — the one table both the edge labels
   *  drawn on the figure AND the graded answers read from. */
  edges: Record<LEdge, number>;
}

/** A W x H rectangle with an nw x nh notch cut from its top-right corner —
 *  Unit 4's L-shape, shared by Explore, practice and test so the drawn
 *  edges, the decomposition and the graded area all come from one place. */
export function makeLShape(W: number, H: number, nw: number, nh: number): LShape {
  const pieces: [AreaPiece, AreaPiece] = [
    { x: 0, y: 0, w: W - nw, h: H, tone: "a" },
    { x: W - nw, y: nh, w: nw, h: H - nh, tone: "b" },
  ];
  return {
    W,
    H,
    nw,
    nh,
    pieces,
    notch: { x: W - nw, y: 0, w: nw, h: nh },
    area: W * H - nw * nh,
    edges: { bottom: W, left: H, topLeft: W - nw, notchDepth: nh, notchWidth: nw, right: H - nh },
  };
}

/** Edge-label positions (grid units) for an L-shape, omitting any edges in
 *  `hide` — a hidden edge is how the missing-dimension bucket forces the
 *  student to derive a length by subtraction instead of reading it off. */
export function lShapeNotes(s: LShape, hide: LEdge[] = []): { x: number; y: number; text: string }[] {
  const all: Record<LEdge, { x: number; y: number }> = {
    bottom: { x: s.W / 2, y: s.H + 0.6 },
    left: { x: -0.7, y: s.H / 2 },
    topLeft: { x: (s.W - s.nw) / 2, y: -0.5 },
    // Both notch-edge labels sit inside the (empty) notch itself; callers
    // keep nw, nh >= 2 so the two never overlap.
    notchDepth: { x: s.W - s.nw + 0.45, y: s.nh * 0.4 },
    notchWidth: { x: s.W - s.nw / 2, y: s.nh - 0.45 },
    right: { x: s.W + 0.7, y: s.nh + (s.H - s.nh) / 2 },
  };
  return (Object.keys(all) as LEdge[]).filter((k) => !hide.includes(k)).map((k) => ({ ...all[k], text: String(s.edges[k]) }));
}

/** Split a rows x cols rectangle into two pieces with one vertical cut at
 *  column `splitAt` (1 <= splitAt <= cols-1) — the single source of truth
 *  for Unit 3's distributive-property split, used by both the draggable
 *  Explore diagram and every split-rectangle practice/test generator. */
export function splitRectangleAt(rows: number, cols: number, splitAt: number): [AreaPiece, AreaPiece] {
  return [
    { x: 0, y: 0, w: splitAt, h: rows, tone: "a" },
    { x: splitAt, y: 0, w: cols - splitAt, h: rows, tone: "b" },
  ];
}
