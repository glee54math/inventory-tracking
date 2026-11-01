import { useState } from "react";
import { pick } from "../../../shared/lib/math";
import { choice, type NumberStep, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { FixedCFU, type CfuQuestion } from "./cfu";
import { MAKERS, reasonableCase, roundTen, type Multistep, type MultistepKind } from "./multistepScenarios";
import { multistepWordProblemsTest } from "./MultistepWordProblemsTest";

export const MULTISTEP_BUCKETS = ["addSubThenMultDiv", "multDivThenAddSub", "letterEquation", "reasonableness"];

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    // The plan's required generalization trap: "just use the last two numbers."
    kind: "choice",
    prompt: (
      <>
        Jen buys 3 packs of 12 cards. Then she gives 8 cards to her brother. How many cards does she have now?
        <br />
        <b>True or False:</b> You can solve this by using only the last two numbers you read (12 and 8).
      </>
    ),
    choices: ["True", "False"],
    correct: 1,
    correctExplain: "False — 12 − 8 = 4 ignores the 3 packs! First 3 × 12 = 36 cards, THEN 36 − 8 = 28. Read the whole story before computing.",
    wrongExplain: "Using only 12 and 8 forgets that there are 3 packs. Does Jen really have just 4 cards?",
  },
  {
    kind: "sentence",
    prompt: <>Let c be the number of cards Jen has now (3 packs of 12, then gives away 8).</>,
    before: "c =",
    blank1: { choices: ["12 − 8", "3 × 12 − 8", "3 × 12 + 8"], correct: 1 },
    mid: ", so c =",
    blank2: { choices: ["4", "28", "44"], correct: 1 },
    after: ".",
    correctExplain: "Right — c = 3 × 12 − 8 holds BOTH steps in one equation: 36 − 8 = 28.",
    wrongExplain: "Not quite. The equation needs every number in the story. Fix the red box.",
  },
  {
    // Vocabulary: what the letter in an equation is.
    kind: "choice",
    prompt: <>In c = 3 × 12 − 8, what does the letter c stand for?</>,
    choices: ["The unknown — the number we are trying to find", "The number 3", "Nothing — it's just a label for 'cards' and doesn't stand for a number"],
    correct: 0,
    correctExplain: "Right — a letter in an equation stands for the unknown number. Here c = 28.",
    wrongExplain: "A letter in an equation stands for a NUMBER we don't know yet — the answer we're looking for.",
  },
  {
    // Reasonableness by estimating — catches an off-by-10 slip.
    kind: "sentence",
    prompt: <>Raj worked out 6 × 52 + 9 and got 3,129. Estimate: 6 × 50 + 10.</>,
    before: "The estimate is about",
    blank1: { choices: ["310", "3,100", "67"], correct: 0 },
    mid: ", so Raj's answer",
    blank2: { choices: ["is reasonable", "is about 10 times too big"], correct: 1 },
    after: ".",
    correctExplain: "Right — the estimate is about 310, and 3,129 is about 10 times that. (6 × 52 = 312, so the real answer is 321.)",
    wrongExplain: "Not quite. Work out 6 × 50 + 10 first, then compare it with 3,129.",
  },
];

// ============================================================================
// EXPLORE
// ============================================================================

type ExploreKind = "addThenMultiply" | "subtractThenDivide" | "multiplyThenAdd";

function StoryBuilder() {
  const [kind, setKind] = useState<ExploreKind>("multiplyThenAdd");
  const [x, setX] = useState(4); // groups / packs
  const [y, setY] = useState(23); // per group / each
  const [z, setZ] = useState(17); // second number

  let story = "";
  let step1 = "";
  let step2 = "";
  let eq = "";
  let lastTwo = "";
  let estimate = "";
  if (kind === "multiplyThenAdd") {
    const prod = x * y;
    story = `Maya has ${x} boxes with ${y} crayons in each, plus ${z} loose crayons. How many crayons in all?`;
    step1 = `${x} × ${y} = ${prod} crayons in the boxes`;
    step2 = `${prod} + ${z} = ${prod + z} crayons in all`;
    eq = `n = ${x} × ${y} + ${z}`;
    lastTwo = `${y} + ${z} = ${y + z}`;
    estimate = `${x} × ${roundTen(y)} + ${roundTen(z)} = ${x * roundTen(y) + roundTen(z)}`;
  } else if (kind === "addThenMultiply") {
    const one = y + z;
    story = `There are ${x} bags. Each has ${y} red marbles and ${z} blue marbles. How many marbles in all?`;
    step1 = `${y} + ${z} = ${one} marbles in ONE bag`;
    step2 = `${one} × ${x} = ${one * x} marbles in all`;
    eq = `m = (${y} + ${z}) × ${x}`;
    lastTwo = `${y} + ${z} = ${one}`;
    estimate = `(${roundTen(y)} + ${roundTen(z)}) × ${x} = ${(roundTen(y) + roundTen(z)) * x}`;
  } else {
    // Built backward (total = each × groups + kept) so the share is always even.
    const total = y * x + z;
    story = `Diego has ${total} stickers. He keeps ${z} and shares the rest equally among ${x} friends. How many does each friend get?`;
    step1 = `${total} − ${z} = ${total - z} stickers to share`;
    step2 = `${total - z} ÷ ${x} = ${y} stickers each`;
    eq = `s = (${total} − ${z}) ÷ ${x}`;
    lastTwo = `${z} and ${x}?  That ignores the ${total} stickers!`;
    estimate = `about ${roundTen(total - z)} ÷ ${x}`;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Segmented
        label="Story"
        value={kind}
        onChange={setKind}
        options={[
          { id: "multiplyThenAdd", label: "Multiply, then add" },
          { id: "addThenMultiply", label: "Add, then multiply" },
          { id: "subtractThenDivide", label: "Subtract, then divide" },
        ]}
      />
      <div className="control-row">
        <Stepper label={kind === "multiplyThenAdd" ? "Boxes" : kind === "addThenMultiply" ? "Bags" : "Friends"} value={x} min={2} max={9} onChange={setX} tone="a" />
        <Stepper label={kind === "multiplyThenAdd" ? "In each box" : kind === "addThenMultiply" ? "Red" : "Each gets"} value={y} min={5} max={48} onChange={setY} tone="b" />
        <Stepper label={kind === "multiplyThenAdd" ? "Loose" : kind === "addThenMultiply" ? "Blue" : "Keeps"} value={z} min={1} max={40} onChange={setZ} tone="c" />
      </div>
      <div className="story-card">
        <p style={{ margin: 0 }}>{story}</p>
      </div>
      <ol className="work-steps">
        <li>
          <b>Step 1:</b> {step1} <span className="muted small">(an in-between number, NOT the answer yet)</span>
        </li>
        <li>
          <b>Step 2:</b> {step2}
        </li>
      </ol>
      <p style={{ margin: 0 }}>
        <b>One equation with a letter for the unknown:</b> <span className="eq-chip">{eq}</span>
      </p>
      <p style={{ margin: 0 }}>
        <b>Does it make sense?</b> Estimate: {estimate}.
      </p>
      <p className="muted small" style={{ margin: 0 }}>
        ✗ Trap — using only the last two numbers: {lastTwo}
      </p>
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
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
      {(introActive || showCheck) && <FixedCFU title="Check for understanding: read the WHOLE story first." questions={CFU_QUESTIONS} onComplete={onIntroDone} />}
      <StoryBuilder />
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — multistep word problems (4 buckets)
// ============================================================================

const numStep = (m: Multistep, base: Omit<NumberStep, "kind" | "prefix" | "suffix">): NumberStep => ({ kind: "number", prefix: m.prefix, suffix: m.suffix, ...base });

/** Shows the work done so far: step values appear only once they're solved. */
function WorkSoFar({ m, done, offset = 0 }: { m: Multistep; done: number; offset?: number }) {
  const shown = m.work.slice(0, Math.max(0, done - offset));
  if (shown.length === 0) return <p className="muted small">Read the whole story. What do you need to find FIRST?</p>;
  return (
    <ol className="work-steps">
      {shown.map((w, i) => (
        <li key={i}>
          {w.expr} = <b>{w.value}</b>
        </li>
      ))}
    </ol>
  );
}

function stepsFirstProblem(m: Multistep, bucket: string, title: string): Problem {
  const [w1, w2] = m.work;
  return {
    title,
    bucket,
    story: m.story,
    visual: (done) => <WorkSoFar m={m} done={done} />,
    steps: [
      numStep(m, { prompt: `Step 1: ${m.step1Q}`, hint: `Work out ${w1.expr}.`, explain: `${w1.expr} = ${w1.value}. That's ${m.step1Meaning.toLowerCase()} — not the final answer yet.`, answer: w1.value }),
      numStep(m, { prompt: "Step 2: Now answer the question in the story.", hint: `Use step 1's answer: ${w2.expr}.`, explain: `${w2.expr} = ${w2.value}.`, answer: m.final }),
      choice(
        {
          prompt: `Let ${m.letter} be ${m.unknownDesc}. Which equation shows the WHOLE problem?`,
          hint: "It must use every number in the story, in the order you just worked.",
          explain: `${m.equation} — both steps in one equation, so ${m.letter} = ${m.final}.`,
        },
        m.equation,
        [m.lastTwoEquation, m.wrongOpEquation]
      ),
    ],
    wrapUp: `${m.equation}: ${m.work.map((w) => `${w.expr} = ${w.value}`).join(", then ")}.`,
  };
}

function makeLetterEquation(): Problem {
  const m = MAKERS[pick(["addThenMultiply", "subtractThenDivide", "multiplyThenSubtract", "multiplyThenAdd", "divideThenAdd", "twoProducts"] as MultistepKind[])]();
  return {
    title: m.kind === "twoProducts" ? "Write the equation first (three steps!)" : "Write the equation first",
    bucket: "letterEquation",
    story: `${m.story} Let ${m.letter} be ${m.unknownDesc}.`,
    visual: (done) => (done < 1 ? <p className="muted small">Write the equation BEFORE computing anything.</p> : <WorkSoFar m={m} done={done >= 2 ? m.work.length + 1 : 0} offset={1} />),
    steps: [
      choice(
        {
          prompt: `Which equation matches the whole problem?`,
          hint: "Every number in the story has a job. Don't just grab the last two.",
          explain: `${m.equation}.`,
        },
        m.equation,
        [m.lastTwoEquation, m.wrongOpEquation]
      ),
      numStep(m, {
        prompt: `Solve: ${m.equation}. What is ${m.letter}?`,
        hint: m.equation.includes("(") ? "Do the part in parentheses first." : "Multiply or divide first, then add or subtract.",
        explain: m.work.map((w) => `${w.expr} = ${w.value}`).join(", then ") + ".",
        answer: m.final,
      }),
    ],
    wrapUp: `${m.letter} = ${m.final}.`,
  };
}

function makeReasonableness(): Problem {
  const r = reasonableCase();
  const showCorrect = Math.random() < 0.4;
  const shown = showCorrect ? r.m.final : r.slip;
  const YES = "Yes — it's close to the estimate";
  const NO = "No — it's way too big compared with the estimate";
  return {
    title: "Is this answer reasonable?",
    bucket: "reasonableness",
    story: `${r.m.story} A classmate says the answer is ${shown.toLocaleString("en-US")}.`,
    visual: (done) =>
      done < 1 ? (
        <p className="muted small">Estimate first: round {r.per} and {r.extra} to the nearest ten.</p>
      ) : (
        <p className="muted small">
          Estimate: {r.q} × {roundTen(r.per)} + {roundTen(r.extra)} = <b>{r.estimate}</b>. Classmate: <b>{shown.toLocaleString("en-US")}</b>.
        </p>
      ),
    steps: [
      numStep(r.m, {
        prompt: `Round ${r.per} and ${r.extra} to the nearest ten. About how many in all?`,
        hint: `${r.q} × ${roundTen(r.per)} + ${roundTen(r.extra)}.`,
        explain: `${r.q} × ${roundTen(r.per)} = ${r.q * roundTen(r.per)}, plus ${roundTen(r.extra)} is about ${r.estimate}.`,
        answer: r.estimate,
      }),
      choice(
        {
          prompt: `Is ${shown.toLocaleString("en-US")} reasonable?`,
          hint: `Compare it with your estimate of about ${r.estimate}.`,
          explain: showCorrect
            ? `Yes — ${shown} is close to ${r.estimate}.`
            : `No — ${shown.toLocaleString("en-US")} is way bigger than ${r.estimate}. The classmate made ${r.q} × ${r.per} ten times too big (it's ${r.q * r.per}).`,
        },
        showCorrect ? YES : NO,
        [showCorrect ? NO : YES]
      ),
      numStep(r.m, {
        prompt: "What is the exact answer?",
        hint: `${r.q} × ${r.per} first, then add ${r.extra}.`,
        explain: `${r.q} × ${r.per} = ${r.q * r.per}, then + ${r.extra} = ${r.m.final}. Close to ${r.estimate} ✓`,
        answer: r.m.final,
      }),
    ],
    wrapUp: `Exact ${r.m.final}, estimate about ${r.estimate} — they agree, so the exact answer makes sense.`,
  };
}

function multistepProblem(targetBucket?: string): Problem {
  const bucket = targetBucket ?? pick(MULTISTEP_BUCKETS);
  if (bucket === "addSubThenMultDiv") {
    const m = MAKERS[pick(["addThenMultiply", "subtractThenDivide"] as MultistepKind[])]();
    return stepsFirstProblem(m, bucket, m.kind === "addThenMultiply" ? "Add, then multiply" : "Subtract, then divide");
  }
  if (bucket === "multDivThenAddSub") {
    const m = MAKERS[pick(["multiplyThenSubtract", "multiplyThenAdd", "divideThenAdd"] as MultistepKind[])]();
    return stepsFirstProblem(m, bucket, m.kind === "multiplyThenSubtract" ? "Multiply, then subtract" : m.kind === "multiplyThenAdd" ? "Multiply, then add" : "Divide, then add");
  }
  if (bucket === "letterEquation") return makeLetterEquation();
  return makeReasonableness();
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 15 }}>
      <span>4 boxes of 23 crayons + 17 loose</span>
      <span>
        Step 1: 4 × 23 = <b>92</b>
      </span>
      <span>
        Step 2: 92 + 17 = <b>109</b>
      </span>
      <span className="eq-chip">n = 4 × 23 + 17</span>
    </div>
  );
}

export const multistepWordProblems: Unit = {
  id: "multistepWordProblems",
  title: "Multistep Word Problems",
  goal: "You will be able to solve word problems that take two or three steps, write them as one equation with a letter for the unknown, and check that the answer makes sense.",
  standard: "4.OA.3",
  keyIdea: (
    <>
      <p>Read the WHOLE story before computing. The first step's answer is an in-between number — not the final answer.</p>
      <p>
        A letter (like <b>n</b>) stands for the unknown number: <b>n = 4 × 23 + 17</b>. Estimate (round to the nearest ten) to check your answer makes sense.
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Multistep Problems", make: multistepProblem, buckets: MULTISTEP_BUCKETS }],
  requiredBuckets: MULTISTEP_BUCKETS,
  test: multistepWordProblemsTest,
};
