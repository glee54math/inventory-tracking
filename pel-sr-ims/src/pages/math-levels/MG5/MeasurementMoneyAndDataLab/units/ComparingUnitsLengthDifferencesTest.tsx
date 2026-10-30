import { Ruler } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Comparing Measurement Units and Length Differences ----------
// Self-contained (no import from ComparingUnitsLengthDifferences.tsx — see
// this project's own circular-import warning).

const OBJECTS = [
  { name: "Ribbon", glyph: "🎀" },
  { name: "Shoelace", glyph: "👟" },
  { name: "Crayon", glyph: "🖍️" },
  { name: "Carrot", glyph: "🥕" },
  { name: "Scarf", glyph: "🧣" },
] as const;

const pickObject = () => shuffle(OBJECTS)[0];

/** The inverse-relationship misconception: pick which unit gives the BIGGER
 *  count for the exact same object. */
export const sameObjectQuestion = (): TestQuestion[] => {
  const obj = pickObject();
  const inchLength = randInt(4, 9);
  const cmLength = Math.round(inchLength * 2.4) + randInt(-1, 1);
  return [
    {
      visual: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Ruler unit="in" maxUnits={12} objectStart={0} objectLength={inchLength} label={obj.glyph} tone="a" />
          <Ruler unit="cm" maxUnits={Math.max(20, cmLength + 2)} objectStart={0} objectLength={cmLength} label={obj.glyph} tone="b" />
        </div>
      ),
      difficulty: "medium",
      step: choice(
        { prompt: `This is the SAME ${obj.name.toLowerCase()} measured twice. Which unit gives the bigger number?`, hint: "Compare the two readings.", explain: `Centimeters (${cmLength}) gives the bigger number — it's the smaller unit.` },
        "Centimeters",
        ["Inches", "Both numbers are exactly the same"]
      ),
    },
  ];
};

/** Direct explanation question: WHY does the smaller unit give a bigger count. */
export const whySmallerUnitQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "medium",
    step: choice(
      {
        prompt: "A ribbon measures 7 inches, and the exact same ribbon measures 18 centimeters. Why are these numbers different?",
        hint: "The ribbon itself never changed.",
        explain: "Centimeters are a smaller unit than inches, so it takes more of them to cover the exact same length.",
      },
      "Centimeters are a smaller unit, so it takes more of them to cover the same length",
      ["The ribbon grew between the two measurements", "One of the two measurements must be a mistake"]
    ),
  },
];

/** Length-difference, same unit. */
export const differenceQuestion = (difficulty: "easy" | "medium" | "hard" = "medium"): TestQuestion[] => {
  const [a, b] = shuffle(OBJECTS).slice(0, 2);
  const unit: "in" | "cm" = Math.random() < 0.5 ? "in" : "cm";
  const maxUnits = unit === "in" ? 12 : 20;
  const lenA = unit === "in" ? randInt(5, 9) : randInt(8, 16);
  const lenB = unit === "in" ? randInt(2, lenA - 1) : randInt(2, lenA - 1);
  const diff = lenA - lenB;
  return [
    {
      visual: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Ruler unit={unit} maxUnits={maxUnits} objectStart={0} objectLength={lenA} label={a.glyph} tone="a" />
          <Ruler unit={unit} maxUnits={maxUnits} objectStart={0} objectLength={lenB} label={b.glyph} tone="b" />
        </div>
      ),
      difficulty,
      step: {
        kind: "number",
        prompt: `Both are measured in ${unit === "in" ? "inches" : "centimeters"}. How much longer is the ${a.name.toLowerCase()} than the ${b.name.toLowerCase()}?`,
        hint: `Subtract: ${lenA} − ${lenB}.`,
        explain: `${lenA} − ${lenB} = ${diff} ${unit}.`,
        answer: diff,
        suffix: unit,
      },
    },
  ];
};

/** The cross-unit comparison trap — can't tell without matching units. */
export const crossUnitTrapQuestion = (): TestQuestion[] => {
  const a = pickObject();
  const b = shuffle(OBJECTS.filter((o) => o.name !== a.name))[0];
  const numA = randInt(5, 14);
  const numB = randInt(5, 14);
  const unitA = Math.random() < 0.5 ? "inches" : "centimeters";
  const unitB = unitA === "inches" ? "centimeters" : "inches";
  return [
    {
      visual: (
        <div className="control-row" style={{ justifyContent: "center", fontSize: 28 }}>
          <span>
            {a.glyph} {numA} {unitA}
          </span>
          <span>
            {b.glyph} {numB} {unitB}
          </span>
        </div>
      ),
      difficulty: "hard",
      step: choice(
        {
          prompt: `The ${a.name.toLowerCase()} measures ${numA} ${unitA}. The ${b.name.toLowerCase()} measures ${numB} ${unitB}. Is the ${a.name.toLowerCase()} longer?`,
          hint: "Check whether the two measurements use the same unit.",
          explain: `${unitA} and ${unitB} are different-size units — comparing ${numA} and ${numB} directly doesn't tell you anything.`,
        },
        "Can't tell — they're measured in different units",
        [`Yes, ${Math.max(numA, numB)} is the bigger number`, `No, ${Math.min(numA, numB)} is the smaller number`]
      ),
    },
  ];
};

/** Generalization / true-false trap. */
export const generalizationTrapQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "medium",
    step: choice(
      {
        prompt: "True or false: a bigger measurement number always means a bigger (longer) object.",
        hint: "Think about the ribbon measured in two different units.",
        explain: "False — 7 inches and 18 centimeters can describe the exact same length. The unit matters just as much as the number.",
      },
      "False",
      ["True"]
    ),
  },
];

export const comparingUnitsLengthDifferencesTest: Unit["test"] = {
  questions: [
    () => sameObjectQuestion(),
    () => sameObjectQuestion(),
    () => whySmallerUnitQuestion(),
    () => differenceQuestion("easy"),
    () => differenceQuestion("medium"),
    () => differenceQuestion("hard"),
    () => crossUnitTrapQuestion(),
    () => crossUnitTrapQuestion(),
    () => generalizationTrapQuestion(),
    () => differenceQuestion("medium"),
  ],
  passScore: 9,
};
