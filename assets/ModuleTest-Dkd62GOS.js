const e=`import type { Unit } from "../../../shared/units/types";\r
import { compareQuestion, expandedToDecQuestion, greatestQuestion, nameQuestion, thousandthsQuestion } from "./ReadingComparingDecimalsTest";\r
import { carryQuestion, exactQuestion, nextOnlyQuestion, roundQuestion, whichRoundsQuestion } from "./RoundingDecimalsTest";\r
\r
// ---------- cumulative end-of-module test: Decimal Place Value & Rounding ----------\r
// 10 questions, 5 reused from each unit's own *Test.tsx generators (same reuse\r
// pattern as every other lab's ModuleTest.tsx), some called with different\r
// parameters than the unit tests. Each generator is an independent random\r
// draw, so a retake never replays the same 10.\r
\r
/** Hand-maintained (calling every generator to count would burn a random draw). */\r
export const MODULE_TEST_TOTAL = 10;\r
\r
/** 1-5 stars on the /10 score: the 18/16/14/12-of-20 bands halved — 9 / 8 / 7 / 6. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 9) return 5;\r
  if (score >= 8) return 4;\r
  if (score >= 7) return 3;\r
  if (score >= 6) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Reading, writing and comparing decimals\r
    () => nameQuestion("medium", true),\r
    () => expandedToDecQuestion("medium"),\r
    () => compareQuestion("medium", "shorterBigger"),\r
    () => thousandthsQuestion("medium"),\r
    () => greatestQuestion("hard"),\r
    // Rounding decimals\r
    () => roundQuestion("medium", "up"),\r
    () => roundQuestion("medium", "down", true),\r
    () => carryQuestion("hard", true),\r
    () => exactQuestion("medium"),\r
    () => Math.random() < 0.5 ? nextOnlyQuestion("hard") : whichRoundsQuestion("hard"),\r
  ],\r
  // 8/10 = 80%, the 4-star cutoff above.\r
  passScore: 8,\r
};\r
`;export{e as default};
