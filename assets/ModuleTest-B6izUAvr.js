const e=`import type { Unit } from "../../../shared/units/types";\r
import type { TestQuestion } from "../../../shared/engine/types";\r
import { fitsSumQuestion, pickPictureQuestion, sizeEstimateQuestion, whoIsRightQuestion, whyWrongQuestion } from "./WhyNotAcrossTest";\r
import { compareQuestion, lcdQuestion, notLeastQuestion, rewriteBothQuestion, smallerThanProductQuestion } from "./CommonDenominatorsTest";\r
import { computeQuestion, improperChoiceQuestion, simplestChoiceQuestion, subtractAcrossQuestion } from "./AddSubtractUnlikeTest";\r
import { borrowMistakeQuestion, borrowRewriteQuestion, mixedComputeQuestion } from "./MixedNumbersTest";\r
import { biggerThanPartsQuestion, estimateQuestion, mixedStoryQuestion, sensibleQuestion, storyQuestion } from "./WordProblemsTest";\r
\r
// ---------- cumulative end-of-module test: Adding & Subtracting Fractions ----------\r
// 25 questions, 5 reused from each unit's own *Test.tsx generators (same\r
// reuse pattern as every other lab's ModuleTest.tsx), called with different\r
// parameters than the unit tests where that adds variety. Each generator is\r
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
    // Why you can't just add across (round 5: the redesigned unit's three\r
    // skills: estimate, judge the add-across answer, find the real sum;\r
    // whyWrongQuestion is the round-6 sentence frame, the same as Practice step 2)\r
    () => sizeEstimateQuestion("medium"),\r
    () => whyWrongQuestion("medium"),\r
    () => fitsSumQuestion("medium", "any"),\r
    () => pickPictureQuestion("medium"),\r
    () => whoIsRightQuestion("hard"),\r
    // Finding a common denominator\r
    () => lcdQuestion("hard", "shared"),\r
    () => notLeastQuestion("medium"),\r
    () => smallerThanProductQuestion("hard"),\r
    () => rewriteBothQuestion("medium", true),\r
    () => compareQuestion("hard"),\r
    // Adding and subtracting\r
    () => computeQuestion("medium", "addSimplify"),\r
    () => computeQuestion("hard", "subWhole"),\r
    () => simplestChoiceQuestion("medium"),\r
    () => improperChoiceQuestion("medium"),\r
    () => subtractAcrossQuestion("hard"),\r
    // Mixed numbers\r
    () => mixedComputeQuestion("medium", "addCarry"),\r
    () => mixedComputeQuestion("hard", "subBorrow"),\r
    () => mixedComputeQuestion("hard", "subFromWhole"),\r
    noVisual(() => borrowRewriteQuestion("medium")),\r
    () => borrowMistakeQuestion("hard"),\r
    // Word problems\r
    () => estimateQuestion("medium"),\r
    () => sensibleQuestion("medium"),\r
    () => storyQuestion("hard", "moreNeeded"),\r
    () => mixedStoryQuestion("hard", "sub"),\r
    () => biggerThanPartsQuestion("hard"),\r
  ],\r
  // 20/25 = 80%, the 4-star cutoff above.\r
  passScore: 20,\r
};\r
`;export{e as default};
