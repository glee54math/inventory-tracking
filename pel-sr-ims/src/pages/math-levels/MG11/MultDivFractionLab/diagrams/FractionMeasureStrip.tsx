import { palette } from "../../../shared/lib/palette";
import { gcd, lcm } from "../../../shared/lib/math";
import { spokenFractions } from "../../../shared/components/MathText";
import { SvgMath, SvgMathLine } from "../../../shared/components/SvgMath";

export interface FractionMeasureStripProps {
  /** The amount being measured out, e.g. [2,3] for 2/3. */
  dividend: [number, number];
  /** The size of each measuring segment, e.g. [3,4] for 3/4. */
  divisor: [number, number];
  width?: number;
  height?: number;
}

/**
 * Quotitive ("how many groups of this size fit?") division model, drawn as two
 * aligned bars so a first-time learner has a "whole" to anchor to instead of
 * just a lone, unexplained strip:
 *  - Top bar: the dividend shown the same way FractionBar shows it elsewhere in
 *    this unit — the WHOLE cup split into its own denominator's cells, with the
 *    amount you have shaded. This is what supplies the "whole" reference.
 *  - Bottom ruler: sits directly under the shaded portion only (same width),
 *    marked off in divisor-sized servings, with the leftover segment captioned
 *    as a fraction OF A SERVING (not of a cup) to avoid the two fractions being
 *    misread as the same kind of amount.
 * Both bars share one common-unit cell size (L = lcm of the two denominators)
 * so every boundary lands exactly — the same reasoning that makes (a/b)/(c/d) =
 * ad/bc fall out visually: the dividend is a*(L/b) unit-cells long, each
 * segment is c*(L/d) cells, and the number of segments is their ratio.
 */
export function FractionMeasureStrip({ dividend, divisor, width = 360, height = 52 }: FractionMeasureStripProps) {
  const [a, b] = dividend;
  const [c, d] = divisor;
  const L = lcm(b, d);
  const dividendCells = a * (L / b); // dividend expressed in L-unit cells
  const segmentCells = c * (L / d); // one divisor-segment, in L-unit cells

  const fullSegments = Math.floor(dividendCells / segmentCells);
  const leftoverCells = dividendCells - fullSegments * segmentCells;
  const g = gcd(leftoverCells, segmentCells);
  const leftoverLabel = leftoverCells > 0 ? `${leftoverCells / g}/${segmentCells / g}` : null;

  const topCellW = width / b; // top bar's own cells (one whole cup across the full width)
  const haveWidth = width * (a / b); // width of the shaded "what you have" portion
  // Captions hold stacked (handwritten) fractions, so each caption row is taller.
  const rulerY = height + 56; // top bar + its caption + a gap before the ruler
  const totalHeight = rulerY + height + (leftoverLabel ? 64 : 32);

  return (
    <svg
      viewBox={`0 0 ${width} ${totalHeight}`}
      width={width}
      style={{ maxWidth: "100%" }}
      role="img"
      aria-label={spokenFractions(`${a}/${b} cup, measured in ${c}/${d}-cup servings`)}
    >
      {/* top bar: one whole cup, split into b equal cells, a of them shaded */}
      {Array.from({ length: b }, (_, i) => (
        <rect
          key={i}
          x={i * topCellW}
          y={0}
          width={topCellW}
          height={height}
          style={{ fill: i < a ? palette.a : palette.paper, fillOpacity: i < a ? 0.85 : 1, stroke: palette.line, strokeWidth: 1 }}
        />
      ))}
      <rect x={0} y={0} width={width} height={height} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
      <SvgMathLine text={`${a}/${b} cup — what you have`} x={width / 2} y={height + 26} fontSize={13} color={palette.muted} />

      {/* dashed guides tying the shaded portion above to the ruler below */}
      <line x1={0} y1={height + 40} x2={0} y2={rulerY} style={{ stroke: palette.line, strokeWidth: 1, strokeDasharray: "3 3" }} />
      <line x1={haveWidth} y1={height + 40} x2={haveWidth} y2={rulerY} style={{ stroke: palette.line, strokeWidth: 1, strokeDasharray: "3 3" }} />

      {/* bottom ruler: spans only the shaded width, marked off in divisor-sized servings */}
      <g transform={`translate(0, ${rulerY})`}>
        {Array.from({ length: fullSegments + (leftoverCells > 0 ? 1 : 0) }, (_, i) => {
          const startCells = i * segmentCells;
          const x0 = (startCells / dividendCells) * haveWidth;
          const segW = (Math.min(segmentCells, dividendCells - startCells) / dividendCells) * haveWidth;
          const isPartial = i === fullSegments;
          return (
            <g key={`seg-${i}`}>
              <rect x={x0} y={0} width={segW} height={height} style={{ fill: isPartial ? palette.cSoft : palette.bSoft, stroke: isPartial ? palette.c : palette.b, strokeWidth: 2 }} />
              {isPartial && leftoverLabel ? (
                <SvgMath text={leftoverLabel} x={x0 + segW / 2} y={height / 2} fontSize={14} color={palette.ink} weight={700} />
              ) : (
                <text x={x0 + segW / 2} y={height / 2 + 5} textAnchor="middle" style={{ fill: palette.ink, fontSize: 14, fontWeight: 700 }}>
                  {i + 1}
                </text>
              )}
            </g>
          );
        })}
        <SvgMathLine text={`${c}/${d}-cup servings`} x={width / 2} y={height + 26} fontSize={13} color={palette.muted} />
        {leftoverLabel && <SvgMathLine text={`last one is only ${leftoverLabel} of a serving`} x={width / 2} y={height + 58} fontSize={12} color={palette.muted} />}
      </g>
    </svg>
  );
}
