# MG1 Addition and Subtraction Within 20: CFU "Look here" pointers (early-grade pilot)

**Summary:** all 6 units' CFUs (24 questions, 31 parts) point to Explore after a part's 2nd wrong Check, using the shared `useCfuPointers` + `<StuckBox early>`. 12 short teaching lines added where Explore had nothing. Explore defaults that equalled a CFU's numbers were changed so a pointer never shows an answer. CFU questions and their feedback are unchanged.

## Part → spot
"(mode)" = the spot is only in that Explore mode; the pointer switches to it (`useLookHereRequest`).

| Unit | Q / part | Spot id | Key line (NEW = added) | Spoken line |
|---|---|---|---|---|
| 1 Counting On/Back | Q1 Start counting at | cob-keep | "Notice you never had to start over from 1 — you kept the starting number and just kept going." | Look here. Start at the number you have. |
| | Q1 How many more | cob-count (Count on) | "Count one more" row + "You counted on N times from S, landing on C." (split out of the old paragraph) | Look here. Count how many more. |
| | Q2 Smarter start (3 + 8) | cob-bigger (Count on) | NEW "Start at the bigger number. For 2 + 9, start at 9 and count on 2." | Look here. Start at the bigger number. |
| | Q3 Count back from 12 (3 boxes, one part) | cob-back (Count back) | "Count one back" row + "You counted back N times from S…" | Look here. Count back one at a time. |
| | Q4 T/F counts back = number taken away | cob-back-rule (Count back) | NEW "To take away 4, count back 4 times. Say 4 numbers." | Look here. Count back the number you take away. |
| 2 Making Ten | Q1 Which number to break apart | mt-keep (Making ten) | NEW "Keep the number close to 10 whole. Break apart the other number." | Look here. Keep the number close to 10. |
| | Q1 bond + sentences (one part) | mt-bond (Making ten) | NEW "Fill the ten first. Then add what is left." | Look here. Fill the ten first. |
| | Q2 8 + 6 bond + sentences | mt-bond | (same) | Look here. Fill the ten first. |
| | Q3 T/F works for any fact | mt-any (Making ten) | NEW "Try new numbers. Making ten works every time." (under the number steppers) | Look here. Try new numbers. |
| | Q4 13 − 5 bond + sentences | mt-sub (Bridging through ten) | NEW "Take away to land on 10 first. Then take away the rest." | Look here. Get to 10 first. |
| 3 Add To / Take From | Q1, Q2, Q4 What's unknown | atf-roles | "A story can ask for the start, the change, or the result — read carefully to see which one is missing." | Look here. Which one is missing? |
| | Q1 Answer (result) | atf-story | ten frames + "5 + 3 = 8. The amount grew — this is an "Add To" story." | Look here. Start, then add more. |
| | Q2 Answer (change), Q4 Answer (start) | atf-missing | NEW "Start or change missing? Take the number you know away from the end." | Look here. Take away from the end. |
| | Q3 T/F always the end amount | atf-roles | (as above) | Look here. Which one is missing? |
| 4 Put Together / Compare | Q1 total + answer (one part) | ptc-whole | ten frame + "6 + 7 = 13 in all." | Look here. In all means put them together. |
| | Q2 How many ways | ptc-ways | "Try different green/orange splits that still add up to the same total — notice there's more than one way." | Look here. Try other splits. |
| | Q2 Animal cards | ptc-part | NEW "Know the whole and one part? Take that part away from the whole." | Look here. Take the part away from the whole. |
| | Q3 more + fewer (one part) | ptc-diff | "The difference is always bigger − smaller…" | Look here. Take the smaller from the bigger. |
| | Q4 which subtraction + answer (one part) | ptc-diff | (same) | Look here. Take the smaller from the bigger. |
| 5 Fluency | Q1 Which pair first (4 + 8 + 2) | flu-pair (Three addends) | NEW "Look for two numbers that make 10. Add them first." | Look here. Find two numbers that make 10. |
| | Q2 T/F any order | flu-order (Three addends) | "Try sliding the numbers around — the total never changes no matter which pair you group first." | Look here. Try a different order. |
| | Q3 Which stays within 10 | flu-within (Within 10/20) | "a + b = sum. This stays within 10. / This crosses past 10 — a within-20 fact." | Look here. Is the total past 10? |
| | Q4 9 + 7 | flu-make-ten (Within 10/20) | NEW "Past 10? Make a ten first, then add what is left." | Look here. Make a ten first. |
| 6 Equal Sign | Q1 What = means | eq-balance | "The = sign is like a balance scale: both sides must weigh the same." | Look here. Both sides are the same. |
| | Q2 5 = 2 + 3 | eq-either-side | NEW "The total can be on either side. 6 = 4 + 2 is the same as 4 + 2 = 6." | Look here. The total can go first. |
| | Q2 7 + 1 = 6 + 2 | eq-scale | ten frames + "Balanced! … both sides equal 9." | Look here. Add up each side. |
| | Q3 8 = 8 | eq-balance | (as above) | Look here. Both sides are the same. |
| | Q4 8 + ☐ = 11 | eq-missing | NEW "A box can hide a number. Find the number that makes both sides the same." | Look here. Make both sides the same. |

The non-early label (`ExploreTarget.label`, e.g. "Explore: the number bond and the two number sentences") is used only as the button's accessible name here.

## Explore defaults changed (they equalled a CFU's numbers)
| Unit | Before | After |
|---|---|---|
| 1 Counting | start at 8 (CFU Q1 is 8 + 3) | start at 6 |
| 2 Making Ten, Bridging | 13 − 5 (= CFU Q4) | 14 − 6 |
| 3 Add To / Take From | 6 + 5 (= CFU Q1) | 5 + 3 |
| 4 Put Together | 4 green + 5 orange (= CFU Q1); compare 9 and 5 (= CFU Q3/Q4) | 6 + 7; compare 8 and 3 |
| 5 Fluency | 4, 3, 2 (4 + 3 = CFU Q3) | 3, 5, 7 (3 + 7 makes the ten) |
| 6 Equal Sign | 7 + 1 = 6 + 2 (= CFU Q2) | 5 + 4 = 6 + 3 |

## Files
- shared/lib/lookHere.ts (arrow option, `useLookHereRequest`, waits for a mode switch), shared/components/CfuPointers.tsx (new), shared/components/CfuQuestion.tsx (DropdownQuestion now uses the hook; same behaviour)
- MG1/AdditionAndSubtractionWithin20Lab/units/{CountingOnAndBack, MakingTenAndDecomposing, AddToTakeFromWordProblems, PutTogetherCompareWordProblems, FluencyFactsWithin20, EqualSignAndEquations}.tsx

## Verification
tsc -b pass; eslint 0 errors (warnings are the existing fast-refresh kind); vite build pass. Playwright at 820×1180 touch, with a temp harness (since removed):
- U1 Q1: miss 1 → no button; miss 2 (both wrong) → "Start: Look here!" + "How many: Look here!"; each tap says its line, lights cob-keep / cob-count with the arrow; fixing Start removes its button and its light; fixing both → no button, nothing lit, green feedback.
- U1 Q3 (from Count on mode): tap → Explore switches to Count back, cob-back lit with arrow, spoken.
- U2 Q4: two wrong Checks → button → switches to Bridging through ten, mt-sub lit; right answer clears it.
- U5 Q1: repeat Check with the same answer is not counted; 2nd real miss → button → switches to Three addends, flu-pair lit; right clears.
- All 24 spot ids found in their units (after the mode request).
- MG10 U1 Q1 re-check: unchanged ("a./b. Look here first: …" lines after miss 2, both spots lit, fixing b leaves only a, all right clears).

## Not done / notes
- The CFUs still use the older MG1 layout (all 4 questions at once, true/false pickers, long feedback), not the KCheck one-at-a-time design. Out of scope here.
- Parts in MG1 re-grade live after a Check (existing behaviour), so a part's button also hides as soon as its box turns right (`rightNow`).
