const e=`import type { Unit } from "../../../shared/units/types";\r
import { unitFractionQuestion, nonUnitTextQuestion, buildFractionQuestion, trapQuestion, vocabularySentenceQuestion } from "./WhatAFractionIsTest";\r
import { identifyNonUnitQuestion, partitionCountQuestion, placeTickQuestion, beyondOneQuestion, conceptQuestion } from "./FractionsOnANumberLineTest";\r
import { selfEqualQuestion, wholeMultipleQuestion, writeWholeTextQuestion, notWholeTrapQuestion, generalizationTrapQuestion } from "./FractionsEqualToWholeNumbersTest";\r
import { recognizeQuestion, generateQuestion, nonExampleQuestion, explainQuestion, pickEquivalentQuestion } from "./EquivalentFractionsTest";\r
import { sameDenomQuestion, sameNumQuestion, diffWholeQuestion, equalQuestion, generalizationQuestion } from "./ComparingFractionsTest";\r
\r
// ---------- cumulative end-of-module test: Fractions Foundations ----------\r
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx generators —\r
// same reuse pattern as MM1_NegativeNumbersLab's units/ModuleTest.tsx. Every\r
// generator is an independent random draw, so a retake is a fresh test.\r
// Diagrams are kept: a bar or number line IS the content of this lab at the\r
// 3rd-grade level, not scaffolding layered on top of it. Each unit's trap /\r
// non-example bucket is represented at least once.\r
\r
// Hand-maintained (calling every generator just to count would burn a\r
// random draw from each). Keep in sync with \`questions\` below.\r
export const MODULE_TEST_TOTAL = 25;\r
\r
/**\r
 * 1-5 star rating on the raw /25 score — the same 90/80/70/60% bands MM1's\r
 * 20-question module tests use (18/16/14/12 of 20), scaled to 25 and\r
 * rounded up: 23 / 20 / 18 / 15.\r
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
    // What a Fraction Is\r
    unitFractionQuestion("medium"),\r
    nonUnitTextQuestion,\r
    buildFractionQuestion("hard"),\r
    trapQuestion("hard"),\r
    vocabularySentenceQuestion,\r
    // Fractions on a Number Line\r
    identifyNonUnitQuestion,\r
    partitionCountQuestion("medium"),\r
    placeTickQuestion("medium"),\r
    beyondOneQuestion("hard"),\r
    conceptQuestion,\r
    // Fractions Equal to Whole Numbers\r
    selfEqualQuestion,\r
    wholeMultipleQuestion("medium"),\r
    writeWholeTextQuestion,\r
    notWholeTrapQuestion("hard"),\r
    generalizationTrapQuestion,\r
    // Equivalent Fractions\r
    recognizeQuestion("medium"),\r
    generateQuestion("hard", false),\r
    nonExampleQuestion("hard"),\r
    explainQuestion,\r
    pickEquivalentQuestion,\r
    // Comparing Fractions\r
    sameDenomQuestion("medium", false),\r
    sameNumQuestion("hard", false),\r
    diffWholeQuestion("hard"),\r
    equalQuestion,\r
    generalizationQuestion,\r
  ],\r
  // 20/25 = 80%, matching the 4-star cutoff above.\r
  passScore: 20,\r
};\r
`;export{e as default};
