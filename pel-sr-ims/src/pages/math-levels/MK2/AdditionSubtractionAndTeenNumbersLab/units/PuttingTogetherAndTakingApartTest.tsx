import { SplitGroup, Fingers } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { noRepeats } from "./labHelp";
import { count, plusTrap, thereAre, verb } from "./words";

// ---------- end-of-unit test: Putting Together and Taking Apart ----------
// 10 questions from 10 generators. Self-contained: no import from
// PuttingTogetherAndTakingApart.tsx, which imports this file's test export.
// Pictures show only what the story gives: a take-away is one color with
// nothing marked, so the student has to do the taking away.

/** Add to, result unknown (smaller numbers). */
export const addToResultQuestion = (): TestQuestion[] => {
  const a = randInt(1, 4);
  const b = randInt(1, 4);
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `${thereAre(a, "duck", "ducks")} ${b} more ${verb(b, "duck comes", "ducks come")}. How many now?`, hint: "Count all the dots.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Add to, result unknown (bigger start). Replaces the start-unknown item (D2). */
export const addToBirdsQuestion = (): TestQuestion[] => {
  const a = randInt(5, 8);
  const b = randInt(1, 10 - a);
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${a} birds. ${b} more ${verb(b, "bird comes", "birds come")}. How many now?`, hint: "Count all the dots.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Take from, result unknown. */
export const takeFromResultQuestion = (): TestQuestion[] => {
  const total = randInt(2, 6);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <SplitGroup total={total} partA={total} toneA="a" showDivider={false} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `${total} cookies. Sam eats ${b}. How many are left?`, hint: "Take some away. Count the dots left.", explain: `${total} − ${b} = ${a}.`, answer: a },
    },
  ];
};

/** Take from, result unknown (bigger start). Replaces the start-unknown item (D2). */
export const takeFromBalloonsQuestion = (): TestQuestion[] => {
  const total = randInt(7, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <SplitGroup total={total} partA={total} toneA="a" showDivider={false} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${total} balloons. ${b} ${verb(b, "pops", "pop")}. How many are left?`, hint: "Take some away. Count the dots left.", explain: `${total} − ${b} = ${a}.`, answer: a },
    },
  ];
};

/** Fingers: one group on each hand. */
export const fingersJoinQuestion = (): TestQuestion[] => {
  const a = randInt(1, 5);
  const b = randInt(1, Math.min(5, 9 - a));
  const total = a + b;
  return [
    {
      visual: <Fingers left={a} right={b} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `${count(a, "finger", "fingers")} and ${count(b, "finger", "fingers")}. How many fingers?`, hint: "Count the fingers up.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Fingers, taking away: the picture shows the starting fingers. */
export const fingersApartQuestion = (): TestQuestion[] => {
  const total = randInt(2, 9);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <Fingers left={Math.min(5, total)} right={Math.max(0, total - 5)} toneRight="a" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${total} fingers. Put ${b} down. How many are still up?`, hint: "Put some down. Count the fingers up.", explain: `${total} − ${b} = ${a}.`, answer: a },
    },
  ];
};

/** Pick the number sentence for a put-together story. */
export const equationJoinChoiceQuestion = (): TestQuestion[] => {
  const a = randInt(2, 8);
  const b = randInt(1, 10 - a);
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `${a} fish. ${b} more ${verb(b, "fish comes", "fish come")}. Which number sentence matches?`, hint: "Do more come?", explain: `${a} + ${b} = ${total}.` },
        `${a} + ${b} = ${total}`,
        [
          total + b <= 10 ? `${total} + ${b} = ${a}` : `${a} + ${b} = ${total < 10 ? total + 1 : total - 1}`, // misconception: total in the wrong place, or a miscount
          `${Math.max(a, b)} − ${Math.min(a, b)} = ${total}`, // misconception: wrong operation
        ]
      ),
    },
  ];
};

/** Pick the number sentence for a take-away story. */
export const equationApartChoiceQuestion = (): TestQuestion[] => {
  const total = randInt(2, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <SplitGroup total={total} partA={total} toneA="a" showDivider={false} />,
      difficulty: "medium",
      step: choice(
        { prompt: `${total} fish. ${b} ${verb(b, "swims", "swim")} away. Which number sentence matches?`, hint: "Do some go away?", explain: `${total} − ${b} = ${a}.` },
        `${total} − ${b} = ${a}`,
        [
          a >= b ? `${a} − ${b} = ${total}` : `${total} − ${b} = ${a > 1 ? a - 1 : a + 1}`, // misconception: order swapped, or a miscount
          `${total} + ${plusTrap(total, b)} = ${a}`, // misconception: wrong operation
        ]
      ),
    },
  ];
};

/** What the sign tells you to do. Plus or minus, about half the time each. */
export const signMeaningQuestion = (): TestQuestion[] => {
  const plus = Math.random() < 0.5;
  const a = randInt(3, 6);
  const b = randInt(1, 3);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `${a} ${plus ? "+" : "−"} ${b}. Put together, or take away?`, hint: "Look at the sign.", explain: plus ? "Plus means put together." : "Minus means take away." },
        plus ? "Put together" : "Take away",
        [plus ? "Take away" : "Put together"] // misconception: mixing up + and −
      ),
    },
  ];
};

/** Does the group get bigger or smaller? More or Fewer, about half the time each. */
export const moreOrFewerQuestion = (): TestQuestion[] => {
  const takeAway = Math.random() < 0.5;
  const n = randInt(4, 6);
  const change = randInt(1, 3);
  return [
    {
      visual: <SplitGroup total={n} partA={n} toneA="a" showDivider={false} />,
      difficulty: "hard",
      step: choice(
        {
          prompt: takeAway ? `${n} dots. Take ${change} away. More, or fewer?` : `${n} dots. Add ${change}. More, or fewer?`,
          hint: "Do some go away?",
          explain: takeAway ? "Taking away leaves fewer." : "Putting together makes more.",
        },
        takeAway ? "Fewer" : "More",
        [takeAway ? "More" : "Fewer"] // misconception: not linking the action to the size of the group
      ),
    },
  ];
};

export const puttingTogetherAndTakingApartTest: Unit["test"] = {
  questions: noRepeats([
    addToResultQuestion,
    addToBirdsQuestion,
    takeFromResultQuestion,
    takeFromBalloonsQuestion,
    fingersJoinQuestion,
    fingersApartQuestion,
    equationJoinChoiceQuestion,
    equationApartChoiceQuestion,
    signMeaningQuestion,
    moreOrFewerQuestion,
  ]),
  passScore: 9,
};
