import { useState, type ReactNode } from "react";
import { EquationStrip, TenFrameGroup, ThreeGroups } from "../diagrams";
import { makeTenBreakdown } from "../logic";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { fluencyFactsWithin20Test } from "./FluencyFactsWithin20Test";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";

// ============================================================================
// SHARED LOGIC — the same function backs the Explore "add these first"
// picture and the Practice three-number problems, so they can't drift.
// ============================================================================

/** The two of three numbers that make 10 (0-based positions), or null. */
export function makeTenPair(nums: [number, number, number]): [number, number] | null {
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      if (nums[i] + nums[j] === 10) return [i, j];
    }
  }
  return null;
}

/** "9, 10, 11" — the numbers you say counting from `from` to `to`. */
const countWords = (from: number, to: number) => {
  const dir = to > from ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) }, (_, k) => from + (k + 1) * dir).join(", ");
};
/** About 1 second per number said, after a short lead-in (Show me pacing), at most 7 seconds. */
const holdFor = (n: number) => Math.min(7000, 1000 + n * 1000);

/** A fact written big, with no dots: the picture before any help, so the fact is recalled, not counted. */
const Fact = ({ text }: { text: string }) => <div style={{ fontSize: "2.6rem", fontWeight: 800, letterSpacing: 1 }}>{text}</div>;

/** a and b on their own ten-frames, in the order written: the bigger in tone a, the smaller in tone b. */
function TwoFrames({ a, b, lightBig }: { a: number; b: number; lightBig?: boolean }) {
  const big = Math.max(a, b);
  const frame = (n: number, isBig: boolean) => (
    <div style={{ width: 168 }}>
      <TenFrameGroup value={n} tone={isBig ? "a" : "b"} highlightEmpty={isBig && lightBig} />
      <p style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 800, margin: "4px 0 0" }}>{n}</p>
    </div>
  );
  // Equal numbers: the first one plays "the bigger".
  return (
    <div className="control-row" style={{ gap: 20, alignItems: "flex-start" }}>
      {frame(a, a === big)}
      {frame(b, b === big && a !== big)}
    </div>
  );
}

/** a + b past 10 with the ten made by the BIGGER number: it fills the frame (tone a), the smaller tops it up (tone b). */
const MadeTen = ({ a, b }: { a: number; b: number }) => <TenFrameGroup value={a + b} tone="a" splitAt={Math.max(a, b)} tone2="b" />;

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx): one short question at a time,
// typed answers. Targets: adding three numbers (find two that make 10 first;
// any order gives the same total — 1.OA.2/1.OA.3), a within-10 fact typed
// (the fact shown big, dots only after a wrong try), and making ten on a new
// fact. Each question gets a "Look here" pointer after its 2nd wrong try;
// "show it" comes on the 3rd.

/** CFU "Look here" pointers: the Explore spot that teaches each question (shown after its 2nd miss). */
const LOOK = {
  pair: { target: "flu-pair", label: "Explore: three numbers, add two that make 10", say: "Look here. Find two numbers that make 10." },
  order: { target: "flu-order", label: "Explore: three numbers, any order", say: "Look here. Try a different order." },
  within: { target: "flu-within", label: "Explore: count on from the bigger number", say: "Look here. Count on from the bigger number." },
  makeTen: { target: "flu-make-ten", label: "Explore: make a ten first", say: "Look here. Make a ten first." },
};

function FluencyCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="4 + 8 + 2. Which two do you add first?"
            picture={<ThreeGroups nums={[4, 8, 2]} />}
            showPicture={<ThreeGroups nums={[4, 8, 2]} pair={[1, 2]} />}
            options={[
              { id: "4+8", label: "4 + 8" },
              { id: "8+2", label: "8 + 2" },
              { id: "4+2", label: "4 + 2" },
            ]}
            answer="8+2"
            why={{ "4+8": "Find two numbers that make 10.", "4+2": "Find two numbers that make 10." }}
            showText="Watch: 8 and 2 make 10."
            praise="Yes! 8 + 2 = 10."
            look={LOOK.pair}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="Now add 4 + 8 first. Then add the 2. What is the total?"
            answer={14}
            tone="c"
            picture={(m) => (m === "show" || m === "done" ? <TenFrameGroup value={14} tone="a" splitAt={12} tone2="c" /> : <ThreeGroups nums={[4, 8, 2]} pair={[0, 1]} />)}
            nudge="Add 4 + 8. Then add the 2."
            why={{ 12: "That is 4 + 8. Now add the 2.", 10: "Add 4 + 8 first this time." }}
            showText="Watch: 4 + 8 = 12. 12 + 2 = 14."
            praise="Yes! 14. Any order gives 14."
            look={LOOK.order}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="6 + 3 = ?"
            answer={9}
            tone="c"
            picture={(m) => (m === "ask" ? <Fact text="6 + 3" /> : m === "wrong" ? <TwoFrames a={6} b={3} /> : <TenFrameGroup value={9} tone="a" splitAt={6} tone2="b" />)}
            nudge="Count on from the bigger number."
            why={{ 3: "Put them together. Don't take away." }}
            showText="Watch and listen: start at 6. 7, 8, 9."
            praise="Yes! 6 + 3 = 9."
            look={LOOK.within}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="9 + 7. Make a ten first. What is the total?"
            answer={16}
            tone="c"
            picture={(m) => (m === "show" || m === "done" ? <MadeTen a={9} b={7} /> : <TwoFrames a={9} b={7} lightBig={m === "wrong"} />)}
            nudge="9 needs 1 more to make 10."
            why={{ 6: "That is the rest. Add it to 10.", 10: "That is the ten. Add the rest too." }}
            showText="Watch: 1 from the 7 fills the ten. 6 more is 16."
            praise="Yes! 9 + 1 = 10. 10 + 6 = 16."
            look={LOOK.makeTen}
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

type Mode = "within10" | "within20" | "three";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<Mode>("within10");
  // Not the CFU's numbers (6 + 3, 9 + 7, 4 + 8 + 2), so a "Look here" never shows a CFU answer.
  const [p, setP] = useState(3);
  const [q, setQ] = useState(5);
  const [big, setBig] = useState(8);
  const [small, setSmall] = useState(5);
  const [nums, setNums] = useState<[number, number, number]>([3, 5, 7]);

  // A CFU "Look here" for a spot shown only in another mode switches to that mode first.
  useLookHereRequest((id) => {
    if (id === "flu-pair" || id === "flu-order") setMode("three");
    else if (id === "flu-within") setMode("within10");
    else if (id === "flu-make-ten") setMode("within20");
  });

  const pqBig = Math.max(p, q);
  const pqSmall = Math.min(p, q);
  const tenBreak = makeTenBreakdown(big, small);
  const pair = makeTenPair(nums);
  const total = nums[0] + nums[1] + nums[2];
  const setNum = (i: number) => (v: number) => setNums((n) => n.map((x, k) => (k === i ? v : x)) as [number, number, number]);
  const others = (i: number) => total - nums[i];

  let body: ReactNode;
  if (mode === "within10") {
    body = (
      <>
        {/* Within 10: each number's range comes from the other, so the total is at most 10. */}
        <div className="control-row" data-readaloud-part>
          <Stepper label="First number" value={p} min={0} max={10 - q} step={1} onChange={setP} tone="a" />
          <Stepper label="Second number" value={q} min={0} max={10 - p} step={1} onChange={setQ} tone="b" />
        </div>
        <TenFrameGroup value={p + q} tone="a" splitAt={p} tone2="b" />
        <ReadAloud as="p" className="muted small" {...lookHereSpot("flu-within")}>
          <span data-look-here-key>
            {p} + {q} = {p + q}.{" "}
            {pqSmall > 0 ? `Start at ${pqBig}, the bigger number. Count on ${pqSmall}: ${countWords(pqBig, p + q)}.` : `Adding 0 keeps ${pqBig}.`}
          </span>
        </ReadAloud>
      </>
    );
  } else if (mode === "within20") {
    body = (
      <>
        {/* Past 10: the bigger number fills the ten. Ranges come from each other: total 11 to 18. */}
        <div className="control-row" data-readaloud-part>
          <Stepper label="Bigger number" value={big} min={Math.max(6, small + 1, 11 - small)} max={9} step={1} onChange={setBig} tone="a" />
          <Stepper label="Smaller number" value={small} min={11 - big} max={big - 1} step={1} onChange={setSmall} tone="b" />
        </div>
        <div {...lookHereSpot("flu-make-ten")}>
          <MadeTen a={big} b={small} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }} data-readaloud-part>
            <EquationStrip tokens={[{ value: big, tone: "a" }, "+", { value: tenBreak.addToA, tone: "b" }, "=", 10]} />
            <EquationStrip tokens={[10, "+", { value: tenBreak.remainder, tone: "b" }, "=", tenBreak.total]} />
          </div>
          <ReadAloud as="p" className="muted small" data-look-here-key>
            Past 10? Make a ten first, then add what is left.
          </ReadAloud>
        </div>
        <ReadAloud as="p" className="muted small">
          To take away, you can add. 12 − 8. Start at 8. How many more make 12?
        </ReadAloud>
      </>
    );
  } else {
    body = (
      <>
        {/* Each number's range comes from the other two, so the total is at most 20. */}
        <div className="control-row" data-readaloud-part>
          <Stepper label="First" value={nums[0]} min={1} max={Math.min(9, 20 - others(0))} step={1} onChange={setNum(0)} tone="a" />
          <Stepper label="Second" value={nums[1]} min={1} max={Math.min(9, 20 - others(1))} step={1} onChange={setNum(1)} tone="b" />
          <Stepper label="Third" value={nums[2]} min={1} max={Math.min(9, 20 - others(2))} step={1} onChange={setNum(2)} tone="c" />
        </div>
        <div {...lookHereSpot("flu-pair")}>
          <ThreeGroups nums={nums} pair={pair} />
          <ReadAloud as="p" className="muted small" data-look-here-key>
            Look for two numbers that make 10. Add them first.
          </ReadAloud>
          <ReadAloud as="p" className="muted small">
            {pair
              ? `${nums[pair[0]]} + ${nums[pair[1]]} = 10. Then 10 + ${total - 10} = ${total}.`
              : `No two make 10 here. Add any two first. The total is ${total}.`}
          </ReadAloud>
        </div>
        <div {...lookHereSpot("flu-order")}>
          <div className="control-row" data-readaloud-part>
            <button type="button" className="btn ghost" onClick={() => setNums(([x, y, z]) => [z, x, y])}>
              Move the numbers around
            </button>
          </div>
          <ReadAloud as="p" className="muted small" data-look-here-key>
            Move the numbers around. The total stays {total}.
          </ReadAloud>
        </div>
      </>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="Fact type"
          value={mode}
          onChange={setMode}
          options={[
            { id: "within10", label: "Within 10" },
            { id: "within20", label: "Past 10" },
            { id: "three", label: "Three numbers" },
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
      {body}
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <FluencyCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================
// Before any help the picture is the fact itself (no dots), so a fact is
// recalled, not counted. After a wrong try the given numbers appear on
// ten-frames (the bigger number's empty boxes lit past 10); "Show me" draws
// the count-on or the made ten.

type Bucket = "factsWithin10" | "factsWithin20" | "threeAddendSum";
const BUCKETS: Bucket[] = ["factsWithin10", "factsWithin20", "threeAddendSum"];

/** Step 2 of an addition fact: a related fact from the same three numbers (sum − b, or ☐ + a = sum). */
function relatedAddStep(a: number, b: number) {
  const sum = a + b;
  return Math.random() < 0.5
    ? { kind: "number" as const, prompt: `${sum} − ${b} = ?`, hint: `${a} + ${b} = ${sum}. Use the same numbers.`, showMe: `${a} + ${b} = ${sum}, so ${sum} − ${b} = ${a}.`, showMeHoldMs: 2500, explain: `${sum} − ${b} = ${a}.`, answer: a }
    : { kind: "number" as const, prompt: `☐ + ${a} = ${sum}. What number goes in the box?`, hint: `${a} + ${b} = ${sum}. Use the same numbers.`, showMe: `${a} + ${b} = ${sum}. Turn it around: ${b} + ${a} = ${sum}.`, showMeHoldMs: 2500, explain: `${b} + ${a} = ${sum}.`, answer: b };
}

function factsWithin10Problem(): Problem {
  if (Math.random() < 0.6) {
    let a = 0;
    let b = 0;
    do {
      a = randInt(1, 9);
      b = randInt(1, 9);
    } while (a + b > 10);
    const sum = a + b;
    const big = Math.max(a, b);
    return {
      title: "Fast facts",
      bucket: "factsWithin10",
      story: `What is ${a} + ${b}?`,
      visual: (done: number, help?: VisualHelp) =>
        done >= 1 ? <TenFrameGroup value={sum} tone="a" splitAt={a} tone2="b" /> : pointing(help, 0) ? <TwoFrames a={a} b={b} /> : <Fact text={`${a} + ${b}`} />,
      steps: [
        {
          kind: "number",
          prompt: `${a} + ${b} = ?`,
          hint: "Count on from the bigger number.",
          showMe: `Start at ${big}. Count on ${sum - big}: ${countWords(big, sum)}.`,
          showMeHoldMs: holdFor(sum - big),
          explain: `${a} + ${b} = ${sum}.`,
          answer: sum,
        },
        relatedAddStep(a, b),
      ],
      wrapUp: `${a} + ${b} = ${sum}.`,
    };
  }
  const total = randInt(2, 10);
  const sub = randInt(0, total);
  const result = total - sub;
  return {
    title: "Fast facts",
    bucket: "factsWithin10",
    story: `What is ${total} − ${sub}?`,
    // After a wrong try: the start amount (given). Show me / done: the ones taken away crossed out.
    visual: (done: number, help?: VisualHelp) =>
      done >= 1 ? <TenFrameGroup value={total} tone="c" crossFrom={result} /> : pointing(help, 0) ? <TenFrameGroup value={total} tone="c" /> : <Fact text={`${total} − ${sub}`} />,
    steps: [
      {
        kind: "number",
        prompt: `${total} − ${sub} = ?`,
        hint: sub === 0 ? "Take away 0. What is left?" : "Count back.",
        showMe: sub === 0 ? `Take away 0. All ${total} are left.` : `Start at ${total}. Count back ${sub}: ${countWords(total, result)}.`,
        showMeHoldMs: holdFor(sub),
        explain: `${total} − ${sub} = ${result}.`,
        answer: result,
      },
      {
        kind: "number",
        prompt: `${result} + ☐ = ${total}. What number goes in the box?`,
        hint: `${total} − ${sub} = ${result}. Use the same numbers.`,
        showMe: `${total} − ${sub} = ${result}, so ${result} + ${sub} = ${total}.`,
        showMeHoldMs: 2500,
        explain: `${result} + ${sub} = ${total}.`,
        answer: sub,
      },
    ],
    wrapUp: `${total} − ${sub} = ${result}.`,
  };
}

function factsWithin20Problem(): Problem {
  if (Math.random() < 0.6) {
    let a = 0;
    let b = 0;
    do {
      a = randInt(2, 9);
      b = randInt(2, 9);
    } while (a + b <= 10 || a + b > 20);
    const sum = a + b;
    const big = Math.max(a, b);
    const { addToA: gap, remainder } = makeTenBreakdown(big, sum - big);
    return {
      title: "Fast facts",
      bucket: "factsWithin20",
      story: `What is ${a} + ${b}?`,
      // The bigger number always fills the ten, whichever is written first.
      visual: (done: number, help?: VisualHelp) =>
        done >= 1 ? <MadeTen a={a} b={b} /> : pointing(help, 0) ? <TwoFrames a={a} b={b} lightBig /> : <Fact text={`${a} + ${b}`} />,
      steps: [
        {
          kind: "number",
          prompt: `${a} + ${b} = ?`,
          hint: "Fill the ten first.",
          showMe: `${big} and ${gap} make 10. ${remainder} more is ${sum}.`,
          showMeHoldMs: 3000,
          explain: `${big} + ${gap} = 10. 10 + ${remainder} = ${sum}.`,
          answer: sum,
        },
        relatedAddStep(a, b),
      ],
      wrapUp: `${a} + ${b} = ${sum}.`,
    };
  }
  // Subtraction past 10 by adding (1.OA.4), only on facts that cross 10
  // (C2-06): the ones in the start are fewer than the number taken away
  // (12 − 8, 15 − 7), so the answer is 9 or less and Show me counts at most 9.
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 18);
    sub = randInt(2, 9);
  } while (sub <= start % 10);
  const result = start - sub;
  return {
    title: "Fast facts",
    bucket: "factsWithin20",
    story: `What is ${start} − ${sub}?`,
    // Stuck on the adding step: the number you take away with its empty boxes
    // lit, beside the ones past 10 (count both; no numeral is printed).
    // Show me / done: the start, with the part you found in its own color.
    visual: (done: number, help?: VisualHelp) =>
      done >= 1 || (help?.showMe && help.step === 0) ? (
        <TenFrameGroup value={start} tone="b" splitAt={sub} tone2="a" />
      ) : pointing(help, 0) ? (
        <div className="control-row" style={{ gap: 20, alignItems: "flex-start" }}>
          <TenFrameGroup value={sub} tone="b" highlightEmpty />
          <TenFrameGroup value={start - 10} tone="a" />
        </div>
      ) : (
        <Fact text={`${start} − ${sub}`} />
      ),
    steps: [
      {
        kind: "number",
        prompt: `Use adding. ${sub} + ☐ = ${start}. What number goes in the box?`,
        hint: `Start at ${sub}. Count on to ${start}.`,
        showMe: `Start at ${sub}. Count on to ${start}: ${countWords(sub, start)}. That is ${result}.`,
        showMeHoldMs: holdFor(result),
        explain: `${sub} + ${result} = ${start}.`,
        answer: result,
        tone: "a",
      },
      {
        kind: "number",
        prompt: `So ${start} − ${sub} = ?`,
        hint: "Use the number you just found.",
        showMe: `${sub} + ${result} = ${start}, so ${start} − ${sub} = ${result}.`,
        showMeHoldMs: 2500,
        explain: `${sub} + ${result} = ${start}, so ${start} − ${sub} = ${result}.`,
        answer: result,
      },
    ],
    wrapUp: `${start} − ${sub} = ${result}.`,
  };
}

const STORY_PEOPLE = ["Mia", "Leo", "Ana", "Sam", "Ivy", "Max"];
const STORY_ITEMS = [
  { verb: "picks", item: "apples", one: "apple" },
  { verb: "finds", item: "shells", one: "shell" },
  { verb: "has", item: "beads", one: "bead" },
];

/** Three numbers to add: as a bare sum, or (half the time) a short story (1.OA.2). */
function threeAddendProblem(): Problem {
  const hasTen = Math.random() < 0.6;
  let nums: [number, number, number];
  if (hasTen) {
    // One pair makes 10; all three numbers are different, so exactly one
    // pair makes 10 and no pair is listed twice (3 + 7 vs 7 + 3).
    let x = 0;
    let z = 0;
    do {
      x = randInt(1, 9);
      z = randInt(1, 9);
    } while (x === 5 || z === x || z === 10 - x);
    nums = shuffle([x, 10 - x, z]) as [number, number, number];
  } else {
    do {
      nums = [randInt(1, 9), randInt(1, 9), randInt(1, 9)];
    } while (nums[0] + nums[1] + nums[2] > 20 || makeTenPair(nums) !== null);
  }
  const [n0, n1, n2] = nums;
  const total = n0 + n1 + n2;
  const pair = makeTenPair(nums);
  const asStory = Math.random() < 0.5;
  const people = shuffle(STORY_PEOPLE).slice(0, 3);
  const thing = pick(STORY_ITEMS);
  const story = asStory
    ? `${people[0]} ${thing.verb} ${n0} ${n0 === 1 ? thing.one : thing.item}. ${people[1]} ${thing.verb} ${n1}. ${people[2]} ${thing.verb} ${n2}. How many ${thing.item} in all?`
    : `Find ${n0} + ${n1} + ${n2}.`;
  const totalStep = {
    kind: "number" as const,
    prompt: `${n0} + ${n1} + ${n2} = ?`,
    hint: pair ? "Add the two that make 10. Then add the last number." : "Add two numbers first. Then add the last one.",
    showMe: pair
      ? `${nums[pair[0]]} + ${nums[pair[1]]} = 10. 10 + ${total - 10} = ${total}.`
      : `${n0} + ${n1} = ${n0 + n1}. ${n0 + n1} + ${n2} = ${total}.`,
    showMeHoldMs: 3000,
    explain: `${n0} + ${n1} + ${n2} = ${total}.`,
    answer: total,
  };
  const labels = [
    [0, 1],
    [0, 2],
    [1, 2],
  ].map(([i, j]) => `${nums[i]} + ${nums[j]}`);
  return {
    title: "Three numbers",
    bucket: "threeAddendSum",
    story,
    // The three numbers as given; the pair to add first lights up once found (or when stuck).
    visual: (done: number, help?: VisualHelp) => <ThreeGroups nums={nums} pair={pair && (done >= 1 || pointing(help, 0)) ? pair : !pair && pointing(help, 0) ? [0, 1] : null} />,
    steps: pair
      ? [
          choice(
            { prompt: `${n0} + ${n1} + ${n2}. Which two do you add first?`, hint: "Find two numbers that make 10.", explain: `${nums[pair[0]]} + ${nums[pair[1]]} = 10.` },
            `${nums[pair[0]]} + ${nums[pair[1]]}`,
            labels.filter((l) => l !== `${nums[pair[0]]} + ${nums[pair[1]]}`)
          ),
          totalStep,
        ]
      : // No two make 10: no "which first" pick (any two is right), just the total.
        [totalStep],
    wrapUp: pair ? `${n0} + ${n1} + ${n2} = ${total}. ${nums[pair[0]]} + ${nums[pair[1]]} made 10 first.` : `${n0} + ${n1} + ${n2} = ${total}.`,
  };
}

function fluencyProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "factsWithin10") return factsWithin10Problem();
  if (bucket === "factsWithin20") return factsWithin20Problem();
  return threeAddendProblem();
}

export const fluencyFactsWithin20: Unit = {
  id: "fluencyFactsWithin20",
  title: "Fast Facts to 20",
  goal: "Know your facts to 20 fast.",
  standard: "1.OA.2, 1.OA.3, 1.OA.4, 1.OA.6",
  keyIdea: (
    <>
      <p>Try to know these facts fast.</p>
      <p>Adding three numbers? Add two that make 10 first.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // 1.OA.6 names fluency as a long-term target — periodically re-check it
  // instead of trusting one early pass forever (unlike Unit 6's reasoning-
  // based buckets, which stay one-time-only).
  reintroEverySolved: 20,
  problems: [{ label: "Fast Facts", make: fluencyProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: fluencyFactsWithin20Test,
};
