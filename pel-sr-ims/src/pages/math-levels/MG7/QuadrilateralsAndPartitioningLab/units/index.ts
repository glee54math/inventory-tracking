import { attributesOfQuadrilaterals } from "./AttributesOfQuadrilaterals";
import { drawingNonExamples } from "./DrawingNonExamples";
import { partitioningEqualAreas } from "./PartitioningEqualAreas";
import type { Unit } from "../../../shared/units/types";

/** Order matters: recognize quadrilaterals and their named kinds first, then
 *  construct ones outside those kinds (which needs that vocabulary), then
 *  partition shapes into equal areas (3.G.2, independent of 3.G.1 but
 *  reusing the "a shape's look isn't what matters" habit). */
export const units: Unit[] = [attributesOfQuadrilaterals, drawingNonExamples, partitioningEqualAreas];
export type { Unit };
