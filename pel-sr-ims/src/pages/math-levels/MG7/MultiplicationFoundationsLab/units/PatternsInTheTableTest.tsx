import { MultTable } from "../diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies — see WhatMultiplicationMeansTest.tsx's comment on why
// *Test.tsx files never import from their paired unit file.
export const LOOKS_LIKE_IT = "Because it looks like the pattern keeps going";

// Q1 — easy, visual: even factor → even product
export function evenFactorQuestion(): TestQuestion[] {
  const e = pick([2, 4, 6, 8]);
  const m = randInt(1, 9);
  return [
    {
      visual: <MultTable highlightCol={e} />,
      difficulty: "easy",
      step: choice(
        { prompt: `Is ${e} × ${m} even or odd?`, hint: `Is ${e} even?`, explain: `${e} is even, so ${e} × ${m} = ${e * m} is even.` },
        "Even",
        ["Odd"]
      ),
    },
  ];
}

// Q2 — easy, visual: skip-counting, next number
export function skipNextQuestion(): TestQuestion[] {
  const k = randInt(2, 9);
  const start = randInt(1, 5);
  const seq = [k * start, k * (start + 1), k * (start + 2)];
  return [
    {
      visual: <MultTable highlightCol={k} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `The ${k}s column goes ${seq.join(", ")}, ... What comes next?`, hint: `Add ${k}.`, explain: `${seq[2]} + ${k} = ${k * (start + 3)}.`, answer: k * (start + 3) },
    },
  ];
}

// Q3 — medium: skip amount (no table — read it off the numbers)
export function skipAmountQuestion(): TestQuestion[] {
  const k = randInt(3, 9);
  const start = randInt(2, 6);
  const seq = [k * start, k * (start + 1), k * (start + 2), k * (start + 3)];
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `${seq.join(", ")} — how much is added each step?`, hint: `${seq[1]} − ${seq[0]} = ?`, explain: `Each step adds ${k}: one more group of ${k}.`, answer: k },
    },
  ];
}

// Q4 — medium, visual: a 9s fact
export function ninesFactQuestion(): TestQuestion[] {
  const n = randInt(2, 9);
  return [
    {
      visual: <MultTable highlightCol={9} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is 9 × ${n}?`, hint: `10 × ${n} = ${10 * n}, then take away ${n}.`, explain: `9 × ${n} = ${9 * n}.`, answer: 9 * n },
    },
  ];
}

// Q5 — medium: 9s digit sum
export function ninesDigitSumQuestion(): TestQuestion[] {
  const n = randInt(2, 9);
  const p = 9 * n;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `9 × ${n} = ${p}. What do its two digits add up to?`, hint: `${Math.floor(p / 10)} + ${p % 10} = ?`, explain: `${Math.floor(p / 10)} + ${p % 10} = 9 — every 9s fact up to 9 × 10 has digits that add to 9.`, answer: 9 },
    },
  ];
}

// Q6 — medium, visual: mirror cell
export function mirrorCellQuestion(): TestQuestion[] {
  const a = randInt(2, 9);
  let b = randInt(2, 9);
  while (b === a) b = randInt(2, 9);
  return [
    {
      visual: <MultTable mirrorPair={[a, b]} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${a} × ${b} = ${a * b}. What is ${b} × ${a}?`, hint: "Find its mirror across the diagonal.", explain: `${b} × ${a} = ${a * b} — same product, order swapped.`, answer: a * b },
    },
  ];
}

// Q7 — hard, choice: WHY the table is symmetric.
// MISCONCEPTION TARGETED: confusing commutative (reorder) with associative
// (regroup), and "coincidence" as an explanation.
export function mirrorReasonQuestion(): TestQuestion[] {
  const a = randInt(2, 9);
  let b = randInt(2, 9);
  while (b === a) b = randInt(2, 9);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Why is ${a} × ${b} in the table always the same as ${b} × ${a}?`, hint: "Which property is about swapping the order of two factors?", explain: "Swapping the order of two factors never changes the product — the commutative property." },
        "Swapping the order of two factors never changes the product",
        ["You can regroup three factors any way you like", "It's a coincidence for these two numbers"]
      ),
    },
  ];
}

// Q8 — hard, choice: odd × odd.
// MISCONCEPTION TARGETED: assuming most products (or big ones) are even.
export function oddOddQuestion(): TestQuestion[] {
  const a = pick([3, 5, 7, 9]);
  const b = pick([3, 5, 7, 9]);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Without multiplying: is ${a} × ${b} even or odd?`, hint: "Are either of the factors even?", explain: `Both are odd, and odd × odd is always odd: ${a} × ${b} = ${a * b}.` },
        "Odd — both factors are odd",
        ["Even — most products are even", "Even — it's a big number"]
      ),
    },
  ];
}

// Q9 — hard, choice: predict past the table's edge
export function predictPastEdgeQuestion(): TestQuestion[] {
  const e = pick([2, 4, 6, 8]);
  const m = randInt(11, 19);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Every product in the ${e}s column of the table is even. Will ${e} × ${m} be even too?`, hint: `What makes the ${e}s column even in the first place?`, explain: `Yes — ${e} is even, so any number of groups of ${e} is even, inside the table or not.` },
        `Yes — ${e} is even, so any number of groups of ${e} is even`,
        ["No — the pattern only holds inside the table", `Yes — ${LOOKS_LIKE_IT.toLowerCase()}`]
      ),
    },
  ];
}

// Q10 — hard, choice: best explanation of the 9s pattern.
// MISCONCEPTION TARGETED: "9s are just special/magic" (named in the plan).
export function ninesExplainQuestion(): TestQuestion[] {
  const n = randInt(2, 8);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `9 × ${n} = ${9 * n} and 9 × ${n + 1} = ${9 * (n + 1)}. Why did the tens digit go up by 1 and the ones digit go down by 1?`, hint: "Adding 9 is the same as adding 10 and then…?", explain: "Adding 9 = adding 10 (tens up 1), then taking away 1 (ones down 1)." },
        "Adding 9 is the same as adding 10 and taking away 1",
        ["9 is a magic number", LOOKS_LIKE_IT]
      ),
    },
  ];
}

export const patternsInTheTableTest: Unit["test"] = {
  questions: [
    evenFactorQuestion,
    skipNextQuestion,
    skipAmountQuestion,
    ninesFactQuestion,
    ninesDigitSumQuestion,
    mirrorCellQuestion,
    mirrorReasonQuestion,
    oddOddQuestion,
    predictPastEdgeQuestion,
    ninesExplainQuestion,
  ],
  passScore: 9,
};
