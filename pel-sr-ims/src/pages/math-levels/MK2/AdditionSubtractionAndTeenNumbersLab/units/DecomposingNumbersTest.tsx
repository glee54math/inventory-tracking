import { SplitGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Breaking Numbers Apart ----------
// 10 questions from 10 generators. Self-contained — no import from
// DecomposingNumbers.tsx, and that file never imports back from here.

/** Decompose a small number (4 or 5) — fewer part-pairs to track. */
export const decomposeSmallQuestion = (): TestQuestion[] => {
  const total = randInt(4, 5);
  const a = randInt(1, total - 1);
  const b = total - a;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `Break ${total} into two parts. The first part is ${a}. What is the second part?`, hint: "The two parts together make the whole number.", explain: `${a} + ${b} = ${total}.`, answer: b },
    },
  ];
};

/** Decompose a larger number (8, 9, or 10) — more part-pairs, harder to track. */
export const decomposeLargeQuestion = (): TestQuestion[] => {
  const total = randInt(8, 10);
  const a = randInt(1, total - 1);
  const b = total - a;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Break ${total} into two parts. The first part is ${a}. What is the second part?`, hint: "Count carefully — there are more possible pairs to keep track of with a bigger number.", explain: `${a} + ${b} = ${total}.`, answer: b },
    },
  ];
};

/** Decompose a larger number, harder edge: the part needed is small (easy to miscount). */
export const decomposeLargeSmallPartQuestion = (): TestQuestion[] => {
  const total = randInt(8, 10);
  const b = randInt(1, 2);
  const a = total - b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `Break ${total} into two parts. The first part is ${a}. What is the second part?`, hint: "The second part is small — count the remaining color carefully, don't guess.", explain: `${a} + ${b} = ${total}.`, answer: b },
    },
  ];
};

/** Find a second, different decomposition of the same number. */
export const secondWayQuestion = (): TestQuestion[] => {
  const total = randInt(4, 10);
  const a1 = randInt(1, total - 1);
  const b1 = total - a1;
  let a2 = a1 - 1;
  if (a2 <= 0) a2 = a1 + 1;
  const b2 = total - a2;
  return [
    {
      visual: <SplitGroup total={total} partA={a1} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${total} can be broken into ${a1} and ${b1}. Find a DIFFERENT way: if the first part is ${a2}, what's the second part?`, hint: "The new parts still need to add up to the same total, but shouldn't be the same pair.", explain: `${a2} + ${b2} = ${total}.`, answer: b2 },
    },
  ];
};

/** Find a THIRD, different decomposition — pushes "more than one way" further than just two. */
export const thirdWayQuestion = (): TestQuestion[] => {
  const total = randInt(6, 10);
  const used = new Set<number>();
  const a1 = randInt(1, total - 1);
  used.add(a1);
  const a2 = total - a1;
  used.add(a2);
  let a3 = 1;
  while (used.has(a3) && a3 < total) a3++;
  if (a3 >= total) a3 = Math.max(1, total - 2);
  const b3 = total - a3;
  return [
    {
      visual: <SplitGroup total={total} partA={a1} toneA="a" toneB="b" />,
      difficulty: "hard",
      step: choice(
        { prompt: `${total} can be broken into ${a1} and ${total - a1}. Is ${a3} and ${b3} ALSO a valid way to break ${total} apart?`, hint: `Check: does ${a3} + ${b3} really equal ${total}?`, explain: `Yes — ${a3} + ${b3} = ${total}, a third valid way, different from ${a1} and ${total - a1}.` },
        "Yes, it's a valid way",
        ["No, only one pair can work"] // misconception: believing only the first-found pair is valid
      ),
    },
  ];
};

/** Core misconception, asked directly: does a number have more than one decomposition? */
export const moreThanOneWayTrueFalseQuestion = (): TestQuestion[] => {
  const total = randInt(5, 9);
  const a = Math.floor(total / 2);
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `True or false: ${total} can be broken apart in MORE than one way.`, hint: `Try a couple of different first parts for ${total} and see what happens.`, explain: `True — ${total} has several valid pairs, like ${a} + ${total - a} and 1 + ${total - 1}.` },
        "True",
        ["False"] // misconception: believing a number has exactly one decomposition
      ),
    },
  ];
};

/** Generalization / false trap: is there ever only ONE way for ANY number? */
export const onlyOneWayTrapQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: every number can be broken into two parts in only ONE way.",
          hint: "Think of 5: can you find more than one pair that makes 5?",
          explain: "False — 5 can be 4 + 1, or 3 + 2 (or others). Almost every number has more than one way.",
        },
        "False",
        ["True"] // misconception: generalizing from one found pair to "that's the only way"
      ),
    },
  ];
};

/** Equal-parts special case for an even number — the one some students skip. */
export const equalPartsQuestion = (): TestQuestion[] => {
  const half = randInt(2, 5);
  const total = half * 2;
  return [
    {
      visual: <SplitGroup total={total} partA={half} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Break ${total} into two EQUAL parts. How much is in EACH part?`, hint: "Both parts need to be the exact same amount.", explain: `${half} + ${half} = ${total}.`, answer: half },
    },
  ];
};

/** Equal-parts generalization / trap: can EVERY even number split into equal parts? */
export const equalPartsTrueFalseQuestion = (): TestQuestion[] => {
  const half = randInt(2, 5);
  const total = half * 2;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `True or false: ${total} can be broken into two equal parts.`, hint: `Can you split ${total} into two groups that are the exact same size?`, explain: `True — ${total} = ${half} + ${half}.` },
        "True",
        ["False"] // misconception: thinking an equal-parts split is impossible or doesn't "count" as a real decomposition
      ),
    },
  ];
};

/** Decompose with the given part as the LARGER one, to make sure the smaller-number bucket isn't always the same shape. */
export const decomposeSmallLargerFirstPartQuestion = (): TestQuestion[] => {
  const total = randInt(4, 5);
  const a = total - 1;
  const b = total - a;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `Break ${total} into two parts. The first part is ${a}. What is the second part?`, hint: "The two parts together make the whole number.", explain: `${a} + ${b} = ${total}.`, answer: b },
    },
  ];
};

export const decomposingNumbersTest: Unit["test"] = {
  questions: [
    decomposeSmallQuestion,
    decomposeLargeQuestion,
    decomposeLargeSmallPartQuestion,
    secondWayQuestion,
    thirdWayQuestion,
    moreThanOneWayTrueFalseQuestion,
    onlyOneWayTrapQuestion,
    equalPartsQuestion,
    equalPartsTrueFalseQuestion,
    decomposeSmallLargerFirstPartQuestion,
  ],
  passScore: 9,
};
