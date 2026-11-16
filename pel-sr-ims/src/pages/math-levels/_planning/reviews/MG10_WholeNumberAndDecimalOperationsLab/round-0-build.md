# MG10 Decimal Place Value & Rounding (WholeNumberAndDecimalOperationsLab) — round 0 build report

Date: 2026-11-15. Built: Units 1–2 only (Units 3–5 on hold by user; not built, not stubbed). Not committed.

## Unit 1 — Reading, Writing and Comparing Decimals (5.NBT.3a-b)
- Explore: build-a-decimal (digit buttons ones→thousandths, place chart, decimal, number name, expanded form with stacked 1/10, 1/100, 1/1000); compare presets (0.45/0.5, 0.5/0.499, 0.45/0.452, 3.042/3.024, 0.7/0.700) with aligned chart, "Fill empty places with 0", bars on a ruler.
- CFU: Q1 "In 7.264, the 4 is in the [thousandths] place"; "four and twenty-six thousandths" → 4.026 (4.26 named). Q2 6.305 = 6 + [3]×1/10 + [0]×1/100 + [5]×1/1000. Q3 Mia: 0.45 > 0.5 because 45 > 5 → 0.45 = [450] thousandths, 0.5 = [500], pick 0.5. Q4 T/F: more digits always greater (F); 0.5 and 0.500 equal (T).
- Practice: words (name→decimal; decimal→"w and [n] [unit]"), expanded (digits; short form with missing place → decimal), compare buckets sameDigits / shorterBigger / thousandths (incl. equal pairs): type both as thousandths, pick <, >, =.
- Test (10, pass 9): name with internal 0 → decimal; pick the name; decimal → name parts; expanded digits; short expanded → decimal; which place; compare same digits; compare shorter bigger; both as thousandths; greatest of three.

## Unit 2 — Rounding Decimals (5.NBT.4), reintroEverySolved 20
- Explore: digit buttons, round to whole/tenth/hundredth; chart boxes rounding place and deciding digit; zoomed number line with halfway mark and draggable dot; result sentence.
- CFU: Q1 3.462 between [3.4] and [3.5], rounds to 3.5. Q2 2.996 to hundredth = 3.00 ("3", 2.910, 2.10, 2.99 named). Q3 deciding digit [the 4], 5.749 → 5.7 (double-rounding trap). Q4 T/F: rounding always changes the amount (F, 3.40 → 3.4); 2.45 to tenth is 2.5 (T).
- Practice: round (down/up/carry/exact; between-step then rounded value; exact asks the next digit), twoPlaces (two different places, different answers). Named wrong answers: no carry, dropped carry, rounding up when nothing changes, other end, number typed back.
- Test (10, pass 9): down, up, halfway, carry at tenths, double carry at hundredths, nothing to round, only-next-digit choice, to whole number, two places, "which number rounds to 4.3?".

## Module Test
10 questions (5 per unit), pass 8, star cutoffs 9/8/7/6.

## Decisions beyond the plan
No rounding to thousandths (needs ten-thousandths). Rounded answers must show the place (3.00). Decimal→name typed as "w and [n] [unit]" plus a pick-the-name Test item. Expanded form digit × 1/10 style, whole part 1–9. Equal pairs in compare. Practice pictures appear only after a wrong try or once a step is done (Test has none). New optional `exact` on `NumberStep` and `SentenceNumberBlank` (engine tolerance 0.006 would accept 0.499 for 0.5).

## Files
New: `MG10/MG10_WholeNumberAndDecimalOperationsLab.tsx` + `_styles.css`; `MG10/WholeNumberAndDecimalOperationsLab/` lib (decimals, steps), diagrams (PlaceChart, ZoomLine, DecimalBars, index), units (ReadingComparingDecimals + Test, RoundingDecimals + Test, ModuleTest, index). Modified: `src/utils/levelSubsections.ts`, `shared/engine/types.ts`, `shared/engine/StepProblem.tsx`, `VISUAL_COMPONENT_TODO.txt`.

## Verification
tsc pass; eslint 0 errors; vite build pass; no unit↔Test imports; brute force 20,000 per bucket, 0 errors vs. independent rounding, hard cases reached (5.749, 2.45, 2.996, 9.96, 5.120), signs balanced, Test items 2,000 draws no duplicate/wrong-equal choices; english-check grade 5 clean except allowed flags; Playwright iPad portrait: loads, CFU gate (incl. history without CFU), passed CFU stays, multi-box Check gating, no slash fractions, dark mode, help pictures. Not run: Enter-key-into-choice check, edge-value screenshots of every diagram, step-by-step progressive-reveal check.
