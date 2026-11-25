import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { benchmarkDegreesQuestion, betweenQuestion, oneDegreeQuestion, orientationQuestion, rayLengthTrapQuestion } from "./WhatIsAnAngleTest";
import { readAcuteTypedQuestion, readObtuseChoiceQuestion, sanityQuestion, unalignedTypedQuestion, whichScaleQuestion } from "./MeasuringWithAProtractorTest";
import { benchmarkPictureQuestion, checkSketchQuestion, drawnAngleQuestion, markPointQuestion } from "./SketchingAnglesTest";
import { equationMatchQuestion, impliedWholeQuestion, missingPartChoiceQuestion, threePartsMissingQuestion, wordProblemQuestion } from "./AngleAdditionTest";

// ---------- cumulative end-of-module test: Angles & Protractor ----------
// 20 questions, 5 from each unit's own *Test.tsx generators (reused, not
// rewritten), called with different parameters than their unit test where a
// generator takes any. Every generator is an independent random draw, so a
// retake is a fresh test. Each unit's hardest/trap bucket appears at least once:
// ray-length trap, obtuse wrong-scale reading, wrong-scale sketch, implied whole.

// Hand-maintained (calling every generator just to count would burn a random draw). Keep in sync with `questions`.
export const MODULE_TEST_TOTAL = 20;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // What Is an Angle?
    benchmarkDegreesQuestion("medium"),
    betweenQuestion("medium"),
    rayLengthTrapQuestion("hard"),
    orientationQuestion("medium"),
    oneDegreeQuestion,
    // Measuring with a Protractor
    whichScaleQuestion("medium"),
    readAcuteTypedQuestion("random", "medium"),
    readObtuseChoiceQuestion("left", "hard"),
    sanityQuestion("hard"),
    unalignedTypedQuestion("hard"),
    // Sketching Angles of a Given Measure
    benchmarkPictureQuestion("medium"),
    markPointQuestion("left", "medium"),
    markPointQuestion("rotated", "hard"),
    drawnAngleQuestion("hard"),
    checkSketchQuestion("hard"),
    // Angle Addition & Unknown Angles
    missingPartChoiceQuestion("medium"),
    threePartsMissingQuestion("hard"),
    impliedWholeQuestion("right", "hard"),
    equationMatchQuestion("straight", "hard"),
    wordProblemQuestion("medium"),
  ],
  // Passes at 5 stars.
  passScore: 19,
};
