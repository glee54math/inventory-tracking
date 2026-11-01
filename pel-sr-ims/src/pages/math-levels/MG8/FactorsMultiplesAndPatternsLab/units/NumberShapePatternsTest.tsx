import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { PatternStrip, TileStages } from "../diagrams";
import { patternTerms, ruleShort, ruleText, stageTiles, type PatternRule } from "../lib/numberTheory";

// Self-contained: never imports from NumberShapePatterns.tsx (see FactorPairsTest.tsx).

export const ordinal = (n: number): string => {
  const s = n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th";
  return `${n}${s}`;
};

/** Two-step rules whose terms stay one parity after the first (the start is chosen to match). */
export const TWO_STEP: { rule: PatternRule; starts: number[] }[] = [
  { rule: { op1: "×", n1: 2, op2: "-", n2: 1 }, starts: [3, 5, 7] },
  { rule: { op1: "×", n1: 2, op2: "+", n2: 1 }, starts: [1, 3, 5] },
  { rule: { op1: "×", n1: 2, op2: "+", n2: 2 }, starts: [2, 4, 6] },
  { rule: { op1: "×", n1: 2, op2: "-", n2: 2 }, starts: [4, 6, 8] },
];

// Q1 — easy: add rule, next term
export function addNextQuestion(): TestQuestion[] {
  const s = randInt(1, 20);
  const k = randInt(2, 9);
  const t = patternTerms(s, { op1: "+", n1: k }, 5);
  return [
    {
      visual: <PatternStrip terms={[...t.slice(0, 4), null]} rule={`+${k}`} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `Rule: start at ${s}, add ${k} each time. What is the 5th term?`, hint: `${t[3]} + ${k} = ?`, explain: `${t[3]} + ${k} = ${t[4]}.`, answer: t[4] },
    },
  ];
}

// Q2 — easy: subtract rule, next term
export function subtractNextQuestion(): TestQuestion[] {
  const s = randInt(60, 99);
  const k = randInt(3, 9);
  const t = patternTerms(s, { op1: "-", n1: k }, 5);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `Rule: start at ${s}, subtract ${k} each time: ${t.slice(0, 4).join(", ")}, ___. What comes next?`, hint: `${t[3]} − ${k} = ?`, explain: `${t[3]} − ${k} = ${t[4]}.`, answer: t[4] },
    },
  ];
}

// Q3 — medium: two-step rule, next term
export function twoStepNextQuestion(): TestQuestion[] {
  const { rule, starts } = pick(TWO_STEP);
  const s = pick(starts);
  const t = patternTerms(s, rule, 4);
  return [
    {
      visual: <PatternStrip terms={[t[0], t[1], t[2], null]} rule={ruleShort(rule)} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Rule: start at ${s}, then ${ruleText(rule)}. What is the 4th term?`, hint: `Do BOTH parts to ${t[2]}: first double it, then the second step.`, explain: `${t[2]} × 2 = ${t[2] * 2}, then ${rule.op2 === "+" ? "+" : "−"} ${rule.n2} = ${t[3]}.`, answer: t[3] },
    },
  ];
}

// Q4 — medium, choice: which list follows the two-step rule?
export function twoStepListQuestion(): TestQuestion[] {
  const { rule, starts } = pick(TWO_STEP);
  const s = pick(starts);
  const right = patternTerms(s, rule, 4);
  const onlyFirst = patternTerms(s, { op1: "×", n1: 2 }, 4); // MISCONCEPTION: did only the first step
  // MISCONCEPTION: did the steps in the wrong order (second step first, then double)
  const rev = [s];
  while (rev.length < 4) {
    const x = rev[rev.length - 1];
    rev.push(2 * (rule.op2 === "+" ? x + (rule.n2 ?? 0) : x - (rule.n2 ?? 0)));
  }
  // MISCONCEPTION: did only the second step (+/− each time)
  const onlySecond = patternTerms(s, { op1: rule.op2 as "+" | "-", n1: rule.n2 ?? 0 }, 4);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Rule: start at ${s}, then ${ruleText(rule)}. Which list shows the first four terms?`, hint: "Do the rule to each term, both parts, in order.", explain: `${right.join(", ")} — each term is doubled first, then the second step.` },
        right.join(", "),
        [onlyFirst.join(", "), rev.join(", "), onlySecond.join(", ")]
      ),
    },
  ];
}

const shapeCase = () => {
  const a = randInt(1, 4);
  let b = randInt(2, 4);
  while (b === a) b = randInt(2, 4);
  return { a, b };
};

// Q5 — medium: growing shape, next stage
export function shapeNextQuestion(): TestQuestion[] {
  const { a, b } = shapeCase();
  return [
    {
      visual: <TileStages start={a} add={b} stages={[1, 2, 3]} showCounts />,
      difficulty: "medium",
      step: { kind: "number", prompt: "How many tiles will Stage 4 have?", hint: `Each stage gets ${b} more tiles.`, explain: `${stageTiles(a, b, 3)} + ${b} = ${stageTiles(a, b, 4)} tiles.`, answer: stageTiles(a, b, 4) },
    },
  ];
}

// Q6 — hard: growing shape, far stage (can't just draw one more)
export function shapeFarQuestion(): TestQuestion[] {
  const { a, b } = shapeCase();
  return [
    {
      visual: <TileStages start={a} add={b} stages={[1, 2, 3]} showCounts />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: "How many tiles will Stage 10 have?",
        hint: `Stage 1 has ${a}. To get to Stage 10 you add ${b} tiles 9 times.`,
        explain: `${a} + 9 × ${b} = ${stageTiles(a, b, 10)}. (Not 10 × ${b} — Stage 1 starts with ${a}, and only 9 groups get added.)`,
        answer: stageTiles(a, b, 10),
      },
    },
  ];
}

// Q7 — medium, choice: which rule made this pattern?
export function whichRuleQuestion(): TestQuestion[] {
  const k = randInt(3, 9);
  let s = randInt(2, 15);
  while (s === k || s === k + 1) s = randInt(2, 15);
  const t = patternTerms(s, { op1: "+", n1: k }, 4);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Which rule makes this pattern: ${t.join(", ")}, ...?`, hint: "How much does it go up from one term to the next?", explain: `Each term is ${k} more than the one before: add ${k}.` },
        `Start at ${s}, add ${k}`,
        [
          `Start at ${s}, add ${s}`, // MISCONCEPTION: the first term is the amount added
          `Start at ${s}, add ${k + 1}`, // off by one when counting the jump
          `Start at ${s}, double it`, // MISCONCEPTION: "it grows, so it's doubling"
        ]
      ),
    },
  ];
}

// Q8 — hard, choice: a feature the rule doesn't mention (all even)
export function allEvenQuestion(): TestQuestion[] {
  const s = 2 * randInt(1, 10);
  const k = pick([2, 4, 6, 8]);
  const t = patternTerms(s, { op1: "+", n1: k }, 5);
  return [
    {
      visual: <PatternStrip terms={t} rule={`+${k}`} />,
      difficulty: "hard",
      step: choice(
        { prompt: `Rule: start at ${s}, add ${k}. Which is true about EVERY term, even though the rule doesn't say it?`, hint: "Is the start even or odd? What happens when you add an even number?", explain: "Every term is even: even + even is always even. The rule never said “even” — you noticed it." },
        "Every term is even",
        [
          "Every term is odd",
          "The terms go odd, even, odd, even", // MISCONCEPTION: every pattern alternates
          `Every term ends in ${s % 10}`, // MISCONCEPTION: the start's ones digit repeats
        ]
      ),
    },
  ];
}

// Q9 — hard, choice: alternating odd/even, predict a far term
export function alternatingQuestion(): TestQuestion[] {
  const s = 2 * randInt(0, 7) + 1;
  const k = pick([3, 5, 7, 9]);
  const n = randInt(9, 15);
  const t = patternTerms(s, { op1: "+", n1: k }, n);
  const even = t[n - 1] % 2 === 0;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Rule: start at ${s}, add ${k}: ${t.slice(0, 4).join(", ")}, ... Is the ${ordinal(n)} term odd or even?`, hint: "Look at the first few terms: odd, even, ...? Which terms are odd?", explain: `Adding an odd number flips odd ↔ even, so the terms alternate: odd, even, odd, even. The ${ordinal(n)} term (${t[n - 1]}) is ${even ? "even" : "odd"}.` },
        even ? "Even — the terms alternate, and every even-numbered term is even" : "Odd — the terms alternate, and every odd-numbered term is odd",
        [
          even ? "Odd — it starts odd, so it stays odd" : "Even — adding odd numbers always makes even numbers", // MISCONCEPTION: one parity forever
          "You can't tell without writing out every term", // MISCONCEPTION: features can't predict
        ]
      ),
    },
  ];
}

// Q10 — hard, choice: every term is a multiple of k
export function multipleFeatureQuestion(): TestQuestion[] {
  const k = randInt(3, 9);
  let x = randInt(40, 99);
  while (x % k === 0) x++;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Rule: start at ${k}, add ${k}. Will ${x} ever be a term in this pattern?`, hint: `What do ${k}, ${2 * k}, ${3 * k}, ... have in common?`, explain: `Every term is a multiple of ${k}, and ${x} ÷ ${k} leaves ${x % k} left over — so ${x} never shows up.` },
        `No — every term is a multiple of ${k}, and ${x} isn't`,
        [
          "Yes — the pattern keeps growing, so it reaches every number", // MISCONCEPTION: growing = hits everything
          `Yes — ${x} is between two of the terms`, // MISCONCEPTION: "between" = "in"
        ]
      ),
    },
  ];
}

export const numberShapePatternsTest: Unit["test"] = {
  questions: [addNextQuestion, subtractNextQuestion, twoStepNextQuestion, twoStepListQuestion, shapeNextQuestion, shapeFarQuestion, whichRuleQuestion, allEvenQuestion, alternatingQuestion, multipleFeatureQuestion],
  passScore: 9,
};
