import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { countOnLargerNumberQuestion, countOnSmallFirstChoiceQuestion, countBackSimpleNumberQuestion, countBackHowManyTimesChoiceQuestion, countBackCrossNumberQuestion } from "./CountingOnAndBackTest";
import { gapToTenQuestion, makeTenNearTenNumberQuestion, wrongAddendChoiceQuestion, subtractBridgeNumberQuestion, equivalentSumNumberQuestion } from "./MakingTenAndDecomposingTest";
import { addToResultNumberQuestion, changeUnknownRoleChoiceQuestion, addToStartKeywordTrapChoiceQuestion, takeFromResultNumberQuestion, takeFromChangeNumberQuestion } from "./AddToTakeFromWordProblemsTest";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Counting On and Counting Back
    countOnLargerNumberQuestion,
    countOnSmallFirstChoiceQuestion,
    countBackSimpleNumberQuestion,
    countBackHowManyTimesChoiceQuestion,
    countBackCrossNumberQuestion,
    // Making Ten
    gapToTenQuestion,
    makeTenNearTenNumberQuestion,
    wrongAddendChoiceQuestion,
    subtractBridgeNumberQuestion,
    equivalentSumNumberQuestion,
    // Add To and Take From Stories
    addToResultNumberQuestion,
    changeUnknownRoleChoiceQuestion,
    addToStartKeywordTrapChoiceQuestion,
    takeFromResultNumberQuestion,
    // At most one start-missing story (addToStartKeywordTrapChoiceQuestion): 1st graders meet them, 2nd graders master them.
    takeFromChangeNumberQuestion,
    // Put Together and Compare Stories
    ptaTotalNumberQuestion,
    ptaAddendNumberQuestion,
    compareDiffMoreNumberQuestion,
    compareDiffFewerDirectionChoiceQuestion,
    compareBiggerUnknownNumberQuestion,
    // Fast Facts to 20
    factsWithin10AddNumberQuestion,
    factsWithin20AddNumberQuestion,
    threeAddendGroupingChoiceQuestion,
    threeAddendSumNumberQuestion,
    orderDoesNotMatterQuestion,
    // Equal Sign and Number Sentences
    equalSignMeaningChoiceQuestion,
    unknownOnLeftNumberQuestion,
    backwardsEquationTrueFalseQuestion,
    trivialTrueFalseQuestion,
    findUnknownSecondAddendNumberQuestion,
  ],
  // Passes at 5 stars.
  passScore: 28,
};
