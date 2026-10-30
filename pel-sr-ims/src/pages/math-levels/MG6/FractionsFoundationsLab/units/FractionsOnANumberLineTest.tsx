import { NumberLine } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copy — see WhatAFractionIsTest.tsx's comment on why *Test.tsx
// files never import generators (or shared constants) back from their
// paired main unit file.
const DENOMS = [2, 3, 4, 6, 8] as const;
const NONUNIT_DENOMS = DENOMS.filter((d) => d >= 3);
const WORD_FOR: Record<number, string> = { 2: "halves", 3: "thirds", 4: "fourths", 6: "sixths", 8: "eighths" };

// Q1, Q5 — identify a unit fraction (choice, visual)
export function identifyUnitQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const d = DENOMS[randInt(0, DENOMS.length - 1)];
    return [
      {
        visual: <NumberLine min={0} max={1} minorTicksPerUnit={d} points={[{ value: 1 / d, tone: "a" }]} />,
        difficulty,
        step: choice(
          {
            prompt: "Which fraction is marked?",
            hint: `The line between 0 and 1 is split into ${d} equal parts — count how many parts from 0 the dot is.`,
            explain: `The dot is 1 part out of ${d} equal parts from 0, so it's 1/${d}.`,
          },
          `1/${d}`,
          [`2/${d}`, d > 3 ? `${d - 1}/${d}` : `0/${d}`]
        ),
      },
    ];
  };
}

// Q2 — identify a non-unit fraction (choice, visual)
export function identifyNonUnitQuestion(): TestQuestion[] {
  const d = NONUNIT_DENOMS[randInt(0, NONUNIT_DENOMS.length - 1)];
  const a = randInt(2, d - 1);
  return [
    {
      visual: <NumberLine min={0} max={1} minorTicksPerUnit={d} points={[{ value: a / d, tone: "a" }]} />,
      difficulty: "easy",
      step: choice(
        {
          prompt: "Which fraction is marked?",
          hint: `The line between 0 and 1 is split into ${d} equal parts — count how many parts from 0 the dot is.`,
          explain: `The dot is ${a} parts out of ${d} equal parts from 0, so it's ${a}/${d}.`,
        },
        `${a}/${d}`,
        [`${a - 1}/${d}`, `${a + 1}/${d}`]
      ),
    },
  ];
}

// Q3, Q9 — place a fraction on an unmarked line (2 number steps, split into
// one question each so a module test can draw just one half if it wants).
export function partitionCountQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const d = DENOMS[randInt(0, DENOMS.length - 1)];
    return [
      {
        visual: <NumberLine min={0} max={1} points={[]} />,
        difficulty,
        step: {
          kind: "number",
          prompt: `To show ${WORD_FOR[d]}, into how many equal parts should the line between 0 and 1 be split?`,
          hint: `The denominator, ${d}, tells you how many equal parts.`,
          explain: `${WORD_FOR[d]} means ${d} equal parts between 0 and 1.`,
          answer: d,
        },
      },
    ];
  };
}

export function placeTickQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const d = DENOMS[randInt(0, DENOMS.length - 1)];
    const a = randInt(1, d - 1);
    return [
      {
        visual: <NumberLine min={0} max={1} minorTicksPerUnit={d} points={[]} />,
        difficulty,
        step: {
          kind: "number",
          prompt: `Starting at 0, which equal part (tick number) is ${a}/${d}?`,
          hint: `The numerator, ${a}, tells you how many parts from 0.`,
          explain: `${a}/${d} is ${a} equal parts past 0.`,
          answer: a,
        },
      },
    ];
  };
}

// Q6, Q7 — fractions greater than 1 (choice, visual)
export function beyondOneQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const d = DENOMS[randInt(0, DENOMS.length - 1)];
    const leftover = randInt(1, d - 1);
    const num = d + leftover;
    return [
      {
        visual: <NumberLine min={0} max={2} minorTicksPerUnit={d} points={[{ value: num / d, tone: "a" }]} />,
        difficulty,
        step: choice(
          {
            prompt: "Which fraction names the marked point?",
            hint: "Count every equal part from 0, including the ones past the first whole.",
            explain: `The dot is ${num} equal parts past 0 (one full whole of ${d} parts, plus ${leftover} more), so it's ${num}/${d}.`,
          },
          `${num}/${d}`,
          [`${leftover}/${d}`, `${num + 1}/${d}`]
        ),
      },
    ];
  };
}

// Q8 — conceptual: why a fraction can be a point at all (choice, no visual)
export function conceptQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "A whole number like 2 is a point on the number line. What about a fraction, like 3/4?",
          hint: "Think back to the number line Explore activity.",
          explain: "Every fraction sits at exactly one spot on the number line, the same way every whole number does.",
        },
        "It's also a point on the number line, same as any whole number",
        ["It's only ever a picture of parts of a shape, never a point"]
      ),
    },
  ];
}

// Q4 — text-only, no visual, non-unit fraction reading
export function identifyNonUnitTextQuestion(): TestQuestion[] {
  const d = NONUNIT_DENOMS[randInt(0, NONUNIT_DENOMS.length - 1)];
  const a = randInt(2, d - 1);
  return [
    {
      visual: <NumberLine min={0} max={1} minorTicksPerUnit={d} points={[{ value: a / d, tone: "a" }]} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: "Which fraction is marked?",
          hint: `Count how many of the ${d} equal parts from 0 the dot is.`,
          explain: `${a} parts out of ${d} from 0 is ${a}/${d}.`,
        },
        `${a}/${d}`,
        [`${a - 1}/${d}`, `${a + 1}/${d}`]
      ),
    },
  ];
}

export const fractionsOnANumberLineTest: Unit["test"] = {
  questions: [
    identifyUnitQuestion("easy"),
    identifyNonUnitQuestion,
    identifyNonUnitTextQuestion,
    partitionCountQuestion("medium"),
    identifyUnitQuestion("medium"),
    beyondOneQuestion("medium"),
    beyondOneQuestion("hard"),
    conceptQuestion,
    placeTickQuestion("hard"),
    partitionCountQuestion("hard"),
  ],
  passScore: 9,
};
