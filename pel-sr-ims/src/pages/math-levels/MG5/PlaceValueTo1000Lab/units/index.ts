import { hundredsTensOnes } from "./HundredsTensOnes";
import { countingAndSkipCounting } from "./CountingAndSkipCounting";
import { readingWritingNumbers } from "./ReadingWritingNumbers";
import { comparingNumbers } from "./ComparingNumbers";
import type { Unit } from "../../../shared/units/types";

/** Order matches the approved plan: build/decompose a number first, then
 *  count with it, then read/write it three ways, then compare two of them —
 *  each unit leans on the vocabulary ("hundreds/tens/ones," "place value")
 *  the one before it established. */
export const units: Unit[] = [hundredsTensOnes, countingAndSkipCounting, readingWritingNumbers, comparingNumbers];
export type { Unit };
