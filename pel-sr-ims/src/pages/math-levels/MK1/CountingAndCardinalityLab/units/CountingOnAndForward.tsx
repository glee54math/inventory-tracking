import { useEffect, useState } from "react";
import { CounterGroup, TenGroups } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem, type Step } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { countingOnAndForwardTest } from "./CountingOnAndForwardTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions (never randomized — a one-time comprehension
// check, not practice reps), same convention as every other gated unit in
// this app's labs (RealWorldNegatives.tsx, ComparingOrdering.tsx).

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: the NAME for the next number, plus what's special about it —
 *  not just "what number comes after 29," which a rote drill already asks. */
function NextNumberVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [word, setWord] = useState("");
  const [special, setSpecial] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [word, special].every((v) => String(v).trim() !== "");
  const wordOk = word === "thirty";
  const specialOk = special === "new-ten";
  const ok = wordOk && specialOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> You count: 27, 28, 29... What number comes right after 29?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Next number:{" "}
          <select className="answer" value={word} onChange={(e) => setWord(e.target.value)} style={fieldOk(wordOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="thirty">thirty</option>
            <option value="twenty-ten">twenty-ten</option>
            <option value="forty">forty</option>
          </select>
        </label>
        <label>
          What's special about it?{" "}
          <select className="answer" value={special} onChange={(e) => setSpecial(e.target.value)} style={fieldOk(specialOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="new-ten">It starts a brand new ten (the 30s)</option>
            <option value="odd">It's an odd number</option>
            <option value="before">It comes before 29</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — after 29 comes thirty, and thirty is the first number of a brand new ten (the 30s)."
            : 'Not quite — the number after 29 is NOT "twenty-ten." Every ten has exactly ten numbers (20-29 is the 20s), so after the last one (29) comes the first number of the next ten.'}
        </p>
      )}
    </div>
  );
}

/** The classic conflation: counting by ONES and counting by TENS from the
 *  SAME starting number — forces both ideas to be held at once instead of
 *  letting a student answer using whichever rule they memorized last. */
function OnesVsTensQuestion({ onComplete }: { onComplete?: () => void }) {
  const [tensNext, setTensNext] = useState("");
  const [onesNext, setOnesNext] = useState("");
  const [checked, setChecked] = useState(false);
  const tensOk = tensNext === "30";
  const onesOk = onesNext === "21";
  const ok = tensOk && onesOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  const selectRow = (label: string, value: string, setValue: (v: string) => void, isOk: boolean) => (
    <label>
      {label}:{" "}
      <select className="answer" value={value} onChange={(e) => setValue(e.target.value)} style={fieldOk(isOk, checked)}>
        <option value="" disabled>
          choose
        </option>
        <option value="21">21</option>
        <option value="30">30</option>
      </select>
    </label>
  );

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> You are at 20.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        {selectRow("Counting by TENS, next is", tensNext, setTensNext, tensOk)}
        {selectRow("Counting by ONES, next is", onesNext, setOnesNext, onesOk)}
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — counting by tens jumps a whole group of ten (20 to 30), but counting by ones moves just one step (20 to 21). Same starting number, two different \"next\" answers, depending on HOW you're counting."
            : "Not quite — \"by tens\" and \"by ones\" are different counting rules, even starting from the same number. By tens jumps a whole group of ten; by ones moves just one step."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: does the decade-crossing rule always
 *  hold, or was it a one-off coincidence for 29->30? */
function DecadeRuleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: every time a count crosses from a number ending in 9 (like 19, 29, 39...) to the very next number, that next
        number always ends in 0.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — it's always true, not just for 29. Every group of ten (the 20s, the 30s, the 40s...) has exactly ten numbers, so the number right after the last one (ending in 9) always starts the next ten, ending in 0."
            : "Not quite — check a few more examples: 19 → 20, 39 → 40, 59 → 60. Every ten has exactly ten numbers in it, so this pattern never breaks."}
        </p>
      )}
    </div>
  );
}

/** Multi-part production: apply the skill three times in a row, crossing a
 *  decade boundary partway through. */
function CountForwardThreeQuestion({ onComplete }: { onComplete?: () => void }) {
  const OPTIONS = ["37", "38", "39", "40", "41", "48"];
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [checked, setChecked] = useState(false);
  const aOk = a === "39";
  const bOk = b === "40";
  const cOk = c === "41";
  const ok = aOk && bOk && cOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  const selectRow = (label: string, value: string, setValue: (v: string) => void, isOk: boolean) => (
    <label>
      {label}:{" "}
      <select className="answer" value={value} onChange={(e) => setValue(e.target.value)} style={fieldOk(isOk, checked)}>
        <option value="" disabled>
          choose
        </option>
        {OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Start at 38. Count forward three numbers, in order.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        {selectRow("1st", a, setA, aOk)}
        {selectRow("2nd", b, setB, bOk)}
        {selectRow("3rd", c, setC, cOk)}
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 38, 39, 40, 41. You crossed right over a new ten (the 40s) partway through, without skipping or repeating any number."
            : "Not quite — count one at a time from 38: 39, then cross into a new ten at 40, then 41."}
        </p>
      )}
    </div>
  );
}

function CountingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, onesVsTens: false, decadeRule: false, countThree: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure counting forward makes sense before you try practice problems.</p>
      <NextNumberVocabQuestion onComplete={mark("vocab")} />
      <OnesVsTensQuestion onComplete={mark("onesVsTens")} />
      <DecadeRuleQuestion onComplete={mark("decadeRule")} />
      <CountForwardThreeQuestion onComplete={mark("countThree")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"ones" | "tens">("ones");
  const [current, setCurrent] = useState(1);
  const [trail, setTrail] = useState<number[]>([1]);

  const step = mode === "tens" ? 10 : 1;
  const sayNext = () => {
    const next = Math.min(100, current + step);
    setCurrent(next);
    setTrail((t) => [...t.slice(-4), next]);
  };
  const resetTo = (n: number) => {
    setCurrent(n);
    setTrail([n]);
  };
  const crossedDecade = trail.length > 1 && Math.floor(trail[trail.length - 1] / 10) !== Math.floor(trail[trail.length - 2] / 10);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="Count by"
          value={mode}
          onChange={(m) => {
            setMode(m);
            resetTo(m === "tens" ? 0 : 1);
          }}
          options={[{ id: "ones", label: "Ones" }, { id: "tens", label: "Tens" }]}
        />
        <Stepper label="Start at" value={current} min={0} max={95} step={1} onChange={resetTo} tone="a" />
        {!introActive && (
          <button
            type="button"
            className="btn ghost"
            style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined}
            onClick={() => setShowCheck((v) => !v)}
          >
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <CountingCheckForUnderstanding onComplete={onIntroDone} />}

      <div className="control-row" style={{ alignItems: "center" }}>
        <button className="btn primary" onClick={sayNext} disabled={current >= 100}>
          Say the next number
        </button>
        <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {trail.map((n, i) => (
            <span
              key={i}
              style={{
                fontWeight: 800,
                fontSize: 18,
                padding: "4px 10px",
                borderRadius: 999,
                background: i === trail.length - 1 && crossedDecade ? "var(--good-soft)" : "var(--grid)",
                color: i === trail.length - 1 && crossedDecade ? "var(--good)" : "var(--ink)",
              }}
            >
              {n}
            </span>
          ))}
        </span>
      </div>
      {crossedDecade && <p className="feedback good">You just started a brand new ten!</p>}

      <TenGroups value={current} tone="a" />
      <p className="muted small">
        {current === 0
          ? "Start at 0 and press the button to begin counting."
          : `You've counted up to ${current} — that's ${Math.floor(current / 10)} group${Math.floor(current / 10) === 1 ? "" : "s"} of ten and ${current % 10} more.`}{" "}
        Notice how every ten dots makes a new bundle — crossing from a number ending in 9 into the next ten (like 29 → 30) always starts a fresh bundle.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "onesShort" | "onesLong" | "tens" | "forwardCross";
const BUCKETS: Bucket[] = ["onesShort", "onesLong", "tens", "forwardCross"];

function countingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "onesShort") {
    const n = randInt(2, 19);
    const before = n - 1;
    const after = n + 1;
    return {
      title: "What comes next?",
      bucket,
      story: `Count the dots: there are ${before}. What number comes right after ${before} when you keep counting?`,
      visual: () => <CounterGroup count={before} arrangement="line" tone="a" seed={before} />,
      steps: [
        { kind: "number", prompt: `What number comes right after ${before}?`, hint: "Count one more than the dots shown.", explain: `${before} + 1 = ${n}.`, answer: n },
        { kind: "number", prompt: `Now what number comes right after ${n}?`, hint: "Keep going — one more than that.", explain: `${n} + 1 = ${after}.`, answer: after },
      ],
      wrapUp: `Counting forward from ${before}: ${before}, ${n}, ${after}.`,
    };
  }

  if (bucket === "onesLong") {
    const n = randInt(21, 99);
    const before = n - 1;
    const after = n + 1;
    return {
      title: "Keep counting",
      bucket,
      story: `There are ${before} counters, all bundled into groups of ten. What comes right after ${before}?`,
      visual: () => <TenGroups value={before} tone="a" />,
      steps: [
        { kind: "number", prompt: `What number comes right after ${before}?`, hint: "Count one more.", explain: `${before} + 1 = ${n}.`, answer: n },
        { kind: "number", prompt: `What number comes right after ${n}?`, hint: "One more again.", explain: `${n} + 1 = ${after}.`, answer: after },
      ],
      wrapUp: `${before}, ${n}, ${after}.`,
    };
  }

  if (bucket === "tens") {
    const t = randInt(0, 9);
    const prevVal = t * 10;
    const nextVal = (t + 1) * 10;
    return {
      title: "Counting by tens",
      bucket,
      story: `Count by tens: 10, 20, 30, and so on. If you've just said ${prevVal}, what comes next?`,
      visual: () => <TenGroups value={prevVal} tone="b" />,
      steps: [
        { kind: "number", prompt: `Counting by tens, what comes right after ${prevVal}?`, hint: "Each jump adds one whole group of ten.", explain: `${prevVal} + 10 = ${nextVal}.`, answer: nextVal },
        { kind: "number", prompt: `How many groups of ten is ${nextVal}?`, hint: "Each bundle is ten — count the bundles, not the dots.", explain: `${nextVal} is ${t + 1} group${t + 1 === 1 ? "" : "s"} of ten.`, answer: t + 1 },
      ],
      wrapUp: `Counting by tens: ${prevVal}, ${nextVal}.`,
    };
  }

  // forwardCross — the real difficulty bucket: starting mid-decade and
  // crossing the boundary. Biased (not guaranteed) toward a genuine crossing
  // so the hard case is reliably reached, without making every problem the
  // same shape.
  const crossing = Math.random() < 0.65;
  let startNum: number;
  if (crossing) {
    const d = randInt(1, 9); // decades 10s..90s, so the top edge (99 -> 100) is reachable too
    startNum = d * 10 + 9;
  } else {
    do {
      startNum = randInt(2, 97);
    } while (startNum % 10 === 9);
  }
  const next = startNum + 1;
  const steps: Step[] = [
    { kind: "number", prompt: `What number comes right after ${startNum}?`, hint: "Count one more than the number shown.", explain: `${startNum} + 1 = ${next}.`, answer: next },
  ];
  if (crossing) {
    const prevDecadeLabel = `the ${Math.floor(startNum / 10) * 10}s`;
    const nextDecadeLabel = next === 100 ? "100" : `the ${Math.floor(next / 10) * 10}s`;
    steps.push(
      choice(
        { prompt: `${startNum} to ${next} — which ten did you just start?`, hint: "A number ending in 9 is the LAST number of its ten — the next number starts a brand new ten.", explain: `${next} starts ${nextDecadeLabel}, right after finishing ${prevDecadeLabel}.` },
        nextDecadeLabel,
        [prevDecadeLabel]
      )
    );
  }
  steps.push({ kind: "number", prompt: `What number is one less than ${next}?`, hint: "One less means counting backward one step.", explain: `One less than ${next} is ${startNum}.`, answer: startNum });

  return {
    title: "Counting forward",
    bucket,
    story: `Start counting at ${startNum}. What comes next?`,
    visual: () => <TenGroups value={startNum} tone="c" />,
    steps,
    wrapUp: crossing ? `${startNum}, ${next} — crossing right into a brand new ten!` : `${startNum}, ${next}.`,
  };
}

export const countingOnAndForward: Unit = {
  id: "countingOnAndForward",
  title: "Counting On and Counting Forward",
  goal: "Count out loud in order, starting from 1 or from any number someone gives you.",
  standard: "K.CC.1, K.CC.2",
  keyIdea: (
    <>
      <p>Counting means saying numbers in order, each one exactly one more than the last — you can start at 1, or start anywhere someone tells you.</p>
      <p>Every group of ten numbers (the 20s, the 30s...) has exactly ten in it, so after a number ending in 9 always comes a fresh ten, ending in 0.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // The count sequence (including decade words) is a long-term memorized
  // fact, not something re-derived by reasoning each time — periodically
  // re-check it rather than trusting a single early pass forever.
  reintroEverySolved: 20,
  problems: [{ label: "Counting Forward", make: countingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: countingOnAndForwardTest,
};
