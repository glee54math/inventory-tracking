import { palette } from "../../../shared/lib/palette";

// ============================================================================
// Unit 2's composite 2D shapes — two (or more) basic pieces drawn together as
// one bigger named shape. Each composite is its own small, explicit, hand-
// verified SVG (same "specific over generic" convention as FactorRectangle/
// ShapePartition) rather than a general shape-composition engine — per this
// build's guardrails, a genuinely reusable "ShapeComposer" is a promotion
// candidate for a LATER round, not this one, so it stays lab-local.
//
// Circle-based composites reuse the same center-wedge technique
// ShapePartition.tsx's circleWedges uses (verified there): at exactly 180°/
// 90°-per-piece sweeps, a wedge's two straight edges are collinear, so it
// renders as a true half-circle or quarter-circle piece, not a visibly
// "pie-slice-from-the-middle" shape.
// ============================================================================

export type CompositeKind =
  | "rect-from-squares"
  | "circle-from-halfcircles"
  | "halfcircle-from-quartercircles"
  | "square-from-triangles"
  | "house-square-triangle"
  | "door-rectangle-halfcircle";

export const COMPOSITE_FAMILY: Record<CompositeKind, "same-repeated" | "different-combo"> = {
  "rect-from-squares": "same-repeated",
  "circle-from-halfcircles": "same-repeated",
  "halfcircle-from-quartercircles": "same-repeated",
  "square-from-triangles": "same-repeated",
  "house-square-triangle": "different-combo",
  "door-rectangle-halfcircle": "different-combo",
};

/** The resulting composite's own name, for prompts like "build a ___". */
export const COMPOSITE_TARGET_NAME: Record<CompositeKind, string> = {
  "rect-from-squares": "rectangle",
  "circle-from-halfcircles": "circle",
  "halfcircle-from-quartercircles": "half-circle",
  "square-from-triangles": "square",
  "house-square-triangle": "house shape",
  "door-rectangle-halfcircle": "door shape",
};

/** How to describe the pieces that built it — the canonical correct answer
 *  text for "which basic shapes make this?" (decompose bucket), and also
 *  used to build wrong-but-plausible distractor labels pulled from OTHER
 *  composites' own piece descriptions. */
export const COMPOSITE_PIECES_LABEL: Record<CompositeKind, string> = {
  "rect-from-squares": "Two squares",
  "circle-from-halfcircles": "Two half-circles",
  "halfcircle-from-quartercircles": "Two quarter-circles",
  "square-from-triangles": "Two triangles",
  "house-square-triangle": "A square and a triangle",
  "door-rectangle-halfcircle": "A rectangle and a half-circle",
};

export const ALL_COMPOSITES: CompositeKind[] = [
  "rect-from-squares",
  "circle-from-halfcircles",
  "halfcircle-from-quartercircles",
  "square-from-triangles",
  "house-square-triangle",
  "door-rectangle-halfcircle",
];

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Pie-wedge pieces from a shared center — see this file's own doc comment
 *  for why this is safe to reuse for true half/quarter-circle pieces. */
function wedgePaths(cx: number, cy: number, r: number, fractions: number[], startDeg: number): string[] {
  const pt = (deg: number) => ({ x: cx + r * Math.cos(toRad(deg)), y: cy + r * Math.sin(toRad(deg)) });
  let angle = startDeg;
  return fractions.map((frac) => {
    const sweepDeg = frac * 360;
    const p0 = pt(angle);
    const p1 = pt(angle + sweepDeg);
    const largeArc = sweepDeg > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
    angle += sweepDeg;
    return path;
  });
}

interface Piece {
  points?: string;
  path?: string;
  fill: string;
}

function pieces(kind: CompositeKind, w: number, h: number): Piece[] {
  const A = palette.aSoft;
  const B = palette.bSoft;
  switch (kind) {
    case "rect-from-squares": {
      const s = Math.min(w / 2, h);
      const x = (w - s * 2) / 2;
      const y = (h - s) / 2;
      return [
        { points: `${x},${y} ${x + s},${y} ${x + s},${y + s} ${x},${y + s}`, fill: A },
        { points: `${x + s},${y} ${x + s * 2},${y} ${x + s * 2},${y + s} ${x + s},${y + s}`, fill: B },
      ];
    }
    case "circle-from-halfcircles": {
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) / 2 - 6;
      const [p1, p2] = wedgePaths(cx, cy, r, [0.5, 0.5], 180);
      return [
        { path: p1, fill: A },
        { path: p2, fill: B },
      ];
    }
    case "halfcircle-from-quartercircles": {
      const cx = w / 2;
      const cy = h * 0.72;
      const r = Math.min(w, h * 0.9) / 2 - 6;
      // 180 -> 270 (west to north, the LEFT quarter) then 270 -> 360 (north
      // to east, the RIGHT quarter) — together exactly the upper half-disk.
      const [left, right] = wedgePaths(cx, cy, r, [0.25, 0.25], 180);
      return [
        { path: left, fill: A },
        { path: right, fill: B },
      ];
    }
    case "square-from-triangles": {
      const s = Math.min(w, h) - 16;
      const x = (w - s) / 2;
      const y = (h - s) / 2;
      return [
        { points: `${x},${y} ${x + s},${y} ${x + s},${y + s}`, fill: A },
        { points: `${x},${y} ${x + s},${y + s} ${x},${y + s}`, fill: B },
      ];
    }
    case "house-square-triangle": {
      const bodyW = w * 0.55;
      const bodyH = h * 0.5;
      const x = (w - bodyW) / 2;
      const y = h * 0.72 - bodyH;
      const peakY = y - h * 0.3;
      return [
        { points: `${x},${y} ${x + bodyW},${y} ${x + bodyW},${y + bodyH} ${x},${y + bodyH}`, fill: A }, // square body
        { points: `${x},${y} ${x + bodyW},${y} ${x + bodyW / 2},${peakY}`, fill: B }, // triangle roof
      ];
    }
    case "door-rectangle-halfcircle": {
      const bodyW = w * 0.5;
      const bodyH = h * 0.55;
      const x = (w - bodyW) / 2;
      const y = h * 0.78 - bodyH;
      const r = bodyW / 2;
      return [
        { points: `${x},${y} ${x + bodyW},${y} ${x + bodyW},${y + bodyH} ${x},${y + bodyH}`, fill: A }, // rectangle body
        { path: `M ${x} ${y} A ${r} ${r} 0 0 1 ${x + bodyW} ${y} Z`, fill: B }, // half-circle cap
      ];
    }
  }
}

export function CompositeShape({ kind, width = 150, height = 130, label }: { kind: CompositeKind; width?: number; height?: number; label?: string }) {
  const ps = pieces(kind, width, height);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={label ?? `A ${COMPOSITE_TARGET_NAME[kind]} made of ${COMPOSITE_PIECES_LABEL[kind].toLowerCase()}`}>
      {ps.map((p, i) =>
        p.points ? (
          <polygon key={i} points={p.points} style={{ fill: p.fill, stroke: palette.ink, strokeWidth: 2.5 }} />
        ) : (
          <path key={i} d={p.path} style={{ fill: p.fill, stroke: palette.ink, strokeWidth: 2.5 }} />
        )
      )}
    </svg>
  );
}
