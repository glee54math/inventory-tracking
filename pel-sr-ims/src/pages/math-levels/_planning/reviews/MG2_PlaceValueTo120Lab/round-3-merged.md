# MG2 Place Value to 120 — round 3 merged fix list (final round)

- Lab: MG2 `PlaceValueTo120Lab` · Grade 1 · K–1 band
- Round 3 · 2026-11-17 · Inputs: `round-3-curriculum.md` (0 B · 0 Maj · 3 Min · 2 Pol; round-2: 19 Fixed, 1 Fixed-with-new-problem), `round-3-english.md` (0 B · 0 Maj · 1 Min · 1 Pol; round-2: 12/12 Fixed)
- **Stopping rule met:** no Blocker or Major in either round-3 report, and round 3 is the maximum. The fixes below are applied without another review round.
- Decisions: Fix 7 · Skip 1

## Fix list

| ID(s) | Sev | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| C3-42 | Minor | ComparingTwoDigitNumbers.tsx equal ("Sticks and cubes") bucket; ComparingTwoDigitNumbersTest.tsx equal item | Typed step copyable / "=" right 2 in 3 | Fix | Blocks don't match the number half the time (1 in 2), Practice and Test. Re-run the brute check: "=" ≈ 50%. |
| C3-43 | Minor | AddingTwoDigitOneDigit.tsx Practice ones step Show me + CFU item 2 Show me | Show me counts all cubes from 1 | Fix | Use the Explore count-on picture (`countFrom`): starting cubes labeled at once, new cubes labeled on; say "8. Then 9, 10, 11, 12, 13." `showMeHoldMs` matches the count. |
| C3-44 | Minor | AddingTwoDigitOneDigit.tsx Explore default (27 + 6) vs CFU item 2 (13 ones) | Look-here destination shows the CFU's answer | Fix | Explore default 27 + 5; re-confirm no CFU item matches an Explore default or preset. |
| E3-49 | Minor | ComparingTwoDigitNumbers.tsx:401 unit title | "Two-Digit" left in a student-facing title | Fix | "Comparing Numbers". Grep titles/goals/headers (not just generators) for "digit". |
| U4 wrap-up (E3 out-of-lane) | Minor | TenMoreTenLess.tsx 10-more wrap-up | "88, 98, 108. Only the tens changed." is false past 100 | Fix | Keep 10-more starts so the result stays ≤ 99 in buckets whose wrap-up says "only the tens changed", or build the wrap-up from the values (no "only the tens" when result ≥ 100). |
| E3-50 | Polish | AddingTwoDigitOneDigitTest.tsx `regroupWhyQuestion` | "make" two senses; "The ones make 0" edge | Fix | Choices "There are 15 ones" / "There are 9 ones" / "There are 5 ones" (built from values, distinct, only the right one true). |
| C3-46 | Polish | CountingTo120Test.tsx, TenMoreTenLessTest.tsx | Rare near-duplicate Test pairs (~2–3%) | Fix | Separate the number ranges so the pairs can't collide. |
| C3-45 | Polish | AddingTwoDigitOneDigitTest.tsx "28 + 1" | Distractor equals the start number | Skip | Checker: false, names a real error, no change needed. |

## Still waiting on the user (unchanged)
E2-37 (☐ spoken "blank" — shared mathSpeech.ts, same as MG1 E2-38) · KCheck CheckSequence title · Test engine reading signs aloud · C1-14 Test item (tenVsHundredChoiceQuestion) · C1-15 · passScore 9/10.
