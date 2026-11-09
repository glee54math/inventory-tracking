import { RecutBars } from "../diagrams";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import { Frac } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { pick } from "../../../shared/lib/math";
import { lcd, pieceWord, simplestText, twoPeople, U1_FITS_PAIRS, U1_TEST_POOLS, u1Draw, u1Params, type TwoFracs, type U1Bucket, type U1Size } from "../lib/fractions";
import { estimateStep, judgeStep, pickPictureStep, renameStep, sumStep, u1Facts } from "../lib/unit1";

// Self-contained: never imports the paired WhyNotAcross.tsx. The steps come
// from lib/unit1.tsx, the same builders Practice uses, so the Test asks what
// Practice asks, with no help (round 5 redesign: estimate, judge the
// add-across answer, find the real sum; no common denominator to find).

type Diff = TestQuestion["difficulty"];
const W = 180;
/** Bars as wide as Practice draws them: 12 or more pieces in a whole get 240 (round 5 review C5-12). */
const widthFor = (p: TwoFracs) => (lcd(p.d1, p.d2) >= 12 ? 240 : W);
const FITS_BUCKETS: U1Bucket[] = ["fitsUnder1", "fitsOneOrMore"];
const ANY_BUCKETS: U1Bucket[] = ["fitsUnder1", "fitsOneOrMore", "noShareUnder1", "noShareOver1"];

/** Q1 — estimate: more or less than 1, or (a sum near 1) than the bigger fraction. */
export function sizeEstimateQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const p = u1Params(pick(ANY_BUCKETS));
  return [{ visual: <RecutBars {...p} barWidth={W} />, difficulty, step: estimateStep(p) }];
}

/** Q2 — one bottom fits in the other: rename the fraction with the smaller bottom (the picture shows the cut, each bar labeled with its own fraction). */
export function renameQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const p = u1Draw(U1_TEST_POOLS.rename, pick(["under", "whole", "over"] as U1Size[]));
  return [{ visual: <RecutBars {...p} recut originalLabels barWidth={widthFor(p)} />, difficulty, step: renameStep(p) }];
}

/**
 * Q3, Q4 — one bottom fits in the other: type the sum in simplest form. The
 * size (less than 1 / exactly 1 / more than 1) is picked first, 1 in 3 each,
 * so the right answer format changes from one try of the Test to the next
 * (round 5, U5-04). Q3 and Q4 use separate pools of pairs.
 */
export function fitsSumQuestion(difficulty: Diff, pool: "sumPicture" | "sumPlain" | "any" = "sumPlain", withPicture = false): TestQuestion[] {
  const pairs = pool === "any" ? U1_FITS_PAIRS : U1_TEST_POOLS[pool];
  const p = u1Draw(pairs, pick(["under", "whole", "over"] as U1Size[]));
  return [{ visual: withPicture ? <RecutBars {...p} barWidth={widthFor(p)} /> : null, difficulty, step: sumStep(p, "plain") }];
}

/** Q5 — no shared factor: which picture shows the sum? (add-across and tops-over-one-bottom pictures as distractors) */
export function pickPictureQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const p = u1Draw(U1_TEST_POOLS.pickPicture, pick(["under", "over"] as U1Size[]));
  return [{ visual: <RecutBars {...p} barWidth={widthFor(p)} />, difficulty, step: pickPictureStep(p, widthFor(p)) }];
}

/** Q6 — no shared factor, already cut into same-size pieces: count and type the sum (less than 1 or a mixed number, 1 in 2 each). */
export function countSumQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const p = u1Draw(U1_TEST_POOLS.countPicture, pick(["under", "over"] as U1Size[]));
  return [{ visual: <RecutBars {...p} recut result originalLabels barWidth={widthFor(p)} />, difficulty, step: sumStep(p, "counted") }];
}

/**
 * Q7 — WHY adding across fails, as the same sentence frame Practice uses
 * (round 6, U6-01): "[Name]'s answer, 2/5, is less than [1/2 | 1/3], but more
 * than [1/2 | 1/3]. Adding should make a number [bigger | smaller] ... So
 * [Name]'s answer is [too small | right | too big]." No hints or feedback
 * (the Test never helps). The picture is Practice's: the two fractions' bars.
 */
export function whyWrongQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const p = u1Params(pick(ANY_BUCKETS));
  const [person] = twoPeople();
  return [{ visual: <RecutBars {...p} barWidth={widthFor(p)} />, difficulty, step: judgeStep(p, person) }];
}

/** Q8 — which pair can be added by adding the tops? (same denominator = same-size pieces) */
export function sameSizeQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const d = pick([5, 7, 8, 9]);
  const x = pick([1, 2]);
  const y = pick([2, 3].filter((v) => v !== x));
  const other = d + 1;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: "Which pair can you add just by adding the tops?",
          hint: "The tops count pieces. The bottoms tell the size of the pieces.",
          explain: `Only ${x}/${d} + ${y}/${d} has same-size pieces (both ${pieceWord(d)}). For the others, cut the bars into same-size pieces first.`,
        },
        `${x}/${d} + ${y}/${d}`,
        [
          `${x}/${d} + ${x}/${other}`, // same NUMERATORS — mixes up numerator and denominator
          `1/${x + 1} + 1/${y + 2}`, // both unit fractions, but different sizes
        ]
      ),
    },
  ];
}

/**
 * Q9 — pick the sum (one bottom fits in the other); distractors are the
 * add-across answer and "added the tops, kept the bigger bottom". Sums under 1
 * only (round 5 review C5-09): both distractors are plain fractions, so a
 * whole or mixed right answer was the only one written that way.
 */
export function addAcrossChoiceQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const p = u1Params("fitsUnder1");
  const { n1, d1, n2, d2 } = p;
  const { L, a, b, sumText } = u1Facts(p);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              What is <Frac n={n1} d={d1} /> + <Frac n={n2} d={d2} />?
            </>
          ),
          hint: "Make the pieces the same size first.",
          explain: `${n1}/${d1} + ${n2}/${d2} = ${a}/${L} + ${b}/${L} = ${sumText}. Adding across gives a number that is too small.`,
        },
        sumText,
        [
          `${n1 + n2}/${d1 + d2}`, // added across (tops + tops, bottoms + bottoms)
          `${n1 + n2}/${Math.max(d1, d2)}`, // added the tops but ignored the different piece sizes
        ]
      ),
    },
  ];
}

/** Q10 — two students, one adds across; who is right? (one bottom fits in the other, so the right one can be checked) */
export function whoIsRightQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const p = u1Params(pick(FITS_BUCKETS));
  const { n1, d1, n2, d2 } = p;
  const { s, L } = u1Facts(p);
  const [p1, p2] = twoPeople();
  const acrossFirst = Math.random() < 0.5;
  const wrong = acrossFirst ? p1 : p2;
  const right = acrossFirst ? p2 : p1;
  const say = (x: typeof p1) => (x === wrong ? `${n1 + n2}/${d1 + d2}` : simplestText(s, L));
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${n1}/${d1} + ${n2}/${d2}: ${p1.name} says ${say(p1)}. ${p2.name} says ${say(p2)}. Who is right?`,
          hint: "Who added across?",
          explain: `${right.name} is right. ${wrong.name} added across.`,
        },
        right.name,
        [wrong.name, "Neither of them"] // "Neither" catches a student who distrusts any simplified answer
      ),
    },
  ];
}

export const whyNotAcrossTest: NonNullable<Unit["test"]> = {
  questions: [
    () => sizeEstimateQuestion("easy"),
    () => renameQuestion("easy"),
    () => fitsSumQuestion("easy", "sumPicture", true),
    () => fitsSumQuestion("medium", "sumPlain"),
    () => pickPictureQuestion("medium"),
    () => countSumQuestion("medium"),
    () => whyWrongQuestion("medium"),
    () => sameSizeQuestion("medium"),
    () => addAcrossChoiceQuestion("medium"),
    () => whoIsRightQuestion("hard"),
  ],
  passScore: 9,
};

