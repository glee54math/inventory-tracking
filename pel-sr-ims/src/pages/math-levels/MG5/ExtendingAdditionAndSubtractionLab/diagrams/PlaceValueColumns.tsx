import { palette } from "../../../shared/lib/palette";
import type { ColumnBreakdown } from "../logic";

/**
 * The standard stacked written-addition/subtraction layout: operands
 * right-aligned above a rule, a result row below it, with small carry/borrow
 * marks above the column they affect. Renders straight off a `ColumnBreakdown`
 * (logic.ts) — the SAME object a unit's step-checking logic computes — so the
 * picture can never disagree with what's graded. `revealCols` is how many
 * columns (counting from the ones place) have been answered so far, driven by
 * `Problem.visual(done)`'s `done` argument; a column's result digit and its
 * outgoing carry/borrow mark only appear once the step asking about it is done.
 */
export function PlaceValueColumns({ breakdown, revealCols }: { breakdown: ColumnBreakdown; revealCols: number }) {
  const { operands, operation, numCols, digitsByOperand, resultDigits, carry } = breakdown;
  const cols = Array.from({ length: numCols }, (_, i) => numCols - 1 - i); // left-to-right, most significant first

  const carryRow = (
    <div className="align-row" aria-hidden>
      {cols.map((col) => {
        const show = col > 0 && revealCols > col - 1 && carry[col - 1] > 0;
        return (
          <span key={col} className="align-slot" style={{ fontSize: 12, color: operation === "add" ? palette.good : palette.bad, height: "0.9em" }}>
            {show ? (operation === "add" ? `+${carry[col - 1]}` : "borrow") : ""}
          </span>
        );
      })}
    </div>
  );

  const operandRow = (digits: number[], idx: number) => (
    <div className="align-row" key={`op${idx}`}>
      {idx === operands.length - 1 && <span className="align-slot" style={{ color: palette.muted, fontWeight: 700 }}>{operation === "add" ? "+" : "−"}</span>}
      {idx !== operands.length - 1 && <span className="align-slot" />}
      {cols.map((col) => (
        <span key={col} className="align-slot">
          {digits[col]}
        </span>
      ))}
    </div>
  );

  const resultRow = (
    <div className="align-row">
      <span className="align-slot" />
      {cols.map((col) => (
        <span key={col} className="align-slot" style={{ fontWeight: 700 }}>
          {revealCols > col ? resultDigits[col] : "?"}
        </span>
      ))}
    </div>
  );

  return (
    <div className="align-columns" role="img" aria-label={`${operands.join(operation === "add" ? " plus " : " minus ")}, written as a stacked ${operation}`}>
      {carryRow}
      {digitsByOperand.map((d, i) => operandRow(d, i))}
      <div className="align-rule" style={{ width: `${(numCols + 1) * 1.3}em` }} />
      {resultRow}
    </div>
  );
}
