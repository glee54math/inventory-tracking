import { pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { ALL_FRAMINGS, actionText, answerWithUnit, remainderCase, type Framing, type RemainderOpts } from "./remainderScenarios";

// ---------- end-of-unit test: Interpreting Remainders ----------
// Self-contained with respect to InterpretingRemainders.tsx (imports only the
// leaf module remainderScenarios.ts). 10 questions, passScore 9, typed
// answers and choices only.

const EXPLAIN: Record<Framing, string> = {
  full: "Only FULL groups count, so drop the remainder.",
  needed: "The leftover ones still need a spot, so add one more group.",
  left: "The question asks what's left over — that's the remainder.",
};

function framingNumber(f: Framing, difficulty: TestQuestion["difficulty"], opts: RemainderOpts = {}): TestQuestion[] {
  const c = remainderCase(opts);
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `${c.ctx.setup(c.n, c.d)} ${c.ctx.q[f]}`,
        hint: `Divide first: ${c.n} ÷ ${c.d}. Then read the question again — what does it want?`,
        explain: `${c.n} ÷ ${c.d} = ${c.q} R ${c.r}. ${EXPLAIN[f]} Answer: ${answerWithUnit(c, f)}.`,
        answer: c.answer[f],
      },
    },
  ];
}

export const discardQuestion = (opts: RemainderOpts = {}) => framingNumber("full", "easy", opts);
export const roundUpQuestion = (opts: RemainderOpts = {}) => framingNumber("needed", "medium", opts);
export const leftoverQuestion = (opts: RemainderOpts = {}) => framingNumber("left", "medium", opts);
/** Remainder exactly 1, 3-digit dividend: even ONE left over needs another group. */
export const roundUpHardQuestion = () => framingNumber("needed", "hard", { rOne: true, big: true });

export function quotientRemainderQuestion(opts: RemainderOpts = { big: true }): TestQuestion[] {
  const c = remainderCase(opts);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "ratio",
        prompt: `Divide: ${c.n} ÷ ${c.d}. Write the quotient and the remainder.`,
        hint: `How many ${c.d}s fit into ${c.n}? What's left?`,
        explain: `${c.d} × ${c.q} = ${c.d * c.q}, and ${c.n} − ${c.d * c.q} = ${c.r}, so ${c.n} ÷ ${c.d} = ${c.q} R ${c.r}.`,
        answer: [c.q, c.r],
        labels: ["quotient", "remainder"],
        tones: "none",
        frame: [`${c.n} ÷ ${c.d} =`, "R", ""],
      },
    },
  ];
}

export function whatToDoQuestion(framing?: Framing): TestQuestion[] {
  const f = framing ?? pick(ALL_FRAMINGS);
  const c = remainderCase();
  const acts = actionText(c);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${c.ctx.setup(c.n, c.d)} ${c.ctx.q[f]} (${c.n} ÷ ${c.d} = ${c.q} R ${c.r}.) What should you do with the remainder?`,
          hint: "Read the question's last words: full groups? groups needed? left over?",
          explain: `${EXPLAIN[f]} Answer: ${answerWithUnit(c, f)}.`,
        },
        acts[f],
        // Misconception: applying one fixed remainder rule (usually "always drop it") whatever the question asks.
        ALL_FRAMINGS.filter((g) => g !== f).map((g) => acts[g])
      ),
    },
  ];
}

export function roundUpTrapQuestion(): TestQuestion[] {
  const c = remainderCase();
  const [one, many] = c.ctx.group;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${c.ctx.setup(c.n, c.d)} ${c.ctx.q.needed}`,
          hint: `${c.n} ÷ ${c.d} = ${c.q} R ${c.r}. Do the ${c.r} left over still need a spot?`,
          explain: `${c.q} full ${many} hold ${c.q * c.d}; the other ${c.r} still need one more, so ${c.q + 1} ${many}.`,
        },
        `${c.q + 1} ${many}`,
        [
          // Misconception: always dropping the remainder (the most common default error).
          `${c.q} ${many}`,
          // Misconception: answering with the remainder instead of a number of groups.
          `${c.r} ${c.r === 1 ? one : many}`,
          // Misconception: giving the raw division result without interpreting it.
          `${c.q} R ${c.r} ${many}`,
        ]
      ),
    },
  ];
}

export function discardTrapQuestion(): TestQuestion[] {
  const c = remainderCase();
  const [one, many] = c.ctx.group;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${c.ctx.setup(c.n, c.d)} ${c.ctx.q.full}`,
          hint: `${c.n} ÷ ${c.d} = ${c.q} R ${c.r}. Is the last group full?`,
          explain: `Only ${c.q} ${many} are completely full; the ${c.r} left over don't fill another.`,
        },
        `${c.q} ${many}`,
        [
          // Misconception: over-correcting — rounding up when only FULL groups count.
          `${c.q + 1} ${many}`,
          // Misconception: answering with the remainder.
          `${c.r} ${c.r === 1 ? one : many}`,
        ]
      ),
    },
  ];
}

export function remainderMeaningQuestion(): TestQuestion[] {
  const c = remainderCase();
  const [one, many] = c.ctx.group;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${c.ctx.setup(c.n, c.d)} ${c.n} ÷ ${c.d} = ${c.q} R ${c.r}. What does the ${c.r} mean in this story?`,
          hint: "The remainder is what's left after making equal groups.",
          explain: `The remainder ${c.r} is ${c.r} ${c.ctx.item} that don't fill a whole ${one}.`,
        },
        `${c.r} ${c.ctx.item} that don't fill a whole ${one}`,
        [
          // Misconception: mixing up the units — reading the remainder as a number of groups.
          c.r === 1 ? `1 more ${one} is needed` : `${c.r} more ${many} are needed`,
          // Misconception: confusing the remainder with the group size.
          `${c.r} ${c.ctx.item} go in each ${one}`,
        ]
      ),
    },
  ];
}

export function whichQuestionAddsOneQuestion(): TestQuestion[] {
  const c = remainderCase();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${c.ctx.setup(c.n, c.d)} (${c.n} ÷ ${c.d} = ${c.q} R ${c.r}.) Which question's answer is ${c.q + 1}, one MORE than the quotient?`,
          hint: "Which question needs room for the leftover ones too?",
          explain: `"${c.ctx.q.needed}" — the ${c.r} left over still need a spot, so ${c.q} + 1 = ${c.q + 1}.`,
        },
        c.ctx.q.needed,
        [
          // Misconception: "full groups" also rounds up.
          c.ctx.q.full,
          // Misconception: the "left over" question uses the quotient at all.
          c.ctx.q.left,
        ]
      ),
    },
  ];
}

export const interpretingRemaindersTest: Unit["test"] = {
  questions: [
    () => discardQuestion(),
    () => roundUpQuestion(),
    () => leftoverQuestion(),
    () => quotientRemainderQuestion(),
    () => whatToDoQuestion(),
    roundUpTrapQuestion,
    discardTrapQuestion,
    remainderMeaningQuestion,
    roundUpHardQuestion,
    whichQuestionAddsOneQuestion,
  ],
  passScore: 9,
};
