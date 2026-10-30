import { useEffect, useState } from "react";
import { ShapePartition, PARTITION_META, type PartitionShape, type SharePattern, type SquareCutStyle } from "../diagrams/ShapePartition";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { partitioningShapesTest } from "./PartitioningShapesTest";

const SHAPES: PartitionShape[] = ["circle", "square"];

function fieldStyle(ok: boolean, checked: boolean) {
  if (!checked) return {};
  return ok ? { borderColor: "var(--good)", background: "var(--good-soft)" } : { borderColor: "var(--bad)", background: "var(--bad-soft)" };
}

/** A clearly-unequal split fraction for the first piece (or first row/col of
 *  a square plus-cut) — kept away from 0.5 by a wide enough margin that the
 *  size difference always reads as obvious, not a close call. */
function skewFraction(): number {
  return randInt(12, 32) / 100;
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["A half", "A fourth", "A whole"];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> This circle is cut into 2 EQUAL pieces. What do we call each piece?
      </p>
      <ShapePartition shape="circle" pattern="halves-equal" width={110} height={110} />
      <div className="choices" role="group">
        {options.map((o, i) => (
          <button key={i} className="choice" onClick={() => setPicked(i)} disabled={ok} style={fieldStyle(i === 0, picked === i)}>
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Right — 2 equal pieces of a whole are called halves." : "Not quite — how many equal pieces does 'half' always mean?"}
        </p>
      )}
    </div>
  );
}

/** Q2 — the plan's explicit required non-example: piece count and equal-size
 *  in the SAME question, so it can't be answered by counting pieces alone. */
function UnequalNonExampleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [countVal, setCountVal] = useState("");
  const [sizeVal, setSizeVal] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [countVal, sizeVal].every((v) => String(v).trim() !== "");
  const okCount = countVal === "2";
  const okSize = sizeVal === "not-halves";
  const ok = okCount && okSize;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Look at this circle:
      </p>
      <ShapePartition shape="circle" pattern="halves-unequal" unequalFractions={[0.22, 0.78]} width={110} height={110} />
      <p>
        This circle has{" "}
        <select className="answer" style={{ width: 70, ...fieldStyle(okCount, checked) }} value={countVal} onChange={(e) => setCountVal(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="2">2</option>
          <option value="4">4</option>
        </select>{" "}
        pieces, and they are{" "}
        <select className="answer" style={{ width: 260, ...fieldStyle(okSize, checked) }} value={sizeVal} onChange={(e) => setSizeVal(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="not-halves">different sizes — so they are NOT halves</option>
          <option value="halves">the same size — so they ARE halves</option>
        </select>
        .
      </p>
      <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
        Check Answer
      </button>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Right — having 2 pieces isn't enough to call them halves. The 2 pieces also have to be the same size."
            : "Not quite — look carefully: are the 2 pieces really the same size?"}
        </p>
      )}
    </div>
  );
}

/** Q3 — required direct halves-vs-fourths size comparison. */
function CompareSizeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["A half slice", "A fourth slice", "They're the same size"];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> A pizza is cut into halves. The exact same-size pizza is cut into fourths. Which slice is bigger?
      </p>
      <div className="control-row" style={{ gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <ShapePartition shape="circle" pattern="halves-equal" width={110} height={110} />
          <p className="muted small">Cut into halves</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <ShapePartition shape="circle" pattern="fourths-equal" width={110} height={110} />
          <p className="muted small">Cut into fourths</p>
        </div>
      </div>
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
            ? "Right — cutting the SAME-size pizza into more pieces makes each piece smaller, so a half slice is bigger than a fourth slice."
            : "Not quite — both pizzas are the same size. Which one got cut into more pieces?"}
        </p>
      )}
    </div>
  );
}

/** Q4 — generalization / true-false trap: more pieces, bigger pieces? */
function MorePiecesTrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"true" | "false" | null>(null);
  const ok = picked === "false";
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or False: since 4 is a bigger number than 2, cutting a shape into fourths makes BIGGER pieces than cutting it into halves.
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
            ? "False — the opposite is true! Cutting the same-size shape into MORE pieces (4 instead of 2) makes each piece SMALLER."
            : "Not quite — think about a pizza: does cutting it into more slices make each slice bigger or smaller?"}
        </p>
      )}
    </div>
  );
}

function PartitioningCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ q1: false, q2: false, q3: false, q4: false });
  const allDone = done.q1 && done.q2 && done.q3 && done.q4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure "halves" and "fourths" make sense before you try practice problems.</p>
      <VocabQuestion onComplete={() => setDone((d) => ({ ...d, q1: true }))} />
      <UnequalNonExampleQuestion onComplete={() => setDone((d) => ({ ...d, q2: true }))} />
      <CompareSizeQuestion onComplete={() => setDone((d) => ({ ...d, q3: true }))} />
      <MorePiecesTrueFalseQuestion onComplete={() => setDone((d) => ({ ...d, q4: true }))} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [shape, setShape] = useState<PartitionShape>("circle");
  const [pieceCount, setPieceCount] = useState<"2" | "4">("2");
  const [equal, setEqual] = useState<"equal" | "unequal">("equal");
  const [cutStyle, setCutStyle] = useState<SquareCutStyle>("plus");
  const [orientation, setOrientation] = useState<"v" | "h" | "diag">("v");
  const [skew, setSkew] = useState(0.3);

  const pattern: SharePattern = pieceCount === "2" ? (equal === "equal" ? "halves-equal" : "halves-unequal") : equal === "equal" ? "fourths-equal" : "fourths-unequal";
  const meta = PARTITION_META[pattern];
  const unequalFractions =
    equal === "unequal"
      ? shape === "circle"
        ? pieceCount === "2"
          ? [skew, 1 - skew]
          : [skew / 2, (1 - skew) / 2, skew / 2, (1 - skew) / 2]
        : pieceCount === "2"
          ? [skew]
          : [skew, 1 - skew]
      : undefined;

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
      {(introActive || showCheck) && <PartitioningCheck onComplete={onIntroDone} />}
      <Segmented label="Shape" value={shape} onChange={setShape} options={SHAPES.map((s) => ({ id: s, label: s === "circle" ? "Circle" : "Square" }))} />
      <div className="control-row">
        <Segmented label="Pieces" value={pieceCount} onChange={setPieceCount} options={[{ id: "2", label: "2" }, { id: "4", label: "4" }]} />
        <Segmented label="Equal?" value={equal} onChange={setEqual} options={[{ id: "equal", label: "Equal" }, { id: "unequal", label: "Unequal" }]} />
      </div>
      {shape === "square" && pieceCount === "4" && equal === "equal" && (
        <Segmented label="Cut style" value={cutStyle} onChange={setCutStyle} options={[{ id: "plus", label: "Plus-cut (4 squares)" }, { id: "x", label: "X-cut (4 triangles)" }]} />
      )}
      {shape === "square" && pieceCount === "2" && equal === "equal" && (
        <Segmented label="Orientation" value={orientation} onChange={setOrientation} options={[{ id: "v", label: "Up-down" }, { id: "h", label: "Side-to-side" }, { id: "diag", label: "Diagonal" }]} />
      )}
      {equal === "unequal" && (
        <div className="control-row">
          <Stepper label="How uneven" value={Math.round(skew * 100)} min={10} max={40} step={5} onChange={(v) => setSkew(v / 100)} tone="b" />
        </div>
      )}
      <ShapePartition shape={shape} pattern={pattern} cutStyle={cutStyle} orientation={orientation} unequalFractions={unequalFractions} width={160} height={160} />
      <p className="muted small">
        {meta.equal
          ? `This ${shape} is cut into ${meta.pieceCount} EQUAL pieces — each one is called ${meta.pieceCount === 2 ? "a half" : "a fourth (or quarter)"}.`
          : `This ${shape} has ${meta.pieceCount} pieces, but they're NOT the same size — so we can't call them ${meta.pieceCount === 2 ? "halves" : "fourths"}.`}
        {shape === "square" && pieceCount === "4" && equal === "equal" && " Try switching between the plus-cut and the X-cut — both give 4 EQUAL pieces, just shaped differently."}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE — one ProblemType per bucket
// ============================================================================

function halvesEqualProblem(): Problem {
  const shape = pick(SHAPES);
  const orientation = shape === "square" ? pick(["v", "h", "diag"] as const) : undefined;
  const startDeg = shape === "circle" ? pick([-90, 0, 45, 135]) : undefined;

  return {
    title: "Cutting into halves",
    bucket: "halves-equal",
    story: `This ${shape} is cut into 2 pieces.`,
    visual: () => <ShapePartition shape={shape} pattern="halves-equal" orientation={orientation ?? startDeg} width={140} height={140} />,
    steps: [
      {
        kind: "number",
        prompt: "How many EQUAL pieces is this shape cut into?",
        hint: "Count the pieces, and check they're the same size.",
        explain: "It's cut into 2 equal pieces.",
        answer: 2,
      },
      choice(
        {
          prompt: "What do we call one of these equal pieces?",
          hint: "2 equal pieces of a whole are called...",
          explain: "2 equal pieces are called halves — each one is a half.",
        },
        "A half",
        ["A fourth", "A whole"]
      ),
    ],
    wrapUp: `This ${shape} is cut into 2 equal halves.`,
  };
}

function halvesUnequalProblem(): Problem {
  const shape = pick(SHAPES);
  const skew = skewFraction();

  return {
    title: "Are these really halves?",
    bucket: "halves-unequal",
    story: `This ${shape} is cut into 2 pieces.`,
    visual: () => <ShapePartition shape={shape} pattern="halves-unequal" unequalFractions={shape === "circle" ? [skew, 1 - skew] : [skew]} width={140} height={140} />,
    steps: [
      choice(
        {
          prompt: "Are these two pieces the same size?",
          hint: "Compare how much space each piece takes up.",
          explain: "No — one piece is clearly bigger than the other.",
        },
        "No",
        ["Yes"]
      ),
      choice(
        {
          prompt: "So can we call these two pieces 'halves'?",
          hint: "Halves must be equal size, not just 2 pieces.",
          explain: "No — halves have to be the SAME size. 2 pieces of different sizes aren't halves.",
        },
        "No — halves have to be equal size.",
        ["Yes — there are 2 pieces, so they're halves."]
      ),
    ],
    wrapUp: `These 2 pieces aren't halves — halves must be the same size, and these aren't.`,
  };
}

function fourthsEqualProblem(): Problem {
  const shape = pick(SHAPES);
  const cutStyle: SquareCutStyle = pick(["plus", "x"]);
  const startDeg = shape === "circle" ? pick([-90, 0, 45]) : undefined;

  return {
    title: "Cutting into fourths",
    bucket: "fourths-equal",
    story: `This ${shape} is cut into 4 pieces.`,
    visual: () => <ShapePartition shape={shape} pattern="fourths-equal" cutStyle={cutStyle} orientation={startDeg} width={140} height={140} />,
    steps: [
      {
        kind: "number",
        prompt: "How many EQUAL pieces is this shape cut into?",
        hint: "Count the pieces, and check they're the same size.",
        explain: "It's cut into 4 equal pieces.",
        answer: 4,
      },
      choice(
        {
          prompt: "What do we call one of these equal pieces?",
          hint: "4 equal pieces of a whole are called...",
          explain: "4 equal pieces are called fourths (or quarters) — each one is a fourth.",
        },
        "A fourth (or quarter)",
        ["A half", "A whole"]
      ),
    ],
    wrapUp: `This ${shape} is cut into 4 equal fourths${shape === "square" ? ` (a ${cutStyle === "plus" ? "plus-cut into 4 squares" : "X-cut into 4 triangles"} — both are valid ways to make fourths)` : ""}.`,
  };
}

function fourthsUnequalProblem(): Problem {
  const shape = pick(SHAPES);
  const a = skewFraction();
  const b = skewFraction() + 0.3; // kept apart from `a` so the 4 pieces read as clearly different sizes

  return {
    title: "Are these really fourths?",
    bucket: "fourths-unequal",
    story: `This ${shape} is cut into 4 pieces.`,
    visual: () => <ShapePartition shape={shape} pattern="fourths-unequal" unequalFractions={shape === "circle" ? [a, b, a, 1 - 2 * a - b] : [a, b]} width={140} height={140} />,
    steps: [
      choice(
        {
          prompt: "Are all 4 of these pieces the same size?",
          hint: "Compare the biggest piece to the smallest piece.",
          explain: "No — the 4 pieces are different sizes.",
        },
        "No",
        ["Yes"]
      ),
      choice(
        {
          prompt: "So can we call these 4 pieces 'fourths'?",
          hint: "Fourths must be 4 EQUAL pieces, not just any 4 pieces.",
          explain: "No — fourths have to be 4 pieces that are all the SAME size.",
        },
        "No — fourths have to be 4 equal-size pieces.",
        ["Yes — there are 4 pieces, so they're fourths."]
      ),
    ],
    wrapUp: `These 4 pieces aren't fourths — fourths must all be the same size, and these aren't.`,
  };
}

function compareHalvesFourthsProblem(): Problem {
  const shape = pick(SHAPES);

  return {
    title: "Halves vs. fourths",
    bucket: "compare-halves-fourths",
    story: `Here are two same-size ${shape}s — one cut into halves, one cut into fourths.`,
    visual: () => (
      <div className="control-row" style={{ gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <ShapePartition shape={shape} pattern="halves-equal" width={120} height={120} />
          <p className="muted small">Halves</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <ShapePartition shape={shape} pattern="fourths-equal" width={120} height={120} />
          <p className="muted small">Fourths</p>
        </div>
      </div>
    ),
    steps: [
      choice(
        {
          prompt: "Which piece is bigger — a half, or a fourth, of the same-size whole?",
          hint: "More pieces from the same-size whole means each piece is smaller.",
          explain: "A half is bigger than a fourth of the same-size whole.",
        },
        "A half",
        ["A fourth", "They're the same size"]
      ),
      choice(
        {
          prompt: "Why?",
          hint: "Think about cutting the SAME whole into more pieces.",
          explain: "Cutting the same-size whole into more pieces (4 instead of 2) makes each piece smaller, not bigger.",
        },
        "Cutting into more pieces makes each piece smaller.",
        ["4 is a bigger number than 2, so fourths must be bigger.", "Halves and fourths are actually the same size."]
      ),
    ],
    wrapUp: "A half is bigger than a fourth of the same-size whole — more equal shares means smaller shares.",
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <ShapePartition shape="circle" pattern="fourths-equal" width={130} height={130} />;
}

export const partitioningShapes: Unit = {
  id: "partitioningShapes",
  title: "Partitioning Into Halves and Fourths",
  goal: "Split a circle or rectangle into 2 or 4 EQUAL pieces, and use the words halves, fourths, and quarters to describe them.",
  standard: "1.G.3",
  keyIdea: (
    <>
      <p>Halves means 2 EQUAL pieces, and fourths (or quarters) means 4 EQUAL pieces — the pieces have to be the same size, not just the same count.</p>
      <p>Cutting the same-size whole into MORE pieces makes each piece SMALLER, not bigger — a fourth is smaller than a half.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "Halves", make: halvesEqualProblem, buckets: ["halves-equal"] },
    { label: "Not halves?", make: halvesUnequalProblem, buckets: ["halves-unequal"] },
    { label: "Fourths", make: fourthsEqualProblem, buckets: ["fourths-equal"] },
    { label: "Not fourths?", make: fourthsUnequalProblem, buckets: ["fourths-unequal"] },
    { label: "Halves vs. fourths", make: compareHalvesFourthsProblem, buckets: ["compare-halves-fourths"] },
  ],
  requiredBuckets: ["halves-equal", "halves-unequal", "fourths-equal", "fourths-unequal", "compare-halves-fourths"],
  test: partitioningShapesTest,
};
