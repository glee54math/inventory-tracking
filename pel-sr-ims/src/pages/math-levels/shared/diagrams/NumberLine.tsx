import { useRef } from "react";
import { palette, diagramFont } from "../lib/palette";

export interface NumberLinePoint {
  value: number;
  /** Shown above the marker, e.g. "A" or the value itself — omit to just
   *  show an unlabeled dot (used when the point's value IS the question,
   *  e.g. "what number is marked?", so showing it would give the answer away). */
  label?: string;
  tone?: "a" | "b" | "c";
  /**
   * Lets the student drag this point to change its value — only ever set
   * this for a point whose value the student is meant to freely choose
   * (an Explore sandbox bound to a Stepper, say), NEVER for a point that IS
   * a Practice question's answer — dragging would let them just read off
   * wherever they dropped it instead of answering. Fully controlled: this
   * only ever reports the dragged-to value, it never changes `value`
   * itself — the caller's own state update (e.g. a Stepper's onChange)
   * does that, which is what makes the point move. That's also what makes
   * this work in the other direction for free: since the marker's position
   * is always derived fresh from `value`, changing `value` from anywhere
   * else (the Stepper's +/− buttons) moves the dot exactly the same way.
   */
  onChange?: (value: number) => void;
}

export interface NumberLineProps {
  min: number;
  max: number;
  points?: NumberLinePoint[];
}

const MAX_UNIT_PX = 24; // today's spacing for a "normal"-sized range — never exceeded
const PAD_X = 18;
const HEIGHT = 64;
const MID_Y = 30;
// How many logical px a wide range (elevation ±500, say) gets squeezed down
// to, same as a normal range already renders at — chosen so that at
// MAX_UNIT_PX, a span of 50 (e.g. temperature, ±25) lands EXACTLY on
// TARGET_WIDTH, meaning every range this lab actually uses today that was
// already working renders pixel-for-pixel identically to before; only
// wider ranges (where 50 * MAX_UNIT_PX alone would blow past this) get
// compressed, and only exactly enough to land back on this same target.
const TARGET_WIDTH = 50 * MAX_UNIT_PX;
// Minimum on-screen gap between labeled ticks — below this, 2-3 digit
// numbers start to visually run into each other.
const MIN_LABEL_PX = 20;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/** Smallest "nice" step (1/2/5 × a power of ten) that keeps labeled ticks
 *  at least minLabelPx apart at the given per-unit pixel density — the same
 *  approach any chart axis uses to pick readable tick spacing, so a huge
 *  range (elevation) doesn't try to label all 1,001 integers on top of
 *  each other. */
function niceStep(unitPx: number, minLabelPx: number): number {
  const raw = minLabelPx / unitPx;
  if (raw <= 1) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalized = raw / magnitude;
  const nice = normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return Math.round(nice * magnitude);
}

/** A horizontal number line with tick marks from `min` to `max` — 0 is
 *  always visually emphasized (bold, ink-colored) since "what does 0 mean
 *  here" is the point of this whole strand, not an incidental tick.
 *  Everything (line, ticks, labels, points) is positioned from the SAME
 *  `toX()` function against one SVG coordinate space, so nothing can drift
 *  out of alignment the way two independently-sized layout rows can.
 *
 *  The per-unit pixel spacing (and so which integers actually get a
 *  labeled tick) adapts to the range: a "normal" range (up to 50 wide, e.g.
 *  temperature ±25) gets a tick at every integer exactly like before; a
 *  much wider one (elevation ±500) would otherwise either run thousands of
 *  pixels wide or, once squeezed to fit, shrink its dot and text to
 *  invisibility — instead it's compressed to the same logical width a
 *  normal range already uses, with only every Nth integer labeled, so
 *  points still render at a normal, visible size and tick labels stay
 *  legibly spaced apart, however wide the underlying range is. */
export function NumberLine({ min, max, points = [] }: NumberLineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const span = max - min;
  const unitPx = Math.min(MAX_UNIT_PX, TARGET_WIDTH / span);
  const step = niceStep(unitPx, MIN_LABEL_PX);
  const width = span * unitPx + PAD_X * 2;
  const visiblePoints = points.filter((p) => p.value >= min && p.value <= max);
  const hasDraggable = visiblePoints.some((p) => p.onChange);

  const tickValues: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) tickValues.push(v);
  if (min <= 0 && max >= 0 && !tickValues.includes(0)) tickValues.push(0);
  tickValues.sort((a, b) => a - b);

  const toX = (value: number) => PAD_X + (value - min) * unitPx;
  // The SVG itself can render smaller than its logical `width` (see the
  // style below — it shrinks to fit a narrow container, capped at its
  // natural size, never stretches past it). When that happens, 1 logical
  // unit no longer equals 1 on-screen pixel, so dragging has to convert
  // through that same scale factor or the dot would trail behind the
  // pointer. Drag precision itself is always to the nearest whole unit,
  // independent of `step` — the tick labels thin out on a wide range, but
  // the dot can still land on (and the question can still ask about) any
  // integer in between.
  const toValue = (clientX: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return min;
    const scale = rect.width / width;
    const raw = min + (clientX - rect.left - PAD_X * scale) / (unitPx * scale);
    return Math.min(max, Math.max(min, Math.round(raw)));
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      role="img"
      aria-label={`Number line from ${min} to ${max}${
        visiblePoints.length ? `, with ${visiblePoints.map((p) => p.value).join(" and ")} marked` : ""
      }`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      <line x1={PAD_X} y1={MID_Y} x2={width - PAD_X} y2={MID_Y} stroke={palette.line} strokeWidth={2} />
      {tickValues.map((v) => (
        <g key={v}>
          <line x1={toX(v)} y1={MID_Y - 6} x2={toX(v)} y2={MID_Y + 6} stroke={v === 0 ? palette.ink : palette.line} strokeWidth={v === 0 ? 2.5 : 1.5} />
          <text x={toX(v)} y={MID_Y + 22} textAnchor="middle" fontSize={12} fontWeight={v === 0 ? 800 : 400} fill={v === 0 ? palette.ink : palette.muted}>
            {v}
          </text>
        </g>
      ))}
      {visiblePoints.map((p, i) => {
        const x = toX(p.value);
        const draggable = !!p.onChange;
        const onPointerDown = draggable ? (e: React.PointerEvent) => e.currentTarget.setPointerCapture(e.pointerId) : undefined;
        const onPointerMove = draggable
          ? (e: React.PointerEvent) => {
              if (e.buttons !== 1) return;
              const v = toValue(e.clientX);
              if (v !== p.value) p.onChange!(v);
            }
          : undefined;
        return (
          <g key={i}>
            {p.label && (
              <text x={x} y={MID_Y - 14} textAnchor="middle" fontSize={13} fontWeight={700} fill={toneColor(p.tone)}>
                {p.label}
              </text>
            )}
            <circle cx={x} cy={MID_Y} r={7} fill={toneColor(p.tone)} stroke={palette.paper} strokeWidth={2} pointerEvents="none" />
            {/* Larger invisible hit-area — a 7px dot is a small, fiddly drag
                target, especially on a touchscreen. */}
            {draggable && (
              <circle
                cx={x}
                cy={MID_Y}
                r={16}
                fill="transparent"
                style={{ cursor: "grab", touchAction: "none" }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
              />
            )}
          </g>
        );
      })}
      {hasDraggable && <title>Drag the dot to change its value.</title>}
    </svg>
  );
}
