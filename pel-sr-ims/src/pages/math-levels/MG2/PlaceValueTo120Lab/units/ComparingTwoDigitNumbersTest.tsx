import { HundredChart } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Comparing Two-Digit Numbers ----------
// 10 questions from 10 generators. Self-contained — same no-circular-import
// convention as every other *Test.tsx in this app.

const symbolFor = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");

/** Different tens digit — decided by tens alone. */
export const diffTensChoiceQuestion = (): TestQuestion[] => {
  let ta: number, tb: number;
  do {
    ta = randInt(1, 9);
    tb = randInt(1, 9);
  } while (ta === tb);
  const a = ta * 10 + randInt(0, 9);
  const b = tb * 10 + randInt(0, 9);
  const sym = symbolFor(a, b);
  return [
    {
      visual: <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />,
      difficulty: "easy",
      step: choice({ prompt: `${a} ___ ${b}. Which symbol?`, hint: "Different tens digits — that alone decides it.", explain: `${a} ${sym} ${b}.` }, sym, ["<", ">", "="].filter((s) => s !== sym)),
    },
  ];
};

/** Identifying the tens digit itself — a direct prerequisite check. */
export const tensDigitIdQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 9);
  const n = tens * 10 + randInt(0, 9);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `How many tens does ${n} have?`, hint: "The first digit.", explain: `${n} has ${tens} tens.`, answer: tens },
    },
  ];
};

/** Same tens digit, different ones — tests checking ones only after tens match. */
export const sameTensDiffOnesChoiceQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 9);
  let o1: number, o2: number;
  do {
    o1 = randInt(0, 9);
    o2 = randInt(0, 9);
  } while (o1 === o2);
  const a = tens * 10 + o1;
  const b = tens * 10 + o2;
  const sym = symbolFor(a, b);
  return [
    {
      visual: <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />,
      difficulty: "medium",
      step: choice({ prompt: `${a} ___ ${b}. Which symbol?`, hint: "The tens are tied — compare the ones to break the tie.", explain: `${a} ${sym} ${b}.` }, sym, ["<", ">", "="].filter((s) => s !== sym)),
    },
  ];
};

/** The WHY reasoning check — must select tens-first logic, not a careless
 *  ones-first habit, targeting the exact misconception this unit names. */
export const tensFirstWhyQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 9);
  let o1: number, o2: number;
  do {
    o1 = randInt(0, 9);
    o2 = randInt(0, 9);
  } while (o1 === o2);
  const a = tens * 10 + o1;
  const b = tens * 10 + o2;
  return [
    {
      visual: <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />,
      difficulty: "hard",
      step: choice(
        { prompt: `${a} and ${b} — both have ${tens} tens. What should you do first?`, hint: "Tens tied means move on to the next digit.", explain: "With the tens tied, you compare the ones digit to break the tie." },
        "Compare the ones digits, since the tens are already tied",
        ["Compare the ones digits first, before even checking the tens", "Say they're equal, since the tens match"]
      ),
    },
  ];
};

/** Trap: equal numbers. */
export const equalTrapQuestion = (): TestQuestion[] => {
  const a = randInt(10, 99);
  return [
    {
      visual: <HundredChart marks={[{ n: a, tone: "a" }]} />,
      difficulty: "easy",
      step: choice({ prompt: `${a} ___ ${a}. Which symbol?`, hint: "Same tens AND same ones.", explain: `${a} = ${a}.` }, "=", ["<", ">"]),
    },
  ];
};

/** Digit-reversed near-miss. */
export const reversedDigitsChoiceQuestion = (): TestQuestion[] => {
  let t: number, o: number;
  do {
    t = randInt(1, 9);
    o = randInt(1, 9);
  } while (t === o);
  const a = t * 10 + o;
  const b = o * 10 + t;
  const sym = symbolFor(a, b);
  return [
    {
      visual: <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />,
      difficulty: "hard",
      step: choice(
        { prompt: `${a} ___ ${b}. Which symbol?`, hint: "Same digits, different places — check which digit is in the TENS spot for each.", explain: `${a} has ${t} tens; ${b} has ${o} tens, so they're not equal.` },
        sym,
        ["="] // misconception: same digits -> must be equal
      ),
    },
  ];
};

/** Generalization / true-false: same digits never automatically means equal. */
export const reversedDigitsTrueFalseQuestion = (): TestQuestion[] => {
  let t: number, o: number;
  do {
    t = randInt(1, 9);
    o = randInt(1, 9);
  } while (t === o);
  const a = t * 10 + o;
  const b = o * 10 + t;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `True or false: ${a} and ${b} use the exact same two digits, so they must be equal.`, hint: "WHICH place each digit sits in still matters.", explain: `False — ${a} has ${t} tens and ${b} has ${o} tens. Same digits, different value.` },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Vocabulary: symbol meaning. */
export const symbolVocabQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice({ prompt: "Which symbol means \"is GREATER than\"?", hint: "The wide-open side faces the bigger number.", explain: "> means \"is greater than.\"" }, ">", ["<", "="]),
    },
  ];
};

/** Generalization: the tens-first procedure applies to ANY pair of two-digit numbers. */
export const tensFirstGeneralizationQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: to compare any two two-digit numbers, you should always check the tens digit first.", hint: "Think about why — the tens digit represents a much bigger amount than the ones digit ever could.", explain: "True — the tens digit always carries more value, so it should always be checked first, no matter which two numbers you're comparing." },
        "True",
        ["False"]
      ),
    },
  ];
};

/** Pick-the-biggest among three numbers sharing the same tens digit — forces
 *  a full ones-digit comparison across three options, not just a pair. */
export const pickBiggestSameTensQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 9);
  const onesSet = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
  const nums = onesSet.map((o) => tens * 10 + o).sort((x, y) => x - y);
  const biggest = nums[2];
  const others = [nums[0], nums[1]];
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Which of these is the BIGGEST: ${nums.join(", ")}?`, hint: "All three share the same tens digit, so compare the ones digits.", explain: `${biggest} has the biggest ones digit, so it's the biggest number.` },
        String(biggest),
        others.map(String)
      ),
    },
  ];
};

export const comparingTwoDigitNumbersTest: Unit["test"] = {
  questions: [
    diffTensChoiceQuestion,
    tensDigitIdQuestion,
    sameTensDiffOnesChoiceQuestion,
    tensFirstWhyQuestion,
    equalTrapQuestion,
    reversedDigitsChoiceQuestion,
    reversedDigitsTrueFalseQuestion,
    symbolVocabQuestion,
    tensFirstGeneralizationQuestion,
    pickBiggestSameTensQuestion,
  ],
  passScore: 9,
};
