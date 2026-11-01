import { useEffect, useState } from "react";
import { FactorRectangle } from "../../../shared/diagrams";
import { pick } from "../../../shared/lib/math";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";
import { choice, customStep, type Problem } from "../../../shared/engine/types";
import { Slider, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { FactorRainbow } from "../diagrams";
import { factorPairs, factorsOf, isSquare, lastCheck } from "../lib/numberTheory";
import { CfuToggle, FixedCheck, type CfuQuestion } from "./cfu";
import { factorPairsTest } from "./FactorPairsTest";

const pairText = ([a, b]: [number, number]) => `${a} × ${b}`;
const pairsText = (n: number) => factorPairs(n).map(pairText).join(", ");

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 vocabulary (factor vs product — both terms in one sentence); Q2 the
 * plan's "did you get them all?" trap with an easily-missed MIDDLE pair
 * (36's 6 × 6); Q3 when to stop (a flipped pair is not new); Q4 the
 * generalization trap "bigger numbers always have more factor pairs"
 * (counterexample 97 vs 24).
 */
const CHECK: CfuQuestion[] = [
  {
    kind: "blanks",
    parts: ["In 4 × 6 = 24, the numbers 4 and 6 are ", " of 24, and 24 is the ", "."],
    blanks: [
      { kind: "select", choices: ["factors", "products", "sums"], correct: "factors" },
      { kind: "select", choices: ["factor", "product", "sum"], correct: "product" },
    ],
    right: "Right — the numbers you multiply are factors; the answer is the product. 4 × 6 is one factor pair of 24.",
    wrong: "Not quite — the numbers you MULTIPLY are called factors, and the answer you get is called the product.",
  },
  {
    kind: "choice",
    prompt: "Maya says the factor pairs of 36 are 1 × 36, 2 × 18, 3 × 12, and 4 × 9. Did she find them all?",
    choices: ["Yes, that's all of them", "No — she missed 5 × 7", "No — she missed 6 × 6", "No — she missed 9 × 4"],
    correct: "No — she missed 6 × 6",
    right: "Right — after 4 comes 5 (doesn't work), then 6: 6 × 6 = 36. A number times itself counts as a pair too.",
    wrong: "Check in order: 1, 2, 3, 4, 5, 6 ... Does 6 go into 36? (5 × 7 = 35, not 36, and 9 × 4 is just 4 × 9 flipped.)",
  },
  {
    kind: "choice",
    prompt: "Checking 24 in order: 1 × 24, 2 × 12, 3 × 8, 4 × 6. Then 5 doesn't work. Then 6 gives 6 × 4. What should you do now?",
    choices: ["Write 6 × 4 as a new pair", "Stop — 6 × 4 is just 4 × 6 flipped, so every pair is found", "Keep checking every number up to 24"],
    correct: "Stop — 6 × 4 is just 4 × 6 flipped, so every pair is found",
    right: "Right — once the pairs start flipping around, you've found them all. 24 has 4 factor pairs.",
    wrong: "Look at 6 × 4 — have you seen those two numbers together already?",
  },
  {
    kind: "blanks",
    parts: ["“A bigger number always has more factor pairs.” This is ", ". For example, 97 has ", " factor pair(s), but 24 has 4."],
    blanks: [
      { kind: "select", choices: ["true", "false"], correct: "false" },
      { kind: "number", answer: 1 },
    ],
    right: "Right — 97's only pair is 1 × 97. Size doesn't decide how many factor pairs a number has.",
    wrong: "Not quite — try to find a pair for 97 besides 1 × 97. Does 2, 3, 5, or 7 go in evenly?",
  },
];

// ============================================================================
// FACTOR PAIR FINDER — Practice-only custom step (never used in a Test)
// ============================================================================

/**
 * The systematic check as a worksheet: one row per number from 1 up to the
 * stopping point (the last d with d × d ≤ n). For each row the student
 * decides "goes in evenly?" and, if yes, types the partner. One checked box
 * per decision/partner — the written procedure, not just a final count.
 */
function FactorPairFinder({ n, onDone }: { n: number; onDone: () => void }) {
  const stop = lastCheck(n);
  const rows = Array.from({ length: stop }, (_, i) => i + 1);
  const [verdict, setVerdict] = useState<string[]>(() => rows.map(() => ""));
  const [partner, setPartner] = useState<string[]>(() => rows.map(() => ""));
  const [checked, setChecked] = useState(false);
  const needs = rows.flatMap((d, i) => (verdict[i] === "yes" ? [verdict[i], partner[i]] : [verdict[i]]));
  const filled = allFilled(...needs);
  const verdictOk = (d: number, i: number) => verdict[i] === (n % d === 0 ? "yes" : "no");
  const partnerOk = (d: number, i: number) => Number(partner[i]) === n / d;
  const ok = rows.every((d, i) => verdictOk(d, i) && (verdict[i] !== "yes" || partnerOk(d, i)));
  const done = checked && filled && ok;
  useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const setV = (i: number, v: string) => {
    setChecked(false);
    setVerdict((all) => all.map((x, k) => (k === i ? v : x)));
  };
  const setP = (i: number, v: string) => {
    if (v !== "" && !/^\d+$/.test(v)) return;
    setChecked(false);
    setPartner((all) => all.map((x, k) => (k === i ? v : x)));
  };
  return (
    <div className="fmp-finder">
      <table>
        <tbody>
          {rows.map((d, i) => (
            <tr key={d}>
              <td>
                Does <b>{d}</b> go into {n} evenly?
              </td>
              <td>
                <select className="answer" aria-label={`Does ${d} go into ${n} evenly?`} value={verdict[i]} disabled={done} style={answerBorder(verdictOk(d, i), checked)} onChange={(e) => setV(i, e.target.value)}>
                  <option value="" disabled>
                    choose
                  </option>
                  <option value="yes">yes</option>
                  <option value="no">no</option>
                </select>
              </td>
              <td>
                {verdict[i] === "yes" && (
                  <span>
                    {n} = {d} ×{" "}
                    <input
                      className="answer"
                      aria-label={`partner of ${d}`}
                      inputMode="numeric"
                      autoComplete="off"
                      disabled={done}
                      value={partner[i]}
                      style={{ width: 64, ...answerBorder(partnerOk(d, i), checked) }}
                      onChange={(e) => setP(i, e.target.value)}
                    />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted small">
        Stop after {stop}: the next number is {stop + 1}, and {stop + 1} × {stop + 1} = {(stop + 1) * (stop + 1)} is bigger than {n}, so any more pairs would just be flipped ones you already have.
      </p>
      <div className="control-row">
        <button className="btn primary" type="button" disabled={!filled || done} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && filled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? `Every pair found: ${pairsText(n)}.` : "Not quite — red boxes need another look. Try dividing: is there a remainder?"}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [n, setN] = useState(36);
  const [tried, setTried] = useState(0);
  const stop = lastCheck(n);
  const finished = tried >= stop;
  const triedRows = Array.from({ length: tried }, (_, i) => i + 1);
  const found = factorPairs(n).filter(([a]) => a <= tried);
  const latest = found[found.length - 1];
  const changeN = (v: number) => {
    setN(v);
    setTried(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      {(introActive || showCheck) && <FixedCheck title="Check for Understanding: factor pairs" questions={CHECK} onComplete={onIntroDone} />}

      <div className="control-row">
        <Slider label="Number" value={n} min={1} max={100} onChange={changeN} />
        <Stepper label="Fine-tune" value={n} min={1} max={100} onChange={changeN} tone="a" />
      </div>
      <div className="control-row">
        <button className="btn primary" type="button" disabled={finished} onClick={() => setTried((t) => t + 1)}>
          {tried === 0 ? "Try 1" : finished ? "All pairs found" : `Try ${tried + 1}`}
        </button>
        <button className="btn ghost" type="button" disabled={finished} onClick={() => setTried(stop)}>
          Show all
        </button>
        <button className="btn ghost" type="button" disabled={tried === 0} onClick={() => setTried(0)}>
          Start over
        </button>
      </div>

      <FactorRainbow n={n} pairsShown={found.length} highlight={found.length - 1} />

      {triedRows.length > 0 && (
        <ul className="fmp-tried">
          {triedRows.map((d) => (
            <li key={d} className={n % d === 0 ? "yes" : "no"}>
              {n % d === 0 ? `${d} goes in evenly: ${n} = ${d} × ${n / d}` : `${d} doesn't go in evenly (${n} ÷ ${d} leaves ${n % d} left over)`}
            </li>
          ))}
        </ul>
      )}
      {finished && (
        <p className="says">
          Stop! The next number is {stop + 1}, and {stop + 1} × {stop + 1} = {(stop + 1) * (stop + 1)} is bigger than {n}. {n} has {found.length} factor pair{found.length === 1 ? "" : "s"}
          {isSquare(n) && n > 1 ? ` — including ${Math.sqrt(n)} × ${Math.sqrt(n)}, a number paired with itself` : ""}.
        </p>
      )}
      {latest && latest[1] <= 40 && (
        <div>
          <p className="muted small">
            The newest pair as an array: {latest[0]} row{latest[0] === 1 ? "" : "s"} of {latest[1]}.
          </p>
          <FactorRectangle rows={latest[0]} cols={latest[1]} width={300} height={Math.max(30, Math.min(160, (300 / latest[1]) * latest[0]))} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PRACTICE — one type, four buckets
// ============================================================================

type FactorBucket = "fewPairs" | "manyPairs" | "square" | "nearTop";

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const FEW = range(3, 79).filter((n) => !isSquare(n) && factorPairs(n).length <= 2);
const MANY = [24, 30, 40, 42, 48, 54, 56, 60, 66, 70, 72, 78];
const SQUARES = [4, 9, 16, 25, 36, 49, 64, 81, 100];
const TOP = range(80, 99).filter((n) => !isSquare(n));

const POOLS: Record<FactorBucket, number[]> = { fewPairs: FEW, manyPairs: MANY, square: SQUARES, nearTop: TOP };
const BUCKETS: FactorBucket[] = ["fewPairs", "manyPairs", "square", "nearTop"];

function factorPairProblem(target?: string): Problem {
  const bucket: FactorBucket = BUCKETS.includes(target as FactorBucket) ? (target as FactorBucket) : pick(BUCKETS);
  const n = pick(POOLS[bucket]);
  const pairs = factorPairs(n);
  const factors = factorsOf(n);
  const stop = lastCheck(n);
  // Follow-up: is a BIG number (above the stopping point) a factor? Half the
  // time a real partner, half a non-factor — answered by reading the pairs.
  const bigPartners = pairs.map(([, b]) => b).filter((b) => b > stop && b < n);
  const nonFactors = range(stop + 1, n - 1).filter((m) => n % m !== 0);
  const askYes = bigPartners.length > 0 && (nonFactors.length === 0 || Math.random() < 0.5);
  const m = askYes ? pick(bigPartners) : pick(nonFactors.length ? nonFactors : [n + 1]);
  const mPair = pairs.find(([, b]) => b === m);

  return {
    title: "Find every factor pair",
    bucket,
    story: (
      <>
        Find every factor pair of <b>{n}</b>. Check 1, 2, 3, ... in order so you don't skip one.
      </>
    ),
    visual: (done) => <FactorRainbow n={n} pairsShown={done >= 1 ? pairs.length : 0} />,
    steps: [
      customStep(
        {
          prompt: `Check each number from 1 to ${stop}. Does it go into ${n} evenly? If yes, what is its partner?`,
          hint: `Divide ${n} by each number. No remainder means it's a factor, and the answer is its partner.`,
          explain: `${n}'s factor pairs: ${pairsText(n)}.`,
        },
        (onDone) => <FactorPairFinder n={n} onDone={onDone} />,
        pairsText(n)
      ),
      {
        kind: "number",
        prompt: `How many different factors does ${n} have in all?`,
        hint: isSquare(n) ? `Count every number in your pairs — ${Math.sqrt(n)} is paired with itself, so count it only once.` : "Count every number in your pairs. Each pair gives two factors.",
        explain: `${factors.join(", ")}: ${factors.length} factors${isSquare(n) ? ` (${Math.sqrt(n)} counted once)` : ""}.`,
        answer: factors.length,
      },
      choice(
        {
          prompt: `Is ${m} a factor of ${n}?`,
          hint: `Look at your pairs. Is ${m} in one of them?`,
          explain: mPair ? `Yes — ${mPair[0]} × ${m} = ${n}. Big factors are the partners of small ones.` : `No — ${m} isn't in any of ${n}'s factor pairs.`,
        },
        mPair ? `Yes — ${mPair[0]} × ${m} = ${n}` : `No — ${m} isn't in any factor pair of ${n}`,
        mPair
          ? [`No — we only checked up to ${stop}`, `No — ${m} isn't in any factor pair of ${n}`] // MISCONCEPTION: big factors were "never checked"
          : [`Yes — ${m} is less than ${n}`, `Yes — ${m} is close to ${n}`] // MISCONCEPTION: smaller/close = factor
      ),
    ],
    wrapUp: `${n} has ${pairs.length} factor pair${pairs.length === 1 ? "" : "s"}: ${pairsText(n)}.`,
  };
}

function Preview() {
  return <FactorRainbow n={36} width={300} />;
}

export const factorPairsUnit: Unit = {
  id: "factorPairs",
  title: "Factor Pairs",
  goal: "Find every factor pair of a number from 1 to 100 by checking in order, so none get missed.",
  standard: "4.OA.4",
  keyIdea: (
    <>
      <p>
        A <b>factor pair</b> is two whole numbers that multiply to make a number: 4 × 6 = 24, so 4 and 6 are a factor pair of 24. The numbers you multiply are <b>factors</b>; the answer is the <b>product</b>.
      </p>
      <p>To find them all, try 1, 2, 3, ... in order. Stop once the number you're trying, times itself, is bigger than your number — after that, the pairs just flip around.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Factor Pairs", make: factorPairProblem, buckets: [...BUCKETS] }],
  requiredBuckets: [...BUCKETS],
  test: factorPairsTest,
};
