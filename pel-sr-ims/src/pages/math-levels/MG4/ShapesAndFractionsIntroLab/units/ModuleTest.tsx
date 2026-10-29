import type { Unit } from "../../../shared/units/types";
import { definingVocabQuestion, nonDefiningClaimQuestion, rotatedSquareTrueFalseQuestion, sortOddOneOutQuestion, buildMatchQuestion } from "./DefiningAttributesTest";
import { sameRepeatedPiecesQuestion, differentComboSameOrDifferentQuestion, decomposeQuestion, twoPathsTrueFalseQuestion, solidWhichTwoQuestion } from "./ComposingShapesTest";
import { halvesEqualNameQuestion, halvesUnequalQuestion, fourthsPatternVarietyQuestion, compareSizeQuestion, countVsEqualTrapQuestion } from "./PartitioningShapesTest";

// ---------- cumulative end-of-module test: Shapes And Fractions Intro ----------
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx question
// banks — same reuse pattern as MM1 NegativeNumbersLab's units/ModuleTest.tsx
// (which itself followed MM1 RatioLab's). Scaled down from the 20-question/
// 4-units default to 15 questions/3 units, proportionally: passScore and the
// star bands below are the 18/16/14/12-of-20 cutoffs (90/80/70/60%) scaled by
// 15/20, rounded to the nearest whole question.
//
// Like NegativeNumbersLab's module test (and unlike RatioLab's, which strips
// diagrams/choice questions out entirely), this one keeps every diagram and
// question type as-is — a shape/piece picture IS the subject of this whole
// lab, not scaffolding layered on top of a word problem, so stripping it
// would make a question about a shape unanswerable or artificially harder.

export const MODULE_TEST_TOTAL = 15;

/** 1-5 star rating banded on the raw /15 score — see this file's own doc
 *  comment for how these cutoffs were scaled down from the 20-question default. */
export const moduleTestStars = (score: number): number => {
  if (score >= 14) return 5;
  if (score >= 12) return 4;
  if (score >= 11) return 3;
  if (score >= 9) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Defining Attributes of Shapes
    () => definingVocabQuestion("medium"),
    () => nonDefiningClaimQuestion("medium"),
    rotatedSquareTrueFalseQuestion,
    () => sortOddOneOutQuestion("hard"),
    () => buildMatchQuestion("hard"),
    // Composing Shapes
    () => sameRepeatedPiecesQuestion("medium"),
    () => differentComboSameOrDifferentQuestion("medium"),
    () => decomposeQuestion("hard"),
    twoPathsTrueFalseQuestion,
    () => solidWhichTwoQuestion("hard"),
    // Partitioning Into Halves and Fourths
    () => halvesEqualNameQuestion("medium"),
    () => halvesUnequalQuestion("hard"),
    fourthsPatternVarietyQuestion,
    () => compareSizeQuestion("medium"),
    () => countVsEqualTrapQuestion("hard"),
  ],
  // 12/15 (80%) matches the 4-star cutoff in moduleTestStars above — "passed"
  // means at least 4 stars, not the full 5 — same convention as every other
  // lab's module test passScore in this app.
  passScore: 12,
};
