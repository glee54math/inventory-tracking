import { useState } from "react";
import { pointing, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { MathText } from "../../../shared/components/MathText";
import { lookHereSpot } from "../../../shared/lib/lookHere";
import { pick } from "../../../shared/lib/math";
import { PlaceChart, ZoomLine } from "../diagrams";
import { decText, digitsOf, nearestText, PLACE_NAMES, roundAt, roundCase, ROUND_BUCKETS, showDec, twoPlacesCase, type Dec, type Places, type RoundBucket } from "../lib/decimals";
import { betweenStep, nextDigitStep, roundStep } from "../lib/steps";
import { roundingTest } from "./RoundingDecimalsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const exactly = (...want: string[]) => (raw: string) => want.includes(raw.trim());
const sameValue = (want: number) => (raw: string) => raw.trim() !== "" && /^\d*\.?\d*$/.test(raw.trim()) && Math.abs(Number(raw) - want) < 1e-9;

/**
 * Q1 typed: the two tenths 3.462 is between, then the rounded number (rounds up).
 * Q2 typed: the carry through 9s (2.996 -> 3.00), the plan's named failure point.
 * Q3 pick + typed: only the NEXT digit decides (5.749 -> 5.7, not 5.8).
 * Q4 true/false generalization: rounding doesn't always change a number (3.40 -> 3.4); halfway rounds up.
 */
function RoundingCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Round 3.462 to the nearest tenth. Write a digit in every place through the tenths place, even a 0.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "3.4", label: "The smaller tenth", width: 70, accept: sameValue(3.4), part: "Between", exploreTarget: { target: "u2-between", label: "How to round (the first sentence)" } },
              { correct: "3.5", label: "The bigger tenth", width: 70, accept: sameValue(3.5), part: "Between", exploreTarget: { target: "u2-between", label: "How to round (the first sentence)" } },
              { correct: "3.5", label: "3.462 rounded to the nearest tenth", width: 70, accept: exactly("3.5"), part: "Rounds to", exploreTarget: { target: "u2-line", label: "The number line and the sentence under it" } },
            ]}
            render={([a, b, c]) => (
              <>
                3.462 is between {a} and {b}. It rounds to {c}.
              </>
            )}
            good="Yes. Halfway between 3.4 and 3.5 is 3.45. 3.462 is past halfway, so it rounds up to 3.5."
            bad={(oks) => (!oks[0] || !oks[1] ? "Keep the digits up to the tenths place: 3.4. The next tenth is 1 tenth more." : "Look at the hundredths digit. Is it 5 or more?")}
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Round 2.996 to the nearest hundredth. Write a digit in every place through the hundredths place, even a 0.
          </p>
          <DropdownQuestion
            blanks={[{ correct: "3.00", label: "2.996 rounded to the nearest hundredth", width: 80, accept: exactly("3.00") }]}
            render={([a]) => <>2.996 rounds to {a}</>}
            good="Right. 9 hundredths + 1 hundredth = 10 hundredths = 1 tenth. Then 9 tenths + 1 tenth = 1 one. So 2.996 rounds to 3.00."
            bad={(_oks, vals) => {
              const v = vals[0].trim();
              if (v === "3" || v === "3.0") return "That's the right amount. Show the hundredths place too: two digits after the point.";
              if (v === "2.910" || v === "2.100" || v === "2.10" || v === "2.91") return "10 can't fit in one place. Write 0 and add 1 to the place on its left. Keep going if that place is a 9 too.";
              if (v === "2.99") return "Look at the thousandths digit. Is it 5 or more?";
              return "The thousandths digit is 6, so round up. When a 9 becomes 10, write 0 and add 1 to the place on its left.";
            }}
            exploreTarget={{ target: "u2-carry", label: "When you add 1 to a 9" }}
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Round 5.749 to the nearest tenth. Write a digit in every place through the tenths place, even a 0.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["the 4 in the hundredths place", "the 9 in the thousandths place"], correct: "the 4 in the hundredths place", label: "The digit that decides", part: "Digit that decides", exploreTarget: { target: "u2-decide", label: "The place chart: the digit that decides" } },
              { correct: "5.7", label: "5.749 rounded to the nearest tenth", width: 70, accept: exactly("5.7"), part: "Rounds to", exploreTarget: { target: "u2-line", label: "The number line and the sentence under it" } },
            ]}
            render={([a, b]) => (
              <>
                The digit that decides is {a}. 5.749 rounds to {b}.
              </>
            )}
            good="Yes. Only the digit just right of the tenths place decides. It is 4, so 5.749 rounds down to 5.7. The 9 doesn't count."
            bad={(oks) => (!oks[0] ? "Find the tenths place. Which digit is just to its right?" : "The hundredths digit is 4. Is that 5 or more?")}
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> True or false?
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "When you round a number, it always changes", part: "First sentence", exploreTarget: { target: "u2-same", label: "The sentence under the number line" } },
              { options: ["True", "False"], correct: "True", label: "2.45 rounded to the nearest tenth is 2.5", part: "Second sentence", exploreTarget: { target: "u2-same", label: "The sentence under the number line" } },
            ]}
            render={([a, b]) => (
              <>
                When you round a number, it always changes. {a}
                <br />
                2.45 rounded to the nearest tenth is 2.5. {b}
              </>
            )}
            good="Correct. 3.40 rounded to the nearest tenth is 3.4, the same amount. And a number exactly halfway, like 2.45, rounds up."
            bad="Try rounding 3.40 to the nearest tenth. What is the hundredths digit? And where does a number exactly at halfway go?"
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
  const [t, setT] = useState(2437);
  const [p, setP] = useState<Places>(2);
  const { w, d } = digitsOf(t);
  const setDigit = (k: number) => (v: number) => {
    const parts = [w, ...d];
    parts[k] = v;
    setT(parts[0] * 1000 + parts[1] * 100 + parts[2] * 10 + parts[3]);
  };
  const x: Dec = { t, p: 3 };
  const { lo, hi, mid, r, next } = roundAt(t, p);
  const nextName = PLACE_NAMES[p + 1];
  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p {...lookHereSpot("u2-between")}>
          To <b>round</b> 2.437 to the nearest hundredth, find the hundredths just below and just above it: 2.43 and 2.44. Then pick the one it is closer to.
        </p>
        <div className="control-row">
          <Stepper label="Ones" value={w} min={0} max={9} onChange={setDigit(0)} />
          <Stepper label="Tenths" value={d[0]} min={0} max={9} onChange={setDigit(1)} />
          <Stepper label="Hundredths" value={d[1]} min={0} max={9} onChange={setDigit(2)} />
          <Stepper label="Thousandths" value={d[2]} min={0} max={9} onChange={setDigit(3)} />
        </div>
        <Segmented
          label="Round to"
          value={String(p)}
          onChange={(v) => setP(Number(v) as Places)}
          options={[
            { id: "0", label: "Nearest whole number" },
            { id: "1", label: "Nearest tenth" },
            { id: "2", label: "Nearest hundredth" },
          ]}
        />
        <div {...lookHereSpot("u2-decide")} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <PlaceChart rows={[{ ...x, tone: "a" }]} place={p} decide={(p + 1) as Places} />
        <p className="muted small" data-look-here-key>
          The {p === 0 ? "ones" : PLACE_NAMES[p]} place has a box. The digit just to its right, in the {nextName} place, is the one that decides.
        </p>
        </div>
        <div {...lookHereSpot("u2-line")} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ZoomLine lo={lo} hi={hi} p={p} x={x} ringR={r} onChange={(v) => setT(Math.min(9999, v))} />
        <div {...lookHereSpot("u2-same")} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p className="says" data-look-here-key>
          {showDec(x)} is between {decText(lo, p)} and {decText(hi, p)}. Halfway is {decText(mid, (p + 1) as Places)}. The {nextName} digit is {next}.{" "}
          {next >= 5 ? "That is 5 or more, so round up." : "That is less than 5, so round down."} {showDec(x)} rounds to <b>{decText(r, p)}</b>.
        </p>
        <p className="muted small" data-look-here-key>
          A number exactly halfway rounds up. Rounding does not always change the amount: 1.20 rounded to the nearest tenth is 1.2.
        </p>
        </div>
        </div>
        <p className="muted small">Drag the dot, or change the digits.</p>
        <p className="muted small" {...lookHereSpot("u2-carry")}>
          Try 2.996 to the nearest hundredth. <span data-look-here-key>When you add 1 to a 9, it becomes 10. Write 0 and add 1 to the place on its left.</span>
        </p>
        {(introActive || showCheck) && <RoundingCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

export const U2_BUCKETS = [...ROUND_BUCKETS, "twoPlaces"];

function roundProblem(bucket: RoundBucket): Problem {
  const { x, p } = roundCase(bucket);
  const { lo, hi, r } = roundAt(x.t, p);
  const exact = bucket === "exact";
  const line = (showDot: boolean, ring: boolean) => <ZoomLine lo={lo} hi={hi} p={p} x={showDot ? x : undefined} ringR={ring ? r : undefined} />;
  return {
    title: `Round to ${nearestText(p)}`,
    bucket,
    story: (
      <>
        Round <b className="qa-text">{showDec(x)}</b> to {nearestText(p)}.
      </>
    ),
    // Nothing by default (the Test shows nothing). Step 1 help: the chart with
    // the place boxed (and the rest faded). After step 1: the line with the
    // student's two ends; the dot only as help on step 2, or once it's done.
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(done >= 1 || pointing(help, 0)) && <PlaceChart rows={[{ ...x, tone: "a" }]} place={p} decide={exact ? ((p + 1) as Places) : undefined} fadeAfter={!exact} />}
        {done >= 1 && !exact && line(done >= 2 || pointing(help, 1), done >= 2)}
        {exact && done >= 2 && line(true, true)}
      </div>
    ),
    steps: exact ? [nextDigitStep(x, p), roundStep(x, p)] : [betweenStep(x, p), roundStep(x, p)],
    wrapUp: (
      <>
        {showDec(x)} rounds to {decText(r, p)}.{" "}
        {exact ? "Every digit after that place is 0, so the amount stays the same." : bucket === "carry" ? "The 9 became 10. You wrote 0 and added 1 to the place on its left." : `The ${PLACE_NAMES[p + 1]} digit decided.`}
      </>
    ),
  };
}

/** The same number rounded to two places (random order), so no one answer fits both. */
function twoPlacesProblem(): Problem {
  const { t, places } = twoPlacesCase();
  const x: Dec = { t, p: 3 };
  const [a, b] = places;
  const lineFor = (q: Places, ring: boolean, dot: boolean) => {
    const R = roundAt(t, q);
    return <ZoomLine lo={R.lo} hi={R.hi} p={q} x={dot ? x : undefined} ringR={ring ? R.r : undefined} />;
  };
  return {
    title: "One number, two places",
    bucket: "twoPlaces",
    story: (
      <>
        Round <b className="qa-text">{showDec(x)}</b> two ways.
      </>
    ),
    // Help on each step: that place's line (ends and halfway, no dot); the dot comes when the step is done.
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(done >= 1 || pointing(help, 0)) && lineFor(a, done >= 1, done >= 1)}
        {(done >= 2 || pointing(help, 1)) && lineFor(b, done >= 2, done >= 2)}
      </div>
    ),
    // roundStep adds "Write a digit in every place through the ... place, even a 0." to each prompt (C1-01).
    steps: [roundStep(x, a, `Round ${showDec(x)} to ${nearestText(a)}.`), roundStep(x, b, `Now round the same number, ${showDec(x)}, to ${nearestText(b)}.`)],
    wrapUp: (
      <>
        To {nearestText(a)}, {showDec(x)} rounds to {decText(roundAt(t, a).r, a)}. To {nearestText(b)}, it rounds to {decText(roundAt(t, b).r, b)}. The place you round to changes the answer.
      </>
    ),
  };
}

function Preview() {
  return <ZoomLine lo={2430} hi={2440} p={2} x={{ t: 2437, p: 3 }} ringR={2440} />;
}

export const roundingDecimals: Unit = {
  id: "roundingDecimals",
  title: "Rounding Decimals",
  goal: "Round a decimal to the nearest whole number, tenth or hundredth.",
  standard: "5.NBT.4",
  keyIdea: (
    <>
      <p>To round 2.437 to the nearest hundredth, find the hundredths just below and just above it: 2.43 and 2.44.</p>
      <p>Look only at the digit just to the right of the place. 5 or more rounds up; less than 5 rounds down. 2.437 rounds to 2.44.</p>
      <p>When you add 1 to a 9, it becomes 10. Write 0 and add 1 to the place on its left. To the nearest hundredth, 2.996 rounds to 3.00.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // The rounding rule is a fixed procedure that can drift once proven (plan): re-check it every 20 solves.
  reintroEverySolved: 20,
  preview: Preview,
  requiredBuckets: U2_BUCKETS,
  problems: [
    { label: "Round", make: (b) => roundProblem((b as RoundBucket) ?? pick(ROUND_BUCKETS)), buckets: [...ROUND_BUCKETS] },
    { label: "Two places", make: () => twoPlacesProblem(), buckets: ["twoPlaces"] },
  ],
  test: roundingTest,
};
