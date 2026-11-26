import { useState } from "react";
import {
  ShapeGlyph,
  ShapeCountable,
  SideSticks,
  SideRows,
  SHAPE_KINDS,
  SHAPE_LABELS,
  shapeAttributes,
  sidesLookEqual,
  BUILDABLE_KINDS,
  type ShapeKind,
  type BuildableKind,
  type TriangleVariant,
} from "../diagrams/Shape2D";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem, type Step, type VisualHelp } from "../../../shared/engine/types";
import { countAlongMs, countAlongText } from "../diagrams/countAlong";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { sidesAndCornersTest } from "./SidesAndCornersTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";
import { countUp, helping, showing, shownStep } from "./labParts";

type Tone = "a" | "b" | "c";
type What = "sides" | "corners";
const one = (w: What) => (w === "sides" ? "side" : "corner");

/** A shape to count: turned and resized at random (K.G.4 "in different
 *  sizes and orientations"; review C1-16). */
interface Drawn {
  kind: ShapeKind;
  rotation: number;
  size: number;
  variant: TriangleVariant;
}
const drawn = (kind: ShapeKind, variant: TriangleVariant = "plain"): Drawn => ({ kind, rotation: kind === "circle" ? 0 : randInt(0, 11) * 30 + randInt(-10, 10), size: pick([48, 56, 64]), variant });

/** The shape for a counting picture. Straight shapes number each side (or
 *  corner) as it is tapped (review C1-28). A circle gets a dot that runs
 *  round its edge after a wrong try, and a big 0 in "Show me" (C1-26). */
function CountPicture({ d, what, tone, help, step, keyId }: { d: Drawn; what: What; tone: Tone; help?: VisualHelp; step: number; keyId: string }) {
  if (d.kind === "circle") {
    return <ShapeGlyph kind="circle" size={d.size} tone={tone} label="a round shape" traceDot={helping(help, step) || showing(help, step)} bigZero={showing(help, step)} />;
  }
  return (
    <ShapeCountable
      key={keyId}
      kind={d.kind}
      rotation={d.rotation}
      size={d.size}
      variant={d.variant}
      tone={tone}
      tapWhat={what}
      startHere={helping(help, step)}
      countAlong={showing(help, step) ? what : undefined}
    />
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K-1 design, one question at a time, 3 of 4 typed. Every question has a
// "Look here" pointer (review C1-01). Q4 has a twin with the same answer
// (two triangles: "Yes"). Explore's tap-to-count opens on a hexagon and its
// compare on a square and a hexagon, with no numbers printed, so it never
// shows a CFU answer (review C1-02).

const LOOK = {
  tap: { target: "u3-tap", label: "Explore: tap to count", say: "Look here. Tap each one. Count." },
  circle: { target: "u3-circle", label: "Explore: the circle", say: "Look here. Is there a corner?" },
  compare: { target: "u3-compare", label: "Explore: two shapes", say: "Look here. Count the sides of each." },
};

const countQuestion = (n: number, kind: BuildableKind, rotation: number, what: What, done: () => void) => {
  const total = shapeAttributes(kind)[what];
  return (
    <TypeCheck
      n={n}
      prompt={`How many ${what} does this ${kind} have?`}
      answer={total}
      tone="a"
      picture={(m) => (
        <div style={{ width: 200 }}>
          <ShapeCountable kind={kind} rotation={rotation} tone="a" tapWhat={what} countAlong={m === "show" || m === "done" ? what : undefined} />
        </div>
      )}
      nudge={`Tap each ${one(what)}. Count each one once.`}
      showText={`Watch and listen: ${countUp(total)}.`}
      praise={`Yes! A ${kind} has ${total} ${what}.`}
      look={LOOK.tap}
      onComplete={done}
    />
  );
};

const pairPicture = (a: { kind: BuildableKind; rotation: number; variant?: TriangleVariant }, b: { kind: BuildableKind; rotation: number; variant?: TriangleVariant }, count = false) => (
  <div style={{ display: "flex", gap: 12 }}>
    <div style={{ width: 150 }}>
      <ShapeCountable kind={a.kind} rotation={a.rotation} variant={a.variant} tone="a" countAlong={count ? "sides" : undefined} />
    </div>
    <div style={{ width: 150 }}>
      <ShapeCountable kind={b.kind} rotation={b.rotation} variant={b.variant} tone="a" countAlong={count ? "sides" : undefined} countAlongStartAfter={shapeAttributes(a.kind).sides + 1} />
    </div>
  </div>
);

function SidesAndCornersCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const sq = { kind: "square" as const, rotation: 15 };
  const rect = { kind: "rectangle" as const, rotation: 30 };
  const triA = { kind: "triangle" as const, rotation: 20, variant: "equal" as const };
  const triB = { kind: "triangle" as const, rotation: 200, variant: "thin" as const };
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => countQuestion(1, "square", 20, "sides", done),
        (done) => countQuestion(2, "triangle", 200, "corners", done),
        (done) => (
          <TypeCheck
            n={3}
            prompt="How many corners does a circle have?"
            answer={0}
            tone="a"
            picture={(m) => (
              <div style={{ width: 150 }}>
                <ShapeGlyph kind="circle" tone="a" label="a round shape" traceDot={m !== "ask"} bigZero={m === "show" || m === "done"} />
              </div>
            )}
            nudge="Look all the way around. Is there a corner?"
            why={{ 1: "A circle is round all the way. Look again." }}
            showText="Watch the dot go around. No corner. 0 corners."
            praise="Yes! A circle has 0 corners."
            look={LOOK.circle}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="A square and a rectangle. Do they have the same number of sides?"
            picture={pairPicture(sq, rect)}
            showPicture={pairPicture(sq, rect, true)}
            showText="Count the square: 1, 2, 3, 4. Count the rectangle: 1, 2, 3, 4. Both have 4."
            options={[
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ]}
            answer="yes"
            why={{ no: "Count the sides of each one." }}
            praise="Yes! Both have 4 sides."
            look={LOOK.compare}
            twin={{
              prompt: "Two triangles. Do they have the same number of sides?",
              picture: pairPicture(triA, triB),
              showPicture: pairPicture(triA, triB, true),
              options: [
                { id: "yes", label: "Yes" },
                { id: "no", label: "No" },
              ],
              answer: "yes",
              why: { no: "Count the sides of each one." },
              showText: "Count this one: 1, 2, 3. Count that one: 1, 2, 3. Both have 3.",
              praise: "Yes! Both have 3 sides.",
            }}
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

type TapKind = BuildableKind | "circle";
const SAME_PICKS: { id: string; label: string; kind: BuildableKind; variant: TriangleVariant }[] = [
  { id: "square", label: "Square", kind: "square", variant: "plain" },
  { id: "rectangle", label: "Rectangle", kind: "rectangle", variant: "plain" },
  { id: "triEqual", label: "Triangle 1", kind: "triangle", variant: "equal" },
  { id: "triThin", label: "Triangle 2", kind: "triangle", variant: "thin" },
  { id: "hexagon", label: "Hexagon", kind: "hexagon", variant: "plain" },
];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [kind, setKind] = useState<TapKind>("hexagon");
  const [countedSides, setCountedSides] = useState<number[]>([]);
  const [countedCorners, setCountedCorners] = useState<number[]>([]);
  const [trace, setTrace] = useState(0);
  const pickKind = (k: TapKind) => {
    setKind(k);
    setCountedSides([]);
    setCountedCorners([]);
  };
  const toggleSide = (i: number) => setCountedSides((arr) => (arr.includes(i) ? arr : [...arr, i]));
  const toggleCorner = (i: number) => setCountedCorners((arr) => (arr.includes(i) ? arr : [...arr, i]));

  const [kindA, setKindA] = useState<ShapeKind>("square");
  const [kindB, setKindB] = useState<ShapeKind>("hexagon");
  const [countRun, setCountRun] = useState(0);
  const attrA = shapeAttributes(kindA);
  const attrB = shapeAttributes(kindB);
  const [sameId, setSameId] = useState("rectangle");
  const samePick = SAME_PICKS.find((p) => p.id === sameId)!;

  useLookHereRequest((id) => {
    // Never a CFU answer: Q1 is a square, Q2 a triangle (the tap spot shows a hexagon).
    if (id === "u3-tap") pickKind("hexagon");
    if (id === "u3-circle") {
      pickKind("circle");
      setTrace((t) => t + 1);
    }
  });

  const all = kind !== "circle" && countedSides.length === shapeAttributes(kind).sides && countedCorners.length === shapeAttributes(kind).corners;
  const more = attrA.sides === attrB.sides ? null : attrA.sides > attrB.sides ? kindA : kindB;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div {...lookHereSpot("u3-tap")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          <span data-look-here-key>Tap each side. Then tap each corner.</span>
        </ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented label="Shape" value={kind} onChange={pickKind} options={[...BUILDABLE_KINDS, "circle" as const].map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
          <button className="btn ghost" onClick={() => (kind === "circle" ? setTrace((t) => t + 1) : pickKind(kind))}>
            Start over
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
        <div style={{ maxWidth: 220 }}>
          {kind === "circle" ? (
            <ShapeGlyph key={trace} kind="circle" tone="a" label="a circle" traceDot />
          ) : (
            <ShapeCountable kind={kind} tone="a" countedSides={countedSides} countedCorners={countedCorners} onToggleSide={toggleSide} onToggleCorner={toggleCorner} />
          )}
        </div>
        {kind === "circle" ? (
          <ReadAloud as="p" className="feedback good" {...lookHereSpot("u3-circle")}>
            <span data-look-here-key>Watch the dot go around. Is there a corner?</span> It is round all the way.
          </ReadAloud>
        ) : (
          <ReadAloud as="p" className="feedback good">
            Sides: {countedSides.length}. Corners: {countedCorners.length}.{all ? " You tapped every one!" : ""}
          </ReadAloud>
        )}
      </div>

      <div {...lookHereSpot("u3-same")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          Are all the sides the same? Line them up.
        </ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented label="Shape" value={sameId} onChange={setSameId} options={SAME_PICKS.map((p) => ({ id: p.id, label: p.label }))} />
        </div>
        <div className="control-row" data-readaloud-part style={{ alignItems: "center" }}>
          <div style={{ width: 150 }}>
            <ShapeGlyph kind={samePick.kind} variant={samePick.variant} tone="b" label="a shape" />
          </div>
          <div style={{ width: 200 }}>
            <SideSticks kind={samePick.kind} variant={samePick.variant} tone="b" />
          </div>
        </div>
        <ReadAloud as="p" className="feedback good">
          {sidesLookEqual(samePick.kind, samePick.variant) ? "All the sides are the same." : "The sides are not all the same."}
        </ReadAloud>
      </div>

      <div {...lookHereSpot("u3-compare")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          Now look at two shapes.
        </ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Segmented label="Shape 1" value={kindA} onChange={setKindA} options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
          <Segmented label="Shape 2" value={kindB} onChange={setKindB} options={SHAPE_KINDS.map((k) => ({ id: k, label: SHAPE_LABELS[k] }))} />
          <button className="btn ghost" onClick={() => setCountRun((c) => c + 1)}>
            Count the sides
          </button>
        </div>
        <div className="control-row" data-readaloud-part>
          {[kindA, kindB].map((k, i) => (
            <div key={`${i}-${k}-${countRun}`} style={{ width: 150 }}>
              {k === "circle" ? (
                <ShapeGlyph kind="circle" tone="a" label="a circle" />
              ) : (
                <ShapeCountable kind={k} tone="a" countAlong={countRun > 0 ? "sides" : undefined} countAlongStartAfter={i === 0 ? 0 : attrA.sides + 1} />
              )}
              <ReadAloud as="p" className="small" style={{ textAlign: "center", margin: 0 }}>
                {SHAPE_LABELS[k]}
              </ReadAloud>
            </div>
          ))}
        </div>
        <ReadAloud as="p" className="feedback good">
          <span data-look-here-key>{more ? `The ${more} has more sides.` : "They have the same number of sides."}</span>
        </ReadAloud>
        {more && (
          <div style={{ maxWidth: 260 }}>
            <ReadAloud as="p" className="muted small">
              Line up the sides. See the extra ones.
            </ReadAloud>
            <SideRows a={{ sides: attrA.sides, tone: "a", kind: kindA }} b={{ sides: attrB.sides, tone: "b", kind: kindB }} ring />
          </div>
        )}
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <SidesAndCornersCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "countSides" | "countCorners" | "equalSidesCompare" | "crossShapeCompare";
const BUCKETS: Bucket[] = ["countSides", "countCorners", "equalSidesCompare", "crossShapeCompare"];

/** A typed count of one shape's sides or corners. */
function countStep(d: Drawn, what: What, prompt: string): Step {
  const n = shapeAttributes(d.kind)[what];
  const round = d.kind === "circle";
  return {
    kind: "number",
    prompt,
    hint: round ? `Look all the way around. Is there a ${what === "sides" ? "straight side" : "corner"}?` : `Tap each ${one(what)}. Count each one once.`,
    showMe: countAlongText(n, what),
    showMeHoldMs: round ? 2600 : countAlongMs(n),
    explain: round ? `A circle has no ${what}.` : `It has ${n} ${what}.`,
    answer: n,
  };
}

/** The shapes "are all the sides the same?" uses: the answer is decided
 *  first (Yes or No, half each), then a shape that fits it (review C1-25:
 *  an equal-sided triangle for Yes, a long thin one for No). */
const SAME_YES: { kind: BuildableKind; variant: TriangleVariant }[] = [
  { kind: "square", variant: "plain" },
  { kind: "hexagon", variant: "plain" },
  { kind: "triangle", variant: "equal" },
];
const SAME_NO: { kind: BuildableKind; variant: TriangleVariant }[] = [
  { kind: "rectangle", variant: "plain" },
  { kind: "triangle", variant: "thin" },
];

function sidesAndCornersProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);
  const tone: Tone = pick(["a", "b", "c"] as const);

  if (bucket === "countSides" || bucket === "countCorners") {
    // Step 2 counts a DIFFERENT shape (review C1-27: it used to repeat step 1's number).
    const first = drawn(pick(SHAPE_KINDS));
    // ...and its count is not the number step 1 just showed.
    const firstCount = shapeAttributes(first.kind)[bucket === "countSides" ? "sides" : "corners"];
    const second = drawn(pick(SHAPE_KINDS.filter((k) => k !== first.kind && shapeAttributes(k)[bucket === "countSides" ? "corners" : "sides"] !== firstCount)));
    const primary: What = bucket === "countSides" ? "sides" : "corners";
    const secondary: What = bucket === "countSides" ? "corners" : "sides";
    const a = SHAPE_LABELS[first.kind].toLowerCase();
    const b = SHAPE_LABELS[second.kind].toLowerCase();
    return {
      title: primary === "sides" ? "Sides" : "Corners",
      bucket,
      story: "",
      visual: (done, help) => {
        const at = Math.min(shownStep(done, help), 1);
        return (
          <div style={{ width: 200 }}>
            {at === 0 ? <CountPicture d={first} what={primary} tone={tone} help={help} step={0} keyId="first" /> : <CountPicture d={second} what={secondary} tone={tone} help={help} step={1} keyId="second" />}
          </div>
        );
      },
      steps: [countStep(first, primary, `How many ${primary} does this ${a} have?`), countStep(second, secondary, `Now this ${b}. How many ${secondary}?`)],
      wrapUp: `The ${a} has ${shapeAttributes(first.kind)[primary]} ${primary}. The ${b} has ${shapeAttributes(second.kind)[secondary]} ${secondary}.`,
    };
  }

  if (bucket === "equalSidesCompare") {
    const equal = Math.random() < 0.5;
    const shape = pick(equal ? SAME_YES : SAME_NO);
    const d = drawn(shape.kind, shape.variant);
    const label = SHAPE_LABELS[shape.kind].toLowerCase();
    const n = shapeAttributes(shape.kind).sides;
    return {
      title: "Sides",
      bucket,
      story: "",
      visual: (done, help) => {
        const at = Math.min(shownStep(done, help), 1);
        if (at === 0 && (helping(help, 0) || showing(help, 0))) {
          // Help: the sides laid out in a row, lined up at one end.
          return (
            <div className="control-row" style={{ alignItems: "center" }}>
              <div style={{ width: 150 }}>
                <ShapeGlyph kind={shape.kind} variant={shape.variant} rotation={d.rotation} size={d.size} tone={tone} label="a shape" />
              </div>
              <div style={{ width: 200 }}>
                <SideSticks kind={shape.kind} variant={shape.variant} tone={tone} numbered={showing(help, 0)} />
              </div>
            </div>
          );
        }
        return <div style={{ width: 200 }}>{at === 0 ? <ShapeGlyph kind={shape.kind} variant={shape.variant} rotation={d.rotation} size={d.size} tone={tone} label="a shape" /> : <CountPicture d={d} what="sides" tone={tone} help={help} step={1} keyId="sides" />}</div>;
      },
      steps: [
        choice(
          {
            prompt: "Are all the sides the same?",
            hint: "Look at each side. Is one longer?",
            showMe: equal ? "Line them up. They all come out the same." : "Line them up. They do not come out the same.",
            explain: `This ${label}'s sides are ${equal ? "all the same" : "not all the same"}.`,
          },
          equal ? "Yes" : "No",
          [equal ? "No" : "Yes"]
        ),
        countStep(d, "sides", "How many sides does it have?"),
      ],
      wrapUp: `This ${label} has ${n} sides. They are ${equal ? "all the same" : "not all the same"}.`,
    };
  }

  // crossShapeCompare: two DIFFERENT shapes, sides or corners. A third of the
  // time a real tie (square and rectangle: same number, different lengths).
  const what: What = pick(["sides", "corners"] as const);
  let kindA: ShapeKind;
  let kindB: ShapeKind;
  if (Math.random() < 1 / 3) {
    [kindA, kindB] = pick([
      ["square", "rectangle"],
      ["rectangle", "square"],
    ] as const);
  } else {
    do {
      kindA = pick(SHAPE_KINDS);
      kindB = pick(SHAPE_KINDS);
    } while (kindA === kindB || shapeAttributes(kindA).sides === shapeAttributes(kindB).sides);
  }
  const A = drawn(kindA);
  const B = drawn(kindB);
  const a = shapeAttributes(kindA)[what];
  const b = shapeAttributes(kindB)[what];
  const la = SHAPE_LABELS[kindA].toLowerCase();
  const lb = SHAPE_LABELS[kindB].toLowerCase();
  const same = a === b;
  const more = a > b ? la : lb;
  const diff = Math.abs(a - b);
  const answer = same ? "The same" : a > b ? SHAPE_LABELS[kindA] : SHAPE_LABELS[kindB];
  const countBoth = (n1: number, n2: number) =>
    `${n1 === 0 ? `The ${la} has no ${what}.` : `Count the ${la}: ${countUp(n1)}.`} ${n2 === 0 ? `The ${lb} has no ${what}.` : `Count the ${lb}: ${countUp(n2)}.`}`;
  // One shape a circle: its row is empty, so every stick (or dot) in the other row is extra (review E3-04).
  const circleIn = kindA === "circle" || kindB === "circle";
  const step2: Step = same
    ? countStep(kindA === "rectangle" ? A : B, what, `How many ${what} does the rectangle have?`)
    : {
        // A count of extras the child can see, not a K "how many more does X
        // have?" compare question (review E2-02). The rows show from the start,
        // already lined up, so the prompt says "Look", not "Line them up" (E3-04).
        kind: "number",
        prompt: "Look at the rows. How many extra?",
        hint: circleIn ? "The circle has none. Count the other row." : "Look at the end of the long row.",
        // With a circle the other shape has 3, 4 or 6, so never "1 extra" there.
        showMe: circleIn
          ? `The circle has none. The extra ones are ${countUp(diff)}.`
          : diff === 1
            ? "Line them up. There is 1 extra one."
            : `Line them up. The extra ones are ${countUp(diff)}.`,
        showMeHoldMs: countAlongMs(diff),
        explain: `${diff} extra. The ${more} has ${diff} more.`,
        answer: diff,
      };
  return {
    title: "Two shapes",
    bucket,
    story: "",
    visual: (done, help) => {
      const at = Math.min(shownStep(done, help), 1);
      const count0 = showing(help, 0);
      const pics = (
        <div className="control-row" style={{ alignItems: "center" }}>
          {[A, B].map((d, i) => (
            <div key={i} style={{ width: 150 }}>
              {d.kind === "circle" ? (
                <ShapeGlyph kind="circle" size={d.size} tone={tone} label="a round shape" traceDot={count0} />
              ) : (
                <ShapeCountable key={`${i}-${count0}`} kind={d.kind} rotation={d.rotation} size={d.size} tone={tone} countAlong={count0 ? what : undefined} countAlongStartAfter={i === 0 ? 0 : a + 1} />
              )}
            </div>
          ))}
        </div>
      );
      if (at === 0 || same) {
        if (at === 1 && same) {
          const r = kindA === "rectangle" ? A : B;
          return <div style={{ width: 200 }}><CountPicture d={r} what={what} tone={tone} help={help} step={1} keyId="rect" /></div>;
        }
        return pics;
      }
      // Step 2: the lined-up rows from the start (review E2-02), with the extras
      // not numbered; help rings them, Show me numbers them.
      const helpRows = helping(help, 1) || showing(help, 1);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pics}
          <SideRows a={{ sides: a, tone, kind: kindA }} b={{ sides: b, tone, kind: kindB }} ring={helpRows} numberExtras={showing(help, 1)} dots={what === "corners"} />
        </div>
      );
    },
    steps: [
      choice(
        {
          prompt: `Which has more ${what}? Or are they the same?`,
          hint: `Count the ${what} of each one.`,
          showMe: countBoth(a, b),
          showMeHoldMs: countAlongMs(a + 1 + b),
          // No counts here: step 2 asks for one (review C1-05).
          explain: same ? `They have the same number of ${what}.` : `The ${more} has more ${what}.`,
        },
        answer,
        [SHAPE_LABELS[kindA], SHAPE_LABELS[kindB], "The same"].filter((c) => c !== answer)
      ),
      step2,
    ],
    wrapUp: same ? `They both have ${a} ${what}.` : `The ${more} has more ${what}.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <ShapeGlyph kind="hexagon" tone="a" label="a hexagon" />;
}

export const sidesAndCorners: Unit = {
  id: "sidesAndCorners",
  title: "Sides and Corners",
  goal: "Count sides. Count corners. Compare two shapes.",
  standard: "K.G.4",
  keyIdea: (
    <>
      <p>A side is straight. A corner is where two sides meet.</p>
      <p>A circle has no sides and no corners.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Sides and corners", make: sidesAndCornersProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: sidesAndCornersTest,
};
