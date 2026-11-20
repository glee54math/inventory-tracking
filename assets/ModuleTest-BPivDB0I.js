const e=`import type { Unit } from "../../../shared/units/types";\r
import { twoDigitClearQuestion, threeDigitClearQuestion, midpointThreeDigitQuestion, boundaryQuestion, shortcutTrapQuestion } from "./RoundingToNearestTenTest";\r
import { clearHundredQuestion2, midpointHundredQuestion, boundaryHundredQuestion, mixedDiscriminationQuestion, shortcutTrapHundredQuestion } from "./RoundingToNearestHundredTest";\r
import { addSingleRegroupQuestion, addDoubleRegroupQuestion, subSingleBorrowQuestion, subThroughZeroQuestion, subtractionMistakeQuestion } from "./AddingAndSubtractingWithin1000Test";\r
import { byTenQuestion, easyFactQuestion2, hardFactQuestion2, reverseHardQuestion, zeroCountQuestion } from "./MultiplyingByMultiplesOfTenTest";\r
\r
// ---------- cumulative end-of-module test: Place Value & Fluency to 1000 ----------\r
// 20 questions, 5 drawn from each of the 4 units' own *Test.tsx generators —\r
// same reuse pattern as MM1/NegativeNumbersLab/units/ModuleTest.tsx. Each\r
// generator is an independent random draw, so a retake never replays the same\r
// 20 questions. Weighted toward each unit's medium/hard edge cases (midpoint,\r
// boundary crossing, double regroup, borrow-through-zero, hard facts, reverse).\r
\r
// Hand-maintained (not computed) so counting doesn't burn a random draw from\r
// every generator — keep in sync with \`questions\` below.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/** 1-5 star band on the raw /20 score — same 18/16/14/12 cutoffs as every other 20-question module test. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 18) return 5;\r
  if (score >= 16) return 4;\r
  if (score >= 14) return 3;\r
  if (score >= 12) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Rounding to the Nearest Ten\r
    twoDigitClearQuestion,\r
    threeDigitClearQuestion,\r
    midpointThreeDigitQuestion,\r
    boundaryQuestion,\r
    shortcutTrapQuestion,\r
    // Rounding to the Nearest Hundred\r
    clearHundredQuestion2,\r
    midpointHundredQuestion,\r
    boundaryHundredQuestion,\r
    mixedDiscriminationQuestion,\r
    shortcutTrapHundredQuestion,\r
    // Adding and Subtracting Within 1000\r
    addSingleRegroupQuestion,\r
    addDoubleRegroupQuestion,\r
    subSingleBorrowQuestion,\r
    subThroughZeroQuestion,\r
    subtractionMistakeQuestion,\r
    // Multiplying by Multiples of Ten\r
    byTenQuestion,\r
    easyFactQuestion2,\r
    hardFactQuestion2,\r
    reverseHardQuestion,\r
    zeroCountQuestion,\r
  ],\r
  // 16/20 = 80%, matching the 4-star cutoff above.\r
  passScore: 16,\r
};\r
`;export{e as default};
