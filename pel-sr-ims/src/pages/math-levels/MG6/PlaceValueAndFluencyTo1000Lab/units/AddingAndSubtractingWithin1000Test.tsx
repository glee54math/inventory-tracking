import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Adding and Subtracting Within 1000 ----------
// Self-contained — does NOT import from AddingAndSubtractingWithin1000.tsx
// (that file imports THIS one; importing back would be a circular import, the
// exact "Level not found" failure mode documented in VISUAL_COMPONENT_TODO.txt).
// Every helper below is a deliberate duplicate of the unit file's own copy.
//
// Unlike Practice, test questions use plain NumberSteps for the final
// answer, not the per-digit CustomStep widget: a CustomStep only ever calls
// onDone once it's CORRECT, so inside a no-feedback test a student who's
// wrong would be stuck unable to submit at all. The per-digit/per-regroup
// mechanics are tested instead through the misconception-targeted choice
// questions below, whose distractors are the exact numbers each specific
// wrong algorithm produces.

const digitsOnesFirst = (n: number): number[] => String(n).padStart(3, "0").split("").map(Number).reverse();
const fromOnesFirst = (d: number[]): number => d.reduce((acc, v, i) => acc + v * Math.pow(10, i), 0);

/** Count of regroups (ones->tens, tens->hundreds) the written algorithm needs. */
const regroupCount = (a: number, b: number, op: "add" | "sub"): number => {
  const ad = digitsOnesFirst(a);
  const bd = digitsOnesFirst(b);
  let carry = 0;
  let count = 0;
  for (let i = 0; i < 2; i++) {
    if (op === "add") {
      carry = ad[i] + bd[i] + carry >= 10 ? 1 : 0;
    } else {
      carry = ad[i] - carry < bd[i] ? 1 : 0;
    }
    count += carry;
  }
  return count;
};

/** Wrong: adds each column but never carries the extra ten. */
const forgotCarrySum = (a: number, b: number): number => {
  const ad = digitsOnesFirst(a);
  const bd = digitsOnesFirst(b);
  return fromOnesFirst(ad.map((v, i) => (v + bd[i]) % 10));
};
/** Wrong: in every column, subtracts the smaller digit from the larger one. */
const smallerFromLarger = (a: number, b: number): number => {
  const ad = digitsOnesFirst(a);
  const bd = digitsOnesFirst(b);
  return fromOnesFirst(ad.map((v, i) => Math.abs(v - bd[i])));
};
/** Wrong: borrows 10 into a column but never reduces the column it borrowed from. */
const forgotToReduce = (a: number, b: number): number => {
  const ad = digitsOnesFirst(a);
  const bd = digitsOnesFirst(b);
  return fromOnesFirst(ad.map((v, i) => (v < bd[i] ? v + 10 - bd[i] : v - bd[i])));
};

// ---- generators (duplicates of the unit file's) ----
export const randAddNoRegroup = (): { a: number; b: number } => {
  let a = 0, b = 0, ok = false;
  do {
    const o1 = randInt(0, 9), o2 = randInt(0, 9), t1 = randInt(0, 9), t2 = randInt(0, 9), h1 = randInt(1, 9), h2 = randInt(0, 9);
    ok = o1 + o2 < 10 && t1 + t2 < 10 && h1 + h2 < 10;
    a = h1 * 100 + t1 * 10 + o1;
    b = h2 * 100 + t2 * 10 + o2;
  } while (!ok);
  return { a, b };
};
export const randAddWithRegroups = (want: 1 | 2): { a: number; b: number } => {
  let a = 0, b = 0, ok = false;
  do {
    a = randInt(100, 899);
    b = randInt(10, 899);
    ok = a + b <= 999 && regroupCount(a, b, "add") === want;
  } while (!ok);
  return { a, b };
};
export const randSubNoRegroup = (): { a: number; b: number } => {
  const ha = randInt(1, 9), ta = randInt(0, 9), oa = randInt(0, 9);
  return { a: ha * 100 + ta * 10 + oa, b: randInt(0, ha) * 100 + randInt(0, ta) * 10 + randInt(0, oa) };
};
export const randSubWithBorrows = (want: 1 | 2): { a: number; b: number } => {
  let a = 0, b = 0, ok = false;
  do {
    a = randInt(100, 999);
    b = randInt(10, a);
    ok = regroupCount(a, b, "sub") === want;
  } while (!ok);
  return { a, b };
};
/** Forces the borrow-through-zero case: `a`'s tens digit is 0 and its ones digit needs to borrow. */
export const randSubThroughZero = (): { a: number; b: number } => {
  const ha = randInt(2, 9);
  const oa = randInt(0, 8);
  const ob = randInt(oa + 1, 9);
  return { a: ha * 100 + oa, b: randInt(0, ha - 1) * 100 + randInt(0, 9) * 10 + ob };
};

const opQuestion = (a: number, b: number, op: "add" | "sub", difficulty: TestQuestion["difficulty"]): TestQuestion[] => {
  const result = op === "add" ? a + b : a - b;
  const sym = op === "add" ? "+" : "−";
  const n = regroupCount(a, b, op);
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `${a} ${sym} ${b} = ?`,
        hint: "Line up hundreds, tens and ones, and start with the ones column.",
        explain: `${a} ${sym} ${b} = ${result}${n ? ` (${n} regroup${n === 1 ? "" : "s"} needed)` : " (no regrouping needed)"}.`,
        answer: result,
      },
    },
  ];
};

export const addNoRegroupQuestion = (): TestQuestion[] => {
  const { a, b } = randAddNoRegroup();
  return opQuestion(a, b, "add", "easy");
};
export const addSingleRegroupQuestion = (): TestQuestion[] => {
  const { a, b } = randAddWithRegroups(1);
  return opQuestion(a, b, "add", "medium");
};
export const addDoubleRegroupQuestion = (): TestQuestion[] => {
  const { a, b } = randAddWithRegroups(2);
  return opQuestion(a, b, "add", "hard");
};
export const subNoRegroupQuestion = (): TestQuestion[] => {
  const { a, b } = randSubNoRegroup();
  return opQuestion(a, b, "sub", "easy");
};
export const subSingleBorrowQuestion = (): TestQuestion[] => {
  const { a, b } = randSubWithBorrows(1);
  return opQuestion(a, b, "sub", "medium");
};
export const subThroughZeroQuestion = (): TestQuestion[] => {
  const { a, b } = randSubThroughZero();
  return opQuestion(a, b, "sub", "hard");
};

/** How many regroups does this problem need — tests recognizing the regroup, not just computing. */
export const regroupCountQuestion = (): TestQuestion[] => {
  const want = (randInt(1, 2) as 1 | 2);
  const { a, b } = randAddWithRegroups(want);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `Solving ${a} + ${b} with the written algorithm, how many times do you have to carry a ten?`,
        hint: "Check the ones column, then the tens column (don't forget any carry coming in).",
        explain: `${a} + ${b} needs ${want} carr${want === 1 ? "y" : "ies"}.`,
        answer: want,
      },
    },
  ];
};

/** Which answer is right? Distractor = the exact sum a student gets by never carrying. */
export const forgotCarryQuestion = (): TestQuestion[] => {
  let a = 0, b = 0, wrong = 0, wrong2 = 0;
  do {
    ({ a, b } = randAddWithRegroups(2));
    wrong = forgotCarrySum(a, b);
    wrong2 = a + b + 100; // carried one ten too many into the hundreds
  } while (wrong === a + b || wrong2 > 999 || wrong === wrong2);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `What is ${a} + ${b}?`,
          hint: "Both the ones and the tens columns make 10 or more — each needs a carry.",
          explain: `${a} + ${b} = ${a + b}. ${wrong} is what you get by adding each column but never carrying the extra ten.`,
        },
        String(a + b),
        [
          // Misconception: adds each column independently, drops every carry.
          String(wrong),
          // Misconception: carries into the hundreds when it didn't need to (counts an extra regroup).
          String(wrong2),
        ]
      ),
    },
  ];
};

/** Distractors = "smaller from larger" in each column, and "borrowed but forgot to reduce". */
export const subtractionMistakeQuestion = (): TestQuestion[] => {
  let a = 0, b = 0, w1 = 0, w2 = 0;
  do {
    ({ a, b } = randSubWithBorrows(randInt(1, 2) as 1 | 2));
    w1 = smallerFromLarger(a, b);
    w2 = forgotToReduce(a, b);
  } while (new Set([a - b, w1, w2]).size < 3);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `What is ${a} − ${b}?`,
          hint: "When the top digit is smaller, borrow — and remember the column you borrowed from goes down by 1.",
          explain: `${a} − ${b} = ${a - b}.`,
        },
        String(a - b),
        [
          // Misconception: in each column, subtracts the smaller digit from the larger (never borrows).
          String(w1),
          // Misconception: borrows the 10 but never reduces the column it borrowed from.
          String(w2),
        ]
      ),
    },
  ];
};

/** Borrow-through-zero, with the "skip the zero" wrong answer as a distractor. */
export const throughZeroTrapQuestion = (): TestQuestion[] => {
  let a = 0, b = 0, w1 = 0, w2 = 0;
  do {
    ({ a, b } = randSubThroughZero());
    w1 = forgotToReduce(a, b);
    w2 = smallerFromLarger(a, b);
  } while (new Set([a - b, w1, w2]).size < 3);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${a} has a 0 in the tens place. What is ${a} − ${b}?`,
          hint: "The tens column has nothing to lend — it must borrow from the hundreds first, then lend to the ones.",
          explain: `${a} − ${b} = ${a - b}. The 0 in the tens place becomes 10, then 9 after lending one ten to the ones.`,
        },
        String(a - b),
        [
          // Misconception: treats the 0 tens column as if it could lend without itself borrowing (hundreds never reduced).
          String(w1),
          // Misconception: avoids borrowing entirely, subtracting smaller digit from larger.
          String(w2),
        ]
      ),
    },
  ];
};

export const addSubWithin1000Test: Unit["test"] = {
  questions: [
    addNoRegroupQuestion,
    addSingleRegroupQuestion,
    addDoubleRegroupQuestion,
    subNoRegroupQuestion,
    subSingleBorrowQuestion,
    subThroughZeroQuestion,
    regroupCountQuestion,
    forgotCarryQuestion,
    subtractionMistakeQuestion,
    throughZeroTrapQuestion,
  ],
  passScore: 9,
};
