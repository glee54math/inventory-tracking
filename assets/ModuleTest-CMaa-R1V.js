const e=`import type { Unit } from "../../../shared/units/types";\r
import { smallEvenCountQuestion, smallOddClassifyQuestion, largerEvenClassifyQuestion, scatteredClassifyQuestion, arrangementTrueFalseQuestion } from "./DeterminingOddAndEvenTest";\r
import { smallEqualAddendsRatioQuestion, largerEqualAddendsRatioQuestion, invalidEqualAddendsChoiceQuestion, oddNumberImpossibleChoiceQuestion, everyNumberTrueFalseQuestion } from "./EvenNumbersAsEqualAddendsTest";\r
import { smallArrayTotalQuestion, largerArrayTotalQuestion, rowsTotalQuestion, orientationSwapTotalQuestion, rowsColsSameTotalTrueFalseQuestion } from "./RectangularArraysFindingTotalTest";\r
import { rowGroupCountAndTotalQuestion, colGroupTotalQuestion, reverseTotalQuestion, whichEquationIsRowsChoiceQuestion, bothEquationsSameArrayTrueFalseQuestion } from "./ArraysAsEqualAddendEquationsTest";\r
\r
// ---------- cumulative end-of-module test: Even/Odd & Arrays ----------\r
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question\r
// banks — same reuse pattern as every other lab's own units/ModuleTest.tsx\r
// (MG1 Addition & Subtraction Within 20, MK1 Counting and Cardinality, etc.).\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as every other lab's own MODULE_TEST_TOTAL) — keep in sync with\r
// \`questions.length\`.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/** 1-5 star rating banded on the raw /20 score — the standard 18/16/14/12\r
 *  bands for a 20-question module test used across this app. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 18) return 5;\r
  if (score >= 16) return 4;\r
  if (score >= 14) return 3;\r
  if (score >= 12) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Determining Odd and Even\r
    smallEvenCountQuestion,\r
    smallOddClassifyQuestion,\r
    largerEvenClassifyQuestion,\r
    scatteredClassifyQuestion,\r
    arrangementTrueFalseQuestion,\r
    // Even Numbers as Equal Addends\r
    smallEqualAddendsRatioQuestion,\r
    largerEqualAddendsRatioQuestion,\r
    invalidEqualAddendsChoiceQuestion,\r
    oddNumberImpossibleChoiceQuestion,\r
    everyNumberTrueFalseQuestion,\r
    // Rectangular Arrays — Finding the Total\r
    smallArrayTotalQuestion,\r
    largerArrayTotalQuestion,\r
    rowsTotalQuestion,\r
    orientationSwapTotalQuestion,\r
    rowsColsSameTotalTrueFalseQuestion,\r
    // Arrays as Equal-Addend Equations\r
    rowGroupCountAndTotalQuestion,\r
    colGroupTotalQuestion,\r
    reverseTotalQuestion,\r
    whichEquationIsRowsChoiceQuestion,\r
    bothEquationsSameArrayTrueFalseQuestion,\r
  ],\r
  // 16/20 = 80%, matching the 4-star cutoff in moduleTestStars above.\r
  passScore: 16,\r
};\r
`;export{e as default};
