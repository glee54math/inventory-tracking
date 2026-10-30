import type { Unit } from "../../../shared/units/types";
import { plainTensQuestion, zeroTensQuestion, zeroOnesHundredsQuestion, multipleOf100TensQuestion, regroupValueQuestion } from "./HundredsTensOnesTest";
import { count1Question, skip2ChoiceQuestion, skip5Question, skip10ChoiceQuestion, skip100EndpointQuestion } from "./CountingAndSkipCountingTest";
import { numToWordQuestion, wordToNumQuestion, numToExpandedQuestion, expandedToNumQuestion, zeroPlaceholderWordQuestion } from "./ReadingWritingNumbersTest";
import { diffHundredsSymbolQuestion, diffTensQuestion, diffOnesSymbolQuestion, equalTrueFalseQuestion, formCompareWordQuestion } from "./ComparingNumbersTest";

// ---------- cumulative end-of-module test: Place Value to 1000 ----------
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question
// banks — same reuse pattern as MM1 Ratio Lab's and Negative Numbers Lab's
// units/ModuleTest.tsx files importing individual generators from each
// unit's own test file rather than writing a fresh bank from scratch.

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own ModuleTest.tsx) — keep in sync if the `questions`
// array's length is ever edited.
export const MODULE_TEST_TOTAL = 20;

/** A 1-5 star rating banded on the raw /20 score, same cutoffs as MM1
 *  Negative Numbers Lab's module test (also out of 20): 18/16/14/12. */
export const moduleTestStars = (score: number): number => {
  if (score >= 18) return 5;
  if (score >= 16) return 4;
  if (score >= 14) return 3;
  if (score >= 12) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Hundreds, Tens, and Ones
    plainTensQuestion,
    zeroTensQuestion,
    zeroOnesHundredsQuestion,
    multipleOf100TensQuestion,
    regroupValueQuestion,
    // Counting and Skip-Counting to 1000
    count1Question,
    skip2ChoiceQuestion,
    skip5Question,
    skip10ChoiceQuestion,
    skip100EndpointQuestion,
    // Reading and Writing Numbers Three Ways
    numToWordQuestion,
    wordToNumQuestion,
    numToExpandedQuestion,
    expandedToNumQuestion,
    zeroPlaceholderWordQuestion,
    // Comparing Three-Digit Numbers
    diffHundredsSymbolQuestion,
    diffTensQuestion,
    diffOnesSymbolQuestion,
    equalTrueFalseQuestion,
    formCompareWordQuestion,
  ],
  // 16/20 (80%) matches the 4-star cutoff in moduleTestStars above.
  passScore: 16,
};
