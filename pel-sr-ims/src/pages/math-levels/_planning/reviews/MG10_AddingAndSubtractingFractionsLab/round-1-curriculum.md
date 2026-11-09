# MG10 Adding & Subtracting Fractions — curriculum review, round 1

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (5.NF.1–2)
- **Round:** 1 (full review)
- **Date:** 2026-11-06
- **Grade band assessed:** 4th and up (grade 5). Students are seeing unlike-denominator work for the first time. They come from MG9 (IntroToFractions and FractionOperations, 4.NF.1–3).
- **Inputs:** the approved plan (its "Approved changes" section overrides the rest), the builder's round-0 report, the CCSS reference, and the CA CCSS text for 5.NF.1–2 (including the example in each standard). I read every unit, Test, diagram, `lib/` file and the shell, plus MG9's FractionOperations and ComparingFractions for the words students already know.
- **How I checked:** I read the code. I ran a 20,000-draw script over the generators (in the scratchpad, not `src/`). I also drove the lab in headless Edge at iPad portrait size (820×1180, touch on), answering wrong at every step, and took screenshots. The temporary harness has been deleted.
- **Assumptions:** none beyond the plan.

---

## 1. Verdict

**Ready after fixes.** Units 1–4 teach well. Explore is strong, the CFUs are good, the named-mistake feedback is good, and the simplest-form retry lock works. The biggest problem is **Unit 5's word problems and "does it make sense?" work**:
- The student is never asked to decide which operation the story needs. The answer prompt prints the expression.
- In "Does it make sense?", "Yes" is right about 7 times in 10.
- When the claimed answer is right, the student can copy it into the final box.

Two more gaps are a little smaller:
- Units 1 and 2 test without a scaffold that Practice always gives: the name of the common pieces, and the multiples lists.
- Switching units clears the retry lock, so a student can skip the "Try one like it" problem.

## 2. Top 5 changes (ranked)

1. **Make the student represent the story (C1-13).** Add a first step: "Which matches the story?" with the choices `A + B`, `A − B` and `B − A`. Take the expression out of the answer prompt. This is the part of 5.NF.2 that is missing now.
2. **Fix "Does it make sense?" so it can't be guessed or copied (C1-14, C1-15).** Pick the verdict first, so each verdict comes up one time in three. When the claim is right, the typed step should ask for work the student has to produce, not the number already on screen.
3. **Start benchmark checks in Unit 1 and keep using them (C1-20, the user's question).** See §2a.
4. **Practice the skill the Test asks for (C1-02, C1-05).**
   - Unit 1: add a "Which pieces can you cut both bars into?" step instead of naming the pieces.
   - Unit 2: show the multiples lists only after a wrong try, the way Unit 3 already does.
5. **Close the retry-lock side door (C1-01).** Keep the "owes a retry" state per unit in the lab component, not in `UnitView`, so it survives switching units. Apply the same change to the other shells that have the lock.

## 2a. The user's question: should Unit 5's benchmark/reasonableness work come earlier?

**Recommendation: yes, partly. Move the benchmark *check* to Unit 1 and use it in Units 3–4. Keep the *word problems* in Unit 5, last.** This changes the approved plan, so it **needs the user's decision** (see C1-20).

Why move the benchmark check earlier:
- **It isn't new.** Comparing to 1/2 is 4.NF.2. MG9 IntroToFractions (ComparingFractions) already teaches the word "benchmark" with 0, 1/2 and 1. Students don't need Units 2–4 before they can use it.
- **It is the tool that catches Unit 1's misconception.** The 5.NF.2 example in the standard is "recognize an incorrect result 2/5 + 1/2 = 3/7, by observing that 3/7 < 1/2". That is Unit 1's add-across argument. Unit 1 already makes this argument ("2/5 is less than 1/2, so it's too small") but never names it or asks the student to use it. Naming it there gives the student a check they can use on their own, not just a rule.
- **The procedure-follower never has to check an answer.** Right now no step in Units 1–4 asks "does this answer make sense?" (grep: "benchmark", "estimate" and "makes sense" appear only in Unit 5 and the Module Test). A student can do three units of procedures and meet number sense only at the end, as its own topic. Spreading the check across units makes it a habit and spaces out the practice.
- **Unit 5 still has to stay last.** Its stories need the add/subtract procedure (Unit 3), and its mixed-number stories need borrowing and carrying (Unit 4). Moving the whole unit to position 2 would mean word problems the student can't yet solve exactly.

Options, from lightest to heaviest:
- **A. Keep the order. Add one "Does your answer make sense?" choice step** (about right / too small / too big, compared with a benchmark estimate) to Unit 3 and Unit 4 Practice. Low cost, but students still meet the word "benchmark" only in Unit 5.
- **B. (Recommended) Do A, and also bring the benchmark idea into Unit 1:**
  - In the "Add across" Explore view, add a small 0–1 BenchmarkLine showing both addends and the add-across result.
  - Replace Unit 1 Practice step 3 ("Who is right?", which repeats step 2; see C1-03) with: "Is mn/md about right, too small, or too big? Compare it with the bigger part."
  - Use the word "benchmark" in Unit 1 CFU Q1's feedback.
  - Unit 5 keeps the full benchmark lesson (estimate a sum or difference, judge someone else's answer before computing, mixed-number estimates) plus the stories.
- **C. Insert a short new unit, "Estimate with benchmarks", between Units 1 and 2.** This gives the clearest teaching, but makes 6 units. The Module Test would need 30 questions or a rebalance. Not needed if B is done.
- **D. Move all of Unit 5 to second place.** Not recommended, for the reasons above.

## 3. Scorecard

| Unit | L1 Standards/sequence | L2 Audience | L3 Arc | L4 Unstuck | L5 Pictures | L6 Math | L7 Mastery | L8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 Why not across | Strong | Strong | **Weak**: Test asks for the piece size, Practice always gives it | OK | Strong | Strong | OK (step 3 repeats step 2) | OK |
| 2 Common denominators | Strong | Strong | **Weak**: lists always shown in Practice, never in Test | OK | Strong | Strong | OK | OK |
| 3 Add/subtract | OK (addends are never improper) | Strong | Strong | OK | OK (slivers at LCD 48) | OK (weak subtraction distractor) | Strong | OK |
| 4 Mixed numbers | OK (no tie to MG9's "unbundle") | Strong | OK (carry has no picture) | OK | **Weak**: borrow bars become slivers at LCD ≥ 24 | Strong | Strong | OK |
| 5 Word problems | **Weak**: the student never represents the story | Strong | OK (Explore shows sums only) | OK | Strong | Strong | **Weak**: "Yes" right 69%, right claim can be copied | OK |
| Shell | — | — | — | **Weak**: switching units clears the retry lock | — | — | — | OK |

## 4. All findings

### Shell / all units

**C1-01 — Major — Layer 4 (getting unstuck)**
- **Problem:** Switching to another unit (or Home) and back clears the retry lock.
- **Who it hurts:** The guesser, on any Practice screen after "Solved, with help."
- **Evidence:** Browser walk in Unit 5. After a helped solve, the bar said "Try one like it" and the type switch was locked. Clicking Unit 4 and then Unit 5 → Practice brought back "New problem", and the type switch was enabled (`type switch disabled: false`).
  - Cause: `owesRetry` is `useState` inside `UnitView` (`MG10_AddingAndSubtractingFractionsLab.tsx:197`), and `UnitView` is keyed by `unit.id` (`:417`), so it resets.
  - A reload also clears it.
  - MK1's shell has the same pattern (`MK1_CountingAndCardinalityLab.tsx:196`, `:430`).
- **Fix:** Lift the per-unit "owes a retry" flag and its bucket into the lab component, as `Record<unitId, bucket | null>`, mirrored to `sessionStorage` under the module key. When `UnitView` mounts with a debt, start in the owed bucket with the lock on. Make the same change in MK1–MK4 and MG1 (the K–1 shells are near-copies, and the builder rules say fix all of them together).

### Unit 1 — Why You Can't Just Add Across

**C1-02 — Major — Layer 3 (learning arc)**
- **Problem:** The Test asks for something Practice never makes the student do: choose the common piece size.
- **Who it hurts:** The procedure-follower, on Unit 1 Test Q2–Q5 and Module Q4.
- **Evidence:**
  - Every Practice problem names the pieces in the story and in step 1: "Cut both bars into {pieceWord(L)} first" (`WhyNotAcross.tsx:243`, `:253`). CFU Q2 does too ("Cut both bars into sixths").
  - Test `sumQuestion` (`WhyNotAcrossTest.tsx:50`) gives only "n1/d1 + n2/d2 = ?", and Tests show no hints (`UnitTest.tsx:44`). So 4 of the 10 questions need a skill that was never practiced before Unit 2 teaches it.
  - Test Q9 asks the piece-size choice directly, and no Practice step matches it.
- **Fix:** Add a first Practice step: "Which pieces can you cut BOTH bars into?" with the choices `pieceWord(L)`, `pieceWord(d1+d2)` and `pieceWord(max(d1,d2))`. This mirrors Test Q9 and catches the "added the denominators" mistake. Take the piece name out of the story and the step-1 prompt until that step is done.

**C1-03 — Minor — Layer 7 (mastery)**
- **Problem:** Practice step 3 ("Ana says X. Ben says Y. Who is right?") asks the same thing as step 2. The student has just typed the sum, so they only match it. "Neither of them" is never right in Practice.
- **Who it hurts:** The guesser, on Unit 1 Practice step 3.
- **Evidence:** `WhyNotAcross.tsx:270-278`.
- **Fix:** Replace it with a benchmark check (see §2a, option B): "Is {mn}/{md} about right, too small, or too big? Compare it with {big}." If the user keeps the current order, at least randomize whether either person is right.

**C1-04 — Minor — Layer 6 (math / misconceptions)**
- **Problem:** CFU Q4's correct-answer feedback says "Adding across never works when the denominators are different." That suggests it *does* work when the denominators are the same (1/4 + 1/4 ≠ 2/8).
- **Who it hurts:** The student with a gap, on the Unit 1 CFU.
- **Evidence:** `WhyNotAcross.tsx:116`.
- **Fix:** "Adding across never works. When the denominators are the same, add only the tops. 1/2 = 2/4, so 1/4 + 2/4 = 3/4."

### Unit 2 — Finding a Common Denominator

**C1-05 — Major — Layers 3 and 7 (learning arc, mastery)**
- **Problem:** Practice always shows both multiples lists, so the LCD sits on screen in both rows from the start. The Test takes the lists away.
- **Who it hurts:** The procedure-follower, on Unit 2 Test Q2–Q3 and Module Q6.
- **Evidence:**
  - Practice: `<MultiplesList a={d1} b={d2} …>` is always rendered (`CommonDenominators.tsx:217`). Screenshot `shots/u2lcd-s0-wrong2.png`.
  - Test: `lcdQuestion("medium","coprime")` and `("hard","shared")` have `withList = false` (`CommonDenominatorsTest.tsx:203-204`).
  - Every star can be earned by reading the lists. The student never has to make the multiples.
  - Unit 3 already does this the right way: lists appear only after a wrong try (`AddSubtractUnlike.tsx:225`).
- **Fix:** In Unit 2 Practice, show the lists only when `pointing(help, 0)` or `done >= 1`, the way Unit 3 does. Or show only the bigger denominator's row before help, with the hint "Which of these does {small} go into?"

**C1-06 — Polish — Layer 7 (mastery)**
- **Problem:** In the Mixed numbers bucket, step 3 ("Which number is bigger?") is decided by the whole numbers half the time, so the LCD isn't used. "They are equal" is never right.
- **Evidence:** `fractions.ts:231` (`w2 = w1` only 50% of the time). `CommonDenominators.tsx:224-232`.
- **Fix:** Always use equal wholes in the `mixedNumbers` bucket, or swap in a new step there: "Type the bigger number's fraction part over the LCD."

### Unit 3 — Adding and Subtracting Fractions

**C1-07 — Minor — Layer 6 (math / misconceptions)**
- **Problem:** Test Q7's subtraction distractor (`|n1−n2|/|d1−d2|`) is often easy to throw out:
  - About 18% of subtraction draws give 0/8, 0/4 or 0/9.
  - About 36% give an improper fraction or a whole number (e.g. 4/2) in a "which is in simplest form?" question.
- **Evidence:** 20k-draw script: 1,772 zero-top draws and 3,658 improper/whole draws. `AddSubtractUnlikeTest.tsx:58`.
- **Fix:** Use this distractor only when it is a proper fraction with a non-zero top. Otherwise use "subtracted the old tops over the LCD", i.e. `simplestText(n1−n2, L)` when `n1 > n2`. Otherwise use `${a+b}/${L}` simplified ("added instead").

**C1-08 — Minor — Layer 1 (standards)**
- **Problem:** Addends are always proper fractions, except the first fraction in `subWhole`. 5.NF.1's own example is 2/3 + 5/4 = 23/12.
- **Evidence:** `u3Params` uses `properNum` (`fractions.ts:287-288`).
- **Fix:** In `addMixed`, let about a quarter of draws have one improper addend in lowest terms (e.g. 5/4 + 2/3). Keep the Explore and Key Idea text the same.

### Unit 4 — Adding and Subtracting Mixed Numbers

**C1-09 — Minor — Layer 5 (pictures)**
- **Problem:** At LCD 24–48 the borrow and mixed-number bars are drawn as 2–5 px slivers that no one can count. This happens in about 27% of Unit 4 problems. It also affects Unit 3's RecutBars at LCD 48.
- **Who it hurts:** The student with a gap, who leans on the picture at the borrow step.
- **Evidence:** `shots/gallery.png` (L = 30 and L = 48) and `shots/u4sub-s3-wrong2.png` (3 9/16 − 1 7/12, LCD 48). Script: LCD ≥ 24 in 5,412 of 20,000 Unit 4 draws.
- **Fix:** Either option works:
  - Limit Unit 4's pairs to LCD ≤ 24. The approved plan's "product isn't the LCD" pairs 4&6, 6&9 and 8&12 still fit.
  - When L > 24, draw each loose bar at `barWidth` 260 on its own row, with an "L pieces" label.

**C1-10 — Minor — Layer 1 (sequence)**
- **Problem:** MG9 FractionOperations taught this exact move as "unbundle a whole" (its Practice type label is "Unbundle a whole"). Unit 4 says "borrow" and "regrouping" but never connects them to the word students already know.
- **Evidence:** `MG9/FractionOperationsLab/units/AddSubtractFractions.tsx:511`, `:545`, `:608`. `MixedNumbers.tsx:212-213`.
- **Fix:** Add one sentence to Unit 4 Explore: "(Borrowing is also called regrouping. In Fraction Operations you called it unbundling a whole.)" Keep "borrow" everywhere else, as the plan requires.

**C1-11 — Minor — Layers 3 and 5 (learning arc, pictures)**
- **Problem:** Carrying is shown only in words. Explore's Add view draws the two addends and then states the answer. Practice draws the result only after the problem is finished. No picture shows the pieces making a new whole.
- **Who it hurts:** The procedure-follower, on `addCarry` (Test Q2 and Q9).
- **Evidence:** `MixedNumbers.tsx:161-170` and `:322-329`.
- **Fix:** Add a result bar in Explore with `rn` loose pieces spilling past one full bar, and a "Carry 1 whole" button that mirrors "Borrow 1 whole" (the full bar becomes a solid "1"). In Practice, show that result bar when `pointing(help, answerIdx)` for `addCarry`.

**C1-12 — Polish — Layer 5 (pictures)**
- **Problem:** Before the student borrows, the Explore caption says "Take away … (crossed out)", but nothing is crossed out yet.
- **Evidence:** `MixedNumbers.tsx:183`.
- **Fix:** Before borrowing, use the caption "Start with …. You need to take away …".

### Unit 5 — Word Problems: Benchmarks and Making Sense

**C1-13 — Major — Layers 1 and 3 (standards, learning arc)**
- **Problem:** The student never decides how to represent the story. 5.NF.2 says "e.g., by using visual fraction models or equations to represent the problem."
- **Who it hurts:** The procedure-follower, on Practice "In total", "Left or more" and "Mixed numbers", and on Test Q5–Q9.
- **Evidence:**
  - The answer step prints the expression: "Write 7/10 − 3/5 in simplest form" (`WordProblems.tsx:272`, `:403`).
  - The Practice types are named by operation ("In total" / "Left or more").
  - The estimate hint says "Then add" or "Then subtract" (`:237`).
  - In 25% of stories the wrong operation gives the same estimate (the second fraction rounds to 0), so even step 1 doesn't always check the operation.
  - The Test stories (Q5–Q9) give no expression, so the Test asks for what Practice did for the student.
- **Fix:**
  1. Add a first choice step: "Which matches the story?" with the choices `A + B`, `A − B` and `B − A`. `B − A` is the "subtract smaller from bigger in the wrong order" trap for compare and more-needed stories.
  2. Change the answer prompt to "What is the answer? Write it in simplest form."
  3. Change the estimate hint to "Find the benchmark for each amount. Then use them the way the story does."
  4. Rename the Practice types neutrally ("Short stories" / "Mixed-number stories"), or keep the labels only in single-type mode.

**C1-14 — Major — Layer 7 (mastery)**
- **Problem:** "Does it make sense?" can be passed by always answering "Yes". The add-across claim, which is the main misconception, is the rarest.
- **Who it hurts:** The guesser, on the "Does it make sense?" Practice type, Unit 5 Test Q4 and Module Q22.
- **Evidence:** Script, 20,000 draws: verdict "ok" 13,842 (69%), "big" 3,735 (19%), "small"/add-across 2,423 (12%).
  - Cause: the claim kind is picked evenly, but add-across claims are often thrown out as "not clearly off", and the loop redraws (`WordProblems.tsx:292-296`, `WordProblemsTest.tsx:80-84`, `claimFor` in `fractions.ts:454`).
- **Fix:** Pick the verdict first (one in three each). Then redraw pairs and claim kinds until `claimFor` gives that verdict. Weight "small" to come from `addAcross`.

**C1-15 — Major — Layer 7 (mastery)**
- **Problem:** When the claim is right (69% of the time), the final typed answer is the claim, which is already printed in the story and drawn on the number line. The student copies it, at most turning 19/12 into 1 7/12.
- **Who it hurts:** The guesser, on "Does it make sense?" step 3.
- **Evidence:** `shots/u5reas-s2-wrong2.png`: "Ivy worked out 11/12 + 2/3 and got 19/12", 19/12 is on the line, and step 3 asks for 11/12 + 2/3. Code: `WordProblems.tsx:308`, `:316`, `:346-355`.
- **Fix:** When `claim.verdict === "ok"`, replace step 3 with a typed `rewriteStep` ("Prove it: rewrite both with the LCD, L"). When the claim is wrong, keep "Find the exact answer." Either way the student produces a number that isn't already on screen.

**C1-16 — Minor — Layer 7 (mastery)**
- **Problem:** 43% of subtraction stories have an estimate of 0. For an estimate of 0, `estimateChoices` always lists 0 first, so the right choice is always the first button. "About 0 cups of milk" is also a weak estimate for a story.
- **Evidence:** Script: sub estimate 0 in 4,277 of ~10,000 draws. `fractions.ts:391-394`.
- **Fix:** In `u5Pair("sub")`, require an estimate ≥ 1/2 most of the time (e.g. reject estimate 0 in 3 of 4 draws). For an estimate of 0, let the window sometimes start below 0 in display terms, or use `["0","1/2","1"]` in a shuffled-but-labeled order.

**C1-17 — Minor — Layer 3 (learning arc)**
- **Problem:** Explore demonstrates estimating only sums ("Estimate a sum"). Estimating a difference is used in CFU Q4, in "Left or more", in half of Test Q3 and in Module Q21, but is never shown.
- **Evidence:** `WordProblems.tsx:165` (modes "bench" and "estimate", add only).
- **Fix:** Add an Add/Subtract toggle to "Estimate" mode. For subtraction, keep the first fraction bigger, and show "Estimate: 1 − 1/2 = 1/2".

**C1-18 — Polish — Layer 6 (math accuracy)**
- **Problem:** In "Estimate a sum", a fraction exactly at 1/4 or 3/4 (3/12, 6/8) is called "close to 1/2" or "close to 1" with no comment. The "Find the benchmark" mode says "exactly halfway".
- **Evidence:** `WordProblems.tsx:204`.
- **Fix:** Use the same tie sentence in estimate mode: "3/12 is exactly halfway between 0 and 1/2. Try another."

**C1-19 — Polish — Layer 1 (standards)**
- **Problem:** No item addresses "fractions referring to the same whole" in 5.NF.2 (e.g. 1/2 of a small pizza + 1/3 of a large one).
- **Fix:** Optional. Add a CFU or Test choice: "Can you add these two amounts as 1/2 + 1/3? Why not?"

### Unit order (all units)

**C1-20 — Major — Layer 1 (sequence) — Needs the user's decision**
- **Problem:** Benchmark and reasonableness reasoning appears only in Unit 5. Units 1–4 never ask the student to check whether an answer makes sense, even though Unit 1's argument is that check.
- **Evidence:** grep shows "benchmark", "estimate" and "makes sense" only in `WordProblems*.tsx` and `ModuleTest.tsx`. Unit 1's "2/5 is less than 1/2" reasoning is the standard's own 5.NF.2 example.
- **Fix:** See §2a. Options are A (add sense-check steps to Units 3–4), **B (recommended: A plus the benchmark idea in Unit 1)**, C (a new short unit), or D (move Unit 5; not recommended).

## 5. Persona walkthrough highlights

- **The procedure-follower in Unit 5 "Left or more":**
  - Picks the estimate.
  - Types the LCD.
  - Reads "Write 7/10 − 3/5 in simplest form" and does it.
  - Never decides that the story is subtraction.
  - Then, on Test Q6 ("A bottle holds… pours out…", no expression), has to choose the operation for the first time, with no hints. (C1-13)
- **The guesser in "Does it make sense?":**
  - Picks benchmarks from the dropdowns (1 in 9 to guess both).
  - Answers "Yes, close to the estimate" (right 69% of the time).
  - Types the claim shown on the number line, gets "not in simplest form", and converts it.
  - The lock then sends them to "Try one like it". After that the guesser can switch units and come back to skip it (C1-01). (C1-14, C1-15)
- **The student with a gap in Unit 1 → Test:**
  - Practice always says "cut both into fifteenths", so they never learn how 15 was chosen.
  - On Test Q5 (3/5 + 1/7, no picture, no hint) they have no way to start, or they add the denominators. (C1-02)

## 6. What's working well

- **Unit 1's add-across picture** (the third bar drawn from the add-across result, plus the computed "less than" sentence) teaches the misconception very well.
- **Named-mistake feedback everywhere:**
  - The LCD `diagnose` covers a common multiple that isn't the least, the denominators added, and "goes into one but not the other".
  - The sum and difference `diagnose` covers added across, added the bottoms, used the old tops, and did the wrong operation.
  - The two named borrowing mistakes in Unit 4 each get their own message.
- **The simplest-form check and retry lock work in the browser:** "That's equal, but it's not in simplest form…", then "Solved, with help.", then the type switch locks and "Try one like it" appears.
- **Unit 4's "Borrow 1 whole" button** in Explore, and the borrow picture that shows up when the student is stuck on the borrow step, are the right model. They only need readable piece sizes.
- **Unit 3's progressive reveal:** lists only after a wrong try, re-cut only once the student is working on the rewrite step, result bar only on the answer step.
- **Separate number pools for Unit 1's Test questions**, and the claim design in "Does it make sense?" (wrong claims at least 3/4 from the estimate, right ones within 1/4) are well built.
- **CFUs meet the grade-5 bar:** each has vocabulary, a conflation question and a true/false trap, and they are at least 50% typed in every unit.

## 7. Rule gaps (proposed sentences for `math-lab-builder.md`)

- **C1-02, C1-05:** "If Practice gives a scaffold the Test does not (a named piece size, a multiples list, a printed expression), either remove it from Practice before the first wrong try or add a Practice step that makes the student produce it. Practice must ask for everything the Test asks for, without the help the Test leaves out."
- **C1-13:** "Word-problem units: at least one step in every story problem makes the student choose or write the operation or equation. Prompts, problem titles and type labels must not state the operation or print the expression before that step is done."
- **C1-14:** "For any choice step whose answer depends on generator rejection (e.g. 'does it make sense?'), pick the target answer first and draw values to fit it, then check in the brute-force script that each choice is right about equally often."
- **C1-15:** "A claim shown in a story (someone's answer) must not equal the value a later typed step asks for. If it can, change the typed step."
- **C1-01:** "The retry-lock debt must survive leaving and re-entering the unit: keep it in lab-level state (or sessionStorage), not inside `UnitView`."

## 8. What I could not check

- Real iPad Safari: touch feel of the stacked fraction boxes, and keyboard behavior.
- Real students.
- Every random draw in the browser. I walked one problem per type in Units 1–5 (subtraction types for Units 3–4) and checked the rest by code reading and the 20k-draw script.
- Dark mode (the builder reported a pass).
- Sentence-level English, which belongs to the English checker.

Scratch evidence is in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\mg10-r1-curriculum\`: `check.mjs`, `walk.mjs`, and `shots\*.png`.
