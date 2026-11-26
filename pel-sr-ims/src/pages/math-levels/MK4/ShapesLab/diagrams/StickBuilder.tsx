import { useState } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { shapeOutline, rotatePts, toneColor, type BuildableKind } from "./Shape2D";
import { useCountAlong } from "./countAlong";
import { ReadAloud } from "../../../shared/tts/ReadAloud";

/** A stick between two clay balls, by ball index (smaller index first). */
export type Stick = [number, number];
const norm = (a: number, b: number): Stick => (a < b ? [a, b] : [b, a]);
const same = (s: Stick, t: Stick) => s[0] === t[0] && s[1] === t[1];
const key = (s: Stick) => `${s[0]}-${s[1]}`;

/** The clay balls for building a flat shape: one per corner, plus one ball
 *  in the middle that is NOT a corner (so a wrong join is possible even for a
 *  triangle; review C1-29, user decision: real building). */
export function buildBalls(kind: BuildableKind, size = 68): [number, number][] {
  return [...shapeOutline(kind, size), [100, 104]];
}
/** The sticks a flat shape needs: corner i to corner i + 1, all the way round. */
export function buildEdges(kind: BuildableKind): Stick[] {
  const n = shapeOutline(kind, 68).length;
  return Array.from({ length: n }, (_, i) => norm(i, (i + 1) % n));
}

export type BuildResult = "ok" | "gap" | "extra" | "empty";
/** Is the build closed? Every needed stick there ("gap" if not), and no
 *  stick the shape doesn't need ("extra"). */
export function checkBuild(needed: Stick[], sticks: Stick[]): BuildResult {
  if (sticks.length === 0) return "empty";
  if (needed.some((n) => !sticks.some((s) => same(s, n)))) return "gap";
  if (sticks.some((s) => !needed.some((n) => same(s, n)))) return "extra";
  return "ok";
}

export const BUILD_REASON: Record<Exclude<BuildResult, "ok">, string> = {
  empty: "Tap two clay balls to add a stick.",
  gap: "Not yet. There is a gap.",
  extra: "There is an extra stick. Tap it to take it off.",
};
/** The cube's reasons: a cube frame has no single "around", so its gap is a
 *  missing stick, the words its other steps use (review E3-02). */
export const CUBE_BUILD_REASON: Partial<Record<Exclude<BuildResult, "ok">, string>> = {
  gap: "Not yet. A stick is missing.",
};

/**
 * The clay balls and the sticks joining them. Interactive when `onBall` is
 * passed: tap a ball, then another, to join them; tap a stick to take it
 * off. `guide` (help after a wrong try) draws the needed sticks as faint
 * dashes. `countAlong` numbers the sticks one per beat (Show me).
 */
export function JoinBoard({
  balls,
  sticks,
  selected = null,
  onBall,
  onStick,
  guide,
  countAlong = false,
  ringBall,
  ballR = 9,
  tone = "a",
  label = "clay balls to join with sticks",
  maxWidth = 240,
}: {
  balls: [number, number][];
  sticks: Stick[];
  selected?: number | null;
  onBall?: (i: number) => void;
  onStick?: (k: number) => void;
  guide?: Stick[];
  countAlong?: boolean;
  /** Ring one ball (Unit 4 CFU "How many sticks meet here?"). */
  ringBall?: number;
  ballR?: number;
  tone?: "a" | "b" | "c";
  label?: string;
  /** Widest the board is drawn, in px (the cube board is wider: review C2-14). */
  maxWidth?: number;
}) {
  const color = toneColor(tone);
  const shown = useCountAlong(countAlong, sticks.length);
  const tapR = Math.max(ballR + 8, 17);
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} style={{ display: "block", width: "100%", maxWidth, height: "auto", fontFamily: diagramFont, touchAction: "manipulation" }}>
      {guide?.map(([a, b]) => (
        <line key={`g${a}-${b}`} x1={balls[a][0]} y1={balls[a][1]} x2={balls[b][0]} y2={balls[b][1]} stroke={palette.c} strokeWidth={4} strokeDasharray="7 7" opacity={0.8} />
      ))}
      {sticks.map(([a, b], k) => (
        <g key={key([a, b])} style={onStick ? { cursor: "pointer" } : undefined} onClick={onStick ? () => onStick(k) : undefined}>
          <line x1={balls[a][0]} y1={balls[a][1]} x2={balls[b][0]} y2={balls[b][1]} stroke={k < shown ? palette.c : color} strokeWidth={8} strokeLinecap="round" />
          {onStick && <line x1={balls[a][0]} y1={balls[a][1]} x2={balls[b][0]} y2={balls[b][1]} stroke="transparent" strokeWidth={20} />}
        </g>
      ))}
      {balls.map(([x, y], i) => (
        <g key={`b${i}`} style={onBall ? { cursor: "pointer" } : undefined} onClick={onBall ? () => onBall(i) : undefined}>
          {selected === i && <circle cx={x} cy={y} r={ballR + 8} fill={palette.cSoft} stroke={palette.c} strokeWidth={3} />}
          <circle cx={x} cy={y} r={ballR} fill={palette.ink} />
          {onBall && <circle cx={x} cy={y} r={tapR} fill="transparent" />}
        </g>
      ))}
      {ringBall !== undefined && <circle cx={balls[ringBall][0]} cy={balls[ringBall][1]} r={ballR + 9} fill="none" stroke={palette.c} strokeWidth={4} />}
      {sticks.slice(0, shown).map(([a, b], k) => {
        const mx = (balls[a][0] + balls[b][0]) / 2;
        const my = (balls[a][1] + balls[b][1]) / 2;
        const d = Math.hypot(mx - 100, my - 100) || 1;
        return (
          <text key={`n${k}`} x={mx + ((mx - 100) / d) * 16} y={my + ((my - 100) / d) * 16 + 6} textAnchor="middle" fontSize={16} fontWeight={700} fill={palette.ink}>
            {k + 1}
          </text>
        );
      })}
    </svg>
  );
}

/**
 * The real build (Unit 4 Practice step and Explore sandbox): only the clay
 * balls are shown. The student joins two balls at a time, can take a stick
 * off, and taps "Is it closed?" to check. A gap or an extra stick is a wrong
 * try (`onWrong`, with its reason, so the step shows one line, not two:
 * review C2-12); a closed shape with no extra stick calls `onDone`. With no
 * `onWrong` (Explore) the builder says the reason itself. `onEdit` is called on
 * every tap that changes the build (a ball, a stick, Start over), so the step
 * can clear its old wrong-try line while the child fixes it (review C3-02).
 */
export function JoinBuilder({
  balls,
  needed,
  onDone,
  onWrong,
  onEdit,
  reasons,
  ballR,
  tone = "a",
  doneText = "You built it!",
  guide = false,
  maxWidth,
}: {
  balls: [number, number][];
  needed: Stick[];
  onDone?: () => void;
  onWrong?: (reason: string) => void;
  /** The child changed the build (see above). */
  onEdit?: () => void;
  /** Replace some of BUILD_REASON's lines (the cube: CUBE_BUILD_REASON). */
  reasons?: Partial<Record<Exclude<BuildResult, "ok">, string>>;
  ballR?: number;
  maxWidth?: number;
  tone?: "a" | "b" | "c";
  /** Said when the build is right (Explore). */
  doneText?: string;
  /** Help: show the needed sticks as faint dashes. */
  guide?: boolean;
}) {
  const [sticks, setSticks] = useState<Stick[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [said, setSaid] = useState<{ text: string; good: boolean; n: number } | null>(null);
  const [done, setDone] = useState(false);
  const reason = (r: Exclude<BuildResult, "ok">) => reasons?.[r] ?? BUILD_REASON[r];
  const tapBall = (i: number) => {
    if (done) return;
    setSaid(null);
    onEdit?.();
    if (selected === null) return setSelected(i);
    if (selected === i) return setSelected(null);
    const s = norm(selected, i);
    setSticks((all) => (all.some((t) => same(t, s)) ? all : [...all, s]));
    setSelected(null);
  };
  const tapStick = (k: number) => {
    if (done) return;
    setSaid(null);
    onEdit?.();
    setSticks((all) => all.filter((_, j) => j !== k));
  };
  const check = () => {
    const r = checkBuild(needed, sticks);
    if (r === "ok") {
      setDone(true);
      setSaid({ text: doneText, good: true, n: (said?.n ?? 0) + 1 });
      onDone?.();
    } else {
      if (r !== "empty" && onWrong) {
        // The step shows (and reads) the reason as its one feedback line.
        setSaid(null);
        onWrong(reason(r));
      } else setSaid({ text: reason(r), good: false, n: (said?.n ?? 0) + 1 });
    }
  };
  const reset = () => {
    if (!done) onEdit?.();
    setSticks([]);
    setSelected(null);
    setSaid(null);
    setDone(false);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <JoinBoard balls={balls} sticks={sticks} selected={selected} onBall={tapBall} onStick={tapStick} guide={guide ? needed : undefined} ballR={ballR} tone={tone} maxWidth={maxWidth} />
      <div className="control-row" data-readaloud-part>
        <button type="button" className="btn primary" disabled={done || sticks.length === 0} onClick={check}>
          Is it closed?
        </button>
        <button type="button" className="btn ghost" onClick={reset}>
          Start over
        </button>
      </div>
      {said && (
        <ReadAloud as="p" className={`feedback ${said.good ? "good" : "bad"}`} role="alert" autoPlayKey={`${said.text}|${said.n}`}>
          {said.text}
        </ReadAloud>
      )}
    </div>
  );
}

/** A finished flat shape made of sticks, with its sticks numbered one per
 *  beat when `countAlong` is on (the count step's Show me). */
export function BuiltShape({ kind, countAlong = false, tone = "a" }: { kind: BuildableKind; countAlong?: boolean; tone?: "a" | "b" | "c" }) {
  const balls = shapeOutline(kind, 68);
  return <JoinBoard balls={balls} sticks={buildEdges(kind)} countAlong={countAlong} tone={tone} label="a shape made of sticks" />;
}

export interface StickSegment {
  from: [number, number];
  to: [number, number];
}

/** A static picture of sticks joined together — for "which one has no gap?"
 *  picture choices. `segments` is explicit so a wrong picture can be a
 *  well-defined change from the right one (a gap, an extra stick). */
export function StickArrangementPreview({ segments, tone = "a", size = 200 }: { segments: StickSegment[]; tone?: "a" | "b" | "c"; size?: number }) {
  const color = toneColor(tone);
  const dots = new Map<string, [number, number]>();
  for (const seg of segments) {
    dots.set(seg.from.join(","), seg.from);
    dots.set(seg.to.join(","), seg.to);
  }
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="sticks joined together" style={{ display: "block", width: "100%", maxWidth: size, height: "auto", fontFamily: diagramFont }}>
      {segments.map((seg, i) => (
        <line key={i} x1={seg.from[0]} y1={seg.from[1]} x2={seg.to[0]} y2={seg.to[1]} stroke={color} strokeWidth={9} strokeLinecap="round" />
      ))}
      {Array.from(dots.values()).map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={7} fill={palette.ink} />
      ))}
    </svg>
  );
}

/** The right closed set of sticks for a flat shape (optionally turned). */
export function correctSegments(kind: BuildableKind, size = 68, turn = 0): StickSegment[] {
  const pts = rotatePts(shapeOutline(kind, size), turn);
  const n = pts.length;
  return pts.map((p, i) => ({ from: p, to: pts[(i + 1) % n] }));
}

/** One stick left out (stick `missing`): the "gap" picture. */
export function gappedSegments(kind: BuildableKind, size = 68, missing = 0): StickSegment[] {
  const segs = correctSegments(kind, size);
  return segs.filter((_, i) => i !== missing % segs.length);
}

/** Every right stick plus one extra stick poking out from corner `at`, away
 *  from the middle: the "extra stick" picture. */
export function strayStickSegments(kind: BuildableKind, size = 68, at = 0): StickSegment[] {
  const segs = correctSegments(kind, size);
  const [sx, sy] = segs[at % segs.length].from;
  const d = Math.hypot(sx - 100, sy - 100) || 1;
  const ux = (sx - 100) / d;
  const uy = (sy - 100) / d;
  // As long as fits inside the picture (10 from the edge), at most 40.
  const room = (p: number, u: number) => (u > 0 ? (190 - p) / u : u < 0 ? (p - 10) / -u : Infinity);
  const len = Math.min(40, room(sx, ux), room(sy, uy));
  const stray: StickSegment = { from: [sx, sy], to: [sx + ux * len, sy + uy * len] };
  return [...segs, stray];
}
