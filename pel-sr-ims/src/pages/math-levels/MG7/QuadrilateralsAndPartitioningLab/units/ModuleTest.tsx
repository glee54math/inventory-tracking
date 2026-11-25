import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { sortOddOneOutQuestion, skewedRhombusQuestion, rhombusIsRectangleQuestion, squareIsRhombusQuestion, nonExclusiveQuestion } from "./AttributesOfQuadrilateralsTest";
import { galleryPickQuestion, lostBaselineQuestion, rotatedRectangleQuestion, trapezoidQuestion, accidentalRhombusQuestion } from "./DrawingNonExamplesTest";
import { stripFractionQuestion, nonCongruentEqualQuestion, judgeUnequalQuestion, reverseCountQuestion, unequalFourthsQuestion } from "./PartitioningEqualAreasTest";

// ---------- cumulative end-of-module test: Quadrilaterals And Partitioning ----------
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx banks (fresh
// random parameters every attempt) — same reuse pattern as MG4
// ShapesAndFractionsIntroLab's / MM1 NegativeNumbersLab's ModuleTest.tsx.
// Stars and passing follow shared/engine/moduleStars.ts. Diagrams are kept: the shape IS the subject here.

const N_UNITS = 3;
export const MODULE_TEST_TOTAL = N_UNITS * 5;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Attributes That Define Quadrilaterals
    () => sortOddOneOutQuestion("hard"),
    () => skewedRhombusQuestion("medium"),
    () => rhombusIsRectangleQuestion("hard"),
    () => squareIsRhombusQuestion("hard"),
    () => nonExclusiveQuestion("hard"),
    // Drawing Quadrilaterals Outside the Named Kinds
    () => galleryPickQuestion("hard"),
    () => lostBaselineQuestion(Math.random() < 0.5 ? "pentagon" : "open", "medium"),
    () => rotatedRectangleQuestion("hard"),
    () => trapezoidQuestion("medium"),
    () => accidentalRhombusQuestion("hard"),
    // Partitioning into Equal Areas and Unit Fractions
    () => stripFractionQuestion("medium"),
    () => nonCongruentEqualQuestion("hard"),
    () => judgeUnequalQuestion("hard"),
    () => reverseCountQuestion("hard"),
    () => unequalFourthsQuestion("medium"),
  ],
  // Passes at 5 stars.
  passScore: 14,
};
