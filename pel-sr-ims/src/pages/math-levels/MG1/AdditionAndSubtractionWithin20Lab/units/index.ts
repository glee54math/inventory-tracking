import { countingOnAndBack } from "./CountingOnAndBack";
import { makingTenAndDecomposing } from "./MakingTenAndDecomposing";
import { addToTakeFromWordProblems } from "./AddToTakeFromWordProblems";
import { putTogetherCompareWordProblems } from "./PutTogetherCompareWordProblems";
import { fluencyFactsWithin20 } from "./FluencyFactsWithin20";
import { equalSignAndEquations } from "./EqualSignAndEquations";
import type { Unit } from "../../../shared/units/types";

/** Order matters: counting strategies first, then making ten (which builds
 *  on counting), then the two word-problem units (which lean on both
 *  strategies), then fluency (now that the strategies behind the facts are
 *  established), then the equal-sign/equation reasoning that reuses facts
 *  from every unit before it. Six units, not five — Unit 5 of the approved
 *  plan bundled 1.OA.3/1.OA.6's fluency target with 1.OA.7/1.OA.8's equal-
 *  sign reasoning into one unit; split here into Fluency Facts Within 20
 *  (fact recall, reintroEverySolved) and Equal Sign and Equations (reasoning,
 *  one-time gate) per the plan's own flagged option — one Explore/CFU pass
 *  covering both a memorized-fact fluency target AND an equation-structure
 *  reasoning skill was too broad to test either one well. */
export const units: Unit[] = [
  countingOnAndBack,
  makingTenAndDecomposing,
  addToTakeFromWordProblems,
  putTogetherCompareWordProblems,
  fluencyFactsWithin20,
  equalSignAndEquations,
];
export type { Unit };
