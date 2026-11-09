import type { CSSProperties } from "react";

/**
 * A label for an SVG diagram that draws fractions the handwritten way: the
 * numerator over a short bar over the denominator, with a whole number in
 * front for a mixed number ("1 1/2"). Anything else ("0", "estimate") is
 * drawn as plain text. Centered on (x, y); for a fraction, y is the bar.
 * SVG text can't hold the HTML stacked fraction (MathText), so this is its
 * SVG twin. Lab-local: BenchmarkLine is its only user (MG10 U3-01).
 */
export function SvgMath({ text, x, y, fontSize, color, weight = 800 }: { text: string; x: number; y: number; fontSize: number; color: string; weight?: number }) {
  const style: CSSProperties = { fill: color, fontSize, fontWeight: weight };
  const m = /^(?:(\d+) )?(\d+)\/(\d+)$/.exec(text);
  if (!m) {
    return (
      <text x={x} y={y + fontSize * 0.35} textAnchor="middle" style={style} aria-hidden>
        {text}
      </text>
    );
  }
  const [, w, n, d] = m;
  const digit = fontSize * 0.6;
  const barW = Math.max(n.length, d.length) * digit + 6;
  const wholeW = w ? w.length * digit + 3 : 0;
  const left = x - (wholeW + barW) / 2;
  const fx = left + wholeW + barW / 2;
  return (
    <g aria-hidden>
      {w && (
        <text x={left + (wholeW - 3) / 2} y={y + fontSize * 0.36} textAnchor="middle" style={style}>
          {w}
        </text>
      )}
      <text x={fx} y={y - 3} textAnchor="middle" style={style}>
        {n}
      </text>
      <line x1={fx - barW / 2} y1={y} x2={fx + barW / 2} y2={y} style={{ stroke: color, strokeWidth: 1.6 }} />
      <text x={fx} y={y + fontSize * 0.75 + 3} textAnchor="middle" style={style}>
        {d}
      </text>
    </g>
  );
}
