import type { ReactNode } from "react";
import { FractionBar } from "../../../shared/diagrams";

export interface WholePlusPartBarProps {
  /** How many full wholes — each drawn as its own fully-shaded bar. */
  whole: number;
  /** The leftover numerator, out of `den` — 0 renders no partial bar at all. */
  leftoverNum: number;
  den: number;
  barWidth?: number;
  barHeight?: number;
  caption?: ReactNode;
}

/**
 * A mixed number drawn literally as what it means: `whole` complete bars
 * (each its own `FractionBar numerator={den} denominator={den}`, fully
 * shaded) sitting next to one partial bar for the leftover — instead of one
 * bar trying to represent a value bigger than a single whole. This is the
 * concrete picture behind both conversion directions MG9's Fraction Forms
 * unit teaches: reading left to right gives the mixed number (`whole` wholes
 * + the partial bar); counting every shaded cell across every bar gives the
 * same value as one improper fraction (`whole × den + leftoverNum` over
 * `den`) — the two forms are the same picture, read two ways.
 */
export function WholePlusPartBar({ whole, leftoverNum, den, barWidth = 90, barHeight = 64, caption }: WholePlusPartBarProps) {
  return (
    <div role="img" aria-label={`${whole} whole${whole === 1 ? "" : "s"} and ${leftoverNum}/${den} left over`}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "flex-end" }}>
        {Array.from({ length: whole }, (_, i) => (
          <FractionBar key={`w${i}`} numerator={den} denominator={den} width={barWidth} height={barHeight} />
        ))}
        {leftoverNum > 0 && <FractionBar numerator={leftoverNum} denominator={den} width={barWidth} height={barHeight} />}
      </div>
      {caption && <p className="muted small" style={{ marginTop: 8 }}>{caption}</p>}
    </div>
  );
}
