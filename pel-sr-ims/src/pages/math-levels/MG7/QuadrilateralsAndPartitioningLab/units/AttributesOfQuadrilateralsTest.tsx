import { QuadCanvas, QuadTile, QUAD_NAMES, SHAPE_COLORS, SHAPE_COLOR_NAMES, type QuadKind } from "../diagrams/QuadTile";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Attributes That Define Quadrilaterals ----------
// 10 single-question generators across the 4 Practice buckets (sort,
// skewed-rhombus, rectangle-hierarchy, truefalse-pair) plus 2 extra
// generalization checks — self-contained (NOT importing from
// AttributesOfQuadrilaterals.tsx: that produced a real circular import the
// first time this app's own MG2 PlaceValueTo120Lab hit it, caught via
// ESLint/vite build; every *Test.tsx in this app keeps its own copy of
// whatever small constants it needs instead). Individual generators are
// exported so ModuleTest.tsx can draw a cumulative sample.

const QUADS: QuadKind[] = ["square", "rectangle", "rhombus", "genericQuad", "trapezoidLike"];
const NON_QUADS: QuadKind[] = ["triangle", "pentagon", "circle"];
const ROTATIONS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300, 330];

const randomColorIdx = () => randInt(0, SHAPE_COLORS.length - 1);

/** Q1 — sort: count the quadrilaterals. */
export const sortCountQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const nonQuadKind = pick(NON_QUADS);
  const oddPosition = randInt(0, 4);
  const letters = ["A", "B", "C", "D", "E"];
  const pieces = Array.from({ length: 5 }, (_, i) => ({
    kind: i === oddPosition ? nonQuadKind : pick(QUADS),
    rotation: pick(ROTATIONS),
    colorIdx: randomColorIdx(),
  }));
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {pieces.map((p, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <QuadCanvas width={75} height={75} label={`Shape ${letters[i]}: a ${QUAD_NAMES[p.kind]}`}>
                <QuadTile kind={p.kind} cx={37} cy={37} size={22} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
              </QuadCanvas>
              <b>{letters[i]}</b>
            </div>
          ))}
        </div>
      ),
      difficulty,
      step: {
        kind: "number",
        prompt: "How many of these 5 shapes are quadrilaterals?",
        hint: "Count the straight sides on each shape.",
        explain: `4 of the 5 shapes are quadrilaterals — only shape ${letters[oddPosition]} isn't.`,
        answer: 4,
      },
    },
  ];
};

/** Q2 — sort: pick the odd one out. */
export const sortOddOneOutQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const nonQuadKind = pick(NON_QUADS);
  const oddPosition = randInt(0, 4);
  const letters = ["A", "B", "C", "D", "E"];
  const pieces = Array.from({ length: 5 }, (_, i) => ({
    kind: i === oddPosition ? nonQuadKind : pick(QUADS),
    rotation: pick(ROTATIONS),
    colorIdx: randomColorIdx(),
  }));
  const quadLetters = letters.filter((_, i) => i !== oddPosition);
  const [decoy1, decoy2] = shuffle(quadLetters).slice(0, 2);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {pieces.map((p, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <QuadCanvas width={75} height={75} label={`Shape ${letters[i]}: a ${QUAD_NAMES[p.kind]}`}>
                <QuadTile kind={p.kind} cx={37} cy={37} size={22} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
              </QuadCanvas>
              <b>{letters[i]}</b>
            </div>
          ))}
        </div>
      ),
      difficulty,
      step: choice(
        {
          prompt: "Which letter is NOT a quadrilateral?",
          hint: "Some of the real quadrilaterals look very different from each other — don't be fooled by that.",
          explain: `Shape ${letters[oddPosition]} is a ${QUAD_NAMES[nonQuadKind]}, which doesn't have 4 straight sides.`,
        },
        letters[oddPosition],
        [decoy1, decoy2]
      ),
    },
  ];
};

/** Q3 — skewed rhombus: is it a quadrilateral. */
export const skewedRhombusQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const rotation = pick(ROTATIONS.filter((r) => r !== 0));
  const colorIdx = randomColorIdx();
  return [
    {
      visual: (
        <QuadCanvas width={130} height={130} label={`A slanted ${SHAPE_COLOR_NAMES[colorIdx]} rhombus`}>
          <QuadTile kind="rhombus" cx={65} cy={65} size={32} rotation={rotation} rhombusRatio={2} color={SHAPE_COLORS[colorIdx]} />
        </QuadCanvas>
      ),
      difficulty,
      step: choice(
        {
          prompt: "Is this slanted shape a quadrilateral?",
          hint: "Count its straight sides — does it matter that it's slanted?",
          explain: "Yes — it has 4 straight sides, so it's a quadrilateral, no matter how slanted it looks.",
        },
        "Yes, it's a quadrilateral.",
        ["No, it's too slanted.", "No, it doesn't look like a square."]
      ),
    },
  ];
};

/** Q4 — skewed rhombus: name the kind by its equal sides. */
export const rhombusKindQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const rotation = pick(ROTATIONS);
  const colorIdx = randomColorIdx();
  return [
    {
      visual: (
        <QuadCanvas width={130} height={130} label={`A slanted ${SHAPE_COLOR_NAMES[colorIdx]} rhombus`}>
          <QuadTile kind="rhombus" cx={65} cy={65} size={32} rotation={rotation} rhombusRatio={1.8} color={SHAPE_COLORS[colorIdx]} />
        </QuadCanvas>
      ),
      difficulty,
      step: choice(
        {
          prompt: "All 4 of this shape's sides are the same length. What kind of quadrilateral is that?",
          hint: "4 equal-length sides is the one thing that matters here — not whether the corners are square corners.",
          explain: "A rhombus has 4 equal-length sides — the corners don't have to be right angles.",
        },
        "A rhombus",
        ["A rectangle", "Not a real shape"]
      ),
    },
  ];
};

/** Q5 — non-square rectangle: still a quadrilateral. */
export const nonSquareRectangleQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const aspect = randInt(22, 35) / 10;
  const rotation = pick(ROTATIONS);
  const colorIdx = randomColorIdx();
  return [
    {
      visual: (
        <QuadCanvas width={150} height={110} label={`A long thin ${SHAPE_COLOR_NAMES[colorIdx]} rectangle`}>
          <QuadTile kind="rectangle" cx={75} cy={55} size={28} rotation={rotation} rectAspect={aspect} color={SHAPE_COLORS[colorIdx]} />
        </QuadCanvas>
      ),
      difficulty,
      step: choice(
        {
          prompt: "Is this long, thin shape a quadrilateral?",
          hint: "It doesn't have to look square-ish to be a quadrilateral.",
          explain: "Yes — 4 straight sides and 4 right angles makes it a rectangle, which is always a quadrilateral too.",
        },
        "Yes, it's a quadrilateral (and a rectangle).",
        ["No, it's too long and thin to count.", "No, only squares count as quadrilaterals."]
      ),
    },
  ];
};

/** Q6 — hierarchy: a square is always a rectangle. */
export const squareIsRectangleQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      {
        prompt: "True or False: a square is always ALSO a rectangle.",
        hint: "Check: does a square have 4 straight sides and 4 right angles, same as a rectangle needs?",
        explain: "True — a square has 4 sides and 4 right angles, which is exactly what makes something a rectangle (it just ALSO has equal sides).",
      },
      "True",
      ["False"]
    ),
  },
];

/** Q7 — the plan's required pair, part A: not every rhombus is a rectangle. */
export const rhombusIsRectangleQuestion = (difficulty: "hard"): TestQuestion[] => {
  const rotation = pick(ROTATIONS.filter((r) => r !== 0));
  const colorIdx = randomColorIdx();
  return [
    {
      visual: (
        <QuadCanvas width={120} height={120} label="A slanted rhombus">
          <QuadTile kind="rhombus" cx={60} cy={60} size={30} rotation={rotation} rhombusRatio={1.9} color={SHAPE_COLORS[colorIdx]} />
        </QuadCanvas>
      ),
      difficulty,
      step: choice(
        {
          prompt: "True or False: every rhombus (like the one shown) is a rectangle.",
          hint: "A rhombus only needs 4 equal sides. Does this one have 4 right angles too?",
          explain: "False — a rhombus just needs 4 equal sides; most rhombuses don't have right angles, so they aren't rectangles.",
        },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Q8 — the plan's required pair, part B: every square is a rhombus. */
export const squareIsRhombusQuestion = (difficulty: "hard"): TestQuestion[] => {
  const rotation = pick(ROTATIONS);
  const colorIdx = randomColorIdx();
  return [
    {
      visual: (
        <QuadCanvas width={110} height={110} label="A square">
          <QuadTile kind="square" cx={55} cy={55} size={30} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
        </QuadCanvas>
      ),
      difficulty,
      step: choice(
        {
          prompt: "True or False: every square (like the one shown) is a rhombus.",
          hint: "Does a square always have 4 equal sides?",
          explain: "True — a square always has 4 equal sides, which is exactly what makes something a rhombus.",
        },
        "True",
        ["False"]
      ),
    },
  ];
};

/** Q9 — non-exclusive membership: a square is a rectangle AND a rhombus at once. */
export const nonExclusiveQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const rotation = pick(ROTATIONS);
  const colorIdx = randomColorIdx();
  return [
    {
      visual: (
        <QuadCanvas width={110} height={110} label="A square">
          <QuadTile kind="square" cx={55} cy={55} size={30} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
        </QuadCanvas>
      ),
      difficulty,
      step: choice(
        {
          prompt: "Which statement about this square is TRUE?",
          hint: "A shape isn't locked into just one category.",
          explain: "A square is a rectangle AND a rhombus AND a quadrilateral, all at the same time — categories aren't exclusive.",
        },
        "It's a rectangle, a rhombus, and a quadrilateral, all at once.",
        ["It's only a square — it can't also be a rectangle or a rhombus.", "It's a rectangle OR a rhombus, but not both."]
      ),
    },
  ];
};

/** Q10 — generalization trap: does EVERY quadrilateral need equal sides? */
export const equalSidesTrapQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      {
        prompt: "True or False: every quadrilateral must have 4 EQUAL-length sides.",
        hint: "That's only true for rhombuses (and squares) — is it true for every 4-sided shape?",
        explain: "False — a quadrilateral only needs 4 straight sides; a rectangle, a trapezoid, or an irregular 4-sided shape don't need equal sides at all.",
      },
      "False",
      ["True"]
    ),
  },
];

export const attributesOfQuadrilateralsTest: Unit["test"] = {
  questions: [
    () => sortCountQuestion("easy"),
    () => sortOddOneOutQuestion("medium"),
    () => skewedRhombusQuestion("medium"),
    () => rhombusKindQuestion("medium"),
    () => nonSquareRectangleQuestion("easy"),
    () => squareIsRectangleQuestion("medium"),
    () => rhombusIsRectangleQuestion("hard"),
    () => squareIsRhombusQuestion("hard"),
    () => nonExclusiveQuestion("hard"),
    () => equalSidesTrapQuestion("hard"),
  ],
  passScore: 9,
};
