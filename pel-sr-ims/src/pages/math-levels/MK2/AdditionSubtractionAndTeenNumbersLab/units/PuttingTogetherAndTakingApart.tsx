import { useState } from "react";
import { SplitGroup, Fingers } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { puttingTogetherAndTakingApartTest } from "./PuttingTogetherAndTakingApartTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions (never randomized), same convention as every
// other gated unit in this app's labs. This is the first unit introducing
// addition/subtraction as concepts at all, so the CFU specifically targets
// confusing which operation matches which action wording.

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: putting together makes more (3 + 2 = 5); taking away leaves
// fewer (5 − 2 = 3); matching fingers to a number sentence.

function PuttingTogetherCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="Put 3 and 2 together. How many in all?"
            answer={5}
            tone="a"
            picture={() => <SplitGroup total={5} partA={3} toneA="a" toneB="b" />}
            nudge="Count all the dots, blue and orange."
            showText="Watch and listen: 1, 2, 3, 4, 5."
            praise="Yes! 3 + 2 = 5."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="Mia has 5 apples. She gives 2 away. How many are left?"
            answer={3}
            tone="a"
            picture={() => <SplitGroup total={5} partA={3} toneA="a" toneB="b" goneB />}
            nudge="The faded ones went away. Count the ones left."
            why={{ 5: "2 went away. Count only the ones left.", 7: "She gave some away. That makes fewer, not more." }}
            showText="Watch and listen: the ones left are 1, 2, 3."
            praise="Yes! 5 − 2 = 3."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="You take some away. Do you have more, or fewer?"
            picture={<SplitGroup total={6} partA={4} toneA="a" toneB="b" goneB />}
            showPicture={<SplitGroup total={6} partA={4} toneA="a" toneB="b" goneB />}
            showText="Look: the faded ones went away. There are fewer left."
            options={[
              { id: "more", label: "More" },
              { id: "fewer", label: "Fewer" },
            ]}
            answer="fewer"
            why={{ more: "Some went away. Is the group bigger or smaller now?" }}
            praise="Yes! Taking away leaves fewer."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="3 fingers and 1 finger. How many fingers?"
            answer={4}
            tone="a"
            picture={() => <Fingers count={4} tone="a" />}
            nudge="Count every finger that is up."
            showText="Watch and listen: 1, 2, 3, 4."
            praise="Yes! 4 fingers."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="Which one matches the fingers?"
            picture={<Fingers count={4} tone="a" />}
            showPicture={<Fingers count={4} tone="a" />}
            showText="We put 3 and 1 together. Together is plus: 3 + 1 = 4."
            options={[
              { id: "3+1=4", label: "3 + 1 = 4" },
              { id: "3-1=4", label: "3 − 1 = 4" },
            ]}
            answer="3+1=4"
            why={{ "3-1=4": "Minus means take away. We put the fingers together." }}
            praise="Yes! 3 + 1 = 4."
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
  const [mode, setMode] = useState<"join" | "apart">("join");
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const total = a + b;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="What's happening"
          value={mode}
          onChange={setMode}
          options={[{ id: "join", label: "Putting together" }, { id: "apart", label: "Taking apart" }]}
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

      <div className="control-row" data-readaloud-part>
        <Stepper label={mode === "join" ? "First group" : "Whole group"} value={a} min={0} max={10} step={1} onChange={setA} tone="a" />
        <Stepper label={mode === "join" ? "Second group" : "Part taken apart"} value={b} min={0} max={10 - a} step={1} onChange={setB} tone="b" />
      </div>

      <SplitGroup total={total} partA={a} toneA="a" toneB="b" />
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        {mode === "join"
          ? `${a} and ${b} JOIN together to make ${total} in all.`
          : `${total} splits APART into ${a} and ${b}.`}
      </ReadAloud>
      <ReadAloud as="p" className="muted small">
        {mode === "join"
          ? `Written as a number sentence: ${a} + ${b} = ${total}. The + symbol means the two groups are joining together.`
          : `Written as a number sentence: ${total} − ${b} = ${a}. The − symbol means a part is being taken away from the whole.`}
      </ReadAloud>

      <ReadAloud className="align-stack-wrap">
        <p>
          <b>Same idea, with fingers</b> — no picture of objects this time.
        </p>
        <Fingers count={total} tone="c" />
        <p className="muted small">{a} fingers and {b} fingers makes {total} fingers in all — fingers work exactly like any other group of objects.</p>
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <PuttingTogetherCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "addTo" | "takeFrom" | "fingers" | "equation";
const BUCKETS: Bucket[] = ["addTo", "takeFrom", "fingers", "equation"];

const ADD_SCENES = [
  { noun: "ducks", verb: "swim over to join them", glyph: "🦆" },
  { noun: "bunnies", verb: "hop over to join them", glyph: "🐰" },
  { noun: "balloons", verb: "float over to join them", glyph: "🎈" },
] as const;
const SUB_SCENES = [
  { noun: "birds", verb: "fly away", glyph: "🐦" },
  { noun: "cookies", verb: "get eaten", glyph: "🍪" },
  { noun: "balloons", verb: "pop and are gone", glyph: "🎈" },
] as const;

function puttingTogetherProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "addTo") {
    const a = randInt(1, 8);
    const b = randInt(1, Math.min(9, 10 - a));
    const total = a + b;
    const scene = pick(ADD_SCENES);
    return {
      title: "Putting groups together",
      bucket,
      story: `There are ${a} ${scene.noun}. ${b} more ${scene.noun} ${scene.verb}.`,
      // Step 2's "Show me" fades the joiners so only the starting group stands out.
      visual: (_done, help) => <SplitGroup total={total} partA={a} toneA="a" toneB="b" goneB={!!help?.showMe && help.step === 1} />,
      steps: [
        { kind: "number", prompt: `How many ${scene.noun} are there now, all together?`, hint: "Count every object in the picture, both colors.", explain: `${a} + ${b} = ${total}.`, answer: total },
        { kind: "number", prompt: `Before the ${b} more joined, how many ${scene.noun} were there?`, hint: "Look back at just the first group's color.", explain: `There were ${a} to start, before ${b} more joined.`, answer: a },
      ],
      wrapUp: `${a} and ${b} joined together to make ${total}.`,
    };
  }

  if (bucket === "takeFrom") {
    const total = randInt(2, 10);
    const b = randInt(1, total - 1);
    const a = total - b;
    const scene = pick(SUB_SCENES);
    return {
      title: "Taking a group apart",
      bucket,
      story: `There are ${total} ${scene.noun}. ${b} of them ${scene.verb}.`,
      // Once step 1 is shown/answered, the part that went away fades out.
      visual: (done) => <SplitGroup total={total} partA={a} toneA="a" toneB="b" showDivider goneB={done >= 1} />,
      steps: [
        { kind: "number", prompt: `How many ${scene.noun} are left?`, hint: "Count only the color that's still there.", explain: `${total} − ${b} = ${a}.`, answer: a },
        { kind: "number", prompt: `How many ${scene.noun} were there before any ${scene.verb}?`, hint: "Add the part that's left back to the part that went away.", explain: `${a} + ${b} = ${total}, so there were ${total} to start.`, answer: total },
      ],
      wrapUp: `${total} split apart into ${a} left and ${b} gone.`,
    };
  }

  if (bucket === "fingers") {
    const a = randInt(1, 5);
    const b = randInt(1, Math.min(5, 10 - a));
    const total = a + b;
    const joining = Math.random() < 0.7;
    return {
      title: "Show it with fingers",
      bucket,
      story: joining
        ? `Hold up ${a} fingers on one hand and ${b} fingers on the other hand.`
        : `Hold up ${total} fingers. Put ${b} of them down.`,
      // Step 2 ("one more finger") shows that extra finger going up once it's
      // shown/answered (Fingers draws at most 10).
      visual: (done) => <Fingers count={(joining ? total : a) + (done >= 2 ? 1 : 0)} tone="c" />,
      steps: [
        { kind: "number", prompt: joining ? "How many fingers are up in all?" : "How many fingers are still up?", hint: "Count every raised finger on both hands.", explain: joining ? `${a} + ${b} = ${total}.` : `${total} − ${b} = ${a}.`, answer: joining ? total : a },
        { kind: "number", prompt: "If one more finger went up, how many would be raised then?", hint: "One more than your last answer.", explain: `One more than ${joining ? total : a} is ${(joining ? total : a) + 1}.`, answer: (joining ? total : a) + 1 },
      ],
      wrapUp: joining ? `${a} fingers and ${b} fingers makes ${total} in all.` : `${total} fingers take away ${b} leaves ${a}.`,
    };
  }

  // equation — symbolic translation AFTER the concrete reasoning step, not a
  // standalone arithmetic bucket (per this unit's plan).
  const joining = Math.random() < 0.5;
  if (joining) {
    const a = randInt(1, 8);
    const b = randInt(1, Math.min(9, 10 - a));
    const total = a + b;
    return {
      title: "Write the number sentence",
      bucket,
      story: `${a} fish are in a pond. ${b} more fish swim in to join them.`,
      visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: "How many fish are in the pond now?", hint: "Count every fish, both colors.", explain: `${a} + ${b} = ${total}.`, answer: total },
        choice(
          { prompt: "Which number sentence matches this story?", hint: "The two groups are joining together — that's the + symbol.", explain: `${a} fish joined by ${b} more fish makes ${a} + ${b} = ${total}.` },
          `${a} + ${b} = ${total}`,
          [`${total} + ${b} = ${a}`, `${a} − ${b} = ${total}`] // misconceptions: total on the wrong side; wrong operation
        ),
      ],
      wrapUp: `${a} + ${b} = ${total}.`,
    };
  }
  const total = randInt(2, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return {
    title: "Write the number sentence",
    bucket,
    story: `${total} fish are in a pond. ${b} of them swim away.`,
    visual: (done) => <SplitGroup total={total} partA={a} toneA="a" toneB="b" goneB={done >= 1} />,
    steps: [
      { kind: "number", prompt: "How many fish are left in the pond?", hint: "Count only the fish still there.", explain: `${total} − ${b} = ${a}.`, answer: a },
      choice(
        { prompt: "Which number sentence matches this story?", hint: "A part is leaving the whole — that's the − symbol.", explain: `${total} fish, ${b} swam away, leaves ${total} − ${b} = ${a}.` },
        `${total} − ${b} = ${a}`,
        [`${a} − ${b} = ${total}`, `${total} + ${b} = ${a}`] // misconceptions: operand order swapped; wrong operation
      ),
    ],
    wrapUp: `${total} − ${b} = ${a}.`,
  };
}

export const puttingTogetherAndTakingApart: Unit = {
  id: "puttingTogetherAndTakingApart",
  title: "Putting Together and Taking Apart",
  goal: "Show adding as groups joining together, and subtracting as a group splitting apart, using objects, pictures, or fingers.",
  standard: "K.OA.1",
  keyIdea: (
    <>
      <p>Adding means two groups JOIN together to make one bigger group. Subtracting means a group splits APART and a part leaves.</p>
      <p>You can show this with real objects, with fingers, or with a number sentence like 3 + 2 = 5 — they all mean the exact same thing.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // The very first concept in the lab — a reasoning/representation skill a
  // student can always re-derive by acting it out again, not a fact to
  // memorize, so no reintroEverySolved here.
  problems: [{ label: "Join or Take Apart", make: puttingTogetherProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: puttingTogetherAndTakingApartTest,
};
