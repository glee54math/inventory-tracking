import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { addToResultQuestion, takeFromResultQuestion, fingersJoinQuestion, equationApartChoiceQuestion, moreOrFewerQuestion } from "./PuttingTogetherAndTakingApartTest";
import { putTogetherTotalQuestion, missingAddendQuestion, whoHasMoreQuestion, whoHasMoreBigQuestion, addOrTakeAwayQuestion } from "./WordProblemsWithin10Test";
import { decomposeSmallQuestion, decomposeLargeQuestion, secondWayQuestion, moreThanOneWayQuestion, equalPartsQuestion } from "./DecomposingNumbersTest";
import { smallComplementQuestion, nearTenComplementQuestion, middleComplementQuestion, makeTenNoPictureQuestion, verifyPairQuestion } from "./MakingTenTest";
import { additionFactQuestion, subtractionFactQuestion, doublesFactQuestion, missingToFiveQuestion, subtractAllQuestion } from "./FastFactsWithin5Test";
import { composeTeenQuestion, decomposeTeenQuestion, oneShowsQuestion, digitSwapTrapQuestion, teenNoPictureQuestion } from "./TeenNumbersTest";
import { noRepeats } from "./labHelp";

// ---------- cumulative end-of-module test: Addition, Subtraction, and Teen
// Numbers ----------
// 30 questions, 5 drawn from each of the 6 units' own *Test.tsx question
// banks. Pictures follow the same rule as the unit Tests: they show only what
// the question gives. "How many more?" is an optional Practice challenge and
// is never tested here (user decision D1).

// Hand-maintained rather than computed from the array below (same reasoning
// as every other lab's own ModuleTest.tsx). Keep in sync with `questions.length`.
export const MODULE_TEST_TOTAL = 30;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  // noRepeats: no prompt appears twice in one sitting.
  questions: noRepeats([
    // Put Together and Take Away
    addToResultQuestion,
    takeFromResultQuestion,
    fingersJoinQuestion,
    equationApartChoiceQuestion,
    moreOrFewerQuestion,
    // Story Problems to 10
    putTogetherTotalQuestion,
    missingAddendQuestion,
    whoHasMoreQuestion,
    whoHasMoreBigQuestion,
    addOrTakeAwayQuestion,
    // Break Numbers Apart
    decomposeSmallQuestion,
    decomposeLargeQuestion,
    secondWayQuestion,
    moreThanOneWayQuestion,
    equalPartsQuestion,
    // Make 10
    smallComplementQuestion,
    nearTenComplementQuestion,
    middleComplementQuestion,
    makeTenNoPictureQuestion,
    verifyPairQuestion,
    // Fast Facts to 5
    additionFactQuestion,
    subtractionFactQuestion,
    doublesFactQuestion,
    missingToFiveQuestion,
    subtractAllQuestion,
    // Teen Numbers
    composeTeenQuestion,
    decomposeTeenQuestion,
    oneShowsQuestion,
    digitSwapTrapQuestion,
    teenNoPictureQuestion,
  ]),
  // Passes at 5 stars.
  passScore: 28,
};
