import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Two-Step Word Problems ----------
// Self-contained (no import from TwoStepWordProblems.tsx), 10 questions,
// passScore 9. Every multiple-choice question carries at least one
// misconception-targeted distractor, commented where it's built.

const NAMES = ["Maya", "Diego", "Priya", "Jamal", "Lena", "Omar", "Sofia", "Caleb"];
const ITEMS = ["pencils", "stickers", "marbles", "ribbons", "seashells", "trading cards"];

interface MultSubScenario {
  name: string;
  item: string;
  packs: number;
  perPack: number;
  step1: number;
  giveAway: number;
  final: number;
}

/** packs × perPack, then subtract giveAway. giveAway ≥ 2 so the
 *  "stopped after step 1" value can never equal the real final answer. */
export function multSubScenario(maxFactor = 9): MultSubScenario {
  const packs = randInt(2, maxFactor);
  const perPack = randInt(2, maxFactor);
  const step1 = packs * perPack;
  const giveAway = randInt(2, Math.max(2, Math.floor(step1 / 2)));
  return { name: pick(NAMES), item: pick(ITEMS), packs, perPack, step1, giveAway, final: step1 - giveAway };
}

export function multThenSubQuestion(difficulty: "easy" | "hard"): TestQuestion[] {
  const s = multSubScenario(difficulty === "hard" ? 9 : 6);
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `${s.name} buys ${s.packs} packs of ${s.perPack} ${s.item}, then gives away ${s.giveAway}. How many ${s.item} does ${s.name} have left?`,
        hint: "Multiply for the total first, then subtract.",
        explain: `${s.packs} × ${s.perPack} = ${s.step1}, then ${s.step1} − ${s.giveAway} = ${s.final}.`,
        answer: s.final,
      },
    },
  ];
}

export function divThenAddQuestion(): TestQuestion[] {
  const name = pick(NAMES);
  const item = pick(ITEMS);
  const groups = randInt(2, 6);
  const perGroup = randInt(3, 9);
  const total = groups * perGroup;
  const more = randInt(2, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${name} splits ${total} ${item} evenly into ${groups} boxes, then adds ${more} more ${item} to one box. How many ${item} are in that box now?`,
        hint: "Divide to find one box's amount, then add.",
        explain: `${total} ÷ ${groups} = ${perGroup}, then ${perGroup} + ${more} = ${perGroup + more}.`,
        answer: perGroup + more,
      },
    },
  ];
}

export function divThenDivQuestion(): TestQuestion[] {
  const name = pick(NAMES);
  const item = pick(ITEMS);
  let groups = 0;
  let people = 0;
  let perGroup = 0;
  let total = 0;
  do {
    groups = randInt(2, 6);
    people = randInt(2, 6);
    perGroup = people * randInt(2, 6);
    total = groups * perGroup;
  } while (total > 100); // keep the starting dividend within 100
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${name} splits ${total} ${item} evenly into ${groups} baskets. Then one basket's ${item} are shared evenly among ${people} friends. How many does each friend get?`,
        hint: "First find one basket's amount, then split that.",
        explain: `${total} ÷ ${groups} = ${perGroup}, then ${perGroup} ÷ ${people} = ${perGroup / people}.`,
        answer: perGroup / people,
      },
    },
  ];
}

export function firstStepMeaningQuestion(): TestQuestion[] {
  const s = multSubScenario();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${s.name} buys ${s.packs} packs of ${s.perPack} ${s.item}, then gives away ${s.giveAway}. Step 1 is ${s.packs} × ${s.perPack} = ${s.step1}. What does ${s.step1} represent?`,
          hint: "Has anything been given away yet at step 1?",
          explain: `${s.step1} is the total ${s.item} BEFORE giving any away — an in-between number, not the final answer.`,
        },
        `The total ${s.item} before giving any away`,
        [
          // Misconception: treating the step-1 result as the final answer.
          `The number of ${s.item} ${s.name} has left at the end`,
          // Misconception: mixing up which quantity the product counts.
          `The number of ${s.item} given away`,
        ]
      ),
    },
  ];
}

export function finalAnswerChoiceQuestion(): TestQuestion[] {
  const s = multSubScenario();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${s.name} buys ${s.packs} packs of ${s.perPack} ${s.item}, then gives away ${s.giveAway}. Which is the correct final answer?`,
          hint: "Two operations: multiply, then subtract.",
          explain: `${s.packs} × ${s.perPack} = ${s.step1}, then ${s.step1} − ${s.giveAway} = ${s.final}.`,
        },
        String(s.final),
        [
          // Misconception: stopped after step 1.
          String(s.step1),
          // Misconception: wrong operation in step 2 (added instead of subtracted).
          String(s.step1 + s.giveAway),
        ]
      ),
    },
  ];
}

export function equationWithLetterQuestion(): TestQuestion[] {
  const s = multSubScenario();
  const correct = `n = ${s.packs} × ${s.perPack} − ${s.giveAway}`;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${s.name} buys ${s.packs} packs of ${s.perPack} ${s.item}, then gives away ${s.giveAway}. Let n be the number left. Which equation matches?`,
          hint: "Multiply for the total, then subtract what's given away.",
          explain: `${correct} — so n = ${s.final}.`,
        },
        correct,
        [
          // Misconception: wrong operation for "gives away".
          `n = ${s.packs} × ${s.perPack} + ${s.giveAway}`,
          // Misconception: combining the wrong pair of numbers first.
          `n = ${s.packs} − ${s.perPack} × ${s.giveAway}`,
        ]
      ),
    },
  ];
}

export function solveLetterEquationQuestion(): TestQuestion[] {
  const s = multSubScenario();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `Solve for n: n = ${s.packs} × ${s.perPack} − ${s.giveAway}`,
        hint: "Multiply first, then subtract.",
        explain: `${s.packs} × ${s.perPack} = ${s.step1}, then ${s.step1} − ${s.giveAway} = ${s.final}, so n = ${s.final}.`,
        answer: s.final,
      },
    },
  ];
}

/** Always shows the "stopped after step 1" trap answer, so the correct
 *  judgment is always "not reasonable" — the brute-force script confirms the
 *  shown value never equals the real answer. */
export function reasonablenessTrapQuestion(): TestQuestion[] {
  const s = multSubScenario();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${s.name} buys ${s.packs} packs of ${s.perPack} ${s.item}, then gives away ${s.giveAway}. A classmate says ${s.name} has ${s.step1} left. Is that reasonable?`,
          hint: "After giving some away, should the number be smaller than the total bought?",
          explain: `No — ${s.step1} is the total BEFORE giving any away. After giving away ${s.giveAway}, ${s.name} has ${s.final}.`,
        },
        "No — it skips the second step, so it's too big",
        [
          // Misconception: a number that came from a real calculation must be right.
          "Yes — it's what you get from multiplying the numbers",
          "No — it's too small",
        ]
      ),
    },
  ];
}

export function oneOperationTrapQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: "True or False: Once you've done one operation and gotten a number, a two-step word problem is solved.",
          hint: "How many operations does a two-step problem need?",
          explain: "False — a two-step problem needs two operations. The first result is usually just an in-between number.",
        },
        "False",
        ["True"]
      ),
    },
  ];
}

export const twoStepWordProblemsTest: Unit["test"] = {
  questions: [
    () => multThenSubQuestion("easy"),
    divThenAddQuestion,
    divThenDivQuestion,
    firstStepMeaningQuestion,
    equationWithLetterQuestion,
    solveLetterEquationQuestion,
    finalAnswerChoiceQuestion,
    oneOperationTrapQuestion,
    reasonablenessTrapQuestion,
    () => multThenSubQuestion("hard"),
  ],
  passScore: 9,
};
