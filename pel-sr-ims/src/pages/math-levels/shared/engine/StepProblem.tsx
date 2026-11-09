import React, { useEffect, useId, useRef, useState } from "react";
import { autoRead, ReadAloud } from "../tts/ReadAloud";
import { getState, sayText, stopIfPlaying } from "../tts/speechEngine";
import { sentenceBlanksOf, tappedList, type FractionStep, type Problem, type SentenceBlank, type Step, type TapCountStep, type VisualHelp } from "./types";
import { fmt, fracText, gcd, numbersMatch, parseAnswer, rawFraction, verticalMultiplyBreakdown } from "../lib/math";
import { numberPadProps, useEarlyLearner } from "./audience";
import { InlineNumberPad } from "../components/NumberPad";
import { hasFraction, MathText, useStackedFractions } from "../components/MathText";
import { TapSelect } from "../components/TapSelect";
import { answerBorder } from "../lib/answerChecks";
import { FormPicker } from "../components/AnswerForm";
import { formBoxes, formFilled, formLabel, formName, formOfValue, isAnswerForm, keepFitting, useAnswerFormPick, type AnswerForm } from "../components/answerKinds";

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
  /**
   * A FractionStep with `simplest` got an equal answer that wasn't in simplest
   * form at least once. Counts against a clean solve (see isClean). Only ever
   * set by steps that opt in, so other steps are unaffected.
   */
  formMiss?: boolean;
  /**
   * Labs with <AnswerFormPick> (MG10): how the last Check marked a fraction
   * answer — `form` colors the picked kind button green/red, `boxes` (when
   * set) colors the number boxes. Cleared as soon as anything changes.
   */
  formMark?: { form: boolean; boxes?: boolean };
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
    return `${s.prefix ?? ""}${val}${s.overDen !== undefined ? `/${s.overDen}` : ""}${s.suffix ? " " + s.suffix : ""}`;
  }
  if (s.kind === "ratio") return s.stacked ? `${s.frame?.[0] ?? ""}${s.answer[0]}/${s.answer[1]}${s.frame?.[2] ?? ""}` : `${s.answer[0]} : ${s.answer[1]}`;
  if (s.kind === "coordinate") return `(${s.answer[0]}, ${s.answer[1]})`;
  if (s.kind === "sentence") {
    const over = (i: 0 | 1) => (s.overDen?.[i] !== undefined ? `/${s.overDen[i]}` : "");
    // SentenceStep.stacked: the two blanks are one fraction's top and bottom.
    if (s.stacked) return `${s.parts[0]}${sentenceBlankText(s.blanks[0])}/${sentenceBlankText(s.blanks[1])}${s.parts[2]}`;
    const more = (s.more ?? []).map((m) => `${sentenceBlankText(m.blank)}${m.after}`).join("");
    return `${s.parts[0]}${sentenceBlankText(s.blanks[0])}${over(0)}${s.parts[1]}${sentenceBlankText(s.blanks[1])}${over(1)}${s.parts[2]}${more}`;
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
  if (s.kind === "fraction") return fractionAnswerText(s);
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

/** Canonical text for a FractionStep's answer: simplest form when the step
 *  asks for it ("1 5/12", "1"), otherwise exactly as given ("9/12"). */
const fractionAnswerText = (s: FractionStep): string => {
  const [n, d] = s.answer;
  if (s.simplest) return fracText(n, d, !!s.mixed);
  if (s.mixed && n >= d) {
    const w = Math.floor(n / d);
    const r = n - w * d;
    return r === 0 ? String(w) : `${w} ${r}/${d}`;
  }
  return `${n}/${d}`;
};

export const SIMPLEST_FORM_MSG = "That's equal, but it's not in simplest form. Simplify it.";

type CheckResult = { ok: boolean; msg: string; formMiss?: boolean; formMark?: StepState["formMark"] };

/** True when this step shows the answer-kind buttons (inside <AnswerFormPick>). */
const usesFormPick = (s: Step, on: boolean): boolean => on && s.kind === "fraction" && !!s.mixed && s.den === undefined;

/** A typed fraction answer as the student wrote it ("4", "2/2", "1 3/5"), for FractionStep.diagnose's `typed`. `show` = [whole, top, bottom] boxes in use. */
const typedText = (show: readonly boolean[], w: number, n: number, d: number): string =>
  [show[0] ? String(w) : "", show[1] ? `${n}/${d}` : ""].filter(Boolean).join(" ");

/** Why an equal answer isn't in simplest form, for the picked kind (see checkFormFraction). */
const notSimplestWhy = (form: AnswerForm, w: number, n: number, d: number): string => {
  if (form === "mixed" && w === 0 && n < d) return " There are 0 wholes, so it is not a mixed number.";
  if (n === 0) return " The top is 0, so there is no fraction part.";
  if (n >= d) return " The top is as big as the bottom or bigger. Write it as a whole number or a mixed number.";
  if (gcd(n, d) !== 1) return ` ${n} and ${d} can both be divided by ${gcd(n, d)}.`;
  return "";
};

/**
 * Grades a FractionStep answered with a picked kind (inputs[3] = "whole" |
 * "mixed" | "proper"; only the boxes that kind shows count). Says whether the
 * kind was right as well as the value. Any wrong Check here counts against a
 * clean solve (formMiss): the kind is a 1-in-3 pick, and "Mixed number is
 * right" is help. `tries` = wrong tries before this one: from the second
 * wrong try on, a wrong-kind message names the right kind.
 */
const checkFormFraction = (s: FractionStep, inputs: string[], form: AnswerForm, tries: number): CheckResult => {
  const values: [string, string, string] = [(inputs[0] ?? "").trim(), (inputs[1] ?? "").trim(), (inputs[2] ?? "").trim()];
  const [wRaw, nRaw, dRaw] = keepFitting(values, form);
  if (!formFilled(form, values)) return { ok: false, msg: "Fill in every box." };
  if ([wRaw, nRaw, dRaw].some((v) => v !== "" && !/^\d+$/.test(v))) return { ok: false, msg: "Use only whole numbers in the boxes." };
  const show = formBoxes(form);
  const w = show[0] ? Number(wRaw) : 0;
  const n = show[1] ? Number(nRaw) : 0;
  const d = show[2] ? Number(dRaw) : 1;
  if (d === 0) return { ok: false, msg: "The bottom number can't be 0." };
  const [an, ad] = s.answer;
  const want = formOfValue(an, ad);
  const typedN = w * d + n;
  const equal = typedN * ad === an * d;
  if (form !== want) {
    if (equal) return { ok: false, msg: SIMPLEST_FORM_MSG + notSimplestWhy(form, w, n, d), formMiss: true, formMark: { form: false } };
    // "The correct answer", not "The answer": right after a named mistake
    // about the student's own number, "The answer" read as theirs (MG10 E5-09).
    const kindMsg = tries === 0 ? `The correct answer is not a ${formName(form)}. Is it more than 1, less than 1, or a whole number?` : `The correct answer is not a ${formName(form)}. It is a ${formName(want)}.`;
    // A named mistake (e.g. "You added across") comes first: it is why the
    // value AND the kind are off (adding across 3/4 + 1/2 gives a proper
    // fraction, but the sum is a mixed number). Then one plain sentence, no question.
    const named = s.diagnose?.(typedN, d, typedText(show, w, n, d));
    return { ok: false, msg: named ? `${named} The correct answer is not a ${formName(form)}.${tries > 0 ? ` It is a ${formName(want)}.` : ""}` : kindMsg, formMiss: true, formMark: { form: false } };
  }
  if (!equal) return { ok: false, msg: `${formLabel(form)} is right. ${s.diagnose?.(typedN, d, typedText(show, w, n, d)) ?? "Check the numbers."}`, formMiss: true, formMark: { form: true, boxes: false } };
  // Right kind, equal value: a whole number is always simplest; a fraction part must be in lowest terms and less than 1.
  if (show[1] && (n === 0 || n >= d || gcd(n, d) !== 1)) {
    return { ok: false, msg: SIMPLEST_FORM_MSG + notSimplestWhy(form, w, n, d), formMiss: true, formMark: { form: true, boxes: false } };
  }
  return { ok: true, msg: "" };
};

/** Grades a FractionStep (see its doc comment in types.ts). */
const checkFraction = (s: FractionStep, inputs: string[], tries = 0): CheckResult => {
  if (s.mixed && s.den === undefined && isAnswerForm(inputs[3])) return checkFormFraction(s, inputs, inputs[3], tries);
  const wRaw = s.mixed ? (inputs[0] ?? "").trim() : "";
  const nRaw = (inputs[1] ?? "").trim();
  const dRaw = s.den !== undefined ? String(s.den) : (inputs[2] ?? "").trim();
  const dTyped = s.den === undefined && dRaw !== "";
  if (!wRaw && !nRaw && !dTyped) return { ok: false, msg: s.mixed ? "Type your answer in the boxes." : "Type the missing number." };
  if ([wRaw, nRaw, s.den === undefined ? dRaw : ""].some((v) => v !== "" && !/^\d+$/.test(v))) return { ok: false, msg: "Use only whole numbers in the boxes." };
  if (!nRaw && dTyped) return { ok: false, msg: "Fill in the top of the fraction too." };
  if (nRaw && !dRaw) return { ok: false, msg: "Fill in the bottom of the fraction too." };
  const w = wRaw ? Number(wRaw) : 0;
  const n = nRaw ? Number(nRaw) : 0;
  const d = nRaw ? Number(dRaw) : 1;
  if (d === 0) return { ok: false, msg: "The bottom number can't be 0." };
  const [an, ad] = s.answer;
  const typedN = w * d + n;
  if (typedN * ad !== an * d) {
    return { ok: false, msg: s.diagnose?.(typedN, d, typedText([!!wRaw, !!nRaw, !!nRaw], w, n, d)) ?? "Not yet. Check your work and try again." };
  }
  if (s.simplest) {
    const hasFrac = nRaw !== "";
    const notSimplest = hasFrac && (n === 0 || gcd(n, d) !== 1 || (s.mixed && n >= d) || d === 1);
    if (notSimplest) {
      const why = s.mixed && n >= d ? " The top is as big as the bottom or bigger. Write it as a whole number or a mixed number." :n !== 0 && gcd(n, d) !== 1 ? ` ${n} and ${d} can both be divided by ${gcd(n, d)}.` : "";
      return { ok: false, msg: SIMPLEST_FORM_MSG + why, formMiss: true };
    }
  }
  return { ok: true, msg: "" };
};

/** Check one step. Returns null when right, or a targeted message when wrong.
 *  Exported for reuse by the end-of-unit test, so test questions are graded
 *  with the exact same logic as practice steps — see engine/UnitTest.tsx. */
export const check = (s: Step, inputs: string[], opts: { early?: boolean; tries?: number } = {}): CheckResult => {
  if (s.kind === "fraction") return checkFraction(s, inputs, opts.tries);
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
    const named = s.diagnose?.(v);
    if (named) return { ok: false, msg: named };
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
    // SentenceStep.more (MG10): 3 or more blanks. Without it, exactly as before.
    const all = sentenceBlanksOf(s);
    const vals = all.map((_, k) => inputs[k] ?? "");
    if (vals.some((v) => v === "")) return { ok: false, msg: all.length > 2 ? "Fill in every blank." : "Fill in both blanks." };
    const ok = all.every((b, k) => sentenceBlankOk(b, vals[k]));
    if (ok) return { ok: true, msg: "" };
    return { ok: false, msg: s.diagnose?.(vals) ?? (all.length > 2 ? "One of the blanks isn't right yet. Check each one against the problem." : "One of the blanks isn't right yet — check both against the problem.") };
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
  // Labs with <AnswerFormPick>: Check waits until a kind is picked and its boxes are filled.
  const formPick = useAnswerFormPick();
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
    // A "fill in the reason" sentence (SentenceStep.checkEach) is tap picks too, so a wrong Check is a guess.
    const picks = (st: Step) => st.kind === "choice" || (st.kind === "sentence" && !!st.checkEach);
    const guessed = all.some((s, k) => picks(problem.steps[k]) && s.wrong > 0);
    // Early learners: two wrong tries on any step is trial and error, not a solve by themselves.
    const triedAndErred = early && all.some((s) => s.wrong >= 2);
    // A FractionStep that asks for simplest form was answered equal-but-unsimplified.
    const formMissed = all.some((s) => s.formMiss);
    return reveals === 0 && hints <= 1 && !guessed && !triedAndErred && !formMissed;
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
    const res = check(step, inputs, { early, tries: states[i].wrong });
    if (res.ok) {
      update(i, { inputs, feedback: null, formMark: undefined });
      setCurrent(i + 1);
    } else {
      const wrong = states[i].wrong + 1;
      const tried = step.kind === "choice" && inputs[0] !== "" ? [...states[i].tried, Number(inputs[0])] : states[i].tried;
      update(i, { inputs, wrong, tried, feedback: res.msg, hint: states[i].hint || wrong >= (early ? 1 : 2), formMark: res.formMark, ...(res.formMiss ? { formMiss: true } : {}) });
    }
  };

  const reveal = (i: number) => {
    update(i, { revealed: true, feedback: null });
    setCurrent(i + 1);
  };

  const openShowMe = (i: number) => update(i, { revealed: true, showMe: true, feedback: null });

  const clean = isClean(states);
  const help: VisualHelp | undefined = cur
    ? { step: current, wrong: cur.wrong, hint: cur.hint, showMe: cur.showMe, lastTry: cur.wrong > 0 && cur.feedback !== null ? cur.inputs : undefined }
    : undefined;
  // While "Show me" is open the picture shows this step already done.
  const visualDone = cur?.showMe ? current + 1 : current;
  const lookHere = !!cur && (cur.showMe || (cur.wrong > 0 && cur.feedback !== null));

  return (
    <div className="problem" ref={rootRef}>
      <div className={`problem-visual${lookHere ? " look-here" : ""}`} aria-live="polite">
        <MathText>{problem.visual(visualDone, help)}</MathText>
        {lookHere && (
          // Keyed on the try count so the pulse replays on every wrong try.
          <span key={`${current}-${cur!.wrong}-${cur!.showMe}`} className="look-here-ring" aria-hidden>
            <span className="look-here-badge">👀 Look here</span>
          </span>
        )}
      </div>
      <div className="problem-work">
        <ReadAloud className="story">
          <h3>
            <MathText>{problem.title}</MathText>
          </h3>
          <div>
            <MathText>{problem.story}</MathText>
          </div>
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
                    <div className="step-prompt">
                      <MathText>{step.prompt}</MathText>
                    </div>
                    <div className="step-result">
                      <span className={`answer-chip ${st.revealed ? "revealed" : ""}`}>
                        <MathText>{answerText(step)}</MathText>
                      </span>
                      <div className="explain">
                        <MathText>{step.explain}</MathText>
                      </div>
                    </div>
                  </ReadAloud>
                ) : st.showMe ? (
                  <div className="step-body">
                    <ReadAloud className="step-prompt">
                      <MathText>{step.prompt}</MathText>
                    </ReadAloud>
                    <ReadAloud className="show-me" role="status" autoPlay={false}>
                      <div className="show-me-title">Here's how:</div>
                      {step.showMe && (
                        <div className="show-me-extra">
                          <MathText>{step.showMe}</MathText>
                        </div>
                      )}
                      <div className="explain">
                        <MathText>{step.explain}</MathText>
                      </div>
                      <div>
                        The answer is{" "}
                        <span className="answer-chip revealed">
                          <MathText>{answerText(step)}</MathText>
                        </span>
                        .
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
                      <MathText>{step.prompt}</MathText>
                    </ReadAloud>
                    <div ref={inputRef} data-readaloud-part>
                      <StepInput
                        step={step}
                        state={st}
                        onChange={(inputs) => update(i, { inputs, feedback: null, formMark: undefined })}
                        onSubmit={(inputs) => submit(i, inputs)}
                        onWrong={() => wrongTry(i)}
                      />
                    </div>
                    {st.feedback && (
                      <ReadAloud as="p" className="feedback bad" role="alert" autoPlay={false}>
                        <MathText>{st.feedback}</MathText>
                      </ReadAloud>
                    )}
                    {st.hint && (
                      <ReadAloud as="p" className="hint">
                        💡 <MathText>{step.hint}</MathText>
                      </ReadAloud>
                    )}
                    <div className="step-tools" ref={toolsRef} data-readaloud-part>
                      {step.kind !== "choice" && step.kind !== "custom" && (
                        <button
                          className="btn primary"
                          disabled={
                            (usesFormPick(step, formPick) && !formFilled(st.inputs[3], [st.inputs[0] ?? "", st.inputs[1] ?? "", st.inputs[2] ?? ""])) ||
                            // SentenceStep.checkEach: Check waits until every blank is filled.
                            (step.kind === "sentence" && !!step.checkEach && sentenceBlanksOf(step).some((_, k) => !st.inputs[k]))
                          }
                          onClick={() => submit(i)}
                        >
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
            <p>
              <MathText>{problem.wrapUp}</MathText>
            </p>
            {!clean && (
              <p className="muted">
                {/* Every lab that passes onRetrySame locks "Next problem" until a
                    same-type retry is solved cleanly; older-grade labs (no
                    EarlyLearnerProvider) get older-grade wording for it. */}
                {onRetrySame
                  ? early
                    ? "Now try one like it by yourself."
                    : "Now solve one like it on your own. Then you can move on."
                  : "Solve one with no wrong guesses and at most one hint to earn a mastery star."}
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
  // Labs with <StackedFractions> (MG10): fraction options become tap buttons (a
  // native dropdown can't draw a stacked fraction), and a blank can sit over
  // a printed denominator (SentenceStep.overDen).
  const stacked = useStackedFractions();
  const formPick = useAnswerFormPick();
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
              {pic ?? <MathText>{c}</MathText>}
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
    // SentenceStep.more (MG10): blanks 3+ follow parts[2]. checkEach: tap buttons for every
    // select blank, and after a wrong Check each blank's pick turns green or red.
    const allBlanks = sentenceBlanksOf(step);
    const marked = !!step.checkEach && state.wrong > 0 && state.feedback !== null;
    const blankName = (i: number) => (i === 0 ? "First blank" : i === 1 ? "Second blank" : `Blank ${i + 1}`);
    const renderBlank = (i: number) => {
      const b = allBlanks[i];
      const val = state.inputs[i] ?? "";
      const set = (v: string) => {
        const next = allBlanks.map((_, k) => state.inputs[k] ?? "");
        next[i] = v;
        onChange(next);
      };
      const mark = marked ? answerBorder(sentenceBlankOk(b, val), true) : undefined;
      if (b.kind === "select") {
        if ((stacked && b.choices.some(hasFraction)) || step.checkEach) {
          return (
            <TapSelect aria-label={blankName(i)} value={val} style={mark} onChange={(e) => set(e.target.value)}>
              {b.choices.map((c, k) => (
                <option key={k} value={k}>
                  {c}
                </option>
              ))}
            </TapSelect>
          );
        }
        return (
          <select className="sentence-select" aria-label={blankName(i)} value={val} style={mark} onChange={(e) => set(e.target.value)}>
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
      const den = i < 2 ? step.overDen?.[i as 0 | 1] : undefined;
      const box = (
        <input
          className={`answer sentence-input-box${den !== undefined ? " frac-entry-box" : ""}`}
          inputMode="decimal"
          {...pad}
          autoComplete="off"
          aria-label={den !== undefined ? `${i === 0 ? "First" : "Second"} blank, the top of a fraction over ${den}` : blankName(i)}
          placeholder={b.money ? "0.00" : undefined}
          style={mark}
          value={val}
          onChange={(e) => set(e.target.value)}
          onKeyDown={enter}
        />
      );
      if (den !== undefined) {
        return (
          <span className="frac-entry-stack sentence-over-den">
            {box}
            <span className="frac-entry-bar" aria-hidden />
            <span className="frac-entry-fixed">{den}</span>
          </span>
        );
      }
      return <span className="sentence-number">{box}</span>;
    };
    if (step.stacked) {
      // SentenceStep.stacked (MG9): blank 1 over a bar over blank 2, one handwritten fraction.
      return (
        <div className="answer-row sentence-input">
          <span>
            <MathText>{step.parts[0]}</MathText>
          </span>
          <span className="frac-entry-stack sentence-over-den">
            {renderBlank(0)}
            <span className="frac-entry-bar" aria-hidden />
            {renderBlank(1)}
          </span>
          <span>
            <MathText>{step.parts[2]}</MathText>
          </span>
        </div>
      );
    }
    return (
      // checkEach: "sentence-frame" wraps the sentence like text, word by word (lab-base.css).
      <div className={`answer-row sentence-input${step.checkEach ? " sentence-frame" : ""}`}>
        <span>
          <MathText>{step.parts[0]}</MathText>
        </span>
        {renderBlank(0)}
        <span>
          <MathText>{step.parts[1]}</MathText>
        </span>
        {renderBlank(1)}
        <span>
          <MathText>{step.parts[2]}</MathText>
        </span>
        {(step.more ?? []).map((m, k) => (
          <React.Fragment key={k}>
            {renderBlank(k + 2)}
            <span>
              <MathText>{m.after}</MathText>
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  }
  if (usesFormPick(step, formPick)) {
    return <FormFractionInput state={state} onChange={onChange} onSubmit={onSubmit} />;
  }
  if (step.kind === "fraction") {
    const set = (idx: number, v: string) => {
      const next = [state.inputs[0] ?? "", state.inputs[1] ?? "", state.inputs[2] ?? ""];
      next[idx] = v;
      onChange(next);
    };
    const box = (idx: number, label: string, cls: string) => (
      <input
        className={`answer ${cls}`}
        inputMode="numeric"
        {...numberPadProps(early, "enter")}
        autoComplete="off"
        aria-label={label}
        value={state.inputs[idx] ?? ""}
        onChange={(e) => set(idx, e.target.value)}
        onKeyDown={enter}
      />
    );
    return (
      <div className="answer-row frac-entry-row">
        <span className="frac-entry">
          {step.mixed && box(0, "whole number", "frac-entry-whole")}
          <span className="frac-entry-stack">
            {box(1, "numerator", "frac-entry-box")}
            <span className="frac-entry-bar" aria-hidden />
            {step.den !== undefined ? <span className="frac-entry-fixed">{step.den}</span> : box(2, "denominator", "frac-entry-box")}
          </span>
        </span>
        {step.mixed && <span className="muted small frac-entry-note">Leave a box empty if you don't need it.</span>}
      </div>
    );
  }
  if (step.kind === "number" && step.fracBoxes) {
    // NumberStep.fracBoxes: [whole] top over bottom. inputs[0] is the joined
    // answer text the grader reads; inputs[1..3] keep each box's own value.
    const parts = [state.inputs[1] ?? "", state.inputs[2] ?? "", state.inputs[3] ?? ""];
    const set = (idx: number, v: string) => {
      const next = [...parts];
      next[idx] = v;
      const [w, t, b] = next.map((x) => x.trim());
      const frac = b ? `${t}/${b}` : t;
      onChange([w && frac ? `${w} ${frac}` : w || frac, ...next]);
    };
    const box = (idx: number, label: string, cls: string) => (
      <input
        ref={idx === (step.fracBoxes === "mixed" ? 0 : 1) ? answerRef : undefined}
        className={`answer ${cls}`}
        inputMode="decimal"
        autoComplete="off"
        aria-label={label}
        value={parts[idx]}
        onChange={(e) => set(idx, e.target.value)}
        onKeyDown={enter}
      />
    );
    return (
      <div className="answer-row frac-entry-row">
        {step.prefix && <span className="affix">{step.prefix}</span>}
        <span className="frac-entry">
          {step.fracBoxes === "mixed" && box(0, "whole number", "frac-entry-whole")}
          <span className="frac-entry-stack">
            {box(1, "top of the fraction", "frac-entry-box")}
            <span className="frac-entry-bar" aria-hidden />
            {box(2, "bottom of the fraction", "frac-entry-box")}
          </span>
        </span>
        {step.suffix && <span className="affix">{step.suffix}</span>}
        {step.fracBoxes === "mixed" && <span className="muted small frac-entry-note">Leave a box empty if you don't need it.</span>}
      </div>
    );
  }
  if (step.kind === "number") {
    return (
      <div className="answer-row">
        {step.prefix && <span className="affix">{step.prefix}</span>}
        {step.overDen !== undefined ? (
          // NumberStep.overDen (MG9): the box is the top of a stacked fraction over a printed denominator.
          <span className="frac-entry-stack sentence-over-den number-over-den">
            <input
              ref={answerRef}
              className={`answer frac-entry-box${step.tone ? ` q${step.tone}` : ""}`}
              inputMode="decimal"
              {...numberPadProps(early, "inline")}
              autoComplete="off"
              aria-label={`Your answer, the top of a fraction over ${step.overDen}`}
              placeholder={step.money ? "0.00" : step.frac ? "n/d" : undefined}
              value={state.inputs[0]}
              onChange={(e) => onChange([e.target.value, ""])}
              onKeyDown={enter}
            />
            <span className="frac-entry-bar" aria-hidden />
            <span className="frac-entry-fixed">{step.overDen}</span>
          </span>
        ) : (
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
        )}
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
  if (step.stacked) {
    // RatioStep.stacked: box 1 over a bar over box 2, one handwritten fraction.
    return (
      <div className="answer-row sentence-input">
        {before && (
          <span>
            <MathText>{before}</MathText>
          </span>
        )}
        <span className="frac-entry-stack sentence-over-den">
          <input className="answer sentence-input-box" inputMode="decimal" autoComplete="off" value={state.inputs[0]} aria-label={step.labels?.[0] ?? "top of the fraction"} onChange={(e) => onChange([e.target.value, state.inputs[1]])} onKeyDown={enter} />
          <span className="frac-entry-bar" aria-hidden />
          <input className="answer sentence-input-box" inputMode="decimal" autoComplete="off" value={state.inputs[1]} aria-label={step.labels?.[1] ?? "bottom of the fraction"} onChange={(e) => onChange([state.inputs[0], e.target.value])} onKeyDown={enter} />
        </span>
        {after && (
          <span>
            <MathText>{after}</MathText>
          </span>
        )}
      </div>
    );
  }
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
 * A FractionStep answer inside <AnswerFormPick>: pick the kind first (no kind
 * is picked at the start, so the boxes don't give the answer's kind away),
 * then type into the boxes that kind shows. Switching kinds keeps the numbers
 * that still fit. inputs: [whole, top, bottom, kind].
 */
function FormFractionInput({ state, onChange, onSubmit }: { state: StepState; onChange: (v: string[]) => void; onSubmit: (v: string[]) => void }) {
  const early = useEarlyLearner();
  const rowRef = useRef<HTMLSpanElement>(null);
  const values: [string, string, string] = [state.inputs[0] ?? "", state.inputs[1] ?? "", state.inputs[2] ?? ""];
  const form: AnswerForm | "" = isAnswerForm(state.inputs[3]) ? state.inputs[3] : "";
  const show = form ? formBoxes(form) : [false, false, false];
  const mark = state.formMark;
  const pickForm = (f: AnswerForm) => {
    onChange([...keepFitting(values, f), f]);
    // Put the cursor in the first box the new kind shows.
    window.setTimeout(() => rowRef.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }), 0);
  };
  const set = (idx: number, v: string) => {
    const next = [...values];
    next[idx] = v;
    onChange([...next, form]);
  };
  const boxStyle = mark?.boxes === undefined ? undefined : { borderColor: mark.boxes ? "var(--good)" : "var(--bad)" };
  const box = (idx: number, label: string, cls: string) => (
    <input
      className={`answer ${cls}`}
      inputMode="numeric"
      {...numberPadProps(early, "enter")}
      autoComplete="off"
      aria-label={label}
      value={values[idx]}
      style={boxStyle}
      onChange={(e) => set(idx, e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && formFilled(form, values)) onSubmit(state.inputs);
      }}
    />
  );
  return (
    <div className="answer-row frac-entry-row form-entry-row">
      <FormPicker value={form} onPick={pickForm} mark={mark ? (mark.form ? "good" : "bad") : undefined} />
      {form && (
        <span className="frac-entry" ref={rowRef}>
          {show[0] && box(0, "whole number", "frac-entry-whole")}
          {show[1] && (
            <span className="frac-entry-stack">
              {box(1, "numerator", "frac-entry-box")}
              <span className="frac-entry-bar" aria-hidden />
              {box(2, "denominator", "frac-entry-box")}
            </span>
          )}
        </span>
      )}
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
