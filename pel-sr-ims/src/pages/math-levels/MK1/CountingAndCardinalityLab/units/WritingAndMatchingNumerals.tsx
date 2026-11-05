import { useEffect, useState, type ReactNode } from "react";
import { BigDigit, CounterGroup, TenGroups, countAlongMs } from "../diagrams";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { choice, customStep, pictureChoice, pointing, type Problem } from "../../../shared/engine/types";
import { WordNumeralMatch } from "./WordNumeralMatch";
import { counters, countShowMe, thereAre } from "./words";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { writingAndMatchingNumeralsTest } from "./WritingAndMatchingNumeralsTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { TapSelect } from "../../../shared/components/TapSelect";

// Number words 0-20 — stand in for a "spoken/heard" number, since this app
// has no audio. Index === the numeral itself.
export const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
] as const;

const bigDigit = (d: string, mirrored = false) => <BigDigit d={d} mirrored={mirrored} />;

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
  const allFilled = [countPick, wordPick].every((v) => String(v).trim() !== "");
  const countOk = countPick === "5";
  const wordOk = wordPick === "numeral";
  const ok = countOk && wordOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>1.</b> Look at the counters.
      </p>
      <CounterGroup count={5} arrangement="line" tone="a" seed={5} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many?{" "}
          <TapSelect value={countPick} onChange={(e) => setCountPick(e.target.value)} style={fieldOk(countOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </TapSelect>
        </label>
        <label>
          What do we call the written symbol "5" that stands for that count?{" "}
          <TapSelect value={wordPick} onChange={(e) => setWordPick(e.target.value)} style={fieldOk(wordOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="numeral">a numeral</option>
            <option value="letter">a letter</option>
            <option value="label">a label</option>
          </TapSelect>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? 'Correct — there are 5 counters, and "5" is the numeral: the written symbol for that count.' : "Not quite — count the dots again, and remember a numeral is the written symbol for a number, not a letter."}
        </ReadAloud>
      )}
    </ReadAloud>
  );
}

/** Two big numeral buttons; the student taps the one asked for. */
function DigitPick({ digits, value, onChange, okFor, checked }: { digits: string[]; value: string; onChange: (d: string) => void; okFor: string; checked: boolean }) {
  return (
    <div className="choices" role="radiogroup" style={{ gridTemplateColumns: "repeat(2, max-content)" }}>
      {digits.map((d) => {
        const on = value === d;
        const border = checked && on ? (d === okFor ? "var(--good)" : "var(--bad)") : on ? "var(--qa)" : undefined;
        return (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={on}
            className="choice choice-pic"
            style={{ borderColor: border, background: on ? "var(--qa-soft)" : undefined, borderWidth: on ? 3 : undefined }}
            onClick={() => onChange(d)}
          >
            <BigDigit d={d} />
          </button>
        );
      })}
    </div>
  );
}

/** Conflation: 6 and 9 held in mind at the same time. The numerals are the buttons (no "left/right"). */
function SixNineQuestion({ onComplete }: { onComplete?: () => void }) {
  const order = useState(() => (Math.random() < 0.5 ? ["6", "9"] : ["9", "6"]))[0];
  const [sixPick, setSixPick] = useState("");
  const [ninePick, setNinePick] = useState("");
  const [checked, setChecked] = useState(false);
  const filled = sixPick !== "" && ninePick !== "";
  const ok = sixPick === "6" && ninePick === "9";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>2.</b> Tap the six.
      </p>
      <DigitPick digits={order} value={sixPick} onChange={(d) => { setSixPick(d); setChecked(false); }} okFor="6" checked={checked} />
      <p>Tap the nine.</p>
      <DigitPick digits={order} value={ninePick} onChange={(d) => { setNinePick(d); setChecked(false); }} okFor="9" checked={checked} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <button className="btn primary" type="button" disabled={!filled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && filled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct! 6 and 9 are easy to mix up, but you told them apart." : "Not quite. Look at the circle. On a 6 the circle is at the bottom. On a 9 the circle is at the top."}
        </ReadAloud>
      )}
    </ReadAloud>
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
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: every pair of numerals people mix up (like 6 and 9, or 2 and 5) turns into the other one when you turn it
        upside down.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <TapSelect value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </TapSelect>
        <button className="btn primary" type="button" disabled={!picked} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && picked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct, it's false! Turn 6 upside down and it looks like 9. But turn 2 upside down and it does not look like 5. They just both have curves. 1 and 7 don't turn into each other either."
            : "Not quite — try turning a 6 upside down (it becomes a 9), then try turning a 2 upside down. Does it become a 5? It doesn't — 2 and 5 are mixed up for a different reason."}
        </ReadAloud>
      )}
    </ReadAloud>
  );
}

/** Multi-part production: match a picture-count to its numeral among a
 *  look-alike distractor, then reason about the number one less than it. */
function PictureToNumeralQuestion({ onComplete }: { onComplete?: () => void }) {
  const [numeralPick, setNumeralPick] = useState("");
  const [onelessPick, setOnelessPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [numeralPick, onelessPick].every((v) => String(v).trim() !== "");
  const numeralOk = numeralPick === "9";
  const onelessOk = onelessPick === "8";
  const ok = numeralOk && onelessOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>4.</b> Count the counters.
      </p>
      <CounterGroup count={9} arrangement="scatter" tone="c" seed={9} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which numeral matches this count?{" "}
          <TapSelect value={numeralPick} onChange={(e) => setNumeralPick(e.target.value)} style={fieldOk(numeralOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="6">6</option>
            <option value="9">9</option>
          </TapSelect>
        </label>
        <label>
          One FEWER than that would be:{" "}
          <TapSelect value={onelessPick} onChange={(e) => setOnelessPick(e.target.value)} style={fieldOk(onelessOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="8">8</option>
            <option value="10">10</option>
          </TapSelect>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 9 counters match the numeral 9, and one fewer than 9 is 8." : "Not quite — count the scattered counters carefully one at a time, then count one backward from your answer."}
        </ReadAloud>
      )}
    </ReadAloud>
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
      <ReadAloud as="p" className="intro-gate-title">Check for understanding: let's make sure numerals make sense before you try practice problems.</ReadAloud>
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
  "6-9": { digits: ["6", "9"], isFlip: true, note: "Turn 6 upside down and it looks like 9." },
  "2-5": { digits: ["2", "5"], isFlip: false, note: "Turn 2 upside down and it does not look like 5. They just both have curves." },
  "1-7": { digits: ["1", "7"], isFlip: false, note: "Turn 1 upside down and it does not look like 7. A 7 has a line across the top." },
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
      <div className="control-row" data-readaloud-part>
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

      <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <CounterGroup count={value} arrangement={arrangement} tone="a" seed={value * 7 + 3} />
        {bigDigit(String(value))}
      </div>
      <ReadAloud as="p" className="muted small">
        {value} counter{value === 1 ? "" : "s"}, and the numeral written for that count is "{value}". The word for {value} is "{NUMBER_WORDS[value]}" —
        the numeral is the SYMBOL, not the word.
      </ReadAloud>

      <ReadAloud className="align-stack-wrap">
        <p>
          <b>Numeral look-alikes</b> — some numerals are easy to mix up.
        </p>
        <Segmented label="Pair" value={pairKey} onChange={(k) => { setPairKey(k); setFlipped(false); }} options={[{ id: "6-9", label: "6 & 9" }, { id: "2-5", label: "2 & 5" }, { id: "1-7", label: "1 & 7" }]} />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <BigDigit d={pair.digits[0]} upsideDown={flipped} />
          <BigDigit d={pair.digits[1]} />
          <button className="btn ghost" onClick={() => setFlipped((f) => !f)}>
            {flipped ? "Turn it back" : `Turn the ${pair.digits[0]} upside down`}
          </button>
        </div>
        {flipped && <p className="muted small">{pair.note}</p>}
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <NumeralCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "writeFromWord" | "writeFromPicture" | "recognizeLookalike" | "reversedPairs" | "matchWords";
const BUCKETS: Bucket[] = ["writeFromWord", "writeFromPicture", "recognizeLookalike", "reversedPairs", "matchWords"];

const LOOKALIKE_SETS: [string, string][] = [["6", "9"], ["1", "7"], ["2", "5"]];
// Digits that visibly change shape when mirrored left-right — used by the
// reversedPairs bucket. 0, 1, and 8 are excluded: they look the same (or
// close enough) mirrored, so they wouldn't make a meaningful question.
const MIRROR_SENSITIVE_DIGITS = ["2", "3", "4", "5", "6", "7", "9"];

/** "a 1", "an 8", "an 11" — for spoken digit names. */
const aDigit = (d: number) => (d === 8 || d === 11 || d === 18 ? `an ${d}` : `a ${d}`);

/** Show me for writing a number word as a numeral. */
const writeWordShowMe = (n: number) => {
  if (n < 10) return `"${NUMBER_WORDS[n]}" is written ${n}.`;
  if (n === 10) return `"Ten" is one ten. We write a 1, then a 0: 10.`;
  return `"${NUMBER_WORDS[n]}" is ten and ${n - 10} more. We write a 1, then ${aDigit(n - 10)}: ${n}.`;
};

/** Number strip 1–9, the way it hangs in a classroom, with one numeral boxed. */
const NumberStrip = ({ highlight }: { highlight: string }) => (
  <div aria-label={`Number strip. Look at the ${highlight}.`} role="img" style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
    {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
      <span key={d} style={{ padding: "2px 8px", borderRadius: 8, border: d === highlight ? "3px solid var(--qb)" : "1px solid var(--line)", background: d === highlight ? "var(--qb-soft)" : undefined }}>
        <BigDigit d={d} size={32} />
      </span>
    ))}
  </div>
);

/** Each word with its dots in ten-frames (and, during "Show me", its numeral). */
const WordDots = ({ items, showNumerals }: { items: { n: number; word: string }[]; showNumerals: boolean }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14, width: "100%" }}>
    {items.map((it) => (
      <div key={it.n} style={{ display: "grid", gap: 4, justifyItems: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 800 }}>
          {it.word}
          {showNumerals && <span style={{ color: "var(--qb-text)" }}> = {it.n}</span>}
        </span>
        <TenGroups value={it.n} tone="a" />
      </div>
    ))}
  </div>
);

function numeralProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "matchWords") {
    // Several word-numeral pairs per problem, so random draws still cover
    // many words: three from 0-10 (the ones K students meet most) + one teen.
    const small = shuffle(Array.from({ length: 11 }, (_, i) => i)).slice(0, 3);
    const teen = randInt(11, 20);
    const items = shuffle([...small, teen]).map((n) => ({ n, word: NUMBER_WORDS[n] as string }));
    const numeralOrder = shuffle(items.map((it) => it.n));
    const resultText = items.map((it) => `${it.word} = ${it.n}`).join(", ");
    return {
      title: "Match the words",
      bucket,
      story: "Match each number word to its numeral.",
      // Just the words at first. Stuck (or "Show me"): each word gets its
      // dots to count; "Show me" and the finished problem add the numeral too.
      visual: (done, help) =>
        done >= 1 || pointing(help, 0) ? (
          <WordDots items={items} showNumerals={done >= 1 || !!help?.showMe} />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 22px", justifyContent: "center", fontSize: 34, fontWeight: 800 }}>
            {items.map((it) => (
              <span key={it.n}>{it.word}</span>
            ))}
          </div>
        ),
      steps: [
        customStep(
          {
            prompt: "Drag each word to its numeral.",
            hint: "Tap a word to hear it. Count the dots under it in the picture, then find that numeral.",
            showMe: "Look at the picture: each word, its dots, and its numeral.",
            explain: resultText + ".",
          },
          (onDone, onWrong) => <WordNumeralMatch items={items} numeralOrder={numeralOrder} onDone={onDone} onWrong={onWrong} />,
          resultText
        ),
      ],
      wrapUp: `${resultText}.`,
    };
  }

  if (bucket === "writeFromWord") {
    const n = randInt(0, 19); // leaves room for the "one more" follow-up to stay in 0-20
    const word = NUMBER_WORDS[n];
    return {
      title: "Write the numeral",
      bucket,
      story: `Write the numeral for the number word "${word}".`,
      // The picture shows what the question gives: the word. When the student
      // is stuck, it shows that many dots in ten-frames to count.
      visual: (done, help) => {
        if (done === 0) return pointing(help, 0) ? <TenGroups value={n} tone="a" labels /> : <span style={{ fontSize: 44, fontWeight: 800 }}>"{word}"</span>;
        return <TenGroups value={n} tone="a" labels target={pointing(help, 1) || done >= 2 ? n + 1 : undefined} targetTone="b" />;
      },
      steps: [
        { kind: "number", prompt: `What numeral is "${word}"?`, hint: "Count the dots in the picture. Type that number.", showMe: writeWordShowMe(n), explain: `"${word}" is written as the numeral ${n}.`, answer: n },
        { kind: "number", tone: "b", prompt: `What numeral is one MORE than ${n}?`, hint: "Look at the box with the question mark. That is one more dot.", showMe: `Say ${n}. Now say the next number: ${n + 1}.`, explain: `One more than ${n} is ${n + 1}.`, answer: n + 1 },
      ],
      wrapUp: `"${word}" is written ${n}, and one more is ${n + 1}.`,
    };
  }

  if (bucket === "writeFromPicture") {
    const n = randInt(0, 20);
    // Scattered only up to 10 (K.CC.5); bigger groups are lined up.
    const arrangement = n <= 10 ? pick(["line", "array", "scatter"] as const) : pick(["line", "array"] as const);
    const neighbor = n > 0 ? n - 1 : 1;
    const fewer = n > 0;
    return {
      title: "How many? Write it.",
      bucket,
      story: "Count the counters. Then write the numeral for how many there are.",
      visual: (_done, help) => <CounterGroup count={n} arrangement={arrangement} tone="b" seed={n * 13 + 5} countAlong={!!help?.showMe && help.step === 0} />,
      steps: [
        { kind: "number", showMeHoldMs: countAlongMs(n), prompt: "How many counters are there? Write the numeral.", hint: "Touch each counter as you count it. Count each one once.", showMe: countShowMe(n), explain: `${thereAre(n)} The numeral is ${n}.`, answer: n },
        {
          kind: "number",
          prompt: `Now write the numeral for one ${fewer ? "FEWER" : "MORE"} than that.`,
          hint: fewer ? "Count back one number." : "Count forward one number.",
          showMe: fewer ? `Say ${n}. Count back one: ${neighbor}.` : `Say ${n}. Count forward one: ${neighbor}.`,
          explain: `One ${fewer ? "fewer" : "more"} than ${n} is ${neighbor}.`,
          answer: neighbor,
        },
      ],
      wrapUp: `${thereAre(n)} We write ${n}.`,
    };
  }

  if (bucket === "recognizeLookalike") {
    const [a, b] = pick(LOOKALIKE_SETS);
    const showA = Math.random() < 0.5;
    const target = showA ? a : b;
    const other = showA ? b : a;
    const n = Number(target);
    // One step on purpose: typing the count first made this choice just
    // "find the key you pressed". Counting straight into the pick makes the
    // student tell the look-alikes apart themselves.
    const match = choice(
      {
        prompt: "Count the counters. Which numeral tells how many there are?",
        hint: "Touch each counter as you count it. Then look closely at both numerals.",
        showMe: `${countShowMe(n)} ${n} looks like this: ${target}.`,
        explain: `${thereAre(n)} We write ${target}, not ${other}.`,
      },
      target,
      [other]
    );
    match.showMeHoldMs = countAlongMs(n);
    match.display = match.choices.map((c) => <BigDigit key={c} d={c} size={48} />);
    return {
      title: "Which numeral matches?",
      bucket,
      story: "Count the counters. Then find the numeral that matches.",
      visual: (_done, help) => <CounterGroup count={n} arrangement="scatter" tone="c" seed={n * 17 + 9} countAlong={!!help?.showMe && help.step === 0} />,
      steps: [match],
      wrapUp: `${counters(n)} is written as the numeral ${target}.`,
    };
  }

  // reversedPairs: the two numerals ARE the buttons (no "left/right" words).
  const digit = pick(MIRROR_SENSITIVE_DIGITS);
  const n = Number(digit);
  const opts = shuffle([
    { right: true, pic: <BigDigit d={digit} size={56} /> },
    { right: false, pic: <BigDigit d={digit} size={56} mirrored /> },
  ]);
  const names = ["the first one", "the second one"];
  return {
    title: "Which one is written the right way?",
    bucket,
    // Don't name the digit here: step 1 asks the student to count it.
    story: "Count the counters. Then find the numeral that is written the right way.",
    // Stuck on the choice: a number strip shows how the numeral should look.
    visual: (done, help) =>
      done >= 1 && pointing(help, 1) ? <NumberStrip highlight={digit} /> : <CounterGroup count={n} arrangement="array" tone="a" seed={n * 29 + 1} countAlong={!!help?.showMe && help.step === 0} />,
    steps: [
      { kind: "number", showMeHoldMs: countAlongMs(n), prompt: "How many counters are there? Type the number.", hint: "Touch each counter as you count it. Count each one once.", showMe: countShowMe(n), explain: thereAre(n), answer: n },
      pictureChoice(
        {
          prompt: `Tap the ${digit} that is written the right way.`,
          hint: `Look at the ${digit} on the number strip. Find the one that looks the same.`,
          showMe: `The right way looks just like the ${digit} on the number strip. The other one is backwards.`,
          explain: `The other one is a backwards ${digit}.`,
        },
        opts.map((o, i): [string, ReactNode] => [names[i], o.pic]),
        opts.findIndex((o) => o.right)
      ),
    ],
    wrapUp: `You found the ${digit} written the right way.`,
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
      <p>Some numerals look alike. Turn 6 upside down and it looks like 9. Others, like 2 and 5, just look a little alike.</p>
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
