import { useState } from "react";
import { ShapeGlyph, ShapeCountable, SHAPE_KINDS, SHAPE_LABELS, shapeAttributes, sidesLookEqual, BUILDABLE_KINDS, type ShapeKind, type BuildableKind } from "../diagrams/Shape2D";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { countAlongMs, countAlongText } from "../diagrams/countAlong";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { sidesAndCornersTest } from "./SidesAndCornersTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: counting sides and corners; a circle has 0 of each; a
// square and a rectangle have the same number of sides even though they
// look different.

const countQuestion = (n: number, kind: BuildableKind, what: "sides" | "corners", done: () => void) => {
  const total = shapeAttributes(kind)[what];
  return (
    <TypeCheck
      n={n}
      prompt={`How many ${what} does this ${kind} have?`}
      answer={total}
      tone="a"
      picture={(m) => <ShapeCountable kind={kind} tone="a" countAlong={m === "show" || m === "done" ? what : undefined} />}
      nudge={what === "sides" ? "Put your finger on one straight side. Count each side once." : "Point to each corner, where two sides meet. Count each once."}
      showText={`Watch and listen: ${Array.from({ length: total }, (_, i) => i + 1).join(", ")}.`}
      praise={`Yes! A ${kind} has ${total} ${what}.`}
      onComplete={done}
    />
  );
};

function SidesAndCornersCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => countQuestion(1, "square", "sides", done),
        (done) => countQuestion(2, "triangle", "corners", done),
        (done) => (
          <TypeCheck
            n={3}
            prompt="How many corners does a circle have?"
            answer={0}
            tone="a"
            picture={() => (
              <div style={{ width: 130 }}>
                <ShapeGlyph kind="circle" tone="b" label="a round shape" />
              </div>
            )}
            nudge="A corner is a point where two straight sides meet. Can you find one?"
            why={{ 1: "A circle is round all the way. There is no point to touch." }}
            showText="Run your finger around the circle. It never turns a corner. 0 corners."
            praise="Yes! A circle has 0 corners and 0 sides."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="Do the square and the rectangle have the same number of sides?"
            picture={
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 150 }}>
                  <ShapeCountable kind="square" tone="a" />
                </div>
                <div style={{ width: 150 }}>
                  <ShapeCountable kind="rectangle" tone="c" />
                </div>
              </div>
            }
            showPicture={
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 150 }}>
                  <ShapeCountable kind="square" tone="a" countAlong="sides" />
                </div>
                <div style={{ width: 150 }}>
                  <ShapeCountable kind="rectangle" tone="c" countAlong="sides" countAlongStartAfter={5} />
                </div>
              </div>
            }
            showText="Count the square: 1, 2, 3, 4. Count the rectangle: 1, 2, 3, 4. Both have 4."
            options={[
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ]}
            answer="yes"
            why={{ no: "The sides are different lengths, but count them. How many does each have?" }}
            praise="Yes! Both have 4 sides. The rectangle's sides are just longer."
            onComplete={done}
          />
        ),
      ]}
    />
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
        <ReadAloud as="p" className="muted small">Pick a shape, then click every side (then every corner) to count them one at a time.</ReadAloud>
        <div className="control-row" data-readaloud-part>
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
        <ReadAloud as="p" className="feedback good">
          Sides clicked: {countedSides.length} of {shapeAttributes(kind).sides} — Corners clicked: {countedCorners.length} of {shapeAttributes(kind).corners}
        </ReadAloud>
      </div>

      <div>
        <ReadAloud as="p" className="muted small">Now compare two different shapes side by side.</ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented label="Shape A" value={kindA} onChange={setKindA} options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
          <Segmented label="Shape B" value={kindB} onChange={setKindB} options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
        </div>
        <div className="control-row" data-readaloud-part>
          <div style={{ maxWidth: 160 }}>
            <ShapeGlyph kind={kindA} tone="a" label="shape A" />
            <ReadAloud as="p" className="small" style={{ textAlign: "center" }}>
              {SHAPE_LABELS[kindA]}: {attrA.sides} sides, {attrA.corners} corners
            </ReadAloud>
          </div>
          <div style={{ maxWidth: 160 }}>
            <ShapeGlyph kind={kindB} tone="c" label="shape B" />
            <ReadAloud as="p" className="small" style={{ textAlign: "center" }}>
              {SHAPE_LABELS[kindB]}: {attrB.sides} sides, {attrB.corners} corners
            </ReadAloud>
          </div>
        </div>
        <ReadAloud as="p" className="feedback good">
          {attrA.sides === attrB.sides
            ? `${SHAPE_LABELS[kindA]} and ${SHAPE_LABELS[kindB]} have the SAME number of sides (${attrA.sides}).`
            : attrA.sides > attrB.sides
              ? `${SHAPE_LABELS[kindA]} has MORE sides than ${SHAPE_LABELS[kindB]}.`
              : `${SHAPE_LABELS[kindB]} has MORE sides than ${SHAPE_LABELS[kindA]}.`}
        </ReadAloud>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <SidesAndCornersCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "countSides" | "countCorners" | "equalSidesCompare" | "crossShapeCompare";
const BUCKETS: Bucket[] = ["countSides", "countCorners", "equalSidesCompare", "crossShapeCompare"];

/** The shape, or — during a counting step's "Show me" — the same shape with
 *  its sides/corners lighting up and getting numbered one at a time. */
function countingGlyph(kind: ShapeKind, tone: "a" | "b" | "c", label: string, what?: "sides" | "corners", startAfter = 0) {
  if (what && kind !== "circle") return <ShapeCountable kind={kind} tone={tone} countAlong={what} countAlongStartAfter={startAfter} />;
  return <ShapeGlyph kind={kind} tone={tone} label={label} />;
}

/** Which count ("sides"/"corners") the open "Show me" is demonstrating, if any. */
const showMeCount = (help: VisualHelp | undefined, steps: ("sides" | "corners" | undefined)[]) => (help?.showMe ? steps[help.step] : undefined);

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
      visual: (_done, help) => countingGlyph(kind, "a", "a shape", showMeCount(help, [primary, secondary])),
      steps: [
        { kind: "number", showMe: countAlongText(primaryCount, primary), showMeHoldMs: kind === "circle" ? undefined : countAlongMs(primaryCount), prompt: `How many ${primary} does this ${label.toLowerCase()} have?`, hint: kind === "circle" ? "A circle's edge is curved, not straight." : `Count each ${primary.slice(0, -1)} one at a time.`, explain: `A ${label.toLowerCase()} has ${primaryCount} ${primary}.`, answer: primaryCount },
        { kind: "number", showMe: countAlongText(secondaryCount, secondary), showMeHoldMs: kind === "circle" ? undefined : countAlongMs(secondaryCount), prompt: `How many ${secondary} does it have?`, hint: kind === "circle" ? "A circle never meets itself at a sharp point." : `Count each ${secondary.slice(0, -1)} one at a time.`, explain: `A ${label.toLowerCase()} has ${secondaryCount} ${secondary}.`, answer: secondaryCount },
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
      visual: (_done, help) => countingGlyph(kind, "b", "a shape", showMeCount(help, [undefined, "sides"])),
      steps: [
        choice(
          { prompt: "Do all of its sides look the same length?", hint: "Compare each side's length to the others, not just how many there are.", explain: `A ${label.toLowerCase()}'s sides are ${equal ? "" : "NOT "}all the same length.` },
          equal ? "Yes" : "No",
          [equal ? "No" : "Yes"]
        ),
        { kind: "number", showMe: countAlongText(shapeAttributes(kind).sides, "sides"), showMeHoldMs: countAlongMs(shapeAttributes(kind).sides), prompt: `How many sides does this ${label.toLowerCase()} have, total?`, hint: "The number of sides doesn't depend on their length.", explain: `A ${label.toLowerCase()} has ${shapeAttributes(kind).sides} sides, whether or not they're equal.`, answer: shapeAttributes(kind).sides },
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
  // "Show me": count shape A, then shape B (matches the picture's count-along).
  const countBoth = (noun: "sides" | "corners") => {
    const one = (label: string, n: number) =>
      n === 0 ? `The ${label.toLowerCase()} has no ${noun}.` : `Count the ${label.toLowerCase()}: ${Array.from({ length: n }, (_, i) => i + 1).join(", ")}.`;
    return `${one(labelA, a.sides)} ${one(labelB, b.sides)} That's ${a.sides} and ${b.sides}.`;
  };
  const countBothMs = countAlongMs(a.sides + 1 + b.sides);
  return {
    title: "Compare two shapes",
    bucket,
    story: `Here is a ${labelA.toLowerCase()} and a ${labelB.toLowerCase()}.`,
    visual: (_done, help) => {
      const what = showMeCount(help, ["sides", "corners"]);
      return (
        <div className="control-row" data-readaloud-part>
          {countingGlyph(kindA, "a", "shape A", what)}
          {/* shape B starts counting one beat after shape A is finished */}
          {countingGlyph(kindB, "c", "shape B", what, a.sides + 1)}
        </div>
      );
    },
    steps: [
      choice(
        { prompt: "Which shape has MORE sides?", showMe: countBoth("sides"), showMeHoldMs: countBothMs, hint: "Count each shape's sides separately, then compare the two numbers.", explain: sameCount ? `Both have ${a.sides} sides — that's the same number.` : `${moreSidesAnswer} has more sides (${Math.max(a.sides, b.sides)} vs. ${Math.min(a.sides, b.sides)}).` },
        moreSidesAnswer,
        shuffle([labelA, labelB, "They have the same number of sides"].filter((c) => c !== moreSidesAnswer)).slice(0, 2)
      ),
      choice(
        { prompt: "Which shape has MORE corners?", showMe: countBoth("corners"), showMeHoldMs: countBothMs, hint: "For these shapes, the number of corners always matches the number of sides.", explain: sameCount ? `Both have ${a.corners} corners — that's the same number.` : `${moreSidesAnswer} has more corners too, since corners match sides for these shapes.` },
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
