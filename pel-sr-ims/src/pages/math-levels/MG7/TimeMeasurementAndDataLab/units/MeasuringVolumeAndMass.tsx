import { useEffect, useState } from "react";
import { GraduatedContainer, ScaleGauge } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { measuringVolumeAndMassTest } from "./MeasuringVolumeAndMassTest";

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Real-world objects for the "choose the sensible unit" bucket — every
 *  object's `unit` is its single best real-world unit (grams for small
 *  light things, kilograms for things on the order of a kilogram or more,
 *  liters for anything described by how much it holds). */
interface MeasureObject {
  name: string;
  glyph: string;
  unit: "g" | "kg" | "L";
}
const OBJECTS: MeasureObject[] = [
  { name: "a paperclip", glyph: "📎", unit: "g" },
  { name: "a strawberry", glyph: "🍓", unit: "g" },
  { name: "a pencil", glyph: "✏️", unit: "g" },
  { name: "a slice of bread", glyph: "🍞", unit: "g" },
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

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Vocabulary: a scale measures mass (weight-like heaviness), not volume. */
function AttributeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "mass";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> A scale's needle points to a number in grams or kilograms.
      </p>
      <ScaleGauge maxUnits={1000} valueUnits={600} majorStep={200} unitLabel="g" tone="a" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What does a scale measure?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="mass">Mass — how heavy something is</option>
            <option value="volume">Volume — how much space it takes up inside a container</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — grams and kilograms measure MASS, how heavy something is. Liters measure volume instead, how much a container holds." : "Not quite — grams and kilograms measure MASS, not volume. Volume (how much a container holds) is measured in liters."}
        </p>
      )}
    </div>
  );
}

/** REQUIRED: mass vs. volume for the SAME object, explicit. */
function MassVsVolumeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [pickedA, setPickedA] = useState("");
  const [pickedB, setPickedB] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [pickedA, pickedB].every((v) => String(v).trim() !== "");
  const okA = pickedA === "holds";
  const okB = pickedB === "weighs";
  const ok = okA && okB;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> A full pitcher of water holds 2 liters AND has a mass of about 2 kilograms. Both numbers happen to be "2," but they describe
        different things.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          "2 liters" tells you how much the pitcher...{" "}
          <select className="answer" value={pickedA} onChange={(e) => setPickedA(e.target.value)} style={fieldOk(okA, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="holds">holds (volume)</option>
            <option value="weighs">weighs (mass)</option>
          </select>
        </label>
        <label>
          "2 kilograms" tells you how much the pitcher...{" "}
          <select className="answer" value={pickedB} onChange={(e) => setPickedB(e.target.value)} style={fieldOk(okB, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="holds">holds (volume)</option>
            <option value="weighs">weighs (mass)</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — liters always describe how much something HOLDS (volume); grams/kilograms always describe how much something WEIGHS (mass). The same object can have both, but they're never interchangeable."
            : "Not quite — liters describe VOLUME (how much it holds); grams/kilograms describe MASS (how much it weighs). A pitcher can have both numbers, but they're measuring two different things."}
        </p>
      )}
    </div>
  );
}

/** Benchmark/magnitude reasoning: choosing between grams and kilograms. */
function UnitSizeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [pickedA, setPickedA] = useState("");
  const [pickedB, setPickedB] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [pickedA, pickedB].every((v) => String(v).trim() !== "");
  const okA = pickedA === "g";
  const okB = pickedB === "kg";
  const ok = okA && okB;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Which unit makes more sense for each object?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          A paperclip's mass: 1{" "}
          <select className="answer" value={pickedA} onChange={(e) => setPickedA(e.target.value)} style={fieldOk(okA, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="g">gram</option>
            <option value="kg">kilogram</option>
          </select>
        </label>
        <label>
          A bicycle's mass: about 11{" "}
          <select className="answer" value={pickedB} onChange={(e) => setPickedB(e.target.value)} style={fieldOk(okB, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="g">grams</option>
            <option value="kg">kilograms</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — a paperclip is light enough to measure in grams; a bicycle is heavy enough that kilograms make more sense."
            : "Not quite — grams suit light things like a paperclip; kilograms suit heavier things like a bicycle. Picking the wrong size unit makes the number either way too huge or way too tiny to make sense."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap. */
function SameThingTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: "grams" and "kilograms" are just two different names for the exact same amount, so it never matters which one a
        problem uses.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — a kilogram is a much bigger amount of mass than a gram. They're related, but they are NOT the same size, so which one is used absolutely matters."
            : "Not quite — a kilogram is a much bigger amount than a gram (that's why heavy things get measured in kilograms and light things in grams). They are not interchangeable."}
        </p>
      )}
    </div>
  );
}

function MeasuringCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ attribute: false, massVsVolume: false, unitSize: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure mass and volume make sense before you try practice problems.</p>
      <AttributeQuestion onComplete={mark("attribute")} />
      <MassVsVolumeQuestion onComplete={mark("massVsVolume")} />
      <UnitSizeQuestion onComplete={mark("unitSize")} />
      <SameThingTrapQuestion onComplete={mark("trap")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [tool, setTool] = useState<"container" | "scale">("container");
  const [fillL, setFillL] = useState(2.5);
  const [massG, setMassG] = useState(400);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented label="Tool" value={tool} onChange={setTool} options={[{ id: "container", label: "Graduated container" }, { id: "scale", label: "Scale" }]} />
        {!introActive && (
          <button
            type="button"
            className="btn ghost"
            style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined}
            onClick={() => setShowCheck((v) => !v)}
          >
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <MeasuringCheckForUnderstanding onComplete={onIntroDone} />}

      {tool === "container" ? (
        <>
          <Stepper label="Fill level (liters)" value={fillL} min={0} max={6} step={0.5} onChange={setFillL} tone="a" />
          <GraduatedContainer capacityL={6} fillL={fillL} tone="a" />
          <p className="feedback good">This container is filled to {fillL} liters.</p>
        </>
      ) : (
        <>
          <Stepper label="Mass (grams)" value={massG} min={0} max={1000} step={50} onChange={setMassG} tone="b" />
          <ScaleGauge maxUnits={1000} valueUnits={massG} majorStep={200} unitLabel="g" tone="b" />
          <p className="feedback good">The scale reads {massG} grams.</p>
        </>
      )}
      <p className="muted small">Switch tools and move the stepper — notice the needle or fill line always lands exactly on a tick mark.</p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "readContainer" | "readScale" | "chooseUnit" | "compareMeasurements";
const BUCKETS: Bucket[] = ["readContainer", "readScale", "chooseUnit", "compareMeasurements"];

function readContainerProblem(): Problem {
  const capacity = pick([4, 5, 6]);
  const fillL = randomHalfStep(capacity);
  return {
    title: "Read the container",
    bucket: "readContainer",
    story: "How much liquid is in this graduated container?",
    visual: () => <GraduatedContainer capacityL={capacity} fillL={fillL} tone="a" />,
    steps: [
      { kind: "number", prompt: "How many liters are in the container?", hint: "Find the fill line, then read the nearest tick mark.", explain: `The container holds ${fillL} liters.`, answer: fillL, suffix: "L" },
    ],
    wrapUp: `This container holds ${fillL} liters.`,
  };
}

function readScaleProblem(): Problem {
  const useKg = Math.random() < 0.5;
  const maxUnits = useKg ? 10 : 1000;
  const majorStep = useKg ? 2 : 200;
  const valueUnits = useKg ? randomHalfStep(maxUnits) : pick(Array.from({ length: maxUnits / 50 }, (_, i) => (i + 1) * 50));
  const unitLabel = useKg ? "kg" : "g";
  return {
    title: "Read the scale",
    bucket: "readScale",
    story: `What mass does this scale show, in ${unitLabel}?`,
    visual: () => <ScaleGauge maxUnits={maxUnits} valueUnits={valueUnits} majorStep={majorStep} unitLabel={unitLabel} tone="b" />,
    steps: [
      { kind: "number", prompt: `How many ${unitLabel} does the scale read?`, hint: "Follow the needle out to the nearest tick mark.", explain: `The scale reads ${valueUnits} ${unitLabel}.`, answer: valueUnits, suffix: unitLabel },
    ],
    wrapUp: `The scale reads ${valueUnits} ${unitLabel}.`,
  };
}

function chooseUnitProblem(): Problem {
  const obj = pick(OBJECTS);
  const choices: Record<MeasureObject["unit"], string> = { g: "grams", kg: "kilograms", L: "liters" };
  const allUnits: MeasureObject["unit"][] = ["g", "kg", "L"];
  const distractors = allUnits.filter((u) => u !== obj.unit).map((u) => choices[u]);
  return {
    title: "Choose the sensible unit",
    bucket: "chooseUnit",
    story: `Think about ${obj.name} (${obj.glyph}).`,
    visual: () => <div style={{ fontSize: 48, textAlign: "center" }}>{obj.glyph}</div>,
    steps: [
      choice(
        { prompt: `Which unit makes the most sense for measuring ${obj.name}?`, hint: "Is it light, heavy, or something you'd pour?", explain: `${obj.name} is best measured in ${choices[obj.unit]}.` },
        choices[obj.unit],
        distractors
      ),
    ],
    wrapUp: `${obj.name} is best measured in ${choices[obj.unit]}.`,
  };
}

function compareMeasurementsProblem(): Problem {
  const useVolume = Math.random() < 0.5;
  if (useVolume) {
    const capacity = 6;
    const a = randomHalfStep(capacity);
    let b = randomHalfStep(capacity);
    while (a === b) b = randomHalfStep(capacity);
    const [bigger, smaller] = a > b ? [a, b] : [b, a];
    return {
      title: "Compare two amounts",
      bucket: "compareMeasurements",
      story: "Two containers hold different amounts.",
      visual: () => (
        <div className="control-row">
          <GraduatedContainer capacityL={capacity} fillL={a} tone="a" />
          <GraduatedContainer capacityL={capacity} fillL={b} tone="b" />
        </div>
      ),
      steps: [
        choice(
          { prompt: "Which container holds more?", hint: "Compare the two fill levels.", explain: `${bigger} liters is more than ${smaller} liters.` },
          "The one with the higher fill line",
          ["The one with the lower fill line"]
        ),
        { kind: "number", prompt: "How many MORE liters does it hold?", hint: "Subtract the smaller amount from the bigger one.", explain: `${bigger} − ${smaller} = ${bigger - smaller} liters.`, answer: bigger - smaller, suffix: "L" },
      ],
      wrapUp: `${bigger} liters is ${bigger - smaller} liters more than ${smaller} liters.`,
    };
  }
  const maxUnits = 10;
  const a = randomHalfStep(maxUnits);
  let b = randomHalfStep(maxUnits);
  while (a === b) b = randomHalfStep(maxUnits);
  const [bigger, smaller] = a > b ? [a, b] : [b, a];
  return {
    title: "Compare two amounts",
    bucket: "compareMeasurements",
    story: "Two scales show different masses.",
    visual: () => (
      <div className="control-row">
        <ScaleGauge maxUnits={maxUnits} valueUnits={a} majorStep={2} unitLabel="kg" tone="a" />
        <ScaleGauge maxUnits={maxUnits} valueUnits={b} majorStep={2} unitLabel="kg" tone="b" />
      </div>
    ),
    steps: [
      choice(
        { prompt: "Which one is heavier?", hint: "Compare the two readings.", explain: `${bigger} kg is heavier than ${smaller} kg.` },
        "The one with the higher reading",
        ["The one with the lower reading"]
      ),
      { kind: "number", prompt: "How many MORE kilograms is it?", hint: "Subtract the smaller amount from the bigger one.", explain: `${bigger} − ${smaller} = ${bigger - smaller} kg.`, answer: bigger - smaller, suffix: "kg" },
    ],
    wrapUp: `${bigger} kg is ${bigger - smaller} kg more than ${smaller} kg.`,
  };
}

function measuringProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "readContainer") return readContainerProblem();
  if (bucket === "readScale") return readScaleProblem();
  if (bucket === "chooseUnit") return chooseUnitProblem();
  return compareMeasurementsProblem();
}

export const measuringVolumeAndMass: Unit = {
  id: "measuringVolumeAndMass",
  title: "Measuring and Estimating Liquid Volume and Mass",
  goal: "Read a scale or graduated container to measure mass or volume, and judge which unit makes sense for a real object.",
  standard: "3.MD.2",
  keyIdea: (
    <>
      <p>Grams/kilograms measure MASS (how heavy); liters measure VOLUME (how much something holds) — never interchangeable, even for the same object.</p>
      <p>Grams suit light things; kilograms suit things on the order of a kilogram or heavier.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Measure & Estimate", make: measuringProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: measuringVolumeAndMassTest,
};
