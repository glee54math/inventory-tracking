import { ShapeCanvas, ShapeTile, DEFINING_ATTRIBUTE, SHAPE_NAMES, SHAPE_COLORS, SHAPE_COLOR_NAMES, type ShapeKind } from "../diagrams/ShapeTile";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Defining Attributes of Shapes ----------
// 10 single-question generators across the 4 Practice buckets (defining,
// nondefining-trap, sort, build) plus 2 pure true/false generalization
// checks — self-contained (not importing from DefiningAttributes.tsx),
// same independence convention as every other *Test.tsx in this app.
// Individual generators are exported so ModuleTest.tsx can draw a
// cumulative sample from this unit's own question shapes.

const CATEGORIES: ShapeKind[] = ["triangle", "square", "rectangle", "circle"];
const ROTATIONS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300, 330];

const SHORT_ATTRIBUTE: Record<ShapeKind, string> = {
  triangle: "It has 3 straight sides.",
  square: "It has 4 equal-length straight sides and 4 square corners.",
  rectangle: "It has 4 straight sides and 4 square corners.",
  trapezoid: "It has 4 straight sides, with one pair running the same direction.",
  circle: "It has one curved edge and no straight sides.",
  halfCircle: "It has one curved edge and one straight edge.",
  quarterCircle: "It has one curved edge and two straight edges meeting in a square corner.",
};

const randomColorIdx = () => randInt(0, SHAPE_COLORS.length - 1);

/** Q1 — vocabulary: what makes a shown shape that category. */
export const definingVocabQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const kind = pick(CATEGORIES);
  const rotation = pick(ROTATIONS);
  const size = randInt(26, 54);
  const colorIdx = randomColorIdx();
  return [
    {
      visual: (
        <ShapeCanvas width={120} height={110} label={`A ${SHAPE_COLOR_NAMES[colorIdx]} ${SHAPE_NAMES[kind]}`}>
          <ShapeTile kind={kind} cx={60} cy={55} size={size} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
        </ShapeCanvas>
      ),
      difficulty,
      step: choice(
        {
          prompt: `What makes this shape a ${SHAPE_NAMES[kind]}?`,
          hint: `Think about what's true of every ${SHAPE_NAMES[kind]}.`,
          explain: SHORT_ATTRIBUTE[kind],
        },
        SHORT_ATTRIBUTE[kind],
        [`It's ${SHAPE_COLOR_NAMES[colorIdx]}.`, "It's this exact size."]
      ),
    },
  ];
};

/** Q2 — invariance: the same category shown two very different ways. */
export const definingInvarianceQuestion = (difficulty: "easy" | "medium" | "hard"): TestQuestion[] => {
  const kind = pick(CATEGORIES);
  const c1 = randomColorIdx();
  let c2 = randomColorIdx();
  while (c2 === c1) c2 = randomColorIdx();
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 14 }}>
          <ShapeCanvas width={90} height={90} label={`Shape 1: a small ${SHAPE_NAMES[kind]}`}>
            <ShapeTile kind={kind} cx={45} cy={48} size={26} rotation={0} color={SHAPE_COLORS[c1]} />
          </ShapeCanvas>
          <ShapeCanvas width={120} height={120} label={`Shape 2: a large ${SHAPE_NAMES[kind]}, rotated`}>
            <ShapeTile kind={kind} cx={60} cy={60} size={48} rotation={125} color={SHAPE_COLORS[c2]} />
          </ShapeCanvas>
        </div>
      ),
      difficulty,
      step: choice(
        {
          prompt: "Which statement is true about Shape 1 and Shape 2?",
          hint: "Check each one's defining attribute, not its size/color/turn.",
          explain: `Both have ${DEFINING_ATTRIBUTE[kind]}, so both are ${SHAPE_NAMES[kind]}s.`,
        },
        `Both shapes are ${SHAPE_NAMES[kind]}s.`,
        [`Only Shape 1 is a ${SHAPE_NAMES[kind]}.`, `Only Shape 2 is a ${SHAPE_NAMES[kind]}.`]
      ),
    },
  ];
};

/** Q3 — non-defining claim trap. */
export const nonDefiningClaimQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const kind = pick(CATEGORIES);
  const colorIdx = randomColorIdx();
  const rotation = pick(ROTATIONS.filter((r) => r !== 0));
  return [
    {
      visual: (
        <ShapeCanvas width={130} height={110} label={`A ${SHAPE_COLOR_NAMES[colorIdx]} ${SHAPE_NAMES[kind]}, turned`}>
          <ShapeTile kind={kind} cx={65} cy={55} size={44} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
        </ShapeCanvas>
      ),
      difficulty,
      step: choice(
        {
          prompt: `Someone says: "This isn't a real ${SHAPE_NAMES[kind]} — it's ${SHAPE_COLOR_NAMES[colorIdx]} and turned sideways." Are they right?`,
          hint: "Color and orientation never change what shape something is.",
          explain: "Color and orientation are not defining attributes.",
        },
        "No — color and orientation don't change what shape it is.",
        [`Yes — a ${SHAPE_NAMES[kind]} has to be a certain color.`, `Yes — a ${SHAPE_NAMES[kind]} has to point a certain way.`]
      ),
    },
  ];
};

/** Q4 — which attribute listed is non-defining. */
export const nonDefiningWhichTrueQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const kind = pick(CATEGORIES);
  const colorIdx = randomColorIdx();
  return [
    {
      visual: (
        <ShapeCanvas width={110} height={100} label={`A ${SHAPE_COLOR_NAMES[colorIdx]} ${SHAPE_NAMES[kind]}`}>
          <ShapeTile kind={kind} cx={55} cy={50} size={38} rotation={pick(ROTATIONS)} color={SHAPE_COLORS[colorIdx]} />
        </ShapeCanvas>
      ),
      difficulty,
      step: choice(
        {
          prompt: `Which of these describes the shape, but does NOT make it a ${SHAPE_NAMES[kind]}?`,
          hint: "One of these is true of the picture but isn't part of the definition.",
          explain: `${SHORT_ATTRIBUTE[kind]} is what makes it a ${SHAPE_NAMES[kind]} — color is just how it looks.`,
        },
        `It's ${SHAPE_COLOR_NAMES[colorIdx]}.`,
        [SHORT_ATTRIBUTE[kind], "Its sides are straight."]
      ),
    },
  ];
};

/** Q5 — true/false: rotating/resizing a square. */
export const rotatedSquareTrueFalseQuestion = (): TestQuestion[] => [
  {
    visual: (
      <div style={{ display: "flex", gap: 14 }}>
        <ShapeCanvas width={80} height={80} label="A small upright square">
          <ShapeTile kind="square" cx={40} cy={40} size={24} rotation={0} color={SHAPE_COLORS[1]} />
        </ShapeCanvas>
        <ShapeCanvas width={120} height={120} label="A larger square turned like a diamond">
          <ShapeTile kind="square" cx={60} cy={60} size={44} rotation={45} color={SHAPE_COLORS[4]} />
        </ShapeCanvas>
      </div>
    ),
    difficulty: "medium",
    step: choice(
      {
        prompt: "True or False: a shape stops being a square if you make it bigger or turn it sideways.",
        hint: "Both shapes above have 4 equal sides and 4 square corners.",
        explain: "False — both are still squares. Size and orientation are never defining attributes.",
      },
      "False",
      ["True"]
    ),
  },
];

/** Q6 — sort: count how many match the target category. */
export const sortCountQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const targetKind = pick(CATEGORIES);
  const otherKind = pick(CATEGORIES.filter((k) => k !== targetKind));
  const oddPosition = randInt(0, 4);
  const pieces = Array.from({ length: 5 }, (_, i) => ({
    kind: i === oddPosition ? otherKind : targetKind,
    rotation: pick(ROTATIONS),
    size: randInt(24, 48),
    colorIdx: randomColorIdx(),
  }));
  const letters = ["A", "B", "C", "D", "E"];
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {pieces.map((p, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <ShapeCanvas width={74} height={74} label={`Shape ${letters[i]}: a ${SHAPE_NAMES[p.kind]}`}>
                <ShapeTile kind={p.kind} cx={37} cy={37} size={p.size} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
              </ShapeCanvas>
              <b>{letters[i]}</b>
            </div>
          ))}
        </div>
      ),
      difficulty,
      step: {
        kind: "number",
        prompt: `How many of these 5 shapes are ${SHAPE_NAMES[targetKind]}s?`,
        hint: "Check sides and corners, not size or color.",
        explain: `4 of the 5 are ${SHAPE_NAMES[targetKind]}s; only one (a ${SHAPE_NAMES[otherKind]}) is a different category.`,
        answer: 4,
      },
    },
  ];
};

/** Q7 — sort: identify the odd-one-out letter. */
export const sortOddOneOutQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const targetKind = pick(CATEGORIES);
  const otherKind = pick(CATEGORIES.filter((k) => k !== targetKind));
  const oddPosition = randInt(0, 4);
  const pieces = Array.from({ length: 5 }, (_, i) => ({
    kind: i === oddPosition ? otherKind : targetKind,
    rotation: pick(ROTATIONS),
    size: randInt(24, 48),
    colorIdx: randomColorIdx(),
  }));
  const letters = ["A", "B", "C", "D", "E"];
  const targetLetters = letters.filter((_, i) => i !== oddPosition);
  const [decoy1, decoy2] = shuffle(targetLetters).slice(0, 2);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {pieces.map((p, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <ShapeCanvas width={74} height={74} label={`Shape ${letters[i]}: a ${SHAPE_NAMES[p.kind]}`}>
                <ShapeTile kind={p.kind} cx={37} cy={37} size={p.size} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
              </ShapeCanvas>
              <b>{letters[i]}</b>
            </div>
          ))}
        </div>
      ),
      difficulty,
      step: choice(
        {
          prompt: `Which letter is NOT a ${SHAPE_NAMES[targetKind]}?`,
          hint: `Some of the real ${SHAPE_NAMES[targetKind]}s look very different from each other.`,
          explain: `Shape ${letters[oddPosition]} is a ${SHAPE_NAMES[otherKind]} — the rest just look different because of size/color/turn.`,
        },
        letters[oddPosition],
        [decoy1, decoy2]
      ),
    },
  ];
};

type BuildTarget = "square" | "rectangle" | "triangle";
const BUILD_DESCRIPTIONS: Record<BuildTarget, string> = {
  square: "4 straight sides, all the same length",
  rectangle: "4 straight sides, with 2 sides longer than the other 2",
  triangle: "3 straight sides",
};
const BUILD_CANDIDATES: Record<BuildTarget, ShapeKind[]> = {
  square: ["square", "rectangle", "triangle", "trapezoid"],
  rectangle: ["rectangle", "square", "triangle", "trapezoid"],
  triangle: ["triangle", "square", "rectangle", "trapezoid"],
};

/** Q8 — build: pick the candidate matching a description. */
export const buildMatchQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const target = pick(["square", "rectangle", "triangle"] as BuildTarget[]);
  const candidateKinds = shuffle(BUILD_CANDIDATES[target]);
  const candidates = candidateKinds.map((k) => ({ kind: k, rotation: pick(ROTATIONS), size: randInt(28, 52), colorIdx: randomColorIdx() }));
  const letters = ["A", "B", "C", "D"];
  const correctIdx = candidateKinds.indexOf(target);
  const wrongLetters = letters.filter((_, i) => i !== correctIdx);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {candidates.map((c, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <ShapeCanvas width={84} height={84} label={`Shape ${letters[i]}: a ${SHAPE_NAMES[c.kind]}`}>
                <ShapeTile kind={c.kind} cx={42} cy={42} size={c.size} rotation={c.rotation} color={SHAPE_COLORS[c.colorIdx]} />
              </ShapeCanvas>
              <b>{letters[i]}</b>
            </div>
          ))}
        </div>
      ),
      difficulty,
      step: choice(
        {
          prompt: `Which shape (A-D) has: ${BUILD_DESCRIPTIONS[target]} — no matter its size, color, or turn?`,
          hint: "Check sides and corners on each one.",
          explain: `Shape ${letters[correctIdx]} is a ${SHAPE_NAMES[target]}: ${DEFINING_ATTRIBUTE[target]}.`,
        },
        letters[correctIdx],
        shuffle(wrongLetters).slice(0, 2)
      ),
    },
  ];
};

/** Q9 — build: why a close-but-wrong near-miss doesn't count. */
export const buildWhyNotQuestion = (): TestQuestion[] => {
  const colorIdx = randomColorIdx();
  const rotation = pick(ROTATIONS);
  return [
    {
      visual: (
        <ShapeCanvas width={110} height={100} label={`A ${SHAPE_COLOR_NAMES[colorIdx]} square`}>
          <ShapeTile kind="square" cx={55} cy={50} size={38} rotation={rotation} color={SHAPE_COLORS[colorIdx]} />
        </ShapeCanvas>
      ),
      difficulty: "hard",
      step: choice(
        {
          prompt: "Mia wanted a shape with 4 straight sides and 2 sides longer than the other 2 (a rectangle). She drew the square above instead. What's wrong with it?",
          hint: "Check the side lengths, not the color or the number of sides.",
          explain: "A square's 4 sides are all equal — none are longer than the others, so it doesn't match a rectangle's description.",
        },
        "All 4 of its sides are the same length, so none are longer than the others.",
        [`It's ${SHAPE_COLOR_NAMES[colorIdx]}.`, "It's turned the wrong way."]
      ),
    },
  ];
};

/** Q10 — generalization true/false. */
export const colorGeneralizationQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "medium",
    step: choice(
      {
        prompt: "True or False: if two shapes are different colors, they must be different kinds of shapes.",
        hint: "Color never decides what shape something is.",
        explain: "False — two shapes can be totally different colors and still be the exact same kind of shape.",
      },
      "False",
      ["True"]
    ),
  },
];

export const definingAttributesTest: Unit["test"] = {
  questions: [
    () => definingVocabQuestion("easy"),
    () => definingInvarianceQuestion("medium"),
    () => nonDefiningClaimQuestion("easy"),
    () => nonDefiningWhichTrueQuestion("medium"),
    rotatedSquareTrueFalseQuestion,
    () => sortCountQuestion("easy"),
    () => sortOddOneOutQuestion("hard"),
    () => buildMatchQuestion("medium"),
    buildWhyNotQuestion,
    colorGeneralizationQuestion,
  ],
  passScore: 9,
};
