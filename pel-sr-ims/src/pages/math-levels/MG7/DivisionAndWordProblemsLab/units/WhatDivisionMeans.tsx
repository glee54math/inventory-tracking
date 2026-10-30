import { useState } from "react";
import { EqualGroups } from "../diagrams/EqualGroups";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { FixedCFU, type CfuQuestion } from "./cfu";
import { whatDivisionMeansTest } from "./WhatDivisionMeansTest";

// Every bucket below isolates ONE of the four situation-type x unknown-type
// combinations the plan crosses (Equal Groups / Arrays-Area x Group-Size-
// Unknown / Number-of-Groups-Unknown), plus a 5th bucket ("contrast") that
// deliberately reuses the SAME numbers under both framings back-to-back —
// the plan's own device for forcing the distinction rather than letting a
// student pattern-match on the numbers alone.
export const DIVISION_MEANS_BUCKETS = ["groupsSize", "groupsCount", "arraySize", "arrayCount", "contrast"];

// ============================================================================
// SCENARIOS — cover stories kept deliberately distinct from
// MultiplicationFoundationsLab's own Equal-Groups/Arrays word-problem set
// (see this lab's build report) by using different nouns throughout.
// ============================================================================

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
  { item: "grape", items: "grapes", container: "bowl", containers: "bowls" },
  { item: "crayon", items: "crayons", container: "cup", containers: "cups" },
];

interface ArrayScenario {
  item: string;
  items: string;
}
const ARRAY_SCENARIOS: ArrayScenario[] = [
  { item: "chair", items: "chairs" },
  { item: "desk", items: "desks" },
  { item: "locker", items: "lockers" },
  { item: "flowerpot", items: "flowerpots" },
  { item: "streetlight", items: "streetlights" },
  { item: "floor tile", items: "floor tiles" },
];

// ============================================================================
// EXPLORE
// ============================================================================

function SituationExplore() {
  const [situation, setSituation] = useState<"groups" | "array">("groups");
  const [groups, setGroups] = useState(3);
  const [size, setSize] = useState(4);
  const [view, setView] = useState<"each" | "groups">("each");
  const total = groups * size;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Segmented
        label="Situation"
        value={situation}
        onChange={setSituation}
        options={[
          { id: "groups", label: "Equal Groups" },
          { id: "array", label: "Array / Rows" },
        ]}
      />
      <div className="control-row">
        <Stepper label={situation === "groups" ? "Groups" : "Rows"} value={groups} min={2} max={9} onChange={setGroups} tone="a" />
        <Stepper label={situation === "groups" ? "Per group" : "Per row"} value={size} min={2} max={9} onChange={setSize} tone="b" />
      </div>
      <EqualGroups total={total} groups={groups} layout={situation === "groups" ? "boxes" : "grid"} tone="a" />
      <Segmented
        label="Which question is this?"
        value={view}
        onChange={setView}
        options={[
          { id: "each", label: "How many in each?" },
          { id: "groups", label: "How many groups?" },
        ]}
      />
      <p className="muted small">
        {view === "each"
          ? `If you know the TOTAL (${total}) and the number of ${situation === "groups" ? "groups" : "rows"} (${groups}), dividing tells you how many are in each: ${total} ÷ ${groups} = ${size}.`
          : `If you know the TOTAL (${total}) and how many are in each ${situation === "groups" ? "group" : "row"} (${size}), dividing tells you how many ${situation === "groups" ? "groups" : "rows"} there are: ${total} ÷ ${size} = ${groups}.`}
        {" "}Notice both questions can use the exact same two numbers — what changes is what the answer MEANS.
      </p>
    </div>
  );
}

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    kind: "sentence",
    before: "In 12 ÷ 3 = 4, the 12 is called the",
    blank1: { choices: ["dividend", "divisor", "quotient"], correct: 0 },
    mid: ", and the 4 is called the",
    blank2: { choices: ["dividend", "divisor", "quotient"], correct: 2 },
    after: ".",
    correctExplain: "Right — the dividend is the total being divided, and the quotient is the answer.",
  },
  {
    kind: "choice",
    prompt: (
      <>
        Story A: "18 apples are shared equally among 3 baskets. How many apples are in EACH basket?" Story B: "18 apples are packed 3 to a
        basket. How many baskets are there?" Which story is asking "how many in each group"?
      </>
    ),
    choices: ["Story A", "Story B"],
    correct: 0,
    correctExplain: "Right — Story A already tells you the number of baskets and asks for the amount inside each one.",
    wrongExplain: "Not quite — look at which story tells you the number of GROUPS already and asks what's inside one of them.",
  },
  {
    kind: "choice",
    prompt: (
      <>
        True or False: Story A and Story B above both use the division fact 18 ÷ 3 = 6, so the number 6 means the exact same thing in both
        stories.
      </>
    ),
    choices: ["True", "False"],
    correct: 1,
    correctExplain: "False — in Story A, 6 means 6 apples in each basket. In Story B, 6 means 6 baskets. Same equation, different meaning.",
    wrongExplain: "Think again — does '6' stand for a number of apples in one story, and a number of baskets in the other?",
  },
  {
    kind: "choice",
    prompt: <>True or False: You can always tell whether a division story is asking "how many in each group" or "how many groups" just by looking at the two numbers in the equation, without reading the words of the story.</>,
    choices: ["True", "False"],
    correct: 1,
    correctExplain: "False — the numbers 18 ÷ 3 = 6 look identical either way. Only the words of the story tell you which question is being asked.",
    wrongExplain: "Careful — would the equation 18 ÷ 3 = 6 look any different if the story asked the other question instead?",
  },
];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button type="button" className="btn ghost" style={{ width: "fit-content" }} onClick={() => setShowCheck((v) => !v)}>
          Quick Check
        </button>
      )}
      {(introActive || showCheck) && <FixedCFU title="Quick check: two meanings, one equation." questions={CFU_QUESTIONS} onComplete={onIntroDone} />}
      <SituationExplore />
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — divisionStory
// ============================================================================

function makeGroupsSizeProblem(): Problem {
  const s = pick(GROUP_SCENARIOS);
  const groups = randInt(2, 9);
  let size = randInt(2, 9);
  // distinct, so the "swapped numbers" distractor never duplicates the correct choice text
  while (size === groups) size = randInt(2, 9);
  const total = groups * size;
  return {
    title: "How many in each group?",
    bucket: "groupsSize",
    story: `${total} ${s.items} are shared equally among ${groups} ${s.containers}. How many ${s.items} go in each ${s.container}?`,
    visual: (done) =>
      done < 1 ? (
        <EqualGroups total={total} layout="pool" tone="a" itemWord={s.item} />
      ) : (
        <EqualGroups total={total} groups={groups} layout="boxes" tone="a" groupWord={s.container} itemWord={s.item} />
      ),
    steps: [
      {
        kind: "number",
        prompt: `${total} ÷ ${groups} = ?`,
        hint: `You know the TOTAL (${total}) and the number of ${s.containers} (${groups}) — divide to find how many go in each one.`,
        explain: `${total} ÷ ${groups} = ${size}, so each ${s.container} gets ${size} ${s.items}.`,
        answer: size,
      },
      choice(
        {
          prompt: `What does your answer, ${size}, actually mean here?`,
          hint: "You were asked how many go into ONE group.",
          explain: `${size} means ${s.items} per ${s.container} — not a number of ${s.containers}.`,
        },
        `${size} ${s.items} in each ${s.container}`,
        [`${size} ${s.containers} in total`, `${groups} ${s.items} in each ${s.container}`]
      ),
    ],
    wrapUp: `${total} ÷ ${groups} = ${size} — each ${s.container} gets ${size} ${s.items}.`,
  };
}

function makeGroupsCountProblem(): Problem {
  const s = pick(GROUP_SCENARIOS);
  const size = randInt(2, 9);
  let groups = randInt(2, 9);
  // distinct, so the "swapped numbers" distractor never duplicates the correct choice text
  while (groups === size) groups = randInt(2, 9);
  const total = groups * size;
  return {
    title: "How many groups?",
    bucket: "groupsCount",
    story: `${total} ${s.items} are packed ${size} to a ${s.container}. How many ${s.containers} are there?`,
    visual: (done) =>
      done < 1 ? (
        <EqualGroups total={total} layout="pool" tone="b" itemWord={s.item} />
      ) : (
        <EqualGroups total={total} groups={groups} layout="boxes" tone="b" groupWord={s.container} itemWord={s.item} />
      ),
    steps: [
      {
        kind: "number",
        prompt: `${total} ÷ ${size} = ?`,
        hint: `You know the TOTAL (${total}) and how many go in each ${s.container} (${size}) — divide to find the number of ${s.containers}.`,
        explain: `${total} ÷ ${size} = ${groups}, so there are ${groups} ${s.containers}.`,
        answer: groups,
      },
      choice(
        {
          prompt: `What does your answer, ${groups}, actually mean here?`,
          hint: "You were asked how many full groups could be made.",
          explain: `${groups} means the number of ${s.containers} — not how many ${s.items} are in one.`,
        },
        `${groups} ${s.containers} in total`,
        [`${groups} ${s.items} in each ${s.container}`, `${size} ${s.containers} in total`]
      ),
    ],
    wrapUp: `${total} ÷ ${size} = ${groups} — there are ${groups} ${s.containers}.`,
  };
}

function makeArraySizeProblem(): Problem {
  const s = pick(ARRAY_SCENARIOS);
  const rows = randInt(2, 9);
  let perRow = randInt(2, 9);
  // distinct, so the "swapped numbers" distractor never duplicates the correct choice text
  while (perRow === rows) perRow = randInt(2, 9);
  const total = rows * perRow;
  return {
    title: "Arrays: how many in each row?",
    bucket: "arraySize",
    story: `${total} ${s.items} are arranged in ${rows} equal rows. How many ${s.items} are in each row?`,
    visual: (done) =>
      done < 1 ? <EqualGroups total={total} layout="pool" tone="a" itemWord={s.item} /> : <EqualGroups total={total} groups={rows} layout="grid" tone="a" groupWord="row" itemWord={s.item} />,
    steps: [
      {
        kind: "number",
        prompt: `${total} ÷ ${rows} = ?`,
        hint: `You know the TOTAL (${total}) and the number of rows (${rows}) — divide to find how many are in each row.`,
        explain: `${total} ÷ ${rows} = ${perRow} ${s.items} in each row.`,
        answer: perRow,
      },
      choice(
        {
          prompt: `What does your answer, ${perRow}, actually mean here?`,
          hint: "You were asked how many are in ONE row.",
          explain: `${perRow} means ${s.items} per row — not a number of rows.`,
        },
        `${perRow} ${s.items} in each row`,
        [`${perRow} rows in total`, `${rows} ${s.items} in each row`]
      ),
    ],
    wrapUp: `${total} ÷ ${rows} = ${perRow} ${s.items} in each row.`,
  };
}

function makeArrayCountProblem(): Problem {
  const s = pick(ARRAY_SCENARIOS);
  const perRow = randInt(2, 9);
  let rows = randInt(2, 9);
  // distinct, so the "swapped numbers" distractor never duplicates the correct choice text
  while (rows === perRow) rows = randInt(2, 9);
  const total = rows * perRow;
  return {
    title: "Arrays: how many rows?",
    bucket: "arrayCount",
    story: `${total} ${s.items} are arranged with ${perRow} in each row. How many rows are there?`,
    visual: (done) =>
      done < 1 ? <EqualGroups total={total} layout="pool" tone="b" itemWord={s.item} /> : <EqualGroups total={total} groups={rows} layout="grid" tone="b" groupWord="row" itemWord={s.item} />,
    steps: [
      {
        kind: "number",
        prompt: `${total} ÷ ${perRow} = ?`,
        hint: `You know the TOTAL (${total}) and how many are in each row (${perRow}) — divide to find the number of rows.`,
        explain: `${total} ÷ ${perRow} = ${rows} rows.`,
        answer: rows,
      },
      choice(
        {
          prompt: `What does your answer, ${rows}, actually mean here?`,
          hint: "You were asked how many rows could be made.",
          explain: `${rows} means the number of rows — not how many ${s.items} are in one row.`,
        },
        `${rows} rows in total`,
        [`${rows} ${s.items} in each row`, `${perRow} rows in total`]
      ),
    ],
    wrapUp: `${total} ÷ ${perRow} = ${rows} rows.`,
  };
}

/**
 * The "contrast" bucket: the SAME total/divisor numbers, deliberately
 * presented under BOTH framings back-to-back, so the equation 18 ÷ 3 = 6
 * shows up twice with the exact same two numbers but a different meaning for
 * the quotient each time — per the plan's own device for forcing this
 * distinction instead of letting a student pattern-match on the numbers.
 */
function makeContrastProblem(): Problem {
  const s = pick(GROUP_SCENARIOS);
  const n = randInt(2, 9);
  const m = randInt(2, 9);
  const total = n * m;
  return {
    title: "Same numbers, two different questions",
    bucket: "contrast",
    story: (
      <>
        Story A: {total} {s.items} are shared equally among {n} {s.containers}. How many {s.items} does each {s.container} get?
        <br />
        Story B: {total} {s.items} are packed {n} to a {s.container}. How many {s.containers} are there?
      </>
    ),
    visual: (done) =>
      done < 2 ? (
        <EqualGroups total={total} layout="pool" tone="c" itemWord={s.item} />
      ) : (
        <EqualGroups total={total} groups={n} layout="boxes" tone="c" groupWord={s.container} itemWord={s.item} />
      ),
    steps: [
      {
        kind: "number",
        prompt: `Story A: ${total} ÷ ${n} = ?`,
        hint: `Divide the total by the number of ${s.containers}.`,
        explain: `${total} ÷ ${n} = ${m} ${s.items} per ${s.container}.`,
        answer: m,
      },
      {
        kind: "number",
        prompt: `Story B: ${total} ÷ ${n} = ?`,
        hint: `It's the exact same equation as Story A — but think about what the answer means this time.`,
        explain: `${total} ÷ ${n} = ${m} ${s.containers} this time, since Story B is asking for the number of ${s.containers}, not the amount in each one.`,
        answer: m,
      },
      choice(
        {
          prompt: `Both answers came out to ${m}. Do they mean the same thing?`,
          hint: "Reread what each story actually asked for.",
          explain: `No — in Story A, ${m} means ${s.items} per ${s.container}. In Story B, ${m} means the number of ${s.containers}. Same numbers, different meaning.`,
        },
        "No — one means amount per container, the other means number of containers",
        ["Yes — they're asking the exact same question", "No — Story B's answer should have been a different number"]
      ),
    ],
    wrapUp: `${total} ÷ ${n} = ${m} either way — but "${m} ${s.items} per ${s.container}" and "${m} ${s.containers}" mean different things.`,
  };
}

function divisionStoryProblem(targetBucket?: string): Problem {
  const bucket = targetBucket ?? pick(DIVISION_MEANS_BUCKETS);
  switch (bucket) {
    case "groupsSize":
      return makeGroupsSizeProblem();
    case "groupsCount":
      return makeGroupsCountProblem();
    case "arraySize":
      return makeArraySizeProblem();
    case "arrayCount":
      return makeArrayCountProblem();
    default:
      return makeContrastProblem();
  }
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <EqualGroups total={12} groups={3} layout="boxes" tone="a" groupWord="plate" itemWord="cookie" />;
}

export const whatDivisionMeans: Unit = {
  id: "whatDivisionMeans",
  title: "What Division Means",
  goal: "You will be able to look at a division story or picture and tell whether it's asking 'how many in each group?' or 'how many groups?' — and know both questions can use the same division equation.",
  standard: "3.OA.2",
  keyIdea: (
    <>
      <p>Division splits a total into equal groups. Sometimes you know the number of groups and need to find the size of each one; sometimes you know the size and need to find the number of groups.</p>
      <p>Both questions can use the exact same two numbers — 12 ÷ 3 = 4 either way — but the 4 MEANS something different each time.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [{ label: "Division Stories", make: divisionStoryProblem, buckets: DIVISION_MEANS_BUCKETS }],
  requiredBuckets: DIVISION_MEANS_BUCKETS,
  test: whatDivisionMeansTest,
};
