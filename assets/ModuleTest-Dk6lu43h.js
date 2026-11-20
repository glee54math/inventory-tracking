const e=`import type { Unit } from "../../../shared/units/types";\r
import { countOnLargerNumberQuestion, countOnSmallFirstChoiceQuestion, countBackSimpleNumberQuestion, countBackHowManyTimesChoiceQuestion, countBackCrossNumberQuestion } from "./CountingOnAndBackTest";\r
import { gapToTenQuestion, makeTenNearTenNumberQuestion, wrongAddendChoiceQuestion, subtractBridgeNumberQuestion, equivalentSumNumberQuestion } from "./MakingTenAndDecomposingTest";\r
import { addToResultNumberQuestion, changeUnknownRoleChoiceQuestion, addToStartKeywordTrapChoiceQuestion, takeFromResultNumberQuestion, takeFromChangeNumberQuestion } from "./AddToTakeFromWordProblemsTest";\r
import { ptaTotalNumberQuestion, ptaAddendNumberQuestion, compareDiffMoreNumberQuestion, compareDiffFewerDirectionChoiceQuestion, compareBiggerUnknownNumberQuestion } from "./PutTogetherCompareWordProblemsTest";\r
import { factsWithin10AddNumberQuestion, factsWithin20AddNumberQuestion, threeAddendGroupingChoiceQuestion, threeAddendSumNumberQuestion, orderDoesNotMatterQuestion } from "./FluencyFactsWithin20Test";\r
import { equalSignMeaningChoiceQuestion, unknownOnLeftNumberQuestion, backwardsEquationTrueFalseQuestion, trivialTrueFalseQuestion, findUnknownSecondAddendNumberQuestion } from "./EqualSignAndEquationsTest";\r
\r
// ---------- cumulative end-of-module test: Addition and Subtraction Within 20 ----------\r
// 30 questions, 5 drawn from each of the 6 units' own *Test.tsx question\r
// banks — same reuse pattern as MM1 Ratio Lab's, MM1 Negative Numbers', and\r
// MK1 Counting and Cardinality's own units/ModuleTest.tsx.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as every other lab's own MODULE_TEST_TOTAL) — keep in sync with\r
// \`questions.length\`.\r
export const MODULE_TEST_TOTAL = 30;\r
\r
/** 1-5 star rating banded on the raw /30 score. 24/30 (80%) is both the\r
 *  passScore below and the 4-star cutoff, same convention as every other\r
 *  module test in this app. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 27) return 5;\r
  if (score >= 24) return 4;\r
  if (score >= 21) return 3;\r
  if (score >= 18) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Counting On and Counting Back\r
    countOnLargerNumberQuestion,\r
    countOnSmallFirstChoiceQuestion,\r
    countBackSimpleNumberQuestion,\r
    countBackHowManyTimesChoiceQuestion,\r
    countBackCrossNumberQuestion,\r
    // Making Ten\r
    gapToTenQuestion,\r
    makeTenNearTenNumberQuestion,\r
    wrongAddendChoiceQuestion,\r
    subtractBridgeNumberQuestion,\r
    equivalentSumNumberQuestion,\r
    // Add To and Take From Stories\r
    addToResultNumberQuestion,\r
    changeUnknownRoleChoiceQuestion,\r
    addToStartKeywordTrapChoiceQuestion,\r
    takeFromResultNumberQuestion,\r
    // At most one start-missing story (addToStartKeywordTrapChoiceQuestion): 1st graders meet them, 2nd graders master them.\r
    takeFromChangeNumberQuestion,\r
    // Put Together and Compare Stories\r
    ptaTotalNumberQuestion,\r
    ptaAddendNumberQuestion,\r
    compareDiffMoreNumberQuestion,\r
    compareDiffFewerDirectionChoiceQuestion,\r
    compareBiggerUnknownNumberQuestion,\r
    // Fast Facts to 20\r
    factsWithin10AddNumberQuestion,\r
    factsWithin20AddNumberQuestion,\r
    threeAddendGroupingChoiceQuestion,\r
    threeAddendSumNumberQuestion,\r
    orderDoesNotMatterQuestion,\r
    // Equal Sign and Number Sentences\r
    equalSignMeaningChoiceQuestion,\r
    unknownOnLeftNumberQuestion,\r
    backwardsEquationTrueFalseQuestion,\r
    trivialTrueFalseQuestion,\r
    findUnknownSecondAddendNumberQuestion,\r
  ],\r
  // 24/30 = 80%, matching the 4-star cutoff in moduleTestStars above.\r
  passScore: 24,\r
};\r
`;export{e as default};
