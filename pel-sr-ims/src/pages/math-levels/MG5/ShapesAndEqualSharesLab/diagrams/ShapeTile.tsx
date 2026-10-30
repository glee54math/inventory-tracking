import type { ReactNode } from "react";
import { palette } from "../../../shared/lib/palette";

// ============================================================================
// Basic 2D polygon tiles (triangle/quadrilateral/pentagon/hexagon) plus a
// pseudo-3D cube glyph, for Unit 1 (2.G.1 — classify by angle/side count,
// identify a cube by its equal-face attribute).
//
// Checked shared/diagrams/ first (nothing there draws a literal flat shape
// tile or a solid), and MG4/ShapesAndFractionsIntroLab/diagrams/ShapeTile.tsx
// (the closest sibling precedent — same idea, 1.G.1) only covers
// triangle/square/rectangle/trapezoid/circle, not pentagon/hexagon/cube, so
// this is a new, lab-local file rather than a duplicate of an existing one.
// The cube glyph's layered-polygon technique IS a near-duplicate of
// MK4/ShapesLab/diagrams/Solid3D.tsx's own cube branch (first "3D shape"
// need anywhere in this app) — flagged as a shared/diagrams promotion
// candidate for a future session with broader scope, not promoted this
// round per this build's guardrails.
//
// A single `outline()`/`DEFINING_ATTRIBUTE` pair is read by BOTH the render
// path AND the CFU/Practice/Test wording, so "what the shape looks like" and
// "what makes it that shape" can never drift apart from each other.
// ============================================================================

export type ShapeKind = "triangle" | "quadrilateral" | "pentagon" | "hexagon";
export const SHAPE_KINDS: ShapeKind[] = ["triangle", "quadrilateral", "pentagon", "hexagon"];

export const SHAPE_NAMES: Record<ShapeKind, string> = {
  triangle: "triangle",
  quadrilateral: "quadrilateral",
  pentagon: "pentagon",
  hexagon: "hexagon",
};

export const SIDE_COUNT: Record<ShapeKind, number> = {
  triangle: 3,
  quadrilateral: 4,
  pentagon: 5,
  hexagon: 6,
};

/**
 * What ACTUALLY makes each shape that shape — the side/angle COUNT only,
 * never how regular, symmetric, or "textbook" it looks. Explore's readout,
 * CFU wording, Practice prompts/explanations, and the Test bank all pull
 * from this one table.
 */
export const DEFINING_ATTRIBUTE: Record<ShapeKind, string> = {
  triangle: "3 straight sides and 3 angles (corners)",
  quadrilateral: "4 straight sides and 4 angles (corners)",
  pentagon: "5 straight sides and 5 angles (corners)",
  hexagon: "6 straight sides and 6 angles (corners)",
};

export const CUBE_DEFINING_ATTRIBUTE = "6 matching square faces, all the same size";

/**
 * A small, deliberately plain-named palette for teaching that COLOR is a
 * non-defining attribute — kept distinct from shared/lib/palette's qa/qb/qc
 * quantity-coding colors, which carry a different meaning elsewhere.
 */
export const SHAPE_COLORS = ["#d64545", "#3157D5", "#4c8c2b", "#8a4fd8", "#e39a1e"] as const;
export const SHAPE_COLOR_NAMES = ["red", "blue", "green", "purple", "orange"] as const;

/**
 * Hand-authored vertex-radius jitter patterns, one fixed small set per shape
 * kind (index 0 is always perfectly regular). Every vertex sits at a
 * distinct, strictly-increasing angle around the center, so the polygon is
 * always star-shaped from its own center and can never self-intersect no
 * matter how the radius varies — that's what lets "irregular" just mean
 * "scale each vertex's radius by a different fixed amount" instead of a
 * general polygon-validity check. Variants >=1 are deliberately
 * non-symmetric (never just a uniformly-scaled regular polygon), so a
 * practice/test "irregular, still counts" example reads as genuinely
 * irregular, not merely bigger or smaller.
 */
const JITTER: Record<ShapeKind, number[][]> = {
  triangle: [
    [0, 0, 0],
    [0.35, -0.2, 0.05],
    [-0.25, 0.3, -0.1],
  ],
  quadrilateral: [
    [0, 0, 0, 0],
    [0.3, -0.25, 0.15, -0.1],
    [-0.2, 0.35, -0.3, 0.2],
    [0.4, 0.05, -0.3, -0.1], // kite-ish — one long spike
  ],
  pentagon: [
    [0, 0, 0, 0, 0],
    [0.25, -0.15, 0.3, -0.1, 0.05],
    [-0.15, 0.25, -0.2, 0.15, -0.2],
  ],
  hexagon: [
    [0, 0, 0, 0, 0, 0],
    [0.2, -0.15, 0.25, -0.2, 0.15, -0.1],
    [-0.15, 0.2, -0.1, 0.3, -0.2, 0.1],
  ],
};

export const VARIANT_COUNT: Record<ShapeKind, number> = {
  triangle: JITTER.triangle.length,
  quadrilateral: JITTER.quadrilateral.length,
  pentagon: JITTER.pentagon.length,
  hexagon: JITTER.hexagon.length,
};

/** Raw outline points for one shape kind/variant, centered on the origin at
 *  half-size `s`, before any translate/rotate. `variant` wraps modulo the
 *  kind's own jitter-pattern count, so a caller can pass any int safely. */
function outline(kind: ShapeKind, s: number, variant: number): [number, number][] {
  const n = SIDE_COUNT[kind];
  const patterns = JITTER[kind];
  const jitter = patterns[((variant % patterns.length) + patterns.length) % patterns.length];
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const baseDeg = (360 / n) * i - 90;
    const r = s * (1 + jitter[i] * 0.6);
    const a = (baseDeg * Math.PI) / 180;
    pts.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  return pts;
}

export interface ShapeTileProps {
  kind: ShapeKind;
  cx?: number;
  cy?: number;
  /** Half-size in px — the "how big" non-defining attribute. */
  size?: number;
  /** Which hand-authored jitter pattern to use (0 = regular). See JITTER. */
  variant?: number;
  /** Degrees — the "orientation" non-defining attribute. */
  rotation?: number;
  color?: string;
  opacity?: number;
  label?: string;
}

/** One basic polygon shape, drawn as a <g> so it can sit inside a shared
 *  <svg> alongside siblings (see ShapeCanvas). */
export function ShapeTile({ kind, cx = 0, cy = 0, size = 40, variant = 0, rotation = 0, color, opacity = 1, label }: ShapeTileProps) {
  const fill = color ?? palette.a;
  const pts = outline(kind, size, variant);
  const pointsAttr = pts.map((p) => p.join(",")).join(" ");
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotation})`} opacity={opacity}>
      <polygon points={pointsAttr} style={{ fill, stroke: palette.ink, strokeWidth: 2.5 }} aria-label={label} />
    </g>
  );
}

/** Standalone sized SVG canvas wrapping one or more ShapeTiles/glyphs. */
export function ShapeCanvas({ width = 120, height = 120, children, label }: { width?: number; height?: number; children: ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/**
 * A simple pseudo-3D cube — three visible faces at different opacity so it
 * reads as having DEPTH (the actual visual tell Unit 1's 2D-vs-3D CFU
 * question trains students to notice), same layered-polygon technique as
 * MK4's Solid3D.tsx cube branch (see this file's header comment).
 */
export function CubeGlyph({ cx = 60, cy = 60, size = 34, color, opacity = 1, label = "a cube" }: { cx?: number; cy?: number; size?: number; color?: string; opacity?: number; label?: string }) {
  const fill = color ?? palette.b;
  const s = size;
  const dx = s * 0.62;
  const dy = -s * 0.5;
  const FTL: [number, number] = [cx - s, cy - s * 0.3];
  const FTR: [number, number] = [cx + s, cy - s * 0.3];
  const FBR: [number, number] = [cx + s, cy + s * 1.05];
  const FBL: [number, number] = [cx - s, cy + s * 1.05];
  const BTL: [number, number] = [FTL[0] + dx, FTL[1] + dy];
  const BTR: [number, number] = [FTR[0] + dx, FTR[1] + dy];
  const top = [FTL, BTL, BTR, FTR].map((p) => p.join(",")).join(" ");
  const side = [FTR, BTR, [BTR[0], BTR[1] + s * 1.35] as [number, number], FBR].map((p) => p.join(",")).join(" ");
  const front = [FTL, FTR, FBR, FBL].map((p) => p.join(",")).join(" ");
  return (
    <g opacity={opacity} aria-label={label}>
      <polygon points={top} fill={fill} opacity={0.55} stroke={palette.ink} strokeWidth={2.5} />
      <polygon points={side} fill={fill} opacity={0.8} stroke={palette.ink} strokeWidth={2.5} />
      <polygon points={front} fill={fill} opacity={1} stroke={palette.ink} strokeWidth={2.5} />
    </g>
  );
}
