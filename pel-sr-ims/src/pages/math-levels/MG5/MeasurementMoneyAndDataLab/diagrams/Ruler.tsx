import { useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";

export type RulerUnit = "in" | "cm";

export interface RulerProps {
  unit: RulerUnit;
  /** Ruler length in whole units shown, e.g. 12 for a 12-inch ruler, 30 for a 30cm ruler. */
  maxUnits: number;
  /** Where the object's left edge sits on the ruler, in whole units. 0 = aligned to the zero mark. */
  objectStart: number;
  /** The object's TRUE length, in whole units — objectStart + objectLength must be <= maxUnits. */
  objectLength: number;
  label?: string;
  tone?: "a" | "b" | "c";
  /** Present only for Explore's draggable sandbox. */
  onDrag?: (start: number) => void;
}

/**
 * THE one function deriving an object's true start/end/length on a ruler —
 * both the diagram's own dashed guide lines AND every graded "how long is
 * it" answer (and the broken-ruler misread's own distractor, `end`) are
 * built from this, never recomputed independently elsewhere. This is the
 * exact pattern MG3's Clock.tsx flags as the one place a diagram and its
 * grading could otherwise silently disagree.
 */
export function rulerReading(objectStart: number, objectLength: number) {
  return { start: objectStart, end: objectStart + objectLength, length: objectLength };
}

const UNIT_PX = 26;
const PAD = 20;
const OBJ_H = 26;
const OBJ_Y = 0;
const RULER_Y = OBJ_Y + OBJ_H + 14;
const RULER_H = 46;

/**
 * A real ruler: numbered tick marks every whole unit (major ticks every 5),
 * with a solid object bar drawn above it. `objectStart` controls where the
 * object sits — 0 lines it up with the ruler's own zero mark (the
 * straightforward read-the-endpoint case); any other value is the "broken
 * ruler" case, where the true length is `end - start`, NOT the endpoint
 * number alone. Dashed guide lines drop from the object's own start/end
 * down through the ruler so a student can see exactly which two marks
 * matter, instead of just the numeral the far end happens to land on.
 */
export function Ruler({ unit, maxUnits, objectStart, objectLength, label, tone = "a", onDrag }: RulerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = PAD * 2 + maxUnits * UNIT_PX;
  const height = RULER_Y + RULER_H + 14;
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const { start, end, length } = rulerReading(objectStart, objectLength);
  const draggable = !!onDrag;

  const dragFrom = (clientX: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return objectStart;
    const scale = rect.width / width;
    const x = (clientX - rect.left) / scale - PAD;
    const raw = x / UNIT_PX;
    return Math.max(0, Math.min(maxUnits - length, Math.round(raw)));
  };

  const onPointerDown = draggable ? (e: React.PointerEvent) => e.currentTarget.setPointerCapture(e.pointerId) : undefined;
  const onPointerMove = draggable
    ? (e: React.PointerEvent) => {
        if (e.buttons !== 1) return;
        const next = dragFrom(e.clientX);
        if (next !== objectStart) onDrag!(next);
      }
    : undefined;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`A ${unit === "in" ? "inch" : "centimeter"} ruler, ${maxUnits} ${unit} long, with an object from mark ${start} to mark ${end}${draggable ? " — drag the object along the ruler" : ""}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont, touchAction: draggable ? "none" : undefined }}
    >
      <rect x={PAD} y={RULER_Y} width={maxUnits * UNIT_PX} height={RULER_H} fill={palette.paper} stroke={palette.line} strokeWidth={2} />
      {Array.from({ length: maxUnits + 1 }, (_, i) => {
        const x = PAD + i * UNIT_PX;
        const major = i % 5 === 0;
        return (
          <g key={i}>
            <line x1={x} y1={RULER_Y} x2={x} y2={RULER_Y + (major ? RULER_H * 0.55 : RULER_H * 0.3)} stroke={palette.muted} strokeWidth={major ? 2 : 1} />
            {major && (
              <text x={x} y={RULER_Y + RULER_H - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={palette.muted}>
                {i}
              </text>
            )}
          </g>
        );
      })}
      <rect
        x={PAD + start * UNIT_PX}
        y={OBJ_Y}
        width={Math.max(length * UNIT_PX, 6)}
        height={OBJ_H}
        rx={5}
        fill={fill}
        opacity={0.85}
        style={draggable ? { cursor: "grab", touchAction: "none" } : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      />
      {label && (
        <text x={PAD + start * UNIT_PX + (length * UNIT_PX) / 2} y={OBJ_Y + OBJ_H / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={palette.paper}>
          {label}
        </text>
      )}
      <line x1={PAD + start * UNIT_PX} y1={OBJ_Y - 4} x2={PAD + start * UNIT_PX} y2={RULER_Y + RULER_H} stroke={fill} strokeDasharray="3 3" />
      <line x1={PAD + end * UNIT_PX} y1={OBJ_Y - 4} x2={PAD + end * UNIT_PX} y2={RULER_Y + RULER_H} stroke={fill} strokeDasharray="3 3" />
      {draggable && <title>Drag the object along the ruler.</title>}
    </svg>
  );
}
