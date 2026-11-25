import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { twoDigitClearQuestion, threeDigitClearQuestion, midpointThreeDigitQuestion, boundaryQuestion, shortcutTrapQuestion } from "./RoundingToNearestTenTest";
import { clearHundredQuestion2, midpointHundredQuestion, boundaryHundredQuestion, mixedDiscriminationQuestion, shortcutTrapHundredQuestion } from "./RoundingToNearestHundredTest";
import { addSingleRegroupQuestion, addDoubleRegroupQuestion, subSingleBorrowQuestion, subThroughZeroQuestion, subtractionMistakeQuestion } from "./AddingAndSubtractingWithin1000Test";
import { byTenQuestion, easyFactQuestion2, hardFactQuestion2, reverseHardQuestion, zeroCountQuestion } from "./MultiplyingByMultiplesOfTenTest";

// ---------- cumulative end-of-module test: Place Value & Fluency to 1000 ----------
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx generators —
// same reuse pattern as MM1/NegativeNumbersLab/units/ModuleTest.tsx. Each
// generator is an independent random draw, so a retake never replays the same
// 20 questions. Weighted toward each unit's medium/hard edge cases (midpoint,
// boundary crossing, double regroup, borrow-through-zero, hard facts, reverse).

// Hand-maintained (not computed) so counting doesn't burn a random draw from
// every generator — keep in sync with `questions` below.
export const MODULE_TEST_TOTAL = 20;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Rounding to the Nearest Ten
    twoDigitClearQuestion,
    threeDigitClearQuestion,
    midpointThreeDigitQuestion,
    boundaryQuestion,
    shortcutTrapQuestion,
    // Rounding to the Nearest Hundred
    clearHundredQuestion2,
    midpointHundredQuestion,
    boundaryHundredQuestion,
    mixedDiscriminationQuestion,
    shortcutTrapHundredQuestion,
    // Adding and Subtracting Within 1000
    addSingleRegroupQuestion,
    addDoubleRegroupQuestion,
    subSingleBorrowQuestion,
    subThroughZeroQuestion,
    subtractionMistakeQuestion,
    // Multiplying by Multiples of Ten
    byTenQuestion,
    easyFactQuestion2,
    hardFactQuestion2,
    reverseHardQuestion,
    zeroCountQuestion,
  ],
  // Passes at 5 stars.
  passScore: 19,
};
