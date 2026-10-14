// shapes/primitives.tsx — low-level SVG building blocks.
// Every figure in the app is composed from these. They work in pixel space (y points down).
import React from "react";

export type Pt = { x: number; y: number };
/** Palette keys map to CSS variables: --c-blue, --c-blue-soft, etc. */
export type Hue = "blue" | "gold" | "teal" | "berry" | "ink";

export const hue = (h: Hue) => `var(--c-${h})`;
export const soft = (h: Hue) => `var(--c-${h}-soft)`;

/** Responsive SVG canvas. Content is drawn in the box [minX, minY, width, height] plus padding. */
export function FigureSvg(props: {
  minX?: number;
  minY?: number;
  width: number;
  height: number;
  pad?: number;
  maxWidth?: number;
  label?: string;
  children: React.ReactNode;
  svgRef?: React.Ref<SVGSVGElement>;
  className?: string;
}) {
  const { minX = 0, minY = 0, width, height, pad = 34, maxWidth, label, children, svgRef, className } = props;
  return (
    <svg
      ref={svgRef}
      className={"figure " + (className ?? "")}
      viewBox={`${minX - pad} ${minY - pad} ${width + pad * 2} ${height + pad * 2}`}
      style={{ maxWidth: maxWidth ?? width + pad * 2 }}
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

/** Unit-square grid, drawn from (x, y) with `cols` × `rows` cells of size u. */
export function Grid({ x = 0, y = 0, cols, rows, u }: { x?: number; y?: number; cols: number; rows: number; u: number }) {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i <= cols; i++) lines.push(<line key={"v" + i} x1={x + i * u} y1={y} x2={x + i * u} y2={y + rows * u} />);
  for (let j = 0; j <= rows; j++) lines.push(<line key={"h" + j} x1={x} y1={y + j * u} x2={x + cols * u} y2={y + j * u} />);
  return <g className="grid-lines">{lines}</g>;
}

export function Poly(props: {
  points: Pt[];
  color?: Hue;
  fill?: string;
  dashed?: boolean;
  faded?: boolean;
  strong?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}) {
  const { points, color = "blue", fill, dashed, faded, strong, onClick, style, className } = props;
  return (
    <polygon
      className={"poly " + (className ?? "") + (onClick ? " clickable" : "")}
      points={points.map((p) => `${p.x},${p.y}`).join(" ")}
      fill={fill ?? soft(color)}
      stroke={hue(color)}
      strokeWidth={strong ? 3.5 : 2.2}
      strokeDasharray={dashed ? "6 5" : undefined}
      strokeLinejoin="round"
      opacity={faded ? 0.28 : 1}
      onClick={onClick}
      style={style}
    />
  );
}

export function Seg({ a, b, color = "ink", dashed, width = 2 }: { a: Pt; b: Pt; color?: Hue; dashed?: boolean; width?: number }) {
  return (
    <line
      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
      stroke={hue(color)} strokeWidth={width}
      strokeDasharray={dashed ? "6 5" : undefined} strokeLinecap="round"
    />
  );
}

/** Text with a paper-colored halo so it reads on top of lines. */
export function Label({ x, y, text, size = 15, color = "ink", anchor = "middle", weight = 600 }: {
  x: number; y: number; text: React.ReactNode; size?: number; color?: Hue; anchor?: "start" | "middle" | "end"; weight?: number;
}) {
  return (
    <text x={x} y={y} className="svg-label" fontSize={size} fill={hue(color)} textAnchor={anchor} dominantBaseline="central" fontWeight={weight}>
      {text}
    </text>
  );
}

/**
 * Ruler-style dimension: a line parallel to a→b, offset to one side, with end ticks and a label.
 * Positive offset puts it on the left of the a→b direction (screen coords).
 */
export function DimLabel({ a, b, text, offset = 18, color = "ink", highlight }: {
  a: Pt; b: Pt; text: string; offset?: number; color?: Hue; highlight?: boolean;
}) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = dy / len, ny = -dx / len; // left normal in screen space
  const o = { x: nx * offset, y: ny * offset };
  const A = { x: a.x + o.x, y: a.y + o.y };
  const B = { x: b.x + o.x, y: b.y + o.y };
  const t = 5;
  const mid = { x: (A.x + B.x) / 2 + nx * 4, y: (A.y + B.y) / 2 + ny * 4 };
  const c = highlight ? "berry" : color;
  return (
    <g className="dim" opacity={0.95}>
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={hue(c)} strokeWidth={1.4} />
      <line x1={A.x - nx * t} y1={A.y - ny * t} x2={A.x + nx * t} y2={A.y + ny * t} stroke={hue(c)} strokeWidth={1.4} />
      <line x1={B.x - nx * t} y1={B.y - ny * t} x2={B.x + nx * t} y2={B.y + ny * t} stroke={hue(c)} strokeWidth={1.4} />
      <Label x={mid.x + nx * 8} y={mid.y + ny * 8} text={text} color={c} size={highlight ? 16 : 14} weight={highlight ? 700 : 600} />
    </g>
  );
}

/** Small square marking a right angle at p, between unit directions d1 and d2. */
export function RightAngleMark({ p, d1, d2, size = 11, color = "ink" }: { p: Pt; d1: Pt; d2: Pt; size?: number; color?: Hue }) {
  const a = { x: p.x + d1.x * size, y: p.y + d1.y * size };
  const c = { x: p.x + d2.x * size, y: p.y + d2.y * size };
  const b = { x: a.x + d2.x * size, y: a.y + d2.y * size };
  return <polyline points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`} fill="none" stroke={hue(color)} strokeWidth={1.5} />;
}

export function Dot({ p, r = 5, color = "ink", label, labelOffset = { x: 10, y: -12 } }: {
  p: Pt; r?: number; color?: Hue; label?: string; labelOffset?: Pt;
}) {
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={r} fill={hue(color)} stroke="var(--paper)" strokeWidth={2} />
      {label && <Label x={p.x + labelOffset.x} y={p.y + labelOffset.y} text={label} color={color} size={14} anchor="start" />}
    </g>
  );
}

export const centroid = (pts: Pt[]): Pt => ({
  x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
  y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
});

/** Helper for "focus" highlighting: when a focus list is active, non-focused parts fade. */
export function focusState(focus: string[] | undefined, id: string) {
  const active = !!focus && focus.length > 0;
  const on = active && focus!.includes(id);
  return { strong: on, faded: active && !on };
}
