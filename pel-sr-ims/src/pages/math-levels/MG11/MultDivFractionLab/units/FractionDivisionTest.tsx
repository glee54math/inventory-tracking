import { AreaRectangle, FractionBar, FractionMeasureStrip } from "../diagrams";
import { gcd, randInt, simplify } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import { Frac, QA, QB } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

/** Renders a quotient as a plain whole number when it reduces to one, otherwise as a stacked fraction. */
function Quotient({ n, d }: { n: number; d: number }) {
  return d === 1 ? <>{n}</> : <Frac n={n} d={d} />;
}

function properFraction(): [number, number] {
  const d = randInt(2, 9);
  const n = randInt(1, d - 1);
  const g = gcd(n, d);
  return [n / g, d / g];
}

const quotientOf = (an: number, bd: number, cn: number, dd: number) => simplify(an * dd, bd * cn);

// Q1 — visual, servings measurement
function servingsQuestion(): TestQuestion[] {
  const [cn, dd] = properFraction();
  const [an, bd] = properFraction();
  const [qn, qd] = quotientOf(an, bd, cn, dd);
  return [
    {
      visual: <FractionMeasureStrip dividend={[an, bd]} divisor={[cn, dd]} />,
      difficulty: "medium",
      step: {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        prompt: <>How many <QB><Frac n={cn} d={dd} /></QB>-cup servings fit in <QA><Frac n={an} d={bd} /></QA> cup?</>,
        hint: <>Multiply <Frac n={an} d={bd} /> by the reciprocal of <Frac n={cn} d={dd} />.</>,
        explain: <><Frac n={an} d={bd} /> ÷ <Frac n={cn} d={dd} /> = <Frac n={an} d={bd} /> × <Frac n={dd} d={cn} /> = <Quotient n={qn} d={qd} />.</>,
        answer: (an * dd) / (bd * cn),
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
      visual: <FractionBar numerator={an} denominator={bd} shareCount={bd % n === 0 ? n : undefined} highlightShare={bd % n === 0 ? 0 : undefined} label={`shared ${n} ways`} />,
      difficulty: "medium",
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
      visual: <AreaRectangle area={[an, bd]} length={[cn, dd]} unit="mi" />,
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

// Q4 — visual, cross-multiply setup
function crossMultiplyQuestion(): TestQuestion[] {
  const [an, bd] = properFraction();
  const [cn, dd] = properFraction();
  return [
    {
      visual: <FractionMeasureStrip dividend={[an, bd]} divisor={[cn, dd]} />,
      difficulty: "easy",
      step: {
        kind: "ratio",
        tones: "none",
        frame: ["", "/", ""],
        labels: ["numerator", "denominator"],
        prompt: <>Using (a/b)÷(c/d) = ad/bc, what's the numerator and denominator of <QA><Frac n={an} d={bd} /></QA> ÷ <QB><Frac n={cn} d={dd} /></QB>, before simplifying?</>,
        hint: "Multiply numerator × numerator, and denominator × denominator.",
        explain: <>{an} × {dd} = {an * dd}, and {bd} × {cn} = {bd * cn}.</>,
        answer: [an * dd, bd * cn],
      },
    },
  ];
}

// Q5 — text, straight computation
function computeQuestion1(): TestQuestion[] {
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
        prompt: <>Compute: <Frac n={an} d={bd} /> ÷ <Frac n={cn} d={dd} /></>,
        hint: "Multiply by the reciprocal of the second fraction.",
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
      difficulty: "medium",
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

// Q7 — text, straight computation
function computeQuestion2(): TestQuestion[] {
  const [an, bd] = properFraction();
  const [cn, dd] = properFraction();
  const [qn, qd] = quotientOf(an, bd, cn, dd);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        prompt: <>Compute: <Frac n={an} d={bd} /> ÷ <Frac n={cn} d={dd} /></>,
        hint: "Multiply by the reciprocal of the second fraction, then simplify.",
        explain: <><Frac n={an} d={bd} /> × <Frac n={dd} d={cn} /> = <Quotient n={qn} d={qd} />.</>,
        answer: (an * dd) / (bd * cn),
      },
    },
  ];
}

// Q8 — text, cross-multiply setup
function crossMultiplyQuestion2(): TestQuestion[] {
  const [an, bd] = properFraction();
  const [cn, dd] = properFraction();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "ratio",
        tones: "none",
        frame: ["", "/", ""],
        labels: ["numerator", "denominator"],
        prompt: <>Using (a/b)÷(c/d) = ad/bc, what's the numerator and denominator of <Frac n={an} d={bd} /> ÷ <Frac n={cn} d={dd} />, before simplifying?</>,
        hint: "Multiply numerator × numerator, and denominator × denominator.",
        explain: <>{an} × {dd} = {an * dd}, and {bd} × {cn} = {bd * cn}.</>,
        answer: [an * dd, bd * cn],
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
      difficulty: "hard",
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
    servingsQuestion,
    sharingQuestion,
    widthQuestion,
    crossMultiplyQuestion,
    computeQuestion1,
    chocolateQuestion,
    computeQuestion2,
    crossMultiplyQuestion2,
    modelChoiceQuestion,
    relationshipChoiceQuestion,
  ],
  passScore: 8,
};
