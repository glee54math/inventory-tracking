# MG2 Place Value to 120: round 1 fixes

- Lab: MG2 `PlaceValueTo120Lab` · Grade 1 · K–1 band (decision 1) · Round 1 · 2026-11-17
- Work order: `round-1-merged.md` (every Fix row). Skip/Deferred rows were not touched. The deferred `tenVsHundredChoiceQuestion` only had its wording fixed (E1-14/E1-15).
- Rules followed: `math-lab-builder.md`, `english-for-math/grade-1.md`. No file outside `MG2/` was edited, and no shared files.

## 1. Summary

Results for the **41 Fix rows** (covering 44 IDs):
- **35 fixed**
- **6 partly fixed.** Each one is explained below. Two of them have a part that needs a shared-file change, so those parts are listed under **Needs decision**.
- **0 not fixed**

Verification:
- `tsc`: 0 errors anywhere.
- `eslint` on MG2: 0 errors.
- `vite build`: passed, no MG2 warnings.
- Brute-force run (12,000 problems per bucket, 5,000 per Test generator): 1 issue, which existed before this round (see §6).
- Browser walk at iPad size (every CFU item answered wrong 2–3 times, then right): passed, no console errors.

**Needs decision (shared files):**
1. **CFU title (E1-10).** The merged wording is "Answer these. Then you can practice." The title is hard-coded in the shared `KCheck.tsx` `CheckSequence` ("Show what you know!"). The lab now uses that short shared title. Options: (a) keep "Show what you know!"; (b) add an optional `title` prop to `CheckSequence` (a shared change, affects MK1–MK4 and MG1 only if they pass it).
2. **Test symbol item spoken by ear (E1-26 Test part).** The shared `StepProblem`/`UnitTest` choice buttons read their choice text aloud ("is less than…"). A lab cannot give one button `data-tts-say="this one"` without its answer chip also saying "this one". The Test item is now a picture question ("65 ☐ 20. What goes in the box?" over two blocks pictures), so the student must compare the numbers. But the voice still reads the three signs as words. Options: (a) accept this, since it is now a real comparison and not "which symbol means…"; (b) add an optional `say` array to `ChoiceStep` in shared `types.ts` and `StepProblem.tsx` (all labs, additive).

## 2. Item table

| ID(s) | Status | What changed | Where |
|---|---|---|---|
| E1-01 | Fixed | No `->` or `→` left in any student text (grep: only code comments). The arrow lines were in old CFU feedback and Test T/F items; those items are gone. | all unit files |
| E1-25 + E1-28 | Fixed | Test: "64 and 67 both have 6 tens. What do you look at next?" with "The ones" / "The tens". Practice: story "Compare 64 and 67.", same step 1 (position shuffled, 50/50 in brute force), the agreed hint, wrap-up "64 < 67. The ones told you." | ComparingTwoDigitNumbersTest.tsx `tensFirstWhyQuestion`; ComparingTwoDigitNumbers.tsx `sameTensDiffOnes` |
| C1-01 | Fixed | Shell now mirrors MG1: `lab-early`, `EarlyLearnerProvider` inside `TtsProvider`, `lastMakeRef`/`drawRef`/`retrySame`/`owesRetry`/`usedTokenRef`, `useRetryDebts` (+ cleared on reset), `onHelped`/`onRetrySame`. | MG2_PlaceValueTo120Lab.tsx `UnitView`, root |
| C1-02 + C1-03 + E1-02 + E1-03 (CFU) + E1-04 + E1-05 + E1-10 + C1-14 (CFU) | Fixed (E1-10 partly, see Needs decision 1) | All 5 CFUs rebuilt with `CheckSequence`/`TypeCheck`/`PickCheck`: one short question at a time with a picture, few-word feedback, show-it on the 3rd miss. No dropdowns, no true/false, no live re-grading. The "new hundred" item was dropped. Typed share: U1 3/4, U2 5/5, U3 2/4, U4 4/4, U5 4/4 (18 of 21 = 86%). Browser check: no wrong-answer line states the answer. | each unit's `…CheckForUnderstanding` |
| C1-04 | Fixed | Every KCheck item has `look={{ target, label, say }}`. Explore spots: U1 `u1-jump`, `u1-chart`; U2 `u2-blocks`, `u2-maketen`, `u2-presets`; U3 `u3-symbols`, `u3-rule`, `u3-presets`; U4 `u4-column`, `u4-tens`; U5 `u5-newten`, `u5-ones`. Order: 2nd miss shows "Look here!" (browser: 1 spot lit each time), 3rd miss shows it. | all units |
| C1-05 | Fixed | U4 Explore starts at 46, 2 tens more. U5 starts at 27 + 6. No CFU number matches an Explore default or preset. Because of this, the U2 CFU uses 17 and 60 (presets are 14 and 70) and the U3 CFU uses 31/57, 71/74, 82/28, 65/65. | TenMoreTenLess.tsx, AddingTwoDigitOneDigit.tsx Explore |
| C1-06 | Partly fixed | `BaseTenBlocks` gets new optional props: `labels`, `countAlong` (about 1 s per item, at the voice's speed), `ring`, `extraOnes`, `takeTens`, `bundle`. Every Practice generator now uses `pointing(help, i)`. Every step has `showMe` and `showMeHoldMs`. Typed steps get `tone` (sticks "a", cubes/answer cell "b"). **Difference:** C1-06 asked to number the cubes after the first wrong try. A numbered last cube *is* the answer (builder: "must never print the answer"), so a wrong try now only rings the part to count, and the numbers count along on "Show me". | diagrams/BaseTenBlocks.tsx; each unit's Practice `visual` |
| C1-07 | Fixed | U1: "What comes after 100?" is always a typed step in cross100. U3: "Type the bigger number." comes before the symbol pick. U4: "Which digit changed?" and "How should you find it?" are now typed (10 more and 10 less of the same number). Every symbol pick has 3 options in a varying position (brute force about 1/3 each). | CountingTo120.tsx, ComparingTwoDigitNumbers.tsx, TenMoreTenLess.tsx |
| C1-08 + E1-03 (Test) + E1-22 + E1-30 (Test) + E1-34 | Fixed | 7 T/F items replaced: U1 `after109Question` (typed 110), U2 `zeroOnesQuestion` (typed 0) and `elevenOnesQuestion` (11 in blocks, typed 1), U3 `reversedDigitsBiggerQuestion` (tap) and `tensBeatOnesQuestion` (typed, e.g. 39 vs 41), U4 `onesStayQuestion` (typed 68 − 30), U5 `newTenTypedQuestion` (typed). `regroupWhyQuestion` choices are now the same length. The two-blank line is now "How many ones? ☐ What is 38 + 5? ☐". Module Test imports the replacements (still 25 questions, pass 20). | *Test.tsx, ModuleTest.tsx |
| C1-10 + E1-20 | Fixed | "Next number" speaks the new number (`sayText`, only when sound is on). Banners are `ReadAloud role="alert"`: "20! New ten!" and "100! Keep counting!". **Difference:** "100! A new row!" was not used, because on a 1–120 chart 100 *ends* the 91–100 row. | CountingTo120.tsx Explore |
| C1-11 | Fixed | `HundredChart` gets `hideAfter` (blank boxes after `upTo`), `hop` and `ask`, plus `min` for small CFU charts. Tests always use `hideAfter`. Practice: nothing after the last number given. A wrong try brings back the faint numbers and a hop to a "?" box. The answer cell is marked only when done. | diagrams/HundredChart.tsx; CountingTo120(.Test).tsx |
| C1-12 + E1-16 | Fixed | Story "Start at 18. Count on." Steps: after 18 (typed), after 19 (typed), then "Which row is 20 in?" last (3 row choices). Title "A new ten". **Note:** 20 sits at the end of the 11–20 row, so the answer is "11 to 20", with "21 to 30" as the trap. | CountingTo120.tsx `crossDecade` |
| C1-16 | Fixed | New "Make a ten" in U2 Explore: 10 cubes are counted 1–10 (spoken, about 1 s each), then slide into one stick labeled 10. Button stays gray while it plays. "Show 14" / "Show 70" presets (spoken). The number sentence is always shown. | TensAndOnes.tsx `MakeATen`, Explore |
| C1-18 + E1-26 | Partly fixed | Explore: blocks for A and B side by side with the big sign between, "42 < 58" read aloud, and "The open side faces the bigger number." (Look-here spot). CFU: picture questions with sign buttons spoken "this one" (`data-tts-say`). Test: picture question. The voice still reads its choices; see Needs decision 2. | ComparingTwoDigitNumbers.tsx; Test `symbolPictureQuestion`; diagrams/BlocksPair.tsx |
| C1-22 | Fixed | U4 Practice marks only `n`. A wrong try draws the hop with a "?". The landing cell is marked when the step is done. U4 Test marks only `n`. Brute force: the answer is never marked before done or after one wrong try, and never in a Test. | TenMoreTenLess(.Test).tsx |
| E1-06 + E1-08 + E1-11 | Fixed | E1-06 rewrites used, with two truth fixes. U1 Explore says "Keep going past 100" rather than "99 to 100 works the same way", which is false on this chart. U3 says "Same tens / different tens" rather than "rows", because 40 and 45 are in different rows but have the same tens. E1-08 words and everyday "even" are gone (brute-force regex). | goals / keyIdea / Explore lines in all 5 units |
| E1-07 | Fixed | New `words.ts` with `tensW`/`onesW`/`tenWord`/`oneWord`. Every frame is built from the answer. Brute force found no "1 tens" or "1 ones". | units/words.ts and all users |
| E1-12 + C1-09 | Fixed | MG1 K–1 shell wording. `Segmented` is hidden when `unit.problems.length === 1`, which is true for every unit. | shell |
| E1-13 | Fixed | U1 never says "digit". The Practice "2-digit or 3-digit?" step was replaced (C1-07). U5 title is "Adding Ones to a Number". | CountingTo120(.Test).tsx, AddingTwoDigitOneDigit.tsx |
| E1-14 + E1-15 | Fixed | No decade names ("the 20s", "110s", "100s hundred"). Rows are asked by number. The deferred ten-vs-hundred item now says "From 100 to 199 is one hundred." | CountingTo120(.Test).tsx |
| E1-17 + C1-13 | Fixed | Start is 98 or 99, story "Start at 98. Count on.", three count steps that always pass 100. Wrap-up is built from the values. | `cross100` |
| E1-21 | Fixed | "A number like 70" / "Look at 70. How many tens and ones?" | `exactDecade` |
| E1-23 + C1-17 | Partly fixed | `ones === tens` excluded. Step 3 is typed with a box that matches its answer. Explore shows "36 = 30 + 6". **Difference:** the box asks for the 30 ("36 = ☐ + 6"), not the 6. Asking for 6 would repeat step 2's answer (builder: "Don't ask the same thing twice"). A diagnose catches typing 3 ("Each stick is 10. Count by tens."). | `standard` |
| E1-27 | Fixed | No "tied" or "break the tie" anywhere. | U3 + Test |
| E1-30 + C1-25 | Fixed | Title "Ten More, Ten Less, and Adding Tens"; Practice titles "Add tens" / "Take away tens"; Key Idea "Adding 20 is 2 tens more."; standard "1.NBT.4–6". | TenMoreTenLess.tsx |
| E1-32 + E1-33 | Fixed | One phrase everywhere: "make a new ten". No regroup, bundle, carry or sum in student text (brute-force regex). | U5 + Test, BaseTenBlocks banner "10 cubes make a new ten!" |
| C1-19 | Fixed | BlocksPair in Explore. On a Practice wrong try, the rule step shows A and B as blocks with the deciding part ringed, counted aloud on Show me. Explore line "More tens? Bigger number. Same tens? Look at the ones." | ComparingTwoDigitNumbers.tsx |
| C1-20 | Fixed | See C1-07. | |
| C1-23 | Fixed | `tenLessCrossing` uses n from 11–99, half the draws from 11–23 (brute force: answers 1–89). | `tenLessCrossing` |
| C1-24 | Fixed | 0 shows as "0" with no chart mark. Steppers have moving min/max, so a move can't leave 0–120. Nothing is clamped. | U4 Explore |
| C1-26 | Fixed | Test pictures show only the starting blocks (brute force: no `flagOverflow`, `extraOnes` or labels in any Test picture). | AddingTwoDigitOneDigitTest.tsx |
| C1-27 | Fixed | "Add 6 more ones" brings cubes in one per second, counted aloud. "Make a new ten" stays gray until that ends (browser: disabled while adding). Then 10 ringed cubes slide into a new stick. | U5 Explore |
| E1-09 | Fixed | "stick" and "cube" only, taught in the U2 Key Idea. | lab-wide |
| E1-18 | Fixed | "Count from 1: 1, 2, 3. What comes next?" | `startFrom1` |
| E1-19 | Fixed | n is 101–119 (109 and 119 a third of the time, per C1-14). Story "Here is 104. What comes next?" | `range100to120` |
| E1-24 | Fixed | "How many tens are in N?" / "How many ones are in N?" everywhere (U2, U3 Test, U4). | |
| E1-31 | Fixed | "Tens" stepper plus a More/Less switch (no "-3"). Hints and choices: "Change the tens", "Count by ones". | U4 Explore, Test `strategyWhyQuestion` |
| C1-21 | Fixed | Presets "42 and 45", "36 and 63", "53 and 53". | U3 Explore |
| E1-29 | Fixed | "42 ☐ 45. What goes in the box?" | U3 + Test |
| E1-35 | Fixed | Titles: Count from 1, Start anywhere, A new ten, Past 100, Count past 100, The number 10, A teen number, A number like 70, Build the number, Same tens, Swapped digits, Different tens, Equal numbers, 10 more, 10 less, Add tens, Take away tens, Add ones, Make a new ten. | |
| E1-20 | Partly fixed | See C1-10 (banner wording changed to stay true). | |
| E1-10 | Partly fixed | See Needs decision 1. | |

(The other partly-fixed rows are C1-06, C1-18 + E1-26 and E1-23 + C1-17, explained in their own rows above.)

## 3. Changed files (all lab-local; no shared files)

- `MG2/MG2_PlaceValueTo120Lab.tsx` (shell)
- `MG2/PlaceValueTo120Lab/diagrams/HundredChart.tsx`: new optional `min`, `hideAfter`, `hop`, `ask`. Fills moved to `style` so `var()` resolves.
- `MG2/PlaceValueTo120Lab/diagrams/BaseTenBlocks.tsx`: new optional `labels`, `countAlong`, `onCount`, `onAnimDone`, `ring`, `extraOnes`, `takeTens`, `bundle`.
- `MG2/PlaceValueTo120Lab/diagrams/BlocksPair.tsx` (new): two numbers as blocks at the same scale, with a sign or box between them.
- `MG2/PlaceValueTo120Lab/diagrams/timing.ts` (new): count-along pacing.
- `MG2/PlaceValueTo120Lab/diagrams/index.ts`
- `MG2/PlaceValueTo120Lab/units/words.ts` (new): plural helpers. It imports nothing from units or Tests, so there is no import cycle.
- `MG2/PlaceValueTo120Lab/units/` (all 5 units, all 5 Tests, and ModuleTest):
  - CountingTo120.tsx
  - CountingTo120Test.tsx
  - TensAndOnes.tsx
  - TensAndOnesTest.tsx
  - ComparingTwoDigitNumbers.tsx
  - ComparingTwoDigitNumbersTest.tsx
  - TenMoreTenLess.tsx
  - TenMoreTenLessTest.tsx
  - AddingTwoDigitOneDigit.tsx
  - AddingTwoDigitOneDigitTest.tsx
  - ModuleTest.tsx
- `MG2_PlaceValueTo120Lab_styles.css` was not changed. The old `select.answer` rule is now unused.

Test exports renamed (only `ModuleTest.tsx` imports them):
- `patternRepeatsTrueFalseQuestion` → `after109Question`
- `zeroOnesTrueFalseQuestion` → `zeroOnesQuestion`
- `teenGeneralizationQuestion` → `elevenOnesQuestion`
- `reversedDigitsTrueFalseQuestion` → `reversedDigitsBiggerQuestion`
- `symbolVocabQuestion` → `symbolPictureQuestion`
- `tensFirstGeneralizationQuestion` → `tensBeatOnesQuestion`
- `onesNeverChangeTrueFalseQuestion` → `onesStayQuestion`
- `regroupRuleTrueFalseQuestion` → `newTenTypedQuestion`

## 4. New or rewritten student text

### Shell
- Hero: "Count to 120. Find tens and ones. Compare and add."
- Stars line: "Solve each kind of problem 2 times by yourself to fill in your stars. Only Mixed problems count."
- Module Test: "25 questions from all 5 units."
- "Only Mixed problems give you stars." (only shown if a type picker ever appears)

### U1 Counting to 120
- Goal: "Count to 120. Start at any number."
- Key Idea: "You can start counting at any number." / "After 99 comes 100. Then 101, 102, up to 120."
- Explore:
  - Buttons: "Next number", "Jump to 99"
  - "Tap Jump to 99. Then tap Next number."
  - Banners: "{20}! New ten!" / "100! Keep counting!"
  - "Each row has ten numbers. Counting on moves one box right. At the end of a row, go to the next row. Keep going past 100."
- CFU:
  1. "97, 98, 99. What comes next?" (100)
     - Nudge: "Count on one more from 99."
     - Why: 910 → "That number is too big. Count on one."; 98 → "Count on, not back."
     - Show: "Watch and listen: 98, 99, 100."
     - Praise: "Yes! 100 comes after 99."
  2. "What comes after 109?" (110)
     - Why: 200 → "too big"; 101 → "Count on from 109."; 108 → "Count on, not back."
     - Praise: "Yes! 110 comes after 109."
  3. "Which row is 100 in?" [81 to 90 / 91 to 100 / 101 to 110] (91 to 100)
     - Why: "Find 100. Look at its row." / "That row starts after 100. Find 100."
     - Show: "Watch: 100 is at the end of this row."
     - Praise: "Yes! 100 ends the row 91 to 100."
  4. "117, 118, 119. What comes next?" (120)
     - Praise: "Yes! 120 comes after 119."
- Look-here say lines: "Look here. Jump to 99. Then count on." / "Look here. Count on one box at a time."
- Practice:
  - Stories:
    - "Count from 1: 1, 2, 3. What comes next?"
    - "Start at N. Count from here."
    - "Start at 18. Count on."
    - "Start at 98. Count on."
    - "Here is 104. What comes next?"
  - Steps:
    - "What comes after N?"
    - "What number is one less than N?"
    - "Which row is 20 in?"
  - Hints:
    - "Find N. Count on one box."
    - "Find N. Count back one box."
    - "Find 20 on the chart. Look at its row."
  - Show me:
    - "Count on one: N, N+1."
    - "Count back one: …"
    - "20 is at the end of the row 11 to 20."
  - Wrap-ups:
    - "…Then 21 starts the next row."
    - "98, 99, 100, 101. After 99 comes 100."
    - "You can start at any number."
    - "Past 100, you count the same way."
- Test:
  - "Count from 1. What comes after N?"
  - "18, 19, 20. Which row is 20 in?"
  - "What comes after 99?"
  - "108, 109. What comes next?"
  - "Count from 105 to 109. Then comes 110. Is that a new ten or a new hundred?" [A new ten / A new hundred]

### U2 Tens and Ones
- Goal: "Find the tens and ones in a number."
- Key Idea: "A stick is 1 ten. A cube is 1 one." / "24 is 2 tens and 4 ones. 14 is 1 ten and 4 ones. 70 is 7 tens and 0 ones."
- Explore:
  - "Make a ten" / "Make a ten again"
  - "10 ones make 1 ten."
  - "Make a number with sticks and cubes. A stick is 1 ten. A cube is 1 one."
  - "Show 14" / "Show 70"
  - "14 is 1 ten and 4 ones. 70 has no cubes."
  - Number sentences: "24 = 2 tens + 4 ones" / "24 = 20 + 4"
- CFU:
  1. "How many tens are in 36?" (3)
  2. "How many ones are in 36?" (6)
  3. "How many tens are in 17?" (1)
  4. "How many ones are in 10?" (0)
  5. "What number is this?" (6 sticks, 60)
  - Nudges, whys and praise are in TensAndOnes.tsx, for example "Count the sticks, not the cubes.", "Look for a stick. A stick is a ten.", "Yes! 6 tens is 60."
- Practice:
  - "Look at N. How many tens and ones?"
  - "How many tens are in N?" / "How many ones are in N?"
  - "N = ☐ + 6. What goes in the box?"
  - "Here are 3 sticks and 4 cubes." + "3 tens and 4 ones is what number?"
  - Show me: "Count the sticks: 1, 2, 3. That is 3 tens." / "There are no cubes. That is 0 ones." / "Count by tens: 10, 20, 30. Then count on: 31, 32."
  - Diagnose: "That is backwards. Write the tens first." / "Each stick is 10. Count by tens."
- Test:
  - "36. How many tens and ones?" with "36 = ☐ tens + ☐ ones."
  - "Which one is 27?"
  - "11 is 1 ten and how many ones?"

### U3 Comparing Two-Digit Numbers
- Goal: "Compare two numbers. Use >, =, or <."
- Key Idea: "Look at the tens first. More tens? That number is greater." / "Same tens? Look at the ones."
- Explore:
  - "The open side faces the bigger number."
  - "More tens? Bigger number. Same tens? Look at the ones. These have the same / different tens."
- CFU:
  1. "31 ☐ 57. What goes in the box?" (<)
  2. "71 and 74. Type the bigger number." (74)
  3. "82 and 28. Type the bigger number." (82)
  4. "65 ☐ 65. What goes in the box?" (=)
  - Praise lines: "Yes! 31 is less than 57." / "Yes! 74 is bigger. The ones told you." / "Yes! 82 is bigger. It has more tens." / "Yes! 65 equals 65."
- Practice:
  - "Compare A and B."
  - "A and B. Type the bigger number."
  - "A ☐ B. What goes in the box?"
  - "Both have 6 tens. What do you look at next?"
  - Show me: "A has 4 tens. B has 7 tens. So A < B."
  - Wrap-ups: "The tens told you." / "Same digits, but the tens are not the same."
- Test:
  - "Which is more, 47 or 74?"
  - "39 and 41. Type the bigger number."
  - "Which is the biggest: …?"

### U4 Ten More, Ten Less, and Adding Tens
- Goal: "Find 10 more and 10 less. Add and take away tens."
- Key Idea: "10 more or 10 less: only the tens change. The ones stay the same." / "Adding 20 is 2 tens more."
- Explore:
  - Controls: "More" / "Less", "Tens"
  - "10 more: go down one row. 10 less: go up one row. The ones stay the same."
  - "50 − 20: 5 sticks. Take away 2 sticks. 3 sticks are left. 50 − 20 = 30."
- CFU:
  1. "What is 10 more than 47?" (57)
  2. "What is 10 less than 12?" (2)
  3. "7 tens. Take away 3 tens. How many tens are left?" (4)
  4. "70 − 30 = ?" (40)
  - Nudges and whys, for example "That is 1 more. Go down one row.", "Take away, don't add."
- Practice:
  - "Start at N." / "What is 10 more than N?" / "N + 20 = ?" / "How many tens are in 20?"
  - Hint: "Find N. Go down one row. The ones stay the same."
  - Show me: "Start at N. Go down 2 rows: …"
  - Diagnose: "That moved by ones. Move by rows."
  - Wrap-up: "Only the tens changed."
- Test:
  - "How can you find 10 more than N fast?" [Change the tens / Count by ones]
  - "47 to 57. Which digit changed?"

### U5 Adding Ones to a Number
- Goal: "Add ones to a number like 38."
- Key Idea: "Add the ones first." / "10 or more ones? Make a new ten."
- Explore:
  - Buttons: "Add 6 more ones", "Make a new ten", "See the answer", "Start again"
  - "8 and 5 make 13 ones. That is more than 9. Make a new ten." / "The ones are 9 or less. The tens stay the same."
  - "10 ones make a new ten."
  - "Add the ones first. Then count the sticks and cubes."
- CFU:
  1. "34 + 5 = ?" (39)
  2. "38 + 5. How many ones now?" (13)
  3. "13 ones make a new ten. How many tens now?" (4)
  4. "38 + 5 = ?" (43)
- Practice:
  - "N ones make a new ten. How many tens now?"
  - Show me: "Watch: 10 cubes make a new stick. 3 tens and 1 more ten is 4 tens."
  - Diagnose: "Did you make a new ten?" / "13 ones make a new ten." / "Add the ones to the ones, not the tens."
  - Wrap-ups: "…13 ones made a new ten." / "No new ten this time."
- Test:
  - "29 + 7. Why do you make a new ten?" [The ones make 16 / The tens are small / The answer has 3 digits]
  - "How many ones? ☐ What is 38 + 5? ☐"

### Diagram text
- BaseTenBlocks banner: "10 cubes make a new ten!"

## 5. Verification

1. `npx tsc --noEmit -p tsconfig.app.json`: **pass**, 0 errors in the whole program.
2. `npx eslint src/pages/math-levels/MG2`: **pass**, 0 errors.
   - 11 warnings are the known `react-refresh/only-export-components` pattern on unit files.
   - 1 warning is an unused `eslint-disable` copied with MG1's `UnitView`. MG1 has the same line.
3. `npx vite build` (to a scratch outDir): **pass**. Only the existing chunk-size and dynamic-import warnings appear; nothing from MG2.
4. Test/unit import check: **pass**. Test files import only `../diagrams`, shared files and `words.ts`. Also no `useRef<T>()` without an initial value.
5. Brute force:
   - Setup: 12,000 problems per bucket, every step's picture rendered without help, with one wrong try, and with Show me. Every Test generator run 5,000 times.
   - **Pass, with one exception:** the `comparingTwoDigitNumbers/equal` bucket has no typed step. This existed before this round and is not in the merged list (see §6).
   - Every typed answer is a whole number in 0–120 (ranges printed per step). For example: cross100 99–102, tenLessCrossing 1–89, regroup total 20–98.
   - No duplicate or one-button choices. Symbol pick positions are about 1/3 each, and "The ones" is 50/50 in position.
   - No "1 tens"/"1 ones", arrows, " - ", regroup/bundle/carry/decade/multiple/tied/sum/even/grade, NaN or undefined.
   - U1 and U4 never mark the answer cell before the step is done or after one wrong try. U1 never shows the next number before help.
   - No help in Test charts, and no labels, ring or added cubes in Test blocks.
   - Module Test: 25 questions, pass 20.
   - Sample sentences per template were printed and read.
6. `node scripts/english-check.cjs --grade 1` on all changed files: 313 strings, 5 flags.
   - 3 "long" flags are lines joined by the script, not real sentences: the shell stars line (the MG1 K–1 wording the merged list asked for), the U2 Explore block and the U1 Explore block.
   - "place value" is in the lab's own name, in the "Back to Place Value to 120" button.
   - "whole" was fixed ("Move by rows.").
7. Browser at 820×1180 with touch, through a temporary harness that is now deleted, with speech stubbed:
   - The lab renders, with no console or page errors.
   - For every unit, Practice is locked before the CFU and opens after it, and the passed CFU stays on screen.
   - All 21 CFU items were answered wrong 2–3 times and then right. Each new question appears only after the one before it is answered. The 2nd miss shows "Look here!", which lights 1 Explore spot. The 3rd miss gives the "Watch…" line. No wrong-answer line contains the answer.
   - Practice: the type picker is hidden. Two wrong tries give the hint and the picture changes (U1 "?" box with the hop and faint numbers). Show me opens with "Got it" gray during the demo. The U2 count-along labels 10, 20, 30… in time.
   - U5 "Make a new ten" is gray while cubes are added, and the slide plays.
   - One bug was found and fixed: BlocksPair drew the two numbers at different sizes in the narrow CFU box. It now splits the row by each picture's natural width, so sticks are the same size on both sides.
   - Not confirmed: "Next number" speaking. The script didn't turn sound on, so the stub logged nothing. The code speaks only when sound is on.
   - Screenshots (scratchpad): `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\e426d022-1bef-480f-884c-4eaf0bda058b\scratchpad\shots\` (`u1-practice-wrong1.png`, `u2-practice-showme.png`, `u3-explore.png`, `u3-cfu-q1-fixed.png`, `u5-sliding.png`, plus a set for each unit).
   - Not done: a full help-ladder walk in U3 (the scripted wrong pick there was sometimes right by chance), dark mode, and side-door retry tests. Still worth a manual pass on a real iPad.

## 6. Noticed, not fixed (for round 2)

- **U3 `equal` bucket:** its only step is the symbol pick, and the answer is always "=". It has no typed step, so a clean solve can be a guess. This existed before this round and is not in the merged list.
- **Fixed-answer picks that were kept as agreed:**
  - U3 sameTens "What do you look at next?" (always "The ones"; only its position varies).
  - U3 "Type the bigger number" copies one of two numbers on screen. The builder says a copy step doesn't count as the typed step.
- **Old wording in the Tests (pre-existing):**
  - `decadeCrossNumberQuestion` (18 → 19) and `cross100NumberQuestion` (98 → 99, half the time) don't actually cross a ten or 100, though their names say so.
  - `noRegroupChoiceQuestion`'s distractor can be over 100 (e.g. 103).
  - `pickBiggestSameTensQuestion` lists the numbers in sorted order, so the biggest is always last.
- **Reverse bucket (U2):** still a single typed step (the builder asks for 2–3).
- **Practice picture size:** the whole 1–120 chart is used in Practice and Test (12 rows). It is readable at iPad size, but small.
- **Shell layout:** in full-page screenshots the unit rail sat over the page in the middle of the scroll. It looks like sticky/full-page capture behavior, not caused by these fixes. Worth checking on a device.
- **Deferred items still open:** C1-14 Test part (`tenVsHundredChoiceQuestion`), C1-15 (Unit 1 "How many?" 100–120 bucket), and passScore 9/10.
