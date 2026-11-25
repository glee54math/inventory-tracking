# MK2 Addition, Subtraction & Teen Numbers: curriculum review, round 2

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` (6 units, 6 unit Tests, 30-question Module Test)
- **Round:** 2 (re-review) · **Date:** 2026-11-21 · **Band assessed:** K–1 (K/1st first-timers plus behind 2nd graders, alone on an iPad, mostly non-readers, audio-first)
- **Evidence:** every unit, Test, diagram and the shell read in full; the shared `KCheck`, `StepProblem`, `UnitTest` and `choice()`/`pointing()`; a scripted check of 20,000 problems per Practice bucket and 20,000 draws of each Test; a focused browser run on the current code, with speech stubbed. Results and screenshots are in the scratchpad under `r2`.
- **Assumptions:** decisions D1–D3 are settled and were not re-opened. Rows that are mainly about wording were checked for the change being present; the quality of the wording belongs to the English review, which I did not read.
- **Paths** are relative to `MK2/AdditionSubtractionAndTeenNumbersLab/units/` unless noted.

## 0. Status of round 1 fixes

**62 Fix rows: 57 Fixed · 3 Not fixed in part (rows 10, 16, 17) · 2 Fixed, but caused a new problem (rows 20, 27).** Row 63 was Skip.

| Row | ID(s) | Status | Note |
|---|---|---|---|
| 1 | C1-01, E1-36, C1-42, E1-38 | Fixed | Fact families gone; every choice has exactly one true sentence |
| 2 | C1-02, E1-22 | Fixed | "Who has more?", varied, never equal |
| 3 | C1-03, E1-26, C1-16 | Fixed | Steppers stay in range |
| 4 | E1-17, C1-14 | Fixed | D2 applied |
| 5 | E1-21 | Fixed | Add / Take away |
| 6 | E1-42, C1-23 | Fixed | Typed recording, total on the left, own second way |
| 7 | E1-43, C1-30 | Fixed | "One ten" is always right here because row 7 specified this question |
| 8 | C1-04 | Fixed | 25 pointers, 6 twins |
| 9 | C1-05 | Fixed | Defaults match the table |
| 10 | C1-06, E1-39, C1-18 | **Not fixed in part** | 20 of 52 core steps have no picture response. See C1-06 |
| 11 | C1-07 | Fixed | U4 Q4 uses a ring, which suits its line |
| 12 | C1-08, E1-04 | Fixed | |
| 13 | C1-09 | Fixed | Picker only in Unit 2 |
| 14 | E1-14 | Fixed | All 12 D3 score points checked; `passScore` is 24 |
| 15 | C1-10, E1-02 | Fixed | |
| 16 | C1-11, C1-29 | **Not fixed in part** | Unit 6 Test still draws the answer. See C1-11 |
| 17 | C1-12 | **Not fixed in part** | "Add, or take away?" is fixed per bucket. See C1-12 |
| 18 | C1-13, E1-23 | Fixed | D1 applied; the Challenge is outside Mixed, stars and Tests |
| 19 | C1-15, E1-18 | Fixed | |
| 20 | C1-17 | **Fixed, new problem** | Help on "1 more finger" moves fingers between hands. See C1-17 |
| 21 | C1-19, E1-20 | Fixed | |
| 22 | C1-20, E1-24 | Fixed | |
| 23 | C1-21, E1-25 | Fixed | |
| 24 | C1-22 | Fixed | |
| 25 | C1-24, C1-25, E1-29 | Fixed | But see new finding C2-46 (n + 0) |
| 26 | C1-26, E1-33 | Fixed | |
| 27 | C1-27 | **Fixed, new problem** | "Show hint" brings the dots in before any try, and a star can still follow. See C1-27 |
| 28 | C1-28, E1-37 | Fixed | No one-button step in 20,000 draws per bucket |
| 29–31 | C1-31, C1-32, E1-01 | Fixed | |
| 32–41 | E1-03, C1-40, E1-32, E1-05, E1-06, E1-07, E1-13, E1-27, E1-30, E1-31, E1-44, E1-45 | Fixed | Change present; wording left to the English review |
| 42–45 | C1-33, E1-19, C1-34, C1-35, E1-28, C1-36 | Fixed | |
| 46 | C1-37 | Fixed | Second set exists; two gaps in it are C2-52 |
| 47–62 | C1-38, C1-39, C1-41, E1-16, E1-09, E1-10, E1-11, E1-15, E1-34, E1-35, E1-40, E1-46, C1-43, C1-44, E1-12, E1-41, E1-47 | Fixed | |

### The four leftovers you asked about

| Leftover | Result |
|---|---|
| 1. "Add, or take away?" repeats inside a bucket | **Confirmed, Major** (C1-12). Right answer is "Add" in 100% of add stories and "Take away" in 100% of take-away stories |
| 2. Answer of 0 has no dashed empty spot | **Confirmed, Major, and wider** (C2-48). The hint also describes dots that aren't there |
| 3. Test pad runs below the fold | **Confirmed, Major, and wider** (C2-49). It also happens at **1180×820, iPad landscape**: 6 of 12 keys are off screen, including 0 and Check |
| 4. Top "Try one like it" under the sticky bar | **Confirmed, Minor, shared code** (C2-55). Happens at 820×1180 and 390×844, not in landscape |

## 1. Verdict

**Ready after fixes.** The round 1 rewrite solved the false math and the lab now teaches far better, with no Blockers. The biggest remaining reason to hold it: when a student misses "Add, or take away?", the picture does nothing, Show me can't be reached, and the only button left is the answer.

**Counts: 0 Blocker · 9 Major · 7 Minor · 4 Polish**

## 2. Top 5 changes

1. **Make the picture teach on every missed pick (C1-06).** Act out the story after a wrong tap: dots fade for take away, the new group rings for add.
2. **Stop "Show hint" from opening the answer dots before a try (C1-27).** Otherwise a fast fact can be counted from dots and still earn a star.
3. **Stop the same Test question appearing twice (C2-45).** It happens in 79.8% of Unit 4 Tests and 46.2% of Module Tests.
4. **Keep the whole Test pad on screen on a landscape iPad (C2-49).**
5. **Fix the "write another way" step (C2-46, C2-47).** Typing the number and 0 earns a star every time, and its hint asks the student to move a dot that can't be moved.

## 3. Scorecard

Layers: 1 Standards · 2 Audience · 3 Arc · 4 Unstuck · 5 Pictures · 6 Math · 7 Mastery · 8 Device

| Unit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| 1 Putting Together | Strong | Strong | Strong | Weak: missed picks show nothing | OK | Strong | OK | Weak: Test pad |
| 2 Word Problems | Strong | Strong | Strong | Weak: operation step can't be shown | OK | Strong | Weak: fixed Add / Take away | Weak: Test pad |
| 3 Breaking Apart | Strong | Strong | Strong | Weak: "move a dot" is a dead end | Strong | Strong | Weak: n + 0 earns a star | Weak: Test pad |
| 4 Make 10 | Strong | Strong | OK | OK | Strong | Strong | Weak: repeated Test questions | Weak: Test pad |
| 5 Fast Facts | Strong | OK | OK | Weak: 0 facts | Weak: hint opens dots | Strong | Weak: star from counting dots | Weak: Test pad |
| 6 Teen Numbers | Strong | Strong | Strong | OK | Weak: Test shows the answer | Strong | Weak: repeated Test questions | Weak: Test pad |

## 4. Findings

### Major

**C1-06 · Major · Units 1, 2, 3, 4, 5, 6 Practice · Layer 4: a missed pick gets no teaching (row 10, not fixed in part)**
- **Who:** the first-timer and the guesser, most of all at Unit 2's "Add, or take away?".
- **Evidence:** script: after a wrong try, the drawing does not change on **20 of 52 core steps** (all of U2's operation and sentence steps, U2 compare counts, U1 sentence picks, U6 compose step 1). The shared "Look here" ring is the only change. On two-button picks the tried button locks, so `wrong` can't reach 2 and **Show me never appears**: browser, "Jen has 10 stickers. She gives 9 away", tap Add: one button left, Show me count 0. So the `showMe` lines on those steps are never heard, and the student just taps what remains. `WordProblemsWithin10.tsx:349, 376–390` only respond at the final step. Screenshot: `r2/shots/u2-addtake-wrong.png`.
- **Fix:** give each step `pointing(help, i)` in its picture. Operation and sentence steps: take-away stories fade the part leaving and add stories ring the new group, as the step's hint is spoken. U2 compare: ring the named row. U6: ring the ones for "count on". Because Show me can't open on a two-button pick, this picture change is the teaching.

**C1-12 · Major · Unit 2 Practice · Layer 7: the operation answer is fixed inside a bucket (row 17, not fixed in part) · Needs the user's decision**
- **Who:** the guesser on "Try one like it".
- **Evidence:** script: `addToResult` step 1 is "Add" 100%, `takeFromResult` is "Take away" 100%. The retry draws the same bucket, so repeating the tap passes the one decision K.OA.2 is about, and the number-sentence step that follows has the same fixed operation.
- **Options:**
  - **A (recommended):** a retry after help in these two buckets draws an add or a take-away story at random, and either one clears the debt. The student must really decide. Star credit goes to the bucket actually solved. Lab-only change in the MK2 shell.
  - **B:** keep the retry as it is and accept this, since the typed answer still has to be right.

**C1-27 · Major · Units 1, 2, 3, 5 Practice · Layer 7: "Show hint" opens the answer before any try (row 27, new problem)**
- **Who:** the guesser, in Fast Facts especially.
- **Evidence:** `pointing()` is true for a hint alone (`shared/engine/types.ts:57–58`). Browser: on "2 + 2 = ☐" with no try made, tapping Show hint changed the picture from the bare fact to 4 dots; typing 4 and finishing gave **"Solved it! You got a ⭐!"**. The same condition opens the "?" part in U2 missing part and U3 (`DecomposingNumbers.tsx:209`) and fades the take-away (`PuttingTogetherAndTakingApart.tsx:308`). Row 27 said dots appear after a wrong try.
- **Fix:** in MK2, add a helper that is true only after a wrong try or on Show me (`help.step === i && (help.wrong > 0 || help.showMe)`), and use it for any picture that reveals the asked-for part. Show hint before a try then speaks only.
- **Needs the user's decision (shared code, report only):** the engine counts a solve with one hint, or one wrong typed try, as clean. Your "honest stars" note says no help used. Should one hint still earn a star across all labs?

**C1-11 · Major · Unit 6 Test, Module Test · Layer 5: the picture shows the answer (row 16, not fixed in part)**
- **Who:** every student on "16 is one ten and how many ones?".
- **Evidence:** `TeenNumbersTest.tsx:27–37`, reused in `ModuleTest.tsx:7`. The picture draws the ones in their own orange frame, equal to the answer in **100%** of draws. Screenshot: `r2/shots/u6-test-decompose.png`. The Practice bucket (`TeenNumbers.tsx:237`) and CFU Q2 (`:58`) do the same before any try.
- **Fix:** Test: no picture, as `recordTeenQuestion` does. Practice and CFU Q2: draw the full ten and a "?" where the ones go, and bring the ones in after a wrong try, as Unit 3 does.

**C2-45 · Major · Units 3–6 Tests, Module Test · Layer 7: the same question can appear twice (new)**
- **Who:** every student. A question shown with a picture can come back without one, so the first answers the second, and "Previous question" can go back to it.
- **Evidence (20,000 draws each):** same question twice in **Unit 4 79.8% · Module 46.2% · Unit 5 31.9% · Unit 6 21.5% · Unit 3 4.3%**. Largest pairs: `nearTenComplement` = `makeTenNoPicture` (24.6%), `digitSwapTrap` = `forgotTheTenTrap` (11.6%), `composeTeen` = `teenNoPicture` (11.1%).
- **Fix:** in this lab, wrap each Test's question list so a generator redraws when its prompt has already been used in that sitting. Assert 0 duplicates in the script, including the Module Test.

**C2-46 · Major · Unit 3 Practice · Layer 7: "write another way" is passed by typing the number and 0 (new)**
- **Who:** the guesser, who finds it once and repeats it.
- **Evidence:** `OwnWay.tsx:27`. Browser: on 4, typing `4 = 4 + 0` gave **"Solved it! You got a ⭐!"**. This works on every problem. Explore teaches parts from 1 up (`DecomposingNumbers.tsx:165`).
- **Fix:** when either box is 0, don't mark it wrong, since it is true math. Say "Use two parts with dots in each," keep the boxes, and don't count a miss.

**C2-47 · Major · Unit 3 Practice · Layer 4: the hint asks for something the picture can't do (new)**
- **Who:** the first-timer at "Now write another way."
- **Evidence:** the hint is "Move one dot over. Count both parts." (`DecomposingNumbers.tsx:259`), but the dots can't be moved and the drawing doesn't change after a wrong try (`:238–243`; script 100%). Only the Look-here ring appears.
- **Fix:** after the first miss, draw a second row showing the example split `ex` and `ey`, with no numbers, and change the hint to "Look at the new row. Count each color."

**C2-48 · Major · Unit 5 Practice · Layer 4: facts with 0 have no picture to work from (leftover 2)**
- **Who:** the behind 2nd grader, on a common case: the answer is 0 in **17% of addition steps and about 29% of take-away and missing-number steps**.
- **Evidence:** browser, "5 + ☐ = 5": the hint says "Count the orange dots," but there are none; Show me says "That is 0" over 5 blue dots with no empty spot (`r2/shots/u5-zero-showme.png`). "5 − 0" says "The faded dots went away" with no faded dots (`FastFactsWithin5.tsx:333`). Explore's Missing number stops at 1–4 (`:199`), so "n + ☐ = n" is never shown before it is asked, in Practice or the Test.
- **Fix:** when the missing part is 0, draw a dashed empty spot, point at it, and show a big 0 on Show me (builder rule). Use 0-specific hints: "Are any dots missing?" and "None went away." Let Explore's Missing number reach 5 + 0.

**C2-49 · Major · All Tests, Module Test · Layer 8: half the number pad is off screen on a landscape iPad (leftover 3)**
- **Who:** every student on a landscape iPad, on every typed Test question.
- **Evidence:** browser at **1180×820**: pad runs to 899 on an 820-high screen, with keys **7, 8, 9, ⌫, 0, Check** off screen. Same six at 1366×768 (pad bottom 881 of 768). Fine at 820×1180. Screenshot: `r2/shots/test-pad-1180x820.png`. A non-reader may not know to scroll, and may conclude there is no 7.
- **Fix:** in landscape, place the picture and prompt on the left and the box and pad on the right, using MK2's stylesheet (`.atn-lab .test-question`). Re-check all 5 sizes. If it needs `shared/components/NumberPad.tsx`, which has unrelated uncommitted work, report it rather than editing.

### Minor

- **C1-17 · Unit 1 Practice · L5 (row 20, new problem):** on "1 more finger" after a miss, 2 and 2 on two hands becomes 4 on one hand plus a faded finger (`PuttingTogetherAndTakingApart.tsx:405–412`; `r2/shots/u1-fingers-wrong.png`). The groups the story named disappear. **Fix:** keep each group on its hand and add the new finger to the next open spot.
- **C2-50 · Units 4, 5 · L7:** the re-check doesn't start while a student stays in Practice. Browser: at 20 solves the Practice tab grays out, but "Next problem" keeps working (reached 21). It only applies once they leave the tab. MK1's shell has the same logic, so other K–1 labs likely do too; I only ran MK2. **Fix:** when a re-check is due, the wrap-up's next button goes to Explore with a short "Let's check" line.
- **C2-51 · Units 4, 6 Practice · L7:** a pick repeats the answer just typed: "Which one makes 10?" after typing the partner (`MakingTen.tsx:213–217`), and the sentence pick after "10 + n = ☐" (`TeenNumbers.tsx:281–285`). **Fix:** Unit 4: replace with a new number's partner. Unit 6: ask with a different teen number.
- **C2-52 · Units 4, 5 re-check · L7:** in Unit 4, Q4 and its twin are "No" in both sets (`MakingTen.tsx:54–57`), so a returning student can tap No from memory. In Unit 5, Q3 is 2 + 2 in both sets (`FastFactsWithin5.tsx:30–33`). **Fix:** make Unit 4's second set a true pair (7 and 3), with a true twin. Use 1 + 1 for Unit 5's second set and open Explore's Same two on 2 + 2 for that round.
- **C2-53 · Unit 2 Explore · L5:** Missing part names orange as known and blue as missing (`WordProblemsWithin10.tsx:255–258`); Practice and Tests do the opposite (`:442`). **Fix:** use blue known, orange missing everywhere.
- **C2-54 · Unit 2 Challenge · L4:** Show me says "Count the extras: 1, 2, 3" and holds the button, but no numbers appear on the dots (`WordProblemsWithin10.tsx:528`). **Fix:** number the ringed extras one per second.
- **C2-55 · Shell layout · L8 (leftover 4, shared code, report only):** when scrolled, the sticky unit bar covers the top "New problem / Try one like it" button at 820×1180 (button within about 100 px of the top) and 390×844. The wrap-up's own button still works. **Fix (shared):** add `scroll-margin-top`, or make the bar's height part of the scroll offset.

### Polish

- **C2-56 · Units 1, 2:** take-away wrong choices can show sums past 10, such as "9 + 8 = ☐". Keep distractors within 10.
- **C2-57 · Unit 5:** after both steps are done, take-away and missing-number pictures go back to the fact with an empty ☐ (`FastFactsWithin5.tsx:344–345, 399–400`). Show the finished fact.
- **C2-58 · Unit 2:** Explore's "Nia" and the CFU's "Mia" sound nearly alike to a child listening. Rename Nia (for example, Zoe).
- **C2-59 · Unit 2 Practice and Tests:** "Who has more?" name buttons are plain, while the CFU's match their row colors. Color them the same way.

## 5. Persona walkthrough highlights

- **First-timer who can't read, Unit 2:** hears "Jen gives 9 away," taps Add. The dots don't move, the voice says "Do some go away?", and only Take away is left. She taps it and moves on without having seen anything go away (C1-06).
- **Guesser, Units 3 and 5:** in Fast Facts he taps Show hint, counts the dots and gets a star (C1-27). In Unit 3 he learns "the number and 0" works on every "write another way" (C2-46).
- **Behind 2nd grader, Unit 5:** at "5 + ☐ = 5" she is told to count orange dots and there are none. She can only get through by missing twice and opening Show me (C2-48).

## 6. What's working well

- All round 1 false math is gone. Across 20,000 draws per bucket, no choice had zero or two true sentences and none had one button.
- All 25 CFU questions have a working "Look here" spot, and the Explore defaults don't show CFU answers.
- Guided Watch demos, numbered dots and lined-up compare rows are strong, and typed recording now meets K.OA.3 and K.NBT.1.
- D1, D2 and D3 are applied correctly. The Challenge stays outside Mixed, stars and Tests.
- The Show me demos on typed steps are good models for the fixes above.

## 7. Rule gaps (proposed for `math-lab-builder.md`; not applied)

1. "A two-button pick can't reach Show me, so its first wrong tap must change the picture and teach the idea."
2. "`pointing()` is also true for a hint with no try. A picture that reveals the asked-for part must wait for a wrong try or Show me."
3. "The brute-force script counts how often two questions in one Test sitting have the same prompt, including the Module Test; the target is 0."
4. "A 'write your own' step must say what it does with 0, and must not be passable by one answer that works every time."
5. "Check the Test's number pad at landscape iPad size (1180×820): every key must be on screen without scrolling."

## 8. What I could not check

- Real iPad speech, touch and Safari layout, and real students.
- Dark mode.
- I did not repeat the full CFU miss ladder for all 25 questions in the browser. For those I relied on reading the code and the fixer's 110-check run on the final code.
- The sentence-level English, which belongs to the English review.
