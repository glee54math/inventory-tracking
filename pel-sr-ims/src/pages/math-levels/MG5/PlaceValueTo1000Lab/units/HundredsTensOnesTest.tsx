import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { regroupBreakdown, valueFromDigits } from "../logic";

// ---------- end-of-unit test: Hundreds, Tens, and Ones ----------
// 10 single-question generators across all 5 buckets (plain, multipleOf100,
// zeroTens, zeroOnes, regroup). Self-contained (does NOT import from
// HundredsTensOnes.tsx) — only from the sibling logic.ts module, same
// convention as MG1_AdditionAndSubtractionWithin20Lab's own *Test.tsx files.

const randNonzeroDigit = () => randInt(1, 9);

/** plain, easy: a choice question whose wrong answers target reading the
 *  WRONG digit's place (hundreds-digit-as-tens, ones-digit-as-tens). */
export const plainTensQuestion = (): TestQuestion[] => {
  const h = randNonzeroDigit();
  const t = randNonzeroDigit();
  const o = randNonzeroDigit();
  const n = valueFromDigits(h, t, o);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        { prompt: `How many tens are in ${n}?`, hint: "The tens digit is the middle one.", explain: `${n}'s middle digit is ${t}, so there are ${t} tens.` },
        String(t),
        [String(h), String(o)] // mistaking the hundreds digit, or the ones digit, for the tens count
      ),
    },
  ];
};

/** plain, easy: how many hundreds, free-typed. */
export const plainHundredsQuestion = (): TestQuestion[] => {
  const h = randNonzeroDigit();
  const t = randNonzeroDigit();
  const o = randNonzeroDigit();
  const n = valueFromDigits(h, t, o);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `How many hundreds are in ${n}?`, hint: "The hundreds digit is the first one.", explain: `${n}'s first digit is ${h}, so there are ${h} hundreds.`, answer: h },
    },
  ];
};

/** zeroTens, medium: makes sure a placeholder zero isn't silently skipped. */
export const zeroTensQuestion = (): TestQuestion[] => {
  const h = randNonzeroDigit();
  const o = randNonzeroDigit();
  const n = valueFromDigits(h, 0, o);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `How many tens are in ${n}?`, hint: "Look carefully at the middle digit — it's there even though it's 0.", explain: `${n} has a 0 in the tens place, so 0 tens.`, answer: 0 },
    },
  ];
};

/** zeroTens, medium: choice question where the wrong answer reads the
 *  tens-place zero as if it were the ones digit. */
export const zeroTensOnesQuestion = (): TestQuestion[] => {
  const h = randNonzeroDigit();
  const o = randNonzeroDigit();
  const n = valueFromDigits(h, 0, o);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `How many ones are in ${n}?`, hint: "The ones digit is the last one.", explain: `${n}'s last digit is ${o}, so there are ${o} ones.` },
        String(o),
        ["0", String(h)] // mistaking the tens-place zero, or the hundreds digit, for the ones count
      ),
    },
  ];
};

/** zeroOnes, medium: free-typed, confirms the ones placeholder zero. */
export const zeroOnesQuestion = (): TestQuestion[] => {
  const h = randNonzeroDigit();
  const t = randNonzeroDigit();
  const n = valueFromDigits(h, t, 0);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `How many ones are in ${n}?`, hint: "Look at the last digit — it's 0 here.", explain: `${n} has a 0 in the ones place, so 0 ones.`, answer: 0 },
    },
  ];
};

/** zeroOnes, hard: choice question whose wrong answer swaps the hundreds and
 *  tens digits — a common misread when one place is already a "quiet" 0. */
export const zeroOnesHundredsQuestion = (): TestQuestion[] => {
  const h = randNonzeroDigit();
  let t = randNonzeroDigit();
  while (t === h) t = randNonzeroDigit(); // keep the swap-distractor from secretly matching the correct answer
  const n = valueFromDigits(h, t, 0);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `How many hundreds are in ${n}?`, hint: "The hundreds digit is the first one, not the middle one.", explain: `${n}'s first digit is ${h}, so there are ${h} hundreds.` },
        String(h),
        [String(t)] // swapped the hundreds and tens digits
      ),
    },
  ];
};

/** multipleOf100, medium: choice question targeting "forgot every hundred is
 *  10 tens" (the distractor is just the hundreds digit itself, un-scaled). */
export const multipleOf100TensQuestion = (): TestQuestion[] => {
  const h = randInt(2, 9);
  const n = h * 100;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `${n} is the same as how many tens in all?`, hint: "Every hundred is 10 tens.", explain: `${n} = ${h} hundreds = ${h * 10} tens, since each hundred is 10 tens.` },
        String(h * 10),
        [String(h), String(h * 100)] // forgot to scale by 10 at all; or confused "tens" with the number itself
      ),
    },
  ];
};

/** multipleOf100, medium: free-typed "how many tens in the tens PLACE" (0),
 *  the direct placeholder check for a multiple of 100. */
export const multipleOf100PlaceQuestion = (): TestQuestion[] => {
  const h = randInt(1, 9);
  const n = h * 100;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `How many tens are in ${n}?`, hint: "The tens digit, not the total — just the middle digit.", explain: `${n}'s middle digit is 0.`, answer: 0 },
    },
  ];
};

/** multipleOf100, hard: randomized true/false on "100 = 10 tens," scaled to
 *  a random hundred — sometimes true, sometimes a false off-by-one claim. */
export const hundredEqualsTenTensQuestion = (): TestQuestion[] => {
  const h = randInt(2, 9);
  const makeTrue = Math.random() < 0.5;
  const claimedTens = makeTrue ? h * 10 : h * 10 + (randInt(0, 1) === 0 ? 1 : -1) * randInt(1, 5);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `True or False: ${h}00 is the same amount as ${claimedTens} tens.`,
          hint: "How many tens make up one hundred? Multiply that by how many hundreds there are.",
          explain: `${h}00 = ${h} hundreds × 10 tens each = ${h * 10} tens — so the claim of ${claimedTens} tens is ${makeTrue ? "correct" : "wrong"}.`,
        },
        makeTrue ? "True" : "False",
        [makeTrue ? "False" : "True"]
      ),
    },
  ];
};

/** regroup, medium: free-typed hundreds-from-tens-count. */
export const regroupHundredsQuestion = (): TestQuestion[] => {
  const tensCount = randInt(11, 39);
  const { hundreds } = regroupBreakdown(tensCount);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `${tensCount} tens is the same as how many hundreds?`, hint: "Every 10 tens bundles into 1 hundred.", explain: `${tensCount} tens has ${hundreds} full group${hundreds === 1 ? "" : "s"} of 10 tens.`, answer: hundreds },
    },
  ];
};

/** regroup, hard: choice question whose wrong answer writes the leftover
 *  tens into the ONES place instead of the tens place of the final number
 *  (e.g. 23 tens -> wrongly "203" instead of the correct 230). */
export const regroupValueQuestion = (): TestQuestion[] => {
  const tensCount = randInt(11, 39);
  const { hundreds, leftoverTens, value } = regroupBreakdown(tensCount);
  const wrongPlacement = hundreds * 100 + leftoverTens; // leftover tens mis-written as ones
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${tensCount} tens, written as a 3-digit number, is?`,
          hint: "Find the hundreds and leftover tens first, then put each digit in its own place.",
          explain: `${tensCount} tens = ${hundreds} hundred${hundreds === 1 ? "" : "s"} and ${leftoverTens} ten${leftoverTens === 1 ? "" : "s"} = ${value} — the leftover tens go in the TENS place, not the ones place.`,
        },
        String(value),
        [String(wrongPlacement), String(tensCount)].filter((d) => d !== String(value)) // leftover tens mis-placed as ones; or just repeating the tens-count itself
      ),
    },
  ];
};

export const hundredsTensOnesTest: Unit["test"] = {
  // 2 questions per bucket (plain, zeroTens, zeroOnes, multipleOf100,
  // regroup) = 10 total. multipleOf100PlaceQuestion stays exported above for
  // ModuleTest.tsx's own sampling even though this unit test doesn't use it.
  questions: [
    plainTensQuestion,
    plainHundredsQuestion,
    zeroTensQuestion,
    zeroTensOnesQuestion,
    zeroOnesQuestion,
    zeroOnesHundredsQuestion,
    multipleOf100TensQuestion,
    hundredEqualsTenTensQuestion,
    regroupHundredsQuestion,
    regroupValueQuestion,
  ],
  passScore: 9,
};
