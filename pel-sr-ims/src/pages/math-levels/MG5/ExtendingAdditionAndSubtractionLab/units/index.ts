import { withinTwentyFluency } from "./WithinTwentyFluency";
import { addingFourTwoDigitNumbers } from "./AddingFourTwoDigitNumbers";
import { addSubtractWithin1000 } from "./AddSubtractWithin1000";
import { mentalMathTenHundred } from "./MentalMathTenHundred";
import { explainingStrategies } from "./ExplainingStrategies";
import type { Unit } from "../../../shared/units/types";

/** Order matches the approved plan: within-20 fact fluency first
 *  (foundational, even though its CCSS code 2.OA.2 sits numerically between
 *  2.NBT codes), then the written-algorithm units build on each other
 *  (up-to-four addends, then into the hundreds with regrouping), then the
 *  mental-math shortcut (which leans on the place-value sense the written
 *  algorithm units just built), then the reasoning unit that explains WHY
 *  all of the above actually works. */
export const units: Unit[] = [
  withinTwentyFluency,
  addingFourTwoDigitNumbers,
  addSubtractWithin1000,
  mentalMathTenHundred,
  explainingStrategies,
];
export type { Unit };
