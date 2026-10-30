import { useEffect, useState } from "react";
import { ShapeCanvas, ShapeTile, CubeGlyph, DEFINING_ATTRIBUTE, CUBE_DEFINING_ATTRIBUTE, SHAPE_NAMES, SHAPE_KINDS, SHAPE_COLORS, SHAPE_COLOR_NAMES, VARIANT_COUNT, type ShapeKind } from "../diagrams/ShapeTile";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { classifyingShapesTest } from "./ClassifyingShapesByAttributesTest";

const ROTATIONS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300, 330];

function randomColorIdx() {
  return randInt(0, SHAPE_COLORS.length - 1);
}

function randomVariant(kind: ShapeKind, irregularOnly = false) {
  const max = VARIANT_COUNT[kind];
  return irregularOnly ? randInt(1, max - 1) : randInt(0, max - 1);
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function fieldStyle(ok: boolean, checked: boolean) {
  if (!checked) return {};
  return ok ? { borderColor: "var(--good)", background: "var(--good-soft)" } : { borderColor: "var(--bad)", background: "var(--bad-soft)" };
}

/** Q1 — vocabulary: what makes a fixed hexagon a hexagon. */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["It has 6 straight sides and 6 angles.", "It's green.", "It's pointing a certain way."];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What makes this shape a hexagon?
      </p>
      <ShapeCanvas width={110} height={110} label="A green hexagon">
        <ShapeTile kind="hexagon" cx={55} cy={55} size={38} rotation={0} color={SHAPE_COLORS[2]} />
      </ShapeCanvas>
      <div className="choices" role="group">
        {options.map((o, i) => (
          <button key={i} className="choice" onClick={() => setPicked(i)} disabled={ok} style={fieldStyle(i === 0, picked === i)}>
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Right — the number of straight sides and angles is what makes a hexagon a hexagon." : "Not quite — think about what every hexagon has, no matter what it looks like."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the SAME category shown two very different (irregular, rotated,
 *  resized) ways, via a two-blank dropdown sentence. */
function SameCategoryQuestion({ onComplete }: { onComplete?: () => void }) {
  const [same, setSame] = useState("");
  const [different, setDifferent] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [same, different].every((v) => String(v).trim() !== "");
  const okSame = same === "sides";
  const okDifferent = different === "look";
  const ok = okSame && okDifferent;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Shape A and Shape B below are both pentagons.
      </p>
      <div className="control-row" style={{ gap: 20 }}>
        <ShapeCanvas width={90} height={90} label="Shape A: a small, regular red pentagon">
          <ShapeTile kind="pentagon" cx={45} cy={48} size={26} variant={0} rotation={0} color={SHAPE_COLORS[0]} />
        </ShapeCanvas>
        <ShapeCanvas width={120} height={120} label="Shape B: a large, irregular purple pentagon, rotated">
          <ShapeTile kind="pentagon" cx={60} cy={60} size={46} variant={2} rotation={95} color={SHAPE_COLORS[3]} />
        </ShapeCanvas>
      </div>
      <p>
        Both are still pentagons because they both have the same{" "}
        <select className="answer" style={{ width: 120, ...fieldStyle(okSame, checked) }} value={same} onChange={(e) => setSame(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="sides">number of sides and angles</option>
          <option value="color">color</option>
        </select>
        , even though they{" "}
        <select className="answer" style={{ width: 230, ...fieldStyle(okDifferent, checked) }} value={different} onChange={(e) => setDifferent(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="look">are different sizes and turned differently, and one is a lopsided shape</option>
          <option value="shape">are actually two different shapes</option>
        </select>
        .
      </p>
      <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
        Check Answer
      </button>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Right — 5 sides and 5 angles is what matters; size, lopsidedness, and which way it's turned don't."
            : "Not quite — look again at what's actually the SAME between Shape A and Shape B."}
        </p>
      )}
    </div>
  );
}

/** Q3 — generalization / true-false trap: does irregularity/orientation
 *  disqualify a shape from its category? */
function TrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"true" | "false" | null>(null);
  const ok = picked === "false";
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: a shape stops being a pentagon if it's lopsided (irregular) or turned sideways.
      </p>
      <div className="control-row" style={{ gap: 20 }}>
        <ShapeCanvas width={80} height={80} label="A small, regular, upright pentagon">
          <ShapeTile kind="pentagon" cx={40} cy={42} size={26} variant={0} rotation={0} color={SHAPE_COLORS[1]} />
        </ShapeCanvas>
        <ShapeCanvas width={120} height={120} label="A larger, lopsided pentagon, rotated">
          <ShapeTile kind="pentagon" cx={60} cy={60} size={44} variant={1} rotation={140} color={SHAPE_COLORS[4]} />
        </ShapeCanvas>
      </div>
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
            ? "False — both shapes above are pentagons. 5 sides and 5 angles is what counts; being lopsided or turned doesn't change that."
            : "Not quite — both shapes above have 5 straight sides and 5 angles. Does being lopsided or turned change that count?"}
        </p>
      )}
    </div>
  );
}

/** Q4 — the required 2D-attribute-count vs 3D-face-count conflation check. */
function CubeVs2DQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["6 matching square faces, all the same size.", "4 straight sides.", "It's a certain color."];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> What makes this shape a cube?
      </p>
      <ShapeCanvas width={120} height={120} label="A cube">
        <CubeGlyph cx={60} cy={60} size={32} color={SHAPE_COLORS[1]} />
      </ShapeCanvas>
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
            ? "Right — a cube is a SOLID (3D) shape, so what counts is its faces, not a flat side count like a 2D shape has."
            : "Not quite — a cube is a solid shape with FACES, not flat sides like a 2D pentagon or hexagon. Which choice talks about faces?"}
        </p>
      )}
    </div>
  );
}

function ClassifyingCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ q1: false, q2: false, q3: false, q4: false });
  const allDone = done.q1 && done.q2 && done.q3 && done.q4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure you can tell what REALLY makes a shape that shape before you try practice problems.</p>
      <VocabQuestion onComplete={() => setDone((d) => ({ ...d, q1: true }))} />
      <SameCategoryQuestion onComplete={() => setDone((d) => ({ ...d, q2: true }))} />
      <TrueFalseQuestion onComplete={() => setDone((d) => ({ ...d, q3: true }))} />
      <CubeVs2DQuestion onComplete={() => setDone((d) => ({ ...d, q4: true }))} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [kind, setKind] = useState<ShapeKind>("triangle");
  const [variant, setVariant] = useState(0);
  const [size, setSize] = useState(42);
  const [rotation, setRotation] = useState(0);
  const [colorIdx, setColorIdx] = useState(1);
  const [showCube, setShowCube] = useState(false);

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
      {(introActive || showCheck) && <ClassifyingCheck onComplete={onIntroDone} />}
      <Segmented
        label="What to explore"
        value={showCube ? "cube" : "flat"}
        onChange={(v) => setShowCube(v === "cube")}
        options={[{ id: "flat", label: "Flat (2D) shapes" }, { id: "cube", label: "A cube (3D)" }]}
      />
      {!showCube && (
        <>
          <Segmented label="Shape" value={kind} onChange={(k) => { setKind(k); setVariant(0); }} options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_NAMES[k][0].toUpperCase() + SHAPE_NAMES[k].slice(1) }))} />
          <div className="control-row">
            <Stepper label="Size" value={size} min={24} max={60} step={6} onChange={setSize} tone="a" />
            <Stepper label="Turn" value={rotation} min={0} max={345} step={15} onChange={setRotation} tone="b" />
            <Stepper label="Lopsided-ness" value={variant} min={0} max={VARIANT_COUNT[kind] - 1} step={1} onChange={setVariant} tone="c" />
          </div>
          <div className="control-row">
            {SHAPE_COLORS.map((c, i) => (
              <button
                key={c}
                type="button"
                aria-label={`Color: ${SHAPE_COLOR_NAMES[i]}`}
                onClick={() => setColorIdx(i)}
                style={{ width: 34, height: 34, borderRadius: "50%", background: c, border: colorIdx === i ? "3px solid var(--ink)" : "2px solid var(--line)", cursor: "pointer" }}
              />
            ))}
          </div>
          <ShapeCanvas width={160} height={160} label={`A ${SHAPE_COLOR_NAMES[colorIdx]} ${SHAPE_NAMES[kind]}, size ${size}, turned ${rotation} degrees`}>
            <ShapeTile kind={kind} cx={80} cy={80} size={size} variant={variant} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
          </ShapeCanvas>
          <p className="muted small">
            A {SHAPE_NAMES[kind]} always has: <b>{DEFINING_ATTRIBUTE[kind]}</b>. Try the Size, Turn, and Lopsided-ness controls, and tapping a different color —
            notice the shape stays a {SHAPE_NAMES[kind]} the whole time. Size, color, orientation, and even how regular it looks never change what shape something is.
          </p>
        </>
      )}
      {showCube && (
        <>
          <ShapeCanvas width={160} height={160} label="A cube">
            <CubeGlyph cx={80} cy={80} size={size > 50 ? 44 : 34} color={SHAPE_COLORS[colorIdx]} />
          </ShapeCanvas>
          <p className="muted small">
            A cube always has: <b>{CUBE_DEFINING_ATTRIBUTE}</b>. A cube is a SOLID (3D) shape — it has FACES, not flat sides the way a 2D pentagon or hexagon does.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PRACTICE — one ProblemType per bucket
// ============================================================================

function identify2dProblem(): Problem {
  const kind = pick(SHAPE_KINDS);
  const variant = randomVariant(kind);
  const rotation = pick(ROTATIONS);
  const size = randInt(26, 56);
  const colorIdx = randomColorIdx();
  const colorName = SHAPE_COLOR_NAMES[colorIdx];

  let variant2 = randomVariant(kind);
  let rotation2 = pick(ROTATIONS);
  let colorIdx2 = randomColorIdx();
  while (variant2 === variant && rotation2 === rotation) {
    variant2 = randomVariant(kind);
    rotation2 = pick(ROTATIONS);
    colorIdx2 = randomColorIdx();
  }

  return {
    title: `What makes a ${SHAPE_NAMES[kind]} a ${SHAPE_NAMES[kind]}?`,
    bucket: "identify2d",
    story: `Look at the ${colorName} ${SHAPE_NAMES[kind]} below.`,
    visual: (done: number) => (
      <div style={{ display: "flex", gap: 16 }}>
        <ShapeCanvas width={120} height={120} label={`A ${colorName} ${SHAPE_NAMES[kind]}`}>
          <ShapeTile kind={kind} cx={60} cy={60} size={size} variant={variant} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
        </ShapeCanvas>
        {done >= 1 && (
          <ShapeCanvas width={120} height={120} label={`A second ${SHAPE_NAMES[kind]}, different look`}>
            <ShapeTile kind={kind} cx={60} cy={60} size={size} variant={variant2} rotation={rotation2} color={SHAPE_COLORS[colorIdx2]} />
          </ShapeCanvas>
        )}
      </div>
    ),
    steps: [
      choice(
        { prompt: `What makes this shape a ${SHAPE_NAMES[kind]}?`, hint: `Think about what's true of EVERY ${SHAPE_NAMES[kind]}, no matter its size or color.`, explain: DEFINING_ATTRIBUTE[kind] },
        DEFINING_ATTRIBUTE[kind],
        [`It's ${colorName}.`, "It's this exact size."]
      ),
      choice(
        { prompt: `Here's another shape, a different size and color and turned a different way. Is it ALSO a ${SHAPE_NAMES[kind]}?`, hint: "Check its side/angle count, not how it looks.", explain: `Yes — it still has ${DEFINING_ATTRIBUTE[kind]}, so it's still a ${SHAPE_NAMES[kind]}.` },
        "Yes, it's still a " + SHAPE_NAMES[kind] + ".",
        ["No, it's turned a different way.", "No, it's a different color."]
      ),
    ],
    wrapUp: `Both shapes are ${SHAPE_NAMES[kind]}s — size, color, and turn never change what shape something is.`,
  };
}

function identifyCubeProblem(): Problem {
  const colorIdx = randomColorIdx();
  const colorName = SHAPE_COLOR_NAMES[colorIdx];

  return {
    title: "What makes a cube a cube?",
    bucket: "identify-cube",
    story: `Look at the ${colorName} solid shape below.`,
    visual: () => (
      <ShapeCanvas width={130} height={130} label={`A ${colorName} cube`}>
        <CubeGlyph cx={65} cy={65} size={36} color={SHAPE_COLORS[colorIdx]} />
      </ShapeCanvas>
    ),
    steps: [
      choice(
        { prompt: "What makes this shape a cube?", hint: "A cube is a SOLID (3D) shape, so think about its faces, not a flat side count.", explain: CUBE_DEFINING_ATTRIBUTE },
        CUBE_DEFINING_ATTRIBUTE,
        [`It's ${colorName}.`, "It has 4 straight sides."]
      ),
      choice(
        { prompt: "Is a cube a flat (2D) shape or a solid (3D) shape?", hint: "Does it have depth, or is it completely flat?", explain: "A cube is a solid (3D) shape — it has faces, edges, and depth." },
        "A solid (3D) shape",
        ["A flat (2D) shape"]
      ),
    ],
    wrapUp: "A cube is a solid shape with 6 matching square faces.",
  };
}

function multiAttributeProblem(): Problem {
  // One quadrilateral candidate (variant 0 = regular = all sides equal) is
  // the only one satisfying BOTH constraints at once; the rest fail on the
  // equal-sides half even though they all still have 4 sides/angles.
  const kind: ShapeKind = "quadrilateral";
  const correctVariant = 0;
  const wrongVariants = shuffle([1, 2, 3]).slice(0, 2);
  const allVariants = shuffle([correctVariant, ...wrongVariants]);
  const letters = ["A", "B", "C"];
  const correctIdx = allVariants.indexOf(correctVariant);
  const candidates = allVariants.map((v) => ({ variant: v, rotation: pick(ROTATIONS), size: randInt(28, 50), colorIdx: randomColorIdx() }));

  return {
    title: "Match two attributes at once",
    bucket: "multi-attribute",
    story: "Which shape (A-C) has 4 straight sides AND all 4 sides the same length — no matter its size, color, or which way it's turned?",
    visual: () => (
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {candidates.map((c, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <ShapeCanvas width={90} height={90} label={`Shape ${letters[i]}: a quadrilateral`}>
              <ShapeTile kind={kind} cx={45} cy={45} size={c.size} variant={c.variant} rotation={c.rotation} color={SHAPE_COLORS[c.colorIdx]} />
            </ShapeCanvas>
            <b>{letters[i]}</b>
          </div>
        ))}
      </div>
    ),
    steps: [
      choice(
        { prompt: "Which shapes (A-C) have 4 straight sides?", hint: "They're all quadrilaterals — count sides on each.", explain: "All 3 shapes have 4 straight sides — every quadrilateral does." },
        "All of them (A, B, and C)",
        ["Only one of them", "None of them"]
      ),
      choice(
        {
          prompt: `Now which ONE (A-C) ALSO has all 4 sides the same length?`,
          hint: "Having 4 sides isn't enough this time — also check whether the sides match each other in length.",
          explain: `Shape ${letters[correctIdx]} has 4 straight sides AND all 4 sides are the same length. The other shapes have 4 sides, but the sides aren't all equal.`,
        },
        letters[correctIdx],
        letters.filter((_, i) => i !== correctIdx)
      ),
    ],
    wrapUp: `Shape ${letters[correctIdx]} matches both: 4 straight sides, and all of them the same length.`,
  };
}

function irregularTrapProblem(): Problem {
  const kind = pick(SHAPE_KINDS.filter((k) => k !== "triangle")); // widest variant gallery
  const variant = randomVariant(kind, true);
  const rotation = pick(ROTATIONS.filter((r) => r !== 0));
  const size = randInt(30, 56);
  const colorIdx = randomColorIdx();
  const colorName = SHAPE_COLOR_NAMES[colorIdx];

  return {
    title: "Does lopsided mean it's not really that shape?",
    bucket: "irregular-trap",
    story: `Someone says: "This isn't really a ${SHAPE_NAMES[kind]} — it looks too lopsided and weird."`,
    visual: () => (
      <ShapeCanvas width={140} height={120} label={`A ${colorName}, lopsided ${SHAPE_NAMES[kind]}`}>
        <ShapeTile kind={kind} cx={70} cy={60} size={size} variant={variant} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
      </ShapeCanvas>
    ),
    steps: [
      choice(
        { prompt: "Are they right?", hint: `Count the straight sides and angles — does this shape have the ${SHAPE_NAMES[kind]}'s count?`, explain: `It's still a ${SHAPE_NAMES[kind]}: ${DEFINING_ATTRIBUTE[kind]}, even though it's an unusual, lopsided example.` },
        `No — it still has ${DEFINING_ATTRIBUTE[kind]}, so it's still a ${SHAPE_NAMES[kind]}.`,
        [`Yes — a real ${SHAPE_NAMES[kind]} has to look even and regular.`, `Yes — it's turned the wrong way to count.`]
      ),
      choice(
        { prompt: `What WOULD make this NOT a ${SHAPE_NAMES[kind]}?`, hint: "Think about the count, not the look.", explain: `Only a different number of straight sides/angles would change what shape this is — not how even or regular it looks.` },
        "Having a different number of sides and angles",
        ["Looking lopsided or uneven", "Being turned a different way"]
      ),
    ],
    wrapUp: `Still a ${SHAPE_NAMES[kind]} — lopsided or "weird-looking" doesn't change the side/angle count.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <ShapeCanvas width={90} height={90} label="A small blue pentagon">
        <ShapeTile kind="pentagon" cx={45} cy={48} size={30} variant={0} rotation={0} color={SHAPE_COLORS[1]} />
      </ShapeCanvas>
      <ShapeCanvas width={90} height={90} label="A cube">
        <CubeGlyph cx={45} cy={45} size={24} color={SHAPE_COLORS[2]} />
      </ShapeCanvas>
    </div>
  );
}

export const classifyingShapes: Unit = {
  id: "classifyingShapes",
  title: "Classifying Shapes by Attributes",
  goal: "Name a shape by counting its angles/sides, tell a cube apart by its matching faces, and figure out what shape must have given a description.",
  standard: "2.G.1",
  keyIdea: (
    <>
      <p>
        A flat shape's NAME depends only on its number of straight sides and angles — triangle (3), quadrilateral (4), pentagon (5), hexagon (6). A solid
        shape like a cube is named by its FACES instead — a cube has 6 matching square faces.
      </p>
      <p>Color, size, which way a shape is turned, and even how lopsided or regular it looks are never what makes it that shape.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "What makes it that shape?", make: identify2dProblem, buckets: ["identify2d"] },
    { label: "Is it a cube?", make: identifyCubeProblem, buckets: ["identify-cube"] },
    { label: "Match two attributes", make: multiAttributeProblem, buckets: ["multi-attribute"] },
    { label: "Lopsided-shape traps", make: irregularTrapProblem, buckets: ["irregular-trap"] },
  ],
  requiredBuckets: ["identify2d", "identify-cube", "multi-attribute", "irregular-trap"],
  test: classifyingShapesTest,
};
