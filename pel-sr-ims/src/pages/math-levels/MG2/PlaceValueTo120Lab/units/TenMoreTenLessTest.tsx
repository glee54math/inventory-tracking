import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Ten More, Ten Less, and Adding Tens ----------
// 10 questions from 10 generators. Self-contained — same no-circular-import
// convention as every other *Test.tsx in this app. No charts: on a full 1-120
// chart the answer to "10 more / 10 less / add tens" is printed a row or more
// away (user decision 2026-11-18: a Test picture must not give the answer away).

/** 10 more, no rollover. */
export const tenMoreQuestion = (): TestQuestion[] => {
  // Odd ones only: tenMorePickQuestion uses even ones, so the two never match.
  const n = randInt(1, 8) * 10 + (randInt(0, 4) * 2 + 1);
  const result = n + 10;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is 10 more than ${n}?`, hint: "Go down one row.", explain: `${n} + 10 = ${result}.`, answer: result },
    },
  ];
};

/** 10 less, staying a two-digit number (no crossing down to single digits). */
export const tenLessNoCrossingQuestion = (): TestQuestion[] => {
  // Not a number like 40: tenLessFromTensQuestion asks those (separate pools).
  let n: number;
  do n = randInt(31, 99);
  while (n % 10 === 0);
  const result = n - 10;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is 10 less than ${n}?`, hint: "Go up one row.", explain: `${n} − 10 = ${result}.`, answer: result },
    },
  ];
};

/** 10 less, crossing all the way down to a single-digit number — the hard
 *  case this unit specifically names. */
export const tenLessCrossingQuestion = (): TestQuestion[] => {
  // Not 20: tenLessFromTensQuestion asks "10 less than 20" (review C3-46).
  let n: number;
  do n = randInt(11, 23);
  while (n === 20);
  const result = n - 10;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is 10 less than ${n}?`, hint: "Go up one row.", explain: `${n} − 10 = ${result}.`, answer: result },
    },
  ];
};

/** Adding tens. */
export const addMultipleOfTenQuestion = (): TestQuestion[] => {
  // Review C3-46: 10-49 (addMultipleOfTenUpperQuestion uses 50-79), and 20
  // or 30 added, never 10: "37 + 10" is the same as tenMoreQuestion's
  // "10 more than 37".
  const n = randInt(10, 49);
  const addTens = randInt(2, 3);
  const add = addTens * 10;
  const result = n + add;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "Add the tens. The ones stay the same.", explain: `${n} + ${add} = ${result}.`, answer: result },
    },
  ];
};

/** Taking away tens, landing on a number like 40. */
export const subtractMultipleOfTenExactQuestion = (): TestQuestion[] => {
  // 20-60 taken away: "60 − 10" would match tenLessFromTensQuestion's
  // "10 less than 60" (review C3-46).
  const subTens = randInt(2, 6);
  const sub = subTens * 10;
  const extraTens = randInt(1, 9 - subTens);
  const n = (subTens + extraTens) * 10;
  const result = n - sub;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${n} − ${sub}?`, hint: "Take away the tens.", explain: `${n} − ${sub} = ${result}.`, answer: result },
    },
  ];
};

/** Taking away tens from a number like 45 — tens change, ones stay put, the
 *  case that actually tests not counting by ones. */
export const subtractMultipleOfTenMidDecadeQuestion = (): TestQuestion[] => {
  // 20-60 taken away: "45 − 10" is the same as "10 less than 45" (C3-46).
  const subTens = randInt(2, 6);
  const sub = subTens * 10;
  const extraTens = randInt(1, 9 - subTens);
  const ones = randInt(0, 4) * 2 + 1; // odd ones: onesStayQuestion uses even (C3-46)
  const n = (subTens + extraTens) * 10 + ones;
  const result = n - sub;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${n} − ${sub}?`, hint: "Take away the tens. The ones stay the same.", explain: `${n} − ${sub} = ${result}.`, answer: result },
    },
  ];
};

/** The ones stay the same when you take away tens: e.g. 68 − 30, typed, no
 *  picture (replaces the old true/false item, review C1-08 / E1-30). */
export const onesStayQuestion = (): TestQuestion[] => {
  const subTens = randInt(2, 4);
  const sub = subTens * 10;
  const n = randInt(subTens + 1, 9) * 10 + randInt(1, 4) * 2; // even ones (C3-46)
  const result = n - sub;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${n} − ${sub}?`, hint: "The ones stay the same.", explain: `${n} − ${sub} = ${result}.`, answer: result },
    },
  ];
};

/** 10 less from a number like 60 (review C2-30 / E2-36: replaces the old
 *  "How can you find 10 more fast?" pick, whose answer never changed and which
 *  Practice no longer taught). Typed. A start like 60 is a case no other item
 *  here covers (tenLessNoCrossingQuestion skips numbers like 40). */
export const tenLessFromTensQuestion = (): TestQuestion[] => {
  const n = randInt(2, 9) * 10;
  const result = n - 10;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is 10 less than ${n}?`, hint: "Go up one row.", explain: `${n} − 10 = ${result}.`, answer: result },
    },
  ];
};

/** 10 more, as a pick (review C2-30 / E2-36: replaces "Which digit changed?",
 *  which used an untaught word and always had the same answer). The chart
 *  marks only the start. Distractors: changed the ones instead, changed both.
 *  n's ones are 0-8, so "1 more" never rolls into the next ten. */
export const tenMorePickQuestion = (): TestQuestion[] => {
  const n = randInt(1, 8) * 10 + randInt(0, 4) * 2; // even ones 0-8 (tenMoreQuestion uses odd)
  const result = n + 10;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `What is 10 more than ${n}?`, hint: "Go down one row.", explain: `${n} + 10 = ${result}.` },
        String(result),
        [
          String(n + 1), // misconception: changed the ones (1 more, not 10 more)
          String(n + 11), // misconception: changed both the tens and the ones
        ]
      ),
    },
  ];
};

/** A second adding-tens question, at the upper end of the range. */
export const addMultipleOfTenUpperQuestion = (): TestQuestion[] => {
  const n = randInt(50, 79);
  const add = 20; // not 10: that is "10 more than n", asked by tenMoreQuestion (C3-46)
  const result = n + add;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "Add the tens. The ones stay the same.", explain: `${n} + ${add} = ${result}.`, answer: result },
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
    onesStayQuestion,
    tenLessFromTensQuestion,
    tenMorePickQuestion,
    addMultipleOfTenUpperQuestion,
  ],
  passScore: 9,
};
