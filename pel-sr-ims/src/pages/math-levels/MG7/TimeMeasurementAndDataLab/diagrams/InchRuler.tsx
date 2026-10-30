import { palette, diagramFont } from "../../../shared/lib/palette";

export interface InchRulerProps {
  /** Whole inches the ruler is marked to (0..maxInches). */
  maxInches: number;
  /** The object's true quarter-inch length — the graded answer. */
  lengthQuarter: number;
  /** Purely visual offset (in inches, |offset| < 1/8) so the object's end
   *  sits slightly off a tick mark, the way a real object does — the
   *  NEAREST quarter is still always `lengthQuarter`, since any offset under
   *  1/8 inch can't cross the halfway point to a neighboring quarter mark. */
  offset?: number;
  glyph?: string;
  tone?: "a" | "b" | "c";
}

const PX_PER_IN = 70;
const PAD = 18;
const OBJ_Y = 14;
const OBJ_H = 26;
const RULER_Y = 52;
const RULER_H = 44;

/**
 * An inch ruler marked in whole (tallest, labeled), half (medium), and
 * quarter (shortest) inches, with an object bar laid along it starting at 0.
 * Same tick-height convention as LinePlot, so "the short tick after 3" means
 * the same thing on the ruler as on the plot the student then fills in.
 */
export function InchRuler({ maxInches, lengthQuarter, offset = 0, glyph, tone = "a" }: InchRulerProps) {
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const safeOffset = Math.max(-0.1, Math.min(0.1, offset));
  const drawn = lengthQuarter + safeOffset;
  const width = PAD * 2 + maxInches * PX_PER_IN;
  const height = RULER_Y + RULER_H + 6;
  const ticks: { x: number; h: number; label?: string }[] = [];
  for (let q = 0; q <= maxInches * 4; q++) {
    const kind = q % 4 === 0 ? "whole" : q % 2 === 0 ? "half" : "quarter";
    ticks.push({ x: PAD + (q / 4) * PX_PER_IN, h: kind === "whole" ? 22 : kind === "half" ? 15 : 9, label: kind === "whole" ? String(q / 4) : undefined });
  }
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`An object laid along an inch ruler marked in whole, half, and quarter inches`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      <rect x={PAD} y={OBJ_Y} width={drawn * PX_PER_IN} height={OBJ_H} rx={6} fill={fill} opacity={0.35} stroke={fill} strokeWidth={2} />
      {glyph && (
        <text x={PAD + 8} y={OBJ_Y + OBJ_H - 7} fontSize={18}>
          {glyph}
        </text>
      )}
      <rect x={PAD - 6} y={RULER_Y} width={maxInches * PX_PER_IN + 12} height={RULER_H} rx={4} fill={palette.paper} stroke={palette.line} strokeWidth={2} />
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={t.x} y1={RULER_Y} x2={t.x} y2={RULER_Y + t.h} stroke={palette.ink} strokeWidth={t.label ? 2 : 1.25} />
          {t.label && (
            <text x={t.x} y={RULER_Y + RULER_H - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={palette.ink}>
              {t.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
