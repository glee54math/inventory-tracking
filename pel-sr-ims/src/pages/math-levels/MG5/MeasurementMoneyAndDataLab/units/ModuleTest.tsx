import type { Unit } from "../../../shared/units/types";
import { zeroAlignedQuestion, brokenRulerQuestion, estimateQuestion, chooseToolQuestion } from "./MeasuringEstimatingLengthTest";
import { sameObjectQuestion, differenceQuestion, crossUnitTrapQuestion, whySmallerUnitQuestion } from "./ComparingUnitsLengthDifferencesTest";
import { addToQuestion, takeFromQuestion, compareDifferenceQuestion, startUnknownQuestion, numberLineReadQuestion } from "./LengthWordProblemsNumberLineTest";
import { exactFiveMinQuestion, hourHandBetweenQuestion, amPmQuestion, timeFactQuestion, elapsedTimeQuestion } from "./TellingTime5MinTest";
import { countCoinsQuestion, billsAndCoinsQuestion, makeChangeQuestion, compareAmountsQuestion } from "./MoneyWordProblemsTest";
import { generatePlotQuestion, readPictureGraphQuestion, readBarGraphQuestion, putTogetherQuestion, compareBarQuestion } from "./LinePlotsAndGraphsTest";

// ---------- cumulative end-of-module test: Measurement, Money & Data ----------
// 30 questions, 5 drawn from each of the 6 units' own *Test.tsx question
// banks — same reuse pattern as MG3's own ModuleTest.tsx and MM1 Ratio
// Lab's. Every generator is still its own independent random draw, so
// retaking the module test doesn't replay the exact same 30 questions.
//
// Diagrams stay visible here (a ruler, a clock face, coins, a line plot/
// graph are intrinsic to what each question tests at this grade, not
// scaffolding on top of a word problem) — same call MG3's own module test
// made for the same reason.

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own ModuleTest.tsx). Keep in sync with `questions`.
export const MODULE_TEST_TOTAL = 30;

/**
 * A 1-5 star rating banded on the raw /30 score — lines up with A-F cutoffs
 * by percentage (<60/60s/70s/80s/90+), scaled from the 20-question bands
 * every other lab's module test already uses (18/16/14/12 of 20 -> 27/24/21/18
 * of 30, i.e. the same 90/80/70/60 percent cutoffs).
 */
export const moduleTestStars = (score: number): number => {
  if (score >= 27) return 5;
  if (score >= 24) return 4;
  if (score >= 21) return 3;
  if (score >= 18) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Measuring and Estimating Length
    () => zeroAlignedQuestion("easy"),
    () => brokenRulerQuestion("hard"),
    () => estimateQuestion("customary"),
    () => estimateQuestion("metric"),
    () => chooseToolQuestion(),
    // Comparing Measurement Units and Length Differences
    () => sameObjectQuestion(),
    () => whySmallerUnitQuestion(),
    () => differenceQuestion("medium"),
    () => crossUnitTrapQuestion(),
    () => differenceQuestion("hard"),
    // Length Word Problems and the Number Line
    () => addToQuestion("medium"),
    () => takeFromQuestion("medium"),
    () => compareDifferenceQuestion(),
    () => startUnknownQuestion(),
    () => numberLineReadQuestion(),
    // Telling Time to 5 Minutes
    () => exactFiveMinQuestion("medium"),
    () => hourHandBetweenQuestion(),
    () => amPmQuestion(),
    () => timeFactQuestion("hour"),
    () => elapsedTimeQuestion(),
    // Money Word Problems (compareAmountsQuestion contributes 2 questions on
    // its own — a "who has more" choice plus a "how much more" number step
    // sharing one scenario — so only 4 calls are listed here to keep this
    // section's flattened total at 5, matching every other unit's share).
    () => countCoinsQuestion("medium"),
    () => billsAndCoinsQuestion(),
    () => makeChangeQuestion(),
    () => compareAmountsQuestion(),
    // Line Plots and Picture/Bar Graphs
    () => generatePlotQuestion(),
    () => readPictureGraphQuestion(),
    () => readBarGraphQuestion(),
    () => putTogetherQuestion(),
    () => compareBarQuestion(),
  ],
  // 24/30 = 80%, matching the 4-star cutoff in moduleTestStars above —
  // "passed" means at least 4 stars, not the full 5.
  passScore: 24,
};
