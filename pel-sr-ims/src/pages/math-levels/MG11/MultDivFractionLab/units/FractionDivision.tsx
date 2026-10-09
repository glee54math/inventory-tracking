import { useState } from "react";
import { AreaRectangle, FractionBar, FractionMeasureStrip } from "../diagrams";
import { gcd, randInt, simplify } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Frac, QA, QB, Says, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { fractionDivisionTest } from "./FractionDivisionTest";

/** A random proper fraction with denominator in [2,9], already in lowest terms. */
function properFraction(): [number, number] {
  const d = randInt(2, 9);
  const n = randInt(1, d - 1);
  const g = gcd(n, d);
  return [n / g, d / g];
}

/** Renders a quotient as a plain whole number when it reduces to one, otherwise as a stacked fraction. */
function Quotient({ n, d }: { n: number; d: number }) {
  return d === 1 ? <>{n}</> : <Frac n={n} d={d} />;
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [an, setAn] = useState(2);
  const [bd, setBd] = useState(3);
  const [cn, setCn] = useState(3);
  const [dd, setDd] = useState(4);

  const [qn, qd] = simplify(an * dd, bd * cn);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="controls">
        <Stepper label="Dividend numerator" value={an} min={1} max={bd - 1} onChange={setAn} tone="a" />
        <Stepper label="Dividend denominator" value={bd} min={2} max={9} onChange={(v: number) => { setBd(v); if (an >= v) setAn(v - 1); }} tone="a" />
        <Stepper label="Divisor numerator" value={cn} min={1} max={dd - 1} onChange={setCn} tone="b" />
        <Stepper label="Divisor denominator" value={dd} min={2} max={9} onChange={(v: number) => { setDd(v); if (cn >= v) setCn(v - 1); }} tone="b" />
      </div>
      <FractionMeasureStrip dividend={[an, bd]} divisor={[cn, dd]} />
      <Says>
        <QA><Frac n={an} d={bd} /></QA> ÷ <QB><Frac n={cn} d={dd} /></QB> = <QA><Frac n={an} d={bd} /></QA> × <Frac n={dd} d={cn} /> = <Quotient n={qn} d={qd} />
      </Says>
      <Says>
        Check it: <QB><Frac n={cn} d={dd} /></QB> of <Quotient n={qn} d={qd} /> is <QA><Frac n={an} d={bd} /></QA>.
      </Says>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — measurement / quotitive word problems
// ============================================================================

function measurementProblem(): Problem {
  const [cn, dd] = properFraction(); // the "serving"/"length" size
  const [an, bd] = properFraction(); // the total amount
  const improperN = an * dd;
  const improperD = bd * cn;
  const [qn, qd] = simplify(improperN, improperD);
  const quotientVal = improperN / improperD;
  const alreadyLowest = gcd(improperN, improperD) === 1;

  const useServings = Math.random() < 0.5;
  const story = useServings ? (
    <>
      A recipe uses <QB><Frac n={cn} d={dd} /></QB>-cup servings. How many servings can you measure out of <QA><Frac n={an} d={bd} /></QA> cup of yogurt?
    </>
  ) : (
    <>
      A rectangular strip of land has an area of <QA><Frac n={an} d={bd} /></QA> square miles and a length of <QB><Frac n={cn} d={dd} /></QB> miles. How wide is the strip?
    </>
  );

  return {
    title: useServings ? "Measuring out servings" : "Width of a strip of land",
    story,
    visual: () => (useServings ? <FractionMeasureStrip dividend={[an, bd]} divisor={[cn, dd]} /> : <AreaRectangle area={[an, bd]} length={[cn, dd]} unit="mi" />),
    steps: [
      choice(
        {
          prompt: "Which expression finds the answer?",
          hint: useServings
            ? "You're asking \"how many of the smaller amount fit into the larger one?\" — that's division."
            : "Area = length × width, so width = area ÷ length.",
          explain: useServings
            ? "Finding how many groups of one size fit into a total is division."
            : "Since area = length × width, solving for width means dividing the area by the length: width = area ÷ length.",
        },
        `${an}/${bd} ÷ ${cn}/${dd}`,
        [`${an}/${bd} × ${cn}/${dd}`, `${cn}/${dd} ÷ ${an}/${bd}`]
      ),
      {
        kind: "ratio",
        tones: "none",
        frame: ["", "/", ""],
        labels: ["numerator", "denominator"],
        prompt: <>To divide, multiply by the reciprocal: <QA><Frac n={an} d={bd} /></QA> × <Frac n={dd} d={cn} />. What's the new numerator and denominator, before simplifying?</>,
        hint: "Multiply numerator × numerator, and denominator × denominator.",
        explain: <>{an} × {dd} = {an * dd}, and {bd} × {cn} = {bd * cn}.</>,
        answer: [an * dd, bd * cn],
      },
      {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        prompt: alreadyLowest ? (
          <>Write <Frac n={improperN} d={improperD} /> as the answer.</>
        ) : (
          <>Simplify <Frac n={improperN} d={improperD} /> to lowest terms.</>
        ),
        hint: alreadyLowest
          ? `${improperN} and ${improperD} don't share a common factor, so ${improperN}/${improperD} is already in lowest terms.`
          : `Both ${improperN} and ${improperD} share a common factor — divide both by it.`,
        explain: alreadyLowest ? (
          <><Frac n={improperN} d={improperD} /> is already in lowest terms — there's no common factor to divide out.</>
        ) : (
          <><Frac n={improperN} d={improperD} /> simplifies to <Quotient n={qn} d={qd} />.</>
        ),
        answer: quotientVal,
      },
      choice(
        { prompt: "What does this answer mean?", hint: "Reread the question — what were you asked to find?", explain: "The quotient answers exactly what the question asked." },
        useServings ? "The number of full servings you can measure out" : "The width of the strip, in miles",
        useServings ? ["The total cups of yogurt", "The size of one serving"] : ["The area, in square miles", "The length, in miles"]
      ),
    ],
    wrapUp: useServings ? (
      <>You can measure out <Quotient n={qn} d={qd} /> full servings.</>
    ) : (
      <>The strip is <Quotient n={qn} d={qd} /> miles wide.</>
    ),
  };
}

// ============================================================================
// PROBLEM TYPE 2 — partitive / sharing word problems
// ============================================================================

function sharingProblem(): Problem {
  const n = randInt(2, 6);
  const [an, bd] = properFraction();
  const [qn, qd] = simplify(an, bd * n);
  const quotientVal = an / (bd * n);

  return {
    title: "Sharing equally",
    story: (
      <>
        {n} people share <QA><Frac n={an} d={bd} /></QA> lb of chocolate equally. How much chocolate does each person get?
      </>
    ),
    visual: () => <FractionBar numerator={an} denominator={bd} shareCount={bd % n === 0 ? n : undefined} highlightShare={bd % n === 0 ? 0 : undefined} label={`${an}/${bd} lb shared ${n} ways`} />,
    steps: [
      choice(
        { prompt: "Which expression finds one share?", hint: "Sharing a total equally among a number of people is division.", explain: `Dividing the whole amount by the number of people gives one share.` },
        `${an}/${bd} ÷ ${n}`,
        [`${an}/${bd} × ${n}`, `${n} ÷ ${an}/${bd}`]
      ),
      {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        prefix: "",
        suffix: "lb",
        prompt: <>Write {n} as a fraction (<Frac n={1} d={n} />) and multiply: <QA><Frac n={an} d={bd} /></QA> × <Frac n={1} d={n} />. What's each share, in simplest form?</>,
        hint: `Multiply the numerators (${an} × 1) and the denominators (${bd} × ${n}), then simplify.`,
        explain: <><Frac n={an} d={bd * n} /> simplifies to <Quotient n={qn} d={qd} />.</>,
        answer: quotientVal,
      },
      choice(
        { prompt: "Does this answer make sense?", hint: "Compare the share to the whole amount — one share should be smaller than the total.", explain: "Each share is smaller than the whole amount, since it was split among more than one person." },
        "Yes — one share is smaller than the whole amount of chocolate",
        ["No — one share should be bigger than the whole amount", "No — the answer should be a whole number"]
      ),
    ],
    wrapUp: <>Each person gets <Quotient n={qn} d={qd} /> lb of chocolate.</>,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — the multiplication-relationship check
// ============================================================================

function relationshipProblem(): Problem {
  const [an, bd] = properFraction();
  const [cn, dd] = properFraction();
  const [qn, qd] = simplify(an * dd, bd * cn);
  const quotientVal = (an * dd) / (bd * cn);

  return {
    title: "Multiplication checks division",
    story: (
      <>
        Explain why <QA><Frac n={an} d={bd} /></QA> ÷ <QB><Frac n={cn} d={dd} /></QB> equals a certain fraction, using the fact that <QB><Frac n={cn} d={dd} /></QB> of that fraction gives back <QA><Frac n={an} d={bd} /></QA>.
      </>
    ),
    visual: () => <FractionMeasureStrip dividend={[an, bd]} divisor={[cn, dd]} />,
    steps: [
      {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        prompt: <>First, what is <QA><Frac n={an} d={bd} /></QA> ÷ <QB><Frac n={cn} d={dd} /></QB>? (Multiply by the reciprocal, then simplify.)</>,
        hint: `(a/b) ÷ (c/d) = ad/bc = (${an}×${dd})/(${bd}×${cn}).`,
        explain: <><Frac n={an} d={bd} /> × <Frac n={dd} d={cn} /> = <Frac n={an * dd} d={bd * cn} /> = <Quotient n={qn} d={qd} />.</>,
        answer: quotientVal,
      },
      choice(
        {
          prompt: <>Which multiplication fact PROVES that <QA><Frac n={an} d={bd} /></QA> ÷ <QB><Frac n={cn} d={dd} /></QB> = <Quotient n={qn} d={qd} />?</>,
          hint: "Division undoes multiplication: the divisor times the quotient should give back the dividend.",
          explain: <>Since division and multiplication are inverses, <QB><Frac n={cn} d={dd} /></QB> × <Quotient n={qn} d={qd} /> must equal <QA><Frac n={an} d={bd} /></QA> — and it does.</>,
        },
        `${cn}/${dd} × ${qd === 1 ? qn : `${qn}/${qd}`} = ${an}/${bd}`,
        [`${an}/${bd} × ${cn}/${dd} = ${qd === 1 ? qn : `${qn}/${qd}`}`, `${qd === 1 ? qn : `${qn}/${qd}`} ÷ ${an}/${bd} = ${cn}/${dd}`]
      ),
    ],
    wrapUp: (
      <>
        <QA><Frac n={an} d={bd} /></QA> ÷ <QB><Frac n={cn} d={dd} /></QB> = <Quotient n={qn} d={qd} />, because <QB><Frac n={cn} d={dd} /></QB> of <Quotient n={qn} d={qd} /> is <QA><Frac n={an} d={bd} /></QA>.
      </>
    ),
  };
}

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <FractionBar numerator={2} denominator={5} label="2/5" width={220} height={48} />;
}

export const fractionDivision: Unit = {
  id: "fractionDivision",
  title: "Dividing Fractions",
  goal: "Divide a fraction by a fraction using a visual model or the multiply-by-the-reciprocal rule, and solve real sharing and measuring word problems.",
  standard: "6.NS.1",
  keyIdea: (
    <>
      <p>
        To divide fractions, multiply by the reciprocal: (a/b) ÷ (c/d) = (a×d)/(b×c). For example, <Frac n={2} d={3} /> ÷ <Frac n={3} d={4} /> = <Frac n={2} d={3} /> × <Frac n={4} d={3} /> = <Frac n={8} d={9} /> — and you can check it, because <Frac n={3} d={4} /> of <Frac n={8} d={9} /> is <Frac n={2} d={3} />.
      </p>
      <p>Division can mean "how many groups fit?" (measuring) or "what does one share get?" (sharing equally).</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [
    { label: "Measuring", make: measurementProblem },
    { label: "Sharing", make: sharingProblem },
    { label: "Prove it", make: relationshipProblem },
  ],
  test: fractionDivisionTest,
};

export { properFraction };
