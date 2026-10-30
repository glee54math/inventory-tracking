import { useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";

/** hour is 1-12; minute is always a multiple of 5 (0-55) — this lab's
 *  standard (2.MD.7) stops at 5-minute resolution. isPM is tracked
 *  separately since a clock FACE never shows it — a.m./p.m. only ever comes
 *  from a word problem's context, never from the dial itself. */
export interface ClockTimeG2 {
  hour: number;
  minute: number;
  isPM?: boolean;
}

/**
 * THE single function both the clock face's hand angles AND every graded
 * time answer are derived from — see MG3's Clock.tsx for why this matters
 * (its own doc comment flags a real off-by-one bug this exact convention
 * caught). The hour hand moves continuously with the minute (0.5deg per
 * minute), not just snapping to the hour — that's what makes "the hour hand
 * is almost at the next number" a real, visible thing at :50, not just a
 * description.
 */
export function clockAnglesG2(t: ClockTimeG2): { hourAngle: number; minuteAngle: number } {
  const hour12 = t.hour % 12; // 0-11; 12 o'clock -> 0
  const hourAngle = hour12 * 30 + t.minute * 0.5;
  const minuteAngle = t.minute * 6;
  return { hourAngle, minuteAngle };
}

/** "4:05" / "4:50" — the canonical digital label (no am/pm — see ClockTimeG2's
 *  doc comment for why that's tracked separately). */
export function clockLabelG2(t: ClockTimeG2): string {
  return `${t.hour}:${String(t.minute).padStart(2, "0")}`;
}

/** Inverse of clockAnglesG2's hour-hand angle: snaps a raw dragged angle to
 *  the nearest valid 5-minute hour-hand position (every 2.5deg) and
 *  reconstructs the full ClockTimeG2 — the hour hand's own position between
 *  numbers already encodes the minute, exactly like MG3's half-hour version,
 *  just at finer resolution. */
export function angleToClockTimeG2(rawAngle: number): ClockTimeG2 {
  const norm = ((rawAngle % 360) + 360) % 360;
  const snapped = (Math.round(norm / 2.5) * 2.5) % 360;
  const hour12 = Math.floor(snapped / 30) % 12;
  const remainder = snapped - hour12 * 30;
  const minute = Math.round(remainder / 0.5) % 60;
  return { hour: hour12 === 0 ? 12 : hour12, minute };
}

export interface ClockG2Props {
  time: ClockTimeG2;
  size?: number;
  tone?: "a" | "b" | "c";
  /** Present only when the hour hand should be draggable (Explore's free
   *  sandbox, or a "set the hands" widget) — reports the snapped
   *  ClockTimeG2 the student dragged to. Omitted for every static
   *  display-only clock. */
  onChange?: (t: ClockTimeG2) => void;
}

const R = 76;
const CX = R + 10;
const CY = R + 10;
const SIZE = (R + 10) * 2;

/** An analog clock face with 12 numbered hour ticks AND a minor tick every
 *  5 minutes (60 total) — the 5-minute marks are the literal visual this
 *  standard is named after, not just an incidental decoration. */
export function ClockG2({ time, size = SIZE, tone = "a", onChange }: ClockG2Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { hourAngle, minuteAngle } = clockAnglesG2(time);
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const draggable = !!onChange;

  const angleFromPointer = (clientX: number, clientY: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return hourAngle;
    const scale = rect.width / SIZE;
    const x = (clientX - rect.left) / scale - CX;
    const y = (clientY - rect.top) / scale - CY;
    return (Math.atan2(x, -y) * 180) / Math.PI;
  };

  const onPointerDown = draggable ? (e: React.PointerEvent) => e.currentTarget.setPointerCapture(e.pointerId) : undefined;
  const onPointerMove = draggable
    ? (e: React.PointerEvent) => {
        if (e.buttons !== 1) return;
        const next = angleToClockTimeG2(angleFromPointer(e.clientX, e.clientY));
        if (next.hour !== time.hour || next.minute !== time.minute) onChange!({ ...next, isPM: time.isPM });
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
      aria-label={`Analog clock showing ${clockLabelG2(time)}${draggable ? " — drag the hour hand to change the time" : ""}`}
      style={{ display: "block", fontFamily: diagramFont, touchAction: draggable ? "none" : undefined }}
    >
      <circle cx={CX} cy={CY} r={R} fill={palette.paper} stroke={palette.line} strokeWidth={3} />
      {Array.from({ length: 60 }, (_, m) => {
        const major = m % 5 === 0;
        const p = handEnd(m * 6, R * 0.95);
        const t = handEnd(m * 6, major ? R * 0.82 : R * 0.9);
        return <line key={m} x1={t.x} y1={t.y} x2={p.x} y2={p.y} stroke={palette.muted} strokeWidth={major ? 2 : 1} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        return (
          <text key={n} x={handEnd(n * 30, R * 0.62).x} y={handEnd(n * 30, R * 0.62).y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={palette.ink}>
            {n}
          </text>
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
