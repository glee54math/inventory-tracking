import { pick, randInt } from "../../../shared/lib/math";
import { mixedText } from "./fractions";

// Story pools for Unit 3 (add/subtract word problems), Unit 4 (whole number ×
// fraction stories) and Unit 5 (line-plot contexts). Lab-local and imported
// by both unit files and their *Test.tsx files (this file imports neither).

export const NAMES = ["Ana", "Ben", "Mia", "Leo", "Zoe", "Sam", "Ivy", "Raj", "Kai", "Nora"] as const;

/** Two different names. */
export function twoNames(): [string, string] {
  const a = pick(NAMES);
  let b = pick(NAMES);
  while (b === a) b = pick(NAMES);
  return [a, b];
}

export interface AmountContext {
  item: string;
  one: string;
  many: string;
  gain: string;
  use: string;
}

export const AMOUNT_CONTEXTS: AmountContext[] = [
  { item: "ribbon", one: "yard", many: "yards", gain: "bought", use: "used" },
  { item: "juice", one: "cup", many: "cups", gain: "poured in", use: "drank" },
  { item: "flour", one: "cup", many: "cups", gain: "added", use: "used" },
  { item: "rope", one: "foot", many: "feet", gain: "tied on", use: "cut off" },
  { item: "sand", one: "pound", many: "pounds", gain: "scooped in", use: "poured out" },
];

/** "3/4 yard", "2 1/4 yards", "2 yards". */
export const amountWords = (pieces: number, d: number, c: { one: string; many: string }): string => `${mixedText(pieces, d)} ${unitFor(pieces, d, c)}`;
/** The unit word that goes after an amount of this size (singular up to 1 whole). */
export const unitFor = (pieces: number, d: number, c: { one: string; many: string }): string => (pieces <= d ? c.one : c.many);

export interface SameWholeContext {
  small: string;
  large: string;
  thing: string;
  verb: string;
  /** Same-fraction denominators that make sense for this object. */
  dens: number[];
}

export const SAME_WHOLE_CONTEXTS: SameWholeContext[] = [
  { small: "small pizza", large: "large pizza", thing: "pizza", verb: "ate", dens: [2, 3, 4, 6, 8] },
  { small: "short ribbon", large: "long ribbon", thing: "ribbon", verb: "cut off", dens: [2, 3, 4, 5] },
  { small: "small water bottle", large: "big water jug", thing: "bottle of water", verb: "drank", dens: [2, 3, 4] },
  { small: "small garden", large: "huge garden", thing: "garden", verb: "planted", dens: [2, 3, 4, 6] },
];

/** A same-whole trap scenario: the SAME fraction a/d of two different-size wholes. */
export function sameWholeParams() {
  const c = pick(SAME_WHOLE_CONTEXTS);
  const d = pick(c.dens);
  const a = randInt(1, d - 1);
  const [smallName, largeName] = twoNames();
  return { c, d, a, smallName, largeName };
}

export interface TimesContext {
  /** "Each lap is", used as `${each} 3/4 ${one}.` */
  each: string;
  /** "Kim runs 5 laps." — {n} and {name} substituted. */
  story: string;
  one: string;
  many: string;
  question: string;
}

export const TIMES_CONTEXTS: TimesContext[] = [
  { each: "Each lap around the track is", story: "{name} runs {n} laps.", one: "mile", many: "miles", question: "How far does {name} run?" },
  { each: "One batch of muffins needs", story: "{name} makes {n} batches.", one: "cup of flour", many: "cups of flour", question: "How much flour does {name} need?" },
  { each: "Each bag of apples weighs", story: "{name} buys {n} bags.", one: "pound", many: "pounds", question: "How many pounds of apples is that?" },
  { each: "Each day, {name} practices piano for", story: "{name} practices for {n} days.", one: "hour", many: "hours", question: "How many hours is that in all?" },
  { each: "Each glass holds", story: "{name} fills {n} glasses.", one: "liter", many: "liters", question: "How much water does {name} pour?" },
];

export const fillName = (s: string, name: string, n?: number) => s.replace(/\{name\}/g, name).replace(/\{n\}/g, String(n ?? ""));

export interface PlotContext {
  /** "The class measured the length of some beetles." */
  intro: string;
  /** plural noun for "how many ___" */
  things: string;
  /** measurement adjective for "longest"/"heaviest" */
  most: string;
  least: string;
  unit: string;
  /** "length" / "weight" / "amount" — for "total ___" */
  measure: string;
}

export const PLOT_CONTEXTS: PlotContext[] = [
  { intro: "A class measured the lengths of some beetles, in inches.", things: "beetles", most: "longest", least: "shortest", unit: "inch", measure: "length" },
  { intro: "Students measured how much rain fell each day, in inches.", things: "days", most: "rainiest", least: "driest", unit: "inch", measure: "rainfall" },
  { intro: "A baker weighed some bags of nuts, in pounds.", things: "bags", most: "heaviest", least: "lightest", unit: "pound", measure: "weight" },
  { intro: "A class measured the lengths of some leaves, in inches.", things: "leaves", most: "longest", least: "shortest", unit: "inch", measure: "length" },
  { intro: "Kids poured water into cups and measured each one, in cups.", things: "cups", most: "fullest", least: "emptiest", unit: "cup", measure: "amount of water" },
];
