import { useEffect, useState } from "react";
import { StoryStrip, TenFrameGroup, type StoryPart } from "../diagrams";
import { storySentenceChoices } from "../logic";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { addToTakeFromWordProblemsTest } from "./AddToTakeFromWordProblemsTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx): one short question at a time,
// a picture of the story, typed answers. Targets the plan's named
// misconceptions: (1) "the answer is always the end," and (2) picking the
// operation from a keyword ("more" = add) instead of the story — the last
// two questions are the plan's required trap: a start-missing story that
// says "more", where you take away to find the start. Each question gets a
// "Look here" pointer after its 2nd wrong try; "show it" comes on the 3rd.

const ROLE_OPTIONS = [
  { id: "start", label: "the start" },
  { id: "change", label: "the change" },
  { id: "end", label: "the end" },
];

/** CFU "Look here" pointers: the Explore spot that teaches each question (shown after its 2nd miss). */
const LOOK = {
  roles: { target: "atf-roles", label: "Explore: start, change, or end", say: "Look here. Which one is missing?" },
  story: { target: "atf-story", label: "Explore: build your own story", say: "Look here. Start, then add more." },
  // Two spots, one per missing part (E2-36): each switches Explore to an Add
  // To story with that part missing, so the line there matches the nudge.
  missingChange: { target: "atf-missing-change", label: "Explore: the change is missing", say: "Look here. Count on to the end." },
  missingStart: { target: "atf-missing-start", label: "Explore: the start is missing", say: "Look here. Start at the end. Take away." },
};

/** Story roles drawn in the StoryStrip's colors: start a, change b, end c. */
const ROLE_TONE = { start: "a", change: "b", end: "c" } as const;

/** The numbers a story gives, before anything is solved: one ten-frame each, colored by its role (C2-02). */
function Given({ parts }: { parts: { n: number; role: StoryPart }[] }) {
  return (
    <div className="control-row" style={{ gap: 20, alignItems: "flex-start" }}>
      {parts.map(({ n, role }, i) => (
        <div key={i} style={{ width: 168 }}>
          <TenFrameGroup value={n} tone={ROLE_TONE[role]} />
          <p style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 800, margin: "4px 0 0" }}>{n}</p>
        </div>
      ))}
    </div>
  );
}

function WordProblemCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="Sam had 6 apples. He picked 5 more. What is missing?"
            picture={<Given parts={[{ n: 6, role: "start" }, { n: 5, role: "change" }]} />}
            showPicture={<StoryStrip start={6} change={5} end={11} action="add" missing="end" />}
            options={ROLE_OPTIONS}
            answer="end"
            why={{ start: "The story says he had 6.", change: "The story says he picked 5." }}
            showText="Watch: the story tells the start and the change. The end is missing."
            praise="Yes! The end is missing."
            look={LOOK.roles}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many apples does Sam have now?"
            answer={11}
            tone="c"
            picture={(m) => <StoryStrip start={6} change={5} end={11} action="add" missing="end" reveal={m === "show" || m === "done" ? 11 : undefined} />}
            nudge="Start with 6. Count on 5."
            why={{ 1: "He picked more. Now he has more.", 5: "That is how many he picked." }}
            showText="Watch and listen: 7, 8, 9, 10, 11."
            praise="Yes! 6 + 5 = 11."
            look={LOOK.story}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="Sam had 6 apples. He picked some more. Now he has 11. How many did he pick?"
            answer={5}
            tone="b"
            picture={(m) => <StoryStrip start={6} change={5} end={11} action="add" missing="change" reveal={m === "show" || m === "done" ? 5 : undefined} />}
            nudge="Start with 6. Count on to 11."
            why={{ 11: "11 is the end. How many did he pick?", 17: "Don't add 6 and 11." }}
            showText="Watch: count on from 6 to 11. 7, 8, 9, 10, 11. That is 5."
            praise="Yes! The change is 5."
            look={LOOK.missingChange}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="Ana had 9 shells. She lost some. Now she has 6. What is missing?"
            picture={<Given parts={[{ n: 9, role: "start" }, { n: 6, role: "end" }]} />}
            showPicture={<StoryStrip start={9} change={3} end={6} action="take" missing="change" />}
            options={ROLE_OPTIONS}
            answer="change"
            why={{ start: "The story says she had 9.", end: "The story says she has 6 now." }}
            showText="Watch: the story tells the start and the end. The change is missing."
            praise="Yes! The change is missing."
            look={LOOK.roles}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={5}
            prompt="Leo had some stickers. He got 4 more. Now he has 11. What is missing?"
            picture={<Given parts={[{ n: 4, role: "change" }, { n: 11, role: "end" }]} />}
            showPicture={<StoryStrip start={7} change={4} end={11} action="add" missing="start" />}
            options={ROLE_OPTIONS}
            answer="start"
            why={{ change: "The story says he got 4.", end: "The story says he has 11 now." }}
            showText="Watch: the story tells the change and the end. The start is missing."
            praise="Yes! The start is missing."
            look={LOOK.roles}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={6}
            prompt="How many stickers did Leo have at the start?"
            answer={7}
            tone="a"
            picture={(m) => <StoryStrip start={7} change={4} end={11} action="add" missing="start" reveal={m === "show" || m === "done" ? 7 : undefined} />}
            nudge="He got more. To find the start, take those away."
            why={{ 15: "He got more. To find the start, take those away.", 11: "11 is the end. What did he have at the start?" }}
            showText="Watch: start at 11. Take away 4. 7 are left."
            praise="Yes! 11 − 4 = 7."
            look={LOOK.missingStart}
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

/**
 * The Explore line under the "What is missing?" picture: true for this kind
 * of story and this missing part, with the picture's numbers in the order
 * you use them (E2-36), and the same way as the CFU nudges.
 */
function missingLine(action: "add" | "take", missing: StoryPart, start: number, change: number, end: number): string {
  if (missing === "end") return action === "add" ? "End missing? Start, then add the change." : "End missing? Start, then take away the change.";
  if (action === "add") return missing === "change" ? `Change missing? Start at ${start}. Count on to ${end}.` : `Start missing? Start at ${end}. Take away ${change}.`;
  return missing === "change" ? `Change missing? Start at ${start}. Count back to ${end}.` : `Start missing? Start at ${end}. Add back ${change}.`;
}

const SHOW_STEP_MS = 800;

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  // Not the CFU's numbers, so a "Look here" never shows a CFU answer
  // (answers 11, 5, 7). 3 + 6 = 9, not 5 + 3 = 8: Q3's pointer switches to
  // "Change missing? Start at 5…", and 5 was Q3's answer (C3-02).
  const [start, setStart] = useState(3);
  const [change, setChange] = useState(6);
  const [action, setAction] = useState<"add" | "take">("add");
  const [missing, setMissing] = useState<StoryPart>("end");
  // "Show": how many counters the missing box shows so far (counting on), or null.
  const [reveal, setReveal] = useState<number | null>(null);

  // Every control's range comes from the others, so the end is always 0–20 and true.
  const end = action === "add" ? start + change : start - change;
  const missingValue = missing === "start" ? start : missing === "change" ? change : end;
  // The other kind of story would go past 20 (or below 0) with these numbers: gray out the switch.
  const canSwitch = action === "add" ? start - change >= 0 : start + change <= 20;

  useEffect(() => {
    if (reveal === null || reveal >= missingValue) return;
    const t = window.setTimeout(() => setReveal((r) => (r === null ? r : r + 1)), SHOW_STEP_MS);
    return () => window.clearTimeout(t);
  }, [reveal, missingValue]);
  const hideReveal = () => setReveal(null);
  // The start-missing view is its own spot (CFU Q6); the others are the change spot (CFU Q3).
  const missingSpot = missing === "start" ? "atf-missing-start" : "atf-missing-change";

  // The CFU's "Look here" for a missing part comes from Add To stories:
  // switch to Add To with that part missing (keeping the end at most 20).
  useLookHereRequest((id) => {
    if (id === "atf-missing-change" || id === "atf-missing-start") {
      if (action === "take") {
        setAction("add");
        if (start + change > 20) setStart(20 - change);
      }
      setMissing(id === "atf-missing-start" ? "start" : "change");
      hideReveal();
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

      <ReadAloud as="p">Build your own story: start with some, then {action === "add" ? "add more" : "take some away"}.</ReadAloud>
      <div className="control-row" data-readaloud-part>
        <Stepper
          label="Start"
          value={start}
          min={action === "take" ? change : 0}
          max={action === "add" ? 20 - change : 20}
          step={1}
          onChange={(v) => {
            setStart(v);
            hideReveal();
          }}
          tone="a"
        />
        <Stepper
          label={action === "add" ? "Add" : "Take away"}
          value={change}
          min={0}
          max={action === "add" ? Math.min(10, 20 - start) : Math.min(10, start)}
          step={1}
          onChange={(v) => {
            setChange(v);
            hideReveal();
          }}
          tone="b"
        />
        <button
          className="btn ghost"
          disabled={!canSwitch}
          onClick={() => {
            setAction(action === "add" ? "take" : "add");
            hideReveal();
          }}
        >
          Switch to {action === "add" ? "Take From" : "Add To"}
        </button>
      </div>
      <div {...lookHereSpot("atf-story")}>
        <div className="control-row" style={{ gap: 24, alignItems: "flex-start" }} data-readaloud-part>
          <div>
            <TenFrameGroup value={start} tone="a" />
            <ReadAloud as="p" className="muted small" style={{ textAlign: "center" }}>
              Start: {start}
            </ReadAloud>
          </div>
          <div>
            <TenFrameGroup value={end} tone="c" />
            <ReadAloud as="p" className="muted small" style={{ textAlign: "center" }}>
              End: {end}
            </ReadAloud>
          </div>
        </div>
        <ReadAloud as="p" className="muted small" data-look-here-key>
          {action === "add" ? `${start} + ${change} = ${end}. It went up. This is an Add To story.` : `${start} − ${change} = ${end}. It went down. This is a Take From story.`}
        </ReadAloud>
      </div>
      <ReadAloud as="p" className="muted small" {...lookHereSpot("atf-roles")}>
        <span data-look-here-key>A story can hide the start, the change, or the end. Which one is missing?</span>
      </ReadAloud>
      {/* Keyed by its spot id, so a lit spot never changes id under the highlight. */}
      <div key={missingSpot} {...lookHereSpot(missingSpot)} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="control-row" data-readaloud-part>
          <Segmented
            label="What is missing?"
            value={missing}
            onChange={(m) => {
              setMissing(m);
              hideReveal();
            }}
            options={[
              { id: "start", label: "Start" },
              { id: "change", label: "Change" },
              { id: "end", label: "End" },
            ]}
          />
          <button type="button" className="btn primary" disabled={reveal !== null} onClick={() => setReveal(0)}>
            Show
          </button>
        </div>
        <StoryStrip start={start} change={change} end={end} action={action} missing={missing} reveal={reveal ?? undefined} />
        <ReadAloud as="p" className="muted small" data-look-here-key>
          {missingLine(action, missing, start, change, end)}
        </ReadAloud>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <WordProblemCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "addToResult" | "addToChange" | "addToStart" | "takeFromResult" | "takeFromChange" | "takeFromStart";
const BUCKETS: Bucket[] = ["addToResult", "addToChange", "addToStart", "takeFromResult", "takeFromChange", "takeFromStart"];

// verbAdd/verbTake are past tense ("Mia got 3"); the *Base forms follow "did" ("How many did Mia get?").
// `one` is the singular ("1 sticker"); `pr` is the pronoun for `person`.
const CONTEXTS: { person: string; pr: "he" | "she"; item: string; one: string; verbAdd: string; verbAddBase: string; verbTake: string; verbTakeBase: string }[] = [
  { person: "Mia", pr: "she", item: "stickers", one: "sticker", verbAdd: "got", verbAddBase: "get", verbTake: "gave away", verbTakeBase: "give away" },
  { person: "Jake", pr: "he", item: "marbles", one: "marble", verbAdd: "found", verbAddBase: "find", verbTake: "lost", verbTakeBase: "lose" },
  { person: "Ava", pr: "she", item: "crayons", one: "crayon", verbAdd: "got", verbAddBase: "get", verbTake: "lost", verbTakeBase: "lose" },
  { person: "Liam", pr: "he", item: "shells", one: "shell", verbAdd: "found", verbAddBase: "find", verbTake: "dropped", verbTakeBase: "drop" },
  { person: "Zoe", pr: "she", item: "stamps", one: "stamp", verbAdd: "got", verbAddBase: "get", verbTake: "gave away", verbTakeBase: "give away" },
];

const ROLE_NAMES = ["the start", "the change", "the end"];
const cap = (w: string) => w[0].toUpperCase() + w.slice(1);
/** "1 sticker" / "3 stickers". */
const count = (n: number, ctx: (typeof CONTEXTS)[number]) => `${n} ${n === 1 ? ctx.one : ctx.item}`;
/** "9, 10, 11" — the numbers you say counting from `from` to `to`. */
const countWords = (from: number, to: number) => {
  const dir = to > from ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) }, (_, k) => from + (k + 1) * dir).join(", ");
};
/** About 1 second per number said, after a short lead-in (Show me pacing), at most 7 seconds. */
const holdFor = (n: number) => Math.min(7000, 1000 + n * 1000);

function wordProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  const ctx = pick(CONTEXTS);
  const P = ctx.person;
  const he = ctx.pr;
  const He = cap(he);
  const roleChoice = (correctIdx: number) =>
    choice({ prompt: "What is missing?", hint: "The story tells two numbers. Which one is missing?", explain: `${cap(ROLE_NAMES[correctIdx])} is missing.` }, ROLE_NAMES[correctIdx], ROLE_NAMES.filter((_, i) => i !== correctIdx));
  // C1-07: the student chooses the number sentence (and so the operation) for this story.
  const matchChoice = (p: number, q: number, correct: string, answer: number) =>
    choice(
      { prompt: "Which one matches the story?", hint: "Picture the story. Did it go up or down?", explain: `${correct} matches the story.` },
      correct,
      storySentenceChoices(p, q, correct, answer) // misconceptions: the other sign (keyword), the two numbers added
    );

  if (bucket === "addToResult" || bucket === "addToChange" || bucket === "addToStart") {
    // Start at 1 or more: an Add To story starts with something.
    let start = 0;
    let change = 0;
    do {
      start = randInt(1, 15);
      change = randInt(1, 9);
    } while (start + change > 20);
    const result = start + change;

    if (bucket === "addToResult") {
      return {
        title: "Story problem",
        bucket,
        story: `${P} had ${count(start, ctx)}. Then ${he} ${ctx.verbAdd} ${change} more. How many ${ctx.item} does ${P} have now?`,
        // Help ladder (step 3): act the story out, with the change in a second color.
        visual: (_done: number, help?: VisualHelp) => (
          <div className="control-row" style={{ gap: 20 }} data-readaloud-part>
            {pointing(help, 2) ? <TenFrameGroup value={result} tone="a" splitAt={start} tone2="b" /> : <TenFrameGroup value={start} tone="a" />}
          </div>
        ),
        steps: [
          roleChoice(2),
          matchChoice(start, change, `${start} + ${change} = ☐`, result),
          {
            kind: "number",
            prompt: `How many ${ctx.item} does ${P} have now?`,
            hint: `Start with ${start}. Count on ${change}.`,
            showMe: `Start with ${start}. Count on ${change}: ${countWords(start, result)}.`,
            showMeHoldMs: holdFor(change),
            explain: `${start} + ${change} = ${result}.`,
            answer: result,
          },
        ],
        wrapUp: `${start} + ${change} = ${result}.`,
      };
    }
    if (bucket === "addToChange") {
      return {
        title: "Story problem",
        bucket,
        story: `${P} had ${count(start, ctx)}. ${He} ${ctx.verbAdd} some more. Now ${he} has ${count(result, ctx)}. How many did ${P} ${ctx.verbAddBase}?`,
        visual: (_done: number, help?: VisualHelp) => (
          <div className="control-row" style={{ gap: 20 }} data-readaloud-part>
            <TenFrameGroup value={start} tone="a" />
            {pointing(help, 2) ? <TenFrameGroup value={result} tone="a" splitAt={start} tone2="b" /> : <TenFrameGroup value={result} tone="c" />}
          </div>
        ),
        steps: [
          roleChoice(1),
          matchChoice(start, result, `${start} + ☐ = ${result}`, change),
          {
            kind: "number",
            prompt: `How many did ${P} ${ctx.verbAddBase}?`,
            hint: `Count on from ${start} to ${result}.`,
            showMe: `Count on from ${start} to ${result}: ${countWords(start, result)}. That is ${change}.`,
            showMeHoldMs: holdFor(change),
            explain: `${result} − ${start} = ${change}.`,
            answer: change,
          },
        ],
        wrapUp: `${start} + ${change} = ${result}.`,
      };
    }
    return {
      title: "Story problem",
      bucket,
      story: `${P} had some ${ctx.item}. Then ${he} ${ctx.verbAdd} ${change} more. Now ${he} has ${count(result, ctx)}. How many did ${P} have at the start?`,
      visual: (_done: number, help?: VisualHelp) => (
        <div className="control-row" style={{ gap: 20 }} data-readaloud-part>
          {pointing(help, 2) ? <TenFrameGroup value={result} tone="a" splitAt={start} tone2="b" /> : <TenFrameGroup value={result} tone="c" />}
        </div>
      ),
      steps: [
        roleChoice(0),
        matchChoice(change, result, `☐ + ${change} = ${result}`, start),
        {
          kind: "number",
          prompt: `How many did ${P} have at the start?`,
          hint: `${He} ${ctx.verbAdd} more. To find the start, take those away.`,
          showMe: `${He} ${ctx.verbAdd} ${change} more. Take ${change === 1 ? "it" : "them"} away: ${result} − ${change} = ${start}.`,
          showMeHoldMs: 3000,
          explain: `${result} − ${change} = ${start}.`,
          answer: start,
        },
      ],
      wrapUp: `${start} + ${change} = ${result}.`,
    };
  }

  // take-from buckets. The end can be 0 only when the end is what's asked.
  let start = 0;
  let change = 0;
  do {
    start = randInt(1, 20);
    change = randInt(1, 9);
  } while (start - change < (bucket === "takeFromResult" ? 0 : 1));
  const result = start - change;

  if (bucket === "takeFromResult") {
    return {
      title: "Story problem",
      bucket,
      story: `${P} had ${count(start, ctx)}. Then ${he} ${ctx.verbTake} ${change}. How many ${ctx.item} does ${P} have left?`,
      visual: (_done: number, help?: VisualHelp) => (
        <div className="control-row" style={{ gap: 20 }} data-readaloud-part>
          {/* Help ladder / Show me: the ones taken away are crossed out. */}
          <TenFrameGroup value={start} tone="a" splitAt={pointing(help, 2) ? result : undefined} tone2="b" crossFrom={pointing(help, 2) ? result : undefined} />
        </div>
      ),
      steps: [
        roleChoice(2),
        matchChoice(start, change, `${start} − ${change} = ☐`, result),
        {
          kind: "number",
          prompt: `How many ${ctx.item} does ${P} have left?`,
          hint: `Start with ${start}. Count back ${change}.`,
          showMe: `Start with ${start}. Take away ${change}. Count back: ${countWords(start, result)}.`,
          showMeHoldMs: holdFor(change),
          explain: `${start} − ${change} = ${result}.`,
          answer: result,
        },
      ],
      wrapUp: `${start} − ${change} = ${result}.`,
    };
  }
  if (bucket === "takeFromChange") {
    return {
      title: "Story problem",
      bucket,
      story: `${P} had ${count(start, ctx)}. ${He} ${ctx.verbTake} some. Now ${he} has ${count(result, ctx)}. How many did ${P} ${ctx.verbTakeBase}?`,
      visual: (_done: number, help?: VisualHelp) => (
        <div className="control-row" style={{ gap: 20 }} data-readaloud-part>
          <TenFrameGroup value={start} tone="a" splitAt={pointing(help, 2) ? result : undefined} tone2="b" crossFrom={pointing(help, 2) ? result : undefined} />
          <TenFrameGroup value={result} tone="c" />
        </div>
      ),
      steps: [
        roleChoice(1),
        matchChoice(start, result, `${start} − ☐ = ${result}`, change),
        {
          kind: "number",
          prompt: `How many did ${P} ${ctx.verbTakeBase}?`,
          hint: `Count back from ${start} to ${result}.`,
          showMe: `Count back from ${start} to ${result}: ${countWords(start, result)}. That is ${change}.`,
          showMeHoldMs: holdFor(change),
          explain: `${start} − ${result} = ${change}.`,
          answer: change,
        },
      ],
      wrapUp: `${start} − ${change} = ${result}.`,
    };
  }
  return {
    title: "Story problem",
    bucket,
    story: `${P} had some ${ctx.item}. Then ${he} ${ctx.verbTake} ${change}. Now ${he} has ${count(result, ctx)}. How many did ${P} have at the start?`,
    visual: (_done: number, help?: VisualHelp) => (
      <div className="control-row" style={{ gap: 20 }} data-readaloud-part>
        {pointing(help, 2) ? <TenFrameGroup value={start} tone="a" splitAt={result} tone2="b" crossFrom={result} /> : <TenFrameGroup value={result} tone="c" />}
      </div>
    ),
    steps: [
      roleChoice(0),
      matchChoice(change, result, `☐ − ${change} = ${result}`, start),
      {
        kind: "number",
        prompt: `How many did ${P} have at the start?`,
        hint: `${He} ${ctx.verbTake} some. To find the start, add them back.`,
        showMe: `${He} ${ctx.verbTake} ${change}. Add ${change === 1 ? "it" : "them"} back: ${result} + ${change} = ${start}.`,
        showMeHoldMs: 3000,
        explain: `${result} + ${change} = ${start}.`,
        answer: start,
      },
    ],
    wrapUp: `${start} − ${change} = ${result}.`,
  };
}

export const addToTakeFromWordProblems: Unit = {
  id: "addToTakeFromWordProblems",
  title: "Add To and Take From Stories",
  goal: "Solve stories. Add more or take some away.",
  standard: "1.OA.1",
  keyIdea: (
    <>
      <p>A story has a start, a change, and an end. Find the one that is missing.</p>
      <p>Picture the story. Don't just look for one word.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Add To and Take From", make: wordProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: addToTakeFromWordProblemsTest,
};
