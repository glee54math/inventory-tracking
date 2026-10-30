import { useEffect, useState } from "react";
import { NumberLineMD } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { lengthWordProblemsNumberLineTest } from "./LengthWordProblemsNumberLineTest";

const NAMES = ["Mia", "Jun", "Sam", "Priya", "Leo", "Ava", "Noah", "Zoe"] as const;
const pickName = () => shuffle(NAMES)[0];

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "add";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> When you join two lengths together to find the total, what operation do you use?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="add">Addition</option>
          <option value="subtract">Subtraction</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — joining two lengths together is addition." : "Not quite — joining lengths together to find a total is addition."}
        </p>
      )}
    </div>
  );
}

/** THE core misconception: a keyword like "used" or "gave away" doesn't
 *  always mean subtract — when the START is unknown, the same story
 *  actually needs addition. */
function StartUnknownQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "add";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Jenna had some ribbon. She used 15 inches for a bow. Now she has 22 inches left. How much ribbon did she START with?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Even though the story says "used," which operation actually solves this?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="subtract">Subtraction — because "used" means subtract</option>
            <option value="add">Addition — add back the part she used to what's left</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — to find the START, you add the part she used back to what's left: 22 + 15 = 37 inches. The word \"used\" doesn't automatically mean subtract when it's the STARTING amount you're solving for."
            : 'Not quite — think about it in reverse: she USED 15 and had 22 LEFT, so she must have started with the 22 she has now PLUS the 15 she used: 22 + 15 = 37.'}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap — the "left" keyword doesn't always mean subtract. */
function KeywordTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: the word "left" in a problem always means you should subtract.
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
          {ok
            ? 'Correct — remember Jenna\'s ribbon: it used the word "left," but finding her STARTING amount needed addition. Always picture the whole story, not just one keyword.'
            : 'Not quite — remember Jenna\'s ribbon problem: it had "left" in it, but solving for her STARTING amount actually needed addition (22 + 15), not subtraction.'}
        </p>
      )}
    </div>
  );
}

/** Number-line misconception: a tick mark's value depends on the tick step, not just "1 tick = 1 unit." */
function TickMarkQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "depends";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> On this number line, the marked ticks are 0, 10, 20, 30...
      </p>
      <NumberLineMD max={50} tickStep={10} point={30} tone="a" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          If you moved 3 tick marks to the right from 0, would you land on 3?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes, 3 ticks always means 3</option>
            <option value="depends">No — each tick here is worth 10, so 3 ticks lands on 30</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — each tick on THIS number line is worth 10, so moving 3 ticks lands on 30, not 3. Always check what one tick is worth before counting ticks."
            : "Not quite — look at the numbers under the ticks: 0, 10, 20, 30. Each tick is worth 10 here, so 3 ticks to the right lands on 30."}
        </p>
      )}
    </div>
  );
}

function LengthWordProblemsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, startUnknown: false, trap: false, tick: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure these word problems and the number line make sense before you try practice.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <StartUnknownQuestion onComplete={mark("startUnknown")} />
      <KeywordTrapQuestion onComplete={mark("trap")} />
      <TickMarkQuestion onComplete={mark("tick")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [start, setStart] = useState(20);
  const [jump, setJump] = useState(15);
  const result = start + jump;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Start at" value={start} min={0} max={80} step={5} onChange={setStart} tone="a" />
        <Stepper label="Jump" value={jump} min={-40} max={40} step={5} onChange={setJump} tone="b" />
        {!introActive && (
          <button
            type="button"
            className="btn ghost"
            style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined}
            onClick={() => setShowCheck((v) => !v)}
          >
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <LengthWordProblemsCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">Drag the steppers to set a starting point and a jump. Watch the arc land exactly on start + jump.</p>
      <NumberLineMD max={100} tickStep={10} jumps={[{ from: start, to: Math.max(0, Math.min(100, result)) }]} tone="a" />
      <p className="feedback good" style={{ minHeight: 24 }}>
        {jump >= 0 ? `${start} + ${jump} = ${result}` : `${start} + (${jump}) = ${result}`} — the arc shows the jump landing right on the answer.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "addTo" | "takeFrom" | "compareDifference" | "unknownPosition" | "numberLinePosition";
const BUCKETS: Bucket[] = ["addTo", "takeFrom", "compareDifference", "unknownPosition", "numberLinePosition"];

const ITEMS = ["ribbon", "rope", "string", "wire", "fence", "trail"] as const;

function addToProblem(): Problem {
  const name = pickName();
  const item = ITEMS[randInt(0, ITEMS.length - 1)];
  const a = randInt(15, 45);
  const b = randInt(10, 40);
  const total = a + b;
  return {
    title: "Join two lengths",
    bucket: "addTo",
    story: `${name} has a ${item} that is ${a} inches long. ${name} ties on another piece that is ${b} inches long. How long is the ${item} now?`,
    visual: (done) => <NumberLineMD max={100} tickStep={10} jumps={done >= 1 ? [{ from: a, to: a + b, tone: "a" }] : []} point={done >= 1 ? undefined : a} tone="a" />,
    steps: [{ kind: "number", prompt: `How long is the ${item} now?`, hint: `Add the two pieces: ${a} + ${b}.`, explain: `${a} + ${b} = ${total} inches.`, answer: total, suffix: "in" }],
    wrapUp: `${name}'s ${item} is now ${total} inches long.`,
  };
}

function takeFromProblem(): Problem {
  const name = pickName();
  const item = ITEMS[randInt(0, ITEMS.length - 1)];
  const start = randInt(40, 90);
  const cut = randInt(10, start - 15);
  const remaining = start - cut;
  return {
    title: "Cut a length",
    bucket: "takeFrom",
    story: `A ${item} was ${start} inches long. ${name} cut off ${cut} inches. How long is the ${item} now?`,
    visual: (done) => <NumberLineMD max={100} tickStep={10} jumps={done >= 1 ? [{ from: start, to: remaining, tone: "b" }] : []} point={done >= 1 ? undefined : start} tone="b" />,
    steps: [{ kind: "number", prompt: `How long is the ${item} now?`, hint: `Subtract the cut piece: ${start} − ${cut}.`, explain: `${start} − ${cut} = ${remaining} inches.`, answer: remaining, suffix: "in" }],
    wrapUp: `The ${item} is now ${remaining} inches long.`,
  };
}

function compareDifferenceProblem(): Problem {
  const itemA = ITEMS[randInt(0, ITEMS.length - 1)];
  const itemB = ITEMS[(ITEMS.indexOf(itemA) + randInt(1, ITEMS.length - 1)) % ITEMS.length];
  const lenA = randInt(30, 90);
  const lenB = randInt(10, lenA - 10);
  const diff = lenA - lenB;
  return {
    title: "Compare two lengths",
    bucket: "compareDifference",
    story: `One ${itemA} is ${lenA} inches long. One ${itemB} is ${lenB} inches long. How much LONGER is the ${itemA}?`,
    visual: () => (
      <NumberLineMD
        max={100}
        tickStep={10}
        points={[
          { value: lenA, tone: "a", label: `${itemA}: ${lenA}` },
          { value: lenB, tone: "b", label: `${itemB}: ${lenB}` },
        ]}
      />
    ),
    steps: [{ kind: "number", prompt: `How much longer is the ${itemA} than the ${itemB}?`, hint: `Subtract: ${lenA} − ${lenB}.`, explain: `${lenA} − ${lenB} = ${diff} inches.`, answer: diff, suffix: "in" }],
    wrapUp: `The ${itemA} is ${diff} inches longer than the ${itemB}.`,
  };
}

/** Start-unknown or change-unknown — the hardest bucket: the keyword alone
 *  doesn't tell you the operation, you must model the actual relationship. */
function unknownPositionProblem(): Problem {
  const name = pickName();
  const item = ITEMS[randInt(0, ITEMS.length - 1)];
  const startUnknown = Math.random() < 0.5;
  if (startUnknown) {
    const used = randInt(10, 30);
    const left = randInt(15, 40);
    const start = used + left;
    return {
      title: "What did it start as? (start unknown)",
      bucket: "unknownPosition",
      story: `${name} had a ${item} of some length. ${name} used ${used} inches of it, leaving ${left} inches. How long was the ${item} at the START?`,
      visual: () => <NumberLineMD max={100} tickStep={10} jumps={[{ from: left, to: start, tone: "a", label: `+${used}` }]} />,
      steps: [
        choice(
          { prompt: "Even though the story says \"used,\" what operation actually finds the START?", hint: "Add the used part back to what's left.", explain: "Addition — the start is what's left PLUS what was used." },
          "Addition — add the used amount back to what's left",
          ["Subtraction — because \"used\" means subtract"]
        ),
        { kind: "number", prompt: `How long was the ${item} at the start?`, hint: `${left} + ${used}.`, explain: `${left} + ${used} = ${start} inches.`, answer: start, suffix: "in" },
      ],
      wrapUp: `The ${item} started at ${start} inches — add back what was used to what's left.`,
    };
  }
  const start = randInt(15, 40);
  const end = start + randInt(10, 35);
  const added = end - start;
  return {
    title: "How much changed? (change unknown)",
    bucket: "unknownPosition",
    story: `A ${item} was ${start} inches long. Someone added more to it. Now it is ${end} inches long. How many inches were ADDED?`,
    visual: () => <NumberLineMD max={100} tickStep={10} jumps={[{ from: start, to: end, tone: "b" }]} />,
    steps: [
      choice(
        { prompt: "What operation finds how much was added?", hint: "Compare the new total to the old total.", explain: "Subtraction — the new total minus the original length tells you how much was added." },
        "Subtraction — the new length minus the original length",
        ["Addition — add the two given lengths together"]
      ),
      { kind: "number", prompt: "How many inches were added?", hint: `${end} − ${start}.`, explain: `${end} − ${start} = ${added} inches.`, answer: added, suffix: "in" },
    ],
    wrapUp: `${added} inches were added to the ${item}.`,
  };
}

/** Picks a start/jump pair that always lands within the 0..100 axis — a
 *  magnitude alone can't just be randomly signed, since a small start with a
 *  large negative jump (or a large start with a large positive one) can
 *  walk off the number line entirely. Only allow a direction the jump can
 *  actually take without leaving [0, 100]. */
function randomJumpWithinLine(): { start: number; jump: number; end: number } {
  const start = randInt(5, 60);
  const magnitude = randInt(10, 35);
  const canGoDown = start - magnitude >= 0;
  const canGoUp = start + magnitude <= 100;
  const sign = canGoDown && canGoUp ? (Math.random() < 0.5 ? 1 : -1) : canGoUp ? 1 : -1;
  const jump = magnitude * sign;
  return { start, jump, end: start + jump };
}

function numberLinePositionProblem(): Problem {
  const { start, jump, end } = randomJumpWithinLine();
  return {
    title: "Read the jump on the number line",
    bucket: "numberLinePosition",
    story: `The arc below shows one jump on a number line from 0 to 100.`,
    visual: () => <NumberLineMD max={100} tickStep={10} jumps={[{ from: start, to: end }]} />,
    steps: [
      { kind: "number", prompt: "Where does the jump START?", hint: "Look at the left end of the arc.", explain: `It starts at ${start}.`, answer: start },
      { kind: "number", prompt: "Where does the jump LAND?", hint: "Look at the right end of the arc, where the dot is.", explain: `It lands at ${end}.`, answer: end },
      { kind: "number", prompt: jump >= 0 ? `What is ${start} + ${jump}?` : `What is ${start} − ${Math.abs(jump)}?`, hint: "That's exactly where the jump landed.", explain: `${start} ${jump >= 0 ? "+" : "−"} ${Math.abs(jump)} = ${end}.`, answer: end },
    ],
    wrapUp: `The jump goes from ${start} to ${end} — that's a ${jump >= 0 ? "sum" : "difference"} of ${Math.abs(jump)}.`,
  };
}

export const lengthWordProblemsNumberLine: Unit = {
  id: "lengthWordProblemsNumberLine",
  title: "Length Word Problems and the Number Line",
  goal: "Solve word problems about lengths — even the tricky ones where a keyword doesn't match the operation — and show sums and differences on a number line.",
  standard: "2.MD.5, 2.MD.6",
  keyIdea: (
    <>
      <p>Picture the whole story before picking an operation — a word like "used" or "left" doesn't always tell you whether to add or subtract.</p>
      <p>On a number line, always check what ONE tick mark is worth before counting ticks.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [
    { label: "Join Lengths", make: addToProblem, buckets: ["addTo"] },
    { label: "Cut a Length", make: takeFromProblem, buckets: ["takeFrom"] },
    { label: "Compare Lengths", make: compareDifferenceProblem, buckets: ["compareDifference"] },
    { label: "Start or Change Unknown", make: unknownPositionProblem, buckets: ["unknownPosition"] },
    { label: "Read the Number Line", make: numberLinePositionProblem, buckets: ["numberLinePosition"] },
  ],
  requiredBuckets: BUCKETS,
  test: lengthWordProblemsNumberLineTest,
};
