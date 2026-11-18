import { CompareRows, TenFrameGroup } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Put Together and Compare Stories ----------
// 10 questions from 9 generators (one is a 2-question cluster sharing its own
// randomized total). Self-contained (no import from
// PutTogetherCompareWordProblems.tsx — small data tables duplicated locally,
// same convention as every other *Test.tsx in this app). Pictures show only
// what the story gives; compare stories use the same lined-up rows as
// Practice, with no extras circled.

// `one` is the singular ("1 bead").
const ITEM_CONTEXTS = [
  { person: "Nora", item: "beads", one: "bead", partA: "glass", partB: "wood" },
  { person: "Owen", item: "blocks", one: "block", partA: "big", partB: "small" },
  { person: "Priya", item: "ribbons", one: "ribbon", partA: "striped", partB: "plain" },
];

const COMPARE_CONTEXTS = [
  { a: "Theo", b: "Zara", item: "pebbles", one: "pebble" },
  { a: "Finn", b: "Nina", item: "marbles", one: "marble" },
  { a: "Elle", b: "Cole", item: "paper clips", one: "paper clip" },
];

const count = (n: number, ctx: { item: string; one: string }) => `${n} ${n === 1 ? ctx.one : ctx.item}`;
const isAre = (n: number) => (n === 1 ? "is" : "are");

/** Two compare rows lined up, as the story gives them (first row first). */
const rows = (first: [string, number, "a" | "b"], second: [string, number, "a" | "b"]) => (
  <CompareRows
    rows={[
      { label: first[0], count: first[1], tone: first[2] },
      { label: second[0], count: second[1], tone: second[2] },
    ]}
  />
);

/** A compare story's numbers: big = small + diff, at most 20. */
const compareNumbers = () => {
  const small = randInt(2, 14);
  const diff = randInt(1, Math.min(9, 20 - small));
  return { small, diff, big: small + diff };
};

export const ptaTotalNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(ITEM_CONTEXTS);
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const total = a + b;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <TenFrameGroup value={a} tone="a" />
          <TenFrameGroup value={b} tone="b" />
        </div>
      ),
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${ctx.person} has ${a} ${ctx.partA} ${a === 1 ? ctx.one : ctx.item} and ${b} ${ctx.partB} ${b === 1 ? ctx.one : ctx.item}. How many ${ctx.item} in all?`,
        hint: "Put the two parts together.",
        explain: `${a} + ${b} = ${total}.`,
        answer: total,
      },
    },
  ];
};

export const ptaAddendNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(ITEM_CONTEXTS);
  const total = randInt(6, 18);
  const a = randInt(1, total - 2);
  const b = total - a;
  return [
    {
      visual: <TenFrameGroup value={total} tone="c" />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${ctx.person} has ${total} ${ctx.item}. ${a} ${isAre(a)} ${ctx.partA}. The rest are ${ctx.partB}. How many are ${ctx.partB}?`,
        hint: "Start with the total. Take away the part.",
        explain: `${total} − ${a} = ${b}.`,
        answer: b,
      },
    },
  ];
};

/** Both parts missing: a 2-question cluster sharing one total — two
 *  different ways to split it, each typed (no fixed "more than one way" pick). */
export const ptaBothAddendsCluster = (): TestQuestion[] => {
  const ctx = pick(ITEM_CONTEXTS);
  const total = randInt(5, 12);
  const g1 = randInt(1, total - 1);
  let g2 = randInt(1, total - 1);
  while (g2 === g1) g2 = randInt(1, total - 1);
  const ask = (g: number, now: boolean): TestQuestion => ({
    visual: <TenFrameGroup value={total} tone="c" />,
    difficulty: "medium",
    step: {
      kind: "number",
      prompt: `${ctx.person} has ${total} ${ctx.item}. Some are ${ctx.partA}. Some are ${ctx.partB}. ${now ? "Now " : ""}${g} ${isAre(g)} ${ctx.partA}. How many are ${ctx.partB}?`,
      hint: `Start with ${total}. Take away ${g}.`,
      explain: `${total} − ${g} = ${total - g}.`,
      answer: total - g,
    },
  });
  return [ask(g1, false), ask(g2, true)];
};

export const compareDiffMoreNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const { small, diff, big } = compareNumbers();
  return [
    {
      visual: rows([ctx.a, big, "a"], [ctx.b, small, "b"]),
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${ctx.a} has ${count(big, ctx)}. ${ctx.b} has ${count(small, ctx)}. How many more ${ctx.item} does ${ctx.a} have than ${ctx.b}?`,
        hint: "Line them up. Count the extras.",
        explain: `${big} − ${small} = ${diff}.`,
        answer: diff,
      },
    },
  ];
};

/** The named direction misconception, made explicit as a choice. */
export const compareDiffFewerDirectionChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const { small, diff, big } = compareNumbers();
  return [
    {
      visual: rows([ctx.b, small, "b"], [ctx.a, big, "a"]),
      difficulty: "hard",
      step: choice(
        {
          prompt: `${ctx.b} has ${count(small, ctx)}. ${ctx.a} has ${count(big, ctx)}. Which one finds how many fewer?`,
          hint: "Start with the bigger number. Take away the smaller one.",
          explain: `${big} − ${small} = ${diff}. Start with the bigger number.`,
        },
        `${big} − ${small}`,
        [
          `${small} − ${big}`, // misconception: subtracting in the order the names come
          `${big} + ${small}`, // misconception: "fewer" story added
        ]
      ),
    },
  ];
};

export const compareDiffFewerNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const { small, diff, big } = compareNumbers();
  return [
    {
      visual: rows([ctx.b, small, "b"], [ctx.a, big, "a"]),
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${ctx.b} has ${count(small, ctx)}. ${ctx.a} has ${count(big, ctx)}. How many fewer ${ctx.item} does ${ctx.b} have than ${ctx.a}?`,
        hint: "Start with the bigger number. Take away the smaller one.",
        explain: `${big} − ${small} = ${diff}.`,
        answer: diff,
      },
    },
  ];
};

/** One amount and the gap: base 2–15, gap smaller than base, total at most 20. */
const baseAndGap = () => {
  const base = randInt(2, 15);
  return { base, diff: randInt(1, Math.min(9, base - 1, 20 - base)) };
};

export const compareBiggerUnknownNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const { base, diff } = baseAndGap();
  const biggerAmount = base + diff;
  return [
    {
      visual: <TenFrameGroup value={base} tone="b" />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${ctx.b} has ${count(base, ctx)}. ${ctx.a} has ${diff} more than ${ctx.b}. How many ${ctx.item} does ${ctx.a} have?`,
        hint: `${ctx.a} has ${diff} more. Count on.`,
        explain: `${base} + ${diff} = ${biggerAmount}.`,
        answer: biggerAmount,
      },
    },
  ];
};

/** Smaller one missing, worded the right way for 1st grade ("fewer" finds the smaller). */
export const compareSmallerUnknownNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const { base, diff } = baseAndGap();
  const smallerAmount = base - diff;
  return [
    {
      visual: <TenFrameGroup value={base} tone="a" />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `${ctx.a} has ${count(base, ctx)}. ${ctx.b} has ${diff} fewer than ${ctx.a}. How many ${ctx.item} does ${ctx.b} have?`,
        hint: `"Fewer" means ${ctx.b} has less.`,
        explain: `${base} − ${diff} = ${smallerAmount}.`,
        answer: smallerAmount,
      },
    },
  ];
};

/** "More" and "fewer" are the same gap: both boxes typed, on one new story
 *  (no true/false rule statement). */
export const moreFewerSameGapQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const { small, diff, big } = compareNumbers();
  return [
    {
      visual: rows([ctx.a, big, "a"], [ctx.b, small, "b"]),
      difficulty: "hard",
      step: sentence(
        {
          prompt: `${ctx.a} has ${count(big, ctx)}. ${ctx.b} has ${count(small, ctx)}. Fill in both boxes.`,
          hint: "Line them up. Count the extras.",
          explain: `Both are ${diff}. It is the same gap.`,
        },
        `${ctx.a} has `,
        numberBlank(diff),
        ` more. ${ctx.b} has `,
        numberBlank(diff),
        " fewer."
      ),
    },
  ];
};

export const putTogetherCompareWordProblemsTest: Unit["test"] = {
  questions: [
    ptaTotalNumberQuestion,
    ptaAddendNumberQuestion,
    ptaBothAddendsCluster,
    compareDiffMoreNumberQuestion,
    compareDiffFewerDirectionChoiceQuestion,
    compareDiffFewerNumberQuestion,
    compareBiggerUnknownNumberQuestion,
    compareSmallerUnknownNumberQuestion,
    moreFewerSameGapQuestion,
  ],
  passScore: 9,
};
