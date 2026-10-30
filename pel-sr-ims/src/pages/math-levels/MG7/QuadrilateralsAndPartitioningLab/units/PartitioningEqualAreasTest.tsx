import {
  GridPartition,
  NONCONGRUENT_TEMPLATES,
  oneStripShaded,
  regionCounts,
  rotateGrid90,
  stripRegions,
  templateToCellRegion,
  templateToSkewedCellRegion,
} from "../diagrams/AreaPartition";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Partitioning into Equal Areas and Unit Fractions ----------
// 10 single-question generators across the 4 Practice buckets (obvious-strip,
// equal-noncongruent, judge-partition, reverse-direction) plus the plan's
// core count-vs-area misconception as its own trap question. Self-contained
// (never imports from PartitioningEqualAreas.tsx — circular-import rule);
// diagram helpers come from ../diagrams, which imports no unit file.

const STRIP_BS = [2, 3, 4, 6, 8];
const REVERSE_BS = [3, 4, 5, 6, 8];

const gridWidth = (rows: number, cols: number, cap = 36) => cols * Math.min(cap, 220 / Math.max(rows, cols));

function strip() {
  const b = pick(STRIP_BS);
  const orientation = pick(["v", "h"] as const);
  const rows = orientation === "v" ? 2 : b;
  const cols = orientation === "v" ? b : 2;
  return { b, visual: <GridPartition rows={rows} cols={cols} cellRegion={stripRegions(rows, cols, b, orientation)} width={gridWidth(rows, cols)} /> };
}

function template(skewed: boolean) {
  const t = pick(NONCONGRUENT_TEMPLATES);
  let g = { rows: t.rows, cols: t.cols, cellRegion: skewed ? templateToSkewedCellRegion(t) : templateToCellRegion(t) };
  const turns = randInt(0, 3);
  for (let i = 0; i < turns; i++) g = rotateGrid90(g.rows, g.cols, g.cellRegion);
  const [blue, orange] = regionCounts(g.cellRegion);
  return { blue, orange, visual: <GridPartition rows={g.rows} cols={g.cols} cellRegion={g.cellRegion} width={gridWidth(g.rows, g.cols)} /> };
}

/** Q1 — obvious strips: count the equal parts. */
export const stripCountQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const s = strip();
  return [
    {
      visual: s.visual,
      difficulty,
      step: { kind: "number", prompt: "How many equal parts is this rectangle cut into?", hint: "Count the strips.", explain: `${s.b} equal parts.`, answer: s.b },
    },
  ];
};

/** Q2 — obvious strips: name one part as a unit fraction. */
export const stripFractionQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const s = strip();
  return [
    {
      visual: s.visual,
      difficulty,
      step: {
        kind: "number",
        prompt: "The parts are equal. What fraction of the whole is ONE part? (Type it like 1/3.)",
        hint: "1 on top, the number of equal parts on the bottom.",
        explain: `Each part is 1/${s.b} of the whole.`,
        answer: 1 / s.b,
        frac: true,
        fracAnswer: [1, s.b],
        fracRequired: true,
      },
    },
  ];
};

/** Q3 — equal area, different shape: are they equal? */
export const nonCongruentEqualQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const t = template(false);
  return [
    {
      visual: t.visual,
      difficulty,
      step: choice(
        {
          prompt: "The blue and orange parts are different shapes. Are they equal in area?",
          hint: "Count the unit squares in each part.",
          explain: `Yes — each covers ${t.blue} unit squares.`,
        },
        "Yes — they cover the same number of unit squares.",
        // Misconception: equal area requires the same (congruent) shape.
        ["No — they're different shapes, so they can't be equal.", "No — the longer part is bigger."]
      ),
    },
  ];
};

/** Q4 — equal area, different shape: name each part. */
export const nonCongruentFractionQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const t = template(false);
  return [
    {
      visual: t.visual,
      difficulty,
      step: choice(
        {
          prompt: "This rectangle is cut into a blue part and an orange part of EQUAL area. What fraction of the whole is the blue part?",
          hint: "2 equal-area parts make the whole.",
          explain: "1/2 — two equal-area parts are halves, whatever their shapes.",
        },
        "1/2",
        // Misconception: fraction read off the cell count, or "can't name it" because shapes differ.
        [`1/${t.blue}`, "It can't be named, because the shapes are different"]
      ),
    },
  ];
};

/** Q5 — judge: a deceptive UNequal split. */
export const judgeUnequalQuestion = (difficulty: "hard"): TestQuestion[] => {
  const t = template(true);
  return [
    {
      visual: t.visual,
      difficulty,
      step: choice(
        {
          prompt: "Someone says this rectangle is cut into halves. Are they right?",
          hint: "Count the unit squares in each part. Looking close isn't the same as equal.",
          explain: `No — blue covers ${t.blue} squares and orange covers ${t.orange}, so they aren't halves.`,
        },
        "No — the parts cover different amounts.",
        // Misconception: 2 pieces = halves regardless of area.
        ["Yes — there are 2 pieces, so they're halves.", "Yes — they look about the same size."]
      ),
    },
  ];
};

/** Q6 — judge: count one part of a deceptive split. */
export const judgeCountQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const t = template(Math.random() < 0.5);
  return [
    {
      visual: t.visual,
      difficulty,
      step: { kind: "number", prompt: "How many unit squares does the BLUE part cover?", hint: "Count every square inside the blue part.", explain: `${t.blue} unit squares.`, answer: t.blue },
    },
  ];
};

/** Q7 — reverse: only one part drawn; how many equal parts? */
export const reverseCountQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const b = pick(REVERSE_BS);
  const thick = pick([2, 3]);
  const orientation = pick(["v", "h"] as const);
  const rows = orientation === "v" ? thick : b;
  const cols = orientation === "v" ? b : thick;
  return [
    {
      visual: <GridPartition rows={rows} cols={cols} cellRegion={oneStripShaded(rows, cols, b, orientation)} width={gridWidth(rows, cols)} />,
      difficulty,
      step: {
        kind: "number",
        prompt: "The shaded part is one of several EQUAL parts. How many equal parts make up the whole?",
        hint: "Count all the unit squares, then see how many groups the size of the shaded part fit.",
        explain: `${rows * cols} squares ÷ ${thick} per part = ${b} equal parts.`,
        answer: b,
      },
    },
  ];
};

/** Q8 — reverse: stated unit fraction, find the size of each part. */
export const reverseStatedQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const b = pick([3, 4, 6]);
  const per = pick([2, 3, 4]);
  const total = b * per;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `A rectangle is made of ${total} unit squares. It's cut into equal parts, and one part is 1/${b} of the whole. How many unit squares does each part cover?`,
        hint: `1/${b} means ${b} equal parts share the ${total} squares.`,
        explain: `${total} ÷ ${b} = ${per} unit squares per part.`,
        answer: per,
      },
    },
  ];
};

/** Q9 — the core misconception, as a true/false trap. */
export const countTrapQuestion = (difficulty: "hard"): TestQuestion[] => {
  const n = pick([3, 5, 6]);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `True or False: if you cut a shape into ${n} pieces, each piece is always 1/${n} of the whole.`,
          hint: "Does the number of pieces alone decide it?",
          explain: `False — each piece is 1/${n} only when all ${n} pieces have equal area.`,
        },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Q10 — 4 visibly unequal pieces: are they fourths? */
export const unequalFourthsQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const big = randInt(1, 3); // which column group gets 3 columns
  const widths = [1, 1, 1, 1];
  widths[big] = 3;
  const cols = widths.reduce((a, w) => a + w, 0);
  const row: number[] = widths.flatMap((w, region) => Array.from({ length: w }, () => region));
  return [
    {
      visual: <GridPartition rows={2} cols={cols} cellRegion={[...row, ...row]} width={gridWidth(2, cols, 30)} />,
      difficulty,
      step: choice(
        {
          prompt: "This rectangle is cut into 4 pieces. Is each piece 1/4 of the whole?",
          hint: "Compare the unit squares in each piece.",
          explain: "No — one piece covers 6 squares and the others cover 2, so they aren't fourths.",
        },
        "No — the pieces don't have equal area.",
        // Misconception: 4 pieces = fourths.
        ["Yes — there are 4 pieces, so each is 1/4.", "Yes — every piece is a rectangle."]
      ),
    },
  ];
};

export const partitioningEqualAreasTest: Unit["test"] = {
  questions: [
    () => stripCountQuestion("easy"),
    () => stripFractionQuestion("easy"),
    () => nonCongruentEqualQuestion("medium"),
    () => nonCongruentFractionQuestion("medium"),
    () => judgeUnequalQuestion("hard"),
    () => judgeCountQuestion("medium"),
    () => reverseCountQuestion("hard"),
    () => reverseStatedQuestion("medium"),
    () => countTrapQuestion("hard"),
    () => unequalFourthsQuestion("medium"),
  ],
  passScore: 9,
};
