import { useEffect, useState } from "react";
import { DecimalNumberLine, GridRow, PlaceValueChart, type GridSegment } from "../diagrams";
import { decimalText, decimalWords, mixedDecimal, numberWords, twoDigitHundredths } from "../lib/decimals";
import { randInt } from "../../../shared/lib/math";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";
import { choice, numberBlank, sentence, type Problem } from "../../../shared/engine/types";
import { Frac, QA, QB, QC, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { decimalNotationTest } from "./DecimalNotationTest";
import { MathText } from "../../../shared/components/MathText";

/** Wholes (tone b), whole tenth strips (tone a), loose hundredths (tone c) —
 *  the same three colors the place-value chart uses for its digits. */
const amountSegments = (h: number): GridSegment[] => {
  const w = Math.floor(h / 100);
  const r = h % 100;
  return [
    { count: 100 * w, tone: "b" },
    { count: r - (r % 10), tone: "a" },
    { count: r % 10, tone: "c" },
  ];
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
 *  1. vocabulary — name the tenths and hundredths places in 0.47
 *  2. the plan's named trap — 0.7 vs 0.07: name each, then say which is bigger
 *  3. generalization — WHERE a zero goes matters: 0.5 = 0.50, but 0.5 ≠ 0.05
 *  4. mixed numbers — 3 4/10 vs 3 4/100 as decimals
 */
function NotationCheck({ onComplete }: { onComplete?: () => void }) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [c1, setC1] = useState(false);
  const f1 = allFilled(p1, p2);
  const ok1a = p1 === "tenths";
  const ok1b = p2 === "hundredths";
  const done1 = c1 && ok1a && ok1b;

  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");
  const [big, setBig] = useState("");
  const [c2, setC2] = useState(false);
  const f2 = allFilled(m1, m2, big);
  const ok2a = m1 === "tenths";
  const ok2b = m2 === "hundredths";
  const ok2c = big === "0.7";
  const done2 = c2 && ok2a && ok2b && ok2c;

  const [z1, setZ1] = useState("");
  const [z2, setZ2] = useState("");
  const [c3, setC3] = useState(false);
  const f3 = allFilled(z1, z2);
  const ok3a = z1 === "equal";
  const ok3b = z2 === "not equal";
  const done3 = c3 && ok3a && ok3b;

  const [x1, setX1] = useState("");
  const [x2, setX2] = useState("");
  const [c4, setC4] = useState(false);
  const f4 = allFilled(x1, x2);
  const ok4a = x1 === "3.4";
  const ok4b = x2 === "3.04";
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
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for Understanding: answer these before you try practice problems.</p>

        <div className="align-stack-wrap">
          <p>
            <b>1.</b> In <b>0.47</b>, the 4 is in the{" "}
            <Pick value={p1} onChange={edit(setP1, setC1)} options={["ones", "tenths", "hundredths"]} ok={ok1a} show={c1} label="Place of the 4" disabled={done1} /> place, and the 7 is in the{" "}
            <Pick value={p2} onChange={edit(setP2, setC1)} options={["ones", "tenths", "hundredths"]} ok={ok1b} show={c1} label="Place of the 7" disabled={done1} /> place.
          </p>
          <button className="btn primary" type="button" disabled={done1 || !f1} onClick={() => setC1(true)}>
            Check Answer
          </button>
          {c1 && f1 && (
            <p className={`feedback ${done1 ? "good" : "bad"}`} role="alert">
              {done1 ? "Correct — the first place after the point is tenths, the second is hundredths. 0.47 = 4 tenths + 7 hundredths = 47/100." : "Not quite — count places to the RIGHT of the point: first tenths, then hundredths."}
            </p>
          )}
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Compare <b>0.7</b> and <b>0.07</b>.
          </p>
          <div className="control-row">
            <GridRow size={110} segments={[{ count: 70, tone: "a" }]} caption="0.7" />
            <GridRow size={110} segments={[{ count: 7, tone: "c" }]} caption="0.07" />
          </div>
          <p>
            0.7 means 7 <Pick value={m1} onChange={edit(setM1, setC2)} options={["tenths", "hundredths"]} ok={ok2a} show={c2} label="0.7 means 7 what" disabled={done2} />, and 0.07 means 7{" "}
            <Pick value={m2} onChange={edit(setM2, setC2)} options={["tenths", "hundredths"]} ok={ok2b} show={c2} label="0.07 means 7 what" disabled={done2} />. So{" "}
            <Pick value={big} onChange={edit(setBig, setC2)} options={["0.7", "0.07", "neither — they're equal"]} ok={ok2c} show={c2} label="Which is bigger" disabled={done2} /> is bigger.
          </p>
          <button className="btn primary" type="button" disabled={done2 || !f2} onClick={() => setC2(true)}>
            Check Answer
          </button>
          {c2 && f2 && (
            <p className={`feedback ${done2 ? "good" : "bad"}`} role="alert">
              {done2
                ? "Correct — the extra 0 in 0.07 holds the tenths place empty and pushes the 7 into the hundredths place. 7 tenths = 70 hundredths, ten times as much as 7 hundredths."
                : "Not quite — in each number, which place is the 7 in? Look at the two pictures: 7 strips or 7 tiny squares?"}
            </p>
          )}
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Does a zero change a decimal? It depends where it goes.
          </p>
          <p>
            0.5 and 0.50 are <Pick value={z1} onChange={edit(setZ1, setC3)} options={["equal", "not equal"]} ok={ok3a} show={c3} label="0.5 and 0.50" disabled={done3} />. 0.5 and 0.05 are{" "}
            <Pick value={z2} onChange={edit(setZ2, setC3)} options={["equal", "not equal"]} ok={ok3b} show={c3} label="0.5 and 0.05" disabled={done3} />.
          </p>
          <button className="btn primary" type="button" disabled={done3 || !f3} onClick={() => setC3(true)}>
            Check Answer
          </button>
          {c3 && f3 && (
            <p className={`feedback ${done3 ? "good" : "bad"}`} role="alert">
              {done3
                ? "Correct — a zero at the END just says \"0 more hundredths\": 0.5 = 5 tenths = 50 hundredths = 0.50. A zero right AFTER THE POINT pushes the 5 into the hundredths place: 0.05 is only 5 hundredths."
                : "Not quite — write each one as hundredths: 0.5 = 50 hundredths, 0.50 = ? hundredths, 0.05 = ? hundredths."}
            </p>
          )}
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Write each mixed number as a decimal.
          </p>
          <p>
            3 <Frac n={4} d={10} /> = <Pick value={x1} onChange={edit(setX1, setC4)} options={["3.4", "3.04", "0.34", "4.3"]} ok={ok4a} show={c4} label="3 and 4 tenths as a decimal" disabled={done4} />, and 3{" "}
            <Frac n={4} d={100} /> = <Pick value={x2} onChange={edit(setX2, setC4)} options={["3.4", "3.04", "0.34", "4.3"]} ok={ok4b} show={c4} label="3 and 4 hundredths as a decimal" disabled={done4} />.
          </p>
          <button className="btn primary" type="button" disabled={done4 || !f4} onClick={() => setC4(true)}>
            Check Answer
          </button>
          {c4 && f4 && (
            <p className={`feedback ${done4 ? "good" : "bad"}`} role="alert">
              {done4
                ? "Correct — the whole number goes before the point. 4 tenths go in the tenths place (3.4); 4 hundredths need a 0 in the tenths place first (3.04)."
                : "Not quite — whole number before the point, then tenths, then hundredths. Does 4/100 have any tenths?"}
            </p>
          )}
        </div>
      </div>
    </MathText>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [w, setW] = useState(0);
  const [t, setT] = useState(4);
  const [h, setH] = useState(7);
  const total = 100 * w + 10 * t + h;
  const r = 10 * t + h;

  const setFromLine = (hv: number) => {
    const nw = Math.min(3, Math.floor(hv / 100));
    const rest = Math.min(99, hv - 100 * nw);
    setW(nw);
    setT(Math.floor(rest / 10));
    setH(rest % 10);
  };

  return (
    <MathText>
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
        <p>
          A decimal is another way to write tenths and hundredths. The first digit after the point counts <QA>tenths</QA> (strips); the second counts <QC>hundredths</QC> (tiny squares).
        </p>
        <div className="control-row">
          <Stepper label="Ones" value={w} min={0} max={3} onChange={setW} tone="b" />
          <Stepper label="Tenths" value={t} min={0} max={9} onChange={setT} tone="a" />
          <Stepper label="Hundredths" value={h} min={0} max={9} onChange={setH} tone="c" />
        </div>
        <div className="control-row" style={{ alignItems: "center" }}>
          <PlaceValueChart rows={[{ ones: w, tenths: t, hundredths: h }]} />
          <p className="says" style={{ margin: 0 }}>
            <QB>{w}</QB>.<QA>{t}</QA>
            <QC>{h}</QC> = {w > 0 && <>{w} </>}
            <Frac n={r} d={100} />
            {h === 0 && (
              <>
                {" "}
                = {w > 0 && <>{w} </>}
                <Frac n={t} d={10} />
              </>
            )}
          </p>
        </div>
        <p className="muted small">Say it: &ldquo;{decimalWords(total, 2)}&rdquo;</p>
        <GridRow size={120} segments={amountSegments(total)} />
        <DecimalNumberLine fromWhole={w} points={[{ hundredths: total, label: decimalText(total, 2), tone: "a", onChange: setFromLine }]} />
        <p className="muted small">
          Try tenths = 0 and hundredths = 7: that&apos;s 0.07, and the 0 is what keeps the 7 in the hundredths place. Then try tenths = 7, hundredths = 0 — 0.70 is the same as 0.7.
        </p>
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <NotationCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — tenths fraction -> decimal
// ============================================================================

function tenthsProblem(): Problem {
  const n = randInt(1, 9);
  const word = numberWords(n);
  return {
    title: "Tenths as a decimal",
    bucket: "tenths",
    story: `Write ${n}/10 as a decimal.`,
    visual: (done) => (
      <div className="dec-visual-stack">
        <GridRow size={130} tenthsOnly segments={[{ count: 10 * n, tone: "a" }]} caption={`${n}/10`} />
        {/* The point would sit right on the "0.n" tick label, so the line only
            appears once that decimal has been typed. */}
        {done >= 1 && (
          <>
            <PlaceValueChart rows={[{ ones: 0, tenths: n }]} />
            <DecimalNumberLine fromWhole={0} showHundredths={false} points={[{ hundredths: 10 * n, tone: "a", label: `0.${n}` }]} />
          </>
        )}
      </div>
    ),
    steps: [
      {
        kind: "number",
        answer: n / 10,
        padTo: 1,
        prompt: (
          <>
            Write <Frac n={n} d={10} /> as a decimal, with one digit after the point.
          </>
        ),
        hint: "No wholes, so start with 0. The first place after the point is tenths.",
        explain: `${n} tenths = 0.${n}.`,
      },
      choice(
        {
          prompt: `How do you read 0.${n} out loud?`,
          hint: "Name it by the place of its last digit.",
          explain: `The ${n} is in the tenths place, so 0.${n} is "${word} tenths" — the same words as ${n}/10.`,
        },
        `${word} tenths`,
        [
          `${word} hundredths`, // mixed up the two places after the point
          `${word} wholes`, // ignored the decimal point
        ]
      ),
    ],
    wrapUp: `${n}/10 = 0.${n} = ${word} tenths.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — hundredths fraction -> decimal
// ============================================================================

function hundredthsProblem(): Problem {
  const m = twoDigitHundredths();
  const t = Math.floor(m / 10);
  const h = m % 10;
  const dec = decimalText(m, 2);
  return {
    title: "Hundredths as a decimal",
    bucket: "hundredths",
    story: `Write ${m}/100 as a decimal.`,
    visual: (done) => (
      <div className="dec-visual-stack">
        <GridRow size={130} segments={amountSegments(m)} caption={`${m}/100`} />
        {done >= 2 && <PlaceValueChart rows={[{ ones: 0, tenths: t, hundredths: h }]} />}
      </div>
    ),
    steps: [
      sentence(
        {
          prompt: `Split ${m}/100 into full tenth strips and leftover hundredths.`,
          hint: "Each full strip is 10 hundredths.",
          explain: `${m} = ${t} tens + ${h}, so ${m} hundredths = ${t} tenths and ${h} hundredths.`,
        },
        `${m}/100 = `,
        numberBlank(t),
        " tenths and ",
        numberBlank(h),
        " hundredths"
      ),
      {
        kind: "number",
        answer: m / 100,
        padTo: 2,
        prompt: "Now write it as a decimal, with two digits after the point.",
        hint: "Tenths digit first, then hundredths digit.",
        explain: `${t} tenths and ${h} hundredths = ${dec}.`,
      },
      choice(
        {
          prompt: `How do you read ${dec} out loud?`,
          hint: "Name the number by the place of its LAST digit.",
          explain: `The last digit is in the hundredths place, so ${dec} is "${numberWords(m)} hundredths".`,
        },
        `${numberWords(m)} hundredths`,
        [
          `${numberWords(m)} tenths`, // named it by the first place instead of the last
          `${numberWords(t)} and ${numberWords(h)} tenths`, // read the point as "and"
        ]
      ),
    ],
    wrapUp: `${m}/100 = ${dec} = ${numberWords(m)} hundredths.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — decimal -> fraction, with the hidden zero
// ============================================================================

function hiddenZeroProblem(): Problem {
  const h = randInt(1, 9);
  const dec = `0.0${h}`;
  return {
    title: "The hidden zero",
    bucket: "hidden-zero",
    story: `Write ${dec} as a fraction.`,
    visual: (done) => (
      <div className="dec-visual-stack">
        {done >= 1 && <PlaceValueChart rows={[{ ones: 0, tenths: 0, hundredths: h }]} />}
        <GridRow size={130} segments={[{ count: h, tone: "c" }]} />
        <DecimalNumberLine fromWhole={0} points={[{ hundredths: h, tone: "c", label: done >= 2 ? dec : undefined }, ...(done >= 3 ? [{ hundredths: 10 * h, tone: "a" as const, label: `0.${h}` }] : [])]} />
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `In ${dec}, which place is the ${h} in?`,
          hint: "Count places after the point: first tenths, then hundredths.",
          explain: `The 0 fills the tenths place, so the ${h} sits in the hundredths place.`,
        },
        "hundredths",
        [
          "tenths", // skipped over the 0, the classic hidden-zero mistake
          "ones",
        ]
      ),
      { ...sentence(
        {
          prompt: `Write ${dec} as a fraction, using the place of the last digit for the bottom number.`,
          hint: `${h} hundredths — what's the bottom number for hundredths?`,
          explain: `${dec} = ${h}/100 — NOT ${h}/10.`,
        },
        `${dec} = `,
        numberBlank(h),
        " / ",
        numberBlank(100),
        ""
      ), stacked: true },
      choice(
        {
          prompt: `Which is bigger: 0.${h} or ${dec}?`,
          hint: `0.${h} is ${h} tenths. How many hundredths is that?`,
          explain: `0.${h} = ${h} tenths = ${10 * h} hundredths, much more than ${h} hundredths. The 0 matters!`,
        },
        `0.${h}`,
        [
          dec, // "more digits means bigger"
          "They're equal", // "a zero doesn't change anything"
        ]
      ),
    ],
    wrapUp: `${dec} = ${h}/100, and 0.${h} = ${h}/10 — ten times as much.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — mixed numbers <-> decimals
// ============================================================================

function mixedProblem(): Problem {
  // Reroll so the swapped "part and whole" distractor can't equal the answer.
  let v = mixedDecimal();
  while (v.n === v.w) v = mixedDecimal();
  const { w, n, d, h, places } = v;
  const dec = decimalText(h, places);
  const unit = d === 10 ? "tenths" : "hundredths";
  const otherUnit = d === 10 ? "hundredths" : "tenths";
  const words = decimalWords(h, places);
  const toDecimal = Math.random() < 0.5;
  const readStep = choice(
    {
      prompt: `How do you read ${dec} out loud?`,
      hint: "Whole number, then \"and\", then the decimal part named by its last place.",
      explain: `${dec} is "${words}".`,
    },
    words,
    [
      `${numberWords(w)} and ${numberWords(n)} ${otherUnit}`, // wrong place name
      `${numberWords(n)} and ${numberWords(w)} ${unit}`, // swapped the whole and the part
    ]
  );
  return {
    title: toDecimal ? "Mixed number to decimal" : "Decimal to mixed number",
    bucket: "mixed",
    story: toDecimal ? `Write ${w} ${n}/${d} as a decimal.` : `Write ${dec} as a mixed number.`,
    visual: (done) => (
      <div className="dec-visual-stack">
        <GridRow size={84} segments={amountSegments(h)} />
        {/* Going TO a decimal, the line's tick labels would give the answer
            away, so it only appears after step 1 in that direction. */}
        {(!toDecimal || done >= 1) && <DecimalNumberLine fromWhole={w} showHundredths={d === 100} points={[{ hundredths: h, tone: "a", label: dec }]} />}
      </div>
    ),
    steps: toDecimal
      ? [
          {
            kind: "number",
            answer: h / 100,
            padTo: places,
            prompt: (
              <>
                Write {w} <Frac n={n} d={d} /> as a decimal, with {places === 1 ? "one digit" : "two digits"} after the point.
              </>
            ),
            hint: d === 100 && n < 10 ? "There are 0 tenths — something has to hold the tenths place." : "Whole number before the point, the fraction after it.",
            explain: `${w} ${n}/${d} = ${dec}.`,
          },
          readStep,
        ]
      : [
          { ...sentence(
            {
              prompt: `Write ${dec} as a mixed number, using the place of the last digit for the bottom number.`,
              hint: places === 2 && n < 10 ? "The digit right after the point is 0 — so how many tenths are there?" : "The digits after the point become the top number.",
              explain: `${dec} = ${w} ${n}/${d}.`,
            },
            `${dec} = ${w} and `,
            numberBlank(n),
            " / ",
            numberBlank(d),
            ""
          ), stacked: true },
          readStep,
        ],
    wrapUp: `${w} ${n}/${d} = ${dec} = ${words}.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <PlaceValueChart rows={[{ ones: 0, tenths: 4, hundredths: 7 }]} />
      <GridRow size={110} segments={amountSegments(47)} caption="47/100 = 0.47" />
    </div>
  );
}

export const decimalNotation: Unit = {
  id: "decimalNotation",
  title: "Decimal Notation",
  goal: "Write tenths and hundredths as decimals, and decimals as fractions — including mixed numbers and the hidden zero in 0.07.",
  standard: "4.NF.6",
  keyIdea: (
    <>
      <p>The first digit after the point is tenths; the second is hundredths. 3/10 = 0.3 and 47/100 = 0.47.</p>
      <p>7/100 has no tenths, so a 0 holds the tenths place: 0.07. Without it, 0.7 would mean 7 tenths — ten times as much.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["tenths", "hundredths", "hidden-zero", "mixed"],
  problems: [
    { label: "Tenths", make: tenthsProblem, buckets: ["tenths"] },
    { label: "Hundredths", make: hundredthsProblem, buckets: ["hundredths"] },
    { label: "Hidden zero", make: hiddenZeroProblem, buckets: ["hidden-zero"] },
    { label: "Mixed numbers", make: mixedProblem, buckets: ["mixed"] },
  ],
  test: decimalNotationTest,
};
