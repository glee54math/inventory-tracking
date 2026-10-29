import { CounterGroup } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: How Many? (Cardinality and Counting Objects) ----------
// 10 questions from 9 generators (one, countOutQuestion, is parameterized
// and used twice at different ranges). Self-contained, same convention as
// every other *Test.tsx in this lab.

/** Count a line/array group — the visually easiest arrangement. */
export const lineArrayCountQuestion = (): TestQuestion[] => {
  const n = randInt(3, 10);
  const arrangement = pick(["line", "array"] as const);
  return [
    {
      visual: <CounterGroup count={n} arrangement={arrangement} tone="a" seed={n * 5 + 1} />,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many counters are there in all?", hint: "Count each one exactly once, in order.", explain: `There are ${n} counters in all.`, answer: n },
    },
  ];
};

/** Count a scattered group — the standard's own named hard case. */
export const scatteredCountQuestion = (): TestQuestion[] => {
  const n = randInt(4, 10);
  return [
    {
      visual: <CounterGroup count={n} arrangement="scatter" tone="b" seed={n * 23 + 7} />,
      difficulty: "medium",
      step: { kind: "number", prompt: "How many counters are there in all?", hint: "Point to each counter as you count it, so you don't skip or double-count.", explain: `There are ${n} counters in all.`, answer: n },
    },
  ];
};

/** Count a circle arrangement — easy to lose track of the starting object. */
export const circleCountQuestion = (): TestQuestion[] => {
  const n = randInt(4, 10);
  return [
    {
      visual: <CounterGroup count={n} arrangement="circle" tone="c" seed={n * 31 + 2} />,
      difficulty: "medium",
      step: { kind: "number", prompt: "How many counters are there in all?", hint: "Pick any counter to start, then go around once without skipping or repeating any.", explain: `There are ${n} counters in all.`, answer: n },
    },
  ];
};

/** Count a bigger (11-20) mixed-arrangement group. */
export const mixed20CountQuestion = (): TestQuestion[] => {
  const n = randInt(11, 20);
  const arrangement = pick(["array", "scatter"] as const);
  return [
    {
      visual: <CounterGroup count={n} arrangement={arrangement} tone="a" seed={n * 41 + 3} />,
      difficulty: "hard",
      step: { kind: "number", prompt: "How many counters are there in all?", hint: "Count slowly, one at a time.", explain: `There are ${n} counters in all.`, answer: n },
    },
  ];
};

/** Counting OUT a given amount from a larger pile — the reverse-direction skill. */
export const countOutQuestion = (range: "mid" | "nearExhaustion" = "mid"): TestQuestion[] => {
  const total = randInt(11, 20);
  const take = range === "nearExhaustion" ? total - randInt(1, 2) : randInt(2, Math.max(2, total - 3));
  const remaining = total - take;
  return [
    {
      visual: <CounterGroup count={total} arrangement="scatter" tone="b" seed={total * 7 + take} />,
      difficulty: range === "nearExhaustion" ? "hard" : "medium",
      step: {
        kind: "number",
        prompt: `There is a pile of ${total} counters. If you count out ${take} of them, how many are left in the pile?`,
        hint: "Start with the total and count backward by how many were taken.",
        explain: `${total} take away ${take} leaves ${remaining}.`,
        answer: remaining,
      },
    },
  ];
};

/** Conflation: recounting an unchanged group never gives a different total. */
export const recountChoiceQuestion = (): TestQuestion[] => {
  const n = randInt(4, 10);
  return [
    {
      visual: <CounterGroup count={n} arrangement="line" tone="a" seed={n * 3 + 9} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `You count these counters and get ${n}. If you count the exact same group again, starting over, what total will you get?`,
          hint: "Nothing about the group changed between the two counts.",
          explain: `Recounting (correctly) always gives the same total: ${n}.`,
        },
        String(n),
        [String(n + 1)] // misconception: thinking a recount can land on a different number by chance
      ),
    },
  ];
};

/** Generalization: the total doesn't depend on which object you start counting from. */
export const startingPointChoiceQuestion = (): TestQuestion[] => {
  const n = randInt(4, 10);
  return [
    {
      visual: <CounterGroup count={n} arrangement="circle" tone="c" seed={n * 13 + 6} />,
      difficulty: "hard",
      step: choice(
        {
          prompt: "If you had started counting this circle of counters from a different one, would the total be different?",
          hint: "The total only depends on how many objects there are.",
          explain: "No — the total stays the same no matter which counter you start from, as long as you count each one exactly once.",
        },
        "No, the total would be the same",
        ["Yes, it depends which one you start with"] // misconception: thinking the starting point changes the actual amount
      ),
    },
  ];
};

/** K.CC.4c: the successor of a counted total is exactly one more. */
export const oneMoreAfterCountQuestion = (): TestQuestion[] => {
  const n = randInt(3, 15);
  return [
    {
      visual: <CounterGroup count={n} arrangement="array" tone="a" seed={n * 17 + 4} />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: "Count the counters. If one more counter joined the group, how many would there be then?",
        hint: "First find the total, then count one more.",
        explain: `There are ${n}, and one more than ${n} is ${n + 1}.`,
        answer: n + 1,
      },
    },
  ];
};

/** Generalization / false trap: arrangement never changes the actual count. */
export const arrangementNeverChangesCountQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: spreading a group of counters out so it takes up more space makes the total count bigger.",
          hint: "The counters themselves didn't change — only how spread out they look.",
          explain: "False — spreading objects out (or squeezing them together) never changes how many there are. Only adding or removing objects changes the count.",
        },
        "False",
        ["True"] // misconception: judging "more" by visual spread instead of actual count
      ),
    },
  ];
};

export const howManyCardinalityTest: Unit["test"] = {
  questions: [
    lineArrayCountQuestion,
    scatteredCountQuestion,
    circleCountQuestion,
    mixed20CountQuestion,
    () => countOutQuestion("mid"),
    () => countOutQuestion("nearExhaustion"),
    recountChoiceQuestion,
    startingPointChoiceQuestion,
    oneMoreAfterCountQuestion,
    arrangementNeverChangesCountQuestion,
  ],
  passScore: 9,
};
