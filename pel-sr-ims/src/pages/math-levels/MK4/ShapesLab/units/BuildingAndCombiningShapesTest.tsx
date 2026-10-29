import type { ReactNode } from "react";
import { SHAPE_LABELS, shapeAttributes, BUILDABLE_KINDS } from "../diagrams/Shape2D";
import { StickArrangementPreview, correctSegments, gappedSegments, strayStickSegments } from "../diagrams/StickBuilder";
import { CUBE_EDGES, CUBE_VERTICES, CubeFramePreview } from "../diagrams/CubeFrameBuilder";
import { ComposeSingle, ComposeOpenStrip, COMPOSE_RECIPES } from "../diagrams/ComposeShapes";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Building and Combining Shapes ----------
// 10 questions from 10 generators. Self-contained, same convention as every
// other *Test.tsx in this lab. Every "which picture" question embeds both
// candidate pictures directly in the prompt and uses positional labels
// ("Picture A"/"Picture B") as the actual choices — same technique
// MK1_CountingAndCardinalityLab's reversed-numeral bucket used (see
// MATH_TSX_STYLE_GUIDE.txt) — with which position holds the correct picture
// randomized so the position itself can't be pattern-matched.

function twoPicturePrompt(leftLabel: string, left: ReactNode, rightLabel: string, right: ReactNode, question: string) {
  return (
    <>
      <p>{question}</p>
      <div className="control-row">
        <div>
          <p className="small" style={{ textAlign: "center", fontWeight: 700 }}>
            {leftLabel}
          </p>
          {left}
        </div>
        <div>
          <p className="small" style={{ textAlign: "center", fontWeight: 700 }}>
            {rightLabel}
          </p>
          {right}
        </div>
      </div>
    </>
  );
}

/** Medium: which picture correctly shows sticks forming a closed shape, vs. one with a gap. */
export const build2DGapQuestion = (): TestQuestion[] => {
  const kind = pick(BUILDABLE_KINDS);
  const correctFirst = pick([true, false]);
  const correctPic = <StickArrangementPreview segments={correctSegments(kind)} tone="a" />;
  const wrongPic = <StickArrangementPreview segments={gappedSegments(kind)} tone="b" />;
  const correctLabel = correctFirst ? "Picture A" : "Picture B";
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: twoPicturePrompt("Picture A", correctFirst ? correctPic : wrongPic, "Picture B", correctFirst ? wrongPic : correctPic, `Which picture correctly shows sticks joined with no gaps to form a ${SHAPE_LABELS[kind]}?`),
          hint: "A correctly built shape has every side closed, with no missing stick.",
          explain: `${correctLabel} shows every side closed — the other picture is missing a stick, so it isn't closed.`,
        },
        correctLabel,
        [correctFirst ? "Picture B" : "Picture A"]
      ),
    },
  ];
};

/** Medium: which picture correctly shows sticks forming a shape, vs. one with an extra stray stick. */
export const build2DStrayQuestion = (): TestQuestion[] => {
  const kind = pick(BUILDABLE_KINDS);
  const correctFirst = pick([true, false]);
  const correctPic = <StickArrangementPreview segments={correctSegments(kind)} tone="c" />;
  const wrongPic = <StickArrangementPreview segments={strayStickSegments(kind)} tone="b" />;
  const correctLabel = correctFirst ? "Picture A" : "Picture B";
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: twoPicturePrompt("Picture A", correctFirst ? correctPic : wrongPic, "Picture B", correctFirst ? wrongPic : correctPic, `Which picture correctly shows ONLY the sticks needed to form a ${SHAPE_LABELS[kind]} — no extra sticks?`),
          hint: "A correctly built shape has exactly the right number of sticks — not one more poking out.",
          explain: `${correctLabel} has exactly the sticks needed — the other picture has one extra stray stick that isn't part of the shape.`,
        },
        correctLabel,
        [correctFirst ? "Picture B" : "Picture A"]
      ),
    },
  ];
};

/** Hard: which picture shows a COMPLETE cube frame, vs. one missing an edge. */
export const build3DMissingEdgeQuestion = (): TestQuestion[] => {
  const allEdges = CUBE_EDGES.map((_, i) => i);
  const missingOne = allEdges.slice(0, -1);
  const correctFirst = pick([true, false]);
  const correctPic = <CubeFramePreview presentEdges={allEdges} tone="a" />;
  const wrongPic = <CubeFramePreview presentEdges={missingOne} tone="b" />;
  const correctLabel = correctFirst ? "Picture A" : "Picture B";
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: twoPicturePrompt("Picture A", correctFirst ? correctPic : wrongPic, "Picture B", correctFirst ? wrongPic : correctPic, "Which picture shows a COMPLETE cube frame, with a stick on every edge?"),
          hint: `A complete cube frame needs exactly ${CUBE_EDGES.length} sticks and ${CUBE_VERTICES.length} corners.`,
          explain: `${correctLabel} has a stick on all ${CUBE_EDGES.length} edges — the other picture is missing one.`,
        },
        correctLabel,
        [correctFirst ? "Picture B" : "Picture A"]
      ),
    },
  ];
};

/** Medium: production — name the shape two pieces composed into (recipe A). */
export const composeNameQuestionA = (): TestQuestion[] => {
  const recipe = COMPOSE_RECIPES[0];
  const otherLabel = COMPOSE_RECIPES[1].resultLabel;
  return [
    {
      visual: <ComposeSingle recipe={recipe} placed={recipe.slots.length} tone="a" />,
      difficulty: "medium",
      step: choice(
        { prompt: `These ${recipe.pieceLabel.toLowerCase()}s were joined together. What shape did they make?`, hint: "Look at the finished outline.", explain: `Together, the ${recipe.pieceLabel.toLowerCase()}s make a ${recipe.resultLabel}.` },
        recipe.resultLabel,
        [otherLabel, "Hexagon"]
      ),
    },
  ];
};

/** Medium: production — name the shape two pieces composed into (recipe B). */
export const composeNameQuestionB = (): TestQuestion[] => {
  const recipe = COMPOSE_RECIPES[1];
  const otherLabel = COMPOSE_RECIPES[0].resultLabel;
  return [
    {
      visual: <ComposeSingle recipe={recipe} placed={recipe.slots.length} tone="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `These ${recipe.pieceLabel.toLowerCase()}s were joined together. What shape did they make?`, hint: "Look at the finished outline.", explain: `Together, the ${recipe.pieceLabel.toLowerCase()}s make a ${recipe.resultLabel}.` },
        recipe.resultLabel,
        [otherLabel, "Triangle"]
      ),
    },
  ];
};

/** Hard: the open-ended "only one way" trap, shown with a real filled strip. */
export const openEndedOnlyOneWayTrapQuestion = (): TestQuestion[] => {
  const targetLength = randInt(4, 8);
  const pieces = targetLength % 2 === 0 ? [2, 2].concat(Array(Math.max(0, targetLength / 2 - 2)).fill(2)) : [1].concat(Array(Math.floor(targetLength / 2)).fill(2));
  return [
    {
      visual: <ComposeOpenStrip targetLength={targetLength} placedLengths={pieces} tone="c" />,
      difficulty: "hard",
      step: choice(
        {
          prompt: "This strip was filled exactly using squares and dominoes. True or false: this is the ONLY combination of pieces that could fill it exactly.",
          hint: "Could you swap two squares for one domino (or the reverse) and still fill it exactly?",
          explain: "False — many different combinations of squares and dominoes can fill the same strip exactly.",
        },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Easy: how many sticks for a hexagon. */
export const sticksForHexagonQuestion = (): TestQuestion[] => {
  const n = shapeAttributes("hexagon").sides;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many sticks do you need to build a hexagon (with a stick on every side)?", hint: "That's the same as how many sides a hexagon has.", explain: `A hexagon has ${n} sides, so it takes ${n} sticks.`, answer: n },
    },
  ];
};

/** Medium: how many corners a cube has. */
export const cubeCornersQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: "How many clay corners does a complete cube frame have?", hint: "Count every dot where sticks meet.", explain: `A cube has ${CUBE_VERTICES.length} corners.`, answer: CUBE_VERTICES.length },
    },
  ];
};

/** Easy/medium: cross-unit callback — a built-then-rotated shape is still the same shape. */
export const builtShapeRotatedQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: "You build a square out of 4 sticks. If you then turn the finished shape around, is it still a square?",
          hint: "Turning a shape never changes how many sides or corners it has.",
          explain: "Yes — turning a built shape never changes what shape it is, the same as any drawn shape.",
        },
        "Yes",
        ["No"]
      ),
    },
  ];
};

/** Hard: the "must be edge-to-edge, no gaps" rule, stated without a recipe. */
export const gapMisconceptionQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "Two shapes are placed near each other, but with a gap left between them — they aren't touching. Did they correctly compose into one bigger shape?",
          hint: "Composing shapes means joining them edge-to-edge, with no gaps.",
          explain: "No — pieces have to be joined edge-to-edge with no gaps to compose into one bigger shape. Just placing them nearby doesn't count.",
        },
        "No",
        ["Yes"]
      ),
    },
  ];
};

export const buildingAndCombiningShapesTest: Unit["test"] = {
  questions: [
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
  ],
  passScore: 9,
};
