import { Clock, clockLabel, addMinutesToTime, elapsedMinutes, type ClockTime } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Elapsed Time and Time-Interval Word Problems ----------
// 10 single-question generators, self-contained (not imported from
// ElapsedTimeAndIntervals.tsx).

function randomStart(): ClockTime {
  return { hour: randInt(1, 12), minute: randInt(0, 59) };
}
function randomStartWithRoom(): ClockTime {
  let start = randomStart();
  while (59 - start.minute < 5) start = randomStart();
  return start;
}
function noRolloverDuration(start: ClockTime): number {
  const room = 59 - start.minute;
  return randInt(5, Math.min(room, 45));
}
function crossHourDuration(start: ClockTime): number {
  const toNextHour = 60 - start.minute;
  return toNextHour + randInt(1, 50);
}

/** End time, no hour rollover. Distractor: a naive "just add the numbers"
 *  slip (adding straight onto the hour instead of the clock face). */
export const endTimeNoRolloverQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const start = randomStartWithRoom();
  const duration = noRolloverDuration(start);
  const end = addMinutesToTime(start, duration);
  return [
    {
      visual: <Clock time={start} tone="a" />,
      difficulty,
      step: choice(
        { prompt: `Start at ${clockLabel(start)}. If ${duration} minutes pass, what time will it be?`, hint: "Just add the minutes onto the start time.", explain: `${clockLabel(start)} + ${duration} minutes = ${clockLabel(end)}.` },
        clockLabel(end),
        [clockLabel(start), clockLabel({ hour: start.hour === 12 ? 1 : start.hour + 1, minute: end.minute })]
      ),
    },
  ];
};

/** End time, crossing an hour. Distractor targets forgetting to carry the
 *  hour forward. */
export const endTimeCrossHourQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const start = randomStart();
  const duration = crossHourDuration(start);
  const end = addMinutesToTime(start, duration);
  return [
    {
      visual: <Clock time={start} tone="a" />,
      difficulty,
      step: choice(
        {
          prompt: `Start at ${clockLabel(start)}. If ${duration} minutes pass, what time will it be?`,
          hint: "Add minutes up to the next hour first, then add what's left.",
          explain: `${clockLabel(start)} + ${duration} minutes = ${clockLabel(end)} — the hour had to roll forward.`,
        },
        clockLabel(end),
        [
          clockLabel({ hour: start.hour, minute: end.minute }), // forgot to carry into the next hour
          clockLabel({ hour: end.hour === 12 ? 1 : end.hour + 1, minute: end.minute }), // carried one hour too many
          // (Not `start` itself: it collides with the first distractor whenever end.minute === start.minute — caught by the brute-force check.)
        ]
      ),
    },
  ];
};

/** Elapsed duration, no hour rollover. */
export const elapsedNoRolloverQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const start = randomStartWithRoom();
  const duration = noRolloverDuration(start);
  const end = addMinutesToTime(start, duration);
  return [
    {
      visual: (
        <div className="control-row">
          <Clock time={start} tone="a" />
          <Clock time={end} tone="b" />
        </div>
      ),
      difficulty,
      step: {
        kind: "number",
        prompt: `From ${clockLabel(start)} to ${clockLabel(end)}, how many minutes elapsed?`,
        hint: "Just subtract the minutes.",
        explain: `${clockLabel(start)} to ${clockLabel(end)} is ${duration} minutes.`,
        answer: duration,
      },
    },
  ];
};

/** Elapsed duration, crossing an hour (and standing in for a noon/midnight
 *  crossing — see ElapsedTimeAndIntervals.tsx's own doc comment). The
 *  required "borrow 60, not 100" misconception is drilled in this unit's
 *  CFU, not re-tested here as a separate distractor (this is a free-typed
 *  number question, not multiple choice). */
export const elapsedCrossHourQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const start = randomStart();
  const duration = crossHourDuration(start);
  const end = addMinutesToTime(start, duration);
  const minutes = elapsedMinutes(start, end);
  return [
    {
      visual: (
        <div className="control-row">
          <Clock time={start} tone="a" />
          <Clock time={end} tone="b" />
        </div>
      ),
      difficulty,
      step: {
        kind: "number",
        prompt: `From ${clockLabel(start)} to ${clockLabel(end)}, how many minutes elapsed?`,
        hint: "Break it into two pieces: up to the next hour, then the rest.",
        explain: `${clockLabel(start)} to ${clockLabel(end)} is ${minutes} minutes.`,
        answer: minutes,
      },
    },
  ];
};

/** Start-unknown, the reverse-direction case. Distractor: adding the
 *  duration instead of subtracting it. */
export const startUnknownQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const trueStart = randomStart();
  const duration = randInt(10, 80);
  const end = addMinutesToTime(trueStart, duration);
  const wrongAdd = addMinutesToTime(end, duration);
  return [
    {
      visual: <Clock time={end} tone="b" />,
      difficulty,
      step: choice(
        {
          prompt: `A trip ended at ${clockLabel(end)} and took ${duration} minutes. When did it start?`,
          hint: "The start happened BEFORE the end — subtract the duration.",
          explain: `${clockLabel(end)} minus ${duration} minutes is ${clockLabel(trueStart)}.`,
        },
        clockLabel(trueStart),
        [clockLabel(wrongAdd)]
      ),
    },
  ];
};

export const elapsedTimeAndIntervalsTest: Unit["test"] = {
  questions: [
    () => endTimeNoRolloverQuestion("easy"),
    () => endTimeNoRolloverQuestion("medium"),
    () => endTimeCrossHourQuestion("medium"),
    () => endTimeCrossHourQuestion("hard"),
    () => elapsedNoRolloverQuestion("easy"),
    () => elapsedNoRolloverQuestion("medium"),
    () => elapsedCrossHourQuestion("medium"),
    () => elapsedCrossHourQuestion("hard"),
    () => startUnknownQuestion("medium"),
    () => startUnknownQuestion("hard"),
  ],
  passScore: 9,
};
