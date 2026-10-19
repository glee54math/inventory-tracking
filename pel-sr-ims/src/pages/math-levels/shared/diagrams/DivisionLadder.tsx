import { useEffect, useState, type CSSProperties } from "react";
import { palette } from "../lib/palette";

interface Cycle {
  /** Which dividend digit position (0-indexed from the left) this cycle's result lands under. */
  atIndex: number;
  current: number;
  qDigit: number;
  product: number;
  remainder: number;
}

interface LongDivisionResult {
  digits: number[];
  cycles: Cycle[];
  quotient: number;
  remainder: number;
}

/**
 * Standard long-division algorithm, computed purely for display. The first
 * cycle may bring down more than one digit (whenever the leading digit(s) of
 * the dividend are smaller than the divisor — the normal case, not an edge
 * case: e.g. 128÷4 brings down "1" then "2" before the first quotient digit).
 * Every cycle after that brings down exactly one new digit, per the algorithm.
 */
export function computeLongDivision(dividend: number, divisor: number): LongDivisionResult {
  const digits = String(Math.trunc(dividend)).split("").map(Number);
  const cycles: Cycle[] = [];
  let current = 0;
  let idx = 0;

  while (idx < digits.length) {
    current = current * 10 + digits[idx];
    idx++;
    if (current >= divisor || idx === digits.length) break;
  }
  const firstQ = Math.floor(current / divisor);
  cycles.push({ atIndex: idx - 1, current, qDigit: firstQ, product: firstQ * divisor, remainder: current - firstQ * divisor });
  current -= firstQ * divisor;

  while (idx < digits.length) {
    current = current * 10 + digits[idx];
    const q = Math.floor(current / divisor);
    cycles.push({ atIndex: idx, current, qDigit: q, product: q * divisor, remainder: current - q * divisor });
    current -= q * divisor;
    idx++;
  }

  const quotient = Number(cycles.map((c) => c.qDigit).join(""));
  return { digits, cycles, quotient, remainder: current };
}

export interface DivisionLadderProps {
  dividend: number;
  divisor: number;
  /** How many cycles are revealed (0 = just the bracket + dividend/divisor). */
  done: number;
}

const cellStyle: CSSProperties = {
  display: "inline-block",
  width: "1.6em",
  textAlign: "center",
};

/** Bracket long-division layout, filling in one cycle (digit, product, remainder) at a time as `done` increases. */
export function DivisionLadder({ dividend, divisor, done }: DivisionLadderProps) {
  const { digits, cycles } = computeLongDivision(dividend, divisor);
  const shown = Math.min(done, cycles.length);

  return (
    <div
      role="img"
      aria-label={`Long division of ${dividend} by ${divisor}`}
      style={{ fontFamily: "'Courier New', monospace", fontSize: 20, color: palette.ink, display: "inline-block" }}
    >
      {/* quotient row */}
      <div style={{ marginLeft: "2.6em" }}>
        {digits.map((_, i) => {
          const cyc = cycles.find((c) => c.atIndex === i);
          const cycIdx = cyc ? cycles.indexOf(cyc) : -1;
          const visible = cyc && cycIdx < shown;
          return (
            <span key={i} style={{ ...cellStyle, color: palette.a, fontWeight: 700 }}>
              {visible ? cyc!.qDigit : " "}
            </span>
          );
        })}
      </div>
      {/* bracket + dividend */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <span style={{ marginRight: "0.3em" }}>{divisor}</span>
        <div style={{ borderTop: `3px solid ${palette.ink}`, borderLeft: `3px solid ${palette.ink}`, paddingLeft: "0.15em", paddingTop: "0.05em" }}>
          {digits.map((d, i) => (
            <span key={i} style={cellStyle}>
              {d}
            </span>
          ))}
        </div>
      </div>
      {/* cycles */}
      {cycles.slice(0, shown).map((c, i) => {
        const indent = c.atIndex - String(c.current).length + 1 + 1; // +1 for the divisor-width offset
        return (
          <div key={i}>
            <div style={{ marginLeft: `${Math.max(indent, 1)}.6em`, color: palette.muted }}>
              − {c.product}
            </div>
            <div style={{ marginLeft: `${Math.max(indent, 1)}.6em`, borderTop: `1px solid ${palette.line}`, width: `${String(c.current).length * 1.6}em` }} />
            <div style={{ marginLeft: `${Math.max(indent, 1)}.6em`, fontWeight: i === shown - 1 ? 700 : 400, color: i === shown - 1 ? palette.c : palette.ink }}>
              {c.remainder}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const LADDER_CELL_EM = 2.2;
// verticalAlign:"top" is load-bearing, not cosmetic: inline-block spans
// default to baseline alignment, and an EMPTY inline-block (a not-yet-
// reached column, no text inside) computes its baseline differently than one
// with a digit in it — mixing the two in the same row visibly shifts them
// relative to each other. Pinning every cell to its box's top edge removes
// that font-baseline ambiguity entirely, for every row in this ladder.
const ladderCellStyle: CSSProperties = { display: "inline-block", width: `${LADDER_CELL_EM}em`, textAlign: "center", verticalAlign: "top" };
// Border + padding of the bracket's inner box, in em — kept in em (not px) so
// it scales with the same font-size everything else here uses, making this
// an exact offset rather than a value that only happens to line up at 20px.
const BRACKET_INSET_EM = 0.3;

/** One fill-in digit, as a (row, column) position in the ladder's shared
 *  grid — column is the dividend digit index this box lines up under. */
interface DigitSlot {
  col: number;
  expected: number;
}

/** The fill-in boxes for one cycle: the quotient digit (above the bracket),
 *  the subtraction product (one box per digit, under the group just
 *  divided), and the result row (the remainder's digits, immediately
 *  followed — same row — by the next digit brought down from the dividend,
 *  if there is one). Three separate stages a student clears in order; a
 *  stage's boxes all appear together and can be filled in any order, the
 *  next stage unlocking once every box in this one is correct. */
interface CycleSlots {
  quotient: DigitSlot;
  product: DigitSlot[];
  result: DigitSlot[];
}

function buildCycleSlots(dividendDigits: number[], cycles: ReturnType<typeof computeLongDivision>["cycles"]): CycleSlots[] {
  return cycles.map((c, i) => {
    const productDigits = String(c.product).split("").map(Number);
    const productStart = c.atIndex - productDigits.length + 1;
    const product = productDigits.map((d, k) => ({ col: productStart + k, expected: d }));

    const remainderDigits = String(c.remainder).split("").map(Number);
    const remainderStart = c.atIndex - remainderDigits.length + 1;
    const result: DigitSlot[] = remainderDigits.map((d, k) => ({ col: remainderStart + k, expected: d }));
    if (i < cycles.length - 1) {
      const bringDownCol = c.atIndex + 1;
      result.push({ col: bringDownCol, expected: dividendDigits[bringDownCol] });
    }

    return { quotient: { col: c.atIndex, expected: c.qDigit }, product, result };
  });
}

/**
 * The fully manual counterpart to DivisionLadder — every digit a student
 * would write by hand (the quotient digit, the subtraction product, the
 * remainder, and each digit brought down from the dividend) is its own fill-
 * in box, planted in its real column of a single shared grid so the bracket,
 * quotient row, and every cycle's rows are guaranteed to line up — not
 * approximated with hand-tuned offsets per row. A stage's boxes (e.g. both
 * digits of a 2-digit product) appear together and can be filled in any
 * order; the stage confirms once every box in it is right, which reveals the
 * next stage — quotient digit → product → remainder (+ bring-down) → next
 * cycle's quotient digit — same order as solving it on paper. Always starts
 * blank: this step's whole point is the student doing the work by hand, so
 * unlike a gated concept-check step, it never opens pre-solved.
 */
export function ManualDivisionLadder({
  dividend,
  divisor,
  cycles,
  onComplete,
  showBracketStage = true,
}: {
  dividend: number;
  divisor: number;
  cycles: ReturnType<typeof computeLongDivision>["cycles"];
  onComplete?: () => void;
  /**
   * Whether converting to the equivalent whole-number division is itself a
   * fill-in stage — true for decimal division, where "15.6 ÷ 1.2 → 156 ÷ 12"
   * is a real part of the skill the ladder shouldn't just hand the student.
   * Set false for whole-number division (dividend/divisor already are whole
   * numbers, nothing to convert): the bracket then just displays them as
   * given text and the cycles start immediately as stage 0. Defaults to true
   * to match every existing caller.
   */
  showBracketStage?: boolean;
}) {
  const dividendDigits = String(dividend).split("").map(Number);
  const divisorDigits = String(divisor).split("").map(Number);
  const cycleSlots = buildCycleSlots(dividendDigits, cycles);
  // Stage 0 (when showBracketStage): write the equivalent whole-number
  // division itself. Its slots are the divisor's digits followed by the
  // dividend's — one combined stage, same as a cycle's product/result rows,
  // so every digit in it appears together and can be filled in in any order.
  const bracketStage = { kind: "bracket" as const, slots: [...divisorDigits.map((d) => ({ col: -1, expected: d })), ...dividendDigits.map((d) => ({ col: -1, expected: d }))] };
  const stages = [
    ...(showBracketStage ? [bracketStage] : []),
    ...cycleSlots.flatMap((cs) => [
      { kind: "quotient" as const, slots: [cs.quotient] },
      { kind: "product" as const, slots: cs.product },
      { kind: "result" as const, slots: cs.result },
    ]),
  ];
  const STAGE_OFFSET = showBracketStage ? 1 : 0; // every cycle stage index shifts by 1 to make room for the bracket stage, when present

  const [values, setValues] = useState<string[][]>(() => stages.map((st) => st.slots.map(() => "")));
  const [confirmed, setConfirmed] = useState<boolean[][]>(() => stages.map((st) => st.slots.map(() => false)));

  const stageDone = (i: number) => confirmed[i].every(Boolean);
  const stageReached = (i: number) => i === 0 || stageDone(i - 1);
  const allDone = stageDone(stages.length - 1);

  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  const onSlotChange = (stageIdx: number, slotIdx: number, raw: string) => {
    const v = raw.replace(/[^0-9]/g, "").slice(-1);
    setValues((prev) => prev.map((row, si) => (si === stageIdx ? row.map((x, k) => (k === slotIdx ? v : x)) : row)));
    if (v !== "" && Number(v) === stages[stageIdx].slots[slotIdx].expected) {
      setConfirmed((prev) => prev.map((row, si) => (si === stageIdx ? row.map((x, k) => (k === slotIdx ? true : x)) : row)));
    }
  };

  const colOffset = (col: number) => `${divisorDigits.length * LADDER_CELL_EM + BRACKET_INSET_EM + col * LADDER_CELL_EM}em`;
  const badStyle = (value: string, expected: number): CSSProperties | undefined => (value !== "" && Number(value) !== expected ? { borderColor: "var(--bad)" } : undefined);

  const renderSlot = (stageIdx: number, slotIdx: number, label: string) => {
    if (confirmed[stageIdx][slotIdx]) return stages[stageIdx].slots[slotIdx].expected;
    return (
      <input
        className="division-digit-input"
        inputMode="numeric"
        maxLength={1}
        autoComplete="off"
        aria-label={label}
        value={values[stageIdx][slotIdx]}
        onChange={(e) => onSlotChange(stageIdx, slotIdx, e.target.value)}
        style={badStyle(values[stageIdx][slotIdx], stages[stageIdx].slots[slotIdx].expected)}
      />
    );
  };

  return (
    <div role="group" aria-label={`Long division of ${dividend} by ${divisor}`} style={{ fontFamily: "'Courier New', monospace", fontSize: 24, color: "var(--ink)", display: "inline-block" }}>
      {/* quotient row — stays blank until the bracket stage (when present) is done */}
      <div style={{ marginLeft: colOffset(0) }}>
        {dividendDigits.map((_, col) => {
          const cycIdx = cycleSlots.findIndex((cs) => cs.quotient.col === col);
          if (cycIdx === -1) return <span key={col} style={ladderCellStyle} />;
          const stageIdx = STAGE_OFFSET + cycIdx * 3; // quotient is always the first of each cycle's 3 stages
          if (!stageReached(stageIdx)) return <span key={col} style={ladderCellStyle} />;
          return (
            <span key={col} style={{ ...ladderCellStyle, ...(confirmed[stageIdx][0] ? { color: "var(--qa, #3157D5)", fontWeight: 700 } : {}) }}>
              {renderSlot(stageIdx, 0, `quotient digit, cycle ${cycIdx + 1}`)}
            </span>
          );
        })}
      </div>
      {/* bracket + dividend — when showBracketStage, the equivalent whole-
          number division itself is stage 0, one fill-in box per digit of
          both the divisor and the dividend, not given text; otherwise these
          are already whole numbers, so just display them directly. */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {divisorDigits.map((d, i) => (
          <span key={i} style={ladderCellStyle}>
            {showBracketStage ? renderSlot(0, i, `divisor digit ${i + 1} of ${divisorDigits.length}`) : d}
          </span>
        ))}
        <div style={{ borderTop: "0.15em solid var(--ink)", borderLeft: "0.15em solid var(--ink)", paddingLeft: "0.15em", paddingTop: "0.05em" }}>
          {dividendDigits.map((d, i) => (
            <span key={i} style={ladderCellStyle}>
              {showBracketStage ? renderSlot(0, divisorDigits.length + i, `dividend digit ${i + 1} of ${dividendDigits.length}`) : d}
            </span>
          ))}
        </div>
      </div>
      {/* cycles: product row (with the bring-down arrow as its trailing
          cell), then the result row (remainder + bring-down) */}
      {cycleSlots.map((cs, cycIdx) => {
        const qStage = STAGE_OFFSET + cycIdx * 3;
        const prodStage = qStage + 1;
        const resultStage = qStage + 2;
        if (!stageReached(prodStage)) return null;
        const prodWidth = `${cs.product.length * LADDER_CELL_EM}em`;
        const hasBringDown = cycIdx < cycleSlots.length - 1;
        const bringDownSlot = hasBringDown ? cs.result[cs.result.length - 1] : null;
        return (
          <div key={cycIdx}>
            {/* The "−" sign sits absolutely positioned just left of the row,
                outside the row's own flow — it must NOT consume horizontal
                space before the first box, or every box in the row shifts
                right of the column it's supposed to land in. The bring-down
                arrow is a trailing cell of this SAME row (not a separate row
                below it) — it lands in the right column for free since it's
                just one more ladderCellStyle cell after the product's own. */}
            <div style={{ marginLeft: colOffset(cs.product[0].col), position: "relative", color: "var(--muted)" }}>
              <span style={{ position: "absolute", right: "100%", marginRight: "0.25em" }} aria-hidden="true">
                −
              </span>
              {cs.product.map((slot, slotIdx) => (
                <span key={slotIdx} style={ladderCellStyle}>
                  {renderSlot(prodStage, slotIdx, `subtraction digit ${slotIdx + 1} of ${cs.product.length}, cycle ${cycIdx + 1}`)}
                </span>
              ))}
              {stageDone(prodStage) && bringDownSlot && (
                <span style={{ ...ladderCellStyle, color: "var(--qb, #E39A1E)", fontWeight: 700 }} aria-hidden="true">
                  ↓
                </span>
              )}
            </div>
            <div style={{ marginLeft: colOffset(cs.product[0].col), borderTop: "1px solid var(--line)", width: prodWidth }} />
            {stageReached(resultStage) && (
              <div style={{ marginLeft: colOffset(cs.result[0].col), fontWeight: stageDone(resultStage) ? 700 : 400, color: stageDone(resultStage) ? "var(--qc, #8A4FD8)" : "var(--ink)" }}>
                {cs.result.map((slot, slotIdx) => {
                  const isBringDown = hasBringDown && slotIdx === cs.result.length - 1;
                  const label = isBringDown ? `bring down the next digit, cycle ${cycIdx + 1}` : `remainder digit ${slotIdx + 1}, cycle ${cycIdx + 1}`;
                  return (
                    <span key={slotIdx} style={ladderCellStyle}>
                      {renderSlot(resultStage, slotIdx, label)}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
