import { palette } from "../../../shared/lib/palette";
import { simplify } from "../../../shared/lib/math";

export interface AreaRectangleProps {
  /** The rectangle's actual length (top edge), e.g. [2,7] for 2/7. */
  length: [number, number];
  /** The rectangle's actual width (left edge), e.g. [1,2] for 1/2. */
  width: [number, number];
  /** Which of the three shows as "?" — the other two show their real values. */
  find: "length" | "width" | "area";
  unit?: string;
  /** Max bounding box, in pixels, for the drawn rectangle — NOT the width quantity above. */
  boxWidth?: number;
  boxHeight?: number;
}

/**
 * The area-model rectangle for "area = length × width" problems, with
 * whichever one of the three the student is solving for left as "?" — same
 * label placement as FactorRectangle (the horizontal factor on top, the
 * vertical one on the left), so this reads as the same kind of picture a
 * student has already seen elsewhere in the lab. Showing the formula as a
 * picture here means the story text doesn't have to spell it out in words.
 */
export function AreaRectangle({ length, width, find, unit = "mi", boxWidth = 280, boxHeight = 140 }: AreaRectangleProps) {
  const [ln, ld] = length;
  const [wn, wd] = width;
  const [an, ad] = simplify(ln * wn, ld * wd);

  // Draw the rectangle at the actual length:width ratio (not a generic box),
  // so the picture never implies the wrong side is longer — using the REAL
  // length/width even when one of them is the unknown "?" being solved for,
  // so the picture still matches reality instead of a placeholder guess.
  // `boxWidth`/`boxHeight` act as the max bounding box; the true ratio is
  // clamped to 6:1 so a very lopsided fraction pair still reads as a
  // rectangle instead of a sliver.
  const lengthVal = ln / ld;
  const widthVal = wn / wd;
  const aspect = Math.min(6, Math.max(1 / 6, lengthVal / widthVal));
  const [w, h] = aspect >= boxWidth / boxHeight ? [boxWidth, boxWidth / aspect] : [boxHeight * aspect, boxHeight];

  // The rect is centered inside the original fixed canvas (not resized to
  // fit it) so surrounding labels — especially the bottom formula row, a
  // fixed-length string regardless of the fraction — always have the same
  // room to lay out in, instead of getting clipped when the rect shrinks.
  const offsetX = (boxWidth - w) / 2;
  const offsetY = (boxHeight - h) / 2;

  // "Area = n/d" + "sq unit" only fit inside the shaded rect when it's wide
  // enough; below that, print them to its right instead of letting them
  // spill over the rect's own edges.
  const areaLabelInside = w >= 100;

  return (
    <svg
      viewBox={`-90 -34 ${boxWidth + 110} ${boxHeight + 74}`}
      width={boxWidth}
      style={{ maxWidth: "100%" }}
      role="img"
      aria-label={`A rectangle with length ${find === "length" ? "unknown" : `${ln}/${ld} ${unit}`}, width ${find === "width" ? "unknown" : `${wn}/${wd} ${unit}`}, and area ${find === "area" ? "unknown" : `${an}/${ad} square ${unit}`}`}
    >
      <g transform={`translate(${offsetX}, ${offsetY})`}>
        <rect x={0} y={0} width={w} height={h} style={{ fill: palette.aSoft, stroke: palette.ink, strokeWidth: 2 }} />
        <text x={areaLabelInside ? w / 2 : w + 16} y={h / 2 - 4} textAnchor={areaLabelInside ? "middle" : "start"} style={{ fill: palette.a, fontSize: 17, fontWeight: 700 }}>
          {find === "area" ? "Area = ?" : <>Area = {an}/{ad}</>}
        </text>
        {find !== "area" && (
          <text x={areaLabelInside ? w / 2 : w + 16} y={h / 2 + 16} textAnchor={areaLabelInside ? "middle" : "start"} style={{ fill: palette.a, fontSize: 13 }}>
            sq {unit}
          </text>
        )}

        {/* length: top edge */}
        <text x={w / 2} y={-16} textAnchor="middle" style={{ fill: palette.b, fontSize: 14, fontWeight: 700 }}>
          {find === "length" ? "length = ?" : <>length = {ln}/{ld} {unit}</>}
        </text>
        <line x1={0} y1={-6} x2={w} y2={-6} style={{ stroke: palette.b, strokeWidth: 2 }} />
        <line x1={0} y1={-10} x2={0} y2={-2} style={{ stroke: palette.b, strokeWidth: 2 }} />
        <line x1={w} y1={-10} x2={w} y2={-2} style={{ stroke: palette.b, strokeWidth: 2 }} />

        {/* width: left edge */}
        <text x={-14} y={h / 2} textAnchor="end" dominantBaseline="middle" style={{ fill: palette.c, fontSize: 14, fontWeight: 700 }}>
          {find === "width" ? "width = ?" : <>width = {wn}/{wd} {unit}</>}
        </text>
        <line x1={-6} y1={0} x2={-6} y2={h} style={{ stroke: palette.c, strokeWidth: 2 }} />
        <line x1={-10} y1={0} x2={-2} y2={0} style={{ stroke: palette.c, strokeWidth: 2 }} />
        <line x1={-10} y1={h} x2={-2} y2={h} style={{ stroke: palette.c, strokeWidth: 2 }} />

        {/* the formula, color-coded to match the rectangle's labels */}
        <text x={w / 2} y={h + 34} textAnchor="middle" style={{ fontSize: 15, fontWeight: 700 }}>
          <tspan style={{ fill: palette.a }}>Area</tspan>
          <tspan style={{ fill: palette.ink }}> = </tspan>
          <tspan style={{ fill: palette.b }}>length</tspan>
          <tspan style={{ fill: palette.ink }}> × </tspan>
          <tspan style={{ fill: palette.c }}>width</tspan>
        </text>
      </g>
    </svg>
  );
}
