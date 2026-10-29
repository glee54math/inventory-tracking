import { useEffect, useState } from "react";
import { TenFrameGroup } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { addToTakeFromWordProblemsTest } from "./AddToTakeFromWordProblemsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions (never randomized). Targets the plan's named
// misconceptions: (1) defaulting to "the answer is always the result," and
// (2) picking the operation from keywords ("more" = add) instead of the
// story's structure — Q4 is the plan's required trap: a Start-Unknown story
// that uses a "more"-style (gain) word, where the keyword habit would add
// when the correct move is actually to subtract.

const ROLES = ["the starting amount (how much there was at the very beginning)", "the change (how much was added or taken away)", "the result (the amount at the end)"];

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function RolePlusNumberQuestion({
  n,
  story,
  question,
  correctRole,
  correctAnswer,
  answerOptions,
  explain,
  onComplete,
}: {
  n: number;
  story: string;
  question: string;
  correctRole: number; // index into ROLES
  correctAnswer: number;
  answerOptions: number[];
  explain: string;
  onComplete?: () => void;
}) {
  const [role, setRole] = useState("");
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const roleOk = role === String(correctRole);
  const answerOk = Number(answer) === correctAnswer;
  const ok = roleOk && answerOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>{n}.</b> {story} {question}
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What's unknown?{" "}
          <select className="answer" value={role} onChange={(e) => setRole(e.target.value)} style={fieldOk(roleOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            {ROLES.map((r, i) => (
              <option key={i} value={i}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label>
          Answer:{" "}
          <select className="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} style={fieldOk(answerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            {answerOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? `Correct — ${explain}` : `Not quite — ${explain}`}
        </p>
      )}
    </div>
  );
}

function WordProblemCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ q1: false, q2: false, q3: false, q4: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  const [trueFalse, setTrueFalse] = useState("");
  const [tfChecked, setTfChecked] = useState(false);
  const tfOk = trueFalse === "false";
  useEffect(() => {
    if (tfChecked && tfOk) mark("q3")();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tfChecked, tfOk]);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure you can tell these stories apart before you try practice problems.</p>
      <RolePlusNumberQuestion
        n={1}
        story="Sam had 6 apples. He picked 5 more apples."
        question="How many apples does he have now?"
        correctRole={2}
        correctAnswer={11}
        answerOptions={[5, 6, 11]}
        explain="this story asks for the RESULT — the amount Sam has now, after picking more: 6 + 5 = 11."
        onComplete={mark("q1")}
      />
      <RolePlusNumberQuestion
        n={2}
        story="Sam had 6 apples. He picked some more apples. Now he has 11 apples. How many apples did he pick?"
        question=""
        correctRole={1}
        correctAnswer={5}
        answerOptions={[5, 6, 11]}
        explain="the question asks how many he PICKED — the CHANGE, not the result. 11 − 6 = 5. The answer isn't always the biggest number in the story."
        onComplete={mark("q2")}
      />
      <div className="align-stack-wrap">
        <p>
          <b>3.</b> True or false: in every add-to or take-from story, the question is always asking for the total amount at the very END.
        </p>
        <div className="control-row" style={{ alignItems: "center" }}>
          <select className="answer" value={trueFalse} onChange={(e) => setTrueFalse(e.target.value)} style={fieldOk(tfOk, tfChecked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <button className="btn primary" type="button" onClick={() => setTfChecked(true)}>
            Check Answer
          </button>
        </div>
        {tfChecked && (
          <p className={`feedback ${tfOk ? "good" : "bad"}`} role="alert">
            {tfOk
              ? "Correct — false. Sometimes the STARTING amount is unknown, and sometimes the CHANGE is unknown. Read the question carefully every time."
              : "Not quite — false. The ending amount isn't always what's missing — sometimes the starting amount or the change is what you need to find."}
          </p>
        )}
      </div>
      <RolePlusNumberQuestion
        n={4}
        story="Leo had some pennies. He got 4 more pennies, and now has 11 pennies."
        question="How many pennies did he start with?"
        correctRole={0}
        correctAnswer={7}
        answerOptions={[4, 7, 15]}
        explain={'the word "more" doesn\'t always mean add — here the STARTING amount is unknown, and finding it means SUBTRACTING the change: 11 − 4 = 7, not adding.'}
        onComplete={mark("q4")}
      />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [start, setStart] = useState(6);
  const [change, setChange] = useState(5);
  const [action, setAction] = useState<"add" | "take">("add");

  const result = action === "add" ? Math.min(20, start + change) : Math.max(0, start - change);

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
      {(introActive || showCheck) && <WordProblemCheckForUnderstanding onComplete={onIntroDone} />}

      <p>
        Build your own story: start with some, then {action === "add" ? "add more" : "take some away"}.
      </p>
      <div className="control-row">
        <label>
          Start:{" "}
          <input
            type="range"
            min={0}
            max={20}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
          />{" "}
          {start}
        </label>
        <label>
          {action === "add" ? "Add" : "Take away"}:{" "}
          <input
            type="range"
            min={0}
            max={10}
            value={change}
            onChange={(e) => setChange(Number(e.target.value))}
          />{" "}
          {change}
        </label>
        <button className="btn ghost" onClick={() => setAction(action === "add" ? "take" : "add")}>
          Switch to {action === "add" ? "Take From" : "Add To"}
        </button>
      </div>
      <div className="control-row" style={{ gap: 24, alignItems: "flex-start" }}>
        <div>
          <TenFrameGroup value={start} tone="a" />
          <p className="muted small" style={{ textAlign: "center" }}>
            Start: {start}
          </p>
        </div>
        <div>
          <TenFrameGroup value={result} tone="c" />
          <p className="muted small" style={{ textAlign: "center" }}>
            Result: {result}
          </p>
        </div>
      </div>
      <p className="muted small">
        {action === "add"
          ? `${start} + ${change} = ${result}. The amount grew — this is an "Add To" story.`
          : `${start} − ${change} = ${result}. The amount shrank — this is a "Take From" story.`}{" "}
        A story can ask for the start, the change, or the result — read carefully to see which one is missing.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "addToResult" | "addToChange" | "addToStart" | "takeFromResult" | "takeFromChange" | "takeFromStart";
const BUCKETS: Bucket[] = ["addToResult", "addToChange", "addToStart", "takeFromResult", "takeFromChange", "takeFromStart"];

const CONTEXTS: { person: string; item: string; verbAdd: string; verbTake: string }[] = [
  { person: "Mia", item: "stickers", verbAdd: "got", verbTake: "gave away" },
  { person: "Jake", item: "marbles", verbAdd: "found", verbTake: "lost" },
  { person: "Ava", item: "crayons", verbAdd: "received", verbTake: "shared away" },
  { person: "Liam", item: "shells", verbAdd: "collected", verbTake: "gave to a friend" },
  { person: "Zoe", item: "stamps", verbAdd: "bought", verbTake: "used up" },
];

function wordProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  const ctx = pick(CONTEXTS);
  const roleChoice = (correctIdx: number) =>
    choice(
      { prompt: "What's unknown in this story?", hint: "Decide: is it the starting amount, the change, or the result?", explain: `The unknown here is ${ROLES[correctIdx]}.` },
      ROLES[correctIdx],
      ROLES.filter((_, i) => i !== correctIdx)
    );

  if (bucket === "addToResult" || bucket === "addToChange" || bucket === "addToStart") {
    let start = 0;
    let change = 0;
    do {
      start = randInt(0, 15);
      change = randInt(1, 9);
    } while (start + change > 20);
    const result = start + change;

    if (bucket === "addToResult") {
      return {
        title: "Add To — how many now?",
        bucket,
        story: `${ctx.person} had ${start} ${ctx.item}. Then ${ctx.person} ${ctx.verbAdd} ${change} more ${ctx.item}. How many ${ctx.item} does ${ctx.person} have now?`,
        visual: () => (
          <div className="control-row" style={{ gap: 20 }}>
            <TenFrameGroup value={start} tone="a" />
          </div>
        ),
        steps: [roleChoice(2), { kind: "number", prompt: `How many ${ctx.item} does ${ctx.person} have now?`, hint: "Start + change = result.", explain: `${start} + ${change} = ${result}.`, answer: result }],
        wrapUp: `${start} + ${change} = ${result}.`,
      };
    }
    if (bucket === "addToChange") {
      return {
        title: "Add To — how many did they get?",
        bucket,
        story: `${ctx.person} had ${start} ${ctx.item}. ${ctx.person} ${ctx.verbAdd} some more, and now has ${result} ${ctx.item}. How many ${ctx.item} did ${ctx.person} ${ctx.verbAdd}?`,
        visual: () => (
          <div className="control-row" style={{ gap: 20 }}>
            <TenFrameGroup value={start} tone="a" />
            <TenFrameGroup value={result} tone="c" />
          </div>
        ),
        steps: [roleChoice(1), { kind: "number", prompt: `How many ${ctx.item} did ${ctx.person} ${ctx.verbAdd}?`, hint: "Result − start = change.", explain: `${result} − ${start} = ${change}.`, answer: change }],
        wrapUp: `${start} + ${change} = ${result}.`,
      };
    }
    return {
      title: "Add To — how many at the start?",
      bucket,
      story: `${ctx.person} had some ${ctx.item}. Then ${ctx.person} ${ctx.verbAdd} ${change} more, and now has ${result} ${ctx.item}. How many ${ctx.item} did ${ctx.person} have at the start?`,
      visual: () => (
        <div className="control-row" style={{ gap: 20 }}>
          <TenFrameGroup value={result} tone="c" />
        </div>
      ),
      steps: [
        roleChoice(0),
        { kind: "number", prompt: `How many ${ctx.item} did ${ctx.person} have at the start?`, hint: `"More" doesn't always mean add — the change already happened, so subtract it back out: result − change = start.`, explain: `${result} − ${change} = ${start}.`, answer: start },
      ],
      wrapUp: `${start} + ${change} = ${result}.`,
    };
  }

  // take-from buckets
  let start = 0;
  let change = 0;
  do {
    start = randInt(1, 20);
    change = randInt(1, 9);
  } while (start - change < 0);
  const result = start - change;

  if (bucket === "takeFromResult") {
    return {
      title: "Take From — how many left?",
      bucket,
      story: `${ctx.person} had ${start} ${ctx.item}. Then ${ctx.person} ${ctx.verbTake} ${change} ${ctx.item}. How many ${ctx.item} does ${ctx.person} have left?`,
      visual: () => (
        <div className="control-row" style={{ gap: 20 }}>
          <TenFrameGroup value={start} tone="a" />
        </div>
      ),
      steps: [roleChoice(2), { kind: "number", prompt: `How many ${ctx.item} does ${ctx.person} have left?`, hint: "Start − change = result.", explain: `${start} − ${change} = ${result}.`, answer: result }],
      wrapUp: `${start} − ${change} = ${result}.`,
    };
  }
  if (bucket === "takeFromChange") {
    return {
      title: "Take From — how many did they give away?",
      bucket,
      story: `${ctx.person} had ${start} ${ctx.item}. ${ctx.person} ${ctx.verbTake} some, and now has ${result} ${ctx.item} left. How many ${ctx.item} did ${ctx.person} ${ctx.verbTake}?`,
      visual: () => (
        <div className="control-row" style={{ gap: 20 }}>
          <TenFrameGroup value={start} tone="a" />
          <TenFrameGroup value={result} tone="c" />
        </div>
      ),
      steps: [roleChoice(1), { kind: "number", prompt: `How many ${ctx.item} did ${ctx.person} ${ctx.verbTake}?`, hint: "Start − result = change.", explain: `${start} − ${result} = ${change}.`, answer: change }],
      wrapUp: `${start} − ${change} = ${result}.`,
    };
  }
  return {
    title: "Take From — how many at the start?",
    bucket,
    story: `${ctx.person} ${ctx.verbTake} ${change} ${ctx.item}, and now has ${result} ${ctx.item} left. How many ${ctx.item} did ${ctx.person} have at the start?`,
    visual: () => (
      <div className="control-row" style={{ gap: 20 }}>
        <TenFrameGroup value={result} tone="c" />
      </div>
    ),
    steps: [
      roleChoice(0),
      { kind: "number", prompt: `How many ${ctx.item} did ${ctx.person} have at the start?`, hint: "The change already happened, so add it back: result + change = start.", explain: `${result} + ${change} = ${start}.`, answer: start },
    ],
    wrapUp: `${start} − ${change} = ${result}.`,
  };
}

export const addToTakeFromWordProblems: Unit = {
  id: "addToTakeFromWordProblems",
  title: "Word Problems: Add To and Take From",
  goal: "Solve real-world stories where a starting amount changes — figure out whichever part (start, change, or result) is missing.",
  standard: "1.OA.1",
  keyIdea: (
    <>
      <p>Every story has a START, a CHANGE, and a RESULT. First figure out which one the question is asking for — don't assume it's always the result.</p>
      <p>Keywords like "more" can be misleading — read the whole story's structure, not just one word, especially when the STARTING amount is unknown.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Add To / Take From", make: wordProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: addToTakeFromWordProblemsTest,
};
