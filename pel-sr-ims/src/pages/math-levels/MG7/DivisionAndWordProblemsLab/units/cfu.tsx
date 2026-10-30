import { useEffect, useState } from "react";
import type { ReactNode } from "react";

// ============================================================================
// FixedCFU — lab-local (NOT shared/engine) helper for a unit's required
// "Quick Check" gate: a small fixed (non-randomized) set of hand-picked
// comprehension questions, shown once before Practice unlocks. Generalizes
// MM1/NegativeNumbersLab's RealWorldNegatives.tsx PreCheckBlock/one-off gate
// pattern so 4 of this lab's 5 units can reuse one component instead of each
// hand-rolling its own. Kept inside this lab's own units/ folder (not
// promoted to shared/engine/) per this round's scope rules — every unit
// using it imports it locally, same as everything else in this file tree.
//
// Every question is shown at once (not one-at-a-time), each independently
// checkable and re-triable on a wrong answer — same retry-until-right spirit
// as every other gated drill in this app. `onComplete` fires once (and only
// once) every question in the list has been answered correctly.
// ============================================================================

export interface CfuChoiceQ {
  kind: "choice";
  prompt: ReactNode;
  choices: string[];
  /** Index into `choices` of the correct option. */
  correct: number;
  correctExplain: ReactNode;
  wrongExplain: ReactNode;
}

/** A sentence with exactly two dropdown blanks — mirrors engine/types.ts's
 *  SentenceStep shape (select-only; no free-typed blank here) closely enough
 *  that the resemblance is intentional, but this is a hand-graded local gate
 *  question, not a Step, so it doesn't actually import that type. */
export interface CfuSentenceQ {
  kind: "sentence";
  before: ReactNode;
  blank1: { choices: string[]; correct: number };
  mid: ReactNode;
  blank2: { choices: string[]; correct: number };
  after?: ReactNode;
  correctExplain: ReactNode;
}

export type CfuQuestion = CfuChoiceQ | CfuSentenceQ;

function ChoiceQBlock({ q, onDone }: { q: CfuChoiceQ; onDone: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked === q.correct;
  useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  return (
    <div className="align-stack-wrap">
      <p>{q.prompt}</p>
      <div className="control-row" style={{ flexWrap: "wrap" }}>
        {q.choices.map((c, i) => (
          <button
            key={i}
            type="button"
            className="choice"
            disabled={done}
            onClick={() => setPicked(i)}
            style={
              picked === i
                ? { borderColor: i === q.correct ? "var(--good)" : "var(--bad)", background: i === q.correct ? "var(--good-soft)" : "var(--bad-soft)" }
                : undefined
            }
          >
            {c}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${done ? "good" : "bad"}`} role="alert">
          {done ? q.correctExplain : q.wrongExplain}
        </p>
      )}
    </div>
  );
}

function SentenceQBlock({ q, onDone }: { q: CfuSentenceQ; onDone: () => void }) {
  const [v1, setV1] = useState<number | "">("");
  const [v2, setV2] = useState<number | "">("");
  const [checked, setChecked] = useState(false);
  const done = checked && v1 === q.blank1.correct && v2 === q.blank2.correct;
  useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  return (
    <div className="align-stack-wrap">
      <div className="control-row" style={{ flexWrap: "wrap", alignItems: "center" }}>
        <span>{q.before}</span>
        <select
          className="answer"
          disabled={done}
          value={v1}
          onChange={(e) => setV1(e.target.value === "" ? "" : Number(e.target.value))}
        >
          <option value="" disabled>
            choose
          </option>
          {q.blank1.choices.map((c, i) => (
            <option key={i} value={i}>
              {c}
            </option>
          ))}
        </select>
        <span>{q.mid}</span>
        <select
          className="answer"
          disabled={done}
          value={v2}
          onChange={(e) => setV2(e.target.value === "" ? "" : Number(e.target.value))}
        >
          <option value="" disabled>
            choose
          </option>
          {q.blank2.choices.map((c, i) => (
            <option key={i} value={i}>
              {c}
            </option>
          ))}
        </select>
        {q.after && <span>{q.after}</span>}
        <button className="btn primary" type="button" disabled={done || v1 === "" || v2 === ""} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${done ? "good" : "bad"}`} role="alert">
          {done ? q.correctExplain : "Not quite — check both blanks again."}
        </p>
      )}
    </div>
  );
}

export function FixedCFU({ title, questions, onComplete }: { title: ReactNode; questions: CfuQuestion[]; onComplete?: () => void }) {
  const [done, setDone] = useState<boolean[]>(() => questions.map(() => false));
  const allDone = done.every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">{title}</p>
      {questions.map((q, i) => (
        <div key={i} style={{ marginTop: i === 0 ? 0 : 14 }}>
          <p>
            <b>{i + 1}.</b>
          </p>
          {q.kind === "choice" ? (
            <ChoiceQBlock q={q} onDone={() => setDone((d) => (d[i] ? d : d.map((v, k) => (k === i ? true : v))))} />
          ) : (
            <SentenceQBlock q={q} onDone={() => setDone((d) => (d[i] ? d : d.map((v, k) => (k === i ? true : v))))} />
          )}
        </div>
      ))}
    </div>
  );
}
