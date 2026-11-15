import { useState } from "react";
import { choice, factorsStep, pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { MathText } from "../../../shared/components/MathText";
import { checkFactors, splitFactorBoxes } from "../../../shared/lib/factors";
import { pick, shuffle } from "../../../shared/lib/math";
import { FactorTree } from "../diagrams";
import {
  ALL_PRIMES,
  factorPairsNoOne,
  factorTree,
  helpSplit,
  isPrime,
  LONG,
  LOOK_PRIME,
  MANY_TREES,
  pairTree,
  pickOther,
  PRIMES,
  primeFactors,
  SHORT,
  smallestPrime,
  timesText,
  twoPrimes,
} from "../lib/primes";
import { judgeStep } from "../lib/primeSteps";
import { primeFactorsTest } from "./PrimeFactorsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/** The named factor message (e.g. "6 is not prime. Break 6 into smaller factors.") for a CFU factor blank. */
const factorMsg = (n: number, raw: string) => checkFactors(n, splitFactorBoxes(raw)).msg;

/**
 * Q1 typed: a full prime factorization (20 = 2 × 2 × 5), any order.
 * Q2 typed + vocabulary: 29 is prime, so its prime factorization is just 29 (the "1 × 29" trap is named).
 * Q3 typed + true/false: two different starting pairs for 36 end with the same primes (uniqueness).
 * Q4 true/false: order doesn't make a new factorization; a pair with a composite isn't a prime factorization.
 */
function PrimeCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Write 20 as a product of prime factors. Tap <b>+ Add a factor</b> to get another box.
          </p>
          <DropdownQuestion
            blanks={[{ correct: "2 × 2 × 5", label: "Prime factors of 20", factorsOf: 20 }]}
            render={([a]) => <>{a}</>}
            good="Yes. 20 = 2 × 2 × 5. Any order is fine."
            bad={(_oks, vals) => factorMsg(20, vals[0])}
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> The only factor pair of 29 is 1 × 29.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["prime", "not prime"], correct: "prime", label: "Is 29 prime" },
              { correct: "29", label: "Prime factors of 29", factorsOf: 29 },
            ]}
            render={([a, b]) => (
              <>
                29 is {a}. Its prime factorization: {b}
              </>
            )}
            good="Right. 29 is prime, so you write just 29. You can't break it into smaller factors, and 1 is not prime."
            bad={(oks, vals) => (!oks[0] ? "A prime number has exactly two factors: 1 and itself. Does 29?" : factorMsg(29, vals[1]))}
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Mia starts a factor tree for 36 with 4 × 9. Leo starts with 6 × 6.
          </p>
          <div className="tree-pair">
            <FactorTree tree={factorTree(36, [4, 9])} caption="Mia's tree" />
            <FactorTree tree={factorTree(36, [6, 6])} levels={2} ringPrimes={false} caption="Leo's tree, just started" />
          </div>
          <DropdownQuestion
            blanks={[
              { correct: "2 × 2 × 3 × 3", label: "The primes Leo's tree ends with", factorsOf: 36 },
              { options: ["True", "False"], correct: "False", label: "Different starts end with different primes" },
            ]}
            render={([a, b]) => (
              <>
                Finish Leo's tree. His primes: {a}
                <br />
                True or false: different starting pairs end with different primes. {b}
              </>
            )}
            good="Correct. 6 = 2 × 3, and 6 = 2 × 3. Leo ends with 2 × 2 × 3 × 3, the same primes as Mia. Every tree for 36 ends the same way."
            bad={(oks, vals) => (!oks[0] ? factorMsg(36, vals[0]) : "Look at Mia's primes and Leo's primes. Are they the same numbers?")}
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> True or false?
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "2 × 2 × 3 and 3 × 2 × 2 are different" },
              { options: ["True", "False"], correct: "False", label: "2 × 6 is the prime factorization of 12" },
              { options: ["True", "False"], correct: "True", label: "2 × 2 × 3 is the prime factorization of 12" },
            ]}
            render={([a, b, c]) => (
              <>
                2 × 2 × 3 and 3 × 2 × 2 are two different prime factorizations of 12. {a}
                <br />2 × 6 is the prime factorization of 12. {b}
                <br />2 × 2 × 3 is the prime factorization of 12. {c}
              </>
            )}
            good="Yes. Order doesn't matter: 3 × 2 × 2 is the same as 2 × 2 × 3. And 2 × 6 isn't done, because 6 is not prime."
            bad="Check each one. Is every factor prime? Are the primes the same, just in a different order?"
            onDone={mark(3)}
          />
        </div>
      </div>
    </MathText>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

/**
 * How to check that a prime is prime (round 1, C1-09): divide by each prime
 * up to the one whose square passes n. "29 ÷ 2, 29 ÷ 3 and 29 ÷ 5 all leave a
 * remainder, so 29 is prime." For 2 and 3 there is nothing to try.
 */
const primeCheckText = (n: number): string => {
  const tries = ALL_PRIMES.filter((p) => p * p <= n).map((p) => `${n} ÷ ${p}`);
  if (tries.length === 0) return `${n} is prime.`;
  const list = tries.length === 1 ? `${tries[0]} leaves` : tries.length === 2 ? `${tries[0]} and ${tries[1]} both leave` : `${tries.slice(0, -1).join(", ")} and ${tries[tries.length - 1]} all leave`;
  return `${list} a remainder, so ${n} is prime.`;
};

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [n, setN] = useState(36);
  const pairs = factorPairsNoOne(n);
  const [pairIdx, setPairIdx] = useState(0);
  const pair = pairs[Math.min(pairIdx, pairs.length - 1)];
  const f = primeFactors(n);

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          A <b>prime</b> number has exactly two factors: 1 and itself. Every other whole number above 1 breaks into primes that multiply to it.
        </p>
        <p>
          When you write a number as primes multiplied together, that is its <b>prime factorization</b>. A <b>factor tree</b> finds it. Split the number into a factor pair. Keep splitting
          until every number at the bottom is prime.
        </p>
        <div className="control-row">
          <Stepper
            label="Number"
            value={n}
            min={2}
            max={50}
            onChange={(v) => {
              setN(v);
              setPairIdx(0);
            }}
          />
        </div>
        {pairs.length > 0 ? (
          <>
            <Segmented
              label="Start with"
              value={String(Math.min(pairIdx, pairs.length - 1))}
              onChange={(id) => setPairIdx(Number(id))}
              options={pairs.map((p, i) => ({ id: String(i), label: timesText(p) }))}
            />
            <FactorTree tree={factorTree(n, pair)} />
            <p className="says">
              The circled numbers are prime. {n} = {timesText(f)}.
              {pairs.length > 1 ? " Try a different starting pair. The tree looks different, but it ends with the same primes." : ` ${n} has only one starting pair.`}
            </p>
          </>
        ) : (
          <>
            <FactorTree tree={factorTree(n)} />
            <p className="says">
              {primeCheckText(n)} Its only factor pair is 1 × {n}, so it has no tree to split. Its prime factorization is just {n}. We never use 1, because 1 is not
              prime.
            </p>
          </>
        )}
        <div>
          <p className="muted small">Prime numbers up to 50:</p>
          <div className="prime-chips">
            {ALL_PRIMES.map((p) => (
              <button key={p} type="button" className={`prime-chip${p === n ? " on" : ""}`} onClick={() => setN(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
        {(introActive || showCheck) && <PrimeCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

export const U4_BUCKETS = ["short", "prime", "long", "manyTrees"];

const factorsBase = (n: number) => ({
  prompt: `Write ${n} as a product of prime factors.`,
  hint: isPrime(n) ? `Can you divide ${n} evenly by any number other than 1 and ${n}?` : "Split it into a factor pair. Keep splitting numbers that are not prime.",
  explain: isPrime(n) ? `${n} is prime, so its prime factorization is just ${n}.` : `${n} = ${timesText(primeFactors(n))}. Every factor is prime.`,
});

/**
 * The tree for a "write n as primes" step (round 1, C1-06). While the step is
 * asked: just n. After a wrong try: the first split, without circles, only
 * when it isn't the whole answer; otherwise a text cue. Once the step is done
 * (or after "Show answer"): the whole tree. `allowSplit = false` for a step
 * that asks for a factor pair: there the first split IS an answer (round 2,
 * C2-02), so only the text cue shows.
 */
function factorsPicture(n: number, solved: boolean, helping: boolean, cue = "Try dividing by 2, 3, 5 and 7.", allowSplit = true) {
  if (solved) return <FactorTree tree={factorTree(n)} />;
  const split = helping && allowSplit ? helpSplit(n) : null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <FactorTree tree={split ?? factorTree(n)} levels={split ? 2 : 1} ringPrimes={false} />
      {helping && !split && <p className="muted small">{cue}</p>}
    </div>
  );
}

/** The student's own starting pair (that step's answer), or null. */
const typedPair = (help: VisualHelp | undefined, step: number): [number, number] | null => {
  const raw = help?.answers?.[step]?.[0];
  const f = raw ? raw.split(",").map((x) => Number(x.trim())) : [];
  return f.length === 2 && f.every((x) => Number.isInteger(x) && x > 1) ? [f[0], f[1]] : null;
};

const backward = (pool: readonly number[], not: number) => {
  const m = pickOther(pool, not);
  const f = shuffle(primeFactors(m));
  return {
    kind: "number" as const,
    prompt: `Now go backward. Which number is ${timesText(f)}?`,
    hint: "Multiply two factors at a time.",
    explain: `${timesText(f)} = ${m}.`,
    answer: m,
  };
};

function shortProblem(): Problem {
  const n = pick(SHORT);
  return {
    title: "Prime factors",
    bucket: "short",
    story: <>Break {n} into primes.</>,
    visual: (done, help) => factorsPicture(n, done >= 1, pointing(help, 0)),
    steps: [factorsStep(factorsBase(n), n), backward(SHORT, n)],
    wrapUp: (
      <>
        {n} = {timesText(primeFactors(n))}.
      </>
    ),
  };
}

/**
 * Many prime factors. Step 1 starts the tree with a factor pair; for a number
 * with exactly two prime factors that pair would already be the answer to
 * step 2, so step 1 asks for the smallest prime that divides it evenly
 * instead (round 1, C1-07). Step 2's picture is the student's own pair,
 * without circles, never the finished tree (C1-06).
 */
function longProblem(): Problem {
  const n = pick(LONG);
  const two = twoPrimes(n);
  const sp = smallestPrime(n);
  return {
    title: "Many prime factors",
    bucket: "long",
    story: <>Break {n} into primes. It may take more than two or three factors.</>,
    visual: (done, help) => {
      if (done >= 2) return <FactorTree tree={factorTree(n)} />;
      // Step 1 asks for a pair (or the smallest prime): only the text cue, never a split to copy (round 2, C2-02).
      if (done === 0) return factorsPicture(n, false, pointing(help, 0), "Try dividing by 2, then 3, then 5.", false);
      const mine = two ? null : typedPair(help, 0);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <FactorTree tree={mine ? pairTree(n, mine) : factorTree(n)} levels={mine ? 2 : 1} ringPrimes={false} caption={mine ? "Your start" : undefined} />
          {pointing(help, 1) && <p className="muted small">{mine ? "Split each number that is not prime." : `Start with ${n} ÷ ${sp}.`}</p>}
        </div>
      );
    },
    steps: [
      two
        ? {
            kind: "number",
            prompt: `What is the smallest prime that divides ${n} evenly?`,
            hint: "Try 2, then 3, then 5, then 7.",
            explain: `${n} ÷ ${sp} = ${n / sp}, with no remainder.${sp === 2 ? "" : ` 2 does not divide ${n} evenly${sp > 3 ? ", and neither does 3" : ""}.`}`,
            answer: sp,
            diagnose: (v) =>
              v === 1
                ? "1 is not prime. Try 2, then 3."
                : v === n
                  ? `${n} is not prime. Which prime divides ${n} evenly? Try 2, then 3, then 5.`
                  : v > 1 && Number.isInteger(v) && n % v === 0
                    ? isPrime(v)
                      ? `${v} divides ${n} evenly, but is there a smaller prime that does?`
                      : `${v} divides ${n} evenly, but ${v} is not prime.`
                    : v > 1 && Number.isInteger(v)
                      ? `${n} ÷ ${v} leaves a remainder. Try another prime.`
                      : null,
          }
        : factorsStep(
            {
              prompt: `Start a factor tree for ${n}. Type a factor pair. Don't use 1.`,
              hint: `Which small numbers divide ${n} evenly? Try 2, 3 and 5.`,
              explain: `Any of these works: ${factorPairsNoOne(n).map(timesText).join(", ")}.`,
            },
            n,
            { pair: true }
          ),
      factorsStep({ ...factorsBase(n), prompt: `Keep splitting. Write ${n} as a product of prime factors.` }, n),
      backward(LONG, n),
    ],
    wrapUp: (
      <>
        {n} = {timesText(primeFactors(n))}. That&apos;s {primeFactors(n).length} prime factors.
      </>
    ),
  };
}

/**
 * Is it prime? Half the time "Which number is prime?" (one prime, two
 * look-alikes), half the time "Which number is NOT prime?" (one look-alike,
 * two primes), round 1 C1-08. Then the pick is backed by work: type a factor
 * pair of the look-alike, and write a prime as just itself. A look-alike with
 * three prime factors (27) also gets its full factorization; for the others
 * the pair already is it.
 */
function primeProblem(): Problem {
  const notAsk = Math.random() < 0.5;
  const comp = pick(LOOK_PRIME);
  const p = pick(PRIMES);
  const third = notAsk ? pickOther(PRIMES, p) : pickOther(LOOK_PRIME, comp);
  const shown = shuffle([p, comp, third]);
  const right = notAsk ? comp : p;
  const deep = !twoPrimes(comp);
  const composites = shown.filter((x) => !isPrime(x));
  return {
    title: "Is it prime?",
    bucket: "prime",
    story: (
      <>
        Look at {shown.join(", ")}. {notAsk ? "Only one of them is not prime." : "Only one of them is prime."}
      </>
    ),
    visual: (done, help) => {
      if (done === 0) return <p className="muted small">Try dividing by 2, 3, 5 and 7.</p>;
      // The look-alike: just the number while its pair is asked, then the student's split (no circles), then the whole tree.
      const compDone = done >= (deep ? 4 : 2);
      return (
        <div className="tree-pair">
          {compDone ? <FactorTree tree={factorTree(comp)} /> : <FactorTree tree={factorTree(comp)} levels={done >= 2 ? 2 : 1} ringPrimes={false} />}
          {done >= 3 && <FactorTree tree={factorTree(p)} />}
          {done === 1 && pointing(help, 1) && <p className="muted small">Try dividing {comp} by 3 and by 7.</p>}
        </div>
      );
    },
    steps: [
      choice(
        {
          prompt: notAsk ? "Which number is NOT prime?" : "Which number is prime?",
          hint: "Try dividing each number by 3 and by 7.",
          explain: `${shown
            .filter((x) => isPrime(x))
            .map(String)
            .join(" and ")} ${notAsk ? "have" : "has"} only the factors 1 and ${notAsk ? "themselves" : "itself"}. ${composites.map((o) => `${o} = ${timesText(factorPairsNoOne(o)[0])}`).join(" and ")}.`,
        },
        String(right),
        // "prime": odd numbers that look prime. "NOT prime": the two real primes.
        shown.filter((x) => x !== right).map(String)
      ),
      factorsStep(
        {
          prompt: `Show that ${comp} is not prime. Type a factor pair of ${comp}. Don't use 1.`,
          hint: `Try dividing ${comp} by 3 and by 7.`,
          explain: `${comp} = ${timesText(factorPairsNoOne(comp)[0])}, so ${comp} has factors other than 1 and ${comp}.`,
        },
        comp,
        { pair: true }
      ),
      factorsStep(factorsBase(p), p),
      ...(deep ? [factorsStep({ ...factorsBase(comp), prompt: `Now write ${comp} as a product of prime factors.` }, comp)] : []),
    ],
    wrapUp: (
      <>
        {p} is prime, so you write just {p}. But {comp} = {timesText(primeFactors(comp))}.
      </>
    ),
  };
}

function manyTreesProblem(): Problem {
  const n = pick(MANY_TREES);
  const pairs = factorPairsNoOne(n);
  const mia = pick(pairs);
  const shown = pairs.find((q) => q !== mia)!;
  return {
    title: "Different trees",
    bucket: "manyTrees",
    story: (
      <>
        Mia starts a factor tree for {n} with {timesText(mia)}.
      </>
    ),
    visual: (done) => (
      <div className="tree-pair">
        <FactorTree tree={factorTree(n, mia)} levels={done >= 2 ? 99 : 2} ringPrimes={done >= 2} caption="Mia's tree" />
        {done >= 2 && <FactorTree tree={factorTree(n, shown)} caption={`A tree that starts with ${timesText(shown)}`} />}
      </div>
    ),
    steps: [
      factorsStep(
        {
          prompt: `Start a different tree for ${n}. Type a factor pair that is not ${timesText(mia)}. Don't use 1.`,
          hint: `List the factor pairs of ${n}. Pick one Mia didn't use.`,
          explain: `Any of these works: ${pairs.filter((q) => q !== mia).map(timesText).join(", ")}.`,
        },
        n,
        { pair: true, exclude: [mia] }
      ),
      factorsStep({ ...factorsBase(n), prompt: `Finish your tree. Write ${n} as a product of prime factors.` }, n),
      judgeStep(n),
    ],
    wrapUp: (
      <>
        Every factor tree for {n} ends with {timesText(primeFactors(n))}. The start can change. The primes don&apos;t.
      </>
    ),
  };
}

function Preview() {
  return <FactorTree tree={factorTree(36, [4, 9])} />;
}

export const primeFactorsUnit: Unit = {
  id: "primeFactors",
  title: "Breaking Numbers into Prime Factors",
  goal: "Write a whole number from 2 to 50 as a product of its prime factors.",
  standard: "5.OA.2.1 (CA)",
  keyIdea: (
    <>
      <p>Split a number into factors until every factor is prime: 36 = 4 × 9 = 2 × 2 × 3 × 3.</p>
      <p>Any starting pair ends with the same primes. For a prime number, like 29, write just 29.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U4_BUCKETS,
  problems: [
    { label: "Short", make: () => shortProblem(), buckets: ["short"] },
    { label: "Is it prime?", make: () => primeProblem(), buckets: ["prime"] },
    { label: "Many factors", make: () => longProblem(), buckets: ["long"] },
    { label: "Different trees", make: () => manyTreesProblem(), buckets: ["manyTrees"] },
  ],
  test: primeFactorsTest,
};
