import type { Unit } from "../../../shared/units/types";
import { lengthQuestion, weightQuestion, twoAttributesQuestion, wordPictureQuestion, sizeVsWeightTrapQuestion } from "./DescribingHowObjectsAreMeasuredTest";
import { lengthAlignedQuestion, lengthMisalignedQuestion, weightCompareQuestion, describeDifferenceQuestion, differentStartsQuestion } from "./ComparingTwoObjectsDirectlyTest";
import { colorSortIdentifyQuestion, shapeSortIdentifyQuestion, countSingleCategoryQuestion, compareExtrasQuestion, keepOneRuleQuestion } from "./ClassifyingAndCountingByCategoryTest";

// ---------- cumulative end-of-module test: Measurement and Classifying ----------
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx question
// banks — same reuse pattern as MK1_CountingAndCardinalityLab's and every
// other lab's units/ModuleTest.tsx.

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own ModuleTest) — keep in sync with `questions.length`.
export const MODULE_TEST_TOTAL = 15;

/** 0-5 star rating on the raw score out of 15 (user decision D8, round 1):
 *  a low score earns no star. */
export const moduleTestStars = (score: number): number => {
  if (score >= 14) return 5;
  if (score >= 12) return 4;
  if (score >= 10) return 3;
  if (score >= 8) return 2;
  if (score >= 6) return 1;
  return 0;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Unit 1: Long and Heavy
    lengthQuestion,
    weightQuestion,
    twoAttributesQuestion,
    wordPictureQuestion,
    sizeVsWeightTrapQuestion,
    // Unit 2: Which Is Longer? Which Is Heavier?
    lengthAlignedQuestion,
    lengthMisalignedQuestion,
    weightCompareQuestion,
    describeDifferenceQuestion,
    differentStartsQuestion,
    // Unit 3: Sort and Count
    colorSortIdentifyQuestion,
    shapeSortIdentifyQuestion,
    countSingleCategoryQuestion,
    compareExtrasQuestion,
    keepOneRuleQuestion,
  ],
  // 12/15 = 80%, matching the 4-star cutoff in moduleTestStars above.
  passScore: 12,
};
