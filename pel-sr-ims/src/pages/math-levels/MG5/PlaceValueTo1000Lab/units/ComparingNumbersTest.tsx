import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { compareNumbers, expandedForm, numberWords, valueFromDigits, type Place } from "../logic";

// ---------- end-of-unit test: Comparing Three-Digit Numbers ----------
// 10 single-question generators across all 5 buckets (diffHundreds,
// diffTens, diffOnes, equal, formCompare). Self-contained (does NOT import
// from ComparingNumbers.tsx) — only from the sibling logic.ts module.

const PLACE_OPTIONS: Record<Place, string> = {
  hundreds: "hundreds",
  tens: "tens",
  ones: "ones",
  equal: "they're equal — no place decided it",
};

function symbolQuestion(a: number, b: number, difficulty: "easy" | "medium" | "hard"): TestQuestion {
  const cmp = compareNumbers(a, b);
  const others = ([">", "<", "="] as const).filter((s) => s !== cmp.symbol);
  return {
    visual: null,
    difficulty,
    step: choice({ prompt: `Compare: ${a} ___ ${b}`, hint: "Compare hundreds first, then tens, then ones.", explain: `${a} ${cmp.symbol} ${b}.` }, cmp.symbol, [...others]),
  };
}

function decidingPlaceQuestion(a: number, b: number, difficulty: "easy" | "medium" | "hard"): TestQuestion {
  const cmp = compareNumbers(a, b);
  const correctText = PLACE_OPTIONS[cmp.decidingPlace];
  const distractors = (Object.keys(PLACE_OPTIONS) as Place[]).filter((p) => p !== cmp.decidingPlace).map((p) => PLACE_OPTIONS[p]);
  return {
    visual: null,
    difficulty,
    step: choice(
      { prompt: `Compare ${a} and ${b}. Which place value decides it?`, hint: "Start from the hundreds place and move right until something differs.", explain: `${a} ${cmp.symbol} ${b} — the ${correctText} is what decided it.` },
      correctText,
      distractors
    ),
  };
}

/** diffHundreds, easy: symbol comparison. */
export const diffHundredsSymbolQuestion = (): TestQuestion[] => {
  const hA = randInt(1, 9);
  let hB = randInt(1, 9);
  while (hB === hA) hB = randInt(1, 9);
  const a = valueFromDigits(hA, randInt(0, 9), randInt(0, 9));
  const b = valueFromDigits(hB, randInt(0, 9), randInt(0, 9));
  return [symbolQuestion(a, b, "easy")];
};

/** diffHundreds, medium: a direct instance of the plan's own "bigger digit
 *  elsewhere doesn't win" trap — 512 vs 498 shaped, but randomized. */
export const diffHundredsTrapQuestion = (): TestQuestion[] => {
  const hA = randInt(2, 9);
  const hB = hA - 1; // one less hundred, but gets a big tens digit to tempt a wrong pick
  const a = valueFromDigits(hA, randInt(0, 2), randInt(0, 9));
  const b = valueFromDigits(hB, 9, randInt(0, 9)); // tens digit maxed out at 9 — the trap
  return [symbolQuestion(a, b, "medium")];
};

/** diffTens, medium: same hundreds, different tens decides it. */
export const diffTensQuestion = (): TestQuestion[] => {
  const h = randInt(1, 9);
  const tA = randInt(0, 9);
  let tB = randInt(0, 9);
  while (tB === tA) tB = randInt(0, 9);
  const a = valueFromDigits(h, tA, randInt(0, 9));
  const b = valueFromDigits(h, tB, randInt(0, 9));
  return [decidingPlaceQuestion(a, b, "medium")];
};

/** diffTens, hard: symbol comparison, same shape, different number. */
export const diffTensSymbolQuestion = (): TestQuestion[] => {
  const h = randInt(1, 9);
  const tA = randInt(0, 9);
  let tB = randInt(0, 9);
  while (tB === tA) tB = randInt(0, 9);
  const a = valueFromDigits(h, tA, randInt(0, 9));
  const b = valueFromDigits(h, tB, randInt(0, 9));
  return [symbolQuestion(a, b, "hard")];
};

/** diffOnes, medium: same hundreds and tens, different ones decides it. */
export const diffOnesQuestion = (): TestQuestion[] => {
  const h = randInt(1, 9);
  const t = randInt(0, 9);
  const oA = randInt(0, 9);
  let oB = randInt(0, 9);
  while (oB === oA) oB = randInt(0, 9);
  const a = valueFromDigits(h, t, oA);
  const b = valueFromDigits(h, t, oB);
  return [decidingPlaceQuestion(a, b, "medium")];
};

/** diffOnes, hard: symbol comparison, same shape, different number. */
export const diffOnesSymbolQuestion = (): TestQuestion[] => {
  const h = randInt(1, 9);
  const t = randInt(0, 9);
  const oA = randInt(0, 9);
  let oB = randInt(0, 9);
  while (oB === oA) oB = randInt(0, 9);
  const a = valueFromDigits(h, t, oA);
  const b = valueFromDigits(h, t, oB);
  return [symbolQuestion(a, b, "hard")];
};

/** equal, easy: a straight equality check. */
export const equalSymbolQuestion = (): TestQuestion[] => {
  const a = randInt(100, 999);
  return [symbolQuestion(a, a, "easy")];
};

/** equal, medium: true/false framing instead of picking the symbol. */
export const equalTrueFalseQuestion = (): TestQuestion[] => {
  const a = randInt(100, 999);
  const makeTrue = Math.random() < 0.5;
  let b = a;
  if (!makeTrue) {
    const offset = randInt(1, 9);
    b = a + offset <= 999 ? a + offset : a - offset;
  }
  const trulyEqual = b === a;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `True or False: ${a} and ${b} are exactly equal.`, hint: "Check every place, not just some of them.", explain: trulyEqual ? `${a} and ${b} match in every place.` : `${a} and ${b} differ, so they are NOT equal.` },
        trulyEqual ? "True" : "False",
        [trulyEqual ? "False" : "True"]
      ),
    },
  ];
};

/** formCompare, hard: word form vs. plain numeral. */
export const formCompareWordQuestion = (): TestQuestion[] => {
  const a = randInt(100, 999);
  let b = randInt(100, 999);
  while (b === a) b = randInt(100, 999);
  const cmp = compareNumbers(a, b);
  const others = ([">", "<", "="] as const).filter((s) => s !== cmp.symbol);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Compare: "${numberWords(a)}" ___ ${b}`, hint: "Turn the words into a numeral first, then compare.", explain: `"${numberWords(a)}" is ${a}, and ${a} ${cmp.symbol} ${b}.` },
        cmp.symbol,
        [...others]
      ),
    },
  ];
};

/** formCompare, hard: expanded form vs. plain numeral. */
export const formCompareExpandedQuestion = (): TestQuestion[] => {
  const a = randInt(100, 999);
  let b = randInt(100, 999);
  while (b === a) b = randInt(100, 999);
  const cmp = compareNumbers(a, b);
  const others = ([">", "<", "="] as const).filter((s) => s !== cmp.symbol);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Compare: ${expandedForm(a)} ___ ${b}`, hint: "Add up the expanded form first, then compare.", explain: `${expandedForm(a)} is ${a}, and ${a} ${cmp.symbol} ${b}.` },
        cmp.symbol,
        [...others]
      ),
    },
  ];
};

export const comparingNumbersTest: Unit["test"] = {
  questions: [
    diffHundredsSymbolQuestion,
    diffHundredsTrapQuestion,
    diffTensQuestion,
    diffTensSymbolQuestion,
    diffOnesQuestion,
    diffOnesSymbolQuestion,
    equalSymbolQuestion,
    equalTrueFalseQuestion,
    formCompareWordQuestion,
    formCompareExpandedQuestion,
  ],
  passScore: 9,
};
