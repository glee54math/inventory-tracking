import { useEffect, useState } from "react";
import { TenFrame } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { makingTenTest } from "./MakingTenTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Named misconception (per the plan): counting up from 1 each time instead
// of recognizing/recalling the ten-complement. Question 2 surfaces that
// directly.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: "partner for 10." */
function PartnerVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [namePick, setNamePick] = useState("");
  const [valuePick, setValuePick] = useState("");
  const [checked, setChecked] = useState(false);
  const nameOk = namePick === "partner";
  const valueOk = valuePick === "4";
  const ok = nameOk && valueOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> 6 and 4 add up to exactly 10.
      </p>
      <TenFrame filled={6} tone="a" fillB={4} fillBTone="b" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          The number that joins 6 to make exactly 10 is called 6's ________ for 10.{" "}
          <select className="answer" value={namePick} onChange={(e) => setNamePick(e.target.value)} style={fieldOk(nameOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="partner">partner</option>
            <option value="opposite">opposite</option>
            <option value="double">double</option>
          </select>
        </label>
        <label>
          What is 6's partner for 10?{" "}
          <select className="answer" value={valuePick} onChange={(e) => setValuePick(e.target.value)} style={fieldOk(valueOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 4 is called 6's partner for 10, since 6 + 4 = 10." : "Not quite — the number that joins another to make exactly 10 is its partner for 10. For 6, that's 4, since 6 + 4 = 10."}
        </p>
      )}
    </div>
  );
}

/** THE named misconception: counting up from 1 vs. instant recall. */
function CountingUpVsRecallQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "recall";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> You need 7's partner for 10.
      </p>
      <p>
        Which is the better way to find it: COUNTING UP from 1 every time (1, 2, 3, 4, 5, 6, 7, 8, 9, 10 — then counting how many steps that was), or
        just KNOWING that 7 + 3 = 10 right away?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="counting">Counting up from 1 every time</option>
          <option value="recall">Just knowing it (recall)</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the goal is to just KNOW each partner for 10 right away, without recounting from 1 every single time. That's what makes it a fast fact."
            : "Not quite — counting up from 1 every time works, but it's slow. The goal is to eventually just KNOW each partner for 10 instantly, the way you'd know your own name."}
        </p>
      )}
    </div>
  );
}

/** Generalization: does every number 1-9 have exactly one partner for 10? */
function EveryNumberHasOneQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: every number from 1 to 9 has exactly one partner that makes 10 with it.
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
            ? "Correct — 1's partner is 9, 2's is 8, 3's is 7, 4's is 6, 5's is 5, and so on. Every number from 1 to 9 has exactly one partner for 10."
            : "Not quite — check a few: 1+9=10, 2+8=10, 3+7=10. Every number from 1 to 9 pairs with exactly one other number to make 10."}
        </p>
      )}
    </div>
  );
}

/** Reverse-direction verify, with BOTH a true and a false pair so neither
 *  can be answered by always picking the same option. */
function VerifyPairQuestion({ onComplete }: { onComplete?: () => void }) {
  const [truePick, setTruePick] = useState("");
  const [falsePick, setFalsePick] = useState("");
  const [checked, setChecked] = useState(false);
  const trueOk = truePick === "true";
  const falseOk = falsePick === "false";
  const ok = trueOk && falseOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Check these two pairs.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          6 and 4 — do these make 10?{" "}
          <select className="answer" value={truePick} onChange={(e) => setTruePick(e.target.value)} style={fieldOk(trueOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
        <label>
          5 and 4 — do these make 10?{" "}
          <select className="answer" value={falsePick} onChange={(e) => setFalsePick(e.target.value)} style={fieldOk(falseOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 6 + 4 = 10 is true, but 5 + 4 = 9, not 10, so that one is false. Always check the actual sum, not just whether the numbers 'look close.'"
            : "Not quite — add each pair exactly: 6 + 4 = 10 (true), but 5 + 4 = 9 (false, not 10). Close isn't the same as exact."}
        </p>
      )}
    </div>
  );
}

function MakingTenCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, strategy: false, everyNumber: false, verify: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure partners for 10 make sense before you try practice problems.</p>
      <PartnerVocabQuestion onComplete={mark("vocab")} />
      <CountingUpVsRecallQuestion onComplete={mark("strategy")} />
      <EveryNumberHasOneQuestion onComplete={mark("everyNumber")} />
      <VerifyPairQuestion onComplete={mark("verify")} />
    </div>
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
      <div className="control-row">
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
      {(introActive || showCheck) && <MakingTenCheckForUnderstanding onComplete={onIntroDone} />}

      <TenFrame filled={n} tone="a" fillB={revealed ? partner : 0} fillBTone="b" />
      <button className="btn primary" style={{ width: "fit-content" }} onClick={() => setRevealed((r) => !r)}>
        {revealed ? "Hide the partner" : "Reveal the partner for 10"}
      </button>
      <p className="feedback good" style={{ minHeight: 24 }}>
        {revealed ? `${n} + ${partner} = 10. ${n}'s partner for 10 is ${partner}.` : `How many MORE do you need to fill the frame to 10?`}
      </p>
      <p className="muted small">
        Try every starting number from 1 to 9 — notice each one has exactly ONE partner. The goal is to eventually just KNOW the partner instantly,
        without counting up from 1 each time.
      </p>
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
      visual: () => <TenFrame filled={n} tone="a" />,
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
    visual: () => <TenFrame filled={Math.min(10, p)} tone="a" fillB={0} />,
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
