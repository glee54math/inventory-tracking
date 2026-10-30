import { FractionBar, NumberLine } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, selectBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copy — see WhatAFractionIsTest.tsx's comment on why *Test.tsx
// files never import generators (or shared constants) back from their
// paired main unit file.
const DENOMS = [2, 3, 4, 6, 8] as const;

function WholeBars({ whole, den }: { whole: number; den: number }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {Array.from({ length: whole }, (_, i) => (
        <FractionBar key={i} numerator={den} denominator={den} width={90} />
      ))}
    </div>
  );
}

// Q1 — a/b = 1 (number step, visual)
export function selfEqualQuestion(): TestQuestion[] {
  const d = DENOMS[randInt(0, DENOMS.length - 1)];
  return [
    {
      visual: <FractionBar numerator={d} denominator={d} />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `Every one of the ${d} equal parts is shaded. What whole number does ${d}/${d} equal?`,
        hint: "A fully-shaded bar is one complete whole.",
        explain: `${d}/${d} = 1 — all ${d} parts together make exactly one whole.`,
        answer: 1,
      },
    },
  ];
}

// Q2, Q5 — a/b equal to a bigger whole number (number step, visual)
export function wholeMultipleQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const d = DENOMS[randInt(0, DENOMS.length - 1)];
    const whole = randInt(2, 3);
    const numerator = whole * d;
    return [
      {
        visual: <WholeBars whole={whole} den={d} />,
        difficulty,
        step: {
          kind: "number",
          prompt: `${whole} completely-shaded bars of ${d} equal parts each. What whole number does ${numerator}/${d} equal?`,
          hint: `How many groups of ${d} fit in ${numerator}?`,
          explain: `${d} divides evenly into ${numerator} exactly ${whole} times, so ${numerator}/${d} = ${whole}.`,
          answer: whole,
        },
      },
    ];
  };
}

// Q3, Q6 — write a whole number as a fraction (number step, reverse direction)
export function writeWholeQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const d = DENOMS[randInt(0, DENOMS.length - 1)];
    const whole = randInt(1, 3);
    const numerator = whole * d;
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "number",
          prompt: `What's the numerator, so that numerator/${d} = ${whole}?`,
          hint: `${whole} groups of ${d} is how many parts in all?`,
          explain: `${whole} × ${d} = ${numerator}, so ${whole} = ${numerator}/${d}.`,
          answer: numerator,
        },
      },
    ];
  };
}

// Q4, Q8 — non-example / trap: close to, but not, a whole number (choice, visual)
export function notWholeTrapQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const d = DENOMS[randInt(0, DENOMS.length - 1)];
    const leftover = randInt(1, d - 1);
    const numerator = d + leftover;
    return [
      {
        visual: <NumberLine min={0} max={2} minorTicksPerUnit={d} points={[{ value: numerator / d, tone: "a" }]} />,
        difficulty,
        step: choice(
          {
            prompt: `Is ${numerator}/${d} equal to a whole number?`,
            hint: `Does ${d} divide evenly into ${numerator}, with nothing left over?`,
            explain: `${d} goes into ${numerator} one whole time, with ${leftover} left over — since there's a leftover, ${numerator}/${d} is NOT a whole number.`,
          },
          "No",
          ["Yes"]
        ),
      },
    ];
  };
}

// Q7 — vocabulary/rule, two-part dropdown sentence
export function ruleSentenceQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: sentence(
        {
          prompt: "Fill in both blanks about when a fraction equals a whole number.",
          hint: "Think about 5/4 — the numerator is bigger than the denominator, but it's still not a whole number.",
          explain: "A fraction equals a whole number exactly when the numerator is a multiple of the denominator — the denominator divides evenly into it, with nothing left over.",
        },
        "A fraction equals a whole number exactly when the numerator is ",
        selectBlank("a multiple of the denominator", ["bigger than the denominator", "smaller than the denominator"]),
        ", meaning the denominator divides into it ",
        selectBlank("evenly, with nothing left over", ["evenly, but only if it's doubled", "unevenly, with a small leftover"]),
        "."
      ),
    },
  ];
}

// Q9 — generalization/true-false trap (choice, no visual)
export function generalizationTrapQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or False: Any fraction where the numerator is bigger than the denominator equals a whole number.",
          hint: "Think of 5/4 or 7/8.",
          explain: "False — 5/4 and 7/8 both have a numerator bigger than the denominator, but neither equals a whole number, because there's a leftover.",
        },
        "False",
        ["True"]
      ),
    },
  ];
}

// Q10 — write a whole number as a fraction, text-only (no visual), hardest
export function writeWholeTextQuestion(): TestQuestion[] {
  const d = DENOMS[randInt(0, DENOMS.length - 1)];
  const whole = randInt(1, 3);
  const numerator = whole * d;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `Write the whole number ${whole} as a fraction with denominator ${d}. What's the numerator?`,
        hint: `${whole} groups of ${d} is how many parts in all?`,
        explain: `${whole} × ${d} = ${numerator}, so ${whole} = ${numerator}/${d}.`,
        answer: numerator,
      },
    },
  ];
}

export const fractionsEqualToWholeNumbersTest: Unit["test"] = {
  questions: [
    selfEqualQuestion,
    wholeMultipleQuestion("easy"),
    writeWholeQuestion("medium"),
    notWholeTrapQuestion("medium"),
    wholeMultipleQuestion("medium"),
    writeWholeQuestion("hard"),
    ruleSentenceQuestion,
    notWholeTrapQuestion("hard"),
    generalizationTrapQuestion,
    writeWholeTextQuestion,
  ],
  passScore: 9,
};
