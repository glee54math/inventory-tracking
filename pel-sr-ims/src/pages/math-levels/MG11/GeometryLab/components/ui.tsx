// components/ui.tsx — shared interactive pieces.
import React, { useEffect, useRef, useState } from "react";
import { approxEq, fmt, parseNumber, toFraction } from "../lib/math";

/* ---------- Fraction display ---------- */
export function Num({ value }: { value: number }) {
  const f = toFraction(value);
  if (!f || f.num === 0) return <span className="num">{fmt(value)}</span>;
  return (
    <span className="num">
      {f.neg ? "−" : ""}
      {f.whole ? f.whole : ""}
      <span className="frac"><span>{f.num}</span><span>{f.den}</span></span>
    </span>
  );
}

/* ---------- Step-by-step solver ---------- */
export type Step = {
  /** The question for this step. */
  prompt: React.ReactNode;
  /**
   * Number for typed answers, or the correct choice text for multiple choice.
   * When `blanks` is set, this is still the canonical result (e.g. the area)
   * recorded for the step-result display — grading itself checks the three
   * blanks instead of this field.
   */
  answer: number | string;
  choices?: string[];
  unit?: string;
  hint?: React.ReactNode;
  /** Shown after the step is solved — the "why". */
  explain?: React.ReactNode;
  /** Part ids the figure should highlight during this step. */
  focus?: string[];
  /** Targeted feedback for common wrong answers. */
  mistakes?: { value: number | string; msg: string }[];
  /**
   * Ask for three numbers inline instead of one typed answer — "½ × __ × __
   * = __" for a triangle's base, height, and area — so the student supplies
   * the formula's inputs AND works out the result themselves, instead of
   * multiplying numbers the prompt already handed them. `values` is
   * [base, height, result]; `labels` names each box for its aria-label and
   * the small caption under it. Mutually exclusive with `choices`.
   */
  blanks?: { prefix: string; labels: [string, string, string]; values: [number, number, number] };
};

type Feedback = { kind: "ok" | "bad" | "hint"; msg: React.ReactNode } | null;

function guessMistake(step: Step, given: number): string | null {
  if (typeof step.answer !== "number") return null;
  const a = step.answer;
  if (a !== 0 && approxEq(given, a * 2)) return "That's double the answer. Is there a half (÷ 2) in this step?";
  if (a !== 0 && approxEq(given, a / 2)) return "That's exactly half of the answer. Did you divide by 2 when you didn't need to?";
  if (approxEq(given, -a)) return "Right size, wrong sign. Lengths and areas are never negative.";
  return null;
}

export function StepSolver({ steps, onStepChange, onComplete, onNext, nextLabel = "New problem" }: {
  steps: Step[];
  onStepChange?: (index: number) => void;
  /** `clean` = no "Show me the answer" reveals and at most 1 hint used across the whole problem. */
  onComplete?: (clean: boolean) => void;
  onNext?: () => void;
  nextLabel?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [blankVals, setBlankVals] = useState(["", "", ""]);
  const [misses, setMisses] = useState(0);
  const [fb, setFb] = useState<Feedback>(null);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  // Cumulative across the whole problem (unlike `misses`, which resets per step) — used to
  // compute `clean` for mastery-star tracking. Refs, not state: nothing renders off these
  // directly, and advance()/reveal() need the up-to-the-instant count (a same-tick setState
  // read would still see the pre-update value here). hintShownThisStep guards against one
  // step's Hint button being clicked more than once inflating the count.
  const hintsUsed = useRef(0);
  const hintShownThisStep = useRef(false);
  const revealsUsed = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const done = idx >= steps.length;

  useEffect(() => { onStepChange?.(idx); }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!done) inputRef.current?.focus({ preventScroll: true }); }, [idx, done]);

  const advance = (given: string | number) => {
    setAnswers((a) => [...a, given]);
    setFb(null); setValue(""); setBlankVals(["", "", ""]); setMisses(0); hintShownThisStep.current = false;
    const next = idx + 1;
    setIdx(next);
    if (next >= steps.length) onComplete?.(revealsUsed.current === 0 && hintsUsed.current <= 1);
  };

  const showHint = (hint: React.ReactNode) => {
    if (!hintShownThisStep.current) {
      hintShownThisStep.current = true;
      hintsUsed.current += 1;
    }
    setFb({ kind: "hint", msg: hint });
  };

  const reveal = (answer: number | string) => {
    revealsUsed.current += 1;
    setFb(null);
    advance(answer);
  };

  const check = (raw: string) => {
    const step = steps[idx];
    if (typeof step.answer === "string") {
      if (raw === step.answer) return advance(raw);
      const m = step.mistakes?.find((x) => x.value === raw);
      setMisses((n) => n + 1);
      return setFb({ kind: "bad", msg: m?.msg ?? "Not that one. Look at the picture again." });
    }
    const n = parseNumber(raw);
    if (Number.isNaN(n)) return setFb({ kind: "bad", msg: "Type a number, like 12, 7.5, 3/4 or 1 1/2." });
    if (approxEq(n, step.answer)) return advance(step.answer);
    const m = step.mistakes?.find((x) => typeof x.value === "number" && approxEq(x.value, n));
    setMisses((k) => k + 1);
    setFb({ kind: "bad", msg: m?.msg ?? guessMistake(step, n) ?? "Not quite. Check your arithmetic, or tap Hint." });
  };

  const checkBlanks = () => {
    const step = steps[idx];
    if (!step.blanks) return;
    const vals = blankVals.map(parseNumber);
    if (vals.some(Number.isNaN)) return setFb({ kind: "bad", msg: "Fill in all three boxes with numbers." });
    const targets = step.blanks.values;
    if (vals.every((v, i) => approxEq(v, targets[i]))) return advance(step.answer);
    setMisses((n) => n + 1);
    const bad = targets.map((t, i) => !approxEq(vals[i], t));
    const badCount = bad.filter(Boolean).length;
    const msg =
      badCount >= 2
        ? "More than one of these isn't right yet. Check them against the picture."
        : `The ${step.blanks.labels[bad.indexOf(true)]} isn't right yet.`;
    setFb({ kind: "bad", msg });
  };

  return (
    <div className="solver">
      <ol className="steps">
        {steps.map((s, i) => {
          if (i > idx) return null;
          const solved = i < idx;
          return (
            <li key={i} className={solved ? "step solved" : "step current"}>
              <div className="step-num" aria-hidden="true">{solved ? "✓" : i + 1}</div>
              <div className="step-body">
                <div className="step-prompt">{s.prompt}</div>
                {solved && (
                  <div className="step-result">
                    <strong>{typeof answers[i] === "number" ? <Num value={answers[i] as number} /> : answers[i]}</strong>
                    {s.unit ? <span className="unit"> {s.unit}</span> : null}
                    {s.explain && <div className="explain">{s.explain}</div>}
                  </div>
                )}
                {!solved && !done && (
                  <>
                    {s.blanks ? (() => {
                      const blanks = s.blanks!;
                      return (
                        <div className="answer-row blanks-row">
                          <div className="blanks-equation">
                            {blanks.prefix && <span className="unit">{blanks.prefix}</span>}
                            {([0, 1, 2] as const).map((k) => (
                              <React.Fragment key={k}>
                                {k > 0 && <span className="unit">{k === 2 ? "=" : "×"}</span>}
                                <label className="blank-box">
                                  <input
                                    ref={k === 0 ? inputRef : undefined}
                                    className="answer"
                                    value={blankVals[k]}
                                    onChange={(e) => setBlankVals((vals) => vals.map((v, i) => (i === k ? e.target.value : v)))}
                                    onKeyDown={(e) => { if (e.key === "Enter") checkBlanks(); }}
                                    inputMode="text"
                                    autoComplete="off"
                                    aria-label={blanks.labels[k]}
                                  />
                                  <small>{blanks.labels[k]}</small>
                                </label>
                              </React.Fragment>
                            ))}
                            {s.unit && <span className="unit">{s.unit}</span>}
                          </div>
                          <button className="btn primary" onClick={checkBlanks}>Check</button>
                        </div>
                      );
                    })() : s.choices ? (
                      <div className="choices">
                        {s.choices.map((c) => (
                          <button key={c} className="choice" onClick={() => check(c)}>{c}</button>
                        ))}
                      </div>
                    ) : (
                      <div className="answer-row">
                        <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") check(value); }}
                          inputMode="text" autoComplete="off" aria-label="Your answer" placeholder="Your answer" />
                        {s.unit && <span className="unit">{s.unit}</span>}
                        <button className="btn primary" onClick={() => check(value)}>Check</button>
                      </div>
                    )}
                    <div className="step-tools">
                      {s.hint && <button className="link" onClick={() => showHint(s.hint)}>Hint</button>}
                      {misses >= 2 && (
                        <button className="link" onClick={() => reveal(s.answer)}>Show me the answer</button>
                      )}
                    </div>
                    {fb && <div className={"feedback " + fb.kind} role="status">{fb.msg}</div>}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {done && (
        <div className="done-banner" role="status">
          <span className="done-mark" aria-hidden="true">★</span>
          <div>
            <strong>Solved!</strong>
            <div>Every step checks out.</div>
          </div>
          {onNext && <button className="btn primary" onClick={onNext}>{nextLabel}</button>}
        </div>
      )}
    </div>
  );
}

/** An n-of-max mastery star row. Used both for tab-level progress (max 5, the
 *  sitewide convention) and Area's per-shape progress (max 3, see Area.tsx). */
export function Stars({ n, max, size = "sm", label }: { n: number; max: number; size?: "sm" | "lg"; label: string }) {
  const filled = Math.min(max, n);
  return (
    <span className={`stars ${size}`} aria-label={label}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < filled ? "on" : ""} aria-hidden>★</span>
      ))}
    </span>
  );
}

/* ---------- Controls ---------- */
export function Slider({ label, value, min, max, step = 1, onChange, display }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; display?: React.ReactNode;
}) {
  return (
    <label className="slider">
      <span className="slider-label">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
      <span className="slider-value">{display ?? <Num value={value} />}</span>
    </label>
  );
}

export function Segmented<T extends string>({ options, value, onChange, label }: {
  options: { id: T; label: React.ReactNode }[]; value: T; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={value === o.id} className={value === o.id ? "on" : ""} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className={"toggle" + (on ? " on" : "")} aria-pressed={on} onClick={() => onChange(!on)}>
      <span className="toggle-track"><span className="toggle-knob" /></span>
      {label}
    </button>
  );
}

/** Two-panel layout used by every module: figure board on the left, controls/steps on the right. */
export function Workbench({ figure, children, caption }: { figure: React.ReactNode; children: React.ReactNode; caption?: React.ReactNode }) {
  return (
    <div className="workbench">
      <div className="board">
        <div className="board-figure">{figure}</div>
        {caption && <div className="board-caption">{caption}</div>}
      </div>
      <div className="panel">{children}</div>
    </div>
  );
}
