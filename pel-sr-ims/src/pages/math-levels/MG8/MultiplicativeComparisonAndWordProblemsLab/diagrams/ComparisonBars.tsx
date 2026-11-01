import { palette } from "../../../shared/lib/palette";

// ============================================================================
// ComparisonBars — the bar-model ("tape diagram") picture for a COMPARISON
// between two amounts, the core visual for this whole lab's Units 1-2.
//
//   multiplicative mode (`times` set): the smaller amount is ONE block; the
//   bigger amount is `times` copies of that same block, side by side — so
//   "4 times as many" literally looks like 4 of the small bar.
//   additive mode (`more` set): the bigger amount is the small bar PLUS one
//   extra piece of length `more` — so "4 more than" looks like the same bar
//   with a little bit stuck on the end, not 4 copies.
//
// Drawn side by side (two instances) in Unit 2's Explore, the two modes make
// "times as many" vs "more than" visibly different pictures for the SAME
// numbers. Lab-local, not shared: MG6_BarModel is a Tailwind-classed additive
// part-whole diagram tied to its own problem type, and shared/diagrams/
// TwoTierBars forces both bars to the same total width (it's for "same
// amount, different partition"), which is exactly wrong for a comparison.
// ============================================================================

export interface ComparisonBarsProps {
  /** The smaller amount (one block). */
  base: number;
  /** Multiplicative mode: how many copies of `base` the bigger bar is. */
  times?: number;
  /** Additive mode: how much longer the bigger bar is than `base`. Ignored when `times` is set. */
  more?: number;
  /** Row labels, e.g. names. Kept short (≤ 8 chars) — they share a fixed 84px gutter. */
  baseLabel: string;
  compLabel: string;
  /** Show the number inside the small bar (and inside each copy). Default true. */
  showBase?: boolean;
  /** Show "× n" / "+ n" next to the bigger bar. Default true. */
  showFactor?: boolean;
  /** Show the bigger bar's total above its bracket. Default true. */
  showTotal?: boolean;
  /**
   * Multiplicative mode only: draw the bigger bar as its separate copies
   * (default true). Set false while the multiplier itself is the unknown, so
   * the student can't just count blocks to read the answer off the picture.
   */
  showCopies?: boolean;
  /** Text shown in place of a hidden value. Default "?". */
  unknownText?: string;
  width?: number;
}

const GUTTER = 84;
const BAR_H = 34;
const RIGHT_PAD = 64;

export function ComparisonBars({
  base,
  times,
  more,
  baseLabel,
  compLabel,
  showBase = true,
  showFactor = true,
  showTotal = true,
  showCopies = true,
  unknownText = "?",
  width = 520,
}: ComparisonBarsProps) {
  const multiplicative = times !== undefined;
  const barSpace = width - GUTTER - RIGHT_PAD;
  const total = multiplicative ? base * (times as number) : base + (more ?? 0);
  // Multiplicative: the bigger bar fills the space, so one block = space / times.
  // Additive: scale both bars so the bigger one fills the space.
  // The extra piece never drops below 30px, so its "+n" label always fits
  // even when `more` is tiny next to `base` (slightly off-scale, on purpose).
  const extraW = multiplicative ? 0 : Math.max(30, (barSpace * (more ?? 0)) / Math.max(1, total));
  const unitW = multiplicative ? barSpace / Math.max(1, times as number) : barSpace - extraW;

  const yBase = 46;
  const yComp = yBase + BAR_H + 44;
  const bracketY = yComp - 10;
  const height = yComp + BAR_H + 14;
  const baseText = showBase ? String(base) : unknownText;
  const fontFor = (w: number) => (w < 30 ? 11 : 14);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      style={{ maxWidth: "100%" }}
      role="img"
      aria-label={
        multiplicative
          ? `Bar model: ${compLabel}'s bar is ${showFactor ? times : "some number of"} copies of ${baseLabel}'s bar`
          : `Bar model: ${compLabel}'s bar is ${baseLabel}'s bar plus ${showFactor ? more : "an extra piece"}`
      }
    >
      {/* row labels */}
      <text x={0} y={yBase + BAR_H / 2 + 5} style={{ fill: palette.ink, fontSize: 15, fontWeight: 700 }}>
        {baseLabel}
      </text>
      <text x={0} y={yComp + BAR_H / 2 + 5} style={{ fill: palette.ink, fontSize: 15, fontWeight: 700 }}>
        {compLabel}
      </text>

      {/* the smaller amount: one block */}
      <rect x={GUTTER} y={yBase} width={unitW} height={BAR_H} rx={4} style={{ fill: palette.aSoft, stroke: palette.a, strokeWidth: 2 }} />
      <text x={GUTTER + unitW / 2} y={yBase + BAR_H / 2 + 5} textAnchor="middle" style={{ fill: palette.ink, fontSize: fontFor(unitW), fontWeight: 700 }}>
        {baseText}
      </text>

      {/* the bigger amount */}
      {multiplicative && !showCopies ? (
        <rect x={GUTTER} y={yComp} width={barSpace} height={BAR_H} rx={4} style={{ fill: palette.bSoft, stroke: palette.b, strokeWidth: 2 }} />
      ) : multiplicative ? (
        Array.from({ length: times as number }, (_, i) => (
          <g key={i}>
            <rect x={GUTTER + i * unitW} y={yComp} width={unitW} height={BAR_H} rx={4} style={{ fill: palette.bSoft, stroke: palette.b, strokeWidth: 2 }} />
            <text x={GUTTER + i * unitW + unitW / 2} y={yComp + BAR_H / 2 + 5} textAnchor="middle" style={{ fill: palette.ink, fontSize: fontFor(unitW), fontWeight: 700 }}>
              {baseText}
            </text>
          </g>
        ))
      ) : (
        <g>
          <rect x={GUTTER} y={yComp} width={unitW} height={BAR_H} rx={4} style={{ fill: palette.bSoft, stroke: palette.b, strokeWidth: 2 }} />
          <text x={GUTTER + unitW / 2} y={yComp + BAR_H / 2 + 5} textAnchor="middle" style={{ fill: palette.ink, fontSize: fontFor(unitW), fontWeight: 700 }}>
            {baseText}
          </text>
          <rect
            x={GUTTER + unitW}
            y={yComp}
            width={extraW}
            height={BAR_H}
            rx={4}
            style={{ fill: palette.cSoft, stroke: palette.c, strokeWidth: 2, strokeDasharray: "5 3" }}
          />
          <text x={GUTTER + unitW + extraW / 2} y={yComp + BAR_H / 2 + 5} textAnchor="middle" style={{ fill: palette.ink, fontSize: fontFor(extraW), fontWeight: 700 }}>
            {showFactor ? `+${more}` : unknownText}
          </text>
        </g>
      )}

      {/* dashed guide showing the small bar lines up with the first block */}
      <line x1={GUTTER + unitW} y1={yBase + BAR_H} x2={GUTTER + unitW} y2={yComp} style={{ stroke: palette.line, strokeWidth: 1, strokeDasharray: "3 3" }} />

      {/* bracket + total over the bigger bar */}
      <path
        d={`M ${GUTTER} ${bracketY} v -8 H ${GUTTER + barSpace} v 8`}
        style={{ fill: "none", stroke: palette.c, strokeWidth: 2 }}
      />
      <text x={GUTTER + barSpace / 2} y={bracketY - 14} textAnchor="middle" style={{ fill: palette.c, fontSize: 15, fontWeight: 700 }}>
        {showTotal ? String(total) : unknownText}
      </text>

      {/* factor tag at the right end of the bigger bar */}
      {multiplicative && (
        <text x={GUTTER + barSpace + 10} y={yComp + BAR_H / 2 + 5} style={{ fill: palette.b, fontSize: 15, fontWeight: 700 }}>
          × {showFactor ? times : unknownText}
        </text>
      )}
    </svg>
  );
}
