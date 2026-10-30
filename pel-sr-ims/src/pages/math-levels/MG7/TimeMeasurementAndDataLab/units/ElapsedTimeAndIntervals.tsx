import { useEffect, useState } from "react";
import { Clock, clockLabel, addMinutesToTime, elapsedMinutes, type ClockTime } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { elapsedTimeAndIntervalsTest } from "./ElapsedTimeAndIntervalsTest";

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function randomStart(): ClockTime {
  return { hour: randInt(1, 12), minute: randInt(0, 59) };
}
/** A start time guaranteed to have at least 5 minutes of "room" before the
 *  next hour — paired with noRolloverDuration below, so the two can never
 *  disagree about whether the generated duration actually fits. */
function randomStartWithRoom(): ClockTime {
  let start = randomStart();
  while (59 - start.minute < 5) start = randomStart();
  return start;
}
/** A duration that does NOT carry the minute hand past 60 from `start` —
 *  only ever called with a start from randomStartWithRoom above. */
function noRolloverDuration(start: ClockTime): number {
  const room = 59 - start.minute;
  return randInt(5, Math.min(room, 45));
}
/** A duration that DOES carry the minute hand past 60 from `start`, crossing
 *  at least one hour boundary (and, on this 12-hour dial, also standing in
 *  for a noon/midnight crossing — this lab doesn't model AM/PM separately,
 *  out of scope at Grade 3). */
function crossHourDuration(start: ClockTime): number {
  const toNextHour = 60 - start.minute;
  return toNextHour + randInt(1, 50);
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Vocabulary: elapsed time is a DURATION, not a clock reading. */
function ElapsedMeaningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "35";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Maya started reading at 3:15 and finished at 3:50.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How much time ELAPSED while she read?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="350">3:50 — the time she finished</option>
            <option value="35">35 minutes — the DIFFERENCE between when she started and finished</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — \"elapsed time\" always means how much time passed (a DURATION), never a clock reading itself. 3:50 minus 3:15 is 35 minutes."
            : "Not quite — 3:50 is just when she finished, not how long she took. Elapsed time is the DIFFERENCE: 3:50 minus 3:15 is 35 minutes."}
        </p>
      )}
    </div>
  );
}

/** REQUIRED: the base-10-subtraction-across-an-hour misconception, explicit. */
function BorrowMinutesQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "25";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Jamal needs the elapsed time from 2:50 to 3:15. He tries subtracting the minutes straight across — 15 minus 50 — and gets stuck
        because you can't take 50 away from 15.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What SHOULD Jamal do, and what's the real elapsed time?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="65">Just write "65" since that's 15 + 50 — 65 minutes elapsed</option>
            <option value="25">
              Borrow 60 minutes (ONE hour), not 100 — from 2:50 to 3:00 is 10 minutes, then 3:00 to 3:15 is 15 more: 25 minutes in all
            </option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — time isn't base-10, so you never borrow 100. An hour is 60 minutes: 10 minutes gets Jamal to 3:00, then 15 more gets him to 3:15 — 25 minutes total."
            : "Not quite — time is grouped in 60s, not 100s. Break the trip into two pieces instead: 2:50 to 3:00 is 10 minutes, then 3:00 to 3:15 is 15 more minutes — 25 minutes total."}
        </p>
      )}
    </div>
  );
}

/** The memorized fact this unit leans on every time. */
function HourFactQuestion({ onComplete }: { onComplete?: () => void }) {
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = typed.trim() === "60";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Fill in the blank: 1 hour = _____ minutes.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <input className="answer" inputMode="numeric" style={{ ...fieldOk(ok, checked), width: 70 }} value={typed} onChange={(e) => setTyped(e.target.value)} />
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 1 hour is always 60 minutes. Memorize this; you'll use it on every elapsed-time problem." : "Not quite — 1 hour is 60 minutes. This is worth memorizing cold; you'll use it on every elapsed-time problem."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap restating the borrowing misconception. */
function SubtractionTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: you can always find elapsed time by subtracting the hours and the minutes separately, no matter what the two
        times are.
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
            ? "Correct — that only works when the minutes don't need to cross an hour. Remember Jamal's 2:50-to-3:15 problem: once the minutes would go negative, you have to borrow 60, not just subtract straight across."
            : "Not quite — remember Jamal's 2:50-to-3:15 problem. Straight subtraction broke down there because it crossed an hour; you had to borrow 60 minutes instead."}
        </p>
      )}
    </div>
  );
}

function ElapsedCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ meaning: false, borrow: false, fact: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure elapsed time makes sense before you try practice problems.</p>
      <ElapsedMeaningQuestion onComplete={mark("meaning")} />
      <BorrowMinutesQuestion onComplete={mark("borrow")} />
      <HourFactQuestion onComplete={mark("fact")} />
      <SubtractionTrapQuestion onComplete={mark("trap")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [start, setStart] = useState<ClockTime>({ hour: 10, minute: 45 });
  const [addMin, setAddMin] = useState(30);
  const end = addMinutesToTime(start, addMin);
  const crossed = end.hour !== start.hour;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Start hour" value={start.hour} min={1} max={12} onChange={(h) => setStart((s) => ({ ...s, hour: h }))} tone="a" />
        <Stepper label="Start minute" value={start.minute} min={0} max={59} onChange={(m) => setStart((s) => ({ ...s, minute: m }))} tone="a" />
        <Stepper label="Minutes later" value={addMin} min={0} max={90} step={5} onChange={setAddMin} tone="b" />
        {!introActive && (
          <button
            type="button"
            className="btn ghost"
            style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined}
            onClick={() => setShowCheck((v) => !v)}
          >
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <ElapsedCheckForUnderstanding onComplete={onIntroDone} />}

      <div className="control-row">
        <Clock time={start} tone="a" />
        <Clock time={end} tone="b" />
      </div>
      <p className="feedback good" style={{ minHeight: 24 }}>
        Start at <b>{clockLabel(start)}</b>, add <b>{addMin}</b> minutes, and you land on <b>{clockLabel(end)}</b>.
        {crossed ? " Notice the hour changed partway through — the minutes rolled past 60 and carried into a new hour." : " The hour stayed the same this time."}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "endNoRollover" | "endCrossHour" | "elapsedNoRollover" | "elapsedCrossHour" | "startUnknown";
const BUCKETS: Bucket[] = ["endNoRollover", "endCrossHour", "elapsedNoRollover", "elapsedCrossHour", "startUnknown"];

function endTimeProblem(crossHour: boolean): Problem {
  const start = crossHour ? randomStart() : randomStartWithRoom();
  const duration = crossHour ? crossHourDuration(start) : noRolloverDuration(start);
  const end = addMinutesToTime(start, duration);
  const bucket: Bucket = crossHour ? "endCrossHour" : "endNoRollover";
  const steps: Problem["steps"] = [
    {
      kind: "ratio",
      prompt: `Start at ${clockLabel(start)}. If ${duration} minutes pass, what time will it be?`,
      hint: crossHour ? "Add minutes up to the next hour first, then add what's left." : "Just add the minutes onto the start time.",
      explain: `${clockLabel(start)} plus ${duration} minutes is ${clockLabel(end)}.`,
      answer: [end.hour, end.minute],
      labels: ["hour", "minutes"],
      frame: ["", " : ", ""],
      tones: "none",
    },
  ];
  if (crossHour) {
    steps.push(
      choice(
        { prompt: "Did the hour change along the way?", hint: "Check whether the minute hand had to pass 60.", explain: `Yes — it's now ${end.hour} o'clock, not ${start.hour} anymore.` },
        "Yes, the hour changed",
        ["No, the hour stayed the same"]
      )
    );
  }
  return {
    title: "Find the end time",
    bucket,
    story: "Figure out what time it will be.",
    visual: () => <Clock time={start} tone="a" />,
    steps,
    wrapUp: `${clockLabel(start)} + ${duration} minutes = ${clockLabel(end)}.`,
  };
}

function elapsedProblem(crossHour: boolean): Problem {
  const start = crossHour ? randomStart() : randomStartWithRoom();
  const duration = crossHour ? crossHourDuration(start) : noRolloverDuration(start);
  const end = addMinutesToTime(start, duration);
  const minutes = elapsedMinutes(start, end);
  const bucket: Bucket = crossHour ? "elapsedCrossHour" : "elapsedNoRollover";
  const steps: Problem["steps"] = [
    {
      kind: "number",
      prompt: `From ${clockLabel(start)} to ${clockLabel(end)}, how many minutes elapsed?`,
      hint: crossHour ? "Break it into two pieces: up to the next hour, then the rest." : "Just subtract the minutes.",
      explain: `${clockLabel(start)} to ${clockLabel(end)} is ${minutes} minutes.`,
      answer: minutes,
    },
  ];
  if (crossHour) {
    steps.push(
      choice(
        {
          prompt: "Straight subtraction (just the minute digits) would have gone negative here. What does that tell you?",
          hint: "A negative result is the signal you need to borrow an hour, not just subtract the digits.",
          explain: "It means you need to borrow 60 minutes (one full hour) rather than subtracting the minute digits straight across.",
        },
        "You need to borrow 60 minutes (one hour), not subtract straight across",
        ["You made a mistake and should just use 0 minutes"]
      )
    );
  }
  return {
    title: "Find the elapsed time",
    bucket,
    story: "Figure out how much time passed.",
    visual: () => (
      <div className="control-row">
        <Clock time={start} tone="a" />
        <Clock time={end} tone="b" />
      </div>
    ),
    steps,
    wrapUp: `${clockLabel(start)} to ${clockLabel(end)} is ${minutes} minutes.`,
  };
}

function startUnknownProblem(): Problem {
  const trueStart = randomStart();
  const duration = randInt(10, 80);
  const end = addMinutesToTime(trueStart, duration);
  return {
    title: "Find the start time",
    bucket: "startUnknown",
    story: `A trip ended at ${clockLabel(end)} and took ${duration} minutes. When did it start?`,
    visual: () => <Clock time={end} tone="b" />,
    steps: [
      choice(
        { prompt: "Since you know the END time and the duration, do you ADD or SUBTRACT the duration to find the START time?", hint: "The start happened BEFORE the end.", explain: "Subtract — the start time is earlier, so you work backward from the end." },
        "Subtract the duration from the end time",
        ["Add the duration to the end time"]
      ),
      {
        kind: "ratio",
        prompt: `What time did the trip start?`,
        hint: "Count backward from the end time by the duration.",
        explain: `${clockLabel(end)} minus ${duration} minutes is ${clockLabel(trueStart)}.`,
        answer: [trueStart.hour, trueStart.minute],
        labels: ["hour", "minutes"],
        frame: ["", " : ", ""],
        tones: "none",
      },
    ],
    wrapUp: `The trip started at ${clockLabel(trueStart)}.`,
  };
}

function elapsedTimeProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "endNoRollover") return endTimeProblem(false);
  if (bucket === "endCrossHour") return endTimeProblem(true);
  if (bucket === "elapsedNoRollover") return elapsedProblem(false);
  if (bucket === "elapsedCrossHour") return elapsedProblem(true);
  return startUnknownProblem();
}

export const elapsedTimeAndIntervals: Unit = {
  id: "elapsedTimeAndIntervals",
  title: "Elapsed Time and Time-Interval Word Problems",
  goal: "Figure out an end time, a start time, or how much time passed, using addition and subtraction of minutes.",
  standard: "3.MD.1",
  keyIdea: (
    <>
      <p>1 hour = 60 minutes — memorize this. When minutes would go past 60 (or below 0), borrow or carry a whole hour, never 100.</p>
      <p>If you know the end time and a duration, SUBTRACT to find the start time — the start happened earlier, not later.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // 60 minutes = 1 hour is a fixed fact this unit leans on every time —
  // periodically re-surface the gate to confirm it stuck, not just a
  // one-time pass.
  reintroEverySolved: 20,
  problems: [{ label: "Elapsed Time", make: elapsedTimeProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: elapsedTimeAndIntervalsTest,
};
