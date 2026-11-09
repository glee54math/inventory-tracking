import { PieceBars } from "../diagrams";
import { numberBlank, sentence, choice, type TestQuestion } from "../../../shared/engine/types";
import { Frac } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { pastOneParams, pieceWord, threePartParams, twoPartSplitCount, twoWaysParams, unitDecompParams } from "../lib/fractions";

// Self-contained: imports only lab-level lib/diagrams, never the paired
// DecomposingFractions.tsx (that file imports THIS one — the reverse import
// would be a circular-import "Level not found" bug).

type Diff = TestQuestion["difficulty"];
const repeatSum = (term: string, times: number) => Array.from({ length: times }, () => term).join(" + ");

/** Q1 — how many unit fractions make a/d. */
export function unitCountQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const { num, den } = unitDecompParams();
  return [
    {
      visual: <PieceBars den={den} segments={[{ count: num, tone: "a" }]} cuts={Array.from({ length: num - 1 }, (_, i) => i + 1)} barWidth={240} />,
      difficulty,
      step: {
        kind: "number",
        prompt: (
          <>
            How many unit fractions <Frac n={1} d={den} /> add up to <Frac n={num} d={den} />?
          </>
        ),
        hint: `The numerator counts the 1/${den} pieces.`,
        explain: `${num}/${den} is ${num} pieces of 1/${den}, so it's ${num} copies of 1/${den} added together.`,
        answer: num,
      },
    },
  ];
}

/** Q2 — pick the unit-fraction sum. */
export function unitSumChoiceQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const { num, den } = unitDecompParams();
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              Which sum equals <Frac n={num} d={den} />?
            </>
          ),
          hint: `Count how many 1/${den} pieces each sum has.`,
          explain: `${num}/${den} is ${num} pieces of 1/${den}: ${repeatSum(`1/${den}`, num)}.`,
        },
        repeatSum(`1/${den}`, num),
        [
          repeatSum(`1/${den}`, num - 1), // miscounted — one piece short
          repeatSum(`1/${num}`, den), // swapped numerator and denominator
        ]
      ),
    },
  ];
}

/** Q3 — fill the missing part of a two-part split. */
export function missingPartQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { num, den, first } = twoWaysParams();
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        overDen: den,
        prompt: (
          <>
            <Frac n={num} d={den} /> = <Frac n={first} d={den} /> + ? What's the missing numerator?
          </>
        ),
        hint: `${first} pieces plus how many more make ${num} pieces?`,
        explain: `${first} + ${num - first} = ${num}, so ${num}/${den} = ${first}/${den} + ${num - first}/${den}.`,
        answer: num - first,
      },
    },
  ];
}

/** Q4 — choose a genuinely DIFFERENT correct two-part split. */
export function secondWayQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { num, den, first, second } = twoWaysParams();
  const correct = `${second}/${den} + ${num - second}/${den}`;
  // Splits the denominator too (e.g. 5/6 = 2/3 + 3/3) — treating the whole as
  // something to be divided between the parts. Guarded: if that accidentally
  // sums to num/den, fall back to a parts-that-are-one-short split.
  const d1 = Math.floor(den / 2);
  const d2 = den - d1;
  const splitDenValue = second / d1 + (num - second) / d2;
  const splitDen = Math.abs(splitDenValue - num / den) > 1e-9 ? `${second}/${d1} + ${num - second}/${d2}` : `${second}/${den} + ${num - second - 1}/${den}`;
  return [
    {
      visual: <PieceBars den={den} segments={[{ count: first, tone: "a" }, { count: num - first, tone: "b" }]} barWidth={240} />,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              The picture shows <Frac n={num} d={den} /> = <Frac n={first} d={den} /> + <Frac n={num - first} d={den} />. Which is a DIFFERENT correct way to split{" "}
              <Frac n={num} d={den} />?
            </>
          ),
          hint: `Both parts must still be ${pieceWord(den)}, and their numerators must add up to ${num}.`,
          explain: `${second} + ${num - second} = ${num}, and both parts are still ${pieceWord(den)} — so ${correct} works too.`,
        },
        correct,
        [
          `${second}/${den} + ${num - second + 1}/${den}`, // parts don't add back up — one piece too many
          splitDen, // split the denominator between the parts
        ]
      ),
    },
  ];
}

/** Q5 — how many different two-part splits (order ignored). */
export function howManyWaysQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const { num, den } = twoWaysParams();
  const ways = twoPartSplitCount(num);
  const list = Array.from({ length: ways }, (_, i) => `${i + 1}/${den} + ${num - i - 1}/${den}`).join(", ");
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              How many different ways can <Frac n={num} d={den} /> be split into TWO {pieceWord(den)}? (1/{den} + {num - 1}/{den} and {num - 1}/{den} + 1/{den} count as the
              same way.)
            </>
          ),
          hint: "Start the first part at 1 and count up — stop when the parts just swap places.",
          explain: `The different ways are ${list} — that's ${ways}.`,
        },
        String(ways),
        [
          "1", // "there's only one right answer"
          String(num - 1), // counted each split twice (order mattering)
        ]
      ),
    },
  ];
}

/** Q6 — past one whole: missing piece after the whole(s). */
export function pastOneMissingQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { num, den, wholes, rem } = pastOneParams();
  const wholeTerms = Array.from({ length: wholes }, () => `${den}/${den}`).join(" + ");
  return [
    {
      visual: <PieceBars den={den} segments={[{ count: num, tone: "a" }]} barWidth={200} />,
      difficulty,
      step: {
        kind: "number",
        overDen: den,
        prompt: (
          <>
            <Frac n={num} d={den} /> = {wholeTerms} + ? What's the missing numerator?
          </>
        ),
        hint: `Each ${den}/${den} uses ${den} pieces. How many of the ${num} pieces are left?`,
        explain: `${num} − ${wholes * den} = ${rem}, so ${num}/${den} = ${wholeTerms} + ${rem}/${den}.`,
        answer: rem,
      },
    },
  ];
}

/** Q7 — past one whole: write as wholes + leftover (mixed number). */
export function pastOneMixedQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { num, den, wholes, rem } = pastOneParams();
  return [
    {
      visual: null,
      difficulty,
      step: sentence(
        {
          prompt: (
            <>
              Decompose <Frac n={num} d={den} /> into whole ones plus a leftover fraction.
            </>
          ),
          hint: `Every ${den}/${den} is 1 whole. How many wholes fit in ${num} pieces, and what's left?`,
          explain: `${num}/${den} = ${Array.from({ length: wholes }, () => `${den}/${den}`).join(" + ")} + ${rem}/${den} = ${wholes} + ${rem}/${den}.`,
        },
        `${num}/${den} = `,
        numberBlank(wholes),
        " + ",
        numberBlank(rem),
        "",
        [undefined, den]
      ),
    },
  ];
}

/** Q8 — generalization trap: decomposing past one whole. */
export function pastOneTrapQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { num, den, wholes, rem } = pastOneParams();
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              Can <Frac n={num} d={den} /> be decomposed into a sum of {pieceWord(den)}?
            </>
          ),
          hint: "Decomposing just means splitting the pieces into groups. Does that care whether there's more than one whole?",
          explain: `Yes — ${num}/${den} = ${Array.from({ length: wholes }, () => `${den}/${den}`).join(" + ")} + ${rem}/${den}. Splitting pieces into groups works for any fraction.`,
        },
        `Yes — for example ${num}/${den} = ${den}/${den} + ${num - den}/${den}`,
        [
          "No — you can only decompose fractions that are less than 1", // thinks decomposing stops at one whole
          `No — ${num}/${den} isn't a real fraction because ${num} is bigger than ${den}`, // improper = "not a fraction"
        ]
      ),
    },
  ];
}

/** Q9 — read the equation off a two-color picture. */
export function pictureEquationQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { num, den, first } = twoWaysParams();
  const q = num - first;
  return [
    {
      visual: <PieceBars den={den} segments={[{ count: first, tone: "a" }, { count: q, tone: "b" }]} barWidth={240} />,
      difficulty,
      step: choice(
        {
          prompt: "Which equation matches the picture?",
          hint: "Count the pieces in each color. Are the pieces any smaller after you put them together?",
          explain: `${first} pieces + ${q} pieces = ${num} pieces, and every piece is still 1/${den}: ${first}/${den} + ${q}/${den} = ${num}/${den}.`,
        },
        `${first}/${den} + ${q}/${den} = ${num}/${den}`,
        [
          `${first}/${den} + ${q}/${den} = ${num}/${den * 2}`, // added the denominators too
          `${first}/${den} + ${q}/${den} = ${den}/${den}`, // counted every piece in the bar, shaded or not
        ]
      ),
    },
  ];
}

/** Q10 — three-part split. */
export function threePartQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const { num, den, p, q, r } = threePartParams();
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        overDen: den,
        prompt: (
          <>
            <Frac n={num} d={den} /> = <Frac n={p} d={den} /> + <Frac n={q} d={den} /> + ? What's the missing numerator?
          </>
        ),
        hint: `${p} + ${q} = ${p + q}. How many more to reach ${num}?`,
        explain: `${p} + ${q} + ${r} = ${num}, so the last part is ${r}/${den}.`,
        answer: r,
      },
    },
  ];
}

export const decomposingFractionsTest: Unit["test"] = {
  questions: [
    () => unitCountQuestion("easy"),
    () => unitSumChoiceQuestion("easy"),
    () => missingPartQuestion("medium"),
    () => secondWayQuestion("medium"),
    () => pictureEquationQuestion("medium"),
    () => pastOneMissingQuestion("medium"),
    () => pastOneMixedQuestion("medium"),
    () => pastOneTrapQuestion("medium"),
    () => howManyWaysQuestion("hard"),
    () => threePartQuestion("hard"),
  ],
  passScore: 9,
};
