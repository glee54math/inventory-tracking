import { useState } from "react";
import { FracLinePlot } from "../diagrams";
import { choice, customStep, selectBlank, sentence, type Problem } from "../../../shared/engine/types";
import { Frac, Segmented } from "../../../shared/engine/controls";
import { pick } from "../../../shared/lib/math";
import type { Unit } from "../../../shared/units/types";
import { countAt, eighthsLowest, eighthsText, makePlot, mixedText, pickDistractors, plotSpan, plotTicks, plotValues, type PlotDen, type PlotSpec } from "../lib/fractions";
import { amountStep } from "../lib/steps";
import { PLOT_CONTEXTS, type PlotContext } from "../lib/words";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "./cfu";
import { fractionLinePlotsTest } from "./FractionLinePlotsTest";
import { MathText } from "../../../shared/components/MathText";

// Every plot in this unit uses denominators 2, 4 or 8 ONLY (4.MD.4) — see
// lib/fractions.ts's PLOT_DENS; makePlot() never draws from anything else.

const plural = (u: string) => (u === "inch" ? "inches" : `${u}s`);
const unitWord = (pieces: number, d: number, c: PlotContext) => (pieces <= d ? c.unit : plural(c.unit));
/** A value (eighths) written with the plot's own denominator, unsimplified: 4 on a fourths plot -> "2/4". */
const writtenIn = (v: number, den: PlotDen): string => {
  const w = Math.floor(v / 8);
  const r = (v % 8) / (8 / den);
  return r === 0 ? String(w) : w === 0 ? `${r}/${den}` : `${w} ${r}/${den}`;
};
const denWord = (d: PlotDen) => (d === 2 ? "halves" : d === 4 ? "fourths" : "eighths");

/** Fixed CFU data (eighths): 1/4 ×1, 3/8 ×2, 1/2 ×4, 3/4 ×3, 7/8 ×1. */
const CFU_DATA = [2, 3, 3, 4, 4, 4, 4, 6, 6, 6, 7];

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/** Plan-required walkthrough: a cluster of dots at one tick → a sum → a mixed number. */
function ClusterWalkthrough({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  return (
    <MathText>
      <div className="align-stack-wrap">
        <p>
          <b>2.</b> Let's find the total length of all the beetles that measured <Frac n={3} d={4} /> inch.
        </p>
        <FracLinePlot den={8} minWhole={0} maxWhole={1} data={CFU_DATA} unit="inches" highlight={6} />
        <DropdownQuestion
          blanks={[{ options: ["2", "3", "4"], correct: "3", label: "Dots above 3/4" }]}
          render={([a]) => (
            <>
              How many dots are above <Frac n={3} d={4} />? {a}
            </>
          )}
          good="Right — 3 dots, so 3 beetles that were each 3/4 inch long."
          bad="Not quite — find the 3/4 tick (it's highlighted) and count only the dots stacked on it."
          onDone={() => setStage((s) => Math.max(s, 1))}
        />
        {stage >= 1 && (
          <div style={{ marginTop: 10 }}>
            <DropdownQuestion
              blanks={[{ options: ["3", "9", "12"], correct: "9", label: "Numerator of the sum" }]}
              render={([a]) => (
                <>
                  Add one <Frac n={3} d={4} /> for each dot: <Frac n={3} d={4} /> + <Frac n={3} d={4} /> + <Frac n={3} d={4} /> = <Frac n={a} d={4} />
                </>
              )}
              good="Yes — 3 + 3 + 3 = 9 fourths. (That's 3 × 3/4 — the multiplying idea from Unit 4!)"
              bad="Not quite — add the numerators of the three copies of 3/4: 3 + 3 + 3. The pieces stay fourths."
              onDone={() => setStage((s) => Math.max(s, 2))}
            />
          </div>
        )}
        {stage >= 2 && (
          <div style={{ marginTop: 10 }}>
            <DropdownQuestion
              blanks={[
                { options: ["1", "2", "3"], correct: "2", label: "Wholes" },
                { options: ["1", "2", "3"], correct: "1", label: "Fourths left" },
              ]}
              render={([a, b]) => (
                <>
                  <Frac n={9} d={4} /> = {a} and <Frac n={b} d={4} /> inches
                </>
              )}
              good="Correct — 8 of the 9 fourths make 2 whole inches, with 1/4 left: 2 1/4 inches in all."
              bad="Not quite — every 4 fourths make 1 whole. How many wholes fit in 9 fourths, and what's left?"
              onDone={() => {
                setStage(3);
                onDone();
              }}
            />
          </div>
        )}
      </div>
    </MathText>
  );
}

/**
 * Q1 vocabulary (one dot = one measurement; a stack = several equal
 * measurements). Q2 the plan's cluster-to-sum walkthrough. Q3 the classic
 * conflation: longest value vs most common value (tallest stack), both in one
 * question. Q4 true/false trap: "4 dots at 1/2 total 4 1/2" (count written
 * next to the value).
 */
function LinePlotCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> A class measured some beetles and made this line plot (inches).
          </p>
          <FracLinePlot den={8} minWhole={0} maxWhole={1} data={CFU_DATA} unit="inches" />
          <DropdownQuestion
            blanks={[
              { options: ["one measured beetle", "1/8 of an inch", "one inch"], correct: "one measured beetle", label: "What one dot stands for" },
              { options: ["3 beetles were each 3/4 inch long", "one beetle was 3 3/4 inches long", "3/4 of the beetles"], correct: "3 beetles were each 3/4 inch long", label: "What 3 dots above 3/4 mean" },
            ]}
            render={([a, b]) => (
              <>
                Each dot stands for {a}, and the 3 dots above 3/4 mean {b}.
              </>
            )}
            good="Correct — every dot is one beetle, placed above its length. A stack of 3 dots at 3/4 means three beetles that each measured 3/4 inch."
            bad="Not quite. The number line shows the lengths; each dot is one thing that was measured. What does a stack of 3 dots at one length tell you?"
            onDone={mark(0)}
          />
        </div>
        <ClusterWalkthrough onDone={mark(1)} />
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Same beetle plot as question 1.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["1/2", "7/8", "1"], correct: "7/8", label: "Longest beetle" },
              { options: ["4", "7/8", "1/2"], correct: "1/2", label: "Most common length" },
            ]}
            render={([a, b]) => (
              <>
                The longest beetle measured {a} inch, and the most common length was {b} inch.
              </>
            )}
            good="Correct — the LONGEST is the dot farthest to the right (7/8). The MOST COMMON length is the tallest stack (1/2, with 4 dots). Two different questions!"
            bad="Not quite. Longest = farthest to the right (a dot, not just the end of the line). Most common = the tallest stack — and the answer is a length, not a count."
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Theo says: "There are 4 dots at <Frac n={1} d={2} />, so those beetles total 4 <Frac n={1} d={2} /> inches."
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "Is Theo right" },
              { options: ["4 1/2", "2", "4/8"], correct: "2", label: "Real total" },
            ]}
            render={([a, b]) => (
              <>
                Theo is {a}. The real total is {b} inches.
              </>
            )}
            good="Correct — Theo wrote the count next to the length. The total is 1/2 + 1/2 + 1/2 + 1/2 = 4/2 = 2 inches."
            bad="Not quite. Four beetles that are each 1/2 inch: add 1/2 four times. Is that 4 1/2?"
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

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [den, setDen] = useState<PlotDen>(8);
  const [data, setData] = useState<number[]>([3, 4, 4, 6]);
  const minWhole = 0;
  const maxWhole = plotSpan(den);
  const vals = plotValues(data);

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          A line plot is a number line with a dot for every measurement. Click above a tick to add a measurement there.
        </p>
        <div className="control-row">
          <Segmented
            label="Marked in"
            value={String(den)}
            onChange={(v) => {
              setDen(Number(v) as PlotDen);
              setData([]);
            }}
            options={[
              { id: "2", label: "Halves" },
              { id: "4", label: "Fourths" },
              { id: "8", label: "Eighths" },
            ]}
          />
          <button className="btn ghost" type="button" disabled={data.length === 0} onClick={() => setData((d) => d.slice(0, -1))}>
            Undo last dot
          </button>
          <button className="btn ghost" type="button" disabled={data.length === 0} onClick={() => setData([])}>
            Clear
          </button>
        </div>
        <FracLinePlot den={den} minWhole={minWhole} maxWhole={maxWhole} data={data} unit="inches" onTickClick={(e) => e > 0 && setData((d) => [...d, e])} />
        {vals.length > 0 ? (
          <div>
            <ul style={{ margin: 0 }}>
              {vals.map((v) => {
                const k = countAt(data, v);
                const { n, d } = eighthsLowest(v);
                return (
                  <li key={v}>
                    {k} dot{k === 1 ? "" : "s"} at {eighthsText(v)}: total {k > 1 ? `${Array.from({ length: Math.min(k, 4) }, () => `${n}/${d}`).join(" + ")}${k > 4 ? " + …" : ""} = ` : ""}
                    <b>{mixedText(k * n, d)}</b> in
                  </li>
                );
              })}
            </ul>
            {vals.length > 1 && (
              <p className="muted small">
                Longest {eighthsText(vals[vals.length - 1])} − shortest {eighthsText(vals[0])} = <b>{mixedText((vals[vals.length - 1] - vals[0]) / (8 / den), den)}</b> inch difference (in{" "}
                {denWord(den)}).
              </p>
            )}
          </div>
        ) : (
          <p className="muted small">No dots yet — click above a tick (not 0) to add one.</p>
        )}
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <LinePlotCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

function PlotView({ s, c, highlight }: { s: PlotSpec; c: PlotContext; highlight?: number }) {
  return <FracLinePlot den={s.den} minWhole={s.minWhole} maxWhole={s.maxWhole} data={s.data} unit={plural(c.unit)} highlight={highlight} />;
}

function readCountProblem(): Problem {
  const s = makePlot();
  const c = pick(PLOT_CONTEXTS);
  const vals = plotValues(s.data);
  const v = pick(vals.length > 1 ? vals.slice(0, -1) : vals);
  const k = countAt(s.data, v);
  const more = s.data.filter((x) => x > v).length;
  return {
    title: "Read the line plot",
    bucket: "readCount",
    story: c.intro,
    visual: () => <PlotView s={s} c={c} highlight={v} />,
    steps: [
      {
        kind: "number",
        prompt: `How many ${c.things} measured ${eighthsText(v)} ${unitWord(v, 8, c)}?`,
        hint: `Count the dots above ${eighthsText(v)}. The answer is a count, not a length.`,
        explain: `${k}.`,
        answer: k,
      },
      {
        kind: "number",
        prompt: `How many measured MORE than ${eighthsText(v)}?`,
        hint: `Count the dots to the right of ${eighthsText(v)}.`,
        explain: `${more} dots are to the right.`,
        answer: more,
      },
      { kind: "number", prompt: `How many ${c.things} were measured in all?`, hint: "Count every dot.", explain: `${s.data.length} dots.`, answer: s.data.length },
    ],
    wrapUp: `${k} of the ${s.data.length} ${c.things} measured ${eighthsText(v)}.`,
  };
}

function totalProblem(): Problem {
  const s = makePlot();
  const candidates = plotValues(s.data).filter((v) => v % 8 !== 0);
  const v = candidates.length > 0 ? pick(candidates) : s.minWhole * 8 + 8 / s.den;
  while (countAt(s.data, v) < 2) s.data.push(v);
  const c = pick(PLOT_CONTEXTS);
  const k = countAt(s.data, v);
  const { n, d } = eighthsLowest(v);
  const vt = eighthsText(v);
  const sum = Array.from({ length: k }, () => vt).join(" + ");
  return {
    title: "Total from a line plot",
    bucket: "total",
    story: c.intro,
    visual: () => <PlotView s={s} c={c} highlight={v} />,
    steps: [
      { kind: "number", prompt: `How many ${c.things} measured ${vt} ${unitWord(v, 8, c)}?`, hint: `Count the dots above ${vt}.`, explain: `${k}.`, answer: k },
      choice(
        { prompt: `Which gives their TOTAL ${c.measure}?`, hint: "One measurement per dot — add them all.", explain: `${sum} — the same as ${k} × ${vt}.` },
        sum,
        pickDistractors(sum, [
          // added the count to the length — skipped when it happens to equal
          // the real total (k + v = k × v exactly when v = k / (k − 1), e.g. 3 + 1 1/2)
          k * 8 + v === k * v ? Array.from({ length: k - 1 }, () => vt).join(" + ") : `${k} + ${vt}`,
          vt, // just one of them
        ])
      ),
      amountStep({ prompt: "What is the total?", hint: `${k} × ${n}/${d} = ?/${d}`, explain: `${k} × ${n}/${d} = ${k * n}/${d} = ${mixedText(k * n, d)}.` }, k * n, d, unitWord(k * n, d, c)),
    ],
    wrapUp: `The ${k} ${c.things} at ${vt} total ${mixedText(k * n, d)} ${unitWord(k * n, d, c)}.`,
  };
}

function differenceProblem(): Problem {
  const s = makePlot();
  const c = pick(PLOT_CONTEXTS);
  let vals = plotValues(s.data);
  while (vals.length < 3) {
    s.data.push(pick(plotTicks(s.den, s.minWhole, s.maxWhole).slice(1)));
    vals = plotValues(s.data);
  }
  const max = vals[vals.length - 1];
  const min = vals[0];
  const mode = vals.reduce((best, v) => (countAt(s.data, v) > countAt(s.data, best) ? v : best), vals[0]);
  const step = 8 / s.den;
  const pieces = (max - min) / step;
  const others = vals.map(eighthsText);
  return {
    title: "Difference on a line plot",
    bucket: "difference",
    story: c.intro,
    visual: () => <PlotView s={s} c={c} />,
    steps: [
      sentence(
        {
          prompt: "Find the biggest and smallest measurements.",
          hint: "Biggest = farthest-right dot; smallest = farthest-left dot. Not the tallest stack!",
          explain: `Biggest ${eighthsText(max)}, smallest ${eighthsText(min)}.`,
        },
        `The ${c.most} is `,
        selectBlank(eighthsText(max), pickDistractors(eighthsText(max), [eighthsText(mode), eighthsText(s.maxWhole * 8), ...others], 3)),
        ` and the ${c.least} is `,
        selectBlank(eighthsText(min), pickDistractors(eighthsText(min), [eighthsText(mode), eighthsText(s.minWhole * 8), ...others], 3)),
        "."
      ),
      amountStep(
        {
          prompt: `How much bigger is the ${c.most} than the ${c.least}? (Use ${denWord(s.den)}, like the plot.)`,
          hint: `Write both in ${denWord(s.den)}: ${mixedText(max / step, s.den)} and ${mixedText(min / step, s.den)}. Or count the tick jumps between them.`,
          explain: `${mixedText(max / step, s.den)} − ${mixedText(min / step, s.den)} = ${mixedText(pieces, s.den)}.`,
        },
        pieces,
        s.den,
        unitWord(pieces, s.den, c)
      ),
    ],
    wrapUp: `The difference is ${mixedText(pieces, s.den)} ${unitWord(pieces, s.den, c)}.`,
  };
}

/**
 * Build-a-plot widget (Practice/Explore ONLY — it can only finish once the
 * plot is right, so it must never appear in a no-feedback Test). Click a
 * tick to add a dot, click "Undo" to remove; "Check my plot" colors every
 * tick label green/red for its own stack, so a student can always see which
 * spot to fix — never stuck.
 */
function BuildPlot({ s, onDone }: { s: PlotSpec; onDone: () => void }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const ticks = plotTicks(s.den, s.minWhole, s.maxWhole);
  const good = ticks.filter((e) => countAt(placed, e) === countAt(s.data, e) && countAt(s.data, e) > 0);
  const bad = ticks.filter((e) => countAt(placed, e) !== countAt(s.data, e));
  const ok = bad.length === 0;
  return (
    <MathText>
      <div>
        <FracLinePlot
          den={s.den}
          minWhole={s.minWhole}
          maxWhole={s.maxWhole}
          data={placed}
          tone="b"
          onTickClick={(e) => {
            setPlaced((p) => [...p, e]);
            setChecked(false);
          }}
          goodTicks={checked ? good : []}
          badTicks={checked ? bad : []}
        />
        <div className="control-row" style={{ marginTop: 8 }}>
          <button className="btn ghost" type="button" disabled={placed.length === 0} onClick={() => {
              setPlaced((p) => p.slice(0, -1));
              setChecked(false);
            }}>
            Undo last dot
          </button>
          <button className="btn primary" type="button" disabled={placed.length === 0} onClick={() => setChecked(true)}>
            Check my plot
          </button>
          {checked && ok && (
            <button className="btn primary" type="button" onClick={onDone}>
              Continue
            </button>
          )}
        </div>
        {checked && (
          <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
            {ok ? "Every dot is in the right place!" : `Not yet — the red labels have the wrong number of dots (${placed.length} placed, ${s.data.length} needed).`}
          </p>
        )}
      </div>
    </MathText>
  );
}

function buildProblem(): Problem {
  const s = makePlot(undefined, pick([6, 7, 8]));
  const c = pick(PLOT_CONTEXTS);
  const vals = plotValues(s.data);
  const top = vals.reduce((best, v) => (countAt(s.data, v) > countAt(s.data, best) ? v : best), vals[0]);
  const k = countAt(s.data, top);
  // Some measurements are written in the plot's own pieces (e.g. 2/4 on a
  // plot labeled 1/2), so placing them takes the equivalence step too.
  const list = s.data.map((v) => (Math.random() < 0.4 ? writtenIn(v, s.den) : eighthsText(v))).join(", ");
  return {
    title: "Make a line plot",
    bucket: "build",
    story: `${c.intro} The measurements were: ${list}.`,
    visual: (done) => (done >= 1 ? <PlotView s={s} c={c} /> : <p className="muted small">Build the plot in step 1 — one dot per measurement.</p>),
    steps: [
      customStep(
        {
          prompt: `Click above the right tick for each measurement (${s.data.length} dots in all). Watch out: a measurement like 2/4 goes on the tick labeled 1/2 — same amount!`,
          hint: "Cross each measurement off the list as you place it.",
          explain: "Every measurement has its own dot above its value.",
        },
        (onDone) => <BuildPlot s={s} onDone={onDone} />,
        `${s.data.length} dots plotted`
      ),
      {
        kind: "number",
        prompt: `How many dots are above ${eighthsText(top)}?`,
        hint: `Count the dots on the ${eighthsText(top)} tick.`,
        explain: `${k}.`,
        answer: k,
      },
    ],
    wrapUp: `The tallest stack is at ${eighthsText(top)}.`,
  };
}

function Preview() {
  return <FracLinePlot den={8} minWhole={0} maxWhole={1} data={CFU_DATA} unit="inches" />;
}

const BUCKETS = ["readCount", "total", "difference", "build"];

export const fractionLinePlots: Unit = {
  id: "fractionLinePlots",
  title: "Fraction Line Plots",
  goal: "Make a line plot of measurements in halves, fourths and eighths, then use it to find totals and differences.",
  standard: "4.MD.4",
  keyIdea: (
    <>
      <p>Each dot is one measurement, placed above its value. A stack of 3 dots at 3/4 means three things each measured 3/4.</p>
      <p>
        Total of a stack: add the value once per dot (3/4 + 3/4 + 3/4 = 9/4 = 2 1/4). Difference: biggest − smallest, written in the plot's own pieces.
      </p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: BUCKETS,
  problems: [
    { label: "Read it", make: readCountProblem, buckets: ["readCount"] },
    { label: "Totals", make: totalProblem, buckets: ["total"] },
    { label: "Differences", make: differenceProblem, buckets: ["difference"] },
    { label: "Make a plot", make: buildProblem, buckets: ["build"] },
  ],
  test: fractionLinePlotsTest,
};
