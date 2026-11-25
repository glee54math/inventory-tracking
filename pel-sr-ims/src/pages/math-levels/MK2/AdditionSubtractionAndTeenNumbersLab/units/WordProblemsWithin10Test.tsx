import { CompareRows, SplitGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { colorNames, noRepeats } from "./labHelp";
import { count, nIs } from "./words";

// ---------- end-of-unit test: Solving Word Problems Within 10 ----------
// 10 questions from 10 generators. Self-contained: no import from
// WordProblemsWithin10.tsx. Compare items ask only "Who has more?" (user
// decision D1). "How many more?" lives in the optional Practice challenge
// and is never tested. Start-unknown items were replaced (decision D2).

/** Add to, result unknown. */
export const addToResultQuestion = (): TestQuestion[] => {
  const a = randInt(1, 5);
  const b = randInt(1, 4);
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `Jen has ${count(a, "sticker", "stickers")}. She gets ${b} more. How many now?`, hint: "Count all the dots.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Take from, result unknown. One color, nothing marked. */
export const takeFromResultQuestion = (): TestQuestion[] => {
  const total = randInt(2, 6);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <SplitGroup total={total} partA={total} toneA="a" showDivider={false} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `Sam has ${total} crackers. He eats ${b}. How many are left?`, hint: "Take some away. Count the dots left.", explain: `${total} − ${b} = ${a}.`, answer: a },
    },
  ];
};

/** Add, or take away? About half of each; sums stay at 10 or less. */
export const addOrTakeAwayQuestion = (): TestQuestion[] => {
  const takeFrom = Math.random() < 0.5;
  const n = takeFrom ? randInt(2, 10) : randInt(2, 9);
  const change = takeFrom ? randInt(1, n - 1) : randInt(1, 10 - n);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: takeFrom ? `Theo has ${n} grapes. He eats ${change}. Add, or take away?` : `Theo has ${n} grapes. He gets ${change} more. Add, or take away?`,
          hint: "Do more come? Do some go away?",
          explain: takeFrom ? `${n} − ${change} = ${n - change}.` : `${n} + ${change} = ${n + change}.`,
        },
        takeFrom ? "Take away" : "Add",
        [takeFrom ? "Add" : "Take away"] // misconception: picking the operation from the numbers, not the story
      ),
    },
  ];
};

/** Put together, total unknown. */
export const putTogetherTotalQuestion = (): TestQuestion[] => {
  const a = randInt(1, 8);
  const b = randInt(1, 10 - a);
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" showDivider={false} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Ana has marbles. ${nIs(a)} blue. ${nIs(b)} orange. How many in all?`, hint: "Count both colors.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Missing part (smaller numbers): the known part and a "?" box. */
export const missingAddendQuestion = (): TestQuestion[] => {
  const total = randInt(3, 6);
  const a = randInt(1, total - 1);
  const b = total - a;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" unknownB />,
      difficulty: "medium",
      step: { kind: "number", tone: "b", prompt: `${total} crayons. ${a} ${a === 1 ? "is" : "are"} blue. The rest are orange. How many are orange?`, hint: "Count on to the number in all.", explain: `${a} and ${b} make ${total}.`, answer: b },
    },
  ];
};

/** Missing part (bigger numbers). Replaces the true/false item. */
export const missingPartBigQuestion = (): TestQuestion[] => {
  const total = randInt(7, 10);
  const a = randInt(1, total - 1);
  const b = total - a;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" unknownB />,
      difficulty: "hard",
      step: { kind: "number", tone: "b", prompt: `${total} crayons. ${a} ${a === 1 ? "is" : "are"} blue. The rest are orange. How many are orange?`, hint: "Count on to the number in all.", explain: `${a} and ${b} make ${total}.`, answer: b },
    },
  ];
};

const whoHasMore = (nameA: string, nameB: string, lo: number, hi: number, difficulty: TestQuestion["difficulty"]): TestQuestion[] => {
  const big = randInt(lo + 1, hi);
  const small = randInt(lo, big - 1);
  // Which name has more changes from draw to draw. Never equal.
  const aHasMore = Math.random() < 0.5;
  const countA = aHasMore ? big : small;
  const countB = aHasMore ? small : big;
  const winner = aHasMore ? nameA : nameB;
  const other = aHasMore ? nameB : nameA;
  return [
    {
      visual: <CompareRows nameA={nameA} countA={countA} nameB={nameB} countB={countB} />,
      difficulty,
      step: colorNames(
        choice(
          { prompt: `${nameA} has ${countA}. ${nameB} has ${countB}. Who has more?`, hint: "Line them up. Whose row is longer?", explain: `${winner} has more than ${other}.` },
          winner,
          [other] // misconception: picking the name said first, or the shorter row
        ),
        nameA
      ),
    },
  ];
};

/** Who has more? Numbers up to 6. */
export const whoHasMoreQuestion = (): TestQuestion[] => whoHasMore("Ana", "Leo", 1, 6, "medium");

/** Who has more? Bigger numbers, from a separate pool. */
export const whoHasMoreBigQuestion = (): TestQuestion[] => whoHasMore("Jen", "Sam", 5, 10, "hard");

/** Take from with bigger numbers. Replaces the equalize item. */
export const takeFromBigQuestion = (): TestQuestion[] => {
  const total = randInt(7, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <SplitGroup total={total} partA={total} toneA="a" showDivider={false} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Mia has ${total} blocks. She gives ${b} away. How many are left?`, hint: "Take some away. Count the dots left.", explain: `${total} − ${b} = ${a}.`, answer: a },
    },
  ];
};

/** Add to with a bigger start. Replaces the start-unknown item (D2). */
export const addToBigQuestion = (): TestQuestion[] => {
  const a = randInt(6, 9);
  const b = randInt(1, 10 - a);
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Leo has ${a} balloons. He gets ${b} more. How many now?`, hint: "Count all the dots.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

export const wordProblemsWithin10Test: Unit["test"] = {
  questions: noRepeats([
    addToResultQuestion,
    takeFromResultQuestion,
    addOrTakeAwayQuestion,
    putTogetherTotalQuestion,
    missingAddendQuestion,
    missingPartBigQuestion,
    whoHasMoreQuestion,
    whoHasMoreBigQuestion,
    takeFromBigQuestion,
    addToBigQuestion,
  ]),
  passScore: 9,
};
