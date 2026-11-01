import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";

// ============================================================================
// FixedCFU — lab-local helper for each unit's required Check for
// Understanding gate: a small FIXED (never randomized) set of hand-picked
// comprehension questions shown before Practice unlocks. Copied from
// MG7/DivisionAndWordProblemsLab/units/cfu.tsx (choice + two-dropdown
// sentence kinds, unchanged in behavior) and extended with a third kind,
// `numbers` — N labelled number boxes graded together — which Unit 4's
// "same division, three different answers" question needs. This is now the
// SECOND lab carrying FixedCFU; it was left lab-local only because this
// build round forbids touching shared/ — promotion candidate for
// shared/engine/ (see final report).
//
// Every multi-box question follows the multi-box answer rule: Check Answer
// stays disabled until every box has something in it, each box gets its own
// green/red border after Check, and the feedback sentence only renders once
// every box is filled. `onComplete` fires once every question is correct.
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

/** A sentence with exactly two dropdown blanks. */
export interface CfuSentenceQ {
  kind: "sentence";
  prompt?: ReactNode;
  before: ReactNode;
  blank1: { choices: string[]; correct: number };
  mid: ReactNode;
  blank2: { choices: string[]; correct: number };
  after?: ReactNode;
  correctExplain: ReactNode;
  /** Shown when at least one blank is wrong. Defaults to a generic nudge. */
  wrongExplain?: ReactNode;
}

/** Several labelled whole-number boxes graded together (one Check button). */
export interface CfuNumbersQ {
  kind: "numbers";
  prompt: ReactNode;
  boxes: { label: ReactNode; answer: number }[];
  correctExplain: ReactNode;
  wrongExplain?: ReactNode;
}

export type CfuQuestion = CfuChoiceQ | CfuSentenceQ | CfuNumbersQ;

function ChoiceQBlock({ q, onDone }: { q: CfuChoiceQ; onDone: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked === q.correct;
  useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  return (
    <div className="align-stack-wrap">
      <div>{q.prompt}</div>
      <div className="control-row" style={{ flexWrap: "wrap", marginTop: 8 }}>
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
  const filled = allFilled(v1, v2);
  const ok1 = v1 === q.blank1.correct;
  const ok2 = v2 === q.blank2.correct;
  const done = checked && ok1 && ok2;
  useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const select = (value: number | "", set: (v: number | "") => void, choices: string[], ok: boolean, label: string) => (
    <select
      className="answer"
      aria-label={label}
      disabled={done}
      style={answerBorder(ok, checked)}
      value={value}
      onChange={(e) => {
        set(e.target.value === "" ? "" : Number(e.target.value));
        setChecked(false);
      }}
    >
      <option value="" disabled>
        choose
      </option>
      {choices.map((c, i) => (
        <option key={i} value={i}>
          {c}
        </option>
      ))}
    </select>
  );
  return (
    <div className="align-stack-wrap">
      {q.prompt && <div style={{ marginBottom: 8 }}>{q.prompt}</div>}
      <div className="control-row" style={{ flexWrap: "wrap", alignItems: "center" }}>
        <span>{q.before}</span>
        {select(v1, setV1, q.blank1.choices, ok1, "First blank")}
        <span>{q.mid}</span>
        {select(v2, setV2, q.blank2.choices, ok2, "Second blank")}
        {q.after && <span>{q.after}</span>}
        <button className="btn primary" type="button" disabled={done || !filled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && filled && (
        <p className={`feedback ${done ? "good" : "bad"}`} role="alert">
          {done ? q.correctExplain : (q.wrongExplain ?? "Not quite — the red box isn't right yet. Look at it again.")}
        </p>
      )}
    </div>
  );
}

function NumbersQBlock({ q, onDone }: { q: CfuNumbersQ; onDone: () => void }) {
  const [vals, setVals] = useState<string[]>(() => q.boxes.map(() => ""));
  const [checked, setChecked] = useState(false);
  const filled = allFilled(...vals);
  const oks = q.boxes.map((b, i) => vals[i].trim() !== "" && Number(vals[i]) === b.answer);
  const done = checked && oks.every(Boolean);
  useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  return (
    <div className="align-stack-wrap">
      <div>{q.prompt}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {q.boxes.map((b, i) => (
          <label key={i} className="control-row" style={{ alignItems: "center", flexWrap: "wrap" }}>
            <span>{b.label}</span>
            <input
              className="answer"
              inputMode="numeric"
              autoComplete="off"
              disabled={done}
              style={{ width: 80, ...answerBorder(oks[i], checked) }}
              value={vals[i]}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d+$/.test(v)) {
                  setVals((all) => all.map((x, k) => (k === i ? v : x)));
                  setChecked(false);
                }
              }}
            />
          </label>
        ))}
      </div>
      <button className="btn primary" type="button" style={{ marginTop: 10 }} disabled={done || !filled} onClick={() => setChecked(true)}>
        Check Answer
      </button>
      {checked && filled && (
        <p className={`feedback ${done ? "good" : "bad"}`} role="alert">
          {done ? q.correctExplain : (q.wrongExplain ?? "Not quite — fix the box with the red border.")}
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
  const markDone = (i: number) => () => setDone((d) => (d[i] ? d : d.map((v, k) => (k === i ? true : v))));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">{title}</p>
      {questions.map((q, i) => (
        <div key={i} className="cfu-q" style={{ marginTop: i === 0 ? 0 : 18 }}>
          <p style={{ margin: 0 }}>
            <b>{i + 1}.</b>
          </p>
          {q.kind === "choice" ? (
            <ChoiceQBlock q={q} onDone={markDone(i)} />
          ) : q.kind === "sentence" ? (
            <SentenceQBlock q={q} onDone={markDone(i)} />
          ) : (
            <NumbersQBlock q={q} onDone={markDone(i)} />
          )}
        </div>
      ))}
      {allDone && (
        <p className="feedback good" role="status" style={{ marginTop: 14 }}>
          All {questions.length} checks done — nice work!
        </p>
      )}
    </div>
  );
}
