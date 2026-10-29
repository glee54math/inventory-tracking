import type { Unit } from "../../../shared/units/types";
import { addToResultQuestion, takeFromResultQuestion, fingersJoinQuestion, equationApartChoiceQuestion, takeAwayNeverBiggerQuestion } from "./PuttingTogetherAndTakingApartTest";
import { putTogetherTotalQuestion, missingAddendQuestion, compareDifferenceQuestion, compareSumDistractorQuestion, addOrSubtractChoiceQuestion } from "./WordProblemsWithin10Test";
import { decomposeSmallQuestion, decomposeLargeQuestion, secondWayQuestion, moreThanOneWayTrueFalseQuestion, equalPartsQuestion } from "./DecomposingNumbersTest";
import { smallComplementQuestion, nearTenComplementQuestion, middleComplementQuestion, countingUpVsRecallQuestion, verifyFalsePairQuestion } from "./MakingTenTest";
import { additionFactQuestion, subtractionFactQuestion, doublesFactQuestion, missingAddendChoiceQuestion, subtractAllQuestion } from "./FastFactsWithin5Test";
import { composeTeenQuestion, decomposeTeenQuestion, digitMeaningQuestion, digitSwapTrapQuestion, everyTeenTrueFalseQuestion } from "./TeenNumbersTest";

// ---------- cumulative end-of-module test: Addition, Subtraction, and Teen
// Numbers ----------
// 30 questions, 5 drawn from each of the 6 units' own *Test.tsx question
// banks — same reuse pattern as MK1 Counting & Cardinality's and MM1's own
// units/ModuleTest.tsx. Diagrams are kept, not stripped — for this K
// audience the concrete objects/ten-frames ARE the content, not scaffolding
// layered on top of a word problem.

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own ModuleTest.tsx) — keep in sync with
// `questions.length`.
export const MODULE_TEST_TOTAL = 30;

/** 1-5 star rating banded on the raw /30 score. Scaled proportionally from
 *  the 20-question-test convention's 90/80/70/60% cutoffs (18/16/14/12 of
 *  20), since this module test has 6 units (30 questions) instead of 4. */
export const moduleTestStars = (score: number): number => {
  if (score >= 27) return 5;
  if (score >= 24) return 4;
  if (score >= 21) return 3;
  if (score >= 18) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Putting Together and Taking Apart
    addToResultQuestion,
    takeFromResultQuestion,
    fingersJoinQuestion,
    equationApartChoiceQuestion,
    takeAwayNeverBiggerQuestion,
    // Solving Word Problems Within 10
    putTogetherTotalQuestion,
    missingAddendQuestion,
    compareDifferenceQuestion,
    compareSumDistractorQuestion,
    addOrSubtractChoiceQuestion,
    // Breaking Numbers Apart
    decomposeSmallQuestion,
    decomposeLargeQuestion,
    secondWayQuestion,
    moreThanOneWayTrueFalseQuestion,
    equalPartsQuestion,
    // Making 10
    smallComplementQuestion,
    nearTenComplementQuestion,
    middleComplementQuestion,
    countingUpVsRecallQuestion,
    verifyFalsePairQuestion,
    // Fast Facts Within 5
    additionFactQuestion,
    subtractionFactQuestion,
    doublesFactQuestion,
    missingAddendChoiceQuestion,
    subtractAllQuestion,
    // Teen Numbers as Ten Plus More
    composeTeenQuestion,
    decomposeTeenQuestion,
    digitMeaningQuestion,
    digitSwapTrapQuestion,
    everyTeenTrueFalseQuestion,
  ],
  // 24/30 (80%) matches the 4-star cutoff in moduleTestStars above.
  passScore: 24,
};
