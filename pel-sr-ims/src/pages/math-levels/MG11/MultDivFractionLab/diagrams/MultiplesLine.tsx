import { palette } from "../../../shared/lib/palette";

export interface MultiplesLineProps {
  a: number;
  b: number;
  /** Show multiples of a and b up through this value (usually the LCM, or a bit beyond for context). */
  upTo: number;
  width?: number;
  height?: number;
}

/** Two stacked rows of multiples (dots on a line), with the first shared multiple highlighted — the LCM visual for 6.NS.4. */
export function MultiplesLine({ a, b, upTo, width = 360, height = 110 }: MultiplesLineProps) {
  const multiplesOf = (n: number) => {
    const out: number[] = [];
    for (let k = n; k <= upTo; k += n) out.push(k);
    return out;
  };
  const aMultiples = multiplesOf(a);
  const bMultiples = multiplesOf(b);
  const lcmValue = aMultiples.find((m) => bMultiples.includes(m));
  const x = (v: number) => 24 + (v / upTo) * (width - 48);
  const rowA = 32;
  const rowB = height - 28;

  const Row = ({ y, values, color, n }: { y: number; values: number[]; color: string; n: number }) => (
    <g>
      <line x1={14} y1={y} x2={width - 14} y2={y} style={{ stroke: palette.line, strokeWidth: 1.5 }} />
      <text x={6} y={y + 4} textAnchor="end" style={{ fill: color, fontSize: 12, fontWeight: 700 }}>
        ×{n}
      </text>
      {values.map((v) => {
        const isLCM = v === lcmValue;
        return (
          <g key={v}>
            <circle cx={x(v)} cy={y} r={isLCM ? 7 : 5} style={{ fill: isLCM ? palette.c : color, stroke: palette.ink, strokeWidth: isLCM ? 2 : 1 }} />
            <text x={x(v)} y={y - 12} textAnchor="middle" style={{ fill: palette.ink, fontSize: 11, fontWeight: isLCM ? 700 : 400 }}>
              {v}
            </text>
          </g>
        );
      })}
    </g>
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={`Multiples of ${a} and ${b} up to ${upTo}`}>
      <Row y={rowA} values={aMultiples} color={palette.a} n={a} />
      <Row y={rowB} values={bMultiples} color={palette.b} n={b} />
      {lcmValue !== undefined && (
        <line x1={x(lcmValue)} y1={rowA} x2={x(lcmValue)} y2={rowB} style={{ stroke: palette.c, strokeWidth: 2, strokeDasharray: "4 3" }} />
      )}
    </svg>
  );
}
