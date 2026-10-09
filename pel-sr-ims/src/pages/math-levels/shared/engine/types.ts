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
  /**
   * Stricter companion to `frac` — use alongside it (both `frac: true` and
   * `fracRequired: true`) when a decimal answer shouldn't be accepted at all,
   * not just penalized for being unsimplified. `frac` by itself still accepts
   * a numerically-close decimal (e.g. "0.33" for 1/3), since `rawFraction()`
   * only fires its lowest-terms check when the student actually typed "n/d"
   * text — a decimal never reaches that check. `fracRequired` closes that
   * gap: the raw input must itself parse as a bare "n/d" fraction (via
   * rawFraction()) or it's rejected with a dedicated "write this as a
   * fraction" message, before the usual value/lowest-terms checks run. Use
   * this when the point of the step is fraction fluency itself (e.g. a
   * minutes→hours conversion that's often a repeating decimal), not just
   * when a fraction happens to be the cleaner display format.
   */
  fracRequired?: boolean;
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

/** A fill-in-the-blank dropdown inside a SentenceStep — never free-typed. */
export interface SentenceSelectBlank {
  kind: "select";
  choices: string[];
  correct: number;
}

/** A fill-in-the-blank free-typed number (optionally money-formatted) inside a SentenceStep. */
export interface SentenceNumberBlank {
  kind: "number";
  answer: number;
  /** Same two-decimal-place formatting rule as NumberStep.money — see its doc comment. */
  money?: boolean;
}

export type SentenceBlank = SentenceSelectBlank | SentenceNumberBlank;

/**
 * A sentence with exactly two fill-in blanks, e.g. "Store ___ is the better
 * buy, at $___ per item." (a select blank + a free-typed money blank). Reads
 * like ChoiceStep's "pick the correct full sentence" MC questions, but the
 * student fills in just the parts that vary instead of recognizing one whole
 * pre-written sentence. Always exactly two blanks (not a general N), which
 * keeps it compatible with StepState.inputs' existing 2-slot shape.
 */
export interface SentenceStep extends BaseStep {
  kind: "sentence";
  /** Literal text: before blank 1, between blank 1 and blank 2, after blank 2. */
  parts: [string, string, string];
  blanks: [SentenceBlank, SentenceBlank];
}

export type Step = NumberStep | RatioStep | ChoiceStep | SentenceStep;

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

/** Build a select-dropdown SentenceBlank with shuffled options. */
export const selectBlank = (correctText: string, distractors: string[]): SentenceSelectBlank => {
  const all = shuffle([correctText, ...distractors.filter((d) => d !== correctText)]);
  return { kind: "select", choices: all, correct: all.indexOf(correctText) };
};

/** Build a free-typed SentenceBlank (optionally money-formatted). */
export const numberBlank = (answer: number, money?: boolean): SentenceNumberBlank => ({ kind: "number", answer, money });

/** Build a sentence step from already-built blanks (selectBlank/numberBlank), e.g.
 *  sentence(base, "Store ", selectBlank("A", ["B"]), " is better, at $", numberBlank(1.5, true), " each."). */
export const sentence = (base: BaseStep, before: string, blank1: SentenceBlank, between: string, blank2: SentenceBlank, after: string): SentenceStep => ({
  ...base,
  kind: "sentence",
  parts: [before, between, after],
  blanks: [blank1, blank2],
});
