import { useState } from "react";
import { Receipt } from "../diagrams";
import { choice, type NumberStep, type Problem } from "../../../shared/engine/types";
import { Says, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { usd, usd2 } from "../lib/measures";
import { centsScenario, howManyScenario, multiItemScenario, wholeDollarScenario } from "../lib/money";
import { CfuToggle, CheckForUnderstanding, type CfuQuestion } from "./cfu";
import { moneyWordProblemsTest } from "./MoneyWordProblemsTest";

const moneyStep = (prompt: string, cents: number, hint: string, explain: string): NumberStep => ({ kind: "number", prefix: "$", money: true, prompt, hint, explain, answer: cents / 100 });

// ============================================================================
// OPTIONAL CHECK FOR UNDERSTANDING — the approved plan makes this unit
// ungated (money applies Unit 2's already-gated four-operations skill), but
// every Explore in this lab still offers a check, so it's here behind the
// toggle without blocking Practice.
// ============================================================================

const CFU: CfuQuestion[] = [
  // Vocabulary.
  {
    rows: [
      ["In a store, your \"change\" is", { kind: "select", label: "meaning of change", options: ["coins instead of bills", "the money you get back when you pay more than the cost", "a different price"], correct: 1 }, "."],
      ["\"$3 each\" means", { kind: "select", label: "meaning of each", options: ["$3 is the price of ONE item", "$3 is the price of all of them together"], correct: 0 }, "."],
    ],
    good: "Right — change is what comes back to you (paid − cost), and \"each\" is the price of one item, so several items means multiply.",
    bad: "Not quite. Change is the money you get BACK when you pay more than the cost. \"Each\" means the price of just one item.",
  },
  // Commonly conflated: $4.50 vs $4.05.
  {
    rows: [
      ["Four dollars and fifty cents is written", { kind: "select", label: "four fifty", options: ["$4.05", "$4.50", "$450"], correct: 1 }, ", and $4.05 means", { kind: "select", label: "meaning of 4.05", options: ["four dollars and five cents", "four dollars and fifty cents"], correct: 0 }, "."],
    ],
    good: "Right — cents always take TWO digits after the point: fifty cents is .50, five cents is .05.",
    bad: "Not quite. Cents always use two digits after the point: $4.50 is fifty cents, $4.05 is five cents.",
  },
  // Remainder trap + generalization.
  {
    rows: [
      ["You have $10. Juice boxes cost $3 each. You can buy", { kind: "number", label: "how many juice boxes", answer: 3, width: 55 }, "juice boxes with $", { kind: "number", label: "money left", answer: 1, width: 55 }, "left over."],
      ["True or false: when money doesn't divide evenly, you round up to the next whole item.", { kind: "select", label: "true or false", options: ["True", "False"], correct: 1 }],
    ],
    good: "Right — 3 juice boxes cost $9 and $1 is left. Rounding up to 4 would cost $12, more than you have, so the extra is money you keep.",
    bad: (v) =>
      v[0].trim() === "4"
        ? "4 juice boxes would cost $12 — more than $10. You can buy 3, with $1 left over."
        : "Not quite. 3 × $3 = $9, so you can buy 3 and keep $1. You can't round up — you'd be $2 short.",
  },
];

// ============================================================================
// EXPLORE — a little store
// ============================================================================

function Explore() {
  const [showCheck, setShowCheck] = useState(false);
  const [price, setPrice] = useState(2.75);
  const [qty, setQty] = useState(3);
  const [bill, setBill] = useState("20");
  const priceCents = Math.round(price * 100);
  const billCents = Number(bill) * 100;
  const totalCents = priceCents * qty;
  const canPay = totalCents <= billCents;
  const most = Math.floor(billCents / priceCents);
  const left = billCents - most * priceCents;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />
      {showCheck && <CheckForUnderstanding title="Check for understanding: money words, writing cents, and money left over." questions={CFU} />}
      <div className="control-row">
        <Stepper label="price each ($)" value={price} min={0.25} max={9.75} step={0.25} onChange={setPrice} tone="a" />
        <Stepper label="how many" value={qty} min={1} max={9} onChange={setQty} tone="b" />
        <Segmented label="Pay with" value={bill} onChange={setBill} options={["10", "20", "50"].map((b) => ({ id: b, label: `$${b}` }))} />
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        <Receipt lines={[{ name: qty > 1 ? "comic books" : "comic book", qty, eachCents: priceCents }]} totalCents={totalCents} paidCents={canPay ? billCents : undefined} changeCents={canPay ? billCents - totalCents : undefined} />
        <div style={{ flex: "1 1 260px" }}>
          <Says>
            {qty} × {usd2(priceCents)} = <b>{usd2(totalCents)}</b>.{" "}
            {canPay ? (
              <>
                Paying with ${bill}: change is {usd2(billCents)} − {usd2(totalCents)} = <b>{usd2(billCents - totalCents)}</b>.
              </>
            ) : (
              <>That's more than ${bill} — you can't buy {qty} with that bill!</>
            )}
          </Says>
          <Says>
            With ${bill} you can buy at most <b>{most}</b> ({most} × {usd2(priceCents)} = {usd2(most * priceCents)}), with <b>{usd2(left)}</b> left over — not enough for one more.
          </Says>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES — one per bucket
// ============================================================================

const BUCKETS = ["wholeDollar", "exactCents", "multiItem", "howMany"];

function wholeDollarProblem(): Problem {
  const s = wholeDollarScenario();
  return {
    title: "Whole-dollar prices",
    bucket: "wholeDollar",
    story: `${s.name} buys ${s.qty} ${s.item.many} for ${usd(s.priceCents)} each and pays with a ${usd(s.billCents)} bill.`,
    visual: (done) => (
      <Receipt lines={[{ name: s.item.many, qty: s.qty, eachCents: s.priceCents, hideLineTotal: done < 2 }]} totalCents={s.totalCents} hideTotal={done < 2} paidCents={s.billCents} changeCents={s.changeCents} hideChange={done < 3} />
    ),
    steps: [
      choice(
        { prompt: `Which finds the cost of ${s.qty} ${s.item.many} at ${usd(s.priceCents)} each?`, hint: "Equal groups of the same price.", explain: `${s.qty} equal prices: multiply, ${s.qty} × ${usd(s.priceCents)}.` },
        `${s.qty} × ${usd(s.priceCents)}`,
        [`${s.qty} + ${usd(s.priceCents)}`, `${usd(s.priceCents)} ÷ ${s.qty}`]
      ),
      moneyStep("What is the total cost?", s.totalCents, `${s.qty} × ${usd(s.priceCents)}`, `${s.qty} × ${usd(s.priceCents)} = ${usd(s.totalCents)}.`),
      moneyStep(`How much change from the ${usd(s.billCents)} bill?`, s.changeCents, `${usd(s.billCents)} − ${usd(s.totalCents)}`, `${usd(s.billCents)} − ${usd(s.totalCents)} = ${usd(s.changeCents)}.`),
    ],
    wrapUp: `Total ${usd(s.totalCents)}, change ${usd(s.changeCents)}.`,
  };
}

function exactCentsProblem(): Problem {
  const s = centsScenario();
  const d = Math.floor(s.changeCents / 100);
  const c = s.changeCents % 100;
  return {
    title: "Dollars and cents",
    bucket: "exactCents",
    story: `${s.name} buys a ${s.items[0].one} for ${usd2(s.prices[0])} and a ${s.items[1].one} for ${usd2(s.prices[1])}, and pays with a ${usd(s.billCents)} bill.`,
    visual: (done) => (
      <Receipt
        lines={[
          { name: s.items[0].one, qty: 1, eachCents: s.prices[0] },
          { name: s.items[1].one, qty: 1, eachCents: s.prices[1] },
        ]}
        totalCents={s.totalCents}
        hideTotal={done < 1}
        paidCents={s.billCents}
        changeCents={s.changeCents}
        hideChange={done < 2}
      />
    ),
    steps: [
      moneyStep("What is the total? (Write cents with two digits, like $4.50.)", s.totalCents, "Add the cents first — 100 cents make another dollar.", `${usd2(s.prices[0])} + ${usd2(s.prices[1])} = ${usd2(s.totalCents)}.`),
      moneyStep(`How much change from ${usd(s.billCents)}?`, s.changeCents, `${usd2(s.billCents)} − ${usd2(s.totalCents)}`, `${usd2(s.billCents)} − ${usd2(s.totalCents)} = ${usd2(s.changeCents)}.`),
      {
        kind: "ratio",
        tones: "none",
        frame: ["", "dollars and", "cents"],
        labels: ["dollars", "cents"],
        prompt: `Say the change in words: ${usd2(s.changeCents)} is how many dollars and how many cents?`,
        hint: "The number before the point is dollars; the two digits after it are cents.",
        explain: `${usd2(s.changeCents)} = ${d} dollar${d === 1 ? "" : "s"} and ${c} cent${c === 1 ? "" : "s"}.`,
        equivalentHint: "Dollars in the first box, the cents (0-99) in the second.",
        answer: [d, c],
      },
    ],
    wrapUp: `Change: ${usd2(s.changeCents)} — ${d} dollars and ${c} cents.`,
  };
}

function multiItemProblem(): Problem {
  const s = multiItemScenario();
  const multi = s.lines[0];
  const lineCost = multi.qty * multi.eachCents;
  return {
    title: "Several items",
    bucket: "multiItem",
    story: `${s.name} buys everything on this receipt and pays with a ${usd(s.billCents)} bill.`,
    visual: (done) => (
      <Receipt
        lines={s.lines.map((l, i) => ({ name: l.qty > 1 ? l.item.many : l.item.one, qty: l.qty, eachCents: l.eachCents, hideLineTotal: i === 0 && done < 1 }))}
        totalCents={s.totalCents}
        hideTotal={done < 2}
        paidCents={s.billCents}
        changeCents={s.changeCents}
        hideChange={done < 3}
      />
    ),
    steps: [
      moneyStep(`How much do the ${multi.qty} ${multi.item.many} cost?`, lineCost, `${multi.qty} × ${usd2(multi.eachCents)}`, `${multi.qty} × ${usd2(multi.eachCents)} = ${usd2(lineCost)}.`),
      moneyStep("What is the total for everything?", s.totalCents, "Add every line.", `${s.lines.map((l) => usd2(l.qty * l.eachCents)).join(" + ")} = ${usd2(s.totalCents)}.`),
      moneyStep(`How much change from ${usd(s.billCents)}?`, s.changeCents, `${usd2(s.billCents)} − ${usd2(s.totalCents)}`, `${usd2(s.billCents)} − ${usd2(s.totalCents)} = ${usd2(s.changeCents)}.`),
    ],
    wrapUp: `Total ${usd2(s.totalCents)}, change ${usd2(s.changeCents)}.`,
  };
}

function howManyProblem(): Problem {
  const s = howManyScenario();
  return {
    title: "How many can I buy?",
    bucket: "howMany",
    story: `${s.name} has ${usd(s.budgetCents)} to spend. Each ${s.item.one} costs ${usd2(s.priceCents)}. ${s.name} buys as many as possible.`,
    visual: (done) => (
      <Receipt
        title={`Budget ${usd2(s.budgetCents)}`}
        lines={[{ name: done >= 1 ? s.item.many : `? ${s.item.many}`, qty: done >= 1 ? s.count : 1, eachCents: s.priceCents, hideLineTotal: done < 2 }]}
        paidCents={s.budgetCents}
        paidLabel="Budget"
        changeCents={s.leftCents}
        changeLabel="Left over"
        hideChange={done < 3}
      />
    ),
    steps: [
      {
        kind: "number",
        prompt: `How many ${s.item.many} can ${s.name} buy?`,
        suffix: s.item.many,
        hint: `Skip-count by ${usd2(s.priceCents)} until the next one would go past ${usd(s.budgetCents)}. You can't buy part of one!`,
        explain: `${s.count} × ${usd2(s.priceCents)} fits; ${s.count + 1} × ${usd2(s.priceCents)} = ${usd2((s.count + 1) * s.priceCents)} is too much.`,
        answer: s.count,
      },
      moneyStep(`How much do ${s.count} ${s.item.many} cost?`, s.costCents, `${s.count} × ${usd2(s.priceCents)}`, `${s.count} × ${usd2(s.priceCents)} = ${usd2(s.costCents)}.`),
      moneyStep("How much money is left over?", s.leftCents, `${usd2(s.budgetCents)} − ${usd2(s.costCents)}`, `${usd2(s.budgetCents)} − ${usd2(s.costCents)} = ${usd2(s.leftCents)} — that's the leftover, not enough for another.`),
    ],
    wrapUp: `${s.count} ${s.item.many}, with ${usd2(s.leftCents)} left over.`,
  };
}

function Preview() {
  return <Receipt lines={[{ name: "comic books", qty: 3, eachCents: 275 }]} totalCents={825} paidCents={1000} changeCents={175} />;
}

export const moneyWordProblems: Unit = {
  id: "moneyWordProblems",
  title: "Money Word Problems",
  goal: "I can solve word problems about money, including dollars and cents together, using all four operations.",
  standard: "4.MD.2",
  keyIdea: (
    <>
      <p>Cents always take two digits after the point: $4.50 is four dollars and fifty cents; $4.05 is four dollars and five cents.</p>
      <p>"How many can I buy?" — buy only WHOLE items. Whatever isn't enough for one more is money left over: $10 at $3 each buys 3, with $1 left.</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [
    { label: "Whole dollars", make: wholeDollarProblem, buckets: ["wholeDollar"] },
    { label: "Dollars & cents", make: exactCentsProblem, buckets: ["exactCents"] },
    { label: "Several items", make: multiItemProblem, buckets: ["multiItem"] },
    { label: "How many?", make: howManyProblem, buckets: ["howMany"] },
  ],
  requiredBuckets: BUCKETS,
  test: moneyWordProblemsTest,
};
