import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Writing & Reading Expressions ----------
// 10 single-question generators across the 5 Practice skills: straightforward
// word -> expression, order-flipping word -> expression (the load-bearing
// trap), expression -> word, identifying named parts, and the parenthesized-
// group-as-both-a-sum-and-a-factor case. Self-contained — no import from
// WritingReadingExpressions.tsx (see ExponentsTest.tsx's comment for why).

const NAMES = ["y", "n", "m", "k"];

/** 2(a) word -> expression, straightforward order (no flip). */
export const wordToExprStraightQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const n = randInt(2, 12);
  const v = pick(NAMES);
  const templates: { phrase: string; correct: string; flippedTrap: string }[] = [
    { phrase: `${n} more than ${v}`, correct: `${v}+${n}`, flippedTrap: `${n}-${v}` },
    { phrase: `${v} increased by ${n}`, correct: `${v}+${n}`, flippedTrap: `${n}-${v}` },
    { phrase: `the product of ${n} and ${v}`, correct: `${n}${v}`, flippedTrap: `${v}/${n}` },
  ];
  const t = pick(templates);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        { prompt: `Which expression represents "${t.phrase}"?`, hint: "Read it left to right exactly as written — nothing here reverses the order.", explain: `"${t.phrase}" = ${t.correct}.` },
        t.correct,
        [t.flippedTrap]
      ),
    },
  ];
};

/** 2(b) word -> expression, order-flipping language — the load-bearing trap. */
export const wordToExprFlipQuestion = (kind: "subtractFrom" | "dividedInto", difficulty: "medium" | "hard"): TestQuestion[] => {
  const n = randInt(2, 15);
  const v = pick(NAMES);
  if (kind === "subtractFrom") {
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `Which expression represents "subtract ${v} from ${n}"?`,
            hint: `"Subtract A from B" means B − A — the number you start from (${n}) comes first.`,
            explain: `"Subtract ${v} from ${n}" means start at ${n} and take away ${v}: ${n}-${v}.`,
          },
          `${n}-${v}`,
          [`${v}-${n}`] // the classic order-flip trap: writing it in the order the words appear
        ),
      },
    ];
  }
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Which expression represents "${n} divided into ${v}"?`,
          hint: `"A divided into B" means B ÷ A — the amount being divided (${v}) comes first.`,
          explain: `"${n} divided into ${v}" means ${v} is split into groups of size ${n}: ${v}/${n}.`,
        },
        `${v}/${n}`,
        [`${n}/${v}`] // writing it in the order the words appear, instead of what the words mean
      ),
    },
  ];
};

/** 2(c) expression -> word, multiple choice. */
export const exprToWordQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const n = randInt(2, 12);
  const v = pick(NAMES);
  const kinds: { expr: string; correct: string; flippedTrap: string }[] = [
    { expr: `${v}-${n}`, correct: `${n} less than ${v}`, flippedTrap: `${v} less than ${n}` },
    { expr: `${n}-${v}`, correct: `${v} subtracted from ${n}`, flippedTrap: `${n} subtracted from ${v}` },
    { expr: `${n}${v}`, correct: `${n} times ${v}`, flippedTrap: `${v} divided by ${n}` },
  ];
  const t = pick(kinds);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        { prompt: `Which phrase matches the expression ${t.expr}?`, hint: "Say the expression out loud, in the order the operation actually happens.", explain: `${t.expr} reads as "${t.correct}".` },
        t.correct,
        [t.flippedTrap]
      ),
    },
  ];
};

/** 2(d) identifying named parts of an expression. */
export const identifyPartsQuestion = (part: "coefficient" | "termCount" | "constantTerm", difficulty: "easy" | "medium"): TestQuestion[] => {
  const a = randInt(2, 9);
  const b = randInt(2, 15);
  const v = pick(NAMES);
  const expr = `${a}${v}+${b}`;
  if (part === "coefficient") {
    return [
      {
        visual: null,
        difficulty,
        step: { kind: "number", prompt: `In the expression ${expr}, what is the coefficient of ${v}?`, hint: "The coefficient is the number multiplied by the variable.", explain: `The coefficient of ${v} in ${expr} is ${a}.`, answer: a },
      },
    ];
  }
  if (part === "termCount") {
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          { prompt: `How many terms does ${expr} have?`, hint: `Terms are separated by + or − signs. Count the parts of ${expr}.`, explain: `${expr} has two terms: ${a}${v} and ${b}.` },
          "2",
          ["1", "3"]
        ),
      },
    ];
  }
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        { prompt: `In the expression ${expr}, what is ${b} called, relative to the whole expression?`, hint: "It's one of the two parts being added together.", explain: `${b} is a term of ${expr} — specifically, the term with no variable (a constant term).` },
        "a term",
        ["a factor", "a coefficient"]
      ),
    },
  ];
};

/** 2(e) a parenthesized group as both a single entity (factor) and its own
 *  sum of terms — the textbook 2(8+7) example. */
export const parenDualQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const a = randInt(2, 9);
  const b = randInt(2, 12);
  const c = randInt(2, 12);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `In the expression ${a}(${b}+${c}), what is (${b}+${c}) best described as?`,
          hint: `Inside the parentheses, ${b} and ${c} are being added — that's what makes something a sum.`,
          explain: `(${b}+${c}) is a sum of two terms, ${b} and ${c}. The whole expression ${a}(${b}+${c}) is then a PRODUCT of two factors: ${a} and (${b}+${c}).`,
        },
        "a sum of two terms",
        ["a product of two factors", "a single term"]
      ),
    },
  ];
};

export const writingReadingExpressionsTest: Unit["test"] = {
  questions: [
    () => wordToExprStraightQuestion("easy"),
    () => wordToExprStraightQuestion("medium"),
    () => wordToExprFlipQuestion("subtractFrom", "medium"),
    () => wordToExprFlipQuestion("dividedInto", "hard"),
    () => exprToWordQuestion("easy"),
    () => exprToWordQuestion("medium"),
    () => identifyPartsQuestion("coefficient", "easy"),
    () => identifyPartsQuestion("termCount", "medium"),
    () => identifyPartsQuestion("constantTerm", "medium"),
    () => parenDualQuestion("hard"),
  ],
  passScore: 9,
};
