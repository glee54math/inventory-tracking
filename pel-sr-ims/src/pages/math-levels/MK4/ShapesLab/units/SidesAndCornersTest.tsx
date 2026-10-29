import { ShapeGlyph, SHAPE_KINDS, SHAPE_LABELS, shapeAttributes, sidesLookEqual, BUILDABLE_KINDS, type ShapeKind } from "../diagrams/Shape2D";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Sides and Corners ----------
// 10 questions from 10 generators. Self-contained, same convention as every
// other *Test.tsx in this lab.

/** Easy: count sides of a shape with straight sides. */
export const countSidesEasyQuestion = (): TestQuestion[] => {
  const kind = pick(["square", "triangle"] as const);
  const n = shapeAttributes(kind).sides;
  return [
    {
      visual: <ShapeGlyph kind={kind} tone="a" label="a shape" />,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many sides does this shape have?", hint: "Count each straight edge one at a time.", explain: `This shape has ${n} sides.`, answer: n },
    },
  ];
};

/** Medium: count sides of a hexagon (a bigger count than Units students have practiced). */
export const countSidesHexagonQuestion = (): TestQuestion[] => {
  const n = shapeAttributes("hexagon").sides;
  return [
    {
      visual: <ShapeGlyph kind="hexagon" tone="b" label="a shape" />,
      difficulty: "medium",
      step: { kind: "number", prompt: "How many sides does this shape have?", hint: "Count each straight edge one at a time.", explain: `This shape has ${n} sides.`, answer: n },
    },
  ];
};

/** Hard: count the sides of a circle — the 0-sides edge case. */
export const countSidesCircleQuestion = (): TestQuestion[] => {
  return [
    {
      visual: <ShapeGlyph kind="circle" tone="c" label="a round shape" />,
      difficulty: "hard",
      step: { kind: "number", prompt: "How many STRAIGHT sides does this shape have?", hint: "Is the edge curved, or straight?", explain: "A circle's edge is one curved line with no straight parts, so it has 0 sides.", answer: 0 },
    },
  ];
};

/** Easy: count corners of a shape. */
export const countCornersEasyQuestion = (): TestQuestion[] => {
  const kind = pick(["rectangle", "triangle"] as const);
  const n = shapeAttributes(kind).corners;
  return [
    {
      visual: <ShapeGlyph kind={kind} tone="a" label="a shape" />,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many corners does this shape have?", hint: "Count each point where two sides meet.", explain: `This shape has ${n} corners.`, answer: n },
    },
  ];
};

/** Hard: count the corners of a circle — the 0-corners edge case. */
export const countCornersCircleQuestion = (): TestQuestion[] => {
  return [
    {
      visual: <ShapeGlyph kind="circle" tone="b" label="a round shape" />,
      difficulty: "hard",
      step: { kind: "number", prompt: "How many corners does this shape have?", hint: "A corner is a sharp point where two straight sides meet.", explain: "A circle's edge never meets itself at a sharp point, so it has 0 corners.", answer: 0 },
    },
  ];
};

/** Medium: equal-sides comparison — a shape where the answer is "Yes." */
export const equalSidesYesQuestion = (): TestQuestion[] => {
  const kind = pick(BUILDABLE_KINDS.filter((k) => sidesLookEqual(k)));
  return [
    {
      visual: <ShapeGlyph kind={kind} tone="a" label="a shape" />,
      difficulty: "medium",
      step: choice({ prompt: "Do all of its sides look the same length?", hint: "Compare each side's length to the others.", explain: "Yes — every side of this shape is the same length." }, "Yes", ["No"]),
    },
  ];
};

/** Medium: equal-sides comparison — a shape where the answer is "No." */
export const equalSidesNoQuestion = (): TestQuestion[] => {
  const kind = pick(BUILDABLE_KINDS.filter((k) => !sidesLookEqual(k)));
  return [
    {
      visual: <ShapeGlyph kind={kind} tone="c" label="a shape" />,
      difficulty: "medium",
      step: choice({ prompt: "Do all of its sides look the same length?", hint: "Compare each side's length to the others.", explain: "No — this shape's sides are not all the same length." }, "No", ["Yes"]),
    },
  ];
};

/** Hard: cross-shape comparison with a genuine tie (square vs. non-square rectangle). */
export const crossShapeTieQuestion = (): TestQuestion[] => {
  const [kindA, kindB] = pick([
    ["square", "rectangle"],
    ["rectangle", "square"],
  ] as const);
  return [
    {
      visual: (
        <div className="control-row">
          <ShapeGlyph kind={kindA} tone="a" label="shape A" />
          <ShapeGlyph kind={kindB} tone="c" label="shape B" />
        </div>
      ),
      difficulty: "hard",
      step: choice(
        { prompt: "Which shape has more sides?", hint: "Count each one separately, even if their sides are different lengths.", explain: "Both have 4 sides — that's the same number, even though they look different." },
        "They have the same number of sides",
        ["Square", "Rectangle"]
      ),
    },
  ];
};

/** Hard: cross-shape comparison with a genuine difference. */
export const crossShapeDifferentQuestion = (): TestQuestion[] => {
  let kindA: ShapeKind;
  let kindB: ShapeKind;
  do {
    kindA = pick(SHAPE_KINDS);
    kindB = pick(SHAPE_KINDS);
  } while (kindA === kindB || shapeAttributes(kindA).sides === shapeAttributes(kindB).sides);
  const a = shapeAttributes(kindA);
  const b = shapeAttributes(kindB);
  const more = a.sides > b.sides ? kindA : kindB;
  const fewer = a.sides > b.sides ? kindB : kindA;
  return [
    {
      visual: (
        <div className="control-row">
          <ShapeGlyph kind={kindA} tone="a" label="shape A" />
          <ShapeGlyph kind={kindB} tone="b" label="shape B" />
        </div>
      ),
      difficulty: "hard",
      step: choice(
        { prompt: "Which shape has more sides?", hint: "Count each shape's sides separately, then compare.", explain: `${SHAPE_LABELS[more]} has more sides than ${SHAPE_LABELS[fewer]}.` },
        SHAPE_LABELS[more],
        shuffle([SHAPE_LABELS[fewer], "They have the same number of sides"])
      ),
    },
  ];
};

/** Medium: synthesis — for these shapes, corner count always matches side count. */
export const sidesCornersMatchQuestion = (): TestQuestion[] => {
  const kind = pick(BUILDABLE_KINDS);
  const n = shapeAttributes(kind).sides;
  return [
    {
      visual: <ShapeGlyph kind={kind} tone="a" label="a shape" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `This shape has ${n} sides. How many corners does it have?`, hint: "For shapes like this, the number of corners always matches the number of sides.", explain: `It has ${n} corners too — the same as its number of sides.`, answer: n },
    },
  ];
};

export const sidesAndCornersTest: Unit["test"] = {
  questions: [
    countSidesEasyQuestion,
    countSidesHexagonQuestion,
    countSidesCircleQuestion,
    countCornersEasyQuestion,
    countCornersCircleQuestion,
    equalSidesYesQuestion,
    equalSidesNoQuestion,
    crossShapeTieQuestion,
    crossShapeDifferentQuestion,
    sidesCornersMatchQuestion,
  ],
  passScore: 9,
};
