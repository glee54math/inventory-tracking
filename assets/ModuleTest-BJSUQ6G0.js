const e=`import type { Unit } from "../../../shared/units/types";\r
import { pick } from "../../../shared/lib/math";\r
import type { TestQuestion } from "../../../shared/engine/types";\r
import { angleTypeQuestion, countRightAnglesQuestion, identifyFigureQuestion, rayLengthTrapQuestion, whichAngleQuestion } from "./PointsLinesRaysAnglesTest";\r
import { figureParallelQuestion, figurePerpQuestion, notTouchingTrapQuestion, relationQuestion } from "./ParallelPerpendicularTest";\r
import { angleClassQuestion, bothNamesQuestion, nearMissQuestion, rightScaleneTrapQuestion, sideClassQuestion } from "./ClassifyingTrianglesTest";\r
import { allNamesQuestion, hierarchyQuestion, noneQuestion, oneNameQuestion, ruleToNameQuestion } from "./ClassifyingQuadrilateralsTest";\r
import { countLinesQuestion, isLineQuestion, middleTrapQuestion, rectangleDiagonalQuestion, whichHasNoneQuestion } from "./LinesOfSymmetryTest";\r
\r
// ---------- cumulative end-of-module test: Lines, Angles & Shape Classification ----------\r
// 25 questions, 5 per unit, reusing each unit's own *Test.tsx generators with\r
// varied parameters (fresh random draw every attempt). Each unit's slice\r
// always includes its named-misconception item. Diagrams are kept — the\r
// picture IS the question in a geometry lab; the only stripped visuals would\r
// be text-only items, which already have none.\r
\r
// Hand-maintained — keep in sync with \`questions.length\` below.\r
export const MODULE_TEST_TOTAL = 25;\r
\r
/** 1-5 star band on the /25 score: the 18/16/14/12-of-20 cutoffs scaled by\r
 *  1.25 and rounded (23/20/18/15) — same as every other 25-question module test. */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 23) return 5;\r
  if (score >= 20) return 4;\r
  if (score >= 18) return 3;\r
  if (score >= 15) return 2;\r
  return 1;\r
};\r
\r
const anyFigure = (): TestQuestion[] => identifyFigureQuestion(pick(["segment", "ray", "line"] as const), "medium");\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Unit 1 — Points, Lines, Rays & Angle Types\r
    anyFigure,\r
    () => angleTypeQuestion("nearRight", "hard"),\r
    () => whichAngleQuestion(pick(["acute", "right", "obtuse"] as const), "hard"),\r
    () => countRightAnglesQuestion("medium"),\r
    () => rayLengthTrapQuestion("medium"),\r
    // Unit 2 — Parallel & Perpendicular Lines\r
    () => relationQuestion("meetLater", "hard"),\r
    () => relationQuestion(pick(["oblique", "nearPerp"] as const), "hard"),\r
    () => figureParallelQuestion(pick(["trapezoid", "parallelogram", "rightTrapezoid"] as const), "medium"),\r
    () => figurePerpQuestion("rightTrapezoid", "hard"),\r
    () => notTouchingTrapQuestion("medium"),\r
    // Unit 3 — Classifying Triangles\r
    () => sideClassQuestion(pick(["isosceles", "scalene"] as const), "medium"),\r
    () => angleClassQuestion(pick(["right", "obtuse"] as const), "medium"),\r
    () => bothNamesQuestion("hard"),\r
    () => nearMissQuestion("hard"),\r
    () => rightScaleneTrapQuestion("hard"),\r
    // Unit 4 — Classifying Quadrilaterals\r
    () => ruleToNameQuestion("medium"),\r
    () => oneNameQuestion("trapezoid", "medium"),\r
    () => allNamesQuestion("square", "hard"),\r
    () => hierarchyQuestion(false, "hard"),\r
    () => noneQuestion("hard"),\r
    // Unit 5 — Lines of Symmetry\r
    () => countLinesQuestion(pick(["one", "many"] as const), "medium"),\r
    () => countLinesQuestion("none", "medium"),\r
    () => isLineQuestion(false, "hard"),\r
    () => rectangleDiagonalQuestion("hard"),\r
    () => pick([whichHasNoneQuestion, middleTrapQuestion])("medium"),\r
  ],\r
  // 20/25 (80%) = the 4-star cutoff above.\r
  passScore: 20,\r
};\r
`;export{e as default};
