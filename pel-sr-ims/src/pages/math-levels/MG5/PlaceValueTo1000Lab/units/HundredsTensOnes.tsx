import { useEffect, useState, type CSSProperties } from "react";
import { BaseTenBlocks } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { regroupBreakdown, valueFromDigits } from "../logic";
import type { Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { hundredsTensOnesTest } from "./HundredsTensOnesTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Q1 — vocabulary: naming which PLACE a digit sits in, not just reading it. */
function DigitValueQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "4 tens (40)";
  const OPTIONS = ["4 hundreds (400)", CORRECT, "4 ones"];
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> In the number 342, what does the digit 4 represent?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the 4 is in the tens place, so it's worth 4 tens, or 40."
            : "Not quite — look at WHICH place the 4 sits in (hundreds, tens, or ones), not just the digit itself."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the core misconception named in the plan: treating a number's digits
 *  as separate unrelated facts instead of each depending on its position. */
function SeparateFactsTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "False";
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> True or False: In the number 350, the 3 means "3 hundreds" and the 50 means "50 ones" — two separate facts that have nothing to do with each other.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — it's False. 350 is 3 hundreds + 5 tens + 0 ones. The 5 is in the TENS place (worth 50), not a separate '50 ones' idea — every digit's value comes from its position in the SAME number."
            : "Not quite — it's actually False. 350 is 3 hundreds + 5 tens + 0 ones, all one number, not two unrelated pieces."}
        </p>
      )}
    </div>
  );
}

/** Q3 — generalization/true-false trap: 100 = 10 tens bundled together is a
 *  regrouping of the SAME quantity, not an unrelated fact to memorize. */
function HundredEqualsTenTensQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "True";
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: 100 is the exact same amount as 10 tens bundled together.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 10 tens-sticks pushed together make exactly one hundred-flat. Same amount, just bundled differently."
            : "Not quite — it's True. Try the toggle above: 10 separate tens-sticks take up the exact same space as 1 hundred-flat."}
        </p>
      )}
    </div>
  );
}

/** Q4 — the regroup bucket's own skill, as a fixed multi-part fill-in: turn
 *  "15 tens" into hundreds + leftover tens. Two dropdowns, one shared check,
 *  same pattern as CoordinatePlaneUnit's ReflectionFormulaQuestion. */
function RegroupFillInQuestion({ onComplete }: { onComplete?: () => void }) {
  const [hundreds, setHundreds] = useState("");
  const [tens, setTens] = useState("");
  const [checked, setChecked] = useState(false);
  const okH = hundreds === "1";
  const okT = tens === "5";
  const ok = okH && okT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> 15 tens is the same as{" "}
        <select className="answer" style={{ width: 60, ...fieldStyle(okH, checked) }} value={hundreds} onChange={(e) => setHundreds(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          {["0", "1", "15"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>{" "}
        hundred(s) and{" "}
        <select className="answer" style={{ width: 60, ...fieldStyle(okT, checked) }} value={tens} onChange={(e) => setTens(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          {["0", "5", "15"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>{" "}
        ten(s).
      </p>
      <div className="control-row">
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 10 of those 15 tens bundle into 1 hundred, leaving 5 tens over: 1 hundred, 5 tens." : "Not quite — 10 tens always bundles into exactly 1 hundred. How many tens are left over after bundling 10 of the 15?"}
        </p>
      )}
    </div>
  );
}

function HundredsTensOnesCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ digit: false, separate: false, hundredTens: false, regroup: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure place value makes sense before you try practice problems.</p>
      <DigitValueQuestion onComplete={mark("digit")} />
      <SeparateFactsTrapQuestion onComplete={mark("separate")} />
      <HundredEqualsTenTensQuestion onComplete={mark("hundredTens")} />
      <RegroupFillInQuestion onComplete={mark("regroup")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [h, setH] = useState(3);
  const [t, setT] = useState(4);
  const [o, setO] = useState(2);
  const [showAsTens, setShowAsTens] = useState(false);
  const value = valueFromDigits(h, t, o);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Hundreds" value={h} min={0} max={9} step={1} onChange={setH} tone="a" />
        <Stepper label="Tens" value={t} min={0} max={19} step={1} onChange={setT} tone="b" />
        <Stepper label="Ones" value={o} min={0} max={9} step={1} onChange={setO} tone="c" />
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
      <BaseTenBlocks hundreds={h} tens={t} ones={o} flagOverflowTens={t >= 10} />
      <p className="muted small">
        {h} hundred{h === 1 ? "" : "s"}, {t} ten{t === 1 ? "" : "s"}, and {o} one{o === 1 ? "" : "s"} make {value}.
        {t >= 10 && " Notice 10 of those tens-sticks are ready to bundle into a brand new hundred-flat."}
      </p>
      <div className="control-row">
        <button type="button" className="btn ghost" onClick={() => setShowAsTens((v) => !v)}>
          {showAsTens ? "Show as 1 hundred-flat" : "Show 100 as 10 tens instead"}
        </button>
      </div>
      {showAsTens ? <BaseTenBlocks hundreds={0} tens={10} ones={0} /> : <BaseTenBlocks hundreds={1} tens={0} ones={0} />}
      <p className="muted small">100 is the exact same amount whether it's drawn as 1 hundred-flat or as 10 separate tens-sticks bundled together.</p>
      {(introActive || showCheck) && <HundredsTensOnesCheck onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — Hundreds, Tens, and Ones
// ============================================================================

export const HTO_BUCKETS = ["plain", "multipleOf100", "zeroTens", "zeroOnes", "regroup"] as const;
export type HtoBucket = (typeof HTO_BUCKETS)[number];

/** A 3-digit number with none of its digits 0 — the "plain" bucket's case,
 *  and also used as the base for the two single-zero buckets below. */
const randNonzeroDigit = () => randInt(1, 9);

export function hundredsTensOnesProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as HtoBucket) ?? HTO_BUCKETS[randInt(0, HTO_BUCKETS.length - 1)];

  if (bucket === "regroup") {
    // Capped at 39 (not the full 10-99 range) so BaseTenBlocks' loose-tens
    // picture stays a reasonable number of rods to look at — still covers
    // the plan's own "15 tens"/"23 tens" examples.
    const tensCount = randInt(11, 39);
    const { hundreds, leftoverTens, value } = regroupBreakdown(tensCount);
    return {
      title: "Regrouping tens",
      bucket,
      story: `${tensCount} tens — how many hundreds and tens is that?`,
      visual: (done: number) =>
        done === 0 ? (
          <BaseTenBlocks hundreds={0} tens={tensCount} ones={0} flagOverflowTens />
        ) : (
          <BaseTenBlocks hundreds={hundreds} tens={leftoverTens} ones={0} />
        ),
      steps: [
        {
          kind: "number",
          prompt: `${tensCount} tens is the same as how many hundreds?`,
          hint: "Every 10 tens bundles into exactly 1 hundred.",
          explain: `${tensCount} tens has ${hundreds} full group${hundreds === 1 ? "" : "s"} of 10 tens, so ${hundreds} hundred${hundreds === 1 ? "" : "s"}.`,
          answer: hundreds,
        },
        {
          kind: "number",
          prompt: `...and how many tens are left over after bundling?`,
          hint: `${tensCount} − ${hundreds * 10} = ?`,
          explain: `${tensCount} tens − ${hundreds * 10} tens (bundled away) leaves ${leftoverTens} tens over.`,
          answer: leftoverTens,
        },
        {
          kind: "number",
          prompt: `So ${tensCount} tens, written as a 3-digit number, is?`,
          hint: "Hundreds digit, then tens digit, then 0 ones.",
          explain: `${hundreds} hundreds and ${leftoverTens} tens is the number ${value}.`,
          answer: value,
        },
      ],
      wrapUp: `${tensCount} tens = ${hundreds} hundred${hundreds === 1 ? "" : "s"} and ${leftoverTens} ten${leftoverTens === 1 ? "" : "s"} = ${value}.`,
    };
  }

  let h: number, t: number, o: number;
  if (bucket === "multipleOf100") {
    h = randNonzeroDigit();
    t = 0;
    o = 0;
  } else if (bucket === "zeroTens") {
    h = randNonzeroDigit();
    t = 0;
    o = randNonzeroDigit();
  } else if (bucket === "zeroOnes") {
    h = randNonzeroDigit();
    t = randNonzeroDigit();
    o = 0;
  } else {
    h = randNonzeroDigit();
    t = randNonzeroDigit();
    o = randNonzeroDigit();
  }
  const n = valueFromDigits(h, t, o);

  const steps =
    bucket === "multipleOf100"
      ? [
          { kind: "number" as const, prompt: `How many hundreds are in ${n}?`, hint: "Look at the first digit.", explain: `${n} has ${h} hundred${h === 1 ? "" : "s"}.`, answer: h },
          { kind: "number" as const, prompt: `How many tens are in ${n}?`, hint: "Look at the middle digit — it's a placeholder here, not a skipped spot.", explain: `${n} has 0 tens.`, answer: 0 },
          {
            kind: "number" as const,
            prompt: `${n} is the same as how many tens IN ALL (not just the tens digit — every ten inside the whole number)?`,
            hint: `${h} hundreds is ${h} groups of 10 tens.`,
            explain: `${n} = ${h} hundreds = ${h * 10} tens in all, since every hundred is 10 tens.`,
            answer: h * 10,
          },
        ]
      : [
          { kind: "number" as const, prompt: `How many hundreds are in ${n}?`, hint: "Look at the first digit.", explain: `${n} has ${h} hundred${h === 1 ? "" : "s"}.`, answer: h },
          { kind: "number" as const, prompt: `How many tens are in ${n}?`, hint: "Look at the middle digit.", explain: `${n} has ${t} ten${t === 1 ? "" : "s"}.`, answer: t },
          { kind: "number" as const, prompt: `How many ones are in ${n}?`, hint: "Look at the last digit.", explain: `${n} has ${o} one${o === 1 ? "" : "s"}.`, answer: o },
        ];

  return {
    title: "Hundreds, Tens, and Ones",
    bucket,
    story: `Build ${n} out of hundreds, tens, and ones.`,
    visual: () => <BaseTenBlocks hundreds={h} tens={t} ones={o} />,
    steps,
    wrapUp: `${n} = ${h} hundred${h === 1 ? "" : "s"} + ${t} ten${t === 1 ? "" : "s"} + ${o} one${o === 1 ? "" : "s"}.`,
  };
}

export const hundredsTensOnes: Unit = {
  id: "hundredsTensOnes",
  title: "Hundreds, Tens, and Ones",
  goal: "Figure out how many hundreds, tens, and ones are inside a 3-digit number, including numbers with a zero in them.",
  standard: "2.NBT.1",
  keyIdea: (
    <>
      <p>Every digit in a number's value depends on WHERE it sits — the same digit 4 can mean 4 hundreds, 4 tens, or 4 ones.</p>
      <p>10 tens always bundles into exactly 1 hundred — 100 is 10 tens, not a separate fact to memorize.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Hundreds, Tens, Ones", make: hundredsTensOnesProblem, buckets: [...HTO_BUCKETS] }],
  requiredBuckets: [...HTO_BUCKETS],
  test: hundredsTensOnesTest,
};
