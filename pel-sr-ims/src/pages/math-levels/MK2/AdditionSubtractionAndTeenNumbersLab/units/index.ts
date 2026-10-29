import { puttingTogetherAndTakingApart } from "./PuttingTogetherAndTakingApart";
import { wordProblemsWithin10 } from "./WordProblemsWithin10";
import { decomposingNumbers } from "./DecomposingNumbers";
import { makingTen } from "./MakingTen";
import { fastFactsWithin5 } from "./FastFactsWithin5";
import { teenNumbers } from "./TeenNumbers";
import type { Unit } from "../../../shared/units/types";

/** Order matters: Putting Together and Taking Apart introduces addition and
 *  subtraction as concepts at all; Word Problems extends that reasoning to
 *  varied story situations within 10; Decomposing and Making 10 both build
 *  on that same "parts of a whole" idea, with Making 10 as the specific,
 *  memorizable payoff; Fast Facts is pure fluency practice on Units 1 and 3's
 *  already-gated concepts; Teen Numbers is placed LAST because a teen number
 *  is literally "10 and some more" — the natural payoff of Making 10, not a
 *  separate place-value detour, per this lab's own plan. */
export const units: Unit[] = [
  puttingTogetherAndTakingApart,
  wordProblemsWithin10,
  decomposingNumbers,
  makingTen,
  fastFactsWithin5,
  teenNumbers,
];
export type { Unit };
