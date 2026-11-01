import { createContext, useContext, type ReactNode } from "react";
import type React from "react";
import { palette } from "../../../shared/lib/palette";
import type { Pt } from "../lib/geometry";

// ============================================================================
// Small SVG kit for grid geometry: a canvas measured in GRID units (so every
// caller passes the same integer points lib/geometry.ts grades with), plus
// points, segments, rays, lines, angle marks, right-angle boxes, tick marks,
// a "corner tester", and labels. Checked shared/diagrams/ first:
// CoordinatePlane draws axes + plotted points, not rays/angles/polygons with
// marks, and nothing else there draws geometry. Lab-local for now
// (promotion candidate once a second geometry lab — e.g. AnglesAndProtractorLab
// — needs rays and angle marks too).
//
// Arrowheads are drawn as plain polygons, never <marker> elements — several
// of these SVGs share one page, and duplicate marker ids would collide.
// ============================================================================

interface GeoCtxValue {
  cell: number;
  pad: number;
}
const GeoCtx = createContext<GeoCtxValue>({ cell: 24, pad: 16 });

/** Grid point -> pixel. */
function usePx() {
  const { cell, pad } = useContext(GeoCtx);
  return (p: Pt): Pt => [pad + p[0] * cell, pad + p[1] * cell];
}
function useCell() {
  return useContext(GeoCtx).cell;
}

export type Tone = "ink" | "a" | "b" | "c" | "good" | "bad" | "muted";
const toneColor = (t: Tone = "ink"): string =>
  t === "a" ? palette.a : t === "b" ? palette.b : t === "c" ? palette.c : t === "good" ? palette.good : t === "bad" ? palette.bad : t === "muted" ? palette.muted : palette.ink;

export interface GeoCanvasProps {
  cols: number;
  rows: number;
  cell?: number;
  pad?: number;
  /** Light square grid behind the drawing (the "check it against the grid lines" tool). */
  grid?: boolean;
  label: string;
  children: ReactNode;
  /** Pointer handlers for interactive diagrams (Explore only). */
  svgRef?: React.Ref<SVGSVGElement>;
  onPointerMove?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp?: () => void;
}

export function GeoCanvas({ cols, rows, cell = 24, pad = 16, grid = true, label, children, svgRef, onPointerMove, onPointerUp }: GeoCanvasProps) {
  const w = pad * 2 + cols * cell;
  const h = pad * 2 + rows * cell;
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      style={{ maxWidth: "100%", touchAction: onPointerMove ? "none" : undefined }}
      role="img"
      aria-label={label}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {grid && (
        <g>
          {Array.from({ length: cols + 1 }, (_, i) => (
            <line key={`v${i}`} x1={pad + i * cell} y1={pad} x2={pad + i * cell} y2={pad + rows * cell} style={{ stroke: palette.grid, strokeWidth: 1 }} />
          ))}
          {Array.from({ length: rows + 1 }, (_, i) => (
            <line key={`h${i}`} x1={pad} y1={pad + i * cell} x2={pad + cols * cell} y2={pad + i * cell} style={{ stroke: palette.grid, strokeWidth: 1 }} />
          ))}
        </g>
      )}
      <GeoCtx.Provider value={{ cell, pad }}>{children}</GeoCtx.Provider>
    </svg>
  );
}

export function Dot({ at, tone = "ink", r = 4.5 }: { at: Pt; tone?: Tone; r?: number }) {
  const px = usePx();
  const [x, y] = px(at);
  return <circle cx={x} cy={y} r={r} style={{ fill: toneColor(tone) }} />;
}

/** A text label placed `off` pixels away from a grid point, in direction `dir` (unit-ish vector). */
export function Label({ at, text, dir = [0, -1], off = 14, tone = "ink", size = 14, bold = true }: { at: Pt; text: string; dir?: Pt; off?: number; tone?: Tone; size?: number; bold?: boolean }) {
  const px = usePx();
  const [x, y] = px(at);
  const len = Math.hypot(dir[0], dir[1]) || 1;
  return (
    <text
      x={x + (dir[0] / len) * off}
      y={y + (dir[1] / len) * off}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fill: toneColor(tone), fontSize: size, fontWeight: bold ? 700 : 500, fontFamily: "inherit" }}
    >
      {text}
    </text>
  );
}

function Arrowhead({ tip, from, tone }: { tip: Pt; from: Pt; tone: Tone }) {
  // pixel space
  const dx = tip[0] - from[0];
  const dy = tip[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const L = 13;
  const W = 6.5;
  const bx = tip[0] - ux * L;
  const by = tip[1] - uy * L;
  return <polygon points={`${tip[0]},${tip[1]} ${bx - uy * W},${by + ux * W} ${bx + uy * W},${by - ux * W}`} style={{ fill: toneColor(tone) }} />;
}

export interface StrokeProps {
  tone?: Tone;
  width?: number;
  dash?: boolean;
}

/** Tick marks across the middle of a segment (equal-length markers). */
function Ticks({ a, b, n, tone }: { a: Pt; b: Pt; n: number; tone: Tone }) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const o = (i - (n - 1) / 2) * 6;
        const cx = mx + ux * o;
        const cy = my + uy * o;
        return <line key={i} x1={cx - uy * 7} y1={cy + ux * 7} x2={cx + uy * 7} y2={cy - ux * 7} style={{ stroke: toneColor(tone), strokeWidth: 2.5 }} />;
      })}
    </g>
  );
}

/** A segment between two grid points. `ticks` draws n equal-length marks. */
export function Segment({ a, b, tone = "ink", width = 3, dash, ticks = 0, endDots = false }: StrokeProps & { a: Pt; b: Pt; ticks?: number; endDots?: boolean }) {
  const px = usePx();
  const pa = px(a);
  const pb = px(b);
  return (
    <g>
      <line x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]} style={{ stroke: toneColor(tone), strokeWidth: width, strokeDasharray: dash ? "7 6" : undefined, strokeLinecap: "round" }} />
      {ticks > 0 && <Ticks a={pa} b={pb} n={ticks} tone={tone} />}
      {endDots && (
        <>
          <circle cx={pa[0]} cy={pa[1]} r={5} style={{ fill: toneColor(tone) }} />
          <circle cx={pb[0]} cy={pb[1]} r={5} style={{ fill: toneColor(tone) }} />
        </>
      )}
    </g>
  );
}

/** A ray: endpoint dot at `from`, arrowhead at `to` (it keeps going that way). */
export function Ray({ from, to, tone = "ink", width = 3, endpointDot = true }: StrokeProps & { from: Pt; to: Pt; endpointDot?: boolean }) {
  const px = usePx();
  const pa = px(from);
  const pb = px(to);
  const len = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) || 1;
  // stop the shaft short of the tip so the arrowhead point stays sharp
  const shaftEnd: Pt = [pb[0] - ((pb[0] - pa[0]) / len) * 8, pb[1] - ((pb[1] - pa[1]) / len) * 8];
  return (
    <g>
      <line x1={pa[0]} y1={pa[1]} x2={shaftEnd[0]} y2={shaftEnd[1]} style={{ stroke: toneColor(tone), strokeWidth: width, strokeLinecap: "round" }} />
      <Arrowhead tip={pb} from={pa} tone={tone} />
      {endpointDot && <circle cx={pa[0]} cy={pa[1]} r={5} style={{ fill: toneColor(tone) }} />}
    </g>
  );
}

/** A line: arrowheads at BOTH ends (it keeps going both ways). */
export function LineShape({ a, b, tone = "ink", width = 3, dash }: StrokeProps & { a: Pt; b: Pt }) {
  const px = usePx();
  const pa = px(a);
  const pb = px(b);
  const len = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) || 1;
  const ux = (pb[0] - pa[0]) / len;
  const uy = (pb[1] - pa[1]) / len;
  return (
    <g>
      <line x1={pa[0] + ux * 8} y1={pa[1] + uy * 8} x2={pb[0] - ux * 8} y2={pb[1] - uy * 8} style={{ stroke: toneColor(tone), strokeWidth: width, strokeDasharray: dash ? "7 6" : undefined, strokeLinecap: "round" }} />
      <Arrowhead tip={pb} from={pa} tone={tone} />
      <Arrowhead tip={pa} from={pb} tone={tone} />
    </g>
  );
}

/** Small arc showing the opening of the angle at v between v->a and v->b
 *  (always the smaller opening — fine for every non-reflex angle drawn here). */
export function AngleArc({ v, a, b, r = 0.9, tone = "c" }: { v: Pt; a: Pt; b: Pt; r?: number; tone?: Tone }) {
  const px = usePx();
  const cell = useCell();
  const R = r * cell;
  const pv = px(v);
  const ang = (p: Pt) => Math.atan2(p[1] - v[1], p[0] - v[0]);
  const a1 = ang(a);
  let a2 = ang(b);
  let diff = a2 - a1;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  a2 = a1 + diff;
  const p1: Pt = [pv[0] + R * Math.cos(a1), pv[1] + R * Math.sin(a1)];
  const p2: Pt = [pv[0] + R * Math.cos(a2), pv[1] + R * Math.sin(a2)];
  const sweep = diff > 0 ? 1 : 0;
  return (
    <path
      d={`M ${pv[0]} ${pv[1]} L ${p1[0]} ${p1[1]} A ${R} ${R} 0 0 ${sweep} ${p2[0]} ${p2[1]} Z`}
      style={{ fill: palette.cSoft, stroke: toneColor(tone), strokeWidth: 2, opacity: 0.85 }}
    />
  );
}

/** The little square that MARKS a right angle at v (between v->a and v->b). */
export function RightMark({ v, a, b, size = 0.45, tone = "ink" }: { v: Pt; a: Pt; b: Pt; size?: number; tone?: Tone }) {
  const px = usePx();
  const cell = useCell();
  const s = size * cell;
  const pv = px(v);
  const unit = (p: Pt): Pt => {
    const q = px(p);
    const len = Math.hypot(q[0] - pv[0], q[1] - pv[1]) || 1;
    return [(q[0] - pv[0]) / len, (q[1] - pv[1]) / len];
  };
  const u = unit(a);
  const w = unit(b);
  const p1: Pt = [pv[0] + u[0] * s, pv[1] + u[1] * s];
  const p2: Pt = [pv[0] + (u[0] + w[0]) * s, pv[1] + (u[1] + w[1]) * s];
  const p3: Pt = [pv[0] + w[0] * s, pv[1] + w[1] * s];
  return <polyline points={`${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`} style={{ fill: "none", stroke: toneColor(tone), strokeWidth: 2 }} />;
}

/** A see-through "square corner" (like the corner of a sheet of paper) laid
 *  at vertex v with one edge along v->along. The student compares the other
 *  ray against its second edge: inside = acute, on it = right, outside = obtuse.
 *  `flip` puts the corner on the other side of the `along` edge. */
export function CornerTester({ v, along, toward, size = 2.6 }: { v: Pt; along: Pt; toward: Pt; size?: number }) {
  const px = usePx();
  const cell = useCell();
  const s = size * cell;
  const pv = px(v);
  const pa = px(along);
  const len = Math.hypot(pa[0] - pv[0], pa[1] - pv[1]) || 1;
  const u: Pt = [(pa[0] - pv[0]) / len, (pa[1] - pv[1]) / len];
  // perpendicular, chosen on the same side as `toward`
  let w: Pt = [-u[1], u[0]];
  const pt = px(toward);
  if ((pt[0] - pv[0]) * w[0] + (pt[1] - pv[1]) * w[1] < 0) w = [u[1], -u[0]];
  const p1: Pt = [pv[0] + u[0] * s, pv[1] + u[1] * s];
  const p2: Pt = [pv[0] + (u[0] + w[0]) * s, pv[1] + (u[1] + w[1]) * s];
  const p3: Pt = [pv[0] + w[0] * s, pv[1] + w[1] * s];
  return (
    <polygon
      points={`${pv[0]},${pv[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`}
      style={{ fill: palette.bSoft, stroke: palette.b, strokeWidth: 2, strokeDasharray: "5 4", opacity: 0.7 }}
    />
  );
}

/** Filled polygon outline. */
export function Poly({ pts, fill = "aSoft", tone = "ink", width = 3, dash, opacity = 1 }: { pts: Pt[]; fill?: "aSoft" | "bSoft" | "cSoft" | "none" | "goodSoft"; tone?: Tone; width?: number; dash?: boolean; opacity?: number }) {
  const px = usePx();
  const fillColor = fill === "none" ? "none" : palette[fill];
  return (
    <polygon
      points={pts.map((p) => px(p).join(",")).join(" ")}
      style={{ fill: fillColor, stroke: toneColor(tone), strokeWidth: width, strokeDasharray: dash ? "7 6" : undefined, strokeLinejoin: "round", opacity }}
    />
  );
}

/** Vertex letters placed just outside a polygon (pushed away from its center). */
export function VertexLabels({ pts, letters, off = 15 }: { pts: Pt[]; letters: string[]; off?: number }) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return (
    <g>
      {pts.map((p, i) => (
        <Label key={i} at={p} text={letters[i]} dir={[p[0] - cx || 0.01, p[1] - cy || 0.01]} off={off} />
      ))}
    </g>
  );
}

/** A side-length label at a side's midpoint, pushed outward from `center`. */
export function SideLabel({ a, b, text, center, off = 16, tone = "ink" }: { a: Pt; b: Pt; text: string; center: Pt; off?: number; tone?: Tone }) {
  const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  // outward normal
  let n: Pt = [-(b[1] - a[1]), b[0] - a[0]];
  if ((m[0] - center[0]) * n[0] + (m[1] - center[1]) * n[1] < 0) n = [-n[0], -n[1]];
  return <Label at={m} text={text} dir={n} off={off} tone={tone} size={13} />;
}
