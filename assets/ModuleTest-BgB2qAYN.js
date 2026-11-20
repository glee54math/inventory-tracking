const e=`import type { Unit } from "../../../shared/units/types";\r
import { sortOddOneOutQuestion, skewedRhombusQuestion, rhombusIsRectangleQuestion, squareIsRhombusQuestion, nonExclusiveQuestion } from "./AttributesOfQuadrilateralsTest";\r
import { galleryPickQuestion, lostBaselineQuestion, rotatedRectangleQuestion, trapezoidQuestion, accidentalRhombusQuestion } from "./DrawingNonExamplesTest";\r
import { stripFractionQuestion, nonCongruentEqualQuestion, judgeUnequalQuestion, reverseCountQuestion, unequalFourthsQuestion } from "./PartitioningEqualAreasTest";\r
\r
// ---------- cumulative end-of-module test: Quadrilaterals And Partitioning ----------\r
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx banks (fresh\r
// random parameters every attempt) — same reuse pattern as MG4\r
// ShapesAndFractionsIntroLab's / MM1 NegativeNumbersLab's ModuleTest.tsx.\r
// passScore and star bands are the 18/16/14/12-of-20 (90/80/70/60%) cutoffs\r
// scaled to 15 questions. Diagrams are kept: the shape IS the subject here.\r
\r
const N_UNITS = 3;\r
export const MODULE_TEST_TOTAL = N_UNITS * 5;\r
\r
/** 1-5 star rating banded on the raw /15 score. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 14) return 5;\r
  if (score >= 12) return 4;\r
  if (score >= 11) return 3;\r
  if (score >= 9) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Attributes That Define Quadrilaterals\r
    () => sortOddOneOutQuestion("hard"),\r
    () => skewedRhombusQuestion("medium"),\r
    () => rhombusIsRectangleQuestion("hard"),\r
    () => squareIsRhombusQuestion("hard"),\r
    () => nonExclusiveQuestion("hard"),\r
    // Drawing Quadrilaterals Outside the Named Kinds\r
    () => galleryPickQuestion("hard"),\r
    () => lostBaselineQuestion(Math.random() < 0.5 ? "pentagon" : "open", "medium"),\r
    () => rotatedRectangleQuestion("hard"),\r
    () => trapezoidQuestion("medium"),\r
    () => accidentalRhombusQuestion("hard"),\r
    // Partitioning into Equal Areas and Unit Fractions\r
    () => stripFractionQuestion("medium"),\r
    () => nonCongruentEqualQuestion("hard"),\r
    () => judgeUnequalQuestion("hard"),\r
    () => reverseCountQuestion("hard"),\r
    () => unequalFourthsQuestion("medium"),\r
  ],\r
  // 12/15 (80%) = the 4-star cutoff above, same convention as every other lab.\r
  passScore: 12,\r
};\r
`;export{e as default};
