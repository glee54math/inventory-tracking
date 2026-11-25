# MK2 Addition, Subtraction & Teen Numbers: round 2 fixes

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` · Grade K, K–1 band · **Round:** 2 · **Date:** 2026-11-21
- **Source of truth:** `round-2-merged.md` (37 rows)

## 1. Summary

**36 Fixed · 0 Partly fixed · 0 Needs decision · 0 Not fixed · 1 Skip (row 37, as decided).**

- All final checks passed on the final code: 90 of 90 browser checks, the generator brute force, `tsc`, eslint (0 errors) and the full `vite build`.
- D5 (no star after a hint or wrong try) was **not** applied, as instructed. A solve with one hint or one wrong typed try can still earn a star until the all-labs engine change is made.
- No `shared/` file or other lab was edited. Nothing was staged or committed.
- Section 5 lists what was not checked. Section 6 lists issues for round 3.

## 2. Item table

Paths are relative to `MK2/AdditionSubtractionAndTeenNumbersLab/units/`. "Shell" is `MK2/MK2_AdditionSubtractionAndTeenNumbersLab.tsx`.

| # | ID(s) | Status | What changed | Where |
|---|---|---|---|---|
| 1 | C1-06 | Fixed | A wrong try now changes the picture on every Practice step. Take-away fades and rings the part leaving; add rings the new group; compare outlines the named row; Unit 6 rings the ones; a missed "same?" pick shows two groups | `labHelp.tsx`, all unit files, `diagrams/` |
| 2 | C1-27 | Fixed | New `afterTry()`. Pictures that reveal the asked-for part wait for a wrong try or Show me | `labHelp.tsx`, Units 1, 2, 3, 5, 6 |
| 3 | C1-12 | Fixed | D4: an add or take-away retry draws either type at random, including a retry carried over from an earlier visit. Credit goes to the bucket solved | Shell `retryItem` |
| 4 | C2-45 | Fixed | `noRepeats()` wraps all 6 unit Tests and the Module Test, so a generator redraws a prompt already used in that sitting | `labHelp.tsx`, all Test files, `ModuleTest.tsx` |
| 5 | C1-11 | Fixed | Test item has no picture. Practice and CFU Q2 show the full ten and "?"; ones come in after a wrong try. Also applied to the `teenVocab` bucket, which had the same problem | `TeenNumbers.tsx`, `TeenNumbersTest.tsx`, `diagrams/TenAndOnes.tsx` |
| 6 | C2-46, E2-50 | Fixed | A 0 and a repeated pair get their own line and no miss. A wrong sum gets "That makes 6. Make 5." The shared "Not a match" line is hidden on this step and is not spoken, including by Read all | `OwnWay.tsx`, `words.ts`, stylesheet |
| 7 | C2-47 | Fixed | After the first miss a second row shows the example split, with no numbers. A hint before any try says "Make 5 with two new numbers.", because no new row exists yet | `DecomposingNumbers.tsx`, `OwnWay.tsx` |
| 8 | C2-48, E2-56 | Fixed | Dashed empty spot with an arrow, big 0 on Show me, 0-specific hints. Explore's Missing number reaches 5 + 0 | `FastFactsWithin5.tsx`, `diagrams/ZeroSpot.tsx` |
| 9 | C2-49 | Fixed | In landscape, picture and prompt are on the left, box and pad on the right. Stylesheet only | Stylesheet |
| 10 | E2-48 | Fixed | "Ana has marbles. 3 are blue. 1 is orange." pattern at all four places | `WordProblemsWithin10.tsx`, Test |
| 11 | E2-49 | Fixed | E2-49 rewrites; *split* and "each part" are gone | `DecomposingNumbers.tsx`, Test |
| 12 | E2-51 | Fixed | Uses `count()` | `PuttingTogetherAndTakingApart.tsx` |
| 13 | E2-53 | Fixed | "He eats some…", "He eats 2…" | `WordProblemsWithin10.tsx` |
| 14 | C1-17 | Fixed | Each group stays on its hand; the new finger takes the next open spot | `PuttingTogetherAndTakingApart.tsx`, `diagrams/Fingers.tsx` |
| 15 | C2-50 | Fixed | When a re-check is due, Next problem, New problem and Try one like it go to Explore with "Let's check." The button's own label is shared and still says "Next problem" | Shell |
| 16 | C2-51 | Fixed | Unit 4 and Unit 6 picks ask about a new number | `MakingTen.tsx`, `TeenNumbers.tsx` |
| 17 | C2-52 | Fixed | Unit 4 second set: 7 and 3, twin 9 and 1 (both true). Unit 5 second set: 1 + 1, and Same two opens on 2 + 2 | `MakingTen.tsx`, `FastFactsWithin5.tsx`, `ExploreParts.tsx` |
| 18 | C2-53 | Fixed | Blue known, orange missing everywhere | `WordProblemsWithin10.tsx` |
| 19 | C2-54 | Fixed | Ringed extras are numbered one per second | `WordProblemsWithin10.tsx`, `diagrams/CompareRows.tsx`, `ObjectGroup.tsx` |
| 20 | E2-52 | Fixed | "None went away: 6 − 0 = 6." | `PuttingTogetherAndTakingApart.tsx` |
| 21 | E2-54 | Fixed | "Look here. Count all the dots." | `FastFactsWithin5.tsx` |
| 22 | E2-55 | Fixed | `${p} and ${shown} fill every box.` | `MakingTen.tsx` |
| 23 | E2-57 | Fixed | "The two numbers are the same." | `FastFactsWithin5.tsx` |
| 24 | E2-58 | Fixed | "5 dots. Add 2. More, or fewer?" and the take-away form | `PuttingTogetherAndTakingApartTest.tsx` |
| 25 | E2-59 | Fixed | D6 titles; unit ids unchanged. Nothing in the code matches on the old titles. Old titles remain in `plan.md` and `VISUAL_COMPONENT_TODO.txt`, which were out of scope | Each unit file |
| 26 | C2-56 | Fixed | Units 1 and 2 distractors stay within 0–10 and never take a bigger number from a smaller one | `words.ts` `plusTrap`, Units 1, 2 and Tests |
| 27 | C2-57 | Fixed | The finished fact stays on screen | `FastFactsWithin5.tsx` |
| 28 | C2-58 | Fixed | Nia is now Zoe | `WordProblemsWithin10.tsx` |
| 29 | C2-59 | Fixed | Name buttons match their row colors | `labHelp.tsx` `colorNames`, Unit 2, Test, stylesheet |
| 30 | E2-60 | Fixed | Capitals at sentence start; lowercase after "Listen:" | `TeenNumbers.tsx`, Test |
| 31 | E2-61 | Fixed | "Mia has 5 stickers. Leo has 3 stickers." and "2 extras." | `WordProblemsWithin10.tsx` |
| 32 | E2-62 | Fixed | "Count Jen's dots." | `WordProblemsWithin10.tsx` |
| 33 | E2-63 | Fixed | Both rewrites | Units 1, 5 |
| 34 | E2-64 | Fixed | "← Back" | Shell |
| 35 | English §5 | Fixed | The Unit 3 demo stops before pairs repeat in the other order | `DecomposingNumbers.tsx` |
| 36 | D7 | Fixed | 28–30 = 5, 25–27 = 4, 22–24 = 3, 19–21 = 2, 10–18 = 1, 0–9 = 0. `passScore` stays 24 | `ModuleTest.tsx` |
| 37 | C2-55 | Skip | Shared code, left open as decided | n/a |

**Also fixed (found in the browser):** a duplicate React key in Unit 3's two-row picture (`DecomposingNumbers.tsx`).

## 3. Changed files

No shared files changed, so no other lab is affected.

- **Shell and styles:** `MK2_AdditionSubtractionAndTeenNumbersLab.tsx`, `MK2_AdditionSubtractionAndTeenNumbersLab_styles.css`
- **Diagrams:** `CompareRows.tsx`, `Fingers.tsx`, `ObjectGroup.tsx`, `SplitGroup.tsx`, `TenAndOnes.tsx`, `index.ts`; new `ZeroSpot.tsx`
- **Units:** all 6 unit files, all 6 Test files, `ModuleTest.tsx`, `ExploreParts.tsx`, `OwnWay.tsx`, `words.ts`; new `labHelp.tsx`
- **Planning:** `_planning/Grade-K/AdditionSubtractionAndTeenNumbersLab/vocabulary.md`

## 4. New or rewritten student text

- **Titles:** Put Together and Take Away · Story Problems to 10 · Break Numbers Apart · Fast Facts to 5 · Teen Numbers
- **Shell:** "Let's check." · "← Back"
- **Unit 1:** "Count the fingers up." · "None went away: 6 − 0 = 6." · "1 finger. Put 0 down. 1 is still up." · Test: "5 dots. Add 2. More, or fewer?" · "5 dots. Take 2 away. More, or fewer?"
- **Unit 2:** "He eats some. That leaves fewer." · "He eats 2. Those are gone." · "A jar has marbles. 4 are orange. 3 are blue. How many in all?" · "A jar has marbles. 1 is blue. 1 is orange." · "Mia has marbles. 3 are blue. 2 are orange." · "Ana has marbles. 3 are blue. 1 is orange. How many in all?" · "6 crayons. 2 are blue. The rest are orange." · "Count the orange crayons." · "Count Jen's dots." · "Mia has 5 stickers. Leo has 3 stickers." · "2 extras." · name Zoe · stepper label "Blue"
- **Unit 3:** "Break 8 into two parts. Make them the same. How many in one part?" · "Break them into two parts. Make them the same. How many in one part?" · "Make two groups. Make them the same." · "Put dots in both parts." · "Yes, that makes 5. Use new numbers." · "That makes 6. Make 5." · "Look at the new row. Count both colors." · "Make 5 with two new numbers."
- **Unit 4:** "Now 4. Which one makes 10?" · "4 and 6 fill every box." · "Look: every box is full. 7 and 3 make 10." · "Yes! Every box is full. 7 and 3 make 10."
- **Unit 5:** "Look here. Count all the dots." · "Look here. The two numbers are the same." · "The two numbers are the same." · "1 goes away. Count the dots left: 1, 2, 3." · "Are there any dots?" · "Are any dots left?" · "None went away." · "Are there any orange dots?" · "There are no orange dots. That is 0."
- **Unit 6:** teen words capitalized at sentence start · "Now one ten and 3 ones. Which number sentence matches?"

## 5. Verification (final code)

| Check | Result |
|---|---|
| `tsc -p tsconfig.app.json` | Pass, 0 errors |
| eslint on `MK2/` | Pass, 0 errors, 17 warnings |
| `vite build` (full app) | Pass. It failed on earlier runs because of another session's unfinished MK3 edits, then passed on the final run |
| Test/unit import check | Pass, no Test or helper file imports a unit |
| Brute force | **No failures:** 312,000 Practice problems, 140,000 Test sittings, 1,800,000 Test questions |
| Duplicate prompts per sitting | 0, in all unit Tests and the Module Test |
| Distractors | None past 10, none negative |
| "Write another way" | No `n + 0` pass, checked exhaustively |
| Pictures (21,600 step comparisons) | A hint before a try reveals no dots; a wrong try changes the picture on every step; no duplicate React keys |
| `moduleTestStars` | Pass at 0, 9, 10, 18, 19, 21, 22, 24, 25, 27, 28, 30 |
| `english-check --grade K` | 22 flags of 417 strings. Those reviewed are false alarms ("1 points", "in all", "Whose row") or known lines |
| **Browser** | **90 of 90 passed, no page errors** |

The browser run used 820×1180 with touch unless a size is named, with speech stubbed and logged. It covered: missed two-button picks, Show hint before a try, all four 0-fact types, "write another way" (0, swapped, wrong sum, Read all), the D4 retry and its star credit, re-check entry and the second sets, Unit 6 pictures, the Challenge (no star, no retry lock), Explore at every stepper value (521 screens), the help ladder in all 6 units, Module Test stars at 9 and 10, and the pad at all 5 sizes.

**Number pad on all 63 typed Test questions:**

| Size | Keys on screen without scrolling | Over picture or question |
|---|---|---|
| 1180×820 | All questions | Never |
| 1366×768 | All questions | Never |
| 820×1180 | All questions | Never |
| 768×1024 | All questions | Never |
| 390×844 | **8 of 63; the other 55 need a scroll**, then all keys are reachable | Never |

Screenshots: `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\1e6785ee-43bc-449f-859a-a32e5cfac3e8\scratchpad\r2fix\shots`

**Not checked:**
- Dark mode, including the new `ZeroSpot` and "?" pictures.
- Real iPad speech, touch and Safari layout, and real students.
- The browser run sped demo timers up 8×, so real pacing of the new count-alongs was not watched from start to finish.
- The full CFU miss ladder for all 25 questions. Only the changed behavior in Unit 4, Unit 5 and Unit 6 Q2 was driven. The reworded Unit 2 Q3 and Unit 3 Q4 were checked by code and the English script only.

## 6. Noticed, not fixed

1. **Hints before a try can name dots that aren't drawn yet.** Because a hint before a try now only speaks (row 2), lines such as "Count the orange dots." can play over a "?" box or a bare fact. Only "write another way" was given a separate line.
2. Unit 6 `composeTeen` step 2 ("17 is one ten and how many ones?") still shows the ones, because step 1 needs them to find the number. The Test's "Listen" and "What does the 1 show?" items also draw the ones.
3. On Fast Facts 0 pictures, the empty spot sits some distance from the dots at iPad width.
4. At 390×844 the Test pad needs a scroll on most questions (table above). This was not a required size.
5. `noRepeats` compares exact prompts, so the same idea in different words can still appear ("16 is one ten and how many ones?" and "16 = 10 + ☐").
6. Old unit titles remain in `plan.md` and `VISUAL_COMPONENT_TODO.txt`.
7. Row 6 hides the shared "Not a match" line from inside MK2. A cleaner fix would be an optional custom message on `onWrong` in the shared engine.
