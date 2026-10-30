import { Ruler, rulerReading, type RulerUnit } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Measuring and Estimating Length ----------
// 10 single-question generators, self-contained (never imported from
// MeasuringEstimatingLength.tsx — importing between a unit and its own Test
// file in either direction is a circular import that silently breaks the
// level, per this project's own convention/warning).

const SMALL_OBJECTS = [
  { name: "Pencil", glyph: "✏️" },
  { name: "Crayon", glyph: "🖍️" },
  { name: "Marker", glyph: "🖊️" },
  { name: "Key", glyph: "🔑" },
  { name: "Toothbrush", glyph: "🪥" },
  { name: "Spoon", glyph: "🥄" },
] as const;

const pickObject = () => shuffle(SMALL_OBJECTS)[0];

/** Zero-aligned ruler reading. */
export const zeroAlignedQuestion = (difficulty: "easy" | "medium" = "easy"): TestQuestion[] => {
  const obj = pickObject();
  const unit: RulerUnit = Math.random() < 0.5 ? "in" : "cm";
  const maxUnits = unit === "in" ? 12 : 20;
  const length = unit === "in" ? randInt(4, 8) : randInt(6, 14);
  return [
    {
      visual: <Ruler unit={unit} maxUnits={maxUnits} objectStart={0} objectLength={length} label={obj.glyph} tone="a" />,
      difficulty,
      step: {
        kind: "number",
        prompt: `How long is the ${obj.name.toLowerCase()}?`,
        hint: "It starts right at 0, so you can read the end mark directly.",
        explain: `The ${obj.name.toLowerCase()} is ${length} ${unit} long.`,
        answer: length,
        suffix: unit,
      },
    },
  ];
};

/** The broken-ruler misconception: must subtract start from end. */
export const brokenRulerQuestion = (difficulty: "medium" | "hard" = "hard"): TestQuestion[] => {
  const obj = pickObject();
  const unit: RulerUnit = Math.random() < 0.5 ? "in" : "cm";
  const maxUnits = unit === "in" ? 12 : 20;
  const length = unit === "in" ? randInt(4, 7) : randInt(6, 12);
  const start = randInt(1, maxUnits - length - 1);
  const { end } = rulerReading(start, length);
  return [
    {
      visual: <Ruler unit={unit} maxUnits={maxUnits} objectStart={start} objectLength={length} label={obj.glyph} tone="b" />,
      difficulty,
      step: {
        kind: "number",
        prompt: `This ${obj.name.toLowerCase()} does NOT start at 0. How long is it?`,
        hint: `It starts at ${start} and ends at ${end}.`,
        explain: `${end} − ${start} = ${length} ${unit}.`,
        answer: length,
        suffix: unit,
      },
    },
  ];
};

/** Choice version of the broken-ruler misconception, with the endpoint-misread distractor explicit. */
export const brokenRulerChoiceQuestion = (): TestQuestion[] => {
  const obj = pickObject();
  const unit: RulerUnit = "in";
  const maxUnits = 12;
  const length = randInt(4, 6);
  const start = randInt(2, maxUnits - length - 2);
  const { end } = rulerReading(start, length);
  return [
    {
      visual: <Ruler unit={unit} maxUnits={maxUnits} objectStart={start} objectLength={length} label={obj.glyph} tone="b" />,
      difficulty: "hard",
      step: choice(
        { prompt: `How long is the ${obj.name.toLowerCase()}?`, hint: "Don't just read the end mark — subtract the start mark too.", explain: `${end} − ${start} = ${length} ${unit}.` },
        `${length} ${unit}`,
        [`${end} ${unit}`, `${start} ${unit}`]
      ),
    },
  ];
};

const CUSTOMARY_ESTIMATES = [
  { name: "a crayon", glyph: "🖍️", reasonable: 3, small: 1, big: 20, unit: "inches" },
  { name: "a new pencil", glyph: "✏️", reasonable: 7, small: 1, big: 30, unit: "inches" },
  { name: "a classroom door", glyph: "🚪", reasonable: 7, small: 1, big: 30, unit: "feet" },
] as const;

const METRIC_ESTIMATES = [
  { name: "a paperclip", glyph: "📎", reasonable: 3, small: 1, big: 30, unit: "centimeters" },
  { name: "a notebook", glyph: "📓", reasonable: 25, small: 2, big: 100, unit: "centimeters" },
  { name: "a classroom door", glyph: "🚪", reasonable: 2, small: 1, big: 20, unit: "meters" },
] as const;

export const estimateQuestion = (system: "customary" | "metric"): TestQuestion[] => {
  const pool = system === "customary" ? CUSTOMARY_ESTIMATES : METRIC_ESTIMATES;
  const item = pool[randInt(0, pool.length - 1)];
  const correctText = `About ${item.reasonable} ${item.unit}`;
  return [
    {
      visual: (
        <div style={{ fontSize: 48, textAlign: "center" }} role="img" aria-label={item.name}>
          {item.glyph}
        </div>
      ),
      difficulty: "medium",
      step: choice(
        { prompt: `About how long is ${item.name}?`, hint: `Think about ${item.name}'s real size.`, explain: `${correctText} is reasonable for ${item.name}.` },
        correctText,
        [`About ${item.small} ${item.unit}`, `About ${item.big} ${item.unit}`]
      ),
    },
  ];
};

const TOOL_OBJECTS = [
  { name: "a pencil", glyph: "✏️", small: true },
  { name: "a paperclip", glyph: "📎", small: true },
  { name: "a school bus", glyph: "🚌", small: false },
  { name: "a basketball court", glyph: "🏀", small: false },
] as const;

export const chooseToolQuestion = (): TestQuestion[] => {
  const item = TOOL_OBJECTS[randInt(0, TOOL_OBJECTS.length - 1)];
  const correctTool = item.small ? "A small ruler" : "A long tape measure or yardstick";
  const otherTool = item.small ? "A long tape measure or yardstick" : "A small ruler";
  return [
    {
      visual: (
        <div style={{ fontSize: 48, textAlign: "center" }} role="img" aria-label={item.name}>
          {item.glyph}
        </div>
      ),
      difficulty: "easy",
      step: choice(
        { prompt: `Which tool makes more sense for measuring ${item.name}?`, hint: "Match the tool's size to the object's size.", explain: `${correctTool} fits ${item.name}'s size.` },
        correctTool,
        [otherTool]
      ),
    },
  ];
};

/** Generalization / true-false trap, as a standalone test question. */
export const generalizationTrapQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "medium",
    step: choice(
      {
        prompt: "True or false: you can always find an object's length just by reading the number at its right end.",
        hint: "That's only true in one specific case.",
        explain: "False — that only works when the object starts at 0. Otherwise you must subtract the start mark from the end mark.",
      },
      "False",
      ["True"]
    ),
  },
];

export const measuringEstimatingLengthTest: Unit["test"] = {
  questions: [
    () => zeroAlignedQuestion("easy"),
    () => zeroAlignedQuestion("medium"),
    () => brokenRulerQuestion("medium"),
    () => brokenRulerQuestion("hard"),
    () => brokenRulerChoiceQuestion(),
    () => estimateQuestion("customary"),
    () => estimateQuestion("customary"),
    () => estimateQuestion("metric"),
    () => chooseToolQuestion(),
    () => generalizationTrapQuestion(),
  ],
  passScore: 9,
};
