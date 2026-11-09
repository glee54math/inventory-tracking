import { pick } from "../../../shared/lib/math";
import { cap, mixedRaw, twoPeople, type Op, type Person } from "./fractions";

// Word-problem templates for Unit 5 (and its Test). Every story is built from
// the numbers, so the question never states its own answer. Settings are
// everyday ones (school, cooking, walking). A unit word is singular for an
// amount up to 1 ("3/4 mile") and plural above it ("1 1/4 miles").

export interface Amount {
  w: number;
  n: number;
  d: number;
}
const amt = (a: Amount) => mixedRaw(a.w, a.n, a.d);
const unit = (a: Amount, one: string, many: string) => (a.w > 0 || a.n > a.d ? many : one);

/** CCSS situation of the story: join (total), separate (left), compare (more/longer). */
export type StoryKind = "total" | "left" | "compare" | "moreNeeded";

export interface Story {
  text: string;
  kind: StoryKind;
  op: Op;
  /** Which amount the story names first. A is always the bigger amount in a
   *  subtraction story; "BA" stories name the smaller one first, so "first −
   *  second" is not always the right expression (MG10 review C2-23). */
  order: "AB" | "BA";
}

type Template = (p: Person, q: Person, A: Amount, B: Amount) => string;
interface Tpl {
  t: Template;
  /** Names B (the smaller amount, for subtraction) before A. */
  smallFirst?: boolean;
  /** A cooking story (cups): only used with kitchen-cup denominators. */
  cups?: boolean;
}

// The question words vary on purpose, so no one phrase decides the operation:
// "in total" and "now" each show up in an adding story AND a subtracting one,
// and a compare story can ask "how much shorter / lighter" with no "more".
const TOTAL: Tpl[] = [
  { t: (p, _q, A, B) => `${p.name} walked ${amt(A)} ${unit(A, "mile", "miles")} to school. Then ${p.he} walked ${amt(B)} ${unit(B, "mile", "miles")} to the park. How far did ${p.he} walk altogether?` },
  { t: (p, _q, A, B) => `${p.name} used ${amt(A)} ${unit(A, "cup", "cups")} of flour for bread. ${cap(p.he)} used ${amt(B)} ${unit(B, "cup", "cups")} of flour for muffins. How much flour did ${p.he} use for both?`, cups: true },
  { t: (p, _q, A, B) => `${p.name} read for ${amt(A)} ${unit(A, "hour", "hours")} before dinner. ${cap(p.he)} read for ${amt(B)} ${unit(B, "hour", "hours")} after dinner. How long did ${p.he} read in total?` },
  { t: (p, q, A, B) => `${p.name} picked ${amt(A)} ${unit(A, "pound", "pounds")} of apples. ${q.name} picked ${amt(B)} ${unit(B, "pound", "pounds")} of apples. They put the apples in one bag. How many pounds of apples are in the bag now?` },
];
const LEFT: Tpl[] = [
  { t: (p, _q, A, B) => `${p.name} had ${amt(A)} ${unit(A, "cup", "cups")} of milk. ${cap(p.he)} drank ${amt(B)} ${unit(B, "cup", "cups")}. How much milk does ${p.he} have now?`, cups: true },
  { t: (p, _q, A, B) => `A board is ${amt(A)} ${unit(A, "foot", "feet")} long. ${p.name} cuts off ${amt(B)} ${unit(B, "foot", "feet")}. How long is the board now?` },
  { t: (p, _q, A, B) => `A bottle holds ${amt(A)} ${unit(A, "liter", "liters")} of water. ${p.name} pours out ${amt(B)} ${unit(B, "liter", "liters")}. How much water is in the bottle now?` },
];
const COMPARE: Tpl[] = [
  { t: (p, q, A, B) => `${p.name}'s ribbon is ${amt(A)} ${unit(A, "yard", "yards")} long. ${q.name}'s ribbon is ${amt(B)} ${unit(B, "yard", "yards")} long. How much longer is ${p.name}'s ribbon?` },
  { t: (p, _q, A, B) => `${p.name} hiked ${amt(A)} ${unit(A, "mile", "miles")} on Saturday and ${amt(B)} ${unit(B, "mile", "miles")} on Sunday. How much farther did ${p.he} hike on Saturday?` },
  { t: (_p, _q, A, B) => `A bag of rice weighs ${amt(A)} ${unit(A, "pound", "pounds")}. A bag of beans weighs ${amt(B)} ${unit(B, "pound", "pounds")}. How much lighter is the bag of beans?` },
  { t: (p, q, A, B) => `${p.name}'s ribbon is ${amt(B)} ${unit(B, "yard", "yards")} long. ${q.name}'s ribbon is ${amt(A)} ${unit(A, "yard", "yards")} long. How much shorter is ${p.name}'s ribbon?`, smallFirst: true },
  { t: (p, q, A, B) => `${p.name} swam ${amt(B)} ${unit(B, "mile", "miles")}. ${q.name} swam ${amt(A)} ${unit(A, "mile", "miles")}. How much farther did ${q.name} swim?`, smallFirst: true },
];
const MORE_NEEDED: Tpl[] = [
  { t: (p, _q, A, B) => `A recipe needs ${amt(A)} ${unit(A, "cup", "cups")} of sugar. ${p.name} has ${amt(B)} ${unit(B, "cup", "cups")}. How much more sugar does ${p.he} need?`, cups: true },
  { t: (p, _q, A, B) => `${p.name} wants to run ${amt(A)} ${unit(A, "mile", "miles")}. So far ${p.he} has run ${amt(B)} ${unit(B, "mile", "miles")}. How much farther does ${p.he} need to run?` },
  { t: (p, _q, A, B) => `${p.name} has ${amt(B)} ${unit(B, "cup", "cups")} of milk. A recipe needs ${amt(A)} ${unit(A, "cup", "cups")} of milk. How much more milk does ${p.he} need?`, cups: true, smallFirst: true },
  { t: (p, _q, A, B) => `${p.name} has walked ${amt(B)} ${unit(B, "mile", "miles")} so far. ${cap(p.he)} wants to walk ${amt(A)} ${unit(A, "mile", "miles")} in total. How much farther does ${p.he} need to walk?`, smallFirst: true },
];

export const TEMPLATES: Record<StoryKind, Tpl[]> = { total: TOTAL, left: LEFT, compare: COMPARE, moreNeeded: MORE_NEEDED };

/** Kitchen cups come in halves, thirds, fourths and eighths, so cup stories
 *  are used only with those denominators. */
const CUP_DENS = [2, 3, 4, 8];

/**
 * A story for A (op) B. For subtraction, A must be the bigger amount; the
 * template decides which amount the story names first (`order`).
 */
export function makeStory(kind: StoryKind, A: Amount, B: Amount, templateIndex?: number): Story {
  const [p, q] = twoPeople();
  const cupsOk = CUP_DENS.includes(A.d) && CUP_DENS.includes(B.d);
  const list = TEMPLATES[kind].filter((t) => cupsOk || !t.cups);
  const t = templateIndex !== undefined ? list[templateIndex % list.length] : pick(list);
  return { text: t.t(p, q, A, B), kind, op: kind === "total" ? "add" : "sub", order: t.smallFirst ? "BA" : "AB" };
}
