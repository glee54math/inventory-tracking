import { ObjectGlyph, WordCard } from "../diagrams";
import { pick } from "../../../shared/lib/math";
import { choice, sentence, selectBlank, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Describing How Objects Are Measured ----------
// Self-contained — the object/word pools are duplicated here rather than
// imported from DescribingHowObjectsAreMeasured.tsx, same convention as
// every other *Test.tsx in this app (avoids a real circular import, since
// the unit file itself imports this test).

interface MeasureObject {
  name: string;
  glyph: string;
  length: "long" | "short";
  weight: "heavy" | "light";
}

const OBJECTS: MeasureObject[] = [
  { name: "train", glyph: "🚂", length: "long", weight: "heavy" },
  { name: "crocodile", glyph: "🐊", length: "long", weight: "heavy" },
  { name: "log", glyph: "🪵", length: "long", weight: "heavy" },
  { name: "pencil", glyph: "✏️", length: "long", weight: "light" },
  { name: "snake", glyph: "🐍", length: "long", weight: "light" },
  { name: "jump rope", glyph: "🨢", length: "long", weight: "light" },
  { name: "rock", glyph: "🪨", length: "short", weight: "heavy" },
  { name: "anchor", glyph: "⚓", length: "short", weight: "heavy" },
  { name: "brick", glyph: "🧱", length: "short", weight: "heavy" },
  { name: "feather", glyph: "🪶", length: "short", weight: "light" },
  { name: "balloon", glyph: "🎈", length: "short", weight: "light" },
  { name: "leaf", glyph: "🍃", length: "short", weight: "light" },
];

const WORDS: { word: string; attr: "length" | "weight" }[] = [
  { word: "long", attr: "length" },
  { word: "short", attr: "length" },
  { word: "tall", attr: "length" },
  { word: "heavy", attr: "weight" },
  { word: "light", attr: "weight" },
];

/** Single-object length description — the easy, direct case. */
export const lengthQuestion = (): TestQuestion[] => {
  const obj = pick(OBJECTS);
  const other = obj.length === "long" ? "short" : "long";
  return [
    {
      visual: <ObjectGlyph glyph={obj.glyph} name={obj.name} big />,
      difficulty: "easy",
      step: choice({ prompt: `Is the ${obj.name} long or short?`, hint: "Think about how it would look stretched out end to end.", explain: `The ${obj.name} is ${obj.length}.` }, obj.length, [other]),
    },
  ];
};

/** Single-object weight description — the easy, direct case. */
export const weightQuestion = (): TestQuestion[] => {
  const obj = pick(OBJECTS);
  const other = obj.weight === "heavy" ? "light" : "heavy";
  return [
    {
      visual: <ObjectGlyph glyph={obj.glyph} name={obj.name} big />,
      difficulty: "easy",
      step: choice({ prompt: `Is the ${obj.name} heavy or light?`, hint: "Think about how hard it would be to lift.", explain: `The ${obj.name} is ${obj.weight}.` }, obj.weight, [other]),
    },
  ];
};

/** Holding two independent attributes of the same object at once. */
export const twoAttributesQuestion = (): TestQuestion[] => {
  const obj = pick(OBJECTS);
  const otherLen = obj.length === "long" ? "short" : "long";
  const otherWt = obj.weight === "heavy" ? "light" : "heavy";
  return [
    {
      visual: <ObjectGlyph glyph={obj.glyph} name={obj.name} big />,
      difficulty: "medium",
      step: sentence(
        { prompt: "Fill in both words.", hint: "One word is about length, one is about weight.", explain: `The ${obj.name} is ${obj.length} and ${obj.weight}.` },
        `This ${obj.name} is `,
        selectBlank(obj.length, [otherLen]),
        " and ",
        selectBlank(obj.weight, [otherWt]),
        "."
      ),
    },
  ];
};

/** Vocabulary: a word that describes LENGTH, including "tall" (not a literal
 *  synonym of "long"/"short", so this can't be answered by text-matching). */
export const vocabLengthQuestion = (): TestQuestion[] => {
  const w = pick(WORDS.filter((x) => x.attr === "length"));
  return [
    {
      visual: <WordCard word={w.word} />,
      difficulty: "medium",
      step: choice(
        { prompt: `Does "${w.word}" tell you about an object's LENGTH or its WEIGHT?`, hint: `Think about what "${w.word}" means when you say it about an object.`, explain: `"${w.word}" describes length.` },
        "Length",
        ["Weight"]
      ),
    },
  ];
};

/** Vocabulary: a word that describes WEIGHT. */
export const vocabWeightQuestion = (): TestQuestion[] => {
  const w = pick(WORDS.filter((x) => x.attr === "weight"));
  return [
    {
      visual: <WordCard word={w.word} />,
      difficulty: "medium",
      step: choice(
        { prompt: `Does "${w.word}" tell you about an object's LENGTH or its WEIGHT?`, hint: `Think about what "${w.word}" means when you say it about an object.`, explain: `"${w.word}" describes weight.` },
        "Weight",
        ["Length"]
      ),
    },
  ];
};

/** Generalization / false trap: looking bigger never guarantees heavier. */
export const sizeVsWeightTrapQuestion = (): TestQuestion[] => {
  return [
    {
      visual: (
        <svg viewBox="0 0 160 90" role="img" aria-label="A big balloon and a small rock">
          <text x={40} y={60} textAnchor="middle" fontSize={44}>
            {"🎈"}
          </text>
          <text x={120} y={60} textAnchor="middle" fontSize={28}>
            {"🪨"}
          </text>
        </svg>
      ),
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: an object that looks bigger (like the balloon) is always heavier than an object that looks smaller (like the rock).",
          hint: "Which one would actually be harder to lift?",
          explain: "False — the balloon looks bigger, but the rock is heavier. Looking bigger never guarantees being heavier.",
        },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Conflation trap: appearance changes (like color) don't change measurable attributes. */
export const colorChangeQuestion = (): TestQuestion[] => {
  const obj = pick(OBJECTS);
  return [
    {
      visual: <ObjectGlyph glyph={obj.glyph} name={obj.name} big />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `True or false: if you painted the ${obj.name} a different color, it would become a different length and weight.`,
          hint: "Painting something changes how it looks, not how long or heavy it is.",
          explain: `False — color doesn't change the ${obj.name}'s length or weight, only how it looks.`,
        },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Reverse vocabulary: pick the WEIGHT word out of a length/weight pair. */
export const reverseVocabQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: 'Which word describes WEIGHT: "short" or "light"?', hint: '"short" is about length.', explain: '"light" describes weight. "short" describes length instead.' },
        "light",
        ["short"]
      ),
    },
  ];
};

/** Generalization: the opposite of a length word is still a length word, not a weight word. */
export const oppositeOfLongQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: 'Which word means the OPPOSITE of "long"?', hint: 'The opposite of "long" is still about length, not weight.', explain: '"short" is the opposite of "long" — both describe length.' },
        "short",
        ["light"]
      ),
    },
  ];
};

/** Generalization: the opposite of a weight word is still a weight word, not a length word. */
export const oppositeOfHeavyQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: 'Which word means the OPPOSITE of "heavy"?', hint: 'The opposite of "heavy" is still about weight, not length.', explain: '"light" is the opposite of "heavy" — both describe weight.' },
        "light",
        ["short"]
      ),
    },
  ];
};

export const describingTest: Unit["test"] = {
  questions: [
    lengthQuestion,
    weightQuestion,
    twoAttributesQuestion,
    vocabLengthQuestion,
    vocabWeightQuestion,
    sizeVsWeightTrapQuestion,
    colorChangeQuestion,
    reverseVocabQuestion,
    oppositeOfLongQuestion,
    oppositeOfHeavyQuestion,
  ],
  passScore: 9,
};
