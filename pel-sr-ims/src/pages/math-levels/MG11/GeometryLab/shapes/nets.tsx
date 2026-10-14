// shapes/nets.tsx — flat nets for the solids in solids.tsx. Face ids and colors match.
import React from "react";
import { fmt } from "../lib/math";
import { FigureSvg, type Hue, Label, type Pt, centroid, hue, soft } from "./primitives";

export type NetFace = { id: string; color: Hue; pts: Pt[]; dims: string; area: number };

/** Draws any list of net faces (in units). Clicking a face calls onFace. */
export function NetFig({ faces, u, highlight = [], onFace, showAreas, maxWidth }: {
  faces: NetFace[]; u?: number; highlight?: string[]; onFace?: (id: string) => void; showAreas?: boolean; maxWidth?: number;
}) {
  const all = faces.flatMap((f) => f.pts);
  const W = Math.max(...all.map((p) => p.x)), H = Math.max(...all.map((p) => p.y));
  const U = u ?? Math.min(34, 330 / W, 330 / H);
  const anyHi = highlight.length > 0;
  return (
    <FigureSvg width={W * U} height={H * U} pad={14} maxWidth={maxWidth} label="Net of the solid">
      {faces.map((f) => {
        const hi = highlight.includes(f.id);
        const pts = f.pts.map((p) => ({ x: p.x * U, y: p.y * U }));
        const c = centroid(pts);
        const small = Math.min(...[0, 1].map((k) => {
          const vals = pts.map((p) => (k ? p.y : p.x));
          return Math.max(...vals) - Math.min(...vals);
        })) < 44;
        return (
          <g key={f.id} className={onFace ? "clickable face" : "face"} onClick={onFace ? () => onFace(f.id) : undefined}>
            <polygon points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
              fill={hi ? hue(f.color) : soft(f.color)} fillOpacity={hi ? 0.55 : anyHi ? 0.5 : 1}
              stroke={hue(hi ? "berry" : f.color)} strokeWidth={hi ? 3 : 1.8} strokeLinejoin="round" />
            <Label x={c.x} y={c.y - (showAreas ? 8 : 0)} text={f.dims} size={small ? 10 : 13} />
            {showAreas && <Label x={c.x} y={c.y + 10} text={fmt(f.area)} size={small ? 10 : 13} color="berry" weight={700} />}
          </g>
        );
      })}
    </FigureSvg>
  );
}

const rect = (x: number, y: number, w: number, h: number): Pt[] => [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
const x = (a: number, b: number) => `${fmt(a)} × ${fmt(b)}`;

/** Cross-shaped net of an l × w × h box. */
export function boxNet(l: number, w: number, h: number): NetFace[] {
  return [
    { id: "top", color: "blue", pts: rect(w, 0, l, w), dims: x(l, w), area: l * w },
    { id: "left", color: "teal", pts: rect(0, w, w, h), dims: x(w, h), area: w * h },
    { id: "front", color: "gold", pts: rect(w, w, l, h), dims: x(l, h), area: l * h },
    { id: "right", color: "teal", pts: rect(w + l, w, w, h), dims: x(w, h), area: w * h },
    { id: "back", color: "gold", pts: rect(2 * w + l, w, l, h), dims: x(l, h), area: l * h },
    { id: "bottom", color: "blue", pts: rect(w, w + h, l, w), dims: x(l, w), area: l * w },
  ];
}

/** Net of an isosceles triangular prism (triangle base b, height th, slanted side s, length L). */
export function triPrismNet(b: number, th: number, s: number, L: number): NetFace[] {
  const tri = b * th / 2;
  return [
    { id: "slantL", color: "teal", pts: rect(0, th, s, L), dims: x(s, L), area: s * L },
    { id: "base", color: "gold", pts: rect(s, th, b, L), dims: x(b, L), area: b * L },
    { id: "slantR", color: "teal", pts: rect(s + b, th, s, L), dims: x(s, L), area: s * L },
    { id: "triF", color: "blue", pts: [{ x: s, y: th }, { x: s + b / 2, y: 0 }, { x: s + b, y: th }], dims: `½·${fmt(b)}·${fmt(th)}`, area: tri },
    { id: "triB", color: "blue", pts: [{ x: s, y: th + L }, { x: s + b, y: th + L }, { x: s + b / 2, y: 2 * th + L }], dims: `½·${fmt(b)}·${fmt(th)}`, area: tri },
  ];
}

/** Net of a square pyramid (base side a, slant height sl). */
export function pyramidNet(a: number, sl: number): NetFace[] {
  const t = (a * sl) / 2, d = `½·${fmt(a)}·${fmt(sl)}`;
  const o = sl;
  return [
    { id: "base", color: "blue", pts: rect(o, o, a, a), dims: x(a, a), area: a * a },
    { id: "tB", color: "gold", pts: [{ x: o, y: o }, { x: o + a / 2, y: 0 }, { x: o + a, y: o }], dims: d, area: t },
    { id: "tF", color: "gold", pts: [{ x: o, y: o + a }, { x: o + a, y: o + a }, { x: o + a / 2, y: 2 * o + a }], dims: d, area: t },
    { id: "tL", color: "gold", pts: [{ x: o, y: o }, { x: o, y: o + a }, { x: 0, y: o + a / 2 }], dims: d, area: t },
    { id: "tR", color: "gold", pts: [{ x: o + a, y: o }, { x: 2 * o + a, y: o + a / 2 }, { x: o + a, y: o + a }], dims: d, area: t },
  ];
}
