import { useCallback, useEffect, useState, type ReactNode } from "react";
import { allFilled, answerBorder } from "../lib/answerChecks";
import { parseAnswer, numbersMatch } from "../lib/math";
import { hasFraction, MathText, useStackedFractions } from "./MathText";
import { TapSelect } from "./TapSelect";
import { FormPicker } from "./AnswerForm";
import { formBoxes, formFilled, formOfValue, isAnswerForm, keepFitting, useAnswerFormPick, type AnswerForm } from "./answerKinds";

// ============================================================================
// Check-for-Understanding building blocks for 2nd-grade-and-up labs (K–1 labs
// use KCheck.tsx instead). First written lab-local in
// MG9/FractionOperationsLab/units/cfu.tsx; promoted here (2026-11) when
// MG10_AddingAndSubtractingFractionsLab became its second consumer. That
// promotion also added TYPED boxes (a blank with no `options`), so one
// question can mix dropdowns and typed answers (the fill-in rule), and an
// optional function form of `bad` so a wrong answer can be named.
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
  /** Shown in the dropdown, in this order. Omit for a typed box. */
  options?: string[];
  /** For a dropdown: one of `options`. For a typed box: the answer text. */
  correct: string;
  /** Screen-reader label for this box. */
  label: string;
  /**
   * Typed boxes only: custom grading. By default a typed answer is right when
   * it means the same number as `correct` ("1/2" also takes "2/4"); pass this
   * when the exact form matters.
   */
  accept?: (raw: string) => boolean;
  /** Typed boxes only: width in px (default 70). */
  width?: number;
  /**
   * Typed boxes only: draw the box as a written mixed number — a whole-number
   * box, then a top box over a bottom box (leave a box empty if you don't
   * need it), like the FractionStep answer boxes. Graded by value against
   * `correct` ("0", "1/2", "1 1/2"). Added for MG10 (stacked fractions).
   * Inside <AnswerFormPick> the student first picks the kind of answer
   * (whole number, mixed number, proper fraction); only that kind's boxes
   * show, and a wrong kind is marked on its button and counts as wrong.
   */
  mixedFraction?: boolean;
}

/**
 * A mixedFraction blank's boxes are kept in one value, "whole|top|bottom"
 * ("" when all empty). Inside <AnswerFormPick> a 4th part holds the picked
 * kind ("whole|top|bottom|kind"), and only the boxes that kind shows count.
 */
const splitMixed = (v: string): [string, string, string] => {
  const [w = "", n = "", d = ""] = v.split("|");
  return [w, n, d];
};
const formOfMixed = (v: string): AnswerForm | "" => {
  const f = v.split("|")[3];
  return isAnswerForm(f) ? f : "";
};
const joinMixed = (w: string, n: string, d: string, form: AnswerForm | "" = ""): string => (form ? `${w}|${n}|${d}|${form}` : w || n || d ? `${w}|${n}|${d}` : "");
/** "1|1|2" -> "1 1/2" (what parseAnswer reads). */
const mixedText = (v: string): string => {
  const form = formOfMixed(v);
  const [w, n, d] = (form ? keepFitting(splitMixed(v), form) : splitMixed(v)).map((x) => x.trim());
  return [w, n || d ? `${n}/${d}` : ""].filter(Boolean).join(" ");
};
/** The kind `correct` ("0", "1/2", "1 1/2") is written as. */
const formOfCorrect = (correct: string): AnswerForm | null => {
  const m = correct.trim().match(/^(?:(\d+) )?(\d+)\/(\d+)$|^(\d+)$/);
  if (!m) return null;
  if (m[4] !== undefined) return "whole";
  const w = Number(m[1] ?? 0);
  const n = Number(m[2]);
  const d = Number(m[3]);
  return formOfValue(w * d + n, d);
};
/** Inside <AnswerFormPick>: was the picked kind right for this blank? */
const formOk = (b: CfuBlank, raw: string): boolean => formOfMixed(raw) === formOfCorrect(b.correct);

const typedOk = (b: CfuBlank, raw: string): boolean => {
  if (b.mixedFraction && formOfMixed(raw) && !formOk(b, raw)) return false;
  if (b.mixedFraction) raw = mixedText(raw);
  if (b.accept) return b.accept(raw);
  const want = parseAnswer(b.correct);
  const got = parseAnswer(raw);
  if (want !== null && got !== null) return numbersMatch(got, want);
  return raw.trim().toLowerCase() === b.correct.trim().toLowerCase();
};

export function DropdownQuestion({
  blanks,
  render,
  good,
  bad,
  onDone,
}: {
  blanks: CfuBlank[];
  /** Lays out the question text with the rendered boxes slotted in, in order. */
  render: (boxes: ReactNode[]) => ReactNode;
  good: ReactNode;
  /** Feedback when any box is wrong; the function form gets each box's verdict and value. */
  bad: ReactNode | ((oks: boolean[], values: string[]) => ReactNode);
  onDone?: () => void;
}) {
  const [values, setValues] = useState<string[]>(() => blanks.map(() => ""));
  const [checked, setChecked] = useState(false);
  const stacked = useStackedFractions();
  // Labs with <AnswerFormPick>: a mixedFraction blank starts with the kind
  // buttons; it is filled once a kind is picked and every box it shows has a number.
  const formPick = useAnswerFormPick();
  const formBlank = (b: CfuBlank) => formPick && !!b.mixedFraction;
  const filled = blanks.every((b, i) => (formBlank(b) ? formFilled(formOfMixed(values[i]), splitMixed(values[i])) : allFilled(values[i])));
  const oks = blanks.map((b, i) => (b.options ? values[i] === b.correct : typedOk(b, values[i])));
  const ok = oks.every(Boolean);
  const done = checked && filled && ok;
  // Wrong kinds after a Check, for the feedback sentence.
  const wrongKinds = blanks.filter((b, i) => formBlank(b) && !formOk(b, values[i])).length;
  const kindLine = !blanks.some(formBlank)
    ? ""
    : wrongKinds === 1
      ? " One format is not right. Look at the red button."
      : wrongKinds > 1
        ? ` ${wrongKinds} formats are not right. Look at the red buttons.`
        : blanks.some((b, i) => formBlank(b) && !oks[i])
          ? " Every format you picked is right. Check the numbers."
          : "";

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  const set = (i: number, v: string) => {
    setValues((all) => all.map((x, k) => (k === i ? v : x)));
    setChecked(false);
  };

  const typedBox = (i: number, b: CfuBlank, value: string, onChange: (v: string) => void, label: string, extraClass = "", width = b.width ?? 70, showMark = checked) => (
    <input
      key={`${i}-${label}`}
      className={`answer cfu-typed${extraClass}`}
      inputMode="text"
      autoComplete="off"
      aria-label={label}
      value={value}
      disabled={done}
      style={{ width, ...answerBorder(oks[i], showMark) }}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && filled) setChecked(true);
      }}
    />
  );

  const boxes = blanks.map((b, i) =>
    b.options && stacked && b.options.some(hasFraction) ? (
      // A native dropdown can't draw a stacked fraction, so labs with
      // <StackedFractions> get tap buttons for fraction options.
      <TapSelect key={i} aria-label={b.label} value={values[i]} style={answerBorder(oks[i], checked)} onChange={(e) => {
          if (!done) set(i, e.target.value);
        }}>
        {b.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </TapSelect>
    ) : b.options ? (
      <select key={i} className="answer" aria-label={b.label} value={values[i]} disabled={done} style={answerBorder(oks[i], checked)} onChange={(e) => set(i, e.target.value)}>
        <option value="" disabled>
          choose
        </option>
        {b.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    ) : formBlank(b) ? (
      (() => {
        const form = formOfMixed(values[i]);
        const [w, n, d] = splitMixed(values[i]);
        const show = form ? formBoxes(form) : [false, false, false];
        const part = (k: 0 | 1 | 2) => (v: string) => {
          const next = [w, n, d];
          next[k] = v;
          set(i, joinMixed(next[0], next[1], next[2], form));
        };
        const pick = (f: AnswerForm) => {
          if (done) return;
          const [a, t, u] = keepFitting([w, n, d], f);
          set(i, joinMixed(a, t, u, f));
        };
        const marked = checked && filled;
        const kindOk = formOk(b, values[i]);
        // A wrong kind marks only the kind button; the boxes are marked once the kind is right.
        return (
          <span key={i} className="cfu-form" role="group" aria-label={b.label}>
            <FormPicker compact value={form} onPick={pick} disabled={done} mark={marked ? (kindOk ? "good" : "bad") : undefined} label={`${b.label}: format`} />
            {form && (
              <span className="cfu-mixed">
                {show[0] && typedBox(i, b, w, part(0), `${b.label}: whole number`, " cfu-mixed-whole", 48, marked && kindOk)}
                {show[1] && (
                  <span className="cfu-mixed-stack">
                    {typedBox(i, b, n, part(1), `${b.label}: top`, "", 48, marked && kindOk)}
                    <span className="cfu-mixed-bar" aria-hidden />
                    {typedBox(i, b, d, part(2), `${b.label}: bottom`, "", 48, marked && kindOk)}
                  </span>
                )}
              </span>
            )}
          </span>
        );
      })()
    ) : b.mixedFraction ? (
      (() => {
        const [w, n, d] = splitMixed(values[i]);
        const part = (k: 0 | 1 | 2) => (v: string) => {
          const next = [w, n, d];
          next[k] = v;
          set(i, joinMixed(next[0], next[1], next[2]));
        };
        return (
          <span key={i} className="cfu-mixed" role="group" aria-label={b.label}>
            {typedBox(i, b, w, part(0), `${b.label}: whole number`, " cfu-mixed-whole", 48)}
            <span className="cfu-mixed-stack">
              {typedBox(i, b, n, part(1), `${b.label}: top`, "", 48)}
              <span className="cfu-mixed-bar" aria-hidden />
              {typedBox(i, b, d, part(2), `${b.label}: bottom`, "", 48)}
            </span>
          </span>
        );
      })()
    ) : (
      <input
        key={i}
        className="answer cfu-typed"
        inputMode="text"
        autoComplete="off"
        aria-label={b.label}
        value={values[i]}
        disabled={done}
        style={{ width: b.width ?? 70, ...answerBorder(oks[i], checked) }}
        onChange={(e) => set(i, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && filled) setChecked(true);
        }}
      />
    )
  );

  return (
    <>
      <div className="cfu-line">
        <MathText>{render(boxes)}</MathText>
      </div>
      <div className="control-row" style={{ marginTop: 8 }}>
        <button className="btn primary" type="button" disabled={!filled || done} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && filled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          <MathText>{ok ? good : typeof bad === "function" ? bad(oks, values) : bad}</MathText>
          {!ok && kindLine}
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
