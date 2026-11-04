import { palette, diagramFont } from "../../../shared/lib/palette";

export type Tone = "a" | "b" | "c";

const toneColor = (tone?: Tone) => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

const CELL = 34;
const GAP = 6;
const COLS = 5;
const PAD = 8;
const FRAME_W = COLS * CELL + (COLS - 1) * GAP + PAD * 2;
const FRAME_H = 2 * CELL + GAP + PAD * 2;

/**
 * One 10-cell frame (2 rows of 5, the standard ten-frame shape) — the single
 * building block TenFrameGroup below composes into a 0-20 display. `splitAt`
 * (0-based, within THIS frame's own 0-10 range) lets the cells from that
 * index on render in `tone2` instead of `tone` — used whenever a count is
 * made of two distinguishable parts (an original amount vs. an amount just
 * added to complete the ten, or two addends in a put-together story) so the
 * SAME picture that shows "how many" also shows "which part is which,"
 * instead of a plain undifferentiated count.
 */
function TenFrame({ filled, tone, splitAt, tone2, highlightEmpty, crossFrom }: { filled: number; tone?: Tone; splitAt?: number; tone2?: Tone; highlightEmpty?: boolean; crossFrom?: number }) {
  const f = Math.max(0, Math.min(10, Math.round(filled)));
  const color = toneColor(tone);
  const color2 = toneColor(tone2 ?? tone);
  const cellAt = (i: number) => ({ x: PAD + (i % COLS) * (CELL + GAP), y: PAD + Math.floor(i / COLS) * (CELL + GAP) });
  return (
    <svg
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      role="img"
      aria-label={`Ten frame, ${f} of 10 filled`}
      style={{ display: "block", width: "100%", maxWidth: FRAME_W, height: "auto", fontFamily: diagramFont }}
    >
      {Array.from({ length: 10 }, (_, i) => {
        const { x, y } = cellAt(i);
        const isFilled = i < f;
        const isSplit = splitAt !== undefined && isFilled && i >= splitAt;
        const lit = highlightEmpty && !isFilled;
        const crossed = crossFrom !== undefined && isFilled && i >= crossFrom;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={CELL}
              height={CELL}
              rx={6}
              fill={isFilled ? (isSplit ? color2 : color) : "none"}
              stroke={palette.line}
              strokeWidth={1.5}
              // Help ladder: light up the empty boxes ("how many more to make 10?").
              style={lit ? { fill: palette.aSoft, stroke: palette.a, strokeWidth: 3, strokeDasharray: "5 3" } : crossed ? { opacity: 0.45 } : undefined}
            />
            {/* Taken away: faded and crossed out, so "take away" is something you can see. */}
            {crossed && (
              <path
                d={`M ${x + 7} ${y + 7} L ${x + CELL - 7} ${y + CELL - 7} M ${x + CELL - 7} ${y + 7} L ${x + 7} ${y + CELL - 7}`}
                style={{ stroke: palette.ink, strokeWidth: 3.5, strokeLinecap: "round" }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export interface TenFrameGroupProps {
  /** 0-20. Values above 20 are clamped — nothing in this lab counts that high. */
  value: number;
  tone?: Tone;
  /**
   * Cells from this index on (0-based, counted across BOTH frames in reading
   * order — frame 1's 10 cells, then frame 2's) render in `tone2` instead of
   * `tone`. Only meaningful when less than `value`. Use this for:
   *   - make-ten addition: splitAt = the near-ten addend itself, so the
   *     "added on to complete the ten" cells stand out (see makeTenBreakdown
   *     in ../logic.ts, which computes the exact same split this draws).
   *   - put-together/take-apart stories: splitAt = the first addend, so the
   *     two parts of a combined total are visually distinct.
   */
  splitAt?: number;
  tone2?: Tone;
  /** Light up the first frame's empty boxes — the help ladder's "count the empty boxes" pointer. */
  highlightEmpty?: boolean;
  /**
   * Cross out (fade + X) the filled cells from this index on (0-based,
   * across both frames like `splitAt`) — the "take away" picture for
   * subtraction. Omit to cross out nothing.
   */
  crossFrom?: number;
}

/**
 * A count from 0-20 shown as one or two ten-frames (the second only drawn
 * once the count passes 10) — the concrete, countable stand-in this whole
 * lab leans on instead of a bare numeral, per the audience framing (first
 * grade still needs ten-frames/number-lines backing every new idea). Reused
 * for every unit's diagrams: plain counts, make-ten decomposition, and
 * put-together/compare part-shading.
 */
export function TenFrameGroup({ value, tone, splitAt, tone2, highlightEmpty, crossFrom }: TenFrameGroupProps) {
  const v = Math.max(0, Math.min(20, Math.round(value)));
  const firstCount = Math.min(10, v);
  const secondCount = Math.max(0, v - 10);
  const splitFirst = splitAt;
  const splitSecond = splitAt !== undefined ? Math.max(0, splitAt - 10) : undefined;
  return (
    <div
      style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}
      role="img"
      aria-label={`${v} shown on ten frame${v > 10 ? "s" : ""}`}
    >
      <TenFrame filled={firstCount} tone={tone} splitAt={splitFirst} tone2={tone2} highlightEmpty={highlightEmpty} crossFrom={crossFrom} />
      {v > 10 && <TenFrame filled={secondCount} tone={tone} splitAt={splitSecond} tone2={tone2} crossFrom={crossFrom !== undefined ? Math.max(0, crossFrom - 10) : undefined} />}
    </div>
  );
}
