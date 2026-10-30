import { useEffect, useState } from "react";
import { CounterGroup, type Arrangement } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingGroupsAndNumeralsTest } from "./ComparingGroupsAndNumeralsTest";

const bigDigit = (d: number | string) => (
  <span style={{ display: "inline-block", fontSize: 54, fontWeight: 800, fontFamily: "'Courier New', monospace" }}>{d}</span>
);

/** Two rows, LEFT-ALIGNED with a fixed gap, so matching pairs really do line
 *  up column-by-column — the "extra," unmatched counters past the shorter
 *  row's length render with a dashed outline instead of a solid fill, as the
 *  direct visual tell for "this one ran out first." Local to this unit
 *  (nothing else in the lab needs fixed-gap left-aligned rows — CounterGroup's
 *  own arrangements all center/space relative to count, which is exactly
 *  wrong for a side-by-side matching comparison). */
function MatchingRows({ countA, countB }: { countA: number; countB: number }) {
  const GAP = 30;
  const R = 13;
  const PAD = 20;
  const n = Math.max(countA, countB, 1);
  const width = PAD * 2 + GAP * (n - 1) + 2 * R;
  const rowY = [34, 86];
  const colors = [palette.a, palette.b];
  const counts = [countA, countB];
  return (
    <svg viewBox={`0 0 ${width} 110`} role="img" aria-label={`Two rows lined up: ${countA} and ${countB}`} style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}>
      {counts.map((count, row) => (
        <g key={row}>
          <text x={PAD} y={rowY[row] - R - 6} fontSize={12} fontWeight={700} fill={colors[row]}>
            {row === 0 ? "Top row" : "Bottom row"}
          </text>
          {Array.from({ length: count }, (_, i) => {
            const matched = i < Math.min(countA, countB);
            return (
              <circle
                key={i}
                cx={PAD + R + i * GAP}
                cy={rowY[row]}
                r={R}
                fill={matched ? colors[row] : "none"}
                stroke={matched ? palette.paper : colors[row]}
                strokeWidth={matched ? 2 : 3}
                strokeDasharray={matched ? undefined : "4 3"}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** THE mandatory target per this unit's plan: "takes up more space = more
 *  objects" is an extremely common misconception at this age and must be
 *  checked directly, not assumed away. */
function SpaceVsCountQuestion({ onComplete }: { onComplete?: () => void }) {
  const [morePick, setMorePick] = useState("");
  const [changesPick, setChangesPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [morePick, changesPick].every((v) => String(v).trim() !== "");
  const moreOk = morePick === "equal";
  const changesOk = changesPick === "false";
  const ok = moreOk && changesOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Both groups below have exactly 6 counters — one is spread out, one is bunched up close together.
      </p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <CounterGroup count={6} arrangement="array" tone="a" seed={6} />
        <CounterGroup count={6} arrangement="scatter" tone="b" seed={606} />
      </div>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which group has more counters?{" "}
          <select className="answer" value={morePick} onChange={(e) => setMorePick(e.target.value)} style={fieldOk(moreOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="bunched">The bunched-up group</option>
            <option value="spread">The spread-out group</option>
            <option value="equal">They have the same amount</option>
          </select>
        </label>
        <label>
          True or false: spreading counters out so they take up more space makes the total bigger.{" "}
          <select className="answer" value={changesPick} onChange={(e) => setChangesPick(e.target.value)} style={fieldOk(changesOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — both groups have exactly 6. Spreading counters out (or squeezing them together) changes how much SPACE they take up, but never changes how MANY there are."
            : "Not quite — count each group one at a time. They both have 6, even though the spread-out one looks bigger at a glance."}
        </p>
      )}
    </div>
  );
}

/** Vocabulary: "more than" and "fewer than," defined together on the same
 *  pair of groups so neither can be answered by pattern-matching the other. */
function MoreFewerVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [morePick, setMorePick] = useState("");
  const [fewerPick, setFewerPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [morePick, fewerPick].every((v) => String(v).trim() !== "");
  const moreOk = morePick === "A";
  const fewerOk = fewerPick === "B";
  const ok = moreOk && fewerOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Group A has 7 counters. Group B has 4 counters.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which group has MORE counters?{" "}
          <select className="answer" value={morePick} onChange={(e) => setMorePick(e.target.value)} style={fieldOk(moreOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="A">Group A</option>
            <option value="B">Group B</option>
          </select>
        </label>
        <label>
          Which group has FEWER counters?{" "}
          <select className="answer" value={fewerPick} onChange={(e) => setFewerPick(e.target.value)} style={fieldOk(fewerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="A">Group A</option>
            <option value="B">Group B</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? '"More than" means a bigger amount — Group A (7) has more. "Fewer than" means a smaller amount — Group B (4) has fewer.'
            : 'Not quite — "more" means a bigger count, "fewer" means a smaller count. Compare 7 and 4 again.'}
        </p>
      )}
    </div>
  );
}

/** Conflation: comparing OBJECTS and comparing NUMERALS feel like different
 *  tasks to a first-timer, but they're the same idea of "bigger." */
function ObjectsVsNumeralsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> You can compare two groups of objects by counting them, OR compare two written numerals (like 6 and 9) with no objects shown at
        all.
      </p>
      <p>True or false: comparing numerals uses a completely different idea of "bigger" than comparing groups of objects.</p>
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
            ? "False — it's the exact same idea either way. 9 is bigger than 6 because nine OBJECTS would be more than six objects. The numeral just stands in for the count."
            : "Not quite — a numeral is just a written stand-in for a count. Comparing 6 and 9 means exactly the same thing as comparing 6 objects to 9 objects."}
        </p>
      )}
    </div>
  );
}

/** Multi-part: close differences take more careful counting than obvious ones. */
function CloseVsObviousQuestion({ onComplete }: { onComplete?: () => void }) {
  const [morePick, setMorePick] = useState("");
  const [typePick, setTypePick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [morePick, typePick].every((v) => String(v).trim() !== "");
  const moreOk = morePick === "7";
  const typeOk = typePick === "close";
  const ok = moreOk && typeOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Group A has 6 counters. Group B has 7 counters.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which group has more?{" "}
          <select className="answer" value={morePick} onChange={(e) => setMorePick(e.target.value)} style={fieldOk(moreOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="6">Group A (6)</option>
            <option value="7">Group B (7)</option>
          </select>
        </label>
        <label>
          Is this an easy difference to spot at a glance, or a close one that needs careful counting?{" "}
          <select className="answer" value={typePick} onChange={(e) => setTypePick(e.target.value)} style={fieldOk(typeOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="easy">Easy to spot at a glance</option>
            <option value="close">Close — needs careful counting</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 7 is more than 6, but just by 1, so this is a CLOSE comparison. A difference like 3 vs. 9 would be obvious at a glance; 6 vs. 7 needs an actual careful count."
            : "Not quite — count both groups exactly. A difference of just 1 (like 6 vs. 7) is close, and close differences need careful counting, not a quick glance."}
        </p>
      )}
    </div>
  );
}

function ComparingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ space: false, vocab: false, objVsNum: false, closeVsObvious: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure comparing makes sense before you try practice problems.</p>
      <SpaceVsCountQuestion onComplete={mark("space")} />
      <MoreFewerVocabQuestion onComplete={mark("vocab")} />
      <ObjectsVsNumeralsQuestion onComplete={mark("objVsNum")} />
      <CloseVsObviousQuestion onComplete={mark("closeVsObvious")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [a, setA] = useState(6);
  const [b, setB] = useState(4);
  const [arrA, setArrA] = useState<Arrangement>("array");
  const [arrB, setArrB] = useState<Arrangement>("scatter");

  const verdict = a === b ? "the same as" : a > b ? "more than" : "fewer than";
  const symbol = a === b ? "=" : a > b ? ">" : "<";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Group A" value={a} min={0} max={10} step={1} onChange={setA} tone="a" />
        <Segmented label="A's look" value={arrA} onChange={setArrA} options={[{ id: "line", label: "Line" }, { id: "array", label: "Grid" }, { id: "scatter", label: "Scattered" }]} />
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
      <div className="control-row">
        <Stepper label="Group B" value={b} min={0} max={10} step={1} onChange={setB} tone="b" />
        <Segmented label="B's look" value={arrB} onChange={setArrB} options={[{ id: "line", label: "Line" }, { id: "array", label: "Grid" }, { id: "scatter", label: "Scattered" }]} />
      </div>
      {(introActive || showCheck) && <ComparingCheckForUnderstanding onComplete={onIntroDone} />}

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <CounterGroup count={a} arrangement={arrA} tone="a" seed={a * 9 + 1} />
        <CounterGroup count={b} arrangement={arrB} tone="b" seed={b * 9 + 2} />
      </div>
      <p className="muted small">
        Group A has {a}, Group B has {b} — Group A has <b>{verdict}</b> Group B. "More than" means a bigger amount; "fewer than" means a smaller
        amount; "the same as" means equal amounts. Try spreading one group out or bunching it up — the comparison never changes, because the
        COUNT didn't change.
      </p>

      <div className="align-stack-wrap">
        <p>
          <b>Just the numerals</b> — no objects at all:
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {bigDigit(a)}
          <span style={{ fontSize: 40, fontWeight: 800 }}>{symbol}</span>
          {bigDigit(b)}
        </div>
        <p className="muted small">Comparing the numerals {a} and {b} is the exact same idea as comparing {a} objects to {b} objects.</p>
      </div>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "matching" | "countCompare" | "diffMagnitude" | "equalTrap" | "numeralCompare";
const BUCKETS: Bucket[] = ["matching", "countCompare", "diffMagnitude", "equalTrap", "numeralCompare"];

const randDistinctPair = (min: number, max: number): [number, number] => {
  const a = randInt(min, max);
  let b = randInt(min, max);
  while (b === a) b = randInt(min, max);
  return [a, b];
};

function comparingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "matching") {
    const [a, b] = randDistinctPair(1, 10);
    const more = Math.max(a, b);
    const fewer = Math.min(a, b);
    const moreRow = a > b ? "Top row" : "Bottom row";
    const fewerRow = a > b ? "Bottom row" : "Top row";
    return {
      title: "Line them up",
      bucket,
      story: "Line up the two rows. Whichever row runs out first has fewer.",
      visual: () => <MatchingRows countA={a} countB={b} />,
      steps: [
        choice(
          { prompt: "Which row has MORE?", hint: "Look at which row still has extra (dashed) counters left after the other one runs out.", explain: `The ${moreRow} has more — it has extra counters the ${fewerRow} doesn't have a partner for.` },
          moreRow,
          [fewerRow]
        ),
        {
          kind: "number",
          prompt: `How many MORE does the ${moreRow} have than the ${fewerRow}?`,
          hint: "Count the unmatched (dashed) counters.",
          explain: `${more} − ${fewer} = ${more - fewer}.`,
          answer: more - fewer,
        },
      ],
      wrapUp: `The ${moreRow} has ${more - fewer} more than the ${fewerRow}.`,
    };
  }

  if (bucket === "countCompare") {
    const [a, b] = randDistinctPair(1, 10);
    const more = a > b ? "Group A" : "Group B";
    const fewer = a > b ? "Group B" : "Group A";
    return {
      title: "Count and compare",
      bucket,
      story: "Count each group, then compare.",
      visual: () => (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <CounterGroup count={a} arrangement="scatter" tone="a" seed={a * 5 + 11} />
          <CounterGroup count={b} arrangement="scatter" tone="b" seed={b * 5 + 13} />
        </div>
      ),
      steps: [
        choice({ prompt: "Which group has MORE?", hint: "Count each group carefully, then compare the two numbers.", explain: `Group A has ${a}, Group B has ${b}, so ${more} has more.` }, more, [fewer]),
        choice({ prompt: "Which group has FEWER?", hint: "Fewer means the smaller count.", explain: `${fewer} has fewer.` }, fewer, [more]),
      ],
      wrapUp: `Group A has ${a}, Group B has ${b}.`,
    };
  }

  if (bucket === "diffMagnitude") {
    const close = Math.random() < 0.55;
    let a: number, b: number;
    if (close) {
      a = randInt(1, 9);
      b = Math.random() < 0.5 ? a + 1 : a - 1;
      if (b < 0) b = a + 1;
    } else {
      const base = randInt(1, 7);
      a = base;
      b = base + randInt(3, 6);
      if (Math.random() < 0.5) [a, b] = [b, a];
    }
    a = Math.max(0, Math.min(10, a));
    b = Math.max(0, Math.min(10, b));
    if (a === b) b = a === 10 ? a - 1 : a + 1; // guard against the rare clamp collision
    const more = Math.max(a, b);
    const fewer = Math.min(a, b);
    const diff = more - fewer;
    return {
      title: "Which has more?",
      bucket,
      story: `One group has ${a}. The other has ${b}.`,
      visual: () => (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <CounterGroup count={a} arrangement="line" tone="a" seed={a * 3 + 1} />
          <CounterGroup count={b} arrangement="line" tone="b" seed={b * 3 + 2} />
        </div>
      ),
      steps: [
        { kind: "number", prompt: "What is the bigger of the two counts?", hint: "Compare the two numbers.", explain: `The bigger count is ${more}.`, answer: more },
        { kind: "number", prompt: "How many more is that than the smaller count?", hint: "Subtract the smaller from the bigger.", explain: `${more} − ${fewer} = ${diff}.`, answer: diff },
      ],
      wrapUp: diff === 1 ? `${more} and ${fewer} are close — just 1 apart.` : `${more} is clearly more than ${fewer} — a difference of ${diff}.`,
    };
  }

  if (bucket === "equalTrap") {
    const n = randInt(3, 10);
    return {
      title: "Same amount, different look",
      bucket,
      story: "Both groups below have the same number of counters — they just look different.",
      visual: () => (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <CounterGroup count={n} arrangement="array" tone="a" seed={n * 2 + 1} />
          <CounterGroup count={n} arrangement="scatter" tone="b" seed={n * 2 + 200} />
        </div>
      ),
      steps: [
        choice(
          {
            prompt: "Which group has more — the grid group, the scattered group, or are they the same?",
            hint: "Spreading counters out doesn't add any — count both groups to be sure.",
            explain: `Both groups have ${n}. Spreading them out only changes how much space they take up, not how many there are.`,
          },
          "They're the same",
          ["The grid group", "The scattered group"]
        ),
        { kind: "number", prompt: "Count one of the groups. How many are in it?", hint: "Count every counter in either group — they match.", explain: `Each group has ${n}.`, answer: n },
      ],
      wrapUp: `Both groups have ${n}, even though one looks more spread out.`,
    };
  }

  // numeralCompare
  const [a, b] = randDistinctPair(1, 10);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  return {
    title: "Compare the numerals",
    bucket,
    story: `Compare these two numerals: ${a} and ${b}. No objects this time — just the numbers.`,
    visual: () => (
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {bigDigit(a)}
        <span style={{ fontSize: 30, color: "var(--muted)" }}>vs.</span>
        {bigDigit(b)}
      </div>
    ),
    steps: [
      choice({ prompt: `Which numeral is BIGGER, ${a} or ${b}?`, hint: "A bigger numeral always stands for a bigger amount.", explain: `${bigger} is bigger than ${smaller}.` }, String(bigger), [String(smaller)]),
      choice({ prompt: `Which numeral is SMALLER, ${a} or ${b}?`, hint: "Smaller means the lesser amount.", explain: `${smaller} is smaller than ${bigger}.` }, String(smaller), [String(bigger)]),
    ],
    wrapUp: `${bigger} is bigger than ${smaller}.`,
  };
}

export const comparingGroupsAndNumerals: Unit = {
  id: "comparingGroupsAndNumerals",
  title: "Comparing Groups and Numerals",
  goal: "Tell whether one group has more, fewer, or the same amount as another group, and tell which written number is bigger.",
  standard: "K.CC.6, K.CC.7",
  keyIdea: (
    <>
      <p>"More than" means a bigger amount, "fewer than" means a smaller amount, and "the same as" means equal amounts — found by actually counting, never by how much space a group takes up.</p>
      <p>Comparing written numerals (like 6 and 9) is the exact same idea as comparing groups of objects — the numeral just stands in for the count.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Comparison is a reasoning skill applied fresh every time — nothing fixed
  // to memorize, so no reintroEverySolved (unlike Units 1 and 2).
  problems: [{ label: "Comparing", make: comparingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: comparingGroupsAndNumeralsTest,
};
