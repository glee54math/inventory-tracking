import { describingHowObjectsAreMeasured } from "./DescribingHowObjectsAreMeasured";
import { comparingTwoObjectsDirectly } from "./ComparingTwoObjectsDirectly";
import { classifyingAndCountingByCategory } from "./ClassifyingAndCountingByCategory";
import type { Unit } from "../../../shared/units/types";

/** Order matters: single-object attribute vocabulary first, then direct
 *  two-object comparison (which depends on that same vocabulary), then
 *  classify-count-compare (which leans on counting fluency up to 10 — a
 *  soft dependency on MK1_CountingAndCardinalityLab, not a hard lock). */
export const units: Unit[] = [describingHowObjectsAreMeasured, comparingTwoObjectsDirectly, classifyingAndCountingByCategory];
export type { Unit };
