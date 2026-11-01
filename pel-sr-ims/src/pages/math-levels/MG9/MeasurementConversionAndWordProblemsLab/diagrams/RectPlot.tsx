import { palette, diagramFont } from "../../../shared/lib/palette";

export interface RectPlotProps {
  /** Side lengths; null = unknown (labeled "?"). Shape still needs a size
   *  to draw, so pass `drawL`/`drawW` when a side is unknown. */
  l: number | null;
  w: number | null;
  unit: string;
  drawL?: number;
  drawW?: number;
  /** Tint the inside — "area covers the inside." */
  fill?: boolean;
  /** Thick violet outline — "perimeter goes around." */
  trace?: boolean;
  /** Text inside the rectangle, e.g. "Area = 24 sq ft". */
  inside?: string;
  caption?: string;
  maxW?: number;
}

const BOX_W = 230;
const BOX_H = 130;

/**
 * A labeled rectangle for Unit 4: length along the top, width down the
 * right side. Drawn roughly proportional (clamped so a very thin rectangle
 * stays readable), "not to scale" in the textbook sense — the numbers are
 * what count. Violet (--qc) is the perimeter color and the blue soft fill is
 * area, matching MG6_AreaAndPerimeterLab's palette so a student coming from
 * grade 3 sees the same color meanings. Longest label: "? sq ft" / "25 ft"
 * (~7 chars) — fits beside the box at fontSize 14.
 */
export function RectPlot({ l, w, unit, drawL, drawW, fill = true, trace = false, inside, caption, maxW = 340 }: RectPlotProps) {
  const L = l ?? drawL ?? 8;
  const Wd = w ?? drawW ?? 5;
  const s = Math.min(BOX_W / L, BOX_H / Wd);
  const pw = Math.max(L * s, 70);
  const ph = Math.max(Wd * s, 46);
  const x0 = 30;
  const y0 = 34;
  const height = y0 + ph + (caption ? 40 : 16);
  const width = x0 + pw + 90;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Rectangle ${l ?? "?"} by ${w ?? "?"} ${unit}`}
      style={{ display: "block", width: "100%", maxWidth: Math.min(width, maxW), height: "auto", fontFamily: diagramFont }}
    >
      <rect
        x={x0}
        y={y0}
        width={pw}
        height={ph}
        style={{ fill: fill ? palette.aSoft : palette.paper, stroke: trace ? palette.c : palette.ink, strokeWidth: trace ? 5 : 2, strokeLinejoin: "round" }}
      />
      <text x={x0 + pw / 2} y={y0 - 10} textAnchor="middle" style={{ fill: l === null ? palette.c : palette.ink, fontSize: 14, fontWeight: 700 }}>
        {l === null ? "?" : l} {unit}
      </text>
      <text x={x0 + pw + 10} y={y0 + ph / 2 + 5} style={{ fill: w === null ? palette.c : palette.ink, fontSize: 14, fontWeight: 700 }}>
        {w === null ? "?" : w} {unit}
      </text>
      {inside && (
        <text x={x0 + pw / 2} y={y0 + ph / 2 + 5} textAnchor="middle" style={{ fill: palette.ink, fontSize: 13, fontWeight: 600 }}>
          {inside}
        </text>
      )}
      {caption && (
        <text x={x0 + pw / 2} y={y0 + ph + 28} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13, fontWeight: 700 }}>
          {caption}
        </text>
      )}
    </svg>
  );
}
