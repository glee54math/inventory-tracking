const t=`import type { Unit } from "../../../shared/units/types";\r
import {\r
  equalGroupsTotalQuestion as u1EqualGroupsTotal,\r
  identifyRowsQuestion,\r
  matchPictureQuestion,\r
  sameTotalSamePictureQuestion,\r
  rotateArrayQuestion,\r
} from "./WhatMultiplicationMeansTest";\r
import {\r
  commutativeTrueFalseQuestion,\r
  associativeGroupingQuestion,\r
  distributiveSplitQuestion,\r
  distributiveAnySplitQuestion,\r
  distinguishAllThreeQuestion,\r
} from "./PropertiesOfMultiplicationTest";\r
import {\r
  equalGroupsTotalQuestion as u3EqualGroupsTotal,\r
  arrayPickEquationQuestion,\r
  measurementQuestion,\r
  measurementPickEquationQuestion,\r
  compareQuestion,\r
} from "./MultiplicationWordProblemsTest";\r
import { hardFactQuestion, squareFactQuestion, hardFactNearMissChoiceQuestion, whichFactQuestion, catchTheMistakeQuestion } from "./OneDigitFactsFluencyTest";\r
import { skipAmountQuestion, ninesFactQuestion, mirrorCellQuestion, oddOddQuestion, predictPastEdgeQuestion } from "./PatternsInTheTableTest";\r
\r
// ---------- cumulative end-of-module test: Multiplication Foundations ----------\r
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx generators —\r
// same reuse pattern as MM1/NegativeNumbersLab's ModuleTest.tsx. Each\r
// generator is its own independent random draw, so retakes differ. Diagrams\r
// are kept: for units 1 and 5 the picture/table IS the skill being tested.\r
\r
// Hand-maintained (calling every generator just to count would burn a\r
// random draw) — keep in sync with the \`questions\` array below.\r
export const MODULE_TEST_TOTAL = 25;\r
\r
/**\r
 * 1-5 star rating banded by percentage (90/80/70/60%), scaled to /25 —\r
 * same bands as the 20-question labs' 18/16/14/12, rounded up.\r
 */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 23) return 5;\r
  if (score >= 20) return 4;\r
  if (score >= 18) return 3;\r
  if (score >= 15) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // What Multiplication Means\r
    u1EqualGroupsTotal,\r
    identifyRowsQuestion,\r
    matchPictureQuestion,\r
    sameTotalSamePictureQuestion,\r
    rotateArrayQuestion,\r
    // Properties of Multiplication\r
    commutativeTrueFalseQuestion,\r
    associativeGroupingQuestion,\r
    distributiveSplitQuestion,\r
    distributiveAnySplitQuestion,\r
    distinguishAllThreeQuestion,\r
    // Multiplication Word Problems\r
    u3EqualGroupsTotal,\r
    arrayPickEquationQuestion,\r
    measurementQuestion("hard"),\r
    measurementPickEquationQuestion,\r
    compareQuestion,\r
    // One-Digit Facts\r
    hardFactQuestion,\r
    squareFactQuestion,\r
    hardFactNearMissChoiceQuestion,\r
    whichFactQuestion,\r
    catchTheMistakeQuestion,\r
    // Patterns in the Table\r
    skipAmountQuestion,\r
    ninesFactQuestion,\r
    mirrorCellQuestion,\r
    oddOddQuestion,\r
    predictPastEdgeQuestion,\r
  ],\r
  // 20/25 = 80%, matching the 4-star cutoff above.\r
  passScore: 20,\r
};\r
`;export{t as default};
