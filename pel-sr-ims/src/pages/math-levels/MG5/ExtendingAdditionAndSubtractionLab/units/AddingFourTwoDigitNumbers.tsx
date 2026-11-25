import { useEffect, useState } from "react";
import { PlaceValueColumns } from "../diagrams";
import { buildAddColumns, regroupCount, type ColumnBreakdown } from "../logic";
import { randInt } from "../../../shared/lib/math";
import type { Problem } from "../../../shared/engine/types";
import { Stepper, Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { addingFourTwoDigitNumbersTest } from "./AddingFourTwoDigitNumbersTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { StuckBox, useCfuPointers, type ExploreTarget } from "../../../shared/components/CfuPointers";
import { lookHereSpot } from "../../../shared/lib/lookHere";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions. Target (per the approved plan): the real
// misconception that when stacking MORE than two numbers, each column can
// still only ever carry a single extra "1" — so a ones-column sum like 27
// (carry 2) gets silently mishandled as if it were a normal single-digit carry.

// Where in Explore each CFU idea is taught (2nd wrong Check → "Look here first").
const LOOK = {
  carry: { target: "f2d-carry", label: "Explore — write one digit, carry the tens" },
  more: { target: "f2d-more", label: "Explore — when the carry can be more than 1" },
} satisfies Record<string, ExploreTarget>;

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function DigitVsCarryQuestion({ onComplete }: { onComplete?: () => void }) {
  const [digit, setDigit] = useState("");
  const [carry, setCarry] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [digit, carry].every((v) => String(v).trim() !== "");
  const ok = digit === "7" && carry === "2";
  const ptr = useCfuPointers([{ key: "q", to: LOOK.carry }], { done: checked && ok, rightNow: () => checked && ok });
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>1.</b> The ones column of 8 + 9 + 4 + 6 adds up to 27. What digit do you write below the line, and what do you carry to the tens column?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <span>Write:</span>
        <select className="answer" value={digit} onChange={(e) => setDigit(e.target.value)} style={fieldOk(digit === "7", checked)}>
          <option value="" disabled>
            ?
          </option>
          <option value="27">27</option>
          <option value="7">7</option>
          <option value="2">2</option>
        </select>
        <span>Carry:</span>
        <select className="answer" value={carry} onChange={(e) => setCarry(e.target.value)} style={fieldOk(carry === "2", checked)}>
          <option value="" disabled>
            ?
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="7">7</option>
        </select>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => { ptr.record(() => ok, `${digit}|${carry}`); setChecked(true); }}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 27 means you write the 7 and carry the 2 (two whole tens) into the tens column."
            : "Not quite. 27 is how many tens and how many ones? Only one digit fits below the line."}
        </ReadAloud>
      )}
      <StuckBox {...ptr} />
    </ReadAloud>
  );
}

function CarryAlwaysOneTrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  const ptr = useCfuPointers([{ key: "q", to: LOOK.more }], { done: checked && ok, rightNow: () => checked && ok });
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>2.</b> True or false: when adding two-digit numbers, the carry into the next column can never be more than 1.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => { ptr.record(() => ok, picked); setChecked(true); }}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — false. That's true when you only add TWO numbers (max carry is 1), but adding three or four numbers can push a column's sum past 20, 30, even higher — carrying 2 or 3."
            : "Not quite. Add 9 + 9 + 9 in one column. How many tens is that?"}
        </ReadAloud>
      )}
      <StuckBox {...ptr} />
    </ReadAloud>
  );
}

function WhyItMattersQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "wrong";
  const ptr = useCfuPointers([{ key: "q", to: LOOK.carry }], { done: checked && ok, rightNow: () => checked && ok });
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>3.</b> Adding 48 + 37 + 26, the ones column is 8 + 7 + 6 = 21. A student writes 1 below the line and carries only 1 (instead of carrying 2) into the tens column. Does their final answer come out right or wrong?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="right">Right — the digit below the line is correct, so it still works out</option>
          <option value="wrong">Wrong — carrying only 1 loses one of the tens, so the total comes out 10 too small</option>
        </select>
        <button className="btn primary" type="button" onClick={() => { ptr.record(() => ok, picked); setChecked(true); }}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 48 + 37 + 26 = 111, but carrying only 1 instead of 2 gives 101, which is 10 too small. The digit you write down can be right while the carry is still wrong."
            : "Not quite. 21 is 2 tens and 1 one. If only 1 ten is carried, where did the other ten go?"}
        </ReadAloud>
      )}
      <StuckBox {...ptr} />
    </ReadAloud>
  );
}

function WhichDigitToWriteQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "3";
  const ptr = useCfuPointers([{ key: "q", to: LOOK.carry }], { done: checked && ok, rightNow: () => checked && ok });
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>4.</b> If a column's digits add up to 23, which single digit goes below the line in THAT column?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="23">23</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button className="btn primary" type="button" onClick={() => { ptr.record(() => ok, picked); setChecked(true); }}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — only the 3 (the ones digit of 23) goes below the line in this column; the 2 is what carries to the NEXT column." : "Not quite. 23 is 2 tens and 3 ones. Which part stays in this column, and which part moves on?"}
        </ReadAloud>
      )}
      <StuckBox {...ptr} />
    </ReadAloud>
  );
}

function FourAddendsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ digitCarry: false, trueFalse: false, whyMatters: false, whichDigit: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill">
      <ReadAloud as="p" className="intro-gate-title">Check for understanding: let's make sure these ideas are clear before you try practice problems.</ReadAloud>
      <DigitVsCarryQuestion onComplete={mark("digitCarry")} />
      <CarryAlwaysOneTrueFalseQuestion onComplete={mark("trueFalse")} />
      <WhyItMattersQuestion onComplete={mark("whyMatters")} />
      <WhichDigitToWriteQuestion onComplete={mark("whichDigit")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [count, setCount] = useState<2 | 3 | 4>(3);
  // Defaults differ from the CFU numbers (8 + 9 + 4 + 6, 48 + 37 + 26). 3 addends: ones add to 22.
  const [vals, setVals] = useState([56, 29, 47, 38]);

  const addends = vals.slice(0, count);
  const breakdown: ColumnBreakdown = buildAddColumns(addends, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented label="How many addends" value={String(count)} onChange={(v) => setCount(Number(v) as 2 | 3 | 4)} options={[{ id: "2", label: "2" }, { id: "3", label: "3" }, { id: "4", label: "4" }]} />
        {!introActive && (
          <button type="button" className="btn ghost" style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined} onClick={() => setShowCheck((v) => !v)}>
            Check for Understanding
          </button>
        )}
      </div>

      <div className="control-row" data-readaloud-part>
        {addends.map((v, i) => (
          <Stepper key={i} label={`Addend ${i + 1}`} value={v} min={10} max={99} step={1} onChange={(nv) => setVals((all) => all.map((x, k) => (k === i ? nv : x)))} tone={i === 0 ? "a" : i === 1 ? "b" : "c"} />
        ))}
      </div>
      <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />
      <ReadAloud as="p" {...lookHereSpot("f2d-carry")}>
        <span data-look-here-key>A column sum like 34 is 3 tens and 4 ones. Write only the ones digit below the line. Carry ALL the tens to the next column.</span>
      </ReadAloud>
      <ReadAloud as="p" {...lookHereSpot("f2d-more")}>
        <span data-look-here-key>With 2 numbers, a column adds to 18 or less, so the carry is never more than 1. With 3 or 4 numbers, a column can add to 20 or more, so the carry can be 2 or 3.</span>
      </ReadAloud>
      <ReadAloud as="p" className="muted small">
        Ones column: {breakdown.digitsByOperand.map((d) => d[0]).join(" + ")} = {breakdown.digitsByOperand.reduce((s, d) => s + d[0], 0)} → write {breakdown.resultDigits[0]}, carry {breakdown.carry[0]}.{" "}
        {breakdown.carry[0] > 1 ? "Notice the carry here is MORE than 1 — that only happens with three or four addends." : "With just two addends, the carry here can never be more than 1."}
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <FourAddendsCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "twoAddendsNoRegroup" | "twoAddendsOneRegroup" | "threeOrFourAddendsSingleCarry" | "threeOrFourAddendsDoubleCarry";
const BUCKETS: Bucket[] = ["twoAddendsNoRegroup", "twoAddendsOneRegroup", "threeOrFourAddendsSingleCarry", "threeOrFourAddendsDoubleCarry"];

function makeProblem(addends: number[], bucket: Bucket): Problem {
  const breakdown = buildAddColumns(addends, 3);
  const label = addends.length === 2 ? "Two addends" : `${addends.length} addends`;
  return {
    title: `Adding ${label}`,
    bucket,
    story: `Add: ${addends.join(" + ")}`,
    visual: (done) => <PlaceValueColumns breakdown={breakdown} revealCols={done} />,
    steps: [
      {
        kind: "ratio",
        prompt: `Add the ones column: ${breakdown.digitsByOperand.map((d) => d[0]).join(" + ")} = ${breakdown.digitsByOperand.reduce((s, d) => s + d[0], 0)}. What digit do you write, and what do you carry to the tens column?`,
        hint: "The digit you write is the ones digit of that sum; the carry is everything else (it could be more than 1!).",
        explain: `Write ${breakdown.resultDigits[0]}, carry ${breakdown.carry[0]}.`,
        answer: [breakdown.resultDigits[0], breakdown.carry[0]],
        labels: ["ones digit", "carry to tens"],
        tones: "none",
      },
      {
        kind: "ratio",
        prompt: `Now the tens column (plus the carry): ${breakdown.digitsByOperand.map((d) => d[1]).join(" + ")}${breakdown.carry[0] > 0 ? ` + ${breakdown.carry[0]} carried` : ""} = ${breakdown.digitsByOperand.reduce((s, d) => s + d[1], 0) + breakdown.carry[0]}. What digit do you write, and what do you carry to the hundreds column?`,
        hint: "Don't forget to add in whatever you carried from the ones column.",
        explain: `Write ${breakdown.resultDigits[1]}, carry ${breakdown.carry[1]}.`,
        answer: [breakdown.resultDigits[1], breakdown.carry[1]],
        labels: ["tens digit", "carry to hundreds"],
        tones: "none",
      },
      { kind: "number", prompt: `What is the total, ${addends.join(" + ")}?`, hint: "Put the digits you found together.", explain: `${addends.join(" + ")} = ${breakdown.total}.`, answer: breakdown.total },
    ],
    wrapUp: `${addends.join(" + ")} = ${breakdown.total}.`,
  };
}

function twoAddendsNoRegroupProblem(): Problem {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(10, 89);
    b = randInt(10, 89);
    breakdown = buildAddColumns([a, b], 3);
  } while (breakdown.carry[0] !== 0 || breakdown.carry[1] !== 0);
  return makeProblem([a, b], "twoAddendsNoRegroup");
}

function twoAddendsOneRegroupProblem(): Problem {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(10, 99);
    b = randInt(10, 99);
    breakdown = buildAddColumns([a, b], 3);
  } while (regroupCount(breakdown) !== 1);
  return makeProblem([a, b], "twoAddendsOneRegroup");
}

function threeOrFourAddendsSingleCarryProblem(): Problem {
  const n = randInt(0, 1) === 0 ? 3 : 4;
  let addends: number[] = [];
  let breakdown: ColumnBreakdown;
  do {
    addends = Array.from({ length: n }, () => randInt(10, 89));
    breakdown = buildAddColumns(addends, 3);
  } while (breakdown.carry[0] > 1);
  return makeProblem(addends, "threeOrFourAddendsSingleCarry");
}

function threeOrFourAddendsDoubleCarryProblem(): Problem {
  const n = randInt(0, 1) === 0 ? 3 : 4;
  let addends: number[] = [];
  let breakdown: ColumnBreakdown;
  do {
    addends = Array.from({ length: n }, () => randInt(10, 99));
    breakdown = buildAddColumns(addends, 3);
  } while (breakdown.carry[0] < 2);
  return makeProblem(addends, "threeOrFourAddendsDoubleCarry");
}

function addFourProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "twoAddendsNoRegroup") return twoAddendsNoRegroupProblem();
  if (bucket === "twoAddendsOneRegroup") return twoAddendsOneRegroupProblem();
  if (bucket === "threeOrFourAddendsSingleCarry") return threeOrFourAddendsSingleCarryProblem();
  return threeOrFourAddendsDoubleCarryProblem();
}

export const addingFourTwoDigitNumbers: Unit = {
  id: "addingFourTwoDigitNumbers",
  title: "Adding Up to Four Two-Digit Numbers",
  goal: "Add three or four two-digit numbers together, carrying correctly even when the ones column adds up past 20.",
  standard: "2.NBT.6",
  keyIdea: (
    <>
      <p>Stack the numbers and add one column at a time, just like with two addends — the only new part is that a column's sum can carry MORE than 1 when you're adding three or four numbers.</p>
      <p>A column sum of 27 means: write 7, carry 2 — not just 1.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Adding Several Numbers", make: addFourProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: addingFourTwoDigitNumbersTest,
};
