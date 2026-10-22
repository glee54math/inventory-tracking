import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: The Number Line with Negatives ----------
// 10 questions from 5 generators covering reading a marked point, finding an
// opposite, opposite-of-opposite, and the distance between a number and its
// opposite — the same skills NumberLineUnit.tsx exercises in Practice.
// Self-contained (not imported from NumberLineUnit.tsx), same convention as
// every other *Test.tsx file in this app.

const RANGE = 15;

const randNonzero = (range: number): number => {
  let v: number;
  do {
    v = randInt(-range, range);
  } while (v === 0);
  return v;
};

/** Read a positive marked point off the number line. */
const readPositiveQuestion = (): TestQuestion[] => {
  const value = randInt(1, RANGE);
  return [
    {
      visual: <NumberLine min={-RANGE} max={RANGE} points={[{ value, tone: "a" }]} />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: "What number is marked on the number line?",
        hint: "Count the tick marks from 0 — count right for positive.",
        explain: `The marked point is ${value}.`,
        answer: value,
      },
    },
  ];
};

/** Read a negative marked point off the number line. */
const readNegativeQuestion = (): TestQuestion[] => {
  const value = -randInt(1, RANGE);
  return [
    {
      visual: <NumberLine min={-RANGE} max={RANGE} points={[{ value, tone: "a" }]} />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: "What number is marked on the number line?",
        hint: "Count the tick marks from 0 — count left for negative.",
        explain: `The marked point is ${value}.`,
        answer: value,
      },
    },
  ];
};

// oppositeQuestion/oppositeOfOppositeQuestion/markedDistanceToOppositeQuestion/
// midpointOfOppositesQuestion/distanceToZeroQuestion are exported so
// NegativeNumbersLab/units/ModuleTest.tsx can draw a cumulative sample from
// this unit's own question shapes — same reuse pattern as MM1 Ratio Lab's
// ModuleTest.tsx importing individual generators from each unit *Test.tsx file.

/** Find the opposite of a given number. */
export const oppositeQuestion = (difficulty: "easy" | "medium" | "hard"): TestQuestion[] => {
  const n = randNonzero(RANGE);
  const opposite = -n;
  return [
    {
      visual: <NumberLine min={-RANGE} max={RANGE} points={[{ value: n, label: String(n), tone: "a" }]} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `What is the opposite of ${n}?`,
        hint: "Opposites are the same distance from 0, but on the other side of it.",
        explain: `The opposite of ${n} is ${opposite} — the same distance from 0, on the other side.`,
        answer: opposite,
      },
    },
  ];
};

/** Opposite of the opposite — tests the "brings you back to where you started" idea directly. */
export const oppositeOfOppositeQuestion = (): TestQuestion[] => {
  const n = randNonzero(RANGE);
  const opposite = -n;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `What is the opposite of the opposite of ${n}?`,
        hint: "The opposite of the opposite of a number is the number itself.",
        explain: `The opposite of ${n} is ${opposite}, and the opposite of ${opposite} is ${n} again.`,
        answer: n,
      },
    },
  ];
};

/** Distance between a number and its own opposite — 2x the magnitude. */
const distanceToOppositeQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const n = randInt(1, RANGE);
  const opposite = -n;
  const distance = 2 * n;
  return [
    {
      visual: (
        <NumberLine min={-RANGE} max={RANGE} points={[{ value: opposite, label: String(opposite), tone: "a" }, { value: n, label: String(n), tone: "c" }]} />
      ),
      difficulty,
      step: {
        kind: "number",
        prompt: `What is the distance between ${n} and its opposite, ${opposite}?`,
        hint: `${n} and ${opposite} are each ${n} away from 0, on opposite sides — add both distances together.`,
        explain: `${n} to 0 is ${n}, and 0 to ${opposite} is another ${n}, so the total distance is ${n} + ${n} = ${distance}.`,
        answer: distance,
      },
    },
  ];
};

/**
 * Same "distance to opposite" skill as distanceToOppositeQuestion above, but
 * the number is never stated in the prompt text — only the diagram's single
 * marked (labeled) point, so reading the diagram is itself part of the task.
 */
export const markedDistanceToOppositeQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const n = randNonzero(RANGE);
  const opposite = -n;
  const distance = 2 * Math.abs(n);
  return [
    {
      visual: <NumberLine min={-RANGE} max={RANGE} points={[{ value: n, label: String(n), tone: "a" }]} />,
      difficulty,
      step: {
        kind: "number",
        prompt: "What is the distance between the marked number and the opposite of the marked number?",
        hint: "First find the marked number's opposite, then find the distance between the two.",
        explain: `The marked number is ${n}. Its opposite is ${opposite}. ${Math.abs(n)} + ${Math.abs(n)} = ${distance}.`,
        answer: distance,
      },
    },
  ];
};

/** The midpoint of any number and its opposite is always 0 — true no matter which number is picked. */
export const midpointOfOppositesQuestion = (): TestQuestion[] => {
  const n = randInt(1, RANGE);
  const opposite = -n;
  return [
    {
      visual: (
        <NumberLine min={-RANGE} max={RANGE} points={[{ value: opposite, label: String(opposite), tone: "a" }, { value: n, label: String(n), tone: "c" }]} />
      ),
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `What is the middle of ${n} and its opposite, ${opposite}?`,
        hint: "The middle of any number and its opposite is always the same spot — notice where that always lands.",
        explain: `The middle of ${n} and ${opposite} is always 0, since they're the same distance from 0 on opposite sides.`,
        answer: 0,
      },
    },
  ];
};

/** Distance from the marked point to 0 — connects "distance" to the magnitude already read off the line. */
export const distanceToZeroQuestion = (): TestQuestion[] => {
  const n = randNonzero(RANGE);
  return [
    {
      visual: <NumberLine min={-RANGE} max={RANGE} points={[{ value: n, label: String(n), tone: "a" }]} />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: "What is the distance between the marked point and 0?",
        hint: "Distance is never negative — it's how far the marked point is from 0, no matter which side it's on.",
        explain: `The marked point is ${n}, which is ${Math.abs(n)} away from 0.`,
        answer: Math.abs(n),
      },
    },
  ];
};

export const numberLineUnitTest: Unit["test"] = {
  questions: [
    readPositiveQuestion,
    readNegativeQuestion,
    () => oppositeQuestion("easy"),
    () => oppositeQuestion("medium"),
    oppositeOfOppositeQuestion,
    () => distanceToOppositeQuestion("medium"),
    () => markedDistanceToOppositeQuestion("medium"),
    () => markedDistanceToOppositeQuestion("hard"),
    midpointOfOppositesQuestion,
    distanceToZeroQuestion,
  ],
  passScore: 9,
};
