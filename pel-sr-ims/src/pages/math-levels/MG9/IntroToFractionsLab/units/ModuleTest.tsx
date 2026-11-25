import { moduleStars } from "../../../shared/engine/moduleStars";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 19,
};
