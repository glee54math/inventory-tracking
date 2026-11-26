import { useState, type ReactNode } from "react";
import { ShapeGlyph, ShapeCountable, SHAPE_LABELS, shapeAttributes, BUILDABLE_KINDS, type BuildableKind } from "../diagrams/Shape2D";
import { CUBE_BUILD_REASON, JoinBuilder, JoinBoard, BuiltShape, buildBalls, buildEdges, StickArrangementPreview, correctSegments, gappedSegments, strayStickSegments } from "../diagrams/StickBuilder";
import { CubeFramePreview, CUBE_EDGES, CUBE_VERTICES } from "../diagrams/CubeFrameBuilder";
import { ComposeBuilder, ComposePicture, ComposeOpenStrip, GapPicture, COMPOSE_RECIPES, recipeById, twoFills, twosIn, type StripFill } from "../diagrams/ComposeShapes";
import { countAlongMs, countAlongText } from "../diagrams/countAlong";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, customStep, pictureChoice, type NumberStep, type Problem, type Step } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { buildingAndCombiningShapesTest } from "./BuildingAndCombiningShapesTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck, type CheckMode } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";
import { countUp, helping, showing, shownStep } from "./labParts";

// Unit 4 is real building (review C1-29, user decision 2026-11-25): only the
// clay balls are shown and the student joins them with sticks, then checks
// "Is it closed?"; a gap or an extra stick is a wrong try. Composing: the
// student picks a piece, turns it with "Turn", and taps the spot for it; a
// piece that doesn't fit is a wrong try. "Many ways": fill a strip, then
// fill it a new way (the same mix is not new; C1-30).

type Tone = "a" | "b" | "c";

/** Clay-ball size on the cube board (review C2-14: 6 was too small to tap). */
const CUBE_BALL_R = 9;

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K-1 design, one question at a time, 4 of 6 typed. Every question has a
// "Look here" pointer (review C1-01). Explore opens on a square to build and
// 2 squares making a rectangle, so it never shows Q1's 3 sticks, Q2's square
// or Q3's 3 squares (review C1-02). Q6 (plan: "more than one way") is typed:
// three strips, two full in different ways and one with an empty square
// (review C2-10: as a Yes/No pick, a child who always tapped "Yes" passed).

const LOOK = {
  sticks: { target: "u4-sticks", label: "Explore: build with sticks", say: "Look here. Each stick is one side." },
  compose: { target: "u4-compose", label: "Explore: make a big shape", say: "Look here. Put the pieces together." },
  cube: { target: "u4-cube", label: "Explore: build a cube", say: "Look here. Count the clay balls." },
  meet: { target: "u4-cube", label: "Explore: build a cube", say: "Look here. Sticks meet at each ball." },
  strip: { target: "u4-strip", label: "Explore: fill the strip", say: "Look here. Fill it more than one way." },
};

/** CFU Q6: three strips 5 squares long. Two are full, in different ways; the
 *  middle one has an empty square. Show-it numbers the full ones 1, 2 and
 *  rings the empty square; a wrong try rings the empty square only. */
const STRIP_Q6: { fill: StripFill; gapAt?: number }[] = [{ fill: [1, 2, 1, 1] }, { fill: [2, 1, 1], gapAt: 2 }, { fill: [2, 2, 1] }];
function ThreeStrips({ mode }: { mode: CheckMode }) {
  const count = mode === "show" || mode === "done";
  let k = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", maxWidth: 340 }}>
      {STRIP_Q6.map((st, i) => {
        const full = st.gapAt === undefined;
        if (full) k += 1;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span aria-hidden style={{ width: 20, fontWeight: 800, fontSize: 20, textAlign: "center" }}>
              {count && full ? k : ""}
            </span>
            <ComposeOpenStrip targetLength={5} placedLengths={st.fill} gapAt={st.gapAt} ringGap={mode !== "ask" && !full} tone="a" />
          </div>
        );
      })}
    </div>
  );
}

const strips = (len: number, a: StripFill, b: StripFill, tone: Tone = "a", numbered = false) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", maxWidth: 320 }}>
    <ComposeOpenStrip targetLength={len} placedLengths={a} tone={tone} />
    <ComposeOpenStrip targetLength={len} placedLengths={b} tone={tone} numbered={numbered} />
  </div>
);
const box = (n: ReactNode, w = 200) => <div style={{ width: w }}>{n}</div>;

function BuildingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const toSquare = recipeById("trianglesToSquare");
  const three = recipeById("squares3ToRectangle");
  const allEdges = CUBE_EDGES.map((_, i) => i);
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="How many sticks make a triangle?"
            answer={3}
            tone="a"
            picture={(m) => box(<BuiltShape kind="triangle" countAlong={m === "show" || m === "done"} />)}
            nudge="Each stick is one side. Count the sides."
            showText="Watch and listen: one stick for each side. 1, 2, 3."
            praise="Yes! 3 sticks, one for each side."
            look={LOOK.sticks}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={2}
            prompt="Two triangles join. Square, triangle, or circle?"
            picture={box(<ComposePicture recipe={toSquare} filled={2} tone="a" />)}
            showPicture={box(<ShapeCountable kind="square" tone="a" countAlong="sides" />)}
            showText="Look at the outside: 1, 2, 3, 4. It is a square."
            options={[
              { id: "square", label: "Square" },
              { id: "triangle", label: "Triangle" },
              { id: "circle", label: "Circle" },
            ]}
            answer="square"
            why={{ triangle: "Count the outside sides. Look again.", circle: "A circle is round. This is not." }}
            praise="Yes! Two triangles make a square."
            look={LOOK.compose}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="How many squares make this rectangle?"
            answer={3}
            tone="a"
            picture={(m) => box(<ComposePicture recipe={three} filled={3} tone="a" numbered={m === "show" || m === "done"} />)}
            nudge="Count each small square inside."
            showText="Watch and listen: 1, 2, 3."
            praise="Yes! 3 squares make the rectangle."
            look={LOOK.compose}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="How many clay balls does this cube have?"
            answer={CUBE_VERTICES.length}
            tone="a"
            picture={(m) => box(<CubeFramePreview presentEdges={allEdges} tone="a" countCorners={m === "show" || m === "done"} />)}
            nudge="Count each clay ball once. Some are in the back."
            showText={`Watch and listen: ${countUp(CUBE_VERTICES.length)}.`}
            praise={`Yes! ${CUBE_VERTICES.length} clay balls.`}
            look={LOOK.cube}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={5}
            prompt="How many sticks meet at this ball?"
            answer={3}
            tone="a"
            picture={(m) => box(<CubeFramePreview presentEdges={allEdges} tone="a" ringBall={0} litBall={m === "show" || m === "done" ? 0 : undefined} />)}
            nudge="Count the sticks that touch this ball."
            why={{ 2: "One more goes to the back. Look again.", 4: "Count only the sticks at this ball." }}
            showText="One goes across, one goes down, one goes back. 1, 2, 3."
            praise="Yes! 3 sticks meet there. It is a corner."
            look={LOOK.meet}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={6}
            prompt="How many strips are full?"
            answer={2}
            tone="a"
            picture={(m) => <ThreeStrips mode={m} />}
            nudge="Look for an empty square."
            why={{ 3: "One has an empty square. Look again.", 1: "Look at every strip." }}
            showText="Watch and listen: 1, 2. One has an empty square."
            praise="Yes! 2 are full. Two different ways."
            look={LOOK.strip}
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

const RECIPE_PICKS: { id: string; label: string }[] = [
  { id: "squares2ToRectangle", label: "2 squares" },
  { id: "squares3ToRectangle", label: "3 squares" },
  { id: "squares4ToSquare", label: "4 squares" },
  { id: "trianglesToSquare", label: "2 triangles" },
  { id: "trianglesToRectangle", label: "2 long triangles" },
];

/** Fill a strip with 1-square and 2-square pieces. `onFull` gets the fill.
 *  `onEdit` is called on every Add / Take one off / Start over tap, so an old
 *  wrong-try line can be cleared while the child refills (review C3-02). */
function StripFiller({ length, onFull, said, onEdit }: { length: number; onFull: (fill: StripFill) => void; said?: ReactNode; onEdit?: () => void }) {
  const [pieces, setPieces] = useState<StripFill>([]);
  const total = pieces.reduce((a, b) => a + b, 0);
  const add = (n: number) => {
    onEdit?.();
    const next = [...pieces, n];
    setPieces(next);
    if (total + n === length) {
      onFull(next);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <ComposeOpenStrip targetLength={length} placedLengths={pieces} tone="a" />
      <div className="control-row" data-readaloud-part>
        <button className="btn ghost" type="button" disabled={total + 1 > length} onClick={() => add(1)}>
          Add 1 square
        </button>
        <button className="btn ghost" type="button" disabled={total + 2 > length} onClick={() => add(2)}>
          {/* a non-breaking hyphen, so the voice says "2 square" with no pause */}
          Add a 2‑square piece
        </button>
        <button
          className="btn ghost"
          type="button"
          disabled={pieces.length === 0}
          onClick={() => {
            onEdit?.();
            setPieces((p) => p.slice(0, -1));
          }}
        >
          Take one off
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            onEdit?.();
            setPieces([]);
          }}
        >
          Start over
        </button>
      </div>
      {said ?? (
        <ReadAloud as="p" className="muted small">
          {total} of {length} squares filled.
        </ReadAloud>
      )}
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [stickKind, setStickKind] = useState<BuildableKind>("square");
  const [stickRun, setStickRun] = useState(0);
  const [mode, setMode] = useState<"one" | "many">("one");
  const [recipeId, setRecipeId] = useState("squares2ToRectangle");
  const recipe = recipeById(recipeId);
  const [len, setLen] = useState(6);
  const [fills, setFills] = useState<number[]>([]);
  const [stripRun, setStripRun] = useState(0);
  const [stripSaid, setStripSaid] = useState<string | null>(null);
  useLookHereRequest((id) => {
    // Never a CFU answer: a square to build (Q1: triangle), 2 squares (Q2: square from triangles; Q3: 3 squares).
    if (id === "u4-sticks") setStickKind("square");
    if (id === "u4-compose") {
      setMode("one");
      setRecipeId("squares2ToRectangle");
    }
    if (id === "u4-strip") setMode("many");
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div {...lookHereSpot("u4-sticks")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          <span data-look-here-key>Tap two clay balls. A stick joins them.</span> Each stick is one side.
        </ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented
            label="Build a"
            value={stickKind}
            onChange={(k) => {
              setStickKind(k);
              setStickRun((r) => r + 1);
            }}
            options={BUILDABLE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))}
          />
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
        <div className="control-row" style={{ alignItems: "flex-start" }}>
          <div style={{ width: 110 }}>
            <ShapeGlyph kind={stickKind} tone="a" label="the shape to build" />
          </div>
          <JoinBuilder key={`${stickKind}-${stickRun}`} balls={buildBalls(stickKind)} needed={buildEdges(stickKind)} doneText={`You built a ${stickKind}!`} />
        </div>
        {/* Teaches "closed" before Practice asks for it (review E2-03). */}
        <ReadAloud as="p" className="muted small">
          Closed means no gap.
        </ReadAloud>
      </div>

      <div {...lookHereSpot("u4-cube")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          <span data-look-here-key>Build a cube. Join the clay balls.</span> Each clay ball is a corner.
        </ReadAloud>
        {/* A cube to copy beside the builder, as the flat builder shows its shape (review C2-05). */}
        <div className="control-row" style={{ alignItems: "flex-start" }}>
          <div style={{ width: 130 }}>
            <CubeFramePreview presentEdges={CUBE_EDGES.map((_, i) => i)} tone="a" />
          </div>
          <div style={{ width: 300 }}>
            <JoinBuilder balls={CUBE_VERTICES} needed={CUBE_EDGES} ballR={CUBE_BALL_R} maxWidth={300} reasons={CUBE_BUILD_REASON} doneText="You built a cube!" />
          </div>
        </div>
      </div>

      <div {...lookHereSpot("u4-compose")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          <span data-look-here-key>Put shapes together. Make a big shape.</span>
        </ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented
            label="Activity"
            value={mode}
            onChange={setMode}
            options={[
              { id: "one", label: "One shape" },
              { id: "many", label: "Many ways" },
            ]}
          />
        </div>
        {mode === "one" ? (
          <>
            <div className="control-row" data-readaloud-part>
              <Segmented label="Pieces" value={recipeId} onChange={setRecipeId} options={RECIPE_PICKS} />
            </div>
            <ReadAloud as="p" className="muted small">
              Tap a piece. Then tap a spot.
            </ReadAloud>
            <ReadAloud as="p" className="muted small">
              Tap Turn to turn it.
            </ReadAloud>
            <ComposeBuilder key={recipe.id} recipe={recipe} tone="a" doneText={`They fit! They make a ${recipe.resultLabel.toLowerCase()}.`} />
          </>
        ) : (
          <div {...lookHereSpot("u4-strip")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ReadAloud as="p" className="muted small">
              <span data-look-here-key>Fill the strip. Then fill it a new way.</span>
            </ReadAloud>
            <div className="control-row" data-readaloud-part>
              <Stepper
                label="Squares long"
                value={len}
                min={3}
                max={8}
                onChange={(n) => {
                  setLen(n);
                  setFills([]);
                  setStripSaid(null);
                  setStripRun((r) => r + 1);
                }}
                tone="a"
              />
            </div>
            <StripFiller
              key={`${len}-${stripRun}`}
              length={len}
              // "Full!" goes away once the child starts over (review C3-02).
              onEdit={() => setStripSaid(null)}
              said={
                stripSaid ? (
                  <ReadAloud as="p" className="feedback good" role="alert" autoPlayKey={`${stripSaid}|${stripRun}`}>
                    {stripSaid}
                  </ReadAloud>
                ) : undefined
              }
              onFull={(fill) => {
                const t = twosIn(fill);
                setStripSaid(fills.includes(t) ? "Full! Same pieces. Start over. Try different pieces." : fills.length === 0 ? "Full! Start over. Try a new way." : "Full! That is a new way!");
                if (!fills.includes(t)) setFills((f) => [...f, t]);
              }}
            />
          </div>
        )}
      </div>

      <div {...lookHereSpot("u4-gap")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          <span data-look-here-key>The pieces must touch. With a gap, it is not one shape.</span>
        </ReadAloud>
        <div className="control-row" data-readaloud-part style={{ alignItems: "flex-end" }}>
          <div style={{ width: 150 }}>
            <GapPicture pieces="triangles" gap={false} tone="a" />
            <ReadAloud as="p" className="small" style={{ textAlign: "center", margin: 0 }}>
              They touch.
            </ReadAloud>
          </div>
          <div style={{ width: 150 }}>
            <GapPicture pieces="triangles" gap tone="a" />
            <ReadAloud as="p" className="small" style={{ textAlign: "center", margin: 0 }}>
              There is a gap.
            </ReadAloud>
          </div>
        </div>
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

/** Spoken names for picture buttons, with no digits (a "2" on screen could be
 *  copied into a later typed step). */
const ORDINAL = ["first", "second", "third"];

/** Three pictures for "Which one has no gap / no extra stick?": the right one
 *  and two wrong ones that change from problem to problem (review C1-31). */
function closedPick(kind: BuildableKind, tone: Tone): Step {
  const label = SHAPE_LABELS[kind].toLowerCase();
  const n = shapeAttributes(kind).sides;
  const gapAsk = Math.random() < 0.5;
  const [w1, w2] = shuffle(Array.from({ length: n }, (_, i) => i)).slice(0, 2);
  const pic = (segs: ReturnType<typeof correctSegments>) => <StickArrangementPreview segments={segs} tone={tone} size={110} />;
  const opts: [string, ReactNode][] = shuffle([
    ["the one with no " + (gapAsk ? "gap" : "extra stick"), pic(correctSegments(kind, 60))],
    [gapAsk ? "one with a gap" : "one with an extra stick", pic(gapAsk ? gappedSegments(kind, 60, w1) : strayStickSegments(kind, 60, w1))],
    [gapAsk ? "another with a gap" : "another with an extra stick", pic(gapAsk ? gappedSegments(kind, 60, w2) : strayStickSegments(kind, 60, w2))],
  ]);
  const right = opts.findIndex((o) => o[0].startsWith("the one"));
  // The spoken names don't say which is right.
  const spoken: [string, ReactNode][] = opts.map((o, i) => [`the ${ORDINAL[i]} picture`, o[1]]);
  return pictureChoice(
    {
      prompt: gapAsk ? `Which ${label} has no gap? Tap it.` : `Which ${label} has no extra stick? Tap it.`,
      hint: gapAsk ? "Look for a missing stick." : "Look for an extra stick.",
      showMe: gapAsk ? "Two have a missing stick. This one is closed." : "Two have an extra stick. This one has none.",
      explain: gapAsk ? "This one has no gap." : "This one has no extra stick.",
    },
    spoken,
    right
  );
}

/** Three cube pictures: one with every stick, two each missing a different stick. */
function cubePick(tone: Tone): Step {
  const all = CUBE_EDGES.map((_, i) => i);
  const [m1, m2] = shuffle(all).slice(0, 2);
  const pics: [boolean, ReactNode][] = shuffle([
    [true, <CubeFramePreview key="all" presentEdges={all} tone={tone} />],
    [false, <CubeFramePreview key="m1" presentEdges={all.filter((e) => e !== m1)} tone={tone} />],
    [false, <CubeFramePreview key="m2" presentEdges={all.filter((e) => e !== m2)} tone={tone} />],
  ]);
  return pictureChoice(
    { prompt: "Which cube has every stick? Tap it.", hint: "Look for a missing stick.", showMe: "Two are missing a stick. This one has every stick.", explain: "This one has every stick." },
    pics.map((p, i) => [`the ${ORDINAL[i]} cube`, <div key={i} style={{ width: 110 }}>{p[1]}</div>]),
    pics.findIndex((p) => p[0])
  );
}

function buildingAndCombiningProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);
  const tone: Tone = pick(["a", "b", "c"] as const);

  if (bucket === "build2D") {
    const kind = pick(BUILDABLE_KINDS);
    const label = SHAPE_LABELS[kind].toLowerCase();
    const n = shapeAttributes(kind).sides;
    const balls = buildBalls(kind);
    const needed = buildEdges(kind);
    return {
      title: "Build with sticks",
      bucket,
      story: "",
      visual: (done, help) => {
        const at = shownStep(done, help);
        if (at === 0 && helping(help, 0)) return box(<JoinBoard balls={balls} sticks={[]} guide={needed} tone={tone} label="where the sticks go" />);
        if (at === 0 && !showing(help, 0)) return box(<ShapeGlyph kind={kind} tone={tone} label="the shape to build" />, 150);
        if (at <= 1 || showing(help, 0)) return box(<BuiltShape kind={kind} tone={tone} countAlong={showing(help, 0) || showing(help, 1)} />);
        return box(<JoinBoard balls={balls.slice(0, -1)} sticks={[]} tone={tone} label="clay balls" />, 150);
      },
      steps: [
        customStep(
          {
            prompt: `Build a ${label}. Close it all the way around.`,
            hint: "Join corner to corner, all the way around.",
            showMe: "Join each ball to the next one. Go all the way around.",
            showMeHoldMs: countAlongMs(n),
            explain: "You built it!",
          },
          (onDone, onWrong, onEdit) => <JoinBuilder balls={balls} needed={needed} onDone={onDone} onWrong={onWrong} onEdit={onEdit} tone={tone} doneText="You built it!" />,
          "Built"
        ),
        { kind: "number", prompt: "How many sticks did you use?", hint: "Count each stick once.", showMe: countAlongText(n, "sticks"), showMeHoldMs: countAlongMs(n), explain: `You used ${n} sticks.`, answer: n },
        closedPick(kind, tone),
      ],
      wrapUp: `You built a ${label} with ${n} sticks.`,
    };
  }

  if (bucket === "build3D") {
    const all = CUBE_EDGES.map((_, i) => i);
    const askBalls = Math.random() < 0.5;
    const n = askBalls ? CUBE_VERTICES.length : CUBE_EDGES.length;
    return {
      title: "Cube",
      bucket,
      story: "",
      visual: (done, help) => {
        const at = shownStep(done, help);
        if (at === 0 && helping(help, 0)) return box(<JoinBoard balls={CUBE_VERTICES} sticks={[]} guide={CUBE_EDGES as [number, number][]} ballR={CUBE_BALL_R} tone={tone} label="where the sticks go" />);
        // Before help: the cube to copy, as the flat build shows its shape (review C2-05).
        if (at === 0 && !showing(help, 0)) return box(<CubeFramePreview presentEdges={all} tone={tone} />, 160);
        if (at <= 1 || showing(help, 0))
          return box(<CubeFramePreview presentEdges={all} tone={tone} countSticks={showing(help, 0) || (showing(help, 1) && !askBalls)} countCorners={showing(help, 1) && askBalls} />);
        return box(<JoinBoard balls={CUBE_VERTICES} sticks={[]} ballR={CUBE_BALL_R} tone={tone} label="clay balls" />, 160);
      },
      steps: [
        customStep(
          {
            // Not "close it all the way around": a cube frame has no one "around" (review E3-02).
            prompt: "Build a cube like this one.",
            hint: "Make a square in front. Make one in back. Join them.",
            showMe: "Make a square in front. Make one in back. Then join them.",
            showMeHoldMs: countAlongMs(CUBE_EDGES.length),
            explain: "You built a cube!",
          },
          (onDone, onWrong, onEdit) => (
            <JoinBuilder balls={CUBE_VERTICES} needed={CUBE_EDGES as [number, number][]} ballR={CUBE_BALL_R} maxWidth={300} onDone={onDone} onWrong={onWrong} onEdit={onEdit} reasons={CUBE_BUILD_REASON} tone={tone} doneText="You built a cube!" />
          ),
          "Built"
        ),
        {
          kind: "number",
          prompt: askBalls ? "How many clay balls does it have?" : "How many sticks did you use?",
          hint: askBalls ? "Count each clay ball once. Some are in the back." : "Count each stick once.",
          showMe: countAlongText(n, askBalls ? "clay balls" : "sticks"),
          showMeHoldMs: countAlongMs(n),
          explain: askBalls ? `It has ${n} clay balls.` : `You used ${n} sticks.`,
          answer: n,
        },
        cubePick(tone),
      ],
      wrapUp: "You built a cube!",
    };
  }

  if (bucket === "composeSingleTarget") {
    const recipe = pick(COMPOSE_RECIPES);
    const result = recipe.resultLabel.toLowerCase();
    const pieces = recipe.slots.length;
    const gapPieces = pick(["triangles", "squares"] as const);
    const gap = Math.random() < 0.5;
    return {
      title: "Make a big shape",
      bucket,
      story: "",
      visual: (done, help) => {
        const at = shownStep(done, help);
        if (at >= 3) return box(<GapPicture pieces={gapPieces} gap={gap} tone={tone} ringGap={helping(help, 3) || showing(help, 3)} />);
        if (at === 0 && !showing(help, 0)) return box(<ComposePicture recipe={recipe} filled={0} tone={tone} showSpots={helping(help, 0)} blinkOutline={helping(help, 0)} />);
        return box(<ComposePicture recipe={recipe} filled={pieces} tone={tone} blinkOutline={helping(help, 1) || showing(help, 1)} numbered={showing(help, 0) || showing(help, 2)} />);
      },
      steps: [
        customStep(
          {
            prompt: `Put the ${recipe.pieceWord} in.`,
            hint: "Tap a piece. Then tap a spot.",
            showMe: "Each piece fits one spot. Turn it to fit.",
            showMeHoldMs: 1500,
            explain: "They fit!",
          },
          (onDone, onWrong, onEdit) => (
            <div>
              <ReadAloud as="p" className="muted small">
                Tap a piece. Then tap a spot.
              </ReadAloud>
              <ComposeBuilder recipe={recipe} onDone={onDone} onWrong={onWrong} onEdit={onEdit} tone={tone} />
            </div>
          ),
          "Done"
        ),
        choice(
          { prompt: "What shape did you make?", hint: "Look at the outside.", showMe: `Look at the outside. It is a ${result}.`, explain: `It is a ${result}.` },
          recipe.resultLabel,
          ["Square", "Rectangle", "Triangle", "Circle"].filter((l) => l !== recipe.resultLabel).slice(0, 2)
        ),
        {
          kind: "number",
          prompt: `How many ${recipe.pieceWord} make this ${result}?`,
          hint: "Count each piece once.",
          showMe: countAlongText(pieces, recipe.pieceWord),
          showMeHoldMs: countAlongMs(pieces),
          explain: `${pieces} ${recipe.pieceWord} make it.`,
          answer: pieces,
        },
        choice({ prompt: "Do these make one shape?", hint: "Look where they meet.", showMe: gap ? "Look: there is a gap. Not one shape." : "Look: they touch. It is one shape.", explain: gap ? "No. There is a gap." : "Yes. They touch." }, gap ? "No" : "Yes", [gap ? "Yes" : "No"]),
      ],
      wrapUp: `The ${recipe.pieceWord} make a ${result}.`,
    };
  }

  // composeOpenEnded ("Fill it up"): fill a strip, then fill it a NEW way
  // (the same mix of pieces is not new), then count the pieces you used.
  const length = randInt(3, 8);
  const store: { first: StripFill; second: StripFill } = { first: [], second: [] };
  const countStep: NumberStep = {
    kind: "number",
    prompt: "How many pieces did you use this time?",
    hint: "Count each piece once.",
    showMe: <CountText store={store} />,
    showMeHoldMs: 1500,
    explain: <ExplainText store={store} />,
    answer: 0,
  };
  // The other fill to show (and count) if "Show me" fills it in.
  const otherWay = (first: StripFill): StripFill => {
    const [ones, twos] = twoFills(length);
    return twosIn(first) === twosIn(twos) ? ones : twos;
  };
  return {
    title: "Many ways",
    bucket,
    story: "",
    visual: (done, help) => {
      const at = shownStep(done, help);
      if (at === 0) return box(<ComposeOpenStrip targetLength={length} placedLengths={[]} tone={tone} />, 320);
      if (at === 1 && !showing(help, 1)) return box(<ComposeOpenStrip targetLength={length} placedLengths={store.first} tone={tone} />, 320);
      return box(strips(length, store.first, store.second, tone, showing(help, 2)), 320);
    },
    steps: [
      customStep(
        { prompt: `Fill it up. It is ${length} squares long.`, hint: "Add pieces until it is full.", explain: "It is full!" },
        (onDone) => (
          <StripFiller
            length={length}
            onFull={(fill) => {
              store.first = fill;
              store.second = otherWay(fill);
              countStep.answer = store.second.length;
              onDone();
            }}
          />
        ),
        "Full"
      ),
      customStep(
        { prompt: "Fill it a new way.", hint: "Use different pieces this time.", showMe: "Look: this one uses different pieces.", showMeHoldMs: 1500, explain: "That is a new way!" },
        (onDone, onWrong, onEdit) => <NewWayFiller length={length} first={() => store.first} onDone={(fill) => { store.second = fill; countStep.answer = fill.length; onDone(); }} onWrong={onWrong} onEdit={onEdit} />,
        "A new way"
      ),
      countStep,
    ],
    wrapUp: "You filled it two ways! There is more than one way.",
  };
}

/** "Fill it a new way": a fill with the same mix of pieces as the first one
 *  is true but doesn't count, and it says why (review C2-13 / E2-05). The
 *  first time is not a miss, and the line is said here. From the second time
 *  it is a wrong try, and the step says the same line as its one feedback
 *  line (review C2-12), so it isn't said here too. Either line goes away
 *  when the child starts refilling, so "It is full!" never sits beside a
 *  half-empty strip (review C3-02). */
const SAME_PIECES = "It is full! Same pieces. Try different pieces.";
function NewWayFiller({ length, first, onDone, onWrong, onEdit }: { length: number; first: () => StripFill; onDone: (fill: StripFill) => void; onWrong: (reason: string) => void; onEdit: () => void }) {
  const [run, setRun] = useState(0);
  const [same, setSame] = useState(0);
  const [sayOwn, setSayOwn] = useState(false);
  return (
    <StripFiller
      key={run}
      length={length}
      onEdit={() => {
        setSayOwn(false);
        onEdit();
      }}
      said={
        same === 1 && sayOwn ? (
          <ReadAloud as="p" className="feedback bad" role="alert" autoPlayKey={`same|${same}`}>
            {SAME_PIECES}
          </ReadAloud>
        ) : undefined
      }
      onFull={(fill) => {
        if (twosIn(fill) === twosIn(first())) {
          if (same >= 1) onWrong(SAME_PIECES);
          else setSayOwn(true);
          setSame((s) => s + 1);
          setRun((r) => r + 1);
        } else onDone(fill);
      }}
    />
  );
}

function CountText({ store }: { store: { second: StripFill } }) {
  return <>{countAlongText(store.second.length, "pieces")}</>;
}
function ExplainText({ store }: { store: { second: StripFill } }) {
  return <>You used {store.second.length} pieces.</>;
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <CubeFramePreview tone="a" presentEdges={CUBE_EDGES.map((_, i) => i)} />;
}

export const buildingAndCombiningShapes: Unit = {
  id: "buildingAndCombiningShapes",
  title: "Build Shapes",
  goal: "Build shapes with sticks. Put shapes together.",
  standard: "K.G.5, K.G.6",
  keyIdea: (
    <>
      <p>Each stick is one side.</p>
      <p>Small shapes can make a big shape.</p>
      <p>There can be more than one way.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Build", make: buildingAndCombiningProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: buildingAndCombiningShapesTest,
};
