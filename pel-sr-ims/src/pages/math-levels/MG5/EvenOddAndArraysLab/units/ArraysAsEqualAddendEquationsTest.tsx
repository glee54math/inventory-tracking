import { ArrayGrid } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Arrays as Equal-Addend Equations ----------
// 10 questions from 10 generators. Self-contained (no import from
// ArraysAsEqualAddendEquations.tsx, and that file never imports back from
// here) — same convention as every other *Test.tsx in this app.

/** rows !== cols always, so addend-size and addend-count stay genuinely
 *  distinguishable numbers — same reasoning as the unit file's own helper
 *  (duplicated here rather than imported, per this app's *Test.tsx
 *  convention of never importing from the unit file). */
function randomNonSquareArray(): [number, number] {
  const rows = randInt(2, 5);
  let cols = randInt(2, 5);
  while (cols === rows) cols = randInt(2, 5);
  return [rows, cols];
}

/** Add by rows: name the group size. */
export const rowGroupSizeQuestion = (): TestQuestion[] => {
  const [rows, cols] = randomNonSquareArray();
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="a" groupBy="row" />,
      difficulty: "easy",
      step: { kind: "number", prompt: "Adding by rows, what number do you add over and over (the size of ONE row)?", hint: "Each row has the same number of objects.", explain: `Each row has ${cols}.`, answer: cols },
    },
  ];
};

/** Add by rows: name the group count, then the total. */
export const rowGroupCountAndTotalQuestion = (): TestQuestion[] => {
  const [rows, cols] = randomNonSquareArray();
  const total = rows * cols;
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="a" groupBy="row" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Each row has ${cols}. How many times do you add ${cols} (how many rows)? Give the TOTAL after adding that many times.`, hint: `Add ${cols} a total of ${rows} times.`, explain: `${Array(rows).fill(cols).join(" + ")} = ${total}.`, answer: total },
    },
  ];
};

/** Add by columns: name the group size. */
export const colGroupSizeQuestion = (): TestQuestion[] => {
  const [rows, cols] = randomNonSquareArray();
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="b" groupBy="col" />,
      difficulty: "easy",
      step: { kind: "number", prompt: "Adding by columns, what number do you add over and over (the size of ONE column)?", hint: "Each column has the same number of objects.", explain: `Each column has ${rows}.`, answer: rows },
    },
  ];
};

/** Add by columns: total. */
export const colGroupTotalQuestion = (): TestQuestion[] => {
  const [rows, cols] = randomNonSquareArray();
  const total = rows * cols;
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="b" groupBy="col" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Each column has ${rows}, and there are ${cols} columns. What's the total?`, hint: `Add ${rows} a total of ${cols} times.`, explain: `${Array(cols).fill(rows).join(" + ")} = ${total}.`, answer: total },
    },
  ];
};

/** Reverse direction: given an equation, find the number of groups. */
export const reverseGroupCountQuestion = (): TestQuestion[] => {
  const [rows, cols] = randomNonSquareArray();
  const addend = cols;
  const count = rows;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `An array's equation is ${Array(count).fill(addend).join(" + ")}. How many groups of ${addend} are being added?`, hint: "Count the number of terms in the equation.", explain: `There are ${count} groups.`, answer: count },
    },
  ];
};

/** Reverse direction: given an equation, find the total. */
export const reverseTotalQuestion = (): TestQuestion[] => {
  const [rows, cols] = randomNonSquareArray();
  const addend = cols;
  const count = rows;
  const total = rows * cols;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `An array's equation is ${Array(count).fill(addend).join(" + ")}. What's the total?`, hint: `Add ${addend} a total of ${count} times.`, explain: `${Array(count).fill(addend).join(" + ")} = ${total}.`, answer: total },
    },
  ];
};

/** Which equation adds by rows — the addend-size-vs-count flip, head on. */
export const whichEquationIsRowsChoiceQuestion = (): TestQuestion[] => {
  const [rows, cols] = randomNonSquareArray();
  const rowEq = Array(rows).fill(cols).join(" + ");
  const colEq = Array(cols).fill(rows).join(" + ");
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="a" groupBy="row" />,
      difficulty: "hard",
      step: choice(
        { prompt: "Which equation adds this array by ROWS?", hint: `There are ${rows} rows, each of size ${cols}.`, explain: `By rows: ${rowEq}.` },
        rowEq,
        [colEq] // misconception: flipping addend size and addend count
      ),
    },
  ];
};

/** Which equation adds by columns — the complementary flip. */
export const whichEquationIsColsChoiceQuestion = (): TestQuestion[] => {
  const [rows, cols] = randomNonSquareArray();
  const rowEq = Array(rows).fill(cols).join(" + ");
  const colEq = Array(cols).fill(rows).join(" + ");
  return [
    {
      visual: <ArrayGrid rows={rows} cols={cols} tone="b" groupBy="col" />,
      difficulty: "hard",
      step: choice(
        { prompt: "Which equation adds this array by COLUMNS?", hint: `There are ${cols} columns, each of size ${rows}.`, explain: `By columns: ${colEq}.` },
        colEq,
        [rowEq] // misconception: flipping addend size and addend count
      ),
    },
  ];
};

/** Generalization / true-false trap, exactly as the plan describes. */
export const bothEquationsSameArrayTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: 3 + 3 + 3 + 3 and 4 + 4 + 4 could BOTH be correct equations for the same array.", hint: "One adds by rows, the other by columns.", explain: "True — a 4-row, 3-column array gives both equations, depending on which way you add it." },
        "True",
        ["False"] // misconception: assuming different-looking equations must describe different arrays
      ),
    },
  ];
};

/** Vocabulary trap: what the repeated number vs. the repeat count means. */
export const repeatedNumberMeaningChoiceQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "In 4 + 4 + 4 + 4 + 4 (five 4's added), what does the number of TERMS (5) tell you?", hint: "The repeated value and how many times it repeats are two different things.", explain: "The number of terms tells you how MANY groups there are — not the size of each group." },
        "How many groups there are",
        ["The size of each group"] // misconception: flipping addend size and addend count
      ),
    },
  ];
};

export const arraysAsEqualAddendEquationsTest: Unit["test"] = {
  questions: [
    rowGroupSizeQuestion,
    rowGroupCountAndTotalQuestion,
    colGroupSizeQuestion,
    colGroupTotalQuestion,
    reverseGroupCountQuestion,
    reverseTotalQuestion,
    whichEquationIsRowsChoiceQuestion,
    whichEquationIsColsChoiceQuestion,
    bothEquationsSameArrayTrueFalseQuestion,
    repeatedNumberMeaningChoiceQuestion,
  ],
  passScore: 9,
};
