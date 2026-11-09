import { useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { angleBetween, arcPath, dirPoint, norm360, pointerDir, toneColor, type Tone } from "./angleGeometry";
import { MathText } from "../../../shared/components/MathText";

export interface FigRay {
  dir: number;
  /** Drawn length in SVG units (default 100). Ray length never changes the angle — Unit 1's whole point. */
  len?: number;
  tone?: Tone;
  /** Small text near the tip (e.g. a letter). */
  label?: string;
  /** Only rays marked draggable respond to the pointer (see AngleFigure's onDragRay). */
  draggable?: boolean;
}

export interface FigArc {
  from: number;
  /** Counter-clockwise turn in degrees — may pass 180 for "amount of turn" pictures (Unit 1). */
  sweep: number;
  r?: number;
  tone?: Tone;
  /** Text placed at the middle of the arc, e.g. "40°", "?", "x". */
  label?: string;
  /** Draw a square-corner marker instead of a round arc (only meaningful when sweep is 90). */
  square?: boolean;
  /** Shade the wedge as well as drawing the arc line. */
  fill?: boolean;
}

export interface AngleFigureProps {
  rays: FigRay[];
  arcs?: FigArc[];
  /** Called with (ray index, proposed snapped direction) while a draggable ray is dragged. The caller decides any limits. */
  onDragRay?: (index: number, dir: number) => void;
  /** Drag snap in degrees (default 1). */
  snap?: number;
  width?: number;
  /** Reserve a fixed square frame of this radius instead of fitting the drawing (use while dragging so the frame doesn't jump). */
  frameRadius?: number;
  /** A faint dashed full circle around the vertex, with quarter-turn ticks — the "angle as part of a circle" picture. */
  showCircle?: boolean;
  /** Faint grid-paper lines behind the angle — for eyeballing square corners and straight lines. */
  grid?: boolean;
  ariaLabel: string;
}

const DEFAULT_LEN = 100;

/**
 * A vertex with any number of rays, plus labeled arcs. Used for every
 * non-protractor picture in the lab: Unit 1's turn pictures, Unit 3's
 * benchmark sketching pad, Unit 4's angle-addition diagrams. Every ray and
 * arc is placed with angleGeometry.ts's dirPoint/arcPath — the same functions
 * the graded answers are built from.
 */
export function AngleFigure({ rays, arcs = [], onDragRay, snap = 1, width = 260, frameRadius, showCircle = false, grid = false, ariaLabel }: AngleFigureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragIndex = useRef<number | null>(null);
  const draggable = !!onDragRay && rays.some((r) => r.draggable);

  // ---- bounds (fit the drawing unless a fixed frame is requested) ----
  let minX = -12, maxX = 12, minY = -12, maxY = 12;
  const grow = (x: number, y: number, pad = 0) => {
    minX = Math.min(minX, x - pad);
    maxX = Math.max(maxX, x + pad);
    minY = Math.min(minY, y - pad);
    maxY = Math.max(maxY, y + pad);
  };
  if (frameRadius) {
    grow(-frameRadius, -frameRadius);
    grow(frameRadius, frameRadius);
  } else {
    rays.forEach((r) => {
      const p = dirPoint(r.dir, (r.len ?? DEFAULT_LEN) + 4);
      grow(p.x, p.y, r.label ? 22 : 10);
    });
    arcs.forEach((a) => {
      const r = a.r ?? 26;
      for (let t = 0; t <= a.sweep; t += Math.max(5, a.sweep / 12)) {
        const p = dirPoint(a.from + t, r);
        grow(p.x, p.y, 4);
      }
      if (a.label) {
        const p = dirPoint(a.from + a.sweep / 2, r + 16);
        grow(p.x, p.y, 16);
      }
    });
    if (showCircle) {
      const r = Math.max(...rays.map((ry) => ry.len ?? DEFAULT_LEN)) * 0.62;
      grow(-r, -r, 6);
      grow(r, r, 6);
    }
  }
  const vbW = maxX - minX;
  const vbH = maxY - minY;

  const toSvg = (e: React.PointerEvent): { x: number; y: number } | null => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    return { x: minX + ((e.clientX - rect.left) * vbW) / rect.width, y: minY + ((e.clientY - rect.top) * vbH) / rect.height };
  };
  const snapDir = (raw: number) => norm360(Math.round(raw / snap) * snap);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    const p = toSvg(e);
    if (!p || Math.hypot(p.x, p.y) < 6) return;
    const raw = pointerDir(p.x, p.y);
    // Grab whichever draggable ray points closest to where the student pressed.
    let best = -1;
    for (let i = 0; i < rays.length; i++) {
      if (!rays[i].draggable) continue;
      if (best === -1 || angleBetween(raw, rays[i].dir) < angleBetween(raw, rays[best].dir)) best = i;
    }
    if (best === -1) return;
    dragIndex.current = best;
    e.currentTarget.setPointerCapture(e.pointerId);
    onDragRay!(best, snapDir(raw));
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragIndex.current === null) return;
    const p = toSvg(e);
    if (!p || Math.hypot(p.x, p.y) < 6) return;
    onDragRay!(dragIndex.current, snapDir(pointerDir(p.x, p.y)));
  };
  const endDrag = () => {
    dragIndex.current = null;
  };

  const circleR = showCircle ? Math.max(...rays.map((ry) => ry.len ?? DEFAULT_LEN)) * 0.62 : 0;

  return (
    <MathText>
      <svg
        ref={svgRef}
        viewBox={`${minX.toFixed(1)} ${minY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`}
        width={width}
        style={{ display: "block", maxWidth: "100%", height: "auto", fontFamily: diagramFont, touchAction: draggable ? "none" : undefined, cursor: draggable ? "grab" : undefined }}
        role="img"
        aria-label={ariaLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {grid && (
          <g style={{ stroke: palette.grid }} strokeWidth={1}>
            {Array.from({ length: Math.ceil(vbW / 25) + 1 }, (_, i) => {
              const x = Math.floor(minX / 25) * 25 + i * 25;
              return <line key={`gx${i}`} x1={x} y1={minY} x2={x} y2={maxY} />;
            })}
            {Array.from({ length: Math.ceil(vbH / 25) + 1 }, (_, i) => {
              const y = Math.floor(minY / 25) * 25 + i * 25;
              return <line key={`gy${i}`} x1={minX} y1={y} x2={maxX} y2={y} />;
            })}
          </g>
        )}
        {showCircle && (
          <g>
            <circle cx={0} cy={0} r={circleR} fill="none" style={{ stroke: palette.line }} strokeWidth={1.5} strokeDasharray="4 4" />
            {[0, 90, 180, 270].map((d) => {
              const p0 = dirPoint(d, circleR - 5);
              const p1 = dirPoint(d, circleR + 5);
              return <line key={d} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} style={{ stroke: palette.muted }} strokeWidth={2} />;
            })}
          </g>
        )}
        {arcs.map((a, i) => {
          const r = a.r ?? 26;
          const color = toneColor(a.tone ?? "a");
          if (a.square && Math.abs(a.sweep - 90) < 1e-6) {
            const s = r * 0.62;
            const p1 = dirPoint(a.from, s);
            const p3 = dirPoint(a.from + 90, s);
            const p2 = { x: p1.x + p3.x, y: p1.y + p3.y };
            const mid = dirPoint(a.from + 45, s * 1.41 + 14);
            return (
              <g key={`arc${i}`}>
                <path d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`} fill="none" style={{ stroke: color }} strokeWidth={2.5} />
                {a.label && (
                  <text x={mid.x} y={mid.y + 5} textAnchor="middle" fontSize={14} fontWeight={700} style={{ fill: color }}>
                    {a.label}
                  </text>
                )}
              </g>
            );
          }
          const mid = dirPoint(a.from + a.sweep / 2, r + 15);
          return (
            <g key={`arc${i}`}>
              {a.fill && <path d={arcPath(a.from, a.sweep, r, true)} style={{ fill: color }} opacity={0.16} />}
              <path d={arcPath(a.from, a.sweep, r)} fill="none" style={{ stroke: color }} strokeWidth={2.5} />
              {a.label && (
                <text x={mid.x} y={mid.y + 5} textAnchor="middle" fontSize={14} fontWeight={700} style={{ fill: color }}>
                  {a.label}
                </text>
              )}
            </g>
          );
        })}
        {rays.map((r, i) => {
          const len = r.len ?? DEFAULT_LEN;
          const tip = dirPoint(r.dir, len);
          const color = toneColor(r.tone ?? "ink");
          const left = dirPoint(r.dir + 150, 9);
          const right = dirPoint(r.dir - 150, 9);
          const lab = dirPoint(r.dir, len + 16);
          return (
            <g key={`ray${i}`}>
              <line x1={0} y1={0} x2={tip.x} y2={tip.y} style={{ stroke: color }} strokeWidth={3} strokeLinecap="round" />
              <path d={`M ${tip.x} ${tip.y} L ${tip.x + left.x} ${tip.y + left.y} M ${tip.x} ${tip.y} L ${tip.x + right.x} ${tip.y + right.y}`} style={{ stroke: color }} strokeWidth={3} strokeLinecap="round" fill="none" />
              {r.draggable && draggable && <circle cx={tip.x} cy={tip.y} r={8} style={{ fill: color }} opacity={0.35} />}
              {r.label && (
                <text x={lab.x} y={lab.y + 5} textAnchor="middle" fontSize={14} fontWeight={700} style={{ fill: color }}>
                  {r.label}
                </text>
              )}
            </g>
          );
        })}
        <circle cx={0} cy={0} r={4.5} style={{ fill: palette.ink }} />
        {draggable && <title>Drag a ray with a dot on its tip to turn it.</title>}
      </svg>
    </MathText>
  );
}
