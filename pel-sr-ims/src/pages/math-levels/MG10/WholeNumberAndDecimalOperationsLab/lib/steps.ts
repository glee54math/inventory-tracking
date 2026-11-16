// Step builders shared by the unit files and their *Test.tsx files (a third
// module, so there is no unit<->Test import). Every decimal answer is graded
// EXACTLY (NumberStep.exact / SentenceNumberBlank.exact): the engine's usual
// 0.006 tolerance would let 0.499 pass for 0.5. Every typed decimal also
// carries padTo, so the answer key shows "3.042" (the engine's fmt() keeps
// only 2 digits after the point).

import { choice, numberBlank, selectBlank, sentence, type ChoiceStep, type NumberStep, type SentenceStep } from "../../../shared/engine/types";
import { shuffle } from "../../../shared/lib/math";
import {
  afterPoint,
  compareSymbol,
  decName,
  decText,
  digitsAfter,
  expandedText,
  digitsOf,
  droppedCarryValue,
  nearestText,
  noCarryValue,
  PLACE_NAMES,
  PLACE_SINGULAR,
  roundAt,
  showDec,
  toNum,
  unitOf,
  wholeDigits,
  type ComparePair,
  type Dec,
  type Places,
} from "./decimals";

type Base = { prompt: string; hint: string; explain: string; showMe?: string };

/** A typed decimal, graded exactly, written with exactly d.p digits after the point. */
export const decStep = (base: Base, d: Dec, diagnose?: (v: number) => string | null): NumberStep => ({
  ...base,
  kind: "number",
  answer: toNum(d.t),
  exact: true,
  ...(d.p > 0 ? { padTo: d.p } : {}),
  ...(diagnose ? { diagnose } : {}),
});

const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;

/** The digits after the point squeezed together with the zeros left out: 3.042 -> 3.42. Null if no zero inside. */
const squeezed = (d: Dec): number | null => {
  const { w, d: ds } = digitsOf(d.t);
  const kept = ds.slice(0, d.p);
  if (!kept.slice(0, -1).includes(0)) return null;
  const s = kept.filter((x) => x !== 0).join("");
  return s ? Number(`${w}.${s}`) : null;
};

// ---------- Unit 1 ----------

/** Number name -> decimal ("four and twenty-six thousandths" -> 4.026). */
export function nameToDecStep(d: Dec): NumberStep {
  const { unit } = afterPoint(d.t, d.p);
  const sq = squeezed(d);
  return decStep(
    {
      prompt: `Write ${decName(d.t, d.p)} as a decimal.`,
      hint: `The word "${unit}" tells you the last digit goes in the ${PLACE_NAMES[d.p]} place. Use 0s to fill the places before it.`,
      explain: `${showDec(d)} is read "${decName(d.t, d.p)}." It has ${d.p} digit${d.p === 1 ? "" : "s"} after the point, because the last one is in the ${PLACE_NAMES[d.p]} place.`,
    },
    d,
    (v) =>
      sq !== null && near(v, sq)
        ? `${PLACE_NAMES[d.p][0].toUpperCase()}${PLACE_NAMES[d.p].slice(1)} need ${d.p} digits after the point. Put a 0 in each empty place.`
        : null
  );
}

/** Decimal -> "w and [n] [unit]" (3.042 is 3 and 42 thousandths). A select for the unit, tap buttons. */
export function decToNameStep(d: Dec): SentenceStep {
  const w = Math.floor(d.t / 1000);
  const { n, unit } = afterPoint(d.t, d.p);
  const units = n === 1 ? ["tenth", "hundredth", "thousandth"] : ["tenths", "hundredths", "thousandths"];
  const step = sentence(
    {
      prompt: `How do you read ${showDec(d)}? Read the digits after the point as one number. Then name the last digit's place.`,
      hint: `Look at the last digit of ${showDec(d)}. Which place is it in? Count the digits after the point.`,
      explain: `${showDec(d)} is read "${decName(d.t, d.p)}."`,
    },
    w > 0 ? `${showDec(d)} is ${w} and ` : `${showDec(d)} is `,
    numberBlank(n),
    " ",
    selectBlank(unit, units.filter((u) => u !== unit)),
    "."
  );
  return { ...step, checkEach: true };
}

/**
 * Expanded form with the parts MIXED UP, three of them blank:
 * "3.042 = 2 × 1/1000 + 3 + [ ] × 1/10 + [ ] × 1/100" (round 1, C1-05). The
 * student has to match each box to its place, not copy the digits left to
 * right. A 0 digit is always one of the blanks. With a 2- or 3-digit whole
 * part (347.392), one blank is a whole-number place (× 100, × 10 or × 1).
 */
export function expandedFillStep(t: number): SentenceStep {
  const { w, d } = digitsOf(t);
  const x = decText(t, 3);
  type Term = { digit: number | null; text: string; rank: number };
  // Whole part: one printed term ("3"), or one term per place (3 × 100 ...).
  const whole: Term[] = w < 10 ? [{ digit: null, text: String(w), rank: 0 }] : wholeDigits(w).map(([dg, v], i) => ({ digit: dg, text: ` × ${v}`, rank: i }));
  const fracs: Term[] = d.map((dg, i) => ({ digit: dg, text: ` × 1/${10 ** (i + 1)}`, rank: 10 + i }));
  // Pick the blanks: the 0 digit (if any) first, then others, 3 in all.
  const zeroIdx = d.indexOf(0);
  let blanks: Term[];
  if (w < 10) blanks = fracs;
  else {
    const fr = shuffle(fracs.filter((_, i) => i !== zeroIdx));
    const two = zeroIdx >= 0 ? [fracs[zeroIdx], fr[0]] : fr.slice(0, 2);
    blanks = [...two, shuffle(whole)[0]];
  }
  const all = [...whole, ...fracs];
  const isBlank = (o: Term) => blanks.includes(o);
  // Mix the order until the boxes are not in the decimal's left-to-right order.
  const boxesInOrder = (o: Term[]) => o.filter(isBlank).every((b, k, arr) => k === 0 || arr[k - 1].rank < b.rank);
  let order = shuffle(all);
  for (let i = 0; i < 50 && boxesInOrder(order); i++) order = shuffle(all);
  // Text pieces between the blanks.
  const segs: string[] = [`${x} = `];
  const answers: number[] = [];
  order.forEach((o, k) => {
    const sep = k === 0 ? "" : " + ";
    if (isBlank(o)) {
      segs[segs.length - 1] += sep;
      answers.push(o.digit as number);
      segs.push(o.text);
    } else {
      segs[segs.length - 1] += sep + (o.digit === null ? o.text : `${o.digit}${o.text}`);
    }
  });
  segs[segs.length - 1] += ".";
  // The "copied the digits in order" mistake: the blanks filled with the digits in the decimal's order.
  const leftToRight = [...blanks].sort((a, b) => a.rank - b.rank).map((o) => o.digit as number);
  const step = sentence(
    {
      prompt: `Write ${x} in expanded form. The parts are mixed up. Type the digit that goes in each box.`,
      hint: `Look at the number each box is times. 1/10 means tenths, 1/100 means hundredths, 1/1000 means thousandths.${w >= 10 ? " 100 means hundreds, 10 means tens, 1 means ones." : ""} Find the digit in that place in ${x}.`,
      explain: `${x} = ${expandedText(t)}.`,
    },
    segs[0],
    numberBlank(answers[0]),
    segs[1],
    numberBlank(answers[1]),
    segs[2]
  );
  return {
    ...step,
    more: [{ blank: numberBlank(answers[2]), after: segs[3] }],
    diagnose: (vals) => {
      const got = vals.map((v) => Number(v));
      if (got.some((v, i) => v !== answers[i]) && got.every((v, i) => v === leftToRight[i]) && leftToRight.some((v, i) => v !== answers[i]))
        return "The parts are mixed up, so the digits don't go in order. Match each box to its place.";
      return null;
    },
  };
}

/** Short expanded form (zero terms left out) -> decimal: 4 + 7/10 + 5/1000 -> 4.705. */
export function expandedToDecStep(t: number, shortText: string): NumberStep {
  const d: Dec = { t, p: 3 };
  const sq = squeezed(d);
  return decStep(
    {
      prompt: `${shortText} = ?  Write it as a decimal.`,
      hint: "Find the tenths, the hundredths and the thousandths. If a place has none, write a 0 there.",
      explain: `${shortText} = ${decText(t, 3)}.`,
    },
    d,
    (v) => (sq !== null && near(v, sq) ? "One place has nothing in it. Write a 0 in that place, so each digit stays in its own place." : null)
  );
}

const thousandthsText = (d: Dec) => decText(d.t, 3);

/** "0.45 is [450] thousandths, and 0.5 is [500] thousandths." Both numbers have the same whole part. */
export function thousandthsStep(pair: ComparePair): SentenceStep {
  const { a, b, w } = pair;
  const fa = a.t % 1000;
  const fb = b.t % 1000;
  const lead = (d: Dec) => (w > 0 ? `${showDec(d)} is ${w} and ` : `${showDec(d)} is `);
  const step = sentence(
    {
      prompt: "Write both numbers with three digits after the point. How many thousandths does each have after the point?",
      hint: "Line up the places. Fill the empty places with 0. Then read the three digits after the point as one number.",
      explain: `${showDec(a)} = ${thousandthsText(a)} and ${showDec(b)} = ${thousandthsText(b)}. That is ${fa} thousandths and ${fb} thousandths after the point.`,
    },
    lead(a),
    { ...numberBlank(fa), exact: true },
    ` thousandths. ${lead(b)}`,
    { ...numberBlank(fb), exact: true },
    " thousandths."
  );
  return {
    ...step,
    diagnose: ([x, y]) => {
      const vx = Number(x);
      const vy = Number(y);
      const looks = (d: Dec, v: number) => d.p < 3 && v === digitsAfter(d) && v !== d.t % 1000;
      if (looks(a, vx)) return `Write ${showDec(a)} with three digits after the point first. Then read those three digits.`;
      if (looks(b, vy)) return `Write ${showDec(b)} with three digits after the point first. Then read those three digits.`;
      return null;
    },
  };
}

/** Pick the true statement: "0.45 < 0.5", "0.45 > 0.5" or "0.45 = 0.5". */
export function signStep(pair: ComparePair, prompt = "Which is true?"): ChoiceStep {
  const { a, b } = pair;
  const s = compareSymbol(a.t, b.t);
  const say = (sym: string) => `${showDec(a)} ${sym} ${showDec(b)}`;
  const longer = a.p > b.p ? a : b.p > a.p ? b : null;
  return choice(
    {
      prompt,
      hint: "Compare the thousandths you found, or line the digits up by place and compare from the left.",
      explain:
        s === "="
          ? `${showDec(a)} and ${showDec(b)} are the same amount. Extra 0s at the end don't change a decimal.`
          : `${say(s)}.${longer && compareSymbol(longer.t, (longer === a ? b : a).t) === "<" ? ` ${showDec(longer)} has more digits, but it is the smaller number.` : ""}`,
    },
    say(s),
    // "<" / ">" / "=" — the two wrong ones include "the longer one is bigger" (or "they are equal")
    (["<", ">", "="] as const).filter((x) => x !== s).map(say)
  );
}

// ---------- Unit 2 ----------

const placeWord = (p: Places) => (p === 0 ? "ones" : PLACE_NAMES[p]);

/** "2.437 is between two hundredths: [2.43] and [2.44]." Typed, exact. */
export function betweenStep(x: Dec, p: Places): SentenceStep {
  const { lo, hi } = roundAt(x.t, p);
  const unit = PLACE_SINGULAR[p];
  return sentence(
    {
      prompt:
        p === 0
          ? `We will round ${showDec(x)} to ${nearestText(p)}. First find the two whole numbers it is between.`
          : `We will round ${showDec(x)} to ${nearestText(p)}. Find the ${unit} just below it and the ${unit} just above it.`,
      hint: `Keep the digits up to the ${placeWord(p)} place and drop the rest. That is the smaller one. The bigger one is 1 ${p === 0 ? "" : `${PLACE_NAMES[p].slice(0, -1)} `}more.`,
      explain: `${showDec(x)} is between ${decText(lo, p)} and ${decText(hi, p)}.`,
    },
    `${showDec(x)} is between `,
    { ...numberBlank(toNum(lo)), exact: true },
    " and ",
    { ...numberBlank(toNum(hi)), exact: true },
    "."
  );
}

/** "What digit is just right of the tenths place in 3.40?" (the exact bucket's first step). */
export function nextDigitStep(x: Dec, p: Places): NumberStep {
  const { next } = roundAt(x.t, p);
  return {
    kind: "number",
    answer: next,
    prompt: `We will round ${showDec(x)} to ${nearestText(p)}. What digit is just to the right of the ${placeWord(p)} place?`,
    hint: `Find the ${placeWord(p)} place. Then look one place to the right: the ${PLACE_NAMES[p + 1]} place.`,
    explain: `The ${PLACE_NAMES[p + 1]} digit is ${next}. That is the digit that decides.`,
  };
}

/**
 * "Write a digit in every place through the hundredths place, even a 0." Every graded rounding prompt says
 * it, because the answer must show the place (3.00, not 3). Round 1, C1-01
 * (user decision: say it, keep requiring it). Empty for whole numbers.
 */
export const writeEveryPlace = (p: Places): string => (p === 0 ? "" : ` Write a digit in every place through the ${PLACE_NAMES[p]} place, even a 0.`);

/** Round x to place p: typed, exact, written to that place (3.00 for hundredths). The prompt always ends with writeEveryPlace(p). */
export function roundStep(x: Dec, p: Places, lead = `Round ${showDec(x)} to ${nearestText(p)}.`): NumberStep {
  const prompt = `${lead}${writeEveryPlace(p)}`;
  const { lo, hi, mid, r, next } = roundAt(x.t, p);
  const other = r === hi ? lo : hi;
  const nc = noCarryValue(x.t, p);
  const dc = droppedCarryValue(x.t, p);
  const later = digitsOf(x.t).d.slice(p + 1, x.p).some((dd) => dd >= 5);
  const nextName = PLACE_NAMES[p + 1];
  const exact = x.t === r;
  return decStep(
    {
      prompt,
      hint: `Look at the ${nextName} digit. Is it 5 or more? Compare ${showDec(x)} with the halfway mark, ${decText(mid, (p + 1) as Places)}.`,
      explain: exact
        ? `Every digit after the ${placeWord(p)} place is 0, so ${showDec(x)} rounds to ${decText(r, p)}. The amount doesn't change.`
        : `The ${nextName} digit is ${next}. ${next >= 5 ? "5 or more rounds up" : "Less than 5 rounds down"}, so ${showDec(x)} rounds to ${decText(r, p)}.`,
    },
    { t: r, p },
    (v) => {
      // Only on a problem that rounds UP through the 9 (C1-06): a round-down problem has no carry to describe.
      if (nc !== null && near(v, nc) && r === hi)
        return `The ${placeWord(p)} digit is 9. 9 + 1 = 10, and 10 can't fit in one place. Write 0 in the ${placeWord(p)} place. Add 1 to the place on its left.`;
      if (dc !== null && near(v, dc) && r === hi) return "You wrote the 0. Now add the 1 to the place on its left.";
      if (exact && near(v, toNum(r + unitOf(p)))) return `The digit after the ${placeWord(p)} place is 0. Nothing gets rounded up.`;
      if (near(v, toNum(other))) {
        if (next === 4 && later) return `Only the ${nextName} digit decides. The digits after it don't count.`;
        return `Check the ${nextName} digit again. Is it 5 or more?`;
      }
      if (near(v, toNum(x.t))) return `That is the number itself. Keep only the digits up to the ${placeWord(p)} place.`;
      return null;
    }
  );
}
