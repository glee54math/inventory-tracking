import { ShapePartition, type PartitionShape, type SquareCutStyle } from "../diagrams/ShapePartition";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Partitioning Into Halves and Fourths ----------
// 10 single-question generators across the 5 Practice buckets (halves-equal,
// halves-unequal, fourths-equal, fourths-unequal, compare-halves-fourths)
// plus 2 extra generalization checks — self-contained (not importing from
// PartitioningShapes.tsx), same independence convention as every other
// *Test.tsx in this app. Individual generators are exported so
// ModuleTest.tsx can draw a cumulative sample.

const SHAPES: PartitionShape[] = ["circle", "square"];

const skewFraction = (): number => randInt(12, 32) / 100;

/** Q1 — halves: count the equal pieces. */
export const halvesEqualCountQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  return [
    {
      visual: <ShapePartition shape={shape} pattern="halves-equal" orientation={shape === "square" ? pick(["v", "h", "diag"] as const) : pick([-90, 0, 45])} width={130} height={130} />,
      difficulty,
      step: {
        kind: "number",
        prompt: "How many EQUAL pieces is this shape cut into?",
        hint: "Count the pieces, and check they're the same size.",
        explain: "It's cut into 2 equal pieces.",
        answer: 2,
      },
    },
  ];
};

/** Q2 — halves: name the piece. */
export const halvesEqualNameQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  return [
    {
      visual: <ShapePartition shape={shape} pattern="halves-equal" width={130} height={130} />,
      difficulty,
      step: choice(
        {
          prompt: "What do we call one of these 2 equal pieces?",
          hint: "2 equal pieces of a whole are called...",
          explain: "2 equal pieces are called halves.",
        },
        "A half",
        ["A fourth", "A whole"]
      ),
    },
  ];
};

/** Q3 — halves: unequal non-example. */
export const halvesUnequalQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const shape = pick(SHAPES);
  const skew = skewFraction();
  return [
    {
      visual: <ShapePartition shape={shape} pattern="halves-unequal" unequalFractions={shape === "circle" ? [skew, 1 - skew] : [skew]} width={130} height={130} />,
      difficulty,
      step: choice(
        {
          prompt: "This shape is cut into 2 pieces that are NOT the same size. Can we call them halves?",
          hint: "Halves must be equal size, not just 2 pieces.",
          explain: "No — halves have to be the same size.",
        },
        "No — halves have to be equal size.",
        ["Yes — there are 2 pieces, so they're halves."]
      ),
    },
  ];
};

/** Q4 — fourths: count the equal pieces. */
export const fourthsEqualCountQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  const cutStyle: SquareCutStyle = pick(["plus", "x"]);
  return [
    {
      visual: <ShapePartition shape={shape} pattern="fourths-equal" cutStyle={cutStyle} orientation={shape === "circle" ? pick([-90, 0, 45]) : undefined} width={130} height={130} />,
      difficulty,
      step: {
        kind: "number",
        prompt: "How many EQUAL pieces is this shape cut into?",
        hint: "Count the pieces, and check they're the same size.",
        explain: "It's cut into 4 equal pieces.",
        answer: 4,
      },
    },
  ];
};

/** Q5 — fourths: name the piece. */
export const fourthsEqualNameQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  return [
    {
      visual: <ShapePartition shape={shape} pattern="fourths-equal" width={130} height={130} />,
      difficulty,
      step: choice(
        {
          prompt: "What do we call one of these 4 equal pieces?",
          hint: "4 equal pieces of a whole are called...",
          explain: "4 equal pieces are called fourths (or quarters).",
        },
        "A fourth (or quarter)",
        ["A half", "A whole"]
      ),
    },
  ];
};

/** Q6 — fourths: unequal non-example. */
export const fourthsUnequalQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const shape = pick(SHAPES);
  const a = skewFraction();
  const b = skewFraction() + 0.3;
  return [
    {
      visual: <ShapePartition shape={shape} pattern="fourths-unequal" unequalFractions={shape === "circle" ? [a, b, a, 1 - 2 * a - b] : [a, b]} width={130} height={130} />,
      difficulty,
      step: choice(
        {
          prompt: "This shape is cut into 4 pieces that are NOT all the same size. Can we call them fourths?",
          hint: "Fourths must be 4 equal-size pieces, not just any 4 pieces.",
          explain: "No — fourths have to be 4 pieces that are all the same size.",
        },
        "No — fourths have to be 4 equal-size pieces.",
        ["Yes — there are 4 pieces, so they're fourths."]
      ),
    },
  ];
};

/** Q7 — generalization: 2 different valid cutting patterns are BOTH fourths. */
export const fourthsPatternVarietyQuestion = (): TestQuestion[] => [
  {
    visual: (
      <div style={{ display: "flex", gap: 16 }}>
        <ShapePartition shape="square" pattern="fourths-equal" cutStyle="plus" width={110} height={110} />
        <ShapePartition shape="square" pattern="fourths-equal" cutStyle="x" width={110} height={110} />
      </div>
    ),
    difficulty: "hard",
    step: choice(
      {
        prompt: "A square cut into 4 equal small squares (left) and a square cut into 4 equal triangles (right) — are BOTH of these examples of fourths?",
        hint: "Fourths just means 4 EQUAL pieces — it doesn't require one exact cutting pattern.",
        explain: "True — both pictures show 4 equal-size pieces, so both are fourths, even though the pieces are shaped differently.",
      },
      "True — both show 4 equal pieces.",
      ["False — only one of these is really fourths."]
    ),
  },
];

/** Q8 — compare: which is bigger. */
export const compareSizeQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 16 }}>
          <ShapePartition shape={shape} pattern="halves-equal" width={110} height={110} />
          <ShapePartition shape={shape} pattern="fourths-equal" width={110} height={110} />
        </div>
      ),
      difficulty,
      step: choice(
        {
          prompt: "These are the same-size whole. Which piece is bigger — a half, or a fourth?",
          hint: "More pieces from the same-size whole means each piece is smaller.",
          explain: "A half is bigger than a fourth of the same-size whole.",
        },
        "A half",
        ["A fourth", "They're the same size"]
      ),
    },
  ];
};

/** Q9 — compare: why (the misconception-targeted reasoning question). */
export const compareWhyQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      {
        prompt: "Why is a fourth smaller than a half, of the same-size whole?",
        hint: "Think about cutting the SAME whole into more pieces.",
        explain: "Cutting the same-size whole into more pieces makes each piece smaller, not bigger.",
      },
      "Cutting into more pieces makes each piece smaller.",
      ["4 is a bigger number than 2, so fourths must be bigger.", "Halves and fourths are actually the same size."]
    ),
  },
];

/** Q10 — the piece-count-vs-equal-size trap, fresh numbers from the CFU's. */
export const countVsEqualTrapQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const shape = pick(SHAPES);
  const a = skewFraction();
  const b = skewFraction() + 0.3;
  return [
    {
      visual: <ShapePartition shape={shape} pattern="fourths-unequal" unequalFractions={shape === "circle" ? [a, b, a, 1 - 2 * a - b] : [a, b]} width={130} height={130} />,
      difficulty,
      step: choice(
        {
          prompt: "This shape is cut into 4 pieces. Which statement is correct?",
          hint: "Count isn't enough — check whether the pieces are equal size too.",
          explain: "They are NOT fourths — the 4 pieces are clearly different sizes, and fourths must be equal.",
        },
        "They are NOT fourths, because the pieces aren't equal size.",
        ["They ARE fourths, because there are 4 pieces.", "They are halves."]
      ),
    },
  ];
};

export const partitioningShapesTest: Unit["test"] = {
  questions: [
    () => halvesEqualCountQuestion("easy"),
    () => halvesEqualNameQuestion("easy"),
    () => halvesUnequalQuestion("medium"),
    () => fourthsEqualCountQuestion("easy"),
    () => fourthsEqualNameQuestion("medium"),
    () => fourthsUnequalQuestion("medium"),
    fourthsPatternVarietyQuestion,
    () => compareSizeQuestion("medium"),
    () => compareWhyQuestion("hard"),
    () => countVsEqualTrapQuestion("hard"),
  ],
  passScore: 9,
};
