import type { Unit } from "../../../shared/units/types";
import { smallEvenCountQuestion, smallOddClassifyQuestion, largerEvenClassifyQuestion, scatteredClassifyQuestion, arrangementTrueFalseQuestion } from "./DeterminingOddAndEvenTest";
import { smallEqualAddendsRatioQuestion, largerEqualAddendsRatioQuestion, invalidEqualAddendsChoiceQuestion, oddNumberImpossibleChoiceQuestion, everyNumberTrueFalseQuestion } from "./EvenNumbersAsEqualAddendsTest";
import { smallArrayTotalQuestion, largerArrayTotalQuestion, rowsTotalQuestion, orientationSwapTotalQuestion, rowsColsSameTotalTrueFalseQuestion } from "./RectangularArraysFindingTotalTest";
import { rowGroupCountAndTotalQuestion, colGroupTotalQuestion, reverseTotalQuestion, whichEquationIsRowsChoiceQuestion, bothEquationsSameArrayTrueFalseQuestion } from "./ArraysAsEqualAddendEquationsTest";

// ---------- cumulative end-of-module test: Even/Odd & Arrays ----------
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question
// banks — same reuse pattern as every other lab's own units/ModuleTest.tsx
// (MG1 Addition & Subtraction Within 20, MK1 Counting and Cardinality, etc.).

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own MODULE_TEST_TOTAL) — keep in sync with
// `questions.length`.
export const MODULE_TEST_TOTAL = 20;

/** 1-5 star rating banded on the raw /20 score — the standard 18/16/14/12
 *  bands for a 20-question module test used across this app. */
export const moduleTestStars = (score: number): number => {
  if (score >= 18) return 5;
  if (score >= 16) return 4;
  if (score >= 14) return 3;
  if (score >= 12) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Determining Odd and Even
    smallEvenCountQuestion,
    smallOddClassifyQuestion,
    largerEvenClassifyQuestion,
    scatteredClassifyQuestion,
    arrangementTrueFalseQuestion,
    // Even Numbers as Equal Addends
    smallEqualAddendsRatioQuestion,
    largerEqualAddendsRatioQuestion,
    invalidEqualAddendsChoiceQuestion,
    oddNumberImpossibleChoiceQuestion,
    everyNumberTrueFalseQuestion,
    // Rectangular Arrays — Finding the Total
    smallArrayTotalQuestion,
    largerArrayTotalQuestion,
    rowsTotalQuestion,
    orientationSwapTotalQuestion,
    rowsColsSameTotalTrueFalseQuestion,
    // Arrays as Equal-Addend Equations
    rowGroupCountAndTotalQuestion,
    colGroupTotalQuestion,
    reverseTotalQuestion,
    whichEquationIsRowsChoiceQuestion,
    bothEquationsSameArrayTrueFalseQuestion,
  ],
  // 16/20 = 80%, matching the 4-star cutoff in moduleTestStars above.
  passScore: 16,
};
