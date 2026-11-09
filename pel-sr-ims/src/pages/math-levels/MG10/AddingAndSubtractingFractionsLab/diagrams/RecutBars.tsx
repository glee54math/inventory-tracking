import type { ReactNode } from "react";
import { PieceBars, type PieceSegment } from "../../../shared/diagrams";
import { Frac } from "../../../shared/engine/controls";
import { MathText } from "../../../shared/components/MathText";
import { combine, type Op } from "../lib/fractions";

export interface RecutBarsProps {
  n1: number;
  d1: number;
  n2: number;
  d2: number;
  op?: Op;
  /** Re-cut both bars into LCD pieces (thick lines keep the old piece edges). */
  recut?: boolean;
  /** Draw the combined bar (sum, or difference with the taken pieces crossed out). */
  result?: boolean;
  /** Extra line under the picture. */
  caption?: ReactNode;
  barWidth?: number;
  /** Hide the re-cut fraction labels (e.g. "9/12") while they would give an answer away. */
  hideLabels?: boolean;
  /**
   * Once re-cut, keep labeling each bar with its ORIGINAL fraction ("2/3", not
   * "4/6") and the result bar "together": the bars stay named without printing
   * the renamed tops a step asks for (MG10 round 5, C5-04). Wins over hideLabels.
   */
  originalLabels?: boolean;
}

/** Above this many pieces in a whole, bars are drawn wider so the pieces stay countable. */
const WIDE_OVER = 24;

/**
 * Two fractions with different denominators as two same-width bars (the same
 * whole), each cut into its own pieces — then, once `recut` is on, both cut
 * again into the SAME number of pieces (the LCD), so the student can see that
 * 3/4 and 9/12 are the same amount. `result` adds a third bar in LCD pieces:
 * both colors together for a sum, the second color crossed out for a
 * difference. Every count comes from lib/fractions.ts's combine(), the same
 * function the graded steps use.
 */
export function RecutBars({ n1, d1, n2, d2, op = "add", recut, result, caption, barWidth: baseWidth = 240, hideLabels, originalLabels }: RecutBarsProps) {
  const { L, a, b } = combine(op, n1, d1, n2, d2);
  // Past 24 pieces a whole would be cut into slivers, so every bar gets wider
  // (about 12 px a piece, up to 600). All bars stay the same width: the same whole.
  const wide = L > WIDE_OVER;
  const barWidth = wide ? Math.min(600, Math.max(baseWidth, L * 12)) : baseWidth;
  const k1 = L / d1;
  const k2 = L / d2;
  const cutsFor = (k: number, count: number) => (k > 1 ? Array.from({ length: count }, (_, i) => i * k).filter((x) => x > 0) : []);
  const wholes1 = Math.max(1, Math.ceil(n1 / d1));
  const wholes2 = Math.max(1, Math.ceil(n2 / d2));
  const resultSegs: PieceSegment[] = op === "add" ? [{ count: a, tone: "a" }, { count: b, tone: "b" }] : [{ count: a - b, tone: "a" }, { count: b, tone: "gone" }];
  const row = (label: ReactNode, bar: ReactNode) => (
    <div className="recut-row">
      <span className="recut-label">{hideLabels && recut && !originalLabels ? null : label}</span>
      <div>{bar}</div>
    </div>
  );
  return (
    <div className="recut-bars">
      {row(
        <span className="qa-text">{recut && !originalLabels ? <Frac n={a} d={L} /> : <Frac n={n1} d={d1} />}</span>,
        <PieceBars den={recut ? L : d1} segments={[{ count: recut ? a : n1, tone: "a" }]} minWholes={wholes1} cuts={recut ? cutsFor(k1, wholes1 * L) : []} barWidth={barWidth} height={40} />
      )}
      {row(
        <span className="qb-text">{recut && !originalLabels ? <Frac n={b} d={L} /> : <Frac n={n2} d={d2} />}</span>,
        <PieceBars den={recut ? L : d2} segments={[{ count: recut ? b : n2, tone: "b" }]} minWholes={wholes2} cuts={recut ? cutsFor(k2, wholes2 * L) : []} barWidth={barWidth} height={40} />
      )}
      {result &&
        row(
          <span>{op === "add" ? "together" : "left"}</span>,
          <PieceBars den={L} segments={resultSegs} barWidth={barWidth} height={40} />
        )}
      {wide && recut && <p className="muted small" style={{ margin: 0 }}>Each bar now has {L} pieces.</p>}
      {caption && (
        <p className="muted small" style={{ margin: 0 }}>
          <MathText>{caption}</MathText>
        </p>
      )}
    </div>
  );
}
