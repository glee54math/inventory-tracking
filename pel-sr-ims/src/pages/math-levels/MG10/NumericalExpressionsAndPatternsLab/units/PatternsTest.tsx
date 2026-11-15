import { choice, coordinateStep, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { pick, randInt } from "../../../shared/lib/math";
import { PatternTable } from "../diagrams";
import { draw } from "../lib/expr";
import { ordinal, pairsOf, patternPair, termAt, terms, type PatternPair, type Rule } from "../lib/patterns";
import { plotPairsStep, predictStep, relationStep } from "../lib/patternSteps";

// Self-contained: never imports the paired Patterns.tsx.

type Diff = TestQuestion["difficulty"];

/** Pattern A (blue) and Pattern B (orange) with `show` terms each, then "?" up to `cols`. */
const table = (p: PatternPair, show: number, cols = show) => (
  <PatternTable
    rows={[
      { label: "Pattern A", rule: `start ${p.A.start}, add ${p.A.add}`, terms: terms(p.A, cols).map((t, i) => (i < show ? t : null)), tone: "a" },
      { label: "Pattern B", rule: `start ${p.B.start}, add ${p.B.add}`, terms: terms(p.B, cols).map((t, i) => (i < show ? t : null)), tone: "b" },
    ]}
  />
);

/** One rule: type a later term. `fromZero` picks the pool (start at 0, or start above 0). */
export function termQuestion(difficulty: Diff, fromZero: boolean): TestQuestion[] {
  const r: Rule = { start: fromZero ? 0 : randInt(1, 9), add: randInt(2, 9) };
  const nth = randInt(5, 7);
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `Start at ${r.start}. Add ${r.add} each time. What is the ${ordinal(nth)} term?`,
        hint: "The 1st term is the start. Add the same number each time.",
        explain: `${terms(r, nth).join(", ")}. The ${ordinal(nth)} term is ${termAt(r, nth)}.`,
        answer: termAt(r, nth),
        // adds the rule nth times instead of nth − 1 (the 1st term is the start)
        diagnose: (v) => (v === r.start + nth * r.add ? `That's the ${ordinal(nth + 1)} term. The 1st term is the start number.` : null),
      },
    },
  ];
}

/** How does B compare with A? "times" or "more than", typed number + pick. */
export function relationQuestion(difficulty: Diff, kind: "times" | "more"): TestQuestion[] {
  const p = patternPair(kind, 5, 40);
  return [{ visual: table(p, 5), difficulty, step: relationStep(p, 5) }];
}

/** Type one ordered pair (A term, B term). */
export function pairQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const p = patternPair(pick(["times", "more"]), 5, 40);
  const nth = randInt(2, 5);
  const [x, y] = pairsOf(p, nth)[nth - 1];
  return [
    {
      visual: table(p, 5),
      difficulty,
      step: coordinateStep(
        {
          prompt: `Write the ordered pair for the ${ordinal(nth)} terms: (Pattern A term, Pattern B term).`,
          hint: "The Pattern A term comes first, then the Pattern B term.",
          explain: `The ${ordinal(nth)} terms are ${x} and ${y}, so the ordered pair is (${x}, ${y}).`,
        },
        x,
        y
      ),
    },
  ];
}

/** Plot the ordered pairs on the grid. */
export function plotQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  // Up to 12 on both axes, like Practice (round 1, C1-22).
  const p = patternPair(pick(["times", "more"]), 4, 12);
  return [{ visual: table(p, 4), difficulty, step: plotPairsStep(p, 4) }];
}

/** Use the relationship: A's 10th term -> B's 10th term. */
export function predictQuestion(difficulty: Diff, kind: "times" | "more"): TestQuestion[] {
  const p = patternPair(kind, 4, 40);
  return [{ visual: table(p, 4), difficulty, step: predictStep(p, pick([8, 10, 12])) }];
}

/** Which point comes next on the graph? Traps: the numbers switched, and the B term from one step back. */
export function nextPointQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const p = patternPair(pick(["times", "more"]), 5, 40);
  const pts = pairsOf(p, 5);
  const [x, y] = pts[4];
  const [, yPrev] = pts[3];
  return [
    {
      visual: table(p, 4, 5),
      difficulty,
      step: choice(
        {
          prompt: `The first 4 points are ${pts
            .slice(0, 4)
            .map(([a, b]) => `(${a}, ${b})`)
            .join(", ")}. Which point comes next?`,
          hint: "Find the 5th term of each pattern. Pattern A's term comes first.",
          explain: `The 5th terms are ${x} and ${y}, so the next point is (${x}, ${y}).`,
        },
        `(${x}, ${y})`,
        [
          `(${y}, ${x})`, // switched: B term first
          `(${x}, ${yPrev})`, // B term from one step back
        ].filter((d) => d !== `(${x}, ${y})`)
      ),
    },
  ];
}

/**
 * The "times" trap: someone says B is 2 times A because B's 1st term is 2 ×
 * A's. Half the time that's the trap (B is really "more than"); half the
 * time it is a real "times 2" pair (round 1, C1-19), so "Yes" is sometimes
 * right. The same three choice wordings both times.
 */
export function timesTrapQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const real = Math.random() < 0.5;
  const p = real ? draw(() => patternPair("times", 4, 40), (q) => q.rel.kind === "times" && q.rel.k === 2 && q.A.start > 0) : patternPair("more", 4, 40, true);
  const a = terms(p.A, 4);
  const b = terms(p.B, 4);
  const c = p.rel.kind === "more" ? p.rel.c : 0;
  const who = pick(["Tim", "Lia", "Omar"]);
  const yesAll = "Yes. Every column works, not just the first one.";
  const sameAdd = "Yes. Both patterns add the same number."; // same add means "times"
  const no = real ? `No. Each B term is ${b[0] - a[0]} more.` : `No. ${b[1]} is not 2 × ${a[1]}. Each B term is ${c} more.`;
  return [
    {
      visual: table(p, 4),
      difficulty,
      step: choice(
        {
          prompt: `${who} says each Pattern B term is 2 times the Pattern A term, because ${b[0]} = 2 × ${a[0]}. Is ${who} right?`,
          hint: "Check the 2nd and 3rd columns too.",
          explain: real
            ? `${a.map((x, i) => `${x} × 2 = ${b[i]}`).join(", ")}. Every column works, so each B term is 2 times the A term.`
            : `${b[1]} is not 2 × ${a[1]}. Each B term is ${c} more than the A term: ${a.map((x, i) => `${x} + ${c} = ${b[i]}`).join(", ")}.`,
        },
        real ? yesAll : no,
        // checks only the first pair ("Yes" for the trap); calls a times pair "more than"; same add means "times"
        [real ? no : yesAll, sameAdd]
      ),
    },
  ];
}

export const patternsTest: Unit["test"] = {
  questions: [
    () => termQuestion("easy", true),
    () => termQuestion("medium", false),
    () => relationQuestion("medium", "times"),
    () => relationQuestion("medium", "more"),
    () => pairQuestion("medium"),
    () => plotQuestion("hard"),
    () => predictQuestion("medium", "times"),
    () => predictQuestion("hard", "more"),
    () => nextPointQuestion("medium"),
    () => timesTrapQuestion("hard"),
  ],
  passScore: 9,
};
