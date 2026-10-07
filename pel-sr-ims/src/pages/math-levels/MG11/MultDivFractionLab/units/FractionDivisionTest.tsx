import { FractionBar, FractionMeasureStrip, simplifyCaption } from "../diagrams";
import { gcd, randInt, simplify } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import { QA, QB } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

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
        prompt: <>How many <QB>{cn}/{dd}</QB>-cup servings fit in <QA>{an}/{bd}</QA> cup?</>,
        hint: `Multiply ${an}/${bd} by the reciprocal of ${cn}/${dd}.`,
        explain: `${an}/${bd} ÷ ${cn}/${dd} = ${an}/${bd} × ${dd}/${cn} = ${simplifyCaption(an * dd, bd * cn)}.`,
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
        prompt: <>{n} people share <QA>{an}/{bd}</QA> lb of trail mix equally. How much does each person get?</>,
        hint: `${an}/${bd} ÷ ${n} = ${an}/${bd} × 1/${n}.`,
        explain: `${an}/${bd} ÷ ${n} simplifies to ${simplifyCaption(an, bd * n)} lb.`,
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
      visual: <FractionMeasureStrip dividend={[an, bd]} divisor={[cn, dd]} />,
      difficulty: "hard",
      step: {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        suffix: "mi",
        prompt: <>A rectangular strip of land has area <QA>{an}/{bd}</QA> square miles and length <QB>{cn}/{dd}</QB> miles. How wide is it?</>,
        hint: "Width = area ÷ length.",
        explain: `${an}/${bd} ÷ ${cn}/${dd} = ${simplifyCaption(an * dd, bd * cn)} mi.`,
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
        prompt: <>Using (a/b)÷(c/d) = ad/bc, what's the numerator and denominator of <QA>{an}/{bd}</QA> ÷ <QB>{cn}/{dd}</QB>, before simplifying?</>,
        hint: "Multiply numerator × numerator, and denominator × denominator.",
        explain: `${an} × ${dd} = ${an * dd}, and ${bd} × ${cn} = ${bd * cn}.`,
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
        prompt: `Compute: ${an}/${bd} ÷ ${cn}/${dd}`,
        hint: "Multiply by the reciprocal of the second fraction.",
        explain: `${an}/${bd} × ${dd}/${cn} = ${simplifyCaption(an * dd, bd * cn)}.`,
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
        prompt: `${n} people share ${an}/${bd} lb of chocolate equally. How much chocolate does each person get?`,
        hint: `${an}/${bd} ÷ ${n}.`,
        explain: `${an}/${bd} ÷ ${n} = ${simplifyCaption(an, bd * n)} lb.`,
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
        prompt: `Compute: ${an}/${bd} ÷ ${cn}/${dd}`,
        hint: "Multiply by the reciprocal of the second fraction, then simplify.",
        explain: `${an}/${bd} × ${dd}/${cn} = ${simplifyCaption(an * dd, bd * cn)}.`,
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
        prompt: `Using (a/b)÷(c/d) = ad/bc, what's the numerator and denominator of ${an}/${bd} ÷ ${cn}/${dd}, before simplifying?`,
        hint: "Multiply numerator × numerator, and denominator × denominator.",
        explain: `${an} × ${dd} = ${an * dd}, and ${bd} × ${cn} = ${bd * cn}.`,
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
          prompt: `A ribbon is ${an}/${bd} yd long. It's cut into pieces that are each ${cn}/${dd} yd. Which expression finds how many pieces there are?`,
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
          prompt: `${an}/${bd} ÷ ${cn}/${dd} = ${qText}. Which multiplication fact proves this?`,
          hint: "Division undoes multiplication: the divisor times the quotient should give back the dividend.",
          explain: `${cn}/${dd} × ${qText} = ${an}/${bd}, because division and multiplication are inverse operations.`,
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
