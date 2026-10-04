import React from "react";

export type ShapeKind = "circle" | "square" | "triangle" | "star" | "diamond" | "hexagon" | "heart";

export interface ShapeProps {
  kind: ShapeKind;
  /** Center x/y in SVG units. */
  cx: number;
  cy: number;
  /** Width/height of the shape's bounding box. */
  size: number;
  fill: string;
  stroke?: string;
  opacity?: number;
  title?: string;
}

const polygon = (cx: number, cy: number, r: number, sides: number, rot = -Math.PI / 2) =>
  Array.from({ length: sides }, (_, i) => {
    const t = rot + (i * 2 * Math.PI) / sides;
    return `${cx + r * Math.cos(t)},${cy + r * Math.sin(t)}`;
  }).join(" ");

const starPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const t = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${cx + rad * Math.cos(t)},${cy + rad * Math.sin(t)}`;
  }).join(" ");

/** A single colored shape. Use inside any <svg>. */
export function Shape({ kind, cx, cy, size, fill, stroke, opacity = 1, title }: ShapeProps) {
  const r = size / 2;
  const style: React.CSSProperties = { fill, stroke: stroke ?? "none", strokeWidth: stroke ? 1.5 : 0, opacity };
  let el: React.ReactNode;
  switch (kind) {
    case "circle":
      el = <circle cx={cx} cy={cy} r={r * 0.92} style={style} />;
      break;
    case "square":
      el = <rect x={cx - r * 0.85} y={cy - r * 0.85} width={r * 1.7} height={r * 1.7} rx={r * 0.18} style={style} />;
      break;
    case "triangle":
      el = <polygon points={polygon(cx, cy + r * 0.12, r * 1.02, 3)} style={style} strokeLinejoin="round" />;
      break;
    case "diamond":
      el = <polygon points={polygon(cx, cy, r, 4)} style={style} />;
      break;
    case "hexagon":
      el = <polygon points={polygon(cx, cy, r * 0.95, 6, 0)} style={style} />;
      break;
    case "star":
      el = <polygon points={starPoints(cx, cy, r)} style={style} strokeLinejoin="round" />;
      break;
    case "heart": {
      const s = r * 0.95;
      const d = `M ${cx} ${cy + s * 0.85} C ${cx - s * 1.4} ${cy - s * 0.1}, ${cx - s * 0.7} ${cy - s * 1.1}, ${cx} ${cy - s * 0.45} C ${cx + s * 0.7} ${cy - s * 1.1}, ${cx + s * 1.4} ${cy - s * 0.1}, ${cx} ${cy + s * 0.85} Z`;
      el = <path d={d} style={style} />;
      break;
    }
  }
  return title ? (
    <g>
      <title>{title}</title>
      {el}
    </g>
  ) : (
    <>{el}</>
  );
}
