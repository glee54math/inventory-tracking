import { EqualGroups } from "../diagrams/EqualGroups";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: What Division Means ----------
// 10 generator functions, self-contained (does NOT import from
// WhatDivisionMeans.tsx — every *Test.tsx file in this app keeps its own
// copy of whatever scenario data it needs, to avoid a circular import
// between a unit file and its Test file; see MATH_TSX_STYLE_GUIDE.txt /
// this app's established convention for why).
//
// Diagram questions show only the loose "pool" of objects (the same picture
// Practice shows BEFORE a step is answered), never the already-grouped
// picture — a grouped picture would let a student count one box instead of
// dividing, which would make the question trivially answerable.

interface GroupScenario {
  item: string;
  items: string;
  container: string;
  containers: string;
}
const GROUP_SCENARIOS: GroupScenario[] = [
  { item: "cookie", items: "cookies", container: "plate", containers: "plates" },
  { item: "sticker", items: "stickers", container: "bag", containers: "bags" },
  { item: "marble", items: "marbles", container: "jar", containers: "jars" },
  { item: "button", items: "buttons", container: "box", containers: "boxes" },
];

const ARRAY_SCENARIOS = [
  { item: "chair", items: "chairs" },
  { item: "desk", items: "desks" },
  { item: "locker", items: "lockers" },
];

/** Group-size-unknown: "how many in each group?" — free-typed number. */
export function groupsSizeQuestion(difficulty: "easy" | "medium"): TestQuestion[] {
  const s = pick(GROUP_SCENARIOS);
  const groups = randInt(2, 9);
  let size = randInt(2, 9);
  // distinct, so the "swapped numbers" distractor never duplicates the correct choice text
  while (size === groups) size = randInt(2, 9);
  const total = groups * size;
  return [
    {
      visual: <EqualGroups total={total} layout="pool" tone="a" itemWord={s.item} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `${total} ${s.items} are shared equally among ${groups} ${s.containers}. How many ${s.items} go in each ${s.container}?`,
        hint: `Divide the total by the number of ${s.containers}.`,
        explain: `${total} ÷ ${groups} = ${size}.`,
        answer: size,
      },
    },
  ];
}

/** Number-of-groups-unknown: "how many groups?" — free-typed number. */
export function groupsCountQuestion(difficulty: "easy" | "medium"): TestQuestion[] {
  const s = pick(GROUP_SCENARIOS);
  const size = randInt(2, 9);
  let groups = randInt(2, 9);
  // distinct, so the "swapped numbers" distractor never duplicates the correct choice text
  while (groups === size) groups = randInt(2, 9);
  const total = groups * size;
  return [
    {
      visual: <EqualGroups total={total} layout="pool" tone="b" itemWord={s.item} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `${total} ${s.items} are packed ${size} to a ${s.container}. How many ${s.containers} are there?`,
        hint: `Divide the total by how many go in each ${s.container}.`,
        explain: `${total} ÷ ${size} = ${groups}.`,
        answer: groups,
      },
    },
  ];
}

/** Array, size-unknown: "how many in each row?" */
export function arraySizeQuestion(difficulty: "easy" | "medium" | "hard"): TestQuestion[] {
  const s = pick(ARRAY_SCENARIOS);
  const rows = randInt(2, 9);
  let perRow = randInt(2, 9);
  // distinct, so the "swapped numbers" distractor never duplicates the correct choice text
  while (perRow === rows) perRow = randInt(2, 9);
  const total = rows * perRow;
  return [
    {
      visual: <EqualGroups total={total} layout="pool" tone="a" itemWord={s.item} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `${total} ${s.items} are arranged in ${rows} equal rows. How many ${s.items} are in each row?`,
        hint: "Divide the total by the number of rows.",
        explain: `${total} ÷ ${rows} = ${perRow}.`,
        answer: perRow,
      },
    },
  ];
}

/** Array, count-unknown: "how many rows?" */
export function arrayCountQuestion(difficulty: "easy" | "medium" | "hard"): TestQuestion[] {
  const s = pick(ARRAY_SCENARIOS);
  const perRow = randInt(2, 9);
  let rows = randInt(2, 9);
  // distinct, so the "swapped numbers" distractor never duplicates the correct choice text
  while (rows === perRow) rows = randInt(2, 9);
  const total = rows * perRow;
  return [
    {
      visual: <EqualGroups total={total} layout="pool" tone="b" itemWord={s.item} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `${total} ${s.items} are arranged with ${perRow} in each row. How many rows are there?`,
        hint: "Divide the total by how many are in each row.",
        explain: `${total} ÷ ${perRow} = ${rows}.`,
        answer: rows,
      },
    },
  ];
}

/** Vocabulary: dividend / divisor / quotient — multiple choice. */
export function vocabularyQuestion(): TestQuestion[] {
  // divisor !== quotient so the number being asked about is never ambiguous
  // (e.g. in 36 ÷ 6 = 6, "what is 6 called?" would have two right answers).
  const divisor = randInt(2, 9);
  let quotient = randInt(2, 9);
  while (quotient === divisor) quotient = randInt(2, 9);
  const dividend = divisor * quotient;
  const roles = [
    { role: "the dividend", value: dividend, why: "the total amount being divided" },
    { role: "the divisor", value: divisor, why: "the number you divide by" },
    { role: "the quotient", value: quotient, why: "the answer to the division" },
  ];
  const target = pick(roles);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        {
          prompt: `In ${dividend} ÷ ${divisor} = ${quotient}, what is ${target.value} called?`,
          hint: "Dividend ÷ divisor = quotient.",
          explain: `${target.value} is ${target.role} — ${target.why}.`,
        },
        target.role,
        // Distractors are the other two role names — the classic mix-up is
        // swapping dividend and divisor (which number is "being divided").
        roles.filter((r) => r !== target).map((r) => r.role)
      ),
    },
  ];
}

/** Meaning of the quotient in a group-size-unknown context. */
export function meaningGroupsSizeQuestion(): TestQuestion[] {
  const s = pick(GROUP_SCENARIOS);
  const groups = randInt(2, 9);
  let size = randInt(2, 9);
  // distinct, so the "swapped numbers" distractor never duplicates the correct choice text
  while (size === groups) size = randInt(2, 9);
  const total = groups * size;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${total} ${s.items} are shared equally among ${groups} ${s.containers}. The answer to ${total} ÷ ${groups} is ${size}. What does ${size} mean?`,
          hint: "You were asked how many go into ONE group.",
          explain: `${size} means ${s.items} in each ${s.container}.`,
        },
        `${size} ${s.items} in each ${s.container}`,
        [`${size} ${s.containers} in total`, `${groups} ${s.items} in each ${s.container}`]
      ),
    },
  ];
}

/** Meaning of the quotient in a groups-count-unknown context. */
export function meaningGroupsCountQuestion(): TestQuestion[] {
  const s = pick(GROUP_SCENARIOS);
  const size = randInt(2, 9);
  let groups = randInt(2, 9);
  // distinct, so the "swapped numbers" distractor never duplicates the correct choice text
  while (groups === size) groups = randInt(2, 9);
  const total = groups * size;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${total} ${s.items} are packed ${size} to a ${s.container}. The answer to ${total} ÷ ${size} is ${groups}. What does ${groups} mean?`,
          hint: "You were asked how many full groups could be made.",
          explain: `${groups} means the number of ${s.containers}.`,
        },
        `${groups} ${s.containers} in total`,
        [`${groups} ${s.items} in each ${s.container}`, `${size} ${s.containers} in total`]
      ),
    },
  ];
}

/** The "contrast" bucket, as a single test question: same numbers, two meanings. */
export function contrastQuestion(): TestQuestion[] {
  const s = pick(GROUP_SCENARIOS);
  const n = randInt(2, 9);
  const m = randInt(2, 9);
  const total = n * m;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `Story A: ${total} ${s.items} shared equally among ${n} ${s.containers} — each ${s.container} gets ${m}. Story B: ${total} ${s.items} packed ${n} to a ${s.container} — there are ${m} ${s.containers}. Both use ${total} ÷ ${n} = ${m}. What's true?`,
          hint: "Reread what each story's answer actually counts.",
          explain: `The equation is identical, but in Story A, ${m} means ${s.items} per ${s.container}; in Story B, ${m} means the number of ${s.containers}.`,
        },
        "Same equation, but the answer means something different in each story",
        ["The two stories are really asking the exact same question", "Story B's answer must be a different number than Story A's"]
      ),
    },
  ];
}

/** Generalization/true-false trap: can the numbers alone tell you which question is being asked? */
export function cantTellFromNumbersTrapQuestion(): TestQuestion[] {
  const divisor = randInt(2, 9);
  const quotient = randInt(2, 9);
  const dividend = divisor * quotient;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `True or False: Looking only at the equation ${dividend} ÷ ${divisor} = ${quotient}, with no story or picture, you can always tell whether this means "how many in each group" or "how many groups."`,
          hint: "Would the equation look any different depending on which question was asked?",
          explain: `False — the equation ${dividend} ÷ ${divisor} = ${quotient} looks identical either way. Only the words of a story (or a picture) tell you which meaning applies.`,
        },
        "False",
        ["True"]
      ),
    },
  ];
}

export const whatDivisionMeansTest: Unit["test"] = {
  questions: [
    () => groupsSizeQuestion("easy"),
    () => groupsCountQuestion("easy"),
    () => arraySizeQuestion("medium"),
    () => arrayCountQuestion("medium"),
    vocabularyQuestion,
    meaningGroupsSizeQuestion,
    meaningGroupsCountQuestion,
    () => arraySizeQuestion("hard"),
    contrastQuestion,
    cantTellFromNumbersTrapQuestion,
  ],
  passScore: 9,
};
