import { definingAttributes } from "./DefiningAttributes";
import { composingShapes } from "./ComposingShapes";
import { partitioningShapes } from "./PartitioningShapes";
import type { Unit } from "../../../shared/units/types";

/** Order matters: defining attributes first (what makes a shape a shape),
 *  then composing shapes (building bigger shapes from basic ones), then
 *  partitioning (splitting a shape into equal shares) — each stage uses
 *  "basic shape" vocabulary the previous stage already introduced. */
export const units: Unit[] = [definingAttributes, composingShapes, partitioningShapes];
export type { Unit };
