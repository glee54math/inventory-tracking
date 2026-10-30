import { PartitionGrid } from "../diagrams/PartitionGrid";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Partitioning Rectangles into Rows and Columns ----------
// 10 single-question generators across the 4 Practice buckets
// (partition-count, add-across-rows, uneven-trap, reverse) plus 2 extra
// generalization checks — self-contained (not importing from
// PartitioningRectangles.tsx), same independence convention as every other
// *Test.tsx in this app. Individual generators are exported so
// ModuleTest.tsx can draw a cumulative sample.

const repeatedAdd = (perRow: number, rows: number): string => Array.from({ length: rows }, () => perRow).join(" + ");

/** Q1 — partition-count: count squares in one row. */
export const perRowCountQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const rows = randInt(2, 5);
  const cols = randInt(2, 5);
  return [
    {
      visual: <PartitionGrid rows={rows} cols={cols} width={170} height={120} />,
      difficulty,
      step: { kind: "number", prompt: "How many squares are in each row?", hint: "Count across one row.", explain: `Each row has ${cols} squares.`, answer: cols },
    },
  ];
};

/** Q2 — partition-count: the full repeated-addition total. */
export const partitionTotalQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const rows = randInt(2, 5);
  const cols = randInt(2, 5);
  const total = rows * cols;
  return [
    {
      visual: <PartitionGrid rows={rows} cols={cols} width={170} height={120} />,
      difficulty,
      step: { kind: "number", prompt: `This rectangle has ${rows} equal rows of ${cols} squares each. Add them up (${repeatedAdd(cols, rows)}). What's the total?`, hint: "Add one row at a time.", explain: `${repeatedAdd(cols, rows)} = ${total}.`, answer: total },
    },
  ];
};

/** Q3 — add-across-rows: given an already-partitioned grid, add across rows. */
export const addAcrossRowsQuestion = (difficulty: "medium"): TestQuestion[] => {
  const rows = randInt(2, 5);
  const cols = randInt(2, 5);
  const total = rows * cols;
  return [
    {
      visual: <PartitionGrid rows={rows} cols={cols} width={170} height={120} />,
      difficulty,
      step: { kind: "number", prompt: `This rectangle is already split into ${rows} equal rows and ${cols} equal columns. What's the total number of squares?`, hint: `Add each row's ${cols} squares together.`, explain: `${repeatedAdd(cols, rows)} = ${total}.`, answer: total },
    },
  ];
};

/** Q4 — add-across-rows: border-miscount trap, fresh numbers from the CFU. */
export const borderMiscountQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const rows = randInt(3, 4);
  const cols = randInt(3, 4);
  const total = rows * cols;
  return [
    {
      visual: <PartitionGrid rows={rows} cols={cols} width={170} height={120} />,
      difficulty,
      step: choice(
        { prompt: "To find the total number of squares, is it enough to count only the squares around the outside edge?", hint: "Does an edge-only count include every square, including any in the middle?", explain: `No — the total needs every row fully counted: ${repeatedAdd(cols, rows)} = ${total}.` },
        "No — every square has to be counted, not just the edge.",
        ["Yes — the edge squares are all that matter."]
      ),
    },
  ];
};

/** Q5 — uneven-trap: are the pieces really equal size. */
export const unevenSizeCheckQuestion = (difficulty: "medium"): TestQuestion[] => {
  const rows = randInt(2, 4);
  const cols = randInt(3, 5);
  const variant = randInt(0, 2);
  return [
    {
      visual: <PartitionGrid rows={rows} cols={cols} uneven unevenVariant={variant} width={170} height={120} />,
      difficulty,
      step: choice(
        { prompt: "Are these pieces all the same size?", hint: "Compare a few pieces' widths and heights.", explain: "No — the pieces are clearly different sizes." },
        "No",
        ["Yes"]
      ),
    },
  ];
};

/** Q6 — uneven-trap: does grid arrangement alone make it a true partition. */
export const unevenTrapQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const rows = randInt(2, 4);
  const cols = randInt(3, 5);
  const variant = randInt(0, 2);
  return [
    {
      visual: <PartitionGrid rows={rows} cols={cols} uneven unevenVariant={variant} width={170} height={120} />,
      difficulty,
      step: choice(
        { prompt: "This is arranged in rows and columns. Is it a true partition into EQUAL squares?", hint: "A real partition needs every piece the same size, not just a grid arrangement.", explain: "No — being arranged in a grid pattern isn't enough; the pieces also have to be equal size, and these aren't." },
        "No — the pieces have to be equal size too.",
        ["Yes — it's arranged in a grid, so that's enough."]
      ),
    },
  ];
};

/** Q7 — reverse: find the missing row count from a known per-row count and total. */
export const reverseRowsQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const perRow = randInt(2, 6);
  const rows = randInt(2, 5);
  const total = perRow * rows;
  return [
    {
      visual: <PartitionGrid rows={1} cols={perRow} width={130} height={55} label={`One row of ${perRow} squares`} />,
      difficulty,
      step: { kind: "number", prompt: `Each row has ${perRow} squares. The whole rectangle has ${total} squares total. Keep adding ${perRow} until you reach ${total} — how many rows is that?`, hint: `Count by ${perRow}s: ${repeatedAdd(perRow, rows)}.`, explain: `${repeatedAdd(perRow, rows)} = ${total}, which is ${rows} rows.`, answer: rows },
    },
  ];
};

/** Q8 — reverse: find the missing per-row (column) count from a known row count and total. */
export const reverseColsQuestion = (difficulty: "hard"): TestQuestion[] => {
  const rows = randInt(2, 5);
  const perRow = randInt(2, 6);
  const total = perRow * rows;
  return [
    {
      visual: null,
      difficulty,
      step: { kind: "number", prompt: `A rectangle has ${rows} equal rows and ${total} squares total. How many squares are in each row?`, hint: `What number, added ${rows} times, makes ${total}?`, explain: `${repeatedAdd(perRow, rows)} = ${total}, so each row has ${perRow} squares.`, answer: perRow },
    },
  ];
};

/** Q9 — generalization/true-false: adding every row's count gives the total. */
export const addRowsGeneralizationQuestion = (): TestQuestion[] => {
  const rows = randInt(2, 4);
  const cols = randInt(2, 5);
  return [
    {
      visual: <PartitionGrid rows={rows} cols={cols} width={170} height={120} />,
      difficulty: "hard",
      step: choice(
        { prompt: "True or False: if every row has the same number of equal squares, adding up every row's count gives the total number of squares.", hint: "Does adding up every row's count skip any squares?", explain: "True — adding every row's count together (repeated addition) always gives the total." },
        "True",
        ["False"]
      ),
    },
  ];
};

/** Q10 — generalization/true-false trap: one row's count alone is the total. */
export const oneRowIsNotTotalQuestion = (): TestQuestion[] => {
  const rows = randInt(3, 5);
  const cols = randInt(2, 5);
  return [
    {
      visual: <PartitionGrid rows={rows} cols={cols} width={170} height={120} />,
      difficulty: "hard",
      step: choice(
        { prompt: `True or False: since every row of this rectangle has ${cols} squares, the TOTAL number of squares is also ${cols}.`, hint: "Is the total the same as just one row's count, or every row added together?", explain: `False — the total is every row added together: ${repeatedAdd(cols, rows)} = ${cols * rows}, not just ${cols}.` },
        "False",
        ["True"]
      ),
    },
  ];
};

export const partitioningRectanglesTest: Unit["test"] = {
  questions: [
    () => perRowCountQuestion("easy"),
    () => partitionTotalQuestion("easy"),
    () => addAcrossRowsQuestion("medium"),
    () => borderMiscountQuestion("medium"),
    () => unevenSizeCheckQuestion("medium"),
    () => unevenTrapQuestion("hard"),
    () => reverseRowsQuestion("medium"),
    () => reverseColsQuestion("hard"),
    addRowsGeneralizationQuestion,
    oneRowIsNotTotalQuestion,
  ],
  passScore: 9,
};
