import { TenFrameGroup } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Word Problems — Add To and Take From ----------
// 10 questions from 10 generators. Self-contained (no import from
// AddToTakeFromWordProblems.tsx — small data tables duplicated locally, same
// convention as every other *Test.tsx in this app).

const ROLES = ["the starting amount", "the change", "the result"];

const CONTEXTS: { person: string; item: string; verbAdd: string; verbTake: string }[] = [
  { person: "Nora", item: "buttons", verbAdd: "found", verbTake: "gave away" },
  { person: "Owen", item: "coins", verbAdd: "earned", verbTake: "spent" },
  { person: "Priya", item: "balloons", verbAdd: "got", verbTake: "popped" },
  { person: "Theo", item: "cards", verbAdd: "traded for", verbTake: "traded away" },
];

export const addToResultNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  let start = 0;
  let change = 0;
  do {
    start = randInt(0, 15);
    change = randInt(1, 9);
  } while (start + change > 20);
  const result = start + change;
  return [
    {
      visual: <TenFrameGroup value={start} tone="a" />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${ctx.person} had ${start} ${ctx.item}. Then ${ctx.person} ${ctx.verbAdd} ${change} more ${ctx.item}. How many ${ctx.item} does ${ctx.person} have now?`,
        hint: "Start + change = result.",
        explain: `${start} + ${change} = ${result}.`,
        answer: result,
      },
    },
  ];
};

/** Defaulting-to-the-result misconception: this story's unknown is the
 *  CHANGE, not the result — "what's unknown" asked directly. */
export const changeUnknownRoleChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  let start = 0;
  let change = 0;
  do {
    start = randInt(0, 15);
    change = randInt(1, 9);
  } while (start + change > 20);
  const result = start + change;
  return [
    {
      visual: <TenFrameGroup value={start} tone="a" />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${ctx.person} had ${start} ${ctx.item}. ${ctx.person} ${ctx.verbAdd} some more, and now has ${result} ${ctx.item}. What's unknown in this story?`,
          hint: "The question doesn't ask for the ending amount — it's already given.",
          explain: "The CHANGE is unknown — the ending amount (result) was already given in the story.",
        },
        ROLES[1],
        [ROLES[2]] // misconception: assuming the unknown is always the result
      ),
    },
  ];
};

/** Add-To-Start-Unknown — the plan's required keyword trap: "more" suggests
 *  add, but finding the START actually requires subtracting the change back out. */
export const addToStartKeywordTrapChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  let start = 0;
  let change = 0;
  do {
    start = randInt(1, 15);
    change = randInt(1, 9);
  } while (start + change > 20);
  const result = start + change;
  const wrongAdd = result + change; // misconception: "more" = add, applied again
  return [
    {
      visual: <TenFrameGroup value={result} tone="c" />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${ctx.person} had some ${ctx.item}. Then ${ctx.person} ${ctx.verbAdd} ${change} more, and now has ${result} ${ctx.item}. How many ${ctx.item} did ${ctx.person} have at the start?`,
          hint: 'The word "more" already happened — to undo it and find the start, subtract the change back out instead of adding again.',
          explain: `${result} − ${change} = ${start}. The word "more" doesn't mean add here — the change already happened, so you subtract it back out.`,
        },
        String(start),
        [String(wrongAdd)] // misconception: seeing "more" and adding again instead of subtracting
      ),
    },
  ];
};

export const takeFromResultNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  let start = 0;
  let change = 0;
  do {
    start = randInt(1, 20);
    change = randInt(1, 9);
  } while (start - change < 0);
  const result = start - change;
  return [
    {
      visual: <TenFrameGroup value={start} tone="a" />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `${ctx.person} had ${start} ${ctx.item}. Then ${ctx.person} ${ctx.verbTake} ${change} ${ctx.item}. How many ${ctx.item} does ${ctx.person} have left?`,
        hint: "Start − change = result.",
        explain: `${start} − ${change} = ${result}.`,
        answer: result,
      },
    },
  ];
};

export const takeFromChangeNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  let start = 0;
  let change = 0;
  do {
    start = randInt(1, 20);
    change = randInt(1, 9);
  } while (start - change < 0);
  const result = start - change;
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
        prompt: `${ctx.person} had ${start} ${ctx.item}. ${ctx.person} ${ctx.verbTake} some, and now has ${result} ${ctx.item} left. How many ${ctx.item} did ${ctx.person} ${ctx.verbTake}?`,
        hint: "Start − result = change.",
        explain: `${start} − ${result} = ${change}.`,
        answer: change,
      },
    },
  ];
};

/** Take-From-Start-Unknown — the mirror-image keyword trap: "gave away"/
 *  "lost" suggests subtract, but finding the START actually requires ADDING
 *  the change back on. */
export const takeFromStartKeywordTrapChoiceQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const result = randInt(2, 16);
  const change = randInt(1, 9);
  const start = result + change;
  const wrongSubtract = Math.max(0, result - change); // misconception: subtract-keyword, applied again
  return [
    {
      visual: <TenFrameGroup value={result} tone="c" />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${ctx.person} ${ctx.verbTake} ${change} ${ctx.item}, and now has ${result} ${ctx.item} left. How many ${ctx.item} did ${ctx.person} have at the start?`,
          hint: `"${ctx.verbTake}" already happened — to undo it and find the start, ADD the change back on instead of subtracting again.`,
          explain: `${result} + ${change} = ${start}. The take-away already happened, so you add the change back on to find the start — subtracting again gives the wrong direction.`,
        },
        String(start),
        [String(wrongSubtract)] // misconception: subtract-sounding verb, so subtract again instead of adding
      ),
    },
  ];
};

export const addToStartNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  let start = 0;
  let change = 0;
  do {
    start = randInt(1, 15);
    change = randInt(1, 9);
  } while (start + change > 20);
  const result = start + change;
  return [
    {
      visual: <TenFrameGroup value={result} tone="c" />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `${ctx.person} had some ${ctx.item}. ${ctx.person} ${ctx.verbAdd} ${change} more, and now has ${result} ${ctx.item}. How many ${ctx.item} did ${ctx.person} have at the start?`,
        hint: "Result − change = start.",
        explain: `${result} − ${change} = ${start}.`,
        answer: start,
      },
    },
  ];
};

export const takeFromStartNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  const result = randInt(2, 16);
  const change = randInt(1, 9);
  const start = result + change;
  return [
    {
      visual: <TenFrameGroup value={result} tone="c" />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${ctx.person} ${ctx.verbTake} ${change} ${ctx.item}, and now has ${result} ${ctx.item} left. How many ${ctx.item} did ${ctx.person} have at the start?`,
        hint: "Result + change = start.",
        explain: `${result} + ${change} = ${start}.`,
        answer: start,
      },
    },
  ];
};

/** Generalization / true-false trap: the unknown isn't always the result. */
export const resultAlwaysUnknownRuleQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: in every add-to or take-from story, the question is always asking for the ending amount (the result).",
          hint: "Think about a story where you're told the end amount and the change, and asked for the START instead.",
          explain: "False — sometimes the starting amount is unknown, and sometimes the change is unknown. Read the question every time instead of assuming.",
        },
        "False",
        ["True"] // misconception: defaulting to "the answer is always the result"
      ),
    },
  ];
};

export const addToChangeNumberQuestion = (): TestQuestion[] => {
  const ctx = pick(CONTEXTS);
  let start = 0;
  let change = 0;
  do {
    start = randInt(0, 15);
    change = randInt(1, 9);
  } while (start + change > 20);
  const result = start + change;
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
        prompt: `${ctx.person} had ${start} ${ctx.item}. ${ctx.person} ${ctx.verbAdd} some more, and now has ${result} ${ctx.item}. How many ${ctx.item} did ${ctx.person} ${ctx.verbAdd}?`,
        hint: "Result − start = change.",
        explain: `${result} − ${start} = ${change}.`,
        answer: change,
      },
    },
  ];
};

export const addToTakeFromWordProblemsTest: Unit["test"] = {
  questions: [
    addToResultNumberQuestion,
    changeUnknownRoleChoiceQuestion,
    addToStartKeywordTrapChoiceQuestion,
    takeFromResultNumberQuestion,
    takeFromChangeNumberQuestion,
    takeFromStartKeywordTrapChoiceQuestion,
    addToStartNumberQuestion,
    takeFromStartNumberQuestion,
    resultAlwaysUnknownRuleQuestion,
    addToChangeNumberQuestion,
  ],
  passScore: 9,
};
