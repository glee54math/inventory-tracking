import { palette } from "../../../shared/lib/palette";

export interface SharingBarsProps {
  /** Shaded portions out of `denominator`, e.g. 5 for 5/7. */
  numerator: number;
  denominator: number;
  /** How many ways the shaded amount is being split (the divisor/number of people). */
  shareCount: number;
  unit?: string;
  width?: number;
  height?: number;
}

/**
 * Partitive ("N people share this amount") division model, drawn as two
 * stacked bars sharing one width so a learner can see both the whole amount
 * AND the zoomed-in slice size at once, instead of one bar trying to show
 * both at once (the old single-bar + internal-dividers version, which read
 * as an unexplained cluster of lines once the numerator/denominator got
 * rescaled by shareCount):
 *  - Top bar: the amount exactly as given — `denominator` equal cells,
 *    `numerator` of them shaded. No rescaling, so this always matches the
 *    fraction in the story word for word.
 *  - Bottom bar: the SAME total width, re-partitioned into
 *    denominator × shareCount equal cells (thick dividers every shareCount
 *    cells line up exactly under the top bar's own cell boundaries). Within
 *    each of the `numerator` active groups, exactly one cell is picked out in
 *    the highlight color — "this is the one slice of this seventh that goes
 *    to our one person" — so the number of highlighted cells always equals
 *    `numerator`, visually proving why the quotient's numerator doesn't
 *    change (only the denominator multiplies by shareCount).
 * Same stacked-bars-plus-dashed-guides language as FractionMeasureStrip,
 * reused here for the partitive (sharing) case instead of the quotitive
 * (measuring) one.
 */
export function SharingBars({ numerator, denominator, shareCount, unit = "lb", width = 360, height = 52 }: SharingBarsProps) {
  const topCellW = width / denominator;
  const totalCells = denominator * shareCount;
  const cellW2 = width / totalCells;
  const guideY = height + 24;
  const bottomH = Math.max(28, height - 16);
  const totalHeight = guideY + bottomH + 50;

  return (
    <svg
      viewBox={`0 0 ${width} ${totalHeight}`}
      width={width}
      style={{ maxWidth: "100%" }}
      role="img"
      aria-label={`${numerator}/${denominator} ${unit}, split ${shareCount} ways`}
    >
      {/* top bar: the amount exactly as given */}
      {Array.from({ length: denominator }, (_, i) => (
        <rect
          key={i}
          x={i * topCellW}
          y={0}
          width={topCellW}
          height={height}
          style={{ fill: i < numerator ? palette.a : palette.paper, fillOpacity: i < numerator ? 0.85 : 1, stroke: palette.line, strokeWidth: 1 }}
        />
      ))}
      <rect x={0} y={0} width={width} height={height} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
      <text x={width / 2} y={height + 16} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
        {numerator}/{denominator} {unit} — what we have
      </text>

      {/* dashed guides tying the whole top bar to the zoomed-in bottom bar */}
      <line x1={0} y1={height + 24} x2={0} y2={guideY} style={{ stroke: palette.line, strokeWidth: 1, strokeDasharray: "3 3" }} />
      <line x1={width} y1={height + 24} x2={width} y2={guideY} style={{ stroke: palette.line, strokeWidth: 1, strokeDasharray: "3 3" }} />

      {/* bottom bar: the same width, re-split into denominator × shareCount cells */}
      <g transform={`translate(0, ${guideY})`}>
        {Array.from({ length: totalCells }, (_, i) => {
          const group = Math.floor(i / shareCount);
          const posInGroup = i % shareCount;
          const active = group < numerator;
          const isTheShare = active && posInGroup === 0;
          return (
            <rect
              key={i}
              x={i * cellW2}
              y={0}
              width={cellW2}
              height={bottomH}
              style={{
                fill: isTheShare ? palette.c : active ? palette.a : palette.paper,
                fillOpacity: isTheShare ? 0.9 : active ? 0.85 : 1,
                stroke: palette.line,
                strokeWidth: 0.75,
              }}
            />
          );
        })}
        {/* thick dividers every shareCount cells — lines up with the top bar's own cell boundaries */}
        {Array.from({ length: denominator + 1 }, (_, i) => (
          <line key={`g${i}`} x1={i * shareCount * cellW2} y1={0} x2={i * shareCount * cellW2} y2={bottomH} style={{ stroke: palette.ink, strokeWidth: 2 }} />
        ))}
        <rect x={0} y={0} width={width} height={bottomH} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
        {/* Two short lines instead of one long one — SVG text doesn't wrap, and a
            single sentence this length (with a centered anchor) overflowed the
            viewBox on both sides, clipping into something like "2 lb each —
            2 of them..." instead of the intended "1/42 lb each — 2 of them...". */}
        <text x={width / 2} y={bottomH + 16} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
          each slice = 1/{totalCells} {unit}
        </text>
        <text x={width / 2} y={bottomH + 33} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
          {numerator} highlighted = one share ({numerator}/{totalCells} {unit})
        </text>
      </g>
    </svg>
  );
}
