import { palette, diagramFont } from "../../../shared/lib/palette";

export type Arrangement = "line" | "array" | "circle" | "scatter";

const WIDTH = 320;
const HEIGHT = 190;
const PAD = 26;
const R = 13;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/** Deterministic PRNG (mulberry32) — scatter layouts must stay put across
 *  re-renders, so this is seeded from the problem's own data, never
 *  Math.random(). Duplicated from MK1/CountingAndCardinalityLab/diagrams/
 *  CounterGroup.tsx rather than imported cross-lab or promoted to shared/ —
 *  this build's scope guardrail only permits files inside this lab's own
 *  folder (plus three named tracking files), so the "promote on second
 *  consumer" convention this would normally trigger is deliberately deferred
 *  to a future session with broader scope (documented in the final report
 *  and in VISUAL_COMPONENT_TODO.txt). */
function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function layoutPositions(count: number, arrangement: Arrangement, seed = 1): { x: number; y: number }[] {
  if (count <= 0) return [];
  if (arrangement === "line") {
    const gap = Math.min(30, (WIDTH - PAD * 2) / Math.max(1, count - 1));
    const totalW = gap * (count - 1);
    const startX = (WIDTH - totalW) / 2;
    return Array.from({ length: count }, (_, i) => ({ x: startX + i * gap, y: HEIGHT / 2 }));
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
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;
    const r = Math.min(WIDTH, HEIGHT) / 2 - PAD - 6;
    return Array.from({ length: count }, (_, i) => {
      const a = (2 * Math.PI * i) / count - Math.PI / 2;
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
  }
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

export interface ObjectGroupProps {
  count: number;
  arrangement?: Arrangement;
  tone?: "a" | "b" | "c";
  /** Required (and must stay fixed) whenever arrangement is "scatter". */
  seed?: number;
  /** A single emoji rendered at each position instead of a plain dot. */
  glyph?: string;
  /** Indices (0-based, in layout order) clicked so far, in click order —
   *  only meaningful together with `onToggle`, in an Explore sandbox. */
  countedOrder?: number[];
  onToggle?: (index: number) => void;
}

/** A group of simple objects (dots, or an emoji glyph) laid out as a line, a
 *  grid, a circle, or a random scatter — the concrete stand-in for "how
 *  many" this lab uses so every addition/subtraction idea is shown with
 *  real objects before any bare numeral or "+"/"−" symbol appears, per this
 *  Kindergarten lab's audience framing. */
export function ObjectGroup({ count, arrangement = "line", tone, seed = 1, glyph, countedOrder, onToggle }: ObjectGroupProps) {
  const points = layoutPositions(count, arrangement, seed);
  const color = toneColor(tone);
  const orderOf = (i: number) => (countedOrder ? countedOrder.indexOf(i) : -1);
  const interactive = !!onToggle;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`${count} object${count === 1 ? "" : "s"}${interactive ? ", click one at a time to count them" : ""}`}
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
        return (
          <g key={i} style={interactive ? { cursor: "pointer" } : undefined} onClick={interactive ? () => onToggle!(i) : undefined}>
            {glyph ? (
              <text x={p.x} y={p.y + R * 0.7} textAnchor="middle" fontSize={R * 2.1} opacity={counted || !countedOrder ? 1 : 0.35}>
                {glyph}
              </text>
            ) : (
              <circle cx={p.x} cy={p.y} r={R} fill={counted || !countedOrder ? color : palette.grid} stroke={palette.paper} strokeWidth={2} />
            )}
            {countedOrder && counted && (
              <text x={p.x} y={p.y - R - 6} textAnchor="middle" fontSize={13} fontWeight={800} fill={color}>
                {order + 1}
              </text>
            )}
            {interactive && <circle cx={p.x} cy={p.y} r={R + 8} fill="transparent" />}
          </g>
        );
      })}
    </svg>
  );
}
