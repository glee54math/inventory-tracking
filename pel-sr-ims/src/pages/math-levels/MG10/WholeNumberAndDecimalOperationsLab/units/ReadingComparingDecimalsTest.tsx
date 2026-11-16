import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { comparePair, decName, decText, digitsOf, expandedDec, nameDec, numberWords, PLACE_NAMES, shortExpandedText, showDec, type CompareBucket, type Dec } from "../lib/decimals";
import { decToNameStep, expandedFillStep, expandedToDecStep, nameToDecStep, signStep, thousandthsStep } from "../lib/steps";

// Self-contained: never imports the paired ReadingComparingDecimals.tsx.
// No pictures: the Test gives no place-value chart (Practice shows it only as help).

type Diff = TestQuestion["difficulty"];

/** Q1 — number name -> decimal. `zero`: a 0 inside (4.026), the "4.26" trap. */
export function nameQuestion(difficulty: Diff, zero: boolean): TestQuestion[] {
  let d = nameDec();
  for (let i = 0; i < 200; i++) {
    const inside = d.p === 3 && digitsOf(d.t).d.slice(0, 2).includes(0);
    if (inside === zero) break;
    d = nameDec();
  }
  return [{ visual: null, difficulty, step: nameToDecStep(d) }];
}

/** Q2 — decimal -> which number name? A 3-digit decimal with a 0 inside (7.305 or 7.035). */
export function pickNameQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const w = randInt(1, 9);
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const zeroTenths = Math.random() < 0.5;
  const t = zeroTenths ? w * 1000 + a * 10 + b : w * 1000 + a * 100 + b; // 7.035 or 7.305
  const d: Dec = { t, p: 3 };
  const right = decName(t, 3);
  const wrong = [
    // dropped the 0: 7.35 read as thirty-five hundredths
    `${numberWords(w)} and ${numberWords(a * 10 + b)} hundredths`,
    // ignored the point: one big whole number
    `${numberWords(w)} thousand ${numberWords(t % 1000)}`,
    // the 0 moved to the end: 7.350 / 7.350 read as thousandths
    decName(w * 1000 + a * 100 + b * 10, 3),
  ].filter((x) => x !== right);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `How do you read ${showDec(d)}?`,
          hint: "Read the digits after the point as one number. Then name the last digit's place.",
          explain: `${showDec(d)} is ${decName(t, 3)}.`,
        },
        right,
        [...new Set(wrong)]
      ),
    },
  ];
}

/** Q3 — decimal -> "w and [n] [unit]". */
export function readQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  return [{ visual: null, difficulty, step: decToNameStep(nameDec()) }];
}

/** Q4 — decimal -> expanded form (type the three digits). */
export function expandedFillQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  return [{ visual: null, difficulty, step: expandedFillStep(expandedDec()) }];
}

/** Q5 — short expanded form with an empty place -> decimal (4 + 7/10 + 5/1000 = 4.705). */
export function expandedToDecQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  let t = expandedDec();
  for (let i = 0; i < 100 && !decText(t, 3).split(".")[1].includes("0"); i++) t = expandedDec();
  return [{ visual: null, difficulty, step: expandedToDecStep(t, shortExpandedText(t)) }];
}

/** Q6 — which place is this digit in? (all digits different, so the digit names one place). */
export function placeQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  for (;;) {
    const w = randInt(1, 9);
    const ds = [randInt(1, 9), randInt(1, 9), randInt(1, 9)];
    if (new Set([w, ...ds]).size < 4) continue;
    const k = randInt(0, 2);
    const d: Dec = { t: w * 1000 + ds[0] * 100 + ds[1] * 10 + ds[2], p: 3 };
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `In ${showDec(d)}, name the place of the ${ds[k]}.`,
            hint: "After the point, the places are tenths, hundredths, then thousandths.",
            explain: `The ${ds[k]} is the ${["first", "second", "third"][k]} digit after the point: the ${PLACE_NAMES[k + 1]} place.`,
          },
          PLACE_NAMES[k + 1],
          // the other places after the point (off-by-one counting), and "ones"
          ["ones", "tenths", "hundredths", "thousandths"].filter((x) => x !== PLACE_NAMES[k + 1]).slice(0, 3)
        ),
      },
    ];
  }
}

/** Q7/Q8 — which is true: <, > or =? (sameDigits: Q7; shorterBigger: Q8). */
export function compareQuestion(difficulty: Diff, bucket: CompareBucket): TestQuestion[] {
  return [{ visual: null, difficulty, step: signStep(comparePair(bucket), "Which is true?") }];
}

/** Q9 — a hundredths/tenths number and a thousandths number, both written as thousandths. */
export function thousandthsQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  return [{ visual: null, difficulty, step: thousandthsStep(comparePair("thousandths")) }];
}

/**
 * Q10 — the greatest of three: a 1-digit, a 2-digit and a 3-digit decimal
 * (round 2, C2-01). About half the time the shortest one is greatest
 * (0.7, 0.65, 0.689); otherwise a longer one is (0.72 beats 0.7 and 0.689,
 * or 0.705 beats 0.7 and 0.65). The listed order is shuffled, so neither
 * "pick the first" nor "fewer digits is bigger" always works.
 */
export function greatestQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  for (;;) {
    const W = randInt(0, 5) * 1000;
    const s = randInt(2, 8) * 100; // 0.7
    const winner = Math.random() < 0.5 ? "short" : pick(["two", "three"] as const);
    let two: number;
    let three: number;
    if (winner === "short") {
      two = s - randInt(1, 9) * 10 - pick([0, 10, 20, 30, 40, 50]); // 0.65, below 0.7
      three = s - randInt(1, 30); // 0.689, below 0.7
    } else if (winner === "two") {
      two = s + randInt(1, 9) * 10; // 0.72, just above 0.7
      three = s - randInt(1, 99); // 0.689: longer, but below 0.7
    } else {
      three = s + randInt(1, 99); // 0.705, just above 0.7
      two = s - randInt(1, 9) * 10 - pick([0, 10, 20, 30, 40, 50]); // 0.65, below 0.7
    }
    if (two <= 0 || three <= 0 || two % 10 !== 0 || two % 100 === 0 || three % 10 === 0) continue;
    if (three === two) continue;
    const one: Dec = { t: W + s, p: 1 };
    const big: Dec = { t: W + two, p: 2 };
    const long: Dec = { t: W + three, p: 3 };
    const best = winner === "short" ? one : winner === "two" ? big : long;
    const nums = shuffle([one, big, long]);
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `Which number is the greatest: ${nums.map(showDec).join(", ")}?`,
            hint: "Fill in 0s so each number has three digits after the point. Then compare.",
            explain: `With 0s filled in: ${nums.map((n) => decText(n.t, 3)).join(", ")}. Compare place by place from the left. ${showDec(best)} is the greatest.`,
          },
          showDec(best),
          nums.filter((n) => n !== best).map(showDec)
        ),
      },
    ];
  }
}

export const readingComparingTest: NonNullable<Unit["test"]> = {
  questions: [
    () => nameQuestion("medium", true),
    () => pickNameQuestion("medium"),
    () => readQuestion("medium"),
    () => expandedFillQuestion("easy"),
    () => expandedToDecQuestion("medium"),
    () => placeQuestion("easy"),
    () => compareQuestion("easy", "sameDigits"),
    () => compareQuestion("medium", "shorterBigger"),
    () => thousandthsQuestion("medium"),
    () => greatestQuestion("hard"),
  ],
  passScore: 9,
};
