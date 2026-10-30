import { useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";

/** hour is always 1-12 (12-hour clock face); minute is 0-59 — unlike MG3's
 *  Grade-1 Clock (hour/half only), this lab's standard (3.MD.1) requires
 *  telling/writing time to the NEAREST MINUTE, so every one of the 60
 *  minute positions must be representable, not just :00/:30. */
export interface ClockTime {
  hour: number;
  minute: number;
}

/**
 * THE single function both the clock face's hand angles AND every graded
 * "what time is it" answer are derived from — same convention as MG3's
 * Clock.tsx (see its doc comment for the off-by-one bug this pattern is
 * meant to prevent). The hour hand creeps continuously with the minute
 * (0.5deg per minute) — this is deliberate and load-bearing: it's exactly
 * what makes the "hour hand looks closer to the next number" misconception
 * possible to render and test (Unit 1's required CFU question).
 */
export function clockAngles(t: ClockTime): { hourAngle: number; minuteAngle: number } {
  const hour12 = t.hour % 12; // 0-11; 12 o'clock -> 0
  const hourAngle = hour12 * 30 + t.minute * 0.5;
  const minuteAngle = t.minute * 6;
  return { hourAngle, minuteAngle };
}

/** "4:05" / "4:30" / "4:00" — always two-digit minutes, the canonical
 *  digital label for a ClockTime used for display and as the source text
 *  for every practice/test answer. */
export function clockLabel(t: ClockTime): string {
  return `${t.hour}:${String(t.minute).padStart(2, "0")}`;
}

/** Inverse of clockAngles' MINUTE-hand angle only (6deg per minute) — snaps
 *  a raw dragged angle (0-359.999) to the nearest whole minute (0-59). The
 *  hour is set through a separate control (a Stepper, in every caller of
 *  this diagram), not by dragging the hour hand — deliberately simpler than
 *  a two-independently-draggable-hands widget (which would need its own
 *  rollover physics, e.g. "minute hand passes 12 -> hour increments") for a
 *  skill (3.MD.1) that's really about reading/placing the MINUTE hand
 *  precisely; the hour hand still renders at its true continuous position
 *  (see clockAngles) once the hour is set, so the "hour hand creeps toward
 *  the next number" visual is never lost. */
export function angleToMinute(rawAngle: number): number {
  const norm = ((rawAngle % 360) + 360) % 360;
  return Math.round(norm / 6) % 60;
}

/** Add `minutes` to a ClockTime, wrapping the hour (1-12, never 0) across
 *  any number of hour boundaries — the ONE function both Unit 2's Explore
 *  ("add N minutes, watch the hour roll over") and every elapsed-time
 *  problem's graded end-time answer use, so the two can never disagree. */
export function addMinutesToTime(t: ClockTime, minutes: number): ClockTime {
  const totalMinutes = t.hour * 60 + t.minute + minutes;
  // hour*60+minute is on a 12*60=720-minute wheel (12 o'clock acts as 0 and 12 at once).
  const wrapped = ((totalMinutes % 720) + 720) % 720;
  const hour12 = Math.floor(wrapped / 60) % 12;
  return { hour: hour12 === 0 ? 12 : hour12, minute: wrapped % 60 };
}

/** Minutes from `start` to `end`, always the smallest NON-NEGATIVE forward
 *  distance (i.e. assumes `end` is later than or equal to `start` within
 *  one trip around the 12-hour face — every elapsed-time word problem in
 *  this unit is set up that way, never asking to reason about AM/PM or a
 *  wrap spanning more than 12 hours). The one function both Unit 2's
 *  Explore display and every elapsed/start-time-unknown problem's graded
 *  answer use. */
export function elapsedMinutes(start: ClockTime, end: ClockTime): number {
  const s = start.hour * 60 + start.minute;
  const e = end.hour * 60 + end.minute;
  return ((e - s) % 720 + 720) % 720;
}

export interface ClockProps {
  time: ClockTime;
  size?: number;
  tone?: "a" | "b" | "c";
  /** Present only when the MINUTE hand should be draggable (Explore's free
   *  sandbox, or a "set the hands" Practice/Test widget) — reports the
   *  snapped minute the student dragged to, keeping `time.hour` unchanged.
   *  Omitted for every static display-only clock. */
  onChange?: (t: ClockTime) => void;
}

const R = 76;
const CX = R + 10;
const CY = R + 10;
const SIZE = (R + 10) * 2;

/** An analog clock face: 12 numbered major ticks, 60 minor ticks (every
 *  minute — the literal visual for "each small mark is one minute, each
 *  number is 5 minutes," Unit 1's core vocabulary point), an hour hand and
 *  a minute hand whose angles come from `clockAngles` (see its doc comment
 *  — the one and only place those angles are ever computed). */
export function Clock({ time, size = SIZE, tone = "a", onChange }: ClockProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { hourAngle, minuteAngle } = clockAngles(time);
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const draggable = !!onChange;

  const angleFromPointer = (clientX: number, clientY: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return minuteAngle;
    const scale = rect.width / SIZE;
    const x = (clientX - rect.left) / scale - CX;
    const y = (clientY - rect.top) / scale - CY;
    const deg = (Math.atan2(x, -y) * 180) / Math.PI;
    return deg;
  };

  const onPointerDown = draggable ? (e: React.PointerEvent) => e.currentTarget.setPointerCapture(e.pointerId) : undefined;
  const onPointerMove = draggable
    ? (e: React.PointerEvent) => {
        if (e.buttons !== 1) return;
        const next = angleToMinute(angleFromPointer(e.clientX, e.clientY));
        if (next !== time.minute) onChange!({ hour: time.hour, minute: next });
      }
    : undefined;

  const handEnd = (angleDeg: number, len: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: CX + len * Math.sin(rad), y: CY - len * Math.cos(rad) };
  };
  const hourEnd = handEnd(hourAngle, R * 0.48);
  const minuteEnd = handEnd(minuteAngle, R * 0.8);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      height={size}
      role="img"
      aria-label={`Analog clock showing ${clockLabel(time)}${draggable ? " — drag the long minute hand to change the minute" : ""}`}
      style={{ display: "block", fontFamily: diagramFont, touchAction: draggable ? "none" : undefined }}
    >
      <circle cx={CX} cy={CY} r={R} fill={palette.paper} stroke={palette.line} strokeWidth={3} />
      {/* 60 minor (1-minute) ticks — every 5th is swallowed by the major tick drawn below instead. */}
      {Array.from({ length: 60 }, (_, m) => {
        if (m % 5 === 0) return null;
        const p = handEnd(m * 6, R * 0.94);
        const t = handEnd(m * 6, R * 0.88);
        return <line key={`m${m}`} x1={t.x} y1={t.y} x2={p.x} y2={p.y} stroke={palette.grid} strokeWidth={1.5} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const p = handEnd(n * 30, R * 0.94);
        const t = handEnd(n * 30, R * 0.8);
        return (
          <g key={n}>
            <line x1={t.x} y1={t.y} x2={p.x} y2={p.y} stroke={palette.muted} strokeWidth={2.5} />
            <text x={handEnd(n * 30, R * 0.63).x} y={handEnd(n * 30, R * 0.63).y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={palette.ink}>
              {n}
            </text>
          </g>
        );
      })}
      <line x1={CX} y1={CY} x2={hourEnd.x} y2={hourEnd.y} stroke={palette.ink} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={CX} y1={CY} x2={minuteEnd.x} y2={minuteEnd.y} stroke={fill} strokeWidth={2.75} strokeLinecap="round" />
      {draggable && (
        <circle
          cx={minuteEnd.x}
          cy={minuteEnd.y}
          r={14}
          fill="transparent"
          style={{ cursor: "grab", touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        />
      )}
      <circle cx={CX} cy={CY} r={5} fill={palette.ink} />
      {draggable && <title>Drag the long minute hand to set the minute.</title>}
    </svg>
  );
}
