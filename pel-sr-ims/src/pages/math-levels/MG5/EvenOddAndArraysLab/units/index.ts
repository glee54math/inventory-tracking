import { determiningOddAndEven } from "./DeterminingOddAndEven";
import { evenNumbersAsEqualAddends } from "./EvenNumbersAsEqualAddends";
import { rectangularArraysFindingTotal } from "./RectangularArraysFindingTotal";
import { arraysAsEqualAddendEquations } from "./ArraysAsEqualAddendEquations";
import type { Unit } from "../../../shared/units/types";

/** Order matters: odd/even determination first (the pairing-reasoning
 *  foundation), then even numbers as equal addends (the same pairing idea,
 *  written as an equation), then rectangular arrays' totals (a new
 *  2-dimensional context for repeated addition), then arrays as
 *  equal-addend equations (combining the array context with the
 *  equal-addends equation skill from Unit 2) — each unit builds on the
 *  reasoning the one before it established, per the approved plan's 4-unit
 *  order (2.OA.3 pair, then 2.OA.4 pair). */
export const units: Unit[] = [determiningOddAndEven, evenNumbersAsEqualAddends, rectangularArraysFindingTotal, arraysAsEqualAddendEquations];
export type { Unit };
