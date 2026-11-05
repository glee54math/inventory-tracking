import { useState } from "react";
import { LengthBars, BalanceScale } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingTest } from "./ComparingTwoObjectsDirectlyTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

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

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: which rod is longer, and how many blocks stick out; rods
// that don't start together (count, don't look at the ends); the heavy side
// of a balance goes down.

const rodBtn = (name: "Rod A" | "Rod B") => ({ id: name, label: <span style={{ color: name === "Rod A" ? "var(--qa)" : "var(--qb)", fontWeight: 800 }}>{name}</span> });

function ComparingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const lined = (extra = false, numberB = false) => (
    <LengthBars
      bars={[
        { blocks: 7, tone: "a", label: "Rod A", extraFrom: extra ? 4 : undefined },
        { blocks: 4, tone: "b", label: "Rod B", numbered: numberB },
      ]}
    />
  );
  const offset = (align = false, numbered = false) => (
    <LengthBars
      alignStarts={align}
      bars={[
        { blocks: 7, tone: "a", label: "Rod A", startOffset: 0, numbered },
        { blocks: 4, tone: "b", label: "Rod B", startOffset: 5, numbered },
      ]}
    />
  );
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="Which rod is longer?"
            picture={lined()}
            showPicture={lined(true)}
            showText="Look: Rod A sticks out past Rod B. Rod A is longer."
            options={[rodBtn("Rod A"), rodBtn("Rod B")]}
            answer="Rod A"
            why={{ "Rod B": "Look at the ends. Which rod sticks out farther?" }}
            praise="Yes! Rod A is longer."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={1}
            prompt="How many blocks of Rod A stick out past Rod B?"
            answer={3}
            tone="a"
            picture={(m) => lined(m === "show" || m === "done")}
            nudge="Look past the end of Rod B. Count only those blocks."
            why={{ 7: "That is all of Rod A. Count only the blocks past Rod B.", 4: "That is Rod B. Count the blocks past its end." }}
            showText="Watch and listen: the extra blocks are 1, 2, 3."
            praise="Yes! Rod A is 3 blocks longer."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={2}
            prompt="These rods start in different places. Which rod is longer?"
            picture={offset()}
            showPicture={offset(true)}
            showText="Watch: slide them to start together. Rod A is longer."
            options={[rodBtn("Rod A"), rodBtn("Rod B")]}
            answer="Rod A"
            why={{ "Rod B": "Rod B starts later, so its end is farther. Count the blocks!" }}
            praise="Yes! Rod A has more blocks, so it is longer."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many blocks long is Rod B?"
            answer={4}
            tone="b"
            picture={(m) => offset(false, m === "show" || m === "done")}
            nudge="Count each block in Rod B once."
            showText="Watch and listen: Rod B has 1, 2, 3, 4."
            praise="Yes! Rod B is only 4 blocks. Count blocks, not where the end is."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="Which side is heavier?"
            picture={<BalanceScale left={6} right={3} leftTone="a" rightTone="b" />}
            showPicture={<BalanceScale left={6} right={3} leftTone="a" rightTone="b" />}
            showText="Look: the heavy side goes down. The left side is down."
            options={[
              { id: "Left", label: "Left" },
              { id: "Right", label: "Right" },
            ]}
            answer="Left"
            why={{ Right: "The right side went up. The heavy side goes down." }}
            praise="Yes! The heavy side goes down."
            onComplete={done}
          />
        ),
      ]}
    />
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
      <div className="control-row" data-readaloud-part>
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

      <ReadAloud as="p" className="muted small">Drag the circle at the end of each rod to change how long it is.</ReadAloud>
      <LengthBars
        bars={[
          { blocks: blocksA, tone: "a", label: "Rod A" },
          { blocks: blocksB, tone: "b", label: "Rod B", startOffset: aligned === "offset" ? 3 : 0 },
        ]}
        onBlocksChange={(i, n) => (i === 0 ? setBlocksA(n) : setBlocksB(n))}
      />
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        {longer ? `Rod ${longer} is longer.` : "The rods are the same length."}
      </ReadAloud>

      <ReadAloud as="p" className="muted small">Add weight to each side of the balance and see which way it tips.</ReadAloud>
      <div className="control-row" data-readaloud-part>
        <Stepper label="Left weight" value={leftW} min={0} max={8} onChange={setLeftW} tone="a" />
        <Stepper label="Right weight" value={rightW} min={0} max={8} onChange={setRightW} tone="b" />
      </div>
      <BalanceScale left={leftW} right={rightW} leftTone="a" rightTone="b" />
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        {heavier ? `The ${heavier} side is heavier.` : "Both sides balance evenly."}
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <ComparingCheckForUnderstanding onComplete={onIntroDone} />}
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
      visual: (_done, help) => {
        // Step 1's "Show me" says how many blocks each rod has: count them on the picture.
        const numbered = !!help?.showMe && help.step === 0;
        return <LengthBars bars={[{ blocks: a, tone: "a", label: "Rod A", numbered }, { blocks: b, tone: "b", label: "Rod B", numbered }]} />;
      },
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
      visual: (_done, help) => {
        // Step 1's "Show me": slide Rod B back to the start line and number
        // the blocks, so "line them up, then compare" is actually shown.
        const demo = !!help?.showMe && help.step === 0;
        return (
          <LengthBars
            alignStarts={demo}
            bars={[{ blocks: a, tone: "a", label: "Rod A", startOffset: 0, numbered: demo }, { blocks: b, tone: "b", label: "Rod B", startOffset: offsetB, numbered: demo }]}
          />
        );
      },
      steps: [
        choice(
          { showMeHoldMs: 1200, prompt: "Which rod is ACTUALLY longer?", hint: "Rod B doesn't start where Rod A does — compare how many blocks each rod is actually made of.", explain: `Rod A has ${a} blocks and Rod B has ${b} blocks, so Rod ${longer} is actually longer, no matter where either one starts.` },
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
    visual: (_done, help) => {
      // Step 2's "Show me": ring and number the longer rod's extra blocks
      // (the ones past the end of the shorter rod).
      const extraFrom = help?.showMe && help.step === 1 ? shorterBlocks : undefined;
      return (
        <LengthBars
          bars={[
            { blocks: a, tone: "a", label: "Rod A", extraFrom: longer === "A" ? extraFrom : undefined },
            { blocks: b, tone: "b", label: "Rod B", extraFrom: longer === "B" ? extraFrom : undefined },
          ]}
        />
      );
    },
    steps: [
      choice({ prompt: "Which rod is longer?", hint: "Compare how far each one reaches.", explain: `Rod ${longer} is longer.` }, `Rod ${longer}`, [`Rod ${shorter}`]),
      {
        kind: "number",
        prompt: `How many blocks LONGER is Rod ${longer} than Rod ${shorter}?`,
        hint: "Count how many extra blocks the longer rod has.",
        showMe: `Look past the end of Rod ${shorter}. Count the extra blocks on Rod ${longer}: ${Array.from({ length: diff }, (_, i) => i + 1).join(", ")}.`,
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
