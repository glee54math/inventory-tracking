import type { Unit } from "../../../shared/units/types";
import { alignedOrderQuestion, misalignedOrderQuestion, indirectComparisonQuestion } from "./ComparingOrderingLengthTest";
import { cleanCountQuestion, gappedMistakeQuestion, overlapMistakeQuestion } from "./MeasuringWithUnitsTest";
import { exactHourReadQuestion, exactHalfHourReadQuestion, matchHandsQuestion } from "./TellingTimeTest";
import { sortRawQuestion, read2CatQuestion, howManyMoreQuestion, combinedTotalQuestion } from "./OrganizingDataTest";

// ---------- cumulative end-of-module test: Measurement, Time & Data ----------
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question
// banks — same reuse pattern as MM1 Ratio Lab's and Negative Numbers'
// units/ModuleTest.tsx importing individual generators from each unit test
// file, rather than writing a fresh 20-question bank from scratch. Each
// generator is still its own independent random draw, so retaking the
// module test doesn't replay the exact same 20 questions.
//
// Every diagram stays visible here (unlike Ratio Lab's module test, which
// strips diagrams entirely) — a length comparison, a unit-tile measurement,
// an analog clock, or a picture graph is intrinsic to what each question is
// actually testing at this grade, not scaffolding layered on top of a word
// problem, so removing it would make the question untestable, not harder.

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own ModuleTest.tsx) — calling every generator just to
// count would burn a random draw from each for no reason. Keep in sync with
// the `questions` array's length below if it's ever edited.
export const MODULE_TEST_TOTAL = 20;

/**
 * A 1-5 star rating banded on the raw /20 score — lines up with A-F cutoffs
 * by percentage (<60/60s/70s/80s/90+), expressed as the raw score out of 20
 * each band lands on exactly. Same bands as every other 20-question module
 * test in this app.
 */
export const moduleTestStars = (score: number): number => {
  if (score >= 18) return 5;
  if (score >= 16) return 4;
  if (score >= 14) return 3;
  if (score >= 12) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Comparing and Ordering Length
    () => alignedOrderQuestion("shortest", "easy"),
    () => alignedOrderQuestion("longest", "medium"),
    () => misalignedOrderQuestion("shortest"),
    () => indirectComparisonQuestion(false),
    () => indirectComparisonQuestion(true),
    // Measuring Length with Units
    () => cleanCountQuestion("short"),
    () => cleanCountQuestion("wide"),
    () => gappedMistakeQuestion("isCorrect"),
    () => gappedMistakeQuestion("trueLength"),
    () => overlapMistakeQuestion("trueLength"),
    // Telling and Writing Time
    () => exactHourReadQuestion("easy"),
    () => exactHalfHourReadQuestion("medium"),
    () => exactHalfHourReadQuestion("hard"),
    () => matchHandsQuestion(false),
    () => matchHandsQuestion(true),
    // Organizing and Interpreting Data
    () => sortRawQuestion("easy"),
    () => read2CatQuestion("medium"),
    () => howManyMoreQuestion("more"),
    () => howManyMoreQuestion("fewer"),
    () => combinedTotalQuestion(),
  ],
  // 16/20 = 80%, matching the 4-star cutoff in moduleTestStars above —
  // "passed" (the checkmark on TestBadge, and UnitTestView's "Passed"
  // message) means at least 4 stars, not the full 5.
  passScore: 16,
};
