import { moduleStars } from "../../../shared/engine/moduleStars";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 23,
};
