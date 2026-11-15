import { useState } from "react";
import { coordinateStep, numberBlank, pointing, sentence, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { MathText } from "../../../shared/components/MathText";
import { checkPlot } from "../../../shared/lib/factors";
import { palette } from "../../../shared/lib/palette";
import { pick, randInt } from "../../../shared/lib/math";
import { FirstQuadrantPlane } from "../../../shared/diagrams/FirstQuadrantPlane";
import { PatternTable } from "../diagrams";
import { gridFor, ordinal, pairsOf, patternPair, relationOf, relationWords, termAt, terms, type PatternPair, type Rule } from "../lib/patterns";
import { plotPairsStep, predictStep, relationStep, whyTimesStep } from "../lib/patternSteps";
import { patternsTest } from "./PatternsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const rowA = (r: Rule, shown: (number | null)[]) => ({ label: "Pattern A", rule: `start ${r.start}, add ${r.add}`, terms: shown, tone: "a" as const });
const rowB = (r: Rule, shown: (number | null)[]) => ({ label: "Pattern B", rule: `start ${r.start}, add ${r.add}`, terms: shown, tone: "b" as const });

/**
 * A guided walk through 5.OA.3, one idea per question:
 * Q1 typed: generate one pattern from its rule.
 * Q2 typed: generate a second pattern and relate the two (B is 2 times A), typed number + pick.
 * Q3 typed + plot: form ordered pairs from matching terms, then plot them (its own
 *    add-2 / add-4 patterns, so B stays at 12 or less and the grid rows are easy to tap).
 * Q4 typed + true/false: a "more than" pair whose first column looks like "times 2" (the trap: check every term).
 */
function PatternsCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  const both = ["times", "more than"];
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Start at 0. Add 3 each time. Type the next four terms.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "3", label: "2nd term", width: 52 },
              { correct: "6", label: "3rd term", width: 52 },
              { correct: "9", label: "4th term", width: 52 },
              { correct: "12", label: "5th term", width: 52 },
            ]}
            render={([a, b, c, d]) => (
              <>
                0, {a}, {b}, {c}, {d}
              </>
            )}
            good="Yes. Each term is 3 more than the one before it."
            bad="Start at 0. Add 3 to get each new term."
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Pattern B starts at 0 and adds 6 each time. Finish it. Then compare the matching terms.
          </p>
          <PatternTable rows={[rowA({ start: 0, add: 3 }, [0, 3, 6, 9]), rowB({ start: 0, add: 6 }, [0, 6, null, null])]} />
          <DropdownQuestion
            blanks={[
              { correct: "12", label: "3rd term of Pattern B", width: 52 },
              { correct: "18", label: "4th term of Pattern B", width: 52 },
              { correct: "2", label: "Number in the relationship", width: 52 },
              { options: both, correct: "times", label: "Times or more than" },
            ]}
            render={([a, b, c, d]) => (
              <>
                Pattern B: 0, 6, {a}, {b}
                <br />
                Each Pattern B term is {c} {d} the matching Pattern A term.
              </>
            )}
            good="Right. 3 × 2 = 6, 6 × 2 = 12, 9 × 2 = 18. Every B term is 2 times the A term above it."
            bad={(oks) => (!oks[0] || !oks[1] ? "Pattern B adds 6 each time." : "Compare the columns: 3 and 6, then 6 and 12. Is the same number added, or is it multiplied?")}
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Here are two new patterns. An <b>ordered pair</b> (A term, B term) puts the matching terms together. The first number tells how far across. The second tells how far up.
          </p>
          {/* Own patterns with B up to 12 (round 2, C2-05), so the grid rows are big enough to tap. Still "2 times".
              Pattern B's 3rd and 4th terms are blank, so the typed pairs need its rule, not a copy (round 3, C3-03). */}
          <PatternTable rows={[rowA({ start: 0, add: 2 }, [0, 2, 4, 6]), rowB({ start: 0, add: 4 }, [0, 4, null, null])]} />
          <DropdownQuestion
            blanks={[
              { correct: "4", label: "3rd ordered pair, first number", width: 48 },
              { correct: "8", label: "3rd ordered pair, second number", width: 48 },
              { correct: "6", label: "4th ordered pair, first number", width: 48 },
              { correct: "12", label: "4th ordered pair, second number", width: 48 },
              {
                correct: "(0, 0), (2, 4), (4, 8), (6, 12)",
                label: "Plot the four points",
                plot: { answer: [[0, 0], [2, 4], [4, 8], [6, 12]], xMax: 8, yMax: 12, xLabel: "Pattern A", yLabel: "Pattern B" },
              },
            ]}
            render={([a, b, c, d, e]) => (
              <>
                Ordered pairs: (0, 0), (2, 4), ({a}, {b}), ({c}, {d})
                <br />
                Plot all four points. Tap a grid point to plot it. Tap it again to take it away.
                <br />
                {e}
              </>
            )}
            good="Yes. The points line up, because each pattern grows by the same amount every time. Each B term is 2 times its A term."
            bad={(oks, vals) =>
              !oks.slice(0, 4).every(Boolean) ? "Use the 3rd and 4th columns of this table. Pattern B adds 4 each time. Pattern A's term comes first." : checkPlot([[0, 0], [2, 4], [4, 8], [6, 12]], vals[4]).msg
            }
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Look at every column, not just the first one.
          </p>
          <PatternTable rows={[rowA({ start: 2, add: 2 }, [2, 4, 6, 8]), rowB({ start: 4, add: 2 }, [4, 6, 8, 10])]} />
          <DropdownQuestion
            blanks={[
              { correct: "2", label: "Number in the relationship", width: 52 },
              { options: both, correct: "more than", label: "Times or more than" },
              { options: ["True", "False"], correct: "False", label: "Always times" },
            ]}
            render={([a, b, c]) => (
              <>
                Each Pattern B term is {a} {b} the matching Pattern A term.
                <br />
                True or false: two patterns are always related by &quot;times.&quot; {c}
              </>
            )}
            good="Correct. 4 = 2 × 2 works for the first column only. 6 is not 2 × 4. But 2 + 2 = 4, 4 + 2 = 6, 6 + 2 = 8: every B term is 2 more."
            bad={(oks) => (!oks[1] ? "Check the 2nd column: is 6 equal to 2 × 4? What do you add to 4 to get 6?" : "The first column looks like 'times 2.' Check every column before you decide.")}
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

const PRESETS: Record<string, { A: Rule; B: Rule; say: string }> = {
  save: { A: { start: 0, add: 3 }, B: { start: 0, add: 6 }, say: "Ana saves 3 dollars a week. Ben saves 6 dollars a week. Both start with 0." },
  age: { A: { start: 1, add: 1 }, B: { start: 4, add: 1 }, say: "Kai is 1 year old. His sister is 4. Every year, they both get 1 year older." },
  laps: { A: { start: 0, add: 2 }, B: { start: 0, add: 4 }, say: "Mia and Leo start with 0 laps. Each day, Mia runs 2 laps and Leo runs 4 laps." },
};

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [preset, setPreset] = useState<string>("save");
  const [A, setA] = useState<Rule>(PRESETS.save.A);
  const [B, setB] = useState<Rule>(PRESETS.save.B);
  const count = 5;
  const a = terms(A, count);
  const b = terms(B, count);
  const rel = relationOf(a, b);
  const pts = a.map((x, i) => [x, b[i]] as [number, number]);
  const grid = gridFor(pts);
  const usePreset = (id: string) => {
    setPreset(id);
    if (PRESETS[id]) {
      setA(PRESETS[id].A);
      setB(PRESETS[id].B);
    }
  };

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          A <b>rule</b> like &quot;start at 0, add 3 each time&quot; makes a pattern. Each number in the pattern is a <b>term</b>. Two rules make two patterns. Line them
          up, and compare the matching terms.
        </p>
        <Segmented
          label="Story"
          value={preset}
          onChange={usePreset}
          options={[
            { id: "save", label: "Saving money" },
            { id: "age", label: "Ages" },
            { id: "laps", label: "Laps" },
            { id: "own", label: "My own rules" },
          ]}
        />
        {PRESETS[preset] && <p className="says">{PRESETS[preset].say}</p>}
        <div className="control-row">
          <Stepper label="A starts at" value={A.start} min={0} max={10} onChange={(v) => {
              setPreset("own");
              setA({ ...A, start: v });
            }} tone="a" />
          <Stepper label="A adds" value={A.add} min={1} max={6} onChange={(v) => {
              setPreset("own");
              setA({ ...A, add: v });
            }} tone="a" />
          <Stepper label="B starts at" value={B.start} min={0} max={10} onChange={(v) => {
              setPreset("own");
              setB({ ...B, start: v });
            }} tone="b" />
          <Stepper label="B adds" value={B.add} min={1} max={6} onChange={(v) => {
              setPreset("own");
              setB({ ...B, add: v });
            }} tone="b" />
        </div>
        <PatternTable rows={[rowA(A, a), rowB(B, b)]} pairs={pts.map(([x, y]) => `(${x}, ${y})`)} />
        <p className="says">
          {A.start === B.start && A.add === B.add
            ? "Pattern B is the same as Pattern A."
            : rel
            ? `Every column: each Pattern B term is ${relationWords(rel)} the matching Pattern A term.`
            : "No single rule works for every column here. Try making B add the same as A. Or make B add 2 or 3 times as much, and start 2 or 3 times as high."}
        </p>
        <p>
          An <b>ordered pair</b> (A term, B term) is a point on a grid. Go across to the first number. Then go up to the second number. Putting the point there is
          called <b>plotting</b> it.
        </p>
        <FirstQuadrantPlane
          xMax={grid.xMax}
          yMax={grid.yMax}
          yStep={grid.yMax > 24 ? 2 : 1}
          xStep={grid.xMax > 24 ? 2 : 1}
          xLabel="Pattern A"
          yLabel="Pattern B"
          width={400}
          height={Math.min(460, 120 + (grid.yMax / (grid.yMax > 24 ? 2 : 1)) * 18)}
          points={pts.map(([x, y]) => ({ x, y, color: palette.c, showLabel: true }))}
        />
        {(introActive || showCheck) && <PatternsCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

export const U5_BUCKETS = ["onePattern", "twoTimes", "plotPairs", "twoMore"];

function onePatternProblem(): Problem {
  const r: Rule = { start: randInt(0, 9), add: randInt(2, 9) };
  const t = terms(r, 6);
  const other: Rule = { start: randInt(1, 12), add: randInt(2, 9) };
  const ot = terms(other, 4);
  return {
    title: "One rule",
    bucket: "onePattern",
    story: (
      <>
        Start at {r.start}. Add {r.add} each time.
      </>
    ),
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <PatternTable
          rows={[{ label: "Pattern", rule: `start ${r.start}, add ${r.add}`, terms: t.map((x, i) => (i === 0 || (done >= 1 && i < 3) || done >= 2 || (pointing(help, 1) && i < 5) ? x : null)), tone: "a" }]}
        />
        {done >= 2 && <PatternTable rows={[{ label: "New pattern", rule: done >= 3 ? `start ${other.start}, add ${other.add}` : "add ?", terms: ot, tone: "b" }]} />}
      </div>
    ),
    steps: [
      {
        ...sentence(
          {
            prompt: "Type the 2nd and 3rd terms.",
            hint: `The 1st term is ${r.start}. Add ${r.add} to get the next one.`,
            explain: `${t[0]} + ${r.add} = ${t[1]}, and ${t[1]} + ${r.add} = ${t[2]}.`,
          },
          "The 2nd term is ",
          numberBlank(t[1]),
          " and the 3rd term is ",
          numberBlank(t[2]),
          "."
        ),
      },
      {
        kind: "number",
        prompt: "What is the 6th term?",
        hint: "Keep adding. Count the terms: the start is the 1st term.",
        explain: `${t.join(", ")}. The 6th term is ${t[5]}.`,
        answer: t[5],
        diagnose: (v) => (v === r.start + 6 * r.add ? "That's the 7th term. The start number is the 1st term." : null),
      },
      {
        kind: "number",
        prompt: `Another pattern is ${ot.join(", ")}. What number does its rule add each time?`,
        hint: "Subtract one term from the next term.",
        explain: `${ot[1]} − ${ot[0]} = ${other.add}. Each term is ${other.add} more than the one before.`,
        answer: other.add,
      },
    ],
    wrapUp: (
      <>
        Start at {r.start}, add {r.add}: {t.join(", ")}.
      </>
    ),
  };
}

const twoTable = (p: PatternPair, cols: number, known: number, ring: number | null = null, pairs?: (string | null)[]) => (
  <PatternTable rows={[rowA(p.A, terms(p.A, cols).map((x, i) => (i < known ? x : null))), rowB(p.B, terms(p.B, cols).map((x, i) => (i < known ? x : null)))]} ring={ring} pairs={pairs} />
);

function twoPatternsProblem(kind: "times" | "more"): Problem {
  const p = patternPair(kind, 4, 40, kind === "more" && Math.random() < 0.4);
  const a4 = termAt(p.A, 4);
  const b4 = termAt(p.B, 4);
  return {
    title: "Two rules",
    bucket: kind === "times" ? "twoTimes" : "twoMore",
    story: (
      <>
        Pattern A: start at {p.A.start}, add {p.A.add}. Pattern B: start at {p.B.start}, add {p.B.add}.
      </>
    ),
    visual: (done, help) => twoTable(p, 4, done >= 1 ? 4 : 3, pointing(help, 0) ? 2 : pointing(help, 1) ? 1 : null),
    steps: [
      {
        ...sentence(
          {
            prompt: "Type the 4th term of each pattern.",
            hint: "Each pattern adds its own number to its 3rd term.",
            explain: `Pattern A: ${termAt(p.A, 3)} + ${p.A.add} = ${a4}. Pattern B: ${termAt(p.B, 3)} + ${p.B.add} = ${b4}.`,
          },
          "Pattern A's 4th term is ",
          numberBlank(a4),
          " and Pattern B's 4th term is ",
          numberBlank(b4),
          "."
        ),
      },
      relationStep(p, 4),
      ...(kind === "times" ? [whyTimesStep(p)] : []),
      predictStep(p, pick([8, 10, 12])),
    ],
    wrapUp: <>Each Pattern B term is {relationWords(p.rel)} the matching Pattern A term. Once you know that, you can find any B term from the A term.</>,
  };
}

function plotProblem(): Problem {
  // Up to 12 on both axes, so the grid's columns stay a finger apart on an iPad (round 1, C1-22).
  const p = patternPair(pick(["times", "more"]), 4, 12);
  const pts = pairsOf(p, 4);
  const nth = randInt(2, 4);
  const [x, y] = pts[nth - 1];
  const grid = gridFor(pts);
  return {
    title: "Ordered pairs on a grid",
    bucket: "plotPairs",
    story: <>Make ordered pairs (Pattern A term, Pattern B term), then plot them.</>,
    visual: (done) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {twoTable(p, 4, 4, done === 0 ? nth - 1 : null, pts.map(([u, v], i) => (done >= 2 || (done >= 1 && i === nth - 1) ? `(${u}, ${v})` : null)))}
        {done >= 2 && (
          <FirstQuadrantPlane
            xMax={grid.xMax}
            yMax={grid.yMax}
            xLabel="Pattern A"
            yLabel="Pattern B"
            width={320}
            height={Math.min(400, 110 + grid.yMax * 15)}
            points={pts.map(([u, v]) => ({ x: u, y: v, color: palette.c }))}
          />
        )}
      </div>
    ),
    steps: [
      coordinateStep(
        {
          prompt: `Write the ordered pair for the ${ordinal(nth)} terms. Write it like this: (A term, B term).`,
          hint: "The Pattern A term comes first. The Pattern B term comes second.",
          explain: `The ${ordinal(nth)} terms are ${x} and ${y}: (${x}, ${y}).`,
        },
        x,
        y
      ),
      plotPairsStep(p, 4),
      relationStep(p, 4, true),
    ],
    wrapUp: <>Each point's second number is {relationWords(p.rel)} its first number, just like the patterns.</>,
  };
}

function Preview() {
  return <PatternTable rows={[rowA({ start: 0, add: 3 }, [0, 3, 6, 9]), rowB({ start: 0, add: 6 }, [0, 6, 12, 18])]} pairs={["(0, 0)", "(3, 6)", "(6, 12)", "(9, 18)"]} />;
}

export const patterns: Unit = {
  id: "patterns",
  title: "Two Rules, Two Patterns, One Relationship",
  goal: "Make two patterns from two rules, compare the matching terms, and plot them as ordered pairs on a grid.",
  standard: "5.OA.3",
  keyIdea: (
    <>
      <p>Pattern A: start at 0, add 3. That makes 0, 3, 6, 9. Pattern B: start at 0, add 6. That makes 0, 6, 12, 18. Each B term is 2 times the A term.</p>
      <p>Check every column. Sometimes B is &quot;times&quot; A, and sometimes B is &quot;more than&quot; A. The matching terms make ordered pairs: (3, 6), (6, 12).</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U5_BUCKETS,
  problems: [
    { label: "One rule", make: () => onePatternProblem(), buckets: ["onePattern"] },
    // One type for both kinds of pair, so neither the type name nor the title says "times" or "more than".
    {
      label: "Two rules",
      make: (b) => twoPatternsProblem(b === "twoTimes" ? "times" : b === "twoMore" ? "more" : pick(["times", "more"])),
      buckets: ["twoTimes", "twoMore"],
    },
    { label: "Plot the pairs", make: () => plotProblem(), buckets: ["plotPairs"] },
  ],
  test: patternsTest,
};
