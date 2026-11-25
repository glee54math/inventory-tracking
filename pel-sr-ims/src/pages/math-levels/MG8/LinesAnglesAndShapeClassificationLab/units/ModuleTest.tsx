import { moduleStars } from "../../../shared/engine/moduleStars";
import type { Unit } from "../../../shared/units/types";
import { pick } from "../../../shared/lib/math";
import type { TestQuestion } from "../../../shared/engine/types";
import { angleTypeQuestion, countRightAnglesQuestion, identifyFigureQuestion, rayLengthTrapQuestion, whichAngleQuestion } from "./PointsLinesRaysAnglesTest";
import { figureParallelQuestion, figurePerpQuestion, notTouchingTrapQuestion, relationQuestion } from "./ParallelPerpendicularTest";
import { angleClassQuestion, bothNamesQuestion, nearMissQuestion, rightScaleneTrapQuestion, sideClassQuestion } from "./ClassifyingTrianglesTest";
import { allNamesQuestion, hierarchyQuestion, noneQuestion, oneNameQuestion, ruleToNameQuestion } from "./ClassifyingQuadrilateralsTest";
import { countLinesQuestion, isLineQuestion, middleTrapQuestion, rectangleDiagonalQuestion, whichHasNoneQuestion } from "./LinesOfSymmetryTest";

// ---------- cumulative end-of-module test: Lines, Angles & Shape Classification ----------
// 25 questions, 5 per unit, reusing each unit's own *Test.tsx generators with
// varied parameters (fresh random draw every attempt). Each unit's slice
// always includes its named-misconception item. Diagrams are kept — the
// picture IS the question in a geometry lab; the only stripped visuals would
// be text-only items, which already have none.

// Hand-maintained — keep in sync with `questions.length` below.
export const MODULE_TEST_TOTAL = 25;

/** 0–5 stars. The rule for every lab is in shared/engine/moduleStars.ts. */
export const moduleTestStars = (score: number): number => moduleStars(score, MODULE_TEST_TOTAL);

const anyFigure = (): TestQuestion[] => identifyFigureQuestion(pick(["segment", "ray", "line"] as const), "medium");

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Unit 1 — Points, Lines, Rays & Angle Types
    anyFigure,
    () => angleTypeQuestion("nearRight", "hard"),
    () => whichAngleQuestion(pick(["acute", "right", "obtuse"] as const), "hard"),
    () => countRightAnglesQuestion("medium"),
    () => rayLengthTrapQuestion("medium"),
    // Unit 2 — Parallel & Perpendicular Lines
    () => relationQuestion("meetLater", "hard"),
    () => relationQuestion(pick(["oblique", "nearPerp"] as const), "hard"),
    () => figureParallelQuestion(pick(["trapezoid", "parallelogram", "rightTrapezoid"] as const), "medium"),
    () => figurePerpQuestion("rightTrapezoid", "hard"),
    () => notTouchingTrapQuestion("medium"),
    // Unit 3 — Classifying Triangles
    () => sideClassQuestion(pick(["isosceles", "scalene"] as const), "medium"),
    () => angleClassQuestion(pick(["right", "obtuse"] as const), "medium"),
    () => bothNamesQuestion("hard"),
    () => nearMissQuestion("hard"),
    () => rightScaleneTrapQuestion("hard"),
    // Unit 4 — Classifying Quadrilaterals
    () => ruleToNameQuestion("medium"),
    () => oneNameQuestion("trapezoid", "medium"),
    () => allNamesQuestion("square", "hard"),
    () => hierarchyQuestion(false, "hard"),
    () => noneQuestion("hard"),
    // Unit 5 — Lines of Symmetry
    () => countLinesQuestion(pick(["one", "many"] as const), "medium"),
    () => countLinesQuestion("none", "medium"),
    () => isLineQuestion(false, "hard"),
    () => rectangleDiagonalQuestion("hard"),
    () => pick([whichHasNoneQuestion, middleTrapQuestion])("medium"),
  ],
  // Passes at 5 stars.
  passScore: 23,
};
