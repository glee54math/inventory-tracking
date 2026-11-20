const e=`import type { Unit } from "../../../shared/units/types";\r
import type { TestQuestion } from "../../../shared/engine/types";\r
import { phraseToNumberQuestion, numberToPhraseQuestion, zeroMeaningQuestion, TEMPERATURE, ELEVATION, MONEY } from "./RealWorldNegativesTest";\r
import { oppositeQuestion, oppositeOfOppositeQuestion, markedDistanceToOppositeQuestion, midpointOfOppositesQuestion, distanceToZeroQuestion } from "./NumberLineUnitTest";\r
import { identifyPointQuestion, quadrantQuestion, reflectionCoordsQuestion, reflectionGeneralizationQuestion, distanceQuestion } from "./CoordinatePlaneUnitTest";\r
import { inequalityMeaningQuestion, absoluteValueMeaningQuestion, sameAbsoluteValueQuestion, smallerBalanceQuestion, trueFalseTrapQuestion } from "./ComparingOrderingTest";\r
\r
// ---------- cumulative end-of-module test: Negative Numbers ----------\r
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question\r
// banks — same reuse pattern as MM1 Ratio Lab's units/ModuleTest.tsx\r
// importing individual generators from each unit test file, rather than\r
// writing a fresh 20-question bank from scratch. Each generator is still\r
// its own independent random draw, so retaking the module test doesn't\r
// replay the exact same 20 questions.\r
//\r
// Unlike Ratio Lab's module test, this one does NOT exclude diagrams or\r
// multiple-choice steps — a number line / coordinate plane diagram is\r
// intrinsic to this lab's own skills (reading a point, reflecting it,\r
// naming a quadrant), not scaffolding layered on top of a word problem, so\r
// banning visuals here would just make the questions artificial rather\r
// than harder.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as Ratio Lab's MODULE_TEST_TOTAL): calling every generator just to count\r
// would burn a random draw from each for no reason. Keep in sync with the\r
// \`questions\` array's length below if it's ever edited.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/**\r
 * A 1-5 star rating banded on the raw /20 score — lines up with A-F cutoffs\r
 * by percentage (<60/60s/70s/80s/90+), expressed as the raw score out of 20\r
 * each band lands on exactly. Same bands as Ratio Lab's module test, since\r
 * this test is also out of 20.\r
 */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 18) return 5;\r
  if (score >= 16) return 4;\r
  if (score >= 14) return 3;\r
  if (score >= 12) return 2;\r
  return 1;\r
};\r
\r
/**\r
 * Strips the diagram from a reused generator's question(s) — for questions\r
 * 12 and onward, which already restate every number the diagram would show\r
 * directly in their own prompt text, so the diagram is redundant here even\r
 * though the per-unit test this generator came from still shows it. Leaves\r
 * the per-unit *Test.tsx file untouched; only this module test's copy loses\r
 * the visual.\r
 */\r
const noVisual =\r
  (make: () => TestQuestion[]): (() => TestQuestion[]) =>\r
  () =>\r
    make().map((q) => ({ ...q, visual: null }));\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Positive & Negative Numbers in Real Life\r
    () => phraseToNumberQuestion(TEMPERATURE, "easy"),\r
    () => numberToPhraseQuestion(ELEVATION, "medium"),\r
    () => zeroMeaningQuestion(MONEY),\r
    () => phraseToNumberQuestion(MONEY, "medium"),\r
    () => numberToPhraseQuestion(TEMPERATURE, "hard"),\r
    // The Number Line with Negatives\r
    () => oppositeQuestion("medium"),\r
    oppositeOfOppositeQuestion,\r
    () => markedDistanceToOppositeQuestion("hard"),\r
    midpointOfOppositesQuestion,\r
    distanceToZeroQuestion,\r
    // The Coordinate Plane — question 11 (identifyPointQuestion) keeps its\r
    // diagram, since that question is unsolvable without it; 12 onward drop\r
    // the diagram (see noVisual above) since their prompts already restate\r
    // every number in words.\r
    identifyPointQuestion,\r
    noVisual(quadrantQuestion),\r
    noVisual(() => reflectionCoordsQuestion("y", "hard")),\r
    () => reflectionGeneralizationQuestion("x"),\r
    noVisual(() => distanceQuestion("medium")),\r
    // Comparing, Ordering & Absolute Value\r
    inequalityMeaningQuestion,\r
    noVisual(absoluteValueMeaningQuestion),\r
    sameAbsoluteValueQuestion,\r
    noVisual(smallerBalanceQuestion),\r
    noVisual(trueFalseTrapQuestion),\r
  ],\r
  // 16/20 matches the 4-star cutoff in moduleTestStars above — "passed" (the\r
  // checkmark on TestBadge, and UnitTestView's "Passed" message) means at\r
  // least 4 stars, not the full 5.\r
  passScore: 16,\r
};\r
`;export{e as default};
