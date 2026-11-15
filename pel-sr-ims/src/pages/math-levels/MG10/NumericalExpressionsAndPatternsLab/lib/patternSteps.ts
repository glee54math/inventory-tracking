// Unit 5 step builders shared by Patterns.tsx AND its Test (never a unit <->
// Test cycle), so Practice and the Test word and grade the same way.

import { choice, numberBlank, plotStep, selectBlank, sentence, type ChoiceStep, type NumberStep, type PlotStep, type SentenceStep } from "../../../shared/engine/types";
import { gridFor, ordinal, pairsOf, relationWords, termAt, terms, type PatternPair, type Relation } from "./patterns";

const kindWord = (r: Relation) => (r.kind === "times" ? "times" : "more than");
const relNumber = (r: Relation) => (r.kind === "times" ? r.k : r.c);

/**
 * "Each Pattern B term is [k] [times / more than] the matching Pattern A term."
 * A typed number plus a tap pick (the pick alone could be guessed). With
 * `points`, the same sentence about the plotted points' two numbers.
 * Picking "times" for a "more than" pair (or the reverse) gets a message that
 * checks a second column, without giving the number.
 */
export const relationStep = (p: PatternPair, count: number, points = false): SentenceStep => {
  const a = terms(p.A, count);
  const b = terms(p.B, count);
  const word = kindWord(p.rel);
  const step = sentence(
    {
      prompt: points ? "Look at each point. How does its second number compare with its first number?" : "How does each Pattern B term compare with the matching Pattern A term?",
      hint: "Check more than one column. The same rule must work for every pair.",
      explain:
        p.rel.kind === "times"
          ? `${a[1]} × ${p.rel.k} = ${b[1]}, ${a[2]} × ${p.rel.k} = ${b[2]}, and so on. Each B term is ${p.rel.k} times the A term.`
          : `${a[1]} + ${p.rel.c} = ${b[1]}, ${a[2]} + ${p.rel.c} = ${b[2]}, and so on. Each B term is ${p.rel.c} more than the A term.`,
    },
    points ? "Each point's second number is " : "Each Pattern B term is ",
    numberBlank(relNumber(p.rel)),
    " ",
    selectBlank(word, [word === "times" ? "more than" : "times"]),
    points ? " its first number." : " the matching Pattern A term."
  );
  return {
    ...step,
    checkEach: true,
    diagnose: (inputs) => {
      const picked = step.blanks[1].kind === "select" ? step.blanks[1].choices[Number(inputs[1])] : "";
      const typed = Number(inputs[0]);
      const n = Number.isInteger(typed) && typed > 1 ? typed : 2;
      if (picked && picked !== word) {
        // A column where "times n" fails (the 2nd one if it can).
        const fails = a.map((_, k) => k).filter((k) => a[k] * n !== b[k]);
        const i = fails.find((k) => k > 0) ?? fails[0] ?? 1;
        return p.rel.kind === "more"
          ? `Check the ${ordinal(i + 1)} column: ${a[i]} × ${n} is not ${b[i]}. "Times" has to work for every pair.`
          : `${b[1]} is ${b[1] - a[1]} more than ${a[1]}, but ${b[2]} is ${b[2] - a[2]} more than ${a[2]}. "More than" has to be the same for every pair.`;
      }
      if (picked === word) return "The word is right. Check the number in one column.";
      return null;
    },
  };
};

/** "The 10th term of Pattern A is X. What is the 10th term of Pattern B?" — use the relationship. */
export const predictStep = (p: PatternPair, nth = 10): NumberStep => {
  const x = termAt(p.A, nth);
  const y = termAt(p.B, nth);
  return {
    kind: "number",
    prompt: `The ${ordinal(nth)} term of Pattern A is ${x}. What is the ${ordinal(nth)} term of Pattern B?`,
    hint: "Use the rule that links B to A. You don't need to list all the terms.",
    explain: `Each B term is ${relationWords(p.rel)} the A term, so ${p.rel.kind === "times" ? `${x} × ${p.rel.k}` : `${x} + ${p.rel.c}`} = ${y}.`,
    answer: y,
    diagnose: (v) =>
      p.rel.kind === "more" && v === x * p.rel.c
        ? `You multiplied. Each B term is ${p.rel.c} MORE than its A term.`
        : p.rel.kind === "times" && v === x + p.rel.k
          ? `You added ${p.rel.k}. Each B term is ${p.rel.k} TIMES its A term.`
          : null,
  };
};

/** Plot the ordered pairs (A term, B term) for the first `count` terms. */
export const plotPairsStep = (p: PatternPair, count: number): PlotStep => {
  const pts = pairsOf(p, count);
  return plotStep(
    {
      prompt: `Plot the ${count} ordered pairs (Pattern A term, Pattern B term).`,
      hint: "For each pair, start at 0. Go across to the first number, then up to the second number.",
      explain: `The points are ${pts.map(([x, y]) => `(${x}, ${y})`).join(", ")}.`,
    },
    pts,
    { ...gridFor(pts), xLabel: "Pattern A", yLabel: "Pattern B" }
  );
};

/**
 * 5.OA.3 "explain informally why" (round 1, C1-18), for a "times" pair only:
 * why is every B term k times the A term? Shuffled choices. Every wrong
 * choice is a false statement (round 2, E2-20 + C2-03).
 */
export const whyTimesStep = (p: PatternPair): ChoiceStep => {
  const k = p.rel.kind === "times" ? p.rel.k : 2;
  return choice(
    {
      prompt: `Why is every Pattern B term ${k} times the matching Pattern A term?`,
      hint: "Compare the two rules: where each pattern starts, and what each one adds.",
      explain: `Pattern B starts at ${p.B.start} = ${k} × ${p.A.start} and adds ${p.B.add} = ${k} × ${p.A.add} each time. So every B term stays ${k} times the A term.`,
    },
    `B's first term is ${k} × A's first term, and B adds ${k} times as much each time.`,
    // Both wrong choices are false statements (round 2, E2-20 + C2-03).
    [
      // Uses k too, so the right choice isn't the only one with "{k}" in it (round 3, C3-04).
      `B starts ${k} higher than A and adds the same number as A.`, // false for every times pair: B adds k × A's number
      "It works in the first column, so it works in every column.", // the one-column misconception
    ]
  );
};
