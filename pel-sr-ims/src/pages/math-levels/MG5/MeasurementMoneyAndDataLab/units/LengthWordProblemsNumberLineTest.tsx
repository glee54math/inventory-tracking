import { NumberLineMD } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Length Word Problems and the Number Line ----------
// Self-contained (no import from LengthWordProblemsNumberLine.tsx).

const NAMES = ["Mia", "Jun", "Sam", "Priya", "Leo", "Ava", "Noah", "Zoe"] as const;
const ITEMS = ["ribbon", "rope", "string", "wire", "fence", "trail"] as const;
const pickName = () => shuffle(NAMES)[0];

export const addToQuestion = (difficulty: "easy" | "medium" = "easy"): TestQuestion[] => {
  const name = pickName();
  const item = ITEMS[randInt(0, ITEMS.length - 1)];
  const a = randInt(15, 45);
  const b = randInt(10, 40);
  const total = a + b;
  return [
    {
      visual: <NumberLineMD max={100} tickStep={10} jumps={[{ from: a, to: total }]} tone="a" />,
      difficulty,
      step: { kind: "number", prompt: `${name} has a ${item} that is ${a} inches long and ties on another piece that is ${b} inches long. How long is the ${item} now?`, hint: `Add: ${a} + ${b}.`, explain: `${a} + ${b} = ${total} inches.`, answer: total, suffix: "in" },
    },
  ];
};

export const takeFromQuestion = (difficulty: "easy" | "medium" = "easy"): TestQuestion[] => {
  const name = pickName();
  const item = ITEMS[randInt(0, ITEMS.length - 1)];
  const start = randInt(40, 90);
  const cut = randInt(10, start - 15);
  const remaining = start - cut;
  return [
    {
      visual: <NumberLineMD max={100} tickStep={10} jumps={[{ from: start, to: remaining }]} tone="b" />,
      difficulty,
      step: { kind: "number", prompt: `A ${item} was ${start} inches long. ${name} cut off ${cut} inches. How long is the ${item} now?`, hint: `Subtract: ${start} − ${cut}.`, explain: `${start} − ${cut} = ${remaining} inches.`, answer: remaining, suffix: "in" },
    },
  ];
};

export const compareDifferenceQuestion = (): TestQuestion[] => {
  const itemA = ITEMS[randInt(0, ITEMS.length - 1)];
  const itemB = ITEMS[(ITEMS.indexOf(itemA) + randInt(1, ITEMS.length - 1)) % ITEMS.length];
  const lenA = randInt(30, 90);
  const lenB = randInt(10, lenA - 10);
  const diff = lenA - lenB;
  return [
    {
      visual: (
        <NumberLineMD
          max={100}
          tickStep={10}
          points={[
            { value: lenA, tone: "a", label: `${itemA}: ${lenA}` },
            { value: lenB, tone: "b", label: `${itemB}: ${lenB}` },
          ]}
        />
      ),
      difficulty: "medium",
      step: { kind: "number", prompt: `One ${itemA} is ${lenA} inches long. One ${itemB} is ${lenB} inches long. How much longer is the ${itemA}?`, hint: `Subtract: ${lenA} − ${lenB}.`, explain: `${lenA} − ${lenB} = ${diff} inches.`, answer: diff, suffix: "in" },
    },
  ];
};

/** Start-unknown — THE misconception bucket, as a choice question isolating
 *  just the operation-selection step. */
export const startUnknownQuestion = (): TestQuestion[] => {
  const name = pickName();
  const item = ITEMS[randInt(0, ITEMS.length - 1)];
  const used = randInt(10, 30);
  const left = randInt(15, 40);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${name} had a ${item} of some length. ${name} used ${used} inches, leaving ${left} inches. Even though the story says "used," which operation finds the STARTING length?`,
          hint: "Add the used part back to what's left.",
          explain: `Addition — ${left} + ${used} gives the starting length.`,
        },
        "Addition — add the used amount back to what's left",
        ["Subtraction — because \"used\" means subtract", "Multiplication"]
      ),
    },
  ];
};

/** Change-unknown — the other half of the harder bucket. */
export const changeUnknownQuestion = (): TestQuestion[] => {
  const item = ITEMS[randInt(0, ITEMS.length - 1)];
  const start = randInt(15, 40);
  const end = start + randInt(10, 35);
  const added = end - start;
  return [
    {
      visual: <NumberLineMD max={100} tickStep={10} jumps={[{ from: start, to: end }]} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `A ${item} was ${start} inches long. Someone added more. Now it is ${end} inches long. How many inches were added?`, hint: `Subtract: ${end} − ${start}.`, explain: `${end} − ${start} = ${added} inches.`, answer: added, suffix: "in" },
    },
  ];
};

/** Same bounded-jump logic as LengthWordProblemsNumberLine.tsx's own
 *  randomJumpWithinLine — a magnitude alone can't just be randomly signed,
 *  since that can walk the jump off the 0..100 axis entirely. Duplicated
 *  here deliberately (never imported from the unit file — see this
 *  project's own circular-import warning). */
function randomJumpWithinLine(): { start: number; jump: number; end: number } {
  const start = randInt(5, 60);
  const magnitude = randInt(10, 35);
  const canGoDown = start - magnitude >= 0;
  const canGoUp = start + magnitude <= 100;
  const sign = canGoDown && canGoUp ? (Math.random() < 0.5 ? 1 : -1) : canGoUp ? 1 : -1;
  const jump = magnitude * sign;
  return { start, jump, end: start + jump };
}

export const numberLineReadQuestion = (): TestQuestion[] => {
  const { start, end } = randomJumpWithinLine();
  return [
    {
      visual: <NumberLineMD max={100} tickStep={10} jumps={[{ from: start, to: end }]} />,
      difficulty: "medium",
      step: { kind: "number", prompt: "What number does this jump land on?", hint: "Look at the dot at the end of the arc.", explain: `The jump lands on ${end}.`, answer: end },
    },
  ];
};

/** Number-line tick-value misconception, as its own test question. */
export const tickValueQuestion = (): TestQuestion[] => [
  {
    visual: <NumberLineMD max={50} tickStep={10} point={20} />,
    difficulty: "medium",
    step: choice(
      {
        prompt: "On this number line, each tick is worth 10. How many ticks to the right of 0 is the marked point?",
        hint: "Divide the value by what one tick is worth.",
        explain: "20 ÷ 10 = 2 ticks to the right of 0.",
      },
      "2 ticks",
      ["20 ticks", "10 ticks"]
    ),
  },
];

export const lengthWordProblemsNumberLineTest: Unit["test"] = {
  questions: [
    () => addToQuestion("easy"),
    () => addToQuestion("medium"),
    () => takeFromQuestion("easy"),
    () => takeFromQuestion("medium"),
    () => compareDifferenceQuestion(),
    () => startUnknownQuestion(),
    () => changeUnknownQuestion(),
    () => numberLineReadQuestion(),
    () => numberLineReadQuestion(),
    () => tickValueQuestion(),
  ],
  passScore: 9,
};
