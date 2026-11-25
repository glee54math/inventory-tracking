import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { decadeCrossChoiceQuestion, cross100ChoiceQuestion, cross100NumberQuestion, after109Question, howManySticksQuestion } from "./CountingTo120Test";
import { standardSentenceQuestion, teenSentenceQuestion, exactlyTenQuestion, reverseDigitSwapChoiceQuestion, zeroOnesQuestion } from "./TensAndOnesTest";
import { diffTensChoiceQuestion, sameTensDiffOnesChoiceQuestion, tensFirstWhyQuestion, equalTrapQuestion, reversedDigitsChoiceQuestion } from "./ComparingTwoDigitNumbersTest";
import { tenMoreQuestion, tenLessCrossingQuestion, subtractMultipleOfTenMidDecadeQuestion, onesStayQuestion, tenMorePickQuestion } from "./TenMoreTenLessTest";
import { noRegroupEasyQuestion, regroupStandardQuestion, forgotCarryChoiceQuestion, newTenTypedQuestion, regroupSentenceProductionQuestion } from "./AddingTwoDigitOneDigitTest";

// ---------- cumulative end-of-module test: Place Value to 120 ----------
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx question
// banks — same reuse pattern as MK1_CountingAndCardinalityLab's and
// MM1_RatioLab's units/ModuleTest.tsx. Diagrams are kept where the source
// question already had one (HundredChart/BaseTenBlocks ARE the content for
// this grade, not scaffolding on top of a word problem).

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's ModuleTest.tsx) — keep in sync with `questions.length`.
export const MODULE_TEST_TOTAL = 25;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Counting to 120. "How many?" (sticks past 100) replaced the easiest
    // item, "count from 1" (user decision 2026-11-17); still 5 per unit.
    decadeCrossChoiceQuestion,
    cross100ChoiceQuestion,
    cross100NumberQuestion,
    after109Question,
    howManySticksQuestion,
    // Tens and Ones
    standardSentenceQuestion,
    teenSentenceQuestion,
    exactlyTenQuestion,
    reverseDigitSwapChoiceQuestion,
    zeroOnesQuestion,
    // Comparing Two-Digit Numbers
    diffTensChoiceQuestion,
    sameTensDiffOnesChoiceQuestion,
    tensFirstWhyQuestion,
    equalTrapQuestion,
    reversedDigitsChoiceQuestion,
    // Ten More, Ten Less, and Adding Tens
    tenMoreQuestion,
    tenLessCrossingQuestion,
    subtractMultipleOfTenMidDecadeQuestion,
    onesStayQuestion,
    tenMorePickQuestion,
    // Adding Ones to a Number
    noRegroupEasyQuestion,
    regroupStandardQuestion,
    forgotCarryChoiceQuestion,
    newTenTypedQuestion,
    regroupSentenceProductionQuestion,
  ],
  // Passes at 5 stars.
  passScore: 23,
};
