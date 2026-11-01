import type { ReactNode } from "react";
import { answerBorder } from "../../../shared/lib/answerChecks";

// Tiny building blocks for this lab's Check-for-Understanding questions, so
// every multi-box question follows the same rule (shared/lib/answerChecks.ts):
// Check Answer disabled until every box is filled, each box bordered by its
// OWN correctness after Check, feedback only once every box is filled.

/** A `<select className="answer">` with a disabled "choose" placeholder and a per-box green/red border after Check. */
export function Pick({
  value,
  onChange,
  options,
  ok,
  checked,
  label,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
  ok: boolean;
  checked: boolean;
  label: string;
  disabled?: boolean;
}) {
  return (
    <select className="answer" value={value} aria-label={label} disabled={disabled} style={answerBorder(ok, checked)} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        choose
      </option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** The shared Check Answer button + combined feedback line for a multi-box question. */
export function CheckRow({ filled, checked, ok, done, onCheck, good, bad }: { filled: boolean; checked: boolean; ok: boolean; done: boolean; onCheck: () => void; good: ReactNode; bad: ReactNode }) {
  return (
    <>
      <div className="control-row">
        <button className="btn primary" type="button" disabled={!filled || done} onClick={onCheck}>
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

/** A single-pick question (one "box"): a row of buttons, feedback right after a pick. */
export function PickOne({ value, onPick, options, correct, done, good, bad }: { value: string | null; onPick: (id: string) => void; options: { id: string; label: string }[]; correct: string; done: boolean; good: ReactNode; bad: ReactNode }) {
  return (
    <>
      <div className="control-row">
        {options.map((o) => (
          <button key={o.id} type="button" className={`btn ghost ${value === o.id ? "pressed" : ""}`} disabled={done} onClick={() => onPick(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
      {value && (
        <p className={`feedback ${value === correct ? "good" : "bad"}`} role="alert">
          {value === correct ? good : bad}
        </p>
      )}
    </>
  );
}
