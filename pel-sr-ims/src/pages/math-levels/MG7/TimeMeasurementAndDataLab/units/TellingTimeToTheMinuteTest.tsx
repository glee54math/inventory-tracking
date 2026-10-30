import { useState } from "react";
import { Clock, clockLabel, type ClockTime } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, customStep, type TestQuestion } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Telling and Writing Time to the Minute ----------
// 10 single-question generators, self-contained (not imported from
// TellingTimeToTheMinute.tsx — see that unit's own file for why: avoiding a
// circular import between a unit and its Test file).

function randomHour(): number {
  return randInt(1, 12);
}
function nextHourOf(hour: number): number {
  return hour === 12 ? 1 : hour + 1;
}
function randomFiveMark(): number {
  return randInt(1, 11) * 5;
}
function randomOffMark(): number {
  let m = randInt(1, 59);
  while (m % 5 === 0) m = randInt(1, 59);
  return m;
}
function randomNearHourMinute(): number {
  return randInt(56, 59);
}

/** Reused by this test's matching questions — duplicated verbatim from
 *  TellingTimeToTheMinute.tsx's own widget, same intentional-duplication
 *  convention as every other *Test.tsx file in this app. */
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

/** Reading a 5-minute-mark time. Distractors: the +5/-5 neighboring marks. */
export const fiveMarkReadQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const hour = randomHour();
  const minute = randomFiveMark();
  const t: ClockTime = { hour, minute };
  return [
    {
      visual: <Clock time={t} tone="a" />,
      difficulty,
      step: choice(
        { prompt: "What time does this clock show?", hint: "Multiply the number the minute hand points to by 5.", explain: `This clock shows ${clockLabel(t)}.` },
        clockLabel(t),
        [clockLabel({ hour, minute: (minute + 5) % 60 }), clockLabel({ hour, minute: ((minute - 5 + 60) % 60) })]
      ),
    },
  ];
};

/** Reading an off-5-mark time (counting by ones). Distractor rounds UP to
 *  the next 5-mark instead of starting from the mark already passed. */
export const offMarkReadQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const hour = randomHour();
  const minute = randomOffMark();
  const t: ClockTime = { hour, minute };
  const nearestMark = Math.floor(minute / 5) * 5;
  const nextMark = nearestMark + 5;
  return [
    {
      visual: <Clock time={t} tone="b" />,
      difficulty,
      step: choice(
        {
          prompt: "What time does this clock show?",
          hint: "Find the 5-minute mark the hand already passed, then count up by ones.",
          explain: `This clock shows ${clockLabel(t)} — the minute hand passed the ${nearestMark}-minute mark, then went ${minute - nearestMark} more ones.`,
        },
        clockLabel(t),
        [
          // rounded UP to the next 5-minute mark (":60" rolls to the next hour's ":00")
          clockLabel(nextMark === 60 ? { hour: nextHourOf(hour), minute: 0 } : { hour, minute: nextMark }),
          clockLabel({ hour, minute: nearestMark }), // stopped at the passed mark, didn't count the ones
        ]
      ),
    },
  ];
};

/** Reading a near-the-hour time. Distractor #1 targets the named
 *  misconception directly: reading the hour as the LATER hour it looks
 *  close to. */
export const nearHourReadQuestion = (difficulty: "hard"): TestQuestion[] => {
  const hour = randomHour();
  const minute = randomNearHourMinute();
  const t: ClockTime = { hour, minute };
  const nextHour = nextHourOf(hour);
  return [
    {
      visual: <Clock time={t} tone="c" />,
      difficulty,
      step: choice(
        {
          prompt: "What time does this clock show?",
          hint: "The hour hand looks close to the next number, but the hour only changes once the minute hand reaches 12.",
          explain: `This clock shows ${clockLabel(t)} — the minute hand hasn't reached 12 yet, so the hour hasn't changed to ${nextHour}.`,
        },
        clockLabel(t),
        [clockLabel({ hour: nextHour, minute }), clockLabel({ hour, minute: minute - 50 })]
      ),
    },
  ];
};

/** Digital given, set hour + minute hands — a CustomStep widget, same as
 *  Practice's matching bucket. */
export const matchHandsQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const hour = randomHour();
  const minute = randInt(1, 59);
  const t: ClockTime = { hour, minute };
  return [
    {
      visual: null,
      difficulty,
      step: customStep(
        {
          prompt: `The digital time is ${clockLabel(t)}. Set the hour, then drag the minute hand until the clock matches.`,
          hint: "Use the Hour stepper for the hour, then drag the long minute hand to the exact minute.",
          explain: `The hour is set to ${hour}, and the minute hand goes to ${minute}.`,
        },
        (onDone) => <SetClockHandsStep target={t} onDone={onDone} />,
        clockLabel(t)
      ),
    },
  ];
};

export const tellingTimeToTheMinuteTest: Unit["test"] = {
  questions: [
    () => fiveMarkReadQuestion("easy"),
    () => fiveMarkReadQuestion("medium"),
    () => offMarkReadQuestion("medium"),
    () => offMarkReadQuestion("medium"),
    () => offMarkReadQuestion("hard"),
    () => nearHourReadQuestion("hard"),
    () => nearHourReadQuestion("hard"),
    () => nearHourReadQuestion("hard"),
    () => matchHandsQuestion("medium"),
    () => matchHandsQuestion("hard"),
  ],
  passScore: 9,
};
