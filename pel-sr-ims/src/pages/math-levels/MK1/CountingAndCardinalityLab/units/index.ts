import { countingOnAndForward } from "./CountingOnAndForward";
import { writingAndMatchingNumerals } from "./WritingAndMatchingNumerals";
import { howManyCardinality } from "./HowManyCardinality";
import { comparingGroupsAndNumerals } from "./ComparingGroupsAndNumerals";
import type { Unit } from "../../../shared/units/types";

/** Order matters: counting the sequence first, then writing/matching
 *  numerals, then cardinality (counting actual objects and knowing the last
 *  number counted is the total), then comparing groups and numerals — each
 *  builds on the numbers and numerals the units before it introduced. */
export const units: Unit[] = [countingOnAndForward, writingAndMatchingNumerals, howManyCardinality, comparingGroupsAndNumerals];
export type { Unit };
