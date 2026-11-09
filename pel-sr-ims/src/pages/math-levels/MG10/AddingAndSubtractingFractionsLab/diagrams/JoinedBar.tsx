import { palette, diagramFont } from "../../../shared/lib/palette";

export interface JoinedBarProps {
  n1: number;
  d1: number;
  n2: number;
  d2: number;
  /** Width of ONE whole, the same as the bars above it. */
  barWidth?: number;
  height?: number;
}

/**
 * The two shaded parts put end to end, each in its OWN piece size (halves,
 * then thirds), inside whole bars marked 0, 1, 2 below. Nothing is re-cut
 * and no number is printed, so it answers "about how much is the sum?" by
 * length alone: more than the bigger part, and more or less than 1 (MG10
 * round 5, Unit 1's estimate and "which picture?" help). A piece may cross
 * the line at 1: that is what a sum past 1 looks like. Lab-local.
 */
export function JoinedBar({ n1, d1, n2, d2, barWidth = 200, height = 34 }: JoinedBarProps) {
  const total = n1 / d1 + n2 / d2;
  const wholes = Math.max(1, Math.ceil(total - 1e-9));
  const W = barWidth * wholes;
  const pieces = [
    ...Array.from({ length: n1 }, (_, i) => ({ x: (i / d1) * barWidth, w: barWidth / d1, fill: palette.a })),
    ...Array.from({ length: n2 }, (_, i) => ({ x: (n1 / d1 + i / d2) * barWidth, w: barWidth / d2, fill: palette.b })),
  ];
  const labelY = height + 18;
  return (
    <svg viewBox={`-8 -2 ${W + 16} ${height + 24}`} width={W + 16} style={{ maxWidth: "100%", fontFamily: diagramFont, display: "block" }} role="img" aria-label="The two shaded parts put end to end">
      {Array.from({ length: wholes }, (_, k) => (
        <rect key={`w${k}`} x={k * barWidth} y={0} width={barWidth} height={height} style={{ fill: palette.paper, stroke: palette.line, strokeWidth: 1 }} />
      ))}
      {pieces.map((p, i) => (
        <rect key={i} x={p.x} y={0} width={p.w} height={height} style={{ fill: p.fill, fillOpacity: 0.85, stroke: palette.line, strokeWidth: 1 }} />
      ))}
      {Array.from({ length: wholes }, (_, k) => (
        <rect key={`o${k}`} x={k * barWidth} y={0} width={barWidth} height={height} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
      ))}
      {Array.from({ length: wholes + 1 }, (_, k) => (
        <text key={`t${k}`} x={k * barWidth} y={labelY} textAnchor="middle" style={{ fill: palette.ink, fontSize: 14, fontWeight: 700 }}>
          {k}
        </text>
      ))}
    </svg>
  );
}
