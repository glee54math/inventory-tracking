const e=`import type { Unit } from "../../../shared/units/types";\r
import { alignedOrderQuestion, misalignedOrderQuestion, indirectComparisonQuestion } from "./ComparingOrderingLengthTest";\r
import { cleanCountQuestion, gappedMistakeQuestion, overlapMistakeQuestion } from "./MeasuringWithUnitsTest";\r
import { exactHourReadQuestion, exactHalfHourReadQuestion, matchHandsQuestion } from "./TellingTimeTest";\r
import { sortRawQuestion, read2CatQuestion, howManyMoreQuestion, combinedTotalQuestion } from "./OrganizingDataTest";\r
\r
// ---------- cumulative end-of-module test: Measurement, Time & Data ----------\r
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question\r
// banks — same reuse pattern as MM1 Ratio Lab's and Negative Numbers'\r
// units/ModuleTest.tsx importing individual generators from each unit test\r
// file, rather than writing a fresh 20-question bank from scratch. Each\r
// generator is still its own independent random draw, so retaking the\r
// module test doesn't replay the exact same 20 questions.\r
//\r
// Every diagram stays visible here (unlike Ratio Lab's module test, which\r
// strips diagrams entirely) — a length comparison, a unit-tile measurement,\r
// an analog clock, or a picture graph is intrinsic to what each question is\r
// actually testing at this grade, not scaffolding layered on top of a word\r
// problem, so removing it would make the question untestable, not harder.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as every other lab's own ModuleTest.tsx) — calling every generator just to\r
// count would burn a random draw from each for no reason. Keep in sync with\r
// the \`questions\` array's length below if it's ever edited.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/**\r
 * A 1-5 star rating banded on the raw /20 score — lines up with A-F cutoffs\r
 * by percentage (<60/60s/70s/80s/90+), expressed as the raw score out of 20\r
 * each band lands on exactly. Same bands as every other 20-question module\r
 * test in this app.\r
 */\r
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
    // Comparing and Ordering Length\r
    () => alignedOrderQuestion("shortest", "easy"),\r
    () => alignedOrderQuestion("longest", "medium"),\r
    () => misalignedOrderQuestion("shortest"),\r
    () => indirectComparisonQuestion(false),\r
    () => indirectComparisonQuestion(true),\r
    // Measuring Length with Units\r
    () => cleanCountQuestion("short"),\r
    () => cleanCountQuestion("wide"),\r
    () => gappedMistakeQuestion("isCorrect"),\r
    () => gappedMistakeQuestion("trueLength"),\r
    () => overlapMistakeQuestion("trueLength"),\r
    // Telling and Writing Time\r
    () => exactHourReadQuestion("easy"),\r
    () => exactHalfHourReadQuestion("medium"),\r
    () => exactHalfHourReadQuestion("hard"),\r
    () => matchHandsQuestion(false),\r
    () => matchHandsQuestion(true),\r
    // Organizing and Interpreting Data\r
    () => sortRawQuestion("easy"),\r
    () => read2CatQuestion("medium"),\r
    () => howManyMoreQuestion("more"),\r
    () => howManyMoreQuestion("fewer"),\r
    () => combinedTotalQuestion(),\r
  ],\r
  // 16/20 = 80%, matching the 4-star cutoff in moduleTestStars above —\r
  // "passed" (the checkmark on TestBadge, and UnitTestView's "Passed"\r
  // message) means at least 4 stars, not the full 5.\r
  passScore: 16,\r
};\r
`;export{e as default};
