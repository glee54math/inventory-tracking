import { useEffect, useState } from "react";
import { ShapeGlyph, SHAPE_KINDS, SHAPE_LABELS, type ShapeKind } from "../diagrams/Shape2D";
import { PositionScene, RELATIONS, RELATION_LABELS, RELATION_RECIPROCAL, type Relation } from "../diagrams/PositionScene";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { namingShapesAndPositionsTest } from "./NamingShapesAndPositionsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K.G.2's explicit intent (a shape stays the same shape no matter its
// orientation or size) is the headline misconception here — a tilted square
// is NOT a different shape called a "diamond."

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: a turned square is not a different shape called "a diamond." */
function DiamondVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [pick1, setPick1] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = pick1 === "square";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Look at this shape.
      </p>
      <ShapeGlyph kind="square" rotation={45} tone="a" label="a tilted shape" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What shape is this, really?{" "}
          <select className="answer" value={pick1} onChange={(e) => setPick1(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="diamond">A diamond — turning it made it a new shape</option>
            <option value="square">Still a square — turning it never changes what shape it is</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? 'Correct — "diamond" is just a nickname some people use, but this is still a SQUARE. Turning a shape never changes what shape it is.'
            : "Not quite — count the sides: 4 equal sides and 4 corners, same as any other square. Turning it only changes which way it's facing."}
        </p>
      )}
    </div>
  );
}

/** Conflation: resizing a shape doesn't change what shape it is either. */
function ResizeConflationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Here is a big triangle and a tiny triangle.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <ShapeGlyph kind="triangle" scale={1.3} tone="b" label="a big shape" />
        <ShapeGlyph kind="triangle" scale={0.45} tone="c" label="a tiny shape" />
      </div>
      <p>True or false: they are both triangles, even though one is much bigger than the other.</p>
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
            ? "Correct — size never changes what shape something is. A tiny triangle and a giant triangle are both still triangles."
            : "Not quite — look at the corners and sides on each one. Both have exactly 3 sides and 3 corners, so both are triangles, no matter the size."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: the core K.G.2 claim, stated directly. */
function TurningTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: if you turn (rotate) a shape around, it becomes a different shape than it was before.
      </p>
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
            ? "Correct — turning a shape only changes which way it's facing. It's still the exact same shape."
            : "Not quite — turning a shape (even all the way to look tilted or upside down) never changes how many sides or corners it has, so it's never a different shape."}
        </p>
      )}
    </div>
  );
}

/** Vocabulary precision: "beside" (no overlap) vs "in front of" (overlapping). Both
 *  words live in the same question, per this unit's conflation-pair requirement. */
function BesideVsInFrontQuestion({ onComplete }: { onComplete?: () => void }) {
  const [hiddenPick, setHiddenPick] = useState("");
  const [wordPick, setWordPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [hiddenPick, wordPick].every((v) => String(v).trim() !== "");
  const hiddenOk = hiddenPick === "yes";
  const wordOk = wordPick === "inFrontOf";
  const ok = hiddenOk && wordOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> The cat is sitting so that part of the box is hidden behind it.
      </p>
      <PositionScene relation="inFrontOf" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Is any part of the box hidden from view?{" "}
          <select className="answer" value={hiddenPick} onChange={(e) => setHiddenPick(e.target.value)} style={fieldOk(hiddenOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label>
          So is the cat BESIDE the box, or IN FRONT OF the box?{" "}
          <select className="answer" value={wordPick} onChange={(e) => setWordPick(e.target.value)} style={fieldOk(wordOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="beside">Beside</option>
            <option value="inFrontOf">In front of</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? '"Beside" means next to, with nothing hidden — nothing overlaps. Here the box is partly hidden, so the cat is IN FRONT OF it, not beside it.'
            : 'When one object blocks part of another, that\'s "in front of" (or "behind" for the hidden one) — "beside" is for objects side-by-side with nothing hidden.'}
        </p>
      )}
    </div>
  );
}

function NamingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ diamond: false, resize: false, turning: false, besideVsFront: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure turning or resizing a shape never changes what it is, before you try practice problems.</p>
      <DiamondVocabQuestion onComplete={mark("diamond")} />
      <ResizeConflationQuestion onComplete={mark("resize")} />
      <TurningTrapQuestion onComplete={mark("turning")} />
      <BesideVsInFrontQuestion onComplete={mark("besideVsFront")} />
    </div>
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
        <p className="muted small">Pick a shape, then turn it or resize it. No matter what you do, it's still the same shape!</p>
        <div className="control-row">
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
        <p className="feedback good">This is still a {SHAPE_LABELS[kind]} — turning or resizing it never makes it a different shape!</p>
      </div>

      {(introActive || showCheck) && <NamingCheckForUnderstanding onComplete={onIntroDone} />}

      <div>
        <p className="muted small">Now place the ball somewhere around the box, and see which position word fits.</p>
        <div className="control-row">
          <Segmented label="Where's the ball?" value={relation} onChange={setRelation} options={RELATIONS.map((r) => ({ id: r, label: RELATION_LABELS[r] }))} />
          {relation === "beside" && <Segmented label="Which side" value={side} onChange={setSide} options={[{ id: "left", label: "Left" }, { id: "right", label: "Right" }]} />}
        </div>
        <div style={{ maxWidth: 220 }}>
          <PositionScene relation={relation} side={side} />
        </div>
        <p className="feedback good">The ball is {RELATION_LABELS[relation].toLowerCase()} the box.</p>
        <p className="muted small">"Beside" and "next to" mean the same thing — both describe objects side-by-side, with nothing hidden.</p>
      </div>
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
    visual: () => <ShapeGlyph kind={kind} rotation={rotation} scale={scale} tone="a" label="a shape to name" />,
    steps: [
      choice(
        { prompt: "What shape is this?", hint: "Count the sides and corners — that never changes, no matter how it's turned or sized.", explain: `This is a ${label}, no matter how it's turned or resized.` },
        label,
        shapeDistractors(kind, kind === "square")
      ),
      choice(
        {
          prompt: `If this ${label.toLowerCase()} were turned a completely different way, would it still be a ${label}?`,
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
