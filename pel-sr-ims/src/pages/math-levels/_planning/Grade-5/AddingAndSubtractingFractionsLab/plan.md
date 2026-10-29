# AddingAndSubtractingFractionsLab

**Proposed slot:** MG10 — provisional, confirm at build time per project convention. (MG10 is currently a completely empty stub; no existing content to collide with.)
**Grade:** 5
**Standards covered:**
- 5.NF.1 — Add/subtract fractions with unlike denominators, including mixed numbers, using equivalent fractions.
- 5.NF.2 — Solve word problems involving addition/subtraction of fractions referring to the same whole, including unlike denominators; use benchmark fractions and number sense to assess the reasonableness of answers.

**Relationship to existing labs:** No existing coverage. This is a clean gap — MG9_IntroToFractionsLab covers fraction forms/equivalence/comparing/simplifying (4.NF territory, a direct prerequisite), and MG11_MultDivFractionLab covers multiplication/division of fractions (6.NS territory), but nothing in the codebase currently builds or practices add/subtract of unlike-denominator fractions. No [VERIFY] flag needed.

**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Students arrive having just mastered same-denominator add/subtract (4.NF.3) and equivalent-fraction generation (4.NF.1, MG9_IntroToFractionsLab) — this lab's whole job is bridging those into unlike-denominator operations. The single biggest misconception to confront head-on: students who add numerators AND denominators straight across (1/2 + 1/3 "=" 2/5) because that procedure "worked" for multiplication-adjacent reasoning or simple pattern-matching. Every new operation here should show a visual counterexample to that shortcut before teaching the correct common-denominator procedure.

## Units

### Unit 1: Why You Can't Just Add Across
- **Goal:** See with fraction bars why 1/2 + 1/3 is NOT 2/5, and why the pieces have to be the same size before you can add them.
- **Standard:** 5.NF.1 (conceptual foundation, pre-skill)
- **Buckets:** (a) two unit fractions with different denominators (1/2 + 1/3), (b) a unit fraction + a non-unit fraction (1/4 + 2/3), (c) one fraction already a multiple of the other's denominator (1/2 + 1/4 — "almost free" common denominator), (d) genuinely co-prime denominators requiring a true LCD search (1/3 + 1/5).
- **Requires intro (CFU gate):** Yes — this is the load-bearing misconception of the whole lab (denominators must represent equal-size pieces before parts can be combined), and it must be confronted before any procedure is drilled.
- **Memorization fact (periodic re-check candidate):** No — this is a conceptual/visual justification the student can always re-derive by reasoning with the fraction-bar model; it's not a fact to memorize.

### Unit 2: Finding a Common Denominator
- **Goal:** Practice rewriting two fractions with unlike denominators as equivalent fractions that share a denominator, using the fewest extra pieces possible.
- **Standard:** 5.NF.1 (equivalent-fraction strategy)
- **Buckets:** (a) one denominator is a multiple of the other (3 and 6), (b) denominators share no common factor besides 1 (3 and 5 — LCD is the product), (c) denominators share a common factor greater than 1 but neither divides the other (4 and 6 — LCD is NOT the product), (d) three or more distinct denominators are never required here, but mixed numbers' whole-number parts must be carried through unchanged while only the fractional part is converted.
- **Requires intro (CFU gate):** Yes — "any common denominator works, but the LCD keeps the numbers smallest" is a generalization students often miss, defaulting to cross-multiplying denominators even when a smaller common denominator exists.
- **Memorization fact (periodic re-check candidate):** Yes — the mechanical "multiply numerator and denominator by the same scale factor" step is a durable procedural fact worth periodic re-checking (reintroEverySolved), distinct from the conceptual Unit 1 justification.

### Unit 3: Adding and Subtracting Fractions (Unlike Denominators)
- **Goal:** Add and subtract two fractions with different denominators by converting to a common denominator first, then combining.
- **Standard:** 5.NF.1
- **Buckets:** (a) addition with no simplification needed at the end, (b) addition where the result must be simplified to lowest terms, (c) addition where the result is an improper fraction that should be reported as a mixed number, (d) subtraction where no borrowing/regrouping of the whole is needed, (e) subtraction where simplification is needed, (f) subtraction with a result that's a whole number (fractions cancel exactly, e.g. 5/6 - 2/6... but unlike here specifically unlike-denominator subtraction landing exactly on a whole).
- **Requires intro (CFU gate):** Yes — new skill, and "always reduce your answer" / "convert an improper result to mixed form" are easy to skip without an explicit check.
- **Memorization fact (periodic re-check candidate):** Yes — the add/subtract-after-common-denominator procedure itself is a standard algorithm worth a periodic re-check once mastered, so it doesn't quietly decay.

### Unit 4: Adding and Subtracting Mixed Numbers
- **Goal:** Add and subtract mixed numbers with unlike denominators, including when you need to "borrow" a whole as extra fraction pieces.
- **Standard:** 5.NF.1
- **Buckets:** (a) addition where the fractional parts sum to less than 1 (no regrouping into the whole-number part), (b) addition where the fractional parts sum to 1 or more (must carry into the whole-number part), (c) subtraction where the first fraction part is already bigger than the second (no borrowing), (d) subtraction requiring borrowing — the first mixed number's fraction part is smaller than the second's, so a whole must be "unbundled" into extra fraction pieces before subtracting (e.g. 5 1/4 - 2 3/4), (e) subtracting from a whole number with no fractional part at all (6 - 2 1/3) as the extreme borrowing case.
- **Requires intro (CFU gate):** Yes — borrowing across whole numbers with fractions is the single hardest new mechanical step in this lab and has a specific, nameable failure mode (subtracting fraction parts in the wrong order and reporting a negative, or forgetting to decrement the whole number after borrowing).
- **Memorization fact (periodic re-check candidate):** Yes — the borrowing procedure for mixed-number subtraction is exactly the kind of multi-step mechanical sequence that benefits from periodic re-checking (reintroEverySolved) rather than one-time proof, since it's easy to let slip once the novelty wears off.

### Unit 5: Word Problems — Benchmark Fractions and Reasonableness
- **Goal:** Solve real-world problems that add or subtract fractions with unlike denominators, and use benchmark fractions (0, 1/2, 1) to check whether an answer makes sense before trusting the exact computation.
- **Standard:** 5.NF.2
- **Buckets:** (a) "how much in total" (join/Add To situation, result unknown), (b) "how much is left / how much more is needed" (Take From / Compare situation, result unknown), (c) a reasonableness-check question where the student must flag an answer as implausible using benchmark reasoning BEFORE computing exactly (e.g. "is 1/8 + 1/3 closer to 0, 1/2, or 1?"), (d) a problem involving mixed numbers in context (e.g. recipe/measurement scenarios) rather than bare fractions.
- **Requires intro (CFU gate):** Yes — benchmark-fraction estimation is a distinct skill from the computation itself and is exactly the kind of thing a rote drill never asks for directly; it needs its own gate separate from Unit 3/4's mechanical procedure.
- **Memorization fact (periodic re-check candidate):** No — benchmark estimation is reasoning-based and should always be re-derivable from number sense, not memorized as a fixed fact.

## Open questions / flags for the builder
None. This is a clean, non-overlapping gap in the current curriculum map — no existing lab touches 5.NF.1/5.NF.2 content, so there is no ambiguity about placement or duplication to resolve before building.
