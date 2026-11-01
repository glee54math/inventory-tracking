import { useEffect, useState } from "react";
import { DecimalNumberLine, DiffWholeBars, FractionBar, GridRow, PlaceValueChart, type PlaceValueRow } from "../diagrams";
import { compareSymbol, decimalText, diffWholeScenario, fewerDigitsPair, sameDigitsPair, sameWholePartPair, shortDecimal } from "../lib/decimals";
import { pick } from "../../../shared/lib/math";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";
import { choice, type Problem } from "../../../shared/engine/types";
import { QA, QC, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingDecimalsTest } from "./ComparingDecimalsTest";

const SYMBOLS = ["<", ">", "="];

/** A place-value row for an amount of hundredths written with `places`
 *  digits after the point (1 -> the hundredths cell is left empty). */
const row = (h: number, places: 1 | 2, ghostZero = false): PlaceValueRow => {
  const r = h % 100;
  return places === 1 ? { ones: Math.floor(h / 100), tenths: r / 10, ghostZero } : { ones: Math.floor(h / 100), tenths: Math.floor(r / 10), hundredths: r % 10 };
};

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function Pick({ value, onChange, options, ok, show, label, disabled }: { value: string; onChange: (v: string) => void; options: string[]; ok: boolean; show: boolean; label: string; disabled: boolean }) {
  return (
    <select className="answer" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} disabled={disabled} style={answerBorder(ok, show)}>
      <option value="" disabled>
        choose
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/**
 * Four fixed questions:
 *  1. vocabulary/equivalence — 0.5 is 5 tenths = 50 hundredths
 *  2. the plan's named trap, true/false — "0.5 < 0.36 because it has fewer
 *     digits", justified with a number line (shown once answered)
 *  3. the same-whole trap, as its own separate question — 0.5 of a 10 cm
 *     ribbon vs 0.5 of a 100 cm ribbon
 *  4. matching ones and tenths: the hundredths decide (2.45 vs 2.49)
 */
function ComparingCheck({ onComplete }: { onComplete?: () => void }) {
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [c1, setC1] = useState(false);
  const f1 = allFilled(a1, a2);
  const ok1a = a1 === "tenths";
  const ok1b = a2 === "50";
  const done1 = c1 && ok1a && ok1b;

  const [b1, setB1] = useState("");
  const [b2, setB2] = useState("");
  const [c2, setC2] = useState(false);
  const f2 = allFilled(b1, b2);
  const ok2a = b1 === "False";
  const ok2b = b2 === "right";
  const done2 = c2 && ok2a && ok2b;

  const [q3, setQ3] = useState<string | null>(null);
  const done3 = q3 === "no";

  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [c4, setC4] = useState(false);
  const f4 = allFilled(d1, d2);
  const ok4a = d1 === "hundredths";
  const ok4b = d2 === "<";
  const done4 = c4 && ok4a && ok4b;

  const allDone = done1 && done2 && done3 && done4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  // Changing any box after a Check hides the old verdict until Check is pressed again.
  const edit = (set: (v: string) => void, clear: (v: boolean) => void) => (v: string) => {
    set(v);
    clear(false);
  };

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for Understanding: answer these before you try practice problems.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> 0.5 is 5 <Pick value={a1} onChange={edit(setA1, setC1)} options={["ones", "tenths", "hundredths"]} ok={ok1a} show={c1} label="0.5 is 5 what" disabled={done1} />, which is the same amount as{" "}
          <Pick value={a2} onChange={edit(setA2, setC1)} options={["5", "50", "500"]} ok={ok1b} show={c1} label="How many hundredths" disabled={done1} /> hundredths.
        </p>
        <button className="btn primary" type="button" disabled={done1 || !f1} onClick={() => setC1(true)}>
          Check Answer
        </button>
        {c1 && f1 && (
          <p className={`feedback ${done1 ? "good" : "bad"}`} role="alert">
            {done1 ? "Correct — each tenth is 10 hundredths, so 0.5 = 50 hundredths = 0.50. Writing a decimal with two digits makes it easy to compare." : "Not quite — the 5 is right after the point. Which place is that, and how many hundredths is each one?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> True or false: 0.5 is less than 0.36, because 0.5 has fewer digits.{" "}
          <Pick value={b1} onChange={edit(setB1, setC2)} options={["True", "False"]} ok={ok2a} show={c2} label="True or false" disabled={done2} />
        </p>
        <p>
          On a number line, 0.5 is to the <Pick value={b2} onChange={edit(setB2, setC2)} options={["left", "right"]} ok={ok2b} show={c2} label="Left or right" disabled={done2} /> of 0.36.
        </p>
        <button className="btn primary" type="button" disabled={done2 || !f2} onClick={() => setC2(true)}>
          Check Answer
        </button>
        {c2 && f2 && (
          <>
            <p className={`feedback ${done2 ? "good" : "bad"}`} role="alert">
              {done2
                ? "Correct — it's false. 0.5 = 0.50 = 50 hundredths, and 0.36 is only 36 hundredths. On the line, 0.5 is farther right, so 0.5 > 0.36. More digits doesn't mean bigger."
                : "Not quite — look at the number line below. Which dot is farther to the right?"}
            </p>
            <DecimalNumberLine
              fromWhole={0}
              points={[
                { hundredths: 36, label: "0.36", tone: "c" },
                { hundredths: 50, label: "0.5", tone: "a" },
              ]}
            />
          </>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> Mia has 0.5 of a 10 cm ribbon. Leo has 0.5 of a 100 cm ribbon.
        </p>
        <div className="dec-visual-stack">
          <FractionBar numerator={5} denominator={10} width={48} height={28} label="Mia: 0.5 of 10 cm" />
          <FractionBar numerator={5} denominator={10} width={480} height={28} label="Leo: 0.5 of 100 cm" />
        </div>
        <p>Mia says, &ldquo;We have the same amount of ribbon, because 0.5 = 0.5.&rdquo; Is she right?</p>
        <div className="control-row">
          {[
            { id: "yes", label: "Yes — 0.5 = 0.5, so the amounts are equal" },
            { id: "no", label: "No — the ribbons are different lengths" },
          ].map((opt) => (
            <button key={opt.id} type="button" className={`btn ghost ${q3 === opt.id ? "pressed" : ""}`} disabled={done3} onClick={() => setQ3(opt.id)}>
              {opt.label}
            </button>
          ))}
        </div>
        {q3 && (
          <p className={`feedback ${done3 ? "good" : "bad"}`} role="alert">
            {done3
              ? "Correct — two decimals can only be compared when they are parts of the SAME whole. Mia has 5 cm; Leo has 50 cm."
              : "Not quite — look at the two ribbons themselves. Is half of the short one as long as half of the long one?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>4.</b> In 2.45 and 2.49, the ones and the tenths match, so the{" "}
          <Pick value={d1} onChange={edit(setD1, setC4)} options={["ones", "tenths", "hundredths"]} ok={ok4a} show={c4} label="Which place decides" disabled={done4} /> place decides, and 2.45{" "}
          <Pick value={d2} onChange={edit(setD2, setC4)} options={SYMBOLS} ok={ok4b} show={c4} label="Symbol" disabled={done4} /> 2.49.
        </p>
        <button className="btn primary" type="button" disabled={done4 || !f4} onClick={() => setC4(true)}>
          Check Answer
        </button>
        {c4 && f4 && (
          <p className={`feedback ${done4 ? "good" : "bad"}`} role="alert">
            {done4 ? "Correct — go left to right and stop at the first place that's different: 5 hundredths < 9 hundredths, so 2.45 < 2.49." : "Not quite — go left to right: ones (2, 2), tenths (4, 4), hundredths (5, 9). Where do they first differ?"}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

type Mode = "same" | "different";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<Mode>("same");
  // Stored in hundredths; the Steppers show/step decimals.
  const [a, setA] = useState(50);
  const [b, setB] = useState(36);
  const [mia, setMia] = useState(8);
  const [leo, setLeo] = useState(3);
  const sym = compareSymbol(a, b);
  const toH = (v: number) => Math.round(v * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button
          type="button"
          className="btn ghost"
          style={{ width: "fit-content", ...(showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
          onClick={() => setShowCheck((v) => !v)}
        >
          Check for Understanding
        </button>
      )}
      {(introActive || showCheck) && <ComparingCheck onComplete={onIntroDone} />}
      <Segmented
        label="Mode"
        value={mode}
        onChange={setMode}
        options={[
          { id: "same", label: "Same whole" },
          { id: "different", label: "Different-size wholes" },
        ]}
      />
      {mode === "same" ? (
        <>
          <p>Pick two decimals (or drag the dots). The one farther RIGHT on the number line is bigger — no matter how many digits it has.</p>
          <div className="control-row">
            <Stepper label="First decimal" value={a / 100} min={0} max={1} step={0.01} onChange={(v) => setA(toH(v))} tone="a" />
            <Stepper label="Second decimal" value={b / 100} min={0} max={1} step={0.01} onChange={(v) => setB(toH(v))} tone="c" />
          </div>
          <DecimalNumberLine
            fromWhole={0}
            points={[
              { hundredths: a, label: shortDecimal(a), tone: "a", onChange: setA },
              { hundredths: b, label: shortDecimal(b), tone: "c", onChange: setB },
            ]}
          />
          <div className="control-row">
            <GridRow size={120} segments={[{ count: a, tone: "a" }]} caption={`${shortDecimal(a)} = ${a} hundredths`} />
            <GridRow size={120} segments={[{ count: b, tone: "c" }]} caption={`${shortDecimal(b)} = ${b} hundredths`} />
          </div>
          <p className="says">
            <QA>{shortDecimal(a)}</QA> {sym} <QC>{shortDecimal(b)}</QC>
          </p>
          <p className="muted small">
            As hundredths: {decimalText(a, 2)} {sym} {decimalText(b, 2)}. Try 0.5 and 0.36, or 0.5 and 0.49 — the shorter decimal wins.
          </p>
        </>
      ) : (
        <>
          <p>Two ribbons that are NOT the same length. Compare how much ribbon each person really has.</p>
          <div className="control-row">
            <Stepper label="Mia: tenths of a 10 cm ribbon" value={mia} min={0} max={10} onChange={setMia} tone="a" />
            <Stepper label="Leo: tenths of a 100 cm ribbon" value={leo} min={0} max={10} onChange={setLeo} tone="c" />
          </div>
          <DiffWholeBars s={{ thing: "ribbon", unit: "cm", smallName: "Mia", bigName: "Leo", smallTenths: mia, bigTenths: leo }} />
          <p className="says">
            Mia: {mia}/10 of 10 cm = {mia} cm · Leo: {leo}/10 of 100 cm = {10 * leo} cm
          </p>
          <p className="muted small">
            Even when Mia&apos;s decimal is bigger (or the same), Leo can have more ribbon — decimals only compare fairly when they&apos;re parts of the SAME whole.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — same number of digits
// ============================================================================

function sameDigitsProblem(): Problem {
  const { a, b } = sameDigitsPair();
  const da = decimalText(a, 2);
  const db = decimalText(b, 2);
  const sym = compareSymbol(a, b);
  const tenthsDiffer = Math.floor(a / 10) !== Math.floor(b / 10);
  return {
    title: "Same number of digits",
    bucket: "same-digits",
    story: `Compare ${da} and ${db}.`,
    visual: (done) => (
      <div className="dec-visual-stack">
        <PlaceValueChart rows={[row(a, 2), row(b, 2)]} />
        {done >= 2 && (
          <DecimalNumberLine
            fromWhole={0}
            points={[
              { hundredths: a, label: da, tone: "a" },
              { hundredths: b, label: db, tone: "c" },
            ]}
          />
        )}
      </div>
    ),
    steps: [
      choice(
        {
          prompt: "Going left to right, which place is the first one where the digits are different?",
          hint: "Both have 0 ones. Look at the tenths column, then the hundredths column.",
          explain: tenthsDiffer ? "The tenths are different, so the tenths decide." : "The tenths match, so the hundredths decide.",
        },
        tenthsDiffer ? "tenths" : "hundredths",
        [tenthsDiffer ? "hundredths" : "tenths", "ones"]
      ),
      choice(
        {
          prompt: `Which symbol goes in the blank? ${da} ___ ${db}`,
          hint: "The open side of the symbol faces the bigger number.",
          explain: `${a} hundredths ${sym} ${b} hundredths, so ${da} ${sym} ${db}.`,
        },
        sym,
        SYMBOLS
      ),
    ],
    wrapUp: `${da} ${sym} ${db}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — fewer digits but bigger (the classic trap)
// ============================================================================

function fewerDigitsProblem(): Problem {
  const { short, long } = fewerDigitsPair();
  const ds = shortDecimal(short);
  const ds2 = decimalText(short, 2);
  const dl = decimalText(long, 2);
  const shortFirst = Math.random() < 0.5;
  const [x, y] = shortFirst ? [short, long] : [long, short];
  const [dx, dy] = shortFirst ? [ds, dl] : [dl, ds];
  const sym = compareSymbol(x, y);
  const name = pick(["Ben", "Ava", "Kai", "Rosa"]);
  return {
    title: "Fewer digits, bigger number?",
    bucket: "fewer-digits-bigger",
    story: `Compare ${dx} and ${dy}.`,
    visual: (done) => (
      <div className="dec-visual-stack">
        <PlaceValueChart rows={shortFirst ? [row(short, 1, done >= 1), row(long, 2)] : [row(long, 2), row(short, 1, done >= 1)]} />
        {done >= 2 && (
          <DecimalNumberLine
            fromWhole={0}
            points={[
              { hundredths: short, label: ds, tone: "a" },
              { hundredths: long, label: dl, tone: "c" },
            ]}
          />
        )}
      </div>
    ),
    steps: [
      {
        kind: "number",
        answer: short,
        suffix: "hundredths",
        prompt: `First, ${ds} is the same as how many hundredths?`,
        hint: "Each tenth is 10 hundredths.",
        explain: `${ds} = ${short / 10} tenths = ${short} hundredths, so ${ds} = ${ds2}.`,
      },
      choice(
        {
          prompt: `Which symbol goes in the blank? ${dx} ___ ${dy}`,
          hint: `Compare ${short} hundredths with ${long} hundredths.`,
          explain: `${short} hundredths > ${long} hundredths, so ${dx} ${sym} ${dy}.`,
        },
        sym,
        SYMBOLS // the reversed symbol is exactly "longer decimal = bigger"
      ),
      choice(
        {
          prompt: `${name} says ${dl} is bigger because it has more digits. Is ${name} right?`,
          hint: "Look at the number line. Which dot is farther right?",
          explain: `No — ${ds} = ${ds2}, and ${ds2} > ${dl}. Count the size of the pieces, not the number of digits.`,
        },
        `No — ${ds} = ${ds2}, which is more than ${dl}`,
        [
          "Yes — more digits always means a bigger number", // the named misconception
          `Yes — ${dl} has a hundredths digit and ${ds} doesn't`, // "an extra place adds value"
        ]
      ),
    ],
    wrapUp: `${dx} ${sym} ${dy} — ${ds} is really ${ds2}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — same whole-number part
// ============================================================================

function sameWholePartProblem(): Problem {
  const { a, b, w } = sameWholePartPair();
  const da = decimalText(a, 2);
  const db = decimalText(b, 2);
  const sym = compareSymbol(a, b);
  const tenthsDiffer = Math.floor((a % 100) / 10) !== Math.floor((b % 100) / 10);
  return {
    title: "Same whole number",
    bucket: "same-whole-part",
    story: `Compare ${da} and ${db}.`,
    visual: (done) => (
      <div className="dec-visual-stack">
        <PlaceValueChart rows={[row(a, 2), row(b, 2)]} />
        {done >= 2 && (
          <DecimalNumberLine
            fromWhole={w}
            points={[
              { hundredths: a, label: da, tone: "a" },
              { hundredths: b, label: db, tone: "c" },
            ]}
          />
        )}
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `Both numbers have ${w} ones. Which place decides which is bigger?`,
          hint: "Go left to right and stop at the first place where the digits are different.",
          explain: tenthsDiffer ? "The tenths are different, so the tenths decide." : "The tenths match too, so the hundredths decide.",
        },
        tenthsDiffer ? "tenths" : "hundredths",
        [
          "ones", // didn't notice the ones match
          tenthsDiffer ? "hundredths" : "tenths",
        ]
      ),
      choice(
        {
          prompt: `Which symbol goes in the blank? ${da} ___ ${db}`,
          hint: "The open side of the symbol faces the bigger number.",
          explain: `Same ${w} ones; ${a % 100} hundredths ${sym} ${b % 100} hundredths, so ${da} ${sym} ${db}.`,
        },
        sym,
        SYMBOLS
      ),
    ],
    wrapUp: `${da} ${sym} ${db}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — different-size wholes (can't compare by decimals alone)
// ============================================================================

function diffWholeProblem(): Problem {
  const s = diffWholeScenario();
  const equal = s.smallTenths === s.bigTenths;
  return {
    title: "Same whole?",
    bucket: "different-wholes",
    story: `${s.smallName} has 0.${s.smallTenths} of a 10 ${s.unit} ${s.thing}. ${s.bigName} has 0.${s.bigTenths} of a 100 ${s.unit} ${s.thing}. ${s.smallName} says, "${equal ? `We have the same amount, because 0.${s.smallTenths} = 0.${s.bigTenths}` : `I have more, because 0.${s.smallTenths} > 0.${s.bigTenths}`}."`,
    visual: () => <DiffWholeBars s={s} />,
    steps: [
      choice(
        {
          prompt: `Can you tell who has more ${s.thing} just by comparing 0.${s.smallTenths} and 0.${s.bigTenths}?`,
          hint: `Are the two ${s.thing}s the same length?`,
          explain: "No — decimals only compare fairly when they're parts of the same whole.",
        },
        `No — the ${s.thing}s are different lengths`,
        [
          equal ? "Yes — equal decimals always mean equal amounts" : "Yes — the bigger decimal always means more",
          "Yes — both are split into tenths, so it's fair",
        ]
      ),
      {
        kind: "number",
        answer: s.smallTenths,
        suffix: s.unit,
        prompt: `How long is ${s.smallName}'s piece? (One tenth of 10 ${s.unit} is 1 ${s.unit}.)`,
        hint: `0.${s.smallTenths} means ${s.smallTenths} tenths. Each tenth is 1 ${s.unit}.`,
        explain: `${s.smallTenths} tenths × 1 ${s.unit} = ${s.smallTenths} ${s.unit}.`,
      },
      {
        kind: "number",
        answer: 10 * s.bigTenths,
        suffix: s.unit,
        prompt: `How long is ${s.bigName}'s piece? (One tenth of 100 ${s.unit} is 10 ${s.unit}.)`,
        hint: `0.${s.bigTenths} means ${s.bigTenths} tenths. Each tenth is 10 ${s.unit}.`,
        explain: `${s.bigTenths} tenths × 10 ${s.unit} = ${10 * s.bigTenths} ${s.unit}.`,
      },
    ],
    wrapUp: `${s.bigName} has more: ${10 * s.bigTenths} ${s.unit} > ${s.smallTenths} ${s.unit}, even though 0.${s.bigTenths} ${equal ? "=" : "<"} 0.${s.smallTenths}.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <DecimalNumberLine
      fromWhole={0}
      points={[
        { hundredths: 36, label: "0.36", tone: "c" },
        { hundredths: 50, label: "0.5", tone: "a" },
      ]}
    />
  );
}

export const comparingDecimals: Unit = {
  id: "comparingDecimals",
  title: "Comparing Decimals",
  goal: "Compare two decimals to the hundredths by thinking about their size, and prove it with a number line or grid.",
  standard: "4.NF.7",
  keyIdea: (
    <>
      <p>More digits does NOT mean bigger: 0.5 = 0.50, and 50 hundredths &gt; 36 hundredths, so 0.5 &gt; 0.36.</p>
      <p>Compare place by place from the left. And only compare decimals of the SAME whole — 0.5 of a short ribbon is less than 0.5 of a long one.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["same-digits", "fewer-digits-bigger", "same-whole-part", "different-wholes"],
  problems: [
    { label: "Same digits", make: sameDigitsProblem, buckets: ["same-digits"] },
    { label: "Fewer digits", make: fewerDigitsProblem, buckets: ["fewer-digits-bigger"] },
    { label: "Same whole number", make: sameWholePartProblem, buckets: ["same-whole-part"] },
    { label: "Same whole?", make: diffWholeProblem, buckets: ["different-wholes"] },
  ],
  test: comparingDecimalsTest,
};
