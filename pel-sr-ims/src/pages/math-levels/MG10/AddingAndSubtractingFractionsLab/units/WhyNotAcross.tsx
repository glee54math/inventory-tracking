import { useState } from "react";
import { JoinedBar, RecutBars, SizeCheckBars } from "../diagrams";
import { pointing, type Problem } from "../../../shared/engine/types";
import { Frac, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { AnswerFormGuide } from "../../../shared/components/AnswerForm";
import { biggerSmaller, fitsIn, lcd, pieceOne, pieceWord, simplestText, triedAcross, twoPeople, U1_BUCKETS, u1Params, typedText, typedValue, shownText, type TwoFracs, type U1Bucket } from "../lib/fractions";
import { estimateStep, judgeStep, pickPictureStep, renameStep, sumStep, u1Facts } from "../lib/unit1";
import { BoxFrac, M } from "../lib/steps";
import { MathText } from "../../../shared/components/MathText";
import { whyNotAcrossTest } from "./WhyNotAcrossTest";

// ============================================================================
// Round 5 redesign (user, 2026-11-08): Unit 1 rests only on what students
// bring from grades 3-4 (equivalent fractions, adding like denominators,
// 4.NF.5's "one denominator fits in the other"). No common denominator is
// found here; that starts in Unit 2. See lib/unit1.tsx for the steps.
// ============================================================================

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 the add-across trap, in the same frame as Practice step 2 (round 6):
 * "2/5 is less than [1/2], but more than [1/3]. Adding should make a number
 * [bigger] ... So Ana's answer is [too small]." Then
 * typed: count the real sum in the sixths picture (round 5 review C5-14: the
 * "neither bottom fits" kind of problem gets a CFU item).
 * Q2 typed: one bottom fits in the other (thirds into ninths), then the sum.
 * Q3 vocabulary, with numerator and denominator both in play (what the
 * denominator means; which one must match). Q4 true/false generalization +
 * a typed sum past 1 (3/4 + 1/2 = 1 1/4), with the answer-format buttons.
 */
function WhyNotAcrossCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Ana says <Frac n={1} d={2} /> + <Frac n={1} d={3} /> = <Frac n={2} d={5} />. She added across. Is that the sum?
          </p>
          {/* Round 6 (U6-01): the same "fill in the reason" frame as Practice step 2, so it is taught before it is asked. */}
          <SizeCheckBars
            barWidth={240}
            rows={[
              { n: 1, d: 2, tone: "a" },
              { n: 1, d: 3, tone: "b" },
              { n: 2, d: 5, tone: "c" },
            ]}
            caption="Ana added across: 2/5."
          />
          <DropdownQuestion
            blanks={[
              { options: ["1/3", "1/2"], correct: "1/2", label: "2/5 is less than" },
              { options: ["1/3", "1/2"], correct: "1/3", label: "2/5 is more than" },
              { options: ["bigger", "smaller"], correct: "bigger", label: "Adding should make a number" },
              { options: ["too small", "right", "too big"], correct: "too small", label: "Ana's answer is" },
              { correct: "5", label: "The real sum in sixths", width: 56 },
            ]}
            render={([a, b, c, d, e]) => (
              <>
                Ana's answer, 2/5, is less than {a}, but more than {b}. Adding should make a number {c} than each fraction you add. So Ana's answer is {d}.
                <br />
                Now find the real sum. This picture cuts both bars into sixths:
                <RecutBars n1={1} d1={2} n2={1} d2={3} recut result originalLabels barWidth={240} />
                1/2 + 1/3 = <BoxFrac n={e} d={6} />
              </>
            )}
            good="Yes. 2/5 is more than 1/3, but less than 1/2. 1/2 + 1/3 must be more than 1/2, so adding across gave an answer that is too small. The real sum is 5/6."
            bad={(oks, values) =>
              !oks[0]
                ? `Look at the bars. Is 2/5 shorter or longer than ${values[0]}?`
                : !oks[1]
                  ? `Look at the bars. Is 2/5 shorter or longer than ${values[1]}?`
                  : !oks[2]
                    ? "Think of 1/2 + 1/3 as 1/2, and then 1/3 more. Is that bigger or smaller than 1/2?"
                    : !oks[3]
                      ? "Read your first sentence again. 2/5 is less than 1/2. Should 1/2 + 1/3 be more or less than 1/2?"
                      : "Not yet. Count the shaded sixths in the bar with both colors."
            }
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Find <Frac n={1} d={3} /> + <Frac n={1} d={9} />. 3 fits in 9: 3 × 3 = 9. So the picture cuts each third into ninths.
          </p>
          <RecutBars n1={1} d1={3} n2={1} d2={9} recut originalLabels />
          <DropdownQuestion
            blanks={[
              { correct: "3", label: "1/3 in ninths", width: 56 },
              { correct: "4", label: "Sum in ninths", width: 56 },
            ]}
            render={([a, b]) => (
              <>
                1/3 = <BoxFrac n={a} d={9} />. So 1/3 + 1/9 = <BoxFrac n={b} d={9} />.
              </>
            )}
            good="Right! Now the pieces are the same size: 3 ninths + 1 ninth = 4 ninths. The answer is 4/9, not 2/12."
            bad={(oks) => (!oks[0] ? "Not quite. Count the small pieces in the shaded part of the bar with thick lines." : "Close. Now both are ninths. Add the tops: 3 + 1.")}
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Think about what each part of a fraction tells you.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["how many equal pieces make 1 whole", "how many pieces are shaded"], correct: "how many equal pieces make 1 whole", label: "What the denominator tells" },
              { options: ["denominators", "numerators"], correct: "denominators", label: "What must match" },
            ]}
            render={([a, b]) => (
              <>
                In 1/3, the denominator 3 tells {a}. You can add the tops only when the {b} are the same.
              </>
            )}
            good="Correct. The denominator names the size of the pieces. Same denominator means same-size pieces, and then you just count them."
            bad="Not quite. The bottom number names the size of each piece. You can only count pieces together when they are the same size."
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Adding across means adding the tops and adding the bottoms.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "Adding across always works" },
              { correct: "1 1/4", label: "The real sum", mixedFraction: true },
            ]}
            render={([a, b]) => (
              <>
                True or false: adding across always works. {a}
                <br />
                Find the real sum: 3/4 + 1/2 = {b}
              </>
            )}
            good="Yes. Adding across never works: it gives 4/6, which is less than 1. But 3/4 and 1/2 are each at least 1/2, so the sum is more than 1. 1/2 = 2/4, and 3/4 + 2/4 = 5/4 = 1 1/4."
            bad={(oks, values) => {
              if (!oks[0]) return "Look again at question 1. Adding across gave 2/5, which is too small. So it does not always work.";
              // Round 5 review C5-08 / E5-07: name the add-across answer (4/6, or 2/3), never call it "Close."
              const v = typedValue(values[1].split("|"));
              const t = typedText(values[1].split("|"));
              if (v && t && v[0] * 6 === 4 * v[1]) return `You added across. ${t} is less than 3/4, but adding should make a bigger number. 1/2 = 2/4, so add fourths.`;
              return "Not yet. 2 fits in 4, so write 1/2 in fourths first: 1/2 = 2/4. Then add the fourths. 4 fourths make 1 whole.";
            }}
            onDone={mark(3)}
          />
        </div>
      </div>
    </MathText>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [view, setView] = useState<"across" | "same">("across");
  const [d1, setD1] = useState(2);
  const [n1raw, setN1] = useState(1);
  const [d2, setD2] = useState(3);
  const [n2raw, setN2] = useState(1);
  const n1 = Math.min(n1raw, d1);
  const n2 = Math.min(n2raw, d2);
  const L = lcd(d1, d2);
  const a = (n1 * L) / d1;
  const b = (n2 * L) / d2;
  const mn = n1 + n2;
  const md = d1 + d2;
  const p: TwoFracs = { n1, d1, n2, d2 };
  const { big } = biggerSmaller(p);
  const mediantVsBig = mn * big[1] < big[0] * md ? "less than" : mn * big[1] === big[0] * md ? "the same as" : "more than";
  const sum = n1 / d1 + n2 / d2;
  const vsOne = Math.abs(sum - 1) < 1e-9 ? "exactly" : sum > 1 ? "more than" : "less than";
  const fits = fitsIn(d1, d2);
  const [dS, dB] = d1 <= d2 ? [d1, d2] : [d2, d1];
  const [nS] = d1 <= d2 ? [n1] : [n2];
  const k = dB / dS;
  const sumLine = (
    <>
      Now count: {a}/{L} + {b}/{L} = {a + b}/{L}
      {simplestText(a + b, L) !== `${a + b}/${L}` ? <> = {simplestText(a + b, L)}</> : null}.
    </>
  );

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          The top number is the <b>numerator</b>. The bottom number is the <b>denominator</b>. Every bar is 1 whole, and every bar is the same size. Pick two fractions and
          try both ways to add them.
        </p>
        <div className="control-row">
          <Stepper label="1st numerator" value={n1} min={1} max={d1} onChange={setN1} tone="a" />
          <Stepper label="1st denominator" value={d1} min={2} max={12} onChange={setD1} tone="a" />
          <Stepper label="2nd numerator" value={n2} min={1} max={d2} onChange={setN2} tone="b" />
          <Stepper label="2nd denominator" value={d2} min={2} max={12} onChange={setD2} tone="b" />
        </div>
        <Segmented
          label="How to add"
          value={view}
          onChange={setView}
          options={[
            { id: "across", label: "Add across" },
            { id: "same", label: "Same-size pieces" },
          ]}
        />
        {view === "across" ? (
          <>
            <SizeCheckBars
              barWidth={240}
              rows={[
                { n: n1, d: d1, tone: "a" },
                { n: n2, d: d2, tone: "b" },
                { n: mn, d: md, tone: "c" },
              ]}
            />
            <p className="says">
              Adding across: {n1} + {n2} = {mn} on top, {d1} + {d2} = {md} on the bottom. That gives {mn}/{md}.
            </p>
            <p className="muted small">
              {mn}/{md} is {mediantVsBig} {big[0]}/{big[1]}. Adding more should always make a bigger number. So adding across is wrong.
            </p>
            <p>
              <b>Estimate the real sum.</b> Put the two shaded parts end to end:
            </p>
            <JoinedBar n1={n1} d1={d1} n2={n2} d2={d2} barWidth={240} />
            <p className="muted small">
              That is the real sum. It is more than {big[0]}/{big[1]}, and it is {vsOne} 1.
            </p>
          </>
        ) : (
          <>
            {/* Round 5 review C5-10 / E5-05: "fits in" is defined once, here, before it is used. */}
            <p className="muted small">
              One bottom <b>fits in</b> another when a whole number times it makes the other. 2 fits in 6, because 2 × 3 = 6.
            </p>
            {L <= 48 && <RecutBars n1={n1} d1={d1} n2={n2} d2={d2} recut result barWidth={240} />}
            <p className="says">
              {d1 === d2 ? (
                <>The pieces are already the same size, so just count them. {sumLine}</>
              ) : fits ? (
                <>
                  {dS} fits in {dB}: {dS} × {k} = {dB}. So each {pieceOne(dS)} is {k} {pieceWord(dB)}, and {nS}/{dS} = {nS * k}/{dB}. {sumLine}
                </>
              ) : L <= 48 ? (
                <>
                  {dS} doesn't fit in {dB}: no whole number times {dS} makes {dB}. And {dB} is bigger, so it can't fit in {dS}. The picture still cuts both bars into the
                  same-size pieces, so you can count them. In Unit 2, you will learn how to find these pieces.
                </>
              ) : (
                // E5-11: no picture above 48 pieces, so the text doesn't describe one.
                <>
                  {dS} doesn't fit in {dB}: no whole number times {dS} makes {dB}. Same-size pieces would need {L} pieces in each bar. That's too many to draw. In Unit 2, you
                  will learn how to find these pieces.
                </>
              )}
            </p>
            {L <= 48 && <p className="muted small">The thick lines show where the old pieces were. The amount did not change. Only the size of the pieces did.</p>}
          </>
        )}
        <AnswerFormGuide />
        {(introActive || showCheck) && <WhyNotAcrossCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

/**
 * "Find a + b" (round 5): 1. estimate, 2. say why a named person's add-across
 * answer is too small (round 6: a sentence frame built from this problem's
 * own fractions, see judgeStep), 3-4. find the real sum. One bottom fits in the other: rename one
 * fraction (the picture shows the cut), then type the sum; or, half the time,
 * type the sum straight out as the Test asks it (round 5 review C5-03).
 * Neither bottom fits in the other: pick the picture of the sum, then count
 * it and type it. Every typed sum uses the answer-format buttons.
 */
function makeProblem(bucket: U1Bucket): Problem {
  const p = u1Params(bucket);
  const { n1, d1, n2, d2 } = p;
  const fits = bucket === "fitsUnder1" || bucket === "fitsOneOrMore";
  const { L, mn, md, big, sumText } = u1Facts(p);
  const { bigFirst } = biggerSmaller(p);
  const [person] = twoPeople();
  // Round 5 review C5-03: half of the "fits" problems skip the rename step and
  // ask the sum straight out, the way the Test does, so Practice also asks it with no help.
  const rename = fits && Math.random() < 0.5;
  const steps = fits
    ? rename
      ? [estimateStep(p), judgeStep(p, person), renameStep(p), sumStep(p, "afterRename")]
      : [estimateStep(p), judgeStep(p, person), sumStep(p, "plain")]
    : [estimateStep(p), judgeStep(p, person), pickPictureStep(p, L >= 12 ? 240 : 180), sumStep(p, "counted")];
  const sumAt = steps.length - 1;
  // C5-12: 12 or more pieces in a whole get wider bars, so thin pieces stay countable.
  const W = L >= 12 ? 240 : 180;
  return {
    title: "Find the sum",
    bucket,
    story: (
      <>
        Find <Frac n={n1} d={d1} /> + <Frac n={n2} d={d2} />.
      </>
    ),
    visual: (done, help) => {
      // Fits: the cut shows on the rename step (or, with no rename step, after a
      // wrong sum). Neither fits: only once the right picture is picked.
      const recut = fits ? (rename ? done >= 2 : done > sumAt || pointing(help, sumAt)) : done >= 3;
      const result = fits ? done > sumAt || pointing(help, sumAt) : done >= 3;
      // Stuck on the estimate or on "which picture?": the two parts end to end, in their own pieces.
      const joined = (done === 0 && pointing(help, 0)) || (!fits && done === 2 && pointing(help, 2));
      // The add-across answer beside the two fractions: the hint on step 2, and
      // after a wrong picture pick (round 5 review C5-02, C5-04: not before, so
      // it can't be matched to a picture, and not on the rename step).
      const across = (done === 1 && pointing(help, 1)) || (!fits && done === 2 && pointing(help, 2));
      // A typed sum that was the add-across answer: show it beside the bigger fraction.
      const tried = help && help.step === sumAt && triedAcross(help.lastTry, "add", n1, d1, n2, d2) ? typedValue(help.lastTry) : null;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* The size check repeats both fractions, so the plain bars step aside for it. Cut bars keep their
              own fraction's label (2/3, not 4/6) until the problem is solved (C5-04, E5-03, E5-04). */}
          {!across && <RecutBars n1={n1} d1={d1} n2={n2} d2={d2} recut={recut} result={result} originalLabels={done < steps.length} barWidth={W} />}
          {joined && (
            <div>
              <p className="muted small" style={{ margin: "0 0 4px" }}>
                The two shaded parts, end to end:
              </p>
              <JoinedBar n1={n1} d1={d1} n2={n2} d2={d2} barWidth={W} />
            </div>
          )}
          {across && (
            <SizeCheckBars
              barWidth={W}
              rows={[
                { n: n1, d: d1, tone: "a" },
                { n: n2, d: d2, tone: "b" },
                { n: mn, d: md, tone: "c" },
              ]}
              caption={`${person.name} added across: ${mn}/${md}.`}
            />
          )}
          {tried && (
            <SizeCheckBars
              barWidth={W}
              rows={[
                { n: big[0], d: big[1], tone: bigFirst ? "a" : "b" },
                { n: tried[0], d: tried[1], tone: "c", label: <MathText>{typedText(help?.lastTry) ?? shownText(tried[0], tried[1])}</MathText> },
              ]}
              caption={`Your answer is shorter than ${big[0]}/${big[1]}.`}
            />
          )}
        </div>
      );
    },
    steps,
    wrapUp: (
      <>
        <Frac n={n1} d={d1} /> + <Frac n={n2} d={d2} /> = {sumText}, not {mn}/{md}.
        {!fits && <> The picture cut both bars into {pieceWord(L)}.</>}
      </>
    ),
  };
}

function Preview() {
  return <RecutBars n1={1} d1={2} n2={1} d2={3} recut result barWidth={130} />;
}

export const whyNotAcross: Unit = {
  id: "whyNotAcross",
  title: "Why You Can't Just Add Across",
  goal: "See why 1/2 + 1/3 is not 2/5. Pieces must be the same size before you add them.",
  standard: "5.NF.1",
  keyIdea: (
    <>
      <p>
        You can only add pieces that are the same size. Adding across never works: <Frac n={1} d={2} /> + <Frac n={1} d={3} /> is not <Frac n={2} d={5} />.{" "}
        <Frac n={2} d={5} /> is less than <Frac n={1} d={2} /> alone!
      </p>
      <p>
        When one bottom fits in the other, cut the bigger pieces to match the smaller ones: <Frac n={3} d={4} /> + <Frac n={1} d={2} /> = <Frac n={3} d={4} /> +{" "}
        <Frac n={2} d={4} /> = <Frac n={5} d={4} /> = <M w={1} n={1} d={4} />. Always write the answer in simplest form.
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U1_BUCKETS,
  problems: [
    { label: "One bottom fits in the other", make: (b) => makeProblem((b as U1Bucket) ?? "fitsUnder1"), buckets: ["fitsUnder1", "fitsOneOrMore"] },
    { label: "Neither bottom fits in the other", make: (b) => makeProblem((b as U1Bucket) ?? "noShareUnder1"), buckets: ["noShareUnder1", "noShareOver1"] },
  ],
  test: whyNotAcrossTest,
};
