import { useEffect, useState } from "react";
import { HundredChart } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { countingTo120Test } from "./CountingTo120Test";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions (never randomized), same convention as every
// other gated unit (MK1_CountingAndCardinalityLab, RealWorldNegatives.tsx).

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: the 99 -> 100 transition itself, explicitly required by the plan. */
function NinetyNineVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [word, setWord] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = word === "100";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> You count: 97, 98, 99... What number comes right after 99?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={word} onChange={(e) => setWord(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="100">one hundred (100)</option>
          <option value="ninety-ten">ninety-ten</option>
          <option value="ninety-eleven">ninety-eleven</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? 'Correct — after 99 comes 100, one hundred. There is no "ninety-ten" or "ninety-eleven" — once you run out of 2-digit numbers, a brand new digit appears.'
            : 'Not quite — "ninety-ten" and "ninety-eleven" are not real numbers. After 99 (the last 2-digit number), the very next number needs a THIRD digit: 100.'}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated: crossing into a new TEN vs. crossing into a new HUNDRED
 *  — both terms appear in one question, so a student can't answer from just
 *  one memorized rule. */
function TenVsHundredQuestion({ onComplete }: { onComplete?: () => void }) {
  const [nextNum, setNextNum] = useState("");
  const [which, setWhich] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [nextNum, which].every((v) => String(v).trim() !== "");
  const nextOk = nextNum === "110";
  const whichOk = which === "ten";
  const ok = nextOk && whichOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> You count: 107, 108, 109...
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What comes next?{" "}
          <select className="answer" value={nextNum} onChange={(e) => setNextNum(e.target.value)} style={fieldOk(nextOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="110">110</option>
            <option value="200">200</option>
            <option value="100">100</option>
          </select>
        </label>
        <label>
          Is that a new TEN, or a new HUNDRED?{" "}
          <select className="answer" value={which} onChange={(e) => setWhich(e.target.value)} style={fieldOk(whichOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="ten">A new ten (the 110s) — still in the 100s hundred</option>
            <option value="hundred">A new hundred</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 110 starts a new ten (the 110s), but you're still inside the SAME hundred (the 100s). A new hundred only starts at 200."
            : "Not quite — 109 to 110 only crosses into a new TEN (the 110s). You stay in the 100s hundred the whole way from 100 to 199; a new hundred doesn't start until 200."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: does the "count 1-9, then the word
 *  changes" pattern really repeat identically every decade, including past 100? */
function PatternRepeatsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: the pattern "count up through the ones, then start a new ten" repeats exactly the same way every single time — all the way
        from the 20s up through the 110s.
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
            ? "Correct — it never breaks, not even at 100. 29→30, 59→60, 99→100, 109→110: every single one is the exact same pattern happening again."
            : "Not quite — check 99→100 and 109→110 against 29→30. It's the exact same pattern every time, it just keeps happening past 100 too."}
        </p>
      )}
    </div>
  );
}

/** Multi-part production, crossing the hardest boundary in this unit. */
function CrossOneHundredQuestion({ onComplete }: { onComplete?: () => void }) {
  const OPTIONS = ["96", "97", "98", "99", "100", "101", "110"];
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [checked, setChecked] = useState(false);
  const aOk = a === "98";
  const bOk = b === "99";
  const cOk = c === "100";
  const ok = aOk && bOk && cOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  const selectRow = (label: string, value: string, setValue: (v: string) => void, isOk: boolean) => (
    <label>
      {label}:{" "}
      <select className="answer" value={value} onChange={(e) => setValue(e.target.value)} style={fieldOk(isOk, checked)}>
        <option value="" disabled>
          choose
        </option>
        {OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Start at 97. Count forward three numbers, in order.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        {selectRow("1st", a, setA, aOk)}
        {selectRow("2nd", b, setB, bOk)}
        {selectRow("3rd", c, setC, cOk)}
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 97, 98, 99, 100. Right at the end you crossed from the last 2-digit number into the first 3-digit number."
            : "Not quite — count one at a time: 98, then 99, then one more than 99 is 100 (not \"ninety-ten\")."}
        </p>
      )}
    </div>
  );
}

function CountingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, tenVsHundred: false, pattern: false, crossHundred: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure counting all the way to 120 makes sense before you try practice problems.</p>
      <NinetyNineVocabQuestion onComplete={mark("vocab")} />
      <TenVsHundredQuestion onComplete={mark("tenVsHundred")} />
      <PatternRepeatsQuestion onComplete={mark("pattern")} />
      <CrossOneHundredQuestion onComplete={mark("crossHundred")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [start, setStart] = useState(1);
  const [current, setCurrent] = useState(1);

  const resetTo = (n: number) => {
    setStart(n);
    setCurrent(n);
  };
  const sayNext = () => setCurrent((c) => Math.min(120, c + 1));
  const crossedDecade = current > start && Math.floor(current / 10) !== Math.floor((current - 1) / 10);
  const crossedHundred = current >= 100 && current - 1 < 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Start at" value={start} min={1} max={119} step={1} onChange={resetTo} tone="a" />
        <button className="btn primary" onClick={sayNext} disabled={current >= 120}>
          Say the next number
        </button>
        <button className="btn ghost" onClick={() => resetTo(99)}>
          Jump to 99
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
      {(introActive || showCheck) && <CountingCheckForUnderstanding onComplete={onIntroDone} />}

      <div style={{ fontWeight: 800, fontSize: 28 }}>{current}</div>
      {crossedHundred && <p className="feedback good">You just crossed into the hundreds — a brand new digit appeared!</p>}
      {!crossedHundred && crossedDecade && <p className="feedback good">You just started a brand new ten!</p>}

      <HundredChart marks={[{ n: start, tone: "a" }, { n: current, tone: current === start ? "a" : "b" }]} upTo={current} />
      <p className="muted small">
        Every row of this chart is one ten, and every column keeps the same last digit all the way down. Counting forward by ones moves you one cell to the
        right — and when you run off the end of a row, you wrap to the start of the next one. That's exactly what happens at 99 → 100, too — it's just the
        same wrap, one more time.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "startFrom1" | "startMid" | "crossDecade" | "cross100" | "range100to120";
const BUCKETS: Bucket[] = ["startFrom1", "startMid", "crossDecade", "cross100", "range100to120"];

function countingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "startFrom1") {
    const n = randInt(1, 6);
    const after = n + 1;
    const after2 = n + 2;
    return {
      title: "Counting from the very start",
      bucket,
      story: `Start counting at 1. If you've just counted up to ${n}, what comes next?`,
      visual: () => <HundredChart marks={[{ n, tone: "a" }]} upTo={n} />,
      steps: [
        { kind: "number", prompt: `What number comes right after ${n}?`, hint: "Count one more.", explain: `${n} + 1 = ${after}.`, answer: after },
        { kind: "number", prompt: `What number comes right after ${after}?`, hint: "Keep going — one more than that.", explain: `${after} + 1 = ${after2}.`, answer: after2 },
      ],
      wrapUp: `Counting from 1: ...${n}, ${after}, ${after2}.`,
    };
  }

  if (bucket === "startMid") {
    let n: number;
    do {
      n = randInt(21, 96);
    } while (n % 10 === 0 || n % 10 === 9);
    const after = n + 1;
    return {
      title: "Start anywhere",
      bucket,
      story: `Start counting at ${n} — not from 1! What comes right after ${n}?`,
      visual: () => <HundredChart marks={[{ n, tone: "a" }, { n: after, tone: "b" }]} upTo={after} />,
      steps: [
        { kind: "number", prompt: `What number comes right after ${n}?`, hint: "Count one more than the starting number.", explain: `${n} + 1 = ${after}.`, answer: after },
        { kind: "number", prompt: `What number is one LESS than ${n}?`, hint: "One less means counting backward one step.", explain: `One less than ${n} is ${n - 1}.`, answer: n - 1 },
      ],
      wrapUp: `You can start counting from ANY number, not just 1: ${n}, ${after}...`,
    };
  }

  if (bucket === "crossDecade") {
    const d = randInt(1, 8);
    const start = d * 10 + 8;
    const next = start + 1;
    const next2 = next + 1;
    return {
      title: "Rolling into a new ten",
      bucket,
      story: `Start counting at ${start}. Keep going three numbers.`,
      visual: () => <HundredChart marks={[{ n: start, tone: "a" }]} upTo={start} />,
      steps: [
        { kind: "number", prompt: `What number comes right after ${start}?`, hint: "Count one more.", explain: `${start} + 1 = ${next}.`, answer: next },
        choice(
          { prompt: `${next} to ${next2} — which ten did you just start?`, hint: "A number ending in 9 is the LAST number of its ten.", explain: `${next2} starts a brand new ten.` },
          `the ${(d + 1) * 10}s`,
          [`the ${d * 10}s`]
        ),
        { kind: "number", prompt: `What number comes right after ${next}?`, hint: "One more than that.", explain: `${next} + 1 = ${next2}.`, answer: next2 },
      ],
      wrapUp: `${start}, ${next}, ${next2} — right into a brand new ten.`,
    };
  }

  if (bucket === "cross100") {
    const start = Math.random() < 0.7 ? 99 : randInt(97, 98);
    const next = start + 1;
    const next2 = next + 1;
    return {
      title: "Crossing into the hundreds",
      bucket,
      story: `Start counting at ${start}. Keep going three numbers — watch what happens when you run out of 2-digit numbers.`,
      visual: () => <HundredChart marks={[{ n: start, tone: "a" }]} upTo={start} />,
      steps: [
        { kind: "number", prompt: `What number comes right after ${start}?`, hint: "This might cross into a brand new hundred.", explain: `${start} + 1 = ${next}.`, answer: next },
        { kind: "number", prompt: `What number comes right after ${next}?`, hint: "Keep counting by ones.", explain: `${next} + 1 = ${next2}.`, answer: next2 },
        choice(
          { prompt: "Is 100 a 2-digit number or a 3-digit number?", hint: "Count the digits: 1, 0, 0.", explain: "100 has three digits — it's the very first 3-digit number." },
          "3-digit",
          ["2-digit"]
        ),
      ],
      wrapUp: `${start}, ${next}, ${next2} — a brand new digit appeared!`,
    };
  }

  // range100to120 — naming/reading numbers already past 100.
  const n = randInt(100, 119);
  const next = n + 1;
  return {
    title: "Counting past 100",
    bucket,
    story: `Here's ${n}, already past one hundred. What comes right after it?`,
    visual: () => <HundredChart marks={[{ n, tone: "a" }]} upTo={n} />,
    steps: [
      { kind: "number", prompt: `What number comes right after ${n}?`, hint: "Count one more, same as always.", explain: `${n} + 1 = ${next}.`, answer: next },
      { kind: "number", prompt: `What number is one LESS than ${n}?`, hint: "Count backward one step.", explain: `One less than ${n} is ${n - 1}.`, answer: n - 1 },
    ],
    wrapUp: `${n}, ${next} — counting past 100 works exactly the same way as counting past any other number.`,
  };
}

export const countingTo120: Unit = {
  id: "countingTo120",
  title: "Counting to 120",
  goal: "Count forward to 120, starting from 1 — or from any number someone gives you.",
  standard: "1.NBT.1",
  keyIdea: (
    <>
      <p>You can start counting from any number, not just 1 — and the count sequence never stops at 99: after 99 comes 100, then 101, and so on up to 120.</p>
      <p>The same pattern repeats every single ten, even past 100: count up through the ones, then the very next number starts a brand new ten.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // The count sequence itself (including the 99->100 jump to a new digit) is
  // a long-term memorized fact, not something re-derived by reasoning each
  // time — periodically re-check it, same convention as MK1's Unit 1.
  reintroEverySolved: 20,
  problems: [{ label: "Counting Forward", make: countingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: countingTo120Test,
};
