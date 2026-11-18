# MG2 Place Value to 120: fixes from the user's decisions

- Lab: MG2 `PlaceValueTo120Lab` · Grade 1 · K–1 band · 2026-11-17
- Work order: the user's answers to the 5 open items in `summary.md` ("Still open").
- Scope: I changed only files in `MG2/PlaceValueTo120Lab/` (units/, diagrams/), the plan, and this report. I did not touch the shell (`MG2_PlaceValueTo120Lab.tsx`), its CSS, any `shared/` file, MG1, or the number pad. Nothing was committed.

## 1. Summary

**1 item changed (C1-15, done). 4 items: no change, as the user decided.**

- **C1-14:** no change. I checked the item. Its right answer is "A new ten" (the wrong choice is "A new hundred"). The wording is still the short round-1 version: "Count from {101–108} to 109. Then comes 110. Is that a new ten or a new hundred?" Only its code comment changed, to record the decision.
- **C1-15:** added. Unit 1 now has a "How many?" problem type for 100–120, with sticks and cubes. When there are 10 or more sticks, the first 10 are drawn as one big group. It appears in Explore, Practice, the unit Test and the Module Test.
- **Pass score 9/10, ☐ spoken as "blank", KCheck title, Test signs read aloud:** no change.

There is one difference from the order. To keep the Test at 10 questions, I replaced `after109Question` ("108, 109. What comes next?"), not a plain "what comes after" item. The reason: in every unit Test, the C1-14 item prints "Then comes 110", which is exactly `after109Question`'s answer. That was a giveaway in 100% of Tests. The Module Test still uses `after109Question`, because the C1-14 item isn't in the Module Test. In the Module Test, the new item replaced the easiest item, `successorFrom1Question`, so each unit still has 5 items and the total is still 25.

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| C1-14 | No change (user) | Checked: the answer is "A new ten", and the wording is short. Only the comment changed. | `units/CountingTo120Test.tsx:194–210` |
| C1-15 | Fixed | **Picture:** grouped sticks when there are 10 or more. **Explore:** a "How many?" section. **Practice:** new bucket `sticksPast100` (2 steps). **Unit Test:** `howManySticksQuestion` replaces `after109Question`. **Module Test:** `howManySticksQuestion` replaces `successorFrom1Question`. **Plan:** the new bucket is listed. | see §3 |
| Pass score | No change (user) | — | — |
| E2-37 ☐ "blank" | No change (user) | — | — |
| KCheck title / Test signs | No change (user) | — | — |

### C1-15 in detail

**The picture (`diagrams/BaseTenBlocks.tsx`).** With 10 or more sticks:
- The first 10 sticks sit 2 px apart inside one rounded outline, with a light blue fill and a blue outline.
- Any extra sticks stand 20 px to the right at the normal spacing, so they are clearly separate from the group.
- It all fits in one row, about 350 px wide at 120.

New options:
- `ring="group"` lights up the group (thick violet outline, violet fill).
- `groupValue` writes a big "100" under the group.
- `labels.tens = "group"` counts the group as ONE item labeled 100, then each extra stick (110, 120), then the cubes (111, 112 …). This is the count-on Show me.

Pictures with fewer than 10 sticks are unchanged. I checked this with a 9-stick and a 7-stick screenshot.

I also checked where 10 or more sticks can be drawn today. A brute-force scan of every Practice picture (all help states) and every Test picture found the most sticks per unit: U1 = 12 (the new item only), U2 = 9, U3 = 9, U4 = 7, U5 = 9 (including the make-a-new-ten slide). So no other unit draws 10 or more sticks. The grouping only shows up in the new Unit 1 item, but any future 100+ picture in MG2 gets it automatically.

**Explore (`units/CountingTo120.tsx:133`, placed after the chart, before the CFU).**
- Two counters: "Sticks" (10–12) and "Cubes" (0–9, locked at 0 when there are 12 sticks). The default is 11 sticks and 4 cubes (114), which is not a CFU answer.
- A "Count them" button labels each stick by tens (10 … 100, 110), then the cubes (111 … 114). It goes about 1 second per item at the student's speed, and each number is said. At the end, "114" shows next to the button.

**CFU:** no change. The 4 CFU items are all about the counting sequence, so none fits a "How many?" pointer. The builder rule only requires that Practice carries the CFU's concepts, which it does.

**Practice bucket `sticksPast100` (`units/CountingTo120.tsx:472`).**
- Sticks: 10 (a third of the time; 100–109, no extra sticks), 11 (half; 110–119), or 12 (a sixth; 120).
- Cubes: 0–9, and always 0 with 12 sticks. So 0 cubes happens for 100, 110 and 120.
- It is added to `BUCKETS` / `requiredBuckets`, so a student must meet it before mastery.
- It has 2 steps, like every other Unit 1 bucket.
- No prompt or story has a number in it, so no step shows another step's answer.

## 3. Changed files (all lab-local, so no other lab is affected)

- `MG2/PlaceValueTo120Lab/diagrams/BaseTenBlocks.tsx`: the grouped layout, `ring="group"`, `groupValue`, `labels.tens="group"`
- `MG2/PlaceValueTo120Lab/units/CountingTo120.tsx`: the Explore `HowManySticks` section, the `sticksPast100` bucket with `sticksVisual`, and a keyIdea line
- `MG2/PlaceValueTo120Lab/units/CountingTo120Test.tsx`:
  - new `howManySticksQuestion`
  - the list swaps out `after109Question` (still exported)
  - `range100to120Question`'s pool is now 103, 104, 110–114 (it was 103–118 without 108 and 109). Its numbers and answers now end in 0–5, so they never print or ask for the new item's 116–120.
  - C1-14 comment
- `MG2/PlaceValueTo120Lab/units/ModuleTest.tsx`: `successorFrom1Question` swapped for `howManySticksQuestion`. Still 5 per unit, 25 in all.
- `MG2/PlaceValueTo120Lab/units/words.ts`: new `sticksW` ("1 stick" / "11 sticks") and `cubesW` ("1 cube" / "4 cubes")
- `_planning/Grade-1/PlaceValueTo120Lab/plan.md`: the new Unit 1 bucket (user-approved 2026-11-17)

## 4. New student text

**Explore (Unit 1):**
- Counter labels: "Sticks", "Cubes".
- Button: "Count them". Each number is spoken as it's labeled ("10", "20" … "110", "111" …).
- Line: "A stick is 10. A cube is 1. 10 sticks make 100. Then count on."
- keyIdea, new line: "10 sticks make 100. 11 sticks and 4 cubes make 114."

**Practice, "How many?":**
- Story: "Look at the sticks and cubes." With 0 cubes: "Look at the sticks."

Step 1 (typed, number pad; answer box in tone a, like the sticks):
- Prompt: "How many sticks are there?"
- Hint: "Count the sticks in the big group. Then count the others." With 10 sticks: "Count the sticks in the big group."
- Picture after a wrong try: a violet dashed ring around all the sticks.
- Show me: "Count the sticks: 1, 2, …, 11. That is 11 sticks." Each stick is numbered as it's counted, 1 per second. "Got it" waits for the count (`countAlongMs(sticks)`).
- After answering: "There are 11 sticks."

Step 2 (typed, neutral box because the answer is the whole picture):
- Prompt: "What number is this?"
- Hint: "The big group is 100. Each other stick is 10 more. Each cube is 1 more." The parts with no sticks or no cubes are dropped. For 100 itself: "Each stick is 10. Count the sticks by tens."
- Picture after a wrong try: the group lights up in violet with "100" under it. For 100 itself, there is no "100" label, because that's the answer.
- Show me: "The big group is 100. Count on: 110, 111, 112, 113, 114." The picture labels 100, then 110, then each cube, 1 per second. The hold is `countAlongMs(1 + extra sticks + cubes)`. For 100 itself: "Count by tens: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100."
- After answering: "11 sticks and 4 cubes make 114." With 0 cubes: "11 sticks make 110."

Wrap-up: "10 sticks make 100. 11 sticks and 4 cubes make 114." For 100 itself: "10 sticks make 100."

The `diagnose` messages ("Each stick is 10. Count by tens.", "Count the other sticks too. Each is 10.", "Count on the cubes too.", "Count just the sticks.") are written, but they don't show. See §6.

**Unit Test and Module Test item (no help, no labels):**
- Prompt: "Look at the sticks and cubes. What number is this?" For 120: "Look at the sticks. What number is this?"
- Numbers: 116–119 (11 sticks and 6–9 cubes) and 120 (12 sticks), each a fifth of the time.

## 5. Verification

1. `npx tsc --noEmit -p tsconfig.app.json`: **pass**, 0 errors.
2. `npx eslint src/pages/math-levels/MG2`: **pass**, 0 errors. 13 warnings:
   - 11 are the existing react-refresh ones, and 1 is new: `HowManySticks` in `CountingTo120.tsx`. It's the same category as `MakeATen` in U2.
   - 1 is an "unused eslint-disable" in the shell file. That file is not mine (I didn't touch it).
3. `npx vite build`: **pass**. The only warning is the existing chunk-size one.
4. Test/unit import check: **pass**. `CountingTo120Test.tsx` imports only `../diagrams`, shared files and `./words`.
5. Brute force (throwaway `brute3.tsx`, bundled with esbuild, now deleted). 20,000 Practice problems, 20,000 unit Tests, 20,000 Module Tests:
   - **Practice values:** all of 100–120 are reached, every value in range. 0 cubes: 25.5%. 10 sticks: 33%. 120: 16%. A random draw picks this bucket 17% of the time.
   - **Answers:** step 1 = the number of sticks, and step 2 = sticks × 10 + cubes, every time. The Show me always ends at the answer. Hints never contain the answer (and the 100 hint never says "100"). Stories and prompts contain no numbers.
   - **Text:** no "1 sticks", "1 cubes", "1 ones" or "1 tens", and no "digit". The `diagnose` functions return null on the right answer and fire on the targeted mistakes.
   - **Pictures:** before help, the picture has no labels, ring or "100". Every help state draws the right sticks and cubes.
   - **Unit Test:**
     - Always 10 questions. The new item is always 116–120, and its picture has no labels or ring.
     - Its answer matches another item's answer in 0.79% of Tests, and is printed in another prompt in 0.91%. Both come only from the random `oneLessQuestion` (11–120). Without the `range100to120Question` change it was 6.3% / 5.7%.
     - The old giveaway (the C1-14 item printing "110" while `after109Question` asked for 110) went from 100% of Tests to 0.95%. That 0.95% is only `oneLessQuestion` landing on "one less than 111".
   - **Module Test:**
     - 25 questions, 5 per unit.
     - The new item is 5th of the U1 block. Its answer never equals another item's answer (0.00%).
   - No duplicate choices (the new item is typed). The C1-14 item has 2 distinct choices: "A new ten" and "A new hundred".
6. `node scripts/english-check.cjs --grade 1` on `CountingTo120.tsx`, `CountingTo120Test.tsx` and `words.ts`: **95 strings, 2 flagged, both accepted.**
   - The 100 Show me "Count by tens: 10, 20, … 100." is 13 "words", but they are just the count list, the same form as `countTens` elsewhere.
   - The other flag is the existing U1 Explore chart line (not new).
   - Every new sentence is 8 words or fewer.
7. **Browser.** I used a temporary Vite harness on port 5317, separate from the other agent's servers, using the real `StepProblem`, `EarlyLearnerProvider`, `TtsProvider` and the U1 Explore. I stubbed `speechSynthesis.speak` to log what was spoken. Afterward I stopped the server and deleted the harness. **No console or page errors.**
   - **Grouped sticks:** desktop (1280×800) and iPad (820×1180, touch), for 100, 103, 114 and 120. The group is clearly one block and the extra stick(s) stand apart. I looked at every screenshot.
   - **Help-ladder walk on a 114 problem, iPad:**
     - Step 1, wrong twice: the hint is read, and the ring around the sticks shows. Then Show me: the sticks are numbered 1–11 one at a time. "Got it" is gray during the demo and turns on afterward.
     - Step 2, wrong twice: the group is lit with "100". Then Show me: 100, 110, 111 … 114 appear in order.
     - At the end: "Solved, with help." and "Try one like it".
     - Spoken, in order: "Count the sticks in the big group." / "Then count the others." / "Count the sticks: 1, 2, … 11." / "That is 11 sticks." / "The big group is 100." / "Each other stick is 10 more." / "Each cube is 1 more." / "The big group is 100." / "Count on: 110, 111, 112, 113, 114." / "11 sticks and 4 cubes make 114." / "Solved, with help." …
   - **Explore "Count them" (iPad and desktop):** labels 10 … 100, 110, then 111 … 114. At the end, "114" shows by the button, and the button stays gray while counting.
   - **Not checked:** real audio on an iPad. Speech was stubbed.
   - **Screenshots** are in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\e426d022-1bef-480f-884c-4eaf0bda058b\scratchpad\shots4\`:
     - Desktop: `desk-s100.png`, `desk-s114.png`, `desk-s120.png`, `desk-h2.png`, `desk-d2.png`, `desk-explore-before.png`, `desk-explore-end.png`
     - iPad pictures: `ipad-s100.png`, `ipad-s103.png`, `ipad-s114.png`, `ipad-s120.png`, `ipad-h1.png` (step 1 help), `ipad-h2.png` (step 2 help), `ipad-d1.png`, `ipad-d2.png`, `ipad-d3.png`, `ipad-d4.png`, `ipad-t1.png` (Test look), `ipad-r9.png` and `ipad-r7.png` (fewer than 10 sticks, unchanged)
     - iPad Explore and Practice: `ipad-explore-before.png`, `ipad-explore-mid.png`, `ipad-explore-end.png`, `ipad-practice-0-ask.png` … `ipad-practice-7-done.png`

## 5b. Coordinator check: Test picture overlapping the question (not caused by BaseTenBlocks)

The coordinator reported a 1280×800 screenshot of the U2 Test ("How many tens and ones?", 2 sticks, 1 cube). In it, the sticks run over the question line and the question sits inside the dashed picture frame.

**What I measured.** I used a temporary harness with the real `UnitTestView` inside the shell's `.app` / `.rail` / `.main` layout, on port 5318 (now stopped and deleted). I tried 2 + 1, 9 + 7 and 11 + 4 at 1280×800 and 820×1180. The page isn't scrolled at first, and in every case:
- the SVG fits inside its `.problem-visual` box (e.g. desktop 2 + 1: box y 87–388, SVG 109–366);
- the question starts below the box (y 404).

So BaseTenBlocks' viewBox and height are right. My diff also doesn't change the size math for fewer than 10 sticks.

**What causes it.** I reproduced the screenshot exactly by scrolling the page down 250 px (`fix-desk-2-1-scrolled.png`).
- The shared rule `.lab-base .problem-visual { position: sticky; top: 16px }` (`shared/styles/lab-base.css:691`) pins the picture to the top of the screen, and its background is transparent.
- In a Test, `.test-question` is one column, so the question and the number pad scroll up under the pinned picture.
- Sticky has always been there, but tall pictures rarely let the page scroll. The new `.lab-base:has(.numpad-float) .main { padding-bottom: 400px }` (the number-pad work in the same file) makes every Test page scrollable. Now any scroll, or the pad scrolling a box into view, causes the overlap.

This happens in every lab's Tests, not just MG2. Practice is fine, because there the picture sits in its own column.

**Suggested fix (not applied: it's a shared file, which the other agent is editing):** add `.lab-base .test-question .problem-visual { position: static; }` to `lab-base.css`. A solid background on the sticky box would also hide the overlap, but the picture would then cover the question.

Screenshots in `…\scratchpad\shots4\`:
- not scrolled: `fix-desk-2-1-a.png`, `fix-desk-2-1-b.png`, `fix-desk-9-7-*.png`, `fix-desk-11-4-*.png`, `fix-ipad-*-a.png` and `fix-ipad-*-b.png`
- scrolled (reproduces the report): `fix-desk-2-1-scrolled.png`

## 6. Noticed, not fixed

- **`diagnose` is ignored in early-learner mode.** `shared/engine/StepProblem.tsx:240` returns the fixed "Not yet. Look at the picture and try again." for every wrong number. So this lab's `diagnose` messages, the new ones and the existing ones (e.g. U2 "That is backwards. Write the tens first."), never show in Practice. It's a shared-engine decision, so I left it.
- The Module Test now has no "count from 1" item. The idea is still in the unit Test and Practice.
- `_planning/reviews/LAB_STATUS.md` was not updated (outside my allowed files). It may want a note that MG2's open items are closed.
- The leftovers from round 3 are unchanged: U5 Test near-duplicate sums (~6%), and the U4 keyIdea "only the tens change" past 100.
