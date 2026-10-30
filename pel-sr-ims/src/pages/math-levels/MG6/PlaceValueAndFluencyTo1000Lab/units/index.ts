import { roundingNearestTen } from "./RoundingToNearestTen";
import { roundingNearestHundred } from "./RoundingToNearestHundred";
import { addSubWithin1000 } from "./AddingAndSubtractingWithin1000";
import { multiplyMultiplesOfTen } from "./MultiplyingByMultiplesOfTen";
import type { Unit } from "../../../shared/units/types";

/** Order matters: nearest-ten rounding first (introduces the number-line
 *  "which landmark is closer" idea), nearest-hundred second (same idea, bigger
 *  landmarks, plus ten-vs-hundred discrimination), then 3-digit add/subtract,
 *  then one-digit × multiples of ten (place-value reasoning about tens). */
export const units: Unit[] = [roundingNearestTen, roundingNearestHundred, addSubWithin1000, multiplyMultiplesOfTen];
export type { Unit };
