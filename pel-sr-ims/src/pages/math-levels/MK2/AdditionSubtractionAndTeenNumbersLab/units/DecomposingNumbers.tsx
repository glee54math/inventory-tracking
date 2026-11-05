import { useState } from "react";
import { SplitGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { decomposingNumbersTest } from "./DecomposingNumbersTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// This unit's named misconception (per the plan): believing a number has
// exactly ONE decomposition and stopping there. Every question below ties
// back to that directly.

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: a number splits into two parts; there is more than one way;
// two equal parts are a way too.

function DecomposingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="7 is 4 and how many more?"
            answer={3}
            tone="b"
            picture={() => <SplitGroup total={7} partA={4} toneA="a" toneB="b" />}
            nudge="Count the orange dots."
            showText="Watch and listen: the orange dots are 1, 2, 3."
            praise="Yes! 7 is 4 and 3."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="6 is 4 and 2. Here is another way. 6 is 3 and how many?"
            answer={3}
            tone="b"
            picture={() => (
              <div style={{ display: "grid", gap: 8 }}>
                <SplitGroup total={6} partA={4} toneA="a" toneB="b" />
                <SplitGroup total={6} partA={3} toneA="a" toneB="b" />
              </div>
            )}
            nudge="Look at the bottom row. Count the orange dots."
            showText="Watch and listen: in the bottom row, the orange dots are 1, 2, 3."
            praise="Yes! 6 is 3 and 3, too. There is more than one way."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="5 is 4 and 1. Is there another way to make 5?"
            picture={<SplitGroup total={5} partA={4} toneA="a" toneB="b" />}
            showPicture={<SplitGroup total={5} partA={3} toneA="a" toneB="b" />}
            showText="Look: move one dot over. 3 and 2 makes 5, too."
            options={[
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ]}
            answer="yes"
            why={{ no: "Try moving one blue dot to the orange side. Is it still 5?" }}
            praise="Yes! 5 is 4 and 1. 5 is also 3 and 2."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="Split 8 into two parts that are the same. How many in each part?"
            answer={4}
            tone="b"
            picture={(m) => (m === "show" || m === "done" ? <SplitGroup total={8} partA={4} toneA="a" toneB="b" /> : <SplitGroup total={8} partA={8} toneA="a" toneB="b" showDivider={false} />)}
            nudge="Make two groups with the same number of dots."
            why={{ 8: "That is all of them. Split them into two groups." }}
            showText="Watch: 4 blue and 4 orange. Both parts have 4."
            praise="Yes! 8 is 4 and 4."
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
  const [total, setTotal] = useState(7);
  const [partA, setPartA] = useState(4);
  const partB = total - partA;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Stepper
          label="Number to break apart"
          value={total}
          min={2}
          max={10}
          step={1}
          onChange={(n) => {
            setTotal(n);
            setPartA(Math.min(partA, n));
          }}
          tone="c"
        />
        <Stepper label="First part" value={partA} min={0} max={total} step={1} onChange={setPartA} tone="a" />
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

      <SplitGroup total={total} partA={partA} toneA="a" toneB="b" />
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        {total} breaks apart into {partA} and {partB}.
      </ReadAloud>
      <ReadAloud as="p" className="muted small">
        Move the "First part" slider to see every way to break {total} apart — {total} has {total + 1} different pairs (counting 0 and {total} themselves), not just one.
        {partA === partB && partA * 2 === total ? ` Right now both parts are EQUAL (${partA} and ${partB}) — that's still a valid way!` : ""}
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <DecomposingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "decomposeSmall" | "decomposeLarge" | "decomposeSecondWay" | "decomposeEqual";
const BUCKETS: Bucket[] = ["decomposeSmall", "decomposeLarge", "decomposeSecondWay", "decomposeEqual"];

function decomposingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "decomposeSmall") {
    const total = randInt(4, 5);
    const a = randInt(1, total - 1);
    const b = total - a;
    return {
      title: "Break it apart",
      bucket,
      story: `Break ${total} into two parts. The first part is ${a}.`,
      visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: `If the first part is ${a}, what is the second part?`, hint: "The two parts together make the whole number.", explain: `${a} + ${b} = ${total}.`, answer: b },
        choice(
          { prompt: `Is ${a} and ${b} the ONLY way to break ${total} apart?`, hint: "Think of at least one other pair that also makes the same total.", explain: `No — ${total} can also be broken apart other ways, like ${total - 1} and 1.` },
          "No, there are other ways too",
          ["Yes, that's the only way"] // misconception: believing a number has exactly one decomposition
        ),
      ],
      wrapUp: `${total} = ${a} + ${b}.`,
    };
  }

  if (bucket === "decomposeLarge") {
    const total = randInt(8, 10);
    const a = randInt(1, total - 1);
    const b = total - a;
    let otherA = a === 1 ? 2 : a - 1;
    if (otherA <= 0 || otherA >= total) otherA = a + 1 <= total - 1 ? a + 1 : 1;
    const otherB = total - otherA;
    return {
      title: "Break it apart",
      bucket,
      story: `Break ${total} into two parts. The first part is ${a}.`,
      // Step 2's "Show me" (and the finish) adds the DIFFERENT split underneath.
      visual: (done) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SplitGroup total={total} partA={a} toneA="a" toneB="b" />
          {done >= 2 && <SplitGroup total={total} partA={otherA} toneA="a" toneB="b" />}
        </div>
      ),
      steps: [
        { kind: "number", prompt: `If the first part is ${a}, what is the second part?`, hint: "The two parts together make the whole number — count carefully, there are more pairs to keep track of with a bigger number.", explain: `${a} + ${b} = ${total}.`, answer: b },
        { kind: "number", prompt: `Here's a DIFFERENT way: if the first part is ${otherA} instead, what would the second part be?`, hint: "The two parts still need to add up to the same total.", explain: `${otherA} + ${otherB} = ${total}.`, answer: otherB },
      ],
      wrapUp: `${total} = ${a} + ${b}, and also ${total} = ${otherA} + ${otherB}.`,
    };
  }

  if (bucket === "decomposeSecondWay") {
    const total = randInt(4, 10);
    const a1 = randInt(1, total - 1);
    const b1 = total - a1;
    let a2 = a1 - 1;
    if (a2 <= 0) a2 = a1 + 1;
    if (a2 >= total) a2 = a1 - 1 > 0 ? a1 - 1 : 1;
    const b2 = total - a2;
    return {
      title: "Find a different way",
      bucket,
      story: `Here's one way to break ${total} apart: ${a1} and ${b1}.`,
      // Step 1's "Show me" (and after) adds the new split underneath the first one.
      visual: (done) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SplitGroup total={total} partA={a1} toneA="a" toneB="b" />
          {done >= 1 && <SplitGroup total={total} partA={a2} toneA="a" toneB="b" />}
        </div>
      ),
      steps: [
        { kind: "number", prompt: `Find a DIFFERENT way: if the first part is ${a2}, what's the second part?`, hint: "Make sure the two new parts still add up to the same total, but aren't the same pair as before.", explain: `${a2} + ${b2} = ${total}.`, answer: b2 },
        choice(
          { prompt: `Is ${a2} and ${b2} the SAME way as ${a1} and ${b1}, or a DIFFERENT way?`, hint: "Compare the two pairs of numbers.", explain: `${a2} and ${b2} is a different pair from ${a1} and ${b1}, even though both add up to ${total}.` },
          "A different way",
          ["The same way"] // misconception: not recognizing a genuinely new pair as "different"
        ),
      ],
      wrapUp: `${total} = ${a1} + ${b1}, and ${total} = ${a2} + ${b2} — two different ways.`,
    };
  }

  // decomposeEqual — the special case some students treat as impossible.
  const half = randInt(2, 5);
  const total = half * 2;
  return {
    title: "Break it into equal parts",
    bucket,
    story: `Break ${total} into two EQUAL parts.`,
    visual: () => <SplitGroup total={total} partA={half} toneA="a" toneB="b" />,
    steps: [
      { kind: "number", prompt: `If you split ${total} into two EQUAL parts, how much is in EACH part?`, hint: "Both parts need to be the exact same amount, and together they still make the whole total.", explain: `${half} + ${half} = ${total}.`, answer: half },
      choice(
        { prompt: `True or false: ${total} can be broken into two equal parts.`, hint: "You just found those equal parts in the last step.", explain: `True — ${total} = ${half} + ${half}, two equal parts.` },
        "True",
        ["False"] // misconception: thinking equal-parts decomposition is impossible or doesn't count
      ),
    ],
    wrapUp: `${total} = ${half} + ${half}.`,
  };
}

export const decomposingNumbers: Unit = {
  id: "decomposingNumbers",
  title: "Breaking Numbers Apart",
  goal: "Break any number up to 10 into two smaller parts, in more than one way.",
  standard: "K.OA.3",
  keyIdea: (
    <>
      <p>Decomposing a number means breaking it into two parts that add back up to the whole — and almost every number can be decomposed in MORE than one way, not just one.</p>
      <p>Equal parts (like 8 = 4 + 4) are still a valid decomposition, just like any other pair.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // "More than one way" is always re-derivable by reasoning/trial — nothing
  // fixed to memorize, so no reintroEverySolved here.
  problems: [{ label: "Breaking Apart", make: decomposingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: decomposingNumbersTest,
};
