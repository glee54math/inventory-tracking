import type { Unit } from "../../../shared/units/types";
import { successorFrom1Question, decadeCrossChoiceQuestion, cross100ChoiceQuestion, cross100NumberQuestion, patternRepeatsTrueFalseQuestion } from "./CountingTo120Test";
import { standardSentenceQuestion, teenSentenceQuestion, exactlyTenQuestion, reverseDigitSwapChoiceQuestion, zeroOnesTrueFalseQuestion } from "./TensAndOnesTest";
import { diffTensChoiceQuestion, sameTensDiffOnesChoiceQuestion, tensFirstWhyQuestion, equalTrapQuestion, reversedDigitsChoiceQuestion } from "./ComparingTwoDigitNumbersTest";
import { tenMoreQuestion, tenLessCrossingQuestion, subtractMultipleOfTenMidDecadeQuestion, onesNeverChangeTrueFalseQuestion, digitChangedChoiceQuestion } from "./TenMoreTenLessTest";
import { noRegroupEasyQuestion, regroupStandardQuestion, forgotCarryChoiceQuestion, regroupRuleTrueFalseQuestion, regroupSentenceProductionQuestion } from "./AddingTwoDigitOneDigitTest";

// ---------- cumulative end-of-module test: Place Value to 120 ----------
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx question
// banks — same reuse pattern as MK1_CountingAndCardinalityLab's and
// MM1_RatioLab's units/ModuleTest.tsx. Diagrams are kept where the source
// question already had one (HundredChart/BaseTenBlocks ARE the content for
// this grade, not scaffolding on top of a word problem).

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's ModuleTest.tsx) — keep in sync with `questions.length`.
export const MODULE_TEST_TOTAL = 25;

/** 1-5 star rating banded on the raw /25 score. */
export const moduleTestStars = (score: number): number => {
  if (score >= 23) return 5;
  if (score >= 20) return 4;
  if (score >= 17) return 3;
  if (score >= 14) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Counting to 120
    successorFrom1Question,
    decadeCrossChoiceQuestion,
    cross100ChoiceQuestion,
    cross100NumberQuestion,
    patternRepeatsTrueFalseQuestion,
    // Tens and Ones
    standardSentenceQuestion,
    teenSentenceQuestion,
    exactlyTenQuestion,
    reverseDigitSwapChoiceQuestion,
    zeroOnesTrueFalseQuestion,
    // Comparing Two-Digit Numbers
    diffTensChoiceQuestion,
    sameTensDiffOnesChoiceQuestion,
    tensFirstWhyQuestion,
    equalTrapQuestion,
    reversedDigitsChoiceQuestion,
    // Ten More, Ten Less, and Multiples of Ten
    tenMoreQuestion,
    tenLessCrossingQuestion,
    subtractMultipleOfTenMidDecadeQuestion,
    onesNeverChangeTrueFalseQuestion,
    digitChangedChoiceQuestion,
    // Adding a 2-Digit and a 1-Digit Number
    noRegroupEasyQuestion,
    regroupStandardQuestion,
    forgotCarryChoiceQuestion,
    regroupRuleTrueFalseQuestion,
    regroupSentenceProductionQuestion,
  ],
  // 20/25 = 80%, matching the 4-star cutoff in moduleTestStars above.
  passScore: 20,
};
