import { whatDivisionMeans } from "./WhatDivisionMeans";
import { unknownFactor } from "./UnknownFactor";
import { factFluency } from "./FactFluency";
import { determiningUnknown } from "./DeterminingUnknown";
import { twoStepWordProblems } from "./TwoStepWordProblems";
import type { Unit } from "../../../shared/units/types";

export const units: Unit[] = [whatDivisionMeans, unknownFactor, factFluency, determiningUnknown, twoStepWordProblems];
export type { Unit };
