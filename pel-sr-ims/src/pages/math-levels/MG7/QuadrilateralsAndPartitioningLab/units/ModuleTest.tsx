import type { Unit } from "../../../shared/units/types";
import { sortOddOneOutQuestion, skewedRhombusQuestion, rhombusIsRectangleQuestion, squareIsRhombusQuestion, nonExclusiveQuestion } from "./AttributesOfQuadrilateralsTest";
import { galleryPickQuestion, lostBaselineQuestion, rotatedRectangleQuestion, trapezoidQuestion, accidentalRhombusQuestion } from "./DrawingNonExamplesTest";
import { stripFractionQuestion, nonCongruentEqualQuestion, judgeUnequalQuestion, reverseCountQuestion, unequalFourthsQuestion } from "./PartitioningEqualAreasTest";

// ---------- cumulative end-of-module test: Quadrilaterals And Partitioning ----------
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx banks (fresh
// random parameters every attempt) — same reuse pattern as MG4
// ShapesAndFractionsIntroLab's / MM1 NegativeNumbersLab's ModuleTest.tsx.
// passScore and star bands are the 18/16/14/12-of-20 (90/80/70/60%) cutoffs
// scaled to 15 questions. Diagrams are kept: the shape IS the subject here.

const N_UNITS = 3;
export const MODULE_TEST_TOTAL = N_UNITS * 5;

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
  // 12/15 (80%) = the 4-star cutoff above, same convention as every other lab.
  passScore: 12,
};
