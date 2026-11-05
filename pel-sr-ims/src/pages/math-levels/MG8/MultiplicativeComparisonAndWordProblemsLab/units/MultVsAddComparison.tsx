import { useState } from "react";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, selectBlank, sentence, type NumberStep, type Problem } from "../../../shared/engine/types";
import { QA, QB, QC, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { ComparisonBars } from "../diagrams";
import { FixedCFU, type CfuQuestion } from "./cfu";
import { makeCtx, type CompareCtx } from "./compareContexts";
import { multVsAddComparisonTest } from "./MultVsAddComparisonTest";

export const MULT_VS_ADD_BUCKETS = ["productUnknown", "factorUnknown", "additive", "pairedStems"];

const num = (ctx: CompareCtx, base: Omit<NumberStep, "kind" | "prefix" | "suffix">): NumberStep => ({ kind: "number", prefix: ctx.prefix, suffix: ctx.suffix, ...base });

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    // The plan's required question: the SAME scenario told both ways, side by side.
    kind: "sentence",
    prompt: (
      <>
        Ty has 6 apples.
        <br />
        <b>Story A:</b> Zoe has 4 <b>times as many</b> apples as Ty.
        <br />
        <b>Story B:</b> Zoe has 4 <b>more</b> apples than Ty.
      </>
    ),
    before: "To find Zoe's apples, Story A uses",
    blank1: { choices: ["multiplication", "addition", "subtraction"], correct: 0 },
    mid: "and Story B uses",
    blank2: { choices: ["multiplication", "addition", "subtraction"], correct: 1 },
    after: ".",
    correctExplain: "Right — 'times as many' means equal copies (multiply); 'more than' means add a bit on.",
    wrongExplain: "Not quite. Look at the key phrase in each story and fix the red box.",
  },
  {
    kind: "numbers",
    prompt: <>Same stories (Ty has 6 apples). How many apples does Zoe have in each?</>,
    boxes: [
      { label: "Story A (4 times as many):", answer: 24 },
      { label: "Story B (4 more):", answer: 10 },
    ],
    correctExplain: "Right — 4 × 6 = 24, but 6 + 4 = 10. Same numbers, very different answers!",
    wrongExplain: "Not quite — Story A is 4 × 6 and Story B is 6 + 4. Fix the red box.",
  },
  {
    // The named conflation: answering "how many times as much" with subtraction.
    kind: "choice",
    prompt: <>A pen costs $3. A book costs $15. How many times as much does the book cost as the pen?</>,
    choices: ["5 times", "12 times", "45 times"],
    correct: 0,
    correctExplain: "Right — 5 × $3 = $15, so the book costs 5 times as much. (It costs $12 MORE — that's a different question.)",
    wrongExplain: "12 is how much MORE the book costs (15 − 3). 'How many times as much' asks: what number times 3 makes 15?",
  },
  {
    // Generalization trap with a counterexample.
    kind: "choice",
    prompt: <>True or False: To find "how many times as many," you can always subtract the smaller number from the bigger one.</>,
    choices: ["True", "False"],
    correct: 1,
    correctExplain: "False — 15 is 5 times as many as 3, but 15 − 3 = 12. Subtracting answers 'how many more'; dividing answers 'how many times as many'.",
    wrongExplain: "Test it: 15 and 3. Is 15 really 12 times as many as 3?",
  },
];

// ============================================================================
// EXPLORE
// ============================================================================

function SideBySideExplore() {
  const [small, setSmall] = useState(6);
  const [n, setN] = useState(4);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Ty has" value={small} min={1} max={12} onChange={setSmall} tone="a" />
        <Stepper label="The number" value={n} min={2} max={9} onChange={setN} tone="b" />
      </div>
      <div className="compare-pair">
        <div className="compare-card">
          <p className="compare-head">
            Zoe has <b>{n} times as many</b> as Ty
          </p>
          <ComparisonBars base={small} times={n} baseLabel="Ty" compLabel="Zoe" width={440} />
          <p className="compare-eq">
            {n} × {small} = <b>{n * small}</b>
          </p>
        </div>
        <div className="compare-card">
          <p className="compare-head">
            Zoe has <b>{n} more</b> than Ty
          </p>
          <ComparisonBars base={small} more={n} baseLabel="Ty" compLabel="Zoe" width={440} />
          <p className="compare-eq">
            {small} + {n} = <b>{small + n}</b>
          </p>
        </div>
      </div>
      <p className="muted small">
        Same two numbers, two different stories. "Times as many" = equal <QB>copies</QB> (multiply, or divide to go back). "More than" = an <QC>extra piece</QC>{" "}
        stuck on (add, or subtract to go back). Read the question's key words BEFORE you pick an operation.
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
      <SideBySideExplore />
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && (
        <FixedCFU title="Check for understanding: times as many, or more than?" questions={CFU_QUESTIONS} onComplete={onIntroDone} />
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — comparison word problems (4 buckets)
// ============================================================================

/** small 3-25 (two-digit hard end), times 2-9. small ≥ 3 keeps "times" and
 *  "more" answers from ever colliding (they only match at 2 and 2). */
function nums(maxSmall = 25) {
  const small = randInt(3, maxSmall);
  const times = randInt(2, 9);
  return { small, times, big: small * times };
}

function makeProductUnknown(): Problem {
  const ctx = makeCtx();
  const { small, times, big } = nums();
  return {
    title: "Times as many: find the bigger amount",
    bucket: "productUnknown",
    story: `${ctx.aHas(small)} ${ctx.bTimes(times)} ${ctx.qB}`,
    visual: (done) => <ComparisonBars base={small} times={times} baseLabel={ctx.aLabel} compLabel={ctx.bLabel} showTotal={done >= 2} />,
    steps: [
      choice(
        {
          prompt: "Which equation finds n, the answer?",
          hint: `"${times} times as much" means ${times} copies of ${small}.`,
          explain: `n = ${times} × ${small} — a multiplicative comparison.`,
        },
        `n = ${times} × ${small}`,
        [`n = ${small} + ${times}`, `n = ${small} ÷ ${times}`]
      ),
      num(ctx, { prompt: ctx.qB, hint: `${times} × ${small} = ?`, explain: `${times} × ${small} = ${big}.`, answer: big }),
      num(ctx, {
        prompt: `Now a different question: ${ctx.qMore}`,
        hint: `"How much more" is additive — subtract: ${big} − ${small}.`,
        explain: `${big} − ${small} = ${big - small}. "${times} times as much" is ${big - small} more — not ${times} more.`,
        answer: big - small,
      }),
    ],
    wrapUp: `${times} × ${small} = ${big} (${times} times as much), which is ${big - small} more.`,
  };
}

function makeFactorUnknown(): Problem {
  const ctx = makeCtx();
  const { small, times, big } = nums();
  // Two genuinely different "factor unknown" shapes, both solved by dividing:
  // the multiplier is unknown, or the smaller amount is unknown.
  if (Math.random() < 0.5) {
    return {
      title: "How many times as many?",
      bucket: "factorUnknown",
      story: `${ctx.aHas(small)} ${ctx.bHas(big)} ${ctx.qTimes}`,
      visual: (done) => <ComparisonBars base={small} times={times} baseLabel={ctx.aLabel} compLabel={ctx.bLabel} showFactor={done >= 2} showCopies={done >= 2} />,
      steps: [
        choice(
          {
            prompt: "Which equation finds n, the answer?",
            hint: `n copies of ${small} make ${big}.`,
            explain: `n × ${small} = ${big}, so n = ${big} ÷ ${small}.`,
          },
          `n = ${big} ÷ ${small}`,
          [`n = ${big} − ${small}`, `n = ${big} × ${small}`]
        ),
        {
          kind: "number",
          prompt: ctx.qTimes,
          hint: `${big} ÷ ${small} = ? (Think: ? × ${small} = ${big}.)`,
          explain: `${big} ÷ ${small} = ${times}, because ${times} × ${small} = ${big}.`,
          answer: times,
          suffix: "times",
        },
        choice(
          {
            prompt: `Is it also true that the bigger amount is ${times} MORE?`,
            hint: `Subtract to check: ${big} − ${small}.`,
            explain: `No — ${big} − ${small} = ${big - small}. "${times} times as many" and "${times} more" are different comparisons.`,
          },
          `No — it's ${big - small} more`,
          [`Yes — ${times} times as many means ${times} more`]
        ),
      ],
      wrapUp: `${big} ÷ ${small} = ${times}: ${times} times as much (and ${big - small} more).`,
    };
  }
  return {
    title: "Find the smaller amount",
    bucket: "factorUnknown",
    story: `${ctx.bIsTimesOfA(big, times)} ${ctx.qA}`,
    visual: (done) => <ComparisonBars base={small} times={times} baseLabel={ctx.aLabel} compLabel={ctx.bLabel} showBase={done >= 2} />,
    steps: [
      choice(
        {
          prompt: "Which equation finds n, the smaller amount?",
          hint: `${big} is ${times} copies of the smaller amount.`,
          explain: `${times} × n = ${big}, so n = ${big} ÷ ${times}.`,
        },
        `n = ${big} ÷ ${times}`,
        [`n = ${big} − ${times}`, `n = ${big} × ${times}`]
      ),
      num(ctx, {
        prompt: ctx.qA,
        hint: `${big} ÷ ${times} = ? (Think: ${times} × ? = ${big}.)`,
        explain: `${big} ÷ ${times} = ${small}, because ${times} × ${small} = ${big}.`,
        answer: small,
      }),
    ],
    wrapUp: `${big} ÷ ${times} = ${small}. Check: ${times} × ${small} = ${big}.`,
  };
}

const MULT_LABEL = "Multiplicative (times as many)";
const ADD_LABEL = "Additive (how many more)";

function makeAdditive(): Problem {
  const ctx = makeCtx();
  if (Math.random() < 0.5) {
    // Difference unknown. Half the time big is a multiple of small, so the
    // wrong operation (dividing) still gives a tempting whole number.
    let small = 0;
    let big = 0;
    if (Math.random() < 0.5) {
      ({ small, big } = nums(12));
    } else {
      small = randInt(5, 50);
      big = small + randInt(5, 60);
    }
    return {
      title: "How many more?",
      bucket: "additive",
      story: `${ctx.aHas(small)} ${ctx.bHas(big)} ${ctx.qMore}`,
      visual: (done) => <ComparisonBars base={small} more={big - small} baseLabel={ctx.aLabel} compLabel={ctx.bLabel} showFactor={done >= 2} />,
      steps: [
        choice(
          {
            prompt: "What kind of comparison is the question asking for?",
            hint: "Look at the question's key words: 'times as' or 'more'?",
            explain: `"How much more" is an additive comparison — find the difference by subtracting.`,
          },
          ADD_LABEL,
          [MULT_LABEL]
        ),
        num(ctx, { prompt: ctx.qMore, hint: `${big} − ${small} = ?`, explain: `${big} − ${small} = ${big - small}.`, answer: big - small }),
      ],
      wrapUp: `${big} − ${small} = ${big - small} more.`,
    };
  }
  // Bigger amount unknown, "more than" wording — the multiply trap.
  const small = randInt(3, 25);
  const more = randInt(2, 40);
  return {
    title: "More than: find the bigger amount",
    bucket: "additive",
    story: `${ctx.aHas(small)} ${ctx.bMore(more)} ${ctx.qB}`,
    visual: (done) => <ComparisonBars base={small} more={more} baseLabel={ctx.aLabel} compLabel={ctx.bLabel} showTotal={done >= 2} />,
    steps: [
      choice(
        {
          prompt: "What kind of comparison is this?",
          hint: `"${more} more than" — is that ${more} copies, or ${more} extra?`,
          explain: `"More than" is additive: add the extra ${more} on.`,
        },
        ADD_LABEL,
        [MULT_LABEL]
      ),
      num(ctx, { prompt: ctx.qB, hint: `${small} + ${more} = ?`, explain: `${small} + ${more} = ${small + more} (not ${more} × ${small}).`, answer: small + more }),
    ],
    wrapUp: `${small} + ${more} = ${small + more}.`,
  };
}

function makePairedStems(): Problem {
  const ctx = makeCtx("count");
  const small = randInt(3, 12);
  const n = randInt(2, 9);
  const timesFirst = Math.random() < 0.5;
  const compareStyle = Math.random() < 0.5; // both amounts known: ÷ vs −, else × vs +
  const big = small * n;

  if (!compareStyle) {
    const s1 = timesFirst ? ctx.bTimes(n) : ctx.bMore(n);
    const s2 = timesFirst ? ctx.bMore(n) : ctx.bTimes(n);
    const a1 = timesFirst ? small * n : small + n;
    const a2 = timesFirst ? small + n : small * n;
    return {
      title: "Twin problems: spot the difference",
      bucket: "pairedStems",
      story: (
        <>
          {ctx.aHas(small)}
          <br />
          <b>Problem 1:</b> {s1} {ctx.qB}
          <br />
          <b>Problem 2:</b> {s2} {ctx.qB}
        </>
      ),
      visual: (done) =>
        done < 1 ? (
          <p className="muted small">Only ONE phrase is different. Find it before you compute.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <ComparisonBars base={small} times={n} baseLabel={ctx.aLabel} compLabel={ctx.bLabel} showTotal={done >= (timesFirst ? 2 : 3)} width={420} />
            <ComparisonBars base={small} more={n} baseLabel={ctx.aLabel} compLabel={ctx.bLabel} showTotal={done >= (timesFirst ? 3 : 2)} width={420} />
          </div>
        ),
      steps: [
        sentence(
          {
            prompt: "Classify first: which operation does each problem need?",
            hint: "'Times as many' → copies. 'More than' → an extra piece.",
            explain: `Problem ${timesFirst ? 1 : 2} says "times as many" (multiply); Problem ${timesFirst ? 2 : 1} says "more than" (add).`,
          },
          "Problem 1 needs ",
          selectBlank(timesFirst ? "multiplication" : "addition", ["multiplication", "addition", "subtraction", "division"]),
          " and Problem 2 needs ",
          selectBlank(timesFirst ? "addition" : "multiplication", ["multiplication", "addition", "subtraction", "division"]),
          "."
        ),
        num(ctx, { prompt: `Problem 1: ${ctx.qB}`, hint: timesFirst ? `${n} × ${small}` : `${small} + ${n}`, explain: `${timesFirst ? `${n} × ${small}` : `${small} + ${n}`} = ${a1}.`, answer: a1 }),
        num(ctx, { prompt: `Problem 2: ${ctx.qB}`, hint: timesFirst ? `${small} + ${n}` : `${n} × ${small}`, explain: `${timesFirst ? `${small} + ${n}` : `${n} × ${small}`} = ${a2}.`, answer: a2 }),
      ],
      wrapUp: `Same numbers, one phrase different: ${a1} vs ${a2}.`,
    };
  }

  const q1 = timesFirst ? ctx.qTimes : ctx.qMore;
  const q2 = timesFirst ? ctx.qMore : ctx.qTimes;
  const a1 = timesFirst ? n : big - small;
  const a2 = timesFirst ? big - small : n;
  const numFor = (isTimes: boolean, label: string, answer: number): NumberStep =>
    isTimes
      ? { kind: "number", prompt: `${label}: ${ctx.qTimes}`, hint: `${big} ÷ ${small}`, explain: `${big} ÷ ${small} = ${n}.`, answer, suffix: "times" }
      : num(ctx, { prompt: `${label}: ${ctx.qMore}`, hint: `${big} − ${small}`, explain: `${big} − ${small} = ${big - small}.`, answer });
  return {
    title: "Twin questions: spot the difference",
    bucket: "pairedStems",
    story: (
      <>
        {ctx.aHas(small)} {ctx.bHas(big)}
        <br />
        <b>Question 1:</b> {q1}
        <br />
        <b>Question 2:</b> {q2}
      </>
    ),
    visual: (done) =>
      done < 1 ? (
        <p className="muted small">Only ONE phrase is different. Find it before you compute.</p>
      ) : (
        <ComparisonBars base={small} times={n} baseLabel={ctx.aLabel} compLabel={ctx.bLabel} showFactor={done >= (timesFirst ? 2 : 3)} showCopies={done >= (timesFirst ? 2 : 3)} />
      ),
    steps: [
      sentence(
        {
          prompt: "Classify first: which operation answers each question?",
          hint: "'Times as many' → divide to find the multiplier. 'How many more' → subtract.",
          explain: `Question ${timesFirst ? 1 : 2} asks "how many times" (divide); Question ${timesFirst ? 2 : 1} asks "how many more" (subtract).`,
        },
        "Question 1 needs ",
        selectBlank(timesFirst ? "division" : "subtraction", ["multiplication", "addition", "subtraction", "division"]),
        " and Question 2 needs ",
        selectBlank(timesFirst ? "subtraction" : "division", ["multiplication", "addition", "subtraction", "division"]),
        "."
      ),
      numFor(timesFirst, "Question 1", a1),
      numFor(!timesFirst, "Question 2", a2),
    ],
    wrapUp: `${big} is ${n} times as many as ${small}, and ${big - small} more.`,
  };
}

function comparisonWordProblem(targetBucket?: string): Problem {
  const bucket = targetBucket ?? pick(MULT_VS_ADD_BUCKETS);
  if (bucket === "productUnknown") return makeProductUnknown();
  if (bucket === "factorUnknown") return makeFactorUnknown();
  if (bucket === "additive") return makeAdditive();
  return makePairedStems();
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <ComparisonBars base={6} times={4} baseLabel="Ty" compLabel="Zoe" width={380} />
      <ComparisonBars base={6} more={4} baseLabel="Ty" compLabel="Zoe" width={380} />
    </div>
  );
}

export const multVsAddComparison: Unit = {
  id: "multVsAddComparison",
  title: "Times As Many vs. More Than",
  goal: "You will be able to solve \"how many times as many\" word problems by multiplying or dividing, and tell them apart from \"how many more\" problems.",
  standard: "4.OA.2",
  keyIdea: (
    <>
      <p>
        <QB>Times as many</QB> is a <b>multiplicative</b> comparison: multiply to find the bigger amount, divide to find the multiplier or the smaller amount.
      </p>
      <p>
        <QA>More than</QA> is an <b>additive</b> comparison: add or subtract. Same numbers, different question → different answer. Read the key words first!
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Comparison Word Problems", make: comparisonWordProblem, buckets: MULT_VS_ADD_BUCKETS }],
  requiredBuckets: MULT_VS_ADD_BUCKETS,
  test: multVsAddComparisonTest,
};
