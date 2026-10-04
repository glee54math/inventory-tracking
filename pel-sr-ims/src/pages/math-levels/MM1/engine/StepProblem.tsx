import React, { useEffect, useRef, useState } from "react";
import type { Problem, Step } from "./types";
import { fmt, numbersMatch, parseAnswer } from "../lib/math";

interface StepState {
  inputs: string[]; // one entry for number/choice, two for ratio
  wrong: number;
  hint: boolean;
  revealed: boolean;
  feedback: string | null;
}

const fresh = (): StepState => ({ inputs: ["", ""], wrong: 0, hint: false, revealed: false, feedback: null });

const answerText = (s: Step): string => {
  if (s.kind === "number") return `${s.prefix ?? ""}${fmt(s.answer)}${s.suffix ? " " + s.suffix : ""}`;
  if (s.kind === "ratio") return `${s.answer[0]} : ${s.answer[1]}`;
  return s.choices[s.correct];
};

/** Check one step. Returns null when right, or a targeted message when wrong. */
const check = (s: Step, inputs: string[]): { ok: boolean; msg: string } => {
  if (s.kind === "choice") {
    return Number(inputs[0]) === s.correct ? { ok: true, msg: "" } : { ok: false, msg: "Not that one. Reread each choice and test it against the picture." };
  }
  if (s.kind === "number") {
    const v = parseAnswer(inputs[0]);
    if (v === null) return { ok: false, msg: "Type a number, like 12, 2.5 or 3/4." };
    if (numbersMatch(v, s.answer)) return { ok: true, msg: "" };
    if (s.answer !== 0 && numbersMatch(v, 1 / s.answer)) return { ok: false, msg: "That's the flip of the answer. Check which quantity you divided by which." };
    if (numbersMatch(v * 10, s.answer) || numbersMatch(v / 10, s.answer)) return { ok: false, msg: "Close: the digits are right but the size is off by a factor of 10." };
    return { ok: false, msg: "Not yet. Look at the diagram and try again." };
  }
  const a = parseAnswer(inputs[0]);
  const b = parseAnswer(inputs[1]);
  if (a === null || b === null) return { ok: false, msg: "Fill in both boxes with numbers." };
  const [x, y] = s.answer;
  if (numbersMatch(a, x) && numbersMatch(b, y)) return { ok: true, msg: "" };
  if (s.equivalent && b !== 0 && numbersMatch(a / b, x / y)) return { ok: true, msg: "" };
  if (numbersMatch(a, y) && numbersMatch(b, x)) return { ok: false, msg: "Order matters in a ratio. Your numbers are switched." };
  if (!s.equivalent && b !== 0 && numbersMatch(a / b, x / y)) return { ok: false, msg: "That ratio is equivalent, but this step asks for these exact numbers." };
  return { ok: false, msg: "Not yet. Count each quantity again." };
};

export interface StepProblemProps {
  problem: Problem;
  /** Called once when the last step is finished. `clean` = no revealed answers and at most one hint. */
  onComplete?: (clean: boolean) => void;
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
    if (current > 0) activeRef.current?.querySelector<HTMLElement>("input, button.choice")?.focus({ preventScroll: true });
  }, [current]);

  useEffect(() => {
    if (finished && !reported.current) {
      reported.current = true;
      const hints = states.filter((s) => s.hint).length;
      const reveals = states.filter((s) => s.revealed).length;
      onComplete?.(reveals === 0 && hints <= 1);
    }
  }, [finished, states, onComplete]);

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
                        {step.kind !== "choice" && (
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

function StepInput({ step, state, onChange, onSubmit }: { step: Step; state: StepState; onChange: (v: string[]) => void; onSubmit: (v: string[]) => void }) {
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
  if (step.kind === "number") {
    return (
      <div className="answer-row">
        {step.prefix && <span className="affix">{step.prefix}</span>}
        <input
          className="answer"
          inputMode="decimal"
          autoComplete="off"
          aria-label="Your answer"
          value={state.inputs[0]}
          onChange={(e) => onChange([e.target.value, ""])}
          onKeyDown={enter}
        />
        {step.suffix && <span className="affix">{step.suffix}</span>}
      </div>
    );
  }
  const [before, mid, after] = step.frame ?? ["", ":", ""];
  return (
    <div className="answer-row ratio-row">
      {before && <span className="affix">{before}</span>}
      <label className="ratio-box qa">
        <input className="answer" inputMode="decimal" autoComplete="off" value={state.inputs[0]} aria-label={step.labels?.[0] ?? "first number"} onChange={(e) => onChange([e.target.value, state.inputs[1]])} onKeyDown={enter} />
        {step.labels && <small>{step.labels[0]}</small>}
      </label>
      <span className="affix colon">{mid}</span>
      <label className="ratio-box qb">
        <input className="answer" inputMode="decimal" autoComplete="off" value={state.inputs[1]} aria-label={step.labels?.[1] ?? "second number"} onChange={(e) => onChange([state.inputs[0], e.target.value])} onKeyDown={enter} />
        {step.labels && <small>{step.labels[1]}</small>}
      </label>
      {after && <span className="affix">{after}</span>}
    </div>
  );
}
