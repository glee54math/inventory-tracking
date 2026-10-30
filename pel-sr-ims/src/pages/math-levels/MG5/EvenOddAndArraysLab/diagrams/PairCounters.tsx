import { palette, diagramFont } from "../../../shared/lib/palette";

export type CounterArrangement = "line" | "array" | "scatter";

const WIDTH = 320;
const HEIGHT = 190;
const PAD = 26;
const R = 12;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/** Deterministic PRNG (mulberry32) — a scattered layout must stay put across
 *  re-renders (revealing the pairing lines shouldn't jiggle every counter's
 *  position), so this is seeded from the problem's own data, never
 *  Math.random(). Same technique as MK1's CounterGroup.tsx, kept as a local
 *  copy per this app's "each skill file is self-contained" convention
 *  (MATH_TSX_STYLE_GUIDE.txt section 7) rather than importing across labs. */
function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pure layout function — kept separate from rendering so the three
 *  arrangements stay independently testable. Pairing (see showPairs below)
 *  is always drawn by INDEX order (0-1, 2-3, ...), never by on-screen
 *  proximity, so the exact same pairing logic applies no matter which
 *  arrangement is showing — that's the point of the "scattered" bucket:
 *  whether a group is odd or even cannot depend on how it happens to be
 *  arranged on the page. */
function layoutPositions(count: number, arrangement: CounterArrangement, seed = 1): { x: number; y: number }[] {
  if (count <= 0) return [];
  if (arrangement === "line") {
    const gap = Math.min(30, (WIDTH - PAD * 2) / Math.max(1, count - 1));
    const totalW = gap * (count - 1);
    const startX = (WIDTH - totalW) / 2;
    return Array.from({ length: count }, (_, i) => ({ x: startX + i * gap, y: HEIGHT / 2 }));
  }
  if (arrangement === "array") {
    const cols = Math.min(5, Math.ceil(Math.sqrt(count)));
    const rows = Math.ceil(count / cols);
    const gapX = Math.min(42, (WIDTH - PAD * 2) / Math.max(1, cols - 1));
    const gapY = Math.min(42, (HEIGHT - PAD * 2) / Math.max(1, rows - 1));
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
  // scatter: rejection-sample so objects don't overlap, with a fallback once
  // a tight count/area ratio makes that impractical (always terminates).
  const rand = mulberry32(seed);
  const pts: { x: number; y: number }[] = [];
  let attempts = 0;
  while (pts.length < count && attempts < count * 60) {
    attempts++;
    const x = PAD + rand() * (WIDTH - 2 * PAD);
    const y = PAD + rand() * (HEIGHT - 2 * PAD);
    if (pts.every((p) => Math.hypot(p.x - x, p.y - y) > 2 * R + 6)) pts.push({ x, y });
  }
  while (pts.length < count) pts.push({ x: PAD + rand() * (WIDTH - 2 * PAD), y: PAD + rand() * (HEIGHT - 2 * PAD) });
  return pts;
}

export interface PairCountersProps {
  count: number;
  arrangement?: CounterArrangement;
  tone?: "a" | "b" | "c";
  /** Required (and must stay fixed across re-renders) whenever arrangement
   *  is "scatter" — reused so the random layout doesn't jump around. */
  seed?: number;
  /** When true, draws a connecting line between each sequential index pair
   *  (0-1, 2-3, ...) and rings the leftover counter (if any) in a dashed
   *  "bad" outline — the concrete "can everyone find a partner?" check for
   *  odd/even. Left false while a student is still reasoning through a
   *  Practice step, then flipped true once they've answered, as a visual
   *  confirmation of their own answer rather than a pre-given hint. */
  showPairs?: boolean;
}

/** A group of simple counters laid out as a line, a grid, or a random
 *  scatter, with an optional "pair them up" overlay — the concrete,
 *  arrangement-independent stand-in for determining odd/even that this
 *  lab's Unit 1 and Unit 2 both use. */
export function PairCounters({ count, arrangement = "line", tone, seed = 1, showPairs = false }: PairCountersProps) {
  const points = layoutPositions(count, arrangement, seed);
  const color = toneColor(tone);
  const pairCount = Math.floor(count / 2);
  const hasLeftover = count % 2 === 1;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`${count} counters${showPairs ? (hasLeftover ? ", paired up with one left over" : ", all paired up with none left over") : ""}`}
      style={{ display: "block", width: "100%", maxWidth: WIDTH, height: "auto", fontFamily: diagramFont }}
    >
      {count === 0 && (
        <text x={WIDTH / 2} y={HEIGHT / 2 + 5} textAnchor="middle" fontSize={14} fill={palette.muted}>
          (none)
        </text>
      )}
      {showPairs &&
        Array.from({ length: pairCount }, (_, i) => {
          const p1 = points[i * 2];
          const p2 = points[i * 2 + 1];
          return <line key={`pair-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={palette.good} strokeWidth={3} strokeLinecap="round" opacity={0.8} />;
        })}
      {points.map((p, i) => {
        const leftover = showPairs && hasLeftover && i === count - 1;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={R} fill={color} stroke={palette.paper} strokeWidth={2} />
            {leftover && <circle cx={p.x} cy={p.y} r={R + 6} fill="none" stroke={palette.bad} strokeWidth={3} strokeDasharray="4 3" />}
          </g>
        );
      })}
    </svg>
  );
}
