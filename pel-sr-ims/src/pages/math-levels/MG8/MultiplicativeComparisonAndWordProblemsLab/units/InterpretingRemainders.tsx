import { useState } from "react";
import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem, type RatioStep } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { GroupStrip, type StripHighlight } from "../diagrams";
import { FixedCFU, type CfuQuestion } from "./cfu";
import { ALL_FRAMINGS, actionText, answerWithUnit, remainderCase, type Framing, type RemainderCase } from "./remainderScenarios";
import { interpretingRemaindersTest } from "./InterpretingRemaindersTest";

export const REMAINDER_BUCKETS = ["discard", "roundUp", "remainderAnswer", "mixedStems"];

const BUCKET_FRAMING: Record<string, Framing> = { discard: "full", roundUp: "needed", remainderAnswer: "left" };

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    // The plan's required question: ONE division fact, three questions, three different answers.
    kind: "numbers",
    prompt: (
      <>
        27 students are going on a trip. Each van holds 6 students. <b>27 ÷ 6 = 4 R 3.</b> Answer all three questions:
      </>
    ),
    boxes: [
      { label: "How many vans can be completely filled?", answer: 4 },
      { label: "How many vans are needed so every student gets a ride?", answer: 5 },
      { label: "After filling as many vans as possible, how many students are left over?", answer: 3 },
    ],
    correctExplain: "Right — same division, three different answers: 4 full vans, 5 vans needed, 3 students left over. The question decides!",
    wrongExplain: "Not quite. All three use 27 ÷ 6 = 4 R 3, but each question wants something different. Fix the red box.",
  },
  {
    // Vocabulary: quotient vs remainder vs divisor.
    kind: "sentence",
    prompt: <>In 27 ÷ 6 = 4 R 3:</>,
    before: "the 4 is the",
    blank1: { choices: ["quotient", "remainder", "divisor"], correct: 0 },
    mid: "and the 3 is the",
    blank2: { choices: ["quotient", "remainder", "divisor"], correct: 1 },
    after: ".",
    correctExplain: "Right — the quotient (4) is how many full groups; the remainder (3) is what's left after making them.",
    wrongExplain: "Not quite. The quotient is the answer to the division; the remainder is what's left over. Fix the red box.",
  },
  {
    // Generalization trap — the most common default error.
    kind: "choice",
    prompt: <>True or False: When a division has a remainder, you should always just drop the remainder.</>,
    choices: ["True", "False"],
    correct: 1,
    correctExplain: "False — if 27 students need vans that hold 6, dropping the remainder leaves 3 students behind! Sometimes you add one, sometimes the remainder IS the answer.",
    wrongExplain: "Think about the vans: 4 vans carry 24 students. What about the other 3?",
  },
  {
    kind: "choice",
    prompt: <>50 books, 8 books per box (50 ÷ 8 = 6 R 2). Which question needs you to ADD ONE to the quotient?</>,
    choices: ["How many boxes are needed to pack all 50 books?", "How many boxes can be filled completely?", "How many books are left after filling the boxes?"],
    correct: 0,
    correctExplain: "Right — the 2 extra books still need a box, so 6 + 1 = 7 boxes are needed.",
    wrongExplain: "Which question has to make room for the 2 leftover books?",
  },
];

// ============================================================================
// EXPLORE
// ============================================================================

function RemainderExplore() {
  const [n, setN] = useState(27);
  const [d, setD] = useState(6);
  const [framing, setFraming] = useState<Framing>("needed");
  const q = Math.floor(n / d);
  const r = n % d;
  const highlight: StripHighlight = r === 0 && framing === "left" ? null : framing;
  const answers: Record<Framing, string> = {
    full: `${q} van${q === 1 ? "" : "s"} completely full`,
    needed: r === 0 ? `${q} vans needed (no remainder — nothing extra!)` : `${q} + 1 = ${q + 1} vans needed`,
    left: `${r} student${r === 1 ? "" : "s"} left over`,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="control-row">
        <Stepper label="Students" value={n} min={10} max={99} onChange={setN} tone="a" />
        <Stepper label="Each van holds" value={d} min={2} max={9} onChange={setD} tone="b" />
      </div>
      <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
        {n} ÷ {d} = {q}
        {r > 0 ? ` R ${r}` : ""}
      </p>
      <Segmented
        label="Question"
        value={framing}
        onChange={setFraming}
        options={[
          { id: "full", label: "How many FULL vans?" },
          { id: "needed", label: "How many vans NEEDED?" },
          { id: "left", label: "How many LEFT OVER?" },
        ]}
      />
      <GroupStrip groupSize={d} fullGroups={q} leftover={r} highlight={highlight} groupWord={["van", "vans"]} />
      <p className="says" style={{ margin: 0 }}>
        Answer: <b>{answers[framing]}</b>
      </p>
      <p className="muted small" style={{ margin: 0 }}>
        Same division, three questions. The green boxes show what each question counts. Try a number of students that divides evenly — what happens to "needed"?
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
      {(introActive || showCheck) && <FixedCFU title="Check for understanding: the question decides what the remainder means." questions={CFU_QUESTIONS} onComplete={onIntroDone} />}
      <RemainderExplore />
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — interpreting remainders (4 buckets)
// ============================================================================

const divideStep = (c: RemainderCase): RatioStep => ({
  kind: "ratio",
  prompt: `First divide: ${c.n} ÷ ${c.d}.`,
  hint: `How many ${c.d}s fit into ${c.n}? (${c.d} × ? is close to ${c.n} without going over.) What's left?`,
  explain: `${c.d} × ${c.q} = ${c.d * c.q}, and ${c.n} − ${c.d * c.q} = ${c.r}, so ${c.q} R ${c.r}.`,
  answer: [c.q, c.r],
  labels: ["quotient", "remainder"],
  tones: "none",
  frame: [`${c.n} ÷ ${c.d} =`, "R", ""],
});

const EXPLAIN: Record<Framing, string> = {
  full: "Only FULL groups count, so the remainder is dropped.",
  needed: "The leftover ones still need a spot, so one more group is added.",
  left: "The question asks what's left over — that's the remainder itself.",
};

/** Big dividends often; remainder at its extremes (1 or divisor − 1) often. */
function caseFor() {
  const roll = Math.random();
  return remainderCase({ big: Math.random() < 0.5, rOne: roll < 0.25, rMax: roll >= 0.25 && roll < 0.5 });
}

function makeFraming(bucket: string): Problem {
  const f = BUCKET_FRAMING[bucket];
  const c = caseFor();
  const acts = actionText(c);
  return {
    title: f === "full" ? "Full groups only" : f === "needed" ? "How many are needed?" : "What's left over?",
    bucket,
    story: `${c.ctx.setup(c.n, c.d)} ${c.ctx.q[f]}`,
    visual: (done) =>
      done < 1 ? (
        <p className="muted small">Divide first — the picture appears once you have the quotient and remainder.</p>
      ) : (
        <GroupStrip groupSize={c.d} fullGroups={c.q} leftover={c.r} highlight={done >= 2 ? f : null} groupWord={c.ctx.group} />
      ),
    steps: [
      divideStep(c),
      choice(
        {
          prompt: `${c.ctx.q[f]} What should you do with the remainder, ${c.r}?`,
          hint: "Read the question's last words: full groups? groups needed? left over?",
          explain: EXPLAIN[f],
        },
        acts[f],
        ALL_FRAMINGS.filter((g) => g !== f).map((g) => acts[g])
      ),
      {
        kind: "number",
        prompt: c.ctx.q[f],
        hint: f === "full" ? `Just the quotient: ${c.q}.` : f === "needed" ? `${c.q} + 1.` : `The remainder: ${c.r}.`,
        explain: `${answerWithUnit(c, f)}.`,
        answer: c.answer[f],
      },
    ],
    wrapUp: `${c.n} ÷ ${c.d} = ${c.q} R ${c.r} → ${answerWithUnit(c, f)}.`,
  };
}

function makeMixedStems(): Problem {
  const c = caseFor();
  const [fa, fb] = shuffle(ALL_FRAMINGS);
  return {
    title: "Same numbers, different questions",
    bucket: "mixedStems",
    story: (
      <>
        {c.ctx.setup(c.n, c.d)}
        <br />
        <b>Question A:</b> {c.ctx.q[fa]}
        <br />
        <b>Question B:</b> {c.ctx.q[fb]}
      </>
    ),
    visual: (done) =>
      done < 1 ? (
        <p className="muted small">The two questions differ only at the very end. Read them carefully!</p>
      ) : (
        <GroupStrip groupSize={c.d} fullGroups={c.q} leftover={c.r} highlight={done >= 3 ? fb : done >= 2 ? fa : null} groupWord={c.ctx.group} />
      ),
    steps: [
      divideStep(c),
      { kind: "number", prompt: `Question A: ${c.ctx.q[fa]}`, hint: EXPLAIN[fa], explain: `${answerWithUnit(c, fa)} — ${EXPLAIN[fa].toLowerCase()}`, answer: c.answer[fa] },
      { kind: "number", prompt: `Question B: ${c.ctx.q[fb]}`, hint: EXPLAIN[fb], explain: `${answerWithUnit(c, fb)} — ${EXPLAIN[fb].toLowerCase()}`, answer: c.answer[fb] },
    ],
    wrapUp: `One division (${c.q} R ${c.r}), two different answers: ${answerWithUnit(c, fa)} and ${answerWithUnit(c, fb)}.`,
  };
}

function remainderProblem(targetBucket?: string): Problem {
  const bucket = targetBucket ?? pick(REMAINDER_BUCKETS);
  return bucket === "mixedStems" ? makeMixedStems() : makeFraming(bucket);
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <GroupStrip groupSize={6} fullGroups={4} leftover={3} highlight="needed" groupWord={["van", "vans"]} />;
}

export const interpretingRemainders: Unit = {
  id: "interpretingRemainders",
  title: "Interpreting Remainders",
  goal: "You will be able to solve a division word problem with a remainder and decide what the remainder means: drop it, add one more group, or give the remainder as the answer.",
  standard: "4.OA.3",
  keyIdea: (
    <>
      <p>
        27 ÷ 6 = 4 R 3. The question decides what to do with the 3: <b>full</b> vans → 4 (drop it); vans <b>needed</b> → 5 (add one); students <b>left over</b> → 3
        (the remainder is the answer).
      </p>
      <p>Don't always drop the remainder — read the end of the question first!</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Remainder Problems", make: remainderProblem, buckets: REMAINDER_BUCKETS }],
  requiredBuckets: REMAINDER_BUCKETS,
  test: interpretingRemaindersTest,
};
