import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import type { TestQuestion } from "../../../shared/engine/types";
import { LONG, PRIMES } from "../lib/primes";
import { parensLastQuestion, samQuestion, storyQuestion, storyValueQuestion, subDivQuestion } from "./WhyParenthesesTest";
import { collapsedQuestion, nestedValueQuestion, outermostQuestion, symbolNameQuestion } from "./NestedGroupsTest";
import { buildExprQuestion, changeQuestion, exprToWordsQuestion, timesAsLargeQuestion, whichLargerQuestion } from "./ReadingExpressionsTest";
import { judgeQuestion, notFinishedQuestion, primeFactorsQuestion, sameEndQuestion } from "./PrimeFactorsTest";
import { pairQuestion, plotQuestion, relationQuestion, timesTrapQuestion } from "./PatternsTest";

// ---------- cumulative end-of-module test: Numerical Expressions & Patterns ----------
// 25 questions, 5 reused from each unit's own *Test.tsx generators (same
// reuse pattern as every other lab's ModuleTest.tsx), called with different
// parameters than the unit tests where that adds variety. Each generator is
// an independent random draw, so a retake never replays the same 25.

/** Hand-maintained (calling every generator to count would burn a random draw). */
export const MODULE_TEST_TOTAL = 25;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

/** Strips the picture from a reused question whose diagram would only repeat the one just before it. */
const noVisual = (make: () => TestQuestion[]) => () => make().map((q) => ({ ...q, visual: null }));

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Why we need parentheses
    () => storyQuestion("medium", "each"),
    () => parensLastQuestion("medium", ["×", "+"]),
    () => subDivQuestion("medium", "÷"),
    () => samQuestion("hard"),
    () => storyValueQuestion("hard"),
    // Brackets and braces
    () => symbolNameQuestion("easy"),
    () => nestedValueQuestion("medium", "two"),
    () => nestedValueQuestion("hard", "three"),
    () => outermostQuestion("medium"),
    noVisual(() => collapsedQuestion("hard")),
    // Reading an expression without solving it
    // A build item: the student writes the expression (round 2, C2-08). Any of the 6 word templates.
    () => buildExprQuestion("medium"),
    () => exprToWordsQuestion("medium"),
    () => timesAsLargeQuestion("medium", "plain"),
    () => whichLargerQuestion("hard"),
    () => changeQuestion("medium"),
    // Prime factors
    () => primeFactorsQuestion("medium", LONG),
    () => primeFactorsQuestion("medium", PRIMES),
    () => sameEndQuestion("medium"),
    () => judgeQuestion("hard"),
    () => notFinishedQuestion("medium"),
    // Two rules, two patterns
    () => relationQuestion("medium", "times"),
    () => relationQuestion("medium", "more"),
    () => pairQuestion("medium"),
    () => plotQuestion("hard"),
    () => timesTrapQuestion("hard"),
  ],
  // Passes at 5 stars.
  passScore: 23,
};
