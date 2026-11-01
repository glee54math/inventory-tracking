// Lab-local scenario generators for Unit 2 (Word Problems with Distance,
// Time, Volume & Mass). Pure data — no JSX — so MeasurementWordProblems.tsx
// (Practice) and MeasurementWordProblemsTest.tsx (Test) build their own
// Problem/TestQuestion wrappers around the SAME numbers and wording, and the
// brute-force verification can exercise the arithmetic directly. A leaf
// module (imports only ./measures and shared/lib), so no unit <-> Test cycle.

import { pick, randInt } from "../../../shared/lib/math";
import { canUseDecimal, convById, fracQtyText, fracToSmall, fracValue, leftoverSmall, type Conv, type FracQty } from "./measures";

export const NAMES = ["Maya", "Leo", "Ava", "Sam", "Nia", "Omar", "Lily", "Ben", "Rosa", "Kai"];

// ---------------------------------------------------------------------------
// Same-unit problems: one of the four operations, no conversion needed.
// ---------------------------------------------------------------------------

export type Op = "add" | "subtract" | "multiply" | "divide";
export const OPS: Op[] = ["add", "subtract", "multiply", "divide"];
export const OP_WORD: Record<Op, string> = { add: "Add", subtract: "Subtract", multiply: "Multiply", divide: "Divide" };
export const OP_SIGN: Record<Op, string> = { add: "+", subtract: "−", multiply: "×", divide: "÷" };

export interface SameUnitScenario {
  op: Op;
  unit: string; // abbreviation, e.g. "m"
  unitWord: string; // e.g. "meters"
  story: string;
  question: string;
  a: number;
  b: number;
  answer: number;
  /** The inverse-operation check: `${answer} ${checkSign} ${b} = checkAnswer`. */
  checkSign: string;
  checkAnswer: number;
  /** Tape-diagram description: parts + total label (common unit). */
  tape: { parts: { weight: number; label: string; tone: "a" | "b" | "c" }[]; total: string };
}

export function sameUnitScenario(op: Op = pick(OPS)): SameUnitScenario {
  const name = pick(NAMES);
  const alt = Math.random() < 0.5;
  if (op === "add") {
    const [lo, hi] = alt ? [250, 990] : [120, 980];
    const a = randInt(lo, hi);
    const b = randInt(lo, hi);
    const unit = alt ? "mL" : "m";
    const unitWord = alt ? "milliliters" : "meters";
    return {
      op,
      unit,
      unitWord,
      story: alt ? `${name} has a bottle with ${a} mL of water and another with ${b} mL.` : `${name} walked ${a} m to the park, then ${b} m more to the library.`,
      question: alt ? "How many milliliters of water is that in all?" : "How many meters did " + name + " walk in all?",
      a,
      b,
      answer: a + b,
      checkSign: "−",
      checkAnswer: a,
      tape: { parts: [{ weight: a, label: `${a} ${unit}`, tone: "a" }, { weight: b, label: `${b} ${unit}`, tone: "b" }], total: `? ${unit}` },
    };
  }
  if (op === "subtract") {
    const a = alt ? randInt(150, 500) : randInt(600, 2000);
    const b = alt ? randInt(25, a - 40) : randInt(150, a - 100);
    const unit = alt ? "cm" : "mL";
    const unitWord = alt ? "centimeters" : "milliliters";
    return {
      op,
      unit,
      unitWord,
      story: alt ? `${name} has a rope ${a} cm long and cuts off ${b} cm.` : `A pitcher holds ${a} mL of lemonade. ${name} pours ${b} mL into glasses.`,
      question: alt ? "How many centimeters of rope are left?" : "How many milliliters of lemonade are left in the pitcher?",
      a,
      b,
      answer: a - b,
      checkSign: "+",
      checkAnswer: a,
      tape: { parts: [{ weight: b, label: `${b} ${unit}`, tone: "b" }, { weight: a - b, label: `? ${unit}`, tone: "a" }], total: `${a} ${unit}` },
    };
  }
  if (op === "multiply") {
    const each = alt ? randInt(2, 15) : randInt(3, 9) * 5;
    const n = alt ? randInt(3, 9) : randInt(3, 7);
    const unit = alt ? "kg" : "min";
    const unitWord = alt ? "kilograms" : "minutes";
    return {
      op,
      unit,
      unitWord,
      story: alt ? `A truck carries ${n} bags of soil. Each bag has a mass of ${each} kg.` : `${name} practices piano for ${each} minutes every day for ${n} days.`,
      question: alt ? "What is the total mass of the soil, in kilograms?" : `How many minutes does ${name} practice in all?`,
      a: each,
      b: n,
      answer: each * n,
      checkSign: "÷",
      checkAnswer: each,
      tape: { parts: Array.from({ length: n }, () => ({ weight: 1, label: `${each}`, tone: "a" as const })), total: `? ${unit}` },
    };
  }
  const n = randInt(2, 8);
  const each = alt ? randInt(12, 40) : randInt(3, 25) * 10;
  const unit = alt ? "cm" : "g";
  const unitWord = alt ? "centimeters" : "grams";
  return {
    op,
    unit,
    unitWord,
    story: alt ? `${name} cuts a ribbon ${n * each} cm long into ${n} equal pieces.` : `${name} shares ${n * each} g of trail mix equally into ${n} bags.`,
    question: alt ? "How long is each piece, in centimeters?" : "How many grams go in each bag?",
    a: n * each,
    b: n,
    answer: each,
    checkSign: "×",
    checkAnswer: n * each,
    tape: { parts: Array.from({ length: n }, () => ({ weight: 1, label: "?", tone: "a" as const })), total: `${n * each} ${unit}` },
  };
}

// ---------------------------------------------------------------------------
// Mixed-unit problems: convert to the small unit BEFORE adding/subtracting.
// ---------------------------------------------------------------------------

export const MIXED_IDS = ["kg-g", "km-m", "l-ml", "hr-min", "lb-oz", "m-cm"];

export interface MixedScenario {
  c: Conv;
  op: "add" | "subtract";
  A: number;
  b: number;
  story: string;
  question: string;
  answer: number;
}

export function mixedScenario(id: string = pick(MIXED_IDS), op: "add" | "subtract" = Math.random() < 0.5 ? "add" : "subtract"): MixedScenario {
  const c = convById(id);
  const name = pick(NAMES);
  const A = randInt(1, c.id === "hr-min" ? 3 : 5);
  const b = leftoverSmall(c.f);
  const Aw = `${A} ${A === 1 ? c.big : c.bigs}`;
  const bw = `${b} ${b === 1 ? c.small : c.smalls}`;
  const T: Record<string, [string, string, string, string]> = {
    "kg-g": [`${name} buys ${Aw} of flour and ${bw} of sugar.`, "How many grams is that altogether?", `${name} has a ${A}-kilogram bag of rice and cooks ${bw} of it.`, "How many grams of rice are left?"],
    "km-m": [`${name} runs ${Aw}, then walks ${bw} more.`, "How many meters is that in all?", `A trail is ${Aw} long. ${name} has hiked ${bw} so far.`, "How many meters are left to hike?"],
    "l-ml": [`A jug has ${Aw} of water. ${name} pours in ${bw} more.`, "How many milliliters of water are in the jug now?", `A jug holds ${Aw} of juice. ${name} pours out ${bw}.`, "How many milliliters of juice are left?"],
    "hr-min": [`${name}'s soccer game lasts ${Aw}. Practice after the game lasts ${bw}.`, "How many minutes is that in all?", `${name} has ${Aw} to finish chores. So far the chores took ${bw}.`, "How many minutes are left?"],
    "lb-oz": [`A puppy weighed ${Aw}. Since then it has gained ${bw}.`, "How many ounces does the puppy weigh now?", `A bag of apples weighs ${Aw}. ${name} takes out apples that weigh ${bw}.`, "How many ounces of apples are left in the bag?"],
    "m-cm": [`${name} has one ribbon ${Aw} long and another ${bw} long.`, "How many centimeters of ribbon is that in all?", `A board is ${Aw} long. ${name} cuts off ${bw}.`, "How many centimeters of board are left?"],
  };
  const t = T[c.id];
  return {
    c,
    op,
    A,
    b,
    story: op === "add" ? t[0] : t[2],
    question: op === "add" ? t[1] : t[3],
    answer: op === "add" ? A * c.f + b : A * c.f - b,
  };
}

// ---------------------------------------------------------------------------
// Simple fractions / decimals of a big unit.
// ---------------------------------------------------------------------------

export const FRAC_IDS = ["hr-min", "lb-oz", "kg-g", "l-ml", "km-m", "m-cm"];

export interface FracScenario {
  c: Conv;
  q: FracQty;
  qText: string;
  variant: "times" | "plus";
  n: number;
  s: number;
  story: string;
  question: string;
  qSmall: number;
  answer: number;
  regroup: [number, number];
}

export function fracScenario(id: string = pick(FRAC_IDS), variant: "times" | "plus" = Math.random() < 0.5 ? "times" : "plus"): FracScenario {
  const c = convById(id);
  const name = pick(NAMES);
  const q: FracQty = {
    whole: variant === "plus" ? randInt(1, 3) : randInt(0, 2),
    quarters: pick([1, 2, 3] as const),
    decimal: canUseDecimal(c) && Math.random() < 0.5,
  };
  const qText = fracQtyText(q);
  const w = fracValue(q) > 1 ? c.bigs : c.big;
  const qw = `${qText} ${w}`;
  // n is chosen jointly with q so the total is always at least ONE whole big
  // unit (1/4 L needs n ≥ 4) — otherwise the "___ L and ___ mL" regroup step
  // degenerates to "0 L and 500 mL". (Caught by the brute-force check.)
  const n = randInt(Math.max(2, Math.ceil(1 / fracValue(q))), 6);
  const s = leftoverSmall(c.f);
  const sw = `${s} ${s === 1 ? c.small : c.smalls}`;
  const T: Record<string, [string, string, string, string]> = {
    "hr-min": [`${name} reads for ${qw} every day.`, `How many minutes does ${name} read in ${n} days?`, `A movie is ${qw} long. The previews before it take ${sw}.`, "How many minutes is that in all?"],
    "lb-oz": [`Each bag of trail mix weighs ${qw}.`, `How many ounces do ${n} bags weigh?`, `A melon weighs ${qw}. A bunch of grapes weighs ${sw}.`, "How many ounces do they weigh together?"],
    "kg-g": [`Each bag of apples has a mass of ${qw}.`, `How many grams do ${n} bags have in all?`, `A pumpkin has a mass of ${qw}. A squash has a mass of ${sw}.`, "How many grams is that together?"],
    "l-ml": [`Each bottle holds ${qw} of water.`, `How many milliliters do ${n} bottles hold?`, `A pot has ${qw} of soup. ${name} adds ${sw} of broth.`, "How many milliliters of soup are in the pot now?"],
    "km-m": [`${name} runs ${qw} every day.`, `How many meters does ${name} run in ${n} days?`, `${name} bikes ${qw}, then walks ${sw}.`, "How many meters is that in all?"],
    "m-cm": [`Each ribbon is ${qw} long.`, `How many centimeters long are ${n} ribbons laid end to end?`, `A table is ${qw} long. A bench is ${sw} long.`, "Placed end to end, how many centimeters long are they?"],
  };
  const t = T[c.id];
  const qSmall = fracToSmall(q, c);
  const answer = variant === "times" ? qSmall * n : qSmall + s;
  return {
    c,
    q,
    qText,
    variant,
    n,
    s,
    story: variant === "times" ? t[0] : t[2],
    question: variant === "times" ? t[1] : t[3],
    qSmall,
    answer,
    regroup: [Math.floor(answer / c.f), answer % c.f],
  };
}

// ---------------------------------------------------------------------------
// Reading values off a measurement scale (number-line diagram).
// ---------------------------------------------------------------------------

export interface ScaleConfig {
  unit: string;
  unitWord: string;
  max: number;
  major: number;
  minor: number;
  ctx: "trail" | "pitcher" | "timeline" | "scaleKg" | "scaleG";
}

export const SCALES: ScaleConfig[] = [
  { unit: "m", unitWord: "meters", max: 1000, major: 200, minor: 100, ctx: "trail" },
  { unit: "m", unitWord: "meters", max: 1000, major: 100, minor: 50, ctx: "trail" },
  { unit: "m", unitWord: "meters", max: 500, major: 100, minor: 25, ctx: "trail" },
  { unit: "mL", unitWord: "milliliters", max: 1000, major: 250, minor: 50, ctx: "pitcher" },
  { unit: "min", unitWord: "minutes", max: 60, major: 15, minor: 5, ctx: "timeline" },
  { unit: "kg", unitWord: "kilograms", max: 100, major: 20, minor: 5, ctx: "scaleKg" },
  { unit: "g", unitWord: "grams", max: 500, major: 100, minor: 20, ctx: "scaleG" },
];

export interface ScaleScenario {
  cfg: ScaleConfig;
  A: number;
  B: number;
  story: string;
  question: string;
  answer: number;
}

/** A < B, both on minor ticks, at least 2 minor ticks apart, and at least
 *  one of them NOT on a labeled tick (so it really must be read off the
 *  scale). `hard` forces both points off the labeled ticks. */
export function scaleScenario(cfg: ScaleConfig = pick(SCALES), hard = Math.random() < 0.5): ScaleScenario {
  const steps = cfg.max / cfg.minor;
  const onMajor = (v: number) => v % cfg.major === 0;
  for (;;) {
    const i = randInt(1, steps - 3);
    const j = randInt(i + 2, steps - 1);
    const A = i * cfg.minor;
    const B = j * cfg.minor;
    if (hard ? onMajor(A) || onMajor(B) : onMajor(A) && onMajor(B)) continue;
    const name = pick(NAMES);
    const S: Record<ScaleConfig["ctx"], [string, string]> = {
      trail: [`On this trail map, A is the water fountain and B is the picnic table.`, "How many meters is it from the fountain to the picnic table?"],
      pitcher: [`The scale shows how much juice was in a pitcher before (A) and after (B) ${name} poured more in.`, `How many milliliters of juice did ${name} pour in?`],
      timeline: [`This timeline shows minutes after 4:00. ${name}'s practice started at A and ended at B.`, "How many minutes long was practice?"],
      scaleKg: [`A shows the mass of an empty wagon. B shows the wagon once it's loaded with firewood.`, "What is the mass of the firewood, in kilograms?"],
      scaleG: [`A shows the mass of an empty bowl. B shows the bowl filled with berries.`, "What is the mass of the berries, in grams?"],
    };
    return { cfg, A, B, story: S[cfg.ctx][0], question: S[cfg.ctx][1], answer: B - A };
  }
}
