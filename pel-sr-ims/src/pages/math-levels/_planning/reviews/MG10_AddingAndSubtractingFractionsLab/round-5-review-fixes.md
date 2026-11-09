# MG10 Adding & Subtracting Fractions: round 5 review fixes

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (grade 5, 5.NF.1–2)
- **Round:** 5. These fix the round-5 reviews (`round-5-merged.md`, from `round-5-curriculum.md` and `round-5-english.md`). The user-request fixes are in `round-5-fixes.md`.
- **Date:** 2026-11-08
- **Commit:** none

## 1. Summary

**30 Fixed · 0 Partly fixed · 0 Needs decision · 1 Not fixed (C5-06, Ask user, left unchanged as the merged list says).**

Every Minor item is fixed, and so is every Polish item, because each one was cheap. The proposed builder-rule and guideline sentences were not applied, per the merged list.

**The main changes:**
- **"Which picture?" choices:**
  - Each picture is named by its piece size ("The twelfths picture"), never by its fraction, so the finished step no longer shows the sum.
  - Each picture is drawn as a shaded length with no piece lines.
  - The add-across bars appear only after a wrong pick.
- **The rename step:**
  - The prompt is now "Write 2/3 with the same bottom as 5/6."
  - The "fits in" fact ("each third is 2 sixths") moved to the hint.
  - The bars show once, labeled with their own fractions.
  - The two common wrong answers get named feedback.
- **"Fits" problems:** half of them now skip the rename step and ask the sum straight out, as the Test does.
- **The estimate step** compares with 1 whenever the sum is clearly away from 1. "Less than 2" is gone.
- **Test Q9** now uses sums under 1 only.
- **"Fits in"** is defined once in the Unit 1 Explore. Unit 2 opens with a bridge sentence back to Unit 1.

**Where I went past or differed from the agreed change** (each is explained in §2):
- **C5-04:** labels are the original fractions, not the re-cut ones.
- **C5-07:** "clearly away from 1" is now 1/12, not 1/8.
- **C5-03 / E5-02:** I used the curriculum report's prompt wording.
- **C5-03:** I also did the optional "skip the rename half the time".

## 2. Item table

All paths are under `src/pages/math-levels/`. `L` is `MG10/AddingAndSubtractingFractionsLab/`.

| ID | Status | What changed | Where |
|---|---|---|---|
| C5-01 + E5-01 | Fixed | Picture choices are labeled "The {pieces} picture", so the finished chip reads "The twelfths picture". The explanation no longer prints the sum: "It shows the two parts in twelfths: 1/3 is 4 twelfths and 1/4 is 3 twelfths. Adding across gives 2/7, which is too small." Brute force: no label has a digit, and the explanation never contains the sum (40,000 problems). | `L/lib/unit1.tsx` `pickPictureStep` |
| C5-02 | Fixed | (a) The choices are drawn with the new lab-local `AmountBar`: a shaded length with whole-bar outlines only, so no piece lines. Each choice has the same number of wholes. (b) The add-across `SizeCheckBars` shows on step 3 only after a wrong pick (`pointing(help, 2)`). | `L/diagrams/AmountBar.tsx` (new), `L/units/WhyNotAcross.tsx` visual (`across`) |
| C5-03 + E5-02 | Fixed (differs, see note 1) | The rename prompt is now "Write {nS/dS} with the same bottom as {other}." The renaming fact went to the hint and the explanation. CFU Q2 now reads "3 fits in 9: 3 × 3 = 9. So the picture cuts each third into ninths." Also, half of "fits" Practice problems skip the rename step and ask "Add: a + b = ? …" with a hint that names the renaming. | `L/lib/unit1.tsx` `renameStep`, `sumStep` (`SumMode`); `L/units/WhyNotAcross.tsx` `makeProblem`, CFU Q2 |
| C5-04 | Fixed (differs, see note 2) | The rename step shows one set of cut bars, with no size check (the size check is only on step 2 now). The cut bars keep their own fraction's label (2/3, 1/6) until the problem is solved, through the new optional `RecutBars.originalLabels`. | `L/diagrams/RecutBars.tsx`, `L/units/WhyNotAcross.tsx` visual |
| C5-05 | Fixed | New `u1RenameDiagnose`, passed through a new optional `numeratorStep` argument. (1) Kept the old top: "That's the old top. Each fifth is 2 tenths. How many tenths are in 2 fifths?" (2) Typed one piece, when the top is more than 1: "That's 1 fifth. You have 2 fifths." | `L/lib/fractions.ts`, `L/lib/steps.tsx`, `L/lib/unit1.tsx` |
| C5-06 | Not fixed (Ask user) | Unchanged. | — |
| C5-07 | Fixed (see note 3) | `estimatePlan`: when the sum is ≥ 1/12 away from 1, the question compares with 1 (under 1 → Less, over 1 → More). Otherwise, near 1 or exactly 1, it compares with the bigger fraction (More). The "less than 2" question is removed. Unit 1 Test Q1 and Module Test Q1 use the same builder. | `L/lib/unit1.tsx` `estimatePlan`, `estimateStep` |
| C5-08 + E5-07 | Fixed | CFU Q4: a typed 4/6 (or 2/3) gets "You added across. 4/6 is less than 3/4, but adding should make a bigger number. 1/2 = 2/4, so add fourths." Every other wrong sum now starts "Not yet." instead of "Close." | `L/units/WhyNotAcross.tsx` CFU Q4 `bad` |
| C5-09 | Fixed | Test Q9 (`addAcrossChoiceQuestion`) draws from `fitsUnder1` only, so all three choices are plain fractions (brute force: 5,000 runs, 0 whole or mixed). | `L/units/WhyNotAcrossTest.tsx` |
| C5-10 + E5-05 | Fixed | **Unit 1 Explore, "Same-size pieces" view:** a definition line, "One bottom fits in another when a whole number times it makes the other. 2 fits in 6, because 2 × 3 = 6." The "neither fits" line reads "2 doesn't fit in 3: no whole number times 2 makes 3. And 3 is bigger, so it can't fit in 2. …" **Unit 2 Explore** opens with "In Unit 1, the picture cut 1/3 and 1/4 into twelfths so you could add them. Now you will find those pieces yourself." It also adds "*Goes into* means the same as *fits in* from Unit 1." | `L/units/WhyNotAcross.tsx` Explore; `L/units/CommonDenominators.tsx` Explore |
| C5-11 + E5-10 | Fixed | The sum prompt is "Add: a + b = ? Write it in simplest form." "Now" is gone everywhere: Practice, Test Q3/Q4 and Module Test Q3. | `L/lib/unit1.tsx` `sumStep` |
| C5-12 | Fixed | With 12 or more pieces in a whole, the bars are 240 wide: Practice bars and picture choices, and Test Q2, Q3, Q5 and Q6 (`widthFor`). | `L/units/WhyNotAcross.tsx`, `L/units/WhyNotAcrossTest.tsx` |
| C5-13 + E5-13 | Fixed | New optional 3rd argument `FractionStep.diagnose(num, den, typed?)`. `StepProblem` passes the answer as typed. `resultDiagnose` and `u1SumDiagnose` quote it ("3/3 is more than 5/6…", "8/18 is less than 7/12…"). The `SizeCheckBars` "your answer" row label uses the typed text too (new `typedText`). | `shared/engine/types.ts`, `shared/engine/StepProblem.tsx`, `L/lib/fractions.ts`, `L/units/WhyNotAcross.tsx`, `L/units/AddSubtractUnlike.tsx` |
| C5-14 | Fixed | CFU Q1 gets a typed third part. Under "Now find the real sum. This picture cuts both bars into sixths:" it shows the 1/2 and 1/3 bars re-cut into sixths, plus a "together" bar, and asks "1/2 + 1/3 = [ ]/6". Wrong: "Not yet. Count the shaded sixths in the bar with both colors." The right-answer message ends "The real sum is 5/6." | `L/units/WhyNotAcross.tsx` CFU Q1 |
| E5-03 | Fixed | Count step: "Count the shaded twelfths in the bar with both colors. Write a + b in simplest form." It says "the bars" when the sum passes 1. Hint: "12 twelfths make 1 whole bar. Count the shaded twelfths in the bar with both colors." The count picture (Practice and Test Q6) labels the bars 1/3, 1/4 and "together". | `L/lib/unit1.tsx` `sumStep`; `RecutBars originalLabels` |
| E5-04 | Fixed | Rename hint: "{fits fact} Find the bar with thick lines. Count the small pieces in its shaded part." CFU Q2 wrong: "Not quite. Count the small pieces in the shaded part of the bar with thick lines." | `L/lib/unit1.tsx`, `L/units/WhyNotAcross.tsx` |
| E5-06 | Fixed | The Practice label "Bottoms share no factor" is now "Neither bottom fits in the other". | `L/units/WhyNotAcross.tsx` |
| E5-08 | Fixed | The CFU feedback says "One format is not right…", "{n} formats are not right…" and "Every format you picked is right…". The radio group's screen-reader name is now "Format" (CFU: "{label}: format"). Both only appear inside `<AnswerFormPick>`, so only MG10 is affected. | `shared/components/CfuQuestion.tsx`, `shared/components/AnswerForm.tsx` |
| E5-09 | Fixed | When there is a named mistake and the format is wrong, the feedback now ends with "The correct answer is not a {format}." On the 2nd try it adds "It is a {format}." The question is dropped. With no named mistake it reads "The correct answer is not a …", followed by the existing question. This code only runs inside `<AnswerFormPick>`. | `shared/engine/StepProblem.tsx` `checkFormFraction` |
| E5-11 | Fixed | Above 48 pieces, the Explore shows one paragraph and hides the "thick lines" line. The paragraph: "7 doesn't fit in 9: no whole number times 7 makes 9. Same-size pieces would need 63 pieces in each bar. That's too many to draw. In Unit 2, you will learn how to find these pieces." | `L/units/WhyNotAcross.tsx` Explore |
| E5-12 | Fixed | Unit 5 CFU Q2: "Estimate 1/8 + 3/5. Use the benchmarks 0, 1/2, and 1." | `L/units/WordProblems.tsx` |
| E5-14 | Fixed | The "vs smaller" judge explanation: "2/7 is more than 1/4, but less than 1/3. 1/3 + 1/4 must be more than 1/3, so adding across gives an answer that is too small." | `L/lib/unit1.tsx` `judgeStep` |
| E5-15 | Fixed | "Put the two shaded parts end to end. They fill less than 1 whole bar. So the sum is less than 1." | `L/lib/unit1.tsx` `estimateStep` |
| E5-16 | Fixed | Key idea: "…is not 2/5. 2/5 is less than 1/2 alone!" and "When one bottom fits in the other, cut the bigger pieces to match the smaller ones: …". | `L/units/WhyNotAcross.tsx` |
| E5-17 | Fixed | Unit 3 Explore step 4, whole-number case: "6/6 = **1**. Format: **whole number**." The extra sentence is gone. | `L/units/AddSubtractUnlike.tsx` |

(E5-01/02/03/04/05/07/10/13 are counted with their paired C5 IDs above, so the 31 IDs total 30 Fixed and 1 Not fixed.)

**Notes on differences from the agreed change:**
1. **C5-03 / E5-02, the prompt wording.**
   - **What I used:** the curriculum report's "Write 2/3 with the same bottom as 5/6."
   - **What I didn't use:** the English report's "2 fits in 6. Write 1/2 in sixths."
   - **Why:** the merged rule says the curriculum report decides what a step asks. "2 fits in 6" still tells the student which fraction to rename, and the Test never says that.
   - The hint has the full fact. The Unit 1 Test Q2 uses the same builder, so it no longer states the answer when the top is 1.
2. **C5-04, the labels.**
   - **The suggestion:** `hideLabels={fits ? done < 2 : done < 4}`.
   - **Why I didn't use it:** that would have labeled the cut bars with their *re-cut* fractions (4/6) during the rename step. That prints the answer.
   - **What I did instead:** added `originalLabels`. The bars keep "2/3" and "1/6" until the problem is solved.
3. **C5-07, the threshold.**
   - **What the agreed rule gives:** with the old "clearly" threshold of 1/8, the estimate was More 61.5%, Less 38.5%.
   - **What I changed:** the threshold is now 1/12. That is still a gap of 15 px or more on the end-to-end bar.
   - **The result:** More 52.8%, Less 47.2% (40,000 problems).
   - Per bucket the answer follows the size: fitsUnder1 is always Less; fitsOneOrMore and noShareOver1 are always More; noShareUnder1 is 89% Less. Each Practice type mixes an under-1 bucket with a 1-or-more bucket, and the student isn't told which.

## 3. Changed files

**Shared.** Each change is opt-in or additive.

- `shared/engine/types.ts`:
  - `FractionStep.diagnose` takes an optional 3rd argument, `typed`.
  - Used by **every lab's types**. Diagnoses that ignore it are unchanged.
- `shared/engine/StepProblem.tsx`:
  - New `typedText` helper. `checkFraction` and `checkFormFraction` now pass `typed`.
  - The format-message wording changed (E5-09).
  - **Used by every lab.** The wording change is only inside `checkFormFraction`, which runs only inside `<AnswerFormPick>` (**MG10 only**). The extra argument is ignored by every other lab's diagnoses.
- `shared/components/CfuQuestion.tsx`: "kind of answer" → "format". This only shows for `<AnswerFormPick>` blanks (**MG10 only**).
- `shared/components/AnswerForm.tsx`: the `FormPicker` default `label` changed to "Format". It only renders inside `<AnswerFormPick>` (**MG10 only**).

**MG10** (`L` = `MG10/AddingAndSubtractingFractionsLab/`):
- `L/diagrams/AmountBar.tsx` (**new**), `L/diagrams/index.ts`, `L/diagrams/RecutBars.tsx` (`originalLabels`).
- `L/lib/unit1.tsx`, `L/lib/fractions.ts` (`typedText`, `u1RenameDiagnose`, `typed` in `resultDiagnose` / `u1SumDiagnose`), `L/lib/steps.tsx` (`numeratorStep` diagnose).
- `L/units/WhyNotAcross.tsx`, `L/units/WhyNotAcrossTest.tsx`, `L/units/CommonDenominators.tsx`, `L/units/AddSubtractUnlike.tsx`, `L/units/WordProblems.tsx`.
- `L/units/ModuleTest.tsx`: not edited. Its Unit 1 questions change through the shared builders (estimate, sum prompt, picture choice, picture width).

**Docs:**
- `MATH_TSX_STYLE_GUIDE.txt`: "format" wording, and `diagnose`'s `typed`.
- `VISUAL_COMPONENT_TODO.txt`: a round-5 review note (`AmountBar`, `originalLabels`).

**Not touched:** MG9, MG11 and the builder file. The git changes in MG9 and MG11 are from the other agent.

## 4. New or rewritten student text

**Unit 1 Practice and Test** (`lib/unit1.tsx`):
- **Estimate explanation:** "Put the two shaded parts end to end. They fill {more/less} than 1 whole bar. So the sum is {more/less} than 1."
- **Estimate hint:** "Picture the two shaded parts end to end. Compare that with {the big bar / 1 whole bar}." (Only the "2" branch was removed.)
- **Judge, the "vs smaller" explanation:** "{X} is more than {small}, but less than {big}. {a + b} must be more than {big}, so adding across gives an answer that is too small."
- **Rename:**
  - Prompt: "Write {nS/dS} with the same bottom as {other}."
  - Hint: "{dS} fits in {L}: each {piece} is {k} {pieces}. Find the bar with thick lines. Count the small pieces in its shaded part."
  - Explanation: "{dS} fits in {L}: each {piece} is {k} {pieces}. So {nS/dS} = {nS·k/L}."
- **Rename wrong answers:**
  - "That's the old top. Each {piece} is {k} {pieces}. How many {pieces} are in {nS} {piece(s)}?"
  - "That's 1 {piece}. You have {nS} {pieces}."
- **Sum, straight out** (Test and half of "fits" Practice):
  - Prompt: "Add: {a + b} = ? Write it in simplest form."
  - Hint: "{dS} fits in {L}: each {piece} is {k} {pieces}. Write both in {pieces}, then add the tops."
  - Explanation: "{a + b} = {a'/L} + {b'/L} = {s/L} = {simplest}."
- **Sum after the rename step:** the prompt is "Add: …". The hint is unchanged.
- **Count step:**
  - Prompt: "Count the shaded {pieces} in the bar(s) with both colors. Write {a + b} in simplest form."
  - Hint: "{L} {pieces} make 1 whole bar. Count the shaded {pieces} in the bar(s) with both colors."
- **Picture choices:**
  - Labels: "The {pieces} picture".
  - Explanation: "It shows the two parts in {pieces}: {a} is {n} {pieces} and {b} is {m} {pieces}. Adding across gives {mn/md}, which is too small."

**Unit 1 CFU** (`units/WhyNotAcross.tsx`):
- **Q1, new part:**
  - "Now find the real sum. This picture cuts both bars into sixths:" and "1/2 + 1/3 = [ ]/6".
  - Wrong: "Not yet. Count the shaded sixths in the bar with both colors."
  - The right-answer message adds "The real sum is 5/6."
- **Q2:**
  - "Find 1/3 + 1/9. 3 fits in 9: 3 × 3 = 9. So the picture cuts each third into ninths."
  - Wrong: "Not quite. Count the small pieces in the shaded part of the bar with thick lines."
- **Q4:**
  - Add-across: "You added across. {typed} is less than 3/4, but adding should make a bigger number. 1/2 = 2/4, so add fourths."
  - Other wrong sums: "Not yet. 2 fits in 4, so write 1/2 in fourths first: 1/2 = 2/4. Then add the fourths. 4 fourths make 1 whole."

**Unit 1 Explore and key idea:**
- "One bottom **fits in** another when a whole number times it makes the other. 2 fits in 6, because 2 × 3 = 6."
- "{dS} doesn't fit in {dB}: no whole number times {dS} makes {dB}. And {dB} is bigger, so it can't fit in {dS}. The picture still cuts both bars into the same-size pieces, so you can count them. In Unit 2, you will learn how to find these pieces."
- Above 48 pieces: "{dS} doesn't fit in {dB}: no whole number times {dS} makes {dB}. Same-size pieces would need {L} pieces in each bar. That's too many to draw. In Unit 2, you will learn how to find these pieces."
- Key idea: "… is not 2/5. 2/5 is less than 1/2 alone!" and "When one bottom fits in the other, cut the bigger pieces to match the smaller ones: …"

**Practice label:** "Neither bottom fits in the other".

**Unit 2 Explore:**
- "In Unit 1, the picture cut 1/3 and 1/4 into twelfths so you could add them. Now you will find those pieces yourself."
- "*Goes into* means the same as *fits in* from Unit 1."

**Unit 3 Explore step 4 (whole number):** "{r/L} = **{w}**. Format: **whole number**."

**Unit 5 CFU Q2:** "Estimate 1/8 + 3/5. Use the benchmarks 0, 1/2, and 1."

**Shared format feedback (MG10 only):**
- "One format is not right. Look at the red button." / "{n} formats are not right. Look at the red buttons." / "Every format you picked is right. Check the numbers."
- "{named mistake} The correct answer is not a {format}." (2nd try adds "It is a {format}.")
- "The correct answer is not a {format}. Is it more than 1, less than 1, or a whole number?" / "The correct answer is not a {format}. It is a {format}."
- Screen readers hear "Format" / "{label}: format".

**Add-across messages now quote the answer as typed:** "You added across. 8/18 is less than 7/12, …" and "You subtracted across. 3/3 is more than 5/6, …".

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | **Pass**. I ran it again after the last code edit. |
| `npx eslint` on every touched file | **Pass**: 0 errors. Only the existing `react-refresh/only-export-components` warnings. |
| `npx vite build` | **Pass**. Only the existing chunk-size warning; no per-import warnings. |
| Test / unit import check | **Pass**. `WhyNotAcrossTest.tsx` imports only `lib/`, `diagrams/` and `shared/`. |
| Brute force: Practice (`scratchpad/mg10-r5rev/practice.mjs`, 10,000 per bucket = 40,000 problems, plus 56,200 Unit 3 diagnoses) | **Pass: 0 problems.** See the details after this table. |
| Brute force: Test (`test.mjs`, 5,000 Unit 1 Tests and 2,000 Module Tests) | **Pass: 0 problems.** Every right answer is accepted, there are no choice collisions, and Q2 and Q6 use `originalLabels`. Q5 has no numbers in its labels and no piece lines. Q9 is always proper. |
| `english-check.cjs --grade 5` on the changed files | **Pass**: 248 strings, 0 over the limit. All 11 flags are old lines (ratio, "can both be divided by", "left over", "difference between"). |
| Browser, iPad portrait 820×1180 with touch (temporary harness, `walk.mjs`) | **Pass, with 0 visible "a/b" texts across the whole walk.** See the list after this table. |
| MG9 / MG11 | **Pass**. Both render with 0 format buttons, lines or guides. I didn't edit them. |
| Clean-up | The dev server is stopped. The harness files (`__harness_mg10r5rev.html`, `src/__harness_mg10r5rev.tsx`) are deleted. |

**Brute-force results:**
- **Answers:** every answer is right. The add-across value never equals the sum.
- **Sum size:** under 1 50.0% · exactly 1 12.6% · over 1 37.4%.
- **Steps per problem:** "fits" problems are 4 steps (with rename) half the time and 3 steps half the time. "Neither fits" problems are always 4 steps.
- **Format of the typed sum:**
  - Fits, with rename: proper 49.8%, whole 25.5%, mixed 24.7%.
  - Fits, straight out: proper 50.2%, whole 24.8%, mixed 24.9%.
  - Neither fits: proper 50.0%, mixed 50.0%.
- **Choice balance:**
  - Estimate: More 52.8%, Less 47.2%. By question: "less than 1" 47.2%, "more than 1" 34.6%, "more than the bigger fraction" 18.2%. "Than 2" is never asked.
  - Judge: 33.5% / 33.1% / 33.4%.
  - Picture: the right button is in each position 32.6–34.3% of the time.
- **Rename:** the prompt never contains "fits in" or the answer. Both named messages fire.
- **Picture choices:** the labels are distinct, have no digits, and the pictures have no piece lines. The explanation never prints the sum.
- **Format messages (E5-09):** with a wrong format, the message never ends with a question.
- **Typed echo:** add-across answers are quoted as typed, both unreduced and reduced (Unit 1 and Unit 3).
- **Sentence length:** the longest generated sentence is 18 words.

**Unit 1 Test, 5,000 runs:**
- Format: Q3 proper 33.3%, whole 33.8%, mixed 32.9%. Q4 proper 31.6%, whole 34.8%, mixed 33.7%. Q6 proper 48.7%, mixed 51.3%.
- Right choice: Q1 Less 48.5%, More 51.5%. Q5, Q7, Q8, Q9 and Q10 put the right answer in each position 32–35% of the time.
- Module Test Unit 1 question 3 format: proper 32.1%, whole 33.6%, mixed 34.3%.

**What the browser walk covered:**
- **Unit 1 Explore:**
  - the "fits in" definition line;
  - (2,3), (2,6), and (7,9), where there is no picture and no "thick lines" line.
- **Unit 1 CFU:**
  - Q1 typed sixths, wrong then right;
  - Q2's prompt and labels, wrong then right;
  - Q4: 4/6 → "You added across. 4/6 is less than 3/4…"; 1/2 → "Not yet…"; then right.
  - 4/4 pass, the CFU stays on screen, and Practice unlocks.
- **All three Practice shapes,** wrong at every step:
  - "Neither fits", 4 steps: the size check isn't shown on step 3 before a wrong pick. After a wrong pick it shows with the end-to-end bar. The chip reads "The sixths picture". The count prompt names "the bar with both colors".
  - "Fits with rename", 4 steps: the bars show once, labeled 1/3 and 2/9. Keeping the old top gets "That's the old top…".
  - "Fits straight", 3 steps: "Add: 2/5 + 6/10 = ?…". The add-across answer with a wrong format gets "…The correct answer is not a proper fraction."
  - Each helped solve gives "Solved, with help.". "Try one like it" then gives a clean "Solved it! ⭐".
- **Unit 1 Test:** no hints and no feedback. The format line shows.
- **Unit 2 Explore:** the bridge sentence and the "goes into" line.
- **Unit 3 Add:** a typed 5/15 → "You added across. 5/15 is less than 4/9…". The picture row is labeled 5/15.
- **Unit 5 CFU Q2:** the new instruction. 3 wrong formats → "3 formats are not right. Look at the red buttons."
- **Console:** the only error is the harness's missing favicon (404).

**Screenshots I looked at** (in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\mg10-r5rev\shots\`):
- `u1-t1-4steps-3-pictures.png`: three lines-free bars.
- `u1-t1-4steps-3-picture-wrong.png`: the end-to-end bar plus the size check after a wrong pick.
- `u1-test-q5.png`: two-whole choices at 240.
- `u1-t0-4steps-3-rename-wrong.png`: one set of labeled cut bars, plus the named message.
- `u1-cfu-q1.png`.
- `u1-explore-same-79.png`.
- `u1-test-q6.png`: bars labeled 1/2, 2/5 and "together".

## 6. Noticed, not fixed

1. **The choice buttons shrink the `AmountBar`s a little** (about 170 px for a 180 bar, about 195 px for a 240 bar), so the choice lengths aren't pixel-for-pixel the same as the problem's bars. Each whole is still one bar, so the amounts compare by proportion.
2. **The right picture is never the shortest**, because the add-across picture is always the smallest. A student who has learned "not the shortest" has a 1-in-2 guess. The right picture is the longest 57.5% of the time. A fix would need a fourth or different distractor; that is a design choice for the reviewers.
3. **Each bucket's estimate answer is fixed by its size** (fitsUnder1 is always Less; the 1-or-more buckets are always More). The student can't see the bucket, and each Practice type mixes both, but the reviewers may want to judge it.
4. **The "together" row label renders larger and bold inside the CFU box** (existing `RecutBars` styling in `.cfu-line`). It reads fine, but looks heavier than in Practice.
5. **The rename hint states the answer when the top is 1** ("Each half is 3 sixths"). This is help after a wrong try or a hint, so the solve is already not clean.
6. **Round 5 note 2 is still there:** after a wrong typed sum in a "fits" problem, the "together" bar appears. The "straight out" problems now do this too, since they share the code.
7. **C5-06** (each judge form always has the same answer) is waiting on the user.
8. **Not applied, per the merged list:** the proposed builder-rule and guideline sentences in both reports.
9. Still worth a manual pass on a real iPad before calling this done.
