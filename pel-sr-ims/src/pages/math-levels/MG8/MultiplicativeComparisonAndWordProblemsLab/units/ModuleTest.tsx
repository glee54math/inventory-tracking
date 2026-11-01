import type { Unit } from "../../../shared/units/types";
import { sentenceToEquationQuestion, matchSentenceQuestion, equationToSentenceQuestion, otherReadingQuestion, identifyMultiplierQuestion } from "./ComparisonEquationsTest";
import { productUnknownQuestion, timesUnknownQuestion, additiveDifferenceQuestion, timesEquationQuestion, pairedStemQuestion } from "./MultVsAddComparisonTest";
import { changeQuestion, letterEquationQuestion, stepMeaningQuestion, reasonablenessQuestion, threeStepQuestion } from "./MultistepWordProblemsTest";
import { roundUpQuestion, leftoverQuestion, whatToDoQuestion, roundUpTrapQuestion, whichQuestionAddsOneQuestion } from "./InterpretingRemaindersTest";

// ---------- cumulative end-of-module test: Multiplicative Comparison & Word Problems ----------
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx generators
// (reused, not rewritten). Params are pushed toward each unit's harder end
// where a generator takes any (two-digit bases, 3-digit dividends with the
// largest possible remainder, the three-operation equation).

// Hand-maintained (calling every generator just to count would burn a random
// draw). Keep in sync with `questions` below.
export const MODULE_TEST_TOTAL = 20;

/** 1-5 star rating on the raw /20 score — the standard 18/16/14/12 bands. */
export const moduleTestStars = (score: number): number => {
  if (score >= 18) return 5;
  if (score >= 16) return 4;
  if (score >= 14) return 3;
  if (score >= 12) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Multiplicative Comparison as Equations
    () => sentenceToEquationQuestion("medium"),
    () => matchSentenceQuestion("hard"),
    () => equationToSentenceQuestion("hard"),
    () => otherReadingQuestion("hard"),
    () => identifyMultiplierQuestion("hard"),
    // Times As Many vs. More Than
    () => productUnknownQuestion("hard"),
    () => timesUnknownQuestion("hard"),
    additiveDifferenceQuestion,
    timesEquationQuestion,
    pairedStemQuestion,
    // Multistep Word Problems
    changeQuestion,
    () => letterEquationQuestion("twoProducts"),
    () => stepMeaningQuestion("divideThenAdd"),
    reasonablenessQuestion,
    threeStepQuestion,
    // Interpreting Remainders
    () => roundUpQuestion({ big: true, rMax: true }),
    () => leftoverQuestion({ big: true }),
    () => whatToDoQuestion("full"),
    roundUpTrapQuestion,
    whichQuestionAddsOneQuestion,
  ],
  // 16/20 = 80%, matching the 4-star cutoff above.
  passScore: 16,
};
