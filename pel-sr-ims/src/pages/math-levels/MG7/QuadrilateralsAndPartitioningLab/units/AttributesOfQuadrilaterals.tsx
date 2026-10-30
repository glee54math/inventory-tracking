import { useEffect, useState } from "react";
import type React from "react";
import { QuadCanvas, QuadTile, QUAD_NAMES, SHAPE_DESCRIPTION, SHAPE_COLORS, SHAPE_COLOR_NAMES, type QuadKind } from "../diagrams/QuadTile";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { attributesOfQuadrilateralsTest } from "./AttributesOfQuadrilateralsTest";

const QUADS: QuadKind[] = ["square", "rectangle", "rhombus", "genericQuad", "trapezoidLike"];
const NON_QUADS: QuadKind[] = ["triangle", "pentagon", "circle"];
const ROTATIONS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300, 330];

function randomColorIdx() {
  return randInt(0, SHAPE_COLORS.length - 1);
}

function fieldStyle(ok: boolean, checked: boolean) {
  if (!checked) return {};
  return ok ? { borderColor: "var(--good)", background: "var(--good-soft)" } : { borderColor: "var(--bad)", background: "var(--bad-soft)" };
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1 — vocabulary. */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["It has 4 straight sides.", "It's a square.", "It has 4 EQUAL sides."];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What makes a shape a quadrilateral?
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
            ? "Right — ANY shape with exactly 4 straight sides is a quadrilateral, no matter what else is true about it."
            : "Not quite — a square is one KIND of quadrilateral, and equal sides are extra, not required. What's true of every 4-sided shape?"}
        </p>
      )}
    </div>
  );
}

/** Q2 — the named misconception: category membership is NOT exclusive. A
 *  square is simultaneously a rectangle, a rhombus, AND a quadrilateral —
 *  two separate True/False sub-questions in one card so answering one
 *  doesn't give away the other. */
function NotExclusiveQuestion({ onComplete }: { onComplete?: () => void }) {
  const [isRect, setIsRect] = useState<"true" | "false" | null>(null);
  const [isRhombus, setIsRhombus] = useState<"true" | "false" | null>(null);
  const okRect = isRect === "true";
  const okRhombus = isRhombus === "true";
  const ok = okRect && okRhombus;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Here's a square:
      </p>
      <QuadCanvas width={90} height={90} label="A blue square">
        <QuadTile kind="square" cx={45} cy={45} size={32} color={SHAPE_COLORS[1]} />
      </QuadCanvas>
      <p>True or False: this square is ALSO a rectangle.</p>
      <div style={{ display: "flex", gap: 10 }}>
        {(["true", "false"] as const).map((v) => (
          <button key={v} type="button" className="choice" disabled={okRect} onClick={() => setIsRect(v)} style={fieldStyle(v === "true", isRect === v)}>
            {v === "true" ? "True" : "False"}
          </button>
        ))}
      </div>
      <p>True or False: this SAME square is ALSO a rhombus.</p>
      <div style={{ display: "flex", gap: 10 }}>
        {(["true", "false"] as const).map((v) => (
          <button key={v} type="button" className="choice" disabled={okRhombus} onClick={() => setIsRhombus(v)} style={fieldStyle(v === "true", isRhombus === v)}>
            {v === "true" ? "True" : "False"}
          </button>
        ))}
      </div>
      {(isRect !== null || isRhombus !== null) && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Both True! A shape can belong to more than one category at once — a square is a rectangle AND a rhombus AND a quadrilateral, all at the same time."
            : "A shape isn't locked into just ONE category — check whether this square also has 4 right angles (rectangle) and 4 equal sides (rhombus)."}
        </p>
      )}
    </div>
  );
}

/** Q3 — a rotated/atypical-looking shape must still be classified correctly. */
function AtypicalShapeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"yes" | "no" | null>(null);
  const ok = picked === "yes";
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Is this slanted shape a quadrilateral?
      </p>
      <QuadCanvas width={120} height={120} label="A slanted purple rhombus, rotated sideways">
        <QuadTile kind="rhombus" cx={60} cy={60} size={32} rotation={35} rhombusRatio={2.1} color={SHAPE_COLORS[3]} />
      </QuadCanvas>
      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" className="choice" disabled={ok} onClick={() => setPicked("yes")} style={fieldStyle(true, picked === "yes")}>
          Yes
        </button>
        <button type="button" className="choice" disabled={ok} onClick={() => setPicked("no")} style={fieldStyle(false, picked === "no")}>
          No
        </button>
      </div>
      {picked !== null && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Yes — it has 4 straight sides, so it's a quadrilateral, even though it's slanted and doesn't look like a typical square or rectangle."
            : "Count its sides, not how 'normal' it looks — a shape doesn't stop being a quadrilateral just because it's slanted or turned."}
        </p>
      )}
    </div>
  );
}

/** Q4 — the plan's required true/false hierarchy pair, both statements shown
 *  together so neither can be answered by pattern-matching the other. */
function HierarchyPairQuestion({ onComplete }: { onComplete?: () => void }) {
  const [rhombusRect, setRhombusRect] = useState<"true" | "false" | null>(null);
  const [squareRhombus, setSquareRhombus] = useState<"true" | "false" | null>(null);
  const okA = rhombusRect === "false";
  const okB = squareRhombus === "true";
  const ok = okA && okB;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or False: every rhombus is a rectangle.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        {(["true", "false"] as const).map((v) => (
          <button key={v} type="button" className="choice" disabled={okA} onClick={() => setRhombusRect(v)} style={fieldStyle(v === "false", rhombusRect === v)}>
            {v === "true" ? "True" : "False"}
          </button>
        ))}
      </div>
      <p>True or False: every square is a rhombus.</p>
      <div style={{ display: "flex", gap: 10 }}>
        {(["true", "false"] as const).map((v) => (
          <button key={v} type="button" className="choice" disabled={okB} onClick={() => setSquareRhombus(v)} style={fieldStyle(v === "true", squareRhombus === v)}>
            {v === "true" ? "True" : "False"}
          </button>
        ))}
      </div>
      {(rhombusRect !== null || squareRhombus !== null) && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Right on both! A rhombus only needs 4 equal sides (no right-angle requirement), so most rhombuses AREN'T rectangles. But a square always has 4 equal sides, so every square IS a rhombus."
            : "Think about which attribute each category actually requires — a rhombus needs equal sides (not right angles); a square has both, so it always qualifies as a rhombus too."}
        </p>
      )}
    </div>
  );
}

function AttributesCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ q1: false, q2: false, q3: false, q4: false });
  const allDone = done.q1 && done.q2 && done.q3 && done.q4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure you can tell what REALLY makes a shape a quadrilateral before you try practice problems.</p>
      <VocabQuestion onComplete={() => setDone((d) => ({ ...d, q1: true }))} />
      <NotExclusiveQuestion onComplete={() => setDone((d) => ({ ...d, q2: true }))} />
      <AtypicalShapeQuestion onComplete={() => setDone((d) => ({ ...d, q3: true }))} />
      <HierarchyPairQuestion onComplete={() => setDone((d) => ({ ...d, q4: true }))} />
    </div>
  );
}

// ============================================================================
// EXPLORE — a free shape explorer, plus a drag-to-sort-into-bins activity
// (the plan's explicit "physically move a shape into a yes/no bin" concrete
// manipulative for Units 1-2's recognition tasks).
// ============================================================================

interface SortPiece {
  id: number;
  kind: QuadKind;
  rotation: number;
  colorIdx: number;
}

function makeSortPieces(): SortPiece[] {
  const kinds = shuffle([...QUADS, ...NON_QUADS]).slice(0, 6);
  return kinds.map((kind, id) => ({ id, kind, rotation: pick(ROTATIONS), colorIdx: randomColorIdx() }));
}

function SortGallery() {
  const [pieces, setPieces] = useState<SortPiece[]>(makeSortPieces);
  const [placed, setPlaced] = useState<Record<number, "yes" | "no" | undefined>>({});
  const [dragging, setDragging] = useState<number | null>(null);

  const dropInto = (bin: "yes" | "no") => {
    if (dragging === null) return;
    setPlaced((p) => ({ ...p, [dragging]: bin }));
    setDragging(null);
  };

  const tray = pieces.filter((p) => placed[p.id] === undefined);
  const inBin = (bin: "yes" | "no") => pieces.filter((p) => placed[p.id] === bin);

  const binStyle = (bin: "yes" | "no") => {
    const items = inBin(bin);
    const correct = items.filter((p) => (bin === "yes") === QUADS.includes(p.kind)).length;
    const wrong = items.length - correct;
    if (items.length === 0) return {};
    return wrong === 0 ? { borderColor: "var(--good)", background: "var(--good-soft)" } : { borderColor: "var(--bad)", background: "var(--bad-soft)" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p className="muted small">Drag each shape below into the bin where it belongs.</p>
      <div className="control-row" style={{ flexWrap: "wrap", gap: 10 }}>
        {tray.map((p) => (
          <div key={p.id} draggable onDragStart={() => setDragging(p.id)} onDragEnd={() => setDragging(null)} style={{ cursor: "grab" }} aria-label={`Drag this ${QUAD_NAMES[p.kind]}`}>
            <QuadCanvas width={64} height={64} label={`A ${QUAD_NAMES[p.kind]}`}>
              <QuadTile kind={p.kind} cx={32} cy={32} size={22} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
            </QuadCanvas>
          </div>
        ))}
      </div>
      <div className="control-row" style={{ gap: 16 }}>
        <div onDragOver={(e) => e.preventDefault()} onDrop={() => dropInto("yes")} style={{ flex: 1, minHeight: 100, border: "3px dashed var(--line)", borderRadius: 10, padding: 10, ...binStyle("yes") }}>
          <b>Yes — quadrilateral</b>
          <div className="control-row" style={{ flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {inBin("yes").map((p) => (
              <QuadCanvas key={p.id} width={44} height={44} label={QUAD_NAMES[p.kind]}>
                <QuadTile kind={p.kind} cx={22} cy={22} size={15} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
              </QuadCanvas>
            ))}
          </div>
        </div>
        <div onDragOver={(e) => e.preventDefault()} onDrop={() => dropInto("no")} style={{ flex: 1, minHeight: 100, border: "3px dashed var(--line)", borderRadius: 10, padding: 10, ...binStyle("no") }}>
          <b>No — not a quadrilateral</b>
          <div className="control-row" style={{ flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {inBin("no").map((p) => (
              <QuadCanvas key={p.id} width={44} height={44} label={QUAD_NAMES[p.kind]}>
                <QuadTile kind={p.kind} cx={22} cy={22} size={15} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
              </QuadCanvas>
            ))}
          </div>
        </div>
      </div>
      <button type="button" className="btn ghost" style={{ width: "fit-content" }} onClick={() => { setPieces(makeSortPieces()); setPlaced({}); }}>
        New shapes
      </button>
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [kind, setKind] = useState<QuadKind>("square");
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
      {(introActive || showCheck) && <AttributesCheck onComplete={onIntroDone} />}
      <Segmented label="Shape" value={kind} onChange={setKind} options={QUADS.map((k) => ({ id: k, label: QUAD_NAMES[k][0].toUpperCase() + QUAD_NAMES[k].slice(1) }))} />
      <div className="control-row">
        <Stepper label="Turn" value={rotation} min={0} max={345} step={15} onChange={setRotation} tone="b" />
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
      <QuadCanvas width={160} height={160} label={`A ${SHAPE_COLOR_NAMES[colorIdx]} ${QUAD_NAMES[kind]}, turned ${rotation} degrees`}>
        <QuadTile kind={kind} cx={80} cy={80} size={40} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
      </QuadCanvas>
      <p className="muted small">
        A {QUAD_NAMES[kind]} always has: <b>{SHAPE_DESCRIPTION[kind]}</b>. Try turning it — it stays a {QUAD_NAMES[kind]} no matter which way it's rotated.
      </p>
      <SortGallery />
    </div>
  );
}

// ============================================================================
// PRACTICE — one ProblemType per bucket
// ============================================================================

function sortProblem(): Problem {
  const nonQuadKind = pick(NON_QUADS);
  const oddPosition = randInt(0, 4);
  const pieces: SortPiece[] = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    kind: i === oddPosition ? nonQuadKind : pick(QUADS),
    rotation: pick(ROTATIONS),
    colorIdx: randomColorIdx(),
  }));
  const letters = ["A", "B", "C", "D", "E"];
  const quadLetters = letters.filter((_, i) => i !== oddPosition);
  const [decoy1, decoy2] = shuffle(quadLetters).slice(0, 2);

  return {
    title: "Sort the shapes",
    bucket: "sort",
    story: `Shapes A-E below are a mix. 4 of them are quadrilaterals (even though they look different from each other) and 1 is not.`,
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
        prompt: "How many of these 5 shapes are quadrilaterals?",
        hint: "Count the straight sides on each shape.",
        explain: `4 of the 5 shapes are quadrilaterals — only shape ${letters[oddPosition]} isn't.`,
        answer: 4,
      },
      choice(
        {
          prompt: "Which letter is NOT a quadrilateral?",
          hint: "Some of the real quadrilaterals look very different from each other — don't be fooled by that.",
          explain: `Shape ${letters[oddPosition]} is a ${QUAD_NAMES[nonQuadKind]}, which doesn't have 4 straight sides.`,
        },
        letters[oddPosition],
        [decoy1, decoy2]
      ),
    ],
    wrapUp: `Shape ${letters[oddPosition]} was the odd one out — a ${QUAD_NAMES[nonQuadKind]}, not a quadrilateral.`,
  };
}

function skewedRhombusProblem(): Problem {
  const rotation = pick(ROTATIONS.filter((r) => r !== 0));
  const ratio = randInt(16, 28) / 10; // 1.6 - 2.8, always visibly non-square
  const colorIdx = randomColorIdx();

  return {
    title: "A slanted rhombus",
    bucket: "skewed-rhombus",
    story: "Here's a quadrilateral that doesn't look like a typical square.",
    visual: () => (
      <QuadCanvas width={140} height={140} label={`A slanted ${SHAPE_COLOR_NAMES[colorIdx]} rhombus`}>
        <QuadTile kind="rhombus" cx={70} cy={70} size={34} rotation={rotation} rhombusRatio={ratio} color={SHAPE_COLORS[colorIdx]} />
      </QuadCanvas>
    ),
    steps: [
      choice(
        {
          prompt: "Is this shape a quadrilateral?",
          hint: "Count its straight sides — does it matter that it's slanted?",
          explain: "Yes — it has 4 straight sides, so it's a quadrilateral, no matter how slanted it looks.",
        },
        "Yes, it's a quadrilateral.",
        ["No, it's too slanted.", "No, it doesn't look like a square."]
      ),
      choice(
        {
          prompt: "All 4 of its sides are the same length. What kind of quadrilateral is that?",
          hint: "4 equal-length sides is the one thing that matters here — not whether the corners are square corners.",
          explain: "A rhombus has 4 equal-length sides — the corners don't have to be right angles.",
        },
        "A rhombus",
        ["A rectangle", "Not a real shape"]
      ),
    ],
    wrapUp: "A rhombus is still a rhombus (and still a quadrilateral) no matter how slanted or rotated it is.",
  };
}

function rectangleHierarchyProblem(): Problem {
  const aspect = randInt(22, 35) / 10; // clearly non-square
  const rotation = pick(ROTATIONS);
  const colorIdx = randomColorIdx();

  return {
    title: "A long, thin rectangle",
    bucket: "rectangle-hierarchy",
    story: "Here's a long, thin quadrilateral.",
    visual: () => (
      <QuadCanvas width={150} height={110} label={`A long thin ${SHAPE_COLOR_NAMES[colorIdx]} rectangle`}>
        <QuadTile kind="rectangle" cx={75} cy={55} size={28} rotation={rotation} rectAspect={aspect} color={SHAPE_COLORS[colorIdx]} />
      </QuadCanvas>
    ),
    steps: [
      choice(
        {
          prompt: "Is this long, thin shape a quadrilateral?",
          hint: "It doesn't have to look square-ish to be a quadrilateral.",
          explain: "Yes — 4 straight sides and 4 right angles makes it a rectangle, which is always a quadrilateral too.",
        },
        "Yes, it's a quadrilateral (and a rectangle).",
        ["No, it's too long and thin to count.", "No, only squares count as quadrilaterals."]
      ),
      choice(
        {
          prompt: "True or False: a square is always ALSO a rectangle.",
          hint: "Check: does a square have 4 straight sides and 4 right angles, same as a rectangle needs?",
          explain: "True — a square has 4 sides and 4 right angles, which is exactly what makes something a rectangle (it just ALSO happens to have equal sides).",
        },
        "True",
        ["False"]
      ),
    ],
    wrapUp: "Rectangles come in lots of proportions, and a square always counts as one too — it just has the extra feature of equal sides.",
  };
}

function truefalsePairProblem(): Problem {
  const rhombusRotation = pick(ROTATIONS.filter((r) => r !== 0));
  const squareRotation = pick(ROTATIONS);
  const rhombusColorIdx = randomColorIdx();
  const squareColorIdx = randomColorIdx();

  return {
    title: "Rhombus and rectangle: true or false",
    bucket: "truefalse-pair",
    story: "Look at these two quadrilaterals.",
    visual: (done: number) => (
      <div style={{ display: "flex", gap: 16 }}>
        <QuadCanvas width={110} height={110} label="A slanted rhombus">
          <QuadTile kind="rhombus" cx={55} cy={55} size={30} rotation={rhombusRotation} rhombusRatio={1.9} color={SHAPE_COLORS[rhombusColorIdx]} />
        </QuadCanvas>
        {done >= 1 && (
          <QuadCanvas width={110} height={110} label="A square">
            <QuadTile kind="square" cx={55} cy={55} size={30} rotation={squareRotation} color={SHAPE_COLORS[squareColorIdx]} />
          </QuadCanvas>
        )}
      </div>
    ),
    steps: [
      choice(
        {
          prompt: "True or False: every rhombus (like the one shown) is a rectangle.",
          hint: "A rhombus only needs 4 equal sides. Does this one have 4 right angles too?",
          explain: "False — a rhombus just needs 4 equal sides; most rhombuses (like this slanted one) don't have right angles, so they aren't rectangles.",
        },
        "False",
        ["True"]
      ),
      choice(
        {
          prompt: "True or False: every square (like the one shown) is a rhombus.",
          hint: "Does a square always have 4 equal sides?",
          explain: "True — a square always has 4 equal sides, which is exactly what makes something a rhombus.",
        },
        "True",
        ["False"]
      ),
    ],
    wrapUp: "A rhombus doesn't need right angles, so it's usually NOT a rectangle — but a square always has equal sides, so it's ALWAYS a rhombus.",
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <QuadCanvas width={90} height={90} label="A slanted rhombus">
        <QuadTile kind="rhombus" cx={45} cy={48} size={26} rotation={30} rhombusRatio={1.9} color={SHAPE_COLORS[3]} />
      </QuadCanvas>
      <QuadCanvas width={90} height={90} label="A long rectangle">
        <QuadTile kind="rectangle" cx={45} cy={45} size={26} rotation={0} rectAspect={2.4} color={SHAPE_COLORS[1]} />
      </QuadCanvas>
    </div>
  );
}

export const attributesOfQuadrilaterals: Unit = {
  id: "attributesOfQuadrilaterals",
  title: "Attributes That Define Quadrilaterals",
  goal: "Learn what makes a shape a quadrilateral, and see how rhombuses, rectangles, and squares all fit inside that bigger category.",
  standard: "3.G.1",
  keyIdea: (
    <>
      <p>Any shape with 4 straight sides is a quadrilateral — no matter how it's rotated, how slanted it is, or what else is true about it.</p>
      <p>Rhombuses (4 equal sides), rectangles (4 right angles), and squares (both) are all SPECIAL kinds of quadrilaterals — and a shape can belong to more than one category at once.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "Sort the shapes", make: sortProblem, buckets: ["sort"] },
    { label: "Slanted rhombus", make: skewedRhombusProblem, buckets: ["skewed-rhombus"] },
    { label: "Rectangle hierarchy", make: rectangleHierarchyProblem, buckets: ["rectangle-hierarchy"] },
    { label: "True or false pair", make: truefalsePairProblem, buckets: ["truefalse-pair"] },
  ],
  requiredBuckets: ["sort", "skewed-rhombus", "rectangle-hierarchy", "truefalse-pair"],
  test: attributesOfQuadrilateralsTest,
};
