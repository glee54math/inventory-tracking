import { CoordinatePlane } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, coordinateStep, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: The Coordinate Plane ----------
// 10 questions from 5 generators covering reading coordinates, naming a
// quadrant, reflecting across an axis (both the specific new coordinates and
// the general sign-flip rule), and distance between two points sharing an
// axis — the same skills CoordinatePlaneUnit.tsx exercises in Practice.
// Self-contained (not imported from CoordinatePlaneUnit.tsx), same convention
// as every other *Test.tsx file in this app.
//
// Coordinate-pair answers use the "coordinate" step kind (see engine/types.ts)
// — a single free-typed "(x, y)" text field graded by the engine's own
// check(), same as every other step kind, so this question shows the same
// generic Check/Next button chrome as everything else in the test, with no
// extra widget-specific button of its own.

const RANGE = 8;

const randNonzero = (range: number): number => {
  let v: number;
  do {
    v = randInt(-range, range);
  } while (v === 0);
  return v;
};

const quadrantOf = (x: number, y: number): 1 | 2 | 3 | 4 => {
  if (x > 0 && y > 0) return 1;
  if (x < 0 && y > 0) return 2;
  if (x < 0 && y < 0) return 3;
  return 4; // x > 0, y < 0
};

// All 5 generators below are exported so NegativeNumbersLab/units/ModuleTest.tsx
// can draw a cumulative sample from this unit's own question shapes — same
// reuse pattern as MM1 Ratio Lab's ModuleTest.tsx importing individual
// generators from each of its own unit *Test.tsx files.

/** Read the coordinates of a marked point. */
export const identifyPointQuestion = (): TestQuestion[] => {
  const x = randNonzero(RANGE);
  const y = randNonzero(RANGE);
  return [
    {
      visual: <CoordinatePlane range={RANGE} points={[{ x, y, tone: "a" }]} />,
      difficulty: "easy",
      step: coordinateStep(
        {
          prompt: "What are the coordinates of the marked point? Write your answer in (x, y) form — don't forget the parentheses and comma.",
          hint: "Count left/right from 0 for x, then up/down for y. Type the whole answer, including the parentheses and comma — like (3, -5).",
          explain: `The point is at (${x}, ${y}).`,
        },
        x,
        y
      ),
    },
  ];
};

/** Which quadrant a point is in, multiple choice. */
export const quadrantQuestion = (): TestQuestion[] => {
  const x = randNonzero(RANGE);
  const y = randNonzero(RANGE);
  const correct = `Quadrant ${quadrantOf(x, y)}`;
  return [
    {
      visual: <CoordinatePlane range={RANGE} points={[{ x, y, tone: "a" }]} />,
      difficulty: "easy",
      step: choice(
        {
          prompt: `Which quadrant is (${x}, ${y}) in?`,
          hint: "Quadrant 1: both positive. Quadrant 2: x negative, y positive. Quadrant 3: both negative. Quadrant 4: x positive, y negative.",
          explain: `(${x}, ${y}) has x ${x > 0 ? "positive" : "negative"} and y ${y > 0 ? "positive" : "negative"}, so it's in ${correct}.`,
        },
        correct,
        ["Quadrant 1", "Quadrant 2", "Quadrant 3", "Quadrant 4"].filter((q) => q !== correct)
      ),
    },
  ];
};

/** Reflect a point across an axis — the specific new coordinates. */
export const reflectionCoordsQuestion = (axis: "x" | "y", difficulty: "medium" | "hard"): TestQuestion[] => {
  const x = randNonzero(RANGE);
  const y = randNonzero(RANGE);
  const rx = axis === "y" ? -x : x;
  const ry = axis === "x" ? -y : y;
  return [
    {
      visual: <CoordinatePlane range={RANGE} points={[{ x, y, label: "original", tone: "a" }]} />,
      difficulty,
      step: coordinateStep(
        {
          prompt: `Reflecting (${x}, ${y}) across the ${axis}-axis flips the sign of one coordinate. What are the new coordinates? Write your answer in (x, y) form.`,
          hint:
            (axis === "x"
              ? "Reflecting across the x-axis flips the sign of y — x stays the same."
              : "Reflecting across the y-axis flips the sign of x — y stays the same.") +
            " Type the whole answer, including the parentheses and comma — like (3, -5).",
          explain: `Reflecting (${x}, ${y}) across the ${axis}-axis gives (${rx}, ${ry}).`,
        },
        rx,
        ry
      ),
    },
  ];
};

/** The general reflection rule in words, multiple choice. */
export const reflectionGeneralizationQuestion = (axis: "x" | "y"): TestQuestion[] => {
  const flippedCoord = axis === "x" ? "y" : "x";
  const unchangedCoord = axis === "x" ? "x" : "y";
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `In general, flipping across the ${axis}-axis flips the sign of the ___.`,
          hint: "Think about which coordinate actually changes when a point is reflected across this axis.",
          explain: `Flipping across the ${axis}-axis always flips the sign of the ${flippedCoord}-coordinate — the ${unchangedCoord}-coordinate never changes.`,
        },
        `${flippedCoord}-coordinate`,
        [`${unchangedCoord}-coordinate`]
      ),
    },
  ];
};

/** Distance between two points that share one coordinate. */
export const distanceQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const sameAxis: "x" | "y" = Math.random() < 0.5 ? "x" : "y";
  const fixed = randNonzero(RANGE);
  const a = randNonzero(RANGE);
  let b = randNonzero(RANGE);
  while (b === a) b = randNonzero(RANGE);
  const p1 = sameAxis === "x" ? { x: fixed, y: a } : { x: a, y: fixed };
  const p2 = sameAxis === "x" ? { x: fixed, y: b } : { x: b, y: fixed };
  const dist = Math.abs(a - b);
  return [
    {
      visual: <CoordinatePlane range={RANGE} points={[{ ...p1, label: "A", tone: "a" }, { ...p2, label: "B", tone: "b" }]} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `What is the distance between (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y})?`,
        hint: `They share the same ${sameAxis}-coordinate — count the squares between their other coordinate, or take the absolute value of the difference.`,
        explain: `|${a} − ${b}| = ${dist}.`,
        answer: dist,
      },
    },
  ];
};

export const coordinatePlaneUnitTest: Unit["test"] = {
  questions: [
    identifyPointQuestion,
    identifyPointQuestion,
    quadrantQuestion,
    quadrantQuestion,
    () => reflectionCoordsQuestion("x", "medium"),
    () => reflectionCoordsQuestion("y", "hard"),
    () => reflectionGeneralizationQuestion("x"),
    () => reflectionGeneralizationQuestion("y"),
    () => distanceQuestion("medium"),
    () => distanceQuestion("hard"),
  ],
  passScore: 9,
};
