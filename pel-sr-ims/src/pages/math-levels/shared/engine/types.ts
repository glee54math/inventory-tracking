import type { ReactNode } from "react";
import { shuffle } from "../lib/math";

interface BaseStep {
  /** The question for this step. */
  prompt: ReactNode;
  /** Nudge shown on request (after a wrong try). */
  hint: ReactNode;
  /** Shown once the step is correct: the "why". */
  explain: ReactNode;
}

export interface NumberStep extends BaseStep {
  kind: "number";
  answer: number;
  prefix?: string; // e.g. "$"
  suffix?: string; // e.g. "cups"
  /**
   * Whenever `answer` is NOT a whole dollar amount, require the typed answer
   * to be formatted as exactly two decimal places (e.g. "4.50", not "4.5" or
   * "4 1/2"), even though it's numerically the same value. Whole-dollar
   * answers don't have this restriction — "4" and "4.00" are equally valid,
   * since there's no ambiguity to resolve there. A right-but-wrong-format
   * answer gets a dedicated message instead of being silently accepted or
   * treated as simply wrong — see check() and answerText() in
   * engine/StepProblem.tsx.
   */
  money?: boolean;
  /**
   * Display/require this answer as a simplified fraction (e.g. "8/9") instead
   * of a decimal. `answer` still carries the decimal value for numeric
   * comparison — `fracAnswer` (required whenever `frac` is true) supplies the
   * numerator/denominator pair `answerText()` formats via fracText(), since a
   * decimal alone can't be losslessly turned back into one (0.888... doesn't
   * tell you it was 8/9 and not, say, 16/18). When the student types a bare
   * "n/d" answer that's numerically right but not in lowest terms, check()
   * gives a dedicated "simplify it" message instead of silently accepting or
   * flatly rejecting — same two-tier treatment as `money` above.
   */
  frac?: boolean;
  fracAnswer?: [number, number];
}

export interface RatioStep extends BaseStep {
  kind: "ratio";
  answer: [number, number];
  /** Accept any equivalent ratio (e.g. 4:6 for 2:3). Default false. */
  equivalent?: boolean;
  /**
   * Custom feedback for when the student's answer is a mathematically valid
   * equivalent ratio but not an exact match for `answer` (only relevant when
   * `equivalent` isn't set, since otherwise an equivalent ratio is just accepted).
   * Use this whenever the prompt's wording constrains the answer to something more
   * specific than "any equivalent ratio will do" — e.g. "in simplest form" (the
   * student needs to reduce further) or "in ONE group" (an equivalent like 4:14
   * isn't what was asked for, even though it's the same ratio as the expected
   * 2:7). Defaults to a generic "this step asks for these exact numbers" message,
   * which doesn't explain WHY the equivalent answer doesn't count.
   */
  equivalentHint?: string;
  /** Small labels under the two boxes, e.g. ["wings", "beaks"]. Also reused by
   *  non-ratio two-value steps, e.g. ["quotient", "remainder"]. */
  labels?: [string, string];
  /**
   * Which color each box matches, e.g. ["a", "c"] for a part-to-whole step whose
   * prompt wraps the first quantity in <QA> and the second in <QC>. Defaults to
   * ["a", "b"] — the common case where the prompt's two quantities are QA and QB
   * in that order. Must match the prompt's actual QA/QB/QC wrapping, or the boxes'
   * colors will contradict the prompt and diagram (this is what caused the
   * part-to-whole steps to render with the wrong box colors before this field
   * existed — see MATH_TSX_STYLE_GUIDE.txt section 11). Pass "none" for a plain-
   * text question whose prompt has no colored quantity words at all — the boxes
   * then render with no qa/qb/qc tint instead of falling back to the ["a","b"]
   * default.
   */
  tones?: ["a" | "b" | "c", "a" | "b" | "c"] | "none";
  /** Optional wording around the boxes: before ___ middle ___ after. */
  frame?: [string, string, string];
}

export interface ChoiceStep extends BaseStep {
  kind: "choice";
  choices: string[];
  correct: number;
}

export type Step = NumberStep | RatioStep | ChoiceStep;

export interface Problem {
  title: string;
  /** The word problem or the setup. */
  story: ReactNode;
  steps: Step[];
  /**
   * Draws the diagram for this problem. `done` is the number of steps answered
   * correctly so far, so the picture can fill in as the student works.
   */
  visual: (done: number) => ReactNode;
  /** Final sentence shown when every step is done. */
  wrapUp: ReactNode;
}

export interface ProblemType {
  label: string;
  make: () => Problem;
}

/**
 * One end-of-unit test question. Reuses the same Step union (and so the same
 * check()/answerText() grading and display logic) as practice — a test question
 * IS a Step, just presented one at a time with no hint/reveal affordances and no
 * feedback until the whole test is submitted. See engine/UnitTest.tsx.
 */
export interface TestQuestion {
  /** Diagram shown above the question, or null for a plain-text question. */
  visual: ReactNode | null;
  step: Step;
  /** Informational only (review/maintenance) — not read by any rendering logic. */
  difficulty: "easy" | "medium" | "hard";
}

/** Build a choice step with shuffled options. */
export const choice = (
  base: BaseStep,
  correctText: string,
  distractors: string[]
): ChoiceStep => {
  const all = shuffle([correctText, ...distractors.filter((d) => d !== correctText)]);
  return { ...base, kind: "choice", choices: all, correct: all.indexOf(correctText) };
};
