import { moduleStars } from "../../../shared/engine/moduleStars";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 19,
};
