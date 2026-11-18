import { TenFrameGroup } from "../diagrams";
import { storySentenceChoices } from "../logic";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Add To and Take From Stories ----------
// 10 questions from 10 generators. Self-contained (no import from
// AddToTakeFromWordProblems.tsx — small data tables duplicated locally, same
// convention as every other *Test.tsx in this app; the shared sentence-choice
// helper lives in the non-circular ../logic.ts).
// Only ONE start-missing story counts toward the pass (user decision: 1st
// graders meet start-unknown stories but master them in 2nd grade).

const ROLES = ["the start", "the change", "the end"];

// verbAdd/verbTake are past tense; the *Base forms follow "did" ("How many did Owen find?").
// `one` is the singular ("1 rock"); `pr` is the pronoun for `person`.
const CONTEXTS: { person: string; pr: "he" | "she"; item: string; one: string; verbAdd: string; verbAddBase: string; verbTake: string; verbTakeBase: string }[] = [
  { person: "Nora", pr: "she", item: "buttons", one: "button", verbAdd: "found", verbAddBase: "find", verbTake: "gave away", verbTakeBase: "give away" },
  { person: "Owen", pr: "he", item: "rocks", one: "rock", verbAdd: "found", verbAddBase: "find", verbTake: "lost", verbTakeBase: "lose" },
  { person: "Priya", pr: "she", item: "balloons", one: "balloon", verbAdd: "got", verbAddBase: "get", verbTake: "popped", verbTakeBase: "pop" },
  { person: "Theo", pr: "he", item: "cards", one: "card", verbAdd: "got", verbAddBase: "get", verbTake: "gave away", verbTakeBase: "give away" },
];
type Ctx = (typeof CONTEXTS)[number];
const cap = (w: string) => w[0].toUpperCase() + w.slice(1);
/** "1 rock" / "3 rocks". */
const count = (n: number, ctx: Ctx) => `${n} ${n === 1 ? ctx.one : ctx.item}`;

/** An Add To story's numbers: start 1–15 (a story starts with something), end at most 20. */
const addToNumbers = () => {
  let start = 0;
  let change = 0;
  do {
    start = randInt(1, 15);
    change = randInt(1, 9);
  } while (start + change > 20);
  return { start, change, result: start + change };
};

/** A Take From story's numbers: start at most 20; the end is 0 or more (1 or more unless the end is asked). */
const takeFromNumbers = (minEnd: number) => {
  let start = 0;
  let change = 0;
  do {
    start = randInt(1, 20);
    change = randInt(1, 9);
  } while (start - change < minEnd);
  return { start, change, result: start - change };
};

/** Start-missing Take From numbers, built from the end: start = end + change stays at most 20. */
const takeFromStartNumbers = () => {
  const result = randInt(2, 16);
  const change = randInt(1, Math.min(9, 20 - result));
  return { start: result + change, change, result };
};

export const addToResultNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, change, result } = addToNumbers();
  return [
    {
      visual: <TenFrameGroup value={start} tone="a" />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${ctx.person} had ${count(start, ctx)}. Then ${ctx.pr} ${ctx.verbAdd} ${change} more. How many ${ctx.item} does ${ctx.person} have now?`,
        hint: "Start, then add the change.",
        explain: `${start} + ${change} = ${result}.`,
        answer: result,
      },
    },
  ];
};

/** Defaulting-to-the-end misconception: this story's missing part is the
 *  CHANGE, not the end — "what is missing" asked directly. */
export const changeUnknownRoleChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, result } = addToNumbers();
  return [
    {
      visual: <TenFrameGroup value={start} tone="a" />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${ctx.person} had ${count(start, ctx)}. ${cap(ctx.pr)} ${ctx.verbAdd} some more. Now ${ctx.pr} has ${count(result, ctx)}. What is missing?`,
          hint: "The story tells two numbers. Which one is missing?",
          explain: "The change is missing. The story tells the start and the end.",
        },
        ROLES[1],
        [ROLES[2], ROLES[0]] // misconception: assuming the missing part is always the end
      ),
    },
  ];
};

/** Add-To-Start-Unknown — the plan's keyword trap: "more" suggests add, but
 *  finding the START means taking the change away. (Module Test.) */
export const addToStartKeywordTrapChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  // start + 2 × change ≤ 20, so the wrong choice (end + change) stays within 20 too.
  let start = 0;
  let change = 0;
  do {
    start = randInt(1, 15);
    change = randInt(1, 9);
  } while (start + 2 * change > 20);
  const result = start + change;
  const wrongAdd = result + change; // misconception: "more" = add, applied again
  return [
    {
      visual: <TenFrameGroup value={result} tone="c" />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${ctx.person} had some ${ctx.item}. Then ${ctx.pr} ${ctx.verbAdd} ${change} more. Now ${ctx.pr} has ${count(result, ctx)}. How many did ${ctx.person} have at the start?`,
          hint: `${cap(ctx.pr)} ${ctx.verbAdd} more. To find the start, take those away.`,
          explain: `${result} − ${change} = ${start}. To find the start, take away the ones ${ctx.pr} ${ctx.verbAdd}.`,
        },
        String(start),
        [String(wrongAdd)] // misconception: seeing "more" and adding again instead of taking away
      ),
    },
  ];
};

export const takeFromResultNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, change, result } = takeFromNumbers(0);
  return [
    {
      visual: <TenFrameGroup value={start} tone="a" />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${ctx.person} had ${count(start, ctx)}. Then ${ctx.pr} ${ctx.verbTake} ${change}. How many ${ctx.item} does ${ctx.person} have left?`,
        hint: "Start, then take away the change.",
        explain: `${start} − ${change} = ${result}.`,
        answer: result,
      },
    },
  ];
};

export const takeFromChangeNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, change, result } = takeFromNumbers(1);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20 }}>
          <TenFrameGroup value={start} tone="a" />
          <TenFrameGroup value={result} tone="c" />
        </div>
      ),
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${ctx.person} had ${count(start, ctx)}. ${cap(ctx.pr)} ${ctx.verbTake} some. Now ${ctx.pr} has ${count(result, ctx)}. How many did ${ctx.person} ${ctx.verbTakeBase}?`,
        hint: "Count back from the start to the end.",
        explain: `${start} − ${result} = ${change}.`,
        answer: change,
      },
    },
  ];
};

/** Take-From-Start-Unknown — the mirror-image keyword trap. Not in the unit
 *  Test (only one start-missing story counts); kept for reuse. */
export const takeFromStartKeywordTrapChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, change, result } = takeFromStartNumbers();
  // misconception: subtract-sounding verb, so subtract again (or, when that's below 0, keep the end)
  const wrongSubtract = result - change >= 0 ? result - change : result;
  return [
    {
      visual: <TenFrameGroup value={result} tone="c" />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${ctx.person} had some ${ctx.item}. Then ${ctx.pr} ${ctx.verbTake} ${change}. Now ${ctx.pr} has ${count(result, ctx)}. How many did ${ctx.person} have at the start?`,
          hint: `${cap(ctx.pr)} ${ctx.verbTake} some. To find the start, add them back.`,
          explain: `${result} + ${change} = ${start}. To find the start, add back the ones ${ctx.pr} ${ctx.verbTake}.`,
        },
        String(start),
        [String(wrongSubtract)]
      ),
    },
  ];
};

/** The one start-missing story in the unit Test: "more", but you take away. */
export const addToStartNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, change, result } = addToNumbers();
  return [
    {
      visual: <TenFrameGroup value={result} tone="c" />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `${ctx.person} had some ${ctx.item}. Then ${ctx.pr} ${ctx.verbAdd} ${change} more. Now ${ctx.pr} has ${count(result, ctx)}. How many did ${ctx.person} have at the start?`,
        hint: `${cap(ctx.pr)} ${ctx.verbAdd} more. To find the start, take those away.`,
        explain: `${result} − ${change} = ${start}.`,
        answer: start,
      },
    },
  ];
};

/** Not in the unit Test (only one start-missing story counts); kept for reuse. */
export const takeFromStartNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, change, result } = takeFromStartNumbers();
  return [
    {
      visual: <TenFrameGroup value={result} tone="c" />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${ctx.person} had some ${ctx.item}. Then ${ctx.pr} ${ctx.verbTake} ${change}. Now ${ctx.pr} has ${count(result, ctx)}. How many did ${ctx.person} have at the start?`,
        hint: `${cap(ctx.pr)} ${ctx.verbTake} some. To find the start, add them back.`,
        explain: `${result} + ${change} = ${start}.`,
        answer: start,
      },
    },
  ];
};

/** "What is missing?" on one new Take From story (no true/false rule
 *  statement). Half the time the change is missing, half the time the end
 *  (C2-04), so this and changeUnknownRoleChoiceQuestion are not both
 *  answered "the change". No start-missing story here (only one counts). */
export const takeFromMissingRoleChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const endMissing = Math.random() < 0.5;
  const { start, change, result } = takeFromNumbers(endMissing ? 0 : 1);
  const prompt = endMissing
    ? `${ctx.person} had ${count(start, ctx)}. Then ${ctx.pr} ${ctx.verbTake} ${change}. How many ${ctx.item} does ${ctx.person} have left? What is missing?`
    : `${ctx.person} had ${count(start, ctx)}. ${cap(ctx.pr)} ${ctx.verbTake} some. Now ${ctx.pr} has ${count(result, ctx)}. What is missing?`;
  const answer = endMissing ? ROLES[2] : ROLES[1];
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt,
          hint: "The story tells two numbers. Which one is missing?",
          explain: endMissing ? "The end is missing. The story tells the start and the change." : "The change is missing. The story tells the start and the end.",
        },
        answer,
        ROLES.filter((r) => r !== answer) // misconceptions: the missing part is always the end / always the change
      ),
    },
  ];
};

export const addToChangeNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, change, result } = addToNumbers();
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20 }}>
          <TenFrameGroup value={start} tone="a" />
          <TenFrameGroup value={result} tone="c" />
        </div>
      ),
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${ctx.person} had ${count(start, ctx)}. ${cap(ctx.pr)} ${ctx.verbAdd} some more. Now ${ctx.pr} has ${count(result, ctx)}. How many did ${ctx.person} ${ctx.verbAddBase}?`,
        hint: "Count on from the start to the end.",
        explain: `${result} − ${start} = ${change}.`,
        answer: change,
      },
    },
  ];
};

/** "Which one matches the story?" — the student picks the number sentence (C1-07). */
const matchQuestion = (prompt: string, p: number, q: number, correct: string, answer: number): TestQuestion[] => [
  {
    visual: null,
    difficulty: "medium",
    step: choice(
      { prompt: `${prompt} Which one matches the story?`, hint: "Picture the story. Did it go up or down?", explain: `${correct} matches the story.` },
      correct,
      storySentenceChoices(p, q, correct, answer) // misconceptions: the other sign (keyword), adding the two numbers
    ),
  },
];

export const addToChangeMatchChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, change, result } = addToNumbers();
  return matchQuestion(`${ctx.person} had ${count(start, ctx)}. ${cap(ctx.pr)} ${ctx.verbAdd} some more. Now ${ctx.pr} has ${count(result, ctx)}.`, start, result, `${start} + ☐ = ${result}`, change);
};

export const takeFromResultMatchChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, change, result } = takeFromNumbers(0);
  return matchQuestion(`${ctx.person} had ${count(start, ctx)}. Then ${ctx.pr} ${ctx.verbTake} ${change}.`, start, change, `${start} − ${change} = ☐`, result);
};

export const takeFromChangeMatchChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const { start, change, result } = takeFromNumbers(1);
  return matchQuestion(`${ctx.person} had ${count(start, ctx)}. ${cap(ctx.pr)} ${ctx.verbTake} some. Now ${ctx.pr} has ${count(result, ctx)}.`, start, result, `${start} − ☐ = ${result}`, change);
};

export const addToTakeFromWordProblemsTest: Unit["test"] = {
  questions: [
    addToResultNumberQuestion,
    changeUnknownRoleChoiceQuestion,
    addToStartNumberQuestion,
    takeFromResultNumberQuestion,
    takeFromChangeNumberQuestion,
    takeFromMissingRoleChoiceQuestion,
    addToChangeNumberQuestion,
    addToChangeMatchChoiceQuestion,
    takeFromResultMatchChoiceQuestion,
    takeFromChangeMatchChoiceQuestion,
  ],
  passScore: 9,
};
