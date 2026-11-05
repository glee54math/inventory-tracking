import { useState } from "react";
import { ShapeGlyph, SHAPE_KINDS, SHAPE_LABELS, TURN_DEMO_MS, type ShapeKind } from "../diagrams/Shape2D";
import { PositionScene, RELATIONS, RELATION_LABELS, RELATION_RECIPROCAL, type Relation } from "../diagrams/PositionScene";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { namingShapesAndPositionsTest } from "./NamingShapesAndPositionsTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K.G.2's explicit intent (a shape stays the same shape no matter its
// orientation or size) is the headline misconception here — a tilted square
// is NOT a different shape called a "diamond."

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: turning a shape doesn't change it; big, small and turned
// shapes keep their name; position words (in front of, below).

const shapeRow = (items: { kind: ShapeKind; scale?: number; rotation?: number }[]) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
    {items.map((it, i) => (
      <div key={i} style={{ width: 84 }}>
        <ShapeGlyph kind={it.kind} scale={it.scale} rotation={it.rotation} tone="a" label={`shape ${i + 1}`} />
      </div>
    ))}
  </div>
);
const TRIANGLE_ROW = shapeRow([{ kind: "triangle", scale: 1.3 }, { kind: "circle" }, { kind: "triangle", scale: 0.5 }, { kind: "square" }, { kind: "triangle", rotation: 180 }]);
const SQUARE_ROW = shapeRow([{ kind: "square" }, { kind: "rectangle" }, { kind: "square", rotation: 45, scale: 0.6 }, { kind: "triangle" }, { kind: "square", scale: 1.2 }]);

function NamingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="This square got turned. What shape is it now?"
            picture={<ShapeGlyph kind="square" rotation={45} tone="a" label="a turned shape" />}
            showPicture={<ShapeGlyph kind="square" rotation={45} tone="a" label="a turned shape" turnDemo />}
            showText="Watch it turn back. It is still a square."
            options={[
              { id: "square", label: "Square" },
              { id: "new", label: "A new shape" },
            ]}
            answer="square"
            why={{ new: "Turning does not change the shape. Count its sides and corners." }}
            praise="Yes! Turning does not change the shape. It is still a square."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many triangles?"
            answer={3}
            tone="a"
            picture={() => TRIANGLE_ROW}
            nudge="Big ones, small ones and turned ones are triangles too."
            why={{ 1: "Little ones and turned ones are triangles too.", 2: "Look for a turned one, too." }}
            showText="Count every shape with 3 sides: big, small, and upside down. 1, 2, 3."
            praise="Yes! 3 triangles. Big, small, or turned, a triangle is a triangle."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="How many squares?"
            answer={3}
            tone="a"
            picture={() => SQUARE_ROW}
            nudge="A square has 4 sides that are all the same. Small and turned ones count too."
            why={{ 4: "The long one is a rectangle, not a square.", 2: "Look for a small turned one, too." }}
            showText="Count the squares: the first one, the small turned one, and the big one. 1, 2, 3."
            praise="Yes! 3 squares."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="Where is the ball?"
            picture={<PositionScene relation="inFrontOf" />}
            showPicture={<PositionScene relation="inFrontOf" />}
            showText="Look: the ball hides part of the box. The ball is in front of the box."
            options={[
              { id: "beside", label: "Beside the box" },
              { id: "inFrontOf", label: "In front of the box" },
            ]}
            answer="inFrontOf"
            why={{ beside: "Part of the box is hidden. Is the ball next to it, or in front?" }}
            praise="Yes! The ball is in front of the box."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="Now where is the ball?"
            picture={<PositionScene relation="below" />}
            showPicture={<PositionScene relation="below" />}
            showText="Look: the ball is under the box. The ball is below the box."
            options={[
              { id: "above", label: "Above" },
              { id: "below", label: "Below" },
            ]}
            answer="below"
            why={{ above: "Above means on top. Is the ball on top of the box?" }}
            praise="Yes! The ball is below the box."
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

const ROTATIONS = [0, 30, 45, 60, 90, 120, 150, 180, 225, 270, 315];
const SCALES: { id: string; label: string; value: number }[] = [
  { id: "small", label: "Small", value: 0.55 },
  { id: "normal", label: "Normal", value: 1 },
  { id: "large", label: "Large", value: 1.4 },
];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [kind, setKind] = useState<ShapeKind>("square");
  const [rotation, setRotation] = useState(0);
  const [scaleId, setScaleId] = useState("normal");
  const scale = SCALES.find((s) => s.id === scaleId)?.value ?? 1;

  const [relation, setRelation] = useState<Relation>("beside");
  const [side, setSide] = useState<"left" | "right">("right");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <ReadAloud as="p" className="muted small">Pick a shape, then turn it or resize it. No matter what you do, it's still the same shape!</ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented label="Shape" value={kind} onChange={setKind} options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
          <Segmented label="Size" value={scaleId} onChange={setScaleId} options={SCALES.map((s) => ({ id: s.id, label: s.label }))} />
          <button className="btn ghost" onClick={() => setRotation((r) => (r + 45) % 360)}>
            Flip / rotate it
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
          <ShapeGlyph kind={kind} rotation={rotation} scale={scale} tone="a" label="the chosen shape" />
        </div>
        <ReadAloud as="p" className="feedback good">This is still a {SHAPE_LABELS[kind]} — turning or resizing it never makes it a different shape!</ReadAloud>
      </div>

      <div>
        <ReadAloud as="p" className="muted small">Now place the ball somewhere around the box, and see which position word fits.</ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented label="Where's the ball?" value={relation} onChange={setRelation} options={RELATIONS.map((r) => ({ id: r, label: RELATION_LABELS[r] }))} />
          {relation === "beside" && <Segmented label="Which side" value={side} onChange={setSide} options={[{ id: "left", label: "Left" }, { id: "right", label: "Right" }]} />}
        </div>
        <div style={{ maxWidth: 220 }}>
          <PositionScene relation={relation} side={side} />
        </div>
        <ReadAloud as="p" className="feedback good">The ball is {RELATION_LABELS[relation].toLowerCase()} the box.</ReadAloud>
        <ReadAloud as="p" className="muted small">"Beside" and "next to" mean the same thing — both describe objects side-by-side, with nothing hidden.</ReadAloud>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <NamingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "standardOrientation" | "rotatedOrResized" | "positionDescribe" | "positionVocabPrecision";
const BUCKETS: Bucket[] = ["standardOrientation", "rotatedOrResized", "positionDescribe", "positionVocabPrecision"];

function shapeDistractors(kind: ShapeKind, includeDiamond: boolean): string[] {
  const others = shuffle(SHAPE_KINDS.filter((k) => k !== kind)).map((k) => SHAPE_LABELS[k]);
  if (includeDiamond) return shuffle([others[0], "Diamond"]);
  return others.slice(0, 2);
}

function nameShapeProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(["standardOrientation", "rotatedOrResized"] as const);
  const kind = pick(SHAPE_KINDS);
  let rotation = 0;
  let scale = 1;
  let variantNote = "in its usual position";
  if (bucket === "rotatedOrResized") {
    const variant = kind === "circle" ? "resize" : pick(["rotate", "resize"] as const);
    if (variant === "rotate") {
      rotation = pick(ROTATIONS.filter((r) => r !== 0));
      variantNote = "turned";
    } else {
      scale = pick([0.55, 1.4]);
      variantNote = scale < 1 ? "made smaller" : "made bigger";
    }
  }
  const label = SHAPE_LABELS[kind];
  return {
    title: "Name the shape",
    bucket,
    story: `This shape has been ${variantNote}. What shape is it?`,
    // Step 2's "Show me": the shape turns all the way around (a circle grows
    // and shrinks instead) and is plainly still the same shape.
    visual: (_done, help) => (
      <ShapeGlyph kind={kind} rotation={rotation} scale={scale} tone="a" label="a shape to name" turnDemo={!!help?.showMe && help.step === 1} />
    ),
    steps: [
      choice(
        { prompt: "What shape is this?", hint: "Count the sides and corners — that never changes, no matter how it's turned or sized.", explain: `This is a ${label}, no matter how it's turned or resized.` },
        label,
        shapeDistractors(kind, kind === "square")
      ),
      choice(
        {
          prompt: `If this ${label.toLowerCase()} were turned a completely different way, would it still be a ${label}?`,
          showMe: kind === "circle" ? "Watch it get smaller, then bigger. It is still a circle." : `Watch it turn all the way around. It is still a ${label.toLowerCase()}.`,
          showMeHoldMs: TURN_DEMO_MS,
          hint: "Turning (or resizing) a shape never changes how many sides or corners it has.",
          explain: `Yes — turning or resizing a ${label.toLowerCase()} never changes what shape it is.`,
        },
        "Yes — turning it never changes what shape it is",
        ["No — it would become a different shape"]
      ),
    ],
    wrapUp: `It's a ${label}, no matter which way it's facing or how big it is.`,
  };
}

function positionProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(["positionDescribe", "positionVocabPrecision"] as const);
  const vocabSet: Relation[] = ["beside", "inFrontOf", "behind"];
  const relation = bucket === "positionVocabPrecision" ? pick(vocabSet) : pick(RELATIONS);
  const side = pick(["left", "right"] as const);
  const correct = RELATION_LABELS[relation];
  const distractors =
    bucket === "positionVocabPrecision"
      ? vocabSet.filter((r) => r !== relation).map((r) => RELATION_LABELS[r])
      : shuffle(RELATIONS.filter((r) => r !== relation)).slice(0, 2).map((r) => RELATION_LABELS[r]);
  const reciprocal = RELATION_RECIPROCAL[relation];
  return {
    title: "Where is it?",
    bucket,
    story: "Look at where the ball is, compared to the box.",
    visual: () => <PositionScene relation={relation} side={side} />,
    steps: [
      choice(
        { prompt: "Which word describes where the ball is, compared to the box?", hint: "Does anything overlap or hide part of the other object?", explain: `The ball is ${correct.toLowerCase()} the box.` },
        correct,
        distractors
      ),
      choice(
        {
          prompt: "From the BALL's point of view, where is the box?",
          hint: "Above/below swap, in front of/behind swap — beside stays beside.",
          explain: `If the ball is ${correct.toLowerCase()} the box, then the box is ${RELATION_LABELS[reciprocal].toLowerCase()} the ball.`,
        },
        RELATION_LABELS[reciprocal],
        shuffle(RELATIONS.filter((r) => r !== reciprocal)).slice(0, 2).map((r) => RELATION_LABELS[r])
      ),
    ],
    wrapUp: `The ball is ${correct.toLowerCase()} the box.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <ShapeGlyph kind="square" rotation={45} scale={1} tone="a" label="a tilted square" />;
}

export const namingShapesAndPositions: Unit = {
  id: "namingShapesAndPositions",
  title: "Naming Shapes and Positions",
  goal: "Name common shapes — even turned or resized — and describe where something is using words like above, below, beside, in front of, and behind.",
  standard: "K.G.1, K.G.2",
  keyIdea: (
    <>
      <p>A shape stays the SAME shape no matter which way it's turned or how big or small it is — a tilted square is still a square, never a "diamond."</p>
      <p>Words like above, below, beside, in front of, and behind describe exactly where one thing is compared to another.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  reintroEverySolved: 20,
  preview: Preview,
  problems: [
    { label: "Name the Shape", make: nameShapeProblem, buckets: ["standardOrientation", "rotatedOrResized"] },
    { label: "Where Is It?", make: positionProblem, buckets: ["positionDescribe", "positionVocabPrecision"] },
  ],
  requiredBuckets: BUCKETS,
  test: namingShapesAndPositionsTest,
};
