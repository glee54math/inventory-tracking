import { useState } from "react";
import { TenAndOnes } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { teenNumbersTest } from "./TeenNumbersTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

const NUMBER_WORDS: Record<number, string> = {
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
  16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen",
};

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Named misconception (per the plan): treating the "1" in a teen numeral as
// just another single digit, rather than a full ten-group.

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: a teen number is one ten and some ones; the ten is written
// first (14, not 41).

const teenQuestion = (n: number, ones: number, done: () => void) => (
  <TypeCheck
    n={n}
    prompt={`One ten and ${ones} ones. What number is it?`}
    answer={10 + ones}
    tone="a"
    picture={() => <TenAndOnes tens={1} ones={ones} />}
    nudge="Start at 10 for the full ten. Count on the ones."
    why={{ [ones * 10 + 1]: "That is backwards. Write the ten first, then the ones.", [ones]: "Don't forget the ten! Start at 10." }}
    showText={`Watch and listen: 10, ${Array.from({ length: ones }, (_, i) => 11 + i).join(", ")}.`}
    praise={`Yes! ${10 + ones} is ten and ${ones} more.`}
    onComplete={done}
  />
);

function TeenNumbersCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => teenQuestion(1, 4, done),
        (done) => (
          <TypeCheck
            n={2}
            prompt="16 is one ten and how many ones?"
            answer={6}
            tone="b"
            picture={() => <TenAndOnes tens={1} ones={6} />}
            nudge="The full ten is 10. Count the ones outside it."
            why={{ 16: "That is all of them. Count just the ones outside the ten." }}
            showText="Watch and listen: the ones are 1, 2, 3, 4, 5, 6."
            praise="Yes! 16 is ten and 6."
            onComplete={done}
          />
        ),
        (done) => teenQuestion(3, 9, done),
        (done) => (
          <PickCheck
            n={4}
            prompt="One ten and 3 ones. Which number is it?"
            picture={<TenAndOnes tens={1} ones={3} />}
            showPicture={<TenAndOnes tens={1} ones={3} />}
            showText="Count: 10, 11, 12, 13. The ten comes first."
            options={[
              { id: "31", label: "31" },
              { id: "13", label: "13" },
            ]}
            answer="13"
            why={{ "31": "That is backwards. Write the ten first, then the ones." }}
            praise="Yes! 13 is ten and 3."
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
  const [ones, setOnes] = useState(4);
  const teen = 10 + ones;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
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

      <TenAndOnes tens={1} ones={ones} tenTone="a" onesTone="b" />
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        1 full ten-group and {ones} extra ones make {teen} — "{NUMBER_WORDS[teen]}."
      </ReadAloud>
      <ReadAloud as="p" className="muted small">
        Written as a number sentence: 10 + {ones} = {teen}. The "1" in {teen} always means that whole ten-group, never just one single object — and
        every number from 11 to 19 is built exactly the same way.
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <TeenNumbersCheckForUnderstanding onComplete={onIntroDone} />}
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
