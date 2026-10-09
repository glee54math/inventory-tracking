import { palette } from "../../../shared/lib/palette";

export interface AreaRectangleProps {
  /** The known area, e.g. [1,2] for 1/2. */
  area: [number, number];
  /** The known length (top edge), e.g. [2,7] for 2/7. */
  length: [number, number];
  unit?: string;
  width?: number;
  height?: number;
}

/**
 * The area-model rectangle for "area ÷ length = width" problems — same label
 * placement as FactorRectangle (the horizontal factor on top, the vertical one
 * on the left), so this reads as the same kind of picture a student has
 * already seen elsewhere in the lab. Width is left as "?" since that's what
 * the steps ask the student to solve for; showing the formula as a picture
 * here means the story text doesn't have to spell it out in words.
 */
export function AreaRectangle({ area, length, unit = "mi", width = 280, height = 140 }: AreaRectangleProps) {
  const [an, ad] = area;
  const [ln, ld] = length;

  return (
    <svg
      viewBox={`-90 -34 ${width + 110} ${height + 74}`}
      width={width}
      style={{ maxWidth: "100%" }}
      role="img"
      aria-label={`A rectangle with area ${an}/${ad} square ${unit} and length ${ln}/${ld} ${unit}; width is unknown`}
    >
      <rect x={0} y={0} width={width} height={height} style={{ fill: palette.aSoft, stroke: palette.ink, strokeWidth: 2 }} />
      <text x={width / 2} y={height / 2 - 4} textAnchor="middle" style={{ fill: palette.a, fontSize: 17, fontWeight: 700 }}>
        Area = {an}/{ad}
      </text>
      <text x={width / 2} y={height / 2 + 16} textAnchor="middle" style={{ fill: palette.a, fontSize: 13 }}>
        sq {unit}
      </text>

      {/* length: top edge */}
      <text x={width / 2} y={-16} textAnchor="middle" style={{ fill: palette.b, fontSize: 14, fontWeight: 700 }}>
        length = {ln}/{ld} {unit}
      </text>
      <line x1={0} y1={-6} x2={width} y2={-6} style={{ stroke: palette.b, strokeWidth: 2 }} />
      <line x1={0} y1={-10} x2={0} y2={-2} style={{ stroke: palette.b, strokeWidth: 2 }} />
      <line x1={width} y1={-10} x2={width} y2={-2} style={{ stroke: palette.b, strokeWidth: 2 }} />

      {/* width: left edge, unknown */}
      <text x={-14} y={height / 2} textAnchor="end" dominantBaseline="middle" style={{ fill: palette.c, fontSize: 14, fontWeight: 700 }}>
        width = ?
      </text>
      <line x1={-6} y1={0} x2={-6} y2={height} style={{ stroke: palette.c, strokeWidth: 2 }} />
      <line x1={-10} y1={0} x2={-2} y2={0} style={{ stroke: palette.c, strokeWidth: 2 }} />
      <line x1={-10} y1={height} x2={-2} y2={height} style={{ stroke: palette.c, strokeWidth: 2 }} />

      {/* the formula, color-coded to match the rectangle's labels */}
      <text x={width / 2} y={height + 34} textAnchor="middle" style={{ fontSize: 15, fontWeight: 700 }}>
        <tspan style={{ fill: palette.a }}>Area</tspan>
        <tspan style={{ fill: palette.ink }}> = </tspan>
        <tspan style={{ fill: palette.b }}>length</tspan>
        <tspan style={{ fill: palette.ink }}> × </tspan>
        <tspan style={{ fill: palette.c }}>width</tspan>
      </text>
    </svg>
  );
}
