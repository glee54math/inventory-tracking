import { palette } from "../../../shared/lib/palette";
import { gcd, lcm } from "../../../shared/lib/math";

export interface FractionMeasureStripProps {
  /** The amount being measured out, e.g. [2,3] for 2/3. */
  dividend: [number, number];
  /** The size of each measuring segment, e.g. [3,4] for 3/4. */
  divisor: [number, number];
  width?: number;
  height?: number;
}

/**
 * Quotitive ("how many groups of this size fit?") division model: a bar
 * representing the dividend, marked off in divisor-sized segments, with the
 * final partial segment shaded differently so the leftover fraction is
 * visible. Both fractions are converted to a common unit (L = lcm of the two
 * denominators) so segment boundaries land exactly — this is also literally
 * how (a/b)/(c/d) = ad/bc falls out: the dividend is a*(L/b) unit-cells long,
 * each segment is c*(L/d) cells, and the number of segments is their ratio.
 */
export function FractionMeasureStrip({ dividend, divisor, width = 360, height = 70 }: FractionMeasureStripProps) {
  const [a, b] = dividend;
  const [c, d] = divisor;
  const L = lcm(b, d);
  const dividendCells = a * (L / b); // dividend expressed in L-unit cells
  const segmentCells = c * (L / d); // one divisor-segment, in L-unit cells
  const cellW = width / dividendCells;

  const fullSegments = Math.floor(dividendCells / segmentCells);
  const leftoverCells = dividendCells - fullSegments * segmentCells;
  const g = gcd(leftoverCells, segmentCells);
  const leftoverLabel = leftoverCells > 0 ? `${leftoverCells / g}/${segmentCells / g}` : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height + 24}`}
      width={width}
      style={{ maxWidth: "100%" }}
      role="img"
      aria-label={`Measuring ${a}/${b} in segments of ${c}/${d}`}
    >
      {Array.from({ length: dividendCells }, (_, i) => {
        const inPartial = i >= fullSegments * segmentCells;
        return (
          <rect
            key={i}
            x={i * cellW}
            y={0}
            width={cellW}
            height={height}
            style={{ fill: inPartial ? palette.cSoft : palette.aSoft, stroke: palette.grid, strokeWidth: 0.5 }}
          />
        );
      })}
      {Array.from({ length: fullSegments + (leftoverCells > 0 ? 1 : 0) }, (_, i) => {
        const x0 = i * segmentCells * cellW;
        const segW = Math.min(segmentCells, dividendCells - i * segmentCells) * cellW;
        const isPartial = i === fullSegments;
        return (
          <g key={`seg-${i}`}>
            <rect x={x0} y={0} width={segW} height={height} style={{ fill: "none", stroke: isPartial ? palette.c : palette.a, strokeWidth: 2.5 }} />
            <text x={x0 + segW / 2} y={height / 2 + 5} textAnchor="middle" style={{ fill: palette.ink, fontSize: 14, fontWeight: 700 }}>
              {isPartial ? leftoverLabel : i + 1}
            </text>
          </g>
        );
      })}
      <rect x={0} y={0} width={width} height={height} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
      <text x={width / 2} y={height + 18} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
        {a}/{b} measured in {c}/{d}-sized pieces
      </text>
    </svg>
  );
}
