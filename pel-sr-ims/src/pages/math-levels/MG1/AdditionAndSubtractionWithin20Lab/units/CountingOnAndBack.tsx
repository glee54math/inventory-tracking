import { useEffect, useState } from "react";
import { NumberLine } from "../../../shared/diagrams";
import { TenFrameGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { countingOnAndBackTest } from "./CountingOnAndBackTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions (never randomized — same convention as every
// other gated unit in this app). Targets both named misconceptions: (1)
// re-counting from 1 instead of starting from the known addend/number, and
// (2) off-by-one in count-back.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary + "where do you start" / "how many counts" — the two things
 *  the plan explicitly calls out, in one question so neither can be guessed
 *  independently of the other. */
function WhereAndHowManyQuestion({ onComplete }: { onComplete?: () => void }) {
  const [start, setStart] = useState("");
  const [many, setMany] = useState("");
  const [checked, setChecked] = useState(false);
  const startOk = start === "8";
  const manyOk = many === "3";
  const ok = startOk && manyOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> To add 8 + 3 by counting on (instead of starting over from 1), where do you START counting, and how many MORE numbers do you
        say?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Start counting at:{" "}
          <select className="answer" value={start} onChange={(e) => setStart(e.target.value)} style={fieldOk(startOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="1">1</option>
            <option value="8">8</option>
            <option value="3">3</option>
          </select>
        </label>
        <label>
          How many more numbers:{" "}
          <select className="answer" value={many} onChange={(e) => setMany(e.target.value)} style={fieldOk(manyOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3">3</option>
            <option value="8">8</option>
            <option value="11">11</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — start at 8 (the number you already know) and count on just 3 more: 9, 10, 11. No need to start over from 1."
            : "Not quite — counting ON means starting at the number you already have (8), then counting just the amount you're adding (3) more times: 9, 10, 11."}
        </p>
      )}
    </div>
  );
}

/** The commonly-conflated case: an addend presented SECOND is actually the
 *  smarter one to start from, when it's the bigger number. Tests whether the
 *  student defaults to "always start at the first number." */
function SmartStartQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "8";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> You need to find 3 + 8. The problem is written with 3 first — but which number is the SMARTER one to start counting on from?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="3">3 (the first number written)</option>
          <option value="8">8 (the bigger number)</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — it doesn't matter which number is written first. Starting at the BIGGER number (8) and counting on 3 more (9, 10, 11) is faster than starting at 3 and counting on 8 more."
            : "Not quite — the order numbers are written in an addition problem doesn't matter. Always start counting on from the BIGGER number, even if it's written second, so you count on as few times as possible."}
        </p>
      )}
    </div>
  );
}

/** Off-by-one in count-back, made explicit: exactly how many numbers get
 *  said when counting back to subtract 3. */
function CountBackSequenceQuestion({ onComplete }: { onComplete?: () => void }) {
  const OPTIONS = ["8", "9", "10", "11", "12"];
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [checked, setChecked] = useState(false);
  const aOk = a === "11";
  const bOk = b === "10";
  const cOk = c === "9";
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
        <b>3.</b> 12 − 3. Counting back from 12, which THREE numbers do you say (in order)?
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
            ? "Correct — 11, 10, 9. Exactly three numbers for subtracting 3, landing on 9."
            : "Not quite — count back ONE number at a time, exactly 3 times (the number you're subtracting): 11, 10, 9. Saying one too few or one too many is the #1 count-back mistake."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: does "count-backs said = number
 *  subtracted" always hold, or is it sometimes off by one? */
function CountBackRuleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: when you count back to subtract, the number of times you count back should always exactly match the number
        you're subtracting — never one more, never one less.
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
            ? "Correct — always true. Subtracting 4 means counting back exactly 4 times, no matter what number you start from."
            : "Not quite — it's always true: the number of counts back always matches the number you're subtracting, exactly, every time."}
        </p>
      )}
    </div>
  );
}

function CountingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ whereHowMany: false, smartStart: false, sequence: false, rule: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure counting on and counting back make sense before you try practice problems.</p>
      <WhereAndHowManyQuestion onComplete={mark("whereHowMany")} />
      <SmartStartQuestion onComplete={mark("smartStart")} />
      <CountBackSequenceQuestion onComplete={mark("sequence")} />
      <CountBackRuleQuestion onComplete={mark("rule")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"on" | "back">("on");
  const [start, setStart] = useState(8);
  const [current, setCurrent] = useState(8);
  const [trail, setTrail] = useState<number[]>([8]);

  const resetTo = (n: number) => {
    setStart(n);
    setCurrent(n);
    setTrail([n]);
  };
  const countOnce = () => {
    const next = mode === "on" ? Math.min(20, current + 1) : Math.max(0, current - 1);
    setCurrent(next);
    setTrail((t) => [...t.slice(-5), next]);
  };
  const countsSoFar = trail.length - 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="Direction"
          value={mode}
          onChange={(m) => {
            setMode(m);
            resetTo(start);
          }}
          options={[{ id: "on", label: "Count on (add)" }, { id: "back", label: "Count back (subtract)" }]}
        />
        <Stepper label="Start at" value={start} min={0} max={20} step={1} onChange={resetTo} tone="a" />
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

      <div className="control-row" style={{ alignItems: "center" }}>
        <button
          className="btn primary"
          onClick={countOnce}
          disabled={mode === "on" ? current >= 20 : current <= 0}
        >
          {mode === "on" ? "Count one more" : "Count one back"}
        </button>
        <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {trail.map((n, i) => (
            <span
              key={i}
              style={{
                fontWeight: 800,
                fontSize: 18,
                padding: "4px 10px",
                borderRadius: 999,
                background: i === 0 ? "var(--grid)" : "var(--qa-soft)",
                color: i === 0 ? "var(--ink)" : "var(--qa-text, var(--ink))",
              }}
            >
              {n}
            </span>
          ))}
        </span>
      </div>
      <p className="muted small">
        You counted {mode === "on" ? "on" : "back"} {countsSoFar} time{countsSoFar === 1 ? "" : "s"} from {start}, landing on {current}. Notice
        you never had to start over from {mode === "on" ? "1" : "the very top"} — you kept the starting number and just kept going.
      </p>

      <NumberLine min={0} max={20} points={[{ value: start, label: "start", tone: "c" }, ...(current !== start ? [{ value: current, label: "now", tone: "a" as const }] : [])]} />
      <TenFrameGroup value={current} tone="a" />
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "countOnLarger" | "countOnSmallFirst" | "countBackSmall" | "countBackCross";
const BUCKETS: Bucket[] = ["countOnLarger", "countOnSmallFirst", "countBackSmall", "countBackCross"];

function countingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "countOnLarger") {
    // The larger addend shown FIRST — the "easy" ordering, still requires
    // recognizing you start from it rather than from 1.
    let a = 0;
    let b = 0;
    do {
      a = randInt(5, 17);
      b = randInt(1, 9);
    } while (a + b > 20 || a < b);
    const total = a + b;
    return {
      title: "Counting on",
      bucket,
      story: `Find ${a} + ${b} by counting on.`,
      visual: () => <NumberLine min={0} max={20} points={[{ value: a, label: "start", tone: "a" }]} />,
      steps: [
        choice({ prompt: `Which number should you start counting from, ${a} or ${b}?`, hint: "Start from the number you already have — don't start over from 1.", explain: `Start at ${a}, the number already given.` }, String(a), [String(b)]),
        { kind: "number", prompt: `What's the first number you say as you count on from ${a}?`, hint: "One more than the start.", explain: `${a} + 1 = ${a + 1}.`, answer: a + 1 },
        { kind: "number", prompt: `Counting on ${b} more from ${a}, what do you land on?`, hint: `Count on ${b} times from ${a}.`, explain: `${a} + ${b} = ${total}.`, answer: total },
      ],
      wrapUp: `${a} + ${b} = ${total}, by counting on ${b} from ${a}.`,
    };
  }

  if (bucket === "countOnSmallFirst") {
    // The SMALLER addend shown first — tests whether the student defaults
    // to counting from the first number regardless of size.
    let big = 0;
    let small = 0;
    do {
      big = randInt(5, 17);
      small = randInt(1, 9);
    } while (big + small > 20 || small >= big);
    const total = big + small;
    return {
      title: "Counting on — smart start",
      bucket,
      story: `Find ${small} + ${big} by counting on. (Notice ${small} is written first.)`,
      visual: () => <NumberLine min={0} max={20} points={[{ value: small, label: String(small), tone: "b" }, { value: big, label: String(big), tone: "a" }]} />,
      steps: [
        choice(
          { prompt: `Even though ${small} is written first, which number is the SMARTER one to start counting on from?`, hint: "Start from the BIGGER number, no matter which one is written first.", explain: `Starting at ${big} (the bigger number) means counting on fewer times.` },
          String(big),
          [String(small)]
        ),
        { kind: "number", prompt: `What's the first number you say as you count on from ${big}?`, hint: "One more than the bigger number.", explain: `${big} + 1 = ${big + 1}.`, answer: big + 1 },
        { kind: "number", prompt: `Counting on ${small} more from ${big}, what do you land on?`, hint: `Count on ${small} times from ${big}.`, explain: `${big} + ${small} = ${total}.`, answer: total },
      ],
      wrapUp: `${small} + ${big} = ${total} — starting from ${big} (the bigger number) was the faster way.`,
    };
  }

  if (bucket === "countBackSmall") {
    // Count back WITHOUT crossing into a different "ten" — isolates the
    // mechanics from the extra decade-crossing difficulty of the other bucket.
    let start = 0;
    let sub = 0;
    do {
      start = randInt(4, 20);
      sub = randInt(1, 4);
    } while (start - sub < 0 || Math.floor(start / 10) !== Math.floor((start - sub) / 10));
    const result = start - sub;
    return {
      title: "Counting back",
      bucket,
      story: `Find ${start} − ${sub} by counting back.`,
      visual: () => <NumberLine min={0} max={20} points={[{ value: start, label: "start", tone: "c" }]} />,
      steps: [
        { kind: "number", prompt: `Count back ONE from ${start}. What do you land on?`, hint: "One less than the start.", explain: `${start} − 1 = ${start - 1}.`, answer: start - 1 },
        choice(
          { prompt: `How many TOTAL times should you count back to subtract ${sub}?`, hint: "The number of counts back always matches the number you're subtracting.", explain: `Subtracting ${sub} means counting back exactly ${sub} times.` },
          String(sub),
          [String(sub - 1), String(sub + 1)].filter((d) => Number(d) >= 1)
        ),
        { kind: "number", prompt: `After counting back ${sub} times from ${start}, what do you land on?`, hint: `Count back ${sub} times total.`, explain: `${start} − ${sub} = ${result}.`, answer: result },
      ],
      wrapUp: `${start} − ${sub} = ${result}, by counting back ${sub} from ${start}.`,
    };
  }

  // countBackCross — the hard bucket: crossing from the teens into single
  // digits (e.g. 13 - 4 = 9). Biased (not guaranteed) toward a genuine
  // crossing case the way MK1's decade-crossing bucket biases its sampling.
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 19);
    sub = randInt(2, 9);
  } while (start - sub < 0 || start - sub >= 10);
  const result = start - sub;
  return {
    title: "Counting back across the teens",
    bucket,
    story: `Find ${start} − ${sub} by counting back. You'll cross out of the teens.`,
    visual: () => <NumberLine min={0} max={20} points={[{ value: start, label: "start", tone: "c" }]} />,
    steps: [
      { kind: "number", prompt: `Count back ONE from ${start}. What do you land on?`, hint: "One less than the start.", explain: `${start} − 1 = ${start - 1}.`, answer: start - 1 },
      choice(
        { prompt: `How many TOTAL times should you count back to subtract ${sub}?`, hint: "The number of counts back always matches the number you're subtracting, even when you cross out of the teens.", explain: `Subtracting ${sub} means counting back exactly ${sub} times, no matter what numbers you pass through.` },
        String(sub),
        [String(sub - 1), String(sub + 1)].filter((d) => Number(d) >= 1)
      ),
      { kind: "number", prompt: `After counting back ${sub} times from ${start}, what do you land on?`, hint: `Count back ${sub} times total — you'll land on a number less than 10.`, explain: `${start} − ${sub} = ${result}.`, answer: result },
    ],
    wrapUp: `${start} − ${sub} = ${result} — you crossed right out of the teens.`,
  };
}

export const countingOnAndBack: Unit = {
  id: "countingOnAndBack",
  title: "Counting On and Counting Back",
  goal: "Use counting forward and backward to add and subtract, instead of starting over from 1 every time.",
  standard: "1.OA.5",
  keyIdea: (
    <>
      <p>Counting ON means starting at a number you already know, then counting forward just the amount you're adding — not starting over from 1.</p>
      <p>Always start from the BIGGER number, even when it's written second. Counting BACK to subtract works the same way in reverse: the number of counts back always matches the number you're subtracting.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // No reintroEverySolved — this is a strategy to be reasoned through each
  // time, not a fact to memorize (contrast Unit 5's fluency buckets).
  problems: [{ label: "Counting On and Back", make: countingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: countingOnAndBackTest,
};
