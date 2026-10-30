import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Division Fact Fluency ----------
// Self-contained (no import from FactFluency.tsx), 10 questions, passScore 9.

const EASY_DIVISORS = [1, 2, 5, 10];
const MID_DIVISORS = [3, 4];
const HARD_DIVISORS = [6, 7, 8, 9];

export function easyAnchorQuestion(difficulty: "easy" | "medium"): TestQuestion[] {
  const divisor = pick(EASY_DIVISORS);
  const quotient = randInt(2, 10);
  const dividend = divisor * quotient;
  return [
    {
      visual: null,
      difficulty,
      step: { kind: "number", prompt: `${dividend} ÷ ${divisor} = ?`, hint: `Think: ${divisor} × ? = ${dividend}.`, explain: `${dividend} ÷ ${divisor} = ${quotient}.`, answer: quotient },
    },
  ];
}

export function midDivisorQuestion(difficulty: "easy" | "medium"): TestQuestion[] {
  const divisor = pick(MID_DIVISORS);
  const quotient = randInt(2, 9);
  const dividend = divisor * quotient;
  return [
    {
      visual: null,
      difficulty,
      step: { kind: "number", prompt: `${dividend} ÷ ${divisor} = ?`, hint: `Think: ${divisor} × ? = ${dividend}.`, explain: `${dividend} ÷ ${divisor} = ${quotient}.`, answer: quotient },
    },
  ];
}

export function hardDivisorQuestion(difficulty: "medium" | "hard"): TestQuestion[] {
  const divisor = pick(HARD_DIVISORS);
  let quotient = randInt(2, 9);
  while (quotient === divisor) quotient = randInt(2, 9);
  const dividend = divisor * quotient;
  return [
    {
      visual: null,
      difficulty,
      step: { kind: "number", prompt: `${dividend} ÷ ${divisor} = ?`, hint: `Think: ${divisor} × ? = ${dividend}.`, explain: `${dividend} ÷ ${divisor} = ${quotient}.`, answer: quotient },
    },
  ];
}

export function squareDerivedQuestion(): TestQuestion[] {
  const n = randInt(2, 10);
  const dividend = n * n;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `${dividend} ÷ ${n} = ?`, hint: `This one's a square fact — think ${n} × ? = ${dividend}.`, explain: `${dividend} ÷ ${n} = ${n}.`, answer: n },
    },
  ];
}

export function nearMissChoiceQuestion(): TestQuestion[] {
  const divisor = randInt(3, 9);
  let quotient = randInt(3, 9);
  while (quotient === divisor) quotient = randInt(3, 9);
  const dividend = divisor * quotient;
  const adjQuotient = quotient - 1;
  const adjDividend = dividend - divisor;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${dividend} ÷ ${divisor} = ${quotient}. Which of these is ALSO true, with the divisor and quotient swapped?`,
          hint: `${divisor} × ${quotient} = ${dividend} — what's the other way to write that as a division fact?`,
          explain: `${dividend} ÷ ${quotient} = ${divisor} — same dividend, same two numbers, roles traded.`,
        },
        `${dividend} ÷ ${quotient} = ${divisor}`,
        [`${dividend} ÷ ${divisor} = ${divisor}`, `${adjDividend} ÷ ${divisor} = ${adjQuotient}`]
      ),
    },
  ];
}

export function countByOnesTrapQuestion(): TestQuestion[] {
  const divisor = pick(HARD_DIVISORS);
  const quotient = randInt(5, 9);
  const dividend = divisor * quotient;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `True or False: The fastest way to solve ${dividend} ÷ ${divisor} is to count up by 1s from 0 until you reach ${dividend}.`,
          hint: "Is there a multiplication fact you already know that gets you there faster?",
          explain: `False — using the matching multiplication fact (${divisor} × ? = ${dividend}) is much faster than counting by 1s.`,
        },
        "False",
        ["True"]
      ),
    },
  ];
}

export const factFluencyTest: Unit["test"] = {
  questions: [
    () => easyAnchorQuestion("easy"),
    () => midDivisorQuestion("easy"),
    () => hardDivisorQuestion("medium"),
    () => hardDivisorQuestion("medium"),
    squareDerivedQuestion,
    nearMissChoiceQuestion,
    nearMissChoiceQuestion,
    () => easyAnchorQuestion("medium"),
    countByOnesTrapQuestion,
    () => hardDivisorQuestion("hard"),
  ],
  passScore: 9,
};
