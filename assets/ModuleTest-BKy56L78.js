const e=`import type { Unit } from "../../../shared/units/types";\r
import { groupsSizeQuestion, groupsCountQuestion, arrayCountQuestion, meaningGroupsCountQuestion, contrastQuestion } from "./WhatDivisionMeansTest";\r
import { deriveQuotientQuestion, missingFactorQuestion, squareFactCountQuestion, matchingFamilyQuestion, noWholeNumberPartnerQuestion } from "./UnknownFactorTest";\r
import { easyAnchorQuestion, midDivisorQuestion, hardDivisorQuestion, squareDerivedQuestion, nearMissChoiceQuestion } from "./FactFluencyTest";\r
import { unknownFactorQuestion, unknownDividendQuestion, unknownDivisorQuestion, nonStandardFactorLeftQuestion, nonStandardQuotientLeftQuestion } from "./DeterminingUnknownTest";\r
import { multThenSubQuestion, divThenDivQuestion, firstStepMeaningQuestion, equationWithLetterQuestion, reasonablenessTrapQuestion } from "./TwoStepWordProblemsTest";\r
\r
// ---------- cumulative end-of-module test: Division & Word Problems ----------\r
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx generators —\r
// same reuse pattern as MM1 NegativeNumbersLab's ModuleTest.tsx. Each\r
// generator is its own independent random draw, so a retake never replays\r
// the same 25 questions. Params are varied from the per-unit tests where a\r
// generator takes any (e.g. missing factor in the OTHER position, hard\r
// rather than easy variants).\r
\r
// Hand-maintained (same reasoning as the other labs' MODULE_TEST_TOTAL):\r
// calling every generator just to count would burn a random draw. Keep in\r
// sync with \`questions\` below.\r
export const MODULE_TEST_TOTAL = 25;\r
\r
/**\r
 * 1-5 star rating banded on the raw /25 score — the same A-F percentage\r
 * cutoffs (90/80/70/60%) the 20-question labs use (18/16/14/12), scaled to\r
 * 25 and rounded up so a band never asks for less than its percentage.\r
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
    // What Division Means\r
    () => groupsSizeQuestion("medium"),\r
    () => groupsCountQuestion("medium"),\r
    () => arrayCountQuestion("hard"),\r
    meaningGroupsCountQuestion,\r
    contrastQuestion,\r
    // Division as an Unknown-Factor Problem\r
    () => deriveQuotientQuestion("second", "medium"),\r
    () => missingFactorQuestion("second", "hard"),\r
    squareFactCountQuestion,\r
    matchingFamilyQuestion,\r
    noWholeNumberPartnerQuestion,\r
    // Division Fact Fluency\r
    () => easyAnchorQuestion("medium"),\r
    () => midDivisorQuestion("medium"),\r
    () => hardDivisorQuestion("hard"),\r
    squareDerivedQuestion,\r
    nearMissChoiceQuestion,\r
    // Determining the Unknown\r
    () => unknownFactorQuestion("first", "hard"),\r
    () => unknownDividendQuestion("hard"),\r
    () => unknownDivisorQuestion("hard"),\r
    nonStandardFactorLeftQuestion,\r
    nonStandardQuotientLeftQuestion,\r
    // Two-Step Word Problems\r
    () => multThenSubQuestion("hard"),\r
    divThenDivQuestion,\r
    firstStepMeaningQuestion,\r
    equationWithLetterQuestion,\r
    reasonablenessTrapQuestion,\r
  ],\r
  // 20/25 = 80%, matching the 4-star cutoff above.\r
  passScore: 20,\r
};\r
`;export{e as default};
