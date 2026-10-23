import { useEffect, useState, type CSSProperties } from "react";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { evaluatingExpressionsTest } from "./EvaluatingExpressionsTest";

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** The multi-step evaluation ${c} + ${a} × ${b}² broken into its 3
 *  intermediate values — ONE function the diagram's progressive reveal AND
 *  the Practice steps both read from, so the picture and the graded answer
 *  can never silently disagree about what "the exponent result" or "the
 *  product" actually is. */
function multiStepBreakdown(a: number, b: number, c: number) {
  const square = b * b;
  const product = a * square;
  const total = c + product;
  return { square, product, total };
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1: multiplication before addition. */
function MultiplyFirstQuestion({ onComplete }: { onComplete?: () => void }) {
  const [orderPick, setOrderPick] = useState("");
  const [valuePick, setValuePick] = useState("");
  const [checked, setChecked] = useState(false);
  const orderOk = orderPick === "multiply first";
  const valueOk = valuePick === "14";
  const ok = orderOk && valueOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Evaluate 2 + 3 × 4. Do you add first, or multiply first?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={orderPick} onChange={(e) => setOrderPick(e.target.value)} style={fieldStyle(orderOk, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="add first">add first</option>
          <option value="multiply first">multiply first</option>
        </select>
        <label>
          What is 2 + 3 × 4?{" "}
          <input className="answer" style={{ width: 55 }} inputMode="numeric" value={valuePick} onChange={(e) => setValuePick(e.target.value)} />
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — multiplication is done before addition: 3 × 4 = 12, then 2 + 12 = 14."
            : "Not quite — multiplication always comes before addition, no matter which is written first: 3 × 4 = 12, then 2 + 12 = 14."}
        </p>
      )}
    </div>
  );
}

/** Q2: exponent before multiplication — commonly conflated with "evaluate left to right." */
function ExponentBeforeMultiplyQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "square the 2 first";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Evaluate 5 × 2². Do you square the 2 first, or multiply 5 × 2 first?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="square the 2 first">square the 2 first (2² = 4), then multiply by 5</option>
          <option value="multiply 5x2 first">multiply 5 × 2 first, then square the result</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — exponents are evaluated BEFORE multiplication: 2² = 4 first, then 5 × 4 = 20. (If you multiplied 5×2 first you'd get 10² = 100, which is wrong.)"
            : "Not quite — exponents always come before multiplication: 2² = 4 first, then 5 × 4 = 20."}
        </p>
      )}
    </div>
  );
}

/** Q3: generalization/true-false trap — order of operations isn't "left to right." */
function LeftToRightTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "False";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: order of operations means you always work strictly left to right through an expression.
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
            ? "Correct — False. Exponents and multiplication/division always outrank addition/subtraction, no matter where they sit in the expression. 3 + 4 × 2 = 11, not (3+4) × 2 = 14."
            : "Not quite — try 3 + 4 × 2. Working strictly left to right gives (3+4) × 2 = 14, but the correct order-of-operations answer is 3 + 8 = 11."}
        </p>
      )}
    </div>
  );
}

/** Q4: substitute before combining coefficients — a multi-variable-adjacent misconception. */
function SubstituteFirstQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "substitute";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Evaluate 3x + 2y when x = 2 and y = 5. Do you substitute the values first, or add the coefficients 3 + 2 first?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="substitute">substitute the values first, then follow order of operations</option>
          <option value="addCoeffs">add 3 + 2 first, then substitute</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — substitute x=2 and y=5 first: 3(2) + 2(5) = 6 + 10 = 16. The 3 and the 2 are coefficients of DIFFERENT variables, so they can't just be added together."
            : "Not quite — 3x and 2y are terms with different variables. You can't combine their coefficients; substitute the values first: 3(2) + 2(5) = 16."}
        </p>
      )}
    </div>
  );
}

function EvaluatingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ multiplyFirst: false, exponentFirst: false, leftToRight: false, substituteFirst: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's connect a few ideas before you try practice problems.</p>
      <MultiplyFirstQuestion onComplete={mark("multiplyFirst")} />
      <ExponentBeforeMultiplyQuestion onComplete={mark("exponentFirst")} />
      <LeftToRightTrapQuestion onComplete={mark("leftToRight")} />
      <SubstituteFirstQuestion onComplete={mark("substituteFirst")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [c, setC] = useState(5);
  const { square, product, total } = multiStepBreakdown(a, b, c);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="a" value={a} min={1} max={9} step={1} onChange={setA} tone="a" />
        <Stepper label="b" value={b} min={1} max={6} step={1} onChange={setB} tone="b" />
        <Stepper label="c" value={c} min={0} max={20} step={1} onChange={setC} tone="c" />
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
      {(introActive || showCheck) && <EvaluatingCheckForUnderstanding onComplete={onIntroDone} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
        <div>
          {c} + {a} × {b}
          <sup>2</sup>
        </div>
        <div className="muted small" style={{ fontWeight: 400 }}>
          Step 1 — exponent: {b}² = <span style={{ color: "var(--qb-text)", fontWeight: 700 }}>{square}</span>
        </div>
        <div className="muted small" style={{ fontWeight: 400 }}>
          Step 2 — multiply: {a} × {square} = <span style={{ color: "var(--qa-text)", fontWeight: 700 }}>{product}</span>
        </div>
        <div className="muted small" style={{ fontWeight: 400 }}>
          Step 3 — add: {c} + {product} = <span style={{ color: "var(--good)", fontWeight: 700 }}>{total}</span>
        </div>
      </div>
      <p className="muted small">
        Change a, b, or c above and watch every step update — the exponent is always evaluated first, then multiplication, then addition, no
        matter what numbers you pick.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — evaluating expressions
// ============================================================================

type Bucket = "simple-sub" | "sub-with-exponent" | "multi-step" | "formula" | "multi-variable";
const BUCKETS: Bucket[] = ["simple-sub", "sub-with-exponent", "multi-step", "formula", "multi-variable"];

function evaluatingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "simple-sub") {
    const a = randInt(2, 9);
    const b = randInt(1, 20);
    const x = randInt(2, 12);
    const term = a * x;
    const total = term + b;
    return {
      title: "Substituting into an expression",
      bucket,
      story: `Evaluate ${a}x + ${b} when x = ${x}.`,
      visual: (done: number) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
          <div>
            {a}x + {b}, x = {x}
          </div>
          {done >= 1 && <div>{a}({x}) + {b}</div>}
          {done >= 1 && <div style={{ color: "var(--good)" }}>= {term} + {b} = {total}</div>}
        </div>
      ),
      steps: [
        { kind: "number", prompt: `Evaluate ${a}x + ${b} when x = ${x}.`, hint: `Substitute ${x} for x: ${a}(${x}) + ${b}.`, explain: `${a}(${x}) + ${b} = ${term} + ${b} = ${total}.`, answer: total },
      ],
      wrapUp: `${a}x + ${b} at x = ${x} is ${total}.`,
    };
  }

  if (bucket === "sub-with-exponent") {
    const b = randInt(1, 10);
    const x = randInt(2, 8);
    const square = x * x;
    const total = square + b;
    return {
      title: "Substituting with an exponent",
      bucket,
      story: `Evaluate x² + ${b} when x = ${x}.`,
      visual: (done: number) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
          <div>
            x² + {b}, x = {x}
          </div>
          {done >= 1 && <div>{x}² + {b} = {square} + {b}</div>}
          {done >= 2 && <div style={{ color: "var(--good)" }}>= {total}</div>}
        </div>
      ),
      steps: [
        { kind: "number", prompt: `First, substitute and evaluate x² when x = ${x}.`, hint: `${x}² = ${x} × ${x}.`, explain: `${x}² = ${square}.`, answer: square },
        { kind: "number", prompt: `Now evaluate x² + ${b} when x = ${x}.`, hint: `You already found x² = ${square}. Add ${b}.`, explain: `${square} + ${b} = ${total}.`, answer: total },
        choice(
          { prompt: "Which happens first here — the exponent, or the addition?", hint: "Look at the order you just worked in.", explain: "Exponents are always evaluated before addition." },
          "the exponent",
          ["the addition"]
        ),
      ],
      wrapUp: `x² + ${b} at x = ${x} is ${total}.`,
    };
  }

  if (bucket === "multi-step") {
    const a = randInt(2, 9);
    const b = randInt(2, 6);
    const c = randInt(1, 15);
    const { square, product, total } = multiStepBreakdown(a, b, c);
    return {
      title: "Order of operations, step by step",
      bucket,
      story: (
        <>
          Evaluate {c} + {a} × {b}<sup>2</sup>.
        </>
      ),
      visual: (done: number) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
          <div>
            {c} + {a} × {b}<sup>2</sup>
          </div>
          {done >= 1 && <div>{c} + {a} × {square}</div>}
          {done >= 2 && <div>{c} + {product}</div>}
          {done >= 3 && <div style={{ color: "var(--good)" }}>= {total}</div>}
        </div>
      ),
      steps: [
        { kind: "number", prompt: <>First, what is {b}<sup>2</sup> by itself?</>, hint: `${b}² = ${b} × ${b}.`, explain: `${b}² = ${square}.`, answer: square },
        { kind: "number", prompt: <>Now what is {a} × {b}<sup>2</sup>?</>, hint: `You found ${b}² = ${square}. Multiply by ${a}.`, explain: `${a} × ${square} = ${product}.`, answer: product },
        { kind: "number", prompt: <>Finally, what is {c} + {a} × {b}<sup>2</sup>?</>, hint: `You found ${a} × ${b}² = ${product}. Add ${c}.`, explain: `${c} + ${product} = ${total}.`, answer: total },
      ],
      wrapUp: (
        <>
          {c} + {a} × {b}<sup>2</sup> = {c} + {product} = {total}.
        </>
      ),
    };
  }

  if (bucket === "formula") {
    const formulaKind: "volume" | "surfaceArea" = Math.random() < 0.5 ? "volume" : "surfaceArea";
    // Fractional s = 1/2 case appears a solid fraction of the time, so this
    // bucket's hardest tier is actually reachable, not just its easy end.
    const sIsFraction = Math.random() < 0.4;
    if (sIsFraction) {
      if (formulaKind === "volume") {
        return {
          title: "Volume formula with a fractional side",
          bucket,
          story: "A cube has side length s = 1/2. Find its volume using V = s³.",
          visual: () => <div style={{ fontSize: 22, fontWeight: 700 }}>V = s³, s = 1/2</div>,
          steps: [
            { kind: "number", prompt: "What is s³ when s = 1/2?", hint: "(1/2) × (1/2) × (1/2).", explain: "(1/2)³ = 1/8.", answer: 1 / 8, frac: true, fracAnswer: [1, 8] },
            choice(
              { prompt: "What does this formula represent?", hint: "V stands for...", explain: "V = s³ gives the volume of a cube." },
              "the volume of the cube",
              ["the surface area of the cube", "the length of one edge"]
            ),
          ],
          wrapUp: "V = s³ = (1/2)³ = 1/8.",
        };
      }
      return {
        title: "Surface area formula with a fractional side",
        bucket,
        story: "A cube has side length s = 1/2. Find its total surface area using A = 6s².",
        visual: (done: number) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
            <div>A = 6s², s = 1/2</div>
            {done >= 1 && <div>6 × 1/4</div>}
          </div>
        ),
        steps: [
          { kind: "number", prompt: "First, what is s² when s = 1/2?", hint: "(1/2) × (1/2).", explain: "(1/2)² = 1/4.", answer: 0.25, frac: true, fracAnswer: [1, 4] },
          { kind: "number", prompt: "Now what is A = 6s²?", hint: "Multiply 6 by the s² you just found.", explain: "6 × 1/4 = 3/2.", answer: 1.5, frac: true, fracAnswer: [3, 2] },
        ],
        wrapUp: "A = 6s² = 6 × 1/4 = 3/2.",
      };
    }
    const s = randInt(2, 6);
    if (formulaKind === "volume") {
      const value = s * s * s;
      return {
        title: "Volume formula",
        bucket,
        story: `A cube has side length s = ${s}. Find its volume using V = s³.`,
        visual: () => <div style={{ fontSize: 22, fontWeight: 700 }}>V = s³, s = {s}</div>,
        steps: [
          { kind: "number", prompt: `What is s³ when s = ${s}?`, hint: `${s} × ${s} × ${s}.`, explain: `${s}³ = ${value}.`, answer: value },
          choice(
            { prompt: "What does this formula represent?", hint: "V stands for...", explain: "V = s³ gives the volume of a cube." },
            "the volume of the cube",
            ["the surface area of the cube", "the length of one edge"]
          ),
        ],
        wrapUp: `V = s³ = ${s}³ = ${value}.`,
      };
    }
    const square = s * s;
    const value = 6 * square;
    return {
      title: "Surface area formula",
      bucket,
      story: `A cube has side length s = ${s}. Find its total surface area using A = 6s².`,
      visual: (done: number) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
          <div>A = 6s², s = {s}</div>
          {done >= 1 && <div>6 × {square}</div>}
        </div>
      ),
      steps: [
        { kind: "number", prompt: `First, what is s² when s = ${s}?`, hint: `${s} × ${s}.`, explain: `${s}² = ${square}.`, answer: square },
        { kind: "number", prompt: "Now what is A = 6s²?", hint: `Multiply 6 by the s² you just found.`, explain: `6 × ${square} = ${value}.`, answer: value },
      ],
      wrapUp: `A = 6s² = 6 × ${square} = ${value}.`,
    };
  }

  // multi-variable
  const a = randInt(2, 8);
  const b = randInt(2, 8);
  const x = randInt(2, 10);
  const y = randInt(2, 10);
  const termX = a * x;
  const termY = b * y;
  const total = termX + termY;
  return {
    title: "Substituting multiple variables",
    bucket,
    story: `Evaluate ${a}x + ${b}y when x = ${x} and y = ${y}.`,
    visual: (done: number) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
        <div>
          {a}x + {b}y, x = {x}, y = {y}
        </div>
        {done >= 1 && <div>{a}({x}) = {termX}</div>}
        {done >= 2 && <div>{b}({y}) = {termY}</div>}
        {done >= 3 && <div style={{ color: "var(--good)" }}>{termX} + {termY} = {total}</div>}
      </div>
    ),
    steps: [
      { kind: "number", prompt: `First, what is ${a}x when x = ${x}?`, hint: `${a} × ${x}.`, explain: `${a}(${x}) = ${termX}.`, answer: termX },
      { kind: "number", prompt: `Now what is ${b}y when y = ${y}?`, hint: `${b} × ${y}.`, explain: `${b}(${y}) = ${termY}.`, answer: termY },
      { kind: "number", prompt: `Finally, what is ${a}x + ${b}y?`, hint: `Add the two values you just found: ${termX} + ${termY}.`, explain: `${termX} + ${termY} = ${total}.`, answer: total },
    ],
    wrapUp: `${a}x + ${b}y at x=${x}, y=${y} is ${total}.`,
  };
}

export const evaluatingExpressions: Unit = {
  id: "evaluatingExpressions",
  title: "Evaluating Expressions & Order of Operations",
  goal: "Evaluate expressions — including exponents and real-world formulas — at given variable values, using the order of operations.",
  standard: "6.EE.2c",
  keyIdea: (
    <>
      <p>Substitute the given value(s) for every variable first, then follow the order of operations: exponents, then multiplication/division, then addition/subtraction.</p>
      <p>
        The standard's own examples: V = s³ (volume of a cube) and A = 6s² (surface area of a cube) — even when s is a fraction like 1/2.
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // The order-of-operations sequence itself is meant to be memorized
  // long-term — proving it once in the gate doesn't guarantee it stuck, so
  // this periodically re-shows the guided check, same convention as
  // MM1_RatioLab's Conversion unit.
  reintroEverySolved: 20,
  problems: [{ label: "Evaluating Expressions", make: evaluatingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: evaluatingExpressionsTest,
};
