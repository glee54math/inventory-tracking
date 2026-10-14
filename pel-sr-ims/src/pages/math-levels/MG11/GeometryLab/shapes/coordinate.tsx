// shapes/coordinate.tsx — four-quadrant coordinate plane with optional click-to-plot.
import React, { useRef, useState } from "react";
import { FigureSvg, type Hue, Label, hue, soft } from "./primitives";

export type PlanePoint = { x: number; y: number; label?: string; color?: Hue };
export type PlaneSegment = { a: PlanePoint; b: PlanePoint; label?: string; color?: Hue; highlight?: boolean };

export function CoordinatePlane(props: {
  min?: number;
  max?: number;
  u?: number;
  points?: PlanePoint[];
  polygon?: PlanePoint[];
  polygonColor?: Hue;
  segments?: PlaneSegment[];
  onPick?: (x: number, y: number) => void;
}) {
  const { min = -7, max = 7, u = 26, points = [], polygon, polygonColor = "blue", segments = [], onPick } = props;
  const size = (max - min) * u;
  const sx = (x: number) => (x - min) * u;
  const sy = (y: number) => (max - y) * u;
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  const toGrid = (e: React.PointerEvent | React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const gx = Math.round(pt.x / u + min);
    const gy = Math.round(max - pt.y / u);
    if (gx < min || gx > max || gy < min || gy > max) return null;
    return { x: gx, y: gy };
  };

  const ticks: number[] = [];
  for (let i = min; i <= max; i++) ticks.push(i);

  return (
    <FigureSvg svgRef={svgRef} width={size} height={size} pad={26} label="Coordinate plane" className={onPick ? "plane picking" : "plane"}>
      <g className="grid-lines">
        {ticks.map((t) => (
          <React.Fragment key={t}>
            <line x1={sx(t)} y1={0} x2={sx(t)} y2={size} />
            <line x1={0} y1={sy(t)} x2={size} y2={sy(t)} />
          </React.Fragment>
        ))}
      </g>
      {/* axes */}
      <line x1={0} y1={sy(0)} x2={size} y2={sy(0)} stroke={hue("ink")} strokeWidth={1.8} />
      <line x1={sx(0)} y1={0} x2={sx(0)} y2={size} stroke={hue("ink")} strokeWidth={1.8} />
      <Label x={size + 14} y={sy(0)} text="x" size={14} />
      <Label x={sx(0)} y={-14} text="y" size={14} />
      {ticks.filter((t) => t !== 0).map((t) => (
        <React.Fragment key={"t" + t}>
          <text x={sx(t)} y={sy(0) + 14} className="tick" textAnchor="middle">{t}</text>
          <text x={sx(0) - 7} y={sy(t) + 4} className="tick" textAnchor="end">{t}</text>
        </React.Fragment>
      ))}

      {polygon && polygon.length >= 3 && (
        <polygon
          className="pop-in"
          points={polygon.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")}
          fill={soft(polygonColor)} stroke={hue(polygonColor)} strokeWidth={2.5} strokeLinejoin="round"
        />
      )}
      {segments.map((s, i) => {
        const mx = (sx(s.a.x) + sx(s.b.x)) / 2, my = (sy(s.a.y) + sy(s.b.y)) / 2;
        const vertical = s.a.x === s.b.x;
        const c = s.highlight ? "berry" : s.color ?? "ink";
        return (
          <g key={i}>
            <line x1={sx(s.a.x)} y1={sy(s.a.y)} x2={sx(s.b.x)} y2={sy(s.b.y)} stroke={hue(c)} strokeWidth={s.highlight ? 5 : 3} strokeLinecap="round" />
            {s.label && <Label x={mx + (vertical ? 12 : 0)} y={my + (vertical ? 0 : -13)} text={s.label} anchor={vertical ? "start" : "middle"} color={c} size={15} weight={700} />}
          </g>
        );
      })}
      {points.map((p, i) => (
        <g key={i} className="pop-in">
          <circle cx={sx(p.x)} cy={sy(p.y)} r={6} fill={hue(p.color ?? "berry")} stroke="var(--paper)" strokeWidth={2} />
          {p.label && <Label x={sx(p.x) + 9} y={sy(p.y) - 12} text={p.label} anchor="start" size={13} color={p.color ?? "berry"} weight={700} />}
        </g>
      ))}

      {onPick && hover && (
        <g pointerEvents="none">
          <circle cx={sx(hover.x)} cy={sy(hover.y)} r={7} fill="none" stroke={hue("blue")} strokeWidth={2} strokeDasharray="3 3" />
          <Label x={sx(hover.x) + 10} y={sy(hover.y) + 16} text={`(${hover.x}, ${hover.y})`} anchor="start" size={13} color="blue" />
        </g>
      )}
      {onPick && (
        <rect
          x={-13} y={-13} width={size + 26} height={size + 26} fill="transparent"
          onPointerMove={(e) => setHover(toGrid(e))}
          onPointerLeave={() => setHover(null)}
          onClick={(e) => {
            const g = toGrid(e);
            if (g) onPick(g.x, g.y);
          }}
        />
      )}
    </FigureSvg>
  );
}
