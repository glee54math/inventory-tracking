import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { toSuperscript } from "./formatExponent";

// ---------- end-of-unit test: Equivalent Expressions via Properties ----------
// 10 single-question generators across the 5 Practice skills: distributing
// to expand, factoring out the GCF, combining basic like terms, combining
// like terms that already have coefficients, and mixed distribute+combine.
// Self-contained — no import from EquivalentExpressionsProperties.tsx (see
// ExponentsTest.tsx's comment for why).

/** 4(a) distributive property, expanding a(b+x) -> ab+ax. */
export const distributeExpandQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const ab = a * b;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Which expression is equivalent to ${a}(x+${b})?`,
          hint: `Distribute ${a} to BOTH terms inside the parentheses: ${a}×x and ${a}×${b}.`,
          explain: `${a}(x+${b}) = ${a}x + ${ab} — the ${a} multiplies every term inside the parentheses, not just the first one.`,
        },
        `${a}x+${ab}`,
        [`${a}x+${b}`] // the classic mistake: distributing to only the first term
      ),
    },
  ];
};

/** 4(b) distributive property, factoring out the GCF the other direction. */
export const distributeFactorQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const m = randInt(2, 6);
  let n = randInt(2, 6);
  while (n === m) n = randInt(2, 6);
  const g = randInt(2, 6);
  const A = g * m;
  const B = g * n;
  // Distractor targeting "divided only one term by the GCF" (forgot to
  // divide the other term).
  const forgotOne = `${g}(${m}x+${B})`;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Factor ${A}x + ${B} by pulling out the GCF of ${A} and ${B} (which is ${g}).`,
          hint: `Divide BOTH terms by ${g}: ${A}/${g} = ${m}, and ${B}/${g} = ${n}.`,
          explain: `${A}x + ${B} = ${g}(${m}x + ${n}) — dividing both terms by the GCF, ${g}.`,
        },
        `${g}(${m}x+${n})`,
        [forgotOne]
      ),
    },
  ];
};

/** 4(c) combining basic like terms, y+y+y -> ny — and the y+y+y vs y^n trap. */
export const combineBasicQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const n = randInt(3, 6);
  const expr = Array.from({ length: n }, () => "y").join("+");
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Simplify: ${expr}.`,
          hint: "This is repeated ADDITION, not multiplication — count how many y's are being added.",
          explain: `${expr} is ${n} copies of y added together, which is ${n}y — NOT y${toSuperscript(n)} (that would be repeated MULTIPLICATION, a different operation).`,
        },
        `${n}y`,
        [`y${toSuperscript(n)}`] // the signature y+y+y vs y^n conflation
      ),
    },
  ];
};

/** 4(d) combining like terms where coefficients are already present. */
export const combineWithCoeffsQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const sum = a + b;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `Simplify ${a}y + ${b}y. What is the coefficient of y in the simplified expression?`,
        hint: `Add the coefficients: ${a} + ${b}.`,
        explain: `${a}y + ${b}y = ${sum}y.`,
        answer: sum,
      },
    },
  ];
};

/** 4(e) mixed expressions requiring both distribution and combining like terms. */
export const mixedQuestion = (difficulty: "hard"): TestQuestion[] => {
  const a = randInt(2, 6);
  const b = randInt(2, 9);
  const c = randInt(1, 6);
  const combinedCoeff = a + c;
  const ab = a * b;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Simplify ${a}(x+${b}) + ${c}x.`,
          hint: `Distribute first: ${a}(x+${b}) = ${a}x + ${ab}. Then combine the x-terms: ${a}x + ${c}x.`,
          explain: `${a}(x+${b}) + ${c}x = ${a}x + ${ab} + ${c}x = ${combinedCoeff}x + ${ab}.`,
        },
        `${combinedCoeff}x+${ab}`,
        [`${a}x+${ab}+${c}x`] // distributed but never combined the like terms — looks "done" but isn't simplified
      ),
    },
  ];
};

export const equivalentExpressionsPropertiesTest: Unit["test"] = {
  questions: [
    () => distributeExpandQuestion("easy"),
    () => distributeExpandQuestion("medium"),
    () => distributeFactorQuestion("medium"),
    () => distributeFactorQuestion("hard"),
    () => combineBasicQuestion("easy"),
    () => combineBasicQuestion("medium"),
    () => combineWithCoeffsQuestion("easy"),
    () => combineWithCoeffsQuestion("medium"),
    () => mixedQuestion("hard"),
    () => mixedQuestion("hard"),
  ],
  passScore: 9,
};
