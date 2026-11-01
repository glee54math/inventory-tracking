import { Receipt } from "../diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type NumberStep, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { usd, usd2 } from "../lib/measures";
import { centsScenario, howManyScenario, multiItemScenario, wholeDollarScenario } from "../lib/money";

// ---------- end-of-unit test: Money Word Problems ----------
// 10 questions. Scenarios come from ../lib/money (a leaf module shared with
// Practice), never from MoneyWordProblems.tsx, which imports this file.
// Every money answer is a NumberStep with `money: true`, so "$4.5" for $4.50
// gets the engine's dedicated two-decimal-places message and is marked wrong.

const moneyStep = (prompt: string, cents: number, hint: string, explain: string): NumberStep => ({
  kind: "number",
  prefix: "$",
  money: true,
  prompt,
  hint,
  explain,
  answer: cents / 100,
});

// Q1 — whole dollars, total. Easy.
export function wholeDollarTotalQuestion(): TestQuestion[] {
  const s = wholeDollarScenario();
  return [
    {
      visual: null,
      difficulty: "easy",
      step: moneyStep(`${s.name} buys ${s.qty} ${s.item.many} for ${usd(s.priceCents)} each. How much does that cost in all?`, s.totalCents, "Equal groups: multiply.", `${s.qty} × ${usd(s.priceCents)} = ${usd(s.totalCents)}.`),
    },
  ];
}

// Q2 — whole dollars, change. Easy.
export function wholeDollarChangeQuestion(): TestQuestion[] {
  const s = wholeDollarScenario();
  return [
    {
      visual: null,
      difficulty: "easy",
      step: moneyStep(`${s.name}'s ${s.item.many} cost ${usd(s.totalCents)}. ${s.name} pays with a ${usd(s.billCents)} bill. How much change?`, s.changeCents, "Change = what you paid − the cost.", `${usd(s.billCents)} − ${usd(s.totalCents)} = ${usd(s.changeCents)}.`),
    },
  ];
}

// Q3 — total with cents (carry past a dollar when `hard`). Medium.
export function centsTotalQuestion(): TestQuestion[] {
  const s = centsScenario(true);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: moneyStep(
        `${s.name} buys a ${s.items[0].one} for ${usd2(s.prices[0])} and a ${s.items[1].one} for ${usd2(s.prices[1])}. What is the total?`,
        s.totalCents,
        "Add the cents, then the dollars — 100 cents make another dollar.",
        `${usd2(s.prices[0])} + ${usd2(s.prices[1])} = ${usd2(s.totalCents)}.`
      ),
    },
  ];
}

// Q4 — writing money correctly. Distractors: cents written as tenths
// ("five cents" → $6.50 or $6.5) and the decimal point dropped ($605).
export function moneyFormatQuestion(): TestQuestion[] {
  const d = randInt(2, 19);
  const c = randInt(1, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which shows ${d} dollars and ${c} cent${c === 1 ? "" : "s"}?`,
          hint: "There are always TWO digits for cents after the point.",
          explain: `${c} cent${c === 1 ? "" : "s"} is $0.0${c}, so ${d} dollars and ${c} cents is $${d}.0${c}. ($${d}.${c}0 would be ${c}0 cents.)`,
        },
        `$${d}.0${c}`,
        [
          `$${d}.${c}0`, // cents written as tens of cents
          `$${d}.${c}`, // single cents digit — reads as ${c}0 cents
          `$${d}0${c}`, // decimal point dropped
        ]
      ),
    },
  ];
}

// Q5 — change with cents (borrow from the dollars). Hard.
export function centsChangeQuestion(): TestQuestion[] {
  const s = centsScenario(true);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: moneyStep(
        `${s.name} spends ${usd2(s.totalCents)} and pays with a ${usd(s.billCents)} bill. How much change should ${s.name} get?`,
        s.changeCents,
        `${usd(s.billCents)} − ${usd2(s.totalCents)}. Think of ${usd(s.billCents)} as ${usd2(s.billCents)}.`,
        `${usd2(s.billCents)} − ${usd2(s.totalCents)} = ${usd2(s.changeCents)}.`
      ),
    },
  ];
}

const receiptOf = (s: ReturnType<typeof multiItemScenario>) => <Receipt lines={s.lines.map((l) => ({ name: l.qty > 1 ? l.item.many : l.item.one, qty: l.qty, eachCents: l.eachCents, hideLineTotal: true }))} />;

// Q6 — several items, total. Medium.
export function multiItemTotalQuestion(): TestQuestion[] {
  const s = multiItemScenario();
  return [
    {
      visual: receiptOf(s),
      difficulty: "medium",
      step: moneyStep(
        `${s.name} buys everything on this receipt. What is the total?`,
        s.totalCents,
        "Find each line's cost first (quantity × price), then add the lines.",
        `${s.lines.map((l) => (l.qty > 1 ? `${l.qty} × ${usd2(l.eachCents)}` : usd2(l.eachCents))).join(" + ")} = ${usd2(s.totalCents)}.`
      ),
    },
  ];
}

// Q7 — several items, change. Hard.
export function multiItemChangeQuestion(): TestQuestion[] {
  const s = multiItemScenario();
  return [
    {
      visual: receiptOf(s),
      difficulty: "hard",
      step: moneyStep(
        `${s.name} buys everything on this receipt and pays with a ${usd(s.billCents)} bill. How much change?`,
        s.changeCents,
        "Find the total first, then subtract it from the bill.",
        `Total ${usd2(s.totalCents)}; ${usd2(s.billCents)} − ${usd2(s.totalCents)} = ${usd2(s.changeCents)}.`
      ),
    },
  ];
}

// Q8 — how many can you buy? Medium.
export function howManyCountQuestion(): TestQuestion[] {
  const s = howManyScenario();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${s.name} has ${usd(s.budgetCents)}. Each ${s.item.one} costs ${usd2(s.priceCents)}. How many ${s.item.many} can ${s.name} buy?`,
        suffix: s.item.many,
        hint: "How many whole prices fit in the budget? You can't buy part of one.",
        explain: `${s.count} × ${usd2(s.priceCents)} = ${usd2(s.costCents)}; one more would cost ${usd2(s.costCents + s.priceCents)} — too much.`,
        answer: s.count,
      },
    },
  ];
}

// Q9 — the money left over. Hard.
export function howManyLeftoverQuestion(): TestQuestion[] {
  const s = howManyScenario();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: moneyStep(
        `${s.name} has ${usd(s.budgetCents)} and buys as many ${s.item.many} as possible at ${usd2(s.priceCents)} each. How much money is left over?`,
        s.leftCents,
        "Find how many fit and what they cost, then subtract from the budget.",
        `${s.count} × ${usd2(s.priceCents)} = ${usd2(s.costCents)}; ${usd2(s.budgetCents)} − ${usd2(s.costCents)} = ${usd2(s.leftCents)} left.`
      ),
    },
  ];
}

// Q10 — interpret the remainder. Distractors: rounding UP (buying one you
// can't afford), the raw decimal quotient, and the "how much more for one
// more" amount mistaken for the leftover (never equal — see howManyScenario).
export function howManyChoiceQuestion(): TestQuestion[] {
  const s = howManyScenario();
  const quotient = (s.budgetCents / s.priceCents).toFixed(2);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${s.name} has ${usd(s.budgetCents)}. ${pick(["Each", "One"])} ${s.item.one} costs ${usd2(s.priceCents)}. Which answer is right?`,
          hint: "You can only buy WHOLE items, and the money that's not enough for another one is left over.",
          explain: `${s.count} × ${usd2(s.priceCents)} = ${usd2(s.costCents)}, leaving ${usd2(s.leftCents)} — not enough for another.`,
        },
        `${s.count} ${s.item.many}, with ${usd2(s.leftCents)} left over`,
        [
          `${s.count + 1} ${s.item.many}, with $0.00 left over`, // rounded up
          `${quotient} ${s.item.many}`, // raw decimal quotient
          `${s.count} ${s.item.many}, with ${usd2(s.priceCents - s.leftCents)} left over`, // "more needed" mistaken for leftover
        ]
      ),
    },
  ];
}

export const moneyWordProblemsTest: Unit["test"] = {
  questions: [
    wholeDollarTotalQuestion,
    wholeDollarChangeQuestion,
    centsTotalQuestion,
    moneyFormatQuestion,
    centsChangeQuestion,
    multiItemTotalQuestion,
    multiItemChangeQuestion,
    howManyCountQuestion,
    howManyLeftoverQuestion,
    howManyChoiceQuestion,
  ],
  passScore: 9,
};
