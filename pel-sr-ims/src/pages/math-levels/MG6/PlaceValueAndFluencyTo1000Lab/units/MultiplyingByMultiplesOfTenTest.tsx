import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { TensGroupArray } from "../diagrams/PlaceValueBlocks";

// ---------- end-of-unit test: Multiplying by Multiples of Ten ----------
// Self-contained — does NOT import from MultiplyingByMultiplesOfTen.tsx (no
// cross-import between a unit and its Test file, in either direction). Fact
// helpers are duplicated verbatim from the unit file.

const isHardFact = (a: number, m: number): boolean => a >= 6 && m >= 6;
const isEasyFact = (a: number, m: number): boolean => a >= 2 && m >= 2 && !isHardFact(a, m) && (a === 2 || a === 5 || m === 2 || m === 5 || (a <= 5 && m <= 5));
const randEasyFact = (): [number, number] => {
  let a: number, m: number;
  do {
    a = randInt(2, 9);
    m = randInt(2, 9);
  } while (!isEasyFact(a, m));
  return [a, m];
};
const randHardFact = (): [number, number] => [randInt(6, 9), randInt(6, 9)];

const productQuestion = (a: number, m: number, difficulty: TestQuestion["difficulty"], withVisual: boolean): TestQuestion[] => [
  {
    visual: withVisual ? <TensGroupArray groups={a} perGroup={m} tone="a" /> : null,
    difficulty,
    step: {
      kind: "number",
      prompt: `${a} × ${m * 10} = ?`,
      hint: `${m * 10} is ${m} tens.`,
      explain: `${a} × ${m * 10} = ${a} × ${m} tens = ${a * m} tens = ${a * m * 10}.`,
      answer: a * m * 10,
    },
  },
];

export const byTenQuestion = (): TestQuestion[] => {
  const a = randInt(2, 9);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${a} × 10 = ?`,
        hint: `${a} groups of 10 is ${a} tens.`,
        explain: `${a} × 10 = ${a} tens = ${a * 10}.`,
        answer: a * 10,
      },
    },
  ];
};
export const easyFactQuestion = (): TestQuestion[] => {
  const [a, m] = randEasyFact();
  return productQuestion(a, m, "easy", true);
};
export const easyFactQuestion2 = (): TestQuestion[] => {
  const [a, m] = randEasyFact();
  return productQuestion(a, m, "medium", false);
};
export const hardFactQuestion = (): TestQuestion[] => {
  const [a, m] = randHardFact();
  return productQuestion(a, m, "medium", true);
};
export const hardFactQuestion2 = (): TestQuestion[] => {
  const [a, m] = randHardFact();
  return productQuestion(a, m, "hard", false);
};

const reverseQuestion = (a: number, m: number, difficulty: TestQuestion["difficulty"]): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: {
      kind: "number",
      prompt: `${a} × ___ = ${a * m * 10}. The missing number is a multiple of ten. What is it?`,
      hint: `${a * m * 10} is ${a * m} tens. Which fact with ${a} makes ${a * m}?`,
      explain: `${a} × ${m * 10} = ${a} × ${m} tens = ${a * m} tens = ${a * m * 10}.`,
      answer: m * 10,
    },
  },
];
export const reverseEasyQuestion = (): TestQuestion[] => {
  const [a, m] = randEasyFact();
  return reverseQuestion(a, m, "medium");
};
export const reverseHardQuestion = (): TestQuestion[] => {
  const [a, m] = randHardFact();
  return reverseQuestion(a, m, "hard");
};

/** The zero-count error the plan names explicitly (6 × 50 = 300, not 30 or 3000). */
export const zeroCountQuestion = (): TestQuestion[] => {
  // Bias toward facts that themselves already end in 0 (like 6 × 5 = 30) —
  // exactly where students confuse the fact's own zero with the ten's zero.
  const pairs: [number, number][] = [];
  for (let a = 2; a <= 9; a++) for (let m = 2; m <= 9; m++) if ((a * m) % 10 === 0) pairs.push([a, m]);
  const [a, m] = Math.random() < 0.6 ? pairs[randInt(0, pairs.length - 1)] : randHardFact();
  const fact = a * m;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${a} × ${m} = ${fact}. What is ${a} × ${m * 10}?`,
          hint: `${m * 10} is ${m} tens, so the answer is ${fact} TENS.`,
          explain: `${a} × ${m * 10} = ${fact} tens = ${fact * 10}.`,
        },
        String(fact * 10),
        [
          // Misconception: stops at the one-digit fact, forgetting the factor is tens.
          String(fact),
          // Misconception: when the fact already ends in 0, adds an extra zero for it.
          String(fact * 100),
        ]
      ),
    },
  ];
};

/** Explain the shortcut in place-value terms, not just produce the number. */
export const explainQuestion = (): TestQuestion[] => {
  const [a, m] = randHardFact();
  const fact = a * m;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which sentence best explains why ${a} × ${m * 10} = ${fact * 10}?`,
          hint: "Which one says what the digit in the multiple of ten actually stands for?",
          explain: `${m * 10} is ${m} tens, so ${a} × ${m * 10} = ${fact} tens = ${fact * 10}.`,
        },
        `${m * 10} is ${m} tens, so ${a} × ${m * 10} is ${fact} tens, which is ${fact * 10}`,
        [
          // Misconception: a memorized rule with no place-value meaning behind it.
          `You always just stick a 0 on the end of any answer`,
          // Misconception: multiplies digit-by-digit (a × m and a × 0) and glues them together.
          `${a} × ${m} = ${fact} and ${a} × 0 = 0, so put ${fact} and 0 side by side`,
        ]
      ),
    },
  ];
};

export const multiplyMultiplesOfTenTest: Unit["test"] = {
  questions: [byTenQuestion, easyFactQuestion, easyFactQuestion2, hardFactQuestion, hardFactQuestion2, reverseEasyQuestion, reverseHardQuestion, zeroCountQuestion, explainQuestion, () => productQuestion(...randHardFact(), "hard", false)],
  passScore: 9,
};
