import { useEffect, useState, type CSSProperties } from "react";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { writingReadingExpressionsTest } from "./WritingReadingExpressionsTest";

const NAMES = ["y", "n", "m", "k"] as const;
const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1: vocabulary — coefficient vs. term, read off a real expression. */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const EXPR = "3x+7";
  const [coefPick, setCoefPick] = useState("");
  const [termPick, setTermPick] = useState("");
  const [checked, setChecked] = useState(false);
  const coefOk = coefPick === "3";
  const termOk = termPick === "7";
  const ok = coefOk && termOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> In the expression {EXPR}:
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          The coefficient of x is:{" "}
          <select className="answer" value={coefPick} onChange={(e) => setCoefPick(e.target.value)} style={fieldStyle(coefOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3">3</option>
            <option value="x">x</option>
            <option value="7">7</option>
          </select>
        </label>
        <label>
          A term with no variable is:{" "}
          <select className="answer" value={termPick} onChange={(e) => setTermPick(e.target.value)} style={fieldStyle(termOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3x">3x</option>
            <option value="7">7</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the coefficient (3) is the number multiplying the variable, and 7 is a term on its own (a constant term, with no variable attached)."
            : "Not quite — the coefficient multiplies the variable; a term is one of the parts separated by + or −."}
        </p>
      )}
    </div>
  );
}

/** Q2: the load-bearing trap — order-flipping "subtract ... from ..." language. */
function SubtractFromTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [exprPick, setExprPick] = useState("");
  const [rulePick, setRulePick] = useState("");
  const [checked, setChecked] = useState(false);
  const exprOk = exprPick === "5-y";
  const ruleOk = rulePick === "B - A";
  const ok = exprOk && ruleOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Which expression represents "subtract y from 5"?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={exprPick} onChange={(e) => setExprPick(e.target.value)} style={fieldStyle(exprOk, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="5-y">5 − y</option>
          <option value="y-5">y − 5</option>
        </select>
      </div>
      <p>
        In general, "subtract A from B" means...
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={rulePick} onChange={(e) => setRulePick(e.target.value)} style={fieldStyle(ruleOk, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="A - B">A − B</option>
          <option value="B - A">B − A</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — \"subtract A from B\" always means B − A. The number you start FROM comes first, even though \"A\" is named first in the sentence."
            : "Not quite — \"subtract y from 5\" starts at 5 and takes away y: 5 − y, not y − 5. The word order and the math order don't match here."}
        </p>
      )}
    </div>
  );
}

/** Q3: generalization/true-false trap, built on the same order-flip idea. */
function OrderMattersTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "False";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: "x minus 5" and "5 minus x" always represent the same value.
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
            ? "Correct — False. x − 5 and 5 − x give opposite values (unless x = 5 exactly) — subtraction isn't commutative, so order really matters."
            : "Not quite — try x = 8: x − 5 = 3, but 5 − x = −3. Those aren't the same, so order matters in subtraction."}
        </p>
      )}
    </div>
  );
}

/** Q4: the parenthesized-group-as-both-a-sum-and-a-factor idea. */
function ParenDualQuestion({ onComplete }: { onComplete?: () => void }) {
  const [sumPick, setSumPick] = useState("");
  const [wholePick, setWholePick] = useState("");
  const [checked, setChecked] = useState(false);
  const sumOk = sumPick === "a sum";
  const wholeOk = wholePick === "a product";
  const ok = sumOk && wholeOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Look at 2(8+7).
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          (8+7) by itself is:{" "}
          <select className="answer" value={sumPick} onChange={(e) => setSumPick(e.target.value)} style={fieldStyle(sumOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="a sum">a sum of two terms</option>
            <option value="a product">a product of two factors</option>
          </select>
        </label>
        <label>
          The whole expression 2(8+7) is:{" "}
          <select className="answer" value={wholePick} onChange={(e) => setWholePick(e.target.value)} style={fieldStyle(wholeOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="a sum">a sum of two terms</option>
            <option value="a product">a product of two factors</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — (8+7) is a sum of two terms (8 and 7), but once you multiply it by 2, the WHOLE expression 2(8+7) is a product of two factors: 2 and (8+7). A parenthesized group can be both at once, depending on what you're looking at."
            : "Not quite — look INSIDE the parentheses first (8 and 7 are added — a sum), then at the WHOLE expression (2 times that sum — a product)."}
        </p>
      )}
    </div>
  );
}

function WritingReadingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, subtractFrom: false, orderMatters: false, parenDual: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's connect a few ideas before you try practice problems.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <SubtractFromTrapQuestion onComplete={mark("subtractFrom")} />
      <OrderMattersTrapQuestion onComplete={mark("orderMatters")} />
      <ParenDualQuestion onComplete={mark("parenDual")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

type Mode = "wordToExpr" | "parts";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<Mode>("wordToExpr");
  const [n, setN] = useState(5);
  const v = "y";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="Explore mode"
          value={mode}
          onChange={setMode}
          options={[
            { id: "wordToExpr", label: "Words → Expression" },
            { id: "parts", label: "Parts of an Expression" },
          ]}
        />
        {!introActive && (
          <button
            type="button"
            className="btn ghost"
            style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined}
            onClick={() => setShowCheck((v2) => !v2)}
          >
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <WritingReadingCheckForUnderstanding onComplete={onIntroDone} />}

      {mode === "wordToExpr" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="control-row">
            <label className="stepper">
              <span className="stepper-label">Number</span>
              <input
                className="answer"
                style={{ width: 70 }}
                type="number"
                value={n}
                onChange={(e) => setN(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              />
            </label>
          </div>
          <div style={{ display: "grid", gap: 8, fontSize: 17 }}>
            <div>
              "{n} more than {v}" → <b>{v} + {n}</b>
            </div>
            <div>
              "subtract {v} from {n}" → <b>{n} − {v}</b> (NOT {v} − {n} — the order flips!)
            </div>
            <div>
              "{n} divided into {v}" → <b>{v} / {n}</b>
            </div>
          </div>
          <p className="muted small">
            Change the number and watch how each phrase translates. Notice "subtract ___ from ___" and "___ divided into ___" don't follow the
            same left-to-right order the words are spoken in — the thing you START from always comes first in the expression.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 26, fontWeight: 700, display: "flex", gap: 4, alignItems: "baseline" }}>
            <span style={{ color: "var(--qa-text)" }}>{n}</span>
            <span>{v}</span>
            <span>+</span>
            <span style={{ color: "var(--qb-text)" }}>7</span>
          </div>
          <div style={{ display: "grid", gap: 6, fontSize: 15 }}>
            <div>
              <span style={{ color: "var(--qa-text)", fontWeight: 700 }}>{n}</span> is the <b>coefficient</b> of {v}.
            </div>
            <div>
              <span style={{ color: "var(--qa-text)", fontWeight: 700 }}>{n}{v}</span> and <span style={{ color: "var(--qb-text)", fontWeight: 700 }}>7</span> are each a <b>term</b>.
            </div>
            <div>
              The whole expression <b>{n}{v} + 7</b> is a <b>sum</b> of those two terms.
            </div>
          </div>
          <p className="muted small">
            A factor is anything multiplied together inside a term — in {n}{v}, {n} and {v} are both factors of that term. Change the number
            above and see that the coefficient always updates, but the vocabulary names stay the same.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — writing & reading expressions
// ============================================================================

type Bucket = "word-to-expr-straight" | "word-to-expr-flip" | "expr-to-word" | "identify-parts" | "paren-dual";
const BUCKETS: Bucket[] = ["word-to-expr-straight", "word-to-expr-flip", "expr-to-word", "identify-parts", "paren-dual"];

function writingReadingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  const v = pick(NAMES);

  if (bucket === "word-to-expr-straight") {
    const n = randInt(2, 15);
    const templates = [
      { phrase: `${n} more than ${v}`, correct: `${v}+${n}`, trap: `${n}-${v}` },
      { phrase: `${v} increased by ${n}`, correct: `${v}+${n}`, trap: `${n}-${v}` },
      { phrase: `the product of ${n} and ${v}`, correct: `${n}${v}`, trap: `${v}/${n}` },
    ];
    const t = pick(templates);
    return {
      title: "Words to an expression",
      bucket,
      story: `Write "${t.phrase}" as an algebraic expression.`,
      visual: () => (
        <div style={{ fontSize: 20, textAlign: "center" }}>
          <p className="muted small">"{t.phrase}"</p>
        </div>
      ),
      steps: [
        choice(
          { prompt: `Which expression represents "${t.phrase}"?`, hint: "Read it left to right exactly as written — nothing here reverses the order.", explain: `"${t.phrase}" = ${t.correct}.` },
          t.correct,
          [t.trap]
        ),
        choice(
          { prompt: "Does this phrase change the order of the two numbers, or keep it the same?", hint: "Compare the order in the words to the order in the expression you just picked.", explain: "This one keeps the same order — no flip needed." },
          "keeps the same order",
          ["flips the order"]
        ),
      ],
      wrapUp: `"${t.phrase}" = ${t.correct}.`,
    };
  }

  if (bucket === "word-to-expr-flip") {
    const n = randInt(2, 15);
    const kind = Math.random() < 0.5 ? "subtractFrom" : "dividedInto";
    if (kind === "subtractFrom") {
      const correct = `${n}-${v}`;
      const trap = `${v}-${n}`;
      return {
        title: "Words to an expression — watch the order",
        bucket,
        story: `Write "subtract ${v} from ${n}" as an algebraic expression.`,
        visual: () => <p className="muted small">"subtract {v} from {n}"</p>,
        steps: [
          choice(
            { prompt: `Which expression represents "subtract ${v} from ${n}"?`, hint: `"Subtract A from B" means B − A — the starting amount (${n}) comes first.`, explain: `"Subtract ${v} from ${n}" means start at ${n} and take away ${v}: ${correct}.` },
            correct,
            [trap]
          ),
          choice(
            { prompt: `In general, "subtract A from B" means...`, hint: "Which letter comes first in the math, even though the OTHER letter is named first in the sentence?", explain: "\"Subtract A from B\" always means B − A." },
            "B − A",
            ["A − B"]
          ),
        ],
        wrapUp: `"subtract ${v} from ${n}" = ${correct}.`,
      };
    }
    const correct = `${v}/${n}`;
    const trap = `${n}/${v}`;
    return {
      title: "Words to an expression — watch the order",
      bucket,
      story: `Write "${n} divided into ${v}" as an algebraic expression.`,
      visual: () => <p className="muted small">"{n} divided into {v}"</p>,
      steps: [
        choice(
          { prompt: `Which expression represents "${n} divided into ${v}"?`, hint: `"A divided into B" means B ÷ A — the amount being split (${v}) comes first.`, explain: `"${n} divided into ${v}" means ${v} split into groups of size ${n}: ${correct}.` },
          correct,
          [trap]
        ),
        choice(
          { prompt: `In general, "A divided into B" means...`, hint: "Which letter is the one being split up?", explain: "\"A divided into B\" always means B ÷ A." },
          "B ÷ A",
          ["A ÷ B"]
        ),
      ],
      wrapUp: `"${n} divided into ${v}" = ${correct}.`,
    };
  }

  if (bucket === "expr-to-word") {
    const n = randInt(2, 15);
    const kinds = [
      { expr: `${v}-${n}`, correct: `${n} less than ${v}`, trap: `${v} less than ${n}` },
      { expr: `${n}-${v}`, correct: `${v} subtracted from ${n}`, trap: `${n} subtracted from ${v}` },
      { expr: `${n}${v}`, correct: `${n} times ${v}`, trap: `${v} divided by ${n}` },
    ];
    const t = pick(kinds);
    return {
      title: "Reading an expression in words",
      bucket,
      story: `Read the expression ${t.expr} aloud as a phrase.`,
      visual: () => <div style={{ fontSize: 26, fontWeight: 700, textAlign: "center" }}>{t.expr}</div>,
      steps: [
        choice(
          { prompt: `Which phrase matches the expression ${t.expr}?`, hint: "Say the expression out loud, in the order the operation actually happens.", explain: `${t.expr} reads as "${t.correct}".` },
          t.correct,
          [t.trap]
        ),
      ],
      wrapUp: `${t.expr} reads as "${t.correct}".`,
    };
  }

  if (bucket === "identify-parts") {
    const a = randInt(2, 9);
    const b = randInt(2, 15);
    const expr = `${a}${v}+${b}`;
    return {
      title: "Parts of an expression",
      bucket,
      story: `Look at the expression ${expr}.`,
      visual: () => (
        <div style={{ fontSize: 26, fontWeight: 700, textAlign: "center", display: "flex", gap: 4, justifyContent: "center" }}>
          <span style={{ color: "var(--qa-text)" }}>{a}</span>
          <span>{v}</span>
          <span>+</span>
          <span style={{ color: "var(--qb-text)" }}>{b}</span>
        </div>
      ),
      steps: [
        { kind: "number", prompt: `What is the coefficient of ${v} in ${expr}?`, hint: "The coefficient is the number multiplying the variable.", explain: `The coefficient of ${v} is ${a}.`, answer: a },
        choice(
          { prompt: `How many terms does ${expr} have?`, hint: `Terms are separated by + or − signs. Count the parts of ${expr}.`, explain: `${expr} has two terms: ${a}${v} and ${b}.` },
          "2",
          ["1", "3"]
        ),
        choice(
          { prompt: `What is ${b} called, relative to the whole expression?`, hint: "It's one of the two parts being added together.", explain: `${b} is a term of ${expr} — the term with no variable (a constant term).` },
          "a term",
          ["a factor", "a coefficient"]
        ),
      ],
      wrapUp: `${expr}: coefficient of ${v} is ${a}, and the expression has 2 terms (${a}${v} and ${b}).`,
    };
  }

  // paren-dual
  const a = randInt(2, 9);
  const b = randInt(2, 12);
  const c = randInt(2, 12);
  return {
    title: "A parenthesized group — sum AND factor",
    bucket,
    story: `Look at ${a}(${b}+${c}).`,
    visual: (done: number) => (
      <div style={{ fontSize: 24, fontWeight: 700, textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          {a}({b}+{c})
        </div>
        {done >= 1 && <div className="muted small">({b}+{c}) is a sum of two terms</div>}
        {done >= 2 && <div className="muted small">{a}({b}+{c}) is a product of two factors</div>}
      </div>
    ),
    steps: [
      choice(
        { prompt: `In ${a}(${b}+${c}), what is (${b}+${c}) best described as?`, hint: `${b} and ${c} are being added inside the parentheses.`, explain: `(${b}+${c}) is a sum of two terms, ${b} and ${c}.` },
        "a sum of two terms",
        ["a product of two factors", "a single term"]
      ),
      choice(
        { prompt: `Now what is the WHOLE expression ${a}(${b}+${c}) best described as?`, hint: `You're multiplying ${a} by the whole sum (${b}+${c}).`, explain: `${a}(${b}+${c}) is a product of two factors: ${a} and (${b}+${c}).` },
        "a product of two factors",
        ["a sum of two terms", "a single factor"]
      ),
    ],
    wrapUp: `(${b}+${c}) is a sum, but the whole expression ${a}(${b}+${c}) is a product of ${a} and (${b}+${c}).`,
  };
}

export const writingReadingExpressions: Unit = {
  id: "writingReadingExpressions",
  title: "Writing & Reading Expressions",
  goal: "Translate between words and algebraic expressions, and name the parts of an expression — sum, term, product, factor, quotient, coefficient.",
  standard: "6.EE.2a, 6.EE.2b",
  keyIdea: (
    <>
      <p>
        Most word phrases translate left to right, but "subtract A from B" and "A divided into B" FLIP the order: both mean B − A and B ÷ A.
      </p>
      <p>A parenthesized group can be a sum of terms by itself, while the whole expression around it is a product of factors.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // This unit's vocabulary (term/factor/coefficient/product/quotient, and the
  // order-flip rule) is meant to be memorized long-term, not just proven
  // usable once — so the guided Check for Understanding periodically
  // re-surfaces, same convention as MM1_RatioLab's Conversion unit.
  reintroEverySolved: 20,
  problems: [{ label: "Writing & Reading", make: writingReadingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: writingReadingExpressionsTest,
};
