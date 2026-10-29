import { LengthBars, BalanceScale } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Comparing Two Objects Directly ----------
// Self-contained — the distinct-pair helpers are duplicated here rather
// than imported from ComparingTwoObjectsDirectly.tsx, same convention as
// every other *Test.tsx in this app.

function lengthPair(nearTieChance = 0.5): [number, number] {
  const a = randInt(3, 9);
  let b: number;
  if (Math.random() < nearTieChance) {
    b = a + (Math.random() < 0.5 ? 1 : -1);
  } else {
    const delta = randInt(3, 6) * (Math.random() < 0.5 ? 1 : -1);
    b = a + delta;
  }
  b = Math.max(1, Math.min(12, b));
  if (b === a) b = a + 1 <= 12 ? a + 1 : a - 1;
  return [a, b];
}

function weightPair(nearTieChance = 0.5): [number, number] {
  const a = randInt(2, 7);
  let b: number;
  if (Math.random() < nearTieChance) {
    b = a + (Math.random() < 0.5 ? 1 : -1);
  } else {
    const delta = randInt(2, 4) * (Math.random() < 0.5 ? 1 : -1);
    b = a + delta;
  }
  b = Math.max(1, Math.min(8, b));
  if (b === a) b = a + 1 <= 8 ? a + 1 : a - 1;
  return [a, b];
}

/** Aligned length comparison — which is longer, the easy direct case. */
export const lengthAlignedQuestion = (): TestQuestion[] => {
  const [a, b] = lengthPair();
  const longer = a > b ? "A" : "B";
  const shorter = longer === "A" ? "B" : "A";
  return [
    {
      visual: <LengthBars bars={[{ blocks: a, tone: "a", label: "Rod A" }, { blocks: b, tone: "b", label: "Rod B" }]} />,
      difficulty: "easy",
      step: choice({ prompt: "Which rod is LONGER?", hint: "Both rods start together.", explain: `Rod ${longer} is longer.` }, `Rod ${longer}`, [`Rod ${shorter}`]),
    },
  ];
};

/** Aligned length comparison, reverse direction — which is shorter. */
export const lengthAlignedReverseQuestion = (): TestQuestion[] => {
  const [a, b] = lengthPair();
  const longer = a > b ? "A" : "B";
  const shorter = longer === "A" ? "B" : "A";
  return [
    {
      visual: <LengthBars bars={[{ blocks: a, tone: "a", label: "Rod A" }, { blocks: b, tone: "b", label: "Rod B" }]} />,
      difficulty: "easy",
      step: choice({ prompt: "Which rod is SHORTER?", hint: "It's the one that doesn't reach as far.", explain: `Rod ${shorter} is shorter.` }, `Rod ${shorter}`, [`Rod ${longer}`]),
    },
  ];
};

/** Misaligned length comparison — the standard's own named hard case. */
export const lengthMisalignedQuestion = (): TestQuestion[] => {
  const [a, b] = lengthPair();
  const offsetB = randInt(1, 4);
  const longer = a > b ? "A" : "B";
  const shorter = longer === "A" ? "B" : "A";
  return [
    {
      visual: <LengthBars bars={[{ blocks: a, tone: "a", label: "Rod A", startOffset: 0 }, { blocks: b, tone: "b", label: "Rod B", startOffset: offsetB }]} />,
      difficulty: "hard",
      step: choice(
        { prompt: "Which rod is ACTUALLY longer?", hint: "These rods don't start at the same place — compare how many blocks each one is made of.", explain: `Rod A has ${a} blocks and Rod B has ${b} blocks, so Rod ${longer} is actually longer.` },
        `Rod ${longer}`,
        [`Rod ${shorter}`]
      ),
    },
  ];
};

/** Generalization / false trap: a farther-right end never guarantees longer. */
export const misalignedTrapTrueFalseQuestion = (): TestQuestion[] => {
  const [a, b] = lengthPair();
  const offsetB = randInt(1, 4);
  return [
    {
      visual: <LengthBars bars={[{ blocks: a, tone: "a", label: "Rod A", startOffset: 0 }, { blocks: b, tone: "b", label: "Rod B", startOffset: offsetB }]} />,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: the rod whose end reaches farther to the right is always the longer rod.", hint: "Does it matter where each rod starts?", explain: "False — where a rod starts matters. A rod that starts farther right can still be the shorter one." },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Weight comparison — which side is heavier. */
export const weightCompareQuestion = (): TestQuestion[] => {
  const [left, right] = weightPair();
  const heavier = left > right ? "Left" : "Right";
  const lighter = heavier === "Left" ? "Right" : "Left";
  return [
    {
      visual: <BalanceScale left={left} right={right} leftTone="a" rightTone="b" />,
      difficulty: "medium",
      step: choice({ prompt: "Which side is HEAVIER?", hint: "The heavier side tips down.", explain: `The ${heavier} side is heavier.` }, heavier, [lighter]),
    },
  ];
};

/** Weight comparison, reverse direction — which side is lighter. */
export const weightCompareReverseQuestion = (): TestQuestion[] => {
  const [left, right] = weightPair();
  const heavier = left > right ? "Left" : "Right";
  const lighter = heavier === "Left" ? "Right" : "Left";
  return [
    {
      visual: <BalanceScale left={left} right={right} leftTone="a" rightTone="b" />,
      difficulty: "medium",
      step: choice({ prompt: "Which side is LIGHTER?", hint: "It's the side that tips up.", explain: `The ${lighter} side is lighter.` }, lighter, [heavier]),
    },
  ];
};

/** Describe the difference (not just which is more) — K.MD.2's own explicit requirement. */
export const describeDifferenceQuestion = (): TestQuestion[] => {
  const [a, b] = lengthPair(0.3);
  const longer = a > b ? "A" : "B";
  const shorter = longer === "A" ? "B" : "A";
  const longerBlocks = Math.max(a, b);
  const shorterBlocks = Math.min(a, b);
  const diff = longerBlocks - shorterBlocks;
  return [
    {
      visual: <LengthBars bars={[{ blocks: a, tone: "a", label: "Rod A" }, { blocks: b, tone: "b", label: "Rod B" }]} />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `How many blocks LONGER is Rod ${longer} than Rod ${shorter}?`,
        hint: "Count how many extra blocks the longer rod has.",
        explain: `${longerBlocks} - ${shorterBlocks} = ${diff}.`,
        answer: diff,
      },
    },
  ];
};

/** Describe-the-difference forced to the near-tie edge (difference = 1) — the hardest case to read directly off the picture. */
export const nearTieDifferenceQuestion = (): TestQuestion[] => {
  const a = randInt(3, 10);
  const b = Math.random() < 0.5 ? a + 1 : a - 1;
  const longerBlocks = Math.max(a, b);
  const shorterBlocks = Math.min(a, b);
  const longer = a > b ? "A" : "B";
  const shorter = longer === "A" ? "B" : "A";
  return [
    {
      visual: <LengthBars bars={[{ blocks: a, tone: "a", label: "Rod A" }, { blocks: b, tone: "b", label: "Rod B" }]} />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `How many blocks LONGER is Rod ${longer} than Rod ${shorter}?`,
        hint: "They're close in length — count carefully, block by block.",
        explain: `${longerBlocks} - ${shorterBlocks} = 1.`,
        answer: 1,
      },
    },
  ];
};

/** Generalization / true-false: a fair comparison requires a shared starting point. */
export const commonStartTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: "True or false: to compare two rods fairly by their ends, they must start at the same point.", hint: "Think about a rod that starts farther to the right.", explain: "True — otherwise comparing the ends alone can be misleading." },
        "True",
        ["False"]
      ),
    },
  ];
};

/** Vocabulary: which way a heavier side makes the balance tip. */
export const balanceTipDirectionQuestion = (): TestQuestion[] => {
  const [left, right] = weightPair();
  const heavier = left > right ? "Left" : "Right";
  return [
    {
      visual: <BalanceScale left={left} right={right} leftTone="a" rightTone="b" />,
      difficulty: "easy",
      step: choice(
        { prompt: `The ${heavier} side is heavier. Which way does its pan move?`, hint: "A heavier pan sinks.", explain: `The heavier (${heavier}) side's pan moves down.` },
        "Down",
        ["Up"]
      ),
    },
  ];
};

export const comparingTest: Unit["test"] = {
  questions: [
    lengthAlignedQuestion,
    lengthAlignedReverseQuestion,
    lengthMisalignedQuestion,
    misalignedTrapTrueFalseQuestion,
    weightCompareQuestion,
    weightCompareReverseQuestion,
    describeDifferenceQuestion,
    nearTieDifferenceQuestion,
    commonStartTrueFalseQuestion,
    balanceTipDirectionQuestion,
  ],
  passScore: 9,
};
