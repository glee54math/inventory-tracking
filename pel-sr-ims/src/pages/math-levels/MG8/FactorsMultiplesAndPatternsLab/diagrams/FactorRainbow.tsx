import { palette } from "../../../shared/lib/palette";
import { factorPairs } from "../lib/numberTheory";

export interface FactorRainbowProps {
  n: number;
  /** How many pairs (in systematic order: 1 × n first) are found so far. Default: all. */
  pairsShown?: number;
  /** Index of a pair to draw in the second colour (e.g. the one just found). */
  highlight?: number;
  width?: number;
}

const GAP = 46;

/**
 * A factor "rainbow": n's factors in a row, smallest to largest, with an arc
 * joining each factor pair (1 and n on the outside, the closest pair in the
 * middle). A perfect square's middle factor gets a loop instead of an arc —
 * it pairs with ITSELF, so it is one pair but only one number. Only pairs
 * found so far are drawn, so the picture never shows a pair before the
 * student has found it. Pair data comes from factorPairs(), the same function
 * every answer check in this lab uses.
 */
export function FactorRainbow({ n, pairsShown, highlight, width = 520 }: FactorRainbowProps) {
  const all = factorPairs(n);
  const shown = all.slice(0, pairsShown ?? all.length);
  const small = shown.map(([a]) => a);
  const big = shown
    .map(([, b]) => b)
    .filter((b) => !small.includes(b))
    .reverse();
  const nums = [...small, ...big];
  const count = Math.max(nums.length, 1);
  const w = Math.max(count * GAP + 20, 160);
  const maxSpan = (count - 1) * GAP;
  const archH = Math.max(30, Math.min(110, maxSpan / 2 + 10));
  const baseY = archH + 26;
  const h = baseY + 34;
  const x = (v: number) => 10 + GAP / 2 + nums.indexOf(v) * GAP;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={Math.min(width, w * 1.3)} style={{ maxWidth: "100%" }} role="img" aria-label={`Factor pairs of ${n}: ${shown.map(([a, b]) => `${a} × ${b}`).join(", ") || "none found yet"}`}>
      {shown.map(([a, b], i) => {
        const tone = i === highlight ? palette.b : palette.a;
        if (a === b) {
          const cx = x(a);
          return <ellipse key={i} cx={cx} cy={baseY - 26} rx={12} ry={16} style={{ fill: "none", stroke: tone, strokeWidth: 3 }} />;
        }
        const x1 = x(a);
        const x2 = x(b);
        const r = (x2 - x1) / 2;
        const lift = Math.min(archH, r);
        return <path key={i} d={`M ${x1} ${baseY - 14} C ${x1} ${baseY - 14 - lift * 1.3}, ${x2} ${baseY - 14 - lift * 1.3}, ${x2} ${baseY - 14}`} style={{ fill: "none", stroke: tone, strokeWidth: 3 }} />;
      })}
      {nums.map((v) => (
        <g key={v}>
          <circle cx={x(v)} cy={baseY} r={17} style={{ fill: palette.paper, stroke: palette.ink, strokeWidth: 1.5 }} />
          <text x={x(v)} y={baseY + 5} textAnchor="middle" style={{ fill: palette.ink, fontSize: v >= 100 ? 13 : 15, fontWeight: 700 }}>
            {v}
          </text>
        </g>
      ))}
      <text x={w / 2} y={h - 4} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
        {shown.length === 0 ? `Factors of ${n}: none found yet` : `Factors of ${n}`}
      </text>
    </svg>
  );
}
