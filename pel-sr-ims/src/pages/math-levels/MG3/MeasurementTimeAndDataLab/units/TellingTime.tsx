import { useEffect, useState } from "react";
import { Clock, clockLabel, type ClockTime } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, customStep, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { tellingTimeTest } from "./TellingTimeTest";

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function randomHour(): number {
  return randInt(1, 12);
}

// ============================================================================
// SET-THE-HANDS WIDGET — a CustomStep (shared/engine/types.ts's escape hatch
// for a whole pre-built, self-validating interaction): the student drags the
// SAME draggable Clock used in Explore until it matches `target`, and this
// widget alone decides when to call onDone (never automatically on drag —
// only once the student clicks "Check hands" AND it's actually right, so a
// lucky mid-drag pass-through can't silently complete the step).
// ============================================================================

function SetClockHandsStep({ target, onDone }: { target: ClockTime; onDone: () => void }) {
  // Starts deliberately wrong (shifted away from the target) so clicking
  // Check immediately can't pass by accident.
  const start: ClockTime = { hour: target.hour === 12 ? 1 : target.hour + 1, half: !target.half };
  const [time, setTime] = useState<ClockTime>(start);
  const [checked, setChecked] = useState(false);
  const ok = time.hour === target.hour && time.half === target.half;

  return (
    <div className="clock-set-stage">
      <Clock time={time} onChange={setTime} tone="a" />
      <div className="control-row">
        <button
          className="btn primary"
          type="button"
          onClick={() => {
            setChecked(true);
            if (ok) onDone();
          }}
        >
          Check hands
        </button>
      </div>
      {checked && !ok && (
        <p className="feedback bad" role="alert">
          Not yet — drag the thick hour hand around the face until the clock shows {clockLabel(target)}.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Vocabulary: which hand is which. */
function WhichHandQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "short";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> A clock has two hands: a short one and a long one.
      </p>
      <Clock time={{ hour: 3, half: false }} tone="a" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which hand tells you the HOUR?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="short">The short hand</option>
            <option value="long">The long hand, since it moves more</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the SHORT hand is the hour hand, and the LONG hand is the minute hand. It's easy to think the busier-looking long hand must be more important, but it's not the hour hand."
            : "Not quite — the SHORT hand is the hour hand. The long hand (the minute hand) moves more, but that doesn't make it the one that tells you the hour."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated concept: both "hour" and "minute" (and the number 6
 *  itself, read two different ways) live in this one question. */
function MinuteHandMeaningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "half";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> The long (minute) hand is pointing at the 6. Mateo says that means it's 6 o'clock.
      </p>
      <Clock time={{ hour: 4, half: true }} tone="b" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Is Mateo right?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="six">Yes — the minute hand points at 6, so it's 6 o'clock</option>
            <option value="half">No — the minute hand on 6 means "half past" the hour, not 6 o'clock. Only the HOUR hand pointing at a number tells you the hour</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the minute hand pointing at 6 always means \"half past\" the hour, never \"6 o'clock.\" Only the SHORT hour hand pointing at a number tells you the hour itself."
            : "Not quite — Mateo mixed up the two hands. The minute hand points at numbers too, but for the minute hand, 6 means \"half past\" the hour — not 6 o'clock. Only the hour hand tells you the hour."}
        </p>
      )}
    </div>
  );
}

/** REQUIRED: the half-hour hour-hand-position misconception, explicit — the
 *  hour hand sits visibly past the midpoint toward the next number. */
function HalfHourHourHandQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [whyPicked, setWhyPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const pickedOk = picked === "4";
  const whyOk = whyPicked === "stillWithin";
  const ok = pickedOk && whyOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Look closely at the hour hand below — it's sitting between the 4 and the 5, closer to the 5 than you might expect for "half past."
      </p>
      <Clock time={{ hour: 4, half: true }} tone="c" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What HOUR does this time belong to?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(pickedOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4">4 (it's 4:30)</option>
            <option value="5">5 (the hour hand looks closer to 5)</option>
          </select>
        </label>
        <label>
          How do you know, even though the hour hand looks closer to 5?{" "}
          <select className="answer" value={whyPicked} onChange={(e) => setWhyPicked(e.target.value)} style={fieldOk(whyOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="stillWithin">It hasn't reached 5 yet — at half past, the hour hand is always exactly halfway, so it's still in the 4 o'clock hour</option>
            <option value="closer">Whichever number it's closest to is the hour</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — at half past any hour, the hour hand always sits exactly halfway between that hour and the next one. It hasn't reached the next number yet, so the time is still 4:30, not 5:30."
            : "Not quite — at half past the hour, the hour hand is always exactly halfway to the next number — it hasn't gotten there yet. This is 4:30, not 5:30, even though the hour hand looks closer to 5."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap restating the same misconception as a
 *  general rule. */
function ClosestNumberTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: whenever the hour hand is sitting between two numbers, you should read it as the LATER number, since that's the one
        it's closest to.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — at half past, the hour hand always reads as the EARLIER number, the hour it's still within, not the one it's approaching."
            : "Not quite — remember 4:30: the hour hand looks closer to 5, but the time is still read as 4, the hour it hasn't finished yet."}
        </p>
      )}
    </div>
  );
}

function TimeCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ hands: false, minuteMeaning: false, halfHour: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure reading a clock makes sense before you try practice problems.</p>
      <WhichHandQuestion onComplete={mark("hands")} />
      <MinuteHandMeaningQuestion onComplete={mark("minuteMeaning")} />
      <HalfHourHourHandQuestion onComplete={mark("halfHour")} />
      <ClosestNumberTrapQuestion onComplete={mark("trap")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [time, setTime] = useState<ClockTime>({ hour: 12, half: false });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button
          type="button"
          className="btn ghost"
          style={{ width: "fit-content", ...(showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
          onClick={() => setShowCheck((v) => !v)}
        >
          Check for Understanding
        </button>
      )}
      {(introActive || showCheck) && <TimeCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">Drag the thick hour hand all the way around the clock face.</p>
      <Clock time={time} onChange={setTime} tone="a" />
      <p className="feedback good" style={{ minHeight: 24 }}>
        This clock shows <b>{clockLabel(time)}</b>
        {time.half ? " — half past the hour. Notice the minute hand points at 6, and the hour hand sits exactly halfway to the next number." : " — exactly on the hour. Notice the minute hand points straight up at 12."}
      </p>
      <p className="muted small">
        Drag slowly past each half-hour position and watch the hour hand creep toward the next number without ever quite reaching it — that's the
        half-past position.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "exactHour" | "exactHalfHour" | "matchHour" | "matchHalfHour";
const BUCKETS: Bucket[] = ["exactHour", "exactHalfHour", "matchHour", "matchHalfHour"];

function readClockProblem(half: boolean): Problem {
  const hour = randomHour();
  const t: ClockTime = { hour, half };
  const bucket: Bucket = half ? "exactHalfHour" : "exactHour";
  const steps: Problem["steps"] = [
    {
      kind: "ratio",
      prompt: "What time does this clock show?",
      hint: half ? "The minute hand on 6 means half past — write the EARLIER hour, the one the hour hand hasn't finished yet." : "The minute hand points straight up at 12 for an exact hour.",
      explain: `This clock shows ${clockLabel(t)}.`,
      answer: [hour, half ? 30 : 0],
      labels: ["hour", "minutes"],
      frame: ["", " : ", ""],
      tones: "none",
    },
  ];
  if (half) {
    const nextHour = hour === 12 ? 1 : hour + 1;
    steps.push(
      choice(
        {
          prompt: `Even though the hour hand looks closer to ${nextHour}, is this time still inside the ${hour} o'clock hour, or has it already become the ${nextHour} o'clock hour?`,
          hint: "At half past, the hour hand is always exactly halfway — it hasn't reached the next number yet.",
          explain: `It's still the ${hour} o'clock hour — the hour hand hasn't reached ${nextHour} yet.`,
        },
        `Still the ${hour} o'clock hour`,
        [`Already the ${nextHour} o'clock hour`]
      )
    );
  } else {
    steps.push(
      choice(
        { prompt: "Where does the minute hand point for an exact o'clock time like this?", hint: "Look at the long hand.", explain: "For an exact hour, the minute hand always points straight up at 12." },
        "Straight up at 12",
        ["At 6", "At the same number as the hour hand"]
      )
    );
  }
  return {
    title: half ? "Read the clock — half hour" : "Read the clock — o'clock",
    bucket,
    story: "Read the analog clock below.",
    visual: () => <Clock time={t} tone={half ? "c" : "a"} />,
    steps,
    wrapUp: `This clock shows ${clockLabel(t)}.`,
  };
}

function matchClockProblem(half: boolean): Problem {
  const hour = randomHour();
  const t: ClockTime = { hour, half };
  const bucket: Bucket = half ? "matchHalfHour" : "matchHour";
  return {
    title: half ? "Set the hands — half hour" : "Set the hands — o'clock",
    bucket,
    story: `The digital time is ${clockLabel(t)}. Set the analog clock's hands to match.`,
    // The diagram panel shows the DIGITAL time only — the interactive
    // analog clock the student actually drags lives inside the CustomStep
    // widget below (SetClockHandsStep), not here. Showing the correctly-set
    // analog hands in this panel too would hand the answer straight to the
    // student before they ever touch the widget.
    visual: () => (
      <div className="digital-display" aria-label={`Digital time ${clockLabel(t)}`}>
        {clockLabel(t)}
      </div>
    ),
    steps: [
      choice(
        { prompt: "Which hand do you move to show the hour — the short hand or the long hand?", hint: "The short hand points to (or between) the numbers that show the hour.", explain: "The short hand is the hour hand." },
        "The short hand",
        ["The long hand"]
      ),
      customStep(
        {
          prompt: `Drag the hour hand until the clock shows ${clockLabel(t)}.`,
          hint: half ? "Half past means the hour hand sits exactly halfway between two numbers, and the minute hand goes to 6." : "An exact hour means the hour hand points right at the number, and the minute hand goes to 12.",
          explain: `The hour hand goes to ${half ? `halfway between ${hour} and ${hour === 12 ? 1 : hour + 1}` : hour}, and the minute hand goes to ${half ? 6 : 12}.`,
        },
        (onDone) => <SetClockHandsStep target={t} onDone={onDone} />,
        clockLabel(t)
      ),
    ],
    wrapUp: `${clockLabel(t)} — the hour hand ${half ? `sits halfway between ${hour} and ${hour === 12 ? 1 : hour + 1}` : `points right at ${hour}`}, and the minute hand points at ${half ? 6 : 12}.`,
  };
}

function timeProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "exactHour") return readClockProblem(false);
  if (bucket === "exactHalfHour") return readClockProblem(true);
  if (bucket === "matchHour") return matchClockProblem(false);
  return matchClockProblem(true);
}

export const tellingTime: Unit = {
  id: "tellingTime",
  title: "Telling and Writing Time",
  goal: "Read a clock and tell time to the hour and half-hour, on both an analog clock face and in digital form, and match the two.",
  standard: "1.MD.3",
  keyIdea: (
    <>
      <p>The SHORT hand is the hour hand; the LONG hand is the minute hand. Minute hand on 12 means :00; minute hand on 6 means :30.</p>
      <p>At half past the hour, the hour hand sits exactly halfway between two numbers — read it as the EARLIER hour, not the one it's approaching.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // This convention (which hand is which, what 12 vs 6 mean on the minute
  // hand, and the half-hour hour-hand rule) is meant to be memorized for the
  // long term, not re-derived — periodically re-gate Practice to confirm it
  // stuck, same convention/value as every other long-term-memorized-fact
  // unit in this app (Conversions, CountingTo120, MakingTen, ...).
  reintroEverySolved: 20,
  problems: [{ label: "Read & Set the Clock", make: timeProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: tellingTimeTest,
};
