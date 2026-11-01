import { useState } from "react";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, numberBlank, sentence, type Problem } from "../../../shared/engine/types";
import { QA, QB, Says, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { ComparisonBars } from "../diagrams";
import { FixedCFU, type CfuQuestion } from "./cfu";
import { comparisonEquationsTest } from "./ComparisonEquationsTest";

export const COMPARISON_EQUATION_BUCKETS = ["sentenceToEquation", "equationToSentence", "matchTrap"];

const NAMES = ["Maria", "Jo", "Ben", "Kim", "Omar", "Lena", "Priya", "Diego", "Tia", "Raj", "Sam", "Ana"];
const ITEMS = ["stickers", "marbles", "books", "shells", "cards", "stamps", "pencils", "beads"];

/** Two different names, a noun, and base ≠ times (so the two readings of
 *  total = times × base are different sentences, and "times more" can never
 *  equal `times`). Base reaches 12 — the top of the facts range — on purpose. */
function scenario() {
  let base = 0;
  let times = 0;
  do {
    base = randInt(2, 12);
    times = randInt(2, 9);
  } while (base === times);
  const big = pick(NAMES);
  let small = pick(NAMES);
  while (small === big) small = pick(NAMES);
  return { big, small, item: pick(ITEMS), base, times, total: base * times };
}

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    // Direction trap (the plan's required question): same equation, the two
    // "times as many" sentences pointing opposite ways, plus an additive one.
    kind: "choice",
    prompt: <>Ben has 20 marbles. Kim has 5 marbles. 20 = 4 × 5. Which sentence is true?</>,
    choices: ["Ben has 4 times as many marbles as Kim.", "Kim has 4 times as many marbles as Ben.", "Ben has 4 more marbles than Kim."],
    correct: 0,
    correctExplain: "Right — Ben has the bigger amount, so Ben has 4 times as many. His 20 is 4 copies of Kim's 5.",
    wrongExplain: "Check who has MORE. The person with the bigger amount is the one who has 'times as many' — and 20 is 15 more than 5, not 4 more.",
  },
  {
    // Sentence → equation, with the additive and division look-alikes.
    kind: "sentence",
    prompt: <>Tia has 3 times as many shells as Raj. Raj has 6 shells. Let t be the number of shells Tia has.</>,
    before: "t =",
    blank1: { choices: ["3 × 6", "3 + 6", "6 ÷ 3"], correct: 0 },
    mid: ", so t =",
    blank2: { choices: ["9", "18", "2"], correct: 1 },
    after: ".",
    correctExplain: "Right — 3 times as many as 6 is 3 × 6, so Tia has 18 shells.",
    wrongExplain: "Not quite. '3 times as many as 6' means 3 copies of 6. Fix the red box.",
  },
  {
    // Generalization / true-false trap with a counterexample.
    kind: "choice",
    prompt: <>True or False: "5 times as many" and "5 more than" always give the same answer.</>,
    choices: ["True", "False"],
    correct: 1,
    correctExplain: "False — 5 times as many as 10 is 50, but 5 more than 10 is only 15. Times as many means copies; more than means adding a bit on.",
    wrongExplain: "Try it with 10: what is 5 times as many as 10? What is 5 more than 10?",
  },
  {
    // Vocabulary: one multiplication equation has TWO comparison readings.
    kind: "sentence",
    prompt: <>35 = 5 × 7 can be read two ways.</>,
    before: "35 is 5 times as many as",
    blank1: { choices: ["35", "7", "5"], correct: 1 },
    mid: ", and 35 is also",
    blank2: { choices: ["5", "35", "7"], correct: 2 },
    after: "times as many as 5.",
    correctExplain: "Right — 5 × 7 = 7 × 5, so 35 is 5 times as many as 7 AND 7 times as many as 5.",
    wrongExplain: "Not quite. Remember 5 × 7 and 7 × 5 are the same number — fix the red box.",
  },
];

// ============================================================================
// EXPLORE
// ============================================================================

function ComparisonExplore() {
  const [base, setBase] = useState(6);
  const [times, setTimes] = useState(4);
  const [reading, setReading] = useState<"first" | "second">("first");
  const total = base * times;
  const flip = reading === "second";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Jo has" value={base} min={1} max={12} onChange={setBase} tone="a" />
        <Stepper label="Times as many" value={times} min={2} max={9} onChange={setTimes} tone="b" />
      </div>
      <ComparisonBars base={base} times={times} baseLabel="Jo" compLabel="Maria" />
      <Says>
        <QB>Maria</QB> has <b>{times} times as many</b> as <QA>Jo</QA>: {times} copies of {base} make <b>{total}</b>.
      </Says>
      <p style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
        {total} = {times} × {base}
      </p>
      <div className="align-stack-wrap" style={{ marginTop: 0 }}>
        <p style={{ marginTop: 0 }}>One equation, two ways to read it:</p>
        <Segmented
          label="Reading"
          value={reading}
          onChange={setReading}
          options={[
            { id: "first", label: `${total} is ${times} times as many as ${base}` },
            { id: "second", label: `${total} is ${base} times as many as ${times}` },
          ]}
        />
        <div style={{ marginTop: 12 }}>
          <ComparisonBars base={flip ? times : base} times={flip ? base : times} baseLabel={flip ? `${times}` : `${base}`} compLabel={`${total}`} />
        </div>
        <p className="muted small">
          {flip
            ? `Same ${total}, cut into ${base} copies of ${times} this time.`
            : `${total} cut into ${times} copies of ${base}.`}{" "}
          Either way, the BIGGER number is the one that is "times as many."
        </p>
      </div>
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
      {(introActive || showCheck) && (
        <FixedCFU title="Check for understanding: who has 'times as many'?" questions={CFU_QUESTIONS} onComplete={onIntroDone} />
      )}
      <p style={{ margin: 0 }}>
        <b>"Times as many"</b> means the bigger amount is made of equal copies of the smaller amount. Change the numbers and watch the bars.
      </p>
      <ComparisonExplore />
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — comparison ⇄ equation (3 buckets)
// ============================================================================

function makeSentenceToEquation(): Problem {
  const s = scenario();
  return {
    title: "Sentence → equation",
    bucket: "sentenceToEquation",
    story: (
      <>
        <QB>{s.big}</QB> has {s.times} times as many {s.item} as <QA>{s.small}</QA>. <QA>{s.small}</QA> has {s.base} {s.item}.
      </>
    ),
    visual: (done) => <ComparisonBars base={s.base} times={s.times} baseLabel={s.small} compLabel={s.big} showTotal={done >= 2} />,
    steps: [
      choice(
        {
          prompt: `Let n be the number of ${s.item} ${s.big} has. Which equation matches?`,
          hint: `${s.big}'s bar is ${s.times} copies of ${s.small}'s bar.`,
          explain: `"${s.times} times as many as ${s.base}" is ${s.times} × ${s.base}, so n = ${s.times} × ${s.base}.`,
        },
        `n = ${s.times} × ${s.base}`,
        [`n = ${s.times} + ${s.base}`, `${s.base} = ${s.times} × n`]
      ),
      {
        kind: "number",
        prompt: `So how many ${s.item} does ${s.big} have?`,
        hint: `${s.times} × ${s.base} = ?`,
        explain: `${s.times} × ${s.base} = ${s.total}.`,
        answer: s.total,
        suffix: s.item,
      },
      {
        kind: "number",
        prompt: `${s.total} = ${s.times} × ${s.base} can be read the other way too: ${s.total} is ___ times as many as ${s.times}.`,
        hint: `${s.times} × ${s.base} is the same as ${s.base} × ${s.times}.`,
        explain: `${s.total} = ${s.base} × ${s.times}, so ${s.total} is ${s.base} times as many as ${s.times}.`,
        answer: s.base,
      },
    ],
    wrapUp: `${s.big} has ${s.times} × ${s.base} = ${s.total} ${s.item} — ${s.times} times as many as ${s.small}.`,
  };
}

function makeEquationToSentence(): Problem {
  const s = scenario();
  return {
    title: "Equation → sentence",
    bucket: "equationToSentence",
    story: (
      <>
        Read the equation <b>{s.total} = {s.times} × {s.base}</b> as a comparison.
      </>
    ),
    visual: () => <ComparisonBars base={s.base} times={s.times} baseLabel="smaller" compLabel="bigger" />,
    steps: [
      sentence(
        {
          prompt: "Fill in both blanks.",
          hint: "The bigger number is the one that is 'times as many'. The multiplier is the number you multiply by.",
          explain: `${s.total} is ${s.times} times as many as ${s.base}.`,
        },
        "",
        numberBlank(s.total),
        " is ",
        numberBlank(s.times),
        ` times as many as ${s.base}.`
      ),
      choice(
        {
          prompt: `Which story matches ${s.total} = ${s.times} × ${s.base}?`,
          hint: "The person with the bigger amount has 'times as many'.",
          explain: `${s.big} has the bigger amount, ${s.total}, which is ${s.times} copies of ${s.small}'s ${s.base}.`,
        },
        `${s.big} has ${s.total} ${s.item}, ${s.times} times as many as ${s.small}, who has ${s.base}.`,
        [
          `${s.small} has ${s.base} ${s.item}, ${s.times} times as many as ${s.big}, who has ${s.total}.`,
          `${s.big} has ${s.total} ${s.item}, ${s.times} more than ${s.small}, who has ${s.base}.`,
        ]
      ),
    ],
    wrapUp: `${s.total} = ${s.times} × ${s.base}: ${s.total} is ${s.times} times as many as ${s.base}.`,
  };
}

function makeMatchTrap(): Problem {
  const s = scenario();
  return {
    title: "Pick the matching sentence",
    bucket: "matchTrap",
    story: (
      <>
        <QA>{s.small}</QA> has {s.base} {s.item}. <QB>{s.big}</QB> has {s.total} {s.item}. Notice that {s.total} = {s.times} × {s.base}.
      </>
    ),
    visual: (done) =>
      done < 1 ? (
        <p className="muted small">The bar picture appears after you pick a sentence.</p>
      ) : (
        <ComparisonBars base={s.base} times={s.times} baseLabel={s.small} compLabel={s.big} />
      ),
    steps: [
      choice(
        {
          prompt: "Which sentence matches?",
          hint: "Who has the bigger amount? That person has 'times as many'. Watch out for 'more than'.",
          explain: `${s.big}'s ${s.total} is ${s.times} copies of ${s.small}'s ${s.base}, so ${s.big} has ${s.times} times as many.`,
        },
        `${s.big} has ${s.times} times as many ${s.item} as ${s.small}.`,
        [
          `${s.small} has ${s.times} times as many ${s.item} as ${s.big}.`,
          `${s.big} has ${s.times} more ${s.item} than ${s.small}.`,
          `${s.big} has ${s.base} times as many ${s.item} as ${s.small}.`,
        ]
      ),
      {
        kind: "number",
        prompt: `Now a DIFFERENT question: how many MORE ${s.item} does ${s.big} have than ${s.small}?`,
        hint: `"How many more" means subtract: ${s.total} − ${s.base}.`,
        explain: `${s.total} − ${s.base} = ${s.total - s.base} more — not ${s.times}. "Times as many" and "more than" are different comparisons.`,
        answer: s.total - s.base,
        suffix: s.item,
      },
    ],
    wrapUp: `${s.big} has ${s.times} times as many ${s.item} as ${s.small}, which is ${s.total - s.base} more.`,
  };
}

function comparisonProblem(targetBucket?: string): Problem {
  const bucket = targetBucket ?? pick(COMPARISON_EQUATION_BUCKETS);
  if (bucket === "sentenceToEquation") return makeSentenceToEquation();
  if (bucket === "equationToSentence") return makeEquationToSentence();
  return makeMatchTrap();
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <ComparisonBars base={6} times={4} baseLabel="Jo" compLabel="Maria" width={420} />;
}

export const comparisonEquations: Unit = {
  id: "comparisonEquations",
  title: "Multiplicative Comparison as Equations",
  goal: "You will be able to read 35 = 5 × 7 as \"35 is 5 times as many as 7,\" and write an equation from a \"times as many\" sentence.",
  standard: "4.OA.1",
  keyIdea: (
    <>
      <p>
        <b>35 = 5 × 7</b> can be read as <b>"35 is 5 times as many as 7"</b> — the bigger amount is 5 equal copies of the smaller amount. It can also be read
        "35 is 7 times as many as 5."
      </p>
      <p>Watch the direction: the BIGGER amount is always the one that is "times as many." And "times as many" is not the same as "more than."</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Comparisons ⇄ Equations", make: comparisonProblem, buckets: COMPARISON_EQUATION_BUCKETS }],
  requiredBuckets: COMPARISON_EQUATION_BUCKETS,
  test: comparisonEquationsTest,
};
