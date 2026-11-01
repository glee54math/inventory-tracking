import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { HundredGrid } from "../diagrams";
import { distanceToMultiple, factorPairs } from "../lib/numberTheory";

// Self-contained: never imports from Multiples.tsx (see FactorPairsTest.tsx).

/** A non-multiple of k that is only 1 or 2 away from one, between k and 100. */
export const nearMissFor = (k: number): number => {
  for (;;) {
    const n = randInt(k + 1, 100);
    const d = distanceToMultiple(n, k);
    if (d === 1 || d === 2) return n;
  }
};

// Q1 — easy: continue a list of multiples
export function nextMultipleQuestion(): TestQuestion[] {
  const k = randInt(3, 9);
  const m = randInt(1, 6);
  const seq = [k * m, k * (m + 1), k * (m + 2)];
  return [
    {
      visual: <HundredGrid multiplesOf={k} shadeUpTo={seq[2]} width={300} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `These are multiples of ${k}: ${seq.join(", ")}, ___. What comes next?`, hint: `Multiples of ${k} go up by ${k} each time.`, explain: `${seq[2]} + ${k} = ${k * (m + 3)}, which is ${k} × ${m + 3}.`, answer: k * (m + 3) },
    },
  ];
}

// Q2 — easy, choice: pick the multiple
export function whichMultipleQuestion(): TestQuestion[] {
  const k = pick([4, 5, 6]);
  const m = randInt(3, 9);
  const n = k * m;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        { prompt: `Which number is a multiple of ${k}?`, hint: `Skip-count by ${k}, or divide each number by ${k}.`, explain: `${k} × ${m} = ${n}. (1 is a FACTOR of ${k}, not a multiple — multiples are ${k}, ${2 * k}, ${3 * k}, ...)` },
        String(n),
        [
          String(n + 1), // near miss: one past a multiple
          String(n + 2), // near miss: two past a multiple
          "1", // MISCONCEPTION: factor/multiple mix-up (1 is a factor of every number)
        ]
      ),
    },
  ];
}

// Q3 — medium, choice: near-miss "is it a multiple?"
export function nearMissChoiceQuestion(): TestQuestion[] {
  const k = pick([3, 4, 6]);
  const n = nearMissFor(k);
  const q = Math.floor(n / k);
  const r = n % k;
  const closest = Math.abs(n - k * q) <= Math.abs(k * (q + 1) - n) ? k * q : k * (q + 1);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Is ${n} a multiple of ${k}?`, hint: `Divide ${n} by ${k}. Is anything left over?`, explain: `${n} ÷ ${k} = ${q} with ${r} left over, so ${n} is NOT a multiple of ${k}. It's close to ${closest}, but close doesn't count.` },
        `No — ${n} ÷ ${k} leaves ${r} left over`,
        [
          `Yes — ${n} is really close to ${closest}`, // MISCONCEPTION: eyeballing "close enough"
          `Yes — you'd reach it if you skip-counted far enough`, // MISCONCEPTION: every number is eventually a multiple
        ]
      ),
    },
  ];
}

// Q4 — medium: the remainder that proves "not a multiple"
export function remainderQuestion(): TestQuestion[] {
  const k = pick([3, 4, 6, 7, 8, 9]);
  const n = nearMissFor(k);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `${n} ÷ ${k} = ${Math.floor(n / k)} with how many left over?`, hint: `${k} × ${Math.floor(n / k)} = ${k * Math.floor(n / k)}. How far is that from ${n}?`, explain: `${n} − ${k * Math.floor(n / k)} = ${n % k} left over, so ${n} is not a multiple of ${k}.`, answer: n % k },
    },
  ];
}

// Q5 — medium, choice: factor vs multiple in one sentence
export function factorOrMultipleQuestion(): TestQuestion[] {
  const k = randInt(3, 9);
  let m = randInt(3, 9);
  while (m === k) m = randInt(3, 9);
  const n = k * m;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `${k} × ${m} = ${n}. Which sentence is true?`, hint: "A factor divides INTO a number. A multiple is what you get by multiplying UP.", explain: `${n} is a multiple of ${k} (and ${k} is a factor of ${n}).` },
        `${n} is a multiple of ${k}`,
        [
          `${n} is a factor of ${k}`, // MISCONCEPTION: factor/multiple swapped
          `${k} is a multiple of ${n}`, // MISCONCEPTION: factor/multiple swapped the other way
        ]
      ),
    },
  ];
}

// Q6 — hard, choice: multiples of 7, 8, or 9
export function hardMultipleChoiceQuestion(): TestQuestion[] {
  const k = pick([7, 8, 9]);
  const m = randInt(4, Math.floor(100 / k));
  const n = k * m;
  // MISCONCEPTION: "ends in the digit k" means "multiple of k"
  const endsInK = [7, 17, 27, 37, 47, 57, 67, 77, 87, 97, 8, 18, 28, 38, 48, 58, 68, 78, 88, 98, 9, 19, 29, 39, 49, 59, 69, 79, 89, 99].filter((x) => x % 10 === k && x % k !== 0 && x > 10);
  const trap = pick(endsInK);
  const near = [n + 1, n - 1, n + 2, n - 2].filter((x) => x > 0 && x <= 100 && x % k !== 0 && x !== trap);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Which number is a multiple of ${k}?`, hint: `Divide each one by ${k}, or skip-count by ${k} past ${10 * k}.`, explain: `${k} × ${m} = ${n}. (${trap} ends in ${k}, but ${trap} ÷ ${k} leaves ${trap % k} left over.)` },
        String(n),
        [String(trap), String(near[0]), String(near[1])]
      ),
    },
  ];
}

// Q7 — hard: the next multiple past a number
export function nextMultipleAfterQuestion(): TestQuestion[] {
  const k = pick([6, 7, 8, 9]);
  let x = randInt(40, 90);
  while (x % k === 0) x++;
  const next = k * (Math.floor(x / k) + 1);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is the first multiple of ${k} that is bigger than ${x}?`, hint: `${k} × ${Math.floor(x / k)} = ${k * Math.floor(x / k)}. Add one more ${k}.`, explain: `${k} × ${Math.floor(x / k) + 1} = ${next}.`, answer: next },
    },
  ];
}

// Q8 — hard, choice: multiples keep going past the times table
export function beyondTableQuestion(): TestQuestion[] {
  const k = pick([7, 8, 9]);
  const m = randInt(11, Math.floor(100 / k));
  const n = k * m;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Is ${n} a multiple of ${k}?`, hint: `Keep skip-counting by ${k} past ${10 * k}.`, explain: `${k} × ${m} = ${n}. Multiples never stop at the end of the times table — they go on forever.` },
        `Yes — ${k} × ${m} = ${n}`,
        [
          `No — the ${k}s times table stops at ${10 * k}`, // MISCONCEPTION: multiples stop at ×10
          `No — ${n} is too big to be a multiple of a one-digit number`, // MISCONCEPTION: size limit
        ]
      ),
    },
  ];
}

// Q9 — medium: how many multiples up to 100
export function countMultiplesQuestion(): TestQuestion[] {
  const k = pick([6, 7, 8, 9]);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `How many multiples of ${k} are there from 1 to 100?`, hint: `What is the biggest multiple of ${k} that's 100 or less? ${k} × ? = that number.`, explain: `${k} × ${Math.floor(100 / k)} = ${k * Math.floor(100 / k)} is the last one, so there are ${Math.floor(100 / k)}.`, answer: Math.floor(100 / k) },
    },
  ];
}

// Q10 — hard, choice: a number is a multiple of EACH of its factors
export function multipleOfEachFactorQuestion(): TestQuestion[] {
  const n = pick([24, 30, 36, 40, 42, 48, 54, 56, 60, 72]);
  const [a, b] = pick(factorPairs(n).filter(([x, y]) => x > 1 && x !== y));
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `${a} × ${b} = ${n}. Which is true?`, hint: `Can you reach ${n} by skip-counting by ${a}? By ${b}?`, explain: `${n} is a multiple of ${a} (${b} groups of ${a}) AND of ${b} (${a} groups of ${b}). A number is a multiple of every one of its factors.` },
        `${n} is a multiple of ${a} AND a multiple of ${b}`,
        [
          `${n} is a multiple of ${b}, but not of ${a}`, // MISCONCEPTION: only the bigger factor "counts"
          `${n} is a factor of ${a} and of ${b}`, // MISCONCEPTION: factor/multiple swapped
          `${a} and ${b} are multiples of ${n}`, // MISCONCEPTION: factor/multiple swapped
        ]
      ),
    },
  ];
}

export const multiplesTest: Unit["test"] = {
  questions: [nextMultipleQuestion, whichMultipleQuestion, nearMissChoiceQuestion, remainderQuestion, factorOrMultipleQuestion, hardMultipleChoiceQuestion, nextMultipleAfterQuestion, beyondTableQuestion, countMultiplesQuestion, multipleOfEachFactorQuestion],
  passScore: 9,
};
