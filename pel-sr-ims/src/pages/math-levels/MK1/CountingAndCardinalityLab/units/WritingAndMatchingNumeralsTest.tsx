import { CounterGroup } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Writing and Matching Numerals ----------
// 10 questions from 10 generators. Self-contained — local copy of the
// number-word table instead of importing it from WritingAndMatchingNumerals.tsx,
// since that file already imports this file's test export (see
// MATH_TSX_STYLE_GUIDE.txt / this lab's own CountingOnAndForwardTest.tsx for
// why a reverse import would be a circular-import crash).
const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];

const bigDigit = (d: string, mirrored = false) => (
  <span style={{ display: "inline-block", fontSize: 54, fontWeight: 800, fontFamily: "'Courier New', monospace", transform: mirrored ? "scaleX(-1)" : undefined }}>
    {d}
  </span>
);

/** Numeral production from the number word, small range. */
export const writeFromWordSmallQuestion = (): TestQuestion[] => {
  const n = randInt(0, 10);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `Write the numeral for the number word "${NUMBER_WORDS[n]}".`, hint: "Think of the symbol, not the word.", explain: `"${NUMBER_WORDS[n]}" is written as the numeral ${n}.`, answer: n },
    },
  ];
};

/** Numeral production from the number word, teen range (the harder word forms). */
export const writeFromWordTeenQuestion = (): TestQuestion[] => {
  const n = randInt(11, 19);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `Write the numeral for the number word "${NUMBER_WORDS[n]}".`, hint: "Teen numbers are written as two digits.", explain: `"${NUMBER_WORDS[n]}" is written as the numeral ${n}.`, answer: n },
    },
  ];
};

/** Numeral production matching a shown picture-count, small range. */
export const writeFromPictureSmallQuestion = (): TestQuestion[] => {
  const n = randInt(2, 10);
  return [
    {
      visual: <CounterGroup count={n} arrangement="line" tone="a" seed={n * 3 + 1} />,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many counters are there? Write the numeral.", hint: "Count each one exactly once.", explain: `There are ${n} counters — the numeral is ${n}.`, answer: n },
    },
  ];
};

/** Numeral production matching a shown picture-count, larger/scattered range. */
export const writeFromPictureLargeQuestion = (): TestQuestion[] => {
  const n = randInt(11, 20);
  return [
    {
      visual: <CounterGroup count={n} arrangement="scatter" tone="b" seed={n * 11 + 2} />,
      difficulty: "medium",
      step: { kind: "number", prompt: "How many counters are there? Write the numeral.", hint: "They're scattered — count carefully, and don't count any twice.", explain: `There are ${n} counters — the numeral is ${n}.`, answer: n },
    },
  ];
};

const LOOKALIKE_SETS: [string, string][] = [["6", "9"], ["1", "7"], ["2", "5"]];

/** Select the numeral matching a count, among a visually similar distractor. */
export const recognizeLookalikeQuestion = (): TestQuestion[] => {
  const [a, b] = pick(LOOKALIKE_SETS);
  const showA = Math.random() < 0.5;
  const target = showA ? a : b;
  const other = showA ? b : a;
  const n = Number(target);
  return [
    {
      visual: <CounterGroup count={n} arrangement="scatter" tone="c" seed={n * 19 + 4} />,
      difficulty: "medium",
      step: choice(
        { prompt: "Which numeral matches this many counters?", hint: "Count carefully, then match — don't just guess by shape.", explain: `There are ${n} counters, written as the numeral ${target}, not ${other}.` },
        target,
        [other] // misconception: confusing visually similar numerals instead of counting
      ),
    },
  ];
};

const MIRROR_SENSITIVE_DIGITS = ["2", "3", "4", "5", "6", "7", "9"];

/** Pick the correctly-oriented (non-mirrored) numeral. */
export const reversedPairQuestion = (): TestQuestion[] => {
  const digit = pick(MIRROR_SENSITIVE_DIGITS);
  const correctSide: "Left" | "Right" = Math.random() < 0.5 ? "Left" : "Right";
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 30, justifyContent: "center" }}>
          {correctSide === "Left" ? bigDigit(digit) : bigDigit(digit, true)}
          {correctSide === "Left" ? bigDigit(digit, true) : bigDigit(digit)}
        </div>
      ),
      difficulty: "hard",
      step: choice(
        { prompt: `Which one is the correctly written numeral ${digit} — Left or Right?`, hint: "A mirror image is flipped left-to-right.", explain: `The ${correctSide} one is correct; the other is a mirror image, which is why it looks reversed.` },
        correctSide,
        [correctSide === "Left" ? "Right" : "Left"] // misconception: not recognizing the mirrored/reversed form
      ),
    },
  ];
};

/** Generalization / false trap, same idea as the unit's own CFU — not every
 *  look-alike pair is actually a flip of the other. */
export const flipGeneralizationQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: every pair of numerals people mix up (like 6 & 9, or 2 & 5) turns into the other one when flipped upside down.",
          hint: "Try flipping a 6. Now try flipping a 2 — does it really become a 5?",
          explain: "False — 6 and 9 really are flips of each other, but 2 and 5 (and 1 and 7) are not; they're just visually similar for other reasons.",
        },
        "False",
        ["True"] // misconception: assuming every look-alike pair is a rotational flip
      ),
    },
  ];
};

/** Reverse-direction reasoning layered on top of numeral production. */
export const oneMoreNumeralQuestion = (): TestQuestion[] => {
  const n = randInt(0, 19);
  const next = n + 1;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What numeral is one MORE than the number word "${NUMBER_WORDS[n]}"?`, hint: "First think of the numeral for the word, then count one more.", explain: `"${NUMBER_WORDS[n]}" is ${n}, and one more than ${n} is ${next}.`, answer: next },
    },
  ];
};

/** A second recognize-lookalike question drawn from a different pair than
 *  whichever one happened to come up in recognizeLookalikeQuestion, so the
 *  10-question test doesn't risk covering only one of the three pairs. */
export const recognizeLookalikeQuestion2 = (): TestQuestion[] => recognizeLookalikeQuestion();

export const writingAndMatchingNumeralsTest: Unit["test"] = {
  questions: [
    writeFromWordSmallQuestion,
    writeFromWordTeenQuestion,
    writeFromPictureSmallQuestion,
    writeFromPictureLargeQuestion,
    recognizeLookalikeQuestion,
    recognizeLookalikeQuestion2,
    reversedPairQuestion,
    flipGeneralizationQuestion,
    oneMoreNumeralQuestion,
    reversedPairQuestion,
  ],
  passScore: 9,
};
