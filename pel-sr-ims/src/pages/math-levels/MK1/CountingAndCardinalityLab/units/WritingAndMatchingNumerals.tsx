import { useEffect, useState } from "react";
import { CounterGroup } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { writingAndMatchingNumeralsTest } from "./WritingAndMatchingNumeralsTest";

// Number words 0-20 — stand in for a "spoken/heard" number, since this app
// has no audio. Index === the numeral itself.
export const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
] as const;

const bigDigit = (d: string, mirrored = false) => (
  <span style={{ display: "inline-block", fontSize: 54, fontWeight: 800, fontFamily: "'Courier New', monospace", transform: mirrored ? "scaleX(-1)" : undefined }}>
    {d}
  </span>
);

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: "numeral" as the word for the written symbol, tied to an
 *  actual count rather than asked in the abstract. */
function NumeralVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [countPick, setCountPick] = useState("");
  const [wordPick, setWordPick] = useState("");
  const [checked, setChecked] = useState(false);
  const countOk = countPick === "5";
  const wordOk = wordPick === "numeral";
  const ok = countOk && wordOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Look at the counters.
      </p>
      <CounterGroup count={5} arrangement="line" tone="a" seed={5} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many?{" "}
          <select className="answer" value={countPick} onChange={(e) => setCountPick(e.target.value)} style={fieldOk(countOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </label>
        <label>
          What do we call the written symbol "5" that stands for that count?{" "}
          <select className="answer" value={wordPick} onChange={(e) => setWordPick(e.target.value)} style={fieldOk(wordOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="numeral">a numeral</option>
            <option value="letter">a letter</option>
            <option value="label">a label</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? 'Correct — there are 5 counters, and "5" is the numeral: the written symbol for that count.' : "Not quite — count the dots again, and remember a numeral is the written symbol for a number, not a letter."}
        </p>
      )}
    </div>
  );
}

/** Conflation: 6 and 9 held in mind at the same time, each identified by position. */
function SixNineQuestion({ onComplete }: { onComplete?: () => void }) {
  const sixOnLeft = useState(() => Math.random() < 0.5)[0];
  const [sixPick, setSixPick] = useState("");
  const [ninePick, setNinePick] = useState("");
  const [checked, setChecked] = useState(false);
  const sixOk = sixPick === (sixOnLeft ? "left" : "right");
  const nineOk = ninePick === (sixOnLeft ? "right" : "left");
  const ok = sixOk && nineOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  const selectRow = (label: string, value: string, setValue: (v: string) => void, isOk: boolean) => (
    <label>
      {label}:{" "}
      <select className="answer" value={value} onChange={(e) => setValue(e.target.value)} style={fieldOk(isOk, checked)}>
        <option value="" disabled>
          choose
        </option>
        <option value="left">Left</option>
        <option value="right">Right</option>
      </select>
    </label>
  );

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Two numerals are shown below.
      </p>
      <div style={{ display: "flex", gap: 24 }}>{sixOnLeft ? [bigDigit("6"), bigDigit("9")] : [bigDigit("9"), bigDigit("6")]}</div>
      <div className="control-row" style={{ alignItems: "center" }}>
        {selectRow("Which one is six?", sixPick, setSixPick, sixOk)}
        {selectRow("Which one is nine?", ninePick, setNinePick, nineOk)}
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct! 6 and 9 are easy to mix up, but you told them apart." : "Not quite — look closely at which numeral has its loop near the top, and which has it near the bottom."}
        </p>
      )}
    </div>
  );
}

/** Generalization / false trap: NOT every look-alike pair is an upside-down flip of the other. */
function FlipGeneralizationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: every pair of numerals people mix up (like 6 &amp; 9, or 2 &amp; 5) turns into the other one when you flip it
        upside down.
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
            ? "Correct — false! 6 and 9 really ARE upside-down flips of each other. But 2 and 5 are NOT — they just happen to have similar curvy shapes, and 1 and 7 aren't flips either. Mixing numerals up can happen for more than one reason."
            : "Not quite — try turning a 6 upside down (it becomes a 9), then try turning a 2 upside down. Does it become a 5? It doesn't — 2 and 5 are mixed up for a different reason."}
        </p>
      )}
    </div>
  );
}

/** Multi-part production: match a picture-count to its numeral among a
 *  look-alike distractor, then reason about the number one less than it. */
function PictureToNumeralQuestion({ onComplete }: { onComplete?: () => void }) {
  const [numeralPick, setNumeralPick] = useState("");
  const [onelessPick, setOnelessPick] = useState("");
  const [checked, setChecked] = useState(false);
  const numeralOk = numeralPick === "9";
  const onelessOk = onelessPick === "8";
  const ok = numeralOk && onelessOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Count the counters.
      </p>
      <CounterGroup count={9} arrangement="scatter" tone="c" seed={9} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which numeral matches this count?{" "}
          <select className="answer" value={numeralPick} onChange={(e) => setNumeralPick(e.target.value)} style={fieldOk(numeralOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="6">6</option>
            <option value="9">9</option>
          </select>
        </label>
        <label>
          One FEWER than that would be:{" "}
          <select className="answer" value={onelessPick} onChange={(e) => setOnelessPick(e.target.value)} style={fieldOk(onelessOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="8">8</option>
            <option value="10">10</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 9 counters match the numeral 9, and one fewer than 9 is 8." : "Not quite — count the scattered counters carefully one at a time, then count one backward from your answer."}
        </p>
      )}
    </div>
  );
}

function NumeralCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, sixNine: false, flip: false, pictureMatch: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure numerals make sense before you try practice problems.</p>
      <NumeralVocabQuestion onComplete={mark("vocab")} />
      <SixNineQuestion onComplete={mark("sixNine")} />
      <FlipGeneralizationQuestion onComplete={mark("flip")} />
      <PictureToNumeralQuestion onComplete={mark("pictureMatch")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

const LOOKALIKE_PAIRS: Record<string, { digits: [string, string]; isFlip: boolean; note: string }> = {
  "6-9": { digits: ["6", "9"], isFlip: true, note: "6 and 9 are true mirror-flips of each other — turn one upside down and it becomes the other." },
  "2-5": { digits: ["2", "5"], isFlip: false, note: "2 and 5 are NOT flips of each other — they just have similar curvy shapes, so it's easy to mix them up." },
  "1-7": { digits: ["1", "7"], isFlip: false, note: "1 and 7 are NOT flips either — 7 has an extra line across the top that 1 doesn't." },
};

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [value, setValue] = useState(7);
  const [arrangement, setArrangement] = useState<"line" | "array" | "scatter">("line");
  const [pairKey, setPairKey] = useState<"6-9" | "2-5" | "1-7">("6-9");
  const [flipped, setFlipped] = useState(false);
  const pair = LOOKALIKE_PAIRS[pairKey];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Number" value={value} min={0} max={20} step={1} onChange={setValue} tone="a" />
        <Segmented label="Arrangement" value={arrangement} onChange={setArrangement} options={[{ id: "line", label: "Line" }, { id: "array", label: "Grid" }, { id: "scatter", label: "Scattered" }]} />
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
      {(introActive || showCheck) && <NumeralCheckForUnderstanding onComplete={onIntroDone} />}

      <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <CounterGroup count={value} arrangement={arrangement} tone="a" seed={value * 7 + 3} />
        {bigDigit(String(value))}
      </div>
      <p className="muted small">
        {value} counter{value === 1 ? "" : "s"}, and the numeral written for that count is "{value}". The word for {value} is "{NUMBER_WORDS[value]}" —
        the numeral is the SYMBOL, not the word.
      </p>

      <div className="align-stack-wrap">
        <p>
          <b>Numeral look-alikes</b> — some numerals are easy to mix up.
        </p>
        <Segmented label="Pair" value={pairKey} onChange={(k) => { setPairKey(k); setFlipped(false); }} options={[{ id: "6-9", label: "6 & 9" }, { id: "2-5", label: "2 & 5" }, { id: "1-7", label: "1 & 7" }]} />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {bigDigit(pair.digits[0], flipped && pair.isFlip)}
          {bigDigit(pair.digits[1])}
          <button className="btn ghost" onClick={() => setFlipped((f) => !f)} disabled={!pair.isFlip}>
            {pair.isFlip ? (flipped ? "Un-flip" : "Flip the first one upside down") : "These two don't flip into each other"}
          </button>
        </div>
        <p className="muted small">{pair.note}</p>
      </div>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "writeFromWord" | "writeFromPicture" | "recognizeLookalike" | "reversedPairs";
const BUCKETS: Bucket[] = ["writeFromWord", "writeFromPicture", "recognizeLookalike", "reversedPairs"];

const LOOKALIKE_SETS: [string, string][] = [["6", "9"], ["1", "7"], ["2", "5"]];
// Digits that visibly change shape when mirrored left-right — used by the
// reversedPairs bucket. 0, 1, and 8 are excluded: they look the same (or
// close enough) mirrored, so they wouldn't make a meaningful question.
const MIRROR_SENSITIVE_DIGITS = ["2", "3", "4", "5", "6", "7", "9"];

function numeralProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "writeFromWord") {
    const n = randInt(0, 19); // leaves room for the "one more" follow-up to stay in 0-20
    return {
      title: "Write the numeral",
      bucket,
      story: `Write the numeral for the number word "${NUMBER_WORDS[n]}".`,
      visual: () => bigDigit("?"),
      steps: [
        { kind: "number", prompt: `What numeral is "${NUMBER_WORDS[n]}"?`, hint: "Think of the symbol, not the word — just the digit(s).", explain: `"${NUMBER_WORDS[n]}" is written as the numeral ${n}.`, answer: n },
        { kind: "number", prompt: `What numeral is one MORE than ${n}?`, hint: "Count one step forward from the numeral you just wrote.", explain: `One more than ${n} is ${n + 1}.`, answer: n + 1 },
      ],
      wrapUp: `"${NUMBER_WORDS[n]}" is written ${n}, and one more is ${n + 1}.`,
    };
  }

  if (bucket === "writeFromPicture") {
    const n = randInt(0, 20);
    const arrangement = pick(["line", "array", "scatter"] as const);
    const neighbor = n > 0 ? n - 1 : 1;
    const neighborPrompt = n > 0 ? `one FEWER than that` : `one MORE than that`;
    return {
      title: "How many? Write it.",
      bucket,
      story: "Count the counters, then write the numeral for how many there are.",
      visual: () => <CounterGroup count={n} arrangement={arrangement} tone="b" seed={n * 13 + 5} />,
      steps: [
        { kind: "number", prompt: "How many counters are there? Write the numeral.", hint: "Count each one exactly once.", explain: `There are ${n} counters — the numeral is ${n}.`, answer: n },
        { kind: "number", prompt: `Now write the numeral for ${neighborPrompt}.`, hint: n > 0 ? "Count one step backward." : "Count one step forward.", explain: `${neighborPrompt === "one FEWER than that" ? "One fewer" : "One more"} than ${n} is ${neighbor}.`, answer: neighbor },
      ],
      wrapUp: `There are ${n} counters, written as the numeral ${n}.`,
    };
  }

  if (bucket === "recognizeLookalike") {
    const [a, b] = pick(LOOKALIKE_SETS);
    const showA = Math.random() < 0.5;
    const target = showA ? a : b;
    const other = showA ? b : a;
    const n = Number(target);
    return {
      title: "Which numeral matches?",
      bucket,
      story: `Count the counters below. Which numeral matches how many there are — ${target} or ${other}?`,
      visual: () => <CounterGroup count={n} arrangement="scatter" tone="c" seed={n * 17 + 9} />,
      steps: [
        choice(
          { prompt: "Which numeral matches this many counters?", hint: "Count carefully, then pick the matching numeral — don't just guess by shape.", explain: `There are ${n} counters, which is written as the numeral ${target}, not ${other}.` },
          target,
          [other]
        ),
      ],
      wrapUp: `${n} counters is written as the numeral ${target}.`,
    };
  }

  // reversedPairs
  const digit = pick(MIRROR_SENSITIVE_DIGITS);
  const correctSide: "Left" | "Right" = Math.random() < 0.5 ? "Left" : "Right";
  return {
    title: "Which one is written correctly?",
    bucket,
    story: "One of these two numerals is written correctly. The other is a mirror image (flipped left-to-right).",
    visual: () => (
      <div style={{ display: "flex", gap: 30, justifyContent: "center" }}>
        {correctSide === "Left" ? bigDigit(digit) : bigDigit(digit, true)}
        {correctSide === "Left" ? bigDigit(digit, true) : bigDigit(digit)}
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `Which one is the correctly written numeral ${digit} — Left or Right?`,
          hint: "A mirror image is flipped left-to-right, so it looks backwards.",
          explain: `The ${correctSide} one is correct. The other is ${digit} flipped into a mirror image, which is why it looks reversed.`,
        },
        correctSide,
        [correctSide === "Left" ? "Right" : "Left"]
      ),
    ],
    wrapUp: `The ${correctSide} numeral was the correctly written ${digit}.`,
  };
}

export const writingAndMatchingNumerals: Unit = {
  id: "writingAndMatchingNumerals",
  title: "Writing and Matching Numerals",
  goal: "Write the numeral for a number you hear or count, and match a count of objects to its numeral, from 0 to 20.",
  standard: "K.CC.3",
  keyIdea: (
    <>
      <p>A numeral is the written symbol for a number — "7" is the numeral, "seven" is the word, and seven counters is the actual amount.</p>
      <p>Some numerals look alike. 6 and 9 are true upside-down flips of each other; others (like 2 and 5) just happen to look similar.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Numeral shapes (0-20) are a fixed visual fact, not something re-derived
  // by reasoning — a reversal that was corrected once can silently resurface
  // after a long gap, so this periodically re-checks.
  reintroEverySolved: 20,
  problems: [{ label: "Numerals", make: numeralProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: writingAndMatchingNumeralsTest,
};
