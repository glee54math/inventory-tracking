import type { ReactNode } from "react";
import { numberBlank, sentence, type Step } from "../../../shared/engine/types";
import { Frac } from "../../../shared/engine/controls";

/** The three text fields every Step shares (engine/types.ts's BaseStep isn't exported). */
export interface StepText {
  prompt: ReactNode;
  hint: ReactNode;
  explain: ReactNode;
}

/**
 * The answer box(es) for "how much?" when the answer is a count of 1/d
 * pieces — picks the input shape from the VALUE itself, so a generator never
 * has to special-case it:
 *   - an exact whole number  -> one plain number box ("3"),
 *   - less than one whole    -> one numerator box with "/d" printed after it
 *                               (like-denominator work: the denominator is
 *                               given, the student counts pieces),
 *   - more than one, not whole -> a whole-number box + a numerator box over
 *                               d, i.e. a mixed number (a SentenceStep with
 *                               two number blanks, so the review screen's
 *                               answer text reads "2 3/8", not "2 : 3").
 * Never simplified — 4.NF.3 like-denominator answers keep their denominator,
 * consistent with MG9_IntroToFractionsLab's own "denominator stays d —
 * what's the numerator?" convention.
 */
export function amountStep(text: StepText, pieces: number, d: number, unit = ""): Step {
  const u = unit ? ` ${unit}` : "";
  if (pieces % d === 0) {
    return { ...text, kind: "number", answer: pieces / d, suffix: unit || undefined };
  }
  if (pieces < d) {
    return {
      ...text,
      prompt: (
        <>
          {text.prompt} <span className="muted small">(The denominator stays {d} — type the numerator.)</span>
        </>
      ),
      kind: "number",
      answer: pieces,
      suffix: `/${d}${u}`,
    };
  }
  return sentence(
    {
      ...text,
      prompt: (
        <>
          {text.prompt} <span className="muted small">(Write it as a mixed number: whole number, then the numerator.)</span>
        </>
      ),
    },
    "",
    numberBlank(Math.floor(pieces / d)),
    " ",
    numberBlank(pieces % d),
    `/${d}${u}`
  );
}

/** A mixed number / fraction typeset with a stacked fraction part, from a
 *  piece count: 19 eighths -> "2 ⅜" (never simplified). */
export function Amount({ pieces, d }: { pieces: number; d: number }) {
  const w = Math.floor(pieces / d);
  const r = pieces % d;
  if (r === 0) return <>{w}</>;
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      {w > 0 && <>{w} </>}
      <Frac n={r} d={d} />
    </span>
  );
}
