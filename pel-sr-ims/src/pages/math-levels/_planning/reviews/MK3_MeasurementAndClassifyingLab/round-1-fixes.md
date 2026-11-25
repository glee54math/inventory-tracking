# MK3 Measurement & Classifying: Round 1 fixes

- **Lab:** MK3 `MeasurementAndClassifyingLab`, 3 units + Module Test
- **Round:** 1 · **Date:** 2026-11-21 · **Band:** K–1, audio-first, alone on an iPad
- **Applied from:** `round-1-merged.md` (59 merged items, including decisions D1–D10)

## 1. Summary

| Status | Merged items |
|---|---|
| Fixed | 54 |
| Partly fixed | 2 (E1-01, C1-10 + E1-08: the rest needs shared `KCheck.tsx`, which D7 rules out) |
| Needs decision | 0 |
| Not fixed (Skip, as decided) | 3 (C1-09, C1-11, E1-10) |

Unit ids, routes, storage keys, bucket keys and student progress are unchanged. Titles and goals changed in display only. No shared code was edited. Nothing was committed.

**Student impact to know about:** Test questions changed, but saved Test scores stand. The Module Test star bands changed (D8), so a saved score of 0–5 now shows 0 stars instead of 1.

## 2. Items

U1 = `DescribingHowObjectsAreMeasured.tsx`, U2 = `ComparingTwoObjectsDirectly.tsx`, U3 = `ClassifyingAndCountingByCategory.tsx`, each with its `*Test.tsx`. Shared lab data is in `units/labParts.tsx`.

| ID(s) | Status | What changed | Where |
|---|---|---|---|
| C1-12 + E1-13 | Fixed | D1 object list; each object drawn over blocks beside a labeled block, or on a scale against blocks | `labParts.tsx` `OBJECTS`; `ObjectGlyph.tsx` `ObjectOnBlocks` |
| C1-29 + E1-40 | Fixed | A wrong group sends the item back with "Look at its color/shape"; "All sorted!" only when all are right | U3 `Explore` |
| E1-01 | **Partly** | Choices are in every MK3 CFU pick prompt. CFU questions still do not auto-read (D7) | U1–U3 CFUs |
| C1-18 + E1-14 | Fixed | Dropdown removed: Practice uses separate steps; Test asks "What else is it?" | U1, U1 Test |
| C1-20 + E1-15 | Fixed | Paint question removed; Test slot is a typed blocks-long question | U1, U1 Test `blocksLongQuestion` |
| C1-13 + E1-16 | Fixed | "Tall is long, standing up." with a standing rod | U1; `LengthBars.tsx` `StandingRod` |
| E1-23 | Fixed | "Blue side" / "Orange side", color-matched (pans use the lab's blue tone) | U2, U2 Test, `BalanceScale.tsx` |
| C1-34 + E1-24 | Fixed | "How many extra…?" from ringed extras; no counts, equations or "subtract" | U2, U3 and Tests |
| C1-35 + E1-32 | Fixed | "this one" with a ring and an arrow | U3, U3 Test, `SortedBins.tsx` |
| E1-33 | Fixed | "How did we sort? Color or shape?"; the rule varies and the story doesn't name it | U3 `sortObvious` |
| C1-01 | Fixed | `look` on all 15 CFU questions, with Explore spots that don't show their answers | U1–U3 |
| C1-02 | Fixed | `twin` on all 9 two-button picks, same answer type, new values | U1–U3 CFUs |
| C1-03 | Fixed | Two-button steps run their demo from `pointing(help, i)` on the first wrong try | U1–U3 Practice |
| C1-04 | Fixed | Every Practice kind has a typed step | U1–U3 Practice |
| C1-05 | Fixed | Fixed answers replaced; the brute-force run shows every pick step varies, except "which is heavier" size pairs (the object varies) | U1–U3, Tests |
| C1-06 + E1-17 | Fixed | Hear a word, tap its picture (D4); no word-only questions | U1 `vocabMatch`, U1 Test |
| C1-14 + E1-20 | Fixed | Jump rope replaced with scarf 🧣 | `labParts.tsx` |
| C1-15 + E1-18 | Fixed | Explore has all 12 objects, a scale with big-light and small-heavy pairs, default off CFU answers | U1 `Explore` |
| C1-16 + E1-19 | Fixed | "This side went down. Is it heavy or light?" with an arrow and no pan label | U1 CFU Q1 |
| C1-17 + E1-30 | Fixed | Real objects in pans, plain square blocks; Q3 is the flat-scale count | `BalanceScale.tsx`, U1 CFU Q3 |
| C1-19 | Fixed | Test Q8–Q10 are picture questions on practiced skills | U1 Test |
| C1-21 | Fixed | "Slide together" button; ringed, numbered extras; defaults 6 and 8 | U2 `Explore` |
| C1-22 | Fixed | Trap in about 60% of problems; either rod can be shifted | `labParts.tsx` `offsetRods` |
| C1-23 + E1-26 | Fixed | Line up first, count to check | U2 Key Idea, CFU, hints |
| C1-24 | Fixed | + and − steppers, plus a larger touch area on the handle | U2 `Explore`, `LengthBars.tsx` |
| C1-25 | Fixed | Student reads the scale and types the lighter side's count | U2 Test `lighterSideCountQuestion` |
| C1-30 + E1-34 | Fixed | Every Test bin hides its count | `labParts.tsx` `bin` |
| C1-31 + E1-37 | Fixed | New three-group kind in the compare bucket; "fewest" taught in Explore; all three buttons | U3, U3 Test |
| C1-32 | Fixed | Mixed shapes and colors; the rule varies | U3, U3 Test |
| E1-35 | Fixed | "Where does this one go?" with spoken choices | U3 CFU |
| C1-33 | Fixed | Answer boxes match Red and Green | U3 CFU, styles `.mk3-red`, `.mk3-green` |
| E1-02 | Fixed | True/false replaced with picture questions | U1–U3, Tests |
| E1-03 | Fixed | D8 star bands | `ModuleTest.tsx` |
| E1-04 | Fixed | New titles and goals; "You finished {title}." | Units, shell |
| C1-08 + E1-05 | Fixed | MG1's lines where they exist, E1-05's elsewhere | Shell |
| E1-06 | Fixed | 1–2 word titles, one short story line, one prompt | All Practice |
| E1-25 + E1-28 + E1-42 | Fixed | Report rewrites; "1 blocks" can no longer occur | U2, U2 Test |
| E1-27 | Fixed | "scale", "goes down", "goes up" everywhere | U1, U2, Tests |
| E1-36 | Fixed | Key Idea and stories rewritten | U3 |
| C1-07 | Fixed | Rod, side and group buttons are color-matched | `labParts.tsx` |
| C1-09 | **Skip** | Shared sound banner; still open | none |
| C1-26 | Fixed | Minimum 7° tilt | `BalanceScale.tsx` |
| C1-27 | Fixed | More row spacing; pan labels below the rim | `LengthBars.tsx`, `BalanceScale.tsx` |
| C1-28 | Fixed | The draw after a bucket's first clean solve is always a near-tie (D6) | `labParts.tsx`, shell |
| C1-36 | Fixed | Shape picture on each bin label and button | `SortedBins.tsx`, `labParts.tsx` |
| C1-37 + E1-41 | Fixed | "Match them up. Which has fewer?" | U3 CFU Q4 |
| E1-22 | Fixed | "Could you lift a train?" | U1 CFU Q5 |
| E1-07 | Fixed | "Tap" | U1, U3, shell |
| C1-10 + E1-08 | **Partly** | Numbered 1–5. The number is still spoken: `QuestionHead` is shared, so `data-tts-skip` can't be added from MK3 | U1–U3 CFUs |
| E1-09 | Fixed | Home unit cards have a speaker that reads title and goal | Shell |
| E1-10 | **Skip** (D9) | Standard line kept | none |
| E1-21 | Fixed | Hints rewritten | U1 |
| E1-29 | Fixed | "Rod B starts in a new place. Count the blocks!" | U2 CFU Q3 |
| E1-31 | Fixed | "This is a rod. It is made of blocks." | U2 `Explore` |
| E1-38 | Fixed | Hints shortened | U3 |
| E1-39 | Fixed | "Sort 3 more." / "Count the extras: 1, 2." | U3 |
| C1-11 | **Skip** | Shared engine; two Check buttons remain | none |
| E1-11 | Fixed | All-caps removed; key words in bold lowercase | All |
| E1-12 | Fixed | Stray tag removed; list updated | `vocabulary.md` |

### Differences from the agreed wording

- **Blue side:** the lab's first color (`--qa`) is teal, so the pans use its blue tone (`--qc`) to make "Blue side" true.
- **Practice weight typed step:** "How many blocks are on the scale?" rather than the flat-scale question. A light object rises against one block, so it cannot also balance against blocks. The flat-scale idea stays in CFU Q3.
- **Word lines (E1-18):** "Short tells how long." and "Light tells how heavy." follow the same pattern as the two agreed lines.
- **New helper file:** `units/labParts.tsx` holds data used by the units and Tests. It imports neither, so no circular import is possible (same idea as MK1's `groupWords.tsx`).

## 3. Changed files

All under `src/pages/math-levels/`. **No shared files; no other lab is affected.**

- `MK3/MK3_MeasurementAndClassifyingLab.tsx`, `MK3/MK3_MeasurementAndClassifyingLab_styles.css`
- `MK3/MeasurementAndClassifyingLab/diagrams/`: `BalanceScale.tsx`, `LengthBars.tsx`, `ObjectGlyph.tsx`, `SortedBins.tsx`, `index.ts`
- `MK3/MeasurementAndClassifyingLab/units/`: `labParts.tsx` (new), `DescribingHowObjectsAreMeasured.tsx`, `DescribingHowObjectsAreMeasuredTest.tsx`, `ComparingTwoObjectsDirectly.tsx`, `ComparingTwoObjectsDirectlyTest.tsx`, `ClassifyingAndCountingByCategory.tsx`, `ClassifyingAndCountingByCategoryTest.tsx`, `ModuleTest.tsx`
- `_planning/Grade-K/MeasurementAndClassifyingLab/vocabulary.md`
- This report

## 4. New or rewritten student text

Generated values are shown as {x}.

**Shell:** Find the longer one. Find the heavier one. Sort and count. · Solve each kind 2 times. Fill your stars. · 15 questions. · Do the check first. Then you can practice. · Only **Mixed** problems give you stars. · You finished {title} Now take the test. · You finished {title} You passed the test. · Tap again to clear all stars

**Titles and goals:** Long and Heavy: Tell how long. Tell how heavy. · Which Is Longer? Which Is Heavier?: Look at two things. Find the longer one. Find the heavier one. · Sort and Count: Sort them. Count each group. Which has more?

**Key Ideas:** Things can be long or short. / Things can be heavy or light. / Big does not mean heavy. · Start them at the same place. / Which one goes past the other? It is longer. / Count the blocks to check. · Sort by color. Or sort by shape. / Keep the same rule. / Count each group. / Which has more?

**U1 Explore:** Tap a picture. · Many blocks is long. Few blocks is short. · The {object} is {long/short} and {heavy/light}. · The heavy side goes down. The light side goes up. · The scale is flat. They are the same. · Tap a word. · Long tells how long. · Short tells how long. · Tall is long, standing up. · Heavy tells how heavy. · Light tells how heavy.

**U1 CFU:** This side went down. Is it heavy or light? · Now this side went down. Is it heavy or light? · Light things go up. · Look: the heavy side goes down. · Yes! It is heavy. · A big balloon and a small rock. Which is heavier? · A big ball and a small brick. Which is heavier? · It is full of air. Big does not mean heavy. · Watch: the {rock/brick} goes down. The {rock/brick} is heavier. · Yes! The {rock/brick} is small, but heavier. · How many blocks are as heavy as the rock? · The scale is flat. Count the blocks. · Yes! 5 blocks. The scale is flat. · How long is the train? Count the blocks. · The {train/crocodile} is long. What else is it? Heavy or light? · Could you lift a {train/crocodile}? · Look: the train goes down. A train is heavy. · Look: the crocodile goes down. It is heavy. · Yes! A {train/crocodile} is long and heavy.

**U1 Look here:** Look here. See which side goes down. · Look here. Big does not mean heavy. · Look here. See the flat scale. · Look here. Count the blocks. · Look here. Tap a picture.

**U1 Practice and Test:** Blocks / Scale / Two words / Words · Look at the blocks. · Look at the scale. · Look at the {object}. · Listen to the word. · Is the {object} long or short? · Many blocks is long. Few blocks is short. · How many blocks long is the {object}? · Count each block once. · Count with me: 1, 2, 3. · Is the {object} heavy or light? · See the arrow. Did it go down? · See the arrow. Did it go up? · How many blocks are on the scale? · Which picture shows {word}? · It tells how long. Find the rod. · It tells how heavy. Find the scale. · A rod shows how long. · A scale shows how heavy. · How tall is the rod? Count the blocks. · How many blocks long is the rod? · How many blocks are on the {heavy/light} side? · The {object} is {long/short}. What else is it? · Which one is heavier? · This side went {down/up}. Is it heavy or light?

**U2 Explore:** This is a rod. It is made of blocks. · Rod {A/B} goes past. Rod {A/B} is longer. · They are the same. · Slide them together first. · Slide together · The ring shows the extra blocks: 1, 2. · Line them up. Then count the extra blocks. · Add blocks. Watch the scale. · The heavy side goes down. The {blue/orange} side is heavier. · Both sides are the same.

**U2 CFU:** Which rod is longer? Rod A or Rod B? · Now which rod is longer? Rod A or Rod B? · Which one goes past the other? · Look: Rod A goes past Rod B. Rod A is longer. · How many extra blocks? · Count only the extra blocks. · That is all of Rod A. Count the extra blocks. · That is Rod B. Count the extra blocks. · Yes! 3 extra blocks. · They start in different places. Which is longer? Rod A or Rod B? · Try these. Which is longer? Rod A or Rod B? · Rod B starts in a new place. Count the blocks! · How many blocks long is Rod B? · Yes! Rod B is 4 blocks long. · Which side is heavier? Blue side or orange side? · Now which side is heavier? Blue side or orange side? · The orange side went up. The heavy side goes down. · Look: the heavy side goes down. The blue side is down.

**U2 Look here:** Look here. Which rod goes past? · Look here. Count the extra blocks. · Look here. Slide them together. · Look here. Watch the scale.

**U2 Practice and Test:** Rods / Scale / Extras · They start at the same place. · They start in different places. · Which rod is longer? · Which rod is shorter? · Which one goes farther? · Slide them together. Which goes past? · Rod {A} goes past Rod {B}. · How many blocks long is Rod {A/B}? · Which side is heavier? · Which side is lighter? · The heavy side goes down. · The {blue/orange} side went {down/up}. · How many blocks are on the lighter side? · The light side goes up. Count its blocks. · How many extra blocks? · Count the blocks in the ring. · Count the extras: 1, 2. · {n} extra. · Rod {A} has {n} extra. · Which rod is longer? Count the blocks. · These rods start in different places. Which is longer? · Rod A has {a}. Rod B has {b}.

**U3 Explore:** We sort by {color/shape}. Tap one. Then tap its group. · Look at its {color/shape}. · Sort {n} more. Then count each one once. · All sorted! Count each group. · Match them up. Yellow has extras. Red has fewer. · Three groups. Circles has the fewest. Squares has the most.

**U3 CFU:** We sort by color. Where does this one go? Red or yellow? · Try this one. We sort by color. Red or yellow? · We sort by color. Look at its color. · We sort by color. It goes with yellow. · Yes! It goes with yellow. · How many are in the {Red/Green} group? · Which group has fewer? Red or green? · Now which group has fewer? Red or green? · Match them up. Which has fewer? · Look: Red has extras. Green runs out first. Green has fewer. · Now we sort by shape. Where does this one go? Circles or squares? · Try this one. We sort by shape. Circles or squares? · We sort by shape now. Look at its shape. · We sort by shape now. It goes with the circles. · Yes! It goes with the circles.

**U3 Look here:** Look here. Look at the color. · Look here. Look at the shape. · Look here. Count each one once. · Look here. Match them up.

**U3 Practice and Test:** Sort / Three Groups / Count / More or Fewer / Most and Fewest · Look at the groups. · We sort by {color/shape}. · Here are two groups. · Here are three groups. · Where does this one go? · Where does this new one go? · What is the same in each group? · How did we sort? Color or shape? · What is the same in this group? · It goes with {group}. · We sorted by {rule}. · How many are in the {group} group? · Count each one once. · Count with me: 1, 2, 3. · You kept the same rule. · Which group has more? · Match them up. Which has extras? · How many extra does {group} have? · Match them up. Count the extras. · Match each {fewer} one with a {more} one. Count the extras: 1, 2. · Which group has the fewest? · Which group has the most? · Count each group. Find the smallest group. · Count each group. Find the biggest group. · {group} has the fewest. {group} has the most. · We sort by {color/shape}. Where does this one go? · Keep the same rule. · We sort by shape. Does it go with the circles? · Yes. It is a circle. · No. It is a {square/triangle}.

## 5. Verification

| Check | Result |
|---|---|
| `tsc --noEmit -p tsconfig.app.json` | **Pass** |
| `eslint` on `MK3/` | **Pass:** 0 errors, 9 `react-refresh` warnings (the accepted pattern) |
| `vite build` (output sent outside the repo) | **Pass,** no import warnings |
| Test/unit import check | **Pass:** no Test imports its unit |
| Brute force: 20,000 draws per bucket, 5,000 of each unit Test, 3,000 Module Tests | **Pass:** 0 failures. Answers in range, no duplicate choices, no banned wording, no step shows a later typed answer, typed step in every kind, near-tie after one clean solve (3,000 per bucket), trap about 60% |
| English script, grade K | **Pass with notes:** 13 candidates, read by hand. None needs a change: "Big does not mean heavy" uses "mean" as agreed; "made of" is agreed wording; the one "long" flag joins separate short sentences; one is an unseen `aria-label` |
| CFU walk, 820×1180 touch, wrong at every question | **Pass:** 15 of 15 get Look here on the 2nd miss and the demo on the 3rd; each lights its spot; Practice unlocks; passed CFU stays open |
| Practice walk, every problem kind (12), wrong on purpose | **Pass:** typed steps reach Show me, "Got it" held during the demo, no star on a helped solve, Next locked, "Try one like it" keeps the same kind |
| U3 Explore sort | **Pass:** wrong group sent back, praise only when all are right |
| Unit Tests | **Pass:** no picture prints a count |
| Number pad at 1488×740, 1280×800, 1180×820, 1024×768, 820×1180 (Practice and Test) | **Pass:** measured clear of the picture at all 5; screenshots viewed |
| Spoken text (speech stubbed and logged) | **Pass on samples:** Home card, CFU prompt with choices, wrong-tap reason then twin, Practice opening. Not every line was logged |
| Dark mode | **Pass** (Unit 2 screenshot) |

The private test server (port 5288) is stopped. Ports 5173 and 5199 were not touched. Screenshots are in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\93b3cb82-1f88-42b8-a81e-c5b257bdf9f1\scratchpad\harness\shots`.

**Could not verify:**

- Real iPad speech, including "Rod A".
- Real finger dragging on the rod handles.
- Whether 🪵 🪨 🪶 draw on the target iPads. They show as empty boxes in this Windows test browser, so the log, rock and feather could not be checked by eye.
- One 404 in the long walk's console was not identified. The focused check of the same screens logged no 404s.

## 6. Noticed, not fixed

1. **CFU questions still do not auto-read** (D7). A non-reader must tap the speaker for each new CFU question.
2. **CFU numbers are still spoken** before counting questions (needs a shared `QuestionHead` change).
3. **The sound banner can cover part of the number pad** until dismissed (C1-09, skipped). It was seen on the Test pad at 1488×740.
4. **"rule"** appears in the Key Idea and one hint without a picture. The next English round should judge it.
5. **Show me's fixed line** "The answer is {x}" comes from the shared engine and repeats the step's explanation.
6. **Unused code:** the `select.answer` styles and the stylesheet header comment about CFU dropdowns no longer apply. Left in place as outside the fix list.
