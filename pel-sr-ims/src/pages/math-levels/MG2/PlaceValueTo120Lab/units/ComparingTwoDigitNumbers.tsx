import { useEffect, useState } from "react";
import { HundredChart } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingTwoDigitNumbersTest } from "./ComparingTwoDigitNumbersTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: which symbol means which relationship. */
function SymbolVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "<";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Which symbol means "is LESS than"?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="<">{"<"}</option>
          <option value=">">{">"}</option>
          <option value="=">{"="}</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — < means \"is less than\": the smaller number comes first, the point of the symbol." : "Not quite — < (the symbol that looks like it's pointing left, getting narrower) means \"is less than.\""}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated + WHY: same tens digit, so the ones digit decides —
 *  AND the student must select the tens-first reasoning, not just the symbol. */
function TensFirstReasoningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [symbol, setSymbol] = useState("");
  const [why, setWhy] = useState("");
  const [checked, setChecked] = useState(false);
  const symbolOk = symbol === "<";
  const whyOk = why === "tensFirst";
  const ok = symbolOk && whyOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Compare 42 and 45.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          42 ___ 45:{" "}
          <select className="answer" value={symbol} onChange={(e) => setSymbol(e.target.value)} style={fieldOk(symbolOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="<">{"<"}</option>
            <option value=">">{">"}</option>
            <option value="=">{"="}</option>
          </select>
        </label>
        <label>
          Why?{" "}
          <select className="answer" value={why} onChange={(e) => setWhy(e.target.value)} style={fieldOk(whyOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="tensFirst">The tens are tied (both 4), so I compared the ones (2 vs 5) instead</option>
            <option value="onesFirst">I always compare the ones digit first, no matter what</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 42 < 45. You always check the TENS digit first; only when the tens are TIED do you move on to compare the ones."
            : "Not quite — check the tens first (both are 4, a tie), THEN compare the ones (2 vs 5) to break the tie. 42 < 45."}
        </p>
      )}
    </div>
  );
}

/** Trap: equal numbers — "=" must be a real, available answer. */
function EqualTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "=";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Compare 53 and 53.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="<">{"<"}</option>
          <option value=">">{">"}</option>
          <option value="=">{"="}</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 53 = 53. Both the tens AND the ones match exactly, so \"equal\" is the real, correct answer here — not a trick."
            : "Not quite — 53 and 53 have the exact same tens digit AND the exact same ones digit. That makes them equal: 53 = 53."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false: do the SAME digits, in a different order,
 *  mean the numbers are equal? (Digit-reversed near-miss.) */
function ReversedDigitsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> 36 and 63 use the exact same two digits (3 and 6). True or false: that means 36 and 63 must be equal.
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
            ? "Correct — false! WHICH digit is in the tens place matters. 36 has 3 tens; 63 has 6 tens. Same digits, totally different value: 36 < 63."
            : "Not quite — having the same two digits isn't enough. 36 has 3 tens and 6 ones; 63 has 6 tens and 3 ones. 36 < 63, they are NOT equal."}
        </p>
      )}
    </div>
  );
}

function ComparingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, tensFirst: false, equalTrap: false, reversed: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure comparing two-digit numbers makes sense before you try practice problems.</p>
      <SymbolVocabQuestion onComplete={mark("vocab")} />
      <TensFirstReasoningQuestion onComplete={mark("tensFirst")} />
      <EqualTrapQuestion onComplete={mark("equalTrap")} />
      <ReversedDigitsQuestion onComplete={mark("reversed")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [a, setA] = useState(42);
  const [b, setB] = useState(58);
  const symbol = a < b ? "<" : a > b ? ">" : "=";
  const sameTens = Math.floor(a / 10) === Math.floor(b / 10);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Number A" value={a} min={10} max={99} step={1} onChange={setA} tone="a" />
        <Stepper label="Number B" value={b} min={10} max={99} step={1} onChange={setB} tone="b" />
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
      {(introActive || showCheck) && <ComparingCheckForUnderstanding onComplete={onIntroDone} />}

      <div style={{ fontWeight: 800, fontSize: 28, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "var(--qa)" }}>{a}</span>
        <span>{symbol}</span>
        <span style={{ color: "var(--qb)" }}>{b}</span>
      </div>
      <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />
      <p className="muted small">
        {sameTens
          ? "Both numbers land in the SAME row — their tens digit is tied, so look at which column (ones digit) is further right."
          : "The two numbers land in DIFFERENT rows — whichever row is further down has the bigger tens digit, which already decides the comparison, no matter what the ones digits are."}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "diffTens" | "sameTensDiffOnes" | "equal" | "reversedDigits";
const BUCKETS: Bucket[] = ["diffTens", "sameTensDiffOnes", "equal", "reversedDigits"];

const symbolFor = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");

function comparingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "equal") {
    const a = randInt(10, 99);
    const sym = symbolFor(a, a);
    return {
      title: "Comparing equal numbers",
      bucket,
      story: `Compare ${a} and ${a}.`,
      visual: () => <HundredChart marks={[{ n: a, tone: "a" }]} />,
      steps: [
        choice({ prompt: `${a} ___ ${a}. Which symbol?`, hint: "Same tens AND same ones.", explain: `${a} = ${a}.` }, sym, ["<", ">"].filter((s) => s !== sym)),
      ],
      wrapUp: `${a} = ${a}.`,
    };
  }

  if (bucket === "reversedDigits") {
    let t: number, o: number;
    do {
      t = randInt(1, 9);
      o = randInt(1, 9);
    } while (t === o);
    const a = t * 10 + o;
    const b = o * 10 + t;
    const sym = symbolFor(a, b);
    return {
      title: "Same digits, different number",
      bucket,
      story: `Compare ${a} and ${b} — they use the exact same two digits!`,
      visual: () => <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />,
      steps: [
        choice(
          { prompt: `${a} ___ ${b}. Which symbol?`, hint: "Same digits doesn't mean equal — check which digit is in the TENS place for each.", explain: `${a} has ${t} tens; ${b} has ${o} tens.` },
          sym,
          [sym === "<" ? "=" : sym === ">" ? "=" : "<"]
        ),
        { kind: "number", prompt: `How many tens does ${a} have?`, hint: "The first digit.", explain: `${a} has ${t} tens.`, answer: t },
      ],
      wrapUp: `${a} ${sym} ${b} — the digits are the same, but their PLACES are swapped.`,
    };
  }

  if (bucket === "sameTensDiffOnes") {
    const tens = randInt(1, 9);
    let o1: number, o2: number;
    do {
      o1 = randInt(0, 9);
      o2 = randInt(0, 9);
    } while (o1 === o2);
    const a = tens * 10 + o1;
    const b = tens * 10 + o2;
    const sym = symbolFor(a, b);
    return {
      title: "Same tens — check the ones",
      bucket,
      story: `Compare ${a} and ${b}. Look closely — the tens digit is the same for both!`,
      visual: () => <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />,
      steps: [
        choice(
          { prompt: "Since the tens are tied, what should decide this comparison?", hint: "When the tens match, move on to the ones.", explain: "With tens tied, the ones digit breaks the tie." },
          "Compare the ones digits",
          ["Compare the tens digits again", "Guess — it must be equal since they look similar"]
        ),
        choice({ prompt: `${a} ___ ${b}. Which symbol?`, hint: `Compare ${o1} and ${o2}.`, explain: `${a} ${sym} ${b}.` }, sym, ["<", ">", "="].filter((s) => s !== sym)),
      ],
      wrapUp: `${a} ${sym} ${b} — decided entirely by the ones digit, since the tens were tied.`,
    };
  }

  // diffTens — decided by tens alone.
  let ta: number, tb: number;
  do {
    ta = randInt(1, 9);
    tb = randInt(1, 9);
  } while (ta === tb);
  const a = ta * 10 + randInt(0, 9);
  const b = tb * 10 + randInt(0, 9);
  const sym = symbolFor(a, b);
  return {
    title: "Different tens",
    bucket,
    story: `Compare ${a} and ${b}.`,
    visual: () => <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />,
    steps: [
      { kind: "number", prompt: `How many tens does ${a} have?`, hint: "The first digit.", explain: `${a} has ${ta} tens.`, answer: ta },
      choice({ prompt: `${a} ___ ${b}. Which symbol?`, hint: "The tens digits are different, so they alone decide it — you don't even need to look at the ones.", explain: `${a} ${sym} ${b}.` }, sym, ["<", ">", "="].filter((s) => s !== sym)),
    ],
    wrapUp: `${a} ${sym} ${b} — the tens digit alone already decided it.`,
  };
}

export const comparingTwoDigitNumbers: Unit = {
  id: "comparingTwoDigitNumbers",
  title: "Comparing Two-Digit Numbers",
  goal: "Decide whether one two-digit number is greater than, less than, or equal to another, and write it with >, =, <.",
  standard: "1.NBT.3",
  keyIdea: (
    <>
      <p>Always compare the TENS digit first. Whichever number has the bigger tens digit is the bigger number — no need to even look at the ones.</p>
      <p>Only when the tens digits are TIED do you compare the ones digits to break the tie. And if everything matches, the numbers are equal.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Comparison is reasoned through via place value every time, not a
  // memorized fact — no periodic re-gating.
  problems: [{ label: "Comparing Numbers", make: comparingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: comparingTwoDigitNumbersTest,
};
