import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { identify2dCountQuestion, cubeVs2dQuestion, multiAttributeQuestion, irregularTrapQuestion, rotationTrueFalseQuestion } from "./ClassifyingShapesByAttributesTest";
import { partitionTotalQuestion, addAcrossRowsQuestion, unevenTrapQuestion, reverseRowsQuestion, addRowsGeneralizationQuestion } from "./PartitioningRectanglesTest";
import { thirdsEqualCountQuestion, sameWholeDifferentShapeQuestion, unequalTrapThirdsQuestion, halfVsThirdSizeQuestion, halfVsThirdWhyQuestion } from "./EqualSharesOfCirclesAndRectanglesTest";

// ---------- cumulative end-of-module test: Shapes & Equal Shares ----------
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx question
// banks — same reuse pattern as MG4 ShapesAndFractionsIntroLab's own
// units/ModuleTest.tsx (which itself followed MM1 NegativeNumbersLab's).
// Stars and passing follow the shared rule in shared/engine/moduleStars.ts.
//
// Keeps every diagram and question type as-is (no stripping) — a shape or a
// partitioned whole IS the subject of this lab, not scaffolding on top of a
// word problem, so removing it would make a question unanswerable.

export const MODULE_TEST_TOTAL = 15;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 14,
};
