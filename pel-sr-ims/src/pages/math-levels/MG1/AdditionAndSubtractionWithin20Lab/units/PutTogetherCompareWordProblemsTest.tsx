import { TenFrameGroup } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Put Together/Take Apart and Compare ----------
// 10 questions from 9 generators (one is a 2-question cluster sharing its own
// randomized total). Self-contained (no import from
// PutTogetherCompareWordProblems.tsx — small data tables duplicated locally,
// same convention as every other *Test.tsx in this app).

const ITEM_CONTEXTS = [
  { person: "Nora", item: "beads", partA: "glass", partB: "wood" },
  { person: "Owen", item: "blocks", partA: "big", partB: "small" },
  { person: "Priya", item: "ribbons", partA: "striped", partB: "plain" },
];

const COMPARE_CONTEXTS = [
  { a: "Theo", b: "Zara", item: "pebbles" },
  { a: "Finn", b: "Nina", item: "marbles" },
  { a: "Elle", b: "Cole", item: "paperclips" },
];

export const ptaTotalNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(ITEM_CONTEXTS);
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const total = a + b;
  return [
    {
      visual: <TenFrameGroup value={total} tone="a" splitAt={a} tone2="b" />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${ctx.person} has ${a} ${ctx.partA} ${ctx.item} and ${b} ${ctx.partB} ${ctx.item}. How many ${ctx.item} in all?`,
        hint: "Add the two parts.",
        explain: `${a} + ${b} = ${total}.`,
        answer: total,
      },
    },
  ];
};

export const ptaAddendNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(ITEM_CONTEXTS);
  const total = randInt(6, 18);
  const a = randInt(1, total - 1);
  const b = total - a;
  return [
    {
      visual: <TenFrameGroup value={total} tone="a" splitAt={a} tone2="b" />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${ctx.person} has ${total} ${ctx.item} in all. ${a} are ${ctx.partA} and the rest are ${ctx.partB}. How many are ${ctx.partB}?`,
        hint: "Total − known part = the other part.",
        explain: `${total} − ${a} = ${b}.`,
        answer: b,
      },
    },
  ];
};

/** Both-Addends-Unknown: a 2-question cluster sharing one total — tests
 *  recognizing multiple valid splits, then actually producing one. */
export const ptaBothAddendsCluster = (): TestQuestion[] => {
  const ctx = pick(ITEM_CONTEXTS);
  const total = randInt(5, 12);
  const given = randInt(1, total - 1);
  return [
    {
      visual: <TenFrameGroup value={total} tone="c" />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${ctx.person} has ${total} ${ctx.item}. Some are ${ctx.partA} and some are ${ctx.partB}. How many different ways could this split?`,
          hint: "Try a few splits yourself — does only one combination work?",
          explain: `More than one way works — any split of ${total} into two parts is a valid answer.`,
        },
        "More than one way",
        ["Exactly one way"] // misconception: both-addends-unknown treated as having one right answer
      ),
    },
    {
      visual: <TenFrameGroup value={total} tone="c" splitAt={given} tone2="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Give one way: if ${given} are ${ctx.partA}, how many are ${ctx.partB}?`, hint: `${total} − ${given} = ?`, explain: `${total} − ${given} = ${total - given}.`, answer: total - given },
    },
  ];
};

export const compareDiffMoreNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const small = randInt(2, 14);
  const diff = randInt(1, Math.min(9, 20 - small));
  const big = small + diff;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20 }}>
          <TenFrameGroup value={big} tone="a" />
          <TenFrameGroup value={small} tone="b" />
        </div>
      ),
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${ctx.a} has ${big} ${ctx.item}. ${ctx.b} has ${small} ${ctx.item}. How many MORE ${ctx.item} does ${ctx.a} have than ${ctx.b}?`,
        hint: "Subtract the smaller amount from the bigger amount.",
        explain: `${big} − ${small} = ${diff}.`,
        answer: diff,
      },
    },
  ];
};

/** The named direction misconception, made explicit as a choice. */
export const compareDiffFewerDirectionChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const small = randInt(2, 14);
  const diff = randInt(1, Math.min(9, 20 - small));
  const big = small + diff;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20 }}>
          <TenFrameGroup value={small} tone="b" />
          <TenFrameGroup value={big} tone="a" />
        </div>
      ),
      difficulty: "hard",
      step: choice(
        {
          prompt: `${ctx.b} has ${small} ${ctx.item}. ${ctx.a} has ${big} ${ctx.item}. Which calculation finds how many FEWER ${ctx.item} ${ctx.b} has than ${ctx.a}?`,
          hint: "Always subtract the smaller amount from the bigger amount, no matter which name comes first.",
          explain: `${big} − ${small} = ${diff} — subtract the smaller from the bigger, not in the order the names are mentioned.`,
        },
        `${big} − ${small}`,
        [`${small} − ${big}`] // misconception: subtracting in sentence order instead of smaller-from-bigger
      ),
    },
  ];
};

export const compareDiffFewerNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const small = randInt(2, 14);
  const diff = randInt(1, Math.min(9, 20 - small));
  const big = small + diff;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20 }}>
          <TenFrameGroup value={small} tone="b" />
          <TenFrameGroup value={big} tone="a" />
        </div>
      ),
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${ctx.b} has ${small} ${ctx.item}. ${ctx.a} has ${big} ${ctx.item}. How many FEWER ${ctx.item} does ${ctx.b} have than ${ctx.a}?`,
        hint: "Subtract the smaller from the bigger.",
        explain: `${big} − ${small} = ${diff}.`,
        answer: diff,
      },
    },
  ];
};

export const compareBiggerUnknownNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const base = randInt(2, 15);
  const diff = randInt(1, Math.min(9, base, 20 - base));
  const biggerAmount = base + diff;
  return [
    {
      visual: <TenFrameGroup value={base} tone="b" />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${ctx.b} has ${base} ${ctx.item}. ${ctx.a} has ${diff} more ${ctx.item} than ${ctx.b}. How many ${ctx.item} does ${ctx.a} have?`,
        hint: "Add the difference onto the known amount.",
        explain: `${base} + ${diff} = ${biggerAmount}.`,
        answer: biggerAmount,
      },
    },
  ];
};

export const compareSmallerUnknownNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(COMPARE_CONTEXTS);
  const base = randInt(2, 15);
  // Capped by `base` too, not just 20-base — this computes base - diff,
  // which would go negative without that cap.
  const diff = randInt(1, Math.min(9, base, 20 - base));
  const smallerAmount = base - diff;
  return [
    {
      visual: <TenFrameGroup value={base} tone="a" />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `${ctx.a} has ${base} ${ctx.item}. ${ctx.a} has ${diff} more ${ctx.item} than ${ctx.b}. How many ${ctx.item} does ${ctx.b} have?`,
        hint: "Subtract the difference from the known amount.",
        explain: `${base} − ${diff} = ${smallerAmount}.`,
        answer: smallerAmount,
      },
    },
  ];
};

/** Generalization trap: "more" and "fewer" are the same gap, different words. */
export const moreFewerSameGapQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: 'Grace has 9 shells. Max has 5 shells. True or false: "how many more does Grace have than Max" and "how many fewer does Max have than Grace" have the same answer.',
          hint: "Both questions are asking about the exact same gap between 9 and 5.",
          explain: "True — both describe the same gap (9 − 5 = 4), just in different words. \"More\" and \"fewer\" don't change the math.",
        },
        "True",
        ["False"] // misconception: treating "more"/"fewer" as different operations instead of the same gap
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
