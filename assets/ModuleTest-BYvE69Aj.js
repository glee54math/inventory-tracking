const e=`import type { Unit } from "../../../shared/units/types";\r
import { convertQuestion, addQuestion, smallAddChoiceQuestion, spotErrorQuestion, carrySentenceQuestion } from "./TenthsToHundredthsTest";\r
import { hundredthsToDecimalQuestion, hiddenZeroToDecimalQuestion, readDecimalQuestion, mixedToDecimalQuestion, decimalToMixedChoiceQuestion } from "./DecimalNotationTest";\r
import { sameDigitsQuestion, fewerDigitsQuestion, sameWholePartQuestion, diffWholeWhoQuestion, trailingZeroQuestion } from "./ComparingDecimalsTest";\r
\r
// ---------- cumulative end-of-module test: Decimals ----------\r
// 15 questions, 5 drawn from each of the 3 units' own *Test.tsx generators\r
// (fresh random parameters every attempt) — same reuse pattern as MG7\r
// QuadrilateralsAndPartitioningLab's ModuleTest.tsx. Most unit-test visuals\r
// are switched OFF here (withVisual/withLine false): by the module test the\r
// student should read the symbols without the grid doing the work. The one\r
// kept picture is the different-size-wholes bars, which ARE the question.\r
// Every unit's trap bucket appears at least once (add-the-tops, past one\r
// whole, hidden zero, fewer-digits-bigger, different wholes).\r
\r
const N_UNITS = 3;\r
export const MODULE_TEST_TOTAL = N_UNITS * 5;\r
\r
/** 1-5 star rating on the raw /15 score — the 18/16/14/12-of-20 bands scaled to 15. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 14) return 5;\r
  if (score >= 12) return 4;\r
  if (score >= 11) return 3;\r
  if (score >= 9) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Tenths and Hundredths\r
    convertQuestion("medium", false),\r
    addQuestion("hard", false),\r
    smallAddChoiceQuestion,\r
    spotErrorQuestion,\r
    carrySentenceQuestion,\r
    // Decimal Notation\r
    hundredthsToDecimalQuestion("medium", false),\r
    hiddenZeroToDecimalQuestion,\r
    readDecimalQuestion,\r
    mixedToDecimalQuestion("hard", false),\r
    decimalToMixedChoiceQuestion,\r
    // Comparing Decimals\r
    sameDigitsQuestion("medium", false),\r
    fewerDigitsQuestion("hard", false),\r
    sameWholePartQuestion("hard"),\r
    diffWholeWhoQuestion,\r
    trailingZeroQuestion,\r
  ],\r
  // 12/15 (80%) = the 4-star cutoff above.\r
  passScore: 12,\r
};\r
`;export{e as default};
