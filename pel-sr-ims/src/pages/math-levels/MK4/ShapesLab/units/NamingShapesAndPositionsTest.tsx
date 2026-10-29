import { ShapeGlyph, SHAPE_KINDS, SHAPE_LABELS, type ShapeKind } from "../diagrams/Shape2D";
import { PositionScene, RELATIONS, RELATION_LABELS, RELATION_RECIPROCAL, type Relation } from "../diagrams/PositionScene";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Naming Shapes and Positions ----------
// 10 questions from 10 generators. Self-contained (own copy of the
// shape/position tables), same convention as every other *Test.tsx in this
// lab — never imports from NamingShapesAndPositions.tsx, so the two files
// can't form a circular import.

function distractorNames(kind: ShapeKind, includeDiamond: boolean): string[] {
  const others = shuffle(SHAPE_KINDS.filter((k) => k !== kind)).map((k) => SHAPE_LABELS[k]);
  if (includeDiamond) return shuffle([others[0], "Diamond"]);
  return others.slice(0, 2);
}

/** Easy: name a shape in its plain, standard orientation. */
export const nameShapeStandardQuestion = (): TestQuestion[] => {
  const kind = pick(SHAPE_KINDS.filter((k) => k !== "square") as ShapeKind[]);
  const label = SHAPE_LABELS[kind];
  return [
    {
      visual: <ShapeGlyph kind={kind} tone="a" label="a shape" />,
      difficulty: "easy",
      step: choice({ prompt: "What shape is this?", hint: "Count the sides and corners.", explain: `This is a ${label}.` }, label, distractorNames(kind, false)),
    },
  ];
};

/** Easy: a second standard-orientation shape, so this bucket's easy end is
 *  actually sampled twice in a 10-question test, not just once. */
export const nameShapeStandardQuestion2 = (): TestQuestion[] => {
  const kind = pick(["square", "hexagon"] as const);
  const label = SHAPE_LABELS[kind];
  return [
    {
      visual: <ShapeGlyph kind={kind} tone="b" label="a shape" />,
      difficulty: "easy",
      step: choice({ prompt: "What shape is this?", hint: "Count the sides and corners.", explain: `This is a ${label}.` }, label, distractorNames(kind, kind === "square")),
    },
  ];
};

/** Medium: a rotated square — the named "diamond" trap distractor. */
export const nameShapeRotatedDiamondTrap = (): TestQuestion[] => {
  const rotation = pick([30, 45, 60, 120]);
  return [
    {
      visual: <ShapeGlyph kind="square" rotation={rotation} tone="a" label="a tilted shape" />,
      difficulty: "medium",
      step: choice(
        { prompt: "What shape is this?", hint: "Count the sides — turning it never changes the count.", explain: "This is a Square — turning it never makes it a different shape." },
        "Square",
        ["Diamond", "Rectangle"]
      ),
    },
  ];
};

/** Medium: a resized shape (smaller or larger than usual). */
export const nameShapeResizedQuestion = (): TestQuestion[] => {
  const kind = pick(SHAPE_KINDS);
  const scale = pick([0.5, 1.5]);
  const label = SHAPE_LABELS[kind];
  return [
    {
      visual: <ShapeGlyph kind={kind} scale={scale} tone="c" label="a shape" />,
      difficulty: "medium",
      step: choice(
        { prompt: "What shape is this?", hint: "Size never changes what shape it is.", explain: `This is still a ${label}, just ${scale < 1 ? "smaller" : "bigger"} than usual.` },
        label,
        distractorNames(kind, kind === "square")
      ),
    },
  ];
};

/** Hard: a rotated triangle or hexagon — no "nickname" trap to lean on. */
export const nameShapeRotatedHardQuestion = (): TestQuestion[] => {
  const kind = pick(["triangle", "hexagon"] as const);
  const rotation = pick([40, 75, 110, 160, 200]);
  const label = SHAPE_LABELS[kind];
  return [
    {
      visual: <ShapeGlyph kind={kind} rotation={rotation} tone="a" label="a turned shape" />,
      difficulty: "hard",
      step: choice({ prompt: "What shape is this?", hint: "Count the sides and corners — turning it doesn't change them.", explain: `This is a ${label}, just turned to face a different way.` }, label, distractorNames(kind, false)),
    },
  ];
};

/** Easy: a plain above/below scene. */
export const positionAboveBelowQuestion = (): TestQuestion[] => {
  const relation = pick(["above", "below"] as const);
  const correct = RELATION_LABELS[relation];
  return [
    {
      visual: <PositionScene relation={relation} />,
      difficulty: "easy",
      step: choice(
        { prompt: "Which word describes where the ball is, compared to the box?", hint: "Is the ball higher or lower than the box?", explain: `The ball is ${correct.toLowerCase()} the box.` },
        correct,
        [RELATION_LABELS[relation === "above" ? "below" : "above"], "Beside"]
      ),
    },
  ];
};

/** Medium: a beside/behind scene. */
export const positionBesideBehindQuestion = (): TestQuestion[] => {
  const relation = pick(["beside", "behind"] as const);
  const side = pick(["left", "right"] as const);
  const correct = RELATION_LABELS[relation];
  return [
    {
      visual: <PositionScene relation={relation} side={side} />,
      difficulty: "medium",
      step: choice(
        { prompt: "Which word describes where the ball is, compared to the box?", hint: "Does anything overlap or hide part of the other object?", explain: `The ball is ${correct.toLowerCase()} the box.` },
        correct,
        [RELATION_LABELS["inFrontOf"], relation === "beside" ? "Above" : "Beside"]
      ),
    },
  ];
};

/** Hard: forced choice between beside / in front of / behind — the exact
 *  vocabulary-precision pair this unit's plan calls out by name. */
export const positionVocabPrecisionQuestion = (): TestQuestion[] => {
  const vocabSet: Relation[] = ["beside", "inFrontOf", "behind"];
  const relation = pick(vocabSet);
  const side = pick(["left", "right"] as const);
  const correct = RELATION_LABELS[relation];
  return [
    {
      visual: <PositionScene relation={relation} side={side} />,
      difficulty: "hard",
      step: choice(
        { prompt: "Which word describes where the ball is, compared to the box?", hint: "If part of one object is hidden by the other, it's not just 'beside.'", explain: `The ball is ${correct.toLowerCase()} the box.` },
        correct,
        vocabSet.filter((r) => r !== relation).map((r) => RELATION_LABELS[r])
      ),
    },
  ];
};

/** Hard: the core K.G.2 generalization, stated as a true/false trap. */
export const turningGeneralizationTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: turning (rotating) a shape around can make it become a different shape.",
          hint: "Turning never changes how many sides or corners a shape has.",
          explain: "False — turning a shape only changes which way it's facing. It's always the same shape.",
        },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Medium: the reciprocal-relation synthesis question. */
export const reciprocalRelationQuestion = (): TestQuestion[] => {
  const relation = pick(RELATIONS);
  const side = pick(["left", "right"] as const);
  const reciprocal = RELATION_RECIPROCAL[relation];
  return [
    {
      visual: <PositionScene relation={relation} side={side} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `The ball is ${RELATION_LABELS[relation].toLowerCase()} the box. From the BOX's point of view, where is the ball... I mean, where is the BOX, compared to the ball?`,
          hint: "Above/below swap with each other. In front of/behind swap with each other. Beside stays beside.",
          explain: `If the ball is ${RELATION_LABELS[relation].toLowerCase()} the box, the box is ${RELATION_LABELS[reciprocal].toLowerCase()} the ball.`,
        },
        RELATION_LABELS[reciprocal],
        shuffle(RELATIONS.filter((r) => r !== reciprocal)).slice(0, 2).map((r) => RELATION_LABELS[r])
      ),
    },
  ];
};

export const namingShapesAndPositionsTest: Unit["test"] = {
  questions: [
    nameShapeStandardQuestion,
    nameShapeStandardQuestion2,
    nameShapeRotatedDiamondTrap,
    nameShapeResizedQuestion,
    nameShapeRotatedHardQuestion,
    positionAboveBelowQuestion,
    positionBesideBehindQuestion,
    positionVocabPrecisionQuestion,
    turningGeneralizationTrueFalseQuestion,
    reciprocalRelationQuestion,
  ],
  passScore: 9,
};
