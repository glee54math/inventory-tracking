import { readingComparingDecimals } from "./ReadingComparingDecimals";
import { roundingDecimals } from "./RoundingDecimals";
import type { Unit } from "../../../shared/units/types";

// Units 1-2 of the plan only (5.NBT.3a-b, 5.NBT.4). Units 3-5 are on hold (user decision).
export const units: Unit[] = [readingComparingDecimals, roundingDecimals];
export type { Unit };
