import { useState } from "react";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { FixedCFU, type CfuQuestion } from "./cfu";
import { twoStepWordProblemsTest } from "./TwoStepWordProblemsTest";

export const TWO_STEP_BUCKETS = ["multDivThenAddSub", "multThenDiv", "equationWithLetter", "reasonablenessCheck"];

const NAMES = ["Maya", "Diego", "Priya", "Jamal", "Lena", "Omar", "Sofia", "Caleb"];
const ITEMS = ["pencils", "stickers", "marbles", "ribbons", "seashells", "trading cards"];

// ============================================================================
// EXPLORE
// ============================================================================

function TwoStepExplore() {
  const [pattern, setPattern] = useState<"multSub" | "multDiv">("multSub");
  const [packs, setPacks] = useState(4);
  const [perPack, setPerPack] = useState(6);
  const [second, setSecond] = useState(9);
  const step1 = packs * perPack;
  const step2 = pattern === "multSub" ? step1 - second : step1 / Math.max(1, second);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Segmented
        label="Pattern"
        value={pattern}
        onChange={setPattern}
        options={[
          { id: "multSub", label: "Multiply, then subtract" },
          { id: "multDiv", label: "Multiply, then divide" },
        ]}
      />
      <div className="control-row">
        <Stepper label="Packs" value={packs} min={2} max={9} onChange={setPacks} tone="a" />
        <Stepper label="Per pack" value={perPack} min={2} max={9} onChange={setPerPack} tone="b" />
        <Stepper label={pattern === "multSub" ? "Give away" : "Split among"} value={second} min={1} max={9} onChange={setSecond} tone="c" />
      </div>
      <div className="align-stack-wrap">
        <p>
          <b>Step 1:</b> {packs} × {perPack} = <b>{step1}</b> — this is the TOTAL so far, not the final answer yet.
        </p>
        <p>
          <b>Step 2:</b> {pattern === "multSub" ? `${step1} − ${second} = ${step2}` : `${step1} ÷ ${second} = ${Number.isInteger(step2) ? step2 : "?"}`}
          {pattern === "multDiv" && !Number.isInteger(step2) && " (try numbers that divide evenly)"}
        </p>
      </div>
      <p className="muted small">A two-step problem's first answer is really just an in-between number — it's step 2's job to turn it into the real final answer.</p>
    </div>
  );
}

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    kind: "choice",
    prompt: (
      <>
        Sam buys 4 packs of 6 pencils, then gives away 9 pencils. The first step is 4 × 6 = 24. What does 24 represent?
      </>
    ),
    choices: ["The total pencils Sam had before giving any away", "The number of pencils Sam gave away", "The final number of pencils Sam has left"],
    correct: 0,
    correctExplain: "Right — 24 is just the in-between total. You still have to subtract the 9 given away to get the real final answer.",
    wrongExplain: "24 came from 4 × 6 — that's the total BEFORE anything is given away.",
  },
  {
    kind: "choice",
    prompt: <>Using the same problem (4 packs of 6 pencils, then gives away 9), what is the ACTUAL final answer?</>,
    choices: ["15", "24", "33"],
    correct: 0,
    correctExplain: "Right — 4 × 6 = 24, then 24 − 9 = 15 pencils left.",
    wrongExplain: "24 is only the answer to step 1. Don't forget step 2 (subtracting the 9 given away)!",
  },
  {
    kind: "choice",
    prompt: <>True or False: If you've done one operation and gotten a number, you've definitely finished solving a two-step word problem.</>,
    choices: ["True", "False"],
    correct: 1,
    correctExplain: "False — a two-step problem needs TWO operations. Stopping after one step is a common mistake, even if the number you got looks reasonable.",
    wrongExplain: "Think about Sam's pencils — is 24 (after just step 1) really the final answer to that problem?",
  },
  {
    kind: "sentence",
    before: "For 'Sam buys 4 packs of 6 pencils, then gives away 9 — how many pencils p does he have left?', the equation is",
    blank1: { choices: ["p = 4 × 6 − 9", "p = 4 × 6 + 9", "p = 4 − 6 × 9"], correct: 0 },
    mid: ", so p =",
    blank2: { choices: ["15", "24", "33"], correct: 0 },
    after: ".",
    correctExplain: "Right — the equation p = 4 × 6 − 9 captures both steps at once, and solving it gives p = 15.",
  },
];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button type="button" className="btn ghost" style={{ width: "fit-content" }} onClick={() => setShowCheck((v) => !v)}>
          Quick Check
        </button>
      )}
      {(introActive || showCheck) && <FixedCFU title="Quick check: two steps means TWO operations." questions={CFU_QUESTIONS} onComplete={onIntroDone} />}
      <TwoStepExplore />
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — twoStepWordProblem
// ============================================================================

/** Multiply (or divide) first, then add or subtract — covers both
 *  directions the plan's "combined with +/-" bucket describes. */
function makeMultDivThenAddSubProblem(): Problem {
  const name = pick(NAMES);
  const item = pick(ITEMS);
  const divideFirst = Math.random() < 0.5;
  const addSecond = Math.random() < 0.5;

  if (divideFirst) {
    const groups = randInt(2, 6);
    const perGroup = randInt(3, 9);
    const total = groups * perGroup;
    const second = randInt(2, perGroup - 1 > 1 ? perGroup - 1 : 2);
    const step1 = perGroup; // total / groups
    const final = addSecond ? step1 + second : step1 - second;
    return {
      title: "Two steps: divide, then " + (addSecond ? "add" : "subtract"),
      bucket: "multDivThenAddSub",
      story: `${name} splits ${total} ${item} evenly into ${groups} equal groups. Then ${name} ${addSecond ? `adds ${second} more ${item} to one group` : `takes ${second} ${item} out of one group`}. How many ${item} are in that group now?`,
      visual: () => null,
      steps: [
        { kind: "number", prompt: `Step 1: ${total} ÷ ${groups} = ?`, hint: "Find how many are in each group first.", explain: `${total} ÷ ${groups} = ${step1} ${item} per group.`, answer: step1 },
        { kind: "number", prompt: `Step 2: ${step1} ${addSecond ? "+" : "−"} ${second} = ?`, hint: "Use step 1's answer, not the original total.", explain: `${step1} ${addSecond ? "+" : "−"} ${second} = ${final}.`, answer: final },
      ],
      wrapUp: `${total} ÷ ${groups} = ${step1}, then ${step1} ${addSecond ? "+" : "−"} ${second} = ${final}.`,
    };
  }

  const packs = randInt(2, 9);
  const perPack = randInt(2, 9);
  const step1 = packs * perPack;
  // Capped so an "add" final answer stays within 100 (3rd-grade range);
  // step1 ≤ 81, so the cap is never below 19.
  const second = randInt(2, Math.max(2, Math.min(Math.floor(step1 / 2), 100 - step1)));
  const final = addSecond ? step1 + second : step1 - second;
  return {
    title: "Two steps: multiply, then " + (addSecond ? "add" : "subtract"),
    bucket: "multDivThenAddSub",
    story: `${name} buys ${packs} packs of ${perPack} ${item}. Then ${name} ${addSecond ? `gets ${second} more ${item} as a gift` : `gives away ${second} ${item}`}. How many ${item} does ${name} have now?`,
    visual: () => null,
    steps: [
      { kind: "number", prompt: `Step 1: ${packs} × ${perPack} = ?`, hint: "Find the total before the second step.", explain: `${packs} × ${perPack} = ${step1} ${item}.`, answer: step1 },
      { kind: "number", prompt: `Step 2: ${step1} ${addSecond ? "+" : "−"} ${second} = ?`, hint: "Use step 1's answer, not the pack numbers.", explain: `${step1} ${addSecond ? "+" : "−"} ${second} = ${final}.`, answer: final },
    ],
    wrapUp: `${packs} × ${perPack} = ${step1}, then ${step1} ${addSecond ? "+" : "−"} ${second} = ${final}.`,
  };
}

/** Two multiplicative steps in sequence (split, then split again — the
 *  plan's own "24 apples into 4 baskets, then each basket among 2 people"
 *  shape), a genuinely different shape from the +/- bucket above. */
function makeMultThenDivProblem(): Problem {
  const name = pick(NAMES);
  const item = pick(ITEMS);
  let groups = 0;
  let people = 0;
  let perGroup = 0;
  let total = 0;
  do {
    groups = randInt(2, 6);
    people = randInt(2, 6);
    perGroup = people * randInt(2, 6); // guarantees even division in step 2
    total = groups * perGroup;
  } while (total > 100); // keep the starting dividend within 100
  const final = perGroup / people;
  return {
    title: "Two steps: split, then split again",
    bucket: "multThenDiv",
    story: `${name} has ${total} ${item} split evenly into ${groups} baskets. Then the ${item} in ONE basket are split evenly among ${people} friends. How many ${item} does each friend get?`,
    visual: () => null,
    steps: [
      { kind: "number", prompt: `Step 1: ${total} ÷ ${groups} = ?`, hint: "Find how many are in one basket first.", explain: `${total} ÷ ${groups} = ${perGroup} ${item} in one basket.`, answer: perGroup },
      { kind: "number", prompt: `Step 2: ${perGroup} ÷ ${people} = ?`, hint: "Now split that basket's amount among the friends.", explain: `${perGroup} ÷ ${people} = ${final} ${item} each.`, answer: final },
    ],
    wrapUp: `${total} ÷ ${groups} = ${perGroup}, then ${perGroup} ÷ ${people} = ${final} each.`,
  };
}

/** Requires writing the equation with a letter for the unknown BEFORE solving. */
function makeEquationWithLetterProblem(): Problem {
  const name = pick(NAMES);
  const item = pick(ITEMS);
  const packs = randInt(2, 9);
  const perPack = randInt(2, 9);
  const step1 = packs * perPack;
  const giveAway = randInt(2, Math.max(2, Math.floor(step1 / 2)));
  const final = step1 - giveAway;
  const letter = "n";
  const correctEq = `${letter} = ${packs} × ${perPack} − ${giveAway}`;
  const wrongOrderEq = `${letter} = ${packs} − ${perPack} × ${giveAway}`;
  const wrongOpEq = `${letter} = ${packs} × ${perPack} + ${giveAway}`;

  return {
    title: "Write the equation first",
    bucket: "equationWithLetter",
    story: `${name} buys ${packs} packs of ${perPack} ${item}, then gives away ${giveAway} ${item}. Let ${letter} be the number of ${item} ${name} has left.`,
    visual: () => null,
    steps: [
      choice(
        {
          prompt: `Which equation correctly represents this problem?`,
          hint: "Multiply first for the total, then subtract what's given away.",
          explain: `${correctEq} — multiply for the total bought, then subtract what was given away.`,
        },
        correctEq,
        [wrongOrderEq, wrongOpEq]
      ),
      { kind: "number", prompt: `Now solve: ${correctEq.replace(`${letter} = `, "")} = ?`, hint: `${packs} × ${perPack} first, then subtract ${giveAway}.`, explain: `${packs} × ${perPack} = ${step1}, then ${step1} − ${giveAway} = ${final}.`, answer: final },
    ],
    wrapUp: `${correctEq}, so ${letter} = ${final}.`,
  };
}

/** Reasonableness check: given a computed answer (sometimes a deliberately
 *  wrong "trap" answer from a dropped step or wrong operation), judge
 *  plausibility using estimation/rounding. */
function makeReasonablenessProblem(): Problem {
  const name = pick(NAMES);
  const item = pick(ITEMS);
  const packs = randInt(3, 9);
  const perPack = randInt(3, 9);
  const step1 = packs * perPack;
  const giveAway = randInt(2, Math.max(2, Math.floor(step1 / 2)));
  const correctFinal = step1 - giveAway;

  const trapIsCorrect = Math.random() < 0.4;
  // The trap answer is the "stopped after step 1" mistake — a genuinely
  // common, diagnosable error, not an arbitrary wrong number.
  const shownAnswer = trapIsCorrect ? correctFinal : step1;
  // Estimate by rounding the step-1 total to the nearest ten, then taking
  // away the (rounded) give-away amount — 3.OA.8's "estimation strategies
  // including rounding". Only shown once the judgment step is answered, so
  // it can't give the yes/no answer away up front.
  const roundTen = (n: number) => Math.round(n / 10) * 10;
  const estimate = roundTen(step1) - roundTen(giveAway);

  return {
    title: "Is this answer reasonable?",
    bucket: "reasonablenessCheck",
    story: `${name} buys ${packs} packs of ${perPack} ${item}, then gives away ${giveAway} ${item}. A classmate says the answer is ${shownAnswer} ${item} left. Is that reasonable?`,
    visual: (done) =>
      done < 1 ? (
        <p className="muted small">Hint for checking: the total bought is {packs} × {perPack}. After giving some away, should the answer be smaller than that total?</p>
      ) : (
        <p className="muted small">
          Estimate: {step1} rounds to about {roundTen(step1)}, and {giveAway} rounds to about {roundTen(giveAway)}, so the answer should be about {estimate}.
        </p>
      ),
    steps: [
      choice(
        {
          prompt: `Is ${shownAnswer} a reasonable final answer?`,
          hint: `Estimate ${packs} × ${perPack} first — should the final answer (after giving some away) be smaller or the same as that?`,
          explain: trapIsCorrect
            ? `Yes — ${packs} × ${perPack} = ${step1}, then ${step1} − ${giveAway} = ${correctFinal}, which matches.`
            : `No — ${shownAnswer} equals ${packs} × ${perPack}, which is the total BEFORE giving any away. The classmate forgot step 2 (subtracting ${giveAway}).`,
        },
        trapIsCorrect ? "Yes, that's reasonable" : "No, that's not reasonable",
        trapIsCorrect ? ["No, that's not reasonable"] : ["Yes, that's reasonable"]
      ),
      { kind: "number", prompt: `What IS the correct final answer?`, hint: `${packs} × ${perPack}, then subtract ${giveAway}.`, explain: `${packs} × ${perPack} = ${step1}, then ${step1} − ${giveAway} = ${correctFinal}.`, answer: correctFinal },
    ],
    wrapUp: `The correct answer is ${correctFinal} ${item} — ${trapIsCorrect ? "the classmate's answer matched" : "the classmate's answer skipped the second step"}.`,
  };
}

function twoStepWordProblem(targetBucket?: string): Problem {
  const bucket = targetBucket ?? pick(TWO_STEP_BUCKETS);
  switch (bucket) {
    case "multDivThenAddSub":
      return makeMultDivThenAddSubProblem();
    case "multThenDiv":
      return makeMultThenDivProblem();
    case "equationWithLetter":
      return makeEquationWithLetterProblem();
    default:
      return makeReasonablenessProblem();
  }
}

export const twoStepWordProblems: Unit = {
  id: "twoStepWordProblems",
  title: "Two-Step Word Problems",
  goal: "You will be able to solve a word problem that takes two steps and uses any mix of the four operations, write it as an equation with a letter for the unknown, and check whether your answer makes sense.",
  standard: "3.OA.8",
  keyIdea: (
    <>
      <p>A two-step word problem needs TWO operations — the first step's answer is usually just an in-between number, not the final answer.</p>
      <p>Always ask: does my final answer make sense? Estimating first can catch a common mistake — stopping after step 1.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Two-Step Problems", make: twoStepWordProblem, buckets: TWO_STEP_BUCKETS }],
  requiredBuckets: TWO_STEP_BUCKETS,
  test: twoStepWordProblemsTest,
};
