import { useState, type ReactNode } from "react";
import { ShapeGlyph, SHAPE_KINDS, SHAPE_LABELS, type ShapeKind } from "../diagrams/Shape2D";
import { SolidGlyph, SOLID_KINDS, SOLID_LABELS, SOLID_CLUE, type SolidKind } from "../diagrams/Solid3D";
import { CanEndTraced, SolidThingPicture, SOLID_THINGS, SOLID_THING_SHAPE, SOLID_THING_NAME, type SolidThing } from "../diagrams/RealObjects";
import { countAlongMs, countAlongText } from "../diagrams/countAlong";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, pictureChoice, type Problem, type Step } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { flatOrSolidTest } from "./FlatOrSolidTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";
import { helping, showing, shownStep } from "./labParts";

// Unit 2 teaches the idea, not a drawing cue (review C1-23): a flat shape is
// like a drawing on paper; a solid shape is a thing you can pick up. Real
// things stand beside the solids. Some flat shapes have a soft fill and some
// solids are plain line drawings, so "shaded = solid" never works. All the
// shapes in one question are one color (review C1-08).

type Tone = "a" | "b" | "c";

/** The real thing each solid is like (Explore and Practice help). */
const LIKE: Record<SolidKind, SolidThing> = { sphere: "ball", cube: "block", cylinder: "can", cone: "hat" };

/** One item in a row of flat and solid shapes. */
interface RowItem {
  flat?: ShapeKind;
  solid?: SolidKind;
  /** soft fill (flat) or plain line drawing (solid) */
  alt?: boolean;
}
const isSolid = (it: RowItem) => !!it.solid;

/** A row of flat and solid shapes, all one color. `ring` circles the asked
 *  kind (help, no numbers); `number` numbers them (Show me). */
function MixRow({ items, tone, ring, number, tags = false }: { items: RowItem[]; tone: Tone; ring?: "flat" | "solid"; number?: "flat" | "solid"; tags?: boolean }) {
  let k = 0;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end" }}>
      {items.map((it, i) => {
        const kind = isSolid(it) ? "solid" : "flat";
        const marked = ring === kind || number === kind;
        if (number === kind) k += 1;
        return (
          <div key={i} style={{ width: 84, position: "relative", borderRadius: 14, outline: marked ? "3px dashed var(--qc)" : undefined, outlineOffset: 2 }}>
            {it.solid ? <SolidGlyph kind={it.solid} tone={tone} plain={it.alt} label={`shape ${i + 1}`} /> : <ShapeGlyph kind={it.flat!} tone={tone} soft={it.alt} label={`shape ${i + 1}`} />}
            {number === kind && (
              <span aria-hidden style={{ position: "absolute", top: 2, left: 6, fontWeight: 800, fontSize: 20 }}>
                {k}
              </span>
            )}
            {tags && (
              <p className="small" style={{ textAlign: "center", margin: 0 }}>
                {kind}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** A flat shape drawn on a sheet of paper (help: "it is like a drawing"). */
function OnPaper({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: 170, padding: 10, background: "#fffdf5", border: "2px solid var(--line)", borderRadius: 6, boxShadow: "3px 3px 0 var(--line)" }}>
      {children}
    </div>
  );
}

/** A solid beside the real thing it is like (help: "you can pick it up"). */
function WithThing({ kind, tone, children }: { kind: SolidKind; tone: Tone; children: ReactNode }) {
  return (
    <div className="control-row" style={{ alignItems: "center" }}>
      <div style={{ width: 160 }}>{children}</div>
      <div style={{ width: 110 }}>
        <SolidThingPicture thing={LIKE[kind]} tone={tone} label="a real thing" />
      </div>
    </div>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K-1 design, one question at a time, 2 of 5 typed. Q1 and Q4 have twins with
// the same kind of answer (review C1-03). Every question has a "Look here"
// pointer (review C1-01). Explore opens on a triangle and a cone, and its row
// has 4 solids and 1 flat, so it never shows a CFU answer.

const LOOK = {
  pair: { target: "u2-pair", label: "Explore: flat or solid", say: "Look here. Which one can you pick up?" },
  row: { target: "u2-row", label: "Explore: some flat, some solid", say: "Look here. Some are flat. Some are solid." },
  solid: { target: "u2-solid", label: "Explore: the solid shapes", say: "Look here. Look at each solid." },
};

const CFU_ROW: RowItem[] = [{ solid: "cube" }, { flat: "circle" }, { solid: "cone" }, { flat: "square" }, { solid: "cylinder" }];
const pair = (a: ReactNode, b: ReactNode) => (
  <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
    <div style={{ width: 110 }}>{a}</div>
    <div style={{ width: 110 }}>{b}</div>
  </div>
);
const one = (n: ReactNode) => <div style={{ width: 130 }}>{n}</div>;

function FlatOrSolidCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="Which can you pick up? The circle or the sphere?"
            picture={pair(<ShapeGlyph kind="circle" tone="a" label="a flat round shape" />, <SolidGlyph kind="sphere" tone="a" label="a solid round shape" />)}
            showPicture={<WithThing kind="sphere" tone="a"><SolidGlyph kind="sphere" tone="a" label="a solid round shape" /></WithThing>}
            showText="A sphere is solid, like a ball. A circle is flat."
            options={[
              { id: "flat", label: "Circle" },
              { id: "solid", label: "Sphere" },
            ]}
            answer="solid"
            why={{ flat: "Flat shapes are like drawings. Look again." }}
            praise="Yes! A sphere is solid, like a ball."
            look={LOOK.pair}
            twin={{
              prompt: "Which can you pick up? The square or the cube?",
              picture: pair(<SolidGlyph kind="cube" tone="a" label="a solid shape" />, <ShapeGlyph kind="square" tone="a" label="a flat shape" />),
              showPicture: <WithThing kind="cube" tone="a"><SolidGlyph kind="cube" tone="a" label="a solid shape" /></WithThing>,
              options: [
                { id: "flat", label: "Square" },
                { id: "solid", label: "Cube" },
              ],
              answer: "solid",
              why: { flat: "Flat shapes are like drawings. Look again." },
              showText: "A cube is solid, like a block. A square is flat.",
              praise: "Yes! A cube is solid, like a block.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many solid shapes?"
            answer={3}
            tone="a"
            picture={(m) => <MixRow items={CFU_ROW} tone="a" ring={m === "wrong" ? "solid" : undefined} number={m === "show" || m === "done" ? "solid" : undefined} />}
            nudge="Solid shapes you can pick up. Count only those."
            why={{ 5: "Some are flat. Count only the solid ones.", 2: "Look again. Find every solid one." }}
            showText="The cube, the cone, the cylinder. 1, 2, 3."
            praise="Yes! 3 solid shapes."
            look={LOOK.row}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="How many flat shapes?"
            answer={2}
            tone="a"
            picture={(m) => <MixRow items={CFU_ROW} tone="a" ring={m === "wrong" ? "flat" : undefined} number={m === "show" || m === "done" ? "flat" : undefined} />}
            nudge="Flat shapes are like drawings. Count only those."
            why={{ 5: "Some are solid. Count only the flat ones.", 3: "You counted the solid ones. Count the flat ones." }}
            showText="The circle and the square. 1, 2."
            praise="Yes! 2 flat shapes."
            look={LOOK.row}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="This circle is round. Is it flat or solid?"
            picture={one(<ShapeGlyph kind="circle" tone="a" label="a round shape" />)}
            showPicture={<OnPaper><ShapeGlyph kind="circle" tone="a" label="a round shape" /></OnPaper>}
            showText="A circle is round, but flat. It is like a drawing."
            options={[
              { id: "flat", label: "Flat" },
              { id: "solid", label: "Solid" },
            ]}
            answer="flat"
            why={{ solid: "It is like a drawing. Look again." }}
            praise="Yes! A circle is flat."
            look={LOOK.pair}
            twin={{
              prompt: "Look at this hexagon. Is it flat or solid?",
              picture: one(<ShapeGlyph kind="hexagon" tone="a" soft label="a shape" />),
              showPicture: <OnPaper><ShapeGlyph kind="hexagon" tone="a" soft label="a shape" /></OnPaper>,
              options: [
                { id: "flat", label: "Flat" },
                { id: "solid", label: "Solid" },
              ],
              answer: "flat",
              why: { solid: "It is like a drawing. Look again." },
              showText: "A hexagon is flat. It is like a drawing.",
              praise: "Yes! A hexagon is flat.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={5}
            prompt="What solid is this? Cube, cylinder, or cone?"
            picture={one(<SolidGlyph kind="cylinder" tone="a" label="a solid shape" />)}
            showPicture={<WithThing kind="cylinder" tone="a"><SolidGlyph kind="cylinder" tone="a" clue label="a solid shape" /></WithThing>}
            showText="It has two round ends, like a can. It is a cylinder."
            options={[
              { id: "cube", label: "Cube" },
              { id: "cylinder", label: "Cylinder" },
              { id: "cone", label: "Cone" },
            ]}
            answer="cylinder"
            why={{ cube: "A cube looks like a block. Look again.", cone: "A cone has a point on top. Look again." }}
            praise="Yes! A cylinder, like a can."
            look={LOOK.solid}
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

const EXPLORE_ROW: RowItem[] = [{ solid: "cone" }, { flat: "triangle", alt: true }, { solid: "cube", alt: true }, { solid: "sphere" }, { solid: "cylinder" }];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [flatKind, setFlatKind] = useState<ShapeKind>("triangle");
  const [solidKind, setSolidKind] = useState<SolidKind>("cone");
  useLookHereRequest((id) => {
    // Never a CFU answer: not the circle/sphere or square/cube pairs, not the cylinder.
    if (id === "u2-pair" || id === "u2-solid") {
      setFlatKind("triangle");
      setSolidKind("cone");
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ReadAloud as="p" className="muted small">
        Pick a flat shape. Pick a solid shape.
      </ReadAloud>
      <div className="control-row" data-readaloud-part>
        <Segmented label="Flat (2D) shape" value={flatKind} onChange={setFlatKind} options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
        <Segmented label="Solid (3D) shape" value={solidKind} onChange={setSolidKind} options={SOLID_KINDS.map((k) => ({ id: k, label: SOLID_LABELS[k] }))} />
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
      <div {...lookHereSpot("u2-pair")} className="control-row" data-readaloud-part style={{ alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <OnPaper>
            <ShapeGlyph kind={flatKind} tone="a" label="a flat shape" />
          </OnPaper>
          <ReadAloud as="p" className="feedback good" style={{ textAlign: "center", margin: 0 }}>
            {SHAPE_LABELS[flatKind]}. Flat (2D).
          </ReadAloud>
          <ReadAloud as="p" className="small" style={{ textAlign: "center", margin: 0 }}>
            <span data-look-here-key>It is like a drawing.</span>
          </ReadAloud>
        </div>
        <div {...lookHereSpot("u2-solid")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <WithThing kind={solidKind} tone="a">
            <SolidGlyph kind={solidKind} tone="a" label="a solid shape" />
          </WithThing>
          <ReadAloud as="p" className="feedback good" style={{ textAlign: "center", margin: 0 }}>
            {SOLID_LABELS[solidKind]}. Solid (3D).
          </ReadAloud>
          <ReadAloud as="p" className="small" style={{ textAlign: "center", margin: 0 }}>
            <span data-look-here-key>{SOLID_CLUE[solidKind]}</span> You can pick it up.
          </ReadAloud>
        </div>
      </div>
      <ReadAloud as="p" className="muted small">
        A flat shape is like a drawing. You can pick up a solid shape.
      </ReadAloud>

      <div {...lookHereSpot("u2-row")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          <span data-look-here-key>Some are flat. Some are solid.</span>
        </ReadAloud>
        <div data-readaloud-part>
          <MixRow items={EXPLORE_ROW} tone="a" tags />
        </div>
        <ReadAloud as="p" className="muted small">
          A block of just lines is still solid.
        </ReadAloud>
      </div>

      <div {...lookHereSpot("u2-front")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="control-row" data-readaloud-part style={{ alignItems: "center" }}>
          <div style={{ width: 150 }}>
            <SolidGlyph kind="cube" tone="a" ringFront label="a cube with its front ringed" />
          </div>
          <ReadAloud as="p" className="muted small" style={{ maxWidth: 260 }}>
            Look at the front of the cube. It is a square.
          </ReadAloud>
        </div>
        {/* A second part, so "What shape is this part?" is not always Square (review C2-09). */}
        {/* The 3D can shows its end as an oval, so the end is traced on paper beside it (review C3-03). */}
        <div className="control-row" data-readaloud-part style={{ alignItems: "center" }}>
          <CanEndTraced tone="a" />
          <ReadAloud as="p" className="muted small" style={{ maxWidth: 260 }}>
            Look at the end of the can. Trace the end. You get a circle.
          </ReadAloud>
        </div>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <FlatOrSolidCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "classify2D" | "classify3D" | "circleVsSphereSquareVsCube" | "nameSolid" | "realObject3D";
const BUCKETS: Bucket[] = ["classify2D", "classify3D", "circleVsSphereSquareVsCube", "nameSolid", "realObject3D"];

const FLAT_OR_SOLID = ["Flat (2D)", "Solid (3D)"] as const;

/** A row of 5 with `count` of the asked kind, the answer decided first so
 *  every count from 1 to 4 is equally likely. */
function makeRow(ask: "flat" | "solid"): { items: RowItem[]; count: number } {
  const count = randInt(1, 4);
  const asked: RowItem[] = Array.from({ length: count }, () => (ask === "solid" ? { solid: pick(SOLID_KINDS), alt: Math.random() < 0.3 } : { flat: pick(SHAPE_KINDS), alt: Math.random() < 0.3 }));
  const other: RowItem[] = Array.from({ length: 5 - count }, () => (ask === "solid" ? { flat: pick(SHAPE_KINDS), alt: Math.random() < 0.3 } : { solid: pick(SOLID_KINDS), alt: Math.random() < 0.3 }));
  return { items: shuffle([...asked, ...other]), count };
}

/** The typed step every Unit 2 problem ends with (review C1-06). */
function countRowStep(ask: "flat" | "solid", count: number): Step {
  const noun = count === 1 ? `${ask} shape` : `${ask} shapes`;
  return {
    kind: "number",
    prompt: `More shapes! How many ${ask} shapes?`,
    hint: ask === "solid" ? "Count the ones you could pick up." : "Count the ones like drawings.",
    showMe: countAlongText(count, noun),
    showMeHoldMs: countAlongMs(count),
    explain: `${count} ${noun}.`,
    answer: count,
  };
}

/** "Is it flat or solid?" (buttons keep "(2D)/(3D)": user decision E1-22). */
function flatSolidStep(solid: boolean): Step {
  return choice(
    {
      prompt: "Is it flat (2D) or solid (3D)?",
      hint: "Could you pick it up?",
      showMe: solid ? "Look: it is like a real thing. You can pick it up." : "Look: it is like a drawing on paper.",
      explain: solid ? "It is solid. You can pick it up." : "It is flat, like a drawing.",
    },
    solid ? FLAT_OR_SOLID[1] : FLAT_OR_SOLID[0],
    [solid ? FLAT_OR_SOLID[0] : FLAT_OR_SOLID[1]]
  );
}

/** The flat shape that is a part of a solid, asked about with the part ringed
 *  (E1-21 / C1-24: taught in Explore before the Test asks). Two items, so the
 *  answer is not always Square (review C2-09): the front of the cube, and the
 *  end of the can. The buttons are the same for both. */
type Part = "cubeFront" | "canEnd";
function partStep(part: Part): Step {
  const front = part === "cubeFront";
  return choice(
    {
      prompt: front ? "Look at the front of the cube. What shape is it?" : "Look at the end of the can. What shape is it?",
      hint: front ? "Look at the front. Count its corners." : "Look at the end. Is it round?",
      showMe: front ? "Look: its 4 sides are all the same. It is a square." : "Look: the end is round. It is a circle.",
      explain: front ? "The front is a square." : "The end is a circle.",
    },
    front ? "Square" : "Circle",
    front ? ["Circle", "Triangle"] : ["Square", "Triangle"]
  );
}
/** The picture for a part step: the cube with its front ringed, or the can with its end ringed.
 *  "Show me" on the can adds its end traced on paper: a true circle (review C3-03). */
const partPicture = (part: Part, tone: Tone, show = false) =>
  part === "cubeFront" ? (
    <div style={{ width: 200 }}>
      <SolidGlyph kind="cube" tone={tone} ringFront label="a cube with its front ringed" />
    </div>
  ) : show ? (
    <CanEndTraced tone={tone} />
  ) : (
    <div style={{ width: 200 }}>
      <SolidThingPicture thing="can" tone={tone} ringEnd label="a can with its end ringed" />
    </div>
  );

/** The flat shape that looks like each solid, and the solid each flat shape
 *  looks like: one of them is always a wrong button in "What is its name?"
 *  (review C2-03: flat and solid names mixed, so the square-or-cube trap is
 *  really checked). */
const FLAT_LOOKALIKE: Record<SolidKind, ShapeKind> = { cube: "square", sphere: "circle", cone: "triangle", cylinder: "rectangle" };
const SOLID_LOOKALIKE: Record<ShapeKind, SolidKind> = { square: "cube", circle: "sphere", triangle: "cone", rectangle: "cylinder", hexagon: "cube" };

/** "What is its name?" for a flat shape: its name, the solid it looks like, and one other flat name. */
function nameFlatMixedStep(kind: ShapeKind, round: boolean): Step {
  const label = SHAPE_LABELS[kind];
  return choice(
    { prompt: "What is its name?", hint: round ? "It is flat and round." : "It is flat. Look at its corners.", showMe: round ? "It is round. It is a circle." : `Look at the sides and corners. It is a ${label.toLowerCase()}.`, explain: "Yes! You named it." },
    label,
    [SOLID_LABELS[SOLID_LOOKALIKE[kind]], SHAPE_LABELS[pick(SHAPE_KINDS.filter((k) => k !== kind))]]
  );
}

/** "What is its name?" for a solid: its name, the flat shape it looks like, and one other solid name. */
function nameSolidMixedStep(kind: SolidKind): Step {
  return choice(
    { prompt: "What is its name?", hint: "Round all over? A point on top? Like a block?", showMe: `${SOLID_CLUE[kind]} It is a ${kind}.`, explain: "Yes! You named it." },
    SOLID_LABELS[kind],
    [SHAPE_LABELS[FLAT_LOOKALIKE[kind]], SOLID_LABELS[pick(SOLID_KINDS.filter((k) => k !== kind))]]
  );
}

function nameSolidStep(kind: SolidKind, options: number): Step {
  return choice(
    { prompt: "What solid is it?", hint: "Round? A point on top? Like a block?", showMe: `${SOLID_CLUE[kind]} It is a ${kind}.`, explain: "Yes! You named it." },
    SOLID_LABELS[kind],
    shuffle(SOLID_KINDS.filter((k) => k !== kind).map((k) => SOLID_LABELS[k])).slice(0, options - 1)
  );
}

function flatOrSolidProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);
  const tone: Tone = pick(["a", "b", "c"] as const);
  const ask = pick(["flat", "solid"] as const);
  const row = makeRow(ask);
  const rowPicture = (help: Parameters<Problem["visual"]>[1], i: number) => <MixRow items={row.items} tone={tone} ring={helping(help, i) ? ask : undefined} number={showing(help, i) ? ask : undefined} />;

  if (bucket === "classify2D") {
    const kind = pick(SHAPE_KINDS);
    const soft = Math.random() < 0.5;
    const round = kind === "circle";
    const label = SHAPE_LABELS[kind];
    // Flat or solid FIRST, then the name with flat and solid names mixed
    // (review C2-03: naming first, with only flat names, gave away "flat").
    return {
      title: "Shapes",
      bucket,
      story: "",
      visual: (done, help) => {
        if (shownStep(done, help) >= 2) return rowPicture(help, 2);
        const shape = <ShapeGlyph kind={kind} tone={tone} soft={soft} label="a shape" cornerDots={!round && (helping(help, 1) || showing(help, 1))} traceDot={round && (helping(help, 1) || showing(help, 1))} />;
        return helping(help, 0) || showing(help, 0) ? <OnPaper>{shape}</OnPaper> : <div style={{ width: 200 }}>{shape}</div>;
      },
      steps: [flatSolidStep(false), nameFlatMixedStep(kind, round), countRowStep(ask, row.count)],
      wrapUp: `It is a ${label.toLowerCase()}. It is flat.`,
    };
  }

  if (bucket === "classify3D" || bucket === "nameSolid" || bucket === "realObject3D") {
    const thing = bucket === "realObject3D" ? pick(SOLID_THINGS) : null;
    const kind: SolidKind = thing ? SOLID_THING_SHAPE[thing] : pick(SOLID_KINDS);
    const plain = !thing && Math.random() < 0.4;
    // classify3D: flat or solid FIRST, then the name with flat and solid names
    // mixed (review C2-03), then (a cube: its front; a cylinder: the end of
    // the can; review C2-09), count.
    // nameSolid: name from 4, count. realObject3D: name the thing's solid, count.
    const part: Part | null = bucket === "classify3D" ? (kind === "cube" ? "cubeFront" : kind === "cylinder" ? "canEnd" : null) : null;
    const steps: Step[] =
      bucket === "classify3D"
        ? [flatSolidStep(true), nameSolidMixedStep(kind), ...(part ? [partStep(part)] : []), countRowStep(ask, row.count)]
        : bucket === "nameSolid"
          ? [nameSolidStep(kind, 4), countRowStep(ask, row.count)]
          : [
              choice(
                { prompt: `What solid shape is ${SOLID_THING_NAME[thing!]}?`, hint: "Round? A point on top? Like a block?", showMe: `${SOLID_CLUE[kind]} It is a ${kind}.`, explain: "Yes! You named it." },
                SOLID_LABELS[kind],
                shuffle(SOLID_KINDS.filter((k) => k !== kind).map((k) => SOLID_LABELS[k])).slice(0, 2)
              ),
              countRowStep(ask, row.count),
            ];
    const last = steps.length - 1;
    const flatSolidAt = bucket === "classify3D" ? 0 : -1;
    const nameAt = bucket === "classify3D" ? 1 : 0;
    const partAt = part ? 2 : -1;
    return {
      title: bucket === "realObject3D" ? "Things" : bucket === "nameSolid" ? "Solids" : "Shapes",
      bucket,
      story: "",
      visual: (done, help) => {
        const at = shownStep(done, help);
        if (at >= last) return rowPicture(help, last);
        if (part && at === partAt) return partPicture(part, tone, showing(help, partAt));
        const clue = helping(help, nameAt) || showing(help, nameAt);
        if (thing) return <div style={{ width: 200 }}><SolidThingPicture thing={thing} tone={tone} clue={clue} label="a picture of a thing" /></div>;
        const solid = <SolidGlyph kind={kind} tone={tone} plain={plain} clue={clue} label="a solid shape" />;
        return helping(help, flatSolidAt) || showing(help, flatSolidAt) ? <WithThing kind={kind} tone={tone}>{solid}</WithThing> : <div style={{ width: 200 }}>{solid}</div>;
      },
      steps,
      wrapUp: thing ? `${SOLID_THING_NAME[thing][0].toUpperCase()}${SOLID_THING_NAME[thing].slice(1)} is a ${kind}.` : `It is a ${kind}. It is solid.`,
    };
  }

  // The tricky pair: a circle and a sphere, or a square and a cube, side by
  // side. Which one is asked about changes, so the right picture changes too.
  const circlePair = Math.random() < 0.5;
  const flat: ShapeKind = circlePair ? "circle" : "square";
  const solid: SolidKind = circlePair ? "sphere" : "cube";
  const askSolid = Math.random() < 0.5;
  const solidFirst = Math.random() < 0.5;
  const flatPic = <ShapeGlyph kind={flat} tone={tone} label={`the ${flat}`} />;
  const solidPic = <SolidGlyph kind={solid} tone={tone} label={`the ${solid}`} />;
  // Neutral spoken names: a later step's answer ("square") must not be on screen in the chip (C1-05).
  const opts: [string, ReactNode][] = solidFirst ? [["the first picture", solidPic], ["the second picture", flatPic]] : [["the first picture", flatPic], ["the second picture", solidPic]];
  const rightIdx = askSolid === solidFirst ? 0 : 1;
  const steps: Step[] = [
    pictureChoice(
      {
        prompt: askSolid ? "Which one can you pick up? Tap it." : "Which one is flat? Tap it.",
        hint: askSolid ? "Could you pick it up?" : "Which one is like a drawing?",
        showMe: askSolid ? `The ${solid} is like a ${LIKE[solid]}. You can pick it up.` : `The ${flat} is like a drawing. It is flat.`,
        explain: askSolid ? "This one is solid." : "This one is flat.",
      },
      opts,
      rightIdx
    ),
    // Then the part question: the cube's front (square pair) or the end of the
    // can (circle pair), so its answer is Square or Circle (review C2-09).
    partStep(circlePair ? "canEnd" : "cubeFront"),
    countRowStep(ask, row.count),
  ];
  const last = steps.length - 1;
  return {
    title: "Two shapes",
    bucket,
    story: "",
    visual: (done, help) => {
      const at = shownStep(done, help);
      if (at >= last) return rowPicture(help, last);
      if (at === 1) return partPicture(circlePair ? "canEnd" : "cubeFront", tone, showing(help, 1));
      const hl = helping(help, 0) || showing(help, 0);
      const f = hl ? <OnPaper>{flatPic}</OnPaper> : <div style={{ width: 150 }}>{flatPic}</div>;
      const s = hl ? <WithThing kind={solid} tone={tone}>{solidPic}</WithThing> : <div style={{ width: 150 }}>{solidPic}</div>;
      return (
        <div className="control-row" style={{ alignItems: "center" }}>
          {solidFirst ? s : f}
          {solidFirst ? f : s}
        </div>
      );
    },
    steps,
    wrapUp: `The ${solid} is solid. The ${flat} is flat.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <SolidGlyph kind="sphere" tone="a" label="a sphere" />;
}

export const flatOrSolid: Unit = {
  id: "flatOrSolid",
  title: "Flat or Solid?",
  goal: "Is it flat? Is it solid? Name the solid.",
  standard: "K.G.3",
  keyIdea: (
    <>
      <p>Flat shapes are like drawings.</p>
      <p>Solid shapes you can pick up.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  reintroEverySolved: 20,
  preview: Preview,
  problems: [{ label: "Flat or solid", make: flatOrSolidProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: flatOrSolidTest,
};
