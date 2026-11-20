const e=`import type { Unit } from "../../../shared/units/types";\r
import { definingVocabQuestion, nonDefiningClaimQuestion, rotatedSquareTrueFalseQuestion, sortOddOneOutQuestion, buildMatchQuestion } from "./DefiningAttributesTest";\r
import { sameRepeatedPiecesQuestion, differentComboSameOrDifferentQuestion, decomposeQuestion, twoPathsTrueFalseQuestion, solidWhichTwoQuestion } from "./ComposingShapesTest";\r
import { halvesEqualNameQuestion, halvesUnequalQuestion, fourthsPatternVarietyQuestion, compareSizeQuestion, countVsEqualTrapQuestion } from "./PartitioningShapesTest";\r
\r
// ---------- cumulative end-of-module test: Shapes And Fractions Intro ----------\r
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx question\r
// banks — same reuse pattern as MM1 NegativeNumbersLab's units/ModuleTest.tsx\r
// (which itself followed MM1 RatioLab's). Scaled down from the 20-question/\r
// 4-units default to 15 questions/3 units, proportionally: passScore and the\r
// star bands below are the 18/16/14/12-of-20 cutoffs (90/80/70/60%) scaled by\r
// 15/20, rounded to the nearest whole question.\r
//\r
// Like NegativeNumbersLab's module test (and unlike RatioLab's, which strips\r
// diagrams/choice questions out entirely), this one keeps every diagram and\r
// question type as-is — a shape/piece picture IS the subject of this whole\r
// lab, not scaffolding layered on top of a word problem, so stripping it\r
// would make a question about a shape unanswerable or artificially harder.\r
\r
export const MODULE_TEST_TOTAL = 15;\r
\r
/** 1-5 star rating banded on the raw /15 score — see this file's own doc\r
 *  comment for how these cutoffs were scaled down from the 20-question default. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 14) return 5;\r
  if (score >= 12) return 4;\r
  if (score >= 11) return 3;\r
  if (score >= 9) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Defining Attributes of Shapes\r
    () => definingVocabQuestion("medium"),\r
    () => nonDefiningClaimQuestion("medium"),\r
    rotatedSquareTrueFalseQuestion,\r
    () => sortOddOneOutQuestion("hard"),\r
    () => buildMatchQuestion("hard"),\r
    // Composing Shapes\r
    () => sameRepeatedPiecesQuestion("medium"),\r
    () => differentComboSameOrDifferentQuestion("medium"),\r
    () => decomposeQuestion("hard"),\r
    twoPathsTrueFalseQuestion,\r
    () => solidWhichTwoQuestion("hard"),\r
    // Partitioning Into Halves and Fourths\r
    () => halvesEqualNameQuestion("medium"),\r
    () => halvesUnequalQuestion("hard"),\r
    fourthsPatternVarietyQuestion,\r
    () => compareSizeQuestion("medium"),\r
    () => countVsEqualTrapQuestion("hard"),\r
  ],\r
  // 12/15 (80%) matches the 4-star cutoff in moduleTestStars above — "passed"\r
  // means at least 4 stars, not the full 5 — same convention as every other\r
  // lab's module test passScore in this app.\r
  passScore: 12,\r
};\r
`;export{e as default};
