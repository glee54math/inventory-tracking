import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import type { TestQuestion } from "../../../shared/engine/types";
import { fitsSumQuestion, pickPictureQuestion, sizeEstimateQuestion, whoIsRightQuestion, whyWrongQuestion } from "./WhyNotAcrossTest";
import { compareQuestion, lcdQuestion, notLeastQuestion, rewriteBothQuestion, smallerThanProductQuestion } from "./CommonDenominatorsTest";
import { computeQuestion, improperChoiceQuestion, simplestChoiceQuestion, subtractAcrossQuestion } from "./AddSubtractUnlikeTest";
import { borrowMistakeQuestion, borrowRewriteQuestion, mixedComputeQuestion } from "./MixedNumbersTest";
import { biggerThanPartsQuestion, estimateQuestion, mixedStoryQuestion, sensibleQuestion, storyQuestion } from "./WordProblemsTest";

// ---------- cumulative end-of-module test: Adding & Subtracting Fractions ----------
// 25 questions, 5 reused from each unit's own *Test.tsx generators (same
// reuse pattern as every other lab's ModuleTest.tsx), called with different
// parameters than the unit tests where that adds variety. Each generator is
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
    // Why you can't just add across (round 5: the redesigned unit's three
    // skills: estimate, judge the add-across answer, find the real sum;
    // whyWrongQuestion is the round-6 sentence frame, the same as Practice step 2)
    () => sizeEstimateQuestion("medium"),
    () => whyWrongQuestion("medium"),
    () => fitsSumQuestion("medium", "any"),
    () => pickPictureQuestion("medium"),
    () => whoIsRightQuestion("hard"),
    // Finding a common denominator
    () => lcdQuestion("hard", "shared"),
    () => notLeastQuestion("medium"),
    () => smallerThanProductQuestion("hard"),
    () => rewriteBothQuestion("medium", true),
    () => compareQuestion("hard"),
    // Adding and subtracting
    () => computeQuestion("medium", "addSimplify"),
    () => computeQuestion("hard", "subWhole"),
    () => simplestChoiceQuestion("medium"),
    () => improperChoiceQuestion("medium"),
    () => subtractAcrossQuestion("hard"),
    // Mixed numbers
    () => mixedComputeQuestion("medium", "addCarry"),
    () => mixedComputeQuestion("hard", "subBorrow"),
    () => mixedComputeQuestion("hard", "subFromWhole"),
    noVisual(() => borrowRewriteQuestion("medium")),
    () => borrowMistakeQuestion("hard"),
    // Word problems
    () => estimateQuestion("medium"),
    () => sensibleQuestion("medium"),
    () => storyQuestion("hard", "moreNeeded"),
    () => mixedStoryQuestion("hard", "sub"),
    () => biggerThanPartsQuestion("hard"),
  ],
  // Passes at 5 stars.
  passScore: 23,
};
