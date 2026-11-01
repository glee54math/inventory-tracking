import { isValidElement, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";
import { numbersMatch, parseAnswer } from "../../../shared/lib/math";

// ============================================================================
// Lab-local Check-for-Understanding helper (NOT shared/engine — this round's
// scope rule). Every CFU question in this lab is a fixed, hand-picked
// sentence with one or more answer boxes (dropdowns and/or typed numbers)
// mixed into its text. One component implements the multi-box answer rule
// for all of them, so no single question can get it subtly wrong:
//   1. "Check Answer" stays disabled until EVERY box has an answer.
//   2. After Check, each box gets its OWN green/red border.
//   3. Feedback only renders once every box is filled — and changing any
//      box clears the verdict, so nothing is ever graded live while typing.
// Same idea as MG7/DivisionAndWordProblemsLab/units/cfu.tsx's FixedCFU, but
// generalized to any number of boxes and to typed-number boxes.
// ============================================================================

export interface SelectBox {
  kind: "select";
  options: string[];
  correct: number;
  label: string;
}
export interface NumberBox {
  kind: "number";
  answer: number;
  label: string;
  width?: number;
}
export type Box = SelectBox | NumberBox;
export type Part = ReactNode | Box;

const isBox = (p: Part): p is Box =>
  typeof p === "object" && p !== null && !isValidElement(p) && !Array.isArray(p) && "kind" in p && ((p as Box).kind === "select" || (p as Box).kind === "number");

const boxOk = (b: Box, v: string): boolean => {
  if (b.kind === "select") return v !== "" && Number(v) === b.correct;
  const n = parseAnswer(v);
  return n !== null && numbersMatch(n, b.answer);
};

export interface CfuQuestion {
  /** Each inner array is one wrapped row of text and boxes. */
  rows: Part[][];
  visual?: ReactNode;
  good: ReactNode;
  /** A diagnosed message for a specific wrong pattern, or a general one.
   *  Receives the raw box values in order (select = option index as text). */
  bad: ReactNode | ((values: string[]) => ReactNode);
}

function BoxQuestion({ n, q, onDone }: { n: number; q: CfuQuestion; onDone: () => void }) {
  const boxes = q.rows.flat().filter(isBox);
  const [values, setValues] = useState<string[]>(() => boxes.map(() => ""));
  const [checked, setChecked] = useState(false);
  const filled = allFilled(...values);
  const oks = boxes.map((b, i) => boxOk(b, values[i]));
  const ok = oks.every(Boolean);
  const done = checked && filled && ok;
  useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const set = (i: number, v: string) => {
    setChecked(false);
    setValues((all) => all.map((x, k) => (k === i ? v : x)));
  };

  let boxIdx = 0;
  return (
    <div className="align-stack-wrap">
      {q.visual}
      {q.rows.map((row, r) => (
        <div key={r} className="control-row cfu-row">
          {r === 0 && <b>{n}.</b>}
          {row.map((part, k) => {
            if (!isBox(part)) return <span key={k}>{part}</span>;
            const i = boxIdx++;
            if (part.kind === "select") {
              return (
                <select key={k} className="answer" aria-label={part.label} disabled={done} value={values[i]} style={answerBorder(oks[i], checked)} onChange={(e) => set(i, e.target.value)}>
                  <option value="" disabled>
                    choose
                  </option>
                  {part.options.map((o, j) => (
                    <option key={j} value={j}>
                      {o}
                    </option>
                  ))}
                </select>
              );
            }
            return (
              <input
                key={k}
                className="answer"
                inputMode="decimal"
                autoComplete="off"
                aria-label={part.label}
                disabled={done}
                value={values[i]}
                style={{ width: part.width ?? 80, ...answerBorder(oks[i], checked) }}
                onChange={(e) => set(i, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && filled && setChecked(true)}
              />
            );
          })}
        </div>
      ))}
      <div className="control-row">
        <button className="btn primary" type="button" disabled={!filled || done} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && filled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? q.good : typeof q.bad === "function" ? q.bad(values) : q.bad}
        </p>
      )}
    </div>
  );
}

/** The whole gate: every question at once, `onComplete` fires once all are right. */
export function CheckForUnderstanding({ title, questions, onComplete }: { title: ReactNode; questions: CfuQuestion[]; onComplete?: () => void }) {
  const [done, setDone] = useState<boolean[]>(() => questions.map(() => false));
  const allDone = done.every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);
  return (
    <div className="align-drill" style={{ display: "grid", gap: 18 }}>
      <p className="intro-gate-title">{title}</p>
      {questions.map((q, i) => (
        <BoxQuestion key={i} n={i + 1} q={q} onDone={() => setDone((d) => (d[i] ? d : d.map((v, k) => (k === i ? true : v))))} />
      ))}
      {allDone && (
        <p className="feedback good" role="status">
          All {questions.length} checks done — nice work!
        </p>
      )}
    </div>
  );
}

/** The "Check for Understanding" toggle button used in every Explore here
 *  (green-tinted while open, plain while closed — the lab-wide convention). */
export function CfuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="btn ghost"
      style={{ width: "fit-content", ...(open ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
      onClick={onToggle}
    >
      Check for Understanding
    </button>
  );
}
