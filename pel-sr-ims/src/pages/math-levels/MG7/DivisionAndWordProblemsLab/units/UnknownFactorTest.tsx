import { FactFamilyTriangle } from "../diagrams/FactFamily";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Division as an Unknown-Factor Problem ----------
// Self-contained (no import from UnknownFactor.tsx), 10 questions, passScore 9.

function distinctFactors(): [number, number] {
  const a = randInt(2, 9);
  let b = randInt(2, 9);
  while (b === a) b = randInt(2, 9);
  return [a, b];
}

/** c ÷ a = ? derived from a known multiplication fact. */
export function deriveQuotientQuestion(which: "first" | "second", difficulty: "easy" | "medium"): TestQuestion[] {
  const [a, b] = distinctFactors();
  const c = a * b;
  const divisor = which === "first" ? a : b;
  const answer = which === "first" ? b : a;
  return [
    {
      visual: <FactFamilyTriangle a={a} b={b} c={c} unknown={which === "first" ? "b" : "a"} tone="a" />,
      difficulty,
      step: {
        kind: "number",
        prompt: `You know ${a} × ${b} = ${c}. What is ${c} ÷ ${divisor}?`,
        hint: `Think: ${divisor} × ? = ${c}.`,
        explain: `${c} ÷ ${divisor} = ${answer}.`,
        answer,
      },
    },
  ];
}

/** Missing-factor framing: ? x b = c or a x ? = c. */
export function missingFactorQuestion(which: "first" | "second", difficulty: "easy" | "medium" | "hard"): TestQuestion[] {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  return [
    {
      visual: <FactFamilyTriangle a={a} b={b} c={c} unknown={which === "first" ? "a" : "b"} tone="b" />,
      difficulty,
      step: {
        kind: "number",
        prompt: which === "first" ? `? × ${b} = ${c}. What number goes in the blank?` : `${a} × ? = ${c}. What number goes in the blank?`,
        hint: which === "first" ? `${c} ÷ ${b} is the same question.` : `${c} ÷ ${a} is the same question.`,
        explain: which === "first" ? `${a} × ${b} = ${c}, so the missing factor is ${a}.` : `${a} × ${b} = ${c}, so the missing factor is ${b}.`,
        answer: which === "first" ? a : b,
      },
    },
  ];
}

/** Square fact quotient — free-typed number. */
export function squareFactQuotientQuestion(): TestQuestion[] {
  const a = randInt(2, 9);
  const c = a * a;
  return [
    {
      visual: <FactFamilyTriangle a={a} b={a} c={c} unknown="a" tone="c" />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${a} × ${a} = ${c}. What is ${c} ÷ ${a}?`,
        hint: `Think: ${a} × ? = ${c}.`,
        explain: `${c} ÷ ${a} = ${a}.`,
        answer: a,
      },
    },
  ];
}

/** Square fact collapse — multiple choice. */
export function squareFactCountQuestion(): TestQuestion[] {
  const a = randInt(2, 9);
  const c = a * a;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${a} × ${a} = ${c}. How many DIFFERENT division facts does this one multiplication fact make?`,
          hint: "Write the division fact both ways — are they actually different?",
          explain: `Only 1 — since both factors are ${a}, there's just one division fact: ${c} ÷ ${a} = ${a}.`,
        },
        "1",
        ["2", "0"]
      ),
    },
  ];
}

/** Reasoning: no whole-number partner for a non-evenly-dividing pair. */
export function noWholeNumberPartnerQuestion(): TestQuestion[] {
  const divisor = randInt(3, 9);
  let dividend = 0;
  do {
    dividend = randInt(divisor + 1, divisor * 9 + divisor - 1);
  } while (dividend % divisor === 0);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `Does ${dividend} ÷ ${divisor} have a whole-number "missing factor" partner?`,
          hint: `Check the multiples of ${divisor} near ${dividend}.`,
          explain: `No — no whole number times ${divisor} equals exactly ${dividend}, so there's a remainder instead.`,
        },
        `No — no whole number times ${divisor} equals exactly ${dividend}`,
        ["Yes — every division problem has one", `Yes — any number near ${dividend} works`]
      ),
    },
  ];
}

/** Correctly identify a fact family's matching pair — distractor is a plausible but wrong pairing. */
export function matchingFamilyQuestion(): TestQuestion[] {
  const [a, b] = distinctFactors();
  const c = a * b;
  // A believable-but-wrong distractor: swaps which factor pairs with which
  // quotient (still uses a, b, c, just mismatched) — not a random unrelated fact.
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${a} × ${b} = ${c}. Which pair of division facts belongs to this same fact family?`,
          hint: "Both division facts must use the exact same three numbers as the multiplication fact.",
          explain: `${c} ÷ ${a} = ${b} and ${c} ÷ ${b} = ${a} — same three numbers, just rearranged.`,
        },
        `${c} ÷ ${a} = ${b} and ${c} ÷ ${b} = ${a}`,
        [`${c} ÷ ${a} = ${a} and ${c} ÷ ${b} = ${b}`, `${a} ÷ ${b} = ${c} and ${b} ÷ ${a} = ${c}`]
      ),
    },
  ];
}

/** Generalization trap: mult/div facts as separate vs. connected. */
export function connectedFactsTrapQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: "True or False: Multiplication facts and division facts must be memorized completely separately from each other.",
          hint: "Does knowing a multiplication fact ever help you with a related division fact?",
          explain: "False — a division fact is a multiplication fact with a different missing number. Knowing one helps you find the other.",
        },
        "False",
        ["True"]
      ),
    },
  ];
}

export const unknownFactorTest: Unit["test"] = {
  questions: [
    () => deriveQuotientQuestion("first", "easy"),
    () => deriveQuotientQuestion("second", "easy"),
    () => missingFactorQuestion("first", "medium"),
    () => missingFactorQuestion("second", "medium"),
    squareFactQuotientQuestion,
    squareFactCountQuestion,
    matchingFamilyQuestion,
    connectedFactsTrapQuestion,
    noWholeNumberPartnerQuestion,
    () => missingFactorQuestion("first", "hard"),
  ],
  passScore: 9,
};
