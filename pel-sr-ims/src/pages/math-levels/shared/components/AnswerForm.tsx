import type { ReactNode } from "react";
import { MathText } from "./MathText";
import { ANSWER_FORMS, AnswerFormCtx, FORM_EXAMPLE, FORM_MEANS, FORM_PICK_PROMPT, formLabel, type AnswerForm } from "./answerKinds";

// ============================================================================
// Opt-in "pick the kind of answer" for fraction answers. A lab that wraps its
// content in <AnswerFormPick> gets three tap buttons — Whole number · Mixed
// number · Proper fraction — above every FractionStep answer that has a
// whole-number box (`mixed: true`, no printed `den`) and every CFU
// `mixedFraction` blank. No kind is picked at the start (a default would give
// the answer's kind away); the boxes appear once one is picked, and the
// grading says whether the picked kind was right (checkFormFraction in
// shared/engine/StepProblem.tsx). Outside the provider nothing changes, so
// every other lab keeps the old "leave a box empty" entry. The logic
// (kinds, which boxes each shows, the hook) is in answerKinds.ts.
//
// Turn it on for a lab: wrap the lab's root content in <AnswerFormPick>
// (MG10_AddingAndSubtractingFractionsLab.tsx does it next to
// <StackedFractions>), and teach the three kinds once in Explore with
// <AnswerFormGuide /> (before the first unit whose answers can be all three).
// Added for MG10 (user request, 2026-11-07: students didn't know to leave the
// whole-number box empty for an answer like 3/4).
// ============================================================================

/** Turns the answer-kind buttons on for every fraction answer inside it. */
export function AnswerFormPick({ children, on = true }: { children: ReactNode; on?: boolean }) {
  return <AnswerFormCtx.Provider value={on}>{children}</AnswerFormCtx.Provider>;
}

/**
 * The three kind buttons. `mark` colors the picked button after a Check:
 * "good" (green) when the kind is right, "bad" (red) when it isn't.
 */
export function FormPicker({
  value,
  onPick,
  mark,
  disabled,
  compact,
  label = "Format",
  prompt = FORM_PICK_PROMPT,
}: {
  value: string;
  onPick: (f: AnswerForm) => void;
  mark?: "good" | "bad";
  disabled?: boolean;
  /** Smaller buttons, for a CFU sentence. */
  compact?: boolean;
  label?: string;
  /** The line just above the buttons (read before them); null hides it. */
  prompt?: string | null;
}) {
  return (
    <span className={`form-pick-wrap${compact ? " compact" : ""}`}>
      {prompt && <span className="form-pick-say">{prompt}</span>}
      <span className={`form-pick${compact ? " compact" : ""}`} role="radiogroup" aria-label={label}>
        {ANSWER_FORMS.map((f) => {
          const on = value === f;
          return (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={disabled}
              className={`form-pick-btn${on ? " on" : ""}${on && mark ? ` ${mark}` : ""}`}
              onClick={() => onPick(f)}
            >
              <span className="form-pick-label">{formLabel(f)}</span>
              <span className="form-pick-eg" aria-hidden data-tts-skip>
                <MathText>{FORM_EXAMPLE[f]}</MathText>
              </span>
            </button>
          );
        })}
      </span>
    </span>
  );
}

/**
 * Teaches the three kinds once, in Explore: one sentence and one example of
 * each. MG10 shows it in Unit 3 (the first unit whose answers can be any of
 * the three).
 */
export function AnswerFormGuide() {
  return (
    <div className="form-guide">
      <p className="form-guide-title">Pick a format to write your answer: a whole number, a mixed number, or a proper fraction.</p>
      <div className="form-guide-row">
        {ANSWER_FORMS.map((f) => (
          <div key={f} className="form-guide-card">
            <b>{formLabel(f)}</b>
            <span className="form-guide-eg">
              <MathText>{FORM_EXAMPLE[f]}</MathText>
            </span>
            <span className="muted small">{FORM_MEANS[f]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
