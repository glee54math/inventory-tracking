import { DivisionLadder } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import type { TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

function divisionQuestion(opts: { divisorRange: [number, number]; forceRemainder: boolean | null; visual: boolean; difficulty: "easy" | "medium" | "hard" }): TestQuestion[] {
  const divisor = randInt(opts.divisorRange[0], opts.divisorRange[1]);
  const min = Math.max(10, Math.ceil(100 / divisor));
  const quotient = randInt(min, Math.floor(999 / divisor));
  const remainder = opts.forceRemainder === null ? randInt(0, divisor - 1) : opts.forceRemainder ? randInt(1, divisor - 1) : 0;
  const dividend = divisor * quotient + remainder;

  return [
    {
      visual: opts.visual ? <DivisionLadder dividend={dividend} divisor={divisor} done={0} /> : null,
      difficulty: opts.difficulty,
      step: {
        kind: "ratio",
        tones: "none",
        labels: ["quotient", "remainder"],
        frame: ["", "R", ""],
        prompt: `Divide: ${dividend} ÷ ${divisor}`,
        hint: "Work one digit at a time: bring down, divide, multiply, subtract.",
        explain: `${dividend} ÷ ${divisor} = ${quotient}${remainder > 0 ? ` R${remainder}` : ""}.`,
        answer: [quotient, remainder],
      },
    },
  ];
}

export const longDivisionTest: Unit["test"] = {
  questions: [
    () => divisionQuestion({ divisorRange: [2, 9], forceRemainder: false, visual: true, difficulty: "easy" }),
    () => divisionQuestion({ divisorRange: [2, 9], forceRemainder: true, visual: true, difficulty: "medium" }),
    () => divisionQuestion({ divisorRange: [11, 20], forceRemainder: false, visual: true, difficulty: "medium" }),
    () => divisionQuestion({ divisorRange: [11, 20], forceRemainder: true, visual: true, difficulty: "hard" }),
    () => divisionQuestion({ divisorRange: [20, 30], forceRemainder: null, visual: true, difficulty: "hard" }),
    () => divisionQuestion({ divisorRange: [2, 9], forceRemainder: false, visual: false, difficulty: "easy" }),
    () => divisionQuestion({ divisorRange: [2, 9], forceRemainder: true, visual: false, difficulty: "easy" }),
    () => divisionQuestion({ divisorRange: [11, 20], forceRemainder: false, visual: false, difficulty: "medium" }),
    () => divisionQuestion({ divisorRange: [11, 20], forceRemainder: true, visual: false, difficulty: "medium" }),
    () => divisionQuestion({ divisorRange: [20, 30], forceRemainder: null, visual: false, difficulty: "hard" }),
  ],
  passScore: 9,
};
