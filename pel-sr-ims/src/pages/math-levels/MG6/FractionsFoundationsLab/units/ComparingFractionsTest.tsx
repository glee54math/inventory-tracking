import { FractionBar } from "../diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, selectBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies — see WhatAFractionIsTest.tsx's comment on why *Test.tsx
// files never import back from their paired main unit file. Keep in sync
// with ComparingFractions.tsx.
const DENOMS = [2, 3, 4, 6, 8] as const;
const SYMBOLS = ["<", ">", "="];
const BIG_W = 320;

function compareSymbol(n1: number, d1: number, n2: number, d2: number): "<" | ">" | "=" {
  const a = n1 * d2;
  const b = n2 * d1;
  return a < b ? "<" : a > b ? ">" : "=";
}
function sameDenomPair(): { n1: number; n2: number; d: number } {
  const d = pick(DENOMS.filter((x) => x >= 3));
  const n1 = randInt(1, d - 1);
  let n2 = randInt(1, d - 1);
  while (n2 === n1) n2 = randInt(1, d - 1);
  return { n1, n2, d };
}
function sameNumPair(): { n: number; d1: number; d2: number } {
  const d1 = pick(DENOMS);
  let d2 = pick(DENOMS);
  while (d2 === d1) d2 = pick(DENOMS);
  const n = randInt(1, Math.min(d1, d2) - 1);
  return { n, d1, d2 };
}
function smallWholeWidth(smallFrac: number, bigFrac: number): number {
  return Math.max(70, Math.round((BIG_W * smallFrac * 0.7) / bigFrac));
}
function diffWholePair(): { a: [number, number]; b: [number, number]; smallW: number } {
  for (;;) {
    let a: [number, number];
    let b: [number, number];
    if (Math.random() < 0.5) {
      const { n, d1, d2 } = sameNumPair();
      const [big, small] = d1 > d2 ? [d1, d2] : [d2, d1];
      a = [n, big];
      b = [n, small];
    } else {
      const { n1, n2, d } = sameDenomPair();
      a = [Math.min(n1, n2), d];
      b = [Math.max(n1, n2), d];
    }
    const fa = a[0] / a[1];
    const fb = b[0] / b[1];
    const smallW = smallWholeWidth(fa, fb);
    if (fa * BIG_W > fb * smallW) return { a, b, smallW };
  }
}

const twoBars = (n1: number, d1: number, n2: number, d2: number) => (
  <div className="control-row">
    <FractionBar numerator={n1} denominator={d1} width={180} label={`${n1}/${d1}`} />
    <FractionBar numerator={n2} denominator={d2} width={180} label={`${n2}/${d2}`} />
  </div>
);

// Q1, Q5 — same denominator, symbol (choice)
export function sameDenomQuestion(difficulty: "easy" | "medium", withVisual: boolean): () => TestQuestion[] {
  return () => {
    const { n1, n2, d } = sameDenomPair();
    const sym = compareSymbol(n1, d, n2, d);
    return [
      {
        visual: withVisual ? twoBars(n1, d, n2, d) : null,
        difficulty,
        step: choice(
          {
            prompt: `Which symbol goes in the blank? ${n1}/${d} ___ ${n2}/${d}`,
            hint: "Same-size pieces — compare the top numbers.",
            explain: `Both are cut into ${d} equal pieces, so more pieces shaded is greater: ${n1}/${d} ${sym} ${n2}/${d}.`,
          },
          sym,
          // The flipped symbol (reading it backwards) and "=" (ignoring the numerators).
          SYMBOLS
        ),
      },
    ];
  };
}

// Q2, Q6 — same numerator, symbol (choice) — the counterintuitive case
export function sameNumQuestion(difficulty: "easy" | "medium" | "hard", withVisual: boolean): () => TestQuestion[] {
  return () => {
    const { n, d1, d2 } = sameNumPair();
    const sym = compareSymbol(n, d1, n, d2);
    return [
      {
        visual: withVisual ? twoBars(n, d1, n, d2) : null,
        difficulty,
        step: choice(
          {
            prompt: `Which symbol goes in the blank? ${n}/${d1} ___ ${n}/${d2}`,
            hint: "Same number of pieces — a whole cut into more parts has smaller pieces.",
            explain: `${n}/${d1} ${sym} ${n}/${d2} — fewer, bigger pieces wins.`,
          },
          sym,
          // The opposite symbol is exactly the "bigger denominator = bigger fraction" mistake.
          SYMBOLS
        ),
      },
    ];
  };
}

// Q3 — which has bigger pieces (choice, visual)
export function biggerPiecesQuestion(): TestQuestion[] {
  const { n, d1, d2 } = sameNumPair();
  const fewer = Math.min(d1, d2);
  const more = Math.max(d1, d2);
  return [
    {
      visual: twoBars(n, d1, n, d2),
      difficulty: "medium",
      step: choice(
        {
          prompt: `${n}/${d1} and ${n}/${d2} have the same number of pieces shaded. Which whole has the BIGGER pieces?`,
          hint: "Cutting the same whole into more parts makes each part smaller.",
          explain: `Cutting into ${fewer} parts makes bigger pieces than cutting into ${more}.`,
        },
        `The one cut into ${fewer} parts`,
        // Whole-number intuition: bigger number = bigger piece.
        [`The one cut into ${more} parts`, "The pieces are the same size"]
      ),
    },
  ];
}

// Q4, Q8 — different-size wholes trap (choice, visual)
export function diffWholeQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const { a, b, smallW } = diffWholePair();
    return [
      {
        visual: (
          <div className="control-row">
            <FractionBar numerator={a[0]} denominator={a[1]} width={BIG_W} label={`${a[0]}/${a[1]} of a BIG whole`} />
            <FractionBar numerator={b[0]} denominator={b[1]} width={smallW} label={`${b[0]}/${b[1]}`} />
          </div>
        ),
        difficulty,
        step: choice(
          {
            prompt: `Sam says ${a[0]}/${a[1]} > ${b[0]}/${b[1]} because its shaded part looks bigger. Is Sam right?`,
            hint: "Look at the two wholes themselves, not the shaded parts.",
            explain: `No — the wholes are different sizes, so the pictures can't be compared. On the same-size whole, ${a[0]}/${a[1]} < ${b[0]}/${b[1]}.`,
          },
          "No — the wholes aren't the same size, and on the same whole it's actually smaller",
          // Trusting the misleading shaded area; and a "both equal parts" excuse.
          ["Yes — its shaded part is bigger", "Yes — both wholes are split into equal parts, so it's fair"]
        ),
      },
    ];
  };
}

// Q7 — the equal case (choice, no visual)
export function equalQuestion(): TestQuestion[] {
  const d = pick(DENOMS);
  const n = randInt(1, d - 1);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which symbol goes in the blank? ${n}/${d} ___ ${n}/${d}`,
          hint: "Is either one actually bigger?",
          explain: `Same top number and same bottom number — ${n}/${d} = ${n}/${d}.`,
        },
        "=",
        // Defaulting to < or > out of habit.
        ["<", ">"]
      ),
    },
  ];
}

// Q9 — true/false generalization trap
export function generalizationQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or False: When two fractions have the same top number, the one with the bigger bottom number is bigger.",
          hint: "Think of 1/3 and 1/6.",
          explain: "False — a bigger bottom number means smaller pieces, so 1/6 < 1/3.",
        },
        "False",
        ["True"]
      ),
    },
  ];
}

// Q10 — reasoning sentence (two dropdowns)
function reasoningSentenceQuestion(): TestQuestion[] {
  const { n, d1, d2 } = sameNumPair();
  const [small, big] = d1 < d2 ? [d1, d2] : [d2, d1];
  return [
    {
      visual: null,
      difficulty: "hard",
      step: sentence(
        {
          prompt: `Fill in both blanks comparing ${n}/${small} and ${n}/${big}.`,
          hint: "A whole cut into more parts has smaller parts.",
          explain: `A whole cut into ${big} parts has smaller pieces than one cut into ${small}, so ${n}/${big} < ${n}/${small}.`,
        },
        `A whole cut into ${big} parts has `,
        selectBlank("smaller", ["bigger", "the same size"]),
        ` pieces than one cut into ${small} parts, so ${n}/${big} is `,
        selectBlank(`less than ${n}/${small}`, [`greater than ${n}/${small}`, `equal to ${n}/${small}`]),
        "."
      ),
    },
  ];
}

export const comparingFractionsTest: Unit["test"] = {
  questions: [
    sameDenomQuestion("easy", true),
    sameNumQuestion("easy", true),
    biggerPiecesQuestion,
    diffWholeQuestion("medium"),
    sameDenomQuestion("medium", false),
    sameNumQuestion("medium", false),
    equalQuestion,
    diffWholeQuestion("hard"),
    generalizationQuestion,
    reasoningSentenceQuestion,
  ],
  passScore: 9,
};
