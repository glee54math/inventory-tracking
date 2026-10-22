import type { ReactNode } from "react";
import { palette } from "../../../shared/lib/palette";

export interface FractionCircleProps {
  numerator: number;
  denominator: number;
  radius?: number;
  label?: ReactNode;
  /** Numbers each slice 1..denominator, centered inside it — off by default
   *  (a multi-pie WholePlusPartCircles picture reads cleaner unlabeled), on
   *  for a single standalone circle meant to teach "count the parts." */
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
 * A single fraction as a pie — the "pizza slice" model most students already
 * carry an intuition for, companion to FractionBar's rectangular model. One
 * circle can only show a fraction with numerator ≤ denominator (there's no
 * such thing as 4 shaded slices out of a 3-slice pie); see
 * WholePlusPartCircles below for numerator > denominator.
 */
export function FractionCircle({ numerator, denominator, radius = 56, label, showNumbers }: FractionCircleProps) {
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

export interface WholePlusPartCirclesProps {
  /** How many full wholes — each drawn as its own fully-shaded pie. */
  whole: number;
  /** The leftover numerator, out of `den` — 0 renders no partial pie at all. */
  leftoverNum: number;
  den: number;
  radius?: number;
  caption?: ReactNode;
}

/**
 * The pie-chart counterpart to WholePlusPartBar.tsx: `whole` complete pies
 * (each fully shaded) next to one partial pie for the leftover. The SAME
 * picture reads as an improper fraction (count every shaded slice) or a
 * mixed number (whole pies + the partial one) — that coincidence is the
 * point, same as WholePlusPartBar's own doc comment.
 */
export function WholePlusPartCircles({ whole, leftoverNum, den, radius = 50, caption }: WholePlusPartCirclesProps) {
  return (
    <div role="img" aria-label={`${whole} whole${whole === 1 ? "" : "s"} and ${leftoverNum}/${den} left over`}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
        {Array.from({ length: whole }, (_, i) => (
          <FractionCircle key={`w${i}`} numerator={den} denominator={den} radius={radius} />
        ))}
        {leftoverNum > 0 && <FractionCircle numerator={leftoverNum} denominator={den} radius={radius} />}
      </div>
      {caption && (
        <p className="muted small" style={{ marginTop: 8 }}>
          {caption}
        </p>
      )}
    </div>
  );
}
