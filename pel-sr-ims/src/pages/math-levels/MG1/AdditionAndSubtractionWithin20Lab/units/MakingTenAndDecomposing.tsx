import { useState, type ReactNode } from "react";
import { TenFrameGroup, PartPartWhole, EquationStrip, KeepBreakFrames, type BondPart, type Tone } from "../diagrams";
import { makeTenBreakdown, subtractThroughTenBreakdown } from "../logic";
import { randInt } from "../../../shared/lib/math";
import { choice, pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { makingTenAndDecomposingTest } from "./MakingTenAndDecomposingTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx): one short question at a time,
// ten-frame pictures, typed answers. Targets the plan's named misconceptions:
// (1) breaking apart the WRONG number (always the second one, instead of the
// SMALLER one — the bigger number is closer to 10, so keep it whole), and
// (2) making ten as one memorized answer instead of a way that works again —
// tested on a NEW fact (7 + 5). Each question gets a "Look here" pointer
// after its 2nd wrong try; "show it" comes on the 3rd.

/** CFU "Look here" pointers: the Explore spot that teaches each question (shown after its 2nd miss). */
const LOOK = {
  // Asks, doesn't tell: the answer buttons are plain "6" / "9".
  keep: { target: "mt-keep", label: "Explore: keep the bigger number whole", say: "Look here. Which number is closer to 10?" },
  bond: { target: "mt-bond", label: "Explore: the number bond and the two number sentences", say: "Look here. Fill the ten first." },
  any: { target: "mt-any", label: "Explore: try new numbers", say: "Look here. Fill the ten. Then add the rest." },
  sub: { target: "mt-sub", label: "Explore: get to 10 first", say: "Look here. Get to 10 first." },
};

/** Fixed width so the SVG bond keeps its size inside wrapping flex rows. */
function Bond({ whole, parts }: { whole: number | null; parts: [BondPart, BondPart] }) {
  return (
    <div style={{ width: 280, maxWidth: "100%" }}>
      <PartPartWhole whole={whole} parts={parts} />
    </div>
  );
}

/** A ten-frame with its number underneath — the picture first, the numeral as its name. */
function Frame({ value, tone, splitAt, tone2, highlightEmpty, crossFrom, label }: { value: number; tone: Tone; splitAt?: number; tone2?: Tone; highlightEmpty?: boolean; crossFrom?: number; label?: ReactNode }) {
  return (
    <div>
      <TenFrameGroup value={value} tone={tone} splitAt={splitAt} tone2={tone2} highlightEmpty={highlightEmpty} crossFrom={crossFrom} />
      <ReadAloud as="p" style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, margin: "4px 0 0" }}>
        {label ?? value}
      </ReadAloud>
    </div>
  );
}

const Sign = ({ children }: { children: string }) => <span style={{ fontSize: "1.9rem", fontWeight: 700 }}>{children}</span>;

const Equations = ({ children }: { children: ReactNode }) => <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>{children}</div>;

const pictureRow = { gap: 24, alignItems: "center" } as const;

/** big + small on ten-frames, in the order written: the bigger number in tone a, the smaller in tone b. */
function AddPicture({ first, second, lightBig }: { first: number; second: number; lightBig?: boolean }) {
  const big = Math.max(first, second);
  const frame = (n: number) => (n === big ? <Frame value={n} tone="a" highlightEmpty={lightBig} /> : <Frame value={n} tone="b" />);
  return (
    <div className="control-row" style={pictureRow}>
      {frame(first)}
      <Sign>+</Sign>
      {frame(second)}
    </div>
  );
}

/** The ten is made: the bigger number plus enough of the smaller fills one frame; the rest sits beside it. */
function MadeTen({ big, small }: { big: number; small: number }) {
  const { addToA, remainder } = makeTenBreakdown(big, small);
  return (
    <div className="control-row" style={pictureRow}>
      <Frame value={10} tone="a" splitAt={big} tone2="b" label={`${big} + ${addToA}`} />
      <Sign>+</Sign>
      <Frame value={remainder} tone="c" />
    </div>
  );
}

function MakeTenCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        // The core trap: the bigger number is written SECOND, so "always break
        // apart the second number" is wrong here. 9 is drawn in the bigger
        // number's color (tone a), as in Explore. Typed, not a two-button
        // pick: one wrong tap would leave only the answer (C2-01).
        (done) => (
          <TypeCheck
            n={1}
            prompt="6 + 9. Which number do you break apart?"
            answer={6}
            tone="b"
            picture={(m) => (m === "show" || m === "done" ? <MadeTen big={9} small={6} /> : <AddPicture first={6} second={9} lightBig={m === "wrong"} />)}
            nudge="Not yet. Keep the bigger number whole."
            why={{ 9: "Not yet. Keep the bigger number whole." }}
            showText="Watch: 9 needs just 1 more. 1 from the 6 fills the ten."
            praise="Yes! Keep 9 whole. Break apart 6."
            look={LOOK.keep}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="8 + 6. How many more does 8 need to make 10?"
            answer={2}
            tone="b"
            picture={(m) => (m === "show" || m === "done" ? <MadeTen big={8} small={6} /> : <AddPicture first={8} second={6} lightBig={m === "wrong"} />)}
            nudge="Count the empty boxes."
            why={{ 6: "Keep 8 whole. Count its empty boxes." }}
            showText="Watch: 2 boxes are empty. 2 from the 6 fill them."
            praise="Yes! 8 and 2 make 10."
            look={LOOK.bond}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="So 8 + 6 = ?"
            answer={14}
            tone="c"
            picture={(m) =>
              m === "show" || m === "done" ? (
                <MadeTen big={8} small={6} />
              ) : (
                <div className="control-row" style={pictureRow}>
                  <Frame value={8} tone="a" highlightEmpty={m === "wrong"} />
                  <Sign>+</Sign>
                  <Frame value={6} tone="b" splitAt={2} tone2="c" />
                  <Bond whole={6} parts={[{ value: 2, tone: "b" }, { value: 4, tone: "c" }]} />
                </div>
              )
            }
            nudge="Fill the ten first. Then add the rest."
            why={{ 4: "That is the rest. Add it to 10.", 10: "That is the ten. Add the rest too." }}
            showText="Watch: 8 and 2 make 10. 4 more is 14."
            praise="Yes! 8 + 6 = 14."
            look={LOOK.bond}
            onComplete={done}
          />
        ),
        // A NEW fact: making ten works again, not one memorized answer.
        (done) => (
          <TypeCheck
            n={4}
            prompt="7 + 5. Make a ten. What is the total?"
            answer={12}
            tone="c"
            picture={(m) => (m === "show" || m === "done" ? <MadeTen big={7} small={5} /> : <AddPicture first={7} second={5} lightBig={m === "wrong"} />)}
            nudge="Keep 7 whole. Fill the ten first."
            why={{ 2: "That is the rest. Add it to 10.", 10: "That is the ten. Add the rest too." }}
            showText="Watch: 3 from the 5 fill the ten. 2 more is 12."
            praise="Yes! Making ten works again."
            look={LOOK.any}
            onComplete={done}
          />
        ),
        // The same idea for taking away: get to 10 first.
        (done) => (
          <TypeCheck
            n={5}
            prompt="13 − 5. Get to 10 first. How many do you take away first?"
            answer={3}
            tone="b"
            picture={(m) => (m === "ask" ? <Frame value={13} tone="c" /> : <Frame value={13} tone="c" splitAt={10} tone2="b" crossFrom={m === "wrong" ? undefined : 10} />)}
            nudge="How many are past 10?"
            why={{ 5: "Take away just enough to get to 10." }}
            showText="Watch: 3 are past 10. Take those 3 away."
            praise="Yes! 13 − 3 = 10."
            look={LOOK.sub}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={6}
            prompt="13 − 5 = ?"
            answer={8}
            tone="a"
            picture={(m) =>
              m === "show" || m === "done" ? (
                <Frame value={13} tone="c" splitAt={8} tone2="b" crossFrom={8} />
              ) : (
                <div className="control-row" style={pictureRow}>
                  <Frame value={13} tone="c" splitAt={10} tone2="b" crossFrom={10} />
                  <Bond whole={5} parts={[{ value: 3, tone: "b" }, { value: 2, tone: "a" }]} />
                </div>
              )
            }
            nudge="3 are gone. Take away the rest of the 5."
            why={{ 10: "Take away the rest of the 5 too.", 18: "Take away. Don't add." }}
            showText="Watch: 3 are gone. 2 more go from the ten."
            praise="Yes! 13 − 5 = 8."
            look={LOOK.sub}
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

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"add" | "subtract" | "same">("add");
  const [a, setA] = useState(9);
  const [b, setB] = useState(4);
  const [start, setStart] = useState(14);
  const [sub, setSub] = useState(6);
  // "Same total": two bonds with the same whole (not the CFU's 8 + 6 or 7 + 5),
  // starting where "Move one over" works both ways.
  const [s1, setS1] = useState(6);
  const [s2, setS2] = useState(5);
  const [moved, setMoved] = useState(0);

  const addBreak = makeTenBreakdown(a, b);
  const subBreak = subtractThroughTenBreakdown(start, sub);
  const sameTotal = s1 + s2;
  // A CFU "Look here" for a spot shown only in the other mode switches to that mode first.
  useLookHereRequest((id) => {
    if (id === "mt-sub") setMode("subtract");
    else if (id === "mt-keep" || id === "mt-bond" || id === "mt-any") setMode("add");
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="Show"
          value={mode}
          onChange={setMode}
          options={[
            { id: "add", label: "Making ten" },
            { id: "subtract", label: "Get to 10 first" },
            { id: "same", label: "Same total" },
          ]}
        />
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

      {mode === "add" && (
        <>
          <div {...lookHereSpot("mt-any")}>
            {/* Every pair here makes a ten: the total is 11 or more, so the
                smaller number always has some left after filling the ten.
                Each stepper's range comes from the other, so nothing is
                ever rounded into range. */}
            <div className="control-row" data-readaloud-part>
              <Stepper label="Bigger number" value={a} min={Math.max(6, b + 1, 11 - b)} max={9} step={1} onChange={setA} tone="a" />
              <Stepper label="Smaller number" value={b} min={11 - a} max={a - 1} step={1} onChange={setB} tone="b" />
            </div>
            <ReadAloud as="p" className="muted small" data-look-here-key>
              Try new numbers. Making ten works every time.
            </ReadAloud>
          </div>
          <div {...lookHereSpot("mt-keep")}>
            {/* Keep box (solid, big frame) vs Break box (dashed, small frame); the moving part hops into the ten on a loop. */}
            <KeepBreakFrames big={a} small={b} />
            <ReadAloud as="p" className="muted small" data-look-here-key>
              Keep the bigger number whole. It is closer to 10. Break apart the smaller number.
            </ReadAloud>
          </div>
          <div {...lookHereSpot("mt-bond")}>
            <div className="control-row" style={{ gap: 32, alignItems: "center" }} data-readaloud-part>
              <Bond
                whole={b}
                parts={[
                  { value: addBreak.addToA, tone: "b" },
                  { value: addBreak.remainder, tone: "c" },
                ]}
              />
              <Equations>
                <EquationStrip tokens={[{ value: a, tone: "a" }, "+", { value: addBreak.addToA, tone: "b" }, "=", addBreak.ten]} />
                <EquationStrip tokens={[addBreak.ten, "+", { value: addBreak.remainder, tone: "c" }, "=", addBreak.total]} />
              </Equations>
            </div>
            <ReadAloud as="p" className="muted small">
              This is a number bond. The top is the whole. The two circles are its parts.
            </ReadAloud>
            <ReadAloud as="p" className="muted small" data-look-here-key>
              Fill the ten first. Then add what is left.
            </ReadAloud>
          </div>
        </>
      )}
      {mode === "subtract" && (
        <>
          {/* Every pair here goes past 10: take away more than the ones past 10. */}
          <div className="control-row" data-readaloud-part>
            <Stepper label="Start" value={start} min={11} max={Math.min(19, 9 + sub)} step={1} onChange={setStart} tone="c" />
            <Stepper label="Take away" value={sub} min={(start % 10) + 1} max={9} step={1} onChange={setSub} tone="b" />
          </div>
          <div {...lookHereSpot("mt-sub")}>
            <Frame value={start} tone="c" splitAt={subBreak.ten} tone2="b" />
            <div className="control-row" style={{ gap: 32, alignItems: "center" }} data-readaloud-part>
              <Bond
                whole={sub}
                parts={[
                  { value: subBreak.toTen, tone: "b" },
                  { value: subBreak.remainder, tone: "a" },
                ]}
              />
              <Equations>
                <EquationStrip tokens={[{ value: start, tone: "c" }, "−", { value: subBreak.toTen, tone: "b" }, "=", subBreak.ten]} />
                <EquationStrip tokens={[subBreak.ten, "−", { value: subBreak.remainder, tone: "a" }, "=", subBreak.total]} />
              </Equations>
            </div>
            <ReadAloud as="p" className="muted small" data-look-here-key>
              Take away to land on 10 first. Then take away the rest.
            </ReadAloud>
          </div>
        </>
      )}
      {mode === "same" && (
        <>
          <div className="control-row" data-readaloud-part>
            <Stepper
              label="First number"
              value={s1}
              min={1}
              max={Math.min(9, 18 - s2)}
              step={1}
              onChange={(v) => {
                setS1(v);
                setMoved(0);
              }}
              tone="a"
            />
            <Stepper
              label="Second number"
              value={s2}
              min={1}
              max={Math.min(9, 18 - s1)}
              step={1}
              onChange={(v) => {
                setS2(v);
                setMoved(0);
              }}
              tone="b"
            />
          </div>
          <div className="control-row" style={{ gap: 32, alignItems: "center" }} data-readaloud-part>
            <Bond
              whole={sameTotal}
              parts={[
                { value: s1, tone: "a" },
                { value: s2, tone: "b" },
              ]}
            />
            <Bond
              whole={sameTotal}
              parts={[
                { value: s1 - moved, tone: "a" },
                { value: s2 + moved, tone: "b" },
              ]}
            />
          </div>
          <div className="control-row" data-readaloud-part>
            {/* Gray out at the edges instead of rounding: a part stays 1 to 9. */}
            <button type="button" className="btn primary" disabled={s1 - moved <= 1 || s2 + moved >= 9} onClick={() => setMoved((m) => m + 1)}>
              Move one over
            </button>
            <button type="button" className="btn ghost" disabled={s2 + moved <= 1 || s1 - moved >= 9} onClick={() => setMoved((m) => m - 1)}>
              Move one back
            </button>
          </div>
          <EquationStrip tokens={[{ value: s1, tone: "a" }, "+", { value: s2, tone: "b" }, "=", { value: s1 - moved, tone: "a" }, "+", { value: s2 + moved, tone: "b" }]} />
          <ReadAloud as="p" className="muted small">
            Move one over. The total stays the same.
          </ReadAloud>
        </>
      )}
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <MakeTenCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "makeTenNearTen" | "makeTenLargerGap" | "subtractBridge" | "equivalentSum";
const BUCKETS: Bucket[] = ["makeTenNearTen", "makeTenLargerGap", "subtractBridge", "equivalentSum"];

/**
 * big + small (big > small, total past 10), written in either order (the
 * smaller number first half the time — the CFU's trap). Step 1 asks which
 * number to break apart; the ten is always filled by the bigger number.
 */
function makeTenAdditionProblem(big: number, small: number, bucket: Bucket): Problem {
  const { gap, remainder, total } = makeTenBreakdown(big, small);
  const smallFirst = Math.random() < 0.5;
  const [x, y] = smallFirst ? [small, big] : [big, small];
  const frame = (n: number, lightBig: boolean, split: boolean) =>
    n === big ? <Frame value={big} tone="a" highlightEmpty={lightBig} /> : <Frame value={small} tone="b" splitAt={split ? gap : undefined} tone2="c" />;
  return {
    title: "Making ten",
    bucket,
    story: `Find ${x} + ${y}. Make a ten.`,
    visual: (done: number, help?: VisualHelp) => {
      // Step 3's "Show me" (and the finished picture): the ten is MADE.
      if (done >= 3) return <MadeTen big={big} small={small} />;
      // After the gap is found: the smaller number split into "fills the ten" + "the rest".
      const split = done >= 2;
      return (
        <div className="control-row" style={pictureRow} data-readaloud-part>
          {/* Help ladder: light up the bigger number's empty boxes. */}
          {frame(x, pointing(help, 0) || pointing(help, 1) || pointing(help, 2), split)}
          <Sign>+</Sign>
          {frame(y, pointing(help, 0) || pointing(help, 1) || pointing(help, 2), split)}
          {split && (
            <Bond
              whole={small}
              parts={[
                { value: gap, tone: "b" },
                { value: remainder, tone: "c" },
              ]}
            />
          )}
        </div>
      );
    },
    steps: [
      choice(
        { prompt: `${x} + ${y}. Which number do you break apart?`, hint: "Keep the bigger number whole. It is closer to 10.", explain: `Break apart ${small}. Keep ${big} whole.` },
        String(small),
        [String(big)] // misconception: breaking apart the number written second
      ),
      {
        kind: "number",
        prompt: `How many more does ${big} need to make 10?`,
        hint: "Count the empty boxes.",
        showMe: `${big} fills ${big} boxes. ${gap} ${gap === 1 ? "box is" : "boxes are"} empty.`,
        showMeHoldMs: 2000,
        explain: `${big} + ${gap} = 10.`,
        answer: gap,
        tone: "b",
      },
      {
        kind: "number",
        prompt: `So ${x} + ${y} = ?`,
        hint: "Fill the ten first. Then add the rest.",
        showMe: `${big} and ${gap} make 10. ${remainder} more is ${total}.`,
        showMeHoldMs: 3000,
        explain: `${big} + ${gap} = 10. 10 + ${remainder} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `${x} + ${y} = ${total}. ${big} + ${gap} = 10, then 10 + ${remainder} = ${total}.`,
  };
}

function subtractBridgeProblem(): Problem {
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 18);
    sub = randInt(2, 9);
  } while (start % 10 >= sub || start - sub < 0);
  const { toTen, remainder, ten, total } = subtractThroughTenBreakdown(start, sub);
  return {
    title: "Get to 10 first",
    bucket: "subtractBridge",
    story: `Find ${start} − ${sub}. Get to 10 first.`,
    visual: (done: number, help?: VisualHelp) => (
      <div className="control-row" style={pictureRow} data-readaloud-part>
        {/* Help ladder: color the ones past 10 when the student is stuck on step 1.
            Taking away, shown: once the jump down to 10 is found (or shown),
            the ones past 10 are crossed out; step 3's "Show me" and the
            finished picture cross out the rest too, so what's left is the answer. */}
        <Frame value={start} tone="c" splitAt={done >= 1 || pointing(help, 0) ? ten : undefined} tone2="b" crossFrom={done >= 3 ? total : done >= 1 ? ten : undefined} />
        <Bond
          whole={sub}
          parts={[
            { value: done >= 1 ? toTen : null, tone: "b" },
            { value: done >= 2 ? remainder : null, tone: "a" },
          ]}
        />
      </div>
    ),
    steps: [
      {
        kind: "number",
        prompt: `How many do you take away to get to 10?`,
        hint: `How many are past 10 in ${start}?`,
        showMe: `${start} is 10 and ${toTen} more. Take away ${toTen} to land on 10.`,
        showMeHoldMs: 2000,
        explain: `${start} − ${toTen} = ${ten}.`,
        answer: toTen,
        tone: "b",
      },
      { kind: "number", prompt: `${sub} is ${toTen} and how many more?`, hint: `${sub} − ${toTen} = ?`, explain: `${sub} − ${toTen} = ${remainder} more to take away.`, answer: remainder },
      {
        kind: "number",
        prompt: `${ten} − ${remainder} = ?`,
        hint: "Take the rest away from 10.",
        showMe: `${toTen} ${toTen === 1 ? "is" : "are"} gone. Take ${remainder} more from 10. ${total} are left.`,
        showMeHoldMs: 3000,
        explain: `${ten} − ${remainder} = ${total}, so ${start} − ${sub} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `${start} − ${sub} = ${total}. ${start} − ${toTen} = 10, then 10 − ${remainder} = ${total}.`,
  };
}

function equivalentSumProblem(): Problem {
  let a1 = 0;
  let b1 = 0;
  let k = 0;
  let a2 = 0;
  let b2 = 0;
  // Step 3 uses a different first number again, so its answer can't be copied.
  const thirdsFor = (t: number) => Array.from({ length: 9 }, (_, i) => i + 1).filter((n) => n !== a1 && n !== a2 && t - n >= 1 && t - n <= 9);
  do {
    a1 = randInt(2, 8);
    b1 = randInt(2, 9);
    k = [-3, -2, -1, 1, 2, 3][randInt(0, 5)];
    a2 = a1 + k;
    b2 = a1 + b1 - a2;
    // b1 differs from a1 and a2, so "What happens to {b1}?" can only mean one number.
  } while (a2 < 1 || a2 > 9 || b2 < 1 || b2 > 9 || a1 + b1 > 18 || b1 === a1 || b1 === a2 || thirdsFor(a1 + b1).length === 0);
  const total = a1 + b1;
  const thirds = thirdsFor(total);
  const a3 = thirds[randInt(0, thirds.length - 1)];
  const b3 = total - a3;
  const absK = Math.abs(k);
  const bigger = k > 0;
  return {
    title: "Same total",
    bucket: "equivalentSum",
    story: `${a1} + ${b1} = ${a2} + ☐`,
    // Two bonds, same whole: the parts change, the whole doesn't.
    visual: (done: number) => (
      <div className="control-row" style={pictureRow} data-readaloud-part>
        <Bond
          whole={total}
          parts={[
            { value: a1, tone: "a" },
            { value: b1, tone: "b" },
          ]}
        />
        <Bond
          whole={total}
          parts={[
            { value: a2, tone: "a" },
            { value: done >= 2 ? b2 : null, tone: "b" },
          ]}
        />
        {done >= 2 && (
          <Bond
            whole={total}
            parts={[
              { value: a3, tone: "a" },
              { value: done >= 3 ? b3 : null, tone: "b" },
            ]}
          />
        )}
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `${a1} got ${absK} ${bigger ? "bigger" : "smaller"}. It is ${a2} now. What happens to ${b1}?`,
          hint: "Move one over. The total stays the same.",
          explain: `The total stays the same. ${b1} gets ${bigger ? "smaller" : "bigger"} by ${absK}.`,
        },
        `It gets ${bigger ? "smaller" : "bigger"} by ${absK}`,
        [`It gets ${bigger ? "bigger" : "smaller"} by ${absK}`, "It stays the same"]
      ),
      { kind: "number", prompt: `${a1} + ${b1} = ${a2} + ☐. What number goes in the box?`, hint: `Make ${b1} ${bigger ? "smaller" : "bigger"} by ${absK}.`, explain: `${a2} + ${b2} = ${total}, the same as ${a1} + ${b1}.`, answer: b2 },
      {
        kind: "number",
        prompt: `Now ${a3} + ☐ = ${total}. What number goes in the box?`,
        hint: "Move one over. The total stays the same.",
        showMe: `${a1} + ${b1} = ${total}. Move ${Math.abs(a3 - a1)} over: ${a3} + ${b3} = ${total}.`,
        showMeHoldMs: 3000,
        explain: `${a3} + ${b3} = ${total}.`,
        answer: b3,
      },
    ],
    wrapUp: `${a1} + ${b1} = ${a2} + ${b2} = ${a3} + ${b3}. The total stays ${total}.`,
  };
}

function makeTenProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "makeTenNearTen") {
    const big = randInt(8, 9);
    const gap = 10 - big;
    // gap + 1: a real leftover. big − 1: always break apart the SMALLER number.
    const small = randInt(gap + 1, big - 1);
    return makeTenAdditionProblem(big, small, bucket);
  }

  if (bucket === "makeTenLargerGap") {
    const big = randInt(6, 7);
    const gap = 10 - big;
    const small = randInt(gap + 1, big - 1); // smaller than big: break apart the smaller number
    return makeTenAdditionProblem(big, small, bucket);
  }

  if (bucket === "subtractBridge") return subtractBridgeProblem();

  return equivalentSumProblem();
}

export const makingTenAndDecomposing: Unit = {
  id: "makingTenAndDecomposing",
  title: "Making Ten",
  goal: "Make a ten to add and take away.",
  standard: "1.OA.6",
  keyIdea: (
    <>
      <p>Keep the bigger number whole. Break apart the smaller number. Fill the ten first. Then add the rest.</p>
      <p>To take away, get to 10 first.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // A reasoning strategy to be re-derived each time, not a fact to memorize.
  problems: [{ label: "Making Ten", make: makeTenProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: makingTenAndDecomposingTest,
};
