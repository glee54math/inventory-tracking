import { useEffect, useRef, useState } from "react";
import type React from "react";
import { palette } from "../../../shared/lib/palette";

// ============================================================================
// Direct-manipulation 4-vertex quadrilateral builder for Unit 2 (Drawing
// Quadrilaterals Outside the Named Subcategories) — the "draw/build a
// four-sided shape" standard's own constructive demand, distinct from Unit
// 1's recognize-a-fixed-shape task. Checked shared/diagrams/ and MK4's own
// StickBuilder/CubeFrameBuilder (the closest existing draggable-vertex
// precedent) first, per this build's guardrails: those build toward ONE
// fixed target shape by clicking edges on/off, never free 2-D vertex
// dragging, so this is a new, lab-local component, not a duplicate.
//
// Vertices snap to an integer grid (0..GRID inclusive on each axis), which
// is deliberate: it lets classifyQuad() below do every geometric check
// (equal sides, right angles, parallel sides, self-intersection) with EXACT
// integer arithmetic (squared lengths, dot/cross products) instead of a
// fuzzy float tolerance that could misclassify a borderline drag. The same
// classifyQuad() call drives BOTH the live on-screen checklist (render path)
// and whether a Practice CustomStep's onDone fires (checking logic) — one
// function, so the picture and the grading can never disagree.
// ============================================================================

const GRID = 10;
const CELL = 26;
const PAD = 18;
const SIZE = PAD * 2 + GRID * CELL;

export type Point = [number, number];

export interface QuadMetrics {
  /** 4 squared side lengths, in grid-unit^2 (exact integers). */
  sideSq: [number, number, number, number];
  /** How many of the 4 interior angles are exact right angles. */
  rightAngleCount: number;
  /** True when ALL 4 sides are the same length (a rhombus, including a square). */
  allSidesEqual: boolean;
  /** True when at least one pair of OPPOSITE sides is parallel. */
  hasParallelPair: boolean;
  /** Non-self-intersecting (the two pairs of opposite sides don't cross) AND
   *  no 3 consecutive vertices collinear (no degenerate "triangle in disguise"). */
  isSimple: boolean;
}

const sub = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
const dot = (a: Point, b: Point) => a[0] * b[0] + a[1] * b[1];
const cross = (a: Point, b: Point) => a[0] * b[1] - a[1] * b[0];
const sqLen = (v: Point) => dot(v, v);

/** Standard orientation-based test for whether open segments p1p2 and p3p4
 *  cross (shared-endpoint touches don't count — only non-adjacent sides of
 *  the quadrilateral are ever tested against each other). */
function segmentsCross(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
  const d1 = cross(sub(p4, p3), sub(p1, p3));
  const d2 = cross(sub(p4, p3), sub(p2, p3));
  const d3 = cross(sub(p2, p1), sub(p3, p1));
  const d4 = cross(sub(p2, p1), sub(p4, p1));
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
  return false; // collinear/touching edge cases are treated as "not crossing" — vertices never coincide (dragging is clamped) so this is safe here.
}

/** The one function shared by QuadBuilder's live checklist AND whatever
 *  caller (Practice's CustomStep) decides whether the current shape
 *  satisfies its requirement. */
export function classifyQuad(points: [Point, Point, Point, Point]): QuadMetrics {
  const [a, b, c, d] = points;
  const sides: [Point, Point, Point, Point] = [sub(b, a), sub(c, b), sub(d, c), sub(a, d)];
  const sideSq = sides.map(sqLen) as [number, number, number, number];

  let rightAngleCount = 0;
  for (let i = 0; i < 4; i++) {
    // Angle at vertex i is between the incoming side (sides[(i+3)%4]) and the
    // outgoing side (sides[i]); perpendicular <=> dot product is exactly 0.
    const incoming = sides[(i + 3) % 4];
    const outgoing = sides[i];
    if (dot(incoming, outgoing) === 0 && sideSq[i] > 0 && sideSq[(i + 3) % 4] > 0) rightAngleCount++;
  }

  const allSidesEqual = sideSq.every((s) => s === sideSq[0]) && sideSq[0] > 0;
  const hasParallelPair = cross(sides[0], sides[2]) === 0 || cross(sides[1], sides[3]) === 0;

  const noZeroSide = sideSq.every((s) => s > 0);
  // Any vertex where the incoming and outgoing side vectors are collinear
  // (cross === 0) is degenerate — either a 180-degree "straight-through"
  // corner (3 points on one line, collapsing this into a triangle) or a
  // 0-degree "spike" (the path folds back on itself) — both invalid,
  // regardless of which direction the fold goes.
  const noCollinearVertex = [0, 1, 2, 3].every((i) => cross(sides[(i + 3) % 4], sides[i]) !== 0);
  const noCrossing = !segmentsCross(a, b, c, d) && !segmentsCross(b, c, d, a);
  const isSimple = noZeroSide && noCollinearVertex && noCrossing;

  return { sideSq, rightAngleCount, allSidesEqual, hasParallelPair, isSimple };
}

export const isRectangle = (m: QuadMetrics): boolean => m.isSimple && m.rightAngleCount === 4;
export const isRhombus = (m: QuadMetrics): boolean => m.isSimple && m.allSidesEqual;
export const isSquare = (m: QuadMetrics): boolean => isRectangle(m) && isRhombus(m);

export interface QuadRequirement {
  mustAvoidRectangle: boolean;
  mustAvoidRhombus: boolean;
  mustHaveParallelPair?: boolean;
  /** Unit 2's "irregular" bucket: not a single right angle anywhere. */
  mustHaveNoRightAngles?: boolean;
  /** Unit 2's "irregular" bucket: no two of the 4 sides the same length. */
  mustHaveNoEqualSides?: boolean;
}

/** True when any two of the 4 sides have exactly the same length. */
export const hasAnyEqualSides = (m: QuadMetrics): boolean => {
  const s = m.sideSq;
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (s[i] === s[j]) return true;
  return false;
};

export interface ChecklistItem {
  label: string;
  ok: boolean;
}

/** Turns a requirement + the shape's current metrics into the student-facing
 *  checklist — the SAME booleans used to decide pass/fail, just labeled. */
export function checklistFor(req: QuadRequirement, m: QuadMetrics): ChecklistItem[] {
  const items: ChecklistItem[] = [{ label: "Is a closed, 4-sided shape (no crossing sides)", ok: m.isSimple }];
  if (req.mustAvoidRectangle) items.push({ label: "Is NOT a rectangle (not all 4 corners are square corners)", ok: !isRectangle(m) });
  if (req.mustAvoidRhombus) items.push({ label: "Is NOT a rhombus (not all 4 sides equal length)", ok: !isRhombus(m) });
  if (req.mustHaveParallelPair) items.push({ label: "Has one pair of sides running the same direction (parallel)", ok: m.isSimple && m.hasParallelPair });
  if (req.mustHaveNoRightAngles) items.push({ label: "Has NO square corners at all", ok: m.rightAngleCount === 0 });
  if (req.mustHaveNoEqualSides) items.push({ label: "Has NO two sides the same length", ok: !hasAnyEqualSides(m) });
  return items;
}

/** Starts as a SQUARE on purpose: it fails every Unit 2 requirement (it's a
 *  rectangle AND a rhombus), so a Practice step can never be auto-completed
 *  before the student has actually moved a corner. */
export const SQUARE_START: [Point, Point, Point, Point] = [
  [2, 2],
  [8, 2],
  [8, 8],
  [2, 8],
];
const DEFAULT_START = SQUARE_START;

export interface QuadBuilderProps {
  requirement: QuadRequirement;
  /** Called every time validity (does the CURRENT shape satisfy every
   *  checklist item) changes — the caller decides what "valid" means for it
   *  (Explore just shows the checklist; Practice's CustomStep calls onDone
   *  the first time this fires true). */
  onValidChange?: (ok: boolean) => void;
  initial?: [Point, Point, Point, Point];
}

/** A 4-vertex quadrilateral the student drags into shape on an integer grid,
 *  with a live checklist of which requirements are currently met. Used as
 *  Unit 2's Explore sandbox (no requirement enforced beyond the baseline
 *  closed-shape check) and, with a specific requirement, as the interactive
 *  widget inside a Practice/Test CustomStep. */
export function QuadBuilder({ requirement, onValidChange, initial }: QuadBuilderProps) {
  const [points, setPoints] = useState<[Point, Point, Point, Point]>(initial ?? DEFAULT_START);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragIndex = useRef<number | null>(null);

  const metrics = classifyQuad(points);
  const checks = checklistFor(requirement, metrics);
  const allOk = checks.every((c) => c.ok);
  // Reported from an effect, never during render — calling a parent's
  // setState mid-render is a React error ("cannot update a component while
  // rendering a different component").
  useEffect(() => {
    onValidChange?.(allOk);
  }, [allOk, onValidChange]);

  const clientToGrid = (clientX: number, clientY: number): Point => {
    const svg = svgRef.current;
    if (!svg) return [0, 0];
    const rect = svg.getBoundingClientRect();
    const scaleX = SIZE / rect.width;
    const scaleY = SIZE / rect.height;
    const x = Math.round(((clientX - rect.left) * scaleX - PAD) / CELL);
    const y = Math.round(((clientY - rect.top) * scaleY - PAD) / CELL);
    return [Math.min(GRID, Math.max(0, x)), Math.min(GRID, Math.max(0, y))];
  };

  const startDrag = (i: number) => (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragIndex.current = i;
  };
  const onMove = (e: React.PointerEvent) => {
    const i = dragIndex.current;
    if (i === null) return;
    const [gx, gy] = clientToGrid(e.clientX, e.clientY);
    setPoints((prev) => {
      // Refuse a move that would land exactly on another vertex (zero-length
      // side) — simpler than letting it happen and explaining a degenerate
      // shape, and dragging one grid step away immediately un-sticks it.
      if (prev.some((p, k) => k !== i && p[0] === gx && p[1] === gy)) return prev;
      const next = [...prev] as [Point, Point, Point, Point];
      next[i] = [gx, gy];
      return next;
    });
  };
  const endDrag = () => {
    dragIndex.current = null;
  };

  const toPx = (p: Point) => [PAD + p[0] * CELL, PAD + p[1] * CELL];
  const polyPoints = points.map((p) => toPx(p).join(",")).join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        style={{ maxWidth: "100%", touchAction: "none" }}
        role="img"
        aria-label="A quadrilateral with 4 draggable corners on a grid"
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <rect x={PAD} y={PAD} width={GRID * CELL} height={GRID * CELL} fill="none" stroke={palette.grid} strokeWidth={1} />
        <polygon points={polyPoints} fill={metrics.isSimple ? palette.aSoft : palette.bSoft} stroke={palette.ink} strokeWidth={2.5} />
        {points.map((p, i) => {
          const [px, py] = toPx(p);
          return <circle key={i} cx={px} cy={py} r={12} fill={palette.paper} stroke={palette.a} strokeWidth={3} style={{ cursor: "grab", touchAction: "none" }} onPointerDown={startDrag(i)} />;
        })}
      </svg>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {checks.map((c, i) => (
          <li key={i} style={{ color: c.ok ? "var(--good)" : "var(--bad)", fontWeight: 600, fontSize: 14 }}>
            {c.ok ? "✓" : "✗"} {c.label}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="btn ghost"
        style={{ width: "fit-content" }}
        onClick={() => setPoints(initial ?? DEFAULT_START)}
      >
        Reset shape
      </button>
    </div>
  );
}
