import { palette, diagramFont } from "../../../shared/lib/palette";

export interface FractionNumberLineProps {
  /** How many equal parts each whole is divided into. */
  denominator: number;
  /** The value to mark, as a raw numerator over `denominator` (e.g. 17 for 17/6). */
  numerator: number;
  /** "fraction" labels every tick as k/denominator, never simplified (0, 1/6,
   *  2/6, ... 6/6, 7/6, ...); "mixed" labels the same positions with whole
   *  numbers bare ("1", "2") and the rest as a mixed number ("1 1/6") — the
   *  same tick positions, read two different ways. */
  labelStyle: "fraction" | "mixed";
}

const TICK_PX = 44;
const PAD_X = 20;
const HEIGHT = 56;
const MID_Y = 24;

function tickLabel(k: number, den: number, style: "fraction" | "mixed"): string {
  if (k === 0) return "0";
  if (style === "fraction") return `${k}/${den}`;
  const whole = Math.floor(k / den);
  const leftover = k % den;
  return leftover === 0 ? `${whole}` : `${whole} ${leftover}/${den}`;
}

/**
 * A number line with EVERY 1/denominator tick labeled, not just whole
 * numbers — from 0 up to the smallest whole number at or above
 * numerator/denominator. Meant to be rendered twice side by side with the
 * same numerator/denominator (once per labelStyle) so the two lines show the
 * identical set of tick positions, just named two ways — the number-line
 * counterpart to WholePlusPartBar/WholePlusPartCircles' "same picture, two
 * names" idea elsewhere in this unit.
 *
 * Deliberately its own component rather than a mode on
 * shared/diagrams/NumberLine.tsx: that component's tick math is built around
 * a single whole-number "step" that compresses to fit a wide range, and its
 * one sub-unit feature (minorTicksPerUnit) draws those ticks WITHOUT labels
 * by design — the opposite of what labeling every fractional tick needs.
 * Wrapped in a horizontally-scrolling container since a large denominator
 * (this unit generates up to 8) produces a genuinely wide diagram.
 */
export function FractionNumberLine({ denominator, numerator, labelStyle }: FractionNumberLineProps) {
  const maxWhole = Math.max(1, Math.ceil(numerator / denominator));
  const tickCount = maxWhole * denominator + 1;
  const width = PAD_X * 2 + (tickCount - 1) * TICK_PX;
  const toX = (k: number) => PAD_X + k * TICK_PX;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${width} ${HEIGHT}`}
        width={width}
        style={{ display: "block", fontFamily: diagramFont }}
        role="img"
        aria-label={`Number line from 0 to ${maxWhole}, marked at ${numerator}/${denominator}`}
      >
        <line x1={PAD_X} y1={MID_Y} x2={width - PAD_X} y2={MID_Y} stroke={palette.line} strokeWidth={2} />
        {Array.from({ length: tickCount }, (_, k) => {
          const isWhole = k % denominator === 0;
          const isMarked = k === numerator;
          return (
            <g key={k}>
              <line x1={toX(k)} y1={MID_Y - (isWhole ? 7 : 5)} x2={toX(k)} y2={MID_Y + (isWhole ? 7 : 5)} stroke={isWhole ? palette.ink : palette.line} strokeWidth={isWhole ? 2.5 : 1.5} />
              <text x={toX(k)} y={MID_Y + 20} textAnchor="middle" fontSize={12} fontWeight={isWhole || isMarked ? 800 : 400} fill={isMarked ? palette.a : isWhole ? palette.ink : palette.muted}>
                {tickLabel(k, denominator, labelStyle)}
              </text>
            </g>
          );
        })}
        <circle cx={toX(numerator)} cy={MID_Y} r={6} fill={palette.a} stroke={palette.paper} strokeWidth={2} />
      </svg>
    </div>
  );
}
