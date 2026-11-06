import { useEffect, useState } from "react";
import { CompareRows, TenFrameGroup } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { putTogetherCompareWordProblemsTest } from "./PutTogetherCompareWordProblemsTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { TapSelect } from "../../../shared/components/TapSelect";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions. Targets the plan's named misconceptions:
// subtracting the wrong direction on a "fewer"-phrased Compare problem,
// treating "more than"/"fewer than" as telling you the OPERATION rather
// than which amount is bigger, and treating Both-Addends-Unknown as having
// one right answer. Q3 puts BOTH "more" and "fewer" live in one question,
// per the plan's explicit requirement.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function TotalOrAddendQuestion({ onComplete }: { onComplete?: () => void }) {
  const [role, setRole] = useState("");
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [role, answer].every((v) => String(v).trim() !== "");
  const roleOk = role === "total";
  const answerOk = answer === "9";
  const ok = roleOk && answerOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>1.</b> Mia has 4 green buttons and 5 orange buttons. How many buttons does Mia have IN ALL?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What's unknown?{" "}
          <TapSelect value={role} onChange={(e) => setRole(e.target.value)} style={fieldOk(roleOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="total">the total</option>
            <option value="addend">one of the parts (an addend)</option>
          </TapSelect>
        </label>
        <label>
          Answer:{" "}
          <TapSelect value={answer} onChange={(e) => setAnswer(e.target.value)} style={fieldOk(answerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="9">9</option>
          </TapSelect>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — \"in all\" means the TOTAL. 4 + 5 = 9." : "Not quite — \"in all\" is asking for the TOTAL (both parts combined): 4 + 5 = 9."}
        </ReadAloud>
      )}
    </ReadAloud>
  );
}

/** Both-Addends-Unknown trap: more than one correct split exists. */
function ManyWaysQuestion({ onComplete }: { onComplete?: () => void }) {
  const [waysPicked, setWaysPicked] = useState("");
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [waysPicked, answer].every((v) => String(v).trim() !== "");
  const waysOk = waysPicked === "more";
  const answerOk = answer === "4";
  const ok = waysOk && answerOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>2.</b> Jake has 6 trading cards. Some are sports cards and some are animal cards.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many different ways could the 6 cards split into sports and animal cards?{" "}
          <TapSelect value={waysPicked} onChange={(e) => setWaysPicked(e.target.value)} style={fieldOk(waysOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="one">Exactly one way</option>
            <option value="more">More than one way</option>
          </TapSelect>
        </label>
        <label>
          If 2 are sports cards, how many are animal cards?{" "}
          <TapSelect value={answer} onChange={(e) => setAnswer(e.target.value)} style={fieldOk(answerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
          </TapSelect>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — there's MORE than one way: 2 sports + 4 animal works, but so would 1 + 5, 3 + 3, and others. This story doesn't have one single right split."
            : "Not quite — when both parts are unknown, there's MORE than one valid split (2 + 4, 1 + 5, 3 + 3 all work). For this one way: 2 sports cards leaves 6 − 2 = 4 animal cards."}
        </ReadAloud>
      )}
    </ReadAloud>
  );
}

/** The plan's required question: BOTH "more" and "fewer" phrasings, live,
 *  in the SAME question — same two numbers, same answer, different words. */
function MoreAndFewerSameQuestion({ onComplete }: { onComplete?: () => void }) {
  const [moreAns, setMoreAns] = useState("");
  const [fewerAns, setFewerAns] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [moreAns, fewerAns].every((v) => String(v).trim() !== "");
  const moreOk = moreAns === "4";
  const fewerOk = fewerAns === "4";
  const ok = moreOk && fewerOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>3.</b> Lily has 9 crayons. Ben has 5 crayons.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Lily has how many MORE crayons than Ben?{" "}
          <TapSelect value={moreAns} onChange={(e) => setMoreAns(e.target.value)} style={fieldOk(moreOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="9">9</option>
          </TapSelect>
        </label>
        <label>
          Ben has how many FEWER crayons than Lily?{" "}
          <TapSelect value={fewerAns} onChange={(e) => setFewerAns(e.target.value)} style={fieldOk(fewerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="9">9</option>
          </TapSelect>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — BOTH are 4! \"4 more\" and \"4 fewer\" describe the exact same gap between 9 and 5, just in different words: 9 − 5 = 4."
            : "Not quite — \"more\" and \"fewer\" here describe the SAME gap between Lily's 9 and Ben's 5: 9 − 5 = 4, both times."}
        </ReadAloud>
      )}
    </ReadAloud>
  );
}

/** Direction trap: "fewer" phrasing tempts subtracting in sentence order. */
function FewerDirectionQuestion({ onComplete }: { onComplete?: () => void }) {
  const [calc, setCalc] = useState("");
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [calc, answer].every((v) => String(v).trim() !== "");
  const calcOk = calc === "9-5";
  const answerOk = answer === "4";
  const ok = calcOk && answerOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>4.</b> Ben has 5 crayons. Lily has 9 crayons. How many FEWER crayons does Ben have than Lily?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which subtraction finds the answer?{" "}
          <TapSelect value={calc} onChange={(e) => setCalc(e.target.value)} style={fieldOk(calcOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="5-9">5 − 9</option>
            <option value="9-5">9 − 5</option>
          </TapSelect>
        </label>
        <label>
          Answer:{" "}
          <TapSelect value={answer} onChange={(e) => setAnswer(e.target.value)} style={fieldOk(answerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="9">9</option>
          </TapSelect>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — always subtract the SMALLER from the BIGGER (9 − 5 = 4), no matter whose name is mentioned first in the sentence."
            : "Not quite — \"Ben has 5, Lily has 9\" doesn't mean you subtract in that order. Always subtract the smaller amount from the bigger one: 9 − 5 = 4."}
        </ReadAloud>
      )}
    </ReadAloud>
  );
}

function PutTogetherCompareCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ totalOrAddend: false, manyWays: false, moreFewer: false, direction: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <ReadAloud as="p" className="intro-gate-title">
        Check for understanding: let's make sure put-together and compare stories make sense before you try practice problems.
      </ReadAloud>
      <TotalOrAddendQuestion onComplete={mark("totalOrAddend")} />
      <ManyWaysQuestion onComplete={mark("manyWays")} />
      <MoreAndFewerSameQuestion onComplete={mark("moreFewer")} />
      <FewerDirectionQuestion onComplete={mark("direction")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [redCount, setRedCount] = useState(4);
  const [blueCount, setBlueCount] = useState(5);
  const total = redCount + blueCount;

  const [amountA, setAmountA] = useState(9);
  const [amountB, setAmountB] = useState(5);
  const bigger = Math.max(amountA, amountB);
  const smaller = Math.min(amountA, amountB);
  const diff = bigger - smaller;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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

      <div>
        <ReadAloud as="p" className="muted small">Put together: two parts make a whole.</ReadAloud>
        <div className="control-row" data-readaloud-part>
          <label>
            Green: <input type="range" min={0} max={15} value={redCount} onChange={(e) => setRedCount(Number(e.target.value))} /> {redCount}
          </label>
          <label>
            Orange: <input type="range" min={0} max={15} value={blueCount} onChange={(e) => setBlueCount(Number(e.target.value))} /> {blueCount}
          </label>
        </div>
        <TenFrameGroup value={Math.min(20, total)} tone="a" splitAt={redCount} tone2="b" />
        <ReadAloud as="p" className="muted small">
          {redCount} + {blueCount} = {total} in all. Try different green/orange splits that still add up to the same total — notice there's more than
          one way.
        </ReadAloud>
      </div>

      <div>
        <ReadAloud as="p" className="muted small">Compare: two separate amounts, side by side.</ReadAloud>
        <div className="control-row" data-readaloud-part>
          <label>
            Amount A: <input type="range" min={0} max={20} value={amountA} onChange={(e) => setAmountA(Number(e.target.value))} /> {amountA}
          </label>
          <label>
            Amount B: <input type="range" min={0} max={20} value={amountB} onChange={(e) => setAmountB(Number(e.target.value))} /> {amountB}
          </label>
        </div>
        <div className="control-row" style={{ gap: 24, alignItems: "flex-start" }} data-readaloud-part>
          <TenFrameGroup value={amountA} tone="a" />
          <TenFrameGroup value={amountB} tone="b" />
        </div>
        <ReadAloud as="p" className="muted small">
          The bigger amount is {bigger}, the smaller is {smaller}. The difference is always bigger − smaller = {diff} — whether you call it "
          {diff} more" or "{diff} fewer" depends only on which amount you're talking about, not on the math.
        </ReadAloud>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <PutTogetherCompareCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "ptaTotalUnknown" | "ptaAddendUnknown" | "ptaBothAddendsUnknown" | "compareDiffMore" | "compareDiffFewer" | "compareBiggerUnknown" | "compareSmallerUnknown";
const BUCKETS: Bucket[] = ["ptaTotalUnknown", "ptaAddendUnknown", "ptaBothAddendsUnknown", "compareDiffMore", "compareDiffFewer", "compareBiggerUnknown", "compareSmallerUnknown"];

const ITEM_CONTEXTS = [
  { person: "Mia", item: "buttons", partA: "green", partB: "orange" },
  { person: "Jake", item: "cards", partA: "sports", partB: "animal" },
  { person: "Ava", item: "beads", partA: "round", partB: "square" },
  { person: "Liam", item: "stickers", partA: "star", partB: "heart" },
];

const COMPARE_CONTEXTS = [
  { a: "Lily", b: "Ben", item: "crayons" },
  { a: "Noah", b: "Ella", item: "pencils" },
  { a: "Grace", b: "Max", item: "toy cars" },
  { a: "Ivy", b: "Sam", item: "seashells" },
];

function unknownChoice(correctText: string, distractorText: string) {
  return choice({ prompt: "What's unknown in this story?", hint: "Decide which piece of information isn't given yet.", explain: `The unknown here is ${correctText}.` }, correctText, [distractorText]);
}

function wordProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "ptaTotalUnknown") {
    const ctx = pick(ITEM_CONTEXTS);
    const a = randInt(1, 9);
    const b = randInt(1, 9);
    const total = Math.min(20, a + b);
    return {
      title: "Put Together — how many in all?",
      bucket,
      story: `${ctx.person} has ${a} ${ctx.partA} ${ctx.item} and ${b} ${ctx.partB} ${ctx.item}. How many ${ctx.item} does ${ctx.person} have in all?`,
      visual: () => <TenFrameGroup value={Math.min(20, a + b)} tone="a" splitAt={a} tone2="b" />,
      steps: [unknownChoice("the total", "one of the parts (an addend)"), { kind: "number", prompt: "How many in all?", hint: "Add the two parts.", explain: `${a} + ${b} = ${total}.`, answer: total }],
      wrapUp: `${a} + ${b} = ${total}.`,
    };
  }

  if (bucket === "ptaAddendUnknown") {
    const ctx = pick(ITEM_CONTEXTS);
    const total = randInt(6, 18);
    const a = randInt(1, total - 1);
    const b = total - a;
    return {
      title: "Put Together — how many is the other part?",
      bucket,
      story: `${ctx.person} has ${total} ${ctx.item} in all. ${a} are ${ctx.partA} and the rest are ${ctx.partB}. How many ${ctx.item} are ${ctx.partB}?`,
      visual: () => <TenFrameGroup value={total} tone="a" splitAt={a} tone2="b" />,
      steps: [unknownChoice("one of the parts (an addend)", "the total"), { kind: "number", prompt: `How many are ${ctx.partB}?`, hint: "Total − known part = the other part.", explain: `${total} − ${a} = ${b}.`, answer: b }],
      wrapUp: `${a} + ${b} = ${total}.`,
    };
  }

  if (bucket === "ptaBothAddendsUnknown") {
    const ctx = pick(ITEM_CONTEXTS);
    const total = randInt(5, 12);
    const redGiven = randInt(1, total - 1);
    let altRed = randInt(1, total - 1);
    while (altRed === redGiven) altRed = randInt(1, total - 1);
    return {
      title: "Put Together — how many ways?",
      bucket,
      story: `${ctx.person} has ${total} ${ctx.item}. Some are ${ctx.partA} and some are ${ctx.partB}.`,
      // Help ladder / Show me on steps 2-3: color THAT step's split, so the
      // picture shows the one way being asked about (not the other one).
      visual: (done: number, help?: VisualHelp) => {
        const splitAt = pointing(help, 1) ? redGiven : pointing(help, 2) || done >= 3 ? altRed : undefined;
        return splitAt === undefined ? <TenFrameGroup value={total} tone="c" /> : <TenFrameGroup value={total} tone="a" splitAt={splitAt} tone2="b" />;
      },
      steps: [
        choice(
          { prompt: `How many different ways could the ${total} ${ctx.item} split into ${ctx.partA} and ${ctx.partB}?`, hint: "Try a few splits yourself — does only one work?", explain: `More than one way works — any split of ${total} into two parts is valid.` },
          "More than one way",
          ["Exactly one way"]
        ),
        { kind: "number", prompt: `Give one way: if ${redGiven} are ${ctx.partA}, how many are ${ctx.partB}?`, hint: `${total} − ${redGiven} = ?`, explain: `${total} − ${redGiven} = ${total - redGiven}.`, answer: total - redGiven },
        { kind: "number", prompt: `Give a DIFFERENT way: if ${altRed} are ${ctx.partA} instead, how many are ${ctx.partB} now?`, hint: `${total} − ${altRed} = ?`, explain: `${total} − ${altRed} = ${total - altRed} — a different split of the very same total.`, answer: total - altRed },
      ],
      wrapUp: `${total} ${ctx.item} can split into ${ctx.partA}/${ctx.partB} in more than one way — there's no single right answer here.`,
    };
  }

  if (bucket === "compareDiffMore" || bucket === "compareDiffFewer") {
    const ctx = pick(COMPARE_CONTEXTS);
    const small = randInt(2, 14);
    const diff = randInt(1, Math.min(9, 20 - small));
    const big = small + diff;
    if (bucket === "compareDiffMore") {
      return {
        title: "Compare — how many more?",
        bucket,
        story: `${ctx.a} has ${big} ${ctx.item}. ${ctx.b} has ${small} ${ctx.item}. How many MORE ${ctx.item} does ${ctx.a} have than ${ctx.b}?`,
        // Rows line up one-to-one; when stuck, the extras get circled.
        visual: (_done: number, help?: VisualHelp) => (
          <CompareRows
            rows={[
              { label: ctx.a, count: big, tone: "a" },
              { label: ctx.b, count: small, tone: "b" },
            ]}
            showGap={pointing(help, 0)}
          />
        ),
        steps: [{ kind: "number", prompt: "How many more?", hint: "Subtract the smaller amount from the bigger amount.", explain: `${big} − ${small} = ${diff}.`, answer: diff }],
        wrapUp: `${big} − ${small} = ${diff}.`,
      };
    }
    return {
      title: "Compare — how many fewer?",
      bucket,
      story: `${ctx.b} has ${small} ${ctx.item}. ${ctx.a} has ${big} ${ctx.item}. How many FEWER ${ctx.item} does ${ctx.b} have than ${ctx.a}?`,
      visual: (_done: number, help?: VisualHelp) => (
        <CompareRows
          rows={[
            { label: ctx.b, count: small, tone: "b" },
            { label: ctx.a, count: big, tone: "a" },
          ]}
          showGap={pointing(help, 0) || pointing(help, 1)}
        />
      ),
      steps: [
        choice(
          { prompt: "Which calculation finds the answer?", hint: "Always subtract the smaller amount from the bigger amount, no matter the sentence order.", explain: `${big} − ${small} = ${diff} — subtract smaller from bigger, not in the order the names appear.` },
          `${big} − ${small}`,
          [`${small} − ${big}`]
        ),
        { kind: "number", prompt: "How many fewer?", hint: "Subtract the smaller from the bigger.", explain: `${big} − ${small} = ${diff}.`, answer: diff },
      ],
      wrapUp: `${big} − ${small} = ${diff}.`,
    };
  }

  // compareBiggerUnknown / compareSmallerUnknown. diff is capped by `base`
  // too (not just 20-base) — compareSmallerUnknown computes base - diff,
  // which would go negative without that cap (a real bug caught by this
  // lab's brute-force verification script).
  const ctx = pick(COMPARE_CONTEXTS);
  const base = randInt(2, 15);
  const diff = randInt(1, Math.min(9, base, 20 - base));

  if (bucket === "compareBiggerUnknown") {
    const biggerAmount = base + diff;
    return {
      title: "Compare — who has more?",
      bucket,
      story: `${ctx.b} has ${base} ${ctx.item}. ${ctx.a} has ${diff} more ${ctx.item} than ${ctx.b}. How many ${ctx.item} does ${ctx.a} have?`,
      visual: (_done: number, help?: VisualHelp) =>
        pointing(help, 1) ? (
          <CompareRows
            rows={[
              { label: ctx.b, count: base, tone: "b" },
              { label: ctx.a, count: biggerAmount, tone: "a" },
            ]}
            showGap
          />
        ) : (
          <TenFrameGroup value={base} tone="b" />
        ),
      steps: [
        choice({ prompt: `Is ${ctx.a}'s amount bigger or smaller than ${ctx.b}'s?`, hint: `"More than" means bigger.`, explain: `${ctx.a} has MORE, so ${ctx.a}'s amount is bigger than ${ctx.b}'s.` }, "Bigger", ["Smaller"]),
        { kind: "number", prompt: `How many does ${ctx.a} have?`, hint: "Add the difference onto the known amount.", explain: `${base} + ${diff} = ${biggerAmount}.`, answer: biggerAmount },
      ],
      wrapUp: `${base} + ${diff} = ${biggerAmount}.`,
    };
  }
  const smallerAmount = base - diff;
  return {
    title: "Compare — who has fewer?",
    bucket,
    story: `${ctx.a} has ${base} ${ctx.item}. ${ctx.a} has ${diff} more ${ctx.item} than ${ctx.b}. How many ${ctx.item} does ${ctx.b} have?`,
    visual: (_done: number, help?: VisualHelp) =>
      pointing(help, 1) ? (
        <CompareRows
          rows={[
            { label: ctx.a, count: base, tone: "a" },
            { label: ctx.b, count: smallerAmount, tone: "b" },
          ]}
          showGap
        />
      ) : (
        <TenFrameGroup value={base} tone="a" />
      ),
    steps: [
      choice({ prompt: `Is ${ctx.b}'s amount bigger or smaller than ${ctx.a}'s?`, hint: `${ctx.a} has MORE, so ${ctx.b} must have less.`, explain: `${ctx.a} has MORE, so ${ctx.b}'s amount is smaller than ${ctx.a}'s.` }, "Smaller", ["Bigger"]),
      { kind: "number", prompt: `How many does ${ctx.b} have?`, hint: "Subtract the difference from the known amount.", explain: `${base} − ${diff} = ${smallerAmount}.`, answer: smallerAmount },
    ],
    wrapUp: `${base} − ${diff} = ${smallerAmount}.`,
  };
}

export const putTogetherCompareWordProblems: Unit = {
  id: "putTogetherCompareWordProblems",
  title: "Word Problems: Put Together/Take Apart and Compare",
  goal: "Solve stories about two parts making a whole, and stories comparing two amounts.",
  standard: "1.OA.1",
  keyIdea: (
    <>
      <p>Put-together stories have a TOTAL and two PARTS — when both parts are unknown, there's usually more than one valid way to split the total.</p>
      <p>Compare stories are about the GAP between two amounts. To find the gap, subtract the smaller from the bigger. If you know one amount and the gap, add or subtract the gap to find the other amount.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Put Together / Compare", make: wordProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: putTogetherCompareWordProblemsTest,
};
