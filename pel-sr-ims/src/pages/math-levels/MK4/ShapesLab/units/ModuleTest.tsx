import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { realObjectShapeQuestion, nameShapeRotatedDiamondTrap, positionAboveBelowQuestion, positionVocabPrecisionQuestion, turnedShapeQuestion } from "./NamingShapesAndPositionsTest";
import { classify2DSecondQuestion, squareVsCubeHardQuestion, realObjectSolidQuestion, nameSolidQuestion, roundShapeQuestion } from "./FlatOrSolidTest";
import { countSidesEasyQuestion, countCornersCircleQuestion, equalSidesYesQuestion, crossShapeTieQuestion, sidesCornersMatchQuestion } from "./SidesAndCornersTest";
import { build2DGapQuestion, build3DMissingEdgeQuestion, composeNameQuestionA, openEndedOnlyOneWayTrapQuestion, gapMisconceptionQuestion } from "./BuildingAndCombiningShapesTest";
import { inAnyOrder } from "./labParts";

// ---------- cumulative end-of-module test: Shapes Lab ----------
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx question
// banks — same reuse pattern as MK1 Counting & Cardinality's and MM1's own
// units/ModuleTest.tsx. The units stay in order; each unit's 5 come in a new
// order every sitting (review C1-07). Every question has a picture (the
// round-1 true/false and no-picture items were replaced in the unit Tests).

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own ModuleTest.tsx) — keep in sync with the question count.
export const MODULE_TEST_TOTAL = 20;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Name It. Where Is It?
    ...inAnyOrder([realObjectShapeQuestion, nameShapeRotatedDiamondTrap, positionAboveBelowQuestion, positionVocabPrecisionQuestion, turnedShapeQuestion]),
    // Flat or Solid?
    ...inAnyOrder([classify2DSecondQuestion, squareVsCubeHardQuestion, realObjectSolidQuestion, nameSolidQuestion, roundShapeQuestion]),
    // Sides and Corners
    ...inAnyOrder([countSidesEasyQuestion, countCornersCircleQuestion, equalSidesYesQuestion, crossShapeTieQuestion, sidesCornersMatchQuestion]),
    // Build Shapes
    ...inAnyOrder([build2DGapQuestion, build3DMissingEdgeQuestion, composeNameQuestionA, openEndedOnlyOneWayTrapQuestion, gapMisconceptionQuestion]),
  ],
  // Passes at 5 stars.
  passScore: 19,
};
