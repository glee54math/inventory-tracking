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

---

## Approved changes (user, 2026-11-06) — these override anything above

- **Slot:** MG10, as `MG10_AddingAndSubtractingFractionsLab` (component export `AddingAndSubtractingFractionsLab`). MG10 is not yet in `LEVEL_SKILLS`; add it. Grade 5. No read-aloud, no `EarlyLearnerProvider` (MG6+ convention).
- **No `reintroEverySolved` anywhere.** Every unit has a one-time CFU gate only.
- **LCD is required and taught as a word.** Teach "LCD means least common denominator" in Unit 2 (Explore with a picture or list of multiples, plus a CFU question on it), and use the term the same way in Units 3–5. A common denominator that is NOT the least (e.g. 192 for 12 and 16, whose LCD is 48) is marked WRONG, with feedback that names the mistake ("192 is a common denominator, but not the least. Find the smallest number both 12 and 16 go into."). Practice and Test must include pairs where multiplying the denominators is NOT the LCD (4 & 6, 6 & 9, 8 & 12, 10 & 15, 12 & 16), not only co-prime pairs. Unit 2 bucket (c) is required.
- **Simplest form is required, as its own check.** An answer that is equal but not simplified (or an improper fraction where a mixed number is asked) is not accepted: the student is told "That's equal, but it's not in simplest form. Simplify it." and the solve does not count as clean. After such a solve, the student must do **"Try one like it"** (a fresh problem of the SAME type) and cannot move to a new problem until they solve one cleanly — the same retry lock the MK1 shell uses (`onRetrySame`, `owesRetry`, disabled problem-type switch, no side doors). Make this work for this lab without turning on full early-learner mode; extend shared code only additively.
- **"Borrow" is taught by name.** Unit 4 teaches what borrowing means here — take 1 whole from the whole-number part and turn it into fraction pieces (1 = 4/4), so 5 1/4 becomes 4 5/4 — in Explore with a picture, in a CFU question, and in every "Show me" for the borrowing problem types. Use "borrow" consistently (it may say once that this is also called regrouping).
- **Unit 3 bucket (f):** use an unlike-denominator example that lands on a whole number, e.g. 3/2 − 2/4 = 1.
- **Unit order is open.** The user wants the curriculum checker to judge whether Unit 5's benchmark/reasonableness work (or part of it) should come earlier.

## Round 5 (user, 2026-11-08) — these override Unit 1 above

- **Unit 1 is refocused on "you can't add across", using only what students bring in:** equivalent fractions (3.NF.3, 4.NF.1), adding like denominators (4.NF.3), and adding when one denominator fits in the other (4.NF.5, like 3/10 + 4/100). Students do NOT find a common denominator in Unit 1; that starts in Unit 2. The words "common denominator" and "LCD" are not used in Unit 1.
- **Practice problem "Find a + b":** 1. estimate (more or less than the bigger fraction, 1, or 2; the answer is picked first); 2. judge a named person's add-across answer (too small / more or less than the bigger or smaller fraction); 3–4. find the real sum. When one denominator fits in the other: rename one fraction (the picture shows the cut), then type the sum. When they share no factor: pick the picture of the sum, then count the same-size pieces and type it. "Who is right?" was dropped (step 2 covers it).
- **Buckets (replace (a)–(d) above):** one bottom fits in the other with a sum less than 1; one bottom fits with a sum of 1 or more (exactly 1 half the time); no shared factor, sum less than 1; no shared factor, sum more than 1. About a third of Unit 1 sums are more than 1, and about 1 in 8 is exactly 1.
- **Every typed fraction answer** has the line "Pick a format to write your answer." above the format buttons, and Unit 1 Explore shows the format guide (Unit 1 answers can now be whole or mixed numbers).
- **Add-across mistakes are named everywhere in Practice** (Units 1, 3, 4, 5), with a size check ("2/12 is less than 1/3, but adding should make a bigger number"); Units 1 and 3 also show the two bars. Tests never show it.
