import { ShapeGlyph } from "../diagrams/Shape2D";
import { SolidGlyph, SOLID_KINDS, SOLID_LABELS, type SolidKind } from "../diagrams/Solid3D";
import { SolidThingPicture, SOLID_THINGS, SOLID_THING_SHAPE, SOLID_THING_NAME } from "../diagrams/RealObjects";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { inAnyOrder } from "./labParts";

// ---------- end-of-unit test: Flat or Solid? ----------
// 10 questions from 10 generators, in a new order every sitting. Self-
// contained, same convention as every other *Test.tsx in this lab. Every
// question has a picture, all in one color (review C1-08). Questions on the
// same skill draw from separate pools (review C1-10). Some flat shapes have a
// soft fill and one solid is a plain line drawing, so shading never tells.

type Tone = "a" | "b" | "c";
const tone = (): Tone => pick(["a", "b", "c"] as const);
const FLAT = "Flat (2D)";
const SOLID = "Solid (3D)";
const flatOrSolid = (solid: boolean, explain: string) =>
  choice({ prompt: "Is it flat (2D) or solid (3D)?", hint: "Could you pick it up?", explain }, solid ? SOLID : FLAT, [solid ? FLAT : SOLID]);

/** Easy: a plain rectangle or triangle. */
export const classify2DQuestion = (): TestQuestion[] => {
  const kind = pick(["rectangle", "triangle"] as const);
  return [{ visual: <ShapeGlyph kind={kind} tone={tone()} label="a shape" />, difficulty: "easy", step: flatOrSolid(false, `A ${kind} is flat, like a drawing.`) }];
};

/** Easy: a cone. */
export const classify3DQuestion = (): TestQuestion[] => [
  { visual: <SolidGlyph kind="cone" tone={tone()} label="a shape" />, difficulty: "easy", step: flatOrSolid(true, "A cone is solid. You can pick it up.") },
];

/** Medium: a hexagon with a soft fill — still flat. */
export const classify2DSecondQuestion = (): TestQuestion[] => [
  { visual: <ShapeGlyph kind="hexagon" soft tone={tone()} label="a shape" />, difficulty: "medium", step: flatOrSolid(false, "A hexagon is flat, like a drawing.") },
];

/** Medium: a cylinder drawn as plain lines — still solid. */
export const classify3DSecondQuestion = (): TestQuestion[] => [
  { visual: <SolidGlyph kind="cylinder" plain tone={tone()} label="a shape" />, difficulty: "medium", step: flatOrSolid(true, "A cylinder is solid, like a can.") },
];

/** Hard: a square or a cube (either one, so the answer changes; C1-07). */
export const squareVsCubeHardQuestion = (): TestQuestion[] => {
  const showCube = pick([true, false]);
  const t = tone();
  return [
    {
      visual: showCube ? <SolidGlyph kind="cube" tone={t} label="a shape" /> : <ShapeGlyph kind="square" tone={t} label="a shape" />,
      difficulty: "hard",
      step: flatOrSolid(showCube, showCube ? "A cube is solid, like a block." : "A square is flat, like a drawing."),
    },
  ];
};

/** Medium: the solid a real thing is (K.G.1 / K.G.3; review C1-15). */
export const realObjectSolidQuestion = (): TestQuestion[] => {
  const thing = pick(SOLID_THINGS);
  const kind = SOLID_THING_SHAPE[thing];
  const name = SOLID_THING_NAME[thing];
  return [
    {
      visual: <SolidThingPicture thing={thing} tone={tone()} />,
      difficulty: "medium",
      step: choice(
        { prompt: `What solid shape is ${name}?`, hint: "Round? A point on top? Like a block?", explain: `${name[0].toUpperCase()}${name.slice(1)} is a ${kind}.` },
        SOLID_LABELS[kind],
        shuffle(SOLID_KINDS.filter((k) => k !== kind).map((k) => SOLID_LABELS[k])).slice(0, 2)
      ),
    },
  ];
};

const nameSolid = (pool: readonly SolidKind[], difficulty: TestQuestion["difficulty"]): TestQuestion[] => {
  const kind = pick(pool);
  return [
    {
      visual: <SolidGlyph kind={kind} tone={tone()} label="a solid shape" />,
      difficulty,
      step: choice({ prompt: "What solid is it?", hint: "Round? A point on top? Like a block?", explain: `It is a ${kind}.` }, SOLID_LABELS[kind], shuffle(SOLID_KINDS.filter((k) => k !== kind).map((k) => SOLID_LABELS[k])).slice(0, 3)),
    },
  ];
};

/** Medium: name a cone or a cylinder. */
export const nameSolidQuestion = (): TestQuestion[] => nameSolid(["cone", "cylinder"], "medium");

/** Hard: name a cube or a sphere (the ones that look like a square / circle). */
export const nameSolidHardQuestion = (): TestQuestion[] => nameSolid(["cube", "sphere"], "hard");

/** Hard: round does not mean solid — a circle or a sphere, so the answer
 *  changes (review C1-09 / E1-02: it replaced a true/false item). */
export const roundShapeQuestion = (): TestQuestion[] => {
  const sphere = pick([true, false]);
  const t = tone();
  return [
    {
      visual: sphere ? <SolidGlyph kind="sphere" tone={t} label="a round shape" /> : <ShapeGlyph kind="circle" tone={t} label="a round shape" />,
      difficulty: "hard",
      step: choice(
        { prompt: "This shape is round. Is it flat (2D) or solid (3D)?", hint: "Could you pick it up?", explain: sphere ? "It is a sphere. It is solid, like a ball." : "It is a circle. It is round, but flat." },
        sphere ? SOLID : FLAT,
        [sphere ? FLAT : SOLID]
      ),
    },
  ];
};

/** Medium: the flat shape that is a part of a solid, the part ringed: the
 *  front of the cube (Square) or the end of the can (Circle), half each, with
 *  the same buttons (review C2-09: it was always Square). Taught in Explore
 *  and Practice first (review C1-24 / E1-21 replaced "trace one face"). */
export const cubeFrontQuestion = (): TestQuestion[] => {
  const front = pick([true, false]);
  const t = tone();
  return [
    {
      visual: front ? <SolidGlyph kind="cube" ringFront tone={t} label="a cube with its front ringed" /> : <SolidThingPicture thing="can" ringEnd tone={t} label="a can with its end ringed" />,
      difficulty: "medium",
      step: choice(
        { prompt: front ? "Look at the front of the cube. What shape is it?" : "Look at the end of the can. What shape is it?", hint: "Look at the ringed part.", explain: front ? "The front is a square." : "The end is a circle." },
        front ? "Square" : "Circle",
        front ? ["Circle", "Triangle"] : ["Square", "Triangle"]
      ),
    },
  ];
};

const QUESTIONS = [
  classify2DQuestion,
  classify3DQuestion,
  classify2DSecondQuestion,
  classify3DSecondQuestion,
  squareVsCubeHardQuestion,
  realObjectSolidQuestion,
  nameSolidQuestion,
  nameSolidHardQuestion,
  roundShapeQuestion,
  cubeFrontQuestion,
];

export const flatOrSolidTest: Unit["test"] = {
  questions: inAnyOrder(QUESTIONS),
  passScore: 9,
};

