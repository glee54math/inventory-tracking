import { useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { arcPath, dirPoint, dragToDir, pointerDir, protractorReading, toneColor, type Scale, type Tone } from "./angleGeometry";

export interface ProtractorRay {
  dir: number;
  tone?: Tone;
  label?: string;
}

/** A lettered dot just outside the protractor's curved edge, at a protractor position (local 0-180) — for "which point should you mark?" questions. */
export interface ProtractorMark {
  local: number;
  label: string;
}

export interface ProtractorProps {
  /** Direction of the protractor's straight edge's RIGHT end (where the inner scale reads 0). Default 0 = flat, curved side up. */
  rot?: number;
  /** Fixed rays drawn from the center. */
  rays?: ProtractorRay[];
  /** The draggable ray (only drawn/draggable when onDrag is also set). */
  dragDir?: number;
  dragTone?: Tone;
  onDrag?: (dir: number) => void;
  /** Drag snap in degrees, counted from the protractor's 0 line (default 1). */
  snap?: number;
  /** Shade the angle being measured: counter-clockwise from `from` by `sweep`. */
  arc?: { from: number; sweep: number } | null;
  marks?: ProtractorMark[];
  /** Explore only: make one scale bold and fade the other. Never set in Practice/Test (it gives the answer away). */
  highlightScale?: Scale | null;
  /** Draw the protractor itself (false = just the rays, e.g. before it's been placed). Default true. */
  showProtractor?: boolean;
  width?: number;
  /** Reserve the full circle around the center so the frame never jumps while rotating/dragging. */
  fullFrame?: boolean;
  ariaLabel: string;
}

export const PROTRACTOR_R = 150;
const RAY_LEN = PROTRACTOR_R + 34;

/**
 * A two-scale protractor — inner scale (blue) reads 0 at the right end and
 * counts up counter-clockwise; outer scale (orange) reads 0 at the left end
 * and counts up clockwise. Every tick label is protractorReading()'s own
 * inner/outer value for that tick, and every graded reading in the lab comes
 * from the same function, so the picture and the answer key can't drift.
 *
 * Drawn with whole-degree ticks (1° short, 5° medium, 10° long + labeled), so
 * a student can genuinely read whole-number degrees (4.MD.6). When draggable,
 * the ray snaps to whole `snap`-degree steps from the 0 line (dragToDir) and
 * can't leave the curved half, so a sketch is graded exactly.
 */
export function Protractor({
  rot = 0,
  rays = [],
  dragDir,
  dragTone = "c",
  onDrag,
  snap = 1,
  arc = null,
  marks = [],
  highlightScale = null,
  showProtractor = true,
  width = 400,
  fullFrame = false,
  ariaLabel,
}: ProtractorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const R = PROTRACTOR_R;
  const draggable = !!onDrag && dragDir !== undefined;

  // ---- bounds ----
  let minX = -10, maxX = 10, minY = -10, maxY = 10;
  const grow = (x: number, y: number, pad = 0) => {
    minX = Math.min(minX, x - pad);
    maxX = Math.max(maxX, x + pad);
    minY = Math.min(minY, y - pad);
    maxY = Math.max(maxY, y + pad);
  };
  if (fullFrame) {
    grow(-RAY_LEN - 12, -RAY_LEN - 12);
    grow(RAY_LEN + 12, RAY_LEN + 12);
  } else {
    if (showProtractor) {
      for (let L = 0; L <= 180; L += 10) {
        const p = dirPoint(rot + L, R + (marks.length ? 30 : 4));
        grow(p.x, p.y, 6);
      }
    }
    [...rays.map((r) => r.dir), ...(draggable ? [dragDir!] : [])].forEach((d) => {
      const p = dirPoint(d, RAY_LEN + 8);
      grow(p.x, p.y, 10);
    });
  }
  const vbW = maxX - minX;
  const vbH = maxY - minY;

  const toSvg = (e: React.PointerEvent): { x: number; y: number } | null => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    return { x: minX + ((e.clientX - rect.left) * vbW) / rect.width, y: minY + ((e.clientY - rect.top) * vbH) / rect.height };
  };
  const moveTo = (e: React.PointerEvent) => {
    const p = toSvg(e);
    if (!p || Math.hypot(p.x, p.y) < 8) return;
    const next = dragToDir(rot, pointerDir(p.x, p.y), snap);
    if (next !== dragDir) onDrag!(next);
  };

  const scaleOpacity = (s: Scale) => (highlightScale === null ? 1 : highlightScale === s ? 1 : 0.35);
  const scaleWeight = (s: Scale) => (highlightScale === s ? 800 : 600);

  const left = dirPoint(rot + 180, R);
  const right = dirPoint(rot, R);

  const drawRay = (dir: number, tone: Tone, key: string, label?: string, handle = false) => {
    const tip = dirPoint(dir, RAY_LEN);
    const color = toneColor(tone);
    const a1 = dirPoint(dir + 150, 10);
    const a2 = dirPoint(dir - 150, 10);
    const lab = dirPoint(dir, RAY_LEN + 14);
    return (
      <g key={key}>
        <line x1={0} y1={0} x2={tip.x} y2={tip.y} style={{ stroke: color }} strokeWidth={3} strokeLinecap="round" />
        <path d={`M ${tip.x} ${tip.y} l ${a1.x} ${a1.y} M ${tip.x} ${tip.y} l ${a2.x} ${a2.y}`} style={{ stroke: color }} strokeWidth={3} strokeLinecap="round" fill="none" />
        {handle && <circle cx={tip.x} cy={tip.y} r={10} style={{ fill: color }} opacity={0.35} />}
        {label && (
          <text x={lab.x} y={lab.y + 5} textAnchor="middle" fontSize={13} fontWeight={700} style={{ fill: color }}>
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`${minX.toFixed(1)} ${minY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`}
      width={width}
      style={{ display: "block", maxWidth: "100%", height: "auto", fontFamily: diagramFont, touchAction: draggable ? "none" : undefined, cursor: draggable ? "grab" : undefined }}
      role="img"
      aria-label={ariaLabel}
      onPointerDown={
        draggable
          ? (e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              moveTo(e);
            }
          : undefined
      }
      onPointerMove={draggable ? (e) => dragging.current && moveTo(e) : undefined}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {showProtractor && (
        <g>
          <path d={`${arcPath(rot, 180, R)} Z`} style={{ fill: palette.aSoft, stroke: palette.muted }} fillOpacity={0.45} strokeWidth={1.5} />
          <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} style={{ stroke: palette.muted }} strokeWidth={1.5} />
          {Array.from({ length: 181 }, (_, L) => {
            const len = L % 10 === 0 ? 14 : L % 5 === 0 ? 9 : 5;
            const p0 = dirPoint(rot + L, R);
            const p1 = dirPoint(rot + L, R - len);
            return <line key={`t${L}`} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} style={{ stroke: palette.muted }} strokeWidth={L % 10 === 0 ? 1.3 : 0.7} />;
          })}
          {Array.from({ length: 19 }, (_, i) => {
            const L = i * 10;
            const { inner, outer } = protractorReading(rot, rot + L);
            const po = dirPoint(rot + L, R - 24);
            const pi = dirPoint(rot + L, R - 44);
            return (
              <g key={`l${L}`}>
                <text x={po.x} y={po.y + 3.5} textAnchor="middle" fontSize={10} fontWeight={scaleWeight("outer")} opacity={scaleOpacity("outer")} style={{ fill: palette.b }}>
                  {outer}
                </text>
                <text x={pi.x} y={pi.y + 3.5} textAnchor="middle" fontSize={10} fontWeight={scaleWeight("inner")} opacity={scaleOpacity("inner")} style={{ fill: palette.a }}>
                  {inner}
                </text>
              </g>
            );
          })}
          {/* center mark: a small cross-hair on the straight edge */}
          <line x1={dirPoint(rot + 90, 10).x} y1={dirPoint(rot + 90, 10).y} x2={0} y2={0} style={{ stroke: palette.muted }} strokeWidth={1.5} />
        </g>
      )}
      {arc && <path d={arcPath(arc.from, arc.sweep, 28, true)} style={{ fill: palette.c }} opacity={0.2} />}
      {arc && <path d={arcPath(arc.from, arc.sweep, 28)} fill="none" style={{ stroke: palette.c }} strokeWidth={2} />}
      {rays.map((r, i) => drawRay(r.dir, r.tone ?? "ink", `r${i}`, r.label))}
      {draggable && drawRay(dragDir!, dragTone, "drag", undefined, true)}
      {marks.map((m) => {
        const p = dirPoint(rot + m.local, R + 8);
        const lab = dirPoint(rot + m.local, R + 21);
        return (
          <g key={`m${m.label}`}>
            <circle cx={p.x} cy={p.y} r={4} style={{ fill: palette.c }} />
            <text x={lab.x} y={lab.y + 5} textAnchor="middle" fontSize={13} fontWeight={800} style={{ fill: palette.c }}>
              {m.label}
            </text>
          </g>
        );
      })}
      <circle cx={0} cy={0} r={4} style={{ fill: palette.ink }} />
      {draggable && <title>Drag anywhere over the protractor to turn the purple ray.</title>}
    </svg>
  );
}
