import { factorPairsUnit } from "./FactorPairs";
import { multiplesUnit } from "./Multiples";
import { primeCompositeUnit } from "./PrimeComposite";
import { numberShapePatternsUnit } from "./NumberShapePatterns";
import type { Unit } from "../../../shared/units/types";

export const units: Unit[] = [factorPairsUnit, multiplesUnit, primeCompositeUnit, numberShapePatternsUnit];
export type { Unit };
