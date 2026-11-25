# MK2 Addition, Subtraction & Teen Numbers: round 1 fixes

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` · Grade K, K–1 band · **Round:** 1 · **Date:** 2026-11-21
- **Source of truth:** `round-1-merged.md` (63 rows, 91 findings)

## 1. Summary

**61 Fixed · 1 Partly fixed · 0 Needs decision · 0 Not fixed · 1 Skip (as decided).**

- **Partly fixed:** row 17. Two right answers still don't change inside one bucket (see the table).
- **Browser check is incomplete.** The main session stopped the harness server and the last walkthrough partway through. Units 1–3 passed on the final code. Units 4–6, the Challenge, the number pad and the 0-star screen were last run on earlier code, and two ladders and the Challenge ladder were never finished. Section 5 has the exact list.
- **To confirm with the user:** a Module Test score of 19 is 2 stars (D3 listed 19 in two rows).
- No shared file or other lab was edited. Nothing was committed.

## 2. Item table

Paths are relative to `MK2/AdditionSubtractionAndTeenNumbersLab/units/`. "Shell" is `MK2/MK2_AdditionSubtractionAndTeenNumbersLab.tsx`.

| # | ID(s) | Status | What changed | File |
|---|---|---|---|---|
| 1 | C1-01, E1-36, C1-42, E1-38 | Fixed | Fact-family steps removed; a second typed fact replaces them. Module slot is "n + ☐ = 5" | `FastFactsWithin5.tsx`, `FastFactsWithin5Test.tsx`, `ModuleTest.tsx` |
| 2 | C1-02, E1-22 | Fixed | "Who has more?" on lined-up rows; which name has more varies; never equal | `WordProblemsWithin10Test.tsx`, `ModuleTest.tsx` |
| 3 | C1-03, E1-26, C1-16 | Fixed | Each stepper's max comes from the other; changing the first pulls the second in; modes reset | Units 1, 2, 5 |
| 4 | E1-17, C1-14 | Fixed | Start-unknown items replaced with result-unknown items | `PuttingTogetherAndTakingApartTest.tsx`, `WordProblemsWithin10Test.tsx` |
| 5 | E1-21 | Fixed | "Add, or take away?" with Add / Take away; *subtract* gone | `WordProblemsWithin10.tsx`, Test |
| 6 | E1-42, C1-23 | Fixed | Typed "10 + 6 = ☐", "16 = 10 + ☐", "7 = 4 + ☐", and the student's own second way (`OwnWay.tsx`) | `TeenNumbers.tsx`, `DecomposingNumbers.tsx`, Tests |
| 7 | E1-43, C1-30 | Fixed | *Digit* removed. Test: "Look at 14. What does the 1 show?" One ten / One dot, 12–19 | `TeenNumbers.tsx`, `TeenNumbersTest.tsx` |
| 8 | C1-04 | Fixed | `look` on all 25 questions, 6 twins, new Explore spots | All 6 units |
| 9 | C1-05 | Fixed | New Explore defaults, per-mode values in Unit 5 | All 6 units |
| 10 | C1-06, E1-39, C1-18 | Fixed | Every step has `showMe`; counted steps have `showMeHoldMs` and a demo; pictures respond through `pointing()` | All Practice |
| 11 | C1-07 | Fixed | CFU show-it pictures number the dots one per second | All CFUs, `diagrams/timing.ts` |
| 12 | C1-08, E1-04 | Fixed | One Watch demo per Explore, controls held, Check opens after it; one short line per state | All Explores, `ExploreParts.tsx` |
| 13 | C1-09 | Fixed | Picker shows only when a unit has an optional type: Unit 2 offers Mixed / Challenge | Shell |
| 14 | E1-14 | Fixed | D3 star table; comments corrected; `passScore` stays 24; 0 stars renders empty with a correct label | `ModuleTest.tsx`, shell |
| 15 | C1-10, E1-02 | Fixed | True/false removed. Unit 4 verify is Yes/No, about 50%. Unit 1 and Unit 3 items vary so the answer isn't fixed (differs slightly from E1-02's wording) | All Tests, Units 2–3 |
| 16 | C1-11, C1-29 | Fixed | Tests draw only the givens; "?" box for missing parts; no picture on `n − n` | All Tests, `SplitGroup.tsx` |
| 17 | C1-12 | **Partly** | Fixed answers replaced and Yes/No balanced. **Left:** "Add, or take away?" is always the same inside the add and take-from buckets (mixed only across buckets, so "Try one like it" repeats it), and "One ten" is always right because row 7 specifies that question | Unit 2, `TeenNumbersTest.tsx` |
| 18 | C1-13, E1-23 | Fixed | D1: core compare is "Who has more?"; "How many more?" is an optional Challenge only | `WordProblemsWithin10.tsx`, shell |
| 19 | C1-15, E1-18 | Fixed | Start / Take away steppers; the part taken fades | `PuttingTogetherAndTakingApart.tsx` |
| 20 | C1-17 | Fixed | `Fingers` takes `left` and `right`, tinted per group | `diagrams/Fingers.tsx` and uses |
| 21 | C1-19, E1-20 | Fixed | Count stays at 9 or less; "1 more finger goes up. How many now?" | `PuttingTogetherAndTakingApart.tsx` |
| 22 | C1-20, E1-24 | Fixed | Title "Story problem"; no keyword lines; core add, take-away and put-together stories pick a number sentence. Compare stories ask "Who has more?" instead | `WordProblemsWithin10.tsx` |
| 23 | C1-21, E1-25 | Fixed | "3 balloons. 1 is blue. The rest are orange." Orange answer box | `WordProblemsWithin10.tsx` |
| 24 | C1-22 | Fixed | New `CompareRows`; Explore uses Nia and Ben | `diagrams/CompareRows.tsx` |
| 25 | C1-24, C1-25, E1-29 | Fixed | `otherPart` never reuses the two numbers in either order | `words.ts`, Unit 3 |
| 26 | C1-26, E1-33 | Fixed | Strategy item replaced with typed, no-picture item | `MakingTenTest.tsx`, `ModuleTest.tsx` |
| 27 | C1-27 | Fixed | Fact alone; dots after a wrong try; none in Tests | Unit 5 |
| 28 | C1-28, E1-37 | Fixed | One-button step removed; script finds none | Unit 5 |
| 29 | C1-31 | Fixed | Ones drawn in a second ten-frame | `diagrams/TenAndOnes.tsx` |
| 30 | C1-32 | Fixed | "Build it" demo counts into the frame, then on | `TeenNumbers.tsx` |
| 31 | E1-01 | Fixed | `count`, `verb`, `thereAre` helpers | `words.ts`, all units |
| 32 | E1-03, C1-40, E1-32 | Fixed | All goals and Key Ideas from the E1-03 table | All units |
| 33 | E1-05 | Fixed | Later-grade words replaced | All units |
| 34 | E1-06 | Fixed | "one ten", "ones", "put together", "plus", "left" | All units |
| 35 | E1-07 | Fixed | "dots" replaces the pronoun "ones" | CFUs, Units 1, 2, 5 |
| 36 | E1-13 | Fixed | Shell lines rewritten; "Tap" | Shell |
| 37 | E1-27 | Fixed | Step deleted | `WordProblemsWithin10.tsx` |
| 38 | E1-30 | Fixed | Short prompts | `DecomposingNumbers.tsx`, Test |
| 39 | E1-31 | Fixed | "6 and 4 make 10." Title and tab "Make 10" | `MakingTen.tsx`, Test, shell |
| 40 | E1-44 | Fixed | "Write the number sentence" | `TeenNumbers.tsx`, Test |
| 41 | E1-45 | Fixed | E1-45 wording. The "How many dots in one ten?" item became "n = 10 + ☐", because its answer was always 10 (C1-12) | `TeenNumbers.tsx`, Test |
| 42 | C1-33, E1-19 | Fixed | Copy steps replaced | Units 1, 2 |
| 43 | C1-34 | Fixed | Last question is number 5 | `PuttingTogetherAndTakingApart.tsx` |
| 44 | C1-35, E1-28 | Fixed | Sum 10 or less; "He gets 3 more." | `WordProblemsWithin10Test.tsx` |
| 45 | C1-36 | Fixed | "10 and 0" items replaced | `MakingTenTest.tsx`, `TeenNumbersTest.tsx` |
| 46 | C1-37 | Fixed | A second fixed number set, alternating after each pass (kept per device) | Units 4, 5, `ExploreParts.tsx` |
| 47 | C1-38 | Fixed | Known part and "?" until the first miss | U1 Q2, U3 Q1–Q2 |
| 48 | C1-39 | Fixed | "Try to know it." No timer | Unit 5 |
| 49 | C1-41, E1-16 | Fixed | Standard code hidden in the MK2 shell | Shell |
| 50 | E1-09 | Fixed | "eats", "all of them", no *whole* | Units 1–3 |
| 51 | E1-10 | Fixed | Story states facts; the step asks | Units 2, 4, 5 |
| 52 | E1-11 | Fixed | "Pick one", "Number", "Ones", "Take away", "Show me" / "Hide" | All Explores |
| 53 | E1-15 | Fixed | Speaker buttons on home cards; unit title read aloud | Shell, styles |
| 54 | E1-34 | Fixed | "n and partner make 10." | `MakingTenTest.tsx` |
| 55 | E1-35 | Fixed | "exactly", "ACTUAL" removed | `MakingTen.tsx`, Test |
| 56 | E1-40 | Fixed | "Are the two numbers the same?" | Unit 5 |
| 57 | E1-46 | Fixed | Title "Teen numbers". "Listen: sixteen." | `TeenNumbers.tsx` |
| 58 | C1-43 | Fixed | Fixed columns; divider between cells | `diagrams/SplitGroup.tsx` |
| 59 | C1-44 | Fixed | "There are many ways." | `DecomposingNumbers.tsx` |
| 60 | E1-12 | Fixed | Test hints are short picture pointers; false line deleted | All Tests |
| 61 | E1-41 | Fixed | "2 + ☐ = 5. What goes in the box?" | Unit 5 |
| 62 | E1-47 | Fixed | Tag removed; list rewritten | `vocabulary.md` |
| 63 | E1-08 | Skip | Covered by the rewrites; rule kept in new text | n/a |

**Also fixed (found in the browser):**
- Units 4 and 5: the repeating Check re-fired its completion and crashed with "Maximum update depth exceeded". `useCheckRound` now completes once.
- `OwnWay`: tapping Check while the floating pad was open did not register. The box now keeps focus, and the pad's own key is Check.

## 3. Changed files

No shared files changed, so no other lab is affected.

- **Shell and styles:** `MK2_AdditionSubtractionAndTeenNumbersLab.tsx`, `MK2_AdditionSubtractionAndTeenNumbersLab_styles.css`
- **Diagrams:** `Fingers.tsx`, `SplitGroup.tsx`, `TenAndOnes.tsx`, `TenFrame.tsx`, `index.ts`; new `CompareRows.tsx`, `timing.ts`
- **Units:** all 6 unit files, all 6 Test files, `ModuleTest.tsx`; new `ExploreParts.tsx`, `OwnWay.tsx`, `words.ts`
- **Planning:** `_planning/Grade-K/AdditionSubtractionAndTeenNumbersLab/vocabulary.md`

Bucket ids `compareDifference`, `teenVocab` and `equationRecord` were kept so students' earned star credit survives.

## 4. New or rewritten student text

Almost all student text changed, so the English checker should re-read the unit files in full. Priority locations:

- **Goals and Key Ideas:** the `Unit` export at the bottom of each unit file
- **Explore lines:** each `Explore` function
- **CFU wording, `say` lines and twins:** the `LOOK` table and `CheckForUnderstanding` in each unit
- **Challenge:** `howManyMoreChallenge` in `WordProblemsWithin10.tsx`
- **Shell:** Home, Module Test header, practice and mastered lines

Sentences still over 8 words, all from the agreed rewrites:
- "Split 8 into two parts that are the same." (CFU wording, E1-30)
- "A teen number is one ten and some ones." (E1-03)

## 5. Verification

| Check | Result |
|---|---|
| `tsc -p tsconfig.app.json` | Pass, 0 errors |
| `eslint` on `MK2/` | Pass, 0 errors. Warnings: the usual fast-refresh pattern, plus one unused disable comment already in the shell |
| `vite build` | Pass. Only the existing chunk-size and dynamic-import warnings |
| Test/unit import check | Pass, no Test imports its unit |
| Brute force on final code | **Pass:** 520,000 Practice problems, 600,000 Test draws, no failures: no duplicate or one-button choices, one true sentence per choice, no "1 + plural", no banned words, values in range, swapped pairs never "different" |
| Yes/No balance | 49–51% in every Yes/No item |
| `moduleTestStars` | Pass at 0, 10, 11, 18, 19, 21, 22, 24, 25, 27, 28, 30 |
| Module Test | 30 questions, 5 per unit, `passScore` 24, no "how many more" items |
| `english-check --grade K` | 26 flags. Most are false alarms ("1 points", "in all", "Whose row"); the real ones are the sentences in section 4 |

**Browser (820×1180, touch, speech stubbed):**

| Area | Result | Run on final code? |
|---|---|---|
| Units 1–3: demo gate, 2nd-miss pointer, CFU stays open, Practice unlocks, picker, help ladder, no star after help, Try one like it | Pass (28 of 28) | **Yes** |
| Unit 2 picker locked while a Mixed retry is owed | Pass | **Yes** |
| Unit 4: all of the above | Pass | No (one run earlier; its `useCheckRound` fix was in) |
| Units 5, 6: demo gate, pointers, CFU, unlock, picker | Pass | No (same earlier run) |
| **Units 5, 6: Practice help ladder** | **Not completed.** The script stopped on its own timing bug, then the run was stopped | No |
| **Unit 2 Challenge ladder, no star, no retry lock in the browser** | **Not completed.** Only the picker showing is confirmed; the rules are confirmed by code and script | No |
| Number pad at 820×1180, 1180×820, 768×1024, 1366×768, 390×844 | Pass: on screen, covers nothing, Practice and Test | No (before the `OwnWay` focus fix) |
| Module Test at 0 stars | Pass, label "0 of 5 stars" | No |

Screenshots: `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\1e6785ee-43bc-449f-859a-a32e5cfac3e8\scratchpad\shots`. The harness lived in the scratchpad; nothing was added to the repo.

**Not checked:** dark mode, real iPad speech and touch, and the alternate re-check number sets in the browser.

## 6. Noticed, not fixed

1. "Add, or take away?" is constant inside its bucket, so "Try one like it" can be passed on that step by repeating the tap (row 17).
2. On Practice, the top "Try one like it" button can end up under the sticky unit bar when the page is scrolled. The browser script could not tap it there. The wrap-up's own button works. This is in shared layout.
3. At portrait sizes the floating pad sits below the boxes, because there's no room to the left of the question. It covers nothing.
4. After a helped Challenge problem, the shared wrap-up keeps "Next problem" gray. "New problem" and the picker still work, same as MG1.
5. In `OwnWay`, the finished step's chip shows an example way, not the student's own, because a custom step's result text is fixed.
6. Take-away number-sentence distractors can show sums past 10 (such as "9 + 8 = ☐").
7. Unit titles are still long for Kindergarten ("Solving Word Problems Within 10"). They were not on the fix list.

## Browser verification (final code)

**Result: 110 checks passed, 0 failed, in one full run on the final code.** This replaces the "not completed" and "not on final code" rows in section 5. The run used a harness outside the repo, at 820×1180 with touch unless a size is named, with read-aloud on and speech stubbed and logged. Progress started empty, and every unit's CFU was passed through the screen.

| Requested check | Result |
|---|---|
| 1. Unit 4 full walk | Pass |
| 2. Units 5 and 6: CFU, 2nd-miss pointers, help ladder (hint, Show me, Try one like it) | Pass |
| Units 1–3, re-run on the final code | Pass |
| 3. Unit 2 Challenge: helped solve and clean solve show and say no star award, star count unchanged, no retry owed, top button stays "New problem", can return to Mixed | Pass |
| 4. Number pad at 820×1180, 1180×820, 768×1024, 1366×768, 390×844: on screen, not over a diagram, boxes, prompt or buttons, in Practice and Test | Pass (15 of 15, including Check and the first Show me tap with the pad open) |
| 5. Module Test at 0 stars (score 8): five empty stars, label "0 of 5 stars" | Pass |
| 6. Alternate re-check sets: 20 solves lock Practice, Units 4 and 5 show the second set, and passing it unlocks Practice | Pass |
| Page errors during the run | None |

**Lab bug found and fixed:** on the "write another way" step, closing the floating pad shifted the page, so the first tap on Show me missed. `MK2_AdditionSubtractionAndTeenNumbersLab_styles.css` now keeps the pad's page room for that whole step.

**Correction to the earlier results:** the "voice never says a star" check in the earlier runs was broken, and read-aloud was off, so those passes proved nothing. This run fixes both.

**Static checks after the fix:** `tsc` 0 errors · eslint on `MK2/` 0 errors, 16 warnings · `vite build` passes · brute force 520,000 Practice problems and 600,000 Test draws, no failures.

**Still not checked:** dark mode, real iPad speech and touch, and real students.

**Noticed for round 2, not changed:**
1. When a fast-fact answer is 0 (such as 3 + ☐ = 3), the help picture has no empty spot to point at. The builder rule asks for a dashed empty spot with a big 0.
2. At 1366×768 the Test's inline pad runs below the fold, so the student must scroll to reach its lower keys. It covers nothing.

The harness server I started has been stopped. Nothing temporary was added to the repo, `shared/` was not edited, and nothing was staged or committed.
