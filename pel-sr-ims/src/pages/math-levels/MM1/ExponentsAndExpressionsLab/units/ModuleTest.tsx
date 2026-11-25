import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { repeatedMultQuestion, baseEdgeCaseQuestion, conflationTrapQuestion } from "./ExponentsTest";
import { wordToExprStraightQuestion, wordToExprFlipQuestion, exprToWordQuestion, identifyPartsQuestion, parenDualQuestion } from "./WritingReadingExpressionsTest";
import { simpleSubQuestion, subWithExponentQuestion, multiStepQuestion, formulaQuestion, multiVariableQuestion } from "./EvaluatingExpressionsTest";
import { distributeExpandQuestion, distributeFactorQuestion, combineBasicQuestion, combineWithCoeffsQuestion, mixedQuestion } from "./EquivalentExpressionsPropertiesTest";
import { equivDistributiveQuestion, equivCombineQuestion, nonequivLookalikeQuestion, nonequivOneValueTrapQuestion, verifyWithTwoValuesQuestion } from "./IdentifyingEquivalentExpressionsTest";

// ---------- cumulative end-of-module test: Exponents and Expressions ----------
// 25 questions, drawn from each of the 5 units' own *Test.tsx question banks
// — same reuse pattern as MM1 Ratio Lab's and Negative Numbers' own
// units/ModuleTest.tsx files importing individual generators from each unit
// test file rather than writing a fresh bank from scratch. Each generator is
// still its own independent random draw, so retaking the module test
// doesn't replay the exact same 25 questions.
//
// Deliberately weighted toward Units 2-5 (6/5/6/5 questions) over Unit 1
// (3 questions), per the approved plan: units 2-5 build on each other more
// than unit 1 (exponents) does, so the cumulative test leans harder on the
// skills that keep compounding (translating/naming expressions, evaluating
// them, generating equivalent forms, and judging equivalence) rather than
// spending equal weight on the more self-contained exponent-notation skill.
//
// Unlike Negative Numbers' module test, none of this lab's per-unit test
// questions carry a diagram (every TestQuestion here sets visual: null —
// expressions/words/numbers don't need one), so there's no need for a
// noVisual() stripping helper; nothing here would have one to strip.

// Hand-maintained rather than computed from the array below (same reasoning
// as Ratio Lab's MODULE_TEST_TOTAL) — keep in sync with `questions.length`.
export const MODULE_TEST_TOTAL = 25;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Exponents (3 — the least cumulative-building unit)
    () => repeatedMultQuestion("medium"),
    () => baseEdgeCaseQuestion("powerZero", "medium"),
    conflationTrapQuestion,
    // Writing & Reading Expressions (6)
    () => wordToExprStraightQuestion("medium"),
    () => wordToExprFlipQuestion("subtractFrom", "medium"),
    () => wordToExprFlipQuestion("dividedInto", "hard"),
    () => exprToWordQuestion("medium"),
    () => identifyPartsQuestion("termCount", "medium"),
    () => parenDualQuestion("hard"),
    // Evaluating Expressions & Order of Operations (5)
    () => simpleSubQuestion("medium"),
    () => subWithExponentQuestion("hard"),
    () => multiStepQuestion("hard"),
    () => formulaQuestion("volume", true, "hard"), // keeps the fractional s=1/2 case covered cumulatively too
    () => multiVariableQuestion("hard"),
    // Equivalent Expressions via Properties (6)
    () => distributeExpandQuestion("medium"),
    () => distributeFactorQuestion("hard"),
    () => combineBasicQuestion("medium"),
    () => combineWithCoeffsQuestion("medium"),
    () => mixedQuestion("hard"),
    () => mixedQuestion("hard"),
    // Identifying Equivalent Expressions (5)
    () => equivDistributiveQuestion("hard"),
    () => equivCombineQuestion("medium"),
    () => nonequivLookalikeQuestion("hard"),
    () => nonequivOneValueTrapQuestion("hard"),
    () => verifyWithTwoValuesQuestion("hard"),
  ],
  // Passes at 5 stars.
  passScore: 23,
};
