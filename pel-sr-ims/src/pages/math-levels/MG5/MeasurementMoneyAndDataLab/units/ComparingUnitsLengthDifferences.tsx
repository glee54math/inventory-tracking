import { useEffect, useState } from "react";
import { Ruler } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingUnitsLengthDifferencesTest } from "./ComparingUnitsLengthDifferencesTest";

const OBJECTS = [
  { name: "Ribbon", glyph: "🎀" },
  { name: "Shoelace", glyph: "👟" },
  { name: "Crayon", glyph: "🖍️" },
  { name: "Carrot", glyph: "🥕" },
  { name: "Scarf", glyph: "🧣" },
] as const;

const pickObject = () => shuffle(OBJECTS)[0];

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "unit";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Inches and centimeters are both examples of what?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="unit">A unit of length</option>
          <option value="tool">A measuring tool, like a ruler</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — inches and centimeters are units: fixed-size steps you measure length in." : "Not quite — inches and centimeters are UNITS, the fixed-size steps you measure with. A ruler is the tool that has those units marked on it."}
        </p>
      )}
    </div>
  );
}

/** THE core misconception: a smaller unit gives a BIGGER count for the
 *  exact same real length, and that doesn't mean the object got longer. */
function SameObjectQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "same";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> The exact same ribbon measures 7 inches long. It also measures 18 centimeters long.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <Ruler unit="in" maxUnits={12} objectStart={0} objectLength={7} label="🎀" tone="a" />
        <Ruler unit="cm" maxUnits={20} objectStart={0} objectLength={18} label="🎀" tone="b" />
      </div>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How can the SAME ribbon have two different numbers?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="grew">The ribbon must have grown between measurements</option>
            <option value="same">Centimeters are a smaller unit than inches, so it takes more of them to cover the same length</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the ribbon never changed size. A centimeter is a smaller step than an inch, so it takes MORE of them to cover the exact same length."
            : "Not quite — the ribbon is exactly the same length both times. It's the UNIT that's different: a centimeter is a smaller step than an inch, so covering the same length takes more of them."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap. */
function GeneralizationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: a bigger measurement number always means a bigger (longer) object.
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
            ? "Correct — remember the ribbon: 18 centimeters and 7 inches are the exact same length. The unit size matters just as much as the number."
            : "Not quite — remember the ribbon measured 7 inches AND 18 centimeters. 18 is bigger than 7, but it's the exact same ribbon — the unit matters, not just the number."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated-concept question: comparing raw numbers across
 *  DIFFERENT units, where the comparison is actually impossible to judge. */
function CrossUnitTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "cant";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> A pencil measures 7 centimeters. A ribbon measures 12 inches.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Is the ribbon longer than the pencil?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes, 12 is bigger than 7</option>
            <option value="cant">Can't tell just from these numbers — they're different units</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — you can only compare the raw numbers directly when they're measured in the SAME unit. 12 inches and 7 centimeters use different-size steps, so 12 vs 7 alone tells you nothing."
            : "Not quite — 12 and 7 are measured in DIFFERENT units (inches vs centimeters). You can't compare raw numbers across different units without converting them first."}
        </p>
      )}
    </div>
  );
}

function ComparingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, sameObject: false, general: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure comparing units makes sense before you try practice problems.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <SameObjectQuestion onComplete={mark("sameObject")} />
      <GeneralizationQuestion onComplete={mark("general")} />
      <CrossUnitTrapQuestion onComplete={mark("trap")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [unitMode, setUnitMode] = useState<"in" | "cm">("in");
  const [obj] = useState(pickObject);
  // A fixed real-world ribbon, shown in BOTH units so the count visibly
  // changes while the ribbon itself (the colored bar) never does.
  const inchLength = 7;
  const cmLength = 18;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="Measure in"
          value={unitMode}
          onChange={setUnitMode}
          options={[
            { id: "in", label: "Inches" },
            { id: "cm", label: "Centimeters" },
          ]}
        />
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
      {(introActive || showCheck) && <ComparingCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">
        This is the SAME {obj.name.toLowerCase()} both times — only the unit changes. Switch between inches and centimeters and watch the count.
      </p>
      {unitMode === "in" ? (
        <Ruler unit="in" maxUnits={12} objectStart={0} objectLength={inchLength} label={obj.glyph} tone="a" />
      ) : (
        <Ruler unit="cm" maxUnits={20} objectStart={0} objectLength={cmLength} label={obj.glyph} tone="b" />
      )}
      <p className="feedback good" style={{ minHeight: 24 }}>
        {unitMode === "in"
          ? `Measured in inches, it's ${inchLength} — inches are a bigger unit, so it takes fewer of them.`
          : `Measured in centimeters, it's ${cmLength} — centimeters are a smaller unit, so it takes more of them, even though the ${obj.name.toLowerCase()} is exactly the same.`}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "sameObjectTwoUnits" | "lengthDifferenceSameUnit" | "crossUnitTrap";
const BUCKETS: Bucket[] = ["sameObjectTwoUnits", "lengthDifferenceSameUnit", "crossUnitTrap"];

function sameObjectProblem(): Problem {
  const obj = pickObject();
  const inchLength = randInt(4, 9);
  const cmLength = Math.round(inchLength * 2.4) + randInt(-1, 1); // illustrative, not exact conversion
  return {
    title: "Same object, two units",
    bucket: "sameObjectTwoUnits",
    story: `This exact same ${obj.name.toLowerCase()} was measured twice — once in inches, once in centimeters.`,
    visual: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Ruler unit="in" maxUnits={12} objectStart={0} objectLength={inchLength} label={obj.glyph} tone="a" />
        <Ruler unit="cm" maxUnits={Math.max(20, cmLength + 2)} objectStart={0} objectLength={cmLength} label={obj.glyph} tone="b" />
      </div>
    ),
    steps: [
      choice(
        { prompt: "Which measurement has the BIGGER number?", hint: "Compare the two numbers you can read off each ruler.", explain: `${cmLength} centimeters is the bigger number.` },
        `${cmLength} centimeters`,
        [`${inchLength} inches`]
      ),
      choice(
        { prompt: "Why is the centimeter number bigger, even though it's the same object?", hint: "Think about which unit is the smaller step.", explain: "A centimeter is a smaller unit than an inch, so it takes more of them to cover the same length." },
        "Centimeters are a smaller unit, so it takes more of them",
        [`The ${obj.name.toLowerCase()} is actually longer in centimeters`, "It's just a coincidence"]
      ),
    ],
    wrapUp: `The ${obj.name.toLowerCase()} is ${inchLength} inches AND ${cmLength} centimeters — the same length, described with two different-size units.`,
  };
}

function differenceProblem(): Problem {
  const [a, b] = shuffle(OBJECTS).slice(0, 2);
  const unit: "in" | "cm" = Math.random() < 0.5 ? "in" : "cm";
  const maxUnits = unit === "in" ? 12 : 20;
  const lenA = unit === "in" ? randInt(5, 9) : randInt(8, 16);
  const lenB = unit === "in" ? randInt(2, lenA - 1) : randInt(2, lenA - 1);
  const diff = lenA - lenB;
  return {
    title: "Find the length difference",
    bucket: "lengthDifferenceSameUnit",
    story: `Both of these were measured in the SAME unit (${unit === "in" ? "inches" : "centimeters"}).`,
    visual: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Ruler unit={unit} maxUnits={maxUnits} objectStart={0} objectLength={lenA} label={a.glyph} tone="a" />
        <Ruler unit={unit} maxUnits={maxUnits} objectStart={0} objectLength={lenB} label={b.glyph} tone="b" />
      </div>
    ),
    steps: [
      { kind: "number", prompt: `How much LONGER is the ${a.name.toLowerCase()} than the ${b.name.toLowerCase()}?`, hint: `Subtract: ${lenA} − ${lenB}.`, explain: `${lenA} − ${lenB} = ${diff} ${unit}.`, answer: diff, suffix: unit },
    ],
    wrapUp: `The ${a.name.toLowerCase()} is ${diff} ${unit} longer than the ${b.name.toLowerCase()}.`,
  };
}

function crossUnitTrapProblem(): Problem {
  const a = pickObject();
  const b = shuffle(OBJECTS.filter((o) => o.name !== a.name))[0];
  const numA = randInt(5, 14);
  const numB = randInt(5, 14);
  const unitA = Math.random() < 0.5 ? "inches" : "centimeters";
  const unitB = unitA === "inches" ? "centimeters" : "inches";
  return {
    title: "Can you compare these?",
    bucket: "crossUnitTrap",
    story: `The ${a.name.toLowerCase()} measures ${numA} ${unitA}. The ${b.name.toLowerCase()} measures ${numB} ${unitB}.`,
    visual: () => (
      <div className="control-row" style={{ justifyContent: "center", fontSize: 32 }}>
        <span>
          {a.glyph} {numA} {unitA}
        </span>
        <span>
          {b.glyph} {numB} {unitB}
        </span>
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `Is the ${a.name.toLowerCase()} longer than the ${b.name.toLowerCase()}?`,
          hint: "Check: are both measured in the SAME unit?",
          explain: `${unitA} and ${unitB} are different-size units, so comparing ${numA} and ${numB} directly tells you nothing.`,
        },
        "Can't tell — they're measured in different units",
        [`Yes, because ${Math.max(numA, numB)} is bigger`, `No, because ${Math.min(numA, numB)} is smaller`]
      ),
      choice(
        { prompt: "What would you need before you could compare them fairly?", hint: "Think about what's different between the two measurements.", explain: "You'd need both measured in the same unit — or a way to convert one unit into the other." },
        "Measure both in the same unit",
        ["Nothing — the numbers already tell you", "Measure them on different days"]
      ),
    ],
    wrapUp: `Without matching units, ${numA} ${unitA} and ${numB} ${unitB} can't be compared directly.`,
  };
}

export const comparingUnitsLengthDifferences: Unit = {
  id: "comparingUnitsLengthDifferences",
  title: "Comparing Measurement Units and Length Differences",
  goal: "Notice that measuring the same object with a smaller unit gives a bigger number, and find how much longer one object is than another.",
  standard: "2.MD.2, 2.MD.4",
  keyIdea: (
    <>
      <p>The same object measured with a SMALLER unit gives a BIGGER number — the object didn't change, the unit size did.</p>
      <p>You can only compare raw numbers directly when they're measured in the same unit.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [
    { label: "Same Object, Two Units", make: sameObjectProblem, buckets: ["sameObjectTwoUnits"] },
    { label: "Find the Difference", make: differenceProblem, buckets: ["lengthDifferenceSameUnit"] },
    { label: "Can You Compare?", make: crossUnitTrapProblem, buckets: ["crossUnitTrap"] },
  ],
  requiredBuckets: BUCKETS,
  test: comparingUnitsLengthDifferencesTest,
};
