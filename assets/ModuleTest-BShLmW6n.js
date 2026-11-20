const e=`import type { Unit } from "../../../shared/units/types";\r
import { benchmarkDegreesQuestion, betweenQuestion, oneDegreeQuestion, orientationQuestion, rayLengthTrapQuestion } from "./WhatIsAnAngleTest";\r
import { readAcuteTypedQuestion, readObtuseChoiceQuestion, sanityQuestion, unalignedTypedQuestion, whichScaleQuestion } from "./MeasuringWithAProtractorTest";\r
import { benchmarkPictureQuestion, checkSketchQuestion, drawnAngleQuestion, markPointQuestion } from "./SketchingAnglesTest";\r
import { equationMatchQuestion, impliedWholeQuestion, missingPartChoiceQuestion, threePartsMissingQuestion, wordProblemQuestion } from "./AngleAdditionTest";\r
\r
// ---------- cumulative end-of-module test: Angles & Protractor ----------\r
// 20 questions, 5 from each unit's own *Test.tsx generators (reused, not\r
// rewritten), called with different parameters than their unit test where a\r
// generator takes any. Every generator is an independent random draw, so a\r
// retake is a fresh test. Each unit's hardest/trap bucket appears at least once:\r
// ray-length trap, obtuse wrong-scale reading, wrong-scale sketch, implied whole.\r
\r
// Hand-maintained (calling every generator just to count would burn a random draw). Keep in sync with \`questions\`.\r
export const MODULE_TEST_TOTAL = 20;\r
\r
/** 1-5 star rating on the raw /20 score — the standard 18/16/14/12 bands. */\r
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
    // What Is an Angle?\r
    benchmarkDegreesQuestion("medium"),\r
    betweenQuestion("medium"),\r
    rayLengthTrapQuestion("hard"),\r
    orientationQuestion("medium"),\r
    oneDegreeQuestion,\r
    // Measuring with a Protractor\r
    whichScaleQuestion("medium"),\r
    readAcuteTypedQuestion("random", "medium"),\r
    readObtuseChoiceQuestion("left", "hard"),\r
    sanityQuestion("hard"),\r
    unalignedTypedQuestion("hard"),\r
    // Sketching Angles of a Given Measure\r
    benchmarkPictureQuestion("medium"),\r
    markPointQuestion("left", "medium"),\r
    markPointQuestion("rotated", "hard"),\r
    drawnAngleQuestion("hard"),\r
    checkSketchQuestion("hard"),\r
    // Angle Addition & Unknown Angles\r
    missingPartChoiceQuestion("medium"),\r
    threePartsMissingQuestion("hard"),\r
    impliedWholeQuestion("right", "hard"),\r
    equationMatchQuestion("straight", "hard"),\r
    wordProblemQuestion("medium"),\r
  ],\r
  // 16/20 = 80%, matching the 4-star cutoff above.\r
  passScore: 16,\r
};\r
`;export{e as default};
