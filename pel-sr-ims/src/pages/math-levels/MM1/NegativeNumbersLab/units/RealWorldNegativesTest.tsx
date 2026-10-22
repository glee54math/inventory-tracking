import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Positive & Negative Numbers in Real Life ----------
// 10 single-question generators across the 3 real-world contexts (temperature,
// elevation, account balance), covering the same 3 skills Practice exercises:
// phrase -> signed number, signed number -> phrase (the reverse direction), and
// what 0 means in context. Self-contained (not imported from RealWorldNegatives.tsx)
// the same way every other *Test.tsx file in this app is independent of its unit's
// Explore/Practice source.

// TestContext/TEMPERATURE/ELEVATION/MONEY and the 3 generators below are
// exported so NegativeNumbersLab/units/ModuleTest.tsx can draw a cumulative
// sample from this unit's own question shapes — same reuse pattern as MM1
// Ratio Lab's ModuleTest.tsx importing individual generators from each of
// its own unit *Test.tsx files.
export interface TestContext {
  label: string;
  unit: string;
  range: number;
  positivePhrase: (n: number) => string;
  negativePhrase: (n: number) => string;
  zeroMeaning: string;
  zeroDistractors: string[];
  /**
   * Opens the number -> phrase question with its own scenario stated up
   * front — unlike Practice, a test question has no separate "story" line
   * establishing context, so a bare number + unit (e.g. "155 feet") can read
   * as ambiguous (feet of WHAT?) without this. Temperature doesn't strictly
   * need it ("°F" already reads as temperature on its own), but all 3
   * contexts use the same self-contained shape for consistency.
   */
  scenarioPrefix: string;
}

export const TEMPERATURE: TestContext = {
  label: "temperature",
  unit: "°F",
  range: 25,
  positivePhrase: (n) => `${n} degrees above zero`,
  negativePhrase: (n) => `${n} degrees below zero`,
  zeroMeaning: "the reference point of zero degrees",
  zeroDistractors: ["the hottest possible temperature", "the coldest possible temperature"],
  scenarioPrefix: "A temperature reads",
};
export const ELEVATION: TestContext = {
  label: "elevation",
  unit: " feet",
  range: 500,
  positivePhrase: (n) => `${n} feet above sea level`,
  negativePhrase: (n) => `${n} feet below sea level`,
  zeroMeaning: "sea level",
  zeroDistractors: ["the bottom of the ocean", "the top of a mountain"],
  scenarioPrefix: "An elevation is recorded as",
};
export const MONEY: TestContext = {
  label: "an account balance",
  unit: " dollars",
  range: 50,
  positivePhrase: (n) => `a deposit of ${n} dollars`,
  negativePhrase: (n) => `a debt of ${n} dollars`,
  zeroMeaning: "an account with no money owed or owned — exactly empty",
  zeroDistractors: ["the most money the account can ever hold", "an account that's frozen and can't be used"],
  scenarioPrefix: "An account balance is",
};

/** Phrase -> signed number, straight translation. */
export const phraseToNumberQuestion = (cfg: TestContext, difficulty: "easy" | "medium"): TestQuestion[] => {
  const magnitude = randInt(1, cfg.range);
  const isNegative = Math.random() < 0.5;
  const value = isNegative ? -magnitude : magnitude;
  const phrase = isNegative ? cfg.negativePhrase(magnitude) : cfg.positivePhrase(magnitude);
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `What signed number represents "${phrase}"?`,
        hint: isNegative ? "Below zero (or in debt, or below sea level) is negative." : "Above zero (or a deposit, or above sea level) is positive.",
        explain: `"${phrase}" = ${value}${cfg.unit}.`,
        answer: value,
      },
    },
  ];
};

/** Signed number -> phrase, the reverse direction, multiple choice. */
export const numberToPhraseQuestion = (cfg: TestContext, difficulty: "easy" | "medium" | "hard"): TestQuestion[] => {
  const magnitude = randInt(1, cfg.range);
  const isNegative = Math.random() < 0.5;
  const value = isNegative ? -magnitude : magnitude;
  const phrase = isNegative ? cfg.negativePhrase(magnitude) : cfg.positivePhrase(magnitude);
  const oppositePhrase = isNegative ? cfg.positivePhrase(magnitude) : cfg.negativePhrase(magnitude);
  return [
    {
      visual: <NumberLine min={-cfg.range} max={cfg.range} points={[{ value, tone: "a" }]} />,
      difficulty,
      step: choice(
        {
          prompt: `${cfg.scenarioPrefix} ${value}${cfg.unit}. What does that mean?`,
          hint:
            value < 0
              ? "A negative number here means below zero (or in debt, or below sea level)."
              : "A positive number here means above zero (or a deposit, or above sea level).",
          explain: `${value}${cfg.unit} means ${phrase}.`,
        },
        phrase,
        [oppositePhrase, cfg.zeroMeaning]
      ),
    },
  ];
};

/** What does 0 mean in this context, multiple choice. */
export const zeroMeaningQuestion = (cfg: TestContext): TestQuestion[] => [
  {
    visual: null,
    difficulty: "medium",
    step: choice(
      {
        prompt: `What does 0${cfg.unit} mean?`,
        hint: "Think about what's neither positive nor negative here.",
        explain: `0${cfg.unit} means ${cfg.zeroMeaning}.`,
      },
      cfg.zeroMeaning,
      cfg.zeroDistractors
    ),
  },
];

export const realWorldNegativesTest: Unit["test"] = {
  questions: [
    () => phraseToNumberQuestion(TEMPERATURE, "easy"),
    () => numberToPhraseQuestion(TEMPERATURE, "medium"),
    () => zeroMeaningQuestion(TEMPERATURE),
    () => phraseToNumberQuestion(ELEVATION, "easy"),
    () => numberToPhraseQuestion(ELEVATION, "medium"),
    () => zeroMeaningQuestion(ELEVATION),
    () => phraseToNumberQuestion(MONEY, "easy"),
    () => numberToPhraseQuestion(MONEY, "medium"),
    () => zeroMeaningQuestion(MONEY),
    () => numberToPhraseQuestion(MONEY, "hard"),
  ],
  passScore: 9,
};
