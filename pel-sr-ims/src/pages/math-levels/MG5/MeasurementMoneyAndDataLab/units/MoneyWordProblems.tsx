import { useEffect, useState } from "react";
import { COIN_TYPES, CoinPicker, CoinRow, coinSpec, totalCents, type CoinId } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { moneyWordProblemsTest } from "./MoneyWordProblemsTest";

const NAMES = ["Mia", "Jun", "Sam", "Priya", "Leo", "Ava", "Noah", "Zoe"] as const;
const pickName = () => shuffle(NAMES)[0];

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

const dollars = (cents: number) => (cents / 100).toFixed(2);

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "quarter";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Which coin is worth 25 cents?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="dime">The dime</option>
          <option value="quarter">The quarter</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — a quarter is worth 25¢. A dime is worth 10¢." : "Not quite — the QUARTER is worth 25¢. The dime is worth only 10¢."}
        </p>
      )}
    </div>
  );
}

/** THE core misconception: counting the NUMBER of coins instead of adding
 *  their VALUES. */
function CountValueQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "95";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  const ids: CoinId[] = ["quarter", "quarter", "quarter", "dime", "dime", "nickel"];
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Here are 3 quarters, 2 dimes, and 1 nickel.
      </p>
      <CoinRow ids={ids} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How much money is this?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="6">6 cents — there are 6 coins</option>
            <option value="95">95 cents — add up what each coin is WORTH</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 3 quarters (75¢) + 2 dimes (20¢) + 1 nickel (5¢) = 95¢. There are 6 coins, but the coins aren't all worth the same amount, so you add their VALUES, not just count them."
            : "Not quite — there ARE 6 coins, but they're not all worth the same. Add up what each one is worth: 25+25+25+10+10+5 = 95¢."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap. */
function MoreCoinsTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: whoever has MORE coins always has more money.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <CoinRow ids={["penny", "penny", "penny"]} />
        <span style={{ fontWeight: 700 }}>vs</span>
        <CoinRow ids={["quarter"]} />
      </div>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 3 pennies is only 3¢, but 1 quarter is 25¢. One quarter is worth more than three pennies, even though three is a bigger NUMBER of coins."
            : "Not quite — look above: 3 pennies is only 3¢, but 1 quarter is 25¢. More COINS doesn't mean more MONEY."}
        </p>
      )}
    </div>
  );
}

/** $ vs ¢ notation and their equivalence. */
function NotationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "125";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> $1.25 is the same amount of money as how many cents?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="1.25">1.25 cents</option>
          <option value="125">125 cents</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — $1.25 = 1 dollar (100¢) + 25¢ = 125¢." : "Not quite — $1.25 means 1 dollar (100¢) plus 25 more cents: 100 + 25 = 125¢."}
        </p>
      )}
    </div>
  );
}

function MoneyCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, countValue: false, trap: false, notation: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure money problems make sense before you try practice problems.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <CountValueQuestion onComplete={mark("countValue")} />
      <MoreCoinsTrapQuestion onComplete={mark("trap")} />
      <NotationQuestion onComplete={mark("notation")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [purse, setPurse] = useState<CoinId[]>([]);
  const total = totalCents(purse);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <button className="btn ghost" onClick={() => setPurse([])}>
          Empty the purse
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
      {(introActive || showCheck) && <MoneyCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">Click a coin or bill below to add it to your purse. Watch the total — it adds up VALUE, not just how many you clicked.</p>
      <CoinPicker onAdd={(id) => setPurse((p) => [...p, id])} kinds={COIN_TYPES.filter((c) => c.kind === "coin").map((c) => c.id)} />
      <div className="digital-display" style={{ fontSize: 24, padding: "10px 16px" }}>
        Purse: {purse.length} coin{purse.length === 1 ? "" : "s"} = {total}¢ (${dollars(total)})
      </div>
      <CoinRow ids={purse} onRemove={(i) => setPurse((p) => p.filter((_, k) => k !== i))} />
      <p className="muted small">Click a coin in your purse to remove it.</p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "countMixedCoins" | "combineBillsCoins" | "makeChange" | "compareAmounts" | "dollarCentNotation";
const BUCKETS: Bucket[] = ["countMixedCoins", "combineBillsCoins", "makeChange", "compareAmounts", "dollarCentNotation"];

function randomCoinSet(countRange: [number, number] = [3, 5]): CoinId[] {
  const kinds: CoinId[] = ["penny", "nickel", "dime", "quarter"];
  const n = randInt(countRange[0], countRange[1]);
  return Array.from({ length: n }, () => kinds[randInt(0, kinds.length - 1)]);
}

function countCoinsProblem(): Problem {
  const name = pickName();
  let ids = randomCoinSet();
  let total = totalCents(ids);
  // Avoid a degenerate all-same-coin set occasionally, so counting values
  // (not just multiplying one coin's value by a count) stays the actual skill.
  while (new Set(ids).size === 1) {
    ids = randomCoinSet();
    total = totalCents(ids);
  }
  return {
    title: "Count the coins",
    bucket: "countMixedCoins",
    story: `${name} has these coins.`,
    visual: () => <CoinRow ids={ids} />,
    steps: [{ kind: "number", prompt: "How much money is this, in cents?", hint: "Add up each coin's own value — don't just count the coins.", explain: `${ids.map((id) => coinSpec(id).label).join(" + ")} = ${total}¢.`, answer: total, suffix: "¢" }],
    wrapUp: `${name} has ${total}¢.`,
  };
}

function combineBillsCoinsProblem(): Problem {
  const name = pickName();
  const bills = randInt(1, 3);
  const coins = randomCoinSet([2, 4]);
  const total = bills * 100 + totalCents(coins);
  const ids: CoinId[] = [...Array.from({ length: bills }, () => "dollar1" as CoinId), ...coins];
  return {
    title: "Bills and coins together",
    bucket: "combineBillsCoins",
    story: `${name} has these bills and coins.`,
    visual: () => <CoinRow ids={ids} />,
    steps: [
      { kind: "number", prompt: "How much money is that in bills alone?", hint: `${bills} × $1.`, explain: `${bills} × $1 = $${bills}.00.`, answer: bills, prefix: "$" },
      { kind: "number", prompt: "How much money are the coins alone, in cents?", hint: "Add up each coin's value.", explain: `${coins.map((id) => coinSpec(id).label).join(" + ")} = ${totalCents(coins)}¢.`, answer: totalCents(coins), suffix: "¢" },
      { kind: "number", prompt: "How much money is everything together, in dollars?", hint: "Add the bills and the coins together, then write it in dollars.", explain: `$${bills}.00 + $${dollars(totalCents(coins))} = $${dollars(total)}.`, answer: total / 100, prefix: "$", money: true },
    ],
    wrapUp: `${name} has $${dollars(total)} altogether.`,
  };
}

function makeChangeProblem(): Problem {
  const name = pickName();
  const costCents = randInt(125, 475);
  const paidOptions = [500, 1000].filter((p) => p > costCents);
  const paidCents = paidOptions[randInt(0, paidOptions.length - 1)];
  const changeCents = paidCents - costCents;
  return {
    title: "Make change",
    bucket: "makeChange",
    story: `${name} buys something that costs $${dollars(costCents)} and pays with $${dollars(paidCents)}. How much change should ${name} get back?`,
    visual: () => (
      <div className="digital-display" style={{ fontSize: 24 }}>
        Paid: ${dollars(paidCents)} − Cost: ${dollars(costCents)}
      </div>
    ),
    steps: [{ kind: "number", prompt: "How much change should " + name + " get back?", hint: `Subtract: $${dollars(paidCents)} − $${dollars(costCents)}.`, explain: `$${dollars(paidCents)} − $${dollars(costCents)} = $${dollars(changeCents)}.`, answer: changeCents / 100, prefix: "$", money: true }],
    wrapUp: `${name} should get $${dollars(changeCents)} back in change.`,
  };
}

function compareAmountsProblem(): Problem {
  const [nameA, nameB] = shuffle(NAMES).slice(0, 2);
  const idsA = randomCoinSet([2, 4]);
  let idsB = randomCoinSet([2, 4]);
  const totalA = totalCents(idsA);
  let totalB = totalCents(idsB);
  while (totalA === totalB) {
    idsB = randomCoinSet([2, 4]);
    totalB = totalCents(idsB);
  }
  const moreIsA = totalA > totalB;
  const moreName = moreIsA ? nameA : nameB;
  const diff = Math.abs(totalA - totalB);
  return {
    title: "Compare two amounts",
    bucket: "compareAmounts",
    story: `${nameA} and ${nameB} each counted their coins.`,
    visual: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="control-row" style={{ alignItems: "center" }}>
          <span style={{ fontWeight: 700, minWidth: 60 }}>{nameA}:</span> <CoinRow ids={idsA} />
        </div>
        <div className="control-row" style={{ alignItems: "center" }}>
          <span style={{ fontWeight: 700, minWidth: 60 }}>{nameB}:</span> <CoinRow ids={idsB} />
        </div>
      </div>
    ),
    steps: [
      choice({ prompt: "Who has more money?", hint: "Add up the value of each person's coins first.", explain: `${nameA} has ${totalA}¢ and ${nameB} has ${totalB}¢, so ${moreName} has more.` }, moreName, [moreIsA ? nameB : nameA]),
      { kind: "number", prompt: `How much MORE does ${moreName} have?`, hint: "Subtract the smaller total from the bigger total.", explain: `${Math.max(totalA, totalB)}¢ − ${Math.min(totalA, totalB)}¢ = ${diff}¢.`, answer: diff, suffix: "¢" },
    ],
    wrapUp: `${moreName} has ${diff}¢ more.`,
  };
}

function notationProblem(): Problem {
  const toCents = Math.random() < 0.5;
  const wholeDollars = randInt(1, 4);
  const extraCents = [0, 25, 50, 75][randInt(0, 3)];
  const totalCentsVal = wholeDollars * 100 + extraCents;
  const dollarText = `$${dollars(totalCentsVal)}`;
  if (toCents) {
    return {
      title: "Dollars to cents",
      bucket: "dollarCentNotation",
      story: `${dollarText} is the same amount of money as how many cents?`,
      visual: () => <div className="digital-display" style={{ fontSize: 28 }}>{dollarText} = ? ¢</div>,
      steps: [{ kind: "number", prompt: `${dollarText} is how many cents?`, hint: "Each whole dollar is 100 cents.", explain: `${dollarText} = ${totalCentsVal}¢.`, answer: totalCentsVal, suffix: "¢" }],
      wrapUp: `${dollarText} is the same as ${totalCentsVal}¢.`,
    };
  }
  return {
    title: "Cents to dollars",
    bucket: "dollarCentNotation",
    story: `${totalCentsVal}¢ is the same amount of money as how many dollars?`,
    visual: () => <div className="digital-display" style={{ fontSize: 28 }}>{totalCentsVal}¢ = $?</div>,
    steps: [{ kind: "number", prompt: `${totalCentsVal}¢ is how many dollars?`, hint: "Every 100 cents is one whole dollar.", explain: `${totalCentsVal}¢ = ${dollarText}.`, answer: totalCentsVal / 100, prefix: "$", money: true }],
    wrapUp: `${totalCentsVal}¢ is the same as ${dollarText}.`,
  };
}

export const moneyWordProblems: Unit = {
  id: "moneyWordProblems",
  title: "Money Word Problems",
  goal: "Add up a mix of coins and bills, and solve word problems about money using $ and ¢.",
  standard: "2.MD.8",
  keyIdea: (
    <>
      <p>Add up what each coin is WORTH, not how many coins there are — a quarter alone beats three pennies.</p>
      <p>$1.25 and 125¢ are the same amount of money, written two different ways.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Coin values are a fixed fact set meant for instant recall, not
  // re-derived every time — periodically re-gate Practice, same convention
  // as every other memorized-fact unit in this app.
  reintroEverySolved: 20,
  problems: [
    { label: "Count the Coins", make: countCoinsProblem, buckets: ["countMixedCoins"] },
    { label: "Bills and Coins", make: combineBillsCoinsProblem, buckets: ["combineBillsCoins"] },
    { label: "Make Change", make: makeChangeProblem, buckets: ["makeChange"] },
    { label: "Compare Amounts", make: compareAmountsProblem, buckets: ["compareAmounts"] },
    { label: "$ or ¢?", make: notationProblem, buckets: ["dollarCentNotation"] },
  ],
  requiredBuckets: BUCKETS,
  test: moneyWordProblemsTest,
};
