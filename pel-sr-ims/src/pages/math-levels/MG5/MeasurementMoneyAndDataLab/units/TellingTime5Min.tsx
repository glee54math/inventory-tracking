import { useEffect, useState } from "react";
import { ClockG2, clockLabelG2, type ClockTimeG2 } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { tellingTime5MinTest } from "./TellingTime5MinTest";

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function randomHour(): number {
  return randInt(1, 12);
}

function fiveMinMinute(excludeZero = false): number {
  const options = Array.from({ length: 12 }, (_, i) => i * 5).filter((m) => !excludeZero || m !== 0);
  return options[randInt(0, options.length - 1)];
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "before";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What does "a.m." mean?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="before">Before noon (morning)</option>
          <option value="after">After noon (afternoon/evening)</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — a.m. is any time from midnight up to noon." : "Not quite — a.m. means morning, before noon. Afternoon and evening times use p.m."}
        </p>
      )}
    </div>
  );
}

/** THE core misconception: the hour hand sitting almost at the next number
 *  (e.g. :50) does NOT mean the hour has changed yet. */
function HourHandBetweenQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "3:50";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  const t: ClockTimeG2 = { hour: 3, minute: 50 };
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Look closely at the hour hand — it's sitting almost on the 4.
      </p>
      <ClockG2 time={t} tone="b" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What time is this?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4:50">4:50 — the hour hand is almost at the 4</option>
            <option value="3:50">3:50 — the hour hand hasn't reached the 4 yet</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the hour hand creeps toward the next number all through the hour, but it's still 3:50 until it actually REACHES the 4. Read the minute hand (almost all the way around, at 50) and keep the EARLIER hour."
            : "Not quite — the hour hand only LOOKS close to 4 because 50 minutes have passed. It hasn't reached the 4 yet, so the hour is still 3: this is 3:50, not 4:50."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap restating the same misconception. */
function HourHandTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: whenever the hour hand is very close to a number, the hour has already become that number.
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
            ? "Correct — remember 3:50: the hour hand looked almost at the 4, but the hour was still 3 until the hand actually reached it."
            : "Not quite — remember 3:50: the hour hand looked almost at the 4, but it hadn't REACHED the 4 yet, so the hour was still 3."}
        </p>
      )}
    </div>
  );
}

/** am/pm context-clue question. */
function AmPmQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "am";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> You're eating breakfast and getting ready for school.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Is it more likely a.m. or p.m.?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="am">a.m. — morning</option>
            <option value="pm">p.m. — afternoon/evening</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — breakfast and getting ready for school happen in the morning, a.m." : "Not quite — breakfast and getting ready for school happen in the morning, which is a.m."}
        </p>
      )}
    </div>
  );
}

function TimeCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, hourHand: false, trap: false, ampm: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure reading the clock to 5 minutes makes sense before you try practice.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <HourHandBetweenQuestion onComplete={mark("hourHand")} />
      <HourHandTrapQuestion onComplete={mark("trap")} />
      <AmPmQuestion onComplete={mark("ampm")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [time, setTime] = useState<ClockTimeG2>({ hour: 12, minute: 0 });

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

      <p className="muted small">Drag the thick hour hand slowly around the clock face and watch both hands move together.</p>
      <ClockG2 time={time} onChange={setTime} tone="a" />
      <p className="feedback good" style={{ minHeight: 24 }}>
        This clock shows <b>{clockLabelG2(time)}</b> — the minute hand sits on the {time.minute}-minute mark, and the hour hand has crept {Math.round((time.minute / 60) * 100)}% of the way toward the next hour.
      </p>
      <p className="muted small">Drag past :50 slowly — notice the hour hand gets VERY close to the next number but the hour doesn't change until it actually gets there.</p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "exactFiveMinMark" | "hourHandBetween" | "amPmContext" | "timeRelationships" | "elapsedTimeCrossHour";
const BUCKETS: Bucket[] = ["exactFiveMinMark", "hourHandBetween", "amPmContext", "timeRelationships", "elapsedTimeCrossHour"];

function readClockProblem(bucket: "exactFiveMinMark" | "hourHandBetween"): Problem {
  const hour = randomHour();
  // hourHandBetween specifically picks a minute where the hour hand visibly
  // creeps toward the next number (40-55) — the exact misconception trigger.
  const minute = bucket === "hourHandBetween" ? [40, 45, 50, 55][randInt(0, 3)] : fiveMinMinute();
  const t: ClockTimeG2 = { hour, minute };
  const nextHour = hour === 12 ? 1 : hour + 1;

  const steps: Problem["steps"] = [
    {
      kind: "ratio",
      prompt: "What time does this clock show?",
      hint: bucket === "hourHandBetween" ? `The hour hand looks close to ${nextHour}, but check: has it actually REACHED ${nextHour} yet?` : "Read the hour hand first, then count the minute hand's 5-minute marks.",
      explain: `This clock shows ${clockLabelG2(t)}.`,
      answer: [hour, minute],
      labels: ["hour", "minutes"],
      frame: ["", " : ", ""],
      tones: "none",
    },
  ];
  if (bucket === "hourHandBetween") {
    steps.push(
      choice(
        {
          prompt: `Even though the hour hand looks close to ${nextHour}, is the hour still ${hour}, or has it already become ${nextHour}?`,
          hint: "The hour doesn't change until the hour hand actually reaches the next number.",
          explain: `It's still the ${hour} o'clock hour — the hour hand hasn't reached ${nextHour} yet.`,
        },
        `Still the ${hour} o'clock hour`,
        [`Already the ${nextHour} o'clock hour`]
      )
    );
  }
  return {
    title: bucket === "hourHandBetween" ? "Read the clock — hour hand close to the next number" : "Read the clock",
    bucket,
    story: "Read the analog clock below to the nearest 5 minutes.",
    visual: () => <ClockG2 time={t} tone={bucket === "hourHandBetween" ? "b" : "a"} />,
    steps,
    wrapUp: `This clock shows ${clockLabelG2(t)}.`,
  };
}

const AMPM_CONTEXTS = [
  { text: "eating breakfast before school", correct: "am" as const },
  { text: "watching the sunrise", correct: "am" as const },
  { text: "eating dinner with your family", correct: "pm" as const },
  { text: "getting ready for bed", correct: "pm" as const },
  { text: "walking into school at the start of the day", correct: "am" as const },
  { text: "watching the sunset", correct: "pm" as const },
] as const;

function amPmProblem(): Problem {
  const ctx = AMPM_CONTEXTS[randInt(0, AMPM_CONTEXTS.length - 1)];
  const correctLabel = ctx.correct === "am" ? "a.m. (morning)" : "p.m. (afternoon/evening)";
  const otherLabel = ctx.correct === "am" ? "p.m. (afternoon/evening)" : "a.m. (morning)";
  return {
    title: "A.M. or P.M.?",
    bucket: "amPmContext",
    story: `You are ${ctx.text}.`,
    visual: () => (
      <div style={{ fontSize: 48, textAlign: "center" }} role="img" aria-label={ctx.text}>
        {ctx.correct === "am" ? "🌅" : "🌇"}
      </div>
    ),
    steps: [choice({ prompt: "Is this more likely a.m. or p.m.?", hint: "Picture what time of day this activity usually happens.", explain: `${ctx.text} usually happens in the ${ctx.correct === "am" ? "morning (a.m.)" : "afternoon or evening (p.m.)"}.` }, correctLabel, [otherLabel])],
    wrapUp: `${ctx.text} is usually ${correctLabel}.`,
  };
}

function timeRelationshipsProblem(): Problem {
  const askHalfHour = Math.random() < 0.5;
  return {
    title: "Time facts",
    bucket: "timeRelationships",
    story: askHalfHour ? "How many minutes are in HALF an hour?" : "How many minutes are in ONE hour?",
    visual: () => (
      <div className="digital-display" style={{ fontSize: 28 }}>
        {askHalfHour ? "½ hour = ? minutes" : "1 hour = ? minutes"}
      </div>
    ),
    steps: [
      {
        kind: "number",
        prompt: askHalfHour ? "How many minutes are in half an hour?" : "How many minutes are in one hour?",
        hint: askHalfHour ? "Half of 60." : "This is a fact to know by heart.",
        explain: askHalfHour ? "Half an hour is 30 minutes." : "One hour is 60 minutes.",
        answer: askHalfHour ? 30 : 60,
        suffix: "min",
      },
    ],
    wrapUp: askHalfHour ? "Half an hour is 30 minutes." : "One hour is 60 minutes.",
  };
}

/** Picks a start-minute/elapsed pair that ALWAYS actually crosses the hour
 *  mark — the whole point of this bucket. Not every (startMinute, elapsed)
 *  combination does (e.g. :40 + 10 minutes is still :50, no rollover), so
 *  elapsed is filtered down to only the values guaranteed to roll over from
 *  the chosen startMinute, rather than picked independently. */
function randomCrossHourElapsed(): { startMinute: number; elapsed: number; totalMinutes: number } {
  const startMinute = [45, 50, 55][randInt(0, 2)];
  const validElapsed = [10, 15, 20].filter((e) => startMinute + e >= 60);
  const elapsed = validElapsed[randInt(0, validElapsed.length - 1)];
  return { startMinute, elapsed, totalMinutes: startMinute + elapsed };
}

function elapsedTimeProblem(): Problem {
  const hour = randInt(1, 11);
  const { startMinute, elapsed, totalMinutes } = randomCrossHourElapsed();
  const endHour = hour === 12 ? 1 : hour + 1;
  const endMinute = totalMinutes % 60;
  const start: ClockTimeG2 = { hour, minute: startMinute };
  const end: ClockTimeG2 = { hour: endHour, minute: endMinute };
  return {
    title: "Elapsed time across the hour",
    bucket: "elapsedTimeCrossHour",
    story: `It is ${clockLabelG2(start)}. ${elapsed} minutes later, what time is it?`,
    visual: () => (
      <div className="control-row" style={{ justifyContent: "center" }}>
        <ClockG2 time={start} tone="a" />
        <span style={{ fontSize: 28, alignSelf: "center" }}>→ +{elapsed} min →</span>
        <ClockG2 time={end} tone="b" />
      </div>
    ),
    steps: [
      {
        kind: "ratio",
        prompt: `${elapsed} minutes after ${clockLabelG2(start)}, what time is it?`,
        hint: `${startMinute} + ${elapsed} = ${totalMinutes}, which is more than 60 — so the hour rolls over to ${endHour}, and the minutes are ${totalMinutes} − 60 = ${endMinute}.`,
        explain: `${clockLabelG2(start)} + ${elapsed} minutes = ${clockLabelG2(end)}.`,
        answer: [endHour, endMinute],
        labels: ["hour", "minutes"],
        frame: ["", " : ", ""],
        tones: "none",
      },
    ],
    wrapUp: `${clockLabelG2(start)} plus ${elapsed} minutes is ${clockLabelG2(end)} — crossing right over the hour mark.`,
  };
}

export const tellingTime5Min: Unit = {
  id: "tellingTime5Min",
  title: "Telling Time to 5 Minutes",
  goal: "Read a clock to the nearest 5 minutes, tell a.m. from p.m., and know how many minutes are in an hour.",
  standard: "2.MD.7",
  keyIdea: (
    <>
      <p>The hour hand creeps toward the next number all through the hour — it hasn't REACHED it until the hour actually changes.</p>
      <p>One hour is 60 minutes; half an hour is 30 minutes. These are facts to know by heart.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // The hour/minute hand convention and the 60/30-minute facts are meant to
  // be memorized for the long term, not re-derived — periodically re-gate
  // Practice, same convention as MG3's TellingTime and every other
  // memorized-fact unit in this app.
  reintroEverySolved: 20,
  problems: [
    { label: "Read the Clock", make: (b) => readClockProblem((b as Bucket) === "hourHandBetween" ? "hourHandBetween" : "exactFiveMinMark"), buckets: ["exactFiveMinMark", "hourHandBetween"] },
    { label: "A.M. or P.M.?", make: amPmProblem, buckets: ["amPmContext"] },
    { label: "Time Facts", make: timeRelationshipsProblem, buckets: ["timeRelationships"] },
    { label: "Elapsed Time", make: elapsedTimeProblem, buckets: ["elapsedTimeCrossHour"] },
  ],
  requiredBuckets: BUCKETS,
  test: tellingTime5MinTest,
};
