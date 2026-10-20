import { useEffect, useState } from "react";
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
// PRE-CHECK — mandatory gate before Practice unlocks
// ============================================================================

interface PreCheckConfig {
  heading: string;
  /** The negative number shown on the left of "___ ⟡ 0" — always correctly < 0. */
  ineqValue: number;
  dragMin: number;
  dragMax: number;
  dragTarget: number;
  dragPrompt: string;
  /** How the dragged value is displayed next to the dot, e.g. "-24°" or "-$30". */
  dragFormat: (v: number) => string;
  dragCorrectExplain: string;
  pickPrompt: string;
  pickOptionA: string;
  pickOptionB: string; // always the correct (more negative) choice
  pickCorrectExplain: string;
  pickWrongExplain: string;
}

const fmtSigned = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));

// A fixed, hand-picked set per context (not randomized — same convention as
// AlignDecimalsDrill's ALIGN_TOP/ALIGN_BOTTOM elsewhere in this app): this is
// a one-time "do you get the idea at all" check, not a practice problem, so
// every student sees the exact same questions. One block per context, since
// Practice is now split the same way (Temperature / Elevation / Account
// Balance), so the comprehension check covers all 3 before any of them unlock.
const PRECHECKS: PreCheckConfig[] = [
  {
    heading: "Temperature",
    ineqValue: -4,
    dragMin: -30,
    dragMax: 10,
    dragTarget: -24,
    dragPrompt: "Drag the dot to 24° below zero.",
    dragFormat: (v) => `${v}°`,
    dragCorrectExplain: "24 degrees below zero is −24°.",
    pickPrompt: "Select the number that is colder.",
    pickOptionA: "-13°F",
    pickOptionB: "-15°F",
    pickCorrectExplain: "−15°F is colder than −13°F, since −15 is farther below zero.",
    pickWrongExplain: "Not quite — colder means a lower (more negative) number. Which one is farther below zero?",
  },
  {
    heading: "Elevation",
    ineqValue: -150,
    dragMin: -250,
    dragMax: 50,
    dragTarget: -200,
    dragPrompt: "Drag the dot to 200 feet below sea level.",
    dragFormat: (v) => `${v} ft`,
    dragCorrectExplain: "200 feet below sea level is −200 ft.",
    pickPrompt: "Select the elevation that is lower (deeper below sea level).",
    pickOptionA: "-120 ft",
    pickOptionB: "-180 ft",
    pickCorrectExplain: "−180 ft is lower than −120 ft, since −180 is farther below sea level.",
    pickWrongExplain: "Not quite — lower means a more negative elevation. Which one is farther below sea level?",
  },
  {
    heading: "Account Balance",
    ineqValue: -25,
    dragMin: -40,
    dragMax: 10,
    dragTarget: -30,
    dragPrompt: "Drag the dot to a debt of 30 dollars.",
    dragFormat: (v) => (v < 0 ? `-$${-v}` : `$${v}`),
    dragCorrectExplain: "A debt of 30 dollars is a balance of −$30.",
    pickPrompt: "Select the account that owes more money (the bigger debt).",
    pickOptionA: "-$20",
    pickOptionB: "-$35",
    pickCorrectExplain: "−$35 is a bigger debt than −$20, since −35 is farther below zero.",
    pickWrongExplain: "Not quite — owing more money means a lower (more negative) balance. Which one is farther below zero?",
  },
];

/**
 * One context's 3-question comprehension check: select the comparison
 * symbol, drag the number-line dot to a target value, and pick the more
 * negative of two options. Fires onComplete once all three are answered
 * correctly; each stays re-triable on a wrong pick instead of locking in a
 * mistake, the same retry-until-right spirit as every other gated drill in
 * this app (e.g. AlignDecimalsDrill in MG11).
 */
function PreCheckBlock({ config, onComplete }: { config: PreCheckConfig; onComplete?: () => void }) {
  // Starts on the wrong symbol so pressing Check Answer without actually
  // choosing can't pass by accident.
  const [q1Sym, setQ1Sym] = useState<"<" | ">">(">");
  const [q1Checked, setQ1Checked] = useState(false);
  const q1Done = q1Checked && q1Sym === "<";

  const [q2Value, setQ2Value] = useState(0);
  const q2Done = q2Value === config.dragTarget;

  const [q3, setQ3] = useState<string | null>(null);
  const q3Done = q3 === config.pickOptionB;

  const allDone = q1Done && q2Done && q3Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  const neg = fmtSigned(config.ineqValue);

  return (
    <div className="align-stack-wrap">
      <p className="intro-gate-title">{config.heading}</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> Select the symbol that correctly compares these two numbers.
        </p>
        <div className="control-row" style={{ alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Courier New', monospace" }}>{neg}</span>
          <button
            type="button"
            disabled={q1Done}
            onClick={() => setQ1Sym((s) => (s === "<" ? ">" : "<"))}
            aria-label={`currently showing ${q1Sym === "<" ? "less than" : "greater than"} — click to switch`}
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              border: `2px solid ${!q1Checked ? "var(--line)" : q1Done ? "var(--good)" : "var(--bad)"}`,
              background: !q1Checked ? "var(--card)" : q1Done ? "var(--good-soft)" : "var(--bad-soft)",
              fontSize: 20,
              fontWeight: 700,
              fontFamily: "'Courier New', monospace",
              color: "var(--ink)",
              cursor: q1Done ? "default" : "pointer",
            }}
          >
            {q1Sym}
          </button>
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Courier New', monospace" }}>0</span>
          <button className="btn primary" type="button" onClick={() => setQ1Checked(true)}>
            Check Answer
          </button>
        </div>
        {q1Checked && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done ? `Correct — ${neg} is to the left of 0 on the number line, so ${neg} < 0.` : `Not quite — which number is farther left on the number line, ${neg} or 0?`}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> {config.dragPrompt}
        </p>
        <NumberLine
          min={config.dragMin}
          max={config.dragMax}
          points={[{ value: q2Value, label: config.dragFormat(q2Value), tone: q2Done ? "a" : "b", onChange: q2Done ? undefined : setQ2Value }]}
        />
        {q2Done && (
          <p className="feedback good" role="alert">
            Correct — {config.dragCorrectExplain}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> {config.pickPrompt}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {[config.pickOptionA, config.pickOptionB].map((label) => (
            <button
              key={label}
              type="button"
              disabled={q3Done}
              onClick={() => setQ3(label)}
              style={{
                padding: "7px 16px",
                borderRadius: "var(--radius-sm)",
                border: `2px solid ${q3 !== label ? "var(--line)" : label === config.pickOptionB ? "var(--good)" : "var(--bad)"}`,
                background: q3 !== label ? "var(--card)" : label === config.pickOptionB ? "var(--good-soft)" : "var(--bad-soft)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink)",
                cursor: q3Done ? "default" : "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {q3 && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done ? config.pickCorrectExplain : config.pickWrongExplain}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * All 3 contexts' comprehension checks together — fires onComplete only once
 * every block has been passed, since Practice now offers all 3 contexts
 * separately and the gate is meant to certify readiness for all of them, not
 * just whichever one happened to be shown first.
 */
function PositiveNegativePreCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState<boolean[]>(() => PRECHECKS.map(() => false));
  const allDone = done.every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure positive and negative numbers make sense before you try practice problems.</p>
      {PRECHECKS.map((config, i) => (
        <PreCheckBlock
          key={config.heading}
          config={config}
          onComplete={() => setDone((d) => (d[i] ? d : d.map((v, j) => (j === i ? true : v))))}
        />
      ))}
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  // Once the gate is already satisfied, the check is optional — hidden by
  // default so a returning student isn't forced through it again, but still
  // reachable with one click for review (same convention as DecimalOperations'
  // "Show the lining-up drill" toggle). While the gate IS active it's always
  // shown, so this toggle is irrelevant then.
  const [showCheck, setShowCheck] = useState(false);
  const [context, setContext] = useState<Context>("temperature");
  const [value, setValue] = useState(5);
  const cfg = CONTEXTS[context];
  const phrase = value === 0 ? cfg.zeroMeaning : value > 0 ? cfg.positivePhrase(value) : cfg.negativePhrase(-value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button className="btn ghost" style={{ width: "fit-content" }} onClick={() => setShowCheck((v) => !v)}>
          {showCheck ? "Hide" : "Show"} the quick check
        </button>
      )}
      {(introActive || showCheck) && <PositiveNegativePreCheck onComplete={onIntroDone} />}
      <Segmented label="Situation" value={context} onChange={setContext} options={CONTEXT_KEYS.map((k) => ({ id: k, label: CONTEXTS[k].label }))} />
      <div className="controls">
        <Stepper label="Value" value={value} min={-cfg.range} max={cfg.range} step={1} onChange={setValue} tone="a" />
      </div>
      <NumberLine min={-cfg.range} max={cfg.range} points={[{ value, tone: "a", onChange: setValue }]} />
      <p className="muted small">
        {value}
        {cfg.unit} means {phrase}. Try dragging the dot (or the value above) through 0 — notice how the meaning flips from one side to the
        other, and what 0 itself stands for: {cfg.zeroMeaning}.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES — one per real-world context, so Practice can target
// temperature, elevation, or account balance separately (not just "Mixed").
// ============================================================================

function realWorldProblem(context: Context): Problem {
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

function temperatureProblem(): Problem {
  return realWorldProblem("temperature");
}
function elevationProblem(): Problem {
  return realWorldProblem("elevation");
}
function accountBalanceProblem(): Problem {
  return realWorldProblem("money");
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
  requiresIntro: true,
  problems: [
    { label: "Temperature", make: temperatureProblem },
    { label: "Elevation", make: elevationProblem },
    { label: "Account Balance", make: accountBalanceProblem },
  ],
  // Each of the 3 types above only ever tags its own fixed context as its
  // bucket — requiring all 3 here still means a mastery star certifies the
  // student solved at least one of each in Mixed mode, not just whichever
  // context Mixed happened to draw most often.
  requiredBuckets: CONTEXT_KEYS,
};
