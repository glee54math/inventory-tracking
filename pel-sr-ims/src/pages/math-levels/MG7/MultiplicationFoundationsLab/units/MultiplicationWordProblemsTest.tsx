import { EqualGroups } from "../diagrams";
import { FactorRectangle } from "../../../shared/diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies — see WhatMultiplicationMeansTest.tsx's comment on why
// *Test.tsx files never import from their paired unit file.
export const KIDS = ["Maya", "Jo", "Diego", "Priya", "Sam", "Lena"];
const GROUP_NOUNS: [string, string][] = [
  ["bags", "apples"],
  ["boxes", "crayons"],
  ["baskets", "eggs"],
  ["shelves", "books"],
  ["tables", "chairs"],
];
const MEASURE_UNITS: [string, string][] = [
  ["jump rope", "feet"],
  ["ribbon", "inches"],
  ["garden hose", "feet"],
  ["board", "inches"],
];

// Q1, Q6 — visual, equal groups: pick the equation
export function equalGroupsEquationQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const [groupNoun, itemNoun] = pick(GROUP_NOUNS);
    const groups = randInt(3, 9);
    const size = randInt(3, 9);
    return [
      {
        visual: <EqualGroups groups={groups} size={size} tone="a" />,
        difficulty,
        step: choice(
          {
            prompt: `${groups} ${groupNoun}, with ${size} ${itemNoun} in each. Which equation finds the total?`,
            hint: `${groups} equal groups of ${size} — multiply.`,
            explain: `${groups} ${groupNoun} of ${size} ${itemNoun} each is ${groups} × ${size}.`,
          },
          `${groups} × ${size}`,
          [`${groups} + ${size}`, `${size} − ${groups}`]
        ),
      },
    ];
  };
}

// Q2 — easy, visual: equal groups, compute the total
export function equalGroupsTotalQuestion(): TestQuestion[] {
  const name = pick(KIDS);
  const [groupNoun, itemNoun] = pick(GROUP_NOUNS);
  const groups = randInt(3, 9);
  const size = randInt(3, 9);
  return [
    {
      visual: <EqualGroups groups={groups} size={size} tone="a" />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${name} has ${groups} ${groupNoun}, with ${size} ${itemNoun} in each. How many ${itemNoun} in all?`,
        hint: `${groups} × ${size} = ?`,
        explain: `${groups} × ${size} = ${groups * size}.`,
        answer: groups * size,
      },
    },
  ];
}

// Q3, Q7 — visual, arrays/area
export function arrayEquationQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const rows = randInt(3, 9);
    const cols = randInt(3, 9);
    return [
      {
        visual: <FactorRectangle rows={rows} cols={cols} />,
        difficulty,
        step: {
          kind: "number",
          prompt: `A garden has ${rows} rows of plants, with ${cols} in each row. How many plants in all?`,
          hint: `${rows} × ${cols} = ?`,
          explain: `${rows} × ${cols} = ${rows * cols}.`,
          answer: rows * cols,
        },
      },
    ];
  };
}

// Q4 — medium, choice: array, pick the equation (not just compute it)
export function arrayPickEquationQuestion(): TestQuestion[] {
  const rows = randInt(3, 9);
  const cols = randInt(3, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `A theater has ${rows} rows of seats, with ${cols} seats in each row. Which equation finds the total seats?`,
          hint: `${rows} rows, ${cols} in each — multiply.`,
          explain: `${rows} rows of ${cols} is ${rows} × ${cols}.`,
        },
        `${rows} × ${cols}`,
        [`${rows} + ${cols}`, `${cols} − ${rows}`]
      ),
    },
  ];
}

// Q5, Q9 — visual, measurement quantities
export function measurementQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const [item, unit] = pick(MEASURE_UNITS);
    const length = randInt(2, 9);
    const count = randInt(3, 9);
    return [
      {
        visual: <EqualGroups groups={count} size={length} tone="b" />,
        difficulty,
        step: {
          kind: "number",
          prompt: `Each ${item} is ${length} ${unit} long. How many ${unit} of material are needed to make ${count} of them?`,
          hint: `${count} × ${length} = ?`,
          explain: `${count} × ${length} = ${count * length}.`,
          answer: count * length,
        },
      },
    ];
  };
}

// Q8 — medium, choice: measurement, pick the equation (not addition)
export function measurementPickEquationQuestion(): TestQuestion[] {
  const [item, unit] = pick(MEASURE_UNITS);
  const length = randInt(2, 9);
  const count = randInt(3, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Each ${item} is ${length} ${unit} long. Which equation finds the total length of ${count} of them?`,
          hint: `${count} equal lengths of ${length} — multiply, don't add.`,
          explain: `${count} items of ${length} ${unit} each is ${count} × ${length}.`,
        },
        `${count} × ${length}`,
        [`${count} + ${length}`, `${length} − ${count}`]
      ),
    },
  ];
}

// Q10 — hard, visual: multiplicative compare
export function compareQuestion(): TestQuestion[] {
  const a = pick(KIDS);
  let b = pick(KIDS);
  while (b === a) b = pick(KIDS);
  const [, itemNoun] = pick(GROUP_NOUNS);
  const base = randInt(2, 6);
  const times = randInt(2, 6);
  return [
    {
      visual: <EqualGroups groups={times} size={base} tone="c" />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${a} has ${base} ${itemNoun}. ${b} has ${times} times as many ${itemNoun} as ${a}. Which equation finds how many ${itemNoun} ${b} has?`,
          hint: `"${times} times as many" means ${times} equal groups the size of ${base}.`,
          explain: `"${times} times as many as ${base}" is ${times} × ${base} = ${times * base}.`,
        },
        `${times} × ${base}`,
        [`${times} + ${base}`, `${times} − ${base}`]
      ),
    },
  ];
}

export const multiplicationWordProblemsTest: Unit["test"] = {
  questions: [
    equalGroupsEquationQuestion("easy"),
    equalGroupsTotalQuestion,
    arrayEquationQuestion("medium"),
    arrayPickEquationQuestion,
    measurementQuestion("medium"),
    equalGroupsEquationQuestion("medium"),
    arrayEquationQuestion("hard"),
    measurementPickEquationQuestion,
    measurementQuestion("hard"),
    compareQuestion,
  ],
  passScore: 9,
};
