import { classifyingShapes } from "./ClassifyingShapesByAttributes";
import { partitioningRectangles } from "./PartitioningRectangles";
import { equalShares } from "./EqualSharesOfCirclesAndRectangles";
import type { Unit } from "../../../shared/units/types";

/** Order matters: classify flat/solid shapes by attribute first, then
 *  partition a rectangle into a rows/columns grid (a specific kind of
 *  "divide into equal pieces"), then equal shares of circles/rectangles
 *  (the general halves/thirds/fourths idea) — each stage's vocabulary
 *  ("equal size," "straight sides") carries into the next. */
export const units: Unit[] = [classifyingShapes, partitioningRectangles, equalShares];
export type { Unit };
