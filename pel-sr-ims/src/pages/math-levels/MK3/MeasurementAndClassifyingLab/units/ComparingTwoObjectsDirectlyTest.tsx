import { LengthBars, BalanceScale } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import type { TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { offsetRods, otherSide, rodChoice, rodName, rodPair, sideChoice, weightPair, type OffsetRods, type Rod, type Side } from "./labParts";

// ---------- end-of-unit test: Which Is Longer? Which Is Heavier? ----------
// Shared data comes from labParts, never from the unit file (the unit file
// imports this test, so importing back would be a circular import).

const rods = (a: number, b: number) => <LengthBars max={9} bars={[{ blocks: a, tone: "a", label: "Rod A" }, { blocks: b, tone: "b", label: "Rod B" }]} />;
const shifted = ({ a, b, offA, offB }: OffsetRods) => (
  <LengthBars max={9} bars={[{ blocks: a, tone: "a", label: "Rod A", startOffset: offA }, { blocks: b, tone: "b", label: "Rod B", startOffset: offB }]} />
);
const scale = (blue: number, orange: number) => <BalanceScale left={blue} right={orange} leftLabel="Blue" rightLabel="Orange" />;
const longerOf = (a: number, b: number): Rod => (a > b ? "A" : "B");
const otherRod = (r: Rod): Rod => (r === "A" ? "B" : "A");

/** Rods that start together: which is longer. */
export const lengthAlignedQuestion = (): TestQuestion[] => {
  const [a, b] = rodPair(false);
  const longer = longerOf(a, b);
  return [{ visual: rods(a, b), difficulty: "easy", step: rodChoice({ prompt: "Which rod is longer?", hint: "Which goes farther?", explain: `Rod ${longer} is longer.` }, longer) }];
};

/** Rods that start together, near-tie: which is shorter. */
export const lengthAlignedReverseQuestion = (): TestQuestion[] => {
  const [a, b] = rodPair(true);
  const shorter = otherRod(longerOf(a, b));
  return [{ visual: rods(a, b), difficulty: "easy", step: rodChoice({ prompt: "Which rod is shorter?", hint: "Which stops first?", explain: `Rod ${shorter} is shorter.` }, shorter) }];
};

/** Different starts, any arrangement. */
export const lengthMisalignedQuestion = (): TestQuestion[] => {
  const r = offsetRods(false);
  const longer = longerOf(r.a, r.b);
  return [
    {
      visual: shifted(r),
      difficulty: "hard",
      step: rodChoice({ prompt: "They start in different places. Which rod is longer?", hint: "Count the blocks.", explain: `Rod A has ${r.a}. Rod B has ${r.b}.` }, longer),
    },
  ];
};

/** The trap: the shorter rod reaches farther. Distractor: the rod with the farther end. */
export const misalignedTrapQuestion = (): TestQuestion[] => {
  const r = offsetRods(false, true);
  const longer = longerOf(r.a, r.b);
  return [
    {
      visual: shifted(r),
      difficulty: "hard",
      step: rodChoice({ prompt: "Which rod is longer? Count the blocks.", hint: "Count the blocks.", explain: `Rod A has ${r.a}. Rod B has ${r.b}.` }, longer),
    },
  ];
};

/** Which side is heavier. */
export const weightCompareQuestion = (): TestQuestion[] => {
  const [blue, orange] = weightPair(false);
  const heavier: Side = blue > orange ? "blue" : "orange";
  return [{ visual: scale(blue, orange), difficulty: "medium", step: sideChoice({ prompt: "Which side is heavier?", hint: "Look at the scale.", explain: `The ${heavier} side went down.` }, heavier) }];
};

/** Near-tie: which side is lighter. */
export const weightCompareReverseQuestion = (): TestQuestion[] => {
  const [blue, orange] = weightPair(true);
  const lighter = otherSide(blue > orange ? "blue" : "orange");
  return [{ visual: scale(blue, orange), difficulty: "medium", step: sideChoice({ prompt: "Which side is lighter?", hint: "Look at the scale.", explain: `The ${lighter} side went up.` }, lighter) }];
};

/** Count the ringed extra blocks (review D3). No subtraction. */
export const describeDifferenceQuestion = (): TestQuestion[] => {
  const [a, b] = rodPair(false);
  const from = Math.min(a, b);
  const diff = Math.abs(a - b);
  return [
    {
      visual: (
        <LengthBars
          max={9}
          bars={[
            { blocks: a, tone: "a", label: "Rod A", extraFrom: a > b ? from : undefined, extraNumbered: false },
            { blocks: b, tone: "b", label: "Rod B", extraFrom: b > a ? from : undefined, extraNumbered: false },
          ]}
        />
      ),
      difficulty: "medium",
      step: { kind: "number", prompt: "How many extra blocks?", hint: "Count the extra blocks.", explain: `${diff} extra.`, answer: diff },
    },
  ];
};

/** Typed: how long one rod is when the rods start in different places. */
export const rodLengthCountQuestion = (): TestQuestion[] => {
  const r = offsetRods(true);
  const ask: Rod = Math.random() < 0.5 ? "A" : "B";
  const n = ask === "A" ? r.a : r.b;
  return [
    {
      visual: shifted(r),
      difficulty: "hard",
      step: { kind: "number", prompt: <>How many blocks long is {rodName(ask)}?</>, hint: "Count the blocks.", explain: `Rod ${ask} has ${n}.`, answer: n },
    },
  ];
};

/** Near-tie rods with different starts: the end alone can't tell. */
export const differentStartsQuestion = (): TestQuestion[] => {
  const r = offsetRods(true);
  const longer = longerOf(r.a, r.b);
  return [
    {
      visual: shifted(r),
      difficulty: "medium",
      step: rodChoice({ prompt: "These rods start in different places. Which is longer?", hint: "Count the blocks.", explain: `Rod A has ${r.a}. Rod B has ${r.b}.` }, longer),
    },
  ];
};

/** Read the scale, then count the side that went up (review C1-25). */
export const lighterSideCountQuestion = (): TestQuestion[] => {
  const low = randInt(1, 5);
  const high = low + randInt(1, 3);
  const blueHeavy = Math.random() < 0.5;
  return [
    {
      visual: scale(blueHeavy ? high : low, blueHeavy ? low : high),
      difficulty: "medium",
      step: { kind: "number", prompt: "How many blocks are on the lighter side?", hint: "Look at the scale.", explain: `The lighter side has ${low}.`, answer: low },
    },
  ];
};

export const comparingTest: Unit["test"] = {
  questions: [
    lengthAlignedQuestion,
    lengthAlignedReverseQuestion,
    lengthMisalignedQuestion,
    misalignedTrapQuestion,
    weightCompareQuestion,
    weightCompareReverseQuestion,
    describeDifferenceQuestion,
    rodLengthCountQuestion,
    differentStartsQuestion,
    lighterSideCountQuestion,
  ],
  passScore: 9,
};
