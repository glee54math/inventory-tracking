const e=`import type { Unit } from "../../../shared/units/types";\r
import type { TestQuestion } from "../../../shared/engine/types";\r
import { boundaryCaseQuestion, classifyImproperQuestion, improperToMixedQuestion, mixedToImproperQuestion, pickEquivalentQuestion } from "./FractionFormsTest";\r
import { buildEquivalentQuestion, missingDenominatorQuestion, missingNumeratorQuestion, notEquivalentQuestion, spotEquivalentQuestion } from "./EquivalentFractionsTest";\r
import { benchmarkQuestion, conceptQuestion, crossChoiceQuestion, crossRatioQuestion, sameNumQuestion } from "./ComparingFractionsTest";\r
import { alreadySimplestQuestion, divideByGcfQuestion, findGcfQuestion, simplifyQuestion, whichDividesQuestion } from "./SimplifyingFractionsTest";\r
\r
// ---------- cumulative end-of-module test: Introduction to Fractions ----------\r
// 20 questions, 5 reused from each of the 4 units' own *Test.tsx generators\r
// (same reuse pattern as every other lab's ModuleTest.tsx). Each generator is\r
// an independent random draw, so a retake never replays the same 20.\r
\r
/** Hand-maintained (calling every generator to count would burn a random draw). */\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/** 1-5 stars on the /20 score: the standard 18/16/14/12 bands. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 18) return 5;\r
  if (score >= 16) return 4;\r
  if (score >= 14) return 3;\r
  if (score >= 12) return 2;\r
  return 1;\r
};\r
\r
/** Strips the picture from a reused question whose diagram would only repeat\r
 *  the one just before it. */\r
const noVisual = (make: () => TestQuestion[]) => () => make().map((q) => ({ ...q, visual: null }));\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Fraction forms\r
    classifyImproperQuestion,\r
    improperToMixedQuestion("hard"),\r
    mixedToImproperQuestion,\r
    pickEquivalentQuestion,\r
    boundaryCaseQuestion,\r
    // Equivalent fractions\r
    missingNumeratorQuestion("medium"),\r
    noVisual(missingDenominatorQuestion("medium")),\r
    spotEquivalentQuestion(false, "medium"),\r
    notEquivalentQuestion,\r
    buildEquivalentQuestion("hard"),\r
    // Comparing fractions\r
    sameNumQuestion("medium", true),\r
    benchmarkQuestion,\r
    crossRatioQuestion("medium"),\r
    crossChoiceQuestion("hard"),\r
    conceptQuestion,\r
    // Simplifying fractions\r
    simplifyQuestion("medium", [2, 5]),\r
    findGcfQuestion("medium"),\r
    alreadySimplestQuestion("medium"),\r
    whichDividesQuestion,\r
    divideByGcfQuestion("hard"),\r
  ],\r
  // 16/20 = 80%, the 4-star cutoff above.\r
  passScore: 16,\r
};\r
`;export{e as default};
