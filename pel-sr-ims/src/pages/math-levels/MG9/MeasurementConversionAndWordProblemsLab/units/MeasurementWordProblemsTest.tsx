import { ScaleLine } from "../diagrams";
import { fmt, pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { canUseDecimal, convById, fracQtyText, fracToSmall, leftoverSmall, wrongFactor, type FracQty } from "../lib/measures";
import { FRAC_IDS, SCALES, fracScenario, mixedScenario, sameUnitScenario, scaleScenario, type Op } from "../lib/wordProblems";

// ---------- end-of-unit test: Word Problems with Distance, Time, Volume & Mass ----------
// 10 questions. Scenario numbers/wording come from ../lib/wordProblems (a leaf
// module shared with Practice) — never from MeasurementWordProblems.tsx, which
// imports this file. Typed numbers and choices only (no CustomStep).

// Q1, Q2 — same-unit, one operation.
export function sameUnitQuestion(ops: Op[], difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const s = sameUnitScenario(pick(ops));
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "number",
          prompt: `${s.story} ${s.question}`,
          suffix: s.unit,
          hint: "Picture what's happening: put together, take away, equal groups, or sharing equally?",
          explain: s.op === "divide" || s.op === "multiply" ? `${fmt(s.a)} ${s.op === "divide" ? "÷" : "×"} ${s.b} = ${fmt(s.answer)} ${s.unit}.` : `${fmt(s.a)} ${s.op === "add" ? "+" : "−"} ${fmt(s.b)} = ${fmt(s.answer)} ${s.unit}.`,
          answer: s.answer,
        },
      },
    ];
  };
}

// Q3 / Q5 — mixed units, typed (add or subtract). Hard.
export function mixedTypedQuestion(op: "add" | "subtract"): () => TestQuestion[] {
  return () => {
    const s = mixedScenario(undefined, op);
    const big = fmt(s.A * s.c.f);
    return [
      {
        visual: null,
        difficulty: "hard",
        step: {
          kind: "number",
          prompt: `${s.story} ${s.question}`,
          suffix: s.c.smallAb,
          hint: `Change ${s.A} ${s.c.bigAb} into ${s.c.smalls} first.`,
          explain: `${s.A} ${s.c.bigAb} = ${big} ${s.c.smallAb}, and ${big} ${op === "add" ? "+" : "−"} ${s.b} = ${fmt(s.answer)} ${s.c.smallAb}.`,
          answer: s.answer,
        },
      },
    ];
  };
}

// Q4 — mixed units, choice. Distractors: added WITHOUT converting (the
// classic "2 kg + 500 g = 502" trap) and converted with the WRONG factor
// (1000/100 swap, or "an hour is 100 minutes").
export function mixedChoiceQuestion(): TestQuestion[] {
  const s = mixedScenario(undefined, "add");
  const wf = wrongFactor(s.c);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${s.story} ${s.question}`,
          hint: "You can only add amounts that are in the same unit.",
          explain: `${s.A} ${s.c.bigAb} = ${fmt(s.A * s.c.f)} ${s.c.smallAb}, so the total is ${fmt(s.A * s.c.f)} + ${s.b} = ${fmt(s.answer)} ${s.c.smallAb}.`,
        },
        `${fmt(s.answer)} ${s.c.smallAb}`,
        [
          `${fmt(s.A + s.b)} ${s.c.smallAb}`, // added without converting
          `${fmt(s.A * wf + s.b)} ${s.c.smallAb}`, // wrong conversion factor
        ]
      ),
    },
  ];
}

// Q6 — a fraction or decimal of a big unit, in small units. Medium.
export function fracConvertQuestion(): TestQuestion[] {
  const c = convById(pick(FRAC_IDS));
  const q: FracQty = { whole: randInt(0, 2), quarters: pick([1, 2, 3] as const), decimal: canUseDecimal(c) && Math.random() < 0.5 };
  const small = fracToSmall(q, c);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${fracQtyText(q)} ${q.whole + q.quarters / 4 > 1 ? c.bigs : c.big} = how many ${c.smalls}?`,
        suffix: c.smallAb,
        hint: `1 ${c.big} = ${fmt(c.f)} ${c.smalls}. 1/2 of that is ${fmt(c.f / 2)}, 1/4 of it is ${fmt(c.f / 4)}.`,
        explain: `${q.whole > 0 ? `${q.whole} × ${fmt(c.f)} = ${fmt(q.whole * c.f)}, plus ` : ""}${q.quarters}/4 of ${fmt(c.f)} = ${fmt((q.quarters * c.f) / 4)}, so ${fmt(small)} ${c.smalls}.`,
        answer: small,
      },
    },
  ];
}

// Q7 — fraction/decimal story problem. Hard.
export function fracStoryQuestion(): TestQuestion[] {
  const s = fracScenario();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `${s.story} ${s.question}`,
        suffix: s.c.smallAb,
        hint: `First change ${s.qText} ${s.c.bigAb} into ${s.c.smalls}.`,
        explain: `${s.qText} ${s.c.bigAb} = ${fmt(s.qSmall)} ${s.c.smallAb}; ${s.variant === "times" ? `${fmt(s.qSmall)} × ${s.n}` : `${fmt(s.qSmall)} + ${s.s}`} = ${fmt(s.answer)} ${s.c.smallAb}.`,
        answer: s.answer,
      },
    },
  ];
}

// Q8 — read the scale: what is one small space worth? Medium.
export function scaleTickQuestion(): TestQuestion[] {
  const cfg = pick(SCALES.filter((x) => x.major / x.minor > 2));
  return [
    {
      visual: <ScaleLine min={0} max={cfg.max} major={cfg.major} minor={cfg.minor} unit={cfg.unit} />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `On this scale, how much is each SMALL space worth?`,
        suffix: cfg.unit,
        hint: "Count the small spaces between two labels, then share the jump equally.",
        explain: `The labels go up by ${fmt(cfg.major)}, split into ${cfg.major / cfg.minor} equal spaces: ${fmt(cfg.major)} ÷ ${cfg.major / cfg.minor} = ${fmt(cfg.minor)} ${cfg.unit}.`,
        answer: cfg.minor,
      },
    },
  ];
}

// Q9 — read two points, find the distance between them. Hard.
export function scaleDistanceQuestion(): TestQuestion[] {
  const s = scaleScenario(undefined, true);
  return [
    {
      visual: (
        <ScaleLine
          min={0}
          max={s.cfg.max}
          major={s.cfg.major}
          minor={s.cfg.minor}
          unit={s.cfg.unit}
          points={[
            { value: s.A, label: "A", tone: "a" },
            { value: s.B, label: "B", tone: "b" },
          ]}
        />
      ),
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `${s.story} ${s.question}`,
        suffix: s.cfg.unit,
        hint: `Each small space is ${fmt(s.cfg.minor)}. Read A and B, then subtract.`,
        explain: `A is at ${fmt(s.A)} and B is at ${fmt(s.B)}: ${fmt(s.B)} − ${fmt(s.A)} = ${fmt(s.answer)} ${s.cfg.unit}.`,
        answer: s.answer,
      },
    },
  ];
}

// Q10 — number → phrase: rewrite a small-unit total as big + small.
// Distractors: split with the WRONG factor (1,250 m as "12 km 50 m";
// 130 min as "1 hr 30 min") and never converted ("1,250 km").
export function regroupChoiceQuestion(): TestQuestion[] {
  const c = convById(pick(["km-m", "kg-g", "l-ml", "hr-min"]));
  const A = c.f === 60 ? randInt(2, 4) : randInt(1, 6);
  const r = leftoverSmall(c.f);
  const T = A * c.f + r;
  const wf = wrongFactor(c);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${fmt(T)} ${c.smalls} is the same as…`,
          hint: `How many whole groups of ${fmt(c.f)} fit in ${fmt(T)}? What's left over?`,
          explain: `${A} × ${fmt(c.f)} = ${fmt(A * c.f)}, with ${r} left over: ${A} ${c.bigAb} ${r} ${c.smallAb}.`,
        },
        `${A} ${c.bigAb} ${r} ${c.smallAb}`,
        [
          `${Math.floor(T / wf)} ${c.bigAb} ${T % wf} ${c.smallAb}`, // wrong factor
          `${fmt(T)} ${c.bigAb}`, // unit swapped, never converted
        ]
      ),
    },
  ];
}

export const measurementWordProblemsTest: Unit["test"] = {
  questions: [
    sameUnitQuestion(["add", "subtract"], "easy"),
    sameUnitQuestion(["multiply", "divide"], "medium"),
    mixedTypedQuestion("add"),
    mixedChoiceQuestion,
    mixedTypedQuestion("subtract"),
    fracConvertQuestion,
    fracStoryQuestion,
    scaleTickQuestion,
    scaleDistanceQuestion,
    regroupChoiceQuestion,
  ],
  passScore: 9,
};
