import { GridRow } from "../diagrams";
import { tenthsHundredthsPair } from "../lib/decimals";
import { randInt } from "../../../shared/lib/math";
import { Frac } from "../../../shared/engine/controls";
import { choice, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Self-contained: never imports from TenthsToHundredths.tsx (that file imports
// THIS one, so the reverse would be a circular import — see the lab-builder
// brief). Shared number-picking lives in ../lib/decimals.ts instead.

const addGrids = (a: number, b: number) => <GridRow size={110} segments={[{ count: 10 * a, tone: "a" }, { count: b, tone: "c" }]} />;

/** "a/10 + b/100" or "b/100 + a/10" — which order is shown is randomized so
 *  the tenths fraction isn't always first. */
const sumExpr = (a: number, b: number, tenthsFirst: boolean) =>
  tenthsFirst ? (
    <>
      <Frac n={a} d={10} /> + <Frac n={b} d={100} />
    </>
  ) : (
    <>
      <Frac n={b} d={100} /> + <Frac n={a} d={10} />
    </>
  );

// Q1 — tenths -> hundredths (typed)
export function convertQuestion(difficulty: "easy" | "medium", withVisual: boolean): () => TestQuestion[] {
  return () => {
    const n = randInt(1, 9);
    return [
      {
        visual: withVisual ? <GridRow size={110} tenthsOnly segments={[{ count: 10 * n, tone: "a" }]} /> : null,
        difficulty,
        step: {
          kind: "number",
          answer: 10 * n,
          suffix: "hundredths",
          prompt: (
            <>
              Fill in the missing top number: <Frac n={n} d={10} /> = <Frac n="?" d={100} />
            </>
          ),
          hint: "Each tenth is 10 hundredths.",
          explain: `Each tenth strip holds 10 hundredths, so ${n} tenths = ${10 * n} hundredths: ${n}/10 = ${10 * n}/100.`,
        },
      },
    ];
  };
}

// Q2 — hundredths -> tenths (typed, reverse direction)
export function convertBackQuestion(): TestQuestion[] {
  const n = randInt(1, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        answer: n,
        suffix: "tenths",
        prompt: (
          <>
            Fill in the missing top number: <Frac n="?" d={10} /> = <Frac n={10 * n} d={100} />
          </>
        ),
        hint: "Every 10 hundredths make 1 tenth.",
        explain: `${10 * n} hundredths is ${n} groups of 10 hundredths, and each group is 1 tenth: ${10 * n}/100 = ${n}/10.`,
      },
    },
  ];
}

// Q3 — tenths + hundredths, sum under one whole (typed)
export function addQuestion(difficulty: "medium" | "hard", withVisual: boolean): () => TestQuestion[] {
  return () => {
    const { a, b } = tenthsHundredthsPair("add");
    const s = 10 * a + b;
    return [
      {
        visual: withVisual ? addGrids(a, b) : null,
        difficulty,
        step: {
          kind: "number",
          answer: s,
          suffix: "hundredths",
          prompt: (
            <>
              {sumExpr(a, b, Math.random() < 0.5)} = <Frac n="?" d={100} />
            </>
          ),
          hint: `Rewrite ${a}/10 as hundredths first.`,
          explain: `${a}/10 = ${10 * a}/100, and ${10 * a}/100 + ${b}/100 = ${s}/100.`,
        },
      },
    ];
  };
}

// Q4 — single-digit hundredths sum (choice)
export function smallAddChoiceQuestion(): TestQuestion[] {
  let { a, b } = tenthsHundredthsPair("small");
  // a ≠ b keeps the "swapped places" distractor (10b + a) from equalling the answer.
  while (a === b) ({ a, b } = tenthsHundredthsPair("small"));
  const s = 10 * a + b;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: (
            <>
              Which is equal to {sumExpr(a, b, true)}?
            </>
          ),
          hint: `How many hundredths is ${a}/10?`,
          explain: `${a}/10 = ${10 * a}/100, so the total is ${10 * a}/100 + ${b}/100 = ${s}/100.`,
        },
        `${s}/100`,
        [
          `${a + b}/100`, // added the top numbers without rewriting a/10 as hundredths
          `${10 * b + a}/100`, // swapped places: treated the tenths digit as hundredths and vice versa
          `${s}/10`, // right top number, but kept the tenths denominator
        ]
      ),
    },
  ];
}

// Q5 — spot the "add the tops" error (choice)
export function spotErrorQuestion(): TestQuestion[] {
  const { a, b } = tenthsHundredthsPair("add");
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `Sam says ${a}/10 + ${b}/100 = ${a + b}/100. What went wrong?`,
          hint: "Are tenths and hundredths the same size pieces?",
          explain: `Tenths and hundredths are different-size pieces, so their top numbers can't be added yet. ${a}/10 = ${10 * a}/100, so the sum is ${10 * a + b}/100.`,
        },
        `He added the top numbers before rewriting ${a}/10 as hundredths`,
        [
          "He should have added the bottom numbers too", // "add everything" misconception
          "Nothing — his answer is right", // accepts the add-the-tops shortcut
        ]
      ),
    },
  ];
}

// Q6 — past one whole, written as wholes + hundredths (two typed blanks)
export function carrySentenceQuestion(): TestQuestion[] {
  const { a, b } = tenthsHundredthsPair("carry");
  const s = 10 * a + b;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: sentence(
        {
          prompt: `Add ${a}/10 + ${b}/100, then write the total as wholes and hundredths.`,
          hint: "100 hundredths make 1 whole.",
          explain: `${a}/10 = ${10 * a}/100, so the total is ${s}/100. 100 of those hundredths make 1 whole, leaving ${s - 100}/100.`,
        },
        `${a}/10 + ${b}/100 = `,
        numberBlank(1),
        " whole and ",
        numberBlank(s - 100),
        "/100"
      ),
    },
  ];
}

// Q7 — past one whole, total hundredths (typed)
export function carryTotalQuestion(difficulty: "medium" | "hard", withVisual: boolean): () => TestQuestion[] {
  return () => {
    const { a, b } = tenthsHundredthsPair("carry");
    const s = 10 * a + b;
    return [
      {
        visual: withVisual ? addGrids(a, b) : null,
        difficulty,
        step: {
          kind: "number",
          answer: s,
          suffix: "hundredths",
          prompt: (
            <>
              {sumExpr(a, b, Math.random() < 0.5)} = <Frac n="?" d={100} />
            </>
          ),
          hint: `Rewrite ${a}/10 as hundredths, then add. The answer can be more than 100.`,
          explain: `${a}/10 = ${10 * a}/100, and ${10 * a}/100 + ${b}/100 = ${s}/100 — more than one whole (${s}/100 = 1 and ${s - 100}/100).`,
        },
      },
    ];
  };
}

// Q8 — true/false: n/10 = n/100?
export function sameTopTrapQuestion(): TestQuestion[] {
  const n = randInt(2, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `True or false: ${n}/10 = ${n}/100.`,
          hint: "Which is bigger: one tenth or one hundredth?",
          explain: `False — a tenth is 10 times as big as a hundredth. ${n}/10 = ${10 * n}/100, not ${n}/100.`,
        },
        "False",
        ["True"] // "same top number = same amount"
      ),
    },
  ];
}

// Q9 — pick the equivalent hundredths fraction (choice)
export function pickEquivalentQuestion(): TestQuestion[] {
  const n = randInt(1, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which fraction is equal to ${n}/10?`,
          hint: "Multiply the top AND the bottom by 10.",
          explain: `Multiply the top and the bottom by 10: ${n}/10 = ${10 * n}/100. Each tenth is 10 hundredths.`,
        },
        `${10 * n}/100`,
        [
          `${n}/100`, // changed only the bottom number
          `${10 * n}/10`, // changed only the top number
          `${n + 10}/100`, // added 10 instead of multiplying by 10
        ]
      ),
    },
  ];
}

// Q10 — missing hundredths addend (typed, reverse direction)
export function missingAddendQuestion(): TestQuestion[] {
  const { a, b } = tenthsHundredthsPair("add");
  const s = 10 * a + b;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        answer: b,
        suffix: "hundredths",
        prompt: (
          <>
            Fill in the missing top number: <Frac n={a} d={10} /> + <Frac n="?" d={100} /> = <Frac n={s} d={100} />
          </>
        ),
        hint: `${a}/10 is ${10 * a} hundredths. How many more make ${s}?`,
        explain: `${a}/10 = ${10 * a}/100, and ${10 * a} + ${b} = ${s}, so the missing fraction is ${b}/100.`,
      },
    },
  ];
}

export const tenthsToHundredthsTest: Unit["test"] = {
  questions: [
    convertQuestion("easy", true),
    convertBackQuestion,
    addQuestion("medium", true),
    smallAddChoiceQuestion,
    spotErrorQuestion,
    carrySentenceQuestion,
    carryTotalQuestion("hard", false),
    sameTopTrapQuestion,
    pickEquivalentQuestion,
    missingAddendQuestion,
  ],
  passScore: 9,
};
