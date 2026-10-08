import React, { useState } from "react";
import { DoubleNumberLine, PercentGrid, TapeDiagram } from "../diagrams";
import { palette } from "../../shared/lib/palette";
import { fmt, fracText, pick, randInt } from "../../shared/lib/math";
import type { Problem } from "../../shared/engine/types";
import { QA, QC, Says, Stepper } from "../../shared/engine/controls";
import type { Unit } from "../../shared/units/types";

function Explore() {
  const [pct, setPct] = useState(30);
  const [whole, setWhole] = useState(60);
  const part = (pct / 100) * whole;
  return (
    <div className="explore">
      <div className="controls">
        <div className="control-row">
          <Stepper tone="a" label="percent" value={pct} min={0} max={100} step={5} onChange={setPct} />
          <Stepper tone="c" label="the whole" value={whole} min={10} max={500} step={10} onChange={setWhole} />
        </div>
        <p className="muted small">Tip: click or drag across the hundred grid to shade it.</p>
      </div>
      <div className="stage two-col">
        <div>
          <PercentGrid filled={pct} onChange={setPct} color={palette.a} />
          <p className="center small muted">
            {pct} of 100 squares = {pct}%
          </p>
        </div>
        <div>
          <DoubleNumberLine
            top={{ label: "amount", color: palette.c }}
            bottom={{ label: "percent", color: palette.a, format: (v) => `${fmt(v)}%` }}
            pairs={[
              { top: 0, bottom: 0 },
              ...(pct === 10 ? [] : [{ top: whole / 10, bottom: 10 }]),
              ...(pct > 0 && pct < 100 ? [{ top: part, bottom: pct, highlight: true }] : []),
              { top: whole, bottom: 100 },
            ]}
            width={440}
          />
          <TapeDiagram
            tapes={[{ label: "10% each", units: 10, color: palette.a, softColor: palette.aSoft, shaded: Math.floor(pct / 10), values: Array(10).fill(fmt(whole / 10)), total: `${whole} = 100%` }]}
            unitWidth={38}
            labelWidth={78}
          />
        </div>
      </div>
      <div className="sayings">
        <Says>
          <b>{pct}%</b> means {pct} per 100, the fraction <b>{pct}/100</b>
          {fracText(pct, 100) !== `${pct}/100` && pct > 0 ? <> = {fracText(pct, 100)}</> : null}.
        </Says>
        <Says>
          {pct}% of <QC>{whole}</QC> = {pct}/100 × {whole} = <QA>{fmt(part)}</QA>.
        </Says>
      </div>
    </div>
  );
}

const partScenes = [
  { whole: (n: number) => `A school has ${n} students.`, part: (p: number) => `${p}% of them walk to school. How many students walk?`, unit: "students" },
  { whole: (n: number) => `A store has ${n} shirts.`, part: (p: number) => `${p}% are on sale. How many shirts are on sale?`, unit: "shirts" },
  { whole: (n: number) => `A book has ${n} pages.`, part: (p: number) => `Sam has read ${p}% of it. How many pages has Sam read?`, unit: "pages" },
  { whole: (n: number) => `A jar holds ${n} marbles.`, part: (p: number) => `${p}% of them are green. How many are green?`, unit: "marbles" },
];

const findPartProblem = (): Problem => {
  const s = pick(partScenes);
  const p = randInt(1, 9) * 10;
  const W = randInt(2, 30) * 10;
  const ten = W / 10;
  const n = p / 10;
  const part = ten * n;
  return {
    title: "Find the part",
    story: (
      <>
        {s.whole(W)} {s.part(p)}
      </>
    ),
    visual: (done) => (
      <>
        <TapeDiagram
          tapes={[{ label: s.unit, units: 10, color: palette.a, softColor: palette.aSoft, shaded: done >= 3 ? n : 0, values: done >= 2 ? Array(10).fill(fmt(ten)) : [], total: `${W} ${s.unit} = 100%` }]}
          unitWidth={44}
        />
        <DoubleNumberLine
          top={{ label: s.unit, color: palette.c }}
          bottom={{ label: "percent", color: palette.a, format: (v) => `${v}%` }}
          pairs={[
            { top: 0, bottom: 0 },
            ...(done >= 2 && p !== 10 ? [{ top: ten, bottom: 10 }] : []),
            { top: part, bottom: p, hideTop: done < 4, highlight: true },
            { top: W, bottom: 100 },
          ]}
        />
      </>
    ),
    steps: [
      {
        kind: "number",
        prompt: <>{p}% means {p} out of every how many?</>,
        answer: 100,
        hint: "Per-cent: “cent” means 100.",
        explain: `${p}% = ${p}/100. The whole (${W} ${s.unit}) is 100%.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            Split the whole into 10 equal parts. What is 10% of <QC>{W}</QC>?
          </>
        ),
        answer: ten,
        suffix: s.unit,
        hint: `100% ÷ 10 = 10%, so divide ${W} by 10.`,
        explain: `${W} ÷ 10 = ${fmt(ten)}. Each block of the tape is 10%.`,
      },
      {
        kind: "number",
        prompt: <>How many 10% blocks make {p}%?</>,
        answer: n,
        suffix: "blocks",
        hint: `10% × ? = ${p}%`,
        explain: `${p} ÷ 10 = ${n} blocks.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            So what is {p}% of {W}?
          </>
        ),
        answer: part,
        suffix: s.unit,
        hint: `${n} blocks × ${fmt(ten)} in each block.`,
        explain: `${n} × ${fmt(ten)} = ${fmt(part)}. Check: ${p}/100 × ${W} = ${fmt(part)}.`,
      },
    ],
    wrapUp: (
      <>
        {p}% of {W} is {fmt(part)} — the same as {p}/100 × {W}.
      </>
    ),
  };
};

const wholeScenes = [
  { text: (P: number, p: number) => `Ava has saved $${P}. That's ${p}% of the price of a bike. How much does the bike cost?`, unit: "dollars", short: "dollars" },
  { text: (P: number, p: number) => `${P} students voted for a field trip. That's ${p}% of the grade. How many students are in the grade?`, unit: "students", short: "students" },
  { text: (P: number, p: number) => `Jon has run ${P} miles. That's ${p}% of his monthly goal. What is his goal?`, unit: "miles", short: "miles" },
];

const findWholeProblem = (): Problem => {
  const s = pick(wholeScenes);
  const p = randInt(2, 9) * 10;
  const n = p / 10;
  const ten = randInt(2, 15) * (s.unit === "dollars" ? 5 : 1);
  const W = ten * 10;
  const P = ten * n;
  return {
    title: "Find the whole",
    story: <>{s.text(P, p)}</>,
    visual: (done) => (
      <>
        <TapeDiagram
          tapes={[
            { label: "known", units: n, color: palette.a, values: done >= 2 ? Array(n).fill(fmt(ten)) : Array(n).fill("10%"), total: `${P} ${s.short} = ${p}%` },
            { label: "whole", units: 10, color: palette.c, softColor: palette.cSoft, shaded: done >= 3 ? 10 : 0, values: done >= 2 ? Array(10).fill(fmt(ten)) : Array(10).fill("10%"), total: done >= 3 ? `${W} ${s.short} = 100%` : "? = 100%" },
          ]}
          unitWidth={42}
        />
        {done >= 2 && (
          <Says>
            1 block = 10% = <QA>{fmt(ten)}</QA> {s.short}.
          </Says>
        )}
        <DoubleNumberLine
          top={{ label: s.short, color: palette.c }}
          bottom={{ label: "percent", color: palette.a, format: (v) => `${v}%` }}
          pairs={[
            { top: 0, bottom: 0 },
            ...(done >= 2 ? [{ top: ten, bottom: 10 }] : []),
            { top: P, bottom: p },
            { top: W, bottom: 100, hideTop: done < 3, highlight: true },
          ]}
        />
      </>
    ),
    steps: [
      {
        kind: "number",
        prompt: <>How many 10% blocks make {p}%?</>,
        answer: n,
        suffix: "blocks",
        hint: `${p} ÷ 10`,
        explain: `${n} blocks of 10%.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            Those {n} blocks hold <QA>{P}</QA> {s.short}. How much is in one block (10%)?
          </>
        ),
        answer: ten,
        suffix: s.short,
        hint: `Share ${P} equally among ${n} blocks.`,
        explain: `${P} ÷ ${n} = ${fmt(ten)}. So 10% is ${fmt(ten)}.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            1 block = 10% = {fmt(ten)} {s.short}. The whole (100%) is 10 of those blocks. What is the whole?
          </>
        ),
        answer: W,
        suffix: s.short,
        hint: `10 × ${fmt(ten)}`,
        explain: `10 × ${fmt(ten)} = ${fmt(W)}. Check: ${p}% of ${fmt(W)} = ${P}. ✓`,
      },
    ],
    wrapUp: (
      <>
        If {P} is {p}% of the whole, then 10% is {fmt(ten)} and the whole (100%) is {fmt(W)}.
      </>
    ),
  };
};

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <PercentGrid filled={30} color={palette.a} size={180} />;
}

export const percent: Unit = {
  id: "percent",
  title: "Percent",
  goal: "Find a percent of a number, and find the whole from a part",
  standard: "6.RP.A.3c",
  keyIdea: (
    <>
      <p>
        <b>Percent</b> means “per 100”. 30% is the rate 30 per 100, or 30/100. So 30% of 60 is 30/100 × 60 = 18.
      </p>
      <p>A handy trick: the whole is 100%, so 10% is the whole ÷ 10. Build any multiple of 10% from those blocks.</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [
    { label: "Find the part", make: findPartProblem },
    { label: "Find the whole", make: findWholeProblem },
  ],
};
