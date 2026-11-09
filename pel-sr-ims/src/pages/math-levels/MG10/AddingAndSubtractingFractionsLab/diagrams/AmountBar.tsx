import { palette, diagramFont } from "../../../shared/lib/palette";

export interface AmountBarProps {
  n: number;
  d: number;
  /** Draw at least this many whole bars (so every choice has the same number). */
  minWholes?: number;
  /** Width of ONE whole, the same as the bars it is compared with. */
  barWidth?: number;
  height?: number;
  /** Words for a screen reader, e.g. "Picture 2". */
  label?: string;
}

/**
 * An amount as a shaded length only: whole bars with their outlines, no lines
 * between pieces. For a "Which picture shows a + b?" choice (MG10 round 5,
 * C5-02): with piece lines, the right picture was always the one cut finest,
 * so it could be picked without comparing amounts. Laid out like PieceBars
 * (one svg per whole, wrapping, 10 px apart), so lengths line up with it.
 * Lab-local: only MG10 draws it.
 */
export function AmountBar({ n, d, minWholes = 1, barWidth = 180, height = 28, label }: AmountBarProps) {
  const wholes = Math.max(minWholes, Math.ceil(n / d));
  return (
    <div role="img" aria-label={label}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
        {Array.from({ length: wholes }, (_, w) => {
          // How much of this whole is shaded, from 0 to 1.
          const part = Math.min(1, Math.max(0, n / d - w));
          return (
            <svg key={w} viewBox={`0 0 ${barWidth + 4} ${height + 4}`} width={barWidth + 4} style={{ maxWidth: "100%", fontFamily: diagramFont, display: "block" }}>
              <g transform="translate(2 2)">
                <rect x={0} y={0} width={barWidth} height={height} style={{ fill: palette.paper }} />
                {part > 0 && <rect x={0} y={0} width={barWidth * part} height={height} style={{ fill: palette.c, fillOpacity: 0.85 }} />}
                <rect x={0} y={0} width={barWidth} height={height} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
              </g>
            </svg>
          );
        })}
      </div>
    </div>
  );
}
