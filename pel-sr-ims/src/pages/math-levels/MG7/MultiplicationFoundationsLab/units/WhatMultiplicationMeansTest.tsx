import { EqualGroups } from "../diagrams";
import { FactorRectangle } from "../../../shared/diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies of WhatMultiplicationMeans.tsx's helpers — not an import,
// same "every *Test.tsx keeps its own local data" convention used throughout
// this codebase (a *Test.tsx importing back from its paired unit file threw
// a real circular-import bug once — see MATH_TSX_STYLE_GUIDE.txt section 11
// and VISUAL_COMPONENT_TODO.txt's MG2/MM1 entries).
const NOUN_PAIRS: [string, string][] = [
  ["boxes", "toys"],
  ["bags", "marbles"],
  ["shelves", "books"],
  ["jars", "buttons"],
  ["baskets", "apples"],
  ["crates", "oranges"],
];

export function distinctFactors(): [number, number] {
  const a = randInt(2, 9);
  let b = randInt(2, 9);
  while (b === a) b = randInt(2, 9);
  return [a, b];
}

// Q1 — easy, visual: equal groups, find the total
export function equalGroupsTotalQuestion(): TestQuestion[] {
  const [groups, size] = distinctFactors();
  return [
    {
      visual: <EqualGroups groups={groups} size={size} tone="a" />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `How many items in all: ${groups} groups of ${size}?`,
        hint: `${groups} × ${size} = ?`,
        explain: `${groups} × ${size} = ${groups * size}.`,
        answer: groups * size,
      },
    },
  ];
}

// Q2 — easy, visual: array, find the total
export function arrayTotalQuestion(): TestQuestion[] {
  const [rows, cols] = distinctFactors();
  return [
    {
      visual: <FactorRectangle rows={rows} cols={cols} />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: "How many items are in this array?",
        hint: `${rows} rows of ${cols} — multiply.`,
        explain: `${rows} × ${cols} = ${rows * cols}.`,
        answer: rows * cols,
      },
    },
  ];
}

// Q3 — medium, visual choice: identify rows vs. columns
export function identifyRowsQuestion(): TestQuestion[] {
  const [rows, cols] = distinctFactors();
  return [
    {
      visual: <FactorRectangle rows={rows} cols={cols} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: "Which number is the number of ROWS in this array?",
          hint: "Rows go across.",
          explain: `${rows} is the number of rows; ${cols} is the number of columns.`,
        },
        String(rows),
        [String(cols)]
      ),
    },
  ];
}

// Q4 — medium, choice: vocabulary — size of each group vs. number of groups
export function sizeOfGroupQuestion(): TestQuestion[] {
  const [groups, size] = distinctFactors();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `There are ${groups} boxes, with ${size} toys in each box. Which number is the SIZE of each group?`,
          hint: 'Which number comes right after the word "of" or "each"?',
          explain: `${size} is the size of each group; ${groups} is how many groups there are.`,
        },
        String(size),
        [String(groups)]
      ),
    },
  ];
}

// Q5 — medium, visual choice: pick the picture that shows "a groups of b"
// (the commonly-conflated-concept pair, randomized — distractor is the
// visually DIFFERENT swapped picture, b groups of a, same total).
export function matchPictureQuestion(): TestQuestion[] {
  const [groups, size] = distinctFactors();
  const swapped = Math.random() < 0.5;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <EqualGroups groups={swapped ? size : groups} size={swapped ? groups : size} tone="b" caption="Left" />
          <EqualGroups groups={swapped ? groups : size} size={swapped ? size : groups} tone="c" caption="Right" />
        </div>
      ),
      difficulty: "medium",
      step: {
        kind: "choice",
        prompt: `Which picture shows "${groups} groups of ${size}"?`,
        hint: `Count the SEPARATE groups in each picture — which has exactly ${groups}?`,
        explain: `The matching picture has exactly ${groups} separate groups, each holding ${size}.`,
        choices: ["Left picture", "Right picture"],
        correct: swapped ? 1 : 0,
      },
    },
  ];
}

// Q6 — hard, choice: true/false generalization trap
export function sameTotalSamePictureQuestion(): TestQuestion[] {
  const [a, b] = distinctFactors();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `Since ${a} × ${b} = ${b} × ${a}, do "${a} groups of ${b}" and "${b} groups of ${a}" always look like the exact same picture?`,
          hint: "Think about how many SEPARATE groups each one draws.",
          explain: `No — both equal ${a * b}, but "${a} groups of ${b}" draws ${a} groups while "${b} groups of ${a}" draws ${b} groups. Same total, different picture.`,
        },
        "False — they have the same total, but different pictures",
        ["True — any two factors in either order look the same"]
      ),
    },
  ];
}

// Q7 — medium, visual: translate a scenario to its total
export function scenarioTotalQuestion(): TestQuestion[] {
  const [groups, size] = distinctFactors();
  const [groupNoun, itemNoun] = pick(NOUN_PAIRS);
  return [
    {
      visual: <EqualGroups groups={groups} size={size} tone="a" />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${groups} ${groupNoun}, with ${size} ${itemNoun} in each. How many ${itemNoun} in all?`,
        hint: `${groups} × ${size} = ?`,
        explain: `${groups} × ${size} = ${groups * size}.`,
        answer: groups * size,
      },
    },
  ];
}

// Q8 — medium, choice: pick the matching equation (vs. a swapped-order and an addition distractor)
export function matchingEquationQuestion(): TestQuestion[] {
  const [groups, size] = distinctFactors();
  const [groupNoun, itemNoun] = pick(NOUN_PAIRS);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which equation matches "${groups} ${groupNoun}, with ${size} ${itemNoun} in each"?`,
          hint: `Say it out loud: "${groups} ${groupNoun} OF ${size} ${itemNoun}."`,
          explain: `"${groups} ${groupNoun} of ${size} ${itemNoun}" is ${groups} × ${size}.`,
        },
        `${groups} × ${size}`,
        [`${size} × ${groups}`, `${groups} + ${size}`]
      ),
    },
  ];
}

// Q9 — hard, visual: rotating an array keeps the same total
export function rotateArrayQuestion(): TestQuestion[] {
  const [rows, cols] = distinctFactors();
  return [
    {
      visual: <FactorRectangle rows={rows} cols={cols} />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `This array has ${rows} rows and ${cols} columns. If you turned it so it had ${cols} rows and ${rows} columns instead, how many items would it have?`,
        hint: "Rotating an array swaps rows and columns — does the total change?",
        explain: `Still ${rows * cols} — rotating swaps rows and columns, but ${rows} × ${cols} = ${cols} × ${rows}, so the total doesn't change.`,
        answer: rows * cols,
      },
    },
  ];
}

// Q10 — hard, visual choice: given a product + one factor, pick the matching picture
export function reverseMatchQuestion(): TestQuestion[] {
  const [groups, size] = distinctFactors();
  const swapped = Math.random() < 0.5;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <EqualGroups groups={swapped ? size : groups} size={swapped ? groups : size} tone="b" caption="Left" />
          <EqualGroups groups={swapped ? groups : size} size={swapped ? size : groups} tone="c" caption="Right" />
        </div>
      ),
      difficulty: "hard",
      step: {
        kind: "choice",
        prompt: `${groups} plates have ${size} cookies on each plate. Which picture matches?`,
        hint: `Count the SEPARATE groups — which picture has exactly ${groups}?`,
        explain: `The matching picture has ${groups} separate groups, each with ${size} cookies.`,
        choices: ["Left picture", "Right picture"],
        correct: swapped ? 1 : 0,
      },
    },
  ];
}

export const whatMultiplicationMeansTest: Unit["test"] = {
  questions: [
    equalGroupsTotalQuestion,
    arrayTotalQuestion,
    identifyRowsQuestion,
    sizeOfGroupQuestion,
    matchPictureQuestion,
    sameTotalSamePictureQuestion,
    scenarioTotalQuestion,
    matchingEquationQuestion,
    rotateArrayQuestion,
    reverseMatchQuestion,
  ],
  passScore: 9,
};
