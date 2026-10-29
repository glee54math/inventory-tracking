# Decimals Lab

**Proposed slot:** MG8 or MG9 — provisional, confirm at build time per project convention.
**Grade:** 4
**Standards covered:** 4.NF.5 (express a fraction with denominator 10 as an equivalent fraction with denominator 100; add two fractions with respective denominators 10 and 100), 4.NF.6 (use decimal notation for fractions with denominator 10 or 100), 4.NF.7 (compare two decimals to hundredths by reasoning about their size; valid only for the same whole; justify using a number line or other visual model).
**Relationship to existing labs:** Brand-new lab. Builds on fraction fluency from `MG9_IntroToFractionsLab` (forms, equivalence, comparison) but introduces an entirely new representation (decimal notation) not covered anywhere else in the platform. Does not depend on or overlap with the proposed `FractionOperationsLab` — this lab stays within denominators 10 and 100 specifically, never the general fraction-operations denominator range.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Decimal notation is a brand-new symbolic system (not just a new fraction denominator) — every unit should visually tie each decimal back to its fraction-of-a-whole meaning (a number line or hundredths grid) before asking for pure decimal-to-decimal symbol manipulation.

## Units

### Unit 1: Tenths to Hundredths Equivalence
- **Goal:** Rewrite a tenths fraction as an equivalent hundredths fraction, and add a tenths amount to a hundredths amount.
- **Standard:** 4.NF.5
- **Buckets:** (a) convert a tenths fraction to hundredths (multiply numerator and denominator by 10) — straightforward, reusing the equivalent-fractions idea from `IntroToFractionsLab`; (b) add one tenths-denominator fraction and one hundredths-denominator fraction, requiring the tenths one to be converted to hundredths FIRST before adding — the actual new skill, not just the conversion in isolation; (c) an add-and-carry edge case where the hundredths sum exceeds 100/100, producing a result greater than one whole (e.g., 7/10 + 80/100 = 150/100 = 1 1/2) — tests that the student doesn't stop at an "improper"-looking hundredths sum.
- **Requires intro (CFU gate):** Yes — converting-before-adding is a new, skippable step; CFU should include a trap question presenting 3/10 + 24/100 and asking a student to spot the error in "3/10 + 24/100 = 27/100" (adding numerators of fractions with different denominators directly), naming exactly why that's wrong.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 2: Decimal Notation for Tenths and Hundredths
- **Goal:** Read, write, and convert between a fraction with denominator 10 or 100 and its decimal form.
- **Standard:** 4.NF.6
- **Buckets:** (a) tenths fraction → decimal (e.g., 3/10 → 0.3); (b) hundredths fraction → decimal (e.g., 47/100 → 0.47); (c) decimal → fraction including a "hidden zero" case in the tenths place (e.g., 0.07 → 7/100, not 7/10) — the classic place-value misconception where students drop the leading zero and misname the denominator; (d) a mixed number with a tenths or hundredths fractional part converted to and from decimal form (e.g., 3 4/10 ↔ 3.4).
- **Requires intro (CFU gate):** Yes — the hidden-zero/leading-zero trap (bucket c) is the single most common decimal-place-value error at this grade and must be named explicitly in the CFU, ideally by asking the student to compare 0.7 and 0.07 directly and explain which is bigger and why the extra zero matters.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Comparing Decimals to Hundredths
- **Goal:** Compare two decimals (to the hundredths place) by reasoning about their size, and justify the comparison with a number line or visual model.
- **Standard:** 4.NF.7
- **Buckets:** (a) same number of decimal digits, straightforward place-value comparison (e.g., 0.42 vs. 0.38); (b) DIFFERENT number of decimal digits where the shorter decimal is actually the bigger number (e.g., 0.5 vs. 0.36) — the classic "more digits means bigger number" misconception, a mandatory bucket, not an optional extra case; (c) matching whole-number parts requiring a genuine tenths- or hundredths-level comparison to break the tie (e.g., 2.45 vs. 2.49); (d) a "same whole" validity trap mirroring the fraction-comparison constraint from 4.NF.2/4.NF.7's own text — two decimal amounts measured against different-sized wholes (e.g., 0.5 of a short ribbon vs. 0.5 of a long ribbon) that cannot be validly compared by their decimal values alone.
- **Requires intro (CFU gate):** Yes — bucket (b)'s "more digits = bigger number" misconception is THE named classic error for this standard and must appear in the CFU as a direct true/false or explain-why question (e.g., "Is 0.5 less than 0.36 because 0.5 has fewer digits? True or false — explain using a number line."); the same-whole validity trap (bucket d) should also appear as a second, distinct CFU question so the two are not conflated into one.
- **Memorization fact (periodic re-check candidate):** No.

## Open questions / flags for the builder
- Final level-code placement (MG8 vs. MG9) is left open per the brief.
- This lab is scoped tightly to denominators 10/100 only, per 4.NF.5-7's own explicit restriction — confirm the builder doesn't widen Unit 1's "equivalence" generator to the general small-denominator range used elsewhere in the platform (e.g., in `IntroToFractionsLab` or the proposed `FractionOperationsLab`), since that would be off-standard here.
- Only 3 units total (one per standard, 1:1) since 4.NF.5/6/7 each name one clean, non-overlapping sub-skill with no natural further split — confirm this is an acceptable unit count at the lower end of the 3-6 range rather than needing a 4th (e.g., a dedicated money-context application unit, which was considered but not included since it isn't named by any of the three standards).
