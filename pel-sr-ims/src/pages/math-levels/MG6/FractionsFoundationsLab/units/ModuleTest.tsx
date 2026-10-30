import type { Unit } from "../../../shared/units/types";
import { unitFractionQuestion, nonUnitTextQuestion, buildFractionQuestion, trapQuestion, vocabularySentenceQuestion } from "./WhatAFractionIsTest";
import { identifyNonUnitQuestion, partitionCountQuestion, placeTickQuestion, beyondOneQuestion, conceptQuestion } from "./FractionsOnANumberLineTest";
import { selfEqualQuestion, wholeMultipleQuestion, writeWholeTextQuestion, notWholeTrapQuestion, generalizationTrapQuestion } from "./FractionsEqualToWholeNumbersTest";
import { recognizeQuestion, generateQuestion, nonExampleQuestion, explainQuestion, pickEquivalentQuestion } from "./EquivalentFractionsTest";
import { sameDenomQuestion, sameNumQuestion, diffWholeQuestion, equalQuestion, generalizationQuestion } from "./ComparingFractionsTest";

// ---------- cumulative end-of-module test: Fractions Foundations ----------
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx generators —
// same reuse pattern as MM1_NegativeNumbersLab's units/ModuleTest.tsx. Every
// generator is an independent random draw, so a retake is a fresh test.
// Diagrams are kept: a bar or number line IS the content of this lab at the
// 3rd-grade level, not scaffolding layered on top of it. Each unit's trap /
// non-example bucket is represented at least once.

// Hand-maintained (calling every generator just to count would burn a
// random draw from each). Keep in sync with `questions` below.
export const MODULE_TEST_TOTAL = 25;

/**
 * 1-5 star rating on the raw /25 score — the same 90/80/70/60% bands MM1's
 * 20-question module tests use (18/16/14/12 of 20), scaled to 25 and
 * rounded up: 23 / 20 / 18 / 15.
 */
export const moduleTestStars = (score: number): number => {
  if (score >= 23) return 5;
  if (score >= 20) return 4;
  if (score >= 18) return 3;
  if (score >= 15) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // What a Fraction Is
    unitFractionQuestion("medium"),
    nonUnitTextQuestion,
    buildFractionQuestion("hard"),
    trapQuestion("hard"),
    vocabularySentenceQuestion,
    // Fractions on a Number Line
    identifyNonUnitQuestion,
    partitionCountQuestion("medium"),
    placeTickQuestion("medium"),
    beyondOneQuestion("hard"),
    conceptQuestion,
    // Fractions Equal to Whole Numbers
    selfEqualQuestion,
    wholeMultipleQuestion("medium"),
    writeWholeTextQuestion,
    notWholeTrapQuestion("hard"),
    generalizationTrapQuestion,
    // Equivalent Fractions
    recognizeQuestion("medium"),
    generateQuestion("hard", false),
    nonExampleQuestion("hard"),
    explainQuestion,
    pickEquivalentQuestion,
    // Comparing Fractions
    sameDenomQuestion("medium", false),
    sameNumQuestion("hard", false),
    diffWholeQuestion("hard"),
    equalQuestion,
    generalizationQuestion,
  ],
  // 20/25 = 80%, matching the 4-star cutoff above.
  passScore: 20,
};
