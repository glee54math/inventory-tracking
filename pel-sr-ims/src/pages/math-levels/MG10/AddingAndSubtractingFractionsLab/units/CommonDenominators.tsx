import { useState } from "react";
import { MultiplesList, RecutBars } from "../diagrams";
import { choice, pointing, type Problem } from "../../../shared/engine/types";
import { Frac, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { lcd, mixedRaw, U2_BUCKETS, u2Params, type U2Bucket } from "../lib/fractions";
import { BoxFrac, lcdStep, M, rewriteStep } from "../lib/steps";
import { MathText } from "../../../shared/components/MathText";
import { commonDenominatorsTest } from "./CommonDenominatorsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 typed: find the common multiples and the LCD in two lists (vocabulary).
 * Q2 "common denominator" vs "LCD" in one question (the conflation).
 * Q3 true/false generalization: the product is always common, not always least.
 * Q4 typed: the whole procedure (LCD, then both rewrites), naming 54 if used.
 */
function CommonDenCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Here are the multiples of 4 and of 6.
          </p>
          <MultiplesList a={4} b={6} count={6} />
          <DropdownQuestion
            blanks={[
              { correct: "12", label: "Smallest number in both lists", width: 60 },
              { correct: "24", label: "Next number in both lists", width: 60 },
              { correct: "12", label: "LCD of 4 and 6", width: 60 },
            ]}
            render={([a, b, c]) => (
              <>
                The two smallest numbers in both lists are {a} and {b}. The LCD of 4 and 6 is {c}.
              </>
            )}
            good="Yes. 12 and 24 are both common denominators. The LCD is the least one: 12."
            bad={(oks) => (oks[0] && oks[1] ? "The LCD is the LEAST common denominator. Which common one is smaller?" : "Look for numbers that show up in BOTH rows. Type the smaller one first.")}
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Ben adds <Frac n={3} d={4} /> + <Frac n={5} d={6} />. He uses 24 as the denominator.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["Yes", "No"], correct: "Yes", label: "Is 24 a common denominator" },
              { options: ["Yes", "No"], correct: "No", label: "Is 24 the LCD" },
            ]}
            render={([a, b]) => (
              <>
                Is 24 a common denominator? {a} Is 24 the LCD? {b}
              </>
            )}
            good="Right. 4 and 6 both go into 24, so it is a common denominator. But 12 is smaller, so 24 is not the LCD."
            bad="Not quite. A common denominator is ANY number both 4 and 6 go into. The LCD is the smallest one."
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Think about multiplying the two denominators, like 4 × 6 = 24.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "True", label: "Always a common denominator" },
              { options: ["True", "False"], correct: "False", label: "Always the LCD" },
            ]}
            render={([a, b]) => (
              <>
                True or false: multiplying the denominators always gives a common denominator. {a}
                <br />
                True or false: multiplying the denominators always gives the LCD. {b}
              </>
            )}
            good="Correct. Both denominators always go into their product. But it is not always the least: 4 × 6 = 24, and the LCD is 12."
            bad="Not quite. Test it with 4 and 6. Do both go into 24? Is there a smaller number they both go into?"
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Rewrite <Frac n={2} d={9} /> and <Frac n={5} d={6} /> with the LCD.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "18", label: "LCD of 9 and 6", width: 60 },
              { correct: "4", label: "New top for 2/9", width: 56 },
              { correct: "15", label: "New top for 5/6", width: 56 },
            ]}
            render={([a, b, c]) => (
              <>
                The LCD is {a}. 2/9 = <BoxFrac n={b} d={18} /> and 5/6 = <BoxFrac n={c} d={18} />.
              </>
            )}
            good="Yes. 9 × 2 = 18, so 2/9 = 4/18. 6 × 3 = 18, so 5/6 = 15/18."
            bad={(oks, vals) =>
              !oks[0] && (vals[0].trim() === "54" || vals[0].trim() === "36")
                ? `${vals[0].trim()} is a common denominator, but not the least. Find the smallest number both 9 and 6 go into.`
                : !oks[0]
                  ? "List the multiples of 9: 9, 18, 27 … Which is the first one 6 goes into?"
                  : "Multiply the top by the same number you multiplied the bottom by."
            }
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
  const [d1, setD1] = useState(4);
  const [d2, setD2] = useState(6);
  const [n1raw, setN1] = useState(3);
  const [n2raw, setN2] = useState(5);
  const [show, setShow] = useState<"lists" | "common" | "lcd">("lists");
  const n1 = Math.min(n1raw, d1 - 1);
  const n2 = Math.min(n2raw, d2 - 1);
  const L = lcd(d1, d2);
  const P = d1 * d2;
  const k1 = L / d1;
  const k2 = L / d2;

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          In Unit 1, the picture cut <Frac n={1} d={3} /> and <Frac n={1} d={4} /> into twelfths so you could add them. Now you will find those pieces yourself.
        </p>
        <p>
          A <b>common denominator</b> is a number both denominators go into, with nothing left over. 4 goes into 12 because 4 × 3 = 12. <i>Goes into</i> means the
          same as <i>fits in</i> from Unit 1. <b>LCD</b> means{" "}
          <b>least common denominator</b>. It is the smallest one.
        </p>
        <div className="control-row">
          <Stepper label="1st denominator" value={d1} min={2} max={16} onChange={setD1} tone="a" />
          <Stepper label="2nd denominator" value={d2} min={2} max={16} onChange={setD2} tone="b" />
        </div>
        <Segmented
          label="Show"
          value={show}
          onChange={setShow}
          options={[
            { id: "lists", label: "Multiples" },
            { id: "common", label: "Common ones" },
            { id: "lcd", label: "The LCD" },
          ]}
        />
        <MultiplesList a={d1} b={d2} showCommon={show !== "lists"} showLcd={show === "lcd"} />
        {show === "lcd" && (
          <p className="says">
            The LCD of {d1} and {d2} is {L}.{" "}
            {d1 === d2
              ? "The denominators are already the same."
              : L === P
                ? `Here it is the same as ${d1} × ${d2}.`
                : L === Math.max(d1, d2)
                  ? `${Math.min(d1, d2)} goes into ${Math.max(d1, d2)}, so the bigger one is the LCD.`
                  : `${d1} × ${d2} = ${P} is a common denominator too, but it is not the least.`}
          </p>
        )}
        <p>Now rewrite two fractions with the LCD. Multiply the top and bottom by the same number.</p>
        <div className="control-row">
          <Stepper label="1st numerator" value={n1} min={1} max={d1 - 1} onChange={setN1} tone="a" />
          <Stepper label="2nd numerator" value={n2} min={1} max={d2 - 1} onChange={setN2} tone="b" />
        </div>
        <p className="says">
          <span className="qa-text">
            <Frac n={n1} d={d1} /> = <Frac n={`${n1} × ${k1}`} d={`${d1} × ${k1}`} /> = <Frac n={n1 * k1} d={L} />
          </span>
          <span style={{ display: "inline-block", width: 24 }} />
          <span className="qb-text">
            <Frac n={n2} d={d2} /> = <Frac n={`${n2} × ${k2}`} d={`${d2} × ${k2}`} /> = <Frac n={n2 * k2} d={L} />
          </span>
        </p>
        {L <= 48 ? (
          <RecutBars n1={n1} d1={d1} n2={n2} d2={d2} recut barWidth={260} caption="Same amounts, now cut into the same-size pieces." />
        ) : (
          <p className="muted small">That's too many pieces to draw. The math works the same way.</p>
        )}
        {(introActive || showCheck) && <CommonDenCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

function makeProblem(bucket: U2Bucket): Problem {
  const { n1, d1, n2, d2, w1, w2 } = u2Params(bucket);
  const L = lcd(d1, d2);
  const a = (n1 * L) / d1;
  const b = (n2 * L) / d2;
  const mixed = bucket === "mixedNumbers";
  const t1 = mixedRaw(w1, n1, d1);
  const t2 = mixedRaw(w2, n2, d2);
  const firstBigger = w1 * L + a > w2 * L + b;
  return {
    title: mixed ? "Mixed numbers: LCD" : "Find the LCD",
    bucket,
    story: (
      <>
        Rewrite <M w={w1} n={n1} d={d1} /> and <M w={w2} n={n2} d={d2} /> so they have the same denominator. Use the LCD.
        {mixed && " Only the fraction parts change."}
      </>
    ),
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* The lists only after a wrong try (or once the LCD is found): the Test doesn't show them. */}
        {(done >= 1 || pointing(help, 0)) && <MultiplesList a={d1} b={d2} showCommon showLcd={done >= 1} />}
        {L <= 48 && <RecutBars n1={n1} d1={d1} n2={n2} d2={d2} recut={done >= 2 || pointing(help, 1)} hideLabels={done < 2} barWidth={220} />}
      </div>
    ),
    steps: [
      lcdStep(d1, d2),
      rewriteStep(n1, d1, n2, d2, undefined, w1, w2),
      choice(
        {
          prompt: `Which number is bigger?`,
          hint: mixed ? `The whole numbers are the same. Compare ${a}/${L} and ${b}/${L}.` : `Compare ${a}/${L} and ${b}/${L}. Same-size pieces, so compare the tops.`,
          explain: `${mixed ? "The whole numbers are the same. " : ""}${Math.max(a, b)}/${L} is more than ${Math.min(a, b)}/${L}, because the pieces are the same size.`,
        },
        firstBigger ? t1 : t2,
        [firstBigger ? t2 : t1, "They are equal"]
      ),
    ],
    wrapUp: (
      <>
        With the LCD {L}: <M w={w1} n={n1} d={d1} /> = <M w={w1} n={a} d={L} /> and <M w={w2} n={n2} d={d2} /> = <M w={w2} n={b} d={L} />.
      </>
    ),
  };
}

function Preview() {
  return <MultiplesList a={4} b={6} count={5} showCommon showLcd />;
}

export const commonDenominators: Unit = {
  id: "commonDenominators",
  title: "Finding a Common Denominator",
  goal: "Rewrite two fractions so they have the same denominator, using the least common denominator (LCD).",
  standard: "5.NF.1",
  keyIdea: (
    <>
      <p>A common denominator is a number both denominators go into. The LCD (least common denominator) is the smallest one.</p>
      <p>
        For 4 and 6, the LCD is 12, not 24. Then <Frac n={3} d={4} /> = <Frac n={9} d={12} /> and <Frac n={5} d={6} /> = <Frac n={10} d={12} />. Multiply the top and bottom by the same number.
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U2_BUCKETS,
  problems: [
    { label: "Find the LCD", make: (b) => makeProblem((b as U2Bucket) ?? "sharedFactor"), buckets: ["multipleDen", "coprimeDen", "sharedFactor"] },
    { label: "Mixed numbers", make: (b) => makeProblem((b as U2Bucket) ?? "mixedNumbers"), buckets: ["mixedNumbers"] },
  ],
  test: commonDenominatorsTest,
};
