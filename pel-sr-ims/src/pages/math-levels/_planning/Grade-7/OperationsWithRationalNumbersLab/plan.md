# OperationsWithRationalNumbersLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention.
**Grade:** 7
**Standards covered:** 7.NS.1a (describe situations where opposite quantities combine to 0), 7.NS.1b (understand p+q as a signed distance, show p and its opposite sum to 0, interpret sums in context), 7.NS.1c (understand subtraction as adding the additive inverse, relate to number-line distance), 7.NS.1d (apply properties of operations to add/subtract rational numbers), 7.NS.2a (understand multiplication extends via the distributive property, incl. (-1)(-1)=1 and sign rules, interpret products in context), 7.NS.2b (understand integer division, every quotient of integers is rational, sign-placement equivalences, interpret quotients in context), 7.NS.2c (apply properties to multiply/divide rational numbers), 7.NS.2d (convert a rational number to a decimal via long division, know it terminates or repeats), 7.NS.3 (solve real-world/math problems with the four operations on rational numbers).
**Relationship to existing labs:** Direct SEQUEL to MM1_NegativeNumbersLab (grade 6, already built), which covers the number-line/coordinate-plane/ordering/absolute-value side of negative numbers but explicitly stops short of arithmetic OPERATIONS. This lab assumes the student already understands what a negative number IS, where it sits on a number line, and how to compare/order signed values — and focuses entirely on the four operations with signed numbers, including fractions and decimals, not just integers.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Ground every sign rule in a concrete context the student already trusts (temperature change, elevation/depth, a bank account balance) before showing the symbolic rule in isolation — e.g. "owing $5 and earning $5 means you're back to $0" before "p + (−p) = 0". Let the student discover (-1)(-1)=1 through a context-grounded or distributive-property walkthrough rather than being told the rule as a fact to accept.

## Units

### Unit 1: Adding Rational Numbers
- **Goal:** Add positive and negative rational numbers by thinking of addition as combining signed distances on a number line, including the special case where opposite quantities sum to zero.
- **Standard:** 7.NS.1a, 7.NS.1b
- **Buckets:**
  - Both addends positive
  - Both addends negative
  - Mixed signs, with the positive addend's magnitude larger (sum is positive)
  - Mixed signs, with the negative addend's magnitude larger (sum is negative)
  - Opposite quantities (a number and its additive inverse) summing to exactly zero, as its own distinguished case
- **Requires intro (CFU gate):** Yes — the named misconception that "two negatives cancel out" (confusing it with the opposites-sum-to-zero case) and the tendency to skip comparing magnitudes before assigning the sum's sign in mixed-sign cases are both real, specific errors.
- **Memorization fact (periodic re-check candidate):** No — re-derivable each time via number-line/signed-distance reasoning.

### Unit 2: Subtracting Rational Numbers as Adding the Opposite
- **Goal:** Rewrite any subtraction as "add the opposite" and use that to subtract rational numbers, including understanding the result as a distance between two points on the number line.
- **Standard:** 7.NS.1c, 7.NS.1d
- **Buckets:**
  - Positive − positive, where the result can still come out negative (order matters)
  - Positive − negative (subtraction "turns into" addition and the result grows larger)
  - Negative − positive (compounding negatives)
  - Negative − negative (subtracting a more-negative number from a less-negative one, and vice versa)
  - Interpreting |p − q| as the distance between p and q, independent of which order they're subtracted in
- **Requires intro (CFU gate):** Yes — "subtracting a negative is the same as adding a positive" is THE named misconception for this unit; students commonly keep the subtraction sign and the number's own sign as two separate, uncombined negatives instead of rewriting the operation.
- **Memorization fact (periodic re-check candidate):** No — re-derivable from the "add the opposite" rewriting rule each time, not a standalone fact.

### Unit 3: Multiplying & Dividing Rational Numbers — The Sign Rules
- **Goal:** Multiply and divide positive and negative rational numbers using the sign rules, and understand WHY a negative times a negative is positive using the distributive property.
- **Standard:** 7.NS.2a, 7.NS.2b, 7.NS.2c
- **Buckets:**
  - Both factors/terms positive
  - Both factors/terms negative (the (−1)(−1) = 1 case, reinforced with its distributive-property justification)
  - Mixed signs (one positive, one negative) — product/quotient is always negative regardless of which magnitude is larger
  - A chain of three or more factors with mixed signs, requiring the student to count negatives (parity) to determine the final sign before computing magnitude, rather than resolving signs pairwise
  - Division where the quotient is not a whole number (reinforcing that every quotient of integers is a rational number, with sign-placement equivalences like −a/b = a/−b = −(a/b))
- **Requires intro (CFU gate):** Yes — "multiplying two negatives gives a negative result" is explicitly the named misconception this standard exists to correct, and needs the distributive-property walkthrough (not just a stated rule) per this lab's audience framing.
- **Memorization fact (periodic re-check candidate):** Yes — the sign rules themselves (same signs → positive, different signs → negative) are a fixed fact worth periodic re-checking via `reintroEverySolved`, kept separate from the ongoing procedural fluency built by regular practice.

### Unit 4: Converting Rational Numbers to Decimals
- **Goal:** Convert a fraction to a decimal using long division, and recognize whether the decimal terminates or repeats.
- **Standard:** 7.NS.2d
- **Buckets:**
  - A fraction whose denominator's prime factors are only 2s and/or 5s → terminating decimal
  - A fraction whose denominator has another prime factor → repeating decimal
  - Correctly identifying/notating the repeating block, including a case where the repeating part does not start immediately after the decimal point
  - A negative fraction converted to a decimal, carrying the sign through the long-division process rather than attaching it as an afterthought
  - A mixed number or improper fraction converted to a decimal
- **Requires intro (CFU gate):** Yes — WHY some fractions terminate and others repeat (denominator's prime factorization) is a genuinely new idea that's easy to reduce to "ugly fractions just repeat" without understanding the actual reason, and needs a deliberate walkthrough.
- **Memorization fact (periodic re-check candidate):** No — this is a procedure (long division) applied fresh to each fraction, not a fixed fact to recall; the standard asks students to know THAT a rational number's decimal expansion terminates or repeats, not to memorize specific conversions.

### Unit 5: Multistep Real-World Problems with All Four Operations
- **Goal:** Solve real-world problems — money, temperature, elevation — that require combining addition, subtraction, multiplication, and division of rational numbers across multiple steps.
- **Standard:** 7.NS.3
- **Buckets:**
  - A multistep money scenario (e.g. a running account balance with charges and payments) combining addition and subtraction
  - A multistep temperature or elevation scenario combining a repeated rate (multiplication) with an initial addition/subtraction (e.g. "starts at 5°F and drops 3° per hour for 4 hours")
  - A scenario requiring division to find a per-step rate or change from a signed total (e.g. total elevation change over a number of equal descents)
  - A multistep problem that mixes fractions or decimals together with signed numbers, so fraction/decimal fluency and sign fluency are practiced together rather than in isolation
- **Requires intro (CFU gate):** No — by this unit all four operations on signed rational numbers are already individually familiar from Units 1-4; this unit is extended/combined application, not a new mechanism.
- **Memorization fact (periodic re-check candidate):** No — applied, multistep reasoning, not a fact.

## Open questions / flags for the builder

- Unit 3's memorization-fact flag (sign rules via `reintroEverySolved`) should be cross-checked against how `requiredBuckets`/stars interact with a `reintroEverySolved` re-surfacing at build time — confirm the mechanism doesn't block a student from earning their final star while a periodic re-check is pending, consistent with how the existing `reintroEverySolved` usage (if any in a sibling lab) behaves.
- This lab is large (5 units covering four operations, sign rules, decimal conversion, AND multistep application) — if pacing feels too dense at build time, Unit 4 (decimal conversion) is the most separable candidate to split out or defer, since it's less tightly coupled to the sign-rule arithmetic in Units 1-3.
- Confirm at build time whether fraction operands in Units 1-3 should include unlike denominators requiring a common-denominator step, or whether that fraction-arithmetic mechanic is assumed already mastered from earlier grades and only the SIGN handling is new content here — this affects how hard Unit 1-3's "fraction variant" problems should be within each sign-combination bucket.
