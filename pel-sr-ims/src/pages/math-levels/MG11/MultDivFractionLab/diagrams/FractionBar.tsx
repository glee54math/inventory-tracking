import { palette } from "../../../shared/lib/palette";
import { gcd } from "../../../shared/lib/math";

export interface FractionBarProps {
  numerator: number;
  denominator: number;
  width?: number;
  height?: number;
  /**
   * When set, also draws thicker dividers grouping the `denominator` cells
   * into `shareCount` equal share-groups (the partitive "N people share this"
   * visual) — only meaningful when denominator is a multiple of shareCount.
   */
  shareCount?: number;
  /** Which share-group (0-indexed) to tint distinctly — "this is one share." */
  highlightShare?: number;
  label?: string;
}

/**
 * A single fraction as a shaded bar, split into `denominator` equal cells with
 * the first `numerator` shaded. The base building block for the fraction-
 * division unit's visuals — used alone for partitive sharing problems (with
 * shareCount/highlightShare), and as a component of FractionMeasureStrip for
 * quotitive (measurement) problems.
 */
export function FractionBar({ numerator, denominator, width = 320, height = 64, shareCount, highlightShare, label }: FractionBarProps) {
  const cellW = width / denominator;
  const shareSize = shareCount ? denominator / shareCount : 0;

  return (
    <svg viewBox={`0 0 ${width} ${height + (label ? 22 : 0)}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={label ?? `${numerator} of ${denominator} parts shaded`}>
      {Array.from({ length: denominator }, (_, i) => {
        const shaded = i < numerator;
        const inHighlightShare = shareCount && highlightShare !== undefined && Math.floor(i / shareSize) === highlightShare;
        return (
          <rect
            key={i}
            x={i * cellW}
            y={0}
            width={cellW}
            height={height}
            style={{
              fill: inHighlightShare ? palette.c : shaded ? palette.a : palette.paper,
              fillOpacity: inHighlightShare ? 0.9 : shaded ? 0.85 : 1,
              stroke: palette.line,
              strokeWidth: 1,
            }}
          />
        );
      })}
      {shareCount &&
        Array.from({ length: shareCount - 1 }, (_, i) => (
          <line key={`div-${i}`} x1={(i + 1) * shareSize * cellW} y1={0} x2={(i + 1) * shareSize * cellW} y2={height} style={{ stroke: palette.ink, strokeWidth: 2.5 }} />
        ))}
      <rect x={0} y={0} width={width} height={height} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
      {label && (
        <text x={width / 2} y={height + 16} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
          {label}
        </text>
      )}
    </svg>
  );
}

/** Reduce a/b for display captions elsewhere, without pulling in all of lib/math. */
export const simplifyCaption = (a: number, b: number): string => {
  const g = gcd(a, b);
  return g > 1 ? `${a / g}/${b / g}` : `${a}/${b}`;
};
