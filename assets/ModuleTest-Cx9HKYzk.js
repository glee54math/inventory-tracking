const e=`import type { Unit } from "../../../shared/units/types";\r
import { lengthQuestion, weightQuestion, twoAttributesQuestion, vocabLengthQuestion, sizeVsWeightTrapQuestion } from "./DescribingHowObjectsAreMeasuredTest";\r
import { lengthAlignedQuestion, lengthMisalignedQuestion, weightCompareQuestion, describeDifferenceQuestion, commonStartTrueFalseQuestion } from "./ComparingTwoObjectsDirectlyTest";\r
import { colorSortIdentifyQuestion, shapeSortIdentifyQuestion, countSingleCategoryQuestion, compareDifferenceQuestion, consistentAttributeTrueFalseQuestion } from "./ClassifyingAndCountingByCategoryTest";\r
\r
// ---------- cumulative end-of-module test: Measurement and Classifying ----------\r
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx question\r
// banks — same reuse pattern as MK1_CountingAndCardinalityLab's and every\r
// other lab's units/ModuleTest.tsx.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as every other lab's own ModuleTest) — keep in sync with \`questions.length\`.\r
export const MODULE_TEST_TOTAL = 15;\r
\r
/** 1-5 star rating banded on the raw /15 score — cutoffs scaled from the\r
 *  18/16/14/12-out-of-20 bands every other 20-question module test in this\r
 *  app uses (×0.75, rounded to keep the 4-star cutoff matching passScore). */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 14) return 5;\r
  if (score >= 12) return 4;\r
  if (score >= 10) return 3;\r
  if (score >= 8) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Describing How Objects Are Measured\r
    lengthQuestion,\r
    weightQuestion,\r
    twoAttributesQuestion,\r
    vocabLengthQuestion,\r
    sizeVsWeightTrapQuestion,\r
    // Comparing Two Objects Directly\r
    lengthAlignedQuestion,\r
    lengthMisalignedQuestion,\r
    weightCompareQuestion,\r
    describeDifferenceQuestion,\r
    commonStartTrueFalseQuestion,\r
    // Classifying and Counting by Category\r
    colorSortIdentifyQuestion,\r
    shapeSortIdentifyQuestion,\r
    countSingleCategoryQuestion,\r
    compareDifferenceQuestion,\r
    consistentAttributeTrueFalseQuestion,\r
  ],\r
  // 12/15 = 80%, matching the 4-star cutoff in moduleTestStars above.\r
  passScore: 12,\r
};\r
`;export{e as default};
