import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { definingVocabQuestion, nonDefiningClaimQuestion, rotatedSquareTrueFalseQuestion, sortOddOneOutQuestion, buildMatchQuestion } from "./DefiningAttributesTest";
import { sameRepeatedPiecesQuestion, differentComboSameOrDifferentQuestion, decomposeQuestion, twoPathsTrueFalseQuestion, solidWhichTwoQuestion } from "./ComposingShapesTest";
import { halvesEqualNameQuestion, halvesUnequalQuestion, fourthsPatternVarietyQuestion, compareSizeQuestion, countVsEqualTrapQuestion } from "./PartitioningShapesTest";

// ---------- cumulative end-of-module test: Shapes And Fractions Intro ----------
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx question
// banks — same reuse pattern as MM1 NegativeNumbersLab's units/ModuleTest.tsx
// (which itself followed MM1 RatioLab's). Stars and passing follow the shared
// rule in shared/engine/moduleStars.ts.
//
// Like NegativeNumbersLab's module test (and unlike RatioLab's, which strips
// diagrams/choice questions out entirely), this one keeps every diagram and
// question type as-is — a shape/piece picture IS the subject of this whole
// lab, not scaffolding layered on top of a word problem, so stripping it
// would make a question about a shape unanswerable or artificially harder.

export const MODULE_TEST_TOTAL = 15;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 14,
};
