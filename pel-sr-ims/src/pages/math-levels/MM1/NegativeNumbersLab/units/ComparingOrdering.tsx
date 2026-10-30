import { useEffect, useState, type CSSProperties } from "react";
import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingOrderingTest } from "./ComparingOrderingTest";

const RANGE = 20;

const randNonzero = (range: number): number => {
  let v: number;
  do {
    v = randInt(-range, range);
  } while (v === 0);
  return v;
};

const randDistinctPair = (range: number): [number, number] => {
  const a = randNonzero(range);
  let b = randNonzero(range);
  while (b === a) b = randNonzero(range);
  return [a, b];
};

/** Two DISTINCT positive integers in [min, max] — used wherever a bucket
 *  needs two values that stay distinct even after a sign/transform is
 *  applied to both (drawing a plain distinct pair and THEN transforming,
 *  e.g. via -Math.abs(), can silently collapse two different inputs to the
 *  same output — e.g. 10 and -10 both become -10 after negating the
 *  magnitude). Building the pair from already-distinct magnitudes avoids that. */
const randDistinctPositive = (min: number, max: number): [number, number] => {
  const a = randInt(min, max);
  let b = randInt(min, max);
  while (b === a) b = randInt(min, max);
  return [a, b];
};

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/**
 * Debt vs. balance — the unit's own signature trap (a MORE negative balance
 * means a BIGGER debt but a SMALLER balance), phrased so both vocabulary
 * terms have to be held at once instead of asking about just one of them.
 * Fixed example (not randomized), same convention as every other Check for
 * Understanding / Quick Check in this lab.
 */
function DebtBalanceQuestion({ onComplete }: { onComplete?: () => void }) {
  const BALANCE_A = -40;
  const BALANCE_B = -15;
  const OPTIONS = ["Account A", "Account B"];
  const [debtPick, setDebtPick] = useState("");
  const [balancePick, setBalancePick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [debtPick, balancePick].every((v) => String(v).trim() !== "");
  const debtOk = debtPick === "Account A";
  const balanceOk = balancePick === "Account B";
  const ok = debtOk && balanceOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Account A has a balance of {BALANCE_A} dollars. Account B has a balance of {BALANCE_B} dollars.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Greater debt:{" "}
          <select className="answer" value={debtPick} onChange={(e) => setDebtPick(e.target.value)} style={fieldStyle(debtOk, checked)}>
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
        <label>
          Greater balance:{" "}
          <select className="answer" value={balancePick} onChange={(e) => setBalancePick(e.target.value)} style={fieldStyle(balanceOk, checked)}>
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
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? `Correct — Account A owes more (${Math.abs(BALANCE_A)} > ${Math.abs(BALANCE_B)}), but Account B has the greater balance (${BALANCE_B} > ${BALANCE_A}). "Greater debt" and "greater balance" point in opposite directions here.`
            : "Not quite — debt and balance aren't the same thing. The MORE negative balance means the BIGGER debt, but the LESSER (smaller) balance."}
        </p>
      )}
    </div>
  );
}

/**
 * Three related questions about the same two divers — separates the
 * colloquial sense of "deeper" from the mathematical sense of "greater,"
 * instead of asking only one of them.
 */
function DiverQuestion({ onComplete }: { onComplete?: () => void }) {
  const DEPTH_A = -12;
  const DEPTH_B = -20;
  const OPTIONS = ["Diver A", "Diver B"];
  const [deeperPick, setDeeperPick] = useState("");
  const [closerPick, setCloserPick] = useState("");
  const [greaterPick, setGreaterPick] = useState("");
  const [checked, setChecked] = useState(false);
  const deeperOk = deeperPick === "Diver B";
  const closerOk = closerPick === "Diver A";
  const greaterOk = greaterPick === "Diver A";
  const ok = deeperOk && closerOk && greaterOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  const selectRow = (label: string, value: string, setValue: (v: string) => void, isOk: boolean) => (
    <label>
      {label}:{" "}
      <select className="answer" value={value} onChange={(e) => setValue(e.target.value)} style={fieldStyle(isOk, checked)}>
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
        <b>2.</b> Diver A is at {DEPTH_A} feet. Diver B is at {DEPTH_B} feet.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        {selectRow("Deeper", deeperPick, setDeeperPick, deeperOk)}
        {selectRow("Closer to the surface", closerPick, setCloserPick, closerOk)}
        {selectRow("Greater depth number", greaterPick, setGreaterPick, greaterOk)}
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? `Correct — Diver B is deeper (farther below the surface), Diver A is closer to the surface, and ${DEPTH_A} is the greater number since ${DEPTH_A} > ${DEPTH_B}.`
            : "Not quite — deeper means farther below 0, closer to the surface means closer to 0, and \"greater number\" just means farther right on the number line."}
        </p>
      )}
    </div>
  );
}

/** What the '>' symbol itself means, geometrically — not just how to apply it. */
function InequalityVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "right";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> On a number line, "&gt;" means the first number is located to the{" "}
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="right">right</option>
          <option value="left">left</option>
          <option value="same place as">same place as</option>
        </select>{" "}
        of the second number.
      </p>
      <div className="control-row">
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? 'Correct — "greater than" always means farther right on the number line, no matter the sign of either number.'
            : "Not quite — think about where the greater of two numbers always sits compared to the smaller one."}
        </p>
      )}
    </div>
  );
}

/** Ordering by VALUE and ordering by DISTANCE FROM 0 are different operations
 *  that can disagree — then a generalization question so the insight doesn't
 *  stop at this one example. */
function OrderVsDistanceQuestion({ onComplete }: { onComplete?: () => void }) {
  const VALUES = ["−9", "−5", "3"];
  const [smallestPick, setSmallestPick] = useState("");
  const [farthestPick, setFarthestPick] = useState("");
  const [alwaysPick, setAlwaysPick] = useState("");
  const [checked, setChecked] = useState(false);
  const smallestOk = smallestPick === "−9";
  const farthestOk = farthestPick === "−9";
  const alwaysOk = alwaysPick === "No";
  const ok = smallestOk && farthestOk && alwaysOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  const selectRow = (label: string, value: string, setValue: (v: string) => void, options: string[], isOk: boolean) => (
    <label>
      {label}:{" "}
      <select className="answer" value={value} onChange={(e) => setValue(e.target.value)} style={fieldStyle(isOk, checked)}>
        <option value="" disabled>
          choose
        </option>
        {options.map((o) => (
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
        <b>4.</b> Look at −9, −5, and 3.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        {selectRow("Smallest (least)", smallestPick, setSmallestPick, VALUES, smallestOk)}
        {selectRow("Farthest from 0", farthestPick, setFarthestPick, VALUES, farthestOk)}
      </div>
      <p>Is the smallest (least) number always the same as the number farthest from 0?</p>
      <div className="control-row" style={{ alignItems: "center" }}>
        {selectRow("Always the same?", alwaysPick, setAlwaysPick, ["Yes", "No"], alwaysOk)}
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — here −9 happens to be both the smallest AND the farthest from 0, but that's not guaranteed. With −3, −5, and 10, for example, the smallest is −5, but 10 is farthest from 0."
            : "Not quite — check which of the three is smallest (farthest left), and which has the biggest distance from 0, then think about whether that match was guaranteed or just happened here."}
        </p>
      )}
    </div>
  );
}

/** All 4 questions together — fires onComplete only once every one has been
 *  answered correctly. */
function ComparingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ debtBalance: false, diver: false, inequalityVocab: false, orderVsDistance: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's connect a few ideas before you try practice problems.</p>
      <DebtBalanceQuestion onComplete={mark("debtBalance")} />
      <DiverQuestion onComplete={mark("diver")} />
      <InequalityVocabQuestion onComplete={mark("inequalityVocab")} />
      <OrderVsDistanceQuestion onComplete={mark("orderVsDistance")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  // Once the gate is already satisfied, the check is optional — hidden by
  // default so a returning student isn't forced through it again, but still
  // reachable with one click for review (same convention as every other
  // Check for Understanding in this lab).
  const [showCheck, setShowCheck] = useState(false);
  const [a, setA] = useState(-3);
  const [b, setB] = useState(-7);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="First number" value={a} min={-RANGE} max={RANGE} step={1} onChange={setA} tone="a" />
        <Stepper label="Second number" value={b} min={-RANGE} max={RANGE} step={1} onChange={setB} tone="b" />
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
      <NumberLine
        min={-RANGE}
        max={RANGE}
        points={[{ value: a, label: String(a), tone: "a", onChange: setA }, { value: b, label: String(b), tone: "b", onChange: setB }]}
      />
      {a === b ? (
        <p className="muted small">Those are equal — try changing one of them.</p>
      ) : (
        <p className="muted small">
          {bigger} is to the right of {smaller} on the number line, so {bigger} &gt; {smaller}. And no matter the sign: |{a}| = {Math.abs(a)},
          |{b}| = {Math.abs(b)} — absolute value is just the distance from 0, always zero or positive.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — comparing, ordering & absolute value
// ============================================================================

type Bucket = "inequality" | "real-world-order" | "absolute-value" | "magnitude-vs-order";
const BUCKETS: Bucket[] = ["inequality", "real-world-order", "absolute-value", "magnitude-vs-order"];

function comparingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "inequality") {
    const [a, b] = randDistinctPair(RANGE);
    const bigger = Math.max(a, b);
    const smaller = Math.min(a, b);
    return {
      title: "Comparing integers",
      bucket,
      story: `Which is greater: ${a} or ${b}?`,
      visual: () => <NumberLine min={-RANGE} max={RANGE} points={[{ value: a, label: String(a), tone: "a" }, { value: b, label: String(b), tone: "b" }]} />,
      steps: [
        choice(
          { prompt: `Which is greater, ${a} or ${b}?`, hint: "On a number line, numbers further right are greater.", explain: `${bigger} is farther right on the number line, so ${bigger} > ${smaller}.` },
          String(bigger),
          [String(smaller)]
        ),
        choice(
          {
            prompt: `${bigger} > ${smaller} — what does that mean on the number line?`,
            hint: "The greater number is the one closer to the right.",
            explain: `${bigger} > ${smaller} means ${bigger} is located to the right of ${smaller} on the number line.`,
          },
          `${bigger} is to the right of ${smaller}`,
          [`${bigger} is to the left of ${smaller}`]
        ),
      ],
      wrapUp: `${bigger} > ${smaller}.`,
    };
  }

  if (bucket === "real-world-order") {
    const [magA, magB] = randDistinctPositive(1, 20); // classic case: two negative temperatures
    const a = -magA;
    const b = -magB;
    const warmer = Math.max(a, b);
    const colder = Math.min(a, b);
    return {
      title: "Ordering in real life",
      bucket,
      story: `It is ${a}°C in one city and ${b}°C in another.`,
      visual: () => <NumberLine min={-25} max={5} points={[{ value: a, label: `${a}°C`, tone: "a" }, { value: b, label: `${b}°C`, tone: "b" }]} />,
      steps: [
        choice(
          { prompt: "Which city is warmer?", hint: "Warmer means a greater temperature — farther right on the number line.", explain: `${warmer}°C is warmer than ${colder}°C.` },
          `${warmer}°C`,
          [`${colder}°C`]
        ),
        choice(
          {
            prompt: "Which inequality correctly compares them?",
            hint: "The warmer temperature is the greater number.",
            explain: `${warmer}°C > ${colder}°C, since ${warmer} is to the right of ${colder} on the number line.`,
          },
          `${warmer}°C > ${colder}°C`,
          [`${warmer}°C < ${colder}°C`]
        ),
      ],
      wrapUp: `${warmer}°C > ${colder}°C — ${warmer}°C is warmer.`,
    };
  }

  if (bucket === "absolute-value") {
    const n = randNonzero(RANGE + 10);
    return {
      title: "Absolute value",
      bucket,
      story: `What is |${n}|?`,
      visual: () => <NumberLine min={-(RANGE + 10)} max={RANGE + 10} points={[{ value: n, tone: "a" }]} />,
      steps: [
        {
          kind: "number",
          prompt: `What is |${n}|?`,
          hint: "Absolute value is the distance from 0 — always zero or positive, never negative.",
          explain: `|${n}| = ${Math.abs(n)}, the distance from 0 to ${n}.`,
          answer: Math.abs(n),
        },
        choice(
          {
            prompt: `What does |${n}| represent?`,
            hint: "Absolute value is a DISTANCE — think about what two points that distance is measured between.",
            explain: `|${n}| is the distance from 0 to ${n} — not the distance to its opposite, and not the opposite itself.`,
          },
          `The distance from 0 to ${n}`,
          [`The distance from ${n} to its opposite, ${-n}`, `The opposite of ${n}`]
        ),
      ],
      wrapUp: `|${n}| = ${Math.abs(n)} — the distance from 0 to ${n}.`,
    };
  }

  // magnitude-vs-order: the classic "a smaller (more negative) balance means a BIGGER debt" case
  const [debtA, debtB] = randDistinctPositive(5, 50);
  const balanceA = -debtA;
  const balanceB = -debtB;
  const smallerBalance = Math.min(balanceA, balanceB);
  const biggerDebt = Math.max(debtA, debtB);
  const whichAccount = smallerBalance === balanceA ? "A" : "B";
  return {
    title: "Balance size vs. debt size",
    bucket,
    story: `Account A has a balance of ${balanceA} dollars. Account B has a balance of ${balanceB} dollars.`,
    visual: () => (
      <NumberLine min={-60} max={10} points={[{ value: balanceA, label: "A", tone: "a" }, { value: balanceB, label: "B", tone: "b" }]} />
    ),
    steps: [
      choice(
        {
          prompt: "Which account has the SMALLER balance (further in debt)?",
          hint: "A smaller (more negative) balance means more money owed, even though the number itself is \"less.\"",
          explain: `${smallerBalance} is less than the other balance, so Account ${whichAccount} owes more — a smaller balance is a bigger debt.`,
        },
        `Account ${whichAccount}`,
        [`Account ${whichAccount === "A" ? "B" : "A"}`]
      ),
      {
        kind: "number",
        prompt: "What is the size of that bigger debt, in dollars?",
        hint: "The debt size is the absolute value of the (negative) balance.",
        explain: `The smaller balance is the bigger debt: |${smallerBalance}| = ${biggerDebt} dollars.`,
        answer: biggerDebt,
      },
    ],
    wrapUp: `The account with the smaller (more negative) balance owes the bigger debt: $${biggerDebt}.`,
  };
}

export const comparingOrdering: Unit = {
  id: "comparingOrdering",
  title: "Comparing, Ordering & Absolute Value",
  goal: "Compare and order rational numbers using a number line, interpret real-world order statements, and understand absolute value as distance from 0.",
  standard: "6.NS.7",
  keyIdea: (
    <>
      <p>A number is greater than another if it's farther right on the number line — even when both are negative, e.g. −3 &gt; −7.</p>
      <p>Absolute value is distance from 0, always zero or positive — so a smaller (more negative) number can still mean a BIGGER debt or distance.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Compare & Order", make: comparingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: comparingOrderingTest,
};
