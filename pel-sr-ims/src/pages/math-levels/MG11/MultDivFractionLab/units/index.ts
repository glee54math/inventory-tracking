import { fractionDivision } from "./FractionDivision";
import { longDivision } from "./LongDivision";
import { decimalOperations } from "./DecimalOperations";
import { factorsMultiples } from "./FactorsMultiples";
import type { Unit } from "../../../shared/units/types";

/** Order matters: each unit builds on the ones before it. */
export const units: Unit[] = [fractionDivision, longDivision, decimalOperations, factorsMultiples];
export type { Unit };
