import type { Unit } from "../../../shared/units/types";
import { countPairsQuestion, foundAllQuestion, missingFactorQuestion, NEAR_TOP, squareCountQuestion, stopCheckingQuestion } from "./FactorPairsTest";
import { factorOrMultipleQuestion, hardMultipleChoiceQuestion, multipleOfEachFactorQuestion, nearMissChoiceQuestion, whichMultipleQuestion } from "./MultiplesTest";
import { countPrimesTo20Question, largePairQuestion, looksPrimeQuestion, oneQuestion, twoQuestion } from "./PrimeCompositeTest";
import { addNextQuestion, allEvenQuestion, multipleFeatureQuestion, shapeFarQuestion, twoStepNextQuestion } from "./NumberShapePatternsTest";

// ---------- cumulative end-of-module test: Factors, Multiples & Patterns ----------
// 20 questions, 5 reused from each unit's own *Test.tsx generators (same reuse
// pattern as every other lab's ModuleTest.tsx). Every generator is its own
// random draw, so retakes differ.

// Hand-maintained — keep in sync with `questions` below.
export const MODULE_TEST_TOTAL = 20;

/** 1-5 star rating: 18/16/14/12 cutoffs for a 20-question test. */
export const moduleTestStars = (score: number): number => {
  if (score >= 18) return 5;
  if (score >= 16) return 4;
  if (score >= 14) return 3;
  if (score >= 12) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Factor Pairs
    missingFactorQuestion,
    foundAllQuestion,
    squareCountQuestion,
    stopCheckingQuestion,
    countPairsQuestion(NEAR_TOP), // the near-100 pool, not the unit test's default
    // Multiples
    whichMultipleQuestion,
    nearMissChoiceQuestion,
    factorOrMultipleQuestion,
    hardMultipleChoiceQuestion,
    multipleOfEachFactorQuestion,
    // Prime or Composite
    oneQuestion,
    twoQuestion,
    looksPrimeQuestion,
    largePairQuestion,
    countPrimesTo20Question,
    // Number and Shape Patterns
    addNextQuestion,
    twoStepNextQuestion,
    shapeFarQuestion,
    allEvenQuestion,
    multipleFeatureQuestion,
  ],
  // 16/20 = 80%, matching the 4-star cutoff.
  passScore: 16,
};
