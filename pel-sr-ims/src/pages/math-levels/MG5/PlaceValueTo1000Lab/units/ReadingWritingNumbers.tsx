import { useEffect, useState, type CSSProperties } from "react";
import { PlaceValueChart } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { digitsOf, expandedForm, expandedFormZeroTrap, numberWords, swapHundredsTens, swapTensOnes, valueFromDigits, wordFormZeroTrap } from "../logic";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { readingWritingNumbersTest } from "./ReadingWritingNumbersTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Q1 — vocabulary: expanded form of a zero-tens number, with the exact
 *  "wrote a redundant +0 term" mistake as a live wrong choice. */
function ExpandedZeroQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "400 + 3";
  const OPTIONS = [CORRECT, "400 + 0 + 3", "40 + 3"];
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What is 403 written in expanded form?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 403 has no tens, so there's no tens term at all. The empty place just disappears from expanded form instead of getting its own '+ 0'."
            : "Not quite — 403 has 0 tens. An empty place doesn't get its own term in expanded form; it just isn't written."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the same zero-placeholder trap, in word form this time, so both
 *  representations' version of the mistake live in one CFU pass. */
function WordZeroQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "four hundred three";
  const OPTIONS = [CORRECT, "four hundred zero three", "four zero three"];
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> What is 403 written in words?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — the empty tens place is silent. You never SAY 'zero' for a missing place." : "Not quite — an empty place is never spoken as its own word. Say the hundreds, then skip straight to the ones."}
        </p>
      )}
    </div>
  );
}

/** Q3 — generalization/true-false trap: expanded form does NOT always have
 *  exactly 3 terms — only as many as there are nonzero places. */
function ThreeTermsTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "False";
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: Every 3-digit number's expanded form always has exactly three parts added together, one for each digit.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — it's False. 500's expanded form is just '500', one term, since the tens and ones places are both empty."
            : "Not quite — it's actually False. A number like 500 has only ONE term in expanded form, not three, since there's nothing in the tens or ones places to add."}
        </p>
      )}
    </div>
  );
}

/** Q4 — two fixed fill-in-the-blank word forms, one per zero-placeholder
 *  case (empty ones, then empty tens), with a shared check. */
function ZeroWordFillInQuestion({ onComplete }: { onComplete?: () => void }) {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [checked, setChecked] = useState(false);
  const okFirst = first === "forty";
  const okSecond = second === "three";
  const ok = okFirst && okSecond;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> 340 in words is: three hundred{" "}
        <select className="answer" style={{ width: 110, ...fieldStyle(okFirst, checked) }} value={first} onChange={(e) => setFirst(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          {["forty", "four tens", "forty zero"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        . And 403 in words is: four hundred{" "}
        <select className="answer" style={{ width: 110, ...fieldStyle(okSecond, checked) }} value={second} onChange={(e) => setSecond(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          {["three", "zero three", "thirteen"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        .
      </p>
      <div className="control-row">
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — the empty place is always silently skipped, whether it's the tens or the ones." : "Not quite — in both numbers, the empty place is simply skipped over, not spoken as 'zero'."}
        </p>
      )}
    </div>
  );
}

function ReadingWritingCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ expanded: false, word: false, threeTerms: false, fillIn: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure empty places make sense before you try practice problems.</p>
      <ExpandedZeroQuestion onComplete={mark("expanded")} />
      <WordZeroQuestion onComplete={mark("word")} />
      <ThreeTermsTrapQuestion onComplete={mark("threeTerms")} />
      <ZeroWordFillInQuestion onComplete={mark("fillIn")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [h, setH] = useState(3);
  const [t, setT] = useState(4);
  const [o, setO] = useState(2);
  const n = valueFromDigits(h, t, o);
  const hasEmptyPlace = t === 0 || o === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Hundreds" value={h} min={1} max={9} step={1} onChange={setH} tone="a" />
        <Stepper label="Tens" value={t} min={0} max={9} step={1} onChange={setT} tone="b" />
        <Stepper label="Ones" value={o} min={0} max={9} step={1} onChange={setO} tone="c" />
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
      <PlaceValueChart value={n} tone="a" highlightPlace={hasEmptyPlace ? (t === 0 ? "tens" : "ones") : undefined} />
      <div className="control-row" style={{ flexWrap: "wrap" }}>
        <p className="says">
          Numeral: <b>{n}</b>
        </p>
        <p className="says">
          Words: <b>{numberWords(n)}</b>
        </p>
        <p className="says">
          Expanded form: <b>{expandedForm(n)}</b>
        </p>
      </div>
      {hasEmptyPlace && <p className="muted small">Notice the empty {t === 0 ? "tens" : "ones"} place: it never gets its own word or its own "+ 0" term — it just disappears.</p>}
      {(introActive || showCheck) && <ReadingWritingCheck onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — Numeral ⇄ Words ⇄ Expanded Form
// ============================================================================

export const FORMS_BUCKETS = ["numToWord", "wordToNum", "numToExpanded", "expandedToNum", "zeroPlaceholder"] as const;
export type FormsBucket = (typeof FORMS_BUCKETS)[number];

/** A 3-digit number with 3 PAIRWISE DISTINCT nonzero digits — distinctness
 *  drawn directly from the digit choices themselves (pre-transform), so the
 *  digit-swap distractors built from it (swapTensOnes/swapHundredsTens) are
 *  guaranteed to actually differ from the correct answer. */
function randDistinctDigitsNumber(): number {
  const h = randInt(1, 9);
  let t = randInt(1, 9);
  while (t === h) t = randInt(1, 9);
  let o = randInt(1, 9);
  while (o === h || o === t) o = randInt(1, 9);
  return valueFromDigits(h, t, o);
}

/** A 3-digit number with exactly one empty place (tens or ones, chosen at
 *  random) — the zeroPlaceholder bucket's own case. */
function randZeroPlaceholderNumber(): number {
  const h = randInt(1, 9);
  const rest = randInt(1, 9);
  return Math.random() < 0.5 ? valueFromDigits(h, 0, rest) : valueFromDigits(h, rest, 0);
}

function distinctFrom(current: number, make: () => number): number {
  let n2 = make();
  while (n2 === current) n2 = make();
  return n2;
}

export function readingWritingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as FormsBucket) ?? FORMS_BUCKETS[randInt(0, FORMS_BUCKETS.length - 1)];

  if (bucket === "zeroPlaceholder") {
    const n = randZeroPlaceholderNumber();
    const n2 = distinctFrom(n, randZeroPlaceholderNumber);
    const wordTrap = wordFormZeroTrap(n)!;
    const expandedTrap = expandedFormZeroTrap(n)!;
    return {
      title: "Reading & Writing with an Empty Place",
      bucket,
      story: `${n} has an empty place — read and write it carefully.`,
      visual: () => <PlaceValueChart value={n} tone="a" highlightPlace={digitsOf(n).t === 0 ? "tens" : "ones"} />,
      steps: [
        choice(
          { prompt: `What is ${n} in words?`, hint: "The empty place is silent — skip straight past it.", explain: `${n} in words is "${numberWords(n)}" — the empty place is never spoken.` },
          numberWords(n),
          [wordTrap, numberWords(n + 1)]
        ),
        choice(
          { prompt: `What is ${n} in expanded form?`, hint: "The empty place gets no term at all, not even a '+ 0'.", explain: `${n} in expanded form is "${expandedForm(n)}" — no term for the empty place.` },
          expandedForm(n),
          [expandedTrap, expandedForm(n + 1)]
        ),
        { kind: "number", prompt: `What numeral is "${numberWords(n2)}"?`, hint: "Say the hundreds first, then fill in whichever place was skipped as 0.", explain: `"${numberWords(n2)}" is the numeral ${n2}.`, answer: n2 },
      ],
      wrapUp: `${n} = "${numberWords(n)}" = ${expandedForm(n)}. And "${numberWords(n2)}" = ${n2}.`,
    };
  }

  const n = randDistinctDigitsNumber();
  const n2 = distinctFrom(n, randDistinctDigitsNumber);
  const wordDistractors = [numberWords(swapTensOnes(n)), numberWords(swapHundredsTens(n))];
  const expandedDistractors = [expandedForm(swapTensOnes(n)), expandedForm(swapHundredsTens(n))];

  let steps: Problem["steps"];
  if (bucket === "numToWord") {
    steps = [
      choice({ prompt: `What is ${n} in words?`, hint: "Read the hundreds digit, then the tens-and-ones part.", explain: `${n} is "${numberWords(n)}".` }, numberWords(n), wordDistractors),
      { kind: "number", prompt: `What numeral is "${numberWords(n2)}"?`, hint: "Build the hundreds first, then the rest.", explain: `"${numberWords(n2)}" is the numeral ${n2}.`, answer: n2 },
      choice({ prompt: `What is ${n} in expanded form?`, hint: "One term per nonzero digit.", explain: `${n} in expanded form is "${expandedForm(n)}".` }, expandedForm(n), expandedDistractors),
    ];
  } else if (bucket === "numToExpanded") {
    steps = [
      choice({ prompt: `What is ${n} in expanded form?`, hint: "One term per nonzero digit.", explain: `${n} in expanded form is "${expandedForm(n)}".` }, expandedForm(n), expandedDistractors),
      { kind: "number", prompt: `What numeral has the expanded form "${expandedForm(n2)}"?`, hint: "Add the terms together.", explain: `"${expandedForm(n2)}" is the numeral ${n2}.`, answer: n2 },
      choice({ prompt: `What is ${n} in words?`, hint: "Read the hundreds digit, then the tens-and-ones part.", explain: `${n} is "${numberWords(n)}".` }, numberWords(n), wordDistractors),
    ];
  } else if (bucket === "wordToNum") {
    steps = [
      { kind: "number", prompt: `What numeral is "${numberWords(n)}"?`, hint: "Build the hundreds first, then the rest.", explain: `"${numberWords(n)}" is the numeral ${n}.`, answer: n },
      choice({ prompt: `What is ${n2} in words?`, hint: "Read the hundreds digit, then the tens-and-ones part.", explain: `${n2} is "${numberWords(n2)}".` }, numberWords(n2), [numberWords(swapTensOnes(n2)), numberWords(swapHundredsTens(n2))]),
      choice({ prompt: `What is ${n2} in expanded form?`, hint: "One term per nonzero digit.", explain: `${n2} in expanded form is "${expandedForm(n2)}".` }, expandedForm(n2), [expandedForm(swapTensOnes(n2)), expandedForm(swapHundredsTens(n2))]),
    ];
  } else {
    steps = [
      { kind: "number", prompt: `What numeral has the expanded form "${expandedForm(n)}"?`, hint: "Add the terms together.", explain: `"${expandedForm(n)}" is the numeral ${n}.`, answer: n },
      choice({ prompt: `What is ${n2} in expanded form?`, hint: "One term per nonzero digit.", explain: `${n2} in expanded form is "${expandedForm(n2)}".` }, expandedForm(n2), [expandedForm(swapTensOnes(n2)), expandedForm(swapHundredsTens(n2))]),
      choice({ prompt: `What is ${n2} in words?`, hint: "Read the hundreds digit, then the tens-and-ones part.", explain: `${n2} is "${numberWords(n2)}".` }, numberWords(n2), [numberWords(swapTensOnes(n2)), numberWords(swapHundredsTens(n2))]),
    ];
  }

  return {
    title: "Numeral, Words, and Expanded Form",
    bucket,
    story: `Translate ${n} between its numeral, word, and expanded forms.`,
    visual: () => <PlaceValueChart value={n} tone="a" />,
    steps,
    wrapUp: `${n} = "${numberWords(n)}" = ${expandedForm(n)}.`,
  };
}

export const readingWritingNumbers: Unit = {
  id: "readingWritingNumbers",
  title: "Reading and Writing Numbers Three Ways",
  goal: "Write the same number as a numeral, in words, and broken apart by place value — and translate back the other direction too.",
  standard: "2.NBT.3",
  keyIdea: (
    <>
      <p>Every number can be written 3 ways: as a numeral (342), in words ("three hundred forty-two"), or in expanded form (300 + 40 + 2).</p>
      <p>An empty place (like the tens in 403) is simply skipped in words and expanded form — it never gets its own "zero" word or "+ 0" term.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Numeral, Words, Expanded Form", make: readingWritingProblem, buckets: [...FORMS_BUCKETS] }],
  requiredBuckets: [...FORMS_BUCKETS],
  test: readingWritingNumbersTest,
};
