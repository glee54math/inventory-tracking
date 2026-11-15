import { useState } from "react";
import { choice, pointing, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { MathText } from "../../../shared/components/MathText";
import { pick } from "../../../shared/lib/math";
import { BarRows, ExprView, TimesBars, WorkLines } from "../diagrams";
import { bin, evalExpr, exprText, fmtNum, grouped, isWhole, moveParens, type Expr, type Op } from "../lib/expr";
import { buildStep, changeCompare, largerCompare, timesStep } from "../lib/reading";
import { bigPair, wordsChoices, wordsTemplate, WORDS_IDS, type WordsTemplate } from "../lib/stories";
import { valueStep, workText } from "../lib/steps";
import { readingExpressionsTest } from "./ReadingExpressionsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 typed: words -> expression (pick; the word-order trap is a choice), then its value (type; not on screen).
 * Q2 typed: big numbers, 6 copies against 2 copies (the answer, 3, is not printed); typing a worked-out
 *    value or the "more than" difference is named (round 1, C1-03).
 * Q3 vocabulary/conflation: expression -> words, and "larger or smaller" for a division, without working it out.
 * Q4 typed + true/false generalization: moving parentheses changes the value sometimes, not always, not never.
 */
function ReadingCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Write this as an expression: add 8 and 7, then multiply by 2.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["(2 × 8) + 7", "2 × (8 + 7)", "8 + (7 × 2)"], correct: "2 × (8 + 7)", label: "Expression for the words" },
              { correct: "30", label: "Value of the expression", width: 60 },
            ]}
            render={([a, b]) => (
              <>
                The expression is {a}. Its value is {b}.
              </>
            )}
            good="Yes. The words say to add first, so 8 + 7 goes in parentheses. 8 + 7 = 15, and 2 × 15 = 30."
            bad={(oks, vals) =>
              !oks[0]
                ? "The words say ADD first. The part you do first goes in parentheses, even if the 2 is written in front."
                : vals[1].trim() === "23"
                  ? "23 is (2 × 8) + 7. The words say to add 8 and 7 first."
                  : "Add 8 and 7 first. Then multiply by 2."
            }
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Don't work it out. Just read it.
          </p>
          <DropdownQuestion
            blanks={[{ correct: "3", label: "How many times as large", width: 70 }]}
            render={([a]) => <>6 × (18,932 + 921) is {a} times as large as 2 × (18,932 + 921).</>}
            good="Right. 6 copies is 3 times as large as 2 copies, because 2 × 3 = 6. You didn't need to add."
            bad={(_oks, vals) => {
              const v = vals[0].replace(/,/g, "").trim();
              return ["19853", "119118", "39706"].includes(v)
                ? "You worked it out. The question asks how many TIMES as large. Compare the copies."
                : v === "4"
                  ? "6 copies is 4 MORE than 2 copies. How many TIMES as large is it?"
                  : v === "6"
                    ? "6 × (18,932 + 921) is 6 times as large as ONE copy. Compare it with 2 copies."
                    : "Both have the same group. How many times as large is 6 as 2?";
            }}
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Read (20 − 4) ÷ 2 without working it out.
          </p>
          <DropdownQuestion
            blanks={[
              {
                options: ["Subtract 4 from 20, then divide by 2.", "Divide 4 by 2, then subtract it from 20.", "Subtract 20 from 4, then divide by 2."],
                correct: "Subtract 4 from 20, then divide by 2.",
                label: "Words for (20 − 4) ÷ 2",
              },
              { options: ["larger than", "smaller than", "the same as"], correct: "smaller than", label: "Compared with 20 − 4" },
            ]}
            render={([a, b]) => (
              <>
                The expression says: {a}
                <br />
                (20 − 4) ÷ 2 is {b} 20 − 4.
              </>
            )}
            good="Yes. First 20 − 4, because it is in parentheses. Dividing by 2 makes it half as large, so it is smaller."
            bad={(oks) =>
              !oks[0]
                ? "The part in parentheses is the first step. Which number do you start with?"
                : "Dividing a number by 2 splits it into 2 equal parts. Is one part larger or smaller?"
            }
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Here the parentheses are in two different places. Find each value. Then finish the sentence.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "3", label: "Value of (8 − 3) − 2", width: 56 },
              { correct: "7", label: "Value of 8 − (3 − 2)", width: 56 },
              { options: ["always", "sometimes", "never"], correct: "sometimes", label: "How often moving parentheses changes the value" },
            ]}
            render={([a, b, c]) => (
              <>
                (8 − 3) − 2 = {a} and 8 − (3 − 2) = {b}
                <br />
                But (2 + 3) + 4 and 2 + (3 + 4) are both 9. Moving the parentheses {c} changes the value.
              </>
            )}
            good="Correct. With only adding, or only multiplying, moving the parentheses never matters. With other signs, it sometimes does. Find both values to check."
            bad={(oks) =>
              !oks[0] || !oks[1] ? "Work out the part in parentheses first in each one." : "One pair changed and one pair did not. So is it always, sometimes or never?"
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

type First = "add" | "sub" | "mul";
type Then = "×" | "÷" | "+" | "−";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  // Part 1: words <-> expression.
  const [a, setA] = useState(12);
  const [b, setB] = useState(15);
  const [k, setK] = useState(3);
  const [first, setFirst] = useState<First>("add");
  const [then, setThen] = useState<Then>("÷");
  const firstOp: Op = first === "add" ? "+" : first === "sub" ? "−" : "×";
  const firstWords = first === "add" ? `Add ${a} and ${b}` : first === "sub" ? `Subtract ${b} from ${a}` : `Multiply ${a} by ${b}`;
  const thenWords = then === "×" ? `multiply by ${k}` : then === "÷" ? `divide by ${k}` : then === "+" ? `add ${k}` : `subtract ${k}`;
  const built: Expr = bin(then, bin(firstOp, a, b, "paren"), k);
  const builtOk = isWhole(built);
  // Part 2: how big, without working it out.
  const [nums, setNums] = useState(() => ({ A: 18932, B: 921 }));
  const [copies, setCopies] = useState(3);
  // Round 1 (C1-04, C1-05): compare with more than 1 copy, and show ÷ (equal parts).
  const [compareTo, setCompareTo] = useState(1);
  // Round 3 (C3-02): one idea and one bar set per mode.
  const [sizeMode, setSizeMode] = useState<"times" | "bigger" | "divide">("times");
  const group = `${fmtNum(nums.A)} + ${fmtNum(nums.B)}`;
  const bigC = nums.B + 100;
  const group2 = `${fmtNum(nums.A)} + ${fmtNum(bigC)}`;
  const many = (n: number) => (n === 1 ? group : `${n} × (${group})`);
  const compareSentence =
    compareTo === 1 ? null : copies > compareTo && copies % compareTo === 0 ? (
      <>
        {copies} copies is <b>{copies / compareTo} times as large</b> as {compareTo} copies, because {compareTo} × {copies / compareTo} = {copies}.
      </>
    ) : copies > compareTo ? (
      <>
        {copies} copies is <b>larger than</b> {compareTo} copies.
      </>
    ) : copies === compareTo ? (
      <>Same number of copies of the same group, so they are equal.</>
    ) : (
      <>
        {copies} copies is <b>smaller than</b> {compareTo} copies.
      </>
    );
  // Part 3: does moving the parentheses change the value?
  const [pair, setPair] = useState<"++" | "××" | "+×" | "−−" | "+−">("++");
  const [x, setX] = useState(8);
  const [y, setY] = useState(3);
  const [z, setZ] = useState(2);
  const [o1, o2] = pair.split("") as [Op, Op];
  const L = grouped(x, o1, y, o2, z, "left");
  const R = grouped(x, o1, y, o2, z, "right");
  const both = isWhole(L) && isWhole(R);

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          An <b>expression</b> is a math phrase made of numbers and signs, like (12 + 15) ÷ 3. You can read what it says without working it out.
        </p>
        <p className="says">
          Grandma gives you 12 dollars. Grandpa gives you 15 dollars. You and your 2 cousins share all the money equally. That&apos;s 3 kids. The expression is (12 + 15) ÷ 3:
          add first, then divide.
        </p>

        <h3 className="explore-head">Words and expressions</h3>
        <div className="control-row">
          <Stepper label="1st number" value={a} min={first === "sub" ? b + 1 : 2} max={30} onChange={setA} tone="a" />
          <Stepper label="2nd number" value={b} min={2} max={first === "sub" ? a - 1 : 20} onChange={setB} tone="b" />
          <Stepper label="3rd number" value={k} min={2} max={9} onChange={setK} tone="c" />
        </div>
        <div className="control-row">
          <span className="sign-pick">
            <span className="muted small">First step</span>
            <Segmented
              label="First step"
              value={first}
              onChange={(v) => {
                if (v === "sub" && b >= a) setB(Math.max(2, a - 1));
                setFirst(v);
              }}
              options={[
                { id: "add", label: "Add" },
                { id: "sub", label: "Subtract" },
                { id: "mul", label: "Multiply" },
              ]}
            />
          </span>
          <span className="sign-pick">
            <span className="muted small">Then</span>
            <Segmented
              label="Then"
              value={then}
              onChange={setThen}
              options={[
                { id: "×", label: "Multiply" },
                { id: "÷", label: "Divide" },
                { id: "+", label: "Add" },
                { id: "−", label: "Subtract" },
              ]}
            />
          </span>
        </div>
        <div className="words-expr">
          <p className="words-line">
            <b>Words:</b> {firstWords}, then {thenWords}.
          </p>
          <p className="words-line">
            <b>Expression:</b> <ExprView expr={built} size="md" />
          </p>
          <p className="muted small">
            {builtOk
              ? `The first step goes in parentheses, wherever it sits. Its value is ${fmtNum(evalExpr(built))}. But you can read what it says without finding the value.`
              : "This one does not come out to a whole number. You can still read it. Try other numbers to see its value."}
          </p>
        </div>

        <h3 className="explore-head">How big is it? Don&apos;t work it out</h3>
        <Segmented
          label="What to compare"
          value={sizeMode}
          onChange={setSizeMode}
          options={[
            { id: "times", label: "× copies" },
            { id: "bigger", label: "bigger group" },
            { id: "divide", label: "÷ equal parts" },
          ]}
        />
        {sizeMode === "times" ? (
          <>
            <p>
              {copies} × ({group}) is {copies} copies of {group}. So it is <b>{copies} times as large</b> as {group}. You never need to add the big numbers.
            </p>
            <div className="control-row">
              <Stepper label="Copies" value={copies} min={2} max={6} onChange={setCopies} tone="b" />
              <Stepper label="Copies to compare" value={compareTo} min={1} max={6} onChange={setCompareTo} tone="a" />
              <button className="btn ghost" type="button" onClick={() => setNums(bigPair())}>
                New big numbers
              </button>
            </div>
            <BarRows
              rows={[
                { label: many(compareTo), k: compareTo, text: group, tone: "a" },
                { label: many(copies), k: copies, text: group },
              ]}
            />
            {compareSentence && <p className="says">{compareSentence}</p>}
          </>
        ) : sizeMode === "bigger" ? (
          <>
            <p>
              Both multiply by {copies}, but one group is larger. {copies} × ({group2}) is larger than {copies} × ({group}), because {fmtNum(bigC)} is larger than{" "}
              {fmtNum(nums.B)}.
            </p>
            <div className="control-row">
              <Stepper label="Copies" value={copies} min={2} max={6} onChange={setCopies} tone="b" />
              <button className="btn ghost" type="button" onClick={() => setNums(bigPair())}>
                New big numbers
              </button>
            </div>
            <BarRows
              rows={[
                { label: `${copies} × (${group})`, k: copies, text: group },
                { label: `${copies} × (${group2})`, k: copies, text: group2, scale: 1.2 },
              ]}
            />
          </>
        ) : (
          <>
            <p>
              ({group}) ÷ {copies} splits {group} into {copies} equal parts. One part is smaller than the whole group. So ({group}) ÷ {copies} is <b>smaller than</b>{" "}
              {group}.
            </p>
            <div className="control-row">
              <Stepper label="Equal parts" value={copies} min={2} max={6} onChange={setCopies} tone="b" />
              <button className="btn ghost" type="button" onClick={() => setNums(bigPair())}>
                New big numbers
              </button>
            </div>
            <BarRows
              unit={300}
              rows={[
                { label: group, k: 1, text: group, tone: "a", parts: copies },
                { label: `(${group}) ÷ ${copies}`, k: 1, text: "", scale: 1 / copies },
              ]}
            />
          </>
        )}

        <h3 className="explore-head">Does moving the parentheses change the value?</h3>
        <div className="control-row">
          <Segmented
            label="Signs"
            value={pair}
            onChange={setPair}
            options={[
              { id: "++", label: "+ and +" },
              { id: "××", label: "× and ×" },
              { id: "+×", label: "+ and ×" },
              { id: "−−", label: "− and −" },
              { id: "+−", label: "+ and −" },
            ]}
          />
        </div>
        <div className="control-row">
          <Stepper label="1st" value={x} min={1} max={20} onChange={setX} tone="a" />
          <Stepper label="2nd" value={y} min={1} max={12} onChange={setY} tone="b" />
          <Stepper label="3rd" value={z} min={1} max={12} onChange={setZ} tone="c" />
        </div>
        {both ? (
          <>
            <div className="two-col compare-cols">
              <div className="compare-col">
                <WorkLines expr={L} />
              </div>
              <div className="compare-col">
                <WorkLines expr={R} />
              </div>
            </div>
            <p className="says">
              {evalExpr(L) === evalExpr(R)
                ? pair === "++" || pair === "××"
                  ? `Same value. With only ${pair === "++" ? "adding" : "multiplying"}, this always happens, for any numbers.`
                  : "Same value here. Try other signs and numbers. Find both values to check."
                : "Different values. Here, moving the parentheses changed the value."}
            </p>
          </>
        ) : (
          <p className="muted small">One of these goes below 0. Try other numbers.</p>
        )}
        {(introActive || showCheck) && <ReadingCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

export const U3_BUCKETS = ["toExpr", "toWords", "compareSize", "moveParens"];

/**
 * Pick the expression for one set of words, then WRITE one for new words
 * (round 1, C1-02, user decision: tap where the parentheses go, type the
 * numbers, tap the signs). The second words use a different template, so the
 * picked expression on screen is a model, not the answer. Then find the
 * value of the expression the student wrote.
 */
function toExprProblem(t: WordsTemplate = wordsTemplate()): Problem {
  const { right, wrong } = wordsChoices(t);
  const t2 = wordsTemplate(pick(WORDS_IDS.filter((id) => id !== t.id)));
  return {
    title: "Words to expression",
    bucket: "toExpr",
    story: <>{t.words}</>,
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {done >= 1 ? <ExprView expr={t.expr} size="md" /> : <p className="muted small">Which step do the words say to do first?</p>}
        {done >= 2 && (done >= 3 ? <WorkLines expr={t2.expr} /> : <ExprView expr={t2.expr} focus={pointing(help, 2) ? "next" : null} />)}
      </div>
    ),
    steps: [
      choice(
        {
          prompt: "Which expression matches the words?",
          hint: "Which step do the words say to do first? That part goes in parentheses.",
          explain: `The first step goes in parentheses: ${right}.`,
        },
        right,
        wrong // reading the numbers in word order; only one number multiplied
      ),
      buildStep(t2, `Now write one yourself. ${t2.words}`),
      // The stored order, not "the expression you wrote": the student may have built 3 × (24 − 5) (round 2, C2-07 + E2-24).
      valueStep(t2.expr),
    ],
    wrapUp: (
      <>
        {t.words} That is {exprText(t.expr)}. {t2.words} That is {workText(t2.expr)}.
      </>
    ),
  };
}

/**
 * Read an expression in words. When the expression multiplies a group, the
 * typed step compares it with more copies of the same group (round 1, C1-03:
 * the old "how many times as large as the group" printed its answer in the
 * prompt). Otherwise the typed step is its value.
 */
function toWordsProblem(): Problem {
  const t = wordsTemplate();
  const e = t.expr;
  const outerTimes = e.kind === "op" && e.op === "×";
  const inner = e.kind === "op" ? (e.l.kind === "op" ? e.l : e.r) : e;
  const k = e.kind === "op" ? (e.l.kind === "num" ? e.l.v : e.r.kind === "num" ? e.r.v : 0) : 0;
  const innerText = exprText({ ...inner, sym: undefined } as Expr);
  const j = pick([2, 3]);
  return {
    title: "Expression to words",
    bucket: "toWords",
    story: <>Read {exprText(e)}.</>,
    visual: (done, help) => (done >= 2 && !outerTimes ? <WorkLines expr={e} /> : <ExprView expr={e} focus={pointing(help, 0) ? "next" : null} />),
    steps: [
      choice(
        {
          prompt: `Which words match ${exprText(e)}?`,
          hint: "The part in parentheses is the first step.",
          explain: `${exprText(e)}: ${t.words}`,
        },
        t.words,
        t.wrongWords, // a wrong first step (skips the parentheses), or the subtraction turned around
      ),
      outerTimes
        ? {
            kind: "number",
            // A sentence frame with the blank in it (round 2, E2-25).
            prompt: "Fill in the blank. Don't work it out.",
            prefix: `${j * k} × (${innerText}) is `,
            suffix: `times as large as ${exprText(e)}.`,
            hint: `${exprText(e)} is ${k} copies of (${innerText}). How many times as large is ${j * k} copies as ${k} copies?`,
            explain: `${j * k} copies of (${innerText}) is ${j} times as large as ${k} copies, because ${k} × ${j} = ${j * k}.`,
            answer: j,
            diagnose: (v) =>
              v === j * k
                ? `${exprText(e)} is already ${k} copies. Compare ${j * k} copies with ${k} copies.`
                : v === j * k - k
                  ? `${j * k} is ${v} MORE than ${k}. How many TIMES as large is it?`
                  : v === evalExpr(e) || v === evalExpr(inner) || v === j * k * evalExpr(inner)
                    ? "That's a value you worked out. Compare the copies instead."
                    : null,
          }
        : valueStep(e),
    ],
    wrapUp: (
      <>
        {exprText(e)}: {t.words}
      </>
    ),
  };
}

/** "How big is it?": the "times as large" step compares two multiples of the same group 2 times in 3 (round 1, C1-03). */
function compareProblem(): Problem {
  const variant = pick<"plain" | "ratio">(["plain", "ratio", "ratio"]);
  const t = timesStep(variant);
  const larger = largerCompare();
  return {
    title: "How big is it?",
    bucket: "compareSize",
    story: <>These numbers are big on purpose. Read the expressions. Don&apos;t work them out.</>,
    visual: (done, help) =>
      // After a wrong "which is larger?" pick, the bars show both sizes (round 1, C1-24).
      done >= 2 || pointing(help, 1) ? (
        <BarRows rows={larger.rows} />
      ) : variant === "plain" && (done >= 1 || pointing(help, 0)) ? (
        <TimesBars group={t.group} k={t.k} topLabel={t.group} bottomLabel={`${t.k} × (${t.group})`} />
      ) : (
        <p className="muted small">Look at what is the same and what is different.</p>
      ),
    steps: [t.step, larger.step],
    wrapUp: <>You compared sizes just by reading the expressions.</>,
  };
}

/**
 * Steps 1-2 work out one expression with the parentheses in both places.
 * Step 3 asks about Ty's own numbers, drawn 50/50 on its own (round 3,
 * C3-01: always the opposite of steps 1-2 could be answered without looking).
 * Ty's two expressions are in the picture while step 3 is asked (round 2, C2-04).
 */
function moveProblem(): Problem {
  const change = Math.random() < 0.5;
  const { e, moved } = moveParens(change);
  const ty = changeCompare();
  return {
    title: "Move the parentheses",
    bucket: "moveParens",
    story: <>Same three numbers, same signs. Only the parentheses move. Then Ty tries his own numbers.</>,
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {done >= 1 ? <WorkLines expr={e} /> : <ExprView expr={e} focus={pointing(help, 0) ? "next" : null} />}
        {done >= 1 && (done >= 2 ? <WorkLines expr={moved} /> : <ExprView expr={moved} focus={pointing(help, 1) ? "next" : null} />)}
        {done >= 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p className="muted small">Ty&apos;s two expressions:</p>
            {done >= 3 ? <WorkLines expr={ty.e} /> : <ExprView expr={ty.e} size="md" focus={pointing(help, 2) ? "next" : null} />}
            {done >= 3 ? <WorkLines expr={ty.moved} /> : <ExprView expr={ty.moved} size="md" focus={pointing(help, 2) ? "next" : null} />}
          </div>
        )}
      </div>
    ),
    steps: [
      valueStep(e),
      {
        ...valueStep(moved, `Now find the value of ${exprText(moved)}.`),
        explain: `${workText(moved)}. ${change ? "The value changed." : "The value stayed the same."}`,
      },
      ty.step,
    ],
    wrapUp: <>Sometimes it changes and sometimes it doesn&apos;t. Find both values to check.</>,
  };
}

function Preview() {
  return <TimesBars group="18,932 + 921" k={3} topLabel="18,932 + 921" bottomLabel="3 × (18,932 + 921)" />;
}

export const readingExpressions: Unit = {
  id: "readingExpressions",
  title: "Reading an Expression Without Solving It",
  goal: "Turn words into expressions and expressions into words, and compare sizes without working them out.",
  standard: "5.OA.2",
  keyIdea: (
    <>
      <p>An expression is a math phrase, like 2 × (8 + 7). It says: add 8 and 7, then multiply by 2. The first step goes in parentheses.</p>
      <p>You can compare without working it out: 3 × (18,932 + 921) is 3 times as large as 18,932 + 921.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U3_BUCKETS,
  problems: [
    { label: "Words to expression", make: () => toExprProblem(), buckets: ["toExpr"] },
    { label: "Expression to words", make: () => toWordsProblem(), buckets: ["toWords"] },
    { label: "How big is it?", make: () => compareProblem(), buckets: ["compareSize"] },
    { label: "Move the parentheses", make: () => moveProblem(), buckets: ["moveParens"] },
  ],
  test: readingExpressionsTest,
};
