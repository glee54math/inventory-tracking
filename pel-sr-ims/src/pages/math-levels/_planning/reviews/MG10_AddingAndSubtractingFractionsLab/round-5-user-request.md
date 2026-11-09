# MG10 — round 5 work order: user requests (2026-11-08)

All four items are **Fix**. The user approved the Unit 1 redesign (U5-03) in conversation.

| ID | Decision | Change |
|---|---|---|
| U5-01 | Fix | Every step with the answer-form toggle says "Pick a format to write your answer." |
| U5-02 | Fix | Help students see that adding (or subtracting) across is wrong, wherever they make that mistake. |
| U5-03 | Fix | Refocus Unit 1 on the idea "you can't add across", using only skills students bring from earlier grades. |
| U5-04 | Fix | Unit 1 sums can be more than 1, so Unit 1 answers are not always proper fractions (Practice and Test). |

## U5-01 — "Pick a format to write your answer."

- **The user's exact words. Keep them.** "format" is the user's choice; don't swap it for another word.
- **Where:** in every step that shows the Whole number · Mixed number · Proper fraction buttons, on its own line just above the buttons. This covers Practice, CFUs, Unit Tests and the Module Test. In the Tests it is an instruction, not help, so it stays.
- **Voice:** the voice reads it before the buttons.
- **Unit 3 Explore:** the existing teaching sentence ("Before you type, pick the kind of answer…") should use the same wording, so students meet one phrase. For example: "Pick a format to write your answer: a whole number, a mixed number, or a proper fraction."

## U5-02 — Make the add-across mistake visible

The user's goal: "help the student realize that adding left to right is incorrect."

1. **Diagnose it everywhere, not just Unit 1.**
   - Wherever a typed fraction answer equals the add-across result, Practice feedback names the mistake and shows why with a size check. For addition: (n1+n2)/(d1+d2). For subtraction: (n1−n2)/(d1−d2), when that is defined.
   - Example: "You added across. 2/12 is less than 1/3, but adding should make a bigger number." Fractions stay stacked.
   - Where it fits, show a small picture: the add-across result's bar beside the bigger fraction's bar, so the student sees it is too small. Reuse PieceBars/RecutBars.
   - For mixed numbers, the same check applies to the fraction parts if that's a common mistake there; use judgment.
2. **Tests never help.** Do not show the diagnosis during a Test. The Test review list may name the mistake ("added across") after the Test is finished, if the review list already explains wrong answers.
3. Wrong answers still trigger the same-type retry, as now.

## U5-03 — Unit 1 redesign (approved)

**Why:** each Unit 1 problem currently makes the student find a common denominator, rewrite both fractions and add (Unit 2–3 skills) before the one step that teaches Unit 1's idea ("Who is right?"). Unit 1 should rest only on what students bring in:
- equivalent fractions (3.NF.3, 4.NF.1);
- adding fractions with like denominators (4.NF.3);
- adding when one denominator fits into the other, as in 4.NF.5 (3/10 + 4/100).

**New Practice problem, "Find a + b", in 3 steps:**
1. **Estimate.** "Will the answer be more or less than [the bigger fraction]?" Choices: more / less. Picture: the two bars.
2. **Judge the add-across answer.** A named person adds across: "[Name] added across: [n1]+[n2] on top, [d1]+[d2] on the bottom. That gives [mn/md]." Then: "Is [Name]'s answer too small, right, or too big?" A picture compares the add-across bar with the bigger fraction's bar after the answer, or as the hint.
   - The answer is usually "too small". Keep it honest: add-across of two positive fractions is always between them, so it is always less than the true sum. If balance matters, vary the step instead (for example sometimes "Is [mn/md] more or less than [bigger fraction]?"). Do not fake a "right" case.
3. **Find the real sum.**
   - **Buckets where one denominator fits in the other** (2&4, 3&9, 5&10, 10&100…): the student renames the one fraction (a picture shows the cut) and types the sum, using the answer-form toggle (U5-01).
   - **Buckets with no shared factor** (1/2 + 1/3…): no computing. "Which picture shows [a] + [b]?" with tap choices. The right picture is the recut bar of the true sum; the wrong ones are the add-across bar and one other plausible wrong amount. The words "common denominator" and "LCD" are not used yet; finding them starts in Unit 2.
   - The final "Who is right?" step can go, since step 2 covers it. Keep it only if it adds something.

**Also align, so Unit 1 never asks for something it doesn't teach:**
- **Unit 1 Explore:** the add-across view stays. Add a size check like steps 1–2 if it isn't there. The "same-size pieces" view can show the recut picture for any pair; it only computes for "one fits in the other" pairs.
- **Unit 1 CFU:** remove any item that needs a common denominator the student must find themselves. The current "1/2 and 1/3 in sixths" item does; rewrite it. Keep the CFU's job: prove the idea (denominators tell piece size; pieces must match; add-across is too small). Keep at least 40% typed answers (builder rule): for example, rename 1/3 as ninths and type the sum of 1/3 + 1/9.
- **Unit 1 Test, and the Module Test questions that come from Unit 1:** same three skills, no help. Unit 2+ content stays out of the Unit 1 Test.
- **Practice option labels:** rename the buckets if needed so they match the new problems in plain grade-5 English.
- **Unit 2 Explore:** check that its opening still works now that Unit 1 no longer computes the coprime cases. Fix any "as you did in Unit 1" wording that's no longer true.
- **Record the redesign:** add a short "Round 5 (user, 2026-11-08)" note to `_planning/Grade-5/AddingAndSubtractingFractionsLab/plan.md`.

## U5-04 — Unit 1 sums can be more than 1

- Let Unit 1 sums go over 1 so the answer can be a mixed number (e.g. 3/4 + 1/2 = 1 1/4).
  - About a third of Unit 1 problems should have a sum over 1.
  - Include some sums of exactly 1 (whole number), e.g. 1/2 + 2/4, if they fit the buckets.
  - Contrast to use in hints: 3/4 + 1/2 added across gives 4/6, which is less than 1, yet both fractions are at least 1/2.
- The **Unit 1 Test** questions that were always proper (Q2–Q5) must vary form across retakes.
- Report the new form split per Unit 1 problem type and for the Unit 1 Test questions, as in round 4.
- **Out of scope for this round:** the other round-4 giveaways (U4 Add always mixed, fixed-form Test questions in other units). The user hasn't decided on these; don't change them.

## Constraints

- **Do not touch MG9.** Another agent is fixing MG9's fraction display at the same time and may edit `shared/components/MathText.tsx`. If you need a shared file, re-read it right before editing, keep the change opt-in, and list it in your report.
- All fractions stay stacked (`MathText` / `StackedFractions`). Write new text to grade-5.md (grade-4.md for read-alone).
- No commit. Never stage `scripts/seedMathLabPlanningItems.mjs`.

## Verify (in addition to the fixer's normal checks)

- tsc (`-p tsconfig.app.json`), eslint on changed files, and the build.
- English script at grade 5 on the changed files.
- A brute-force run of the Unit 1 generators:
  - every answer is correct;
  - the form split matches U5-04;
  - choice balance for every choice step (report it);
  - the add-across value never equals the true sum.
- Browser at iPad size (1024×768):
  - Unit 1 Explore, CFU, a problem from each Practice type (including a wrong add-across answer to see the diagnosis), the Unit 1 Test, and one Unit 3 problem with an add-across answer;
  - "Pick a format to write your answer." appears in Practice, a CFU and a Test;
  - 0 visible "a/b" texts across the walk.
- MG9 and MG11 unchanged by you.
- Stop any server you start and delete any harness files.
