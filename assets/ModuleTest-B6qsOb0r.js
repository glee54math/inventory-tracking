const e=`import type { Unit } from "../../../shared/units/types";\r
import type { TestQuestion } from "../../../shared/engine/types";\r
import { LONG, PRIMES } from "../lib/primes";\r
import { parensLastQuestion, samQuestion, storyQuestion, storyValueQuestion, subDivQuestion } from "./WhyParenthesesTest";\r
import { collapsedQuestion, nestedValueQuestion, outermostQuestion, symbolNameQuestion } from "./NestedGroupsTest";\r
import { buildExprQuestion, changeQuestion, exprToWordsQuestion, timesAsLargeQuestion, whichLargerQuestion } from "./ReadingExpressionsTest";\r
import { judgeQuestion, notFinishedQuestion, primeFactorsQuestion, sameEndQuestion } from "./PrimeFactorsTest";\r
import { pairQuestion, plotQuestion, relationQuestion, timesTrapQuestion } from "./PatternsTest";\r
\r
// ---------- cumulative end-of-module test: Numerical Expressions & Patterns ----------\r
// 25 questions, 5 reused from each unit's own *Test.tsx generators (same\r
// reuse pattern as every other lab's ModuleTest.tsx), called with different\r
// parameters than the unit tests where that adds variety. Each generator is\r
// an independent random draw, so a retake never replays the same 25.\r
\r
/** Hand-maintained (calling every generator to count would burn a random draw). */\r
export const MODULE_TEST_TOTAL = 25;\r
\r
/** 1-5 stars on the /25 score: the 18/16/14/12-of-20 bands scaled to 25 and\r
 *  rounded up — 23 / 20 / 18 / 15, identical to the other 25-question module tests. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 23) return 5;\r
  if (score >= 20) return 4;\r
  if (score >= 18) return 3;\r
  if (score >= 15) return 2;\r
  return 1;\r
};\r
\r
/** Strips the picture from a reused question whose diagram would only repeat the one just before it. */\r
const noVisual = (make: () => TestQuestion[]) => () => make().map((q) => ({ ...q, visual: null }));\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Why we need parentheses\r
    () => storyQuestion("medium", "each"),\r
    () => parensLastQuestion("medium", ["×", "+"]),\r
    () => subDivQuestion("medium", "÷"),\r
    () => samQuestion("hard"),\r
    () => storyValueQuestion("hard"),\r
    // Brackets and braces\r
    () => symbolNameQuestion("easy"),\r
    () => nestedValueQuestion("medium", "two"),\r
    () => nestedValueQuestion("hard", "three"),\r
    () => outermostQuestion("medium"),\r
    noVisual(() => collapsedQuestion("hard")),\r
    // Reading an expression without solving it\r
    // A build item: the student writes the expression (round 2, C2-08). Any of the 6 word templates.\r
    () => buildExprQuestion("medium"),\r
    () => exprToWordsQuestion("medium"),\r
    () => timesAsLargeQuestion("medium", "plain"),\r
    () => whichLargerQuestion("hard"),\r
    () => changeQuestion("medium"),\r
    // Prime factors\r
    () => primeFactorsQuestion("medium", LONG),\r
    () => primeFactorsQuestion("medium", PRIMES),\r
    () => sameEndQuestion("medium"),\r
    () => judgeQuestion("hard"),\r
    () => notFinishedQuestion("medium"),\r
    // Two rules, two patterns\r
    () => relationQuestion("medium", "times"),\r
    () => relationQuestion("medium", "more"),\r
    () => pairQuestion("medium"),\r
    () => plotQuestion("hard"),\r
    () => timesTrapQuestion("hard"),\r
  ],\r
  // 20/25 = 80%, the 4-star cutoff above.\r
  passScore: 20,\r
};\r
`;export{e as default};
