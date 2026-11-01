import { ConversionTable } from "../diagrams";
import { fmt, pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { CONVS, bigWord, leftoverSmall, pickConv, wrongFactor, type Conv, type Family } from "../lib/measures";

// ---------- end-of-unit test: Comparing & Converting Measurement Units ----------
// 10 questions, 10 generators. Shared conversion data comes from ../lib/measures
// (a leaf module), never from ConvertingUnits.tsx — that file imports this one,
// so importing back would be the circular import every *Test.tsx avoids.
// Every question is a typed number, a two-box ratio, or a choice — no
// CustomStep, since a no-feedback test can't let a student get stuck.

const ADJ: Record<Family, string> = { length: "longer", mass: "heavier", weight: "heavier", capacity: "more water", time: "longer" };

// Q1 — the bare fact (metric mass/capacity). Easy.
export function factQuestion(families: Family[] = ["mass", "capacity"]): () => TestQuestion[] {
  return () => {
    const c = pickConv(pick(families));
    return [
      {
        visual: null,
        difficulty: "easy",
        step: {
          kind: "number",
          prompt: `1 ${c.big} = how many ${c.smalls}?`,
          suffix: c.smallAb,
          hint: `A fact to remember: 1 ${c.bigAb} = ? ${c.smallAb}.`,
          explain: `1 ${c.big} = ${fmt(c.f)} ${c.smalls}.`,
          answer: c.f,
        },
      },
    ];
  };
}

// Q2-Q4 — big → small, one family each (length / weight / time).
export function bigToSmallQuestion(family: Family, difficulty: "easy" | "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const c = pickConv(family);
    const v = difficulty === "hard" ? randInt(10, 15) : randInt(2, 9);
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "number",
          prompt: `${v} ${c.bigs} = how many ${c.smalls}?`,
          suffix: c.smallAb,
          hint: `1 ${c.big} = ${fmt(c.f)} ${c.smalls}. Smaller unit, so multiply.`,
          explain: `${v} × ${fmt(c.f)} = ${fmt(v * c.f)} ${c.smalls}.`,
          answer: v * c.f,
        },
      },
    ];
  };
}

// Q5 — multiply or divide? Distractors: the direction flip ("divide"), the
// additive misconception ("add/subtract the factor"), and the wrong factor
// (1000 vs 100 swapped, or "time and ounces work in tens").
export function multiplyOrDivideQuestion(): TestQuestion[] {
  const c = pickConv();
  const toSmall = Math.random() < 0.6;
  const v = randInt(2, 9);
  const wf = fmt(wrongFactor(c));
  const f = fmt(c.f);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: toSmall ? `To change ${v} ${c.bigs} into ${c.smalls}, what should you do?` : `To change ${fmt(v * c.f)} ${c.smalls} into ${c.bigs}, what should you do?`,
          hint: toSmall ? "Smaller unit → you need MORE of them." : "Bigger unit → you need FEWER of them.",
          explain: toSmall
            ? `A ${c.small} is smaller than a ${c.big}, so you need more of them: multiply by ${f}. ${v} × ${f} = ${fmt(v * c.f)}.`
            : `A ${c.big} is bigger than a ${c.small}, so you need fewer of them: divide by ${f}. ${fmt(v * c.f)} ÷ ${f} = ${v}.`,
        },
        toSmall ? `Multiply by ${f}` : `Divide by ${f}`,
        toSmall
          ? [
              `Divide by ${f}`, // direction flip
              `Add ${f}`, // additive misconception
              `Multiply by ${wf}`, // wrong factor
            ]
          : [
              `Multiply by ${f}`, // direction flip
              `Subtract ${f}`, // additive misconception
              `Divide by ${wf}`, // wrong factor
            ]
      ),
    },
  ];
}

// Q6 — which is more? Targets "the bigger NUMBER is the bigger amount": the
// small-unit number is ALWAYS numerically bigger, but usually the smaller amount.
export function compareQuestion(): TestQuestion[] {
  const c = pickConv();
  const v = randInt(2, 9);
  const deltas = c.f === 1000 ? [50, 100, 200, 500] : c.f === 100 ? [5, 10, 20, 50] : c.f === 60 ? [5, 10, 15, 20] : [1, 2, 4, 8];
  const d = pick(deltas);
  const bigWins = Math.random() < 0.65;
  const s = bigWins ? v * c.f - d : v * c.f + d;
  const bigText = `${v} ${c.bigs}`;
  const smallText = `${fmt(s)} ${c.smalls}`;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which is ${ADJ[c.family]}: ${bigText} or ${smallText}?`,
          hint: `Change ${bigText} into ${c.smalls} first, then compare.`,
          explain: `${bigText} = ${fmt(v * c.f)} ${c.smalls}, which is ${bigWins ? "more" : "less"} than ${fmt(s)} ${c.smalls}. Compare in the SAME unit — not just the numbers.`,
        },
        bigWins ? bigText : smallText,
        [
          bigWins ? smallText : bigText, // "bigger number = more" (or its reverse)
          "They are the same amount", // "close enough" / ignored the units
        ]
      ),
    },
  ];
}

// Q7 — mixed measurement → small unit (placeholder-zero case reachable:
// 3 km 50 m = 3,050 m, not 350 m). Hard.
export function mixedMeasureQuestion(): TestQuestion[] {
  const c = pickConv();
  const v = randInt(1, 9);
  const r = leftoverSmall(c.f);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `${v} ${bigWord(c, v)} ${r} ${r === 1 ? c.small : c.smalls} = how many ${c.smalls}?`,
        suffix: c.smallAb,
        hint: `Change the ${c.bigs} first (× ${fmt(c.f)}), then add the extra ${r}.`,
        explain: `${v} × ${fmt(c.f)} = ${fmt(v * c.f)}, plus ${r} = ${fmt(v * c.f + r)} ${c.smalls}.`,
        answer: v * c.f + r,
      },
    },
  ];
}

const tableVisual = (c: Conv, rows: { big: number; small: number | null }[]) => (
  <ConversionTable leftHead={c.bigs} rightHead={c.smalls} rows={rows.map((r) => ({ left: fmt(r.big), right: r.small === null ? null : fmt(r.small) }))} />
);

// Q8 — fill two missing rows of a two-column table. Medium.
export function tableRowsQuestion(): TestQuestion[] {
  const c = pickConv();
  const a = randInt(2, 6);
  const b = randInt(a + 1, 12);
  return [
    {
      visual: tableVisual(c, [
        { big: 1, small: c.f },
        { big: a, small: null },
        { big: b, small: null },
      ]),
      difficulty: "medium",
      step: {
        kind: "ratio",
        tones: "none",
        frame: ["", "and", ""],
        labels: [`${a} ${c.bigAb}`, `${b} ${c.bigAb}`],
        prompt: `Fill in the two missing ${c.smalls} in the table.`,
        hint: `Each row is the ${c.bigs} × ${fmt(c.f)}.`,
        explain: `${a} × ${fmt(c.f)} = ${fmt(a * c.f)} and ${b} × ${fmt(c.f)} = ${fmt(b * c.f)}.`,
        equivalentHint: `Each box is its own row: ${a} × ${fmt(c.f)} and ${b} × ${fmt(c.f)}.`,
        answer: [a * c.f, b * c.f],
      },
    },
  ];
}

// Q9 — small → big (divide). Hard.
export function smallToBigQuestion(): TestQuestion[] {
  const c = pickConv();
  const v = randInt(2, 9);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `${fmt(v * c.f)} ${c.smalls} = how many ${c.bigs}?`,
        suffix: c.bigAb,
        hint: `Bigger unit → fewer of them. Divide by ${fmt(c.f)}.`,
        explain: `${fmt(v * c.f)} ÷ ${fmt(c.f)} = ${v} ${c.bigs}.`,
        answer: v,
      },
    },
  ];
}

// Q10 — the table's rule. Distractors: additive ("+ f"), direction ("÷ f"),
// and base-ten assumption ("× 100" for time, "× 10" for ounces, 1000/100 swap).
export function tableRuleQuestion(): TestQuestion[] {
  const c = pick(CONVS);
  const f = fmt(c.f);
  return [
    {
      visual: tableVisual(c, [1, 2, 3, 4].map((n) => ({ big: n, small: n * c.f }))),
      difficulty: "hard",
      step: choice(
        {
          prompt: "Which rule makes every row of this table?",
          hint: "Test the rule on the row for 2 or 3, not just the row for 1.",
          explain: `${c.smalls} = ${c.bigs} × ${f}. Adding ${f} only works for the first row: 2 + ${f} isn't ${fmt(2 * c.f)}.`,
        },
        `${c.smalls} = ${c.bigs} × ${f}`,
        [
          `${c.smalls} = ${c.bigs} + ${f}`, // additive pattern
          `${c.smalls} = ${c.bigs} ÷ ${f}`, // direction flip
          `${c.smalls} = ${c.bigs} × ${fmt(wrongFactor(c))}`, // wrong (base-ten) factor
        ]
      ),
    },
  ];
}

export const convertingUnitsTest: Unit["test"] = {
  questions: [
    factQuestion(),
    bigToSmallQuestion("length", "easy"),
    bigToSmallQuestion("weight", "medium"),
    bigToSmallQuestion("time", "medium"),
    multiplyOrDivideQuestion,
    compareQuestion,
    mixedMeasureQuestion,
    tableRowsQuestion,
    smallToBigQuestion,
    tableRuleQuestion,
  ],
  passScore: 9,
};
