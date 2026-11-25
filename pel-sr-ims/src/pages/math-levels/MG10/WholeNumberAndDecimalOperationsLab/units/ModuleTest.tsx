import { moduleStars } from "../../../shared/engine/moduleStars";
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

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

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
  // Passes at 5 stars.
  passScore: 9,
};
