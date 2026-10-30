import { useRef, useState } from "react";
import type React from "react";
import { palette, itemColors } from "../../../shared/lib/palette";

// ============================================================================
// Unit 3 (Partitioning Shapes into Equal-Area Parts and Naming Unit
// Fractions) diagrams. Checked shared/diagrams/ and MG4/ShapesAndFractions
// IntroLab's own ShapePartition.tsx first, per this build's guardrails:
// ShapePartition only ever cuts a circle/square into 2 or 4 CONGRUENT wedge/
// strip pieces (halves/fourths), which can't show "equal AREA but different
// SHAPE" (this lab's Unit 3 bucket 2) or an arbitrary unit fraction 1/b for
// b outside {2,4}, so this is a new, lab-local sibling, not a duplicate.
//
// GridPartition represents a whole as an exact rows x cols grid of equal
// unit squares, and every "part" as a SET of cells. Area is then just cell
// COUNT — two parts with the same cell count are equal area by construction,
// no matter how differently shaped (the direct, countable mechanism behind
// the "equal area doesn't require equal/congruent shape" idea), and the
// generators below are the SAME source of truth the render path draws from,
// so a picture and the question asked about it can never disagree.
// ============================================================================

export interface GridPartitionProps {
  rows: number;
  cols: number;
  /** Region id per cell, row-major (row*cols+col). -1 = unshaded. */
  cellRegion: number[];
  width?: number;
  height?: number;
  label?: string;
}

const REGION_FILLS = [palette.aSoft, palette.bSoft, itemColors.green.soft, palette.cSoft, itemColors.yellow.soft, itemColors.red.soft];

export function GridPartition({ rows, cols, cellRegion, width = 180, height, label }: GridPartitionProps) {
  const cell = width / cols;
  const h = height ?? cell * rows;
  const at = (r: number, c: number) => cellRegion[r * cols + c];

  return (
    <svg viewBox={`0 0 ${width} ${h}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={label ?? `A shape split into a ${rows} by ${cols} grid of parts`}>
      {/* Colored cells first, faint grid lines on top everywhere (the "count
          the unit squares" method 3.G.2 teaches is meant to stay visible,
          even inside a colored region) — then bold strokes around each
          region's own outer boundary, drawn last so they read as the "real"
          cut lines. */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const region = at(r, c);
          if (region < 0) return null;
          return <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={REGION_FILLS[region % REGION_FILLS.length]} />;
        })
      )}
      {Array.from({ length: rows + 1 }, (_, r) => <line key={`h${r}`} x1={0} y1={r * cell} x2={width} y2={r * cell} stroke={palette.grid} strokeWidth={1} />)}
      {Array.from({ length: cols + 1 }, (_, c) => <line key={`v${c}`} x1={c * cell} y1={0} x2={c * cell} y2={h} stroke={palette.grid} strokeWidth={1} />)}
      {/* Bold boundary: for every cell edge where the neighboring region
          differs (or it's the outer edge of a shaded cell), draw a thick line. */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const region = at(r, c);
          const lines: React.ReactNode[] = [];
          const right = c + 1 < cols ? at(r, c + 1) : -2;
          const down = r + 1 < rows ? at(r + 1, c) : -2;
          if (region >= 0 && right !== region) lines.push(<line key={`br${r}-${c}`} x1={(c + 1) * cell} y1={r * cell} x2={(c + 1) * cell} y2={(r + 1) * cell} stroke={palette.ink} strokeWidth={2.5} />);
          if (region >= 0 && down !== region) lines.push(<line key={`bd${r}-${c}`} x1={c * cell} y1={(r + 1) * cell} x2={(c + 1) * cell} y2={(r + 1) * cell} stroke={palette.ink} strokeWidth={2.5} />);
          if (region >= 0 && c === 0) lines.push(<line key={`bl${r}-${c}`} x1={0} y1={r * cell} x2={0} y2={(r + 1) * cell} stroke={palette.ink} strokeWidth={2.5} />);
          if (region >= 0 && r === 0) lines.push(<line key={`bt${r}-${c}`} x1={c * cell} y1={0} x2={(c + 1) * cell} y2={0} stroke={palette.ink} strokeWidth={2.5} />);
          return lines;
        })
      )}
      <rect x={0} y={0} width={width} height={h} fill="none" stroke={palette.ink} strokeWidth={2.5} />
    </svg>
  );
}

/** b equal contiguous strips (vertical or horizontal) covering the WHOLE
 *  grid — the "obvious grid/symmetry line" bucket. rows/cols are chosen by
 *  the caller so every strip is exactly `rows*cols/b` cells. */
export function stripRegions(rows: number, cols: number, b: number, orientation: "v" | "h"): number[] {
  const cellRegion = new Array(rows * cols).fill(0);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const region = orientation === "v" ? Math.floor((c * b) / cols) : Math.floor((r * b) / rows);
      cellRegion[r * cols + c] = region;
    }
  }
  return cellRegion;
}

/** Only ONE of the b strips shaded (region 0), the rest left unshaded (-1) —
 *  the "reverse direction" bucket: the whole grid's cells are still all
 *  visible via the faint grid lines, so the total can be counted, but the
 *  other b-1 strips are never grouped/outlined, so "how many equal parts"
 *  has to be computed (total cells / shaded cells), not read off directly. */
export function oneStripShaded(rows: number, cols: number, b: number, orientation: "v" | "h"): number[] {
  const all = stripRegions(rows, cols, b, orientation);
  return all.map((region) => (region === 0 ? 0 : -1));
}

/** A hand-authored pair of equal-cell-count regions covering the WHOLE grid,
 *  shaped differently enough that they read as genuinely different shapes
 *  (not a mirror/rotation of each other) — used for the "equal area, NOT
 *  congruent shape" bucket. `regionA` lists every cell belonging to region 0;
 *  every other cell is automatically region 1 (so the two counts are equal
 *  by construction whenever `regionA` is exactly half the grid). `removable`
 *  is one region-0 cell on region A's own boundary that can be handed to
 *  region 1 to produce a genuinely UNEQUAL (but still similar-looking) variant
 *  for the "judge the partition" bucket's deceptive-unequal case. */
export interface NonCongruentTemplate {
  rows: number;
  cols: number;
  regionA: [number, number][]; // [row, col]
  removable: [number, number];
}

export const NONCONGRUENT_TEMPLATES: NonCongruentTemplate[] = [
  {
    rows: 4,
    cols: 4,
    regionA: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 0],
      [1, 1],
      [2, 0],
      [3, 0],
    ],
    removable: [3, 0],
  },
  {
    rows: 2,
    cols: 6,
    regionA: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 4],
      [1, 5],
    ],
    removable: [1, 5],
  },
  {
    rows: 4,
    cols: 3,
    regionA: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 0],
      [3, 0],
    ],
    removable: [3, 0],
  },
];

/** Builds a `cellRegion` array from a template: every listed cell is region
 *  0, every other cell is region 1 (the complement — automatically equal
 *  count to region 0 whenever `regionA` lists exactly half the grid, which
 *  every hand-authored template above does). */
export function templateToCellRegion(t: NonCongruentTemplate): number[] {
  const cellRegion = new Array(t.rows * t.cols).fill(1);
  for (const [r, c] of t.regionA) cellRegion[r * t.cols + c] = 0;
  return cellRegion;
}

/** Same as templateToCellRegion, but moves `removable` from region 0 into
 *  region 1 first — producing two regions that differ by exactly 2 cells
 *  (one lost, one gained) out of the whole grid, a small enough gap to look
 *  deceptively close without actually being equal. */
export function templateToSkewedCellRegion(t: NonCongruentTemplate): number[] {
  const cellRegion = templateToCellRegion(t);
  const [r, c] = t.removable;
  cellRegion[r * t.cols + c] = 1;
  return cellRegion;
}

/** Region cell counts, in region-id order (0, 1, 2, ...). */
export function regionCounts(cellRegion: number[]): number[] {
  const counts: number[] = [];
  for (const region of cellRegion) {
    if (region < 0) continue;
    counts[region] = (counts[region] ?? 0) + 1;
  }
  return counts;
}

/** Rotates a rows x cols cellRegion grid 90 degrees clockwise (and swaps
 *  rows/cols accordingly) — cheap visual variety for the hand-authored
 *  non-congruent templates without needing more of them. */
export function rotateGrid90(rows: number, cols: number, cellRegion: number[]): { rows: number; cols: number; cellRegion: number[] } {
  const next = new Array(rows * cols).fill(-1);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // (r, c) in the old rows x cols grid lands at (c, rows-1-r) in the new cols x rows grid.
      next[c * rows + (rows - 1 - r)] = cellRegion[r * cols + c];
    }
  }
  return { rows: cols, cols: rows, cellRegion: next };
}

// ============================================================================
// CutLineRect — Explore's continuous drag-the-cut-lines sandbox (free play
// only; Practice/Test use the exact grid-based tool above for gradability).
// Same pointer-capture drag technique as MK3/MeasurementAndClassifyingLab's
// LengthBars.tsx (checked first, reused rather than reinvented), generalized
// to an interior divider instead of an end handle.
// ============================================================================

const RECT_W = 280;
const RECT_H = 100;

export function CutLineRect({ b }: { b: number }) {
  const [cuts, setCuts] = useState<number[]>(() => Array.from({ length: b - 1 }, (_, i) => ((i + 1) / b) * RECT_W));
  const svgRef = useRef<SVGSVGElement>(null);
  const dragIndex = useRef<number | null>(null);

  const bounds = [0, ...cuts, RECT_W];
  const widths = bounds.slice(1).map((x, i) => x - bounds[i]);
  const totalPct = widths.map((w) => (w / RECT_W) * 100);
  const evenPct = 100 / b;
  const allClose = totalPct.every((p) => Math.abs(p - evenPct) < 3);

  const clamp = (i: number, x: number) => {
    const lo = i === 0 ? 4 : cuts[i - 1] + 4;
    const hi = i === cuts.length - 1 ? RECT_W - 4 : cuts[i + 1] - 4;
    return Math.min(hi, Math.max(lo, x));
  };

  const startDrag = (i: number) => (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragIndex.current = i;
  };
  const onMove = (e: React.PointerEvent) => {
    const i = dragIndex.current;
    if (i === null) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = RECT_W / rect.width;
    const localX = (e.clientX - rect.left) * scale;
    setCuts((prev) => {
      const next = [...prev];
      next[i] = clamp(i, localX);
      return next;
    });
  };
  const endDrag = () => {
    dragIndex.current = null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${RECT_W} ${RECT_H}`}
        width={RECT_W}
        style={{ maxWidth: "100%", touchAction: "none" }}
        role="img"
        aria-label={`A rectangle with ${b - 1} draggable cut lines, making ${b} pieces`}
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {Array.from({ length: b }, (_, i) => (
          <rect key={i} x={bounds[i]} y={0} width={bounds[i + 1] - bounds[i]} height={RECT_H} fill={REGION_FILLS[i % REGION_FILLS.length]} stroke={palette.ink} strokeWidth={1} />
        ))}
        <rect x={0} y={0} width={RECT_W} height={RECT_H} fill="none" stroke={palette.ink} strokeWidth={2.5} />
        {cuts.map((x, i) => (
          <g key={i}>
            <line x1={x} y1={0} x2={x} y2={RECT_H} stroke={palette.ink} strokeWidth={3} />
            <circle cx={x} cy={RECT_H / 2} r={11} fill={palette.paper} stroke={palette.a} strokeWidth={3} style={{ cursor: "ew-resize", touchAction: "none" }} onPointerDown={startDrag(i)} />
          </g>
        ))}
      </svg>
      <p className="muted small">
        {widths.map((_, i) => `Piece ${i + 1}: ${totalPct[i].toFixed(0)}%`).join(" · ")}
        {allClose ? ` — all about equal! Each piece is 1/${b} of the whole.` : " — drag the cut lines until every piece looks the same size."}
      </p>
    </div>
  );
}
