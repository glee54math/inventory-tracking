const e=`import type { Unit } from "../../../shared/units/types";\r
import { fiveMarkReadQuestion, offMarkReadQuestion, nearHourReadQuestion, matchHandsQuestion } from "./TellingTimeToTheMinuteTest";\r
import { endTimeNoRolloverQuestion, endTimeCrossHourQuestion, elapsedCrossHourQuestion, elapsedNoRolloverQuestion, startUnknownQuestion } from "./ElapsedTimeAndIntervalsTest";\r
import { readContainerQuestion, readScaleQuestion, chooseUnitQuestion, compareMeasurementsQuestion } from "./MeasuringVolumeAndMassTest";\r
import { addSubtractQuestion, multiplyQuestion, divideQuestion, pickOperationQuestion, mismatchedUnitsQuestion } from "./WordProblemsWithMassAndVolumeTest";\r
import { readGridlineQuestion, readBetweenQuestion, compareOneStepQuestion, compareTwoStepQuestion, readPictureHalfQuestion } from "./ScaledGraphsTest";\r
import { measureQuestion, placeQuarterQuestion, frequencyQuestion, comparisonQuestion, quarterFrequencyQuestion } from "./LinePlotsWithFractionalDataTest";\r
\r
// ---------- cumulative end-of-module test: Time, Measurement & Data ----------\r
// 30 questions, 5 drawn from each of the 6 units' own *Test.tsx generators\r
// (same reuse pattern as MG3's / MM1's ModuleTest.tsx). Each generator is an\r
// independent random draw, so a retake never replays the same 30. Diagrams\r
// stay visible — a clock, a scale, a graph, or a line plot IS the question\r
// at this grade, not scaffolding.\r
\r
// Hand-maintained (calling every generator to count would burn a random\r
// draw from each). Keep in sync with \`questions\` below.\r
export const MODULE_TEST_TOTAL = 30;\r
\r
/** 1-5 star rating on the raw /30 score — the same 90/80/70/60% bands as\r
 *  every 20-question module test's 18/16/14/12, scaled to 30. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 27) return 5;\r
  if (score >= 24) return 4;\r
  if (score >= 21) return 3;\r
  if (score >= 18) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Telling and Writing Time to the Minute\r
    () => fiveMarkReadQuestion("medium"),\r
    () => offMarkReadQuestion("medium"),\r
    () => offMarkReadQuestion("hard"),\r
    () => nearHourReadQuestion("hard"),\r
    () => matchHandsQuestion("hard"),\r
    // Elapsed Time and Time-Interval Word Problems\r
    () => endTimeNoRolloverQuestion("medium"),\r
    () => endTimeCrossHourQuestion("hard"),\r
    () => elapsedNoRolloverQuestion("medium"),\r
    () => elapsedCrossHourQuestion("hard"),\r
    () => startUnknownQuestion("hard"),\r
    // Measuring and Estimating Liquid Volume and Mass\r
    () => readContainerQuestion("medium"),\r
    () => readScaleQuestion("medium"),\r
    () => readScaleQuestion("hard"),\r
    () => chooseUnitQuestion("medium"),\r
    () => compareMeasurementsQuestion("hard"),\r
    // One-Step Word Problems with Masses and Volumes\r
    () => addSubtractQuestion(false, "medium"),\r
    () => multiplyQuestion(false),\r
    () => divideQuestion(true),\r
    () => pickOperationQuestion(),\r
    () => mismatchedUnitsQuestion(),\r
    // Scaled Picture Graphs and Bar Graphs\r
    () => readGridlineQuestion("medium"),\r
    () => readBetweenQuestion("hard"),\r
    () => compareOneStepQuestion("medium"),\r
    () => compareTwoStepQuestion("hard"),\r
    () => readPictureHalfQuestion("hard"),\r
    // Line Plots with Fractional Measurement Data\r
    () => measureQuestion("medium"),\r
    () => placeQuarterQuestion("hard"),\r
    () => frequencyQuestion("medium"),\r
    () => comparisonQuestion("hard"),\r
    () => quarterFrequencyQuestion("hard"),\r
  ],\r
  // 24/30 = 80%, the 4-star cutoff above.\r
  passScore: 24,\r
};\r
`;export{e as default};
