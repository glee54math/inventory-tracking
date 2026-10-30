import { ShapeCanvas, ShapeTile, CubeGlyph, DEFINING_ATTRIBUTE, CUBE_DEFINING_ATTRIBUTE, SHAPE_NAMES, SHAPE_KINDS, SIDE_COUNT, SHAPE_COLORS, SHAPE_COLOR_NAMES, VARIANT_COUNT, type ShapeKind } from "../diagrams/ShapeTile";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Classifying Shapes by Attributes ----------
// 10 single-question generators across the 4 Practice buckets (identify2d,
// identify-cube, multi-attribute, irregular-trap) plus 2 extra
// generalization/test-only checks — self-contained (never imports from
// ClassifyingShapesByAttributes.tsx), same independence convention as every
// other *Test.tsx in this app. Individual generators are exported so
// ModuleTest.tsx can draw a cumulative sample.

const ROTATIONS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300, 330];
const randomColorIdx = () => randInt(0, SHAPE_COLORS.length - 1);
const randomVariant = (kind: ShapeKind, irregularOnly = false) => (irregularOnly ? randInt(1, VARIANT_COUNT[kind] - 1) : randInt(0, VARIANT_COUNT[kind] - 1));

/** Q1 — identify2d: count sides/angles on a possibly-irregular, rotated shape. */
export const identify2dCountQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const kind = pick(SHAPE_KINDS);
  const variant = randomVariant(kind);
  return [
    {
      visual: (
        <ShapeCanvas width={120} height={120} label={`A ${SHAPE_NAMES[kind]}`}>
          <ShapeTile kind={kind} cx={60} cy={60} size={38} variant={variant} rotation={pick(ROTATIONS)} color={SHAPE_COLORS[randomColorIdx()]} />
        </ShapeCanvas>
      ),
      difficulty,
      step: { kind: "number", prompt: "How many straight sides does this shape have?", hint: "Count every straight edge, going all the way around.", explain: `It has ${SIDE_COUNT[kind]} straight sides — that's what makes it a ${SHAPE_NAMES[kind]}.`, answer: SIDE_COUNT[kind] },
    },
  ];
};

/** Q2 — identify2d: name the category from a rotated/irregular example. */
export const identify2dNameQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const kind = pick(SHAPE_KINDS);
  const variant = randomVariant(kind);
  const others = shuffle(SHAPE_KINDS.filter((k) => k !== kind)).slice(0, 2);
  return [
    {
      visual: (
        <ShapeCanvas width={120} height={120} label={`A ${SHAPE_NAMES[kind]}`}>
          <ShapeTile kind={kind} cx={60} cy={60} size={38} variant={variant} rotation={pick(ROTATIONS)} color={SHAPE_COLORS[randomColorIdx()]} />
        </ShapeCanvas>
      ),
      difficulty,
      step: choice(
        { prompt: "What is this shape called?", hint: `Count its straight sides.`, explain: `It has ${DEFINING_ATTRIBUTE[kind]}, so it's a ${SHAPE_NAMES[kind]}.` },
        SHAPE_NAMES[kind][0].toUpperCase() + SHAPE_NAMES[kind].slice(1),
        others.map((k) => k[0].toUpperCase() + k.slice(1))
      ),
    },
  ];
};

/** Q3 — identify-cube: the defining-attribute choice. */
export const cubeAttributeQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const colorIdx = randomColorIdx();
  return [
    {
      visual: (
        <ShapeCanvas width={130} height={130} label="A cube">
          <CubeGlyph cx={65} cy={65} size={34} color={SHAPE_COLORS[colorIdx]} />
        </ShapeCanvas>
      ),
      difficulty,
      step: choice(
        { prompt: "What makes this shape a cube?", hint: "A cube is a solid (3D) shape — think about its faces.", explain: CUBE_DEFINING_ATTRIBUTE },
        CUBE_DEFINING_ATTRIBUTE,
        [`It's ${SHAPE_COLOR_NAMES[colorIdx]}.`, "It has 4 straight sides."]
      ),
    },
  ];
};

/** Q4 — identify-cube: the required 2D-vs-3D conflation check. */
export const cubeVs2dQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => [
  {
    visual: (
      <ShapeCanvas width={130} height={130} label="A cube">
        <CubeGlyph cx={65} cy={65} size={34} color={SHAPE_COLORS[randomColorIdx()]} />
      </ShapeCanvas>
    ),
    difficulty,
    step: choice(
      { prompt: "Is a cube a flat (2D) shape, or a solid (3D) shape?", hint: "Does it have depth, like a box, or is it completely flat, like a drawing?", explain: "A cube is a solid (3D) shape — it has faces, edges, and depth, unlike a flat 2D shape." },
      "A solid (3D) shape",
      ["A flat (2D) shape"]
    ),
  },
];

/** Q5 — multi-attribute: pick the shape matching two constraints at once. */
export const multiAttributeQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const kind: ShapeKind = "quadrilateral";
  const correctVariant = 0;
  const wrongVariants = shuffle([1, 2, 3]).slice(0, 2);
  const allVariants = shuffle([correctVariant, ...wrongVariants]);
  const letters = ["A", "B", "C"];
  const correctIdx = allVariants.indexOf(correctVariant);
  const candidates = allVariants.map((v) => ({ variant: v, rotation: pick(ROTATIONS), size: randInt(28, 50), colorIdx: randomColorIdx() }));
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {candidates.map((c, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <ShapeCanvas width={90} height={90} label={`Shape ${letters[i]}`}>
                <ShapeTile kind={kind} cx={45} cy={45} size={c.size} variant={c.variant} rotation={c.rotation} color={SHAPE_COLORS[c.colorIdx]} />
              </ShapeCanvas>
              <b>{letters[i]}</b>
            </div>
          ))}
        </div>
      ),
      difficulty,
      step: choice(
        { prompt: "Which shape (A-C) has 4 straight sides AND all 4 sides the same length?", hint: "All 3 have 4 sides — also check which one's sides are all equal.", explain: `Shape ${letters[correctIdx]} has 4 equal-length sides; the others have 4 sides but not all the same length.` },
        letters[correctIdx],
        letters.filter((_, i) => i !== correctIdx)
      ),
    },
  ];
};

/** Q6 — irregular-trap: lopsided example still counts. */
export const irregularTrapQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const kind = pick(SHAPE_KINDS.filter((k) => k !== "triangle"));
  const variant = randomVariant(kind, true);
  return [
    {
      visual: (
        <ShapeCanvas width={140} height={120} label={`A lopsided ${SHAPE_NAMES[kind]}`}>
          <ShapeTile kind={kind} cx={70} cy={60} size={randInt(30, 56)} variant={variant} rotation={pick(ROTATIONS.filter((r) => r !== 0))} color={SHAPE_COLORS[randomColorIdx()]} />
        </ShapeCanvas>
      ),
      difficulty,
      step: choice(
        { prompt: `This shape is lopsided, not a "textbook-perfect" ${SHAPE_NAMES[kind]}. Is it still a ${SHAPE_NAMES[kind]}?`, hint: "Count its sides and angles — does the look matter?", explain: `Yes — it still has ${DEFINING_ATTRIBUTE[kind]}. Looking lopsided or uneven doesn't change the count.` },
        `Yes — it still has ${DEFINING_ATTRIBUTE[kind]}.`,
        [`No — a real ${SHAPE_NAMES[kind]} has to look even and regular.`]
      ),
    },
  ];
};

/** Q7 — generalization/true-false trap: rotation disqualifying a shape. */
export const rotationTrueFalseQuestion = (): TestQuestion[] => {
  const kind = pick(SHAPE_KINDS);
  return [
    {
      visual: (
        <ShapeCanvas width={120} height={120} label={`A rotated ${SHAPE_NAMES[kind]}`}>
          <ShapeTile kind={kind} cx={60} cy={60} size={38} variant={0} rotation={pick(ROTATIONS.filter((r) => r !== 0))} color={SHAPE_COLORS[randomColorIdx()]} />
        </ShapeCanvas>
      ),
      difficulty: "hard",
      step: choice(
        { prompt: `True or False: turning this ${SHAPE_NAMES[kind]} sideways changes what shape it is.`, hint: "Does turning a shape change its side/angle count?", explain: "False — turning a shape never changes its side/angle count, so it's still the same shape." },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Q8 — test-only generalization: sort the odd one out among same-category
 *  shapes of very different looks (not tied to a Practice bucket, same
 *  convention as MG4's own test adding beyond-bucket checks). */
export const sortOddOneOutQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const targetKind = pick(SHAPE_KINDS);
  const otherKind = pick(SHAPE_KINDS.filter((k) => k !== targetKind));
  const oddPosition = randInt(0, 3);
  const letters = ["A", "B", "C", "D"];
  const pieces = Array.from({ length: 4 }, (_, i) => ({
    kind: i === oddPosition ? otherKind : targetKind,
    variant: i === oddPosition ? 0 : randomVariant(targetKind),
    rotation: pick(ROTATIONS),
    size: randInt(26, 50),
    colorIdx: randomColorIdx(),
  }));
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {pieces.map((p, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <ShapeCanvas width={80} height={80} label={`Shape ${letters[i]}`}>
                <ShapeTile kind={p.kind} cx={40} cy={40} size={p.size} variant={p.variant} rotation={p.rotation} color={SHAPE_COLORS[p.colorIdx]} />
              </ShapeCanvas>
              <b>{letters[i]}</b>
            </div>
          ))}
        </div>
      ),
      difficulty,
      step: choice(
        { prompt: `3 of these 4 shapes are ${SHAPE_NAMES[targetKind]}s. Which letter is NOT?`, hint: "Some real " + SHAPE_NAMES[targetKind] + "s look very different from each other — check the count, not the look.", explain: `Shape ${letters[oddPosition]} is a ${SHAPE_NAMES[otherKind]}, not a ${SHAPE_NAMES[targetKind]}.` },
        letters[oddPosition],
        letters.filter((_, i) => i !== oddPosition)
      ),
    },
  ];
};

/** Q9 — test-only generalization: building from a description with ONE
 *  constraint (echoes the Practice "build" idea at the single-attribute
 *  level, distinct from Q5's two-constraint version). */
export const buildFromDescriptionQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const kind = pick(SHAPE_KINDS);
  const others = shuffle(SHAPE_KINDS.filter((k) => k !== kind)).slice(0, 2);
  const letters = ["A", "B", "C"];
  const allKinds = shuffle([kind, ...others]);
  const correctIdx = allKinds.indexOf(kind);
  const candidates = allKinds.map((k) => ({ kind: k, variant: randomVariant(k), rotation: pick(ROTATIONS), size: randInt(28, 50), colorIdx: randomColorIdx() }));
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {candidates.map((c, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <ShapeCanvas width={90} height={90} label={`Shape ${letters[i]}`}>
                <ShapeTile kind={c.kind} cx={45} cy={45} size={c.size} variant={c.variant} rotation={c.rotation} color={SHAPE_COLORS[c.colorIdx]} />
              </ShapeCanvas>
              <b>{letters[i]}</b>
            </div>
          ))}
        </div>
      ),
      difficulty,
      step: choice(
        { prompt: `Which shape (A-C) has ${DEFINING_ATTRIBUTE[kind]}?`, hint: "Check sides and angles on each one — ignore size, color, and orientation.", explain: `Shape ${letters[correctIdx]} is the ${SHAPE_NAMES[kind]} — it has ${DEFINING_ATTRIBUTE[kind]}.` },
        letters[correctIdx],
        letters.filter((_, i) => i !== correctIdx)
      ),
    },
  ];
};

/** Q10 — irregular-trap, fresh angle: a claim framed as a true/false
 *  statement instead of a yes/no question, same bucket as Q6, different
 *  wording so the two never collide. */
export const irregularClaimTrueFalseQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const kind = pick(SHAPE_KINDS);
  const variant = randomVariant(kind, true);
  return [
    {
      visual: (
        <ShapeCanvas width={140} height={120} label={`A lopsided ${SHAPE_NAMES[kind]}`}>
          <ShapeTile kind={kind} cx={70} cy={60} size={randInt(30, 56)} variant={variant} rotation={pick(ROTATIONS)} color={SHAPE_COLORS[randomColorIdx()]} />
        </ShapeCanvas>
      ),
      difficulty,
      step: choice(
        { prompt: `True or False: a shape has to look even and symmetric to really count as a ${SHAPE_NAMES[kind]}.`, hint: `Count the sides/angles on the lopsided shape above — does it match a ${SHAPE_NAMES[kind]}'s count?`, explain: `False — only the side/angle count matters. This lopsided shape still has ${DEFINING_ATTRIBUTE[kind]}.` },
        "False",
        ["True"]
      ),
    },
  ];
};

export const classifyingShapesTest: Unit["test"] = {
  questions: [
    () => identify2dCountQuestion("easy"),
    () => identify2dNameQuestion("easy"),
    () => cubeAttributeQuestion("easy"),
    () => cubeVs2dQuestion("medium"),
    () => multiAttributeQuestion("medium"),
    () => irregularTrapQuestion("medium"),
    rotationTrueFalseQuestion,
    () => sortOddOneOutQuestion("hard"),
    () => buildFromDescriptionQuestion("hard"),
    () => irregularClaimTrueFalseQuestion("hard"),
  ],
  passScore: 9,
};
