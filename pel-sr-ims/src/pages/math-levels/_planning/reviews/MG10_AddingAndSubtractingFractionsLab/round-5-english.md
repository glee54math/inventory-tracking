# MG10 Adding & Subtracting Fractions: round 5 English review (re-review)

- **Lab:** `MG10/MG10_AddingAndSubtractingFractionsLab.tsx` + `MG10/AddingAndSubtractingFractionsLab/`
- **Round:** 5, a re-review after the user-request fixes (`round-5-user-request.md`, `round-5-fixes.md`)
- **Date:** 2026-11-08
- **Grade assessed:** 5th (5.NF.1–2), using `grade-5.md` (20 words a sentence). Text a student reads alone was also held to `grade-4.md` (18 words a sentence).
- **Voice:** this lab has **no read-aloud**. Neither the shell nor any unit uses `TtsProvider`, so the shared `ReadAloud` parts render as plain text. Nothing is spoken. The work order's "the voice reads it before the buttons" has no effect here. The format line does come before the buttons in the page order, so a voice would read it first if one were ever added. For the voice column I checked what a screen reader gets instead (`aria-label`s).
- **Scope (from the caller):** the redesigned Unit 1 (Explore, CFU, Practice, Test, and the Unit 1 questions in the Module Test); the add-across messages in Units 1, 3, 4 and 5; the format line and the Unit 3 Explore wording; and the Unit 5 CFU Q2 instruction.
- **Kept as is:** "Pick a format to write your answer." is the user's own wording, so I don't suggest replacing it. Nothing nearby makes it confusing, except that it repeats four times in Unit 5 CFU Q2 (E5-12).
- **Out of scope (waiting on the user):** unit order, the "same whole" idea, and format giveaways outside Unit 1. I don't raise them again.
- **Method:**
  - I ran `english-check.cjs` at grade 5 on the whole lab and at grade 4 on the changed files. 0 new flags. The flags it found are all old lines.
  - I bundled the real code with esbuild and printed every Unit 1 Practice template for every bucket, plus the Unit 1 Test and the Module Test Unit 1 questions. I sent add-across answers through the real `check()` in each format, and did the same for the Units 3–5 diagnoses.
  - I counted how often the giveaways happen over 5,000 draws.
  - I looked at the fixer's screenshots from the browser walk at iPad size.

## 0. Status of this round's work order (English side)

Rounds 3–5 were user requests, so there is no English **Fix** list to carry forward. Here is how each U5 item reads:

| Item | Status | Notes |
|---|---|---|
| U5-01 format line | **Fixed** | The line appears above the buttons in Practice, the CFUs and the Tests, word for word. The Unit 3 guide title and "Format:" line match it. Two names are still used for the same idea ("format" and "kind of answer"), see E5-08. The line repeats in Unit 5 CFU Q2, see E5-12. |
| U5-02 add-across messages | **Fixed** | The messages are short and grammatical for every value, and they name the mistake plus a size check. Two follow-ups: when the format is also wrong the message grows to 5 sentences and reads as if *your* answer isn't proper (E5-09). The Unit 3 subtraction message can echo a number the student didn't type (E5-13). |
| U5-03 Unit 1 redesign | **Fixed, but caused new problems** | The English is at grade level throughout, with 0% over the limit. But two new step wordings give away the answer (E5-01, E5-02). Several prompts and hints point at bars that have no label (E5-03, E5-04). "Fits in" is never defined, and Unit 2 switches to "goes into" (E5-05, E5-06). |
| U5-04 sums past 1 | **Fixed** | "12/12 is 1 whole." and "= 1 1/4" read cleanly. The exact-1 and mixed cases are grammatical. |

## 1. Verdict

**Not ready on English: 2 Major findings, no Blockers.** The new Unit 1 text is short and plain. Every sentence is under the grade-4 limit, the pronouns match the names, and there are no slash fractions on screen. But two new step wordings hand the student the answer. In the "Bottoms share no factor" problems, the picture choice the student just tapped stays on screen as "7/12" (or a similar fraction), right above the step that asks them to type 1/3 + 1/4 in simplest form. And the rename prompt "each half is 3 sixths. Write 1/2 in sixths." states the answer whenever the top number is 1. That happens 66% of the time in Practice and 51% of the time in Test Q2.

## 2. Scorecard

| Part | Length | Grammar | Vocabulary | Word problems | Voice (screen reader) | Screen load |
|---|---|---|---|---|---|---|
| Unit 1 Explore + key idea | Strong (0%) | OK (E5-16) | **Weak** ("fits in" undefined, E5-05) | n/a | OK | OK (text vs. picture slip above 48 pieces, E5-11) |
| Unit 1 CFU | Strong (0%) | Strong | OK | n/a | OK | OK ("Close." on the add-across answer, E5-07; Q2 states its answer, E5-02) |
| Unit 1 Practice | Strong (0%) | OK (E5-14, E5-15) | OK (label, E5-06) | n/a | OK (picture names "4/2", "17/12", E5-01) | **Weak** (giveaways E5-01, E5-02; unlabeled bars E5-03, E5-04) |
| Unit 1 Test | Strong (0%) | Strong | OK | n/a | OK | **Weak** (Q2 states its answer, E5-02; "Now add" with nothing before it, E5-10; Q6 ambiguous count, E5-03) |
| Module Test (Unit 1 part) | Strong (0%) | Strong | OK | n/a | OK | OK ("Now add", E5-10) |
| Add-across messages (Units 1, 3, 4, 5) | Strong (0%) | OK | Strong | n/a | n/a | OK (5 sentences with a wrong format, E5-09; echoed number, E5-13) |
| Format line / guide (shared, Units 1, 3) | Strong | Strong | OK ("format" vs "kind of answer", E5-08) | n/a | OK (radio group is still named "Kind of answer") | OK |
| Unit 5 CFU Q2 | Strong | Strong | Strong | n/a | OK | OK (instruction repeated 4 times, E5-12) |

## 3. Findings

### Unit 1 Practice and Test

**E5-01 · Major · The picture choice the student tapped stays on screen as the next step's answer**
- **Where:** `lib/unit1.tsx:178–181` (`pickPictureStep`: each picture's label is `"7/12"`, `"2/7"`, `"4/2"`). Practice "Bottoms share no factor", step 3 → step 4.
- **Text:** After step 3 the finished row shows the tapped choice as a stacked **7/12** (see the fixer's `u1-t1-4-across-diagnosis.png`). Step 4 then asks: "Count the twelfths in the picture. Write 1/3 + 1/4 in simplest form."
- **Why:** In `noShareUnder1`, the label on that row **equals the step-4 answer 100% of the time** (5,000 draws). In `noShareOver1` it shows 17/12, which leaves only the change to a mixed number. This breaks the checklist's Giveaways row (an answer shown on screen).
- **Same label elsewhere:**
  - The labels are also the screen-reader names, which then read "4/2", "6/3", "17/12".
  - The explanation says "The 2/7 picture is adding across", but the pictures carry no number. The student has to count pieces to find it.
- **Rewrite:** Label each picture by its piece size, using the wording the explanation already has:
  - Choices: "The twelfths picture", "The sevenths picture", "The fourths picture". The three sizes never repeat, because L = d1 × d2, d1 + d2 and the two bottoms all differ.
  - Explain: "The twelfths picture: 1/3 is 4 twelfths and 1/4 is 3 twelfths. The sevenths picture is adding across (2/7), which is too small."

**E5-02 · Major · The rename prompt states the answer when the top number is 1 (and CFU Q2 does the same)**
- **Where:** `lib/unit1.tsx:126` (`renameStep`). Used in Practice "One bottom fits in the other" step 3 and Unit 1 Test Q2. Also `units/WhyNotAcross.tsx:73` (CFU Q2).
- **Text:**
  - "2 fits in 6: each half is 3 sixths. Write 1/2 in sixths." (answer 3)
  - "4 fits in 8: each fourth is 2 eighths. Write 1/4 in eighths." (Test Q2, answer 2)
  - CFU Q2: "3 fits in 9, so cut each third into 3 ninths." then "1/3 = [ ]/9" (answer 3)
- **How often:** 66.0% of Practice rename steps and 51.1% of Test Q2 draws have top number 1, so the prompt says the answer outright. Test Q2 is a "no help" question.
- **Breaks:** checklist → Giveaways; builder rule "never put the answer in a story or title".
- **Rewrite:** Move the "each … is k …" fact from the prompt to the hint. The picture already shows the cut.
  - Prompt: "2 fits in 6. Write 1/2 in sixths."
  - Hint (Practice only): "Each half is 3 sixths. Count the small pieces in the shaded part of the bar with thick lines."
  - Explain: unchanged ("Each half is 3 sixths, so 1/2 = 3/6.").
  - CFU Q2: "Find 1/3 + 1/9. 3 fits in 9: 3 × 3 = 9. So the picture cuts each third into ninths."

**E5-03 · Minor · "Count the twelfths in the picture" when the picture has three bars and no labels**
- **Where:** `lib/unit1.tsx:142–143` (`sumStep(p, true)`). Practice "Bottoms share no factor" step 4, and Unit 1 Test Q6.
- **Text:** "Count the twelfths in the picture. Write 1/3 + 1/4 in simplest form." Hint: "12 twelfths make 1 whole. Count the shaded twelfths."
- **Why:**
  - The picture shows three bars, all cut into twelfths, with every label hidden (`hideLabels`). The "together" label is hidden too.
  - Read literally, the prompt means count all 36 twelfths. "The shaded twelfths" counts 14, because both parts are shaded twice.
  - Breaks: checklist → Text vs. picture.
- **Rewrite:**
  - Prompt: "Count the shaded twelfths in the bar with both colors. Write 1/3 + 1/4 in simplest form."
  - Hint: "12 twelfths make 1 whole bar. Count the shaded twelfths in the bar with both colors."
  - Don't use "bottom bar". In this lab, "bottom" means the denominator (traps §1).

**E5-04 · Minor · The hints name a bar by a label that is hidden**
- **Where:** `lib/unit1.tsx:127`, the rename hint. Also `units/WhyNotAcross.tsx:87`, CFU Q2's wrong-answer message.
- **Text:** "Look at the thick lines. Count the small pieces in the shaded part of the 2/3 bar." · "Count the small pieces in the shaded part of the thirds bar."
- **Why:** During the rename step `RecutBars` has `recut` and `hideLabels` on, so neither bar has a label. The student has to work out which bar is "the 2/3 bar". Only the bar that gets re-cut has thick lines (the other is already in the new pieces), so the thick lines name it without a label. Breaks: checklist → Text vs. picture.
- **Rewrite:** "Find the bar with thick lines. Count the small pieces in its shaded part." For CFU Q2: "Not quite. Count the small pieces in the shaded part of the bar with thick lines."

**E5-05 · Minor · "Fits in" is never defined. The Explore shows "doesn't fit" first, and Unit 2 switches to "goes into"**
- **Where:**
  - `units/WhyNotAcross.tsx:234, 238` (Explore), `:73, :130` (CFU), `:352` (key idea), `:362` (label);
  - `lib/unit1.tsx:126`;
  - Unit 2 `CommonDenominators.tsx:144` ("goes into").
- **Text:** The Explore starts on 2 and 3, so in the "Same-size pieces" view the first use a student meets is "2 doesn't fit in 3, and 3 doesn't fit in 2." The positive form with an example ("2 fits in 6: 2 × 3 = 6") only shows if the student picks a pair where one fits.
- **Why:**
  - Read as everyday English, "2 fits in 3" is *true*: 2 is smaller, so it fits. The math meaning (no remainder) is never stated.
  - Unit 2 then defines the same idea as "goes into, with nothing left over" and never links it to "fits in". Two phrasal verbs now name one idea across two units.
  - Breaks: english-learners.md → What hurts (phrasal verbs; several words for one idea); README idea 5.
  - No answer depends on judging "fits" (the prompt always tells the student), so this is Minor.
- **Rewrite:**
  - Explore, the "neither fits" line: "No whole number times 2 makes 3, so 2 doesn't fit in 3. And 3 can't fit in the smaller 2." Shorter version: "2 doesn't fit in 3: no whole number times 2 makes 3."
  - Unit 2 Explore, after "4 goes into 12 because 4 × 3 = 12.": add "*Goes into* means the same as *fits in* from Unit 1."

**E5-06 · Minor · Practice label "Bottoms share no factor"**
- **Where:** `units/WhyNotAcross.tsx:363`.
- **Checked against traps §1, including the top/bottom row:**
  - **Top/bottom: passes.** The Explore links the two words once ("The top number is the numerator. The bottom number is the denominator."). I found no use of top/bottom as a screen position anywhere in MG10.
  - **"Fits in" (the other label): passes.** "One bottom fits in the other" reads cleanly, and the Explore and key idea use the same words (apart from E5-05).
- **What's wrong with "Bottoms share no factor":**
  - Strictly, it isn't true. Every pair shares the factor 1. A 4th grader learning factor pairs (4.OA.4) is taught that 1 is always a factor.
  - It doesn't match the Explore, which describes the same pairs as "2 doesn't fit in 3, and 3 doesn't fit in 2".
  - "Share" is also the grade 2–3 fraction word for equal parts ("equal shares").
  - "Bottoms" as a plural noun is awkward to read aloud.
- **Rewrite:** "Neither bottom fits in the other". It matches the Explore sentence and the other label, and it is true for every pair in `U1_NOSHARE_PAIRS`.

**E5-07 · Minor · CFU Q4 says "Close." when the student added across**
- **Where:** `units/WhyNotAcross.tsx:130`.
- **Text:** The student types 4/6 (the add-across answer, the one mistake this unit targets) and gets: "Close. 2 fits in 4, so write 1/2 in fourths first: 1/2 = 2/4. Then add the fourths. 4 fourths make 1 whole." The fixer's `u1-cfu-q4-wrong.png` shows it.
- **Why:** "Close." praises the mistake the unit exists to stop. Breaks: builder rule (plain, accurate feedback); english-learners.md (plain praise only when it is earned).
- **Rewrite:** "Not yet. 2 fits in 4, so write 1/2 in fourths first: 1/2 = 2/4. Then add the fourths. 4 fourths make 1 whole." No box asks for 2/4, so nothing is given away.

**E5-10 · Minor · "Now add:" opens a Test question that has nothing before it**
- **Where:** `lib/unit1.tsx:142` (`sumStep`). Used by Unit 1 Test Q3 and Q4, and Module Test question 3.
- **Text:** "Now add: 2/6 + 2/3 = ? Write it in simplest form."
- **Why:** In a Test the question stands alone, so "Now" points back to a step that isn't there. Q3 follows Q2, which is a *different* pair, so a student may think Q3 continues Q2. Breaks: traps §6, item 6 (words that point back).
- **Rewrite:** "Add: 2/6 + 2/3 = ? Write it in simplest form." This works in Practice too, where the rename step comes just before.

**E5-14 · Polish · Two "But"s in a row in the step-2 explanation**
- **Where:** `lib/unit1.tsx:93, 110` (`judgeStep`, the "more or less than the smaller fraction" version).
- **Text:** "2/7 is more than 1/4, but less than 1/3. But 1/3 + 1/4 must be more than 1/3. So adding across gives an answer that is too small."
- **Rewrite:** "2/7 is more than 1/4, but less than 1/3. 1/3 + 1/4 must be more than 1/3, so adding across gives an answer that is too small." The other two versions can keep "But".

**E5-15 · Polish · The estimate explanation opens with a past participle ("Put end to end, …")**
- **Where:** `lib/unit1.tsx:61`.
- **Text:** "Put end to end, the two shaded parts fill less than 1 whole bar. So the sum is less than 1."
- **Why:** It looks like a command ("Put…") but works as a shortened passive ("When they are put…"). Breaks: grade-4.md → Grammar (keep passive rare).
- **Rewrite:** "Put the two shaded parts end to end. They fill less than 1 whole bar. So the sum is less than 1."

### Unit 1 Explore and key idea

**E5-11 · Minor · Above 48 pieces, the text describes a picture that isn't drawn**
- **Where:** `units/WhyNotAcross.tsx:224–243`.
- **Text:** For 7 and 9, for example, the picture is replaced by "That's too many pieces to draw." Then: "7 doesn't fit in 9, and 9 doesn't fit in 7. The picture still cuts both bars into the same-size pieces, so you can count them. … The thick lines show where the old pieces were."
- **Why:** Breaks: checklist → Text vs. picture.
- **Rewrite:** When L > 48, show one paragraph in place of the three: "7 doesn't fit in 9, and 9 doesn't fit in 7. Same-size pieces would need 63 pieces in each bar. That's too many to draw. In Unit 2, you will learn how to find these pieces." Hide the "thick lines" line.

**E5-16 · Polish · Key idea: "That's" points back, and "the other's pieces" is abstract**
- **Where:** `units/WhyNotAcross.tsx:348–353`.
- **Text:** "…1/2 + 1/3 is not 2/5. That's less than 1/2 alone!" · "When one bottom fits in the other, write one fraction in the other's pieces: …"
- **Rewrite:** "…1/2 + 1/3 is not 2/5. 2/5 is less than 1/2 alone!" · "When one bottom fits in the other, cut the bigger pieces to match the smaller ones: 3/4 + 1/2 = 3/4 + 2/4 = 5/4 = 1 1/4."

### Format line (shared; only MG10 turns it on)

**E5-08 · Minor · Two names for the same thing: "format" on screen, "kind of answer" in feedback and screen-reader names**
- **Where:**
  - `shared/components/CfuQuestion.tsx:128–132` (visible CFU feedback);
  - `shared/components/AnswerForm.tsx:40` (the radio group's `label`, default "Kind of answer");
  - `CfuQuestion.tsx:205` (`"…: kind of answer"`).
- **Text:**
  - "Pick a format to write your answer." then, after a wrong pick, "One kind of answer is not right. Look at the red button." The fixer's screenshot shows both on one screen.
  - Also: "2 kinds of answer are not right." and "Every kind you picked is right. Check the numbers."
  - A screen reader announces "Pick a format to write your answer. Kind of answer, radio group."
- **Why:** README idea 5; english-learners.md (one word for each idea).
- **Rewrite** (keeps the user's word):
  - "One format is not right. Look at the red button."
  - "2 formats are not right. Look at the red buttons."
  - "Every format you picked is right. Check the numbers."
  - Radio group label: "Format". In the CFU: `${b.label}: format`.
  - These lines only appear inside `<AnswerFormPick>`, which only MG10 uses. Re-read the file before editing, because the MG9 agent may also be working in `shared/`.

**E5-09 · Minor · With a wrong format, the add-across message runs to 5 sentences, and "The answer" seems to mean the student's answer**
- **Where:** `shared/engine/StepProblem.tsx:144–149` (`checkFormFraction`; the `named` + `kindMsg` path, new this round).
- **Text (real output):** "You added across. 4/9 is less than 2/3, but adding should make a bigger number. Make same-size pieces first. The answer is not a proper fraction. Is it more than 1, less than 1, or a whole number?"
- **Why:**
  - That is 5 sentences and 38 words of feedback.
  - Right after "4/9 is less than 2/3", "The answer is not a proper fraction" reads as if it means *4/9*, which **is** a proper fraction. "The answer" means the correct answer, but the sentence before was about the student's.
  - The closing question then offers "less than 1", the format the student just picked.
  - Breaks: traps §6, item 6 (words that point back); grade-5.md → Limits (a short paragraph, not five sentences).
- **Rewrite:** When there is a named mistake, end with one plain sentence and drop the question: "You added across. 4/9 is less than 2/3, but adding should make a bigger number. Make same-size pieces first. The correct answer is not a proper fraction." With no named mistake, "The correct answer is not a …" is also clearer than "The answer is not a …".

### Units 3–5 add-across messages and wording

**E5-13 · Minor · The Unit 3 subtract-across message names a number the student didn't type**
- **Where:** `lib/fractions.ts:274–278` (`shownText`), used at `:145` and in the `SizeCheckBars` row label (`AddSubtractUnlike.tsx:246`).
- **Text (real output):**
  - The student types 2/2 for 3/4 − 1/2 and reads: "You subtracted across. **1** is more than 3/4…"
  - The student types 8/5 and reads: "…**1 3/5** is more than 9/10…"
  - Another case reads: "**1 2/4** is more than 7/10."
- **Why:** The message is meant to show the student's own answer back to them. A different-looking number breaks that link. Breaks: checklist → Text vs. picture/answer. Unit 1 add-across answers are always less than 1, so Unit 1 isn't affected.
- **Rewrite:** Echo the boxes exactly as typed: "2/2 is more than 3/4, but subtracting should make a smaller number. First make same-size pieces." A code note for the fixer: `diagnose` only gets (num, den), so pass the typed text, or the picked format, to the diagnosis.

**E5-12 · Minor · Unit 5 CFU Q2 says "pick a format" four times**
- **Where:** `units/WordProblems.tsx:74`.
- **Text:** "Estimate 1/8 + 3/5 with benchmarks. For each answer, pick a format. Then write 0, 1/2, or 1." Then "Pick a format to write your answer." appears above each of the three button rows (fixer's `u5-cfu-q2.png`). The stacked 1/2 also pushes ", or 1." onto its own line.
- **Why:** The same instruction appears 4 times on one screen. Breaks: checklist step 5 (screen load).
- **Rewrite:** "Estimate 1/8 + 3/5. Use the benchmarks 0, 1/2, and 1." The format line above each set of buttons already says what to pick, and it is the user's wording.

**E5-17 · Polish · Unit 3 Explore step 4 says the format twice**
- **Where:** `units/AddSubtractUnlike.tsx:192–200`.
- **Text:** "6/6 = **1**. The answer is a whole number. Format: **whole number**."
- **Rewrite:** Keep "Format: …" (the user's phrase) and drop "The answer is a whole number." in that branch: "6/6 = **1**. Format: **whole number**."

**No finding, checked:**
- The Units 3 and 5 adding message ("You added across. 2/7 is less than 1/3, but adding should make a bigger number. First make same-size pieces, then add only the tops.") is fine.
- The Units 4 and 5 mixed-number message ("You added the fraction parts across. 3/7 is less than 1/2, …") is fine.
- Every sentence is 20 words or fewer, the numbers fill in correctly, and the fractions are stacked.

## 4. What's working well

- **Length is clean.** 0 of 133 strings in the changed files are over the grade-4 limit of 18 words. The median longest sentence is 8–10 words.
- **Step 2 grammar holds for every name.** "Raj added across: 1 + 1 = 2 on top, 3 + 4 = 7 on the bottom. That gives 2/7. Is his answer too small, right, or too big?" The pronouns match all 10 names, and singular and plural are right for every piece word (half/halves, "2 sixths").
- **Top/bottom is used one way only.** The Explore links the words to numerator and denominator once, and nothing uses them for a screen position.
- **One phrase for the mistake.** "Adding across" is named the same way everywhere: in the Explore, the CFU, Practice, every unit's diagnosis and the wrap-up ("= 7/12, not 2/7").
- **The format line is consistent.** It is word for word in every place, and the guide title and Unit 3 "Format:" line match it.
- **Sums past 1 read plainly:** "10/12 + 5/12 = 15/12 = 1 1/4. 12/12 is 1 whole."

## 5. Out of my lane (for the curriculum checker)

- Unit 1 CFU Q4 can't name the add-across mistake when the student types 4/6, because the `bad` callback only sees which boxes are right, not the values. E5-07 only fixes the wording.
- The exact-1 sums show a fraction that isn't in simplest form in the problem ("Find 2/6 + 2/3"), while the key idea says "Always write the answer in simplest form."
- Unit 1 Test Q7 and Module Test question 2: the right choice is always the longest one ("6/15 is less than 5/12, but the sum must be more than 5/12.").
- Unit 3: the `SizeCheckBars` default width (200) and the `RecutBars` width (240) make "1 whole" two different lengths on the same screen. Unit 1 uses 180 for both. This is a drawing width issue, not the pending "same whole" idea.
- The fixer's note 2: after a wrong typed sum in Unit 1, the "together" bar appears and shows the answer's size.

## 6. Guideline gaps (proposed text; I didn't edit the files)

- **checklist.md → §3 table, Giveaways row, add:** "Also check what stays on screen from a finished step. A choice's label (including a picture choice's hidden label) is shown again in the finished row, so it must not be a later step's answer. And a prompt that gives the conversion ('each half is 3 sixths') states the answer when the top number is 1."
- **english-learners.md → What hurts, add after the phrasal-verb bullet:** "If two units use different phrases for one idea (*fits in* in Unit 1, *goes into* in Unit 2), the second unit links them the first time: '*Goes into* means the same as *fits in*.'"
- **math-language-traps.md → §1, after the top/bottom paragraph, add:** "An on-screen label must be true as written. 'Share no factor' is false, because every pair shares 1. Say 'no factor but 1', or name what the student sees ('Neither bottom fits in the other')."

## 7. What I couldn't check

- **Real speech.** The lab has no read-aloud, so nothing is spoken. I checked only the screen-reader names, and only by reading the code: no VoiceOver or iPad run.
- **Live screens.** I didn't open the app. Screen checks come from the fixer's screenshots (CFU Q4, Unit 5 CFU Q2, both Unit 1 Practice types, the "neither fits" Explore). Generated text comes from the real code, bundled and run in Node.
- **Real students.**
