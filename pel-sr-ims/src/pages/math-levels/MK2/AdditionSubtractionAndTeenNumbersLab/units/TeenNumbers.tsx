import { useEffect, useState } from "react";
import { TenAndOnes } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { teenNumbersTest } from "./TeenNumbersTest";

const NUMBER_WORDS: Record<number, string> = {
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
  16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen",
};

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Named misconception (per the plan): treating the "1" in a teen numeral as
// just another single digit, rather than a full ten-group.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: what each digit of a teen numeral actually stands for. */
function DigitMeaningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [tensPick, setTensPick] = useState("");
  const [onesPick, setOnesPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [tensPick, onesPick].every((v) => String(v).trim() !== "");
  const tensOk = tensPick === "ten";
  const onesOk = onesPick === "four";
  const ok = tensOk && onesOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Look at the number 14.
      </p>
      <TenAndOnes tens={1} ones={4} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          In 14, the "1" stands for:{" "}
          <select className="answer" value={tensPick} onChange={(e) => setTensPick(e.target.value)} style={fieldOk(tensOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="one">one single object</option>
            <option value="ten">a whole group of ten</option>
          </select>
        </label>
        <label>
          In 14, the "4" stands for:{" "}
          <select className="answer" value={onesPick} onChange={(e) => setOnesPick(e.target.value)} style={fieldOk(onesOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="four">four extra ones</option>
            <option value="fourTens">four tens</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — in 14, the '1' stands for a whole group of TEN, not a single object, and the '4' stands for 4 extra ones."
            : "Not quite — the '1' in a teen number is never just one single object; it stands for one whole group of ten. The second digit is the extra ones."}
        </p>
      )}
    </div>
  );
}

/** Conflation: does "sixteen" mean 16 separate ones, or a ten-group plus 6? */
function TeenStructureQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "tenPlusSix";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Think about the number "sixteen."
      </p>
      <p>Is "sixteen" best thought of as 16 separate single ones with no groups at all, or as ONE group of ten plus 6 more ones?</p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="sixteenOnes">16 separate single ones</option>
          <option value="tenPlusSix">One group of ten plus 6 more ones</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — both describe the same total amount, but 'one group of ten plus 6 more ones' is the structure that actually matches how 16 is written and built."
            : 'Not quite — 16 objects really are the same amount either way, but "sixteen" is built from ONE bundled ten-group plus 6 more ones, not just a pile of 16 loose ones.'}
        </p>
      )}
    </div>
  );
}

/** Generalization: does this "ten plus more" structure hold for every teen number? */
function EveryTeenQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: every number from 11 to 19 is made of exactly one group of ten, plus some extra ones.
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
            ? "Correct — 11 (ten + 1) all the way through 19 (ten + 9) are all built the exact same way: one ten-group, plus some extra ones."
            : "Not quite — check a few: 11 is ten plus 1, 15 is ten plus 5, 19 is ten plus 9. This pattern holds for every one of them."}
        </p>
      )}
    </div>
  );
}

/** Multi-part production: build a teen number AND record it as an equation,
 *  including the digit-swap trap this skill is especially prone to. */
function BuildAndRecordQuestion({ onComplete }: { onComplete?: () => void }) {
  const [numberPick, setNumberPick] = useState("");
  const [eqPick, setEqPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [numberPick, eqPick].every((v) => String(v).trim() !== "");
  const numberOk = numberPick === "13";
  const eqOk = eqPick === "10+3=13";
  const ok = numberOk && eqOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> 10 objects are bundled into one ten-group. 3 more ones are added.
      </p>
      <TenAndOnes tens={1} ones={3} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What teen number is this?{" "}
          <select className="answer" value={numberPick} onChange={(e) => setNumberPick(e.target.value)} style={fieldOk(numberOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="13">13</option>
            <option value="31">31</option>
          </select>
        </label>
        <label>
          Which equation records this?{" "}
          <select className="answer" value={eqPick} onChange={(e) => setEqPick(e.target.value)} style={fieldOk(eqOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="10+3=13">10 + 3 = 13</option>
            <option value="10+3=31">10 + 3 = 31</option>
            <option value="13-10=3">13 − 10 = 3</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — one ten-group plus 3 more ones is 13, recorded as 10 + 3 = 13. Watch out for 31 — that's the digits written backwards!"
            : 'Not quite — 10 + 3 = 13, NOT 31. Writing the digits backwards ("31" instead of "13") is a really common mix-up with teen numbers.'}
        </p>
      )}
    </div>
  );
}

function TeenNumbersCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ digits: false, structure: false, every: false, buildRecord: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure teen numbers make sense before you try practice problems.</p>
      <DigitMeaningQuestion onComplete={mark("digits")} />
      <TeenStructureQuestion onComplete={mark("structure")} />
      <EveryTeenQuestion onComplete={mark("every")} />
      <BuildAndRecordQuestion onComplete={mark("buildRecord")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [ones, setOnes] = useState(4);
  const teen = 10 + ones;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Extra ones beyond a full ten" value={ones} min={1} max={9} step={1} onChange={setOnes} tone="b" />
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
      {(introActive || showCheck) && <TeenNumbersCheckForUnderstanding onComplete={onIntroDone} />}

      <TenAndOnes tens={1} ones={ones} tenTone="a" onesTone="b" />
      <p className="feedback good" style={{ minHeight: 24 }}>
        1 full ten-group and {ones} extra ones make {teen} — "{NUMBER_WORDS[teen]}."
      </p>
      <p className="muted small">
        Written as a number sentence: 10 + {ones} = {teen}. The "1" in {teen} always means that whole ten-group, never just one single object — and
        every number from 11 to 19 is built exactly the same way.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "composeTeen" | "decomposeTeen" | "teenVocab" | "equationRecord";
const BUCKETS: Bucket[] = ["composeTeen", "decomposeTeen", "teenVocab", "equationRecord"];

function teenNumbersProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "composeTeen") {
    const ones = randInt(1, 9);
    const teen = 10 + ones;
    return {
      title: "Build a teen number",
      bucket,
      story: `You have 1 full group of ten and ${ones} more loose ones.`,
      visual: () => <TenAndOnes tens={1} ones={ones} />,
      steps: [
        { kind: "number", prompt: "What number is this?", hint: "A full ten-group plus some extra ones.", explain: `10 + ${ones} = ${teen}.`, answer: teen },
        choice(
          { prompt: `In the number ${teen}, which digit tells you there's a full ten-group?`, hint: "One of the two digits always means the ten-group, no matter which teen number it is.", explain: `The tens digit (1) means the full ten-group; the ones digit (${ones}) means the extra ones.` },
          "The tens digit (1)",
          [`The ones digit (${ones})`] // misconception: attributing the ten-group to the wrong digit
        ),
      ],
      wrapUp: `10 + ${ones} = ${teen}.`,
    };
  }

  if (bucket === "decomposeTeen") {
    const teen = randInt(11, 19);
    const ones = teen - 10;
    return {
      title: "Break apart a teen number",
      bucket,
      story: `Look at the number ${teen}.`,
      visual: () => <TenAndOnes tens={1} ones={ones} />,
      steps: [
        { kind: "number", prompt: `${teen} is made of 1 ten-group and how many more ones?`, hint: "Take away the ten-group — what's left over?", explain: `${teen} − 10 = ${ones}.`, answer: ones },
        choice(
          { prompt: `Does ${teen} include a full ten-group, or is it just ${ones} loose ones with no group at all?`, hint: "A teen number is always more than just its ones digit.", explain: `${teen} includes a full ten-group PLUS ${ones} more ones — not just ${ones} loose ones.` },
          "It includes a full ten-group",
          [`It's just ${ones} loose ones`] // misconception: ignoring the ten-group and focusing only on the ones digit
        ),
      ],
      wrapUp: `${teen} = 10 + ${ones}.`,
    };
  }

  if (bucket === "teenVocab") {
    const teen = randInt(11, 19);
    const ones = teen - 10;
    return {
      title: "What does this teen number mean?",
      bucket,
      story: `Say the number "${NUMBER_WORDS[teen]}" to yourself.`,
      visual: () => <TenAndOnes tens={1} ones={ones} />,
      steps: [
        choice(
          { prompt: `When you say "${NUMBER_WORDS[teen]}," how many TENS are in that number?`, hint: "Every teen number has exactly one ten-group — never zero, and never the whole number itself.", explain: `"${NUMBER_WORDS[teen]}" has exactly 1 ten, plus ${ones} ones.` },
          "1",
          ["0", String(teen)] // misconceptions: not recognizing any ten-group at all; treating the whole numeral as an undifferentiated count
        ),
        { kind: "number", prompt: "And how many ONES?", hint: "The extra amount beyond the full ten.", explain: `"${NUMBER_WORDS[teen]}" has ${ones} ones.`, answer: ones },
      ],
      wrapUp: `"${NUMBER_WORDS[teen]}" is 1 ten and ${ones} ones.`,
    };
  }

  // equationRecord — symbolic translation after the concrete version.
  const teen = randInt(11, 19);
  const ones = teen - 10;
  const swapped = Number(`${ones}${1}`); // e.g. teen=13 -> swapped=31 (digit-reversal trap, only when teen has two distinct digits)
  const swapDistractor = swapped !== teen ? swapped : ones; // fall back to "forgot the ten" when no swap is possible (e.g. 11)
  return {
    title: "Record it as an equation",
    bucket,
    story: `1 full ten-group and ${ones} more ones.`,
    visual: () => <TenAndOnes tens={1} ones={ones} />,
    steps: [
      { kind: "number", prompt: "Record this as ones: 10 + ? = what teen number?", hint: "Add the ten-group and the extra ones.", explain: `10 + ${ones} = ${teen}.`, answer: teen },
      choice(
        { prompt: "Which equation is written correctly?", hint: "Watch out for the digits written backwards — a very common teen-number mix-up.", explain: `10 + ${ones} = ${teen}.` },
        `10 + ${ones} = ${teen}`,
        [`10 + ${ones} = ${swapDistractor}`] // misconception: digit-reversal (writing 31 instead of 13), or dropping the ten entirely
      ),
    ],
    wrapUp: `10 + ${ones} = ${teen}.`,
  };
}

export const teenNumbers: Unit = {
  id: "teenNumbers",
  title: "Teen Numbers as Ten Plus More",
  goal: "See any number 11-19 as 'ten and some extra ones,' and build or break apart teen numbers that way.",
  standard: "K.NBT.1",
  keyIdea: (
    <>
      <p>Every number from 11 to 19 is built from exactly ONE bundled group of ten, plus some extra loose ones — never a different amount of groups.</p>
      <p>The first digit of a teen number always means that whole ten-group, not a single object — and the second digit means the extra ones.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Place-value structure is meant to be reasoned through each time (build
  // or break apart the ten-group), not a rote fact to memorize — no
  // reintroEverySolved, unlike Unit 4's ten-complement facts.
  problems: [{ label: "Teen Numbers", make: teenNumbersProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: teenNumbersTest,
};
