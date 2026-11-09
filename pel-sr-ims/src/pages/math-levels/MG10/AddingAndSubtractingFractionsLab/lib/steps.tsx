import type { ReactNode } from "react";
import { fractionStep, numberBlank, sentence, type FractionStep, type NumberStep, type SentenceStep } from "../../../shared/engine/types";
import { Frac } from "../../../shared/engine/controls";
import { spokenFraction } from "../../../shared/components/MathText";
import { lcd, lcdDiagnose, pieceWord } from "./fractions";

/** The three text fields every Step shares. */
export interface StepText {
  prompt: ReactNode;
  hint: ReactNode;
  explain: ReactNode;
}

/** A mixed number (or plain fraction, or whole number) with a stacked fraction part. */
export function M({ w = 0, n, d }: { w?: number; n: number; d: number }) {
  // A mixed number is one thing to a screen reader: "2 and 3 over 4".
  const mixed = w > 0 && n > 0;
  return (
    // Same spacing as MathText's mixed numbers (.frac-text).
    <span className={mixed ? "frac-text" : undefined} style={{ whiteSpace: "nowrap" }} role={mixed ? "math" : undefined} aria-label={mixed ? spokenFraction(n, d, w) : undefined}>
      {(w > 0 || n === 0) && <>{w}</>}
      {n > 0 && <Frac n={n} d={d} />}
    </span>
  );
}

/**
 * A fraction with typed boxes in it, for a Check for Understanding sentence:
 * `<BoxFrac n={box} d={12} />` is a box over 12; either part can be a box or a
 * number. The fraction bar spans the wider part.
 */
export function BoxFrac({ n, d }: { n: ReactNode; d: ReactNode }) {
  return (
    <span className="box-frac">
      <span className="box-frac-n">{n}</span>
      <span className="box-frac-bar" aria-hidden />
      <span className="box-frac-d">{d}</span>
    </span>
  );
}

/** "What is the LCD of a and b?" — any other common denominator gets named feedback. */
export function lcdStep(a: number, b: number, text?: Partial<StepText>): NumberStep {
  const L = lcd(a, b);
  return {
    kind: "number",
    prompt: text?.prompt ?? `What is the LCD of ${a} and ${b}?`,
    hint: text?.hint ?? `List the multiples of ${Math.max(a, b)}. Find the first one that ${Math.min(a, b)} goes into.`,
    explain:
      text?.explain ??
      (L === a * b ? `${L} is the first number both ${a} and ${b} go into. Here it is ${a} × ${b}.` : L === Math.max(a, b) ? `${Math.min(a, b)} goes into ${Math.max(a, b)}, so the LCD is ${L}.` : `${L} is the first number both ${a} and ${b} go into. ${a} × ${b} = ${a * b} is bigger than you need.`),
    answer: L,
    diagnose: lcdDiagnose(a, b),
  };
}

/**
 * "Rewrite both with the LCD" — two numerator boxes, each stacked over the
 * printed LCD (SentenceStep.overDen). Whole numbers (mixed numbers) are
 * carried through unchanged.
 */
export function rewriteStep(n1: number, d1: number, n2: number, d2: number, text?: Partial<StepText>, w1 = 0, w2 = 0): SentenceStep {
  const L = lcd(d1, d2);
  const a = (n1 * L) / d1;
  const b = (n2 * L) / d2;
  const lead = (w: number) => (w > 0 ? `${w} ` : "");
  const k1 = L / d1;
  const k2 = L / d2;
  const part = (n: number, d: number, k: number) => (k === 1 ? `${n}/${d} already has ${L} on the bottom` : `${n}/${d} = ${n * k}/${L} (top and bottom × ${k})`);
  return sentence(
    {
      prompt: text?.prompt ?? `Rewrite both with ${L} as the denominator.`,
      hint: text?.hint ?? (k1 > 1 ? `${d1} × ${k1} = ${L}, so multiply the top of ${n1}/${d1} by ${k1} too. Do the same for ${n2}/${d2}.` : `${d2} × ${k2} = ${L}, so multiply the top of ${n2}/${d2} by ${k2} too.`),
      explain:
        text?.explain ??
        `${part(n1, d1, k1)}, and ${part(n2, d2, k2)}.${w1 || w2 ? " The whole numbers don't change." : ""}`,
    },
    `${lead(w1)}${n1}/${d1} = ${lead(w1)}`,
    numberBlank(a),
    `   and   ${lead(w2)}${n2}/${d2} = ${lead(w2)}`,
    numberBlank(b),
    "",
    [L, L]
  );
}

/** The final answer, typed in simplest form (whole box + fraction boxes). */
export function answerStep(text: StepText, num: number, den: number, diagnose?: FractionStep["diagnose"]): FractionStep {
  return fractionStep(text, num, den, { mixed: true, simplest: true, diagnose });
}

/** "a/b = ?/D" with the denominator printed — one numerator box. */
export function numeratorStep(text: StepText, num: number, den: number, diagnose?: FractionStep["diagnose"]): FractionStep {
  return fractionStep(text, num, den, { den, diagnose });
}

/** "sixths" etc., re-exported for prompts. */
export { pieceWord };
