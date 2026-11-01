import { palette } from "../../../shared/lib/palette";

export interface HundredGridProps {
  /** Last number shown (default 100). Rows of 10. */
  max?: number;
  /** Shade every multiple of this number. */
  multiplesOf?: number;
  /** Only shade multiples up to and including this number (for "skip-count so far"). */
  shadeUpTo?: number;
  /** One number ringed in the second colour (the number being asked about). */
  target?: number;
  /** Numbers crossed out (e.g. composites in the sieve). */
  crossed?: number[];
  /** Numbers circled in the third colour (e.g. primes found by the sieve). */
  circled?: number[];
  /** Makes every cell clickable (Explore only). */
  onCellClick?: (n: number) => void;
  width?: number;
}

const CELL = 36;

/**
 * A 1-100 chart (10 per row). Shading multiples of k turns skip-counting into
 * a picture — multiples of 2 and 5 make columns, 9 makes a diagonal, 7 has
 * no simple pattern (which is why 7s are harder to recall). Also used for the
 * sieve in Prime or Composite (crossed composites, circled primes).
 */
export function HundredGrid({ max = 100, multiplesOf, shadeUpTo, target, crossed = [], circled = [], onCellClick, width = 380 }: HundredGridProps) {
  const rows = Math.ceil(max / 10);
  const w = 10 * CELL + 4;
  const h = rows * CELL + 4;
  const crossedSet = new Set(crossed);
  const circledSet = new Set(circled);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={`Hundred chart${multiplesOf ? ` with multiples of ${multiplesOf} shaded` : ""}${target ? `, ${target} ringed` : ""}`}>
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const cx = 2 + (i % 10) * CELL;
        const cy = 2 + Math.floor(i / 10) * CELL;
        const shaded = !!multiplesOf && n % multiplesOf === 0 && (shadeUpTo === undefined || n <= shadeUpTo);
        const isTarget = n === target;
        return (
          <g key={n} onClick={onCellClick ? () => onCellClick(n) : undefined} style={onCellClick ? { cursor: "pointer" } : undefined}>
            <rect x={cx} y={cy} width={CELL} height={CELL} style={{ fill: shaded ? palette.aSoft : palette.paper, stroke: palette.line, strokeWidth: 1 }} />
            {circledSet.has(n) && <circle cx={cx + CELL / 2} cy={cy + CELL / 2} r={14} style={{ fill: palette.cSoft, stroke: palette.c, strokeWidth: 2 }} />}
            <text
              x={cx + CELL / 2}
              y={cy + CELL / 2 + 5}
              textAnchor="middle"
              style={{ fill: crossedSet.has(n) ? palette.muted : shaded ? palette.a : palette.ink, fontSize: n === 100 ? 12 : 14, fontWeight: shaded || circledSet.has(n) ? 700 : 500 }}
            >
              {n}
            </text>
            {crossedSet.has(n) && <line x1={cx + 7} y1={cy + CELL - 7} x2={cx + CELL - 7} y2={cy + 7} style={{ stroke: palette.bad, strokeWidth: 2 }} />}
            {isTarget && <rect x={cx + 2} y={cy + 2} width={CELL - 4} height={CELL - 4} rx={4} style={{ fill: "none", stroke: palette.b, strokeWidth: 3 }} />}
          </g>
        );
      })}
    </svg>
  );
}
