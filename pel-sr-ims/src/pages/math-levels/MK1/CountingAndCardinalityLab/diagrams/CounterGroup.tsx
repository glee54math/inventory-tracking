import { useEffect, useState } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { getState } from "../../../shared/tts/speechEngine";
import { useTtsState } from "../../../shared/tts/ttsContext";

export type Arrangement = "line" | "array" | "circle" | "scatter";

const WIDTH = 320;
const HEIGHT = 190;
const PAD = 26;
const R = 13;
const CHUNK_GAP = 16; // extra space between groups of five (line) or ten (array)

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/** Deterministic PRNG (mulberry32) — scatter layouts must stay put across
 *  re-renders (clicking one counter shouldn't jiggle every other counter's
 *  position), so this is seeded from the problem's own data, never Math.random(). */
function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pure layout function, reused by nothing else today (counting's graded
 *  answer is just `count`, not derived from pixel positions) but kept
 *  separate from rendering anyway so the four arrangements stay independently
 *  testable. */
export function layoutPositions(count: number, arrangement: Arrangement, seed = 1): { x: number; y: number }[] {
  if (count <= 0) return [];
  if (arrangement === "line") {
    // Up to 10 in one line. Past 10, rows of 10 (like a ten-frame row), the
    // second row starting under the first, so counters never crowd together.
    // Each row is chunked 5 + 5 with a wider gap, so a student can see "five"
    // and "ten" at a glance and count on from there instead of from 1.
    const perRow = Math.min(count, 10);
    const rows = Math.ceil(count / 10);
    const chunk = perRow > 5 ? CHUNK_GAP : 0;
    const gap = perRow > 1 ? Math.min(30, (WIDTH - PAD * 2 - chunk) / (perRow - 1)) : 0;
    const startX = (WIDTH - gap * (perRow - 1) - chunk) / 2;
    const rowGap = 44;
    const startY = HEIGHT / 2 - (rowGap * (rows - 1)) / 2;
    return Array.from({ length: count }, (_, i) => ({
      x: startX + (i % 10) * gap + (i % 10 >= 5 ? chunk : 0),
      y: startY + Math.floor(i / 10) * rowGap,
    }));
  }
  if (arrangement === "array" && count > 5) {
    // Rows of 5 (like a ten-frame), with an extra gap after every two rows,
    // so each ten reads as a block and each row as a five.
    const cols = 5;
    const rows = Math.ceil(count / cols);
    const tenBreaks = Math.floor((rows - 1) / 2);
    const gapX = 38;
    const gapY = Math.min(38, (HEIGHT - PAD * 2 - tenBreaks * CHUNK_GAP) / Math.max(1, rows - 1));
    const totalH = gapY * (rows - 1) + tenBreaks * CHUNK_GAP;
    const startY = (HEIGHT - totalH) / 2;
    const startX = (WIDTH - gapX * (cols - 1)) / 2;
    return Array.from({ length: count }, (_, i) => {
      const r = Math.floor(i / cols);
      return { x: startX + (i % cols) * gapX, y: startY + r * gapY + Math.floor(r / 2) * CHUNK_GAP };
    });
  }
  if (arrangement === "array") {
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const gapX = Math.min(38, (WIDTH - PAD * 2) / Math.max(1, cols - 1));
    const gapY = Math.min(38, (HEIGHT - PAD * 2) / Math.max(1, rows - 1));
    const totalH = gapY * (rows - 1);
    const startY = (HEIGHT - totalH) / 2;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const inRow = Math.min(cols, count - r * cols);
      const rowTotalW = gapX * (inRow - 1);
      const rowStartX = (WIDTH - rowTotalW) / 2;
      pts.push({ x: rowStartX + c * gapX, y: startY + r * gapY });
    }
    return pts;
  }
  if (arrangement === "circle") {
    // A round circle for small groups; an oval using the full width for bigger
    // ones, with counters spaced evenly along it so none overlap.
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;
    const ry = HEIGHT / 2 - PAD - 6;
    const rx = count <= 10 ? ry : WIDTH / 2 - PAD - 6;
    const N = 720;
    const pts: { x: number; y: number }[] = [];
    const cum: number[] = [0];
    for (let k = 0; k <= N; k++) {
      const a = (2 * Math.PI * k) / N - Math.PI / 2;
      pts.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
      if (k > 0) cum.push(cum[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y));
    }
    const total = cum[N];
    let k = 0;
    return Array.from({ length: count }, (_, i) => {
      const target = (total * i) / count;
      while (k < N && cum[k] < target) k++;
      return pts[k];
    });
  }
  // scatter: rejection-sample so objects don't overlap, with a fallback once
  // a tight count/area ratio makes that impractical (always terminates).
  const rand = mulberry32(seed);
  const pts: { x: number; y: number }[] = [];
  let attempts = 0;
  while (pts.length < count && attempts < count * 60) {
    attempts++;
    const x = PAD + rand() * (WIDTH - 2 * PAD);
    const y = PAD + rand() * (HEIGHT - 2 * PAD);
    if (pts.every((p) => Math.hypot(p.x - x, p.y - y) > 2 * R + 4)) pts.push({ x, y });
  }
  while (pts.length < count) pts.push({ x: PAD + rand() * (WIDTH - 2 * PAD), y: PAD + rand() * (HEIGHT - 2 * PAD) });
  return pts;
}

export interface CounterGroupProps {
  count: number;
  arrangement?: Arrangement;
  tone?: "a" | "b" | "c";
  /** Required (and must stay fixed) whenever arrangement is "scatter" —
   *  reused across re-renders so the random layout doesn't jump around. */
  seed?: number;
  /** A single emoji rendered at each position instead of a plain dot — e.g.
   *  "🍎" for a themed scene. Omit for a plain colored counter. */
  glyph?: string;
  /**
   * Indices (0-based, in layout order) the student has clicked so far, IN
   * CLICK ORDER — countedOrder[k] was the (k+1)-th object counted. Only
   * meaningful together with `onToggle`, in Explore's click-to-count
   * sandbox. A static display (Practice/Test visuals) omits both — nothing
   * here is ever part of a graded answer, since counting the same group in
   * a different order still gives the same total.
   */
  countedOrder?: number[];
  onToggle?: (index: number) => void;
  /**
   * "Show me" for counting: number the counters one at a time, about one per
   * `countAlongMs`, in an easy order (left to right, top row first; around
   * the circle). The newest one gets a ring. Static display only.
   */
  countAlong?: boolean;
  countAlongMs?: number;
  /** How many counters (the last ones in layout order) have been taken away —
   *  drawn faded with an X so "how many are left?" has something to count.
   *  Static display only; defaults to 0 (none taken). */
  removed?: number;
  /** Cross out the first N counters (layout order) with a slash and fade them,
   *  e.g. pairs cancelled against another group. Static display only. */
  slashFirst?: number;
  /** Number counters `from`, `from + 1`, ... as 1, 2, ... (`shown` of them), with
   *  a ring on the newest — counting what's left after `slashFirst`. */
  numbered?: { from: number; shown: number };
}

/** A group of simple counters (dots, or an emoji glyph) laid out as a line,
 *  a grid, a circle, or a random scatter — the concrete, draggable/clickable
 *  stand-in for "how many" this whole lab uses instead of a bare numeral,
 *  per the K audience framing (no number should ever appear with nothing to
 *  count). Optionally click-to-count interactive for Explore. */
/** The order to count in during countAlong: rows top to bottom, left to right (scatter sorted into bands). */
function countingOrder(points: { x: number; y: number }[], arrangement: Arrangement): number[] {
  const idx = points.map((_, i) => i);
  if (arrangement !== "scatter") return idx;
  return idx.sort((a, b) => Math.floor(points[a].y / 46) - Math.floor(points[b].y / 46) || points[a].x - points[b].x);
}

// Count-along pace, matched to the read-aloud voice so the numbers on the
// dots keep step with what's being said ("Let's count together: 1, 2, 3...").
const STEP_MS = { slow: 1300, normal: 1000, fast: 800 } as const;
// Wait for "Let's count together:" before the first dot gets its number.
export const LEAD_IN_MS = 1200;

/** Milliseconds per counted number at the student's current read-aloud speed. */
export const countStepMs = () => STEP_MS[getState().speed];

/** Milliseconds a countAlong of `count` counters takes, for Step.showMeHoldMs. */
export const countAlongMs = (count: number, perMs = countStepMs()) => LEAD_IN_MS + count * perMs;

export function CounterGroup({ count, arrangement = "line", tone, seed = 1, glyph, countedOrder: clickedOrder, onToggle, removed = 0, countAlong, countAlongMs, slashFirst = 0, numbered }: CounterGroupProps) {
  const speed = useTtsState().speed;
  const perMs = countAlongMs ?? STEP_MS[speed];
  const points = layoutPositions(count, arrangement, seed);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!countAlong) return;
    setShown(0);
    let iv: number | undefined;
    const lead = window.setTimeout(() => {
      setShown(1);
      iv = window.setInterval(() => setShown((k) => (k >= count ? k : k + 1)), perMs);
    }, LEAD_IN_MS);
    return () => {
      window.clearTimeout(lead);
      window.clearInterval(iv);
    };
  }, [countAlong, count, perMs]);
  const countedOrder = countAlong && !onToggle ? countingOrder(points, arrangement).slice(0, shown) : clickedOrder;
  const color = toneColor(tone);
  const orderOf = (i: number) => (countedOrder ? countedOrder.indexOf(i) : -1);
  const interactive = !!onToggle;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`${count} counter${count === 1 ? "" : "s"}${interactive ? ", click one at a time to count them" : ""}`}
      style={{ display: "block", width: "100%", maxWidth: WIDTH, height: "auto", fontFamily: diagramFont }}
    >
      {count === 0 && (
        <text x={WIDTH / 2} y={HEIGHT / 2 + 5} textAnchor="middle" fontSize={14} fill={palette.muted}>
          (none)
        </text>
      )}
      {points.map((p, i) => {
        const order = orderOf(i);
        const counted = order >= 0;
        const taken = i >= count - removed;
        const slashed = i < slashFirst;
        const num = numbered && i >= numbered.from && i < numbered.from + numbered.shown ? i - numbered.from + 1 : 0;
        return (
          <g
            key={i}
            style={interactive ? { cursor: "pointer" } : undefined}
            onClick={interactive ? () => onToggle!(i) : undefined}
            opacity={taken || slashed ? 0.3 : undefined}
          >
            {glyph ? (
              <text x={p.x} y={p.y + R * 0.7} textAnchor="middle" fontSize={R * 2.1} opacity={counted || !countedOrder ? 1 : 0.35}>
                {glyph}
              </text>
            ) : (
              <circle
                cx={p.x}
                cy={p.y}
                r={R}
                fill={color}
                opacity={counted || !countedOrder ? 1 : 0.4}
                stroke={palette.paper}
                strokeWidth={2}
              />
            )}
            {taken && (
              <path
                d={`M ${p.x - R + 3} ${p.y - R + 3} L ${p.x + R - 3} ${p.y + R - 3} M ${p.x + R - 3} ${p.y - R + 3} L ${p.x - R + 3} ${p.y + R - 3}`}
                stroke={palette.ink}
                strokeWidth={3}
                strokeLinecap="round"
              />
            )}
            {slashed && (
              <path d={`M ${p.x + R + 2} ${p.y - R - 2} L ${p.x - R - 2} ${p.y + R + 2}`} stroke={palette.ink} strokeWidth={3.5} strokeLinecap="round" />
            )}
            {num > 0 && (
              <>
                <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">
                  {num}
                </text>
                {num === numbered!.shown && <circle cx={p.x} cy={p.y} r={R + 4} fill="none" stroke={palette.ink} strokeWidth={2.5} />}
              </>
            )}
            {countedOrder && counted && (countAlong && !glyph ? (
              <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize={order >= 9 ? 11 : 13} fontWeight={800} fill="#fff">
                {order + 1}
              </text>
            ) : (
              <text x={p.x} y={p.y - R - 6} textAnchor="middle" fontSize={13} fontWeight={800} fill={color}>
                {order + 1}
              </text>
            ))}
            {countAlong && counted && order === countedOrder!.length - 1 && (
              <circle cx={p.x} cy={p.y} r={R + 4} fill="none" stroke={palette.ink} strokeWidth={2.5} />
            )}
            {interactive && (
              <circle cx={p.x} cy={p.y} r={R + 8} fill="transparent" />
            )}
          </g>
        );
      })}
    </svg>
  );
}
