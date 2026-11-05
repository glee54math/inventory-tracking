import { useState, type ReactNode } from "react";
import { BigDigit, CounterGroup, TenGroups, countAlongMs } from "../diagrams";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { choice, customStep, pictureChoice, pointing, type Problem } from "../../../shared/engine/types";
import { WordNumeralMatch } from "./WordNumeralMatch";
import { counters, countShowMe, countUp, thereAre } from "./words";
import { CheckSequence, PickCheck, TypeCheck, type CheckMode } from "./KCheck";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { writingAndMatchingNumeralsTest } from "./WritingAndMatchingNumeralsTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";

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

// Kindergarten-sized, one question at a time (see KCheck.tsx). Ideas
// checked: a numeral tells how many; telling 6 from 9 and 2 from 5; counting
// a scattered group into a numeral, then one fewer.

const cfuCount = (n: number, arrangement: "line" | "array" | "scatter", tone: "a" | "b" | "c", seed: number) => (m: CheckMode) => (
  <CounterGroup count={n} arrangement={arrangement} tone={tone} seed={seed} tapToCount={m === "ask" || m === "wrong"} countAlong={m === "show"} />
);

function NumeralCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="How many? Type the numeral."
            answer={5}
            tone="a"
            picture={cfuCount(5, "line", "a", 5)}
            nudge="Not yet. Tap each one as you count."
            showText={`Watch and listen: ${countUp(1, 5)}.`}
            praise="Yes! 5 counters. We write 5."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={2}
            prompt="Count the dots. Tap the numeral."
            picture={cfuCount(6, "array", "b", 6)("ask")}
            showPicture={cfuCount(6, "array", "b", 6)("show")}
            showText={`Watch and listen: ${countUp(1, 6)}. Now find 6.`}
            options={["9", "6"].map((d) => ({ id: d, label: <BigDigit d={d} size={44} /> }))}
            answer="6"
            why={{ "9": "That is 9. A 6 has its circle at the bottom." }}
            praise="Yes! That is 6."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="Count the dots. Tap the numeral."
            picture={cfuCount(5, "scatter", "c", 55)("ask")}
            showPicture={cfuCount(5, "scatter", "c", 55)("show")}
            showText={`Watch and listen: ${countUp(1, 5)}. Now find 5.`}
            options={["5", "2"].map((d) => ({ id: d, label: <BigDigit d={d} size={44} /> }))}
            answer="5"
            why={{ "2": "That is 2. A 5 has a flat line on top." }}
            praise="Yes! That is 5."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="How many? Type the numeral."
            answer={9}
            tone="c"
            picture={cfuCount(9, "scatter", "c", 9)}
            nudge="Not yet. Tap each one as you count."
            why={{ 6: "That is 6. Count again. Tap each one." }}
            showText={`Watch and listen: ${countUp(1, 9)}.`}
            praise="Yes! 9."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt={
              <>
                Now one <b>FEWER</b>. How many?
              </>
            }
            answer={8}
            tone="b"
            picture={(m) => <CounterGroup count={9} arrangement="scatter" tone="c" seed={9} oneFewer={{ tone: "b", faded: m === "show" || m === "done" }} />}
            nudge="The one with the X goes away. Count the ones left."
            showText="Watch: the one with the X goes away. 8 are left."
            praise="Yes! One fewer than 9 is 8."
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
        // No count labels until "Show me": the student counts the dots, not copies a number.
        if (done === 0) return pointing(help, 0) ? <TenGroups value={n} tone="a" labels={!!help?.showMe} /> : <span style={{ fontSize: 44, fontWeight: 800 }}>"{word}"</span>;
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
      // Step 1: tap to count. Step 2: a blinking X on the counter that goes
      // away (or a "?" spot for one more, when there are none), shown done
      // during "Show me" and once answered.
      // ("Show me" draws with its step done, so step 1's "Show me" must not
      // show step 2's X yet: only count along.)
      visual: (done, help) => {
        const onStep2 = done >= 1 && !(help?.showMe && help.step === 0);
        return (
          <CounterGroup
            count={n}
            arrangement={arrangement}
            tone="b"
            seed={n * 13 + 5}
            countAlong={!!help?.showMe && help.step === 0}
            tapToCount={done === 0}
            oneFewer={fewer && onStep2 ? { tone: "a", faded: done >= 2 } : undefined}
            oneMore={!fewer && onStep2 ? { tone: "a", filled: done >= 2 } : undefined}
          />
        );
      },
      steps: [
        { kind: "number", showMeHoldMs: countAlongMs(n), prompt: "How many counters are there? Write the numeral.", hint: "Touch each counter as you count it. Count each one once.", showMe: countShowMe(n), explain: `${thereAre(n)} The numeral is ${n}.`, answer: n },
        {
          kind: "number",
          tone: "a", // matches the X / "?" in the picture
          showMeHoldMs: 2000,
          prompt: `Now write the numeral for one ${fewer ? "FEWER" : "MORE"} than that.`,
          hint: fewer ? "The counter with the X goes away. Count the ones left." : "Look at the circle with the question mark. That is one more.",
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
