const e=`import type { Unit } from "../../../shared/units/types";\r
import { zeroAlignedQuestion, brokenRulerQuestion, estimateQuestion, chooseToolQuestion } from "./MeasuringEstimatingLengthTest";\r
import { sameObjectQuestion, differenceQuestion, crossUnitTrapQuestion, whySmallerUnitQuestion } from "./ComparingUnitsLengthDifferencesTest";\r
import { addToQuestion, takeFromQuestion, compareDifferenceQuestion, startUnknownQuestion, numberLineReadQuestion } from "./LengthWordProblemsNumberLineTest";\r
import { exactFiveMinQuestion, hourHandBetweenQuestion, amPmQuestion, timeFactQuestion, elapsedTimeQuestion } from "./TellingTime5MinTest";\r
import { countCoinsQuestion, billsAndCoinsQuestion, makeChangeQuestion, compareAmountsQuestion } from "./MoneyWordProblemsTest";\r
import { generatePlotQuestion, readPictureGraphQuestion, readBarGraphQuestion, putTogetherQuestion, compareBarQuestion } from "./LinePlotsAndGraphsTest";\r
\r
// ---------- cumulative end-of-module test: Measurement, Money & Data ----------\r
// 30 questions, 5 drawn from each of the 6 units' own *Test.tsx question\r
// banks — same reuse pattern as MG3's own ModuleTest.tsx and MM1 Ratio\r
// Lab's. Every generator is still its own independent random draw, so\r
// retaking the module test doesn't replay the exact same 30 questions.\r
//\r
// Diagrams stay visible here (a ruler, a clock face, coins, a line plot/\r
// graph are intrinsic to what each question tests at this grade, not\r
// scaffolding on top of a word problem) — same call MG3's own module test\r
// made for the same reason.\r
\r
// Hand-maintained rather than computed from the array below (same reasoning\r
// as every other lab's own ModuleTest.tsx). Keep in sync with \`questions\`.\r
export const MODULE_TEST_TOTAL = 30;\r
\r
/**\r
 * A 1-5 star rating banded on the raw /30 score — lines up with A-F cutoffs\r
 * by percentage (<60/60s/70s/80s/90+), scaled from the 20-question bands\r
 * every other lab's module test already uses (18/16/14/12 of 20 -> 27/24/21/18\r
 * of 30, i.e. the same 90/80/70/60 percent cutoffs).\r
 */\r
export const moduleTestStars = (score: number): number => {\r
  if (score >= 27) return 5;\r
  if (score >= 24) return 4;\r
  if (score >= 21) return 3;\r
  if (score >= 18) return 2;\r
  return 1;\r
};\r
\r
export const moduleTest: NonNullable<Unit["test"]> = {\r
  questions: [\r
    // Measuring and Estimating Length\r
    () => zeroAlignedQuestion("easy"),\r
    () => brokenRulerQuestion("hard"),\r
    () => estimateQuestion("customary"),\r
    () => estimateQuestion("metric"),\r
    () => chooseToolQuestion(),\r
    // Comparing Measurement Units and Length Differences\r
    () => sameObjectQuestion(),\r
    () => whySmallerUnitQuestion(),\r
    () => differenceQuestion("medium"),\r
    () => crossUnitTrapQuestion(),\r
    () => differenceQuestion("hard"),\r
    // Length Word Problems and the Number Line\r
    () => addToQuestion("medium"),\r
    () => takeFromQuestion("medium"),\r
    () => compareDifferenceQuestion(),\r
    () => startUnknownQuestion(),\r
    () => numberLineReadQuestion(),\r
    // Telling Time to 5 Minutes\r
    () => exactFiveMinQuestion("medium"),\r
    () => hourHandBetweenQuestion(),\r
    () => amPmQuestion(),\r
    () => timeFactQuestion("hour"),\r
    () => elapsedTimeQuestion(),\r
    // Money Word Problems (compareAmountsQuestion contributes 2 questions on\r
    // its own — a "who has more" choice plus a "how much more" number step\r
    // sharing one scenario — so only 4 calls are listed here to keep this\r
    // section's flattened total at 5, matching every other unit's share).\r
    () => countCoinsQuestion("medium"),\r
    () => billsAndCoinsQuestion(),\r
    () => makeChangeQuestion(),\r
    () => compareAmountsQuestion(),\r
    // Line Plots and Picture/Bar Graphs\r
    () => generatePlotQuestion(),\r
    () => readPictureGraphQuestion(),\r
    () => readBarGraphQuestion(),\r
    () => putTogetherQuestion(),\r
    () => compareBarQuestion(),\r
  ],\r
  // 24/30 = 80%, matching the 4-star cutoff in moduleTestStars above —\r
  // "passed" means at least 4 stars, not the full 5.\r
  passScore: 24,\r
};\r
`;export{e as default};
