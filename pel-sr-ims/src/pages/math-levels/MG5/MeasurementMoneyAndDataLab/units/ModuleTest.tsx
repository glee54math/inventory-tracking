import { moduleStars } from "../../../shared/engine/moduleStars";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 28,
};
