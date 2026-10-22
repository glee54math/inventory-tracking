import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Comparing, Ordering & Absolute Value ----------
// 10 questions from 10 generators covering comparing integers, real-world
// ordering, absolute value (both computing it and what it represents), the
// magnitude-vs-order trap (a smaller/more negative balance is a bigger
// debt), and a true/false trap generalizing the whole unit. Self-contained
// (not imported from ComparingOrdering.tsx), same convention as every other
// *Test.tsx file in this app.

const RANGE = 20;

const randNonzero = (range: number): number => {
  let v: number;
  do {
    v = randInt(-range, range);
  } while (v === 0);
  return v;
};

const randDistinctPair = (range: number): [number, number] => {
  const a = randNonzero(range);
  let b = randNonzero(range);
  while (b === a) b = randNonzero(range);
  return [a, b];
};

/** Two DISTINCT positive integers — see ComparingOrdering.tsx's own copy of
 *  this helper for why the pair must be built from distinct magnitudes
 *  before any sign/transform is applied. */
const randDistinctPositive = (min: number, max: number): [number, number] => {
  const a = randInt(min, max);
  let b = randInt(min, max);
  while (b === a) b = randInt(min, max);
  return [a, b];
};

/** Which of two integers is greater, multiple choice. */
const inequalityPickQuestion = (): TestQuestion[] => {
  const [a, b] = randDistinctPair(RANGE);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  return [
    {
      visual: <NumberLine min={-RANGE} max={RANGE} points={[{ value: a, label: String(a), tone: "a" }, { value: b, label: String(b), tone: "b" }]} />,
      difficulty: "easy",
      step: choice(
        {
          prompt: `Which is greater, ${a} or ${b}?`,
          hint: "On a number line, numbers farther right are greater.",
          explain: `${bigger} is farther right on the number line, so ${bigger} > ${smaller}.`,
        },
        String(bigger),
        [String(smaller)]
      ),
    },
  ];
};

// inequalityMeaningQuestion/absoluteValueMeaningQuestion/sameAbsoluteValueQuestion/
// smallerBalanceQuestion/trueFalseTrapQuestion are exported so
// NegativeNumbersLab/units/ModuleTest.tsx can draw a cumulative sample from
// this unit's own question shapes — same reuse pattern as MM1 Ratio Lab's
// ModuleTest.tsx importing individual generators from each unit *Test.tsx file.

/** What "a > b" means geometrically, multiple choice. */
export const inequalityMeaningQuestion = (): TestQuestion[] => {
  const [a, b] = randDistinctPair(RANGE);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        {
          prompt: `${bigger} > ${smaller} — what does that mean on the number line?`,
          hint: "The greater number is the one closer to the right.",
          explain: `${bigger} > ${smaller} means ${bigger} is located to the right of ${smaller} on the number line.`,
        },
        `${bigger} is to the right of ${smaller}`,
        [`${bigger} is to the left of ${smaller}`]
      ),
    },
  ];
};

/** Which of two negative temperatures is warmer, multiple choice. */
const warmerCityQuestion = (): TestQuestion[] => {
  const [magA, magB] = randDistinctPositive(1, 20);
  const a = -magA;
  const b = -magB;
  const warmer = Math.max(a, b);
  const colder = Math.min(a, b);
  return [
    {
      visual: <NumberLine min={-25} max={5} points={[{ value: a, label: `${a}°C`, tone: "a" }, { value: b, label: `${b}°C`, tone: "b" }]} />,
      difficulty: "easy",
      step: choice(
        {
          prompt: `It is ${a}°C in one city and ${b}°C in another. Which city is warmer?`,
          hint: "Warmer means a greater temperature — farther right on the number line.",
          explain: `${warmer}°C is warmer than ${colder}°C.`,
        },
        `${warmer}°C`,
        [`${colder}°C`]
      ),
    },
  ];
};

/** Writing the inequality that compares two negative temperatures, multiple choice. */
const warmerInequalityQuestion = (): TestQuestion[] => {
  const [magA, magB] = randDistinctPositive(1, 20);
  const a = -magA;
  const b = -magB;
  const warmer = Math.max(a, b);
  const colder = Math.min(a, b);
  return [
    {
      visual: <NumberLine min={-25} max={5} points={[{ value: a, label: `${a}°C`, tone: "a" }, { value: b, label: `${b}°C`, tone: "b" }]} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `It is ${a}°C in one city and ${b}°C in another. Which inequality correctly compares them?`,
          hint: "The warmer temperature is the greater number.",
          explain: `${warmer}°C > ${colder}°C, since ${warmer} is to the right of ${colder} on the number line.`,
        },
        `${warmer}°C > ${colder}°C`,
        [`${warmer}°C < ${colder}°C`]
      ),
    },
  ];
};

/** Compute |n|. */
const absoluteValueQuestion = (): TestQuestion[] => {
  const n = randNonzero(RANGE + 10);
  return [
    {
      visual: <NumberLine min={-(RANGE + 10)} max={RANGE + 10} points={[{ value: n, tone: "a" }]} />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `What is |${n}|?`,
        hint: "Absolute value is the distance from 0 — always zero or positive, never negative.",
        explain: `|${n}| = ${Math.abs(n)}, the distance from 0 to ${n}.`,
        answer: Math.abs(n),
      },
    },
  ];
};

/** What |n| represents, multiple choice — distinguishes "distance from 0" from the opposite. */
export const absoluteValueMeaningQuestion = (): TestQuestion[] => {
  const n = randNonzero(RANGE + 10);
  return [
    {
      visual: <NumberLine min={-(RANGE + 10)} max={RANGE + 10} points={[{ value: n, label: String(n), tone: "a" }]} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `What does |${n}| represent?`,
          hint: "Absolute value is a DISTANCE — think about what two points that distance is measured between.",
          explain: `|${n}| is the distance from 0 to ${n} — not the distance to its opposite, and not the opposite itself.`,
        },
        `The distance from 0 to ${n}`,
        [`The distance from ${n} to its opposite, ${-n}`, `The opposite of ${n}`]
      ),
    },
  ];
};

/** A second number sharing the same absolute value — connects |n| to opposites. */
export const sameAbsoluteValueQuestion = (): TestQuestion[] => {
  const n = randNonzero(RANGE + 10);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${n} has an absolute value of ${Math.abs(n)}. What OTHER number also has an absolute value of ${Math.abs(n)}?`,
        hint: "Two numbers can be the same distance from 0 — one on each side.",
        explain: `${n} and ${-n} are both ${Math.abs(n)} away from 0, so they share the same absolute value.`,
        answer: -n,
      },
    },
  ];
};

/** Which account has the smaller (more negative) balance, multiple choice. */
export const smallerBalanceQuestion = (): TestQuestion[] => {
  const [debtA, debtB] = randDistinctPositive(5, 50);
  const balanceA = -debtA;
  const balanceB = -debtB;
  const smallerBalance = Math.min(balanceA, balanceB);
  const whichAccount = smallerBalance === balanceA ? "A" : "B";
  return [
    {
      visual: <NumberLine min={-60} max={10} points={[{ value: balanceA, label: "A", tone: "a" }, { value: balanceB, label: "B", tone: "b" }]} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Account A has a balance of ${balanceA} dollars. Account B has a balance of ${balanceB} dollars. Which account has the SMALLER balance (further in debt)?`,
          hint: 'A smaller (more negative) balance means more money owed, even though the number itself is "less."',
          explain: `${smallerBalance} is less than the other balance, so Account ${whichAccount} owes more — a smaller balance is a bigger debt.`,
        },
        `Account ${whichAccount}`,
        [`Account ${whichAccount === "A" ? "B" : "A"}`]
      ),
    },
  ];
};

/** The size of the bigger debt, in dollars. */
const biggerDebtSizeQuestion = (): TestQuestion[] => {
  const [debtA, debtB] = randDistinctPositive(5, 50);
  const balanceA = -debtA;
  const balanceB = -debtB;
  const smallerBalance = Math.min(balanceA, balanceB);
  const biggerDebt = Math.max(debtA, debtB);
  return [
    {
      visual: <NumberLine min={-60} max={10} points={[{ value: balanceA, label: "A", tone: "a" }, { value: balanceB, label: "B", tone: "b" }]} />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `Account A has a balance of ${balanceA} dollars. Account B has a balance of ${balanceB} dollars. What is the size of the bigger debt, in dollars?`,
        hint: "The debt size is the absolute value of the (negative) balance.",
        explain: `The smaller balance is the bigger debt: |${smallerBalance}| = ${biggerDebt} dollars.`,
        answer: biggerDebt,
      },
    },
  ];
};

/** True/False trap: a very negative number is still less than a mildly negative one. */
export const trueFalseTrapQuestion = (): TestQuestion[] => {
  const smallMag = randInt(1, 5);
  const bigMag = randInt(20, 50);
  const small = -smallMag; // closer to 0
  const big = -bigMag; // farther from 0, but the lesser value
  const statementIsTrue = Math.random() < 0.5;
  // True statement: the far-from-0 (more negative) number is less than the near-0 one.
  // False statement (the trap): stated backwards, playing on "bigger magnitude = bigger number."
  const statement = statementIsTrue ? `${big} is less than ${small}.` : `${big} is greater than ${small}.`;
  return [
    {
      visual: <NumberLine min={-(bigMag + 5)} max={5} points={[{ value: big, label: String(big), tone: "a" }, { value: small, label: String(small), tone: "b" }]} />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `True or False: "${statement}"`,
          hint: `${bigMag} is a bigger number than ${smallMag}, but that doesn't decide which NEGATIVE number is greater — check which is farther right on the number line.`,
          explain: `${small} is to the right of ${big} on the number line, so ${small} > ${big}, meaning ${big} < ${small} — the statement is ${statementIsTrue ? "true" : "false"}.`,
        },
        statementIsTrue ? "True" : "False",
        ["True", "False"].filter((v) => v !== (statementIsTrue ? "True" : "False"))
      ),
    },
  ];
};

export const comparingOrderingTest: Unit["test"] = {
  questions: [
    inequalityPickQuestion,
    inequalityMeaningQuestion,
    warmerCityQuestion,
    warmerInequalityQuestion,
    absoluteValueQuestion,
    absoluteValueMeaningQuestion,
    sameAbsoluteValueQuestion,
    smallerBalanceQuestion,
    biggerDebtSizeQuestion,
    trueFalseTrapQuestion,
  ],
  passScore: 9,
};
