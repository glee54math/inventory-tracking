import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { fiveMarkReadQuestion, offMarkReadQuestion, nearHourReadQuestion, matchHandsQuestion } from "./TellingTimeToTheMinuteTest";
import { endTimeNoRolloverQuestion, endTimeCrossHourQuestion, elapsedCrossHourQuestion, elapsedNoRolloverQuestion, startUnknownQuestion } from "./ElapsedTimeAndIntervalsTest";
import { readContainerQuestion, readScaleQuestion, chooseUnitQuestion, compareMeasurementsQuestion } from "./MeasuringVolumeAndMassTest";
import { addSubtractQuestion, multiplyQuestion, divideQuestion, pickOperationQuestion, mismatchedUnitsQuestion } from "./WordProblemsWithMassAndVolumeTest";
import { readGridlineQuestion, readBetweenQuestion, compareOneStepQuestion, compareTwoStepQuestion, readPictureHalfQuestion } from "./ScaledGraphsTest";
import { measureQuestion, placeQuarterQuestion, frequencyQuestion, comparisonQuestion, quarterFrequencyQuestion } from "./LinePlotsWithFractionalDataTest";

// ---------- cumulative end-of-module test: Time, Measurement & Data ----------
// 30 questions, 5 drawn from each of the 6 units' own *Test.tsx generators
// (same reuse pattern as MG3's / MM1's ModuleTest.tsx). Each generator is an
// independent random draw, so a retake never replays the same 30. Diagrams
// stay visible — a clock, a scale, a graph, or a line plot IS the question
// at this grade, not scaffolding.

// Hand-maintained (calling every generator to count would burn a random
// draw from each). Keep in sync with `questions` below.
export const MODULE_TEST_TOTAL = 30;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Telling and Writing Time to the Minute
    () => fiveMarkReadQuestion("medium"),
    () => offMarkReadQuestion("medium"),
    () => offMarkReadQuestion("hard"),
    () => nearHourReadQuestion("hard"),
    () => matchHandsQuestion("hard"),
    // Elapsed Time and Time-Interval Word Problems
    () => endTimeNoRolloverQuestion("medium"),
    () => endTimeCrossHourQuestion("hard"),
    () => elapsedNoRolloverQuestion("medium"),
    () => elapsedCrossHourQuestion("hard"),
    () => startUnknownQuestion("hard"),
    // Measuring and Estimating Liquid Volume and Mass
    () => readContainerQuestion("medium"),
    () => readScaleQuestion("medium"),
    () => readScaleQuestion("hard"),
    () => chooseUnitQuestion("medium"),
    () => compareMeasurementsQuestion("hard"),
    // One-Step Word Problems with Masses and Volumes
    () => addSubtractQuestion(false, "medium"),
    () => multiplyQuestion(false),
    () => divideQuestion(true),
    () => pickOperationQuestion(),
    () => mismatchedUnitsQuestion(),
    // Scaled Picture Graphs and Bar Graphs
    () => readGridlineQuestion("medium"),
    () => readBetweenQuestion("hard"),
    () => compareOneStepQuestion("medium"),
    () => compareTwoStepQuestion("hard"),
    () => readPictureHalfQuestion("hard"),
    // Line Plots with Fractional Measurement Data
    () => measureQuestion("medium"),
    () => placeQuarterQuestion("hard"),
    () => frequencyQuestion("medium"),
    () => comparisonQuestion("hard"),
    () => quarterFrequencyQuestion("hard"),
  ],
  // Passes at 5 stars.
  passScore: 28,
};
