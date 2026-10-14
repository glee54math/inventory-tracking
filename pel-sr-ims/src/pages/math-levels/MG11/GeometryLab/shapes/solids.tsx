// shapes/solids.tsx — 3D figures drawn with an oblique ("textbook") projection.
// x = length (right), y = depth (into the page, drawn up-right), z = height (up).
import React from "react";
import { fmt } from "../lib/math";
import { FigureSvg, type Hue, Label, type Pt, hue, soft } from "./primitives";

export type P3 = [number, number, number];
export const OBLIQUE = 0.45;

export const project = (p: P3, u: number): Pt => ({ x: (p[0] + OBLIQUE * p[1]) * u, y: -(p[2] + OBLIQUE * p[1]) * u });

function bounds(pts: Pt[]) {
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  return { minX, minY, width: Math.max(...xs) - minX, height: Math.max(...ys) - minY };
}

const sub = (a: P3, b: P3): P3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: P3, b: P3): P3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: P3, b: P3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const avg = (ps: P3[]): P3 => [0, 1, 2].map((i) => ps.reduce((s, p) => s + p[i], 0) / ps.length) as P3;
/** Direction toward the viewer for this projection. */
const VIEW: P3 = [OBLIQUE, -1, OBLIQUE];

export type Face3 = { id: string; pts: P3[]; color: Hue; name: string };
export type Label3 = { p: P3; text: string; dx?: number; dy?: number; anchor?: "start" | "middle" | "end" };

/** Generic convex solid: hidden faces are dashed, visible faces filled. Works for any convex polyhedron. */
export function Solid3D({ faces, u: uProp, highlight = [], labels = [], onFace, maxWidth }: {
  faces: Face3[]; u?: number; highlight?: string[]; labels?: Label3[]; onFace?: (id: string) => void; maxWidth?: number;
}) {
  const all = faces.flatMap((f) => f.pts);
  const unit = bounds(all.map((p) => project(p, 1)));
  const u = uProp ?? Math.min(34, 260 / unit.width, 220 / unit.height);
  const center = avg(all);
  const info = faces.map((f) => {
    let n = cross(sub(f.pts[1], f.pts[0]), sub(f.pts[2], f.pts[0]));
    if (dot(n, sub(avg(f.pts), center)) < 0) n = [-n[0], -n[1], -n[2]];
    return { f, visible: dot(n, VIEW) > 1e-9, screen: f.pts.map((p) => project(p, u)) };
  });
  const bb = bounds(info.flatMap((i) => i.screen));
  const anyHi = highlight.length > 0;
  const path = (pts: Pt[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");
  // Hidden edges: edges of hidden faces that aren't shared with a visible face. Drawn dashed on top.
  const key = (a: P3, b: P3) => [a.join(","), b.join(",")].sort().join("|");
  const visibleEdges = new Set<string>();
  info.filter((i) => i.visible).forEach(({ f }) => f.pts.forEach((p, k) => visibleEdges.add(key(p, f.pts[(k + 1) % f.pts.length]))));
  const hiddenEdges = new Map<string, [Pt, Pt]>();
  info.filter((i) => !i.visible).forEach(({ f }) => f.pts.forEach((p, k) => {
    const q = f.pts[(k + 1) % f.pts.length];
    const id = key(p, q);
    if (!visibleEdges.has(id)) hiddenEdges.set(id, [project(p, u), project(q, u)]);
  }));
  return (
    <FigureSvg {...bb} pad={40} maxWidth={maxWidth} label="3D figure">
      {info.filter((i) => i.visible).map(({ f, screen }) => {
        const hi = highlight.includes(f.id);
        return (
          <polygon key={f.id} points={path(screen)} className={onFace ? "clickable face" : "face"}
            fill={hi ? hue(f.color) : soft(f.color)} fillOpacity={hi ? 0.55 : anyHi ? 0.45 : 1}
            stroke={hue(hi ? "berry" : f.color)} strokeWidth={hi ? 3 : 2} strokeLinejoin="round"
            onClick={onFace ? () => onFace(f.id) : undefined} />
        );
      })}
      {info.filter((i) => !i.visible && highlight.includes(i.f.id)).map(({ f, screen }) => (
        <polygon key={"h" + f.id} points={path(screen)} fill={hue(f.color)} fillOpacity={0.3}
          stroke={hue("berry")} strokeWidth={2.4} strokeDasharray="5 5" pointerEvents="none" />
      ))}
      {[...hiddenEdges.entries()].map(([id, [a, b]]) => (
        <line key={id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={hue("ink")} strokeWidth={1.3} strokeDasharray="5 5" opacity={0.6} pointerEvents="none" />
      ))}
      {labels.map((l, i) => {
        const p = project(l.p, u);
        return <Label key={i} x={p.x + (l.dx ?? 0)} y={p.y + (l.dy ?? 0)} text={l.text} anchor={l.anchor} size={14} />;
      })}
    </FigureSvg>
  );
}

/* ---------- Solid builders (face ids match the nets in nets.tsx) ---------- */
export function boxFaces(l: number, w: number, h: number): Face3[] {
  const v = (x: number, y: number, z: number): P3 => [x * l, y * w, z * h];
  return [
    { id: "bottom", name: "Bottom", color: "blue", pts: [v(0, 0, 0), v(1, 0, 0), v(1, 1, 0), v(0, 1, 0)] },
    { id: "top", name: "Top", color: "blue", pts: [v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1)] },
    { id: "front", name: "Front", color: "gold", pts: [v(0, 0, 0), v(1, 0, 0), v(1, 0, 1), v(0, 0, 1)] },
    { id: "back", name: "Back", color: "gold", pts: [v(0, 1, 0), v(1, 1, 0), v(1, 1, 1), v(0, 1, 1)] },
    { id: "left", name: "Left side", color: "teal", pts: [v(0, 0, 0), v(0, 1, 0), v(0, 1, 1), v(0, 0, 1)] },
    { id: "right", name: "Right side", color: "teal", pts: [v(1, 0, 0), v(1, 1, 0), v(1, 1, 1), v(1, 0, 1)] },
  ];
}
export const boxLabels = (l: number, w: number, h: number, unit = ""): Label3[] => [
  { p: [l / 2, 0, 0], text: fmt(l) + unit, dy: 16 },
  { p: [l, w / 2, 0], text: fmt(w) + unit, dx: 10, dy: 8, anchor: "start" },
  { p: [0, 0, h / 2], text: fmt(h) + unit, dx: -10, anchor: "end" },
];

/** Isosceles triangular prism: triangle base b, triangle height th, length L (depth). */
export function triPrismFaces(b: number, th: number, L: number): Face3[] {
  const f0: P3 = [0, 0, 0], f1: P3 = [b, 0, 0], f2: P3 = [b / 2, 0, th];
  const b0: P3 = [0, L, 0], b1: P3 = [b, L, 0], b2: P3 = [b / 2, L, th];
  return [
    { id: "triF", name: "Front triangle", color: "blue", pts: [f0, f1, f2] },
    { id: "triB", name: "Back triangle", color: "blue", pts: [b0, b1, b2] },
    { id: "base", name: "Bottom rectangle", color: "gold", pts: [f0, f1, b1, b0] },
    { id: "slantL", name: "Left slanted rectangle", color: "teal", pts: [f0, f2, b2, b0] },
    { id: "slantR", name: "Right slanted rectangle", color: "teal", pts: [f1, f2, b2, b1] },
  ];
}
export const triPrismLabels = (b: number, th: number, L: number, s: number, unit = ""): Label3[] => [
  { p: [b / 2, 0, 0], text: fmt(b) + unit, dy: 16 },
  { p: [b / 2, 0, th / 2], text: "h " + fmt(th), dy: 4 },
  { p: [b / 4, 0, th / 2], text: fmt(s) + unit, dx: -10, anchor: "end" },
  { p: [b, L / 2, 0], text: fmt(L) + unit, dx: 10, dy: 8, anchor: "start" },
];

/** Square pyramid with base side a and slant height sl (height of each triangle face). */
export function pyramidFaces(a: number, sl: number): Face3[] {
  const H = Math.sqrt(Math.max(sl * sl - (a / 2) * (a / 2), 0.25));
  const p: P3[] = [[0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0]];
  const t: P3 = [a / 2, a / 2, H];
  return [
    { id: "base", name: "Square base", color: "blue", pts: p },
    { id: "tF", name: "Front triangle", color: "gold", pts: [p[0], p[1], t] },
    { id: "tR", name: "Right triangle", color: "gold", pts: [p[1], p[2], t] },
    { id: "tB", name: "Back triangle", color: "gold", pts: [p[2], p[3], t] },
    { id: "tL", name: "Left triangle", color: "gold", pts: [p[3], p[0], t] },
  ];
}
export const pyramidLabels = (a: number, sl: number, unit = ""): Label3[] => {
  const H = Math.sqrt(Math.max(sl * sl - (a / 2) * (a / 2), 0.25));
  return [
    { p: [a / 2, 0, 0], text: fmt(a) + unit, dy: 16 },
    { p: [a / 2, a / 6, H / 3], text: "slant " + fmt(sl) },
  ];
};

/* ---------- Rectangular prism packed with unit-fraction cubes ---------- */
/**
 * l, w, h are edge lengths; d is the cube denominator (cubes have edge 1/d).
 * `layers` controls how many layers of cubes are filled (0 … h·d).
 */
export function PrismFig({ l, w, h, d = 1, layers, grid = true, u, unit = "", highlightTop, maxWidth }: {
  l: number; w: number; h: number; d?: number; layers?: number; grid?: boolean; u?: number; unit?: string; highlightTop?: boolean; maxWidth?: number;
}) {
  const U = u ?? Math.min(80, 300 / (l + OBLIQUE * w), 230 / (h + OBLIQUE * w));
  const nH = Math.round(h * d);
  const fillZ = (layers ?? nH) / d;
  const P = (x: number, y: number, z: number) => project([x, y, z], U);
  const path = (pts: Pt[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");
  const corners = [P(0, 0, 0), P(l, 0, 0), P(l, w, 0), P(0, w, 0), P(0, 0, h), P(l, 0, h), P(l, w, h), P(0, w, h)];
  const bb = bounds(corners);
  const lines: React.ReactNode[] = [];
  const step = 1 / d;
  const add = (a: Pt, b: Pt, k: string) => lines.push(<line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />);
  if (grid && fillZ > 0) {
    for (let x = step; x < l - 1e-9; x += step) { add(P(x, 0, 0), P(x, 0, fillZ), "fx" + x); add(P(x, 0, fillZ), P(x, w, fillZ), "tx" + x); }
    for (let z = step; z < fillZ - 1e-9; z += step) { add(P(0, 0, z), P(l, 0, z), "fz" + z); add(P(l, 0, z), P(l, w, z), "rz" + z); }
    for (let y = step; y < w - 1e-9; y += step) { add(P(0, y, fillZ), P(l, y, fillZ), "ty" + y); add(P(l, y, 0), P(l, y, fillZ), "ry" + y); }
  }
  const edge = (a: number, b: number, dashed = false) => (
    <line key={`${a}-${b}`} x1={corners[a].x} y1={corners[a].y} x2={corners[b].x} y2={corners[b].y}
      stroke={hue("ink")} strokeWidth={dashed ? 1.2 : 2} strokeDasharray={dashed ? "5 5" : undefined} opacity={dashed ? 0.55 : 1} />
  );
  return (
    <FigureSvg {...bb} pad={44} maxWidth={maxWidth} label={`Rectangular prism ${fmt(l)} by ${fmt(w)} by ${fmt(h)}`}>
      {[edge(0, 3, true), edge(3, 2, true), edge(3, 7, true)]}
      {fillZ > 0 && (
        <g className="cubes">
          <polygon points={path([P(0, 0, 0), P(l, 0, 0), P(l, 0, fillZ), P(0, 0, fillZ)])} fill={hue("blue")} fillOpacity={0.32} />
          <polygon points={path([P(l, 0, 0), P(l, w, 0), P(l, w, fillZ), P(l, 0, fillZ)])} fill={hue("blue")} fillOpacity={0.5} />
          <polygon points={path([P(0, 0, fillZ), P(l, 0, fillZ), P(l, w, fillZ), P(0, w, fillZ)])}
            fill={highlightTop ? hue("gold") : hue("blue")} fillOpacity={highlightTop ? 0.55 : 0.16} />
          <g className="cube-lines">{lines}</g>
          <polyline points={path([P(0, 0, fillZ), P(l, 0, fillZ), P(l, w, fillZ), P(0, w, fillZ), P(0, 0, fillZ)])} fill="none" stroke={hue("blue")} strokeWidth={1.6} />
          <line x1={P(l, 0, fillZ).x} y1={P(l, 0, fillZ).y} x2={P(l, 0, 0).x} y2={P(l, 0, 0).y} stroke={hue("blue")} strokeWidth={1.6} />
        </g>
      )}
      {[edge(0, 1), edge(1, 2), edge(0, 4), edge(1, 5), edge(2, 6), edge(4, 5), edge(5, 6), edge(6, 7), edge(7, 4)]}
      <Label x={(corners[0].x + corners[1].x) / 2} y={corners[0].y + 18} text={fmt(l) + unit} />
      <Label x={(corners[1].x + corners[2].x) / 2 + 12} y={(corners[1].y + corners[2].y) / 2 + 6} text={fmt(w) + unit} anchor="start" />
      <Label x={corners[0].x - 10} y={(corners[0].y + corners[4].y) / 2} text={fmt(h) + unit} anchor="end" />
    </FigureSvg>
  );
}
