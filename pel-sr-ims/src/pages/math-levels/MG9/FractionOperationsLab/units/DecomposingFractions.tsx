import { useState } from "react";
import { PieceBars, type PieceSegment, type PieceTone } from "../diagrams";
import { choice, numberBlank, sentence, type Problem } from "../../../shared/engine/types";
import { Frac, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { pastOneParams, pieceWord, twoPartSplitCount, twoWaysParams, unitDecompParams } from "../lib/fractions";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "./cfu";
import { decomposingFractionsTest } from "./DecomposingFractionsTest";
import { MathText } from "../../../shared/components/MathText";

const TONES: PieceTone[] = ["a", "b", "c"];
const repeatSum = (term: string, times: number) => Array.from({ length: times }, () => term).join(" + ");

/** Group sizes from a set of split points (piece indices a new group starts at). */
function groupsFromCuts(num: number, cuts: number[]): number[] {
  const sorted = [...cuts].filter((c) => c > 0 && c < num).sort((x, y) => x - y);
  const out: number[] = [];
  let start = 0;
  for (const c of sorted) {
    out.push(c - start);
    start = c;
  }
  out.push(num - start);
  return out;
}
const segmentsFor = (groups: number[]): PieceSegment[] => groups.map((count, i) => ({ count, tone: TONES[i % TONES.length] }));
const cutsFor = (groups: number[]): number[] => groups.slice(0, -1).map((_, i) => groups.slice(0, i + 1).reduce((s, g) => s + g, 0));

// ============================================================================
// CHECK FOR UNDERSTANDING — fixed questions, gate before Practice unlocks
// ============================================================================

/**
 * Q1 vocabulary (unit fraction; a/b is a copies of 1/b). Q2 the commonly
 * conflated pair — the numerator COUNTS pieces, the denominator NAMES their
 * size — with both ideas in one question, and "1/16" baiting the add-the-
 * denominators habit. Q3 is the plan's own generalization check (one way
 * into unit fractions, many ways into two parts — show a second one).
 * Q4 pushes decomposing past one whole (7/6 = 6/6 + 1/6 = 1 + 1/6).
 */
function DecomposingCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>

        <div className="align-stack-wrap">
          <p>
            <b>1.</b> <Frac n={5} d={6} /> = <Frac n={1} d={6} /> + <Frac n={1} d={6} /> + <Frac n={1} d={6} /> + <Frac n={1} d={6} /> + <Frac n={1} d={6} />
          </p>
          <PieceBars den={6} segments={[{ count: 5, tone: "a" }]} cuts={[1, 2, 3, 4]} unitLabels barWidth={240} />
          <DropdownQuestion
            blanks={[
              { options: ["a mixed number", "a unit fraction", "a denominator"], correct: "a unit fraction", label: "What each 1/6 is called" },
              { options: ["1", "5", "6"], correct: "5", label: "How many of them make 5/6" },
            ]}
            render={([a, b]) => (
              <>
                Each <Frac n={1} d={6} /> is called {a}, and <Frac n={5} d={6} /> is made of {b} of them.
              </>
            )}
            good="Correct — a fraction with 1 on top is a unit fraction, one single piece. 5/6 is just 5 of those 1/6 pieces put together."
            bad="Not quite. A fraction with a 1 on top is one single piece — count how many of those pieces make 5/6."
            onDone={mark(0)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Put <Frac n={2} d={8} /> and <Frac n={3} d={8} /> together:
          </p>
          <PieceBars den={8} segments={[{ count: 2, tone: "a" }, { count: 3, tone: "b" }]} barWidth={240} />
          <DropdownQuestion
            blanks={[
              { options: ["1", "5", "6"], correct: "5", label: "How many pieces in all" },
              { options: ["an eighth (1/8)", "a sixteenth (1/16)", "a fifth (1/5)"], correct: "an eighth (1/8)", label: "Size of each piece" },
            ]}
            render={([a, b]) => (
              <>
                Now there are {a} pieces, and each piece is still {b}. So <Frac n={2} d={8} /> + <Frac n={3} d={8} /> = <Frac n={5} d={8} />.
              </>
            )}
            good="Correct — the numerator COUNTS the pieces (2 + 3 = 5), and the denominator NAMES their size. Putting pieces together doesn't make them smaller, so they're still eighths."
            bad="Not quite. Count the colored pieces for the first box. For the second: did putting the pieces side by side change how big each one is?"
            onDone={mark(1)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>3.</b> True or false: <Frac n={5} d={6} /> can be split into unit fractions in only ONE way, but it can be split into two parts in MORE than one way.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "True", label: "True or false" },
              { options: ["3", "4", "5", "6"], correct: "4", label: "Missing numerator" },
            ]}
            render={([a, b]) => (
              <>
                That statement is {a}. One way is <Frac n={5} d={6} /> = <Frac n={2} d={6} /> + <Frac n={3} d={6} />. A different way: <Frac n={5} d={6} /> ={" "}
                <Frac n={1} d={6} /> + <Frac n={b} d={6} />
              </>
            )}
            good="Correct — 1/6 + 1/6 + 1/6 + 1/6 + 1/6 is the only unit-fraction way, but two parts can be 1 + 4 or 2 + 3 (two different ways). 1/6 + 4/6 = 5/6."
            bad="Not quite. Unit fractions are all the same size, so there's only one way to write 5/6 with them. For two parts, which numerator goes with 1 to make 5?"
            onDone={mark(2)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Decomposing works past one whole, too. Here is <Frac n={7} d={6} />:
          </p>
          <PieceBars den={6} segments={[{ count: 6, tone: "a" }, { count: 1, tone: "b" }]} barWidth={200} />
          <DropdownQuestion
            blanks={[
              { options: ["1", "6", "7"], correct: "6", label: "Missing numerator" },
              { options: ["1/6", "1 whole", "6 wholes"], correct: "1 whole", label: "What 6/6 equals" },
            ]}
            render={([a, b]) => (
              <>
                <Frac n={7} d={6} /> = <Frac n={a} d={6} /> + <Frac n={1} d={6} />, and <Frac n={6} d={6} /> is the same as {b}.
              </>
            )}
            good="Correct — 7/6 = 6/6 + 1/6, and 6/6 fills one whole bar. So 7/6 = 1 + 1/6."
            bad="Not quite. The first bar is full — how many sixths fill one whole bar, and what is a full bar worth?"
            onDone={mark(3)}
          />
        </div>
      </div>
    </MathText>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

/**
 * Click any colored piece to put a split just before it (click again to
 * remove the split) — the equation underneath always reads the current
 * groups. "Save this way" collects every DIFFERENT split found (order
 * ignored), so "more than one way" is something the student builds, not
 * just reads about.
 */
function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [den, setDen] = useState(6);
  const [num, setNum] = useState(5);
  const [cuts, setCuts] = useState<number[]>([2]);
  const [saved, setSaved] = useState<string[]>([]);

  const groups = groupsFromCuts(num, cuts);
  const key = [...groups].sort((x, y) => x - y).join("+");
  const changeFraction = (n: number, d: number) => {
    setNum(n);
    setDen(d);
    setCuts([]);
    setSaved([]);
  };
  const toggleCut = (i: number) => setCuts((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}

        <p>
          A fraction is a bunch of same-size pieces. <b>Decomposing</b> means splitting those pieces into groups — and writing the fraction as a sum. Click a
          colored piece to split just before it.
        </p>
        <div className="control-row">
          <Stepper label="Pieces in one whole (denominator)" value={den} min={2} max={10} onChange={(d) => changeFraction(Math.min(num, 2 * d), d)} tone="b" />
          <Stepper label="Pieces you have (numerator)" value={num} min={1} max={2 * den} onChange={(n) => changeFraction(n, den)} tone="a" />
        </div>
        <PieceBars den={den} segments={segmentsFor(groups)} cuts={cutsFor(groups)} unitLabels={groups.every((g) => g === 1)} onPieceClick={toggleCut} barWidth={260} />
        <p className="says" style={{ fontSize: 18 }}>
          <Frac n={num} d={den} /> ={" "}
          {groups.map((g, i) => (
            <span key={i}>
              {i > 0 && " + "}
              <span className={`q${TONES[i % 3]}-text`}>
                <Frac n={g} d={den} />
              </span>
            </span>
          ))}
          {num > den && (
            <span className="muted small" style={{ marginLeft: 10 }}>
              ({num} {pieceWord(den)} is more than one whole: {den}/{den} = 1)
            </span>
          )}
        </p>
        <div className="control-row">
          <button className="btn ghost" type="button" onClick={() => setCuts(Array.from({ length: num - 1 }, (_, i) => i + 1))}>
            Split into unit fractions
          </button>
          <button className="btn ghost" type="button" onClick={() => setCuts([])}>
            Remove all splits
          </button>
          <button className="btn primary" type="button" disabled={groups.length < 2 || saved.includes(key)} onClick={() => setSaved((s) => [...s, key])}>
            {saved.includes(key) ? "Already saved" : "Save this way"}
          </button>
        </div>
        {saved.length > 0 && (
          <div>
            <p className="muted small" style={{ marginBottom: 4 }}>
              Different ways you've found to decompose {num}/{den} ({saved.length}):
            </p>
            <ul style={{ margin: 0 }}>
              {saved.map((s) => (
                <li key={s}>
                  {num}/{den} = {s
                    .split("+")
                    .map((g) => `${g}/${den}`)
                    .join(" + ")}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <DecomposingCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

/** Bucket "unit" — a/d as a sum of unit fractions. */
function unitProblem(): Problem {
  const { num, den } = unitDecompParams();
  return {
    title: "Decompose into unit fractions",
    bucket: "unit",
    story: (
      <>
        Write <Frac n={num} d={den} /> as a sum of unit fractions.
      </>
    ),
    visual: (done) => (
      <PieceBars den={den} segments={[{ count: num, tone: "a" }]} cuts={done >= 1 ? Array.from({ length: num - 1 }, (_, i) => i + 1) : []} unitLabels={done >= 1} barWidth={260} />
    ),
    steps: [
      {
        kind: "number",
        prompt: (
          <>
            How many <Frac n={1} d={den} /> pieces make <Frac n={num} d={den} />?
          </>
        ),
        hint: `The numerator counts pieces. Count the shaded pieces in the bar.`,
        explain: `${num} pieces of 1/${den}.`,
        answer: num,
      },
      choice(
        {
          prompt: (
            <>
              Which sum equals <Frac n={num} d={den} />?
            </>
          ),
          hint: `It needs exactly ${num} copies of 1/${den}.`,
          explain: `${num}/${den} = ${repeatSum(`1/${den}`, num)}.`,
        },
        repeatSum(`1/${den}`, num),
        [
          repeatSum(`1/${den}`, num - 1), // one piece short
          repeatSum(`1/${num}`, den), // numerator and denominator swapped
        ]
      ),
      {
        kind: "number",
        prompt: (
          <>
            How many MORE <Frac n={1} d={den} /> pieces would it take to make one whole?
          </>
        ),
        hint: `One whole is ${den}/${den}. You have ${num} pieces.`,
        explain: `${den} − ${num} = ${den - num} more pieces: ${num}/${den} + ${den - num}/${den} = ${den}/${den} = 1.`,
        answer: den - num,
      },
    ],
    wrapUp: (
      <>
        <Frac n={num} d={den} /> is {num} unit fractions <Frac n={1} d={den} /> — and {den - num} more would make 1 whole.
      </>
    ),
  };
}

/** Bucket "twoWays" — two different two-part splits of the same fraction. */
function twoWaysProblem(): Problem {
  const { num, den, first, second } = twoWaysParams();
  const ways = twoPartSplitCount(num);
  return {
    title: "Split it two different ways",
    bucket: "twoWays",
    story: (
      <>
        Split <Frac n={num} d={den} /> into two parts — and then find another way.
      </>
    ),
    visual: (done) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <PieceBars den={den} segments={[{ count: first, tone: "a" }, { count: num - first, tone: "b" }]} barWidth={260} />
        {done >= 2 && <PieceBars den={den} segments={[{ count: second, tone: "a" }, { count: num - second, tone: "c" }]} barWidth={260} />}
      </div>
    ),
    steps: [
      {
        kind: "number",
        overDen: den,
        prompt: (
          <>
            <Frac n={num} d={den} /> = <Frac n={first} d={den} /> + ? (The denominator stays {den}.)
          </>
        ),
        hint: `${first} pieces plus how many more make ${num}?`,
        explain: `${first} + ${num - first} = ${num}.`,
        answer: num - first,
      },
      {
        kind: "number",
        overDen: den,
        prompt: (
          <>
            Now a different way: <Frac n={num} d={den} /> = <Frac n={second} d={den} /> + ?
          </>
        ),
        hint: `${second} pieces plus how many more make ${num}?`,
        explain: `${second} + ${num - second} = ${num} — a second correct split of the same ${num}/${den}.`,
        answer: num - second,
      },
      choice(
        {
          prompt: (
            <>
              How many different ways can <Frac n={num} d={den} /> be split into two parts? (Swapping the order doesn't count as new.)
            </>
          ),
          hint: `List them: 1 + ${num - 1}, 2 + ${num - 2}, … stop when the numbers just swap places.`,
          explain: `${Array.from({ length: ways }, (_, i) => `${i + 1} + ${num - i - 1}`).join(", ")} — ${ways} different ways.`,
        },
        String(ways),
        [
          "1", // "there's only one right answer"
          String(num - 1), // counted swapped orders as new ways
        ]
      ),
    ],
    wrapUp: (
      <>
        <Frac n={num} d={den} /> splits into two parts in {ways} different ways — there's more than one right answer.
      </>
    ),
  };
}

/** Bucket "pastOne" — decomposing an improper fraction into wholes + leftover. */
function pastOneProblem(): Problem {
  const { num, den, wholes, rem } = pastOneParams();
  const wholeTerms = Array.from({ length: wholes }, () => `${den}/${den}`).join(" + ");
  const segs: PieceSegment[] = [...Array.from({ length: wholes }, (_, i) => ({ count: den, tone: TONES[i % 2] })), { count: rem, tone: "c" }];
  return {
    title: "Decompose past one whole",
    bucket: "pastOne",
    story: (
      <>
        <Frac n={num} d={den} /> is more than one whole. Decompose it.
      </>
    ),
    visual: (done) => <PieceBars den={den} segments={done >= 1 ? segs : [{ count: num, tone: "a" }]} barWidth={200} />,
    steps: [
      {
        kind: "number",
        overDen: den,
        prompt: (
          <>
            <Frac n={num} d={den} /> = {wholeTerms} + ?
          </>
        ),
        hint: `Each ${den}/${den} fills one bar (${den} pieces). How many of the ${num} pieces are left over?`,
        explain: `${num} − ${wholes * den} = ${rem}.`,
        answer: rem,
      },
      sentence(
        {
          prompt: `Each ${den}/${den} is one whole. So how many wholes, plus what leftover fraction?`,
          hint: `Count the full bars, then the leftover pieces.`,
          explain: `${wholeTerms} = ${wholes}, so ${num}/${den} = ${wholes} + ${rem}/${den}.`,
        },
        `${num}/${den} = `,
        numberBlank(wholes),
        " + ",
        numberBlank(rem),
        "",
        [undefined, den]
      ),
      {
        kind: "number",
        prompt: (
          <>
            If you split <Frac n={num} d={den} /> all the way into unit fractions <Frac n={1} d={den} />, how many would you add up?
          </>
        ),
        hint: "The numerator counts every piece — wholes included.",
        explain: `${num} pieces of 1/${den}, the same as ${wholes} whole${wholes === 1 ? "" : "s"} (${wholes * den} pieces) + ${rem} more.`,
        answer: num,
      },
    ],
    wrapUp: (
      <>
        <Frac n={num} d={den} /> = {wholeTerms} + <Frac n={rem} d={den} /> = {wholes} + <Frac n={rem} d={den} />.
      </>
    ),
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <PieceBars den={6} segments={[{ count: 2, tone: "a" }, { count: 3, tone: "b" }]} barWidth={200} height={44} />;
}

export const decomposingFractions: Unit = {
  id: "decomposingFractions",
  title: "Decomposing Fractions",
  goal: "See a fraction as a bunch of same-size pieces, and split it into a sum of smaller fractions in more than one way.",
  standard: "4.NF.3a-b",
  keyIdea: (
    <>
      <p>
        <Frac n={5} d={6} /> is 5 pieces of size <Frac n={1} d={6} />. You can group those pieces any way you like:{" "}
        <Frac n={5} d={6} /> = <Frac n={2} d={6} /> + <Frac n={3} d={6} /> = <Frac n={1} d={6} /> + <Frac n={4} d={6} />.
      </p>
      <p>The pieces never change size, so the denominator stays the same — only the numerators get split up.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["unit", "twoWays", "pastOne"],
  problems: [
    { label: "Unit fractions", make: unitProblem, buckets: ["unit"] },
    { label: "Two different ways", make: twoWaysProblem, buckets: ["twoWays"] },
    { label: "Past one whole", make: pastOneProblem, buckets: ["pastOne"] },
  ],
  test: decomposingFractionsTest,
};
