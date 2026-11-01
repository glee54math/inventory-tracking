import { FractionBar } from "../diagrams";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { pick } from "../../../shared/lib/math";
import { combineParams, compareParams, mixedText, multiStepParams, pickDistractors, randomAmount, WORD_DENS } from "../lib/fractions";
import { amountStep } from "../lib/steps";
import { AMOUNT_CONTEXTS, amountWords, NAMES, sameWholeParams, twoNames, unitFor } from "../lib/words";

// Self-contained: never imports the paired FractionWordProblems.tsx.

type Diff = TestQuestion["difficulty"];

/** Q1 / Q10 — "combine two amounts" story. `mixed` forces both amounts to be mixed numbers. */
export function combineQuestion(difficulty: Diff = "medium", mixed = false): TestQuestion[] {
  let { d, x, y } = combineParams();
  if (mixed) {
    d = pick(WORD_DENS.filter((v) => v >= 3));
    x = randomAmount(d, true);
    y = randomAmount(d, true);
  }
  const c = pick(AMOUNT_CONTEXTS);
  const name = pick(NAMES);
  const t = x + y;
  return [
    {
      visual: null,
      difficulty,
      step: amountStep(
        {
          prompt: `${name} used ${amountWords(x, d, c)} of ${c.item} for one project and ${amountWords(y, d, c)} for another. How much ${c.item} did ${name} use in all?`,
          hint: "\"In all\" means put the two amounts together — add.",
          explain: `${mixedText(x, d)} + ${mixedText(y, d)} = ${mixedText(t, d)} ${unitFor(t, d, c)}.`,
        },
        t,
        d,
        unitFor(t, d, c)
      ),
    },
  ];
}

/** Q2 / Q9 — "how much is left" story; `borrow` forces a mixed-number regroup. */
export function leftQuestion(difficulty: Diff = "medium", borrow?: boolean): TestQuestion[] {
  const { d, x, y } = compareParams(borrow);
  const c = pick(AMOUNT_CONTEXTS);
  const name = pick(NAMES);
  const r = x - y;
  return [
    {
      visual: null,
      difficulty,
      step: amountStep(
        {
          prompt: `${name} had ${amountWords(x, d, c)} of ${c.item} and ${c.use} ${amountWords(y, d, c)}. How much ${c.item} is left?`,
          hint: "\"Left\" means take the used amount away — subtract. Unbundle a whole if you need more pieces.",
          explain: `${mixedText(x, d)} − ${mixedText(y, d)} = ${mixedText(r, d)} ${unitFor(r, d, c)}.`,
        },
        r,
        d,
        unitFor(r, d, c)
      ),
    },
  ];
}

/** Q3 — "how much more" comparison story. */
export function moreQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { d, x, y } = compareParams();
  const c = pick(AMOUNT_CONTEXTS);
  const [a, b] = twoNames();
  const r = x - y;
  return [
    {
      visual: null,
      difficulty,
      step: amountStep(
        {
          prompt: `${a} has ${amountWords(x, d, c)} of ${c.item}. ${b} has ${amountWords(y, d, c)}. How much more ${c.item} does ${a} have than ${b}?`,
          hint: "\"How much more\" asks for the difference — subtract the smaller amount from the bigger one.",
          explain: `${mixedText(x, d)} − ${mixedText(y, d)} = ${mixedText(r, d)} ${unitFor(r, d, c)} more.`,
        },
        r,
        d,
        unitFor(r, d, c)
      ),
    },
  ];
}

/** Q4 — pick the equation that solves a story (operation + order). */
export function pickOperationQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { d, x, y } = compareParams(false);
  const c = pick(AMOUNT_CONTEXTS);
  const name = pick(NAMES);
  const X = mixedText(x, d);
  const Y = mixedText(y, d);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${name} had ${amountWords(x, d, c)} of ${c.item} and ${c.use} ${amountWords(y, d, c)}. Which equation tells how much is left?`,
          hint: "Start with the amount there was at first, then take away what was used.",
          explain: `Start with ${X}, take away ${Y}: ${X} − ${Y} = ?`,
        },
        `${X} − ${Y} = ?`,
        [
          `${X} + ${Y} = ?`, // added because two numbers appear
          `${Y} − ${X} = ?`, // subtracted in the wrong order
        ]
      ),
    },
  ];
}

/** Q5 — three-amount multistep story. */
export function multiStepQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const { d, x, y, z } = multiStepParams();
  const c = pick(AMOUNT_CONTEXTS);
  const name = pick(NAMES);
  const r = x + y - z;
  return [
    {
      visual: null,
      difficulty,
      step: amountStep(
        {
          prompt: `${name} had ${amountWords(x, d, c)} of ${c.item}, ${c.gain} ${amountWords(y, d, c)} more, and then ${c.use} ${amountWords(z, d, c)}. How much ${c.item} is there now?`,
          hint: "Two steps: add what was gained, then subtract what was used.",
          explain: `${mixedText(x, d)} + ${mixedText(y, d)} = ${mixedText(x + y, d)}; then ${mixedText(x + y, d)} − ${mixedText(z, d)} = ${mixedText(r, d)}.`,
        },
        r,
        d,
        unitFor(r, d, c)
      ),
    },
  ];
}

/** Q6 — plan the two steps of a multistep story. */
export function multiStepPlanQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { d, x, y, z } = multiStepParams();
  const c = pick(AMOUNT_CONTEXTS);
  const name = pick(NAMES);
  const [X, Y, Z] = [mixedText(x, d), mixedText(y, d), mixedText(z, d)];
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${name} had ${amountWords(x, d, c)} of ${c.item}, ${c.gain} ${amountWords(y, d, c)} more, and then ${c.use} ${amountWords(z, d, c)}. Which plan finds how much is there now?`,
          hint: "Which amount made it grow? Which made it shrink?",
          explain: `${c.gain} makes it bigger (add ${Y}); ${c.use} makes it smaller (subtract ${Z}).`,
        },
        `Add ${X} + ${Y}, then subtract ${Z}`,
        [
          `Add ${X} + ${Y} + ${Z}`, // added every number in the story
          `Subtract ${Y} from ${X}, then add ${Z}`, // operations swapped
        ]
      ),
    },
  ];
}

/** Q7 — same-whole trap: why the fractions can't just be added. */
export function sameWholeWhyQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const { c, d, a, smallName, largeName } = sameWholeParams();
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <FractionBar numerator={a} denominator={d} width={120} height={44} />
            <p className="muted small">{c.small}</p>
          </div>
          <div>
            <FractionBar numerator={a} denominator={d} width={260} height={44} />
            <p className="muted small">{c.large}</p>
          </div>
        </div>
      ),
      difficulty,
      step: choice(
        {
          prompt: `${smallName} ${c.verb} ${a}/${d} of a ${c.small}. ${largeName} ${c.verb} ${a}/${d} of a ${c.large}. ${smallName} says, "Together we ${c.verb} ${2 * a}/${d} of a ${c.thing}." What's wrong?`,
          hint: "Look at the two bars. Is a piece of one the same size as a piece of the other?",
          explain: `The two wholes are different sizes, so a 1/${d} of one isn't the same amount as a 1/${d} of the other. Adding numerators only works for pieces of the SAME whole.`,
        },
        "The wholes are different sizes, so the pieces aren't the same size",
        [
          `They should have added the denominators too: ${2 * a}/${2 * d}`, // add-the-denominators fix
          `Nothing — same denominator, so ${a}/${d} + ${a}/${d} = ${2 * a}/${d}`, // same denominator = always addable
        ]
      ),
    },
  ];
}

/** Q8 — same-whole trap: who has more. */
export function sameWholeWhoQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const { c, d, a, smallName, largeName } = sameWholeParams();
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${smallName} ${c.verb} ${a}/${d} of a ${c.small}. ${largeName} ${c.verb} ${a}/${d} of a ${c.large}. Who ${c.verb} more?`,
          hint: "Same fraction — but of which whole?",
          explain: `${a}/${d} of a bigger whole is a bigger amount, so ${largeName} ${c.verb} more.`,
        },
        `${largeName} — the same fraction of a bigger whole is more`,
        [
          `They ${c.verb} the same amount — both are ${a}/${d}`, // ignores the size of the whole
          `${smallName} — smaller wholes have bigger fractions`, // inverted reasoning
        ]
      ),
    },
  ];
}

/** Choice-style check used by the module test: which answer is right for a "left" story with borrowing. */
export function leftBorrowChoiceQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const { d, x, y } = compareParams(true);
  const c = pick(AMOUNT_CONTEXTS);
  const name = pick(NAMES);
  const xw = Math.floor(x / d);
  const xn = x % d;
  const yw = Math.floor(y / d);
  const yn = y % d;
  const correct = mixedText(x - y, d);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${name} had ${amountWords(x, d, c)} of ${c.item} and ${c.use} ${amountWords(y, d, c)}. How much is left?`,
          hint: `${xn}/${d} is less than ${yn}/${d} — unbundle a whole first.`,
          explain: `${mixedText(x, d)} = ${xw - 1} ${xn + d}/${d}; ${mixedText(x, d)} − ${mixedText(y, d)} = ${correct}.`,
        },
        correct,
        pickDistractors(correct, [
          mixedText((xw - yw) * d + (yn - xn), d), // flipped the fraction subtraction
          mixedText((xw - yw) * d + (xn + d - yn), d), // unbundled but kept the whole
          mixedText(x + y, d), // added instead
        ])
      ),
    },
  ];
}

export const fractionWordProblemsTest: Unit["test"] = {
  questions: [
    () => combineQuestion("medium"),
    () => leftQuestion("medium"),
    () => moreQuestion("medium"),
    () => pickOperationQuestion("easy"),
    () => multiStepPlanQuestion("medium"),
    () => multiStepQuestion("hard"),
    () => sameWholeWhyQuestion("hard"),
    () => sameWholeWhoQuestion("medium"),
    () => leftQuestion("hard", true),
    () => combineQuestion("hard", true),
  ],
  passScore: 9,
};
