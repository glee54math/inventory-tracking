const e=`import type { Unit } from "../../../shared/units/types";\r
import { sumsTo10NumberQuestion, makeTenSumNumberQuestion, subDecomposeNumberQuestion, factFamilyNumberQuestion, subtractionIsNotOnlyCountDownChoiceQuestion } from "./WithinTwentyFluencyTest";\r
import { twoAddendsOneRegroupNumberQuestion, threeAddendsSingleCarryNumberQuestion, fourAddendsDoubleCarryNumberQuestion, carryMoreThanOneTrueFalseChoiceQuestion, threeOrFourAddendsCarryRatioQuestion } from "./AddingFourTwoDigitNumbersTest";\r
import { addDoubleRegroupNumberQuestion, subSingleBorrowNumberQuestion, subBorrowThroughZeroNumberQuestion, estimateReasonableChoiceQuestion, estimateValueNumberQuestion } from "./AddSubtractWithin1000Test";\r
import { plus10CrossHundredNumberQuestion, minus10CrossHundredNumberQuestion, plus100AtEdgeNumberQuestion, minus100AtEdgeNumberQuestion, rippleChoiceQuestion } from "./MentalMathTenHundredTest";\r
import { regroupValueChoiceQuestion, columnAdditionJustifyChoiceQuestion, commutativeScopeChoiceQuestion, critiqueWhereChoiceQuestion, critiqueCorrectAnswerNumberQuestion } from "./ExplainingStrategiesTest";\r
\r
// ---------- cumulative end-of-module test: Extending Addition and Subtraction ----------\r
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx question\r
// banks — same reuse pattern as MG1 Addition and Subtraction Within 20's own\r
// units/ModuleTest.tsx.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as every other lab's own MODULE_TEST_TOTAL) — keep in sync with\r
// \`questions.length\`.\r
export const MODULE_TEST_TOTAL = 25;\r
\r
/** 1-5 star rating banded on the raw /25 score. 20/25 (80%) is both the\r
 *  passScore below and the 4-star cutoff — the usual 18/16/14/12 cutoffs for\r
 *  a 20-question module test, scaled by 25/20 = 1.25 and rounded. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 23) return 5;\r
  if (score >= 20) return 4;\r
  if (score >= 18) return 3;\r
  if (score >= 15) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Within-20 Addition and Subtraction Fluency\r
    sumsTo10NumberQuestion,\r
    makeTenSumNumberQuestion,\r
    subDecomposeNumberQuestion,\r
    factFamilyNumberQuestion,\r
    subtractionIsNotOnlyCountDownChoiceQuestion,\r
    // Adding Up to Four Two-Digit Numbers\r
    twoAddendsOneRegroupNumberQuestion,\r
    threeAddendsSingleCarryNumberQuestion,\r
    fourAddendsDoubleCarryNumberQuestion,\r
    carryMoreThanOneTrueFalseChoiceQuestion,\r
    threeOrFourAddendsCarryRatioQuestion,\r
    // Adding and Subtracting Within 1000\r
    addDoubleRegroupNumberQuestion,\r
    subSingleBorrowNumberQuestion,\r
    subBorrowThroughZeroNumberQuestion,\r
    estimateReasonableChoiceQuestion,\r
    estimateValueNumberQuestion,\r
    // Mental Math — Add or Subtract 10 or 100\r
    plus10CrossHundredNumberQuestion,\r
    minus10CrossHundredNumberQuestion,\r
    plus100AtEdgeNumberQuestion,\r
    minus100AtEdgeNumberQuestion,\r
    rippleChoiceQuestion,\r
    // Explaining Why the Strategies Work\r
    regroupValueChoiceQuestion,\r
    columnAdditionJustifyChoiceQuestion,\r
    commutativeScopeChoiceQuestion,\r
    critiqueWhereChoiceQuestion,\r
    critiqueCorrectAnswerNumberQuestion,\r
  ],\r
  // 20/25 = 80%, matching the 4-star cutoff in moduleTestStars above.\r
  passScore: 20,\r
};\r
`;export{e as default};
