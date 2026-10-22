import { palette } from "../../../shared/lib/palette";
import { TwoTierBars } from "../../../shared/diagrams";

export interface SimplifyBeforeAfterProps {
  /** The fraction as given (before simplifying). */
  num: number;
  den: number;
  /** The simplified fraction (after dividing both by the GCF). */
  simpleNum: number;
  simpleDen: number;
  width?: number;
  topHeight?: number;
}

/**
 * Two stacked bars at one shared width (the TwoTierBars geometry, promoted
 * out of MG11's SharingBars): the top bar is num/den exactly as given; the
 * bottom bar is the SAME width regrouped into simpleDen (fewer, bigger)
 * cells, simpleNum of them shaded — same shaded width in both bars, so
 * "simplified" visibly means the same amount with fewer pieces, not a
 * different amount reached by some arithmetic trick.
 */
export function SimplifyBeforeAfter({ num, den, simpleNum, simpleDen, width = 360, topHeight = 52 }: SimplifyBeforeAfterProps) {
  return (
    <TwoTierBars
      width={width}
      topHeight={topHeight}
      ariaLabel={`${num}/${den} simplifies to ${simpleNum}/${simpleDen}`}
      top={{
        cells: den,
        cellStyle: (i) => (i < num ? { fill: palette.a, fillOpacity: 0.85 } : { fill: palette.paper }),
        captions: [`${num}/${den} — before simplifying`],
      }}
      bottom={{
        cells: simpleDen,
        cellStyle: (i) => (i < simpleNum ? { fill: palette.c, fillOpacity: 0.85 } : { fill: palette.paper }),
        captions: [`${simpleNum}/${simpleDen} — same amount, fewer pieces`],
      }}
    />
  );
}
