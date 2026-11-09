import { AmountBar } from "../diagrams";
import { choice, pictureChoice, selectBlank, sentence, type ChoiceStep, type FractionStep, type SentenceSelectBlank, type SentenceStep } from "../../../shared/engine/types";
import { pick, shuffle } from "../../../shared/lib/math";
import { biggerSmaller, lcd, pieceOne, pieceWord, simplestText, u1RenameDiagnose, u1SumDiagnose, type Person, type TwoFracs } from "./fractions";
import type { ReactNode } from "react";
import { answerStep, numeratorStep } from "./steps";

// ============================================================================
// Unit 1 step builders (round 5 redesign, user-approved 2026-11-08), shared by
// WhyNotAcross.tsx (Practice) and WhyNotAcrossTest.tsx so the Test asks the
// same questions Practice does, worded the same way. Neither file imports the
// other (no unit <-> Test cycle). Every choice step decides its right answer
// first, so no choice is right much more often than another (brute force:
// scratchpad/mg10-r5-fix/brute.mjs).
// ============================================================================

const f = (x: [number, number]) => `${x[0]}/${x[1]}`;
/** "1 sixth" / "5 sixths". */
export const pieces = (count: number, d: number) => `${count} ${count === 1 ? pieceOne(d) : pieceWord(d)}`;

/** The pair's numbers every step needs. */
export function u1Facts(p: TwoFracs) {
  const { n1, d1, n2, d2 } = p;
  const L = lcd(d1, d2);
  const a = (n1 * L) / d1;
  const b = (n2 * L) / d2;
  const s = a + b;
  const { big, small } = biggerSmaller(p);
  return { L, a, b, s, sumText: simplestText(s, L), mn: n1 + n2, md: d1 + d2, big, small, expr: `${f([n1, d1])} + ${f([n2, d2])}` };
}

// ---------- step 1: estimate ----------

export type EstimateRef = "big" | "one";

/**
 * Pick the estimate question (round 5 review, C5-07): a real estimate against
 * 1 whenever the sum is clearly away from 1: under 1 gives "Less", over 1
 * gives "More". Only a sum near 1 or exactly 1 is asked against the bigger
 * fraction ("More"). "Clearly" = at least 1/12 away, a gap of 15 px or more
 * on the end-to-end bar, so the picture settles it. The answer follows the
 * sum's size, which u1Params decides first: over all Unit 1 Practice this is
 * about 47% "Less", 53% "More" (brute force).
 */
export function estimatePlan(p: TwoFracs): { ref: EstimateRef; more: boolean } {
  const sum = p.n1 / p.d1 + p.n2 / p.d2;
  const clear = Math.abs(sum - 1) >= 1 / 12 - 1e-9;
  if (clear) return { ref: "one", more: sum > 1 };
  return { ref: "big", more: true };
}

export function estimateStep(p: TwoFracs, plan = estimatePlan(p)): ChoiceStep {
  const { big, small, expr } = u1Facts(p);
  const R = plan.ref === "big" ? f(big) : "1";
  const sum = p.n1 / p.d1 + p.n2 / p.d2;
  const explain =
    plan.ref === "big"
      ? `Adding ${f(small)} to ${f(big)} gives more than ${f(big)}. So the sum is more than ${f(big)}.`
      : `Put the two shaded parts end to end. They fill ${sum > 1 ? "more" : "less"} than 1 whole bar. So the sum is ${sum > 1 ? "more" : "less"} than 1.`;
  return choice(
    {
      prompt: `Estimate first. Will ${expr} be more or less than ${R}?`,
      hint: `Picture the two shaded parts end to end. Compare that with ${plan.ref === "big" ? `the ${f(big)} bar` : "1 whole bar"}.`,
      explain,
    },
    plan.more ? `More than ${R}` : `Less than ${R}`,
    [plan.more ? `Less than ${R}` : `More than ${R}`]
  );
}

// ---------- step 2: judge an add-across answer ----------

/** Which comparison the frame states first: "less than [ ], but more than [ ]" or the reverse. */
export type JudgeOrder = "lessFirst" | "moreFirst";

/**
 * "[Name] added across ... That gives 2/5." An add-across answer is always
 * between the two fractions, so it is always too small. That is the learning
 * target (user decision, round 6), so the student states WHY with this
 * problem's numbers in a sentence frame, not with one fixed button:
 *
 *   Raj's answer, 2/5, is less than [1/2 | 1/3], but more than [1/2 | 1/3].
 *   Adding should make a number [bigger | smaller] than each fraction you add.
 *   So Raj's answer is [too small | right | too big].
 *
 * The fraction buttons are this problem's two fractions, so the right pick
 * changes from problem to problem. Which comparison comes first is random
 * (1 in 2), so the first blank's answer is sometimes the bigger fraction and
 * sometimes the smaller one, and every blank's buttons are shuffled. Only one
 * set of picks is true: 2/5 is NOT less than 1/3 or more than 1/2. Check
 * stays off until every blank is filled; a wrong Check colors each blank and
 * names the first wrong blank (Practice only; the Test gives no feedback).
 */
export function judgeStep(p: TwoFracs, person: Person, order: JudgeOrder = pick(["lessFirst", "moreFirst"] as JudgeOrder[])): SentenceStep {
  const { n1, d1, n2, d2 } = p;
  const { mn, md, big, small, expr } = u1Facts(p);
  const X = `${mn}/${md}`;
  const A = f([n1, d1]);
  const B = f([n2, d2]);
  const lead = `${person.name} added across: ${n1} + ${n2} = ${mn} on top, ${d1} + ${d2} = ${md} on the bottom. That gives ${X}.`;
  const [w1, w2] = order === "lessFirst" ? ["less", "more"] : ["more", "less"];
  // Blanks 1 and 2: this problem's two fractions (stacked tap buttons), each blank shuffled on its own.
  const cmp1 = selectBlank(order === "lessFirst" ? f(big) : f(small), [A, B]);
  const cmp2 = selectBlank(order === "lessFirst" ? f(small) : f(big), [A, B]);
  // Blanks 3 and 4: the rule and the verdict (fixed answers, shuffled buttons; graded with blanks 1 and 2).
  const rule = selectBlank("bigger", ["smaller"]);
  const verdict = selectBlank("too small", ["right", "too big"]);
  const wrongAt = (b: SentenceSelectBlank, raw: string | undefined) => Number(raw) !== b.correct;
  return {
    ...sentence(
      {
        prompt: `${lead} Is that the sum? Fill in each blank.`,
        hint: `Compare the ${X} bar with the ${A} bar and the ${B} bar. Which bar is longer each time?`,
        explain: `${X} is more than ${f(small)}, but less than ${f(big)}. ${expr} must be more than ${f(big)}, so adding across gives an answer that is too small.`,
      },
      `${person.name}'s answer, ${X}, is ${w1} than `,
      cmp1,
      `, but ${w2} than `,
      cmp2,
      ". Adding should make a number "
    ),
    more: [
      { blank: rule, after: ` than each fraction you add. So ${person.name}'s answer is ` },
      { blank: verdict, after: "." },
    ],
    checkEach: true,
    // A short message tied to the first wrong blank, in reading order. None states the answer.
    diagnose: (inputs) => {
      if (wrongAt(cmp1, inputs[0])) return `Look at the bars. Is ${X} shorter or longer than ${cmp1.choices[Number(inputs[0])]}?`;
      if (wrongAt(cmp2, inputs[1])) return `Look at the bars. Is ${X} shorter or longer than ${cmp2.choices[Number(inputs[1])]}?`;
      if (wrongAt(rule, inputs[2])) return `Think of ${expr} as ${A}, and then ${B} more. Is that bigger or smaller than ${A}?`;
      if (wrongAt(verdict, inputs[3])) return `Read your first sentence again. ${X} is less than ${f(big)}. Should ${expr} be more or less than ${f(big)}?`;
      return null;
    },
  };
}

// ---------- step 3: find the real sum ----------

/** The fraction with the smaller bottom (the one to rename), and the other one. */
const smallerBottom = (p: TwoFracs) =>
  p.d1 < p.d2 ? { nS: p.n1, dS: p.d1, other: [p.n2, p.d2] as [number, number] } : { nS: p.n2, dS: p.d2, other: [p.n1, p.d1] as [number, number] };

/** "3 fits in 6: each third is 2 sixths." The renaming fact, for hints and explanations only. */
const fitsFact = (dS: number, L: number) => `${dS} fits in ${L}: each ${pieceOne(dS)} is ${L / dS} ${pieceWord(L)}.`;

/**
 * One bottom fits in the other: rename the fraction with the smaller bottom.
 * Round 5 review (C5-03, E5-02): the prompt no longer prints the renaming
 * ("each third is 2 sixths"). That stated the answer whenever the top was 1,
 * and it was a scaffold the Test never gives. It is in the hint now.
 */
export function renameStep(p: TwoFracs): FractionStep {
  const { L } = u1Facts(p);
  const { nS, dS, other } = smallerBottom(p);
  const k = L / dS;
  return numeratorStep(
    {
      prompt: `Write ${nS}/${dS} with the same bottom as ${f(other)}.`,
      hint: `${fitsFact(dS, L)} Find the bar with thick lines. Count the small pieces in its shaded part.`,
      explain: `${fitsFact(dS, L)} So ${nS}/${dS} = ${nS * k}/${L}.`,
    },
    nS * k,
    L,
    u1RenameDiagnose(nS, dS, L)
  );
}

/**
 * How the sum step is asked:
 *  - "afterRename": Practice, right after the rename step (the pieces already match);
 *  - "plain": one bottom fits in the other and nothing is renamed yet (the
 *    Test, and half of Practice's "fits" problems: round 5 review C5-03);
 *  - "counted": neither bottom fits in the other; count the same-size pieces in the picture.
 */
export type SumMode = "afterRename" | "plain" | "counted";

/** The sum, typed in simplest form with the answer-format buttons. */
export function sumStep(p: TwoFracs, mode: SumMode = "plain"): FractionStep {
  const { L, a, b, s, sumText, expr } = u1Facts(p);
  const steps = `${a}/${L} + ${b}/${L} = ${s}/${L}`;
  const whole = s >= L ? ` ${L}/${L} is 1 whole.` : "";
  // The "together" row is 2 bars once the sum passes 1 (E5-03: say which bar to count).
  const both = s > L ? "the bars with both colors" : "the bar with both colors";
  const { dS } = smallerBottom(p);
  return answerStep(
    {
      prompt: mode === "counted" ? `Count the shaded ${pieceWord(L)} in ${both}. Write ${expr} in simplest form.` : `Add: ${expr} = ? Write it in simplest form.`,
      hint:
        mode === "counted"
          ? `${L} ${pieceWord(L)} make 1 whole bar. Count the shaded ${pieceWord(L)} in ${both}.`
          : mode === "afterRename"
            ? `Both are ${pieceWord(L)} now. Add the tops: ${a} + ${b}. Keep ${L} on the bottom.`
            : `${fitsFact(dS, L)} Write both in ${pieceWord(L)}, then add the tops.`,
      explain: `${mode === "afterRename" ? "" : `${expr} = `}${steps}${sumText !== `${s}/${L}` ? ` = ${sumText}` : ""}.${whole}`,
    },
    s,
    L,
    u1SumDiagnose(p)
  );
}

/**
 * No shared factor: "Which picture shows a + b?" The right picture is the sum
 * cut into same-size pieces; the wrong ones are the add-across answer (too
 * small) and the tops over one of the bottoms (over the bigger bottom: too
 * small; over the smaller bottom: too big, 1 in 2 each), so the right picture
 * isn't always the most shaded. Every picture has the same number of whole
 * bars, so counting bars doesn't give it away.
 */
export function pickPictureStep(p: TwoFracs, barWidth = 180): ChoiceStep {
  const { L, a, b, s, mn, md, expr } = u1Facts(p);
  const dMin = Math.min(p.d1, p.d2);
  const dMax = Math.max(p.d1, p.d2);
  const overSmall = mn <= 2 * dMin && Math.random() < 0.5;
  const third: [number, number] = overSmall ? [mn, dMin] : [mn, dMax];
  const opts: { v: [number, number]; why: string }[] = shuffle([
    { v: [s, L] as [number, number], why: "right" },
    { v: [mn, md] as [number, number], why: "across" },
    { v: third, why: "third" },
  ]);
  const wholes = Math.max(...opts.map((o) => Math.ceil(o.v[0] / o.v[1])));
  return pictureChoice(
    {
      prompt: `Which picture shows ${expr}?`,
      hint: "Put the two shaded parts end to end. Which picture is shaded that much?",
      explain: `It shows the two parts in ${pieceWord(L)}: ${f([p.n1, p.d1])} is ${pieces(a, L)} and ${f([p.n2, p.d2])} is ${pieces(b, L)}. Adding across gives ${mn}/${md}, which is too small.`,
    },
    // Round 5 review: each picture is named by its piece size, never by its
    // fraction (the finished row shows the name, and the next step asks for
    // the sum: C5-01, E5-01). Each is drawn as a shaded length with NO piece
    // lines, so the right one can't be spotted as "the finest cut" (C5-02).
    // The three piece sizes (d1 x d2, d1 + d2, one bottom) never repeat.
    opts.map((o): [string, ReactNode] => {
      const name = `The ${pieceWord(o.v[1])} picture`;
      return [name, <AmountBar key={o.why} n={o.v[0]} d={o.v[1]} minWholes={wholes} barWidth={barWidth} height={28} label={name} />];
    }),
    opts.findIndex((o) => o.why === "right")
  );
}
