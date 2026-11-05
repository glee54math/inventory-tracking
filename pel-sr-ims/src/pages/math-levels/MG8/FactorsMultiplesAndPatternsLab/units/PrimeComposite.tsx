import { useState } from "react";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, type Problem, type Step } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { FactorRainbow, HundredGrid } from "../diagrams";
import { factorPairs, factorsOf, PRIMES_TO_20, primeKind, smallestFactor } from "../lib/numberTheory";
import { CfuToggle, FixedCheck, type CfuQuestion } from "./cfu";
import { primeCompositeTest } from "./PrimeCompositeTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 is the plan's combined "is 1 / is 2 prime, composite, or neither?" —
 * both named classic traps in one question. Q2 cross-checks against Unit 1's
 * "factor pair" (odd ≠ prime: 15 = 3 × 5). Q3 is a true/false generalization
 * that reuses Unit 2's "multiple" (every even number above 2 is composite,
 * because it's a multiple of 2). Q4 is the memorized list (primes to 20) —
 * the ONLY part re-checked periodically (see PrimesRecallCheck in cfu.tsx,
 * wired by the lab shell); Q1-Q3 are reasoning, proven once.
 */
const CHECK: CfuQuestion[] = [
  {
    kind: "blanks",
    parts: ["1 is ", ". 2 is ", "."],
    blanks: [
      { kind: "select", choices: ["prime", "composite", "neither"], correct: "neither" },
      { kind: "select", choices: ["prime", "composite", "neither"], correct: "prime" },
    ],
    right: "Right — 1 has only ONE factor, so it's neither. 2 has exactly two factors (1 and 2), so it's prime — the only even prime.",
    wrong: "Not quite — a prime has exactly two different factors: 1 and itself. How many factors does 1 have? What are the factors of 2?",
  },
  {
    kind: "blanks",
    prompt: "15 is odd, and 15 = 3 × 5.",
    parts: ["So 15 has ", " factor pairs, and 15 is ", "."],
    blanks: [
      { kind: "select", choices: ["1", "2", "3"], correct: "2" },
      { kind: "select", choices: ["prime", "composite", "neither"], correct: "composite" },
    ],
    right: "Right — 1 × 15 and 3 × 5: two pairs, so 15 is composite. Odd doesn't mean prime.",
    wrong: "Not quite — count the pairs: 1 × 15, and 3 × 5. More than one pair means composite, even for an odd number.",
  },
  {
    kind: "blanks",
    parts: ["“Every even number bigger than 2 is composite” is ", ", because every even number is a ", " of 2."],
    blanks: [
      { kind: "select", choices: ["true", "false"], correct: "true" },
      { kind: "select", choices: ["factor", "multiple"], correct: "multiple" },
    ],
    right: "Right — an even number like 38 is a multiple of 2, so it has the pair 2 × 19 as well as 1 × 38. That's two pairs: composite.",
    wrong: "Not quite — think of 38: it's 2 × 19. Even numbers are multiples of 2 (you reach them multiplying 2 UP), so they have an extra pair.",
  },
  { kind: "primeGrid" },
];

// ============================================================================
// EXPLORE
// ============================================================================

const SIEVE = [2, 3, 5, 7];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [n, setN] = useState(51);
  const [stage, setStage] = useState(0);
  const kind = primeKind(n);
  const pairs = factorPairs(n);

  const crossed = [1, ...Array.from({ length: 100 }, (_, i) => i + 1).filter((x) => SIEVE.slice(0, stage).some((p) => x !== p && x % p === 0))];
  const circled = stage >= SIEVE.length ? Array.from({ length: 99 }, (_, i) => i + 2).filter((x) => !crossed.includes(x)) : SIEVE.slice(0, stage);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}

      <h3 style={{ margin: 0 }}>Check one number</h3>
      <div className="control-row">
        <Stepper label="Number" value={n} min={1} max={100} onChange={setN} tone="a" />
      </div>
      <FactorRainbow n={n} />
      <p className="says">
        {n === 1 ? (
          <>1 has only one factor (itself), so it is <b>neither</b> prime nor composite.</>
        ) : kind === "prime" ? (
          <>
            {n}'s only factor pair is 1 × {n}, so {n} is <b>prime</b>.{n === 2 ? " It's the only even prime." : ""}
          </>
        ) : (
          <>
            {n} has {pairs.length} factor pairs ({pairs.map(([a, b]) => `${a} × ${b}`).join(", ")}), so {n} is <b>composite</b>.{n % 2 === 1 ? " Odd numbers can be composite too!" : ""}
          </>
        )}
      </p>

      <h3 style={{ margin: "8px 0 0" }}>Sieve: find every prime up to 100</h3>
      <div className="control-row">
        <button className="btn primary" type="button" disabled={stage >= SIEVE.length} onClick={() => setStage((s) => s + 1)}>
          {stage < SIEVE.length ? `Cross out multiples of ${SIEVE[stage]}` : "Done!"}
        </button>
        <button className="btn ghost" type="button" disabled={stage === 0} onClick={() => setStage(0)}>
          Start over
        </button>
      </div>
      <HundredGrid crossed={stage > 0 ? crossed : []} circled={circled} target={n} onCellClick={setN} />
      <p className="muted small">
        {stage === 0 && "Each step keeps the prime (circled) but crosses out its other multiples — they have an extra factor pair, so they're composite. 1 gets crossed out too: it's neither."}
        {stage > 0 && stage < SIEVE.length && `Multiples of ${SIEVE.slice(0, stage).join(", ")} are crossed out (except the primes themselves).`}
        {stage >= SIEVE.length && "Everything still standing is prime. Why stop at 7? The next prime is 11, and 11 × 11 = 121 — already past 100. So 2, 3, 5, and 7 are the only checks a number up to 100 ever needs."}
      </p>
      <p className="says">
        Worth remembering: the primes up to 20 are <b>{PRIMES_TO_20.join(", ")}</b>.
      </p>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <FixedCheck title="Check for Understanding: prime or composite?" questions={CHECK} onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE — one type, five buckets
// ============================================================================

type PrimeBucket = "smallPrime" | "one" | "two" | "looksPrime" | "largePair";
const BUCKETS: PrimeBucket[] = ["smallPrime", "one", "two", "looksPrime", "largePair"];
const SMALL = [3, 5, 7, 11, 13, 17, 19];
const LOOKS = [21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93];
const LARGE: [number, number][] = [
  [89, 91],
  [97, 91],
  [53, 51],
  [59, 57],
  [67, 69],
  [71, 69],
  [79, 77],
  [73, 77],
  [83, 87],
  [89, 87],
  [97, 93],
];
const KIND_CHOICES = ["Prime", "Composite", "Neither"];

const classify = (n: number, explain: string): Step => {
  const k = primeKind(n);
  const right = k === "prime" ? "Prime" : k === "composite" ? "Composite" : "Neither";
  return choice({ prompt: `So ${n} is...`, hint: "Prime: exactly one factor pair (1 × itself). Composite: more than one pair. 1 is neither.", explain }, right, KIND_CHOICES);
};

/** "Which of these goes into n evenly?" — exactly one listed choice divides n. */
const trialStep = (n: number): Step => {
  const a = smallestFactor(n);
  const others = shuffle([2, 3, 5, 7, 11].filter((d) => n % d !== 0)).slice(0, 2);
  return choice(
    { prompt: `Check by dividing. Which of these goes into ${n} evenly?`, hint: "Divide by each one. Which leaves nothing left over?", explain: `${n} ÷ ${a} = ${n / a}, nothing left over.` },
    String(a),
    others.map(String)
  );
};

function primeProblem(target?: string): Problem {
  const bucket: PrimeBucket = BUCKETS.includes(target as PrimeBucket) ? (target as PrimeBucket) : pick(BUCKETS);

  if (bucket === "one") {
    return {
      title: "Prime or composite?",
      bucket,
      story: <>What kind of number is <b>1</b>?</>,
      visual: () => <FactorRainbow n={1} />,
      steps: [
        { kind: "number", prompt: "How many different factors does 1 have?", hint: "What times what makes 1?", explain: "Just one: 1 × 1 = 1, and that's the same number twice.", answer: 1 },
        classify(1, "Neither — a prime needs exactly two factors, and 1 has only one."),
        choice(
          { prompt: "Why isn't 1 prime?", hint: "Count the factors a prime has.", explain: "A prime has exactly two different factors: 1 and itself. For 1, those are the same number." },
          "A prime has exactly two different factors, and 1 has only one",
          [
            "It is prime — it can only be divided by 1 and itself", // MISCONCEPTION: 1 fits the slogan
            "It's composite because it's the smallest number",
          ]
        ),
      ],
      wrapUp: "1 is neither prime nor composite — it has only one factor.",
    };
  }

  if (bucket === "two") {
    const e = 2 * randInt(2, 49);
    return {
      title: "Prime or composite?",
      bucket,
      story: <>What kind of number is <b>2</b>?</>,
      visual: () => <FactorRainbow n={2} />,
      steps: [
        { kind: "number", prompt: "How many different factors does 2 have?", hint: "What divides into 2 evenly?", explain: "Two factors: 1 and 2.", answer: 2 },
        classify(2, "Prime — exactly two factors, 1 and 2. Even numbers CAN be prime: 2 is."),
        choice(
          { prompt: `Is ${e} prime too?`, hint: `${e} is even. Is it a multiple of 2?`, explain: `${e} = 2 × ${e / 2}, so it has an extra pair. 2 is the ONLY even prime.` },
          `No — ${e} = 2 × ${e / 2}, so it's composite`,
          [
            "Yes — 2 is prime, so other even numbers are too", // MISCONCEPTION: all evens behave like 2
            `Yes — ${e} is even, just like 2`,
          ]
        ),
      ],
      wrapUp: `2 is prime, and it's the only even prime — every other even number (like ${e}) is a multiple of 2, so it's composite.`,
    };
  }

  if (bucket === "smallPrime") {
    const p = pick(SMALL);
    const k = pick([2, 3]);
    return {
      title: "Prime or composite?",
      bucket,
      story: <>Is <b>{p}</b> prime or composite?</>,
      visual: (done) => <FactorRainbow n={p} pairsShown={done >= 1 ? 1 : 0} />,
      steps: [
        { kind: "number", prompt: `How many factor pairs does ${p} have?`, hint: `Try 2, 3, ... does anything besides 1 go into ${p} evenly?`, explain: `Only 1 × ${p}.`, answer: 1 },
        classify(p, `Prime — ${p}'s only factor pair is 1 × ${p}.`),
        choice(
          { prompt: `Is ${k} × ${p} = ${k * p} prime too?`, hint: `Does ${k * p} have a pair besides 1 × ${k * p}?`, explain: `${k * p} has the pair ${k} × ${p}, so it's composite.` },
          `No — ${k * p} has the factor pair ${k} × ${p}, so it's composite`,
          [
            `Yes — it's made from the prime ${p}`, // MISCONCEPTION: a multiple of a prime is prime
            `Yes — ${p} is prime, so all its multiples are`,
          ]
        ),
      ],
      wrapUp: `${p} is prime. Its multiples (like ${k * p}) are composite.`,
    };
  }

  if (bucket === "looksPrime") {
    const n = pick(LOOKS);
    const a = smallestFactor(n);
    return {
      title: "Prime or composite?",
      bucket,
      story: (
        <>
          <b>{n}</b> is odd and doesn't end in 5. Does that make it prime?
        </>
      ),
      visual: (done) => <FactorRainbow n={n} pairsShown={done >= 2 ? factorPairs(n).length : 1} />,
      steps: [
        trialStep(n),
        { kind: "number", prompt: `${n} = ${a} × ___`, hint: `${n} ÷ ${a} = ?`, explain: `${n} = ${a} × ${n / a}.`, answer: n / a },
        choice(
          { prompt: `So ${n} is...`, hint: "More than one factor pair means composite.", explain: `Composite — it has 1 × ${n} AND ${a} × ${n / a}. Odd numbers can be composite.` },
          "Composite — odd numbers can still have extra factor pairs",
          [
            "Prime — it's odd", // MISCONCEPTION: odd = prime
            "Neither",
          ]
        ),
      ],
      wrapUp: `${n} = ${a} × ${n / a}, so it's composite. Its factors: ${factorsOf(n).join(", ")}.`,
    };
  }

  // largePair — a big prime against a look-alike big composite; randomize
  // which one gets checked first so the order itself isn't a cue.
  const [p, c] = pick(LARGE);
  const compositeFirst = Math.random() < 0.5;
  const a = smallestFactor(c);
  const checkComposite = trialStep(c);
  const checkPrime = choice(
    { prompt: `Now check ${p}. Do any of 2, 3, 5, or 7 go into ${p} evenly?`, hint: `Divide ${p} by each one. Look at what's left over.`, explain: `None of them do — ${p} ÷ 3 = ${Math.floor(p / 3)} R ${p % 3}, ${p} ÷ 7 = ${Math.floor(p / 7)} R ${p % 7}. Since 11 × 11 = 121 is past 100, that's enough checking.` },
    "No — none of them do",
    [`Yes — 3 does`, `Yes — 7 does`]
  );
  return {
    title: "Two big numbers",
    bucket,
    story: (
      <>
        <b>{Math.min(p, c)}</b> and <b>{Math.max(p, c)}</b> are both big odd numbers. Is either one prime? Check before you decide.
      </>
    ),
    visual: (done) => (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <FactorRainbow n={c} pairsShown={done >= 3 || (compositeFirst ? done >= 1 : done >= 2) ? factorPairs(c).length : 1} width={260} />
        <FactorRainbow n={p} pairsShown={1} width={200} />
      </div>
    ),
    steps: compositeFirst
      ? [checkComposite, checkPrime, choice({ prompt: "So which one is prime?", hint: "Prime means no factor pair besides 1 × itself.", explain: `${p} is prime; ${c} = ${a} × ${c / a} is composite.` }, String(p), [String(c), "Both — big odd numbers are prime", "Neither"])]
      : [checkPrime, checkComposite, choice({ prompt: "So which one is prime?", hint: "Prime means no factor pair besides 1 × itself.", explain: `${p} is prime; ${c} = ${a} × ${c / a} is composite.` }, String(p), [String(c), "Both — big odd numbers are prime", "Neither"])],
    wrapUp: `${p} is prime. ${c} looks just as "prime-y", but ${c} = ${a} × ${c / a}, so it's composite.`,
  };
}

function Preview() {
  return <HundredGrid max={20} circled={PRIMES_TO_20} crossed={[1, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20]} width={260} />;
}

export const primeCompositeUnit: Unit = {
  id: "primeComposite",
  title: "Prime or Composite",
  goal: "Decide whether a number from 1 to 100 is prime, composite, or neither — and remember the primes up to 20.",
  standard: "4.OA.4",
  keyIdea: (
    <>
      <p>
        A <b>prime</b> number has exactly one factor pair: 1 × itself (7 = 1 × 7). A <b>composite</b> number has more than one (15 = 1 × 15 = 3 × 5). <b>1 is neither</b> — it has only one factor. <b>2 is prime</b> — the only even prime.
      </p>
      <p>Odd doesn't mean prime: 51 = 3 × 17. To check a number up to 100, try dividing by 2, 3, 5, and 7. The primes up to 20 are worth memorizing: 2, 3, 5, 7, 11, 13, 17, 19.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Re-gates every 20 solves — but the shell shows ONLY the primes-to-20
  // recall (PrimesRecallCheck) for a re-check, never the full reasoning CFU.
  reintroEverySolved: 20,
  preview: Preview,
  problems: [{ label: "Prime or Composite?", make: primeProblem, buckets: [...BUCKETS] }],
  requiredBuckets: [...BUCKETS],
  test: primeCompositeTest,
};
