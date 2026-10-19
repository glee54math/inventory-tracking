import { useState } from "react";
import { CoordinatePlane } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

const RANGE = 8;

/** Draws a nonzero integer in [-range, range] — keeping both coordinates off
 *  the axes means every generated point lands cleanly in one of the 4
 *  quadrants, with no "is this point ON an axis" edge case to handle. */
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

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [x, setX] = useState(3);
  const [y, setY] = useState(-4);
  const onAxis = x === 0 || y === 0;
  const quadrant = onAxis ? null : quadrantOf(x, y);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="controls">
        <Stepper label="x" value={x} min={-RANGE} max={RANGE} step={1} onChange={setX} tone="a" />
        <Stepper label="y" value={y} min={-RANGE} max={RANGE} step={1} onChange={setY} tone="b" />
      </div>
      <CoordinatePlane range={RANGE} points={[{ x, y, label: `(${x}, ${y})`, tone: "a" }]} />
      <p className="muted small">
        {onAxis
          ? `(${x}, ${y}) sits right on an axis, not inside any quadrant.`
          : `(${x}, ${y}) is in Quadrant ${quadrant}. The signs of x and y tell you which quadrant: both positive is Quadrant 1, both negative is Quadrant 3, and so on.`}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — coordinate plane
// ============================================================================

type Bucket = "identify-point" | "quadrant" | "reflection" | "distance";
const BUCKETS: Bucket[] = ["identify-point", "quadrant", "reflection", "distance"];

function coordinateProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "identify-point") {
    const x = randNonzero(RANGE);
    const y = randNonzero(RANGE);
    return {
      title: "Reading coordinates",
      bucket,
      story: "What are the coordinates of the marked point?",
      visual: () => <CoordinatePlane range={RANGE} points={[{ x, y, tone: "a" }]} />,
      steps: [
        {
          kind: "ratio",
          tones: "none",
          labels: ["x", "y"],
          frame: ["(", ",", ")"],
          prompt: "What are the coordinates of the marked point?",
          hint: "Count left/right from 0 for x, then up/down for y.",
          explain: `The point is at (${x}, ${y}).`,
          answer: [x, y],
        },
      ],
      wrapUp: `The point is at (${x}, ${y}).`,
    };
  }

  if (bucket === "quadrant") {
    const x = randNonzero(RANGE);
    const y = randNonzero(RANGE);
    const quad = quadrantOf(x, y);
    const correct = `Quadrant ${quad}`;
    return {
      title: "Quadrants",
      bucket,
      story: `Which quadrant is the point (${x}, ${y}) in?`,
      visual: () => <CoordinatePlane range={RANGE} points={[{ x, y, tone: "a" }]} />,
      steps: [
        choice(
          {
            prompt: `Which quadrant is (${x}, ${y}) in?`,
            hint: "Quadrant 1: both positive. Quadrant 2: x negative, y positive. Quadrant 3: both negative. Quadrant 4: x positive, y negative.",
            explain: `(${x}, ${y}) has x ${x > 0 ? "positive" : "negative"} and y ${y > 0 ? "positive" : "negative"}, so it's in ${correct}.`,
          },
          correct,
          ["Quadrant 1", "Quadrant 2", "Quadrant 3", "Quadrant 4"].filter((q) => q !== correct)
        ),
      ],
      wrapUp: `(${x}, ${y}) is in ${correct}.`,
    };
  }

  if (bucket === "reflection") {
    const x = randNonzero(RANGE);
    const y = randNonzero(RANGE);
    const axis: "x" | "y" = Math.random() < 0.5 ? "x" : "y";
    const rx = axis === "y" ? -x : x;
    const ry = axis === "x" ? -y : y;
    return {
      title: "Reflections across an axis",
      bucket,
      story: `Reflect the point (${x}, ${y}) across the ${axis}-axis.`,
      visual: (done: number) => (
        <CoordinatePlane
          range={RANGE}
          points={[{ x, y, label: "original", tone: "a" }, ...(done >= 1 ? [{ x: rx, y: ry, label: "reflected", tone: "c" as const }] : [])]}
        />
      ),
      steps: [
        {
          kind: "ratio",
          tones: "none",
          labels: ["x", "y"],
          frame: ["(", ",", ")"],
          prompt: `Reflecting (${x}, ${y}) across the ${axis}-axis flips the sign of one coordinate. What are the new coordinates?`,
          hint: axis === "x" ? "Reflecting across the x-axis flips the sign of y — x stays the same." : "Reflecting across the y-axis flips the sign of x — y stays the same.",
          explain: `Reflecting (${x}, ${y}) across the ${axis}-axis gives (${rx}, ${ry}).`,
          answer: [rx, ry],
        },
      ],
      wrapUp: `The reflection of (${x}, ${y}) across the ${axis}-axis is (${rx}, ${ry}).`,
    };
  }

  // distance
  const sameAxis: "x" | "y" = Math.random() < 0.5 ? "x" : "y";
  const fixed = randNonzero(RANGE);
  const a = randNonzero(RANGE);
  let b = randNonzero(RANGE);
  while (b === a) b = randNonzero(RANGE);
  const p1 = sameAxis === "x" ? { x: fixed, y: a } : { x: a, y: fixed };
  const p2 = sameAxis === "x" ? { x: fixed, y: b } : { x: b, y: fixed };
  const dist = Math.abs(a - b);
  return {
    title: "Distance on the coordinate plane",
    bucket,
    story: `Find the distance between (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y}).`,
    visual: () => (
      <CoordinatePlane range={RANGE} points={[{ ...p1, label: "A", tone: "a" }, { ...p2, label: "B", tone: "b" }]} />
    ),
    steps: [
      {
        kind: "number",
        prompt: `What is the distance between (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y})?`,
        hint: `They share the same ${sameAxis}-coordinate — count the squares between their other coordinate, or take the absolute value of the difference.`,
        explain: `|${a} − ${b}| = ${dist}.`,
        answer: dist,
      },
    ],
    wrapUp: `The distance between the two points is ${dist}.`,
  };
}

export const coordinatePlaneUnit: Unit = {
  id: "coordinatePlane",
  title: "The Coordinate Plane",
  goal: "Plot and identify points in all four quadrants of the coordinate plane, understand reflections across the axes, and find distances between points.",
  standard: "6.NS.6, 6.NS.8",
  keyIdea: (
    <>
      <p>The coordinate plane extends the number line into two directions — x (left/right) and y (up/down) — crossing at (0, 0).</p>
      <p>The signs of x and y tell you the quadrant. Flipping the sign of just one coordinate reflects a point across one axis.</p>
    </>
  ),
  Explore,
  problems: [{ label: "Coordinate Plane", make: coordinateProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
};
