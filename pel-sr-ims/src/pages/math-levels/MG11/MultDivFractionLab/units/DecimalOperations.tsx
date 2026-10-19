import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { PlaceValueColumns } from "../diagrams";
import { ManualDivisionLadder, computeLongDivision } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, customStep, verticalMultiply, type Problem, type Step } from "../../../shared/engine/types";
import { QA, QB, Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { decimalOperationsTest } from "./DecimalOperationsTest";

const round2 = (n: number) => Math.round(n * 100) / 100;
const randMoney2 = (min: number, max: number) => randInt(min * 100, max * 100) / 100; // 2 decimal places
const randMoney1 = (min: number, max: number) => randInt(min * 10, max * 10) / 10; // 1 decimal place
const decimalPlaces = (n: number) => (String(n).split(".")[1] ?? "").length;

/** Rerolls `gen` until it lands on a value that isn't a whole number —
 *  randMoney1/randMoney2 can land on one whenever their trailing digit(s)
 *  happen to be zero (e.g. randMoney1 drawing 20/10 = "2"), which some
 *  operands (an addend, a factor, a divisor) should never visibly be. */
const nonInteger = (gen: () => number): number => {
  let v = gen();
  while (v % 1 === 0) v = gen();
  return v;
};

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

// Dedicated example for the multiply drill below — chosen (like ALIGN_TOP/
// ALIGN_BOTTOM above) so its own numbers land cleanly on step 3 with no
// leading-zero fuss, since cramming the placeholder-zero edge case into the
// same gated example would force step 3 to depend on step 4 finishing first.
// The small paired example in MultiplyPlaceholderExample handles that case
// instead, the same division of labor PlaceholderZeroExample has for add/subtract.
const MULT_A = 2.3;
const MULT_B = 1.4;

/** Inserts a decimal point `places` digits from the right of a whole-number
 *  product, padding with leading zeros first if the product is too short —
 *  e.g. placeDecimalPoint(6, 3) = "0.006". */
const placeDecimalPoint = (product: number, places: number): string => {
  const padded = String(product).padStart(places + 1, "0");
  const whole = padded.slice(0, padded.length - places) || "0";
  const frac = padded.slice(padded.length - places);
  return places > 0 ? `${whole}.${frac}` : whole;
};

const HOP_BOX_W = 36;

/**
 * Shows the decimal point visibly hopping leftward, one digit at a time,
 * from the end of a whole-number product to its final position `places`
 * digits in from the right — the physical move Step 3 asks a student to do
 * by counting. `placeholderCount` badges that many of the LEADING digits as
 * added placeholders, so one illustration carries both ideas at once: which
 * digits got padded in, and where the point lands after them.
 *
 * Plays once on mount as a short timed sequence (not a scrubbable player —
 * this is a quick illustration, not its own teaching sequence with
 * controls), then settles; skips straight to the settled position under
 * prefers-reduced-motion, the same convention FlipStep uses elsewhere in
 * this lab.
 */
function DecimalPointHop({ digits, places, placeholderCount = 0 }: { digits: string; places: number; placeholderCount?: number }) {
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [hop, setHop] = useState(reducedMotion ? places : 0);
  const L = digits.length;

  useEffect(() => {
    if (reducedMotion || hop >= places) return;
    const id = setTimeout(() => setHop((h) => h + 1), hop === 0 ? 600 : 700);
    return () => clearTimeout(id);
  }, [hop, places, reducedMotion]);

  const gapX = (h: number) => (L - h) * HOP_BOX_W;
  const settled = hop >= places;
  const whole = digits.slice(0, L - places) || "0";
  const frac = digits.slice(L - places);

  return (
    <div className="decimal-hop">
      <div className="decimal-hop-track" style={{ width: L * HOP_BOX_W }} role="img" aria-label={`Counting ${places} place${places === 1 ? "" : "s"} from the right of ${digits} places the decimal point, giving ${whole}.${frac}`}>
        {digits.split("").map((d, i) => (
          <span key={i} className={i < placeholderCount ? "decimal-hop-digit decimal-hop-placeholder" : "decimal-hop-digit"}>
            {d}
          </span>
        ))}
        {Array.from({ length: places }, (_, i) => {
          const h = i + 1;
          return (
            <span key={h} className={hop >= h ? "decimal-hop-mark passed" : "decimal-hop-mark"} style={{ left: gapX(h) }}>
              {h}
            </span>
          );
        })}
        <span className="decimal-hop-point" style={{ left: gapX(hop) }}>
          .
        </span>
      </div>
      <p className="decimal-hop-caption">
        {settled ? (
          <>
            = <b>{whole}.{frac}</b>
          </>
        ) : (
          `Counting ${hop} of ${places} place${places === 1 ? "" : "s"}…`
        )}
      </p>
    </div>
  );
}

/**
 * A small standalone example (a different number pair than the drill's own
 * 2.3/1.4, so a student sees the idea apply twice) showing what happens when
 * the whole-number product has FEWER digits than the decimal places you
 * need — step 4 of the guide. Placeholder zeros go in FRONT of the product
 * here, unlike addition's placeholder zeros, which go after it.
 */
function MultiplyPlaceholderExample() {
  const decA = 0.3;
  const decB = 0.2;
  const wholeA = 3;
  const wholeB = 2;
  const product = 6;
  const places = 2; // decA and decB each have 1 decimal place
  return (
    <div className="placeholder-zero-example">
      <p className="pz-caption" style={{ margin: "0 0 10px" }}>
        {decA} × {decB} — ignore the points:
      </p>
      {/* A standalone, individually-true fact (3 × 2 = 6) first, THEN the
          padding-and-hopping illustration below — stating them as one line
          ("3 × 2 = 006") would read as a wrong multiplication fact. */}
      <div className="pz-equation" style={{ fontSize: 22, marginBottom: 4 }}>
        <span className="pz-value">
          {wholeA} × {wholeB} = {product}
        </span>
      </div>
      <p className="pz-caption" style={{ margin: "0 0 4px" }}>
        {product} needs {places} decimal places but is only 1 digit long, so a placeholder zero (highlighted) is added to the front. Watch the point count over:
      </p>
      <DecimalPointHop digits="06" places={places} placeholderCount={1} />
    </div>
  );
}

/**
 * The multiply-decimals counterpart to AlignDecimalsDrill: the same gated,
 * check-your-work-before-the-next-stage-unlocks structure, now following the
 * "multiply as whole numbers → count decimal places → place the point"
 * guide instead of "line up the decimal points → combine column by column."
 * Multiplying never needs the decimal points lined up, so there's no digit-
 * box column rebuild here — the three gated stages below map directly onto
 * steps 1-3 of the guide. Step 4 (placeholder zeros) isn't exercised by this
 * drill's own numbers; see MultiplyPlaceholderExample for that case.
 */
function MultiplyDecimalsDrill({
  onComplete,
  prefilled,
}: {
  onComplete?: () => void;
  /** Reviewing a drill the student already passed — open straight to the
   *  fully-correct, fully-checked state instead of making them redo the
   *  typing to see what they already proved they can do. Same role as
   *  AlignDecimalsDrill's own `prefilled` prop; needed here too since this
   *  whole component unmounts (losing all its state) whenever the student
   *  leaves the Explore tab and comes back. */
  prefilled?: boolean;
}) {
  const wholeA = Math.round(MULT_A * 10);
  const wholeB = Math.round(MULT_B * 10);
  const wholeProduct = wholeA * wholeB;
  const placesA = decimalPlaces(MULT_A);
  const placesB = decimalPlaces(MULT_B);
  const totalPlaces = placesA + placesB;
  const finalProduct = placeDecimalPoint(wholeProduct, totalPlaces);

  // Step 1 breaks wholeA × wholeB into its two partial products (wholeB's
  // tens digit and ones digit, multiplied separately) rather than asking for
  // the product in one jump — the standard "partial products" method a 4th
  // grader learns before the compact algorithm, and input boxes for each
  // piece instead of just the final total.
  const bTens = Math.floor(wholeB / 10) * 10;
  const bOnes = wholeB % 10;
  const partialOnes = wholeA * bOnes;
  const partialTens = wholeA * bTens;

  const [p1, setP1] = useState(prefilled ? String(partialOnes) : "");
  const [p2, setP2] = useState(prefilled ? String(partialTens) : "");
  const [s1, setS1] = useState(prefilled ? String(wholeProduct) : "");
  const [checked1, setChecked1] = useState(!!prefilled);
  const okP1 = Number(p1) === partialOnes;
  const okP2 = Number(p2) === partialTens;
  const ok1 = Number(s1) === wholeProduct;
  const allOk1 = okP1 && okP2 && ok1;

  const [s2a, setS2a] = useState(prefilled ? String(placesA) : "");
  const [s2b, setS2b] = useState(prefilled ? String(placesB) : "");
  const [s2c, setS2c] = useState(prefilled ? String(totalPlaces) : "");
  const [checked2, setChecked2] = useState(!!prefilled);
  const ok2a = Number(s2a) === placesA;
  const ok2b = Number(s2b) === placesB;
  const ok2c = Number(s2c) === totalPlaces;
  const allOk2 = ok2a && ok2b && ok2c;

  const [s3, setS3] = useState(prefilled ? finalProduct : "");
  const [checked3, setChecked3] = useState(!!prefilled);
  const ok3 = s3.trim() === finalProduct;

  // The capstone below the 3 numbered steps: the same partial products and
  // final answer, rewritten in the standard vertical form.
  const [v1, setV1] = useState(prefilled ? String(partialOnes) : "");
  const [v2, setV2] = useState(prefilled ? String(partialTens) : "");
  const [v3, setV3] = useState(prefilled ? finalProduct : "");
  const [checked4, setChecked4] = useState(!!prefilled);
  const okV1 = Number(v1) === partialOnes;
  const okV2 = Number(v2) === partialTens;
  const okV3 = v3.trim() === finalProduct;
  const allOk4 = okV1 && okV2 && okV3;

  useEffect(() => {
    if (checked4 && allOk4) onComplete?.();
  }, [checked4, allOk4, onComplete]);

  const fieldStyle = (ok: boolean, isChecked: boolean): CSSProperties => (isChecked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

  return (
    <div className="align-drill">
      <div className="align-drill-top">
        <div className="align-drill-text">
          <p className="intro-gate-title">Step 1: Multiply as whole numbers</p>
          <p>
            Ignore the decimal points completely — multiply <b>{MULT_A}</b> and <b>{MULT_B}</b> like regular whole numbers: <b>{wholeA}</b> × <b>{wholeB}</b>. You do not need to line up the decimal points at all.
          </p>
          <div className="controls">
            <div className="control-row">
              <label>
                Break {wholeB} into {bTens} + {bOnes}. What is {wholeA} × {bOnes}?{" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 60, ...fieldStyle(okP1, checked1) }} value={p1} onChange={(e) => setP1(e.target.value)} />
              </label>
            </div>
            <div className="control-row">
              <label>
                What is {wholeA} × {bTens}?{" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 70, ...fieldStyle(okP2, checked1) }} value={p2} onChange={(e) => setP2(e.target.value)} />
              </label>
            </div>
            <div className="control-row">
              <label>
                Add your two answers above together — what's {wholeA} × {wholeB}?{" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 70, ...fieldStyle(ok1, checked1) }} value={s1} onChange={(e) => setS1(e.target.value)} />
              </label>
            </div>
          </div>
          <button className="btn primary" onClick={() => setChecked1(true)}>
            Check my work
          </button>
          {checked1 && (
            <p className={`feedback ${allOk1 ? "good" : "bad"}`} role="alert">
              {allOk1
                ? `Exactly — ${wholeA} × ${bOnes} = ${partialOnes}, ${wholeA} × ${bTens} = ${partialTens}, and ${partialOnes} + ${partialTens} = ${wholeProduct}.`
                : `Not quite — multiply ${wholeA} by each part of ${wholeB} (${bOnes} and ${bTens}) separately, then add those two results together.`}
            </p>
          )}
        </div>
        <MultiplyPlaceholderExample />
      </div>

      {checked1 && allOk1 && (
        <div className="align-stack-wrap">
          <p className="intro-gate-title">Step 2: Count the decimal places</p>
          <p>Look at the ORIGINAL numbers (before you ignored the points) and count the digits to the right of each decimal point.</p>
          <div className="controls">
            <div className="control-row">
              <label>
                Decimal places in {MULT_A}?{" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 50, ...fieldStyle(ok2a, checked2) }} value={s2a} onChange={(e) => setS2a(e.target.value)} />
              </label>
            </div>
            <div className="control-row">
              <label>
                Decimal places in {MULT_B}?{" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 50, ...fieldStyle(ok2b, checked2) }} value={s2b} onChange={(e) => setS2b(e.target.value)} />
              </label>
            </div>
            <div className="control-row">
              <label>
                Total decimal places needed?{" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 50, ...fieldStyle(ok2c, checked2) }} value={s2c} onChange={(e) => setS2c(e.target.value)} />
              </label>
            </div>
          </div>
          <button className="btn primary" onClick={() => setChecked2(true)}>
            Check my work
          </button>
          {checked2 && (
            <p className={`feedback ${allOk2 ? "good" : "bad"}`} role="alert">
              {allOk2
                ? `Right — ${placesA} + ${placesB} = ${totalPlaces} decimal places total. Now place the decimal point in your product:`
                : "Not quite — count the digits after the decimal point in each ORIGINAL number, then add the two counts together."}
            </p>
          )}
        </div>
      )}

      {checked2 && allOk2 && (
        <div className="align-stack-wrap">
          <p className="intro-gate-title">Step 3: Place the decimal point</p>
          <label>
            Start at the far right of {wholeProduct} and count {totalPlaces} place{totalPlaces === 1 ? "" : "s"} to the left. What's the final product?{" "}
            <input className="answer" autoComplete="off" style={{ width: 90, ...fieldStyle(ok3, checked3) }} value={s3} onChange={(e) => setS3(e.target.value)} />
          </label>
          <button className="btn primary" style={{ marginLeft: 14 }} onClick={() => setChecked3(true)}>
            Check my answer
          </button>
          {checked3 && (
            <p className={`feedback ${ok3 ? "good" : "bad"}`} role="alert">
              {ok3 ? `Correct — ${MULT_A} × ${MULT_B} = ${finalProduct}.` : `Not quite — counting ${totalPlaces} places from the right of ${wholeProduct} gives ${finalProduct}.`}
            </p>
          )}
        </div>
      )}
      {/* A capstone, not a new numbered guide step — the same two partial
          products and final answer from steps 1-3, just rewritten in the
          standard vertical form a student would actually use on paper,
          decimal points and all, so the sentence-based steps above and the
          written form connect as the same procedure instead of two
          different-looking things. */}
      {checked3 && ok3 && (
        <div className="align-stack-wrap">
          <p className="intro-gate-title">Now try it the way you'd write it on paper</p>
          <div className="vmult-stack">
            <div className="vmult-row vmult-given">{MULT_A}</div>
            <div className="vmult-row vmult-given">
              <span className="vmult-op">×</span> {MULT_B}
            </div>
            <div className="vmult-rule" />
            <div className="vmult-row">
              <input
                className="answer"
                inputMode="numeric"
                autoComplete="off"
                aria-label={`${wholeA} times ${bOnes}`}
                style={{ width: 90, textAlign: "right", fontFamily: "'Courier New', monospace", fontSize: 20, ...fieldStyle(okV1, checked4) }}
                value={v1}
                onChange={(e) => setV1(e.target.value)}
              />
            </div>
            <div className="vmult-row">
              <input
                className="answer"
                inputMode="numeric"
                autoComplete="off"
                aria-label={`${wholeA} times ${bTens}`}
                style={{ width: 90, textAlign: "right", fontFamily: "'Courier New', monospace", fontSize: 20, ...fieldStyle(okV2, checked4) }}
                value={v2}
                onChange={(e) => setV2(e.target.value)}
              />
            </div>
            <div className="vmult-rule" />
            <div className="vmult-row">
              <input
                className="answer"
                autoComplete="off"
                aria-label={`${MULT_A} times ${MULT_B}, with the decimal point`}
                style={{ width: 90, textAlign: "right", fontFamily: "'Courier New', monospace", fontSize: 20, ...fieldStyle(okV3, checked4) }}
                value={v3}
                onChange={(e) => setV3(e.target.value)}
              />
            </div>
          </div>
          <button className="btn primary" onClick={() => setChecked4(true)}>
            Check my work
          </button>
          {checked4 && (
            <p className={`feedback ${allOk4 ? "good" : "bad"}`} role="alert">
              {allOk4
                ? `Exactly — the same two partial products and final answer as before, just written the standard way.`
                : `Not quite — these are the same two partial products and final answer from steps 1-3, written in the standard vertical form: ${wholeA} × ${bOnes}, then ${wholeA} × ${bTens} shifted one place left, then their sum with the point placed.`}
            </p>
          )}
        </div>
      )}
      {checked4 && allOk4 && <PlaceValueColumns operation="multiply" top={MULT_A} bottom={MULT_B} done={1} />}
    </div>
  );
}

// Dedicated example for the divide drill — chosen (like MULT_A/MULT_B above)
// so shifting by its own decimal-place count lands cleanly (both numbers
// become whole with nothing left over) and the resulting long division runs
// 2 full cycles with a genuine nonzero intermediate remainder, instead of
// collapsing to a single trivial step.
const DIV_DIVIDEND = 15.6;
const DIV_DIVISOR = 1.2;

/**
 * Two numbers' decimal points moving right together, the same number of
 * places, at the same time — the division counterpart to DecimalPointHop.
 * Multiplying both dividend and divisor by the same power of 10 doesn't
 * change what the division equals, and seeing both points move in lockstep
 * is the one part of this step that's genuinely hard to picture from text
 * alone. A faint "ghost" marks where each point started; once settled, a
 * curved arrow sweeps from there to where it landed, with a solid point at
 * the new spot — the classic "arrow shows the point's move" picture, not
 * just a dot relocating. Plays once on mount, respects prefers-reduced-motion.
 */
function DecimalShiftHop({ top, bottom, places }: { top: number; bottom: number; places: number }) {
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [settled, setSettled] = useState(!!reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setTimeout(() => setSettled(true), 700);
    return () => clearTimeout(id);
  }, [reducedMotion]);

  const ARROW_H = 28;

  const renderTrack = (value: number, key: string) => {
    const [whole, frac = ""] = String(value).split(".");
    const digits = whole + frac;
    const fromX = whole.length * HOP_BOX_W;
    const toX = (whole.length + places) * HOP_BOX_W;
    const midX = (fromX + toX) / 2;
    const trackW = digits.length * HOP_BOX_W;
    return (
      <div className="decimal-shift-row" key={key}>
        <svg width={trackW} height={ARROW_H} viewBox={`0 0 ${trackW} ${ARROW_H}`} style={{ display: "block", overflow: "visible" }} aria-hidden="true">
          <defs>
            <marker id={`arrowhead-${key}`} markerWidth="8" markerHeight="8" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--qc, #8A4FD8)" />
            </marker>
          </defs>
          {settled && (
            <path
              d={`M ${fromX} ${ARROW_H - 4} Q ${midX} 2 ${toX} ${ARROW_H - 4}`}
              fill="none"
              stroke="var(--qc, #8A4FD8)"
              strokeWidth="2.5"
              markerEnd={`url(#arrowhead-${key})`}
              className="decimal-shift-arrow-path"
            />
          )}
        </svg>
        <div className="decimal-hop-track" style={{ width: trackW, margin: "0 0 6px" }}>
          {digits.split("").map((d, i) => (
            <span key={i} className="decimal-hop-digit">
              {d}
            </span>
          ))}
          <span className="decimal-hop-point decimal-hop-point-ghost" style={{ left: fromX }}>
            .
          </span>
          {settled && (
            <span className="decimal-hop-point" style={{ left: toX }}>
              .
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="decimal-hop">
      {renderTrack(top, "top")}
      {renderTrack(bottom, "bottom")}
      <p className="decimal-hop-caption">{settled ? <>× {Math.pow(10, places)} — now both are whole numbers</> : "Watch both decimal points move…"}</p>
    </div>
  );
}

/**
 * A small standalone example (different numbers than the drill's own
 * 15.6 ÷ 1.2, so a student sees the idea apply twice) showing what happens
 * when shifting the decimal points DOESN'T make the division come out even
 * in the original digits — division's equivalent of a placeholder zero:
 * bring down a zero and keep going, same as long division with whole
 * numbers that don't divide evenly.
 */
function DividePlaceholderExample() {
  return (
    <div className="placeholder-zero-example">
      <p className="pz-caption" style={{ margin: "0 0 10px" }}>
        0.5 ÷ 0.4 — shift both by 10:
      </p>
      <div className="pz-equation" style={{ fontSize: 20, marginBottom: 4 }}>
        <span className="pz-value">5 ÷ 4 = 1 R1</span>
      </div>
      <p className="pz-caption" style={{ margin: "0 0 4px" }}>
        There's a remainder, and no digits left to bring down — so bring down a <b>placeholder zero</b> instead (and put a point in the quotient):
      </p>
      <div className="pz-equation" style={{ fontSize: 20, marginBottom: 4 }}>
        <span className="pz-value">10 ÷ 4 = 2 R2</span>
      </div>
      <p className="pz-caption" style={{ margin: "0 0 4px" }}>Still a remainder — bring down another zero:</p>
      <div className="pz-equation" style={{ fontSize: 20, marginBottom: 4 }}>
        <span className="pz-value">20 ÷ 4 = 5 R0</span>
      </div>
      <p className="pz-caption">
        No remainder — done: <b>0.5 ÷ 0.4 = 1.25</b>.
      </p>
    </div>
  );
}

/**
 * The divide-decimals counterpart to AlignDecimalsDrill/MultiplyDecimalsDrill
 * — same gated, check-before-the-next-stage-unlocks structure, now following
 * "make the divisor whole → shift both numbers → long-divide" instead of
 * either of those. Unlike the other two, the "written form" IS the gated
 * content here — DivisionLadder fills in one cycle at a time as each cycle's
 * question is answered, rather than a separate capstone connecting sentence
 * steps to a written form shown only at the end; there's nothing to connect,
 * the cycles already are the written form.
 */
function DivideDecimalsDrill({ onComplete, prefilled }: { onComplete?: () => void; prefilled?: boolean }) {
  const places = decimalPlaces(DIV_DIVISOR);
  const shiftedDivisor = Math.round(DIV_DIVISOR * Math.pow(10, places));
  const shiftedDividend = Math.round(DIV_DIVIDEND * Math.pow(10, places));
  const { cycles } = computeLongDivision(shiftedDividend, shiftedDivisor);

  const [s1, setS1] = useState(prefilled ? String(places) : "");
  const [checked1, setChecked1] = useState(!!prefilled);
  const ok1 = Number(s1) === places;

  const [s2a, setS2a] = useState(prefilled ? String(shiftedDividend) : "");
  const [s2b, setS2b] = useState(prefilled ? String(shiftedDivisor) : "");
  const [checked2, setChecked2] = useState(!!prefilled);
  const ok2a = Number(s2a) === shiftedDividend;
  const ok2b = Number(s2b) === shiftedDivisor;
  const allOk2 = ok2a && ok2b;

  // Step 3 manages its own fill-in-every-digit state internally (see
  // ManualDivisionLadder) and — unlike steps 1/2 — always starts blank, even
  // on a prefilled reopen, since doing the division by hand is the entire
  // point of this step. So divideDone always starts false too, regardless of
  // `prefilled`, or this wrap-up line would show above a blank ladder.
  const [divideDone, setDivideDone] = useState(false);
  const handleDivideComplete = useCallback(() => {
    setDivideDone(true);
    onComplete?.();
  }, [onComplete]);

  const fieldStyle = (ok: boolean, isChecked: boolean): CSSProperties => (isChecked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

  return (
    <div className="align-drill">
      <p style={{ fontSize: 17, fontWeight: 700, margin: "0 0 14px" }}>
        Divide {DIV_DIVIDEND} ÷ {DIV_DIVISOR}
      </p>
      <div className="align-drill-top">
        <div className="align-drill-text">
          <p className="intro-gate-title">Step 1: Make the divisor a whole number</p>
          <p>
            To divide by <b>{DIV_DIVISOR}</b>, first turn it into a whole number. How many decimal places does {DIV_DIVISOR} have?
          </p>
          <div className="controls">
            <div className="control-row">
              <label>
                Decimal places in {DIV_DIVISOR}?{" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 50, ...fieldStyle(ok1, checked1) }} value={s1} onChange={(e) => setS1(e.target.value)} />
              </label>
            </div>
          </div>
          <button className="btn primary" onClick={() => setChecked1(true)}>
            Check my work
          </button>
          {checked1 && (
            <p className={`feedback ${ok1 ? "good" : "bad"}`} role="alert">
              {ok1 ? `Right — ${DIV_DIVISOR} has ${places} decimal place${places === 1 ? "" : "s"}, so both numbers shift ${places} place${places === 1 ? "" : "s"}.` : `Count the digits after the decimal point in ${DIV_DIVISOR}.`}
            </p>
          )}
        </div>
        <DividePlaceholderExample />
      </div>

      {checked1 && ok1 && (
        <div className="align-stack-wrap">
          <p className="intro-gate-title">Step 2: Shift both numbers</p>
          <p>
            Multiply <b>both</b> {DIV_DIVIDEND} and {DIV_DIVISOR} by 10 — multiplying both by the same amount doesn't change what the division equals, but it makes the divisor a whole number.
          </p>
          <DecimalShiftHop top={DIV_DIVIDEND} bottom={DIV_DIVISOR} places={places} />
          <div className="controls">
            <div className="control-row">
              <label>
                {DIV_DIVIDEND} × 10 ={" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 70, ...fieldStyle(ok2a, checked2) }} value={s2a} onChange={(e) => setS2a(e.target.value)} />
              </label>
            </div>
            <div className="control-row">
              <label>
                {DIV_DIVISOR} × 10 ={" "}
                <input className="answer" inputMode="numeric" autoComplete="off" style={{ width: 70, ...fieldStyle(ok2b, checked2) }} value={s2b} onChange={(e) => setS2b(e.target.value)} />
              </label>
            </div>
          </div>
          <button className="btn primary" onClick={() => setChecked2(true)}>
            Check my work
          </button>
          {checked2 && (
            <p className={`feedback ${allOk2 ? "good" : "bad"}`} role="alert">
              {allOk2 ? `Right — ${shiftedDividend} ÷ ${shiftedDivisor} now, same value as ${DIV_DIVIDEND} ÷ ${DIV_DIVISOR}. Now divide:` : `Multiply each number by 10 — move the decimal point one place to the right.`}
            </p>
          )}
        </div>
      )}

      {checked2 && allOk2 && (
        <div className="align-stack-wrap">
          <p className="intro-gate-title">Step 3: Divide</p>
          <p className="muted small" style={{ margin: "0 0 10px" }}>
            Write the equivalent whole-number division, then work it out the way you would on paper — quotient digit, subtract, bring down the next digit, repeat. Each box confirms as soon as it's right.
          </p>
          <ManualDivisionLadder dividend={shiftedDividend} divisor={shiftedDivisor} cycles={cycles} onComplete={handleDivideComplete} />
          {divideDone && (
            <p className="feedback good" role="alert" style={{ marginTop: 10 }}>
              Correct — {DIV_DIVIDEND} ÷ {DIV_DIVISOR} = {cycles.map((c) => c.qDigit).join("")}.
            </p>
          )}
        </div>
      )}
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
  // Shift BOTH numbers by the DIVISOR's own decimal-place count — not a
  // fixed ×10 — since that's what actually makes the divisor whole. A fixed
  // ×10 silently produced the wrong division whenever bottom had more than
  // one decimal place (e.g. 23.4 ÷ 8.15 was rendered as 234 ÷ 82, off the
  // true 23.4 ÷ 8.15 ≈ 2.87 because 8.15 × 10 = 81.5 still isn't whole).
  const divPlaces = decimalPlaces(bottom);
  const divShiftBy = Math.pow(10, divPlaces);
  const shiftedTop = Math.round(top * divShiftBy);
  const shiftedBottom = Math.round(bottom * divShiftBy);
  const sandboxCycles = shiftedBottom !== 0 ? computeLongDivision(shiftedTop, shiftedBottom).cycles : [];

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
      {/* Add/subtract hide this while their own gate is still due, since
          AlignDecimalsDrill is shown mandatorily instead in that case (see
          below). Multiply and divide have no mandatory variant, so their
          toggle stays visible regardless of introActive — otherwise
          switching to either while the add/subtract gate is still due shows
          no drill AND no way to reach one, which is what this condition used
          to do. */}
      {((!introActive && (op === "add" || op === "subtract")) || op === "multiply" || op === "divide") && (
        <button className="btn ghost" style={{ width: "fit-content" }} onClick={() => setShowDrill((v) => !v)}>
          {showDrill ? "Hide the" : "Show the"} {op === "add" || op === "subtract" ? "lining-up drill" : "step-by-step guide"}
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
      {/* Multiply's step-by-step guide is never shown MANDATORILY (that only
          ever covers whichever of add/subtract is active by default) — it's
          always just the optional toggle above. But finishing it still
          satisfies the same gate add/subtract's drill does: a student who
          goes straight to Multiply and completes it has just as validly
          proven they can do the required activity, and Practice unlocking
          only for whoever happened to click Add or Subtract first — while
          Multiply shows every sign of being "the activity" too, down to its
          own Check-my-work buttons and completion feedback — was confusing,
          not intentional gatekeeping. */}
      {showDrill && op === "multiply" && <MultiplyDecimalsDrill key={op} onComplete={onIntroDone} prefilled={!introActive} />}
      {/* Same non-mandatory-but-still-gate-satisfying treatment as Multiply. */}
      {showDrill && op === "divide" && <DivideDecimalsDrill key={op} onComplete={onIntroDone} prefilled={!introActive} />}
      {op === "divide" ? (
        shiftedBottom === 0 ? (
          <p className="muted small">Enter a non-zero second number to divide by.</p>
        ) : (
          // Reuses the same hands-on, fill-every-digit component as the
          // guide's own Step 3, instead of a passively-already-solved
          // display — so trying your own numbers here is practice too, not
          // just a readout.
          <ManualDivisionLadder key={`${topText}-${bottomText}`} dividend={shiftedTop} divisor={shiftedBottom} cycles={sandboxCycles} />
        )
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
  const a = nonInteger(() => randMoney2(1, 60)); // 2 decimal places
  const b = needsPad ? nonInteger(() => randMoney1(1, 25)) : nonInteger(() => randMoney2(1, 25)); // 1 or 2 decimal places
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

/** Draws a value in [min, max] with 1 or 2 decimal places, chosen at random
 *  each call (and never a whole number — see nonInteger) — so a factor is
 *  sometimes "2.3" and sometimes "4.37", not always the same shape. */
const randMoneyMixedPlaces = (min: number, max: number): number =>
  nonInteger(Math.random() < 0.5 ? () => randMoney1(min, max) : () => randMoney2(min, max));

function multiplyProblem(): Problem {
  // `a` used to go up to 40 (a 3-digit whole number once scaled) and was
  // narrowed to a single-digit-dollar range to keep the vertical step's
  // digit-box count down — still true here, but now each factor can ALSO
  // independently land on 1 or 2 decimal places, so wholeA/wholeB/totalPlaces
  // below read each factor's ACTUAL decimal-place count (never assume 1)
  // so every combination places the point correctly. A 2-decimal factor's
  // own whole-number form is a digit longer (e.g. "437" instead of "23"),
  // so the hardest combination (both factors 2-decimal) does mean more
  // digit boxes than before — worth an eye on whether that's still a good
  // fit for Practice, not just correctness.
  const a = randMoneyMixedPlaces(1, 9);
  const b = randMoneyMixedPlaces(2, 9);
  const placesA = decimalPlaces(a);
  const placesB = decimalPlaces(b);
  const wholeA = Math.round(a * Math.pow(10, placesA));
  const wholeB = Math.round(b * Math.pow(10, placesB));
  const wholeProduct = wholeA * wholeB;
  const totalPlaces = placesA + placesB;
  const product = Number(placeDecimalPoint(wholeProduct, totalPlaces));
  return {
    title: "Multiplying decimals",
    story: `Multiply ${a} × ${b}.`,
    visual: (done: number) => <PlaceValueColumns operation="multiply" top={a} bottom={b} done={done >= 2 ? 1 : 0} />,
    steps: [
      verticalMultiply(
        {
          prompt: `Ignore the decimal points and multiply ${a} × ${b} the standard way: one partial product per digit of ${wholeB}, then add them up.`,
          hint: `Multiply ${wholeA} by each digit of ${wholeB} separately — ones digit first, then tens — writing each partial product one place further left, then add them together.`,
          explain: `${wholeA} × ${wholeB} = ${wholeProduct}.`,
        },
        a,
        b
      ),
      {
        kind: "number",
        prompt: `${a} has ${placesA} decimal place${placesA === 1 ? "" : "s"}, and ${b} has ${placesB} — that's ${totalPlaces} total. Counting from the right of ${wholeProduct}, place the decimal point. What's the final product?`,
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

function divideProblem(targetBucket?: string): Problem {
  // Randomly pick a 2-decimal divisor under 1 (needs a ×100 shift) or a
  // 1-decimal divisor from 1-9 (needs a ×10 shift), so students practice
  // both shift amounts, not just one. The dividend's own decimal places can
  // end up fewer than the shift needs (e.g. dividing by 0.25 often lands on
  // a dividend with fewer decimal places than that) — that's fine, the
  // placeholder-zero case is worth practicing too, not something to avoid.
  //
  // When a shuffle bag (decimalOperations.problems' Divide entry, below)
  // hands this a specific targetBucket instead of leaving it to chance,
  // honor it: fix the shift amount directly (it's just which random range
  // to draw the divisor from) and reroll the divisor/quotient — rejection
  // sampling, not hand-derived arithmetic — until the pad/clean outcome
  // matches too. Both dials converge in only a handful of rerolls in
  // practice (pad is a ~1-in-5 to ~1-in-10 outcome per the generator's own
  // simulated trial run), so a generous iteration cap is just a safety net
  // against a malformed bucket string, never something normal play hits.
  const bucketMatch = targetBucket?.match(/^shift([12])-(clean|pad)$/);
  const targetPlaces = bucketMatch ? Number(bucketMatch[1]) : undefined;
  const targetPad = bucketMatch ? bucketMatch[2] === "pad" : undefined;

  let divisor: number, places: number, shiftBy: number, quotient: number, dividend: number, needsPad: boolean;
  let tries = 0;
  do {
    const twoPlaces = targetPlaces !== undefined ? targetPlaces === 2 : Math.random() < 0.5;
    divisor = twoPlaces ? randMoney2(0.01, 0.99) : randMoney1(1.1, 9.9);
    places = decimalPlaces(divisor);
    shiftBy = Math.pow(10, places);
    quotient = randInt(3, 40);
    dividend = round2(divisor * quotient);
    needsPad = decimalPlaces(dividend) < places;
    tries++;
    // places doesn't always match twoPlaces' intended range: a trailing zero
    // collapses it (e.g. drawing 0.50 from the 2-decimal range leaves only 1
    // actual decimal place; drawing 2.0 from the 1-decimal range leaves 0) —
    // so re-check the ACTUAL places against the target too, not just pad.
    // places === 0 also catches the divisor landing on a whole number (e.g.
    // that same 2.0) — the divisor should never visibly be an integer,
    // regardless of whether a target bucket was requested at all.
  } while (tries < 500 && (places === 0 || (targetPlaces !== undefined && places !== targetPlaces) || (targetPad !== undefined && needsPad !== targetPad)));

  const shiftedDivisor = Math.round(divisor * shiftBy);
  const shiftedDividend = Math.round(dividend * shiftBy);
  const { cycles } = computeLongDivision(shiftedDividend, shiftedDivisor);
  // See decimalOperations.requiredBuckets below — "pad" covers the
  // placeholder-zero case, "clean" the straightforward one, crossed with
  // which shift amount this instance landed on.
  const bucket = `shift${places}-${needsPad ? "pad" : "clean"}`;

  return {
    title: "Dividing decimals",
    bucket,
    story: `Divide ${dividend} ÷ ${divisor}.`,
    visual: (done: number) =>
      done < 1 ? (
        <p className="muted small">Answer the question first — the division ladder appears below once you do.</p>
      ) : (
        <p className="muted small">Work through the ladder below, one box at a time: quotient digit, subtract, bring down, repeat.</p>
      ),
    steps: [
      choice(
        { prompt: "To divide by a decimal, what should you do first?", hint: "You need the divisor to become a whole number before doing long division.", explain: "Multiplying both numbers by the same power of 10 keeps the value of the division the same, but makes the divisor a whole number." },
        "Multiply both the divisor and the dividend by the same power of 10",
        ["Round the divisor to the nearest whole number", "Divide the whole-number parts only"]
      ),
      // Replaces what used to be a separate "what's the new dividend/divisor"
      // question plus one question per long-division cycle plus a final
      // "what's the quotient" question — ManualDivisionLadder already covers
      // all of that itself (converting to the equivalent whole-number
      // division, then every quotient/subtract/bring-down digit) as one
      // self-contained, self-validating widget, so there's nothing left for
      // separate Q&A steps to ask.
      customStep(
        {
          prompt: `Write ${dividend} ÷ ${divisor} as the equivalent whole-number division, then divide it out below.`,
          hint: `${divisor} has ${places} decimal place${places === 1 ? "" : "s"} — multiply both numbers by ${shiftBy} first (giving ${shiftedDividend} ÷ ${shiftedDivisor}), then divide the way you would on paper.`,
          explain: `${shiftedDividend} ÷ ${shiftedDivisor} = ${quotient}, so ${dividend} ÷ ${divisor} = ${quotient} too.`,
        },
        (onDone) => <ManualDivisionLadder dividend={shiftedDividend} divisor={shiftedDivisor} cycles={cycles} onComplete={onDone} />,
        `${dividend} ÷ ${divisor} = ${quotient}`
      ),
    ],
    wrapUp: `${dividend} ÷ ${divisor} = ${quotient}.`,
  };
}

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <PlaceValueColumns operation="add" top={12.5} bottom={3.25} done={1} />;
}

// Shared by both the Divide ProblemType's own `buckets` (which Mixed-mode's
// shuffle bag reads to expand Divide into one bag slot per bucket) and the
// Unit's `requiredBuckets` (which mastery-gates on) — one list, not two
// copies that could drift apart.
const DIVIDE_BUCKETS = ["shift1-clean", "shift1-pad", "shift2-clean", "shift2-pad"];

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
    { label: "Divide", make: divideProblem, buckets: DIVIDE_BUCKETS },
  ],
  // Only divideProblem() tags a bucket today (the other 3 generators don't
  // set Problem.bucket) — a mastery star now requires seeing all 4 of these
  // at least once, cleanly, not just MASTERY_GOAL clean solves from wherever
  // "Mixed" happened to land. See the pilot write-up this was built for.
  requiredBuckets: DIVIDE_BUCKETS,
  test: decimalOperationsTest,
};
