# MG10 Expressions & Patterns: round 3 fixes (final round)

- Lab: MG10 `NumericalExpressionsAndPatternsLab`, Grade 5 (4th-and-up band, no read-aloud)
- Round: 3 · Date: 2026-11-14 · Work order: `round-3-merged.md` (10 items, all Fix)
- Paths are relative to `src/pages/math-levels/MG10/NumericalExpressionsAndPatternsLab/` unless they start with `shared/`.

## 1. Summary

**10 items: 10 Fixed · 0 Partly fixed · 0 Needs decision · 0 Not fixed.**

All checks pass:
- tsc
- eslint (0 errors)
- vite build
- a brute-force run with 0 failures
- english-check (0 sentences over the limit, no new flags)
- 38 of 38 browser checks at iPad portrait, with 0 console errors

No shared code changed this round.

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| C3-01 (+ E3 out-of-lane) | Fixed | Ty's case is now drawn by itself (`changeCompare()`, 50/50), not as the opposite of steps 1–2. Ty's pair is still drawn and ringed. The story now ends "Then Ty tries his own numbers." The wrap-up is unchanged. The `changeCompare` doc comment is updated. | `units/ReadingExpressions.tsx:507-519`; `lib/reading.ts:114-119` |
| C3-02 | Fixed | Explore Part 2 now has three modes:<br>• "× copies": Copies and Copies to compare, the first bar set, and the compare sentence.<br>• "bigger group": its sentence, the Copies stepper, "New big numbers" and its bar set.<br>• "÷ equal parts": unchanged.<br>No new controls. The Segmented's aria-label changed from "Multiply or divide" to "What to compare", because the new mode is not about dividing. | `units/ReadingExpressions.tsx:162-163, 257-325` |
| E3-33 | Fixed | The either-case wrap-up now reads " With the new numbers, both places give {V}, so moving the parentheses did not change the value." It uses the real target. | `units/WhyParentheses.tsx:369-371` |
| E3-34 | Fixed | The step 4 prompt now reads "Both places work. Find the value of the part in parentheses in each one." | `units/WhyParentheses.tsx:348` |
| E3-35 + C3-03 | Fixed (combined) | Q3 now starts "Here are two new patterns." Pattern B shows as 0, 4, ?, ?, and the rule "start 0, add 4" stays visible. The miss message is "Use the 3rd and 4th columns of this table. Pattern B adds 4 each time. Pattern A's term comes first." The two agreed messages are merged into one. | `units/Patterns.tsx:85-89, 113` |
| C3-04 | Fixed | The first trap is now "B starts {k} higher than A and adds the same number as A." It is false for every times pair, because B adds k × A's number. "It works in the first column, so it works in every column." is kept. | `lib/patternSteps.ts:105-108` |
| C3-05 | Fixed | The Unit 1 Key Idea adds: "With only + or only ×, the parentheses can go in either place. The value stays the same." | `units/WhyParentheses.tsx:423` |
| E3-36 | Fixed | "The question asks…" is now "The blank asks…". | `lib/reading.ts:35` |
| E3-37 | Fixed | In the `addDouble` diagnose, if the 2 is the number outside the parentheses and its sign isn't ×, the student gets "\"Double it\" means multiply by 2." For example, (13 + 7) + 2, 2 − (13 + 7) and (13 + 7) ÷ 2. The capital D stays, because the message starts a sentence. | `lib/reading.ts:192-197` |

**Follow-through:**
- `whyTimesStep` also feeds the Unit 5 Test and the Module Test, so the new trap appears there too. The brute force checks it.
- `buildStep` is shared by Practice, the Unit 3 Test and Module Test Q11, so the new message appears in all three.
- The Unit 3 Test's `changeStep()` was already an independent 50/50. It is unchanged.
- The CFU → bucket → Test map is unchanged.
- The CFU Q3 typed blanks now need Pattern B's rule, so the ≥ 40% typed rule is stronger, not weaker.

## 3. Changed files

All files are lab files. No shared files changed, so no other lab is affected.
- `lib/reading.ts`
- `lib/patternSteps.ts`
- `units/ReadingExpressions.tsx`
- `units/WhyParentheses.tsx`
- `units/Patterns.tsx`

## 4. New or rewritten student text

**Unit 1** (`units/WhyParentheses.tsx`):
- Step 4 prompt (either case): "Both places work. Find the value of the part in parentheses in each one."
- Wrap-up (either case): "With the new numbers, both places give {V}, so moving the parentheses did not change the value."
- Key Idea: "With only + or only ×, the parentheses can go in either place. The value stays the same."

**Unit 3**:
- Move the parentheses, story (`units/ReadingExpressions.tsx`): "Same three numbers, same signs. Only the parentheses move. Then Ty tries his own numbers."
- Explore Part 2 mode label: "bigger group". The sentence in this mode is unchanged; it moved from the "× copies" view.
- `lib/reading.ts`, `timesStep` diagnose: "That's a value you worked out. The blank asks how many TIMES as large. Count the copies instead."
- `lib/reading.ts`, build step: "\"Double it\" means multiply by 2." The text is the same as before; it now also fires for a wrong sign next to the 2.

**Unit 5**:
- CFU Q3 (`units/Patterns.tsx`), first sentence: "Here are two new patterns."
- CFU Q3 miss message: "Use the 3rd and 4th columns of this table. Pattern B adds 4 each time. Pattern A's term comes first."
- Why-step trap (`lib/patternSteps.ts`): "B starts {k} higher than A and adds the same number as A."

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Pass |
| `npx eslint` on the 5 changed files | Pass: 0 errors. The 9 warnings are all the existing `react-refresh/only-export-components` pattern. |
| `npx vite build` | Pass. Only the existing warnings: the historicalProgressService dynamic import and chunk size. No "does not provide an export". |
| Test/unit import check | Pass: no `*Test.tsx` imports from its unit file. |
| Brute force (scratch esbuild bundle) | **Pass, 0 failures.** See below. |
| `english-check.cjs --grade 5` on the 5 changed files | Pass: 133 strings, 0 over the limit. The only 2 flags are the existing ones ("in ALL the bags" story, the U1 CFU true/false). |
| Browser: Playwright, temporary harness, iPad portrait 820×1180, touch on | **38 of 38 pass, 0 console errors.** The first driver for the why step went through Show answer and never reached the step. A second, focused probe answered steps 1–2 and reached it. See below. |

**Brute-force scope:**
- 3,000 Practice problems per type in Units 1, 3 and 5.
- 1,500 draws of every unit Test and the Module Test.
- For each draw: every right answer passes the grader (builds, frames and plots included), with no duplicate choices, no NaN/undefined and no slash fractions.

**Brute-force item checks:**
- **C3-01:** 20,000 Move problems. The steps 1–2 result → Ty's result split was:

  | Steps 1–2 | Ty: changes | Ty: stays the same |
  |---|---|---|
  | changes | 4,977 | 4,969 |
  | stays the same | 5,026 | 5,028 |

  So Ty's case is 50/50 and independent of steps 1–2. Ty's pair is drawn at step 3 in every problem.
- **C3-04:** In 10,000 times pairs, B.add ≠ A.add every time, so the new trap is always false. Two choices contain "{k} " in every draw. The right choice sits in each position about ⅓ of the time (3261 / 3353 / 3386).
- **E3-37:** 10,000 draws of each template.
  - For addDouble, (a + b) o 2 and 2 o (a + b), with o = +, − or ÷, always get the "Double it" message.
  - The commuted right build (b + a) × 2 is accepted.
  - A wrong addend still gets "Check the numbers…" (10,000 of 10,000).
  - A wrong inner sign with × 2 never gets the double message.
  - No other template ever gets the double message.
- **E3-33 / E3-34:** The either case is 24.5% of "Parentheses first". The wrap-up always says "With the new numbers, both places give V, …", where V equals the placement step's target. The old "either place" wrap-up never appears. Step 4 always uses the new prompt.
- **E3-36:** The `timesStep` diagnose has "The blank asks".

Sample sentences were printed for each changed template and read; all are grammatical.

**Browser checks** (harness rendering the lab through a dynamic import, guest progress; U1/U3 CFUs seeded as passed, U5 not):
- **U3 Explore Part 2:**
  - It has three modes.
  - "× copies" has two steppers and one bar set, and no bigger-group sentence. Its compare sentence shows when Copies to compare = 2.
  - "bigger group" has only the Copies stepper, "New big numbers" and one bar set. Its bars and sentence follow the stepper (3 → 4). New big numbers changes them.
  - "÷ equal parts" is unchanged.
  - No slash fractions.
- **U3 Move the parentheses:**
  - The story shows the new sentence.
  - Help ladder, step 1: a wrong try gets feedback. After 3 wrong tries, Show answer appears.
  - Ty's pair is drawn at step 3. A wrong pick rings it.
  - The wrap-up says "Solved, with help." "Try one like it" gives another Move problem.
  - A clean solve gives "Solved it!".
  - 8 more problems were solved in the browser. Ty's result varied, independent of steps 1–2.
- **U3 build:** (9 + 4) + 2 gives "\"Double it\" means multiply by 2." Changing the sign to × moves on to the value step.
- **U1 Parentheses first, either case:**
  - Step 4 shows the new prompt.
  - A wrong value gets feedback.
  - The wrap-up reads "… With the new numbers, both places give 9, so moving the parentheses did not change the value."
  - The Key Idea shows the new line.
- **U5 CFU:**
  - Practice is locked before the CFU.
  - Q3 starts "Here are two new patterns."
  - Pattern B shows 0, 4, ?, ?, and "start 0, add 4" is visible.
  - A wrong pair gives the new red message, with a red border on the wrong box only. The right pairs plus the plot grade green.
  - Practice opens after the CFU.
  - The passed CFU stays on screen (`cfuJustPassed` latch) and closes after leaving Explore.
  - No slash fractions.
- **U5 why step:** A Two rules "times" problem shows the new trap "B starts 2 higher than A and adds the same number as A." next to the right choice and the first-column trap.

Screenshots (all looked at), in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\4a0a5ada-0427-4375-a535-7a7815b05751\scratchpad\r3\shots\`:
- U3 Explore: `u3-explore-times.png`, `u3-explore-bigger.png`, `u3-explore-divide.png`
- U3 Practice: `u3-move-step3.png`, `u3-move-step3-wrong.png`, `u3-move-done.png`, `u3-build-double-plus2.png`
- U1: `u1-either-step3.png`, `u1-either-step4-wrong.png`, `u1-either-done.png`, `u1-key-idea.png`
- U5: `u5-cfu-q3-wrong.png`, `u5-cfu-q3-right.png`, `u5-why.png`

The temporary harness (`src/harness-nep.tsx`, `harness-nep.html`) is deleted, and the dev server on port 5199 is stopped. The scratch scripts are left in the session scratchpad only, outside the repo.

## 6. Noticed, not fixed

- **U3 CFU Q2** (`units/ReadingExpressions.tsx:68`): The miss message "You worked it out. The question asks how many TIMES as large." has the same wording issue as E3-36. Q2 is also a fill-in frame, so "The blank asks" would fit. The merged list didn't include it.
- **E3-37 edge:** When the 2 is outside with the wrong sign but the grouping is also wrong, for example 2 + (9 × 4), the student gets the "Double it" message, not the regroup message. That message is still the right first nudge.
- **U3 Explore "× copies" with Copies to compare = 1:** The top bar is the group itself (label "18,932 + 921"), which matches the sentence above it. No change needed. Noted only because this view is new.
- **Proposed rules:** The four proposed rule and guideline changes in `round-3-merged.md` still wait for Stage 6.
