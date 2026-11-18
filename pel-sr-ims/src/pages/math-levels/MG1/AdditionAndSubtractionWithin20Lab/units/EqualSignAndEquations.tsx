import { useEffect, useState, type ReactNode } from "react";
import { EquationStrip, TenFrameGroup, type Tone } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, pointing, type Problem, type Step, type VisualHelp } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { equalSignAndEquationsTest } from "./EqualSignAndEquationsTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";

// ============================================================================
// PICTURES
// ============================================================================

/**
 * One number as a ten-frame with its numeral under it. `label={false}` hides
 * the numeral: a help picture can show an amount to count but never prints
 * the answer before it is found.
 */
function Num({ n, tone, splitAt, tone2, crossFrom, label = true, small = false }: { n: number; tone: Tone; splitAt?: number; tone2?: Tone; crossFrom?: number; label?: boolean; small?: boolean }) {
  return (
    <div style={{ width: small ? 112 : 168 }}>
      <TenFrameGroup value={n} tone={tone} splitAt={splitAt} tone2={tone2} crossFrom={crossFrom} />
      <p style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 800, margin: "4px 0 0", minHeight: "1.9rem" }}>{label ? n : ""}</p>
    </div>
  );
}

const Sign = ({ children }: { children: string }) => <span style={{ fontSize: "1.9rem", fontWeight: 800, alignSelf: "center" }}>{children}</span>;

/**
 * A row of pictures and signs, e.g. [5, "=", 2, "+", 3]. `nowrap` keeps an
 * equation on one line: a CFU picture with 3 numbers uses `<Num small>` and
 * `nowrap`, so on an iPad the last number never drops under the first (C3-03).
 */
const Row = ({ children, nowrap = false }: { children: ReactNode; nowrap?: boolean }) => (
  <div className="control-row" style={{ gap: 12, alignItems: "flex-start", flexWrap: nowrap ? "nowrap" : "wrap" }}>
    {children}
  </div>
);

/** A pick button's picture: two small ten-frames with "=" between them, and the equation under them. */
function MiniEq({ left, right }: { left: number; right: number }) {
  return (
    <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }} aria-hidden>
        <span style={{ width: 96 }}>
          <TenFrameGroup value={left} tone="a" />
        </span>
        <span style={{ fontSize: 24, fontWeight: 800 }}>=</span>
        <span style={{ width: 96 }}>
          <TenFrameGroup value={right} tone="b" />
        </span>
      </span>
      <span style={{ fontSize: 26, fontWeight: 800 }} data-tts-say={`${left} is the same as ${right}`}>
        {left} = {right}
      </span>
    </span>
  );
}

/** "Is this true?" with the equation spoken as "the same as" (E1-29). */
const isItTrue = (eq: string) => <span data-tts-say={`Is ${eq.replace(" = ", " the same as ").replace(/\+/g, "plus").replace(/−/g, "minus")}?`}>{`${eq}. Is it true?`}</span>;

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx): one short question at a time,
// a picture, big Yes/No buttons for "is it true?" (1.OA.7 itself), typed
// boxes for missing numbers. Targets the plan's named misconceptions:
// reading "=" as "the answer comes next" (so 5 = 2 + 3 looks backwards),
// an equation that needs no adding (8 = 8), and a missing number that is
// not last (8 + ☐ = 11, ☐ = 6 + 5). Each question gets a "Look here"
// pointer after its 2nd wrong try; "show it" comes on the 3rd.

/** CFU "Look here" pointers: the Explore spot that teaches each question (shown after its 2nd miss). */
const LOOK = {
  balance: { target: "eq-balance", label: "Explore: = means the same as", say: "Look here. Both sides are the same." },
  eitherSide: { target: "eq-either-side", label: "Explore: the total can be on either side", say: "Look here. The total can go first." },
  scale: { target: "eq-scale", label: "Explore: make both sides match", say: "Look here. Add up each side." },
  missing: { target: "eq-missing", label: "Explore: a box can hide a number", say: "Look here. Make both sides the same." },
};

const YES_NO = [
  { id: "yes", label: "Yes, true" },
  { id: "no", label: "No, false" },
];

function EqualSignCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        // = means "the same as", checked with three pictures (C2-01: no
        // two-button "what does = mean?" pick). The true one is in the middle.
        (done) => (
          <PickCheck
            n={1}
            prompt="Which one is the same on both sides?"
            showPicture={
              <Row>
                <Num n={6} tone="a" />
                <Sign>=</Sign>
                <Num n={6} tone="b" />
              </Row>
            }
            options={[
              { id: "6=9", label: <MiniEq left={6} right={9} /> },
              { id: "6=6", label: <MiniEq left={6} right={6} /> },
              { id: "6=3", label: <MiniEq left={6} right={3} /> },
            ]}
            answer="6=6"
            why={{ "6=9": "Count both sides. Are they the same?", "6=3": "Count both sides. Are they the same?" }}
            showText="Watch: 6 on this side. 6 on that side. They are the same."
            praise="Yes! = means the same as."
            look={LOOK.balance}
            onComplete={done}
          />
        ),
        // False (C2-01: the Yes/No answers are not all "Yes"). A wrong pick
        // brings a twin with new numbers, so the 2nd miss can show "Look here!".
        (done) => (
          <PickCheck
            n={2}
            prompt={isItTrue("6 = 2 + 3")}
            picture={
              <Row nowrap>
                <Num n={6} tone="a" small />
                <Sign>=</Sign>
                <Num n={2} tone="b" small />
                <Sign>+</Sign>
                <Num n={3} tone="b" small />
              </Row>
            }
            showPicture={
              <Row>
                <Num n={6} tone="a" />
                <Sign>=</Sign>
                <Num n={5} tone="b" splitAt={2} tone2="c" />
              </Row>
            }
            options={YES_NO}
            answer="no"
            // Only heard just before the twin comes, so it doesn't ask a second question (E3-54).
            why={{ yes: "Add up each side. Try this one." }}
            showText="Watch: 2 and 3 make 5. 5 is not 6."
            praise="Right! 2 + 3 is 5, not 6."
            // The spot that teaches a false sentence: add up each side (C3-04).
            look={LOOK.scale}
            // The twin is false too, so tapping "Yes" again never passes (C3-04).
            twin={{
              prompt: isItTrue("7 = 4 + 2"),
              picture: (
                <Row nowrap>
                  <Num n={7} tone="a" small />
                  <Sign>=</Sign>
                  <Num n={4} tone="b" small />
                  <Sign>+</Sign>
                  <Num n={2} tone="b" small />
                </Row>
              ),
              showPicture: (
                <Row>
                  <Num n={7} tone="a" />
                  <Sign>=</Sign>
                  <Num n={6} tone="b" splitAt={4} tone2="c" />
                </Row>
              ),
              options: YES_NO,
              answer: "no",
              why: { yes: "Add up each side. Are they the same?" },
              showText: "Watch: 4 and 2 make 6. 6 is not 7.",
              praise: "Right! 4 + 2 is 6, not 7.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="7 + 1 = 6 + ☐. What number goes in the box?"
            answer={2}
            tone="c"
            picture={(m) =>
              m === "show" || m === "done" ? (
                <Row>
                  <Num n={8} tone="a" splitAt={7} tone2="a" />
                  <Sign>=</Sign>
                  <Num n={8} tone="b" splitAt={6} tone2="c" />
                </Row>
              ) : (
                <Row nowrap>
                  <Num n={7} tone="a" small />
                  <Sign>+</Sign>
                  <Num n={1} tone="a" small />
                  <Sign>=</Sign>
                  <Num n={6} tone="b" small />
                </Row>
              )
            }
            nudge="Add up the first side. Make the other side match."
            why={{ 8: "The first side is 8. What goes with 6 to make 8?", 14: "Make both sides the same." }}
            showText="Watch: 7 + 1 is 8. 6 and 2 more make 8."
            praise="Yes! 7 + 1 = 6 + 2. Both are 8."
            look={LOOK.scale}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt={isItTrue("8 = 8")}
            picture={
              <Row>
                <Num n={8} tone="a" />
                <Sign>=</Sign>
                <Num n={8} tone="b" />
              </Row>
            }
            showPicture={
              <Row>
                <Num n={8} tone="a" />
                <Sign>=</Sign>
                <Num n={8} tone="b" />
              </Row>
            }
            options={YES_NO}
            answer="yes"
            why={{ no: "Look at both sides." }}
            showText="Watch: 8 on this side. 8 on that side."
            praise="Yes! 8 is the same as 8."
            look={LOOK.balance}
            twin={{
              prompt: isItTrue("7 = 7"),
              picture: (
                <Row>
                  <Num n={7} tone="a" />
                  <Sign>=</Sign>
                  <Num n={7} tone="b" />
                </Row>
              ),
              showPicture: (
                <Row>
                  <Num n={7} tone="a" />
                  <Sign>=</Sign>
                  <Num n={7} tone="b" />
                </Row>
              ),
              options: YES_NO,
              answer: "yes",
              why: { no: "Look at both sides." },
              showText: "Watch: 7 on this side. 7 on that side.",
              praise: "Yes! 7 is the same as 7.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={5}
            prompt="8 + ☐ = 11. What number goes in the box?"
            answer={3}
            tone="c"
            picture={(m) => (m === "show" || m === "done" ? <Num n={11} tone="a" splitAt={8} tone2="c" /> : <Num n={8} tone="a" />)}
            nudge="Count on from 8 to 11."
            why={{ 19: "Don't add 8 and 11.", 11: "11 is the total. What goes with 8?" }}
            showText="Watch and listen: 9, 10, 11. That is 3."
            praise="Yes! 8 + 3 = 11."
            look={LOOK.missing}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={6}
            prompt="☐ = 6 + 5. What number goes in the box?"
            answer={11}
            tone="c"
            picture={(m) =>
              m === "show" || m === "done" ? (
                <Num n={11} tone="a" splitAt={6} tone2="b" />
              ) : (
                <Row>
                  <Num n={6} tone="a" />
                  <Sign>+</Sign>
                  <Num n={5} tone="b" />
                </Row>
              )
            }
            nudge="The box can come first. Add 6 + 5."
            why={{ 1: "Add. Don't take away." }}
            showText="Watch: 6 and 4 make 10. 1 more is 11."
            praise="Yes! 11 = 6 + 5."
            look={LOOK.eitherSide}
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

const FIND_STEP_MS = 700;

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  // 6 + 3 = 5 + 4: no CFU numbers, and neither the total (9) nor what "Find
  // it" reveals (4) is a CFU answer (2, 3, 11), so a "Look here" never shows
  // one (C2-03b; 5 + 6 = 7 + 4 was suggested, but its total 11 is Q6's answer).
  const [first, setFirst] = useState(6);
  const [second, setSecond] = useState(3);
  const [third, setThird] = useState(5);
  const [fourth, setFourth] = useState(4);
  const [flipped, setFlipped] = useState(false);
  // Box mode: the fourth number is hidden in a box; "Find it" counts on until both sides match.
  const [boxMode, setBoxMode] = useState(false);
  const [found, setFound] = useState<number | null>(null);

  const firstSide = first + second;
  const target = firstSide - third;
  const shownFourth = boxMode ? (found ?? 0) : fourth;
  const otherSide = third + shownFourth;
  const balanced = firstSide === otherSide;
  const canBox = third <= firstSide;

  useEffect(() => {
    if (found === null || found >= target) return;
    const t = window.setTimeout(() => setFound((f) => (f === null ? f : f + 1)), FIND_STEP_MS);
    return () => window.clearTimeout(t);
  }, [found, target]);

  useLookHereRequest((id) => {
    if (id === "eq-missing" && canBox) {
      setBoxMode(true);
      setFound(null);
    }
  });

  const restart = () => setFound(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
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

      <ReadAloud as="p" className="muted small" {...lookHereSpot("eq-balance")}>
        <span data-look-here-key>= means the same as. Both sides must have the same amount.</span> Try to make them match.
      </ReadAloud>
      {/* Each side's numbers get their ranges from each other, so a side is at most 20. */}
      <div className="control-row" data-readaloud-part>
        <Stepper
          label="First"
          value={first}
          min={0}
          max={20 - second}
          step={1}
          onChange={(v) => {
            setFirst(v);
            restart();
          }}
          tone="a"
        />
        <Stepper
          label="Second"
          value={second}
          min={0}
          max={20 - first}
          step={1}
          onChange={(v) => {
            setSecond(v);
            restart();
          }}
          tone="a"
        />
        <span className="affix" style={{ fontWeight: 800, fontSize: 20 }}>
          =
        </span>
        <Stepper
          label="Third"
          value={third}
          min={0}
          max={boxMode ? firstSide : 20 - fourth}
          step={1}
          onChange={(v) => {
            setThird(v);
            restart();
          }}
          tone="b"
        />
        {!boxMode && <Stepper label="Fourth" value={fourth} min={0} max={20 - third} step={1} onChange={setFourth} tone="b" />}
      </div>
      <div {...lookHereSpot("eq-scale")}>
        <div className="control-row" style={{ gap: 24, alignItems: "flex-start" }} data-readaloud-part>
          <div>
            <TenFrameGroup value={firstSide} tone="a" />
            <ReadAloud as="p" className="muted small" style={{ textAlign: "center" }}>
              {first} + {second} = {firstSide}
            </ReadAloud>
          </div>
          <div>
            <TenFrameGroup value={otherSide} tone="b" splitAt={boxMode ? third : undefined} tone2="c" />
            <ReadAloud as="p" className="muted small" style={{ textAlign: "center" }}>
              {boxMode && found === null ? `${third} + ☐` : `${third} + ${shownFourth} = ${otherSide}`}
            </ReadAloud>
          </div>
        </div>
        <ReadAloud as="p" className={`feedback ${balanced ? "good" : "bad"}`} data-look-here-key>
          {boxMode && found === null
            ? `${first} + ${second} = ${third} + ☐. What goes in the box?`
            : balanced
              ? `Same! ${first} + ${second} = ${third} + ${shownFourth}. Both sides are ${firstSide}.`
              : `Not the same. ${firstSide} ≠ ${otherSide}. Change the numbers until both sides match.`}
        </ReadAloud>
      </div>
      <div {...lookHereSpot("eq-missing")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="control-row" data-readaloud-part>
          <button
            type="button"
            className="btn ghost"
            disabled={!boxMode && !canBox}
            onClick={() => {
              setBoxMode(!boxMode);
              restart();
            }}
          >
            {boxMode ? "Show the fourth number" : "Hide a number in a box"}
          </button>
          {boxMode && (
            <button type="button" className="btn primary" disabled={found !== null} onClick={() => setFound(0)}>
              Find it
            </button>
          )}
        </div>
        <ReadAloud as="p" className="muted small" data-look-here-key>
          A box can hide a number. What number makes both sides the same?
        </ReadAloud>
      </div>
      <div {...lookHereSpot("eq-either-side")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="control-row" style={{ alignItems: "center", gap: 16 }} data-readaloud-part>
          <EquationStrip tokens={flipped ? [{ value: firstSide, tone: "c" }, "=", { value: first, tone: "a" }, "+", { value: second, tone: "a" }] : [{ value: first, tone: "a" }, "+", { value: second, tone: "a" }, "=", { value: firstSide, tone: "c" }]} />
          <button type="button" className="btn ghost" onClick={() => setFlipped((f) => !f)}>
            Flip
          </button>
        </div>
        <ReadAloud as="p" className="muted small" data-look-here-key>
          The total can be on either side.
        </ReadAloud>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <EqualSignCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================
// Before help, pictures show only the numbers the problem gives (separate
// frames, no colored missing part). After a wrong try the picture puts them
// together or splits the total; "Show me" counts it out.

type Bucket = "equalSignUnknownLeft" | "trueFalseTrap" | "findUnknownNonFinal";
const BUCKETS: Bucket[] = ["equalSignUnknownLeft", "trueFalseTrap", "findUnknownNonFinal"];

/** "9, 10, 11" — the numbers you say counting from `from` to `to`. */
const countWords = (from: number, to: number) => {
  const dir = to > from ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) }, (_, k) => from + (k + 1) * dir).join(", ");
};
/** About 1 second per number said, after a short lead-in (Show me pacing), at most 7 seconds. */
const holdFor = (n: number) => Math.min(7000, 1000 + n * 1000);

/** A number from lo..hi that isn't in `avoid`. */
function otherThan(lo: number, hi: number, avoid: number[]): number {
  const pool = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((n) => !avoid.includes(n));
  return pool[randInt(0, pool.length - 1)];
}

function equalSignUnknownLeftProblem(): Problem {
  if (Math.random() < 0.5) {
    // ☐ = A + B — the box comes first, breaking "the answer comes next".
    // Total at least 4, so another split (not a, not b) always exists for step 2.
    let a = 0;
    let b = 0;
    do {
      a = randInt(1, 11);
      b = randInt(1, Math.min(9, 20 - a));
    } while (a + b < 4);
    const total = a + b;
    // Step 2: the same total split another way (not a, not b), so nothing is copied.
    const c = otherThan(1, total - 1, [a, b]);
    return {
      title: "The box comes first",
      bucket: "equalSignUnknownLeft",
      story: `☐ = ${a} + ${b}`,
      visual: (done: number, help?: VisualHelp) =>
        done >= 1 || pointing(help, 0) ? (
          <Num n={total} tone="a" splitAt={a} tone2="b" label={done >= 1} />
        ) : (
          <Row>
            <Num n={a} tone="a" />
            <Sign>+</Sign>
            <Num n={b} tone="b" />
          </Row>
        ),
      steps: [
        {
          kind: "number",
          prompt: "What number goes in the box?",
          hint: `The box can come first. Add ${a} + ${b}.`,
          showMe: `${a} + ${b}: start at ${Math.max(a, b)}. Count on ${Math.min(a, b)}: ${countWords(Math.max(a, b), total)}.`,
          showMeHoldMs: holdFor(Math.min(a, b)),
          explain: `${a} + ${b} = ${total}, so ☐ = ${total}.`,
          answer: total,
        },
        {
          kind: "number",
          prompt: `Now ${total} = ${c} + ☐. What number goes in the box?`,
          hint: `${c} and what make ${total}?`,
          showMe: `Start at ${c}. Count on to ${total}: ${countWords(c, total)}. That is ${total - c}.`,
          showMeHoldMs: holdFor(total - c),
          explain: `${total} = ${c} + ${total - c}.`,
          answer: total - c,
        },
      ],
      wrapUp: `${total} = ${a} + ${b} = ${c} + ${total - c}.`,
    };
  }
  // A + B = C + ☐ — adding on both sides.
  let a = 0;
  let b = 0;
  do {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } while (a + b > 18);
  const total = a + b;
  const c = otherThan(1, total - 1, [a, b]);
  const d = total - c;
  return {
    title: "Adding on both sides",
    bucket: "equalSignUnknownLeft",
    story: `${a} + ${b} = ${c} + ☐`,
    // "Show me" on the box: the other side, split the same total another way.
    visual: (done: number, help?: VisualHelp) => (
      <Row>
        {done >= 1 || pointing(help, 0) ? <Num n={total} tone="a" label={done >= 1} /> : (
          <>
            <Num n={a} tone="a" />
            <Sign>+</Sign>
            <Num n={b} tone="a" />
          </>
        )}
        <Sign>=</Sign>
        {done >= 2 || pointing(help, 1) ? <Num n={total} tone="b" splitAt={c} tone2="c" label={done >= 2} /> : <Num n={c} tone="b" />}
      </Row>
    ),
    steps: [
      { kind: "number", prompt: `Add up the first side: ${a} + ${b} = ?`, hint: `Start at ${Math.max(a, b)}. Count on ${Math.min(a, b)}.`, explain: `${a} + ${b} = ${total}.`, answer: total },
      {
        kind: "number",
        prompt: "What number goes in the box?",
        hint: `${c} and what make ${total}?`,
        showMe: `Start at ${c}. Count on to ${total}: ${countWords(c, total)}. That is ${d}.`,
        showMeHoldMs: holdFor(d),
        explain: `${c} + ${d} = ${total}, the same as ${a} + ${b}.`,
        answer: d,
      },
    ],
    wrapUp: `${a} + ${b} = ${c} + ${d}. Both sides are ${total}.`,
  };
}

/** A wrong total near the real one, inside lo..hi (default 0..20). */
const nearMiss = (t: number, lo = 0, hi = 20) => {
  const options = [-2, -1, 1, 2].map((k) => t + k).filter((w) => w >= lo && w <= hi);
  return options[randInt(0, options.length - 1)];
};

const yesNo = (eq: string, isTrue: boolean, hint: string, explain: string): Step =>
  choice({ prompt: isItTrue(eq), hint, explain }, isTrue ? "Yes, true" : "No, false", [isTrue ? "No, false" : "Yes, true"]);

/**
 * "Is this true?" — the answer (yes/no) is decided first, 50/50, then the
 * equation is built to fit. Every kind but "n = n" has a typed "add it up"
 * step first, so the bucket can't be passed by guessing.
 */
function trueFalseTrapProblem(): Problem {
  const kind = ["sumRight", "sumLeft", "bothSides", "subtract", "same"][randInt(0, 4)];
  // "n = n" (1 kind in 5) is always true, so the other kinds are true 3 times in 8: "Yes" is right half the time overall.
  const isTrue = kind === "same" || Math.random() < 0.375;
  const title = "Is it true?";

  if (kind === "same") {
    // Needs no adding at all: the same number on both sides.
    const n = randInt(1, 20);
    return {
      title,
      bucket: "trueFalseTrap",
      story: `${n} = ${n}`,
      visual: () => (
        <Row>
          <Num n={n} tone="a" />
          <Sign>=</Sign>
          <Num n={n} tone="b" />
        </Row>
      ),
      steps: [yesNo(`${n} = ${n}`, true, "Look at both sides. Are they the same?", `${n} is the same as ${n}. It is true.`)],
      wrapUp: `${n} = ${n} is true. Both sides are ${n}.`,
    };
  }

  if (kind === "subtract") {
    const a = randInt(5, 20);
    const b = randInt(1, Math.min(9, a - 1));
    const t = a - b;
    const shown = isTrue ? t : nearMiss(t);
    const eq = Math.random() < 0.5 ? `${a} − ${b} = ${shown}` : `${shown} = ${a} − ${b}`;
    return {
      title,
      bucket: "trueFalseTrap",
      story: eq,
      visual: (done: number, help?: VisualHelp) => <Num n={a} tone="c" crossFrom={done >= 1 || pointing(help, 0) ? t : undefined} />,
      steps: [
        { kind: "number", prompt: `${a} − ${b} = ?`, hint: `Start at ${a}. Count back ${b}.`, showMe: `Start at ${a}. Count back ${b}: ${countWords(a, t)}.`, showMeHoldMs: holdFor(b), explain: `${a} − ${b} = ${t}.`, answer: t },
        yesNo(eq, isTrue, "Look at both sides. Are they the same?", isTrue ? `${a} − ${b} = ${t}. Both sides are ${t}. It is true.` : `${a} − ${b} = ${t}, not ${shown}. It is false.`),
      ],
      wrapUp: `${a} − ${b} = ${t}.`,
    };
  }

  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const t = a + b;

  if (kind === "bothSides") {
    // a + b = c + d: true when c + d is the same total; false when it is off by a little.
    // At most 18, so it can be written as two numbers of 9 or less.
    const otherTotal = isTrue ? t : nearMiss(t, 0, 18);
    const c = randInt(Math.max(0, otherTotal - 9), Math.min(9, otherTotal));
    const d = otherTotal - c;
    const eq = `${a} + ${b} = ${c} + ${d}`;
    return {
      title,
      bucket: "trueFalseTrap",
      story: eq,
      visual: (done: number, help?: VisualHelp) => (
        <Row>
          {done >= 1 || pointing(help, 0) ? <Num n={t} tone="a" label={done >= 1} /> : <Num n={a} tone="a" />}
          {!(done >= 1 || pointing(help, 0)) && (
            <>
              <Sign>+</Sign>
              <Num n={b} tone="a" />
            </>
          )}
          <Sign>=</Sign>
          {done >= 2 || pointing(help, 1) ? <Num n={otherTotal} tone="b" label={done >= 2} /> : <Num n={c} tone="b" />}
          {!(done >= 2 || pointing(help, 1)) && (
            <>
              <Sign>+</Sign>
              <Num n={d} tone="b" />
            </>
          )}
        </Row>
      ),
      steps: [
        { kind: "number", prompt: `Add up the first side: ${a} + ${b} = ?`, hint: `Start at ${Math.max(a, b)}. Count on ${Math.min(a, b)}.`, explain: `${a} + ${b} = ${t}.`, answer: t },
        { kind: "number", prompt: `Add up the other side: ${c} + ${d} = ?`, hint: `Start at ${Math.max(c, d)}. Count on ${Math.min(c, d)}.`, explain: `${c} + ${d} = ${otherTotal}.`, answer: otherTotal },
        yesNo(eq, isTrue, "Do both sides match?", isTrue ? `Both sides are ${t}. It is true.` : `${t} and ${otherTotal} are not the same. It is false.`),
      ],
      wrapUp: isTrue ? `${eq}. Both sides are ${t}.` : `${a} + ${b} = ${t}. ${c} + ${d} = ${otherTotal}. Not the same.`,
    };
  }

  // a + b = t (sumRight) or t = a + b (sumLeft: the total comes first).
  const shown = isTrue ? t : nearMiss(t);
  const eq = kind === "sumRight" ? `${a} + ${b} = ${shown}` : `${shown} = ${a} + ${b}`;
  return {
    title,
    bucket: "trueFalseTrap",
    story: eq,
    visual: (done: number, help?: VisualHelp) =>
      done >= 1 || pointing(help, 0) ? (
        <Num n={t} tone="a" splitAt={a} tone2="b" label={done >= 1} />
      ) : (
        <Row>
          <Num n={a} tone="a" />
          <Sign>+</Sign>
          <Num n={b} tone="b" />
        </Row>
      ),
    steps: [
      {
        kind: "number",
        prompt: `${a} + ${b} = ?`,
        hint: `Start at ${Math.max(a, b)}. Count on ${Math.min(a, b)}.`,
        showMe: `Start at ${Math.max(a, b)}. Count on ${Math.min(a, b)}: ${countWords(Math.max(a, b), t)}.`,
        showMeHoldMs: holdFor(Math.min(a, b)),
        explain: `${a} + ${b} = ${t}.`,
        answer: t,
      },
      yesNo(eq, isTrue, kind === "sumLeft" ? "The total can come first. Do both sides match?" : "Add it up. Is it really true?", isTrue ? `${a} + ${b} = ${t}. It is true.` : `${a} + ${b} = ${t}, not ${shown}. It is false.`),
    ],
    wrapUp: `${a} + ${b} = ${t}.`,
  };
}

/** "Which number is missing?" choices: for adding, the first / second number or the total; for taking away, the first / second number or what is left. */
const ADD_PARTS = ["the first number", "the second number", "the total"];
const TAKE_PARTS = ["the first number", "the second number", "what is left"];

function findUnknownNonFinalProblem(): Problem {
  const shape = ["addSecond", "addFirst", "takeSecond", "takeFirst", "total"][randInt(0, 4)];
  const title = "Find the missing number";
  const partStep = (parts: string[], idx: number, hint: string) =>
    choice({ prompt: "Which number is missing?", hint, explain: `${parts[idx][0].toUpperCase()}${parts[idx].slice(1)} is missing.` }, parts[idx], parts.filter((_, i) => i !== idx));

  if (shape === "addSecond" || shape === "addFirst") {
    const known = randInt(1, 15);
    const unknown = randInt(1, Math.min(9, 20 - known));
    const c = known + unknown;
    const story = shape === "addSecond" ? `${known} + ☐ = ${c}` : `☐ + ${known} = ${c}`;
    return {
      title,
      bucket: "findUnknownNonFinal",
      story,
      // Before help: the total, all one color. Stuck on the box: the known part and the rest.
      visual: (done: number, help?: VisualHelp) => (done >= 2 || pointing(help, 1) ? <Num n={c} tone="a" splitAt={known} tone2="c" /> : <Num n={c} tone="a" />),
      steps: [
        partStep(ADD_PARTS, shape === "addSecond" ? 1 : 0, "Where is the box?"),
        {
          kind: "number",
          prompt: "What number goes in the box?",
          hint: `Count on from ${known} to ${c}.`,
          showMe: `Start at ${known}. Count on to ${c}: ${countWords(known, c)}. That is ${unknown}.`,
          showMeHoldMs: holdFor(unknown),
          explain: shape === "addSecond" ? `${known} + ${unknown} = ${c}.` : `${unknown} + ${known} = ${c}.`,
          answer: unknown,
        },
      ],
      wrapUp: shape === "addSecond" ? `${known} + ${unknown} = ${c}.` : `${unknown} + ${known} = ${c}.`,
    };
  }
  if (shape === "takeSecond") {
    // a − ☐ = c: the box is the number you take away (1–9).
    const a = randInt(5, 19);
    const unknown = randInt(1, Math.min(9, a));
    const c = a - unknown;
    return {
      title,
      bucket: "findUnknownNonFinal",
      story: `${a} − ☐ = ${c}`,
      visual: (done: number, help?: VisualHelp) => <Num n={a} tone="c" crossFrom={done >= 2 || pointing(help, 1) ? c : undefined} />,
      steps: [
        partStep(TAKE_PARTS, 1, "Where is the box?"),
        {
          kind: "number",
          prompt: "What number goes in the box?",
          hint: "The box is the number you take away.",
          showMe: `Start at ${a}. Count back to ${c}: ${countWords(a, c)}. That is ${unknown}.`,
          showMeHoldMs: holdFor(unknown),
          explain: `${a} − ${unknown} = ${c}.`,
          answer: unknown,
        },
      ],
      wrapUp: `${a} − ${unknown} = ${c}.`,
    };
  }
  if (shape === "takeFirst") {
    // ☐ − b = c (1.OA.8): the box is the start. Add back what was taken away.
    const b = randInt(1, 9);
    const c = randInt(0, 20 - b);
    const unknown = b + c;
    return {
      title,
      bucket: "findUnknownNonFinal",
      story: `☐ − ${b} = ${c}`,
      visual: (done: number, help?: VisualHelp) => (done >= 2 || pointing(help, 1) ? <Num n={unknown} tone="a" splitAt={c} tone2="c" label={done >= 2} /> : <Num n={c} tone="a" />),
      steps: [
        partStep(TAKE_PARTS, 0, "Where is the box?"),
        {
          kind: "number",
          prompt: "What number goes in the box?",
          hint: `${b} went away. Add ${b === 1 ? "it" : "them"} back to ${c}.`,
          showMe: `${c} ${c === 1 ? "is" : "are"} left. Add back the ${b}: ${c} + ${b} = ${unknown}.`,
          showMeHoldMs: 3000,
          explain: `${unknown} − ${b} = ${c}.`,
          answer: unknown,
        },
      ],
      wrapUp: `${unknown} − ${b} = ${c}.`,
    };
  }
  // a + b = ☐ — so "the total" is sometimes the missing part.
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const total = a + b;
  return {
    title,
    bucket: "findUnknownNonFinal",
    story: `${a} + ${b} = ☐`,
    visual: (done: number, help?: VisualHelp) =>
      done >= 2 || pointing(help, 1) ? (
        <Num n={total} tone="a" splitAt={a} tone2="b" label={done >= 2} />
      ) : (
        <Row>
          <Num n={a} tone="a" />
          <Sign>+</Sign>
          <Num n={b} tone="b" />
        </Row>
      ),
    steps: [
      partStep(ADD_PARTS, 2, "Where is the box?"),
      {
        kind: "number",
        prompt: "What number goes in the box?",
        hint: `Start at ${Math.max(a, b)}. Count on ${Math.min(a, b)}.`,
        showMe: `Start at ${Math.max(a, b)}. Count on ${Math.min(a, b)}: ${countWords(Math.max(a, b), total)}.`,
        showMeHoldMs: holdFor(Math.min(a, b)),
        explain: `${a} + ${b} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `${a} + ${b} = ${total}.`,
  };
}

function equalSignProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "equalSignUnknownLeft") return equalSignUnknownLeftProblem();
  if (bucket === "trueFalseTrap") return trueFalseTrapProblem();
  return findUnknownNonFinalProblem();
}

export const equalSignAndEquations: Unit = {
  id: "equalSignAndEquations",
  title: "Equal Sign and Number Sentences",
  goal: "Learn what = means. Find the missing number.",
  standard: "1.OA.7, 1.OA.8",
  keyIdea: (
    <>
      <p>= means the same as. Both sides have the same amount.</p>
      <p>The missing number can be anywhere.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoning about number sentences, re-derived each time — not a fact
  // to memorize (contrast Unit 5's fluency buckets).
  problems: [{ label: "Equal Sign", make: equalSignProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: equalSignAndEquationsTest,
};
