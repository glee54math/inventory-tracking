import { useState } from "react";
import { FractionBar, PieceBars } from "../diagrams";
import { choice, type Problem } from "../../../shared/engine/types";
import { Frac, Segmented, Stepper } from "../../../shared/engine/controls";
import { pick } from "../../../shared/lib/math";
import type { Unit } from "../../../shared/units/types";
import { combineParams, compareParams, mixedText, multiStepParams } from "../lib/fractions";
import { amountStep } from "../lib/steps";
import { AMOUNT_CONTEXTS, amountWords, NAMES, sameWholeParams, twoNames, unitFor } from "../lib/words";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "./cfu";
import { fractionWordProblemsTest } from "./FractionWordProblemsTest";
import { MathText } from "../../../shared/components/MathText";

const BAR_W = 170; // every whole drawn the same width — the "same whole" made visible

function TwoWholes({ a, d, small, large }: { a: number; d: number; small: string; large: string }) {
  return (
    <MathText>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <FractionBar numerator={a} denominator={d} width={110} height={44} />
          <p className="muted small">{small}</p>
        </div>
        <div>
          <FractionBar numerator={a} denominator={d} width={260} height={44} />
          <p className="muted small">{large}</p>
        </div>
      </div>
    </MathText>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 story language → operation, plus the answer (both boxes graded on
 * their own). Q2 the plan's required same-whole question: WHY can't the
 * numerators just be added, and is the combined amount more or less than one
 * small pizza. Q3 the generalization trap ("same denominator = always
 * addable"). Q4 planning a two-step story.
 */
function WordProblemsCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> "Jen had <Frac n={7} d={8} /> cup of milk and used <Frac n={3} d={8} /> cup. How much milk is left?"
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["addition", "subtraction"], correct: "subtraction", label: "Operation" },
              { options: ["4/8 cup", "10/8 cup", "4/0 cup"], correct: "4/8 cup", label: "Answer" },
            ]}
            render={([a, b]) => (
              <>
                This story needs {a}, and the answer is {b}.
              </>
            )}
            good={"Correct — \"used\" and \"left\" mean some is taken away: 7/8 − 3/8 = 4/8 cup. The pieces are still eighths."}
            bad="Not quite. Does using milk make the amount bigger or smaller? And when you take eighths away, are the pieces still eighths?"
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Ava ate <Frac n={1} d={2} /> of a small pizza. Kai ate <Frac n={1} d={2} /> of a large pizza. Kai says, "1/2 + 1/2 = 2/2, so together we ate exactly 1
            whole pizza."
          </p>
          <TwoWholes a={1} d={2} small="small pizza" large="large pizza" />
          <DropdownQuestion
            blanks={[
              {
                options: ["the pizzas are different sizes, so the halves aren't the same size", "he should have added the denominators: 2/4", "nothing — he's right"],
                correct: "the pizzas are different sizes, so the halves aren't the same size",
                label: "What's wrong",
              },
              { options: ["less than", "exactly", "more than"], correct: "more than", label: "Compared to one small pizza" },
            ]}
            render={([a, b]) => (
              <>
                Kai is wrong because {a}. Together they ate {b} one small pizza.
              </>
            )}
            good="Correct — you can only add the numerators when the pieces come from the SAME whole. Half of a small pizza plus half of a LARGE one is more than one small pizza (the large half is bigger)."
            bad="Not quite. Compare the two halves in the picture — are they the same size? Then: a small half plus a bigger half — is that more or less than two small halves?"
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> True or false: if two fractions have the same denominator, you can ALWAYS add them by adding the numerators.
          </p>
          <DropdownQuestion
            blanks={[{ options: ["True", "False"], correct: "False", label: "True or false" }]}
            render={([a]) => <>That statement is {a}.</>}
            good="Correct — false! They also have to be parts of the same whole (or same-size wholes). 1/2 of a small pizza + 1/2 of a large pizza isn't 2/2 of anything."
            bad="Not quite — think back to question 2. Same denominator, but were those halves the same size?"
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> "Max had 2 <Frac n={3} d={4} /> cups of flour. He bought 1 <Frac n={2} d={4} /> cups more, then used 2 <Frac n={1} d={4} /> cups. How much is left?"
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["add", "subtract"], correct: "add", label: "First step" },
              { options: ["add", "subtract"], correct: "subtract", label: "Second step" },
            ]}
            render={([a, b]) => (
              <>
                First {a} 1 2/4 to 2 3/4, then {b} 2 1/4.
              </>
            )}
            good={'Correct — "bought more" makes it grow (add), "used" makes it shrink (subtract): 2 3/4 + 1 2/4 = 4 1/4, then 4 1/4 − 2 1/4 = 2 cups.'}
            bad="Not quite — which part of the story makes the flour grow, and which makes it shrink?"
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

type Kind = "combine" | "left" | "compare";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [kind, setKind] = useState<Kind>("combine");
  const [d, setD] = useState(4);
  const [x, setX] = useState(7);
  const [y, setY] = useState(3);
  const [showWholes, setShowWholes] = useState(false);
  const c = AMOUNT_CONTEXTS[0];
  const yy = kind === "combine" ? y : Math.min(y, x);
  const result = kind === "combine" ? x + yy : x - yy;

  const story =
    kind === "combine"
      ? `Ana used ${amountWords(x, d, c)} of ribbon for one bow and ${amountWords(yy, d, c)} for another. How much did she use in all?`
      : kind === "left"
        ? `Ana had ${amountWords(x, d, c)} of ribbon and used ${amountWords(yy, d, c)}. How much is left?`
        : `Ana's ribbon is ${amountWords(x, d, c)} long. Ben's is ${amountWords(yy, d, c)}. How much longer is Ana's?`;

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          The story's words tell you the operation: "in all" / "altogether" → <b>add</b>; "left" / "how much more" / "how much longer" → <b>subtract</b>.
        </p>
        <Segmented
          label="Story type"
          value={kind}
          onChange={setKind}
          options={[
            { id: "combine", label: "Put together" },
            { id: "left", label: "Take away" },
            { id: "compare", label: "Compare" },
          ]}
        />
        <div className="control-row">
          <Stepper label="Pieces in a yard" value={d} min={2} max={10} onChange={setD} tone="c" />
          <Stepper label="First amount (pieces)" value={x} min={1} max={4 * d} onChange={setX} tone="a" />
          <Stepper label="Second amount (pieces)" value={yy} min={1} max={kind === "combine" ? 4 * d : x} onChange={setY} tone="b" />
        </div>
        <p className="says">{story}</p>
        {kind === "combine" && <PieceBars den={d} barWidth={BAR_W} segments={[{ count: x, tone: "a" }, { count: yy, tone: "b" }]} />}
        {kind === "left" && <PieceBars den={d} barWidth={BAR_W} segments={[{ count: x - yy, tone: "a" }, { count: yy, tone: "gone" }]} />}
        {kind === "compare" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <PieceBars den={d} barWidth={BAR_W} segments={[{ count: yy, tone: "a" }, { count: x - yy, tone: "c" }]} caption="Ana's ribbon (the violet part is the extra)" />
            <PieceBars den={d} barWidth={BAR_W} segments={[{ count: yy, tone: "b" }]} minWholes={Math.ceil(x / d)} caption="Ben's ribbon" />
          </div>
        )}
        <p className="says" style={{ fontSize: 18 }}>
          {mixedText(x, d)} {kind === "combine" ? "+" : "−"} {mixedText(yy, d)} = <b>{amountWords(result, d, c)}</b>
        </p>
        <button className="btn ghost" type="button" style={{ width: "fit-content" }} onClick={() => setShowWholes((v) => !v)}>
          {showWholes ? "Hide the same-whole trap" : "What if the wholes are different sizes?"}
        </button>
        {showWholes && (
          <div>
            <TwoWholes a={1} d={2} small="1/2 of a small pizza" large="1/2 of a large pizza" />
            <p className="muted small">
              Both are "1/2" — but not the same amount! Fractions can only be added (or compared) when they are parts of the same whole, or wholes of the same size.
            </p>
          </div>
        )}
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <WordProblemsCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

const ADD = "Add — the story puts amounts together";
const SUB = "Subtract — the story takes away or finds a difference";

function combineProblem(): Problem {
  const { d, x, y } = combineParams();
  const c = pick(AMOUNT_CONTEXTS);
  const name = pick(NAMES);
  const t = x + y;
  return {
    title: "Put two amounts together",
    bucket: "combine",
    story: `${name} used ${amountWords(x, d, c)} of ${c.item} for one project and ${amountWords(y, d, c)} for another. How much ${c.item} did ${name} use in all?`,
    visual: () => <PieceBars den={d} barWidth={BAR_W} segments={[{ count: x, tone: "a" }, { count: y, tone: "b" }]} />,
    steps: [
      choice({ prompt: "Add or subtract?", hint: '"In all" is a clue.', explain: "Two amounts used, and we want the total: add." }, ADD, [SUB]),
      amountStep({ prompt: `How much ${c.item} in all?`, hint: `${mixedText(x, d)} + ${mixedText(y, d)} — regroup if the pieces make a whole.`, explain: `${mixedText(x, d)} + ${mixedText(y, d)} = ${mixedText(t, d)}.` }, t, d, unitFor(t, d, c)),
    ],
    wrapUp: `${name} used ${amountWords(t, d, c)} of ${c.item} in all.`,
  };
}

function compareProblem(): Problem {
  const { d, x, y } = compareParams();
  const c = pick(AMOUNT_CONTEXTS);
  const [a, b] = twoNames();
  const r = x - y;
  const asLeft = Math.random() < 0.5;
  const story = asLeft
    ? `${a} had ${amountWords(x, d, c)} of ${c.item} and ${c.use} ${amountWords(y, d, c)}. How much ${c.item} is left?`
    : `${a} has ${amountWords(x, d, c)} of ${c.item}. ${b} has ${amountWords(y, d, c)}. How much more does ${a} have than ${b}?`;
  const [X, Y] = [mixedText(x, d), mixedText(y, d)];
  return {
    title: asLeft ? "How much is left?" : "How much more?",
    bucket: "compare",
    story,
    visual: (done) =>
      asLeft ? (
        <PieceBars den={d} barWidth={BAR_W} segments={done >= 1 ? [{ count: r, tone: "a" }, { count: y, tone: "gone" }] : [{ count: x, tone: "a" }]} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <PieceBars den={d} barWidth={BAR_W} segments={done >= 1 ? [{ count: y, tone: "a" }, { count: r, tone: "c" }] : [{ count: x, tone: "a" }]} caption={a} />
          <PieceBars den={d} barWidth={BAR_W} segments={[{ count: y, tone: "b" }]} minWholes={Math.ceil(x / d)} caption={b} />
        </div>
      ),
    steps: [
      choice(
        { prompt: "Which equation solves the story?", hint: asLeft ? "Start with what there was, take away what was used." : "Difference = bigger amount − smaller amount.", explain: `${X} − ${Y}.` },
        `${X} − ${Y}`,
        [
          `${X} + ${Y}`, // added because two numbers appear
          `${Y} − ${X}`, // subtracted in the wrong order
        ]
      ),
      amountStep({ prompt: "Solve it.", hint: "Unbundle a whole if the first fraction part is too small.", explain: `${X} − ${Y} = ${mixedText(r, d)}.` }, r, d, unitFor(r, d, c)),
      amountStep(
        { prompt: `Check: ${mixedText(r, d)} + ${Y} = ?`, hint: "Adding back should give the starting amount.", explain: `${mixedText(r, d)} + ${Y} = ${X} ✓` },
        x,
        d,
        unitFor(x, d, c)
      ),
    ],
    wrapUp: asLeft ? `${amountWords(r, d, c)} of ${c.item} is left.` : `${a} has ${amountWords(r, d, c)} more than ${b}.`,
  };
}

function multiStepProblem(): Problem {
  const { d, x, y, z } = multiStepParams();
  const c = pick(AMOUNT_CONTEXTS);
  const name = pick(NAMES);
  const [X, Y, Z] = [mixedText(x, d), mixedText(y, d), mixedText(z, d)];
  return {
    title: "Two-step story",
    bucket: "multiStep",
    story: `${name} had ${amountWords(x, d, c)} of ${c.item}, ${c.gain} ${amountWords(y, d, c)} more, and then ${c.use} ${amountWords(z, d, c)}. How much ${c.item} is there now?`,
    visual: (done) => (
      <PieceBars den={d} barWidth={BAR_W} segments={done >= 3 ? [{ count: x + y - z, tone: "a" }, { count: z, tone: "gone" }] : done >= 2 ? [{ count: x, tone: "a" }, { count: y, tone: "b" }] : [{ count: x, tone: "a" }]} />
    ),
    steps: [
      choice(
        { prompt: "Which plan solves it?", hint: `"${c.gain}" makes it grow; "${c.use}" makes it shrink.`, explain: `Add ${Y}, then subtract ${Z}.` },
        `Add ${X} + ${Y}, then subtract ${Z}`,
        [`Add ${X} + ${Y} + ${Z}`, `Subtract ${Y} from ${X}, then add ${Z}`]
      ),
      amountStep({ prompt: `Step 1: ${X} + ${Y} = ?`, hint: "Regroup if the pieces make a whole.", explain: `${X} + ${Y} = ${mixedText(x + y, d)}.` }, x + y, d, unitFor(x + y, d, c)),
      amountStep(
        { prompt: `Step 2: ${mixedText(x + y, d)} − ${Z} = ?`, hint: "Unbundle a whole if you need more pieces.", explain: `${mixedText(x + y, d)} − ${Z} = ${mixedText(x + y - z, d)}.` },
        x + y - z,
        d,
        unitFor(x + y - z, d, c)
      ),
    ],
    wrapUp: `There are ${amountWords(x + y - z, d, c)} of ${c.item} now.`,
  };
}

function sameWholeProblem(): Problem {
  const { c, d, a, smallName, largeName } = sameWholeParams();
  const b = 1 + Math.floor(Math.random() * (d - 1));
  return {
    title: "Same whole?",
    bucket: "sameWhole",
    story: `${smallName} ${c.verb} ${a}/${d} of a ${c.small}. ${largeName} ${c.verb} ${a}/${d} of a ${c.large}. ${smallName} says, "Together we ${c.verb} ${2 * a}/${d} of a ${c.thing}."`,
    visual: () => <TwoWholes a={a} d={d} small={c.small} large={c.large} />,
    steps: [
      choice(
        { prompt: `Is ${smallName} right?`, hint: "Compare the size of one piece in each picture.", explain: "No — the wholes are different sizes, so the pieces aren't the same size and can't just be counted together." },
        "No — the wholes are different sizes, so the pieces aren't the same size",
        [`Yes — same denominator, so add the numerators`, `No — they should add the denominators too: ${2 * a}/${2 * d}`]
      ),
      choice(
        { prompt: `Who ${c.verb} more?`, hint: "Same fraction — of which whole?", explain: `${a}/${d} of a bigger whole is more, so ${largeName}.` },
        largeName,
        [smallName, `Same amount — both ${c.verb} ${a}/${d}`]
      ),
      amountStep(
        {
          prompt: `Now suppose both pieces came from the SAME ${c.large}: ${a}/${d} + ${b}/${d} = ?`,
          hint: "Same whole, same-size pieces — now you can add.",
          explain: `${a} + ${b} = ${a + b}, so ${mixedText(a + b, d)} of the ${c.large}.`,
        },
        a + b,
        d
      ),
    ],
    wrapUp: `Fractions can be added only when they're parts of the same whole.`,
  };
}

function Preview() {
  return <PieceBars den={4} barWidth={120} height={40} segments={[{ count: 5, tone: "a" }, { count: 3, tone: "gone" }]} />;
}

const BUCKETS = ["combine", "compare", "multiStep", "sameWhole"];

export const fractionWordProblems: Unit = {
  id: "fractionWordProblems",
  title: "Fraction Word Problems: Add and Subtract",
  goal: "Read a story, decide whether to add or subtract, and solve it with fractions or mixed numbers that share a denominator.",
  standard: "4.NF.3d",
  keyIdea: (
    <>
      <p>"In all" → add. "Left", "how much more", "how much longer" → subtract. Two things happen? Do two steps.</p>
      <p>You can only add or subtract fractions of the SAME whole — 1/2 of a small pizza and 1/2 of a large pizza are not the same amount.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: BUCKETS,
  problems: [
    { label: "Put together", make: combineProblem, buckets: ["combine"] },
    { label: "Left / more", make: compareProblem, buckets: ["compare"] },
    { label: "Two steps", make: multiStepProblem, buckets: ["multiStep"] },
    { label: "Same whole?", make: sameWholeProblem, buckets: ["sameWhole"] },
  ],
  test: fractionWordProblemsTest,
};
