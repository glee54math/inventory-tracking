import React, { useState } from "react";
import { RatioGroups, TapeDiagram } from "../diagrams";
import type { ShapeKind } from "../diagrams";
import { palette, itemColors } from "../../shared/lib/palette";
import type { ItemColor } from "../../shared/lib/palette";
import { gcd, pick, randInt, simplify } from "../../shared/lib/math";
import { choice, type Problem } from "../../shared/engine/types";
import { QA, QB, QC, Says, Segmented, Stepper } from "../../shared/engine/controls";
import { ratioLanguageTest } from "./RatioLanguageTest";
import type { Unit } from "../../shared/units/types";

interface Scene {
  id: string;
  name: string;
  where: string;
  a: string;
  b: string;
  /** singular forms */
  aOne: string;
  bOne: string;
  sa: ShapeKind;
  sb: ShapeKind;
  a1: number;
  b1: number;
  groups: number;
  groupWord: string;
}

const scenes: Scene[] = [
  { id: "birds", name: "Bird house", where: "In the bird house at the zoo", a: "wings", b: "beaks", aOne: "wing", bOne: "beak", sa: "triangle", sb: "diamond", a1: 2, b1: 1, groups: 4, groupWord: "bird" },
  { id: "votes", name: "Class vote", where: "In the class election", a: "votes for A", b: "votes for C", aOne: "vote for A", bOne: "vote for C", sa: "square", sb: "circle", a1: 1, b1: 3, groups: 4, groupWord: "batch" },
  { id: "stickers", name: "Stickers", where: "On a sticker sheet", a: "stars", b: "hearts", aOne: "star", bOne: "heart", sa: "star", sb: "heart", a1: 3, b1: 2, groups: 3, groupWord: "row" },
  { id: "tiles", name: "Tiles", where: "In a tile pattern", a: "squares", b: "hexagons", aOne: "square", bOne: "hexagon", sa: "square", sb: "hexagon", a1: 2, b1: 3, groups: 3, groupWord: "repeat" },
];

function Explore() {
  const [sceneId, setSceneId] = useState(scenes[0].id);
  const scene = scenes.find((s) => s.id === sceneId)!;
  const [a1, setA1] = useState(scene.a1);
  const [b1, setB1] = useState(scene.b1);
  const [groups, setGroups] = useState(scene.groups);
  const [swap, setSwap] = useState(false);
  const [showOne, setShowOne] = useState(false);

  const choose = (id: string) => {
    const s = scenes.find((x) => x.id === id)!;
    setSceneId(id);
    setA1(s.a1);
    setB1(s.b1);
    setGroups(s.groups);
  };

  const A = { name: scene.a, one: scene.aOne, n: a1 };
  const B = { name: scene.b, one: scene.bOne, n: b1 };
  const [first, second] = swap ? [B, A] : [A, B];
  const W1 = swap ? QB : QA;
  const W2 = swap ? QA : QB;
  const [sa, sb] = simplify(a1 * groups, b1 * groups);
  const total = (a1 + b1) * groups;

  return (
    <div className="explore">
      <div className="controls">
        <Segmented label="Scene" options={scenes.map((s) => ({ id: s.id, label: s.name }))} value={sceneId} onChange={choose} />
        <div className="control-row">
          <Stepper tone="a" label={<>{scene.a} per group</>} value={a1} min={0} max={6} onChange={setA1} />
          <Stepper tone="b" label={<>{scene.b} per group</>} value={b1} min={0} max={6} onChange={setB1} />
          <Stepper tone="c" label="groups" value={groups} min={1} max={8} onChange={setGroups} />
        </div>
        <div className="control-row">
          <button className="btn ghost" onClick={() => setSwap((s) => !s)}>
            Switch the order
          </button>
          <button className={`btn ghost ${showOne ? "pressed" : ""}`} aria-pressed={showOne} onClick={() => setShowOne((s) => !s)}>
            Highlight one group
          </button>
        </div>
      </div>
      <div className="stage">
        <RatioGroups
          groups={groups}
          a={{ count: a1, kind: scene.sa, color: palette.a, label: scene.a }}
          b={{ count: b1, kind: scene.sb, color: palette.b, label: scene.b }}
          highlightGroup={showOne ? 0 : null}
        />
        <div className="legend">
          <span className="key qa-bg" /> {scene.a} <span className="key qb-bg" /> {scene.b}
        </div>
      </div>
      <div className="sayings">
        <Says>
          {scene.where}, the ratio of <W1>{first.name}</W1> to <W2>{second.name}</W2> is{" "}
          <b>
            {first.n * groups}:{second.n * groups}
          </b>
          .
        </Says>
        {a1 > 0 && b1 > 0 && (
          <Says>
            For every <W1>{first.n} {first.n === 1 ? first.one : first.name}</W1> there {second.n === 1 ? "is" : "are"} <W2>{second.n} {second.n === 1 ? second.one : second.name}</W2>. That's the same as{" "}
            <b>
              {first.n}:{second.n}
            </b>
            {gcd(first.n, second.n) > 1 ? (
              <>
                , or{" "}
                <b>
                  {swap ? sb : sa}:{swap ? sa : sb}
                </b>{" "}
                in simplest form
              </>
            ) : null}
            .
          </Says>
        )}
        <Says>
          Part to whole: <QA>{scene.a}</QA> to <QC>all {total} objects</QC> is{" "}
          <b>
            {a1 * groups}:{total}
          </b>
          .
        </Says>
        {swap && <p className="muted small">Notice the numbers switched places when the words did. Order matters.</p>}
      </div>
    </div>
  );
}

// ---------- practice problems ----------

interface GroupScene {
  where: string;
  a: string;
  aOne: string;
  b: string;
  bOne: string;
  sa: ShapeKind;
  sb: ShapeKind;
  /** Overrides palette.a/b when this scene's own wording names a real color
   *  (e.g. "yellow marbles") — see lib/palette.ts's itemColors. */
  colorA?: ItemColor;
  colorB?: ItemColor;
}

const groupScenes: GroupScene[] = [
  { where: "In a bag of marbles", a: "blue marbles", aOne: "blue marble", b: "yellow marbles", bOne: "yellow marble", sa: "circle", sb: "circle", colorB: itemColors.yellow },
  { where: "On a sticker sheet", a: "stars", aOne: "star", b: "hearts", bOne: "heart", sa: "star", sb: "heart" },
  { where: "In a tile pattern", a: "squares", aOne: "square", b: "triangles", bOne: "triangle", sa: "square", sb: "triangle" },
  { where: "At the class party", a: "cookies", aOne: "cookie", b: "juice boxes", bOne: "juice box", sa: "circle", sb: "square" },
  { where: "In a garden bed", a: "tulips", aOne: "tulip", b: "daisies", bOne: "daisy", sa: "diamond", sb: "star" },
];

const countProblem = (): Problem => {
  const s = pick(groupScenes);
  let a = 1,
    b = 1;
  while (a === b || gcd(a, b) !== 1) {
    a = randInt(1, 5);
    b = randInt(1, 5);
  }
  const g = randInt(2, 4);
  const [ta, tb] = [a * g, b * g];
  return {
    title: "Count it, then say it",
    story: (
      <>
        {s.where}, the objects come in matching groups. Use the picture to describe the ratio of <QA color={s.colorA?.text}>{s.a}</QA> to <QB color={s.colorB?.text}>{s.b}</QB>.
      </>
    ),
    visual: (done) => (
      <RatioGroups
        groups={g}
        a={{ count: a, kind: s.sa, color: s.colorA?.main ?? palette.a, label: s.a }}
        b={{ count: b, kind: s.sb, color: s.colorB?.main ?? palette.b, label: s.b }}
        focus={done === 0 ? "a" : done === 1 ? "b" : null}
        highlightGroup={done === 3 || done === 5 ? 0 : null}
        showGroupLabels={done >= 4}
      />
    ),
    steps: [
      {
        kind: "number",
        prompt: (
          <>
            How many <QA color={s.colorA?.text}>{s.a}</QA> are there in all?
          </>
        ),
        answer: ta,
        hint: `Count one box, then multiply by the number of boxes (${g}).`,
        explain: `${g} groups × ${a} each = ${ta}.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            How many <QB color={s.colorB?.text}>{s.b}</QB> are there in all?
          </>
        ),
        answer: tb,
        hint: `Each box has ${b}. There are ${g} boxes.`,
        explain: `${g} groups × ${b} each = ${tb}.`,
      },
      {
        kind: "ratio",
        prompt: (
          <>
            Write the ratio of <QA color={s.colorA?.text}>{s.a}</QA> to <QB color={s.colorB?.text}>{s.b}</QB> using the totals.
          </>
        ),
        answer: [ta, tb],
        labels: [s.a, s.b],
        hint: `The quantity named first goes first: ${s.a}, then ${s.b}.`,
        explain: (
          <>
            {ta}:{tb}. "{s.a} to {s.b}" means {s.a} first.
          </>
        ),
      },
      {
        kind: "ratio",
        prompt: <>Now look at just one group. Finish the sentence.</>,
        frame: ["For every", `${a === 1 ? s.aOne : s.a}, there ${b === 1 ? "is" : "are"}`, `${b === 1 ? s.bOne : s.b}.`],
        answer: [a, b],
        labels: [s.a, s.b],
        hint: "Count the shapes inside the highlighted box only.",
        explain: (
          <>
            {ta}:{tb} and {a}:{b} are equivalent ratios. Each group is a smaller copy of the whole picture, so you can divide both totals by {g}.
          </>
        ),
      },
      choice(
        {
          prompt: (
            <>
              What is the ratio of <QB color={s.colorB?.text}>{s.b}</QB> to <QA color={s.colorA?.text}>{s.a}</QA>?
            </>
          ),
          hint: "Which word comes first this time?",
          explain: "Switching the order of the words switches the order of the numbers.",
        },
        `${b}:${a}`,
        [`${a}:${b}`, `${b}:${a + b}`, `${a + b}:${b}`]
      ),
      {
        kind: "ratio",
        prompt: (
          <>
            In one group, what is the ratio of <QA color={s.colorA?.text}>{s.a}</QA> to <QC>all the objects</QC>?
          </>
        ),
        answer: [a, a + b],
        labels: [s.a, "all objects"],
        tones: ["a", "c"],
        equivalentHint: "That's an equivalent ratio, but re-read the question — it's asking about ONE group only. Use the numbers from a single group, not a scaled-up version.",
        hint: `All the objects = ${s.a} + ${s.b} in one group.`,
        explain: (
          <>
            {a}:{a + b}. This is a part-to-whole ratio: {a} out of every {a + b} objects are {s.a}.
          </>
        ),
      },
    ],
    wrapUp: (
      <>
        The ratio of <QA color={s.colorA?.text}>{s.a}</QA> to <QB color={s.colorB?.text}>{s.b}</QB> is {a}:{b} — for every {a} {a === 1 ? s.aOne : s.a} there {b === 1 ? "is" : "are"} {b} {b === 1 ? s.bOne : s.b}.
      </>
    ),
  };
};

interface GroupWordScene {
  place: string;
  a: string;
  aOne: string;
  aShort: string;
  b: string;
  bOne: string;
  bShort: string;
  whole: string;
  /** Overrides palette.a/b when this scene's own wording names a real color
   *  (e.g. "red apples") — see lib/palette.ts's itemColors. */
  colorA?: ItemColor;
  colorB?: ItemColor;
}

const groupWordScenes: GroupWordScene[] = [
  { place: "A class", a: "boys", aOne: "boy", aShort: "boys", b: "girls", bOne: "girl", bShort: "girls", whole: "students" },
  { place: "An animal shelter", a: "dogs", aOne: "dog", aShort: "dogs", b: "cats", bOne: "cat", bShort: "cats", whole: "animals" },
  { place: "A fruit bowl", a: "red apples", aOne: "red apple", aShort: "red", b: "green apples", bOne: "green apple", bShort: "green", whole: "apples", colorA: itemColors.red, colorB: itemColors.green },
  { place: "A bookshelf", a: "fiction books", aOne: "fiction book", aShort: "fiction", b: "nonfiction books", bOne: "nonfiction book", bShort: "nonfiction", whole: "books" },
];

const wordProblem = (): Problem => {
  const s = pick(groupWordScenes);
  let a = 1,
    b = 1;
  while (a === b || gcd(a, b) !== 1) {
    a = randInt(1, 5);
    b = randInt(2, 6);
  }
  const k = randInt(2, 6);
  const [ta, tb] = [a * k, b * k];
  return {
    title: "Ratio language in a story",
    story: (
      <>
        {s.place} has <QA color={s.colorA?.text}>
          {ta} {s.a}
        </QA>{" "}
        and <QB color={s.colorB?.text}>
          {tb} {s.b}
        </QB>
        .
      </>
    ),
    visual: (done) => (
      <TapeDiagram
        tapes={[
          { label: s.aShort, units: a, color: s.colorA?.main ?? palette.a, softColor: s.colorA?.soft ?? palette.aSoft, values: done >= 2 ? Array(a).fill(k) : [], total: String(ta) },
          { label: s.bShort, units: b, color: s.colorB?.main ?? palette.b, softColor: s.colorB?.soft ?? palette.bSoft, values: done >= 2 ? Array(b).fill(k) : [], total: String(tb) },
        ]}
        unitWidth={48}
      />
    ),
    steps: [
      {
        kind: "ratio",
        prompt: (
          <>
            Write the ratio of <QA color={s.colorA?.text}>{s.a}</QA> to <QB color={s.colorB?.text}>{s.b}</QB>.
          </>
        ),
        answer: [ta, tb],
        labels: [s.a, s.b],
        hint: "Use the numbers from the story, in the order the words are named.",
        explain: `${ta}:${tb}`,
      },
      {
        kind: "ratio",
        prompt: <>Write it in simplest form. Each block in the tape diagram is the same size.</>,
        answer: [a, b],
        labels: [s.a, s.b],
        equivalentHint: "That ratio is correct, but it's not fully simplified yet. Divide both numbers by their greatest common factor.",
        hint: `Find the biggest number that divides both ${ta} and ${tb}.`,
        explain: (
          <>
            Both divide by {k}: {ta} ÷ {k} = {a} and {tb} ÷ {k} = {b}. Each block stands for {k} {s.whole}.
          </>
        ),
      },
      choice(
        { prompt: "Which sentence describes the ratio correctly?", hint: `"For every" talks about a repeating group, not the total.`, explain: `There are ${ta} ${s.a} in all, but they come ${a} for every ${b} ${s.b}.` },
        `For every ${a} ${a === 1 ? s.aOne : s.a}, there are ${b} ${s.b}.`,
        [`For every ${a} ${a === 1 ? s.bOne : s.b}, there are ${b} ${s.a}.`, `There are only ${a} ${s.a} and ${b} ${s.b} in all.`, `For every ${ta} ${s.a}, there are ${b} ${s.b}.`]
      ),
      {
        kind: "ratio",
        prompt: (
          <>
            What is the ratio of <QB color={s.colorB?.text}>{s.b}</QB> to <QC>all {s.whole}</QC>, in simplest form?
          </>
        ),
        answer: [b, a + b],
        labels: [s.b, `all ${s.whole}`],
        tones: ["b", "c"],
        equivalentHint: "That ratio is correct, but it's not fully simplified yet. Divide both numbers by their greatest common factor.",
        hint: `Count blocks: ${s.b} blocks compared with all the blocks.`,
        explain: (
          <>
            {b} of the {a + b} blocks are {s.b}, so the ratio is {b}:{a + b} (that's {tb}:{ta + tb} using totals).
          </>
        ),
      },
    ],
    wrapUp: (
      <>
        {s.place}: for every {a} {a === 1 ? s.aOne : s.a} there are {b} {s.b}, and {b} out of every {a + b} {s.whole} are {s.b}.
      </>
    ),
  };
};

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <RatioGroups groups={3} a={{ count: 3, kind: "star", color: palette.a, label: "stars" }} b={{ count: 2, kind: "heart", color: palette.b, label: "hearts" }} maxWidth={240} cell={30} />;
}

export const ratioLanguage: Unit = {
  id: "ratio-language",
  title: "Ratio language",
  goal: "Describe how two amounts compare using “to”, “for every” and “:”",
  standard: "6.RP.A.1",
  keyIdea: (
    <>
      <p>
        A <b>ratio</b> compares two amounts. In the bird house, every bird has <QA>2 wings</QA> and <QB>1 beak</QB>, so the ratio of wings to beaks is <b>2:1</b> — for every 2 wings there is 1 beak.
      </p>
      <p>The order of the words tells you the order of the numbers. Beaks to wings is 1:2.</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [
    { label: "Picture groups", make: countProblem },
    { label: "Word problem", make: wordProblem },
  ],
  test: ratioLanguageTest,
};
