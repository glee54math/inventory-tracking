# MG10 Adding & Subtracting Fractions: round 6 fixes (user request)

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (grade 5)
- **Work order:** `round-6-user-request.md` (U6-01, approved by the user)
- **Date:** 2026-11-09
- **Commit:** none

## 1. Summary

**1 Fixed (U6-01) · 0 Partly fixed · 0 Needs decision · 0 Not fixed.**

The Unit 1 "[Name] added across" judge step is now one sentence frame with four blanks. The student builds the reason from this problem's own fractions. The frame is used in Practice, Unit 1 Test Q7, Module Test Q2 and CFU Q1. All three old forms (verdict, vs bigger, vs smaller) are gone.

**Where I differed from the example in the work order:**
- **The example has two true answers.** In "2/5 is [less / greater] than [1/2 | 1/3]", the picks "greater than 1/3" also make a true sentence.
- **What I did instead:** both comparisons are fraction blanks with the words printed: "2/5 is less than [ ], but more than [ ]." Only one set of picks is true. These are the user's own words ("more than 1/3 but less than 1/2").
- **The words still vary:** which comparison comes first is random, so blank 1's answer is sometimes the bigger fraction and sometimes the smaller one.
- **Word choice:** I wrote "more", not "greater", to match the rest of the lab.
- **Why one step and not 2–3:** blanks 3 and 4 always have the same answer. As separate steps they would be the fixed button the builder rule forbids. In one step they are graded together with the two fraction blanks.

## 2. Item table

`L` = `src/pages/math-levels/MG10/AddingAndSubtractingFractionsLab/`.

| ID | Status | What changed | Where |
|---|---|---|---|
| U6-01 | Fixed | New `judgeStep`: a `SentenceStep` with 2 fraction tap blanks + 2 word tap blanks. The comparison order is random, and every blank's buttons are shuffled. Check is off until all blanks are filled. Each blank gets a green or red border, and the first wrong blank gets its own short message. A wrong Check makes the solve not clean. | `L/lib/unit1.tsx` `judgeStep` |
| U6-01 | Fixed | Test Q7 (`whyWrongQuestion`) is now the same frame, with no hints and Practice's two-bar picture. The Module Test's Unit 1 Q2 reuses it. | `L/units/WhyNotAcrossTest.tsx`, `L/units/ModuleTest.tsx` (comment only) |
| U6-01 | Fixed | CFU Q1 uses the same frame with 1/2, 1/3 and 2/5. It shows three bars (1/2, 1/3, 2/5) and keeps the typed sixths part. It has its own message for each blank. | `L/units/WhyNotAcross.tsx` CFU Q1 |
| U6-01 | Fixed (engine) | New optional `SentenceStep` fields: `more` (blanks 3+), `checkEach` and `diagnose(inputs)`. Opt-in: no other lab sets them. | `shared/engine/types.ts`, `StepProblem.tsx`, `UnitTest.tsx`, `shared/styles/lab-base.css` |

**Left alone, as the work order says:** the "which picture?" step, the estimate step, and the hint picture (the existing add-across size check, shown after a wrong Check or the hint).

## 3. Changed files

**Shared files.** Every change is opt-in; nothing changes unless a step sets `more` / `checkEach` / `diagnose`. Only MG10 sets them.
- `shared/engine/types.ts`
  - `SentenceStep.more`, `checkEach` and `diagnose`.
  - New `sentenceBlanksOf()` helper.
- `shared/engine/StepProblem.tsx`
  - `answerText` and `check` handle `more`. The 2-blank messages are unchanged.
  - `isClean` counts a wrong Check as a guess when `checkEach` is set.
  - With `checkEach`, Check is disabled until every blank is filled.
  - The sentence renderer: blanks 3+; with `checkEach`, every select blank is a `TapSelect`; green or red borders after a wrong Check; the `sentence-frame` class.
  - Imports `answerBorder`.
- `shared/engine/UnitTest.tsx`: the review list's "Your answer" includes the `more` blanks.
- `shared/styles/lab-base.css`: new `.answer-row.sentence-frame` rules, so the frame wraps like text and no line starts with a period. They apply only to `checkEach` rows.
- **Other labs:** they use `SentenceStep` without these fields, so they are unchanged. The other agent edited these same shared files during this round, and my edits sit alongside theirs.

**MG10:**
- `L/lib/unit1.tsx`
- `L/units/WhyNotAcross.tsx` (CFU Q1, the Practice comment, and the unused `PieceBars` import removed)
- `L/units/WhyNotAcrossTest.tsx` (Q7; the unused `biggerSmaller` import removed)
- `L/units/ModuleTest.tsx` (comment only)

**Docs:** `MATH_TSX_STYLE_GUIDE.txt`: one note on the sentence-frame fields.

## 4. New or rewritten student text

**Practice step 2, Unit 1 Test Q7 and Module Test Q2** (`lib/unit1.tsx` `judgeStep`):
- **Prompt:** "{Name} added across: {n1} + {n2} = {mn} on top, {d1} + {d2} = {md} on the bottom. That gives {X}. Is that the sum? Fill in each blank."
- **Frame, "less first" order:** "{Name}'s answer, {X}, is less than [{a} | {b}], but more than [{a} | {b}]. Adding should make a number [bigger | smaller] than each fraction you add. So {Name}'s answer is [too small | right | too big]."
- **Frame, "more first" order:** "{Name}'s answer, {X}, is more than [ ], but less than [ ]. …" The rest is the same.
- **Hint:** "Compare the {X} bar with the {a} bar and the {b} bar. Which bar is longer each time?"
- **Explanation:** "{X} is more than {small}, but less than {big}. {a + b} must be more than {big}, so adding across gives an answer that is too small."
- **Wrong-blank messages** (Practice only; the first wrong blank in reading order):
  - Blank 1 or 2: "Look at the bars. Is {X} shorter or longer than {the fraction picked}?"
  - Blank 3: "Think of {a + b} as {a}, and then {b} more. Is that bigger or smaller than {a}?"
  - Blank 4: "Read your first sentence again. {X} is less than {big}. Should {a + b} be more or less than {big}?"
- **Generic message:** only when there are 3+ blanks and no `diagnose`: "One of the blanks isn't right yet. Check each one against the problem." MG10 never shows it. Also "Fill in every blank."

**CFU Q1** (`units/WhyNotAcross.tsx`):
- "Ana says 1/2 + 1/3 = 2/5. She added across. Is that the sum?"
- Picture caption: "Ana added across: 2/5."
- Frame: "Ana's answer, 2/5, is less than [1/3 | 1/2], but more than [1/3 | 1/2]. Adding should make a number [bigger | smaller] than each fraction you add. So Ana's answer is [too small | right | too big]."
- Then, unchanged: "Now find the real sum…", "1/2 + 1/3 = [ ]/6".
- Right: "Yes. 2/5 is more than 1/3, but less than 1/2. 1/2 + 1/3 must be more than 1/2, so adding across gave an answer that is too small. The real sum is 5/6."
- Wrong:
  - Blank 1 or 2: "Look at the bars. Is 2/5 shorter or longer than {pick}?"
  - Blank 3: "Think of 1/2 + 1/3 as 1/2, and then 1/3 more. Is that bigger or smaller than 1/2?"
  - Blank 4: "Read your first sentence again. 2/5 is less than 1/2. Should 1/2 + 1/3 be more or less than 1/2?"
  - Sixths: unchanged.

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | **Pass.** One mid-run failure was in MG7 (`fracBoxes`, the other agent's work in progress). It passed again after they finished. |
| `npx eslint` on every touched TS/TSX file | **Pass:** 0 errors. Only the existing `react-refresh` warnings. |
| `npx vite build` | **Pass.** Only the existing chunk-size warning. |
| Test / unit import check | **Pass.** `WhyNotAcrossTest.tsx` imports only `lib/`, `diagrams/` and `shared/`. |
| `english-check.cjs --grade 5` (unit1, WhyNotAcross, WhyNotAcrossTest) | **Pass:** 56 strings, 0 flagged, 0 over the limit. |
| Brute force: 40,000 Practice problems, 10,000 Unit 1 Tests, 2,000 Module Tests | **Pass: 0 problems.** Splits and checks are below. |
| Browser at iPad portrait 820×1180 with touch | **Pass, 0 failures. 0 visible "a/b" texts** across 24 sweeps. Details are below. |
| Clean-up | The dev server is stopped (port 5291 is closed). The harness files `__harness_mg10r6.html` and `src/__harness_mg10r6.tsx` are deleted. |

**Brute-force results** (`scratchpad/mg10-r6/brute.mjs`):
- **Every combination checked:** each of the 24 pick combinations per problem was graded. Exactly 1 passes, and every wrong combination gets a named message.
- **The add-across value is always strictly between the two fractions.** The addends are never equal.
- **Both comparison sentences are true only for the right picks.**
- **The fraction blanks always show exactly this problem's two fractions.**
- **The longest sentence is 18 words.**

| Split | Practice | Unit 1 Test Q7 | Module Test Q2 |
|---|---|---|---|
| Bigger fraction first in the problem | 49.5% | 50.3% | 49.2% |
| Frame order "less first" / "more first" | 50.3 / 49.7 | 50.0 / 50.0 | 49.1 / 50.9 |
| Blank 1 (fraction): right button in position 1 / 2 | 50.2 / 49.8 | 50.0 / 50.0 | 48.4 / 51.6 |
| Blank 2 (fraction): right button in position 1 / 2 | 50.1 / 49.9 | 49.6 / 50.4 | 51.7 / 48.3 |
| Blank 3 (bigger / smaller): right button in position 1 / 2 | 49.7 / 50.3 | 50.7 / 49.3 | 49.5 / 50.5 |
| Blank 4 (verdict): right button in position 1 / 2 / 3 | 33.5 / 33.1 / 33.4 | 32.5 / 33.7 / 33.8 | 33.0 / 32.0 / 35.0 |

Because the frame order is random, the right fraction for blank 1 is the bigger addend about half the time and the smaller addend the other half.

**What the browser walk covered** (`walk.mjs`):
- **CFU Q1:**
  - Check stays off until every blank is filled.
  - A wrong answer in each of the 5 blanks gets its own message, then right gets "Yes…".
  - The whole CFU passes and stays on screen, and Practice unlocks.
- **Practice, both frame orders:**
  - 4 tap groups and no dropdowns.
  - Check is off with 0 or 1 blanks filled.
  - A wrong answer in each blank turns that blank alone red and gives its named message.
  - The add-across size check appears after a wrong Check, and the hint opens on the 2nd wrong try.
  - Then all right: the answer chip and the explanation show.
- **Unit 1 Test Q7:**
  - It shows the bars, the frame, and no hint or feedback.
  - Answered wrong in blank 1. The review shows "Your answer…" and "Correct answer…" as full sentences, plus the explanation.
- **Module Test Q2:** the frame renders.
- **Console:** the only error is the harness's missing favicon (404).

**Screenshots I looked at** (in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\mg10-r6\shots\`):
- `practice-less-first-wrong1.png`, `practice-more-first-done.png`
- `u1-test-q7.png`, `u1-test-q7-review.png`
- `module-q2.png`
- `cfu-q1-wrong-blank1.png`, `cfu-q1-right.png`

The first walk showed lines starting with a lone "." because each text piece was a separate flex item. I fixed it with the `sentence-frame` CSS, and the re-shot pages wrap like normal text.

## 6. Noticed, not fixed

1. **Some comparisons can't be seen in the bars.**
   - The add-across value can be very close to one of the fractions. For example, in 1/2 + 5/12 = 6/14, the 6/14 bar is about 3 px from the 5/12 bar.
   - The gap is under 6 px in 15.7% of Practice problems, and under 10 px in 26%.
   - The "Look at the bars" message and the hint don't settle those cases by eye.
   - The old "vs smaller" form had the same problem a third of the time. Every problem now asks both comparisons.
   - **Options:** leave out close pairs, or word the message for close cases differently.
2. **CFU Q1's word blanks are dropdowns, while Practice's are tap buttons.**
   - The shared `DropdownQuestion` uses `<select>` for word options, and changing that would affect other labs.
   - The fraction blanks are tap buttons in both places.
3. **The answer chip on a finished frame step is a long sentence** (about 30 words), and the explanation below it repeats the comparison.
4. Still worth a manual pass on a real iPad before calling this done.
