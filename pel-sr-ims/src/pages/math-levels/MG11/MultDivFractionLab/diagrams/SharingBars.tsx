import { palette } from "../../../shared/lib/palette";
import { TwoTierBars } from "../../../shared/diagrams";

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
 * Renders on the shared TwoTierBars primitive (the stacked-bars-plus-dashed-
 * guides geometry, extracted here once MG9's Introduction To Fractions
 * needed the same technique for equivalent/simplified fractions) — this
 * component now only supplies the partitive fill/caption/divider logic.
 */
export function SharingBars({ numerator, denominator, shareCount, unit = "lb", width = 360, height = 52 }: SharingBarsProps) {
  const totalCells = denominator * shareCount;

  return (
    <TwoTierBars
      width={width}
      topHeight={height}
      ariaLabel={`${numerator}/${denominator} ${unit}, split ${shareCount} ways`}
      top={{
        cells: denominator,
        cellStyle: (i) => (i < numerator ? { fill: palette.a, fillOpacity: 0.85 } : { fill: palette.paper }),
        captions: [`${numerator}/${denominator} ${unit} — what we have`],
      }}
      bottom={{
        cells: totalCells,
        cellStyle: (i) => {
          const group = Math.floor(i / shareCount);
          const posInGroup = i % shareCount;
          const active = group < numerator;
          const isTheShare = active && posInGroup === 0;
          return isTheShare ? { fill: palette.c, fillOpacity: 0.9 } : active ? { fill: palette.a, fillOpacity: 0.85 } : { fill: palette.paper };
        },
        dividers: Array.from({ length: denominator + 1 }, (_, i) => i * shareCount),
        // Two short lines instead of one long one — SVG text doesn't wrap, and a
        // single sentence this length (with a centered anchor) overflowed the
        // viewBox on both sides, clipping into something like "2 lb each —
        // 2 of them..." instead of the intended "1/42 lb each — 2 of them...".
        captions: [`each slice = 1/${totalCells} ${unit}`, `${numerator} highlighted = one share (${numerator}/${totalCells} ${unit})`],
      }}
    />
  );
}
