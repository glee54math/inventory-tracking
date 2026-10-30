import type { ReactNode } from "react";
import { palette } from "../../../shared/lib/palette";

// ============================================================================
// Basic quadrilateral + distractor tiles for Units 1-2. Checked shared/
// diagrams/ and MK4/MG4's own diagrams first (per this build's guardrails) —
// MG4/ShapesAndFractionsIntroLab's ShapeTile.tsx is the closest precedent
// (same "outline() keyed by kind, centered at origin, rotate via transform"
// technique, reused here) but its shape set has no rhombus/trapezoid/
// generic-irregular-quadrilateral kinds, so this is a new, lab-local sibling,
// not a duplicate. SHAPE classification for Units 1-2 (is this kind a
// quadrilateral? what's its short defining description?) is a plain lookup
// table below, NOT computed from the rendered points — every Unit 1/2
// generator already knows which named `kind` it asked for, so there's
// nothing to derive at runtime here (contrast with Unit 2's QuadBuilder,
// which DOES need real geometric classification because the student there
// drags arbitrary vertices rather than picking from a fixed kind list).
// ============================================================================

export type QuadKind = "square" | "rectangle" | "rhombus" | "genericQuad" | "trapezoidLike" | "triangle" | "pentagon" | "circle";

export const QUAD_NAMES: Record<QuadKind, string> = {
  square: "square",
  rectangle: "rectangle",
  rhombus: "rhombus",
  genericQuad: "quadrilateral",
  trapezoidLike: "quadrilateral",
  triangle: "triangle",
  pentagon: "pentagon",
  circle: "circle",
};

/** Is this kind a quadrilateral at all? The baseline Unit 1 fact everything
 *  else builds on. */
export const IS_QUADRILATERAL: Record<QuadKind, boolean> = {
  square: true,
  rectangle: true,
  rhombus: true,
  genericQuad: true,
  trapezoidLike: true,
  triangle: false,
  pentagon: false,
  circle: false,
};

/** Is this kind one of the 3 NAMED subcategories (square/rectangle/rhombus)
 *  Unit 2 asks students to draw OUTSIDE of? A square counts as both a
 *  rectangle and a rhombus (the one-directional hierarchy Unit 1 teaches),
 *  so it's true here too, even though it's also its own kind. */
export const IS_NAMED_SUBCATEGORY: Record<QuadKind, boolean> = {
  square: true,
  rectangle: true,
  rhombus: true,
  genericQuad: false,
  trapezoidLike: false,
  triangle: false,
  pentagon: false,
  circle: false,
};

/** Short, kid-facing description of what makes each kind that shape (or, for
 *  the two generic kinds, what it DOESN'T require). Unit 1/2's Explore
 *  readouts, CFU wording, Practice prompts/explanations, and Test banks all
 *  pull from this one table so the wording never drifts between them. */
export const SHAPE_DESCRIPTION: Record<QuadKind, string> = {
  square: "4 equal-length straight sides AND 4 right (square-corner) angles",
  rectangle: "4 straight sides and 4 right angles (2 long sides, 2 short sides — they don't have to be equal to each other)",
  rhombus: "4 equal-length straight sides (the corners don't have to be square corners)",
  genericQuad: "4 straight sides forming a closed shape — no requirement that any sides be equal or any corners be square",
  trapezoidLike: "4 straight sides, with one pair of sides running the same direction (parallel)",
  triangle: "3 straight sides",
  pentagon: "5 straight sides",
  circle: "one round, curved edge — no straight sides and no corners",
};

export interface QuadTileProps {
  kind: QuadKind;
  cx?: number;
  cy?: number;
  /** Half-size in px — the overall scale. */
  size?: number;
  /** Degrees — rotating a quadrilateral never changes what kind it is. */
  rotation?: number;
  color?: string;
  opacity?: number;
  label?: string;
  /** Rhombus only: ratio of the two diagonals. 1 would look like a square
   *  (right angles) — kept away from 1 by every caller so a rendered rhombus
   *  always reads as visibly slanted, never square-looking. */
  rhombusRatio?: number;
  /** Rectangle only: width/height ratio. Kept away from 1 by every caller so
   *  a rendered rectangle never looks square. */
  rectAspect?: number;
  /** genericQuad only: 4 independent radius multipliers (one per vertex, at
   *  fixed 90-degree-apart base angles) — the source of its irregularity.
   *  Four different values make every side a different length and every
   *  corner a non-right angle generically, with no two sides forced equal. */
  quadRadii?: [number, number, number, number];
  /** trapezoidLike only: half-lengths of the two parallel (top/bottom)
   *  sides, kept different by every caller so the shape isn't a rectangle,
   *  plus a horizontal shift so it isn't a mirror-symmetric isosceles trapezoid
   *  (that symmetry isn't wrong, it's just less visually "generic"). */
  trapTopHalf?: number;
  trapBottomHalf?: number;
  trapShift?: number;
}

function outline(kind: QuadKind, s: number, p: QuadTileProps): { points?: string; path?: string } {
  switch (kind) {
    case "square":
      return { points: `${-s},${-s} ${s},${-s} ${s},${s} ${-s},${s}` };
    case "rectangle": {
      const aspect = p.rectAspect ?? 1.9;
      const w = s * Math.sqrt(aspect);
      const h = s / Math.sqrt(aspect);
      return { points: `${-w},${-h} ${w},${-h} ${w},${h} ${-w},${h}` };
    }
    case "rhombus": {
      const ratio = p.rhombusRatio ?? 1.8;
      const q = s;
      const d = s * ratio;
      return { points: `0,${-q} ${d},0 0,${q} ${-d},0` };
    }
    case "genericQuad": {
      const radii = p.quadRadii ?? [0.95, 0.6, 1.1, 0.75];
      const angles = [-90, 5, 95, 195];
      const pts = angles.map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const r = s * radii[i];
        return `${(r * Math.cos(rad)).toFixed(2)},${(r * Math.sin(rad)).toFixed(2)}`;
      });
      return { points: pts.join(" ") };
    }
    case "trapezoidLike": {
      const a = p.trapTopHalf ?? s * 0.5;
      const b = p.trapBottomHalf ?? s * 0.95;
      const shift = p.trapShift ?? s * 0.18;
      const h = s * 0.62;
      return { points: `${shift - a},${-h} ${shift + a},${-h} ${b},${h} ${-b},${h}` };
    }
    case "triangle":
      return { points: `0,${-s} ${-s * 0.87},${s * 0.55} ${s * 0.87},${s * 0.55}` };
    case "pentagon": {
      const pts = Array.from({ length: 5 }, (_, i) => {
        const a = -90 + i * 72;
        const rad = (a * Math.PI) / 180;
        return `${(s * Math.cos(rad)).toFixed(2)},${(s * Math.sin(rad)).toFixed(2)}`;
      });
      return { points: pts.join(" ") };
    }
    case "circle":
      return { path: `M ${-s} 0 A ${s} ${s} 0 1 0 ${s} 0 A ${s} ${s} 0 1 0 ${-s} 0 Z` };
  }
}

/** One quadrilateral/distractor tile, drawn as a <g> so it can be composed
 *  with siblings inside a shared <svg> (see QuadCanvas). */
export function QuadTile(p: QuadTileProps) {
  const { kind, cx = 0, cy = 0, size = 40, rotation = 0, color, opacity = 1, label } = p;
  const fill = color ?? palette.a;
  const o = outline(kind, size, p);
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

/** Standalone sized SVG canvas wrapping one or more QuadTiles — same role as
 *  MG4/ShapeTile.tsx's ShapeCanvas. */
export function QuadCanvas({ width = 120, height = 120, children, label }: { width?: number; height?: number; children: ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/** A deliberately plain, deterministic palette of fill colors distinct from
 *  the qa/qb/qc quantity-coding palette — used wherever many shapes are shown
 *  side-by-side (sort galleries, identify-the-non-example galleries) and the
 *  color itself must read as "just decoration," matching MG4/ShapeTile's own
 *  SHAPE_COLORS convention. */
export const SHAPE_COLORS = ["#d64545", "#3157d5", "#4c8c2b", "#8a4fd8", "#e39a1e", "#2a9d9d"] as const;
export const SHAPE_COLOR_NAMES = ["red", "blue", "green", "purple", "orange", "teal"] as const;
