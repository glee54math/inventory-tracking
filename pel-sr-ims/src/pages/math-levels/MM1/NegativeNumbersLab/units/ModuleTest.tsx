import type { Unit } from "../../../shared/units/types";
import type { TestQuestion } from "../../../shared/engine/types";
import { phraseToNumberQuestion, numberToPhraseQuestion, zeroMeaningQuestion, TEMPERATURE, ELEVATION, MONEY } from "./RealWorldNegativesTest";
import { oppositeQuestion, oppositeOfOppositeQuestion, markedDistanceToOppositeQuestion, midpointOfOppositesQuestion, distanceToZeroQuestion } from "./NumberLineUnitTest";
import { identifyPointQuestion, quadrantQuestion, reflectionCoordsQuestion, reflectionGeneralizationQuestion, distanceQuestion } from "./CoordinatePlaneUnitTest";
import { inequalityMeaningQuestion, absoluteValueMeaningQuestion, sameAbsoluteValueQuestion, smallerBalanceQuestion, trueFalseTrapQuestion } from "./ComparingOrderingTest";

// ---------- cumulative end-of-module test: Negative Numbers ----------
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question
// banks — same reuse pattern as MM1 Ratio Lab's units/ModuleTest.tsx
// importing individual generators from each unit test file, rather than
// writing a fresh 20-question bank from scratch. Each generator is still
// its own independent random draw, so retaking the module test doesn't
// replay the exact same 20 questions.
//
// Unlike Ratio Lab's module test, this one does NOT exclude diagrams or
// multiple-choice steps — a number line / coordinate plane diagram is
// intrinsic to this lab's own skills (reading a point, reflecting it,
// naming a quadrant), not scaffolding layered on top of a word problem, so
// banning visuals here would just make the questions artificial rather
// than harder.

// Hand-maintained rather than computed from the array below (same reasoning
// as Ratio Lab's MODULE_TEST_TOTAL): calling every generator just to count
// would burn a random draw from each for no reason. Keep in sync with the
// `questions` array's length below if it's ever edited.
export const MODULE_TEST_TOTAL = 20;

/**
 * A 1-5 star rating banded on the raw /20 score — lines up with A-F cutoffs
 * by percentage (<60/60s/70s/80s/90+), expressed as the raw score out of 20
 * each band lands on exactly. Same bands as Ratio Lab's module test, since
 * this test is also out of 20.
 */
export const moduleTestStars = (score: number): number => {
  if (score >= 18) return 5;
  if (score >= 16) return 4;
  if (score >= 14) return 3;
  if (score >= 12) return 2;
  return 1;
};

/**
 * Strips the diagram from a reused generator's question(s) — for questions
 * 12 and onward, which already restate every number the diagram would show
 * directly in their own prompt text, so the diagram is redundant here even
 * though the per-unit test this generator came from still shows it. Leaves
 * the per-unit *Test.tsx file untouched; only this module test's copy loses
 * the visual.
 */
const noVisual =
  (make: () => TestQuestion[]): (() => TestQuestion[]) =>
  () =>
    make().map((q) => ({ ...q, visual: null }));

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Positive & Negative Numbers in Real Life
    () => phraseToNumberQuestion(TEMPERATURE, "easy"),
    () => numberToPhraseQuestion(ELEVATION, "medium"),
    () => zeroMeaningQuestion(MONEY),
    () => phraseToNumberQuestion(MONEY, "medium"),
    () => numberToPhraseQuestion(TEMPERATURE, "hard"),
    // The Number Line with Negatives
    () => oppositeQuestion("medium"),
    oppositeOfOppositeQuestion,
    () => markedDistanceToOppositeQuestion("hard"),
    midpointOfOppositesQuestion,
    distanceToZeroQuestion,
    // The Coordinate Plane — question 11 (identifyPointQuestion) keeps its
    // diagram, since that question is unsolvable without it; 12 onward drop
    // the diagram (see noVisual above) since their prompts already restate
    // every number in words.
    identifyPointQuestion,
    noVisual(quadrantQuestion),
    noVisual(() => reflectionCoordsQuestion("y", "hard")),
    () => reflectionGeneralizationQuestion("x"),
    noVisual(() => distanceQuestion("medium")),
    // Comparing, Ordering & Absolute Value
    inequalityMeaningQuestion,
    noVisual(absoluteValueMeaningQuestion),
    sameAbsoluteValueQuestion,
    noVisual(smallerBalanceQuestion),
    noVisual(trueFalseTrapQuestion),
  ],
  // 16/20 matches the 4-star cutoff in moduleTestStars above — "passed" (the
  // checkmark on TestBadge, and UnitTestView's "Passed" message) means at
  // least 4 stars, not the full 5.
  passScore: 16,
};
