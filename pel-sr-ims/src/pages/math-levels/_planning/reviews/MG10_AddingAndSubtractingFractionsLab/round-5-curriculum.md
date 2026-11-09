# MG10 Adding & Subtracting Fractions: round 5 curriculum review (re-review)

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (5.NF.1–2)
- **Round:** 5 (re-review of the user-request round, U5-01 to U5-04)
- **Date:** 2026-11-08
- **Grade band assessed:** 4th and up (grade 5; text-led reasoning is expected).
- **Inputs:** `round-5-user-request.md`, `round-5-fixes.md`, `plan.md` (with its Round 5 section), the Unit 1 code (`units/WhyNotAcross.tsx`, `units/WhyNotAcrossTest.tsx`, `lib/unit1.tsx`, the Unit 1 part of `lib/fractions.ts`, `diagrams/SizeCheckBars.tsx`, `diagrams/JoinedBar.tsx`), `units/ModuleTest.tsx`, the diagnosis sites in Units 3–5, the Unit 2 Explore, the shared format picker (`AnswerForm.tsx`) and `StepProblem.tsx`'s format check, and the fixer's screenshots in `scratchpad/mg10-r5-fix/shots/`.
- **Assumed / not re-run:** I did not run my own browser walk or brute-force script. I used the fixer's screenshots and read the generators. Each finding below says which.
- **Out of scope (waiting on the user, not re-raised):** unit order (C1-20 / C1-03); "same whole" (C1-19); format giveaways outside Unit 1.

## 0. Status of this round's work order

| ID | Status | Note |
|---|---|---|
| U5-01 "Pick a format to write your answer." | **Fixed** | The line sits in `FormPicker` above the buttons. It shows in Practice, CFUs and Tests (screenshot `u1-t1-4-across-diagnosis.png`). The Explore guide title uses the same words. |
| U5-02 add-across diagnosis | **Fixed** (one small gap, C5-08) | The math is right everywhere it fires: an add-across answer always lies strictly between the two fractions, so "less than the bigger one" is always true. Units 3, 4 and 5 rule out equal fractions. The subtract-across size check only fires when it holds. Tests never show it: `UnitTest.tsx` uses only `check(...).ok`. It is shown in Practice only. The Unit 1 CFU doesn't name the mistake (C5-08). |
| U5-03 Unit 1 redesign | **Fixed, but caused new problems** (C5-01, C5-02, C5-03, C5-04) | The unit now rests on grade 3–4 skills and teaches "you can't add across" well. The "no shared factor" problem type can be solved cleanly without thinking. Practice also always prints the piece size, but the Test doesn't. |
| U5-04 sums past 1 | **Fixed** | The size is drawn first: about 50% under 1, 12% exactly 1, 38% over 1. Test Q3, Q4 and Q6 vary their format. One format giveaway is left in Unit 1's Test Q9 (C5-09). |

## 1. Verdict

**Ready after fixes.** The new Unit 1 teaches the right idea from the right starting skills. But in the "Bottoms share no factor" problems a student can earn a clean solve by pattern and copying:
- the right picture is always the one cut into the smallest pieces;
- after the pick, the finished step prints the sum the next step asks for.

## 2. Top 5 changes

1. **C5-01.** Stop the "which picture?" step from printing the answer to the typed step that follows it.
2. **C5-02.** Make the "which picture?" step need a size comparison:
   - draw the three choices without piece lines, or with the same piece lines;
   - hide the add-across bar until after a wrong pick.
3. **C5-03.** Make Practice "fits" problems ask what the Test asks: drop the printed "each third is 2 sixths" from the rename prompt, so the student works out the renaming.
4. **C5-04.** On the rename step, show the cut bars once, with labels. Right now the hint points at a labeled bar that isn't cut.
5. **C5-07.** Make the estimate step a real estimate: compare with 1 whenever the sum is clearly away from 1, and drop "less than 2".

## 3. Scorecard (round-5 changes)

| Unit | 1 Standards | 2 Audience | 3 Arc | 4 Unstuck | 5 Pictures | 6 Math | 7 Mastery | 8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 (redesigned) | Strong | OK | **Weak**: Practice always prints the rename; Test Q3/Q4 don't (C5-03) | OK: the rename step has no named feedback (C5-05) | **Weak**: duplicate bars on the rename step (C5-04); finest-cut giveaway (C5-02) | Strong | **Weak**: C5-01, C5-02 | OK |
| 1 → 2 handoff | OK | OK | OK: works, but no bridge (C5-10) | n/a | n/a | Strong | n/a | n/a |
| 3, 4, 5 (diagnosis only) | — | — | — | Strong | Strong (Unit 3 bars) | Strong | — | OK |

## 4. Findings

### Unit 1: Practice

**C5-01 · Major · The "no shared factor" sum step is a copy when the sum is under 1**
- **Who it hurts:** the procedure-follower, on "Bottoms share no factor", step 4.
- **Evidence:** in `u1-t1-4-across-diagnosis.png`, after the picture is picked, the finished step 3 shows the chosen choice's label, "7/12". Step 4 then asks "Write 1/3 + 1/4 in simplest form."
  - The labels come from `pickPictureStep` in `lib/unit1.tsx`, line 179 (`${o.v[0]}/${o.v[1]}`).
  - With no shared factor, s/L is always already in simplest form, because gcd(n1·d2 + n2·d1, d1·d2) = 1.
  - So for every `noShareUnder1` problem, the typed answer is printed on screen.
  - For `noShareOver1` the chip shows the improper fraction ("17/12"), so only the conversion is left.
  - This breaks the builder rule "a typed step that only copies a number already on screen does not count".
- **Fix:** don't put the value in the picture-choice label. Use neutral labels ("Picture 1/2/3", in shuffled order), or have the finished chip show the picked picture. Keep the explanation "1/3 is 4 twelfths and 1/4 is 3 twelfths": adding 4 + 3 is real work.
- **Layer:** 7.

**C5-02 · Major · "Which picture shows a + b?" can be passed by a pattern**
- **Who it hurts:** the procedure-follower and the guesser, on Practice step 3, Unit 1 Test Q5 and Module Test Q4.
- **Evidence:**
  - The choices are cut into L = d1·d2, d1+d2, and d1 or d2 pieces. For every no-shared-factor pair, d1·d2 is more than d1+d2, which is more than either bottom.
  - So **the right picture is always the one with the most, thinnest pieces.** In `u1-t1-3-pictures.png` the right picture is the only finely cut one.
  - In Practice, the `SizeCheckBars` row for the add-across answer (labeled, e.g., 2/7) is on screen during step 3 before any wrong try: `across = … || done === 2`, `WhyNotAcross.tsx` line 287. It is drawn exactly like the add-across choice, so that choice can be crossed out by matching.
  - A student never has to compare amounts.
- **Fix:**
  - (a) Draw all three choice bars as a shaded length with no inner piece lines (whole-bar outline only). The only way to choose is to compare with the end-to-end sum. Step 4's recut picture then shows the twelfths.
  - (b) In Practice, show the add-across `SizeCheckBars` on step 3 only after a wrong pick (`pointing(help, 2)`), not on `done === 2`.
- **Layer:** 7, 5.

**C5-03 · Major · Practice always prints the renaming; the Test asks for it unprompted**
- **Who it hurts:** a student with a gap in equivalent fractions, on Unit 1 Test Q3/Q4 and Module Test Q3.
- **Evidence:**
  - Every "fits" Practice problem has a rename step whose prompt prints the target pieces and the factor: "3 fits in 6: each third is 2 sixths. Write 2/3 in sixths." (`renameStep`, `lib/unit1.tsx` line 126). The sum step comes after it.
  - Test Q3/Q4 (`fitsSumQuestion`) ask only the sum step: "Now add: a + b = ? Write it in simplest form." So the student must notice that 3 fits in 6, choose sixths and rename on their own.
  - Practice never asks for that without the scaffold.
  - This breaks the builder rule "Whatever the Test asks, Practice must also ask without help". The rule's own example is this same unit, from round 1.
- **Fix:**
  - The rename prompt becomes "Write 2/3 with the same bottom as 5/6."
  - Move "3 fits in 6: each third is 2 sixths" to the hint and the explanation. The picture still shows the cut after a wrong try.
  - Optionally, on about half of "fits" problems, skip the rename step and ask the sum directly, as the Test does.
- **Layer:** 3.

**C5-04 · Minor · The rename step draws the fractions twice, and the hint points to the uncut copy**
- **Who it hurts:** the first-timer, on "fits" step 3.
- **Evidence:**
  - In `u1-t0-3-rename-wrong.png`, the top shows the cut bars without labels (`hideLabels={done < 4}`).
  - Below them, `SizeCheckBars` shows labeled, uncut 2/5 and 7/10 bars, plus 9/15. They have a different width and start point.
  - The hint says "Count the small pieces in the shaded part of the 2/5 bar". The only bar labeled 2/5 is the uncut one.
  - Cause: for "fits" problems, `across` is true when `done === 2`.
- **Fix:** for "fits" problems, show the size check only on step 2 (after a wrong try), not on the rename step. Show labels on the cut bars from the rename step on (`hideLabels={fits ? done < 2 : done < 4}`).
- **Layer:** 5, 8.

**C5-05 · Minor · The rename step's commonest wrong answers get "Not yet. Check your work and try again."**
- **Who it hurts:** a student with an equivalence gap.
- **Evidence:** in `u1-t0-3-rename-wrong.png`, the student kept the old top (2 for 2/5 as tenths). `numeratorStep` has no `diagnose`. The fixer's §7 item 3 notes this too.
- **Fix:** add a diagnose to `renameStep`:
  - kept the old top (v = nS): "That's the old top. Each fifth is 2 tenths, so 2 fifths is 2 × 2 tenths."
  - typed one piece (v = k): "That's 1 fifth. You have 2 fifths."
- **Layer:** 4.

**C5-06 · Minor · Needs the user's decision · Each form of the judge step always has the same answer**
- **Who it hurts:** the procedure-follower, on step 2.
- **Evidence** (`judgeStep`, `lib/unit1.tsx` lines 88–115):
  - "too small, right, or too big?" is always "Too small";
  - "more or less than the bigger?" is always "Less";
  - "more or less than the smaller?" is always "More".
  - Overall the taps are balanced. But once a student knows the three forms, they can answer from the question alone.
  - This is honest, because an add-across answer is always between the two fractions, and that fixed answer *is* the lesson. So it is low-risk. But the step proves little after the first few problems.
- **Options:**
  - (a) Keep it as a teaching step; mastery rests on the typed steps.
  - (b) Sometimes compare the add-across answer with 1/2. The answer then varies, and the bars still show it.
  - (c) Sometimes judge a different named mistake that comes out too big ("added the tops, kept the smaller bottom", already a picture distractor), so "Too big" is sometimes right.
- **Layer:** 7.

**C5-07 · Minor · About half the estimate questions answer themselves**
- **Who it hurts:** the procedure-follower, on step 1 and Test Q1 / Module Test Q1.
- **Evidence:**
  - From `estimatePlan` and the fixer's split: "More than the bigger fraction" (39%) is always More. "Less than 2" (16%) is always Less.
  - Only the comparisons with 1 (45%) need an estimate.
  - "More than the bigger" repeats step 2's idea.
- **Fix:**
  - Ask about 1 whenever the sum is clearly away from 1: sums under 1 give Less, sums over 1 give More, which is close to 50/50 already.
  - Use "more than the bigger fraction" only when the sum is near 1 or exactly 1.
  - Drop "less than 2".
- **Layer:** 7.

### Unit 1: CFU

**C5-08 · Minor · CFU Q4 calls the add-across answer "Close."**
- **Who it hurts:** a student who still adds across, on CFU Q4.
- **Evidence:** in `WhyNotAcross.tsx` lines 127–131, a wrong sum after a right True/False always gets "Close. 2 fits in 4, so write 1/2 in fourths first…". That includes 4/6 or 2/3, which is the add-across answer to 3/4 + 1/2. The `bad` function gets `values`, but doesn't use them.
- **Fix:** when `values[1]` equals 4/6, say: "You added across. 4/6 is less than 3/4, but adding should make a bigger number. 1/2 = 2/4, so add fourths."
- **Layer:** 4.

### Unit 1: Test

**C5-09 · Minor · The format gives Test Q9 away when the sum is 1 or more**
- **Evidence:**
  - `addAcrossChoiceQuestion` draws from both "fits" buckets, so about half the time the right choice is "1" or "1 1/4".
  - Both distractors are plain fractions: the add-across answer is always less than 1, and (n1+n2)/max is shown unreduced, e.g. "4/4".
  - The right answer is then the only whole or mixed number.
- **Fix:** draw Q9 from `fitsUnder1` only. Or, when the sum is 1 or more, make the second distractor a near-miss written the same way (e.g. "1 1/2" for 1 1/4).
- **Layer:** 7.

**C5-11 · Polish · Test Q3/Q4 begin "Now add:" with nothing before them**
- **Evidence:** the `sumStep` prompt is reused as-is in `fitsSumQuestion`.
- **Fix:** give `sumStep` a Test wording: "Find a + b. Write it in simplest form."
- **Layer:** 2.

### Unit 1 → Unit 2 handoff

**C5-10 · Minor · Unit 2 still opens well, but doesn't connect to Unit 1**
- **Evidence:**
  - `CommonDenominators.tsx` Explore (line 144) defines "common denominator" from scratch with "go into". It has no false "as in Unit 1" line, so nothing broke.
  - Unit 1 ends with "In Unit 2, you will learn how to find these pieces". It uses "fits in", "bottom" and "same-size pieces".
  - Unit 2 switches to "goes into", "denominator" and multiples lists. The link (the twelfths picture shows that 12 is a common denominator) is only implied by the bar caption at the bottom.
- **Fix:** add one opening sentence to Unit 2 Explore: "In Unit 1, the picture cut 1/3 and 1/4 into twelfths so you could add them. 12 is a **common denominator**: both 3 and 4 go into it (fit in it). Now you will find it yourself." Use "goes into" from then on.
- **Layer:** 1, 3.

### Polish (Unit 1)

**C5-12 · Polish · Counting thin pieces**
- **Evidence:** `noShareOver1` sums can be 20 or more fifteenths or fourteenths, at about 12 px a piece when `W = 180`. Unverified on a real iPad.
- **Fix:** use `barWidth` 240 when L is 12 or more.
- **Layer:** 8.

**C5-13 · Polish · `shownText` reduces some answers when it quotes them**
- **Evidence:** a typed 7/7 (the add-across answer for 5/4 + 2/3 in Unit 3 `addMixed`) is quoted back as "1".
- **Fix:** quote the boxes as typed.
- **Layer:** 6.

**C5-14 · Polish · The CFU has no "no shared factor" item**
- **Evidence:** the CFU never shows a recut-and-count sum, and the Explore view that teaches it is off by default.
- **Fix:** add a typed part to Q1: picture of 1/2 and 1/3 in sixths, "1/2 + 1/3 = [ ]/6". This also raises the CFU's typed share.
- **Layer:** 3.

## 5. Persona walkthrough highlights

- **The procedure-follower, on "Bottoms share no factor":**
  - Step 1: "more than the bigger fraction" is always More.
  - Step 2: "too small", as always.
  - Step 3: taps the picture with the most pieces, after crossing out the one that matches the purple add-across bar above.
  - Step 4: copies the "7/12" printed in the finished step 3.
  - The result is a clean star, with no estimate or count made (C5-01, C5-02).
- **The student with an equivalence gap, on Test Q4** ("Now add: 1/2 + 3/8"): every Practice problem told them "2 fits in 8: each half is 4 eighths". Here nothing does, and there's no picture. They add across or stall (C5-03).
- **The first-timer, on the rename step:** reads the hint "the shaded part of the 2/5 bar", looks at the labeled 2/5 bar, finds no small pieces, and types 2 again. The only message is "Not yet" (C5-04, C5-05).

## 6. What's working well

- **Unit 1 now rests only on grade 3–4 skills.** "Common denominator" and "LCD" are gone from Unit 1, and every typed sum either has one bottom fitting in the other or is counted from a drawn picture.
- **"You can't add across" is taught from many sides:**
  - the Explore size check with three bars and the end-to-end picture;
  - the estimate and judge steps;
  - the wrap-up "= 7/12, not 2/7";
  - the diagnosis with a "your answer is shorter" picture.
  - The key idea is true for every problem.
- **The add-across diagnosis is mathematically sound in all four units.** It is in Practice only, and the subtraction version is careful.
- **Sums past 1 make Unit 1 practice the answer format.** The format line is consistent everywhere.
- **The Test pools for Q2–Q6 don't overlap,** and the Test is built from the same step builders as Practice.

## 7. Rule gaps (proposed sentences for `math-lab-builder.md`)

1. "A picture choice's text label is shown in the finished step, so it must never be the value a later typed step asks for. Use neutral labels such as 'Picture 1'."
2. "In a picture choice, the right picture must not stand out by a feature other than the amount asked (most pieces, finest cut, most shaded). Draw every choice with the same piece lines, or none."
3. "If a choice step's question has several forms, no form may have the same right answer every time. Balancing across forms is not enough."

## 8. What I could not check

- I ran no browser walk of my own. Picture evidence is from the fixer's screenshots.
- I ran no brute-force script of my own. The collision and balance figures are from `round-5-fixes.md`, and the key structural claims (finest cut, s/L already in simplest form) were checked by hand.
- I could not check a real iPad or real students.
