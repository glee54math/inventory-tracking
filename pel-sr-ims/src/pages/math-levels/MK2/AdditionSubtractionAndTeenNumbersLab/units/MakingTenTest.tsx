import { TenFrame } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Making 10 ----------
// 10 questions from 10 generators. Self-contained — no import from
// MakingTen.tsx, and that file never imports back from here.

/** Partner for a small number (1, 2, 3) — large, easy-to-visualize complement. */
export const smallComplementQuestion = (): TestQuestion[] => {
  const n = randInt(1, 3);
  const partner = 10 - n;
  return [
    {
      visual: <TenFrame filled={n} tone="a" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What number goes with ${n} to make exactly 10?`, hint: "Count the empty boxes left in the ten frame.", explain: `${n} + ${partner} = 10.`, answer: partner },
    },
  ];
};

/** Partner for a number close to 10 (7, 8, 9) — small complement, easy to undercount. */
export const nearTenComplementQuestion = (): TestQuestion[] => {
  const n = randInt(7, 9);
  const partner = 10 - n;
  return [
    {
      visual: <TenFrame filled={n} tone="a" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What number goes with ${n} to make exactly 10?`, hint: "The complement here is small — count the empty boxes carefully, don't guess.", explain: `${n} + ${partner} = 10.`, answer: partner },
    },
  ];
};

/** Partner for a "middle" number (4, 5, 6) — no proximity shortcut. */
export const middleComplementQuestion = (): TestQuestion[] => {
  const n = randInt(4, 6);
  const partner = 10 - n;
  return [
    {
      visual: <TenFrame filled={n} tone="a" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What number goes with ${n} to make exactly 10?`, hint: "Count the empty boxes left in the ten frame.", explain: `${n} + ${partner} = 10.`, answer: partner },
    },
  ];
};

/** Doubling-instead-of-complement distractor — a specific, nameable mistake. */
export const doublingDistractorQuestion = (): TestQuestion[] => {
  const n = randInt(2, 8);
  const partner = 10 - n;
  const doubled = n * 2;
  return [
    {
      visual: <TenFrame filled={n} tone="a" />,
      difficulty: "medium",
      step: choice(
        { prompt: `What number goes with ${n} to make exactly 10?`, hint: "You need 10 total, not double the number.", explain: `${n} + ${partner} = 10, not ${n} + ${n} = ${doubled}.` },
        String(partner),
        doubled !== partner ? [String(doubled)] : [String(partner + 1)] // misconception: doubling the number instead of finding its complement
      ),
    },
  ];
};

/** Which equation shows the partner pair — symbolic recognition. */
export const partnerEquationChoiceQuestion = (): TestQuestion[] => {
  const n = randInt(1, 9);
  const partner = 10 - n;
  return [
    {
      visual: <TenFrame filled={n} tone="a" fillB={partner} fillBTone="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: "Which number sentence shows this partner pair?", hint: "The two partners add up to exactly 10.", explain: `${n} + ${partner} = 10.` },
        `${n} + ${partner} = 10`,
        [`${n} + ${n} = 10`, `${partner} − ${n} = 10`] // misconceptions: doubling; wrong operation
      ),
    },
  ];
};

/** Strategy check — the named misconception, counting up vs. recall. */
export const countingUpVsRecallQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: "To find a number's partner for 10 quickly, which is better: counting up from 1 every time, or just knowing the fact right away?",
          hint: "Think about which one is faster once you've practiced.",
          explain: "Just knowing it (recall) is the goal — counting up from 1 every time works, but it's slow.",
        },
        "Just knowing it (recall)",
        ["Counting up from 1 every time"] // misconception: relying on re-deriving the fact instead of recalling it
      ),
    },
  ];
};

/** Generalization: every number 1-9 has exactly one partner for 10. */
export const everyNumberHasOneTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: every number from 1 to 9 has exactly one partner that makes 10.",
          hint: "Check a few: 1+9, 2+8, 3+7...",
          explain: "True — each number from 1 to 9 pairs with exactly one other number to make 10.",
        },
        "True",
        ["False"] // misconception: doubting the pattern holds for every number
      ),
    },
  ];
};

/** Reverse-direction verify: a TRUE pair. */
export const verifyTruePairQuestion = (): TestQuestion[] => {
  const n = randInt(1, 9);
  const partner = 10 - n;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Do ${n} and ${partner} make exactly 10?`, hint: "Add them exactly.", explain: `${n} + ${partner} = 10.` },
        "Yes",
        ["No"] // misconception: doubting a genuinely correct pair
      ),
    },
  ];
};

/** Reverse-direction verify: a FALSE (near-miss) pair — targets undercounting. */
export const verifyFalsePairQuestion = (): TestQuestion[] => {
  const n = randInt(2, 8);
  const actualPartner = 10 - n;
  const nearMiss = Math.random() < 0.5 ? actualPartner + 1 : actualPartner - 1;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Do ${n} and ${nearMiss} make exactly 10?`, hint: "Add them exactly — don't just guess from how close they look.", explain: `${n} + ${nearMiss} = ${n + nearMiss}, which is NOT 10. ${n}'s actual partner is ${actualPartner}.` },
        "No",
        ["Yes"] // misconception: accepting a near-miss pair as "close enough" to 10
      ),
    },
  ];
};

/** Full ten-frame edge case: 10's "partner" is 0. */
export const zeroComplementQuestion = (): TestQuestion[] => {
  return [
    {
      visual: <TenFrame filled={10} tone="a" />,
      difficulty: "medium",
      step: { kind: "number", prompt: "The ten frame is already completely full (10). How many MORE do you need to reach 10?", hint: "If it's already full, nothing more is needed.", explain: "10 + 0 = 10 — no more are needed.", answer: 0 },
    },
  ];
};

export const makingTenTest: Unit["test"] = {
  questions: [
    smallComplementQuestion,
    nearTenComplementQuestion,
    middleComplementQuestion,
    doublingDistractorQuestion,
    partnerEquationChoiceQuestion,
    countingUpVsRecallQuestion,
    everyNumberHasOneTrueFalseQuestion,
    verifyTruePairQuestion,
    verifyFalsePairQuestion,
    zeroComplementQuestion,
  ],
  passScore: 9,
};
