import { useEffect, useState } from "react";
import { TenFrameGroup } from "../diagrams";
import { makeTenBreakdown, subtractThroughTenBreakdown } from "../logic";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { makingTenAndDecomposingTest } from "./MakingTenAndDecomposingTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions. Targets the plan's named misconceptions:
// (1) decomposing the WRONG addend (always breaking apart the second number
// regardless of which is closer to ten), and (2) treating "making ten" as
// one memorized answer rather than a repeatable strategy — tested on an
// UNFAMILIAR fact to confirm it actually generalizes.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** The core trap: the near-ten number is written SECOND, so "always break
 *  apart the second number" gives the wrong answer here. */
function WhichAddendQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "6";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> For 6 + 9, which number should you break apart to make a ten?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="6">6 (the first number)</option>
          <option value="9">9 (the second number)</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — break apart 6 (into 1 + 5), since 9 is already close to ten. Keep the number closest to ten whole; break apart the OTHER one, no matter which order they're written in."
            : "Not quite — it doesn't matter that 9 is written second. 9 is already close to ten, so keep it whole and break apart 6 instead: 6 = 1 + 5, so 6 + 9 = (1 + 9) + 5 = 10 + 5 = 15."}
        </p>
      )}
    </div>
  );
}

/** Applying the strategy to an UNFAMILIAR fact — confirms it's a repeatable
 *  method, not a single memorized answer. */
function UnfamiliarFactQuestion({ onComplete }: { onComplete?: () => void }) {
  const [addToA, setAddToA] = useState("");
  const [remainder, setRemainder] = useState("");
  const [checked, setChecked] = useState(false);
  const addToAOk = addToA === "3";
  const remainderOk = remainder === "3";
  const ok = addToAOk && remainderOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Use make-ten to solve 7 + 6. Break apart 6: how much goes with the 7 to make a ten, and how much is left over?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Goes to make ten:{" "}
          <select className="answer" value={addToA} onChange={(e) => setAddToA(e.target.value)} style={fieldOk(addToAOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="6">6</option>
          </select>
        </label>
        <label>
          Left over:{" "}
          <select className="answer" value={remainder} onChange={(e) => setRemainder(e.target.value)} style={fieldOk(remainderOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="0">0</option>
            <option value="3">3</option>
            <option value="6">6</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 7 needs 3 more to make 10, so 6 splits into 3 + 3: 7 + 3 = 10, then 10 + 3 = 13."
            : "Not quite — 7 is 3 away from 10, so split 6 into 3 (to complete the ten) and 3 (left over): 7 + 3 = 10, then 10 + 3 = 13."}
        </p>
      )}
    </div>
  );
}

/** Conflation trap: is make-ten a repeatable strategy, or one memorized fact? */
function StrategyVsFactQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: make-ten is a strategy that works for ANY addition fact with a number close to ten — it's not just one answer
        to remember.
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
            ? "Correct — it's a repeatable METHOD: find the gap to ten, split the other addend, add the two tens-friendly pieces. Works on any fact like this, not just the one you first learned it with."
            : "Not quite — make-ten is a repeatable strategy, not a single memorized fact. The same three steps (find the gap, split the other addend, add) work on every fact with a number close to ten."}
        </p>
      )}
    </div>
  );
}

/** Applying the SAME bridge-through-ten idea to subtraction. */
function SubtractionBridgeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [toTen, setToTen] = useState("");
  const [remainder, setRemainder] = useState("");
  const [checked, setChecked] = useState(false);
  const toTenOk = toTen === "3";
  const remainderOk = remainder === "2";
  const ok = toTenOk && remainderOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> For 13 − 5, first subtract just enough to land exactly on a ten. How much is that, and how much is left to subtract after?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Subtract to reach ten:{" "}
          <select className="answer" value={toTen} onChange={(e) => setToTen(e.target.value)} style={fieldOk(toTenOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
          </select>
        </label>
        <label>
          Left to subtract:{" "}
          <select className="answer" value={remainder} onChange={(e) => setRemainder(e.target.value)} style={fieldOk(remainderOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="0">0</option>
            <option value="2">2</option>
            <option value="5">5</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 13 is 3 away from 10, so subtract 3 first (13 − 3 = 10), then subtract the remaining 2 (10 − 2 = 8)."
            : "Not quite — 13 is 3 away from the ten below it (10). Subtract that 3 first to land on 10, then subtract whatever's left of the 5 (which is 2)."}
        </p>
      )}
    </div>
  );
}

function MakeTenCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ whichAddend: false, unfamiliar: false, strategy: false, subtraction: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure making ten makes sense before you try practice problems.</p>
      <WhichAddendQuestion onComplete={mark("whichAddend")} />
      <UnfamiliarFactQuestion onComplete={mark("unfamiliar")} />
      <StrategyVsFactQuestion onComplete={mark("strategy")} />
      <SubtractionBridgeQuestion onComplete={mark("subtraction")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"add" | "subtract">("add");
  const [a, setA] = useState(9);
  const [b, setB] = useState(4);
  const [start, setStart] = useState(13);
  const [sub, setSub] = useState(5);

  const addBreak = makeTenBreakdown(a, b);
  const subBreak = subtractThroughTenBreakdown(start, sub);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented label="Operation" value={mode} onChange={setMode} options={[{ id: "add", label: "Making ten" }, { id: "subtract", label: "Bridging through ten" }]} />
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
      {(introActive || showCheck) && <MakeTenCheckForUnderstanding onComplete={onIntroDone} />}

      {mode === "add" ? (
        <>
          <div className="control-row">
            <Stepper label="Near-ten number" value={a} min={6} max={9} step={1} onChange={setA} tone="a" />
            <Stepper label="Other addend" value={b} min={2} max={9} step={1} onChange={setB} tone="b" />
          </div>
          <div className="control-row" style={{ gap: 24, alignItems: "flex-start" }}>
            <div>
              <TenFrameGroup value={a} tone="a" />
              <p className="muted small" style={{ textAlign: "center" }}>
                {a} (already have this many)
              </p>
            </div>
            <div>
              <TenFrameGroup value={b} tone="b" splitAt={Math.min(addBreak.addToA, b)} tone2="c" />
              <p className="muted small" style={{ textAlign: "center" }}>
                {b} = {addBreak.addToA} (to make ten) + {addBreak.remainder} (left over)
              </p>
            </div>
          </div>
          <p className="muted small">
            {a} + {addBreak.addToA} = 10, then 10 + {addBreak.remainder} = {addBreak.total}. So {a} + {b} = {addBreak.total}.
          </p>
        </>
      ) : (
        <>
          <div className="control-row">
            <Stepper label="Starting number" value={start} min={11} max={19} step={1} onChange={setStart} tone="c" />
            <Stepper label="Subtract" value={sub} min={2} max={9} step={1} onChange={setSub} tone="b" />
          </div>
          <TenFrameGroup value={start} tone="c" splitAt={subBreak.ten} tone2="b" />
          <p className="muted small">
            First subtract {subBreak.toTen} to land exactly on {subBreak.ten}, then subtract the remaining {subBreak.remainder}: {subBreak.ten} −{" "}
            {subBreak.remainder} = {subBreak.total}. So {start} − {sub} = {subBreak.total}.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "makeTenNearTen" | "makeTenLargerGap" | "subtractBridge" | "equivalentSum";
const BUCKETS: Bucket[] = ["makeTenNearTen", "makeTenLargerGap", "subtractBridge", "equivalentSum"];

function makeTenAdditionProblem(a: number, b: number, bucket: Bucket): Problem {
  const { gap, addToA, remainder, ten, total } = makeTenBreakdown(a, b);
  return {
    title: "Making ten",
    bucket,
    story: `Find ${a} + ${b} using make-ten.`,
    visual: (done: number) => (
      <div className="control-row" style={{ gap: 24, alignItems: "flex-start" }}>
        <div>
          <TenFrameGroup value={a} tone="a" />
        </div>
        <div>
          <TenFrameGroup value={b} tone="b" splitAt={done >= 1 ? addToA : undefined} tone2="c" />
        </div>
      </div>
    ),
    steps: [
      { kind: "number", prompt: `How many more do you need to add to ${a} to make 10?`, hint: "What's the gap between this number and 10?", explain: `${a} + ${gap} = 10.`, answer: gap },
      { kind: "number", prompt: `If you take ${gap} from ${b} to help make ten, how many are left over?`, hint: `${b} − ${gap} = ?`, explain: `${b} − ${addToA} = ${remainder} left over.`, answer: remainder },
      { kind: "number", prompt: `So 10 + ${remainder} = ?`, hint: "Add the leftover onto the ten you just made.", explain: `10 + ${remainder} = ${total}, so ${a} + ${b} = ${total}.`, answer: total },
    ],
    wrapUp: `${a} + ${b} = ${total}, by making a ten first: ${a} + ${addToA} = ${ten}, then ${ten} + ${remainder} = ${total}.`,
  };
}

function subtractBridgeProblem(): Problem {
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 18);
    sub = randInt(2, 9);
  } while (start % 10 >= sub || start - sub < 0);
  const { toTen, remainder, ten, total } = subtractThroughTenBreakdown(start, sub);
  return {
    title: "Bridging through ten",
    bucket: "subtractBridge",
    story: `Find ${start} − ${sub} by bridging through ten.`,
    visual: (done: number) => <TenFrameGroup value={start} tone="c" splitAt={done >= 1 ? ten : undefined} tone2="b" />,
    steps: [
      { kind: "number", prompt: `Subtract just enough from ${start} to land exactly on a ten. How much is that?`, hint: `What's left of ${start} after you drop the ones digit?`, explain: `${start} − ${toTen} = ${ten}.`, answer: toTen },
      { kind: "number", prompt: `Now how much more do you still need to subtract (from ${sub} total)?`, hint: `${sub} − ${toTen} = ?`, explain: `${sub} − ${toTen} = ${remainder} left to subtract.`, answer: remainder },
      { kind: "number", prompt: `${ten} − ${remainder} = ?`, hint: "Finish subtracting the leftover from the ten.", explain: `${ten} − ${remainder} = ${total}, so ${start} − ${sub} = ${total}.`, answer: total },
    ],
    wrapUp: `${start} − ${sub} = ${total}, by bridging through ${ten}.`,
  };
}

function equivalentSumProblem(): Problem {
  let a1 = 0;
  let b1 = 0;
  let k = 0;
  let a2 = 0;
  let b2 = 0;
  do {
    a1 = randInt(2, 8);
    b1 = randInt(2, 9);
    k = [-3, -2, -1, 1, 2, 3][randInt(0, 5)];
    a2 = a1 + k;
    b2 = a1 + b1 - a2;
  } while (a2 < 1 || a2 > 9 || b2 < 1 || b2 > 9 || a1 + b1 > 18);
  const total = a1 + b1;
  const direction = k > 0 ? "more" : "less";
  const absK = Math.abs(k);
  return {
    title: "Same total, different split",
    bucket: "equivalentSum",
    story: `${a1} + ${b1} = ${a2} + ? — figure out the missing addend WITHOUT adding everything from scratch.`,
    visual: () => (
      <div className="control-row" style={{ gap: 24, alignItems: "flex-start" }}>
        <TenFrameGroup value={total} tone="a" splitAt={a1} tone2="b" />
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `${a2} is ${absK} ${direction} than ${a1}. For the sum to stay the same, what must happen to the OTHER addend?`,
          hint: "If one addend grows, the other has to shrink by the same amount to keep the total the same — and the other way around.",
          explain: `${a2} is ${absK} ${direction} than ${a1}, so the other addend must be ${absK} ${direction === "more" ? "less" : "more"} than ${b1}.`,
        },
        direction === "more" ? "It must decrease by the same amount" : "It must increase by the same amount",
        [direction === "more" ? "It must increase by the same amount" : "It must decrease by the same amount", "It stays exactly the same"]
      ),
      { kind: "number", prompt: `So what is the missing addend — ${a2} + ? = ${total}?`, hint: `${total} − ${a2} = ?`, explain: `${total} − ${a2} = ${b2}.`, answer: b2 },
      { kind: "number", prompt: `Check it: what is ${a2} + ${b2}?`, hint: "Add them up to confirm it matches the original total.", explain: `${a2} + ${b2} = ${total}, the same total as ${a1} + ${b1}.`, answer: total },
    ],
    wrapUp: `${a1} + ${b1} = ${a2} + ${b2} = ${total} — shifting ${absK} from one addend to the other never changes the total.`,
  };
}

function makeTenProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "makeTenNearTen") {
    const a = randInt(8, 9);
    const gap = 10 - a;
    const b = randInt(gap + 1, 9); // guarantees a genuine (nonzero-remainder) decomposition
    return makeTenAdditionProblem(a, b, bucket);
  }

  if (bucket === "makeTenLargerGap") {
    const a = randInt(6, 7);
    const gap = 10 - a;
    const b = randInt(gap + 1, 9);
    return makeTenAdditionProblem(a, b, bucket);
  }

  if (bucket === "subtractBridge") return subtractBridgeProblem();

  return equivalentSumProblem();
}

export const makingTenAndDecomposing: Unit = {
  id: "makingTenAndDecomposing",
  title: "Making Ten and Decomposing Numbers",
  goal: "Break numbers apart to make a ten first, then add on (or subtract) what's left.",
  standard: "1.OA.6",
  keyIdea: (
    <>
      <p>Keep the number closest to ten whole, and break apart the OTHER number — no matter which order the numbers are written in.</p>
      <p>Make-ten is a repeatable strategy (find the gap to ten, split the other number, add the pieces), not one fact to memorize — and the same bridge-through-ten idea works for subtraction too.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // A reasoning strategy to be re-derived each time, not a fact to memorize.
  problems: [{ label: "Making Ten", make: makeTenProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: makingTenAndDecomposingTest,
};
