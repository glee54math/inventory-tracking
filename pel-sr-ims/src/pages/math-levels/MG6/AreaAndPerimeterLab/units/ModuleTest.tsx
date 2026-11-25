import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { fullGridQuestion, partialGridQuestion, areaNotPerimeterQuestion, rectilinearQuestion, sameAreaChoiceQuestion } from "./UnderstandingAreaAsTilingTest";
import { directMultiplyQuestion, multiplyNotAddQuestion, missingSideQuestion as missingFactorQuestion, wordProblemQuestion, missingSideWordQuestion } from "./AreaMultiplyingSideLengthsTest";
import { splitTotalQuestion, matchSplitQuestion, friendlySplitQuestion, twoSplitsQuestion, joinedRectanglesQuestion } from "./AreaDistributivePropertyTest";
import { lShapeQuestion, additiveChoiceQuestion, staircaseQuestion, subtractQuestion, missingSideAreaQuestion } from "./CompositeRectilinearAreasTest";
import { rectangleShortcutQuestion, missingSideQuestion as missingPerimeterSideQuestion, missingRectangleSideQuestion, samePerimeterQuestion, discriminateQuestion } from "./PerimeterTest";

// ---------- cumulative end-of-module test: Area & Perimeter ----------
// 25 questions, 5 per unit, drawn from each unit's own *Test.tsx generators
// (same reuse pattern as MM1_ExponentsAndExpressionsLab's ModuleTest.tsx).
// Every generator is its own independent random draw, so a retake never
// replays the same 25 questions. Within each unit the mix leans medium/hard
// and always includes that unit's area-vs-perimeter (or wrong-dimension)
// misconception question, since that's the thread running through the lab.

// Hand-maintained — keep in sync with `questions.length` below.
export const MODULE_TEST_TOTAL = 25;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Unit 1 — Understanding Area as Tiling
    fullGridQuestion("medium"),
    partialGridQuestion,
    areaNotPerimeterQuestion,
    rectilinearQuestion("hard"),
    sameAreaChoiceQuestion,
    // Unit 2 — Area = Multiplying Side Lengths
    directMultiplyQuestion("medium"),
    multiplyNotAddQuestion,
    missingFactorQuestion("hard"),
    wordProblemQuestion("hard"),
    missingSideWordQuestion,
    // Unit 3 — Area and the Distributive Property
    splitTotalQuestion("medium"),
    matchSplitQuestion,
    friendlySplitQuestion("hard"),
    twoSplitsQuestion,
    joinedRectanglesQuestion,
    // Unit 4 — Composite and Rectilinear Areas
    lShapeQuestion("medium"),
    additiveChoiceQuestion,
    staircaseQuestion("hard"),
    subtractQuestion("hard"),
    missingSideAreaQuestion,
    // Unit 5 — Perimeter
    rectangleShortcutQuestion("medium"),
    missingPerimeterSideQuestion("hard"),
    missingRectangleSideQuestion,
    samePerimeterQuestion,
    discriminateQuestion,
  ],
  // Passes at 5 stars.
  passScore: 23,
};
