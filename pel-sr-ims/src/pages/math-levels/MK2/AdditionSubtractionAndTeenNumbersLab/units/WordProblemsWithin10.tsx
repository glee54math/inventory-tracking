import { useState } from "react";
import { ObjectGroup, SplitGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { wordProblemsWithin10Test } from "./WordProblemsWithin10Test";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

// ============================================================================
// CHECK FOR UNDERSTANDING — gates Practice
// ============================================================================
// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Each story is short and read aloud, with a picture of what it gives.
// Ideas checked: a group gets more (add to); some go away (take from — the
// answer is fewer); two groups already together (put together); comparing
// two groups by lining them up.

function WordProblemsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="Jen has 3 stickers. She gets 2 more. How many does she have now?"
            answer={5}
            tone="a"
            picture={() => <SplitGroup total={5} partA={3} toneA="a" toneB="b" />}
            nudge="The blue ones are what she had. The orange ones are new. Count them all."
            showText="Watch and listen: 1, 2, 3, 4, 5."
            praise="Yes! 3 + 2 = 5 stickers."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="Sam had 6 crackers. He ate 2. How many are left?"
            answer={4}
            tone="a"
            picture={(m) => <SplitGroup total={6} partA={4} toneA="a" toneB={m === "ask" ? "a" : "b"} showDivider={m !== "ask"} goneB={m !== "ask"} />}
            nudge="He ate 2, so 2 are gone. Count the ones left."
            why={{ 8: "He ate some. That leaves fewer, not more.", 6: "He ate 2. Those are gone." }}
            showText="Watch: 2 are eaten. The ones left are 1, 2, 3, 4."
            praise="Yes! 6 − 2 = 4 crackers."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="A jar has 4 red marbles and 3 blue marbles. How many marbles in the jar?"
            answer={7}
            tone="a"
            picture={() => <SplitGroup total={7} partA={4} toneA="b" toneB="a" showDivider={false} />}
            nudge="Count every marble in the jar, both colors."
            why={{ 4: "That is just one color. Count both colors.", 3: "That is just one color. Count both colors." }}
            showText="Watch and listen: 1, 2, 3, 4, 5, 6, 7."
            praise="Yes! 4 + 3 = 7 marbles."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="Mia has 5 apples. Theo has 3 apples. Who has more?"
            picture={
              <div style={{ display: "grid", gap: 6 }}>
                <ObjectGroup count={5} arrangement="line" tone="a" alignLeft />
                <ObjectGroup count={3} arrangement="line" tone="b" alignLeft />
              </div>
            }
            showPicture={
              <div style={{ display: "grid", gap: 6 }}>
                <ObjectGroup count={5} arrangement="line" tone="a" alignLeft ringFrom={3} />
                <ObjectGroup count={3} arrangement="line" tone="b" alignLeft />
              </div>
            }
            showText="Look: line them up. Mia's row has extras. Mia has more."
            options={[
              { id: "mia", label: <span style={{ color: "var(--qa)", fontWeight: 800 }}>Mia</span> },
              { id: "theo", label: <span style={{ color: "var(--qb)", fontWeight: 800 }}>Theo</span> },
            ]}
            answer="mia"
            why={{ theo: "Line them up. Whose row is longer?" }}
            praise="Yes! Mia has more apples."
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

type Scenario = "addTo" | "takeFrom" | "together" | "missingPart" | "compare";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("addTo");
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const maxB = scenario === "together" || scenario === "missingPart" || scenario === "addTo" ? Math.max(0, 10 - a) : 10;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="Story type"
          value={scenario}
          onChange={setScenario}
          options={[
            { id: "addTo", label: "Add to" },
            { id: "takeFrom", label: "Take from" },
            { id: "together", label: "Put together" },
            { id: "missingPart", label: "Missing part" },
            { id: "compare", label: "Compare" },
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
      <div className="control-row" data-readaloud-part>
        <Stepper label={scenario === "compare" ? "Group A" : scenario === "missingPart" ? "Total" : "First amount"} value={a} min={1} max={10} step={1} onChange={setA} tone="a" />
        <Stepper label={scenario === "compare" ? "Group B" : scenario === "missingPart" ? "Known part" : "Second amount"} value={b} min={scenario === "missingPart" ? 1 : 0} max={scenario === "missingPart" ? a - 1 || 1 : maxB} step={1} onChange={setB} tone="b" />
      </div>

      {scenario === "addTo" && (
        <>
          <ReadAloud as="p">Jen has {a} stickers. She gets {b} more. How many does she have now?</ReadAloud>
          <SplitGroup total={a + b} partA={a} toneA="a" toneB="b" />
          <ReadAloud as="p" className="muted small">{a} + {b} = {a + b}. An "add to" story starts with one amount, and MORE joins it — look for words like "gets," "gives her," "more."</ReadAloud>
        </>
      )}
      {scenario === "takeFrom" && (
        <>
          <ReadAloud as="p">Sam had {a} crackers. He ate {b} of them. How many are left?</ReadAloud>
          <SplitGroup total={a} partA={a - Math.min(b, a)} toneA="a" toneB="b" />
          <ReadAloud as="p" className="muted small">{a} − {Math.min(b, a)} = {a - Math.min(b, a)}. A "take from" story starts with one amount, and SOME of it leaves — look for words like "ate," "gave away," "left."</ReadAloud>
        </>
      )}
      {scenario === "together" && (
        <>
          <ReadAloud as="p">Jen has {a} red marbles and {b} blue marbles, all together in one jar. How many marbles in the jar?</ReadAloud>
          <SplitGroup total={a + b} partA={a} toneA="a" toneB="b" showDivider={false} />
          <ReadAloud as="p" className="muted small">{a} + {b} = {a + b}. A "put together" story describes two groups that coexist from the start — nothing joins or leaves; you're just finding their combined total.</ReadAloud>
        </>
      )}
      {scenario === "missingPart" && (
        <>
          <ReadAloud as="p">There are {a} crayons in a box. {b} of them are red, and the rest are blue. How many are blue?</ReadAloud>
          <SplitGroup total={a} partA={b} toneA="b" toneB="a" />
          <ReadAloud as="p" className="muted small">{a} − {b} = {a - b} blue crayons. When the TOTAL and one part are both known, you can subtract to find the missing part — even though the story never says "take away."</ReadAloud>
        </>
      )}
      {scenario === "compare" && (
        <>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <ObjectGroup count={a} arrangement="line" tone="a" seed={a * 9 + 1} />
            <ObjectGroup count={b} arrangement="line" tone="b" seed={b * 9 + 2} />
          </div>
          <ReadAloud as="p">Mia has {a} apples. Theo has {b} apples. How many more apples does Mia have than Theo?</ReadAloud>
          <ReadAloud as="p" className="muted small">
            {a === b ? "They have the same amount — there's no difference to find." : `${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)}. A "compare" story has TWO separate groups that never join or split — you're just finding the gap between them.`}
          </ReadAloud>
        </>
      )}
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <WordProblemsCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "addToResult" | "takeFromResult" | "putTogetherTotal" | "putTogetherAddend" | "compareDifference";
const BUCKETS: Bucket[] = ["addToResult", "takeFromResult", "putTogetherTotal", "putTogetherAddend", "compareDifference"];

const KIDS = ["Jen", "Sam", "Mia", "Theo", "Ana", "Leo"] as const;
const ITEMS = ["stickers", "crayons", "marbles", "crackers", "balloons", "blocks"] as const;
const pickOne = <T,>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)];

function wordProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  const kid = pickOne(KIDS);
  const item = pickOne(ITEMS);

  if (bucket === "addToResult") {
    const a = randInt(1, 8);
    const b = randInt(1, Math.min(9, 10 - a));
    const total = a + b;
    return {
      title: "An 'add to' story",
      bucket,
      story: `${kid} has ${a} ${item}. ${kid} gets ${b} more ${item}. How many ${item} does ${kid} have now?`,
      visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: `How many ${item} does ${kid} have now?`, hint: "Add the starting amount and the amount that joined.", explain: `${a} + ${b} = ${total}.`, answer: total },
        choice(
          { prompt: "Does this story ADD or SUBTRACT?", hint: 'Look for the word "more" — something is joining.', explain: `${kid} gets MORE ${item}, so this story adds.` },
          "Add",
          ["Subtract"]
        ),
      ],
      wrapUp: `${kid} now has ${total} ${item}.`,
    };
  }

  if (bucket === "takeFromResult") {
    const total = randInt(2, 10);
    const b = randInt(1, total - 1);
    const a = total - b;
    return {
      title: "A 'take from' story",
      bucket,
      story: `${kid} had ${total} ${item}. ${kid} gave away ${b} of them. How many ${item} does ${kid} have left?`,
      // Once step 1 is shown/answered, the ones given away fade out.
      visual: (done) => <SplitGroup total={total} partA={a} toneA="a" toneB="b" goneB={done >= 1} />,
      steps: [
        { kind: "number", prompt: `How many ${item} does ${kid} have left?`, hint: "Subtract the amount given away from the starting amount.", explain: `${total} − ${b} = ${a}.`, answer: a },
        choice(
          { prompt: "Does this story ADD or SUBTRACT?", hint: 'Look for the word "gave away" — something is leaving.', explain: `${kid} gave ${item} AWAY, so this story subtracts.` },
          "Subtract",
          ["Add"]
        ),
      ],
      wrapUp: `${kid} has ${a} ${item} left.`,
    };
  }

  if (bucket === "putTogetherTotal") {
    const a = randInt(1, 8);
    const b = randInt(1, Math.min(9, 10 - a));
    const total = a + b;
    const item2 = pickOne(ITEMS.filter((it) => it !== item));
    return {
      title: "A 'put together' story",
      bucket,
      story: `${kid} has ${a} ${item} and ${b} ${item2}, all together in one basket. How many things are in the basket?`,
      visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" showDivider={false} />,
      steps: [
        { kind: "number", prompt: "How many things are in the basket, all together?", hint: "Add both groups — they're already together, nothing is joining or leaving.", explain: `${a} + ${b} = ${total}.`, answer: total },
        choice(
          { prompt: "Did anything JOIN or LEAVE in this story, or were both groups there the whole time?", hint: "Reread the story — does anything move?", explain: "Both groups were there the whole time — a 'put together' story just asks for the combined total." },
          "Both groups were there the whole time",
          ["Something joined partway through"] // misconception: treating a static put-together scene as a sequential "add to" action
        ),
      ],
      wrapUp: `${a} + ${b} = ${total} things in all.`,
    };
  }

  if (bucket === "putTogetherAddend") {
    const total = randInt(3, 10);
    const a = randInt(1, total - 1);
    const b = total - a;
    const item2 = pickOne(ITEMS.filter((it) => it !== item));
    return {
      title: "A missing-part story",
      bucket,
      story: `There are ${total} ${item} in a box. ${a} of them are ${item2.startsWith("c") ? "the first color" : "one color"}, and the rest are another color. How many are the OTHER color?`,
      visual: () => <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: "How many are the other color?", hint: "Subtract the known part from the total to find the missing part.", explain: `${total} − ${a} = ${b}.`, answer: b },
        choice(
          { prompt: "True or false: even though the story never says 'take away,' you can still subtract to find the missing part.", hint: "The total and one part are both known — the gap between them is the missing part.", explain: "True — whenever the total and one part are known, subtracting finds the other part, even with no take-away action in the story." },
          "True",
          ["False"] // misconception: thinking subtraction only applies to take-away action stories
        ),
      ],
      wrapUp: `${total} − ${a} = ${b}.`,
    };
  }

  // compareDifference — the hardest bucket: two separate static quantities.
  const a = randInt(2, 10);
  let b = randInt(1, 9);
  while (b === a) b = randInt(1, 9);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  const diff = bigger - smaller;
  const otherKid = pickOne(KIDS.filter((k) => k !== kid));
  const biggerKid = a > b ? kid : otherKid;
  const smallerKid = a > b ? otherKid : kid;
  return {
    title: "A 'compare' story",
    bucket,
    story: `${kid} has ${a} ${item}. ${otherKid} has ${b} ${item}. How many more ${item} does ${biggerKid} have than ${smallerKid}?`,
    // Step 1's "Show me" (and after) lines the two groups up one above the
    // other and rings the extra ones the bigger group has.
    visual: (done) =>
      done >= 1 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <ObjectGroup count={a} arrangement="line" tone="a" alignLeft ringFrom={a > b ? b : undefined} />
          <ObjectGroup count={b} arrangement="line" tone="b" alignLeft ringFrom={b > a ? a : undefined} />
        </div>
      ) : (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <ObjectGroup count={a} arrangement="line" tone="a" seed={a * 11 + 3} />
          <ObjectGroup count={b} arrangement="line" tone="b" seed={b * 11 + 5} />
        </div>
      ),
    steps: [
      { kind: "number", prompt: `How many more ${item} does ${biggerKid} have than ${smallerKid}?`, hint: "Subtract the smaller amount from the bigger amount.", explain: `${bigger} − ${smaller} = ${diff}.`, answer: diff },
      choice(
        { prompt: `If ${smallerKid} got ${diff} more ${item}, would ${smallerKid} then have the SAME amount as ${biggerKid}?`, hint: "Adding the difference back always closes the gap.", explain: `${smaller} + ${diff} = ${bigger}, so yes — they'd be equal.` },
        "Yes",
        ["No"] // misconception: not recognizing that the difference, added back, equalizes the two amounts
      ),
      { kind: "number", prompt: `How many ${item} does ${smallerKid} have?`, hint: "That's the smaller of the two starting amounts.", explain: `${smallerKid} has ${smaller} ${item}.`, answer: smaller },
    ],
    wrapUp: `${biggerKid} has ${diff} more ${item} than ${smallerKid}.`,
  };
}

export const wordProblemsWithin10: Unit = {
  id: "wordProblemsWithin10",
  title: "Solving Word Problems Within 10",
  goal: "Solve simple stories about adding and taking away, with numbers up to 10.",
  standard: "K.OA.2",
  keyIdea: (
    <>
      <p>Word problems describe add/subtract stories in different ways: a group getting MORE, a group having some TAKEN AWAY, two groups already TOGETHER, a missing PART of a known total, or two groups being COMPARED.</p>
      <p>Comparing two groups is the trickiest kind — nothing joins or leaves either group; you're just finding the gap between two separate amounts.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Word Problems", make: wordProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: wordProblemsWithin10Test,
};
