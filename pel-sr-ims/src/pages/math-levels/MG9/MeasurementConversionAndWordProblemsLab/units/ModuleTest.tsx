import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import type { TestQuestion } from "../../../shared/engine/types";
import { bigToSmallQuestion, compareQuestion, mixedMeasureQuestion, multiplyOrDivideQuestion, tableRuleQuestion } from "./ConvertingUnitsTest";
import { fracStoryQuestion, mixedChoiceQuestion, mixedTypedQuestion, regroupChoiceQuestion, scaleDistanceQuestion } from "./MeasurementWordProblemsTest";
import { centsChangeQuestion, howManyChoiceQuestion, howManyLeftoverQuestion, moneyFormatQuestion, multiItemTotalQuestion } from "./MoneyWordProblemsTest";
import { areaOrPerimeterChoiceQuestion, missingAreaChoiceQuestion, missingFromPerimeterQuestion, perimeterQuestion, sameAreaChoiceQuestion } from "./AreaPerimeterFormulasTest";

// ---------- cumulative end-of-module test: Measurement Conversion & Word Problems ----------
// 20 questions, 5 per unit, reusing each unit's own *Test.tsx generators
// (reuse, not rewrite). Each unit's slice leans medium/hard and always keeps
// that unit's signature misconception question (multiply-vs-divide, adding
// across units, money left over vs rounding up, area-vs-perimeter undo).

// Hand-maintained — keep in sync with `questions.length` below.
export const MODULE_TEST_TOTAL = 20;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

/** Strips the diagram from a reused question — Unit 4's perimeter question
 *  draws the rectangle, but by then the module test has already shown
 *  several rectangles; the text alone states both sides. */
const noVisual = (make: () => TestQuestion[]) => (): TestQuestion[] => make().map((q) => ({ ...q, visual: null }));

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Unit 1 — Comparing & Converting Measurement Units
    bigToSmallQuestion("weight", "hard"),
    multiplyOrDivideQuestion,
    compareQuestion,
    mixedMeasureQuestion,
    tableRuleQuestion,
    // Unit 2 — Word Problems with Distance, Time, Volume & Mass
    mixedChoiceQuestion,
    mixedTypedQuestion("subtract"),
    fracStoryQuestion,
    scaleDistanceQuestion,
    regroupChoiceQuestion,
    // Unit 3 — Money Word Problems
    moneyFormatQuestion,
    centsChangeQuestion,
    multiItemTotalQuestion,
    howManyLeftoverQuestion,
    howManyChoiceQuestion,
    // Unit 4 — Area & Perimeter Formulas in Context
    noVisual(perimeterQuestion),
    areaOrPerimeterChoiceQuestion,
    missingAreaChoiceQuestion,
    missingFromPerimeterQuestion,
    sameAreaChoiceQuestion,
  ],
  // Passes at 5 stars.
  passScore: 19,
};
