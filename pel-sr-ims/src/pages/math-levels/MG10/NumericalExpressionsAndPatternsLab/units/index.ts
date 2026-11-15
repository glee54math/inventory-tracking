import { whyParentheses } from "./WhyParentheses";
import { nestedGroups } from "./NestedGroups";
import { readingExpressions } from "./ReadingExpressions";
import { primeFactorsUnit } from "./PrimeFactors";
import { patterns } from "./Patterns";
import type { Unit } from "../../../shared/units/types";

export const units: Unit[] = [whyParentheses, nestedGroups, readingExpressions, primeFactorsUnit, patterns];
export type { Unit };
