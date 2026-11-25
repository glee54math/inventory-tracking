import { TenFrame } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { noRepeats } from "./labHelp";

// ---------- end-of-unit test: Make 10 ----------
// 10 questions from 10 generators. Self-contained: no import from
// MakingTen.tsx. Pictures show only the given number in the frame.

const typed = (n: number, difficulty: TestQuestion["difficulty"], picture: boolean): TestQuestion[] => {
  const partner = 10 - n;
  return [
    {
      visual: picture ? <TenFrame filled={n} tone="a" /> : null,
      difficulty,
      step: { kind: "number", tone: "b", prompt: `${n} and how many make 10?`, hint: "Count the empty boxes.", explain: `${n} and ${partner} make 10.`, answer: partner },
    },
  ];
};

/** Yes/No: does this pair make 10? True about half the time. A false pair misses by 1. */
const verify = (lo: number, hi: number, difficulty: TestQuestion["difficulty"]): TestQuestion[] => {
  const n = randInt(lo, hi);
  const partner = 10 - n;
  const isTrue = Math.random() < 0.5;
  const shown = isTrue ? partner : partner > 1 && Math.random() < 0.5 ? partner - 1 : partner + 1;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        { prompt: `Do ${n} and ${shown} make 10?`, hint: "Picture the boxes.", explain: `${n} and ${shown} make ${n + shown}.` },
        isTrue ? "Yes" : "No",
        [isTrue ? "No" : "Yes"] // misconception: a close pair is "close enough"
      ),
    },
  ];
};

/** A small number (1, 2, 3). */
export const smallComplementQuestion = (): TestQuestion[] => typed(randInt(1, 3), "easy", true);

/** A number close to 10 (7, 8, 9). */
export const nearTenComplementQuestion = (): TestQuestion[] => typed(randInt(7, 9), "hard", true);

/** A middle number (4, 5, 6). */
export const middleComplementQuestion = (): TestQuestion[] => typed(randInt(4, 6), "medium", true);

/** Doubling instead of finding what makes 10: a specific, nameable mistake. */
export const doublingDistractorQuestion = (): TestQuestion[] => {
  const n = randInt(2, 4);
  const partner = 10 - n;
  const doubled = n * 2;
  return [
    {
      visual: <TenFrame filled={n} tone="a" />,
      difficulty: "medium",
      step: choice(
        { prompt: `${n} and how many make 10?`, hint: "Count the empty boxes.", explain: `${n} and ${partner} make 10.` },
        String(partner),
        [String(doubled)] // misconception: doubling the number
      ),
    },
  ];
};

/** Which number sentence makes 10? */
export const makeTenSentenceQuestion = (): TestQuestion[] => {
  const n = randInt(1, 9);
  const partner = 10 - n;
  const wrong = partner > 1 && Math.random() < 0.5 ? partner - 1 : partner + 1;
  return [
    {
      visual: <TenFrame filled={n} tone="a" />,
      difficulty: "medium",
      step: choice(
        { prompt: "Which one makes 10?", hint: "Count the empty boxes.", explain: `${n} + ${partner} = 10.` },
        `${n} + ${partner} = 10`,
        [`${n} + ${wrong} = 10`] // misconception: off by one when counting the empty boxes
      ),
    },
  ];
};

/** No picture: the fact itself (replaces the strategy-preference item). */
export const makeTenNoPictureQuestion = (): TestQuestion[] => typed(randInt(6, 9), "medium", false);

/** Verify a pair (the plan's verify bucket), Yes/No. Used by the Module Test too. */
export const verifyPairQuestion = (): TestQuestion[] => verify(1, 5, "medium");

/** Verify a pair from a separate pool of numbers. */
export const verifyPairBigQuestion = (): TestQuestion[] => verify(6, 9, "hard");

/** No picture, smaller numbers, a separate pool. */
export const makeTenNoPictureSmallQuestion = (): TestQuestion[] => typed(randInt(1, 5), "hard", false);

/** Record it: n + ☐ = 10 (replaces the "10 and 0 more" item). */
export const makeTenRecordQuestion = (): TestQuestion[] => {
  const n = randInt(1, 9);
  const partner = 10 - n;
  return [
    {
      visual: <TenFrame filled={n} tone="a" />,
      difficulty: "medium",
      step: { kind: "number", tone: "b", prompt: `${n} + ☐ = 10. What goes in the box?`, hint: "Count the empty boxes.", explain: `${n} + ${partner} = 10.`, answer: partner },
    },
  ];
};

export const makingTenTest: Unit["test"] = {
  questions: noRepeats([
    smallComplementQuestion,
    nearTenComplementQuestion,
    middleComplementQuestion,
    doublingDistractorQuestion,
    makeTenSentenceQuestion,
    makeTenNoPictureQuestion,
    verifyPairQuestion,
    verifyPairBigQuestion,
    makeTenNoPictureSmallQuestion,
    makeTenRecordQuestion,
  ]),
  passScore: 9,
};
