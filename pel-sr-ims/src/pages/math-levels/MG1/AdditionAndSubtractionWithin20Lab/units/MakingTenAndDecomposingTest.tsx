import { TenFrameGroup } from "../diagrams";
import { makeTenBreakdown, subtractThroughTenBreakdown } from "../logic";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Making Ten and Decomposing Numbers ----------
// 10 questions from 10 generators. Self-contained (no import from
// MakingTenAndDecomposing.tsx — only its sibling, non-circular logic.ts,
// same convention as every other *Test.tsx in this app).

/** Finding the gap to ten — the first move of make-ten, isolated. */
export const gapToTenQuestion = (): TestQuestion[] => {
  const a = randInt(6, 9);
  const gap = 10 - a;
  return [
    {
      visual: <TenFrameGroup value={a} tone="a" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `How many more does ${a} need to make 10?`, hint: "Count on to 10.", explain: `${a} + ${gap} = 10.`, answer: gap },
    },
  ];
};

/** The two numbers as given, on ten-frames: the bigger in tone a, the smaller in tone b (no split shown — the Test doesn't help). */
const givenPair = (a: number, b: number) => (
  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
    <TenFrameGroup value={a} tone="a" />
    <TenFrameGroup value={b} tone="b" />
  </div>
);

/** Full make-ten addition, small gap (8 or 9) — the near-ten bucket. */
export const makeTenNearTenNumberQuestion = (): TestQuestion[] => {
  const a = randInt(8, 9);
  const gap = 10 - a;
  const b = randInt(gap + 1, a - 1); // smaller than a: break apart the smaller number
  const { addToA, remainder, total } = makeTenBreakdown(a, b);
  return [
    {
      visual: givenPair(a, b),
      difficulty: "medium",
      step: { kind: "number", prompt: `Make a ten. What is ${a} + ${b}?`, hint: `Keep ${a} whole. Fill the ten first.`, explain: `${a} + ${addToA} = 10. 10 + ${remainder} = ${total}.`, answer: total },
    },
  ];
};

/** Full make-ten addition, larger gap (6 or 7) — more decomposing required. */
export const makeTenLargerGapNumberQuestion = (): TestQuestion[] => {
  const a = randInt(6, 7);
  const gap = 10 - a;
  const b = randInt(gap + 1, a - 1); // smaller than a: break apart the smaller number
  const { addToA, remainder, total } = makeTenBreakdown(a, b);
  return [
    {
      visual: givenPair(a, b),
      difficulty: "medium",
      step: { kind: "number", prompt: `Make a ten. What is ${a} + ${b}?`, hint: `Keep ${a} whole. Fill the ten first.`, explain: `${a} + ${addToA} = 10. 10 + ${remainder} = ${total}.`, answer: total },
    },
  ];
};

/** The named misconception, made concrete: which number to break apart.
 *  The smaller number is written first only half the time (C2-05), so
 *  neither "the first number" nor "the second number" always wins. */
export const wrongAddendChoiceQuestion = (): TestQuestion[] => {
  const nearTen = randInt(8, 9);
  const other = randInt(10 - nearTen + 1, nearTen - 1); // always the smaller number
  const smallFirst = Math.random() < 0.5;
  const [x, y] = smallFirst ? [other, nearTen] : [nearTen, other];
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `${x} + ${y}. Which number do you break apart?`, hint: "Keep the bigger number whole. It is closer to 10.", explain: `Break apart ${other}. It is smaller. Keep ${nearTen} whole.` },
        String(other),
        [String(nearTen)] // misconception: breaking apart whichever is written first / second, not the smaller one
      ),
    },
  ];
};

/** Bridging through ten — the first move, isolated (mirrors gapToTenQuestion for subtraction). */
export const subtractBridgeToTenQuestion = (): TestQuestion[] => {
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 18);
    sub = randInt(2, 9);
  } while (start % 10 >= sub);
  const { toTen } = subtractThroughTenBreakdown(start, sub);
  return [
    {
      visual: <TenFrameGroup value={start} tone="c" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `${start} − ${sub}. Get to 10 first. How many do you take away first?`, hint: "How many are past 10?", explain: `${start} − ${toTen} = ${start - toTen}.`, answer: toTen },
    },
  ];
};

/** The remainder-left-to-subtract step — targets stopping early right after
 *  reaching the ten, as if that were the final answer. */
export const subtractBridgeRemainderChoiceQuestion = (): TestQuestion[] => {
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 18);
    sub = randInt(2, 9);
  } while (start % 10 >= sub);
  const { toTen, remainder, ten } = subtractThroughTenBreakdown(start, sub);
  return [
    {
      visual: <TenFrameGroup value={start} tone="c" splitAt={ten} tone2="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `${start} − ${sub}. You took away ${toTen} to get to ${ten}. How many more do you take away?`, hint: `${sub} is ${toTen} and how many more?`, explain: `${sub} − ${toTen} = ${remainder} more to take away. 10 is not the answer yet.` },
        String(remainder),
        ["0"] // misconception: stopping as soon as you land on the ten
      ),
    },
  ];
};

/** Full bridge-through-ten subtraction, graded as a typed total. */
export const subtractBridgeNumberQuestion = (): TestQuestion[] => {
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 18);
    sub = randInt(2, 9);
  } while (start % 10 >= sub);
  const { total, ten } = subtractThroughTenBreakdown(start, sub);
  return [
    {
      visual: <TenFrameGroup value={start} tone="c" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `${start} − ${sub} = ? Get to 10 first.`, hint: `First get to ${ten}. Then take away the rest.`, explain: `${start} − ${sub} = ${total}.`, answer: total },
    },
  ];
};

/** Equivalent-sum recognition: the missing-addend version. */
export const equivalentSumNumberQuestion = (): TestQuestion[] => {
  let a1 = 0;
  let b1 = 0;
  let k = 0;
  let a2 = 0;
  let b2 = 0;
  do {
    a1 = randInt(2, 8);
    b1 = randInt(2, 9);
    k = [-3, -2, -1, 1, 2, 3][randInt(0, 5)];
    a2 = a1 + k;
    b2 = a1 + b1 - a2;
  } while (a2 < 1 || a2 > 9 || b2 < 1 || b2 > 9 || a1 + b1 > 18);
  const total = a1 + b1;
  return [
    {
      visual: <TenFrameGroup value={total} tone="a" splitAt={a1} tone2="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${a1} + ${b1} = ${a2} + ☐. What number goes in the box?`, hint: `${a2} got ${k > 0 ? "bigger" : "smaller"}. So the box gets ${k > 0 ? "smaller" : "bigger"}.`, explain: `${total} − ${a2} = ${b2}.`, answer: b2 },
    },
  ];
};

/** Same total, which way the box number moves, as a choice of numbers.
 *  The first number moves up OR down (C2-05), so the answer is sometimes the
 *  biggest choice and sometimes the smallest. */
export const equivalentSumChoiceQuestion = (): TestQuestion[] => {
  let a1 = 0;
  let k = 0;
  do {
    a1 = randInt(3, 7);
    k = [-3, -2, -1, 1, 2, 3][randInt(0, 5)];
  } while (a1 + k < 1 || a1 + k > 9);
  const absK = Math.abs(k);
  const a2 = a1 + k;
  // b1 ± k stays 1 to 9, so every choice is a real number of counters.
  const b1 = randInt(absK + 1, 9 - absK);
  const b2 = b1 - k;
  const up = k > 0;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${a1} + ${b1} = ${a2} + ☐. What number goes in the box?`,
          hint: `${a2} is ${absK} ${up ? "more" : "less"} than ${a1}. The total stays the same.`,
          explain: `${a1} got ${absK} ${up ? "bigger" : "smaller"}. So the box gets ${absK} ${up ? "smaller" : "bigger"}: ${b2}.`,
        },
        String(b2),
        [String(b1 + k), String(b1)] // misconceptions: moving the same way; not moving at all
      ),
    },
  ];
};

/** "Making ten works every time" on one NEW fact (no true/false rule
 *  statement): the smaller number written first, typed total. */
export const strategyGeneralizationQuestion = (): TestQuestion[] => {
  const big = randInt(6, 9);
  const small = randInt(11 - big, big - 1);
  const { addToA, remainder, total } = makeTenBreakdown(big, small);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `${small} + ${big}. Make a ten. What is the total?`, hint: "Keep the bigger number whole. Fill the ten first.", explain: `${big} + ${addToA} = 10. 10 + ${remainder} = ${total}.`, answer: total },
    },
  ];
};

export const makingTenAndDecomposingTest: Unit["test"] = {
  questions: [
    gapToTenQuestion,
    makeTenNearTenNumberQuestion,
    makeTenLargerGapNumberQuestion,
    wrongAddendChoiceQuestion,
    subtractBridgeToTenQuestion,
    subtractBridgeRemainderChoiceQuestion,
    subtractBridgeNumberQuestion,
    equivalentSumNumberQuestion,
    equivalentSumChoiceQuestion,
    strategyGeneralizationQuestion,
  ],
  passScore: 9,
};
