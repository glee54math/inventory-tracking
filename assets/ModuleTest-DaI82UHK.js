const e=`import type { Unit } from "../../../shared/units/types";\r
import { addToResultQuestion, takeFromResultQuestion, fingersJoinQuestion, equationApartChoiceQuestion, takeAwayNeverBiggerQuestion } from "./PuttingTogetherAndTakingApartTest";\r
import { putTogetherTotalQuestion, missingAddendQuestion, compareDifferenceQuestion, compareSumDistractorQuestion, addOrSubtractChoiceQuestion } from "./WordProblemsWithin10Test";\r
import { decomposeSmallQuestion, decomposeLargeQuestion, secondWayQuestion, moreThanOneWayTrueFalseQuestion, equalPartsQuestion } from "./DecomposingNumbersTest";\r
import { smallComplementQuestion, nearTenComplementQuestion, middleComplementQuestion, countingUpVsRecallQuestion, verifyFalsePairQuestion } from "./MakingTenTest";\r
import { additionFactQuestion, subtractionFactQuestion, doublesFactQuestion, missingAddendChoiceQuestion, subtractAllQuestion } from "./FastFactsWithin5Test";\r
import { composeTeenQuestion, decomposeTeenQuestion, digitMeaningQuestion, digitSwapTrapQuestion, everyTeenTrueFalseQuestion } from "./TeenNumbersTest";\r
\r
// ---------- cumulative end-of-module test: Addition, Subtraction, and Teen\r
// Numbers ----------\r
// 30 questions, 5 drawn from each of the 6 units' own *Test.tsx question\r
// banks — same reuse pattern as MK1 Counting & Cardinality's and MM1's own\r
// units/ModuleTest.tsx. Diagrams are kept, not stripped — for this K\r
// audience the concrete objects/ten-frames ARE the content, not scaffolding\r
// layered on top of a word problem.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as every other lab's own ModuleTest.tsx) — keep in sync with\r
// \`questions.length\`.\r
export const MODULE_TEST_TOTAL = 30;\r
\r
/** 1-5 star rating banded on the raw /30 score. Scaled proportionally from\r
 *  the 20-question-test convention's 90/80/70/60% cutoffs (18/16/14/12 of\r
 *  20), since this module test has 6 units (30 questions) instead of 4. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 27) return 5;\r
  if (score >= 24) return 4;\r
  if (score >= 21) return 3;\r
  if (score >= 18) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Putting Together and Taking Apart\r
    addToResultQuestion,\r
    takeFromResultQuestion,\r
    fingersJoinQuestion,\r
    equationApartChoiceQuestion,\r
    takeAwayNeverBiggerQuestion,\r
    // Solving Word Problems Within 10\r
    putTogetherTotalQuestion,\r
    missingAddendQuestion,\r
    compareDifferenceQuestion,\r
    compareSumDistractorQuestion,\r
    addOrSubtractChoiceQuestion,\r
    // Breaking Numbers Apart\r
    decomposeSmallQuestion,\r
    decomposeLargeQuestion,\r
    secondWayQuestion,\r
    moreThanOneWayTrueFalseQuestion,\r
    equalPartsQuestion,\r
    // Making 10\r
    smallComplementQuestion,\r
    nearTenComplementQuestion,\r
    middleComplementQuestion,\r
    countingUpVsRecallQuestion,\r
    verifyFalsePairQuestion,\r
    // Fast Facts Within 5\r
    additionFactQuestion,\r
    subtractionFactQuestion,\r
    doublesFactQuestion,\r
    missingAddendChoiceQuestion,\r
    subtractAllQuestion,\r
    // Teen Numbers as Ten Plus More\r
    composeTeenQuestion,\r
    decomposeTeenQuestion,\r
    digitMeaningQuestion,\r
    digitSwapTrapQuestion,\r
    everyTeenTrueFalseQuestion,\r
  ],\r
  // 24/30 (80%) matches the 4-star cutoff in moduleTestStars above.\r
  passScore: 24,\r
};\r
`;export{e as default};
