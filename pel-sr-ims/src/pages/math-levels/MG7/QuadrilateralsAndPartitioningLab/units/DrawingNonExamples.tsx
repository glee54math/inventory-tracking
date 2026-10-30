import { useEffect, useState } from "react";
import { QuadCanvas, QuadTile, QUAD_NAMES, SHAPE_COLORS, type QuadKind } from "../diagrams/QuadTile";
import { QuadBuilder, type QuadRequirement } from "../diagrams/QuadBuilder";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { palette } from "../../../shared/lib/palette";
import { choice, customStep, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { drawingNonExamplesTest } from "./DrawingNonExamplesTest";

const NAMED: QuadKind[] = ["square", "rectangle", "rhombus"];
const OUTSIDE: QuadKind[] = ["genericQuad", "trapezoidLike"];
const ROTATIONS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300, 330];

const randomColorIdx = () => randInt(0, SHAPE_COLORS.length - 1);

function fieldStyle(ok: boolean, checked: boolean) {
  if (!checked) return {};
  return ok ? { borderColor: "var(--good)", background: "var(--good-soft)" } : { borderColor: "var(--bad)", background: "var(--bad-soft)" };
}

/** A 4-segment path with a visible gap — the "forgot to close it" mistake.
 *  QuadTile only draws closed polygons, so this one picture lives here. */
function OpenFigure({ color }: { color: string }) {
  return (
    <QuadCanvas width={120} height={120} label="A 4-segment shape with a gap — it isn't closed">
      <polyline points="30,30 95,38 88,92 28,85 28,48" style={{ fill: "none", stroke: color, strokeWidth: 4, strokeLinecap: "round" }} />
      <circle cx={30} cy={30} r={3.5} style={{ fill: palette.ink }} />
      <circle cx={28} cy={48} r={3.5} style={{ fill: palette.ink }} />
    </QuadCanvas>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1 — vocabulary / the baseline requirement. */
function BaselineQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["4 straight sides, and be closed (no gaps)", "Any number of sides, as long as it isn't a square", "3 sides, so it's definitely not a rectangle"];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> You're asked to draw a quadrilateral that is NOT a rhombus, rectangle, or square. Your shape must still have:
      </p>
      <div className="choices" role="group">
        {options.map((o, i) => (
          <button key={i} className="choice" onClick={() => setPicked(i)} disabled={ok} style={fieldStyle(i === 0, picked === i)}>
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Right — it still has to BE a quadrilateral: 4 straight sides, closed. You're only avoiding the three special kinds."
            : "Not quite — avoiding the special kinds doesn't let you skip the basic rule. What does every quadrilateral need?"}
        </p>
      )}
    </div>
  );
}

/** Q2 — the plan's required WORKED NON-EXAMPLE: a pentagon drawn while
 *  "avoiding" the named kinds, with a two-blank sentence explaining why it
 *  doesn't count. */
function WorkedNonExampleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [sides, setSides] = useState("");
  const [verdict, setVerdict] = useState("");
  const [checked, setChecked] = useState(false);
  const okSides = sides === "5";
  const okVerdict = verdict === "not-quad";
  const ok = okSides && okVerdict;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Maya was asked to draw a quadrilateral that isn't a rhombus, rectangle, or square. She was so busy avoiding those that she drew this:
      </p>
      <QuadCanvas width={110} height={110} label="Maya's shape: a pentagon">
        <QuadTile kind="pentagon" cx={55} cy={58} size={40} rotation={8} color={SHAPE_COLORS[4]} />
      </QuadCanvas>
      <p>
        Maya's shape has{" "}
        <select className="answer" style={{ width: 70, ...fieldStyle(okSides, checked) }} value={sides} onChange={(e) => setSides(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>{" "}
        sides, so it{" "}
        <select className="answer" style={{ width: 300, ...fieldStyle(okVerdict, checked) }} value={verdict} onChange={(e) => setVerdict(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="not-quad">does NOT count — it isn't a quadrilateral at all</option>
          <option value="counts">counts — it isn't a rhombus, rectangle, or square</option>
        </select>
        .
      </p>
      <button className="btn primary" type="button" onClick={() => setChecked(true)}>
        Check Answer
      </button>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Right — it avoids the three special kinds, but with 5 sides it isn't a quadrilateral, so it doesn't answer the question."
            : "Count Maya's sides again. Avoiding the special kinds only counts if the shape is still a quadrilateral."}
        </p>
      )}
    </div>
  );
}

/** Q3 — rotated-rectangle trap: it still has 4 right angles. */
function RotatedRectangleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["No — it still has 4 square corners, so it's still a rectangle.", "Yes — tilted like that, it isn't a rectangle anymore."];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Leo drew this tilted shape and says: "It doesn't look like a rectangle, so it's outside the named kinds." Is he right?
      </p>
      <QuadCanvas width={130} height={120} label="A rectangle tilted at an angle">
        <QuadTile kind="rectangle" cx={65} cy={60} size={28} rotation={32} rectAspect={2} color={SHAPE_COLORS[2]} />
      </QuadCanvas>
      <div className="choices" role="group">
        {options.map((o, i) => (
          <button key={i} className="choice" onClick={() => setPicked(i)} disabled={ok} style={fieldStyle(i === 0, picked === i)}>
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Right — tilting a shape never changes its corners. 4 right angles means it's still a rectangle." : "Check its corners, not its tilt. Are all 4 still square corners?"}
        </p>
      )}
    </div>
  );
}

/** Q4 — generalization / true-false trap. */
function NotSquareTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"true" | "false" | null>(null);
  const ok = picked === "false";
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or False: any 4-sided shape that isn't a square automatically avoids all three named kinds (rhombus, rectangle, square).
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        {(["true", "false"] as const).map((v) => (
          <button key={v} type="button" className="choice" disabled={ok} onClick={() => setPicked(v)} style={fieldStyle(v === "false", picked === v)}>
            {v === "true" ? "True" : "False"}
          </button>
        ))}
      </div>
      {picked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "False — a long rectangle or a slanted rhombus isn't a square, but it's still one of the named kinds."
            : "Think of a long, thin rectangle. It isn't a square — but is it outside all three named kinds?"}
        </p>
      )}
    </div>
  );
}

function DrawingCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ q1: false, q2: false, q3: false, q4: false });
  const allDone = done.q1 && done.q2 && done.q3 && done.q4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure you know what DOES and DOESN'T count before you start building shapes.</p>
      <BaselineQuestion onComplete={() => setDone((d) => ({ ...d, q1: true }))} />
      <WorkedNonExampleQuestion onComplete={() => setDone((d) => ({ ...d, q2: true }))} />
      <RotatedRectangleQuestion onComplete={() => setDone((d) => ({ ...d, q3: true }))} />
      <NotSquareTrapQuestion onComplete={() => setDone((d) => ({ ...d, q4: true }))} />
    </div>
  );
}

// ============================================================================
// EXPLORE — drag the 4 corners of a quadrilateral (construct, not just sort)
// ============================================================================

const EXPLORE_REQ: QuadRequirement = { mustAvoidRectangle: true, mustAvoidRhombus: true };

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button
          type="button"
          className="btn ghost"
          style={{ width: "fit-content", ...(showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
          onClick={() => setShowCheck((v) => !v)}
        >
          Quick Check
        </button>
      )}
      {(introActive || showCheck) && <DrawingCheck onComplete={onIntroDone} />}
      <p className="muted small">
        This shape starts as a square, which is a rectangle AND a rhombus. Drag its corners and watch the checklist change. Can you make a quadrilateral that's
        none of the three named kinds? What about one with a pair of parallel sides that still isn't a rectangle?
      </p>
      <QuadBuilder requirement={EXPLORE_REQ} />
    </div>
  );
}

// ============================================================================
// PRACTICE — one ProblemType per bucket
// ============================================================================

const IRREGULAR_REQ: QuadRequirement = { mustAvoidRectangle: true, mustAvoidRhombus: true, mustHaveNoRightAngles: true, mustHaveNoEqualSides: true };
const TRAPEZOID_REQ: QuadRequirement = { mustAvoidRectangle: true, mustAvoidRhombus: true, mustHaveParallelPair: true };

function irregularProblem(): Problem {
  return {
    title: "Build an irregular quadrilateral",
    bucket: "irregular",
    story: "Start from the square below. Drag its corners to make a quadrilateral with NO square corners and NO two sides the same length.",
    visual: () => (
      <QuadCanvas width={110} height={110} label="The starting square">
        <QuadTile kind="square" cx={55} cy={55} size={34} color={palette.aSoft} />
      </QuadCanvas>
    ),
    steps: [
      choice(
        {
          prompt: "Right now the shape is a square. Which named kinds is a square?",
          hint: "A square has 4 equal sides AND 4 right angles.",
          explain: "A square is a rectangle AND a rhombus, so you'll need to change both its corners and its side lengths.",
        },
        "Both a rectangle and a rhombus",
        ["Only a square — not a rectangle or a rhombus", "Neither one"]
      ),
      customStep(
        {
          prompt: "Drag the corners until every item on the checklist is green.",
          hint: "Move one corner diagonally so no corner stays square, then nudge another so all four sides are different lengths.",
          explain: "Your shape is still a closed 4-sided shape, but it's not a rectangle, rhombus, or square — a general quadrilateral.",
        },
        (onDone) => <QuadBuilder requirement={IRREGULAR_REQ} onValidChange={(ok) => ok && onDone()} />,
        "Built a quadrilateral with no right angles and no equal sides."
      ),
    ],
    wrapUp: "A quadrilateral doesn't need any equal sides or square corners. It just needs 4 straight sides and to be closed.",
  };
}

function trapezoidProblem(): Problem {
  return {
    title: "Parallel sides, but not a rectangle",
    bucket: "trapezoid-like",
    story: "Build a quadrilateral with at least one pair of sides running the same direction (parallel), but that is NOT a rectangle, rhombus, or square.",
    visual: () => (
      <QuadCanvas width={130} height={100} label="An example of a quadrilateral with one pair of parallel sides">
        <QuadTile kind="trapezoidLike" cx={65} cy={50} size={40} color={palette.bSoft} />
      </QuadCanvas>
    ),
    steps: [
      choice(
        {
          prompt: "The example shape has its top and bottom sides running the same direction. Is it a rectangle?",
          hint: "A rectangle needs 4 square corners, not just parallel sides.",
          explain: "No — having parallel sides isn't enough. Its slanted sides make corners that aren't square, so it isn't a rectangle.",
        },
        "No — its corners aren't all square corners.",
        ["Yes — it has parallel sides, so it's a rectangle.", "Yes — every 4-sided shape is a rectangle."]
      ),
      customStep(
        {
          prompt: "Now build your own: drag the corners until every item on the checklist is green.",
          hint: "Keep the top and bottom corners on their own horizontal grid lines, then slide one top corner sideways so the corners stop being square.",
          explain: "One pair of parallel sides, without 4 square corners or 4 equal sides, is a quadrilateral outside all three named kinds.",
        },
        (onDone) => <QuadBuilder requirement={TRAPEZOID_REQ} onValidChange={(ok) => ok && onDone()} />,
        "Built a quadrilateral with parallel sides that isn't a rectangle, rhombus, or square."
      ),
    ],
    wrapUp: "Parallel sides don't make a rectangle. A rectangle needs all 4 corners to be square corners.",
  };
}

function identifyProblem(): Problem {
  const outsideCount = randInt(1, 3);
  const letters = ["A", "B", "C", "D", "E"];
  const kinds = shuffle([...Array.from({ length: outsideCount }, () => pick(OUTSIDE)), ...Array.from({ length: 5 - outsideCount }, () => pick(NAMED))]);
  const pieces = kinds.map((kind) => ({ kind, rotation: pick(ROTATIONS), colorIdx: randomColorIdx() }));
  const outsideLetters = letters.filter((_, i) => OUTSIDE.includes(kinds[i]));
  const namedLetters = letters.filter((_, i) => NAMED.includes(kinds[i]));
  const correct = pick(outsideLetters);
  const decoys = shuffle(namedLetters).slice(0, 2);

  return {
    title: "Find the shapes outside the named kinds",
    bucket: "identify-non-example",
    story: "Some of these quadrilaterals are rhombuses, rectangles, or squares. Some are none of those.",
    visual: () => (
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {pieces.map((p, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <QuadCanvas width={80} height={80} label={`Shape ${letters[i]}: a ${QUAD_NAMES[p.kind]}`}>
              <QuadTile kind={p.kind} cx={40} cy={40} size={24} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
            </QuadCanvas>
            <b>{letters[i]}</b>
          </div>
        ))}
      </div>
    ),
    steps: [
      {
        kind: "number",
        prompt: "How many of these 5 shapes are NOT a rhombus, rectangle, or square?",
        hint: "For each one, check: 4 equal sides? 4 square corners? If neither, it's outside the named kinds.",
        explain: `${outsideCount} of them: shape${outsideLetters.length > 1 ? "s" : ""} ${outsideLetters.join(", ")}. The rest are rhombuses, rectangles, or squares, even the tilted ones.`,
        answer: outsideCount,
      },
      choice(
        {
          prompt: "Which of these letters is a quadrilateral outside all three named kinds?",
          hint: "A tilted square or slanted rhombus is still a named kind. Look for unequal sides AND corners that aren't square.",
          explain: `Shape ${correct} has neither 4 equal sides nor 4 square corners.`,
        },
        correct,
        decoys
      ),
    ],
    wrapUp: "To be outside the named kinds, a quadrilateral needs to miss BOTH tests: not all sides equal, and not all corners square.",
  };
}

type Attempt = "triangle" | "pentagon" | "open" | "rotatedRectangle" | "valid";
const ATTEMPTS: Attempt[] = ["triangle", "pentagon", "open", "rotatedRectangle", "valid"];

const STEP1_CORRECT: Record<Attempt, string> = {
  triangle: "No — it only has 3 sides.",
  pentagon: "No — it has 5 sides.",
  open: "No — it has a gap, so it isn't closed.",
  rotatedRectangle: "Yes — it's closed with 4 straight sides.",
  valid: "Yes — it's closed with 4 straight sides.",
};
const STEP2_CORRECT: Record<Attempt, string> = {
  triangle: "No — it isn't even a quadrilateral.",
  pentagon: "No — it isn't even a quadrilateral.",
  open: "No — it isn't even a quadrilateral.",
  rotatedRectangle: "No — it's still a rectangle (4 square corners).",
  valid: "Yes — it's a quadrilateral outside all three named kinds.",
};
const STEP2_OPTIONS = ["Yes — it's a quadrilateral outside all three named kinds.", "No — it isn't even a quadrilateral.", "No — it's still a rectangle (4 square corners)."];

function attemptVisual(attempt: Attempt, colorIdx: number, rotation: number) {
  const color = SHAPE_COLORS[colorIdx];
  if (attempt === "open") return <OpenFigure color={color} />;
  const kind: QuadKind = attempt === "triangle" ? "triangle" : attempt === "pentagon" ? "pentagon" : attempt === "rotatedRectangle" ? "rectangle" : "genericQuad";
  return (
    <QuadCanvas width={120} height={120} label="A student's attempt">
      <QuadTile kind={kind} cx={60} cy={60} size={36} rotation={attempt === "rotatedRectangle" ? rotation : 0} rectAspect={1.8} color={color} />
    </QuadCanvas>
  );
}

function selfCheckProblem(): Problem {
  const attempt = pick(ATTEMPTS);
  const colorIdx = randomColorIdx();
  const rotation = pick([20, 30, 35, 55, 120, 150]);
  const step1Options = ["Yes — it's closed with 4 straight sides.", "No — it only has 3 sides.", "No — it has 5 sides.", "No — it has a gap, so it isn't closed."];

  return {
    title: "Check a classmate's shape",
    bucket: "self-check",
    story: "A classmate was asked to draw a quadrilateral that isn't a rhombus, rectangle, or square. Here's what they drew.",
    visual: () => attemptVisual(attempt, colorIdx, rotation),
    steps: [
      choice(
        {
          prompt: "First, the basic rule: is it a closed shape with exactly 4 straight sides?",
          hint: "Count the sides, then check for any gap where the outline doesn't meet up.",
          explain: STEP1_CORRECT[attempt],
        },
        STEP1_CORRECT[attempt],
        step1Options
      ),
      choice(
        {
          prompt: "So does their drawing answer the question?",
          hint: "It has to pass the basic rule AND not be a rhombus, rectangle, or square.",
          explain:
            attempt === "rotatedRectangle"
              ? "It's tilted, but its 4 corners are still square corners, so it's still a rectangle."
              : attempt === "valid"
                ? "It's a closed 4-sided shape with no equal sides and no square corners."
                : "While avoiding the named kinds, they lost the basic rule. A shape that isn't a quadrilateral can't answer the question.",
        },
        STEP2_CORRECT[attempt],
        STEP2_OPTIONS
      ),
    ],
    wrapUp: "Always check two things: is it a closed 4-sided shape, and is it free of the three named kinds?",
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <QuadCanvas width={90} height={90} label="An irregular quadrilateral">
        <QuadTile kind="genericQuad" cx={45} cy={45} size={34} color={SHAPE_COLORS[4]} />
      </QuadCanvas>
      <QuadCanvas width={100} height={90} label="A quadrilateral with one pair of parallel sides">
        <QuadTile kind="trapezoidLike" cx={50} cy={45} size={38} color={SHAPE_COLORS[5]} />
      </QuadCanvas>
    </div>
  );
}

export const drawingNonExamples: Unit = {
  id: "drawingNonExamples",
  title: "Drawing Quadrilaterals Outside the Named Kinds",
  goal: "Build a four-sided shape that is a quadrilateral but is NOT a rhombus, rectangle, or square.",
  standard: "3.G.1",
  keyIdea: (
    <>
      <p>Lots of quadrilaterals aren't rhombuses, rectangles, or squares. They just need 4 straight sides and to be closed.</p>
      <p>To stay outside the named kinds, make sure the sides AREN'T all equal (no rhombus) and the corners AREN'T all square corners (no rectangle). And don't lose the basic rule: still exactly 4 sides, no gaps.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "Build an irregular one", make: irregularProblem, buckets: ["irregular"] },
    { label: "Parallel, not a rectangle", make: trapezoidProblem, buckets: ["trapezoid-like"] },
    { label: "Find the non-examples", make: identifyProblem, buckets: ["identify-non-example"] },
    { label: "Check the drawing", make: selfCheckProblem, buckets: ["self-check"] },
  ],
  requiredBuckets: ["irregular", "trapezoid-like", "identify-non-example", "self-check"],
  test: drawingNonExamplesTest,
};
