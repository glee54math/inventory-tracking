import { useCallback, useEffect, useState, type ReactNode } from "react";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";

// ============================================================================
// Lab-local Check-for-Understanding building blocks (NOT shared/engine — this
// round's scope keeps every new helper inside its own lab; see the final
// report's promotion-candidate list, alongside MG7 DivisionAndWordProblemsLab's
// own units/cfu.tsx FixedCFU, which solves the same problem differently).
//
// DropdownQuestion enforces the project's multi-box answer rule for EVERY
// question, one box or several:
//   1. "Check Answer" stays disabled until every box has an answer;
//   2. after Check, each box gets its OWN green/red border;
//   3. the feedback sentence only renders once every box is filled.
// Changing any box after a Check clears the verdict (no live grading) — the
// student presses Check again.
// ============================================================================

export interface CfuBlank {
  /** Shown in the dropdown, in this order. */
  options: string[];
  /** Must be one of `options`. */
  correct: string;
  /** Screen-reader label for this box. */
  label: string;
}

export function DropdownQuestion({
  blanks,
  render,
  good,
  bad,
  onDone,
}: {
  blanks: CfuBlank[];
  /** Lays out the question text with the rendered dropdowns slotted in, in order. */
  render: (boxes: ReactNode[]) => ReactNode;
  good: ReactNode;
  bad: ReactNode;
  onDone?: () => void;
}) {
  const [values, setValues] = useState<string[]>(() => blanks.map(() => ""));
  const [checked, setChecked] = useState(false);
  const filled = allFilled(...values);
  const oks = blanks.map((b, i) => values[i] === b.correct);
  const ok = oks.every(Boolean);
  const done = checked && filled && ok;

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  const boxes = blanks.map((b, i) => (
    <select
      key={i}
      className="answer"
      aria-label={b.label}
      value={values[i]}
      disabled={done}
      style={answerBorder(oks[i], checked)}
      onChange={(e) => {
        const v = e.target.value;
        setValues((all) => all.map((x, k) => (k === i ? v : x)));
        setChecked(false);
      }}
    >
      <option value="" disabled>
        choose
      </option>
      {b.options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  ));

  return (
    <>
      <div className="cfu-line">{render(boxes)}</div>
      <div className="control-row" style={{ marginTop: 8 }}>
        <button className="btn primary" type="button" disabled={!filled || done} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && filled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? good : bad}
        </p>
      )}
    </>
  );
}

/** Tracks which of `n` gate questions are done; calls onComplete once, when all are. */
export function useCfuProgress(n: number, onComplete?: () => void) {
  const [done, setDone] = useState<boolean[]>(() => Array.from({ length: n }, () => false));
  const allDone = done.every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = useCallback((i: number) => () => setDone((d) => (d[i] ? d : d.map((v, k) => (k === i ? true : v)))), []);
  return { done, mark };
}

/** The green-tinted "Check for Understanding" toggle every unit's Explore shows once the gate is passed. */
export function CfuToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="btn ghost"
      style={{ width: "fit-content", ...(on ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
      onClick={onToggle}
    >
      Check for Understanding
    </button>
  );
}
