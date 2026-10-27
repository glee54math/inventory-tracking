import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Writing & Reading Expressions ----------
// 10 single-question generators across the 5 Practice skills: straightforward
// word -> expression, order-flipping word -> expression (the load-bearing
// trap), expression -> word, identifying named parts, and the parenthesized-
// group-as-both-a-sum-and-a-factor case. Self-contained — no import from
// WritingReadingExpressions.tsx (see ExponentsTest.tsx's comment for why).

const NAMES = ["x", "y", "n", "m", "k"];

/** 2(a) word -> expression, straightforward order (no flip). */
export const wordToExprStraightQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const n = randInt(2, 12);
  const v = pick(NAMES);
  const templates: { phrase: string; correct: string; flippedTrap: string }[] = [
    // addition
    { phrase: `${n} more than ${v}`, correct: `${v}+${n}`, flippedTrap: `${n}-${v}` },
    { phrase: `${v} increased by ${n}`, correct: `${v}+${n}`, flippedTrap: `${n}-${v}` },
    { phrase: `the sum of ${v} and ${n}`, correct: `${v}+${n}`, flippedTrap: `${n}-${v}` },
    { phrase: `${v} plus ${n}`, correct: `${v}+${n}`, flippedTrap: `${n}-${v}` },
    { phrase: `${n} added to ${v}`, correct: `${v}+${n}`, flippedTrap: `${n}-${v}` },
    // subtraction (straightforward)
    { phrase: `${v} minus ${n}`, correct: `${v}-${n}`, flippedTrap: `${n}-${v}` },
    { phrase: `the difference of ${v} and ${n}`, correct: `${v}-${n}`, flippedTrap: `${n}-${v}` },
    { phrase: `${v} decreased by ${n}`, correct: `${v}-${n}`, flippedTrap: `${n}-${v}` },
    // multiplication
    { phrase: `the product of ${n} and ${v}`, correct: `${n}${v}`, flippedTrap: `${v}/${n}` },
    { phrase: `${v} times ${n}`, correct: `${n}${v}`, flippedTrap: `${v}/${n}` },
    { phrase: `${n} multiplied by ${v}`, correct: `${n}${v}`, flippedTrap: `${v}+${n}` },
    // fixed-multiplier vocabulary
    { phrase: `twice ${v}`, correct: `2${v}`, flippedTrap: `${v}+2` },
    { phrase: `triple ${v}`, correct: `3${v}`, flippedTrap: `${v}+3` },
    // division — var/number form (straightforward — contrast with "divided into")
    { phrase: `${v} divided by ${n}`, correct: `${v}/${n}`, flippedTrap: `${n}/${v}` },
    { phrase: `the quotient of ${v} and ${n}`, correct: `${v}/${n}`, flippedTrap: `${n}/${v}` },
    // division — number/var form, so the correct answer isn't always "variable on top"
    { phrase: `${n} divided by ${v}`, correct: `${n}/${v}`, flippedTrap: `${v}/${n}` },
    { phrase: `the quotient of ${n} and ${v}`, correct: `${n}/${v}`, flippedTrap: `${v}/${n}` },
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

/** 2(b) word -> expression, order-flipping language — the load-bearing trap.
 *  kind defaults to a random pick across all four scenarios (including
 *  quotientNoFlip, the deliberate non-flip contrast) when omitted, so the
 *  two flip-bucket slots in the 10-question unit test vary across retakes
 *  instead of only ever drilling the same two fixed kinds. */
export const wordToExprFlipQuestion = (
  kind: "subtractFrom" | "lessThan" | "dividedInto" | "quotientNoFlip" | undefined,
  difficulty: "medium" | "hard"
): TestQuestion[] => {
  const n = randInt(2, 15);
  const v = pick(NAMES);
  const resolvedKind = kind ?? pick(["subtractFrom", "lessThan", "dividedInto", "quotientNoFlip"] as const);
  if (resolvedKind === "subtractFrom") {
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
  if (resolvedKind === "lessThan") {
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `Which expression represents "${n} less than ${v}"?`,
            hint: `"A less than B" means B − A — the number named FIRST (${n}) is the one being taken away, not where you start.`,
            explain: `"${n} less than ${v}" means start at ${v} and take away ${n}: ${v}-${n}.`,
          },
          `${v}-${n}`,
          [`${n}-${v}`] // naming order mistaken for math order
        ),
      },
    ];
  }
  if (resolvedKind === "dividedInto") {
    // Randomize which symbol is being split, so the correct answer isn't
    // always "variable on top".
    const varOnTop = Math.random() < 0.5;
    const numerator = varOnTop ? v : n;
    const denominator = varOnTop ? n : v;
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `Which expression represents "${denominator} divided into ${numerator}"?`,
            hint: `"A divided into B" means B ÷ A — the amount being divided (${numerator}) comes first.`,
            explain: `"${denominator} divided into ${numerator}" means ${numerator} is split into groups of size ${denominator}: ${numerator}/${denominator}.`,
          },
          `${numerator}/${denominator}`,
          [`${denominator}/${numerator}`] // writing it in the order the words appear, instead of what the words mean
        ),
      },
    ];
  }
  // quotientNoFlip — a Test question is a single step, so unlike Practice
  // (which pairs both translations in one problem) we can't walk through
  // "the quotient of A and B" and "A divided into B" side by side here.
  // Showing a lone "translate the quotient of..." item would risk the exact
  // confusion it's meant to prevent — a student who only ever sees THIS item
  // could wrongly generalize "division never flips" just as easily as the
  // dividedInto item alone risks "division always flips". So this question
  // tests the discrimination directly, naming both phrases in the prompt
  // itself instead of asking for an isolated translation.
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `True or False: every phrase describing division reverses the order of the numbers, the way "${n} divided into ${v}" does.`,
          hint: `Compare "${n} divided into ${v}" to "the quotient of ${v} and ${n}" — do they both reverse the order?`,
          explain: `False — "the quotient of A and B" means A ÷ B (straightforward order), while "A divided into B" means B ÷ A (flipped). Not every division phrase reverses the order; you have to read each one carefully instead of assuming a blanket rule.`,
        },
        "False",
        ["True"]
      ),
    },
  ];
};

/** 2(c) expression -> word, multiple choice. */
export const exprToWordQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const n = randInt(2, 12);
  const v = pick(NAMES);
  const kinds: { expr: string; correct: string; flippedTrap: string }[] = [
    { expr: `${v}+${n}`, correct: `the sum of ${v} and ${n}`, flippedTrap: `the difference of ${v} and ${n}` },
    { expr: `${v}-${n}`, correct: `${n} less than ${v}`, flippedTrap: `${v} less than ${n}` },
    { expr: `${n}-${v}`, correct: `${v} subtracted from ${n}`, flippedTrap: `${n} subtracted from ${v}` },
    { expr: `${n}${v}`, correct: `${n} times ${v}`, flippedTrap: `${v} divided by ${n}` },
    { expr: `${v}/${n}`, correct: `the quotient of ${v} and ${n}`, flippedTrap: `the quotient of ${n} and ${v}` },
    { expr: `${v}/${n}`, correct: `${n} divided into ${v}`, flippedTrap: `${v} divided into ${n}` },
    { expr: `${n}/${v}`, correct: `the quotient of ${n} and ${v}`, flippedTrap: `the quotient of ${v} and ${n}` },
    { expr: `${n}/${v}`, correct: `${v} divided into ${n}`, flippedTrap: `${n} divided into ${v}` },
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

/** 2(d) identifying named parts of an expression. Varies the expression's
 *  shape (mx+b, a+bx, or mx-b for a negative constant — never a leading
 *  negative constant) and keeps the coefficient and constant numerically
 *  distinct, same reasoning as Practice's identify-parts bucket: if they
 *  match (e.g. 7x+7), "what is the coefficient" can be answered right by
 *  accident without ever distinguishing the two roles. */
export const identifyPartsQuestion = (part: "coefficient" | "termCount" | "constantTerm", difficulty: "easy" | "medium"): TestQuestion[] => {
  const a = randInt(2, 9);
  let b = randInt(2, 15);
  while (b === a) b = randInt(2, 15);
  const v = pick(NAMES);
  const negative = Math.random() < 0.4;
  const constantFirst = !negative && Math.random() < 0.5;
  const constantDisplay = negative ? `-${b}` : `${b}`;
  const coeffDisplay = `${a}${v}`;
  const expr = constantFirst ? `${b}+${coeffDisplay}` : negative ? `${coeffDisplay}-${b}` : `${coeffDisplay}+${b}`;
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
          { prompt: `How many terms does ${expr} have?`, hint: `Terms are separated by + or − signs. Count the parts of ${expr}.`, explain: `${expr} has two terms: ${coeffDisplay} and ${constantDisplay}.` },
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
        { prompt: `In the expression ${expr}, what is ${constantDisplay} called, relative to the whole expression?`, hint: "It's one of the two terms being added together.", explain: `${constantDisplay} is a term of ${expr} — specifically, the term with no variable (a constant term).` },
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
    () => wordToExprFlipQuestion(undefined, "medium"),
    () => wordToExprFlipQuestion(undefined, "hard"),
    () => exprToWordQuestion("easy"),
    () => exprToWordQuestion("medium"),
    () => identifyPartsQuestion("coefficient", "easy"),
    () => identifyPartsQuestion("termCount", "medium"),
    () => identifyPartsQuestion("constantTerm", "medium"),
    () => parenDualQuestion("hard"),
  ],
  passScore: 9,
};
