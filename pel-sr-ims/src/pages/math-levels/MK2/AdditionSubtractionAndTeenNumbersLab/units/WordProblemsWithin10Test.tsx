import { ObjectGroup, SplitGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Solving Word Problems Within 10 ----------
// 10 questions from 10 generators. Self-contained — local copies of names/
// items instead of importing from WordProblemsWithin10.tsx, same convention
// as every other *Test.tsx in this lab.

/** Add to, result unknown. */
export const addToResultQuestion = (): TestQuestion[] => {
  const a = randInt(1, 8);
  const b = randInt(1, Math.min(9, 10 - a));
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `Jen has ${a} stickers. She gets ${b} more. How many does she have now?`, hint: "Add the starting amount and the amount that joined.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Take from, result unknown. */
export const takeFromResultQuestion = (): TestQuestion[] => {
  const total = randInt(2, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `Sam had ${total} crackers. He ate ${b} of them. How many are left?`, hint: "Subtract the amount eaten from the starting amount.", explain: `${total} − ${b} = ${a}.`, answer: a },
    },
  ];
};

/** Add-to vs. take-from operation identification — the direct conflation check. */
export const addOrSubtractChoiceQuestion = (): TestQuestion[] => {
  const takeFrom = Math.random() < 0.5;
  const n = randInt(2, 10);
  const change = randInt(1, Math.min(n, 9));
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: takeFrom
            ? `Theo had ${n} grapes. He ate ${change} of them. Does this story ADD or SUBTRACT?`
            : `Theo had ${n} grapes. He was given ${change} more. Does this story ADD or SUBTRACT?`,
          hint: 'Look at the action word: "ate"/"gave away" means subtract; "given"/"more" means add.',
          explain: takeFrom ? "He ATE grapes — they left the group, so this subtracts." : "He was GIVEN more grapes — they joined the group, so this adds.",
        },
        takeFrom ? "Subtract" : "Add",
        [takeFrom ? "Add" : "Subtract"] // misconception: picking the operation from the numbers instead of the action word
      ),
    },
  ];
};

/** Put together, total unknown — both parts coexist, nothing joins/leaves. */
export const putTogetherTotalQuestion = (): TestQuestion[] => {
  const a = randInt(1, 8);
  const b = randInt(1, Math.min(9, 10 - a));
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" showDivider={false} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Ana has ${a} red marbles and ${b} blue marbles in one jar. How many marbles are in the jar, all together?`, hint: "Both groups are already there — just add them.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Put together, addend unknown — the missing-part type. */
export const missingAddendQuestion = (): TestQuestion[] => {
  const total = randInt(3, 10);
  const a = randInt(1, total - 1);
  const b = total - a;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `There are ${total} crayons in a box. ${a} are red, and the rest are blue. How many are blue?`, hint: "Subtract the known part from the total.", explain: `${total} − ${a} = ${b}.`, answer: b },
    },
  ];
};

/** Missing-addend generalization: subtraction still applies with no take-away wording. */
export const missingAddendTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: when a story gives you a total and ONE part, you can always subtract to find the other part — even if the story never says 'take away.'",
          hint: "Think of the missing-part crayon story — nothing was taken away, but subtraction still worked.",
          explain: "True — whenever the total and one part are both known, subtracting the known part from the total always finds the missing part.",
        },
        "True",
        ["False"] // misconception: thinking subtraction only applies when something is physically removed
      ),
    },
  ];
};

/** Compare, difference unknown — the hardest bucket (two separate static quantities). */
export const compareDifferenceQuestion = (): TestQuestion[] => {
  const a = randInt(2, 10);
  let b = randInt(1, 9);
  while (b === a) b = randInt(1, 9);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  const diff = bigger - smaller;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <ObjectGroup count={a} arrangement="line" tone="a" seed={a * 7 + 1} />
          <ObjectGroup count={b} arrangement="line" tone="b" seed={b * 7 + 2} />
        </div>
      ),
      difficulty: "hard",
      step: { kind: "number", prompt: `Mia has ${a} apples. Theo has ${b} apples. How many more apples does the one with more have?`, hint: "Subtract the smaller amount from the bigger amount.", explain: `${bigger} − ${smaller} = ${diff}.`, answer: diff },
    },
  ];
};

/** Compare distractor trap: adding the two amounts instead of finding the difference. */
export const compareSumDistractorQuestion = (): TestQuestion[] => {
  const a = randInt(2, 10);
  let b = randInt(1, 9);
  while (b === a) b = randInt(1, 9);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  const diff = bigger - smaller;
  const sum = a + b;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <ObjectGroup count={a} arrangement="array" tone="a" seed={a * 5 + 4} />
          <ObjectGroup count={b} arrangement="array" tone="b" seed={b * 5 + 6} />
        </div>
      ),
      difficulty: "hard",
      step: choice(
        { prompt: `Leo has ${a} blocks. Ana has ${b} blocks. How many more blocks does Leo have than Ana?`, hint: "Compare — don't add the two groups together.", explain: `${bigger} − ${smaller} = ${diff}, not ${a} + ${b} = ${sum}.` },
        String(diff),
        [String(sum)] // misconception: adding the two separate quantities instead of subtracting to find the gap
      ),
    },
  ];
};

/** Reverse-direction: given the difference, verify the amounts equalize when it's added back. */
export const compareEqualizeQuestion = (): TestQuestion[] => {
  const smaller = randInt(1, 7);
  const diff = randInt(1, 9 - smaller);
  const bigger = smaller + diff;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `One jar has ${smaller} beads, another has ${bigger} beads. If ${diff} more beads were added to the smaller jar, would both jars then have the same amount?`,
          hint: "Add the difference to the smaller amount and compare.",
          explain: `${smaller} + ${diff} = ${bigger}, so yes — they would be equal.`,
        },
        "Yes",
        ["No"] // misconception: not recognizing that adding back the exact difference always equalizes two compared amounts
      ),
    },
  ];
};

/** Reverse within an add-to story: find the starting amount. */
export const addToStartUnknownQuestion = (): TestQuestion[] => {
  const a = randInt(1, 7);
  const b = randInt(1, Math.min(8, 10 - a));
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${b} more balloons joined a bunch, making ${total} balloons in all. How many balloons were there before any joined?`, hint: "Subtract the joining amount from the total.", explain: `${total} − ${b} = ${a}.`, answer: a },
    },
  ];
};

export const wordProblemsWithin10Test: Unit["test"] = {
  questions: [
    addToResultQuestion,
    takeFromResultQuestion,
    addOrSubtractChoiceQuestion,
    putTogetherTotalQuestion,
    missingAddendQuestion,
    missingAddendTrueFalseQuestion,
    compareDifferenceQuestion,
    compareSumDistractorQuestion,
    compareEqualizeQuestion,
    addToStartUnknownQuestion,
  ],
  passScore: 9,
};
