import { useEffect, useState } from "react";
import { TenFrameGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { equalSignAndEquationsTest } from "./EqualSignAndEquationsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions. Targets the plan's named misconceptions:
// reading "=" as "and the answer comes next" (so 5=2+3 or 7+1=6+2 look
// "backwards"), and mishandling a true/false equation that needs NO
// computation at all (8=8). Q4 is the plan's required unknown-not-in-last-
// position question.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function EqualSignMeaningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "same";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What does the = sign mean?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="next">"The answer comes right after this"</option>
          <option value="same">"Both sides have the exact same amount"</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? 'Correct — "=" means both sides are equal in value, like a balanced scale. The answer doesn\'t have to come right after it.'
            : 'Not quite — "=" means both sides have the exact same amount, like a balanced scale — not "the answer comes next."'}
        </p>
      )}
    </div>
  );
}

/** Both terms live, in the same question — the "backwards-looking" trap at
 *  two levels of complexity. */
function BackwardsEquationsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [a, b].every((v) => String(v).trim() !== "");
  const aOk = a === "true";
  const bOk = b === "true";
  const ok = aOk && bOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Is each equation true or false?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          5 = 2 + 3:{" "}
          <select className="answer" value={a} onChange={(e) => setA(e.target.value)} style={fieldOk(aOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
        <label>
          7 + 1 = 6 + 2:{" "}
          <select className="answer" value={b} onChange={(e) => setB(e.target.value)} style={fieldOk(bOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — BOTH are true. 5 = 2 + 3 (5 both times), and 7 + 1 = 6 + 2 (8 both times). The sum doesn't have to sit alone on the right."
            : "Not quite — both are true. 2 + 3 = 5 and 5 = 2 + 3 say the exact same thing, just flipped. Same for 7 + 1 = 6 + 2 — check that both sides equal 8."}
        </p>
      )}
    </div>
  );
}

/** Requires NO computation at all — just the equal-sign concept. */
function TrivialTrueQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: 8 = 8
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
            ? "Correct — no computing needed here. The same number is on both sides, so of course they're equal."
            : "Not quite — there's nothing to compute here. 8 is 8, on both sides, so this is simply true."}
        </p>
      )}
    </div>
  );
}

/** The plan's required question: the unknown is NOT in the last position. */
function UnknownNotLastQuestion({ onComplete }: { onComplete?: () => void }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = answer === "3";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Find the missing number: 8 + ☐ = 11
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="3">3</option>
          <option value="8">8</option>
          <option value="19">19</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the missing number doesn't have to be at the very end. 8 + 3 = 11, so the blank is 3."
            : "Not quite — the blank can be anywhere in the equation. 11 − 8 = 3, so 8 + 3 = 11."}
        </p>
      )}
    </div>
  );
}

function EqualSignCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ meaning: false, backwards: false, trivial: false, unknownNotLast: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure the equal sign makes sense before you try practice problems.</p>
      <EqualSignMeaningQuestion onComplete={mark("meaning")} />
      <BackwardsEquationsQuestion onComplete={mark("backwards")} />
      <TrivialTrueQuestion onComplete={mark("trivial")} />
      <UnknownNotLastQuestion onComplete={mark("unknownNotLast")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [leftA, setLeftA] = useState(7);
  const [leftB, setLeftB] = useState(1);
  const [rightA, setRightA] = useState(6);
  const [rightB, setRightB] = useState(2);

  const leftTotal = leftA + leftB;
  const rightTotal = rightA + rightB;
  const balanced = leftTotal === rightTotal;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
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
      {(introActive || showCheck) && <EqualSignCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">The = sign is like a balance scale: both sides must weigh the same. Try to make it balance.</p>
      <div className="control-row">
        <Stepper label="Left, first" value={leftA} min={0} max={15} step={1} onChange={setLeftA} tone="a" />
        <Stepper label="Left, second" value={leftB} min={0} max={15} step={1} onChange={setLeftB} tone="a" />
        <span className="affix" style={{ fontWeight: 800, fontSize: 20 }}>
          =
        </span>
        <Stepper label="Right, first" value={rightA} min={0} max={15} step={1} onChange={setRightA} tone="b" />
        <Stepper label="Right, second" value={rightB} min={0} max={15} step={1} onChange={setRightB} tone="b" />
      </div>
      <div className="control-row" style={{ gap: 24, alignItems: "flex-start" }}>
        <div>
          <TenFrameGroup value={Math.min(20, leftTotal)} tone="a" />
          <p className="muted small" style={{ textAlign: "center" }}>
            {leftA} + {leftB} = {leftTotal}
          </p>
        </div>
        <div>
          <TenFrameGroup value={Math.min(20, rightTotal)} tone="b" />
          <p className="muted small" style={{ textAlign: "center" }}>
            {rightA} + {rightB} = {rightTotal}
          </p>
        </div>
      </div>
      <p className={`feedback ${balanced ? "good" : "bad"}`}>
        {balanced ? `Balanced! ${leftA} + ${leftB} = ${rightA} + ${rightB} — both sides equal ${leftTotal}.` : `Not balanced — ${leftTotal} ≠ ${rightTotal}. Adjust the numbers until both sides match.`}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "equalSignUnknownLeft" | "trueFalseTrap" | "findUnknownNonFinal";
const BUCKETS: Bucket[] = ["equalSignUnknownLeft", "trueFalseTrap", "findUnknownNonFinal"];

function equalSignUnknownLeftProblem(): Problem {
  const shape = Math.random() < 0.5 ? "unknownOnLeft" : "operationBothSides";
  if (shape === "unknownOnLeft") {
    // ☐ = A + B — the "answer slot" is on the left, breaking the default.
    const a = randInt(1, 12);
    const b = randInt(1, 9);
    const total = Math.min(20, a + b);
    return {
      title: "Equal sign — unknown on the left",
      bucket: "equalSignUnknownLeft",
      story: `☐ = ${a} + ${b}`,
      visual: () => <TenFrameGroup value={total} tone="a" splitAt={a} tone2="b" />,
      steps: [
        choice({ prompt: "What does the = sign mean here?", hint: 'It still means "the same amount," even with the blank on the left.', explain: 'Both sides must be equal — the blank just happens to be on the left this time.' }, "Both sides equal the same amount", ["The answer comes right after ="]),
        { kind: "number", prompt: "What number goes in the blank?", hint: `Add ${a} + ${b}.`, explain: `${a} + ${b} = ${total}, so ☐ = ${total}.`, answer: total },
      ],
      wrapUp: `${total} = ${a} + ${b}.`,
    };
  }
  // A + B = C + ☐ — an operation on BOTH sides.
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const total = Math.min(20, a + b);
  const c = randInt(1, Math.max(1, total - 1));
  const d = total - c;
  return {
    title: "Equal sign — operation on both sides",
    bucket: "equalSignUnknownLeft",
    story: `${a} + ${b} = ${c} + ☐`,
    visual: () => <TenFrameGroup value={total} tone="a" splitAt={a} tone2="b" />,
    steps: [
      choice({ prompt: "What does the = sign mean here?", hint: "Both sides need to add up to the same total, even though there's a sum on both sides.", explain: `Both ${a} + ${b} and ${c} + ☐ must equal the same total, ${total}.` }, "Both sides equal the same amount", ["The answer comes right after ="]),
      { kind: "number", prompt: "What number goes in the blank?", hint: `${a} + ${b} = ${total}. What plus ${c} makes ${total}?`, explain: `${total} − ${c} = ${d}, so ${c} + ${d} = ${total}.`, answer: d },
    ],
    wrapUp: `${a} + ${b} = ${c} + ${d} = ${total}.`,
  };
}

function trueFalseTrapProblem(): Problem {
  const kind = ["false", "trivialTrue", "genuineTrue"][randInt(0, 2)];
  if (kind === "trivialTrue") {
    const n = randInt(1, 20);
    return {
      title: "True or false?",
      bucket: "trueFalseTrap",
      story: `${n} = ${n}`,
      visual: () => <TenFrameGroup value={n} tone="a" />,
      steps: [choice({ prompt: `Is ${n} = ${n} true or false?`, hint: "There's nothing to compute here — look at both sides as they are.", explain: `${n} is ${n} — no computation needed, it's simply true.` }, "True", ["False"])],
      wrapUp: `${n} = ${n} is true — the exact same number on both sides.`,
    };
  }
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const trueTotal = a + b;
  if (kind === "genuineTrue") {
    return {
      title: "True or false?",
      bucket: "trueFalseTrap",
      story: `${a} + ${b} = ${trueTotal}`,
      visual: () => <TenFrameGroup value={Math.min(20, trueTotal)} tone="a" splitAt={a} tone2="b" />,
      steps: [choice({ prompt: `Is ${a} + ${b} = ${trueTotal} true or false?`, hint: "Add the left side and compare it to the right side.", explain: `${a} + ${b} = ${trueTotal}, which matches the right side — true.` }, "True", ["False"])],
      wrapUp: `${a} + ${b} = ${trueTotal} is true.`,
    };
  }
  // Deliberately false.
  let wrongTotal = trueTotal;
  while (wrongTotal === trueTotal) wrongTotal = Math.max(0, trueTotal + [-2, -1, 1, 2][randInt(0, 3)]);
  return {
    title: "True or false?",
    bucket: "trueFalseTrap",
    story: `${a} + ${b} = ${wrongTotal}`,
    visual: () => <TenFrameGroup value={Math.min(20, trueTotal)} tone="a" splitAt={a} tone2="b" />,
    steps: [choice({ prompt: `Is ${a} + ${b} = ${wrongTotal} true or false?`, hint: "Add the left side yourself — don't just assume it's right because it's written down.", explain: `${a} + ${b} = ${trueTotal}, not ${wrongTotal} — false.` }, "False", ["True"])],
    wrapUp: `${a} + ${b} = ${trueTotal}, not ${wrongTotal} — the equation is false.`,
  };
}

function findUnknownNonFinalProblem(): Problem {
  const shape = ["addFirst", "addSecond", "subtract"][randInt(0, 2)];
  if (shape === "addFirst") {
    // A + ☐ = C
    const a = randInt(1, 15);
    const c = Math.min(20, a + randInt(1, 9));
    const unknown = c - a;
    return {
      title: "Find the unknown",
      bucket: "findUnknownNonFinal",
      story: `${a} + ☐ = ${c}`,
      visual: () => <TenFrameGroup value={c} tone="a" splitAt={a} tone2="b" />,
      steps: [
        choice({ prompt: "Which part of this equation is unknown?", hint: "Read the equation left to right — where is the blank?", explain: "The SECOND addend is unknown — not the final total." }, "The second addend", ["The total"]),
        { kind: "number", prompt: "What number goes in the blank?", hint: `${c} − ${a} = ?`, explain: `${c} − ${a} = ${unknown}.`, answer: unknown },
      ],
      wrapUp: `${a} + ${unknown} = ${c}.`,
    };
  }
  if (shape === "addSecond") {
    // ☐ + B = C
    const b = randInt(1, 15);
    const c = Math.min(20, b + randInt(1, 9));
    const unknown = c - b;
    return {
      title: "Find the unknown",
      bucket: "findUnknownNonFinal",
      story: `☐ + ${b} = ${c}`,
      visual: () => <TenFrameGroup value={c} tone="a" />,
      steps: [
        choice({ prompt: "Which part of this equation is unknown?", hint: "The blank is the very FIRST thing in the equation.", explain: "The FIRST addend is unknown — not the final total." }, "The first addend", ["The total"]),
        { kind: "number", prompt: "What number goes in the blank?", hint: `${c} − ${b} = ?`, explain: `${c} − ${b} = ${unknown}.`, answer: unknown },
      ],
      wrapUp: `${unknown} + ${b} = ${c}.`,
    };
  }
  // A - ☐ = C
  const a = randInt(5, 19);
  const c = randInt(0, a - 1);
  const unknown = a - c;
  return {
    title: "Find the unknown",
    bucket: "findUnknownNonFinal",
    story: `${a} − ☐ = ${c}`,
    visual: () => <TenFrameGroup value={a} tone="c" splitAt={c} tone2="b" />,
    steps: [
      choice({ prompt: "Which part of this equation is unknown?", hint: "The blank sits between the subtraction sign and the equal sign.", explain: "The amount being SUBTRACTED is unknown — not the final result." }, "The amount being subtracted", ["The final result"]),
      { kind: "number", prompt: "What number goes in the blank?", hint: `${a} − ${c} = ?`, explain: `${a} − ${c} = ${unknown}.`, answer: unknown },
    ],
    wrapUp: `${a} − ${unknown} = ${c}.`,
  };
}

function equalSignProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "equalSignUnknownLeft") return equalSignUnknownLeftProblem();
  if (bucket === "trueFalseTrap") return trueFalseTrapProblem();
  return findUnknownNonFinalProblem();
}

export const equalSignAndEquations: Unit = {
  id: "equalSignAndEquations",
  title: "Equal Sign and Equations",
  goal: "Understand that = means \"the same amount as\" (not \"the answer comes next\"), and find a missing number anywhere in an equation.",
  standard: "1.OA.7, 1.OA.8",
  keyIdea: (
    <>
      <p>= means both sides have the exact same amount — like a balanced scale. The sum doesn't have to sit alone on the right side.</p>
      <p>The missing number in an equation can be anywhere — first, second, or the total — read the whole equation before deciding what to do.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoning about equation structure, re-derived each time — not a fact
  // to memorize (contrast Unit 5's fluency buckets).
  problems: [{ label: "Equal Sign and Equations", make: equalSignProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: equalSignAndEquationsTest,
};
