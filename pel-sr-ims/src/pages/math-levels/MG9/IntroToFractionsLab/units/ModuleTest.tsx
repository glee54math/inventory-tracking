import type { Unit } from "../../../shared/units/types";
import type { TestQuestion } from "../../../shared/engine/types";
import { boundaryCaseQuestion, classifyImproperQuestion, improperToMixedQuestion, mixedToImproperQuestion, pickEquivalentQuestion } from "./FractionFormsTest";
import { buildEquivalentQuestion, missingDenominatorQuestion, missingNumeratorQuestion, notEquivalentQuestion, spotEquivalentQuestion } from "./EquivalentFractionsTest";
import { benchmarkQuestion, conceptQuestion, crossChoiceQuestion, crossRatioQuestion, sameNumQuestion } from "./ComparingFractionsTest";
import { alreadySimplestQuestion, divideByGcfQuestion, findGcfQuestion, simplifyQuestion, whichDividesQuestion } from "./SimplifyingFractionsTest";

// ---------- cumulative end-of-module test: Introduction to Fractions ----------
// 20 questions, 5 reused from each of the 4 units' own *Test.tsx generators
// (same reuse pattern as every other lab's ModuleTest.tsx). Each generator is
// an independent random draw, so a retake never replays the same 20.

/** Hand-maintained (calling every generator to count would burn a random draw). */
export const MODULE_TEST_TOTAL = 20;

/** 1-5 stars on the /20 score: the standard 18/16/14/12 bands. */
export const moduleTestStars = (score: number): number => {
  if (score >= 18) return 5;
  if (score >= 16) return 4;
  if (score >= 14) return 3;
  if (score >= 12) return 2;
  return 1;
};

/** Strips the picture from a reused question whose diagram would only repeat
 *  the one just before it. */
const noVisual = (make: () => TestQuestion[]) => () => make().map((q) => ({ ...q, visual: null }));

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Fraction forms
    classifyImproperQuestion,
    improperToMixedQuestion("hard"),
    mixedToImproperQuestion,
    pickEquivalentQuestion,
    boundaryCaseQuestion,
    // Equivalent fractions
    missingNumeratorQuestion("medium"),
    noVisual(missingDenominatorQuestion("medium")),
    spotEquivalentQuestion(false, "medium"),
    notEquivalentQuestion,
    buildEquivalentQuestion("hard"),
    // Comparing fractions
    sameNumQuestion("medium", true),
    benchmarkQuestion,
    crossRatioQuestion("medium"),
    crossChoiceQuestion("hard"),
    conceptQuestion,
    // Simplifying fractions
    simplifyQuestion("medium", [2, 5]),
    findGcfQuestion("medium"),
    alreadySimplestQuestion("medium"),
    whichDividesQuestion,
    divideByGcfQuestion("hard"),
  ],
  // 16/20 = 80%, the 4-star cutoff above.
  passScore: 16,
};
