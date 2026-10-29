import { DataChart, MixedScatter, type Category, type MixedItem } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Organizing and Interpreting Data ----------
// 10 single-question generators, self-contained (not imported from
// OrganizingData.tsx). Exported individually so ModuleTest.tsx can draw a
// cumulative sample from this unit's own question shapes.

interface Theme {
  cats: { label: string; glyph: string }[];
}

const THEMES: Theme[] = [
  { cats: [{ label: "Apples", glyph: "🍎" }, { label: "Bananas", glyph: "🍌" }, { label: "Grapes", glyph: "🍇" }] },
  { cats: [{ label: "Cats", glyph: "🐱" }, { label: "Dogs", glyph: "🐶" }, { label: "Birds", glyph: "🐦" }] },
  { cats: [{ label: "Circles", glyph: "🔵" }, { label: "Squares", glyph: "🟧" }, { label: "Stars", glyph: "⭐" }] },
];
const randomTheme = () => THEMES[randInt(0, THEMES.length - 1)];

/** Sorting raw, uncategorized items by type — the precursor skill before
 *  any chart exists. */
export const sortRawQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const theme = randomTheme();
  const counts = [randInt(2, 5), randInt(2, 5), randInt(2, 5)];
  const askIdx = randInt(0, 2);
  const items: MixedItem[] = shuffle(theme.cats.flatMap((c, ci) => Array.from({ length: counts[ci] }, () => ({ glyph: c.glyph, tone: (["a", "b", "c"] as const)[ci] }))));
  const seed = counts[0] * 41 + counts[1] * 11 + counts[2] * 3 + theme.cats[0].glyph.codePointAt(0)!;
  const cat = theme.cats[askIdx];
  return [
    {
      visual: <MixedScatter items={items} seed={seed} />,
      difficulty,
      step: { kind: "number", prompt: `How many ${cat.label.toLowerCase()} (${cat.glyph}) are in this mixed group?`, hint: "Look only for that one type, ignoring the others.", explain: `There are ${counts[askIdx]} ${cat.label.toLowerCase()}.`, answer: counts[askIdx] },
    },
  ];
};

/** Reading one category's count directly off a 2-category chart. */
export const read2CatQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const theme = randomTheme();
  const [catA, catB] = shuffle(theme.cats).slice(0, 2);
  const countA = randInt(2, 9);
  const countB = randInt(2, 9);
  const categories: Category[] = [
    { label: catA.label, glyph: catA.glyph, count: countA, tone: "a" },
    { label: catB.label, glyph: catB.glyph, count: countB, tone: "b" },
  ];
  const askFirst = Math.random() < 0.5;
  const askCat = askFirst ? catA : catB;
  const askCount = askFirst ? countA : countB;
  return [
    {
      visual: <DataChart categories={categories} />,
      difficulty,
      step: { kind: "number", prompt: `How many ${askCat.label.toLowerCase()} are there?`, hint: "Count the icons in that row.", explain: `There are ${askCount} ${askCat.label.toLowerCase()}.`, answer: askCount },
    },
  ];
};

/** "How many more/fewer" on a 3-category chart — distractor #1 targets the
 *  named misconception directly: the bigger category's raw count by itself,
 *  exactly what a student who just restates one number (instead of
 *  subtracting) would pick. Distractor #2 is the SUM of the two counts (a
 *  plausible "I added instead of subtracted" slip) rather than the smaller
 *  category's raw count — the smaller count can coincidentally equal the
 *  true difference (e.g. big=6, small=3, diff=3), which would collide with
 *  the correct answer; the sum can never equal the difference, since that
 *  would require the smaller count to be 0, which is outside this
 *  question's range (2-9). */
export const howManyMoreQuestion = (phrasing: "more" | "fewer"): TestQuestion[] => {
  const theme = randomTheme();
  let counts = [randInt(2, 9), randInt(2, 9), randInt(2, 9)];
  while (counts[0] === counts[1]) counts = [randInt(2, 9), randInt(2, 9), randInt(2, 9)];
  const categories: Category[] = theme.cats.map((c, i) => ({ label: c.label, glyph: c.glyph, count: counts[i], tone: (["a", "b", "c"] as const)[i] }));
  const [bigIdx, smallIdx] = counts[0] > counts[1] ? [0, 1] : [1, 0];
  const diff = counts[bigIdx] - counts[smallIdx];
  const sum = counts[bigIdx] + counts[smallIdx];
  const bigCat = theme.cats[bigIdx];
  const smallCat = theme.cats[smallIdx];
  const prompt =
    phrasing === "more"
      ? `How many MORE ${bigCat.label.toLowerCase()} are there than ${smallCat.label.toLowerCase()}?`
      : `How many FEWER ${smallCat.label.toLowerCase()} are there than ${bigCat.label.toLowerCase()}?`;
  return [
    {
      visual: <DataChart categories={categories} />,
      difficulty: "hard",
      step: choice(
        {
          prompt,
          hint: "Find the DIFFERENCE between the two counts — don't just restate one of them.",
          explain: `${counts[bigIdx]} − ${counts[smallIdx]} = ${diff}.`,
        },
        String(diff),
        [String(counts[bigIdx]), String(sum)]
      ),
    },
  ];
};

/** Combined total across all 3 categories — distractor #1 is the sum of
 *  only the two LARGEST categories (total minus the smallest — "I forgot
 *  the smallest category"), distractor #2 is the sum of only the two
 *  SMALLEST categories (total minus the largest — "I forgot the biggest
 *  category"), the two most plausible versions of the named "forgot a
 *  category" misconception. Both are always strictly less than the true
 *  total (each omits a category whose count is at least 1) so neither can
 *  collide with the correct answer, and the two distractors can only ever
 *  collide with EACH OTHER when all three counts are equal — guarded
 *  against by the while-loop below, the same rejection-sampling technique
 *  used for the half-hour/transitive-comparison generators elsewhere in
 *  this lab. */
export const combinedTotalQuestion = (): TestQuestion[] => {
  const theme = randomTheme();
  let counts = [randInt(1, 6), randInt(1, 6), randInt(1, 6)];
  while (counts[0] === counts[1] && counts[1] === counts[2]) counts = [randInt(1, 6), randInt(1, 6), randInt(1, 6)];
  const categories: Category[] = theme.cats.map((c, i) => ({ label: c.label, glyph: c.glyph, count: counts[i], tone: (["a", "b", "c"] as const)[i] }));
  const total = counts[0] + counts[1] + counts[2];
  const sorted = [...counts].sort((a, b) => a - b); // [min, mid, max]
  const omitMin = sorted[1] + sorted[2]; // the two largest — "forgot the smallest category"
  const omitMax = sorted[0] + sorted[1]; // the two smallest — "forgot the biggest category"
  return [
    {
      visual: <DataChart categories={categories} />,
      difficulty: "hard",
      step: choice(
        {
          prompt: "How many are there IN ALL — every category combined?",
          hint: "Add up all three counts, not just two of them.",
          explain: `${counts[0]} + ${counts[1]} + ${counts[2]} = ${total}.`,
        },
        String(total),
        [String(omitMin), String(omitMax)]
      ),
    },
  ];
};

export const organizingDataTest: Unit["test"] = {
  questions: [
    () => sortRawQuestion("easy"),
    () => sortRawQuestion("medium"),
    () => read2CatQuestion("easy"),
    () => read2CatQuestion("medium"),
    () => howManyMoreQuestion("more"),
    () => howManyMoreQuestion("fewer"),
    () => howManyMoreQuestion("more"),
    () => combinedTotalQuestion(),
    () => combinedTotalQuestion(),
    () => combinedTotalQuestion(),
  ],
  passScore: 9,
};
