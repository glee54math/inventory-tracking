import { useEffect, useState } from "react";
import { ShapeGlyph, ShapeCountable, SHAPE_KINDS, SHAPE_LABELS, shapeAttributes, sidesLookEqual, BUILDABLE_KINDS, type ShapeKind, type BuildableKind } from "../diagrams/Shape2D";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { sidesAndCornersTest } from "./SidesAndCornersTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: side vs. corner. */
function SideCornerVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [sidePick, setSidePick] = useState("");
  const [cornerPick, setCornerPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [sidePick, cornerPick].every((v) => String(v).trim() !== "");
  const sideOk = sidePick === "side";
  const cornerOk = cornerPick === "corner";
  const ok = sideOk && cornerOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Look at this square.
      </p>
      <ShapeGlyph kind="square" tone="a" label="a shape" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What do we call one of the straight lines on its edge?{" "}
          <select className="answer" value={sidePick} onChange={(e) => setSidePick(e.target.value)} style={fieldOk(sideOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="side">A side</option>
            <option value="corner">A corner</option>
          </select>
        </label>
        <label>
          What do we call the point where two of those lines meet?{" "}
          <select className="answer" value={cornerPick} onChange={(e) => setCornerPick(e.target.value)} style={fieldOk(cornerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="side">A side</option>
            <option value="corner">A corner</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — a side is a straight edge, a corner is where two sides meet." : "Not quite — a SIDE is one straight line of the shape's edge; a CORNER is the point where two sides meet."}
        </p>
      )}
    </div>
  );
}

/** Conflation: a circle has zero of EITHER — commonly missed since "the
 *  outside line" can feel like "a side" to a first-time learner. */
function CircleZeroConflationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [sidesPick, setSidesPick] = useState("");
  const [cornersPick, setCornersPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [sidesPick, cornersPick].every((v) => String(v).trim() !== "");
  const sidesOk = sidesPick === "no";
  const cornersOk = cornersPick === "no";
  const ok = sidesOk && cornersOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Look at this circle.
      </p>
      <ShapeGlyph kind="circle" tone="b" label="a round shape" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Does a circle have any STRAIGHT sides?{" "}
          <select className="answer" value={sidesPick} onChange={(e) => setSidesPick(e.target.value)} style={fieldOk(sidesOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label>
          Does a circle have any CORNERS?{" "}
          <select className="answer" value={cornersPick} onChange={(e) => setCornersPick(e.target.value)} style={fieldOk(cornersOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — a circle's edge is one curved line with no straight parts and no corners, so it has 0 sides and 0 corners."
            : "Not quite — a circle's outline is curved, not straight, and it never meets itself at a sharp point — so it has 0 sides AND 0 corners."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: side COUNT vs. side LENGTH are different things. */
function SameCountTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Here is a square and a rectangle that is NOT a square.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <ShapeGlyph kind="square" tone="a" label="a shape" />
        <ShapeGlyph kind="rectangle" tone="c" label="a different shape" />
      </div>
      <p>True or false: even though their sides are different lengths, they both have the same NUMBER of sides (4).</p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — how LONG the sides are is different from how MANY sides there are. Both shapes have exactly 4 sides, even though they look different."
            : "Not quite — count the sides on each one: a square has 4, and this rectangle also has 4. Looking different doesn't change the COUNT, just the lengths."}
        </p>
      )}
    </div>
  );
}

/** Multi-part: equal-length sides vs. equal side COUNT, contrasted directly. */
function EqualLengthVsEqualCountQuestion({ onComplete }: { onComplete?: () => void }) {
  const [equalPick, setEqualPick] = useState("");
  const [countPick, setCountPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [equalPick, countPick].every((v) => String(v).trim() !== "");
  const equalOk = equalPick === "square";
  const countOk = countPick === "yes";
  const ok = equalOk && countOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Here is a square and a rectangle that is NOT a square.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <ShapeGlyph kind="square" tone="a" label="a shape" />
        <ShapeGlyph kind="rectangle" tone="c" label="a different shape" />
      </div>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which one has all 4 sides the SAME length?{" "}
          <select className="answer" value={equalPick} onChange={(e) => setEqualPick(e.target.value)} style={fieldOk(equalOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="square">The square</option>
            <option value="rectangle">The rectangle</option>
          </select>
        </label>
        <label>
          Do they both have the same NUMBER of sides?{" "}
          <select className="answer" value={countPick} onChange={(e) => setCountPick(e.target.value)} style={fieldOk(countOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the square's sides are all equal in LENGTH, but both shapes still have the same NUMBER of sides (4). Length and count are two different things to check."
            : "Not quite — only the square has 4 equal-length sides. But both shapes still have 4 sides total, no matter their lengths."}
        </p>
      )}
    </div>
  );
}

function SidesAndCornersCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, circleZero: false, sameCountTrap: false, equalLengthVsCount: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: sides and corners before you try practice problems.</p>
      <SideCornerVocabQuestion onComplete={mark("vocab")} />
      <CircleZeroConflationQuestion onComplete={mark("circleZero")} />
      <SameCountTrapQuestion onComplete={mark("sameCountTrap")} />
      <EqualLengthVsEqualCountQuestion onComplete={mark("equalLengthVsCount")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [kind, setKind] = useState<BuildableKind>("square");
  const [countedSides, setCountedSides] = useState<number[]>([]);
  const [countedCorners, setCountedCorners] = useState<number[]>([]);

  const pickKind = (k: BuildableKind) => {
    setKind(k);
    setCountedSides([]);
    setCountedCorners([]);
  };
  const toggleSide = (i: number) => setCountedSides((arr) => (arr.includes(i) ? arr : [...arr, i]));
  const toggleCorner = (i: number) => setCountedCorners((arr) => (arr.includes(i) ? arr : [...arr, i]));

  const [kindA, setKindA] = useState<ShapeKind>("triangle");
  const [kindB, setKindB] = useState<ShapeKind>("hexagon");
  const attrA = shapeAttributes(kindA);
  const attrB = shapeAttributes(kindB);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <p className="muted small">Pick a shape, then click every side (then every corner) to count them one at a time.</p>
        <div className="control-row">
          <Segmented label="Shape" value={kind} onChange={pickKind} options={BUILDABLE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
          <button className="btn ghost" onClick={() => { setCountedSides([]); setCountedCorners([]); }}>
            Start over
          </button>
          {!introActive && (
            <button
              type="button"
              className="btn ghost"
              style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined}
              onClick={() => setShowCheck((v) => !v)}
            >
              Check for Understanding
            </button>
          )}
        </div>
        <div style={{ maxWidth: 220 }}>
          <ShapeCountable kind={kind} tone="a" countedSides={countedSides} countedCorners={countedCorners} onToggleSide={toggleSide} onToggleCorner={toggleCorner} />
        </div>
        <p className="feedback good">
          Sides clicked: {countedSides.length} of {shapeAttributes(kind).sides} — Corners clicked: {countedCorners.length} of {shapeAttributes(kind).corners}
        </p>
      </div>

      {(introActive || showCheck) && <SidesAndCornersCheckForUnderstanding onComplete={onIntroDone} />}

      <div>
        <p className="muted small">Now compare two different shapes side by side.</p>
        <div className="control-row">
          <Segmented label="Shape A" value={kindA} onChange={setKindA} options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
          <Segmented label="Shape B" value={kindB} onChange={setKindB} options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
        </div>
        <div className="control-row">
          <div style={{ maxWidth: 160 }}>
            <ShapeGlyph kind={kindA} tone="a" label="shape A" />
            <p className="small" style={{ textAlign: "center" }}>
              {SHAPE_LABELS[kindA]}: {attrA.sides} sides, {attrA.corners} corners
            </p>
          </div>
          <div style={{ maxWidth: 160 }}>
            <ShapeGlyph kind={kindB} tone="c" label="shape B" />
            <p className="small" style={{ textAlign: "center" }}>
              {SHAPE_LABELS[kindB]}: {attrB.sides} sides, {attrB.corners} corners
            </p>
          </div>
        </div>
        <p className="feedback good">
          {attrA.sides === attrB.sides
            ? `${SHAPE_LABELS[kindA]} and ${SHAPE_LABELS[kindB]} have the SAME number of sides (${attrA.sides}).`
            : attrA.sides > attrB.sides
              ? `${SHAPE_LABELS[kindA]} has MORE sides than ${SHAPE_LABELS[kindB]}.`
              : `${SHAPE_LABELS[kindB]} has MORE sides than ${SHAPE_LABELS[kindA]}.`}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "countSides" | "countCorners" | "equalSidesCompare" | "crossShapeCompare";
const BUCKETS: Bucket[] = ["countSides", "countCorners", "equalSidesCompare", "crossShapeCompare"];

function sidesAndCornersProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "countSides" || bucket === "countCorners") {
    const kind = pick(SHAPE_KINDS);
    const attr = shapeAttributes(kind);
    const label = SHAPE_LABELS[kind];
    const primary = bucket === "countSides" ? "sides" : "corners";
    const secondary = bucket === "countSides" ? "corners" : "sides";
    const primaryCount = bucket === "countSides" ? attr.sides : attr.corners;
    const secondaryCount = bucket === "countSides" ? attr.corners : attr.sides;
    return {
      title: `Count the ${primary}`,
      bucket,
      story: `Look at this ${label.toLowerCase()}.`,
      visual: () => <ShapeGlyph kind={kind} tone="a" label="a shape" />,
      steps: [
        { kind: "number", prompt: `How many ${primary} does this ${label.toLowerCase()} have?`, hint: kind === "circle" ? "A circle's edge is curved, not straight." : `Count each ${primary.slice(0, -1)} one at a time.`, explain: `A ${label.toLowerCase()} has ${primaryCount} ${primary}.`, answer: primaryCount },
        { kind: "number", prompt: `How many ${secondary} does it have?`, hint: kind === "circle" ? "A circle never meets itself at a sharp point." : `Count each ${secondary.slice(0, -1)} one at a time.`, explain: `A ${label.toLowerCase()} has ${secondaryCount} ${secondary}.`, answer: secondaryCount },
      ],
      wrapUp: `A ${label.toLowerCase()} has ${attr.sides} sides and ${attr.corners} corners.`,
    };
  }

  if (bucket === "equalSidesCompare") {
    const kind = pick(BUILDABLE_KINDS);
    const equal = sidesLookEqual(kind);
    const label = SHAPE_LABELS[kind];
    return {
      title: "Are the sides equal?",
      bucket,
      story: `Look at this ${label.toLowerCase()}.`,
      visual: () => <ShapeGlyph kind={kind} tone="b" label="a shape" />,
      steps: [
        choice(
          { prompt: "Do all of its sides look the same length?", hint: "Compare each side's length to the others, not just how many there are.", explain: `A ${label.toLowerCase()}'s sides are ${equal ? "" : "NOT "}all the same length.` },
          equal ? "Yes" : "No",
          [equal ? "No" : "Yes"]
        ),
        { kind: "number", prompt: `How many sides does this ${label.toLowerCase()} have, total?`, hint: "The number of sides doesn't depend on their length.", explain: `A ${label.toLowerCase()} has ${shapeAttributes(kind).sides} sides, whether or not they're equal.`, answer: shapeAttributes(kind).sides },
      ],
      wrapUp: `A ${label.toLowerCase()}'s sides are ${equal ? "all" : "not all"} the same length.`,
    };
  }

  // crossShapeCompare: compare two DIFFERENT shapes — sometimes a genuine tie
  // (square vs. a non-square rectangle: both 4 sides), so "the same" is a real,
  // reachable answer, not just a distractor.
  let kindA: ShapeKind;
  let kindB: ShapeKind;
  if (pick([true, false, false])) {
    [kindA, kindB] = pick([
      ["square", "rectangle"],
      ["rectangle", "square"],
    ] as const);
  } else {
    do {
      kindA = pick(SHAPE_KINDS);
      kindB = pick(SHAPE_KINDS);
    } while (kindA === kindB || shapeAttributes(kindA).sides === shapeAttributes(kindB).sides);
  }
  const a = shapeAttributes(kindA);
  const b = shapeAttributes(kindB);
  const labelA = SHAPE_LABELS[kindA];
  const labelB = SHAPE_LABELS[kindB];
  const sameCount = a.sides === b.sides;
  const moreSidesAnswer = sameCount ? "They have the same number of sides" : a.sides > b.sides ? labelA : labelB;
  return {
    title: "Compare two shapes",
    bucket,
    story: `Here is a ${labelA.toLowerCase()} and a ${labelB.toLowerCase()}.`,
    visual: () => (
      <div className="control-row">
        <ShapeGlyph kind={kindA} tone="a" label="shape A" />
        <ShapeGlyph kind={kindB} tone="c" label="shape B" />
      </div>
    ),
    steps: [
      choice(
        { prompt: "Which shape has MORE sides?", hint: "Count each shape's sides separately, then compare the two numbers.", explain: sameCount ? `Both have ${a.sides} sides — that's the same number.` : `${moreSidesAnswer} has more sides (${Math.max(a.sides, b.sides)} vs. ${Math.min(a.sides, b.sides)}).` },
        moreSidesAnswer,
        shuffle([labelA, labelB, "They have the same number of sides"].filter((c) => c !== moreSidesAnswer)).slice(0, 2)
      ),
      choice(
        { prompt: "Which shape has MORE corners?", hint: "For these shapes, the number of corners always matches the number of sides.", explain: sameCount ? `Both have ${a.corners} corners — that's the same number.` : `${moreSidesAnswer} has more corners too, since corners match sides for these shapes.` },
        moreSidesAnswer.replace("sides", "corners"),
        shuffle([labelA, labelB, "They have the same number of corners"].filter((c) => c !== moreSidesAnswer.replace("sides", "corners"))).slice(0, 2)
      ),
    ],
    wrapUp: sameCount ? `${labelA} and ${labelB} both have ${a.sides} sides.` : `${moreSidesAnswer} has more sides than the other shape.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <ShapeGlyph kind="hexagon" tone="a" label="a hexagon" />;
}

export const sidesAndCorners: Unit = {
  id: "sidesAndCorners",
  title: "What Makes a Shape a Shape (Sides and Corners)",
  goal: "Describe a shape using words like sides, corners, and equal sides — and compare shapes using those words.",
  standard: "K.G.4",
  keyIdea: (
    <>
      <p>A side is a straight edge. A corner is where two sides meet. A circle has 0 of either — its edge is one curved line.</p>
      <p>How LONG a shape's sides are is different from how MANY sides it has — a square and a non-square rectangle both have 4 sides.</p>
    </>
  ),
  Explore,
  requiresIntro: false,
  preview: Preview,
  problems: [{ label: "Sides & Corners", make: sidesAndCornersProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: sidesAndCornersTest,
};
