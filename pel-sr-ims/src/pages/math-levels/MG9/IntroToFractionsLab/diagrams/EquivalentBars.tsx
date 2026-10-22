import { palette } from "../../../shared/lib/palette";
import { TwoTierBars } from "../../../shared/diagrams";

export interface EquivalentBarsProps {
  /** The fraction as given. */
  n: number;
  d: number;
  /** How many times each piece gets re-split — the bottom bar shows (n×k)/(d×k). */
  k: number;
  width?: number;
  topHeight?: number;
}

/**
 * Two stacked bars at one shared width (the TwoTierBars geometry, promoted
 * out of MG11's SharingBars): the top bar is n/d exactly as given; the
 * bottom bar is the SAME width re-partitioned into d×k cells, n×k of them
 * shaded, with a thick divider every k cells lining up exactly under the top
 * bar's own cell boundaries — "these k skinny pieces together are exactly
 * one of the top bar's pieces." Same shaded width in both bars is the whole
 * point: n/d and (n×k)/(d×k) are the same amount, just cut into a different
 * number of pieces.
 */
export function EquivalentBars({ n, d, k, width = 360, topHeight = 52 }: EquivalentBarsProps) {
  return (
    <TwoTierBars
      width={width}
      topHeight={topHeight}
      ariaLabel={`${n}/${d} and the equivalent fraction ${n * k}/${d * k}`}
      top={{
        cells: d,
        cellStyle: (i) => (i < n ? { fill: palette.a, fillOpacity: 0.85 } : { fill: palette.paper }),
        captions: [`${n}/${d}`],
      }}
      bottom={{
        cells: d * k,
        cellStyle: (i) => (i < n * k ? { fill: palette.a, fillOpacity: 0.85 } : { fill: palette.paper }),
        dividers: Array.from({ length: d + 1 }, (_, i) => i * k),
        captions: [`${n * k}/${d * k} — the same amount, cut into ${k}× as many pieces`],
      }}
    />
  );
}
