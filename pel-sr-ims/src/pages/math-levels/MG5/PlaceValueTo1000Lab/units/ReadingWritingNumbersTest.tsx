import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { digitsOf, expandedForm, expandedFormZeroTrap, numberWords, swapHundredsTens, swapTensOnes, valueFromDigits, wordFormZeroTrap } from "../logic";

// ---------- end-of-unit test: Reading and Writing Numbers Three Ways ----------
// 10 single-question generators across all 5 buckets (numToWord, wordToNum,
// numToExpanded, expandedToNum, zeroPlaceholder). Self-contained (does NOT
// import from ReadingWritingNumbers.tsx) — only from the sibling logic.ts
// module.

function randDistinctDigitsNumber(): number {
  const h = randInt(1, 9);
  let t = randInt(1, 9);
  while (t === h) t = randInt(1, 9);
  let o = randInt(1, 9);
  while (o === h || o === t) o = randInt(1, 9);
  return valueFromDigits(h, t, o);
}

function randZeroPlaceholderNumber(): number {
  const h = randInt(1, 9);
  const rest = randInt(1, 9);
  return Math.random() < 0.5 ? valueFromDigits(h, 0, rest) : valueFromDigits(h, rest, 0);
}

/** numToWord, easy: choice, distractors are the two digit-swap mistakes. */
export const numToWordQuestion = (): TestQuestion[] => {
  const n = randDistinctDigitsNumber();
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        { prompt: `What is ${n} in words?`, hint: "Read the hundreds digit, then the tens-and-ones part.", explain: `${n} is "${numberWords(n)}".` },
        numberWords(n),
        [numberWords(swapTensOnes(n)), numberWords(swapHundredsTens(n))] // read the tens/ones in the wrong order; or read the hundreds/tens in the wrong order
      ),
    },
  ];
};

/** numToWord, medium: a second choice question, same shape, different number. */
export const numToWordQuestion2 = (): TestQuestion[] => {
  const n = randDistinctDigitsNumber();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `What is ${n} in words?`, hint: "Read the hundreds digit, then the tens-and-ones part.", explain: `${n} is "${numberWords(n)}".` },
        numberWords(n),
        [numberWords(swapTensOnes(n)), numberWords(swapHundredsTens(n))]
      ),
    },
  ];
};

/** wordToNum, easy: free-typed, the reverse direction. */
export const wordToNumQuestion = (): TestQuestion[] => {
  const n = randDistinctDigitsNumber();
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `What numeral is "${numberWords(n)}"?`, hint: "Build the hundreds first, then the rest.", explain: `"${numberWords(n)}" is the numeral ${n}.`, answer: n },
    },
  ];
};

/** wordToNum, medium: a second free-typed question, same shape. */
export const wordToNumQuestion2 = (): TestQuestion[] => {
  const n = randDistinctDigitsNumber();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What numeral is "${numberWords(n)}"?`, hint: "Build the hundreds first, then the rest.", explain: `"${numberWords(n)}" is the numeral ${n}.`, answer: n },
    },
  ];
};

/** numToExpanded, medium: choice, same digit-swap distractors applied to
 *  expanded form instead of words. */
export const numToExpandedQuestion = (): TestQuestion[] => {
  const n = randDistinctDigitsNumber();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `What is ${n} in expanded form?`, hint: "One term per nonzero digit.", explain: `${n} in expanded form is "${expandedForm(n)}".` },
        expandedForm(n),
        [expandedForm(swapTensOnes(n)), expandedForm(swapHundredsTens(n))]
      ),
    },
  ];
};

/** expandedToNum, medium: free-typed, the reverse direction. */
export const expandedToNumQuestion = (): TestQuestion[] => {
  const n = randDistinctDigitsNumber();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What numeral has the expanded form "${expandedForm(n)}"?`, hint: "Add the terms together.", explain: `"${expandedForm(n)}" is the numeral ${n}.`, answer: n },
    },
  ];
};

/** expandedToNum, hard: a second free-typed question, same shape. */
export const expandedToNumQuestion2 = (): TestQuestion[] => {
  const n = randDistinctDigitsNumber();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `What numeral has the expanded form "${expandedForm(n)}"?`, hint: "Add the terms together.", explain: `"${expandedForm(n)}" is the numeral ${n}.`, answer: n },
    },
  ];
};

/** zeroPlaceholder, hard: choice word-form question with the exact spoken-
 *  zero trap as a live distractor. */
export const zeroPlaceholderWordQuestion = (): TestQuestion[] => {
  const n = randZeroPlaceholderNumber();
  const trap = wordFormZeroTrap(n)!;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `What is ${n} in words?`, hint: "The empty place is silent — skip straight past it.", explain: `${n} in words is "${numberWords(n)}" — the empty place is never spoken.` },
        numberWords(n),
        [trap, numberWords(n + 1)] // spoke the placeholder zero as its own word; or read the wrong neighboring number entirely
      ),
    },
  ];
};

/** zeroPlaceholder, hard: choice expanded-form question with the redundant
 *  "+ 0" trap as a live distractor. */
export const zeroPlaceholderExpandedQuestion = (): TestQuestion[] => {
  const n = randZeroPlaceholderNumber();
  const trap = expandedFormZeroTrap(n)!;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `What is ${n} in expanded form?`, hint: "The empty place gets no term at all, not even a '+ 0'.", explain: `${n} in expanded form is "${expandedForm(n)}" — no term for the empty place.` },
        expandedForm(n),
        [trap, expandedForm(n + 1)] // wrote a redundant "+ 0" term; or used the wrong neighboring number entirely
      ),
    },
  ];
};

/** zeroPlaceholder, medium: free-typed reverse direction (words -> numeral)
 *  on a zero-placeholder number, confirming the empty place is rebuilt as a
 *  0 digit even though it was never spoken. */
export const zeroPlaceholderReverseQuestion = (): TestQuestion[] => {
  const n = randZeroPlaceholderNumber();
  const { t } = digitsOf(n);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `What numeral is "${numberWords(n)}"?`,
        hint: `Say the hundreds first, then fill in the skipped ${t === 0 ? "tens" : "ones"} place as 0.`,
        explain: `"${numberWords(n)}" is the numeral ${n}.`,
        answer: n,
      },
    },
  ];
};

export const readingWritingNumbersTest: Unit["test"] = {
  questions: [
    numToWordQuestion,
    numToWordQuestion2,
    wordToNumQuestion,
    wordToNumQuestion2,
    numToExpandedQuestion,
    expandedToNumQuestion,
    expandedToNumQuestion2,
    zeroPlaceholderWordQuestion,
    zeroPlaceholderExpandedQuestion,
    zeroPlaceholderReverseQuestion,
  ],
  passScore: 9,
};
