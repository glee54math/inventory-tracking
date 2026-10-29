import type { Unit } from "../../../shared/units/types";
import { lengthQuestion, weightQuestion, twoAttributesQuestion, vocabLengthQuestion, sizeVsWeightTrapQuestion } from "./DescribingHowObjectsAreMeasuredTest";
import { lengthAlignedQuestion, lengthMisalignedQuestion, weightCompareQuestion, describeDifferenceQuestion, commonStartTrueFalseQuestion } from "./ComparingTwoObjectsDirectlyTest";
import { colorSortIdentifyQuestion, shapeSortIdentifyQuestion, countSingleCategoryQuestion, compareDifferenceQuestion, consistentAttributeTrueFalseQuestion } from "./ClassifyingAndCountingByCategoryTest";

// ---------- cumulative end-of-module test: Measurement and Classifying ----------
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx question
// banks — same reuse pattern as MK1_CountingAndCardinalityLab's and every
// other lab's units/ModuleTest.tsx.

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own ModuleTest) — keep in sync with `questions.length`.
export const MODULE_TEST_TOTAL = 15;

/** 1-5 star rating banded on the raw /15 score — cutoffs scaled from the
 *  18/16/14/12-out-of-20 bands every other 20-question module test in this
 *  app uses (×0.75, rounded to keep the 4-star cutoff matching passScore). */
export const moduleTestStars = (score: number): number => {
  if (score >= 14) return 5;
  if (score >= 12) return 4;
  if (score >= 10) return 3;
  if (score >= 8) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Describing How Objects Are Measured
    lengthQuestion,
    weightQuestion,
    twoAttributesQuestion,
    vocabLengthQuestion,
    sizeVsWeightTrapQuestion,
    // Comparing Two Objects Directly
    lengthAlignedQuestion,
    lengthMisalignedQuestion,
    weightCompareQuestion,
    describeDifferenceQuestion,
    commonStartTrueFalseQuestion,
    // Classifying and Counting by Category
    colorSortIdentifyQuestion,
    shapeSortIdentifyQuestion,
    countSingleCategoryQuestion,
    compareDifferenceQuestion,
    consistentAttributeTrueFalseQuestion,
  ],
  // 12/15 = 80%, matching the 4-star cutoff in moduleTestStars above.
  passScore: 12,
};
