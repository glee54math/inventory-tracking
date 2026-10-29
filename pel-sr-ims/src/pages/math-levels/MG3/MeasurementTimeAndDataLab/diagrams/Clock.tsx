import { useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";

/** hour is always 1-12 (12-hour clock face); half=false means :00, half=true
 *  means :30 — the only two minute positions this lab's standard (1.MD.3,
 *  hour/half-hour) ever covers. */
export interface ClockTime {
  hour: number;
  half: boolean;
}

/**
 * THE single function both the clock face's hand angles AND every graded
 * "what time is it" / "set the hands to..." answer are derived from. Never
 * compute an hour-hand angle anywhere else, and never derive a "correct
 * time" from anything other than a ClockTime value rendered through this
 * same function — that's the one way this diagram and its own grading could
 * silently disagree (an explicitly called-out recurring bug pattern in this
 * codebase). The minute hand only ever points at 12 (0°) or 6 (180°); the
 * hour hand sits exactly at its number (hour*30°) for :00, or exactly
 * halfway to the next number (+15°) for :30 — never anywhere else, which is
 * also what makes a dragged angle unambiguously snap back to a valid
 * ClockTime in `angleToClockTime` below.
 */
export function clockAngles(t: ClockTime): { hourAngle: number; minuteAngle: number } {
  // hour=12 sits at the top (0deg, pointing straight at the "12" tick);
  // hour=1..11 sit at hour*30deg (hour=1 at the "1" tick, 30deg clockwise
  // from the top, and so on) — i.e. hour12 is just `hour % 12`, NOT
  // `hour - 1`. An earlier version of this function used a `(hour - 1) %
  // 12` offset, which silently rendered every hour's hand ONE tick
  // counter-clockwise from where it belonged (e.g. "1:00" drawn pointing at
  // the 12, "12:00" drawn pointing at the 11) — caught by this lab's own
  // brute-force verification script cross-checking this function against
  // angleToClockTime's inverse below, which was already written against the
  // CORRECT `hour % 12` convention.
  const hour12 = t.hour % 12; // 0-11; 12 o'clock -> 0
  const hourAngle = hour12 * 30 + (t.half ? 15 : 0);
  const minuteAngle = t.half ? 180 : 0;
  return { hourAngle, minuteAngle };
}

/** "4:00" / "4:30" — the canonical digital label for a ClockTime, used both
 *  for display and (via string compare or [hour,minute] pairs elsewhere) as
 *  the source of every test/practice question's correct answer text. */
export function clockLabel(t: ClockTime): string {
  return `${t.hour}:${t.half ? "30" : "00"}`;
}

/** Inverse of clockAngles' hour-hand angle: snaps a raw dragged angle
 *  (0-359.999) to the nearest valid hour-hand position (every 15°) and
 *  reconstructs the ClockTime it represents. This is how Explore's and the
 *  "set the hands" Practice/Test widget's single draggable hour hand can
 *  determine BOTH the hour and whether it's :00 or :30 from one drag — on a
 *  real clock the hour hand's position between numbers IS the half-hour
 *  information, so there's no separate minute-hand drag needed. */
export function angleToClockTime(rawAngle: number): ClockTime {
  const norm = ((rawAngle % 360) + 360) % 360;
  const snapped = Math.round(norm / 15) * 15 % 360;
  const half = snapped % 30 === 15;
  const hour12 = Math.floor(snapped / 30) % 12; // 0-11
  return { hour: hour12 === 0 ? 12 : hour12, half };
}

export interface ClockProps {
  time: ClockTime;
  size?: number;
  tone?: "a" | "b" | "c";
  /** Present only when the hour hand should be draggable (Explore's free
   *  sandbox, or a "set the hands" Practice/Test widget) — reports the
   *  snapped ClockTime the student dragged to. Omitted for every static
   *  display-only clock (the vast majority: Practice/Test visuals that show
   *  a time for the student to READ, where dragging would let them just
   *  move the answer instead of reading it). */
  onChange?: (t: ClockTime) => void;
}

const R = 72;
const CX = R + 10;
const CY = R + 10;
const SIZE = (R + 10) * 2;

/** An analog clock face: 12 numbered ticks, an hour hand and a minute hand
 *  whose angles come from `clockAngles` (see its doc comment — this is the
 *  one and only place those angles are ever computed). */
export function Clock({ time, size = SIZE, tone = "a", onChange }: ClockProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { hourAngle, minuteAngle } = clockAngles(time);
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const draggable = !!onChange;

  const angleFromPointer = (clientX: number, clientY: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return hourAngle;
    const scale = rect.width / SIZE;
    const x = (clientX - rect.left) / scale - CX;
    const y = (clientY - rect.top) / scale - CY;
    // 0deg = 12 o'clock (straight up), clockwise positive — matches how
    // clockAngles defines hour*30deg increasing clockwise from 12.
    const deg = (Math.atan2(x, -y) * 180) / Math.PI;
    return deg;
  };

  const onPointerDown = draggable ? (e: React.PointerEvent) => e.currentTarget.setPointerCapture(e.pointerId) : undefined;
  const onPointerMove = draggable
    ? (e: React.PointerEvent) => {
        if (e.buttons !== 1) return;
        const next = angleToClockTime(angleFromPointer(e.clientX, e.clientY));
        if (next.hour !== time.hour || next.half !== time.half) onChange!(next);
      }
    : undefined;

  const handEnd = (angleDeg: number, len: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: CX + len * Math.sin(rad), y: CY - len * Math.cos(rad) };
  };
  const hourEnd = handEnd(hourAngle, R * 0.5);
  const minuteEnd = handEnd(minuteAngle, R * 0.78);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      height={size}
      role="img"
      aria-label={`Analog clock showing ${clockLabel(time)}${draggable ? " — drag the hour hand to change the time" : ""}`}
      style={{ display: "block", fontFamily: diagramFont, touchAction: draggable ? "none" : undefined }}
    >
      <circle cx={CX} cy={CY} r={R} fill={palette.paper} stroke={palette.line} strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const p = handEnd(n * 30, R * 0.84);
        const t = handEnd(n * 30, R * 0.68);
        return (
          <g key={n}>
            <line x1={t.x} y1={t.y} x2={p.x} y2={p.y} stroke={palette.muted} strokeWidth={2} />
            <text x={handEnd(n * 30, R * 0.56).x} y={handEnd(n * 30, R * 0.56).y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={palette.ink}>
              {n}
            </text>
          </g>
        );
      })}
      <line x1={CX} y1={CY} x2={minuteEnd.x} y2={minuteEnd.y} stroke={palette.muted} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={CX} y1={CY} x2={hourEnd.x} y2={hourEnd.y} stroke={fill} strokeWidth={4.5} strokeLinecap="round" />
      {draggable && (
        <circle
          cx={hourEnd.x}
          cy={hourEnd.y}
          r={14}
          fill="transparent"
          style={{ cursor: "grab", touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        />
      )}
      <circle cx={CX} cy={CY} r={5} fill={palette.ink} />
      {draggable && <title>Drag the thick hour hand to set the time.</title>}
    </svg>
  );
}
