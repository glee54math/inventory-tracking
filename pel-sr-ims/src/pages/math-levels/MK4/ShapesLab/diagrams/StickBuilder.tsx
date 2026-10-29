import { palette, diagramFont } from "../../../shared/lib/palette";
import { shapeOutline, type BuildableKind } from "./Shape2D";

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

export interface StickBuilderProps {
  kind: BuildableKind;
  size?: number;
  tone?: "a" | "b" | "c";
  /** Edge indices (edge i connects vertex i to vertex (i+1)%n) already
   *  placed as a stick, in any order — click-to-place, same "each one
   *  exactly once, order doesn't matter" spirit as MK1's CounterGroup. */
  placed: number[];
  onToggle?: (edgeIndex: number) => void;
}

/** Click-to-place stick-building sandbox: the shape's corners are already
 *  drawn (the "clay balls" holding it together), each side starts as a
 *  dashed gap a stick hasn't been placed in yet. Used by Unit 4's Explore
 *  and Practice (as a CustomStep widget). */
export function StickBuilder({ kind, size = 68, tone = "a", placed, onToggle }: StickBuilderProps) {
  const pts = shapeOutline(kind, size);
  const n = pts.length;
  const color = toneColor(tone);
  const interactive = !!onToggle;
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`a shape's corners with ${n} gaps to fill with sticks`}
      style={{ display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont }}
    >
      {pts.map(([x, y], i) => {
        const [x2, y2] = pts[(i + 1) % n];
        const done = placed.includes(i);
        return (
          <g key={i} style={interactive ? { cursor: "pointer" } : undefined} onClick={interactive ? () => onToggle!(i) : undefined}>
            <line
              x1={x}
              y1={y}
              x2={x2}
              y2={y2}
              stroke={done ? color : palette.line}
              strokeWidth={done ? 9 : 4}
              strokeDasharray={done ? undefined : "7 7"}
            />
            {interactive && <line x1={x} y1={y} x2={x2} y2={y2} stroke="transparent" strokeWidth={22} />}
          </g>
        );
      })}
      {pts.map(([x, y], i) => (
        <circle key={`v${i}`} cx={x} cy={y} r={7} fill={palette.ink} />
      ))}
    </svg>
  );
}

export interface StickSegment {
  from: [number, number];
  to: [number, number];
}

/** A static (non-interactive) picture of a finished OR deliberately flawed
 *  stick arrangement — for Test questions that ask "which picture correctly
 *  shows a {shape}" without needing the click interaction at all. `segments`
 *  is given explicitly (not derived from a BuildableKind) so a distractor can
 *  be a genuinely different arrangement: missing a stick (a gap), or two
 *  sticks crossed into a bowtie instead of a closed loop — not just a subset
 *  of the correct polygon's own edges. */
export function StickArrangementPreview({ segments, tone = "a" }: { segments: StickSegment[]; tone?: "a" | "b" | "c" }) {
  const color = toneColor(tone);
  const dots = new Map<string, [number, number]>();
  for (const seg of segments) {
    dots.set(seg.from.join(","), seg.from);
    dots.set(seg.to.join(","), seg.to);
  }
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="a picture of sticks joined together"
      style={{ display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont }}
    >
      {segments.map((seg, i) => (
        <line key={i} x1={seg.from[0]} y1={seg.from[1]} x2={seg.to[0]} y2={seg.to[1]} stroke={color} strokeWidth={9} />
      ))}
      {Array.from(dots.values()).map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={7} fill={palette.ink} />
      ))}
    </svg>
  );
}

/** The correct closed-loop set of segments for a buildable shape — reused by
 *  both the "correct" preview AND as the base every distractor variant below
 *  derives from, so a distractor is always a deliberate, well-defined
 *  departure from the true answer, never an independently-drawn guess. */
export function correctSegments(kind: BuildableKind, size = 68): StickSegment[] {
  const pts = shapeOutline(kind, size);
  const n = pts.length;
  return pts.map((p, i) => ({ from: p, to: pts[(i + 1) % n] }));
}

/** Drops one edge entirely — the "gap" distractor (sticks don't close the loop). */
export function gappedSegments(kind: BuildableKind, size = 68): StickSegment[] {
  const segs = correctSegments(kind, size);
  return segs.slice(0, segs.length - 1);
}

/** Every correct stick PLUS one extra stray stick poking out from a corner
 *  into empty space — the "more sticks than the shape needs" distractor
 *  (tests whether a student notices an extra piece that isn't part of the
 *  outline at all, not just a missing one). */
export function strayStickSegments(kind: BuildableKind, size = 68): StickSegment[] {
  const segs = correctSegments(kind, size);
  const [sx, sy] = segs[0].from;
  const stray: StickSegment = { from: [sx, sy], to: [sx - 34, sy - 34] };
  return [...segs, stray];
}
