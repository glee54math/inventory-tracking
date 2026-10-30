import { measuringEstimatingLength } from "./MeasuringEstimatingLength";
import { comparingUnitsLengthDifferences } from "./ComparingUnitsLengthDifferences";
import { lengthWordProblemsNumberLine } from "./LengthWordProblemsNumberLine";
import { tellingTime5Min } from "./TellingTime5Min";
import { moneyWordProblems } from "./MoneyWordProblems";
import { linePlotsAndGraphs } from "./LinePlotsAndGraphs";
import type { Unit } from "../../../shared/units/types";

/** Order matters: length (Units 1-3) builds concept on concept — measuring,
 *  then comparing units/finding differences, then word problems and the
 *  number line — then time, money, and data (Units 4-6), which the plan
 *  flags as having no real sequencing dependency on the length units or on
 *  each other, but are still presented in the plan's own order. */
export const units: Unit[] = [
  measuringEstimatingLength,
  comparingUnitsLengthDifferences,
  lengthWordProblemsNumberLine,
  tellingTime5Min,
  moneyWordProblems,
  linePlotsAndGraphs,
];
export type { Unit };
