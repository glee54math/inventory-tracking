import type { Unit } from "../../../shared/units/types";
import { compareQuestion, expandedToDecQuestion, greatestQuestion, nameQuestion, thousandthsQuestion } from "./ReadingComparingDecimalsTest";
import { carryQuestion, exactQuestion, nextOnlyQuestion, roundQuestion, whichRoundsQuestion } from "./RoundingDecimalsTest";

// ---------- cumulative end-of-module test: Decimal Place Value & Rounding ----------
// 10 questions, 5 reused from each unit's own *Test.tsx generators (same reuse
// pattern as every other lab's ModuleTest.tsx), some called with different
// parameters than the unit tests. Each generator is an independent random
// draw, so a retake never replays the same 10.

/** Hand-maintained (calling every generator to count would burn a random draw). */
export const MODULE_TEST_TOTAL = 10;

/** 1-5 stars on the /10 score: the 18/16/14/12-of-20 bands halved — 9 / 8 / 7 / 6. */
export const moduleTestStars = (score: number): number => {
  if (score >= 9) return 5;
  if (score >= 8) return 4;
  if (score >= 7) return 3;
  if (score >= 6) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Reading, writing and comparing decimals
    () => nameQuestion("medium", true),
    () => expandedToDecQuestion("medium"),
    () => compareQuestion("medium", "shorterBigger"),
    () => thousandthsQuestion("medium"),
    () => greatestQuestion("hard"),
    // Rounding decimals
    () => roundQuestion("medium", "up"),
    () => roundQuestion("medium", "down", true),
    () => carryQuestion("hard", true),
    () => exactQuestion("medium"),
    () => Math.random() < 0.5 ? nextOnlyQuestion("hard") : whichRoundsQuestion("hard"),
  ],
  // 8/10 = 80%, the 4-star cutoff above.
  passScore: 8,
};
