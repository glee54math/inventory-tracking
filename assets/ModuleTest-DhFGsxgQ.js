const e=`import type { Unit } from "../../../shared/units/types";\r
import type { TestQuestion } from "../../../shared/engine/types";\r
import { pastOneMixedQuestion, pictureEquationQuestion, secondWayQuestion, threePartQuestion, unitSumChoiceQuestion } from "./DecomposingFractionsTest";\r
import { addDenominatorTrapQuestion, addRegroupQuestion, borrowFlipTrapQuestion, mixedBorrowQuestion, mixedNoRegroupQuestion } from "./AddSubtractFractionsTest";\r
import { combineQuestion, leftBorrowChoiceQuestion, moreQuestion, multiStepQuestion, sameWholeWhyQuestion } from "./FractionWordProblemsTest";\r
import { copiesOfUnitQuestion, denominatorTrapQuestion, nonUnitMixedQuestion, wholeProductQuestion, wordComputeQuestion } from "./MultiplyFractionByWholeTest";\r
import { countMoreThanQuestion, differenceQuestion, longestQuestion, placeDotQuestion, totalAtTickQuestion } from "./FractionLinePlotsTest";\r
\r
// ---------- cumulative end-of-module test: Fraction Operations ----------\r
// 25 questions, 5 reused from each of the 5 units' own *Test.tsx generators\r
// (same reuse pattern as every other lab's ModuleTest.tsx). Each generator is\r
// an independent random draw, so a retake never replays the same 25.\r
\r
/** Hand-maintained (calling every generator to count would burn a random draw). */\r
export const MODULE_TEST_TOTAL = 25;\r
\r
/** 1-5 stars on the /25 score: the 18/16/14/12-of-20 bands scaled to 25 and\r
 *  rounded up — 23 / 20 / 18 / 15, identical to the other 25-question module tests. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 23) return 5;\r
  if (score >= 20) return 4;\r
  if (score >= 18) return 3;\r
  if (score >= 15) return 2;\r
  return 1;\r
};\r
\r
/** Strips the picture from a reused question whose diagram would only repeat\r
 *  the one just before it. */\r
const noVisual = (make: () => TestQuestion[]) => () => make().map((q) => ({ ...q, visual: null }));\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Decomposing Fractions\r
    () => unitSumChoiceQuestion("medium"),\r
    () => secondWayQuestion("medium"),\r
    () => pictureEquationQuestion("medium"),\r
    () => pastOneMixedQuestion("medium"),\r
    () => threePartQuestion("hard"),\r
    // Adding and Subtracting\r
    () => addDenominatorTrapQuestion("medium"),\r
    noVisual(() => addRegroupQuestion("medium")),\r
    () => mixedNoRegroupQuestion("sub", "medium"),\r
    () => mixedBorrowQuestion("hard"),\r
    () => borrowFlipTrapQuestion("hard"),\r
    // Word problems\r
    () => combineQuestion("medium", true),\r
    () => moreQuestion("medium"),\r
    () => multiStepQuestion("hard"),\r
    () => sameWholeWhyQuestion("hard"),\r
    () => leftBorrowChoiceQuestion("hard"),\r
    // Multiplying a fraction by a whole number\r
    noVisual(() => copiesOfUnitQuestion("medium")),\r
    () => denominatorTrapQuestion("medium"),\r
    () => nonUnitMixedQuestion("hard"),\r
    () => wordComputeQuestion("medium"),\r
    () => wholeProductQuestion("medium"),\r
    // Line plots (diagrams kept — the plot IS the question)\r
    () => countMoreThanQuestion("medium"),\r
    () => totalAtTickQuestion("medium"),\r
    () => longestQuestion("medium"),\r
    () => differenceQuestion("hard", 4, true),\r
    () => placeDotQuestion("hard"),\r
  ],\r
  // 20/25 = 80%, the 4-star cutoff above.\r
  passScore: 20,\r
};\r
`;export{e as default};
