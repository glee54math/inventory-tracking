import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import type { TestQuestion } from "../../../shared/engine/types";
import { pastOneMixedQuestion, pictureEquationQuestion, secondWayQuestion, threePartQuestion, unitSumChoiceQuestion } from "./DecomposingFractionsTest";
import { addDenominatorTrapQuestion, addRegroupQuestion, borrowFlipTrapQuestion, mixedBorrowQuestion, mixedNoRegroupQuestion } from "./AddSubtractFractionsTest";
import { combineQuestion, leftBorrowChoiceQuestion, moreQuestion, multiStepQuestion, sameWholeWhyQuestion } from "./FractionWordProblemsTest";
import { copiesOfUnitQuestion, denominatorTrapQuestion, nonUnitMixedQuestion, wholeProductQuestion, wordComputeQuestion } from "./MultiplyFractionByWholeTest";
import { countMoreThanQuestion, differenceQuestion, longestQuestion, placeDotQuestion, totalAtTickQuestion } from "./FractionLinePlotsTest";

// ---------- cumulative end-of-module test: Fraction Operations ----------
// 25 questions, 5 reused from each of the 5 units' own *Test.tsx generators
// (same reuse pattern as every other lab's ModuleTest.tsx). Each generator is
// an independent random draw, so a retake never replays the same 25.

/** Hand-maintained (calling every generator to count would burn a random draw). */
export const MODULE_TEST_TOTAL = 25;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

/** Strips the picture from a reused question whose diagram would only repeat
 *  the one just before it. */
const noVisual = (make: () => TestQuestion[]) => () => make().map((q) => ({ ...q, visual: null }));

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Decomposing Fractions
    () => unitSumChoiceQuestion("medium"),
    () => secondWayQuestion("medium"),
    () => pictureEquationQuestion("medium"),
    () => pastOneMixedQuestion("medium"),
    () => threePartQuestion("hard"),
    // Adding and Subtracting
    () => addDenominatorTrapQuestion("medium"),
    noVisual(() => addRegroupQuestion("medium")),
    () => mixedNoRegroupQuestion("sub", "medium"),
    () => mixedBorrowQuestion("hard"),
    () => borrowFlipTrapQuestion("hard"),
    // Word problems
    () => combineQuestion("medium", true),
    () => moreQuestion("medium"),
    () => multiStepQuestion("hard"),
    () => sameWholeWhyQuestion("hard"),
    () => leftBorrowChoiceQuestion("hard"),
    // Multiplying a fraction by a whole number
    noVisual(() => copiesOfUnitQuestion("medium")),
    () => denominatorTrapQuestion("medium"),
    () => nonUnitMixedQuestion("hard"),
    () => wordComputeQuestion("medium"),
    () => wholeProductQuestion("medium"),
    // Line plots (diagrams kept — the plot IS the question)
    () => countMoreThanQuestion("medium"),
    () => totalAtTickQuestion("medium"),
    () => longestQuestion("medium"),
    () => differenceQuestion("hard", 4, true),
    () => placeDotQuestion("hard"),
  ],
  // Passes at 5 stars.
  passScore: 23,
};
