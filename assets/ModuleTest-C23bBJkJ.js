const e=`import type { Unit } from "../../../shared/units/types";\r
import { repeatedMultQuestion, baseEdgeCaseQuestion, conflationTrapQuestion } from "./ExponentsTest";\r
import { wordToExprStraightQuestion, wordToExprFlipQuestion, exprToWordQuestion, identifyPartsQuestion, parenDualQuestion } from "./WritingReadingExpressionsTest";\r
import { simpleSubQuestion, subWithExponentQuestion, multiStepQuestion, formulaQuestion, multiVariableQuestion } from "./EvaluatingExpressionsTest";\r
import { distributeExpandQuestion, distributeFactorQuestion, combineBasicQuestion, combineWithCoeffsQuestion, mixedQuestion } from "./EquivalentExpressionsPropertiesTest";\r
import { equivDistributiveQuestion, equivCombineQuestion, nonequivLookalikeQuestion, nonequivOneValueTrapQuestion, verifyWithTwoValuesQuestion } from "./IdentifyingEquivalentExpressionsTest";\r
\r
// ---------- cumulative end-of-module test: Exponents and Expressions ----------\r
// 25 questions, drawn from each of the 5 units' own *Test.tsx question banks\r
// — same reuse pattern as MM1 Ratio Lab's and Negative Numbers' own\r
// units/ModuleTest.tsx files importing individual generators from each unit\r
// test file rather than writing a fresh bank from scratch. Each generator is\r
// still its own independent random draw, so retaking the module test\r
// doesn't replay the exact same 25 questions.\r
//\r
// Deliberately weighted toward Units 2-5 (6/5/6/5 questions) over Unit 1\r
// (3 questions), per the approved plan: units 2-5 build on each other more\r
// than unit 1 (exponents) does, so the cumulative test leans harder on the\r
// skills that keep compounding (translating/naming expressions, evaluating\r
// them, generating equivalent forms, and judging equivalence) rather than\r
// spending equal weight on the more self-contained exponent-notation skill.\r
//\r
// Unlike Negative Numbers' module test, none of this lab's per-unit test\r
// questions carry a diagram (every TestQuestion here sets visual: null —\r
// expressions/words/numbers don't need one), so there's no need for a\r
// noVisual() stripping helper; nothing here would have one to strip.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as Ratio Lab's MODULE_TEST_TOTAL) — keep in sync with \`questions.length\`.\r
export const MODULE_TEST_TOTAL = 25;\r
\r
/**\r
 * A 1-5 star rating banded on the raw /25 score. Negative Numbers' module\r
 * test uses 18/16/14/12 cutoffs out of 20; scaled by 25/20 = 1.25 gives\r
 * 22.5/20/17.5/15, rounded to whole questions: 23/20/18/15.\r
 */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 23) return 5;\r
  if (score >= 20) return 4;\r
  if (score >= 18) return 3;\r
  if (score >= 15) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Exponents (3 — the least cumulative-building unit)\r
    () => repeatedMultQuestion("medium"),\r
    () => baseEdgeCaseQuestion("powerZero", "medium"),\r
    conflationTrapQuestion,\r
    // Writing & Reading Expressions (6)\r
    () => wordToExprStraightQuestion("medium"),\r
    () => wordToExprFlipQuestion("subtractFrom", "medium"),\r
    () => wordToExprFlipQuestion("dividedInto", "hard"),\r
    () => exprToWordQuestion("medium"),\r
    () => identifyPartsQuestion("termCount", "medium"),\r
    () => parenDualQuestion("hard"),\r
    // Evaluating Expressions & Order of Operations (5)\r
    () => simpleSubQuestion("medium"),\r
    () => subWithExponentQuestion("hard"),\r
    () => multiStepQuestion("hard"),\r
    () => formulaQuestion("volume", true, "hard"), // keeps the fractional s=1/2 case covered cumulatively too\r
    () => multiVariableQuestion("hard"),\r
    // Equivalent Expressions via Properties (6)\r
    () => distributeExpandQuestion("medium"),\r
    () => distributeFactorQuestion("hard"),\r
    () => combineBasicQuestion("medium"),\r
    () => combineWithCoeffsQuestion("medium"),\r
    () => mixedQuestion("hard"),\r
    () => mixedQuestion("hard"),\r
    // Identifying Equivalent Expressions (5)\r
    () => equivDistributiveQuestion("hard"),\r
    () => equivCombineQuestion("medium"),\r
    () => nonequivLookalikeQuestion("hard"),\r
    () => nonequivOneValueTrapQuestion("hard"),\r
    () => verifyWithTwoValuesQuestion("hard"),\r
  ],\r
  // 20/25 = 80%, matching the 4-star cutoff in moduleTestStars above —\r
  // "passed" (TestBadge's checkmark, UnitTestView's "Passed" message) means\r
  // at least 4 stars, same convention as Negative Numbers' module test.\r
  passScore: 20,\r
};\r
`;export{e as default};
