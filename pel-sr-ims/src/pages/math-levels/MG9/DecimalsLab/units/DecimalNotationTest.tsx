import { DecimalNumberLine, GridRow } from "../diagrams";
import { decimalText, decimalWords, mixedDecimal, numberWords, twoDigitHundredths } from "../lib/decimals";
import { randInt } from "../../../shared/lib/math";
import { Frac } from "../../../shared/engine/controls";
import { choice, numberBlank, selectBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Self-contained: never imports from DecimalNotation.tsx (that file imports
// THIS one). Shared helpers come from ../lib/decimals.ts.
//
// Typed decimal answers use NumberStep.padTo (1 for tenths, 2 for
// hundredths). There is no "must be a decimal" flag on NumberStep, and
// parseAnswer() happily reads "3/10" as 0.3 — padTo is what rejects a typed
// fraction here (it has no digits after a point), which is the whole skill
// being tested. Prompts always say how many digits go after the point.

// Q1 — tenths fraction -> decimal (typed)
export function tenthsToDecimalQuestion(difficulty: "easy" | "medium", withVisual: boolean): () => TestQuestion[] {
  return () => {
    const n = randInt(1, 9);
    return [
      {
        visual: withVisual ? <GridRow size={110} tenthsOnly segments={[{ count: 10 * n, tone: "a" }]} /> : null,
        difficulty,
        step: {
          kind: "number",
          answer: n / 10,
          padTo: 1,
          prompt: (
            <>
              Write <Frac n={n} d={10} /> as a decimal, with one digit after the decimal point.
            </>
          ),
          hint: "The first place after the point is the tenths place.",
          explain: `${n} tenths = 0.${n}. The first digit after the point counts tenths.`,
        },
      },
    ];
  };
}

// Q2 — hundredths fraction -> decimal (typed)
export function hundredthsToDecimalQuestion(difficulty: "easy" | "medium", withVisual: boolean): () => TestQuestion[] {
  return () => {
    const m = twoDigitHundredths();
    return [
      {
        visual: withVisual ? <GridRow size={110} segments={[{ count: m - (m % 10), tone: "a" }, { count: m % 10, tone: "c" }]} /> : null,
        difficulty,
        step: {
          kind: "number",
          answer: m / 100,
          padTo: 2,
          prompt: (
            <>
              Write <Frac n={m} d={100} /> as a decimal, with two digits after the decimal point.
            </>
          ),
          hint: "Hundredths need two places after the point: tenths, then hundredths.",
          explain: `${m} hundredths = ${Math.floor(m / 10)} tenths and ${m % 10} hundredths = ${decimalText(m, 2)}.`,
        },
      },
    ];
  };
}

// Q3 — single-digit hundredths -> decimal: the hidden zero (typed)
export function hiddenZeroToDecimalQuestion(): TestQuestion[] {
  const h = randInt(1, 9);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        answer: h / 100,
        padTo: 2,
        prompt: (
          <>
            Write <Frac n={h} d={100} /> as a decimal, with two digits after the decimal point.
          </>
        ),
        hint: `There are 0 tenths. What goes in the tenths place?`,
        explain: `${h}/100 has 0 tenths and ${h} hundredths, so it's 0.0${h}. Without the 0, 0.${h} would mean ${h} TENTHS — ten times as much.`,
      },
    },
  ];
}

// Q4 — which fraction is 0.0h? (choice)
export function hiddenZeroChoiceQuestion(): TestQuestion[] {
  const h = randInt(1, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which fraction is equal to 0.0${h}?`,
          hint: "Which place is the last digit in?",
          explain: `The ${h} is in the hundredths place (the 0 holds the tenths place), so 0.0${h} = ${h}/100.`,
        },
        `${h}/100`,
        [
          `${h}/10`, // ignored the 0 — read the digit as tenths
          `${10 * h}/100`, // same mistake written in hundredths (0.${h})
        ]
      ),
    },
  ];
}

// Q5 — read a hundredths decimal aloud (choice)
export function readDecimalQuestion(): TestQuestion[] {
  const m = twoDigitHundredths();
  const t = Math.floor(m / 10);
  const h = m % 10;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `How do you read ${decimalText(m, 2)}?`,
          hint: "Name the number by the place of its LAST digit.",
          explain: `The last digit is in the hundredths place, so ${decimalText(m, 2)} is read "${decimalWords(m, 2)}".`,
        },
        decimalWords(m, 2),
        [
          `${numberWords(m)} tenths`, // named it by the first place after the point
          `${numberWords(t)} and ${numberWords(h)} tenths`, // read the point as "and"
        ]
      ),
    },
  ];
}

// Q6 — hundredths decimal -> fraction (two typed blanks)
export function decimalToFractionQuestion(): TestQuestion[] {
  const m = twoDigitHundredths();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { ...sentence(
        {
          prompt: `Write ${decimalText(m, 2)} as a fraction. Use the place of the last digit for the bottom number.`,
          hint: "Two digits after the point means hundredths.",
          explain: `${decimalText(m, 2)} is ${numberWords(m)} hundredths: ${m}/100.`,
        },
        `${decimalText(m, 2)} = `,
        numberBlank(m),
        " / ",
        numberBlank(100),
        ""
      ), stacked: true },
    },
  ];
}

// Q7 — mixed number -> decimal (typed)
export function mixedToDecimalQuestion(difficulty: "medium" | "hard", withLine: boolean): () => TestQuestion[] {
  return () => {
    const { w, n, d, h, places } = mixedDecimal();
    return [
      {
        visual: withLine ? <DecimalNumberLine fromWhole={w} points={[{ hundredths: h, tone: "a" }]} /> : null,
        difficulty,
        step: {
          kind: "number",
          answer: h / 100,
          padTo: places,
          prompt: (
            <>
              Write {w} <Frac n={n} d={d} /> as a decimal, with {places === 1 ? "one digit" : "two digits"} after the decimal point.
            </>
          ),
          hint: "The whole number goes before the point; the fraction goes after it.",
          explain: `${w} ${n}/${d} = ${w} and ${n} ${d === 10 ? "tenths" : "hundredths"} = ${decimalText(h, places)}.`,
        },
      },
    ];
  };
}

// Q8 — decimal with a hidden zero -> mixed number (choice)
export function decimalToMixedChoiceQuestion(): TestQuestion[] {
  let w = randInt(1, 9);
  const z = randInt(1, 9);
  while (w === z) w = randInt(1, 9); // keeps the swapped distractor distinct
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `Which mixed number is equal to ${w}.0${z}?`,
          hint: "Look carefully at the digit right after the point.",
          explain: `${w}.0${z} is ${w} wholes, 0 tenths and ${z} hundredths: ${w} ${z}/100.`,
        },
        `${w} ${z}/100`,
        [
          `${w} ${z}/10`, // dropped the hidden zero
          `${z} ${w}/100`, // swapped the whole-number part and the fraction part
        ]
      ),
    },
  ];
}

// Q9 — which is greater, 0.t or 0.0t? (choice)
export function compareZeroQuestion(): TestQuestion[] {
  const t = randInt(1, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which is greater: 0.${t} or 0.0${t}?`,
          hint: "Which place is the digit in, in each one?",
          explain: `0.${t} is ${t} tenths (${10 * t} hundredths); 0.0${t} is only ${t} hundredths. 0.${t} is ten times as much.`,
        },
        `0.${t}`,
        [
          `0.0${t}`, // "more digits means bigger"
          "They are equal", // "a zero doesn't change anything"
        ]
      ),
    },
  ];
}

// Q10 — place names inside a mixed decimal (two dropdowns)
export function placeValueSentenceQuestion(): TestQuestion[] {
  // three different digits so "the 4" names exactly one place
  const w = randInt(1, 9);
  let a = randInt(1, 9);
  while (a === w) a = randInt(1, 9);
  let b = randInt(1, 9);
  while (b === w || b === a) b = randInt(1, 9);
  const dec = `${w}.${a}${b}`;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: sentence(
        {
          prompt: `Fill in both blanks about ${dec}.`,
          hint: "Right after the point is tenths; next is hundredths.",
          explain: `In ${dec}, the ${w} is ones, the ${a} is tenths and the ${b} is hundredths.`,
        },
        `In ${dec}, the ${a} is in the `,
        selectBlank("tenths", ["hundredths", "ones"]),
        ` place, and the ${b} is in the `,
        selectBlank("hundredths", ["tenths", "ones"]),
        " place."
      ),
    },
  ];
}

export const decimalNotationTest: Unit["test"] = {
  questions: [
    tenthsToDecimalQuestion("easy", true),
    hundredthsToDecimalQuestion("easy", true),
    hiddenZeroToDecimalQuestion,
    hiddenZeroChoiceQuestion,
    readDecimalQuestion,
    decimalToFractionQuestion,
    mixedToDecimalQuestion("medium", false),
    decimalToMixedChoiceQuestion,
    compareZeroQuestion,
    placeValueSentenceQuestion,
  ],
  passScore: 9,
};
