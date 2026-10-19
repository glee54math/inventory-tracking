import { useState } from "react";
import { ManualDivisionLadder, DivisionLadder, computeLongDivision } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { customStep, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

// A 2-digit divisor doesn't divide as cleanly into a single digit the way a
// 1-digit divisor does — the standard technique is to round the divisor to
// the nearest ten, estimate a trial quotient digit from that, then check and
// adjust if needed. These 4 buckets isolate the 4 ways that technique can
// play out, so a mastery star certifies the student has handled all of them,
// not just whichever one random generation happened to land on most often.
const TWO_DIGIT_BUCKETS = ["round-down-clean", "round-up-clean", "adjust-lower", "adjust-higher"];

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [dividend, setDividend] = useState(2964);
  const [divisor, setDivisor] = useState(52);
  const { cycles } = computeLongDivision(dividend, divisor);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="controls">
        <Stepper label="Dividend" value={dividend} min={100} max={9999} step={1} onChange={setDividend} tone="a" />
        <Stepper label="Divisor" value={divisor} min={11} max={98} onChange={setDivisor} tone="b" />
      </div>
      {/* Keyed on the pair so changing either number resets the ladder to
          blank, instead of carrying over digits typed for the old problem. */}
      <ManualDivisionLadder key={`${dividend}-${divisor}`} dividend={dividend} divisor={divisor} cycles={cycles} showBracketStage={false} />
      <p className="muted small">
        Try editing the dividend and divisor above. Round the divisor to the nearest ten to estimate each quotient digit, then check your guess by multiplying back.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — divide
// ============================================================================

/** Draws a 2-digit divisor that isn't an exact multiple of ten — rounding a
 *  divisor that's ALREADY a multiple of ten is a no-op, not an interesting
 *  estimation case. */
const randTwoDigitDivisor = (): number => {
  let d: number;
  do {
    d = randInt(11, 98);
  } while (d % 10 === 0);
  return d;
};

function divideProblem(targetBucket?: string): Problem {
  const wantRoundDown = targetBucket === "round-down-clean";
  const wantRoundUp = targetBucket === "round-up-clean";
  const wantAdjustLower = targetBucket === "adjust-lower";
  const wantAdjustHigher = targetBucket === "adjust-higher";

  let divisor = 0;
  let quotient = 0;
  let dividend = 0;
  let cycles: ReturnType<typeof computeLongDivision>["cycles"] = [];
  let roundedDivisor = 0;
  let roundsDown = false;
  let naiveDigit = 0;
  let trueDigit = 0;
  let isClean = false;
  let tries = 0;
  do {
    divisor = randTwoDigitDivisor();
    quotient = randInt(10, 89);
    dividend = divisor * quotient;
    cycles = computeLongDivision(dividend, divisor).cycles;
    roundedDivisor = Math.round(divisor / 10) * 10;
    roundsDown = roundedDivisor < divisor;
    const firstGroup = cycles[0].current;
    // Capped at 9 — a real student estimating would never guess a 2-digit
    // "trial quotient digit," so neither does the generator.
    naiveDigit = Math.min(9, Math.floor(firstGroup / roundedDivisor));
    trueDigit = cycles[0].qDigit;
    isClean = naiveDigit === trueDigit;
    tries++;
    // Rerolling (not hand-deriving the arithmetic) until the generated pair
    // actually has the shape the target bucket asks for — same rejection-
    // sampling approach as the one-digit-division buckets. naiveDigit === 0
    // is excluded too: that's a degenerate "round up so far the estimate
    // undershoots to nothing," not a genuine instance of any of the 4
    // buckets. A generous cap guards against a malformed bucket string,
    // never something normal play hits (verified by simulation: worst case
    // well under 100 tries).
  } while (
    tries < 2000 &&
    (naiveDigit === 0 ||
      (wantRoundDown && !(isClean && roundsDown)) ||
      (wantRoundUp && !(isClean && !roundsDown)) ||
      (wantAdjustLower && !(!isClean && naiveDigit > trueDigit)) ||
      (wantAdjustHigher && !(!isClean && naiveDigit < trueDigit)))
  );

  const bucket = isClean ? (roundsDown ? "round-down-clean" : "round-up-clean") : naiveDigit > trueDigit ? "adjust-lower" : "adjust-higher";
  const firstGroup = cycles[0].current;
  const adjustMsg = isClean
    ? "That guess is exactly right!"
    : naiveDigit > trueDigit
      ? `But ${roundedDivisor} × ${naiveDigit} is too big to subtract from ${firstGroup} — the real digit is one lower, ${trueDigit}.`
      : `But there's room left over after ${roundedDivisor} × ${naiveDigit} — the real digit is one higher, ${trueDigit}.`;

  return {
    title: "Dividing by a two-digit number",
    bucket,
    story: `Divide ${dividend} ÷ ${divisor}.`,
    visual: (done: number) =>
      done < 2 ? (
        <p className="muted small">Round the divisor first, then work through the ladder below: quotient digit, subtract, bring down, repeat.</p>
      ) : (
        <p className="muted small">
          {dividend} ÷ {divisor} = {quotient}
        </p>
      ),
    steps: [
      {
        kind: "ratio",
        tones: "none",
        labels: ["rounded divisor", "first-digit estimate"],
        frame: ["", "→", ""],
        prompt: `Round ${divisor} to the nearest ten, then estimate: about how many times does it go into ${firstGroup}?`,
        hint: `${divisor} rounds to the nearest ten. Then divide ${firstGroup} by that rounded number — ignore any remainder.`,
        explain: `${divisor} rounds to ${roundedDivisor}, and ${firstGroup} ÷ ${roundedDivisor} ≈ ${naiveDigit}. ${adjustMsg}`,
        answer: [roundedDivisor, naiveDigit],
      },
      customStep(
        {
          prompt: `Now divide ${dividend} ÷ ${divisor} for real — your estimate is a starting guess, not the final answer.`,
          hint: "Multiply your trial digit by the actual divisor and compare to the group you're dividing into — too big means guess one lower, room left over means guess one higher.",
          explain: `${dividend} ÷ ${divisor} = ${quotient}.`,
        },
        (onDone) => <ManualDivisionLadder dividend={dividend} divisor={divisor} cycles={cycles} onComplete={onDone} showBracketStage={false} />,
        `${dividend} ÷ ${divisor} = ${quotient}`
      ),
    ],
    wrapUp: `${dividend} ÷ ${divisor} = ${quotient}.`,
  };
}

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <DivisionLadder dividend={2964} divisor={52} done={2} />;
}

export const divide: Unit = {
  id: "divide",
  title: "Dividing by a Two-Digit Number",
  goal: "Fluently divide multi-digit whole numbers by a two-digit divisor, estimating each quotient digit by rounding and adjusting as needed.",
  standard: "6.NS.2",
  keyIdea: (
    <>
      <p>A two-digit divisor doesn't divide as cleanly as a one-digit one — round it to the nearest ten first to make a quick estimate.</p>
      <p>Check your estimate by multiplying it back. Too big? Guess one lower. Room left over? Guess one higher.</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [{ label: "Divide", make: divideProblem, buckets: TWO_DIGIT_BUCKETS }],
  // See decimalOperations' / the one-digit lab's own requiredBuckets for the
  // same pattern — a mastery star now requires a clean solve covering all 4
  // of these estimation scenario-classes at least once.
  requiredBuckets: TWO_DIGIT_BUCKETS,
};
