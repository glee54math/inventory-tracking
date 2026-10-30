import { ArrayGrid } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Rectangular Arrays — Finding the Total ----------
// 10 questions from 10 generators. Self-contained (no import from
// RectangularArraysFindingTotal.tsx, and that file never imports back from
// here) — same convention as every other *Test.tsx in this app.

/** Small array, total — the baseline case. */
export const smallArrayTotalQuestion = (): TestQuestion[] => {
  const [rows, cols] = pick([[2, 2], [2, 3], [3, 2]] as const);
  const total = rows * cols;
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="a" groupBy="row" />,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many objects are in this array?", hint: `Add ${cols} a total of ${rows} times.`, explain: `${rows} rows of ${cols} = ${total}.`, answer: total },
    },
  ];
};

/** Small array, add by columns instead. */
export const smallArrayColumnTotalQuestion = (): TestQuestion[] => {
  const [rows, cols] = pick([[2, 2], [2, 3], [3, 2]] as const);
  const total = rows * cols;
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="a" groupBy="col" />,
      difficulty: "easy",
      step: { kind: "number", prompt: "Add this array by columns. What's the total?", hint: `Add ${rows} a total of ${cols} times.`, explain: `${cols} columns of ${rows} = ${total}.`, answer: total },
    },
  ];
};

/** Larger array, total — hard edge of the bucket (5x5 = 25). */
export const largerArrayTotalQuestion = (): TestQuestion[] => {
  const [rows, cols] = pick([[4, 5], [5, 4], [5, 5]] as const);
  const total = rows * cols;
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="b" groupBy="row" />,
      difficulty: "medium",
      step: { kind: "number", prompt: "How many objects are in this larger array?", hint: "Add row by row, carefully.", explain: `${rows} rows of ${cols} = ${total}.`, answer: total },
    },
  ];
};

/** Larger array, running partial total (targets double-counting/skipping a row). */
export const largerArrayPartialTotalQuestion = (): TestQuestion[] => {
  const [rows, cols] = pick([[4, 5], [5, 5]] as const);
  const total = rows * cols;
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="b" groupBy="row" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `After adding the first 2 rows (each with ${cols}), what's the running total so far?`, hint: `${cols} + ${cols} = ?`, explain: `${cols} + ${cols} = ${cols * 2}. (Full array total: ${total}.)`, answer: cols * 2 },
    },
  ];
};

/** Rows vs. columns — same array, both totals should match. */
export const rowsTotalQuestion = (): TestQuestion[] => {
  const rows = randInt(2, 5);
  const cols = randInt(2, 5);
  const total = rows * cols;
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="a" groupBy="row" />,
      difficulty: "medium",
      step: { kind: "number", prompt: "Add this array by ROWS. What's the total?", hint: `${rows} rows of ${cols} each.`, explain: `${rows} rows of ${cols} = ${total}.`, answer: total },
    },
  ];
};

/** Rows vs. columns — the matching columns total for the same array. */
export const colsTotalQuestion = (): TestQuestion[] => {
  const rows = randInt(2, 5);
  const cols = randInt(2, 5);
  const total = rows * cols;
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="a" groupBy="col" />,
      difficulty: "medium",
      step: { kind: "number", prompt: "Now add the SAME array by COLUMNS. What's the total?", hint: `${cols} columns of ${rows} each.`, explain: `${cols} columns of ${rows} = ${total}.`, answer: total },
    },
  ];
};

/** Rows vs. columns, true/false confirmation that both methods agree. */
export const rowsColsSameTotalTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: "True or false: adding an array by rows and adding the same array by columns always give the same total.", hint: "It's the exact same objects either way.", explain: "True — the total never depends on which direction you add." },
        "True",
        ["False"] // misconception: thinking the two methods could disagree
      ),
    },
  ];
};

/** Orientation swap — the same objects, rotated, should give the same total. */
export const orientationSwapTotalQuestion = (): TestQuestion[] => {
  const rows = randInt(2, 5);
  let cols = randInt(2, 5);
  while (cols === rows) cols = randInt(2, 5);
  const total = rows * cols;
  return [
    {
      visual: <ArrayGrid rows={cols} cols={rows} tone="c" groupBy="none" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `This array has ${cols} rows of ${rows} — the same objects as ${rows} rows of ${cols}, just rotated. What's the total?`, hint: "Rotating doesn't change how many objects there are.", explain: `Either way, the total is ${total}.`, answer: total },
    },
  ];
};

/** Orientation swap, true/false generalization. */
export const orientationSwapTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: rotating an array so rows and columns are swapped changes its total.", hint: "It's still the same objects, just turned.", explain: "False — rotating the array never changes how many objects are in it." },
        "False",
        ["True"] // misconception: thinking rotation changes the total
      ),
    },
  ];
};

/** Vocabulary trap: which direction rows and columns run. */
export const rowsColumnsDirectionChoiceQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "In a rectangular array, which direction do ROWS go?", hint: "Rows and columns run in different directions.", explain: "Rows run across (left to right); columns run up and down." },
        "Across (left to right)",
        ["Up and down"] // misconception: confusing rows with columns
      ),
    },
  ];
};

export const rectangularArraysFindingTotalTest: Unit["test"] = {
  questions: [
    smallArrayTotalQuestion,
    smallArrayColumnTotalQuestion,
    largerArrayTotalQuestion,
    largerArrayPartialTotalQuestion,
    rowsTotalQuestion,
    colsTotalQuestion,
    rowsColsSameTotalTrueFalseQuestion,
    orientationSwapTotalQuestion,
    orientationSwapTrueFalseQuestion,
    rowsColumnsDirectionChoiceQuestion,
  ],
  passScore: 9,
};
