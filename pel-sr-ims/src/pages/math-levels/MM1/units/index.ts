import { ratioLanguage } from "./RatioLanguage";
import { unitRate } from "./UnitRate";
import { tablesGraphs } from "./TablesGraphs";
import { rateProblems } from "./RateProblems";
import { percent } from "./Percent";
import { unitConversion } from "./Conversions";
import type { Unit } from "../../shared/units/types";

/** Order matters: each unit builds on the ones before it. */
export const units: Unit[] = [ratioLanguage, unitRate, tablesGraphs, rateProblems, percent, unitConversion];
export type { Unit };
