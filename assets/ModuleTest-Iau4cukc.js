const e=`import type { Unit } from "../../../shared/units/types";\r
import { countPairsQuestion, foundAllQuestion, missingFactorQuestion, NEAR_TOP, squareCountQuestion, stopCheckingQuestion } from "./FactorPairsTest";\r
import { factorOrMultipleQuestion, hardMultipleChoiceQuestion, multipleOfEachFactorQuestion, nearMissChoiceQuestion, whichMultipleQuestion } from "./MultiplesTest";\r
import { countPrimesTo20Question, largePairQuestion, looksPrimeQuestion, oneQuestion, twoQuestion } from "./PrimeCompositeTest";\r
import { addNextQuestion, allEvenQuestion, multipleFeatureQuestion, shapeFarQuestion, twoStepNextQuestion } from "./NumberShapePatternsTest";\r
\r
// ---------- cumulative end-of-module test: Factors, Multiples & Patterns ----------\r
// 20 questions, 5 reused from each unit's own *Test.tsx generators (same reuse\r
// pattern as every other lab's ModuleTest.tsx). Every generator is its own\r
// random draw, so retakes differ.\r
\r
// Hand-maintained — keep in sync with \`questions\` below.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/** 1-5 star rating: 18/16/14/12 cutoffs for a 20-question test. */\r
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
    // Factor Pairs\r
    missingFactorQuestion,\r
    foundAllQuestion,\r
    squareCountQuestion,\r
    stopCheckingQuestion,\r
    countPairsQuestion(NEAR_TOP), // the near-100 pool, not the unit test's default\r
    // Multiples\r
    whichMultipleQuestion,\r
    nearMissChoiceQuestion,\r
    factorOrMultipleQuestion,\r
    hardMultipleChoiceQuestion,\r
    multipleOfEachFactorQuestion,\r
    // Prime or Composite\r
    oneQuestion,\r
    twoQuestion,\r
    looksPrimeQuestion,\r
    largePairQuestion,\r
    countPrimesTo20Question,\r
    // Number and Shape Patterns\r
    addNextQuestion,\r
    twoStepNextQuestion,\r
    shapeFarQuestion,\r
    allEvenQuestion,\r
    multipleFeatureQuestion,\r
  ],\r
  // 16/20 = 80%, matching the 4-star cutoff.\r
  passScore: 16,\r
};\r
`;export{e as default};
