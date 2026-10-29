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
      step: { kind: "number", prompt: `How many more do you need to add to ${a} to make 10?`, hint: "Count up from the number to 10.", explain: `${a} + ${gap} = 10.`, answer: gap },
    },
  ];
};

/** Full make-ten addition, small gap (8 or 9) — the near-ten bucket. */
export const makeTenNearTenNumberQuestion = (): TestQuestion[] => {
  const a = randInt(8, 9);
  const gap = 10 - a;
  const b = randInt(gap + 1, 9);
  const { addToA, total } = makeTenBreakdown(a, b);
  return [
    {
      visual: <TenFrameGroup value={b} tone="b" splitAt={addToA} tone2="c" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Use make-ten: what is ${a} + ${b}?`, hint: `${a} needs ${gap} more to make ten.`, explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Full make-ten addition, larger gap (6 or 7) — more decomposing required. */
export const makeTenLargerGapNumberQuestion = (): TestQuestion[] => {
  const a = randInt(6, 7);
  const gap = 10 - a;
  const b = randInt(gap + 1, 9);
  const { addToA, total } = makeTenBreakdown(a, b);
  return [
    {
      visual: <TenFrameGroup value={b} tone="b" splitAt={addToA} tone2="c" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Use make-ten: what is ${a} + ${b}?`, hint: `${a} needs ${gap} more to make ten.`, explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** The named misconception, made concrete: the near-ten number is written
 *  SECOND, so "always break apart the second number" fails here. */
export const wrongAddendChoiceQuestion = (): TestQuestion[] => {
  const nearTen = randInt(8, 9);
  const other = randInt(10 - nearTen + 1, 9);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `${other} + ${nearTen} — which number should you break apart to make a ten?`, hint: "Break apart whichever number is FARTHER from ten, no matter which order they're written in.", explain: `Break apart ${other} — ${nearTen} is already close to ten, so keep it whole.` },
        String(other),
        [String(nearTen)] // misconception: always breaking apart whichever is written second
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
      step: { kind: "number", prompt: `${start} − ${sub}: subtract just enough to land exactly on a ten. How much is that?`, hint: "What's left of the starting number after you drop the ones digit?", explain: `${start} − ${toTen} = ${start - toTen}.`, answer: toTen },
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
        { prompt: `${start} − ${sub}: after subtracting ${toTen} to reach ${ten}, how much MORE do you still need to subtract?`, hint: `You've only subtracted ${toTen} of the ${sub} total so far.`, explain: `${sub} − ${toTen} = ${remainder} still to subtract — reaching the ten isn't the final answer yet.` },
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
      visual: <TenFrameGroup value={start} tone="c" splitAt={ten} tone2="b" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `Use bridging through ten: what is ${start} − ${sub}?`, hint: `First reach ${ten}, then subtract what's left.`, explain: `${start} − ${sub} = ${total}.`, answer: total },
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
      step: { kind: "number", prompt: `${a1} + ${b1} = ${a2} + ? — without adding from scratch, what's the missing addend?`, hint: `${a2} is ${Math.abs(k)} ${k > 0 ? "more" : "less"} than ${a1} — the other addend shifts the opposite way.`, explain: `${total} − ${a2} = ${b2}.`, answer: b2 },
    },
  ];
};

/** Equivalent-sum compensation direction, as a choice — the generalization check. */
export const equivalentSumChoiceQuestion = (): TestQuestion[] => {
  const a1 = randInt(3, 7);
  const b1 = randInt(3, 8);
  const k = [1, 2, 3][randInt(0, 2)];
  const a2 = a1 + k;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${a1} + ${b1} has the same total as ${a2} + ?. Since ${a2} is ${k} MORE than ${a1}, what must the other addend be?`,
          hint: "One addend going up means the other must come down by the same amount, to keep the total the same.",
          explain: `${k} LESS than ${b1} — one addend's gain is always the other's exact loss, for the total to stay the same.`,
        },
        `${k} less than ${b1}`,
        [`${k} more than ${b1}`, `the same as ${b1}`]
      ),
    },
  ];
};

/** True/false generalization: make-ten is a reusable strategy, not a single memorized answer. */
export const strategyGeneralizationQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: the make-ten strategy (find the gap to ten, split the other addend, then add) works for ANY addition fact with a number close to ten — not just the one example you first practiced it on.",
          hint: "Try it on a fact you haven't seen before, like 7 + 5. Does the same 3-step process still work?",
          explain: "Always true — the SAME three steps work on every fact shaped like this, which is exactly what makes it a strategy rather than a single memorized answer.",
        },
        "True",
        ["False"] // misconception: treating make-ten as tied to one specific fact
      ),
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
