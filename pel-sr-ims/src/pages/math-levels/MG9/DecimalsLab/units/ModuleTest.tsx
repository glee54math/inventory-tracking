import type { Unit } from "../../../shared/units/types";
import { convertQuestion, addQuestion, smallAddChoiceQuestion, spotErrorQuestion, carrySentenceQuestion } from "./TenthsToHundredthsTest";
import { hundredthsToDecimalQuestion, hiddenZeroToDecimalQuestion, readDecimalQuestion, mixedToDecimalQuestion, decimalToMixedChoiceQuestion } from "./DecimalNotationTest";
import { sameDigitsQuestion, fewerDigitsQuestion, sameWholePartQuestion, diffWholeWhoQuestion, trailingZeroQuestion } from "./ComparingDecimalsTest";

// ---------- cumulative end-of-module test: Decimals ----------
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx generators
// (fresh random parameters every attempt) — same reuse pattern as MG7
// QuadrilateralsAndPartitioningLab's ModuleTest.tsx. Most unit-test visuals
// are switched OFF here (withVisual/withLine false): by the module test the
// student should read the symbols without the grid doing the work. The one
// kept picture is the different-size-wholes bars, which ARE the question.
// Every unit's trap bucket appears at least once (add-the-tops, past one
// whole, hidden zero, fewer-digits-bigger, different wholes).

const N_UNITS = 3;
export const MODULE_TEST_TOTAL = N_UNITS * 5;

/** 1-5 star rating on the raw /15 score — the 18/16/14/12-of-20 bands scaled to 15. */
export const moduleTestStars = (score: number): number => {
  if (score >= 14) return 5;
  if (score >= 12) return 4;
  if (score >= 11) return 3;
  if (score >= 9) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Tenths and Hundredths
    convertQuestion("medium", false),
    addQuestion("hard", false),
    smallAddChoiceQuestion,
    spotErrorQuestion,
    carrySentenceQuestion,
    // Decimal Notation
    hundredthsToDecimalQuestion("medium", false),
    hiddenZeroToDecimalQuestion,
    readDecimalQuestion,
    mixedToDecimalQuestion("hard", false),
    decimalToMixedChoiceQuestion,
    // Comparing Decimals
    sameDigitsQuestion("medium", false),
    fewerDigitsQuestion("hard", false),
    sameWholePartQuestion("hard"),
    diffWholeWhoQuestion,
    trailingZeroQuestion,
  ],
  // 12/15 (80%) = the 4-star cutoff above.
  passScore: 12,
};
