import { pick, randInt } from "../../../shared/lib/math";
import { choice, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Multiplicative Comparison as Equations ----------
// Self-contained (no import from ComparisonEquations.tsx — see the brief's
// circular-import note), 10 questions, passScore 9. Every choice question
// carries at least one distractor aimed at a named misconception, commented
// where it's built. All questions are typed answers or choices: no drag/
// builder widget, so a wrong student can always move on in a no-feedback test.

const NAMES = ["Maria", "Jo", "Ben", "Kim", "Omar", "Lena", "Priya", "Diego", "Tia", "Raj", "Sam", "Ana"];
const ITEMS = ["stickers", "marbles", "books", "shells", "cards", "stamps", "pencils", "beads"];

export type CompareLevel = "easy" | "medium" | "hard";

export interface CompareScenario {
  /** The person with MORE (the "times as many" side). */
  big: string;
  /** The person with fewer (the amount being compared to). */
  small: string;
  item: string;
  base: number;
  times: number;
  total: number;
}

/**
 * base ≠ times always, so the two readings of total = times × base are
 * genuinely different sentences, and "times more" (base × (times − 1)) can
 * never accidentally equal `times` (that only happens at base = times = 2).
 * hard = a two-digit base (10-12), the top of 4.OA.1's facts range.
 */
export function compareScenario(level: CompareLevel = "medium"): CompareScenario {
  const [bLo, bHi, tLo, tHi] = level === "easy" ? [2, 6, 2, 5] : level === "medium" ? [2, 9, 2, 9] : [10, 12, 3, 9];
  let base = 0;
  let times = 0;
  do {
    base = randInt(bLo, bHi);
    times = randInt(tLo, tHi);
  } while (base === times);
  const big = pick(NAMES);
  let small = pick(NAMES);
  while (small === big) small = pick(NAMES);
  return { big, small, item: pick(ITEMS), base, times, total: base * times };
}

export function sentenceToEquationQuestion(level: CompareLevel = "easy"): TestQuestion[] {
  const s = compareScenario(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: choice(
        {
          prompt: `${s.big} has ${s.times} times as many ${s.item} as ${s.small}. ${s.small} has ${s.base} ${s.item}. Let n be the number of ${s.item} ${s.big} has. Which equation matches?`,
          hint: `${s.big}'s amount is ${s.times} copies of ${s.small}'s amount.`,
          explain: `"${s.times} times as many as ${s.base}" is ${s.times} × ${s.base}, so n = ${s.times} × ${s.base} = ${s.total}.`,
        },
        `n = ${s.times} × ${s.base}`,
        [
          // Misconception: reading "times as many" as additive ("more than").
          `n = ${s.times} + ${s.base}`,
          // Misconception: reversed direction — treats the smaller amount as the "times as many" side.
          `${s.base} = ${s.times} × n`,
        ]
      ),
    },
  ];
}

export function productFromSentenceQuestion(level: CompareLevel = "medium"): TestQuestion[] {
  const s = compareScenario(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: {
        kind: "number",
        prompt: `${s.small} has ${s.base} ${s.item}. ${s.big} has ${s.times} times as many ${s.item} as ${s.small}. How many ${s.item} does ${s.big} have?`,
        hint: `${s.times} times as many means ${s.times} × ${s.base}.`,
        explain: `${s.times} × ${s.base} = ${s.total} ${s.item}.`,
        answer: s.total,
        suffix: s.item,
      },
    },
  ];
}

export function equationToSentenceQuestion(level: CompareLevel = "medium"): TestQuestion[] {
  const s = compareScenario(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: sentence(
        {
          prompt: `Fill in both blanks so the sentence means the same as ${s.total} = ${s.times} × ${s.base}.`,
          hint: "The bigger number is the one that is 'times as many'.",
          explain: `${s.total} = ${s.times} × ${s.base} says ${s.total} is ${s.times} times as many as ${s.base}.`,
        },
        "",
        numberBlank(s.total),
        " is ",
        numberBlank(s.times),
        ` times as many as ${s.base}.`
      ),
    },
  ];
}

export function matchSentenceQuestion(level: CompareLevel = "medium"): TestQuestion[] {
  const s = compareScenario(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: choice(
        {
          prompt: `${s.small} has ${s.base} ${s.item}. ${s.big} has ${s.total} ${s.item}. ${s.total} = ${s.times} × ${s.base}. Which sentence matches?`,
          hint: "Who has the bigger amount? That person has 'times as many'.",
          explain: `${s.big} has ${s.total}, which is ${s.times} × ${s.base} — ${s.times} times as many as ${s.small}'s ${s.base}.`,
        },
        `${s.big} has ${s.times} times as many ${s.item} as ${s.small}.`,
        [
          // Misconception: reversed comparison direction (smaller amount called "times as many").
          `${s.small} has ${s.times} times as many ${s.item} as ${s.big}.`,
          // Misconception: additive language for a multiplicative comparison.
          `${s.big} has ${s.times} more ${s.item} than ${s.small}.`,
          // Misconception: using the compared amount (base) as the multiplier.
          `${s.big} has ${s.base} times as many ${s.item} as ${s.small}.`,
        ]
      ),
    },
  ];
}

export function otherReadingQuestion(level: CompareLevel = "medium"): TestQuestion[] {
  const s = compareScenario(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: {
        kind: "number",
        prompt: `${s.total} = ${s.times} × ${s.base} means ${s.total} is ${s.times} times as many as ${s.base}. It ALSO means ${s.total} is how many times as many as ${s.times}?`,
        hint: `${s.times} × ${s.base} is the same as ${s.base} × ${s.times}.`,
        explain: `${s.total} = ${s.base} × ${s.times}, so ${s.total} is ${s.base} times as many as ${s.times}.`,
        answer: s.base,
      },
    },
  ];
}

export function timesVsMoreTFQuestion(): TestQuestion[] {
  const s = compareScenario("medium");
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `True or False: "n is ${s.times} times as many as ${s.base}" and "n is ${s.times} more than ${s.base}" give the same n.`,
          hint: "Work out each one.",
          explain: `False — ${s.times} times as many as ${s.base} is ${s.times} × ${s.base} = ${s.total}, but ${s.times} more than ${s.base} is ${s.base} + ${s.times} = ${s.base + s.times}.`,
        },
        "False",
        // Misconception: "times as many" and "more than" both just mean "bigger".
        ["True"]
      ),
    },
  ];
}

export function letterEquationQuestion(level: CompareLevel = "medium"): TestQuestion[] {
  const s = compareScenario(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: choice(
        {
          prompt: `Which equation says "n is ${s.times} times as many as ${s.base}"?`,
          hint: "n is the bigger amount, so n goes alone on one side.",
          explain: `n = ${s.times} × ${s.base}, so n = ${s.total}.`,
        },
        `n = ${s.times} × ${s.base}`,
        [
          // Misconception: additive reading.
          `n = ${s.times} + ${s.base}`,
          // Misconception: reversed direction — makes the known amount the "times as many" side.
          `${s.base} = ${s.times} × n`,
        ]
      ),
    },
  ];
}

export function identifyMultiplierQuestion(level: CompareLevel = "medium"): TestQuestion[] {
  const s = compareScenario(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: choice(
        {
          prompt: `${s.big} has ${s.total} ${s.item}. That is ${s.times} times as many as ${s.small}, who has ${s.base}. In ${s.total} = ${s.times} × ${s.base}, which number tells HOW MANY TIMES as many?`,
          hint: "Look for the number right before the words 'times as many'.",
          explain: `${s.times} is the multiplier — ${s.big}'s ${s.total} is ${s.times} copies of ${s.small}'s ${s.base}.`,
        },
        String(s.times),
        [
          // Misconception: mixing up the multiplier with the amount being compared to.
          String(s.base),
          // Misconception: picking the product (the bigger amount) as the multiplier.
          String(s.total),
        ]
      ),
    },
  ];
}

export function equationForStatementQuestion(level: CompareLevel = "hard"): TestQuestion[] {
  const s = compareScenario(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: choice(
        {
          prompt: `Which equation shows "${s.total} is ${s.times} times as many as ${s.base}"?`,
          hint: "The bigger number equals the multiplier times the smaller number.",
          explain: `${s.total} = ${s.times} × ${s.base}.`,
        },
        `${s.total} = ${s.times} × ${s.base}`,
        [
          // Misconception: reversed direction.
          `${s.base} = ${s.times} × ${s.total}`,
          // Misconception: additive reading.
          `${s.total} = ${s.times} + ${s.base}`,
        ]
      ),
    },
  ];
}

export const comparisonEquationsTest: Unit["test"] = {
  questions: [
    () => sentenceToEquationQuestion("easy"),
    () => productFromSentenceQuestion("medium"),
    () => equationToSentenceQuestion("medium"),
    () => matchSentenceQuestion("medium"),
    () => otherReadingQuestion("medium"),
    timesVsMoreTFQuestion,
    () => letterEquationQuestion("medium"),
    () => identifyMultiplierQuestion("medium"),
    () => matchSentenceQuestion("hard"),
    () => equationForStatementQuestion("hard"),
  ],
  passScore: 9,
};
