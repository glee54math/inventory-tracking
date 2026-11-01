import { pointsLinesRaysAngles } from "./PointsLinesRaysAngles";
import { parallelPerpendicular } from "./ParallelPerpendicular";
import { classifyingTriangles } from "./ClassifyingTriangles";
import { classifyingQuadrilaterals } from "./ClassifyingQuadrilaterals";
import { linesOfSymmetry } from "./LinesOfSymmetry";
import type { Unit } from "../../../shared/units/types";

/** Order matters: rays/angles first (Unit 2 needs "right angle" for
 *  perpendicular), then parallel/perpendicular (Unit 4 sorts by parallel
 *  sides), triangles, quadrilaterals, and symmetry last (it reuses every
 *  shape name from Units 3-4). */
export const units: Unit[] = [pointsLinesRaysAngles, parallelPerpendicular, classifyingTriangles, classifyingQuadrilaterals, linesOfSymmetry];
export type { Unit };
