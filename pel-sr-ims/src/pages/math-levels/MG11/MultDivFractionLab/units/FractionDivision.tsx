import { useEffect, useState } from "react";
import { AreaRectangle, FractionBar, FractionMeasureStrip } from "../diagrams";
import { gcd, randInt, simplify } from "../../../shared/lib/math";
import { choice, fracMultiply, type Problem, type Step } from "../../../shared/engine/types";
import { Frac, QA, QB } from "../../../shared/engine/controls";
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
 * One step of an N-step sequence: nothing before `appearAt`, `front` from
 * `appearAt` up to (not including) `flipAt`, then `back` for good after
 * `flipAt`. Exactly AT `flipAt` it plays the 3D card-flip from front to back
 * — stepping forward one at a time (or auto-playing) passes through that
 * exact step and gets the animation; jumping past it (Beginning/End/scrubbing)
 * never renders the mid-flip markup at all, so it just shows the right side
 * directly. That's also what happens under reduced motion, or once the flip's
 * own animation finishes while still sitting on `flipAt` — "settled" renders
 * `back` as a plain node with no transform/perspective wrapper, because a
 * lingering 3D context (even one that nets out to "no rotation") can leave a
 * browser compositing it on its own layer, enough to shift its text a pixel
 * or two off plain, non-transformed content next to it.
 */
function FlipStep({
  step,
  appearAt,
  flipAt,
  front,
  back,
}: {
  step: number;
  appearAt: number;
  flipAt: number;
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (step !== flipAt) setSettled(false);
  }, [step, flipAt]);

  if (step < appearAt) return null;
  if (step < flipAt) return <>{front}</>;
  if (step > flipAt || settled) return <>{back}</>;
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return <>{back}</>;
  return (
    <span className="flip-swap">
      <span className="flip-inner" onAnimationEnd={() => setSettled(true)}>
        <span className="flip-face flip-front">{front}</span>
        <span className="flip-face flip-back">{back}</span>
      </span>
    </span>
  );
}

/**
 * How many local steps KeepChangeFlipSteps has — a plain 5 (Keep appears,
 * Change appears, Change flips, Flip appears, Flip flips), plus one more for
 * each side that's a mixed number: that side's "appears" step is captioned
 * "Convert" first (showing the number IS the converted improper form, not
 * the original mixed number — which stays visible elsewhere, unflipped) and
 * needs its own extra step to settle into its real caption ("Keep"/"Flip")
 * before the sequence continues; plus one more again if `showResult` (the
 * final "= 8/9" reveal). Must match the step numbering inside
 * KeepChangeFlipSteps itself exactly.
 */
function kcfStepCount(dividendIsMixed: boolean, divisorIsMixed: boolean, showResult = false): number {
  return 5 + (dividendIsMixed ? 1 : 0) + (divisorIsMixed ? 1 : 0) + (showResult ? 1 : 0);
}

/**
 * The "Keep, Change, Flip" mnemonic, as discrete local steps driven by `step`
 * (0 = nothing, kcfStepCount(...) = fully revealed) instead of a timer — a
 * media-player control bar scrubs through these, so each step just renders
 * exactly what should be visible at that point. Plain case (neither side
 * mixed): 1 = "= 2/3" appears (Keep), 2 = ÷ appears (Change), 3 = ÷ flips to
 * ×, 4 = 3/4 appears (Flip), 5 = 3/4 flips to 4/3.
 *
 * `an/bd` and `cn/dd` are the CURRENT values Keep/Flip work with — already
 * the improper form when that side started as a mixed number, since
 * Keep/Change/Flip only ever applies to fractions, not mixed numbers. Pass
 * `dividendIsMixed`/`divisorIsMixed` when the caller's base equation still
 * shows the original mixed number (unflipped, permanently) alongside this —
 * that side's "appears" step is then captioned "Convert" for one extra step
 * before settling into "Keep"/"Flip", making it visible that Keep/Flip acts
 * on the converted fraction, not the mixed number sitting next to it.
 *
 * `showResult`, when true, adds one final step revealing "= 8/9" (computed
 * from an/bd ÷ cn/dd, i.e. the ORIGINAL un-flipped division) right after Flip
 * finishes, so the answer appears in the same big-equation line as the rest
 * of it. Only meaningful for callers with no separate cancel/simplify step
 * of their own (which already ends in its own "= answer") — leave it off
 * there to avoid showing the answer twice.
 */
function KeepChangeFlipSteps({
  an,
  bd,
  cn,
  dd,
  step,
  dividendIsMixed = false,
  divisorIsMixed = false,
  showResult = false,
}: {
  an: number;
  bd: number;
  cn: number;
  dd: number;
  step: number;
  dividendIsMixed?: boolean;
  divisorIsMixed?: boolean;
  showResult?: boolean;
}) {
  let s = 0;
  const keepAppear = ++s;
  const keepConfirm = dividendIsMixed ? ++s : keepAppear;
  const changeAppear = ++s;
  const changeFlip = ++s;
  const flipAppear = ++s;
  const flipConfirm = divisorIsMixed ? ++s : flipAppear;
  const flipFlip = ++s;
  const resultStep = showResult ? ++s : flipFlip;

  const keepCaption = dividendIsMixed && step < keepConfirm ? "Convert" : "Keep";
  const flipCaption = divisorIsMixed && step < flipConfirm ? "Convert" : "Flip";
  const [qn, qd] = showResult ? simplify(an * dd, bd * cn) : [0, 1];

  return (
    <span className="kcf2">
      {step >= keepAppear && (
        <span className="kcf2-part kcf2-reveal">
          <span className="kcf2-content"><span className="explore-op">=</span></span>
        </span>
      )}
      {step >= keepAppear && (
        <span className="kcf2-part kcf2-reveal">
          <span className="kcf2-content"><span className="qa-text"><Frac n={an} d={bd} /></span></span>
          <span className="kcf-label kcf-keep">{keepCaption}</span>
        </span>
      )}
      {step >= changeAppear && (
        <span className="kcf2-part kcf2-reveal">
          <span className="kcf2-content">
            <FlipStep step={step} appearAt={changeAppear} flipAt={changeFlip} front={<span className="kcf2-op">÷</span>} back={<span className="kcf2-op kcf2-op-new">×</span>} />
          </span>
          <span className="kcf-label kcf-change">Change</span>
        </span>
      )}
      {step >= flipAppear && (
        <span className="kcf2-part kcf2-reveal">
          <span className="kcf2-content">
            <FlipStep
              step={step}
              appearAt={flipAppear}
              flipAt={flipFlip}
              front={<span className="qb-text"><Frac n={cn} d={dd} /></span>}
              back={<span className="kcf2-flipped"><Frac n={dd} d={cn} /></span>}
            />
          </span>
          <span className="kcf-label kcf-flip">{flipCaption}</span>
        </span>
      )}
      {showResult && step >= resultStep && (
        <span className="kcf2-part kcf2-reveal">
          <span className="kcf2-content"><span className="explore-op">=</span></span>
        </span>
      )}
      {showResult && step >= resultStep && (
        <span className="kcf2-part kcf2-reveal">
          <span className="kcf2-content"><Quotient n={qn} d={qd} /></span>
        </span>
      )}
    </span>
  );
}

/** A whole number, a proper fraction, or a mixed number (both together). */
interface NumValue {
  whole?: number;
  n?: number;
  d?: number;
}

/** A big, non-interactive fraction — the same numbers-and-bar look as
 *  FracStepperGroup, just without the pill buttons, for display-only examples. */
function BigFraction({ n, d }: { n: number; d: number }) {
  return (
    <span className="frac-stepper">
      <span className="example-number">{n}</span>
      <span className="frac-stepper-bar" />
      <span className="example-number">{d}</span>
    </span>
  );
}

/**
 * Renders a whole number, a proper fraction, or a mixed number at the same
 * big scale as the live stepper equation. Doesn't set its own color — wrap it
 * in <span className="qa-text"> / "qb-text"> at the call site, same as Frac.
 */
function NumberDisplay({ value }: { value: NumValue }) {
  const hasFrac = value.n !== undefined && value.d !== undefined;
  return (
    <span className="example-value">
      {value.whole !== undefined && <span className="example-number">{value.whole}</span>}
      {hasFrac && <BigFraction n={value.n!} d={value.d!} />}
    </span>
  );
}

/** A digit, struck through, with its post-cancellation value badged above it — the
 *  standard textbook cross-cancellation mark. Plain (no strikethrough) when there's
 *  nothing to cancel (original === reduced), so this is safe to use unconditionally. */
function CancelNumber({ original, reduced }: { original: number; reduced: number }) {
  if (original === reduced) return <span className="example-number">{original}</span>;
  return (
    <span className="cancel-number">
      <span className="example-number cancel-original">{original}</span>
      <span className="cancel-reduced">{reduced}</span>
    </span>
  );
}

function CancelFraction({ n, nReduced, d, dReduced }: { n: number; nReduced: number; d: number; dReduced: number }) {
  return (
    <span className="frac-stepper">
      <CancelNumber original={n} reduced={nReduced} />
      <span className="frac-stepper-bar" />
      <CancelNumber original={d} reduced={dReduced} />
    </span>
  );
}

/**
 * The payoff after Keep/Change/Flip, as 2 discrete local steps (0 = nothing,
 * 2 = fully revealed): cross-cancel the common factors between each
 * fraction's numerator and the OTHER fraction's denominator (gcd(n1,d2) and
 * gcd(n2,d1)) at step 1, then at step 2 multiply what's left straight across.
 * `n1/d1` is the kept dividend; `n2/d2` is the already-flipped divisor (so
 * for a ÷ b/c, that's c/b) — both as they stand at the end of
 * KeepChangeFlipSteps's sequence, not the original un-flipped numbers.
 */
function CancelSteps({ n1, d1, n2, d2, step }: { n1: number; d1: number; n2: number; d2: number; step: number }) {
  if (step < 1) return null;
  const g1 = gcd(n1, d2);
  const g2 = gcd(n2, d1);
  const redN1 = n1 / g1;
  const redD2 = d2 / g1;
  const redN2 = n2 / g2;
  const redD1 = d1 / g2;
  const [qn, qd] = simplify(redN1 * redN2, redD1 * redD2);

  return (
    <div className="explore-equation kcf2-reveal">
      <span className="qa-text"><CancelFraction n={n1} nReduced={redN1} d={d1} dReduced={redD1} /></span>
      <span className="explore-op">×</span>
      <span className="qb-text"><CancelFraction n={n2} nReduced={redN2} d={d2} dReduced={redD2} /></span>
      {step >= 2 && (
        <>
          <span className="explore-op kcf2-reveal">=</span>
          <span className="kcf2-reveal"><Quotient n={qn} d={qd} /></span>
        </>
      )}
    </div>
  );
}
/** How many local steps CancelSteps has (see above). */
const CANCEL_STEPS = 2;

/** One named stage in a StageList — `from`/`to` is the inclusive range of the
 *  player's global `step` that counts as this stage (a stage can span several
 *  fine-grained steps, e.g. Change covers both its "appear" and "flip" steps). */
interface Stage {
  label: string;
  from: number;
  to: number;
}

/**
 * A left-side-justified, numbered list of the big named stages (Convert,
 * Keep, Change, Flip, Cancel and Simplify — or just Keep/Change/Flip when
 * there's no mixed number to convert), kept in sync with the step player:
 * whichever stage's range contains the current `step` is highlighted as
 * active, earlier ones are marked done, later ones stay muted. Several
 * fine-grained player steps can fall under one stage here (e.g. Change
 * "appears" then "flips" are both still just stage 3 of 5).
 */
function StageList({ stages, step }: { stages: Stage[]; step: number }) {
  return (
    <ol className="stage-list">
      {stages.map((s, i) => {
        const state = step > s.to ? "done" : step >= s.from ? "active" : "upcoming";
        return (
          <li key={s.label} className={`stage-list-item ${state}`}>
            <span className="stage-list-num">{i + 1}</span>
            <span className="stage-list-label">{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Drives a 0..maxStep sequence with media-player semantics: jump to either
 * end, step one at a time, or auto-play (one step per `intervalMs`, stopping
 * at the end — pressing play again from the end restarts from 0). Any manual
 * navigation pauses auto-play, same as scrubbing a video pauses it.
 * `intervalMs` defaults to a bit more than the 1.24s flip animation, so
 * auto-play lets each step's animation finish before advancing.
 */
function useStepPlayer(maxStep: number, intervalMs = 2200) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (step >= maxStep) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep((s) => Math.min(maxStep, s + 1)), intervalMs);
    return () => clearTimeout(id);
  }, [playing, step, maxStep, intervalMs]);

  return {
    step,
    maxStep,
    playing,
    toBeginning: () => {
      setPlaying(false);
      setStep(0);
    },
    back: () => {
      setPlaying(false);
      setStep((s) => Math.max(0, s - 1));
    },
    togglePlay: () => {
      if (!playing && step >= maxStep) {
        setStep(0);
        setPlaying(true);
      } else {
        setPlaying((p) => !p);
      }
    },
    forward: () => {
      setPlaying(false);
      setStep((s) => Math.min(maxStep, s + 1));
    },
    toEnd: () => {
      setPlaying(false);
      setStep(maxStep);
    },
  };
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="7 4 20 12 7 20" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}
function IconToStart() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="4" y="4" width="3" height="16" rx="1" />
      <polygon points="20 4 20 20 8 12" />
    </svg>
  );
}
function IconToEnd() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="17" y="4" width="3" height="16" rx="1" />
      <polygon points="4 4 4 20 16 12" />
    </svg>
  );
}

/** The media-player-style control bar: beginning / back a step / play-pause / forward a step / end. */
function StepPlayerControls({ step, maxStep, playing, toBeginning, back, togglePlay, forward, toEnd }: ReturnType<typeof useStepPlayer>) {
  return (
    <div className="step-player" role="group" aria-label="Animation controls">
      <button type="button" onClick={toBeginning} disabled={step === 0} aria-label="Beginning">
        <IconToStart />
      </button>
      <button type="button" onClick={back} disabled={step === 0} aria-label="Back one step">
        <Chevron direction="left" />
      </button>
      <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
        {playing ? <IconPause /> : <IconPlay />}
      </button>
      <button type="button" onClick={forward} disabled={step === maxStep} aria-label="Forward one step">
        <Chevron direction="right" />
      </button>
      <button type="button" onClick={toEnd} disabled={step === maxStep} aria-label="End">
        <IconToEnd />
      </button>
    </div>
  );
}

const PROPER_KCF_STEPS = kcfStepCount(false, false, true);
const PROPER_STAGES: Stage[] = [
  { label: "Keep", from: 1, to: 1 },
  { label: "Change", from: 2, to: 3 },
  { label: "Flip", from: 4, to: 5 },
  { label: "Result", from: 6, to: 6 },
];

function ExploreProperFraction() {
  const [an, setAn] = useState(2);
  const [bd, setBd] = useState(3);
  const [cn, setCn] = useState(3);
  const [dd, setDd] = useState(4);
  const player = useStepPlayer(PROPER_KCF_STEPS);

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <StageList stages={PROPER_STAGES} step={player.step} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, minWidth: 0 }}>
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
          <KeepChangeFlipSteps an={an} bd={bd} cn={cn} dd={dd} step={player.step} showResult />
        </div>

        <StepPlayerControls {...player} />
      </div>
    </div>
  );
}

/**
 * Mixed ÷ proper, animated: a mixed number isn't yet in a shape Keep/Change/Flip
 * applies to, so Convert has to happen first. Unlike an earlier version of
 * this, the mixed number in the base equation never changes — "1 1/3" stays
 * on screen permanently, and Convert instead reveals the improper form (4/3)
 * as NEW information next to it (captioned "Convert"), which then settles
 * into being captioned "Keep" — making it visible that Keep/Change/Flip acts
 * on the converted fraction, not the original mixed number sitting next to
 * it. Change/Flip then run as usual, and a final "cancel" step shows the
 * cross-cancellation that this example's numbers (1 1/3 ÷ 2/9) are
 * deliberately chosen to produce, landing on a fully simplified answer.
 *
 * One global step counter (0..kcfSteps+CANCEL_STEPS) drives both halves —
 * KeepChangeFlipSteps and CancelSteps each get their own local step number,
 * clamped from the part of the global counter that's "theirs". The stage
 * list on the left groups those same fine-grained steps into the 5 named
 * stages, kept in sync automatically since it reads the same `step`.
 */
function ExploreMixedByProper() {
  const whole = 1;
  const mixedN = 1;
  const mixedD = 3;
  const improperN = whole * mixedD + mixedN; // 4/3
  const improperD = mixedD;
  const cn = 2; // divisor 2/9
  const dd = 9;

  const kcfSteps = kcfStepCount(true, false);
  const stages: Stage[] = [
    { label: "Convert to improper fraction", from: 1, to: 1 },
    { label: "Keep", from: 2, to: 2 },
    { label: "Change", from: 3, to: 4 },
    { label: "Flip", from: 5, to: 6 },
    { label: "Cancel and simplify", from: kcfSteps + 1, to: kcfSteps + CANCEL_STEPS },
  ];

  const player = useStepPlayer(kcfSteps + CANCEL_STEPS);
  const cancelStep = Math.max(0, Math.min(CANCEL_STEPS, player.step - kcfSteps));

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <StageList stages={stages} step={player.step} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, minWidth: 0 }}>
        <div className="explore-equation">
          <span className="qa-text"><NumberDisplay value={{ whole, n: mixedN, d: mixedD }} /></span>
          <span className="explore-op">÷</span>
          <span className="qb-text"><NumberDisplay value={{ n: cn, d: dd }} /></span>
          <KeepChangeFlipSteps an={improperN} bd={improperD} cn={cn} dd={dd} step={player.step} dividendIsMixed />
        </div>

        <StepPlayerControls {...player} />

        <CancelSteps n1={improperN} d1={improperD} n2={dd} d2={cn} step={cancelStep} />
      </div>
    </div>
  );
}

/**
 * Mixed ÷ mixed, built the same way as mixed ÷ proper — both "1 1/2" and
 * "2 1/4" stay on screen permanently (neither flips away), and Convert
 * reveals the dividend's improper form as new information next to it, same
 * as the mixed-÷-proper case. The divisor's own conversion isn't a separate
 * named stage — it's folded into Flip, whose "appears" step is captioned
 * "Convert" first (showing 9/4, the divisor's improper form) before settling
 * into "Flip" and then flipping to 4/9, via the same `divisorIsMixed` option
 * KeepChangeFlipSteps already supports. Numbers (1 1/2 ÷ 2 1/4 = 3/2 ÷ 9/4)
 * are chosen so both cross-cancellation diagonals hit, landing on a clean
 * simplified fraction (2/3) instead of a messy unreduced one.
 */
function ExploreMixedByMixed() {
  const dWhole = 1, dN = 1, dD = 2; // dividend: 1 1/2 -> improper 3/2
  const improperAn = dWhole * dD + dN;
  const improperBd = dD;
  const vWhole = 2, vN = 1, vD = 4; // divisor: 2 1/4 -> improper 9/4
  const improperCn = vWhole * vD + vN;
  const improperDd = vD;

  const kcfSteps = kcfStepCount(true, true);
  const stages: Stage[] = [
    { label: "Convert to improper fraction", from: 1, to: 1 },
    { label: "Keep", from: 2, to: 2 },
    { label: "Change", from: 3, to: 4 },
    { label: "Flip", from: 5, to: 7 },
    { label: "Cancel and simplify", from: kcfSteps + 1, to: kcfSteps + CANCEL_STEPS },
  ];

  const player = useStepPlayer(kcfSteps + CANCEL_STEPS);
  const cancelStep = Math.max(0, Math.min(CANCEL_STEPS, player.step - kcfSteps));

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <StageList stages={stages} step={player.step} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, minWidth: 0 }}>
        <div className="explore-equation">
          <span className="qa-text"><NumberDisplay value={{ whole: dWhole, n: dN, d: dD }} /></span>
          <span className="explore-op">÷</span>
          <span className="qb-text"><NumberDisplay value={{ whole: vWhole, n: vN, d: vD }} /></span>
          <KeepChangeFlipSteps an={improperAn} bd={improperBd} cn={improperCn} dd={improperDd} step={player.step} dividendIsMixed divisorIsMixed />
        </div>

        <StepPlayerControls {...player} />

        <CancelSteps n1={improperAn} d1={improperBd} n2={improperDd} d2={improperCn} step={cancelStep} />
      </div>
    </div>
  );
}

function ExploreWholeByProper() {
  return (
    <div className="explore-equation">
      <span className="qa-text"><NumberDisplay value={{ whole: 4 }} /></span>
      <span className="explore-op">÷</span>
      <span className="qb-text"><NumberDisplay value={{ n: 2, d: 3 }} /></span>
    </div>
  );
}

/**
 * The four example types a 3rd/4th-grader needs to see before "divide
 * fractions" means anything beyond proper-over-proper: the same operation
 * shows up with a mixed number, two mixed numbers, or a whole number on
 * either side, and seeing each one named and pictured is part of learning
 * the vocabulary, not just the mechanics. Only the first is interactive
 * (steppers + Keep/Change/Flip); the other three are fixed illustrations for
 * now — check-for-understanding questions come later, once these look right.
 */
const EXPLORE_EXAMPLES: { title: string; Component: React.ComponentType }[] = [
  { title: "Proper fraction ÷ proper fraction", Component: ExploreProperFraction },
  { title: "Mixed number ÷ proper fraction", Component: ExploreMixedByProper },
  { title: "Mixed number ÷ mixed number", Component: ExploreMixedByMixed },
  { title: "Whole number ÷ proper fraction", Component: ExploreWholeByProper },
];

/** A chevron as inline SVG (not a text glyph) so it centers exactly in the nav button. */
function Chevron({ direction }: { direction: "left" | "right" }) {
  const points = direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={points} />
    </svg>
  );
}

function Explore() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = (i: number) => {
    setDirection(i >= index ? 1 : -1);
    setIndex(i);
  };
  const go = (delta: 1 | -1) => goTo((index + delta + EXPLORE_EXAMPLES.length) % EXPLORE_EXAMPLES.length);

  const { title, Component } = EXPLORE_EXAMPLES[index];

  return (
    <div className="example-carousel">
      <button type="button" className="example-nav example-nav-left" onClick={() => go(-1)} aria-label="Previous example">
        <Chevron direction="left" />
      </button>
      <div className="example-carousel-viewport">
        <div key={index} className={direction === 1 ? "example-carousel-body example-slide-in-right" : "example-carousel-body example-slide-in-left"}>
          <p className="example-kicker">{title}</p>
          <Component />
        </div>
      </div>
      <button type="button" className="example-nav example-nav-right" onClick={() => go(1)} aria-label="Next example">
        <Chevron direction="right" />
      </button>
      <div className="example-dots" role="tablist" aria-label="Examples">
        {EXPLORE_EXAMPLES.map((ex, i) => (
          <button key={ex.title} role="tab" aria-selected={i === index} aria-label={`Go to ${ex.title}`} className={i === index ? "on" : ""} onClick={() => goTo(i)} />
        ))}
      </div>
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

  // After flipping, the multiplication is (an/bd) × (dd/cn) — cross-cancel
  // checks the diagonal pairs: an's numerator against cn (the OTHER
  // fraction's denominator), and dd against bd. Since an/bd and cn/dd each
  // start in lowest terms, cancelling both diagonals (dividing by 1 is a
  // no-op when a pair doesn't share a factor) always lands exactly on
  // qn/qd — so step 3 can multiply these straight across with no separate
  // "simplify" step needed afterward, whether or not anything cancelled.
  const g1 = gcd(an, cn);
  const g2 = gcd(dd, bd);
  const redAn = an / g1;
  const redCn = cn / g1;
  const redDd = dd / g2;
  const redBd = bd / g2;

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
      // To divide, multiply by the reciprocal: an/bd × dd/cn. Before multiplying
      // straight across, check both diagonals (an against cn, dd against bd) for a
      // shared factor to cancel — whichever one actually has one (there may be none,
      // one, or both), since an/bd and cn/dd each already start in lowest terms. When
      // one does cancel, a second step has the student rewrite the expression with
      // the cancelled numbers filled in, before step 3 multiplies what's left.
      ...(g1 > 1
        ? ([
            {
              kind: "number",
              prompt: <>To divide, multiply by the reciprocal: <QA><Frac n={an} d={bd} /></QA> × <Frac n={dd} d={cn} />. Before multiplying straight across, look for a shortcut: <QA>{an}</QA> and <QB>{cn}</QB> share a common factor. What is it?</>,
              hint: `List the factors of ${an} and of ${cn} — what's the biggest factor they have in common?`,
              explain: <>{an} and {cn} are both divisible by {g1}, so you can cancel it before multiplying — dividing {an} by {g1} gives {redAn}, and dividing {cn} by {g1} gives {redCn}.</>,
              answer: g1,
            },
            fracMultiply(
              {
                prompt: <>Rewrite the expression with {an} and {cn} cancelled down by {g1}.</>,
                hint: `${an} ÷ ${g1} and ${cn} ÷ ${g1} — the other two numbers (${bd} and ${dd}) don't change.`,
                explain: <>{an} ÷ {g1} = {redAn}, and {cn} ÷ {g1} = {redCn}, so the expression becomes <Frac n={redAn} d={bd} /> × <Frac n={dd} d={redCn} />.</>,
              },
              null,
              bd,
              dd,
              null,
              [redAn, redCn],
              "none"
            ),
          ] as Step[])
        : g2 > 1
          ? ([
              {
                kind: "number",
                prompt: <>To divide, multiply by the reciprocal: <QA><Frac n={an} d={bd} /></QA> × <Frac n={dd} d={cn} />. Before multiplying straight across, look for a shortcut: <QB>{dd}</QB> and <QA>{bd}</QA> share a common factor. What is it?</>,
                hint: `List the factors of ${dd} and of ${bd} — what's the biggest factor they have in common?`,
                explain: <>{dd} and {bd} are both divisible by {g2}, so you can cancel it before multiplying — dividing {dd} by {g2} gives {redDd}, and dividing {bd} by {g2} gives {redBd}.</>,
                answer: g2,
              },
              fracMultiply(
                {
                  prompt: <>Rewrite the expression with {dd} and {bd} cancelled down by {g2}.</>,
                  hint: `${dd} ÷ ${g2} and ${bd} ÷ ${g2} — the other two numbers (${an} and ${cn}) don't change.`,
                  explain: <>{dd} ÷ {g2} = {redDd}, and {bd} ÷ {g2} = {redBd}, so the expression becomes <Frac n={an} d={redBd} /> × <Frac n={redDd} d={cn} />.</>,
                },
                an,
                null,
                null,
                cn,
                [redBd, redDd],
                "none"
              ),
            ] as Step[])
          : ([
              choice(
                {
                  prompt: <>To divide, multiply by the reciprocal: <QA><Frac n={an} d={bd} /></QA> × <Frac n={dd} d={cn} />. Before multiplying straight across, check for a shortcut — does any numerator share a common factor with the other fraction's denominator?</>,
                  hint: `Compare ${an} with ${cn}, and ${dd} with ${bd} — does either pair share a factor greater than 1?`,
                  explain: `${an} and ${cn} don't share a common factor, and neither do ${dd} and ${bd} — so there's nothing to cancel here; just multiply straight across.`,
                },
                "No — none of these share a common factor, so just multiply straight across",
                [`Yes — ${an} and ${cn} share a common factor`, `Yes — ${dd} and ${bd} share a common factor`]
              ),
            ] as Step[])),
      {
        kind: "number",
        frac: true,
        fracAnswer: [qn, qd],
        prompt: <>Now multiply straight across: <Frac n={redAn} d={redBd} /> × <Frac n={redDd} d={redCn} />. What's the product?</>,
        hint: `Multiply the numerators (${redAn} × ${redDd}) and the denominators (${redBd} × ${redCn}).`,
        explain: <><Frac n={redAn} d={redBd} /> × <Frac n={redDd} d={redCn} /> = <Quotient n={qn} d={qd} />.</>,
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
    // Rescale to a common denominator (bd×n) before drawing: that always makes the
    // shaded amount (an×n cells) divide evenly by n, so the bar can show the actual
    // n-way split (and highlight one share) no matter what an/bd/n happen to be —
    // not just the cases where bd was already a multiple of n.
    visual: () => <FractionBar numerator={an * n} denominator={bd * n} shareCount={n} highlightShare={0} label={`${an}/${bd} lb shared ${n} ways`} />,
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
