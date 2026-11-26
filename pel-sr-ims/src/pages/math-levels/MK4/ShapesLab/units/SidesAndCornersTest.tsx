import { ShapeGlyph, SHAPE_LABELS, shapeAttributes, type ShapeKind, type BuildableKind, type TriangleVariant } from "../diagrams/Shape2D";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { inAnyOrder } from "./labParts";

// ---------- end-of-unit test: Sides and Corners ----------
// 10 questions from 10 generators, in a new order every sitting. Self-
// contained, same convention as every other *Test.tsx in this lab. Shapes
// come turned and in different sizes (K.G.4; review C1-16). Yes/No and
// "the same" answers are drawn at random, half each (review C1-07, E1-26).
// No question prints a count the student is asked for (review C1-27).

type What = "sides" | "corners";
const turn = (kind: ShapeKind) => (kind === "circle" ? 0 : randInt(0, 11) * 30 + randInt(-10, 10));
const size = () => pick([48, 56, 64]);
const glyph = (kind: ShapeKind, variant: TriangleVariant = "plain") => <ShapeGlyph kind={kind} variant={variant} rotation={turn(kind)} size={size()} tone={pick(["a", "b", "c"] as const)} label="a shape" />;

const countQ = (kind: ShapeKind, what: What, difficulty: TestQuestion["difficulty"]): TestQuestion[] => {
  const n = shapeAttributes(kind)[what];
  return [
    {
      visual: glyph(kind),
      difficulty,
      step: { kind: "number", prompt: `How many ${what} does it have?`, hint: `Count each one once.`, explain: kind === "circle" ? `A circle has no ${what}.` : `It has ${n} ${what}.`, answer: n },
    },
  ];
};

/** Easy: sides of a square or triangle. */
export const countSidesEasyQuestion = (): TestQuestion[] => countQ(pick(["square", "triangle"] as const), "sides", "easy");
/** Medium: sides of a hexagon. */
export const countSidesHexagonQuestion = (): TestQuestion[] => countQ("hexagon", "sides", "medium");
/** Hard: a circle's sides (0). */
export const countSidesCircleQuestion = (): TestQuestion[] => countQ("circle", "sides", "hard");
/** Easy: corners of a rectangle or triangle. */
export const countCornersEasyQuestion = (): TestQuestion[] => countQ(pick(["rectangle", "triangle"] as const), "corners", "easy");
/** Hard: a circle's corners (0). */
export const countCornersCircleQuestion = (): TestQuestion[] => countQ("circle", "corners", "hard");
/** Medium: corners of a square or hexagon, asked on its own (review C1-27:
 *  it used to say "This shape has 4 sides." first). */
export const sidesCornersMatchQuestion = (): TestQuestion[] => countQ(pick(["square", "hexagon"] as const), "corners", "medium");

const sameSides = (pool: { kind: BuildableKind; variant: TriangleVariant; equal: boolean }[]): TestQuestion[] => {
  const equal = Math.random() < 0.5;
  const s = pick(pool.filter((p) => p.equal === equal));
  const label = SHAPE_LABELS[s.kind].toLowerCase();
  return [
    {
      visual: glyph(s.kind, s.variant),
      difficulty: "medium",
      step: choice(
        { prompt: "Are all the sides the same?", hint: "Look at each side.", explain: `This ${label}'s sides are ${equal ? "all the same" : "not all the same"}.` },
        equal ? "Yes" : "No",
        [equal ? "No" : "Yes"]
      ),
    },
  ];
};

/** Medium: a square (Yes) or a rectangle (No). */
export const equalSidesYesQuestion = (): TestQuestion[] =>
  sameSides([
    { kind: "square", variant: "plain", equal: true },
    { kind: "rectangle", variant: "plain", equal: false },
  ]);

/** Medium: an equal-sided triangle or a hexagon (Yes), or a long thin triangle (No). */
export const equalSidesNoQuestion = (): TestQuestion[] =>
  sameSides([
    { kind: "triangle", variant: "equal", equal: true },
    { kind: "hexagon", variant: "plain", equal: true },
    { kind: "triangle", variant: "thin", equal: false },
  ]);

const compareQ = (what: What, diffPairs: [ShapeKind, ShapeKind][]): TestQuestion[] => {
  const tie = Math.random() < 0.5;
  const [x, y] = tie ? (pick(["sr", "rs"]) === "sr" ? (["square", "rectangle"] as const) : (["rectangle", "square"] as const)) : pick(diffPairs);
  const [kindA, kindB] = Math.random() < 0.5 ? [x, y] : [y, x];
  const a = shapeAttributes(kindA)[what];
  const b = shapeAttributes(kindB)[what];
  const answer = a === b ? "The same" : a > b ? SHAPE_LABELS[kindA] : SHAPE_LABELS[kindB];
  const more = (a > b ? SHAPE_LABELS[kindA] : SHAPE_LABELS[kindB]).toLowerCase();
  return [
    {
      visual: (
        <div className="control-row">
          <div style={{ width: 150 }}>{glyph(kindA)}</div>
          <div style={{ width: 150 }}>{glyph(kindB)}</div>
        </div>
      ),
      difficulty: "hard",
      step: choice(
        { prompt: `Which has more ${what}? Or are they the same?`, hint: "Count each one.", explain: a === b ? `Both have ${a} ${what}. That is the same.` : `The ${more} has more ${what}.` },
        answer,
        [SHAPE_LABELS[kindA], SHAPE_LABELS[kindB], "The same"].filter((c) => c !== answer)
      ),
    },
  ];
};

/** Hard: which has more sides, or the same (square and rectangle tie half the time). */
export const crossShapeTieQuestion = (): TestQuestion[] =>
  compareQ("sides", [
    ["triangle", "square"],
    ["triangle", "rectangle"],
    ["circle", "triangle"],
  ]);

/** Hard: which has more corners, or the same. */
export const crossShapeDifferentQuestion = (): TestQuestion[] =>
  compareQ("corners", [
    ["hexagon", "triangle"],
    ["hexagon", "square"],
    ["circle", "square"],
  ]);

const QUESTIONS = [
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
];

export const sidesAndCornersTest: Unit["test"] = {
  questions: inAnyOrder(QUESTIONS),
  passScore: 9,
};
