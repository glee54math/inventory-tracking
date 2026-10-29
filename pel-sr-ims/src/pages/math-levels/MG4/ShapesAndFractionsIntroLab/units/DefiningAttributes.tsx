import { useEffect, useState } from "react";
import { ShapeCanvas, ShapeTile, DEFINING_ATTRIBUTE, SHAPE_NAMES, SHAPE_COLORS, SHAPE_COLOR_NAMES, type ShapeKind } from "../diagrams/ShapeTile";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { definingAttributesTest } from "./DefiningAttributesTest";

const CATEGORIES: ShapeKind[] = ["triangle", "square", "rectangle", "circle"];
const ROTATIONS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300, 330];

/** Short, choice-option-sized phrasing of DEFINING_ATTRIBUTE — long enough to
 *  be clearly right, short enough to sit next to two one-line distractors. */
const SHORT_ATTRIBUTE: Record<ShapeKind, string> = {
  triangle: "It has 3 straight sides.",
  square: "It has 4 equal-length straight sides and 4 square corners.",
  rectangle: "It has 4 straight sides and 4 square corners.",
  trapezoid: "It has 4 straight sides, with one pair running the same direction.",
  circle: "It has one curved edge and no straight sides.",
  halfCircle: "It has one curved edge and one straight edge.",
  quarterCircle: "It has one curved edge and two straight edges meeting in a square corner.",
};

function randomColorIdx() {
  return randInt(0, SHAPE_COLORS.length - 1);
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function fieldStyle(ok: boolean, checked: boolean) {
  if (!checked) return {};
  return ok ? { borderColor: "var(--good)", background: "var(--good-soft)" } : { borderColor: "var(--bad)", background: "var(--bad-soft)" };
}

/** Q1 — vocabulary: what makes a fixed triangle a triangle. */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["It has 3 straight sides.", "It's blue.", "It's pointing up."];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What makes this shape a triangle?
      </p>
      <ShapeCanvas width={100} height={100} label="An upright blue triangle">
        <ShapeTile kind="triangle" cx={50} cy={55} size={38} rotation={0} color={SHAPE_COLORS[1]} />
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
          {ok ? "Right — the number of straight sides is what makes a triangle a triangle." : "Not quite — think about what every triangle has, no matter what it looks like."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the SAME category in two very different orientations/sizes/colors,
 *  in one question (the plan's explicit required CFU shape), via a two-blank
 *  dropdown sentence — same pattern as CoordinatePlaneUnit's ReflectionFormulaQuestion. */
function SameCategoryQuestion({ onComplete }: { onComplete?: () => void }) {
  const [same, setSame] = useState("");
  const [different, setDifferent] = useState("");
  const [checked, setChecked] = useState(false);
  const okSame = same === "sides";
  const okDifferent = different === "look";
  const ok = okSame && okDifferent;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Shape A and Shape B below are both triangles.
      </p>
      <div className="control-row" style={{ gap: 20 }}>
        <ShapeCanvas width={90} height={90} label="Shape A: a small red triangle">
          <ShapeTile kind="triangle" cx={45} cy={50} size={26} rotation={0} color={SHAPE_COLORS[0]} />
        </ShapeCanvas>
        <ShapeCanvas width={110} height={110} label="Shape B: a large purple triangle rotated sideways">
          <ShapeTile kind="triangle" cx={55} cy={55} size={48} rotation={110} color={SHAPE_COLORS[3]} />
        </ShapeCanvas>
      </div>
      <p>
        Both are still triangles because they both have the same{" "}
        <select className="answer" style={{ width: 110, ...fieldStyle(okSame, checked) }} value={same} onChange={(e) => setSame(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="sides">number of straight sides</option>
          <option value="color">color</option>
        </select>
        , even though they{" "}
        <select className="answer" style={{ width: 170, ...fieldStyle(okDifferent, checked) }} value={different} onChange={(e) => setDifferent(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="look">are different sizes, colors, and turned differently</option>
          <option value="shape">are actually two different shapes</option>
        </select>
        .
      </p>
      <button className="btn primary" type="button" onClick={() => setChecked(true)}>
        Check Answer
      </button>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Right — 3 straight sides is what matters; size, color, and which way it's turned don't." : "Not quite — look again at what's actually the SAME between Shape A and Shape B."}
        </p>
      )}
    </div>
  );
}

/** Q3 — generalization / true-false trap. */
function TrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"true" | "false" | null>(null);
  const ok = picked === "false";
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: a shape stops being a square if you make it bigger or turn it sideways.
      </p>
      <div className="control-row" style={{ gap: 20 }}>
        <ShapeCanvas width={80} height={80} label="A small upright square">
          <ShapeTile kind="square" cx={40} cy={40} size={26} rotation={0} color={SHAPE_COLORS[1]} />
        </ShapeCanvas>
        <ShapeCanvas width={110} height={110} label="A larger square turned like a diamond">
          <ShapeTile kind="square" cx={55} cy={55} size={42} rotation={45} color={SHAPE_COLORS[4]} />
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
            ? "False — both shapes above are squares. 4 equal sides and 4 square corners is what counts; size and which way it's turned don't."
            : "Not quite — both shapes above have 4 equal straight sides and 4 square corners. Does being bigger or turned change that?"}
        </p>
      )}
    </div>
  );
}

/** Q4 — explicit non-defining-attribute trap. */
function NonDefiningTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["It's red.", "It has 3 straight sides.", "Its sides are straight."];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Which one of these describes the shape below, but does NOT make it a triangle?
      </p>
      <ShapeCanvas width={120} height={100} label="A thin, tilted red triangle">
        <ShapeTile kind="triangle" cx={60} cy={55} size={44} rotation={135} color={SHAPE_COLORS[0]} />
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
          {ok ? "Right — color is just how it looks. 3 straight sides is what makes it a triangle, no matter the color." : "Not quite — which one of those is true of EVERY triangle, no matter its color?"}
        </p>
      )}
    </div>
  );
}

function DefiningAttributesCheck({ onComplete }: { onComplete?: () => void }) {
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
      <NonDefiningTrapQuestion onComplete={() => setDone((d) => ({ ...d, q4: true }))} />
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
  const [size, setSize] = useState(42);
  const [rotation, setRotation] = useState(0);
  const [colorIdx, setColorIdx] = useState(1);

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
      {(introActive || showCheck) && <DefiningAttributesCheck onComplete={onIntroDone} />}
      <Segmented label="Shape" value={kind} onChange={setKind} options={CATEGORIES.map((k) => ({ id: k, label: SHAPE_NAMES[k][0].toUpperCase() + SHAPE_NAMES[k].slice(1) }))} />
      <div className="control-row">
        <Stepper label="Size" value={size} min={24} max={60} step={6} onChange={setSize} tone="a" />
        <Stepper label="Turn" value={rotation} min={0} max={345} step={15} onChange={setRotation} tone="b" />
      </div>
      <div className="control-row">
        {SHAPE_COLORS.map((c, i) => (
          <button
            key={c}
            type="button"
            aria-label={`Color: ${SHAPE_COLOR_NAMES[i]}`}
            onClick={() => setColorIdx(i)}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: c,
              border: colorIdx === i ? "3px solid var(--ink)" : "2px solid var(--line)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
      <ShapeCanvas width={160} height={160} label={`A ${SHAPE_COLOR_NAMES[colorIdx]} ${SHAPE_NAMES[kind]}, size ${size}, turned ${rotation} degrees`}>
        <ShapeTile kind={kind} cx={80} cy={80} size={size} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
      </ShapeCanvas>
      <p className="muted small">
        A {SHAPE_NAMES[kind]} always has: <b>{DEFINING_ATTRIBUTE[kind]}</b>. Try dragging the Size and Turn controls, and tapping a different color — notice the shape
        stays a {SHAPE_NAMES[kind]} the whole time. Size, color, and which way it's turned never change what shape something is.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE — one ProblemType per bucket
// ============================================================================

function definingProblem(): Problem {
  const kind = pick(CATEGORIES);
  const rotation = pick(ROTATIONS);
  const size = randInt(26, 56);
  const colorIdx = randomColorIdx();
  const colorName = SHAPE_COLOR_NAMES[colorIdx];

  // A second example of the SAME category, deliberately different in every
  // non-defining way, for step 2's invariance check.
  let rotation2 = pick(ROTATIONS);
  const size2 = randInt(26, 56);
  let colorIdx2 = randomColorIdx();
  while (rotation2 === rotation && colorIdx2 === colorIdx) {
    rotation2 = pick(ROTATIONS);
    colorIdx2 = randomColorIdx();
  }

  return {
    title: `What makes a ${SHAPE_NAMES[kind]} a ${SHAPE_NAMES[kind]}?`,
    bucket: "defining",
    story: `Look at the ${colorName} ${SHAPE_NAMES[kind]} below.`,
    visual: (done: number) => (
      <div style={{ display: "flex", gap: 16 }}>
        <ShapeCanvas width={120} height={120} label={`A ${colorName} ${SHAPE_NAMES[kind]}`}>
          <ShapeTile kind={kind} cx={60} cy={60} size={size} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
        </ShapeCanvas>
        {done >= 1 && (
          <ShapeCanvas width={120} height={120} label={`A second ${SHAPE_NAMES[kind]}, different size/color/turn`}>
            <ShapeTile kind={kind} cx={60} cy={60} size={size2} rotation={rotation2} color={SHAPE_COLORS[colorIdx2]} />
          </ShapeCanvas>
        )}
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `What makes this shape a ${SHAPE_NAMES[kind]}?`,
          hint: `Think about what's true of EVERY ${SHAPE_NAMES[kind]}, no matter its size or color.`,
          explain: SHORT_ATTRIBUTE[kind],
        },
        SHORT_ATTRIBUTE[kind],
        [`It's ${colorName}.`, "It's this exact size."]
      ),
      choice(
        {
          prompt: `Here's another shape, a different size and color and turned a different way. Is it ALSO a ${SHAPE_NAMES[kind]}?`,
          hint: "Check its defining attribute, not how it looks.",
          explain: `Yes — it still has ${DEFINING_ATTRIBUTE[kind]}, so it's still a ${SHAPE_NAMES[kind]}.`,
        },
        "Yes, it's still a " + SHAPE_NAMES[kind] + ".",
        ["No, it's turned a different way.", "No, it's a different color."]
      ),
    ],
    wrapUp: `Both shapes are ${SHAPE_NAMES[kind]}s — size, color, and turn never change what shape something is.`,
  };
}

function nonDefiningTrapProblem(): Problem {
  const kind = pick(CATEGORIES);
  const rotation = pick(ROTATIONS.filter((r) => r !== 0));
  const size = randInt(26, 56);
  const colorIdx = randomColorIdx();
  const colorName = SHAPE_COLOR_NAMES[colorIdx];

  return {
    title: `Does color or turn change the shape?`,
    bucket: "nondefining-trap",
    story: `Someone says: "This isn't really a ${SHAPE_NAMES[kind]} because it's ${colorName} and turned sideways."`,
    visual: () => (
      <ShapeCanvas width={140} height={120} label={`A ${colorName} ${SHAPE_NAMES[kind]}, turned`}>
        <ShapeTile kind={kind} cx={70} cy={60} size={size} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
      </ShapeCanvas>
    ),
    steps: [
      choice(
        {
          prompt: "Are they right?",
          hint: "Does color or orientation change the number of sides?",
          explain: "Color and which way it's turned never change what shape something is.",
        },
        `No — color and which way it's turned don't change what shape it is.`,
        [`Yes — a ${SHAPE_NAMES[kind]} has to be a certain color.`, `Yes — a ${SHAPE_NAMES[kind]} has to point a certain way.`]
      ),
      choice(
        {
          prompt: `What WOULD change whether this shape is still a ${SHAPE_NAMES[kind]}?`,
          hint: "Think about the sides, not the look.",
          explain: `Changing ${DEFINING_ATTRIBUTE[kind]} is the only thing that would change what shape this is.`,
        },
        `Changing its sides or corners`,
        [`Changing its color`, `Turning it a different way`]
      ),
    ],
    wrapUp: `Still a ${SHAPE_NAMES[kind]} — ${DEFINING_ATTRIBUTE[kind]}, regardless of color or orientation.`,
  };
}

interface SortPiece {
  kind: ShapeKind;
  rotation: number;
  size: number;
  colorIdx: number;
}

function sortProblem(): Problem {
  const targetKind = pick(CATEGORIES);
  const otherKind = pick(CATEGORIES.filter((k) => k !== targetKind));
  const oddPosition = randInt(0, 4);
  const pieces: SortPiece[] = Array.from({ length: 5 }, (_, i) => ({
    kind: i === oddPosition ? otherKind : targetKind,
    rotation: pick(ROTATIONS),
    size: randInt(24, 48),
    colorIdx: randomColorIdx(),
  }));
  const letters = ["A", "B", "C", "D", "E"];
  // Two OTHER target-kind letters, deliberately offered as wrong "odd one
  // out" picks — the trap is a student assuming an unusually-sized/colored/
  // rotated example of the TARGET kind must be the odd one, instead of
  // actually checking its defining attribute.
  const targetLetters = letters.filter((_, i) => i !== oddPosition);
  const [decoy1, decoy2] = shuffle(targetLetters).slice(0, 2);

  return {
    title: `Sort the shapes`,
    bucket: "sort",
    story: `Shapes A-E below are a mix. 4 of them are ${SHAPE_NAMES[targetKind]}s (even though they look different from each other) and 1 is not.`,
    visual: () => (
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {pieces.map((p, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <ShapeCanvas width={80} height={80} label={`Shape ${letters[i]}: a ${SHAPE_NAMES[p.kind]}`}>
              <ShapeTile kind={p.kind} cx={40} cy={40} size={p.size} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
            </ShapeCanvas>
            <b>{letters[i]}</b>
          </div>
        ))}
      </div>
    ),
    steps: [
      {
        kind: "number",
        prompt: `How many of these 5 shapes are ${SHAPE_NAMES[targetKind]}s?`,
        hint: "Check each shape's sides and corners, not its size or color.",
        explain: `4 of the 5 shapes are ${SHAPE_NAMES[targetKind]}s — only shape ${letters[oddPosition]} is a different shape category.`,
        answer: 4,
      },
      choice(
        {
          prompt: `Which letter is NOT a ${SHAPE_NAMES[targetKind]}?`,
          hint: "Some of the real " + SHAPE_NAMES[targetKind] + "s look very different from each other — don't be fooled by that.",
          explain: `Shape ${letters[oddPosition]} is a ${SHAPE_NAMES[otherKind]}, not a ${SHAPE_NAMES[targetKind]} — the other 4 just look different because of size/color/turn.`,
        },
        letters[oddPosition],
        [decoy1, decoy2]
      ),
    ],
    wrapUp: `Shape ${letters[oddPosition]} was the odd one out — a real ${SHAPE_NAMES[otherKind]}, not just a strangely-drawn ${SHAPE_NAMES[targetKind]}.`,
  };
}

type BuildTarget = "square" | "rectangle" | "triangle";
const BUILD_DESCRIPTIONS: Record<BuildTarget, string> = {
  square: "4 straight sides, all the same length",
  rectangle: "4 straight sides, with 2 sides longer than the other 2",
  triangle: "3 straight sides",
};
const BUILD_CANDIDATES: Record<BuildTarget, ShapeKind[]> = {
  square: ["square", "rectangle", "triangle", "trapezoid"],
  rectangle: ["rectangle", "square", "triangle", "trapezoid"],
  triangle: ["triangle", "square", "rectangle", "trapezoid"],
};

function buildProblem(): Problem {
  const target = pick(["square", "rectangle", "triangle"] as BuildTarget[]);
  const candidateKinds = shuffle(BUILD_CANDIDATES[target]);
  const candidates = candidateKinds.map((k) => ({
    kind: k,
    rotation: pick(ROTATIONS),
    size: randInt(28, 52),
    colorIdx: randomColorIdx(),
  }));
  const letters = ["A", "B", "C", "D"];
  const correctIdx = candidateKinds.indexOf(target);
  const wrongLetters = letters.filter((_, i) => i !== correctIdx);

  return {
    title: `Draw a shape with: ${BUILD_DESCRIPTIONS[target]}`,
    bucket: "build",
    story: `Which of the shapes below (A-D) has ${BUILD_DESCRIPTIONS[target]} — no matter its size, color, or which way it's turned?`,
    visual: () => (
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {candidates.map((c, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <ShapeCanvas width={90} height={90} label={`Shape ${letters[i]}: a ${SHAPE_NAMES[c.kind]}`}>
              <ShapeTile kind={c.kind} cx={45} cy={45} size={c.size} rotation={c.rotation} color={SHAPE_COLORS[c.colorIdx]} />
            </ShapeCanvas>
            <b>{letters[i]}</b>
          </div>
        ))}
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `Which shape (A-D) matches: ${BUILD_DESCRIPTIONS[target]}?`,
          hint: "Check sides and corners on each one — ignore size, color, and orientation.",
          explain: `Shape ${letters[correctIdx]} is a ${SHAPE_NAMES[target]}: ${DEFINING_ATTRIBUTE[target]}.`,
        },
        letters[correctIdx],
        shuffle(wrongLetters).slice(0, 2)
      ),
    ],
    wrapUp: `Shape ${letters[correctIdx]} matches — any ${SHAPE_NAMES[target]}, at any size/color/turn, would work.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <ShapeCanvas width={90} height={90} label="A small blue triangle">
        <ShapeTile kind="triangle" cx={45} cy={48} size={30} rotation={0} color={SHAPE_COLORS[1]} />
      </ShapeCanvas>
      <ShapeCanvas width={90} height={90} label="A large red triangle, rotated">
        <ShapeTile kind="triangle" cx={45} cy={45} size={38} rotation={110} color={SHAPE_COLORS[0]} />
      </ShapeCanvas>
    </div>
  );
}

export const definingAttributes: Unit = {
  id: "definingAttributes",
  title: "Defining Attributes of Shapes",
  goal: "Tell the difference between what actually makes a shape that shape (like number of sides) and what's just how it looks (like color or size).",
  standard: "1.G.1",
  keyIdea: (
    <>
      <p>
        A shape's NAME depends only on its defining attributes — things like how many straight sides it has, and whether the sides/corners match up a
        certain way.
      </p>
      <p>Color, size, and which way a shape is turned are never what makes it that shape — they're just how it happens to look right now.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "What makes it that shape?", make: definingProblem, buckets: ["defining"] },
    { label: "Color/turn traps", make: nonDefiningTrapProblem, buckets: ["nondefining-trap"] },
    { label: "Sort the shapes", make: sortProblem, buckets: ["sort"] },
    { label: "Build from a description", make: buildProblem, buckets: ["build"] },
  ],
  requiredBuckets: ["defining", "nondefining-trap", "sort", "build"],
  test: definingAttributesTest,
};
