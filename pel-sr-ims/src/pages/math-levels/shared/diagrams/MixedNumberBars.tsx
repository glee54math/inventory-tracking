import type { ReactNode } from "react";
import { palette, diagramFont } from "../lib/palette";
import { MathText } from "../components/MathText";

export interface MixedNumberBarsProps {
  /** Bundled wholes — each drawn as ONE solid bar labeled "1", no piece lines. */
  wholes: number;
  /** Loose pieces of 1/den. May be MORE than den right after a whole has been
   *  unbundled (e.g. 3 1/4 regrouped as 2 5/4): then the loose pieces fill a
   *  full den/den bar plus a partial one — the unbundled whole, cut into pieces. */
  num: number;
  den: number;
  tone?: "a" | "b" | "c";
  /** Cross out this many of the bundled wholes (taken away), from the right. */
  takeWholes?: number;
  /** Cross out this many loose pieces (taken away), from the end. */
  takeNum?: number;
  barWidth?: number;
  height?: number;
  caption?: ReactNode;
  /** Ring the last bundled whole with a dashed outline: "this is the whole you
   *  will borrow". Points at it without cutting it, so the picture doesn't
   *  show the regrouped numbers a borrow step asks for. */
  ringLastWhole?: boolean;
}

/**
 * A mixed number drawn as what it means — solid whole bars plus loose
 * same-size pieces — with optional crossed-out "take away" marks. The
 * bundled/loose distinction is the whole point: a solid whole can't have
 * 3/4 taken out of it until it's been unbundled into 4/4, so the borrow step
 * in subtraction shows up as one solid bar turning into a bar of pieces.
 * Callers pass the regrouped numbers straight from lib/fractions.ts's
 * mixedSubtract(), the same breakdown the graded steps use.
 */
export function MixedNumberBars({ wholes, num, den, tone = "a", takeWholes = 0, takeNum = 0, barWidth = 150, height = 48, caption, ringLastWhole }: MixedNumberBarsProps) {
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const looseBars = Math.ceil(num / den);
  const cellW = barWidth / den;
  const cross = (x1: number, x2: number) => (
    <>
      <line x1={x1 + 4} y1={6} x2={x2 - 4} y2={height - 6} style={{ stroke: palette.bad, strokeWidth: 2.5 }} />
      <line x1={x2 - 4} y1={6} x2={x1 + 4} y2={height - 6} style={{ stroke: palette.bad, strokeWidth: 2.5 }} />
    </>
  );
  const svgProps = { viewBox: `0 0 ${barWidth + 4} ${height + 4}`, width: barWidth + 4, style: { maxWidth: "100%", fontFamily: diagramFont, display: "block" } } as const;

  return (
    <div role="img" aria-label={`${wholes} whole${wholes === 1 ? "" : "s"} and ${num} pieces of 1/${den}`}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
        {Array.from({ length: wholes }, (_, i) => {
          const taken = i >= wholes - takeWholes;
          return (
            <svg key={`w${i}`} {...svgProps}>
              <g transform="translate(2 2)">
                <rect x={0} y={0} width={barWidth} height={height} style={{ fill: taken ? palette.paper : fill, fillOpacity: 0.85, stroke: palette.ink, strokeWidth: 2 }} />
                <text x={barWidth / 2} y={height / 2 + 6} textAnchor="middle" style={{ fill: taken ? palette.muted : "var(--on-q, #fff)", fontSize: 16, fontWeight: 800 }}>
                  1
                </text>
                {taken && cross(0, barWidth)}
                {ringLastWhole && i === wholes - 1 && (
                  <rect x={1} y={1} width={barWidth - 2} height={height - 2} style={{ fill: "none", stroke: palette.c, strokeWidth: 4, strokeDasharray: "7 4" }} />
                )}
              </g>
            </svg>
          );
        })}
        {Array.from({ length: looseBars }, (_, b) => (
          <svg key={`p${b}`} {...svgProps}>
            <g transform="translate(2 2)">
              {Array.from({ length: den }, (_, i) => {
                const idx = b * den + i;
                const shaded = idx < num;
                const taken = shaded && idx >= num - takeNum;
                return (
                  <g key={i}>
                    <rect
                      x={i * cellW}
                      y={0}
                      width={cellW}
                      height={height}
                      style={{ fill: shaded && !taken ? fill : palette.paper, fillOpacity: shaded && !taken ? 0.85 : 1, stroke: palette.line, strokeWidth: 1 }}
                    />
                    {taken && cross(i * cellW, (i + 1) * cellW)}
                  </g>
                );
              })}
              <rect x={0} y={0} width={barWidth} height={height} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
            </g>
          </svg>
        ))}
      </div>
      {caption && (
        <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
          <MathText>{caption}</MathText>
        </p>
      )}
    </div>
  );
}
