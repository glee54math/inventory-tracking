import { palette, diagramFont } from "../../../shared/lib/palette";

/** The five flat (2D) shapes this whole lab is built around — the fixed
 *  vocabulary set Unit 1 introduces and Units 2-4 keep reusing. */
export type ShapeKind = "square" | "rectangle" | "circle" | "triangle" | "hexagon";
export const SHAPE_KINDS: ShapeKind[] = ["square", "rectangle", "circle", "triangle", "hexagon"];
export const SHAPE_LABELS: Record<ShapeKind, string> = {
  square: "Square",
  rectangle: "Rectangle",
  circle: "Circle",
  triangle: "Triangle",
  hexagon: "Hexagon",
};

/** The subset of shapes with straight sides a student can actually build out
 *  of stick pieces (Unit 4) — circle is excluded (0 sides, nothing to build). */
export type BuildableKind = "square" | "rectangle" | "triangle" | "hexagon";
export const BUILDABLE_KINDS: BuildableKind[] = ["square", "rectangle", "triangle", "hexagon"];

export interface ShapeAttributes {
  sides: number;
  corners: number;
}

/**
 * Single source of truth for side/corner counts — used by BOTH Unit 3's
 * diagram labeling AND its generated problems'/test's graded answers, so a
 * count question and what the picture actually shows can never disagree
 * (see MATH_TSX_STYLE_GUIDE.txt's "one function shared by diagram and
 * step-checking logic" rule).
 */
export function shapeAttributes(kind: ShapeKind): ShapeAttributes {
  if (kind === "circle") return { sides: 0, corners: 0 };
  if (kind === "triangle") return { sides: 3, corners: 3 };
  if (kind === "hexagon") return { sides: 6, corners: 6 };
  return { sides: 4, corners: 4 }; // square, rectangle
}

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/**
 * The outline's vertex points for a straight-sided shape, in order around
 * the perimeter (so consecutive points, wrapping, are exactly its sides) —
 * empty for "circle", which has no vertices. `size` is roughly the shape's
 * half-width; every BuildableKind is drawn to read as a genuinely different
 * shape at the same `size`, not just a uniformly-scaled regular polygon,
 * since a non-square rectangle and a scalene-looking triangle are
 * deliberately NOT regular (Unit 3's "do the sides look equal" bucket needs
 * a visibly unequal-sided shape to contrast against the square).
 */
export function shapeOutline(kind: BuildableKind, size = 70, cx = 100, cy = 100): [number, number][] {
  if (kind === "triangle") {
    // A visibly scalene-ish (not equilateral) triangle, so "do the sides
    // look the same length" has a genuine "no" example to show, same as
    // rectangle's role for squares.
    return [
      [cx, cy - size * 1.05],
      [cx + size * 0.95, cy + size * 0.65],
      [cx - size * 0.65, cy + size * 0.75],
    ];
  }
  if (kind === "square") {
    const h = size * 0.82;
    return [
      [cx - h, cy - h],
      [cx + h, cy - h],
      [cx + h, cy + h],
      [cx - h, cy + h],
    ];
  }
  if (kind === "rectangle") {
    const w = size * 1.15;
    const h = size * 0.62;
    return [
      [cx - w, cy - h],
      [cx + w, cy - h],
      [cx + w, cy + h],
      [cx - w, cy + h],
    ];
  }
  // hexagon: regular, flat-topped
  const pts: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = ((60 * i) * Math.PI) / 180;
    pts.push([cx + size * Math.cos(a), cy + size * Math.sin(a)]);
  }
  return pts;
}

/**
 * Whether a shape's own sides all measure the same length — computed
 * directly from shapeOutline()'s own points (never a separately hand-typed
 * true/false table), so Unit 3's "do the sides look equal" bucket and its
 * diagram can never disagree about which shapes qualify. Scale-independent
 * (a tolerance relative to the shortest side), so it stays correct for any
 * `size` shapeOutline is called with.
 */
export function sidesLookEqual(kind: BuildableKind): boolean {
  const pts = shapeOutline(kind, 70);
  const n = pts.length;
  const lengths = pts.map((p, i) => {
    const [x2, y2] = pts[(i + 1) % n];
    return Math.hypot(x2 - p[0], y2 - p[1]);
  });
  const min = Math.min(...lengths);
  const max = Math.max(...lengths);
  return max - min < min * 0.05;
}

export interface ShapeGlyphProps {
  kind: ShapeKind;
  /** Base half-size in SVG user units (viewBox is always 0 0 200 200). */
  size?: number;
  /** Extra uniform scale on top of `size` — used by the "resized" bucket so
   *  the SAME shape can appear visibly smaller/larger without a different
   *  `kind`. */
  scale?: number;
  /** Degrees, applied around the shape's own center — used by the "rotated"
   *  bucket (e.g. 45deg on a square, the classic "looks like a diamond" case). */
  rotation?: number;
  tone?: "a" | "b" | "c";
  /** Deliberately generic — never names the shape, so sighted vs
   *  screen-reader students face the same recognition task. */
  label?: string;
}

/** A single flat shape, optionally rotated/resized — the concrete visual
 *  every Unit 1 "name the shape" question and Explore's gallery is built on,
 *  so a rotated/resized instance is still unmistakably drawn as the SAME
 *  polygon, never a different one. */
export function ShapeGlyph({ kind, size = 62, scale = 1, rotation = 0, tone = "a", label = "a shape" }: ShapeGlyphProps) {
  const cx = 100;
  const cy = 100;
  const color = toneColor(tone);
  const common = { style: { display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont } };
  if (kind === "circle") {
    return (
      <svg viewBox="0 0 200 200" role="img" aria-label={label} {...common}>
        <circle cx={cx} cy={cy} r={size * scale} fill={color} stroke={palette.ink} strokeWidth={3} />
      </svg>
    );
  }
  const pts = shapeOutline(kind, size * scale, cx, cy);
  const pointsAttr = pts.map((p) => p.join(",")).join(" ");
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} {...common}>
      <polygon points={pointsAttr} fill={color} stroke={palette.ink} strokeWidth={3} transform={`rotate(${rotation} ${cx} ${cy})`} />
    </svg>
  );
}

/** Marks every vertex/corner of a shape with a small dot, and (optionally)
 *  highlights one side at a time — the click-to-count interaction Unit 3's
 *  Explore uses, same "click each one exactly once" spirit as MK1's
 *  CounterGroup, applied to a polygon's own sides/corners instead of a group
 *  of separate objects. */
export function ShapeCountable({
  kind,
  size = 62,
  tone = "a",
  countedCorners = [],
  countedSides = [],
  onToggleCorner,
  onToggleSide,
}: {
  kind: BuildableKind;
  size?: number;
  tone?: "a" | "b" | "c";
  countedCorners?: number[];
  countedSides?: number[];
  onToggleCorner?: (i: number) => void;
  onToggleSide?: (i: number) => void;
}) {
  const cx = 100;
  const cy = 100;
  const color = toneColor(tone);
  const pts = shapeOutline(kind, size, cx, cy);
  const n = pts.length;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="a shape with clickable sides and corners" style={{ display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont }}>
      {pts.map(([x, y], i) => {
        const [x2, y2] = pts[(i + 1) % n];
        const sideOn = countedSides.includes(i);
        return (
          <line
            key={`s${i}`}
            x1={x}
            y1={y}
            x2={x2}
            y2={y2}
            stroke={sideOn ? color : palette.ink}
            strokeWidth={sideOn ? 9 : 3}
            style={onToggleSide ? { cursor: "pointer" } : undefined}
            onClick={onToggleSide ? () => onToggleSide(i) : undefined}
          />
        );
      })}
      {pts.map(([x, y], i) => {
        const cornerOn = countedCorners.includes(i);
        return (
          <circle
            key={`c${i}`}
            cx={x}
            cy={y}
            r={cornerOn ? 11 : 7}
            fill={cornerOn ? palette.c : palette.ink}
            style={onToggleCorner ? { cursor: "pointer" } : undefined}
            onClick={onToggleCorner ? () => onToggleCorner(i) : undefined}
          />
        );
      })}
    </svg>
  );
}
