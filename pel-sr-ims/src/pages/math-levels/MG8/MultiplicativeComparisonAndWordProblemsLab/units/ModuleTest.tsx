import { moduleStars } from "../../../shared/engine/moduleStars";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 19,
};
