# MG1 Addition & Subtraction Within 20 — round 1 fixes

- Lab: MG1 `AdditionAndSubtractionWithin20Lab` · Grade 1 (K/1st first-timers + behind 2nd graders, iPad, audio-first) · Round 1 · 2026-11-17
- Work order: `round-1-merged.md` (User decisions 1–3 applied as written). Nothing committed.

## 1. Summary

**58 Fix rows: 57 Fixed (4 with a noted difference), 1 Needs decision (C1-26). 1 Skip left alone (C1-25).**

- All 6 CFUs are rebuilt with the K–1 design (`KCheck`): 33 one-at-a-time questions, **21 typed (64%)**; per unit typed share U1 60%, U2 83%, U3 50%, U4 67%, U5 75%, U6 50%. No true/false rule statements, no dropdowns, no first-miss message states an answer.
- Every CFU question keeps a "Look here" pointer: **1st miss → nudge, 2nd miss → "Look here!" (lit until right), 3rd miss → show it.** This is an additive `look` prop on `KCheck`'s `TypeCheck` / `PickCheck`; MK1–MK4 (no `look`) are unchanged (checked in the browser on MK2).
- The Making Ten rule (break apart the SMALLER number, bigger/smaller wording) now holds in every unit, Test, Module Test question and explanation (brute-force checked).
- Pictures show only what the problem gives before a try; Explore ranges come from each other (nothing past 20, nothing clamped); new Explore pictures teach start/change-missing stories, "same total", compare rows, three numbers, the box and Flip.

**Differences from the agreed change (still marked Fixed):**
1. **C1-09 (U6 true/false):** the "n = n" kind (1 in 5 of that bucket) has no "add it up" step, because there is nothing to add; it stays one Yes/No pick. Every other kind has typed step(s) first, and Yes is right 50% overall by construction.
2. **C1-07 (U4):** "Which one matches the story?" was added to every U3 and U4 story type except both-parts-missing, which has no single number sentence (its two steps are now both typed, per C1-09/E1-25).
3. **C1-38 / C1-31 (U5 subtraction past 10):** step 1 is "Think addition: 8 + ☐ = 12", step 2 is "So 12 − 8 = ?" — the same number twice, on purpose (that link is 1.OA.4). Step 1 is the typed step that counts.
4. **C1-11 / C1-13 (U1 count back):** the count-back pick became typed boxes, one per number said ("Count back 4 from 13. Say the numbers: ☐, ☐, ☐, ☐"), then "So 13 − 4 = ?". The old "count back ONE" step was dropped (it repeated box 1). "Show me" on the boxes step now draws exactly that step's hops, which settles C1-13. Count-back-small now takes away 2–4 (was 1–4) so there are always 2+ boxes; going-below-10 can need up to 9 boxes.

**Needs decision — C1-26 ("fewer" never leads to adding).** The only story where "fewer" means add is "Ben has 3 fewer than Lily. Ben has 5. How many does Lily have?" That is a wrong-way compare (CCSS mastery in 2nd grade) — the same kind E1-23 (Blocker) just removed from the required smaller-unknown bucket, and grade-1.md says not to require it. Adding it to the required bigger-unknown bucket would undo E1-23's reasoning. Options: (a) add it to the bigger-unknown pool anyway (half the draws); (b) put it in a new non-required "challenge" type; (c) leave it out (current state; Explore's "More than / Fewer than" lines show right-way stories only).

## 2. Item table

| ID(s) | Status | What changed | Where |
|---|---|---|---|
| C1-01 | Fixed | U3 Explore: Steppers; Add max = 20 − start, Take max = start (≤ 10), Start range from the change; no clamp; Switch grays out when the other kind would leave 0–20 | AddToTakeFromWordProblems.tsx `Explore` |
| E1-01 | Fixed | CFU rule T/F → KCheck one-example questions. Tests: U1 `countOnOrderRuleQuestion` ("3 + 12. Which number do you start at?"), `countBackRuleQuestion` (how many times, going below 10); U2 `strategyGeneralizationQuestion` (typed "5 + 7. Make a ten. What is the total?"); U3 `takeFromMissingRoleChoiceQuestion` (replaces `resultAlwaysUnknownRuleQuestion`); U4 `moreFewerSameGapQuestion` (two typed boxes); U5 `orderDoesNotMatterQuestion` (typed "Add 7 + 4 first. What is the total?", also Module Test) | *Test.tsx files |
| E1-23 | Fixed | Smaller-unknown: "Grace has 9 toy cars. Max has 3 fewer than Grace. How many toy cars does Max have?" Hint `"Fewer" means Max has less.` Practice + Test | PutTogetherCompareWordProblems.tsx, …Test.tsx |
| C1-04 + C1-02 + C1-03 + E1-03 + E1-04 + C1-40 | Fixed | All 6 CFUs rebuilt with `CheckSequence` / `TypeCheck` / `PickCheck` (questions in §4); BondFill removed | 6 unit files, KCheck.tsx |
| E1-05 + Making Ten pointer | Fixed | U2 Q1 options "6" / "9", 9 drawn in tone a; first miss "Not yet. Keep the bigger number whole."; `LOOK.keep` say "Look here. Which number is closer to 10?" | MakingTenAndDecomposing.tsx |
| C1-05 + C1-31 | Fixed | U4: two separate frames / the total in one color before help, split picture via `pointing`; U5: the fact written big (no dots) before help, the given numbers on frames after a wrong try, made ten / count-along on Show me; U6: given numbers only, help numerals hidden (`Num label={false}`) until found; step 2 of U5 adding = "sum − b" or "☐ + a = sum"; hints "Count on from the bigger number." / "Fill the ten first." / "Think addition". Tests: given numbers only, no picture on U5 fact questions | U4–U6 units and Tests |
| C1-06 | Fixed | Spoken `showMe` + `showMeHoldMs` (≈1 s per number said, max 7 s) on every final step in U2–U6 (and U1's new steps) | all unit files |
| C1-07 | Fixed (difference 2) | "Which one matches the story?" (U3) / "Which one finds the answer?" (U4) from this story's two numbers; `storySentenceChoices` makes 2 wrong sentences that never stand for the answer, always including the other-sign one; right position balanced (≈1/3 each, 6,000 draws per type) | logic.ts, U3/U4 units, U3 Test (3 new match questions) |
| C1-08 + C1-23 | Fixed | Steppers everywhere; U4 Green max = 20 − Orange; U5 Within 10 total ≤ 10, Past 10 total 11–18, three numbers total ≤ 20; U6 each side ≤ 20; no `Math.min(20, …)` left in pictures or text | U3–U6 Explore |
| C1-09 | Fixed (difference 1) | U6 T/F: typed "a + b = ?" (and "Add up the other side") before "Is it true?"; "= means" choice dropped from Practice; "Which number is missing?" includes "the total" (a + b = ☐ shape, 1 in 5); U4 both-parts: two typed "Say 3 are green…" steps | EqualSignAndEquations.tsx, PutTogetherCompareWordProblems.tsx |
| C1-14 | Fixed | Smaller number written first half the time (50.0% / 49.6%); first step "Which number do you break apart?" (answer the smaller, hint "Keep the bigger number whole. It is closer to 10."); frames in written order, bigger in tone a, the ten always filled by the bigger | MakingTenAndDecomposing.tsx `makeTenAdditionProblem` |
| C1-15 | Fixed | Bigger 6–9 / Smaller min 11 − bigger, each stepper's range from the other; Take away min = start % 10 + 1, Start max = 9 + take away; nothing rounded | MakingTenAndDecomposing.tsx `Explore` |
| C1-16 | Fixed | New Explore mode "Same total": two bonds, "Move one over" / "Move one back" (gray at the edges), line "Move one over. The total stays the same."; Practice step 1 words "It gets smaller by 2 / bigger by 2 / stays the same", step 3 typed "Now 6 + ☐ = 11" with a third first number | MakingTenAndDecomposing.tsx |
| C1-20 + E1-11 | Fixed | New StoryStrip diagram; Explore "What is missing?" (Start / Change / End) + "Show" counts the missing box in; atf-missing spot moved there; U3 Test has 1 start-missing question (`addToStartNumberQuestion`), Module Test 1 (`addToStartKeywordTrapChoiceQuestion`); start-missing Practice types stay required | diagrams/StoryStrip.tsx, AddToTakeFromWordProblems.tsx, …Test.tsx, ModuleTest.tsx |
| C1-21 | Fixed | Take-from-start Test numbers built from the end with change ≤ 20 − end; the keyword-trap wrong choice (end + change) kept ≤ 20 | AddToTakeFromWordProblemsTest.tsx |
| C1-24 + C1-28 | Fixed | Explore compare = `CompareRows` (Lily/Ben, extras circled) with a "Say it" switch: The gap / More than / Fewer than; Test compare questions use `CompareRows` without circles | PutTogetherCompareWordProblems.tsx, …Test.tsx |
| C1-29 | Fixed | Three numbers: "which two first" only when the three numbers are all different and one pair makes 10 (so exactly one right choice, no reversed duplicate); otherwise only the typed total. Practice + Test (`threeAddendGroupingChoiceQuestion`) | FluencyFactsWithin20.tsx, …Test.tsx |
| C1-30 | Fixed | `makeTenSpeedNumberQuestion`: other < nearTen, written in either order, explanation from the bigger; U5 pictures fill the ten with the bigger number; Explore "Past 10" default 8 + 5 with make-ten coloring and equations; CFU Q4 pointer lands there | FluencyFactsWithin20*.tsx |
| E1-02 | Fixed | Singular forms (`one` per context, `count()` helper), is/are helper, add-to start ≥ 1, take-from end ≥ 1 when the end is given; 6,000-draw scan: no "1 stickers", "1 are", "had 0" | U3/U4/U5 units and Tests |
| E1-06 + C1-37 | Fixed | addend / sum / difference / equation / compute / calculation / strategy / decomposing / fluency / bridging / valid / pair / cumulative removed from student text (scan finds none); titles "Making Ten", "Fast Facts to 20", "Equal Sign and Number Sentences", modes "Get to 10 first", "Past 10", "Three numbers" | all files |
| E1-07 | Fixed | Goals and Key Ideas per E1-07 (U2 keeps bigger/smaller) | 6 unit exports |
| E1-08 + C1-22 | Fixed | "What is missing?" with "the start / the change / the end" (U3) and "the total / a part" (U4); Practice titles "Story problem" / "Compare"; Explore "Result:" → "End:" | U3/U4 |
| E1-09 | Fixed | U3 Test CONTEXTS have `verbAddBase`: "How many did Nora find?" | AddToTakeFromWordProblemsTest.tsx |
| E1-10 | Fixed | "How many more crayons does Lily have than Ben?" / "How many fewer crayons does Ben have than Lily?" | U4 CFU Q4/Q5 |
| E1-12 | Fixed | U6: "first side / other side", steppers First / Second / Third / Fourth; "left" only means "still there" | EqualSignAndEquations*.tsx |
| E1-13 | Fixed | The atf-missing line switches with the story kind and the missing part (6 lines, `missingLine`) | AddToTakeFromWordProblems.tsx |
| E1-14 | Fixed | Hint "How many are past 10?" | MakingTenAndDecomposingTest.tsx |
| E1-15 | Fixed | "total" only; Test hint "The total can come first. Do both sides match?" | U6 |
| E1-16 | Fixed | Key lines atf-roles, ptc-ways, ptc-diff, flu-order, cob-keep per E1-16 | U1, U3, U4, U5 Explore |
| C1-38 | Fixed (difference 3) | Past-10 subtraction Practice: "Think addition: 8 + ☐ = 12" (the 8 with its empty boxes lit after a wrong try), Explore line "To take away, think addition. For 12 − 8, think: 8 and what make 12?", standard tag adds 1.OA.4 | FluencyFactsWithin20.tsx |
| C1-33 | Fixed | Half of three-number problems are short stories ("Mia picks 4 apples. Leo picks 8. Ana picks 2. How many apples in all?"); tag "1.OA.2, 1.OA.3, 1.OA.4, 1.OA.6" | FluencyFactsWithin20.tsx |
| C1-34 | Fixed | CFU Q3 typed "6 + 3 = ?"; Test `within10PictureNumberQuestion` (typed, picture of the two numbers) replaces the sorting question | FluencyFactsWithin20*.tsx |
| C1-10 + E1-18 | Fixed | `a <= b` rejected; hint "Start at the bigger number."; explain "Start at 9. It is bigger." | CountingOnAndBack.tsx |
| C1-11 | Fixed (difference 4) | Typed "Say the numbers" boxes | CountingOnAndBack.tsx `countBackProblem` |
| C1-12 | Fixed | Explore number line draws hop arcs from the start | CountingOnAndBack.tsx |
| C1-13 | Fixed | See difference 4 | CountingOnAndBack.tsx |
| C1-17 | Fixed | 9 in tone a (bigger), 6 in tone b | U2 CFU Q1 |
| C1-19 | Fixed | "This is a number bond. The top is the whole. The two circles are its parts." | U2 Explore |
| C1-26 | **Needs decision** | Not implemented — see §1 | — |
| C1-27 | Fixed | 10-unit gap after every 5th counter | diagrams/CompareRows.tsx |
| C1-32 | Fixed | Within 10 (total ≤ 10, count-on line) / Past 10 (make-ten picture) / Three numbers (three colored groups, the make-ten pair outlined, "Move the numbers around") | FluencyFactsWithin20.tsx `Explore` |
| C1-35 | Fixed | U6 box mode ("Hide a number in a box" + "Find it" counts on) and "Flip" button; eq-missing / eq-either-side pointers land on them | EqualSignAndEquations.tsx `Explore` |
| C1-36 | Fixed | False sum = sum (4 + 1 = 5 + 2), subtraction sentences to judge (both sides), ☐ − 3 = 5 shape; Test `bothSidesTrueFalseQuestion` replaces `genuineTrueComputedQuestion` | EqualSignAndEquations*.tsx |
| E1-17 | Fixed | "You will go below 10." / "You went below 10." (Practice + Test) | U1 |
| E1-20 | Fixed | Pennies → stickers; Owen rocks found/lost; Zoe stamps got/gave away; Ava crayons got/lost; Theo cards got/gave away; Liam shells found/dropped | U3 + Test |
| E1-21 | Fixed | "He got more. To find the start, take those away." / "She gave some away. To find the start, add them back." (verb from the story) | U3 + Test |
| E1-24 | Fixed | Say lines "Start with the bigger. Take away the smaller." / "Start with the total. Take away the part." / "Put the two parts together."; hints "Start with the bigger number. Take away the smaller one." | U4 |
| E1-25 | Fixed | "Is there just one way?" (CFU), "Say 3 are green. How many are orange?" / "Now say 5 are green…", wrap-up "8 buttons can be green and orange in many ways." (one part still given — User decision 3) | U4 + Test |
| E1-27 | Fixed | Parentheses hint and "#1" sentence gone with their questions; "Count on to add" / "Count back to take away"; no slashes | U1, U5 |
| E1-28 | Fixed | "First / Second / Third"; "two numbers" | U5 |
| E1-30 | Fixed | "= means the same as. Both sides must have the same amount."; "box" everywhere | U6 |
| E1-31 | Fixed | Hints per E1-31 ("Add it up. Is it really true?", "Look at both sides. Are they the same?", "The box is the number you take away.") | U6 + Test |
| E1-32 | Fixed | Hero "Count on, make ten, solve stories, and learn what = means."; "Only Mixed problems give you stars."; "{30} questions from all {6} units." (home card + Module Test header) | MG1_AdditionAndSubtractionWithin20Lab.tsx |
| C1-18 | Fixed | "Break apart the smaller number" in the Key Idea; the old strategy T/F lines are gone; rollout doc updated | U2, CFU_Pointer_Rollout/MG1_…md |
| E1-19 | Fixed | "3 + 9. Which number do you start at?" / "Start at 9. It is bigger. You count less." (Practice + Test) | U1 |
| E1-22 | Fixed | No pronoun in titles ("Story problem") | U3 |
| E1-26 | Fixed | "Which one finds the answer?" / Test "Which one finds how many fewer?" (+ a "9 + 5" choice) | U4 |
| E1-29 | Fixed | "8 = 8. Is it true?" with `data-tts-say` "Is 8 the same as 8?"; "Yes, true" / "No, false"; title "Is it true?" | U6 + Test |
| C1-25 | Skip (user) | — | — |

## 3. Changed files

Shared (re-check in other labs):
- `src/pages/math-levels/shared/components/KCheck.tsx` — **affects MK1–MK4** (every K CFU) and now MG1. Additive optional `look` prop on `TypeCheck` and `PickCheck`; without it nothing changes (show-it still on the 2nd miss, no pointer; verified on MK2 Making 10 in the browser).

MG1 lab:
- `src/pages/math-levels/MG1/MG1_AdditionAndSubtractionWithin20Lab.tsx` (shell text only)
- `…/AdditionAndSubtractionWithin20Lab/logic.ts` (new `sentencesFrom`, `storySentenceChoices`)
- `…/diagrams/CompareRows.tsx`, `…/diagrams/index.ts`, `…/diagrams/StoryStrip.tsx` (new), `…/diagrams/ThreeGroups.tsx` (new)
- `…/units/CountingOnAndBack.tsx`, `CountingOnAndBackTest.tsx`
- `…/units/MakingTenAndDecomposing.tsx`, `MakingTenAndDecomposingTest.tsx`
- `…/units/AddToTakeFromWordProblems.tsx`, `AddToTakeFromWordProblemsTest.tsx`
- `…/units/PutTogetherCompareWordProblems.tsx`, `PutTogetherCompareWordProblemsTest.tsx`
- `…/units/FluencyFactsWithin20.tsx`, `FluencyFactsWithin20Test.tsx`
- `…/units/EqualSignAndEquations.tsx`, `EqualSignAndEquationsTest.tsx`
- `…/units/ModuleTest.tsx` (Unit 3 slot 5 `takeFromStartKeywordTrapChoiceQuestion` → `takeFromChangeNumberQuestion`)

Docs: `_planning/reviews/CFU_Pointer_Rollout/MG1_AdditionAndSubtractionWithin20Lab.md`; this report. Temporary harness (`harness-mg1.html`, `src/__harness_mg1.tsx`) created and deleted.

## 4. New or rewritten student text

### CFU questions (every one is new; feedback is "nudge / named reasons / show line / praise")
The question → spot → spoken pointer line table is in `CFU_Pointer_Rollout/MG1_AdditionAndSubtractionWithin20Lab.md`. Typed = number pad.

**U1** (3 of 5 typed)
1. "8 + 3. Count on. Where do you start?" — typed 8. Nudge "Don't start at 1. Count on."; 1 → same; 3 → "Which number is bigger?"; show "Watch: start at the 8. Then count on."; praise "Yes! Start at 8."
2. "Count on 3 from 8. Where do you land?" — typed 11. Nudge "Say one number for each hop. Say 3 numbers."; 10 → "Don't count the 8. Count on from it."; 12 → "Say just 3 numbers."; show "Watch and listen: 9, 10, 11."; praise "Yes! 9, 10, 11. You land on 11."
3. "3 + 8. Which number do you start at?" — pick 3 / 8 → 8. 3 → "Which number is bigger?"; show "Watch: start at 8. Count on 3: 9, 10, 11."; praise "Yes! Start at 8. It is bigger."
4. "12 − 3. Count back 3 from 12. Where do you land?" — typed 9. Nudge "Count back one at a time. Say 3 numbers."; 10 → "Don't say 12. Count back from it."; 8 → "Say just 3 numbers."; 15 → "Count back, not on."; show "Watch and listen: 11, 10, 9."; praise "Yes! 11, 10, 9."
5. "13 − 4. How many times do you count back?" — pick 3 / 4 / 5 → 4. 3 → "Hop back once for each one you take away."; 5 → "Don't count the 13. Hop back from it."; show "Watch: one hop for each one you take away."; praise "Yes! Take away 4. Count back 4 times."

**U2** (5 of 6 typed)
1. "6 + 9. Which number do you break apart?" — pick 6 / 9 → 6. 9 → "Not yet. Keep the bigger number whole."; show "Watch: 9 needs just 1 more. 1 from the 6 fills the ten."; praise "Yes! Keep 9 whole. Break apart 6."
2. "8 + 6. How many more does 8 need to make 10?" — typed 2. Nudge "Count the empty boxes."; 6 → "Keep 8 whole. Count its empty boxes."; show "Watch: 2 boxes are empty. 2 from the 6 fill them."; praise "Yes! 8 and 2 make 10."
3. "So 8 + 6 = ?" — typed 14. Nudge "Fill the ten first. Then add the rest."; 4 → "That is the rest. Add it to 10."; 10 → "That is the ten. Add the rest too."; show "Watch: 8 and 2 make 10. 4 more is 14."; praise "Yes! 8 + 6 = 14."
4. "7 + 5. Make a ten. What is the total?" — typed 12. Nudge "Keep 7 whole. Fill the ten first."; 2 / 10 → as Q3; show "Watch: 3 from the 5 fill the ten. 2 more is 12."; praise "Yes! Making ten works again."
5. "13 − 5. Get to 10 first. How many do you take away first?" — typed 3. Nudge "How many are past 10?"; 5 → "Take away just enough to get to 10."; show "Watch: 3 are past 10. Take those 3 away."; praise "Yes! 13 − 3 = 10."
6. "13 − 5 = ?" — typed 8. Nudge "3 are gone. Take away the rest of the 5."; 10 → "Take away the rest of the 5 too."; 18 → "Take away. Don't add."; show "Watch: 3 are gone. 2 more go from the ten."; praise "Yes! 13 − 5 = 8."

**U3** (3 of 6 typed; picks are "the start / the change / the end")
1. "Sam had 6 apples. He picked 5 more. What is missing?" → the end. start → "The story says he had 6."; change → "The story says he picked 5."; show "Watch: the story tells the start and the change. The end is missing."; praise "Yes! The end is missing."
2. "How many apples does Sam have now?" — typed 11. Nudge "Start with 6. Count on 5."; 1 → "He picked more. Now he has more."; 5 → "That is how many he picked."; show "Watch and listen: 7, 8, 9, 10, 11."; praise "Yes! 6 + 5 = 11."
3. "Sam had 6 apples. He picked some more. Now he has 11. How many did he pick?" — typed 5. Nudge "Start with 6. Count on to 11."; 11 → "11 is the end. How many did he pick?"; 17 → "Don't add 6 and 11."; show "Watch: count on from 6 to 11. 7, 8, 9, 10, 11. That is 5."; praise "Yes! The change is 5."
4. "Ana had 9 shells. She lost some. Now she has 6. What is missing?" → the change. start → "The story says she had 9."; end → "The story says she has 6 now."; praise "Yes! The change is missing."
5. "Leo had some stickers. He got 4 more. Now he has 11. What is missing?" → the start. change → "The story says he got 4."; end → "The story says he has 11 now."; praise "Yes! The start is missing."
6. "How many stickers did Leo have at the start?" — typed 7. Nudge / 15 → "He got more. To find the start, take those away."; 11 → "11 is the end. What did he have at the start?"; show "Watch: take the 4 away from 11. 7 are left."; praise "Yes! 11 − 4 = 7."

**U4** (4 of 6 typed)
1. "Mia has 4 green buttons and 5 orange buttons. How many buttons in all?" — typed 9. Nudge "Put the two parts together."; 1 → "Put them together. Don't take away."; show "Watch: put them together. 4 and 5 make 9."; praise "Yes! 4 + 5 = 9."
2. "Jake has 6 cards. Some are sports cards. Some are animal cards. Is there just one way?" — pick Just one way / More than one way. one → "Try other ways to split 6."; praise "Yes! You can split 6 many ways."
3. "Say 2 are sports cards. How many are animal cards?" — typed 4. Nudge "Start with 6. Take away the 2."; 8 → "6 cards in all. Don't add."; 6 → "6 is all the cards."; show "Watch: 2 are sports cards. The rest are 3, 4, 5, 6. That is 4."; praise "Yes! 2 and 4 works. So does 1 and 5."
4. "Lily has 9 crayons. Ben has 5. How many more crayons does Lily have than Ben?" — typed 4. Nudge "Line them up. Count the extras."; 14 → "Don't add. Line them up."; 9 → "That is all of Lily's."; 5 → "That is all of Ben's."; show "Watch: match them up. The extras are 1, 2, 3, 4."; praise "Yes! Lily has 4 more."
5. "How many fewer crayons does Ben have than Lily?" — typed 4. (same nudges); show "Watch: match them up. Ben is missing 1, 2, 3, 4."; praise "Yes! Both are 4."
6. "Ben has 5 crayons. Lily has 9. Which one finds how many fewer?" — pick 5 − 9 / 9 − 5 / 9 + 5. 5 − 9 → "Start with the bigger number."; 9 + 5 → "Don't add. Find the extras."; praise "Yes! 9 − 5 = 4."

**U5** (3 of 4 typed)
1. "4 + 8 + 2. Which two do you add first?" — pick 4 + 8 / 8 + 2 / 4 + 2. Wrong → "Find two numbers that make 10."; praise "Yes! 8 + 2 = 10."
2. "Now add 4 + 8 first. Then add the 2. What is the total?" — typed 14. Nudge "Add 4 + 8. Then add the 2."; 12 → "That is 4 + 8. Now add the 2."; 10 → "Add 4 + 8 first this time."; show "Watch: 4 + 8 = 12. 12 + 2 = 14."; praise "Yes! 14. Any order gives 14."
3. "6 + 3 = ?" — typed 9 (fact big; frames after a wrong try). Nudge "Count on from the bigger number."; 3 → "Put them together. Don't take away."; show "Watch and listen: start at 6. 7, 8, 9."; praise "Yes! 6 + 3 = 9."
4. "9 + 7. Make a ten first. What is the total?" — typed 16. Nudge "9 needs 1 more to make 10."; 6 / 10 → as U2 Q3; show "Watch: 1 from the 7 fills the ten. 6 more is 16."; praise "Yes! 9 + 1 = 10. 10 + 6 = 16."

**U6** (3 of 6 typed; spoken forms via `data-tts-say`)
1. "What does = mean?" — pick "The answer comes next" / "Both sides are the same amount". next → "Look at both sides. Are they the same?"; praise "Yes! = means the same as."
2. "5 = 2 + 3. Is it true?" (spoken "Is 5 the same as 2 plus 3?") — Yes, true / No, false. No → "Add up each side. Are they the same?"; praise "Yes! Both sides match."
3. "7 + 1 = 6 + ☐. What number goes in the box?" — typed 2. Nudge "Add up the first side. Make the other side match."; 8 → "8 is the first side. What goes with 6 to make 8?"; 14 → "Make both sides the same."; show "Watch: 7 + 1 is 8. 6 and 2 more make 8."; praise "Yes! 7 + 1 = 6 + 2. Both are 8."
4. "8 = 8. Is it true?" (spoken "Is 8 the same as 8?") — No → "Look at both sides."; praise "Yes! 8 is the same as 8."
5. "8 + ☐ = 11. What number goes in the box?" — typed 3. Nudge "Count up from 8 to 11."; 19 → "Don't add 8 and 11."; 11 → "11 is the total. What goes with 8?"; show "Watch and listen: 9, 10, 11. That is 3."; praise "Yes! 8 + 3 = 11."
6. "☐ = 6 + 5. What number goes in the box?" — typed 11. Nudge "The box can come first. Add 6 + 5."; 1 → "Add. Don't take away."; show "Watch: 6 and 4 make 10. 1 more is 11."; praise "Yes! 11 = 6 + 5."

CFU → Practice bucket → Test carry-forward: start at the number you have / bigger number → countOnLarger, countOnSmallFirst → `startFromKnownChoice`, `countOnSmallFirstChoice`, `countOnOrderRule`; count-back count → countBackSmall/Cross → `countBackHowManyTimes`, `countBackRule`; break apart the smaller → makeTen buckets (new first step) → `wrongAddendChoice`; make ten on a new fact → makeTen buckets → `strategyGeneralization`; get to 10 first → subtractBridge → `subtractBridgeToTen`/`Number`; missing part not always the end → all 6 U3 buckets (role step) → `changeUnknownRoleChoice`, `takeFromMissingRoleChoice`; "more" story taking away → addToStart → `addToStartNumber`; more/fewer same gap, direction → compareDiffMore/Fewer → `moreFewerSameGap`, `compareDiffFewerDirectionChoice`; many splits → ptaBothAddendsUnknown → `ptaBothAddendsCluster`; two that make 10, any order → threeAddendSum → `threeAddendGroupingChoice`, `orderDoesNotMatter`; within-10 typed → factsWithin10 → `within10PictureNumber`; = means the same, total first, n = n, box not last → U6 buckets → U6 Test.

### Explore lines (new or changed)
- U1: segment labels "Count on to add" / "Count back to take away"; "You did not start over. You kept going from {start}."
- U2: modes "Making ten" / "Get to 10 first" / "Same total"; "This is a number bond. The top is the whole. The two circles are its parts."; Same total steppers "First number" / "Second number", buttons "Move one over" / "Move one back", "Move one over. The total stays the same."; Take-away stepper labels "Start" / "Take away".
- U3: "Start: {n}" / "End: {n}"; "{s} + {c} = {e}. It went up. This is an Add To story." / "{s} − {c} = {e}. It went down. This is a Take From story."; "A story can hide the start, the change, or the end. Which one is missing?"; "What is missing?" (Start / Change / End), "Show"; lines: "End missing? Start, then add the change." / "End missing? Start, then take away the change." / "Start or change missing? Take the number you know away from the end." / "Start missing? Add the end and the change." / "Change missing? Take the end away from the start."; StoryStrip labels "Start" / "Change" / "End".
- U4: "Put together: two parts make a total."; "{g} green and {o} orange make {t} in all. {g} + {o} = {t}."; "Move one to orange" / "Move one to green"; "Try other green and orange splits. The total stays the same."; "Know the total and one part? Start with the total. Take away the part."; "Compare: line them up. Find the extras."; "Say it": The gap / More than / Fewer than; "{B} has {n}. {S} has {m}. The gap is {d}." + "{B} has {d} more. {S} has {d} fewer."; "{S} has {m}. {B} has {d} more than {S}. So {B} has {m} + {d} = {n}."; "{B} has {n}. {S} has {d} fewer than {B}. So {S} has {n} − {d} = {m}."; "Lily and Ben have the same. The gap is 0."
- U5: modes "Within 10" / "Past 10" / "Three numbers"; steppers "First number"/"Second number", "Bigger number"/"Smaller number", "First"/"Second"/"Third"; "{a} + {b} = {sum}. Start at {big}, the bigger number. Count on {small}: …" / "Adding 0 keeps {n}."; "To take away, think addition. For 12 − 8, think: 8 and what make 12?"; "{x} + {y} = 10. Then 10 + {z} = {t}." / "No two make 10 here. Add any two first. The total is {t}."; "Move the numbers around" (button); "Move the numbers around. The total stays {t}."
- U6: "= means the same as. Both sides must have the same amount. Try to make them match."; steppers First / Second / Third / Fourth; "Same! {a} + {b} = {c} + {d}. Both sides are {t}." / "Not the same. {t} ≠ {u}. Change the numbers until both sides match." / "{a} + {b} = {c} + ☐. What goes in the box?"; "Hide a number in a box" / "Show the fourth number" / "Find it"; "Flip"; "The total can be on either side."

### Goals and Key Ideas — exactly the E1-07 rewrites (U2 bigger/smaller wording); unit titles "Making Ten", "Fast Facts to 20", "Equal Sign and Number Sentences".

### Practice templates (new or changed; {n} = number, {P} = name, {he} = pronoun)
- U1: "{a} + {b}. Which number do you start at?" / hint "Start at the bigger number." / "Start at {a}. It is bigger." / "Start at {big}. It is bigger. You count less."; "Count on from {a}. What do you say first?"; "Count on {b} from {a}. Where do you land?" / hint "Say {b} numbers after {a}."; "Find {s} − {k} by counting back. You will go below 10."; "Count back {k} from {s}. Say the numbers." (boxes) / hint "Count back one at a time. Don't say {s}." / Show me "Start at {s}. Count back {k}: …"; "So {s} − {k} = ?" / hint "Where did you stop?" / Show me "You said …. You stopped at {r}."; wrap-ups "{a} + {b} = {t}. Starting at {big} was faster." / "{s} − {k} = {r}. You went below 10."
- U2: "Find {x} + {y}. Make a ten." / "{x} + {y}. Which number do you break apart?" / "How many more does {big} need to make 10?" / "So {x} + {y} = ?" / Show me "{big} fills {big} boxes. {g} boxes are empty." and "{big} and {g} make 10. {r} more is {t}."; "Find {s} − {k}. Get to 10 first." / "How many do you take away to get to 10?" / "{k} is {g} and how many more?" / Show me "{g} is/are gone. Take {r} more from 10. {t} are left."; Same total: "{a2} is {k} more/less than {a1}. What happens to the other number?" / "It gets smaller by {k}" / "It gets bigger by {k}" / "It stays the same" / "{a1} + {b1} = {a2} + ☐. What number goes in the box?" / "Now {a3} + ☐ = {t}. What number goes in the box?" / Show me "{a1} + {b1} = {t}. Move {n} over: {a3} + {b3} = {t}."
- U3: stories "{P} had {n items}. Then {he} {got} {c} more. How many {items} does {P} have now?" / "{P} had {n items}. {He} {got} some more. Now {he} has {n items}. How many did {P} {get}?" / "{P} had some {items}. Then {he} {got} {c} more. Now {he} has {n items}. How many did {P} have at the start?" and the three Take From mirrors ("…Then {he} {gave away} {c}. How many {items} does {P} have left?"; "…{He} {gave away} some. Now {he} has … How many did {P} {give away}?"; "…Then {he} {gave away} {c}. Now {he} has … at the start?"); steps "What is missing?" (hint "Which number does the story not tell?"), "Which one matches the story?" (hint "Act it out. Does the number go up or down?", explain "{sentence} matches the story."), answer hints "Start with {s}. Count on {c}." / "Count on from {s} to {r}." / "{He} {got} more. To find the start, take those away." / "Start with {s}. Count back {c}." / "Count back from {s} to {r}." / "{He} {gave away} some. To find the start, add them back."; Show me lines per the C1-06 pattern.
- U4: "{P} has {a} green buttons and {b} orange buttons. How many buttons does {P} have in all?"; "{P} has {t} {items}. {a} is/are {partA}. The rest are {partB}. How many are {partB}?"; "{P} has {t} {items}. Some are {partA}. Some are {partB}." + "Say {g} is/are {partA}. How many are {partB}?" / "Now say …"; compare stories with singular counts; "{A} has {n items}. {B} has {d} more than {A}. How many {items} does {B} have?" / "{A} has {n items}. {B} has {d} fewer than {A}. …"; steps "What is missing?" (the total / a part), "Which one matches the story?" / "Which one finds the answer?" (hint "Act it out. Do you put together or take away?"); hints "Put the two parts together." / "Start with the total. Take away the part." / "Line them up. Count the extras." / "Start with the bigger number. Take away the smaller one." / "{B} has {d} more. Count on {d} from {n}." / `"Fewer" means {B} has less.`; Show me "Match them up. Count the extras: 1, 2, 3." etc.; contexts: Jake's cards big/small, Liam's stickers shiny/plain.
- U5: titles "Fast facts" / "Three numbers"; hints "Count on from the bigger number." / "Fill the ten first." / "Count back." / "Take away 0. What is left?" / "Start at {k}. Count on to {s}." / "Use the number you just found." / "{a} + {b} = {s}. Use the same numbers."; steps "{s} − {b} = ?" / "☐ + {a} = {s}. What number goes in the box?" / "{r} + ☐ = {t}. What number goes in the box?" / "Think addition: {k} + ☐ = {s}. What number goes in the box?" / "So {s} − {k} = ?"; three numbers "Find {a} + {b} + {c}." / "{P1} picks {n} apples. {P2} picks {n}. {P3} picks {n}. How many apples in all?" (also finds shells / has beads) / "{a} + {b} + {c}. Which two do you add first?" / hint "Add the two that make 10. Then add the last number." / "Add two numbers first. Then add the last one."
- U6: titles "The box comes first" / "Adding on both sides" / "Is it true?" / "Find the missing number"; "What number goes in the box?"; "Now {t} = {c} + ☐. What number goes in the box?"; "Add up the first side: {a} + {b} = ?" / "Add up the other side: {c} + {d} = ?"; "{eq}. Is it true?" (spoken "Is … the same as …?"), "Yes, true" / "No, false"; "Which number is missing?" — the first number / the second number / the total / what is left; hints "Where is the box?", "Count up from {k} to {c}.", "The box is the number you take away.", "{b} went away. Add them back to {c}.", "Do both sides match?", "Add it up. Is it really true?", "The total can come first. Do both sides match?", "Look at both sides. Are they the same?"; explains "… It is true." / "… It is false." / "{t} and {u} are not the same. It is false."

### Test prompts (new or changed)
- U1: "{a} + {b}. Count on. Where do you start?"; "{small} + {big}. Which number do you start at?" (two pools); "{s} − {k}. How many times do you count back?" (two pools); "Count back to find {s} − {k}. You will go below 10."; "{s} − {k}. Count back. Which numbers do you say?"
- U2: "Make a ten. What is {a} + {b}?" (hint "Keep {a} whole. Fill the ten first."); "{x} + {y}. Which number do you break apart?"; "How many more does {a} need to make 10?"; "{s} − {k}. Get to 10 first. How many do you take away first?" (hint "How many are past 10?"); "{s} − {k}. You took away {g} to get to {ten}. How many more do you take away?"; "{s} − {k} = ? Get to 10 first."; "{a1} + {b1} = {a2} + ☐. What number goes in the box?"; "{small} + {big}. Make a ten. What is the total?"
- U3: Practice-style stories (new contexts) + "What is missing?" (3 roles) + "Which one matches the story?"
- U4: Practice-style stories; "Which one finds how many fewer?"; "{A} has {n}. {B} has {m}. Fill in both boxes." → "{A} has ☐ more. {B} has ☐ fewer."
- U5: "Make a ten. What is {x} + {y}?"; "{a} + {b} + {c}. Which two do you add first?"; "{a} + {b} + {c}. Add {a} + {b} first. What is the total?"; "{a} + {b} = ?" (picture); hints as Practice.
- U6: "What does = mean?" (Both sides are the same amount / The answer comes next); "{eq}. Is it true?"; "… What number goes in the box?"; hints per E1-31/E1-15.
- Shell: see E1-32.

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Pass (0 errors) |
| `npx eslint` on every changed file (MG1 folder + KCheck.tsx) | Pass: 0 errors; 30 warnings, all `react-refresh/only-export-components` plus the shell's pre-existing unused-disable warning |
| `npx vite build` | Pass; only the usual chunk-size warning, no per-import warnings |
| Test/unit import check | Pass: no *Test.tsx imports its unit; units only import their Test; shared helper in non-circular `logic.ts` |
| `useRef<…>()` without initializer | None |
| Brute force (scratch, esbuild bundle) — 6,000 draws per Practice bucket (25 buckets) and per Test generator (all exported) | Pass. Every number in prompts/answers/choices 0–20; no clamping; singular/plural, is/are, "did + base verb" clean; no later-grade words; no slash fractions; unit Tests 10 questions, Module Test 30; U3 Test and Module Test each have exactly 1 start-missing story. Making Ten: break-apart answer is always the smaller number, gap and Show me from the bigger, total 11–18, smaller written first 49.6–50.4%; `makeTenSpeedNumberQuestion` explanation always from the bigger. Sentence choices: right one stands for the answer, both wrong ones don't and need no number below 0, right position ≈ 1/3 each. Three numbers: exactly one pair makes 10 whenever the pick is asked. U6 Yes/No 50.3% / 49.7%. Three remaining flags are expected: U6 Yes/No final steps have no `showMe` (pick step), the "n = n" kind has no typed step (difference 1), and "3 and 1 are not the same" (numbers, not a count). Sample sentences printed per template and read. |
| `node scripts/english-check.cjs --grade 1` on the shell + lab folder | 501 strings, 24 flagged (was 290 of 569). Left on purpose: 13 "whole" (the approved "keep the bigger number whole" / number-bond wording), 2 start-unknown prompts (User decision 2), "What does = mean?" (E1-03), "How many in all?", the E1-07 goal "Solve stories where some are added or taken away." (passive, the agreed rewrite), and 3 "long" hits that are the script joining separate Explore lines. |
| Browser, iPad 820×1180 touch, temporary harness, speech stubbed | **All 6 CFUs, all 33 questions** answered wrong ×2 (×3 when possible) then right: one question (one number pad) on screen at a time; nudges and named reasons never state the answer; 27 of 27 questions that can reach a 2nd miss showed "Look here!" after it; the tap spoke its line, lit the right spot with the arrow (mode switch included: cob-back, mt-sub, atf-missing, flu-pair, flu-make-ten, eq-missing); the button stayed through the 3rd miss, which showed the worked picture + "Watch…" line; the right answer cleared the button and all lit spots. Practice locked before each CFU, open after; the passed CFU stayed on screen until leaving Explore, then closed. Practice help ladder (U3, U5, U6): picture before a try = given numbers / the fact written big; after a wrong try = frames with the bigger number's empty boxes lit or the crossed-out picture, no answer numeral; Show me read the new line, "Got it" gray while held; finish → "Solved, with help" + "Try one like it". MK2 Making 10 Q1 (no `look`): 2nd miss → "Watch: the empty boxes fill in. 6 and 4 make 10.", no pointer (unchanged). Console: one 404 (harness favicon), no React errors. |

Screenshots (scratchpad, not in the repo): `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\4a0a5ada-0427-4375-a535-7a7815b05751\scratchpad\shots\` — e.g. `u1-q2-miss2.png`, `u1-q2-lookhere.png`, `u1-q2-miss3-show.png`, `u2-q3-miss2.png`, `u3-q3-miss3-show.png`, `u3-q2-ask-narrow.png`, `u6-q5-lookhere.png`, `explore-u2-same-total.png`, `explore-u3-missing-shown.png`, `explore-u4-compare.png`, `explore-u5-past10.png`, `explore-u6-box-found.png`, `practice-u5-r0-ask.png`, `practice-u5-r0-wrong1.png`, `practice-u3-r2-wrong1.png`, `mk2-q1-miss2.png`. Fixed after looking: the StoryStrip wrapped "End" onto a second row inside a CFU picture (slots narrowed), and the "Same total" default (4 + 9) started with "Move one over" grayed out (now 6 + 5).

Not run this round: dark mode, a real iPad (iOS speech, touch), every Practice bucket's full help-ladder walk (3 types walked; the rest checked by the brute-force render of every visual state).

## 6. Noticed, not fixed
- **Read-to-me toolbar overlap:** the fixed bottom toolbar covers part of the number pad / hint when the active step sits low on the screen (`practice-u3-r2-wrong1.png`, `explore-u4-compare.png`). Shared shell/toolbar layout, all K–1 labs.
- **Two-button CFU picks can't show their pointer** (U1 Q3, U2 Q1, U4 Q2, U6 Q1/Q2/Q4): one wrong pick leaves one button. Wired, never reached — by design of PickCheck.
- **CFU title:** `CheckSequence` says "Show what you know!" (shared, MK1–MK4) rather than E1-03's "Let's check! Answer these to open practice."
- **U3 stories are 3 sentences + the question** for change/start-missing stories (start, change, now) — over grade-1.md's "1–2 sentences + the question"; the old comma-joined versions were 2 longer sentences.
- **U2 Test `wrongAddendChoiceQuestion`** always writes the smaller number first, so its answer is always the first number written; Practice now mixes the order.
- **U1 going-below-10** can ask for up to 9 "say the numbers" boxes (e.g. 18 − 9).
- `AddToTakeFromWordProblemsTest.tsx` keeps `takeFromStartKeywordTrapChoiceQuestion` / `takeFromStartNumberQuestion` exported but unused (range-fixed).
- `_planning/reviews/LAB_STATUS.md` not updated (Stage 6 job).
- The proposed rule changes in `round-1-merged.md` (builder, grade-1.md, english-check.cjs) were not applied (they wait for Stage 6). The KCheck `look` / 3rd-miss show-it convention should go into `math-lab-builder.md`'s K–1 CFU section at the same time.
