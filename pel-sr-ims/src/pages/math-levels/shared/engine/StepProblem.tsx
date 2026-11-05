import React, { useEffect, useId, useRef, useState } from "react";
import { autoRead, ReadAloud } from "../tts/ReadAloud";
import { getState, sayText, stopIfPlaying } from "../tts/speechEngine";
import { tappedList, type Problem, type SentenceBlank, type Step, type TapCountStep, type VisualHelp } from "./types";
import { fmt, fracText, gcd, numbersMatch, parseAnswer, rawFraction, verticalMultiplyBreakdown } from "../lib/math";
import { numberPadProps, useEarlyLearner } from "./audience";
import { InlineNumberPad } from "../components/NumberPad";

/** Exported so the end-of-unit test (engine/UnitTest.tsx) can type its own
 *  per-question answer state the same shape StepInput expects. */
export interface StepState {
  inputs: string[]; // one entry for number/choice, two for ratio
  wrong: number;
  hint: boolean;
  revealed: boolean;
  feedback: string | null;
  /** Early learners: the "Show me" walk-through is open for this step. */
  showMe: boolean;
  /** Choice steps: indexes already picked wrong (early learners can't re-pick them). */
  tried: number[];
}

export const fresh = (): StepState => ({ inputs: ["", ""], wrong: 0, hint: false, revealed: false, feedback: null, showMe: false, tried: [] });

/** Plain-language messages for early learners (K–1): no decimals, fractions or "factor of 10". */
const EARLY_WRONG = "Not yet. Look at the picture and try again.";
const EARLY_WRONG_CHOICE = "Not that one. Look at the picture and try again.";

/** Formats a step's canonical answer for display. Exported for reuse on the
 *  end-of-unit test's results review screen — see engine/UnitTest.tsx. */
export const answerText = (s: Step): string => {
  if (s.kind === "number") {
    if (s.frac && s.fracAnswer) return `${s.prefix ?? ""}${fracText(s.fracAnswer[0], s.fracAnswer[1])}${s.suffix ? " " + s.suffix : ""}`;
    const val = s.padTo !== undefined ? s.answer.toFixed(s.padTo) : s.money ? (s.answer % 1 ? s.answer.toFixed(2) : String(s.answer)) : fmt(s.answer);
    return `${s.prefix ?? ""}${val}${s.suffix ? " " + s.suffix : ""}`;
  }
  if (s.kind === "ratio") return `${s.answer[0]} : ${s.answer[1]}`;
  if (s.kind === "coordinate") return `(${s.answer[0]}, ${s.answer[1]})`;
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
  if (s.kind === "tapCount") return `${s.answer} counter${s.answer === 1 ? "" : "s"}`;
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
export const check = (s: Step, inputs: string[], opts: { early?: boolean } = {}): { ok: boolean; msg: string } => {
  if (s.kind === "choice") {
    if (inputs[0] === "") return { ok: false, msg: "Pick one of the choices." };
    return Number(inputs[0]) === s.correct
      ? { ok: true, msg: "" }
      : { ok: false, msg: opts.early ? EARLY_WRONG_CHOICE : "Not that one. Reread each choice and test it against the picture." };
  }
  if (s.kind === "tapCount") {
    const n = tappedList(inputs[0]).length;
    if (n === s.answer) return { ok: true, msg: "" };
    if (n === 0) return { ok: false, msg: `Tap ${s.answer} counter${s.answer === 1 ? "" : "s"}.` };
    return n < s.answer
      ? { ok: false, msg: `You have ${n}. You need ${s.answer}. Tap more.` }
      : { ok: false, msg: `You have ${n}. That's too many. Tap one to put it back.` };
  }
  if (s.kind === "number" && opts.early && !s.money && !s.frac && s.padTo === undefined) {
    const v = parseAnswer(inputs[0]);
    if (v === null) return { ok: false, msg: "Type a number." };
    return numbersMatch(v, s.answer) ? { ok: true, msg: "" } : { ok: false, msg: EARLY_WRONG };
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
  if (s.kind === "coordinate") {
    const normalized = (inputs[0] ?? "").replace(/\s+/g, "");
    if (normalized === "") return { ok: false, msg: "Type the coordinates, including the parentheses and comma — like (3, -5)." };
    const match = normalized.match(/^\((-?\d+),(-?\d+)\)$/);
    if (!match) return { ok: false, msg: "Don't forget the parentheses and the comma — write it like (3, -5)." };
    const [x, y] = s.answer;
    const a = Number(match[1]);
    const b = Number(match[2]);
    if (numbersMatch(a, x) && numbersMatch(b, y)) return { ok: true, msg: "" };
    if (numbersMatch(a, y) && numbersMatch(b, x)) return { ok: false, msg: "x comes first, then y — your numbers are switched." };
    return { ok: false, msg: "Not yet. Check each number against the marked point." };
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
   * answers, no wrong picks on a multiple-choice step (those can be
   * guessed), and at most one hint. `bucket` forwards problem.bucket as-is
   * (undefined for problems that don't set one) — see Problem.bucket and
   * UnitProgress.coveredBuckets for what it's for.
   */
  onComplete?: (clean: boolean, bucket?: string) => void;
  onNext?: () => void;
  /** Early learners: a new problem of the SAME kind, offered after a solve that needed help. */
  onRetrySame?: () => void;
  /**
   * Called once, the first time this problem stops counting as clean (a
   * reveal, "Show me", a second hint, a wrong pick...), even if the student
   * never finishes it. Lets the lab shell require "Try one like it" even if
   * the student leaves Practice and comes back.
   */
  onHelped?: () => void;
}

/**
 * Help ladder.
 *   Everyone: a wrong answer shows feedback and pulses the picture ("look here").
 *   Early learners (EarlyLearnerProvider): the hint opens on the first wrong
 *   try; after two wrong tries "Show me" walks through that step (the picture
 *   fills in and the explanation is read aloud); a solve that needed help ends
 *   with "Try one like it". Everyone else: the hint opens on the second wrong
 *   try and "Show answer" appears on the third.
 */
export function StepProblem({ problem, onComplete, onNext, onRetrySame, onHelped }: StepProblemProps) {
  const early = useEarlyLearner();
  const [current, setCurrent] = useState(0);
  const [states, setStates] = useState<StepState[]>(() => problem.steps.map(fresh));
  const reported = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);
  // Read-aloud: the active step's icon reads its prompt, answer choices and buttons together.
  const inputRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const readerId = useId();
  const finished = current >= problem.steps.length;
  const cur = finished ? null : states[current];
  // Optional pause before "Show me"'s "Got it" works (see Step.showMeHoldMs).
  const showMeHoldMs = cur?.showMe ? problem.steps[current].showMeHoldMs : undefined;
  const [showMeReady, setShowMeReady] = useState<number | null>(null);
  const showMeHolding = !!showMeHoldMs && showMeReady !== current;
  useEffect(() => {
    if (!showMeHoldMs) return;
    const t = window.setTimeout(() => setShowMeReady(current), showMeHoldMs);
    return () => window.clearTimeout(t);
  }, [showMeHoldMs, current]);
  // Optional pause before the wrap-up buttons work (see Problem.wrapUpHoldMs).
  const [holdOver, setHoldOver] = useState(false);
  const holding = finished && !!problem.wrapUpHoldMs && !holdOver;
  useEffect(() => {
    if (!finished || !problem.wrapUpHoldMs) return;
    const t = window.setTimeout(() => setHoldOver(true), problem.wrapUpHoldMs);
    return () => window.clearTimeout(t);
  }, [finished, problem.wrapUpHoldMs]);

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
    // behavior, so it's safe to auto-focus; a button is not. Early learners
    // also get the first step focused, so the number pad is ready to tap.
    if (current > 0 || early) activeRef.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
  }, [current, early]);

  // Auto-read (when the student turned sound on): a new question, then
  // feedback + hint after a wrong try, the hint when asked for, the "Show me"
  // walk-through, and the wrap-up. Otherwise just stop the old reading.
  const prev = useRef<{ current: number; wrong: number; hint: boolean; showMe: boolean } | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    const q = (sel: string) => root?.querySelector(sel) ?? null;
    const now = { current, wrong: cur?.wrong ?? 0, hint: cur?.hint ?? false, showMe: cur?.showMe ?? false };
    const before = prev.current;
    prev.current = now;
    if (finished) return autoRead(readerId, [q(".wrapup")]);
    if (!before || before.current !== current) {
      stopIfPlaying();
      const step = problem.steps[current];
      return autoRead(readerId, [current === 0 ? q(".story") : null, q(".step.active .step-prompt"), step.kind === "choice" ? q(".step.active .choices") : null]);
    }
    if (now.showMe && !before.showMe) return autoRead(readerId, [q(".step.active .show-me")]);
    if (now.wrong > before.wrong) return autoRead(readerId, [q(".step.active .feedback"), q(".step.active .hint")]);
    if (now.hint && !before.hint) return autoRead(readerId, [q(".step.active .hint")]);
  }, [current, finished, cur?.wrong, cur?.hint, cur?.showMe, problem, readerId]);

  const isClean = (all: StepState[]) => {
    const hints = all.filter((s) => s.hint).length;
    const reveals = all.filter((s) => s.revealed).length;
    const guessed = all.some((s, k) => problem.steps[k].kind === "choice" && s.wrong > 0);
    // Early learners: two wrong tries on any step is trial and error, not a solve by themselves.
    const triedAndErred = early && all.some((s) => s.wrong >= 2);
    return reveals === 0 && hints <= 1 && !guessed && !triedAndErred;
  };

  useEffect(() => {
    if (finished && !reported.current) {
      reported.current = true;
      onComplete?.(isClean(states), problem.bucket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, states, onComplete, problem.bucket]);

  const helpedReported = useRef(false);
  const cleanNow = isClean(states);
  useEffect(() => {
    if (!cleanNow && !helpedReported.current) {
      helpedReported.current = true;
      onHelped?.();
    }
  }, [cleanNow, onHelped]);

  const update = (i: number, patch: Partial<StepState>) => setStates((all) => all.map((s, k) => (k === i ? { ...s, ...patch } : s)));

  // A wrong try reported by a custom step itself (it grades its own parts).
  const wrongTry = (i: number) => {
    const wrong = states[i].wrong + 1;
    update(i, { wrong, feedback: "Not a match. Try again.", hint: states[i].hint || wrong >= (early ? 1 : 2) });
  };

  const submit = (i: number, inputs = states[i].inputs) => {
    const step = problem.steps[i];
    const res = check(step, inputs, { early });
    if (res.ok) {
      update(i, { inputs, feedback: null });
      setCurrent(i + 1);
    } else {
      const wrong = states[i].wrong + 1;
      const tried = step.kind === "choice" && inputs[0] !== "" ? [...states[i].tried, Number(inputs[0])] : states[i].tried;
      update(i, { inputs, wrong, tried, feedback: res.msg, hint: states[i].hint || wrong >= (early ? 1 : 2) });
    }
  };

  const reveal = (i: number) => {
    update(i, { revealed: true, feedback: null });
    setCurrent(i + 1);
  };

  const openShowMe = (i: number) => update(i, { revealed: true, showMe: true, feedback: null });

  const clean = isClean(states);
  const help: VisualHelp | undefined = cur ? { step: current, wrong: cur.wrong, hint: cur.hint, showMe: cur.showMe } : undefined;
  // While "Show me" is open the picture shows this step already done.
  const visualDone = cur?.showMe ? current + 1 : current;
  const lookHere = !!cur && (cur.showMe || (cur.wrong > 0 && cur.feedback !== null));

  return (
    <div className="problem" ref={rootRef}>
      <div className={`problem-visual${lookHere ? " look-here" : ""}`} aria-live="polite">
        {problem.visual(visualDone, help)}
        {lookHere && (
          // Keyed on the try count so the pulse replays on every wrong try.
          <span key={`${current}-${cur!.wrong}-${cur!.showMe}`} className="look-here-ring" aria-hidden>
            <span className="look-here-badge">👀 Look here</span>
          </span>
        )}
      </div>
      <div className="problem-work">
        <ReadAloud className="story">
          <h3>{problem.title}</h3>
          <div>{problem.story}</div>
        </ReadAloud>

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
                {done ? (
                  <ReadAloud className="step-body">
                    <div className="step-prompt">{step.prompt}</div>
                    <div className="step-result">
                      <span className={`answer-chip ${st.revealed ? "revealed" : ""}`}>{answerText(step)}</span>
                      <div className="explain">{step.explain}</div>
                    </div>
                  </ReadAloud>
                ) : st.showMe ? (
                  <div className="step-body">
                    <ReadAloud className="step-prompt">{step.prompt}</ReadAloud>
                    <ReadAloud className="show-me" role="status" autoPlay={false}>
                      <div className="show-me-title">Here's how:</div>
                      {step.showMe && <div className="show-me-extra">{step.showMe}</div>}
                      <div className="explain">{step.explain}</div>
                      <div>
                        The answer is <span className="answer-chip revealed">{answerText(step)}</span>.
                      </div>
                    </ReadAloud>
                    <div className="step-tools" data-readaloud-part>
                      <button className="btn primary big" disabled={showMeHolding} onClick={() => setCurrent(i + 1)}>
                        Got it
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="step-body">
                    <ReadAloud className="step-prompt" alsoRead={[inputRef, toolsRef]}>
                      {step.prompt}
                    </ReadAloud>
                    <div ref={inputRef} data-readaloud-part>
                      <StepInput
                        step={step}
                        state={st}
                        onChange={(inputs) => update(i, { inputs, feedback: null })}
                        onSubmit={(inputs) => submit(i, inputs)}
                        onWrong={() => wrongTry(i)}
                      />
                    </div>
                    {st.feedback && (
                      <ReadAloud as="p" className="feedback bad" role="alert" autoPlay={false}>
                        {st.feedback}
                      </ReadAloud>
                    )}
                    {st.hint && (
                      <ReadAloud as="p" className="hint">
                        💡 {step.hint}
                      </ReadAloud>
                    )}
                    <div className="step-tools" ref={toolsRef} data-readaloud-part>
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
                      {early
                        ? st.wrong >= 2 && (
                            <button className="btn primary show-me-btn" onClick={() => openShowMe(i)}>
                              🙋 Show me
                            </button>
                          )
                        : st.wrong >= 3 && (
                            <button className="btn ghost" onClick={() => reveal(i)}>
                              Show answer
                            </button>
                          )}
                    </div>
                  </div>
                )}
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
          <ReadAloud className="wrapup" role="status">
            <div className="wrapup-title">{clean ? "Solved it! ⭐" : "Solved, with help."}</div>
            <p>{problem.wrapUp}</p>
            {!clean && (
              <p className="muted">
                {early && onRetrySame ? "Now try one like it by yourself." : "Solve one with no wrong guesses and at most one hint to earn a mastery star."}
              </p>
            )}
            <div className="step-tools" data-readaloud-part>
              {!clean && onRetrySame && (
                <button className="btn primary" disabled={holding} onClick={onRetrySame}>
                  Try one like it
                </button>
              )}
              {onNext && (
                // Solved with help (early-learner labs, which pass onRetrySame):
                // "Next problem" stays off so the student must "Try one like it".
                <button className={`btn ${!clean && onRetrySame ? "ghost" : "primary"}`} disabled={holding || (!clean && !!onRetrySame)} onClick={onNext}>
                  Next problem
                </button>
              )}
            </div>
          </ReadAloud>
        )}
      </div>
    </div>
  );
}

/** The number/ratio/choice input widget for one step. Exported for reuse by
 *  the end-of-unit test — see engine/UnitTest.tsx. StepState is also exported
 *  so a caller outside this file can type its own per-question answer state. */
export function StepInput({
  step,
  state,
  onChange,
  onSubmit,
  onWrong,
}: {
  step: Step;
  state: StepState;
  onChange: (v: string[]) => void;
  onSubmit: (v: string[]) => void;
  /** A custom step's wrong try (see CustomStep.render). */
  onWrong?: () => void;
}) {
  const early = useEarlyLearner();
  // Early learners type with on-screen number pads (their "Check" key presses Enter).
  const pad = numberPadProps(early, "enter");
  const answerRef = useRef<HTMLInputElement>(null);
  const enter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSubmit(state.inputs);
  };
  if (step.kind === "choice") {
    return (
      <div className="choices" role="group">
        {step.choices.map((c, k) => {
          // Early learners can't re-pick a choice they already got wrong.
          const tried = early && state.tried.includes(k);
          const pic = step.display?.[k];
          return (
            <button
              key={k}
              className={`choice${pic ? " choice-pic" : ""}${tried ? " tried" : ""}`}
              disabled={tried}
              aria-disabled={tried}
              aria-label={pic ? c : undefined}
              data-tts-say={pic ? c : undefined}
              onClick={() => onSubmit([String(k), ""])}
            >
              {pic ?? c}
            </button>
          );
        })}
      </div>
    );
  }
  if (step.kind === "tapCount") {
    return <TapCountInput step={step} raw={state.inputs[0]} onChange={(raw) => onChange([raw, ""])} />;
  }
  if (step.kind === "custom") {
    return <div className="custom-step">{step.render(() => onSubmit(["done"]), () => onWrong?.())}</div>;
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
            {...pad}
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
          ref={answerRef}
          className={`answer${step.tone ? ` q${step.tone}` : ""}`}
          inputMode="decimal"
          {...numberPadProps(early, "inline")}
          autoComplete="off"
          aria-label="Your answer"
          placeholder={step.money ? "0.00" : step.frac ? "n/d" : undefined}
          value={state.inputs[0]}
          onChange={(e) => onChange([e.target.value, ""])}
          onKeyDown={enter}
        />
        {step.suffix && <span className="affix">{step.suffix}</span>}
        {early && <InlineNumberPad inputRef={answerRef} />}
      </div>
    );
  }
  if (step.kind === "coordinate") {
    return (
      <div className="answer-row">
        <input
          className="answer"
          autoComplete="off"
          aria-label="Your answer"
          placeholder="(x, y)"
          value={state.inputs[0]}
          onChange={(e) => onChange([e.target.value, ""])}
          onKeyDown={enter}
        />
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

/**
 * A pile of counters to tap, for "count out N" (TapCountStep). Rows of 5, big
 * targets. Each tapped counter fills in and shows its count number, and (with
 * sound on) the number is said aloud. Tapping a counted one puts it back.
 */
function TapCountInput({ step, raw, onChange }: { step: TapCountStep; raw: string; onChange: (raw: string) => void }) {
  const order = tappedList(raw);
  const voiceId = useId();
  const tap = (i: number) => {
    const next = order.includes(i) ? order.filter((k) => k !== i) : [...order, i];
    onChange(next.join(","));
    if (getState().autoRead && !order.includes(i)) sayText(voiceId, String(next.length));
  };
  return (
    <div className={`tap-count q${step.tone ?? "b"}`} role="group" aria-label={`Pile of ${step.total} counters`} data-tts-skip>
      {Array.from({ length: step.total }, (_, i) => {
        const pos = order.indexOf(i);
        return (
          <button key={i} type="button" className={`tap-counter${pos >= 0 ? " on" : ""}`} aria-pressed={pos >= 0} aria-label={pos >= 0 ? `counter ${pos + 1}` : "counter"} onClick={() => tap(i)}>
            {pos >= 0 ? pos + 1 : ""}
          </button>
        );
      })}
      <div className="tap-count-total" aria-live="polite">
        {order.length === 0 ? "Tap to count." : `You have ${order.length}.`}
      </div>
    </div>
  );
}
