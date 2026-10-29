import type { Unit } from "../../../shared/units/types";
import { nameShapeStandardQuestion, nameShapeRotatedDiamondTrap, positionAboveBelowQuestion, positionVocabPrecisionQuestion, turningGeneralizationTrueFalseQuestion } from "./NamingShapesAndPositionsTest";
import { classify2DQuestion, classify3DQuestion, sphereVsCircleHardQuestion, nameSolidQuestion, looksCanTrickYouTrueFalseQuestion } from "./FlatOrSolidTest";
import { countSidesEasyQuestion, countSidesCircleQuestion, equalSidesYesQuestion, crossShapeTieQuestion, sidesCornersMatchQuestion } from "./SidesAndCornersTest";
import { build2DGapQuestion, build3DMissingEdgeQuestion, composeNameQuestionA, openEndedOnlyOneWayTrapQuestion, gapMisconceptionQuestion } from "./BuildingAndCombiningShapesTest";

// ---------- cumulative end-of-module test: Shapes Lab ----------
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question
// banks — same reuse pattern as MK1 Counting & Cardinality's and MM1's own
// units/ModuleTest.tsx.

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own ModuleTest.tsx) — keep in sync with `questions.length`.
export const MODULE_TEST_TOTAL = 20;

/** 1-5 star rating banded on the raw /20 score, same cutoffs as every other
 *  20-question module test in this app. */
export const moduleTestStars = (score: number): number => {
  if (score >= 18) return 5;
  if (score >= 16) return 4;
  if (score >= 14) return 3;
  if (score >= 12) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Naming Shapes and Positions
    nameShapeStandardQuestion,
    nameShapeRotatedDiamondTrap,
    positionAboveBelowQuestion,
    positionVocabPrecisionQuestion,
    turningGeneralizationTrueFalseQuestion,
    // Flat or Solid? (2D vs. 3D)
    classify2DQuestion,
    classify3DQuestion,
    sphereVsCircleHardQuestion,
    nameSolidQuestion,
    looksCanTrickYouTrueFalseQuestion,
    // What Makes a Shape a Shape (Sides and Corners)
    countSidesEasyQuestion,
    countSidesCircleQuestion,
    equalSidesYesQuestion,
    crossShapeTieQuestion,
    sidesCornersMatchQuestion,
    // Building and Combining Shapes
    build2DGapQuestion,
    build3DMissingEdgeQuestion,
    composeNameQuestionA,
    openEndedOnlyOneWayTrapQuestion,
    gapMisconceptionQuestion,
  ],
  // 16/20 matches the 4-star cutoff in moduleTestStars above.
  passScore: 16,
};
