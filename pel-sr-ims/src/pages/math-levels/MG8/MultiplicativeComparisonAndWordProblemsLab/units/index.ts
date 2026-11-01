import { comparisonEquations } from "./ComparisonEquations";
import { multVsAddComparison } from "./MultVsAddComparison";
import { multistepWordProblems } from "./MultistepWordProblems";
import { interpretingRemainders } from "./InterpretingRemainders";
import type { Unit } from "../../../shared/units/types";

export const units: Unit[] = [comparisonEquations, multVsAddComparison, multistepWordProblems, interpretingRemainders];
export type { Unit };
