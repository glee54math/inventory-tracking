import { moduleStars } from "../../../shared/engine/moduleStars";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 19,
};
