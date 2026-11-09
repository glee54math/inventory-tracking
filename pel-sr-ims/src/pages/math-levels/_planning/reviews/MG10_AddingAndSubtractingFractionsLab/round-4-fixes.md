# MG10 Adding & Subtracting Fractions: round 4 fixes (user request)

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (grade 5, 5.NF.1–2)
- **Round:** 4, a user request (`round-4-user-request.md`, item U4-01). I didn't touch C1-20 or C1-03, which are still on hold.
- **Date:** 2026-11-07

## 1. Summary

**1 Fixed (U4-01) · 0 Partly fixed · 0 Needs decision · 0 Not fixed.**

Every MG10 fraction answer now starts with three tap buttons: **Whole number · Mixed number · Proper fraction**. Each button shows a small stacked example (2 · 1 ¾ · ¾). This covers Practice, the U5 CFU Q2 boxes, all four Unit Tests that have typed answers, and the Module Test.

- No kind is picked at the start.
- The boxes appear only after a kind is picked.
- Check stays gray until every box shown is filled.
- Feedback says whether the picked kind was right, as well as whether the numbers were right.

The feature is a shared opt-in. Only MG10 turns it on, and MG9 and MG11 are unchanged.

**How often each kind is the right answer, by Practice problem type** (brute force, 4,000 draws per bucket):

| Unit | Practice type | Whole | Mixed | Proper |
|---|---|---|---|---|
| U1 | all 4 types | 0% | 0% | **100% (always proper)** |
| U3 | Add | 0% | 33% | 67% |
| U3 | Subtract | 33% | 0% | 67% |
| U4 | Add | 0% | **100% (always mixed)** | 0% |
| U4 | Subtract | 0% | 73% | 27% |
| U5 | Short stories | 0% | 27% | 73% |
| U5 | Mixed-number stories | 0% | 92% | 8% |
| U5 | Does it make sense? | 0% | 68% | 32% |

**Giveaways.** In these types one kind is always right. I'm reporting them as the work order asked, not fixing them.

- **U1, every Practice type, and U1 Test Q2–Q5: always "proper fraction".** All U1 sums are less than 1 by design.
- **U4 Add: always "mixed number".**
- **Inside single buckets**, the kind is also fixed. That matters because each Unit Test question is drawn from one fixed bucket:
  - U3 addPlain, addSimplify, subPlain, subSimplify: always proper.
  - U3 addMixed: always mixed.
  - U3 subWhole: always whole.
  - U4 subNoBorrow: always mixed.
  - U5 leftOrMore: always proper.
- **The Unit Tests ask their questions in a fixed order**, so a student who retakes a test will meet the same kind in the same place:
  - U3 Test: Q1, Q2, Q4, Q5 proper; Q3 mixed; Q6 whole.
  - U4 Test: Q1–Q3 mixed; Q4 and Q5 are mixed about 60% of the time and proper about 40%.
  - U5 Test: Q6 and Q7 proper; Q8 mixed; Q5 and Q9 vary.
  - Module Test: Q4, Q11, Q23 proper; Q12 whole; Q16 mixed; Q17, Q18, Q24 vary.
- **"Whole number" is right only in U3 Subtract (1 in 3), U3 Test Q6 and Module Q12.** It is never right in U4 or U5.

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| U4-01 | Fixed | Answer-kind buttons with kind-aware grading and feedback. Shared code is opt-in through `<AnswerFormPick>`, and MG10 turns it on. Unit 3 Explore teaches the three kinds once. The CFU `mixedFraction` blanks use the buttons too. The test review shows the picked kind. | `shared/components/AnswerForm.tsx` + `answerKinds.ts` (new); `shared/engine/StepProblem.tsx` (`checkFormFraction`, `FormFractionInput`); `shared/engine/UnitTest.tsx`; `shared/components/CfuQuestion.tsx`; MG10 shell; `AddSubtractUnlike.tsx` Explore; `WordProblems.tsx` CFU Q2 |

**How grading works when a kind is picked.** The kind is stored in `inputs[3]`, and only the boxes that kind shows are graded.

- **Wrong kind, first try:** the button turns red. Message: "The answer is not a {kind}. Is it more than 1, less than 1, or a whole number?" The boxes are not marked.
- **Wrong kind, later tries:** "The answer is not a {kind}. It is a {right kind}."
- **Right kind, wrong value:** the button turns green and the boxes turn red. Message: "{Kind} is right." followed by the step's named-mistake message, if there is one (for example "You borrowed, but you forgot to take 1 away…"). Otherwise it says "Check the numbers."
- **Equal value but not in simplest form:** the existing simplest-form message, plus a reason, and the kind button is marked. For example:
  - 2/4 picked as a proper fraction: green button, "4 and 6 can both be divided by 2".
  - An improper fraction picked as a "proper fraction" (5/4, 6/3): red button, "The top is as big as the bottom or bigger. Write it as a whole number or a mixed number."
  - "0 3/4" picked as a mixed number: red button, "There are 0 wholes, so it is not a mixed number."
- **Any wrong Check on these steps makes the solve not clean** (`formMiss`), which turns on the same-type retry. A right kind with the right answer on the first try is still a clean solve; I confirmed this in the browser ("Solved it! ⭐").

**Choices I made beyond the work order:**

1. **A wrong value now also makes the solve not clean, not only a wrong kind.** The work order says this happens "as now", but before this round one wrong typed value with no hint still counted as clean in MG10. Now any wrong Check on a kind-picked answer counts, because the feedback ("Mixed number is right") is help and the kind is a 1-in-3 guess. This only affects these answer steps.
2. **Test "Next question" stays usable with no kind picked.** Every other Test question can be skipped too. A skipped answer is graded wrong and shows "(blank)". The kind buttons appear in Tests, but they give no feedback and no hints.
3. **Switching kinds keeps the numbers that still fit:**
   - mixed → proper keeps the top and bottom;
   - proper → whole starts with an empty box;
   - whole → mixed keeps the whole number.
4. **Unit 3 Explore also gets one short line under step 4**, "Kind of answer: proper fraction." (or whole number / mixed number), so the sandbox names the kind for any fractions the student sets. The guide cards also have a 2–5 word meaning under each example ("No fraction part." / "A whole number and a fraction." / "Less than 1."). This ties the cards to the feedback question "more than 1, less than 1, or a whole number?".
5. **U5 CFU Q2 layout:** each blank now has its label on its own line above the kind buttons and boxes ("1/8 is close to:"). Before this, the inline sentence left a stray period off to the right.
6. **Which CFU questions get the buttons:** only the CFU's `mixedFraction` blanks (U5 Q2). The U3 and U4 CFU questions use fixed `BoxFrac` layouts whose shape already tells the student the kind. See §6.

**How another lab turns it on** (recorded in `MATH_TSX_STYLE_GUIDE.txt` and `VISUAL_COMPONENT_TODO.txt`):

1. Wrap the lab's content in `<AnswerFormPick>`.
2. Optionally, show `<AnswerFormGuide />` in the Explore of the first unit whose answers can be any of the three kinds.

It applies to every `FractionStep` with `mixed: true` and no printed `den`, and to every `CfuBlank.mixedFraction`.

## 3. Changed files

All paths are under `src/pages/math-levels/`.

**Shared.** Each change is a no-op without `<AnswerFormPick>`.

- `shared/components/AnswerForm.tsx` (**new**): `AnswerFormPick`, `FormPicker`, `AnswerFormGuide`.
- `shared/components/answerKinds.ts` (**new**): the context hook, `formOfValue`, `formBoxes`, `keepFitting`, `formFilled`, the names and the examples.
- `shared/engine/StepProblem.tsx`:
  - `StepState.formMark`;
  - `check(…, { tries })`;
  - `checkFormFraction`;
  - Check is disabled until the boxes are filled;
  - `FormFractionInput`.
  - **Used by every lab.** The old path runs whenever no kind is picked, which is always the case outside the provider.
- `shared/engine/UnitTest.tsx`: the review list adds the picked kind ("1/2 (proper fraction)"). **Used by every lab's tests**; this only applies when a kind was picked.
- `shared/components/CfuQuestion.tsx`: `mixedFraction` blanks get kind buttons and kind marking, plus a feedback line ("One kind of answer is not right. Look at the red button." / "Every kind you picked is right. Check the numbers."). **Used by MG9 FractionOperationsLab and MG10.**
- `shared/engine/types.ts`: doc comment only.
- `shared/styles/lab-base.css`: `.form-pick*`, `.form-entry-row`, `.cfu-form`, `.form-guide*`. These are new classes only.

**MG10:**

- `MG10/MG10_AddingAndSubtractingFractionsLab.tsx`: the `<AnswerFormPick>` wrapper and a header comment.
- `MG10/AddingAndSubtractingFractionsLab/units/AddSubtractUnlike.tsx`: `<AnswerFormGuide />` in Explore, and the "Kind of answer" line in step 4.
- `MG10/AddingAndSubtractingFractionsLab/units/WordProblems.tsx`: the CFU Q2 instruction and layout.

**Docs:** `MATH_TSX_STYLE_GUIDE.txt`, `VISUAL_COMPONENT_TODO.txt`.

## 4. New or rewritten student text

| Where | Text |
|---|---|
| Kind buttons (Practice, Test, CFU) | "Whole number" (eg 2) · "Mixed number" (eg 1 3/4) · "Proper fraction" (eg 3/4) |
| U3 Explore guide | "Before you type, pick the kind of answer: a whole number, a mixed number, or a proper fraction." Cards: "No fraction part." / "A whole number and a fraction." / "Less than 1." |
| U3 Explore step 4 (added at the end) | "Kind of answer: {whole number / mixed number / proper fraction}." |
| Wrong kind, 1st try | "The answer is not a {kind}. Is it more than 1, less than 1, or a whole number?" |
| Wrong kind, later tries | "The answer is not a {kind}. It is a {right kind}." |
| Right kind, wrong value | "{Kind} is right. Check the numbers." (or "{Kind} is right." + the step's existing named-mistake message) |
| Not simplest, new reasons | "There are 0 wholes, so it is not a mixed number." / "The top is 0, so there is no fraction part." (the other reasons are the existing ones) |
| Unreachable guard | "Fill in every box." |
| CFU kind line | "One kind of answer is not right. Look at the red button." / "{n} kinds of answer are not right. Look at the red buttons." / "Every kind you picked is right. Check the numbers." |
| U5 CFU Q2 instruction | Old: "Write 0, 1/2, or 1 in each set of boxes. Leave a box empty if you don't need it." New: "For each answer, pick the kind of answer. Then write 0, 1/2, or 1." Labels: "1/8 is close to:" / "3/5 is close to:" / "So 1/8 + 3/5 is about:" |
| Test review | "Your answer: {answer} ({kind})" |

"Proper fraction" is a new word for this lab. The U3 guide teaches it with an example and "Less than 1."

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | **Pass** (run after the last edit) |
| `npx eslint` on every touched file | **Pass**: 0 errors. Only the existing `react-refresh/only-export-components` warnings remain. I moved the logic into `answerKinds.ts`, so the new component file adds none. |
| `npx vite build` | **Pass**. Only the existing warnings (historicalProgressService, chunk size). No per-import warnings. |
| Test / unit import check | **Pass**. No unit ↔ Test imports. |
| Brute force (`scratchpad/mg10-r4-fix/brute.mjs`: the real code bundled with esbuild, 4,000 draws per Practice bucket, 4,000 runs of every Unit Test and of the Module Test; 186,613 answer steps) | **Pass, 0 problems.** See the list after this table. |
| `english-check.cjs --grade 5` on the changed files | **Pass**: 0 over the limit. The only flags are old ones. The new "N and N can both be divided by N" reason line uses the same passive form as the existing one. |
| Browser, iPad 820×1180 with touch (`scratchpad/mg10-r4-fix/r4.mjs`) | **Pass, 0 failed checks.** See the list after this table. |
| Round-3 "no visible a/b" sweep, rerun with the kind buttons (`scratchpad/mg10-r4-fix/sweep.mjs`) | **Pass: 547 screens, 0 hits.** It covered Home, every unit's Explore, every CFU question (wrong, then right; U5 Q2 with the kind buttons), every Practice type (2 draws each; each wrong try picks a different kind), every Unit Test twice and the Module Test twice. Every CFU still unlocks Practice. The only error is the harness page's missing favicon (404). |
| MG9 and MG11 unchanged | **Pass.** On MG9 FractionOperationsLab (Explore, Test) and MG11 MultDivFractionLab (Explore, Practice, Test) there are 0 kind buttons and 0 guides, and no page errors. Screenshots: `regress-mg9.png`, `regress-mg11.png`. |

**What the brute force checked:**

- Every answer's right kind is one of the three, and it matches the value: a whole number, a proper fraction between 0 and 1, or a mixed number with a proper fraction part.
- `answerText` is written in the same kind.
- The right answer in the right kind is accepted.
- Each wrong kind is marked red and counts as not clean. On the 1st try the message doesn't name the right kind; on the 2nd try it does.
- A right kind with a wrong value marks the button green and the boxes red, and the message starts "{Kind} is right."
- An unsimplified answer gets the simplest-form message with the button green.
- An improper fraction picked as a "proper fraction", a whole answer typed as "w-1 d/d", and a proper answer typed as "0 n/d" all get the simplest-form message with the button red.
- The old grading without a kind still works, so other labs are unchanged.
- I read every message template in the output.

**What the browser walk checked:**

- **One Practice problem in each of the 11 types:**
  - Before a kind is picked, there are no boxes and Check is gray. With a kind picked but the boxes empty, Check is still gray.
  - Switching kinds keeps the numbers that still fit.
  - Wrong kind, 1st try: red button, the "Is it more than 1…" message, and typing clears the marks.
  - Wrong kind, 2nd try: the message names the right kind.
  - Right kind, wrong value: green button, red boxes.
  - Unsimplified answers, and an improper fraction picked as a proper fraction: the right message and marking.
  - The right answer, submitted with Enter, gives "Solved, with help." with "Try one like it" and "Next problem" locked.
- **A clean U3 solve** (right kind and right answer on the first try) gives "Solved it! ⭐".
- **U3 Explore** shows the guide, and step 4 says "Kind of answer: proper fraction.".
- **U5 CFU Q2:**
  - There are no boxes before a kind is picked, and Check stays gray while any blank has no kind.
  - After one wrong kind and one wrong value, the marks are red, green, green, with the "One kind of answer…" line.
  - With all kinds right and one value wrong, the feedback says "Every kind you picked is right…".
  - All right gives "good".
- **Tests:** U1 has 4 questions with kind buttons, U3 has 6, U4 has 5 and U5 has 5. None shows a hint or feedback, and every review line shows "(proper fraction)". The Module Test has 8 of 25 questions with kind buttons.
- The only console error is the harness page's missing favicon (404), which earlier rounds had too.

**Screenshots** are in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\mg10-r4-fix\shots\`. I looked at these:

- `u3-t1-0-nothing-picked.png`: the 3 buttons with stacked examples and no boxes; Check is gray.
- `u3-t2-1-wrong-kind.png`: "Proper fraction" in red for 5/2 − 2/4, with the message.
- `u4-t1-2-right-kind-wrong-value.png`: "Mixed number" in green, the three boxes red, "Mixed number is right. Check the numbers.", and the hint.
- `u3-t2-3-unsimplified.png`: 6/3 picked as a proper fraction gets the simplest-form message and a red button.
- `u1-t1-4-solved.png`: "Solved, with help." with "Try one like it".
- `u3-explore-guide.png`, `u3-test-q1-picked.png`, `u3-test-review-q1.png` ("Your answer: 1/2 (proper fraction)").
- `u5-cfu-q2-wrong.png`: marks red, green, green with the kind line. This shot shows the layout before the label-on-its-own-line change; the final layout is in `..\shots-sweep\u5-cfu-passed.png`.
- The remaining per-type states are named `u{unit}-t{type}-{0..4}-*.png`.

**Clean-up:** I deleted the harness (`__harness_mg10r4.html`, `src/__harness_mg10r4.tsx`) and stopped my dev server on port 5232. The scratch scripts are only in `scratchpad/mg10-r4-fix/`.

## 6. Noticed, not fixed

1. **The giveaways in §1** (U1 always proper, U4 Add always mixed, fixed kinds per Test question). Fixing them would mean changing the generators or the plan; for example, U1 sums that can pass 1, or U4 Add sums that land on a whole number.
2. **U1 shows the kind buttons before U3's Explore teaches them** (the work order says to teach them once, in U3). The examples on the buttons help, but the builder rule "every Practice step is taught before it's asked" points to also showing `<AnswerFormGuide />` in U1 Explore. This needs a decision.
3. **Some U3 and U4 CFU questions still show the answer's kind through their fixed box layout:**
   - U3 Q4 "In simplest form, that is [ ]": one box, so a whole number.
   - U4 Q3 and Q4: whole box + fraction boxes.
   These could become `mixedFraction` blanks with the kind buttons if the user wants the same check there.
4. **U5 CFU Q2's instruction ends with a stacked fraction that can wrap onto its own line** (", or 1." on the next line). This is the same wrapping issue round 3 noted.
5. **Unit Tests ask their questions in a fixed bucket order**, so the kind is predictable on a retake. Shuffling the order would remove this, but it is a Test design change.
