import { countingTo120 } from "./CountingTo120";
import { tensAndOnes } from "./TensAndOnes";
import { comparingTwoDigitNumbers } from "./ComparingTwoDigitNumbers";
import { tenMoreTenLess } from "./TenMoreTenLess";
import { addingTwoDigitOneDigit } from "./AddingTwoDigitOneDigit";
import type { Unit } from "../../../shared/units/types";

/** Order matters: counting to 120 first (the count sequence itself), then
 *  tens/ones decomposition (needs the sequence to already make sense), then
 *  comparing (needs tens/ones place value to reason about), then moving by
 *  tens, then the hardest idea — regrouping addition — last, since it
 *  leans on every place-value idea before it. */
export const units: Unit[] = [countingTo120, tensAndOnes, comparingTwoDigitNumbers, tenMoreTenLess, addingTwoDigitOneDigit];
export type { Unit };
