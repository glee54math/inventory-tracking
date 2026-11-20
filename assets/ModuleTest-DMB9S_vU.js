const e=`import type { Unit } from "../../../shared/units/types";\r
import { plainTensQuestion, zeroTensQuestion, zeroOnesHundredsQuestion, multipleOf100TensQuestion, regroupValueQuestion } from "./HundredsTensOnesTest";\r
import { count1Question, skip2ChoiceQuestion, skip5Question, skip10ChoiceQuestion, skip100EndpointQuestion } from "./CountingAndSkipCountingTest";\r
import { numToWordQuestion, wordToNumQuestion, numToExpandedQuestion, expandedToNumQuestion, zeroPlaceholderWordQuestion } from "./ReadingWritingNumbersTest";\r
import { diffHundredsSymbolQuestion, diffTensQuestion, diffOnesSymbolQuestion, equalTrueFalseQuestion, formCompareWordQuestion } from "./ComparingNumbersTest";\r
\r
// ---------- cumulative end-of-module test: Place Value to 1000 ----------\r
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question\r
// banks — same reuse pattern as MM1 Ratio Lab's and Negative Numbers Lab's\r
// units/ModuleTest.tsx files importing individual generators from each\r
// unit's own test file rather than writing a fresh bank from scratch.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as every other lab's own ModuleTest.tsx) — keep in sync if the \`questions\`\r
// array's length is ever edited.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/** A 1-5 star rating banded on the raw /20 score, same cutoffs as MM1\r
 *  Negative Numbers Lab's module test (also out of 20): 18/16/14/12. */\r
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
    // Hundreds, Tens, and Ones\r
    plainTensQuestion,\r
    zeroTensQuestion,\r
    zeroOnesHundredsQuestion,\r
    multipleOf100TensQuestion,\r
    regroupValueQuestion,\r
    // Counting and Skip-Counting to 1000\r
    count1Question,\r
    skip2ChoiceQuestion,\r
    skip5Question,\r
    skip10ChoiceQuestion,\r
    skip100EndpointQuestion,\r
    // Reading and Writing Numbers Three Ways\r
    numToWordQuestion,\r
    wordToNumQuestion,\r
    numToExpandedQuestion,\r
    expandedToNumQuestion,\r
    zeroPlaceholderWordQuestion,\r
    // Comparing Three-Digit Numbers\r
    diffHundredsSymbolQuestion,\r
    diffTensQuestion,\r
    diffOnesSymbolQuestion,\r
    equalTrueFalseQuestion,\r
    formCompareWordQuestion,\r
  ],\r
  // 16/20 (80%) matches the 4-star cutoff in moduleTestStars above.\r
  passScore: 16,\r
};\r
`;export{e as default};
