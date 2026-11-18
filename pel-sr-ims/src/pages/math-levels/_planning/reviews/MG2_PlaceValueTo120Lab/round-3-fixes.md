# MG2 Place Value to 120: round 3 fixes (final round)

- Lab: MG2 `PlaceValueTo120Lab` · Grade 1 · K–1 band · Round 3 · 2026-11-17
- Work order: `round-3-merged.md` (Fix 7 · Skip 1)
- Scope: I changed only files in `MG2/`. I did not touch MG1, shared files or harness files.

## 1. Summary

**7 Fixed · 0 Partly fixed · 0 Needs decision · 0 Not fixed.** I skipped C3-45 as the merged list says.

There are two small differences from the agreed text (details in the table):
- **C3-43:** CFU item 1 now counts on too. It uses the same picture as item 2.
- **C3-46:** I separated a few more U4 Test pairs than the checker listed. Its measure missed some that ask the same thing, like "37 + 10" and "10 more than 37". After the change, the brute-force run finds 0 near-duplicate pairs in U4.

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| C3-42 | Fixed | In "Sticks and cubes", the blocks don't match the number half the time (was 1 in 3). This applies to both Practice and the Test/Module `equalTrapQuestion`. Brute check: "=" is right 50.4% of the time in Practice and 49.7% in the Test. | `ComparingTwoDigitNumbers.tsx:299`; `ComparingTwoDigitNumbersTest.tsx:89` |
| C3-43 | Fixed (+ CFU item 1) | The Practice ones-step Show me now counts on, like Explore. The starting cubes are numbered at once, then each new cube appears one at a time (`countFrom`). Text: "Count the cubes: 7. Then 8, 9, 10, 11, 12. That is 12 ones." `showMeHoldMs` is now `countAlongMs(add)`. When the start has 0 ones, the count still starts from 1. In the CFU, the `addPicture` "ones" picture passes `countFrom`, so items 1 and 2 both count on (item 1 shares that picture, and the lab should model one strategy). | `AddingTwoDigitOneDigit.tsx:64, 100, 115, 319, 349–355` |
| C3-44 | Fixed | The Explore default is now 27 + 5. It shows 12 ones, 3 tens and 32. I re-checked it against the CFU answers (39, 13, 4, 43, plus the in-between counts 9 and 13): no match. The U5 Explore has no presets. | `AddingTwoDigitOneDigit.tsx:47–49, 163` |
| E3-49 | Fixed | The U3 title is now "Comparing Numbers". I grepped every title, goal, Practice title, keyIdea, shell string and generated line: no "digit" is left in student text. "digit" is still in code identifiers, comments and the internal bucket key `reversedDigits`, which students never see. | `ComparingTwoDigitNumbers.tsx:401` |
| U4 wrap-up | Fixed | The wrap-up is built from the values. When 10 more reaches 100 or more (e.g. 88, 98, 108), it says "The ones stayed the same." instead of "Only the tens changed." Brute check: no "Only the tens" wrap-up has a number of 100 or more. | `TenMoreTenLess.tsx:287–289` |
| E3-50 | Fixed | The choices are now "There are 15 ones" / "There are 9 ones" / "There are 5 ones" (or "There is 1 one"), built from the values. The explain line is now "There are 15 ones. 10 of them make a new ten." The question is redrawn when the ones add to exactly 10 (no "There are 0 ones"). It is also redrawn when the added number equals the cubes drawn, because then "There are 6 ones" would be true of the picture. Choices are distinct, and only one is true. | `AddingTwoDigitOneDigitTest.tsx:153–180` |
| C3-46 | Fixed (wider than listed) | **U1:** `range100to120Question` now draws 103–118, never 108 or 109. Starting at 101 would ask for 102, and 102 would print cross100's answer; 108 would do the same with after109's "108, 109". **U4:** `subtractMultipleOfTenExactQuestion` takes away 20–60 (so not "60 − 10"). `subtractMultipleOfTenMidDecadeQuestion` also takes away 20–60, and its numbers end in 1, 3, 5, 7 or 9. `onesStayQuestion` numbers end in 2, 4, 6 or 8. `addMultipleOfTenQuestion` starts at 10–49 and adds 20 or 30. `addMultipleOfTenUpperQuestion` starts at 50–79 and adds 20. `tenLessCrossingQuestion` never starts at 20. | `CountingTo120Test.tsx:121–128`; `TenMoreTenLessTest.tsx:46, 62–66, 81, 99–103, 120, 173` |
| C3-45 | Skipped | As decided. | — |

## 3. Changed files (all lab-local; no shared file, so no other lab is affected)

- `MG2/PlaceValueTo120Lab/units/AddingTwoDigitOneDigit.tsx`
- `MG2/PlaceValueTo120Lab/units/AddingTwoDigitOneDigitTest.tsx` (now imports `onesW` from `./words`)
- `MG2/PlaceValueTo120Lab/units/ComparingTwoDigitNumbers.tsx`
- `MG2/PlaceValueTo120Lab/units/ComparingTwoDigitNumbersTest.tsx`
- `MG2/PlaceValueTo120Lab/units/TenMoreTenLess.tsx`
- `MG2/PlaceValueTo120Lab/units/TenMoreTenLessTest.tsx`
- `MG2/PlaceValueTo120Lab/units/CountingTo120Test.tsx`

The Module Test picks up the changed `equalTrapQuestion`, `tenLessCrossingQuestion`, `subtractMultipleOfTenMidDecadeQuestion` and `onesStayQuestion` with no edit.

## 4. New or rewritten student text

- U3 unit title: "Comparing Numbers"
- U5 Practice Show me (ones step, start has 1–9 ones): "Count the cubes: {ones}. Then {ones+1}, …, {sum}. That is {sum} ones."
- U5 CFU item 1 show-it: "Watch and listen: 4. Then 5, 6, 7, 8, 9 ones. 3 tens and 9 ones."
- U5 CFU item 2 show-it: "Watch and listen: 8. Then 9, 10, 11, 12, 13 ones."
- U5 Explore (default 27 + 5): button "Add 5 cubes"; banner "7 and 5 make 12 ones. That is more than 9. Make a new ten." (existing template, new values)
- U5 Test why-question choices: "There are {sum} ones" / "There are {add} ones" or "There is 1 one" / "There are {sum−10} ones" or "There is 1 one"; explain "There are {sum} ones. 10 of them make a new ten."
- U4 "10 less" wrap-up, result 100 or more: "{n−10}, {n}, {n+10}. The ones stayed the same."

## 5. Verification

1. `npx tsc --noEmit -p tsconfig.app.json`: **pass** (0 errors).
2. `npx eslint src/pages/math-levels/MG2`: **pass**, 0 errors. The 12 warnings are the existing react-refresh "only-export-components" ones.
3. `npx vite build`: **pass**. The only warning is the existing chunk-size one.
4. Test/unit import check: **pass**. Test files import only `../diagrams`, shared files and `./words`.
5. Brute force with scratch scripts `brute.tsx` and `dup2.tsx` in the scratchpad: 12,000 per Practice bucket or generator, 20,000 Tests per unit.
   - U3 equal bucket, "=" right: 50.4% in Practice, 49.7% in the Test. Blocks always 10–99. No duplicate choices.
   - U5 Show me: matches the count-on form for every draw with ones ≥ 1, and counts from 1 when there are 0 ones. Answers are correct.
   - U5 why-question: 3 distinct choices, only the right one true. No "0 ones", no "There are 1", no add equal to the cubes drawn.
   - U4: 766 wrap-ups with a result past 100 use "The ones stayed the same."; 0 say "Only the tens" with a number of 100 or more.
   - Near-duplicate Test pairs (same sum, same number counted on from, or 10 more/less matched to + or − 10): **U1 0%, U3 0%, U4 0%** (U4 was 3.9% under this measure before the extra separations). U5: see §6.
   - No "digit" in any generated text, title, goal or keyIdea. No "1 ones" or "1 tens".
6. `node scripts/english-check.cjs --grade 1` on the 7 changed files: **189 strings, 0 flagged.** Task text is 0% over the limit.
7. Browser at 820×1180, touch on. I ran a temporary Vite harness on port 5299 from the scratchpad, then stopped it and deleted the harness folder. **No console or page errors.**
   - **Explore:** the button reads "Add 5 cubes". After adding, the banner says "7 and 5 make 12 ones…".
   - **CFU item 1, after 3 misses:** shows "Watch and listen: 4. Then 5, 6, 7, 8, 9 ones…". Labels 1–4 appear at once, with 5 the first new cube (labels at 1.3 s: 1–5); at the end, 1–9.
   - **CFU item 2:** labels 1–8 appear at once, then 9 … 13 one at a time. Right answer → "Yes! 8 and 5 make 13 ones."
   - **Practice "What is 44 + 6?", wrong, wrong, Show me:** "Count the cubes: 4. Then 5, 6, 7, 8, 9, 10. That is 10 ones." Labels 1–4 at once, then the new cubes. "Got it" is gray during the demo and turns on afterward. With 9 cubes added at the default Slow speed, the hold is 12.7 s, just after the count ends.
   - **Not confirmed:** the spoken audio. Sound wasn't turned on in the headless run, so the speech log is empty, same as earlier rounds.
   - **Screenshots** (I looked at `r3-u5-cfu-q2-show-early.png` and `r3-u5-practice-show-early.png`; both show the starting cubes numbered and the new cubes coming in): `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\e426d022-1bef-480f-884c-4eaf0bda058b\scratchpad\shots3\`, files `r3-u5-explore-added.png`, `r3-u5-cfu-q1-show-early.png`, `r3-u5-cfu-q1-show-end.png`, `r3-u5-cfu-q2-show-early.png`, `r3-u5-cfu-q2-show-end.png`, `r3-u5-practice-show-early.png`, `r3-u5-practice-show-end.png`.

## 6. Noticed, not fixed

- **U5 unit Test near-duplicates:** about 6% of U5 Tests have two items with the same sum. This happens because `regroupStandard`, `regroupRoundTen`, `forgotCarryChoice`, `newTenTyped`, `regroupWhy`, `regroupSentenceProduction` and `regroupSecond` all draw from one `regroupPair()` pool, and the three no-regroup items share `noRegroupPair()`. This was already there before this round and is not in the merged list. Fix later by giving each generator its own range (e.g. tens or ones bands).
- **U4 keyIdea:** "10 more or 10 less: only the tens change." is not literally true when 10 more passes 100 (98 → 108). Only the generated wrap-up was in scope, so I left the keyIdea.
- The U5 `u5-ones` look-here spot is still unused (harmless).
- Still with the user: E2-37 (☐ spoken "blank"), the KCheck title, the Test engine reading signs aloud, C1-14, C1-15 and passScore.
