import { useState } from "react";
import { Clock, clockLabel, type ClockTime } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, customStep, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Telling and Writing Time ----------
// 10 single-question generators, self-contained (not imported from
// TellingTime.tsx). Exported individually so ModuleTest.tsx can draw a
// cumulative sample from this unit's own question shapes.

function randomHour(): number {
  return randInt(1, 12);
}

/** Reused by both Practice's matching bucket (TellingTime.tsx) and this
 *  test's own matching questions — duplicated verbatim rather than imported,
 *  same intentional-duplication convention as every other *Test.tsx file in
 *  this app (each test file is independent of its unit's Explore/Practice
 *  source, so neither can break the other). */
function SetClockHandsStep({ target, onDone }: { target: ClockTime; onDone: () => void }) {
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
          Not yet — drag the thick hour hand until the clock shows {clockLabel(target)}.
        </p>
      )}
    </div>
  );
}

/** Reading an exact hour. Distractors: the half-hour of the same hour, and
 *  an adjacent wrong hour — never the half-hour-hand-position misconception
 *  (that's not possible when the minute hand is plainly on 12). */
export const exactHourReadQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const hour = randomHour();
  const t: ClockTime = { hour, half: false };
  const wrongHour = ((hour + randInt(1, 3) - 1) % 12) + 1;
  return [
    {
      visual: <Clock time={t} tone="a" />,
      difficulty,
      step: choice(
        { prompt: "What time does this clock show?", hint: "The minute hand points straight up at 12 for an exact hour.", explain: `This clock shows ${clockLabel(t)}.` },
        clockLabel(t),
        [clockLabel({ hour, half: true }), clockLabel({ hour: wrongHour, half: false })]
      ),
    },
  ];
};

/** Reading a half hour. Distractor #1 targets the named misconception
 *  directly: reading the hour hand as the LATER hour it's approaching. */
export const exactHalfHourReadQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const hour = randomHour();
  const t: ClockTime = { hour, half: true };
  const nextHour = hour === 12 ? 1 : hour + 1;
  return [
    {
      visual: <Clock time={t} tone="c" />,
      difficulty,
      step: choice(
        {
          prompt: "What time does this clock show?",
          hint: "At half past, the hour hand is exactly halfway between two numbers — read it as the EARLIER one, the hour it hasn't finished yet.",
          explain: `This clock shows ${clockLabel(t)} — the hour hand hasn't reached ${nextHour} yet, even though it's close.`,
        },
        clockLabel(t),
        [clockLabel({ hour: nextHour, half: true }), clockLabel({ hour, half: false })]
      ),
    },
  ];
};

/** Digital given, set the analog hands — a CustomStep widget, same as
 *  Practice's matching bucket (see TellingTime.tsx's matchClockProblem). */
export const matchHandsQuestion = (half: boolean): TestQuestion[] => {
  const hour = randomHour();
  const t: ClockTime = { hour, half };
  return [
    {
      visual: null,
      difficulty: half ? "hard" : "medium",
      step: customStep(
        {
          prompt: `The digital time is ${clockLabel(t)}. Drag the hour hand until the clock matches.`,
          hint: half ? "Half past: the hour hand sits exactly halfway between two numbers, and the minute hand goes to 6." : "An exact hour: the hour hand points right at the number, and the minute hand goes to 12.",
          explain: `The hour hand goes to ${half ? `halfway between ${hour} and ${hour === 12 ? 1 : hour + 1}` : hour}, and the minute hand goes to ${half ? 6 : 12}.`,
        },
        (onDone) => <SetClockHandsStep target={t} onDone={onDone} />,
        clockLabel(t)
      ),
    },
  ];
};

export const tellingTimeTest: Unit["test"] = {
  questions: [
    () => exactHourReadQuestion("easy"),
    () => exactHourReadQuestion("easy"),
    () => exactHourReadQuestion("medium"),
    () => exactHalfHourReadQuestion("medium"),
    () => exactHalfHourReadQuestion("hard"),
    () => exactHalfHourReadQuestion("hard"),
    () => matchHandsQuestion(false),
    () => matchHandsQuestion(false),
    () => matchHandsQuestion(true),
    () => matchHandsQuestion(true),
  ],
  passScore: 9,
};
