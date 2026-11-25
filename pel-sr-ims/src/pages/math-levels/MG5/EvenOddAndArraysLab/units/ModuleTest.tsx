import { moduleStars } from "../../../shared/engine/moduleStars";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 19,
};
