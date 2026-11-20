const e=`import type { Unit } from "../../../shared/units/types";\r
import { decadeCrossChoiceQuestion, cross100ChoiceQuestion, cross100NumberQuestion, after109Question, howManySticksQuestion } from "./CountingTo120Test";\r
import { standardSentenceQuestion, teenSentenceQuestion, exactlyTenQuestion, reverseDigitSwapChoiceQuestion, zeroOnesQuestion } from "./TensAndOnesTest";\r
import { diffTensChoiceQuestion, sameTensDiffOnesChoiceQuestion, tensFirstWhyQuestion, equalTrapQuestion, reversedDigitsChoiceQuestion } from "./ComparingTwoDigitNumbersTest";\r
import { tenMoreQuestion, tenLessCrossingQuestion, subtractMultipleOfTenMidDecadeQuestion, onesStayQuestion, tenMorePickQuestion } from "./TenMoreTenLessTest";\r
import { noRegroupEasyQuestion, regroupStandardQuestion, forgotCarryChoiceQuestion, newTenTypedQuestion, regroupSentenceProductionQuestion } from "./AddingTwoDigitOneDigitTest";\r
\r
// ---------- cumulative end-of-module test: Place Value to 120 ----------\r
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx question\r
// banks — same reuse pattern as MK1_CountingAndCardinalityLab's and\r
// MM1_RatioLab's units/ModuleTest.tsx. Diagrams are kept where the source\r
// question already had one (HundredChart/BaseTenBlocks ARE the content for\r
// this grade, not scaffolding on top of a word problem).\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as every other lab's ModuleTest.tsx) — keep in sync with \`questions.length\`.\r
export const MODULE_TEST_TOTAL = 25;\r
\r
/** 1-5 star rating banded on the raw /25 score. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 23) return 5;\r
  if (score >= 20) return 4;\r
  if (score >= 17) return 3;\r
  if (score >= 14) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Counting to 120. "How many?" (sticks past 100) replaced the easiest\r
    // item, "count from 1" (user decision 2026-11-17); still 5 per unit.\r
    decadeCrossChoiceQuestion,\r
    cross100ChoiceQuestion,\r
    cross100NumberQuestion,\r
    after109Question,\r
    howManySticksQuestion,\r
    // Tens and Ones\r
    standardSentenceQuestion,\r
    teenSentenceQuestion,\r
    exactlyTenQuestion,\r
    reverseDigitSwapChoiceQuestion,\r
    zeroOnesQuestion,\r
    // Comparing Two-Digit Numbers\r
    diffTensChoiceQuestion,\r
    sameTensDiffOnesChoiceQuestion,\r
    tensFirstWhyQuestion,\r
    equalTrapQuestion,\r
    reversedDigitsChoiceQuestion,\r
    // Ten More, Ten Less, and Adding Tens\r
    tenMoreQuestion,\r
    tenLessCrossingQuestion,\r
    subtractMultipleOfTenMidDecadeQuestion,\r
    onesStayQuestion,\r
    tenMorePickQuestion,\r
    // Adding Ones to a Number\r
    noRegroupEasyQuestion,\r
    regroupStandardQuestion,\r
    forgotCarryChoiceQuestion,\r
    newTenTypedQuestion,\r
    regroupSentenceProductionQuestion,\r
  ],\r
  // 20/25 = 80%, matching the 4-star cutoff in moduleTestStars above.\r
  passScore: 20,\r
};\r
`;export{e as default};
