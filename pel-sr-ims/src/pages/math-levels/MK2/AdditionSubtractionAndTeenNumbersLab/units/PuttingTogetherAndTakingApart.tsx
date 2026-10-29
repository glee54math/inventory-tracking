import { useEffect, useState } from "react";
import { SplitGroup, Fingers } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { puttingTogetherAndTakingApartTest } from "./PuttingTogetherAndTakingApartTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions (never randomized), same convention as every
// other gated unit in this app's labs. This is the first unit introducing
// addition/subtraction as concepts at all, so the CFU specifically targets
// confusing which operation matches which action wording.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: what the + and = symbols actually mean, not just "what's the
 *  answer" — a rote drill never asks this directly. */
function SymbolMeaningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [plusPick, setPlusPick] = useState("");
  const [equalPick, setEqualPick] = useState("");
  const [checked, setChecked] = useState(false);
  const plusOk = plusPick === "together";
  const equalOk = equalPick === "same";
  const ok = plusOk && equalOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Look at the number sentence: 3 + 2 = 5.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What does the + symbol tell you to do?{" "}
          <select className="answer" value={plusPick} onChange={(e) => setPlusPick(e.target.value)} style={fieldOk(plusOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="together">Put groups together</option>
            <option value="apart">Take a group apart</option>
            <option value="compare">Compare two groups</option>
          </select>
        </label>
        <label>
          What does the = symbol mean?{" "}
          <select className="answer" value={equalPick} onChange={(e) => setEqualPick(e.target.value)} style={fieldOk(equalOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="same">Is the same amount as</option>
            <option value="bigger">Is bigger than</option>
            <option value="question">A question mark</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the + symbol means putting groups together, and the = symbol means both sides have the same amount."
            : "Not quite — the + symbol always means putting groups together, and = means both sides are the same amount, not a question or a comparison."}
        </p>
      )}
    </div>
  );
}

/** Conflation: the SAME numbers, two different action words, two different
 *  operations — forces picking the operation from the wording, not the
 *  numbers, so neither question can be pattern-matched from the other. */
function ActionWordingQuestion({ onComplete }: { onComplete?: () => void }) {
  const [givenPick, setGivenPick] = useState("");
  const [takenPick, setTakenPick] = useState("");
  const [checked, setChecked] = useState(false);
  const givenOk = givenPick === "add";
  const takenOk = takenPick === "sub";
  const ok = givenOk && takenOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Mia has 5 apples.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Story A: 2 MORE apples are given to Mia. Is story A adding or subtracting?{" "}
          <select className="answer" value={givenPick} onChange={(e) => setGivenPick(e.target.value)} style={fieldOk(givenOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="add">Adding</option>
            <option value="sub">Subtracting</option>
          </select>
        </label>
        <label>
          Story B: 2 apples are TAKEN AWAY from Mia. Is story B adding or subtracting?{" "}
          <select className="answer" value={takenPick} onChange={(e) => setTakenPick(e.target.value)} style={fieldOk(takenOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="add">Adding</option>
            <option value="sub">Subtracting</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? 'Correct — the number "2" was the same in both stories, but "given to" means a group joins (adding), and "taken away" means a group leaves (subtracting). The ACTION word tells you the operation, not the number.'
            : 'Not quite — look at the action words, not the numbers. "Given to" means something JOINS the group (adding). "Taken away" means something LEAVES the group (subtracting).'}
        </p>
      )}
    </div>
  );
}

/** Generalization / false trap: does taking away ever make a group bigger? */
function TakeAwayDirectionQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: when you take objects away from a group, the group can sometimes end up BIGGER than it started.
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
            ? "Correct — false! Taking objects away always leaves the same amount or fewer, never more. Only joining a group together can make it bigger."
            : "Not quite — try it with real objects: take any number away from a group. The group never grows from taking away — it only grows from objects joining it."}
        </p>
      )}
    </div>
  );
}

/** Multi-part production: the fingers modality PLUS writing the matching
 *  equation — ties this unit's two newer ideas (no-picture representation,
 *  and symbolic translation) into one question. */
function FingersEquationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [totalPick, setTotalPick] = useState("");
  const [eqPick, setEqPick] = useState("");
  const [checked, setChecked] = useState(false);
  const totalOk = totalPick === "4";
  const eqOk = eqPick === "3+1=4";
  const ok = totalOk && eqOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Hold up 3 fingers on one hand, and 1 finger on the other hand.
      </p>
      <Fingers count={4} tone="a" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many fingers are up in all?{" "}
          <select className="answer" value={totalPick} onChange={(e) => setTotalPick(e.target.value)} style={fieldOk(totalOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label>
          Which number sentence matches?{" "}
          <select className="answer" value={eqPick} onChange={(e) => setEqPick(e.target.value)} style={fieldOk(eqOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3+1=4">3 + 1 = 4</option>
            <option value="4+1=3">4 + 1 = 3</option>
            <option value="3-1=4">3 − 1 = 4</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 3 fingers and 1 finger join to make 4 in all, written as 3 + 1 = 4."
            : "Not quite — count every raised finger on both hands first, then write the joining (+) sentence with that total on the right of the = sign."}
        </p>
      )}
    </div>
  );
}

function PuttingTogetherCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ symbols: false, wording: false, direction: false, fingersEq: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure joining and taking apart make sense before you try practice problems.</p>
      <SymbolMeaningQuestion onComplete={mark("symbols")} />
      <ActionWordingQuestion onComplete={mark("wording")} />
      <TakeAwayDirectionQuestion onComplete={mark("direction")} />
      <FingersEquationQuestion onComplete={mark("fingersEq")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"join" | "apart">("join");
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const total = a + b;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="What's happening"
          value={mode}
          onChange={setMode}
          options={[{ id: "join", label: "Putting together" }, { id: "apart", label: "Taking apart" }]}
        />
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
      {(introActive || showCheck) && <PuttingTogetherCheckForUnderstanding onComplete={onIntroDone} />}

      <div className="control-row">
        <Stepper label={mode === "join" ? "First group" : "Whole group"} value={a} min={0} max={10} step={1} onChange={setA} tone="a" />
        <Stepper label={mode === "join" ? "Second group" : "Part taken apart"} value={b} min={0} max={10 - a} step={1} onChange={setB} tone="b" />
      </div>

      <SplitGroup total={total} partA={a} toneA="a" toneB="b" />
      <p className="feedback good" style={{ minHeight: 24 }}>
        {mode === "join"
          ? `${a} and ${b} JOIN together to make ${total} in all.`
          : `${total} splits APART into ${a} and ${b}.`}
      </p>
      <p className="muted small">
        {mode === "join"
          ? `Written as a number sentence: ${a} + ${b} = ${total}. The + symbol means the two groups are joining together.`
          : `Written as a number sentence: ${total} − ${b} = ${a}. The − symbol means a part is being taken away from the whole.`}
      </p>

      <div className="align-stack-wrap">
        <p>
          <b>Same idea, with fingers</b> — no picture of objects this time.
        </p>
        <Fingers count={total} tone="c" />
        <p className="muted small">{a} fingers and {b} fingers makes {total} fingers in all — fingers work exactly like any other group of objects.</p>
      </div>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "addTo" | "takeFrom" | "fingers" | "equation";
const BUCKETS: Bucket[] = ["addTo", "takeFrom", "fingers", "equation"];

const ADD_SCENES = [
  { noun: "ducks", verb: "swim over to join them", glyph: "🦆" },
  { noun: "bunnies", verb: "hop over to join them", glyph: "🐰" },
  { noun: "balloons", verb: "float over to join them", glyph: "🎈" },
] as const;
const SUB_SCENES = [
  { noun: "birds", verb: "fly away", glyph: "🐦" },
  { noun: "cookies", verb: "get eaten", glyph: "🍪" },
  { noun: "balloons", verb: "pop and are gone", glyph: "🎈" },
] as const;

function puttingTogetherProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "addTo") {
    const a = randInt(1, 8);
    const b = randInt(1, Math.min(9, 10 - a));
    const total = a + b;
    const scene = pick(ADD_SCENES);
    return {
      title: "Putting groups together",
      bucket,
      story: `There are ${a} ${scene.noun}. ${b} more ${scene.noun} ${scene.verb}.`,
      visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: `How many ${scene.noun} are there now, all together?`, hint: "Count every object in the picture, both colors.", explain: `${a} + ${b} = ${total}.`, answer: total },
        { kind: "number", prompt: `Before the ${b} more joined, how many ${scene.noun} were there?`, hint: "Look back at just the first group's color.", explain: `There were ${a} to start, before ${b} more joined.`, answer: a },
      ],
      wrapUp: `${a} and ${b} joined together to make ${total}.`,
    };
  }

  if (bucket === "takeFrom") {
    const total = randInt(2, 10);
    const b = randInt(1, total - 1);
    const a = total - b;
    const scene = pick(SUB_SCENES);
    return {
      title: "Taking a group apart",
      bucket,
      story: `There are ${total} ${scene.noun}. ${b} of them ${scene.verb}.`,
      visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" showDivider />,
      steps: [
        { kind: "number", prompt: `How many ${scene.noun} are left?`, hint: "Count only the color that's still there.", explain: `${total} − ${b} = ${a}.`, answer: a },
        { kind: "number", prompt: `How many ${scene.noun} were there before any ${scene.verb}?`, hint: "Add the part that's left back to the part that went away.", explain: `${a} + ${b} = ${total}, so there were ${total} to start.`, answer: total },
      ],
      wrapUp: `${total} split apart into ${a} left and ${b} gone.`,
    };
  }

  if (bucket === "fingers") {
    const a = randInt(1, 5);
    const b = randInt(1, Math.min(5, 10 - a));
    const total = a + b;
    const joining = Math.random() < 0.7;
    return {
      title: "Show it with fingers",
      bucket,
      story: joining
        ? `Hold up ${a} fingers on one hand and ${b} fingers on the other hand.`
        : `Hold up ${total} fingers. Put ${b} of them down.`,
      visual: () => <Fingers count={joining ? total : a} tone="c" />,
      steps: [
        { kind: "number", prompt: joining ? "How many fingers are up in all?" : "How many fingers are still up?", hint: "Count every raised finger on both hands.", explain: joining ? `${a} + ${b} = ${total}.` : `${total} − ${b} = ${a}.`, answer: joining ? total : a },
        { kind: "number", prompt: "If one more finger went up, how many would be raised then?", hint: "One more than your last answer.", explain: `One more than ${joining ? total : a} is ${(joining ? total : a) + 1}.`, answer: (joining ? total : a) + 1 },
      ],
      wrapUp: joining ? `${a} fingers and ${b} fingers makes ${total} in all.` : `${total} fingers take away ${b} leaves ${a}.`,
    };
  }

  // equation — symbolic translation AFTER the concrete reasoning step, not a
  // standalone arithmetic bucket (per this unit's plan).
  const joining = Math.random() < 0.5;
  if (joining) {
    const a = randInt(1, 8);
    const b = randInt(1, Math.min(9, 10 - a));
    const total = a + b;
    return {
      title: "Write the number sentence",
      bucket,
      story: `${a} fish are in a pond. ${b} more fish swim in to join them.`,
      visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: "How many fish are in the pond now?", hint: "Count every fish, both colors.", explain: `${a} + ${b} = ${total}.`, answer: total },
        choice(
          { prompt: "Which number sentence matches this story?", hint: "The two groups are joining together — that's the + symbol.", explain: `${a} fish joined by ${b} more fish makes ${a} + ${b} = ${total}.` },
          `${a} + ${b} = ${total}`,
          [`${total} + ${b} = ${a}`, `${a} − ${b} = ${total}`] // misconceptions: total on the wrong side; wrong operation
        ),
      ],
      wrapUp: `${a} + ${b} = ${total}.`,
    };
  }
  const total = randInt(2, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return {
    title: "Write the number sentence",
    bucket,
    story: `${total} fish are in a pond. ${b} of them swim away.`,
    visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
    steps: [
      { kind: "number", prompt: "How many fish are left in the pond?", hint: "Count only the fish still there.", explain: `${total} − ${b} = ${a}.`, answer: a },
      choice(
        { prompt: "Which number sentence matches this story?", hint: "A part is leaving the whole — that's the − symbol.", explain: `${total} fish, ${b} swam away, leaves ${total} − ${b} = ${a}.` },
        `${total} − ${b} = ${a}`,
        [`${a} − ${b} = ${total}`, `${total} + ${b} = ${a}`] // misconceptions: operand order swapped; wrong operation
      ),
    ],
    wrapUp: `${total} − ${b} = ${a}.`,
  };
}

export const puttingTogetherAndTakingApart: Unit = {
  id: "puttingTogetherAndTakingApart",
  title: "Putting Together and Taking Apart",
  goal: "Show adding as groups joining together, and subtracting as a group splitting apart, using objects, pictures, or fingers.",
  standard: "K.OA.1",
  keyIdea: (
    <>
      <p>Adding means two groups JOIN together to make one bigger group. Subtracting means a group splits APART and a part leaves.</p>
      <p>You can show this with real objects, with fingers, or with a number sentence like 3 + 2 = 5 — they all mean the exact same thing.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // The very first concept in the lab — a reasoning/representation skill a
  // student can always re-derive by acting it out again, not a fact to
  // memorize, so no reintroEverySolved here.
  problems: [{ label: "Join or Take Apart", make: puttingTogetherProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: puttingTogetherAndTakingApartTest,
};
