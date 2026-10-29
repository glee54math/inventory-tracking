import type { Unit } from "../../../shared/units/types";
import { countOnLargerNumberQuestion, countOnSmallFirstChoiceQuestion, countBackSimpleNumberQuestion, countBackHowManyTimesChoiceQuestion, countBackCrossNumberQuestion } from "./CountingOnAndBackTest";
import { gapToTenQuestion, makeTenNearTenNumberQuestion, wrongAddendChoiceQuestion, subtractBridgeNumberQuestion, equivalentSumNumberQuestion } from "./MakingTenAndDecomposingTest";
import { addToResultNumberQuestion, changeUnknownRoleChoiceQuestion, addToStartKeywordTrapChoiceQuestion, takeFromResultNumberQuestion, takeFromStartKeywordTrapChoiceQuestion } from "./AddToTakeFromWordProblemsTest";
import { ptaTotalNumberQuestion, ptaAddendNumberQuestion, compareDiffMoreNumberQuestion, compareDiffFewerDirectionChoiceQuestion, compareBiggerUnknownNumberQuestion } from "./PutTogetherCompareWordProblemsTest";
import { factsWithin10AddNumberQuestion, factsWithin20AddNumberQuestion, threeAddendGroupingChoiceQuestion, threeAddendSumNumberQuestion, orderDoesNotMatterQuestion } from "./FluencyFactsWithin20Test";
import { equalSignMeaningChoiceQuestion, unknownOnLeftNumberQuestion, backwardsEquationTrueFalseQuestion, trivialTrueFalseQuestion, findUnknownSecondAddendNumberQuestion } from "./EqualSignAndEquationsTest";

// ---------- cumulative end-of-module test: Addition and Subtraction Within 20 ----------
// 30 questions, 5 drawn from each of the 6 units' own *Test.tsx question
// banks — same reuse pattern as MM1 Ratio Lab's, MM1 Negative Numbers', and
// MK1 Counting and Cardinality's own units/ModuleTest.tsx.

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own MODULE_TEST_TOTAL) — keep in sync with
// `questions.length`.
export const MODULE_TEST_TOTAL = 30;

/** 1-5 star rating banded on the raw /30 score. 24/30 (80%) is both the
 *  passScore below and the 4-star cutoff, same convention as every other
 *  module test in this app. */
export const moduleTestStars = (score: number): number => {
  if (score >= 27) return 5;
  if (score >= 24) return 4;
  if (score >= 21) return 3;
  if (score >= 18) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Counting On and Counting Back
    countOnLargerNumberQuestion,
    countOnSmallFirstChoiceQuestion,
    countBackSimpleNumberQuestion,
    countBackHowManyTimesChoiceQuestion,
    countBackCrossNumberQuestion,
    // Making Ten and Decomposing Numbers
    gapToTenQuestion,
    makeTenNearTenNumberQuestion,
    wrongAddendChoiceQuestion,
    subtractBridgeNumberQuestion,
    equivalentSumNumberQuestion,
    // Word Problems: Add To and Take From
    addToResultNumberQuestion,
    changeUnknownRoleChoiceQuestion,
    addToStartKeywordTrapChoiceQuestion,
    takeFromResultNumberQuestion,
    takeFromStartKeywordTrapChoiceQuestion,
    // Word Problems: Put Together/Take Apart and Compare
    ptaTotalNumberQuestion,
    ptaAddendNumberQuestion,
    compareDiffMoreNumberQuestion,
    compareDiffFewerDirectionChoiceQuestion,
    compareBiggerUnknownNumberQuestion,
    // Fluency Facts Within 20
    factsWithin10AddNumberQuestion,
    factsWithin20AddNumberQuestion,
    threeAddendGroupingChoiceQuestion,
    threeAddendSumNumberQuestion,
    orderDoesNotMatterQuestion,
    // Equal Sign and Equations
    equalSignMeaningChoiceQuestion,
    unknownOnLeftNumberQuestion,
    backwardsEquationTrueFalseQuestion,
    trivialTrueFalseQuestion,
    findUnknownSecondAddendNumberQuestion,
  ],
  // 24/30 = 80%, matching the 4-star cutoff in moduleTestStars above.
  passScore: 24,
};
