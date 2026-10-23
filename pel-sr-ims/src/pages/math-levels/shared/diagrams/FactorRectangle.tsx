import { palette } from "../lib/palette";

export interface FactorRectangleProps {
  rows: number;
  cols: number;
  width?: number;
  height?: number;
  /**
   * Splits `cols` into two groups (e.g. [9, 2] for 36+8 = 4×9 + 4×2), drawing
   * two labeled sub-rectangles sharing `rows` as their height — the
   * distributive-property visual. cols[0] + cols[1] must equal `cols`.
   */
  splitCols?: [number, number];
  label?: string;
}

const MAX_GRIDLINES = 12;

/**
 * A proportional, schematic rectangle for rows × cols (factor-pair / area
 * model). Gridlines are drawn literally up to MAX_GRIDLINES per side; beyond
 * that the block is shown as a single proportional region with edge tick
 * labels only, so numbers up to 100 stay readable instead of rendering
 * hundreds of unit squares.
 *
 * Promoted here from MG11/MultDivFractionLab/diagrams/ (2026-10-23) once a
 * third real consumer showed up (MM1/ExponentsAndExpressionsLab's
 * distributive-property unit) — it already had two separate-lab consumers
 * (MG11_MultDivFractionLab's own FactorsMultiples.tsx, and
 * MG9_IntroToFractionsLab's SimplifyingFractions.tsx importing it cross-folder),
 * right at the documented "promote once a third use shows up" threshold.
 * Behavior is unchanged — only the palette import path moved (one less
 * directory level from shared/diagrams/ than from MG11/MultDivFractionLab/diagrams/).
 */
export function FactorRectangle({ rows, cols, width = 320, height = 160, splitCols, label }: FactorRectangleProps) {
  const cellW = width / cols;
  const cellH = height / rows;
  const literalCols = cols <= MAX_GRIDLINES;
  const literalRows = rows <= MAX_GRIDLINES;

  return (
    <svg viewBox={`-32 -22 ${width + 32} ${height + 62}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={label ?? `A ${rows} by ${cols} rectangle`}>
      <rect x={0} y={0} width={width} height={height} style={{ fill: palette.aSoft, stroke: palette.ink, strokeWidth: 2 }} />
      {literalCols &&
        Array.from({ length: cols - 1 }, (_, i) => (
          <line key={`c${i}`} x1={(i + 1) * cellW} y1={0} x2={(i + 1) * cellW} y2={height} style={{ stroke: palette.grid, strokeWidth: 1 }} />
        ))}
      {literalRows &&
        Array.from({ length: rows - 1 }, (_, i) => (
          <line key={`r${i}`} x1={0} y1={(i + 1) * cellH} x2={width} y2={(i + 1) * cellH} style={{ stroke: palette.grid, strokeWidth: 1 }} />
        ))}
      {splitCols && (
        <>
          <line x1={splitCols[0] * cellW} y1={0} x2={splitCols[0] * cellW} y2={height} style={{ stroke: palette.ink, strokeWidth: 3 }} />
          <rect x={splitCols[0] * cellW} y={0} width={splitCols[1] * cellW} height={height} style={{ fill: palette.cSoft, fillOpacity: 0.6 }} />
          <text x={(splitCols[0] * cellW) / 2} y={height + 18} textAnchor="middle" style={{ fill: palette.ink, fontSize: 14, fontWeight: 700 }}>
            {rows} × {splitCols[0]}
          </text>
          <text x={splitCols[0] * cellW + (splitCols[1] * cellW) / 2} y={height + 18} textAnchor="middle" style={{ fill: palette.ink, fontSize: 14, fontWeight: 700 }}>
            {rows} × {splitCols[1]}
          </text>
        </>
      )}
      {!splitCols && (
        <text x={width / 2} y={height + 18} textAnchor="middle" style={{ fill: palette.ink, fontSize: 14, fontWeight: 700 }}>
          {rows} × {cols}
        </text>
      )}
      <text x={-6} y={height / 2} textAnchor="end" dominantBaseline="middle" style={{ fill: palette.muted, fontSize: 13 }}>
        {rows}
      </text>
      <text x={width / 2} y={-6} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
        {cols}
      </text>
    </svg>
  );
}
