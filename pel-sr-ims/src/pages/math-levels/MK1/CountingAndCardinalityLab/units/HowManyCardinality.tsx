import { useEffect, useState } from "react";
import { CounterGroup, type Arrangement } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { howManyCardinalityTest } from "./HowManyCardinalityTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K.CC.4c ("each successive number name refers to a quantity that's one
// larger") is folded in here as question 4, rather than into Unit 1 — it's
// as much about cardinality (what the new total IS) as it is about
// sequencing, per this lab's own plan notes.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: what the LAST number counted actually tells you. */
function LastNumberVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [meaningPick, setMeaningPick] = useState("");
  const [totalPick, setTotalPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [meaningPick, totalPick].every((v) => String(v).trim() !== "");
  const meaningOk = meaningPick === "total";
  const totalOk = totalPick === "5";
  const ok = meaningOk && totalOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> You count 5 blocks out loud: "1, 2, 3, 4, 5."
      </p>
      <CounterGroup count={5} arrangement="line" tone="a" seed={5} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What does the LAST number you said ("5") tell you?{" "}
          <select className="answer" value={meaningPick} onChange={(e) => setMeaningPick(e.target.value)} style={fieldOk(meaningOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="total">It's the total — how many blocks there are in all</option>
            <option value="label">It's just the name of the last block you touched</option>
          </select>
        </label>
        <label>
          So how many blocks are there in all?{" "}
          <select className="answer" value={totalPick} onChange={(e) => setTotalPick(e.target.value)} style={fieldOk(totalOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? 'Correct — the last number you say ("5") isn\'t just a label for the last block — it tells you the TOTAL count of every block in the group.'
            : "Not quite — the last number you count isn't just about the last object you touched. It tells you how many objects there are altogether."}
        </p>
      )}
    </div>
  );
}

/** Conflation: does recounting restart the amount, or does it stay the same? */
function RecountQuestion({ onComplete }: { onComplete?: () => void }) {
  const [recountPick, setRecountPick] = useState("");
  const [everDifferentPick, setEverDifferentPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [recountPick, everDifferentPick].every((v) => String(v).trim() !== "");
  const recountOk = recountPick === "6";
  const everDifferentOk = everDifferentPick === "false";
  const ok = recountOk && everDifferentOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> You count a group of toys and get 6. Nobody added or removed any toys. You count the SAME group again, starting over from 1.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What total will you get the second time?{" "}
          <select className="answer" value={recountPick} onChange={(e) => setRecountPick(e.target.value)} style={fieldOk(recountOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
        </label>
        <label>
          True or false: recounting a group that hasn't changed can give a different total.{" "}
          <select className="answer" value={everDifferentPick} onChange={(e) => setEverDifferentPick(e.target.value)} style={fieldOk(everDifferentOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — counting again doesn't start the amount over at 0; the group still has 6 toys, so counting it correctly always gives 6 again."
            : "Not quite — the toys themselves didn't change, so counting them again (correctly) always gives the exact same total: 6."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false: does the STARTING OBJECT matter to the total? */
function StartingPointQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Counters are arranged in a circle — it's easy to lose track of which one you started with.
      </p>
      <CounterGroup count={6} arrangement="circle" tone="b" seed={6} />
      <p>True or false: no matter which counter you start counting from, you'll always get the same total — as long as you count each one exactly once.</p>
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
            ? "Correct — the total only depends on how many objects there are, never on which one you happened to start with. The tricky part in a circle is just remembering where you started, so you don't count it twice."
            : "Not quite — try it: start from a different counter in the circle and count around. As long as you count each one exactly once, the total is always the same."}
        </p>
      )}
    </div>
  );
}

/** K.CC.4c, folded into this unit's CFU: each successive number is exactly
 *  one larger — tied directly to an actual counted group, not asked in the
 *  abstract. */
function OneMoreQuestion({ onComplete }: { onComplete?: () => void }) {
  const [totalPick, setTotalPick] = useState("");
  const [oneMorePick, setOneMorePick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [totalPick, oneMorePick].every((v) => String(v).trim() !== "");
  const totalOk = totalPick === "7";
  const oneMoreOk = oneMorePick === "8";
  const ok = totalOk && oneMoreOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Count the counters.
      </p>
      <CounterGroup count={7} arrangement="array" tone="c" seed={7} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many are there?{" "}
          <select className="answer" value={totalPick} onChange={(e) => setTotalPick(e.target.value)} style={fieldOk(totalOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </label>
        <label>
          If ONE MORE counter joined the group, how many would there be now?{" "}
          <select className="answer" value={oneMorePick} onChange={(e) => setOneMorePick(e.target.value)} style={fieldOk(oneMoreOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — there are 7, and one more counter would make 8. Every time you add exactly one more object, the new total is always exactly one bigger — never two, never the same."
            : "Not quite — count the group first, then think about what number comes right after that total when you count forward just one more step."}
        </p>
      )}
    </div>
  );
}

function CardinalityCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ lastNumber: false, recount: false, startingPoint: false, oneMore: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure counting a group makes sense before you try practice problems.</p>
      <LastNumberVocabQuestion onComplete={mark("lastNumber")} />
      <RecountQuestion onComplete={mark("recount")} />
      <StartingPointQuestion onComplete={mark("startingPoint")} />
      <OneMoreQuestion onComplete={mark("oneMore")} />
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
  const [arrangement, setArrangement] = useState<Arrangement>("scatter");
  const [order, setOrder] = useState<number[]>([]);

  const newGroup = (n: number, a: Arrangement) => {
    setCount(n);
    setArrangement(a);
    setOrder([]);
  };

  const toggle = (i: number) => {
    if (order.includes(i)) return; // each object counted exactly once
    setOrder((o) => [...o, i]);
  };

  const done = order.length === count;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="How many counters" value={count} min={3} max={20} step={1} onChange={(n) => newGroup(n, arrangement)} tone="a" />
        <Segmented
          label="Arrangement"
          value={arrangement}
          onChange={(a) => newGroup(count, a)}
          options={[{ id: "line", label: "Line" }, { id: "array", label: "Grid" }, { id: "circle", label: "Circle" }, { id: "scatter", label: "Scattered" }]}
        />
        <button className="btn ghost" onClick={() => setOrder([])}>
          Start over
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
      {(introActive || showCheck) && <CardinalityCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">Click each counter once, in any order you like, to count it.</p>
      <CounterGroup count={count} arrangement={arrangement} tone="a" seed={count * 9 + 5} countedOrder={order} onToggle={toggle} />
      <p className="feedback good" style={{ minHeight: 24 }}>
        {order.length === 0 ? "" : done ? `That's ${order.length} in all — the LAST number you said!` : `Counted ${order.length} so far...`}
      </p>
      {done && count < 20 && (
        <button
          className="btn primary"
          style={{ width: "fit-content" }}
          onClick={() => {
            setCount((c) => Math.min(20, c + 1));
            setOrder([]);
          }}
        >
          Add one more counter
        </button>
      )}
      <p className="muted small">
        Try the same number of counters in a different arrangement (a circle is the trickiest — it's easy to lose track of where you started!). No
        matter the arrangement, counting correctly always gives the same total.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "lineArray" | "scattered" | "circle" | "mixed20" | "countOut";
const BUCKETS: Bucket[] = ["lineArray", "scattered", "circle", "mixed20", "countOut"];

function cardinalityProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "lineArray") {
    const n = randInt(3, 10);
    const arrangement = pick(["line", "array"] as const);
    return {
      title: "How many in all?",
      bucket,
      story: "Count the counters. The LAST number you say tells you how many there are in all.",
      visual: () => <CounterGroup count={n} arrangement={arrangement} tone="a" seed={n * 5 + 1} />,
      steps: [
        { kind: "number", prompt: "How many counters are there in all?", hint: "Count each one exactly once, in order.", explain: `There are ${n} counters — the last number you say, ${n}, is the total.`, answer: n },
        { kind: "number", prompt: "If one more counter joined the group, how many would there be?", hint: "One more than the total is the next counting number.", explain: `One more than ${n} is ${n + 1}.`, answer: n + 1 },
      ],
      wrapUp: `There are ${n} counters in all.`,
    };
  }

  if (bucket === "scattered") {
    const n = randInt(4, 10);
    return {
      title: "How many — scattered",
      bucket,
      story: "These counters are scattered, not lined up. Count carefully — it's easy to count one twice or miss one!",
      visual: () => <CounterGroup count={n} arrangement="scatter" tone="b" seed={n * 23 + 7} />,
      steps: [
        { kind: "number", prompt: "How many counters are there in all?", hint: "Point to each counter as you count it, so you don't skip or double-count.", explain: `There are ${n} counters in all.`, answer: n },
        choice(
          { prompt: "If you counted this same group again, starting over, what total would you get?", hint: "The actual amount doesn't change just because you count it again.", explain: `Recounting (correctly) always gives the same total: ${n}.` },
          String(n),
          [String(n + 1), String(Math.max(0, n - 1))]
        ),
      ],
      wrapUp: `There are ${n} counters, no matter how many times you count them.`,
    };
  }

  if (bucket === "circle") {
    const n = randInt(4, 10);
    return {
      title: "How many — in a circle",
      bucket,
      story: "These counters are arranged in a circle. It's easy to lose track of which one you started with!",
      visual: () => <CounterGroup count={n} arrangement="circle" tone="c" seed={n * 31 + 2} />,
      steps: [
        { kind: "number", prompt: "How many counters are there in all?", hint: "Pick any counter to start with, then go around once without skipping or repeating any.", explain: `There are ${n} counters in all.`, answer: n },
        choice(
          {
            prompt: "Would you get a different total if you had started counting from a different counter in the circle?",
            hint: "The total only depends on how many objects there are, not where you started.",
            explain: "No — starting from a different counter never changes the total, as long as you count each one exactly once.",
          },
          "No, the total would be the same",
          ["Yes, it depends which one you start with"]
        ),
      ],
      wrapUp: `There are ${n} counters in the circle, no matter where you start counting.`,
    };
  }

  if (bucket === "mixed20") {
    const n = randInt(11, 20);
    const arrangement = pick(["array", "scatter"] as const);
    return {
      title: "How many — a bigger group",
      bucket,
      story: "Count this bigger group carefully.",
      visual: () => <CounterGroup count={n} arrangement={arrangement} tone="a" seed={n * 41 + 3} />,
      steps: [
        { kind: "number", prompt: "How many counters are there in all?", hint: "Count slowly, one at a time.", explain: `There are ${n} counters in all.`, answer: n },
        { kind: "number", prompt: "If one more counter joined the group, how many would there be?", hint: "One more than the total.", explain: `One more than ${n} is ${n + 1}.`, answer: n + 1 },
      ],
      wrapUp: `There are ${n} counters in all.`,
    };
  }

  // countOut — the reverse-direction skill: counting a fixed amount OUT of
  // a larger pile, rather than counting a fixed group that's already there.
  const total = randInt(11, 20);
  const take = randInt(2, total - 1);
  const remaining = total - take;
  return {
    title: "Count out some, see what's left",
    bucket,
    story: `There is a pile of ${total} counters. Count out ${take} of them to give to a friend.`,
    visual: () => <CounterGroup count={total} arrangement="scatter" tone="b" seed={total * 7 + take} />,
    steps: [
      { kind: "number", prompt: "How many counters are in the pile to start?", hint: "Count the whole pile shown.", explain: `There are ${total} counters in the pile.`, answer: total },
      { kind: "number", prompt: `After counting out ${take} of them, how many are left in the pile?`, hint: "Start with the total and count backward by how many were taken.", explain: `${total} take away ${take} leaves ${remaining}.`, answer: remaining },
    ],
    wrapUp: `${take} counters were taken out of ${total}, leaving ${remaining}.`,
  };
}

export const howManyCardinality: Unit = {
  id: "howManyCardinality",
  title: "How Many? (Cardinality and Counting Objects)",
  goal: "Count a group of objects and know that the last number you say tells you how many there are in total.",
  standard: "K.CC.4a-c, K.CC.5",
  keyIdea: (
    <>
      <p>When you count a group, the LAST number you say tells you how many there are in all — not just a name for the last object you touched.</p>
      <p>The total never depends on the arrangement or which object you started with — only on actually counting each one exactly once.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoning/procedure skill, not a memorized fact — a student who
  // understands one-to-one correspondence can always re-derive it, so no
  // reintroEverySolved here (unlike Units 1 and 2).
  problems: [{ label: "How Many?", make: cardinalityProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: howManyCardinalityTest,
};
