import { GraduatedContainer, ScaleGauge } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Measuring and Estimating Liquid Volume and Mass ----------
// 10 single-question generators, self-contained (not imported from
// MeasuringVolumeAndMass.tsx).

interface MeasureObject {
  name: string;
  glyph: string;
  unit: "g" | "kg" | "L";
}
const OBJECTS: MeasureObject[] = [
  { name: "a paperclip", glyph: "📎", unit: "g" },
  { name: "a strawberry", glyph: "🍓", unit: "g" },
  { name: "a pencil", glyph: "✏️", unit: "g" },
  { name: "a textbook", glyph: "📚", unit: "kg" },
  { name: "a bicycle", glyph: "🚲", unit: "kg" },
  { name: "a large dog", glyph: "🐕", unit: "kg" },
  { name: "a bathtub full of water", glyph: "🛁", unit: "L" },
  { name: "a fish tank", glyph: "🐠", unit: "L" },
  { name: "a pitcher of lemonade", glyph: "🍋", unit: "L" },
];

function randomHalfStep(maxWhole: number): number {
  return randInt(1, maxWhole * 2) / 2;
}

/** Reading a graduated container's fill line. */
export const readContainerQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const capacity = pick([4, 5, 6]);
  const fillL = randomHalfStep(capacity);
  return [
    {
      visual: <GraduatedContainer capacityL={capacity} fillL={fillL} tone="a" />,
      difficulty,
      step: { kind: "number", prompt: "How many liters are in the container?", hint: "Find the fill line, then read the nearest tick mark.", explain: `The container holds ${fillL} liters.`, answer: fillL, suffix: "L" },
    },
  ];
};

/** Reading a scale's pointer. */
export const readScaleQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const useKg = Math.random() < 0.5;
  const maxUnits = useKg ? 10 : 1000;
  const majorStep = useKg ? 2 : 200;
  const valueUnits = useKg ? randomHalfStep(maxUnits) : pick(Array.from({ length: maxUnits / 50 }, (_, i) => (i + 1) * 50));
  const unitLabel = useKg ? "kg" : "g";
  return [
    {
      visual: <ScaleGauge maxUnits={maxUnits} valueUnits={valueUnits} majorStep={majorStep} unitLabel={unitLabel} tone="b" />,
      difficulty,
      step: { kind: "number", prompt: `How many ${unitLabel} does the scale read?`, hint: "Follow the needle out to the nearest tick mark.", explain: `The scale reads ${valueUnits} ${unitLabel}.`, answer: valueUnits, suffix: unitLabel },
    },
  ];
};

/** Choosing the sensible unit. Distractors: the other two unit kinds. */
export const chooseUnitQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const obj = pick(OBJECTS);
  const choices: Record<MeasureObject["unit"], string> = { g: "grams", kg: "kilograms", L: "liters" };
  const allUnits: MeasureObject["unit"][] = ["g", "kg", "L"];
  const distractors = allUnits.filter((u) => u !== obj.unit).map((u) => choices[u]);
  return [
    {
      visual: <div style={{ fontSize: 48, textAlign: "center" }}>{obj.glyph}</div>,
      difficulty,
      step: choice(
        { prompt: `Which unit makes the most sense for measuring ${obj.name}?`, hint: "Is it light, heavy, or something you'd pour?", explain: `${obj.name} is best measured in ${choices[obj.unit]}.` },
        choices[obj.unit],
        distractors
      ),
    },
  ];
};

/** Comparing two volumes or two masses. */
export const compareMeasurementsQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const useVolume = Math.random() < 0.5;
  const maxUnits = useVolume ? 6 : 10;
  const a = randomHalfStep(maxUnits);
  let b = randomHalfStep(maxUnits);
  while (a === b) b = randomHalfStep(maxUnits);
  const [bigger, smaller] = a > b ? [a, b] : [b, a];
  const unit = useVolume ? "L" : "kg";
  const visual = useVolume ? (
    <div className="control-row">
      <GraduatedContainer capacityL={maxUnits} fillL={a} tone="a" />
      <GraduatedContainer capacityL={maxUnits} fillL={b} tone="b" />
    </div>
  ) : (
    <div className="control-row">
      <ScaleGauge maxUnits={maxUnits} valueUnits={a} majorStep={2} unitLabel="kg" tone="a" />
      <ScaleGauge maxUnits={maxUnits} valueUnits={b} majorStep={2} unitLabel="kg" tone="b" />
    </div>
  );
  return [
    {
      visual,
      difficulty,
      step: {
        kind: "number",
        prompt: `How many MORE ${unit} does the bigger one ${useVolume ? "hold" : "weigh"} than the smaller one?`,
        hint: "Subtract the smaller amount from the bigger one.",
        explain: `${bigger} − ${smaller} = ${bigger - smaller} ${unit}.`,
        answer: bigger - smaller,
        suffix: unit,
      },
    },
  ];
};

export const measuringVolumeAndMassTest: Unit["test"] = {
  questions: [
    () => readContainerQuestion("easy"),
    () => readContainerQuestion("medium"),
    () => readContainerQuestion("medium"),
    () => readScaleQuestion("medium"),
    () => readScaleQuestion("hard"),
    () => readScaleQuestion("hard"),
    () => chooseUnitQuestion("easy"),
    () => chooseUnitQuestion("medium"),
    () => compareMeasurementsQuestion("medium"),
    () => compareMeasurementsQuestion("hard"),
  ],
  passScore: 9,
};
