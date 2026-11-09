import { useState } from "react";
import { MultiplesList, RecutBars, SizeCheckBars } from "../diagrams";
import { pointing, type Problem } from "../../../shared/engine/types";
import { Frac, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { acrossOf, biggerSmaller, combine, gcd, resultDiagnose, shownText, signOf, simplestText, triedAcross, typedText, typedValue, U3_BUCKETS, u3Params, type Op, type U3Bucket } from "../lib/fractions";
import { answerStep, BoxFrac, lcdStep, M, rewriteStep } from "../lib/steps";
import { MathText } from "../../../shared/components/MathText";
import { AnswerFormGuide } from "../../../shared/components/AnswerForm";
import { formName, formOfValue } from "../../../shared/components/answerKinds";
import { addSubtractUnlikeTest } from "./AddSubtractUnlikeTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const exact = (want: string) => (raw: string) => raw.trim() === want;

/**
 * Q1 typed: the whole procedure in boxes (LCD, both rewrites, the sum).
 * Q2 "equal" vs "simplest form" in one question (the conflation), then the fix.
 * Q3 true/false generalization (two fractions under 1 can add past 1) + the mixed number.
 * Q4 typed: a subtraction that lands on a whole number.
 */
function AddSubtractCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Find <Frac n={2} d={3} /> + <Frac n={1} d={4} />, one step at a time.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "12", label: "LCD of 3 and 4", width: 56 },
              { correct: "8", label: "2/3 in twelfths", width: 56 },
              { correct: "3", label: "1/4 in twelfths", width: 56 },
              { correct: "11", label: "The sum in twelfths", width: 56 },
            ]}
            render={([a, b, c, d]) => (
              <>
                The LCD is {a}. 2/3 = <BoxFrac n={b} d={12} /> and 1/4 = <BoxFrac n={c} d={12} />. So 2/3 + 1/4 = <BoxFrac n={d} d={12} />.
              </>
            )}
            good="Yes! Same-size pieces first, then add the tops: 8 + 3 = 11. The answer is 11/12."
            bad="Not quite. Find the smallest number both 3 and 4 go into. What do you multiply 3 by to get it? Multiply the top of 2/3 by the same number. Do the same for 1/4. Then add the new tops."
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Leo found <Frac n={1} d={2} /> + <Frac n={1} d={6} /> = <Frac n={4} d={6} />.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["Yes", "No"], correct: "Yes", label: "Is 4/6 equal to the sum" },
              { options: ["Yes", "No"], correct: "No", label: "Is 4/6 in simplest form" },
              { correct: "2", label: "Top in simplest form", width: 56, accept: exact("2") },
              { correct: "3", label: "Bottom in simplest form", width: 56, accept: exact("3") },
            ]}
            render={([a, b, c, d]) => (
              <>
                Is 4/6 equal to the sum? {a} Is 4/6 in simplest form? {b}
                <br />
                In simplest form, 4/6 = <BoxFrac n={c} d={d} />.
              </>
            )}
            good="Right. 4/6 is equal to the sum, but 4 and 6 can both be divided by 2. In simplest form it is 2/3."
            bad="Not quite. 1/2 = 3/6, and 3/6 + 1/6 = 4/6, so it IS equal. But can 4 and 6 both be divided by the same number?"
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Two fractions are each less than 1.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "Sum always less than 1" },
              { correct: "1", label: "Whole number", width: 56, accept: exact("1") },
              { correct: "5", label: "Top of the fraction", width: 56, accept: exact("5") },
              { correct: "12", label: "Bottom of the fraction", width: 56, accept: exact("12") },
            ]}
            render={([a, b, c, d]) => (
              <>
                True or false: the sum is always less than 1. {a}
                <br />
                3/4 + 2/3 = 9/12 + 8/12 = 17/12. As a mixed number, 17/12 = {b} <BoxFrac n={c} d={d} />.
              </>
            )}
            good="Yes. 3/4 + 2/3 is more than 1. 12/12 makes 1 whole, and 5/12 is left: 1 5/12."
            bad={(oks) => (!oks[0] ? "Look at 3/4 + 2/3 = 17/12. Is 17/12 less than 1?" : "12 twelfths make 1 whole. How many twelfths are left?")}
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Find <Frac n={3} d={2} /> − <Frac n={2} d={4} />.
          </p>
          <RecutBars n1={3} d1={2} n2={2} d2={4} op="sub" recut hideLabels barWidth={200} />
          <DropdownQuestion
            blanks={[
              { correct: "6", label: "3/2 in fourths", width: 56 },
              { correct: "4", label: "The difference in fourths", width: 56 },
              { correct: "1", label: "Answer in simplest form", width: 56, accept: exact("1") },
            ]}
            render={([a, b, c]) => (
              <>
                3/2 = <BoxFrac n={a} d={4} />. So 3/2 − 2/4 = <BoxFrac n={b} d={4} />. In simplest form, that is {c}.
              </>
            )}
            good="Yes! 6/4 − 2/4 = 4/4. Four fourths is 1 whole, so the simplest form is just 1."
            bad="Not quite. 3/2 is 3 halves, and each half is 2 fourths. Then 4/4 is how many wholes?"
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
  const [op, setOp] = useState<Op>("add");
  const [n1, setN1] = useState(3);
  const [d1, setD1] = useState(4);
  const [n2, setN2] = useState(1);
  const [d2, setD2] = useState(6);
  const [step, setStep] = useState<"1" | "2" | "3" | "4">("1");
  const a1 = Math.min(n1, d1 - 1);
  const a2 = Math.min(n2, d2 - 1);
  const { L, a, b, r } = combine(op, a1, d1, a2, d2);
  const s = Number(step);
  const backwards = op === "sub" && r < 0;
  const g = gcd(Math.abs(r), L);

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>There are four steps. Find the LCD. Rewrite both fractions. Add or subtract the tops. Then write the answer in simplest form.</p>
        <div className="control-row">
          <Segmented label="Operation" value={op} onChange={setOp} options={[{ id: "add", label: "Add +" }, { id: "sub", label: "Subtract −" }]} />
        </div>
        <div className="control-row">
          <Stepper label="1st numerator" value={a1} min={1} max={d1 - 1} onChange={setN1} tone="a" />
          <Stepper label="1st denominator" value={d1} min={2} max={12} onChange={setD1} tone="a" />
          <Stepper label="2nd numerator" value={a2} min={1} max={d2 - 1} onChange={setN2} tone="b" />
          <Stepper label="2nd denominator" value={d2} min={2} max={12} onChange={setD2} tone="b" />
        </div>
        {backwards ? (
          <p className="feedback bad">The second fraction is bigger. Make the first one bigger to subtract.</p>
        ) : (
          <>
            <Segmented
              label="Step"
              value={step}
              onChange={setStep}
              options={[
                { id: "1", label: "1. LCD" },
                { id: "2", label: "2. Rewrite" },
                { id: "3", label: op === "add" ? "3. Add" : "3. Subtract" },
                { id: "4", label: "4. Simplest form" },
              ]}
            />
            {s === 1 && <MultiplesList a={d1} b={d2} showCommon showLcd />}
            <RecutBars n1={a1} d1={d1} n2={a2} d2={d2} op={op} recut={s >= 2} result={s >= 3} barWidth={240} />
            <p className="says">
              {s === 1 && <>The LCD of {d1} and {d2} is {L}.</>}
              {s === 2 && (
                <>
                  <Frac n={a1} d={d1} /> = <Frac n={a} d={L} /> and <Frac n={a2} d={d2} /> = <Frac n={b} d={L} />.
                </>
              )}
              {s === 3 && (
                <>
                  <Frac n={a} d={L} /> {signOf(op)} <Frac n={b} d={L} /> = <Frac n={r} d={L} />. Only the tops change. The pieces are still the same size.
                </>
              )}
              {s === 4 && (
                <>
                  <Frac n={r} d={L} /> = <b>{simplestText(r, L)}</b>.{" "}
                  {r === 0
                    ? "The answer is 0."
                    : r % L === 0
                      ? "" // E5-17: "Format: whole number" below says it.
                      : r > L
                        ? `${L}/${L} makes 1 whole, so write a mixed number.`
                        : g > 1
                          ? `${r} and ${L} can both be divided by ${g}.`
                          : `The only number that divides both ${r} and ${L} is 1. So ${r}/${L} is already in simplest form.`}{" "}
                  Format: <b>{formName(formOfValue(r, L))}</b>.
                </>
              )}
            </p>
          </>
        )}
        <AnswerFormGuide />
        {(introActive || showCheck) && <AddSubtractCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

function makeProblem(bucket: U3Bucket): Problem {
  const p = u3Params(bucket);
  const { op, n1, d1, n2, d2 } = p;
  const { L, a, b, r } = combine(op, n1, d1, n2, d2);
  const sign = signOf(op);
  const ans = simplestText(r, L);
  const word = op === "add" ? "Add" : "Subtract";
  return {
    title: op === "add" ? "Add fractions" : "Subtract fractions",
    bucket,
    story: (
      <>
        {word}: <Frac n={n1} d={d1} /> {sign} <Frac n={n2} d={d2} />. Give the answer in simplest form.
      </>
    ),
    visual: (done, help) => {
      // The last answer was the add-across (subtract-across) value: a size check beside it (round 5, U5-02).
      const tried = help && help.step === 2 && triedAcross(help.lastTry, op, n1, d1, n2, d2) ? typedValue(help.lastTry) : null;
      const x = acrossOf(op, n1, d1, n2, d2);
      // Adding: compare with the bigger fraction. Subtracting: with the first fraction, when the answer came out bigger than it.
      const ref: [number, number] | null = op === "add" ? biggerSmaller({ n1, d1, n2, d2 }).big : x && x[0] * d1 > n1 * x[1] ? [n1, d1] : null;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(done === 0 && pointing(help, 0)) && <MultiplesList a={d1} b={d2} showCommon />}
          <RecutBars n1={n1} d1={d1} n2={n2} d2={d2} op={op} recut={done >= 2 || (done >= 1 && pointing(help, 1))} hideLabels={done < 2} result={done >= 3 || (done >= 2 && pointing(help, 2))} />
          {tried && ref && (
            <SizeCheckBars
              rows={[
                { n: ref[0], d: ref[1], tone: ref[0] === n1 && ref[1] === d1 ? "a" : "b" },
                { n: tried[0], d: tried[1], tone: "c", label: <MathText>{typedText(help?.lastTry) ?? shownText(tried[0], tried[1])}</MathText> },
              ]}
              caption={op === "add" ? `Your answer is shorter than ${ref[0]}/${ref[1]}.` : `Your answer is longer than ${ref[0]}/${ref[1]}.`}
            />
          )}
        </div>
      );
    },
    steps: [
      lcdStep(d1, d2),
      rewriteStep(n1, d1, n2, d2),
      answerStep(
        {
          prompt: (
            <>
              <Frac n={n1} d={d1} /> {sign} <Frac n={n2} d={d2} /> = ? Write it in simplest form.
            </>
          ),
          hint: `Use the new tops from step 2: ${a} ${sign} ${b}. Keep ${L} on the bottom. Then check for simplest form.`,
          explain: `${a}/${L} ${sign} ${b}/${L} = ${r}/${L}${ans !== `${r}/${L}` ? ` = ${ans}` : ""}.${r % L === 0 ? " The answer is a whole number." : r > L ? ` ${L}/${L} is 1 whole, so it's a mixed number.` : gcd(r, L) > 1 ? ` Divide the top and bottom by ${gcd(r, L)}.` : ""}`,
        },
        r,
        L,
        resultDiagnose(op, n1, d1, n2, d2)
      ),
    ],
    wrapUp: (
      <>
        <Frac n={n1} d={d1} /> {sign} <Frac n={n2} d={d2} /> = {ans}.
      </>
    ),
  };
}

function Preview() {
  return <RecutBars n1={3} d1={4} n2={1} d2={6} recut result barWidth={130} />;
}

export const addSubtractUnlike: Unit = {
  id: "addSubtractUnlike",
  title: "Adding and Subtracting Fractions",
  goal: "Add and subtract fractions with different denominators, and write the answer in simplest form.",
  standard: "5.NF.1",
  keyIdea: (
    <>
      <p>Find the LCD. Rewrite both fractions. Add or subtract the tops. The bottom stays the LCD.</p>
      <p>
        Example: <Frac n={3} d={4} /> + <Frac n={1} d={6} /> = <Frac n={9} d={12} /> + <Frac n={2} d={12} /> = <Frac n={11} d={12} />. Then check for simplest form. An answer
        like <Frac n={4} d={6} /> is equal, but not finished: write <Frac n={2} d={3} />. Write <Frac n={17} d={12} /> as <M w={1} n={5} d={12} />.
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U3_BUCKETS,
  problems: [
    { label: "Add", make: (b) => makeProblem((b as U3Bucket) ?? "addPlain"), buckets: ["addPlain", "addSimplify", "addMixed"] },
    { label: "Subtract", make: (b) => makeProblem((b as U3Bucket) ?? "subPlain"), buckets: ["subPlain", "subSimplify", "subWhole"] },
  ],
  test: addSubtractUnlikeTest,
};
