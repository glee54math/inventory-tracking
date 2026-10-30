import { useEffect, useState } from "react";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { wordProblemsWithMassAndVolumeTest } from "./WordProblemsWithMassAndVolumeTest";

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

type UnitName = "L" | "g" | "kg";
const UNIT_LABEL: Record<UnitName, string> = { L: "liters", g: "grams", kg: "kilograms" };

/** A small icon row — the concrete stand-in for "N containers of X each,"
 *  reused across every bucket in this unit rather than a bare number. Kept
 *  local to this unit (no SVG diagram needed; plain text glyphs repeated). */
function IconRow({ glyph, count, label }: { glyph: string; count: number; label?: string }) {
  return (
    <div className="icon-row" aria-label={label}>
      {Array.from({ length: Math.min(count, 10) }, (_, i) => (
        <span key={i} aria-hidden style={{ fontSize: 28 }}>
          {glyph}
        </span>
      ))}
      {count > 10 && <span className="muted small">× {count}</span>}
    </div>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Vocabulary: "same units" means literally the same unit word. */
function SameUnitsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "sameWord";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> A word problem says two masses are given "in the same units."
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What does that mean?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="sameWord">Both numbers use the exact same unit word — both grams, or both kilograms, or both liters</option>
            <option value="bothNumbers">Both numbers are measurements, no matter which unit each one uses</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — \"same units\" means the exact same word: both grams, both kilograms, or both liters. Mixing grams with kilograms (or liters with grams) isn't the same unit, even though both are measurements."
            : "Not quite — \"same units\" means the literal same word (both grams, or both kilograms, or both liters) — not just \"both are some kind of measurement.\""}
        </p>
      )}
    </div>
  );
}

/** REQUIRED: mismatched units trap, explicit. */
function MismatchedUnitsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "cant";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> A recipe uses 300 grams of flour and 2 liters of milk.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Can you add 300 + 2 to find a combined total?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes — 302 of something</option>
            <option value="cant">No — grams measure mass and liters measure volume; they can't be combined into one total at all</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — this problem is a trap: 300 grams (mass) and 2 liters (volume) measure two completely different things. There's no single combined total to find, no matter what operation you try."
            : "Not quite — 300 grams measures MASS and 2 liters measures VOLUME. Adding their numbers together gives \"302\" of nothing real — always check that two quantities share the same unit before combining them."}
        </p>
      )}
    </div>
  );
}

/** Operation-selection reasoning: scale-up (multiply) vs. share-equally
 *  (divide), from the story's structure, not a keyword. */
function OperationChoiceQuestion({ onComplete }: { onComplete?: () => void }) {
  const [pickedA, setPickedA] = useState("");
  const [pickedB, setPickedB] = useState("");
  const [checked, setChecked] = useState(false);
  const okA = pickedA === "divide";
  const okB = pickedB === "multiply";
  const ok = okA && okB;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Which operation fits each story?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          "20 liters of water are shared EQUALLY among 5 bins."{" "}
          <select className="answer" value={pickedA} onChange={(e) => setPickedA(e.target.value)} style={fieldOk(okA, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="multiply">Multiply</option>
            <option value="divide">Divide</option>
          </select>
        </label>
        <label>
          "3 crates EACH hold 6 kilograms of apples."{" "}
          <select className="answer" value={pickedB} onChange={(e) => setPickedB(e.target.value)} style={fieldOk(okB, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="multiply">Multiply</option>
            <option value="divide">Divide</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — \"shared equally among\" means DIVIDE; \"EACH holds the same amount, how many in all\" means MULTIPLY. Neither story used the word \"divide\" or \"multiply\" itself — you have to reason from the structure."
            : "Not quite — \"shared equally among\" is a DIVIDE story (splitting a total into equal groups); \"each holds the same amount\" asking for a total is a MULTIPLY story (equal groups combined). Look at the structure, not just the wording."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap. */
function AlwaysAddTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: whenever a word problem about mass or volume gives you two numbers, the answer always comes from adding them.
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
            ? "Correct — the right operation depends on the story: combining is addition, finding a difference is subtraction, equal groups combined is multiplication, and splitting into equal groups is division. \"Always add\" ignores what's actually happening in the story."
            : "Not quite — remember the bin/crate stories. Sometimes the right move is to divide or multiply, not add. Always read what's actually happening before picking an operation."}
        </p>
      )}
    </div>
  );
}

function WordProblemsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ sameUnits: false, mismatched: false, opChoice: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure picking the right operation makes sense before you try practice problems.</p>
      <SameUnitsQuestion onComplete={mark("sameUnits")} />
      <MismatchedUnitsQuestion onComplete={mark("mismatched")} />
      <OperationChoiceQuestion onComplete={mark("opChoice")} />
      <AlwaysAddTrapQuestion onComplete={mark("trap")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [n, setN] = useState(4);
  const [each, setEach] = useState(3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button
          type="button"
          className="btn ghost"
          style={{ width: "fit-content", ...(showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
          onClick={() => setShowCheck((v) => !v)}
        >
          Check for Understanding
        </button>
      )}
      {(introActive || showCheck) && <WordProblemsCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">{n} jugs, each holding {each} liters — an equal-groups story, the setup for a multiply (total) or divide (share) question.</p>
      <IconRow glyph="🧃" count={n} label={`${n} jugs`} />
      <div className="control-row">
        <Stepper label="Jugs" value={n} min={2} max={8} onChange={setN} tone="a" />
        <Stepper label="Liters each" value={each} min={1} max={6} onChange={setEach} tone="b" />
      </div>
      <p className="feedback good">
        {n} jugs × {each} liters each = {n * each} liters in all. Flip it around: {n * each} liters shared equally among {n} jugs is {each} liters
        each.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "addSubtract" | "multiplyScale" | "divideShare" | "mixedUnnamed";
const BUCKETS: Bucket[] = ["addSubtract", "multiplyScale", "divideShare", "mixedUnnamed"];

const UNIT_POOL: UnitName[] = ["L", "g", "kg"];

function addSubtractProblem(): Problem {
  const unit = pick(UNIT_POOL);
  const isAdd = Math.random() < 0.5;
  const a = randInt(unit === "g" ? 100 : 2, unit === "g" ? 800 : 20);
  const b = randInt(unit === "g" ? 50 : 1, unit === "g" ? Math.min(a - 10, 400) : Math.max(1, a - 1));
  const answer = isAdd ? a + b : a - b;
  return {
    title: isAdd ? "Combine two amounts" : "Find the difference",
    bucket: "addSubtract",
    story: isAdd
      ? `A container has ${a} ${unit}. Someone adds ${b} more ${unit}.`
      : `A container has ${a} ${unit}. Someone uses ${b} ${unit} of it.`,
    visual: () => <div style={{ fontSize: 40, textAlign: "center" }}>{unit === "L" ? "🧃" : "⚖️"}</div>,
    steps: [
      {
        kind: "number",
        prompt: isAdd ? `How many ${UNIT_LABEL[unit]} are there now?` : `How many ${UNIT_LABEL[unit]} are left?`,
        hint: isAdd ? "Add the two amounts." : "Subtract the used amount from the start.",
        explain: isAdd ? `${a} + ${b} = ${answer} ${unit}.` : `${a} − ${b} = ${answer} ${unit}.`,
        answer,
        suffix: unit,
      },
    ],
    wrapUp: `${isAdd ? `${a} + ${b}` : `${a} − ${b}`} = ${answer} ${unit}.`,
  };
}

function multiplyScaleProblem(): Problem {
  const unit = pick(UNIT_POOL);
  const n = randInt(3, 8);
  const each = unit === "g" ? randInt(50, 300) : randInt(1, 6);
  const total = n * each;
  const glyph = unit === "L" ? "🧃" : unit === "kg" ? "🎒" : "🍬";
  return {
    title: "Scale up an amount",
    bucket: "multiplyScale",
    story: `${n} ${unit === "L" ? "jugs" : unit === "kg" ? "bags" : "bags of candy"} each hold ${each} ${unit}.`,
    visual: () => <IconRow glyph={glyph} count={n} />,
    steps: [
      { kind: "number", prompt: `How many ${UNIT_LABEL[unit]} is that in all?`, hint: "Multiply the number of groups by the amount in each.", explain: `${n} × ${each} = ${total} ${unit}.`, answer: total, suffix: unit },
    ],
    wrapUp: `${n} × ${each} = ${total} ${unit}.`,
  };
}

function divideShareProblem(): Problem {
  const unit = pick(UNIT_POOL);
  const n = randInt(2, 6);
  const each = unit === "g" ? randInt(20, 150) : randInt(1, 6);
  const total = n * each;
  const glyph = unit === "L" ? "🪣" : "📦";
  return {
    title: "Share equally",
    bucket: "divideShare",
    story: `${total} ${UNIT_LABEL[unit]} are shared EQUALLY among ${n} ${unit === "L" ? "buckets" : "boxes"}.`,
    visual: () => <IconRow glyph={glyph} count={n} />,
    steps: [
      { kind: "number", prompt: `How many ${UNIT_LABEL[unit]} does each one get?`, hint: "Divide the total by the number of groups.", explain: `${total} ÷ ${n} = ${each} ${unit}.`, answer: each, suffix: unit },
    ],
    wrapUp: `${total} ÷ ${n} = ${each} ${unit}.`,
  };
}

/** The operation is never named in the story (no "in all," "left,"
 *  "shared equally," "each"-plus-"total" cue phrasing) — the student must
 *  decide it from what's happening. All four operations are reachable; the
 *  FIRST step is always the operation choice, so a student who defaults to
 *  "always add" is caught before any arithmetic. Shared by Practice and (as
 *  a duplicate, per the *Test.tsx convention) the unit test. */
type Op = "Add" | "Subtract" | "Multiply" | "Divide";
function mixedUnnamedProblem(): Problem {
  const op = pick(["Add", "Subtract", "Multiply", "Divide"] as const) as Op;
  let story = "";
  let answer = 0;
  let explain = "";
  let unit: UnitName = "L";
  if (op === "Add") {
    unit = "kg";
    const a = randInt(3, 15);
    const b = randInt(2, 12);
    answer = a + b;
    story = `A puppy had a mass of ${a} kg in the spring. By fall it had gained ${b} kg. What is its mass now?`;
    explain = `${a} + ${b} = ${answer} kg — gaining mass makes it bigger.`;
  } else if (op === "Subtract") {
    unit = "L";
    const a = randInt(10, 30);
    const b = randInt(2, a - 2);
    answer = a - b;
    story = `A fish tank held ${a} liters of water. After cleaning, it held ${b} liters. What volume of water was removed?`;
    explain = `${a} − ${b} = ${answer} L — the difference between before and after.`;
  } else if (op === "Multiply") {
    unit = "g";
    const n = randInt(3, 8);
    const each = randInt(2, 9) * 10;
    answer = n * each;
    story = `One muffin has a mass of ${each} grams. What is the mass of a tray of ${n} identical muffins?`;
    explain = `${n} × ${each} = ${answer} g — ${n} equal groups of ${each}.`;
  } else {
    unit = "L";
    const n = randInt(2, 6);
    const each = randInt(2, 8);
    const total = n * each;
    answer = each;
    story = `${total} liters of juice fill ${n} identical pitchers to the top. What volume does one pitcher hold?`;
    explain = `${total} ÷ ${n} = ${answer} L — a total split into ${n} equal parts.`;
  }
  const distractors = (["Add", "Subtract", "Multiply", "Divide"] as Op[]).filter((o) => o !== op);
  return {
    title: "What operation fits?",
    bucket: "mixedUnnamed",
    story,
    visual: () => <div style={{ fontSize: 40, textAlign: "center" }}>🤔</div>,
    steps: [
      choice(
        {
          prompt: "Which operation does this story call for?",
          hint: "Picture what's happening: getting bigger, finding a gap, equal groups put together, or a total split into equal groups?",
          explain: `${op} — ${explain}`,
        },
        op,
        distractors
      ),
      { kind: "number", prompt: `Now solve it. How many ${UNIT_LABEL[unit]}?`, hint: `Use ${op.toLowerCase()}.`, explain, answer, suffix: unit },
    ],
    wrapUp: explain,
  };
}

function wordProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "addSubtract") return addSubtractProblem();
  if (bucket === "multiplyScale") return multiplyScaleProblem();
  if (bucket === "divideShare") return divideShareProblem();
  return mixedUnnamedProblem();
}

export const wordProblemsWithMassAndVolume: Unit = {
  id: "wordProblemsWithMassAndVolume",
  title: "One-Step Word Problems with Masses and Volumes",
  goal: "Use addition, subtraction, multiplication, or division to solve a real-world problem about masses or volumes given in the same unit.",
  standard: "3.MD.2",
  keyIdea: (
    <>
      <p>Only combine two amounts that share the exact same unit word — grams with grams, kilograms with kilograms, liters with liters.</p>
      <p>Pick the operation from the story's structure: combining is add, a difference is subtract, equal groups combined is multiply, splitting a total into equal groups is divide.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Word Problems", make: wordProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: wordProblemsWithMassAndVolumeTest,
};
