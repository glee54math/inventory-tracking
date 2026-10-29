# NumericalExpressionsAndPatternsLab

**Proposed slot:** MG10 — provisional, confirm at build time per project convention.
**Grade:** 5
**Standards covered:** 5.OA.1 (use parentheses, brackets, or braces in numerical expressions, evaluate expressions with these symbols), 5.OA.2 (write simple expressions that record a calculation, interpret an expression without evaluating it), 5.OA.2.1 (CA — express a whole number in the range 2-50 as a product of its prime factors), 5.OA.3 (generate two numerical patterns using two given rules, identify relationships between corresponding terms, form and graph ordered pairs on a coordinate plane).
**Relationship to existing labs:** No existing coverage anywhere in the codebase — this is a clean gap. One forward-looking sequencing note: this lab's order-of-operations/grouping-symbols work (5.OA.1) is a direct conceptual prerequisite to `MM1_ExponentsAndExpressionsLab`'s already-built "Evaluating Expressions & Order of Operations" unit (grade 6). If a student is progressing through the levels linearly, sequence this lab before that MM1 unit — though the two are independent standards and neither build depends on the other technically.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. This standard is highly symbolic/abstract on first exposure — every new notational convention (parentheses, then brackets, then braces; the idea of interpreting an expression's SIZE without computing it) must be grounded in a concrete real-world scenario (a recipe that doubles, a shared allowance split three ways, a shopping total with a discount applied to a subtotal) before any pure symbol-manipulation practice.

## Units

### Unit 1: Why We Need Parentheses
- **Goal:** Discover that the ORDER you do operations in can change the answer, and that parentheses are how we tell someone exactly which part to do first.
- **Standard:** 5.OA.1 (introductory scope — parentheses only)
- **Buckets:**
  - A real-world scenario where doing operations left-to-right gives a wrong/nonsensical answer, motivating why grouping matters (e.g. "3 friends each get 2 apples plus 1 orange" vs. "3 friends each get 2 apples, plus 1 extra orange for the table")
  - Evaluating an expression with one set of parentheses in a straightforward left-to-right position, e.g. (4 + 6) × 3
  - Evaluating an expression where the parenthesized part is NOT first, e.g. 3 × (4 + 6), to prevent the misconception that "parentheses always mean do the first thing you see"
  - Evaluating an expression with parentheses nested around a subtraction or division (not just addition/multiplication), since the "do it first" rule feels most intuitive with addition and needs to generalize
- **Requires intro (CFU gate):** Yes — parentheses-as-grouping is the lab's foundational new convention, and "always compute left-to-right regardless of parentheses" is a real, common first-exposure misconception.
- **Memorization fact (periodic re-check candidate):** No — this is a reasoning convention, re-derivable every time from "do what's grouped first."

### Unit 2: Brackets and Braces — Grouping Inside Grouping
- **Goal:** Learn that when an expression needs MORE than one layer of grouping, we nest parentheses inside brackets inside braces, and work from the innermost group outward.
- **Standard:** 5.OA.1 (full scope — parentheses, brackets, braces together)
- **Buckets:**
  - Evaluating a two-layer expression, e.g. 2 × [(5 + 3) − 2], innermost-to-outermost
  - Evaluating a three-layer expression using all three symbol types, e.g. {3 × [(4 + 2) − 1]} + 5
  - Identifying which symbol (parenthesis/bracket/brace) is the OUTERMOST layer in a given expression — a pure vocabulary/structure-reading check, not a compute check
  - An expression where the innermost group is evaluated correctly but the student must still apply an operation sitting between two separately-grouped parts, e.g. (3 + 2) × (4 − 1), to confirm they don't collapse everything into one group by accident
- **Requires intro (CFU gate):** Yes — working innermost-to-outermost across three distinct symbol types is new structure, and the common error is evaluating left-to-right across groups rather than innermost-first.
- **Memorization fact (periodic re-check candidate):** No — re-derivable from the innermost-first rule each time.

### Unit 3: Reading an Expression Without Solving It
- **Goal:** Look at a numerical expression and describe what it MEANS or how its size compares to another expression, without actually calculating either one.
- **Standard:** 5.OA.2
- **Buckets:**
  - Translating a written real-world statement into a numerical expression (sentence → expression), e.g. "add 8 and 7, then multiply by 2" → 2 × (8 + 7)
  - Translating a given expression back into a plain-language description (expression → sentence), the reverse direction
  - Comparing two related expressions' relative SIZE without evaluating either (e.g. recognizing "3 × (18,932 + 921)" is three times as large as "18,932 + 921" by structure alone, using numbers deliberately too large to want to compute by hand)
  - A true/false generalization: does adding parentheses around a different part of the same three numbers always change the value? (it does NOT always change the value for every operation/grouping choice — e.g. with all addition it never changes the value — so this must be tested with a case where it's true and a case where it's false, not just one worked example)
- **Requires intro (CFU gate):** Yes — "interpret without evaluating" is a genuinely new reading skill distinct from everything in Units 1-2 (which were all about evaluating), and the large-number bucket specifically targets the common instinct to compute anyway rather than reason about structure.
- **Memorization fact (periodic re-check candidate):** No — this is interpretive reasoning.

### Unit 4: Breaking Numbers into Prime Factors
- **Goal:** Write a whole number as a multiplication of only its prime factors.
- **Standard:** 5.OA.2.1
- **Buckets:**
  - A number with a short, simple factorization using only small primes (e.g. 12 = 2×2×3)
  - A number that IS itself prime (e.g. 29, 41) — the trap being that students try to force a factorization where none but the number itself exists
  - A number requiring a larger or repeated prime factor (e.g. 48 = 2×2×2×2×3, or 45 = 3×3×5) to make sure the generator doesn't only ever produce factorizations capped at two or three factors
  - A number built from two different "nice" factor pairs that could mislead a factor-tree shortcut (e.g. 36, which factors multiple visually different ways down a factor tree but must always resolve to the same prime multiset 2×2×3×3) — to reinforce that the prime factorization is unique regardless of which factor pair you start from
- **Requires intro (CFU gate):** Yes — the concept that EVERY whole number (except 1) has one unique prime factorization regardless of the path taken to find it is a new, named idea (the uniqueness of prime factorization), easily missed if a student thinks different starting factor pairs give different "correct" answers.
- **Memorization fact (periodic re-check candidate):** No — the small set of primes under 50 could tempt a "memorize the list" shortcut, but the skill being tested is the factoring PROCESS, which should be re-derivable by trial division each time, not memorized as a lookup table.

### Unit 5: Two Rules, Two Patterns, One Relationship
- **Goal:** Build two number patterns from two different rules, then discover and describe how the two patterns relate to each other term by term.
- **Standard:** 5.OA.3
- **Buckets:**
  - Generating a single pattern correctly from one given rule (e.g. "start at 0, add 3 each time") as the lead-in skill
  - Generating two separate patterns from two related rules (e.g. Pattern A: add 3 each time; Pattern B: add 6 each time) and identifying the term-by-term relationship (every term of B is twice the corresponding term of A)
  - Forming ordered pairs from corresponding terms of the two patterns and plotting them on a (first-quadrant) coordinate plane
  - A pair of rules where the relationship is NOT a simple constant multiple (e.g. Pattern A: add 2 each time starting at 1; Pattern B: add 2 each time starting at 3 — the relationship is "always 2 more," an additive rather than multiplicative relationship) — so students must actually inspect the terms rather than assuming every pair of patterns relates multiplicatively
- **Requires intro (CFU gate):** Yes — connecting two independently-generated sequences into a term-by-term relationship, then representing that relationship as plotted ordered pairs, combines three new ideas at once (sequence generation + relationship-finding + graphing) and deserves a guided walkthrough before open practice.
- **Memorization fact (periodic re-check candidate):** No — this is generative/relational reasoning, done fresh each time from whatever two rules are given.

## Open questions / flags for the builder

- No [VERIFY] flags — this lab has no existing coverage to reconcile against.
- Unit 5 depends on a first-quadrant coordinate-plane graphing capability. If `CoordinatePlaneAndShapeClassificationLab` (MG10, Grade 5) is built before this lab, reuse whatever shared coordinate-plane diagram/graphing step that lab establishes rather than building a second one; if this lab is built first, keep the graphing step minimal/reusable so that lab can lean on it later if convenient — but do not block on build order either way.
- Confirm at build time whether MG10 is in fact the correct open slot (shared with `CoordinatePlaneAndShapeClassificationLab` and `MeasurementConversionAndLinePlotsLab` per this planning pass) or whether these three Grade-5 labs should be spread across multiple slots — this is a placement call for Stage 0 conversation, not something to assume silently.
