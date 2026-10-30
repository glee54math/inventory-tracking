import { useEffect, useRef, useState } from "react";
import { palette } from "../../../shared/lib/palette";
import { pieceArea, type AreaPiece } from "../lib/grid";

export interface RectanglePiecesProps {
  pieces: AreaPiece[];
  cellPx?: number;
  /** A dashed "ghost" bounding rectangle drawn behind the pieces — the
   *  subtraction approach's large rectangle, shown whole before `notch` is
   *  cut away from it. */
  bounding?: { w: number; h: number };
  /** A piece drawn hatched/dashed instead of filled — the "missing" region
   *  being subtracted from `bounding`, not part of the actual figure. */
  notch?: AreaPiece;
  /** Draws interior unit-square gridlines inside each piece, tying the
   *  schematic rectangle back to Unit 1/2's literal tiling — skipped once a
   *  piece's side exceeds this many squares, same convention as
   *  shared/diagrams/FactorRectangle.tsx's MAX_GRIDLINES. */
  showGrid?: boolean;
  /**
   * Makes the shared edge between pieces[0] and pieces[1] a drag handle —
   * only meaningful for exactly two pieces that already share a full edge
   * (Unit 3's Explore split). Dragging moves `value` between `min` and
   * `max` (inclusive), both in grid-square units.
   */
  drag?: { value: number; min: number; max: number; onChange: (v: number) => void };
  /**
   * Free-floating side-length labels, positioned in grid-square units (the
   * same coordinate system as `pieces`) — used for Unit 4's outer-edge
   * dimensions, including deliberately leaving one edge unlabeled for the
   * missing-dimension bucket. Extra padding is added on every side when set,
   * so a label just outside the figure (e.g. x = -0.6) isn't clipped.
   */
  notes?: { x: number; y: number; text: string; tone?: "ink" | "c" }[];
  caption?: string;
}

const MAX_GRIDLINES = 10;

function Grid({ p, cellPx }: { p: AreaPiece; cellPx: number }) {
  if (p.w > MAX_GRIDLINES || p.h > MAX_GRIDLINES) return null;
  const lines = [];
  for (let i = 1; i < p.w; i++) lines.push(<line key={`v${i}`} x1={p.x * cellPx + i * cellPx} y1={p.y * cellPx} x2={p.x * cellPx + i * cellPx} y2={(p.y + p.h) * cellPx} style={{ stroke: palette.grid, strokeWidth: 1 }} />);
  for (let i = 1; i < p.h; i++) lines.push(<line key={`h${i}`} x1={p.x * cellPx} y1={p.y * cellPx + i * cellPx} x2={(p.x + p.w) * cellPx} y2={p.y * cellPx + i * cellPx} style={{ stroke: palette.grid, strokeWidth: 1 }} />);
  return <>{lines}</>;
}

const toneFill: Record<"a" | "b" | "c", string> = { a: palette.aSoft, b: palette.bSoft, c: palette.cSoft };

/**
 * A schematic (proportional, not literally-unit-square) rectangle made of
 * one or more axis-aligned pieces, in grid-square units — the area model
 * for Unit 3's distributive-property split and Unit 4's composite/
 * rectilinear figures (decomposition AND the subtract-from-bounding-box
 * approach). Every piece's drawn width/height IS the same w/h its area
 * (pieceArea) is computed from — see lib/grid.ts.
 */
export function RectanglePieces({ pieces, cellPx = 30, bounding, notch, showGrid, drag, notes, caption }: RectanglePiecesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const allExtentsW = Math.max(bounding?.w ?? 0, ...pieces.map((p) => p.x + p.w), notch ? notch.x + notch.w : 0);
  const allExtentsH = Math.max(bounding?.h ?? 0, ...pieces.map((p) => p.y + p.h), notch ? notch.y + notch.h : 0);
  const width = allExtentsW * cellPx;
  const height = allExtentsH * cellPx;
  const notePad = notes && notes.length > 0 ? 30 : 0;
  const padBottom = (caption ? 30 : 22) + notePad / 2;
  const padTop = drag ? 28 : 6 + notePad / 2;
  const viewMinX = -6 - notePad;
  const viewBoxWidth = width + 12 + notePad * 2;

  useEffect(() => {
    if (!dragging || !drag) return;
    const onMove = (e: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scale = viewBoxWidth / rect.width;
      const localX = (e.clientX - rect.left) * scale + viewMinX;
      const col = Math.round(localX / cellPx);
      drag.onChange(Math.min(drag.max, Math.max(drag.min, col)));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, drag, cellPx, viewBoxWidth, viewMinX]);

  const dragHandleX = drag ? drag.value * cellPx : 0;
  const sharedHeight = pieces.length === 2 ? Math.max(pieces[0].h, pieces[1].h) * cellPx : 0;

  return (
    <svg
      ref={svgRef}
      viewBox={`${viewMinX} ${-padTop} ${viewBoxWidth} ${height + padBottom + padTop}`}
      width={Math.min(viewBoxWidth, 440)}
      style={{ maxWidth: "100%", touchAction: drag ? "none" : undefined }}
      role="img"
      aria-label={caption ?? "A rectangle split into labeled pieces"}
    >
      {bounding && (
        <rect x={0} y={0} width={bounding.w * cellPx} height={bounding.h * cellPx} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2, strokeDasharray: "6 4" }} />
      )}
      {notch && (
        <>
          <rect x={notch.x * cellPx} y={notch.y * cellPx} width={notch.w * cellPx} height={notch.h * cellPx} style={{ fill: palette.grid, stroke: palette.muted, strokeWidth: 2, strokeDasharray: "4 3" }} />
          <text x={notch.x * cellPx + (notch.w * cellPx) / 2} y={notch.y * cellPx + (notch.h * cellPx) / 2} textAnchor="middle" dominantBaseline="middle" style={{ fill: palette.muted, fontSize: 12, fontWeight: 700 }}>
            remove
            <tspan x={notch.x * cellPx + (notch.w * cellPx) / 2} dy="14">
              {notch.w} × {notch.h}
            </tspan>
          </text>
        </>
      )}
      {pieces.map((p, i) => (
        <g key={i}>
          <rect x={p.x * cellPx} y={p.y * cellPx} width={p.w * cellPx} height={p.h * cellPx} style={{ fill: toneFill[p.tone ?? "a"], stroke: palette.ink, strokeWidth: 2 }} />
          {showGrid && <Grid p={p} cellPx={cellPx} />}
          <text x={p.x * cellPx + (p.w * cellPx) / 2} y={p.y * cellPx + (p.h * cellPx) / 2} textAnchor="middle" dominantBaseline="middle" style={{ fill: palette.ink, fontSize: 14, fontWeight: 700 }}>
            {p.label ?? `${p.h} × ${p.w} = ${pieceArea(p)}`}
          </text>
        </g>
      ))}
      {drag && pieces.length === 2 && (
        <>
          <line x1={dragHandleX} y1={0} x2={dragHandleX} y2={sharedHeight} style={{ stroke: palette.ink, strokeWidth: 3 }} />
          <circle
            cx={dragHandleX}
            cy={-12}
            r={9}
            style={{ fill: palette.c, stroke: palette.ink, strokeWidth: 2, cursor: "ew-resize" }}
            onPointerDown={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
          />
          <text x={dragHandleX} y={-24} textAnchor="middle" style={{ fill: palette.muted, fontSize: 11, fontWeight: 700 }}>
            drag
          </text>
        </>
      )}
      {notes?.map((n, i) => (
        <text key={`n${i}`} x={n.x * cellPx} y={n.y * cellPx} textAnchor="middle" dominantBaseline="middle" style={{ fill: n.tone === "c" ? palette.c : palette.ink, fontSize: 13, fontWeight: 700 }}>
          {n.text}
        </text>
      ))}
      {caption && (
        <text x={width / 2} y={height + 22 + notePad / 2} textAnchor="middle" style={{ fill: palette.ink, fontSize: 14, fontWeight: 700 }}>
          {caption}
        </text>
      )}
    </svg>
  );
}
