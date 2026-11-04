import { CounterGroup, CountOutCard } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, tapCount, type TestQuestion } from "../../../shared/engine/types";
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

/** Count a bigger (11-20) group, lined up in rows (K.CC.5 asks for scattered groups only up to 10). */
export const mixed20CountQuestion = (): TestQuestion[] => {
  const n = randInt(11, 20);
  const arrangement = pick(["array", "line"] as const);
  return [
    {
      visual: <CounterGroup count={n} arrangement={arrangement} tone="a" seed={n * 41 + 3} />,
      difficulty: "hard",
      step: { kind: "number", prompt: "How many counters are there in all?", hint: "Count slowly, one at a time.", explain: `There are ${n} counters in all.`, answer: n },
    },
  ];
};

/** Count OUT a given number from a bigger pile (K.CC.5) by tapping that many
 *  counters. "mid": 3-10. "nearExhaustion": 11-18 from a pile of up to 20, so
 *  the student has to keep going past 10 and still stop at the right number.
 *  misconception: not stopping at the number (counting the whole pile). */
export const countOutQuestion = (range: "mid" | "nearExhaustion" = "mid"): TestQuestion[] => {
  const take = range === "nearExhaustion" ? randInt(11, 18) : randInt(3, 10);
  const total = Math.min(20, take + randInt(2, 6));
  return [
    {
      visual: <CountOutCard n={take} />,
      difficulty: range === "nearExhaustion" ? "hard" : "medium",
      step: tapCount(
        { prompt: `Tap ${take} counters to give to your friend.`, hint: `Stop when you say ${take}.`, explain: `You count out ${take}, then stop.` },
        total,
        take
      ),
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
          prompt: "If you started counting this circle from a different counter, would you get a different number?",
          hint: "The total only depends on how many objects there are.",
          explain: "No — the total stays the same no matter which counter you start from, as long as you count each one exactly once.",
        },
        "No, the number would be the same",
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
