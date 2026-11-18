# MG1 Addition and Subtraction Within 20: CFU "Look here" pointers (early-grade pilot)

**Summary (updated 2026-11-17, review round 3, final):** the 6 CFUs use the K–1 design (`shared/components/KCheck.tsx`: one short question at a time, typed answers on the number pad, big pick buttons). Every question passes its own `look` target to `TypeCheck` / `PickCheck`; KCheck runs the shared `useCfuPointers` + `<StuckBox early>` inside the question. **Miss order (user decision):** 1st miss → a few-word nudge; **2nd miss → the "Look here!" button** (spoken line, arrow, the spot stays lit until the answer is right); **3rd miss → "show it"** (the worked picture). Questions without `look` (MK1–MK4) keep show-it on the 2nd miss.

**Round 2 (C2-01): no CFU has a plain two-button pick any more.** U1 Q3 and U2 Q1 are typed. U4's "Is there just one way?" pick is gone (a second typed split replaces it). U6 Q1 has three picture choices. U6 Q2 (now false) and Q4 keep Yes/No but pass the new optional `twin` to `PickCheck`: the first wrong tap swaps in a same-idea question with new numbers (both buttons stay live), a wrong tap on the twin is the 2nd miss ("Look here!"), and one more is the 3rd (show it). **Round 3 (C3-01, user decision): tried buttons stay tappable on every pick that has a `look` pointer**, until show-it. So three-button picks (U1 Q5, U3 Q1/Q4/Q5, U4 Q6, U5 Q1, U6 Q1) show "Look here!" on the 2nd miss with all three buttons live, and the 3rd miss brings the worked picture (then the tried buttons lock). Shared KCheck: applies to MG1 and MG2 (both pass `look`); MK1–MK4 pass no `look` and are unchanged (MK2 re-checked). U6 Q2's twin is now false too (C3-04), and the twin's prompt is read without the question number.

CHANGED / NEW in the table = round 2; **R3** = changed in round 3.

33 questions; 24 typed (73%). Per unit: U1 4/5, U2 6/6, U3 3/6, U4 5/6, U5 3/4, U6 3/6 (all ≥ 40%).

## Question → spot
"(mode)" = the spot is only in that Explore mode; the pointer switches to it (`useLookHereRequest`). CHANGED / NEW = round 2; R3 = round 3.

| Unit | Q | Spot id | Key line | Spoken line |
|---|---|---|---|---|
| 1 Counting On/Back | 1 "8 + 3. Count on. Where do you start?" (typed) | cob-keep | "You did not start over. You kept going from {start}." | Look here. Start at the number you have. |
| | 2 "Count on 3 from 8. Where do you land?" (typed) | cob-count (Count on) | "Count one more" row + CHANGED "You counted on N times from S. Now you are on C." (before the first tap: "You are on S. Count one more.") | Look here. Count how many more. |
| | 3 R3 "3 + 7. Where do you start?" (typed, 7; was "3 + 8. Type the number you start at.", same answer as Q1) | cob-bigger (Count on) | "Start at the bigger number. For 2 + 9, start at 9 and count on 2." | Look here. Start at the bigger number. |
| | 4 "12 − 3. Count back 3 from 12. Where do you land?" (typed) | cob-back (Count back) | "Count one back" row + "You counted back N times from S. Now you are on C." | Look here. Count back one at a time. |
| | 5 "13 − 4. How many times do you count back?" (pick 3 / 4 / 5) | cob-back-rule (Count back) | CHANGED "To take away 5, count back 5 times. Say 5 numbers." (4 was Q5's answer) | CHANGED Look here. One hop for each one you take away. |
| 2 Making Ten | 1 R3 "6 + 9. Which number do you break apart?" (typed, 6; 9 drawn in the bigger number's color) | mt-keep (Making ten) | "Keep the bigger number whole. It is closer to 10. Break apart the smaller number." | Look here. Which number is closer to 10? |
| | 2 "8 + 6. How many more does 8 need to make 10?" (typed) | mt-bond (Making ten) | "Fill the ten first. Then add what is left." | Look here. Fill the ten first. |
| | 3 "So 8 + 6 = ?" (typed) | mt-bond | (same) | Look here. Fill the ten first. |
| | 4 "7 + 5. Make a ten. What is the total?" (typed) | mt-any (Making ten) | "Try new numbers. Making ten works every time." | CHANGED Look here. Fill the ten. Then add the rest. |
| | 5 "13 − 5. Get to 10 first. How many do you take away first?" (typed) | mt-sub (Get to 10 first) | "Take away to land on 10 first. Then take away the rest." | Look here. Get to 10 first. |
| | 6 "13 − 5 = ?" (typed) | mt-sub | (same) | Look here. Get to 10 first. |
| 3 Add To / Take From | 1 "Sam had 6 apples. He picked 5 more. What is missing?" (pick the start / the change / the end; CHANGED picture colors by role: start a, change b, end c) | atf-roles | "A story can hide the start, the change, or the end. Which one is missing?" | Look here. Which one is missing? |
| | 2 "How many apples does Sam have now?" (typed) | atf-story | "{s} + {c} = {e}. It went up. This is an Add To story." | Look here. Start, then add more. |
| | 3 "…Now he has 11. How many did he pick?" (typed) | CHANGED atf-missing-change | The "What is missing?" picture (Start / Change / End boxes, the missing one dashed with "?", "Show" fills it by counting). CHANGED key line, with the picture's numbers in the order you use them: Add To "Change missing? Start at {start}. Count on to {end}." (Take From: "…Count back to {end}."). The request switches Explore to Add To, change missing. | CHANGED Look here. Count on to the end. |
| | 4 "Ana had 9 shells. She lost some. Now she has 6. What is missing?" (pick; CHANGED colors: 9 start, 6 end) | atf-roles | (as Q1) | Look here. Which one is missing? |
| | 5 "Leo had some stickers. He got 4 more. Now he has 11. What is missing?" (pick; CHANGED colors: 4 change, 11 end) | atf-roles | (as Q1) | Look here. Which one is missing? |
| | 6 "How many stickers did Leo have at the start?" (typed) | CHANGED atf-missing-start | Same picture, start missing. CHANGED key line: Add To "Start missing? Start at {end}. Take away {change}." (Take From: "…Add back {change}."). The request switches Explore to Add To, start missing. Show line CHANGED "Watch: start at 11. Take away 4. 7 are left." | CHANGED Look here. Start at the end. Take away. |
| 4 Put Together / Compare | 1 "Mia has 4 green buttons and 5 orange buttons. How many buttons in all?" (typed) | ptc-whole | "{g} green and {o} orange make {t} in all. {g} + {o} = {t}." | Look here. Put the two parts together. |
| | 2 R3 "Jake has 6 cards. 2 are sports cards. The rest are animal cards. How many are animal cards?" (typed, 4) | ptc-part | "Know the total and one part? Start with the total. Take away the part." | Look here. Start with the total. Take away the part. |
| | 3 NEW "Now 5 are sports cards. How many are animal cards?" (typed, 1; R3 praise "Yes! You can split 6 many ways.") | ptc-ways | "Try other green and orange splits. The total stays the same." + "Move one to orange / green" buttons | Look here. Try other splits. |
| | 4 "Lily has 9 crayons. Ben has 5. How many more crayons does Lily have than Ben?" (typed) | ptc-diff | Lined-up compare rows (extras circled) with a "Say it" switch (The gap / More than / Fewer than). Key line (The gap): "{bigger} has {n}. {smaller} has {m}. The gap is {d}."; the request switches to "The gap". | CHANGED Look here. Line them up. Count the extras. |
| | 5 "How many fewer crayons does Ben have than Lily?" (typed) | ptc-diff | (same) | CHANGED (as Q4) |
| | 6 "Ben has 5 crayons. Lily has 9. Which one finds how many fewer?" (pick 5 − 9 / 9 − 5 / 9 + 5) | ptc-diff | (same) | Look here. Start with the bigger. Take away the smaller. |
| 5 Fast Facts | 1 "4 + 8 + 2. Which two do you add first?" (pick) | flu-pair (Three numbers) | "Look for two numbers that make 10. Add them first." | Look here. Find two numbers that make 10. |
| | 2 "Now add 4 + 8 first. Then add the 2. What is the total?" (typed) | flu-order (Three numbers) | "Move the numbers around. The total stays {total}." | Look here. Try a different order. |
| | 3 "6 + 3 = ?" (typed) | flu-within (Within 10) | "{a} + {b} = {sum}. Start at {big}, the bigger number. Count on {small}: …" | Look here. Count on from the bigger number. |
| | 4 "9 + 7. Make a ten first. What is the total?" (typed) | flu-make-ten (Past 10) | "Past 10? Make a ten first, then add what is left." | Look here. Make a ten first. |
| 6 Equal Sign | 1 R3 "Which one is the same on both sides?" (3 picture choices: 6 = 9 / 6 = 6 / 6 = 3, each with two small ten-frames; spoken "6 is the same as 9") | eq-balance | "= means the same as. Both sides must have the same amount." | Look here. Both sides are the same. |
| | 2 "6 = 2 + 3. Is it true?" (Yes / No; answer No; spoken "Is 6 the same as 2 plus 3?"; R3 praise "Right! 2 + 3 is 5, not 6."; wrong-tap line "Add up each side. Try this one."). R3 twin after a wrong pick: "7 = 4 + 2. Is it true?" (No; praise "Right! 4 + 2 is 6, not 7."). R3 pictures: smaller ten-frames on one line (C3-03) | R3 eq-scale | "Same! … Both sides are 9." / "Not the same. … Change the numbers until both sides match." | Look here. Add up each side. |
| | 3 "7 + 1 = 6 + ☐. What number goes in the box?" (typed) | eq-scale | "Same! … Both sides are 9." / "Not the same. … Change the numbers until both sides match." | Look here. Add up each side. |
| | 4 "8 = 8. Is it true?" (Yes / No; Yes). NEW twin after a wrong pick: "7 = 7. Is it true?" (Yes) | eq-balance | (as Q1) | Look here. Both sides are the same. |
| | 5 "8 + ☐ = 11. What number goes in the box?" (typed; nudge CHANGED "Count on from 8 to 11.") | eq-missing | Box mode: "Hide a number in a box" + "Find it" (counts on until both sides match); CHANGED key "A box can hide a number. What number makes both sides the same?" The request turns box mode on. | Look here. Make both sides the same. |
| | 6 "☐ = 6 + 5. What number goes in the box?" (typed) | eq-either-side | (as Q2) | Look here. The total can go first. |

The non-early label (`ExploreTarget.label`) is used only as the button's accessible name here.

## Explore defaults (never a CFU's numbers, and nothing they reveal is a CFU answer)
| Unit | Default |
|---|---|
| 1 Counting | start at 6; the count-back rule line uses 5 (CHANGED from 4, Q5's answer) |
| 2 Making Ten | 9 + 4; Get to 10 first 14 − 6; Same total 6 + 5 |
| 3 Add To / Take From | R3 3 + 6 = 9 (change-missing line: "Start at 3. Count on to 9."; start-missing: "Start at 9. Take away 6."). The old 5 + 3 printed "Start at 5" at Q3's pointer, and 5 is Q3's answer (C3-02). |
| 4 Put Together | 6 green + 7 orange; compare Lily 8, Ben 3 |
| 5 Fast Facts | Within 10: 3 + 5; Past 10: 8 + 5; Three numbers: 3, 5, 7 |
| 6 Equal Sign | CHANGED 6 + 3 = 5 + 4 (total 9; "Find it" reveals 4). The old 5 + 4 = 6 + 3 revealed 3 (Q5's answer); the suggested 5 + 6 = 7 + 4 would print 11 (Q6's answer). |

## Files
- shared/components/KCheck.tsx (round 1: optional `look` on TypeCheck / PickCheck; round 2: optional `twin` on PickCheck, only used with `look`; round 3: with `look`, tried pick buttons stay live until show-it; MK1–MK4 unchanged), shared/components/CfuPointers.tsx, shared/lib/lookHere.ts (unchanged)
- MG1/AdditionAndSubtractionWithin20Lab/units/{CountingOnAndBack, MakingTenAndDecomposing, AddToTakeFromWordProblems, PutTogetherCompareWordProblems, FluencyFactsWithin20, EqualSignAndEquations}.tsx; diagrams/StoryStrip.tsx, diagrams/ThreeGroups.tsx

## Verification
- Round 1 (2026-11-17): every question answered wrong, wrong, (wrong), right at 820×1180 with touch; 27 questions reached "Look here!"; two-button picks could not (fixed in round 2).
- Round 2 (2026-11-17): see `_planning/reviews/MG1_AdditionAndSubtractionWithin20Lab/round-2-fixes.md` → Verification.
- Round 3 (2026-11-17): 3-button picks U1 Q5, U3 Q4, U6 Q1 (and MG2 Comparing Q1): 2nd miss → "Look here!" with all 3 buttons live; 3rd miss → worked picture, tried buttons lock. U6 Q2 twin false, read without "2.". U3 Q3 pointer line "Change missing? Start at 3. Count on to 9.". See `round-3-fixes.md`.
