import { useEffect, useState, type CSSProperties } from "react";
import { CoordinatePlane, QUADRANT_HIGHLIGHT } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, coordinateStep, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { coordinatePlaneUnitTest } from "./CoordinatePlaneUnitTest";

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
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

// Question 1: a point sits ON an axis (x = 0), so it belongs to NO quadrant —
// easy to skip past since every other example in this unit lands cleanly
// inside one of the 4. Fixed example (not randomized), same convention as
// every other Check for Understanding / Quick Check in this lab.
function AxisPointQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "None of these — it's on an axis";
  const OPTIONS = ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV", CORRECT];
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> A point is at (0, 7). Which quadrant is it in?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — (0, 7) sits on the y-axis (x = 0), so it isn't inside any quadrant. Quadrants only contain points where neither coordinate is 0."
            : "Not quite — look at the x-coordinate. A point only belongs to a quadrant when both coordinates are nonzero."}
        </p>
      )}
    </div>
  );
}

interface ReflectionFormula {
  axisLabel: "x-axis" | "y-axis";
  correctFirst: "x" | "−x";
  correctSecond: "y" | "−y";
  explainCorrect: string;
  explainWrong: string;
}

const REFLECTION_FORMULAS: Record<"x" | "y", ReflectionFormula> = {
  x: {
    axisLabel: "x-axis",
    correctFirst: "x",
    correctSecond: "−y",
    explainCorrect: "Correct — reflecting across the x-axis keeps x the same and flips the sign of y: (x, y) → (x, −y).",
    explainWrong: "Not quite — reflecting across the x-axis keeps x the same, but flips the sign of y.",
  },
  y: {
    axisLabel: "y-axis",
    correctFirst: "−x",
    correctSecond: "y",
    explainCorrect: "Correct — reflecting across the y-axis flips the sign of x and keeps y the same: (x, y) → (−x, y).",
    explainWrong: "Not quite — reflecting across the y-axis flips the sign of x, but keeps y the same.",
  },
};

// Questions 2 and 3: the general reflection RULE in symbols, (x, y) -> (x,
// -y) across the x-axis and (x, y) -> (-x, y) across the y-axis — not one
// numeric example, so getting it right means knowing the rule itself, not
// just subtracting correctly once.
function ReflectionFormulaQuestion({ number, axis, onComplete }: { number: string; axis: "x" | "y"; onComplete?: () => void }) {
  const config = REFLECTION_FORMULAS[axis];
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [checked, setChecked] = useState(false);
  const okFirst = first === config.correctFirst;
  const okSecond = second === config.correctSecond;
  const ok = okFirst && okSecond;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>{number}.</b> Reflecting the point (x, y) across the {config.axisLabel} gives the point (
        <select className="answer" style={{ width: 70, ...fieldStyle(okFirst, checked) }} value={first} onChange={(e) => setFirst(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="x">x</option>
          <option value="−x">−x</option>
        </select>
        ,{" "}
        <select className="answer" style={{ width: 70, ...fieldStyle(okSecond, checked) }} value={second} onChange={(e) => setSecond(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="y">y</option>
          <option value="−y">−y</option>
        </select>
        ).
      </p>
      <div className="control-row">
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? config.explainCorrect : config.explainWrong}
        </p>
      )}
    </div>
  );
}

// Question 4: distance to EACH axis (not to the origin — that needs the
// Pythagorean theorem, out of scope here). Fixed example, same convention as
// every other question above.
function AxisDistanceQuestion({ onComplete }: { onComplete?: () => void }) {
  const px = 5;
  const py = -3;
  const [distY, setDistY] = useState("");
  const [distX, setDistX] = useState("");
  const [checked, setChecked] = useState(false);
  const okY = Number(distY) === Math.abs(px);
  const okX = Number(distX) === Math.abs(py);
  const ok = okY && okX;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Point P is at ({px}, {py}). What is its distance from the y-axis? What is its distance from the x-axis?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Distance from the y-axis:{" "}
          <input
            className="answer"
            style={{ width: 55, ...fieldStyle(okY, checked) }}
            inputMode="numeric"
            autoComplete="off"
            value={distY}
            onChange={(e) => setDistY(e.target.value)}
          />
        </label>
        <label>
          Distance from the x-axis:{" "}
          <input
            className="answer"
            style={{ width: 55, ...fieldStyle(okX, checked) }}
            inputMode="numeric"
            autoComplete="off"
            value={distX}
            onChange={(e) => setDistX(e.target.value)}
          />
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? `Correct — distance from the y-axis is |x| = ${Math.abs(px)}, and distance from the x-axis is |y| = ${Math.abs(py)}.`
            : "Not quite — distance from the y-axis only depends on the x-coordinate, and distance from the x-axis only depends on the y-coordinate. Distance is never negative, so use absolute value."}
        </p>
      )}
    </div>
  );
}

/** All 4 Check for Understanding questions — fires onComplete only once
 *  every one has been answered correctly. */
function CoordinateCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ axisPoint: false, reflectX: false, reflectY: false, axisDistance: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill" style={{ flex: "1 1 280px", minWidth: 260 }}>
      <p className="intro-gate-title">Check for understanding: let's connect a few ideas before you try practice problems.</p>
      <AxisPointQuestion onComplete={mark("axisPoint")} />
      <ReflectionFormulaQuestion number="2" axis="x" onComplete={mark("reflectX")} />
      <ReflectionFormulaQuestion number="3" axis="y" onComplete={mark("reflectY")} />
      <AxisDistanceQuestion onComplete={mark("axisDistance")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

const QUADRANT_LABELS: Record<1 | 2 | 3 | 4, string> = { 1: "Quadrant I", 2: "Quadrant II", 3: "Quadrant III", 4: "Quadrant IV" };

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  // Once the gate is already satisfied, the check is optional — hidden by
  // default so a returning student isn't forced through it again, but still
  // reachable with one click for review (same convention as the Negative
  // Numbers Lab's Quick Check toggle).
  const [showCheck, setShowCheck] = useState(false);
  const [x, setX] = useState(3);
  const [y, setY] = useState(-4);
  const [hoverQuadrant, setHoverQuadrant] = useState<1 | 2 | 3 | 4 | null>(null);
  const onAxis = x === 0 || y === 0;
  const quadrant = onAxis ? null : quadrantOf(x, y);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="x" value={x} min={-RANGE} max={RANGE} step={1} onChange={setX} tone="a" />
        <Stepper label="y" value={y} min={-RANGE} max={RANGE} step={1} onChange={setY} tone="b" />
      </div>
      <div className="control-row">
        {([1, 2, 3, 4] as const).map((q) => (
          <button
            key={q}
            type="button"
            className="btn ghost"
            style={{ background: hoverQuadrant === q ? QUADRANT_HIGHLIGHT : undefined }}
            onMouseEnter={() => setHoverQuadrant(q)}
            onMouseLeave={() => setHoverQuadrant((cur) => (cur === q ? null : cur))}
          >
            {QUADRANT_LABELS[q]}
          </button>
        ))}
        {!introActive && (
          <button
            type="button"
            className="btn ghost"
            style={{ ...(showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
            onClick={() => setShowCheck((v) => !v)}
          >
            Check for Understanding
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        <CoordinatePlane
          range={RANGE}
          points={[{ x, y, label: `(${x}, ${y})`, tone: "a" }]}
          onPointClick={(nx, ny) => {
            setX(nx);
            setY(ny);
          }}
          highlightQuadrant={hoverQuadrant}
        />
        {(introActive || showCheck) && <CoordinateCheckForUnderstanding onComplete={onIntroDone} />}
      </div>
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

type Bucket = "identify-point" | "reflection" | "distance";
const BUCKETS: Bucket[] = ["identify-point", "reflection", "distance"];

function coordinateProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "identify-point") {
    const x = randNonzero(RANGE);
    const y = randNonzero(RANGE);
    const quad = quadrantOf(x, y);
    const quadCorrect = `Quadrant ${quad}`;
    return {
      title: "Reading coordinates",
      bucket,
      story: "What are the coordinates of the marked point?",
      visual: () => <CoordinatePlane range={RANGE} points={[{ x, y, tone: "a" }]} />,
      steps: [
        coordinateStep(
          {
            prompt: "What are the coordinates of the marked point? Write your answer in (x, y) form — don't forget the parentheses and comma.",
            hint: "Count left/right from 0 for x, then up/down for y. Type the whole answer, including the parentheses and comma — like (3, -5).",
            explain: `The point is at (${x}, ${y}).`,
          },
          x,
          y
        ),
        choice(
          {
            prompt: "What quadrant is this point in?",
            hint: "Quadrant 1: both positive. Quadrant 2: x negative, y positive. Quadrant 3: both negative. Quadrant 4: x positive, y negative.",
            explain: `(${x}, ${y}) has x ${x > 0 ? "positive" : "negative"} and y ${y > 0 ? "positive" : "negative"}, so it's in ${quadCorrect}.`,
          },
          quadCorrect,
          ["Quadrant 1", "Quadrant 2", "Quadrant 3", "Quadrant 4"].filter((q) => q !== quadCorrect)
        ),
      ],
      wrapUp: `The point is at (${x}, ${y}), in ${quadCorrect}.`,
    };
  }

  if (bucket === "reflection") {
    const x = randNonzero(RANGE);
    const y = randNonzero(RANGE);
    const axis: "x" | "y" = Math.random() < 0.5 ? "x" : "y";
    const rx = axis === "y" ? -x : x;
    const ry = axis === "x" ? -y : y;
    // Reflecting across the x-axis flips y's sign (x stays put), and vice
    // versa — the opposite of what a student might guess from the axis name.
    const flippedCoord = axis === "x" ? "y" : "x";
    const unchangedCoord = axis === "x" ? "x" : "y";
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
        coordinateStep(
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
        choice(
          {
            prompt: `In general, flipping across the ${axis}-axis flips the sign of the ___.`,
            hint: "Think about which coordinate actually changed when you reflected the point above.",
            explain: `Flipping across the ${axis}-axis always flips the sign of the ${flippedCoord}-coordinate — the ${unchangedCoord}-coordinate never changes.`,
          },
          `${flippedCoord}-coordinate`,
          [`${unchangedCoord}-coordinate`]
        ),
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
  requiresIntro: true,
  problems: [{ label: "Coordinate Plane", make: coordinateProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: coordinatePlaneUnitTest,
};
