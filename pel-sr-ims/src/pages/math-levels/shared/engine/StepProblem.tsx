import React, { useEffect, useRef, useState } from "react";
import type { Problem, SentenceBlank, Step } from "./types";
import { fmt, fracText, gcd, numbersMatch, parseAnswer, rawFraction, verticalMultiplyBreakdown } from "../lib/math";

/** Exported so the end-of-unit test (engine/UnitTest.tsx) can type its own
 *  per-question answer state the same shape StepInput expects. */
export interface StepState {
  inputs: string[]; // one entry for number/choice, two for ratio
  wrong: number;
  hint: boolean;
  revealed: boolean;
  feedback: string | null;
}

export const fresh = (): StepState => ({ inputs: ["", ""], wrong: 0, hint: false, revealed: false, feedback: null });

/** Formats a step's canonical answer for display. Exported for reuse on the
 *  end-of-unit test's results review screen — see engine/UnitTest.tsx. */
export const answerText = (s: Step): string => {
  if (s.kind === "number") {
    if (s.frac && s.fracAnswer) return `${s.prefix ?? ""}${fracText(s.fracAnswer[0], s.fracAnswer[1])}${s.suffix ? " " + s.suffix : ""}`;
    const val = s.padTo !== undefined ? s.answer.toFixed(s.padTo) : s.money ? (s.answer % 1 ? s.answer.toFixed(2) : String(s.answer)) : fmt(s.answer);
    return `${s.prefix ?? ""}${val}${s.suffix ? " " + s.suffix : ""}`;
  }
  if (s.kind === "ratio") return `${s.answer[0]} : ${s.answer[1]}`;
  if (s.kind === "sentence") {
    return `${s.parts[0]}${sentenceBlankText(s.blanks[0])}${s.parts[1]}${sentenceBlankText(s.blanks[1])}${s.parts[2]}`;
  }
  if (s.kind === "fracMultiply") {
    let i = 0;
    const [ln, ld, rn, rd] = [s.leftNum, s.leftDen, s.rightNum, s.rightDen].map((v) => v ?? s.answer[i++]);
    return `${ln}/${ld} × ${rn}/${rd}`;
  }
  if (s.kind === "verticalMultiply") {
    const { wholeTop, wholeBottom, partials, finalWhole } = verticalMultiplyBreakdown(s.top, s.bottom);
    return `${wholeTop} × ${wholeBottom} = ${partials.join(" + ")} = ${finalWhole}`;
  }
  if (s.kind === "custom") return s.resultText;
  return s.choices[s.correct];
};

/** Formats a SentenceBlank's canonical (correct) answer for display. */
const sentenceBlankText = (b: SentenceBlank): string =>
  b.kind === "select" ? b.choices[b.correct] : b.money ? (b.answer % 1 ? b.answer.toFixed(2) : String(b.answer)) : fmt(b.answer);

/** Grades one SentenceStep blank — a select blank by index, a number blank
 *  the same way NumberStep.money is graded (same two-decimal-place rule). */
const sentenceBlankOk = (b: SentenceBlank, raw: string): boolean => {
  if (b.kind === "select") return Number(raw) === b.correct;
  const trimmed = b.money ? raw.trim().replace(/^\$/, "") : raw;
  const v = parseAnswer(trimmed);
  if (v === null || !numbersMatch(v, b.answer)) return false;
  if (b.money && b.answer % 1 !== 0 && !/^\d+\.\d{2}$/.test(trimmed)) return false;
  return true;
};

/** Check one step. Returns null when right, or a targeted message when wrong.
 *  Exported for reuse by the end-of-unit test, so test questions are graded
 *  with the exact same logic as practice steps — see engine/UnitTest.tsx. */
export const check = (s: Step, inputs: string[]): { ok: boolean; msg: string } => {
  if (s.kind === "choice") {
    if (inputs[0] === "") return { ok: false, msg: "Pick one of the choices." };
    return Number(inputs[0]) === s.correct ? { ok: true, msg: "" } : { ok: false, msg: "Not that one. Reread each choice and test it against the picture." };
  }
  if (s.kind === "number") {
    const raw = s.money ? inputs[0].trim().replace(/^\$/, "") : inputs[0];
    if (s.fracRequired) {
      // A genuinely whole-number answer doesn't need "fraction form" — a plain
      // number is already as simple as it gets, and nobody would think to type
      // "2/1". Only enforce bare n/d input when the answer is actually non-whole.
      if (s.answer % 1 === 0) {
        const v = parseAnswer(raw);
        if (v === null) return { ok: false, msg: "Type a number, like 12." };
        return numbersMatch(v, s.answer) ? { ok: true, msg: "" } : { ok: false, msg: "Not yet. Look at the diagram and try again." };
      }
      const typed = rawFraction(raw.trim());
      if (!typed) return { ok: false, msg: "Write this as a fraction (like 1/3), not a decimal." };
      const v = typed[0] / typed[1];
      if (!numbersMatch(v, s.answer)) return { ok: false, msg: "Not yet. Look at the diagram and try again." };
      if (gcd(typed[0], typed[1]) !== 1) {
        return { ok: false, msg: `That's the right value, but it needs to be in lowest terms — try ${fracText(typed[0], typed[1])}.` };
      }
      return { ok: true, msg: "" };
    }
    const v = parseAnswer(raw);
    if (v === null) return { ok: false, msg: s.money ? "Type a dollar amount, like 4.50." : s.frac ? "Type a number or a fraction, like 3/4." : "Type a number, like 12, 2.5 or 3/4." };
    if (numbersMatch(v, s.answer)) {
      if (s.money && s.answer % 1 !== 0 && !/^\d+\.\d{2}$/.test(raw)) {
        return { ok: false, msg: `That's the right amount, but money answers need exactly two decimal places — write it like $${v.toFixed(2)}.` };
      }
      if (s.padTo !== undefined) {
        const digitsAfterPoint = raw.includes(".") ? raw.split(".")[1].length : 0;
        if (digitsAfterPoint !== s.padTo) {
          return { ok: false, msg: `That's the right value, but it needs exactly ${s.padTo} decimal place${s.padTo === 1 ? "" : "s"} — write it like ${v.toFixed(s.padTo)}.` };
        }
      }
      if (s.frac) {
        const typed = rawFraction(raw.trim());
        if (typed && gcd(typed[0], typed[1]) !== 1) {
          return { ok: false, msg: `That's the right value, but fractions need to be written in lowest terms — try ${fracText(typed[0], typed[1])}.` };
        }
      }
      return { ok: true, msg: "" };
    }
    if (s.answer !== 0 && numbersMatch(v, 1 / s.answer)) return { ok: false, msg: "That's the flip of the answer. Check which quantity you divided by which." };
    if (numbersMatch(v * 10, s.answer) || numbersMatch(v / 10, s.answer)) return { ok: false, msg: "Close: the digits are right but the size is off by a factor of 10." };
    return { ok: false, msg: "Not yet. Look at the diagram and try again." };
  }
  if (s.kind === "sentence") {
    if (inputs[0] === "" || inputs[1] === "") return { ok: false, msg: "Fill in both blanks." };
    const ok = sentenceBlankOk(s.blanks[0], inputs[0]) && sentenceBlankOk(s.blanks[1], inputs[1]);
    return ok ? { ok: true, msg: "" } : { ok: false, msg: "One of the blanks isn't right yet — check both against the problem." };
  }
  if (s.kind === "fracMultiply") {
    const n = s.answer.length;
    const vals = inputs.slice(0, n).map(parseAnswer);
    if (vals.some((v) => v === null)) return { ok: false, msg: n === 1 ? "Fill in the box with a number." : "Fill in both boxes with numbers." };
    const ok = vals.every((v, i) => numbersMatch(v as number, s.answer[i]));
    return ok ? { ok: true, msg: "" } : { ok: false, msg: "Not yet. Check your cancelling and try again." };
  }
  if (s.kind === "verticalMultiply") {
    const { partials, finalWhole } = verticalMultiplyBreakdown(s.top, s.bottom);
    const expectedDigits = [...partials, finalWhole].flatMap((n) => String(n).split(""));
    const typed = inputs.slice(0, expectedDigits.length);
    if (typed.some((v) => v.trim() === "")) return { ok: false, msg: "Fill in every digit box." };
    const ok = typed.every((v, i) => v.trim() === expectedDigits[i]);
    return ok ? { ok: true, msg: "" } : { ok: false, msg: "Not yet. Check each partial product, then add them up for the final answer." };
  }
  // Grading already happened inside the widget itself — it only ever calls
  // onDone (which submits this step) once every one of its own digits is
  // confirmed correct, so by the time we get here there's nothing left to check.
  if (s.kind === "custom") return { ok: true, msg: "" };
  const a = parseAnswer(inputs[0]);
  const b = parseAnswer(inputs[1]);
  if (a === null || b === null) return { ok: false, msg: "Fill in both boxes with numbers." };
  const [x, y] = s.answer;
  if (numbersMatch(a, x) && numbersMatch(b, y)) return { ok: true, msg: "" };
  if (s.equivalent && b !== 0 && numbersMatch(a / b, x / y)) return { ok: true, msg: "" };
  if (numbersMatch(a, y) && numbersMatch(b, x)) return { ok: false, msg: "Order matters in a ratio. Your numbers are switched." };
  if (!s.equivalent && b !== 0 && numbersMatch(a / b, x / y)) {
    return {
      ok: false,
      msg: s.equivalentHint ?? "That ratio is equivalent, but this step asks for these exact numbers.",
    };
  }
  return { ok: false, msg: "Not yet. Count each quantity again." };
};

export interface StepProblemProps {
  problem: Problem;
  /**
   * Called once when the last step is finished. `clean` = no revealed
   * answers and at most one hint. `bucket` forwards problem.bucket as-is
   * (undefined for the large majority of problems that don't set one) — see
   * Problem.bucket and UnitProgress.coveredBuckets for what it's for.
   */
  onComplete?: (clean: boolean, bucket?: string) => void;
  onNext?: () => void;
}

export function StepProblem({ problem, onComplete, onNext }: StepProblemProps) {
  const [current, setCurrent] = useState(0);
  const [states, setStates] = useState<StepState[]>(() => problem.steps.map(fresh));
  const reported = useRef(false);
  const activeRef = useRef<HTMLLIElement>(null);
  const finished = current >= problem.steps.length;

  // Note: give this component a new `key` for each new problem so its state resets.

  useEffect(() => {
    // Only auto-focus a plain text input here, never a `button.choice`. When a
    // step advances via Enter (submitting a NumberStep), the browser can still
    // be mid-way through that same physical keypress (e.g. a trailing native
    // keyup) at the moment this effect runs. If the newly-revealed step is a
    // ChoiceStep and we focus its first button, that trailing key event can
    // activate the now-focused button directly — silently "choosing" whichever
    // option happens to render first, with no validation gate, regardless of
    // whether it's correct. A text input has no such native Enter-activation
    // behavior, so it's safe to auto-focus; a button is not.
    if (current > 0) activeRef.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
  }, [current]);

  useEffect(() => {
    if (finished && !reported.current) {
      reported.current = true;
      const hints = states.filter((s) => s.hint).length;
      const reveals = states.filter((s) => s.revealed).length;
      onComplete?.(reveals === 0 && hints <= 1, problem.bucket);
    }
  }, [finished, states, onComplete, problem.bucket]);

  const update = (i: number, patch: Partial<StepState>) => setStates((all) => all.map((s, k) => (k === i ? { ...s, ...patch } : s)));

  const submit = (i: number, inputs = states[i].inputs) => {
    const step = problem.steps[i];
    const res = check(step, inputs);
    if (res.ok) {
      update(i, { inputs, feedback: null });
      setCurrent(i + 1);
    } else {
      const wrong = states[i].wrong + 1;
      update(i, { inputs, wrong, feedback: res.msg, hint: states[i].hint || wrong >= 2 });
    }
  };

  const reveal = (i: number) => {
    update(i, { revealed: true, feedback: null });
    setCurrent(i + 1);
  };

  const hintsUsed = states.filter((s) => s.hint).length;
  const reveals = states.filter((s) => s.revealed).length;

  return (
    <div className="problem">
      <div className="problem-visual" aria-live="polite">
        {problem.visual(current)}
      </div>
      <div className="problem-work">
        <div className="story">
          <h3>{problem.title}</h3>
          <div>{problem.story}</div>
        </div>

        <ol className="steps">
          {problem.steps.map((step, i) => {
            if (i > current) return null;
            const st = states[i];
            const done = i < current;
            return (
              <li key={i} className={`step ${done ? "done" : "active"}`} ref={i === current ? activeRef : undefined}>
                <div className="step-num" aria-hidden>
                  {done ? "✓" : i + 1}
                </div>
                <div className="step-body">
                  <div className="step-prompt">{step.prompt}</div>
                  {done ? (
                    <div className="step-result">
                      <span className={`answer-chip ${st.revealed ? "revealed" : ""}`}>{answerText(step)}</span>
                      <div className="explain">{step.explain}</div>
                    </div>
                  ) : (
                    <>
                      <StepInput step={step} state={st} onChange={(inputs) => update(i, { inputs, feedback: null })} onSubmit={(inputs) => submit(i, inputs)} />
                      {st.feedback && (
                        <p className="feedback bad" role="alert">
                          {st.feedback}
                        </p>
                      )}
                      {st.hint && <p className="hint">💡 {step.hint}</p>}
                      <div className="step-tools">
                        {step.kind !== "choice" && step.kind !== "custom" && (
                          <button className="btn primary" onClick={() => submit(i)}>
                            Check
                          </button>
                        )}
                        {!st.hint && (
                          <button className="btn ghost" onClick={() => update(i, { hint: true })}>
                            Show hint
                          </button>
                        )}
                        {st.wrong >= 3 && (
                          <button className="btn ghost" onClick={() => reveal(i)}>
                            Show answer
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="step-meter" aria-label={`Step ${Math.min(current + 1, problem.steps.length)} of ${problem.steps.length}`}>
          {problem.steps.map((_, i) => (
            <span key={i} className={i < current ? "on" : i === current ? "now" : ""} />
          ))}
        </div>

        {finished && (
          <div className="wrapup" role="status">
            <div className="wrapup-title">{reveals === 0 && hintsUsed <= 1 ? "Solved it! ⭐" : "Solved, with help."}</div>
            <p>{problem.wrapUp}</p>
            {!(reveals === 0 && hintsUsed <= 1) && <p className="muted">Solve one with at most one hint to earn a mastery star.</p>}
            {onNext && (
              <button className="btn primary" onClick={onNext}>
                Next problem
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** The number/ratio/choice input widget for one step. Exported for reuse by
 *  the end-of-unit test — see engine/UnitTest.tsx. StepState is also exported
 *  so a caller outside this file can type its own per-question answer state. */
export function StepInput({ step, state, onChange, onSubmit }: { step: Step; state: StepState; onChange: (v: string[]) => void; onSubmit: (v: string[]) => void }) {
  const enter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSubmit(state.inputs);
  };
  if (step.kind === "choice") {
    return (
      <div className="choices" role="group">
        {step.choices.map((c, k) => (
          <button key={k} className="choice" onClick={() => onSubmit([String(k), ""])}>
            {c}
          </button>
        ))}
      </div>
    );
  }
  if (step.kind === "custom") {
    return <div className="custom-step">{step.render(() => onSubmit(["done"]))}</div>;
  }
  if (step.kind === "sentence") {
    const renderBlank = (i: 0 | 1) => {
      const b = step.blanks[i];
      const val = state.inputs[i];
      const set = (v: string) => onChange(i === 0 ? [v, state.inputs[1]] : [state.inputs[0], v]);
      if (b.kind === "select") {
        return (
          <select className="sentence-select" aria-label={i === 0 ? "First blank" : "Second blank"} value={val} onChange={(e) => set(e.target.value)}>
            <option value="" disabled>
              choose
            </option>
            {b.choices.map((c, k) => (
              <option key={k} value={k}>
                {c}
              </option>
            ))}
          </select>
        );
      }
      return (
        <span className="sentence-number">
          <input
            className="answer sentence-input-box"
            inputMode="decimal"
            autoComplete="off"
            aria-label={i === 0 ? "First blank" : "Second blank"}
            placeholder={b.money ? "0.00" : undefined}
            value={val}
            onChange={(e) => set(e.target.value)}
            onKeyDown={enter}
          />
        </span>
      );
    };
    return (
      <div className="answer-row sentence-input">
        <span>{step.parts[0]}</span>
        {renderBlank(0)}
        <span>{step.parts[1]}</span>
        {renderBlank(1)}
        <span>{step.parts[2]}</span>
      </div>
    );
  }
  if (step.kind === "number") {
    return (
      <div className="answer-row">
        {step.prefix && <span className="affix">{step.prefix}</span>}
        <input
          className="answer"
          inputMode="decimal"
          autoComplete="off"
          aria-label="Your answer"
          placeholder={step.money ? "0.00" : step.frac ? "n/d" : undefined}
          value={state.inputs[0]}
          onChange={(e) => onChange([e.target.value, ""])}
          onKeyDown={enter}
        />
        {step.suffix && <span className="affix">{step.suffix}</span>}
      </div>
    );
  }
  if (step.kind === "fracMultiply") {
    const slots = [step.leftNum, step.leftDen, step.rightNum, step.rightDen];
    let next = 0;
    const inputIndex = slots.map((v) => (v === null ? next++ : -1));
    const toneClass = (side: 0 | 1): string => {
      if (!step.tones || step.tones === "none") return "";
      return ` q${step.tones[side]}`;
    };
    const renderSlot = (value: number | null, idx: number, label: string) =>
      value !== null ? (
        <span className="frac-slot-fixed">{value}</span>
      ) : (
        <input
          className="answer frac-slot-input"
          inputMode="decimal"
          autoComplete="off"
          aria-label={label}
          value={state.inputs[idx] ?? ""}
          onChange={(e) => {
            const nextInputs = [...state.inputs];
            nextInputs[idx] = e.target.value;
            onChange(nextInputs);
          }}
          onKeyDown={enter}
        />
      );
    return (
      <div className="answer-row frac-multiply-row">
        <span className={`frac-slot-pair${toneClass(0)}`}>
          {renderSlot(step.leftNum, inputIndex[0], "first fraction's numerator")}
          <span className="frac-slot-bar" />
          {renderSlot(step.leftDen, inputIndex[1], "first fraction's denominator")}
        </span>
        <span className="affix colon">×</span>
        <span className={`frac-slot-pair${toneClass(1)}`}>
          {renderSlot(step.rightNum, inputIndex[2], "second fraction's numerator")}
          <span className="frac-slot-bar" />
          {renderSlot(step.rightDen, inputIndex[3], "second fraction's denominator")}
        </span>
      </div>
    );
  }
  if (step.kind === "verticalMultiply") {
    const { wholeTop, wholeBottom, partials, finalWhole } = verticalMultiplyBreakdown(step.top, step.bottom);
    const width = String(finalWhole).length;
    const ruleWidth = { width: `${width * 1.1}em` };
    let idx = 0;
    const renderRow = (value: number, key: string) => (
      <div className="align-row" key={key}>
        {String(value)
          .padStart(width, " ")
          .split("")
          .map((ch, i) => {
            if (ch === " ") return <span key={i} className="align-slot align-slot-static" />;
            const myIdx = idx++;
            return (
              <input
                key={i}
                className="align-slot align-slot-input"
                inputMode="numeric"
                maxLength={1}
                autoComplete="off"
                aria-label={`digit ${myIdx + 1}`}
                value={state.inputs[myIdx] ?? ""}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "").slice(-1);
                  const next = [...state.inputs];
                  next[myIdx] = v;
                  onChange(next);
                }}
                onKeyDown={enter}
              />
            );
          })}
      </div>
    );
    const hasDecimalPoint = step.top % 1 !== 0 || step.bottom % 1 !== 0;
    return (
      <div className="vmult-stack">
        <div className="vmult-row vmult-given">{step.top}</div>
        <div className="vmult-row vmult-given">
          <span className="vmult-op">×</span> {step.bottom}
        </div>
        <div className="vmult-rule" style={ruleWidth} />
        <div className="align-columns">
          {partials.map((p, i) => renderRow(p, `p${i}`))}
          <div className="align-rule" style={ruleWidth} />
          {renderRow(finalWhole, "sum")}
        </div>
        {hasDecimalPoint && (
          <p className="muted small" style={{ margin: "6px 0 0" }}>
            {wholeTop} × {wholeBottom} ignoring the decimal points for now.
          </p>
        )}
      </div>
    );
  }
  const [before, mid, after] = step.frame ?? ["", ":", ""];
  const boxClass = (i: 0 | 1): string => {
    if (step.tones === "none") return "ratio-box";
    const tones = step.tones ?? ["a", "b"];
    return `ratio-box q${tones[i]}`;
  };
  return (
    <div className="answer-row ratio-row">
      {before && <span className="affix">{before}</span>}
      <label className={boxClass(0)}>
        <input className="answer" inputMode="decimal" autoComplete="off" value={state.inputs[0]} aria-label={step.labels?.[0] ?? "first number"} onChange={(e) => onChange([e.target.value, state.inputs[1]])} onKeyDown={enter} />
        {step.labels && <small>{step.labels[0]}</small>}
      </label>
      <span className="affix colon">{mid}</span>
      <label className={boxClass(1)}>
        <input className="answer" inputMode="decimal" autoComplete="off" value={state.inputs[1]} aria-label={step.labels?.[1] ?? "second number"} onChange={(e) => onChange([state.inputs[0], e.target.value])} onKeyDown={enter} />
        {step.labels && <small>{step.labels[1]}</small>}
      </label>
      {after && <span className="affix">{after}</span>}
    </div>
  );
}
