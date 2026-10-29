# IrrationalNumbersAndApproximationLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention. **Contention flag:** MM3 is also Grade 7's proposed slot (per the Grade-7 planning batch's `ExpressionsAndEquationsLab`/`OperationsWithRationalNumbersLab` proposals) — this grade-8 batch proposes MM3 for all four of its new labs, so final slot assignment across grades 7 and 8 needs explicit resolution before building (see Open questions).
**Grade:** 8
**Standards covered:** 8.NS.1 (know that numbers that are not rational are called irrational; understand informally that every number has a decimal expansion — for rational numbers, show that the decimal expansion repeats eventually, and convert a repeating decimal expansion into a rational number), 8.NS.2 (use rational approximations of irrational numbers to compare their size, locate them approximately on a number line, and estimate the value of expressions such as π²).
**Relationship to existing labs:** No existing coverage anywhere in the codebase — this is a clean gap. This is also the first lab in the K-8 sequence to introduce the rational/irrational distinction itself; nothing upstream (grade 6/7 rational-number labs) draws this line, so this lab must establish it from scratch rather than assuming any prior exposure to the word "irrational."
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. The core new idea (numbers whose decimal expansion never repeats) is invisible in the abstract — every claim ("this repeats," "this doesn't repeat," "this is between 1.4 and 1.5") needs to be grounded in an actual long-division trace or a number-line diagram the student can verify by substitution, before it's treated as a stated fact to memorize.

## Units

### Unit 1: Every Number Has a Decimal Expansion — Some Repeat, Some Don't
- **Goal:** Discover by actually doing long division that some fractions' decimals repeat in a pattern, and find out there are numbers whose decimals never settle into a repeating pattern at all.
- **Standard:** 8.NS.1 (rational numbers' decimal expansions eventually repeat; irrational numbers exist)
- **Buckets:**
  - A fraction whose decimal expansion terminates (e.g. 1/4 = 0.25) — the "repeats in zeros" edge case students often don't recognize as a repeating pattern at all
  - A fraction whose decimal expansion repeats a single digit (e.g. 1/3 = 0.333...)
  - A fraction whose decimal expansion repeats a multi-digit block that doesn't start immediately after the decimal point (e.g. 1/6 = 0.1666..., or 1/7's 6-digit repeating block), so students see the repeating block isn't always the first digit(s)
  - A presented decimal (not computed by the student) that visibly never falls into a repeating block within the digits shown (e.g. a truncated display of √2 or a constructed non-repeating pattern) labeled as irrational, paired with a same-length repeating decimal labeled rational, so students must actually scan for a repeating block rather than assume "long decimal = irrational"
- **Requires intro (CFU gate):** Yes — "irrational" is a brand-new vocabulary term with a real, specific test (does the decimal expansion repeat, ever, no matter how far you go), and the common misconception is treating "long" or "doesn't repeat in the digits I happened to compute" as proof, rather than understanding repetition is a structural guarantee of division by a fixed divisor.
- **Memorization fact (periodic re-check candidate):** No — this is re-derivable each time by actually running the division and watching the remainders cycle.

### Unit 2: Converting a Repeating Decimal Back to a Fraction
- **Goal:** Take a repeating decimal and turn it back into a rational number written as a fraction.
- **Standard:** 8.NS.1 (convert a repeating decimal expansion into a rational number)
- **Buckets:**
  - A single-digit repeating block starting immediately after the decimal point (e.g. 0.777... → 7/9)
  - A multi-digit repeating block starting immediately after the decimal point (e.g. 0.454545... → 45/99, simplified to 5/11)
  - A repeating decimal with a non-repeating part before the repeating block begins (e.g. 0.1666... → the repeating block is just the "6", not "16"), which is the single hardest case in this unit since the standard algebraic trick (multiply by powers of 10, subtract) must be set up with the non-repeating digits isolated first
  - A terminating decimal (no repeating block at all) converted to a fraction directly, to confirm students don't force the repeating-decimal algebra onto a case that doesn't need it
- **Requires intro (CFU gate):** Yes — the multiply-and-subtract algebraic technique (letting x = the repeating decimal, multiplying by 10^n to shift the repeating block, subtracting to cancel the infinite tail) is a genuinely new procedure with no prior analog in this codebase; the non-repeating-prefix case (bucket 3) is the one most likely to be set up wrong on a first attempt and deserves explicit walkthrough.
- **Memorization fact (periodic re-check candidate):** No — the technique is re-derivable from the same subtract-to-cancel logic every time; nothing here is a fixed fact worth separate periodic re-quizzing.

### Unit 3: Locating and Comparing Irrational Numbers on a Number Line
- **Goal:** Use a rational approximation (like 1.4 for √2) to figure out roughly where an irrational number sits on a number line, and to compare the size of two irrational numbers.
- **Standard:** 8.NS.2 (use rational approximations to compare size and locate irrationals on a number line)
- **Buckets:**
  - Placing a square-root irrational (e.g. √2, √5) between two consecutive whole numbers by bracketing (e.g. "√5 is between 2 and 3 because 2² = 4 and 3² = 9") and then narrowing to the nearest tenth
  - Comparing two irrational numbers' sizes directly (e.g. is √10 greater or less than π?) using rational approximations of both, without ever needing an exact value
  - Comparing an irrational number to a nearby rational number or fraction (e.g. is √7 greater or less than 2.6, or than 8/3?) — forces the approximation technique to work against a non-whole-number benchmark, not just consecutive integers
  - A "false precision" trap: two irrationals whose rough one-decimal-place approximations tie or are very close (e.g. √3 ≈ 1.7 and some other value also ≈ 1.7), requiring the student to approximate to an additional decimal place to actually resolve which is larger, rather than stopping at the first approximation that "looks done"
- **Requires intro (CFU gate):** Yes — bracketing-and-narrowing is a new estimation procedure, and the false-precision trap bucket targets a real, nameable misconception (assuming a rough approximation is always precise enough to compare two close values).
- **Memorization fact (periodic re-check candidate):** No — re-derivable each time via bracketing; no fixed fact to retain independent of the reasoning process.

### Unit 4: Estimating Expressions Involving Irrational Numbers
- **Goal:** Use a rational approximation of an irrational number to estimate the value of a larger expression containing it, like π² or 3 + √2.
- **Standard:** 8.NS.2 (estimate the value of expressions such as π²)
- **Buckets:**
  - Estimating a simple power of an irrational benchmark (e.g. π² using π ≈ 3.14, or (√5)² as a sanity-check case that should land back near 5)
  - Estimating a sum or difference combining an irrational approximation with a whole number or simple fraction (e.g. 3 + √2 ≈ 4.41)
  - Estimating a product combining an irrational approximation with a rational number (e.g. 2 × π ≈ 6.28, read as "about how far around" in a circle-circumference-style context)
  - A multi-step estimate requiring TWO irrational approximations combined in one expression (e.g. √2 + √3), to confirm students don't average or otherwise shortcut combining two separately-approximated values
- **Requires intro (CFU gate):** Yes — chaining an approximation into a larger arithmetic expression (rather than just locating the number alone, as in Unit 3) is a distinct new skill, and the generalization/trap worth testing explicitly is whether a student assumes rounding error "cancels out" or stays small after further operations like squaring.
- **Memorization fact (periodic re-check candidate):** Yes, partially — a small set of benchmark approximations (π ≈ 3.14, √2 ≈ 1.41) are genuinely worth retaining as quick-recall facts rather than re-deriving by bracketing every single time, since they recur as building blocks across this unit and later labs (e.g. circle circumference/area, Pythagorean theorem). Flag `reintroEverySolved` for just these two benchmark values, not for the general estimation skill.

## Open questions / flags for the builder
- **MM3 contention (flag required for every lab in this grade-8 batch):** This lab's proposed slot, MM3, is simultaneously proposed for grades 7 and 8 — the grade-7 planning batch already proposes MM3 for its own new labs, and all four grade-8 labs in this batch (this one, `ExponentsRadicalsAndScientificNotationLab`, `LinearEquationsAndProportionalRelationshipsLab`, `SystemsOfLinearEquationsLab`) propose MM3 as well. `MH1` is grade 8's other adjacent slot per the project's grade map but is earmarked for grade 9's likely Algebra I/Math I content, so it should NOT be used as a grade-8 overflow slot without an explicit decision to do so. The top-level README compiled after all grade batches finish should flag this contention explicitly; final slot assignment across grades 7/8 (and whether grade 8 needs a slot beyond MM3) needs resolution in a real Stage-0 conversation before any of these four labs is built.
- No prior lab exists to reconcile against for sequencing, so there are no [VERIFY]-style conflicts — this standard is a clean, self-contained gap.
- This lab is a natural prerequisite-in-spirit to `ExponentsRadicalsAndScientificNotationLab`'s Unit on √2/radicals (8.EE.2 names "know that √2 is irrational" directly) — recommend sequencing this lab before that one if a student is progressing linearly, though the two labs are independently buildable.
