import { useEffect, useState } from "react";
import { BaseTenBlocks } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { tensAndOnesTest } from "./TensAndOnesTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary / standard case: a regular two-digit number whose name doesn't
 *  hide its own tens digit the way a teen number's does. */
function StandardDecompQuestion({ onComplete }: { onComplete?: () => void }) {
  const [tens, setTens] = useState("");
  const [ones, setOnes] = useState("");
  const [checked, setChecked] = useState(false);
  const tensOk = tens === "3";
  const onesOk = ones === "6";
  const ok = tensOk && onesOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Look at 36. How many tens, and how many ones?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Tens:{" "}
          <select className="answer" value={tens} onChange={(e) => setTens(e.target.value)} style={fieldOk(tensOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            {[2, 3, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ones:{" "}
          <select className="answer" value={ones} onChange={(e) => setOnes(e.target.value)} style={fieldOk(onesOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            {[3, 6, 0].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 36 is 3 tens and 6 ones. That's 30 + 6." : "Not quite — the first digit (3) is the tens, the second digit (6) is the ones."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated: a TEEN number, whose English name doesn't obviously
 *  say "ten" the way "twenty-four" obviously contains "twenty." */
function TeenDecompQuestion({ onComplete }: { onComplete?: () => void }) {
  const [hidesTen, setHidesTen] = useState("");
  const [onesCount, setOnesCount] = useState("");
  const [checked, setChecked] = useState(false);
  const hidesOk = hidesTen === "yes";
  const onesOk = onesCount === "4";
  const ok = hidesOk && onesOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Look at 14 — "fourteen."
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Is there really a hidden ten inside "fourteen," even though the word doesn't say "ten-four"?{" "}
          <select className="answer" value={hidesTen} onChange={(e) => setHidesTen(e.target.value)} style={fieldOk(hidesOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes — 14 is 1 ten and some ones</option>
            <option value="no">No — "fourteen" is just its own separate word</option>
          </select>
        </label>
        <label>
          How many ones?{" "}
          <select className="answer" value={onesCount} onChange={(e) => setOnesCount(e.target.value)} style={fieldOk(onesOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            {[4, 1, 14].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? 'Correct — even though "fourteen" doesn\'t sound like it has "ten" in it, 14 is still exactly 1 ten and 4 ones, same as every other two-digit number.'
            : 'Not quite — "fourteen" LOOKS like one unrelated word, but it still means 1 ten and 4 ones underneath, just like 24 means 2 tens and 4 ones.'}
        </p>
      )}
    </div>
  );
}

/** Special case: exactly 10 — tests that "0 ones" is a real answer, not "nothing there." */
function ExactlyTenQuestion({ onComplete }: { onComplete?: () => void }) {
  const [ones, setOnes] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = ones === "0";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> 10 is 1 ten and how many ones?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={ones} onChange={(e) => setOnes(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="0">0 ones</option>
          <option value="none">it doesn't have a ones amount</option>
          <option value="1">1 one</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 10 is 1 ten and 0 ones. Every two-digit number HAS a ones amount, even when that amount happens to be zero."
            : "Not quite — 10 still has a ones digit, it's just 0. \"0 ones\" means none are left over, not that the ones place doesn't exist."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false: does the ones digit always tell you the
 *  leftover amount, even when it's 0? */
function ZeroOnesGeneralizationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: a number's ones digit always tells you exactly how many single, unbundled ones are left over — even when that digit is 0,
        like in 70.
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
            ? "Correct — 70 is exactly 7 tens and 0 ones. The 0 is real information: it tells you there are no loose ones at all, not that the number has none to report."
            : "Not quite — look at 70's blocks: 7 full ten-sticks and not one single loose cube. The ones digit (0) is reporting that truthfully."}
        </p>
      )}
    </div>
  );
}

function TensAndOnesCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ standard: false, teen: false, exactTen: false, zeroOnes: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure tens and ones make sense before you try practice problems.</p>
      <StandardDecompQuestion onComplete={mark("standard")} />
      <TeenDecompQuestion onComplete={mark("teen")} />
      <ExactlyTenQuestion onComplete={mark("exactTen")} />
      <ZeroOnesGeneralizationQuestion onComplete={mark("zeroOnes")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [tens, setTens] = useState(2);
  const [ones, setOnes] = useState(4);
  const [revealSentence, setRevealSentence] = useState(false);
  const value = tens * 10 + ones;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Tens" value={tens} min={0} max={9} step={1} onChange={(v) => setTens(v)} tone="a" />
        <Stepper label="Ones" value={ones} min={0} max={9} step={1} onChange={(v) => setOnes(v)} tone="b" />
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
      {(introActive || showCheck) && <TensAndOnesCheckForUnderstanding onComplete={onIntroDone} />}

      <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />

      <div className="control-row" style={{ alignItems: "center" }}>
        <button className="btn ghost" onClick={() => setRevealSentence((v) => !v)}>
          {revealSentence ? "Hide" : "Show"} the number sentence
        </button>
      </div>
      {revealSentence && (
        <p style={{ fontWeight: 800, fontSize: 20 }}>
          {value} = {tens} ten{tens === 1 ? "" : "s"} + {ones} one{ones === 1 ? "" : "s"}
        </p>
      )}
      <p className="muted small">
        Build the blocks FIRST, then peek at the number sentence — the sentence is just a shorter way to write what the tens-sticks and ones-cubes already
        show you.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "standard" | "exactTen" | "teen" | "exactDecade" | "reverse";
const BUCKETS: Bucket[] = ["standard", "exactTen", "teen", "exactDecade", "reverse"];

function tensAndOnesProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "exactTen") {
    return {
      title: "A special number: 10",
      bucket,
      story: "How many tens and ones make up the number 10?",
      visual: () => <BaseTenBlocks tens={1} ones={0} tenTone="a" oneTone="b" />,
      steps: [
        { kind: "number", prompt: "How many tens is 10?", hint: "Count the ten-sticks.", explain: "10 is exactly 1 ten.", answer: 1 },
        { kind: "number", prompt: "How many ones is 10?", hint: "Count the loose ones-cubes — there aren't any!", explain: "10 has 0 loose ones — every one of them is already bundled into the ten.", answer: 0 },
      ],
      wrapUp: "10 = 1 ten + 0 ones.",
    };
  }

  if (bucket === "teen") {
    const ones = randInt(1, 9);
    const n = 10 + ones;
    return {
      title: "A teen number",
      bucket,
      story: `${n} is a teen number. How many tens and ones make it up?`,
      visual: () => <BaseTenBlocks tens={1} ones={ones} tenTone="a" oneTone="b" />,
      steps: [
        { kind: "number", prompt: `How many tens is ${n}?`, hint: "Every teen number has exactly one bundled ten hiding inside it.", explain: `${n} is 1 ten and ${ones} ones.`, answer: 1 },
        { kind: "number", prompt: `How many ones is ${n}?`, hint: "Count the loose ones-cubes.", explain: `${n} has ${ones} loose ones.`, answer: ones },
      ],
      wrapUp: `${n} = 1 ten + ${ones} ones.`,
    };
  }

  if (bucket === "exactDecade") {
    const tens = randInt(2, 9);
    const n = tens * 10;
    return {
      title: "An exact decade",
      bucket,
      story: `${n} is an exact decade — no leftovers. How many tens and ones?`,
      visual: () => <BaseTenBlocks tens={tens} ones={0} tenTone="a" oneTone="b" />,
      steps: [
        { kind: "number", prompt: `How many tens is ${n}?`, hint: "Count the ten-sticks.", explain: `${n} is ${tens} tens.`, answer: tens },
        { kind: "number", prompt: `How many ones is ${n}?`, hint: "There are no loose ones-cubes shown.", explain: `${n} has 0 ones.`, answer: 0 },
      ],
      wrapUp: `${n} = ${tens} tens + 0 ones.`,
    };
  }

  if (bucket === "reverse") {
    const tens = randInt(1, 9);
    const ones = randInt(0, 9);
    const n = tens * 10 + ones;
    return {
      title: "Build the number",
      bucket,
      story: `A friend has ${tens} ten-stick${tens === 1 ? "" : "s"} and ${ones} loose one${ones === 1 ? "" : "s"}. What number is that?`,
      visual: () => <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />,
      steps: [{ kind: "number", prompt: `${tens} tens and ${ones} ones is what number?`, hint: "Tens digit first, then ones digit.", explain: `${tens} tens and ${ones} ones is ${n}.`, answer: n }],
      wrapUp: `${tens} tens + ${ones} ones = ${n}.`,
    };
  }

  // standard — a regular, non-special two-digit number.
  const tens = randInt(2, 9);
  let ones: number;
  do {
    ones = randInt(0, 9);
  } while (ones === 0);
  const n = tens * 10 + ones;
  return {
    title: "Tens and ones",
    bucket,
    story: `Look at ${n}. How many tens and ones make it up?`,
    visual: () => <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />,
    steps: [
      { kind: "number", prompt: `How many tens is ${n}?`, hint: "Count the ten-sticks.", explain: `${n} is ${tens} tens and ${ones} ones.`, answer: tens },
      { kind: "number", prompt: `How many ones is ${n}?`, hint: "Count the loose ones-cubes.", explain: `${n} has ${ones} ones.`, answer: ones },
      choice(
        { prompt: `${n} = ${tens} tens + ___ ones. Which number sentence is correct?`, hint: "The tens digit tells you tens; the ones digit tells you ones.", explain: `${n} = ${tens * 10} + ${ones} = ${n}.` },
        `${tens * 10} + ${ones}`,
        [`${ones * 10} + ${tens}`] // misconception: swapping which digit is tens vs ones
      ),
    ],
    wrapUp: `${n} = ${tens} tens + ${ones} ones.`,
  };
}

export const tensAndOnes: Unit = {
  id: "tensAndOnes",
  title: "Tens and Ones",
  goal: "See that the two digits in a number like 24 mean 2 tens and 4 ones — even for teens and exact decades.",
  standard: "1.NBT.2a-c",
  keyIdea: (
    <>
      <p>Every two-digit number is made of bundled tens plus some loose ones — the tens digit counts the bundles, the ones digit counts the leftovers.</p>
      <p>This is true even for teen numbers (whose names don't obviously say "ten") and exact decades (whose ones digit is 0, not "nothing").</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Decomposition is meant to be derived via the blocks each time, not
  // memorized long-term the way the count sequence itself is (that's
  // Counting to 120's job) — so no periodic re-gating here.
  problems: [{ label: "Tens and Ones", make: tensAndOnesProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: tensAndOnesTest,
};
