# MG10 Adding & Subtracting Fractions — round 1 merged fix list

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (grade 5, 5.NF.1–2)
- **Round:** 1 · **Date:** 2026-11-06
- **Sources:** `round-1-curriculum.md` (C1-01…C1-20: 0 Blocker, 7 Major, 9 Minor, 4 Polish) and `round-1-english.md` (E1-01…E1-25: 1 Blocker, 4 Major, 14 Minor, 6 Polish)
- **Decisions:** 39 Fix · 2 Skip · 2 Ask user (pending; the user is away and will decide when back)

## How the conflicts were settled

- **Unit 5 prompts (C1-13 vs E1-18):** C1-13 wins on *what*: the prompt must not print the expression. E1-18 wins on *how*: one question per answer box. Prompt: "What is the answer? Write it in simplest form. Then check that it is close to your estimate."
- **Unit 5 practice-type labels (C1-13 vs E1-23):** labels must not name the operation (C1-13), so "Left or more" becomes "Short stories" and "In total" is merged into it. The other types keep plain names.
- **Carry (C1-11 vs E1-05):** a single change. One word ("carry"), taught once in Explore with a picture, then used everywhere.
- **"Do you need to borrow?" for whole numbers (E1-15 + English out-of-lane note):** rewording alone still leaves a step whose answer is always "Borrow" (builder rule: no fixed-answer choice). It becomes a typed step instead.
- **Unit 4 slivers (C1-09):** the plan requires pairs like 12 & 16 (LCD 48), so the range isn't capped. Wide bars are drawn on their own rows instead.

## Fix list

| ID(s) | Sev | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| E1-01 | Blocker | `units/CommonDenominators.tsx:30-39`, `diagrams/MultiplesList.tsx` | Unit 2 CFU Q1 says "the numbers in both lists are __ and __", but the lists share 12, 24 and 36 | Fix | Keep the picture. Text: "The two smallest numbers in both lists are [ ] and [ ]. The LCD of 4 and 6 is [ ]." Labels: "Smallest number in both lists", "Next number in both lists". Answers 12, 24, 12. Check the picture matches. |
| C1-01 | Major | MG10 shell `:197`, `:417`; same pattern in MK1–MK4 and MG1 shells | Switching units (or reloading) clears the "Try one like it" lock | Fix | Lift the per-unit retry debt (`Record<unitId, bucket \| null>`) into the lab component, mirrored to `sessionStorage` under the module key. On `UnitView` mount with a debt, start in the owed bucket with the lock on. Apply to MG10 **and** the five K–1 shells (MK1–MK4, MG1) in the same change; browser-check one K–1 shell. |
| C1-02 | Major | `units/WhyNotAcross.tsx:243,253`; Test Q2–Q5, Q9 | Practice names the common pieces; the Test asks the student to choose them | Fix | New first Practice step: "Which pieces can you cut BOTH bars into?" Choices: `pieceWord(L)`, `pieceWord(d1+d2)`, `pieceWord(max(d1,d2))`, each with its number (E1-07 style: "twelfths (12 in 1 whole)"). Remove the piece name from the story and step-1 prompt until that step is done. No "LCD" wording in Unit 1. |
| C1-05 | Major | `units/CommonDenominators.tsx:217` | Practice always shows both multiples lists; the Test doesn't | Fix | Show the lists only when `pointing(help, 0)` or `done >= 1`, as Unit 3 does. |
| C1-13 | Major | `units/WordProblems.tsx:237,272,403`; type labels | The student never decides the operation; the prompt prints the expression | Fix | (1) New first choice step "Which matches the story?" with choices `A + B`, `A − B`, `B − A`. (2) Answer prompt per the conflict note above. (3) Estimate hint: "Find the benchmark for each amount. Then use them the way the story does." (4) Neutral type labels per the conflict note. Mirror the new step in Test Q5–Q9 only if it fits the 10-question set; otherwise leave the Test as is (it already gives no expression). |
| C1-14 | Major | `units/WordProblems.tsx:292-296`, `WordProblemsTest.tsx:80-84`, `lib/fractions.ts:454` | "Yes" is right 69% of the time | Fix | Pick the verdict first (1/3 each), then draw until `claimFor` fits. "Too small" claims come mostly from add-across. Check the balance in the brute-force script (each verdict 28–38%). |
| C1-15 | Major | `units/WordProblems.tsx:308,316,346-355` | When the claim is right, the final step can be copied from the screen | Fix | If `claim.verdict === "ok"`: step 3 becomes a typed rewrite ("Prove it: rewrite both fractions with the LCD, L"). If wrong: keep "Find the exact answer." |
| E1-02 | Major | MG10 shell `:110`, `:284`, `:293` | Practice option "Mixed" sits beside "Mixed numbers" | Fix | Rename the option to **"All types"** in the MG10 shell only, and update both star-rule sentences (see E1-19). |
| E1-03 | Major | `units/CommonDenominatorsTest.tsx:127`, `units/AddSubtractUnlike.tsx:45` | "Multiply each top by the same number as its bottom" reads as top × bottom | Fix | Use the English report's rewrites. |
| E1-04 | Major | `lib/fractions.ts:146` | "Top fraction from the bottom one" on one-line problems, where "top" means numerator | Fix | "It looks like you did {b}/{L} − {a}/{L}. You can't take {b}/{L} from {a}/{L}. Borrow 1 whole first." |
| E1-05 + C1-11 | Major | `units/MixedNumbers.tsx:161-170,168,299,303,322-329`; `MixedNumbersTest.tsx:29`; `WordProblems.tsx:404`; `WordProblemsTest.tsx:144`; `AddSubtractUnlikeTest.tsx:81`; `lib/fractions.ts:160`; `shared/engine/StepProblem.tsx` simplest-form text | "Carry" is never taught and is worded four ways; no carry picture | Fix | Teach **carry** once in Unit 4 Explore and the Key Idea, with a result bar showing pieces past one whole and a "Carry 1 whole" button mirroring "Borrow 1 whole". Show that bar in Practice when `pointing(help, answerIdx)` for `addCarry`. Replace every other wording with the English report's rewrites. The shared simplest-form message is used only by MG10's `fraction` step; confirm that, then use the English rewrite. |
| C1-04 | Minor | `units/WhyNotAcross.tsx:116` | Says add-across fails "when denominators are different" | Fix | "Adding across never works. When the denominators are the same, add only the tops. 1/2 = 2/4, so 1/4 + 2/4 = 3/4." |
| C1-07 | Minor | `units/AddSubtractUnlikeTest.tsx:58` | Test Q7's subtraction distractor is often 0/n or improper | Fix | As described in the curriculum report. |
| C1-08 | Minor | `lib/fractions.ts:287-288` | Addends are never improper (5.NF.1's own example is 2/3 + 5/4) | Fix | About 1 in 4 `addMixed` draws gets one improper addend in lowest terms. |
| C1-09 | Minor | Unit 4 bars; Unit 3 RecutBars at L = 48 | Bars become slivers at LCD ≥ 24 | Fix | Keep the generator range. When L > 24, draw each loose bar at full width on its own row, with an "L pieces" label. Screenshot L = 30 and L = 48. |
| C1-10 | Minor | `units/MixedNumbers.tsx:212-213` | No link to MG9's "unbundle a whole" | Fix | One sentence in Unit 4 Explore: "Borrowing is also called regrouping. In Fraction Operations you called it unbundling a whole." |
| C1-12 | Polish | `units/MixedNumbers.tsx:183` | Caption says "crossed out" before anything is crossed out | Fix | Before borrowing: "Start with …. You need to take away …." |
| C1-16 | Minor | `lib/fractions.ts:391-394` | 43% of subtraction stories estimate 0, and 0 is always the first button | Fix | As described in the curriculum report. |
| C1-17 | Minor | `units/WordProblems.tsx:165` | Explore never shows estimating a difference | Fix | Add/Subtract toggle in Estimate mode. |
| C1-18 | Polish | `units/WordProblems.tsx:204` | Exactly-halfway values in estimate mode | Fix | Use the same tie sentence as "Find the benchmark" mode. |
| C1-06 | Polish | `lib/fractions.ts:231`, `CommonDenominators.tsx:224-232` | Mixed-number compare is decided by the whole numbers half the time | Fix | Always equal wholes in the `mixedNumbers` bucket. |
| E1-06 | Minor | `units/WhyNotAcross.tsx:254` | "One piece of 3/4" is unclear and sometimes no help | Fix | Name the single piece, using the fraction with `L/d > 1`. |
| E1-07 | Minor | `units/WhyNotAcrossTest.tsx:155-163` | Piece-name-only choices | Fix | Add the number to each choice, plus the new hint. |
| E1-08 | Minor | `units/WhyNotAcross.tsx:153` | tops/bottoms vs numerator/denominator never linked | Fix | Use the English report's sentence. |
| E1-09 | Minor | `units/CommonDenominators.tsx:140,253` | "Go into" never explained | Fix | Use the English report's definition. |
| E1-10 | Minor | `units/CommonDenominators.tsx:68-79` | "It" points back a paragraph | Fix | Use the English report's rewrite. |
| E1-11 | Minor | `units/CommonDenominatorsTest.tsx:68` | Clumsy Test Q5 wording | Fix | Use the English report's rewrite. |
| E1-12 | Minor | `units/AddSubtractUnlike.tsx:268` | "Then simplify:" on an example that doesn't simplify | Fix | Use the English report's rewrite. |
| E1-13 | Minor | `units/AddSubtractUnlike.tsx:74,85` | Yes/no question, True/False answer | Fix | Make the lead a statement. |
| E1-14 | Minor | `units/AddSubtractUnlike.tsx:193` | "but" meaning "except" | Fix | Use the English report's rewrite. |
| E1-15 | Minor | `units/MixedNumbers.tsx:262` | "Do you need to borrow?" for a whole number gives away its own answer | Fix | Replace with a typed step: "Borrow 1 whole from 6. Write 6 with {third/…} pieces: 5 and ?/?" (answer 5 3/3 or the matching pieces). |
| E1-16 | Minor | `units/MixedNumbers.tsx:188` | Dash fragment | Fix | Use the English report's rewrite. |
| E1-17 | Minor | `units/WordProblems.tsx:308` | "Worked out … work it out" | Fix | "Ana says 1/8 + 1/3 = 2/11. Check her answer with benchmarks before you find the exact sum." |
| E1-19 | Minor | MG10 shell `:110`, `:293` | Stars rule is 26 words; "reps" | Fix | Use the English report's rewrite, with "All types". |
| E1-20 | Polish | `units/AddSubtractUnlike.tsx:188,240` | "The pieces make whole numbers." | Fix | "The answer is a whole number." |
| E1-21 | Polish | Unit 4, three spots | Passive voice, unclear "it", "finds" | Fix | Use the English report's rewrites. |
| E1-22 | Polish | `lib/stories.ts` | Twelfths and tenths of a cup | Fix | Cup and recipe templates use denominators {2, 3, 4, 8} only. |
| E1-23 | Polish | Unit 1 and Unit 5 type labels | Labels a student must decode | Fix | Unit 1: "One bottom fits in the other", "No shared factor". Keep "Unit + non-unit" only if "unit fraction" is taught in Unit 1's Explore; otherwise "1 on top + more on top". Unit 5: see the conflict note. |
| E1-24 | Polish | `Frac` aria-label; `BenchmarkLine` aria-label | Screen-reader wording | Fix (partly) | BenchmarkLine: list the plotted points in its `aria-label`. `Frac` → "3 over 4" **only if `Frac` is MG10-local**; if it's shared, Skip (it would change other labs; note it in the report). |
| E1-25 | Polish | MG10 shell `:390` | "Click again" on iPad | Fix | "Tap again to clear all stars." |
| C1-19 | Polish | — | "Same whole" clause of 5.NF.2 isn't addressed | Skip | It would add a CFU or Test item and change the fixed 10-question Test. Revisit with C1-20 when the user decides on Unit 1/Unit 5 changes. |
| — | — | Builder note: 30 other shells let practice history skip the CFU | Out of scope for this lab | Skip | Reported to the user for a separate decision. |

## Ask user (pending — do NOT apply until the user decides)

| ID(s) | Sev | Question | Recommendation |
|---|---|---|---|
| C1-20 (+ C1-03) | Major | Unit order / benchmark checks. Options: **A** add a "Does your answer make sense?" choice step to Units 3–4 Practice; **B** A plus benchmarks in Unit 1 (a 0–1 line in the add-across Explore view, Practice step 3 replaced with "Is mn/md about right, too small, or too big?", and "benchmark" in CFU Q1 feedback); **C** a new short benchmark unit between Units 1 and 2; **D** move Unit 5 earlier (not recommended). C1-03 (Unit 1 Practice step 3 repeats step 2) is solved by B. | **B.** It uses the standard's own 5.NF.2 example (2/5 + 1/2 = 3/7 is too small because 3/7 < 1/2) and makes checking answers a habit across units. Unit 5 stays last because its stories need Units 3–4. |

## Proposed rule and guideline changes (for wrap-up, not fixes)

From the curriculum report (§7), for `math-lab-builder.md`:
1. Practice must ask for everything the Test asks for, without the help the Test leaves out.
2. Word-problem units: a step makes the student choose or write the operation; prompts, titles and labels don't give it away first.
3. For choice steps whose answer depends on generator rejection, pick the target answer first; check the balance in the brute-force script.
4. A claim shown in a story must not equal a later typed answer.
5. The retry-lock debt must survive leaving and re-entering the unit.

From the English report (§6), for the reference files:
6. `grade-5.md`: add common denominator / LCD, benchmark fraction, borrow/regroup and carry to "New in 5th".
7. `math-language-traps.md` §1: add "mixed" (UI label vs. mixed number), with a note to check UI labels against the lab's math words.
8. Traps / English learners: link top/bottom to numerator/denominator once; then never use top/bottom for screen position.
9. `checklist.md` §3: add "Text vs. picture" (every sentence describing a picture matches what it shows).
