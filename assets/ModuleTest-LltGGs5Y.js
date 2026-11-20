const e=`import type { Unit } from "../../../shared/units/types";\r
import { sentenceToEquationQuestion, matchSentenceQuestion, equationToSentenceQuestion, otherReadingQuestion, identifyMultiplierQuestion } from "./ComparisonEquationsTest";\r
import { productUnknownQuestion, timesUnknownQuestion, additiveDifferenceQuestion, timesEquationQuestion, pairedStemQuestion } from "./MultVsAddComparisonTest";\r
import { changeQuestion, letterEquationQuestion, stepMeaningQuestion, reasonablenessQuestion, threeStepQuestion } from "./MultistepWordProblemsTest";\r
import { roundUpQuestion, leftoverQuestion, whatToDoQuestion, roundUpTrapQuestion, whichQuestionAddsOneQuestion } from "./InterpretingRemaindersTest";\r
\r
// ---------- cumulative end-of-module test: Multiplicative Comparison & Word Problems ----------\r
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx generators\r
// (reused, not rewritten). Params are pushed toward each unit's harder end\r
// where a generator takes any (two-digit bases, 3-digit dividends with the\r
// largest possible remainder, the three-operation equation).\r
\r
// Hand-maintained (calling every generator just to count would burn a random\r
// draw). Keep in sync with \`questions\` below.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/** 1-5 star rating on the raw /20 score — the standard 18/16/14/12 bands. */\r
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
    // Multiplicative Comparison as Equations\r
    () => sentenceToEquationQuestion("medium"),\r
    () => matchSentenceQuestion("hard"),\r
    () => equationToSentenceQuestion("hard"),\r
    () => otherReadingQuestion("hard"),\r
    () => identifyMultiplierQuestion("hard"),\r
    // Times As Many vs. More Than\r
    () => productUnknownQuestion("hard"),\r
    () => timesUnknownQuestion("hard"),\r
    additiveDifferenceQuestion,\r
    timesEquationQuestion,\r
    pairedStemQuestion,\r
    // Multistep Word Problems\r
    changeQuestion,\r
    () => letterEquationQuestion("twoProducts"),\r
    () => stepMeaningQuestion("divideThenAdd"),\r
    reasonablenessQuestion,\r
    threeStepQuestion,\r
    // Interpreting Remainders\r
    () => roundUpQuestion({ big: true, rMax: true }),\r
    () => leftoverQuestion({ big: true }),\r
    () => whatToDoQuestion("full"),\r
    roundUpTrapQuestion,\r
    whichQuestionAddsOneQuestion,\r
  ],\r
  // 16/20 = 80%, matching the 4-star cutoff above.\r
  passScore: 16,\r
};\r
`;export{e as default};
