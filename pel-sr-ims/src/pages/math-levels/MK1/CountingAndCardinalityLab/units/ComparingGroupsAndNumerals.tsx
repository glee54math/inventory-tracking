import { useEffect, useState } from "react";
import { BigDigit, TenGroups, TwoGroups, countAlongMs, countStepMs, LEAD_IN_MS, type Arrangement } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { choice, pointing, type ChoiceStep, type Problem } from "../../../shared/engine/types";
import { countShowMe, countUp } from "./words";
import { GROUP_WORDS, colorGroups } from "./groupWords";
import { QA, QB, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingGroupsAndNumeralsTest } from "./ComparingGroupsAndNumeralsTest";
import { CheckSequence, PickCheck, TypeCheck, type CheckMode } from "./KCheck";
import { ReadAloud } from "../../../shared/tts/ReadAloud";

const bigDigit = (d: number | string) => <BigDigit d={d} />;

/** Show a choice's numerals as big digits in the buttons. */

/** Run a practice problem's words through colorGroups (choice buttons too). */
const withGroupColors = (p: Problem): Problem => ({
  ...p,
  story: colorGroups(p.story),
  wrapUp: colorGroups(p.wrapUp),
  steps: p.steps.map((s) => {
    const words = { ...s, prompt: colorGroups(s.prompt), hint: colorGroups(s.hint), explain: colorGroups(s.explain), showMe: colorGroups(s.showMe) };
    if (s.kind === "choice" && !s.display && s.choices.some((c) => GROUP_WORDS.test(c))) return { ...words, kind: "choice" as const, display: s.choices.map((c, i) => <span key={i}>{colorGroups(c)}</span>) }; // one span, so the words stay together in the button
    return words;
  }) as Problem["steps"],
});

const withBigDigits = (step: ChoiceStep): ChoiceStep => ({ ...step, display: step.choices.map((c) => <BigDigit key={c} d={c} size={48} />) });

/** Two rows, LEFT-ALIGNED with a fixed gap, so matching pairs really do line
 *  up column-by-column — the "extra," unmatched counters past the shorter
 *  row's length render with a dashed outline instead of a solid fill, as the
 *  direct visual tell for "this one ran out first." Local to this unit
 *  (nothing else in the lab needs fixed-gap left-aligned rows — CounterGroup's
 *  own arrangements all center/space relative to count, which is exactly
 *  wrong for a side-by-side matching comparison). */
/** `countExtras`: "Show me" for "how many more?" — the dotted circles fill in
 *  and get numbered 1, 2, 3... one at a time, at the read-aloud pace. */
function MatchingRows({ countA, countB, countExtras }: { countA: number; countB: number; countExtras?: boolean }) {
  const [counted, setCounted] = useState(0);
  const extras = Math.abs(countA - countB);
  useEffect(() => {
    setCounted(0);
    if (!countExtras) return;
    const perMs = countStepMs();
    let iv: number | undefined;
    const lead = window.setTimeout(() => {
      setCounted(1);
      iv = window.setInterval(() => setCounted((k) => (k >= extras ? k : k + 1)), perMs);
    }, LEAD_IN_MS);
    return () => {
      window.clearTimeout(lead);
      window.clearInterval(iv);
    };
  }, [countExtras, extras]);
  const GAP = 30;
  const R = 13;
  const PAD = 20;
  const n = Math.max(countA, countB, 1);
  const width = PAD * 2 + GAP * (n - 1) + 2 * R;
  const rowY = [34, 86];
  const colors = [palette.a, palette.b];
  const counts = [countA, countB];
  return (
    <svg viewBox={`0 0 ${width} 110`} role="img" aria-label={`Two rows lined up: ${countA} and ${countB}`} style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}>
      {counts.map((count, row) => (
        <g key={row}>
          <text x={PAD} y={rowY[row] - R - 6} fontSize={12} fontWeight={700} fill={colors[row]}>
            {row === 0 ? "Top row" : "Bottom row"}
          </text>
          {Array.from({ length: count }, (_, i) => {
            const matched = i < Math.min(countA, countB);
            const k = i - Math.min(countA, countB) + 1; // 1, 2, 3... along the dotted circles
            const lit = !matched && countExtras && k <= counted;
            return (
              <g key={i}>
                <circle
                  cx={PAD + R + i * GAP}
                  cy={rowY[row]}
                  r={R}
                  fill={matched ? colors[row] : lit ? (row === 0 ? palette.aSoft : palette.bSoft) : "none"}
                  stroke={matched ? palette.paper : colors[row]}
                  strokeWidth={matched ? 2 : 3}
                  strokeDasharray={matched || lit ? undefined : "4 3"}
                />
                {lit && (
                  <text x={PAD + R + i * GAP} y={rowY[row]} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={800} fill={colors[row]}>
                    {k}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

// Kindergarten-sized, one question at a time (see KCheck.tsx). Ideas
// checked: spreading out doesn't make more; MORE / FEWER; comparing two
// numerals with no counters; a close comparison (9 vs 10) by counting.

const groupBtn = (text: string) => ({ id: text, label: <span>{colorGroups(text)}</span> });

function ComparingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const close = (m: CheckMode, along?: "A" | "B") => (
    <TwoGroups a={9} b={10} arrA="scatter" arrB="scatter" seedA={91} seedB={103} countAlong={m === "show" ? along : undefined} />
  );
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt={colorGroups("Which group has MORE?")}
            picture={<TwoGroups a={6} b={6} arrA="array" arrB="scatter" seedA={6} seedB={606} names={["Grid", "Scattered"]} />}
            showPicture={<TwoGroups a={6} b={6} arrA="array" arrB="scatter" seedA={6} seedB={606} names={["Grid", "Scattered"]} countAlong="both" />}
            showText="Watch and listen. Both groups have 6."
            options={[groupBtn("Grid group"), groupBtn("Scattered group"), { id: "same", label: "The same" }]}
            answer="same"
            why={{ "Grid group": "Lined up does not mean more. Count each group.", "Scattered group": "Spread out does not mean more. Count each group." }}
            praise="Yes! Both have 6. Spreading out does not make more."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt={colorGroups("How many in Group B?")}
            answer={4}
            tone="b"
            picture={(m) => <TwoGroups a={7} b={4} arrA="line" arrB="line" seedA={7} seedB={4} countAlong={m === "show" ? "B" : undefined} />}
            nudge="Not yet. Count the dots in Group B."
            showText={`Watch and listen: ${countUp(1, 4)}.`}
            praise="Yes! Group B has 4."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={2}
            prompt={colorGroups("Which group has FEWER?")}
            picture={<TwoGroups a={7} b={4} arrA="line" arrB="line" seedA={7} seedB={4} />}
            showPicture={<TwoGroups a={7} b={4} arrA="line" arrB="line" seedA={7} seedB={4} cancelOut />}
            showText="Watch: cross out one from each group. Group B runs out first."
            options={[groupBtn("Group A"), groupBtn("Group B")]}
            answer="Group B"
            why={{ "Group A": "Group A has 7. That is more. Look for the group with less." }}
            praise="Yes! Group B has FEWER."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="Which number is bigger?"
            showPicture={
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-end" }}>
                <TenGroups value={6} tone="a" labels />
                <TenGroups value={9} tone="b" labels />
              </div>
            }
            showText="Look at the dots. 9 has more dots than 6."
            options={["6", "9"].map((d) => ({ id: d, label: <BigDigit d={d} size={44} /> }))}
            answer="9"
            why={{ "6": "Count up: 6, 7, 8, 9. 9 comes later. Later is bigger." }}
            praise="Yes! 9 is bigger than 6."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt={colorGroups("How many in Group A?")}
            answer={9}
            tone="a"
            picture={(m) => close(m, "A")}
            nudge="Not yet. Count the dots in Group A."
            showText={`Watch and listen: ${countUp(1, 9)}.`}
            praise="Yes! Group A has 9."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt={colorGroups("How many in Group B?")}
            answer={10}
            tone="b"
            picture={(m) => close(m, "B")}
            nudge="Not yet. Count the dots in Group B."
            showText={`Watch and listen: ${countUp(1, 10)}.`}
            praise="Yes! Group B has 10."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt={colorGroups("Which group has MORE?")}
            picture={close("ask")}
            showPicture={<TwoGroups a={9} b={10} arrA="scatter" arrB="scatter" seedA={91} seedB={103} showCounts />}
            showText="Group A has 9. Group B has 10. Count on: 9, 10. 10 is more."
            options={[groupBtn("Group A"), groupBtn("Group B")]}
            answer="Group B"
            why={{ "Group A": "Group A has 9. Group B has 10. Which comes later when you count?" }}
            praise="Yes! 10 is more than 9. They are close, so we count."
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
  const [a, setA] = useState(6);
  const [b, setB] = useState(4);
  const [arrA, setArrA] = useState<Arrangement>("array");
  const [arrB, setArrB] = useState<Arrangement>("scatter");

  const verdict = a === b ? "the same as" : a > b ? "more than" : "fewer than";
  const symbol = a === b ? "=" : a > b ? ">" : "<";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Stepper label="Group A" value={a} min={0} max={10} step={1} onChange={setA} tone="a" />
        <Segmented label="A's look" value={arrA} onChange={setArrA} options={[{ id: "line", label: "Line" }, { id: "array", label: "Grid" }, { id: "scatter", label: "Scattered" }]} />
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
      <div className="control-row" data-readaloud-part>
        <Stepper label="Group B" value={b} min={0} max={10} step={1} onChange={setB} tone="b" />
        <Segmented label="B's look" value={arrB} onChange={setArrB} options={[{ id: "line", label: "Line" }, { id: "array", label: "Grid" }, { id: "scatter", label: "Scattered" }]} />
      </div>

      {/* Each group in its own labeled box, so "Group A" and "Group B" point at something. */}
      <TwoGroups a={a} b={b} arrA={arrA} arrB={arrB} seedA={a * 9 + 1} seedB={b * 9 + 2} />
      <ReadAloud as="p" className="muted small">
        <QA>Group A</QA> has {a}, <QB>Group B</QB> has {b} — <QA>Group A</QA> has <b>{verdict}</b> <QB>Group B</QB>. "More than" means a bigger amount; "fewer than" means a smaller
        amount; "the same as" means equal amounts. Try spreading one group out or bunching it up — the comparison never changes, because the
        COUNT didn't change.
      </ReadAloud>

      <ReadAloud className="align-stack-wrap">
        <p>
          <b>Just the numerals</b> — no objects at all:
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {bigDigit(a)}
          <span style={{ fontSize: 40, fontWeight: 800 }}>{symbol}</span>
          {bigDigit(b)}
        </div>
        <p className="muted small">Comparing the numerals {a} and {b} is the exact same idea as comparing {a} objects to {b} objects.</p>
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <ComparingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "matching" | "countCompare" | "diffMagnitude" | "equalTrap" | "numeralCompare";
const BUCKETS: Bucket[] = ["matching", "countCompare", "diffMagnitude", "equalTrap", "numeralCompare"];

const randDistinctPair = (min: number, max: number): [number, number] => {
  const a = randInt(min, max);
  let b = randInt(min, max);
  while (b === a) b = randInt(min, max);
  return [a, b];
};

function comparingProblem(targetBucket?: string): Problem {
  return withGroupColors(buildComparingProblem(targetBucket));
}

function buildComparingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "matching") {
    const [a, b] = randDistinctPair(1, 10);
    const more = Math.max(a, b);
    const fewer = Math.min(a, b);
    const moreRow = a > b ? "Top row" : "Bottom row";
    const fewerRow = a > b ? "Bottom row" : "Top row";
    return {
      title: "Line them up",
      bucket,
      story: "Line up the two rows. Whichever row runs out first has fewer.",
      // Step 2's "Show me" counts the dotted circles along.
      visual: (_done, help) => <MatchingRows countA={a} countB={b} countExtras={!!help?.showMe && help.step === 1} />,
      steps: [
        choice(
          { prompt: "Which row has MORE?", hint: "Look for the dotted circles. Which row has them?", showMe: `Look for the dotted circles. The ${moreRow} has them, so it has more.`, explain: `The ${moreRow} has more. It has dotted circles left over.` },
          moreRow,
          [fewerRow]
        ),
        {
          kind: "number",
          prompt: `How many MORE does the ${moreRow} have than the ${fewerRow}?`,
          hint: "Count the dotted circles.",
          showMeHoldMs: countAlongMs(more - fewer),
          showMe: `Count the dotted circles: ${countUp(1, more - fewer)}. That is ${more - fewer} more.`,
          explain: `${more} − ${fewer} = ${more - fewer}.`,
          answer: more - fewer,
        },
      ],
      wrapUp: `The ${moreRow} has ${more - fewer} more than the ${fewerRow}.`,
    };
  }

  if (bucket === "countCompare") {
    const [a, b] = randDistinctPair(1, 10);
    const more = a > b ? "Group A" : "Group B";
    const fewer = a > b ? "Group B" : "Group A";
    const askMore = Math.random() < 0.5;
    return {
      title: "Count and compare",
      bucket,
      story: "Count each group. Then compare.",
      // Show me on a count step counts that group aloud. Once both are
      // counted, each group's number shows under it.
      visual: (done, help) => (
        <TwoGroups
          a={a}
          b={b}
          seedA={a * 5 + 11}
          seedB={b * 5 + 13}
          countAlong={help?.showMe && help.step === 0 ? "A" : help?.showMe && help.step === 1 ? "B" : undefined}
          // Not while "Show me" is still counting group B.
          showCounts={done >= 2 && !(help?.showMe && help.step === 1)}
        />
      ),
      steps: [
        { kind: "number", showMeHoldMs: countAlongMs(a), prompt: "How many are in group A?", hint: "Touch each counter in group A as you count it.", showMe: countShowMe(a), explain: `Group A has ${a}.`, answer: a },
        { kind: "number", showMeHoldMs: countAlongMs(b), prompt: "How many are in group B?", hint: "Touch each counter in group B as you count it.", showMe: countShowMe(b), explain: `Group B has ${b}.`, answer: b },
        choice(
          askMore
            ? { prompt: "Which group has MORE?", hint: "Look at the two numbers. Which one comes later when you count?", showMe: `${Math.max(a, b)} comes after ${Math.min(a, b)} when you count. So ${more} has more.`, explain: `Group A has ${a}. Group B has ${b}. ${more} has more.` }
            : { prompt: "Which group has FEWER?", hint: "Look at the two numbers. Which one comes first when you count?", showMe: `${Math.min(a, b)} comes before ${Math.max(a, b)} when you count. So ${fewer} has fewer.`, explain: `Group A has ${a}. Group B has ${b}. ${fewer} has fewer.` },
          askMore ? more : fewer,
          [askMore ? fewer : more]
        ),
      ],
      wrapUp: `Group A has ${a}. Group B has ${b}. ${more} has more.`,
    };
  }

  if (bucket === "diffMagnitude") {
    const close = Math.random() < 0.55;
    let a: number, b: number;
    if (close) {
      a = randInt(1, 9);
      b = Math.random() < 0.5 ? a + 1 : a - 1;
      if (b < 0) b = a + 1;
    } else {
      const base = randInt(1, 7);
      a = base;
      b = base + randInt(3, 6);
      if (Math.random() < 0.5) [a, b] = [b, a];
    }
    a = Math.max(0, Math.min(10, a));
    b = Math.max(0, Math.min(10, b));
    if (a === b) b = a === 10 ? a - 1 : a + 1; // guard against the rare clamp collision
    const more = Math.max(a, b);
    const fewer = Math.min(a, b);
    const diff = more - fewer;
    return {
      title: "Which has more?",
      bucket,
      story: `Group A has ${a}. Group B has ${b}.`,
      // Step 2's "Show me": cross out one from each group at a time, then
      // count what's left in the bigger group (no subtracting needed).
      visual: (_done, help) => (
        <TwoGroups a={a} b={b} arrA="line" arrB="line" seedA={a * 3 + 1} seedB={b * 3 + 2} cancelOut={!!help?.showMe && help.step === 1} />
      ),
      steps: [
        { kind: "number", prompt: "What is the bigger of the two counts?", hint: "Which number comes later when you count?", showMe: `${more} comes after ${fewer} when you count. So ${more} is bigger.`, explain: `The bigger count is ${more}.`, answer: more },
        {
          kind: "number",
          showMeHoldMs: countAlongMs(more + 1), // pairs + a pause + the leftovers
          prompt: "How many more is that than the smaller count?",
          hint: "Cross out one from each group until one group runs out. Count the ones left.",
          showMe: `Cross out one from each group: ${countUp(1, fewer)}. Now count the ones left: ${countUp(1, diff)}. That is ${diff} more.`,
          explain: `${more} is ${diff} more than ${fewer}.`,
          answer: diff,
        },
      ],
      wrapUp: diff === 1 ? `${more} and ${fewer} are close — just 1 apart.` : `${more} is clearly more than ${fewer} — a difference of ${diff}.`,
    };
  }

  if (bucket === "equalTrap") {
    const n = randInt(3, 10);
    return {
      // Don't say they're equal: deciding that by counting is the question.
      title: "Grid or spread out?",
      bucket,
      story: "One group is in neat rows. The other is spread out. Count both groups to compare them.",
      visual: (_done, help) => (
        // Step 1's "Show me" counts both groups side by side, so they reach the same number together.
        <TwoGroups
          a={n}
          b={n}
          arrA="array"
          arrB="scatter"
          seedA={n * 2 + 1}
          seedB={n * 2 + 200}
          names={["Grid", "Scattered"]}
          countAlong={help?.showMe && help.step === 0 ? "both" : help?.showMe && help.step === 1 ? "A" : undefined}
        />
      ),
      steps: [
        choice(
          {
            prompt: "Which group has more — the grid group, the scattered group, or are they the same?",
            hint: "Spreading counters out doesn't add any. Count both groups to be sure.",
            showMe: `Count each group. Both have ${n}. So they are the same.`,
            showMeHoldMs: countAlongMs(n),
            explain: `Both groups have ${n}. Spreading them out only changes how much space they take up, not how many there are.`,
          },
          "They're the same",
          ["Grid group", "Scattered group"]
        ),
        { kind: "number", showMeHoldMs: countAlongMs(n), prompt: "Count one of the groups. How many are in it?", hint: "Touch each counter in one group as you count it.", showMe: countShowMe(n), explain: `Each group has ${n}.`, answer: n },
      ],
      wrapUp: `Both groups have ${n}, even though one looks more spread out.`,
    };
  }

  // numeralCompare
  const [a, b] = randDistinctPair(1, 10);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  const askBigger = Math.random() < 0.5;
  const picked = askBigger ? bigger : smaller;
  const other = askBigger ? smaller : bigger;
  return {
    title: "Compare the numbers",
    bucket,
    story: `Compare ${a} and ${b}. No counters this time, just the numbers.`,
    // Stuck: show each number as dots in a ten-frame, to see which is more.
    visual: (_done, help) =>
      pointing(help, 0) || pointing(help, 1) ? (
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
          {[a, b].map((n, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              {bigDigit(n)}
              <TenGroups value={n} tone={i === 0 ? "a" : "b"} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {bigDigit(a)}
          {bigDigit(b)}
        </div>
      ),
    steps: [
      withBigDigits(
        choice(
          {
            prompt: `Which number is ${askBigger ? "BIGGER" : "SMALLER"}?`,
            hint: "Look at the dots under each number. Which has more dots?",
            showMe: `${smaller} comes before ${bigger} when you count. So ${bigger} is bigger, and ${smaller} is smaller.`,
            explain: `${bigger} is bigger than ${smaller}.`,
          },
          String(picked),
          [String(other)]
        )
      ),
      {
        kind: "number",
        prompt: `Now type the ${askBigger ? "SMALLER" : "BIGGER"} number.`,
        hint: "It's the other number.",
        showMe: `The other number is ${other}.`,
        explain: `${smaller} is smaller than ${bigger}.`,
        answer: other,
      },
    ],
    wrapUp: `${bigger} is bigger than ${smaller}.`,
  };
}

export const comparingGroupsAndNumerals: Unit = {
  id: "comparingGroupsAndNumerals",
  title: "Comparing Groups and Numerals",
  goal: "Tell whether one group has more, fewer, or the same amount as another group, and tell which written number is bigger.",
  standard: "K.CC.6, K.CC.7",
  keyIdea: (
    <>
      <p>"More than" means a bigger amount, "fewer than" means a smaller amount, and "the same as" means equal amounts — found by actually counting, never by how much space a group takes up.</p>
      <p>Comparing written numerals (like 6 and 9) is the exact same idea as comparing groups of objects — the numeral just stands in for the count.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Comparison is a reasoning skill applied fresh every time — nothing fixed
  // to memorize, so no reintroEverySolved (unlike Units 1 and 2).
  problems: [{ label: "Comparing", make: comparingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: comparingGroupsAndNumeralsTest,
};
