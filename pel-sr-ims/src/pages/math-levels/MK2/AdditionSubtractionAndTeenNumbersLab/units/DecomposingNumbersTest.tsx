import { SplitGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { noRepeats } from "./labHelp";
import { alsoPair, otherPart } from "./words";

// ---------- end-of-unit test: Breaking Numbers Apart ----------
// 10 questions from 10 generators. Self-contained: no import from
// DecomposingNumbers.tsx. Pictures show the known part and a "?" box, so the
// other part can't be read off the picture.

const knownPart = (total: number, a: number) => <SplitGroup total={total} partA={a} toneA="a" toneB="b" unknownB />;

/** Break apart a small number (4 or 5). */
export const decomposeSmallQuestion = (): TestQuestion[] => {
  const total = randInt(4, 5);
  const a = randInt(1, total - 1);
  const b = total - a;
  return [
    {
      visual: knownPart(total, a),
      difficulty: "easy",
      step: { kind: "number", tone: "b", prompt: `${total} is ${a} and how many more?`, hint: "Count on to the number.", explain: `${a} and ${b} make ${total}.`, answer: b },
    },
  ];
};

/** Break apart a larger number (8, 9, or 10). */
export const decomposeLargeQuestion = (): TestQuestion[] => {
  const total = randInt(8, 10);
  const a = randInt(1, total - 1);
  const b = total - a;
  return [
    {
      visual: knownPart(total, a),
      difficulty: "medium",
      step: { kind: "number", tone: "b", prompt: `${total} is ${a} and how many more?`, hint: "Count on to the number.", explain: `${a} and ${b} make ${total}.`, answer: b },
    },
  ];
};

/** A larger number where the part asked for is small (easy to miscount). */
export const decomposeLargeSmallPartQuestion = (): TestQuestion[] => {
  const total = randInt(8, 10);
  const b = randInt(1, 2);
  const a = total - b;
  return [
    {
      visual: knownPart(total, a),
      difficulty: "hard",
      step: { kind: "number", tone: "b", prompt: `${total} is ${a} and how many more?`, hint: "Count on to the number.", explain: `${a} and ${b} make ${total}.`, answer: b },
    },
  ];
};

/** A second way. Never the same two numbers in either order. */
export const secondWayQuestion = (): TestQuestion[] => {
  const total = randInt(5, 10);
  const a1 = randInt(1, total - 1);
  const b1 = total - a1;
  const a2 = otherPart(total, [a1, b1], randInt);
  const b2 = total - a2;
  return [
    {
      visual: <SplitGroup total={total} partA={a1} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", tone: "b", prompt: `${total} is ${a1} and ${b1}. Another way: ${a2} and how many?`, hint: "Move the dots. Count again.", explain: `${a2} and ${b2} make ${total}.`, answer: b2 },
    },
  ];
};

/** Is this also a way? Yes/No, bigger numbers. */
export const isAlsoAWayQuestion = (): TestQuestion[] => {
  const total = randInt(6, 10);
  const a = randInt(1, total - 1);
  const { x, y, isTrue } = alsoPair(total, [a, total - a], randInt);
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "hard",
      step: choice(
        { prompt: `${total} is ${a} and ${total - a}. Is ${total} also ${x} and ${y}?`, hint: `Count ${x} and ${y}.`, explain: `${x} and ${y} make ${x + y}.` },
        isTrue ? "Yes" : "No",
        [isTrue ? "No" : "Yes"] // misconception: only one pair can work, or any close pair works
      ),
    },
  ];
};

/** More than one way, small numbers. Yes/No. Replaces a true/false item. */
export const moreThanOneWayQuestion = (): TestQuestion[] => {
  const total = randInt(4, 5);
  const a = 1;
  const { x, y, isTrue } = alsoPair(total, [a, total - a], randInt);
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `${total} is ${a} and ${total - a}. Is ${total} also ${x} and ${y}?`, hint: `Count ${x} and ${y}.`, explain: `${x} and ${y} make ${x + y}.` },
        isTrue ? "Yes" : "No",
        [isTrue ? "No" : "Yes"] // misconception: a number has just one way
      ),
    },
  ];
};

/** Another way, typed. Replaces a true/false item. */
export const anotherWayTypedQuestion = (): TestQuestion[] => {
  const total = randInt(5, 9);
  const a = total - 1;
  const x = otherPart(total, [a, 1], randInt);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `${total} is ${a} and 1. ${total} is ${x} and how many?`, hint: "Draw dots. Count them.", explain: `${x} and ${total - x} make ${total}.`, answer: total - x },
    },
  ];
};

/** Two parts that are the same: 4 or 6. */
export const equalPartsQuestion = (): TestQuestion[] => {
  const half = randInt(2, 3);
  const total = half * 2;
  return [
    {
      visual: <SplitGroup total={total} partA={total} toneA="a" showDivider={false} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Break ${total} into two parts. Make them the same. How many in one part?`, hint: "Make two groups.", explain: `${half} and ${half} make ${total}.`, answer: half },
    },
  ];
};

/** Two parts that are the same: 8 or 10, a separate pool. Replaces a true/false item. */
export const equalPartsBigQuestion = (): TestQuestion[] => {
  const half = randInt(4, 5);
  const total = half * 2;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `Break ${total} into two parts. Make them the same. How many in one part?`, hint: "Make two groups.", explain: `${half} and ${half} make ${total}.`, answer: half },
    },
  ];
};

/** Record it, with the total on the left. */
export const recordWayQuestion = (): TestQuestion[] => {
  const total = randInt(4, 9);
  const a = randInt(1, total - 1);
  const b = total - a;
  return [
    {
      visual: knownPart(total, a),
      difficulty: "easy",
      step: { kind: "number", tone: "b", prompt: `${total} = ${a} + ☐. What goes in the box?`, hint: "Count on to the number.", explain: `${total} = ${a} + ${b}.`, answer: b },
    },
  ];
};

export const decomposingNumbersTest: Unit["test"] = {
  questions: noRepeats([
    decomposeSmallQuestion,
    decomposeLargeQuestion,
    decomposeLargeSmallPartQuestion,
    secondWayQuestion,
    isAlsoAWayQuestion,
    moreThanOneWayQuestion,
    anotherWayTypedQuestion,
    equalPartsQuestion,
    equalPartsBigQuestion,
    recordWayQuestion,
  ]),
  passScore: 9,
};
