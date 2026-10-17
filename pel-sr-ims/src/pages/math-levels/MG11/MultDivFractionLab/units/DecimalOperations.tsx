import { useEffect, useState, type CSSProperties } from "react";
import { DivisionLadder, PlaceValueColumns, computeLongDivision } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem, type Step } from "../../../shared/engine/types";
import { QA, QB, Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { decimalOperationsTest } from "./DecimalOperationsTest";

const round2 = (n: number) => Math.round(n * 100) / 100;
const randMoney2 = (min: number, max: number) => randInt(min * 100, max * 100) / 100; // 2 decimal places
const randMoney1 = (min: number, max: number) => randInt(min * 10, max * 10) / 10; // 1 decimal place
const decimalPlaces = (n: number) => (String(n).split(".")[1] ?? "").length;

/** Shared with LongDivision.tsx's own copy — small and self-contained per this
 *  package's own units, same convention MM1 uses for its unit-local helpers. */
function cycleSteps(dividend: number, divisor: number): Step[] {
  const { cycles } = computeLongDivision(dividend, divisor);
  return cycles.map((c, i) => ({
    kind: "ratio",
    tones: "none",
    labels: ["digit", "remainder so far"],
    frame: ["", "R", ""],
    prompt: i === 0 ? "What's the first digit of the quotient, and the remainder after this step?" : "Bring down the next digit. What's the next quotient digit, and the remainder after this step?",
    hint: `${c.current} ÷ ${divisor} — how many times does ${divisor} go into ${c.current}?`,
    explain: `${divisor} × ${c.qDigit} = ${c.product}, and ${c.current} − ${c.product} = ${c.remainder}.`,
    answer: [c.qDigit, c.remainder],
  }));
}

// ============================================================================
// EXPLORE
// ============================================================================

type Op = "add" | "subtract" | "multiply" | "divide";

/** Pads a decimal to `places` digits after the point with trailing zeros
 *  (own small copy — PlaceValueColumns.tsx's version is diagram-internal). */
const padToPlaces = (n: number, places: number): string => {
  const [whole, frac = ""] = String(n).split(".");
  return `${whole}.${frac.padEnd(places, "0")}`;
};

// Deliberately a bigger decimal-place gap (1 vs 3) than the toggle's default
// 23.4/8.15 pair below, so the "add placeholder zeros" step is unmissable —
// one zero wouldn't make the equivalent-value point ("18.1 = 18.100") land.
const ALIGN_TOP = 18.1;
const ALIGN_BOTTOM = 5.027;

/**
 * A small standalone example (a different number pair than the drill's own
 * 18.1/5.027, so a student sees the idea apply twice, not just once) showing
 * what "placeholder zero" actually means: 2.5 and 2.50 side by side, with the
 * added zero called out, so the drill's own fill-in question isn't the first
 * time the term appears.
 */
function PlaceholderZeroExample() {
  return (
    <div className="placeholder-zero-example" role="img" aria-label="2.5 equals 2.50 — the extra zero is a placeholder and doesn't change the value">
      <div className="pz-equation">
        <span className="pz-value">2.5</span>
        <span className="pz-eq">=</span>
        <span className="pz-value-group">
          <span className="pz-value">2.5</span>
          <span className="pz-zero-wrap">
            <span className="pz-zero">0</span>
            <span className="pz-zero-caption">placeholder</span>
          </span>
        </span>
      </div>
      <p className="pz-caption">Same value — the extra zero doesn't add anything, it just fills the empty place.</p>
    </div>
  );
}

/**
 * A required warm-up before the free-play sandbox below: students must
 * explicitly name each number's decimal-place count, then rewrite the
 * shorter one with placeholder zeros, before the aligned-columns diagram
 * reveals — rather than just reading the four numbered steps and nodding
 * along, the way the plain-text explainer this unit used to open with let
 * them do.
 */
function AlignDecimalsDrill({
  operation,
  onComplete,
  prefilled,
}: {
  operation: "add" | "subtract";
  onComplete?: () => void;
  /** Reviewing a drill the student already passed — open straight to the
   *  fully-correct, fully-checked state instead of making them redo the
   *  typing to see what they already proved they can do. */
  prefilled?: boolean;
}) {
  const topPlaces = decimalPlaces(ALIGN_TOP);
  const bottomPlaces = decimalPlaces(ALIGN_BOTTOM);
  const places = Math.max(topPlaces, bottomPlaces);
  const paddedTop = padToPlaces(ALIGN_TOP, places);
  const paddedBottom = padToPlaces(ALIGN_BOTTOM, places);
  const width = Math.max(paddedTop.length, paddedBottom.length) + 1; // matches PlaceValueColumns' own column math
  const opWord = operation === "add" ? "add" : "subtract";
  const opSign = operation === "add" ? "+" : "−";

  const [a1, setA1] = useState(prefilled ? String(topPlaces) : "");
  const [a2, setA2] = useState(prefilled ? String(bottomPlaces) : "");
  const [a3, setA3] = useState(prefilled ? paddedTop : "");
  const [checked, setChecked] = useState(!!prefilled);

  const ok1 = Number(a1) === topPlaces;
  const ok2 = Number(a2) === bottomPlaces;
  const ok3 = a3.trim() === paddedTop;
  const allOk = ok1 && ok2 && ok3;

  // Stage 2: once the concepts above check out, have the student rebuild the
  // aligned columns themselves, one digit box per place value — not one text
  // box per number — so lining up the decimal points is something they do by
  // placing each digit in its column, the same structure PlaceValueColumns
  // itself renders, rather than something they can get right by luck typing
  // a whole string. Non-digit positions (the leading blank and the decimal
  // point) are fixed spacers, not inputs — only the actual digits are typed.
  const topStr = paddedTop.padStart(width, " "); // e.g. " 18.100" — 5 digit boxes
  const bottomStr = paddedBottom.padStart(width - 1, " "); // e.g. " 5.027" — 4 digit boxes
  const digitsOf = (str: string) => str.split("").map((ch) => (ch === " " || ch === "." ? "" : ch));
  const [topVals, setTopVals] = useState<string[]>(() => (prefilled ? digitsOf(topStr) : Array(topStr.length).fill("")));
  const [bottomVals, setBottomVals] = useState<string[]>(() => (prefilled ? digitsOf(bottomStr) : Array(bottomStr.length).fill("")));
  const [checked2, setChecked2] = useState(!!prefilled);
  const slotOk = (str: string, vals: string[], i: number) => str[i] === " " || str[i] === "." || vals[i] === str[i];
  const allOk2 = topStr.split("").every((_, i) => slotOk(topStr, topVals, i)) && bottomStr.split("").every((_, i) => slotOk(bottomStr, bottomVals, i));

  // Stage 3: once the columns are built correctly, combine them.
  const sumValue = operation === "add" ? ALIGN_TOP + ALIGN_BOTTOM : ALIGN_TOP - ALIGN_BOTTOM;
  const sumTarget = padToPlaces(Math.round(sumValue * 1e6) / 1e6, places);
  const [sumInput, setSumInput] = useState(prefilled ? sumTarget : "");
  const [checked3, setChecked3] = useState(!!prefilled);
  const sumOk = sumInput.trim() === sumTarget;

  useEffect(() => {
    if (checked3 && sumOk) onComplete?.();
  }, [checked3, sumOk, onComplete]);

  const fieldStyle = (ok: boolean, isChecked: boolean): CSSProperties => (isChecked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

  const renderSlots = (str: string, vals: string[], setVals: (next: string[]) => void) =>
    str.split("").map((ch, i) => {
      if (ch === " ") return <span key={i} className="align-slot align-slot-static" />;
      if (ch === ".") return (
        <span key={i} className="align-slot align-slot-static">
          .
        </span>
      );
      const ok = vals[i] === ch;
      return (
        <input
          key={i}
          className="align-slot align-slot-input"
          inputMode="numeric"
          maxLength={1}
          autoComplete="off"
          aria-label={`digit, place ${i}`}
          value={vals[i]}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9]/g, "").slice(-1);
            const next = [...vals];
            next[i] = v;
            setVals(next);
          }}
          style={checked2 ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : undefined}
        />
      );
    });

  return (
    <div className="align-drill">
      <div className="align-drill-top">
        <div className="align-drill-text">
          <p className="intro-gate-title">Before lining anything up, notice a few key details about these two numbers:</p>
          <p>
            <b>{ALIGN_TOP}</b> and <b>{ALIGN_BOTTOM}</b>
          </p>
          <div className="controls">
            <div className="control-row">
              <label>
                Digits after the decimal point in {ALIGN_TOP}?{" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 50, ...fieldStyle(ok1, checked) }} value={a1} onChange={(e) => setA1(e.target.value)} />
              </label>
            </div>
            <div className="control-row">
              <label>
                Digits after the decimal point in {ALIGN_BOTTOM}?{" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 50, ...fieldStyle(ok2, checked) }} value={a2} onChange={(e) => setA2(e.target.value)} />
              </label>
            </div>
            <div className="control-row">
              <label>
                {ALIGN_BOTTOM} has more decimal places. Rewrite {ALIGN_TOP} with the same number of decimal places, using placeholder zeros:{" "}
                <input className="answer" autoComplete="off" style={{ width: 90, ...fieldStyle(ok3, checked) }} value={a3} onChange={(e) => setA3(e.target.value)} />
              </label>
            </div>
          </div>
        </div>
        <PlaceholderZeroExample />
      </div>
      <button className="btn primary" onClick={() => setChecked(true)}>
        Check my work
      </button>
      {checked && (
        <p className={`feedback ${allOk ? "good" : "bad"}`} role="alert">
          {allOk
            ? `Exactly — ${paddedTop} is equivalent to ${ALIGN_TOP}; placeholder zeros never change a number's value. Now build the lined-up columns yourself, one digit at a time:`
            : "Not quite yet — check each answer above against the two numbers."}
        </p>
      )}
      {checked && allOk && (
        <div className="align-stack-wrap">
          <div className="align-columns">
            <div className="align-row">{renderSlots(topStr, topVals, setTopVals)}</div>
            <div className="align-row">
              <span className="align-slot align-slot-sign">{opSign}</span>
              {renderSlots(bottomStr, bottomVals, setBottomVals)}
            </div>
            <div className="align-rule" style={{ width: `${width}em` }} />
          </div>
          <button className="btn primary" onClick={() => setChecked2(true)}>
            Check my setup
          </button>
          {checked2 && (
            <p className={`feedback ${allOk2 ? "good" : "bad"}`} role="alert">
              {allOk2 ? `Lined up perfectly — every digit is in the right place-value column. Now ${opWord} them:` : "Not quite — check that every digit sits in the same column as the matching place value above it."}
            </p>
          )}
        </div>
      )}
      {checked2 && allOk2 && (
        <div className="align-stack-wrap">
          <label>
            {ALIGN_TOP} {opSign} {ALIGN_BOTTOM} ={" "}
            <input
              className="answer"
              autoComplete="off"
              style={{ width: 90, ...fieldStyle(sumOk, checked3) }}
              value={sumInput}
              onChange={(e) => setSumInput(e.target.value)}
            />
          </label>
          <button className="btn primary" style={{ marginLeft: 14 }} onClick={() => setChecked3(true)}>
            Check my answer
          </button>
          {checked3 && (
            <p className={`feedback ${sumOk ? "good" : "bad"}`} role="alert">
              {sumOk ? `Correct — ${sumTarget}.` : `Not quite — ${opWord} column by column, ${operation === "add" ? "carrying when a column totals 10 or more" : "borrowing from the next column when you need to"}.`}
            </p>
          )}
        </div>
      )}
      {checked3 && sumOk && <PlaceValueColumns operation={operation} top={ALIGN_TOP} bottom={ALIGN_BOTTOM} done={1} />}
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  // Once the gate is already satisfied, the drill is optional — hidden by
  // default so a returning student isn't forced through it again, but still
  // reachable with one click for review. While the gate IS active it stays
  // mandatory, so this toggle is irrelevant (and hidden) in that case.
  const [showDrill, setShowDrill] = useState(false);
  const [op, setOp] = useState<Op>("add");
  // Text state, not number: binding the input's `value` straight to a number
  // forces every keystroke through Number(...) and back, which silently drops
  // an in-progress trailing "." (typing "23." becomes "23" the instant you type
  // the dot, and a 4th keystroke lands on "236" instead of "23.6"). Keeping the
  // raw text lets the field hold whatever's actually been typed, while `top`/
  // `bottom` below parse it for the diagram to consume.
  const [topText, setTopText] = useState("23.4");
  const [bottomText, setBottomText] = useState("8.15");
  const top = parseFloat(topText) || 0;
  const bottom = parseFloat(bottomText) || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Segmented
        label="Operation"
        value={op}
        onChange={setOp}
        options={[
          { id: "add", label: "Add" },
          { id: "subtract", label: "Subtract" },
          { id: "multiply", label: "Multiply" },
          { id: "divide", label: "Divide" },
        ]}
      />
      {!introActive && (op === "add" || op === "subtract") && (
        <button className="btn ghost" style={{ width: "fit-content" }} onClick={() => setShowDrill((v) => !v)}>
          {showDrill ? "Hide the lining-up drill" : "Show the lining-up drill"}
        </button>
      )}
      {/* Mandatory (and always shown) when the parent says the gate is
          currently due — first visit, or every reintroEverySolved problems
          after that; see Unit.requiresIntro on the decimalOperations export.
          Once satisfied, it's optional — shown only if the student opened it
          with the toggle above. key={op} forces a full remount (not just a
          prop update) when switching between Add and Subtract, so every
          stage of the drill — which digits are typed, how far the student
          has progressed — resets instead of carrying over a now-irrelevant
          addition answer into subtraction. */}
      {(introActive || showDrill) && (op === "add" || op === "subtract") && (
        <AlignDecimalsDrill key={op} operation={op} onComplete={onIntroDone} prefilled={!introActive} />
      )}
      {op === "divide" ? (
        <DivisionLadder dividend={Math.round(top * 10)} divisor={Math.round(bottom * 10)} done={99} />
      ) : (
        <PlaceValueColumns operation={op} top={top} bottom={bottom} done={1} />
      )}
      <p className="muted small">
        Try editing the two decimal numbers below to see how {op === "divide" ? "shifting the decimal point" : "lining up the decimal point"} changes the layout.
      </p>
      <div className="controls">
        <label>
          First number{" "}
          <input className="answer" style={{ width: 80 }} value={topText} onChange={(e) => setTopText(e.target.value)} />
        </label>
        <label>
          Second number{" "}
          <input className="answer" style={{ width: 80 }} value={bottomText} onChange={(e) => setBottomText(e.target.value)} />
        </label>
      </div>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — addition
// ============================================================================

function addProblem(): Problem {
  // Sometimes a and b already share a decimal-place count (no padding
  // needed) and sometimes they don't — weighted toward "needed" since that's
  // the main teaching point, but the "No" case still shows up regularly so
  // the determination question has a genuine two-way answer, not just "Yes"
  // every time.
  const needsPad = randInt(1, 10) <= 7;
  const a = randMoney2(1, 60); // 2 decimal places
  const b = needsPad ? randMoney1(1, 25) : randMoney2(1, 25); // 1 or 2 decimal places
  const sum = round2(a + b);

  const aPlaces = decimalPlaces(a);
  const bPlaces = decimalPlaces(b);
  const places = Math.max(aPlaces, bPlaces);
  const needsPlaceholder = aPlaces !== bPlaces;
  const shorterIsA = aPlaces < bPlaces;
  const shorterVal = shorterIsA ? a : b;
  const pluralPlaces = (n: number) => `${n} decimal place${n === 1 ? "" : "s"}`;

  // Step: does this pair actually need placeholder zeros? Answer varies with
  // needsPlaceholder, so this is a real determination, not a rhetorical one.
  const padChoiceStep = choice(
    {
      prompt: (
        <>
          Do <QA>{a}</QA> and <QB>{b}</QB> need placeholder zeros before you can line up their decimal points?
        </>
      ),
      hint: `Count the digits after the decimal point in each number — ${a} has ${pluralPlaces(aPlaces)}, and ${b} has ${pluralPlaces(bPlaces)}.`,
      explain: needsPlaceholder
        ? `${a} has ${pluralPlaces(aPlaces)} and ${b} has ${pluralPlaces(bPlaces)} — since they're different, the shorter number needs placeholder zeros.`
        : `${a} and ${b} already both have ${pluralPlaces(aPlaces)} — no placeholder zeros needed.`,
    },
    needsPlaceholder ? "Yes — they have different numbers of decimal places" : "No — they already have the same number of decimal places",
    [needsPlaceholder ? "No — they already have the same number of decimal places" : "Yes — they have different numbers of decimal places"]
  );

  // Step: only included when actually needed — write the shorter number
  // padded out to match, with padTo enforcing the exact zero count (not just
  // the right value) so "8.15" doesn't pass for a target of "8.150".
  const padWriteStep: Step = {
    kind: "number",
    padTo: places,
    prompt: shorterIsA ? (
      <>
        Rewrite <QA>{a}</QA> with the same number of decimal places as <QB>{b}</QB>, using placeholder zeros.
      </>
    ) : (
      <>
        Rewrite <QB>{b}</QB> with the same number of decimal places as <QA>{a}</QA>, using placeholder zeros.
      </>
    ),
    hint: `${shorterVal} has ${pluralPlaces(Math.min(aPlaces, bPlaces))}. Add zeros after its last digit until it has ${pluralPlaces(places)}.`,
    explain: `${shorterVal} = ${padToPlaces(shorterVal, places)} — adding zeros after the last digit doesn't change its value.`,
    answer: shorterVal,
  };

  // The lined-up diagram (and, further, the sum within it) stays hidden
  // until the student has actually worked out the padding for themselves —
  // showing it earlier would just hand them the answer to the question
  // above instead of letting them reason it out.
  const revealAt = needsPlaceholder ? 3 : 2; // step index the diagram appears at
  const sumAt = needsPlaceholder ? 4 : 3; // step index the sum within it appears at

  return {
    title: "Adding decimals",
    story: `Add ${a} + ${b}.`,
    visual: (done: number) =>
      done < revealAt ? (
        <p className="muted small">Work out whether placeholder zeros are needed first — the lined-up numbers will appear here once you do.</p>
      ) : (
        <PlaceValueColumns operation="add" top={a} bottom={b} done={done >= sumAt ? 1 : 0} />
      ),
    steps: [
      choice(
        { prompt: "To add decimals using the standard algorithm, what must you do first?", hint: "Think about why you can't just add digit-by-digit from the right without this step.", explain: "Lining up the decimal points lines up each place value (ones with ones, tenths with tenths, and so on)." },
        "Line up the decimal points",
        ["Line up the digits on the right, ignoring the decimal point", "Round both numbers to whole numbers first"]
      ),
      padChoiceStep,
      ...(needsPlaceholder ? [padWriteStep] : []),
      {
        kind: "number",
        prompt: `What is ${a} + ${b}?`,
        hint: "Add each column, carrying when a column totals 10 or more — just like whole-number addition.",
        explain: `${a} + ${b} = ${sum}.`,
        answer: sum,
      },
    ],
    wrapUp: `${a} + ${b} = ${sum}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — subtraction
// ============================================================================

function subtractProblem(): Problem {
  // Same reasoning as addProblem: sometimes a and b already share a decimal-
  // place count, sometimes they don't, so "do these need placeholder zeros?"
  // has a genuine two-way answer. b must still land below a (this unit
  // doesn't cover negative numbers yet — see PlaceValueColumns.tsx's own
  // needsBiggerFirst guard, built for the same reason), so the b >= a
  // fallback is checked AFTER settling on which generator produced b.
  const needsPad = randInt(1, 10) <= 7;
  const a = randMoney2(20, 90);
  let b = needsPad ? randMoney1(1, Math.max(1, Math.floor(a) - 1)) : randMoney2(1, Math.max(1, Math.floor(a) - 1));
  if (b >= a) b = round2(a / 2);
  const diff = round2(a - b);

  const aPlaces = decimalPlaces(a);
  const bPlaces = decimalPlaces(b);
  const places = Math.max(aPlaces, bPlaces);
  const needsPlaceholder = aPlaces !== bPlaces;
  const shorterIsA = aPlaces < bPlaces;
  const shorterVal = shorterIsA ? a : b;
  const pluralPlaces = (n: number) => `${n} decimal place${n === 1 ? "" : "s"}`;

  const padChoiceStep = choice(
    {
      prompt: (
        <>
          Do <QA>{a}</QA> and <QB>{b}</QB> need placeholder zeros before you can line up their decimal points?
        </>
      ),
      hint: `Count the digits after the decimal point in each number — ${a} has ${pluralPlaces(aPlaces)}, and ${b} has ${pluralPlaces(bPlaces)}.`,
      explain: needsPlaceholder
        ? `${a} has ${pluralPlaces(aPlaces)} and ${b} has ${pluralPlaces(bPlaces)} — since they're different, the shorter number needs placeholder zeros.`
        : `${a} and ${b} already both have ${pluralPlaces(aPlaces)} — no placeholder zeros needed.`,
    },
    needsPlaceholder ? "Yes — they have different numbers of decimal places" : "No — they already have the same number of decimal places",
    [needsPlaceholder ? "No — they already have the same number of decimal places" : "Yes — they have different numbers of decimal places"]
  );

  const padWriteStep: Step = {
    kind: "number",
    padTo: places,
    prompt: shorterIsA ? (
      <>
        Rewrite <QA>{a}</QA> with the same number of decimal places as <QB>{b}</QB>, using placeholder zeros.
      </>
    ) : (
      <>
        Rewrite <QB>{b}</QB> with the same number of decimal places as <QA>{a}</QA>, using placeholder zeros.
      </>
    ),
    hint: `${shorterVal} has ${pluralPlaces(Math.min(aPlaces, bPlaces))}. Add zeros after its last digit until it has ${pluralPlaces(places)}.`,
    explain: `${shorterVal} = ${padToPlaces(shorterVal, places)} — adding zeros after the last digit doesn't change its value.`,
    answer: shorterVal,
  };

  const revealAt = needsPlaceholder ? 3 : 2;
  const sumAt = needsPlaceholder ? 4 : 3;

  return {
    title: "Subtracting decimals",
    story: `Subtract ${a} − ${b}.`,
    visual: (done: number) =>
      done < revealAt ? (
        <p className="muted small">Work out whether placeholder zeros are needed first — the lined-up numbers will appear here once you do.</p>
      ) : (
        <PlaceValueColumns operation="subtract" top={a} bottom={b} done={done >= sumAt ? 1 : 0} />
      ),
    steps: [
      choice(
        { prompt: "What's the first step, just like with addition?", hint: "Same first move as decimal addition.", explain: "Lining up the decimal points keeps each place value aligned." },
        "Line up the decimal points",
        ["Subtract the whole-number parts only", "Round both numbers first"]
      ),
      padChoiceStep,
      ...(needsPlaceholder ? [padWriteStep] : []),
      {
        kind: "number",
        prompt: `What is ${a} − ${b}?`,
        hint: "Borrow across columns (and across the decimal point if needed) just like whole-number subtraction.",
        explain: `${a} − ${b} = ${diff}.`,
        answer: diff,
      },
    ],
    wrapUp: `${a} − ${b} = ${diff}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — multiplication
// ============================================================================

function multiplyProblem(): Problem {
  const a = randMoney1(2, 40);
  const b = randMoney1(2, 9);
  const wholeA = Math.round(a * 10);
  const wholeB = Math.round(b * 10);
  const wholeProduct = wholeA * wholeB;
  const totalPlaces = decimalPlaces(a) + decimalPlaces(b);
  const product = round2(a * b);
  return {
    title: "Multiplying decimals",
    story: `Multiply ${a} × ${b}.`,
    visual: (done: number) => <PlaceValueColumns operation="multiply" top={a} bottom={b} done={done >= 2 ? 1 : 0} />,
    steps: [
      {
        kind: "number",
        prompt: `Ignore the decimal points for a moment. What is ${wholeA} × ${wholeB}?`,
        hint: "Multiply as if both numbers were whole numbers.",
        explain: `${wholeA} × ${wholeB} = ${wholeProduct}.`,
        answer: wholeProduct,
      },
      {
        kind: "number",
        prompt: `${a} has ${decimalPlaces(a)} decimal place${decimalPlaces(a) === 1 ? "" : "s"}, and ${b} has ${decimalPlaces(b)} — that's ${totalPlaces} total. Counting from the right of ${wholeProduct}, place the decimal point. What's the final product?`,
        hint: `Count ${totalPlaces} digit${totalPlaces === 1 ? "" : "s"} from the right of ${wholeProduct} and put the decimal point there.`,
        explain: `${a} × ${b} = ${product}.`,
        answer: product,
      },
    ],
    wrapUp: `${a} × ${b} = ${product}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — division
// ============================================================================

function divideProblem(): Problem {
  const divisor = randMoney1(1, 9);
  const quotient = randInt(3, 40);
  const dividend = round2(divisor * quotient);
  const shiftedDivisor = Math.round(divisor * 10);
  const shiftedDividend = Math.round(dividend * 10);
  const cycles = cycleSteps(shiftedDividend, shiftedDivisor);

  return {
    title: "Dividing decimals",
    story: `Divide ${dividend} ÷ ${divisor}.`,
    visual: (done: number) => <DivisionLadder dividend={shiftedDividend} divisor={shiftedDivisor} done={Math.min(Math.max(done - 2, 0), cycles.length)} />,
    steps: [
      choice(
        { prompt: "To divide by a decimal, what should you do first?", hint: "You need the divisor to become a whole number before doing long division.", explain: "Multiplying both numbers by the same power of 10 keeps the value of the division the same, but makes the divisor a whole number." },
        "Multiply both the divisor and the dividend by the same power of 10",
        ["Round the divisor to the nearest whole number", "Divide the whole-number parts only"]
      ),
      {
        kind: "ratio",
        tones: "none",
        labels: ["new dividend", "new divisor"],
        frame: ["", "÷", ""],
        prompt: `${divisor} has ${decimalPlaces(divisor)} decimal place. Multiply both numbers by 10. What's the new dividend and new divisor?`,
        hint: `${dividend} × 10 and ${divisor} × 10.`,
        explain: `${dividend} × 10 = ${shiftedDividend}, and ${divisor} × 10 = ${shiftedDivisor}.`,
        answer: [shiftedDividend, shiftedDivisor],
      },
      ...cycles,
      {
        kind: "number",
        prompt: `What's the final quotient?`,
        hint: "This should match your last cycle's digit.",
        explain: `${shiftedDividend} ÷ ${shiftedDivisor} = ${quotient}, so ${dividend} ÷ ${divisor} = ${quotient} too.`,
        answer: quotient,
      },
    ],
    wrapUp: `${dividend} ÷ ${divisor} = ${quotient}.`,
  };
}

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <PlaceValueColumns operation="add" top={12.5} bottom={3.25} done={1} />;
}

export const decimalOperations: Unit = {
  id: "decimalOperations",
  title: "Decimal Operations",
  goal: "Fluently add, subtract, multiply, and divide multi-digit decimals using the standard algorithm for each operation.",
  standard: "6.NS.3",
  keyIdea: (
    <>
      <p>Adding and subtracting decimals: line up the decimal points first, then work column by column.</p>
      <p>Multiplying decimals: multiply as whole numbers, then count total decimal places to place the point.</p>
      <p>Dividing decimals: multiply both numbers by a power of 10 until the divisor is a whole number, then divide as usual.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Same cadence as Conversions.tsx's drill (MM1 RatioLab) — re-show it every
  // 20 solved problems, not just once, since lining up decimal points is a
  // standing habit worth re-proving periodically, not a one-time fact.
  reintroEverySolved: 20,
  preview: Preview,
  problems: [
    { label: "Add", make: addProblem },
    { label: "Subtract", make: subtractProblem },
    { label: "Multiply", make: multiplyProblem },
    { label: "Divide", make: divideProblem },
  ],
  test: decimalOperationsTest,
};
