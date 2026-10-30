import { useEffect, useState } from "react";
import { Clock, clockLabel, type ClockTime } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, customStep, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { tellingTimeToTheMinuteTest } from "./TellingTimeToTheMinuteTest";

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function randomHour(): number {
  return randInt(1, 12);
}
function nextHourOf(hour: number): number {
  return hour === 12 ? 1 : hour + 1;
}
/** A minute that's a non-zero multiple of 5 — the "minute hand resting
 *  exactly on a 5-minute mark" bucket. */
function randomFiveMark(): number {
  return randInt(1, 11) * 5;
}
/** A minute that is NOT a multiple of 5 — requires counting by ones from
 *  the nearest 5-minute mark. */
function randomOffMark(): number {
  let m = randInt(1, 59);
  while (m % 5 === 0) m = randInt(1, 59);
  return m;
}
/** Minutes 56-59: the hour hand has crept visibly close to the NEXT
 *  number, the exact setup for the required near-the-hour misconception. */
function randomNearHourMinute(): number {
  return randInt(56, 59);
}

// ============================================================================
// SET-THE-HANDS WIDGET — a CustomStep: the student picks the hour with a
// Stepper and drags the SAME draggable Clock used in Explore to set the
// minute, until both match `target`. Only calling onDone once "Check hands"
// is clicked AND it's actually right, so a lucky mid-drag pass-through
// can't silently complete the step (same convention as MG3's clock widget).
// ============================================================================

function SetClockHandsStep({ target, onDone }: { target: ClockTime; onDone: () => void }) {
  const [time, setTime] = useState<ClockTime>({ hour: nextHourOf(target.hour), minute: (target.minute + 30) % 60 });
  const [checked, setChecked] = useState(false);
  const ok = time.hour === target.hour && time.minute === target.minute;

  return (
    <div className="clock-set-stage">
      <Stepper label="Hour" value={time.hour} min={1} max={12} onChange={(h) => setTime((t) => ({ ...t, hour: h }))} tone="a" />
      <Clock time={time} onChange={(t) => setTime(t)} tone="a" />
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
          Not yet — set the hour, then drag the long minute hand until the clock shows {clockLabel(target)}.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Vocabulary: a number the minute hand points to means 5x that many minutes. */
function MinuteNumberMeaningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "35";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> The long minute hand is pointing exactly at the number 7 on the clock face.
      </p>
      <Clock time={{ hour: 2, minute: 35 }} tone="a" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many minutes does that mean?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="7">7 minutes — that's the number it points to</option>
            <option value="35">35 minutes — each number is really 5 minutes, so multiply by 5</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — every number on the clock face stands for 5 minutes on the minute hand's trip around, so pointing at 7 means 7 × 5 = 35 minutes."
            : "Not quite — the minute hand's numbers are each worth 5 minutes, not 1. Pointing at 7 means 7 × 5 = 35 minutes."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated concept: counting by ones from the nearest 5-mark,
 *  in the correct DIRECTION (forward from the mark just passed). */
function CountByOnesQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "23";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> The minute hand has just passed the "4" (20 minutes) and is sitting 3 small ticks further around, not yet reaching the "5" (25
        minutes).
      </p>
      <Clock time={{ hour: 6, minute: 23 }} tone="b" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What minute is it?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="23">23 — 20, then count up 3 more ones: 21, 22, 23</option>
            <option value="25">25 — round up to the next 5-minute mark</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — start at the 5-minute mark the hand already passed (20), then count each small tick one at a time: 21, 22, 23."
            : "Not quite — the minute hand hasn't reached 25 yet. Start at the mark it already passed (20) and count up by ones: 21, 22, 23."}
        </p>
      )}
    </div>
  );
}

/** REQUIRED: the near-the-hour hour-hand misconception, explicit. */
function NearHourQuestion({ onComplete }: { onComplete?: () => void }) {
  const [whichHour, setWhichHour] = useState("");
  const [whyPicked, setWhyPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [whichHour, whyPicked].every((v) => String(v).trim() !== "");
  const hourOk = whichHour === "2";
  const whyOk = whyPicked === "notYet";
  const ok = hourOk && whyOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Look closely — the hour hand is sitting almost on top of the 3, but not quite.
      </p>
      <Clock time={{ hour: 2, minute: 58 }} tone="c" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What HOUR does this time belong to?{" "}
          <select className="answer" value={whichHour} onChange={(e) => setWhichHour(e.target.value)} style={fieldOk(hourOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="2">2 (it's 2:58)</option>
            <option value="3">3 (the hour hand looks like it's on the 3)</option>
          </select>
        </label>
        <label>
          How do you know?{" "}
          <select className="answer" value={whyPicked} onChange={(e) => setWhyPicked(e.target.value)} style={fieldOk(whyOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="notYet">The minute hand hasn't reached 12 yet, so the hour hasn't changed to 3</option>
            <option value="closer">Whichever number the hour hand looks closest to is the hour</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the hour only changes once the minute hand completes its full trip around to 12. At 2:58 the minute hand still has 2 minutes left, so it's still the 2 o'clock hour."
            : "Not quite — the hour hand creeps toward the next number all through the hour, but the hour itself doesn't change until the minute hand reaches 12. This is 2:58, not 3:58."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap restating the same misconception. */
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
        <b>4.</b> True or false: whenever the hour hand looks closer to the next number than to its own number, you should read it as that next,
        later hour.
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
            ? "Correct — the hour hand's exact position doesn't decide the hour. The hour only changes once the minute hand finishes its trip around to 12, no matter how close the hour hand looks to the next number."
            : "Not quite — remember 2:58. The hour hand looked almost on the 3, but the hour was still 2 because the minute hand hadn't reached 12 yet."}
        </p>
      )}
    </div>
  );
}

function TimeCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ numberMeaning: false, countByOnes: false, nearHour: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure reading minutes exactly makes sense before you try practice problems.</p>
      <MinuteNumberMeaningQuestion onComplete={mark("numberMeaning")} />
      <CountByOnesQuestion onComplete={mark("countByOnes")} />
      <NearHourQuestion onComplete={mark("nearHour")} />
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
  const [time, setTime] = useState<ClockTime>({ hour: 12, minute: 0 });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Hour" value={time.hour} min={1} max={12} onChange={(h) => setTime((t) => ({ ...t, hour: h }))} tone="a" />
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
      </div>
      {(introActive || showCheck) && <TimeCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">Drag the long minute hand all the way around. Watch each small tick change the minute by exactly 1.</p>
      <Clock time={time} onChange={(t) => setTime(t)} tone="a" />
      <p className="feedback good" style={{ minHeight: 24 }}>
        This clock shows <b>{clockLabel(time)}</b>
        {time.minute >= 56 || time.minute <= 4
          ? " — watch how the short hour hand sits almost on top of a number near the top or bottom of the hour, but the hour itself only changes right as the minute hand crosses 12."
          : " — notice the short hour hand creeps a little further around as the minute hand moves."}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "fiveMark" | "offMark" | "nearHour" | "twoWayTranslation";
const BUCKETS: Bucket[] = ["fiveMark", "offMark", "nearHour", "twoWayTranslation"];

function readClockProblem(bucket: "fiveMark" | "offMark" | "nearHour"): Problem {
  const hour = randomHour();
  const minute = bucket === "fiveMark" ? randomFiveMark() : bucket === "offMark" ? randomOffMark() : randomNearHourMinute();
  const t: ClockTime = { hour, minute };
  const steps: Problem["steps"] = [
    {
      kind: "ratio",
      prompt: "What time does this clock show?",
      hint:
        bucket === "fiveMark"
          ? "The minute hand is on a number — multiply that number by 5."
          : bucket === "offMark"
          ? "Find the 5-minute mark the minute hand already passed, then count up by ones."
          : "Read the HOUR hand carefully — has the minute hand reached 12 yet?",
      explain: `This clock shows ${clockLabel(t)}.`,
      answer: [hour, minute],
      labels: ["hour", "minutes"],
      frame: ["", " : ", ""],
      tones: "none",
    },
  ];
  if (bucket === "fiveMark") {
    const num = minute / 5;
    steps.push(
      {
        kind: "number",
        prompt: `The minute hand points at the number ${num}. How many minutes is that?`,
        hint: "Multiply the number by 5.",
        explain: `${num} × 5 = ${minute} minutes.`,
        answer: minute,
      }
    );
  } else if (bucket === "offMark") {
    const nearestMark = Math.floor(minute / 5) * 5;
    steps.push(
      choice(
        { prompt: "Which 5-minute mark had the minute hand already passed, before you counted up by ones?", hint: "Round DOWN to the mark it passed, not up to the one it's approaching.", explain: `It had already passed ${nearestMark} minutes.` },
        String(nearestMark),
        [String(nearestMark + 5)]
      )
    );
  } else {
    const nextHour = nextHourOf(hour);
    steps.push(
      choice(
        { prompt: `Even though the hour hand looks closer to ${nextHour}, is this still the ${hour} o'clock hour or already the ${nextHour} o'clock hour?`, hint: "The hour only changes once the minute hand reaches 12.", explain: `Still the ${hour} o'clock hour — the minute hand hasn't reached 12 yet.` },
        `Still the ${hour} o'clock hour`,
        [`Already the ${nextHour} o'clock hour`]
      )
    );
  }
  return {
    title: "Read the clock",
    bucket,
    story: "Read the analog clock below.",
    visual: () => <Clock time={t} tone={bucket === "nearHour" ? "c" : bucket === "offMark" ? "b" : "a"} />,
    steps,
    wrapUp: `This clock shows ${clockLabel(t)}.`,
  };
}

function matchClockProblem(): Problem {
  const hour = randomHour();
  const minute = randInt(1, 59);
  const t: ClockTime = { hour, minute };
  return {
    title: "Set the hands",
    bucket: "twoWayTranslation",
    story: `The digital time is ${clockLabel(t)}. Set the analog clock's hour and minute hands to match.`,
    visual: () => (
      <div className="digital-display" aria-label={`Digital time ${clockLabel(t)}`}>
        {clockLabel(t)}
      </div>
    ),
    steps: [
      customStep(
        {
          prompt: `Set the hour, then drag the minute hand until the clock shows ${clockLabel(t)}.`,
          hint: "Use the Hour stepper for the hour, then drag the long minute hand to the exact minute.",
          explain: `The hour is set to ${hour}, and the minute hand goes to ${minute}.`,
        },
        (onDone) => <SetClockHandsStep target={t} onDone={onDone} />,
        clockLabel(t)
      ),
    ],
    wrapUp: `${clockLabel(t)} — hour hand set to ${hour}, minute hand to ${minute}.`,
  };
}

function timeProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "twoWayTranslation") return matchClockProblem();
  return readClockProblem(bucket);
}

export const tellingTimeToTheMinute: Unit = {
  id: "tellingTimeToTheMinute",
  title: "Telling and Writing Time to the Minute",
  goal: "Read a clock's hour and minute hands together to tell and write the exact time, down to the minute.",
  standard: "3.MD.1",
  keyIdea: (
    <>
      <p>Every number on the minute hand's path is worth 5 minutes — multiply by 5, then count up by ones from there for the exact minute.</p>
      <p>The hour only changes once the minute hand finishes its full trip around to 12 — not whenever the hour hand merely LOOKS closer to the next number.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Read & Set the Clock", make: timeProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: tellingTimeToTheMinuteTest,
};
