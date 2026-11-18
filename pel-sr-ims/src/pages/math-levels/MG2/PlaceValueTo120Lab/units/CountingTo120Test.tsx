import { BaseTenBlocks, HundredChart } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { cubesW, sticksW } from "./words";

// ---------- end-of-unit test: Counting to 120 ----------
// 10 questions from 10 generators. Self-contained (no import from
// CountingTo120.tsx, and that file never imports back from here) — same
// convention as every other *Test.tsx in this app, since an import the
// other way would be a circular import that throws at module-eval time.
// No chart on "what comes next?" items: even with later boxes blank, the
// numbers just before the start let a student read the answer off the chart
// (user decision 2026-11-18: a Test picture must not give the answer away;
// working it out from a picture is fine). The only chart left is on "Which
// row is 30 in?", where the question is about the chart, and it stops at the
// last number given (`hideAfter`).

/** The chart up to `n`, with `n` lit and nothing after it. */
const chartTo = (n: number) => <HundredChart marks={[{ n, tone: "a" }]} upTo={n} hideAfter />;

const rowName = (n: number) => {
  const lo = Math.floor((n - 1) / 10) * 10 + 1;
  return `${lo} to ${lo + 9}`;
};

/** Successor starting right from the baseline (counting from 1). */
export const successorFrom1Question = (): TestQuestion[] => {
  const n = randInt(1, 8);
  const after = n + 1;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `Count from 1. What comes after ${n}?`, hint: "Count one more.", explain: `${after} comes after ${n}.`, answer: after },
    },
  ];
};

/** Successor starting from any mid-range number, not a decade boundary. */
export const successorMidQuestion = (): TestQuestion[] => {
  let n: number;
  do {
    n = randInt(21, 96);
  } while (n % 10 === 0 || n % 10 === 9);
  const after = n + 1;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `What comes after ${n}?`, hint: "Count one more.", explain: `${after} comes after ${n}.`, answer: after },
    },
  ];
};

/** Counting into a new ten, asked by number and row (never by a decade name,
 *  review E1-14) — distractors are the next row (thinking 20 starts a new
 *  row) and the row before. */
export const decadeCrossChoiceQuestion = (): TestQuestion[] => {
  // d even (new ten 30, 50, 70, 90): decadeCrossNumberQuestion uses odd d, so
  // this prompt never prints the other item's answer.
  const d = randInt(1, 4) * 2;
  const start = d * 10 + 8;
  const ten = start + 2;
  return [
    {
      visual: chartTo(start),
      difficulty: "medium",
      step: choice(
        { prompt: `${start}, ${start + 1}, ${ten}. Which row is ${ten} in?`, hint: `Find ${ten} on the chart.`, explain: `${ten} ends the row ${rowName(ten)}.` },
        rowName(ten),
        [rowName(ten + 1), rowName(ten - 10)] // misconceptions: "20 starts a new row"; staying in the row before
      ),
    },
  ];
};

/** Crossing into a new ten, typed as a bare number, below 100: after 39
 *  comes 40 (review C2-32: it used to ask after 18, 28…, which never crossed).
 *  d odd (new ten 20, 40, 60, 80); decadeCrossChoiceQuestion uses even d. */
export const decadeCrossNumberQuestion = (): TestQuestion[] => {
  const d = randInt(0, 3) * 2 + 1;
  const start = d * 10 + 9;
  const next = start + 1;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What comes after ${start}?`, hint: "Count one more.", explain: `${next} comes after ${start}.`, answer: next },
    },
  ];
};

/** The 99 -> 100 step, as a choice — distractors are the two classic
 *  wrong "number names" for 100. */
export const cross100ChoiceQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "What comes after 99?", hint: "Count one more.", explain: "100 comes after 99." },
        "100",
        ["ninety-ten", "ninety-eleven"] // the two classic wrong names for 100
      ),
    },
  ];
};

/** Just past 100, typed: "99, 100. What comes next?" (101) or "100, 101.
 *  What comes next?" (102). Review C2-32: it used to ask "after 99" (the same
 *  as cross100ChoiceQuestion) or "after 98" (which crosses nothing). */
export const cross100NumberQuestion = (): TestQuestion[] => {
  const last = randInt(100, 101);
  const next = last + 1;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `${last - 1}, ${last}. What comes next?`, hint: "Count one more.", explain: `${next} comes after ${last}.`, answer: next },
    },
  ];
};

/** Counting on past 100: 103, 104 or 110-114. Review C3-46: 101 and 102
 *  would ask for, or print, cross100NumberQuestion's answer (101/102). 108 and
 *  109 would ask for, or print, a number tenVsHundredChoiceQuestion prints
 *  ("Count from 105 to 109. Then comes 110."). User decision 2026-11-17: the
 *  number and its answer end in 0-5, so they never print or ask for
 *  howManySticksQuestion's answer (116-120). */
export const range100to120Question = (): TestQuestion[] => {
  const pool = [103, 104, 110, 111, 112, 113, 114];
  const n = pool[randInt(0, pool.length - 1)];
  const next = n + 1;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What comes after ${n}?`, hint: "Count one more.", explain: `${next} comes after ${n}.`, answer: next },
    },
  ];
};

/** Reverse-direction: one LESS than a given number, anywhere in the 1-120 range. */
export const oneLessQuestion = (): TestQuestion[] => {
  const n = randInt(11, 120);
  const less = n - 1;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What number is one less than ${n}?`, hint: "Count back one.", explain: `One less than ${n} is ${less}.`, answer: less },
    },
  ];
};

/** Past 100 the count still goes to a new ten the same way: 108, 109, then
 *  110 (replaces the old true/false "does the pattern repeat?" item, review
 *  C1-08 / E1-03). */
export const after109Question = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: "108, 109. What comes next?", hint: "Count one more.", explain: "110 comes after 109.", answer: 110 },
    },
  ];
};

/** "How many?" past 100 (1.NBT.1: write the number for sticks and cubes;
 *  user decision 2026-11-17). 11 sticks and 6-9 cubes (116-119), or 12 sticks
 *  (120): the first 10 sticks are drawn as one big group (BaseTenBlocks).
 *  116-120 is kept apart from range100to120Question's numbers (103-115), so
 *  no other item prints or asks for this answer. No
 *  labels and no help: Practice's "How many?" asks for the same number after
 *  a "how many sticks" step. Replaces after109Question in the unit Test, whose
 *  answer (110) tenVsHundredChoiceQuestion printed ("Then comes 110"). */
export const howManySticksQuestion = (): TestQuestion[] => {
  const n = randInt(116, 120);
  const sticks = Math.floor(n / 10);
  const cubes = n % 10;
  return [
    {
      visual: <BaseTenBlocks tens={sticks} ones={cubes} tenTone="a" oneTone="b" />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: cubes > 0 ? "Look at the sticks and cubes. What number is this?" : "Look at the sticks. What number is this?",
        hint: "10 sticks make 100.",
        explain: cubes > 0 ? `${sticksW(sticks)} and ${cubesW(cubes)} make ${n}.` : `${sticksW(sticks)} make ${n}.`,
        answer: n,
      },
    },
  ];
};

/** New TEN vs. new HUNDRED. The user kept this item as it is (2026-11-17,
 *  C1-14): the right answer is "A new ten". */
export const tenVsHundredChoiceQuestion = (): TestQuestion[] => {
  const n = randInt(101, 108);
  const end = Math.floor(n / 10) * 10 + 9;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Count from ${n} to ${end}. Then comes ${end + 1}. Is that a new ten or a new hundred?`, hint: "From 100 to 199 is one hundred.", explain: `${end + 1} starts a new ten. From 100 to 199 is all one hundred.` },
        "A new ten",
        ["A new hundred"] // misconception: treating every new ten past 100 as a new hundred
      ),
    },
  ];
};

export const countingTo120Test: Unit["test"] = {
  questions: [
    successorFrom1Question,
    successorMidQuestion,
    decadeCrossChoiceQuestion,
    decadeCrossNumberQuestion,
    cross100ChoiceQuestion,
    cross100NumberQuestion,
    range100to120Question,
    oneLessQuestion,
    howManySticksQuestion,
    tenVsHundredChoiceQuestion,
  ],
  passScore: 9,
};
