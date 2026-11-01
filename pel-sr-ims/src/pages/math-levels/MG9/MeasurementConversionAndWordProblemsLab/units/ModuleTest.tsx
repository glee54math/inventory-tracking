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

/** 1-5 star band on the /20 score: the standard 18/16/14/12 cutoffs. */
export const moduleTestStars = (score: number): number => {
  if (score >= 18) return 5;
  if (score >= 16) return 4;
  if (score >= 14) return 3;
  if (score >= 12) return 2;
  return 1;
};

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
  // 16/20 = 80%, matching the 4-star cutoff above.
  passScore: 16,
};
