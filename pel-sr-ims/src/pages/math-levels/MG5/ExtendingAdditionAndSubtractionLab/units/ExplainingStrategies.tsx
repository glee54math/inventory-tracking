import { useEffect, useState } from "react";
import { BaseTenBlocks, PlaceValueColumns } from "../diagrams";
import { buildAddColumns, type ColumnBreakdown } from "../logic";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { explainingStrategiesTest } from "./ExplainingStrategiesTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// This whole unit IS the comprehension check in spirit (per the plan), but it
// still gets a fixed, hand-picked gate. Target: over-generalizing a shortcut
// that happens to work on easy (no-regroup) cases to EVERY case, without
// understanding why it stops working once regrouping is required.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function RegroupValueQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "same";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> You trade 10 ones for 1 ten. Does the NUMBER'S VALUE change, stay the same, or does it depend on the number?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="bigger">It gets bigger</option>
          <option value="smaller">It gets smaller</option>
          <option value="same">It stays exactly the same</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 10 ones and 1 ten are two different ways of writing the SAME amount, so trading between them never changes the value." : "Not quite — 10 ones IS 1 ten. Trading between them is just a different way of grouping the same amount; the value never changes."}
        </p>
      )}
    </div>
  );
}

function ShortcutStillWorksQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "no";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> A shortcut adds the ones column and the tens column separately, writing each sum straight down, no carrying. It works fine for 34 + 22 (no regrouping needed). Does the SAME shortcut, used unchanged, work for 37 + 28 (where the ones column regroups)?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="yes">Yes — it always works the same way</option>
          <option value="no">No — once a column regroups, you have to carry, which this shortcut skips</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 37 + 28: ones column 7+8=15, tens column 3+2=5. Writing both straight down gives \"515\", but the real answer is 65. The shortcut needs an extra carrying step once a column regroups." : "Not quite — try it: 37 + 28's ones column is 7+8=15 (two digits!) and tens column is 3+2=5. Writing both straight down gives the wrong answer \"515\" instead of the real 65 — carrying is required once a column regroups."}
        </p>
      )}
    </div>
  );
}

function WorksOnFewExamplesTrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: if a method gives the right answer on a few easy examples, it will always give the right answer on every example.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — false. A method that happens to work on easy, no-regroup examples can quietly break once a harder case (like regrouping) shows up. You have to check the method against the HARD cases, not just the easy ones." : "Not quite — false is right. Working on a few easy examples doesn't prove a method always works — you have to test it against the harder cases too, like ones that need regrouping."}
        </p>
      )}
    </div>
  );
}

function CritiqueExampleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [what, setWhat] = useState("");
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = what === "carry" && answer === "85";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> For 48 + 37, a student adds columns separately with no carrying: ones 8+7=15, tens 4+3=7, and writes "715." What went wrong, and what's the real answer?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={what} onChange={(e) => setWhat(e.target.value)} style={fieldOk(what === "carry", checked)}>
          <option value="" disabled>
            what went wrong?
          </option>
          <option value="carry">Didn't carry the extra ten from the ones column into the tens column</option>
          <option value="addedWrong">Added the wrong digits together</option>
        </select>
        <select className="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} style={fieldOk(answer === "85", checked)}>
          <option value="" disabled>
            real answer?
          </option>
          <option value="715">715</option>
          <option value="75">75</option>
          <option value="85">85</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 8+7=15 means write 5, carry 1. Then 4+3+1=8. The real answer is 85, not 715." : "Not quite — the ones column (8+7=15) needed to carry its extra ten into the tens column. 4+3+1(carried)=8, so the real answer is 85."}
        </p>
      )}
    </div>
  );
}

function ExplainingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ value: false, shortcut: false, trueFalse: false, critique: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure these ideas are clear before you try practice problems.</p>
      <RegroupValueQuestion onComplete={mark("value")} />
      <ShortcutStillWorksQuestion onComplete={mark("shortcut")} />
      <WorksOnFewExamplesTrueFalseQuestion onComplete={mark("trueFalse")} />
      <CritiqueExampleQuestion onComplete={mark("critique")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"trade" | "columns">("trade");
  const [tens, setTens] = useState(2);
  const [traded, setTraded] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented label="Idea" value={mode} onChange={setMode} options={[{ id: "trade", label: "Trading is equal value" }, { id: "columns", label: "Why columns work" }]} />
        {!introActive && (
          <button type="button" className="btn ghost" style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined} onClick={() => setShowCheck((v) => !v)}>
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <ExplainingCheckForUnderstanding onComplete={onIntroDone} />}

      {mode === "trade" ? (
        <>
          <div className="control-row">
            <label>
              Tens to trade: <input type="range" min={1} max={9} value={tens} onChange={(e) => setTens(Number(e.target.value))} /> {tens}
            </label>
            <button className="btn ghost" onClick={() => setTraded((t) => !t)}>
              {traded ? "Trade back" : "Trade 10 tens for 1 hundred"}
            </button>
          </div>
          {traded && tens >= 10 ? <BaseTenBlocks hundreds={1} tens={0} ones={0} /> : <BaseTenBlocks hundreds={0} tens={tens} ones={0} />}
          <p className="muted small">
            {tens} tens is worth {tens * 10}. {traded && tens >= 10 ? "Traded for 1 hundred — still worth the same amount." : tens >= 10 ? "You can trade this for 1 hundred without changing the value." : "Need 10 tens before you can trade for a hundred."}
          </p>
        </>
      ) : (
        <>
          <PlaceValueColumns breakdown={buildAddColumns([34, 22], 3)} revealCols={3} />
          <p className="muted small">34 + 22: each column's digits add to less than 10, so you can add ones-to-ones and tens-to-tens separately with no carrying — that's WHY the column method works here.</p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================
// Decision (flagged as a genuine design judgment call in the plan): Practice
// follows the lab's standard compute-then-justify 2-3-step shape rather than
// leaning only on the CFU gate, so students still get repeatable practice
// reps on the reasoning itself (which explanation is correct), not just a
// one-time gate — see the build's final report for the full reasoning.

type Bucket = "regroupPreservesValue" | "columnAdditionNoRegroupJustify" | "commutativeRealContext" | "critiqueFlawedStrategy";
const BUCKETS: Bucket[] = ["regroupPreservesValue", "columnAdditionNoRegroupJustify", "commutativeRealContext", "critiqueFlawedStrategy"];

function regroupPreservesValueProblem(): Problem {
  const tens = randInt(1, 9);
  const value = tens * 10;
  return {
    title: "Does trading change the value?",
    bucket: "regroupPreservesValue",
    story: `You have ${tens} tens. What are they worth before and after trading for hundreds (where possible)?`,
    visual: () => <BaseTenBlocks hundreds={0} tens={tens} ones={0} />,
    steps: [
      { kind: "number", prompt: `What is ${tens} tens worth, before any trading?`, hint: "Each ten is worth 10.", explain: `${tens} tens = ${value}.`, answer: value },
      choice(
        { prompt: "If you traded 10 of those tens for 1 hundred (when you have enough), would the total value change?", hint: "10 tens and 1 hundred are the same amount, just grouped differently.", explain: "No — trading never changes the value, only how it's grouped." },
        "No, the value stays exactly the same",
        ["Yes, it gets bigger", "Yes, it gets smaller"]
      ),
    ],
    wrapUp: `${tens} tens = ${value}, and trading never changes that value.`,
  };
}

function columnAdditionNoRegroupJustifyProblem(): Problem {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(10, 79);
    b = randInt(10, 19);
    breakdown = buildAddColumns([a, b], 2);
  } while (breakdown.carry[0] !== 0);
  return {
    title: "Why columns work (no regrouping)",
    bucket: "columnAdditionNoRegroupJustify",
    story: `${a} + ${b}: add the ones and tens columns separately.`,
    visual: () => <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
    steps: [
      { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "Add each column separately.", explain: `${a} + ${b} = ${breakdown.total}.`, answer: breakdown.total },
      choice(
        { prompt: "Why is it safe to add the ones and tens columns completely separately here?", hint: "Check whether either column's sum is 10 or more.", explain: "Neither column's digits add up to 10 or more, so there's nothing to carry — the columns truly are independent here." },
        "Neither column's digit-sum reaches 10, so there's no carrying to worry about",
        ["Because 2-digit numbers always work this way, no matter what", "Because addition is commutative"]
      ),
    ],
    wrapUp: `${a} + ${b} = ${breakdown.total}, safely column-by-column since neither column needed to carry.`,
  };
}

function commutativeRealContextProblem(): Problem {
  const a = randInt(3, 9);
  const b = randInt(3, 9);
  const items = ["red marbles", "blue marbles"];
  return {
    title: "Does the order matter?",
    bucket: "commutativeRealContext",
    story: `A jar has ${a} ${items[0]} and ${b} ${items[1]}. How many marbles in total?`,
    visual: () => <BaseTenBlocks hundreds={0} tens={0} ones={Math.min(9, a)} />,
    steps: [
      { kind: "number", prompt: `${a} + ${b} = ?`, hint: "Add the two groups.", explain: `${a} + ${b} = ${a + b}.`, answer: a + b },
      { kind: "number", prompt: `Now count it the other way: ${b} + ${a} = ?`, hint: "Same two groups, opposite order.", explain: `${b} + ${a} = ${a + b}.`, answer: a + b },
      choice(
        { prompt: "Why do both orders give the same total?", hint: "You still have the exact same marbles either way.", explain: "The jar has the same marbles no matter which group you count first — order never changes a total." },
        "The total only depends on how many marbles there are, not which group you count first",
        ["It's a coincidence that only works for marbles", "It only works because both numbers happen to be small"]
      ),
    ],
    wrapUp: `${a} + ${b} = ${b} + ${a} = ${a + b} — order doesn't change the total.`,
  };
}

function critiqueFlawedStrategyProblem(): Problem {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(10, 79);
    b = randInt(10, 79);
    breakdown = buildAddColumns([a, b], 2);
  } while (breakdown.carry[0] === 0);
  const onesSum = breakdown.digitsByOperand[0][0] + breakdown.digitsByOperand[1][0];
  const tensSum = breakdown.digitsByOperand[0][1] + breakdown.digitsByOperand[1][1];
  // Writing the two column sums side by side with no carrying — e.g. ones
  // column 15, tens column 7, written straight down as "715" — is literally
  // tensSum*100 + onesSum (onesSum is always 2 digits here, since the loop
  // below only accepts a/b pairs whose ones columns actually need to carry).
  const flawedAnswer = tensSum * 100 + onesSum;
  return {
    title: "Spot the flawed strategy",
    bucket: "critiqueFlawedStrategy",
    story: `For ${a} + ${b}, a student adds each column separately with NO carrying (ones: ${breakdown.digitsByOperand[0][0]}+${breakdown.digitsByOperand[1][0]}=${onesSum}, tens: ${breakdown.digitsByOperand[0][1]}+${breakdown.digitsByOperand[1][1]}) and writes "${flawedAnswer}."`,
    visual: () => <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
    steps: [
      choice(
        { prompt: "Where does this strategy break down?", hint: "Look at the ones column's sum.", explain: `The ones column (${onesSum}) is 10 or more, so it needed to carry into the tens column — this strategy skipped that.` },
        "The ones column adds up to 10 or more, and this method never carries",
        ["The student added the wrong digits", "Nothing is wrong — the answer is correct"]
      ),
      { kind: "number", prompt: `What is the correct answer to ${a} + ${b}?`, hint: "Carry the extra ten from the ones column into the tens column.", explain: `${a} + ${b} = ${breakdown.total}.`, answer: breakdown.total },
    ],
    wrapUp: `${a} + ${b} = ${breakdown.total}, not ${flawedAnswer} — the no-carry shortcut breaks once a column regroups.`,
  };
}

function explainProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "regroupPreservesValue") return regroupPreservesValueProblem();
  if (bucket === "columnAdditionNoRegroupJustify") return columnAdditionNoRegroupJustifyProblem();
  if (bucket === "commutativeRealContext") return commutativeRealContextProblem();
  return critiqueFlawedStrategyProblem();
}

export const explainingStrategies: Unit = {
  id: "explainingStrategies",
  title: "Explaining Why the Strategies Work",
  goal: "Explain, using place value, why an addition or subtraction strategy gives the right answer — not just that it does.",
  standard: "2.NBT.9",
  keyIdea: (
    <>
      <p>Trading 10 ones for 1 ten (or 10 tens for 1 hundred) never changes a number's value — it's the same amount, grouped differently.</p>
      <p>A shortcut that works on easy, no-regroup examples can quietly break once a harder case shows up — always check a method against the hard cases too.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Explain the Strategy", make: explainProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: explainingStrategiesTest,
};
