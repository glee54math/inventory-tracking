const e=`import type { Unit } from "../../../shared/units/types";\r
import { nameShapeStandardQuestion, nameShapeRotatedDiamondTrap, positionAboveBelowQuestion, positionVocabPrecisionQuestion, turningGeneralizationTrueFalseQuestion } from "./NamingShapesAndPositionsTest";\r
import { classify2DQuestion, classify3DQuestion, sphereVsCircleHardQuestion, nameSolidQuestion, looksCanTrickYouTrueFalseQuestion } from "./FlatOrSolidTest";\r
import { countSidesEasyQuestion, countSidesCircleQuestion, equalSidesYesQuestion, crossShapeTieQuestion, sidesCornersMatchQuestion } from "./SidesAndCornersTest";\r
import { build2DGapQuestion, build3DMissingEdgeQuestion, composeNameQuestionA, openEndedOnlyOneWayTrapQuestion, gapMisconceptionQuestion } from "./BuildingAndCombiningShapesTest";\r
\r
// ---------- cumulative end-of-module test: Shapes Lab ----------\r
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question\r
// banks — same reuse pattern as MK1 Counting & Cardinality's and MM1's own\r
// units/ModuleTest.tsx.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as every other lab's own ModuleTest.tsx) — keep in sync with \`questions.length\`.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/** 1-5 star rating banded on the raw /20 score, same cutoffs as every other\r
 *  20-question module test in this app. */\r
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
    // Naming Shapes and Positions\r
    nameShapeStandardQuestion,\r
    nameShapeRotatedDiamondTrap,\r
    positionAboveBelowQuestion,\r
    positionVocabPrecisionQuestion,\r
    turningGeneralizationTrueFalseQuestion,\r
    // Flat or Solid? (2D vs. 3D)\r
    classify2DQuestion,\r
    classify3DQuestion,\r
    sphereVsCircleHardQuestion,\r
    nameSolidQuestion,\r
    looksCanTrickYouTrueFalseQuestion,\r
    // What Makes a Shape a Shape (Sides and Corners)\r
    countSidesEasyQuestion,\r
    countSidesCircleQuestion,\r
    equalSidesYesQuestion,\r
    crossShapeTieQuestion,\r
    sidesCornersMatchQuestion,\r
    // Building and Combining Shapes\r
    build2DGapQuestion,\r
    build3DMissingEdgeQuestion,\r
    composeNameQuestionA,\r
    openEndedOnlyOneWayTrapQuestion,\r
    gapMisconceptionQuestion,\r
  ],\r
  // 16/20 matches the 4-star cutoff in moduleTestStars above.\r
  passScore: 16,\r
};\r
`;export{e as default};
