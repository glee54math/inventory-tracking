import { useState } from "react";
import { TenFrame } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { makingTenTest } from "./MakingTenTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Named misconception (per the plan): counting up from 1 each time instead
// of recognizing/recalling the ten-complement. Question 2 surfaces that
// directly.

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: a number's partner for 10 fills the empty boxes; checking a
// pair really makes 10 instead of "looks close".

const partnerQuestion = (n: number, start: number, done: () => void) => (
  <TypeCheck
    n={n}
    prompt={`${start} and how many make 10?`}
    answer={10 - start}
    tone="b"
    picture={(m) => <TenFrame filled={start} tone="a" fillB={m === "show" || m === "done" ? 10 - start : 0} fillBTone="b" />}
    nudge="Count the empty boxes."
    showText={`Watch: the empty boxes fill in. ${start} and ${10 - start} make 10.`}
    praise={`Yes! ${start} and ${10 - start} make 10.`}
    onComplete={done}
  />
);

function MakingTenCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => partnerQuestion(1, 6, done),
        (done) => partnerQuestion(2, 7, done),
        (done) => partnerQuestion(3, 2, done),
        (done) => (
          <PickCheck
            n={4}
            prompt="Do 5 and 4 make 10?"
            picture={<TenFrame filled={5} tone="a" fillB={4} fillBTone="b" />}
            showPicture={<TenFrame filled={5} tone="a" fillB={4} fillBTone="b" />}
            showText="Look: one box is still empty. 5 and 4 make 9."
            options={[
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ]}
            answer="no"
            why={{ yes: "Look again. Is every box full?" }}
            praise="Right! One box is empty. 5 and 4 make 9."
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
  const [n, setN] = useState(6);
  const [revealed, setRevealed] = useState(false);
  const partner = 10 - n;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Stepper
          label="Starting number"
          value={n}
          min={1}
          max={9}
          step={1}
          onChange={(v) => {
            setN(v);
            setRevealed(false);
          }}
          tone="a"
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

      <TenFrame filled={n} tone="a" fillB={revealed ? partner : 0} fillBTone="b" />
      <button className="btn primary" style={{ width: "fit-content" }} onClick={() => setRevealed((r) => !r)}>
        {revealed ? "Hide the partner" : "Reveal the partner for 10"}
      </button>
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        {revealed ? `${n} + ${partner} = 10. ${n}'s partner for 10 is ${partner}.` : `How many MORE do you need to fill the frame to 10?`}
      </ReadAloud>
      <ReadAloud as="p" className="muted small">
        Try every starting number from 1 to 9 — notice each one has exactly ONE partner. The goal is to eventually just KNOW the partner instantly,
        without counting up from 1 each time.
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <MakingTenCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "smallComplement" | "nearTenComplement" | "middleComplement" | "verifyPair";
const BUCKETS: Bucket[] = ["smallComplement", "nearTenComplement", "middleComplement", "verifyPair"];

function makingTenProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "smallComplement" || bucket === "nearTenComplement" || bucket === "middleComplement") {
    const n = bucket === "smallComplement" ? randInt(1, 3) : bucket === "nearTenComplement" ? randInt(7, 9) : randInt(4, 6);
    const partner = 10 - n;
    const doubled = n * 2; // diagnosable mistake: doubling instead of finding the complement
    return {
      title: "Find the partner for 10",
      bucket,
      story: `What number goes with ${n} to make exactly 10?`,
      // "Show me" for step 1 fills the empty boxes in the partner color.
      visual: (done) => <TenFrame filled={n} tone="a" fillB={done >= 1 ? partner : 0} />,
      steps: [
        { kind: "number", prompt: `What number goes with ${n} to make 10?`, hint: "Count the empty boxes left in the ten frame.", explain: `${n} + ${partner} = 10.`, answer: partner },
        choice(
          { prompt: "Which number sentence shows this partner pair?", hint: "The two partners add up to exactly 10.", explain: `${n} + ${partner} = 10.` },
          `${n} + ${partner} = 10`,
          [`${n} + ${n} = 10`, `${partner} − ${n} = 10`] // misconceptions: doubling instead of finding the complement; wrong operation
        ),
      ],
      wrapUp: `${n}'s partner for 10 is ${partner}, since ${n} + ${partner} = 10.${doubled === 10 ? "" : ""}`,
    };
  }

  // verifyPair — reverse-direction check, true half the time, false half the
  // time. The false branch's near-miss must land ±1 away from the real
  // partner, never accidentally ON it — handled directly per-branch here
  // (not via one shared guard applied to both branches), since on the true
  // branch `shownQ` is deliberately EQUAL to actualPartner already, so a
  // guard written to catch "landed on actualPartner" would misfire there too.
  const p = randInt(1, 9);
  const isTrue = Math.random() < 0.5;
  const actualPartner = 10 - p;
  let shownQ = actualPartner;
  if (!isTrue) {
    const nearMiss = actualPartner + (Math.random() < 0.5 ? 1 : -1);
    shownQ = nearMiss <= 0 ? actualPartner + 1 : nearMiss; // only actualPartner=1 with -1 needs the fallback
  }
  const trulyTrue = p + shownQ === 10;
  return {
    title: "Does this pair make 10?",
    bucket,
    story: `${p} and ${shownQ}.`,
    // Step 1's "Show me" adds the shown number's dots (any past 10 spill outside
    // the frame); step 2's "Show me" and the finish show the real partner.
    visual: (done, help) => {
      if (done >= 2) return <TenFrame filled={p} tone="a" fillB={actualPartner} />;
      if (help?.showMe && help.step === 0)
        return <TenFrame filled={p} tone="a" fillB={Math.min(shownQ, actualPartner)} overflow={Math.max(0, shownQ - actualPartner)} />;
      return <TenFrame filled={Math.min(10, p)} tone="a" fillB={0} />;
    },
    steps: [
      choice(
        { prompt: `Do ${p} and ${shownQ} make exactly 10?`, hint: "Add them exactly — don't just guess from how close they look.", explain: `${p} + ${shownQ} = ${p + shownQ}${trulyTrue ? ", which is 10." : `, which is NOT 10.`}` },
        trulyTrue ? "Yes" : "No",
        [trulyTrue ? "No" : "Yes"]
      ),
      { kind: "number", prompt: `What is ${p}'s ACTUAL partner for 10?`, hint: "Find the number that really does add with it to make exactly 10.", explain: `${p} + ${actualPartner} = 10.`, answer: actualPartner },
    ],
    wrapUp: `${p}'s partner for 10 is ${actualPartner}.`,
  };
}

export const makingTen: Unit = {
  id: "makingTen",
  title: "Making 10",
  goal: "Instantly know what number to add to any number 1-9 to make exactly 10.",
  standard: "K.OA.4",
  keyIdea: (
    <>
      <p>Every number from 1 to 9 has exactly one partner that makes 10 with it: 1&amp;9, 2&amp;8, 3&amp;7, 4&amp;6, 5&amp;5.</p>
      <p>The goal is to just KNOW each partner instantly — not to count up from 1 every single time.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Ten-complements are a small, fixed fact set meant for long-term
  // memorization (K.OA.4's actual goal is instant recall, not re-derivation
  // by counting) — periodically re-check rather than trusting one early pass.
  reintroEverySolved: 20,
  problems: [{ label: "Partners for 10", make: makingTenProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: makingTenTest,
};
