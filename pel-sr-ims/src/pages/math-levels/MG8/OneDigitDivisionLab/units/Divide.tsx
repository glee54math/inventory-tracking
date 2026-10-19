import { useState } from "react";
import { ManualDivisionLadder, DivisionLadder, computeLongDivision } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { customStep, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

// Every bucket isolates exactly one idea at a time — a generated instance
// never mixes two of these together, so each one is a clean illustration of
// the thing it's meant to teach, not an incidental side effect of whatever
// numbers got rolled.
const ONE_DIGIT_BUCKETS = ["clean", "remainder", "wide-start", "zero-gap"];

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [dividend, setDividend] = useState(144);
  const [divisor, setDivisor] = useState(6);
  const { cycles } = computeLongDivision(dividend, divisor);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="controls">
        <Stepper label="Dividend" value={dividend} min={10} max={999} step={1} onChange={setDividend} tone="a" />
        <Stepper label="Divisor" value={divisor} min={2} max={9} onChange={setDivisor} tone="b" />
      </div>
      {/* Keyed on the pair so changing either number resets the ladder to
          blank, instead of carrying over digits typed for the old problem. */}
      <ManualDivisionLadder key={`${dividend}-${divisor}`} dividend={dividend} divisor={divisor} cycles={cycles} showBracketStage={false} />
      <p className="muted small">Try editing the dividend and divisor above, then work through the division yourself, one digit at a time.</p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — divide
// ============================================================================

function divideProblem(targetBucket?: string): Problem {
  const wantsZeroGap = targetBucket === "zero-gap";
  const wantsRemainder = targetBucket === "remainder";
  const wantsWideStart = targetBucket === "wide-start";
  // zero-gap gets a 3-digit quotient so the gap is a genuine MIDDLE zero
  // (e.g. 408 ÷ 4 = 102 — the classic "write a 0, don't skip a place" case),
  // not just a quotient that happens to end in 0 — a 2-digit quotient could
  // only ever show a trailing zero, a much easier pattern students already
  // handle as "it's a multiple of 10."
  const [qMin, qMax] = wantsZeroGap ? [100, 899] : [10, 89];

  let divisor = 0;
  let quotient = 0;
  let remainder = 0;
  let dividend = 0;
  let cycles: ReturnType<typeof computeLongDivision>["cycles"] = [];
  let tries = 0;
  do {
    divisor = randInt(2, 9);
    quotient = randInt(qMin, qMax);
    remainder = wantsRemainder ? randInt(1, divisor - 1) : 0;
    dividend = divisor * quotient + remainder;
    cycles = computeLongDivision(dividend, divisor).cycles;
    tries++;
    // Rerolling (not hand-deriving the arithmetic) until the generated pair
    // actually has the shape the target bucket asks for — same rejection-
    // sampling approach as the decimal-division buckets. A generous cap
    // guards against a malformed bucket string, never something normal
    // play hits (verified by simulation: worst case well under 300 tries).
  } while (
    tries < 2000 &&
    (cycles.slice(1).some((c) => c.qDigit === 0) !== wantsZeroGap || cycles[0].atIndex > 0 !== wantsWideStart)
  );

  const hasZeroGap = cycles.slice(1).some((c) => c.qDigit === 0);
  const wideStart = cycles[0].atIndex > 0;
  const bucket = wantsRemainder ? "remainder" : hasZeroGap ? "zero-gap" : wideStart ? "wide-start" : "clean";
  const answer = `${quotient}${remainder > 0 ? ` R${remainder}` : ""}`;

  return {
    title: "Dividing by a one-digit number",
    bucket,
    story: `Divide ${dividend} ÷ ${divisor}.`,
    visual: (done: number) =>
      done < 1 ? (
        <p className="muted small">Work through the ladder below, one box at a time: quotient digit, subtract, bring down, repeat.</p>
      ) : (
        <p className="muted small">
          {dividend} ÷ {divisor} = {answer}
        </p>
      ),
    steps: [
      customStep(
        {
          prompt: `Divide ${dividend} ÷ ${divisor}.`,
          hint: "How many times does the divisor go into the current group? Multiply, subtract, then bring down the next digit and repeat.",
          explain: `${dividend} ÷ ${divisor} = ${answer}.`,
        },
        (onDone) => <ManualDivisionLadder dividend={dividend} divisor={divisor} cycles={cycles} onComplete={onDone} showBracketStage={false} />,
        `${dividend} ÷ ${divisor} = ${answer}`
      ),
    ],
    wrapUp: `${dividend} ÷ ${divisor} = ${answer}.`,
  };
}

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <DivisionLadder dividend={144} divisor={6} done={2} />;
}

export const divide: Unit = {
  id: "divide",
  title: "Dividing by a One-Digit Number",
  goal: "Fluently divide multi-digit whole numbers by a one-digit divisor using the standard long-division algorithm.",
  standard: "4.NBT.6",
  keyIdea: (
    <>
      <p>Long division works one digit at a time: bring down a digit, find how many times the divisor fits, multiply, subtract, and repeat.</p>
      <p>If the divisor doesn't go into a digit at all, write a 0 in the quotient there and keep going — don't skip that place.</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [{ label: "Divide", make: divideProblem, buckets: ONE_DIGIT_BUCKETS }],
  // See decimalOperations' own requiredBuckets for the same pattern — a
  // mastery star now requires a clean solve covering all 4 of these scenario-
  // classes at least once, not just MASTERY_GOAL clean solves from wherever
  // random generation happened to land.
  requiredBuckets: ONE_DIGIT_BUCKETS,
};
