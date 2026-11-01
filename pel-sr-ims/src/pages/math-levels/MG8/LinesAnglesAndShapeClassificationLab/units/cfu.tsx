import { useEffect, useState, type ReactNode } from "react";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";

// ============================================================================
// DropdownCFU — this lab's one Check-for-Understanding gate component, reused
// by all 5 units. Each question is a fixed (never randomized) prompt with an
// optional picture and 1-3 dropdown boxes, following the multi-box answer
// rule exactly (shared/lib/answerChecks.ts):
//   1. "Check Answer" stays disabled until EVERY box has an answer.
//   2. After Check, each box gets its OWN green/red border.
//   3. The feedback sentence only renders once every box is filled.
// Changing any box after a Check clears the verdict (so nothing is ever
// graded live as boxes change — only on an explicit Check press).
// Lab-local, same as MG7 DivisionAndWordProblemsLab's units/cfu.tsx FixedCFU
// (a shared/engine promotion candidate: two labs now carry a near-identical
// gate component).
// ============================================================================

export interface CfuBox {
  /** Text shown before this box, e.g. "Picture A is a". */
  label: ReactNode;
  choices: string[];
  /** Index into `choices`. */
  correct: number;
}

export interface CfuQuestion {
  prompt: ReactNode;
  visual?: ReactNode;
  boxes: CfuBox[];
  /** Shown when every box is right. */
  good: ReactNode;
  /** Shown when any box is wrong — should start "Not quite". */
  bad: ReactNode;
}

function QuestionBlock({ n, q, onDone }: { n: number; q: CfuQuestion; onDone: () => void }) {
  const [values, setValues] = useState<string[]>(() => q.boxes.map(() => ""));
  const [checked, setChecked] = useState(false);
  const filled = allFilled(...values);
  const oks = q.boxes.map((b, i) => values[i] !== "" && Number(values[i]) === b.correct);
  const ok = oks.every(Boolean);
  const done = checked && filled && ok;

  useEffect(() => {
    if (done) onDone();
    // onDone is a fresh closure each render; only the transition matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const set = (i: number, v: string) => {
    setValues((all) => all.map((x, k) => (k === i ? v : x)));
    setChecked(false);
  };

  return (
    <div className="align-stack-wrap">
      <p>
        <b>{n}.</b> {q.prompt}
      </p>
      {q.visual && <div className="lasc-cfu-visual">{q.visual}</div>}
      <div className="lasc-cfu-boxes">
        {q.boxes.map((b, i) => (
          <label key={i} className="lasc-cfu-row">
            <span>{b.label}</span>
            <select className="answer" value={values[i]} disabled={done} style={answerBorder(oks[i], checked)} onChange={(e) => set(i, e.target.value)}>
              <option value="" disabled>
                choose
              </option>
              {b.choices.map((c, k) => (
                <option key={k} value={k}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div>
        <button className="btn primary" type="button" disabled={!filled || done} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && filled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? q.good : q.bad}
        </p>
      )}
    </div>
  );
}

export function DropdownCFU({ title, questions, onComplete }: { title: ReactNode; questions: CfuQuestion[]; onComplete?: () => void }) {
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
        <QuestionBlock key={i} n={i + 1} q={q} onDone={() => setDone((d) => (d[i] ? d : d.map((v, k) => (k === i ? true : v))))} />
      ))}
      {allDone && (
        <p className="feedback good" role="status">
          All {questions.length} checked — practice problems are unlocked!
        </p>
      )}
    </div>
  );
}

/** The Explore-tab toggle button for re-opening the check after it's passed
 *  (green-tinted while open — same inline style as every other lab's). */
export function CfuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="btn ghost" style={{ width: "fit-content", ...(open ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }} onClick={onToggle}>
      Check for Understanding
    </button>
  );
}
