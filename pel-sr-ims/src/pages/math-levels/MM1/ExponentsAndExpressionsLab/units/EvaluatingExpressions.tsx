import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper, Segmented, QA, QB, QC } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { evaluatingExpressionsTest } from "./EvaluatingExpressionsTest";

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/**
 * Colors the Part 2 diagram's `d` — a 4th quantity alongside QA/QB/QC's a/b/c.
 * Local (not in shared/engine/controls.tsx) since --qd-text is only defined
 * in this lab's own palette, not the shared one every lab's QA/QB/QC pull
 * from. Without this, d rendered in the same default ink color as the
 * uncolored intermediate numbers (e.g. the 49 in "3 × 49 − 4"), making it
 * look like part of that step's arithmetic instead of its own term.
 */
const QD = ({ children }: { children: ReactNode }) => <span style={{ color: "var(--qd-text)", fontWeight: 700 }}>{children}</span>;

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
  const [interPick, setInterPick] = useState("");
  const [valuePick, setValuePick] = useState("");
  const [checked, setChecked] = useState(false);
  const orderOk = orderPick === "multiply first";
  const interOk = interPick === "12";
  const valueOk = valuePick === "14";
  const ok = orderOk && interOk && valueOk;
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
        {orderPick === "multiply first" && (
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            2 + 3 × 4 = 2 +{" "}
            <input
              className="answer"
              style={{ width: 45, ...fieldStyle(interOk, checked) }}
              inputMode="numeric"
              value={interPick}
              onChange={(e) => setInterPick(e.target.value)}
            />{" "}
            ={" "}
            <input
              className="answer"
              style={{ width: 45, ...fieldStyle(valueOk, checked) }}
              inputMode="numeric"
              value={valuePick}
              onChange={(e) => setValuePick(e.target.value)}
            />
          </label>
        )}
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
            ? "Correct — False. Exponents and multiplication/division always outrank addition/subtraction, no matter where they sit in the expression. 2 + 3 × 4 = 14, not (2+3) × 4 = 20."
            : "Not quite — try 2 + 3 × 4 (the first question above). Working strictly left to right gives (2+3) × 4 = 20, but the correct order-of-operations answer is 2 + 12 = 14."}
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

/** Q5 (Part 2): parentheses are simplified before anything else — including exponents and multiplication. */
function ParenthesesFirstQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "parentheses first";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>5.</b> Evaluate 2 + (6 − 3) × 4. Do you simplify the parentheses first, or multiply first?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="parentheses first">parentheses first (6 − 3 = 3), then multiply by 4</option>
          <option value="multiply first">multiply 3 × 4 first, then add inside the parentheses</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — parentheses are always simplified first, before exponents or multiplication: (6 − 3) = 3, then 2 + 3 × 4 = 2 + 12 = 14."
            : "Not quite — whatever is inside parentheses gets simplified first, before anything outside it: (6 − 3) = 3, then 2 + 3 × 4 = 14."}
        </p>
      )}
    </div>
  );
}

/** Q6 (Part 2): multiplication and division are equal rank, resolved left to right — not "multiplication always wins." */
function MultDivTieQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "divide first";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>6.</b> Evaluate 12 ÷ 3 × 2. Which do you do first — divide, or multiply?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="divide first">divide first (12 ÷ 3 = 4), then multiply by 2</option>
          <option value="multiply first">multiply 3 × 2 first, then divide 12 by the result</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — multiplication and division are equal rank, so you work left to right: 12 ÷ 3 = 4 first, then 4 × 2 = 8. (Multiplying first would wrongly give 12 ÷ 6 = 2.)"
            : "Not quite — multiplication doesn't automatically go first. Division and multiplication rank equally, so work left to right: 12 ÷ 3 = 4, then 4 × 2 = 8."}
        </p>
      )}
    </div>
  );
}

/**
 * The gate's two halves, selected by `part` (owned by Explore so the diagram
 * below can switch in sync with it). Part 1 is the original 4-question set,
 * unchanged; Part 2 adds parentheses and the multiplication/division tie.
 * `onComplete` only fires once BOTH halves are clean, regardless of which
 * tab is active when the last one finishes — a student who does Part 2 first
 * still has to go back and finish Part 1 before Practice unlocks.
 */
function EvaluatingCheckForUnderstanding({ part, onComplete }: { part: "1" | "2"; onComplete?: () => void }) {
  const [part1Done, setPart1Done] = useState({ multiplyFirst: false, exponentFirst: false, leftToRight: false, substituteFirst: false });
  const [part2Done, setPart2Done] = useState({ parensFirst: false, multDivTie: false });
  const part1AllDone = Object.values(part1Done).every(Boolean);
  const part2AllDone = Object.values(part2Done).every(Boolean);
  const allDone = part1AllDone && part2AllDone;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark1 = (key: keyof typeof part1Done) => () => setPart1Done((d) => (d[key] ? d : { ...d, [key]: true }));
  const mark2 = (key: keyof typeof part2Done) => () => setPart2Done((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's connect a few ideas before you try practice problems.</p>
      {part === "1" ? (
        <>
          <MultiplyFirstQuestion onComplete={mark1("multiplyFirst")} />
          <ExponentBeforeMultiplyQuestion onComplete={mark1("exponentFirst")} />
          <LeftToRightTrapQuestion onComplete={mark1("leftToRight")} />
          <SubstituteFirstQuestion onComplete={mark1("substituteFirst")} />
          {part1AllDone && !part2AllDone && <p className="muted small">Nice work — switch to "Parentheses &amp; More" above to finish the check.</p>}
        </>
      ) : (
        <>
          <ParenthesesFirstQuestion onComplete={mark2("parensFirst")} />
          <MultDivTieQuestion onComplete={mark2("multDivTie")} />
          {part2AllDone && !part1AllDone && <p className="muted small">Nice work — switch to "Exponents &amp; Multiplication" above to finish the check.</p>}
        </>
      )}
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [part, setPart] = useState<"1" | "2">("1");
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [c, setC] = useState(5);
  const [d, setD] = useState(4);
  const { square, product, total } = multiStepBreakdown(a, b, c);

  // Part 2's diagram: a × (b+c)² − d — reuses the same a/b/c steppers so
  // changing them updates BOTH diagrams, plus one more stepper (d) just for
  // this half. d is clamped down whenever product2 shrinks below it (e.g.
  // the student lowers a/b/c), so this stays a whole-number subtraction —
  // this lab never shows a negative result; that's NegativeNumbersLab's job.
  const sum2 = b + c;
  const sq2 = sum2 * sum2;
  const product2 = a * sq2;
  useEffect(() => {
    setD((prev) => Math.min(prev, product2));
  }, [product2]);
  const total2 = product2 - d;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--grid)", fontSize: 15 }}>
        <b>PEMDAS</b> — the order to simplify any expression: <b>P</b>arentheses → <b>E</b>xponents → <b>M</b>ultiplication/<b>D</b>ivision (left to
        right) → <b>A</b>ddition/<b>S</b>ubtraction (left to right).
      </div>
      <div className="control-row">
        <Stepper label="a" value={a} min={1} max={9} step={1} onChange={setA} tone="a" />
        <Stepper label="b" value={b} min={1} max={6} step={1} onChange={setB} tone="b" />
        <Stepper label="c" value={c} min={0} max={20} step={1} onChange={setC} tone="c" />
        {part === "2" && <Stepper label="d" value={d} min={0} max={Math.max(1, product2)} step={1} onChange={setD} />}
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
      <Segmented
        label="Order of operations example"
        value={part}
        onChange={setPart}
        options={[
          { id: "1", label: "Exponents & Multiplication" },
          { id: "2", label: "Parentheses & More" },
        ]}
      />
      {(introActive || showCheck) && <EvaluatingCheckForUnderstanding part={part} onComplete={onIntroDone} />}
      {part === "1" ? (
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "baseline", rowGap: 10, columnGap: 14, fontSize: 20, fontWeight: 700 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <QC>{c}</QC> + <QA>{a}</QA> × <QB>{b}<sup>2</sup></QB>
          </div>
          <span>
            = <QC>{c}</QC> + <QA>{a}</QA> × <QB>{square}</QB>
          </span>
          <span className="muted small" style={{ fontWeight: 400 }}>
            Step 1 — exponent: <QB>{b}<sup>2</sup></QB> = <QB>{square}</QB>
          </span>
          <span>
            = <QC>{c}</QC> + <QA>{product}</QA>
          </span>
          <span className="muted small" style={{ fontWeight: 400 }}>
            Step 2 — multiply: <QA>{a}</QA> × <QB>{square}</QB> = <QA>{product}</QA>
          </span>
          <span>
            = <span style={{ color: "var(--good)" }}>{total}</span>
          </span>
          <span className="muted small" style={{ fontWeight: 400 }}>
            Step 3 — add: <QC>{c}</QC> + <QA>{product}</QA> = <span style={{ color: "var(--good)", fontWeight: 700 }}>{total}</span>
          </span>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "baseline", rowGap: 10, columnGap: 14, fontSize: 20, fontWeight: 700 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <QA>{a}</QA> × (<QB>{b}</QB> + <QC>{c}</QC>)<sup>2</sup> − <QD>{d}</QD>
          </div>
          <span>
            = <QA>{a}</QA> × ({sum2})<sup>2</sup> − <QD>{d}</QD>
          </span>
          <span className="muted small" style={{ fontWeight: 400 }}>
            Step 1 — parentheses: <QB>{b}</QB> + <QC>{c}</QC> = {sum2}
          </span>
          <span>
            = <QA>{a}</QA> × {sq2} − <QD>{d}</QD>
          </span>
          <span className="muted small" style={{ fontWeight: 400 }}>
            Step 2 — exponent: {sum2}<sup>2</sup> = {sq2}
          </span>
          <span>
            = {product2} − <QD>{d}</QD>
          </span>
          <span className="muted small" style={{ fontWeight: 400 }}>
            Step 3 — multiply: <QA>{a}</QA> × {sq2} = {product2}
          </span>
          <span>
            = <span style={{ color: "var(--good)" }}>{total2}</span>
          </span>
          <span className="muted small" style={{ fontWeight: 400 }}>
            Step 4 — subtract: {product2} − <QD>{d}</QD> = <span style={{ color: "var(--good)", fontWeight: 700 }}>{total2}</span>
          </span>
        </div>
      )}
      <p className="muted small">
        {part === "1"
          ? "Change a, b, or c above and watch every step update — the exponent is always evaluated first, then multiplication, then addition, no matter what numbers you pick."
          : "Change a, b, c, or d above and watch every step update — parentheses are always simplified first, then the exponent, then multiplication, then subtraction."}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — evaluating expressions
// ============================================================================

// "Simplifying Expressions" — pure numeric PEMDAS, no variables to substitute.
type SimplifyBucket = "multi-step" | "parens-basic" | "division-combo" | "mult-div-chain" | "full-pemdas";
const SIMPLIFY_BUCKETS: SimplifyBucket[] = ["multi-step", "parens-basic", "division-combo", "mult-div-chain", "full-pemdas"];

// "Evaluating Expressions" — substitute given value(s) into variables, then
// follow order of operations.
type EvaluateBucket = "simple-sub" | "sub-with-exponent" | "formula" | "multi-variable";
const EVALUATE_BUCKETS: EvaluateBucket[] = ["simple-sub", "sub-with-exponent", "formula", "multi-variable"];

function simplifyingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as SimplifyBucket | undefined) ?? SIMPLIFY_BUCKETS[randInt(0, SIMPLIFY_BUCKETS.length - 1)];

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
          {done >= 2 && <div>{c} + {a} × {square}</div>}
          {done >= 4 && <div>{c} + {product}</div>}
          {done >= 5 && <div style={{ color: "var(--good)" }}>= {total}</div>}
        </div>
      ),
      steps: [
        choice(
          { prompt: <>Looking at {c} + {a} × {b}<sup>2</sup>, what do you simplify first?</>, hint: "The exponent always outranks addition, no matter which is written first.", explain: <>The exponent {b}<sup>2</sup> is simplified first — not the addition, even though {c} is written first.</> },
          `the exponent (${b}²)`,
          ["the addition"]
        ),
        { kind: "number", prompt: <>What is {b}<sup>2</sup> by itself?</>, hint: `${b}² = ${b} × ${b}.`, explain: `${b}² = ${square}.`, answer: square },
        choice(
          { prompt: "Now what's next?", hint: "Multiplication outranks addition.", explain: `${a} × ${square} is simplified next — multiplication always outranks addition.` },
          `the multiplication (${a} × ${square})`,
          ["the addition"]
        ),
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

  if (bucket === "parens-basic") {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = randInt(2, 12);
    const sum = a + b;
    const total = sum * c;
    return {
      title: "Parentheses change the order",
      bucket,
      story: (
        <>
          Evaluate ({a} + {b}) × {c}.
        </>
      ),
      visual: (done: number) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
          <div>
            ({a} + {b}) × {c}
          </div>
          {done >= 2 && <div>{sum} × {c}</div>}
          {done >= 3 && <div style={{ color: "var(--good)" }}>= {total}</div>}
        </div>
      ),
      steps: [
        choice(
          { prompt: "Which do you simplify first?", hint: "Parentheses are always simplified before anything outside them.", explain: "Parentheses are always simplified first, before any operation outside them." },
          "the addition inside the parentheses",
          ["the multiplication outside"]
        ),
        { kind: "number", prompt: <>What is the sum inside the parentheses: {a} + {b}?</>, hint: "Parentheses are simplified before anything outside them.", explain: `${a} + ${b} = ${sum}.`, answer: sum },
        { kind: "number", prompt: <>Now what is {sum} × {c}?</>, hint: `Multiply the result of the parentheses by ${c}.`, explain: `${sum} × ${c} = ${total}.`, answer: total },
      ],
      wrapUp: (
        <>
          ({a} + {b}) × {c} = {sum} × {c} = {total}.
        </>
      ),
    };
  }

  if (bucket === "division-combo") {
    const c = randInt(2, 6);
    const q = randInt(2, 9);
    const b = c * q;
    const a = randInt(1, 20);
    const total = a + q;
    return {
      title: "Division ranks with multiplication",
      bucket,
      story: `Evaluate ${a} + ${b} ÷ ${c}.`,
      visual: (done: number) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
          <div>
            {a} + {b} ÷ {c}
          </div>
          {done >= 2 && <div>{a} + {q}</div>}
          {done >= 3 && <div style={{ color: "var(--good)" }}>= {total}</div>}
        </div>
      ),
      steps: [
        choice(
          { prompt: "Which do you simplify first?", hint: "Division ranks with multiplication, above addition — it's always done first.", explain: "Division ranks with multiplication, above addition — it's always done first, no matter which is written first." },
          `the division (${b} ÷ ${c})`,
          ["the addition"]
        ),
        { kind: "number", prompt: `What is ${b} ÷ ${c}?`, hint: "Division ranks with multiplication — it happens before addition.", explain: `${b} ÷ ${c} = ${q}.`, answer: q },
        { kind: "number", prompt: `Now what is ${a} + ${b} ÷ ${c}?`, hint: `You found ${b} ÷ ${c} = ${q}. Add ${a}.`, explain: `${a} + ${q} = ${total}.`, answer: total },
      ],
      wrapUp: `${a} + ${b} ÷ ${c} = ${a} + ${q} = ${total}.`,
    };
  }

  if (bucket === "mult-div-chain") {
    const b = randInt(2, 6);
    const m = randInt(2, 6);
    const a = b * m;
    const c = randInt(2, 9);
    const quotient = m;
    const total = quotient * c;
    return {
      title: "Same-rank operations: work left to right",
      bucket,
      story: `Evaluate ${a} ÷ ${b} × ${c}.`,
      visual: (done: number) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
          <div>
            {a} ÷ {b} × {c}
          </div>
          {done >= 2 && <div>{quotient} × {c}</div>}
          {done >= 3 && <div style={{ color: "var(--good)" }}>= {total}</div>}
        </div>
      ),
      steps: [
        choice(
          { prompt: "Division and multiplication rank equally, so work left to right. Which do you simplify first?", hint: "Whichever operation is written first (leftmost) happens first.", explain: `${a} ÷ ${b} is written first, so it's simplified first — not ${b} × ${c}, even though multiplication is named second in "PEMDAS."` },
          `${a} ÷ ${b}`,
          [`${b} × ${c}`]
        ),
        { kind: "number", prompt: `What is ${a} ÷ ${b}?`, hint: `${a} ÷ ${b} is written first, so it happens first.`, explain: `${a} ÷ ${b} = ${quotient}.`, answer: quotient },
        { kind: "number", prompt: `Now what is ${quotient} × ${c}?`, hint: `Multiply the quotient you just found by ${c}.`, explain: `${quotient} × ${c} = ${total}.`, answer: total },
        choice(
          { prompt: "Since division and multiplication are equal rank here, how do you decide which happens first?", hint: "Think about the order they're written in.", explain: "When operations are the same rank, work left to right through the expression — not always multiplication first." },
          "work left to right",
          ["always do multiplication first"]
        ),
      ],
      wrapUp: `${a} ÷ ${b} × ${c} = ${quotient} × ${c} = ${total}.`,
    };
  }

  // full-pemdas — parentheses, exponent, multiply, divide, AND subtract, all
  // in one expression: a × (b+c)² − d ÷ e.
  const a = randInt(2, 6);
  const b = randInt(2, 6);
  const c = randInt(2, 6);
  const sum = b + c;
  const sq = sum * sum;
  const product = a * sq;
  const e = randInt(2, 6);
  const k = randInt(2, 9);
  const d = e * k;
  const quotient = k;
  const total = product - quotient;
  return {
    title: "Putting it all together",
    bucket,
    story: (
      <>
        Evaluate {a} × ({b} + {c})<sup>2</sup> − {d} ÷ {e}.
      </>
    ),
    visual: (done: number) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
        <div>
          {a} × ({b} + {c})<sup>2</sup> − {d} ÷ {e}
        </div>
        {done >= 2 && <div>{a} × {sum}<sup>2</sup> − {d} ÷ {e}</div>}
        {done >= 4 && <div>{a} × {sq} − {d} ÷ {e}</div>}
        {done >= 6 && <div>{product} − {d} ÷ {e}</div>}
        {done >= 8 && <div>{product} − {quotient}</div>}
        {done >= 9 && <div style={{ color: "var(--good)" }}>= {total}</div>}
      </div>
    ),
    steps: [
      choice(
        { prompt: "What do you simplify first?", hint: "Parentheses always go first, before anything else in the expression.", explain: "Parentheses are always simplified first, no matter how far they sit from the start of the expression." },
        `the parentheses (${b} + ${c})`,
        ["the subtraction at the end"]
      ),
      { kind: "number", prompt: <>What is {b} + {c}?</>, hint: "Parentheses always go first, before exponents or anything else.", explain: `${b} + ${c} = ${sum}.`, answer: sum },
      choice(
        { prompt: "Now what's next?", hint: "The exponent applies to the whole parenthesized group — it outranks the multiplication outside it.", explain: <>The exponent is simplified next: ({sum})<sup>2</sup>, not {a} × {sum} — squaring the WHOLE group, before multiplying by {a}.</> },
        `square the result (${sum}²)`,
        [`multiply by ${a} first (${a} × ${sum})`]
      ),
      { kind: "number", prompt: <>What is {sum}<sup>2</sup>?</>, hint: `${sum}² = ${sum} × ${sum}.`, explain: `${sum}² = ${sq}.`, answer: sq },
      choice(
        { prompt: "Now what's next?", hint: `Multiplication outranks subtraction — and that ${d} still needs to be divided by ${e} before it can be subtracted anyway.`, explain: <>{a} × {sq} is next — multiplication outranks subtraction, and {d} can't be subtracted yet since it still needs to be divided by {e} first.</> },
        `${a} × ${sq}`,
        [`${sq} − ${d}`]
      ),
      { kind: "number", prompt: <>Now what is {a} × {sum}<sup>2</sup>?</>, hint: `Multiply ${a} by the ${sq} you just found.`, explain: `${a} × ${sq} = ${product}.`, answer: product },
      choice(
        { prompt: "Now what's next?", hint: "Division outranks subtraction.", explain: <>{d} ÷ {e} is next — division outranks subtraction, so {d} can't be subtracted from {product} until it's divided by {e} first.</> },
        `${d} ÷ ${e}`,
        [`${product} − ${d}`]
      ),
      { kind: "number", prompt: `What is ${d} ÷ ${e}?`, hint: "Division ranks with multiplication — it happens before the final subtraction.", explain: `${d} ÷ ${e} = ${quotient}.`, answer: quotient },
      { kind: "number", prompt: <>Finally, what is {product} − {quotient}?</>, hint: "Subtract the quotient from the product.", explain: `${product} − ${quotient} = ${total}.`, answer: total },
    ],
    wrapUp: (
      <>
        {a} × ({b} + {c})<sup>2</sup> − {d} ÷ {e} = {product} − {quotient} = {total}.
      </>
    ),
  };
}

function evaluatingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as EvaluateBucket | undefined) ?? EVALUATE_BUCKETS[randInt(0, EVALUATE_BUCKETS.length - 1)];

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
          {done >= 2 && <div>{term} + {b}</div>}
          {done >= 3 && <div style={{ color: "var(--good)" }}>= {total}</div>}
        </div>
      ),
      steps: [
        choice(
          { prompt: `After substituting x = ${x}, what's the next step?`, hint: "Multiplication outranks addition.", explain: `${a} × ${x} is next — multiplication always happens before addition, even though ${b} is written right next to it.` },
          `${a} × ${x}`,
          [`${x} + ${b}`]
        ),
        { kind: "number", prompt: `What is ${a} × ${x}?`, hint: `${a} × ${x}.`, explain: `${a}(${x}) = ${term}.`, answer: term },
        { kind: "number", prompt: `Now what is ${term} + ${b}?`, hint: `Add ${b} to the ${term} you just found.`, explain: `${term} + ${b} = ${total}.`, answer: total },
      ],
      wrapUp: `${a}x + ${b} at x = ${x} is ${total}.`,
    };
  }

  if (bucket === "sub-with-exponent") {
    // Deliberately PAIRED (same convention as WritingReadingExpressions'
    // word-to-expr-flip-multdiv bucket): ax² + b and (ax)² + b use the SAME
    // a, x, b, so a student can't treat "where do the parentheses go" as
    // cosmetic — grouping x alone vs. grouping ax under the exponent changes
    // which value actually gets squared, and therefore the final answer.
    const a = randInt(2, 5);
    const x = randInt(2, 6);
    const b = randInt(1, 15);
    const square = x * x;
    const term1 = a * square;
    const total1 = term1 + b;
    const inner = a * x;
    const sq2 = inner * inner;
    const total2 = sq2 + b;
    return {
      title: "Where you put the parentheses changes everything",
      bucket,
      story: (
        <>
          Compare {a}x<sup>2</sup> + {b} and ({a}x)<sup>2</sup> + {b}, both at x = {x}.
        </>
      ),
      visual: (done: number) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
          <div>
            {a}x<sup>2</sup> + {b}, x = {x}
          </div>
          {done >= 2 && <div>{a} × {square} + {b}</div>}
          {done >= 3 && <div>{term1} + {b}</div>}
          {done >= 4 && <div style={{ color: "var(--good)" }}>= {total1}</div>}
          <div style={{ marginTop: 8 }}>
            ({a}x)<sup>2</sup> + {b}, x = {x}
          </div>
          {done >= 6 && <div>({inner})<sup>2</sup> + {b}</div>}
          {done >= 7 && <div>{sq2} + {b}</div>}
          {done >= 8 && <div style={{ color: "var(--good)" }}>= {total2}</div>}
        </div>
      ),
      steps: [
        choice(
          { prompt: <>For {a}x<sup>2</sup> + {b}, what do you do first?</>, hint: `There are no parentheses grouping ${a} with x, so the exponent applies to x alone.`, explain: `The exponent applies to x alone here — simplify x² first, THEN multiply by ${a}. Multiplying ${a} in first would square the wrong thing.` },
          "simplify the exponent first",
          [`multiply ${a} in first`]
        ),
        { kind: "number", prompt: <>What is x<sup>2</sup> when x = {x}?</>, hint: `${x}² = ${x} × ${x}.`, explain: `${x}² = ${square}.`, answer: square },
        { kind: "number", prompt: `Now what is ${a} × ${square}?`, hint: `Multiply ${a} by the x² you just found.`, explain: `${a} × ${square} = ${term1}.`, answer: term1 },
        { kind: "number", prompt: `Finally, what is ${term1} + ${b}?`, hint: `Add ${b} to the ${term1} you just found.`, explain: `${term1} + ${b} = ${total1}.`, answer: total1 },
        choice(
          { prompt: <>Now for ({a}x)<sup>2</sup> + {b}, what do you do first?</>, hint: `The parentheses group ${a} with x, so the exponent applies to the WHOLE group (${a}x), not x alone.`, explain: `The parentheses group ${a}x together — multiply ${a} by x FIRST, then square the result. Squaring x alone would ignore what the parentheses are grouping.` },
          `multiply ${a} in first`,
          ["simplify the exponent first"]
        ),
        { kind: "number", prompt: `What is ${a} × ${x}?`, hint: `The parentheses group ${a}x together — simplify inside them first.`, explain: `${a} × ${x} = ${inner}.`, answer: inner },
        { kind: "number", prompt: <>Now what is ({inner})<sup>2</sup>?</>, hint: `${inner}² = ${inner} × ${inner}.`, explain: `${inner}² = ${sq2}.`, answer: sq2 },
        { kind: "number", prompt: `Finally, what is ${sq2} + ${b}?`, hint: `Add ${b} to the ${sq2} you just found.`, explain: `${sq2} + ${b} = ${total2}.`, answer: total2 },
        choice(
          {
            prompt: `Both expressions use the same numbers, but give different answers — ${total1} vs. ${total2}. Why?`,
            hint: "Think about which value actually got squared in each case.",
            explain: `Without parentheses, ${a}x² squares x alone, then multiplies by ${a}. With parentheses, (${a}x)² squares the product ${a}×${x} = ${inner}. Same numbers, different grouping, different answer.`,
          },
          "the parentheses change which value gets squared",
          ["one of the two answers must be a mistake"]
        ),
      ],
      wrapUp: (
        <>
          {a}x<sup>2</sup> + {b} = {total1}, but ({a}x)<sup>2</sup> + {b} = {total2} — the parentheses change which value gets squared.
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
            {done >= 2 && <div>6 × 1/4</div>}
          </div>
        ),
        steps: [
          choice(
            { prompt: "After substituting s = 1/2, what's the next step?", hint: "Exponents always outrank multiplication.", explain: "(1/2)² is next — the exponent is evaluated before multiplying by 6." },
            "(1/2)²",
            ["6 × 1/2"]
          ),
          { kind: "number", prompt: "What is s² when s = 1/2?", hint: "(1/2) × (1/2).", explain: "(1/2)² = 1/4.", answer: 0.25, frac: true, fracAnswer: [1, 4] },
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
          {done >= 2 && <div>6 × {square}</div>}
        </div>
      ),
      steps: [
        choice(
          { prompt: `After substituting s = ${s}, what's the next step?`, hint: "Exponents always outrank multiplication.", explain: `${s}² is next — the exponent is evaluated before multiplying by 6.` },
          `${s}²`,
          [`6 × ${s}`]
        ),
        { kind: "number", prompt: `What is s² when s = ${s}?`, hint: `${s} × ${s}.`, explain: `${s}² = ${square}.`, answer: square },
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
      <p>
        Substitute the given value(s) for every variable first, then follow the full order of operations: parentheses first, then exponents,
        then multiplication/division (left to right), then addition/subtraction (left to right).
      </p>
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
  // Two subsections (plus the automatic "Mixed" tab) so a student gets real
  // repetition on pure-numeric PEMDAS before mixing in variable substitution.
  problems: [
    { label: "Simplifying Expressions", make: simplifyingProblem, buckets: SIMPLIFY_BUCKETS },
    { label: "Evaluating Expressions", make: evaluatingProblem, buckets: EVALUATE_BUCKETS },
  ],
  requiredBuckets: [...SIMPLIFY_BUCKETS, ...EVALUATE_BUCKETS],
  test: evaluatingExpressionsTest,
};
