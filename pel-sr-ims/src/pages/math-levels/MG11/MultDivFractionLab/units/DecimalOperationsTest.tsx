import { DivisionLadder, PlaceValueColumns } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import type { TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

const round2 = (n: number) => Math.round(n * 100) / 100;
const randMoney2 = (min: number, max: number) => randInt(min * 100, max * 100) / 100;
const randMoney1 = (min: number, max: number) => randInt(min * 10, max * 10) / 10;

function addQuestion(visual: boolean): TestQuestion[] {
  const a = randMoney2(1, 60);
  const b = randMoney1(1, 25);
  const sum = round2(a + b);
  return [
    {
      visual: visual ? <PlaceValueColumns operation="add" top={a} bottom={b} done={0} /> : null,
      difficulty: "easy",
      step: { kind: "number", prompt: `Add: ${a} + ${b}`, hint: "Line up the decimal points first.", explain: `${a} + ${b} = ${sum}.`, answer: sum },
    },
  ];
}

function subtractQuestion(visual: boolean): TestQuestion[] {
  const a = randMoney2(20, 90);
  let b = randMoney1(1, Math.max(1, Math.floor(a) - 1));
  if (b >= a) b = round2(a / 2);
  const diff = round2(a - b);
  return [
    {
      visual: visual ? <PlaceValueColumns operation="subtract" top={a} bottom={b} done={0} /> : null,
      difficulty: "easy",
      step: { kind: "number", prompt: `Subtract: ${a} − ${b}`, hint: "Line up the decimal points first.", explain: `${a} − ${b} = ${diff}.`, answer: diff },
    },
  ];
}

function multiplyQuestion(visual: boolean): TestQuestion[] {
  const a = randMoney1(2, 40);
  const b = randMoney1(2, 9);
  const product = round2(a * b);
  return [
    {
      visual: visual ? <PlaceValueColumns operation="multiply" top={a} bottom={b} done={0} /> : null,
      difficulty: "medium",
      step: { kind: "number", prompt: `Multiply: ${a} × ${b}`, hint: "Multiply as whole numbers, then count total decimal places.", explain: `${a} × ${b} = ${product}.`, answer: product },
    },
  ];
}

function divideQuestion(visual: boolean): TestQuestion[] {
  const divisor = randMoney1(1, 9);
  const quotient = randInt(3, 40);
  const dividend = round2(divisor * quotient);
  const shiftedDivisor = Math.round(divisor * 10);
  const shiftedDividend = Math.round(dividend * 10);
  return [
    {
      visual: visual ? <DivisionLadder dividend={shiftedDividend} divisor={shiftedDivisor} done={0} /> : null,
      difficulty: "hard",
      step: { kind: "number", prompt: `Divide: ${dividend} ÷ ${divisor}`, hint: "Multiply both numbers by 10 so the divisor is a whole number, then divide.", explain: `${dividend} ÷ ${divisor} = ${quotient}.`, answer: quotient },
    },
  ];
}

export const decimalOperationsTest: Unit["test"] = {
  questions: [
    () => addQuestion(true),
    () => subtractQuestion(true),
    () => multiplyQuestion(true),
    () => divideQuestion(true),
    () => addQuestion(false),
    () => addQuestion(false),
    () => subtractQuestion(false),
    () => multiplyQuestion(false),
    () => multiplyQuestion(false),
    () => divideQuestion(false),
  ],
  passScore: 9,
};
