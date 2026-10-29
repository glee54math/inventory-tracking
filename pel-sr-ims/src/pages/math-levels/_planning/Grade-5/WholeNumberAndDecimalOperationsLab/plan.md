# WholeNumberAndDecimalOperationsLab

**Proposed slot:** MG10 — provisional, confirm at build time per project convention.
**Grade:** 5
**Standards covered:**
- 5.NBT.3a-b — Read, write, and compare decimals to thousandths in base-ten numerals, number names, and expanded form.
- 5.NBT.4 — Round decimals to any place.
- 5.NBT.5 — Fluently multiply multi-digit whole numbers using the standard algorithm.
- 5.NBT.6 — Find whole-number quotients with up to 4-digit dividends and 2-digit divisors, using strategies based on place value, properties of operations, and/or the relationship between multiplication and division.
- 5.NBT.7 — Add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction.

**Relationship to existing labs:** [VERIFY] This lab's 5.NBT.6 ("2-digit-divisor long division") and 5.NBT.7 ("decimal operations") content may substantially overlap with units already built in MG11_MultDivFractionLab. Per the project's own VISUAL_COMPONENT_TODO.txt, MultDivFractionLab already has a long-division unit (DivisionLadder diagram, bracket long-division layout, `computeLongDivision()` shared by diagram and grading, dividends generated as divisor × quotient + remainder) and a decimal-operations unit (PlaceValueColumns diagram, aligned decimal columns for +/-/×, covering 6.NS.2 and 6.NS.3 respectively) — both currently pitched at the grade-6 "fluently, standard algorithm for every operation including division of decimals" level. See "Open questions / flags for the builder" below for the specific resolution the builder must do before writing any code for this lab's Unit 4/Unit 5.

**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Decimal place value (5.NBT.3/5.NBT.4) is where "longer decimal = bigger number" (0.45 "beats" 0.5 because 45 > 5) needs a direct visual counterexample — place-value columns or a number line, not just a comparison drill. The 2-digit-divisor long-division unit should build on whatever single-digit-divisor division the student already has (4.NBT.6) rather than assuming the whole algorithm is new.

## Units

### Unit 1: Reading, Writing, and Comparing Decimals to Thousandths
- **Goal:** Read and write decimals down to the thousandths place in different forms, and correctly compare two decimals even when one has more digits.
- **Standard:** 5.NBT.3a-b
- **Buckets:** (a) converting between base-ten numeral and number-name/word form (e.g. "three and forty-two thousandths" ↔ 3.042), (b) converting to/from expanded form (3.042 = 3 + 0/10 + 4/100 + 2/1000), (c) comparing two decimals with the SAME number of digits, (d) comparing two decimals with DIFFERENT numbers of digits where the longer one is actually smaller (the core misconception case: 0.45 vs 0.5 — 0.5 is bigger), (e) comparing a decimal that includes a nonzero thousandths digit against one that stops at hundredths (0.5 vs 0.499).
- **Requires intro (CFU gate):** Yes — bucket (d)/(e)'s "more digits doesn't mean bigger" misconception is exactly the kind of thing that needs a named, explicit confrontation before practice, not just correct-answer drilling.
- **Memorization fact (periodic re-check candidate):** No — place-value reasoning should remain re-derivable (align the columns, compare left to right), not memorized as a rule.

### Unit 2: Rounding Decimals
- **Goal:** Round a decimal to any given place — tenths, hundredths, or thousandths.
- **Standard:** 5.NBT.4
- **Buckets:** (a) rounding where the digit to the right is less than 5 (rounds down, "easy" case), (b) rounding where the digit to the right is 5 or more (rounds up), (c) a rounding case that requires carrying/cascading through a 9 (e.g. 2.996 rounded to hundredths → 3.00, where the carry ripples through multiple places), (d) rounding to a place that's already exact (e.g. rounding 3.40 to tenths — the "nothing changes but you still must answer correctly" trap), (e) rounding to thousandths vs. tenths vs. hundredths on the SAME number, so the student can't memorize one fixed answer per number.
- **Requires intro (CFU gate):** Yes — the cascading-carry case (c) is a real, nameable failure point (students often round only the targeted digit and ignore the ripple effect) that deserves a dedicated check.
- **Memorization fact (periodic re-check candidate):** Yes — "look at the digit one place to the right; 5 or more rounds up" is exactly the kind of fixed procedural fact worth a periodic re-check (reintroEverySolved) once proven, since it's easy to apply correctly once and then drift.

### Unit 3: Multiplying Multi-Digit Whole Numbers
- **Goal:** Fluently multiply multi-digit whole numbers using the standard algorithm.
- **Standard:** 5.NBT.5
- **Buckets:** (a) 2-digit × 2-digit with no zero in either factor, (b) 3-digit (or more) × 2-digit, (c) a factor containing an internal zero (e.g. 304 × 26 — a common place to drop a partial-product row), (d) a factor ending in zero (e.g. 420 × 17 — tempts a shortcut that can go wrong if mishandled), (e) both factors multi-digit with more than 2 digits each, to extend fluency beyond the minimum case.
- **Requires intro (CFU gate):** Yes — the standard algorithm's partial-product bookkeeping (especially bucket (c)'s internal zero) is a named, specific failure mode worth a gate before open practice.
- **Memorization fact (periodic re-check candidate):** Yes — the standard multiplication algorithm's steps are a durable procedural fact worth periodic re-checking (reintroEverySolved), same treatment as other written algorithms in this codebase (e.g. MG9_MultiDigitMultiplicationLab's existing 5.NBT.5 unit — see note below).

### Unit 4: Dividing by 2-Digit Divisors [VERIFY — see flags below]
- **Goal:** Find whole-number quotients for up to 4-digit dividends and 2-digit divisors, using place value and the relationship between multiplication and division.
- **Standard:** 5.NBT.6
- **Buckets:** (a) divisor and quotient both estimate cleanly on the first try (no adjustment needed), (b) the first-guess quotient digit is too high and must be adjusted down, (c) a dividend requiring a placeholder zero in the quotient (e.g. a digit "doesn't go" and a 0 must be recorded before continuing), (d) division with a nonzero remainder that must be reported as part of the answer, (e) division with no remainder (exact), (f) a 4-digit dividend specifically (the standard's upper bound), to make sure practice doesn't stop short at 3-digit dividends.
- **Requires intro (CFU gate):** Yes — the "guess, multiply, compare, adjust" cycle with a 2-digit divisor is a genuinely new estimation skill (vs. 4.NBT.6's 1-digit divisor), and the placeholder-zero case (c) is a specific, common failure point.
- **Memorization fact (periodic re-check candidate):** Yes — the long-division procedure itself is a standard algorithm worth periodic re-checking once proven (reintroEverySolved), matching this codebase's existing treatment of MG9_TwoDigitDivisionLab's 6.NS.2 division unit.

### Unit 5: Adding, Subtracting, Multiplying, and Dividing Decimals to Hundredths [VERIFY — see flags below]
- **Goal:** Add, subtract, multiply, and divide decimals to the hundredths place, using place-value alignment and models.
- **Standard:** 5.NBT.7
- **Buckets:** (a) addition requiring decimal-point alignment with DIFFERENT numbers of decimal places (e.g. 3.4 + 2.15 — a common misalignment error source), (b) subtraction requiring the same alignment, including a borrow across the decimal point, (c) multiplication of a decimal by a whole number, (d) multiplication of a decimal by a decimal (where the number of decimal places in the product must be tracked explicitly, not just copied from one factor), (e) division of a decimal by a whole number, (f) division involving a decimal divisor (requires shifting both the divisor and dividend's decimal point before dividing) — note this sub-case pushes toward 6.NS.3's "fluently divide multi-digit decimals" territory and should be scoped carefully (see flags below).
- **Requires intro (CFU gate):** Yes — decimal-point alignment (bucket a/b) and tracking decimal places through multiplication (bucket d) are both specific, nameable failure points distinct from the whole-number versions of these operations.
- **Memorization fact (periodic re-check candidate):** Yes — "line up the decimal points for +/-" and "count total decimal places for ×" are fixed procedural facts worth periodic re-checking (reintroEverySolved) once proven.

## Open questions / flags for the builder

**[VERIFY] — required before building Unit 4 and Unit 5 of this lab.** Do a side-by-side comparison of MG11_MultDivFractionLab's existing DivisionLadder/long-division unit and PlaceValueColumns/decimal-operations unit against the EXACT text of 5.NBT.6 and 5.NBT.7 above before writing any new code:

- 5.NBT.6 is "up to 4-digit dividend, 2-digit divisor, whole-number quotient" — compare this against what MultDivFractionLab's long-division unit (built for 6.NS.2, "fluently divide multi-digit numbers") actually generates. If MultDivFractionLab's existing dividend/divisor ranges already cover 5.NBT.6's narrower case without further restriction, building a wholly separate Unit 4 here would duplicate it. Also separately check MG9_TwoDigitDivisionLab (already wired, 6.NS.2) for the same overlap risk, since its name suggests exactly "2-digit divisor" territory already exists there too.
- 5.NBT.7 caps at HUNDREDTHS and explicitly allows "concrete models/drawings," while MultDivFractionLab's decimal unit was built for 6.NS.3 ("fluently add/subtract/multiply/divide multi-digit decimals using the standard algorithm," no digit-place cap named). Check whether MultDivFractionLab's PlaceValueColumns unit's existing problem generator already restricts to hundredths or goes further, and whether it already includes a concrete-model/drawing representation (5.NBT.7's explicit allowance) or only the standard algorithm.
- Per build-math-lab's own Stage-0 guidance on this exact judgment call (new lab vs. new units in an existing lab), the builder should weigh whether Unit 4 and/or Unit 5 should become NEW UNITS ADDED TO THE EXISTING MG11_MultDivFractionLab (as grade-5-appropriate, narrower-scope companions sitting alongside the existing 6.NS units) rather than being built as a wholly separate WholeNumberAndDecimalOperationsLab. This is a genuine curriculum-sequencing call, not a default — raise it for explicit confirmation rather than guessing either direction.
- This plan still specifies full unit plans for all of 5.NBT.3-7 (above) regardless of this open question — content was not skipped due to possible overlap. The flag is for the builder/user to resolve the placement question at build time, using the actual current state of MultDivFractionLab's and MG9_TwoDigitDivisionLab's generators as evidence, not for this planning pass to guess the answer.
- If the builder determines Units 1-3 (place value, rounding, whole-number multiplication) have no overlap concern (they appear to be genuinely new, since neither MultDivFractionLab nor TwoDigitDivisionLab nor MultiDigitMultiplicationLab touches decimal place-value naming/rounding or whole-number multiplication's 5.NBT.5 fluency target directly — MG9_MultiDigitMultiplicationLab already covers 5.NBT.5 itself per VISUAL_COMPONENT_TODO.txt, so Unit 3 above may ALSO be a duplicate of an already-wired MG9 lab and should be checked the same way as Units 4-5 before building), those can proceed independently of how Unit 4/5's placement question resolves.
