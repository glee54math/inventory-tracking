import { fractionDivision } from "./FractionDivision";
import { decimalOperations } from "./DecimalOperations";
import { factorsMultiples } from "./FactorsMultiples";
import type { Unit } from "../../../shared/units/types";

// Long Division moved out to its own standalone labs — see
// MG8_OneDigitDivisionLab (one-digit divisor) and MG9_TwoDigitDivisionLab
// (two-digit divisor), both built on the same shared ManualDivisionLadder
// this unit's own practice problems used to drive directly.
/** Order matters: each unit builds on the ones before it. */
export const units: Unit[] = [fractionDivision, decimalOperations, factorsMultiples];
export type { Unit };
