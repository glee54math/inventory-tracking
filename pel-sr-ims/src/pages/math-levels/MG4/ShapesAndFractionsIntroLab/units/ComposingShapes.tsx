import { useEffect, useMemo, useState } from "react";
import { ShapeCanvas, ShapeTile, SHAPE_NAMES, type ShapeKind } from "../diagrams/ShapeTile";
import { CompositeShape, COMPOSITE_TARGET_NAME, COMPOSITE_PIECES_LABEL, COMPOSITE_FAMILY, ALL_COMPOSITES, type CompositeKind } from "../diagrams/CompositeShape";
import { SolidTower, SOLID_NAMES, type SolidKind } from "../diagrams/SolidIcon";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { composingShapesTest } from "./ComposingShapesTest";

const ALL_PIECE_KINDS: ShapeKind[] = ["square", "rectangle", "triangle", "trapezoid", "circle", "halfCircle", "quarterCircle"];
const ALL_SOLID_KINDS: SolidKind[] = ["cube", "cone", "cylinder", "sphere"];

const SAME_REPEATED: CompositeKind[] = ALL_COMPOSITES.filter((k) => COMPOSITE_FAMILY[k] === "same-repeated");
const DIFFERENT_COMBO: CompositeKind[] = ALL_COMPOSITES.filter((k) => COMPOSITE_FAMILY[k] === "different-combo");

const COMPOSE_RECIPE: Record<CompositeKind, [ShapeKind, ShapeKind]> = {
  "rect-from-squares": ["square", "square"],
  "circle-from-halfcircles": ["halfCircle", "halfCircle"],
  "halfcircle-from-quartercircles": ["quarterCircle", "quarterCircle"],
  "square-from-triangles": ["triangle", "triangle"],
  "house-square-triangle": ["square", "triangle"],
  "door-rectangle-halfcircle": ["rectangle", "halfCircle"],
};
const COMPOSE_LABELS: Record<CompositeKind, string> = {
  "rect-from-squares": "Rectangle",
  "circle-from-halfcircles": "Circle",
  "halfcircle-from-quartercircles": "Half-circle",
  "square-from-triangles": "Square",
  "house-square-triangle": "House",
  "door-rectangle-halfcircle": "Door",
};

/** Singular shape name for a composite's two (identical, for same-repeated
 *  composites) pieces — used by the "same-repeated" bucket's second step. */
const PIECE_SINGULAR: Partial<Record<CompositeKind, string>> = {
  "rect-from-squares": "a square",
  "circle-from-halfcircles": "a half-circle",
  "halfcircle-from-quartercircles": "a quarter-circle",
  "square-from-triangles": "a triangle",
};

const multisetEq = (a: [ShapeKind, ShapeKind], b: [ShapeKind, ShapeKind]): boolean => (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0]);

function fieldStyle(ok: boolean, checked: boolean) {
  if (!checked) return {};
  return ok ? { borderColor: "var(--good)", background: "var(--good-soft)" } : { borderColor: "var(--bad)", background: "var(--bad-soft)" };
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["A composite shape", "A basic shape", "A fraction"];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What do we call a bigger shape made by putting basic shapes together?
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
          {ok ? "Right — a shape built out of basic shapes is called a composite shape." : "Not quite — think of the word for a shape made by COMBINING other shapes."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the plan's explicit required question: two different piece-combos
 *  building the SAME final composite shape. */
function TwoPathsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [choiceVal, setChoiceVal] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = choiceVal === "yes";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Ana builds a rectangle from 2 squares. Ben builds a same-size rectangle from 2 triangles.
      </p>
      <div className="control-row" style={{ gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <CompositeShape kind="rect-from-squares" width={120} height={70} label="Ana's rectangle, built from 2 squares" />
          <p className="muted small">Ana's rectangle</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <svg viewBox="0 0 120 70" width={120} style={{ maxWidth: "100%" }} role="img" aria-label="Ben's rectangle, built from 2 triangles">
            <polygon points="10,10 110,10 10,60" style={{ fill: "var(--qa-soft)", stroke: "var(--ink)", strokeWidth: 2.5 }} />
            <polygon points="110,10 110,60 10,60" style={{ fill: "var(--qb-soft)", stroke: "var(--ink)", strokeWidth: 2.5 }} />
          </svg>
          <p className="muted small">Ben's rectangle</p>
        </div>
      </div>
      <p>
        Are both of these still just "a rectangle"?{" "}
        <select className="answer" style={{ width: 100, ...fieldStyle(ok, checked) }} value={choiceVal} onChange={(e) => setChoiceVal(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="yes">Yes</option>
          <option value="no">No, they're different shapes</option>
        </select>
      </p>
      <button className="btn primary" type="button" onClick={() => setChecked(true)}>
        Check Answer
      </button>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Right — the same composite shape can be built from more than one combination of pieces. Both are rectangles."
            : "Not quite — look at the OUTSIDE edge of each shape, not just which pieces built it."}
        </p>
      )}
    </div>
  );
}

function ConflatedTermsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["Decompose", "Compose", "Partition into fourths"];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> <i>Compose</i> means putting basic shapes together to build a bigger shape. <i>Decompose</i> means taking a composite shape apart to see
        which basic shapes built it. If you SPLIT a rectangle back into 2 squares, which word describes what you just did?
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
          {ok ? "Right — taking a composite shape apart to find its pieces is decomposing it." : "Not quite — are you building a bigger shape, or taking one apart?"}
        </p>
      )}
    </div>
  );
}

function TrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"true" | "false" | null>(null);
  const ok = picked === "false";
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or False: a rectangle built from 2 squares is secretly a different shape than a same-size rectangle built from 2 triangles.
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
          {ok ? "False — however it was built, the outside shape is still just a rectangle." : "Not quite — how it was split up doesn't change what the final outside shape is."}
        </p>
      )}
    </div>
  );
}

function ComposingShapesCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ q1: false, q2: false, q3: false, q4: false });
  const allDone = done.q1 && done.q2 && done.q3 && done.q4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure composite shapes make sense before you try practice problems.</p>
      <VocabQuestion onComplete={() => setDone((d) => ({ ...d, q1: true }))} />
      <TwoPathsQuestion onComplete={() => setDone((d) => ({ ...d, q2: true }))} />
      <ConflatedTermsQuestion onComplete={() => setDone((d) => ({ ...d, q3: true }))} />
      <TrueFalseQuestion onComplete={() => setDone((d) => ({ ...d, q4: true }))} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

/** Drag-and-drop composing sandbox: pick a target composite, drag the 2
 *  correct basic pieces (out of a tray that also has 2 decoys) into the open
 *  slots. Uses native HTML drag-and-drop (not pixel-position SVG dragging)
 *  deliberately — slot/tray matching only needs to know WHICH piece kind was
 *  dropped where, not a precise drop coordinate, so this avoids coordinate
 *  math that can't be visually verified without a running browser. */
function ComposeSandbox() {
  const [targetKind, setTargetKind] = useState<CompositeKind>("rect-from-squares");
  const recipe = COMPOSE_RECIPE[targetKind];
  const [slot1, setSlot1] = useState<ShapeKind | null>(null);
  const [slot2, setSlot2] = useState<ShapeKind | null>(null);
  const [dragging, setDragging] = useState<ShapeKind | null>(null);

  useEffect(() => {
    setSlot1(null);
    setSlot2(null);
  }, [targetKind]);

  const tray = useMemo(() => {
    const decoyPool = ALL_PIECE_KINDS.filter((k) => k !== recipe[0] && k !== recipe[1]);
    const decoys = shuffle(decoyPool).slice(0, 2);
    return shuffle([recipe[0], recipe[1], ...decoys]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKind]);

  const filled = slot1 !== null && slot2 !== null;
  const correct = filled && multisetEq([slot1, slot2], recipe);

  const dropInto = (which: 1 | 2) => {
    if (!dragging) return;
    if (which === 1) setSlot1(dragging);
    else setSlot2(dragging);
    setDragging(null);
  };

  const renderSlot = (which: 1 | 2) => {
    const filledKind = which === 1 ? slot1 : slot2;
    return (
      <div
        key={which}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => dropInto(which)}
        style={{
          width: 72,
          height: 72,
          border: `2px dashed ${correct ? "var(--good)" : "var(--line)"}`,
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--card)",
        }}
      >
        {filledKind ? (
          <ShapeCanvas width={60} height={60} label={SHAPE_NAMES[filledKind]}>
            <ShapeTile kind={filledKind} cx={30} cy={30} size={22} />
          </ShapeCanvas>
        ) : (
          <span className="muted small">Drop here</span>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Segmented label="Build a" value={targetKind} onChange={setTargetKind} options={ALL_COMPOSITES.map((k) => ({ id: k, label: COMPOSE_LABELS[k] }))} />
      <p className="muted small">Drag 2 pieces from the tray below into the empty slots to build a {COMPOSITE_TARGET_NAME[targetKind]}.</p>
      <div className="control-row">
        {tray.map((k, i) => (
          <div key={i} draggable onDragStart={() => setDragging(k)} onDragEnd={() => setDragging(null)} style={{ cursor: "grab" }} aria-label={`Drag a ${SHAPE_NAMES[k]}`}>
            <ShapeCanvas width={56} height={56} label={SHAPE_NAMES[k]}>
              <ShapeTile kind={k} cx={28} cy={28} size={20} />
            </ShapeCanvas>
          </div>
        ))}
      </div>
      <div className="control-row">{[1, 2].map((n) => renderSlot(n as 1 | 2))}</div>
      {filled && !correct && (
        <p className="feedback bad" role="alert">
          Not quite a {COMPOSITE_TARGET_NAME[targetKind]} yet — drag a different piece on top of a slot to swap it.
        </p>
      )}
      {correct && (
        <div className="align-stack-wrap">
          <p className="feedback good" role="alert">
            You built a {COMPOSITE_TARGET_NAME[targetKind]}, from {COMPOSITE_PIECES_LABEL[targetKind].toLowerCase()}!
          </p>
          <CompositeShape kind={targetKind} width={150} height={120} />
        </div>
      )}
    </div>
  );
}

function SolidSandbox() {
  const [bottom, setBottom] = useState<SolidKind>("cube");
  const [top, setTop] = useState<SolidKind>("cone");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p className="muted small">1.G.2 also covers stacking 3D solids into a bigger composite. Pick two to stack.</p>
      <div className="control-row">
        <Segmented label="Bottom solid" value={bottom} onChange={setBottom} options={ALL_SOLID_KINDS.map((k) => ({ id: k, label: SOLID_NAMES[k] }))} />
        <Segmented label="Top solid" value={top} onChange={setTop} options={ALL_SOLID_KINDS.map((k) => ({ id: k, label: SOLID_NAMES[k] }))} />
      </div>
      <SolidTower solids={[bottom, top]} />
      <p className="muted small">
        This tower is made of a {SOLID_NAMES[bottom]} and a {SOLID_NAMES[top]} stacked together.
      </p>
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
      {(introActive || showCheck) && <ComposingShapesCheck onComplete={onIntroDone} />}
      <ComposeSandbox />
      <SolidSandbox />
    </div>
  );
}

// ============================================================================
// PRACTICE — one ProblemType per bucket
// ============================================================================

function sameRepeatedProblem(): Problem {
  const kind = pick(SAME_REPEATED);
  const others = shuffle(ALL_COMPOSITES.filter((k) => k !== kind)).slice(0, 2);
  const singular = PIECE_SINGULAR[kind]!;
  // Drawn only from the OTHER same-repeated composites (never a different-
  // combo one) so every distractor here is a genuine, distinct singular
  // shape name — no risk of two distractors (or a distractor and the
  // correct answer) colliding on the same fallback text.
  const wrongSingulars = shuffle(SAME_REPEATED.filter((k) => k !== kind))
    .slice(0, 2)
    .map((k) => PIECE_SINGULAR[k]!);

  return {
    title: `Building a ${COMPOSITE_TARGET_NAME[kind]}`,
    bucket: "same-repeated",
    story: `This ${COMPOSITE_TARGET_NAME[kind]} was built from 2 basic pieces that are the SAME shape as each other.`,
    visual: () => <CompositeShape kind={kind} width={150} height={120} />,
    steps: [
      choice(
        {
          prompt: `Which two pieces make this ${COMPOSITE_TARGET_NAME[kind]}?`,
          hint: "Look at the line splitting it into 2 pieces.",
          explain: `${COMPOSITE_PIECES_LABEL[kind]} make this ${COMPOSITE_TARGET_NAME[kind]}.`,
        },
        COMPOSITE_PIECES_LABEL[kind],
        others.map((k) => COMPOSITE_PIECES_LABEL[k])
      ),
      choice(
        {
          prompt: "Both pieces here are the same shape as each other. Which shape is it?",
          hint: "Look at just one of the 2 pieces.",
          explain: `Each piece is ${singular}.`,
        },
        singular,
        wrongSingulars
      ),
    ],
    wrapUp: `A ${COMPOSITE_TARGET_NAME[kind]} made from 2 pieces that are both ${singular.replace(/^a /, "")}s.`,
  };
}

function differentComboProblem(): Problem {
  const kind = pick(DIFFERENT_COMBO);
  const others = shuffle(ALL_COMPOSITES.filter((k) => k !== kind)).slice(0, 2);

  return {
    title: `Building a ${COMPOSITE_TARGET_NAME[kind]}`,
    bucket: "different-combo",
    story: `This ${COMPOSITE_TARGET_NAME[kind]} was built from 2 basic pieces that are DIFFERENT shapes from each other.`,
    visual: () => <CompositeShape kind={kind} width={150} height={120} />,
    steps: [
      choice(
        {
          prompt: `Which two shapes make this ${COMPOSITE_TARGET_NAME[kind]}?`,
          hint: "Look at the line splitting it into 2 pieces.",
          explain: `${COMPOSITE_PIECES_LABEL[kind]} make this ${COMPOSITE_TARGET_NAME[kind]}.`,
        },
        COMPOSITE_PIECES_LABEL[kind],
        others.map((k) => COMPOSITE_PIECES_LABEL[k])
      ),
      choice(
        {
          prompt: "Are the 2 pieces that make this shape the SAME shape as each other, or DIFFERENT shapes?",
          hint: "Look at the 2 pieces again.",
          explain: `${COMPOSITE_PIECES_LABEL[kind]} are two different shapes.`,
        },
        "Different shapes",
        ["The same shape"]
      ),
    ],
    wrapUp: `A ${COMPOSITE_TARGET_NAME[kind]} made from ${COMPOSITE_PIECES_LABEL[kind].toLowerCase()}.`,
  };
}

function decomposeProblem(): Problem {
  const kind = pick(ALL_COMPOSITES);
  const others = shuffle(ALL_COMPOSITES.filter((k) => k !== kind)).slice(0, 2);

  return {
    title: `Take this shape apart`,
    bucket: "decompose",
    story: `Here's a composite ${COMPOSITE_TARGET_NAME[kind]} someone already built.`,
    visual: () => <CompositeShape kind={kind} width={150} height={120} />,
    steps: [
      choice(
        {
          prompt: `Which basic shapes were used to build this ${COMPOSITE_TARGET_NAME[kind]}?`,
          hint: "Look at where the inside line splits it into pieces.",
          explain: `${COMPOSITE_PIECES_LABEL[kind]} were used to build this ${COMPOSITE_TARGET_NAME[kind]}.`,
        },
        COMPOSITE_PIECES_LABEL[kind],
        others.map((k) => COMPOSITE_PIECES_LABEL[k])
      ),
      choice(
        {
          prompt: `True or False: this exact ${COMPOSITE_TARGET_NAME[kind]} could also be built a different way, from different basic pieces.`,
          hint: "There's often more than one way to cut a shape into pieces.",
          explain: `True — a ${COMPOSITE_TARGET_NAME[kind]} like this can usually be built more than one way; which pieces you see here is just one way it happened to be split.`,
        },
        "True",
        ["False"]
      ),
    ],
    wrapUp: `${COMPOSITE_PIECES_LABEL[kind]} build this ${COMPOSITE_TARGET_NAME[kind]}.`,
  };
}

function solidTowerProblem(): Problem {
  const [bottom, top] = (() => {
    const b = pick(ALL_SOLID_KINDS);
    let t = pick(ALL_SOLID_KINDS);
    while (t === b) t = pick(ALL_SOLID_KINDS);
    return [b, t];
  })();
  const correctLabel = `A ${SOLID_NAMES[bottom]} and a ${SOLID_NAMES[top]}`;
  // One distractor PER UNORDERED solid pair (so "a cone and a cube" and "a
  // cube and a cone" never both show up as two separately-worded wrong
  // answers for what is really the same wrong set of solids).
  const seenSets = new Set<string>([[bottom, top].sort().join("|")]);
  const otherPairs = shuffle(ALL_SOLID_KINDS.flatMap((a) => ALL_SOLID_KINDS.filter((b) => b !== a).map((b) => [a, b] as [SolidKind, SolidKind]))).filter(([a, b]) => {
    const key = [a, b].sort().join("|");
    if (seenSets.has(key)) return false;
    seenSets.add(key);
    return true;
  });
  const distractorLabels = otherPairs.slice(0, 2).map(([a, b]) => `A ${SOLID_NAMES[a]} and a ${SOLID_NAMES[b]}`);

  return {
    title: "Stacking 3D solids",
    bucket: "3d",
    story: "This tower was built by stacking 2 solid shapes.",
    visual: () => <SolidTower solids={[bottom, top]} />,
    steps: [
      {
        kind: "number",
        prompt: "How many solid shapes were stacked to make this tower?",
        hint: "Count the layers.",
        explain: "2 solids were stacked.",
        answer: 2,
      },
      choice(
        {
          prompt: "Which two solid shapes were stacked to make this tower?",
          hint: "Look at the bottom layer, then the top layer.",
          explain: `${correctLabel} were stacked.`,
        },
        correctLabel,
        distractorLabels
      ),
    ],
    wrapUp: `${correctLabel}, stacked into one tower.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <CompositeShape kind="house-square-triangle" width={130} height={110} />;
}

export const composingShapes: Unit = {
  id: "composingShapes",
  title: "Composing Shapes",
  goal: "Put basic shapes together to build a bigger composite shape, and recognize which basic shapes were used to build a given composite.",
  standard: "1.G.2",
  keyIdea: (
    <>
      <p>A composite shape is a bigger shape built by putting basic shapes together — like 2 squares side by side making a rectangle.</p>
      <p>The same composite shape can often be built more than one way, from different basic pieces — it's still the same final shape either way.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "Same shape, repeated", make: sameRepeatedProblem, buckets: ["same-repeated"] },
    { label: "Different shapes combined", make: differentComboProblem, buckets: ["different-combo"] },
    { label: "Take it apart", make: decomposeProblem, buckets: ["decompose"] },
    { label: "3D towers", make: solidTowerProblem, buckets: ["3d"] },
  ],
  requiredBuckets: ["same-repeated", "different-combo", "decompose", "3d"],
  test: composingShapesTest,
};
