import { SharePartition, unequalFractions, type ShareShape, type RectCutStyle } from "../diagrams/SharePartition";
import { pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Equal Shares of Circles and Rectangles ----------
// 10 single-question generators across the 6 Practice buckets (halves-equal,
// thirds-equal, fourths-equal, same-whole-different-shape, unequal-trap,
// half-vs-third-compare) — self-contained (not importing from
// EqualSharesOfCirclesAndRectangles.tsx), same independence convention as
// every other *Test.tsx in this app. Thirds gets extra weight (2 of the 10
// questions) since it's the genuinely new idea at Grade 2 (halves/fourths
// carry over from Grade 1). Individual generators are exported so
// ModuleTest.tsx can draw a cumulative sample.

const SHAPES: ShareShape[] = ["circle", "rectangle"];

/** Q1 — halves-equal: count the equal pieces. */
export const halvesEqualCountQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  const cutStyle: RectCutStyle = shape === "rectangle" ? pick(["stripesV", "stripesH", "diag"]) : "stripesV";
  return [
    {
      visual: <SharePartition shape={shape} pattern="halves-equal" cutStyle={cutStyle} width={140} height={100} />,
      difficulty,
      step: { kind: "number", prompt: "How many EQUAL pieces is this shape cut into?", hint: "Count the pieces, and check they're the same size.", explain: "It's cut into 2 equal pieces.", answer: 2 },
    },
  ];
};

/** Q2 — halves-equal: name the piece. */
export const halvesEqualNameQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  return [
    {
      visual: <SharePartition shape={shape} pattern="halves-equal" width={140} height={100} />,
      difficulty,
      step: choice({ prompt: "What do we call one of these 2 equal pieces?", hint: "2 equal pieces of a whole are called...", explain: "2 equal pieces are called halves." }, "A half", ["A third", "A fourth"]),
    },
  ];
};

/** Q3 — thirds-equal: count the equal pieces (new at Grade 2). */
export const thirdsEqualCountQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  const cutStyle: RectCutStyle = shape === "rectangle" ? pick(["stripesV", "stripesH"]) : "stripesV";
  return [
    {
      visual: <SharePartition shape={shape} pattern="thirds-equal" cutStyle={cutStyle} width={140} height={100} />,
      difficulty,
      step: { kind: "number", prompt: "How many EQUAL pieces is this shape cut into?", hint: "Count the pieces, and check they're the same size.", explain: "It's cut into 3 equal pieces.", answer: 3 },
    },
  ];
};

/** Q4 — thirds-equal: name the piece. */
export const thirdsEqualNameQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  return [
    {
      visual: <SharePartition shape={shape} pattern="thirds-equal" width={140} height={100} />,
      difficulty,
      step: choice({ prompt: "What do we call one of these 3 equal pieces?", hint: "3 equal pieces of a whole are called...", explain: "3 equal pieces are called thirds." }, "A third", ["A half", "A fourth"]),
    },
  ];
};

/** Q5 — fourths-equal: name the piece. */
export const fourthsEqualNameQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  return [
    {
      visual: <SharePartition shape={shape} pattern="fourths-equal" width={140} height={100} />,
      difficulty,
      step: choice({ prompt: "What do we call one of these 4 equal pieces?", hint: "4 equal pieces of a whole are called...", explain: "4 equal pieces are called fourths (or quarters)." }, "A fourth (or quarter)", ["A half", "A third"]),
    },
  ];
};

/** Q6 — generalization: 2 different-looking cuts of the same whole are BOTH equal shares. */
export const sameWholeDifferentShapeQuestion = (): TestQuestion[] => [
  {
    visual: (
      <div style={{ display: "flex", gap: 16 }}>
        <SharePartition shape="rectangle" pattern="halves-equal" cutStyle="stripesV" width={120} height={90} />
        <SharePartition shape="rectangle" pattern="halves-equal" cutStyle="diag" width={120} height={90} />
      </div>
    ),
    difficulty: "hard",
    step: choice(
      { prompt: "A rectangle cut straight down the middle (left) and the SAME-size rectangle cut diagonally (right) — are BOTH of these examples of halves?", hint: "Halves just means 2 EQUAL-amount pieces — it doesn't require one exact cutting pattern or outline shape.", explain: "True — both pictures show 2 equal-amount pieces, so both are halves, even though the pieces are shaped differently (rectangles vs. triangles)." },
      "True — both show 2 equal-amount pieces.",
      ["False — only one of these is really halves."]
    ),
  },
];

/** Q7 — unequal-trap: piece-count-vs-equal-size, with thirds. */
export const unequalTrapThirdsQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const shape = pick(SHAPES);
  return [
    {
      visual: <SharePartition shape={shape} pattern="thirds-unequal" fractions={unequalFractions(3)} width={140} height={100} />,
      difficulty,
      step: choice(
        { prompt: "This shape is cut into 3 pieces that are NOT all the same size. Can we call them thirds?", hint: "Thirds must be 3 equal-size pieces, not just any 3 pieces.", explain: "No — thirds have to be 3 pieces that are all the same size." },
        "No — thirds have to be 3 equal-size pieces.",
        ["Yes — there are 3 pieces, so they're thirds."]
      ),
    },
  ];
};

/** Q8 — unequal-trap: the count-vs-equal trap, fresh angle with fourths. */
export const countVsEqualTrapQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const shape = pick(SHAPES);
  return [
    {
      visual: <SharePartition shape={shape} pattern="fourths-unequal" fractions={unequalFractions(4)} width={140} height={100} />,
      difficulty,
      step: choice(
        { prompt: "This shape is cut into 4 pieces. Which statement is correct?", hint: "Count isn't enough — check whether the pieces are equal size too.", explain: "They are NOT fourths — the 4 pieces are clearly different sizes, and fourths must be equal." },
        "They are NOT fourths, because the pieces aren't equal size.",
        ["They ARE fourths, because there are 4 pieces.", "They are thirds."]
      ),
    },
  ];
};

/** Q9 — half-vs-third-compare: which is bigger. */
export const halfVsThirdSizeQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const shape = pick(SHAPES);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 16 }}>
          <SharePartition shape={shape} pattern="halves-equal" width={110} height={90} />
          <SharePartition shape={shape} pattern="thirds-equal" width={110} height={90} />
        </div>
      ),
      difficulty,
      step: choice({ prompt: "These are the same-size whole. Which piece is bigger — a half, or a third?", hint: "More pieces from the same-size whole means each piece is smaller.", explain: "A half is bigger than a third of the same-size whole." }, "A half", ["A third", "They're the same size"]),
    },
  ];
};

/** Q10 — half-vs-third-compare: why (the misconception-targeted reasoning question). */
export const halfVsThirdWhyQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      { prompt: "Why is a third smaller than a half, of the same-size whole?", hint: "Think about cutting the SAME whole into more pieces.", explain: "Cutting the same-size whole into more pieces makes each piece smaller, not bigger." },
      "Cutting into more pieces makes each piece smaller.",
      ["3 is a bigger number than 2, so thirds must be bigger.", "Halves and thirds are actually the same size."]
    ),
  },
];

export const equalSharesTest: Unit["test"] = {
  questions: [
    () => halvesEqualCountQuestion("easy"),
    () => halvesEqualNameQuestion("easy"),
    () => thirdsEqualCountQuestion("easy"),
    () => thirdsEqualNameQuestion("medium"),
    () => fourthsEqualNameQuestion("medium"),
    sameWholeDifferentShapeQuestion,
    () => unequalTrapThirdsQuestion("medium"),
    () => countVsEqualTrapQuestion("hard"),
    () => halfVsThirdSizeQuestion("medium"),
    () => halfVsThirdWhyQuestion("hard"),
  ],
  passScore: 9,
};
