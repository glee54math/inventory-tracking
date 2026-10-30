import { useEffect, useState } from "react";
import { TenFrameGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import type { Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { withinTwentyFluencyTest } from "./WithinTwentyFluencyTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions. Targets (per the approved plan): the
// misconception that subtraction must always be "count down from the first
// number to zero" rather than an unknown-addend problem related to addition,
// AND confusion about when counting-on is efficient vs. when making a ten is
// needed.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "1+6";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> To solve 9 + 7 using the "make a ten" strategy, you break 7 into two parts. Which split makes the next step a ten?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="3+4">3 + 4</option>
          <option value="1+6">1 + 6</option>
          <option value="5+2">5 + 2</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 9 + 1 = 10, then 10 + 6 = 16. Splitting 7 into 1 + 6 is what makes the ten." : "Not quite — 9 needs exactly 1 more to make ten, so split 7 into 1 + 6: 9 + 1 = 10, then 10 + 6 = 16."}
        </p>
      )}
    </div>
  );
}

function CountOnVsMakeTenQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "countOn";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> For 8 + 2, is it faster to count on by 2 ("8... 9, 10"), or to make a ten?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="countOn">Count on — only 2 more to go</option>
          <option value="makeTen">Make a ten — split the 2 into smaller parts first</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — when the second number is small (like 1, 2, or 3), counting on is just as fast and doesn't need any splitting. Making a ten pays off most when the second number is bigger."
            : "Not quite — when the second number is already small (like 2), just counting on is simplest. Making a ten is most useful for a bigger second number, like 8 + 6."}
        </p>
      )}
    </div>
  );
}

function SubtractionIsNotOnlyCountDownQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: the ONLY way to solve 13 − 8 is to count down from 13, one at a time, until you reach 8.
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
            ? 'Correct — false. 13 − 8 is also "8 plus what makes 13?" — since 8 + 5 = 13, you can know 13 − 8 = 5 without counting down at all.'
            : 'Not quite — false is right. 13 − 8 is the SAME question as "8 plus what makes 13?" Since 8 + 5 = 13, that already tells you 13 − 8 = 5 — no counting down needed.'}
        </p>
      )}
    </div>
  );
}

function FactFamilyQuestion({ onComplete }: { onComplete?: () => void }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [a, b].every((v) => String(v).trim() !== "");
  const ok = a === "6" && b === "9";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> 9 + 6 = 15. Fill in the two related facts: 15 − 9 = ___ and 15 − 6 = ___.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <span>15 − 9 =</span>
        <select className="answer" value={a} onChange={(e) => setA(e.target.value)} style={fieldOk(a === "6", checked)}>
          <option value="" disabled>
            ?
          </option>
          <option value="6">6</option>
          <option value="9">9</option>
          <option value="15">15</option>
        </select>
        <span>15 − 6 =</span>
        <select className="answer" value={b} onChange={(e) => setB(e.target.value)} style={fieldOk(b === "9", checked)}>
          <option value="" disabled>
            ?
          </option>
          <option value="6">6</option>
          <option value="9">9</option>
          <option value="15">15</option>
        </select>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 15 − 9 = 6 and 15 − 6 = 9. All four facts (9+6=15, 6+9=15, 15−9=6, 15−6=9) come from the same three numbers." : "Not quite — both subtraction facts use the SAME three numbers as 9 + 6 = 15: 15 − 9 = 6, and 15 − 6 = 9."}
        </p>
      )}
    </div>
  );
}

function WithinTwentyCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, strategy: false, subtraction: false, factFamily: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure these ideas are clear before you try practice problems.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <CountOnVsMakeTenQuestion onComplete={mark("strategy")} />
      <SubtractionIsNotOnlyCountDownQuestion onComplete={mark("subtraction")} />
      <FactFamilyQuestion onComplete={mark("factFamily")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"add" | "subtract">("add");
  const [a, setA] = useState(9);
  const [b, setB] = useState(6);

  const sum = a + b;
  const diff = Math.max(0, a - b);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented label="Operation" value={mode} onChange={setMode} options={[{ id: "add", label: "Addition" }, { id: "subtract", label: "Subtraction" }]} />
        {!introActive && (
          <button type="button" className="btn ghost" style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined} onClick={() => setShowCheck((v) => !v)}>
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <WithinTwentyCheckForUnderstanding onComplete={onIntroDone} />}

      {mode === "add" ? (
        <>
          <div className="control-row">
            <label>
              First number: <input type="range" min={1} max={9} value={a} onChange={(e) => setA(Number(e.target.value))} /> {a}
            </label>
            <label>
              Second number: <input type="range" min={1} max={9} value={b} onChange={(e) => setB(Number(e.target.value))} /> {b}
            </label>
          </div>
          <TenFrameGroup value={Math.min(20, sum)} tone="a" splitAt={a} tone2="b" />
          <p className="muted small">
            {a} + {b} = {sum}. Related fact: {sum} − {a} = {b}, and {sum} − {b} = {a}. The same three numbers connect all of these.
          </p>
        </>
      ) : (
        <>
          <div className="control-row">
            <label>
              Start: <input type="range" min={10} max={18} value={Math.max(a + b, 10)} onChange={(e) => setA(Number(e.target.value) - b)} /> {Math.max(a + b, 10)}
            </label>
            <label>
              Take away: <input type="range" min={1} max={9} value={b} onChange={(e) => setB(Number(e.target.value))} /> {b}
            </label>
          </div>
          <TenFrameGroup value={Math.min(20, a + b)} tone="c" splitAt={diff} tone2="b" />
          <p className="muted small">
            {a + b} − {b} = {diff}. You don't have to count down one at a time — since {diff} + {b} = {a + b}, that addition fact already tells you the answer.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "sumsTo10" | "makeTen11to20" | "subNoCross" | "subDecompose" | "factFamily";
const BUCKETS: Bucket[] = ["sumsTo10", "makeTen11to20", "subNoCross", "subDecompose", "factFamily"];

function sumsTo10Problem(): Problem {
  let a = 0;
  let b = 0;
  do {
    a = randInt(1, 9);
    b = randInt(1, 9);
  } while (a + b > 10);
  const sum = a + b;
  return {
    title: "Addition within 10",
    bucket: "sumsTo10",
    story: `What is ${a} + ${b}?`,
    visual: () => <TenFrameGroup value={sum} tone="a" splitAt={a} tone2="b" />,
    steps: [
      { kind: "number", prompt: `${a} + ${b} = ?`, hint: "Try to recall it quickly, without counting one-by-one.", explain: `${a} + ${b} = ${sum}.`, answer: sum },
      { kind: "number", prompt: `Related fact: ${sum} − ${a} = ?`, hint: "Addition and subtraction facts are connected.", explain: `${sum} − ${a} = ${b}.`, answer: b },
    ],
    wrapUp: `${a} + ${b} = ${sum}.`,
  };
}

function makeTen11to20Problem(): Problem {
  let a = 0;
  let b = 0;
  do {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } while (a + b <= 10 || a + b > 20);
  const sum = a + b;
  const gap = 10 - a;
  return {
    title: "Making a ten",
    bucket: "makeTen11to20",
    story: `What is ${a} + ${b}? Use the make-a-ten strategy.`,
    visual: () => <TenFrameGroup value={Math.min(20, sum)} tone="a" splitAt={a} tone2="b" />,
    steps: [
      { kind: "number", prompt: `${a} needs how many more to make 10?`, hint: `Count up from ${a} to 10.`, explain: `${a} + ${gap} = 10.`, answer: gap },
      { kind: "number", prompt: `So ${a} + ${b} = 10 + ${b - gap} = ?`, hint: "Can you use a make-ten shortcut?", explain: `${a} + ${b} = ${sum}.`, answer: sum },
    ],
    wrapUp: `${a} + ${b} = ${sum}, by making a ten first.`,
  };
}

function subNoCrossProblem(): Problem {
  let total = 0;
  let sub = 0;
  do {
    total = randInt(11, 19);
    sub = randInt(0, 9);
  } while (sub > total % 10);
  const result = total - sub;
  return {
    title: "Subtraction within 20 — no crossing a ten",
    bucket: "subNoCross",
    story: `What is ${total} − ${sub}?`,
    visual: () => <TenFrameGroup value={total} tone="c" splitAt={result} tone2="b" />,
    steps: [
      { kind: "number", prompt: `${total} − ${sub} = ?`, hint: "The ones digit alone is already big enough — no need to break into the ten.", explain: `${total} − ${sub} = ${result}.`, answer: result },
      { kind: "number", prompt: `Related fact: ${result} + ${sub} = ?`, hint: "Addition and subtraction facts are connected.", explain: `${result} + ${sub} = ${total}.`, answer: total },
    ],
    wrapUp: `${total} − ${sub} = ${result}.`,
  };
}

function subDecomposeProblem(): Problem {
  const start = randInt(11, 19);
  let sub = 0;
  do {
    sub = randInt(2, 9);
  } while (sub <= start % 10);
  const result = start - sub;
  const toTen = start % 10 === 0 ? 10 : start % 10;
  return {
    title: "Subtraction within 20 — decomposing a ten",
    bucket: "subDecompose",
    story: `What is ${start} − ${sub}?`,
    visual: () => <TenFrameGroup value={start} tone="c" />,
    steps: [
      { kind: "number", prompt: `${start} − ${sub}: first subtract just enough to reach 10. ${start} − ${toTen} = ?`, hint: "How far is it down to the ten below?", explain: `${start} − ${toTen} = ${start - toTen}.`, answer: start - toTen },
      { kind: "number", prompt: `Now subtract what's left: 10 − ${sub - toTen} = ?`, hint: "Bridge through ten.", explain: `10 − ${sub - toTen} = ${result}.`, answer: result },
    ],
    wrapUp: `${start} − ${sub} = ${result}, by bridging through ten.`,
  };
}

function factFamilyProblem(): Problem {
  let a = 0;
  let b = 0;
  do {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } while (a + b > 18);
  const sum = a + b;
  return {
    title: "Fact family",
    bucket: "factFamily",
    story: `${a} + ${b} = ${sum}. Use that to find the related subtraction facts.`,
    visual: () => <TenFrameGroup value={Math.min(20, sum)} tone="a" splitAt={a} tone2="b" />,
    steps: [
      { kind: "number", prompt: `${sum} − ${a} = ?`, hint: "This uses the same three numbers.", explain: `${sum} − ${a} = ${b}.`, answer: b },
      { kind: "number", prompt: `${sum} − ${b} = ?`, hint: "This uses the same three numbers, the other way.", explain: `${sum} − ${b} = ${a}.`, answer: a },
    ],
    wrapUp: `${a} + ${b} = ${sum} connects to ${sum} − ${a} = ${b} and ${sum} − ${b} = ${a}.`,
  };
}

function fluencyProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "sumsTo10") return sumsTo10Problem();
  if (bucket === "makeTen11to20") return makeTen11to20Problem();
  if (bucket === "subNoCross") return subNoCrossProblem();
  if (bucket === "subDecompose") return subDecomposeProblem();
  return factFamilyProblem();
}

export const withinTwentyFluency: Unit = {
  id: "withinTwentyFluency",
  title: "Within-20 Addition and Subtraction Fluency",
  goal: "Add and subtract within 20 quickly, using strategies like making a ten, and start knowing the basic facts by heart.",
  standard: "2.OA.2",
  keyIdea: (
    <>
      <p>These facts are meant to become AUTOMATIC — try to recall them quickly, or use a fast strategy, instead of counting one-by-one every time.</p>
      <p>Subtraction isn't just "count down" — it's also "what do I add to get there?" The same three numbers connect an addition fact to two subtraction facts.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // 2.OA.2 explicitly names knowing these facts from memory by end of grade —
  // periodically re-check instead of trusting one early pass forever.
  reintroEverySolved: 20,
  problems: [{ label: "Within-20 Facts", make: fluencyProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: withinTwentyFluencyTest,
};
