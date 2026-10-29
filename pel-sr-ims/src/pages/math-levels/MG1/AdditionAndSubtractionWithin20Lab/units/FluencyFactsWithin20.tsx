import { useEffect, useState } from "react";
import { TenFrameGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { fluencyFactsWithin20Test } from "./FluencyFactsWithin20Test";

// ============================================================================
// SHARED LOGIC — same function backs both the Explore grouping hint and the
// Practice/Test step-checking for three-addend sums, so they can't drift.
// ============================================================================

/** Which two of three addends to group first: prefer a pair that makes
 *  exactly ten (the easiest next step), falling back to whichever pair has
 *  the largest sum. Returns 0-based indices into `nums`. */
export function bestPairToGroup(nums: [number, number, number]): [number, number] {
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      if (nums[i] + nums[j] === 10) return [i, j];
    }
  }
  let best: [number, number] = [0, 1];
  let bestSum = nums[0] + nums[1];
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      if (nums[i] + nums[j] > bestSum) {
        bestSum = nums[i] + nums[j];
        best = [i, j];
      }
    }
  }
  return best;
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions. Targets: the three-addend regrouping
// strategy (order doesn't matter — 1.OA.2), confusing which facts are
// "within 10" vs "within 20," and applying the make-ten idea to an
// UNFAMILIAR fact for speed instead of one-by-one counting.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function GroupingChoiceQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "8+2";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> 4 + 8 + 2 — which two numbers should you add FIRST, to make the next step easiest?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="4+8">4 + 8</option>
          <option value="8+2">8 + 2</option>
          <option value="4+2">4 + 2</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 8 + 2 = 10 first, then 10 + 4 = 14. Grouping the pair that makes a ten is usually the easiest path."
            : "Not quite — look for a pair that makes exactly 10. Here, 8 + 2 = 10, then 10 + 4 = 14 is the easiest path."}
        </p>
      )}
    </div>
  );
}

function OrderDoesntMatterQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> True or false: when adding three numbers, you can add them in ANY order (any two first) and still get the same total.
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
            ? "Correct — the total never changes no matter which pair you add first. That's exactly why it's smart to pick the EASIEST pair, like one that makes ten."
            : "Not quite — it's always true: the total is the same no matter which two you add first. That's what makes picking an easy pair (like one that makes ten) a safe shortcut, not a risk."}
        </p>
      )}
    </div>
  );
}

function WithinTenOrTwentyQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "4+3";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> 4 + 3 = 7, and 8 + 7 = 15. Which fact stays "within 10" (the total doesn't cross into the teens)?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="4+3">4 + 3</option>
          <option value="8+7">8 + 7</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 4 + 3 = 7 stays within 10. 8 + 7 = 15 crosses past 10 into the teens, so it's a \"within 20\" fact instead."
            : "Not quite — 4 + 3 = 7 stays within 10. 8 + 7 = 15 is already past 10, so that one is a \"within 20\" fact."}
        </p>
      )}
    </div>
  );
}

function UnfamiliarSpeedQuestion({ onComplete }: { onComplete?: () => void }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = answer === "16";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Without counting one-by-one, use what you know about making ten to quickly find 9 + 7.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 9 + 1 = 10, then 10 + 6 = 16. The SAME make-ten strategy you already know makes facts like this fast, not just the ones you first practiced it on."
            : "Not quite — 9 needs just 1 more to make 10. Split 7 into 1 + 6: 9 + 1 = 10, then 10 + 6 = 16."}
        </p>
      )}
    </div>
  );
}

function FluencyCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ grouping: false, order: false, withinRange: false, speed: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure these ideas are clear before you try practice problems.</p>
      <GroupingChoiceQuestion onComplete={mark("grouping")} />
      <OrderDoesntMatterQuestion onComplete={mark("order")} />
      <WithinTenOrTwentyQuestion onComplete={mark("withinRange")} />
      <UnfamiliarSpeedQuestion onComplete={mark("speed")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"within10" | "within20" | "three">("within10");
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const [c, setC] = useState(2);

  const nums: [number, number, number] = [a, b, c];
  const [i, j] = bestPairToGroup(nums);
  const kIdx = [0, 1, 2].find((x) => x !== i && x !== j)!;
  const pairSum = nums[i] + nums[j];
  const total = a + b + c;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="Fact type"
          value={mode}
          onChange={setMode}
          options={[{ id: "within10", label: "Within 10" }, { id: "within20", label: "Within 20" }, { id: "three", label: "Three addends" }]}
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
      {(introActive || showCheck) && <FluencyCheckForUnderstanding onComplete={onIntroDone} />}

      {mode !== "three" ? (
        <>
          <div className="control-row">
            <label>
              First number: <input type="range" min={1} max={9} value={a} onChange={(e) => setA(Number(e.target.value))} /> {a}
            </label>
            <label>
              Second number: <input type="range" min={1} max={9} value={b} onChange={(e) => setB(Number(e.target.value))} /> {b}
            </label>
          </div>
          <TenFrameGroup value={Math.min(20, a + b)} tone="a" splitAt={Math.min(a, 20)} tone2="b" />
          <p className="muted small">
            {a} + {b} = {a + b}. {a + b <= 10 ? "This stays within 10." : "This crosses past 10 — a within-20 fact."} The goal is to recall facts
            like this quickly, not count one-by-one every time.
          </p>
        </>
      ) : (
        <>
          <div className="control-row">
            <label>
              a: <input type="range" min={1} max={9} value={a} onChange={(e) => setA(Number(e.target.value))} /> {a}
            </label>
            <label>
              b: <input type="range" min={1} max={9} value={b} onChange={(e) => setB(Number(e.target.value))} /> {b}
            </label>
            <label>
              c: <input type="range" min={1} max={9} value={c} onChange={(e) => setC(Number(e.target.value))} /> {c}
            </label>
          </div>
          <TenFrameGroup value={Math.min(20, total)} tone="a" />
          <p className="muted small">
            {nums[i]} + {nums[j]} = {pairSum} is the easiest pair to group first, then {pairSum} + {nums[kIdx]} = {total}. Try sliding the numbers
            around — the total ({total}) never changes no matter which pair you group first.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "factsWithin10" | "factsWithin20" | "threeAddendSum";
const BUCKETS: Bucket[] = ["factsWithin10", "factsWithin20", "threeAddendSum"];

function factsWithin10Problem(): Problem {
  const isAdd = Math.random() < 0.6;
  if (isAdd) {
    let a = 0;
    let b = 0;
    do {
      a = randInt(1, 9);
      b = randInt(1, 9);
    } while (a + b > 10);
    const sum = a + b;
    return {
      title: "Fact fluency — within 10",
      bucket: "factsWithin10",
      story: `What is ${a} + ${b}?`,
      visual: () => <TenFrameGroup value={sum} tone="a" splitAt={a} tone2="b" />,
      steps: [
        { kind: "number", prompt: `${a} + ${b} = ?`, hint: "Try to recall it quickly, without counting one-by-one.", explain: `${a} + ${b} = ${sum}.`, answer: sum },
        { kind: "number", prompt: `Related fact: ${sum} − ${a} = ?`, hint: "Addition and subtraction facts are connected.", explain: `${sum} − ${a} = ${b}.`, answer: b },
      ],
      wrapUp: `${a} + ${b} = ${sum}.`,
    };
  }
  const total = randInt(2, 10);
  const sub = randInt(0, total);
  const result = total - sub;
  return {
    title: "Fact fluency — within 10",
    bucket: "factsWithin10",
    story: `What is ${total} − ${sub}?`,
    visual: () => <TenFrameGroup value={total} tone="c" splitAt={result} tone2="b" />,
    steps: [
      { kind: "number", prompt: `${total} − ${sub} = ?`, hint: "Try to recall it quickly, without counting one-by-one.", explain: `${total} − ${sub} = ${result}.`, answer: result },
      { kind: "number", prompt: `Related fact: ${result} + ${sub} = ?`, hint: "Addition and subtraction facts are connected.", explain: `${result} + ${sub} = ${total}.`, answer: total },
    ],
    wrapUp: `${total} − ${sub} = ${result}.`,
  };
}

function factsWithin20Problem(): Problem {
  const isAdd = Math.random() < 0.6;
  if (isAdd) {
    let a = 0;
    let b = 0;
    do {
      a = randInt(2, 9);
      b = randInt(2, 9);
    } while (a + b <= 10 || a + b > 20);
    const sum = a + b;
    return {
      title: "Fact fluency — within 20",
      bucket: "factsWithin20",
      story: `What is ${a} + ${b}?`,
      visual: () => <TenFrameGroup value={sum} tone="a" splitAt={a} tone2="b" />,
      steps: [
        { kind: "number", prompt: `${a} + ${b} = ?`, hint: "Can you use a make-ten shortcut?", explain: `${a} + ${b} = ${sum}.`, answer: sum },
        { kind: "number", prompt: `Related fact: ${sum} − ${a} = ?`, hint: "Addition and subtraction facts are connected.", explain: `${sum} − ${a} = ${b}.`, answer: b },
      ],
      wrapUp: `${a} + ${b} = ${sum}.`,
    };
  }
  const start = randInt(11, 19);
  const sub = randInt(2, 9);
  const result = Math.max(0, start - sub);
  return {
    title: "Fact fluency — within 20",
    bucket: "factsWithin20",
    story: `What is ${start} − ${sub}?`,
    visual: () => <TenFrameGroup value={start} tone="c" />,
    steps: [
      { kind: "number", prompt: `${start} − ${sub} = ?`, hint: "Can you bridge through ten?", explain: `${start} − ${sub} = ${result}.`, answer: result },
      { kind: "number", prompt: `Related fact: ${result} + ${sub} = ?`, hint: "Addition and subtraction facts are connected.", explain: `${result} + ${sub} = ${start}.`, answer: start },
    ],
    wrapUp: `${start} − ${sub} = ${result}.`,
  };
}

function threeAddendProblem(): Problem {
  let a = 0;
  let b = 0;
  let c = 0;
  do {
    a = randInt(1, 9);
    b = randInt(1, 9);
    c = randInt(1, 9);
  } while (a + b + c > 20);
  const nums: [number, number, number] = [a, b, c];
  const [i, j] = bestPairToGroup(nums);
  const kIdx = [0, 1, 2].find((x) => x !== i && x !== j)!;
  const pairSum = nums[i] + nums[j];
  const total = a + b + c;
  const pairLabel = `${nums[i]} + ${nums[j]}`;
  const otherPairs = [0, 1, 2]
    .flatMap((x) => [0, 1, 2].filter((y) => y > x).map((y) => [x, y]))
    .filter(([x, y]) => !(x === i && y === j))
    .map(([x, y]) => `${nums[x]} + ${nums[y]}`);
  return {
    title: "Three addends",
    bucket: "threeAddendSum",
    story: `Find ${a} + ${b} + ${c} by grouping the easiest pair first.`,
    visual: () => <TenFrameGroup value={Math.min(20, total)} tone="a" />,
    steps: [
      choice(
        { prompt: `${a} + ${b} + ${c} — which pair should you add FIRST?`, hint: "Look for a pair that makes exactly ten, or at least the biggest/easiest step.", explain: `${pairLabel} = ${pairSum} is the easiest pair to start with.` },
        pairLabel,
        otherPairs
      ),
      { kind: "number", prompt: `${pairLabel} = ${pairSum}. Now ${pairSum} + ${nums[kIdx]} = ?`, hint: "Add the remaining number onto that pair's sum.", explain: `${pairSum} + ${nums[kIdx]} = ${total}.`, answer: total },
    ],
    wrapUp: `${a} + ${b} + ${c} = ${total}, by grouping ${pairLabel} first.`,
  };
}

function fluencyProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "factsWithin10") return factsWithin10Problem();
  if (bucket === "factsWithin20") return factsWithin20Problem();
  return threeAddendProblem();
}

export const fluencyFactsWithin20: Unit = {
  id: "fluencyFactsWithin20",
  title: "Fluency Facts Within 20",
  goal: "Know addition and subtraction facts within 20 quickly — especially within 10 — and add three numbers by grouping an easy pair first.",
  standard: "1.OA.3, 1.OA.6",
  keyIdea: (
    <>
      <p>These facts are meant to become AUTOMATIC — try to recall them quickly rather than counting one-by-one every time.</p>
      <p>When adding three numbers, you can group any two first (the total never changes) — picking a pair that makes ten is usually the easiest.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // 1.OA.6 names fluency as a long-term target — periodically re-check it
  // instead of trusting one early pass forever (unlike Unit 6's reasoning-
  // based buckets, which stay one-time-only).
  reintroEverySolved: 20,
  problems: [{ label: "Fluency Facts", make: fluencyProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: fluencyFactsWithin20Test,
};
