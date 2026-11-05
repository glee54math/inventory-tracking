import { useState } from "react";
import { SplitGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { fastFactsWithin5Test } from "./FastFactsWithin5Test";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, TypeCheck } from "../../../shared/components/KCheck";

// ============================================================================
// CHECK FOR UNDERSTANDING — gates Practice
// ============================================================================
// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// A fast fact is shown on its own (no dots to count); a wrong try brings the
// dots in, so a student who doesn't know it yet still has a way to it.
// Ideas checked: adding, taking away (fewer, not more), a double, a missing
// part of 5.

const factCard = (text: string) => <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 1 }}>{text}</div>;

function FastFactsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="3 + 1 = ?"
            answer={4}
            tone="a"
            picture={(m) => (m === "ask" ? factCard("3 + 1 = ?") : <SplitGroup total={4} partA={3} toneA="a" toneB="b" />)}
            nudge="Look at the dots. 3, and 1 more."
            showText="Watch and listen: 3, and 1 more makes 4."
            praise="Yes! 3 + 1 = 4."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="5 − 2 = ?"
            answer={3}
            tone="a"
            picture={(m) => (m === "ask" ? factCard("5 − 2 = ?") : <SplitGroup total={5} partA={3} toneA="a" toneB="b" goneB />)}
            nudge="Look at the dots. 2 go away. Count the ones left."
            why={{ 7: "Minus means take away. That makes fewer, not more." }}
            showText="Watch and listen: 2 go away. 1, 2, 3 are left."
            praise="Yes! 5 − 2 = 3."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="2 + 2 = ?"
            answer={4}
            tone="a"
            picture={(m) => (m === "ask" ? factCard("2 + 2 = ?") : <SplitGroup total={4} partA={2} toneA="a" toneB="b" />)}
            nudge="Look at the dots. 2 and 2."
            showText="Watch and listen: 1, 2, 3, 4. Double 2 is 4."
            praise="Yes! 2 + 2 = 4. That is a double."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="1 + ? = 5"
            answer={4}
            tone="b"
            picture={(m) => (m === "ask" ? factCard("1 + ? = 5") : <SplitGroup total={5} partA={1} toneA="a" toneB="b" />)}
            nudge="Look at the dots. 5 in all. 1 is blue. How many are orange?"
            why={{ 6: "The answer is 5 in all, so the missing part is less than 5." }}
            showText="Watch and listen: 5 in all. 1 is blue. The orange ones are 1, 2, 3, 4."
            praise="Yes! 1 + 4 = 5."
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

type Mode = "add" | "sub" | "doubles" | "missing";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<Mode>("add");
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const maxB = mode === "add" || mode === "missing" ? Math.max(0, 5 - a) : 5;

  const total = mode === "doubles" ? a + a : a + b;
  const diff = mode === "sub" ? a - Math.min(b, a) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="Fact type"
          value={mode}
          onChange={setMode}
          options={[
            { id: "add", label: "Addition" },
            { id: "sub", label: "Subtraction" },
            { id: "doubles", label: "Doubles" },
            { id: "missing", label: "Missing addend" },
          ]}
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
      {mode !== "doubles" && (
        <div className="control-row" data-readaloud-part>
          <Stepper label={mode === "sub" ? "Start" : mode === "missing" ? "Known part" : "First number"} value={a} min={mode === "sub" ? 1 : 0} max={5} step={1} onChange={setA} tone="a" />
          {mode !== "missing" && <Stepper label="Second number" value={b} min={0} max={maxB} step={1} onChange={setB} tone="b" />}
        </div>
      )}
      {mode === "doubles" && (
        <div className="control-row" data-readaloud-part>
          <Stepper label="Number" value={a} min={1} max={2} step={1} onChange={setA} tone="a" />
        </div>
      )}

      {mode === "add" && (
        <>
          <SplitGroup total={total} partA={a} toneA="a" toneB="b" />
          <ReadAloud as="p" className="feedback good">{a} + {b} = {total}. Try to just KNOW this fact instantly, without counting each dot one at a time.</ReadAloud>
        </>
      )}
      {mode === "sub" && (
        <>
          <SplitGroup total={a} partA={diff} toneA="a" toneB="b" />
          <ReadAloud as="p" className="feedback good">{a} − {Math.min(b, a)} = {diff}.</ReadAloud>
        </>
      )}
      {mode === "doubles" && (
        <>
          <SplitGroup total={a + a} partA={a} toneA="a" toneB="a" showDivider={false} />
          <ReadAloud as="p" className="feedback good">{a} + {a} = {a + a} — a "doubles" fact, where both parts are the exact same number.</ReadAloud>
        </>
      )}
      {mode === "missing" && (
        <>
          <SplitGroup total={5} partA={a} toneA="a" toneB="b" />
          <ReadAloud as="p" className="feedback good">{a} + ? = 5. The missing number is {5 - a}.</ReadAloud>
        </>
      )}
      <ReadAloud as="p" className="muted small">
        Every fact here has an answer of 5 or less. The goal of this unit is SPEED — recognizing the answer instantly, the same way you already know
        your age without counting it out on your fingers.
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <FastFactsCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "additionWithin5" | "subtractionWithin5" | "doublesWithin5" | "missingAddendWithin5";
const BUCKETS: Bucket[] = ["additionWithin5", "subtractionWithin5", "doublesWithin5", "missingAddendWithin5"];

function fastFactsProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "additionWithin5") {
    const a = randInt(0, 5);
    const b = randInt(0, 5 - a);
    const sum = a + b;
    const isDoubles = a === b;
    return {
      title: "Fast fact: addition",
      bucket,
      story: `What is ${a} + ${b}?`,
      visual: () => <SplitGroup total={sum} partA={a} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "You should know this fact without counting it out.", explain: `${a} + ${b} = ${sum}.`, answer: sum },
        choice(
          { prompt: `Is ${a} + ${b} a "doubles" fact (both numbers the same)?`, hint: "A doubles fact has the exact same number added to itself.", explain: isDoubles ? `Yes — ${a} and ${b} are the same number.` : `No — ${a} and ${b} are different numbers.` },
          isDoubles ? "Yes" : "No",
          [isDoubles ? "No" : "Yes"]
        ),
      ],
      wrapUp: `${a} + ${b} = ${sum}.`,
    };
  }

  if (bucket === "subtractionWithin5") {
    const minuend = randInt(1, 5);
    const b = randInt(0, minuend);
    const diff = minuend - b;
    return {
      title: "Fast fact: subtraction",
      bucket,
      story: `What is ${minuend} − ${b}?`,
      // Once step 1 is shown/answered, the part taken away fades out.
      visual: (done) => <SplitGroup total={minuend} partA={diff} toneA="a" toneB="b" goneB={done >= 1} />,
      steps: [
        { kind: "number", prompt: `What is ${minuend} − ${b}?`, hint: "You should know this fact without counting it out.", explain: `${minuend} − ${b} = ${diff}.`, answer: diff },
        choice(
          { prompt: "Which addition fact matches this subtraction fact?", hint: "Subtraction and addition facts come in families — the difference plus the amount subtracted gives back the start.", explain: `${b} + ${diff} = ${minuend}, so ${minuend} − ${b} = ${diff}.` },
          `${b} + ${diff} = ${minuend}`,
          [`${minuend} + ${b} = ${diff}`] // misconception: adding the wrong two numbers in the fact family
        ),
      ],
      wrapUp: `${minuend} − ${b} = ${diff}.`,
    };
  }

  if (bucket === "doublesWithin5") {
    const n = randInt(1, 2); // 3+3=6 exceeds 5, so only 1+1 and 2+2 fit "within 5"
    const sum = n + n;
    return {
      title: "Fast fact: doubles",
      bucket,
      story: `What is ${n} + ${n}?`,
      // Step 2 ("one more") adds the extra dot, in a new color, once shown/answered.
      visual: (done) =>
        done >= 2 ? (
          <SplitGroup total={sum + 1} partA={sum} toneA="a" toneB="b" />
        ) : (
          <SplitGroup total={sum} partA={n} toneA="a" toneB="a" showDivider={false} />
        ),
      steps: [
        { kind: "number", prompt: `What is ${n} + ${n}?`, hint: "A doubles fact — both parts are the same.", explain: `${n} + ${n} = ${sum}.`, answer: sum },
        { kind: "number", prompt: `What is one MORE than ${sum} (that is, ${n} + ${n} + 1)?`, hint: "Add one more to the doubles fact you just found.", explain: `${sum} + 1 = ${sum + 1}.`, answer: sum + 1 },
      ],
      wrapUp: `${n} + ${n} = ${sum}.`,
    };
  }

  // missingAddendWithin5 — same fact family, different unknown position.
  const sum = randInt(1, 5);
  const a = randInt(0, sum);
  const missing = sum - a;
  return {
    title: "Fast fact: missing addend",
    bucket,
    story: `${a} + ? = ${sum}.`,
    visual: () => <SplitGroup total={sum} partA={a} toneA="a" toneB="b" />,
    steps: [
      { kind: "number", prompt: `${a} + ? = ${sum}. What number is missing?`, hint: "What number joins with the first one to reach the total?", explain: `${a} + ${missing} = ${sum}.`, answer: missing },
      choice(
        { prompt: "Which number sentence also shows this fact?", hint: "Addition facts work in either order.", explain: `${missing} + ${a} = ${sum}, same as ${a} + ${missing} = ${sum}.` },
        `${missing} + ${a} = ${sum}`,
        [`${sum} + ${a} = ${missing}`] // misconception: placing the total in the wrong position
      ),
    ],
    wrapUp: `${a} + ${missing} = ${sum}.`,
  };
}

export const fastFactsWithin5: Unit = {
  id: "fastFactsWithin5",
  title: "Fast Facts Within 5",
  goal: "Quickly add or subtract any two numbers when the answer is 5 or less, without counting it out.",
  standard: "K.OA.5",
  keyIdea: (
    <>
      <p>Every fact in this unit has an answer of 5 or less — the goal is SPEED, instantly knowing the answer instead of counting it out every time.</p>
      <p>Doubles facts (1+1, 2+2) and missing-addend facts (2 + ? = 5) are the same ideas you already know, just asked a different way.</p>
    </>
  ),
  Explore,
  // The Check for Understanding gates Practice, and comes back every 20
  // solves: K.OA.5's "fluently" means facts known by heart, which can fade.
  requiresIntro: true,
  reintroEverySolved: 20,
  problems: [{ label: "Fast Facts", make: fastFactsProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: fastFactsWithin5Test,
};
