import { useState } from "react";
import { AreaRectangle, FractionBar, FractionMeasureStrip } from "../diagrams";
import { gcd, randInt, simplify } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Frac, QA, QB, Says } from "../../../shared/engine/controls";
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

/** A compact −/value/+ control, sized for sitting right inside a fraction instead of a full-width row. */
function MiniStepper({ value, min, max, onChange, ariaLabel }: { value: number; min: number; max: number; onChange: (v: number) => void; ariaLabel: string }) {
  return (
    <span className="mini-stepper">
      <button type="button" aria-label={`decrease ${ariaLabel}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
        −
      </button>
      <output>{value}</output>
      <button type="button" aria-label={`increase ${ariaLabel}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
        +
      </button>
    </span>
  );
}

/** Numerator/denominator MiniSteppers stacked into a live, editable fraction. */
function FracStepperGroup({
  n,
  d,
  onN,
  onD,
  nMax,
  dMax,
  tone,
  label,
}: {
  n: number;
  d: number;
  onN: (v: number) => void;
  onD: (v: number) => void;
  nMax: number;
  dMax: number;
  tone: "a" | "b";
  label: string;
}) {
  return (
    <span className={`frac-stepper tone-${tone}`}>
      <MiniStepper value={n} min={1} max={nMax} onChange={onN} ariaLabel={`${label} numerator`} />
      <span className="frac-stepper-bar" />
      <MiniStepper value={d} min={2} max={dMax} onChange={onD} ariaLabel={`${label} denominator`} />
    </span>
  );
}

/**
 * A two-sided "becomes" animation: `front` is shown, then flips (3D card
 * rotate) to reveal `back`. `flipDelayMs` is when the flip itself starts;
 * the slot's own appearance (showing `front` at rest first) is driven by the
 * surrounding .kcf2-reveal wrapper, so there's a beat to register the "before"
 * state before it changes — see KeepChangeFlipInline for the full timeline.
 *
 * Once the flip finishes, this swaps to rendering `back` as a plain node with
 * no transform/perspective wrapper at all — a lingering 3D transform context
 * (even one that nets out to "no rotation") can leave a browser compositing a
 * flipped element on its own layer, which is enough to shift its text a
 * pixel or two off the plain, non-transformed content next to it. Settling
 * removes that layer so the final result lines up exactly like plain text.
 */
function FlipSwap({ front, back, flipDelayMs }: { front: React.ReactNode; back: React.ReactNode; flipDelayMs: number }) {
  const [settled, setSettled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  if (settled) return <>{back}</>;
  return (
    <span className="flip-swap">
      <span className="flip-inner" style={{ animationDelay: `${flipDelayMs}ms` }} onAnimationEnd={() => setSettled(true)}>
        <span className="flip-face flip-front">{front}</span>
        <span className="flip-face flip-back">{back}</span>
      </span>
    </span>
  );
}

/** Timeline (ms from the button press) for KeepChangeFlipInline's staged reveal. */
const KCF_TIMING = {
  keep: 0,
  changeAppear: 700,
  changeFlip: 1300,
  flipAppear: 2100,
  flipFlip: 2700,
};

/**
 * The "Keep, Change, Flip" mnemonic, played out as an extension of the big
 * equation itself — "= 2/3 × 4/3" builds on in stages, with ÷ visibly
 * flipping into × and 3/4 visibly flipping into 4/3 — instead of restating
 * the rule in a separate diagram. Mount this (via a `key` that changes on
 * each button press) to replay the sequence from the start.
 *
 * Laid out as a 2-row grid (all four .kcf2-content cells, then all four
 * .kcf2-caption cells) instead of four independent columns, so the captions
 * share one literal grid row — guaranteed level with each other and with the
 * bottom of the block, rather than each hanging off its own content box.
 */
function KeepChangeFlipInline({ an, bd, cn, dd }: { an: number; bd: number; cn: number; dd: number }) {
  return (
    <span className="kcf2">
      <span className="kcf2-content kcf2-reveal" style={{ animationDelay: `${KCF_TIMING.keep}ms` }}>
        <span className="explore-op">=</span>
      </span>
      <span className="kcf2-content kcf2-reveal" style={{ animationDelay: `${KCF_TIMING.keep}ms` }}>
        <span className="qa-text"><Frac n={an} d={bd} /></span>
      </span>
      <span className="kcf2-content kcf2-reveal" style={{ animationDelay: `${KCF_TIMING.changeAppear}ms` }}>
        <FlipSwap
          flipDelayMs={KCF_TIMING.changeFlip}
          front={<span className="kcf2-op">÷</span>}
          back={<span className="kcf2-op kcf2-op-new">×</span>}
        />
      </span>
      <span className="kcf2-content kcf2-reveal" style={{ animationDelay: `${KCF_TIMING.flipAppear}ms` }}>
        <FlipSwap
          flipDelayMs={KCF_TIMING.flipFlip}
          front={<span className="qb-text"><Frac n={cn} d={dd} /></span>}
          back={<span className="kcf2-flipped"><Frac n={dd} d={cn} /></span>}
        />
      </span>

      <span className="kcf2-caption" />
      <span className="kcf2-caption kcf2-reveal" style={{ animationDelay: `${KCF_TIMING.keep}ms` }}>
        <span className="kcf-label kcf-keep">Keep</span>
      </span>
      <span className="kcf2-caption kcf2-reveal" style={{ animationDelay: `${KCF_TIMING.changeAppear}ms` }}>
        <span className="kcf-label kcf-change">Change</span>
      </span>
      <span className="kcf2-caption kcf2-reveal" style={{ animationDelay: `${KCF_TIMING.flipAppear}ms` }}>
        <span className="kcf-label kcf-flip">Flip</span>
      </span>
    </span>
  );
}

function Explore() {
  const [an, setAn] = useState(2);
  const [bd, setBd] = useState(3);
  const [cn, setCn] = useState(3);
  const [dd, setDd] = useState(4);
  const [playKey, setPlayKey] = useState(0);

  const [qn, qd] = simplify(an * dd, bd * cn);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="explore-equation">
        <FracStepperGroup
          n={an}
          d={bd}
          onN={setAn}
          onD={(v) => { setBd(v); if (an >= v) setAn(v - 1); }}
          nMax={bd - 1}
          dMax={9}
          tone="a"
          label="dividend"
        />
        <span className="explore-op">÷</span>
        <FracStepperGroup
          n={cn}
          d={dd}
          onN={setCn}
          onD={(v) => { setDd(v); if (cn >= v) setCn(v - 1); }}
          nMax={dd - 1}
          dMax={9}
          tone="b"
          label="divisor"
        />
        {playKey > 0 && <KeepChangeFlipInline key={playKey} an={an} bd={bd} cn={cn} dd={dd} />}
      </div>

      <button type="button" className="btn ghost" style={{ alignSelf: "center" }} onClick={() => setPlayKey((k) => k + 1)}>
        {playKey > 0 ? "↻ Replay: Keep, Change, Flip" : "▶ Show: Keep, Change, Flip"}
      </button>

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
        To divide fractions, multiply by the reciprocal: (a/b) ÷ (c/d) = (a×d)/(b×c). For example,{" "}
        <span style={{ whiteSpace: "nowrap" }}>
          <Frac n={2} d={3} /> ÷ <Frac n={3} d={4} /> = <Frac n={2} d={3} /> × <Frac n={4} d={3} /> = <Frac n={8} d={9} />
        </span>{" "}
        — and you can check it, because{" "}
        <span style={{ whiteSpace: "nowrap" }}>
          <Frac n={3} d={4} /> of <Frac n={8} d={9} /> is <Frac n={2} d={3} />
        </span>
        .
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
