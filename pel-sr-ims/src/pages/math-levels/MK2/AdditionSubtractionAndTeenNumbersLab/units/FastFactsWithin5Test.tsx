import { SplitGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Fast Facts Within 5 ----------
// 10 questions from 10 generators. Self-contained — no import from
// FastFactsWithin5.tsx, and that file never imports back from here.

/** Addition fact within 5. */
export const additionFactQuestion = (): TestQuestion[] => {
  const a = randInt(0, 5);
  const b = randInt(0, 5 - a);
  const sum = a + b;
  return [
    {
      visual: <SplitGroup total={sum} partA={a} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "You should know this fact without counting it out.", explain: `${a} + ${b} = ${sum}.`, answer: sum },
    },
  ];
};

/** A second addition fact — guarantees non-doubles coverage even when the first roll happens to double. */
export const additionFactNonDoublesQuestion = (): TestQuestion[] => {
  let a = randInt(0, 5);
  let b = randInt(0, 5 - a);
  if (a === b) b = a > 0 ? b - 1 : b + 1;
  if (b < 0 || a + b > 5) {
    a = randInt(0, 4);
    b = Math.min(5 - a, a + 1);
  }
  const sum = a + b;
  return [
    {
      visual: <SplitGroup total={sum} partA={a} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "You should know this fact without counting it out.", explain: `${a} + ${b} = ${sum}.`, answer: sum },
    },
  ];
};

/** Subtraction fact within 5. */
export const subtractionFactQuestion = (): TestQuestion[] => {
  const minuend = randInt(1, 5);
  const b = randInt(0, minuend);
  const diff = minuend - b;
  return [
    {
      visual: <SplitGroup total={minuend} partA={diff} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${minuend} − ${b}?`, hint: "You should know this fact without counting it out.", explain: `${minuend} − ${b} = ${diff}.`, answer: diff },
    },
  ];
};

/** Subtraction fact family connection. */
export const subtractionFactFamilyQuestion = (): TestQuestion[] => {
  const minuend = randInt(2, 5);
  const b = randInt(1, minuend - 1);
  const diff = minuend - b;
  return [
    {
      visual: <SplitGroup total={minuend} partA={diff} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `${minuend} − ${b} = ${diff}. Which addition fact matches?`, hint: "The amount taken away plus what's left gives back the start.", explain: `${b} + ${diff} = ${minuend}.` },
        `${b} + ${diff} = ${minuend}`,
        [`${minuend} + ${b} = ${diff}`] // misconception: adding the wrong two numbers in the fact family
      ),
    },
  ];
};

/** Doubles fact (1+1 or 2+2 — the only doubles that stay within 5). */
export const doublesFactQuestion = (): TestQuestion[] => {
  const n = randInt(1, 2);
  const sum = n + n;
  return [
    {
      visual: <SplitGroup total={sum} partA={n} toneA="a" toneB="a" showDivider={false} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${n} + ${n}?`, hint: "A doubles fact — both parts are the same number.", explain: `${n} + ${n} = ${sum}.`, answer: sum },
    },
  ];
};

/** Doubles recognition — picking out a doubles fact from a non-doubles one. */
export const doublesRecognitionQuestion = (): TestQuestion[] => {
  const isDoubles = Math.random() < 0.5;
  const n = randInt(1, 2);
  const a = isDoubles ? n : randInt(0, 4);
  let b = isDoubles ? n : randInt(0, 5 - a);
  if (!isDoubles && a === b) b = Math.max(0, b - 1);
  const sum = a + b;
  return [
    {
      visual: <SplitGroup total={sum} partA={a} toneA="a" toneB="b" showDivider={!isDoubles} />,
      difficulty: "medium",
      step: choice(
        { prompt: `Is ${a} + ${b} a "doubles" fact?`, hint: "A doubles fact has the exact same number added to itself.", explain: a === b ? `Yes — ${a} and ${b} are the same number.` : `No — ${a} and ${b} are different numbers.` },
        a === b ? "Yes" : "No",
        [a === b ? "No" : "Yes"] // misconception: not checking whether the two addends are actually equal
      ),
    },
  ];
};

/** Missing-addend fact within 5. */
export const missingAddendQuestion = (): TestQuestion[] => {
  const sum = randInt(1, 5);
  const a = randInt(0, sum);
  const missing = sum - a;
  return [
    {
      visual: <SplitGroup total={sum} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${a} + ? = ${sum}. What number is missing?`, hint: "What number joins with the first one to reach the total?", explain: `${a} + ${missing} = ${sum}.`, answer: missing },
    },
  ];
};

/** Missing-addend, position-swap distractor trap. */
export const missingAddendChoiceQuestion = (): TestQuestion[] => {
  const sum = randInt(2, 5);
  const a = randInt(1, sum - 1);
  const missing = sum - a;
  return [
    {
      visual: <SplitGroup total={sum} partA={a} toneA="a" toneB="b" />,
      difficulty: "hard",
      step: choice(
        { prompt: `${a} + ? = ${sum}. Which number sentence also shows this fact?`, hint: "The total always goes on the right of the = sign.", explain: `${missing} + ${a} = ${sum}, same fact written the other order.` },
        `${missing} + ${a} = ${sum}`,
        [`${sum} + ${a} = ${missing}`] // misconception: placing the total in the wrong position
      ),
    },
  ];
};

/** Zero fact — an easy edge case within the addition bucket (adding 0 changes nothing). */
export const zeroFactQuestion = (): TestQuestion[] => {
  const n = randInt(1, 5);
  return [
    {
      visual: <SplitGroup total={n} partA={n} toneA="a" toneB="b" showDivider={false} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${n} + 0?`, hint: "Adding 0 never changes the amount.", explain: `${n} + 0 = ${n}.`, answer: n },
    },
  ];
};

/** Full-amount subtraction — subtracting a number from itself. */
export const subtractAllQuestion = (): TestQuestion[] => {
  const n = randInt(1, 5);
  return [
    {
      visual: <SplitGroup total={n} partA={0} toneA="a" toneB="b" showDivider={false} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${n} − ${n}?`, hint: "Taking away the whole amount leaves nothing.", explain: `${n} − ${n} = 0.`, answer: 0 },
    },
  ];
};

export const fastFactsWithin5Test: Unit["test"] = {
  questions: [
    additionFactQuestion,
    additionFactNonDoublesQuestion,
    subtractionFactQuestion,
    subtractionFactFamilyQuestion,
    doublesFactQuestion,
    doublesRecognitionQuestion,
    missingAddendQuestion,
    missingAddendChoiceQuestion,
    zeroFactQuestion,
    subtractAllQuestion,
  ],
  passScore: 9,
};
