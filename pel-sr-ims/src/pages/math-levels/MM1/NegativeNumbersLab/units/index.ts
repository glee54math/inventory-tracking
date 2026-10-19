import { realWorldNegatives } from "./RealWorldNegatives";
import { numberLineUnit } from "./NumberLineUnit";
import { coordinatePlaneUnit } from "./CoordinatePlaneUnit";
import { comparingOrdering } from "./ComparingOrdering";
import type { Unit } from "../../../shared/units/types";

/** Order matters: each unit builds on the ones before it — real-world
 *  meaning first, then the number line, then the coordinate plane (which
 *  extends the number line into two dimensions), then comparing/ordering/
 *  absolute value (which draws on all three). */
export const units: Unit[] = [realWorldNegatives, numberLineUnit, coordinatePlaneUnit, comparingOrdering];
export type { Unit };
