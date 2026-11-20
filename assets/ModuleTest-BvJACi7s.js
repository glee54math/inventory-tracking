const e=`import type { Unit } from "../../../shared/units/types";\r
import { successorShortQuestion, successorLongQuestion, tensNextQuestion, decadeCrossNumberQuestion, decadeAlwaysTrueQuestion } from "./CountingOnAndForwardTest";\r
import { writeFromWordTeenQuestion, writeFromPictureLargeQuestion, anyLookalikeQuestion, anyReversedPairQuestion, flipGeneralizationQuestion } from "./WritingAndMatchingNumeralsTest";\r
import { scatteredCountQuestion, circleCountQuestion, countOutQuestion, startingPointChoiceQuestion, arrangementNeverChangesCountQuestion } from "./HowManyCardinalityTest";\r
import { matchingDiffQuestion, closeDiffQuestion, equalTrapQuestion, numeralBiggerQuestion, objectsVsNumeralsTrueFalseQuestion } from "./ComparingGroupsAndNumeralsTest";\r
\r
// ---------- cumulative end-of-module test: Counting and Cardinality ----------\r
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question\r
// banks — same reuse pattern as MM1 Ratio Lab's and MM1 Negative Numbers'\r
// units/ModuleTest.tsx. Diagrams (CounterGroup/TenGroups) are kept, not\r
// stripped — for this K audience the concrete objects ARE the content, not\r
// scaffolding layered on top of a word problem, so a diagram-free version\r
// would just make a question harder to parse, not more rigorous.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as Ratio Lab's MODULE_TEST_TOTAL) — keep in sync with \`questions.length\`.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/** 1-5 star rating banded on the raw /20 score, same cutoffs as every other\r
 *  20-question module test in this app. */\r
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
    // Counting On and Counting Forward\r
    successorShortQuestion,\r
    successorLongQuestion,\r
    () => tensNextQuestion("medium"),\r
    decadeCrossNumberQuestion,\r
    decadeAlwaysTrueQuestion,\r
    // Writing and Matching Numerals\r
    writeFromWordTeenQuestion,\r
    writeFromPictureLargeQuestion,\r
    anyLookalikeQuestion,\r
    anyReversedPairQuestion,\r
    flipGeneralizationQuestion,\r
    // How Many? (Cardinality and Counting Objects)\r
    scatteredCountQuestion,\r
    circleCountQuestion,\r
    () => countOutQuestion("nearExhaustion"),\r
    startingPointChoiceQuestion,\r
    arrangementNeverChangesCountQuestion,\r
    // Comparing Groups and Numerals\r
    matchingDiffQuestion,\r
    closeDiffQuestion,\r
    equalTrapQuestion,\r
    numeralBiggerQuestion,\r
    objectsVsNumeralsTrueFalseQuestion,\r
  ],\r
  // 16/20 matches the 4-star cutoff in moduleTestStars above.\r
  passScore: 16,\r
};\r
`;export{e as default};
