# MK2 Addition, Subtraction & Teen Numbers: round 1 merged fix list

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` · Grade K, K–1 band · **Round:** 1 · **Date:** 2026-11-21
- **Inputs:** `round-1-curriculum.md` (3 Blocker, 29 Major, 10 Minor, 2 Polish) and `round-1-english.md` (6 Blocker, 25 Major, 12 Minor, 4 Polish)
- **Result:** all 91 findings are decided below. 90 are Fix and 1 is Skip (E1-08 is covered by rewrites, with its rule kept). The 3 Ask user items are answered.
- **How to read this:** the exact rewrites, evidence and line numbers are in the two reports under each ID. Use them unless a row here says otherwise. Where they differ, **this file wins**.
- **Paths:** relative to `MK2/AdditionSubtractionAndTeenNumbersLab/units/` unless noted. "Shell" is `MK2/MK2_AdditionSubtractionAndTeenNumbersLab.tsx`.

## User decisions (2026-11-21)

| Item | Decision | What it means for the fix |
|---|---|---|
| **D1 · Compare stories** (C1-13 + E1-23) | **Optional challenge** | The core Unit 2 compare bucket, Explore, Tests and Module Test use **"Who has more?"** with lined-up rows. "How many more?" moves to one **optional challenge** type in Unit 2 Practice: never in Mixed, no stars, no retry lock, no Test or Module Test items. Copy the MG1 pattern (`MG1/.../units/PutTogetherCompareWordProblems.tsx:582–644`, `optional: true`, `CHALLENGE_BUCKET`; MG1 shell `:219`). The challenge always names the child who really has more and uses lined-up rows with the extras ringed. |
| **D2 · Start-unknown** (C1-14 + E1-17) | **Replace** | Replace all start-unknown Test items in Units 1 and 2 with result-unknown or missing-part items that Practice teaches. |
| **D3 · Module Test stars** (E1-14) | **User's table** | 28–30 = 5 · 25–27 = 4 · 22–24 = 3 · 19–21 = 2 · 11–18 = 1 · 0–10 = 0. The user's table listed 19 in both the 2-star and 1-star rows; **19 is treated as 2 stars** and flagged for confirmation at wrap-up. |

**Pass score is not changed.** `passScore` stays 24 of 30. Under D3 a score of 24 is now 3 stars, so fix the comment at `ModuleTest.tsx:72` that says it matches the 4-star cutoff. Do not change the pass score. `RatingStars` must render 0 stars cleanly, with a correct label.

## Constraints for the fixer

- Edit only `MK2/`, plus `vocabulary.md` for this lab. **Do not edit `shared/`** or another lab. If a fix needs a shared change, report it as Needs decision. The working tree has unrelated uncommitted work in MG5, `shared/components/NumberPad.tsx`, `shared/styles/lab-base.css` and `PracticeSessionPage.tsx`: leave it alone.
- The Module Test stays at 30 questions, 5 per unit. When a Test question is replaced, update the Module Test import in the same change.
- Keep every plan bucket except as D1 changes Unit 2. The Unit 4 verify bucket stays, as Yes/No (see row 15). The Unit 6 "what does sixteen mean" bucket stays, without the word *digit*.
- Don't commit.

## Fix list

| # | ID(s) | Severity | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|---|
| 1 | C1-01 + E1-36 + C1-42 + E1-38 | Blocker | `FastFactsWithin5.tsx:207–222, 261–265`; `FastFactsWithin5Test.tsx:67, 133` | A true fact is marked wrong; fact-family steps go beyond K | Fix | Remove the fact-family steps. Replace with a second typed fact of the same kind. Module Test slot: "2 + ☐ = 5". |
| 2 | C1-02 + E1-22 | Blocker | `WordProblemsWithin10Test.tsx:133–157`; Explore `:177`; `ModuleTest.tsx:44–45` | Asks how many more when that child has fewer | Fix (D1) | Replace with "Who has more?" on lined-up rows. Vary which name has more. Never equal. |
| 3 | C1-03 + E1-26 + C1-16 | Blocker | `WordProblemsWithin10.tsx:139–170`; `PuttingTogetherAndTakingApart.tsx:141–162`; `FastFactsWithin5.tsx:130–136` | Steppers make impossible stories, negatives, and values out of range | Fix | Compute each stepper's max from the other. Changing the first pulls the second into range. Reset on mode change. Remove `Math.min(b, a)` from display. |
| 4 | E1-17 + C1-14 | Blocker | `PuttingTogetherAndTakingApartTest.tsx:37, 65`; `WordProblemsWithin10Test.tsx:190` | Start-unknown is tested, never taught | Fix (D2) | Replace with result-unknown or missing-part items, using E1-17's wording. |
| 5 | E1-21 | Blocker | `WordProblemsWithin10.tsx:217–219, 238–241`; Test `:51–57` | "Subtract" is never taught | Fix | "Add, or take away?" with **Add** / **Take away**. Replace *subtract* in all student text. |
| 6 | E1-42 + C1-23 | Blocker | `TeenNumbers.tsx:205–208`; Unit 3 Practice and Test | Two unknowns in one sentence; students never record a decomposition | Fix | Typed boxes: "10 + 6 = ☐", "16 = 10 + ☐", "7 = 4 + ☐", then the student's own second way. Include the total-on-the-left form. |
| 7 | E1-43 + C1-30 | Blocker | `TeenNumbers.tsx:145–147, 165, 207, 224`; `TeenNumbersTest.tsx:80–82, 117` | *Digit* is untaught; at 11 both choices read "1" | Fix | Remove *digit*. Practice: "16 is one ten and how many ones?". Test: "Look at 14. What does the 1 show?" **One ten** / **One dot**, using 12–19 only. |
| 8 | C1-04 | Major | All 6 CFUs | No "Look here" pointers | Fix | Add `look` to all 25 questions with `early` styling, using the C1-04 table, including its spot changes and 6 twins. Unit 2 Q4's spot uses lined-up rows. |
| 9 | C1-05 | Major | All Explores | Defaults are CFU numbers | Fix | U1 2 and 4 · U2 6 and 3 · U3 9 and 2 · U4 n = 1 · U5 1 and 1 with per-mode values · U6 ones = 7. |
| 10 | C1-06 + E1-39 + C1-18 | Major | All Practice | No Show me, no picture response; hints don't help | Fix | Each step gets `pointing(help, i)`, a spoken `showMe` line, a demo at about 1s per item, and `showMeHoldMs`. Hints name an action on the picture. Remove "You should know this". |
| 11 | C1-07 | Major | CFU show-it pictures listed in the report | "Watch and listen" shows nothing | Fix | On `mode === "show"`, number dots one per second with the spoken count, and fade or fill as the line says. |
| 12 | C1-08 + E1-04 | Major | All Explores | Steppers plus paragraphs | Fix | One guided "Watch" demo per Explore at about 1s per item, numbers on dots, next control held until done, then free play. One short line per picture state (E1-04). |
| 13 | C1-09 | Major | Shell `:308–314` | Picker lets a student stop earning stars | Fix | Hide the picker unless the unit has a real choice, as MG2 does. **Unit 2 must still offer the D1 challenge**, following MG1. |
| 14 | E1-14 | Major | `ModuleTest.tsx:25–31`, shell `:123, 441, 467` | A star at any score | Fix (D3) | Apply the D3 table. Fix the comments at `:22–24` and `:72`. |
| 15 | C1-10 + E1-02 | Major | The 9 true/false items | True/false is not K | Fix | Use E1-02's table, **except Unit 4 Test `:111`**: keep the plan's verify bucket as "Do 7 and 3 make 10?" **Yes/No**, true about half the time. Merge with the Module Test's verify item. |
| 16 | C1-11 + C1-29 | Major | All Tests | Pictures give the answer away | Fix | Draw only the givens. Take-from: one color, nothing marked. Missing part: known part plus "?" box. Fingers: starting fingers. `n − n`: no picture. Remove "(no extra ones)". |
| 17 | C1-12 | Major | Practice and Tests | The right answer never changes | Fix | Replace with typed steps or choices using the problem's numbers. Yes/No items are true about half the time. |
| 18 | C1-13 + E1-23 | Major | Unit 2 Practice, Explore, Tests, Key Idea | Compare stories exceed K | Fix (D1) | See D1. |
| 19 | C1-15 + E1-18 | Major | `PuttingTogetherAndTakingApart.tsx:117, 141–162` | Take-apart labels are false | Fix | Steppers **Start** and **Take away**, left = start − take away, fade the part taken. "Start" avoids the *whole/hole* homophone (E1-09). Finger line: "5 fingers. Put 2 down. 3 are still up." |
| 20 | C1-17 | Major | `diagrams/Fingers.tsx:52–55` and uses | Fingers contradict the story | Fix | `left` and `right` counts, one group per hand, tinted to match. |
| 21 | C1-19 + E1-20 | Major | `PuttingTogetherAndTakingApart.tsx:230–245` | Can ask for 11 fingers | Fix | Total 9 or less. "1 more finger goes up. How many now?" |
| 22 | C1-20 + E1-24 | Major | `WordProblemsWithin10.tsx:147, 154, 210, 217, 231, 239` | Teaches keywords | Fix | Neutral title "Story problem". Ask "Do more come?" / "Do some go away?". In every core story, the student picks the matching number sentence. |
| 23 | C1-21 + E1-25 | Major | `WordProblemsWithin10.tsx:278–281` | Story doesn't name the colors | Fix | "3 balloons. 1 is blue. The rest are orange. How many are orange?" with an orange answer box. Use correct singular and plural. |
| 24 | C1-22 | Major | `WordProblemsWithin10.tsx:171–181` | Compare model isn't lined up | Fix | Stack with `alignLeft` and `ringFrom`. Ask "Who has more?". Use names not in the CFU. |
| 25 | C1-24 + C1-25 + E1-29 | Major | `DecomposingNumbers.tsx:169, 182, 206–226` | Same pair called a different way | Fix | A second way never uses the same two numbers in either order. |
| 26 | C1-26 + E1-33 | Major | `MakingTenTest.tsx:85–101`; Module Test | Strategy preference question | Fix | Replace with typed "8 and how many make 10?", no picture. |
| 27 | C1-27 | Major | `FastFactsWithin5.tsx:193, 215, 258`; Test | Fluency items show the answer as dots | Fix | Show the fact alone. Dots appear after a wrong try in Practice. No dots in Tests. |
| 28 | C1-28 + E1-37 | Major | `FastFactsWithin5.tsx:261–265` | One-button question | Fix | Removed by row 1. Every remaining choice step must have at least 2 buttons. |
| 29 | C1-31 | Major | `diagrams/TenAndOnes.tsx:41–43` | Ones aren't grouped | Fix | Draw ones in a second `TenFrame` in the ones color. |
| 30 | C1-32 | Major | `TeenNumbers.tsx:110–117` | Never shows ten ones becoming a ten | Fix | "Build it" demo: count ones into the frame to 10 at 1 per second, then on into the second frame. |
| 31 | E1-01 | Major | Units 1, 2, 6 and Tests | "1 ducks", "1 ones" | Fix | One `count(n, singular, plural)` helper and singular verbs. Brute-force check for "1 + plural". |
| 32 | E1-03 + C1-40 + E1-32 | Major | All `goal` and `keyIdea` | Long; voice says "1 minus 9" | Fix | Use the E1-03 table. Unit 2's Key Idea must not mention compare. |
| 33 | E1-05 | Major | Throughout | Later-grade words | Fix | Use the E1-05 table. |
| 34 | E1-06 | Major | Throughout | Several names for one idea | Fix | "one ten" and "ones"; "put together" and "plus"; "left". |
| 35 | E1-07 | Major | CFUs in Units 1, 2, 5 | "ones" as a pronoun | Fix | "The faded dots went away. Count the dots left." |
| 36 | E1-13 | Major | Shell lines listed | Home and Module lines too long | Fix | Use the E1-13 table. "Tap", not "Click". |
| 37 | E1-27 | Major | `WordProblemsWithin10.tsx:261–263` | Abstract "whole time" step | Fix | Delete the step. |
| 38 | E1-30 | Major | `DecomposingNumbers.tsx`, Test | Long "if" prompts | Fix | Use the E1-30 table. |
| 39 | E1-31 | Major | `MakingTen.tsx`, Test, shell | "Partner"; voice says "6 s partner" | Fix | "6 and 4 make 10." Title and tab "Make 10". |
| 40 | E1-44 | Major | `TeenNumbers.tsx:200, 207`; Test `:117, 134` | "Equation" | Fix | "Write the number sentence". |
| 41 | E1-45 | Major | Unit 6 and Test | Long "ten-group" prompts | Fix | Use the E1-45 table. |
| 42 | C1-33 + E1-19 | Minor | `PuttingTogetherAndTakingApart.tsx:204, 223`; `WordProblemsWithin10.tsx:327` | Follow-up steps only copy a number | Fix | Replace with a step that needs the idea, or drop it. |
| 43 | C1-34 | Minor | `PuttingTogetherAndTakingApart.tsx:74, 87` | Two questions numbered 4 | Fix | Number the last one 5. |
| 44 | C1-35 + E1-28 | Minor | `WordProblemsWithin10Test.tsx:42–54` | Goes past 10; passive | Fix | Sum 10 or less. "He gets 3 more." |
| 45 | C1-36 | Minor | `MakingTenTest.tsx:158`, `TeenNumbersTest.tsx:156` | "10 and 0 more" is never taught | Fix | Remove and replace with taught items. |
| 46 | C1-37 | Minor | Units 4, 5 re-check | Repeats the same questions | Fix | Add a second fixed set of numbers. |
| 47 | C1-38 | Minor | U1 Q2, U3 Q1–Q2 CFUs | Answer is its own colored group | Fix | Show the known part and "?" until the first miss. |
| 48 | C1-39 | Minor | Unit 5 | Stresses speed | Fix | "Try to know it." No timer. |
| 49 | C1-41 + E1-16 | Minor | Shell `:262` | "Standard K.OA.1" on the student screen | Fix | Hide it from students in the MK2 shell. Other shells are out of scope. |
| 50 | E1-09 | Minor | Stories and Unit 1, 3 | *ate/eight*, *whole/hole* | Fix | "Sam eats 2." "All of them." |
| 51 | E1-10 | Minor | Listed lines | Story and step ask twice | Fix | The story states facts; only the step asks. |
| 52 | E1-11 | Minor | Explore controls | Labels a non-reader can't use | Fix | "Pick one", "Take away", "Number", "Ones", "Show me" / "Hide". Row 19 sets the Unit 1 labels. |
| 53 | E1-15 | Minor | Shell `:102–105, 119–120, 254` | Unit names aren't voiced | Fix | Wrap in `ReadAloud` or add a speak button. |
| 54 | E1-34 | Minor | `MakingTenTest.tsx:59` | "5 + 5 = 10, not 5 + 5 = 10." | Fix | `${n} and ${partner} make 10.` |
| 55 | E1-35 | Minor | `MakingTen.tsx`, Test | "exactly", "ACTUAL" | Fix | Use the E1-35 rewrites. |
| 56 | E1-40 | Minor | `FastFactsWithin5.tsx:155, 197, 243–244` | Doubles wording | Fix | "Are the two numbers the same?" |
| 57 | E1-46 | Minor | `TeenNumbers.tsx:178, 180` | "Say to yourself" | Fix | Title "Teen numbers". "Listen: sixteen." |
| 58 | C1-43 | Polish | `diagrams/SplitGroup.tsx` | Dots leave their columns | Fix | Fixed columns; mark the split with color and the divider. |
| 59 | C1-44 | Polish | Unit 3 Explore | Counts swapped pairs as ways | Fix | "There are many ways." |
| 60 | E1-12 | Polish | Test `hint` fields | Hidden hints, some false | Fix | When a Test item is touched, use a short picture pointer. Delete the false line at `FastFactsWithin5Test.tsx:133`. |
| 61 | E1-41 | Polish | `FastFactsWithin5.tsx:257, 260`; Test `:118` | Asks twice | Fix | "2 + ☐ = 5. What goes in the box?" |
| 62 | E1-47 | Polish | `_planning/Grade-K/AdditionSubtractionAndTeenNumbersLab/vocabulary.md` | Stray tag; list will be stale | Fix | Remove the tag and update the list after the fixes. MK1's list is out of scope. |
| 63 | E1-08 | Minor | Throughout | Dash and paren asides | Skip as its own item | Covered by the rewrites. Keep to the rule in any new text. |

## Verification the fixer must run

- `tsc`, eslint on `MK2/`, and `vite build`.
- Brute-force every Practice bucket and Test generator: no duplicate or one-button choices, exactly one true sentence per choice step, no "1 + plural", no *digit/subtract/partner/equation*, all values in range, Yes/No near 50%, swapped pairs never "different".
- Check `moduleTestStars` at 0, 10, 11, 18, 19, 21, 22, 24, 25, 27, 28, 30.
- Browser walk at 820×1180 with touch, including number pad position, the Unit 2 challenge, and a 2nd-miss pointer in each unit. Neither checker walked the lab in a browser, so report anything found. Remove any temporary harness page afterward.

## Proposed rule and guideline changes (for Stage 6, not applied)

**Builder (`math-lab-builder.md`):**
1. When one Explore stepper's range depends on another, changing the first pulls the second into range.
2. A choice between number sentences must have exactly one true sentence for every generated value, including 0; the brute-force script evaluates each choice.
3. After `choice()` removes duplicates, every choice step must still have at least 2 buttons; the script asserts it.
4. Two parts in the opposite order are not a different way to break a number apart.
5. A hand or finger picture draws each group on its own hand, matching the story.

**English guidelines:**
6. `math-language-traps.md` §8: don't use a possessive on a number ("6's" is spoken "6 s").
7. `checklist.md` §3, False distractors: test each generated choice at 0 and at equal values.
8. `checklist.md` §4: when a compare template fixes the names, check that the named child really has more at every value.
