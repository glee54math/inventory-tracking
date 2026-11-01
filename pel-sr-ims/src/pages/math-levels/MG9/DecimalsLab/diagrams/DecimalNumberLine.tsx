import { useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";

export interface DecimalPoint {
  /** Position in hundredths, e.g. 247 for 2.47. */
  hundredths: number;
  /** Text above the dot — omit when the value IS the question. */
  label?: string;
  tone?: "a" | "b" | "c";
  /** Explore only: drag the dot (snaps to hundredths). Never set this on a
   *  Practice/Test point whose position is the answer. */
  onChange?: (hundredths: number) => void;
}

export interface DecimalNumberLineProps {
  /** The line runs from this whole number to the next one. */
  fromWhole: number;
  points?: DecimalPoint[];
  /** Draw the 9 small hundredths ticks inside every tenth. Default true. */
  showHundredths?: boolean;
}

const WIDTH = 560;
const PAD_X = 24;
const HEIGHT = 84;
const MID_Y = 48;
const PX = (WIDTH - PAD_X * 2) / 100; // per hundredth
// Two point labels closer than this get stacked on two rows instead of
// overlapping. The longest label this lab ever draws is "9.99" (4 chars,
// ~30px at 13px bold), so 40px of clearance is enough.
const LABEL_GAP = 40;

const toneColor = (t?: "a" | "b" | "c") => (t === "b" ? palette.b : t === "c" ? palette.c : palette.a);

/**
 * One whole-number interval (e.g. 2 to 3) split into tenths (labeled: 2, 2.1,
 * 2.2 … 3) with unlabeled hundredths ticks between them. Its own component
 * rather than a mode on shared/diagrams/NumberLine.tsx: that line's spacing is
 * built for integer ranges (a 0-to-1 range renders 24px wide) and its minor
 * ticks are deliberately unlabeled — the opposite of what a decimal line needs.
 * Same pointer-capture drag technique as the shared line, snapped to the
 * nearest hundredth.
 */
export function DecimalNumberLine({ fromWhole, points = [], showHundredths = true }: DecimalNumberLineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const lo = fromWhole * 100;
  const toX = (h: number) => PAD_X + (h - lo) * PX;
  const toValue = (clientX: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return lo;
    const scale = rect.width / WIDTH;
    const raw = lo + (clientX - rect.left - PAD_X * scale) / (PX * scale);
    return Math.min(lo + 100, Math.max(lo, Math.round(raw)));
  };
  const tenthLabel = (k: number) => (k === 0 ? `${fromWhole}` : k === 10 ? `${fromWhole + 1}` : `${fromWhole}.${k}`);

  // Stagger labels: walk points left to right and lift any label that would
  // collide with the previous one.
  const sorted = points.map((p, i) => ({ p, i })).sort((a, b) => a.p.hundredths - b.p.hundredths);
  const lift: number[] = points.map(() => 0);
  sorted.forEach(({ p, i }, idx) => {
    if (idx === 0) return;
    const prev = sorted[idx - 1];
    if (Math.abs(toX(p.hundredths) - toX(prev.p.hundredths)) < LABEL_GAP && lift[prev.i] === 0) lift[i] = 1;
  });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Number line from ${fromWhole} to ${fromWhole + 1} in tenths${points.some((p) => p.label) ? `, marked at ${points.filter((p) => p.label).map((p) => p.label).join(" and ")}` : ""}`}
      style={{ display: "block", width: "100%", maxWidth: WIDTH, height: "auto", fontFamily: diagramFont }}
    >
      <line x1={PAD_X} y1={MID_Y} x2={WIDTH - PAD_X} y2={MID_Y} style={{ stroke: palette.line, strokeWidth: 2 }} />
      {showHundredths &&
        Array.from({ length: 101 }, (_, k) =>
          k % 10 === 0 ? null : <line key={`h${k}`} x1={toX(lo + k)} y1={MID_Y - 3} x2={toX(lo + k)} y2={MID_Y + 3} style={{ stroke: palette.line, strokeWidth: 1 }} />
        )}
      {Array.from({ length: 11 }, (_, k) => {
        const whole = k === 0 || k === 10;
        return (
          <g key={`t${k}`}>
            <line x1={toX(lo + k * 10)} y1={MID_Y - (whole ? 9 : 7)} x2={toX(lo + k * 10)} y2={MID_Y + (whole ? 9 : 7)} style={{ stroke: whole ? palette.ink : palette.muted, strokeWidth: whole ? 2.5 : 1.5 }} />
            <text x={toX(lo + k * 10)} y={MID_Y + 24} textAnchor="middle" style={{ fontSize: 12, fontWeight: whole ? 800 : 400, fill: whole ? palette.ink : palette.muted }}>
              {tenthLabel(k)}
            </text>
          </g>
        );
      })}
      {points.map((p, i) => {
        if (p.hundredths < lo || p.hundredths > lo + 100) return null;
        const x = toX(p.hundredths);
        const draggable = !!p.onChange;
        return (
          <g key={i}>
            {p.label && (
              <text x={x} y={MID_Y - 14 - lift[i] * 16} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: toneColor(p.tone) }}>
                {p.label}
              </text>
            )}
            <circle cx={x} cy={MID_Y} r={7} style={{ fill: toneColor(p.tone), stroke: palette.paper, strokeWidth: 2 }} pointerEvents="none" />
            {draggable && (
              <circle
                cx={x}
                cy={MID_Y}
                r={16}
                fill="transparent"
                style={{ cursor: "grab", touchAction: "none" }}
                onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
                onPointerMove={(e) => {
                  if (e.buttons !== 1) return;
                  const v = toValue(e.clientX);
                  if (v !== p.hundredths) p.onChange!(v);
                }}
              />
            )}
          </g>
        );
      })}
      {points.some((p) => p.onChange) && <title>Drag a dot to move it.</title>}
    </svg>
  );
}
