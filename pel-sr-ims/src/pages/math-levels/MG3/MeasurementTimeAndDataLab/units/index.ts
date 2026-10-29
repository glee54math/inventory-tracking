import { comparingOrderingLength } from "./ComparingOrderingLength";
import { measuringWithUnits } from "./MeasuringWithUnits";
import { tellingTime } from "./TellingTime";
import { organizingData } from "./OrganizingData";
import type { Unit } from "../../../shared/units/types";

/** Order matters: length ordering/comparison first, then measuring length
 *  with units (a distinct skill built on top of simply comparing), then
 *  telling time (an unrelated but still physical/spatial measurement skill),
 *  then organizing data (which often uses measured/counted quantities as its
 *  raw material) — matches the plan's own unit sequencing. */
export const units: Unit[] = [comparingOrderingLength, measuringWithUnits, tellingTime, organizingData];
export type { Unit };
