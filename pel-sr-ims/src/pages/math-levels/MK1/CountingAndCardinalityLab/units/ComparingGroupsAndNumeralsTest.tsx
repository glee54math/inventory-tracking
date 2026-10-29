import { CounterGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Comparing Groups and Numerals ----------
// 10 questions from 10 generators. Self-contained — local copy of
// MatchingRows and the big-digit helper instead of importing them from
// ComparingGroupsAndNumerals.tsx, same convention as every other *Test.tsx
// in this lab.

const bigDigit = (d: number | string) => (
  <span style={{ display: "inline-block", fontSize: 54, fontWeight: 800, fontFamily: "'Courier New', monospace" }}>{d}</span>
);

function MatchingRows({ countA, countB }: { countA: number; countB: number }) {
  const GAP = 30;
  const R = 13;
  const PAD = 20;
  const n = Math.max(countA, countB, 1);
  const width = PAD * 2 + GAP * (n - 1) + 2 * R;
  const rowY = [34, 86];
  const colors = [palette.a, palette.b];
  const counts = [countA, countB];
  return (
    <svg viewBox={`0 0 ${width} 110`} role="img" aria-label={`Two rows lined up: ${countA} and ${countB}`} style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}>
      {counts.map((count, row) => (
        <g key={row}>
          <text x={PAD} y={rowY[row] - R - 6} fontSize={12} fontWeight={700} fill={colors[row]}>
            {row === 0 ? "Top row" : "Bottom row"}
          </text>
          {Array.from({ length: count }, (_, i) => {
            const matched = i < Math.min(countA, countB);
            return (
              <circle
                key={i}
                cx={PAD + R + i * GAP}
                cy={rowY[row]}
                r={R}
                fill={matched ? colors[row] : "none"}
                stroke={matched ? palette.paper : colors[row]}
                strokeWidth={matched ? 2 : 3}
                strokeDasharray={matched ? undefined : "4 3"}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

const randDistinctPair = (min: number, max: number): [number, number] => {
  const a = randInt(min, max);
  let b = randInt(min, max);
  while (b === a) b = randInt(min, max);
  return [a, b];
};

/** One-to-one matching: which row has more. */
export const matchingMoreQuestion = (): TestQuestion[] => {
  const [a, b] = randDistinctPair(1, 10);
  const moreRow = a > b ? "Top row" : "Bottom row";
  const fewerRow = a > b ? "Bottom row" : "Top row";
  return [
    {
      visual: <MatchingRows countA={a} countB={b} />,
      difficulty: "easy",
      step: choice(
        { prompt: "Which row has MORE?", hint: "Look at which row has extra (dashed) counters left over.", explain: `The ${moreRow} has more.` },
        moreRow,
        [fewerRow] // misconception: misreading which row ran out first
      ),
    },
  ];
};

/** One-to-one matching: how many more. */
export const matchingDiffQuestion = (): TestQuestion[] => {
  const [a, b] = randDistinctPair(1, 10);
  const more = Math.max(a, b);
  const fewer = Math.min(a, b);
  const moreRow = a > b ? "Top row" : "Bottom row";
  const fewerRow = a > b ? "Bottom row" : "Top row";
  return [
    {
      visual: <MatchingRows countA={a} countB={b} />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `How many MORE does the ${moreRow} have than the ${fewerRow}?`,
        hint: "Count the unmatched (dashed) counters.",
        explain: `${more} − ${fewer} = ${more - fewer}.`,
        answer: more - fewer,
      },
    },
  ];
};

/** Counting and comparing — which has more. */
export const countCompareMoreQuestion = (): TestQuestion[] => {
  const [a, b] = randDistinctPair(1, 10);
  const more = a > b ? "Group A" : "Group B";
  const fewer = a > b ? "Group B" : "Group A";
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <CounterGroup count={a} arrangement="scatter" tone="a" seed={a * 5 + 11} />
          <CounterGroup count={b} arrangement="scatter" tone="b" seed={b * 5 + 13} />
        </div>
      ),
      difficulty: "easy",
      step: choice(
        { prompt: "Which group has MORE?", hint: "Count each group, then compare the two numbers.", explain: `Group A has ${a}, Group B has ${b}.` },
        more,
        [fewer] // misconception: picking the group that visually looks bigger instead of counting
      ),
    },
  ];
};

/** Counting and comparing — which has fewer (the paired vocabulary term). */
export const countCompareFewerQuestion = (): TestQuestion[] => {
  const [a, b] = randDistinctPair(1, 10);
  const more = a > b ? "Group A" : "Group B";
  const fewer = a > b ? "Group B" : "Group A";
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <CounterGroup count={a} arrangement="array" tone="a" seed={a * 7 + 1} />
          <CounterGroup count={b} arrangement="array" tone="b" seed={b * 7 + 2} />
        </div>
      ),
      difficulty: "easy",
      step: choice(
        { prompt: "Which group has FEWER?", hint: "Fewer means the smaller count.", explain: `Group A has ${a}, Group B has ${b}.` },
        fewer,
        [more] // misconception: confusing "fewer" with "more" (opposite vocabulary term)
      ),
    },
  ];
};

/** The genuinely hard bucket: a CLOSE difference (exactly 1), forced rather than left to chance. */
export const closeDiffQuestion = (): TestQuestion[] => {
  const a = randInt(1, 9);
  const b = a + 1;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <CounterGroup count={a} arrangement="line" tone="a" seed={a * 3 + 1} />
          <CounterGroup count={b} arrangement="line" tone="b" seed={b * 3 + 2} />
        </div>
      ),
      difficulty: "hard",
      step: { kind: "number", prompt: "What is the bigger of the two counts?", hint: "These two are close — count carefully.", explain: `${b} is one more than ${a}, so ${b} is bigger.`, answer: b },
    },
  ];
};

/** The easy end of the same skill: an obvious difference. */
export const obviousDiffQuestion = (): TestQuestion[] => {
  const a = randInt(1, 5);
  const b = a + randInt(4, 6);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <CounterGroup count={a} arrangement="line" tone="a" seed={a * 4 + 3} />
          <CounterGroup count={b} arrangement="line" tone="b" seed={b * 4 + 4} />
        </div>
      ),
      difficulty: "easy",
      step: { kind: "number", prompt: "What is the bigger of the two counts?", hint: "One group clearly has a lot more than the other.", explain: `${b} is bigger than ${a}.`, answer: b },
    },
  ];
};

/** The mandatory misconception target: equal counts, different spacing. */
export const equalTrapQuestion = (): TestQuestion[] => {
  const n = randInt(3, 10);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <CounterGroup count={n} arrangement="array" tone="a" seed={n * 2 + 1} />
          <CounterGroup count={n} arrangement="scatter" tone="b" seed={n * 2 + 200} />
        </div>
      ),
      difficulty: "hard",
      step: choice(
        {
          prompt: "Which group has more — the grid group, the scattered group, or are they the same?",
          hint: "Spreading counters out doesn't add any.",
          explain: `Both groups have ${n} — spreading them out only changes how much space they take up, not the count.`,
        },
        "They're the same",
        ["The grid group", "The scattered group"] // misconception: judging "more" by visual spread/density instead of actual count
      ),
    },
  ];
};

/** Comparing numerals directly — bigger. */
export const numeralBiggerQuestion = (): TestQuestion[] => {
  const [a, b] = randDistinctPair(1, 10);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  return [
    {
      visual: (
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {bigDigit(a)}
          <span style={{ fontSize: 30, color: "var(--muted)" }}>vs.</span>
          {bigDigit(b)}
        </div>
      ),
      difficulty: "easy",
      step: choice({ prompt: `Which numeral is BIGGER, ${a} or ${b}?`, hint: "A bigger numeral always stands for a bigger amount.", explain: `${bigger} is bigger than ${smaller}.` }, String(bigger), [String(smaller)]),
    },
  ];
};

/** Comparing numerals directly — smaller (paired vocabulary term). */
export const numeralSmallerQuestion = (): TestQuestion[] => {
  const [a, b] = randDistinctPair(1, 10);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  return [
    {
      visual: (
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {bigDigit(a)}
          <span style={{ fontSize: 30, color: "var(--muted)" }}>vs.</span>
          {bigDigit(b)}
        </div>
      ),
      difficulty: "easy",
      step: choice({ prompt: `Which numeral is SMALLER, ${a} or ${b}?`, hint: "Smaller means the lesser amount.", explain: `${smaller} is smaller than ${bigger}.` }, String(smaller), [String(bigger)]),
    },
  ];
};

/** Generalization / false trap: objects and numerals use the same idea of "bigger." */
export const objectsVsNumeralsTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: comparing two written numerals (like 6 and 9) uses a different idea of \"bigger\" than comparing two groups of objects.",
          hint: "A numeral is just a written stand-in for a count.",
          explain: "False — it's the same idea either way. 9 is bigger than 6 because nine objects would be more than six objects.",
        },
        "False",
        ["True"] // misconception: treating numeral comparison as an unrelated, more abstract skill
      ),
    },
  ];
};

export const comparingGroupsAndNumeralsTest: Unit["test"] = {
  questions: [
    matchingMoreQuestion,
    matchingDiffQuestion,
    countCompareMoreQuestion,
    countCompareFewerQuestion,
    closeDiffQuestion,
    obviousDiffQuestion,
    equalTrapQuestion,
    numeralBiggerQuestion,
    numeralSmallerQuestion,
    objectsVsNumeralsTrueFalseQuestion,
  ],
  passScore: 9,
};
