import type { ReactNode } from "react";
import { palette } from "../../../shared/lib/palette";

export interface PartsCircleProps {
  numerator: number;
  denominator: number;
  radius?: number;
  label?: ReactNode;
  /** Numbers each slice 1..denominator, centered inside it — off by default,
   *  on for a single standalone circle meant to teach "count the parts." */
  showNumbers?: boolean;
}

/** The SVG path for one pie slice, starting at 12 o'clock and going clockwise. */
function slicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

/**
 * A single fraction as a pie — the "pizza slice" model most 3rd graders
 * already carry an informal sense of, companion to shared FractionBar's
 * rectangular model. Equal-slice only (every slice is exactly
 * 360/denominator degrees) — this lab's unequal-parts trap bucket uses
 * UnequalPartsBar.tsx instead, since there's no such thing as a pie with
 * some slices wider than others that still reads as "equal parts" at a
 * glance the way an unequal BAR does.
 *
 * Near-verbatim copy of MG9_IntroToFractionsLab's own lab-local
 * FractionCircle.tsx (trimmed — this lab has no mixed-number/improper
 * content, so WholePlusPartCircles isn't needed here). This is the SECOND
 * lab wanting this exact shape; flagged as a shared/diagrams/ promotion
 * candidate for a future round, not acted on this one (scope guardrail —
 * no promotions this round, see VISUAL_COMPONENT_TODO.txt).
 */
export function PartsCircle({ numerator, denominator, radius = 56, label, showNumbers }: PartsCircleProps) {
  const pad = 4;
  const cx = radius + pad;
  const cy = radius + pad;
  const size = (radius + pad) * 2;
  const sliceDeg = 360 / denominator;
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

  return (
    <svg viewBox={`0 0 ${size} ${size + (label ? 22 : 0)}`} width={size} style={{ maxWidth: "100%" }} role="img" aria-label={typeof label === "string" ? label : `${numerator} of ${denominator} slices shaded`}>
      {Array.from({ length: denominator }, (_, i) => {
        const shaded = i < numerator;
        return (
          <path
            key={i}
            d={slicePath(cx, cy, radius, i * sliceDeg, (i + 1) * sliceDeg)}
            style={{ fill: shaded ? palette.a : palette.paper, fillOpacity: shaded ? 0.85 : 1, stroke: palette.line, strokeWidth: 1.5 }}
          />
        );
      })}
      {showNumbers &&
        Array.from({ length: denominator }, (_, i) => {
          const shaded = i < numerator;
          const midDeg = (i + 0.5) * sliceDeg;
          const labelR = radius * 0.62;
          const x = cx + labelR * Math.cos(toRad(midDeg));
          const y = cy + labelR * Math.sin(toRad(midDeg));
          return (
            <text key={`n${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" style={{ fill: shaded ? palette.paper : palette.ink, fontSize: radius * 0.3, fontWeight: 700 }}>
              {i + 1}
            </text>
          );
        })}
      <circle cx={cx} cy={cy} r={radius} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
      {label && (
        <text x={cx} y={size + 16} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
          {label}
        </text>
      )}
    </svg>
  );
}
