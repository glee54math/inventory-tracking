import { useEffect, useState } from "react";
import { SplitGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { decomposingNumbersTest } from "./DecomposingNumbersTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// This unit's named misconception (per the plan): believing a number has
// exactly ONE decomposition and stopping there. Every question below ties
// back to that directly.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: "decompose" and "parts," tied to an actual split. */
function DecomposeVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [verbPick, setVerbPick] = useState("");
  const [namePick, setNamePick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [verbPick, namePick].every((v) => String(v).trim() !== "");
  const verbOk = verbPick === "decomposing";
  const nameOk = namePick === "parts";
  const ok = verbOk && nameOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Breaking 7 into 4 and 3.
      </p>
      <SplitGroup total={7} partA={4} toneA="a" toneB="b" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Breaking a number into smaller pieces like this is called ________ it.{" "}
          <select className="answer" value={verbPick} onChange={(e) => setVerbPick(e.target.value)} style={fieldOk(verbOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="decomposing">decomposing</option>
            <option value="comparing">comparing</option>
            <option value="counting">counting</option>
          </select>
        </label>
        <label>
          4 and 3 are both called the two ________.{" "}
          <select className="answer" value={namePick} onChange={(e) => setNamePick(e.target.value)} style={fieldOk(nameOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="parts">parts</option>
            <option value="digits">digits</option>
            <option value="numerals">numerals</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — breaking 7 into 4 and 3 is called decomposing it, and 4 and 3 are the two parts." : "Not quite — breaking a number into pieces is called decomposing it, and the pieces are called parts, not digits or numerals."}
        </p>
      )}
    </div>
  );
}

/** THE core misconception, asked directly: does 6 have more than one decomposition? */
function MoreThanOneWayQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> 6 can be broken into 4 and 2.
      </p>
      <SplitGroup total={6} partA={4} toneA="a" toneB="b" />
      <p>True or false: 6 can ALSO be broken into 3 and 3 — a different pair that still makes 6.</p>
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
            ? "Correct — 6 = 4 + 2, AND 6 = 3 + 3, AND 6 = 5 + 1, AND 6 = 6 + 0. A number can be broken apart in more than one way."
            : "Not quite — check it: 3 + 3 really does equal 6, same as 4 + 2 does. Both are valid ways to break 6 apart."}
        </p>
      )}
    </div>
  );
}

/** Generalization / false trap: is there ever only ONE way? */
function OnlyOneWayTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: every number can be broken into two parts in only ONE way.
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
            ? "Correct — false! For example, 5 can be 4 + 1, OR 3 + 2. Stopping after finding just one way misses all the others."
            : "Not quite — try 5: it can be broken into 4 + 1, but also 3 + 2. That's already two different ways, so 'only one way' isn't right."}
        </p>
      )}
    </div>
  );
}

/** The equal-parts special case students sometimes treat as impossible. */
function EqualPartsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [canPick, setCanPick] = useState("");
  const [partsPick, setPartsPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [canPick, partsPick].every((v) => String(v).trim() !== "");
  const canOk = canPick === "true";
  const partsOk = partsPick === "4";
  const ok = canOk && partsOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Think about the number 8.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          True or false: 8 can be broken into two EQUAL parts.{" "}
          <select className="answer" value={canPick} onChange={(e) => setCanPick(e.target.value)} style={fieldOk(canOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
        <label>
          If so, each equal part would be:{" "}
          <select className="answer" value={partsPick} onChange={(e) => setPartsPick(e.target.value)} style={fieldOk(partsOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 8 = 4 + 4, two EQUAL parts. Equal parts are still a valid decomposition, just like any other pair."
            : "Not quite — 8 = 4 + 4 works, and both parts are the same size (4 and 4). Equal parts are allowed."}
        </p>
      )}
    </div>
  );
}

function DecomposingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, moreThanOne: false, onlyOneTrap: false, equalParts: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure breaking numbers apart makes sense before you try practice problems.</p>
      <DecomposeVocabQuestion onComplete={mark("vocab")} />
      <MoreThanOneWayQuestion onComplete={mark("moreThanOne")} />
      <OnlyOneWayTrapQuestion onComplete={mark("onlyOneTrap")} />
      <EqualPartsQuestion onComplete={mark("equalParts")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [total, setTotal] = useState(7);
  const [partA, setPartA] = useState(4);
  const partB = total - partA;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper
          label="Number to break apart"
          value={total}
          min={2}
          max={10}
          step={1}
          onChange={(n) => {
            setTotal(n);
            setPartA(Math.min(partA, n));
          }}
          tone="c"
        />
        <Stepper label="First part" value={partA} min={0} max={total} step={1} onChange={setPartA} tone="a" />
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
      {(introActive || showCheck) && <DecomposingCheckForUnderstanding onComplete={onIntroDone} />}

      <SplitGroup total={total} partA={partA} toneA="a" toneB="b" />
      <p className="feedback good" style={{ minHeight: 24 }}>
        {total} breaks apart into {partA} and {partB}.
      </p>
      <p className="muted small">
        Move the "First part" slider to see every way to break {total} apart — {total} has {total + 1} different pairs (counting 0 and {total} themselves), not just one.
        {partA === partB && partA * 2 === total ? ` Right now both parts are EQUAL (${partA} and ${partB}) — that's still a valid way!` : ""}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "decomposeSmall" | "decomposeLarge" | "decomposeSecondWay" | "decomposeEqual";
const BUCKETS: Bucket[] = ["decomposeSmall", "decomposeLarge", "decomposeSecondWay", "decomposeEqual"];

function decomposingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "decomposeSmall") {
    const total = randInt(4, 5);
    const a = randInt(1, total - 1);
    const b = total - a;
    return {
      title: "Break it apart",
      bucket,
      story: `Break ${total} into two parts. The first part is ${a}.`,
      visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: `If the first part is ${a}, what is the second part?`, hint: "The two parts together make the whole number.", explain: `${a} + ${b} = ${total}.`, answer: b },
        choice(
          { prompt: `Is ${a} and ${b} the ONLY way to break ${total} apart?`, hint: "Think of at least one other pair that also makes the same total.", explain: `No — ${total} can also be broken apart other ways, like ${total - 1} and 1.` },
          "No, there are other ways too",
          ["Yes, that's the only way"] // misconception: believing a number has exactly one decomposition
        ),
      ],
      wrapUp: `${total} = ${a} + ${b}.`,
    };
  }

  if (bucket === "decomposeLarge") {
    const total = randInt(8, 10);
    const a = randInt(1, total - 1);
    const b = total - a;
    let otherA = a === 1 ? 2 : a - 1;
    if (otherA <= 0 || otherA >= total) otherA = a + 1 <= total - 1 ? a + 1 : 1;
    const otherB = total - otherA;
    return {
      title: "Break it apart",
      bucket,
      story: `Break ${total} into two parts. The first part is ${a}.`,
      visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: `If the first part is ${a}, what is the second part?`, hint: "The two parts together make the whole number — count carefully, there are more pairs to keep track of with a bigger number.", explain: `${a} + ${b} = ${total}.`, answer: b },
        { kind: "number", prompt: `Here's a DIFFERENT way: if the first part is ${otherA} instead, what would the second part be?`, hint: "The two parts still need to add up to the same total.", explain: `${otherA} + ${otherB} = ${total}.`, answer: otherB },
      ],
      wrapUp: `${total} = ${a} + ${b}, and also ${total} = ${otherA} + ${otherB}.`,
    };
  }

  if (bucket === "decomposeSecondWay") {
    const total = randInt(4, 10);
    const a1 = randInt(1, total - 1);
    const b1 = total - a1;
    let a2 = a1 - 1;
    if (a2 <= 0) a2 = a1 + 1;
    if (a2 >= total) a2 = a1 - 1 > 0 ? a1 - 1 : 1;
    const b2 = total - a2;
    return {
      title: "Find a different way",
      bucket,
      story: `Here's one way to break ${total} apart: ${a1} and ${b1}.`,
      visual: () => <SplitGroup total={total} partA={a1} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: `Find a DIFFERENT way: if the first part is ${a2}, what's the second part?`, hint: "Make sure the two new parts still add up to the same total, but aren't the same pair as before.", explain: `${a2} + ${b2} = ${total}.`, answer: b2 },
        choice(
          { prompt: `Is ${a2} and ${b2} the SAME way as ${a1} and ${b1}, or a DIFFERENT way?`, hint: "Compare the two pairs of numbers.", explain: `${a2} and ${b2} is a different pair from ${a1} and ${b1}, even though both add up to ${total}.` },
          "A different way",
          ["The same way"] // misconception: not recognizing a genuinely new pair as "different"
        ),
      ],
      wrapUp: `${total} = ${a1} + ${b1}, and ${total} = ${a2} + ${b2} — two different ways.`,
    };
  }

  // decomposeEqual — the special case some students treat as impossible.
  const half = randInt(2, 5);
  const total = half * 2;
  return {
    title: "Break it into equal parts",
    bucket,
    story: `Break ${total} into two EQUAL parts.`,
    visual: () => <SplitGroup total={total} partA={half} toneA="a" toneB="b" />,
    steps: [
      { kind: "number", prompt: `If you split ${total} into two EQUAL parts, how much is in EACH part?`, hint: "Both parts need to be the exact same amount, and together they still make the whole total.", explain: `${half} + ${half} = ${total}.`, answer: half },
      choice(
        { prompt: `True or false: ${total} can be broken into two equal parts.`, hint: "You just found those equal parts in the last step.", explain: `True — ${total} = ${half} + ${half}, two equal parts.` },
        "True",
        ["False"] // misconception: thinking equal-parts decomposition is impossible or doesn't count
      ),
    ],
    wrapUp: `${total} = ${half} + ${half}.`,
  };
}

export const decomposingNumbers: Unit = {
  id: "decomposingNumbers",
  title: "Breaking Numbers Apart",
  goal: "Break any number up to 10 into two smaller parts, in more than one way.",
  standard: "K.OA.3",
  keyIdea: (
    <>
      <p>Decomposing a number means breaking it into two parts that add back up to the whole — and almost every number can be decomposed in MORE than one way, not just one.</p>
      <p>Equal parts (like 8 = 4 + 4) are still a valid decomposition, just like any other pair.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // "More than one way" is always re-derivable by reasoning/trial — nothing
  // fixed to memorize, so no reintroEverySolved here.
  problems: [{ label: "Breaking Apart", make: decomposingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: decomposingNumbersTest,
};
