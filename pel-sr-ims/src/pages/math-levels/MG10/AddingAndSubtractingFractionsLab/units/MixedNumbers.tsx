import { useState, type ReactNode } from "react";
import { MixedBars, MixedNumberBars } from "../diagrams";
import { choice, numberBlank, pointing, sentence, type Problem, type Step } from "../../../shared/engine/types";
import { Frac, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { mixedAddDiagnose, mixedBreakdown, mixedRaw, mixedSubDiagnose, pieceWord, signOf, simplestText, U4_BUCKETS, u4Params, type Op, type U4Bucket, type U4Params } from "../lib/fractions";
import { answerStep, BoxFrac, lcdStep, M, rewriteStep } from "../lib/steps";
import { MathText } from "../../../shared/components/MathText";
import { mixedNumbersTest } from "./MixedNumbersTest";

const exact = (want: string) => (raw: string) => raw.trim() === want;

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 vocabulary: what "borrow" means here (and 1 whole = 4/4, typed).
 * Q2 typed: borrow in 5 1/4 (the picture changes once it's right).
 * Q3 true/false trap: "just flip the fractions" + the right answer, typed in simplest form.
 * Q4 typed: subtracting from a whole number (the extreme borrow).
 */
function MixedCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  const [borrowed, setBorrowed] = useState(false);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> In <M w={5} n={1} d={4} /> − <M w={2} n={3} d={4} />, you can't take <Frac n={3} d={4} /> from <Frac n={1} d={4} />. So you <b>borrow</b>.
          </p>
          <DropdownQuestion
            blanks={[
              {
                options: ["Take 1 whole and cut it into fourths", "Take 1 away from the denominator", "Switch the two fractions"],
                correct: "Take 1 whole and cut it into fourths",
                label: "What borrow means",
              },
              { correct: "4", label: "Fourths in 1 whole", width: 56, accept: exact("4") },
            ]}
            render={([a, b]) => (
              <>
                Borrow means: {a}. 1 whole = <BoxFrac n={b} d={4} />.
              </>
            )}
            good="Yes. To borrow, take 1 whole from the whole number and turn it into fraction pieces: 1 = 4/4."
            bad="Not quite. Borrowing doesn't change the denominator, and it doesn't switch anything. It turns 1 whole into same-size pieces."
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Borrow 1 whole from <M w={5} n={1} d={4} />.
          </p>
          <MixedNumberBars wholes={borrowed ? 4 : 5} num={borrowed ? 5 : 1} den={4} barWidth={90} height={40} caption={borrowed ? "1 whole became 4 fourths. Now there are 5 loose fourths." : "5 wholes and 1 fourth."} />
          <DropdownQuestion
            blanks={[
              { correct: "4", label: "Wholes after borrowing", width: 56, accept: exact("4") },
              { correct: "5", label: "Fourths after borrowing", width: 56, accept: exact("5") },
            ]}
            render={([a, b]) => (
              <>
                5 1/4 = {a} <BoxFrac n={b} d={4} />
              </>
            )}
            good="Right. 5 1/4 = 4 + 4/4 + 1/4 = 4 5/4. It's the same amount, written a new way."
            bad={(oks) => (!oks[0] ? "You took 1 whole away. How many wholes are left?" : "4 fourths from the borrowed whole, plus the 1 fourth you had. How many fourths?")}
            onDone={() => {
              setBorrowed(true);
              mark(1)();
            }}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Jo says: "For <M w={5} n={1} d={4} /> − <M w={2} n={3} d={4} />, 1/4 is too small. I'll just do 3/4 − 1/4 instead."
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "Jo's way works" },
              { correct: "2", label: "Whole number", width: 56, accept: exact("2") },
              { correct: "1", label: "Top of the fraction", width: 56, accept: exact("1") },
              { correct: "2", label: "Bottom of the fraction", width: 56, accept: exact("2") },
            ]}
            render={([a, b, c, d]) => (
              <>
                True or false: Jo's way works. {a}
                <br />
                Borrow instead: 4 5/4 − 2 3/4 = 2 2/4. In simplest form, that is {b} <BoxFrac n={c} d={d} />.
              </>
            )}
            good="Correct. Jo switched the fractions, so Jo's answer is too big. With borrowing, 4 5/4 − 2 3/4 = 2 2/4 = 2 1/2."
            bad={(oks, vals) =>
              !oks[0]
                ? "Jo's way gives 3 2/4. Check it: 3 2/4 + 2 3/4 = 6 1/4. That's not 5 1/4, so Jo's way is wrong."
                : vals[3]?.trim() === "4"
                  ? "That's equal, but it's not in simplest form. Simplify it."
                  : "2 2/4 in simplest form: 2 and 4 can both be divided by 2."
            }
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Find 6 − <M w={2} n={1} d={3} />. There's no fraction in 6, so borrow.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "5", label: "Wholes after borrowing", width: 56, accept: exact("5") },
              { correct: "3", label: "Thirds after borrowing", width: 56, accept: exact("3") },
              { correct: "3", label: "Whole number of the answer", width: 56, accept: exact("3") },
              { correct: "2", label: "Top of the answer", width: 56, accept: exact("2") },
              { correct: "3", label: "Bottom of the answer", width: 56, accept: exact("3") },
            ]}
            render={([a, b, c, d, e]) => (
              <>
                6 = {a} <BoxFrac n={b} d={3} />.
                <br />
                So 6 − 2 1/3 = {c} <BoxFrac n={d} d={e} />.
              </>
            )}
            good="Yes! 6 = 5 3/3. Then 5 − 2 = 3 and 3/3 − 1/3 = 2/3. The answer is 3 2/3."
            bad={(oks) => (!oks[0] || !oks[1] ? "Borrow 1 whole from 6: 5 wholes are left, and the borrowed whole is 3 thirds." : "Subtract the wholes, then the thirds.")}
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
  const [op, setOp] = useState<Op>("sub");
  const [w1, setW1] = useState(5);
  const [n1raw, setN1] = useState(1);
  const [d1, setD1] = useState(4);
  const [w2, setW2] = useState(2);
  const [n2raw, setN2] = useState(2);
  const [d2, setD2] = useState(3);
  const [borrowed, setBorrowed] = useState(false);
  const [carried, setCarried] = useState(false);
  const n1 = Math.min(n1raw, d1 - 1);
  const n2 = Math.min(n2raw, d2 - 1);
  const p: U4Params = { op, w1, n1, d1, w2, n2, d2 };
  const m = mixedBreakdown(p);
  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setBorrowed(false);
    setCarried(false);
  };
  const tooBig = op === "sub" && m.total < 0;
  const showBorrowed = m.borrow && borrowed;
  const showCarried = m.carry && carried;

  let body: ReactNode;
  if (tooBig) {
    body = <p className="feedback bad">The second number is bigger. Make the first one bigger to subtract.</p>;
  } else if (op === "add") {
    body = (
      <>
        <MixedBars wholes={w1} num={m.a} den={m.L} tone="a" barWidth={150} height={40} />
        <MixedBars wholes={w2} num={m.b} den={m.L} tone="b" barWidth={150} height={40} />
        <p className="says">
          With the LCD {m.L}: <M w={w1} n={m.a} d={m.L} /> + <M w={w2} n={m.b} d={m.L} />. Wholes: {w1} + {w2} = {m.rw}. Fractions: {m.a}/{m.L} + {m.b}/{m.L} = {m.rn}/{m.L}.
        </p>
        {/* The sum: loose pieces spill past one full bar until the student carries. */}
        <MixedBars
          wholes={showCarried ? m.rw + 1 : m.rw}
          num={showCarried ? m.rn - m.L : m.rn}
          den={m.L}
          tone="c"
          barWidth={150}
          height={40}
          caption={`Together: ${showCarried ? mixedRaw(m.rw + 1, m.rn - m.L, m.L) : mixedRaw(m.rw, m.rn, m.L)}`}
        />
        {m.carry && !carried ? (
          <div className="control-row" style={{ alignItems: "center" }}>
            <span>
              {m.rn}/{m.L} is 1 whole or more. One bar is full of pieces.
            </span>
            <button className="btn primary" type="button" onClick={() => setCarried(true)}>
              Carry 1 whole
            </button>
          </div>
        ) : (
          <p className="says">
            {m.carry && (
              <>
                Carry: {m.L}/{m.L} is 1 whole. Move it to the whole number. So {mixedRaw(m.rw, m.rn, m.L)} = {mixedRaw(m.rw + 1, m.rn - m.L, m.L)}.{" "}
              </>
            )}
            Answer: <b>{simplestText(m.total, m.L)}</b>
          </p>
        )}
      </>
    );
  } else {
    body = (
      <>
        <MixedBars
          wholes={showBorrowed ? m.bw : w1}
          num={showBorrowed ? m.ba : m.a}
          den={m.L}
          takeWholes={!m.borrow || borrowed ? w2 : 0}
          takeNum={!m.borrow || borrowed ? m.b : 0}
          barWidth={150}
          height={40}
          caption={
            m.borrow && !borrowed
              ? `Start with ${mixedRaw(w1, m.a, m.L)}. You need to take away ${mixedRaw(w2, m.b, m.L)}.`
              : `Start with ${mixedRaw(w1, m.a, m.L)}. Take away ${mixedRaw(w2, m.b, m.L)} (crossed out).`
          }
        />
        {m.borrow && !borrowed ? (
          <div className="control-row" style={{ alignItems: "center" }}>
            <span>
              There are only {m.a}/{m.L}. That is not enough to take away {m.b}/{m.L}.
            </span>
            <button className="btn primary" type="button" onClick={() => setBorrowed(true)}>
              Borrow 1 whole
            </button>
          </div>
        ) : (
          <p className="says">
            {m.borrow && (
              <>
                Borrow: take 1 whole from {w1}. 1 whole = {m.L}/{m.L}. So {mixedRaw(w1, m.a, m.L)} = {mixedRaw(m.bw, m.ba, m.L)}.{" "}
              </>
            )}
            Wholes: {m.bw} − {w2} = {m.rw}. Fractions: {m.ba}/{m.L} − {m.b}/{m.L} = {m.rn}/{m.L}. Answer: <b>{simplestText(m.total, m.L)}</b>
          </p>
        )}
      </>
    );
  }

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          Work on the wholes and the fractions. Rewrite the fractions with the LCD first. When the first fraction is too small to subtract from, <b>borrow</b>: take 1 whole and
          cut it into pieces. Borrowing is also called regrouping. In Fraction Operations you called it unbundling a whole.
        </p>
        <p>
          When the fraction parts make 1 whole or more, <b>carry</b>: move 1 whole to the whole number. <M w={5} n={19} d={12} /> = <M w={6} n={7} d={12} />.
        </p>
        <Segmented label="Operation" value={op} onChange={reset(setOp)} options={[{ id: "add", label: "Add +" }, { id: "sub", label: "Subtract −" }]} />
        <div className="control-row">
          <Stepper label="1st: wholes" value={w1} min={0} max={6} onChange={reset(setW1)} tone="a" />
          <Stepper label="1st: numerator" value={n1} min={0} max={d1 - 1} onChange={reset(setN1)} tone="a" />
          <Stepper label="1st: denominator" value={d1} min={2} max={8} onChange={reset(setD1)} tone="a" />
        </div>
        <div className="control-row">
          <Stepper label="2nd: wholes" value={w2} min={0} max={6} onChange={reset(setW2)} tone="b" />
          <Stepper label="2nd: numerator" value={n2} min={0} max={d2 - 1} onChange={reset(setN2)} tone="b" />
          <Stepper label="2nd: denominator" value={d2} min={2} max={8} onChange={reset(setD2)} tone="b" />
        </div>
        <p className="says">
          <M w={w1} n={n1} d={d1} /> {signOf(op)} <M w={w2} n={n2} d={d2} />
        </p>
        {body}
        {(introActive || showCheck) && <MixedCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

function borrowExplain(w: number, num: number, L: number, bw: number, ba: number): string {
  return `Borrow 1 whole from ${w}. 1 whole = ${L}/${L}. So ${mixedRaw(w, num, L)} = ${bw} + ${L}/${L}${num ? ` + ${num}/${L}` : ""} = ${mixedRaw(bw, ba, L)}.`;
}

function makeProblem(bucket: U4Bucket): Problem {
  const p = u4Params(bucket);
  const { op, w1, n1, d1, w2, n2, d2 } = p;
  const m = mixedBreakdown(p);
  const { L } = m;
  const sign = signOf(op);
  const fromWhole = bucket === "subFromWhole";
  const ans = simplestText(m.total, L);
  const steps: Step[] = [];
  if (!fromWhole) {
    steps.push(lcdStep(d1, d2), rewriteStep(n1, d1, n2, d2, { prompt: `Rewrite the fraction parts with ${L} as the denominator.` }, w1, w2));
  }
  let borrowChoiceIdx = -1;
  let borrowIdx = -1;
  if (op === "sub") {
    // A whole number always needs borrowing, so that problem skips the
    // "do you need to borrow?" choice and goes straight to the typed borrow.
    if (!fromWhole) {
      borrowChoiceIdx = steps.length;
      steps.push(
        choice(
          {
            prompt: `Can you take ${m.b}/${L} from ${m.a}/${L}, or do you need to borrow?`,
            hint: `Compare the tops: ${m.a} and ${m.b}.`,
            explain: m.borrow ? `Borrow. ${m.a}/${L} is less than ${m.b}/${L}, so take 1 whole and cut it into ${pieceWord(L)}.` : `No borrowing. ${m.a}/${L} is more than ${m.b}/${L}, so subtract now.`,
          },
          m.borrow ? "Borrow 1 whole first" : "Subtract now. No need to borrow",
          [m.borrow ? "Subtract now. No need to borrow" : "Borrow 1 whole first"]
        )
      );
    }
    if (m.borrow) {
      borrowIdx = steps.length;
      steps.push(
        sentence(
          {
            prompt: fromWhole ? `You need to take away ${n2}/${d2}. Borrow 1 whole from ${w1}. Write ${w1} as wholes and ${pieceWord(L)}.` : `Borrow 1 whole. Rewrite ${mixedRaw(w1, m.a, L)}.`,
            hint: fromWhole
              ? `Take 1 from ${w1}. How many wholes are left? Cut the 1 whole you took into ${pieceWord(L)}. How many ${pieceWord(L)} is that?`
              : `Take 1 from ${w1}. That whole is ${L}/${L}. Add it to the ${m.a} pieces you have.`,
            explain: borrowExplain(w1, m.a, L, m.bw, m.ba),
          },
          `${mixedRaw(w1, m.a, L)} = `,
          numberBlank(m.bw),
          " ",
          numberBlank(m.ba),
          "",
          [undefined, L]
        )
      );
    }
  }
  const answerIdx = steps.length;
  steps.push(
    answerStep(
      {
        prompt: (
          <>
            <M w={w1} n={n1} d={d1} /> {sign} <M w={w2} n={n2} d={d2} /> = ? Write it in simplest form.
          </>
        ),
        hint:
          op === "add"
            ? `Add the wholes: ${w1} + ${w2}. Add the fractions: ${m.a}/${L} + ${m.b}/${L}. Is that ${L}/${L} or more? Then carry 1 whole to the whole number.`
            : `Subtract the wholes: ${m.bw} − ${w2}. Subtract the fractions: ${m.ba}/${L} − ${m.b}/${L}.`,
        explain:
          op === "add"
            ? `${w1} + ${w2} = ${m.rw} and ${m.a}/${L} + ${m.b}/${L} = ${m.rn}/${L}.${m.carry ? ` ${m.rn}/${L} is 1 whole or more, so carry 1 whole: ${mixedRaw(m.rw, m.rn, L)} = ${ans}.` : ""} The answer is ${ans}.`
            : `${m.borrow ? borrowExplain(w1, m.a, L, m.bw, m.ba) + " " : ""}${m.bw} − ${w2} = ${m.rw} and ${m.ba}/${L} − ${m.b}/${L} = ${m.rn}/${L}. The answer is ${ans}.`,
      },
      m.total,
      L,
      op === "add" ? mixedAddDiagnose(w1, n1, d1, w2, n2, d2) : mixedSubDiagnose(w1, n1, d1, w2, n2, d2)
    )
  );

  return {
    title: op === "add" ? "Add mixed numbers" : "Subtract mixed numbers",
    bucket,
    story: (
      <>
        {op === "add" ? "Add" : "Subtract"}: <M w={w1} n={n1} d={d1} /> {sign} <M w={w2} n={n2} d={d2} />.
      </>
    ),
    visual: (done, help) => {
      const rewritten = fromWhole || done >= 2;
      if (op === "add") {
        const finished = done > answerIdx;
        // Stuck on a sum that needs carrying: show the pieces together, spilling past one full bar.
        const carryHelp = m.carry && !finished && pointing(help, answerIdx);
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <MixedBars wholes={w1} num={rewritten ? m.a : n1} den={rewritten ? L : d1} tone="a" barWidth={110} height={36} />
            <MixedBars wholes={w2} num={rewritten ? m.b : n2} den={rewritten ? L : d2} tone="b" barWidth={110} height={36} />
            {carryHelp && <MixedBars wholes={m.rw} num={m.rn} den={L} tone="c" barWidth={110} height={36} caption="Together, before you carry. A full bar of pieces is 1 whole." />}
            {finished && <MixedBars wholes={Math.floor(m.total / L)} num={m.total % L} den={L} tone="c" barWidth={110} height={36} caption={`Together: ${ans}`} />}
          </div>
        );
      }
      // The borrowed picture (bw wholes + ba pieces) shows the borrow step's
      // two typed answers, so it appears only once that step is done (or in
      // Show me). Stuck ON the borrow step, the picture just rings the whole
      // to borrow (MG10 review C2-25).
      const showBorrow = m.borrow && (done > borrowIdx || (done > borrowChoiceIdx && pointing(help, borrowChoiceIdx)));
      const ringWhole = m.borrow && !showBorrow && pointing(help, borrowIdx);
      const finished = done > answerIdx;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <MixedBars
            wholes={showBorrow ? m.bw : w1}
            num={showBorrow ? m.ba : rewritten ? m.a : n1}
            den={rewritten ? L : d1}
            tone="a"
            takeWholes={finished ? w2 : 0}
            takeNum={finished ? m.b : 0}
            barWidth={110}
            height={36}
            ringLastWhole={ringWhole}
            caption={showBorrow ? "We borrowed 1 whole and cut it into pieces." : ringWhole ? `Borrow this whole. Cut it into ${pieceWord(L)}.` : undefined}
          />
          {!finished && <MixedBars wholes={w2} num={rewritten ? m.b : n2} den={rewritten ? L : d2} tone="b" barWidth={110} height={36} caption="Take this away." />}
        </div>
      );
    },
    steps,
    wrapUp: (
      <>
        <M w={w1} n={n1} d={d1} /> {sign} <M w={w2} n={n2} d={d2} /> = {ans}.
      </>
    ),
  };
}

function Preview() {
  return <MixedNumberBars wholes={4} num={5} den={4} takeWholes={2} takeNum={3} barWidth={70} height={32} />;
}

export const mixedNumbers: Unit = {
  id: "mixedNumbers",
  title: "Adding and Subtracting Mixed Numbers",
  goal: "Add and subtract mixed numbers with different denominators, and borrow a whole when you need to.",
  standard: "5.NF.1",
  keyIdea: (
    <>
      <p>Rewrite the fraction parts with the LCD. Then add or subtract the wholes and the fractions.</p>
      <p>
        Is the first fraction too small to subtract from? Then <b>borrow</b>: take 1 whole and turn it into pieces. <M w={5} n={1} d={4} /> = <M w={4} n={5} d={4} />, because 1 ={" "}
        <Frac n={4} d={4} />. Do the fraction parts make 1 whole or more? Then <b>carry</b> 1 whole to the whole number. Write the answer in simplest form.
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U4_BUCKETS,
  problems: [
    { label: "Add", make: (b) => makeProblem((b as U4Bucket) ?? "addNoCarry"), buckets: ["addNoCarry", "addCarry"] },
    { label: "Subtract", make: (b) => makeProblem((b as U4Bucket) ?? "subBorrow"), buckets: ["subNoBorrow", "subBorrow", "subFromWhole"] },
  ],
  test: mixedNumbersTest,
};
