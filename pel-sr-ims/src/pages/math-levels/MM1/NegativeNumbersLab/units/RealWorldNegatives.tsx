import { useState } from "react";
import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

type Context = "temperature" | "elevation" | "money";

interface ContextConfig {
  label: string;
  unit: string;
  /** min/max for the free-play Explore stepper and the Practice range. */
  range: number;
  positivePhrase: (n: number) => string;
  negativePhrase: (n: number) => string;
  zeroMeaning: string;
  zeroDistractors: string[];
}

const CONTEXTS: Record<Context, ContextConfig> = {
  temperature: {
    label: "temperature",
    unit: "°F",
    range: 25,
    positivePhrase: (n) => `${n} degrees above zero`,
    negativePhrase: (n) => `${n} degrees below zero`,
    zeroMeaning: "the reference point of zero degrees",
    zeroDistractors: ["the hottest possible temperature", "the coldest possible temperature"],
  },
  elevation: {
    label: "elevation",
    unit: " feet",
    range: 500,
    positivePhrase: (n) => `${n} feet above sea level`,
    negativePhrase: (n) => `${n} feet below sea level`,
    zeroMeaning: "sea level",
    zeroDistractors: ["the bottom of the ocean", "the top of a mountain"],
  },
  money: {
    label: "an account balance",
    unit: " dollars",
    range: 50,
    positivePhrase: (n) => `a deposit of ${n} dollars`,
    negativePhrase: (n) => `a debt of ${n} dollars`,
    zeroMeaning: "an account with no money owed or owned — exactly empty",
    zeroDistractors: ["the most money the account can ever hold", "an account that's frozen and can't be used"],
  },
};

const CONTEXT_KEYS = Object.keys(CONTEXTS) as Context[];

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [context, setContext] = useState<Context>("temperature");
  const [value, setValue] = useState(5);
  const cfg = CONTEXTS[context];
  const phrase = value === 0 ? cfg.zeroMeaning : value > 0 ? cfg.positivePhrase(value) : cfg.negativePhrase(-value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Segmented label="Situation" value={context} onChange={setContext} options={CONTEXT_KEYS.map((k) => ({ id: k, label: CONTEXTS[k].label }))} />
      <div className="controls">
        <Stepper label="Value" value={value} min={-cfg.range} max={cfg.range} step={1} onChange={setValue} tone="a" />
      </div>
      <NumberLine min={-cfg.range} max={cfg.range} points={[{ value, tone: "a" }]} />
      <p className="muted small">
        {value}
        {cfg.unit} means {phrase}. Try dragging the value through 0 — notice how the meaning flips from one side to the other, and what 0
        itself stands for: {cfg.zeroMeaning}.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — real-world context
// ============================================================================

function realWorldProblem(targetBucket?: string): Problem {
  const context: Context = targetBucket && targetBucket in CONTEXTS ? (targetBucket as Context) : CONTEXT_KEYS[randInt(0, CONTEXT_KEYS.length - 1)];
  const cfg = CONTEXTS[context];
  const magnitude = randInt(1, cfg.range);
  const isNegative = Math.random() < 0.5;
  const value = isNegative ? -magnitude : magnitude;
  const phrase = isNegative ? cfg.negativePhrase(magnitude) : cfg.positivePhrase(magnitude);

  return {
    title: `Positive and negative ${cfg.label}`,
    bucket: context,
    story: `Write this as a signed number: ${phrase}.`,
    visual: (done: number) => (
      <NumberLine min={-cfg.range} max={cfg.range} points={done >= 1 ? [{ value, tone: "a" }] : []} />
    ),
    steps: [
      {
        kind: "number",
        prompt: `What signed number represents "${phrase}"?`,
        hint: isNegative ? "Below zero (or in debt, or below sea level) is negative." : "Above zero (or a deposit, or above sea level) is positive.",
        explain: `"${phrase}" = ${value}${cfg.unit}.`,
        answer: value,
      },
      choice(
        {
          prompt: `What does 0${cfg.unit} mean in this situation?`,
          hint: "Think about what's neither positive nor negative here.",
          explain: `0${cfg.unit} means ${cfg.zeroMeaning}.`,
        },
        cfg.zeroMeaning,
        cfg.zeroDistractors
      ),
    ],
    wrapUp: `"${phrase}" = ${value}${cfg.unit}.`,
  };
}

export const realWorldNegatives: Unit = {
  id: "realWorldNegatives",
  title: "Positive & Negative Numbers in Real Life",
  goal: "Use positive and negative numbers to describe real-world quantities that have opposite directions or values, and explain what 0 means in each situation.",
  standard: "6.NS.5",
  keyIdea: (
    <>
      <p>Positive and negative numbers describe opposite directions from a starting point: above/below zero, above/below sea level, money you have/owe.</p>
      <p>0 isn't "nothing" — it's the reference point everything else is measured from, and what it means changes with the situation.</p>
    </>
  ),
  Explore,
  problems: [{ label: "Real-World Context", make: realWorldProblem, buckets: CONTEXT_KEYS }],
  // Each bucket is a different real-world context, not a scenario variation
  // of one concept — a mastery star here certifies the student can apply
  // signed numbers across temperature, elevation, AND money, not just
  // whichever context they happened to get lucky with most often.
  requiredBuckets: CONTEXT_KEYS,
};
