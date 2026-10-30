import { CoinRow, coinSpec, totalCents, type CoinId } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Money Word Problems ----------
// Self-contained (no import from MoneyWordProblems.tsx).

const NAMES = ["Mia", "Jun", "Sam", "Priya", "Leo", "Ava", "Noah", "Zoe"] as const;
const pickName = () => shuffle(NAMES)[0];
const dollars = (cents: number) => (cents / 100).toFixed(2);

function randomCoinSet(countRange: [number, number] = [3, 5]): CoinId[] {
  const kinds: CoinId[] = ["penny", "nickel", "dime", "quarter"];
  const n = randInt(countRange[0], countRange[1]);
  return Array.from({ length: n }, () => kinds[randInt(0, kinds.length - 1)]);
}

export const countCoinsQuestion = (difficulty: "easy" | "medium" = "easy"): TestQuestion[] => {
  const name = pickName();
  let ids = randomCoinSet();
  let total = totalCents(ids);
  while (new Set(ids).size === 1) {
    ids = randomCoinSet();
    total = totalCents(ids);
  }
  return [
    {
      visual: <CoinRow ids={ids} />,
      difficulty,
      step: { kind: "number", prompt: `${name} has these coins. How much money is this, in cents?`, hint: "Add up each coin's own value.", explain: `${ids.map((id) => coinSpec(id).label).join(" + ")} = ${total}¢.`, answer: total, suffix: "¢" },
    },
  ];
};

/** The core "count coins instead of adding values" misconception, isolated. */
export const countValueMisconceptionQuestion = (): TestQuestion[] => {
  const ids: CoinId[] = ["quarter", "quarter", "dime", "dime", "nickel"];
  const total = totalCents(ids);
  return [
    {
      visual: <CoinRow ids={ids} />,
      difficulty: "medium",
      step: choice(
        { prompt: "How much money is this?", hint: "There are 5 coins, but don't just count them — add their values.", explain: `25+25+10+10+5 = ${total}¢.` },
        `${total}¢`,
        [`${ids.length}¢`, `${total + 5}¢`]
      ),
    },
  ];
};

export const billsAndCoinsQuestion = (): TestQuestion[] => {
  const name = pickName();
  const bills = randInt(1, 3);
  const coins = randomCoinSet([2, 4]);
  const total = bills * 100 + totalCents(coins);
  const ids: CoinId[] = [...Array.from({ length: bills }, () => "dollar1" as CoinId), ...coins];
  return [
    {
      visual: <CoinRow ids={ids} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${name} has these bills and coins. How much money is that altogether, in dollars?`, hint: "Add the bills and the coins together.", explain: `$${bills}.00 + ${coinSpec(coins[0]).label}... = $${dollars(total)}.`, answer: total / 100, prefix: "$", money: true },
    },
  ];
};

export const makeChangeQuestion = (): TestQuestion[] => {
  const name = pickName();
  const costCents = randInt(125, 475);
  const paidOptions = [500, 1000].filter((p) => p > costCents);
  const paidCents = paidOptions[randInt(0, paidOptions.length - 1)];
  const changeCents = paidCents - costCents;
  return [
    {
      visual: (
        <div className="digital-display" style={{ fontSize: 22 }}>
          Paid: ${dollars(paidCents)} − Cost: ${dollars(costCents)}
        </div>
      ),
      difficulty: "hard",
      step: { kind: "number", prompt: `${name} buys something for $${dollars(costCents)} and pays with $${dollars(paidCents)}. How much change should ${name} get?`, hint: `Subtract: $${dollars(paidCents)} − $${dollars(costCents)}.`, explain: `$${dollars(paidCents)} − $${dollars(costCents)} = $${dollars(changeCents)}.`, answer: changeCents / 100, prefix: "$", money: true },
    },
  ];
};

export const compareAmountsQuestion = (): TestQuestion[] => {
  const [nameA, nameB] = shuffle(NAMES).slice(0, 2);
  const idsA = randomCoinSet([2, 4]);
  let idsB = randomCoinSet([2, 4]);
  const totalA = totalCents(idsA);
  let totalB = totalCents(idsB);
  while (totalA === totalB) {
    idsB = randomCoinSet([2, 4]);
    totalB = totalCents(idsB);
  }
  const moreName = totalA > totalB ? nameA : nameB;
  const diff = Math.abs(totalA - totalB);
  return [
    {
      visual: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="control-row" style={{ alignItems: "center" }}>
            <span style={{ fontWeight: 700, minWidth: 60 }}>{nameA}:</span> <CoinRow ids={idsA} />
          </div>
          <div className="control-row" style={{ alignItems: "center" }}>
            <span style={{ fontWeight: 700, minWidth: 60 }}>{nameB}:</span> <CoinRow ids={idsB} />
          </div>
        </div>
      ),
      difficulty: "medium",
      step: choice(
        { prompt: "Who has more money?", hint: "Add up the value of each person's coins first.", explain: `${nameA} has ${totalA}¢ and ${nameB} has ${totalB}¢.` },
        moreName,
        [moreName === nameA ? nameB : nameA]
      ),
    },
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `How much MORE does ${moreName} have than the other person?`, hint: "Subtract the smaller total from the bigger total.", explain: `${Math.max(totalA, totalB)}¢ − ${Math.min(totalA, totalB)}¢ = ${diff}¢.`, answer: diff, suffix: "¢" },
    },
  ];
};

export const notationQuestion = (direction: "toCents" | "toDollars"): TestQuestion[] => {
  const wholeDollars = randInt(1, 4);
  const extraCents = [0, 25, 50, 75][randInt(0, 3)];
  const totalCentsVal = wholeDollars * 100 + extraCents;
  const dollarText = `$${dollars(totalCentsVal)}`;
  if (direction === "toCents") {
    return [
      {
        visual: null,
        difficulty: "medium",
        step: { kind: "number", prompt: `${dollarText} is the same amount of money as how many cents?`, hint: "Each whole dollar is 100 cents.", explain: `${dollarText} = ${totalCentsVal}¢.`, answer: totalCentsVal, suffix: "¢" },
      },
    ];
  }
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `${totalCentsVal}¢ is the same amount of money as how many dollars?`, hint: "Every 100 cents is one whole dollar.", explain: `${totalCentsVal}¢ = ${dollarText}.`, answer: totalCentsVal / 100, prefix: "$", money: true },
    },
  ];
};

/** Generalization / true-false trap. */
export const moreCoinsTrapQuestion = (): TestQuestion[] => [
  {
    visual: (
      <div className="control-row" style={{ alignItems: "center" }}>
        <CoinRow ids={["penny", "penny", "penny"]} />
        <span style={{ fontWeight: 700 }}>vs</span>
        <CoinRow ids={["quarter"]} />
      </div>
    ),
    difficulty: "medium",
    step: choice(
      { prompt: "True or false: whoever has MORE coins always has more money.", hint: "Compare 3 pennies to 1 quarter.", explain: "False — 3 pennies is only 3¢, but 1 quarter is 25¢." },
      "False",
      ["True"]
    ),
  },
];

export const moneyWordProblemsTest: Unit["test"] = {
  questions: [
    () => countCoinsQuestion("easy"),
    () => countCoinsQuestion("medium"),
    () => countValueMisconceptionQuestion(),
    () => billsAndCoinsQuestion(),
    () => makeChangeQuestion(),
    () => compareAmountsQuestion(),
    () => notationQuestion("toCents"),
    () => notationQuestion("toDollars"),
    () => moreCoinsTrapQuestion(),
  ],
  passScore: 9,
};
