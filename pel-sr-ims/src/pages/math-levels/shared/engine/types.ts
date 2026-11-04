import type { ReactNode } from "react";
import { shuffle } from "../lib/math";

interface BaseStep {
  /** The question for this step. */
  prompt: ReactNode;
  /** Nudge shown on request (after a wrong try). */
  hint: ReactNode;
  /** Shown once the step is correct: the "why". */
  explain: ReactNode;
  /**
   * Optional extra for the early-learner "Show me" walk-through (shown above
   * `explain`), e.g. a worked line like "8 … 9, 10, 11". The picture also
   * redraws this step as done, and gets help.showMe so it can animate.
   */
  showMe?: ReactNode;
  /**
   * Keep the "Show me" panel's "Got it" button grayed out for this long after
   * it opens, so an animation in the picture can play first.
   */
  showMeHoldMs?: number;
}

/**
 * What the student needs right now, passed to Problem.visual so a picture can
 * point at the part that matters: e.g. light up the empty ten-frame boxes after
 * a wrong try, or draw the counting hops during "Show me".
 */
export interface VisualHelp {
  /** Index of the step being worked on. */
  step: number;
  /** Wrong tries on that step so far. */
  wrong: number;
  /** The hint is showing. */
  hint: boolean;
  /** The "Show me" walk-through is open (the picture is drawn with this step done). */
  showMe: boolean;
}

/** True when a picture should point at the part that matters for this step. */
export const pointing = (help: VisualHelp | undefined, step: number): boolean =>
  !!help && help.step === step && (help.wrong > 0 || help.hint || help.showMe);

export interface NumberStep extends BaseStep {
  kind: "number";
  answer: number;
  prefix?: string; // e.g. "$"
  suffix?: string; // e.g. "cups"
  /**
   * Tint the answer box with a quantity color, so it can match a highlighted
   * spot in the picture (e.g. the "next dot" in MK1's TenGroups).
   */
  tone?: "a" | "b" | "c";
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
  /**
   * Generalizes `money`'s "exactly two decimal places" rule to any digit
   * count — require the typed answer to show exactly this many digits after
   * the decimal point, even though it's numerically the same value with
   * fewer (or more). For exercises specifically about writing placeholder
   * zeros (e.g. "rewrite 8.15 with 3 decimal places" expects "8.150", not
   * the numerically-equal "8.15"), where the format itself is the point,
   * not just the value. Same two-tier right-value/wrong-format message as
   * `money` — see check() and answerText() in engine/StepProblem.tsx.
   */
  padTo?: number;
}

/**
 * A single free-typed "(x, y)" answer — unlike RatioStep's two separate
 * boxes (with the parentheses/comma supplied as static UI chrome around
 * them), this is ONE text field the student fills in themselves, punctuation
 * included, graded by parsing that text — see check() in StepProblem.tsx.
 * Use this whenever remembering the "(x, y)" notation itself is part of what
 * a question is testing, not just the two numbers.
 */
export interface CoordinateStep extends BaseStep {
  kind: "coordinate";
  answer: [number, number];
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
  /**
   * Optional pictures to show in the buttons instead of the text, in the
   * same order as `choices` (e.g. two big numerals, one written backwards).
   * `choices` is still what the voice says and what the answer chip shows.
   */
  display?: ReactNode[];
}

/**
 * "Count out" (K.CC.5): the student taps `answer` counters out of a pile of
 * `total`. Each tapped counter shows its count number. Graded by how many are
 * tapped, so the student must stop at the right number.
 * inputs[0] holds the tapped counters' indexes in tap order, e.g. "3,0,7".
 */
export interface TapCountStep extends BaseStep {
  kind: "tapCount";
  total: number;
  answer: number;
  tone?: "a" | "b" | "c";
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

/**
 * Two fractions multiplied together, each of the 4 numbers either fixed
 * (shown as plain text) or `null` (a fill-in box) — rendered as real stacked
 * fractions (numerator over denominator, divided by a bar), not an inline
 * "a/b" row, so a cancelled-down rewrite step reads the same way Explore's
 * stacked fractions do instead of looking like a flat equation with two
 * disconnected blanks in it. `answer` lines up with the `null` slots in
 * reading order (leftNum, leftDen, rightNum, rightDen) — however many of the
 * four are blanked out, `answer` must have that many entries, in that order.
 */
export interface FracMultiplyStep extends BaseStep {
  kind: "fracMultiply";
  leftNum: number | null;
  leftDen: number | null;
  rightNum: number | null;
  rightDen: number | null;
  answer: number[];
  /** Tints the first/second fraction — "none" for plain, undefined also plain. */
  tones?: ["a" | "b" | "c", "a" | "b" | "c"] | "none";
}

/**
 * The standard "long multiplication" written form for two decimals — stacked
 * factors, multiplied into one partial product per digit of the bottom
 * factor (each shifted one place further left), then summed — with every
 * digit of every partial product AND the final sum as its own fill-in box,
 * not one box per whole number. Placing the decimal point itself is a
 * separate step elsewhere (this one only ever asks for whole-number digits,
 * ignoring both factors' decimal points), so `top`/`bottom` are the full
 * decimal values just for display; everything checked is derived from them
 * via verticalMultiplyBreakdown (shared/lib/math.ts), not passed in here.
 */
export interface VerticalMultiplyStep extends BaseStep {
  kind: "verticalMultiply";
  top: number;
  bottom: number;
}

/**
 * An escape hatch for a step whose interaction is a whole pre-built,
 * self-validating widget (its own internal digit-by-digit checking, its own
 * stage gating) rather than something expressible as one number/ratio/choice
 * answer — e.g. ManualDivisionLadder, embedded as a single Practice step
 * instead of being reimplemented as a run of NumberStep/RatioStep questions.
 * `render` receives `onDone`, which the widget calls itself once IT decides
 * the step is complete — StepProblem has no way to grade an arbitrary custom
 * widget's internals, so "done" is the widget's call, not check()'s.
 * `resultText` fills the answer-chip shown once this step is done, since
 * there's no generic way to derive a canonical answer string from `render`.
 */
export interface CustomStep extends BaseStep {
  kind: "custom";
  /** `onWrong` reports a wrong try (feedback, hint, "Show me", clean scoring), like a wrong typed answer. */
  render: (onDone: () => void, onWrong: () => void) => ReactNode;
  resultText: string;
}

export type Step = NumberStep | RatioStep | CoordinateStep | ChoiceStep | TapCountStep | SentenceStep | FracMultiplyStep | VerticalMultiplyStep | CustomStep;

/** Build a CustomStep — see CustomStep's doc comment for when to reach for this. */
export const customStep = (base: BaseStep, render: (onDone: () => void, onWrong: () => void) => ReactNode, resultText: string): CustomStep => ({ ...base, kind: "custom", render, resultText });

/** Build a CoordinateStep — see its doc comment for when to reach for this over RatioStep. */
export const coordinateStep = (base: BaseStep, x: number, y: number): CoordinateStep => ({ ...base, kind: "coordinate", answer: [x, y] });

export interface Problem {
  title: string;
  /** The word problem or the setup. */
  story: ReactNode;
  steps: Step[];
  /**
   * Draws the diagram for this problem. `done` is the number of steps answered
   * correctly so far, so the picture can fill in as the student works.
   */
  visual: (done: number, help?: VisualHelp) => ReactNode;
  /** Final sentence shown when every step is done. */
  wrapUp: ReactNode;
  /**
   * Keep the wrap-up buttons ("Next problem", "Try one like it") grayed out
   * for this long after the last step, e.g. so a closing animation in the
   * picture plays through once before the student moves on.
   */
  wrapUpHoldMs?: number;
  /**
   * Which scenario-class this generated instance falls into, if the
   * generator tracks that (e.g. "shift2-pad" for a 2-decimal-place divisor
   * whose dividend needed a placeholder zero) — optional, and meaningless on
   * its own; only matters paired with a Unit.requiredBuckets vocabulary,
   * which is what turns "solved N problems" into "covered every scenario
   * that unit cares about." Most units never set this. See moduleProgressTypes.ts.
   */
  bucket?: string;
}

export interface ProblemType {
  label: string;
  /**
   * `targetBucket`, when passed, asks the generator to deliberately land in
   * that specific bucket (typically via rejection sampling — reroll until it
   * lands — rather than hand-deriving arithmetic that guarantees it) instead
   * of leaving bucket coverage to chance. Only meaningful for a generator
   * that actually sets Problem.bucket; most generators ignore the argument.
   */
  make: (targetBucket?: string) => Problem;
  /**
   * Declares which buckets this type can target. When set, Mixed-mode's
   * shuffle bag (see MG11_MultDivFractionLab.tsx's UnitView) expands this
   * type into one bag slot per bucket — each slot calling make(bucket) — in
   * place of a single generic slot for the whole type, so every bucket gets
   * its own guaranteed-even turn instead of being an incidental side effect
   * of however often this type itself gets picked. Should match (or be a
   * subset of) the owning Unit's own requiredBuckets.
   */
  buckets?: string[];
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

/**
 * Build a choice step whose buttons show pictures, e.g. pictureChoice(base,
 * [["6 written the right way", bigDigit("6")], ["6 written backwards", bigDigit("6", true)]], 0).
 * Options keep the given order (shuffle them yourself if order shouldn't be fixed).
 */
export const pictureChoice = (base: BaseStep, options: [string, ReactNode][], correct: number): ChoiceStep => ({
  ...base,
  kind: "choice",
  choices: options.map((o) => o[0]),
  display: options.map((o) => o[1]),
  correct,
});

/** Build a TapCountStep — see its doc comment. */
export const tapCount = (base: BaseStep, total: number, answer: number, tone?: TapCountStep["tone"]): TapCountStep => ({ ...base, kind: "tapCount", total, answer, tone });

/** Indexes tapped so far in a TapCountStep's inputs[0]. */
export const tappedList = (raw: string | undefined): number[] => (raw ? raw.split(",").filter(Boolean).map(Number) : []);

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

/** Build a FracMultiplyStep — pass `null` for whichever of the 4 slots should
 *  be a fill-in box, and list their answers in `answers` (reading order:
 *  leftNum, leftDen, rightNum, rightDen — only for the slots that are null). */
export const fracMultiply = (
  base: BaseStep,
  leftNum: number | null,
  leftDen: number | null,
  rightNum: number | null,
  rightDen: number | null,
  answers: number[],
  tones?: FracMultiplyStep["tones"]
): FracMultiplyStep => ({ ...base, kind: "fracMultiply", leftNum, leftDen, rightNum, rightDen, answer: answers, tones });

/** Build a VerticalMultiplyStep — top/bottom are the two full decimal factors. */
export const verticalMultiply = (base: BaseStep, top: number, bottom: number): VerticalMultiplyStep => ({ ...base, kind: "verticalMultiply", top, bottom });
