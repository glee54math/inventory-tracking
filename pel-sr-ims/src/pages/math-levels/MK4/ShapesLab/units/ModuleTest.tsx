import { moduleStars } from "../../../shared/engine/moduleStars";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 19,
};
