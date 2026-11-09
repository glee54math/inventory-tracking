# MG10 Adding & Subtracting Fractions: curriculum review, round 2

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (5.NF.1–2)
- **Round:** 2 (re-review)
- **Date:** 2026-11-06
- **Grade band assessed:** 4th and up (grade 5). These students are seeing unlike denominators for the first time, and they come from MG9 (4.NF.1–3).
- **Inputs:** `round-1-curriculum.md`, `round-1-merged.md`, `round-1-fixes.md`, the approved plan, and the standards reference. I read every changed file in the MG10 lab, plus the new `shared/engine/retryDebt.ts` and the retry-debt code in all five K–1 shells.
- **How I checked:**
  - I read the code.
  - I ran a 30,000-draw script over the current generators (`scratchpad/mg10-r2-curriculum/check.mjs`).
  - I tested the retry lock in a temporary harness at iPad size (820×1180, touch on) on port 5204, in **MK1** and in **MG10 Unit 5**. The harness has been deleted and the server stopped.
  - I looked at the fixer's screenshots of the new pictures: the wide bars at L = 24, 30 and 48; the carry help; Unit 1 step 1; the Unit 5 operation step; and Unit 5 Explore with Subtract.
- **Not re-reported (as instructed):** C1-20 and C1-03 are waiting for the user's decision. C1-19 and the 30-shells note were marked Skip.

---

## 0. Status of last round's fixes

| ID | Status | Notes |
|---|---|---|
| E1-01 | Fixed | CFU Q1 now asks for "the two smallest numbers in both lists" (12, 24), then the LCD (12). The picture agrees: the list of 4s stops at 24. |
| C1-01 | Fixed | **Browser:** in MK1 (Unit 1, "What comes next?") and MG10 (Unit 5, Short stories), the lock stays on after a wrong try when the student switches units, reloads, or goes Explore → Practice. The type switch stays off and the same kind of problem comes back. The debt is saved in sessionStorage (`retryDebt:{module}:guest`). The code in MK2, MK3, MK4 and MG1 matches MK1 line for line. |
| C1-02 | **Fixed, but caused a new problem** | Step 1, "Which pieces can you cut BOTH bars into?", is in, and it never offers a second right answer. But Unit 1 Explore never shows how to choose the pieces, and the hint uses "go into", which isn't taught until Unit 2. See **C2-21**. |
| C1-05 | Fixed | The multiples lists show only after a wrong try on the LCD, or after the LCD is found. |
| C1-13 | **Fixed, but caused a new problem** | "Which matches the story?" is step 1. The answer prompt no longer prints the expression, and the titles and labels don't name the operation. But the step can be passed by reading key words, and its B − A trap is never right. See **C2-23**. |
| C1-14 | **Fixed, but caused a new problem** | Verdicts are now 33 / 33 / 33 % (Yes / too small / too big). Now that 2 in 3 claims are wrong, a problem from before matters more: most wrong claims are shown reduced, so the mistake named in the explanation can't be seen in the number. See **C2-22**. |
| C1-15 | Fixed | When the claim is right, step 3 is "Prove it: rewrite both fractions with the LCD". Its answers are not on screen. |
| E1-02 | Fixed | The option is now "All types". |
| E1-03 | Fixed | "Multiply its top by the same number." |
| E1-04 | Fixed | The flipped-subtraction message no longer uses "top" for screen position. |
| E1-05 + C1-11 | Fixed | Carry is taught in Unit 4 Explore with a spill-over bar and a **Carry 1 whole** button. The answer stays hidden until the student carries. On a wrong `addCarry` answer, Practice shows the "Together, before you carry" bar. The word "carry" is used the same way everywhere. |
| C1-04 | Fixed | CFU Q4 praise rewritten as agreed. |
| C1-07 | Fixed | The Test Q7 subtraction trap falls back to "old tops" or "added instead". It is never 0 on top and never improper. |
| C1-08 | Fixed | 25.3% of `addMixed` draws have one improper addend. |
| C1-09 | Fixed | `MixedBars` draws the loose pieces wide on their own row when a piece would be under 8 px. Now 45% of Unit 4 problems use the wide drawing. In the screenshots, the pieces can be counted at L = 24, 30 and 48. |
| C1-10 | Fixed | The link to MG9's "unbundling a whole" is in Unit 4 Explore. |
| C1-12 | Fixed | Before borrowing, the caption says "Start with …. You need to take away …". |
| C1-16 | **Not fixed (partly)** | Estimates of 0 are down from 43% to 16% of subtraction stories. But the right estimate is still the 1st button 47% of the time, the 2nd 39%, and the 3rd 13%. The window for an estimate of 0 still always starts at 0. Kept below as **C1-16**, lowered to Polish: the typed LCD and answer steps stop a guesser from getting a clean solve. |
| C1-17 | Fixed | Estimate mode has Add / Subtract. The first example is weak; see **C2-24**. |
| C1-18 | Fixed | Exactly-halfway values get the tie sentence. |
| C1-06 | Fixed | Mixed-number compare always has equal wholes (5,000 of 5,000 draws). |
| E1-06 | Fixed | The hint names the single piece ("How many twelfths fit in one fourth?"). |
| E1-07 | Fixed | Test Q9 choices show their numbers ("twelfths (12 in 1 whole)"). |
| E1-08 | Fixed | Unit 1 Explore links numerator/denominator to top/bottom. |
| E1-09 | Fixed | Unit 2 Explore defines "goes into". |
| E1-10 | Fixed | |
| E1-11 | Fixed | |
| E1-12 | Fixed | |
| E1-13 | Fixed | |
| E1-14 | Fixed | |
| E1-15 | Fixed | `subFromWhole` goes straight to the typed borrow step. A small hint issue is in **C2-25**. |
| E1-16 | Fixed | |
| E1-17 | Fixed | The wording was changed so it doesn't hint at the verdict. Good call. |
| E1-19 | Fixed | |
| E1-20 | Fixed | |
| E1-21 | Fixed | |
| E1-22 | Fixed | Cup stories are used only with denominators 2, 3, 4 and 8. |
| E1-23 | Fixed | Labels are neutral. |
| E1-24 | Fixed (as decided) | The BenchmarkLine label is done. The `Frac` label was skipped because `Frac` is shared, as the merged list said. |
| E1-25 | Fixed | |

**Totals: 40 Fix rows. 36 Fixed, 1 Not fixed (C1-16, partly), 3 Fixed but caused a new problem (C1-02, C1-13, C1-14).**

## 1. Verdict

**Ready for students after small fixes.** All the round-1 Majors are closed:
- Students now choose the operation in word problems.
- "Does it make sense?" can't be guessed or copied.
- Practice no longer gives the scaffolds the Test takes away.
- The retry lock holds through unit switches and reloads, in MG10 and in the K–1 labs.

What's left is Minor:
- Unit 1's new "which pieces?" step isn't taught in Explore.
- Wrong claims show a reduced number that hides the named mistake.
- The new operation step can be passed by spotting key words.

The user's decision on C1-20 / C1-03 is still pending.

## 2. Top 5 changes (ranked)

1. **C2-21:** Teach how to pick the common pieces in Unit 1 Explore, and give step 1 a picture to use after a wrong try.
2. **C2-22:** Show wrong claims unreduced (e.g. "14/20", not "7/10"), so the explanation "added across" / "kept the bottom 8" matches what the student sees.
3. **C2-23:** Vary the story wording and order so "Which matches the story?" needs real reading. "In total" should not always mean add, and the smaller amount should sometimes come first.
4. **C2-24:** Give Unit 5 Explore a better first subtraction example.
5. **C1-16 / C2-25:** Small fixes: estimate button order, and the from-whole borrow hint.

## 3. Scorecard (changed parts only)

| Unit | L1 Standards | L2 Audience | L3 Arc | L4 Unstuck | L5 Pictures | L6 Math | L7 Mastery | L8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 Why not across | Strong | OK | **Weak**: step 1's skill isn't shown in Explore | OK (picture doesn't help on step 1) | Strong | Strong | OK (C1-03 pending) | OK |
| 2 Common denominators | Strong | Strong | Strong | Strong | Strong | Strong | Strong | OK |
| 3 Add/subtract | Strong | Strong | Strong | OK | Strong (wide RecutBars) | Strong | Strong | OK |
| 4 Mixed numbers | Strong | Strong | Strong (carry taught) | Strong | Strong (MixedBars) | Strong | Strong | OK |
| 5 Word problems | Strong | Strong | OK | OK | OK | OK (claims shown reduced) | OK (keyword-passable step 1) | OK |
| Shell + K–1 shells | — | — | — | **Strong**: lock survives switch and reload | — | — | — | OK |

## 4. All findings

### Unit 1: Why You Can't Just Add Across

**C2-21: Minor: Layers 3 and 4 (learning arc, getting unstuck)**
- **Problem:** The new Practice step 1, "Which pieces can you cut BOTH bars into?", asks for a skill Unit 1 never shows.
  - Unit 1 Explore's "Same-size pieces" view says "Cut both into sixths" but never says why sixths.
  - The hint, "Find a number that both 5 and 4 go into", uses "go into". That phrase is first defined in Unit 2.
  - After a wrong try, the feedback is the engine's "Reread each choice and test it against the picture". But the picture (the two original bars) doesn't change and gives nothing to test a choice against.
  - Only Show me teaches the idea ("Both 5 and 4 go into 20…").
- **Who it hurts:** The first-timer and the student with a gap, on the first step of every Unit 1 Practice problem.
- **Evidence:** Explore: `units/WhyNotAcross.tsx:197-204` (no reason for the piece size). Step 1: `:261-268`. The visual has no `pointing(help, 0)` branch (`:254-258`). Screenshot `mg10-r1-fix/shots/u1-s1-wrong1.png`.
- **Fix:**
  1. In the Explore "Same-size pieces" view, add one live sentence before "Cut both into …": "Why {pieces}? {d1} and {d2} both go into {L}: {d1} × {L/d1} = {L} and {d2} × {L/d2} = {L}." When d1 = d2, leave it out.
  2. In Practice, on `pointing(help, 0)`, show the two multiples rows (`MultiplesList a={d1} b={d2}`, without `showLcd`) above the bars. That gives the "test it against the picture" feedback something to point at. A multiples list is 4.OA.4, so it isn't new.

### Unit 5: Word Problems

**C2-22: Minor: Layer 6 (math / misconceptions)**
- **Problem:** Wrong claims in "Does it make sense?" are shown reduced, so the mistake the explanation names can't be seen in the number.
  - Example: "Leo says 7/8 + 7/12 = 7/10. … Leo added across." Adding across gives 14/20, not 7/10 as shown.
  - Example: "Leo says 7/8 + 1/2 = 11/4. … changed the tops but kept the bottom 8." The bottom on screen is 4.
  - The standard's own example (2/5 + 1/2 = 3/7) is shown unreduced so the mistake is visible.
- **Who it hurts:** The procedure-follower who reads the explanation to learn what went wrong, on "Does it make sense?" and Module Q22. Now that wrong claims are 2 in 3 draws (after C1-14), this happens more often than before.
- **Evidence:** Script, 30,000 draws: 72% of "too small" (add-across) claims and 63% of "too big" claims are shown with a different denominator than the mistake produces. Code: `claimFor` divides by the gcd for every claim kind (`lib/fractions.ts:487-490`). Explanations: `units/WordProblems.tsx` (the `claim.verdict` explain). Seen live in the harness: "Leo says 7/8 + 1/2 = 11/4".
- **Fix:** In `claimFor`, reduce only the "right" claim (it must be in simplest form). Return add-across and kept-one-denominator claims raw (`n1+n2 / d1+d2`, `n1·d2+n2·d1 / d1`). Check the verdict with the same value. Re-run the verdict balance check (each 28–38%).

**C2-23: Minor: Layers 3 and 7 (learning arc, mastery)**
- **Problem:** "Which matches the story?" can be passed without picturing the story.
  - All four "total" templates end with "in total", so "in total" always means add.
  - Every subtraction story names the bigger amount first. So the right answer is always "first − second", and the B − A trap is never right.
  - A student learns "'in total' → +, otherwise first − second". That is the keyword shortcut the builder rules warn about.
- **Who it hurts:** The procedure-follower, on Short stories, Mixed-number stories and Test Q5–Q9.
- **Evidence:** `lib/stories.ts` (TOTAL templates; `makeStory` comment: "For subtraction, A must be the bigger amount"). `operationStep` in `units/WordProblems.tsx` always marks `t1 − t2` right for subtraction.
- **Fix:**
  1. Write the TOTAL questions several ways ("How far did she walk altogether?", "How much flour did she use?", "What is the total weight?"). Add one "compare" template that never says "more", e.g. "How much shorter is Ben's ribbon?"
  2. Add compare and more-needed templates that name the smaller amount first ("Ben has 1/3 cup. The recipe needs 3/4 cup. How much more does he need?"). Pass the story's order to `operationStep`, so the right choice there is `B − A` written in story order.
  3. Do the same in Test Q5–Q9 through the shared `makeStory`.

**C2-24: Polish: Layers 3 and 6 (learning arc, math accuracy)**
- **Problem:** The first difference a student estimates in Explore is a poor one. With the default 5/8 and 1/3, switching to Subtract shows "Estimate: 1/2 − 1/2 = 0", but the exact answer is 7/24, more than 1/4 away. Practice never allows such a pair: `u5Pair` rejects pairs where |exact − estimate| > 1/4.
- **Evidence:** `mg10-r1-fix/shots/u5-explore-estimate-sub.png`. The fixer also noted this (§6.5).
- **Fix:** When the student switches to Subtract, set the fractions to 7/8 − 1/3 (1 − 1/2 = 1/2; exact 13/24). Or, when |exact − estimate| > 1/4, add: "The estimate is far from the exact answer here. Try fractions closer to 0, 1/2 or 1."

**C1-16 (still open, lowered to Polish): Layer 7 (mastery)**
- **Problem:** The right estimate is the 1st button 47% of the time, the 2nd 39%, and the 3rd 13%. For an estimate of 0, it is always the 1st button.
- **Evidence:** Script, 30,000 story estimates. `estimateChoices` (`lib/fractions.ts:404-409`).
- **Fix:** For an estimate of 0 or 1/2, use the window 0, 1/2, 1 and 1/2, 1, 1 1/2 at random, so the right one is sometimes in the middle. Or accept number order and leave it: the typed LCD and answer steps already stop a guesser from a clean solve.

### Unit 4: Mixed Numbers

**C2-25: Polish: Layer 4 (getting unstuck)**
- **Problem:** The new from-whole borrow step's hint gives away the fraction box: "Take 1 from 6. How many wholes are left? The whole you took is 3/3." The boxes are 5 and 3/3. One hint still counts as a clean solve, so the star can come from being told the borrow idea rather than producing it.
- **Evidence:** `units/MixedNumbers.tsx:317-318`.
- **Fix:** "Take 1 from 6. How many wholes are left? Cut the 1 whole you took into thirds. How many thirds is that?"

## 5. Persona walkthrough highlights

- **The guesser in MK1 (shared retry-lock change):**
  - Typed a wrong answer on "What comes next?". The bar became "Try one like it" and the type switch locked.
  - Switched to Unit 2 and back: still locked, with a new "What comes next?" problem.
  - Reloaded the page: still locked.
  - Went Explore → Practice: same problem, still locked.
  - The side door is closed.
- **The first-timer in Unit 1 Practice:**
  - Sees 3/5 + 1/4 and "Which pieces can you cut BOTH bars into?". Explore only ever said "Cut both into sixths", so they pick "ninths" (5 + 4).
  - Feedback says to test it against the picture. The picture is unchanged.
  - The hint says "go into", which they haven't been taught yet.
  - Only Show me explains it. (C2-21)
- **The procedure-follower in Unit 5 Short stories:**
  - Learns after two or three stories that "in total" means + and that otherwise it's the first number minus the second.
  - Passes step 1 every time without picturing the story. (C2-23)

## 6. What's working well

- **The retry-debt design** (`shared/engine/retryDebt.ts`) is clean. It stores the type, bucket and mode, so the student comes back in the same mode. It applies to all six shells identically, and "Reset progress" clears it.
- **Carry is now taught the way borrow is:** a spill-over bar, a **Carry 1 whole** button, and the answer hidden until the student carries. The `addCarry` help picture matches it.
- **The wide-bar drawing** (`MixedBars`, wide RecutBars) makes LCD 24–48 pieces countable without shrinking the generator range the plan needs.
- **"Prove it: rewrite with the LCD"** is a good answer to a right claim: the student must produce numbers that are not on screen.
- **Unit 1 step 1's wrong choices** (sum of the denominators, and the bigger or smaller denominator) are each a named mistake and never a second common denominator.
- **The verdict-first draw** gives an even 33 / 33 / 33 split. "Too small" always comes from add-across, which is the standard's own misconception.

## 7. Rule gaps (proposed sentences for `math-lab-builder.md`)

- **C2-21:** "When a fix adds a Practice step, the skill it asks for must already be shown in that unit's Explore (or taught by its hint and a picture that changes on a wrong try). A hint may use only words taught in this unit or an earlier one."
- **C2-22:** "A wrong answer shown as someone's mistake is written exactly as that mistake produces it (unreduced), so the explanation's named mistake can be seen in the number."
- **C2-23:** "Word-problem templates vary their question wording and the order of the amounts, so no single phrase or position decides the operation; a 'reversed order' choice must be right in some stories."

## 8. What I could not check

- Real iPad Safari: touch, speech, and whether sessionStorage survives the tab being closed. A closed tab starts a fresh session, so the retry debt is lost there, as decided in the merged list.
- Real students.
- A full browser walk of every changed Practice type. I relied on the fixer's walk and screenshots for Units 1–4, and checked the code and the 30,000-draw script.
- Sentence-level English, which belongs to the English checker.

Scratch files are in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\mg10-r2-curriculum\`:
- `check.mjs`: the generator script.
- `lock.mjs`: the retry-lock browser walk.
- `mk1-locked.png`, `mk1-after-switch.png`: MK1 screenshots.
