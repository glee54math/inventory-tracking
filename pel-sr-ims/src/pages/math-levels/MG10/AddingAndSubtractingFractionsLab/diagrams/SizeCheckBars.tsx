import type { ReactNode } from "react";
import { PieceBars, type PieceTone } from "../../../shared/diagrams";
import { Frac } from "../../../shared/engine/controls";
import { MathText } from "../../../shared/components/MathText";

export interface SizeCheckRow {
  n: number;
  d: number;
  tone: PieceTone;
  /** Shown before the bar; defaults to the stacked fraction n/d. */
  label?: ReactNode;
}

export interface SizeCheckBarsProps {
  rows: SizeCheckRow[];
  caption?: ReactNode;
  barWidth?: number;
}

/**
 * A size check (MG10 round 5, U5-02): a few amounts as same-width bars, one
 * per row, so the student can SEE that an "added across" answer is shorter
 * than the bigger fraction it was supposed to grow (or that a "subtracted
 * across" answer is longer than the number it was taken from). Each row is
 * the shared PieceBars, in its own piece size. Lab-local: only MG10 draws it.
 */
export function SizeCheckBars({ rows, caption, barWidth = 200 }: SizeCheckBarsProps) {
  const wholes = Math.max(1, ...rows.map((r) => Math.ceil(r.n / r.d)));
  return (
    <div className="recut-bars size-check">
      {rows.map((r, i) => (
        <div className="recut-row" key={i}>
          <span className={`recut-label q${r.tone === "gone" ? "c" : r.tone}-text`}>{r.label ?? <Frac n={r.n} d={r.d} />}</span>
          <PieceBars den={r.d} segments={[{ count: r.n, tone: r.tone }]} minWholes={wholes} barWidth={barWidth} height={30} />
        </div>
      ))}
      {caption && (
        <p className="muted small" style={{ margin: 0 }}>
          <MathText>{caption}</MathText>
        </p>
      )}
    </div>
  );
}
