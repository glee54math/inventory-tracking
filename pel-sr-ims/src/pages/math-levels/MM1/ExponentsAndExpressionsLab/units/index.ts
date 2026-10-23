import { exponents } from "./Exponents";
import { writingReadingExpressions } from "./WritingReadingExpressions";
import { evaluatingExpressions } from "./EvaluatingExpressions";
import { equivalentExpressionsProperties } from "./EquivalentExpressionsProperties";
import { identifyingEquivalentExpressions } from "./IdentifyingEquivalentExpressions";
import type { Unit } from "../../../shared/units/types";

/** Order matters: each unit builds on the ones before it — exponents first
 *  (needed to even read expressions that use them), then translating
 *  words/expressions and naming their parts, then evaluating expressions
 *  (which needs both exponents AND the vocabulary from unit 2), then
 *  generating equivalent expressions via properties, then judging whether
 *  two given expressions are equivalent (which reuses unit 3's evaluation
 *  skill as its verification tool). */
export const units: Unit[] = [
  exponents,
  writingReadingExpressions,
  evaluatingExpressions,
  equivalentExpressionsProperties,
  identifyingEquivalentExpressions,
];
export type { Unit };
