import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { successorShortQuestion, successorLongQuestion, tensNextQuestion, decadeCrossNumberQuestion, decadeAlwaysTrueQuestion } from "./CountingOnAndForwardTest";
import { writeFromWordTeenQuestion, writeFromPictureLargeQuestion, anyLookalikeQuestion, anyReversedPairQuestion, flipGeneralizationQuestion } from "./WritingAndMatchingNumeralsTest";
import { scatteredCountQuestion, circleCountQuestion, countOutQuestion, startingPointChoiceQuestion, arrangementNeverChangesCountQuestion } from "./HowManyCardinalityTest";
import { matchingDiffQuestion, closeDiffQuestion, equalTrapQuestion, numeralBiggerQuestion, objectsVsNumeralsTrueFalseQuestion } from "./ComparingGroupsAndNumeralsTest";

// ---------- cumulative end-of-module test: Counting and Cardinality ----------
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question
// banks — same reuse pattern as MM1 Ratio Lab's and MM1 Negative Numbers'
// units/ModuleTest.tsx. Diagrams (CounterGroup/TenGroups) are kept, not
// stripped — for this K audience the concrete objects ARE the content, not
// scaffolding layered on top of a word problem, so a diagram-free version
// would just make a question harder to parse, not more rigorous.

// Hand-maintained rather than computed from the array below (same reasoning
// as Ratio Lab's MODULE_TEST_TOTAL) — keep in sync with `questions.length`.
export const MODULE_TEST_TOTAL = 20;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Counting On and Counting Forward
    successorShortQuestion,
    successorLongQuestion,
    () => tensNextQuestion("medium"),
    decadeCrossNumberQuestion,
    decadeAlwaysTrueQuestion,
    // Writing and Matching Numerals
    writeFromWordTeenQuestion,
    writeFromPictureLargeQuestion,
    anyLookalikeQuestion,
    anyReversedPairQuestion,
    flipGeneralizationQuestion,
    // How Many? (Cardinality and Counting Objects)
    scatteredCountQuestion,
    circleCountQuestion,
    () => countOutQuestion("nearExhaustion"),
    startingPointChoiceQuestion,
    arrangementNeverChangesCountQuestion,
    // Comparing Groups and Numerals
    matchingDiffQuestion,
    closeDiffQuestion,
    equalTrapQuestion,
    numeralBiggerQuestion,
    objectsVsNumeralsTrueFalseQuestion,
  ],
  // Passes at 5 stars.
  passScore: 19,
};
