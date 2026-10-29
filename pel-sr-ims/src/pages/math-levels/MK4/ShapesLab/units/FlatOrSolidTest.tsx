import { ShapeGlyph, SHAPE_KINDS, SHAPE_LABELS, type ShapeKind } from "../diagrams/Shape2D";
import { SolidGlyph, SOLID_KINDS, SOLID_LABELS, type SolidKind } from "../diagrams/Solid3D";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Flat or Solid? (2D vs. 3D) ----------
// 10 questions from 10 generators. Self-contained, same convention as every
// other *Test.tsx in this lab.

/** Easy: classify an obviously flat shape. */
export const classify2DQuestion = (): TestQuestion[] => {
  const kind = pick(SHAPE_KINDS.filter((k) => k !== "circle" && k !== "square") as ShapeKind[]);
  return [
    {
      visual: <ShapeGlyph kind={kind} tone="a" label="a shape" />,
      difficulty: "easy",
      step: choice({ prompt: "Is this shape flat (2D) or solid (3D)?", hint: "Could you pick it up and hold it, with real depth?", explain: `A ${SHAPE_LABELS[kind].toLowerCase()} is flat (2D).` }, "Flat (2D)", ["Solid (3D)"]),
    },
  ];
};

/** Easy: classify an obviously solid shape. */
export const classify3DQuestion = (): TestQuestion[] => {
  const kind = pick(SOLID_KINDS.filter((k) => k !== "sphere" && k !== "cube") as SolidKind[]);
  return [
    {
      visual: <SolidGlyph kind={kind} tone="b" label="a shape" />,
      difficulty: "easy",
      step: choice({ prompt: "Is this shape flat (2D) or solid (3D)?", hint: "Could you pick it up and hold it, with real depth?", explain: `A ${SOLID_LABELS[kind].toLowerCase()} is solid (3D).` }, "Solid (3D)", ["Flat (2D)"]),
    },
  ];
};

/** Medium: a second classify-2D question, a different shape than the easy one. */
export const classify2DSecondQuestion = (): TestQuestion[] => {
  const kind = pick(["triangle", "hexagon"] as const);
  return [
    {
      visual: <ShapeGlyph kind={kind} tone="c" label="a shape" />,
      difficulty: "medium",
      step: choice({ prompt: "Is this shape flat (2D) or solid (3D)?", hint: "Could you pick it up and hold it, with real depth?", explain: `A ${SHAPE_LABELS[kind].toLowerCase()} is flat (2D).` }, "Flat (2D)", ["Solid (3D)"]),
    },
  ];
};

/** Medium: a second classify-3D question, a different solid than the easy one. */
export const classify3DSecondQuestion = (): TestQuestion[] => {
  const kind = pick(["cone", "cylinder"] as const);
  return [
    {
      visual: <SolidGlyph kind={kind} tone="a" label="a shape" />,
      difficulty: "medium",
      step: choice({ prompt: "Is this shape flat (2D) or solid (3D)?", hint: "Could you pick it up and hold it, with real depth?", explain: `A ${SOLID_LABELS[kind].toLowerCase()} is solid (3D).` }, "Solid (3D)", ["Flat (2D)"]),
    },
  ];
};

/** Hard: the circle-vs-sphere discrimination, shown as the solid. */
export const sphereVsCircleHardQuestion = (): TestQuestion[] => {
  return [
    {
      visual: <SolidGlyph kind="sphere" tone="c" label="a round shape" />,
      difficulty: "hard",
      step: choice(
        { prompt: "Is this round shape flat (2D) or solid (3D)?", hint: "Look for the shading/highlight that shows depth.", explain: "This is a sphere — the shading shows it's round all over and has real depth, so it's solid (3D)." },
        "Solid (3D)",
        ["Flat (2D)"]
      ),
    },
  ];
};

/** Hard: the square-vs-cube discrimination, shown as the flat shape. */
export const squareVsCubeHardQuestion = (): TestQuestion[] => {
  return [
    {
      visual: <ShapeGlyph kind="square" tone="a" label="a square shape" />,
      difficulty: "hard",
      step: choice(
        { prompt: "Is this square-faced shape flat (2D) or solid (3D)?", hint: "No shading at all means no depth.", explain: "This is a flat square (2D) — it has no shading showing depth, unlike a cube." },
        "Flat (2D)",
        ["Solid (3D)"]
      ),
    },
  ];
};

/** Medium: production — name the solid (not just classify it). */
export const nameSolidQuestion = (): TestQuestion[] => {
  const kind = pick(SOLID_KINDS);
  const label = SOLID_LABELS[kind];
  return [
    {
      visual: <SolidGlyph kind={kind} tone="b" label="a solid shape" />,
      difficulty: "medium",
      step: choice(
        { prompt: "What is the name of this solid shape?", hint: "Round all over? Two round ends? A point at the top? A box?", explain: `This is a ${label}.` },
        label,
        shuffle(SOLID_KINDS.filter((k) => k !== kind).map((k) => SOLID_LABELS[k])).slice(0, 3)
      ),
    },
  ];
};

/** Hard: name the solid, restricted to just the cube/sphere pair that's
 *  easiest to mix up with their flat cousins. */
export const nameSolidHardQuestion = (): TestQuestion[] => {
  const kind = pick(["cube", "sphere"] as const);
  const label = SOLID_LABELS[kind];
  return [
    {
      visual: <SolidGlyph kind={kind} tone="c" label="a solid shape" />,
      difficulty: "hard",
      step: choice(
        { prompt: "What is the name of this solid shape?", hint: "Round all over, or flat square faces?", explain: `This is a ${label}.` },
        label,
        shuffle(SOLID_KINDS.filter((k) => k !== kind).map((k) => SOLID_LABELS[k])).slice(0, 2)
      ),
    },
  ];
};

/** Hard: the core generalization, as a true/false trap. */
export const looksCanTrickYouTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: a round shape in a picture must always be solid (3D), just because it looks round.",
          hint: "A circle is round AND flat.",
          explain: "False — a circle is round but flat (2D). Whether something is solid depends on real depth, not just a round outline.",
        },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Medium: synthesis — connecting a flat face back to the solid it came from. */
export const cubeFaceSynthesisQuestion = (): TestQuestion[] => {
  return [
    {
      visual: <SolidGlyph kind="cube" tone="a" label="a solid shape" />,
      difficulty: "medium",
      step: choice(
        { prompt: "If you traced just ONE flat face of this cube onto paper, what flat (2D) shape would you get?", hint: "Look at one face of the cube — is it round, triangular, or square?", explain: "Each face of a cube is a flat Square." },
        "Square",
        ["Circle", "Triangle"]
      ),
    },
  ];
};

export const flatOrSolidTest: Unit["test"] = {
  questions: [
    classify2DQuestion,
    classify3DQuestion,
    classify2DSecondQuestion,
    classify3DSecondQuestion,
    sphereVsCircleHardQuestion,
    squareVsCubeHardQuestion,
    nameSolidQuestion,
    nameSolidHardQuestion,
    looksCanTrickYouTrueFalseQuestion,
    cubeFaceSynthesisQuestion,
  ],
  passScore: 9,
};
