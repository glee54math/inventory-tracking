import { useEffect, useState } from "react";
import { GridRow } from "../diagrams";
import { tenthsHundredthsPair } from "../lib/decimals";
import { pick, randInt } from "../../../shared/lib/math";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";
import { choice, numberBlank, sentence, type Problem } from "../../../shared/engine/types";
import { Frac, QA, QC, Segmented, Slider, Stepper } from "../../../shared/engine/controls";
import { TapSelect } from "../../../shared/components/TapSelect";
import type { Unit } from "../../../shared/units/types";
import { tenthsToHundredthsTest } from "./TenthsToHundredthsTest";
import { MathText } from "../../../shared/components/MathText";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * Four fixed questions:
 *  1. vocabulary — name a tenth strip and count its hundredths (2 dropdowns)
 *  2. the plan's named trap — spot the error in 3/10 + 24/100 = 27/100 AND
 *     give the right total (2 dropdowns)
 *  3. generalization trap — "tenths + hundredths is always less than 1
 *     whole" (false: 7/10 + 80/100 = 150/100)
 *  4. convert-then-add in one sentence (2 dropdowns)
 */
function TenthsCheck({ onComplete }: { onComplete?: () => void }) {
  const [piece, setPiece] = useState("");
  const [count, setCount] = useState("");
  const [q1Checked, setQ1Checked] = useState(false);
  const q1Filled = allFilled(piece, count);
  const q1aOk = piece === "tenth";
  const q1bOk = count === "10";
  const q1Done = q1Checked && q1aOk && q1bOk;

  const [mistake, setMistake] = useState("");
  const [total, setTotal] = useState("");
  const [q2Checked, setQ2Checked] = useState(false);
  const q2Filled = allFilled(mistake, total);
  const q2aOk = mistake === "tops";
  const q2bOk = total === "54/100";
  const q2Done = q2Checked && q2aOk && q2bOk;

  const [q3, setQ3] = useState<string | null>(null);
  const q3Done = q3 === "false";

  const [conv, setConv] = useState("");
  const [sum, setSum] = useState("");
  const [q4Checked, setQ4Checked] = useState(false);
  const q4Filled = allFilled(conv, sum);
  const q4aOk = conv === "60";
  const q4bOk = sum === "65";
  const q4Done = q4Checked && q4aOk && q4bOk;

  const allDone = q1Done && q2Done && q3Done && q4Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for Understanding: answer these before you try practice problems.</p>

        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Look at the shaded strip.
          </p>
          <GridRow size={130} segments={[{ count: 10, tone: "a" }]} />
          <p>
            The shaded strip is one{" "}
            <select className="answer" value={piece} onChange={(e) => { setPiece(e.target.value); setQ1Checked(false); }} aria-label="Name of the strip" disabled={q1Done} style={answerBorder(q1aOk, q1Checked)}>
              <option value="" disabled>
                choose
              </option>
              <option value="hundredth">hundredth</option>
              <option value="tenth">tenth</option>
              <option value="whole">whole</option>
            </select>{" "}
            of the square, and it is made of{" "}
            <select className="answer" value={count} onChange={(e) => { setCount(e.target.value); setQ1Checked(false); }} aria-label="How many small squares" disabled={q1Done} style={answerBorder(q1bOk, q1Checked)}>
              <option value="" disabled>
                choose
              </option>
              <option value="1">1</option>
              <option value="10">10</option>
              <option value="100">100</option>
            </select>{" "}
            hundredths squares.
          </p>
          <button className="btn primary" type="button" disabled={q1Done || !q1Filled} onClick={() => setQ1Checked(true)}>
            Check Answer
          </button>
          {q1Checked && q1Filled && (
            <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
              {q1Done
                ? "Correct — the square is cut into 10 strips, so one strip is a tenth. Each strip holds 10 tiny squares, and there are 100 tiny squares in all, so 1/10 = 10/100."
                : "Not quite — count the strips across the whole square, then count the tiny squares in one strip."}
            </p>
          )}
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Sam wrote: <Frac n={3} d={10} /> + <Frac n={24} d={100} /> = <Frac n={27} d={100} />
          </p>
          <p>
            Sam&apos;s mistake: he{" "}
            <select className="answer" value={mistake} onChange={(e) => { setMistake(e.target.value); setQ2Checked(false); }} aria-label="Sam's mistake" disabled={q2Done} style={answerBorder(q2aOk, q2Checked)}>
              <option value="" disabled>
                choose
              </option>
              <option value="bottoms">forgot to add the bottom numbers too</option>
              <option value="tops">added top numbers of different-size pieces</option>
              <option value="none">made no mistake</option>
            </select>
            . The right total is{" "}
            {/* Fraction choices are tap buttons: a dropdown can't show a stacked fraction. */}
            <TapSelect
              value={total}
              onChange={(e) => {
                if (q2Done) return;
                setTotal(e.target.value);
                setQ2Checked(false);
              }}
              aria-label="Right total"
              style={answerBorder(q2bOk, q2Checked)}
            >
              <option value="27/100">27/100</option>
              <option value="27/10">27/10</option>
              <option value="54/100">54/100</option>
              <option value="324/100">324/100</option>
            </TapSelect>
            .
          </p>
          <button className="btn primary" type="button" disabled={q2Done || !q2Filled} onClick={() => setQ2Checked(true)}>
            Check Answer
          </button>
          {q2Checked && q2Filled && (
            <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
              {q2Done
                ? "Correct — 3 tenths and 24 hundredths are different-size pieces, so you can't just add 3 + 24. Rewrite first: 3/10 = 30/100, then 30/100 + 24/100 = 54/100."
                : "Not quite — is a tenth the same size as a hundredth? Rewrite 3/10 as hundredths before adding."}
            </p>
          )}
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>3.</b> True or false: When you add a tenths fraction and a hundredths fraction, the total is always less than 1 whole.
          </p>
          <div className="control-row">
            {[
              { id: "true", label: "True" },
              { id: "false", label: "False" },
            ].map((opt) => (
              <button key={opt.id} type="button" className={`btn ghost ${q3 === opt.id ? "pressed" : ""}`} disabled={q3Done} onClick={() => setQ3(opt.id)}>
                {opt.label}
              </button>
            ))}
          </div>
          {q3 && (
            <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
              {q3Done
                ? "Correct — it can go past 1 whole. 7/10 + 80/100 = 70/100 + 80/100 = 150/100, which is 1 whole and 50/100."
                : "Not quite — try 7/10 + 80/100. Rewrite 7/10 as hundredths and add. Is it less than 100/100?"}
            </p>
          )}
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Fill in both blanks.
          </p>
          <p>
            <Frac n={6} d={10} /> ={" "}
            <Frac
              n={
                <select className="answer" value={conv} onChange={(e) => { setConv(e.target.value); setQ4Checked(false); }} aria-label="6 tenths as hundredths" disabled={q4Done} style={answerBorder(q4aOk, q4Checked)}>
                  <option value="" disabled>
                    choose
                  </option>
                  <option value="6">6</option>
                  <option value="16">16</option>
                  <option value="60">60</option>
                  <option value="600">600</option>
                </select>
              }
              d={100}
            />, so <Frac n={6} d={10} /> + <Frac n={5} d={100} /> ={" "}
            <Frac
              n={
                <select className="answer" value={sum} onChange={(e) => { setSum(e.target.value); setQ4Checked(false); }} aria-label="The total in hundredths" disabled={q4Done} style={answerBorder(q4bOk, q4Checked)}>
                  <option value="" disabled>
                    choose
                  </option>
                  <option value="11">11</option>
                  <option value="56">56</option>
                  <option value="65">65</option>
                  <option value="605">605</option>
                </select>
              }
              d={100}
            />.
          </p>
          <button className="btn primary" type="button" disabled={q4Done || !q4Filled} onClick={() => setQ4Checked(true)}>
            Check Answer
          </button>
          {q4Checked && q4Filled && (
            <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
              {q4Done
                ? "Correct — 6 tenths is 60 hundredths, and 60 hundredths + 5 hundredths = 65 hundredths."
                : "Not quite — each tenth is 10 hundredths. Rewrite 6/10 first, then add the 5 hundredths."}
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

type Mode = "rewrite" | "add";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<Mode>("rewrite");
  const [n, setN] = useState(3);
  const [a, setA] = useState(3);
  const [b, setB] = useState(24);
  const s = 10 * a + b;

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
          A whole square can be cut into 10 strips (<b>tenths</b>) or 100 tiny squares (<b>hundredths</b>). Every tenth strip is exactly 10 hundredths.
        </p>
        <Segmented
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { id: "rewrite", label: "Tenths as hundredths" },
            { id: "add", label: "Add tenths + hundredths" },
          ]}
        />
        {mode === "rewrite" ? (
          <>
            <div className="control-row">
              <Stepper label="Tenths" value={n} min={0} max={10} onChange={setN} tone="a" />
            </div>
            <div className="control-row">
              <GridRow size={150} tenthsOnly segments={[{ count: 10 * n, tone: "a" }]} caption={`${n}/10 — ${n} tenth strip${n === 1 ? "" : "s"}`} />
              <GridRow size={150} segments={[{ count: 10 * n, tone: "a" }]} caption={`${10 * n}/100 — ${10 * n} hundredths squares`} />
            </div>
            <p className="says">
              <QA>
                <Frac n={n} d={10} />
              </QA>{" "}
              ={" "}
              <QA>
                <Frac n={10 * n} d={100} />
              </QA>
            </p>
            <p className="muted small">Same shaded amount, two names. Multiply the top and the bottom by 10 to rename tenths as hundredths.</p>
          </>
        ) : (
          <>
            <div className="control-row">
              <Stepper label="Tenths" value={a} min={0} max={9} onChange={setA} tone="a" />
              <Slider label="Hundredths" value={b} min={0} max={99} onChange={setB} />
            </div>
            <GridRow size={150} segments={[{ count: 10 * a, tone: "a" }, { count: b, tone: "c" }]} />
            <p className="says">
              <QA>
                <Frac n={a} d={10} />
              </QA>{" "}
              +{" "}
              <QC>
                <Frac n={b} d={100} />
              </QC>{" "}
              ={" "}
              <QA>
                <Frac n={10 * a} d={100} />
              </QA>{" "}
              +{" "}
              <QC>
                <Frac n={b} d={100} />
              </QC>{" "}
              = <Frac n={s} d={100} />
              {s >= 100 && (
                <>
                  {" "}
                  = 1 whole and <Frac n={s - 100} d={100} />
                </>
              )}
            </p>
            <p className="muted small">
              Rename the tenths as hundredths FIRST — then every piece is the same size and you can add the top numbers. Past 100 hundredths, a second whole square starts filling.
            </p>
          </>
        )}
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <TenthsCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — rewrite tenths as hundredths (or back)
// ============================================================================

const WHY_CORRECT = "Each tenth is cut into 10 hundredths, so the amount stays the same";
const WHY_WRONG = [
  "Hundredths are bigger pieces, so you need more of them", // piece-size mix-up
  "Putting a zero on any number never changes it", // over-generalized "add a zero" trick
];

function convertProblem(): Problem {
  const n = randInt(1, 9);
  const forward = Math.random() < 0.5;
  return {
    title: forward ? "Tenths as hundredths" : "Hundredths as tenths",
    bucket: "convert",
    story: forward ? `Rewrite ${n}/10 as hundredths.` : `Rewrite ${10 * n}/100 as tenths.`,
    visual: (done) => (
      <GridRow
        size={140}
        tenthsOnly={forward && done === 0}
        segments={[{ count: 10 * n, tone: "a" }]}
        caption={done >= 1 ? `${n}/10 = ${10 * n}/100` : forward ? `${n}/10` : `${10 * n}/100`}
      />
    ),
    steps: [
      forward
        ? {
            kind: "number",
            answer: 10 * n,
            suffix: "hundredths",
            prompt: (
              <>
                <Frac n={n} d={10} /> = <Frac n="?" d={100} /> — type the missing top number.
              </>
            ),
            hint: "Each tenth strip holds 10 hundredths squares.",
            explain: `${n} strips × 10 squares each = ${10 * n} hundredths.`,
          }
        : {
            kind: "number",
            answer: n,
            suffix: "tenths",
            prompt: (
              <>
                <Frac n="?" d={10} /> = <Frac n={10 * n} d={100} /> — type the missing top number.
              </>
            ),
            hint: "Every 10 hundredths squares fill one tenth strip.",
            explain: `${10 * n} hundredths ÷ 10 per strip = ${n} tenths.`,
          },
      choice(
        {
          prompt: `Why is ${n}/10 equal to ${10 * n}/100?`,
          hint: "Look at one strip in the picture. How many tiny squares is it?",
          explain: "One tenth = 10 hundredths, so the shaded amount doesn't change — only the size of the pieces we count with.",
        },
        WHY_CORRECT,
        WHY_WRONG
      ),
    ],
    wrapUp: `${n}/10 = ${10 * n}/100 — same amount, counted in smaller pieces.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — add tenths + hundredths (total under one whole)
// ============================================================================

function addProblem(): Problem {
  // Half the time a single-digit hundredths amount (3/10 + 4/100), where
  // "just add the tops" (7) looks most like the right answer (34).
  const { a, b } = tenthsHundredthsPair(Math.random() < 0.5 ? "add" : "small");
  const s = 10 * a + b;
  const tenthsFirst = Math.random() < 0.5;
  const expr = tenthsFirst ? `${a}/10 + ${b}/100` : `${b}/100 + ${a}/10`;
  const name = pick(["Ava", "Ben", "Kai", "Rosa"]);
  return {
    title: "Add tenths and hundredths",
    bucket: "add",
    story: `Find ${expr}.`,
    visual: (done) => (
      <GridRow size={140} segments={[{ count: 10 * a, tone: "a" }, { count: b, tone: "c" }]} caption={done >= 2 ? `${expr} = ${s}/100` : expr} />
    ),
    steps: [
      {
        kind: "number",
        answer: 10 * a,
        suffix: "hundredths",
        prompt: (
          <>
            First rename the tenths: <Frac n={a} d={10} /> = <Frac n="?" d={100} />
          </>
        ),
        hint: "Each tenth is 10 hundredths.",
        explain: `${a}/10 = ${10 * a}/100. Now both fractions count hundredths.`,
      },
      {
        kind: "number",
        answer: s,
        suffix: "hundredths",
        prompt: (
          <>
            Now add: <Frac n={10 * a} d={100} /> + <Frac n={b} d={100} /> = <Frac n="?" d={100} />
          </>
        ),
        hint: `Same-size pieces now — add ${10 * a} + ${b}.`,
        explain: `${10 * a} + ${b} = ${s}, so the total is ${s}/100.`,
      },
      choice(
        {
          prompt: `${name} wrote ${a}/10 + ${b}/100 = ${a + b}/100. What went wrong?`,
          hint: "Did they rename the tenths first?",
          explain: `${name} added ${a} tenths to ${b} hundredths as if they were the same size. Renaming first gives ${s}/100.`,
        },
        `Added the top numbers before renaming ${a}/10 as hundredths`,
        [
          "Should have added the bottom numbers too", // "add everything" misconception
          "Nothing — that answer is right", // accepts the add-the-tops shortcut
        ]
      ),
    ],
    wrapUp: `${expr} = ${10 * a}/100 + ${b}/100 = ${s}/100.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — add tenths + hundredths, going past one whole
// ============================================================================

function carryProblem(): Problem {
  const { a, b } = tenthsHundredthsPair("carry");
  const s = 10 * a + b;
  const tenthsFirst = Math.random() < 0.5;
  const expr = tenthsFirst ? `${a}/10 + ${b}/100` : `${b}/100 + ${a}/10`;
  return {
    title: "More than one whole",
    bucket: "carry",
    story: `Find ${expr}.`,
    visual: (done) => (
      <GridRow
        size={130}
        segments={[{ count: 10 * a, tone: "a" }, { count: b, tone: "c" }]}
        caption={done >= 3 ? `${s}/100 = 1 whole and ${s - 100}/100` : done >= 2 ? `${expr} = ${s}/100` : expr}
      />
    ),
    steps: [
      {
        kind: "number",
        answer: 10 * a,
        suffix: "hundredths",
        prompt: (
          <>
            Rename the tenths: <Frac n={a} d={10} /> = <Frac n="?" d={100} />
          </>
        ),
        hint: "Each tenth is 10 hundredths.",
        explain: `${a}/10 = ${10 * a}/100.`,
      },
      {
        kind: "number",
        answer: s,
        suffix: "hundredths",
        prompt: (
          <>
            Add: <Frac n={10 * a} d={100} /> + <Frac n={b} d={100} /> = <Frac n="?" d={100} />
          </>
        ),
        hint: `Add ${10 * a} + ${b}. It's fine if the answer is more than 100.`,
        explain: `${10 * a} + ${b} = ${s}, so the total is ${s}/100 — more than 100/100.`,
      },
      sentence(
        {
          prompt: `${s}/100 is more than one whole. Write it as wholes and hundredths.`,
          hint: "100 hundredths fill one whole square. How many are left over?",
          explain: `100 of the ${s} hundredths make 1 whole, and ${s - 100} hundredths are left: 1 and ${s - 100}/100.`,
        },
        `${s}/100 = `,
        numberBlank(1),
        " whole and ",
        numberBlank(s - 100),
        "",
        [undefined, 100]
      ),
    ],
    wrapUp: `${expr} = ${s}/100 = 1 whole and ${s - 100}/100. Don't stop at ${s}/100 — it's more than one whole.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <GridRow size={120} segments={[{ count: 30, tone: "a" }, { count: 24, tone: "c" }]} caption="3/10 + 24/100 = 54/100" />;
}

export const tenthsToHundredths: Unit = {
  id: "tenthsToHundredths",
  title: "Tenths and Hundredths",
  goal: "Rename tenths as hundredths, and add a tenths fraction to a hundredths fraction.",
  standard: "4.NF.5",
  keyIdea: (
    <>
      <p>One tenth is 10 hundredths, so 3/10 = 30/100.</p>
      <p>To add 3/10 + 24/100, rename the tenths FIRST: 30/100 + 24/100 = 54/100. Never add 3 + 24 — those are different-size pieces.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["convert", "add", "carry"],
  problems: [
    { label: "Rename tenths", make: convertProblem, buckets: ["convert"] },
    { label: "Add", make: addProblem, buckets: ["add"] },
    { label: "Past one whole", make: carryProblem, buckets: ["carry"] },
  ],
  test: tenthsToHundredthsTest,
};
