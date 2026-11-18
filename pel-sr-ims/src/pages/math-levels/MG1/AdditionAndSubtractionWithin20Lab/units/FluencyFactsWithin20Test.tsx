import { TenFrameGroup } from "../diagrams";
import { makeTenBreakdown } from "../logic";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Fast Facts to 20 ----------
// 10 questions from 10 generators. Self-contained (no import from
// FluencyFactsWithin20.tsx, and that file never imports back from here) —
// same convention as every other *Test.tsx in this app. makeTenPair is
// duplicated locally rather than imported, since the unit file already
// imports this file's `fluencyFactsWithin20Test` export, and an import the
// other way would be a circular import that throws at module-eval time
// (silently surfacing as "Level not found").
// Fact questions have no picture: a fact is recalled, not counted from dots.

/** The two of three numbers that make 10 (0-based positions), or null. Duplicated from FluencyFactsWithin20.tsx. */
function makeTenPair(nums: [number, number, number]): [number, number] | null {
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      if (nums[i] + nums[j] === 10) return [i, j];
    }
  }
  return null;
}

/** Three different numbers where exactly one pair makes 10 (so "which two first" has one right answer). */
function makeTenTriple(): [number, number, number] {
  let x = 0;
  let z = 0;
  do {
    x = randInt(1, 9);
    z = randInt(1, 9);
  } while (x === 5 || z === x || z === 10 - x);
  return shuffle([x, 10 - x, z]) as [number, number, number];
}

/** Within 10, the bigger number written first (its own pool: within10PictureNumberQuestion writes the smaller first). */
export const factsWithin10AddNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(1, 9);
    b = randInt(1, 9);
  } while (a + b > 10 || a < b);
  const sum = a + b;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "Count on from the bigger number.", explain: `${a} + ${b} = ${sum}.`, answer: sum },
    },
  ];
};

export const factsWithin10SubNumberQuestion = (): TestQuestion[] => {
  const total = randInt(2, 10);
  const sub = randInt(0, total);
  const result = total - sub;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${total} − ${sub}?`, hint: "Count back.", explain: `${total} − ${sub} = ${result}.`, answer: result },
    },
  ];
};

export const factsWithin20AddNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } while (a + b <= 10 || a + b > 20);
  const sum = a + b;
  const big = Math.max(a, b);
  const { addToA, remainder } = makeTenBreakdown(big, sum - big);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "Fill the ten first.", explain: `${big} + ${addToA} = 10. 10 + ${remainder} = ${sum}.`, answer: sum },
    },
  ];
};

/** Subtraction that crosses 10 (C2-06: the same facts Practice adds to solve). */
export const factsWithin20SubNumberQuestion = (): TestQuestion[] => {
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 18);
    sub = randInt(2, 9);
  } while (sub <= start % 10);
  const result = start - sub;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${start} − ${sub}?`, hint: `${sub} + ☐ = ${start}.`, explain: `${sub} + ${result} = ${start}, so ${start} − ${sub} = ${result}.`, answer: result },
    },
  ];
};

/** Related facts: the subtraction that goes with a within-10 sum. */
export const relatedFactQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(1, 9);
    b = randInt(1, 9);
  } while (a + b > 10);
  const sum = a + b;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `${a} + ${b} = ${sum}. What is ${sum} − ${b}?`, hint: "Use the same three numbers.", explain: `${sum} − ${b} = ${a}.`, answer: a },
    },
  ];
};

/** "Which two do you add first?" — only triples with exactly one pair that makes 10. */
export const threeAddendGroupingChoiceQuestion = (): TestQuestion[] => {
  const nums = makeTenTriple();
  const [i, j] = makeTenPair(nums)!;
  const pairLabel = `${nums[i]} + ${nums[j]}`;
  const otherPairs = [
    [0, 1],
    [0, 2],
    [1, 2],
  ]
    .filter(([x, y]) => !(x === i && y === j))
    .map(([x, y]) => `${nums[x]} + ${nums[y]}`); // misconception: adding in written order / any two
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice({ prompt: `${nums[0]} + ${nums[1]} + ${nums[2]}. Which two do you add first?`, hint: "Find two numbers that make 10.", explain: `${pairLabel} = 10.` }, pairLabel, otherPairs),
    },
  ];
};

export const threeAddendSumNumberQuestion = (): TestQuestion[] => {
  let nums: [number, number, number];
  do {
    nums = [randInt(1, 9), randInt(1, 9), randInt(1, 9)];
  } while (nums[0] + nums[1] + nums[2] > 20);
  const total = nums[0] + nums[1] + nums[2];
  const pair = makeTenPair(nums);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `What is ${nums[0]} + ${nums[1]} + ${nums[2]}?`,
        hint: pair ? "Find two numbers that make 10." : "Add two numbers first. Then add the last one.",
        explain: `${nums[0]} + ${nums[1]} + ${nums[2]} = ${total}.`,
        answer: total,
      },
    },
  ];
};

/** Any order gives the same total, on one new example (no true/false rule
 *  statement): add the first two first, even though another pair makes 10. */
export const orderDoesNotMatterQuestion = (): TestQuestion[] => {
  let nums: [number, number, number];
  do {
    nums = makeTenTriple();
  } while (nums[0] + nums[1] === 10);
  const total = nums[0] + nums[1] + nums[2];
  const firstTwo = nums[0] + nums[1];
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `${nums[0]} + ${nums[1]} + ${nums[2]}. Add ${nums[0]} + ${nums[1]} first. What is the total?`,
        hint: "Add the first two. Then add the last number.",
        explain: `${nums[0]} + ${nums[1]} = ${firstTwo}. ${firstTwo} + ${nums[2]} = ${total}. Any order gives ${total}.`,
        answer: total,
      },
    },
  ];
};

/** A within-10 fact typed under a picture of its two numbers (replaces the
 *  old "which is a within-10 fact?" sorting question). Its own pool: the
 *  smaller number written first. */
export const within10PictureNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(1, 8);
    b = randInt(2, 9);
  } while (a + b > 10 || a >= b);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <TenFrameGroup value={a} tone="b" />
          <TenFrameGroup value={b} tone="a" />
        </div>
      ),
      difficulty: "easy",
      step: { kind: "number", prompt: `${a} + ${b} = ?`, hint: "Count on from the bigger number.", explain: `${a} + ${b} = ${a + b}.`, answer: a + b },
    },
  ];
};

/** Make a ten on a new fact. The other number is always the SMALLER one, and
 *  the explanation breaks apart the smaller number (Making Ten rule). */
export const makeTenSpeedNumberQuestion = (): TestQuestion[] => {
  const nearTen = randInt(8, 9);
  const gap = 10 - nearTen;
  const other = randInt(gap + 1, nearTen - 1);
  const sum = nearTen + other;
  const [x, y] = Math.random() < 0.5 ? [nearTen, other] : [other, nearTen];
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `Make a ten. What is ${x} + ${y}?`, hint: `Keep ${nearTen} whole. Fill the ten first.`, explain: `${nearTen} + ${gap} = 10. 10 + ${other - gap} = ${sum}.`, answer: sum },
    },
  ];
};

export const fluencyFactsWithin20Test: Unit["test"] = {
  questions: [
    factsWithin10AddNumberQuestion,
    factsWithin10SubNumberQuestion,
    factsWithin20AddNumberQuestion,
    factsWithin20SubNumberQuestion,
    relatedFactQuestion,
    threeAddendGroupingChoiceQuestion,
    threeAddendSumNumberQuestion,
    orderDoesNotMatterQuestion,
    within10PictureNumberQuestion,
    makeTenSpeedNumberQuestion,
  ],
  passScore: 9,
};
