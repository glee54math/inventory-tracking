import { decomposingFractions } from "./DecomposingFractions";
import { addSubtractFractions } from "./AddSubtractFractions";
import { fractionWordProblems } from "./FractionWordProblems";
import { multiplyFractionByWhole } from "./MultiplyFractionByWhole";
import { fractionLinePlots } from "./FractionLinePlots";
import type { Unit } from "../../../shared/units/types";

export const units: Unit[] = [decomposingFractions, addSubtractFractions, fractionWordProblems, multiplyFractionByWhole, fractionLinePlots];
export type { Unit };
