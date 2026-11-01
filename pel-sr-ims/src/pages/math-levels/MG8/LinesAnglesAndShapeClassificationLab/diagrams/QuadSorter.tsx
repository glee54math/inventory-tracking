import { useRef, useState } from "react";
import type React from "react";
import { palette } from "../../../shared/lib/palette";
import { polygonAngleTypes, quadCategories, quadInfo, sideVec, sqLen, type Pt, type QuadCategory } from "../lib/geometry";

// ============================================================================
// Drag-the-corners quadrilateral sorter for Unit 4's Explore. Lab-local copy
// of the technique in MG7 QuadrilateralsAndPartitioningLab's QuadBuilder.tsx
// (integer-snapped corners, so every parallel / right-angle / equal-side test
// is exact), but reporting CATEGORY MEMBERSHIP instead of a pass/fail
// checklist, plus a nested "family tree" that lights up every category the
// current shape belongs to at once. Second consumer of the drag-corner
// builder → shared/diagrams promotion candidate (not promoted this round per
// the parallel-build scope rules).
// ============================================================================

const GRID = 10;
const CELL = 28;
const PAD = 18;
const SIZE = PAD * 2 + GRID * CELL;

export const QUAD_PRESETS: Record<string, Pt[]> = {
  Square: [
    [3, 2],
    [7, 2],
    [7, 6],
    [3, 6],
  ],
  Rectangle: [
    [1, 3],
    [8, 3],
    [8, 7],
    [1, 7],
  ],
  Rhombus: [
    [5, 1],
    [8, 5],
    [5, 9],
    [2, 5],
  ],
  Parallelogram: [
    [1, 3],
    [6, 3],
    [8, 7],
    [3, 7],
  ],
  Trapezoid: [
    [3, 2],
    [6, 2],
    [9, 7],
    [1, 7],
  ],
  Kite: [
    [5, 1],
    [7, 3],
    [5, 9],
    [3, 3],
  ],
};

function Box({ title, on, children, note }: { title: string; on: boolean; children?: React.ReactNode; note?: string }) {
  return (
    <div className={`lasc-tree-box ${on ? "on" : ""}`}>
      <div className="lasc-tree-title">
        {on ? "✓ " : ""}
        {title}
      </div>
      {note && <div className="lasc-tree-note">{note}</div>}
      {children && <div className="lasc-tree-kids">{children}</div>}
    </div>
  );
}

/** The quadrilateral family tree: every box whose rule the shape follows lights up. */
export function QuadFamilyTree({ cats, simple }: { cats: QuadCategory[]; simple: boolean }) {
  const has = (c: QuadCategory) => cats.includes(c);
  return (
    <div className="lasc-tree" aria-label="Quadrilateral family tree">
      <Box title="Quadrilateral" on={simple} note="any 4 straight sides">
        <Box title="Trapezoid" on={has("trapezoid")} note="exactly 1 pair of parallel sides" />
        <Box title="Parallelogram" on={has("parallelogram")} note="2 pairs of parallel sides">
          <Box title="Rectangle" on={has("rectangle")} note="4 right angles" />
          <Box title="Square" on={has("square")} note="BOTH: 4 right angles + 4 equal sides" />
          <Box title="Rhombus" on={has("rhombus")} note="4 equal sides" />
        </Box>
      </Box>
    </div>
  );
}

export function QuadSorter() {
  const [points, setPoints] = useState<Pt[]>(QUAD_PRESETS.Square);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragIndex = useRef<number | null>(null);

  const info = quadInfo(points);
  const cats = quadCategories(points);
  const types = polygonAngleTypes(points);
  const sq = points.map((_, i) => sqLen(sideVec(points, i)));
  const groups = [...new Set(sq)].filter((s) => sq.filter((t) => t === s).length >= 2);

  const toGrid = (clientX: number, clientY: number): Pt => {
    const svg = svgRef.current;
    if (!svg) return [0, 0];
    const rect = svg.getBoundingClientRect();
    const scale = SIZE / rect.width;
    const x = Math.round(((clientX - rect.left) * scale - PAD) / CELL);
    const y = Math.round(((clientY - rect.top) * scale - PAD) / CELL);
    return [Math.min(GRID, Math.max(0, x)), Math.min(GRID, Math.max(0, y))];
  };
  const onMove = (e: React.PointerEvent) => {
    const i = dragIndex.current;
    if (i === null) return;
    const g = toGrid(e.clientX, e.clientY);
    setPoints((prev) => {
      if (prev.some((p, k) => k !== i && p[0] === g[0] && p[1] === g[1])) return prev;
      const next = [...prev];
      next[i] = g;
      return next;
    });
  };
  const px = (p: Pt) => [PAD + p[0] * CELL, PAD + p[1] * CELL];

  return (
    <div className="lasc-stack">
      <div className="control-row" style={{ flexWrap: "wrap" }}>
        {Object.keys(QUAD_PRESETS).map((k) => (
          <button key={k} type="button" className="btn ghost" onClick={() => setPoints(QUAD_PRESETS[k])}>
            {k}
          </button>
        ))}
      </div>
      <div className="lasc-row" style={{ alignItems: "flex-start" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          style={{ maxWidth: "100%", touchAction: "none" }}
          role="img"
          aria-label="A quadrilateral with 4 draggable corners"
          onPointerMove={onMove}
          onPointerUp={() => (dragIndex.current = null)}
          onPointerLeave={() => (dragIndex.current = null)}
        >
          {Array.from({ length: GRID + 1 }, (_, i) => (
            <g key={i}>
              <line x1={PAD + i * CELL} y1={PAD} x2={PAD + i * CELL} y2={PAD + GRID * CELL} style={{ stroke: palette.grid }} />
              <line x1={PAD} y1={PAD + i * CELL} x2={PAD + GRID * CELL} y2={PAD + i * CELL} style={{ stroke: palette.grid }} />
            </g>
          ))}
          <polygon points={points.map((p) => px(p).join(",")).join(" ")} style={{ fill: info.convex ? palette.aSoft : palette.bSoft, stroke: palette.ink, strokeWidth: 3, strokeLinejoin: "round" }} />
          {points.map((p, i) => {
            if (types[i] !== "right" || !info.convex) return null;
            const n = points.length;
            const v = px(p);
            const a = px(points[(i + n - 1) % n]);
            const b = px(points[(i + 1) % n]);
            const u = (q: number[]) => {
              const L = Math.hypot(q[0] - v[0], q[1] - v[1]);
              return [(q[0] - v[0]) / L, (q[1] - v[1]) / L];
            };
            const ua = u(a);
            const ub = u(b);
            const s = 12;
            return (
              <polyline
                key={`r${i}`}
                points={`${v[0] + ua[0] * s},${v[1] + ua[1] * s} ${v[0] + (ua[0] + ub[0]) * s},${v[1] + (ua[1] + ub[1]) * s} ${v[0] + ub[0] * s},${v[1] + ub[1] * s}`}
                style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }}
              />
            );
          })}
          {points.map((p, i) => {
            const k = groups.indexOf(sq[i]);
            if (k < 0) return null;
            const a = px(p);
            const b = px(points[(i + 1) % points.length]);
            const mx = (a[0] + b[0]) / 2;
            const my = (a[1] + b[1]) / 2;
            const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
            const ux = (b[0] - a[0]) / L;
            const uy = (b[1] - a[1]) / L;
            return (
              <g key={`t${i}`}>
                {Array.from({ length: k + 1 }, (_, j) => {
                  const o = (j - k / 2) * 6;
                  const cx = mx + ux * o;
                  const cy = my + uy * o;
                  return <line key={j} x1={cx - uy * 7} y1={cy + ux * 7} x2={cx + uy * 7} y2={cy - ux * 7} style={{ stroke: palette.ink, strokeWidth: 2.5 }} />;
                })}
              </g>
            );
          })}
          {points.map((p, i) => {
            const [x, y] = px(p);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={12}
                style={{ fill: palette.paper, stroke: palette.a, strokeWidth: 3, cursor: "grab", touchAction: "none" }}
                onPointerDown={(e) => {
                  (e.target as Element).setPointerCapture?.(e.pointerId);
                  dragIndex.current = i;
                }}
              />
            );
          })}
        </svg>
        <QuadFamilyTree cats={cats} simple={info.convex} />
      </div>
      {info.convex ? (
        <p className="lasc-readout">
          Pairs of parallel sides: <b>{info.parallelPairs}</b>. Right angles: <b>{info.rightAngles}</b>. All 4 sides equal: <b>{info.allSidesEqual ? "yes" : "no"}</b>. So it belongs to:{" "}
          <b>{cats.length ? cats.join(", ") : "none of the five special names — it's just a quadrilateral"}</b>.
        </p>
      ) : (
        <p className="feedback bad">Drag the corners into a shape that doesn't fold in on itself (this explorer only sorts shapes with every corner pointing outward).</p>
      )}
    </div>
  );
}
