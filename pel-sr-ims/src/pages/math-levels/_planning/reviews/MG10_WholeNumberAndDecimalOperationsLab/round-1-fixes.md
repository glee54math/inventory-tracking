# MG10 Decimal Place Value & Rounding — round 1 fixes

- Lab: MG10 `WholeNumberAndDecimalOperationsLab` (Units 1–2), Grade 5 · Round 1 · 2026-11-15
- Work order: `round-1-merged.md` (18 Fix + C1-01 user decision). Not committed.

## 1. Summary

**19 Fixed · 0 Partly fixed · 0 Needs decision · 0 Not fixed.** The 2 Skip items (E1-09, E1 voice proposal) were left alone.

## 2. Items

| ID | Status | What changed | Where |
|---|---|---|---|
| C1-01 | Fixed | Every graded rounding prompt now ends "Write every place up to the {tenths/hundredths}." (new `writeEveryPlace(p)`, added inside `roundStep`, so Practice round + two-places, Unit Test Q1–Q6/Q8 and Module Test Q6–Q9 all get it; nothing added for whole numbers). Test Q9 (two blanks, graded by value) says "Write every place up to the place you round to." CFU Q1 and Q3 now say it too (Q2 already did). `padTo` grading and the engine's "right value, wrong number of places" message are unchanged. | `lib/steps.ts` `writeEveryPlace`/`roundStep`; `RoundingDecimalsTest.tsx` `twoPlacesQuestion`; `RoundingDecimals.tsx` CFU Q1/Q3 |
| E1-01 | Fixed | Between-step prompt: "Find the hundredth just below it and the hundredth just above it." (tenth for tenths; whole-number text unchanged). | `lib/steps.ts` `betweenStep` |
| E1-02 | Fixed | Explore opening and Key Idea: "To round 2.437 to the nearest hundredth, find the hundredths just below and just above it: 2.43 and 2.44." | `RoundingDecimals.tsx` Explore, keyIdea |
| C1-02 | Fixed | Compare step 1 help: chart lined up with empty places left empty on the 1st wrong try; the 0s fill in on the 2nd wrong try, in Show me, or once step 1 is done. Hint now "Line up the places. Fill the empty places with 0. Then read the three digits after the point as one number." | `ReadingComparingDecimals.tsx` `compareProblem` visual; `lib/steps.ts` `thousandthsStep` |
| C1-03 + E1-10 | Fixed | `DecimalBars` zooms when the two numbers differ by more than 0 and less than 0.01: the ruler covers the hundredth (or two) they sit in, with a mark per thousandth, a zigzag cut for the part left out (bars still start at the whole number), and a caption "Zoomed in: each small mark is 1 thousandth". Applies to the Explore presets and to Compare help. Sentence now "The longer bar is the greater number. The number of digits doesn't matter." | `diagrams/DecimalBars.tsx`; `ReadingComparingDecimals.tsx` Explore |
| C1-04 | Fixed | `expandedDec()` gives a 2-digit whole part ~17% and a 3-digit whole part ~16% of the time. `expandedText` writes those by place (347 → 3 × 100 + 4 × 10 + 7 × 1); `shortExpandedText` as 300 + 40 + 7. `PlaceChart` gains a hundreds column. Explore adds "Whole numbers go by place too: 347 = 3 × 100 + 4 × 10 + 7 × 1." Reaches Practice (both steps), Test Q4/Q5 and Module Test (Q5 reuse). | `lib/decimals.ts`; `diagrams/PlaceChart.tsx`; Explore |
| C1-05 | Fixed | Practice step 1 / Test Q4 (`expandedFillStep`): the expanded form's parts are shuffled and 3 are blank; the boxes are never in the decimal's left-to-right order (brute force: 0 of 20,000), a 0 digit is always a blank, and with a big whole part one blank is a hundreds/tens/ones digit. Named message if the student types the digits in reading order. CFU Q2 is now "the parts are mixed up, write each as a decimal": 5 × 1/1000 + 6 + 3 × 1/10 = [6.305], 4 × 1/100 + 8 = [8.04], with named messages for copy-order and missing 0. Unit 1 CFU: Q1–Q3 have typed boxes (75% of questions). | `lib/steps.ts` `expandedFillStep`; `ReadingComparingDecimals.tsx` CFU Q2 |
| C1-06 | Fixed | The "9 + 1 = 10" message fires only when the problem rounds up (`r === hi`). Brute force: 1,572 down-bucket draws with a 9 at the place, 0 carry messages. | `lib/steps.ts` `roundStep` diagnose |
| E1-03 | Fixed | "When you add 1 to a 9, it becomes 10. Write 0 and add 1 to the place on its left." (Explore tip and Key Idea). | `RoundingDecimals.tsx` |
| E1-04 | Fixed | CFU Q4: "When you round a number, it always changes." | `RoundingDecimals.tsx` CFU Q4 |
| E1-05 | Fixed | CFU Q3 choices "the 4 in the hundredths place" / "the 9 in the thousandths place"; Test Q10 "Round to the nearest tenth. Which number rounds to 4.2?"; two-places wrap-up and Test Q9 explanation "To the nearest tenth, 4.27 rounds to 4.3. To the nearest whole number, it rounds to 4."; Explore "The digit just to its right, in the thousandths place, is the one that decides." | `RoundingDecimals.tsx`, `RoundingDecimalsTest.tsx` |
| E1-06 | Fixed | "The hundredths digit is 9. 9 + 1 = 10, and 10 can't fit in one place. Write 0 in the hundredths place. Add 1 to the place on its left." | `lib/steps.ts` `roundStep` |
| E1-07 | Fixed | Always the plural place name: "Thousandths need 3 digits after the point." / "Hundredths need 2 digits…". | `lib/steps.ts` `nameToDecStep` |
| E1-08 | Fixed | Opening split into 3 short sentences; "One thousandth is 1/1000" moved next to the expanded form; the reading rule is a 4-item numbered list, no capitals; the 3.042 example kept. Nothing removed. | `ReadingComparingDecimals.tsx` Explore |
| E1-11 | Fixed | "Having more digits does not make a decimal greater." | Unit 1 keyIdea |
| E1-12 | Fixed | CFU Q1 lead-in is now "Answer both parts." with parts a./b.; generated explain and wrap-up now start with the decimal: "4.026 is read "four and twenty-six thousandths."" | `ReadingComparingDecimals.tsx` CFU Q1 + `wordsProblem` wrapUp; `lib/steps.ts` `nameToDecStep` explain |
| C1-07 | Fixed | `roundCase` redraws when the rounded value is 0 (0 in 80,000 draws now). | `lib/decimals.ts` `roundCase` |
| C1-08 | Fixed | New small picture under the opening: a 10×10 whole with one hundredth shaded, then that hundredth drawn bigger and cut into 10 slivers with one shaded (labels in words only). | `diagrams/ThousandthPicture.tsx` (new), Explore |
| E1 out-of-lane | Fixed | Greatest-of-three explanation: "With 0s filled in: 0.700, 0.650, 0.689. Compare place by place from the left. 0.7 is the greatest." (no "fewest digits" claim). | `ReadingComparingDecimalsTest.tsx` `greatestQuestion` |

## 3. Changed files

All lab-local; **no shared files changed this round** (no other lab affected).
- `MG10/WholeNumberAndDecimalOperationsLab/lib/decimals.ts`
- `MG10/WholeNumberAndDecimalOperationsLab/lib/steps.ts`
- `MG10/WholeNumberAndDecimalOperationsLab/diagrams/DecimalBars.tsx`
- `MG10/WholeNumberAndDecimalOperationsLab/diagrams/PlaceChart.tsx`
- `MG10/WholeNumberAndDecimalOperationsLab/diagrams/ThousandthPicture.tsx` (new)
- `MG10/WholeNumberAndDecimalOperationsLab/diagrams/index.ts`
- `MG10/WholeNumberAndDecimalOperationsLab/units/ReadingComparingDecimals.tsx`
- `MG10/WholeNumberAndDecimalOperationsLab/units/ReadingComparingDecimalsTest.tsx`
- `MG10/WholeNumberAndDecimalOperationsLab/units/RoundingDecimals.tsx`
- `MG10/WholeNumberAndDecimalOperationsLab/units/RoundingDecimalsTest.tsx`
- ModuleTest.tsx is unchanged; it picks up the changes through the reused generators.

## 4. New or rewritten student text

Unit 1 Explore (`ReadingComparingDecimals.tsx`):
- "In 4th grade you used tenths and hundredths. The next place to the right is the thousandths place. 10 thousandths make 1 hundredth."
- Picture labels: "1 whole", "1 hundredth is shaded", "1 hundredth, bigger", "1 thousandth is shaded".
- "One thousandth is 1/1000. Whole numbers go by place too: 347 = 3 × 100 + 4 × 10 + 7 × 1."
- "To read a decimal:" 1. "Say the whole number." 2. "Say "and."" 3. "Read the digits after the point as one number." 4. "Say the place of the last digit."
- "A 0 inside still holds its place: 3.042 is three and forty-two thousandths."
- "The longer bar is the greater number. The number of digits doesn't matter. Line the digits up by place, then compare from the left."
- Bars caption: "Zoomed in: each small mark is 1 thousandth"

Unit 1 CFU:
- Q1: "Answer both parts." / "a. In 7.264, the 4 is in the [ ] place." / "b. Write "four and twenty-six thousandths" as a decimal: [ ]"
- Q2: "The parts of each number are mixed up. Write each number as a decimal." Good: "Right. Each digit goes in its own place: 6.305 has 3 tenths, 0 hundredths and 5 thousandths. 8.04 has 0 tenths and 4 hundredths." Bad: "Don't copy the digits in the order you see them. 1/10 is tenths, 1/100 is hundredths, 1/1000 is thousandths." / "One place has nothing in it. Write a 0 in that place, so each digit stays in its own place." / "Find the tenths, the hundredths and the thousandths. If a place has none, write a 0 there."

Unit 1 Practice/Test (`lib/steps.ts`, units):
- Expanded prompt: "Write {x} in expanded form. The parts are mixed up. Type the digit that goes in each box."
- Hint: "Look at what each box is multiplied by. 1/10 is tenths, 1/100 is hundredths, 1/1000 is thousandths. [100 is hundreds, 10 is tens, 1 is ones.] Find that place's digit in {x}."
- Named: "The parts are mixed up, so the digits don't go in order. Match each box to its place."
- Compare hint: "Line up the places. Fill the empty places with 0. Then read the three digits after the point as one number."
- Name diagnose: "{Thousandths|Hundredths} need {3|2} digits after the point. Put a 0 in each empty place."
- Name explain: "{x} is read "{name}." It has …"; words wrap-up: "{a} is read "{name}," and {b} is read "{name}.""
- Key Idea: "Having more digits does not make a decimal greater."
- Test Q10 explain: "With 0s filled in: {a}, {b}, {c}. Compare place by place from the left. {x} is the greatest."

Unit 2 (`RoundingDecimals.tsx`, `lib/steps.ts`, Test):
- Explore/Key Idea: "To round 2.437 to the nearest hundredth, find the hundredths just below and just above it: 2.43 and 2.44. Then pick the one it is closer to." (Key Idea without the last sentence)
- Explore: "The {hundredths} place has a box. The digit just to its right, in the {thousandths} place, is the one that decides."
- Explore tip: "Drag the dot, or change the digits. Try 2.996 to the nearest hundredth. When you add 1 to a 9, it becomes 10. Write 0 and add 1 to the place on its left."
- Key Idea: "When you add 1 to a 9, it becomes 10. Write 0 and add 1 to the place on its left. To the nearest hundredth, 2.996 rounds to 3.00."
- CFU Q1/Q3 add "Write every place up to the tenths."; Q3 choices "the 4 in the hundredths place" / "the 9 in the thousandths place"; Q4 "When you round a number, it always changes."
- Between-step: "We will round {x} to the nearest {tenth|hundredth}. Find the {tenth} just below it and the {tenth} just above it."
- Every rounding prompt (p > 0): "… Write every place up to the {tenths|hundredths}."
- Test Q9: "Round {x} two ways. Write every place up to the place you round to." Explain: "To the nearest {a}, {x} rounds to {ra}. To the nearest {b}, it rounds to {rb}." (same pattern in the Practice two-places wrap-up)
- Test Q10: "Round to the nearest tenth. Which number rounds to {T}?"
- Carry message: "The {hundredths} digit is 9. 9 + 1 = 10, and 10 can't fit in one place. Write 0 in the {hundredths} place. Add 1 to the place on its left."

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Pass |
| `npx eslint` on all changed files | 0 errors (6 react-refresh warnings: the existing pattern) |
| `npx vite build` | Pass; only the usual large-chunk warning |
| Unit ↔ Test import check | Pass (no new imports between them) |
| Brute force (20,000 per generator) | 0 errors: expanded values (fill, `expandedText`, `shortExpandedText`) match the number; whole part lengths 1/2/3 digits = 13,525/3,305/3,170; a 0 digit always a blank; boxes never in left-to-right order; copy-order message never fires on a right answer; every `roundCase` bucket: 0 rounds to 0, rounding matches an independent half-up; write-every-place text on every p > 0 prompt and never on whole numbers; carry message only on round-up (1,572 down draws with a 9: none); Test Q9/Q10 prompts and greatest-of-three explanation printed and read |
| `english-check --grade 5` | 0 strings over the length limit (was 2). Flags: "are mixed up" (passive, adjectival), "is cut into" (aria-label only), and earlier flags (true/false, the existing "which place is the N in?") |
| Playwright iPad portrait (820×1180, touch) | Unit 1 + 2 Explore render, no page errors; no slash fractions in visible text (Explore, expanded Practice); CFU Q2 wrong → copy-order message, right → praise; Compare help: 0 ghost 0s after the 1st wrong try, filled on the 2nd; expanded Practice shows mixed order with stacked fractions and the hundreds column; rounding prompts show the new between-step text and "Write every place…" |

Screenshots were reviewed and then left in the session scratchpad (`s_bars.png` shows zoomed bars at 0.45/0.452, 0.5/0.499, 3.45/3.459, 9.995/9.99, plus the unzoomed 0.45/0.5 and equal pairs; `s_u1_explore.png`, `s_u2_explore.png`, `s_u1_cmp_w1.png`, `s_u1_cmp_w2.png`, `s_u1_expanded_0.png`, `s_u1_expanded_hundreds.png`). The temporary harness page and dev server were removed and stopped.

I did not do a full shell walk this round (CFU gate, Show-answer path, dark mode). Those screens did not change.

## 6. Noticed, not fixed

- Test Q10 (`greatestQuestion`) always lists the greatest number first in the prompt and always has it with the fewest digits. A pattern-matcher could learn "pick the first / shortest". Suggest shuffling the prompt order and sometimes making a 3-digit number the greatest.
- On the expanded step, the step-1 help chart prints every digit of the number. It is the same number as in the prompt, so it does not give away the answer, but it does make matching each box to its place easier after one wrong try.
- The help diagnose `squeezed()` for "One place has nothing in it" now also covers big whole parts. It is not specific to the whole part (a hundreds/tens 0 is never squeezed), which is fine as-is.
- The carry wrap-up "The 9 became 0 and the 1 carried to the left." still uses the older wording (not in the E1-03 list).
- The engine's padTo message ("write it like 3.00") shows the formatted answer after a format slip. This is existing behavior and is kept per C1-01.
