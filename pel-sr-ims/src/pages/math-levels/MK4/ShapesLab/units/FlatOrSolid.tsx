import { useEffect, useState } from "react";
import { ShapeGlyph, SHAPE_KINDS, SHAPE_LABELS, type ShapeKind } from "../diagrams/Shape2D";
import { SolidGlyph, SOLID_KINDS, SOLID_LABELS, type SolidKind } from "../diagrams/Solid3D";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { flatOrSolidTest } from "./FlatOrSolidTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K.G.3's circle/sphere and square/cube pairs are drawn flat on a screen
// either way, so the CFU has to say directly what actually tells them apart:
// can you pick it up and hold real space in your hands, or is it just a
// drawing with no depth.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: flat (2D) vs solid (3D), stated plainly. */
function FlatSolidVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [flatPick, setFlatPick] = useState("");
  const [solidPick, setSolidPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [flatPick, solidPick].every((v) => String(v).trim() !== "");
  const flatOk = flatPick === "2d";
  const solidOk = solidPick === "3d";
  const ok = flatOk && solidOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Think about a drawing on paper, versus a block you can pick up.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          A flat shape, like a drawing, is called...{" "}
          <select className="answer" value={flatPick} onChange={(e) => setFlatPick(e.target.value)} style={fieldOk(flatOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="2d">2D (flat)</option>
            <option value="3d">3D (solid)</option>
          </select>
        </label>
        <label>
          A shape you can pick up and hold, like a block, is called...{" "}
          <select className="answer" value={solidPick} onChange={(e) => setSolidPick(e.target.value)} style={fieldOk(solidOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="2d">2D (flat)</option>
            <option value="3d">3D (solid)</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — flat is 2D, solid (something with real depth you could hold) is 3D." : "Not quite — 2D means flat, like a drawing. 3D means solid, with real depth you could actually pick up."}
        </p>
      )}
    </div>
  );
}

/** Conflation: circle vs. sphere, both terms in the same question. */
function CircleSphereConflationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [holdPick, setHoldPick] = useState("");
  const [flatPick, setFlatPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [holdPick, flatPick].every((v) => String(v).trim() !== "");
  const holdOk = holdPick === "sphere";
  const flatOk = flatPick === "circle";
  const ok = holdOk && flatOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Here are a circle and a sphere. They can look alike in a picture!
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <ShapeGlyph kind="circle" tone="a" label="a flat round shape" />
        <SolidGlyph kind="sphere" tone="b" label="a solid round shape" />
      </div>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which one could you actually pick up and hold, like a ball?{" "}
          <select className="answer" value={holdPick} onChange={(e) => setHoldPick(e.target.value)} style={fieldOk(holdOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="circle">The circle</option>
            <option value="sphere">The sphere</option>
          </select>
        </label>
        <label>
          Which one is flat, like a drawing?{" "}
          <select className="answer" value={flatPick} onChange={(e) => setFlatPick(e.target.value)} style={fieldOk(flatOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="circle">The circle</option>
            <option value="sphere">The sphere</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — a sphere (like a ball) is solid and takes up real space; a circle is just a flat, round drawing."
            : "Not quite — a sphere is solid (you can hold it, like a ball). A circle is flat, like a round drawing with no depth."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: looks alone don't decide flat vs. solid. */
function LooksCanTrickYouTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: any round shape you see in a picture must be solid (3D), since round things like balls are solid.
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
            ? "Correct — a round shape can still be flat (a circle). What matters is whether it has real depth you could hold, not just whether it looks round."
            : "Not quite — a circle is round AND flat. Being round doesn't automatically mean something is solid."}
        </p>
      )}
    </div>
  );
}

/** Production + classification together: name the solid, then classify it. */
function NameAndClassifyQuestion({ onComplete }: { onComplete?: () => void }) {
  const [namePick, setNamePick] = useState("");
  const [classPick, setClassPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [namePick, classPick].every((v) => String(v).trim() !== "");
  const nameOk = namePick === "cylinder";
  const classOk = classPick === "3d";
  const ok = nameOk && classOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Look at this solid shape.
      </p>
      <SolidGlyph kind="cylinder" tone="c" label="a solid shape" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What is the name of this solid shape?{" "}
          <select className="answer" value={namePick} onChange={(e) => setNamePick(e.target.value)} style={fieldOk(nameOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="cube">Cube</option>
            <option value="cylinder">Cylinder</option>
            <option value="cone">Cone</option>
          </select>
        </label>
        <label>
          Is a cylinder flat or solid?{" "}
          <select className="answer" value={classPick} onChange={(e) => setClassPick(e.target.value)} style={fieldOk(classOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="2d">Flat (2D)</option>
            <option value="3d">Solid (3D)</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — that's a cylinder, and it's solid (3D) — it has real depth, like a can." : "Not quite — look at the two round ends and the curved side: that's the shape of a cylinder, like a soup can, and it's solid (3D)."}
        </p>
      )}
    </div>
  );
}

function FlatOrSolidCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, circleSphere: false, trap: false, nameClassify: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure flat vs. solid isn't just about how round or square something looks, before you try practice problems.</p>
      <FlatSolidVocabQuestion onComplete={mark("vocab")} />
      <CircleSphereConflationQuestion onComplete={mark("circleSphere")} />
      <LooksCanTrickYouTrapQuestion onComplete={mark("trap")} />
      <NameAndClassifyQuestion onComplete={mark("nameClassify")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [flatKind, setFlatKind] = useState<ShapeKind>("circle");
  const [solidKind, setSolidKind] = useState<SolidKind>("sphere");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <p className="muted small">Pick a flat shape and a solid shape, side by side. Notice how the solid one has shading that makes it look round and deep — the flat one doesn't.</p>
      <div className="control-row">
        <Segmented label="Flat (2D) shape" value={flatKind} onChange={setFlatKind} options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
        <Segmented label="Solid (3D) shape" value={solidKind} onChange={setSolidKind} options={SOLID_KINDS.map((k) => ({ id: k, label: SOLID_LABELS[k] }))} />
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
      <div className="control-row">
        <div style={{ maxWidth: 180 }}>
          <ShapeGlyph kind={flatKind} tone="a" label="a flat shape" />
          <p className="feedback good" style={{ textAlign: "center" }}>
            {SHAPE_LABELS[flatKind]} — Flat (2D)
          </p>
        </div>
        <div style={{ maxWidth: 180 }}>
          <SolidGlyph kind={solidKind} tone="b" label="a solid shape" />
          <p className="feedback good" style={{ textAlign: "center" }}>
            {SOLID_LABELS[solidKind]} — Solid (3D)
          </p>
        </div>
      </div>
      {(introActive || showCheck) && <FlatOrSolidCheckForUnderstanding onComplete={onIntroDone} />}
      <p className="muted small">A circle and a sphere can look almost the same size on a screen — the real difference is whether you could actually pick it up and hold real space in your hands.</p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "classify2D" | "classify3D" | "circleVsSphereSquareVsCube" | "nameSolid";
const BUCKETS: Bucket[] = ["classify2D", "classify3D", "circleVsSphereSquareVsCube", "nameSolid"];

function flatOrSolidProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "classify2D") {
    const kind = pick(SHAPE_KINDS);
    const label = SHAPE_LABELS[kind];
    return {
      title: "Flat or solid?",
      bucket,
      story: "Look at this shape.",
      visual: () => <ShapeGlyph kind={kind} tone="a" label="a shape" />,
      steps: [
        choice({ prompt: "Is this shape flat (2D) or solid (3D)?", hint: "Could you actually pick this up and hold it, with real depth?", explain: `A ${label.toLowerCase()} is flat (2D) — it has no depth.` }, "Flat (2D)", ["Solid (3D)"]),
        choice({ prompt: "What is the name of this shape?", hint: "Count its sides.", explain: `This is a ${label}.` }, label, shuffle(SHAPE_KINDS.filter((k) => k !== kind).map((k) => SHAPE_LABELS[k])).slice(0, 2)),
      ],
      wrapUp: `A ${label.toLowerCase()} is flat (2D).`,
    };
  }

  if (bucket === "classify3D") {
    const kind = pick(SOLID_KINDS);
    const label = SOLID_LABELS[kind];
    return {
      title: "Flat or solid?",
      bucket,
      story: "Look at this shape.",
      visual: () => <SolidGlyph kind={kind} tone="b" label="a shape" />,
      steps: [
        choice({ prompt: "Is this shape flat (2D) or solid (3D)?", hint: "Could you actually pick this up and hold it, with real depth?", explain: `A ${label.toLowerCase()} is solid (3D) — it has real depth.` }, "Solid (3D)", ["Flat (2D)"]),
        choice({ prompt: "What is the name of this solid?", hint: "Think about its shape — round all over, two flat round ends, a point at the top, or a box shape?", explain: `This is a ${label}.` }, label, shuffle(SOLID_KINDS.filter((k) => k !== kind).map((k) => SOLID_LABELS[k])).slice(0, 2)),
      ],
      wrapUp: `A ${label.toLowerCase()} is solid (3D).`,
    };
  }

  if (bucket === "circleVsSphereSquareVsCube") {
    const useCircleSphere = pick([true, false]);
    const showSolid = pick([true, false]);
    const flatKind: ShapeKind = useCircleSphere ? "circle" : "square";
    const solidKind: SolidKind = useCircleSphere ? "sphere" : "cube";
    const kindLabel = useCircleSphere ? "round" : "square-faced";
    if (showSolid) {
      const label = SOLID_LABELS[solidKind];
      return {
        title: "Flat or solid? (the tricky pair)",
        bucket,
        story: `This ${kindLabel} shape can look a lot like its flat cousin in a picture — look closely at the shading.`,
        visual: () => <SolidGlyph kind={solidKind} tone="c" label="a shape" />,
        steps: [
          choice(
            { prompt: "Is this shape flat (2D) or solid (3D)?", hint: "Look for shading/highlights that show depth — a flat shape has none.", explain: `This is a ${label.toLowerCase()} — the shading shows it has real depth, so it's solid (3D).` },
            "Solid (3D)",
            ["Flat (2D)"]
          ),
          choice({ prompt: "What is the name of this solid?", hint: "Is it round all over, or does it have flat square faces?", explain: `This is a ${label}.` }, label, shuffle(SOLID_KINDS.filter((k) => k !== solidKind).map((k) => SOLID_LABELS[k])).slice(0, 2)),
        ],
        wrapUp: `This is a solid ${label.toLowerCase()} — not just a flat ${useCircleSphere ? "circle" : "square"}.`,
      };
    }
    const label = SHAPE_LABELS[flatKind];
    return {
      title: "Flat or solid? (the tricky pair)",
      bucket,
      story: `This ${kindLabel} shape can look a lot like its solid cousin in a picture — look closely: no shading at all.`,
      visual: () => <ShapeGlyph kind={flatKind} tone="a" label="a shape" />,
      steps: [
        choice(
          { prompt: "Is this shape flat (2D) or solid (3D)?", hint: "No shading or highlight means no depth — it's just a flat drawing.", explain: `This is a flat ${label.toLowerCase()} (2D) — a drawing with no real depth.` },
          "Flat (2D)",
          ["Solid (3D)"]
        ),
        choice({ prompt: "What is the name of this flat shape?", hint: "It's one of the 5 shapes you've learned.", explain: `This is a ${label}.` }, label, shuffle(SHAPE_KINDS.filter((k) => k !== flatKind).map((k) => SHAPE_LABELS[k])).slice(0, 2)),
      ],
      wrapUp: `This is a flat ${label.toLowerCase()} — not a solid ${useCircleSphere ? "sphere" : "cube"}.`,
    };
  }

  // nameSolid — production bucket: name the solid, distinct from just classifying flat/solid.
  const kind = pick(SOLID_KINDS);
  const label = SOLID_LABELS[kind];
  return {
    title: "Name this solid",
    bucket,
    story: "Look at this solid shape.",
    visual: () => <SolidGlyph kind={kind} tone="a" label="a solid shape" />,
    steps: [
      choice({ prompt: "What is the name of this solid shape?", hint: "Round all over? Two round ends? A point at the top? A box?", explain: `This is a ${label}.` }, label, shuffle(SOLID_KINDS.filter((k) => k !== kind).map((k) => SOLID_LABELS[k])).slice(0, 3)),
      choice({ prompt: `Is a ${label.toLowerCase()} flat or solid?`, hint: "Could you actually hold it?", explain: `A ${label.toLowerCase()} is solid (3D).` }, "Solid (3D)", ["Flat (2D)"]),
    ],
    wrapUp: `This solid shape is a ${label}.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <SolidGlyph kind="sphere" tone="a" label="a sphere" />;
}

export const flatOrSolid: Unit = {
  id: "flatOrSolid",
  title: "Flat or Solid? (2D vs. 3D)",
  goal: "Tell whether a shape is flat (2D) or solid (3D), and name common solid shapes like cube, cone, cylinder, and sphere.",
  standard: "K.G.3",
  keyIdea: (
    <>
      <p>Flat (2D) shapes are like drawings — no depth. Solid (3D) shapes have real depth — you could actually pick them up.</p>
      <p>A circle and a sphere (or a square and a cube) can look alike in a picture — shading that shows depth is the real tell.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  reintroEverySolved: 20,
  preview: Preview,
  problems: [{ label: "Flat or Solid?", make: flatOrSolidProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: flatOrSolidTest,
};
