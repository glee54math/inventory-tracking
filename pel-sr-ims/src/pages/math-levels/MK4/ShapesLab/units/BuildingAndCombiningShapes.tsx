import { useEffect, useState } from "react";
import { SHAPE_LABELS, shapeAttributes, shapeOutline, BUILDABLE_KINDS, type BuildableKind } from "../diagrams/Shape2D";
import { StickBuilder } from "../diagrams/StickBuilder";
import { CubeFrameBuilder, CUBE_EDGES, CUBE_VERTICES } from "../diagrams/CubeFrameBuilder";
import { ComposeSingle, ComposeOpenStrip, COMPOSE_RECIPES, type ComposeRecipe } from "../diagrams/ComposeShapes";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, customStep, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { buildingAndCombiningShapesTest } from "./BuildingAndCombiningShapesTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K.G.6's composition skill is new (not just recognition), and the plan's
// named misconception is believing there's only ONE "obvious" way pieces
// can combine — the open-ended strip task directly disproves that.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: joined-end-to-end sticks show the shape's sides; count them for a triangle. */
function StickVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [wordPick, setWordPick] = useState("");
  const [countPick, setCountPick] = useState("");
  const [checked, setChecked] = useState(false);
  const wordOk = wordPick === "sides";
  const countOk = countPick === "3";
  const ok = wordOk && countOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Sticks are joined end-to-end, with no gaps and no crossing.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Joined this way, the sticks can show a shape's...{" "}
          <select className="answer" value={wordPick} onChange={(e) => setWordPick(e.target.value)} style={fieldOk(wordOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="sides">Sides</option>
            <option value="colors">Colors</option>
          </select>
        </label>
        <label>
          How many sticks do you need to build a triangle?{" "}
          <select className="answer" value={countPick} onChange={(e) => setCountPick(e.target.value)} style={fieldOk(countOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — joined end-to-end, sticks show a shape's SIDES, and a triangle needs exactly 3 of them." : "Not quite — sticks joined end-to-end with no gaps show a shape's SIDES. A triangle has 3 sides, so it needs 3 sticks."}
        </p>
      )}
    </div>
  );
}

/** Conflation: both possible shape names live in the same question. */
function TwoTrianglesConflationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [resultPick, setResultPick] = useState("");
  const [otherWayPick, setOtherWayPick] = useState("");
  const [checked, setChecked] = useState(false);
  const resultOk = resultPick === "square";
  const otherWayOk = otherWayPick === "yes";
  const ok = resultOk && otherWayOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Two triangles are joined together, edge-to-edge.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Joined one way, the two triangles can make a...{" "}
          <select className="answer" value={resultPick} onChange={(e) => setResultPick(e.target.value)} style={fieldOk(resultOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="square">Square</option>
            <option value="hexagon">Hexagon</option>
          </select>
        </label>
        <label>
          Could the SAME two triangles also make a different shape, joined a different way?{" "}
          <select className="answer" value={otherWayPick} onChange={(e) => setOtherWayPick(e.target.value)} style={fieldOk(otherWayOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — joined along their longest edge, two matching triangles make a square. Joined a different way, they could make a bigger triangle or a different shape entirely."
            : "Not quite — two matching right triangles joined along their longest edge make a SQUARE. The same two pieces could ALSO make a different shape if joined another way."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: the named misconception, stated directly. */
function OneWayTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: there is only ONE correct way to put smaller pieces together to build a bigger shape.
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
            ? "Correct — often there are MANY different ways to fill the same space with pieces, not just one 'obvious' way."
            : "Not quite — try filling the same strip with different combinations of pieces below. More than one combination can fill it exactly."}
        </p>
      )}
    </div>
  );
}

/** Multi-part: applying Unit 3's side/corner vocabulary to a 3D build. */
function DotsAndSticksQuestion({ onComplete }: { onComplete?: () => void }) {
  const [dotsPick, setDotsPick] = useState("");
  const [sticksPick, setSticksPick] = useState("");
  const [checked, setChecked] = useState(false);
  const dotsOk = dotsPick === "corners";
  const sticksOk = sticksPick === "sides";
  const ok = dotsOk && sticksOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Here is a cube frame made of clay balls and sticks.
      </p>
      <CubeFrameBuilder tone="c" placed={CUBE_EDGES.map((_, i) => i)} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What do the clay-ball DOTS represent?{" "}
          <select className="answer" value={dotsPick} onChange={(e) => setDotsPick(e.target.value)} style={fieldOk(dotsOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="corners">Corners</option>
            <option value="sides">Sides</option>
          </select>
        </label>
        <label>
          What do the STICKS represent?{" "}
          <select className="answer" value={sticksPick} onChange={(e) => setSticksPick(e.target.value)} style={fieldOk(sticksOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="corners">Corners</option>
            <option value="sides">Sides</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — the dots (clay) are the cube's corners, and the sticks are its sides (edges)." : "Not quite — the dots of clay are where corners go, and the sticks are the straight sides (edges) connecting them."}
        </p>
      )}
    </div>
  );
}

function BuildingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, twoTriangles: false, oneWayTrap: false, dotsAndSticks: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: building and combining shapes before you try practice problems.</p>
      <StickVocabQuestion onComplete={mark("vocab")} />
      <TwoTrianglesConflationQuestion onComplete={mark("twoTriangles")} />
      <OneWayTrapQuestion onComplete={mark("oneWayTrap")} />
      <DotsAndSticksQuestion onComplete={mark("dotsAndSticks")} />
    </div>
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
        <p className="muted small">Pick a shape, then click each dashed gap to drop a stick in it.</p>
        <div className="control-row">
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
        <p className="feedback good">
          {stickPlaced.length} of {stickN} sticks placed{stickPlaced.length === stickN ? ` — you built a ${SHAPE_LABELS[stickKind]}!` : "..."}
        </p>
      </div>

      {(introActive || showCheck) && <BuildingCheckForUnderstanding onComplete={onIntroDone} />}

      <div>
        <p className="muted small">Now build a cube out of clay (corners, already placed) and sticks (edges) — click each dashed gap.</p>
        <div className="control-row">
          <button className="btn ghost" onClick={() => setCubePlaced([])}>
            Start over
          </button>
        </div>
        <div style={{ maxWidth: 220 }}>
          <CubeFrameBuilder placed={cubePlaced} onToggle={toggleCubeEdge} tone="b" />
        </div>
        <p className="feedback good">
          {cubePlaced.length} of {CUBE_EDGES.length} sticks placed{cubePlaced.length === CUBE_EDGES.length ? " — you built a cube!" : "..."}
        </p>
      </div>

      <div>
        <p className="muted small">Put two shapes together to make a bigger one — or try the open-ended strip, which has MORE than one right answer.</p>
        <div className="control-row">
          <Segmented label="Activity" value={composeMode} onChange={setComposeMode} options={[{ id: "single", label: "One target shape" }, { id: "open", label: "Many ways (strip)" }]} />
        </div>
        {composeMode === "single" ? (
          <>
            <div className="control-row">
              <Segmented label="Pieces" value={recipeId} onChange={pickRecipe} options={COMPOSE_RECIPES.map((r) => ({ id: r.id, label: `${r.pieceLabel}s → ${r.resultLabel}` }))} />
              <button className="btn ghost" onClick={() => setComposedCount(0)}>
                Start over
              </button>
            </div>
            <div style={{ maxWidth: 280 }}>
              <ComposeSingle recipe={recipe} placed={composedCount} onPlace={() => setComposedCount((c) => Math.min(recipe.slots.length, c + 1))} tone="c" />
            </div>
            <p className="feedback good">
              {composedCount} of {recipe.slots.length} {recipe.pieceLabel.toLowerCase()}s placed{composedCount === recipe.slots.length ? ` — together they make a ${recipe.resultLabel}!` : "..."}
            </p>
          </>
        ) : (
          <>
            <div className="control-row">
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
            <p className="feedback good">
              {openTotal === targetLength ? "Filled exactly! Try starting over and using a different mix of pieces — more than one way works." : `${openTotal} of ${targetLength} units filled.`}
            </p>
          </>
        )}
      </div>
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
      <p className="muted small">
        {placed.length} of {n} sticks placed.
      </p>
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
      <p className="muted small">
        {placed.length} of {CUBE_EDGES.length} sticks placed.
      </p>
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
      <p className="muted small">Click a {recipe.pieceLabel.toLowerCase()} piece to drop it into the next open space.</p>
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
      <div className="control-row">
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
      visual: () => <div className="muted small">Use the sticks in the panel on the right to build it.</div>,
      steps: [
        customStep(
          { prompt: `Place a stick on every side of this ${label.toLowerCase()}.`, hint: "Click each dashed gap to drop a stick in it, in any order.", explain: `You built a ${label} using ${n} sticks.` },
          (onDone) => <StickBuilderWidget kind={kind} onDone={onDone} />,
          `Built using ${n} sticks`
        ),
        { kind: "number", prompt: `How many sticks did you need to build this ${label.toLowerCase()}?`, hint: "That's the same as the number of sides it has.", explain: `A ${label.toLowerCase()} has ${n} sides, so it took ${n} sticks.`, answer: n },
      ],
      wrapUp: `You built a ${label} out of ${n} sticks.`,
    };
  }

  if (bucket === "build3D") {
    return {
      title: "Build a cube frame",
      bucket,
      story: "Build a cube's wireframe out of clay (corners) and sticks (edges).",
      visual: () => <div className="muted small">Use the sticks in the panel on the right to build it.</div>,
      steps: [
        customStep(
          { prompt: "Place a stick on every edge of this cube.", hint: "Click each dashed gap to drop a stick in it, in any order.", explain: `You built a cube frame using ${CUBE_EDGES.length} sticks and ${CUBE_VERTICES.length} clay corners.` },
          (onDone) => <CubeFrameWidget onDone={onDone} />,
          `Built using ${CUBE_EDGES.length} sticks`
        ),
        { kind: "number", prompt: "How many clay corners does a cube frame have?", hint: "Count every dot where sticks meet.", explain: `A cube has ${CUBE_VERTICES.length} corners.`, answer: CUBE_VERTICES.length },
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
      visual: () => <div className="muted small">Click a piece in the panel to drop it into place.</div>,
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
  return {
    title: "Fill the strip — many ways work",
    bucket,
    story: `Fill this strip exactly, using any mix of squares (1 unit) and dominoes (2 units) you like.`,
    visual: () => <div className="muted small">Use the buttons in the panel to add or remove pieces.</div>,
    steps: [
      customStep(
        { prompt: `Fill the strip so it's exactly ${targetLength} units long.`, hint: "Add squares and dominoes until the total matches exactly — there's more than one way to do it.", explain: `${targetLength} units filled exactly.` },
        (onDone) => <ComposeOpenWidget targetLength={targetLength} onDone={onDone} />,
        `${targetLength} units filled`
      ),
      choice(
        {
          prompt: "Could a different mix of squares and dominoes have also filled this strip exactly?",
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
