import { whatAFractionIs } from "./WhatAFractionIs";
import { fractionsOnANumberLine } from "./FractionsOnANumberLine";
import { fractionsEqualToWholeNumbers } from "./FractionsEqualToWholeNumbers";
import { equivalentFractions } from "./EquivalentFractions";
import { comparingFractions } from "./ComparingFractions";
import type { Unit } from "../../../shared/units/types";

export const units: Unit[] = [whatAFractionIs, fractionsOnANumberLine, fractionsEqualToWholeNumbers, equivalentFractions, comparingFractions];
export type { Unit };
