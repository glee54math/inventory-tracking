import { useEffect, useState } from "react";
import { TilingGrid } from "../diagrams/TilingGrid";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { areaMultiplyingSideLengthsTest } from "./AreaMultiplyingSideLengthsTest";
import { answerBorder } from "../../../shared/lib/answerChecks";

const RUG_ITEMS = ["rug", "tile floor", "garden bed", "bulletin board", "poster"] as const;

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1 — which operation finds area at all: multiply, not add. */
function MultiplyNotAddQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const CORRECT = "Multiply the length and width";
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> A rectangle has a length of 6 and a width of 4. Which operation finds its AREA?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)}>
          <option value="" disabled>
            choose
          </option>
          <option value={CORRECT}>{CORRECT}</option>
          <option value="Add the length and width">Add the length and width</option>
          <option value="Add all four sides">Add all four sides</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — area comes from multiplying the two side lengths: 6 × 4 = 24." : "Not quite — adding the sides gives the PERIMETER (the distance around), not the area."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the plan's mandatory "which operation, and why" question: same two
 *  numbers, explicitly choosing between area's multiply and perimeter's
 *  add — not just computing an answer. */
function WhichOperationAndWhyQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const CORRECT = "Multiply — area is about covering the inside with rows of unit squares";
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> A rug is 5 feet long and 3 feet wide. To find how much FLOOR SPACE it covers (its area), which is correct — and why?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={{ minWidth: 340 }}>
          <option value="" disabled>
            choose
          </option>
          <option value={CORRECT}>{CORRECT}</option>
          <option value="Add — area is the total distance around the outside">Add — area is the total distance around the outside</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — area is made of rows of unit squares stacked up (5 rows of 3, or 3 rows of 5): 5 × 3 = 15 square feet of floor space."
            : "Not quite — \"distance around the outside\" describes PERIMETER. Area is about covering the inside, which is why you multiply the two side lengths."}
        </p>
      )}
    </div>
  );
}

/** Q3 — division as the inverse of multiplication, framed as a choice
 *  BEFORE a number, so the student commits to "divide," not guess-and-check. */
function InverseOperationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [opPicked, setOpPicked] = useState("");
  const [valueGuess, setValueGuess] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [opPicked, valueGuess].every((v) => String(v).trim() !== "");
  const okOp = opPicked === "divide";
  const okValue = Number(valueGuess) === 4;
  const ok = okOp && okValue;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> A rectangle has an area of 24 square units and one side is 6 units long. What operation undoes multiplication to find the other side — and what is it?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" style={answerBorder(okOp, checked)} value={opPicked} onChange={(e) => setOpPicked(e.target.value)}>
          <option value="" disabled>
            choose
          </option>
          <option value="divide">Divide</option>
          <option value="subtract">Subtract</option>
        </select>
        <label>
          Other side ={" "}
          <input className="answer" style={{ width: 55, ...answerBorder(okValue, checked) }} inputMode="numeric" autoComplete="off" value={valueGuess} onChange={(e) => setValueGuess(e.target.value)} />
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — division undoes multiplication: 24 ÷ 6 = 4, the other side."
            : "Not yet — think \"6 times what equals 24?\" Division is the operation that undoes multiplication, and 24 ÷ 6 = 4."}
        </p>
      )}
    </div>
  );
}

function CheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ multiplyNotAdd: false, whichAndWhy: false, inverse: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill" style={{ display: "grid", gap: 18 }}>
      <p className="intro-gate-title">Check for understanding: multiply for area, not add — and division undoes it.</p>
      <MultiplyNotAddQuestion onComplete={mark("multiplyNotAdd")} />
      <WhichOperationAndWhyQuestion onComplete={mark("whichAndWhy")} />
      <InverseOperationQuestion onComplete={mark("inverse")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

/**
 * Gated memorization drill (reintroEverySolved — see unit export below): a
 * fixed worked example first (concrete, IES rec. #1), then the student sets
 * their OWN length/width and both multiplies AND verifies by tiling, tying
 * the Unit 2 shortcut directly back to Unit 1's counting before it's
 * trusted on its own.
 */
function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [length, setLength] = useState(5);
  const [width, setWidth] = useState(3);
  const [guess, setGuess] = useState("");
  const [checked, setChecked] = useState(false);
  const area = length * width;
  const ok = Number(guess) === area;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p>
        A rectangle's area is its length times its width. For a rug 3 feet long and 5 feet wide: 3 rows of 5 unit squares each = 3 × 5 = 15 square feet — the exact same count you'd get tiling it square by square.
      </p>
      <TilingGrid rows={3} cols={5} mode="full" dimLabels caption="3 × 5 = 15" />
      <div className="control-row">
        <Stepper label="length" value={length} min={2} max={9} onChange={(v) => { setLength(v); setChecked(false); setGuess(""); }} tone="a" />
        <Stepper label="width" value={width} min={2} max={9} onChange={(v) => { setWidth(v); setChecked(false); setGuess(""); }} tone="b" />
        {!introActive && (
          <button type="button" className={`btn ghost ${showCheck ? "pressed" : ""}`} onClick={() => setShowCheck((v) => !v)}>
            Check for Understanding
          </button>
        )}
      </div>
      <TilingGrid rows={length} cols={width} mode="full" dimLabels />
      {introActive && (
        <div className="align-drill">
          <p className="intro-gate-title">
            Now you try: this rectangle is {length} by {width}. What's its area?
          </p>
          <div className="control-row" style={{ alignItems: "center" }}>
            <input className="answer" style={{ width: 55 }} inputMode="numeric" autoComplete="off" value={guess} onChange={(e) => setGuess(e.target.value)} />
            <button className="btn primary" onClick={() => setChecked(true)}>
              Check my work
            </button>
          </div>
          {checked && (
            <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
              {ok ? `Exactly — ${length} × ${width} = ${area}, and that matches tiling it one square at a time.` : `Not quite — multiply the length by the width: ${length} × ${width} = ?`}
            </p>
          )}
          {checked && ok && onIntroDone && (
            <button className="btn primary" onClick={onIntroDone}>
              Continue
            </button>
          )}
        </div>
      )}
      {!introActive && (
        <p className="muted small">
          {length} × {width} = {area} square units — multiplying gives the exact same count as tiling every square.
        </p>
      )}
      {(introActive || showCheck) && <CheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — area by multiplying side lengths
// ============================================================================

type Bucket = "directMultiply" | "missingSide" | "wordProblem" | "verifyTiling";
const BUCKETS: Bucket[] = ["directMultiply", "missingSide", "wordProblem", "verifyTiling"];

function areaMultiplyProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "directMultiply") {
    const length = randInt(3, 9);
    const width = randInt(3, 9);
    const area = length * width;
    return {
      title: "Area by multiplying",
      bucket,
      story: `A rectangle has a length of ${length} units and a width of ${width} units.`,
      visual: () => <TilingGrid rows={length} cols={width} mode="full" dimLabels />,
      steps: [
        {
          kind: "number",
          prompt: "What is its area?",
          hint: `Multiply the length by the width: ${length} × ${width} = ?`,
          explain: `${length} × ${width} = ${area} square units.`,
          answer: area,
        },
      ],
      wrapUp: `${length} × ${width} = ${area} square units.`,
    };
  }

  if (bucket === "missingSide") {
    const known = randInt(3, 9);
    const other = randInt(3, 9);
    const area = known * other;
    return {
      title: "Finding a missing side",
      bucket,
      story: `A rectangle has an area of ${area} square units. One side is ${known} units long.`,
      visual: () => <TilingGrid rows={known} cols={other} mode="edges-only" dimLabels />,
      steps: [
        {
          kind: "number",
          prompt: "What is the length of the other side?",
          hint: `Think: ${known} × what = ${area}? Division undoes multiplication: ${area} ÷ ${known} = ?`,
          explain: `${area} ÷ ${known} = ${other}, since ${known} × ${other} = ${area}.`,
          answer: other,
        },
      ],
      wrapUp: `The other side is ${other} units long.`,
    };
  }

  if (bucket === "wordProblem") {
    const item = pick(RUG_ITEMS);
    const length = randInt(4, 10);
    const width = randInt(3, 8);
    const area = length * width;
    return {
      title: "A real-world area problem",
      bucket,
      story: `A ${item} is ${length} feet long and ${width} feet wide.`,
      visual: () => <TilingGrid rows={length} cols={width} mode="edges-only" dimLabels />,
      steps: [
        choice(
          {
            prompt: `How much floor space does the ${item} cover — what operation do you need?`,
            hint: "You're covering a surface, not walking around its edge.",
            explain: "Covering a surface is an area question, so you multiply the two side lengths.",
          },
          "Multiply the length and width",
          ["Add the length and width", "Add all four sides"]
        ),
        {
          kind: "number",
          prompt: `How many square feet does the ${item} cover?`,
          hint: `${length} × ${width} = ?`,
          explain: `${length} × ${width} = ${area} square feet.`,
          answer: area,
        },
      ],
      wrapUp: `The ${item} covers ${area} square feet.`,
    };
  }

  // verifyTiling — bridges Unit 1's counting directly to Unit 2's shortcut
  const rows = randInt(3, 7);
  const cols = randInt(3, 7);
  const correctProduct = rows * cols;
  const wrongProduct = correctProduct + pick([-1, 1, -2, 2].filter((d) => correctProduct + d > 0));
  const claimedIsRight = Math.random() < 0.5;
  const claimed = claimedIsRight ? correctProduct : wrongProduct;
  return {
    title: "Verify by tiling",
    bucket,
    story: `A classmate says this ${rows} × ${cols} rectangle has an area of ${claimed} square units.`,
    visual: (done: number) => <TilingGrid rows={rows} cols={cols} mode="full" dimLabels revealRows={done >= 1 ? rows : 1} />,
    steps: [
      {
        kind: "number",
        prompt: "First, count (or tile) to find the actual area yourself.",
        hint: `${rows} rows of ${cols} squares each.`,
        explain: `Tiling it row by row gives ${rows} × ${cols} = ${correctProduct} unit squares.`,
        answer: correctProduct,
      },
      choice(
        {
          prompt: `Is your classmate's claim of ${claimed} square units correct?`,
          hint: "Compare it to the count you just found.",
          explain: claimedIsRight ? `Yes — ${claimed} matches ${rows} × ${cols} = ${correctProduct}.` : `No — ${rows} × ${cols} = ${correctProduct}, not ${claimed}.`,
        },
        claimedIsRight ? "Yes, that's correct" : "No, that's not correct",
        [claimedIsRight ? "No, that's not correct" : "Yes, that's correct"]
      ),
    ],
    wrapUp: `${rows} × ${cols} = ${correctProduct} square units — multiplying and tiling always agree.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <TilingGrid rows={3} cols={5} mode="full" dimLabels caption="3 × 5 = 15" />;
}

export const areaMultiplyingSideLengths: Unit = {
  id: "areaMultiplyingSideLengths",
  title: "Area = Multiplying Side Lengths",
  goal: "Find a rectangle's area by multiplying its side lengths instead of counting every square, and use that to solve real-world problems.",
  standard: "3.MD.7a-b",
  keyIdea: (
    <>
      <p>A rectangle's area = length × width — the exact same count tiling it square by square would give you, just faster.</p>
      <p>If you know the area and one side, divide to find the missing side: it's the operation that undoes multiplication.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  reintroEverySolved: 20,
  preview: Preview,
  problems: [{ label: "Area by multiplying", make: areaMultiplyProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: areaMultiplyingSideLengthsTest,
};
