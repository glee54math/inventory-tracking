import { TenFrameGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Within-20 Addition and Subtraction Fluency ----------
// 10 questions from 10 generators. Self-contained (no import from
// WithinTwentyFluency.tsx, and that file never imports back from here) —
// same convention as every other *Test.tsx in this app.

export const sumsTo10NumberQuestion = (): TestQuestion[] => {
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

export const makeTenGapNumberQuestion = (): TestQuestion[] => {
  const a = randInt(6, 9);
  const gap = 10 - a;
  return [
    {
      visual: <TenFrameGroup value={a} tone="a" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `${a} needs how many more to make 10?`, hint: `Count up from ${a}.`, explain: `${a} + ${gap} = 10.`, answer: gap },
    },
  ];
};

export const makeTenSumNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } while (a + b <= 10 || a + b > 20);
  const sum = a + b;
  return [
    {
      visual: <TenFrameGroup value={Math.min(20, sum)} tone="a" splitAt={a} tone2="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${a} + ${b}? Use the make-a-ten strategy.`, hint: "Can you use a make-ten shortcut?", explain: `${a} + ${b} = ${sum}.`, answer: sum },
    },
  ];
};

export const subNoCrossNumberQuestion = (): TestQuestion[] => {
  let total = 0;
  let sub = 0;
  do {
    total = randInt(11, 19);
    sub = randInt(0, 9);
  } while (sub > total % 10);
  const result = total - sub;
  return [
    {
      visual: <TenFrameGroup value={total} tone="c" splitAt={result} tone2="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${total} − ${sub}?`, hint: "No need to break into the ten here.", explain: `${total} − ${sub} = ${result}.`, answer: result },
    },
  ];
};

export const subDecomposeNumberQuestion = (): TestQuestion[] => {
  const start = randInt(11, 19);
  let sub = 0;
  do {
    sub = randInt(2, 9);
  } while (sub <= start % 10);
  const result = start - sub;
  const toTen = start % 10 === 0 ? 10 : start % 10;
  return [
    {
      visual: <TenFrameGroup value={start} tone="c" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${start} − ${sub}?`, hint: `First subtract ${toTen} to reach the ten below, then subtract what's left.`, explain: `${start} − ${toTen} = 10, then 10 − ${sub - toTen} = ${result}.`, answer: result },
    },
  ];
};

export const factFamilyNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } while (a + b > 18);
  const sum = a + b;
  return [
    {
      visual: <TenFrameGroup value={Math.min(20, sum)} tone="a" splitAt={a} tone2="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${a} + ${b} = ${sum}. What is ${sum} − ${b}?`, hint: "This uses the same three numbers.", explain: `${sum} − ${b} = ${a}.`, answer: a },
    },
  ];
};

/** Misconception distractor: swapping which number is subtracted in a fact
 *  family (picking the result of the OTHER related subtraction fact). */
export const relatedFactChoiceQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } while (a + b > 18 || a === b);
  const sum = a + b;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `${a} + ${b} = ${sum}. Which of these is a fact from the SAME family?`, hint: "A fact family shares the same three numbers.", explain: `${sum} − ${a} = ${b} uses the same three numbers as ${a} + ${b} = ${sum}.` },
        `${sum} − ${a} = ${b}`,
        [`${sum} − ${a} = ${a}`, `${a} + ${b} = ${sum + 1}`] // misconception: miscomputing the inverse, or a plain arithmetic slip
      ),
    },
  ];
};

/** True/false trap: subtraction isn't ONLY count-down-from-the-first-number. */
export const subtractionIsNotOnlyCountDownChoiceQuestion = (): TestQuestion[] => {
  const start = randInt(12, 18);
  const sub = randInt(5, 9);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `True or false: the ONLY way to solve ${start} − ${sub} is to count down from ${start}, one at a time.`,
          hint: `Think about what number, added to ${sub}, makes ${start}.`,
          explain: `False — ${start} − ${sub} is the same question as "${sub} plus what makes ${start}?", which you may already know as a fact.`,
        },
        "False",
        ["True"] // misconception: subtraction must be sequential counting-down, never an unknown-addend lookup
      ),
    },
  ];
};

/** Conflation distractor: assuming make-ten is always needed, even when the
 *  second addend is already small enough that counting on is simplest. */
export const countOnVsMakeTenChoiceQuestion = (): TestQuestion[] => {
  const a = randInt(6, 9);
  const b = randInt(1, 2);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `For ${a} + ${b}, what's the fastest way to think about it?`, hint: `${b} is already small.`, explain: `With a small second number like ${b}, counting on is just as fast and doesn't need splitting into a make-ten step.` },
        `Count on ${b} from ${a}`,
        ["Split the second number to make a ten first"] // misconception: make-ten is always required, even when counting on is simpler
      ),
    },
  ];
};

export const factFamilyBothChoiceQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } while (a + b > 18 || a === b);
  const sum = a + b;
  return [
    {
      visual: <TenFrameGroup value={Math.min(20, sum)} tone="a" splitAt={a} tone2="b" />,
      difficulty: "hard",
      step: choice(
        { prompt: `${a} + ${b} = ${sum}. Which subtraction fact does NOT belong to this fact family?`, hint: "Only two subtraction facts come from these same three numbers.", explain: `${sum} − ${a} = ${b} and ${sum} − ${b} = ${a} are the two real members — anything using a different total isn't from this family.` },
        `${sum + 1} − ${a} = ${b + 1}`,
        [`${sum} − ${a} = ${b}`, `${sum} − ${b} = ${a}`]
      ),
    },
  ];
};

export const withinTwentyFluencyTest: Unit["test"] = {
  questions: [
    sumsTo10NumberQuestion,
    makeTenGapNumberQuestion,
    makeTenSumNumberQuestion,
    subNoCrossNumberQuestion,
    subDecomposeNumberQuestion,
    factFamilyNumberQuestion,
    relatedFactChoiceQuestion,
    subtractionIsNotOnlyCountDownChoiceQuestion,
    countOnVsMakeTenChoiceQuestion,
    factFamilyBothChoiceQuestion,
  ],
  passScore: 9,
};
