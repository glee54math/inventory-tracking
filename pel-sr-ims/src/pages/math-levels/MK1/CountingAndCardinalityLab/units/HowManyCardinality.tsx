import { useEffect, useId, useState } from "react";
import { CounterGroup, CountOutCard, TenGroups, countAlongMs, type Arrangement } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, pointing, tapCount, type Problem, type Step, type VisualHelp } from "../../../shared/engine/types";
import { countShowMe, countUp, thereAre } from "./words";
import { getState, sayText } from "../../../shared/tts/speechEngine";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { howManyCardinalityTest } from "./HowManyCardinalityTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { TapSelect } from "../../../shared/components/TapSelect";

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
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>1.</b> You count 5 blocks out loud: "1, 2, 3, 4, 5."
      </p>
      <CounterGroup count={5} arrangement="line" tone="a" seed={5} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What does the LAST number you said ("5") tell you?{" "}
          <TapSelect value={meaningPick} onChange={(e) => setMeaningPick(e.target.value)} style={fieldOk(meaningOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="total">It's the total — how many blocks there are in all</option>
            <option value="label">It's just the name of the last block you touched</option>
          </TapSelect>
        </label>
        <label>
          So how many blocks are there in all?{" "}
          <TapSelect value={totalPick} onChange={(e) => setTotalPick(e.target.value)} style={fieldOk(totalOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </TapSelect>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? 'Correct — the last number you say ("5") isn\'t just a label for the last block — it tells you the TOTAL count of every block in the group.'
            : "Not quite — the last number you count isn't just about the last object you touched. It tells you how many objects there are altogether."}
        </ReadAloud>
      )}
    </ReadAloud>
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
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>2.</b> You count a group of toys and get 6. Nobody added or removed any toys. You count the SAME group again, starting over from 1.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What total will you get the second time?{" "}
          <TapSelect value={recountPick} onChange={(e) => setRecountPick(e.target.value)} style={fieldOk(recountOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </TapSelect>
        </label>
        <label>
          True or false: recounting a group that hasn't changed can give a different total.{" "}
          <TapSelect value={everDifferentPick} onChange={(e) => setEverDifferentPick(e.target.value)} style={fieldOk(everDifferentOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </TapSelect>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — counting again doesn't start the amount over at 0; the group still has 6 toys, so counting it correctly always gives 6 again."
            : "Not quite — the toys themselves didn't change, so counting them again (correctly) always gives the exact same total: 6."}
        </ReadAloud>
      )}
    </ReadAloud>
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
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>3.</b> Counters are arranged in a circle — it's easy to lose track of which one you started with.
      </p>
      <CounterGroup count={6} arrangement="circle" tone="b" seed={6} />
      <p>True or false: no matter which counter you start counting from, you'll always get the same total — as long as you count each one exactly once.</p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <TapSelect value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </TapSelect>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the total only depends on how many objects there are, never on which one you happened to start with. The tricky part in a circle is just remembering where you started, so you don't count it twice."
            : "Not quite — try it: start from a different counter in the circle and count around. As long as you count each one exactly once, the total is always the same."}
        </ReadAloud>
      )}
    </ReadAloud>
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
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>4.</b> Count the counters.
      </p>
      <CounterGroup count={7} arrangement="array" tone="c" seed={7} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many are there?{" "}
          <TapSelect value={totalPick} onChange={(e) => setTotalPick(e.target.value)} style={fieldOk(totalOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </TapSelect>
        </label>
        <label>
          If ONE MORE counter joined the group, how many would there be now?{" "}
          <TapSelect value={oneMorePick} onChange={(e) => setOneMorePick(e.target.value)} style={fieldOk(oneMoreOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </TapSelect>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — there are 7, and one more counter would make 8. Every time you add exactly one more object, the new total is always exactly one bigger — never two, never the same."
            : "Not quite — count the group first, then think about what number comes right after that total when you count forward just one more step."}
        </ReadAloud>
      )}
    </ReadAloud>
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
      <ReadAloud as="p" className="intro-gate-title">Check for understanding: let's make sure counting a group makes sense before you try practice problems.</ReadAloud>
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
  const voiceId = useId();

  const newGroup = (n: number, a: Arrangement) => {
    setCount(n);
    setArrangement(a);
    setOrder([]);
  };

  const toggle = (i: number) => {
    if (order.includes(i)) return; // each object counted exactly once
    setOrder((o) => [...o, i]);
    // With sound on, say each number as it's counted.
    if (getState().autoRead) sayText(voiceId, String(order.length + 1));
  };

  const done = order.length === count;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
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

      <ReadAloud as="p" className="muted small">Tap each counter once to count it. You can go in any order.</ReadAloud>
      <CounterGroup count={count} arrangement={arrangement} tone="a" seed={count * 9 + 5} countedOrder={order} onToggle={toggle} />
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        {order.length === 0 ? "" : done ? `That's ${order.length} in all — the LAST number you said!` : `Counted ${order.length} so far...`}
      </ReadAloud>
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
      <ReadAloud as="p" className="muted small">
        Try the same number of counters in a different arrangement (a circle is the trickiest — it's easy to lose track of where you started!). No
        matter the arrangement, counting correctly always gives the same total.
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <CardinalityCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "lineArray" | "scattered" | "circle" | "mixed20" | "countOut";
const BUCKETS: Bucket[] = ["lineArray", "scattered", "circle", "mixed20", "countOut"];

/** A "how many?" step with the counting walk-through. */
const countStep = (n: number, hint: string): Step => ({
  kind: "number",
  showMeHoldMs: countAlongMs(n),
  prompt: "How many counters are there in all?",
  hint,
  showMe: countShowMe(n),
  explain: `${thereAre(n)} The last number you say, ${n}, is how many in all.`,
  answer: n,
});

/** The "one more" follow-up step. */
const oneMoreStep = (n: number): Step => ({
  kind: "number",
  prompt: "If one more counter joined the group, how many would there be?",
  hint: "Say the number you counted. Then say the next number.",
  showMe: `Say ${n}. Now one more: ${n + 1}.`,
  explain: `One more than ${n} is ${n + 1}.`,
  answer: n + 1,
});

function cardinalityProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  // Every counting picture plays the count-along during step 1's "Show me".
  const group = (n: number, arrangement: Arrangement, tone: "a" | "b" | "c", seed: number) => (_done: number, help?: VisualHelp) => (
    <CounterGroup count={n} arrangement={arrangement} tone={tone} seed={seed} countAlong={!!help?.showMe && help.step === 0} />
  );

  if (bucket === "lineArray") {
    const n = randInt(3, 10);
    const arrangement = pick(["line", "array"] as const);
    return {
      title: "How many in all?",
      bucket,
      story: "Count the counters. The LAST number you say tells how many there are in all.",
      visual: group(n, arrangement, "a", n * 5 + 1),
      steps: [countStep(n, "Touch each counter as you count it. Count each one once."), oneMoreStep(n)],
      wrapUp: `${thereAre(n)}`,
    };
  }

  if (bucket === "scattered") {
    const n = randInt(4, 10);
    return {
      title: "How many? They are all mixed up.",
      bucket,
      story: "These counters are all mixed up. Count carefully, so you don't count one twice or miss one!",
      visual: group(n, "scatter", "b", n * 23 + 7),
      steps: [
        countStep(n, "Touch each counter as you count it, so you don't skip one or count one twice."),
        choice(
          { prompt: "If you count the same counters again, what number will you get?", hint: "Nobody added or took away any counters.", showMe: `Nobody added or took any away. So counting again gives ${n} again.`, explain: `Counting again gives the same number: ${n}.` },
          String(n),
          [String(n + 1), String(Math.max(0, n - 1))]
        ),
      ],
      wrapUp: `${thereAre(n)} That stays true every time you count them.`,
    };
  }

  if (bucket === "circle") {
    const n = randInt(4, 10);
    return {
      title: "How many in a circle?",
      bucket,
      story: "These counters are in a circle. It's easy to forget which one you started with!",
      visual: group(n, "circle", "c", n * 31 + 2),
      steps: [
        countStep(n, "Pick one counter to start. Go around once. Stop when you get back to it."),
        choice(
          {
            prompt: "If you started counting from a different counter, would you get a different number?",
            hint: "It's the same counters. Only the starting place changed.",
            showMe: `It's the same counters, so you still get ${n}.`,
            explain: "No. Starting from a different counter never changes how many there are, if you count each one once.",
          },
          "No, the number would be the same",
          ["Yes, it depends which one you start with"]
        ),
      ],
      wrapUp: `${thereAre(n)} It doesn't matter where you start counting.`,
    };
  }

  if (bucket === "mixed20") {
    const n = randInt(11, 20);
    // Lined up in rows, not scattered: K.CC.5 asks for scattered groups only up to 10.
    const arrangement = pick(["line", "array"] as const);
    return {
      title: "How many in a bigger group?",
      bucket,
      story: "Count this bigger group carefully.",
      visual: group(n, arrangement, "a", n * 41 + 3),
      steps: [countStep(n, "Count slowly, one at a time. Count the top row first."), oneMoreStep(n)],
      wrapUp: `${thereAre(n)}`,
    };
  }

  // countOut (K.CC.5: "given a number from 1-20, count out that many
  // objects"): tap that many counters out of a bigger pile, and stop.
  const take = randInt(3, 15);
  const total = Math.min(20, take + randInt(3, 8));
  return {
    title: "Count some out",
    bucket,
    story: "Your friend needs some counters.",
    // Stuck: show that many dots in a ten-frame, so the student can see how many to stop at.
    // "Show me" stays on its own step: step 1 shows the counters counted out
    // (no "?" yet; that belongs to step 2), step 2 counts on to the new one.
    visual: (done, help) => {
      if (help?.showMe && help.step === 0) return <TenGroups value={take} tone="b" labels />;
      if (help?.showMe && help.step === 1) return <TenGroups value={take + 1} tone="b" labels countAlong={[take, take + 1]} targetTone="a" />;
      if (done === 0) return pointing(help, 0) ? <TenGroups value={take} tone="b" labels /> : <CountOutCard n={take} />;
      return <TenGroups value={take} tone="b" labels target={done < 2 ? take + 1 : undefined} targetTone="a" />;
    },
    steps: [
      tapCount(
        {
          prompt: `Tap ${take} counters to give to your friend.`,
          hint: `Say a number each time you tap. Stop when you say ${take}.`,
          showMe: `Tap one counter and say 1. Keep going: ${countUp(1, take)}. Stop at ${take}.`,
          explain: `You counted out ${take}.`,
        },
        total,
        take
      ),
      {
        kind: "number",
        tone: "a",
        showMeHoldMs: 2000,
        prompt: "Now your friend gets one more counter. How many does your friend have now?",
        hint: "Look at the box with the question mark. That is one more.",
        showMe: `Say ${take}. Now one more: ${take + 1}.`,
        explain: `One more than ${take} is ${take + 1}.`,
        answer: take + 1,
      },
    ],
    wrapUp: `You counted out ${take}. One more makes ${take + 1}.`,
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
