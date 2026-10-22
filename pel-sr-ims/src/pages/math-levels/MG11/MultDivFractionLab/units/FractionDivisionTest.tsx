import { AreaRectangle, RecipeCard, SharingBars } from "../diagrams";
import { gcd, pick, randInt, simplify } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import { Frac, QA, QB, Quotient } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

function properFraction(): [number, number] {
  const d = randInt(2, 9);
  const n = randInt(1, d - 1);
  const g = gcd(n, d);
  return [n / g, d / g];
}

const quotientOf = (an: number, bd: number, cn: number, dd: number) => simplify(an * dd, bd * cn);

// Local mirror of FractionDivision.tsx's RandomAmount/amountToFraction/AmountText
// (whole-or-proper-or-mixed amount) — own copy rather than an import, same
// "every *Test.tsx keeps its own local data" convention noted above for
// TEST_RECIPES (see that comment re: the Conversions circular-import bug).
interface TestAmount {
  whole?: number;
  n?: number;
  d?: number;
}

/** A proper fraction wrapped as a TestAmount (no whole part). */
function properAmount(): TestAmount {
  const [n, d] = properFraction();
  return { n, d };
}

/** A mixed number — whole part 1-4 plus a proper fraction part. */
function mixedAmount(): TestAmount {
  const [n, d] = properFraction();
  return { whole: randInt(1, 4), n, d };
}

function amountToFraction({ whole, n, d }: TestAmount): [number, number] {
  if (n !== undefined && d !== undefined) return [(whole ?? 0) * d + n, d];
  return [whole ?? 0, 1];
}

/** A TestAmount in "regular" fraction style, for use inside a prompt/story. */
function AmountText({ value }: { value: TestAmount }) {
  return (
    <>
      {value.whole !== undefined && <>{value.whole} </>}
      {value.n !== undefined && value.d !== undefined && <Frac n={value.n} d={value.d} />}
    </>
  );
}

// Own local copy of a couple of FractionDivision.tsx's recipes — not an import,
// same "every MM1/MG11 *Test.tsx keeps its own local data" convention that
// turned out to be load-bearing for Conversions (see that unit's own *Test.tsx
// comment) — Conversions.tsx and ConversionsTest.tsx both importing from each
// other threw "Cannot access ... before initialization" in dev. Simplified to
// proper-fraction amounts only (no whole/mixed numbers) since the test checks
// the underlying share-of-a-fraction skill, not every amount shape Explore/
// Practice walk through.
interface TestRecipe {
  title: string;
  ingredients: { name: string; unit: string }[];
}
const TEST_RECIPES: TestRecipe[] = [
  {
    title: "Fruit salad",
    ingredients: [
      { name: "strawberries", unit: "cup" },
      { name: "grapes", unit: "cup" },
      { name: "orange slices", unit: "cup" },
      { name: "honey", unit: "tablespoon" },
    ],
  },
  {
    title: "Pancake batter",
    ingredients: [
      { name: "flour", unit: "cup" },
      { name: "milk", unit: "cup" },
      { name: "sugar", unit: "tablespoon" },
      { name: "baking powder", unit: "teaspoon" },
    ],
  },
];
const TEST_RECIPE_SCALES: { n: number; word: string }[] = [
  { n: 2, word: "half" },
  { n: 3, word: "third" },
  { n: 4, word: "quarter" },
];

// Q1 — visual, rectangle area (matches measurementProblem's "find area" branch —
// straight multiplication, no reciprocal, the complement to Q3's "find width").
function areaQuestion(): TestQuestion[] {
  const [ln, ld] = properFraction();
  const [wn, wd] = properFraction();
  const [qn, qd] = simplify(ln * wn, ld * wd);
  return [
    {
      visual: <AreaRectangle length={[ln, ld]} width={[wn, wd]} find="area" unit="mi" />,
      difficulty: "medium",
      step: {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        suffix: "sq mi",
        prompt: <>A rectangular strip of land has a length of <QA><Frac n={ln} d={ld} /></QA> miles and a width of <QB><Frac n={wn} d={wd} /></QB> miles. What is its area?</>,
        hint: "Area = length × width.",
        explain: <><Frac n={ln} d={ld} /> × <Frac n={wn} d={wd} /> = <Quotient n={qn} d={qd} /> sq mi.</>,
        answer: (ln * wn) / (ld * wd),
      },
    },
  ];
}

// Q2 — visual, sharing
function sharingQuestion(): TestQuestion[] {
  const n = randInt(2, 6);
  const [an, bd] = properFraction();
  const [qn, qd] = simplify(an, bd * n);
  return [
    {
      // Two stacked bars — see the matching comment in FractionDivision.tsx's sharingProblem.
      visual: <SharingBars numerator={an} denominator={bd} shareCount={n} />,
      difficulty: "easy",
      step: {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        suffix: "lb",
        prompt: <>{n} people share <QA><Frac n={an} d={bd} /></QA> lb of trail mix equally. How much does each person get?</>,
        hint: <><Frac n={an} d={bd} /> ÷ {n} = <Frac n={an} d={bd} /> × <Frac n={1} d={n} />.</>,
        explain: <><Frac n={an} d={bd} /> ÷ {n} simplifies to <Quotient n={qn} d={qd} /> lb.</>,
        answer: an / (bd * n),
      },
    },
  ];
}

// Q3 — visual, measurement (second variant: rectangle width)
function widthQuestion(): TestQuestion[] {
  const [cn, dd] = properFraction();
  const [an, bd] = properFraction();
  const [qn, qd] = quotientOf(an, bd, cn, dd);
  return [
    {
      visual: <AreaRectangle length={[cn, dd]} width={[qn, qd]} find="width" unit="mi" />,
      difficulty: "hard",
      step: {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        suffix: "mi",
        prompt: <>A rectangular strip of land has area <QA><Frac n={an} d={bd} /></QA> square miles and length <QB><Frac n={cn} d={dd} /></QB> miles. How wide is it?</>,
        hint: "Width = area ÷ length.",
        explain: <><Frac n={an} d={bd} /> ÷ <Frac n={cn} d={dd} /> = <Quotient n={qn} d={qd} /> mi.</>,
        answer: (an * dd) / (bd * cn),
      },
    },
  ];
}

// Q4 — text, straight computation (proper ÷ proper — the simplest tier of this skill)
function simpleComputeQuestion(): TestQuestion[] {
  const [an, bd] = properFraction();
  const [cn, dd] = properFraction();
  const [qn, qd] = quotientOf(an, bd, cn, dd);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        prompt: <>What is <QA><Frac n={an} d={bd} /></QA> ÷ <QB><Frac n={cn} d={dd} /></QB>?</>,
        hint: "Multiply by the reciprocal of the second fraction, then simplify.",
        explain: <><Frac n={an} d={bd} /> × <Frac n={dd} d={cn} /> = <Quotient n={qn} d={qd} />.</>,
        answer: (an * dd) / (bd * cn),
      },
    },
  ];
}

// Q5 — text, straight computation (mixed ÷ mixed — the hardest tier: convert to
// improper fractions first, a skill Explore walks through but no Practice word
// problem actually drills fraction-by-fraction with both sides mixed).
function mixedComputeQuestion(): TestQuestion[] {
  const left = mixedAmount();
  const right = mixedAmount();
  const [an, bd] = amountToFraction(left);
  const [cn, dd] = amountToFraction(right);
  const [qn, qd] = quotientOf(an, bd, cn, dd);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        prompt: <>Compute: <AmountText value={left} /> ÷ <AmountText value={right} /></>,
        hint: "First rewrite each mixed number as an improper fraction, then multiply by the reciprocal of the second.",
        explain: <><Frac n={an} d={bd} /> × <Frac n={dd} d={cn} /> = <Quotient n={qn} d={qd} />.</>,
        answer: (an * dd) / (bd * cn),
      },
    },
  ];
}

// Q6 — text, word problem
function chocolateQuestion(): TestQuestion[] {
  const n = randInt(2, 6);
  const [an, bd] = properFraction();
  const [qn, qd] = simplify(an, bd * n);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        suffix: "lb",
        prompt: <>{n} people share <Frac n={an} d={bd} /> lb of chocolate equally. How much chocolate does each person get?</>,
        hint: <><Frac n={an} d={bd} /> ÷ {n}.</>,
        explain: <><Frac n={an} d={bd} /> ÷ {n} = <Quotient n={qn} d={qd} /> lb.</>,
        answer: an / (bd * n),
      },
    },
  ];
}

// Q7 — visual, recipe scaling with a mixed-number amount (matches recipeProblem
// — the 4th practice type, which allows whole/proper/mixed amounts via its own
// RandomAmount). The target ingredient's amount is forced to be a genuine mixed
// number, and regenerated until dividing it by the scale actually needs
// reducing — otherwise this wouldn't exercise "convert, then simplify."
function recipeVisualQuestion(): TestQuestion[] {
  const recipe = pick(TEST_RECIPES);
  const targetIndex = randInt(0, recipe.ingredients.length - 1);
  const target = recipe.ingredients[targetIndex];
  const scale = pick(TEST_RECIPE_SCALES);
  const n = scale.n;

  let mixed: TestAmount;
  let an: number, bd: number, qn: number, qd: number;
  do {
    mixed = mixedAmount();
    [an, bd] = amountToFraction(mixed);
    [qn, qd] = simplify(an, bd * n);
  } while (gcd(an, bd * n) === 1);

  const others = recipe.ingredients.map((_, i) => (i === targetIndex ? mixed : properAmount()));

  return [
    {
      visual: (
        <RecipeCard
          title={recipe.title}
          ingredients={recipe.ingredients.map((ing, i) => ({ ...ing, ...others[i], highlight: i === targetIndex }))}
        />
      ),
      difficulty: "medium",
      step: {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        suffix: target.unit,
        prompt: <>What quantity of <QA>{target.name}</QA> would you need to make a {scale.word} of this recipe?</>,
        hint: <>First rewrite <AmountText value={mixed} /> as an improper fraction, then multiply by <Frac n={1} d={n} />.</>,
        explain: <><Frac n={an} d={bd} /> ÷ {n} simplifies to <Quotient n={qn} d={qd} /> {target.unit}.</>,
        answer: an / (bd * n),
      },
    },
  ];
}

// Q8 — "prove it": fill in the multiplication fact that checks a division,
// using the standard's own relationship rather than multiple-choice (Q9/Q10
// already cover that format) — the student has to produce the quotient
// themselves, not just recognize it among options.
function proveItQuestion(): TestQuestion[] {
  const [an, bd] = properFraction();
  const [cn, dd] = properFraction();
  const [qn, qd] = quotientOf(an, bd, cn, dd);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "ratio",
        tones: "none",
        frame: [`${cn}/${dd} × `, "/", ` = ${an}/${bd}`],
        labels: ["numerator", "denominator"],
        prompt: <>Since <QA><Frac n={an} d={bd} /></QA> ÷ <QB><Frac n={cn} d={dd} /></QB> = <Quotient n={qn} d={qd} /> in simplest form, fill in the multiplication fact that proves it.</>,
        hint: "Division undoes multiplication: the divisor times the quotient should give back the dividend — so the missing fraction is the quotient itself.",
        explain: <><Frac n={cn} d={dd} /> × <Quotient n={qn} d={qd} /> = <Frac n={an} d={bd} />, because division and multiplication are inverse operations.</>,
        answer: [qn, qd],
        equivalentHint: "That's equivalent to the correct fraction, but not in simplest form — divide both numbers by their greatest common factor.",
      },
    },
  ];
}

// Q9 — choice, which expression models the story
function modelChoiceQuestion(): TestQuestion[] {
  const [cn, dd] = properFraction();
  const [an, bd] = properFraction();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: <>A ribbon is <Frac n={an} d={bd} /> yd long. It's cut into pieces that are each <Frac n={cn} d={dd} /> yd. Which expression finds how many pieces there are?</>,
          hint: "You're finding how many of the smaller length fit into the total length — that's division.",
          explain: "Finding how many equal-sized pieces fit into a total length is division.",
        },
        `${an}/${bd} ÷ ${cn}/${dd}`,
        [`${an}/${bd} × ${cn}/${dd}`, `${cn}/${dd} ÷ ${an}/${bd}`, `${an}/${bd} + ${cn}/${dd}`]
      ),
    },
  ];
}

// Q10 — choice, the multiplication-relationship check (the standard's own example pattern)
function relationshipChoiceQuestion(): TestQuestion[] {
  const [an, bd] = properFraction();
  const [cn, dd] = properFraction();
  const [qn, qd] = quotientOf(an, bd, cn, dd);
  const qText = qd === 1 ? String(qn) : `${qn}/${qd}`;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <><Frac n={an} d={bd} /> ÷ <Frac n={cn} d={dd} /> = <Quotient n={qn} d={qd} />. Which multiplication fact proves this?</>,
          hint: "Division undoes multiplication: the divisor times the quotient should give back the dividend.",
          explain: <><Frac n={cn} d={dd} /> × <Quotient n={qn} d={qd} /> = <Frac n={an} d={bd} />, because division and multiplication are inverse operations.</>,
        },
        `${cn}/${dd} × ${qText} = ${an}/${bd}`,
        [`${an}/${bd} × ${cn}/${dd} = ${qText}`, `${qText} ÷ ${an}/${bd} = ${cn}/${dd}`]
      ),
    },
  ];
}

export const fractionDivisionTest: Unit["test"] = {
  questions: [
    areaQuestion,
    sharingQuestion,
    widthQuestion,
    simpleComputeQuestion,
    mixedComputeQuestion,
    chocolateQuestion,
    recipeVisualQuestion,
    proveItQuestion,
    modelChoiceQuestion,
    relationshipChoiceQuestion,
  ],
  passScore: 8,
};
