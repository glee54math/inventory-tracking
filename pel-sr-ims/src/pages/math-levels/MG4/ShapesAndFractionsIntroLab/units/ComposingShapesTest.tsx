import { CompositeShape, COMPOSITE_TARGET_NAME, COMPOSITE_PIECES_LABEL, COMPOSITE_FAMILY, ALL_COMPOSITES, type CompositeKind } from "../diagrams/CompositeShape";
import { SolidTower, SOLID_NAMES, type SolidKind } from "../diagrams/SolidIcon";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Composing Shapes ----------
// 10 single-question generators across the 4 Practice buckets (same-
// repeated, different-combo, decompose, 3d) plus 2 pure generalization
// checks — self-contained (not importing from ComposingShapes.tsx), same
// independence convention as every other *Test.tsx in this app. Individual
// generators are exported so ModuleTest.tsx can draw a cumulative sample.

const SAME_REPEATED: CompositeKind[] = ALL_COMPOSITES.filter((k) => COMPOSITE_FAMILY[k] === "same-repeated");
const DIFFERENT_COMBO: CompositeKind[] = ALL_COMPOSITES.filter((k) => COMPOSITE_FAMILY[k] === "different-combo");
const ALL_SOLID_KINDS: SolidKind[] = ["cube", "cone", "cylinder", "sphere"];

const PIECE_SINGULAR: Partial<Record<CompositeKind, string>> = {
  "rect-from-squares": "a square",
  "circle-from-halfcircles": "a half-circle",
  "halfcircle-from-quartercircles": "a quarter-circle",
  "square-from-triangles": "a triangle",
};

/** Q1 — same-repeated: identify the 2 pieces. */
export const sameRepeatedPiecesQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const kind = pick(SAME_REPEATED);
  const others = shuffle(ALL_COMPOSITES.filter((k) => k !== kind)).slice(0, 2);
  return [
    {
      visual: <CompositeShape kind={kind} width={150} height={120} />,
      difficulty,
      step: choice(
        {
          prompt: `Which two pieces make this ${COMPOSITE_TARGET_NAME[kind]}?`,
          hint: "Look at the line splitting it into 2 pieces.",
          explain: `${COMPOSITE_PIECES_LABEL[kind]} make this ${COMPOSITE_TARGET_NAME[kind]}.`,
        },
        COMPOSITE_PIECES_LABEL[kind],
        others.map((k) => COMPOSITE_PIECES_LABEL[k])
      ),
    },
  ];
};

/** Q2 — same-repeated: name the single repeated shape. */
export const sameRepeatedSingularQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const kind = pick(SAME_REPEATED);
  const singular = PIECE_SINGULAR[kind]!;
  const wrongSingulars = shuffle(SAME_REPEATED.filter((k) => k !== kind))
    .slice(0, 2)
    .map((k) => PIECE_SINGULAR[k]!);
  return [
    {
      visual: <CompositeShape kind={kind} width={150} height={120} />,
      difficulty,
      step: choice(
        {
          prompt: "Both pieces here are the same shape as each other. Which shape is it?",
          hint: "Look at just one of the 2 pieces.",
          explain: `Each piece is ${singular}.`,
        },
        singular,
        wrongSingulars
      ),
    },
  ];
};

/** Q3 — different-combo: identify the 2 different shapes. */
export const differentComboPiecesQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const kind = pick(DIFFERENT_COMBO);
  const others = shuffle(ALL_COMPOSITES.filter((k) => k !== kind)).slice(0, 2);
  return [
    {
      visual: <CompositeShape kind={kind} width={150} height={120} />,
      difficulty,
      step: choice(
        {
          prompt: `Which two shapes make this ${COMPOSITE_TARGET_NAME[kind]}?`,
          hint: "Look at the line splitting it into 2 pieces.",
          explain: `${COMPOSITE_PIECES_LABEL[kind]} make this ${COMPOSITE_TARGET_NAME[kind]}.`,
        },
        COMPOSITE_PIECES_LABEL[kind],
        others.map((k) => COMPOSITE_PIECES_LABEL[k])
      ),
    },
  ];
};

/** Q4 — different-combo: same shape or different shapes. */
export const differentComboSameOrDifferentQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const kind = pick(DIFFERENT_COMBO);
  return [
    {
      visual: <CompositeShape kind={kind} width={150} height={120} />,
      difficulty,
      step: choice(
        {
          prompt: "Are the 2 pieces that make this shape the SAME shape as each other, or DIFFERENT shapes?",
          hint: "Look at the 2 pieces.",
          explain: `${COMPOSITE_PIECES_LABEL[kind]} are two different shapes.`,
        },
        "Different shapes",
        ["The same shape"]
      ),
    },
  ];
};

/** Q5 — decompose: identify the basic shapes used, any composite. */
export const decomposeQuestion = (difficulty: "easy" | "medium" | "hard"): TestQuestion[] => {
  const kind = pick(ALL_COMPOSITES);
  const others = shuffle(ALL_COMPOSITES.filter((k) => k !== kind)).slice(0, 2);
  return [
    {
      visual: <CompositeShape kind={kind} width={150} height={120} />,
      difficulty,
      step: choice(
        {
          prompt: `Which basic shapes were used to build this ${COMPOSITE_TARGET_NAME[kind]}?`,
          hint: "Look at where the inside line splits it into pieces.",
          explain: `${COMPOSITE_PIECES_LABEL[kind]} were used to build this ${COMPOSITE_TARGET_NAME[kind]}.`,
        },
        COMPOSITE_PIECES_LABEL[kind],
        others.map((k) => COMPOSITE_PIECES_LABEL[k])
      ),
    },
  ];
};

/** Q6 — generalization: a composite can be built more than one way. */
export const twoPathsTrueFalseQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "medium",
    step: choice(
      {
        prompt: "True or False: the exact same composite shape can sometimes be built from more than one different combination of basic pieces.",
        hint: "Think of a rectangle built from 2 squares, or from 2 triangles.",
        explain: "True — how a shape happened to be split into pieces doesn't change what the final outside shape is.",
      },
      "True",
      ["False"]
    ),
  },
];

/** Q7 — generalization: turning a composite doesn't change what it is. */
export const rotatedCompositeTrueFalseQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "hard",
    step: choice(
      {
        prompt: "True or False: if you turn a composite shape sideways, it becomes a totally different shape.",
        hint: "This is the same idea as turning a single basic shape — does that change what shape it is?",
        explain: "False — turning a shape (basic or composite) never changes what shape it is, only how it's sitting.",
      },
      "False",
      ["True"]
    ),
  },
];

/** Q8 — 3D: how many solids were stacked. */
export const solidCountQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const b = pick(ALL_SOLID_KINDS);
  let t = pick(ALL_SOLID_KINDS);
  while (t === b) t = pick(ALL_SOLID_KINDS);
  return [
    {
      visual: <SolidTower solids={[b, t]} />,
      difficulty,
      step: {
        kind: "number",
        prompt: "How many solid shapes were stacked to make this tower?",
        hint: "Count the layers.",
        explain: "2 solids were stacked.",
        answer: 2,
      },
    },
  ];
};

/** Q9 — 3D: which two solids were stacked. */
export const solidWhichTwoQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const b = pick(ALL_SOLID_KINDS);
  let t = pick(ALL_SOLID_KINDS);
  while (t === b) t = pick(ALL_SOLID_KINDS);
  const correctLabel = `A ${SOLID_NAMES[b]} and a ${SOLID_NAMES[t]}`;
  const seenSets = new Set<string>([[b, t].sort().join("|")]);
  const otherPairs = shuffle(ALL_SOLID_KINDS.flatMap((a) => ALL_SOLID_KINDS.filter((x) => x !== a).map((x) => [a, x] as [SolidKind, SolidKind]))).filter(([a, x]) => {
    const key = [a, x].sort().join("|");
    if (seenSets.has(key)) return false;
    seenSets.add(key);
    return true;
  });
  const distractorLabels = otherPairs.slice(0, 2).map(([a, x]) => `A ${SOLID_NAMES[a]} and a ${SOLID_NAMES[x]}`);
  return [
    {
      visual: <SolidTower solids={[b, t]} />,
      difficulty,
      step: choice(
        {
          prompt: "Which two solid shapes were stacked to make this tower?",
          hint: "Look at the bottom layer, then the top layer.",
          explain: `${correctLabel} were stacked.`,
        },
        correctLabel,
        distractorLabels
      ),
    },
  ];
};

/** Q10 — vocabulary: compose vs. decompose. */
export const composeDecomposeVocabQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "medium",
    step: choice(
      {
        prompt: "Putting 2 basic shapes together to build one bigger shape is called...",
        hint: "This is the opposite of taking a shape apart.",
        explain: "Composing is putting basic shapes together to build a bigger composite shape.",
      },
      "Composing",
      ["Decomposing", "Partitioning"]
    ),
  },
];

export const composingShapesTest: Unit["test"] = {
  questions: [
    () => sameRepeatedPiecesQuestion("easy"),
    () => sameRepeatedSingularQuestion("medium"),
    () => differentComboPiecesQuestion("medium"),
    () => differentComboSameOrDifferentQuestion("easy"),
    () => decomposeQuestion("medium"),
    twoPathsTrueFalseQuestion,
    rotatedCompositeTrueFalseQuestion,
    () => solidCountQuestion("easy"),
    () => solidWhichTwoQuestion("hard"),
    composeDecomposeVocabQuestion,
  ],
  passScore: 9,
};
