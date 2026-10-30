import type { Unit } from "../../../shared/units/types";
import { groupsSizeQuestion, groupsCountQuestion, arrayCountQuestion, meaningGroupsCountQuestion, contrastQuestion } from "./WhatDivisionMeansTest";
import { deriveQuotientQuestion, missingFactorQuestion, squareFactCountQuestion, matchingFamilyQuestion, noWholeNumberPartnerQuestion } from "./UnknownFactorTest";
import { easyAnchorQuestion, midDivisorQuestion, hardDivisorQuestion, squareDerivedQuestion, nearMissChoiceQuestion } from "./FactFluencyTest";
import { unknownFactorQuestion, unknownDividendQuestion, unknownDivisorQuestion, nonStandardFactorLeftQuestion, nonStandardQuotientLeftQuestion } from "./DeterminingUnknownTest";
import { multThenSubQuestion, divThenDivQuestion, firstStepMeaningQuestion, equationWithLetterQuestion, reasonablenessTrapQuestion } from "./TwoStepWordProblemsTest";

// ---------- cumulative end-of-module test: Division & Word Problems ----------
// 25 questions, 5 drawn from each of the 5 units' own *Test.tsx generators —
// same reuse pattern as MM1 NegativeNumbersLab's ModuleTest.tsx. Each
// generator is its own independent random draw, so a retake never replays
// the same 25 questions. Params are varied from the per-unit tests where a
// generator takes any (e.g. missing factor in the OTHER position, hard
// rather than easy variants).

// Hand-maintained (same reasoning as the other labs' MODULE_TEST_TOTAL):
// calling every generator just to count would burn a random draw. Keep in
// sync with `questions` below.
export const MODULE_TEST_TOTAL = 25;

/**
 * 1-5 star rating banded on the raw /25 score — the same A-F percentage
 * cutoffs (90/80/70/60%) the 20-question labs use (18/16/14/12), scaled to
 * 25 and rounded up so a band never asks for less than its percentage.
 */
export const moduleTestStars = (score: number): number => {
  if (score >= 23) return 5;
  if (score >= 20) return 4;
  if (score >= 18) return 3;
  if (score >= 15) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // What Division Means
    () => groupsSizeQuestion("medium"),
    () => groupsCountQuestion("medium"),
    () => arrayCountQuestion("hard"),
    meaningGroupsCountQuestion,
    contrastQuestion,
    // Division as an Unknown-Factor Problem
    () => deriveQuotientQuestion("second", "medium"),
    () => missingFactorQuestion("second", "hard"),
    squareFactCountQuestion,
    matchingFamilyQuestion,
    noWholeNumberPartnerQuestion,
    // Division Fact Fluency
    () => easyAnchorQuestion("medium"),
    () => midDivisorQuestion("medium"),
    () => hardDivisorQuestion("hard"),
    squareDerivedQuestion,
    nearMissChoiceQuestion,
    // Determining the Unknown
    () => unknownFactorQuestion("first", "hard"),
    () => unknownDividendQuestion("hard"),
    () => unknownDivisorQuestion("hard"),
    nonStandardFactorLeftQuestion,
    nonStandardQuotientLeftQuestion,
    // Two-Step Word Problems
    () => multThenSubQuestion("hard"),
    divThenDivQuestion,
    firstStepMeaningQuestion,
    equationWithLetterQuestion,
    reasonablenessTrapQuestion,
  ],
  // 20/25 = 80%, matching the 4-star cutoff above.
  passScore: 20,
};
