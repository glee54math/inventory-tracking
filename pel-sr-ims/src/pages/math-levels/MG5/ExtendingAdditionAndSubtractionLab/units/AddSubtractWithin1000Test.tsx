import { PlaceValueColumns } from "../diagrams";
import { buildAddColumns, buildSubColumns, borrowsThroughZero, regroupCount, type ColumnBreakdown } from "../logic";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Adding and Subtracting Within 1000 ----------
// 10 questions from 10 generators. Self-contained (no import from
// AddSubtractWithin1000.tsx, and that file never imports back from here).

export const addNoRegroupNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(100, 800);
    b = randInt(100, 199);
    breakdown = buildAddColumns([a, b], 3);
  } while (regroupCount(breakdown) !== 0 || breakdown.total >= 1000);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "No regrouping needed.", explain: `${a} + ${b} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

export const addSingleRegroupNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(100, 800);
    b = randInt(100, 199);
    breakdown = buildAddColumns([a, b], 3);
  } while (regroupCount(breakdown) !== 1 || breakdown.total >= 1000);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "One column regroups into the next.", explain: `${a} + ${b} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

export const addDoubleRegroupNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(100, 700);
    b = randInt(100, 299);
    breakdown = buildAddColumns([a, b], 3);
  } while (regroupCount(breakdown) !== 2 || breakdown.total >= 1000);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "Both the ones and tens columns regroup here.", explain: `${a} + ${b} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

export const subNoRegroupNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(200, 899);
    b = randInt(100, a - 1);
    breakdown = buildSubColumns(a, b, 3);
  } while (breakdown.carry[0] !== 0 || breakdown.carry[1] !== 0);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${a} − ${b}?`, hint: "No borrowing needed.", explain: `${a} − ${b} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

export const subSingleBorrowNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(200, 899);
    b = randInt(100, a - 1);
    breakdown = buildSubColumns(a, b, 3);
  } while (breakdown.carry[0] + breakdown.carry[1] !== 1);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${a} − ${b}?`, hint: "One place borrows from the next.", explain: `${a} − ${b} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

export const subBorrowThroughZeroNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    const hundreds = randInt(2, 9);
    const ones = randInt(0, 9);
    a = hundreds * 100 + ones;
    b = randInt(100, a - 1);
    breakdown = buildSubColumns(a, b, 3);
  } while (!borrowsThroughZero(breakdown));
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${a} − ${b}?`, hint: "The tens place is 0 — borrow from the hundreds place first.", explain: `${a} − ${b} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

/** Misconception distractor: believing a 0 in the tens place means you
 *  simply can't subtract there at all. */
export const borrowThroughZeroChoiceQuestion = (): TestQuestion[] => {
  const hundreds = randInt(3, 9);
  const b3 = randInt(100, hundreds * 100 - 1);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `${hundreds}00 − ${b3}: the tens digit is 0. What do you do first?`, hint: "The tens place has nothing to lend yet.", explain: "Borrow a hundred from the hundreds place first — that gives the tens place something to work with (and then lend to the ones place)." },
        "Borrow a hundred from the hundreds place",
        ["You can't subtract — a 0 in the tens place means it's stuck", "Skip the tens place and borrow straight from the ones place"]
      ),
    },
  ];
};

/** Round-then-estimate, same robust construction as Practice's own estimate
 *  bucket (see AddSubtractWithin1000.tsx's comment on the 50/100 margin). */
export const estimateReasonableChoiceQuestion = (): TestQuestion[] => {
  const a = randInt(2, 6) * 100 + randInt(-20, 20);
  const b = randInt(2, 3) * 100 + randInt(-20, 20);
  const total = a + b;
  const roundA = Math.round(a / 100) * 100;
  const roundB = Math.round(b / 100) * 100;
  const estimate = roundA + roundB;
  const giveWrong = Math.random() < 0.5;
  const shown = giveWrong ? total - 100 : total;
  const reasonable = Math.abs(shown - estimate) <= 50;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `${a} + ${b} rounds to about ${roundA} + ${roundB} = ${estimate}. A computed answer is ${shown}. Is that reasonable?`, hint: "Compare the computed answer to your estimate.", explain: reasonable ? `${shown} is close to the estimate ${estimate}, so it's reasonable.` : `${shown} is far from the estimate ${estimate} — that's a sign of a mistake (the real total is ${total}).` },
        reasonable ? "Yes, that's reasonable" : "No, that's not reasonable",
        [reasonable ? "No, that's not reasonable" : "Yes, that's reasonable"]
      ),
    },
  ];
};

export const estimateValueNumberQuestion = (): TestQuestion[] => {
  const a = randInt(2, 6) * 100 + randInt(-20, 20);
  const b = randInt(2, 3) * 100 + randInt(-20, 20);
  const roundA = Math.round(a / 100) * 100;
  const roundB = Math.round(b / 100) * 100;
  const estimate = roundA + roundB;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `Round ${a} and ${b} to the nearest hundred, then add. What's the estimate?`, hint: "Round each number first.", explain: `${roundA} + ${roundB} = ${estimate}.`, answer: estimate },
    },
  ];
};

/** Generalization trap, restated from the CFU with fresh numbers. */
export const zeroCannotSubtractTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: if a number's tens digit is 0, subtraction is impossible there.", hint: "Borrowing from the hundreds place fixes this.", explain: "False — borrow a hundred from the hundreds place first, and the tens place has 10 tens to work with." },
        "False",
        ["True"]
      ),
    },
  ];
};

export const addSubtractWithin1000Test: Unit["test"] = {
  questions: [
    addNoRegroupNumberQuestion,
    addSingleRegroupNumberQuestion,
    addDoubleRegroupNumberQuestion,
    subNoRegroupNumberQuestion,
    subSingleBorrowNumberQuestion,
    subBorrowThroughZeroNumberQuestion,
    borrowThroughZeroChoiceQuestion,
    estimateReasonableChoiceQuestion,
    estimateValueNumberQuestion,
    zeroCannotSubtractTrueFalseQuestion,
  ],
  passScore: 9,
};
