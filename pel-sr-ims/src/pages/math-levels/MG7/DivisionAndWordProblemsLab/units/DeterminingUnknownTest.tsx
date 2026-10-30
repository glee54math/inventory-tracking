import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Determining the Unknown ----------
// Self-contained (no import from DeterminingUnknown.tsx), 10 questions, passScore 9.

export function unknownProductQuestion(difficulty: "easy" | "medium"): TestQuestion[] {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  return [{ visual: null, difficulty, step: { kind: "number", prompt: `${a} × ${b} = ?`, hint: "Multiply the two factors.", explain: `${a} × ${b} = ${c}.`, answer: c } }];
}

export function unknownFactorQuestion(position: "first" | "second", difficulty: "easy" | "medium" | "hard"): TestQuestion[] {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  return [
    {
      visual: null,
      difficulty,
      step:
        position === "second"
          ? { kind: "number", prompt: `${a} × ? = ${c}`, hint: `Think: ${c} ÷ ${a}.`, explain: `${a} × ${b} = ${c}, so the missing factor is ${b}.`, answer: b }
          : { kind: "number", prompt: `? × ${b} = ${c}`, hint: `Think: ${c} ÷ ${b}.`, explain: `${a} × ${b} = ${c}, so the missing factor is ${a}.`, answer: a },
    },
  ];
}

export function unknownDivisorQuestion(difficulty: "medium" | "hard"): TestQuestion[] {
  const b = randInt(2, 9);
  const q = randInt(2, 9);
  const dividend = b * q;
  return [{ visual: null, difficulty, step: { kind: "number", prompt: `${dividend} ÷ ? = ${q}`, hint: `Think: ${dividend} ÷ ${q}.`, explain: `${dividend} ÷ ${b} = ${q}, so the missing divisor is ${b}.`, answer: b } }];
}

export function unknownDividendQuestion(difficulty: "medium" | "hard"): TestQuestion[] {
  const b = randInt(2, 9);
  const q = randInt(2, 9);
  const dividend = b * q;
  return [{ visual: null, difficulty, step: { kind: "number", prompt: `? ÷ ${b} = ${q}`, hint: `Think: ${b} × ${q}.`, explain: `${dividend} ÷ ${b} = ${q}, so the missing dividend is ${dividend}.`, answer: dividend } }];
}

export function nonStandardProductLeftQuestion(): TestQuestion[] {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  return [{ visual: null, difficulty: "hard", step: { kind: "number", prompt: `? = ${a} × ${b}`, hint: "Multiply, even though the blank comes first.", explain: `${a} × ${b} = ${c}, so the missing number is ${c}.`, answer: c } }];
}

export function nonStandardFactorLeftQuestion(): TestQuestion[] {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  return [{ visual: null, difficulty: "hard", step: { kind: "number", prompt: `${c} = ${a} × ?`, hint: `Think: ${c} ÷ ${a}, even though the product is written first.`, explain: `${a} × ${b} = ${c}, so the missing factor is ${b}.`, answer: b } }];
}

export function nonStandardQuotientLeftQuestion(): TestQuestion[] {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  return [{ visual: null, difficulty: "hard", step: { kind: "number", prompt: `${b} = ${c} ÷ ?`, hint: `Think: ${c} ÷ ${b}, even though it's written with the quotient first.`, explain: `${c} ÷ ${a} = ${b}, so the missing divisor is ${a}.`, answer: a } }];
}

export function answerAfterEqualsTrapQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: 'True or False: The answer to an equation always comes right after the equals sign, like in "3 × 4 = ?".',
          hint: 'Try solving "12 = 3 × ?" — does it still work?',
          explain: 'False — an equation like "12 = 3 × ?" has the unknown on the LEFT side of the equals sign, and the missing number is still 4.',
        },
        "False",
        ["True"]
      ),
    },
  ];
}

export function identifyUnknownPositionQuestion(): TestQuestion[] {
  const a = randInt(2, 9);
  let b = randInt(2, 9);
  while (b === a) b = randInt(2, 9); // keep distractor "b" from colliding with the correct answer "a"
  const c = a * b;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `What is the missing number in "? × ${b} = ${c}"?`,
          hint: `Think: ${c} ÷ ${b}.`,
          explain: `${a} × ${b} = ${c}, so the missing number is ${a}.`,
        },
        String(a),
        [String(c * b), String(b)]
      ),
    },
  ];
}

export const determiningUnknownTest: Unit["test"] = {
  questions: [
    () => unknownProductQuestion("easy"),
    () => unknownFactorQuestion("second", "easy"),
    () => unknownFactorQuestion("first", "medium"),
    () => unknownDivisorQuestion("medium"),
    () => unknownDividendQuestion("medium"),
    nonStandardProductLeftQuestion,
    nonStandardFactorLeftQuestion,
    nonStandardQuotientLeftQuestion,
    answerAfterEqualsTrapQuestion,
    identifyUnknownPositionQuestion,
  ],
  passScore: 9,
};
