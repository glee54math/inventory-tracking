# MG10 Decimal Place Value & Rounding — round 2 curriculum review

- Lab: MG10 `WholeNumberAndDecimalOperationsLab`, Units 1–2 only (Units 3–5 on hold, not reviewed). Round 2 (re-review). 2026-11-15.
- Grade band assessed: Grade 5 (4th-and-up band: text-led reasoning, vocabulary and traps expected). No read-aloud in this lab.
- Inputs: `round-1-merged.md`, `round-1-fixes.md` (incl. its "noticed, not fixed" list), `round-1-curriculum.md`, plan + user notes, CCSS 5.NBT.3a-b, 5.NBT.4.
- Method: code read of every changed file (`lib/steps.ts`, `lib/decimals.ts`, `DecimalBars`, both unit files, both Test files, ModuleTest). No shared files changed, so no other lab needed checking. I did not re-run a browser pass this round; I relied on the code and on the fixer's screenshots/brute-force log for rendering. Anything that rests only on that is marked.
- User rules applied: self-learning principle (Practice help may point strongly; Tests ~no scaffolding); ≥40% CFU typed, no copy steps; CFU stays open; stacked fractions; rounding answers show every place and every rounding question says so.

## 0. Status of round-1 Fix items

| ID | Status | Evidence |
|---|---|---|
| C1-01 | Fixed | `writeEveryPlace` appended inside `roundStep` (steps.ts 276–280), so every typed rounding prompt in Practice, Unit Test Q1–Q6/Q8 and Module Test Q6–Q9 says it; never on whole numbers. CFU Q1–Q3 say it. Test Q9 says it (see new C2-03 on its grading). Multiple-choice rounding items (Q7, Q10) don't need it. |
| E1-01 | Fixed | `betweenStep` prompt names the place ("the hundredth just below it and the hundredth just above it"). |
| E1-02 | Fixed | Explore line 138 and Key Idea name "the hundredths just below and just above". |
| C1-02 | Fixed | Compare visual: `fill` only on `done >= 1`, or step 0 with `wrong >= 2`/Show me. First miss shows the chart lined up, 0s not filled. |
| C1-03 + E1-10 | Fixed | `DecimalBars` zooms when 0 < difference < 0.01, labelled; checked 0.5/0.499 (ruler 0.49–0.50) and 0.45/0.452 by hand. Sentence reworded. |
| C1-04 | Fixed | `expandedDec` gives 2–3 digit whole parts (~33%); expanded text by place; PlaceChart hundreds column. |
| C1-05 | Fixed | `expandedFillStep` mixes the parts, boxes never in reading order, 0 digit always a blank, named copy-order message. CFU Q2 is now mixed-order → decimal (real work, not copying). |
| C1-06 | Fixed | Carry message gated on `r === hi` (steps.ts 299). |
| E1-03 | Fixed | Explore tip + Key Idea. (Practice carry wrap-up still uses old wording: C2-02.) |
| E1-04 | Fixed | CFU Q4. |
| E1-05 | Fixed | CFU Q3 choices, Test Q10, Explore. |
| E1-06 | Fixed | Carry message names the place. |
| E1-07 | Fixed | Plural place name. |
| E1-08 | Fixed | Opening split; numbered reading list. |
| E1-11 | Fixed | Key Idea. |
| E1-12 | Fixed | "Answer both parts." with a./b. |
| C1-07 | Fixed | `roundCase` redraws on 0 (fixer: 0 of 80,000); code path confirmed. |
| C1-08 | Fixed | `ThousandthPicture` added under the opening (rendering per fixer screenshot; not re-screenshotted). |
| E1 out-of-lane | Fixed | Greatest-of-three explanation compares place by place, no "fewest digits" claim. |

**19 Fixed · 0 Not fixed · 0 Fixed-but-new-problem.** (C2-01 below is an older pattern the fixer flagged, not caused by a fix.)

## 1. Verdict

Ready for students after one small fix. All round-1 items are fixed and the fixes teach well; the one finding worth doing before release is that the "greatest of three" Test question always has the shortest number as the answer, listed first, so it rewards the opposite misconception ("fewer digits is bigger").

## 2. Top changes

1. C2-01: vary the "greatest of three" question (order and which number wins).
2. C2-03: make Test Q9 grade the written places, matching its own instruction and Practice.
3. C2-02: bring the Practice carry wrap-up in line with the new carry wording.

## 3. Scorecard (changed parts weighted)

| Unit | 1 Standards | 2 Audience | 3 Arc | 4 Unstuck | 5 Pictures | 6 Math | 7 Mastery | 8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 Reading/Comparing | Strong (347.392-style now covered) | OK | Strong | Strong | Strong | Strong | OK (C2-01) | OK (not re-run) |
| 2 Rounding | Strong | Strong | Strong | Strong | Strong | Strong | OK (C2-03) | OK (not re-run) |

## 4. Findings

### Unit 1

**C2-01 · Minor · Layer 7 (mastery) / 6 (misconceptions)**
- Who: the procedure-follower, Unit Test Q10 and Module Test Q5.
- Problem: `greatestQuestion` always lists the greatest number first and it is always the one with the fewest digits (0.7 vs 0.65 vs 0.689). A student holding the reversed rule "fewer digits = bigger" (a known overcorrection after the "longer isn't bigger" lesson) gets it right every time, and "pick the first one" also always works. This was in the fixer's "noticed, not fixed" list; I confirm it.
- Evidence: `ReadingComparingDecimalsTest.tsx` 121–138 (`nums[0]` is always the 1-digit number and the answer; prompt joins `nums` in fixed order).
- Fix: shuffle the order in the prompt; and about half the time make a longer number the greatest (e.g. 0.72, 0.7, 0.689 → 0.72; or 0.705, 0.7, 0.65 → 0.705), keeping a "longer looks bigger" distractor in the other half. Keep the place-by-place explanation (already true for any order).

**C2-04 · Polish · Layer 3**
- Explore's "Build a decimal" steppers stop at a one-digit whole part, while Practice/Test expanded form now uses 2–3 digit whole parts (× 100, × 10). It's introduced only by one muted sentence ("347 = 3 × 100 + …"). Fine for Grade 5 (whole-number expanded form is 4.NBT.2), and the Practice hint covers it, so Polish only.
- Fix (optional): let the Ones stepper become a Whole-number stepper up to 999, or add one worked line to the expanded readout when the sentence's 347.392 is shown.

### Unit 2

**C2-02 · Polish · Layer 4 (consistency)**
- Practice carry wrap-up still says "The 9 became 0 and the 1 carried to the left." while Explore, Key Idea and the step message now say "add 1 to the 9 → 10, write 0, add 1 to the place on its left". Two descriptions of one move. (Fixer's noticed list; wording itself is the English checker's call.)
- Evidence: `RoundingDecimals.tsx` 205.
- Fix: "Adding 1 to the 9 made 10: write 0 and add 1 to the place on its left."

**C2-03 · Polish · Layer 7**
- Test Q9 ("Round 4.27 two ways. Write every place up to the place you round to.") grades by value only, so "4.3" passes where the answer is 4.30 — the only rounding question where the stated rule isn't enforced, while Practice "Two places" (two `roundStep`s with `padTo`) enforces it. Inconsistent, not harmful (more lenient).
- Evidence: `RoundingDecimalsTest.tsx` 252–263; sentence blanks have no `padTo` (`shared/engine/types.ts` ~285).
- Fix (pick one): (a) make Q9 two separate `roundStep`s like Practice (no shared-code change); or (b) add `padTo` to sentence number blanks in the engine (shared change — check other labs). (a) is simpler.

## 5. Persona highlights

- Procedure-follower, Unit 1 Test: has absorbed "don't trust the longer one" and flips it to "the shorter one wins". Q10 always agrees with them (C2-01); Q8 `shorterBigger` also always has the shorter one bigger by design, so the Test as a whole never catches the flipped rule except via Q7 `sameDigits`.
- First-timer, Unit 1 expanded form with 347.392: mixed-order boxes now force matching × 100 / × 1/100 to places; first miss shows the chart with the digits, which points strongly but leaves the matching to the student — fits the self-learning principle.
- Student with a gap, Unit 2 carry (2.996): types 3 → engine names "right value, wrong number of places", and the prompt already told them to write every place. Good loop.

## 6. What's working well

- The mixed-order expanded form (Practice, Test, CFU Q2) turns a copy step into real place-value work.
- Compare help is now properly staged (lined up → filled 0s → bars), and the zoomed bars finally make 0.5 vs 0.499 visible.
- "Write every place" sits in one helper inside `roundStep`, so no future rounding prompt can miss it.
- CFUs: Unit 1 and Unit 2 each have 3 of 4 questions typed (75%); both stay open (CfuToggle pattern unchanged).

## 7. Rule gaps

- Proposed for `math-lab-builder.md`: "In a 'which is greatest/least' question, shuffle the listed order and vary which kind of number (shorter/longer, more/fewer digits) is the answer, so neither the position nor the reversed misconception always wins."
- (Round-1 proposals 1–2 still pending Stage 6.)

## 8. Could not check

- No browser pass this round (relied on code + fixer's iPad screenshots for ThousandthPicture, zoomed bars, stacked fractions in mixed expanded form).
- Real students, real iPad.
