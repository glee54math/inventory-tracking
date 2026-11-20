const e=`import type { Unit } from "../../../shared/units/types";\r
import type { TestQuestion } from "../../../shared/engine/types";\r
import { bigToSmallQuestion, compareQuestion, mixedMeasureQuestion, multiplyOrDivideQuestion, tableRuleQuestion } from "./ConvertingUnitsTest";\r
import { fracStoryQuestion, mixedChoiceQuestion, mixedTypedQuestion, regroupChoiceQuestion, scaleDistanceQuestion } from "./MeasurementWordProblemsTest";\r
import { centsChangeQuestion, howManyChoiceQuestion, howManyLeftoverQuestion, moneyFormatQuestion, multiItemTotalQuestion } from "./MoneyWordProblemsTest";\r
import { areaOrPerimeterChoiceQuestion, missingAreaChoiceQuestion, missingFromPerimeterQuestion, perimeterQuestion, sameAreaChoiceQuestion } from "./AreaPerimeterFormulasTest";\r
\r
// ---------- cumulative end-of-module test: Measurement Conversion & Word Problems ----------\r
// 20 questions, 5 per unit, reusing each unit's own *Test.tsx generators\r
// (reuse, not rewrite). Each unit's slice leans medium/hard and always keeps\r
// that unit's signature misconception question (multiply-vs-divide, adding\r
// across units, money left over vs rounding up, area-vs-perimeter undo).\r
\r
// Hand-maintained — keep in sync with \`questions.length\` below.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/** 1-5 star band on the /20 score: the standard 18/16/14/12 cutoffs. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 18) return 5;\r
  if (score >= 16) return 4;\r
  if (score >= 14) return 3;\r
  if (score >= 12) return 2;\r
  return 1;\r
};\r
\r
/** Strips the diagram from a reused question — Unit 4's perimeter question\r
 *  draws the rectangle, but by then the module test has already shown\r
 *  several rectangles; the text alone states both sides. */\r
const noVisual = (make: () => TestQuestion[]) => (): TestQuestion[] => make().map((q) => ({ ...q, visual: null }));\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Unit 1 — Comparing & Converting Measurement Units\r
    bigToSmallQuestion("weight", "hard"),\r
    multiplyOrDivideQuestion,\r
    compareQuestion,\r
    mixedMeasureQuestion,\r
    tableRuleQuestion,\r
    // Unit 2 — Word Problems with Distance, Time, Volume & Mass\r
    mixedChoiceQuestion,\r
    mixedTypedQuestion("subtract"),\r
    fracStoryQuestion,\r
    scaleDistanceQuestion,\r
    regroupChoiceQuestion,\r
    // Unit 3 — Money Word Problems\r
    moneyFormatQuestion,\r
    centsChangeQuestion,\r
    multiItemTotalQuestion,\r
    howManyLeftoverQuestion,\r
    howManyChoiceQuestion,\r
    // Unit 4 — Area & Perimeter Formulas in Context\r
    noVisual(perimeterQuestion),\r
    areaOrPerimeterChoiceQuestion,\r
    missingAreaChoiceQuestion,\r
    missingFromPerimeterQuestion,\r
    sameAreaChoiceQuestion,\r
  ],\r
  // 16/20 = 80%, matching the 4-star cutoff above.\r
  passScore: 16,\r
};\r
`;export{e as default};
