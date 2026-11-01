import { tenthsToHundredths } from "./TenthsToHundredths";
import { decimalNotation } from "./DecimalNotation";
import { comparingDecimals } from "./ComparingDecimals";
import type { Unit } from "../../../shared/units/types";

export const units: Unit[] = [tenthsToHundredths, decimalNotation, comparingDecimals];
export type { Unit };
