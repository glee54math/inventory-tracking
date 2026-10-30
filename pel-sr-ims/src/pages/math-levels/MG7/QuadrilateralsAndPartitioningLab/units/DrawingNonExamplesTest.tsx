import { QuadCanvas, QuadTile, QUAD_NAMES, SHAPE_COLORS, type QuadKind } from "../diagrams/QuadTile";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { palette } from "../../../shared/lib/palette";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Drawing Quadrilaterals Outside the Named Kinds ----------
// 10 single-question generators across the 4 Practice buckets. Self-contained
// (never imports from DrawingNonExamples.tsx, which itself imports this file:
// that pair would be a circular import, the "Level not found" failure mode
// documented in VISUAL_COMPONENT_TODO.txt's MM1 entry). The two hands-on
// "build" buckets (irregular, trapezoid-like) are tested here as REASONING
// questions about a pictured shape, not drag-the-corners CustomSteps: a
// custom widget on a no-feedback test could leave a student stuck on one
// question with no way to move on, which UnitTest.tsx deliberately avoids.

const NAMED: QuadKind[] = ["square", "rectangle", "rhombus"];
const OUTSIDE: QuadKind[] = ["genericQuad", "trapezoidLike"];
const ROTATIONS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300, 330];
const randomColorIdx = () => randInt(0, SHAPE_COLORS.length - 1);

const STEP1_OPTIONS = ["Yes — it's closed with 4 straight sides.", "No — it only has 3 sides.", "No — it has 5 sides.", "No — it has a gap, so it isn't closed."];
const VERDICT_OPTIONS = ["Yes — it's a quadrilateral outside all three named kinds.", "No — it isn't even a quadrilateral.", "No — it's still a rectangle (4 square corners).", "No — it's still a rhombus (4 equal sides)."];

function OpenFigure({ color }: { color: string }) {
  return (
    <QuadCanvas width={120} height={120} label="A 4-segment shape with a gap — it isn't closed">
      <polyline points="30,30 95,38 88,92 28,85 28,48" style={{ fill: "none", stroke: color, strokeWidth: 4, strokeLinecap: "round" }} />
      <circle cx={30} cy={30} r={3.5} style={{ fill: palette.ink }} />
      <circle cx={28} cy={48} r={3.5} style={{ fill: palette.ink }} />
    </QuadCanvas>
  );
}

const single = (kind: QuadKind, rotation = 0, extra: { rectAspect?: number; rhombusRatio?: number } = {}) => (
  <QuadCanvas width={120} height={120} label={`A ${QUAD_NAMES[kind]}`}>
    <QuadTile kind={kind} cx={60} cy={60} size={34} rotation={rotation} color={SHAPE_COLORS[randomColorIdx()]} {...extra} />
  </QuadCanvas>
);

/** Q1 — baseline requirement (vocabulary). */
export const baselineQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      {
        prompt: "To draw a quadrilateral that is NOT a rhombus, rectangle, or square, your shape must still have:",
        hint: "It still has to BE a quadrilateral.",
        explain: "4 straight sides and closed. You're only avoiding the three special kinds, not the basic rule.",
      },
      "4 straight sides, and be closed",
      // Misconception: "avoid the named kinds" read as "anything goes".
      ["Any number of sides, as long as it isn't a square", "3 sides, so it can't be a rectangle"]
    ),
  },
];

function gallery() {
  const outsideCount = randInt(1, 3);
  const letters = ["A", "B", "C", "D", "E"];
  const kinds = shuffle([...Array.from({ length: outsideCount }, () => pick(OUTSIDE)), ...Array.from({ length: 5 - outsideCount }, () => pick(NAMED))]);
  const pieces = kinds.map((kind) => ({ kind, rotation: pick(ROTATIONS), colorIdx: randomColorIdx() }));
  const visual = (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {pieces.map((p, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <QuadCanvas width={75} height={75} label={`Shape ${letters[i]}: a ${QUAD_NAMES[p.kind]}`}>
            <QuadTile kind={p.kind} cx={37} cy={37} size={22} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
          </QuadCanvas>
          <b>{letters[i]}</b>
        </div>
      ))}
    </div>
  );
  return {
    visual,
    outsideCount,
    outsideLetters: letters.filter((_, i) => OUTSIDE.includes(kinds[i])),
    namedLetters: letters.filter((_, i) => NAMED.includes(kinds[i])),
  };
}

/** Q2 — identify-non-example: count. */
export const galleryCountQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const g = gallery();
  return [
    {
      visual: g.visual,
      difficulty,
      step: {
        kind: "number",
        prompt: "How many of these 5 shapes are NOT a rhombus, rectangle, or square?",
        hint: "Check each one: 4 equal sides? 4 square corners? If neither, it's outside the named kinds.",
        explain: `${g.outsideCount}: shape${g.outsideLetters.length > 1 ? "s" : ""} ${g.outsideLetters.join(", ")}.`,
        answer: g.outsideCount,
      },
    },
  ];
};

/** Q3 — identify-non-example: pick one. */
export const galleryPickQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const g = gallery();
  const correct = pick(g.outsideLetters);
  return [
    {
      visual: g.visual,
      difficulty,
      step: choice(
        {
          prompt: "Which letter is a quadrilateral outside all three named kinds?",
          hint: "A tilted square or slanted rhombus is still a named kind.",
          explain: `Shape ${correct} has neither 4 equal sides nor 4 square corners.`,
        },
        correct,
        // Misconception: a tilted/unusual-looking named shape mistaken for a non-example.
        shuffle(g.namedLetters).slice(0, 2)
      ),
    },
  ];
};

/** Q4-Q6 — self-check: a "drawing" that lost the baseline rule. */
export const lostBaselineQuestion = (which: "triangle" | "pentagon" | "open", difficulty: "medium" | "hard"): TestQuestion[] => {
  const color = SHAPE_COLORS[randomColorIdx()];
  const visual =
    which === "open" ? (
      <OpenFigure color={color} />
    ) : (
      <QuadCanvas width={120} height={120} label={`A ${which}`}>
        <QuadTile kind={which} cx={60} cy={62} size={38} color={color} />
      </QuadCanvas>
    );
  const correctStep1 = which === "triangle" ? STEP1_OPTIONS[1] : which === "pentagon" ? STEP1_OPTIONS[2] : STEP1_OPTIONS[3];
  return [
    {
      visual,
      difficulty,
      step: choice(
        {
          prompt: "A classmate was asked to draw a quadrilateral that isn't a rhombus, rectangle, or square, and drew this. Is it a closed shape with exactly 4 straight sides?",
          hint: "Count the sides, then look for any gap.",
          explain: `${correctStep1} So it can't answer the question, even though it avoids the named kinds.`,
        },
        correctStep1,
        // Misconception: "it avoids the named kinds, so it must be fine".
        STEP1_OPTIONS
      ),
    },
  ];
};

/** Q7 — self-check: an accidental (tilted) rectangle. */
export const rotatedRectangleQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => [
  {
    visual: single("rectangle", pick([20, 30, 35, 55, 120, 150]), { rectAspect: 1.9 }),
    difficulty,
    step: choice(
      {
        prompt: "A classmate tilted this shape so it wouldn't look like a rectangle. Does it count as a quadrilateral outside the named kinds?",
        hint: "Tilting doesn't change the corners.",
        explain: "No — it still has 4 square corners, so it's still a rectangle.",
      },
      VERDICT_OPTIONS[2],
      // Misconception: rotating a shape changes its category.
      [VERDICT_OPTIONS[0], VERDICT_OPTIONS[1]]
    ),
  },
];

/** Q8 — trapezoid-like: parallel sides don't make a rectangle. */
export const trapezoidQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => [
  {
    visual: (
      <QuadCanvas width={140} height={110} label="A quadrilateral with one pair of parallel sides">
        <QuadTile kind="trapezoidLike" cx={70} cy={55} size={44} trapShift={randInt(4, 14)} color={SHAPE_COLORS[randomColorIdx()]} />
      </QuadCanvas>
    ),
    difficulty,
    step: choice(
      {
        prompt: "This shape's top and bottom sides run the same direction (parallel). Is it a quadrilateral outside the named kinds?",
        hint: "A rectangle needs 4 square corners, not just parallel sides.",
        explain: "Yes — it's closed with 4 sides, its sides aren't all equal, and its corners aren't square, so it's none of the named kinds.",
      },
      VERDICT_OPTIONS[0],
      // Misconception: "parallel sides means rectangle".
      [VERDICT_OPTIONS[2], VERDICT_OPTIONS[1]]
    ),
  },
];

/** Q9 — accidental rhombus. */
export const accidentalRhombusQuestion = (difficulty: "hard"): TestQuestion[] => [
  {
    visual: single("rhombus", pick(ROTATIONS), { rhombusRatio: 1.7 }),
    difficulty,
    step: choice(
      {
        prompt: "Ana made all 4 sides the same length but slanted the corners so none are square. Does her shape count as outside the named kinds?",
        hint: "Which named kind only needs 4 equal sides?",
        explain: "No — 4 equal sides makes it a rhombus, even with slanted corners.",
      },
      VERDICT_OPTIONS[3],
      // Misconception: avoiding square corners alone is enough.
      [VERDICT_OPTIONS[0], VERDICT_OPTIONS[2]]
    ),
  },
];

/** Q10 — generalization trap. */
export const notSquareTrapQuestion = (difficulty: "hard"): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      {
        prompt: "True or False: any 4-sided shape that isn't a square automatically avoids all three named kinds.",
        hint: "Think of a long, thin rectangle.",
        explain: "False — a rectangle or a slanted rhombus isn't a square, but it's still one of the named kinds.",
      },
      "False",
      ["True"]
    ),
  },
];

export const drawingNonExamplesTest: Unit["test"] = {
  questions: [
    () => baselineQuestion("easy"),
    () => galleryCountQuestion("medium"),
    () => galleryPickQuestion("medium"),
    () => lostBaselineQuestion("triangle", "medium"),
    () => lostBaselineQuestion("pentagon", "medium"),
    () => lostBaselineQuestion("open", "hard"),
    () => rotatedRectangleQuestion("hard"),
    () => trapezoidQuestion("medium"),
    () => accidentalRhombusQuestion("hard"),
    () => notSquareTrapQuestion("hard"),
  ],
  passScore: 9,
};
