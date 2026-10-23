import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Identifying Equivalent Expressions ----------
// 10 single-question generators across the 5 Practice skills: equivalent
// pairs from the distributive property, equivalent pairs from combining
// like terms, non-equivalent "look-alike" pairs, non-equivalent pairs that
// coincidentally match at one "nice" value, and using substitution at TWO
// different values as a verification tool. Self-contained — no import from
// IdentifyingEquivalentExpressions.tsx (see ExponentsTest.tsx's comment).
//
// Every pair is represented as {coeffX, constant, display} and evaluated via
// the SAME evaluateLinear() function the diagram-less prompt text and the
// graded steps both use, so "what does A evaluate to at x=3" can never
// silently disagree between the question's own setup and its answer key.

interface LinearExpr {
  coeffX: number;
  constant: number;
  display: string;
}

const evaluateLinear = (e: LinearExpr, x: number): number => e.coeffX * x + e.constant;

/** 5(a) equivalent pair from the distributive property. */
export const equivDistributiveQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const a = randInt(2, 6);
  const b = randInt(2, 9);
  const exprA: LinearExpr = { coeffX: a, constant: a * b, display: `${a}(x+${b})` };
  const exprB: LinearExpr = { coeffX: a, constant: a * b, display: `${a}x+${a * b}` };
  const x = randInt(2, 8);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Are ${exprA.display} and ${exprB.display} equivalent? Check by substituting x = ${x} into both.`,
          hint: `${exprA.display} at x=${x}: ${a}(${x}+${b}). ${exprB.display} at x=${x}: ${a}(${x})+${a * b}.`,
          explain: `Both give ${evaluateLinear(exprA, x)} — and distributing ${a} across (x+${b}) always gives ${a}x+${a * b}, for every x, not just this one.`,
        },
        "Yes, equivalent",
        ["No, not equivalent"]
      ),
    },
  ];
};

/** 5(b) equivalent pair from combining like terms. */
export const equivCombineQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const a = randInt(2, 6);
  const c = randInt(2, 6);
  const exprA: LinearExpr = { coeffX: a + c, constant: 0, display: `${a}x+${c}x` };
  const exprB: LinearExpr = { coeffX: a + c, constant: 0, display: `${a + c}x` };
  const x = randInt(2, 8);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Are ${exprA.display} and ${exprB.display} equivalent? Check by substituting x = ${x} into both.`,
          hint: "Add the coefficients of x and compare.",
          explain: `Both give ${evaluateLinear(exprA, x)} — combining like terms (${a}x+${c}x = ${a + c}x) always produces an equivalent expression, for every x.`,
        },
        "Yes, equivalent",
        ["No, not equivalent"]
      ),
    },
  ];
};

/** 5(c) non-equivalent "look-alike" pair — forgot to distribute to both terms. */
export const nonequivLookalikeQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const a = randInt(2, 6);
  const b = randInt(2, 9);
  const exprA: LinearExpr = { coeffX: a, constant: a * b, display: `${a}(x+${b})` };
  const exprB: LinearExpr = { coeffX: a, constant: b, display: `${a}x+${b}` };
  const x = 0;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Are ${exprA.display} and ${exprB.display} equivalent? Check by substituting x = ${x} into both.`,
          hint: `${exprA.display} at x=0 is ${a}×${b} = ${evaluateLinear(exprA, x)}. ${exprB.display} at x=0 is just ${b}.`,
          explain: `At x=0, ${exprA.display} = ${evaluateLinear(exprA, x)} but ${exprB.display} = ${evaluateLinear(exprB, x)} — different values, so they're NOT equivalent. ${exprB.display} forgot to multiply the ${b} by ${a}.`,
        },
        "No, not equivalent",
        ["Yes, equivalent"]
      ),
    },
  ];
};

/** 5(d) non-equivalent pair that coincidentally matches at x=1 — the
 *  "checking one value isn't enough" trap. */
export const nonequivOneValueTrapQuestion = (difficulty: "hard"): TestQuestion[] => {
  const a = randInt(2, 9);
  let b = randInt(2, 9);
  while (b === a) b = randInt(2, 9);
  const exprA: LinearExpr = { coeffX: a, constant: b, display: `${a}x+${b}` };
  const exprB: LinearExpr = { coeffX: b, constant: a, display: `${b}x+${a}` };
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${exprA.display} and ${exprB.display} give the same value at x = 1. Does that prove they're equivalent for every x?`,
          hint: `Try a different value, like x = 2, and compare.`,
          explain: `No — at x=1 both give ${evaluateLinear(exprA, 1)}, but at x=2, ${exprA.display} = ${evaluateLinear(exprA, 2)} while ${exprB.display} = ${evaluateLinear(exprB, 2)}. Matching at ONE value doesn't prove they're equivalent for every value.`,
        },
        "No",
        ["Yes"]
      ),
    },
  ];
};

/** 5(e) use substitution at TWO different values as a verification tool. */
export const verifyWithTwoValuesQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const equivalent = Math.random() < 0.5;
  let exprA: LinearExpr;
  let exprB: LinearExpr;
  if (equivalent) {
    const a = randInt(2, 6);
    const c = randInt(2, 6);
    exprA = { coeffX: a + c, constant: 0, display: `${a}x+${c}x` };
    exprB = { coeffX: a + c, constant: 0, display: `${a + c}x` };
  } else {
    const a = randInt(2, 6);
    const b = randInt(2, 9);
    exprA = { coeffX: a, constant: a * b, display: `${a}(x+${b})` };
    exprB = { coeffX: a, constant: b, display: `${a}x+${b}` };
  }
  const x1 = 1;
  const x2 = 3;
  const v1A = evaluateLinear(exprA, x1);
  const v1B = evaluateLinear(exprB, x1);
  const v2A = evaluateLinear(exprA, x2);
  const v2B = evaluateLinear(exprB, x2);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `At x=1, ${exprA.display} = ${v1A} and ${exprB.display} = ${v1B}. At x=3, ${exprA.display} = ${v2A} and ${exprB.display} = ${v2B}. Are ${exprA.display} and ${exprB.display} equivalent for every x?`,
          hint: "Compare the two pairs of values — do BOTH checks agree, or does one disagree?",
          explain: equivalent
            ? `Both checks agree (${v1A}=${v1B} and ${v2A}=${v2B}), consistent with them being equivalent — combining/distributing correctly always keeps every value the same.`
            : `The values disagree at x=3 (${v2A} ≠ ${v2B}), even though they might have matched at x=1 — so they are NOT equivalent for every x.`,
        },
        equivalent ? "Yes, equivalent" : "No, not equivalent",
        [equivalent ? "No, not equivalent" : "Yes, equivalent"]
      ),
    },
  ];
};

export const identifyingEquivalentExpressionsTest: Unit["test"] = {
  questions: [
    () => equivDistributiveQuestion("medium"),
    () => equivDistributiveQuestion("hard"),
    () => equivCombineQuestion("easy"),
    () => equivCombineQuestion("medium"),
    () => nonequivLookalikeQuestion("medium"),
    () => nonequivLookalikeQuestion("hard"),
    () => nonequivOneValueTrapQuestion("hard"),
    () => nonequivOneValueTrapQuestion("hard"),
    () => verifyWithTwoValuesQuestion("medium"),
    () => verifyWithTwoValuesQuestion("hard"),
  ],
  passScore: 9,
};
