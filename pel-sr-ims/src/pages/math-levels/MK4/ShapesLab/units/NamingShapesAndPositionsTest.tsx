import { ShapeGlyph, SHAPE_LABELS, type ShapeKind } from "../diagrams/Shape2D";
import { PositionScene, RELATION_LABELS, RELATION_RECIPROCAL, RELATIONS, type Relation } from "../diagrams/PositionScene";
import { FlatThingPicture, FLAT_THINGS, FLAT_THING_SHAPE, FLAT_THING_NAME } from "../diagrams/RealObjects";
import { pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { inAnyOrder, shapeDistractors, visibleTurn, VISIBLE_TURNS } from "./labParts";

// ---------- end-of-unit test: Name It. Where Is It? ----------
// 10 questions from 10 generators, in a new order every sitting. Self-
// contained (never imports NamingShapesAndPositions.tsx, so the two files
// can't form a circular import). Every question has a picture. Questions
// that check the same skill draw from separate pools, so no question can
// come up twice in one sitting (review C1-10). Test hints are never shown.

const lowerRel = (r: Relation) => RELATION_LABELS[r].toLowerCase();

/** Easy: name a plain circle, rectangle or triangle. */
export const nameShapeStandardQuestion = (): TestQuestion[] => {
  const kind = pick(["circle", "rectangle", "triangle"] as const);
  const label = SHAPE_LABELS[kind];
  return [
    {
      visual: <ShapeGlyph kind={kind} tone="a" label="a shape" />,
      difficulty: "easy",
      step: choice({ prompt: "What shape is it?", hint: "Look at the corners.", explain: `It is a ${label.toLowerCase()}.` }, label, shapeDistractors(kind, false)),
    },
  ];
};

/** Easy: the shape of a real thing (K.G.1; review C1-15). */
export const realObjectShapeQuestion = (): TestQuestion[] => {
  const thing = pick(FLAT_THINGS);
  const shape = FLAT_THING_SHAPE[thing];
  const name = FLAT_THING_NAME[thing];
  return [
    {
      visual: <FlatThingPicture thing={thing} tone="a" />,
      difficulty: "easy",
      step: choice({ prompt: `What shape is ${name}?`, hint: "Look at its shape.", explain: `${name[0].toUpperCase()}${name.slice(1)} is a ${SHAPE_LABELS[shape].toLowerCase()}.` }, SHAPE_LABELS[shape], shapeDistractors(shape, false)),
    },
  ];
};

/** Medium: a turned square — "Diamond" is the trap (the name some people use). */
export const nameShapeRotatedDiamondTrap = (): TestQuestion[] => {
  const rotation = pick(VISIBLE_TURNS.square);
  return [
    {
      visual: <ShapeGlyph kind="square" rotation={rotation} tone="a" label="a turned shape" />,
      difficulty: "medium",
      step: choice({ prompt: "What shape is it?", hint: "Turning does not change it.", explain: "It is a square. It is just turned." }, "Square", ["Diamond", "Rectangle"]),
    },
  ];
};

/** Medium: a bigger or smaller shape. */
export const nameShapeResizedQuestion = (): TestQuestion[] => {
  const kind = pick(["square", "hexagon", "circle"] as const);
  const scale = pick([0.5, 1.5]);
  const label = SHAPE_LABELS[kind];
  return [
    {
      visual: <ShapeGlyph kind={kind} scale={scale} tone="a" label="a shape" />,
      difficulty: "medium",
      step: choice(
        { prompt: "What shape is it?", hint: "Big or small, it is the same shape.", explain: `It is still a ${label.toLowerCase()}. It is just ${scale < 1 ? "smaller" : "bigger"}.` },
        label,
        shapeDistractors(kind, false)
      ),
    },
  ];
};

/** Hard: a turned hexagon or triangle — no prompt help at all. */
export const nameShapeRotatedHardQuestion = (): TestQuestion[] => {
  const kind = pick(["triangle", "hexagon"] as const);
  const label = SHAPE_LABELS[kind];
  return [
    {
      visual: <ShapeGlyph kind={kind} rotation={visibleTurn(kind)} tone="a" label="a turned shape" />,
      difficulty: "hard",
      step: choice({ prompt: "What shape is it?", hint: "Turning does not change it.", explain: `It is a ${label.toLowerCase()}. It is just turned.` }, label, shapeDistractors(kind, false)),
    },
  ];
};

/** Easy: above or below. Buttons: Above / Below / Beside. */
export const positionAboveBelowQuestion = (): TestQuestion[] => {
  const relation = pick(["above", "below"] as const);
  const correct = RELATION_LABELS[relation];
  return [
    {
      visual: <PositionScene relation={relation} />,
      difficulty: "easy",
      step: choice({ prompt: "Where is the ball?", hint: "Is the ball up or down?", explain: `The ball is ${correct.toLowerCase()} the box.` }, correct, [RELATION_LABELS[relation === "above" ? "below" : "above"], "Beside"]),
    },
  ];
};

/** Medium: beside, on either side. Buttons: Beside / Above / In front of.
 *  Only "beside" (review C2-08: it used to draw "above" too, the same
 *  picture and answer as the above/below question). */
export const positionBesideAboveQuestion = (): TestQuestion[] => {
  const side = pick(["left", "right"] as const);
  return [
    {
      visual: <PositionScene relation="beside" side={side} />,
      difficulty: "medium",
      step: choice({ prompt: "Where is the ball?", hint: "Is the ball next to the box?", explain: "The ball is beside the box." }, "Beside", ["Above", "In front of"]),
    },
  ];
};

/** Hard: in front of or behind, with beside as the trap — the precision
 *  pair the plan calls out. */
export const positionVocabPrecisionQuestion = (): TestQuestion[] => {
  const relation = pick(["inFrontOf", "behind"] as const);
  const side = pick(["left", "right"] as const);
  const correct = RELATION_LABELS[relation];
  return [
    {
      visual: <PositionScene relation={relation} side={side} />,
      difficulty: "hard",
      step: choice({ prompt: "Where is the ball?", hint: "Is part of it hidden?", explain: `The ball is ${correct.toLowerCase()} the box.` }, correct, ["In front of", "Behind", "Beside"].filter((c) => c !== correct)),
    },
  ];
};

/** The shape straight, an arrow, then the same shape turned: the picture
 *  says "it got turned", so the prompt doesn't name the shape (review E2-01). */
function TurnedPair({ kind, rotation }: { kind: ShapeKind; rotation: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ width: 130 }}>
        <ShapeGlyph kind={kind} tone="a" label="a shape" />
      </div>
      <svg viewBox="0 0 60 40" width={60} height={40} aria-hidden data-tts-skip style={{ flex: "none" }}>
        <line x1={6} y1={20} x2={44} y2={20} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
        <polygon points="54,20 40,10 40,30" fill="var(--ink)" />
      </svg>
      <div style={{ width: 130 }}>
        <ShapeGlyph kind={kind} rotation={rotation} tone="a" label="the same shape, turned" />
      </div>
    </div>
  );
}

/** Hard: turning does not make a new shape, asked about one new picture
 *  (review C1-09 / E1-02: it replaced a true/false item). */
export const turnedShapeQuestion = (): TestQuestion[] => {
  const kind = pick(["triangle", "rectangle"] as const);
  const label = SHAPE_LABELS[kind];
  const others: ShapeKind[] = kind === "triangle" ? ["square", "circle"] : ["square", "triangle"];
  return [
    {
      visual: <TurnedPair kind={kind} rotation={visibleTurn(kind)} />,
      difficulty: "hard",
      step: choice(
        { prompt: "It got turned. What shape is it now?", hint: "Turning does not change it.", explain: `It is still a ${label.toLowerCase()}.` },
        label,
        others.map((k) => SHAPE_LABELS[k])
      ),
    },
  ];
};

/** "Where is the box?" buttons for each relation (the right one first). */
const BOX_CHOICES: Record<Relation, Relation[]> = {
  above: ["below", "above", "beside"],
  below: ["above", "below", "beside"],
  beside: ["beside", "above", "inFrontOf"],
  inFrontOf: ["behind", "inFrontOf", "beside"],
  behind: ["inFrontOf", "behind", "beside"],
};

/** Medium: the same scene, told about the box (user decision: keep it,
 *  reworded; E1-15). The answer changes with the scene. */
export const reciprocalRelationQuestion = (): TestQuestion[] => {
  const relation = pick(RELATIONS);
  const side = pick(["left", "right"] as const);
  const [right, ...wrong] = BOX_CHOICES[relation];
  const theBall = (r: Relation) => `${RELATION_LABELS[r]} the ball`;
  return [
    {
      visual: <PositionScene relation={relation} side={side} />,
      difficulty: "medium",
      step: choice(
        { prompt: `The ball is ${lowerRel(relation)} the box. Where is the box?`, hint: "Look at the box.", explain: `The box is ${lowerRel(RELATION_RECIPROCAL[relation])} the ball.` },
        theBall(right),
        wrong.map(theBall)
      ),
    },
  ];
};

const QUESTIONS = [
  nameShapeStandardQuestion,
  realObjectShapeQuestion,
  nameShapeRotatedDiamondTrap,
  nameShapeResizedQuestion,
  nameShapeRotatedHardQuestion,
  positionAboveBelowQuestion,
  positionBesideAboveQuestion,
  positionVocabPrecisionQuestion,
  turnedShapeQuestion,
  reciprocalRelationQuestion,
];

export const namingShapesAndPositionsTest: Unit["test"] = {
  questions: inAnyOrder(QUESTIONS),
  passScore: 9,
};
