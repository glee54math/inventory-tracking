# MG10 Adding & Subtracting Fractions: round 1 fixes

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (grade 5, 5.NF.1–2)
- **Round:** 1 · **Date:** 2026-11-06 · **Work order:** `round-1-merged.md`
- **Not touched (as instructed):** C1-20 / C1-03 (Ask user, pending), C1-19 and the 30-shells CFU note (Skip).

## 1. Summary

**39 Fix items: 37 Fixed, 2 Partly fixed, 0 Needs decision, 0 Not fixed.**
- **Partly fixed: E1-24.** The BenchmarkLine label is done. The `Frac` "3 over 4" label is skipped because `Frac` is shared (`shared/engine/controls.tsx`), which the merged list said to skip.
- **Partly fixed: C1-16.** Estimates of 0 are now rare, and the right answer's place among the choices is more even. Some skew is left because the choices stay in number order (see §6).

All static checks pass. Generator brute force passed with 0 failures. The browser walk passed on MG10 and MK1.

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| E1-01 | Fixed | CFU Q1 now says "The two smallest numbers in both lists are [ ] and [ ]". Labels: "Smallest / Next number in both lists". The picture is unchanged; it shows 12, 24 and 36 shared, which matches. | `units/CommonDenominators.tsx` CFU Q1 |
| C1-01 | Fixed (changed approach) | The retry debt now lives in the lab component, per unit, mirrored to `sessionStorage` (`retryDebt:{MODULE_ID}:{studentId}`). `UnitView` gets `debt` and `onDebt`. It starts in the owed kind with the lock on and the type switch disabled. A clean solve clears the debt; Reset progress clears all debts. Applied to MG10, MK1, MK2, MK3, MK4 and MG1. The debt stores `{type, bucket, mix}` rather than only the bucket, so it also works for types without buckets and puts the student back in the mode they were in. | new `shared/engine/retryDebt.ts`; each shell's `UnitView` and lab component |
| C1-02 | Fixed | New Practice step 1: "Which pieces can you cut BOTH bars into?" Choices use `piecesChoice` ("twelfths (12 in 1 whole)"): the LCD, the sum of the denominators, and the bigger denominator. When the bigger denominator IS the LCD (the "one fits" bucket), the smaller one is used instead, so the choices never collide. The story no longer names the pieces. Picture indices shifted by one (re-cut only after step 1). No "LCD" wording. | `units/WhyNotAcross.tsx` `makeProblem`; `lib/fractions.ts` `piecesChoice` |
| C1-05 | Fixed | The multiples lists show only when `pointing(help, 0)` or `done >= 1`. | `units/CommonDenominators.tsx` visual |
| C1-13 | Fixed | (1) New step 1, "Which matches the story?", with `A + B` / `A − B` / `B − A` (`operationStep`), in Short and Mixed-number stories. (2) The answer prompt is now "What is the answer? Write it in simplest form. Then check that it is close to your estimate." (3) Estimate hint: "Find the benchmark for each amount. Then use them the way the story does." (4) Types: "Short stories" (total + leftOrMore buckets), "Does it make sense?", "Mixed-number stories". Short-story titles are now just "Word problem". The Test is left as is (its questions are one step and already show no expression). | `units/WordProblems.tsx` |
| C1-14 | Fixed | New `claimDraw()` picks the verdict first, 1 in 3 each. "Too small" always comes from add-across, "too big" from keeping one denominator. Used by Practice and Test Q4 (and so Module Q22). Brute force: 33.4 / 33.1 / 33.6 %. | `lib/fractions.ts`; `WordProblems.tsx`; `WordProblemsTest.tsx` |
| C1-15 | Fixed | When the claim is right, step 3 is the typed rewrite "Prove it: rewrite both fractions with the LCD, L." When it is wrong, step 3 still asks for the exact answer. The wrap-up differs for each case. | `units/WordProblems.tsx` `reasonableProblem` |
| E1-02 | Fixed | The practice option "Mixed" is renamed "All types" (MG10 shell only). | MG10 shell |
| E1-03 | Fixed | English report's rewrites applied: Test Q7/Q8 hint, and Unit 3 CFU Q1's wrong-answer message. | `CommonDenominatorsTest.tsx` `rewriteBothQuestion`; `AddSubtractUnlike.tsx` CFU Q1 |
| E1-04 | Fixed | "It looks like you did {b}/{L} − {a}/{L}. You can't take {b}/{L} from {a}/{L}. Borrow 1 whole first." | `lib/fractions.ts` `mixedSubDiagnose` |
| E1-05 + C1-11 | Fixed | Carry is taught in Unit 4 Explore (paragraph plus Key Idea). The Add view has a result bar whose pieces spill past one full bar, and a **Carry 1 whole** button that turns the full bar into a solid "1". Practice `addCarry` shows that result bar on `pointing(help, answerIdx)`. Every other wording is changed to "carry 1 whole (to the whole number)". The shared simplest-form message is only used by MG10 (confirmed by grep: only MG10 builds `fraction` steps). | `MixedNumbers.tsx`, `MixedNumbersTest.tsx`, `WordProblems.tsx`, `WordProblemsTest.tsx`, `AddSubtractUnlikeTest.tsx`, `lib/fractions.ts`, `shared/engine/StepProblem.tsx` |
| C1-04 | Fixed | CFU Q4 praise rewritten as agreed. | `WhyNotAcross.tsx` |
| C1-07 | Fixed | Test Q7's subtraction trap: subtract-across only when proper with a non-zero top. Otherwise "the old tops over the LCD". Otherwise "added instead". Each fallback is skipped if its value equals the answer. Brute force: never 0 on top, never improper. | `AddSubtractUnlikeTest.tsx` `simplestChoiceQuestion` |
| C1-08 | Fixed | About 1 in 4 `addMixed` draws (brute force: 25–26%) has one improper addend in lowest terms, under 2 (e.g. 11/8 + 3/4). Explore and the Key Idea are unchanged. | `lib/fractions.ts` `u3Params` |
| C1-09 | Fixed (switch point changed) | Unit 3 (RecutBars): when L > 24, every bar is drawn wider (about 12 px a piece, up to 600 px), all the same width, with the caption "Each bar now has L pieces." Unit 4: new lab-local `MixedBars` wrapper. The wholes stay compact; the loose bar(s) are drawn wide on their own rows, with "We drew this whole bigger. It has L pieces." It switches on **piece width under 8 px**, not only L > 24, because L = 14–24 at Unit 4's 110 px bars were also 4–7 px slivers. Used in Unit 4 Explore and Practice, and in Test Q6. Screenshots at L = 24, 30 and 48. | `diagrams/RecutBars.tsx`, new `diagrams/MixedBars.tsx`, `MixedNumbers.tsx`, `MixedNumbersTest.tsx` |
| C1-10 | Fixed | Added "Borrowing is also called regrouping. In Fraction Operations you called it unbundling a whole." | `MixedNumbers.tsx` Explore |
| C1-12 | Fixed | Caption before borrowing: "Start with X. You need to take away Y." The "(crossed out)" caption now appears only once something is crossed out. | `MixedNumbers.tsx` Explore |
| C1-16 | Partly fixed | Difference estimates of 0 are rejected 3 times in 4 (from 43% to 16% of subtraction stories). `estimateChoices` now picks the right answer's place evenly from the places it can take. The right answer is now 1st / 2nd / 3rd in 47 / 40 / 14 % of draws (was always 1st for an estimate of 0). The rest of the skew comes from keeping choices in number order with nothing below 0. | `lib/fractions.ts` `u5Pair`, `estimateChoices` |
| C1-17 | Fixed | Explore's "Estimate" mode has an Add + / Subtract − toggle. Subtraction needs the bigger fraction first (otherwise the same message as Unit 3), and the button reads "Show the exact difference". | `WordProblems.tsx` Explore |
| C1-18 | Fixed | In estimate mode, a fraction at exactly 1/4 or 3/4 gets "x is exactly halfway between two benchmarks. Try another fraction.", and no estimate is drawn. | `WordProblems.tsx` Explore |
| C1-06 | Fixed | The `mixedNumbers` bucket always has equal wholes. Hint and explain now say "The whole numbers are the same." | `lib/fractions.ts` `u2Params`; `CommonDenominators.tsx` |
| E1-06 | Fixed | Hint: "How many {L-pieces} fit in one {fourth}?" It names the fraction whose pieces get cut (L/d > 1). New `pieceOne` gives the singular piece name. | `WhyNotAcross.tsx`; `lib/fractions.ts` |
| E1-07 | Fixed | Test Q9 choices have numbers; hint is "Find a number that both d1 and d2 go into." | `WhyNotAcrossTest.tsx` |
| E1-08 | Fixed | The numerator/denominator sentence is added to Unit 1's Explore intro. | `WhyNotAcross.tsx` |
| E1-09 | Fixed | Explore definition now includes "with nothing left over. 4 goes into 12 because 4 × 3 = 12." | `CommonDenominators.tsx` |
| E1-10 | Fixed | Both T/F lines say "multiplying the denominators always gives …". | `CommonDenominators.tsx` CFU Q3 |
| E1-11 | Fixed | Test Q5 prompt rewritten. | `CommonDenominatorsTest.tsx` |
| E1-12 | Fixed | Key Idea: "Example: … Then check for simplest form. …" | `AddSubtractUnlike.tsx` |
| E1-13 | Fixed | CFU Q3 lead is a statement. | `AddSubtractUnlike.tsx` |
| E1-14 | Fixed | "The only number that divides both r and L is 1. So r/L is already in simplest form." | `AddSubtractUnlike.tsx` Explore |
| E1-15 | Fixed | `subFromWhole` no longer has the "need to borrow?" choice. It goes straight to the typed borrow step: "You need to take away 1/3. Borrow 1 whole from 6. Write 6 with thirds." with boxes 6 = [5] [3]/3. That step already existed after the choice; it now stands alone with its own hint. | `MixedNumbers.tsx` |
| E1-16 | Fixed | "There are only 3/12. That is not enough to take away 8/12." | `MixedNumbers.tsx` Explore |
| E1-17 | Fixed (wording adjusted) | "Ana says 1/8 + 1/3 = 2/11. Check her answer with benchmarks first." I dropped "…before you find the exact sum": when Ana is right, step 3 is now a rewrite (C1-15), so the story must not promise an exact sum or hint at the verdict. | `WordProblems.tsx` |
| E1-19 | Fixed | The stars rule is now four short sentences ending "Only **All types** problems count."; the "reps" line is also rewritten. | MG10 shell |
| E1-20 | Fixed | "The answer is a whole number." (2 places) | `AddSubtractUnlike.tsx` |
| E1-21 | Fixed (one wording adjusted) | Caption "We borrowed 1 whole and cut it into pieces."; Q8 "Ana works on …". For Q10 I used "How do you write 5 1/4 now?" instead of "What is 5 1/4 written now?", which reads awkwardly. | `MixedNumbers.tsx`; `MixedNumbersTest.tsx` |
| E1-22 | Fixed | The three cup/recipe templates are used only when both denominators are in {2, 3, 4, 8}. Every story kind still has non-cup templates. | `lib/stories.ts` |
| E1-23 | Fixed | Unit 1 labels: "1 on top + more on top" ("unit fraction" isn't taught), "One bottom fits in the other", "No shared factor". Unit 5 labels are under C1-13. | `WhyNotAcross.tsx`, `WordProblems.tsx` |
| E1-24 | Partly fixed | BenchmarkLine `aria-label` now says where each point is ("3/8 is between 0 and 1/2. The estimate is at 1 1/2."). It never names the closest benchmark. The `Frac` label is skipped because `Frac` is shared. | `diagrams/BenchmarkLine.tsx` |
| E1-25 | Fixed | "Tap again to clear all stars." (MG10 shell only.) | MG10 shell |

## 3. Changed files

**Shared (other labs affected):**
- `shared/engine/retryDebt.ts`: **new**. Used by MK1, MK2, MK3, MK4, MG1 and MG10.
- `shared/engine/StepProblem.tsx`: simplest-form "why" text only. Only MG10 uses `fraction` steps.
- `MK1/MK1_CountingAndCardinalityLab.tsx`, `MK2/MK2_AdditionSubtractionAndTeenNumbersLab.tsx`, `MK3/MK3_MeasurementAndClassifyingLab.tsx`, `MK4/MK4_ShapesLab.tsx`, `MG1/MG1_AdditionAndSubtractionWithin20Lab.tsx`: the C1-01 retry debt only. The change is identical in all five, applied by one script.
- `MATH_TSX_STYLE_GUIDE.txt`: one convention note (the retry debt lives in the lab, not in `UnitView`).

**MG10:**
- `MG10/MG10_AddingAndSubtractingFractionsLab.tsx`
- `AddingAndSubtractingFractionsLab/lib/fractions.ts`, `lib/stories.ts`
- `AddingAndSubtractingFractionsLab/diagrams/BenchmarkLine.tsx`, `RecutBars.tsx`, `MixedBars.tsx` (**new**), `index.ts`
- `AddingAndSubtractingFractionsLab/units/WhyNotAcross.tsx`, `WhyNotAcrossTest.tsx`, `CommonDenominators.tsx`, `CommonDenominatorsTest.tsx`, `AddSubtractUnlike.tsx`, `AddSubtractUnlikeTest.tsx`, `MixedNumbers.tsx`, `MixedNumbersTest.tsx`, `WordProblems.tsx`, `WordProblemsTest.tsx`
- `ModuleTest.tsx` itself is unchanged. It inherits the changes through the reused generators (Q4 "Mixed numbers" → Q22 verdict balance, Q13 trap, Q17/Q24 diagnose text, Q19 wide bars).

## 4. New or rewritten student text

**Shell (MG10):** "To fill in your stars, solve each kind of problem twice on your own. Use no wrong guesses and at most one hint. Write answers in simplest form. Only **All types** problems count." · Option "All types" · "Practicing one type is good extra practice, but only **All types** problems count toward your stars." · "Tap again to clear all stars."

**Shared StepProblem (MG10 only):** "That's equal, but it's not in simplest form. Simplify it. The top is as big as the bottom or bigger. Write it as a whole number or a mixed number."

**Diagrams:** RecutBars: "Each bar now has {L} pieces." · MixedBars: "We drew this whole bigger. It has {L} pieces." / "We drew these wholes bigger. Each one has {L} pieces." · BenchmarkLine aria: "Number line from 0 to 2 with benchmarks at every half. 3/8 is between 0 and 1/2. The estimate is at 1 1/2."

**Unit 1:** Explore: "The top number is the **numerator**. The bottom number is the **denominator**. Every bar is 1 whole, and every bar is the same size. Pick two fractions and try both ways to add them." · CFU Q4 praise: "Yes. Adding across never works. When the denominators are the same, add only the tops. 1/2 = 2/4, so 1/4 + 2/4 = 3/4." · Practice story: "Find a/b + c/d. The pieces are different sizes." · Step 1: "Which pieces can you cut BOTH bars into?"; choices "{pieces} ({n} in 1 whole)"; hint "Find a number that both d1 and d2 go into."; explain "Both d1 and d2 go into L, so you can cut both bars into {pieces}." · Step 2 hint: "How many {L-pieces} fit in one {piece}? Look at the thick lines in the picture." · Labels: "1 on top + more on top", "One bottom fits in the other", "No shared factor". · Test Q9: same choice format and hint.

**Unit 2:** Explore: "A **common denominator** is a number both denominators go into, with nothing left over. 4 goes into 12 because 4 × 3 = 12. **LCD** means **least common denominator**. It is the smallest one." · CFU Q1: "The two smallest numbers in both lists are [ ] and [ ]. The LCD of 4 and 6 is [ ]." (labels "Smallest number in both lists" / "Next number in both lists") · CFU Q3: "True or false: multiplying the denominators always gives a common denominator." / "… always gives the LCD." · Practice (mixed): hint "The whole numbers are the same. Compare a/L and b/L."; explain prefix "The whole numbers are the same." · Test Q5: "Multiply the two denominators in each pair. For which pair is the LCD smaller than that?" · Test Q7/Q8 hint: "What do you multiply each bottom by to get {L}? Multiply its top by the same number."

**Unit 3:** CFU Q1 wrong: "Not quite. The LCD of 3 and 4 is 12. 3 × 4 = 12, so multiply the top of 2/3 by 4. 4 × 3 = 12, so multiply the top of 1/4 by 3. Then add the new tops." · CFU Q3 lead: "Two fractions are each less than 1." · Explore step 4: "The answer is a whole number." / "The only number that divides both r and L is 1. So r/L is already in simplest form." · Practice explain: "… The answer is a whole number." · Key Idea: "Example: 3/4 + 1/6 = 9/12 + 2/12 = 11/12. Then check for simplest form. An answer like 4/6 is equal, but not finished: write 2/3. Write 17/12 as 1 5/12." · Test Q8 explain: "r/L = X. Each L/L is 1 whole. Write the rest as a fraction in simplest form."

**Unit 4:** Explore: "… Borrowing is also called regrouping. In Fraction Operations you called it unbundling a whole." / "When the fraction parts make 1 whole or more, **carry**: move 1 whole to the whole number. 5 19/12 = 6 7/12." · Add view: caption "Together: {raw}"; "{rn}/{L} is 1 whole or more. One bar is full of pieces." [Carry 1 whole]; "Carry: L/L is 1 whole. Move it to the whole number. So 7 17/12 = 8 5/12. Answer: …" · Subtract view: "Start with X. You need to take away Y." / "There are only 3/12. That is not enough to take away 8/12." · Key Idea: "Do the fractions make 1 whole or more? Then **carry** 1 whole to the whole number." · Practice: from-whole step "You need to take away 1/3. Borrow 1 whole from 6. Write 6 with thirds." with hint "Take 1 from 6. How many wholes are left? The whole you took is 3/3."; add hint "… Then carry 1 whole to the whole number."; explain "rn/L is 1 whole or more, so carry 1 whole: …"; captions "Together, before you carry. A full bar of pieces is 1 whole." and "We borrowed 1 whole and cut it into pieces." · Diagnose: "It looks like you did 8/12 − 3/12. You can't take 8/12 from 3/12. Borrow 1 whole first." / "The fractions make 1 whole or more. You forgot to carry 1 whole to the whole number." · Test: Q1–5 hint "… Borrow 1 whole or carry 1 whole if you need to."; Q8 "Ana works on …"; Q9 hint "L/L is 1 whole. Carry it to the whole number."; Q10 "You borrow 1 whole from 5 1/4. How do you write 5 1/4 now?"

**Unit 5:** Explore: mode "Estimate"; "Operation" Add + / Subtract −; "The second fraction is bigger. Make the first one bigger to subtract."; "{x} is exactly halfway between two benchmarks. Try another fraction."; "Estimate: a − b = c."; "Show the exact difference"; "Exact: a/d − b/d2 = … = X." · Practice: title "Word problem"; step 1 "Which matches the story?" with hint "Picture the story. Are two amounts put together? Or is one amount taken away from, or compared with, the other?" and explains "The story puts the two amounts together. So add: …" / "The story takes B away from A. So subtract: …" / "The story compares the two amounts. Subtract the smaller one from the bigger one: …" / "The story asks how much more is needed. Subtract what there is from what is needed: …" · Estimate hint: "Find the benchmark for each amount. Then use them the way the story does." · Answer prompt: "What is the answer? Write it in simplest form. Then check that it is close to your estimate." · Make-sense story: "{Name} says a + b = c. Check {his/her} answer with benchmarks first."; step 3 when right: "Prove it: rewrite both fractions with the LCD, L."; wrap-ups "a/L + b/L = … {Name} was right." / "The exact answer is X, close to the estimate Y. {Name}'s answer, c, was wrong." · Mixed hint: "… Carry 1 whole if the fractions make 1 whole or more." (also Test Q8) · Labels: "Short stories", "Does it make sense?", "Mixed-number stories".

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Pass (0 errors) |
| `npx eslint` on every touched file | Pass: 0 errors. Warnings are only the existing `react-refresh/only-export-components` and an "unused eslint-disable" in the K–1 shells, which is also there at HEAD. |
| `npx vite build` | Pass. Only the existing chunk-size and dynamic-import notes; no "does not provide an export" warnings. |
| Test ↔ unit import check | Pass. No `*Test.tsx` imports its unit file. No unit file imports anything but its Test's exported object. |
| `useRef<…>()` with no initializer | None |
| Brute force (12,000 draws per type/bucket, every step's right answer through the real `check()`) | **0 failures.** Every bucket is reachable; no duplicate choices; Unit 1 piece choices never offer a second common denominator; Unit 2 mixed wholes are always equal; Unit 3 improper share is 25.7% and always below 2; Q7 trap never has 0 on top and never collides; verdicts 33.4 / 33.1 / 33.6 (Test 33.2 / 33.0 / 33.8); sub estimate 0 share 16%; answer prompts never contain + or −; titles never name the operation; cup stories only with {2, 3, 4, 8}. Sample sentences for every type were read for grammar. Output: `…/scratchpad/mg10-r1-fix/brute.out`. |
| `english-check.cjs --grade 5` | 0 strings over the limit. New flags: "left over" (the agreed E1-09 definition, used once). The two passive captions I first wrote were rewritten in the active voice. The rest predate this round. |
| Browser, iPad 820×1180 with touch, harness page (deleted) | **Pass.** Walked one problem of every changed Practice type in MG10 (wrong, wrong, wrong, Show answer, then "Try one like it"). **C1-01:** after a helped solve, switching units and reloading both keep the "Try one like it" lock and draw the same type; a clean solve clears the debt and enables "Next problem". **MK1:** two wrong tries lock the unit; the lock survives a unit switch and a reload, the same type is drawn, and other units stay free. No page errors (one 404 for a missing favicon). Dark mode checked on the new bars. |

Screenshots (all looked at) in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\mg10-r1-fix\shots\`:
- Wide bars: `gallery.png` (L = 30 and L = 48: RecutBars, MixedBars borrowed/carry, BenchmarkLine), `gallery-L24.png`, `gallery-dark.png`
- Unit 1: `u1-start.png`, `u1-s1-wrong1.png`, `u1-s2-wrong1.png`, `u1-end.png`
- Unit 2: `u2-before.png` (no lists), `u2-after-wrong.png`, `u2-explore-cfu.png`
- Unit 3: `u3add-s3-wrong1.png`
- Unit 4: `u4-explore-add-before-carry.png`, `u4-explore-add-after-carry.png`, `u4-explore-L30-borrow.png`, `u4fromWhole-s1-wrong1.png`, `u4-add-carry-help.png`
- Unit 5: `u5-explore-estimate-sub.png`, `u5-explore-tie.png`, `u5short-s1-wrong1.png`, `u5mixed-s1-wrong1.png`, `u5-practice-bar.png`
- Retry lock: `c101-after-switch.png`, `mk1-after-switch.png`

Walk log: `…\mg10-r1-fix\walk-mg10.out`.

## 6. Noticed, not fixed

1. **Unit 1 Practice now has 4 steps** (the builder prefers 2–3). Step 4, "Who is right?", is C1-03, which is waiting on the user (C1-20 option B would replace it).
2. **Estimate choices: the right answer is in the 3rd place only 14% of the time** (C1-16 residue). Choices stay in number order and can't go below 0, so an estimate of 0 or 1/2 can never be 3rd. Options: shuffle the order, or give up number order for low estimates. This needs a design call.
3. **"Too big" claims are shown reduced** (e.g. "14/5" for a 28/10 claim) while the explain says "kept the bottom 10". This predates this round (`claimFor` reduces every claim).
4. **Unit 4 `subFromWhole`**: after one wrong try on the borrow step, the picture shows the borrowed result (3 wholes + 2/2), which is the typed answer. This predates this round and is the same for every borrow step; the curriculum review praised this picture.
5. **Unit 5 Explore**: the default fractions (5/8 − 1/3) give an estimate of 0 when the student switches to Subtract. A better default pair for subtraction would show a more useful example.
6. **Unit 3 CFU Q1's agreed wrong-answer message states the LCD (12)**, which is the first box's answer. It was used as agreed (E1-03); the English or curriculum checker may want to soften it.
7. The `useModuleProgress` reset does not know about the retry debt; each shell now calls `clearDebts()` next to `reset()`. Any future lab shell copied from these must keep both calls.

Still worth a manual pass on a real iPad before calling this done.
