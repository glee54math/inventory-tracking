import { TenFrameGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Fluency Facts Within 20 ----------
// 10 questions from 10 generators. Self-contained (no import from
// FluencyFactsWithin20.tsx, and that file never imports back from here) —
// same convention as every other *Test.tsx in this app. bestPairToGroup is
// duplicated locally rather than imported, since the unit file already
// imports this file's `fluencyFactsWithin20Test` export, and an import the
// other way would be a circular import that throws at module-eval time
// (silently surfacing as "Level not found").

/** Which two of three addends to group first: prefer a pair that makes
 *  exactly ten, falling back to whichever pair has the largest sum. Returns
 *  0-based indices into `nums`. Duplicated from FluencyFactsWithin20.tsx's
 *  own copy — see that file's comment on why this can't be a shared import. */
function bestPairToGroup(nums: [number, number, number]): [number, number] {
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      if (nums[i] + nums[j] === 10) return [i, j];
    }
  }
  let best: [number, number] = [0, 1];
  let bestSum = nums[0] + nums[1];
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      if (nums[i] + nums[j] > bestSum) {
        bestSum = nums[i] + nums[j];
        best = [i, j];
      }
    }
  }
  return best;
}

export const factsWithin10AddNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(1, 9);
    b = randInt(1, 9);
  } while (a + b > 10);
  const sum = a + b;
  return [
    {
      visual: <TenFrameGroup value={sum} tone="a" splitAt={a} tone2="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "Try to recall it quickly.", explain: `${a} + ${b} = ${sum}.`, answer: sum },
    },
  ];
};

export const factsWithin10SubNumberQuestion = (): TestQuestion[] => {
  const total = randInt(2, 10);
  const sub = randInt(0, total);
  const result = total - sub;
  return [
    {
      visual: <TenFrameGroup value={total} tone="c" splitAt={result} tone2="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${total} − ${sub}?`, hint: "Try to recall it quickly.", explain: `${total} − ${sub} = ${result}.`, answer: result },
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
  return [
    {
      visual: <TenFrameGroup value={sum} tone="a" splitAt={a} tone2="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "Can you use a make-ten shortcut?", explain: `${a} + ${b} = ${sum}.`, answer: sum },
    },
  ];
};

export const factsWithin20SubNumberQuestion = (): TestQuestion[] => {
  const start = randInt(11, 19);
  const sub = randInt(2, 9);
  const result = Math.max(0, start - sub);
  return [
    {
      visual: <TenFrameGroup value={start} tone="c" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${start} − ${sub}?`, hint: "Can you bridge through ten?", explain: `${start} − ${sub} = ${result}.`, answer: result },
    },
  ];
};

/** Fact-family connection: the related subtraction fact for a within-10 sum. */
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
      visual: <TenFrameGroup value={sum} tone="a" splitAt={a} tone2="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${a} + ${b} = ${sum}. What is ${sum} − ${a}?`, hint: "Addition and subtraction facts are connected.", explain: `${sum} − ${a} = ${b}.`, answer: b },
    },
  ];
};

export const threeAddendGroupingChoiceQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let c = 0;
  do {
    a = randInt(1, 9);
    b = randInt(1, 9);
    c = randInt(1, 9);
  } while (a + b + c > 20);
  const nums: [number, number, number] = [a, b, c];
  const [i, j] = bestPairToGroup(nums);
  const pairLabel = `${nums[i]} + ${nums[j]}`;
  const otherPairs = [0, 1, 2]
    .flatMap((x) => [0, 1, 2].filter((y) => y > x).map((y) => [x, y]))
    .filter(([x, y]) => !(x === i && y === j))
    .map(([x, y]) => `${nums[x]} + ${nums[y]}`);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `${a} + ${b} + ${c} — which pair should you add FIRST?`, hint: "Look for a pair that makes exactly ten, or at least the easiest step.", explain: `${pairLabel} is the easiest pair to start with.` },
        pairLabel,
        otherPairs
      ),
    },
  ];
};

export const threeAddendSumNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let c = 0;
  do {
    a = randInt(1, 9);
    b = randInt(1, 9);
    c = randInt(1, 9);
  } while (a + b + c > 20);
  const total = a + b + c;
  const nums: [number, number, number] = [a, b, c];
  const [i, j] = bestPairToGroup(nums);
  return [
    {
      visual: <TenFrameGroup value={Math.min(20, total)} tone="a" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${a} + ${b} + ${c}?`, hint: `Try grouping ${nums[i]} + ${nums[j]} first.`, explain: `${a} + ${b} + ${c} = ${total}.`, answer: total },
    },
  ];
};

/** Generalization trap: does grouping order change the total? */
export const orderDoesNotMatterQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: when adding three numbers, you get the same total no matter which two you add together first.",
          hint: "Try 4 + 8 + 2 two different ways: (4+8)+2 and 4+(8+2). Do they match?",
          explain: "Always true — the total never changes based on grouping order, which is exactly why picking an easy pair (like one that makes ten) is always safe.",
        },
        "True",
        ["False"] // misconception: thinking the grouping/order of addition changes the result
      ),
    },
  ];
};

/** Within-10 vs within-20 boundary recognition. */
export const withinTenVsTwentyChoiceQuestion = (): TestQuestion[] => {
  const within10a = randInt(1, 5);
  const within10b = randInt(1, 10 - within10a);
  let within20a = 0;
  let within20b = 0;
  do {
    within20a = randInt(2, 9);
    within20b = randInt(2, 9);
  } while (within20a + within20b <= 10 || within20a + within20b > 20);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${within10a} + ${within10b} = ${within10a + within10b}, and ${within20a} + ${within20b} = ${within20a + within20b}. Which one is a "within 10" fact?`,
          hint: "A within-10 fact never crosses past 10.",
          explain: `${within10a} + ${within10b} = ${within10a + within10b} stays within 10. The other one crosses past 10 into the teens.`,
        },
        `${within10a} + ${within10b}`,
        [`${within20a} + ${within20b}`]
      ),
    },
  ];
};

/** Applying make-ten for speed on a fact not drilled elsewhere. */
export const makeTenSpeedNumberQuestion = (): TestQuestion[] => {
  const nearTen = randInt(8, 9);
  const gap = 10 - nearTen;
  const other = randInt(gap + 1, 9);
  const sum = nearTen + other;
  return [
    {
      visual: <TenFrameGroup value={sum} tone="a" splitAt={nearTen} tone2="b" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `Without counting one-by-one, quickly find ${nearTen} + ${other}.`, hint: `${nearTen} needs just ${gap} more to make ten.`, explain: `${nearTen} + ${gap} = 10, then 10 + ${other - gap} = ${sum}.`, answer: sum },
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
    withinTenVsTwentyChoiceQuestion,
    makeTenSpeedNumberQuestion,
  ],
  passScore: 9,
};
