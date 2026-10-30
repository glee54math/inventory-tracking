import { PlaceValueBoxes } from "../diagrams";
import { tenHundredShift } from "../logic";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Mental Math — Add or Subtract 10 or 100 ----------
// 10 questions from 10 generators. Self-contained (no import from
// MentalMathTenHundred.tsx, and that file never imports back from here).

const shiftQ = (n: number, delta: 10 | -10 | 100 | -100, difficulty: "easy" | "medium" | "hard", hint: string): TestQuestion => {
  const shift = tenHundredShift(n, delta);
  const op = delta > 0 ? "+" : "−";
  return {
    visual: <PlaceValueBoxes shift={shift} showAfter={false} />,
    difficulty,
    step: { kind: "number", prompt: `What is ${n} ${op} ${Math.abs(delta)}?`, hint, explain: `${n} ${op} ${Math.abs(delta)} = ${shift.result}.`, answer: shift.result },
  };
};

export const plus10SameHundredNumberQuestion = (): TestQuestion[] => {
  const base = randInt(1, 9) * 100;
  const n = base + randInt(0, 88);
  return [shiftQ(n, 10, "easy", "The tens digit stays 9 or under here.")];
};

export const plus10CrossHundredNumberQuestion = (): TestQuestion[] => {
  const base = randInt(1, 8) * 100;
  const n = base + randInt(91, 99);
  return [shiftQ(n, 10, "medium", "Ten tens make a new hundred.")];
};

export const minus10SameHundredNumberQuestion = (): TestQuestion[] => {
  const base = randInt(1, 9) * 100;
  const n = base + randInt(10, 99);
  return [shiftQ(n, -10, "easy", "The tens digit is 1 or more here, so there's enough to subtract directly.")];
};

export const minus10CrossHundredNumberQuestion = (): TestQuestion[] => {
  const base = randInt(1, 9) * 100;
  const n = base + randInt(0, 9);
  return [shiftQ(n, -10, "medium", "The tens digit is 0 — borrow from the hundreds place.")];
};

export const plus100NoBoundaryNumberQuestion = (): TestQuestion[] => {
  const n = randInt(1, 8) * 100 + randInt(0, 99);
  return [shiftQ(n, 100, "easy", "Only the hundreds digit changes here.")];
};

export const minus100NoBoundaryNumberQuestion = (): TestQuestion[] => {
  const n = randInt(2, 9) * 100 + randInt(0, 99);
  return [shiftQ(n, -100, "easy", "Only the hundreds digit changes here.")];
};

export const plus100AtEdgeNumberQuestion = (): TestQuestion[] => [shiftQ(900, 100, "hard", "Ten hundreds make a new thousand.")];

export const minus100AtEdgeNumberQuestion = (): TestQuestion[] => [shiftQ(100, -100, "hard", "What's 1 hundred, minus 1 hundred?")];

/** Misconception distractor: adjusting only the tens digit without letting
 *  the change ripple into the hundreds digit. */
export const rippleChoiceQuestion = (): TestQuestion[] => {
  const base = randInt(1, 8) * 100;
  const n = base + randInt(91, 99);
  const shift = tenHundredShift(n, 10);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `What is ${n} + 10?`, hint: "Ten tens make a new hundred.", explain: `${n} + 10 = ${shift.result} — the tens digit rolls to 0 AND the hundreds digit increases by 1.` },
        String(shift.result),
        [String(n - 90), String(n + 100)] // misconceptions: rolling the tens digit 9->0 without carrying into the hundreds place, or bumping the hundreds digit instead of the tens digit
      ),
    },
  ];
};

/** Generalization trap, restated from the CFU. */
export const minus10AlwaysJustTensTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: subtracting 10 from a number always just lowers the tens digit by 1, and nothing else ever changes.", hint: "Try a number whose tens digit is already 0.", explain: "False — when the tens digit is 0, subtracting 10 has to borrow from the hundreds place too." },
        "False",
        ["True"]
      ),
    },
  ];
};

export const mentalMathTenHundredTest: Unit["test"] = {
  questions: [
    plus10SameHundredNumberQuestion,
    plus10CrossHundredNumberQuestion,
    minus10SameHundredNumberQuestion,
    minus10CrossHundredNumberQuestion,
    plus100NoBoundaryNumberQuestion,
    minus100NoBoundaryNumberQuestion,
    plus100AtEdgeNumberQuestion,
    minus100AtEdgeNumberQuestion,
    rippleChoiceQuestion,
    minus10AlwaysJustTensTrueFalseQuestion,
  ],
  passScore: 9,
};
