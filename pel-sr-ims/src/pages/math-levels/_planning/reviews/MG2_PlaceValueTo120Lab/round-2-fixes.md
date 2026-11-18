# MG2 Place Value to 120: round 2 fixes

- **Lab:** MG2 `PlaceValueTo120Lab` · Grade 1 · K–1 band · Round 2 · 2026-11-17
- **Work order:** `round-2-merged.md` (20 Fix rows). E2-37 (☐ spoken "blank") was deferred to the user and is not touched.
- **Scope kept:** only files in `MG2/` were changed. No MG1, shared, or harness file was edited.

## 1. Summary

**20 rows: 19 Fixed · 1 Fixed, with a small difference from the agreed text (C2-37 U5 say line) · 0 Needs decision · 0 Not fixed.**

Two choices went past the literal wording. Both are explained in the table:
- **C2-40:** the "tens make 30" distractor would have been a *true* statement, which the builder bans. I used two false number choices instead.
- **C2-30 + C2-40:** these two rows overlap on the U5 "3 digits" choice. C2-40's number distractors replace it, so "The answer is over 100" was not needed.

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| C2-28 | Fixed | "Type the bigger number" box is now neutral `tone: "c"` in Practice. CFU items 2–3 pass `tone="c"`. I grepped the lab: no other "which one" step has a matching tone. U2/U4/U5 tones each mark one fixed part. | `ComparingTwoDigitNumbers.tsx:72, :87, :283` |
| C2-29 | Fixed | **Practice `equal` bucket ("Sticks and cubes")**<br>• Story: "5 tens and 3 ones. Compare with 53."<br>• Picture: unlabeled blocks beside the number, plus the chart.<br>• Step 1 (typed): "5 tens and 3 ones is what number?"<br>• Step 2: sign pick.<br>• About 1 in 3 draws don't match (tens and ones swapped, or 1 ten off).<br>• Split over 12,000 draws: "=" 67%, ">" 19%, "<" 14%.<br>• Help: a wrong try rings the sticks. Show me counts "10, 20 … 51, 52, 53".<br><br>**Test `equalTrapQuestion`:** "4 tens and 7 ones ☐ 47", same picture, same 1-in-3 mismatch.<br><br>**CFU item 4:** "6 tens and 5 ones ☐ 65", with blocks vs. the number. Show-it counts to 65.<br><br>**Diagram:** `BlocksPair` gets a new `blocksVsNumber` option and `labels="total"`. The title "Equal numbers" gave the answer away, so it is now "Sticks and cubes". | `ComparingTwoDigitNumbers.tsx:290`, `blocksVsNumberVisual`; `ComparingTwoDigitNumbersTest.tsx:84`; `BlocksPair.tsx:36` |
| C2-30 + E2-36 | Fixed | **U4 Test:**<br>• `digitChangedChoiceQuestion` becomes `tenMorePickQuestion`: "What is 10 more than 36?" with [46 / 37 / 47] and the start marked on the chart. n's ones are 0–8, so "+1" never rolls over. It is also in the Module Test, which stays at 25.<br>• `strategyWhyQuestion` becomes `tenLessFromTensQuestion`: typed "What is 10 less than 60?" (20–90).<br>• To keep number pools separate, `tenLessNoCrossingQuestion` now skips numbers like 40. `tenMoreQuestion` uses odd ones and the pick uses even ones.<br><br>**U3:** title is "Tens and ones swapped". Wrap-up is "76 > 67. 76 has more tens."<br><br>**Hints:** Test hints that said "digit" were reworded ("Count the tens." / "Count the sticks first.").<br><br>**Check:** brute-force grep finds no "digit" in any generated student text. | `TenMoreTenLessTest.tsx:126, :142`; `ModuleTest.tsx:5`; `ComparingTwoDigitNumbers.tsx:337` |
| C2-31 | Fixed | First box is now "8 + 5 = ☐ ones." (built from the numbers), then "What is 38 + 5? ☐". | `AddingTwoDigitOneDigitTest.tsx:178` |
| C2-32 | Fixed | • `cross100NumberQuestion`: "99, 100. What comes next?" (101) or "100, 101. What comes next?" (102).<br>• `decadeCrossNumberQuestion`: after 19/39/59/79, so the answer is the new ten.<br>• `decadeCrossChoiceQuestion` now uses only the other tens (30/50/70/90), so one prompt never prints the other item's answer. | `CountingTo120Test.tsx:55, :77, :109` |
| C2-33 + E2-44 | Fixed | The numbers in "Which is biggest: …?" are listed in random order (the old version sorted them). Biggest-position split ≈ 1/3 each. | `ComparingTwoDigitNumbersTest.tsx:177` |
| C2-34 | Fixed | New `countFrom` option on `BaseTenBlocks` (lab-local):<br>• The starting cubes are numbered at once.<br>• Each added cube appears and is numbered (8, 9 … 13), one per second.<br>• `onCount` passes that number, so Explore says "8", "9", ….<br>• "Make a new ten" stays gray until the count ends (browser-checked). | `BaseTenBlocks.tsx:70`; `AddingTwoDigitOneDigit.tsx:218` |
| C2-35 | Fixed | When help is about the ones (ring, or `labels.ones = "count"`) and there are 0 ones, `BaseTenBlocks` draws a dashed empty box where the cubes go. Show me and done add a big "0". This covers U2 CFU item 4, `exactTen`/`exactDecade` step 2, and `BlocksPair` sides with 0 ones. | `BaseTenBlocks.tsx` (`emptyOnes`) |
| C2-36 | Fixed | New `hide` prop on `HundredChart`. On a back-count step that isn't done, `countChart` blanks the cell before. A wrong try brings back the hop and the "?" as before. Browser check: "Here is 23" leaves 22 blank. | `HundredChart.tsx:57`; `CountingTo120.tsx:234` |
| C2-37 | Fixed (small text difference) | **U1 item 3:** new `LOOK.row`, pointing at `u1-jump` with "Look here. Jump to 99. Count to 100. See its row." (browser: 1 spot lit, these words spoken).<br><br>**U5 items 1–2:** now point at `u5-newten`. The say line is **"Look here. Tap Add. Count the cubes."** rather than "Tap Add cubes", because the button reads "Add 6 cubes" (the number changes) and "Tap Add cubes" didn't match it. | `CountingTo120.tsx:29`; `AddingTwoDigitOneDigit.tsx:53` |
| C2-38 + E2-45 | Fixed | Hint is now `Count by tens to ${amount}.` | `TenMoreTenLess.tsx:252` |
| E2-38 | Fixed | `tensOnesSentence` is now "How many tens? ☐  How many ones? ☐" with the prompt "16. How many tens and ones?". `tenWord`/`oneWord` were removed from `words.ts` (no other users). | `TensAndOnesTest.tsx:17`; `words.ts` |
| E2-39 | Fixed | Goal: "Compare two numbers. Greater, less, or equal?" I used the English checker's wording because "Bigger, less" reads wrong, and these words name the signs. | `ComparingTwoDigitNumbers.tsx:402` |
| E2-40 | Fixed | Button reads "Add 6 cubes" / "Add 1 cube". | `AddingTwoDigitOneDigit.tsx:244` |
| E2-41 | Fixed (MG2 shell only) | All four lines are as agreed. The mastered line dropped the 🔥 and the unit title. MG1 is not touched. | `MG2_PlaceValueTo120Lab.tsx:113, :299, :349, :356` |
| E2-42 | Fixed | • CFU Q3 and the Practice step: "10 of the ones make a new ten. How many tens now?"<br>• Named reasons and diagnose line: "10 ones make a new ten."<br>• Wrap-up: "…10 ones made a new ten." | `AddingTwoDigitOneDigit.tsx:123, :140, :379, :390` |
| E2-43 | Fixed | Banner reads "30! 3 tens!" for 10–90 ("10! 1 ten!"). Also "100! Keep counting!", "110! Keep counting!" and "120! You did it!". | `CountingTo120.tsx:142` |
| C2-39 + C2-40 | Fixed (C2-40 differs) | **`noRegroupChoiceQuestion`:** redraws until tens + add ≤ 9 (no distractor at or above 100). Adds the third distractor `total − 1`.<br><br>**`forgotCarryChoiceQuestion`:** adds `total − 1`.<br><br>**`regroupWhyQuestion`:** now ["The ones make 13" / "The ones make 5" (only the added ones) / "The ones make 3" (the ones of the answer)]. All wrong ones are false. "The tens make 30" was not used because it is true, which the builder bans as a distractor.<br><br>No duplicates in 5,000 runs each. | `AddingTwoDigitOneDigitTest.tsx:118, :153, :200` |
| C2-41 | Fixed | New Part `"sticks"` for `standard` step 3. Show me labels only the sticks (10, 20 …). `showMeHoldMs: countAlongMs(tens)`. | `TensAndOnes.tsx:400` |
| E2-46 + E2-47 + E2-48 | Fixed | **E2-46:**<br>• `startFrom1` with n = 1: "Start at 1. What comes next?"<br>• `startMid`: "Here is 74."<br>• `reverse` with 0 ones: "Here are 2 sticks."<br><br>**E2-47:**<br>• "5 ones and 3 ones. How many ones?"<br>• No-new-ten hint: "The tens stay the same. Count on the cubes."<br><br>**E2-48:** "42 = 4 tens + 2 ones. 42 = 40 + 2." | `CountingTo120.tsx:290, :309`; `TensAndOnes.tsx:370, :419`; `AddingTwoDigitOneDigit.tsx:343, :354` |

## 3. Changed files (all lab-local; no shared file, no other lab affected)

- `MG2/MG2_PlaceValueTo120Lab.tsx`
- `MG2/PlaceValueTo120Lab/diagrams/BaseTenBlocks.tsx` (new `countFrom`; empty-ones box)
- `MG2/PlaceValueTo120Lab/diagrams/BlocksPair.tsx` (new `blocksVsNumber`; `labels="total"`; the number side has a fixed minimum width, after an iPad screenshot showed "91" clipped)
- `MG2/PlaceValueTo120Lab/diagrams/HundredChart.tsx` (new `hide`)
- `MG2/PlaceValueTo120Lab/units/`:
  - `CountingTo120.tsx`, `CountingTo120Test.tsx`
  - `TensAndOnes.tsx`, `TensAndOnesTest.tsx`, `words.ts`
  - `ComparingTwoDigitNumbers.tsx`, `ComparingTwoDigitNumbersTest.tsx`
  - `TenMoreTenLess.tsx`, `TenMoreTenLessTest.tsx`
  - `AddingTwoDigitOneDigit.tsx`, `AddingTwoDigitOneDigitTest.tsx`
  - `ModuleTest.tsx`

## 4. New or rewritten student text

**Shell**
- "Solve problems by yourself. That fills your stars."
- "Answer the questions above. Then you can practice."
- "You did it! Now take the test."
- "You did it! You passed the test."

**U1**
- Banners: "{n}! {k} tens!" ("10! 1 ten!"), "100! Keep counting!", "110! Keep counting!", "120! You did it!"
- CFU Q3 pointer: "Look here. Jump to 99. Count to 100. See its row."
- Practice stories: "Start at 1. What comes next?" (n = 1) and "Here is 74."
- Test: "99, 100. What comes next?" and "100, 101. What comes next?"; "What comes after 39?" (now 19/39/59/79)

**U2**
- Practice story: "Here are 2 sticks." (0 ones)
- Wrap-up: "42 = 4 tens + 2 ones. 42 = 40 + 2."
- Test: "How many tens? ☐  How many ones? ☐"
- Test hint: "Count the sticks first."
- Picture: the dashed empty box, with "0" on Show me.

**U3**
- Goal: "Compare two numbers. Greater, less, or equal?"
- Key Idea: "More tens? That number is bigger."
- CFU Q4:
  - Prompt: "6 tens and 5 ones ☐ 65. What goes in the box?"
  - Why lines: "Count the sticks by tens. Then the cubes."
  - Show line: "Watch: 6 tens and 5 ones is 65. 65 equals 65."
  - Praise: "Yes! 6 tens and 5 ones is 65."
- Practice "Sticks and cubes":
  - Story: "{t} tens and {o} ones. Compare with {n}."
  - Step 1: "{t} tens and {o} ones is what number?"
  - Hint: "Count the sticks by tens. Then count on the cubes."
  - Show me: "Count: 10, 20, … That is {b}."
  - Sign hint: "Look at the tens first. Then the ones."
  - Wrap-up: "{t} tens and {o} ones is {b}. {b} {sign} {n}."
- Practice title: "Tens and ones swapped". Wrap-up: "{a} {sign} {b}. {big} has more tens."
- Test:
  - "{t} tens and {o} ones ☐ {n}. What goes in the box?"
  - "Which is bigger, 47 or 74?"
  - "Which is biggest: 26, 28, 25?"
  - Hints: "More tens is bigger." / "Count the tens."

**U4**
- Hint: "Count by tens to {amount}."
- Test: "What is 10 more than 36?" [46 / 37 / 47]; "What is 10 less than 60?"

**U5**
- Button: "Add 6 cubes" / "Add 1 cube"
- CFU Q1–2 pointer: "Look here. Tap Add. Count the cubes."
- New-ten step: "10 of the ones make a new ten. How many tens now?" (CFU Q3 and Practice)
- Named reasons and diagnose line: "10 ones make a new ten."
- Wrap-up: "…10 ones made a new ten."
- Ones step: "{o} ones and {a} ones. How many ones?"
- Hint: "The tens stay the same. Count on the cubes."
- Test:
  - "8 + 5 = ☐ ones.  What is 38 + 5? ☐"
  - Why choices: "The ones make {sum}" / "The ones make {add}" / "The ones make {sum − 10}"

## 5. Verification

1. **`npx tsc --noEmit -p tsconfig.app.json`: pass** (0 errors).
2. **`npx eslint src/pages/math-levels/MG2`: pass** (0 errors).
   - 11 warnings are the known `react-refresh/only-export-components` pattern.
   - 1 is the unused `eslint-disable` copied from MG1.
3. **`npx vite build`** (to a scratch outDir): **pass**. Only the existing chunk-size notes appear; nothing from MG2.
4. **Test/unit import check: pass.** Test files import only `../diagrams`, shared files and `words.ts`. No bare `useRef<T>()`.
5. **Brute force: pass, 0 problems.**
   - Runs: 12,000 per Practice bucket (each step's picture rendered plain, after 1 wrong try, and with Show me) and 5,000 per Test generator. Script: `scratchpad/brute2.tsx`.
   - No duplicate choices; every choice step has at least 2 options.
   - Right-answer position is about even across every choice step and Test pick.
   - Typed answers are whole numbers in 0–120. All choices are in range. The `noRegroupChoice` distractor is always under 100.
   - No "1 tens", "1 ones", "1 cubes" or "1 sticks". No "digit", "greater" (outside the goal), arrows, "more ones", regroup/carry/decade/sum/even/grade, NaN or undefined.
   - In the Tests, no word after a blank depends on the blank's answer.
   - Equal bucket splits: "=" 67% / ">" 19% / "<" 14% (Practice) and 66% / 20% / 14% (Test).
   - Module Test: 25 questions, pass mark 20.
6. **`node scripts/english-check.cjs --grade 1`:** 314 strings, 4 flags. All 4 are the same ones as round 1: lines the script joins together, plus "Place Value" in the lab name. Task text is 0% over the limit.
7. **Browser at 820×1180, touch on.** The harness and its Vite server ran from the scratchpad and are now stopped and deleted. No console or page errors.
   - **U1:**
     - CFU Q3's 2nd miss shows "Look here", which lights 1 spot and says "Look here. / Jump to 99. / Count to 100. / See its row."
     - Practice "Here is 23": after step 1, cell 22 is blank before a try.
   - **U2:** CFU Q4 on a wrong try shows the dashed empty box. Show-it shows the box with "0".
   - **U3:**
     - CFU Q2/Q3 boxes have class `answer qc`.
     - Q4 picture is 6 sticks + 5 cubes │ ☐ │ 65. The wrong lines don't contain the answer. The 2nd miss gives the Look-here button.
     - The passed CFU stays on screen and Practice opens.
     - Practice "Different tens" and "Tens and ones swapped" boxes are `qc`.
     - "Sticks and cubes" walk (wrong → hint, ring on sticks; wrong → Show me): "Got it" is gray at first. The count reaches 10…19 and the box/answer match. "Got it" turns on after the demo.
     - One layout bug was found and fixed: the number side was clipped ("91" cut off). After the fix, "92" shows in full.
   - **U5:** button reads "Add 6 cubes". Cubes 1–7 are numbered at once, and 8, 9 … appear one by one. "Make a new ten" is gray while adding and turns on after.
   - **Not confirmed:** spoken numbers during the U5 count-on and the U3 Show me. The headless run didn't turn sound on, so the speech stub logged nothing (same limit as round 1). The code calls `onCount` with the label number.
   - Screenshots in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\e426d022-1bef-480f-884c-4eaf0bda058b\scratchpad\shots2\`:
     - `r2-u1-q3-lookhere.png`, `r2-u1-back-before.png`, `r2-u1-back-wrong1.png`
     - `r2-u2-q4-wrong1.png`, `r2-u2-q4-show.png`
     - `r2-u3-q4-ask.png`, `r2-u3-q4-wrong2.png`
     - `r2-u3-practice-*.png`, `r2-u3-sc-wrong1/2.png`, `r2-u3-sc-showme-mid/end.png`
     - `r2-u5-adding-0.png`, `r2-u5-adding-2s.png`, `r2-u5-added.png`
   - Not done: dark mode, side-door retry checks. Still worth a manual pass on a real iPad.

## 6. Noticed, not fixed

- **U3 "Sticks and cubes" step 1:** in the 2-in-3 matching case, the answer equals the number printed on the right. A student who copies it is right 2/3 of the time, though not on the third. This follows the agreed design. If it should be stricter, raise the mismatch rate to 1/2, or hide the right number until step 1 is done.
- **U5 Practice ones step / CFU item 2:** Show me still counts all the cubes from 1 ("1, 2, 3, up to 13"). C2-34 covered only Explore. `countFrom` could be reused there.
- **`noRegroupChoiceQuestion` with add = 1:** the `total − 1` distractor equals the starting number (28 + 1 → 28). It is still false and is a real "forgot to add" error, but worth a look.
- **"0 ones and 5 ones. How many ones?"** (U5 noRegroup when the start ends in 0) is grammatical but odd.
- **The `u5-ones` look-here spot** is now unused by the CFU (harmless).
- **Still open with the user:** E2-37 (☐ spoken "blank", shared `mathSpeech.ts`), C1-14 Test item, C1-15, passScore, the KCheck title, and the Test-engine spoken signs. MG1's shell still has the old E2-41 lines (MG1 E2-48), since it was out of scope.
