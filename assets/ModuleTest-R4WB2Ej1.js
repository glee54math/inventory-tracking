const e=`import type { Unit } from "../../../shared/units/types";\r
import { identify2dCountQuestion, cubeVs2dQuestion, multiAttributeQuestion, irregularTrapQuestion, rotationTrueFalseQuestion } from "./ClassifyingShapesByAttributesTest";\r
import { partitionTotalQuestion, addAcrossRowsQuestion, unevenTrapQuestion, reverseRowsQuestion, addRowsGeneralizationQuestion } from "./PartitioningRectanglesTest";\r
import { thirdsEqualCountQuestion, sameWholeDifferentShapeQuestion, unequalTrapThirdsQuestion, halfVsThirdSizeQuestion, halfVsThirdWhyQuestion } from "./EqualSharesOfCirclesAndRectanglesTest";\r
\r
// ---------- cumulative end-of-module test: Shapes & Equal Shares ----------\r
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx question\r
// banks — same reuse pattern as MG4 ShapesAndFractionsIntroLab's own\r
// units/ModuleTest.tsx (which itself followed MM1 NegativeNumbersLab's).\r
// Scaled down from the 20-question/4-unit default to 15 questions/3 units,\r
// proportionally: passScore and the star bands below are the 18/16/14/12-of-20\r
// cutoffs (90/80/70/60%) scaled by 15/20, rounded to the nearest whole\r
// question — identical cutoffs to MG4's own 15-question module test.\r
//\r
// Keeps every diagram and question type as-is (no stripping) — a shape or a\r
// partitioned whole IS the subject of this lab, not scaffolding on top of a\r
// word problem, so removing it would make a question unanswerable.\r
\r
export const MODULE_TEST_TOTAL = 15;\r
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
    // Classifying Shapes by Attributes\r
    () => identify2dCountQuestion("medium"),\r
    () => cubeVs2dQuestion("medium"),\r
    () => multiAttributeQuestion("hard"),\r
    () => irregularTrapQuestion("hard"),\r
    rotationTrueFalseQuestion,\r
    // Partitioning Rectangles into Rows and Columns\r
    () => partitionTotalQuestion("medium"),\r
    () => addAcrossRowsQuestion("medium"),\r
    () => unevenTrapQuestion("hard"),\r
    () => reverseRowsQuestion("hard"),\r
    addRowsGeneralizationQuestion,\r
    // Equal Shares of Circles and Rectangles\r
    () => thirdsEqualCountQuestion("medium"),\r
    sameWholeDifferentShapeQuestion,\r
    () => unequalTrapThirdsQuestion("hard"),\r
    () => halfVsThirdSizeQuestion("medium"),\r
    () => halfVsThirdWhyQuestion("hard"),\r
  ],\r
  // 12/15 (80%) matches the 4-star cutoff above — "passed" means at least 4\r
  // stars, not the full 5 — same convention as every other lab's module test.\r
  passScore: 12,\r
};\r
`;export{e as default};
