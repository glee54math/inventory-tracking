const e=`import type { Unit } from "../../../shared/units/types";\r
import { fullGridQuestion, partialGridQuestion, areaNotPerimeterQuestion, rectilinearQuestion, sameAreaChoiceQuestion } from "./UnderstandingAreaAsTilingTest";\r
import { directMultiplyQuestion, multiplyNotAddQuestion, missingSideQuestion as missingFactorQuestion, wordProblemQuestion, missingSideWordQuestion } from "./AreaMultiplyingSideLengthsTest";\r
import { splitTotalQuestion, matchSplitQuestion, friendlySplitQuestion, twoSplitsQuestion, joinedRectanglesQuestion } from "./AreaDistributivePropertyTest";\r
import { lShapeQuestion, additiveChoiceQuestion, staircaseQuestion, subtractQuestion, missingSideAreaQuestion } from "./CompositeRectilinearAreasTest";\r
import { rectangleShortcutQuestion, missingSideQuestion as missingPerimeterSideQuestion, missingRectangleSideQuestion, samePerimeterQuestion, discriminateQuestion } from "./PerimeterTest";\r
\r
// ---------- cumulative end-of-module test: Area & Perimeter ----------\r
// 25 questions, 5 per unit, drawn from each unit's own *Test.tsx generators\r
// (same reuse pattern as MM1_ExponentsAndExpressionsLab's ModuleTest.tsx).\r
// Every generator is its own independent random draw, so a retake never\r
// replays the same 25 questions. Within each unit the mix leans medium/hard\r
// and always includes that unit's area-vs-perimeter (or wrong-dimension)\r
// misconception question, since that's the thread running through the lab.\r
\r
// Hand-maintained — keep in sync with \`questions.length\` below.\r
export const MODULE_TEST_TOTAL = 25;\r
\r
/** 1-5 star band on the /25 score: the standard 18/16/14/12-of-20 cutoffs\r
 *  scaled by 1.25 and rounded (23/20/18/15) — identical to the 25-question\r
 *  Exponents & Expressions module test. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 23) return 5;\r
  if (score >= 20) return 4;\r
  if (score >= 18) return 3;\r
  if (score >= 15) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Unit 1 — Understanding Area as Tiling\r
    fullGridQuestion("medium"),\r
    partialGridQuestion,\r
    areaNotPerimeterQuestion,\r
    rectilinearQuestion("hard"),\r
    sameAreaChoiceQuestion,\r
    // Unit 2 — Area = Multiplying Side Lengths\r
    directMultiplyQuestion("medium"),\r
    multiplyNotAddQuestion,\r
    missingFactorQuestion("hard"),\r
    wordProblemQuestion("hard"),\r
    missingSideWordQuestion,\r
    // Unit 3 — Area and the Distributive Property\r
    splitTotalQuestion("medium"),\r
    matchSplitQuestion,\r
    friendlySplitQuestion("hard"),\r
    twoSplitsQuestion,\r
    joinedRectanglesQuestion,\r
    // Unit 4 — Composite and Rectilinear Areas\r
    lShapeQuestion("medium"),\r
    additiveChoiceQuestion,\r
    staircaseQuestion("hard"),\r
    subtractQuestion("hard"),\r
    missingSideAreaQuestion,\r
    // Unit 5 — Perimeter\r
    rectangleShortcutQuestion("medium"),\r
    missingPerimeterSideQuestion("hard"),\r
    missingRectangleSideQuestion,\r
    samePerimeterQuestion,\r
    discriminateQuestion,\r
  ],\r
  // 20/25 = 80%, matching the 4-star cutoff above.\r
  passScore: 20,\r
};\r
`;export{e as default};
