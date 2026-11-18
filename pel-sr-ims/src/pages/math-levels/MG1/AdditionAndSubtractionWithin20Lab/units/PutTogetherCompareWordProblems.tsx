import { useState } from "react";
import { CompareRows, TenFrameGroup } from "../diagrams";
import { storySentenceChoices } from "../logic";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { putTogetherCompareWordProblemsTest } from "./PutTogetherCompareWordProblemsTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx): one short question at a time,
// a picture, typed answers. Targets the plan's named misconceptions:
// subtracting the wrong way on a "fewer" compare story, treating "more" /
// "fewer" as the operation instead of reading which amount is bigger (both
// asked about the SAME two rows, one after the other), and treating a
// both-parts-missing story as having one right answer. Each question gets a
// "Look here" pointer after its 2nd wrong try; "show it" comes on the 3rd.

/** CFU "Look here" pointers: the Explore spot that teaches each question (shown after its 2nd miss). */
const LOOK = {
  whole: { target: "ptc-whole", label: "Explore: put together", say: "Look here. Put the two parts together." },
  ways: { target: "ptc-ways", label: "Explore: try different splits", say: "Look here. Try other splits." },
  part: { target: "ptc-part", label: "Explore: find a missing part", say: "Look here. Start with the total. Take away the part." },
  // Q4/Q5 (typed): the same line as their nudge (E2-45).
  diff: { target: "ptc-diff", label: "Explore: compare", say: "Look here. Line them up. Count the extras." },
  // Q6 (which number sentence): its own line.
  diffPick: { target: "ptc-diff", label: "Explore: compare", say: "Look here. Start with the bigger. Take away the smaller." },
};

/** Two given amounts, each its own ten-frame (nothing combined before a try). */
function TwoParts({ a, b }: { a: number; b: number }) {
  return (
    <div className="control-row" style={{ gap: 20, alignItems: "flex-start" }}>
      <TenFrameGroup value={a} tone="a" />
      <TenFrameGroup value={b} tone="b" />
    </div>
  );
}

const crayons = (showGap: boolean) => (
  <CompareRows
    rows={[
      { label: "Lily", count: 9, tone: "a" },
      { label: "Ben", count: 5, tone: "b" },
    ]}
    showGap={showGap}
  />
);

function PutTogetherCompareCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="Mia has 4 green buttons and 5 orange buttons. How many buttons in all?"
            answer={9}
            tone="c"
            picture={(m) => (m === "show" || m === "done" ? <TenFrameGroup value={9} tone="a" splitAt={4} tone2="b" /> : <TwoParts a={4} b={5} />)}
            nudge="Put the two parts together."
            why={{ 1: "Put them together. Don't take away." }}
            showText="Watch: put them together. 4 and 5 make 9."
            praise="Yes! 4 + 5 = 9."
            look={LOOK.whole}
            onComplete={done}
          />
        ),
        // Both parts unknown, as two typed splits of the same 6 (C2-01: the
        // old "Is there just one way?" two-button pick is gone). Q2's praise
        // doesn't name 1 and 5, which is Q3's answer. Q2 says the part right
        // away (E3-53: no "Some are…" that "2 are…" then replaces).
        (done) => (
          <TypeCheck
            n={2}
            prompt="Jake has 6 cards. 2 are sports cards. The rest are animal cards. How many are animal cards?"
            answer={4}
            tone="b"
            picture={(m) => (m === "ask" ? <TenFrameGroup value={6} tone="c" /> : <TenFrameGroup value={6} tone="a" splitAt={2} tone2="b" />)}
            nudge="Start with 6. Take away the 2."
            why={{ 8: "6 cards in all. Don't add.", 6: "6 is all the cards." }}
            showText="Watch: 2 are sports cards. Count the rest: 1, 2, 3, 4."
            praise="Yes! 2 and 4 make 6."
            look={LOOK.part}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="Now 5 are sports cards. How many are animal cards?"
            answer={1}
            tone="b"
            picture={(m) => (m === "ask" ? <TenFrameGroup value={6} tone="c" /> : <TenFrameGroup value={6} tone="a" splitAt={5} tone2="b" />)}
            nudge="Start with 6. Take away the 5."
            why={{ 11: "6 cards in all. Don't add.", 6: "6 is all the cards.", 4: "Now 5 are sports cards." }}
            showText="Watch: 5 are sports cards. Count the rest: 1."
            praise="Yes! You can split 6 many ways."
            look={LOOK.ways}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="Lily has 9 crayons. Ben has 5. How many more crayons does Lily have than Ben?"
            answer={4}
            tone="a"
            picture={(m) => crayons(m !== "ask")}
            nudge="Line them up. Count the extras."
            why={{ 14: "Don't add. Line them up.", 9: "That is all of Lily's.", 5: "That is all of Ben's." }}
            showText="Watch: match them up. The extras are 1, 2, 3, 4."
            praise="Yes! Lily has 4 more."
            look={LOOK.diff}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={5}
            prompt="How many fewer crayons does Ben have than Lily?"
            answer={4}
            tone="b"
            picture={(m) => crayons(m !== "ask")}
            nudge="Line them up. Count the extras."
            why={{ 14: "Don't add. Line them up.", 5: "That is all of Ben's.", 9: "That is all of Lily's." }}
            showText="Watch: match them up. Ben is missing 1, 2, 3, 4."
            praise="Yes! 4 more. 4 fewer. Same gap."
            look={LOOK.diff}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={6}
            prompt="Ben has 5 crayons. Lily has 9. Which one finds how many fewer?"
            picture={
              <CompareRows
                rows={[
                  { label: "Ben", count: 5, tone: "b" },
                  { label: "Lily", count: 9, tone: "a" },
                ]}
              />
            }
            showPicture={
              <CompareRows
                rows={[
                  { label: "Ben", count: 5, tone: "b" },
                  { label: "Lily", count: 9, tone: "a" },
                ]}
                showGap
              />
            }
            options={[
              { id: "5-9", label: "5 − 9" },
              { id: "9-5", label: "9 − 5" },
              { id: "9+5", label: "9 + 5" },
            ]}
            answer="9-5"
            why={{ "5-9": "Start with the bigger number.", "9+5": "Don't add. Find the extras." }}
            showText="Watch: start with Lily's 9. Take away Ben's 5."
            praise="Yes! 9 − 5 = 4."
            look={LOOK.diffPick}
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
  // Not the CFU's numbers (4 + 5, 9 and 5), so a "Look here" never shows a CFU answer.
  const [green, setGreen] = useState(6);
  const [orange, setOrange] = useState(7);
  const total = green + orange;

  const [lily, setLily] = useState(8);
  const [ben, setBen] = useState(3);
  const [say, setSay] = useState<"gap" | "more" | "fewer">("gap");
  const lilyBigger = lily >= ben;
  const [bigName, bigN, smallName, smallN] = lilyBigger ? ["Lily", lily, "Ben", ben] : ["Ben", ben, "Lily", lily];
  const diff = bigN - smallN;
  // The CFU's compare questions point at the gap line.
  useLookHereRequest((id) => {
    if (id === "ptc-diff") setSay("gap");
  });

  const compareLine =
    diff === 0
      ? `Lily and Ben have the same. The gap is 0.`
      : say === "gap"
        ? `${bigName} has ${bigN}. ${smallName} has ${smallN}. The gap is ${diff}.`
        : say === "more"
          ? `${smallName} has ${smallN}. ${bigName} has ${diff} more than ${smallName}. So ${bigName} has ${smallN} + ${diff} = ${bigN}.`
          : `${bigName} has ${bigN}. ${smallName} has ${diff} fewer than ${bigName}. So ${smallName} has ${bigN} − ${diff} = ${smallN}.`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="control-row" data-readaloud-part>
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

      <div>
        <ReadAloud as="p" className="muted small">
          Put together: two parts make a total.
        </ReadAloud>
        {/* Each part's range comes from the other, so the total stays at most 20. */}
        <div className="control-row" data-readaloud-part>
          <Stepper label="Green" value={green} min={0} max={20 - orange} step={1} onChange={setGreen} tone="a" />
          <Stepper label="Orange" value={orange} min={0} max={20 - green} step={1} onChange={setOrange} tone="b" />
        </div>
        <div {...lookHereSpot("ptc-whole")}>
          <TenFrameGroup value={total} tone="a" splitAt={green} tone2="b" />
          <ReadAloud as="p" className="muted small" data-look-here-key>
            {green} green and {orange} orange make {total} in all. {green} + {orange} = {total}.
          </ReadAloud>
        </div>
        <div {...lookHereSpot("ptc-ways")}>
          <div className="control-row" data-readaloud-part>
            <button
              type="button"
              className="btn ghost"
              disabled={green <= 0}
              onClick={() => {
                setGreen(green - 1);
                setOrange(orange + 1);
              }}
            >
              Move one to orange
            </button>
            <button
              type="button"
              className="btn ghost"
              disabled={orange <= 0}
              onClick={() => {
                setOrange(orange - 1);
                setGreen(green + 1);
              }}
            >
              Move one to green
            </button>
          </div>
          <ReadAloud as="p" className="muted small" data-look-here-key>
            Try other green and orange splits. The total stays the same.
          </ReadAloud>
        </div>
        <ReadAloud as="p" className="muted small" {...lookHereSpot("ptc-part")}>
          <span data-look-here-key>Know the total and one part? Start with the total. Take away the part.</span>
        </ReadAloud>
      </div>

      <div>
        <ReadAloud as="p" className="muted small">
          Compare: line them up. Find the extras.
        </ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Stepper label="Lily" value={lily} min={0} max={20} step={1} onChange={setLily} tone="a" />
          <Stepper label="Ben" value={ben} min={0} max={20} step={1} onChange={setBen} tone="b" />
          <Segmented
            label="Say it"
            value={say}
            onChange={setSay}
            options={[
              { id: "gap", label: "The gap" },
              { id: "more", label: "More than" },
              { id: "fewer", label: "Fewer than" },
            ]}
          />
        </div>
        <div {...lookHereSpot("ptc-diff")}>
          <CompareRows
            rows={[
              { label: "Lily", count: lily, tone: "a" },
              { label: "Ben", count: ben, tone: "b" },
            ]}
            showGap
          />
          <ReadAloud as="p" className="muted small" data-look-here-key>
            {compareLine}
          </ReadAloud>
          {say === "gap" && diff > 0 && (
            <ReadAloud as="p" className="muted small">
              {bigName} has {diff} more. {smallName} has {diff} fewer.
            </ReadAloud>
          )}
        </div>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <PutTogetherCompareCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "ptaTotalUnknown" | "ptaAddendUnknown" | "ptaBothAddendsUnknown" | "compareDiffMore" | "compareDiffFewer" | "compareBiggerUnknown" | "compareSmallerUnknown";
const BUCKETS: Bucket[] = ["ptaTotalUnknown", "ptaAddendUnknown", "ptaBothAddendsUnknown", "compareDiffMore", "compareDiffFewer", "compareBiggerUnknown", "compareSmallerUnknown"];

// `one` is the singular ("1 button"). Mia's buttons are green and orange, the lab's two colors.
// Parts are words that also work alone ("3 are big"), not nouns ("3 are sports").
const ITEM_CONTEXTS = [
  { person: "Mia", item: "buttons", one: "button", partA: "green", partB: "orange" },
  { person: "Jake", item: "cards", one: "card", partA: "big", partB: "small" },
  { person: "Ava", item: "beads", one: "bead", partA: "round", partB: "square" },
  { person: "Liam", item: "stickers", one: "sticker", partA: "shiny", partB: "plain" },
];

const COMPARE_CONTEXTS = [
  { a: "Lily", b: "Ben", item: "crayons", one: "crayon" },
  { a: "Noah", b: "Ella", item: "pencils", one: "pencil" },
  { a: "Grace", b: "Max", item: "toy cars", one: "toy car" },
  { a: "Ivy", b: "Sam", item: "seashells", one: "seashell" },
];

/** "1 button" / "3 buttons". */
const count = (n: number, ctx: { item: string; one: string }) => `${n} ${n === 1 ? ctx.one : ctx.item}`;
const isAre = (n: number) => (n === 1 ? "is" : "are");
/** "9, 10, 11" — the numbers you say counting from `from` to `to`. */
const countWords = (from: number, to: number) => {
  const dir = to > from ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) }, (_, k) => from + (k + 1) * dir).join(", ");
};
/** About 1 second per number said, after a short lead-in (Show me pacing), at most 7 seconds. */
const holdFor = (n: number) => Math.min(7000, 1000 + n * 1000);

function roleChoice(correct: "the total" | "a part") {
  return choice({ prompt: "What is missing?", hint: "The story tells two numbers. Which one is missing?", explain: correct === "the total" ? "The total is missing." : "A part is missing." }, correct, [correct === "the total" ? "a part" : "the total"]);
}

/** The student picks the number sentence for this story (C1-07). */
function sentenceChoice(prompt: string, p: number, q: number, correct: string, answer: number) {
  return choice(
    { prompt, hint: "Do you put together or take away?", explain: `${correct} matches the story.` },
    correct,
    storySentenceChoices(p, q, correct, answer) // misconceptions: the other sign (keyword), the two numbers the wrong way
  );
}

function wordProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "ptaTotalUnknown") {
    const ctx = pick(ITEM_CONTEXTS);
    const a = randInt(1, 9);
    const b = randInt(1, 9);
    const total = a + b;
    const big = Math.max(a, b);
    return {
      title: "Story problem",
      bucket,
      story: `${ctx.person} has ${a} ${ctx.partA} ${a === 1 ? ctx.one : ctx.item} and ${b} ${ctx.partB} ${b === 1 ? ctx.one : ctx.item}. How many ${ctx.item} does ${ctx.person} have in all?`,
      // Before help: the two parts on their own. Stuck on the total: put together.
      visual: (_done: number, help?: VisualHelp) => (pointing(help, 2) ? <TenFrameGroup value={total} tone="a" splitAt={a} tone2="b" /> : <TwoParts a={a} b={b} />),
      steps: [
        roleChoice("the total"),
        sentenceChoice("Which one matches the story?", a, b, `${a} + ${b} = ☐`, total),
        {
          kind: "number",
          prompt: "How many in all?",
          hint: "Put the two parts together.",
          showMe: `Put them together. Start at ${big}. Count on ${a + b - big}: ${countWords(big, total)}.`,
          showMeHoldMs: holdFor(a + b - big),
          explain: `${a} + ${b} = ${total}.`,
          answer: total,
        },
      ],
      wrapUp: `${a} + ${b} = ${total}.`,
    };
  }

  if (bucket === "ptaAddendUnknown") {
    const ctx = pick(ITEM_CONTEXTS);
    const total = randInt(6, 18);
    // At least 2 left over, so "the rest are" always fits.
    const a = randInt(1, total - 2);
    const b = total - a;
    return {
      title: "Story problem",
      bucket,
      story: `${ctx.person} has ${total} ${ctx.item}. ${a} ${isAre(a)} ${ctx.partA}. The rest are ${ctx.partB}. How many are ${ctx.partB}?`,
      // Before help: the total, all one color. Stuck: the known part and the rest in two colors.
      visual: (_done: number, help?: VisualHelp) => (pointing(help, 2) ? <TenFrameGroup value={total} tone="a" splitAt={a} tone2="b" /> : <TenFrameGroup value={total} tone="c" />),
      steps: [
        roleChoice("a part"),
        sentenceChoice("Which one matches the story?", a, total, `${a} + ☐ = ${total}`, b),
        {
          kind: "number",
          prompt: `How many are ${ctx.partB}?`,
          hint: "Start with the total. Take away the part.",
          showMe: `Start with ${total}. Take away the ${a} ${ctx.partA}. The rest are ${b}.`,
          showMeHoldMs: 3000,
          explain: `${total} − ${a} = ${b}.`,
          answer: b,
        },
      ],
      wrapUp: `${a} + ${b} = ${total}.`,
    };
  }

  if (bucket === "ptaBothAddendsUnknown") {
    const ctx = pick(ITEM_CONTEXTS);
    const total = randInt(5, 12);
    const g1 = randInt(1, total - 1);
    let g2 = randInt(1, total - 1);
    while (g2 === g1) g2 = randInt(1, total - 1);
    return {
      title: "Story problem",
      bucket,
      story: `${ctx.person} has ${total} ${ctx.item}. Some are ${ctx.partA}. Some are ${ctx.partB}.`,
      // Help ladder / Show me: color THAT step's split, so the picture shows
      // the one way being asked about (not the other one).
      visual: (done: number, help?: VisualHelp) => {
        const splitAt = pointing(help, 0) ? g1 : pointing(help, 1) || done >= 2 ? g2 : undefined;
        return splitAt === undefined ? <TenFrameGroup value={total} tone="c" /> : <TenFrameGroup value={total} tone="a" splitAt={splitAt} tone2="b" />;
      },
      steps: [
        { kind: "number", prompt: `${g1} ${isAre(g1)} ${ctx.partA}. How many are ${ctx.partB}?`, hint: `Start with ${total}. Take away ${g1}.`, explain: `${total} − ${g1} = ${total - g1}.`, answer: total - g1 },
        {
          kind: "number",
          prompt: `Now ${g2} ${isAre(g2)} ${ctx.partA}. How many are ${ctx.partB}?`,
          hint: `Start with ${total}. Take away ${g2}.`,
          showMe: `${g2} ${isAre(g2)} ${ctx.partA}. The rest ${isAre(total - g2)} ${total - g2}. That is another way.`,
          showMeHoldMs: 3000,
          explain: `${total} − ${g2} = ${total - g2}. That is another way to split ${total}.`,
          answer: total - g2,
        },
      ],
      wrapUp: `You can split ${total} ${ctx.item} many ways.`,
    };
  }

  if (bucket === "compareDiffMore" || bucket === "compareDiffFewer") {
    const ctx = pick(COMPARE_CONTEXTS);
    const small = randInt(2, 14);
    const diff = randInt(1, Math.min(9, 20 - small));
    const big = small + diff;
    const showMe = { showMe: `Match them up. Count the extras: ${countWords(0, diff)}.`, showMeHoldMs: holdFor(diff) };
    if (bucket === "compareDiffMore") {
      return {
        title: "Compare",
        bucket,
        story: `${ctx.a} has ${count(big, ctx)}. ${ctx.b} has ${count(small, ctx)}. How many more ${ctx.item} does ${ctx.a} have than ${ctx.b}?`,
        // Rows line up one-to-one; when stuck, the extras get circled.
        visual: (_done: number, help?: VisualHelp) => (
          <CompareRows
            rows={[
              { label: ctx.a, count: big, tone: "a" },
              { label: ctx.b, count: small, tone: "b" },
            ]}
            showGap={pointing(help, 1)}
          />
        ),
        steps: [
          sentenceChoice("Which one finds the answer?", big, small, `${big} − ${small} = ☐`, diff),
          { kind: "number", prompt: "How many more?", hint: "Line them up. Count the extras.", ...showMe, explain: `${big} − ${small} = ${diff}.`, answer: diff },
        ],
        wrapUp: `${big} − ${small} = ${diff}. ${ctx.a} has ${diff} more.`,
      };
    }
    return {
      title: "Compare",
      bucket,
      story: `${ctx.b} has ${count(small, ctx)}. ${ctx.a} has ${count(big, ctx)}. How many fewer ${ctx.item} does ${ctx.b} have than ${ctx.a}?`,
      visual: (_done: number, help?: VisualHelp) => (
        <CompareRows
          rows={[
            { label: ctx.b, count: small, tone: "b" },
            { label: ctx.a, count: big, tone: "a" },
          ]}
          showGap={pointing(help, 0) || pointing(help, 1)}
        />
      ),
      steps: [
        sentenceChoice("Which one finds the answer?", small, big, `${big} − ${small} = ☐`, diff),
        { kind: "number", prompt: "How many fewer?", hint: "Start with the bigger number. Take away the smaller one.", ...showMe, explain: `${big} − ${small} = ${diff}.`, answer: diff },
      ],
      wrapUp: `${big} − ${small} = ${diff}. ${ctx.b} has ${diff} fewer.`,
    };
  }

  // compareBiggerUnknown / compareSmallerUnknown, both worded the right way
  // for 1st grade ("more" finds the bigger, "fewer" finds the smaller).
  // diff < base keeps the smaller amount at 1 or more; base + diff ≤ 20.
  const ctx = pick(COMPARE_CONTEXTS);
  const base = randInt(2, 15);
  const diff = randInt(1, Math.min(9, base - 1, 20 - base));

  if (bucket === "compareBiggerUnknown") {
    const biggerAmount = base + diff;
    return {
      title: "Compare",
      bucket,
      story: `${ctx.b} has ${count(base, ctx)}. ${ctx.a} has ${diff} more than ${ctx.b}. How many ${ctx.item} does ${ctx.a} have?`,
      visual: (_done: number, help?: VisualHelp) =>
        pointing(help, 1) ? (
          <CompareRows
            rows={[
              { label: ctx.b, count: base, tone: "b" },
              { label: ctx.a, count: biggerAmount, tone: "a" },
            ]}
            showGap
          />
        ) : (
          <TenFrameGroup value={base} tone="b" />
        ),
      steps: [
        sentenceChoice("Which one finds the answer?", base, diff, `${base} + ${diff} = ☐`, biggerAmount),
        {
          kind: "number",
          prompt: `How many does ${ctx.a} have?`,
          hint: `${ctx.a} has ${diff} more. Count on ${diff} from ${base}.`,
          showMe: `${ctx.b} has ${base}. ${ctx.a} has ${diff} more: ${countWords(base, biggerAmount)}.`,
          showMeHoldMs: holdFor(diff),
          explain: `${base} + ${diff} = ${biggerAmount}.`,
          answer: biggerAmount,
        },
      ],
      wrapUp: `${base} + ${diff} = ${biggerAmount}.`,
    };
  }
  const smallerAmount = base - diff;
  return {
    title: "Compare",
    bucket,
    story: `${ctx.a} has ${count(base, ctx)}. ${ctx.b} has ${diff} fewer than ${ctx.a}. How many ${ctx.item} does ${ctx.b} have?`,
    visual: (_done: number, help?: VisualHelp) =>
      pointing(help, 1) ? (
        <CompareRows
          rows={[
            { label: ctx.a, count: base, tone: "a" },
            { label: ctx.b, count: smallerAmount, tone: "b" },
          ]}
          showGap
        />
      ) : (
        <TenFrameGroup value={base} tone="a" />
      ),
    steps: [
      sentenceChoice("Which one finds the answer?", base, diff, `${base} − ${diff} = ☐`, smallerAmount),
      {
        kind: "number",
        prompt: `How many does ${ctx.b} have?`,
        hint: `"Fewer" means ${ctx.b} has less.`,
        showMe: `${ctx.a} has ${base}. ${ctx.b} has ${diff} fewer. Count back ${diff}: ${countWords(base, smallerAmount)}.`,
        showMeHoldMs: holdFor(diff),
        explain: `${base} − ${diff} = ${smallerAmount}.`,
        answer: smallerAmount,
      },
    ],
    wrapUp: `${base} − ${diff} = ${smallerAmount}.`,
  };
}

// ============================================================================
// CHALLENGE (optional, user decision C1-26): a "fewer" story where you ADD.
// "Ben has 3 fewer than Lily. Ben has 5. How many does Lily have?" Not in
// Mixed, requiredBuckets, the Unit Test or the Module Test, so it never
// counts toward stars; a student picks "Challenge: tricky compare stories" by hand.
// ============================================================================

const CHALLENGE_BUCKET = "challengeFewerAdd";

function fewerAddChallenge(): Problem {
  const ctx = pick(COMPARE_CONTEXTS);
  // The smaller amount (known) 1–15; the bigger one (asked) at most 20.
  const small = randInt(1, 15);
  const diff = randInt(1, Math.min(9, 20 - small));
  const big = small + diff;
  return {
    title: "Challenge",
    bucket: CHALLENGE_BUCKET,
    story: `${ctx.b} has ${diff} fewer ${diff === 1 ? ctx.one : ctx.item} than ${ctx.a}. ${ctx.b} has ${small}. How many ${ctx.item} does ${ctx.a} have?`,
    // Before help: what the story gives (the smaller row). Stuck: both rows lined up, the extras circled.
    visual: (_done: number, help?: VisualHelp) =>
      pointing(help, 0) || pointing(help, 1) ? (
        <CompareRows
          rows={[
            { label: ctx.b, count: small, tone: "b" },
            { label: ctx.a, count: big, tone: "a" },
          ]}
          showGap
        />
      ) : (
        <TenFrameGroup value={small} tone="b" />
      ),
    steps: [
      // The keyword trap: "fewer" sounds like take away, but the bigger amount is asked.
      // Its own hint says who has more (C3-06), not the generic "put together or take away".
      { ...sentenceChoice("Which one finds the answer?", small, diff, `${small} + ${diff} = ☐`, big), hint: `${ctx.b} has fewer. So ${ctx.a} has more.` },
      {
        kind: "number",
        prompt: `How many does ${ctx.a} have?`,
        hint: `${ctx.a} has ${diff} more. Count on ${diff} from ${small}.`,
        showMe: `${ctx.b} has ${small}. ${ctx.a} has ${diff} more: ${countWords(small, big)}.`,
        showMeHoldMs: holdFor(diff),
        explain: `${small} + ${diff} = ${big}.`,
        answer: big,
      },
    ],
    wrapUp: `${small} + ${diff} = ${big}. ${ctx.a} has ${diff} more than ${ctx.b}.`,
  };
}

export const putTogetherCompareWordProblems: Unit = {
  id: "putTogetherCompareWordProblems",
  title: "Put Together and Compare Stories",
  goal: "Solve put-together stories and compare stories.",
  standard: "1.OA.1",
  keyIdea: (
    <>
      <p>Two parts make a total.</p>
      <p>To compare, line them up. Find the extras.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [
    { label: "Put Together and Compare", make: wordProblem, buckets: BUCKETS },
    // Optional: not in Mixed, and its bucket is not in requiredBuckets (no stars).
    { label: "Challenge: tricky compare stories", make: fewerAddChallenge, buckets: [CHALLENGE_BUCKET], optional: true },
  ],
  requiredBuckets: BUCKETS,
  test: putTogetherCompareWordProblemsTest,
};
