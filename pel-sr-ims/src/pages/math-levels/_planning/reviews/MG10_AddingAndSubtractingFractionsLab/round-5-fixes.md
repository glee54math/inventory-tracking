# MG10 Adding & Subtracting Fractions: round 5 fixes (user request)

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (grade 5, 5.NF.1–2)
- **Round:** 5. This round is a user request (`round-5-user-request.md`, items U5-01 to U5-04).
- **Date:** 2026-11-08
- **Commit:** none

## 1. Summary

**4 Fixed (U5-01, U5-02, U5-03, U5-04) · 0 Partly fixed · 0 Needs decision · 0 Not fixed.**

Unit 1 is rebuilt around "you can't add across". It uses only skills from grades 3–4. Each problem has 4 steps:
1. Estimate.
2. Judge a named person's add-across answer.
3. and 4. Find the real sum. This is typed when one bottom fits in the other, and starts with "which picture?" when the bottoms share no factor.

No Unit 1 screen asks the student to find a common denominator. The words "common denominator" and "LCD" don't appear in Unit 1.

About 38% of Unit 1 sums are more than 1, and about 12% are exactly 1.

Every format toggle now has the line "Pick a format to write your answer." just above it.

Add-across answers are named in Practice in Units 1, 3, 4 and 5, with a size check. Units 1 and 3 also draw the two bars.

**Where I went past the work order.** Each of these is explained in §2.

- I added a 4th step to the "no shared factor" problems, and split step 3 into rename + sum for the "fits" problems.
- I varied the estimate and judge questions so their answers are balanced.
- I added the format guide to Unit 1's Explore.

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| U5-01 | Fixed | `FormPicker` shows `FORM_PICK_PROMPT` ("Pick a format to write your answer.") on its own line above the buttons, in Practice, CFUs, Unit Tests and the Module Test. The Unit 3 guide title uses the same phrase. The Unit 3 Explore line "Kind of answer: …" now reads "Format: …". The U5 CFU Q2 instruction changed to match. | `shared/components/answerKinds.ts` (const), `AnswerForm.tsx` (`prompt` prop, guide title), `shared/styles/lab-base.css` (`.form-pick-wrap`, `.form-pick-say`), `AddSubtractUnlike.tsx` Explore, `WordProblems.tsx` CFU Q2 |
| U5-02 | Fixed | Named add-across message with a size check. A shared change shows that message even when the picked format is also wrong. A new optional `VisualHelp.lastTry` lets the picture draw the add-across bar beside the bigger fraction. Tests show nothing. | `lib/fractions.ts` (`addAcrossMsg`, `resultDiagnose`, `mixedAddDiagnose`, `u1SumDiagnose`, `typedValue`, `triedAcross`); `shared/engine/StepProblem.tsx` (`checkFormFraction`, `help.lastTry`); `shared/engine/types.ts` (`VisualHelp.lastTry`); new `diagrams/SizeCheckBars.tsx`; the visuals in U1 and U3 |
| U5-03 | Fixed | Unit 1 redesign: Explore, CFU, Practice, Test, Module Test, problem labels, and a note in the plan. | `units/WhyNotAcross.tsx`, `units/WhyNotAcrossTest.tsx`, new `lib/unit1.tsx`, new `diagrams/JoinedBar.tsx`, `units/ModuleTest.tsx`, `plan.md` |
| U5-04 | Fixed | Unit 1 sums can be 1 or more. The size is decided first, then numbers are drawn to fit it. Test Q3, Q4 and Q6 vary their format from one try to the next. | `lib/fractions.ts` (`u1Draw`, `u1Params`), `WhyNotAcrossTest.tsx` |

**Where I went past the work order, and why:**

1. **"No shared factor" problems have a 4th step: count and type the sum.**
   - Step 4 reads "Count the twelfths in the picture. Write 1/3 + 1/4 in simplest form." It uses the format toggle.
   - The builder rule says every Practice type needs a typed step. Choices can be guessed, so without one a clean solve wouldn't prove anything.
   - It is reading the picture, not computing. Same-size pieces are drawn for the student, and the unit never asks for a common denominator.
2. **In the "fits" problems, step 3 is split into "rename" and "sum".**
   - The rename step prints the bottom: "3 fits in 6: each third is 2 sixths. Write 2/3 in sixths." The picture shows the cut.
   - The sum step comes next and uses the format toggle.
3. **The step-1 estimate is varied for balance.**
   - The work order asks "more or less than the bigger fraction?". That is always "more", which the builder rule forbids.
   - The right answer is now picked first, then the question is chosen to fit it:
     - "more than" uses the bigger fraction, or 1 when the sum is clearly past 1;
     - "less than" uses 1 when the sum is clearly under 1, or otherwise 2.
   - "Clearly" means at least 1/8 away from 1.
   - The JoinedBar hint (both parts end to end) shows the answer to all of these.
4. **Step 2 is varied too, as the work order allowed.**
   - Each version comes up 1 time in 3:
     - "Is his answer too small, right, or too big?" (too small);
     - "Is 3/5 more or less than [bigger]?" (less);
     - "Is it more or less than [smaller]?" (more).
   - No case is faked "right". The explanation always ends with "So adding across gives an answer that is too small."
5. **Pairs of equal fractions are excluded** (1/2 + 2/4). Adding across gives 3/6, which equals both fractions, so the size check has no bigger fraction to compare with.
   - The exact-1 sums with one bottom fitting in the other use a fraction that isn't in lowest terms (1/3 + 4/6). With both in lowest terms, an exact 1 is impossible.
6. **Unit 1 Explore shows `<AnswerFormGuide />`.** Unit 1 answers can now be whole or mixed numbers, and the builder rule says a step must be taught before it's asked.
7. **10 & 100 (4.NF.5) is not in the pools.** Bars with 100 pieces can't be counted. The pairs only go up to 12 (one bottom fits in the other) and 15 pieces (no shared factor).
8. **"Who is right?" was dropped from Practice**, because step 2 now covers it. It stays as Test Q10.
9. **The test review list doesn't name "added across".** It shows each question's `explain`, not a per-answer diagnosis, so per the work order it is left as is.

## 3. New Unit 1

### Practice: "Find the sum" (title "Find the sum", story "Find a + b.")

**Problem-type labels and buckets:**
- **"One bottom fits in the other"**: `fitsUnder1` and `fitsOneOrMore` (exactly 1 half the time).
- **"Bottoms share no factor"**: `noShareUnder1` and `noShareOver1`.

**The steps:**

| # | Step | One bottom fits in the other | Bottoms share no factor |
|---|---|---|---|
| 1 | Estimate (choice) | "Estimate first. Will a + b be more or less than R?" Buttons: "More than R" / "Less than R". | same |
| 2 | Judge (choice) | "Raj added across: 1 + 1 = 2 on top, 3 + 4 = 7 on the bottom. That gives 2/7." Then one of the 3 questions in §2 item 4. | same |
| 3 | Real sum, part 1 | Rename, typed over a printed bottom: "3 fits in 6: each third is 2 sixths. Write 2/3 in sixths." | "Which picture shows a + b?" Three picture buttons (see below). |
| 4 | Real sum, part 2 | Typed with the format buttons: "Now add: a + b = ? Write it in simplest form." | Typed with the format buttons: "Count the twelfths in the picture. Write a + b in simplest form." |

**The three pictures in step 3 ("no shared factor"):**
- the sum, cut into same-size pieces (right);
- the add-across answer;
- the tops over one of the bottoms. Over the bigger bottom it is too small; over the smaller bottom it is too big (1 in 2 each).

Every picture has the same number of whole bars.

**The picture at each step:**
- The two bars, uncut.
- After a wrong estimate: the two parts end to end (`JoinedBar`) on a 0–1–2 ruler.
- On step 2 after a wrong try, and through step 3: `SizeCheckBars` with three rows (a, b, and the add-across answer). It replaces the plain bars, except during the rename step, which needs the cut.
- During the rename step: the cut, with thick lines at the old edges.
- After the picture is picked: the same-size pieces and the "together" bar.
- After a typed add-across answer: two rows, the bigger fraction and "your answer", captioned "Your answer is shorter than 2/3."

**Wrap-up:** "a + b = sum, not mn/md." For "no shared factor" problems it adds: "The picture cut both bars into twelfths."

**Wrong-answer messages on the Unit 1 sum.** None of them uses "LCD".
- "You added across. 3/9 is less than 2/3, but adding should make a bigger number. Make same-size pieces first."
- "You added the bottoms too. The pieces are still sixths, so keep 6 on the bottom."
- "You added the old tops. First write both fractions in sixths."

### Explore

**"Add across" view:**
- Three bars (a, b, and the add-across answer), followed by the existing add-across and size-check text.
- New: "**Estimate the real sum.** Put the two shaded parts end to end:" followed by the JoinedBar, then "That is the real sum. It is more than 1/2, and it is less than 1." The last words are "less than 1", "more than 1" or "exactly 1".
- The denominators now go up to 12.

**"Same-size pieces" view:**
- When one bottom fits in the other: "2 fits in 6: 2 × 3 = 6. So each half is 3 sixths, and 1/2 = 3/6. Now count: 3/6 + 1/6 = 4/6 = 2/3."
- When neither fits: the recut picture only, with "2 doesn't fit in 3, and 3 doesn't fit in 2. The picture still cuts both bars into the same-size pieces, so you can count them. In Unit 2, you will learn how to find these pieces."
- Above 48 pieces it shows "That's too many pieces to draw."

**Also:** the format guide, and a new key idea (see §5).

### CFU (word for word)

4 questions. Q2 and Q4 have typed boxes, so 2 of 4 questions (50%) are typed.

**Q1 (kept).** "Ana says 1/2 + 1/3 = 2/5. Compare her answer to 1/2."
- Picture: the 1/2 and 2/5 bars.
- Boxes: "2/5 is [less than | more than] 1/2. So Ana's answer is [too small | right | too big]."
- **Answer:** less than; too small.
- Why: it checks that adding across gives an answer that is too small.

**Q2 (new, typed).** "Find 1/3 + 1/9. 3 fits in 9, so cut each third into 3 ninths."
- Picture: the recut bars.
- Boxes: "1/3 = [ ]/9. So 1/3 + 1/9 = [ ]/9."
- **Answer:** 3, 4.
- Right: "Right! Now the pieces are the same size: 3 ninths + 1 ninth = 4 ninths. The answer is 4/9, not 2/12."
- Wrong: "Not quite. Count the small pieces in the shaded part of the thirds bar." or "Close. Now both are ninths. Add the tops: 3 + 1."
- Why: it replaces the old "1/2 and 1/3 in sixths" question, which needed a common denominator the student had to find.

**Q3 (kept).** "In 1/3, the denominator 3 tells [how many equal pieces make 1 whole]. You can add the tops only when the [denominators] are the same."
- Why: it checks what the denominator means.

**Q4 (rewritten).** "Adding across means adding the tops and adding the bottoms. True or false: adding across always works. [True/False] Find the real sum: 3/4 + 1/2 = [format buttons + boxes]"
- **Answer:** False; 1 1/4 (mixed number).
- Right: "Yes. Adding across never works: it gives 4/6, which is less than 1. But 3/4 and 1/2 are each at least 1/2, so the sum is more than 1. 1/2 = 2/4, and 3/4 + 2/4 = 5/4 = 1 1/4."
- Wrong, on the True/False: "Look again at question 1. Adding across gave 2/5, which is too small. So it does not always work."
- Wrong, on the sum: "Close. 2 fits in 4, so write 1/2 in fourths first: 1/2 = 2/4. Then add the fourths. 4 fourths make 1 whole."
- Why: it uses the work order's contrast (adding across gives 4/6, which is less than 1), and it puts the format line in a CFU.

### CFU → Practice → Test

| CFU idea | Practice | Test |
|---|---|---|
| Adding across is too small (Q1, Q4) | step 2 in every bucket; the typed add-across diagnosis | Q7, Q9, Q10 |
| Rename when one bottom fits in the other (Q2, Q4) | fitsUnder1, fitsOneOrMore (steps 3–4) | Q2, Q3, Q4 |
| What the denominator means; same-size pieces (Q3) | every problem | Q8 |
| Sums past 1 (Q4) | fitsOneOrMore, noShareOver1 | Q3, Q4, Q6 |

### Unit 1 Test

All steps are built from `lib/unit1.tsx`, the same builders Practice uses.

| Q | What it asks | Distractors |
|---|---|---|
| Q1 | estimate (`sizeEstimateQuestion`) | the other side of the comparison |
| Q2 | rename (pool `[2,4] [3,9] [4,8] [5,10]`) | — |
| Q3 | fits sum, with picture (pool `[2,6] [3,6] [4,12] [2,10]`) | — |
| Q4 | fits sum, no picture (pool `[2,8] [3,12] [6,12] [2,12]`) | — |
| Q5 | which picture? (pool `[2,3] [3,4] [2,7]`) | add-across; tops over one of the bottoms |
| Q6 | count the sum from the recut picture (pool `[2,5] [3,5]`) | — |
| Q7 | `whyWrongQuestion` | "right, just needs simplest form"; "should have multiplied the tops" |
| Q8 | `sameSizeQuestion` | same numerators; two unit fractions of different sizes |
| Q9 | `addAcrossChoiceQuestion` (fits pairs) | add-across; tops over the bigger bottom |
| Q10 | `whoIsRightQuestion` (fits pairs) | the add-across person; "Neither of them" |

The pools for Q2–Q6 don't overlap, so no two questions show the same pair.

**Module Test, Unit 1 part:** `sizeEstimateQuestion`, `whyWrongQuestion`, `fitsSumQuestion("medium", "any")`, `pickPictureQuestion`, `whoIsRightQuestion`. `sameSizeQuestion`, `addAcrossChoiceQuestion` and the old `sumQuestion` are no longer used there. It still has 25 questions.

### Format split and choice balance

Brute force: 10,000 draws per bucket, 5,000 Unit Test runs, 2,000 Module Test runs.

**Sum size, all Unit 1 Practice:** less than 1 50.0% · exactly 1 12.4% · more than 1 37.6%.

**Format of the typed sum, by Practice type:**

| Practice type | Proper | Whole | Mixed |
|---|---|---|---|
| One bottom fits in the other | 50.0% | 24.8% | 25.2% |
| Bottoms share no factor | 50.0% | 0% | 50.0% |

By bucket:
- fitsUnder1: always proper;
- fitsOneOrMore: whole 49.7%, mixed 50.3%;
- noShareUnder1: always proper;
- noShareOver1: always mixed (with no shared factor, a sum of exactly 1 is impossible).

**Format, Test questions:**
- Q3: proper 33.4% · whole 34.2% · mixed 32.4%.
- Q4: proper 33.0% · whole 33.5% · mixed 33.5%.
- Q6: proper 49.5% · mixed 50.5%.
- Module Test Unit 1 question 3: proper 34.9% · whole 32.9% · mixed 32.3%.

**Choice balance:**
- **Step 1, estimate:** More 49.9% / Less 50.1%. By question: more than the bigger fraction 39.4%, more than 1 10.4%, less than 1 34.5%, less than 2 15.7%.
- **Step 2, judge:** "Too small" 33.3% / "Less than" 32.9% / "More than" 33.8%.
- **Step 3, picture:** each button position is right 33.3–33.5% of the time. The right picture is the most shaded 57.4% of the time and the middle one 42.6%. It is never the least shaded, because the add-across picture is always the smallest.
- **Unit 1 Test:** Q1 More 50.7% / Less 49.3%. Q5, Q7, Q8, Q9 and Q10 put the right answer in each position 32–35% of the time.

**The add-across answer never equals the real sum:** checked on all 40,000 draws.

## 4. Changed files

All paths are under `src/pages/math-levels/`.

**Shared.** Each change is opt-in or additive.

- `shared/components/answerKinds.ts`: `FORM_PICK_PROMPT`.
- `shared/components/AnswerForm.tsx`:
  - `FormPicker` gets a `prompt` prop (default the line above, `null` hides it) and a `.form-pick-wrap` wrapper;
  - the `AnswerFormGuide` title.
  - These only render inside `<AnswerFormPick>`, which **only MG10** uses.
- `shared/styles/lab-base.css`: new classes `.form-pick-wrap`, `.form-pick-say` and `.form-pick-wrap.compact .form-pick-say`.
- `shared/engine/types.ts`: optional `VisualHelp.lastTry`. **Every lab's types**; it is additive, and pictures that ignore it are unchanged.
- `shared/engine/StepProblem.tsx`: `help.lastTry`. In `checkFormFraction` (only inside `<AnswerFormPick>`), a wrong format with a wrong value now puts the step's `diagnose` message before the format message.
  - **Used by every lab.** The behavior only changes inside `<AnswerFormPick>`.
  - The MG9 agent also edited this file during my run. I didn't touch their changes, and my two edits are still there.

**MG10:**
- `MG10/AddingAndSubtractingFractionsLab/lib/fractions.ts`:
  - Unit 1 section rewritten: `U1Bucket`, `U1_BUCKETS`, pools, `u1Draw`, `u1Params`, `fitsIn`, `biggerSmaller`, `acrossOf`, `shownText`, `addAcrossMsg`, `typedValue`, `triedAcross`, `u1SumDiagnose`;
  - `resultDiagnose` and `mixedAddDiagnose` now include the size check.
- `MG10/AddingAndSubtractingFractionsLab/lib/unit1.tsx` (**new**): the step builders.
- `MG10/AddingAndSubtractingFractionsLab/diagrams/SizeCheckBars.tsx` (**new**).
- `MG10/AddingAndSubtractingFractionsLab/diagrams/JoinedBar.tsx` (**new**).
- `MG10/AddingAndSubtractingFractionsLab/diagrams/index.ts`.
- `MG10/AddingAndSubtractingFractionsLab/units/WhyNotAcross.tsx` (rewritten).
- `MG10/AddingAndSubtractingFractionsLab/units/WhyNotAcrossTest.tsx` (rewritten).
- `MG10/AddingAndSubtractingFractionsLab/units/ModuleTest.tsx`.
- `MG10/AddingAndSubtractingFractionsLab/units/AddSubtractUnlike.tsx`: the add-across picture in Practice; "Format:" in Explore.
- `MG10/AddingAndSubtractingFractionsLab/units/WordProblems.tsx`: the CFU Q2 instruction.

**Docs:**
- `MATH_TSX_STYLE_GUIDE.txt`: the format line, and `VisualHelp.lastTry`.
- `VISUAL_COMPONENT_TODO.txt`: a round-5 note.
- `_planning/Grade-5/AddingAndSubtractingFractionsLab/plan.md`: a "Round 5 (user, 2026-11-08)" section.

**Checked and not changed:**
- **Unit 2 Explore.** Its opening defines "common denominator" from scratch and never says "as you did in Unit 1", so it still works.
- **MG9 and MG11.** I didn't edit them. The git changes in them are from other work.

## 5. New or rewritten student text

- **Format line, everywhere the buttons show:** "Pick a format to write your answer."
- **Guide title (Unit 1 and Unit 3 Explore):** "Pick a format to write your answer: a whole number, a mixed number, or a proper fraction."
- **Unit 3 Explore step 4:** "Format: {proper fraction / …}."
- **Unit 5 CFU Q2:** "Estimate 1/8 + 3/5 with benchmarks. For each answer, pick a format. Then write 0, 1/2, or 1."
- **Unit 1 key idea:** "You can only add pieces that are the same size. Adding across never works: 1/2 + 1/3 is not 2/5. That's less than 1/2 alone!" / "When one bottom fits in the other, write one fraction in the other's pieces: 3/4 + 1/2 = 3/4 + 2/4 = 5/4 = 1 1/4. Always write the answer in simplest form."
- **Unit 1 Explore, Unit 1 CFU, and the Practice step prompts:** word for word in §3.
- **Unit 1 Practice hints and explanations:**
  - "Picture the two shaded parts end to end. Compare that with the {big} bar / 1 whole bar." / "How many whole bars can the two shaded parts fill?"
  - "Adding {small} to {big} gives more than {big}. So the sum is more than {big}." / "Put end to end, the two shaded parts fill more/less than 1 whole bar. So the sum is more/less than 1." / "Each fraction is less than 1. So the two together are less than 2."
  - "Compare X with {big}. A sum must be more than both fractions." / "Look at the X bar and the {ref} bar. Which is longer?"
  - "X is less than {big}. But a + b must be more than {big}. So adding across gives an answer that is too small." / "X is more than {small}, but less than {big}. …"
  - "Look at the thick lines. Count the small pieces in the shaded part of the {nS/dS} bar." / "Each third is 2 sixths, so 2/3 = 4/6."
  - "Both are sixths now. Add the tops: 4 + 1. Keep 6 on the bottom." / "12 twelfths make 1 whole. Count the shaded twelfths." / "… = 5/4 = 1 1/4. 4/4 is 1 whole."
  - "Put the two shaded parts end to end. Which picture is shaded that much?" / "The twelfths picture: 1/3 is 4 twelfths and 1/4 is 3 twelfths. The 2/7 picture is adding across, which is too small."
- **Picture captions:** "The two shaded parts, end to end:" / "{Name} added across: X." / "Your answer is shorter than {big}." / "Your answer is longer than {first}." (Unit 3, subtraction)
- **Diagnoses:**
  - Units 3 and 5, adding: "You added across. X is less than {big}, but adding should make a bigger number. First make same-size pieces, then add only the tops."
  - Unit 3, subtracting, only when the size check holds: "You subtracted across. X is more than {first}, but subtracting should make a smaller number. First make same-size pieces."
  - Unit 4 and Unit 5 mixed-number stories: "You added the fraction parts across. X is less than {big}, but adding should make a bigger number. Make same-size pieces first."
  - Unit 1: in §3.
- **When the picked format is also wrong,** the format message follows the diagnosis: "… The answer is not a proper fraction. Is it more than 1, less than 1, or a whole number?"

## 6. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | **Pass** (run after the last edit) |
| `npx eslint` on every touched file | **Pass**: 0 errors. Only the existing `react-refresh/only-export-components` warnings remain. |
| `npx vite build` | **Pass**. Only the existing chunk-size warning, and no per-import warnings. |
| Test / unit import check | **Pass**. `WhyNotAcrossTest.tsx` imports only `lib/` and `diagrams/`. |
| Brute force (`scratchpad/mg10-r5-fix/brute.mjs`) | **Pass: 0 problems.** It ran the real code bundled with esbuild: 40,000 Unit 1 problems, 5,000 Unit 1 Tests, 2,000 Module Tests, and 10,000 × the Unit 3, 4 and 5 diagnoses. It checked: every answer and choice is right, choice values don't collide, format and size splits, balance, the add-across value is never the sum, and the diagnosis text, including through the format-button path. |
| `english-check.cjs --grade 5` on the changed files | **Pass**: 134 strings, 0 over the limit. The 2 flags are old lines (Unit 3 "can both be divided by", Unit 5 "difference between"). |
| Browser at 1024×768 with touch (`scratchpad/mg10-r5-fix/r5.mjs`) | **Pass: 0 failed checks, 0 visible "a/b" texts.** See the list after this table. The only console error is the harness's missing favicon (404). |
| MG9 and MG11 | **Pass.** Both render with 0 format buttons, lines or guides. |
| Clean-up | The dev server is stopped. My harness files (`__harness_mg10r5.html`, `src/__harness_mg10r5.tsx`) are deleted. |

**What the browser walk covered:**
- **Unit 1 Explore**, both views, at (2,3) and (2,6).
- **Unit 1 CFU:** a wrong then right answer on Q2, and on Q4 with the format buttons. 4/4 pass, the CFU stays on screen, and Practice unlocks.
- **Both Unit 1 Practice types**, wrong at every step:
  - each hint picture appears;
  - an add-across answer gets the diagnosis and the picture;
  - the solve gives "Solved, with help.";
  - "Try one like it" gives a clean solve, which shows "Solved it! ⭐".
- **The Unit 1 Test:** no hints and no feedback; the format line shows.
- **A Unit 3 Add problem** with an add-across answer gets the diagnosis and the 2-row picture.
- **The Unit 5 CFU format lines.**
- **The format line was seen in Practice, a CFU and a Test.**

Screenshots are in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\mg10-r5-fix\shots\`. I looked at these:
- `u1-explore-across.png`
- `u1-t0-2-judge-wrong.png`, before the duplicate-bars fix
- `u1-t1-2-judge-wrong.png`, after the fix
- `u1-t1-3-pictures.png`
- `u1-t0-4-across-diagnosis.png`
- `u1-test-q5.png`
- `u3-add-across.png`

## 7. Noticed, not fixed

1. **`SizeCheckBars` and `RecutBars` are separate grids.** When both show, as in the Unit 3 diagnosis, their bars start at slightly different x positions. Each one is readable on its own.
2. **A wrong typed sum in Unit 1 shows the "together" bar** (the existing `pointing(help, 3)` behavior), and that bar shows the answer's size. This is help after a wrong try, so the solve is already not clean, but the reviewer may want to judge it.
3. **The Unit 1 rename step has no named wrong-answer message.** It shows the generic "Not yet. Check your work and try again."
4. **When the add-across message comes with a wrong format, the feedback can run to 5 sentences.** Each sentence is under 20 words.
5. **Out of scope and unchanged:** the round-4 giveaways in other units (Unit 4 Add is always mixed; Test questions with a fixed format in Units 3–5).
6. **The bucket names changed** (fitsUnder1, …). Any saved Unit 1 bucket progress under the old names won't count toward the new buckets. The lab isn't live yet.
7. Still worth a manual pass on a real iPad before calling this done.
