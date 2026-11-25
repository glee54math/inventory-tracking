import { TenAndOnes } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { noRepeats } from "./labHelp";
import { NUMBER_WORDS, cap, count } from "./words";

// ---------- end-of-unit test: Teen Numbers as Ten Plus More ----------
// 10 questions from 10 generators. Self-contained: no import from
// TeenNumbers.tsx. "One ten" and "ones" everywhere, the words the CFU teaches.

const oneTen = (ones: number) => `One ten and ${count(ones, "one", "ones")}`;

/** Build a teen number from one ten and some ones. */
export const composeTeenQuestion = (): TestQuestion[] => {
  const ones = randInt(1, 9);
  const teen = 10 + ones;
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `${oneTen(ones)}. What number is it?`, hint: "Start at 10. Count on.", explain: `10 + ${ones} = ${teen}.`, answer: teen },
    },
  ];
};

/** Break a teen number into one ten and ones. */
export const decomposeTeenQuestion = (): TestQuestion[] => {
  const teen = randInt(11, 19);
  const ones = teen - 10;
  return [
    {
      // No picture: the ones drawn in their own frame would show the answer.
      visual: null,
      difficulty: "medium",
      step: { kind: "number", tone: "b", prompt: `${teen} is one ten and how many ones?`, hint: "Count the dots outside the ten.", explain: `${teen} = 10 + ${ones}.`, answer: ones },
    },
  ];
};

/** Record it with the total on the left. */
export const recordTeenQuestion = (): TestQuestion[] => {
  const teen = randInt(11, 19);
  const ones = teen - 10;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", tone: "b", prompt: `${teen} = 10 + ☐. What goes in the box?`, hint: "How many ones?", explain: `${teen} = 10 + ${ones}.`, answer: ones },
    },
  ];
};

/** Hear the number, pick how it's written. */
export const hearTeenQuestion = (): TestQuestion[] => {
  const teen = randInt(12, 19);
  const ones = teen - 10;
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "medium",
      step: choice(
        { prompt: `Listen: ${NUMBER_WORDS[teen]}. Which number is it?`, hint: "The ten comes first.", explain: `${cap(NUMBER_WORDS[teen])} is ${teen}.` },
        String(teen),
        [`${ones}1`, String(ones)] // misconceptions: written backwards (41 for 14); forgot the ten
      ),
    },
  ];
};

/** What the 1 shows. Only 12–19, so the two digits never look alike. */
export const oneShowsQuestion = (): TestQuestion[] => {
  const teen = randInt(12, 19);
  const ones = teen - 10;
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "hard",
      step: choice(
        { prompt: `Look at ${teen}. What does the 1 show?`, hint: "Look at the full boxes.", explain: `The 1 in ${teen} shows one ten.` },
        "One ten",
        ["One dot"] // misconception: the 1 is just one object
      ),
    },
  ];
};

/** No picture: from the words alone. Replaces the true/false item. */
export const teenNoPictureQuestion = (): TestQuestion[] => {
  const ones = randInt(2, 9);
  const teen = 10 + ones;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `${oneTen(ones)}. What number is it?`, hint: "Start at 10. Count on.", explain: `10 + ${ones} = ${teen}.`, answer: teen },
    },
  ];
};

/** Which number sentence matches? The written-backwards trap. */
export const digitSwapTrapQuestion = (): TestQuestion[] => {
  const teen = randInt(12, 19); // not 11, which looks the same backwards
  const ones = teen - 10;
  const swapped = Number(`${ones}1`);
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "hard",
      step: choice(
        { prompt: `${oneTen(ones)}. Which number sentence matches?`, hint: "The ten comes first.", explain: `10 + ${ones} = ${teen}.` },
        `10 + ${ones} = ${teen}`,
        [`10 + ${ones} = ${swapped}`] // misconception: writing the number backwards
      ),
    },
  ];
};

/** Which number sentence matches? The "forgot the ten" trap. */
export const forgotTheTenTrapQuestion = (): TestQuestion[] => {
  const teen = randInt(11, 19);
  const ones = teen - 10;
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "medium",
      step: choice(
        { prompt: `${oneTen(ones)}. Which number sentence matches?`, hint: "Don't forget the ten.", explain: `10 + ${ones} = ${teen}.` },
        `10 + ${ones} = ${teen}`,
        [`10 + ${ones} = ${ones}`] // misconception: dropping the ten
      ),
    },
  ];
};

/** Hear the number, say how many ones. */
export const wordToOnesQuestion = (): TestQuestion[] => {
  const teen = randInt(11, 19);
  const ones = teen - 10;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", tone: "b", prompt: `Listen: ${NUMBER_WORDS[teen]}. One ten and how many ones?`, hint: "Picture the ten. How many more?", explain: `${cap(NUMBER_WORDS[teen])} is one ten and ${count(ones, "one", "ones")}.`, answer: ones },
    },
  ];
};

/** Finish the number sentence. Replaces the "10 and 0 ones" item. */
export const tenPlusOnesQuestion = (): TestQuestion[] => {
  const ones = randInt(1, 9);
  const teen = 10 + ones;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `10 + ${ones} = ☐. What goes in the box?`, hint: "Start at 10. Count on.", explain: `10 + ${ones} = ${teen}.`, answer: teen },
    },
  ];
};

// These three all ask "how many ones?", so one sitting asks them about three different teen numbers.
const HOW_MANY_ONES: (() => TestQuestion[])[] = [decomposeTeenQuestion, recordTeenQuestion, wordToOnesQuestion];

export const teenNumbersTest: Unit["test"] = {
  questions: noRepeats([
    composeTeenQuestion,
    decomposeTeenQuestion,
    recordTeenQuestion,
    hearTeenQuestion,
    oneShowsQuestion,
    teenNoPictureQuestion,
    digitSwapTrapQuestion,
    forgotTheTenTrapQuestion,
    wordToOnesQuestion,
    tenPlusOnesQuestion,
  ], (q, make) => (HOW_MANY_ONES.includes(make) && q.step.kind === "number" ? `ones-${q.step.answer}` : null)),
  passScore: 9,
};
