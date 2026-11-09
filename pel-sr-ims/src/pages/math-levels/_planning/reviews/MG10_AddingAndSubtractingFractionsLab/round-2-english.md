# MG10 Adding & Subtracting Fractions: English review, round 2 (re-review)

- **Lab:** `MG10_AddingAndSubtractingFractionsLab` (shell + `AddingAndSubtractingFractionsLab/`)
- **Round:** 2 (re-review of `round-1-merged.md` / `round-1-fixes.md`)
- **Date:** 2026-11-06
- **Grade assessed:** 5th (5.NF.1–2), using `grade-5.md`. Text a student reads alone was also held to `grade-4.md` (18 words a sentence), because this lab has **no read-aloud**.
- **Assumptions:** C1-20 and C1-03 (Unit 1 Practice step 4, "Who is right?") are waiting on the user, so they are not re-reported. E1-24's `Frac` part was Skipped by the merge (shared component), so I count E1-24 as done as agreed.
- **K–1 shells:** I read the C1-01 retry-lock diff in MK1–MK4 and MG1. Only code and comments changed. **No student-facing text changed**, so nothing needed checking against `grade-K.md`.

---

## 0. Status of last round's English fixes

| ID | Sev (R1) | Status | Note |
|---|---|---|---|
| E1-01 | Blocker | **Fixed** | "The two smallest numbers in both lists are [ ] and [ ]." Now matches the picture (12, 24, 36 shared). |
| E1-02 | Major | **Fixed** | Option is "All types"; both star sentences use it. |
| E1-03 | Major | **Fixed, but caused a new problem** | The Test hint is good. The Unit 3 CFU Q1 wrong-answer message (my round-1 wording) now gives away box 1 and makes boxes 2–3 one step away. See E2-27. |
| E1-04 | Major | **Fixed** | "It looks like you did 9/12 − 4/12. You can't take 9/12 from 4/12. Borrow 1 whole first." |
| E1-05 | Major | **Fixed** | "Carry" is taught in Unit 4 Explore with a button and a Key Idea line. Every other wording now says "carry 1 whole". The shared simplest-form text is good. Small wording drift noted in E2-32. |
| E1-06 | Minor | **Fixed** | "How many twelfths fit in one fourth?" It names the fraction that gets cut. |
| E1-07 | Minor | **Fixed, but caused a new problem** | Choices now show numbers. But my hint "Find a number that both 4 and 5 go into" uses "go into" in Unit 1. Unit 2 is where that phrase is taught. The new Practice step 1 (C1-02) copies it. See E2-26. |
| E1-08 | Minor | **Fixed** | Numerator and denominator are linked in Unit 1's Explore intro. |
| E1-09 | Minor | **Fixed** | "…with nothing left over. 4 goes into 12 because 4 × 3 = 12." |
| E1-10 | Minor | **Fixed** | Both T/F lines say "multiplying the denominators…". |
| E1-11 | Minor | **Fixed** | "Multiply the two denominators in each pair. For which pair is the LCD smaller than that?" |
| E1-12 | Minor | **Fixed** | "Example: … Then check for simplest form." |
| E1-13 | Minor | **Fixed** | The lead is a statement now. |
| E1-14 | Minor | **Fixed** | "The only number that divides both 11 and 12 is 1." |
| E1-15 | Minor | **Fixed, but caused a new problem** | The answer no longer gives itself away. But "Write 6 with thirds" can also mean 18/3. See E2-30 (Polish). |
| E1-16 | Minor | **Fixed** | "There are only 3/12. That is not enough to take away 8/12." |
| E1-17 | Minor | **Fixed** | "Ana says 1/8 + 1/3 = 2/11. Check her answer with benchmarks first." The fixer's change of wording is right (C1-15). |
| E1-18 | Minor | **Fixed** | Through C1-13: "What is the answer? Write it in simplest form. Then check that it is close to your estimate." |
| E1-19 | Minor | **Fixed** | Four short sentences; "reps" is gone. |
| E1-20 | Polish | **Fixed** | "The answer is a whole number." |
| E1-21 | Polish | **Fixed** | "How do you write 5 1/4 now?" is better than my version. |
| E1-22 | Polish | **Fixed** | Cup and recipe stories use only denominators 2, 3, 4 and 8. |
| E1-23 | Polish | **Fixed** | "1 on top + more on top", "One bottom fits in the other", "No shared factor", and the Unit 5 labels per C1-13. |
| E1-24 | Polish | **Fixed (as agreed)** | The BenchmarkLine label lists the points. `Frac` was Skipped (it's shared). |
| E1-25 | Polish | **Fixed** | "Tap again to clear all stars." |

**Totals: 22 Fixed · 0 Not fixed · 3 Fixed, but caused a new problem.**

## 1. Verdict

**Ready on English. No Blocker or Major is left.** All 25 round-1 items are fixed. The new teaching for carry, picking the operation and picking the pieces reads cleanly at grade level. Four Minor issues are left: "go into" now shows up in Unit 1, before Unit 2 teaches it; one CFU wrong-answer message gives away the answer; the new "Which matches the story?" hint is a long, nested question; and one explanation says "kept the bottom 10" next to a claim shown as 14/5.

## 2. Scorecard

Length = share of strings over the grade-4 limit (18 words), from `english-check.cjs --grade 4` (293 strings; the only flag is a script artifact that joins separate sentences).

| Part | Length | Grammar | Vocabulary | Word problems | Voice (screen reader) | Screen load |
|---|---|---|---|---|---|---|
| Shell / Home | Strong (0%) | Strong | Strong ("All types") | n/a | OK | Strong |
| Unit 1 Why Not Across | Strong (0%) | Strong | OK ("go into" before it's taught, E2-26) | n/a | OK | OK (4 steps; C1-03 pending) |
| Unit 2 Common Denominators | Strong (0%) | Strong | Strong | n/a | OK | Strong |
| Unit 3 Add/Subtract | Strong (0%) | Strong | Strong | n/a | OK | Strong (E2-27 is a giveaway, not load) |
| Unit 4 Mixed Numbers | Strong (0%) | Strong | OK (E2-32 "fraction parts" / "fractions") | n/a | OK | Strong |
| Unit 5 Word Problems | Strong (0%) | OK (E2-28 hint) | Strong | Strong | OK | OK |
| Module Test | Strong (0%) | Strong | Inherits E2-26 (via Unit 1 Test Q9) and E2-29 | Strong | OK | Strong |

---

## 3. All findings (new this round)

### Unit 1: Why You Can't Just Add Across

**E2-26 · Minor · "Go into" is used in Unit 1, but Unit 2 is where it's taught**
- **Where:** `units/WhyNotAcross.tsx:265-266` (new Practice step 1 hint and explain); `units/WhyNotAcrossTest.tsx:156-157` (Test Q9 hint and explain, also in the Module Test).
- **Text:** "Find a number that both 4 and 6 go into." / "Both 4 and 6 go into 12, so you can cut both bars into twelfths."
- **Problem:** Unit 2's Explore defines "go into" ("with nothing left over. 4 goes into 12 because 4 × 3 = 12"). In Unit 1 the student meets this phrasal verb without that definition. "Multiple" is a word students know from 4th grade (4.OA.4), and it says the same thing.
- **Breaks:** english-learners.md → phrasal verbs; grade-5.md → Math words (teach a word before using it). The cause is my own E1-07 rewrite.
- **Rewrite:**
  - Hint: "Find a number that is a multiple of both 4 and 6."
  - Explain: "12 is a multiple of both 4 and 6, so you can cut both bars into twelfths."
  - Make the same change in Test Q9.

### Unit 3: Adding and Subtracting Fractions

**E2-27 · Minor · The CFU Q1 wrong-answer message gives away the answer**
- **Where:** `units/AddSubtractUnlike.tsx:45` (CFU Q1 `bad`).
- **Text:** "Not quite. The LCD of 3 and 4 is 12. 3 × 4 = 12, so multiply the top of 2/3 by 4. 4 × 3 = 12, so multiply the top of 1/4 by 3. Then add the new tops."
- **Problem:** Box 1 asks for the LCD, and this message says it ("12"). Boxes 2–3 then become one multiplication each. The builder rule is that a wrong-answer message must not state the answer. This is my round-1 wording; the fixer flagged it (fixes §6 item 6).
- **Breaks:** builder rules → wrong-answer messages; checklist §3 (Giveaways).
- **Rewrite:** "Not quite. Find the smallest number both 3 and 4 go into. What do you multiply 3 by to get it? Multiply the top of 2/3 by the same number. Do the same for 1/4. Then add the new tops."

### Unit 5: Word Problems

**E2-28 · Minor · The "Which matches the story?" hint is a long, nested question that leaves out one story type**
- **Where:** `units/WordProblems.tsx:287` (`operationStep` hint, in Short stories and Mixed-number stories).
- **Text:** "Picture the story. Are two amounts put together? Or is one amount taken away from, or compared with, the other?"
- **Problem:** The second question is passive. It splits a phrasal verb around a comma aside ("taken away from, or compared with, the other"). A weak reader has to hold "one amount … the other" across 9 words. It also doesn't cover the "how much more is needed" stories, which are one of the four kinds.
- **Breaks:** grade-4.md → Grammar (keep passive rare; say each fact in its own sentence); traps §6 (passive voice, pronoun pointing back).
- **Rewrite:** "Picture what happens in the story. Do two amounts go together? Or do you need the difference between two amounts?" This doesn't teach a keyword. It names the two situations: join, or find the gap.

**E2-29 · Minor · "Kept the bottom 10" beside a claim shown as 14/5**
- **Where:** `units/WordProblems.tsx:417` (the "Does it make sense?" explain for a "too big" claim); the cause is `lib/fractions.ts:487-489` (`claimFor` reduces every claim). This also affects Test Q4 and Module Q22.
- **Text:** "14/5 is much more than 1 1/2. Ana changed the tops but kept the bottom 10."
- **Problem:** The claim on screen has a 5 on the bottom, not 10, so the sentence doesn't match what the student sees. The same thing happens with "added across" claims that reduce (1/2 + 1/4 → 2/6 is shown as 1/3). C1-14 made "too big" claims 1 in 3, so this happens more often now.
- **Breaks:** checklist §3 → text vs. picture (proposed in round 1 §6).
- **Fix:** Don't reduce wrong claims in `claimFor`: show 28/10 and 2/6, which is exactly what the mistake makes. If they must stay reduced, change the explain to: "Ana changed the tops, but she did not find a common denominator."

**E2-31 · Polish · The estimate hint is vague now that step 1 picks the operation**
- **Where:** `units/WordProblems.tsx:306`.
- **Text:** "Find the benchmark for each amount. Then use them the way the story does."
- **Rewrite:** "Find the benchmark for each amount. Then add or subtract them, like the expression you picked." This doesn't give away the operation, because the student has already chosen it in step 1.

**E2-33 · Polish · An appositive in the wrap-up**
- **Where:** `units/WordProblems.tsx:443`.
- **Text:** "The exact answer is 11/24, close to the estimate 1/2. Ana's answer, 2/11, was wrong."
- **Rewrite:** "The exact answer is 11/24. It is close to the estimate, 1/2. Ana said 2/11, so she was wrong."

### Unit 4: Mixed Numbers

**E2-30 · Polish · "Write 6 with thirds" also fits 18/3**
- **Where:** `units/MixedNumbers.tsx:317` (`subFromWhole` typed borrow step).
- **Text:** "You need to take away 1/3. Borrow 1 whole from 6. Write 6 with thirds." The boxes are 6 = [ ] [ ]/3.
- **Rewrite:** "You need to take away 1/3. Borrow 1 whole from 6. Write 6 as wholes and thirds." The two boxes already help, so this is Polish.

**E2-32 · Polish · Two names for the carry condition: "fraction parts" and "fractions"**
- **Where:** Explore `MixedNumbers.tsx:251` ("When the fraction parts make 1 whole or more"). Elsewhere it says "fractions": Key Idea ("Do the fractions make 1 whole or more?"), `WordProblems.tsx:489`, `WordProblemsTest.tsx:138`, and `lib/fractions.ts:170` ("The fractions make 1 whole or more").
- **Problem:** In a mixed-number problem, "the fractions" can mean the whole mixed numbers. "Fraction parts" is clearer, and the Unit 5 mixed estimate prompt already uses it.
- **Rewrite:** Use "fraction parts" in all five places: "Carry 1 whole if the fraction parts make 1 whole or more."

---

## 4. What's working well

- **Every sentence is within the length limit** (0% over the grade-4 limit in tasks, feedback and screens). The median longest sentence is 8–9 words.
- **Carry is now taught the way borrow is:** a named word, a picture where the pieces spill past one bar, a button, and one wording ("carry 1 whole") in every hint and message.
- **The new piece choice step** ("twelfths (12 in 1 whole)") can be read without decoding the ordinal.
- **The named-mistake messages** say what the student did ("It looks like you did 9/12 − 4/12"). They don't use "top" to mean a screen position anymore.
- **"Which matches the story?"** lets the student pick the operation without a keyword. Its explanations name the situation ("The story puts the two amounts together").
- **The shell's star rule** is four short sentences, with no clash between "Mixed" and "Mixed numbers".

## 5. Out of my lane (for the curriculum checker)

- Unit 4 `subFromWhole` borrow hint: "The whole you took is 3/3." It states the second box's answer in the first hint.
- Unit 4: after one wrong try, the borrowed picture shows the typed answer (fixes §6 item 4).
- Estimate choices: the right answer is 3rd only 14% of the time (C1-16 residue).

## 6. Guideline gaps (proposed; I did not edit these files)

- **`checklist.md` §3, Giveaways row**, add: "A rewrite from a reviewer gets the same giveaway check: a wrong-answer message must not state any box's answer (e.g. 'The LCD is 12' when a box asks for the LCD)."
- **`english-learners.md` → phrasal verbs**, add: "When a lab defines a phrasal verb in one unit (e.g. *go into*), earlier units use the known word instead (*multiple*)."

## 7. What I could not check

- Real students, real iPad rendering, and real screen-reader output (I read `aria-label` values in the code).
- Voice: this lab has no read-aloud.
- Generators: I didn't re-run the brute force this round. I read the new templates against `lib/fractions.ts` and relied on the fixer's 12,000-draw run for value ranges, cup-only denominators and grammar samples. E2-29 comes from reading `claimFor`; I didn't measure how often a claim is reduced.
