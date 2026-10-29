import { useEffect, useState } from "react";
import { LengthBars, BalanceScale } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingTest } from "./ComparingTwoObjectsDirectlyTest";

// ============================================================================
// SHARED HELPERS — distinct-pair generators, duplicated (not imported) in
// ComparingTwoObjectsDirectlyTest.tsx per the usual *Test.tsx convention.
// ============================================================================

/**
 * Two distinct block counts in [1,12]. `nearTieChance` controls how often
 * the pair lands a "near tie" (difference of exactly 1 — the harder case to
 * judge at a glance) versus an "obviously different" pair (difference >= 3).
 * Folding near-tie-vs-obvious into a randomized difficulty regime inside
 * each comparison bucket, rather than a 5th disjoint bucket, mirrors the
 * same autonomous call MK1_CountingAndCardinalityLab's build made for its
 * own "close vs. obvious difference" plan bullet — see that build's final
 * report / VISUAL_COMPONENT_TODO.txt's MK1 entry.
 */
export function lengthPair(nearTieChance = 0.5): [number, number] {
  const a = randInt(3, 9);
  let b: number;
  if (Math.random() < nearTieChance) {
    b = a + (Math.random() < 0.5 ? 1 : -1);
  } else {
    const delta = randInt(3, 6) * (Math.random() < 0.5 ? 1 : -1);
    b = a + delta;
  }
  b = Math.max(1, Math.min(12, b));
  if (b === a) b = a + 1 <= 12 ? a + 1 : a - 1;
  return [a, b];
}

export function weightPair(nearTieChance = 0.5): [number, number] {
  const a = randInt(2, 7);
  let b: number;
  if (Math.random() < nearTieChance) {
    b = a + (Math.random() < 0.5 ? 1 : -1);
  } else {
    const delta = randInt(2, 4) * (Math.random() < 0.5 ? 1 : -1);
    b = a + delta;
  }
  b = Math.max(1, Math.min(8, b));
  if (b === a) b = a + 1 <= 8 ? a + 1 : a - 1;
  return [a, b];
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: "describe the difference" means a quantity, not just a winner. */
function DifferenceLanguageQuestion({ onComplete }: { onComplete?: () => void }) {
  const [longerPick, setLongerPick] = useState("");
  const [byPick, setByPick] = useState("");
  const [checked, setChecked] = useState(false);
  const longerOk = longerPick === "A";
  const byOk = byPick === "3";
  const ok = longerOk && byOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Rod A has 7 blocks. Rod B has 4 blocks. Both start at the same place.
      </p>
      <LengthBars bars={[{ blocks: 7, tone: "a", label: "Rod A" }, { blocks: 4, tone: "b", label: "Rod B" }]} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which rod is longer?{" "}
          <select className="answer" value={longerPick} onChange={(e) => setLongerPick(e.target.value)} style={fieldOk(longerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="A">Rod A</option>
            <option value="B">Rod B</option>
          </select>
        </label>
        <label>
          Rod A is longer than Rod B by how many blocks?{" "}
          <select className="answer" value={byPick} onChange={(e) => setByPick(e.target.value)} style={fieldOk(byOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="7">7</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — Rod A is longer, and it's longer BY 3 blocks (7 take away 4), not by its whole 7-block length."
            : "Not quite — \"by how many\" means the DIFFERENCE between the two rods, not either rod's whole length."}
        </p>
      )}
    </div>
  );
}

/** Common conflation: whose END is farther right is NOT the same question as who's longer. */
function MisalignedTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [endPick, setEndPick] = useState("");
  const [longerPick, setLongerPick] = useState("");
  const [checked, setChecked] = useState(false);
  const endOk = endPick === "B";
  const longerOk = longerPick === "A";
  const ok = endOk && longerOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Rod A has 7 blocks and starts at the dashed line. Rod B has 4 blocks but starts further to the right.
      </p>
      <LengthBars bars={[{ blocks: 7, tone: "a", label: "Rod A", startOffset: 0 }, { blocks: 4, tone: "b", label: "Rod B", startOffset: 5 }]} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which rod's END reaches farther to the right?{" "}
          <select className="answer" value={endPick} onChange={(e) => setEndPick(e.target.value)} style={fieldOk(endOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="A">Rod A</option>
            <option value="B">Rod B</option>
          </select>
        </label>
        <label>
          Which rod is ACTUALLY longer?{" "}
          <select className="answer" value={longerPick} onChange={(e) => setLongerPick(e.target.value)} style={fieldOk(longerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="A">Rod A</option>
            <option value="B">Rod B</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — Rod B's end reaches farther right, but Rod A (7 blocks) is actually longer than Rod B (4 blocks). Where a rod STARTS matters."
            : "Not quite — look at where each rod starts, not just where it ends. Rod B starts much further right, so its end can look farther along even though it's the shorter rod."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false: a fair comparison needs a shared starting point. */
function CommonStartQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: to compare two rods fairly by looking at their ends, they must start at the same point.
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
            ? "Correct — if two rods don't start together, comparing their ends alone can trick you (remember Rod A and Rod B above)."
            : "Not quite — think back to the last question. Rod B's end reached farther right, but it wasn't the longer rod, because it didn't start at the same place as Rod A."}
        </p>
      )}
    </div>
  );
}

/** Multi-part + vocabulary: the balance scale's own "tip" language. */
function BalanceVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [heavierPick, setHeavierPick] = useState("");
  const [tipPick, setTipPick] = useState("");
  const [checked, setChecked] = useState(false);
  const heavierOk = heavierPick === "Left";
  const tipOk = tipPick === "down";
  const ok = heavierOk && tipOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Look at the balance scale.
      </p>
      <BalanceScale left={6} right={3} leftTone="a" rightTone="b" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which side is heavier?{" "}
          <select className="answer" value={heavierPick} onChange={(e) => setHeavierPick(e.target.value)} style={fieldOk(heavierOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="Left">Left</option>
            <option value="Right">Right</option>
          </select>
        </label>
        <label>
          A heavier side makes the balance tip which way?{" "}
          <select className="answer" value={tipPick} onChange={(e) => setTipPick(e.target.value)} style={fieldOk(tipOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="up">up</option>
            <option value="down">down</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the Left side is heavier, and the heavier side always tips DOWN (the lighter side tips up)."
            : "Not quite — the side with more weight on it always sinks DOWN, not up."}
        </p>
      )}
    </div>
  );
}

function ComparingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ diffLanguage: false, misaligned: false, commonStart: false, balanceVocab: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure comparing two objects fairly makes sense before you try practice problems.</p>
      <DifferenceLanguageQuestion onComplete={mark("diffLanguage")} />
      <MisalignedTrapQuestion onComplete={mark("misaligned")} />
      <CommonStartQuestion onComplete={mark("commonStart")} />
      <BalanceVocabQuestion onComplete={mark("balanceVocab")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [blocksA, setBlocksA] = useState(5);
  const [blocksB, setBlocksB] = useState(8);
  const [aligned, setAligned] = useState<"aligned" | "offset">("aligned");
  const [leftW, setLeftW] = useState(4);
  const [rightW, setRightW] = useState(4);

  const longer = blocksA === blocksB ? null : blocksA > blocksB ? "A" : "B";
  const heavier = leftW === rightW ? null : leftW > rightW ? "Left" : "Right";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="control-row">
        <Segmented
          label="Starting point"
          value={aligned}
          onChange={(v) => setAligned(v as "aligned" | "offset")}
          options={[{ id: "aligned", label: "Same start" }, { id: "offset", label: "Different start" }]}
        />
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
      {(introActive || showCheck) && <ComparingCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">Drag the circle at the end of each rod to change how long it is.</p>
      <LengthBars
        bars={[
          { blocks: blocksA, tone: "a", label: "Rod A" },
          { blocks: blocksB, tone: "b", label: "Rod B", startOffset: aligned === "offset" ? 3 : 0 },
        ]}
        onBlocksChange={(i, n) => (i === 0 ? setBlocksA(n) : setBlocksB(n))}
      />
      <p className="feedback good" style={{ minHeight: 24 }}>
        {longer ? `Rod ${longer} is longer.` : "The rods are the same length."}
      </p>

      <p className="muted small">Add weight to each side of the balance and see which way it tips.</p>
      <div className="control-row">
        <Stepper label="Left weight" value={leftW} min={0} max={8} onChange={setLeftW} tone="a" />
        <Stepper label="Right weight" value={rightW} min={0} max={8} onChange={setRightW} tone="b" />
      </div>
      <BalanceScale left={leftW} right={rightW} leftTone="a" rightTone="b" />
      <p className="feedback good" style={{ minHeight: 24 }}>
        {heavier ? `The ${heavier} side is heavier.` : "Both sides balance evenly."}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "lengthAligned" | "lengthMisaligned" | "weightCompare" | "describeDifference";
const BUCKETS: Bucket[] = ["lengthAligned", "lengthMisaligned", "weightCompare", "describeDifference"];

function comparingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[Math.floor(Math.random() * BUCKETS.length)];

  if (bucket === "lengthAligned") {
    const [a, b] = lengthPair();
    const longer = a > b ? "A" : "B";
    const shorter = longer === "A" ? "B" : "A";
    return {
      title: "Which rod is longer?",
      bucket,
      story: "Both rods start at the same place (the dashed line).",
      visual: () => <LengthBars bars={[{ blocks: a, tone: "a", label: "Rod A" }, { blocks: b, tone: "b", label: "Rod B" }]} />,
      steps: [
        choice({ prompt: "Which rod is LONGER?", hint: "Both rods start together, so just compare how far each one reaches.", explain: `Rod A has ${a} blocks and Rod B has ${b} blocks, so Rod ${longer} is longer.` }, `Rod ${longer}`, [`Rod ${shorter}`]),
        choice({ prompt: "Which rod is SHORTER?", hint: "It's the other one.", explain: `Rod ${shorter} is shorter.` }, `Rod ${shorter}`, [`Rod ${longer}`]),
      ],
      wrapUp: `Rod ${longer} is longer than Rod ${shorter}.`,
    };
  }

  if (bucket === "lengthMisaligned") {
    const [a, b] = lengthPair();
    const offsetB = randInt(1, 4);
    const longer = a > b ? "A" : "B";
    const shorter = longer === "A" ? "B" : "A";
    return {
      title: "Which rod is actually longer?",
      bucket,
      story: "These rods do NOT start at the same place. Look at where each one starts, not just where it ends.",
      visual: () => (
        <LengthBars bars={[{ blocks: a, tone: "a", label: "Rod A", startOffset: 0 }, { blocks: b, tone: "b", label: "Rod B", startOffset: offsetB }]} />
      ),
      steps: [
        choice(
          { prompt: "Which rod is ACTUALLY longer?", hint: "Rod B doesn't start where Rod A does — compare how many blocks each rod is actually made of.", explain: `Rod A has ${a} blocks and Rod B has ${b} blocks, so Rod ${longer} is actually longer, no matter where either one starts.` },
          `Rod ${longer}`,
          [`Rod ${shorter}`]
        ),
        choice(
          { prompt: "True or false: the rod whose end is farther to the right is always the longer one.", hint: "Think about what you just found.", explain: "False — where a rod starts matters. A rod that starts farther right can still be the shorter one." },
          "False",
          ["True"]
        ),
      ],
      wrapUp: `Rod ${longer} is actually longer, even though the two rods don't start in the same place.`,
    };
  }

  if (bucket === "weightCompare") {
    const [left, right] = weightPair();
    const heavier = left > right ? "Left" : "Right";
    const lighter = heavier === "Left" ? "Right" : "Left";
    return {
      title: "Which side is heavier?",
      bucket,
      story: "Watch which side of the balance tips down.",
      visual: () => <BalanceScale left={left} right={right} leftTone="a" rightTone="b" />,
      steps: [
        choice({ prompt: "Which side is HEAVIER?", hint: "The heavier side tips down.", explain: `The ${heavier} side is heavier — it tips down.` }, heavier, [lighter]),
        choice({ prompt: "Which side is LIGHTER?", hint: "It's the side that tips up.", explain: `The ${lighter} side is lighter — it tips up.` }, lighter, [heavier]),
      ],
      wrapUp: `The ${heavier} side is heavier than the ${lighter} side.`,
    };
  }

  // describeDifference
  const [a, b] = lengthPair(0.3);
  const longer = a > b ? "A" : "B";
  const shorter = longer === "A" ? "B" : "A";
  const longerBlocks = Math.max(a, b);
  const shorterBlocks = Math.min(a, b);
  const diff = longerBlocks - shorterBlocks;
  return {
    title: "How much longer?",
    bucket,
    story: "Both rods start at the same place.",
    visual: () => <LengthBars bars={[{ blocks: a, tone: "a", label: "Rod A" }, { blocks: b, tone: "b", label: "Rod B" }]} />,
    steps: [
      choice({ prompt: "Which rod is longer?", hint: "Compare how far each one reaches.", explain: `Rod ${longer} is longer.` }, `Rod ${longer}`, [`Rod ${shorter}`]),
      {
        kind: "number",
        prompt: `How many blocks LONGER is Rod ${longer} than Rod ${shorter}?`,
        hint: "Count how many extra blocks the longer rod has.",
        explain: `Rod ${longer} has ${longerBlocks} blocks and Rod ${shorter} has ${shorterBlocks} blocks — that's ${diff} more.`,
        answer: diff,
      },
    ],
    wrapUp: `Rod ${longer} is longer than Rod ${shorter} by ${diff} block${diff === 1 ? "" : "s"}.`,
  };
}

export const comparingTwoObjectsDirectly: Unit = {
  id: "comparingTwoObjectsDirectly",
  title: "Comparing Two Objects Directly",
  goal: "Look at two objects side by side and tell which has more of an attribute (longer/heavier), and say how you know.",
  standard: "K.MD.2",
  keyIdea: (
    <>
      <p>To compare two objects fairly, line them up at the SAME starting point before looking at which one reaches farther.</p>
      <p>You can describe the DIFFERENCE, not just which one is more — "Rod A is longer than Rod B by 3 blocks," not just "Rod A is longer."</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Direct-comparison reasoning applied fresh each time, not a memorized fact.
  problems: [{ label: "Comparing Objects", make: comparingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: comparingTest,
};
