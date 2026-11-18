# MG1 Addition & Subtraction Within 20 — round 3 merged fix list (final round)

- Round 3 · 2026-11-17 · Inputs: `round-3-curriculum.md` (0 B · 0 Maj · 3 Min · 4 Pol; round-2 rows 25/25 fixed), `round-3-english.md` (0 B · 0 Maj · 4 Min · 6 Pol; round-2 items 14 fixed, 1 fixed-with-new-problem → E3-51)
- No Blocker/Major → after these fixes the review stops (3-round limit reached anyway). Decisions: Fix 15 rows · Skip 0 · Asked user 2 (answered).
- Exact evidence and rewrites are in the two source reports under each ID.

## User decisions (2026-11-17)
1. **C3-01 → keep tried buttons tappable** on KCheck picks that have a `look` pointer, until the worked picture (show-it) appears. So the 2nd miss shows "Look here!" with real choices left and the 3rd miss shows the worked picture. Shared KCheck change: applies wherever `look` is set (MG1, MG2); questions without `look` (MK1–MK4) unchanged — verify one MK lab.
2. **C3-07 → no retry lock for optional types.** A miss on an `optional` Practice type (U4 "Challenge") does not lock the student into it; still no stars/mastery. Implement via the `optional` flag so it only affects optional types.

## Fix list

| ID(s) | Sev | Problem | Decision | Agreed change |
|---|---|---|---|---|
| C3-01 | Minor | 3-choice picks: pointer only when one button is left; show-it unreachable | Fix (user) | User decision 1. |
| C3-02 | Minor | U3 Q3's Look-here line "Start at 5. Count on to 8." shows Q3's answer (5) | Fix | U3 Explore defaults start 3, change 6 (check no other CFU answer appears at any pointer spot). |
| C3-03 | Minor | U6 CFU equation pictures wrap on iPad ("3" drops under the 6), incl. twin and likely Q3 | Fix | Narrower ten-frames + no-wrap row; screenshot at 820×1180 to confirm. |
| E3-51 | Minor | "Show me" says "Lily has 6 and 3 more" in a Ben-has-6 story (`PutTogetherCompareWordProblems.tsx:535`, `:616`) | Fix | "Ben has 6. Lily has 3 more: 7, 8, 9." (names from the story). |
| E3-52 | Minor | "Challenge: fewer stories" reads as "not as many stories" | Fix | "Challenge: tricky compare stories". |
| E3-53 | Minor | U4 CFU Q2 five sentences; "Some are…" then "2 are…" | Fix | "Jake has 6 cards. 2 are sports cards. The rest are animal cards. How many are animal cards?" (Q3 follow-up stays). |
| E3-54 + C3-04 | Minor/Polish | U6 Q2: correct "No" praised with "Yes!"; wrong-tap line "Are they the same?" before the twin; twin is true so always-Yes passes; voice reads "2." before the twin | Fix | Praise "Right! 2 + 3 is 5, not 6."; wrong-tap line "Add up each side. Try this one."; twin false ("7 = 4 + 2"); Q2 pointer to the "add up each side" spot; no "2." read before the twin. |
| C3-05 | Polish | U1 Q1 and Q3 both answer 8 (8 + 3, 3 + 8), Q1 stays on screen | Fix | Q3 → "3 + 7" (answer 7); keep the bigger-number trap. |
| C3-06 | Polish | Challenge step-1 hint is generic | Fix | Hint addresses fewer-means-add (e.g. "Ben has fewer. So Lily has more."), per report. |
| E3-55 | Polish | "Type the number you start at / break apart" | Fix | "Where do you start?" / "Which number do you break apart?" (still typed). |
| E3-56 | Polish | Passive "6 can be split many ways"; "Count the rest: 7" | Fix | Per report. |
| E3-57 | Polish | U3 title style | Fix | "Add To and Take From Stories" (update anywhere the title shows). |
| E3-58 | Polish | Shell "Complete the activity above to unlock practice problems." | Fix | MG1 shell only, per report (other shells: note for their own reviews). |
| E3-59 | Polish | U5 "12 − 8: 8 and how many make 12?" runs together when spoken | Fix | Per report. |
| E3-60 | Polish | U6 Q1 "Which one is true?" vs "the same as" | Fix | Per report (e.g. spoken "Is 6 the same as 6?" style). |

## Verification the fixer must run
tsc, eslint, vite build; brute force any changed generator; english-check grade 1; Playwright iPad-size: a 3-choice pick (2nd miss → "Look here!" with 2+ buttons live, 3rd miss → worked picture), U6 Q2 + twin (no wrap, false twin), challenge miss does not lock; one MK lab and MG2's KCheck unchanged/as intended.

## Open after this round (for summary.md)
None planned beyond the fixer's own leftovers. Carry forward: real-iPad check (speech, touch, the headless "Target crashed" note from round 2), MG11's own sticky hover rule, other lab shells' "Complete the activity above…" line.
