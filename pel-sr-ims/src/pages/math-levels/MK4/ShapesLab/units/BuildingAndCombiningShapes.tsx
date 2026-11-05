import { useEffect, useState } from "react";
import { SHAPE_LABELS, ShapeCountable, shapeAttributes, shapeOutline, BUILDABLE_KINDS, type BuildableKind } from "../diagrams/Shape2D";
import { StickBuilder } from "../diagrams/StickBuilder";
import { countAlongMs, countAlongText } from "../diagrams/countAlong";
import { CubeFrameBuilder, CubeFramePreview, CUBE_EDGES, CUBE_VERTICES } from "../diagrams/CubeFrameBuilder";
import { ComposeSingle, ComposeOpenStrip, COMPOSE_RECIPES, type ComposeRecipe } from "../diagrams/ComposeShapes";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, customStep, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { buildingAndCombiningShapesTest } from "./BuildingAndCombiningShapesTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K.G.6's composition skill is new (not just recognition), and the plan's
// named misconception is believing there's only ONE "obvious" way pieces
// can combine — the open-ended strip task directly disproves that.

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: sticks are a shape's sides; small shapes join to make a
// bigger shape; a cube frame's clay balls are its corners.

const recipe = (id: string) => COMPOSE_RECIPES.find((r) => r.id === id)!;

function BuildingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const toSquare = recipe("trianglesToSquare");
  const toRectangle = recipe("squaresToRectangle");
  const allEdges = CUBE_EDGES.map((_, i) => i);
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="How many sticks do you need to make a triangle?"
            answer={3}
            tone="a"
            picture={(m) => <ShapeCountable kind="triangle" tone="a" countAlong={m === "show" || m === "done" ? "sides" : undefined} />}
            nudge="Each stick is one side. Count the sides."
            showText="Watch and listen: one stick for each side. 1, 2, 3."
            praise="Yes! 3 sticks, one for each side."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={2}
            prompt="Two triangles join together. What shape do they make?"
            picture={<ComposeSingle recipe={toSquare} placed={toSquare.slots.length} tone="a" />}
            showPicture={<ShapeCountable kind="square" tone="a" countAlong="sides" />}
            showText="Count the sides of the new shape: 1, 2, 3, 4. 4 sides the same. It is a square."
            options={[
              { id: "square", label: "Square" },
              { id: "triangle", label: "Triangle" },
              { id: "circle", label: "Circle" },
            ]}
            answer="square"
            why={{ triangle: "Look at the outside of the new shape. How many sides does it have?", circle: "A circle is round. Is the new shape round?" }}
            praise="Yes! Two triangles make a square."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="How many squares make this rectangle?"
            answer={toRectangle.slots.length}
            tone="a"
            picture={() => <ComposeSingle recipe={toRectangle} placed={toRectangle.slots.length} tone="a" />}
            nudge="Count each small square inside the rectangle."
            showText={`Watch and listen: ${Array.from({ length: toRectangle.slots.length }, (_, i) => i + 1).join(", ")}.`}
            praise={`Yes! ${toRectangle.slots.length} squares make the rectangle.`}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="How many clay balls does this cube have?"
            answer={CUBE_VERTICES.length}
            tone="c"
            picture={(m) => <CubeFramePreview presentEdges={allEdges} tone="c" countCorners={m === "show" || m === "done"} />}
            nudge="Count each clay ball once. Some are in the back."
            showText={`Watch and listen: ${Array.from({ length: CUBE_VERTICES.length }, (_, i) => i + 1).join(", ")}.`}
            praise={`Yes! ${CUBE_VERTICES.length} clay balls.`}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="The clay balls are the cube's..."
            picture={<CubeFramePreview presentEdges={allEdges} tone="c" />}
            showPicture={<CubeFramePreview presentEdges={allEdges} tone="c" countCorners />}
            showText="Look: each clay ball is where sticks meet. That is a corner."
            options={[
              { id: "corners", label: "Corners" },
              { id: "sides", label: "Sides" },
            ]}
            answer="corners"
            why={{ sides: "The sticks are the sides. Where do the sticks meet?" }}
            praise="Yes! The clay balls are the corners. The sticks are the sides."
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

  const [stickKind, setStickKind] = useState<BuildableKind>("triangle");
  const [stickPlaced, setStickPlaced] = useState<number[]>([]);
  const stickN = shapeOutline(stickKind, 68).length;
  const pickStickKind = (k: BuildableKind) => {
    setStickKind(k);
    setStickPlaced([]);
  };
  const toggleStick = (i: number) => setStickPlaced((p) => (p.includes(i) ? p : [...p, i]));

  const [cubePlaced, setCubePlaced] = useState<number[]>([]);
  const toggleCubeEdge = (i: number) => setCubePlaced((p) => (p.includes(i) ? p : [...p, i]));

  const [composeMode, setComposeMode] = useState<"single" | "open">("single");
  const [recipeId, setRecipeId] = useState(COMPOSE_RECIPES[0].id);
  const recipe = COMPOSE_RECIPES.find((r) => r.id === recipeId) ?? COMPOSE_RECIPES[0];
  const [composedCount, setComposedCount] = useState(0);
  const pickRecipe = (id: string) => {
    setRecipeId(id);
    setComposedCount(0);
  };

  const [targetLength, setTargetLength] = useState(6);
  const [openPieces, setOpenPieces] = useState<number[]>([]);
  const openTotal = openPieces.reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <ReadAloud as="p" className="muted small">Pick a shape, then click each dashed gap to drop a stick in it.</ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented label="Shape to build" value={stickKind} onChange={pickStickKind} options={BUILDABLE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
          <button className="btn ghost" onClick={() => setStickPlaced([])}>
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
          <StickBuilder kind={stickKind} placed={stickPlaced} onToggle={toggleStick} tone="a" />
        </div>
        <ReadAloud as="p" className="feedback good">
          {stickPlaced.length} of {stickN} sticks placed{stickPlaced.length === stickN ? ` — you built a ${SHAPE_LABELS[stickKind]}!` : "..."}
        </ReadAloud>
      </div>

      <div>
        <ReadAloud as="p" className="muted small">Now build a cube out of clay (corners, already placed) and sticks (edges) — click each dashed gap.</ReadAloud>
        <div className="control-row" data-readaloud-part>
          <button className="btn ghost" onClick={() => setCubePlaced([])}>
            Start over
          </button>
        </div>
        <div style={{ maxWidth: 220 }}>
          <CubeFrameBuilder placed={cubePlaced} onToggle={toggleCubeEdge} tone="b" />
        </div>
        <ReadAloud as="p" className="feedback good">
          {cubePlaced.length} of {CUBE_EDGES.length} sticks placed{cubePlaced.length === CUBE_EDGES.length ? " — you built a cube!" : "..."}
        </ReadAloud>
      </div>

      <div>
        <ReadAloud as="p" className="muted small">Put two shapes together to make a bigger one — or try the open-ended strip, which has MORE than one right answer.</ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented label="Activity" value={composeMode} onChange={setComposeMode} options={[{ id: "single", label: "One target shape" }, { id: "open", label: "Many ways (strip)" }]} />
        </div>
        {composeMode === "single" ? (
          <>
            <div className="control-row" data-readaloud-part>
              <Segmented label="Pieces" value={recipeId} onChange={pickRecipe} options={COMPOSE_RECIPES.map((r) => ({ id: r.id, label: `${r.pieceLabel}s → ${r.resultLabel}` }))} />
              <button className="btn ghost" onClick={() => setComposedCount(0)}>
                Start over
              </button>
            </div>
            <div style={{ maxWidth: 280 }}>
              <ComposeSingle recipe={recipe} placed={composedCount} onPlace={() => setComposedCount((c) => Math.min(recipe.slots.length, c + 1))} tone="c" />
            </div>
            <ReadAloud as="p" className="feedback good">
              {composedCount} of {recipe.slots.length} {recipe.pieceLabel.toLowerCase()}s placed{composedCount === recipe.slots.length ? ` — together they make a ${recipe.resultLabel}!` : "..."}
            </ReadAloud>
          </>
        ) : (
          <>
            <div className="control-row" data-readaloud-part>
              <Stepper label="Strip length" value={targetLength} min={3} max={8} onChange={(n) => { setTargetLength(n); setOpenPieces([]); }} tone="a" />
              <button className="btn ghost" type="button" disabled={openTotal + 1 > targetLength} onClick={() => setOpenPieces((p) => [...p, 1])}>
                Add square (1)
              </button>
              <button className="btn ghost" type="button" disabled={openTotal + 2 > targetLength} onClick={() => setOpenPieces((p) => [...p, 2])}>
                Add domino (2)
              </button>
              <button className="btn ghost" type="button" disabled={openPieces.length === 0} onClick={() => setOpenPieces((p) => p.slice(0, -1))}>
                Remove last
              </button>
              <button className="btn ghost" onClick={() => setOpenPieces([])}>
                Start over
              </button>
            </div>
            <div style={{ maxWidth: 280 }}>
              <ComposeOpenStrip targetLength={targetLength} placedLengths={openPieces} tone="b" />
            </div>
            <ReadAloud as="p" className="feedback good">
              {openTotal === targetLength ? "Filled exactly! Try starting over and using a different mix of pieces — more than one way works." : `${openTotal} of ${targetLength} units filled.`}
            </ReadAloud>
          </>
        )}
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <BuildingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "build2D" | "build3D" | "composeSingleTarget" | "composeOpenEnded";
const BUCKETS: Bucket[] = ["build2D", "build3D", "composeSingleTarget", "composeOpenEnded"];

function StickBuilderWidget({ kind, onDone }: { kind: BuildableKind; onDone: () => void }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const n = shapeOutline(kind, 68).length;
  const toggle = (i: number) => setPlaced((p) => (p.includes(i) ? p : [...p, i]));
  useEffect(() => {
    if (placed.length === n) onDone();
  }, [placed, n, onDone]);
  return (
    <div>
      <StickBuilder kind={kind} placed={placed} onToggle={toggle} tone="a" />
      <ReadAloud as="p" className="muted small">
        {placed.length} of {n} sticks placed.
      </ReadAloud>
    </div>
  );
}

function CubeFrameWidget({ onDone }: { onDone: () => void }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const toggle = (i: number) => setPlaced((p) => (p.includes(i) ? p : [...p, i]));
  useEffect(() => {
    if (placed.length === CUBE_EDGES.length) onDone();
  }, [placed, onDone]);
  return (
    <div>
      <CubeFrameBuilder placed={placed} onToggle={toggle} tone="b" />
      <ReadAloud as="p" className="muted small">
        {placed.length} of {CUBE_EDGES.length} sticks placed.
      </ReadAloud>
    </div>
  );
}

function ComposeSingleWidget({ recipe, onDone }: { recipe: ComposeRecipe; onDone: () => void }) {
  const [placed, setPlaced] = useState(0);
  useEffect(() => {
    if (placed >= recipe.slots.length) onDone();
  }, [placed, recipe, onDone]);
  return (
    <div>
      <ComposeSingle recipe={recipe} placed={placed} onPlace={() => setPlaced((c) => Math.min(recipe.slots.length, c + 1))} tone="c" />
      <ReadAloud as="p" className="muted small">Click a {recipe.pieceLabel.toLowerCase()} piece to drop it into the next open space.</ReadAloud>
    </div>
  );
}

function ComposeOpenWidget({ targetLength, onDone }: { targetLength: number; onDone: () => void }) {
  const [pieces, setPieces] = useState<number[]>([]);
  const total = pieces.reduce((a, b) => a + b, 0);
  useEffect(() => {
    if (total === targetLength) onDone();
  }, [total, targetLength, onDone]);
  return (
    <div>
      <ComposeOpenStrip targetLength={targetLength} placedLengths={pieces} tone="b" />
      <div className="control-row" data-readaloud-part>
        <button className="btn ghost" type="button" disabled={total + 1 > targetLength} onClick={() => setPieces((p) => [...p, 1])}>
          Add square (1)
        </button>
        <button className="btn ghost" type="button" disabled={total + 2 > targetLength} onClick={() => setPieces((p) => [...p, 2])}>
          Add domino (2)
        </button>
        <button className="btn ghost" type="button" disabled={pieces.length === 0} onClick={() => setPieces((p) => p.slice(0, -1))}>
          Remove last
        </button>
      </div>
    </div>
  );
}

function buildingAndCombiningProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "build2D") {
    const kind = pick(BUILDABLE_KINDS);
    const label = SHAPE_LABELS[kind];
    const n = shapeAttributes(kind).sides;
    return {
      title: "Build a shape with sticks",
      bucket,
      story: `Build a ${label} by placing a stick on every side.`,
      // Once built, the finished shape stays up so step 2 has sticks to count
      // (its "Show me" counts them along, one at a time).
      visual: (done, help) =>
        done >= 1 ? (
          <StickBuilder kind={kind} placed={Array.from({ length: n }, (_, i) => i)} tone="a" countAlong={!!help?.showMe && help.step === 1} />
        ) : (
          <div className="muted small">Use the sticks in the panel on the right to build it.</div>
        ),
      steps: [
        customStep(
          { prompt: `Place a stick on every side of this ${label.toLowerCase()}.`, hint: "Click each dashed gap to drop a stick in it, in any order.", explain: `You built a ${label} using ${n} sticks.` },
          (onDone) => <StickBuilderWidget kind={kind} onDone={onDone} />,
          `Built using ${n} sticks`
        ),
        { kind: "number", showMe: countAlongText(n, "sticks"), showMeHoldMs: countAlongMs(n), prompt: `How many sticks did you need to build this ${label.toLowerCase()}?`, hint: "That's the same as the number of sides it has.", explain: `A ${label.toLowerCase()} has ${n} sides, so it took ${n} sticks.`, answer: n },
      ],
      wrapUp: `You built a ${label} out of ${n} sticks.`,
    };
  }

  if (bucket === "build3D") {
    return {
      title: "Build a cube frame",
      bucket,
      story: "Build a cube's wireframe out of clay (corners) and sticks (edges).",
      // Once built, the finished frame stays up so step 2 has corners to count
      // (its "Show me" counts them along, one at a time).
      visual: (done, help) =>
        done >= 1 ? (
          <CubeFramePreview presentEdges={CUBE_EDGES.map((_, i) => i)} tone="b" countCorners={!!help?.showMe && help.step === 1} />
        ) : (
          <div className="muted small">Use the sticks in the panel on the right to build it.</div>
        ),
      steps: [
        customStep(
          { prompt: "Place a stick on every edge of this cube.", hint: "Click each dashed gap to drop a stick in it, in any order.", explain: `You built a cube frame using ${CUBE_EDGES.length} sticks and ${CUBE_VERTICES.length} clay corners.` },
          (onDone) => <CubeFrameWidget onDone={onDone} />,
          `Built using ${CUBE_EDGES.length} sticks`
        ),
        { kind: "number", showMe: countAlongText(CUBE_VERTICES.length, "clay corners"), showMeHoldMs: countAlongMs(CUBE_VERTICES.length), prompt: "How many clay corners does a cube frame have?", hint: "Count every dot where sticks meet.", explain: `A cube has ${CUBE_VERTICES.length} corners.`, answer: CUBE_VERTICES.length },
      ],
      wrapUp: `You built a cube frame using ${CUBE_EDGES.length} sticks and ${CUBE_VERTICES.length} clay corners.`,
    };
  }

  if (bucket === "composeSingleTarget") {
    // Randomize WHICH valid recipe this problem demonstrates, not just the
    // numbers inside it — two different (but each single-target) ways to
    // compose a bigger shape out of smaller ones.
    const recipe = pick(COMPOSE_RECIPES);
    const otherLabels = COMPOSE_RECIPES.filter((r) => r.id !== recipe.id).map((r) => r.resultLabel);
    return {
      title: "Compose a shape",
      bucket,
      story: `Put the ${recipe.pieceLabel.toLowerCase()}s together to make one bigger shape.`,
      // Once composed, the finished shape stays up for step 2 ("Look at the finished outline").
      visual: (done) =>
        done >= 1 ? <ComposeSingle recipe={recipe} placed={recipe.slots.length} tone="c" /> : <div className="muted small">Click a piece in the panel to drop it into place.</div>,
      steps: [
        customStep(
          { prompt: `Place every ${recipe.pieceLabel.toLowerCase()} piece into the outline.`, hint: "Click a tray piece to drop it into the next open space.", explain: `Together, the ${recipe.pieceLabel.toLowerCase()}s make a ${recipe.resultLabel}.` },
          (onDone) => <ComposeSingleWidget recipe={recipe} onDone={onDone} />,
          `Makes a ${recipe.resultLabel}`
        ),
        choice(
          { prompt: "What shape did you just build?", hint: "Look at the finished outline.", explain: `The ${recipe.pieceLabel.toLowerCase()}s together make a ${recipe.resultLabel}.` },
          recipe.resultLabel,
          shuffle([...otherLabels, "Triangle", "Hexagon"]).filter((l) => l !== recipe.resultLabel).slice(0, 2)
        ),
      ],
      wrapUp: `The ${recipe.pieceLabel.toLowerCase()}s together make a ${recipe.resultLabel}.`,
    };
  }

  // composeOpenEnded
  const targetLength = randInt(3, 8);
  // Two different fills of the same strip, for step 2's "Show me".
  const allSquares = Array.from({ length: targetLength }, () => 1);
  const withDominoes = [...Array.from({ length: Math.floor(targetLength / 2) }, () => 2), ...(targetLength % 2 ? [1] : [])];
  return {
    title: "Fill the strip — many ways work",
    bucket,
    story: `Fill this strip exactly, using any mix of squares (1 unit) and dominoes (2 units) you like.`,
    // Step 2's "Show me" (and the finish) draws two different fills of the
    // same strip — never before then, since a second fill IS step 2's answer.
    visual: (done, help) => {
      if (done < 1) return <div className="muted small">Use the buttons in the panel to add or remove pieces.</div>;
      if (done < 2 && !help?.showMe) return <div className="muted small">Think about the strip you just filled.</div>;
      return (
        <div data-readaloud-part>
          <ComposeOpenStrip targetLength={targetLength} placedLengths={allSquares} tone="b" />
          <ComposeOpenStrip targetLength={targetLength} placedLengths={withDominoes} tone="b" />
        </div>
      );
    },
    steps: [
      customStep(
        { prompt: `Fill the strip so it's exactly ${targetLength} units long.`, hint: "Add squares and dominoes until the total matches exactly — there's more than one way to do it.", explain: `${targetLength} units filled exactly.` },
        (onDone) => <ComposeOpenWidget targetLength={targetLength} onDone={onDone} />,
        `${targetLength} units filled`
      ),
      choice(
        {
          prompt: "Could a different mix of squares and dominoes have also filled this strip exactly?",
          showMe: "Look: one strip is filled with all squares. The other uses dominoes. Both fill the strip exactly.",
          hint: "Think of another combination that adds up to the same total.",
          explain: "Yes — there's more than one way to fill the same strip exactly.",
        },
        "Yes",
        ["No"]
      ),
    ],
    wrapUp: `You filled a ${targetLength}-unit strip — and other combinations of pieces could have worked too.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <CubeFrameBuilder tone="a" placed={CUBE_EDGES.map((_, i) => i)} />;
}

export const buildingAndCombiningShapes: Unit = {
  id: "buildingAndCombiningShapes",
  title: "Building and Combining Shapes",
  goal: "Build a shape out of simple materials, and put smaller shapes together to make a bigger one.",
  standard: "K.G.5, K.G.6",
  keyIdea: (
    <>
      <p>Sticks joined end-to-end (no gaps, no crossing) can show a shape's sides — corners are where they meet.</p>
      <p>Putting smaller shapes together can make one bigger shape — and often there's more than one correct way to do it.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Build & Compose", make: buildingAndCombiningProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: buildingAndCombiningShapesTest,
};
