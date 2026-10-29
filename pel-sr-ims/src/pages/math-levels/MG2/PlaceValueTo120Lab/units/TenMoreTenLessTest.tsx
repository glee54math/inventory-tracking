import { HundredChart } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Ten More, Ten Less, and Multiples of Ten ----------
// 10 questions from 10 generators. Self-contained — same no-circular-import
// convention as every other *Test.tsx in this app.

/** 10 more, no rollover. */
export const tenMoreQuestion = (): TestQuestion[] => {
  const n = randInt(10, 88);
  const result = n + 10;
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }, { n: result, tone: "b" }]} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is 10 more than ${n}?`, hint: "Only the tens digit changes.", explain: `${n} + 10 = ${result}.`, answer: result },
    },
  ];
};

/** 10 less, staying a two-digit number (no crossing down to single digits). */
export const tenLessNoCrossingQuestion = (): TestQuestion[] => {
  const n = randInt(31, 99);
  const result = n - 10;
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }, { n: result, tone: "b" }]} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is 10 less than ${n}?`, hint: "Only the tens digit changes.", explain: `${n} - 10 = ${result}.`, answer: result },
    },
  ];
};

/** 10 less, crossing all the way down to a single-digit number — the hard
 *  case this unit specifically names. */
export const tenLessCrossingQuestion = (): TestQuestion[] => {
  const n = randInt(11, 23);
  const result = n - 10;
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }, { n: result, tone: "b" }]} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is 10 less than ${n}?`, hint: "The tens digit drops to 0 and disappears — no need to recount by ones.", explain: `${n} - 10 = ${result}.`, answer: result },
    },
  ];
};

/** Adding a multiple of ten. */
export const addMultipleOfTenQuestion = (): TestQuestion[] => {
  const n = randInt(10, 79);
  const addTens = randInt(1, 2);
  const add = addTens * 10;
  const result = n + add;
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }, { n: result, tone: "b" }]} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "Add whole tens; the ones digit stays put.", explain: `${n} + ${add} = ${result}.`, answer: result },
    },
  ];
};

/** Subtracting a multiple of ten, landing on an exact decade. */
export const subtractMultipleOfTenExactQuestion = (): TestQuestion[] => {
  const subTens = randInt(1, 6);
  const sub = subTens * 10;
  const extraTens = randInt(1, 9 - subTens);
  const n = (subTens + extraTens) * 10;
  const result = n - sub;
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }, { n: result, tone: "b" }]} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${n} - ${sub}?`, hint: "Subtract whole tens from the tens digit.", explain: `${n} - ${sub} = ${result}.`, answer: result },
    },
  ];
};

/** Subtracting a multiple of ten, starting mid-decade — tens change, ones
 *  stay put, the case that actually tests not brute-force counting. */
export const subtractMultipleOfTenMidDecadeQuestion = (): TestQuestion[] => {
  const subTens = randInt(1, 6);
  const sub = subTens * 10;
  const extraTens = randInt(1, 9 - subTens);
  const ones = randInt(1, 9);
  const n = (subTens + extraTens) * 10 + ones;
  const result = n - sub;
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }, { n: result, tone: "b" }]} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${n} - ${sub}?`, hint: "The tens digit changes, but the ones digit (which doesn't involve tens at all) stays exactly the same.", explain: `${n} - ${sub} = ${result}.`, answer: result },
    },
  ];
};

/** Generalization / true-false. */
export const onesNeverChangeTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: adding or subtracting any multiple of ten (10, 20, 30...) never changes a number's ones digit.", hint: "Try 45+20 and 68-30 — does the ones digit ever move?", explain: "True — any multiple of ten only ever moves the tens digit (and higher places); the ones digit is untouched." },
        "True",
        ["False"]
      ),
    },
  ];
};

/** WHY reasoning check: efficient strategy vs. recounting by ones. */
export const strategyWhyQuestion = (): TestQuestion[] => {
  const n = randInt(11, 88);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `What's the fastest way to find 10 more or 10 less than ${n}?`, hint: "Recounting by ones works, but it's slow and easy to lose track of.", explain: "Just change the tens digit by 1 — no need to recount by ones." },
        "Just change the tens digit by 1",
        ["Count forward or backward one at a time by ones"]
      ),
    },
  ];
};

/** Which digit changed — the specific misconception check (forgetting that
 *  ONLY the tens digit moves). */
export const digitChangedChoiceQuestion = (): TestQuestion[] => {
  const n = randInt(10, 88);
  const result = n + 10;
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }, { n: result, tone: "b" }]} />,
      difficulty: "medium",
      step: choice(
        { prompt: `Going from ${n} to ${result}, which digit changed?`, hint: "Compare the two numbers digit by digit.", explain: "Only the tens digit changed; the ones digit is identical in both numbers." },
        "Only the tens digit",
        ["Only the ones digit", "Both digits changed"]
      ),
    },
  ];
};

/** A second multiple-of-ten addition, at the upper end of the range, to
 *  cover more of the "add tens" bucket than a single question would. */
export const addMultipleOfTenUpperQuestion = (): TestQuestion[] => {
  const n = randInt(50, 79);
  const add = randInt(1, 2) * 10;
  const result = n + add;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "Add whole tens; the ones digit stays put.", explain: `${n} + ${add} = ${result}.`, answer: result },
    },
  ];
};

export const tenMoreTenLessTest: Unit["test"] = {
  questions: [
    tenMoreQuestion,
    tenLessNoCrossingQuestion,
    tenLessCrossingQuestion,
    addMultipleOfTenQuestion,
    subtractMultipleOfTenExactQuestion,
    subtractMultipleOfTenMidDecadeQuestion,
    onesNeverChangeTrueFalseQuestion,
    strategyWhyQuestion,
    digitChangedChoiceQuestion,
    addMultipleOfTenUpperQuestion,
  ],
  passScore: 9,
};
