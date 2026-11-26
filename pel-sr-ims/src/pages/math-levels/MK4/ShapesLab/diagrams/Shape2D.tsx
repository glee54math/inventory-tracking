import { useState } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { useCountAlong } from "./countAlong";

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

/**
 * How a triangle is drawn (other shapes ignore it). "plain" is the lab's
 * usual triangle; "equal" has all sides the same (review C1-25: a "Yes"
 * triangle for "are all the sides the same?"); "thin" is long and thin, so
 * its sides are plainly not the same (the "No" triangle a K student can see).
 */
export type TriangleVariant = "plain" | "equal" | "thin";

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

export const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/**
 * The outline's vertex points for a straight-sided shape, in order around
 * the perimeter (so consecutive points, wrapping, are exactly its sides).
 * `size` is roughly the shape's half-width. A non-square rectangle and the
 * plain triangle are deliberately NOT regular (Unit 3's "are the sides the
 * same" bucket needs visibly unequal-sided shapes).
 */
export function shapeOutline(kind: BuildableKind, size = 70, cx = 100, cy = 100, variant: TriangleVariant = "plain"): [number, number][] {
  if (kind === "triangle") {
    if (variant === "equal") {
      // Equilateral, centered on its middle.
      const r = size * 1.02;
      return [0, 1, 2].map((i) => {
        const a = ((-90 + 120 * i) * Math.PI) / 180;
        return [cx + r * Math.cos(a), cy + r * Math.sin(a) + r * 0.15] as [number, number];
      });
    }
    if (variant === "thin") {
      // Long and thin: one short side and two long ones.
      return [
        [cx - size * 1.1, cy + size * 0.42],
        [cx + size * 1.1, cy + size * 0.1],
        [cx - size * 0.75, cy - size * 0.32],
      ];
    }
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

/** Turn points `deg` degrees around (cx, cy). */
export function rotatePts(pts: [number, number][], deg: number, cx = 100, cy = 100): [number, number][] {
  if (!deg) return pts;
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
}

/** The farthest a shape's outline reaches from its center (any turn). */
const reach = (kind: ShapeKind, size: number, variant: TriangleVariant) =>
  kind === "circle" ? size : Math.max(...shapeOutline(kind, size, 0, 0, variant).map(([x, y]) => Math.hypot(x, y)));

/** Largest distance from the center any shape may reach in the 200 × 200
 *  picture (review C1-18: the big rectangle was cut off at the edge). */
export const MAX_REACH = 90;

/** The drawn size after the edge cap: `size × scale`, shrunk if needed so
 *  the shape stays inside the picture at every turn. */
export function fitSize(kind: ShapeKind, size: number, scale = 1, variant: TriangleVariant = "plain"): number {
  const want = size * scale;
  const r = reach(kind, want, variant);
  return r > MAX_REACH ? (want * MAX_REACH) / r : want;
}

/**
 * Whether a shape's own sides all measure the same length — computed from
 * shapeOutline()'s own points (never a hand-typed table), so Unit 3's
 * "are the sides the same" bucket and its picture can never disagree.
 */
export function sidesLookEqual(kind: BuildableKind, variant: TriangleVariant = "plain"): boolean {
  const lengths = sideLengths(kind, 70, variant);
  const min = Math.min(...lengths);
  const max = Math.max(...lengths);
  return max - min < min * 0.05;
}

/** Each side's length, in order (side i joins corner i to corner i + 1). */
export function sideLengths(kind: BuildableKind, size = 70, variant: TriangleVariant = "plain"): number[] {
  const pts = shapeOutline(kind, size, 100, 100, variant);
  const n = pts.length;
  return pts.map((p, i) => {
    const [x2, y2] = pts[(i + 1) % n];
    return Math.hypot(x2 - p[0], y2 - p[1]);
  });
}

/** A number label just outside a point, pushed away from the center. */
const outside = (x: number, y: number, by: number, cx = 100, cy = 100): [number, number] => {
  const d = Math.hypot(x - cx, y - cy) || 1;
  return [x + ((x - cx) / d) * by, y + ((y - cy) / d) * by];
};

export interface ShapeGlyphProps {
  kind: ShapeKind;
  /** Base half-size in SVG user units (viewBox is always 0 0 200 200). */
  size?: number;
  /** Extra uniform scale on top of `size` (the "bigger / smaller" pictures).
   *  Capped so the shape always stays inside the picture (fitSize). */
  scale?: number;
  /** Degrees, turned around the shape's own center. */
  rotation?: number;
  tone?: "a" | "b" | "c";
  /** Triangle drawing (see TriangleVariant). */
  variant?: TriangleVariant;
  /** A soft, light fill instead of the full color (Unit 2: a flat shape need
   *  not be a flat color, review C1-23). */
  soft?: boolean;
  /** Deliberately generic — never names the shape. */
  label?: string;
  /** Help: a dot on every corner (no numbers). */
  cornerDots?: boolean;
  /** Help: number the corners 1, 2, 3… one per beat, in step with the voice. */
  countCorners?: boolean;
  /** Help for a circle: a dot runs around the edge (it never meets a corner). */
  traceDot?: boolean;
  /** "Show me" for a circle: a big 0 in the middle (only after help is asked for). */
  bigZero?: boolean;
  /** "Show me": a turned shape turns back to straight and stays there; a
   *  resized one goes back to the usual size; a circle grows and shrinks. */
  turnDemo?: boolean;
}

/** How long ShapeGlyph's turnDemo takes, for Step.showMeHoldMs. */
export const TURN_DEMO_MS = 2400;

/** A turn between -180 and 180, so the turn-back goes the short way. */
const shortTurn = (deg: number) => {
  const d = ((deg % 360) + 360) % 360;
  return d > 180 ? d - 360 : d;
};

/** A single flat shape, optionally turned/resized — the picture behind every
 *  "name the shape" question. A turned or resized shape is still drawn as the
 *  SAME polygon, never a different one. */
export function ShapeGlyph({
  kind,
  size = 56,
  scale = 1,
  rotation = 0,
  tone = "a",
  variant = "plain",
  soft = false,
  label = "a shape",
  cornerDots = false,
  countCorners = false,
  traceDot = false,
  bigZero = false,
  turnDemo = false,
}: ShapeGlyphProps) {
  const cx = 100;
  const cy = 100;
  const color = toneColor(tone);
  const fillProps = soft ? { fill: color, fillOpacity: 0.32 } : { fill: color };
  const common = { style: { display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont } };
  const drawn = fitSize(kind, size, scale, variant);
  const turn = shortTurn(rotation);
  const corners = kind === "circle" ? [] : rotatePts(shapeOutline(kind, drawn, cx, cy, variant), turn, cx, cy);
  const shown = useCountAlong(countCorners && corners.length > 0, corners.length);

  // "Show me" motion: turn back to straight (or back to the usual size) and hold.
  let anim: { name: string; css: string; hold: boolean } | null = null;
  if (turnDemo) {
    if (kind !== "circle" && Math.abs(turn) > 1) {
      const name = `mk4-turnback-${Math.round(turn + 360)}`;
      anim = { name, css: `@keyframes ${name} { from { transform: rotate(0deg); } to { transform: rotate(${-turn}deg); } }`, hold: true };
    } else if (Math.abs(drawn - size) > 2) {
      const k = (size / drawn).toFixed(3);
      const name = `mk4-resize-${k.replace(".", "_")}`;
      anim = { name, css: `@keyframes ${name} { from { transform: scale(1); } to { transform: scale(${k}); } }`, hold: true };
    } else {
      anim = { name: "mk4-pulse", css: "@keyframes mk4-pulse { 0%, 100% { transform: scale(1); } 30% { transform: scale(0.6); } 70% { transform: scale(1.2); } }", hold: false };
    }
  }
  const animStyle = anim
    ? { transformOrigin: "100px 100px", transformBox: "view-box" as const, animation: `${anim.name} ${TURN_DEMO_MS}ms ease-in-out 1${anim.hold ? " forwards" : ""}` }
    : undefined;

  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} {...common}>
      {anim && <style>{anim.css}</style>}
      <g style={animStyle}>
        {kind === "circle" ? (
          <circle cx={cx} cy={cy} r={drawn} {...fillProps} stroke={palette.ink} strokeWidth={3} />
        ) : (
          <polygon points={corners.map((p) => p.join(",")).join(" ")} {...fillProps} stroke={palette.ink} strokeWidth={3} />
        )}
        {(cornerDots || countCorners) &&
          corners.map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r={i < shown ? 10 : 7} fill={i < shown ? palette.c : palette.ink} stroke={palette.paper} strokeWidth={2} />)}
        {corners.slice(0, shown).map(([x, y], i) => {
          const [lx, ly] = outside(x, y, 20);
          return (
            <text key={`n${i}`} x={lx} y={ly + 6} textAnchor="middle" fontSize={18} fontWeight={700} fill={palette.ink}>
              {i + 1}
            </text>
          );
        })}
      </g>
      {kind === "circle" && traceDot && (
        <circle r={9} fill={palette.c} stroke={palette.ink} strokeWidth={2}>
          <animateMotion dur="2.4s" repeatCount="2" path={`M ${cx + drawn} ${cy} A ${drawn} ${drawn} 0 1 1 ${cx - drawn} ${cy} A ${drawn} ${drawn} 0 1 1 ${cx + drawn} ${cy}`} />
        </circle>
      )}
      {kind === "circle" && bigZero && (
        <text x={cx} y={cy + 22} textAnchor="middle" fontSize={64} fontWeight={800} fill={palette.ink}>
          0
        </text>
      )}
    </svg>
  );
}

/**
 * A straight-sided shape whose sides and corners can be counted. Three ways:
 * - Explore passes `countedSides`/`countedCorners` + toggles (controlled).
 * - CFU and Practice pass `tapWhat`: each tapped side (or corner) gets the
 *   next number, like MK1's tapToCount (review C1-28: "put your finger on…"
 *   hints need a picture that answers touch).
 * - "Show me" passes `countAlong`: they light up and number one per beat.
 */
export function ShapeCountable({
  kind,
  size = 62,
  rotation = 0,
  variant = "plain",
  tone = "a",
  countedCorners = [],
  countedSides = [],
  onToggleCorner,
  onToggleSide,
  tapWhat,
  countAlong,
  countAlongStartAfter = 0,
  onTapCount,
  startHere = false,
  label = "a shape you can count",
}: {
  kind: BuildableKind;
  size?: number;
  rotation?: number;
  variant?: TriangleVariant;
  tone?: "a" | "b" | "c";
  countedCorners?: number[];
  countedSides?: number[];
  onToggleCorner?: (i: number) => void;
  onToggleSide?: (i: number) => void;
  /** Tap to number the sides (or corners) in the order tapped. */
  tapWhat?: "sides" | "corners";
  /** "Show me" demo: light up and number the sides (or corners) one at a
   *  time, in step with the spoken count (see countAlong.ts). */
  countAlong?: "sides" | "corners";
  /** Counting beats to wait before this shape's count-along starts. */
  countAlongStartAfter?: number;
  /** With `tapWhat`: called with how many are numbered after each new tap. */
  onTapCount?: (n: number) => void;
  /** Help: light the first side (or corner) as a place to start, no number. */
  startHere?: boolean;
  label?: string;
}) {
  const cx = 100;
  const cy = 100;
  const color = toneColor(tone);
  const pts = rotatePts(shapeOutline(kind, fitSize(kind, size, 1, variant), cx, cy, variant), rotation, cx, cy);
  const n = pts.length;
  const shown = useCountAlong(!!countAlong, n, countAlongStartAfter);
  const [tapped, setTapped] = useState<number[]>([]);
  const tap = (i: number) => {
    if (tapped.includes(i)) return;
    setTapped([...tapped, i]);
    onTapCount?.(tapped.length + 1);
  };
  const upTo = Array.from({ length: shown }, (_, i) => i);
  // Which items are lit, and the number each one shows (by index), for each mode.
  const order = countAlong ? upTo : tapWhat ? tapped : [];
  const what = countAlong ?? tapWhat;
  const start = startHere && order.length === 0 ? [0] : [];
  const sidesOn = what === "sides" ? [...order, ...start] : countedSides;
  const cornersOn = what === "corners" ? [...order, ...start] : countedCorners;
  const onSide = tapWhat === "sides" ? tap : onToggleSide;
  const onCorner = tapWhat === "corners" ? tap : onToggleCorner;
  const labels = order.map((i, k) => {
    const [x, y] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    const [lx, ly] = what === "sides" ? outside((x + x2) / 2, (y + y2) / 2, 17) : outside(x, y, 20);
    return (
      <text key={`n${i}`} x={lx} y={ly + 6} textAnchor="middle" fontSize={18} fontWeight={700} fill={palette.ink} pointerEvents="none">
        {k + 1}
      </text>
    );
  });
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} style={{ display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont }}>
      {pts.map(([x, y], i) => {
        const [x2, y2] = pts[(i + 1) % n];
        const sideOn = sidesOn.includes(i);
        return (
          <g key={`s${i}`} style={onSide ? { cursor: "pointer" } : undefined} onClick={onSide ? () => onSide(i) : undefined}>
            <line x1={x} y1={y} x2={x2} y2={y2} stroke={sideOn ? color : palette.ink} strokeWidth={sideOn ? 9 : 3} strokeLinecap="round" />
            {onSide && <line x1={x} y1={y} x2={x2} y2={y2} stroke="transparent" strokeWidth={24} />}
          </g>
        );
      })}
      {pts.map(([x, y], i) => {
        const cornerOn = cornersOn.includes(i);
        return (
          <g key={`c${i}`} style={onCorner ? { cursor: "pointer" } : undefined} onClick={onCorner ? () => onCorner(i) : undefined}>
            <circle cx={x} cy={y} r={cornerOn ? 11 : 7} fill={cornerOn ? palette.c : palette.ink} />
            {onCorner && <circle cx={x} cy={y} r={18} fill="transparent" />}
          </g>
        );
      })}
      {labels}
    </svg>
  );
}

/**
 * Help for "are all the sides the same?" (review C1-25): the shape's sides
 * laid out as sticks in rows, lined up at the left end, so a student can see
 * whether they come out the same. Optional numbers on the sticks for Show me.
 */
export function SideSticks({ kind, variant = "plain", tone = "a", numbered = false }: { kind: BuildableKind; variant?: TriangleVariant; tone?: "a" | "b" | "c"; numbered?: boolean }) {
  const lengths = sideLengths(kind, 70, variant);
  const longest = Math.max(...lengths);
  const color = toneColor(tone);
  const rowH = 26;
  const left = 30;
  const span = 160;
  const h = lengths.length * rowH + 20;
  return (
    <svg viewBox={`0 0 220 ${h}`} role="img" aria-label="the sides laid out in a row" style={{ display: "block", width: "100%", maxWidth: 220, height: "auto", fontFamily: diagramFont }}>
      <line x1={left} y1={6} x2={left} y2={h - 6} stroke={palette.muted} strokeWidth={2} strokeDasharray="4 4" />
      {lengths.map((len, i) => {
        const y = 16 + i * rowH;
        return (
          <g key={i}>
            <line x1={left} y1={y} x2={left + (len / longest) * span} y2={y} stroke={color} strokeWidth={9} strokeLinecap="round" />
            {numbered && (
              <text x={left - 12} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={700} fill={palette.ink}>
                {i + 1}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** A small copy of a shape at the start of a SideRows row, so each row is tied
 *  to its shape (review C3-01). An outline only, behind a dashed line, so it is
 *  never counted as one of the row's sticks or corner dots. */
function RowIcon({ kind, x, y, tone }: { kind: ShapeKind; x: number; y: number; tone: "a" | "b" | "c" }) {
  const look = { fill: "none", stroke: toneColor(tone), strokeWidth: 3, strokeLinejoin: "round" as const };
  if (kind === "circle") return <circle cx={x} cy={y} r={12} {...look} />;
  const pts = shapeOutline(kind, fitSize(kind, 15), x, y);
  return <polygon points={pts.map((p) => p.join(",")).join(" ")} {...look} />;
}

/**
 * Two shapes' sides as rows of sticks, lined up one under the other, so the
 * extra sticks stick out (Unit 3 "how many extra?"). `ring` circles the
 * extras (help, no number); `numberExtras` numbers them (Show me only).
 * Each stick is drawn apart from the next with a clear gap, so the sticks can
 * be counted one by one (review C3-01: with round ends they ran together into
 * one bar). With `kind`, a small copy of the shape starts its row.
 */
export function SideRows({ a, b, ring = false, numberExtras = false, dots = false }: { a: { sides: number; tone: "a" | "b" | "c"; kind?: ShapeKind }; b: { sides: number; tone: "a" | "b" | "c"; kind?: ShapeKind }; ring?: boolean; numberExtras?: boolean; /** Corners as dots instead of sides as sticks. */ dots?: boolean }) {
  const stick = 24;
  const gap = 10;
  const thick = 9;
  const icons = !!(a.kind || b.kind);
  const left = icons ? 46 : 10;
  const rows = [a, b];
  const fewer = Math.min(a.sides, b.sides);
  // Room for 6 sticks (a hexagon), the most any shape has.
  const width = left + 6 * (stick + gap) + 4;
  return (
    <svg viewBox={`0 0 ${width} 104`} role="img" aria-label={dots ? "the corners of both shapes in two rows" : "the sides of both shapes in two rows"} style={{ display: "block", width: "100%", maxWidth: 280, height: "auto", fontFamily: diagramFont }}>
      {rows.map((r, ri) => {
        const y = 22 + ri * 44;
        return (
          <g key={ri}>
            {r.kind && (
              <>
                <RowIcon kind={r.kind} x={20} y={y} tone={r.tone} />
                <line x1={left - 7} y1={y - 15} x2={left - 7} y2={y + 15} stroke={palette.muted} strokeWidth={2} strokeDasharray="3 3" />
              </>
            )}
            {Array.from({ length: r.sides }, (_, i) => {
              const x = left + i * (stick + gap);
              const extra = i >= fewer;
              return (
                <g key={i}>
                  {/* Round ends drawn inside the stick's own length, so the gap stays a gap. */}
                  {dots ? <circle cx={x + stick / 2} cy={y} r={9} fill={toneColor(r.tone)} stroke={palette.ink} strokeWidth={2} /> : <line x1={x + thick / 2} y1={y} x2={x + stick - thick / 2} y2={y} stroke={toneColor(r.tone)} strokeWidth={thick} strokeLinecap="round" />}
                  {extra && ring && <circle cx={x + stick / 2} cy={y} r={15} fill="none" stroke={palette.ink} strokeWidth={2} strokeDasharray="4 3" />}
                  {extra && numberExtras && (
                    <text x={x + stick / 2} y={y + 30} textAnchor="middle" fontSize={15} fontWeight={700} fill={palette.ink}>
                      {i - fewer + 1}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
