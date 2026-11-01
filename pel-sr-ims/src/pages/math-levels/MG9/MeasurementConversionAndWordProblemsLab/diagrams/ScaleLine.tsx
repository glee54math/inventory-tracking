import { useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { fmt } from "../../../shared/lib/math";

export interface ScalePoint {
  value: number;
  label?: string;
  tone?: "a" | "b" | "c";
  /** Explore-only: lets the student drag this point (snaps to `minor`).
   *  Never set on a point whose value IS a Practice/Test answer. */
  onChange?: (value: number) => void;
}

export interface ScaleLineProps {
  min: number;
  max: number;
  /** Labeled tick spacing, e.g. 100. */
  major: number;
  /** Unlabeled tick spacing, e.g. 25 — reading what one of these is worth
   *  is itself the skill Unit 2's number-line bucket practices. */
  minor: number;
  unit: string;
  points?: ScalePoint[];
  /** Draws a bracket under the line from one value to another, e.g. the
   *  distance between two marked points once the student has found it. */
  bracket?: { from: number; to: number; label: string };
}

const W = 560;
const PAD = 30;
const LINE_Y = 52;

const toneColor = (t?: "a" | "b" | "c") => (t === "b" ? palette.b : t === "c" ? palette.c : palette.a);

/**
 * A measurement scale (trail map, measuring cup, timeline, scale dial
 * unrolled flat): labeled major ticks, unlabeled minor ticks, and points
 * placed by value. Unlike shared/diagrams/NumberLine (integer ticks every
 * unit, auto-thinned labels), the caller chooses BOTH tick spacings here —
 * the whole question is often "the labels go up by 100 with 3 small ticks
 * in between, so each small tick is 25." Every element is positioned from
 * one toX(), so ticks, points and the bracket can't drift apart.
 * Longest tick label is "1,000" (5 chars, ~32px) and labeled ticks are
 * never closer than ~50px with ≤10 major intervals, so labels can't collide.
 */
export function ScaleLine({ min, max, major, minor, unit, points = [], bracket }: ScaleLineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const span = max - min;
  const usable = W - PAD * 2 - 24; // room on the right for the unit word
  const toX = (v: number) => PAD + ((v - min) / span) * usable;
  const majors: number[] = [];
  for (let v = min; v <= max + 1e-9; v += major) majors.push(Math.round(v * 1000) / 1000);
  const minors: number[] = [];
  for (let v = min; v <= max + 1e-9; v += minor) {
    const r = Math.round(v * 1000) / 1000;
    if (!majors.some((m) => Math.abs(m - r) < 1e-9)) minors.push(r);
  }
  const height = bracket ? 112 : 86;

  const toValue = (clientX: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return min;
    const scale = rect.width / W;
    const raw = min + ((clientX - rect.left) / scale - PAD) * (span / usable);
    const snapped = Math.round(raw / minor) * minor;
    return Math.min(max, Math.max(min, Math.round(snapped * 1000) / 1000));
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${height}`}
      role="img"
      aria-label={`A scale from ${fmt(min)} to ${fmt(max)} ${unit}, labeled every ${fmt(major)}`}
      style={{ display: "block", width: "100%", maxWidth: W, height: "auto", fontFamily: diagramFont }}
    >
      <line x1={PAD} y1={LINE_Y} x2={PAD + usable} y2={LINE_Y} style={{ stroke: palette.ink, strokeWidth: 2 }} />
      {minors.map((v) => (
        <line key={`m${v}`} x1={toX(v)} y1={LINE_Y - 5} x2={toX(v)} y2={LINE_Y + 5} style={{ stroke: palette.muted, strokeWidth: 1.2 }} />
      ))}
      {majors.map((v) => (
        <g key={`M${v}`}>
          <line x1={toX(v)} y1={LINE_Y - 10} x2={toX(v)} y2={LINE_Y + 10} style={{ stroke: palette.ink, strokeWidth: 2 }} />
          <text x={toX(v)} y={LINE_Y + 26} textAnchor="middle" style={{ fill: palette.ink, fontSize: 12, fontWeight: 600 }}>
            {fmt(v)}
          </text>
        </g>
      ))}
      <text x={PAD + usable + 10} y={LINE_Y + 5} style={{ fill: palette.muted, fontSize: 13, fontWeight: 700 }}>
        {unit}
      </text>
      {bracket && (
        <g>
          <path
            d={`M ${toX(bracket.from)} ${LINE_Y + 36} v 8 H ${toX(bracket.to)} v -8`}
            style={{ fill: "none", stroke: palette.c, strokeWidth: 2 }}
          />
          <text x={(toX(bracket.from) + toX(bracket.to)) / 2} y={LINE_Y + 60} textAnchor="middle" style={{ fill: palette.c, fontSize: 13, fontWeight: 700 }}>
            {bracket.label}
          </text>
        </g>
      )}
      {points.map((p, i) => {
        const x = toX(p.value);
        const drag = p.onChange;
        return (
          <g key={i}>
            {p.label && (
              <text x={x} y={LINE_Y - 18} textAnchor="middle" style={{ fill: toneColor(p.tone), fontSize: 13, fontWeight: 800 }}>
                {p.label}
              </text>
            )}
            <circle cx={x} cy={LINE_Y} r={7} style={{ fill: toneColor(p.tone), stroke: palette.paper, strokeWidth: 2 }} pointerEvents="none" />
            {drag && (
              <circle
                cx={x}
                cy={LINE_Y}
                r={16}
                fill="transparent"
                style={{ cursor: "grab", touchAction: "none" }}
                onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
                onPointerMove={(e) => {
                  if (e.buttons !== 1) return;
                  const v = toValue(e.clientX);
                  if (v !== p.value) drag(v);
                }}
              />
            )}
          </g>
        );
      })}
      {points.some((p) => p.onChange) && <title>Drag the dot to change its value.</title>}
    </svg>
  );
}
