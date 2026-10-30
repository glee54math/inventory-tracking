import { useEffect, useState } from "react";
import { PairCounters, type CounterArrangement } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { determiningOddAndEvenTest } from "./DeterminingOddAndEvenTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions (never randomized — same convention as every
// other gated unit in this app). Targets the plan's named misconception:
// evenness as a memorized ending-digit pattern disconnected from the actual
// pairing reasoning, and the belief that rearranging a group could change
// whether it's odd or even.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary question a rote "look at the last digit" drill never asks
 *  directly: what actually PROVES a number is even. */
function WhatProvesEvenQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "pair";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Which of these actually PROVES a group of objects is even?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="digit">It ends in 0, 2, 4, 6, or 8</option>
          <option value="pair">Every object can be paired up with a partner, with none left over</option>
          <option value="big">It's a big number</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — a number is even because every object can be paired up with none left over. The ending-digit pattern is just a shortcut that happens to follow from that, not the reason itself."
            : "Not quite — noticing the last digit is just a shortcut. What actually MAKES a number even is that every object can be paired up with a partner, with none left over."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated adjacent concept: contrasts odd and even directly on
 *  two related counts (14 and 15) in the same question. */
function OddVsEvenContrastQuestion({ onComplete }: { onComplete?: () => void }) {
  const [parity14, setParity14] = useState("");
  const [leftover15, setLeftover15] = useState("");
  const [checked, setChecked] = useState(false);
  const ok1 = parity14 === "even";
  const ok2 = leftover15 === "1";
  const ok = ok1 && ok2;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> 14 objects can be paired into exactly 7 pairs, with none left over. Is 14 odd or even? If you had 15 objects instead and tried
        the same pairing, how many would be left unpaired?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          14 is:{" "}
          <select className="answer" value={parity14} onChange={(e) => setParity14(e.target.value)} style={fieldOk(ok1, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="odd">Odd</option>
            <option value="even">Even</option>
          </select>
        </label>
        <label>
          15 leaves unpaired:{" "}
          <select className="answer" value={leftover15} onChange={(e) => setLeftover15(e.target.value)} style={fieldOk(ok2, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 14 pairs up evenly (even), but one more object (15) always leaves exactly 1 unpaired (odd)."
            : "Not quite — 14 pairs up with none left over, so it's EVEN. One more object (15) always leaves exactly 1 unpaired, so 15 is ODD."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: rearranging a group never changes its
 *  parity — the plan's explicit second misconception target. */
function ArrangementDoesNotChangeParityQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: if you have 12 counters in a neat line and then dump them into a messy, scattered pile, the 12 counters could
        become ODD instead of EVEN.
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
            ? "Correct — false. How the objects are arranged never changes how many there are, so it never changes whether that count is odd or even."
            : "Not quite — it's false. Scattering the same 12 counters doesn't change how many there are, so it can't change whether the count is odd or even."}
        </p>
      )}
    </div>
  );
}

/** Multi-part reasoning question (preferred over a trivial single-pick):
 *  pairing check, then classification, for the same group. */
function PairThenClassifyQuestion({ onComplete }: { onComplete?: () => void }) {
  const [canPair, setCanPair] = useState("");
  const [parity, setParity] = useState("");
  const [checked, setChecked] = useState(false);
  const ok1 = canPair === "no";
  const ok2 = parity === "odd";
  const ok = ok1 && ok2;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> A group has 9 objects. Can every single one be paired with a partner, with none left over? So is 9 odd or even?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Pairs up evenly?{" "}
          <select className="answer" value={canPair} onChange={(e) => setCanPair(e.target.value)} style={fieldOk(ok1, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label>
          So 9 is:{" "}
          <select className="answer" value={parity} onChange={(e) => setParity(e.target.value)} style={fieldOk(ok2, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="odd">Odd</option>
            <option value="even">Even</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 9 objects make 4 pairs with 1 left over, so they can't all be paired up. That leftover is exactly what makes 9 odd."
            : "Not quite — 9 objects make 4 pairs with 1 left over. Since not everyone gets a partner, 9 is ODD."}
        </p>
      )}
    </div>
  );
}

function OddEvenCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ proves: false, contrast: false, arrangement: false, pairClassify: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure odd and even really come from pairing before you try practice problems.</p>
      <WhatProvesEvenQuestion onComplete={mark("proves")} />
      <OddVsEvenContrastQuestion onComplete={mark("contrast")} />
      <ArrangementDoesNotChangeParityQuestion onComplete={mark("arrangement")} />
      <PairThenClassifyQuestion onComplete={mark("pairClassify")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [count, setCount] = useState(8);
  const [arrangement, setArrangement] = useState<CounterArrangement>("line");
  const [showPairs, setShowPairs] = useState(false);
  const [seed, setSeed] = useState(1);

  const isEven = count % 2 === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="How many objects" value={count} min={0} max={20} step={1} onChange={setCount} tone="a" />
        <Segmented
          label="Arrangement"
          value={arrangement}
          onChange={(v) => {
            setArrangement(v);
            setSeed((s) => s + 1);
          }}
          options={[
            { id: "line", label: "Line" },
            { id: "array", label: "Grid" },
            { id: "scatter", label: "Scattered" },
          ]}
        />
        <button className="btn ghost" type="button" onClick={() => setShowPairs((v) => !v)}>
          {showPairs ? "Hide pairs" : "Show pairs"}
        </button>
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
      {(introActive || showCheck) && <OddEvenCheckForUnderstanding onComplete={onIntroDone} />}

      <PairCounters count={count} arrangement={arrangement} tone="a" seed={seed} showPairs={showPairs} />
      <p className="muted small">
        {showPairs
          ? isEven
            ? `All ${count} objects paired up with none left over — ${count} is EVEN.`
            : `${count - 1} objects paired up, but 1 is left without a partner — ${count} is ODD.`
          : `Try pairing up all ${count} objects in your head, then click "Show pairs" to check. Changing the arrangement never changes whether ${count} is odd or even.`}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "smallEven" | "smallOdd" | "largerEven" | "largerOdd" | "scattered";
const BUCKETS: Bucket[] = ["smallEven", "smallOdd", "largerEven", "largerOdd", "scattered"];

function oddEvenProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  const seed = randInt(1, 100000);

  let count = 0;
  let arrangement: CounterArrangement = "line";
  if (bucket === "smallEven") {
    count = randInt(1, 5) * 2; // 2,4,6,8,10
    arrangement = "line";
  } else if (bucket === "smallOdd") {
    count = randInt(0, 4) * 2 + 1; // 1,3,5,7,9
    arrangement = "line";
  } else if (bucket === "largerEven") {
    count = randInt(6, 10) * 2; // 12,14,16,18,20
    arrangement = "array";
  } else if (bucket === "largerOdd") {
    count = randInt(5, 9) * 2 + 1; // 11,13,15,17,19
    arrangement = "array";
  } else {
    // scattered — any count 1-20, arrangement is the point of this bucket,
    // not a particular parity.
    count = randInt(1, 20);
    arrangement = "scatter";
  }
  const isEven = count % 2 === 0;

  return {
    title: "Odd or Even?",
    bucket,
    story: `How many objects are there, and is that count odd or even?`,
    visual: (done) => <PairCounters count={count} arrangement={arrangement} tone="a" seed={seed} showPairs={done >= 2} />,
    steps: [
      { kind: "number", prompt: "How many objects are there? Count them.", hint: "Count every single object once.", explain: `There are ${count} objects.`, answer: count },
      choice(
        { prompt: "Can every object be paired up with a partner, with none left over?", hint: "Try matching them up two at a time.", explain: isEven ? `All ${count} pair up with none left over.` : `${count - 1} pair up, but 1 is left over.` },
        isEven ? "Yes" : "No",
        [isEven ? "No" : "Yes"]
      ),
      choice(
        { prompt: "So is this group ODD or EVEN?", hint: "No leftover means even; one leftover means odd.", explain: `${count} is ${isEven ? "even" : "odd"}.` },
        isEven ? "Even" : "Odd",
        [isEven ? "Odd" : "Even"]
      ),
    ],
    wrapUp: `${count} is ${isEven ? "EVEN" : "ODD"} — ${isEven ? "every object has a partner" : "one object is left without a partner"}, no matter how they're arranged.`,
  };
}

export const determiningOddAndEven: Unit = {
  id: "determiningOddAndEven",
  title: "Determining Odd and Even",
  goal: "Decide whether a group of up to 20 objects is odd or even by checking whether everyone can be paired up.",
  standard: "2.OA.3",
  keyIdea: (
    <>
      <p>A group is EVEN when every object can be paired up with a partner, with none left over. It's ODD when exactly one object is left without a partner.</p>
      <p>This never depends on how the objects are arranged — a scattered pile has the exact same parity as a neat line of the same count.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Odd or Even?", make: oddEvenProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: determiningOddAndEvenTest,
};
