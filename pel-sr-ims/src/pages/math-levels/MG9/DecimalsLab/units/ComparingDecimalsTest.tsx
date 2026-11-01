import { DiffWholeBars, GridRow } from "../diagrams";
import { compareSymbol, decimalText, diffWholeScenario, fewerDigitsPair, sameDigitsPair, sameWholePartPair, shortDecimal } from "../lib/decimals";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Self-contained: never imports from ComparingDecimals.tsx (that file imports
// THIS one). Number-picking lives in ../lib/decimals.ts.

const SYMBOLS = ["<", ">", "="];

const twoGrids = (a: number, b: number, la: string, lb: string) => (
  <div className="control-row">
    <GridRow size={100} segments={[{ count: a, tone: "a" }]} caption={la} />
    <GridRow size={100} segments={[{ count: b, tone: "c" }]} caption={lb} />
  </div>
);

// Q1 — same number of digits, symbol (choice)
export function sameDigitsQuestion(difficulty: "easy" | "medium", withVisual: boolean): () => TestQuestion[] {
  return () => {
    const { a, b } = sameDigitsPair();
    const da = decimalText(a, 2);
    const db = decimalText(b, 2);
    const sym = compareSymbol(a, b);
    return [
      {
        visual: withVisual ? twoGrids(a, b, da, db) : null,
        difficulty,
        step: choice(
          {
            prompt: `Which symbol goes in the blank? ${da} ___ ${db}`,
            hint: "Compare tenths first. If they match, compare hundredths.",
            explain: `${da} is ${a} hundredths and ${db} is ${b} hundredths, so ${da} ${sym} ${db}.`,
          },
          sym,
          SYMBOLS // the flipped symbol = reading it backwards; "=" = ignoring the digits
        ),
      },
    ];
  };
}

// Q2, Q3 — the "more digits = bigger" trap, symbol (choice)
export function fewerDigitsQuestion(difficulty: "medium" | "hard", withVisual: boolean): () => TestQuestion[] {
  return () => {
    const { short, long } = fewerDigitsPair();
    const ds = shortDecimal(short);
    const dl = decimalText(long, 2);
    const shortFirst = Math.random() < 0.5;
    const [x, y] = shortFirst ? [short, long] : [long, short];
    const [dx, dy] = shortFirst ? [ds, dl] : [dl, ds];
    const sym = compareSymbol(x, y);
    return [
      {
        visual: withVisual ? twoGrids(x, y, dx, dy) : null,
        difficulty,
        step: choice(
          {
            prompt: `Which symbol goes in the blank? ${dx} ___ ${dy}`,
            hint: `Write ${ds} with two digits: ${ds} = ${decimalText(short, 2)}.`,
            explain: `${ds} = ${decimalText(short, 2)} = ${short} hundredths, which is more than ${long} hundredths. More digits doesn't mean bigger: ${dx} ${sym} ${dy}.`,
          },
          sym,
          SYMBOLS // the opposite symbol is exactly the "longer decimal is bigger" mistake
        ),
      },
    ];
  };
}

// Q4 — a tenths decimal as hundredths (typed)
export function asHundredthsQuestion(): TestQuestion[] {
  const t = randInt(1, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        answer: 10 * t,
        suffix: "hundredths",
        prompt: `0.${t} is the same amount as how many hundredths?`,
        hint: "Each tenth is 10 hundredths.",
        explain: `0.${t} = ${t} tenths = ${10 * t} hundredths, so 0.${t} = 0.${t}0.`,
      },
    },
  ];
}

// Q5 — same whole-number part, symbol (choice)
export function sameWholePartQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const { a, b, w } = sameWholePartPair();
    const da = decimalText(a, 2);
    const db = decimalText(b, 2);
    const sym = compareSymbol(a, b);
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `Which symbol goes in the blank? ${da} ___ ${db}`,
            hint: `Both have ${w} ones. Compare tenths, then hundredths.`,
            explain: `Same ${w} ones, so compare what's after the point: ${a % 100} hundredths vs ${b % 100} hundredths. ${da} ${sym} ${db}.`,
          },
          sym,
          SYMBOLS
        ),
      },
    ];
  };
}

// Q6 — which place decides? (choice)
export function whichPlaceQuestion(): TestQuestion[] {
  const { a, b } = sameWholePartPair();
  const da = decimalText(a, 2);
  const db = decimalText(b, 2);
  const tenthsDiffer = Math.floor((a % 100) / 10) !== Math.floor((b % 100) / 10);
  const correct = tenthsDiffer ? "the tenths place" : "the hundredths place";
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `To compare ${da} and ${db}, which place decides which is bigger?`,
          hint: "Go left to right and stop at the first place where the digits are different.",
          explain: `The ones match${tenthsDiffer ? ", and the tenths are different — so the tenths decide." : " and the tenths match, so the hundredths decide."}`,
        },
        correct,
        [
          "the ones place", // didn't notice the whole-number parts are equal
          tenthsDiffer ? "the hundredths place" : "the tenths place", // compared from the right / wrong place
        ]
      ),
    },
  ];
}

// Q7 — different-size wholes: is the comparison fair? (choice)
export function diffWholeFairQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const s = diffWholeScenario();
    const equal = s.smallTenths === s.bigTenths;
    const claim = equal
      ? `${s.smallName} says, "We have the same amount of ${s.thing}, because 0.${s.smallTenths} = 0.${s.bigTenths}."`
      : `${s.smallName} says, "I have more ${s.thing}, because 0.${s.smallTenths} > 0.${s.bigTenths}."`;
    return [
      {
        visual: <DiffWholeBars s={s} />,
        difficulty,
        step: choice(
          {
            prompt: `${s.smallName} has 0.${s.smallTenths} of a 10 ${s.unit} ${s.thing}. ${s.bigName} has 0.${s.bigTenths} of a 100 ${s.unit} ${s.thing}. ${claim} Is that right?`,
            hint: "Are the two wholes the same size?",
            explain: `No — decimals can only be compared like this when they're parts of the same whole. ${s.smallName} has ${s.smallTenths} ${s.unit}; ${s.bigName} has ${10 * s.bigTenths} ${s.unit}.`,
          },
          "No — the wholes are different sizes, so the decimals alone can't tell us",
          [
            equal ? "Yes — equal decimals always mean equal amounts" : "Yes — the bigger decimal always means more", // ignoring the whole
            "Yes — both wholes are split into tenths, so it's fair", // "same denominator = fair" excuse
          ]
        ),
      },
    ];
  };
}

// Q8 — different-size wholes: who has more? (choice)
export function diffWholeWhoQuestion(): TestQuestion[] {
  const s = diffWholeScenario();
  return [
    {
      visual: <DiffWholeBars s={s} />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${s.smallName} has 0.${s.smallTenths} of a 10 ${s.unit} ${s.thing}. ${s.bigName} has 0.${s.bigTenths} of a 100 ${s.unit} ${s.thing}. Who has more ${s.thing}?`,
          hint: `How long is one tenth of each ${s.thing}?`,
          explain: `One tenth of 10 ${s.unit} is 1 ${s.unit}, so ${s.smallName} has ${s.smallTenths} ${s.unit}. One tenth of 100 ${s.unit} is 10 ${s.unit}, so ${s.bigName} has ${10 * s.bigTenths} ${s.unit} — more.`,
        },
        s.bigName,
        [
          s.smallName, // trusted the bigger (or equal) decimal without checking the wholes
          "They have the same amount", // "equal decimals = equal amounts"
        ]
      ),
    },
  ];
}

// Q9 — true/false: more digits is always bigger
export function moreDigitsTrapQuestion(): TestQuestion[] {
  const { short, long } = fewerDigitsPair();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: "True or false: A decimal with more digits after the point is always bigger.",
          hint: `Try ${shortDecimal(short)} and ${decimalText(long, 2)}.`,
          explain: `False — ${shortDecimal(short)} = ${decimalText(short, 2)}, which is bigger than ${decimalText(long, 2)} even though it has fewer digits.`,
        },
        "False",
        ["True"]
      ),
    },
  ];
}

// Q10 — a trailing zero: 0.t ___ 0.t0 (choice)
export function trailingZeroQuestion(): TestQuestion[] {
  const t = randInt(1, 9);
  const shortFirst = Math.random() < 0.5;
  const [x, y] = shortFirst ? [`0.${t}`, `0.${t}0`] : [`0.${t}0`, `0.${t}`];
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which symbol goes in the blank? ${x} ___ ${y}`,
          hint: "How many hundredths is each one?",
          explain: `0.${t} = ${t} tenths = ${10 * t} hundredths = 0.${t}0. A zero at the end doesn't change the amount.`,
        },
        "=",
        [
          shortFirst ? "<" : ">", // "the longer one is bigger"
          shortFirst ? ">" : "<",
        ]
      ),
    },
  ];
}

export const comparingDecimalsTest: Unit["test"] = {
  questions: [
    sameDigitsQuestion("easy", true),
    fewerDigitsQuestion("medium", true),
    fewerDigitsQuestion("hard", false),
    asHundredthsQuestion,
    sameWholePartQuestion("medium"),
    whichPlaceQuestion,
    diffWholeFairQuestion("medium"),
    diffWholeWhoQuestion,
    moreDigitsTrapQuestion,
    trailingZeroQuestion,
  ],
  passScore: 9,
};
