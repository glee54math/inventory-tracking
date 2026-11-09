import { useState, type ReactNode } from "react";
import { MixedNumberBars, PieceBars } from "../diagrams";
import { choice, numberBlank, sentence, type Problem } from "../../../shared/engine/types";
import { Frac, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { addProperParams, addRegroupParams, mixedAdd, mixedBorrowParams, mixedNoRegroupParams, mixedSubtract, mixedText, pieceWord, subProperParams } from "../lib/fractions";
import { amountStep } from "../lib/steps";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "./cfu";
import { addSubtractFractionsTest } from "./AddSubtractFractionsTest";
import { MathText } from "../../../shared/components/MathText";

const M = ({ w, n, d }: { w: number; n: number; d: number }) => (
  <span style={{ whiteSpace: "nowrap" }}>
    {w > 0 && <>{w} </>}
    {n > 0 || w === 0 ? <Frac n={n} d={d} /> : null}
  </span>
);

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Staged walkthrough of the plan's required case — 3 1/4 − 1 3/4 — with the
 * picture changing as the student unbundles a whole themselves (a button
 * press, not a told rule), then regrouping and subtracting with their own
 * answers checked at each stage.
 */
function UnbundleWalkthrough({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0); // 0 can-we? 1 unbundle button 2 regroup 3 subtract 4 done
  return (
    <MathText>
      <div className="align-stack-wrap">
        <p>
          <b>2.</b> Let's find <M w={3} n={1} d={4} /> − <M w={1} n={3} d={4} /> together.
        </p>
        <MixedNumberBars
          wholes={stage >= 2 ? 2 : 3}
          num={stage >= 2 ? 5 : 1}
          den={4}
          takeWholes={stage >= 4 ? 1 : 0}
          takeNum={stage >= 4 ? 3 : 0}
          caption={stage >= 4 ? "Took away 1 whole and 3/4 — 1 whole and 2/4 are left." : stage >= 2 ? "One whole is now 4 loose fourths: 2 wholes and 5/4." : "3 wholes and 1/4."}
        />
        <DropdownQuestion
          blanks={[{ options: ["Yes", "No"], correct: "No", label: "Can you take 3/4 from 1/4" }]}
          render={([a]) => (
            <>
              Look at the loose pieces. Can you take <Frac n={3} d={4} /> away from <Frac n={1} d={4} />? {a}
            </>
          )}
          good="Right — there's only 1 loose fourth, and we need to take 3. We have to open up a whole."
          bad="Not quite — count the loose pieces in the last bar: there's only 1 fourth. Can you take 3 fourths from 1 fourth?"
          onDone={() => setStage((s) => Math.max(s, 1))}
        />
        {stage >= 1 && (
          <div className="control-row" style={{ marginTop: 10 }}>
            <button className="btn primary" type="button" disabled={stage >= 2} onClick={() => setStage(2)}>
              Unbundle one whole into 4/4
            </button>
          </div>
        )}
        {stage >= 2 && (
          <div style={{ marginTop: 10 }}>
            <DropdownQuestion
              blanks={[
                { options: ["1", "2", "3"], correct: "2", label: "Wholes after unbundling" },
                { options: ["1", "4", "5"], correct: "5", label: "Fourths after unbundling" },
              ]}
              render={([a, b]) => (
                <>
                  Now <M w={3} n={1} d={4} /> is written as {a} wholes and <Frac n={b} d={4} />.
                </>
              )}
              good="Yes — 3 1/4 = 2 + 4/4 + 1/4 = 2 5/4. Same amount, just one whole opened up into pieces."
              bad="Not quite — count the solid bars that are still wholes, then count every loose fourth (4 from the opened whole + the 1 that was already there)."
              onDone={() => setStage((s) => Math.max(s, 3))}
            />
          </div>
        )}
        {stage >= 3 && (
          <div style={{ marginTop: 10 }}>
            <DropdownQuestion
              blanks={[
                { options: ["0", "1", "2"], correct: "1", label: "Wholes left" },
                { options: ["1", "2", "3"], correct: "2", label: "Fourths left" },
              ]}
              render={([a, b]) => (
                <>
                  Take away 1 whole and 3 fourths: <M w={2} n={5} d={4} /> − <M w={1} n={3} d={4} /> = {a} and <Frac n={b} d={4} />.
                </>
              )}
              good="Correct — 2 − 1 = 1 whole, and 5/4 − 3/4 = 2/4. So 3 1/4 − 1 3/4 = 1 2/4. Check: 1 2/4 + 1 3/4 = 2 5/4 = 3 1/4 ✓."
              bad="Not quite — subtract the wholes (2 − 1), then the fourths (5/4 − 3/4)."
              onDone={() => {
                setStage(4);
                onDone();
              }}
            />
          </div>
        )}
      </div>
    </MathText>
  );
}

/**
 * Q1 vocabulary + the classic conflation (numerator counts pieces vs
 * denominator names the size, add-the-denominators bait). Q2 the plan's
 * required visual unbundling walkthrough. Q3 the true/false "just subtract
 * the other way" trap. Q4 the forgotten final step (improper sum → mixed).
 */
function AddSubtractCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> <Frac n={3} d={8} /> + <Frac n={4} d={8} />
          </p>
          <PieceBars den={8} segments={[{ count: 3, tone: "a" }, { count: 4, tone: "b" }]} barWidth={240} />
          <DropdownQuestion
            blanks={[
              { options: ["1", "7", "12"], correct: "7", label: "Numerator of the sum" },
              { options: ["8", "16", "64"], correct: "8", label: "Denominator of the sum" },
            ]}
            render={([a, b]) => (
              <>
                The sum's numerator is {a} and its denominator is {b}.
              </>
            )}
            good="Correct — 3 + 4 = 7 pieces (the numerator counts them), and they're still eighths (the denominator names the size): 7/8."
            bad="Not quite. Count all the colored pieces for the numerator. Did the pieces get any smaller when you put them together?"
            onDone={mark(0)}
          />
        </div>
        <UnbundleWalkthrough onDone={mark(1)} />
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Jo says: "For <M w={3} n={1} d={4} /> − <M w={1} n={3} d={4} />, the 1/4 is too small, so I'll just do 3/4 − 1/4 instead and get 2 2/4."
          </p>
          <DropdownQuestion
            blanks={[{ options: ["True — that works", "False — that gives the wrong answer"], correct: "False — that gives the wrong answer", label: "Is Jo's shortcut right" }]}
            render={([a]) => <>Flipping the fractions when the top one is smaller: {a}</>}
            good="Correct — flipping changes the problem. Check Jo's answer: 2 2/4 + 1 3/4 = 4 1/4, not 3 1/4. The real answer, 1 2/4, adds back to 3 1/4."
            bad="Not quite — try checking Jo's answer by adding it back: 2 2/4 + 1 3/4 = 4 1/4. Is that the number we started with?"
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> <Frac n={5} d={6} /> + <Frac n={4} d={6} /> = <Frac n={9} d={6} />. Is that finished? Write it as a mixed number:
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["0", "1", "9"], correct: "1", label: "Whole number" },
              { options: ["3", "4", "9"], correct: "3", label: "Numerator" },
            ]}
            render={([a, b]) => (
              <>
                <Frac n={9} d={6} /> = {a} and <Frac n={b} d={6} />
              </>
            )}
            good="Correct — 6 of the 9 sixths make one whole, with 3/6 left: 9/6 = 1 3/6."
            bad="Not quite — 6 sixths fill one whole. How many wholes is that, and how many sixths are left over?"
            onDone={mark(3)}
          />
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
  const [mode, setMode] = useState<"frac" | "mixed">("frac");
  const [op, setOp] = useState<"add" | "sub">("add");
  const [d, setD] = useState(4);
  const [w1, setW1] = useState(3);
  const [n1, setN1] = useState(1);
  const [w2, setW2] = useState(1);
  const [n2, setN2] = useState(3);
  const [unbundled, setUnbundled] = useState(false);
  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setUnbundled(false);
  };

  let body: ReactNode;
  if (mode === "frac") {
    const a = Math.min(n1, d);
    const b = op === "sub" ? Math.min(n2, a) : Math.min(n2, d);
    const result = op === "add" ? a + b : a - b;
    body = (
      <>
        <div className="control-row">
          <Stepper label="Pieces in a whole" value={d} min={2} max={10} onChange={reset(setD)} tone="c" />
          <Stepper label="First numerator" value={a} min={0} max={d} onChange={reset(setN1)} tone="a" />
          <Stepper label="Second numerator" value={b} min={0} max={op === "sub" ? a : d} onChange={reset(setN2)} tone="b" />
        </div>
        <PieceBars den={d} segments={op === "add" ? [{ count: a, tone: "a" }, { count: b, tone: "b" }] : [{ count: a - b, tone: "a" }, { count: b, tone: "gone" }]} barWidth={240} />
        <p className="says" style={{ fontSize: 18 }}>
          <Frac n={a} d={d} /> {op === "add" ? "+" : "−"} <Frac n={b} d={d} /> = <Frac n={result} d={d} />
          {result > d && result % d !== 0 && <> = {mixedText(result, d)}</>}
          {result >= d && result % d === 0 && <> = {result / d}</>}
        </p>
        <p className="muted small">
          {op === "add"
            ? `Count all the pieces: ${a} + ${b} = ${result}. They're still ${pieceWord(d)}, so the denominator stays ${d}.`
            : `Cross out ${b} of the ${a} pieces: ${result} left. Still ${pieceWord(d)}.`}
        </p>
      </>
    );
  } else {
    const a1 = Math.min(n1, d - 1);
    const a2 = Math.min(n2, d - 1);
    const v1 = w1 * d + a1;
    const v2 = w2 * d + a2;
    const steppers = (
      <div className="control-row">
        <Stepper label="Pieces in a whole" value={d} min={2} max={10} onChange={reset(setD)} tone="c" />
        <Stepper label="1st: wholes" value={w1} min={0} max={4} onChange={reset(setW1)} tone="a" />
        <Stepper label="1st: numerator" value={a1} min={0} max={d - 1} onChange={reset(setN1)} tone="a" />
        <Stepper label="2nd: wholes" value={w2} min={0} max={4} onChange={reset(setW2)} tone="b" />
        <Stepper label="2nd: numerator" value={a2} min={0} max={d - 1} onChange={reset(setN2)} tone="b" />
      </div>
    );
    if (op === "add") {
      const r = mixedAdd(w1, a1, w2, a2, d);
      body = (
        <>
          {steppers}
          <MixedNumberBars wholes={w1} num={a1} den={d} tone="a" />
          <MixedNumberBars wholes={w2} num={a2} den={d} tone="b" />
          <p className="says" style={{ fontSize: 18 }}>
            Wholes: {w1} + {w2} = {r.rawWhole}. Fractions: {a1}/{d} + {a2}/{d} = {r.rawNum}/{d}
            {r.carry && (
              <>
                {" "}
                — that's at least one whole, so regroup: {r.rawNum}/{d} = {mixedText(r.rawNum, d)}
              </>
            )}
            . Total: <b>{mixedText(v1 + v2, d)}</b>
          </p>
        </>
      );
    } else if (v2 > v1) {
      body = (
        <>
          {steppers}
          <p className="feedback bad">The second number is bigger than the first — make it smaller to subtract.</p>
        </>
      );
    } else {
      const b = mixedSubtract(w1, a1, w2, a2, d);
      const showRegrouped = b.borrow && unbundled;
      body = (
        <>
          {steppers}
          <MixedNumberBars
            wholes={showRegrouped ? b.regroupedWhole : w1}
            num={showRegrouped ? b.regroupedNum : a1}
            den={d}
            takeWholes={!b.borrow || unbundled ? w2 : 0}
            takeNum={!b.borrow || unbundled ? a2 : 0}
          />
          {b.borrow && !unbundled ? (
            <div className="control-row" style={{ alignItems: "center" }}>
              <span>
                Only {a1} loose {pieceWord(d)} — not enough to take {a2} away.
              </span>
              <button className="btn primary" type="button" onClick={() => setUnbundled(true)}>
                Unbundle one whole into {d}/{d}
              </button>
            </div>
          ) : (
            <p className="says" style={{ fontSize: 18 }}>
              {b.borrow && (
                <>
                  {mixedText(v1, d)} = {b.regroupedWhole} and {b.regroupedNum}/{d}.{" "}
                </>
              )}
              Wholes: {b.regroupedWhole} − {w2} = {b.resultWhole}. Fractions: {b.regroupedNum}/{d} − {a2}/{d} = {b.resultNum}/{d}. Answer: <b>{mixedText(v1 - v2, d)}</b>
            </p>
          )}
        </>
      );
    }
  }

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>Same-size pieces can be added and taken away just by counting them — the denominator (the piece size) never changes.</p>
        <div className="control-row">
          <Segmented label="Numbers" value={mode} onChange={reset(setMode)} options={[{ id: "frac", label: "Fractions" }, { id: "mixed", label: "Mixed numbers" }]} />
          <Segmented label="Operation" value={op} onChange={reset(setOp)} options={[{ id: "add", label: "Add +" }, { id: "sub", label: "Subtract −" }]} />
        </div>
        {body}
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <AddSubtractCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

function addProperProblem(): Problem {
  const { n1, n2, d } = addProperParams();
  const s = n1 + n2;
  return {
    title: "Add fractions",
    bucket: "addProper",
    story: (
      <>
        Add <Frac n={n1} d={d} /> + <Frac n={n2} d={d} />.
      </>
    ),
    visual: () => <PieceBars den={d} segments={[{ count: n1, tone: "a" }, { count: n2, tone: "b" }]} barWidth={260} />,
    steps: [
      amountStep({ prompt: "What's the sum?", hint: "Count every colored piece. Are they still the same size?", explain: `${n1} + ${n2} = ${s} pieces of 1/${d}.` }, s, d),
      amountStep(
        {
          prompt: (
            <>
              Undo it: <Frac n={s} d={d} /> − <Frac n={n2} d={d} /> = ?
            </>
          ),
          hint: "Subtracting takes back the pieces you just added.",
          explain: `${s} − ${n2} = ${n1}: subtraction undoes addition.`,
        },
        n1,
        d
      ),
      choice(
        {
          prompt: (
            <>
              Sam says <Frac n={n1} d={d} /> + <Frac n={n2} d={d} /> = <Frac n={s} d={2 * d} />. What did Sam do wrong?
            </>
          ),
          hint: "Look at Sam's denominator. What would that do to the size of each piece?",
          explain: `Sam added the denominators. The pieces are still ${pieceWord(d)} — adding counts pieces; it doesn't shrink them.`,
        },
        "Sam added the denominators — but the pieces don't change size",
        ["Sam added the numerators — he should have multiplied them", "Nothing — Sam is right"]
      ),
    ],
    wrapUp: (
      <>
        <Frac n={n1} d={d} /> + <Frac n={n2} d={d} /> = <Frac n={s} d={d} />.
      </>
    ),
  };
}

function addRegroupProblem(): Problem {
  const { n1, n2, d } = addRegroupParams();
  const s = n1 + n2;
  return {
    title: "Add — and finish as a mixed number",
    bucket: "addRegroup",
    story: (
      <>
        Add <Frac n={n1} d={d} /> + <Frac n={n2} d={d} />.
      </>
    ),
    visual: () => <PieceBars den={d} segments={[{ count: n1, tone: "a" }, { count: n2, tone: "b" }]} barWidth={220} />,
    steps: [
      {
        kind: "number",
        overDen: d,
        prompt: "How many pieces in all? (Keep the denominator.)",
        hint: `${n1} + ${n2} = ?`,
        explain: `${s}/${d} — more pieces than fit in one whole.`,
        answer: s,
      },
      sentence(
        { prompt: `${d} pieces fill one whole. Write ${s}/${d} as a mixed number.`, hint: `${s} − ${d} = ?`, explain: `${s}/${d} = ${d}/${d} + ${s - d}/${d} = ${mixedText(s, d)}.` },
        `${s}/${d} = `,
        numberBlank(1),
        " ",
        numberBlank(s - d),
        "",
        [undefined, d]
      ),
      {
        kind: "number",
        prompt: "How many more 1/" + d + " pieces would it take to fill TWO wholes?",
        hint: `Two wholes is ${2 * d}/${d}.`,
        explain: `${2 * d} − ${s} = ${2 * d - s}.`,
        answer: 2 * d - s,
      },
    ],
    wrapUp: (
      <>
        <Frac n={n1} d={d} /> + <Frac n={n2} d={d} /> = <Frac n={s} d={d} /> = {mixedText(s, d)}.
      </>
    ),
  };
}

function subProperProblem(): Problem {
  const { n1, n2, d } = subProperParams();
  const r = n1 - n2;
  return {
    title: "Subtract fractions",
    bucket: "subProper",
    story: (
      <>
        Subtract <Frac n={n1} d={d} /> − <Frac n={n2} d={d} />.
      </>
    ),
    visual: (done) => <PieceBars den={d} segments={done >= 1 ? [{ count: r, tone: "a" }, { count: n2, tone: "gone" }] : [{ count: n1, tone: "a" }]} barWidth={260} />,
    steps: [
      amountStep({ prompt: "What's left?", hint: `Start with ${n1} pieces and take away ${n2}.`, explain: `${n1} − ${n2} = ${r}.` }, r, d),
      amountStep(
        {
          prompt: (
            <>
              Check by adding: <Frac n={r} d={d} /> + <Frac n={n2} d={d} /> = ?
            </>
          ),
          hint: "Adding back what you took should give the starting amount.",
          explain: `${r} + ${n2} = ${n1} — back where we started.`,
        },
        n1,
        d
      ),
      choice(
        {
          prompt: (
            <>
              Lee says <Frac n={n1} d={d} /> − <Frac n={n2} d={d} /> = {r}/0, because {d} − {d} = 0. What's wrong?
            </>
          ),
          hint: "Did the size of the pieces change when some were taken away?",
          explain: `Lee subtracted the denominators. The leftover pieces are still ${pieceWord(d)}.`,
        },
        "Lee subtracted the denominators — the pieces are still the same size",
        ["Lee should have added the numerators", "Nothing — Lee is right"]
      ),
    ],
    wrapUp: (
      <>
        <Frac n={n1} d={d} /> − <Frac n={n2} d={d} /> = <Frac n={r} d={d} />.
      </>
    ),
  };
}

function mixedNoRegroupProblem(): Problem {
  const { op, w1, n1, w2, n2, d } = mixedNoRegroupParams();
  const r = op === "add" ? mixedAdd(w1, n1, w2, n2, d) : mixedSubtract(w1, n1, w2, n2, d);
  const sign = op === "add" ? "+" : "−";
  return {
    title: op === "add" ? "Add mixed numbers" : "Subtract mixed numbers",
    bucket: "mixedNoRegroup",
    story: (
      <>
        <M w={w1} n={n1} d={d} /> {sign} <M w={w2} n={n2} d={d} />
      </>
    ),
    visual: (done) =>
      op === "add" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <MixedNumberBars wholes={w1} num={n1} den={d} tone="a" barWidth={120} />
          <MixedNumberBars wholes={w2} num={n2} den={d} tone="b" barWidth={120} />
        </div>
      ) : (
        <MixedNumberBars wholes={w1} num={n1} den={d} takeWholes={done >= 1 ? w2 : 0} takeNum={done >= 2 ? n2 : 0} barWidth={120} />
      ),
    steps: [
      { kind: "number", prompt: `First the whole numbers: ${w1} ${sign} ${w2} = ?`, hint: "Just the big numbers.", explain: `${w1} ${sign} ${w2} = ${r.resultWhole}.`, answer: r.resultWhole },
      {
        kind: "number",
        overDen: d,
        prompt: (
          <>
            Now the fractions: <Frac n={n1} d={d} /> {sign} <Frac n={n2} d={d} /> = ?
          </>
        ),
        hint: `${n1} ${sign} ${n2} = ?`,
        explain: `${n1} ${sign} ${n2} = ${r.resultNum}.`,
        answer: r.resultNum,
      },
      sentence(
        { prompt: "Put the two parts together:", hint: "Whole number, then the fraction.", explain: `${mixedText(r.resultWhole * d + r.resultNum, d)}.` },
        "",
        numberBlank(r.resultWhole),
        " ",
        numberBlank(r.resultNum),
        "",
        [undefined, d]
      ),
    ],
    wrapUp: (
      <>
        <M w={w1} n={n1} d={d} /> {sign} <M w={w2} n={n2} d={d} /> = <M w={r.resultWhole} n={r.resultNum} d={d} />.
      </>
    ),
  };
}

function mixedBorrowProblem(): Problem {
  const { w1, n1, w2, n2, d } = mixedBorrowParams(0);
  const b = mixedSubtract(w1, n1, w2, n2, d);
  return {
    title: "Subtract — unbundle a whole",
    bucket: "mixedBorrow",
    story: (
      <>
        <M w={w1} n={n1} d={d} /> − <M w={w2} n={n2} d={d} />
      </>
    ),
    visual: (done) => (
      <MixedNumberBars
        wholes={done >= 1 ? b.regroupedWhole : w1}
        num={done >= 1 ? b.regroupedNum : n1}
        den={d}
        takeWholes={done >= 3 ? w2 : 0}
        takeNum={done >= 3 ? n2 : 0}
        barWidth={120}
        caption={done >= 1 ? "One whole unbundled into loose pieces." : undefined}
      />
    ),
    steps: [
      choice(
        {
          prompt: (
            <>
              Can you take <Frac n={n2} d={d} /> away from <Frac n={n1} d={d} /> right now?
            </>
          ),
          hint: `Compare ${n1} loose pieces to the ${n2} you need to take.`,
          explain: `No — ${n1} is less than ${n2}, so unbundle one whole into ${d}/${d} first.`,
        },
        `No — ${n1}/${d} is smaller than ${n2}/${d}, so unbundle one whole into ${d}/${d} first`,
        [`Yes — just do ${n2}/${d} − ${n1}/${d} instead`, "Yes — the whole numbers make up for it"]
      ),
      sentence(
        {
          prompt: `Unbundle one whole: rewrite ${w1} ${n1}/${d}.`,
          hint: `One fewer whole; ${n1} + ${d} loose pieces.`,
          explain: `${w1} ${n1}/${d} = ${b.regroupedWhole} + ${d}/${d} + ${n1}/${d} = ${b.regroupedWhole} ${b.regroupedNum}/${d}.`,
        },
        `${w1} ${n1}/${d} = `,
        numberBlank(b.regroupedWhole),
        " ",
        numberBlank(b.regroupedNum),
        "",
        [undefined, d]
      ),
      amountStep(
        {
          prompt: (
            <>
              Now subtract: <M w={b.regroupedWhole} n={b.regroupedNum} d={d} /> − <M w={w2} n={n2} d={d} /> = ?
            </>
          ),
          hint: `Wholes: ${b.regroupedWhole} − ${w2}. Fractions: ${b.regroupedNum}/${d} − ${n2}/${d}.`,
          explain: `${b.regroupedWhole} − ${w2} = ${b.resultWhole}, ${b.regroupedNum} − ${n2} = ${b.resultNum}: ${mixedText(b.resultWhole * d + b.resultNum, d)}.`,
        },
        b.resultWhole * d + b.resultNum,
        d
      ),
    ],
    wrapUp: (
      <>
        <M w={w1} n={n1} d={d} /> − <M w={w2} n={n2} d={d} /> = {mixedText(b.resultWhole * d + b.resultNum, d)}.
      </>
    ),
  };
}

function Preview() {
  return <MixedNumberBars wholes={2} num={5} den={4} takeWholes={1} takeNum={3} barWidth={90} height={36} />;
}

const BUCKETS = ["addProper", "addRegroup", "subProper", "mixedNoRegroup", "mixedBorrow"];

export const addSubtractFractions: Unit = {
  id: "addSubtractFractions",
  title: "Adding and Subtracting Fractions and Mixed Numbers",
  goal: "Add and subtract fractions and mixed numbers with the same denominator — including unbundling a whole when you need more pieces.",
  standard: "4.NF.3b-c",
  keyIdea: (
    <>
      <p>
        Same denominator = same-size pieces, so just count: <Frac n={3} d={8} /> + <Frac n={4} d={8} /> = <Frac n={7} d={8} />. The denominator never changes.
      </p>
      <p>
        Not enough pieces to subtract? Unbundle a whole: 3 <Frac n={1} d={4} /> = 2 <Frac n={5} d={4} />, so 3 <Frac n={1} d={4} /> − 1 <Frac n={3} d={4} /> = 1{" "}
        <Frac n={2} d={4} />.
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: BUCKETS,
  problems: [
    { label: "Add", make: addProperProblem, buckets: ["addProper"] },
    { label: "Add past 1", make: addRegroupProblem, buckets: ["addRegroup"] },
    { label: "Subtract", make: subProperProblem, buckets: ["subProper"] },
    { label: "Mixed numbers", make: mixedNoRegroupProblem, buckets: ["mixedNoRegroup"] },
    { label: "Unbundle a whole", make: mixedBorrowProblem, buckets: ["mixedBorrow"] },
  ],
  test: addSubtractFractionsTest,
};
