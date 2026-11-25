# MK2 Addition, Subtraction & Teen Numbers: round 3 fixes

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` · Grade K, K–1 band · **Round:** 3 (final) · **Date:** 2026-11-21
- **Source of truth:** `round-3-merged.md` (12 rows, 14 findings)

## 1. Summary

**12 Fixed · 0 Partly fixed · 0 Needs decision · 0 Not fixed.**

- `tsc`, eslint (0 errors), the full `vite build` and the generator brute force all pass on the final code.
- New browser walk: **72 of 72 passed.**
- Round 2 browser regression: **84 of 90 passed.** All 6 misses are old checks that expect wording or behavior this round changed on purpose (section 5).
- No `shared/` file or other lab was edited. Nothing was staged or committed. D5 was not applied or emulated.

## 2. Item table

Paths are relative to `MK2/AdditionSubtractionAndTeenNumbersLab/units/`.

| # | ID(s) | Status | What changed | Where |
|---|---|---|---|---|
| 1 | C3-60, E3-68 | Fixed | The first repeat or 0 in a problem is not a miss. Each later one is, so the example row and then Show me open. The step's own line stays on screen. New 0 and repeat wording | `OwnWay.tsx`, `words.ts` (`ownWayReply`) |
| 2 | E3-65, C3-61 | Fixed | Take-away hints use fingers. Count-on hints replace "the new row" lines. Same parts: "Make two groups. Make them the same." | `PuttingTogetherAndTakingApart.tsx`, `WordProblemsWithin10.tsx`, `DecomposingNumbers.tsx` |
| 3 | E3-66, C3-61 | Fixed | Hints no longer name dots that aren't drawn. Generated finger lines use `count()`. 0 lines kept | `WordProblemsWithin10.tsx`, `DecomposingNumbers.tsx`, `FastFactsWithin5.tsx`, `TeenNumbers.tsx` |
| 4 | E3-67 | Fixed | "Are 0 and 1 the same?" | `FastFactsWithin5.tsx` |
| 5 | E3-69 | Fixed | "Find a new way to make 5." before a miss. The hint changes to "Look at the new row. Count both colors." even if already open, and the voice reads the new line. Done inside MK2 | `OwnWay.tsx`, `words.ts`, `DecomposingNumbers.tsx` |
| 6 | C3-62 | Fixed | Add uses `startFor`, including the first `useState`. The second round opens on 1 + 3 | `FastFactsWithin5.tsx` |
| 7 | C3-63 | Fixed | In `wrong` mode, CFU Q4 draws two rows of 4 in one color with a gap, and says "Look: two groups. Count one group." | `DecomposingNumbers.tsx` |
| 8 | E3-70 | Fixed | At Number 2: "Try a bigger number." | `DecomposingNumbers.tsx` |
| 9 | C3-64 | Fixed | The Unit 6 Test's three "how many ones" items use three different teen numbers. The Module Test has only one such item, so it is not affected | `TeenNumbersTest.tsx`, `labHelp.tsx` (`noRepeats` `sameIdea`) |
| 10 | C3-65 | Fixed | The dots' wrapper is sized to the dots | `FastFactsWithin5.tsx`, `diagrams/SplitGroup.tsx`, `diagrams/index.ts` |
| 11 | E3-71 | Fixed | The two color stories draw from stickers, crayons, marbles, balloons and blocks | `WordProblemsWithin10.tsx` |
| 12 | E3-72 | Fixed | "They have the same number." in both places | `WordProblemsWithin10.tsx` |

**Two small choices the list left open:**

- **Row 3, `0 + ☐ = 3`:** the merged list says a known part of 0 uses the 0 wording but gives no exact line, so this uses "You have 0. Do you need more?"
- **Row 7, typing 8 on Q4:** the old "Make two groups." was no longer true once two groups are drawn, so it now says "That is all of them. Count one group."

## 3. Changed files

No shared files changed, so no other lab is affected.

- **Units:** `DecomposingNumbers.tsx`, `FastFactsWithin5.tsx`, `OwnWay.tsx`, `PuttingTogetherAndTakingApart.tsx`, `TeenNumbers.tsx`, `TeenNumbersTest.tsx`, `WordProblemsWithin10.tsx`, `labHelp.tsx`, `words.ts`
- **Diagrams:** `SplitGroup.tsx`, `index.ts`
- **Planning:** `_planning/Grade-K/AdditionSubtractionAndTeenNumbersLab/vocabulary.md`

## 4. New or rewritten student text

- **Write another way:** "Yes, that makes 5. Use new numbers." (kept) · "Yes, that makes 5. No 0 this time." · "No 0 this time. Make 5." · "Find a new way to make 5."
- **Units 1, 2:** "Show 6 fingers. Put 3 down." · "Start at 2. Count on to 7 on your fingers." · "They have the same number."
- **Unit 3:** "Start at 3. Count on to 5 on your fingers." · "Make two groups. Make them the same." · "Look: two groups. Count one group." · "That is all of them. Count one group." · "Try a bigger number."
- **Unit 5:** "Show 2 fingers. Show 1 more." · "Show 3 fingers. Add none." · "Show 1 finger. Put 1 down." · "Show 1 finger. Show 1 more." · "Start at 1. Count on to 3 on your fingers." · "You have 3. Do you need more?" · "You have 0. Do you need more?" · "Are 0 and 1 the same?"
- **Unit 6:** "Start at 10. Count on to 16 on your fingers."

## 5. Verification (final code)

| Check | Result |
|---|---|
| `tsc -p tsconfig.app.json` | Pass, 0 errors |
| eslint on `MK2/` | Pass, 0 errors, 18 warnings (17 before; the new one is the `splitGroupWidth` export beside a component) |
| `vite build` (full app, output in the scratchpad) | Pass, with no stub for MK3 |
| Test/unit import check | Pass |
| Brute force | **No failures:** 312,000 Practice problems, 140,000 Test sittings, 1,800,000 Test questions |
| Hints before a try (21,600 step comparisons) | Every hint is true of the picture drawn. Each finger and count-on line works out to the step's answer. No "1 fingers", "Put 0 down", "Start at 0" or "Show 0" |
| Unit 6 Test | No teen number repeated across the three "how many ones" items |
| `moduleTestStars` | Correct at 0, 9, 10, 18, 19, 21, 22, 24, 25, 27, 28, 30. `passScore` 24 |
| `english-check --grade K` | 6 flags of 254 strings, none on new text |
| New browser walk, 820×1180, touch | **72 of 72.** Whole `OwnWay` ladder, hint changing while open, hints before a try in Units 1, 2, 3, 5, 6, CFU Q4 picture, Unit 5 re-check, Explore lines, 0 spot, no page errors |
| Round 2 browser regression | **84 of 90.** D4 retry, Challenge numbered extras and the pad on all 63 typed Test questions at 5 sizes pass, including every key on screen at 1180×820 and 1366×768 |

**The 6 regression misses are expected.** Each old check looks for text or behavior replaced by rows 1, 3 or 5, and the new walk covers the replacement:

1. U5 `n + ☐ = n` hint (old line)
2. U5 `n − n` hint (old line)
3. U3 "Put dots in both parts." shown
4. U3 "Put dots in both parts." spoken
5. U3 swapped pair "no miss": it now follows a 0 in the same problem, so it is correctly the second such try
6. U3 hint before a try (old line)

**One intermittent result:** the first regression run also missed "Practice pad beside its boxes" at 768×1024. It passed on the rerun and in 12 of 12 separate normal-speed trials at that size. The cause was not identified. That run had demo timers sped up 8×.

**Screenshots:** `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\1e6785ee-43bc-449f-859a-a32e5cfac3e8\scratchpad\r3fix\shots`

**Not checked:**

- Real iPad speech, touch and Safari layout, and real students. Speech was stubbed.
- Dark mode for the new Q4 picture. It reuses the same dots and colors.
- Real-speed pacing of the demos. Browser runs sped timers up 8×, and no demo timing was changed this round.

## 6. Noticed, not fixed

1. "Show 3 fingers. Add none." says the answer's number before a try on `n + 0`. This is the agreed E3-66 wording, and the 3 is already in the fact.
2. "You have 0. Do you need more?" is true but gives little direction on `0 + ☐ = 3` until a wrong try brings in the dots.
3. At 820×1180 the read-aloud toolbar can cover part of a long hint line until the student scrolls (`hint-u1.png`, `hint-u6.png`). The hint is still spoken. The toolbar is shared code.
4. Unit 5 Explore's Missing number at 5 + 0 still uses a 260-pixel wrapper, so its 0 spot sits about 40 pixels further out. Row 10 named only `withZeroSpot`.
5. D5 is still open: a solve with one hint or one wrong typed try can earn a star until the all-labs engine change is made. That now includes a second repeat or 0 in "write another way".
6. Old unit titles remain in `plan.md` and `VISUAL_COMPONENT_TODO.txt`.
