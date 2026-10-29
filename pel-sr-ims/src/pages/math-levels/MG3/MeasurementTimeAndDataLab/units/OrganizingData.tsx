import { useEffect, useState } from "react";
import { DataChart, MixedScatter, type Category, type MixedItem } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { organizingDataTest } from "./OrganizingDataTest";

interface Theme {
  cats: { label: string; glyph: string }[];
}

const THEMES: Theme[] = [
  { cats: [{ label: "Apples", glyph: "🍎" }, { label: "Bananas", glyph: "🍌" }, { label: "Grapes", glyph: "🍇" }] },
  { cats: [{ label: "Cats", glyph: "🐱" }, { label: "Dogs", glyph: "🐶" }, { label: "Birds", glyph: "🐦" }] },
  { cats: [{ label: "Circles", glyph: "🔵" }, { label: "Squares", glyph: "🟧" }, { label: "Stars", glyph: "⭐" }] },
];

const randomTheme = () => THEMES[randInt(0, THEMES.length - 1)];
const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const CFU_THEME = THEMES[0]; // Apples/Bananas/Grapes — fixed across the CFU so every question refers back to the same chart.
const CFU_COUNTS = [5, 3, 2]; // Apples=5, Bananas=3, Grapes=2

function cfuChart(): Category[] {
  return CFU_THEME.cats.map((c, i) => ({ label: c.label, glyph: c.glyph, count: CFU_COUNTS[i], tone: (["a", "b", "c"] as const)[i] }));
}

/** Vocabulary: what one row of a picture graph actually represents. */
function RowMeaningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "oneEach";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Here's a picture graph sorting a basket of fruit into categories.
      </p>
      <DataChart categories={cfuChart()} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What does each icon in the Apples row represent?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="oneEach">One actual apple — one icon for every apple in the basket</option>
            <option value="group">A whole group of apples, however many that is</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — every icon stands for exactly one real apple, so counting the icons in a row tells you exactly how many apples there are." : "Not quite — each icon stands for ONE apple, not a whole group. Counting the icons in a row gives you the exact count for that category."}
        </p>
      )}
    </div>
  );
}

/** REQUIRED: the "how many more" misconception, explicit — answering with
 *  one category's raw count instead of the actual difference. */
function HowManyMoreQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "2";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Using the same chart: how many MORE apples are there than grapes?
      </p>
      <DataChart categories={cfuChart()} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Jada answers "5". Is she right? How many more apples are there than grapes, really?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="5">5 — that's how many apples there are</option>
            <option value="2">2 — the difference between 5 apples and 2 grapes</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — Jada just restated how many apples there are. \"How many MORE\" asks for the DIFFERENCE: 5 apples take away 2 grapes leaves 2."
            : "Not quite — Jada answered with the apple count alone, which is a common mix-up. \"How many more\" means the DIFFERENCE between the two counts: 5 − 2 = 2."}
        </p>
      )}
    </div>
  );
}

/** REQUIRED: the 3-category combined-total question, making sure the
 *  student doesn't just look at two of the three categories. */
function CombinedTotalQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "10";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Using the same chart again: how many pieces of fruit are there IN ALL — apples, bananas, AND grapes combined?
      </p>
      <DataChart categories={cfuChart()} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Total, all three categories together:{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="8">8 — just apples and bananas</option>
            <option value="10">10 — apples, bananas, AND grapes</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 5 apples + 3 bananas + 2 grapes = 10. A combined total question like this needs EVERY category added in, not just the first two you look at."
            : "Not quite — 8 only counts apples and bananas. Don't forget the grapes: 5 + 3 + 2 = 10 altogether."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap restating the "how many more" shortcut
 *  misconception as a general rule. */
function ShortcutTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: to answer a "how many more" question, you only ever need to look at the bigger category's count.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — \"how many more\" always needs BOTH counts, subtracted. The bigger category's count alone (like Jada's \"5\") is never the full answer."
            : "Not quite — remember Jada's apples-and-grapes answer. You always need both counts and the difference between them, not just the bigger one."}
        </p>
      )}
    </div>
  );
}

function DataCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ row: false, howManyMore: false, total: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure reading a chart makes sense before you try practice problems.</p>
      <RowMeaningQuestion onComplete={mark("row")} />
      <HowManyMoreQuestion onComplete={mark("howManyMore")} />
      <CombinedTotalQuestion onComplete={mark("total")} />
      <ShortcutTrapQuestion onComplete={mark("trap")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [theme, setTheme] = useState<Theme>(THEMES[2]);
  const [counts, setCounts] = useState<number[]>([4, 3, 2]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [showChart, setShowChart] = useState(false);

  const newRound = () => {
    const t = THEMES[randInt(0, THEMES.length - 1)];
    const c = [randInt(1, 6), randInt(1, 6), randInt(1, 6)];
    setTheme(t);
    setCounts(c);
    setSorted([]);
    setShowChart(false);
  };

  // The raw, scattered, uncategorized items the student sorts by clicking —
  // directly previews what a category chart is built FROM.
  const rawItems: MixedItem[] = shuffle(
    theme.cats.flatMap((c, ci) => Array.from({ length: counts[ci] }, () => ({ glyph: c.glyph, tone: (["a", "b", "c"] as const)[ci] })))
  );
  const total = counts.reduce((s, n) => s + n, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <button className="btn ghost" onClick={newRound}>
          New mixed group
        </button>
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
      {(introActive || showCheck) && <DataCheckForUnderstanding onComplete={onIntroDone} />}

      {!showChart ? (
        <>
          <p className="muted small">Click each item below to sort it — watch the tally for its category go up.</p>
          <MixedScatter items={rawItems} seed={counts[0] * 97 + counts[1] * 13 + counts[2]} sortedIndices={sorted} onToggle={(i) => setSorted((s) => (s.includes(i) ? s : [...s, i]))} />
          <div className="control-row">
            {theme.cats.map((c) => {
              const sortedCount = sorted.filter((i) => rawItems[i].glyph === c.glyph).length;
              return (
                <span key={c.label} className="data-tally">
                  {c.glyph} {c.label}: {sortedCount}
                </span>
              );
            })}
          </div>
          {sorted.length === rawItems.length && (
            <button className="btn primary" style={{ width: "fit-content" }} onClick={() => setShowChart(true)}>
              Show as a chart
            </button>
          )}
        </>
      ) : (
        <>
          <p className="muted small">Sorted into a chart — one row per category, one icon per item.</p>
          <DataChart categories={theme.cats.map((c, i) => ({ label: c.label, glyph: c.glyph, count: counts[i], tone: (["a", "b", "c"] as const)[i] }))} />
          <div className="control-row">
            {theme.cats.map((c, i) => (
              <Stepper key={c.label} label={c.label} value={counts[i]} min={0} max={9} onChange={(v) => setCounts((arr) => arr.map((x, j) => (j === i ? v : x)))} tone={(["a", "b", "c"] as const)[i]} />
            ))}
          </div>
          <p className="feedback good">
            {theme.cats.map((c, i) => `${c.label}: ${counts[i]}`).join(", ")} — {total} in all.
          </p>
          <button className="btn ghost" style={{ width: "fit-content" }} onClick={() => setShowChart(false)}>
            Back to sorting
          </button>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "sortRaw" | "read2CatHowMany" | "read3CatHowManyMore" | "read3CatTotal";
const BUCKETS: Bucket[] = ["sortRaw", "read2CatHowMany", "read3CatHowManyMore", "read3CatTotal"];

function sortRawProblem(): Problem {
  const theme = randomTheme();
  const counts = [randInt(2, 5), randInt(2, 5), randInt(2, 5)];
  const items: MixedItem[] = shuffle(theme.cats.flatMap((c, ci) => Array.from({ length: counts[ci] }, () => ({ glyph: c.glyph, tone: (["a", "b", "c"] as const)[ci] }))));
  const seed = counts[0] * 41 + counts[1] * 11 + counts[2] * 3 + theme.cats[0].glyph.codePointAt(0)!;
  return {
    title: "Sort the mixed group",
    bucket: "sortRaw",
    story: "Before you can chart this group, sort it by type and count each category.",
    visual: () => <MixedScatter items={items} seed={seed} />,
    steps: theme.cats.map((c, i) => ({
      kind: "number" as const,
      prompt: `How many ${c.label.toLowerCase()} (${c.glyph}) are in this group?`,
      hint: "Look only for that one type, ignoring the others.",
      explain: `There are ${counts[i]} ${c.label.toLowerCase()}.`,
      answer: counts[i],
    })),
    wrapUp: `Sorted: ${theme.cats.map((c, i) => `${c.label} ${counts[i]}`).join(", ")}.`,
  };
}

function read2CatProblem(): Problem {
  const theme = randomTheme();
  const [catA, catB] = shuffle(theme.cats).slice(0, 2);
  const countA = randInt(2, 9);
  const countB = randInt(2, 9);
  const categories: Category[] = [
    { label: catA.label, glyph: catA.glyph, count: countA, tone: "a" },
    { label: catB.label, glyph: catB.glyph, count: countB, tone: "b" },
  ];
  const askFirst = Math.random() < 0.5;
  const [askCat, askCount] = askFirst ? [catA, countA] : [catB, countB];
  const [otherCat, otherCount] = askFirst ? [catB, countB] : [catA, countA];
  return {
    title: "Read the chart — 2 categories",
    bucket: "read2CatHowMany",
    story: "This chart has 2 categories.",
    visual: () => <DataChart categories={categories} />,
    steps: [
      { kind: "number", prompt: `How many ${askCat.label.toLowerCase()} are there?`, hint: "Count the icons in that row.", explain: `There are ${askCount} ${askCat.label.toLowerCase()}.`, answer: askCount },
      { kind: "number", prompt: `How many ${otherCat.label.toLowerCase()} are there?`, hint: "Count the icons in that row.", explain: `There are ${otherCount} ${otherCat.label.toLowerCase()}.`, answer: otherCount },
    ],
    wrapUp: `${catA.label}: ${countA}, ${catB.label}: ${countB}.`,
  };
}

function read3CatHowManyMoreProblem(): Problem {
  const theme = randomTheme();
  let counts = [randInt(2, 9), randInt(2, 9), randInt(2, 9)];
  // Guarantee the two compared categories aren't tied, so "how many more"
  // always has a nonzero, unambiguous answer.
  while (counts[0] === counts[1]) counts = [randInt(2, 9), randInt(2, 9), randInt(2, 9)];
  const categories: Category[] = theme.cats.map((c, i) => ({ label: c.label, glyph: c.glyph, count: counts[i], tone: (["a", "b", "c"] as const)[i] }));
  const [bigIdx, smallIdx] = counts[0] > counts[1] ? [0, 1] : [1, 0];
  const diff = counts[bigIdx] - counts[smallIdx];
  const bigCat = theme.cats[bigIdx];
  const smallCat = theme.cats[smallIdx];
  return {
    title: "Read the chart — how many more?",
    bucket: "read3CatHowManyMore",
    story: "This chart has 3 categories.",
    visual: () => <DataChart categories={categories} />,
    steps: [
      {
        kind: "number",
        prompt: `How many MORE ${bigCat.label.toLowerCase()} are there than ${smallCat.label.toLowerCase()}?`,
        hint: `Don't just answer with how many ${bigCat.label.toLowerCase()} there are — find the DIFFERENCE between the two counts.`,
        explain: `${counts[bigIdx]} ${bigCat.label.toLowerCase()} minus ${counts[smallIdx]} ${smallCat.label.toLowerCase()} is ${diff}.`,
        answer: diff,
      },
      {
        kind: "number",
        prompt: `How many FEWER ${smallCat.label.toLowerCase()} are there than ${bigCat.label.toLowerCase()}?`,
        hint: "This is the same difference, just asked from the other side.",
        explain: `It's still a difference of ${diff}.`,
        answer: diff,
      },
    ],
    wrapUp: `${bigCat.label} has ${diff} more than ${smallCat.label}.`,
  };
}

function read3CatTotalProblem(): Problem {
  const theme = randomTheme();
  const counts = [randInt(1, 6), randInt(1, 6), randInt(1, 6)];
  const categories: Category[] = theme.cats.map((c, i) => ({ label: c.label, glyph: c.glyph, count: counts[i], tone: (["a", "b", "c"] as const)[i] }));
  const total = counts.reduce((s, n) => s + n, 0);
  return {
    title: "Read the chart — total",
    bucket: "read3CatTotal",
    story: "This chart has 3 categories.",
    visual: () => <DataChart categories={categories} />,
    steps: [
      {
        kind: "number",
        prompt: "How many are there IN ALL — every category combined?",
        hint: "Add up all three counts, not just the first two.",
        explain: `${counts[0]} + ${counts[1]} + ${counts[2]} = ${total}.`,
        answer: total,
      },
      {
        kind: "number",
        prompt: `If 2 more ${theme.cats[0].label.toLowerCase()} were added, what would the new total be?`,
        hint: "Add 2 to the total you just found.",
        explain: `${total} + 2 = ${total + 2}.`,
        answer: total + 2,
      },
    ],
    wrapUp: `${counts[0]} + ${counts[1]} + ${counts[2]} = ${total} in all.`,
  };
}

function dataProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "sortRaw") return sortRawProblem();
  if (bucket === "read2CatHowMany") return read2CatProblem();
  if (bucket === "read3CatHowManyMore") return read3CatHowManyMoreProblem();
  return read3CatTotalProblem();
}

export const organizingData: Unit = {
  id: "organizingData",
  title: "Organizing and Interpreting Data",
  goal: "Sort information into up to 3 categories, show it in a simple chart, and answer questions about which category has more, less, or the combined total.",
  standard: "1.MD.4",
  keyIdea: (
    <>
      <p>A picture graph sorts items into categories, with one icon per item — counting a row's icons tells you exactly how many are in that category.</p>
      <p>"How many more" always means the DIFFERENCE between two counts, never just the bigger count by itself — and a combined total needs EVERY category added in.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoned through per-chart each time — not a memorized fact.
  problems: [{ label: "Sort & Read Charts", make: dataProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: organizingDataTest,
};
