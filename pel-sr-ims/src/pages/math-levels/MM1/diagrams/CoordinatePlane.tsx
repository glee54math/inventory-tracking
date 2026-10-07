import React, { useId, useState } from "react";
import { palette } from "../../shared/lib/palette";
import { fmt } from "../../shared/lib/math";

export interface PlotPoint {
  x: number;
  y: number;
  color: string;
  /** Show "(x, y)" beside the point. */
  showLabel?: boolean;
  hollow?: boolean;
}

export interface PlotLine {
  /** y = slope * x, through the origin (every ratio graph does this). */
  slope: number;
  color: string;
  label?: string;
  dashed?: boolean;
}

export interface CoordinatePlaneProps {
  xMax: number;
  yMax: number;
  xStep?: number;
  yStep?: number;
  xLabel: string;
  yLabel: string;
  points?: PlotPoint[];
  lines?: PlotLine[];
  /** If set, clicking the grid calls this with the nearest grid point. */
  onPlot?: (x: number, y: number) => void;
  width?: number;
  height?: number;
}

/** First-quadrant coordinate plane for graphing ratio pairs. */
export function CoordinatePlane({
  xMax,
  yMax,
  xStep = 1,
  yStep = 1,
  xLabel,
  yLabel,
  points = [],
  lines = [],
  onPlot,
  width = 420,
  height = 360,
}: CoordinatePlaneProps) {
  const m = { l: 56, r: 18, t: 18, b: 52 };
  const W = width - m.l - m.r;
  const H = height - m.t - m.b;
  const sx = (x: number) => m.l + (x / xMax) * W;
  const sy = (y: number) => m.t + H - (y / yMax) * H;
  const clipId = "cp" + useId().replace(/:/g, "");
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  const xTicks = Array.from({ length: Math.floor(xMax / xStep) + 1 }, (_, i) => i * xStep);
  const yTicks = Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, i) => i * yStep);
  const xEvery = xTicks.length > 11 ? 2 : 1;
  const yEvery = yTicks.length > 11 ? 2 : 1;

  const toGrid = (e: React.MouseEvent<SVGRectElement>) => {
    const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement)!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const gx = Math.round(((p.x - m.l) / W) * xMax / xStep) * xStep;
    const gy = Math.round(((m.t + H - p.y) / H) * yMax / yStep) * yStep;
    return { x: Math.max(0, Math.min(xMax, gx)), y: Math.max(0, Math.min(yMax, gy)) };
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width, display: "block", margin: "0 auto" }} role="img" aria-label={`Graph of ${yLabel} versus ${xLabel}`}>
      {xTicks.map((t) => (
        <line key={"gx" + t} x1={sx(t)} y1={m.t} x2={sx(t)} y2={m.t + H} style={{ stroke: palette.grid, strokeWidth: 1 }} />
      ))}
      {yTicks.map((t) => (
        <line key={"gy" + t} x1={m.l} y1={sy(t)} x2={m.l + W} y2={sy(t)} style={{ stroke: palette.grid, strokeWidth: 1 }} />
      ))}
      <line x1={m.l} y1={m.t + H} x2={m.l + W + 6} y2={m.t + H} style={{ stroke: palette.ink, strokeWidth: 2 }} />
      <line x1={m.l} y1={m.t + H} x2={m.l} y2={m.t - 6} style={{ stroke: palette.ink, strokeWidth: 2 }} />
      {xTicks.map((t, i) =>
        i % xEvery === 0 ? (
          <text key={"tx" + t} x={sx(t)} y={m.t + H + 18} textAnchor="middle" style={{ fill: palette.muted, fontSize: 12 }}>
            {fmt(t)}
          </text>
        ) : null
      )}
      {yTicks.map((t, i) =>
        i % yEvery === 0 ? (
          <text key={"ty" + t} x={m.l - 8} y={sy(t) + 4} textAnchor="end" style={{ fill: palette.muted, fontSize: 12 }}>
            {fmt(t)}
          </text>
        ) : null
      )}
      <text x={m.l + W / 2} y={height - 10} textAnchor="middle" style={{ fill: palette.ink, fontWeight: 700, fontSize: 13 }}>
        {xLabel}
      </text>
      <text transform={`translate(15 ${m.t + H / 2}) rotate(-90)`} textAnchor="middle" style={{ fill: palette.ink, fontWeight: 700, fontSize: 13 }}>
        {yLabel}
      </text>

      <clipPath id={clipId}>
        <rect x={m.l} y={m.t} width={W} height={H} />
      </clipPath>
      {lines.map((ln, i) => {
        const xEnd = Math.min(xMax, yMax / ln.slope);
        return (
          <g key={"l" + i} clipPath={`url(#${clipId})`}>
            <line
              x1={sx(0)}
              y1={sy(0)}
              x2={sx(xEnd)}
              y2={sy(ln.slope * xEnd)}
              style={{ stroke: ln.color, strokeWidth: 2.5, strokeDasharray: ln.dashed ? "6 5" : "none", opacity: 0.75 }}
            />
            {ln.label && (
              <text x={sx(xEnd) - 6} y={sy(ln.slope * xEnd) + 16} textAnchor="end" style={{ fill: ln.color, fontWeight: 700, fontSize: 13 }}>
                {ln.label}
              </text>
            )}
          </g>
        );
      })}

      {onPlot && (
        <rect
          x={m.l}
          y={m.t}
          width={W}
          height={H}
          style={{ fill: "transparent", cursor: "crosshair" }}
          onMouseMove={(e) => setHover(toGrid(e))}
          onMouseLeave={() => setHover(null)}
          onClick={(e) => {
            const g = toGrid(e);
            onPlot(g.x, g.y);
          }}
        />
      )}
      {hover && (
        <g pointerEvents="none">
          <circle cx={sx(hover.x)} cy={sy(hover.y)} r={6} style={{ fill: "none", stroke: palette.muted, strokeWidth: 2, strokeDasharray: "3 2" }} />
          <text x={sx(hover.x) + 9} y={sy(hover.y) - 9} style={{ fill: palette.muted, fontSize: 12 }}>
            ({fmt(hover.x)}, {fmt(hover.y)})
          </text>
        </g>
      )}

      {points.map((p, i) => (
        <g key={"p" + i} pointerEvents="none">
          <circle
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={6}
            style={{ fill: p.hollow ? palette.paper : p.color, stroke: p.color, strokeWidth: 2.5, transition: "all .3s" }}
          />
          {p.showLabel && (
            <text x={sx(p.x) - 9} y={sy(p.y) - 10} textAnchor="end" style={{ fill: p.color, fontWeight: 700, fontSize: 12 }}>
              ({fmt(p.x)}, {fmt(p.y)})
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
