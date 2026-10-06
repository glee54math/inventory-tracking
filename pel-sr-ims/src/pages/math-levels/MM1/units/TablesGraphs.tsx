import React, { useState } from "react";
import { CoordinatePlane, RatioTable } from "../diagrams";
import type { PlotPoint, RatioTableCell } from "../diagrams";
import { palette, itemColors } from "../lib/palette";
import type { ItemColor } from "../lib/palette";
import { gcd, lcm, pick, randInt, shuffle } from "../lib/math";
import { choice, type Problem } from "../engine/types";
import { niceMax, niceStep, QA, QB, QC, Says, Stepper } from "../engine/controls";
import { tablesGraphsTest } from "./TablesGraphsTest";
import type { Unit } from "./types";

function Explore() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [compare, setCompare] = useState(false);
  const [c, setC] = useState(3);
  const [d, setD] = useState(4);
  const [plotted, setPlotted] = useState<{ x: number; y: number }[]>([]);
  const rows = 5;
  const xMax = 12;
  const yMax = 18;

  const onLine = (p: { x: number; y: number }) => p.x * b === p.y * a;
  const points: PlotPoint[] = plotted.map((p) => ({ ...p, color: onLine(p) ? palette.good : palette.bad, showLabel: true }));
  const hits = plotted.filter(onLine).length;

  const toggle = (x: number, y: number) =>
    setPlotted((ps) => (ps.some((p) => p.x === x && p.y === y) ? ps.filter((p) => !(p.x === x && p.y === y)) : [...ps, { x, y }]));

  return (
    <div className="explore">
      <div className="controls">
        <div className="control-row">
          <Stepper tone="a" label="scoops of mix" value={a} min={1} max={6} onChange={(v) => { setA(v); setPlotted([]); }} />
          <Stepper tone="b" label="cups of water" value={b} min={1} max={6} onChange={(v) => { setB(v); setPlotted([]); }} />
          <button className={`btn ghost ${compare ? "pressed" : ""}`} aria-pressed={compare} onClick={() => setCompare((x) => !x)}>
            Compare with a second recipe
          </button>
        </div>
        {compare && (
          <div className="control-row">
            <Stepper tone="c" label="recipe 2: scoops" value={c} min={1} max={6} onChange={setC} />
            <Stepper tone="c" label="recipe 2: cups" value={d} min={1} max={6} onChange={setD} />
          </div>
        )}
      </div>
      <div className="stage two-col">
        <div>
          <RatioTable
            columns={[
              { label: "scoops of mix", color: palette.a },
              { label: "cups of water", color: palette.b },
            ]}
            rows={Array.from({ length: rows }, (_, i) => [{ value: a * (i + 1) }, { value: b * (i + 1) }])}
            scales={Array.from({ length: rows }, (_, i) => i + 1)}
          />
          {compare && (
            <div style={{ marginTop: 12 }}>
              <RatioTable
                columns={[
                  { label: "recipe 2 scoops", color: palette.c },
                  { label: "recipe 2 cups", color: palette.c },
                ]}
                rows={Array.from({ length: 4 }, (_, i) => [{ value: c * (i + 1) }, { value: d * (i + 1) }])}
                compact
              />
            </div>
          )}
        </div>
        <div>
          <CoordinatePlane
            xMax={xMax}
            yMax={yMax}
            xStep={1}
            yStep={1}
            xLabel="scoops of mix"
            yLabel="cups of water"
            lines={[{ slope: b / a, color: palette.a, label: `${a}:${b}`, dashed: true }, ...(compare ? [{ slope: d / c, color: palette.c, label: `${c}:${d}`, dashed: true }] : [])]}
            points={[
              ...Array.from({ length: rows }, (_, i) => ({ x: a * (i + 1), y: b * (i + 1), color: palette.a, hollow: true })).filter((p) => p.x <= xMax && p.y <= yMax),
              ...points,
            ]}
            onPlot={toggle}
          />
          <p className="muted small center">Click the grid to plot your own points. Click a point again to remove it.</p>
        </div>
      </div>
      <div className="sayings">
        <Says>
          Every row is the first row times the same number. Plotted as (<QA>mix</QA>, <QB>water</QB>), the pairs land on one straight line through (0, 0).
        </Says>
        {plotted.length > 0 && (
          <Says>
            {hits} of your {plotted.length} point{plotted.length === 1 ? "" : "s"} {hits === 1 ? "is" : "are"} on the {a}:{b} line. Green points belong to the ratio; red ones don't.
          </Says>
        )}
        {compare && (
          <Says>
            The steeper line has <b>more water per scoop</b>, so it tastes weaker. Recipe 1 uses {(b / a).toFixed(2).replace(/\.?0+$/, "")} cups per scoop; <QC>recipe 2</QC> uses {(d / c).toFixed(2).replace(/\.?0+$/, "")}.{" "}
            {b / a === d / c ? "They are equivalent: same taste." : b / a < d / c ? "Recipe 1 is stronger." : "Recipe 2 is stronger."}
          </Says>
        )}
      </div>
    </div>
  );
}

interface TableScene {
  a: string;
  aShort: string;
  b: string;
  bShort: string;
  /** Overrides palette.a/b when this scene's own wording names a real color
   *  (e.g. "yellow paint") — see lib/palette.ts's itemColors. */
  colorA?: ItemColor;
  colorB?: ItemColor;
}

const tableScenes: TableScene[] = [
  { a: "scoops of lemonade mix", aShort: "scoops", b: "cups of water", bShort: "cups" },
  { a: "drops of blue paint", aShort: "blue drops", b: "drops of yellow paint", bShort: "yellow drops", colorB: itemColors.yellow },
  { a: "laps run", aShort: "laps", b: "minutes", bShort: "minutes" },
  { a: "packs of cards", aShort: "packs", b: "cards", bShort: "cards" },
];

const missingProblem = (): Problem => {
  const s = pick(tableScenes);
  let a = 1,
    b = 1;
  while (a === b || gcd(a, b) !== 1) {
    a = randInt(1, 4);
    b = randInt(2, 6);
  }
  const ks = [1, ...shuffle([2, 3, 4, 5, 6]).slice(0, 3).sort((x, y) => x - y)];
  const [, k2, k3, k4] = ks;
  const xMaxRaw = a * k4;
  const yMaxRaw = b * k4;
  const xs = niceStep(xMaxRaw, 8);
  const ys = niceStep(yMaxRaw, 8);

  return {
    title: "Fill in the ratio table",
    story: (
      <>
        The table shows equivalent ratios of <QA color={s.colorA?.text}>{s.a}</QA> to <QB color={s.colorB?.text}>{s.b}</QB>. Find the missing values, then look at the graph.
      </>
    ),
    visual: (done) => {
      const val = (n: number, known: boolean, hl = false): RatioTableCell => (known ? { value: n, highlight: hl } : { missing: true, highlight: hl });
      const rows: RatioTableCell[][] = [
        [val(a, true), val(b, true)],
        [val(a * k2, true, done === 0 || done === 1), val(b * k2, done >= 2, done === 1)],
        [val(a * k3, done >= 3, done === 2), val(b * k3, true, done === 2)],
        [val(a * k4, true, done === 3), val(b * k4, done >= 4, done === 3)],
      ];
      const known: [number, number][] = [[a, b]];
      if (done >= 2) known.push([a * k2, b * k2]);
      if (done >= 3) known.push([a * k3, b * k3]);
      if (done >= 4) known.push([a * k4, b * k4]);
      return (
        <div className="two-col">
          <RatioTable
            columns={[
              { label: s.aShort, color: s.colorA?.main ?? palette.a },
              { label: s.bShort, color: s.colorB?.main ?? palette.b },
            ]}
            rows={rows}
            scales={done >= 1 ? ks : undefined}
          />
          <CoordinatePlane
            xMax={niceMax(xMaxRaw, xs)}
            yMax={niceMax(yMaxRaw, ys)}
            xStep={xs}
            yStep={ys}
            xLabel={s.aShort}
            yLabel={s.bShort}
            width={360}
            height={310}
            points={known.map(([x, y]) => ({ x, y, color: palette.c, showLabel: done >= 4 }))}
            lines={done >= 5 ? [{ slope: b / a, color: palette.c, dashed: true }] : []}
          />
        </div>
      );
    },
    steps: [
      {
        kind: "number",
        prompt: (
          <>
            Row 2: what do you multiply <QA color={s.colorA?.text}>{a}</QA> by to get <QA color={s.colorA?.text}>{a * k2}</QA>?
          </>
        ),
        answer: k2,
        hint: `${a} × ? = ${a * k2}`,
        explain: `× ${k2}. To keep the ratio the same, both numbers in a row get multiplied by the same number.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            So what is the missing <QB color={s.colorB?.text}>{s.bShort}</QB> value in row 2?
          </>
        ),
        answer: b * k2,
        hint: `Multiply ${b} by ${k2} too.`,
        explain: `${b} × ${k2} = ${b * k2}.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            Row 3 has <QB color={s.colorB?.text}>{b * k3}</QB> {s.bShort}. How many <QA color={s.colorA?.text}>{s.aShort}</QA>?
          </>
        ),
        answer: a * k3,
        hint: `${b} became ${b * k3}. What was it multiplied by? Do the same to ${a}.`,
        explain: `${b * k3} ÷ ${b} = ${k3}, so ${a} × ${k3} = ${a * k3}.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            Row 4 has <QA color={s.colorA?.text}>{a * k4}</QA> {s.aShort}. How many <QB color={s.colorB?.text}>{s.bShort}</QB>?
          </>
        ),
        answer: b * k4,
        hint: `Find the scale factor from ${a} to ${a * k4}, then use it on ${b}.`,
        explain: `× ${k4}: ${b} × ${k4} = ${b * k4}.`,
      },
      choice(
        { prompt: "Look at the plotted pairs. What do you notice?", hint: "Lay a ruler over the points in your mind. Where would the line start?", explain: "Equivalent ratios always fall on a straight line that passes through (0, 0)." },
        "They lie on a straight line that goes through (0, 0)",
        ["They curve upward more and more", "They lie on a straight line that starts at (1, 1)", "They don't make any pattern"]
      ),
    ],
    wrapUp: (
      <>
        Every row of the table is {a}:{b} scaled up. That's why the points line up on one straight line from the origin.
      </>
    ),
  };
};

// pairs of denominators whose lcm keeps tables short
const denomPairs: [number, number][] = [
  [2, 3],
  [3, 4],
  [2, 5],
  [4, 6],
  [3, 5],
  [4, 5],
  [5, 6],
];

const compareProblem = (): Problem => {
  let [b1, b2] = pick(denomPairs);
  if (Math.random() < 0.5) [b1, b2] = [b2, b1];
  const L = lcm(b1, b2);
  let a1 = 1,
    a2 = 1;
  do {
    a1 = randInt(1, b1 + 2);
    a2 = randInt(1, b2 + 2);
  } while (a1 * b2 === a2 * b1 || gcd(a1, b1) !== 1 || gcd(a2, b2) !== 1);
  const s1 = (a1 * L) / b1;
  const s2 = (a2 * L) / b2;
  const r1 = L / b1;
  const r2 = L / b2;
  const stronger = s1 > s2 ? "Maya's" : "Leo's";
  const yMaxRaw = Math.max(s1, s2);
  const ys = niceStep(yMaxRaw, 8);
  const xs = niceStep(L, 8);

  const table = (name: string, a: number, b: number, rows: number, revealLast: boolean, color: string) => (
    <div>
      <p className="table-title" style={{ color }}>
        {name}
      </p>
      <RatioTable
        compact
        columns={[
          { label: "scoops", color: palette.a },
          { label: "cups of water", color: palette.b },
        ]}
        rows={Array.from({ length: rows }, (_, i) =>
          i === rows - 1 ? [{ value: a * (i + 1), missing: !revealLast, highlight: true }, { value: b * (i + 1), highlight: true }] : [{ value: a * (i + 1) }, { value: b * (i + 1) }]
        )}
      />
    </div>
  );

  return {
    title: "Which mix is stronger?",
    story: (
      <>
        Maya mixes <QA>{a1} scoops</QA> of drink mix with <QB>{b1} cups</QB> of water. Leo mixes <QA>{a2} scoops</QA> with <QB>{b2} cups</QB> of water. Whose drink is stronger?
      </>
    ),
    visual: (done) => (
      <>
        {done >= 1 ? (
          <div className="two-col tight">
            {table("Maya", a1, b1, r1, done >= 2, palette.c)}
            {table("Leo", a2, b2, r2, done >= 3, palette.b)}
          </div>
        ) : (
          <div className="two-col tight">
            {table("Maya", a1, b1, 1, true, palette.c)}
            {table("Leo", a2, b2, 1, true, palette.b)}
          </div>
        )}
        <CoordinatePlane
          xMax={niceMax(L, xs)}
          yMax={niceMax(yMaxRaw, ys)}
          xStep={xs}
          yStep={ys}
          xLabel="cups of water"
          yLabel="scoops of mix"
          width={380}
          height={300}
          points={[
            { x: b1, y: a1, color: palette.c },
            { x: b2, y: a2, color: palette.b },
            ...(done >= 2 ? [{ x: L, y: s1, color: palette.c, showLabel: true }] : []),
            ...(done >= 3 ? [{ x: L, y: s2, color: palette.b, showLabel: true }] : []),
          ]}
          lines={done >= 3 ? [{ slope: a1 / b1, color: palette.c, label: "Maya" }, { slope: a2 / b2, color: palette.b, label: "Leo" }] : []}
        />
      </>
    ),
    steps: [
      {
        kind: "number",
        prompt: <>To compare fairly, make the water the same. What is the smallest number of cups both tables can reach?</>,
        answer: L,
        suffix: "cups",
        hint: `List multiples of ${b1} and of ${b2}. Find the first one they share.`,
        explain: `${L} is a multiple of both ${b1} and ${b2}.`,
      },
      {
        kind: "number",
        prompt: <>With {L} cups of water, how many scoops does Maya use?</>,
        answer: s1,
        suffix: "scoops",
        hint: `${b1} × ${r1} = ${L}, so multiply ${a1} by ${r1} too.`,
        explain: `${a1} × ${r1} = ${s1} scoops for ${L} cups.`,
      },
      {
        kind: "number",
        prompt: <>With {L} cups of water, how many scoops does Leo use?</>,
        answer: s2,
        suffix: "scoops",
        hint: `${b2} × ${r2} = ${L}, so multiply ${a2} by ${r2} too.`,
        explain: `${a2} × ${r2} = ${s2} scoops for ${L} cups.`,
      },
      choice(
        { prompt: "Whose drink is stronger?", hint: "Same water. Who used more mix?", explain: `With the same ${L} cups of water, ${stronger} drink has more scoops. On the graph, the stronger mix has the steeper line.` },
        `${stronger} drink`,
        [s1 > s2 ? "Leo's drink" : "Maya's drink", "They taste the same"]
      ),
    ],
    wrapUp: (
      <>
        Maya {s1}:{L}, Leo {s2}:{L}. With the water equal, {stronger} mix has more scoops, so it's stronger.
      </>
    ),
  };
};

export const tablesGraphs: Unit = {
  id: "tables-graphs",
  title: "Tables & graphs",
  goal: "Build tables of equivalent ratios, find missing values, graph them, and compare",
  standard: "6.RP.A.3a",
  keyIdea: (
    <>
      <p>
        Multiply both numbers of a ratio by the same number and you get an <b>equivalent ratio</b>: 2:3, 4:6, 6:9 all describe the same mix. A table lists them in rows.
      </p>
      <p>Plot each row as a point (x, y). Equivalent ratios always land on one straight line through (0, 0).</p>
    </>
  ),
  Explore,
  problems: [
    { label: "Missing values", make: missingProblem },
    { label: "Compare two ratios", make: compareProblem },
  ],
  test: tablesGraphsTest,
};
