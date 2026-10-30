import { palette } from "../../../shared/lib/palette";
import { TwoTierBars } from "../../../shared/diagrams";

export interface EquivalentBarsProps {
  /** The fraction as given. */
  n1: number;
  d1: number;
  /** The second fraction — may or may not actually be equivalent to the
   *  first (the "nonexample" bucket deliberately passes a near-miss pair so
   *  the two shaded widths visibly DON'T line up). */
  n2: number;
  d2: number;
  width?: number;
  topHeight?: number;
}

/**
 * Two stacked bars at one shared pixel width (shared TwoTierBars geometry):
 * the top bar is n1/d1, the bottom is n2/d2, each partitioned into its OWN
 * denominator's number of cells. When the two fractions are genuinely
 * equivalent the shaded regions line up edge-to-edge; when they're not (the
 * nonexample bucket), the mismatch is visible without any arithmetic.
 *
 * Deliberately parameterized by two independent (numerator, denominator)
 * pairs rather than MG9_IntroToFractionsLab's EquivalentBars (n, d, k —
 * "multiply both by k") — this lab's plan explicitly keeps equivalence to a
 * fixed, hand-picked list of "simple" pairs within the 2/3/4/6/8 denominator
 * set (see FractionsFoundationsLab/units/EquivalentFractions.tsx's PAIRS),
 * not MG9's general n×k/d×k scaling reasoning, which is deferred to that
 * later lab. Built on the same promoted shared/diagrams/TwoTierBars
 * primitive MG9's version uses, so no new diagram geometry was needed.
 */
export function EquivalentBars({ n1, d1, n2, d2, width = 360, topHeight = 52 }: EquivalentBarsProps) {
  return (
    <TwoTierBars
      width={width}
      topHeight={topHeight}
      ariaLabel={`${n1}/${d1} and ${n2}/${d2}`}
      top={{
        cells: d1,
        cellStyle: (i) => (i < n1 ? { fill: palette.a, fillOpacity: 0.85 } : { fill: palette.paper }),
        captions: [`${n1}/${d1}`],
      }}
      bottom={{
        cells: d2,
        cellStyle: (i) => (i < n2 ? { fill: palette.a, fillOpacity: 0.85 } : { fill: palette.paper }),
        captions: [`${n2}/${d2}`],
      }}
    />
  );
}
