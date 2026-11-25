import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import {
  equalGroupsTotalQuestion as u1EqualGroupsTotal,
  identifyRowsQuestion,
  matchPictureQuestion,
  sameTotalSamePictureQuestion,
  rotateArrayQuestion,
} from "./WhatMultiplicationMeansTest";
import {
  commutativeTrueFalseQuestion,
  associativeGroupingQuestion,
  distributiveSplitQuestion,
  distributiveAnySplitQuestion,
  distinguishAllThreeQuestion,
} from "./PropertiesOfMultiplicationTest";
import {
  equalGroupsTotalQuestion as u3EqualGroupsTotal,
  arrayPickEquationQuestion,
  measurementQuestion,
  measurementPickEquationQuestion,
  compareQuestion,
} from "./MultiplicationWordProblemsTest";
import { hardFactQuestion, squareFactQuestion, hardFactNearMissChoiceQuestion, whichFactQuestion, catchTheMistakeQuestion } from "./OneDigitFactsFluencyTest";
import { skipAmountQuestion, ninesFactQuestion, mirrorCellQuestion, oddOddQuestion, predictPastEdgeQuestion } from "./PatternsInTheTableTest";

// ---------- cumulative end-of-module test: Multiplication Foundations ----------
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx generators —
// same reuse pattern as MM1/NegativeNumbersLab's ModuleTest.tsx. Each
// generator is its own independent random draw, so retakes differ. Diagrams
// are kept: for units 1 and 5 the picture/table IS the skill being tested.

// Hand-maintained (calling every generator just to count would burn a
// random draw) — keep in sync with the `questions` array below.
export const MODULE_TEST_TOTAL = 25;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // What Multiplication Means
    u1EqualGroupsTotal,
    identifyRowsQuestion,
    matchPictureQuestion,
    sameTotalSamePictureQuestion,
    rotateArrayQuestion,
    // Properties of Multiplication
    commutativeTrueFalseQuestion,
    associativeGroupingQuestion,
    distributiveSplitQuestion,
    distributiveAnySplitQuestion,
    distinguishAllThreeQuestion,
    // Multiplication Word Problems
    u3EqualGroupsTotal,
    arrayPickEquationQuestion,
    measurementQuestion("hard"),
    measurementPickEquationQuestion,
    compareQuestion,
    // One-Digit Facts
    hardFactQuestion,
    squareFactQuestion,
    hardFactNearMissChoiceQuestion,
    whichFactQuestion,
    catchTheMistakeQuestion,
    // Patterns in the Table
    skipAmountQuestion,
    ninesFactQuestion,
    mirrorCellQuestion,
    oddOddQuestion,
    predictPastEdgeQuestion,
  ],
  // Passes at 5 stars.
  passScore: 23,
};
