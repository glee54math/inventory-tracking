import { useId, useState } from "react";
import { CounterGroup, CountOutCard, TenGroups, countAlongMs, type Arrangement } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, pointing, tapCount, type Problem, type Step, type VisualHelp } from "../../../shared/engine/types";
import { countShowMe, countUp, thereAre } from "./words";
import { getState, sayText } from "../../../shared/tts/speechEngine";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { howManyCardinalityTest } from "./HowManyCardinalityTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, TypeCheck, type CheckMode } from "./KCheck";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K.CC.4c ("each successive number name refers to a quantity that's one
// larger") is folded in here as question 4, rather than into Unit 1 — it's
// as much about cardinality (what the new total IS) as it is about
// sequencing, per this lab's own plan notes.

// Kindergarten-sized, one question at a time (see KCheck.tsx). Ideas
// checked: the last number said is how many; moving counters doesn't change
// how many; a circle counted once around; one more is the next number.

const cfuCount = (n: number, arrangement: Arrangement, tone: "a" | "b" | "c", seed: number) => (m: CheckMode) => (
  <CounterGroup count={n} arrangement={arrangement} tone={tone} seed={seed} tapToCount={m === "ask" || m === "wrong"} countAlong={m === "show"} />
);

function CardinalityCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="How many in all?"
            answer={5}
            tone="a"
            picture={cfuCount(5, "line", "a", 5)}
            nudge="Not yet. Tap each one as you count."
            showText={`Watch and listen: ${countUp(1, 5)}. The last number is 5.`}
            praise="Yes! The last number you say tells how many."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many?"
            answer={6}
            tone="a"
            picture={cfuCount(6, "line", "b", 6)}
            nudge="Not yet. Tap each one as you count."
            showText={`Watch and listen: ${countUp(1, 6)}.`}
            praise="Yes! 6."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="We moved them! How many now?"
            answer={6}
            tone="a"
            picture={cfuCount(6, "scatter", "b", 66)}
            nudge="Nobody added any or took any away. Count again."
            why={{ 7: "Nobody added any. Count again.", 5: "Nobody took any away. Count again." }}
            showText={`Watch and listen: ${countUp(1, 6)}. Still 6.`}
            praise="Yes! Still 6. Moving them does not change how many."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="Count around the circle. How many?"
            answer={8}
            tone="c"
            picture={cfuCount(8, "circle", "c", 8)}
            nudge="Tap one to start. Go around once."
            why={{ 9: "You counted one twice. Stop where you started.", 10: "You counted some twice. Stop where you started." }}
            showText={`Watch and listen: ${countUp(1, 8)}.`}
            praise="Yes! 8. Start anywhere. It is still 8."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="How many?"
            answer={7}
            tone="a"
            picture={cfuCount(7, "array", "a", 7)}
            nudge="Not yet. Tap each one as you count."
            showText={`Watch and listen: ${countUp(1, 7)}.`}
            praise="Yes! 7."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="One more joins. How many now?"
            answer={8}
            tone="b"
            picture={(m) => <CounterGroup count={7} arrangement="array" tone="a" seed={7} oneMore={{ tone: "b", filled: m === "show" || m === "done" }} />}
            nudge="Look at the circle with the question mark. Say 7. Then say the next number."
            showText="Watch: 7, and one more makes 8."
            praise="Yes! One more than 7 is 8."
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
  const [count, setCount] = useState(8);
  const [arrangement, setArrangement] = useState<Arrangement>("scatter");
  const [order, setOrder] = useState<number[]>([]);
  const voiceId = useId();

  const newGroup = (n: number, a: Arrangement) => {
    setCount(n);
    setArrangement(a);
    setOrder([]);
  };

  const toggle = (i: number) => {
    if (order.includes(i)) return; // each object counted exactly once
    setOrder((o) => [...o, i]);
    // With sound on, say each number as it's counted.
    if (getState().autoRead) sayText(voiceId, String(order.length + 1));
  };

  const done = order.length === count;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Stepper label="How many counters" value={count} min={3} max={20} step={1} onChange={(n) => newGroup(n, arrangement)} tone="a" />
        <Segmented
          label="Arrangement"
          value={arrangement}
          onChange={(a) => newGroup(count, a)}
          options={[{ id: "line", label: "Line" }, { id: "array", label: "Grid" }, { id: "circle", label: "Circle" }, { id: "scatter", label: "Scattered" }]}
        />
        <button className="btn ghost" onClick={() => setOrder([])}>
          Start over
        </button>
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

      <ReadAloud as="p" className="muted small">Tap each counter once to count it. You can go in any order.</ReadAloud>
      <CounterGroup count={count} arrangement={arrangement} tone="a" seed={count * 9 + 5} countedOrder={order} onToggle={toggle} />
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        {order.length === 0 ? "" : done ? `That's ${order.length} in all — the LAST number you said!` : `Counted ${order.length} so far...`}
      </ReadAloud>
      {done && count < 20 && (
        <button
          className="btn primary"
          style={{ width: "fit-content" }}
          onClick={() => {
            setCount((c) => Math.min(20, c + 1));
            setOrder([]);
          }}
        >
          Add one more counter
        </button>
      )}
      <ReadAloud as="p" className="muted small">
        Try the same number of counters in a different arrangement (a circle is the trickiest — it's easy to lose track of where you started!). No
        matter the arrangement, counting correctly always gives the same total.
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <CardinalityCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "lineArray" | "scattered" | "circle" | "mixed20" | "countOut";
const BUCKETS: Bucket[] = ["lineArray", "scattered", "circle", "mixed20", "countOut"];

/** A "how many?" step with the counting walk-through. */
const countStep = (n: number, hint: string): Step => ({
  kind: "number",
  showMeHoldMs: countAlongMs(n),
  prompt: "How many counters are there in all?",
  hint,
  showMe: countShowMe(n),
  explain: `${thereAre(n)} The last number you say, ${n}, is how many in all.`,
  answer: n,
});

/** The "one more" follow-up step. */
const oneMoreStep = (n: number): Step => ({
  kind: "number",
  tone: "b", // matches the "?" spot in the picture
  showMeHoldMs: 2000,
  prompt: "If one more counter joined the group, how many would there be?",
  hint: `Look at the circle with the question mark. Say ${n}, then say the next number.`,
  showMe: `Say ${n}. Now one more: ${n + 1}.`,
  explain: `One more than ${n} is ${n + 1}.`,
  answer: n + 1,
});

function cardinalityProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  // Every counting picture plays the count-along during step 1's "Show me",
  // and its counters can be tapped to count them during step 1. With
  // `oneMore`, step 2 shows a "?" spot for the counter that joins, filled in
  // during "Show me" and once it's answered.
  const group = (n: number, arrangement: Arrangement, tone: "a" | "b" | "c", seed: number, oneMore = false) => (done: number, help?: VisualHelp) => (
    <CounterGroup
      count={n}
      arrangement={arrangement}
      tone={tone}
      seed={seed}
      countAlong={!!help?.showMe && help.step === 0}
      tapToCount={done === 0}
      oneMore={oneMore && done >= 1 && !(help?.showMe && help.step === 0) ? { tone: "b", filled: done >= 2 } : undefined}
    />
  );

  if (bucket === "lineArray") {
    const n = randInt(3, 10);
    const arrangement = pick(["line", "array"] as const);
    return {
      title: "How many in all?",
      bucket,
      story: "Count the counters. The LAST number you say tells how many there are in all.",
      visual: group(n, arrangement, "a", n * 5 + 1, true),
      steps: [countStep(n, "Touch each counter as you count it. Count each one once."), oneMoreStep(n)],
      wrapUp: `${thereAre(n)}`,
    };
  }

  if (bucket === "scattered") {
    const n = randInt(4, 10);
    return {
      title: "How many? They are all mixed up.",
      bucket,
      story: "These counters are all mixed up. Count carefully, so you don't count one twice or miss one!",
      visual: group(n, "scatter", "b", n * 23 + 7),
      steps: [
        countStep(n, "Touch each counter as you count it, so you don't skip one or count one twice."),
        choice(
          { prompt: "If you count the same counters again, what number will you get?", hint: "Nobody added or took away any counters.", showMe: `Nobody added or took any away. So counting again gives ${n} again.`, explain: `Counting again gives the same number: ${n}.` },
          String(n),
          [String(n + 1), String(Math.max(0, n - 1))]
        ),
      ],
      wrapUp: `${thereAre(n)} That stays true every time you count them.`,
    };
  }

  if (bucket === "circle") {
    const n = randInt(4, 10);
    return {
      title: "How many in a circle?",
      bucket,
      story: "These counters are in a circle. It's easy to forget which one you started with!",
      visual: group(n, "circle", "c", n * 31 + 2),
      steps: [
        countStep(n, "Pick one counter to start. Go around once. Stop when you get back to it."),
        choice(
          {
            prompt: "If you started counting from a different counter, would you get a different number?",
            hint: "It's the same counters. Only the starting place changed.",
            showMe: `It's the same counters, so you still get ${n}.`,
            explain: "No. Starting from a different counter never changes how many there are, if you count each one once.",
          },
          "No, the number would be the same",
          ["Yes, it depends which one you start with"]
        ),
      ],
      wrapUp: `${thereAre(n)} It doesn't matter where you start counting.`,
    };
  }

  if (bucket === "mixed20") {
    const n = randInt(11, 20);
    // Lined up in rows, not scattered: K.CC.5 asks for scattered groups only up to 10.
    const arrangement = pick(["line", "array"] as const);
    return {
      title: "How many in a bigger group?",
      bucket,
      story: "Count this bigger group carefully.",
      visual: group(n, arrangement, "a", n * 41 + 3, true),
      steps: [countStep(n, "Count slowly, one at a time. Count the top row first."), oneMoreStep(n)],
      wrapUp: `${thereAre(n)}`,
    };
  }

  // countOut (K.CC.5: "given a number from 1-20, count out that many
  // objects"): tap that many counters out of a bigger pile, and stop.
  const take = randInt(3, 15);
  const total = Math.min(20, take + randInt(3, 8));
  return {
    title: "Count some out",
    bucket,
    story: "Your friend needs some counters.",
    // Stuck: show that many dots in a ten-frame, so the student can see how many to stop at.
    // "Show me" stays on its own step: step 1 shows the counters counted out
    // (no "?" yet; that belongs to step 2), step 2 counts on to the new one.
    visual: (done, help) => {
      if (help?.showMe && help.step === 0) return <TenGroups value={take} tone="b" labels />;
      if (help?.showMe && help.step === 1) return <TenGroups value={take + 1} tone="b" labels countAlong={[take, take + 1]} targetTone="a" />;
      if (done === 0) return pointing(help, 0) ? <TenGroups value={take} tone="b" labels /> : <CountOutCard n={take} />;
      return <TenGroups value={take} tone="b" labels target={done < 2 ? take + 1 : undefined} targetTone="a" />;
    },
    steps: [
      tapCount(
        {
          prompt: `Tap ${take} counters to give to your friend.`,
          hint: `Say a number each time you tap. Stop when you say ${take}.`,
          showMe: `Tap one counter and say 1. Keep going: ${countUp(1, take)}. Stop at ${take}.`,
          explain: `You counted out ${take}.`,
        },
        total,
        take
      ),
      {
        kind: "number",
        tone: "a",
        showMeHoldMs: 2000,
        prompt: "Now your friend gets one more counter. How many does your friend have now?",
        hint: "Look at the box with the question mark. That is one more.",
        showMe: `Say ${take}. Now one more: ${take + 1}.`,
        explain: `One more than ${take} is ${take + 1}.`,
        answer: take + 1,
      },
    ],
    wrapUp: `You counted out ${take}. One more makes ${take + 1}.`,
  };
}

export const howManyCardinality: Unit = {
  id: "howManyCardinality",
  title: "How Many? (Cardinality and Counting Objects)",
  goal: "Count a group of objects and know that the last number you say tells you how many there are in total.",
  standard: "K.CC.4a-c, K.CC.5",
  keyIdea: (
    <>
      <p>When you count a group, the LAST number you say tells you how many there are in all — not just a name for the last object you touched.</p>
      <p>The total never depends on the arrangement or which object you started with — only on actually counting each one exactly once.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoning/procedure skill, not a memorized fact — a student who
  // understands one-to-one correspondence can always re-derive it, so no
  // reintroEverySolved here (unlike Units 1 and 2).
  problems: [{ label: "How Many?", make: cardinalityProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: howManyCardinalityTest,
};
