import { useEffect, useState, type CSSProperties } from "react";
import { CountingTrack } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { buildSequence } from "../logic";
import type { Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { countingAndSkipCountingTest } from "./CountingAndSkipCountingTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Q1 — the core "what comes right after 299" fact, as a choice so a wrong
 *  pick (like "2,100", the comma-reset mistake) is visible as a real option
 *  rather than something the student has to invent themselves. */
function AfterBoundaryQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "300";
  const OPTIONS = ["2,100", CORRECT, "399"];
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Counting by ones: 298, 299, ___?
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
          {ok ? "Correct — 299 + 1 = 300. Crossing into a new hundred is just a smooth +1, nothing more dramatic." : "Not quite — counting by ones is always just +1, even right at a hundred boundary. 299 + 1 = ?"}
        </p>
      )}
    </div>
  );
}

/** Q2 — names the exact misconception directly, with the mistake itself
 *  shown as the wrong answer that caused it. */
function NamedMistakeQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "They treated crossing into a new hundred like starting over with a totally different kind of number, instead of just adding 1.";
  const OPTIONS = [CORRECT, "They skipped a number by accident.", "They counted backward instead of forward."];
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> A student wrote this counting sequence: 298, 299, 2,100. What mistake did they make?
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
          {ok ? "Correct — 299 + 1 is just 300, written the normal way. There's no comma, and no reset." : "Not quite — look at what actually changed between 299 and their answer. The real next number is just 300."}
        </p>
      )}
    </div>
  );
}

/** Q3 — generalization/true-false: the SAME rule applies at every hundred
 *  boundary, not something special about 299 specifically. */
function SameRuleQuestion({ onComplete }: { onComplete?: () => void }) {
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
        <b>3.</b> True or False: Counting from 399 to 400 works the exact same way as counting from 9 to 10 — no special new rule is needed just because you crossed into a new hundred.
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
          {ok ? "Correct — it's always just +1, whether you're crossing from 9 to 10, 99 to 100, or 399 to 400." : "Not quite — it's actually True. Every boundary, however big the numbers, is still just +1."}
        </p>
      )}
    </div>
  );
}

/** Q4 — the skip-by-10s bucket's own skill, fixed: 280, 290, ___, ___. */
function SkipTenFillInQuestion({ onComplete }: { onComplete?: () => void }) {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [checked, setChecked] = useState(false);
  const okFirst = first === "300";
  const okSecond = second === "310";
  const ok = okFirst && okSecond;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Skip-counting by 10s: 280, 290,{" "}
        <select className="answer" style={{ width: 70, ...fieldStyle(okFirst, checked) }} value={first} onChange={(e) => setFirst(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          {["290", "300", "2,100"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        ,{" "}
        <select className="answer" style={{ width: 70, ...fieldStyle(okSecond, checked) }} value={second} onChange={(e) => setSecond(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          {["300", "310", "320"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        .
      </p>
      <div className="control-row">
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 290 + 10 = 300, and 300 + 10 = 310. Crossing the hundred doesn't change the +10 pattern." : "Not quite — keep adding 10 each time, even across the hundred."}
        </p>
      )}
    </div>
  );
}

function CountingCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ after: false, mistake: false, sameRule: false, skipTen: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure crossing a new hundred makes sense before you try practice problems.</p>
      <AfterBoundaryQuestion onComplete={mark("after")} />
      <NamedMistakeQuestion onComplete={mark("mistake")} />
      <SameRuleQuestion onComplete={mark("sameRule")} />
      <SkipTenFillInQuestion onComplete={mark("skipTen")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

const SKIP_OPTIONS = [
  { id: "1", label: "1s" },
  { id: "2", label: "2s" },
  { id: "5", label: "5s" },
  { id: "10", label: "10s" },
  { id: "100", label: "100s" },
] as const;

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [skipId, setSkipId] = useState<"1" | "2" | "5" | "10" | "100">("1");
  const skip = Number(skipId);
  const [start, setStart] = useState(297);
  const sequence = buildSequence(start, skip, 6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented label="Count by" value={skipId} onChange={setSkipId} options={SKIP_OPTIONS} />
        <Stepper label="Start at" value={start} min={0} max={950} step={1} onChange={setStart} tone="a" />
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
      <CountingTrack sequence={sequence} knownCount={sequence.length} tone="a" markHundredChange />
      <p className="muted small">
        Counting by {skip}s starting at {start}: {sequence.join(", ")}. {start % skip !== 0 && skip !== 1 && `${start} isn't a multiple of ${skip} — the pattern still works perfectly from any starting point.`}
      </p>
      {(introActive || showCheck) && <CountingCheck onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — Counting & Skip-Counting
// ============================================================================

export const COUNT_BUCKETS = ["count1", "skip2", "skip5", "skip10", "skip100", "offsetStart"] as const;
export type CountBucket = (typeof COUNT_BUCKETS)[number];

/** Builds a {start, step} pair that's guaranteed to land in the requested
 *  bucket — see each branch's comment for exactly how. */
function pickStartStep(bucket: CountBucket): { start: number; step: number } {
  if (bucket === "count1") {
    const k = randInt(1, 9);
    const offset = randInt(1, 3);
    return { start: k * 100 - offset, step: 1 };
  }
  if (bucket === "skip2") {
    const k = randInt(1, 9);
    const m = randInt(1, 3);
    return { start: k * 100 - 2 * m, step: 2 };
  }
  if (bucket === "skip5") {
    const k = randInt(1, 9);
    const m = randInt(1, 2);
    return { start: k * 100 - 5 * m, step: 5 };
  }
  if (bucket === "skip10") {
    const k = randInt(1, 9);
    const m = randInt(1, 3);
    return { start: k * 100 - 10 * m, step: 10 };
  }
  if (bucket === "skip100") {
    // Up to start 600 so the 5th term (start + 4*100) can land exactly on
    // 1000 — the plan's own carve-out: 1000 is an in-range endpoint for
    // THIS unit only.
    return { start: randInt(0, 6) * 100, step: 100 };
  }
  // offsetStart: a "nice" skip amount, but a start that's deliberately NOT
  // one of its multiples — drawn pre-transform (reject a multiple of `step`
  // directly), not derived from some other value that happens to avoid it.
  const step = ([2, 5, 10] as const)[randInt(0, 2)];
  let start: number;
  do {
    start = randInt(1, 900);
  } while (start % step === 0);
  return { start, step };
}

export function countingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as CountBucket) ?? COUNT_BUCKETS[randInt(0, COUNT_BUCKETS.length - 1)];
  const { start, step } = pickStartStep(bucket);
  const sequence = buildSequence(start, step, 5);
  const label = step === 1 ? "by ones" : `by ${step}s`;

  return {
    title: "Counting & Skip-Counting",
    bucket,
    story: `Count ${label}, starting at ${start}: ${sequence[0]}, ${sequence[1]}, ___, ___, ___.`,
    visual: (done: number) => <CountingTrack sequence={sequence} knownCount={2 + done} tone="a" markHundredChange />,
    steps: [
      {
        kind: "number",
        prompt: `What comes right after ${sequence[1]}?`,
        hint: `Add ${step} to ${sequence[1]}.`,
        explain: `${sequence[1]} + ${step} = ${sequence[2]}.`,
        answer: sequence[2],
      },
      {
        kind: "number",
        prompt: `Then what comes next?`,
        hint: `Add ${step} to ${sequence[2]}.`,
        explain: `${sequence[2]} + ${step} = ${sequence[3]}.`,
        answer: sequence[3],
      },
      {
        kind: "number",
        prompt: `Then what comes next?`,
        hint: `Add ${step} to ${sequence[3]}.`,
        explain: `${sequence[3]} + ${step} = ${sequence[4]}.`,
        answer: sequence[4],
      },
    ],
    wrapUp: `Counting ${label} from ${start}: ${sequence.join(", ")}.`,
  };
}

export const countingAndSkipCounting: Unit = {
  id: "countingAndSkipCounting",
  title: "Counting and Skip-Counting to 1000",
  goal: "Count by ones all the way to 1000, and skip-count by 2s, 5s, 10s, and 100s — even when crossing into a new hundred.",
  standard: "2.NBT.2",
  keyIdea: (
    <>
      <p>Crossing into a new hundred (like 299 to 300) is always just +1 — never a reset to a different kind of number.</p>
      <p>Skip-counting works from ANY starting point, not just multiples of the skip amount — 47, 52, 57... skips by 5 just as well as 45, 50, 55 does.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // The skip-counting sequences themselves are meant to become automatic
  // recall, not re-derived by counting one-by-one every time — re-shows the
  // Check for Understanding every 20 solved problems (same cadence as MM1
  // Ratio Lab's Conversion unit).
  reintroEverySolved: 20,
  problems: [{ label: "Counting & Skip-Counting", make: countingProblem, buckets: [...COUNT_BUCKETS] }],
  requiredBuckets: [...COUNT_BUCKETS],
  test: countingAndSkipCountingTest,
};
