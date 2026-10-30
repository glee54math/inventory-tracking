import type { Unit } from "../../../shared/units/types";
import { identify2dCountQuestion, cubeVs2dQuestion, multiAttributeQuestion, irregularTrapQuestion, rotationTrueFalseQuestion } from "./ClassifyingShapesByAttributesTest";
import { partitionTotalQuestion, addAcrossRowsQuestion, unevenTrapQuestion, reverseRowsQuestion, addRowsGeneralizationQuestion } from "./PartitioningRectanglesTest";
import { thirdsEqualCountQuestion, sameWholeDifferentShapeQuestion, unequalTrapThirdsQuestion, halfVsThirdSizeQuestion, halfVsThirdWhyQuestion } from "./EqualSharesOfCirclesAndRectanglesTest";

// ---------- cumulative end-of-module test: Shapes & Equal Shares ----------
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx question
// banks — same reuse pattern as MG4 ShapesAndFractionsIntroLab's own
// units/ModuleTest.tsx (which itself followed MM1 NegativeNumbersLab's).
// Scaled down from the 20-question/4-unit default to 15 questions/3 units,
// proportionally: passScore and the star bands below are the 18/16/14/12-of-20
// cutoffs (90/80/70/60%) scaled by 15/20, rounded to the nearest whole
// question — identical cutoffs to MG4's own 15-question module test.
//
// Keeps every diagram and question type as-is (no stripping) — a shape or a
// partitioned whole IS the subject of this lab, not scaffolding on top of a
// word problem, so removing it would make a question unanswerable.

export const MODULE_TEST_TOTAL = 15;

/** 1-5 star rating banded on the raw /15 score. */
export const moduleTestStars = (score: number): number => {
  if (score >= 14) return 5;
  if (score >= 12) return 4;
  if (score >= 11) return 3;
  if (score >= 9) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Classifying Shapes by Attributes
    () => identify2dCountQuestion("medium"),
    () => cubeVs2dQuestion("medium"),
    () => multiAttributeQuestion("hard"),
    () => irregularTrapQuestion("hard"),
    rotationTrueFalseQuestion,
    // Partitioning Rectangles into Rows and Columns
    () => partitionTotalQuestion("medium"),
    () => addAcrossRowsQuestion("medium"),
    () => unevenTrapQuestion("hard"),
    () => reverseRowsQuestion("hard"),
    addRowsGeneralizationQuestion,
    // Equal Shares of Circles and Rectangles
    () => thirdsEqualCountQuestion("medium"),
    sameWholeDifferentShapeQuestion,
    () => unequalTrapThirdsQuestion("hard"),
    () => halfVsThirdSizeQuestion("medium"),
    () => halfVsThirdWhyQuestion("hard"),
  ],
  // 12/15 (80%) matches the 4-star cutoff above — "passed" means at least 4
  // stars, not the full 5 — same convention as every other lab's module test.
  passScore: 12,
};
