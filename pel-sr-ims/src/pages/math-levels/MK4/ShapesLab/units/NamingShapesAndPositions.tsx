import { useState } from "react";
import { ShapeGlyph, ShapeCountable, SHAPE_KINDS, SHAPE_LABELS, TURN_DEMO_MS, shapeAttributes, type ShapeKind } from "../diagrams/Shape2D";
import { PositionScene, ManyBallsScene, BALL_SPOTS, SPOT_RELATION, RELATIONS, RELATION_LABELS, RELATION_RECIPROCAL, type Relation, type BallSpot } from "../diagrams/PositionScene";
import { FlatThingPicture, FLAT_THINGS, FLAT_THING_SHAPE, FLAT_THING_NAME, flatThingCorners } from "../diagrams/RealObjects";
import { countAlongMs, countAlongText } from "../diagrams/countAlong";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem, type Step } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { namingShapesAndPositionsTest } from "./NamingShapesAndPositionsTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";
import { helping, shapeDistractors, showing, shownStep, visibleTurn } from "./labParts";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K.G.2's headline misconception: a turned square is NOT a different shape
// called a "diamond." K-1 design, one question at a time, 2 of 5 typed.
// Each two-button pick has a twin (review C1-03) whose answer is the same
// kind as the question's, so repeating the rejected tap can't pass. The
// first wrong tap's reason plays over the twin, so it fits both.
// Every question has a "Look here" pointer (review C1-01). Explore opens on a
// triangle (not Q1's square) and on "Beside" (not Q4's or Q5's answer).

const LOOK = {
  turn: { target: "u1-turn", label: "Explore: turn a shape", say: "Look here. Turn it. Is it the same?" },
  size: { target: "u1-turn", label: "Explore: big or small", say: "Look here. Big or small, same shape." },
  sqrect: { target: "u1-sqrect", label: "Explore: square or rectangle", say: "Look here. A square's sides are all the same." },
  hidden: { target: "u1-pos-scene", label: "Explore: in front of", say: "Look here. Is part of it hidden?" },
  upDown: { target: "u1-pos", label: "Explore: where is the ball", say: "Look here. Tap a word. Watch the ball." },
};

/** A row of shapes. `numberKind` numbers that kind's shapes 1, 2, 3 (the
 *  CFU show-it, review C2-06: the picture changes with the count). */
const shapeRow = (items: { kind: ShapeKind; scale?: number; rotation?: number }[], numberKind?: ShapeKind) => {
  let k = 0;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      {items.map((it, i) => {
        const numbered = it.kind === numberKind;
        if (numbered) k += 1;
        return (
          <div key={i} style={{ width: 84, position: "relative", borderRadius: 14, outline: numbered ? "3px dashed var(--qc)" : undefined, outlineOffset: 2 }}>
            <ShapeGlyph kind={it.kind} scale={it.scale} rotation={it.rotation} tone="a" label={`shape ${i + 1}`} />
            {numbered && (
              <span aria-hidden style={{ position: "absolute", top: 2, left: 6, fontWeight: 800, fontSize: 20 }}>
                {k}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
const TRIANGLE_ITEMS: { kind: ShapeKind; scale?: number; rotation?: number }[] = [{ kind: "triangle", scale: 1.3 }, { kind: "circle" }, { kind: "triangle", scale: 0.5 }, { kind: "square" }, { kind: "triangle", rotation: 180 }];
const SQUARE_ITEMS: { kind: ShapeKind; scale?: number; rotation?: number }[] = [{ kind: "square" }, { kind: "rectangle" }, { kind: "square", rotation: 45, scale: 0.6 }, { kind: "triangle" }, { kind: "square", scale: 1.2 }];
/** `help` (the CFU show-it, review C2-06): the arrow, or the hidden part blinking. */
const scene = (relation: Relation, side: "left" | "right" = "right", help = false) => (
  <div style={{ width: 200 }}>
    <PositionScene relation={relation} side={side} help={help} />
  </div>
);
const glyph = (kind: ShapeKind, rotation: number, turnDemo = false) => (
  <div style={{ width: 170 }}>
    <ShapeGlyph kind={kind} rotation={rotation} tone="a" label="a turned shape" turnDemo={turnDemo} />
  </div>
);

function NamingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="This square got turned. Is it a square, or a new shape?"
            picture={glyph("square", 45)}
            showPicture={glyph("square", 45, true)}
            showText="Watch it turn back. It is still a square."
            options={[
              { id: "same", label: "Square" },
              { id: "new", label: "A new shape" },
            ]}
            answer="same"
            why={{ new: "Turning does not change it. Look again." }}
            praise="Yes! It is still a square."
            look={LOOK.turn}
            twin={{
              prompt: "This triangle got turned. Is it a triangle, or a new shape?",
              picture: glyph("triangle", 110),
              showPicture: glyph("triangle", 110, true),
              options: [
                { id: "same", label: "Triangle" },
                { id: "new", label: "A new shape" },
              ],
              answer: "same",
              why: { new: "Turning does not change it. Look again." },
              showText: "Watch it turn back. It is still a triangle.",
              praise: "Yes! It is still a triangle.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many triangles?"
            answer={3}
            tone="a"
            picture={(m) => shapeRow(TRIANGLE_ITEMS, m === "show" || m === "done" ? "triangle" : undefined)}
            nudge="Big ones, small ones, and turned ones count."
            why={{ 1: "Small ones and turned ones count too.", 2: "Look for a turned one too." }}
            showText="Big, small, and upside down. 1, 2, 3."
            praise="Yes! 3 triangles."
            look={LOOK.size}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="How many squares?"
            answer={3}
            tone="a"
            picture={(m) => shapeRow(SQUARE_ITEMS, m === "show" || m === "done" ? "square" : undefined)}
            nudge="Small ones and turned ones count too."
            why={{ 4: "The long one is a rectangle.", 2: "Look for a small turned one." }}
            showText="The first one, the small turned one, the big one. 1, 2, 3."
            praise="Yes! 3 squares."
            look={LOOK.sqrect}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="Where is the ball? Beside, or in front?"
            picture={scene("inFrontOf")}
            showPicture={scene("inFrontOf", "right", true)}
            showText="Look: the ball hides part of the box. The ball is in front of the box."
            options={[
              { id: "beside", label: "Beside the box" },
              { id: "inFrontOf", label: "In front of the box" },
            ]}
            answer="inFrontOf"
            why={{ beside: "Something is hidden. Look again." }}
            praise="Yes! The ball is in front of the box."
            look={LOOK.hidden}
            twin={{
              prompt: "Where is the ball? Beside, or behind?",
              picture: scene("behind", "left"),
              showPicture: scene("behind", "left", true),
              options: [
                { id: "beside", label: "Beside the box" },
                { id: "behind", label: "Behind the box" },
              ],
              answer: "behind",
              why: { beside: "Something is hidden. Look again." },
              showText: "Look: the box hides part of the ball. The ball is behind the box.",
              praise: "Yes! The ball is behind the box.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={5}
            prompt="Where is the ball? Above, or below?"
            picture={scene("below")}
            showPicture={scene("below", "right", true)}
            showText="Look: the ball is under the box. The ball is below the box."
            options={[
              { id: "above", label: "Above the box" },
              { id: "below", label: "Below the box" },
            ]}
            answer="below"
            why={{ above: "Above means on top. Look again." }}
            praise="Yes! The ball is below the box."
            look={LOOK.upDown}
            twin={{
              prompt: "Where is the ball? Above, or beside?",
              picture: scene("beside", "left"),
              showPicture: scene("beside", "left", true),
              options: [
                { id: "above", label: "Above the box" },
                { id: "beside", label: "Beside the box" },
              ],
              answer: "beside",
              why: { above: "Above means on top. Look again." },
              showText: "Look: the ball is next to the box. It is beside the box.",
              praise: "Yes! The ball is beside the box.",
            }}
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

const SCALES: { id: string; label: string; value: number }[] = [
  { id: "small", label: "Small", value: 0.55 },
  { id: "middle", label: "Middle", value: 1 },
  { id: "big", label: "Big", value: 1.4 },
];

/** Tap each side, then each corner, of a square (user decision 2026-11-25:
 *  Unit 1 teaches sides and corners, so Units 1-2 may use the words). */
function SidesAndCornersLine() {
  const [sides, setSides] = useState(0);
  const [corners, setCorners] = useState(0);
  const [round, setRound] = useState(0);
  return (
    <div {...lookHereSpot("u1-parts")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <ReadAloud as="p" className="muted small">
        Sides are straight. Corners are where sides meet.
      </ReadAloud>
      <div className="control-row" data-readaloud-part style={{ alignItems: "flex-start" }}>
        <div style={{ width: 170 }}>
          <ShapeCountable key={`s${round}`} kind="square" tone="a" tapWhat="sides" onTapCount={setSides} label="a square: tap its sides" />
          <ReadAloud as="p" className="feedback good" style={{ textAlign: "center", minHeight: 24 }}>
            {sides < 4 ? "Tap each side." : "A square has 4 sides."}
          </ReadAloud>
        </div>
        <div style={{ width: 170 }}>
          <ShapeCountable key={`c${round}`} kind="square" tone="a" tapWhat="corners" onTapCount={setCorners} label="a square: tap its corners" />
          <ReadAloud as="p" className="feedback good" style={{ textAlign: "center", minHeight: 24 }}>
            {corners < 4 ? "Tap each corner." : "It has 4 corners."}
          </ReadAloud>
        </div>
      </div>
      <div className="control-row" data-readaloud-part>
        <button
          className="btn ghost"
          onClick={() => {
            setRound((r) => r + 1);
            setSides(0);
            setCorners(0);
          }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [kind, setKind] = useState<ShapeKind>("triangle");
  const [rotation, setRotation] = useState(0);
  const [scaleId, setScaleId] = useState("middle");
  const scale = SCALES.find((s) => s.id === scaleId)?.value ?? 1;
  // "It is still a …" only once the shape was turned or resized (review C2-15 / E2-10).
  const [changed, setChanged] = useState(false);

  const [relation, setRelation] = useState<Relation>("beside");
  const [side, setSide] = useState<"left" | "right">("right");
  const pickRelation = (r: Relation) => {
    // "Beside" goes to the other side each time it is picked (no left/right words: E1-19).
    if (r === "beside") setSide((s) => (s === "right" ? "left" : "right"));
    setRelation(r);
  };
  useLookHereRequest((id) => {
    // Show the teaching, not a CFU answer: a hexagon (Q1 is a square, its twin a triangle),
    // "in front of" for Q4 (its 2nd miss is on the "behind" twin), "above" for Q5.
    if (id === "u1-turn") {
      setKind("hexagon");
      setRotation(30);
      setChanged(true);
    }
    if (id === "u1-pos-scene") setRelation("inFrontOf");
    if (id === "u1-pos") setRelation("above");
  });
  const turned = rotation % 90 !== 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div {...lookHereSpot("u1-turn")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          Pick a shape. Turn it. Make it big or small.
        </ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented
            label="Shape"
            value={kind}
            onChange={(k) => {
              setKind(k);
              setRotation(0);
              setChanged(false);
            }}
            options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))}
          />
          <Segmented
            label="Size"
            value={scaleId}
            onChange={(id) => {
              setScaleId(id);
              setChanged(true);
            }}
            options={SCALES.map((s) => ({ id: s.id, label: s.label }))}
          />
          <button
            className="btn ghost"
            onClick={() => {
              setRotation((r) => (r + 45) % 360);
              setChanged(true);
            }}
          >
            Turn it
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
          <ShapeGlyph kind={kind} rotation={rotation} scale={scale} tone="a" label="the shape you picked" />
        </div>
        <ReadAloud as="p" className="feedback good">
          <span data-look-here-key>{changed ? `It is still a ${SHAPE_LABELS[kind].toLowerCase()}!` : `It is a ${SHAPE_LABELS[kind].toLowerCase()}.`}</span>
        </ReadAloud>
        {kind === "square" && turned && (
          <ReadAloud as="p" className="muted small">
            Some people call it a diamond. It is still a square.
          </ReadAloud>
        )}
      </div>

      <SidesAndCornersLine />

      <div {...lookHereSpot("u1-sqrect")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          Square or rectangle?
        </ReadAloud>
        <div className="control-row" data-readaloud-part style={{ alignItems: "flex-end" }}>
          <div style={{ width: 150 }}>
            <ShapeGlyph kind="square" tone="a" label="a square" />
            <ReadAloud as="p" className="small" style={{ textAlign: "center", margin: 0 }}>
              Square
            </ReadAloud>
          </div>
          <div style={{ width: 150 }}>
            <ShapeGlyph kind="rectangle" tone="a" label="a rectangle" />
            <ReadAloud as="p" className="small" style={{ textAlign: "center", margin: 0 }}>
              Rectangle
            </ReadAloud>
          </div>
        </div>
        <ReadAloud as="p" className="feedback good">
          <span data-look-here-key>A square's 4 sides are all the same.</span> A rectangle has 2 long sides.
        </ReadAloud>
      </div>

      <div {...lookHereSpot("u1-pos")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          Tap a word. See where the ball goes.
        </ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented label="Where is the ball?" value={relation} onChange={pickRelation} options={RELATIONS.map((r) => ({ id: r, label: RELATION_LABELS[r] }))} />
        </div>
        <div {...lookHereSpot("u1-pos-scene")} style={{ maxWidth: 220 }}>
          <PositionScene relation={relation} side={side} />
        </div>
        <ReadAloud as="p" className="feedback good">
          <span data-look-here-key>The ball is {RELATION_LABELS[relation].toLowerCase()} the box.</span>
          {relation === "beside" && " Beside means next to."}
          {relation === "inFrontOf" && " The ball hides part of the box."}
          {relation === "behind" && " The box hides part of the ball."}
        </ReadAloud>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <NamingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "standardOrientation" | "rotatedOrResized" | "realObject2D" | "positionDescribe" | "positionVocabPrecision";
const BUCKETS: Bucket[] = ["standardOrientation", "rotatedOrResized", "realObject2D", "positionDescribe", "positionVocabPrecision"];

/** The typed "How many corners?" step (review C1-06), about `what` ("it", "the door"). */
function cornersStep(n: number, what: string): Step {
  return {
    kind: "number",
    prompt: `How many corners does ${what} have?`,
    hint: n === 0 ? "Look all the way around. Is there a corner?" : "Count the dots. Count each one once.",
    showMe: countAlongText(n, "corners"),
    showMeHoldMs: n === 0 ? 2600 : countAlongMs(n),
    explain: n === 0 ? "It is round. It has no corners." : `It has ${n} corners.`,
    answer: n,
  };
}

function nameShapeProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(["standardOrientation", "rotatedOrResized", "realObject2D"] as const);

  if (bucket === "realObject2D") {
    // K.G.1: name the shape of a real thing (review C1-15, user decision).
    const thing = pick(FLAT_THINGS);
    const shape = FLAT_THING_SHAPE[thing];
    const label = SHAPE_LABELS[shape].toLowerCase();
    const name = FLAT_THING_NAME[thing];
    const corners = flatThingCorners(thing);
    const round = corners === 0;
    return {
      title: "Things",
      bucket,
      story: "",
      visual: (_done, help) => (
        <FlatThingPicture
          thing={thing}
          tone="a"
          outline={helping(help, 0) || showing(help, 0)}
          cornerDots={helping(help, 1)}
          countCorners={showing(help, 1)}
          traceDot={round && (helping(help, 1) || showing(help, 1))}
        />
      ),
      steps: [
        choice(
          { prompt: `What shape is ${name}?`, hint: "Look at its shape. Look for corners.", showMe: `Look: ${name} is a ${label}.`, explain: "Yes! You named it." },
          SHAPE_LABELS[shape],
          shapeDistractors(shape, false)
        ),
        cornersStep(corners, name),
      ],
      wrapUp: `${name[0].toUpperCase()}${name.slice(1)} is a ${label}.`,
    };
  }

  const kind = pick(SHAPE_KINDS);
  let rotation = 0;
  let scale = 1;
  let change: "none" | "turned" | "smaller" | "bigger" = "none";
  if (bucket === "rotatedOrResized") {
    const variant = kind === "circle" ? "resize" : pick(["rotate", "rotate", "resize"] as const);
    if (variant === "rotate") {
      rotation = visibleTurn(kind);
      change = "turned";
    } else {
      scale = pick([0.55, 1.45]);
      change = scale < 1 ? "smaller" : "bigger";
    }
  }
  const label = SHAPE_LABELS[kind];
  const lower = label.toLowerCase();
  const corners = shapeAttributes(kind).corners;
  const round = kind === "circle";
  const story = change === "turned" ? "It got turned." : change === "smaller" ? "It got smaller." : change === "bigger" ? "It got bigger." : "";
  // Step 1's Show me: a turned or resized shape goes back to usual; a plain
  // one gets dots on its corners (a circle: a dot runs round its edge). No
  // numbers: step 2 asks how many corners.
  const nameShowMe =
    change === "turned"
      ? `Watch it turn back. It is a ${lower}.`
      : change !== "none"
        ? `Watch it go back. It is a ${lower}.`
        : round
          ? "Look: it is round. It is a circle."
          : `Look at the sides and corners. It is a ${lower}.`;
  return {
    title: "Shapes",
    bucket,
    story,
    visual: (_done, help) => {
      const demo0 = showing(help, 0);
      return (
        <ShapeGlyph
          kind={kind}
          rotation={rotation}
          scale={scale}
          tone="a"
          label="a shape to name"
          turnDemo={demo0 && change !== "none"}
          cornerDots={helping(help, 0) || helping(help, 1) || (demo0 && change === "none")}
          countCorners={showing(help, 1)}
          traceDot={round && (helping(help, 0) || helping(help, 1) || showing(help, 0) || showing(help, 1))}
          bigZero={round && showing(help, 1)}
        />
      );
    },
    steps: [
      choice(
        {
          prompt: "What shape is it?",
          hint: round ? "Is it round? Look all around it." : "Look at the dots. Count the corners.",
          showMe: nameShowMe,
          showMeHoldMs: change !== "none" ? TURN_DEMO_MS : 2000,
          explain: "Yes! You named it.",
        },
        label,
        shapeDistractors(kind, kind === "square")
      ),
      cornersStep(corners, "it"),
    ],
    wrapUp: change === "turned" ? `It is a ${lower}. Turned or not!` : change !== "none" ? `It is a ${lower}. Big or small!` : `It is a ${lower}.`,
  };
}

/** What the ball is told to look at, per relation (E1-16). */
const POSITION_HINT: Record<Relation, string> = {
  above: "Look: is the ball up or down?",
  below: "Look: is the ball up or down?",
  beside: "Look: is part of it hidden?",
  inFrontOf: "Look: is part of it hidden?",
  behind: "Look: is part of it hidden?",
};
const POSITION_SHOW: Record<Relation, string> = {
  above: "Look: the ball is up, on top. It is above.",
  below: "Look: the ball is down, under the box.",
  beside: "Look: the ball is next to the box.",
  inFrontOf: "Look: the ball hides part of the box.",
  behind: "Look: the box hides part of the ball.",
};
/** "Where is the box?" buttons for each relation: the right one first (user
 *  decision: keep the reverse item, reworded; E1-15). */
const BOX_CHOICES: Record<Relation, Relation[]> = {
  above: ["below", "above", "beside"],
  below: ["above", "below", "beside"],
  beside: ["beside", "above", "inFrontOf"],
  inFrontOf: ["behind", "inFrontOf", "beside"],
  behind: ["inFrontOf", "behind", "beside"],
};
const lowerRel = (r: Relation) => RELATION_LABELS[r].toLowerCase();
const theBall = (r: Relation) => `${RELATION_LABELS[r]} the ball`;

/** The many-balls scene for the typed step: `count` balls in the asked area
 *  (0 to 3, chosen first so each is equally likely; review C2-07) and 1-3
 *  more somewhere else. */
function manyBalls(): { ask: "above" | "below" | "beside"; count: number; spots: BallSpot[] } {
  const ask = pick(["above", "below", "beside"] as const);
  const count = pick([0, 1, 2, 3]);
  const mine = shuffle(BALL_SPOTS.filter((s) => SPOT_RELATION[s] === ask)).slice(0, count);
  const others = shuffle(BALL_SPOTS.filter((s) => SPOT_RELATION[s] !== ask)).slice(0, pick([1, 2, 3]));
  return { ask, count, spots: [...mine, ...others] };
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
  const [boxRight, ...boxWrong] = BOX_CHOICES[relation];
  const many = manyBalls();
  const balls = many.count === 1 ? "ball" : "balls";
  // A K-friendly zero line: "No balls are above the box." (review C2-07).
  const manyLine = many.count === 0 ? `No balls are ${many.ask} the box.` : `${many.count} ${balls} ${many.count === 1 ? "is" : "are"} ${many.ask} the box.`;
  return {
    title: "Ball and box",
    bucket,
    story: "",
    visual: (done, help) => {
      if (shownStep(done, help) >= 2) {
        return <ManyBallsScene spots={many.spots} ring={helping(help, 2) ? many.ask : undefined} numberWhere={showing(help, 2) ? many.ask : undefined} />;
      }
      return <PositionScene relation={relation} side={side} help={helping(help, 0) || showing(help, 0)} ringBox={helping(help, 1) || showing(help, 1)} />;
    },
    steps: [
      choice({ prompt: "Where is the ball?", hint: POSITION_HINT[relation], showMe: POSITION_SHOW[relation], explain: `The ball is ${lowerRel(relation)} the box.` }, correct, distractors),
      choice(
        {
          prompt: `The ball is ${lowerRel(relation)} the box. Where is the box?`,
          hint: "Look at the box.",
          showMe: `Look at the box. It is ${lowerRel(reciprocal)} the ball.`,
          explain: `The box is ${lowerRel(reciprocal)} the ball.`,
        },
        theBall(boxRight),
        boxWrong.map(theBall)
      ),
      {
        kind: "number",
        prompt: `More balls! How many balls are ${many.ask} the box?`,
        hint: many.ask === "above" ? "Look up high, over the box." : many.ask === "below" ? "Look down low, under the box." : "Look next to the box.",
        showMe: countAlongText(many.count, balls),
        showMeHoldMs: countAlongMs(many.count),
        explain: manyLine,
        answer: many.count,
      },
    ],
    wrapUp: manyLine,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <ShapeGlyph kind="square" rotation={45} scale={1} tone="a" label="a turned square" />;
}

export const namingShapesAndPositions: Unit = {
  id: "namingShapesAndPositions",
  title: "Name It. Where Is It?",
  goal: "Name shapes, even turned ones. Tell where the ball is.",
  standard: "K.G.1, K.G.2",
  keyIdea: (
    <>
      <p>Turn a shape. It is the same shape.</p>
      <p>Big or small, it is the same shape.</p>
      <p>Above, below, beside, in front of, behind.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  reintroEverySolved: 20,
  preview: Preview,
  problems: [
    { label: "Shapes", make: nameShapeProblem, buckets: ["standardOrientation", "rotatedOrResized", "realObject2D"] },
    { label: "Ball and box", make: positionProblem, buckets: ["positionDescribe", "positionVocabPrecision"] },
  ],
  requiredBuckets: BUCKETS,
  test: namingShapesAndPositionsTest,
};
