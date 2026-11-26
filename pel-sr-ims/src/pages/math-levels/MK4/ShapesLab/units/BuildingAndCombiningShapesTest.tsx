import type { ReactNode } from "react";
import { shapeAttributes, type BuildableKind } from "../diagrams/Shape2D";
import { StickArrangementPreview, correctSegments, gappedSegments, strayStickSegments } from "../diagrams/StickBuilder";
import { CUBE_EDGES, CUBE_VERTICES, CubeFramePreview } from "../diagrams/CubeFrameBuilder";
import { ComposePicture, ComposeOpenStrip, GapPicture, COMPOSE_RECIPES, twoFills, type ComposeRecipe } from "../diagrams/ComposeShapes";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, pictureChoice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { inAnyOrder } from "./labParts";

// ---------- end-of-unit test: Build Shapes ----------
// 10 questions from 10 generators, in a new order every sitting. Self-
// contained, same convention as every other *Test.tsx in this lab. Every
// question has a picture (review C1-09 / E1-31). "Which one" questions are
// picture buttons the child taps (review C1-12 / E1-32), both pictures in
// the same color (C1-08), the right one on either side.

type Tone = "a" | "b" | "c";
const tone = (): Tone => pick(["a", "b", "c"] as const);
const box = (n: ReactNode, w = 150) => <div style={{ width: w }}>{n}</div>;

/** Two pictures as tap buttons, the right one first or second at random. */
function twoPictures(prompt: string, explain: string, right: ReactNode, wrong: ReactNode): TestQuestion["step"] {
  const rightFirst = Math.random() < 0.5;
  const opts: [string, ReactNode][] = rightFirst ? [["the first picture", right], ["the second picture", wrong]] : [["the first picture", wrong], ["the second picture", right]];
  return pictureChoice({ prompt, hint: "Look at each picture.", explain }, opts, rightFirst ? 0 : 1);
}

/** Medium: which one has no gap? (a square or a triangle) */
export const build2DGapQuestion = (): TestQuestion[] => {
  const kind = pick(["square", "triangle"] as const);
  const t = tone();
  const n = shapeAttributes(kind).sides;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: twoPictures(
        `Which ${kind} has no gap? Tap it.`,
        "This one has no gap.",
        box(<StickArrangementPreview segments={correctSegments(kind, 60)} tone={t} />),
        box(<StickArrangementPreview segments={gappedSegments(kind, 60, randInt(0, n - 1))} tone={t} />)
      ),
    },
  ];
};

/** Medium: which one has no extra stick? (a hexagon or a rectangle) */
export const build2DStrayQuestion = (): TestQuestion[] => {
  const kind = pick(["hexagon", "rectangle"] as const);
  const t = tone();
  const n = shapeAttributes(kind).sides;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: twoPictures(
        `Which ${kind} has no extra stick? Tap it.`,
        "This one has no extra stick.",
        box(<StickArrangementPreview segments={correctSegments(kind, 60)} tone={t} />),
        box(<StickArrangementPreview segments={strayStickSegments(kind, 60, randInt(0, n - 1))} tone={t} />)
      ),
    },
  ];
};

/** Hard: which cube has every stick? */
export const build3DMissingEdgeQuestion = (): TestQuestion[] => {
  const all = CUBE_EDGES.map((_, i) => i);
  const missing = randInt(0, all.length - 1);
  const t = tone();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: twoPictures(
        "Which cube has every stick? Tap it.",
        "This one has every stick.",
        box(<CubeFramePreview presentEdges={all} tone={t} />),
        box(<CubeFramePreview presentEdges={all.filter((e) => e !== missing)} tone={t} />)
      ),
    },
  ];
};

const composeName = (pool: ComposeRecipe[]): TestQuestion[] => {
  const r = pick(pool);
  return [
    {
      visual: box(<ComposePicture recipe={r} filled={r.slots.length} tone={tone()} />, 200),
      difficulty: "medium",
      step: choice(
        { prompt: `These ${r.pieceWord} join. What shape do they make?`, hint: "Look at the outside.", explain: `They make a ${r.resultLabel.toLowerCase()}.` },
        r.resultLabel,
        ["Square", "Rectangle", "Triangle", "Circle"].filter((l) => l !== r.resultLabel).slice(0, 2)
      ),
    },
  ];
};

/** Medium: triangles join — a square or a rectangle. */
export const composeNameQuestionA = (): TestQuestion[] => composeName(COMPOSE_RECIPES.filter((r) => r.pieceKind === "triangle"));
/** Medium: squares join — a rectangle or a big square. */
export const composeNameQuestionB = (): TestQuestion[] => composeName(COMPOSE_RECIPES.filter((r) => r.pieceKind === "square"));

/** Hard: "more than one way" — two strips filled two ways (Yes), or one with
 *  an empty square (No). Replaced a true/false item (review C1-09 / E1-02). */
export const openEndedOnlyOneWayTrapQuestion = (): TestQuestion[] => {
  const length = randInt(4, 7);
  const [ones, twos] = twoFills(length);
  const full = Math.random() < 0.5;
  const t = tone();
  const [top, bottom] = shuffle([ones, twos]);
  // "Not full": the second strip is one square short, with the empty square inside.
  const short = bottom.length > 1 ? bottom.slice(0, -1).concat(bottom[bottom.length - 1] === 2 ? [1] : []) : [];
  const gapAt = randInt(1, length - 2);
  return [
    {
      visual: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", maxWidth: 320 }}>
          <ComposeOpenStrip targetLength={length} placedLengths={top} tone={t} />
          {full ? <ComposeOpenStrip targetLength={length} placedLengths={bottom} tone={t} /> : <ComposeOpenStrip targetLength={length} placedLengths={short} tone={t} gapAt={gapAt} />}
        </div>
      ),
      difficulty: "hard",
      step: choice({ prompt: "Look at both strips. Are both full?", hint: "Look for an empty square.", explain: full ? "Yes. They use different pieces." : "No. One has an empty square." }, full ? "Yes" : "No", [full ? "No" : "Yes"]),
    },
  ];
};

/** Easy: count the sticks in a picture (a hexagon, a triangle or a rectangle). */
export const sticksForHexagonQuestion = (): TestQuestion[] => {
  const kind: BuildableKind = pick(["hexagon", "triangle", "rectangle"] as const);
  const n = shapeAttributes(kind).sides;
  return [
    {
      visual: box(<StickArrangementPreview segments={correctSegments(kind, 64)} tone={tone()} />, 200),
      difficulty: "easy",
      step: { kind: "number", prompt: `How many sticks make this ${kind}?`, hint: "Count each stick once.", explain: `It takes ${n} sticks.`, answer: n },
    },
  ];
};

/** Medium: count a cube's clay balls (8) or sticks (12), with the picture. */
export const cubeCornersQuestion = (): TestQuestion[] => {
  const balls = Math.random() < 0.5;
  const n = balls ? CUBE_VERTICES.length : CUBE_EDGES.length;
  return [
    {
      visual: box(<CubeFramePreview presentEdges={CUBE_EDGES.map((_, i) => i)} tone={tone()} />, 200),
      difficulty: "medium",
      step: { kind: "number", prompt: balls ? "How many clay balls does this cube have?" : "How many sticks does this cube have?", hint: "Count each one once.", explain: `It has ${n} ${balls ? "clay balls" : "sticks"}.`, answer: n },
    },
  ];
};

/** A stick shape straight, an arrow, then the same stick shape turned: the
 *  picture says "it got turned", so the prompt doesn't name the shape (review
 *  E3-01, the same fix as the Unit 1 Test's E2-01). Local to this Test file. */
function StickTurnedPair({ kind, turn, tone: t }: { kind: BuildableKind; turn: number; tone: Tone }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ width: 130 }}>
        <StickArrangementPreview segments={correctSegments(kind, 60)} tone={t} />
      </div>
      <svg viewBox="0 0 60 40" width={60} height={40} aria-hidden data-tts-skip style={{ flex: "none" }}>
        <line x1={6} y1={20} x2={44} y2={20} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
        <polygon points="54,20 40,10 40,30" fill="var(--ink)" />
      </svg>
      <div style={{ width: 130 }}>
        <StickArrangementPreview segments={correctSegments(kind, 60, turn)} tone={t} />
      </div>
    </div>
  );
}

/** Medium: a stick shape got turned. What shape is it now? (a square or a
 *  triangle; the Unit 1 Test's turned item uses drawn triangles and
 *  rectangles, so the two never look the same). The buttons always hold
 *  Square, Triangle and Rectangle, so the answer changes and isn't in the words. */
export const builtShapeRotatedQuestion = (): TestQuestion[] => {
  const kind: BuildableKind = pick(["square", "triangle"] as const);
  const label = kind === "square" ? "Square" : "Triangle";
  return [
    {
      visual: <StickTurnedPair kind={kind} turn={pick([25, 35, 45])} tone={tone()} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: "It got turned. What shape is it now?",
          hint: "Turning does not change it.",
          explain: `It is still a ${kind}.`,
        },
        label,
        // A turned square looks like a "diamond"; the other two names are the trap answers.
        ["Square", "Triangle", "Rectangle"].filter((l) => l !== label)
      ),
    },
  ];
};

/** Hard: two pieces with a gap (No) or touching (Yes). Replaced a 25-word
 *  "compose" question with no picture (review E1-30). */
export const gapMisconceptionQuestion = (): TestQuestion[] => {
  const gap = Math.random() < 0.5;
  return [
    {
      visual: box(<GapPicture pieces={pick(["triangles", "squares"] as const)} gap={gap} tone={tone()} />, 200),
      difficulty: "hard",
      step: choice({ prompt: "Do these make one shape?", hint: "Look where they meet.", explain: gap ? "No. There is a gap." : "Yes. They touch." }, gap ? "No" : "Yes", [gap ? "Yes" : "No"]),
    },
  ];
};

const QUESTIONS = [
  build2DGapQuestion,
  build2DStrayQuestion,
  build3DMissingEdgeQuestion,
  composeNameQuestionA,
  composeNameQuestionB,
  openEndedOnlyOneWayTrapQuestion,
  sticksForHexagonQuestion,
  cubeCornersQuestion,
  builtShapeRotatedQuestion,
  gapMisconceptionQuestion,
];

export const buildingAndCombiningShapesTest: Unit["test"] = {
  questions: inAnyOrder(QUESTIONS),
  passScore: 9,
};

