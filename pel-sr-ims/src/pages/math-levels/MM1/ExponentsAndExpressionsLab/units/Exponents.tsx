import { useEffect, useState, type CSSProperties } from "react";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { exponentsTest } from "./ExponentsTest";

/** The repeated-multiplication string, e.g. (3, 4) -> "3 × 3 × 3 × 3" — the
 *  SAME function the Explore diagram and the Practice steps both read from,
 *  so the picture and the graded answer can never silently disagree. */
const repeatedMultString = (base: number, exponent: number): string => Array.from({ length: exponent }, () => base).join(" × ");

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

// ============================================================================
// EXPLORE — a row of factor "chips" that fills in as the exponent grows,
// echoing the repeated-multiplication string above.
// ============================================================================

/** Shows base^exponent expanding into `revealTo` of its factors (or all of
 *  them, by default) as a row of chips, so dragging the exponent stepper
 *  visibly grows the repeated-multiplication chain one factor at a time. */
function RepeatedMultiplicationStrip({ base, exponent, revealTo }: { base: number; exponent: number; revealTo?: number }) {
  const shown = revealTo ?? exponent;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }} aria-label={`${base} to the power of ${exponent}`}>
      {Array.from({ length: exponent }, (_, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {i > 0 && <span style={{ color: "var(--muted)", fontWeight: 700 }}>×</span>}
          <span
            style={{
              display: "inline-grid",
              placeItems: "center",
              width: 44,
              height: 44,
              borderRadius: "var(--radius-sm)",
              border: "2px solid var(--qa)",
              background: i < shown ? "var(--qa-soft)" : "var(--card)",
              color: "var(--qa-text)",
              fontWeight: 700,
              fontSize: 18,
              opacity: i < shown ? 1 : 0.25,
              transition: "opacity 0.2s, background 0.2s",
            }}
          >
            {base}
          </span>
        </span>
      ))}
    </div>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1: vocabulary — name the base and the exponent, not just compute. */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const BASE_ANS = "the base";
  const EXP_ANS = "the exponent";
  const OPTIONS = ["the base", "the exponent"];
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [checked, setChecked] = useState(false);
  const okFirst = first === BASE_ANS;
  const okSecond = second === EXP_ANS;
  const ok = okFirst && okSecond;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> In the expression 5<sup>3</sup>, the 5 is called{" "}
        <select className="answer" value={first} onChange={(e) => setFirst(e.target.value)} style={fieldStyle(okFirst, checked)}>
          <option value="" disabled>
            choose
          </option>
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        , and the 3 is called{" "}
        <select className="answer" value={second} onChange={(e) => setSecond(e.target.value)} style={fieldStyle(okSecond, checked)}>
          <option value="" disabled>
            choose
          </option>
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
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
          {ok ? "Correct — the base is the number being multiplied; the exponent says how many times." : "Not quite — the base is the number repeated; the exponent is the small number telling you how many times."}
        </p>
      )}
    </div>
  );
}

/** Q2: the signature trap — 3² vs 3×2 — plus the vocabulary behind why. */
function RepeatedMultVsTimesQuestion({ onComplete }: { onComplete?: () => void }) {
  const [valuePick, setValuePick] = useState("");
  const [meaningPick, setMeaningPick] = useState("");
  const [checked, setChecked] = useState(false);
  const valueOk = valuePick === "9";
  const meaningOk = meaningPick === "multiply the base by itself that many times";
  const ok = valueOk && meaningOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> What is 3<sup>2</sup>?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={valuePick} onChange={(e) => setValuePick(e.target.value)} style={fieldStyle(valueOk, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="9">9 (3 × 3)</option>
          <option value="6">6 (3 × 2)</option>
        </select>
      </div>
      <p>An exponent tells you to...</p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={meaningPick} onChange={(e) => setMeaningPick(e.target.value)} style={fieldStyle(meaningOk, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="multiply the base by itself that many times">multiply the base by itself that many times</option>
          <option value="multiply the base by the exponent">multiply the base by the exponent</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 3² means 3 × 3 = 9, not 3 × 2 = 6. An exponent multiplies the base by itself, it never multiplies the base by the exponent."
            : "Not quite — 3² means 3 multiplied by ITSELF 2 times (3 × 3), not 3 multiplied by 2."}
        </p>
      )}
    </div>
  );
}

/** Q3: generalization/true-false trap — anything to the 0 power. */
function PowerZeroTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "False";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: any number raised to the power of 0 equals 0.
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
          {ok
            ? "Correct — False. Any nonzero number to the 0 power equals 1 (e.g. 5⁰ = 1), not 0. It's a rule to remember, not something you compute by repeated multiplication."
            : "Not quite — try 5⁰. It equals 1, not 0. Any nonzero number to the power of 0 is 1."}
        </p>
      )}
    </div>
  );
}

/** Q4: order of operations — which happens first. */
function OrderOfOpsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "the exponent";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> In the expression 2 + 3<sup>2</sup>, which happens first: the addition, or the exponent?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="the addition">the addition</option>
          <option value="the exponent">the exponent</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — exponents are evaluated before addition: 3² = 9 first, then 2 + 9 = 11."
            : "Not quite — exponents always come before addition and subtraction in the order of operations. Evaluate 3² first."}
        </p>
      )}
    </div>
  );
}

function ExponentsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, repeatedVsTimes: false, powerZero: false, orderOfOps: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's connect a few ideas before you try practice problems.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <RepeatedMultVsTimesQuestion onComplete={mark("repeatedVsTimes")} />
      <PowerZeroTrapQuestion onComplete={mark("powerZero")} />
      <OrderOfOpsQuestion onComplete={mark("orderOfOps")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [base, setBase] = useState(3);
  const [exponent, setExponent] = useState(3);
  const value = Math.pow(base, exponent);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Base" value={base} min={0} max={9} step={1} onChange={setBase} tone="a" />
        <Stepper label="Exponent" value={exponent} min={0} max={5} step={1} onChange={setExponent} tone="b" />
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
      {(introActive || showCheck) && <ExponentsCheckForUnderstanding onComplete={onIntroDone} />}
      <div style={{ fontSize: 28, fontWeight: 700 }}>
        {base}
        <sup>{exponent}</sup> = {value}
      </div>
      {exponent === 0 ? (
        <RepeatedMultiplicationStrip base={base} exponent={1} />
      ) : (
        <RepeatedMultiplicationStrip base={base} exponent={exponent} />
      )}
      <p className="muted small">
        {exponent === 0
          ? `Any nonzero number to the power of 0 is 1 (and this is a rule to remember, not something to multiply out).`
          : exponent === 1
          ? `An exponent of 1 means the base just appears once — ${base}¹ = ${base}.`
          : base === 0
          ? `0 multiplied by itself any number of times is still 0.`
          : base === 1
          ? `1 multiplied by itself any number of times is still 1.`
          : `${base}${exponent === 2 ? "²" : exponent === 3 ? "³" : "ⁿ"} means ${repeatedMultString(base, exponent)} = ${value} — the base repeated as a factor, NOT ${base} × ${exponent} (= ${base * exponent}).`}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — exponents
// ============================================================================

type Bucket = "repeated-mult" | "base-edge-case" | "exponent-of-one" | "notation-match" | "order-of-ops";
const BUCKETS: Bucket[] = ["repeated-mult", "base-edge-case", "exponent-of-one", "notation-match", "order-of-ops"];

function exponentsProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "repeated-mult") {
    const base = randInt(2, 9);
    let exponent = randInt(2, 4);
    // The second step's distractor "base × exponent" (targeting the 3²=3×2
    // conflation) would text-collide with the correct expanded form itself
    // when base=2 and exponent=2 (both render as "2 × 2") — the brute-force
    // verification script caught this.
    if (base === 2 && exponent === 2) exponent = 3;
    const value = Math.pow(base, exponent);
    const expanded = repeatedMultString(base, exponent);
    return {
      title: "Exponents as repeated multiplication",
      bucket,
      story: (
        <>
          Evaluate {base}<sup>{exponent}</sup>.
        </>
      ),
      visual: (done: number) => <RepeatedMultiplicationStrip base={base} exponent={exponent} revealTo={done >= 1 ? exponent : 0} />,
      steps: [
        {
          kind: "number",
          prompt: (
            <>
              What is {base}<sup>{exponent}</sup>?
            </>
          ),
          hint: `Multiply ${base} by itself ${exponent} times: ${expanded}.`,
          explain: `${expanded} = ${value}.`,
          answer: value,
        },
        choice(
          {
            prompt: (
              <>
                Which shows {base}<sup>{exponent}</sup> as repeated multiplication?
              </>
            ),
            hint: "The exponent tells you how many times the base appears — not what to multiply it by.",
            explain: `${base}${exponent} appears in the expression as the exponent, so ${base} is written ${exponent} times: ${expanded}.`,
          },
          expanded,
          [`${base} × ${exponent}`]
        ),
      ],
      wrapUp: (
        <>
          {base}<sup>{exponent}</sup> = {expanded} = {value}.
        </>
      ),
    };
  }

  if (bucket === "base-edge-case") {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const exponent = randInt(2, 8);
      return {
        title: "Base of 1",
        bucket,
        story: (
          <>
            Evaluate 1<sup>{exponent}</sup>.
          </>
        ),
        visual: (done: number) => <RepeatedMultiplicationStrip base={1} exponent={exponent} revealTo={done >= 1 ? exponent : 0} />,
        steps: [
          { kind: "number", prompt: <>What is 1<sup>{exponent}</sup>?</>, hint: "1 times 1, any number of times, is still 1.", explain: `1 raised to any power is 1.`, answer: 1 },
          choice(
            { prompt: "Why does this happen every time, for any exponent?", hint: "Think about what multiplying by 1 ever does to a number.", explain: "Multiplying by 1 never changes a value, so repeating it any number of times still gives 1." },
            "Multiplying 1 by itself never changes the value",
            ["The exponent was too small to matter", "1 is a special number with no real rule"]
          ),
        ],
        wrapUp: <>1 raised to any power is always 1.</>,
      };
    }
    if (kind === 1) {
      const exponent = randInt(2, 6);
      return {
        title: "Base of 0",
        bucket,
        story: (
          <>
            Evaluate 0<sup>{exponent}</sup>.
          </>
        ),
        visual: (done: number) => <RepeatedMultiplicationStrip base={0} exponent={exponent} revealTo={done >= 1 ? exponent : 0} />,
        steps: [
          { kind: "number", prompt: <>What is 0<sup>{exponent}</sup>?</>, hint: "0 times 0, any number of times, is still 0.", explain: `0 raised to any positive power is 0.`, answer: 0 },
          choice(
            { prompt: "Why does this happen every time, for any positive exponent?", hint: "Think about what multiplying by 0 ever does to a number.", explain: "Multiplying by 0 always gives 0, no matter how many times it's repeated." },
            "Multiplying 0 by itself always gives 0",
            ["0 doesn't follow exponent rules", "The exponent was too small to matter"]
          ),
        ],
        wrapUp: <>0 raised to any positive whole-number power is always 0.</>,
      };
    }
    const base = randInt(2, 12);
    return {
      title: "The exponent 0",
      bucket,
      story: (
        <>
          Evaluate {base}<sup>0</sup>.
        </>
      ),
      visual: () => (
        <div style={{ fontSize: 28, fontWeight: 700 }}>
          {base}<sup>0</sup> = ?
        </div>
      ),
      steps: [
        choice(
          {
            prompt: (
              <>
                What is {base}<sup>0</sup>?
              </>
            ),
            hint: "This one's a rule to remember, not something to compute by repeated multiplication: any nonzero number to the 0 power is 1.",
            explain: `Any nonzero number raised to the 0 power equals 1 — not 0, and not the base itself.`,
          },
          "1",
          ["0", String(base)]
        ),
      ],
      wrapUp: (
        <>
          {base}<sup>0</sup> = 1 — true for every nonzero base.
        </>
      ),
    };
  }

  if (bucket === "exponent-of-one") {
    const base = randInt(2, 20);
    return {
      title: "Exponent of 1",
      bucket,
      story: (
        <>
          Evaluate {base}<sup>1</sup>.
        </>
      ),
      visual: (done: number) => <RepeatedMultiplicationStrip base={base} exponent={1} revealTo={done >= 1 ? 1 : 0} />,
      steps: [
        { kind: "number", prompt: <>What is {base}<sup>1</sup>?</>, hint: "An exponent of 1 means the base appears just once — nothing to multiply it by.", explain: `${base}¹ = ${base}.`, answer: base },
        choice(
          { prompt: "In general, n¹ always equals...", hint: "What did you just find for the base above?", explain: "An exponent of 1 always just gives back the base itself." },
          "n",
          ["1"]
        ),
      ],
      wrapUp: <>{base}<sup>1</sup> = {base} — any number to the power of 1 is itself.</>,
    };
  }

  if (bucket === "notation-match") {
    const base = randInt(2, 6);
    let exponent = randInt(2, 4);
    // Avoid base === exponent generally — see ExponentsTest.tsx's
    // notationMatchQuestion for why (a real distractor collision in one
    // direction, a redundant duplicate distractor in the other).
    if (base === exponent) exponent = exponent < 4 ? exponent + 1 : exponent - 1;
    const expanded = repeatedMultString(base, exponent);
    const toExponent = Math.random() < 0.5;
    const value = Math.pow(base, exponent);
    if (toExponent) {
      return {
        title: "Matching exponent notation",
        bucket,
        story: <>Which exponent matches {expanded}?</>,
        visual: () => <RepeatedMultiplicationStrip base={base} exponent={exponent} />,
        steps: [
          choice(
            { prompt: <>Which is the same as {expanded}, written with an exponent?</>, hint: "Count how many times the base appears.", explain: <>{expanded} has {base} appearing {exponent} times, so it's {base}<sup>{exponent}</sup>.</> },
            `${base}^${exponent}`,
            // Off-by-one in each direction, targeting the "count the factors
            // carefully" mistake — never the base/exponent-swapped form,
            // which can text-collide with the correct answer when base ===
            // exponent (e.g. both "3^3").
            [`${base}^${exponent - 1}`, `${base}^${exponent + 1}`]
          ),
          { kind: "number", prompt: <>What value does that equal?</>, hint: "Multiply it out.", explain: `${expanded} = ${value}.`, answer: value },
        ],
        wrapUp: <>{expanded} = {base}<sup>{exponent}</sup> = {value}.</>,
      };
    }
    return {
      title: "Matching exponent notation",
      bucket,
      story: (
        <>
          Which repeated multiplication matches {base}<sup>{exponent}</sup>?
        </>
      ),
      visual: (done: number) => (done >= 1 ? <RepeatedMultiplicationStrip base={base} exponent={exponent} /> : <div style={{ fontSize: 28, fontWeight: 700 }}>{base}<sup>{exponent}</sup></div>),
      steps: [
        choice(
          {
            prompt: (
              <>
                Which is the same as {base}<sup>{exponent}</sup>, as repeated multiplication?
              </>
            ),
            hint: `${base}^${exponent} means ${base} multiplied by itself ${exponent} times — not ${base} multiplied by ${exponent}.`,
            explain: (
              <>
                {base}<sup>{exponent}</sup> = {expanded}.
              </>
            ),
          },
          expanded,
          [`${base} × ${exponent}`, repeatedMultString(base, exponent > 2 ? exponent - 1 : exponent + 1)]
        ),
        { kind: "number", prompt: <>What value does that equal?</>, hint: "Multiply it out.", explain: `${expanded} = ${value}.`, answer: value },
      ],
      wrapUp: (
        <>
          {base}<sup>{exponent}</sup> = {expanded} = {value}.
        </>
      ),
    };
  }

  // order-of-ops
  const base = randInt(2, 6);
  const add = randInt(1, 15);
  const square = base * base;
  const total = add + square;
  return {
    title: "Exponents inside a bigger expression",
    bucket,
    story: (
      <>
        Evaluate {add} + {base}<sup>2</sup>.
      </>
    ),
    visual: (done: number) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 22, fontWeight: 700 }}>
        <div>
          {add} + {base}<sup>2</sup>
        </div>
        {done >= 1 && (
          <div>
            {add} + <span style={{ color: "var(--qa-text)" }}>{square}</span>
          </div>
        )}
        {done >= 2 && <div style={{ color: "var(--good)" }}>{total}</div>}
      </div>
    ),
    steps: [
      { kind: "number", prompt: <>First, what is {base}<sup>2</sup> by itself?</>, hint: `${base}² means ${base} × ${base}.`, explain: `${base}² = ${square}.`, answer: square },
      { kind: "number", prompt: <>Now, what is {add} + {base}<sup>2</sup>?</>, hint: `You already found ${base}² = ${square}. Add ${add} to it.`, explain: `${add} + ${square} = ${total}.`, answer: total },
      choice(
        { prompt: "Which operation has to happen first here — the exponent, or the addition?", hint: "Look at the order you just worked in.", explain: "Exponents are always evaluated before addition and subtraction." },
        "the exponent",
        ["the addition"]
      ),
    ],
    wrapUp: (
      <>
        {add} + {base}<sup>2</sup> = {add} + {square} = {total}.
      </>
    ),
  };
}

export const exponents: Unit = {
  id: "exponents",
  title: "Exponents",
  goal: "Write and evaluate numerical expressions involving whole-number exponents.",
  standard: "6.EE.1",
  keyIdea: (
    <>
      <p>
        An exponent tells you how many times to multiply the base by itself: 4<sup>3</sup> = 4 × 4 × 4, NOT 4 × 3.
      </p>
      <p>
        Two edge cases to remember: any number to the power of 1 is itself, and any nonzero number to the power of 0 is 1 (never 0).
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Exponents", make: exponentsProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: exponentsTest,
};
