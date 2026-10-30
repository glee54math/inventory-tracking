import { ClockG2, clockLabelG2, type ClockTimeG2 } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Telling Time to 5 Minutes ----------
// Self-contained (no import from TellingTime5Min.tsx).

function randomHour(): number {
  return randInt(1, 12);
}

function fiveMinMinute(): number {
  return randInt(0, 11) * 5;
}

export const exactFiveMinQuestion = (difficulty: "easy" | "medium" = "easy"): TestQuestion[] => {
  const hour = randomHour();
  const minute = fiveMinMinute();
  const t: ClockTimeG2 = { hour, minute };
  return [
    {
      visual: <ClockG2 time={t} tone="a" />,
      difficulty,
      step: {
        kind: "ratio",
        prompt: "What time does this clock show?",
        hint: "Read the hour hand first, then count the minute hand's 5-minute marks.",
        explain: `This clock shows ${clockLabelG2(t)}.`,
        answer: [hour, minute],
        labels: ["hour", "minutes"],
        frame: ["", " : ", ""],
        tones: "none",
      },
    },
  ];
};

/** THE core misconception, isolated as a choice question. */
export const hourHandBetweenQuestion = (): TestQuestion[] => {
  const hour = randomHour();
  const minute = [40, 45, 50, 55][randInt(0, 3)];
  const t: ClockTimeG2 = { hour, minute };
  const nextHour = hour === 12 ? 1 : hour + 1;
  return [
    {
      visual: <ClockG2 time={t} tone="b" />,
      difficulty: "hard",
      step: choice(
        { prompt: "The hour hand looks close to the next number. What time is it?", hint: "The hour hasn't changed until the hour hand actually reaches the next number.", explain: `This clock shows ${clockLabelG2(t)} — the hour hand hasn't reached ${nextHour} yet.` },
        clockLabelG2(t),
        [`${nextHour}:${String(minute).padStart(2, "0")}`]
      ),
    },
  ];
};

/** Same misconception, free-typed. */
export const hourHandBetweenTypedQuestion = (): TestQuestion[] => {
  const hour = randomHour();
  const minute = [40, 45, 50, 55][randInt(0, 3)];
  const t: ClockTimeG2 = { hour, minute };
  return [
    {
      visual: <ClockG2 time={t} tone="b" />,
      difficulty: "hard",
      step: {
        kind: "ratio",
        prompt: "The hour hand looks close to the next number. What time does this clock actually show?",
        hint: "The hour hasn't changed yet — it's still the earlier hour.",
        explain: `This clock shows ${clockLabelG2(t)}.`,
        answer: [hour, minute],
        labels: ["hour", "minutes"],
        frame: ["", " : ", ""],
        tones: "none",
      },
    },
  ];
};

const AMPM_CONTEXTS = [
  { text: "eating breakfast before school", correct: "am" as const },
  { text: "eating dinner with your family", correct: "pm" as const },
  { text: "getting ready for bed", correct: "pm" as const },
  { text: "walking into school at the start of the day", correct: "am" as const },
] as const;

export const amPmQuestion = (): TestQuestion[] => {
  const ctx = AMPM_CONTEXTS[randInt(0, AMPM_CONTEXTS.length - 1)];
  const correctLabel = ctx.correct === "am" ? "a.m. (morning)" : "p.m. (afternoon/evening)";
  const otherLabel = ctx.correct === "am" ? "p.m. (afternoon/evening)" : "a.m. (morning)";
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice({ prompt: `You are ${ctx.text}. Is this more likely a.m. or p.m.?`, hint: "Picture what time of day this usually happens.", explain: `${ctx.text} usually happens in the ${ctx.correct === "am" ? "morning (a.m.)" : "afternoon or evening (p.m.)"}.` }, correctLabel, [otherLabel]),
    },
  ];
};

export const timeFactQuestion = (which: "hour" | "halfHour"): TestQuestion[] => [
  {
    visual: null,
    difficulty: "easy",
    step: {
      kind: "number",
      prompt: which === "hour" ? "How many minutes are in one hour?" : "How many minutes are in half an hour?",
      hint: which === "hour" ? "This is a fact to know by heart." : "Half of 60.",
      explain: which === "hour" ? "One hour is 60 minutes." : "Half an hour is 30 minutes.",
      answer: which === "hour" ? 60 : 30,
      suffix: "min",
    },
  },
];

/** Same bounded-rollover logic as TellingTime5Min.tsx's own
 *  randomCrossHourElapsed — not every (startMinute, elapsed) combination
 *  actually crosses the hour, so elapsed is filtered to only the values
 *  guaranteed to roll over. Duplicated deliberately (never imported from
 *  the unit file). */
function randomCrossHourElapsed(): { startMinute: number; elapsed: number; totalMinutes: number } {
  const startMinute = [45, 50, 55][randInt(0, 2)];
  const validElapsed = [10, 15, 20].filter((e) => startMinute + e >= 60);
  const elapsed = validElapsed[randInt(0, validElapsed.length - 1)];
  return { startMinute, elapsed, totalMinutes: startMinute + elapsed };
}

export const elapsedTimeQuestion = (): TestQuestion[] => {
  const hour = randInt(1, 11);
  const { startMinute, elapsed, totalMinutes } = randomCrossHourElapsed();
  const endHour = hour === 12 ? 1 : hour + 1;
  const endMinute = totalMinutes % 60;
  const start: ClockTimeG2 = { hour, minute: startMinute };
  const end: ClockTimeG2 = { hour: endHour, minute: endMinute };
  return [
    {
      visual: <ClockG2 time={start} tone="a" />,
      difficulty: "hard",
      step: {
        kind: "ratio",
        prompt: `It is ${clockLabelG2(start)}. ${elapsed} minutes later, what time is it?`,
        hint: `${startMinute} + ${elapsed} = ${totalMinutes}, which rolls past 60 — the hour becomes ${endHour}, and the minutes are ${endMinute}.`,
        explain: `${clockLabelG2(start)} + ${elapsed} minutes = ${clockLabelG2(end)}.`,
        answer: [endHour, endMinute],
        labels: ["hour", "minutes"],
        frame: ["", " : ", ""],
        tones: "none",
      },
    },
  ];
};

/** Generalization / true-false trap. */
export const hourHandTrapQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "medium",
    step: choice(
      {
        prompt: "True or false: whenever the hour hand is very close to a number, the hour has already become that number.",
        hint: "Think about :50 — the hour hand looks close, but has it arrived?",
        explain: "False — the hour hand only reaches the next number once a full hour has passed.",
      },
      "False",
      ["True"]
    ),
  },
];

export const tellingTime5MinTest: Unit["test"] = {
  questions: [
    () => exactFiveMinQuestion("easy"),
    () => exactFiveMinQuestion("medium"),
    () => hourHandBetweenQuestion(),
    () => hourHandBetweenTypedQuestion(),
    () => hourHandTrapQuestion(),
    () => amPmQuestion(),
    () => amPmQuestion(),
    () => timeFactQuestion("hour"),
    () => timeFactQuestion("halfHour"),
    () => elapsedTimeQuestion(),
  ],
  passScore: 9,
};
