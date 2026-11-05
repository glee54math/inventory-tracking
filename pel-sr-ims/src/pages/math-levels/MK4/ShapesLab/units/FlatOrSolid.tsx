import { useState } from "react";
import { ShapeGlyph, SHAPE_KINDS, SHAPE_LABELS, type ShapeKind } from "../diagrams/Shape2D";
import { SolidGlyph, SOLID_KINDS, SOLID_LABELS, type SolidKind } from "../diagrams/Solid3D";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { flatOrSolidTest } from "./FlatOrSolidTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K.G.3's circle/sphere and square/cube pairs are drawn flat on a screen
// either way, so the CFU has to say directly what actually tells them apart:
// can you pick it up and hold real space in your hands, or is it just a
// drawing with no depth.

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: flat vs solid (circle vs sphere); round does not mean
// solid; counting flat and solid shapes in a mix; naming a solid.

const MIXED_ROW = (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
    <div style={{ width: 84 }}>
      <SolidGlyph kind="cube" tone="b" label="shape 1" />
    </div>
    <div style={{ width: 84 }}>
      <ShapeGlyph kind="circle" tone="a" label="shape 2" />
    </div>
    <div style={{ width: 84 }}>
      <SolidGlyph kind="cone" tone="b" label="shape 3" />
    </div>
    <div style={{ width: 84 }}>
      <ShapeGlyph kind="square" tone="a" label="shape 4" />
    </div>
    <div style={{ width: 84 }}>
      <SolidGlyph kind="cylinder" tone="b" label="shape 5" />
    </div>
  </div>
);

function FlatOrSolidCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="Which one can you pick up and hold?"
            picture={
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <div style={{ width: 110 }}>
                  <ShapeGlyph kind="circle" tone="a" label="a flat round shape" />
                </div>
                <div style={{ width: 110 }}>
                  <SolidGlyph kind="sphere" tone="b" label="a solid round shape" />
                </div>
              </div>
            }
            showPicture={
              <div style={{ width: 110 }}>
                <SolidGlyph kind="sphere" tone="b" label="a solid round shape" />
              </div>
            }
            showText="A sphere is solid, like a ball. A circle is flat, like a drawing."
            options={[
              { id: "circle", label: "Circle" },
              { id: "sphere", label: "Sphere" },
            ]}
            answer="sphere"
            why={{ circle: "A circle is flat, like a drawing on paper. Can you pick up a drawing?" }}
            praise="Yes! A sphere is solid, like a ball."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many solid shapes?"
            answer={3}
            tone="b"
            picture={() => MIXED_ROW}
            nudge="Solid shapes look like blocks you can hold. Count only those."
            why={{ 5: "Some are flat. Count only the solid ones.", 2: "Look again. The cone and the can are solid too." }}
            showText="Count the solid ones: the cube, the cone, and the cylinder. 1, 2, 3."
            praise="Yes! 3 solid shapes."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many flat shapes?"
            answer={2}
            tone="a"
            picture={() => MIXED_ROW}
            nudge="Flat shapes are like drawings. Count only those."
            why={{ 5: "Some are solid. Count only the flat ones.", 3: "That is the solid ones. Count the flat ones." }}
            showText="Count the flat ones: the circle and the square. 1, 2."
            praise="Yes! 2 flat shapes."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="This circle is round. Is it flat or solid?"
            picture={
              <div style={{ width: 120 }}>
                <ShapeGlyph kind="circle" tone="a" label="a round shape" />
              </div>
            }
            showPicture={
              <div style={{ width: 120 }}>
                <ShapeGlyph kind="circle" tone="a" label="a round shape" />
              </div>
            }
            showText="A circle is round, but flat, like a drawing. Round does not mean solid."
            options={[
              { id: "flat", label: "Flat" },
              { id: "solid", label: "Solid" },
            ]}
            answer="flat"
            why={{ solid: "Round does not mean solid. A circle is flat, like paper." }}
            praise="Yes! A circle is flat."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="What is this solid shape?"
            picture={
              <div style={{ width: 120 }}>
                <SolidGlyph kind="cylinder" tone="c" label="a solid shape" />
              </div>
            }
            showPicture={
              <div style={{ width: 120 }}>
                <SolidGlyph kind="cylinder" tone="c" label="a solid shape" />
              </div>
            }
            showText="It has two round ends and a curved side, like a can. It is a cylinder."
            options={[
              { id: "cube", label: "Cube" },
              { id: "cylinder", label: "Cylinder" },
              { id: "cone", label: "Cone" },
            ]}
            answer="cylinder"
            why={{ cube: "A cube has flat square sides. Does this?", cone: "A cone has a point on top. Does this?" }}
            praise="Yes! A cylinder, like a can."
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
  const [flatKind, setFlatKind] = useState<ShapeKind>("circle");
  const [solidKind, setSolidKind] = useState<SolidKind>("sphere");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ReadAloud as="p" className="muted small">Pick a flat shape and a solid shape, side by side. Notice how the solid one has shading that makes it look round and deep — the flat one doesn't.</ReadAloud>
      <div className="control-row" data-readaloud-part>
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
      <div className="control-row" data-readaloud-part>
        <div style={{ maxWidth: 180 }}>
          <ShapeGlyph kind={flatKind} tone="a" label="a flat shape" />
          <ReadAloud as="p" className="feedback good" style={{ textAlign: "center" }}>
            {SHAPE_LABELS[flatKind]} — Flat (2D)
          </ReadAloud>
        </div>
        <div style={{ maxWidth: 180 }}>
          <SolidGlyph kind={solidKind} tone="b" label="a solid shape" />
          <ReadAloud as="p" className="feedback good" style={{ textAlign: "center" }}>
            {SOLID_LABELS[solidKind]} — Solid (3D)
          </ReadAloud>
        </div>
      </div>
      <ReadAloud as="p" className="muted small">A circle and a sphere can look almost the same size on a screen — the real difference is whether you could actually pick it up and hold real space in your hands.</ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <FlatOrSolidCheckForUnderstanding onComplete={onIntroDone} />}
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
