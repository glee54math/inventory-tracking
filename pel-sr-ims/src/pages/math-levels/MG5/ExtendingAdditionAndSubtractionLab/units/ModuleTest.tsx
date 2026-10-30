import type { Unit } from "../../../shared/units/types";
import { sumsTo10NumberQuestion, makeTenSumNumberQuestion, subDecomposeNumberQuestion, factFamilyNumberQuestion, subtractionIsNotOnlyCountDownChoiceQuestion } from "./WithinTwentyFluencyTest";
import { twoAddendsOneRegroupNumberQuestion, threeAddendsSingleCarryNumberQuestion, fourAddendsDoubleCarryNumberQuestion, carryMoreThanOneTrueFalseChoiceQuestion, threeOrFourAddendsCarryRatioQuestion } from "./AddingFourTwoDigitNumbersTest";
import { addDoubleRegroupNumberQuestion, subSingleBorrowNumberQuestion, subBorrowThroughZeroNumberQuestion, estimateReasonableChoiceQuestion, estimateValueNumberQuestion } from "./AddSubtractWithin1000Test";
import { plus10CrossHundredNumberQuestion, minus10CrossHundredNumberQuestion, plus100AtEdgeNumberQuestion, minus100AtEdgeNumberQuestion, rippleChoiceQuestion } from "./MentalMathTenHundredTest";
import { regroupValueChoiceQuestion, columnAdditionJustifyChoiceQuestion, commutativeScopeChoiceQuestion, critiqueWhereChoiceQuestion, critiqueCorrectAnswerNumberQuestion } from "./ExplainingStrategiesTest";

// ---------- cumulative end-of-module test: Extending Addition and Subtraction ----------
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx question
// banks — same reuse pattern as MG1 Addition and Subtraction Within 20's own
// units/ModuleTest.tsx.

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own MODULE_TEST_TOTAL) — keep in sync with
// `questions.length`.
export const MODULE_TEST_TOTAL = 25;

/** 1-5 star rating banded on the raw /25 score. 20/25 (80%) is both the
 *  passScore below and the 4-star cutoff — the usual 18/16/14/12 cutoffs for
 *  a 20-question module test, scaled by 25/20 = 1.25 and rounded. */
export const moduleTestStars = (score: number): number => {
  if (score >= 23) return 5;
  if (score >= 20) return 4;
  if (score >= 18) return 3;
  if (score >= 15) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Within-20 Addition and Subtraction Fluency
    sumsTo10NumberQuestion,
    makeTenSumNumberQuestion,
    subDecomposeNumberQuestion,
    factFamilyNumberQuestion,
    subtractionIsNotOnlyCountDownChoiceQuestion,
    // Adding Up to Four Two-Digit Numbers
    twoAddendsOneRegroupNumberQuestion,
    threeAddendsSingleCarryNumberQuestion,
    fourAddendsDoubleCarryNumberQuestion,
    carryMoreThanOneTrueFalseChoiceQuestion,
    threeOrFourAddendsCarryRatioQuestion,
    // Adding and Subtracting Within 1000
    addDoubleRegroupNumberQuestion,
    subSingleBorrowNumberQuestion,
    subBorrowThroughZeroNumberQuestion,
    estimateReasonableChoiceQuestion,
    estimateValueNumberQuestion,
    // Mental Math — Add or Subtract 10 or 100
    plus10CrossHundredNumberQuestion,
    minus10CrossHundredNumberQuestion,
    plus100AtEdgeNumberQuestion,
    minus100AtEdgeNumberQuestion,
    rippleChoiceQuestion,
    // Explaining Why the Strategies Work
    regroupValueChoiceQuestion,
    columnAdditionJustifyChoiceQuestion,
    commutativeScopeChoiceQuestion,
    critiqueWhereChoiceQuestion,
    critiqueCorrectAnswerNumberQuestion,
  ],
  // 20/25 = 80%, matching the 4-star cutoff in moduleTestStars above.
  passScore: 20,
};
