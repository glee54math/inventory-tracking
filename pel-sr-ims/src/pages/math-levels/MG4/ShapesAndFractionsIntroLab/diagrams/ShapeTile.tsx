import type { ReactNode } from "react";
import { palette } from "../../../shared/lib/palette";

// ============================================================================
// Basic 2D shape tiles — the first consumer of a "draw a basic 2D piece"
// diagram anywhere in shared/diagrams/ (checked before writing this; nothing
// there shows a literal shape-tile or a composite built from them), so this
// stays lab-local per this build's guardrails rather than being promoted.
// A single `outline()` lookup is read by BOTH the render path (ShapeTile)
// AND by DEFINING_ATTRIBUTE's wording below, so "what shape X looks like"
// and "what makes shape X that shape" never drift apart from each other.
// ============================================================================

export type ShapeKind = "triangle" | "square" | "rectangle" | "trapezoid" | "circle" | "halfCircle" | "quarterCircle";

export const SHAPE_NAMES: Record<ShapeKind, string> = {
  triangle: "triangle",
  square: "square",
  rectangle: "rectangle",
  trapezoid: "trapezoid",
  circle: "circle",
  halfCircle: "half-circle",
  quarterCircle: "quarter-circle",
};

/**
 * What ACTUALLY makes each shape that shape — number/kind of sides only,
 * never anything about how big it is, what color it is, or which way it's
 * turned. Unit 1's Explore readout, CFU wording, Practice prompts/
 * explanations, and the Test bank all pull from this one table so the
 * "defining attribute" wording is identical everywhere a student sees it.
 */
export const DEFINING_ATTRIBUTE: Record<ShapeKind, string> = {
  triangle: "3 straight sides",
  square: "4 straight sides that are all the same length, with 4 square corners",
  rectangle: "4 straight sides with 4 square corners (2 long sides and 2 short sides)",
  trapezoid: "4 straight sides, with one pair of sides running the same direction (parallel)",
  circle: "one round, curved edge — no straight sides and no corners",
  halfCircle: "one curved edge and one straight edge",
  quarterCircle: "one curved edge and two straight edges that meet in a square corner",
};

/**
 * A small, deliberately plain-named palette ("red", "blue", "green", ...)
 * for teaching that COLOR is a non-defining attribute — kept distinct from
 * shared/lib/palette's qa/qb/qc quantity-coding colors, which carry a
 * different meaning (which quantity is which) everywhere else in this app
 * and would be the wrong colors to reach for here.
 */
export const SHAPE_COLORS = ["#d64545", "#3157D5", "#4c8c2b", "#8a4fd8", "#e39a1e"] as const;
export const SHAPE_COLOR_NAMES = ["red", "blue", "green", "purple", "orange"] as const;

/** Raw outline for one shape kind, centered on the origin at the given half-size `s`,
 *  before any translate/rotate is applied. */
function outline(kind: ShapeKind, s: number): { points?: string; path?: string } {
  switch (kind) {
    case "triangle":
      return { points: `0,${-s} ${-s * 0.87},${s * 0.55} ${s * 0.87},${s * 0.55}` };
    case "square":
      return { points: `${-s},${-s} ${s},${-s} ${s},${s} ${-s},${s}` };
    case "rectangle":
      return { points: `${-s * 1.4},${-s * 0.7} ${s * 1.4},${-s * 0.7} ${s * 1.4},${s * 0.7} ${-s * 1.4},${s * 0.7}` };
    case "trapezoid":
      return { points: `${-s * 0.55},${-s * 0.6} ${s * 0.55},${-s * 0.6} ${s * 0.95},${s * 0.6} ${-s * 0.95},${s * 0.6}` };
    case "circle":
      return { path: `M ${-s} 0 A ${s} ${s} 0 1 0 ${s} 0 A ${s} ${s} 0 1 0 ${-s} 0 Z` };
    case "halfCircle":
      // Flat edge along the x-axis, curve bulging toward -y (up, before rotation).
      return { path: `M ${-s} 0 A ${s} ${s} 0 0 1 ${s} 0 Z` };
    case "quarterCircle":
      // Square corner at the origin, straight edges along +x and -y.
      return { path: `M 0 0 L ${s} 0 A ${s} ${s} 0 0 1 0 ${-s} Z` };
  }
}

export interface ShapeTileProps {
  kind: ShapeKind;
  cx?: number;
  cy?: number;
  /** Half-size in px — the ONE "how big" number; varying it is exactly the
   *  non-defining "size" attribute Unit 1 teaches shouldn't change the category. */
  size?: number;
  /** Degrees — the "orientation" non-defining attribute. A rotated square
   *  deliberately looks like a diamond; it is still a square. */
  rotation?: number;
  /** Fill color — the "color" non-defining attribute. Defaults to palette.a
   *  so a caller that doesn't care about color still gets a sensible fill. */
  color?: string;
  opacity?: number;
  label?: string;
}

/** One basic shape, drawn as a <g> so it can be composed with siblings inside
 *  a shared <svg> (see ShapeCanvas and the composite helpers in ComposingShapes.tsx). */
export function ShapeTile({ kind, cx = 0, cy = 0, size = 40, rotation = 0, color, opacity = 1, label }: ShapeTileProps) {
  const fill = color ?? palette.a;
  const o = outline(kind, size);
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotation})`} opacity={opacity}>
      {o.points ? (
        <polygon points={o.points} style={{ fill, stroke: palette.ink, strokeWidth: 2.5 }} aria-label={label} />
      ) : (
        <path d={o.path} style={{ fill, stroke: palette.ink, strokeWidth: 2.5 }} aria-label={label} />
      )}
    </g>
  );
}

/** Standalone sized SVG canvas wrapping one or more ShapeTiles/paths — every
 *  Unit 1/2 diagram in this lab uses this instead of hand-rolling its own
 *  <svg>, the same role ShapeCanvas's bounding box plays for FactorRectangle. */
export function ShapeCanvas({ width = 120, height = 120, children, label }: { width?: number; height?: number; children: ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={label}>
      {children}
    </svg>
  );
}
