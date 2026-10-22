import { fractionForms } from "./FractionForms";
import { equivalentFractions } from "./EquivalentFractions";
import { comparingFractions } from "./ComparingFractions";
import { simplifyingFractions } from "./SimplifyingFractions";
import type { Unit } from "../../../shared/units/types";

export const units: Unit[] = [fractionForms, equivalentFractions, comparingFractions, simplifyingFractions];
export type { Unit };
