import { pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { FIGURE_ENDPOINTS, FIGURE_NAME, makeAngle, makeFigure, makeQuadWithRights, makeShapeWithOne, type AngleBand, type FigureKind } from "../lib/unit1Gen";
import type { AngleType } from "../lib/geometry";
import { AngleDrawing, FigureDrawing, ShapeDrawing } from "../diagrams/Unit1Figures";

// ---------- end-of-unit test: Points, Lines, Rays & Angle Types ----------
// 10 single-question generators. Self-contained: imports only lib/ and
// diagrams/ (shared with the unit file), NEVER the unit file itself — the
// unit file imports this one, so the other direction would be a circular
// import (see the lab brief). Every generator is exported for ModuleTest.tsx.
// No drag/custom steps: a no-feedback test must always let a wrong student
// submit, so everything here is a typed number or a choice.

type Diff = TestQuestion["difficulty"];

const ANGLE_WORD: Record<AngleType, string> = { acute: "acute", right: "right", obtuse: "obtuse" };

/** Q1-3: name a drawn segment / ray / line. */
export const identifyFigureQuestion = (kind: FigureKind, difficulty: Diff): TestQuestion[] => {
  const f = makeFigure(kind);
  return [
    {
      visual: <FigureDrawing f={f} />,
      difficulty,
      step: choice(
        {
          prompt: "What is this figure called?",
          hint: "Look at each end: does it stop at a dot, or does an arrow show it keeps going?",
          explain:
            kind === "segment"
              ? "It stops at a dot on BOTH ends, so it's a line segment — it has two endpoints."
              : kind === "ray"
                ? "It stops at a dot on one end and has an arrow on the other, so it's a ray — one endpoint, and it goes on forever in one direction."
                : "It has arrows on BOTH ends, so it's a line — it goes on forever in both directions and has no endpoints.",
        },
        FIGURE_NAME[kind],
        // ray <-> segment is the named mix-up (both look like a straight mark);
        // "line" is the "an arrow means it's a line" over-generalization.
        (["line segment", "ray", "line"] as string[]).filter((n) => n !== FIGURE_NAME[kind])
      ),
    },
  ];
};

/** Q4: how many endpoints does a segment / ray / line have? (typed) */
export const endpointCountQuestion = (kind: FigureKind, difficulty: Diff): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: {
      kind: "number",
      prompt: `How many endpoints does a ${FIGURE_NAME[kind]} have?`,
      hint: "An endpoint is where it STOPS. An arrow means it doesn't stop.",
      explain:
        kind === "segment"
          ? "A line segment stops at both ends: 2 endpoints."
          : kind === "ray"
            ? "A ray stops at one end and goes on forever the other way: 1 endpoint."
            : "A line never stops in either direction: 0 endpoints.",
      answer: FIGURE_ENDPOINTS[kind],
    },
  },
];

/** Q5-7: classify one angle drawn on the grid. "nearRight" is the hard case:
 *  within 5-12° of a right angle, so it must be checked against the grid
 *  lines, not eyeballed. */
export const angleTypeQuestion = (band: AngleBand, difficulty: Diff): TestQuestion[] => {
  const s = makeAngle(band);
  return [
    {
      visual: <AngleDrawing s={s} />,
      difficulty,
      step: choice(
        {
          prompt: s.nearRight ? "This angle is close to a square corner. What kind of angle is it really? (Check it against the grid lines.)" : "What kind of angle is this?",
          hint: "Compare it to a square corner: smaller is acute, exactly square is right, bigger is obtuse.",
          explain:
            s.type === "right"
              ? "It makes an exact square corner, so it's a right angle."
              : s.type === "acute"
                ? `It's smaller than a square corner — an acute angle.${s.nearRight ? " Close to square isn't the same as square: line it up with the grid and it falls just inside." : ""}`
                : `It opens wider than a square corner — an obtuse angle.${s.nearRight ? " Close to square isn't the same as square: line it up with the grid and it falls just outside." : ""}`,
        },
        ANGLE_WORD[s.type],
        // "right" is always a distractor on a near-right angle: the named
        // "looks square, so it's right" misconception.
        (["acute", "right", "obtuse"] as string[]).filter((w) => w !== s.type)
      ),
    },
  ];
};

/** Q8: find the one angle of a given type inside a shape. */
export const whichAngleQuestion = (target: AngleType, difficulty: Diff): TestQuestion[] => {
  const s = makeShapeWithOne(target);
  const correct = `angle ${s.letters[s.targetIdx]}`;
  return [
    {
      visual: <ShapeDrawing s={s} />,
      difficulty,
      step: choice(
        {
          prompt: `Which angle in this shape is ${target === "acute" ? "an acute" : target === "right" ? "a right" : "an obtuse"} angle?`,
          hint: "Visit each corner one at a time and compare it with a square corner on the grid.",
          explain: `Corner ${s.letters[s.targetIdx]} is the only ${target} angle in this shape. ${s.letters
            .map((l, i) => `${l}: ${s.types[i]}`)
            .join(", ")}.`,
        },
        correct,
        // the other corners — each one a different angle type, so picking it
        // means the student classified that corner wrong
        s.letters.filter((_, i) => i !== s.targetIdx).map((l) => `angle ${l}`)
      ),
    },
  ];
};

/** Q9: count the right angles in a quadrilateral (typed). */
export const countRightAnglesQuestion = (difficulty: Diff): TestQuestion[] => {
  const want = pick([0, 1, 2] as const);
  const s = makeQuadWithRights(want);
  return [
    {
      visual: <ShapeDrawing s={s} />,
      difficulty,
      step: {
        kind: "number",
        prompt: "How many right angles does this shape have?",
        hint: "A right angle is an exact square corner — both sides run along grid lines.",
        explain: `${want === 0 ? "None" : want} — ${s.letters.map((l, i) => `${l} is ${s.types[i]}`).join(", ")}.`,
        answer: want,
      },
    },
  ];
};

/** Q10: true/false trap — a ray can't be measured end to end. */
export const rayLengthTrapQuestion = (difficulty: Diff): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      {
        prompt: "True or False: you can measure how long a ray is with a ruler, from one end to the other.",
        hint: "How many ends does a ray have?",
        explain: "False — a ray has only ONE endpoint and goes on forever the other way, so there's no \"other end\" to measure to. Only a line segment has two ends you can measure between.",
      },
      "False",
      // "True" = treating a ray like a segment, the unit's named misconception
      ["True"]
    ),
  },
];

export const pointsLinesRaysAnglesTest: Unit["test"] = {
  questions: [
    () => identifyFigureQuestion("segment", "easy"),
    () => identifyFigureQuestion("ray", "medium"),
    () => identifyFigureQuestion("line", "medium"),
    () => endpointCountQuestion(pick(["ray", "line"] as FigureKind[]), "medium"),
    () => angleTypeQuestion("acute", "easy"),
    () => angleTypeQuestion("obtuse", "easy"),
    () => angleTypeQuestion("nearRight", "hard"),
    () => whichAngleQuestion(pick(["obtuse", "right", "acute"] as AngleType[]), "hard"),
    () => countRightAnglesQuestion("hard"),
    () => rayLengthTrapQuestion("medium"),
  ],
  passScore: 9,
};
