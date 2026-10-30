import { PairCounters } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Determining Odd and Even ----------
// 10 questions from 10 generators. Self-contained (no import from
// DeterminingOddAndEven.tsx, and that file never imports back from here) —
// same convention as every other *Test.tsx in this app, since an import the
// other way would be a circular import that throws at module-eval time
// (silently surfacing as "Level not found").

/** Direct count + classify, small even group — the baseline case. */
export const smallEvenCountQuestion = (): TestQuestion[] => {
  const count = randInt(1, 5) * 2; // 2,4,...,10
  const seed = randInt(1, 100000);
  return [
    {
      visual: <PairCounters count={count} arrangement="line" tone="a" seed={seed} showPairs={false} />,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many objects are shown?", hint: "Count every object once.", explain: `There are ${count} objects.`, answer: count },
    },
  ];
};

/** Small even group, classify as odd/even. */
export const smallEvenClassifyQuestion = (): TestQuestion[] => {
  const count = randInt(1, 5) * 2;
  const seed = randInt(1, 100000);
  return [
    {
      visual: <PairCounters count={count} arrangement="line" tone="a" seed={seed} showPairs={false} />,
      difficulty: "easy",
      step: choice({ prompt: `Is ${count} odd or even?`, hint: "Try pairing them up two at a time.", explain: `${count} pairs up with none left over — it's even.` }, "Even", ["Odd"]),
    },
  ];
};

/** Small odd group, classify — hard edge of the small-odd bucket (9). */
export const smallOddClassifyQuestion = (): TestQuestion[] => {
  const count = randInt(0, 4) * 2 + 1; // 1,3,5,7,9
  const seed = randInt(1, 100000);
  return [
    {
      visual: <PairCounters count={count} arrangement="line" tone="a" seed={seed} showPairs={false} />,
      difficulty: "easy",
      step: choice({ prompt: `Is ${count} odd or even?`, hint: "One object will be left without a partner.", explain: `${count} leaves exactly one object unpaired — it's odd.` }, "Odd", ["Even"]),
    },
  ];
};

/** Small odd group, "how many left over" — direct pairing-reasoning check. */
export const smallOddLeftoverQuestion = (): TestQuestion[] => {
  const count = randInt(0, 4) * 2 + 1;
  const seed = randInt(1, 100000);
  return [
    {
      visual: <PairCounters count={count} arrangement="line" tone="a" seed={seed} showPairs={true} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `If you pair up all ${count} objects, how many are left without a partner?`, hint: "Odd groups always leave exactly one.", explain: "Exactly 1 is left over.", answer: 1 },
    },
  ];
};

/** Larger even group (grid arrangement) — hard edge of the bucket (20). */
export const largerEvenClassifyQuestion = (): TestQuestion[] => {
  const count = randInt(6, 10) * 2; // 12..20
  const seed = randInt(1, 100000);
  return [
    {
      visual: <PairCounters count={count} arrangement="array" tone="b" seed={seed} showPairs={false} />,
      difficulty: "medium",
      step: choice({ prompt: `Is ${count} odd or even?`, hint: "Pair them up two at a time — don't rely on guessing from the picture.", explain: `${count} pairs up with none left over — it's even.` }, "Even", ["Odd"]),
    },
  ];
};

/** Larger odd group (grid arrangement) — hard edge of the bucket (19). */
export const largerOddCountQuestion = (): TestQuestion[] => {
  const count = randInt(5, 9) * 2 + 1; // 11..19
  const seed = randInt(1, 100000);
  return [
    {
      visual: <PairCounters count={count} arrangement="array" tone="b" seed={seed} showPairs={false} />,
      difficulty: "medium",
      step: { kind: "number", prompt: "How many objects are shown?", hint: "Count carefully — don't skip or double-count a row.", explain: `There are ${count} objects.`, answer: count },
    },
  ];
};

/** The scattered bucket — same reasoning, irregular arrangement. */
export const scatteredClassifyQuestion = (): TestQuestion[] => {
  const count = randInt(1, 20);
  const seed = randInt(1, 100000);
  const isEven = count % 2 === 0;
  return [
    {
      visual: <PairCounters count={count} arrangement="scatter" tone="c" seed={seed} showPairs={false} />,
      difficulty: "medium",
      step: choice(
        { prompt: `This group of ${count} is scattered, not lined up. Is it odd or even?`, hint: "The arrangement doesn't matter — only the count does.", explain: `${count} is ${isEven ? "even" : "odd"}, the same as it would be in any other arrangement.` },
        isEven ? "Even" : "Odd",
        [isEven ? "Odd" : "Even"]
      ),
    },
  ];
};

/** Generalization / true-false trap: rearranging never changes parity. */
export const arrangementTrueFalseQuestion = (): TestQuestion[] => {
  const count = randInt(2, 10) * 2; // an even count, stated plainly
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `True or false: ${count} counters arranged in a neat line could become an odd number if you scattered them into a messy pile instead.`,
          hint: "Scattering the objects doesn't change how many there are.",
          explain: `False — ${count} stays ${count}, and stays even, no matter how it's arranged.`,
        },
        "False",
        ["True"] // misconception: thinking arrangement itself can change parity
      ),
    },
  ];
};

/** Vocabulary trap: what actually proves evenness, not the digit shortcut. */
export const provesEvenChoiceQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "Which of these actually PROVES a group of objects is even?",
          hint: "The ending-digit pattern is just a shortcut, not the reason itself.",
          explain: "A number is even because every object can be paired up with none left over — that's the actual reason, not just the last digit.",
        },
        "Every object can be paired up with a partner, with none left over",
        ["It ends in 0, 2, 4, 6, or 8"] // misconception: digit pattern as the definition itself
      ),
    },
  ];
};

/** Odd group, typed total — confirms the right count is still reached in
 *  the harder end of the range. */
export const largerOddLeftoverQuestion = (): TestQuestion[] => {
  const count = randInt(5, 9) * 2 + 1; // 11..19
  const seed = randInt(1, 100000);
  return [
    {
      visual: <PairCounters count={count} arrangement="array" tone="b" seed={seed} showPairs={true} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `${count} objects are paired up. How many are left without a partner?`, hint: "Odd groups always leave exactly one.", explain: "Exactly 1 is left over.", answer: 1 },
    },
  ];
};

export const determiningOddAndEvenTest: Unit["test"] = {
  questions: [
    smallEvenCountQuestion,
    smallEvenClassifyQuestion,
    smallOddClassifyQuestion,
    smallOddLeftoverQuestion,
    largerEvenClassifyQuestion,
    largerOddCountQuestion,
    scatteredClassifyQuestion,
    arrangementTrueFalseQuestion,
    provesEvenChoiceQuestion,
    largerOddLeftoverQuestion,
  ],
  passScore: 9,
};
