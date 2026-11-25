import { moduleStars } from "../../../shared/engine/moduleStars";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 23,
};
