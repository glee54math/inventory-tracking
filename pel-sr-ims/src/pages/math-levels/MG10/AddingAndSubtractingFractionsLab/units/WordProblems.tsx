import { useState } from "react";
import { BenchmarkLine } from "../diagrams";
import { choice, selectBlank, sentence, type Problem, type Step } from "../../../shared/engine/types";
import { Frac, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { pick } from "../../../shared/lib/math";
import {
  benchmarkHalves,
  claimDraw,
  combine,
  estimateChoices,
  halvesText,
  mixedAddDiagnose,
  mixedBreakdown,
  mixedEstimateHalves,
  mixedRaw,
  mixedSubDiagnose,
  resultDiagnose,
  signOf,
  simplestText,
  twoPeople,
  U5_BUCKETS,
  u5Mixed,
  u5Pair,
  type Op,
} from "../lib/fractions";
import { makeStory, type Story, type StoryKind } from "../lib/stories";
import { answerStep, BoxFrac, lcdStep, rewriteStep } from "../lib/steps";
import { MathText } from "../../../shared/components/MathText";
import { wordProblemsTest } from "./WordProblemsTest";

const BENCH = ["0", "1/2", "1"];

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 vocabulary: "benchmark", read off a number line (two fractions).
 * Q2 typed: estimate a sum from benchmarks.
 * Q3 true/false trap: an add-across answer judged by benchmarks, with the
 *    "a sum is more than each part" reason in the same question.
 * Q4 typed word problem ("how much more"): estimate, then the exact answer.
 */
function WordCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> A <b>benchmark</b> is an easy number to compare with, like 0, 1/2, or 1.
          </p>
          <BenchmarkLine max={1} points={[{ value: 3 / 8, label: "3/8", tone: "a" }, { value: 5 / 6, label: "5/6", tone: "b" }]} />
          <DropdownQuestion
            blanks={[
              { options: BENCH, correct: "1/2", label: "Benchmark closest to 3/8" },
              { options: BENCH, correct: "1", label: "Benchmark closest to 5/6" },
            ]}
            render={([a, b]) => (
              <>
                3/8 is closest to {a}. 5/6 is closest to {b}.
              </>
            )}
            good="Yes. 3/8 is only 1/8 away from 1/2. 5/6 is only 1/6 away from 1."
            bad="Not quite. Look at the dots. Which benchmark is each dot nearest to?"
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Estimate <Frac n={1} d={8} /> + <Frac n={3} d={5} />. Use the benchmarks 0, 1/2, and 1.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "0", label: "Benchmark for 1/8", mixedFraction: true },
              { correct: "1/2", label: "Benchmark for 3/5", mixedFraction: true },
              { correct: "1/2", label: "The estimate", mixedFraction: true },
            ]}
            render={([a, b, c]) => (
              <>
                1/8 is close to:
                <br />
                {a}
                <br />
                3/5 is close to:
                <br />
                {b}
                <br />
                So 1/8 + 3/5 is about:
                <br />
                {c}
              </>
            )}
            good="Right. 0 + 1/2 = 1/2. The exact answer, 29/40, is close to 1/2."
            bad="Not quite. 1/8 is a tiny piece. 3/5 is a little more than half. Add the two benchmarks."
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Leo says <Frac n={1} d={8} /> + <Frac n={1} d={3} /> = <Frac n={2} d={11} />.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "2/11 makes sense" },
              { options: ["less than", "more than"], correct: "less than", label: "2/11 compared to 1/3" },
              { options: ["more than", "less than"], correct: "more than", label: "The sum compared to 1/3" },
            ]}
            render={([a, b, c]) => (
              <>
                True or false: 2/11 makes sense. {a}
                <br />
                2/11 is {b} 1/3. But the sum must be {c} 1/3.
              </>
            )}
            good="Correct. The estimate is 0 + 1/2 = 1/2, and 2/11 is close to 0. Also, 2/11 is less than 1/3 alone. Leo added across."
            bad="Not quite. Estimate first: 1/8 is close to 0 and 1/3 is close to 1/2. Is 2/11 close to 1/2?"
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> A recipe needs <Frac n={7} d={8} /> cup of milk. Mia has <Frac n={1} d={3} /> cup. How much more milk does she need?
          </p>
          <DropdownQuestion
            blanks={[
              { options: BENCH, correct: "1/2", label: "Estimate" },
              { correct: "13", label: "Top of the exact answer", width: 56, accept: (r) => r.trim() === "13" },
              { correct: "24", label: "Bottom of the exact answer", width: 56, accept: (r) => r.trim() === "24" },
            ]}
            render={([a, b, c]) => (
              <>
                Estimate: 1 − 1/2 = {a}. Exact: 7/8 − 1/3 = <BoxFrac n={b} d={c} /> cup.
              </>
            )}
            good="Yes! 21/24 − 8/24 = 13/24. That is close to 1/2, so it makes sense."
            bad={(oks) => (!oks[0] ? "7/8 is close to 1. 1/3 is close to 1/2. Subtract the benchmarks." : "Use the LCD of 8 and 3. Then subtract the new tops.")}
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
  const [mode, setMode] = useState<"bench" | "estimate">("bench");
  const [op, setOp] = useState<Op>("add");
  const [n, setN] = useState(5);
  const [d, setD] = useState(8);
  const [n2, setN2] = useState(1);
  const [d2, setD2] = useState(3);
  const [showExact, setShowExact] = useState(false);
  const a = Math.min(n, d - 1);
  const b = Math.min(n2, d2 - 1);
  const x = a / d;
  // Exactly at 1/4 or 3/4: halfway between two benchmarks, so there is no "closest" one.
  const isTie = (top: number, bottom: number) => Math.abs(top / bottom - 0.25) < 1e-9 || Math.abs(top / bottom - 0.75) < 1e-9;
  const tie = isTie(a, d);
  const h1 = benchmarkHalves(a, d);
  const h2 = benchmarkHalves(b, d2);
  const est = op === "add" ? h1 + h2 : h1 - h2;
  const { L, r } = combine(op, a, d, b, d2);
  const backwards = op === "sub" && r < 0;
  const tieAt = tie ? `${a}/${d}` : isTie(b, d2) ? `${b}/${d2}` : null;
  // Same bar as Practice's u5Pair: a useful estimate is within 1/4 of the exact answer.
  const closeEnough = Math.abs(r / L - est / 2) <= 0.25;
  const sign = signOf(op);
  const change = (set: (v: number) => void) => (v: number) => {
    set(v);
    setShowExact(false);
  };

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          A <b>benchmark</b> is an easy number to compare with. We use 0, 1/2, and 1. Round each fraction to the closest one to estimate. Then check that your exact answer is close.
        </p>
        <Segmented
          label="Mode"
          value={mode}
          onChange={(v) => {
            setMode(v);
            setShowExact(false);
          }}
          options={[
            { id: "bench", label: "Find the benchmark" },
            { id: "estimate", label: "Estimate" },
          ]}
        />
        {mode === "estimate" && (
          <Segmented
            label="Operation"
            value={op}
            onChange={(v) => {
              setOp(v);
              setShowExact(false);
              // A good first difference to estimate: 7/8 − 1/3 is about 1 − 1/2 = 1/2 (exact 13/24).
              if (v === "sub") {
                setN(7);
                setD(8);
                setN2(1);
                setD2(3);
              }
            }}
            options={[
              { id: "add", label: "Add +" },
              { id: "sub", label: "Subtract −" },
            ]}
          />
        )}
        <div className="control-row">
          <Stepper label="Numerator" value={a} min={1} max={d - 1} onChange={change(setN)} tone="a" />
          <Stepper label="Denominator" value={d} min={2} max={12} onChange={change(setD)} tone="a" />
          {mode === "estimate" && (
            <>
              <Stepper label="2nd numerator" value={b} min={1} max={d2 - 1} onChange={change(setN2)} tone="b" />
              <Stepper label="2nd denominator" value={d2} min={2} max={12} onChange={change(setD2)} tone="b" />
            </>
          )}
        </div>
        {mode === "bench" ? (
          <>
            <BenchmarkLine max={1} points={[{ value: x, label: `${a}/${d}`, tone: "a" }]} ringHalves={tie ? undefined : h1} />
            <p className="says">
              {tie ? (
                <>
                  {a}/{d} is exactly halfway between two benchmarks. Try another fraction.
                </>
              ) : (
                <>
                  {a}/{d} is closest to <b>{halvesText(h1)}</b>.
                </>
              )}
            </p>
            <p className="muted small">Hint: compare the top to the bottom. Is the top tiny, about half, or almost all of the bottom?</p>
          </>
        ) : backwards ? (
          <p className="feedback bad">The second fraction is bigger. Make the first one bigger to subtract.</p>
        ) : (
          <>
            <BenchmarkLine
              max={op === "add" ? 2 : 1}
              points={[
                { value: a / d, label: `${a}/${d}`, tone: "a" },
                { value: b / d2, label: `${b}/${d2}`, tone: "b" },
                ...(tieAt ? [] : [{ value: est / 2, label: "estimate", tone: "c" as const, estimate: true }]),
                ...(showExact && !tieAt ? [{ value: r / L, label: simplestText(r, L), tone: "c" as const }] : []),
              ]}
            />
            {tieAt ? (
              <p className="says">{tieAt} is exactly halfway between two benchmarks. Try another fraction.</p>
            ) : (
              <>
                <p className="says">
                  {a}/{d} is close to {halvesText(h1)}. {b}/{d2} is close to {halvesText(h2)}. Estimate: {halvesText(h1)} {sign} {halvesText(h2)} = <b>{halvesText(est)}</b>.
                </p>
                {showExact ? (
                  <p className="says">
                    Exact: {a}/{d} {sign} {b}/{d2} = {(a * L) / d}/{L} {sign} {(b * L) / d2}/{L} = <b>{simplestText(r, L)}</b>.{" "}
                    {closeEnough ? "That's close to the estimate, so it makes sense." : "The estimate is far from the exact answer here. Try fractions closer to 0, 1/2 or 1."}
                  </p>
                ) : (
                  <button className="btn ghost" type="button" style={{ width: "fit-content" }} onClick={() => setShowExact(true)}>
                    {op === "add" ? "Show the exact sum" : "Show the exact difference"}
                  </button>
                )}
              </>
            )}
          </>
        )}
        {(introActive || showCheck) && <WordCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

/**
 * "Which matches the story?" The student turns the story into the operation
 * (5.NF.2: represent the problem with an equation). The choices are always
 * the three ways to write the story's two amounts IN STORY ORDER: first +
 * second, first − second, second − first. `tA` is the bigger amount in a
 * subtraction story; a "BA" story names the smaller one first, so there the
 * right answer is second − first (MG10 review C2-23: no "first minus second"
 * shortcut). Nothing before this step names the operation.
 */
function operationStep(story: Story, tA: string, tB: string): Step {
  const [s1, s2] = story.order === "AB" ? [tA, tB] : [tB, tA];
  const explain =
    story.kind === "total"
      ? `The story puts the two amounts together. So add: ${s1} + ${s2}.`
      : story.kind === "left"
        ? `The story takes ${tB} away from ${tA}. So subtract: ${tA} − ${tB}.`
        : story.kind === "compare"
          ? `The story compares the two amounts. Subtract the smaller one from the bigger one: ${tA} − ${tB}.`
          : `The story asks how much more is needed. Subtract what there is from what is needed: ${tA} − ${tB}.`;
  const all = [`${s1} + ${s2}`, `${s1} − ${s2}`, `${s2} − ${s1}`];
  const right = story.kind === "total" ? all[0] : `${tA} − ${tB}`;
  return choice(
    {
      prompt: "Which matches the story?",
      hint: "Picture what happens in the story. Do two amounts go together? Or do you need the difference between two amounts?",
      explain,
    },
    right,
    all.filter((c) => c !== right)
  );
}

function estimateStep(mixed: boolean, h1: number, h2: number, op: Op, t1: string, t2: string): Step {
  const est = op === "add" ? h1 + h2 : h1 - h2;
  // Kept in number order (like a number line), not shuffled.
  const options = estimateChoices(est);
  return {
    kind: "choice",
    choices: options,
    correct: options.indexOf(halvesText(est)),
    prompt: mixed
      ? "Estimate first. Round each fraction part to 0, 1/2, or 1. About how much is the answer?"
      : "Estimate first. Round each fraction to its benchmark: 0, 1/2, or 1. About how much is the answer?",
    hint: "Find the benchmark for each amount. Then add or subtract them, like the expression you picked.",
    explain: `${t1} is close to ${halvesText(h1)}. ${t2} is close to ${halvesText(h2)}. ${halvesText(h1)} ${signOf(op)} ${halvesText(h2)} = ${halvesText(est)}.`,
  };
}

/** The answer prompt never prints the expression: the student already chose it. */
const ANSWER_PROMPT = "What is the answer? Write it in simplest form. Then check that it is close to your estimate.";

function storyProblem(bucket: "total" | "leftOrMore"): Problem {
  const kind: StoryKind = bucket === "total" ? "total" : pick(["left", "compare", "moreNeeded"] as StoryKind[]);
  const op = kind === "total" ? "add" : "sub";
  const { n1, d1, n2, d2 } = u5Pair(op);
  const story = makeStory(kind, { w: 0, n: n1, d: d1 }, { w: 0, n: n2, d: d2 });
  const { L, a, b, r } = combine(op, n1, d1, n2, d2);
  const h1 = benchmarkHalves(n1, d1);
  const h2 = benchmarkHalves(n2, d2);
  const est = op === "add" ? h1 + h2 : h1 - h2;
  const ans = simplestText(r, L);
  const t1 = `${n1}/${d1}`;
  const t2 = `${n2}/${d2}`;
  return {
    // A neutral title: it must not name the operation before step 1 does.
    title: "Word problem",
    bucket,
    story: story.text,
    visual: (done) => (
      <BenchmarkLine
        max={2}
        points={[
          { value: n1 / d1, label: t1, tone: "a" },
          { value: n2 / d2, label: t2, tone: "b" },
          ...(done >= 2 ? [{ value: est / 2, label: "estimate", tone: "c" as const, estimate: true }] : []),
          ...(done >= 4 ? [{ value: r / L, label: ans, tone: "c" as const }] : []),
        ]}
      />
    ),
    steps: [
      operationStep(story, t1, t2),
      estimateStep(false, h1, h2, op, t1, t2),
      lcdStep(d1, d2, { prompt: `Now find the exact answer. What is the LCD of ${d1} and ${d2}?` }),
      answerStep(
        {
          prompt: ANSWER_PROMPT,
          hint: `Rewrite both with ${L} on the bottom, then ${op === "add" ? "add" : "subtract"} the tops.`,
          explain: `${a}/${L} ${signOf(op)} ${b}/${L} = ${r}/${L}${ans !== `${r}/${L}` ? ` = ${ans}` : ""}. It is close to the estimate, ${halvesText(est)}.`,
        },
        r,
        L,
        resultDiagnose(op, n1, d1, n2, d2)
      ),
    ],
    wrapUp: (
      <>
        {t1} {signOf(op)} {t2} = {ans}. The estimate was {halvesText(est)}, so the answer makes sense.
      </>
    ),
  };
}

const VERDICT_TEXT = { ok: "Yes. It is close to the estimate.", small: "No. It is too small.", big: "No. It is too big." } as const;

function reasonableProblem(): Problem {
  // The verdict is picked first, so each one comes up 1 time in 3.
  const { p, kind, claim } = claimDraw();
  const { n1, d1, n2, d2 } = p;
  const { L, a, b, r } = combine("add", n1, d1, n2, d2);
  const h1 = benchmarkHalves(n1, d1);
  const h2 = benchmarkHalves(n2, d2);
  const est = h1 + h2;
  const [person] = twoPeople();
  const claimText = `${claim.n}/${claim.d}`;
  const verdictOrder = ["ok", "small", "big"] as const;
  const sum = simplestText(r, L);
  const right = claim.verdict === "ok";
  return {
    title: "Does it make sense?",
    bucket: "reasonable",
    story: `${person.name} says ${n1}/${d1} + ${n2}/${d2} = ${claimText}. Check ${person.his} answer with benchmarks first.`,
    visual: (done) => (
      <BenchmarkLine
        max={Math.max(2, Math.ceil(claim.n / claim.d))}
        points={[
          { value: n1 / d1, label: `${n1}/${d1}`, tone: "a" },
          { value: n2 / d2, label: `${n2}/${d2}`, tone: "b" },
          ...(done >= 1 ? [{ value: est / 2, label: "estimate", tone: "c" as const, estimate: true }] : []),
          ...(done >= 2 ? [{ value: claim.n / claim.d, label: claimText, tone: "c" as const }] : []),
        ]}
      />
    ),
    steps: [
      sentence(
        {
          prompt: "Find the benchmark for each fraction.",
          hint: "Is the top tiny, about half, or almost all of the bottom?",
          explain: `${n1}/${d1} is close to ${halvesText(h1)}, and ${n2}/${d2} is close to ${halvesText(h2)}. The estimate is ${halvesText(est)}.`,
        },
        `${n1}/${d1} is close to `,
        selectBlank(halvesText(h1), BENCH),
        `, and ${n2}/${d2} is close to `,
        selectBlank(halvesText(h2), BENCH),
        "."
      ),
      {
        kind: "choice",
        prompt: `The estimate is ${halvesText(est)}. Does ${claimText} make sense?`,
        hint: `Is ${claimText} near ${halvesText(est)}?`,
        explain:
          claim.verdict === "ok"
            ? `${claimText} is close to ${halvesText(est)}, so it makes sense.`
            : claim.verdict === "small"
              ? `${claimText} is much less than ${halvesText(est)}. ${kind === "addAcross" ? `${person.name} added across.` : ""}`
              : `${claimText} is much more than ${halvesText(est)}. ${person.name} changed the tops but kept the bottom ${d1}.`,
        choices: verdictOrder.map((v) => VERDICT_TEXT[v]),
        correct: verdictOrder.indexOf(claim.verdict),
      },
      // A right claim is already on screen, so copying it would prove nothing:
      // the student proves it with the LCD instead. A wrong claim gets fixed.
      right
        ? rewriteStep(n1, d1, n2, d2, { prompt: `Prove it: rewrite both fractions with the LCD, ${L}.` })
        : answerStep(
            {
              prompt: `Now find the exact answer: ${n1}/${d1} + ${n2}/${d2} = ? Write it in simplest form.`,
              hint: `The LCD of ${d1} and ${d2} is ${L}.`,
              explain: `${a}/${L} + ${b}/${L} = ${r}/${L}${sum !== `${r}/${L}` ? ` = ${sum}` : ""}.`,
            },
            r,
            L,
            resultDiagnose("add", n1, d1, n2, d2)
          ),
    ],
    wrapUp: right ? (
      <>
        {a}/{L} + {b}/{L} = {r}/{L}
        {sum !== `${r}/${L}` ? ` = ${sum}` : ""}. {person.name} was right.
      </>
    ) : (
      <>
        The exact answer is {sum}. It is close to the estimate, {halvesText(est)}. {person.name} said {claimText}, so {person.he} was wrong.
      </>
    ),
  };
}

function mixedStoryProblem(): Problem {
  const kind: StoryKind = pick(["total", "total", "left", "compare"] as StoryKind[]);
  const op = kind === "total" ? "add" : "sub";
  const p = u5Mixed(op);
  const { w1, n1, d1, w2, n2, d2 } = p;
  const m = mixedBreakdown(p);
  const story = makeStory(kind, { w: w1, n: n1, d: d1 }, { w: w2, n: n2, d: d2 });
  const est = mixedEstimateHalves(p);
  const h1 = w1 * 2 + benchmarkHalves(n1, d1);
  const h2 = w2 * 2 + benchmarkHalves(n2, d2);
  const t1 = mixedRaw(w1, n1, d1);
  const t2 = mixedRaw(w2, n2, d2);
  const ans = simplestText(m.total, m.L);
  const lo = Math.max(0, Math.min(w1, w2, Math.floor(m.total / m.L)));
  const hi = Math.max(w1 + 1, w2 + 1, Math.ceil(m.total / m.L), Math.ceil(est / 2));
  return {
    title: "Mixed numbers in a story",
    bucket: "mixedStory",
    story: story.text,
    visual: (done) => (
      <BenchmarkLine
        min={lo}
        max={hi}
        points={[
          { value: w1 + n1 / d1, label: t1, tone: "a" },
          { value: w2 + n2 / d2, label: t2, tone: "b" },
          ...(done >= 2 ? [{ value: est / 2, label: "estimate", tone: "c" as const, estimate: true }] : []),
          ...(done >= 4 ? [{ value: m.total / m.L, label: ans, tone: "c" as const }] : []),
        ]}
      />
    ),
    steps: [
      operationStep(story, t1, t2),
      estimateStep(true, h1, h2, op, t1, t2),
      lcdStep(d1, d2, { prompt: `Now find the exact answer. What is the LCD of ${d1} and ${d2}?` }),
      answerStep(
        {
          prompt: ANSWER_PROMPT,
          hint:
            op === "add"
              ? "Rewrite the fraction parts with the LCD. Add the wholes and the fractions. Carry 1 whole if the fraction parts make 1 whole or more."
              : "Rewrite the fraction parts with the LCD. Borrow 1 whole when the first fraction part is smaller.",
          explain:
            op === "add"
              ? `${mixedRaw(w1, m.a, m.L)} + ${mixedRaw(w2, m.b, m.L)} = ${mixedRaw(m.rw, m.rn, m.L)} = ${ans}.`
              : `${m.borrow ? `Borrow: ${mixedRaw(w1, m.a, m.L)} = ${mixedRaw(m.bw, m.ba, m.L)}. ` : ""}${mixedRaw(m.bw, m.ba, m.L)} − ${mixedRaw(w2, m.b, m.L)} = ${ans}.`,
        },
        m.total,
        m.L,
        op === "add" ? mixedAddDiagnose(w1, n1, d1, w2, n2, d2) : mixedSubDiagnose(w1, n1, d1, w2, n2, d2)
      ),
    ],
    wrapUp: (
      <>
        {t1} {signOf(op)} {t2} = {ans}. The estimate was {halvesText(est)}.
      </>
    ),
  };
}

function Preview() {
  return <BenchmarkLine max={1} width={260} points={[{ value: 3 / 8, label: "3/8", tone: "a" }]} ringHalves={1} />;
}

export const wordProblems: Unit = {
  id: "wordProblems",
  title: "Word Problems: Benchmarks and Making Sense",
  goal: "Solve fraction word problems, and use benchmarks (0, 1/2, 1) to check that an answer makes sense.",
  standard: "5.NF.2",
  keyIdea: (
    <>
      <p>
        A benchmark is an easy number to compare with: 0, <Frac n={1} d={2} />, or 1. <Frac n={1} d={8} /> is close to 0. <Frac n={1} d={3} /> is close to <Frac n={1} d={2} />.
      </p>
      <p>
        Estimate first: <Frac n={1} d={8} /> + <Frac n={1} d={3} /> is about 0 + <Frac n={1} d={2} /> = <Frac n={1} d={2} />. The exact answer, <Frac n={11} d={24} />, is close. An answer like{" "}
        <Frac n={2} d={11} /> is not, so it must be wrong.
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U5_BUCKETS,
  problems: [
    // Labels never name the operation (choosing it is step 1 of every story).
    {
      label: "Short stories",
      make: (b) => storyProblem(b === "total" || b === "leftOrMore" ? b : pick(["total", "leftOrMore"] as const)),
      buckets: ["total", "leftOrMore"],
    },
    { label: "Does it make sense?", make: () => reasonableProblem(), buckets: ["reasonable"] },
    { label: "Mixed-number stories", make: () => mixedStoryProblem(), buckets: ["mixedStory"] },
  ],
  test: wordProblemsTest,
};
