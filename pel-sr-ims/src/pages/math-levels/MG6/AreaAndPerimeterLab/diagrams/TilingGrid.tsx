import { palette } from "../../../shared/lib/palette";
import { boundaryEdges, cellsFromRect, type CellGrid } from "../lib/grid";

export interface TilingGridProps {
  rows: number;
  cols: number;
  /** Defaults to a full rows x cols rectangle — pass a shaped grid (see
   *  lib/grid.ts's cellsWithNotch/cellsFromRects) for an L-shape or other
   *  rectilinear outline. */
  cells?: CellGrid;
  cellPx?: number;
  /**
   * "full": every interior gridline shown (straightforward counting).
   * "edges-only": only ruler-tick marks along the top row and left column —
   * the rest of the interior is blank, so the student has to mentally
   * extend the rows/columns before counting (Unit 1's 2nd bucket). Only
   * meaningful for a plain rectangle (no notch).
   */
  mode?: "full" | "edges-only";
  /** Only draw rows below this index (row-by-row tiling animation for
   *  Explore) — omit to show every row at once. */
  revealRows?: number;
  /** Trace the shape's actual boundary edges in a highlighted stroke — the
   *  literal "count the border, not the inside" picture for the area-vs-
   *  perimeter contrast (Unit 1's CFU) and for Unit 5's rectangle cases. */
  showBorderTrace?: boolean;
  /** Draw the outline/grid with no unit-square fill at all — paired with
   *  showBorderTrace for a pure "this is what counting the border looks
   *  like" picture, with no interior squares competing for attention. */
  hideFill?: boolean;
  /** Numeric row/column-count labels on the two outer edges. */
  dimLabels?: boolean;
  caption?: string;
}

const edgeCoords = (e: { r: number; c: number; side: "top" | "bottom" | "left" | "right" }, cellPx: number) => {
  const x0 = e.c * cellPx;
  const y0 = e.r * cellPx;
  if (e.side === "top") return { x1: x0, y1: y0, x2: x0 + cellPx, y2: y0 };
  if (e.side === "bottom") return { x1: x0, y1: y0 + cellPx, x2: x0 + cellPx, y2: y0 + cellPx };
  if (e.side === "left") return { x1: x0, y1: y0, x2: x0, y2: y0 + cellPx };
  return { x1: x0 + cellPx, y1: y0, x2: x0 + cellPx, y2: y0 + cellPx };
};

/**
 * The unit-square tiling diagram for Units 1, 2, 4 and 5's rectangle cases.
 * Every rendered square comes straight from the `cells` matrix (lib/grid.ts)
 * that every generator also grades against via countArea/countPerimeter —
 * there is no separate "drawing" logic that could drift from the "checking"
 * logic.
 */
export function TilingGrid({ rows, cols, cells, cellPx = 28, mode = "full", revealRows, showBorderTrace, hideFill, dimLabels, caption }: TilingGridProps) {
  const grid = cells ?? cellsFromRect(rows, cols);
  const width = cols * cellPx;
  const height = rows * cellPx;
  const edges = showBorderTrace ? boundaryEdges(grid) : [];
  const padTop = dimLabels ? 22 : 8;
  const padLeft = dimLabels ? 24 : 8;
  const padBottom = caption ? 30 : 8;

  return (
    <svg
      viewBox={`${-padLeft} ${-padTop} ${width + padLeft + 10} ${height + padTop + padBottom}`}
      width={Math.min(width + padLeft + 10, 420)}
      style={{ maxWidth: "100%" }}
      role="img"
      aria-label={caption ?? `A grid, ${rows} rows by ${cols} columns`}
    >
      {grid.map((row, r) =>
        row.map((filled, c) => {
          if (!filled) return null;
          if (revealRows !== undefined && r >= revealRows) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * cellPx}
              y={r * cellPx}
              width={cellPx}
              height={cellPx}
              style={{
                fill: hideFill ? "none" : palette.aSoft,
                stroke: mode === "edges-only" ? "none" : palette.grid,
                strokeWidth: 1,
                transition: "opacity 0.25s ease-out",
              }}
            />
          );
        })
      )}
      {mode === "edges-only" && (
        <>
          <rect x={0} y={0} width={width} height={height} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
          {Array.from({ length: cols - 1 }, (_, i) => (
            <line key={`tt${i}`} x1={(i + 1) * cellPx} y1={0} x2={(i + 1) * cellPx} y2={10} style={{ stroke: palette.ink, strokeWidth: 1.5 }} />
          ))}
          {Array.from({ length: rows - 1 }, (_, i) => (
            <line key={`ll${i}`} x1={0} y1={(i + 1) * cellPx} x2={10} y2={(i + 1) * cellPx} style={{ stroke: palette.ink, strokeWidth: 1.5 }} />
          ))}
        </>
      )}
      {mode === "full" && <rect x={0} y={0} width={width} height={height} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />}
      {showBorderTrace &&
        edges.map((e, i) => {
          const { x1, y1, x2, y2 } = edgeCoords(e, cellPx);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: palette.c, strokeWidth: 4, strokeLinecap: "round" }} />;
        })}
      {dimLabels && (
        <>
          <text x={width / 2} y={-10} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13, fontWeight: 700 }}>
            {cols}
          </text>
          <text x={-12} y={height / 2} textAnchor="end" dominantBaseline="middle" style={{ fill: palette.muted, fontSize: 13, fontWeight: 700 }}>
            {rows}
          </text>
        </>
      )}
      {caption && (
        <text x={width / 2} y={height + 22} textAnchor="middle" style={{ fill: palette.ink, fontSize: 14, fontWeight: 700 }}>
          {caption}
        </text>
      )}
    </svg>
  );
}
